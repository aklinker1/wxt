import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import {
  BackgroundEntrypoint,
  BackgroundEntrypointOptions,
  BaseEntrypointOptions,
  ContentScriptEntrypoint,
  GenericEntrypoint,
  OptionsEntrypoint,
  PopupEntrypoint,
  SidepanelEntrypoint,
} from '~/types';
import { resolve } from 'path';
import { findEntrypoints } from '../find-entrypoints';
import fs from 'fs-extra';
import glob from 'fast-glob';
import {
  fakeResolvedConfig,
  setFakeWxt,
} from '~/core/utils/testing/fake-objects';
import { unnormalizePath } from '~/core/utils/paths';
import { wxt } from '~/core/wxt';

vi.mock('fast-glob');
const globMock = vi.mocked(glob);

vi.mock('fs-extra');
const readFileMock = vi.mocked(
  fs.readFile as (path: string) => Promise<string>,
);

describe('findEntrypoints', () => {
  const config = fakeResolvedConfig({
    manifestVersion: 3,
    root: '/',
    entrypointsDir: resolve('/src/entrypoints'),
    outDir: resolve('.output'),
    command: 'build',
  });
  let importEntrypointMock: Mock;

  beforeEach(() => {
    setFakeWxt({ config });
    importEntrypointMock = vi.mocked(wxt.builder.importEntrypoint);
    importEntrypointMock.one = 1;
  });

  it.each<[string, string, PopupEntrypoint]>([
    [
      'popup.html',
      `
        <html>
          <head>
            <meta name="manifest.default_icon" content="{ '16': '/icon/16.png' }" />
            <title>Default Title</title>
          </head>
        </html>
      `,
      {
        type: 'popup',
        name: 'popup',
        inputPath: resolve(config.entrypointsDir, 'popup.html'),
        outputDir: config.outDir,
        options: {
          defaultIcon: { '16': '/icon/16.png' },
          defaultTitle: 'Default Title',
        },
        skipped: false,
      },
    ],
    [
      'popup/index.html',
      `
        <html>
          <head>
            <title>Title</title>
          </head>
        </html>
      `,
      {
        type: 'popup',
        name: 'popup',
        inputPath: resolve(config.entrypointsDir, 'popup/index.html'),
        outputDir: config.outDir,
        options: {
          defaultTitle: 'Title',
        },
        skipped: false,
      },
    ],
  ])(
    'should find and load popup entrypoint config from %s',
    async (path, content, expected) => {
      globMock.mockResolvedValueOnce([path]);
      readFileMock.mockResolvedValueOnce(content);

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toHaveLength(1);
      expect(entrypoints[0]).toEqual(expected);
    },
  );

  it.each<[string, string, OptionsEntrypoint]>([
    [
      'options.html',
      `
        <html>
          <head>
            <title>Default Title</title>
          </head>
        </html>
      `,
      {
        type: 'options',
        name: 'options',
        inputPath: resolve(config.entrypointsDir, 'options.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'options/index.html',
      `
        <html>
          <head>
            <meta name="manifest.open_in_tab" content="true" />
            <title>Title</title>
          </head>
        </html>
      `,
      {
        type: 'options',
        name: 'options',
        inputPath: resolve(config.entrypointsDir, 'options/index.html'),
        outputDir: config.outDir,
        options: {
          openInTab: true,
        },
        skipped: false,
      },
    ],
  ])(
    'should find and load options entrypoint config from %s',
    async (path, content, expected) => {
      globMock.mockResolvedValueOnce([path]);
      readFileMock.mockResolvedValueOnce(content);

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toHaveLength(1);
      expect(entrypoints[0]).toEqual(expected);
    },
  );

  it.each<[string, Omit<ContentScriptEntrypoint, 'options'>]>([
    [
      'content.ts',
      {
        type: 'content-script',
        name: 'content',
        inputPath: resolve(config.entrypointsDir, 'content.ts'),
        outputDir: resolve(config.outDir, 'content-scripts'),
        skipped: false,
      },
    ],
    [
      'overlay.content.ts',
      {
        type: 'content-script',
        name: 'overlay',
        inputPath: resolve(config.entrypointsDir, 'overlay.content.ts'),
        outputDir: resolve(config.outDir, 'content-scripts'),
        skipped: false,
      },
    ],
    [
      'content/index.ts',
      {
        type: 'content-script',
        name: 'content',
        inputPath: resolve(config.entrypointsDir, 'content/index.ts'),
        outputDir: resolve(config.outDir, 'content-scripts'),
        skipped: false,
      },
    ],
    [
      'overlay.content/index.ts',
      {
        type: 'content-script',
        name: 'overlay',
        inputPath: resolve(config.entrypointsDir, 'overlay.content/index.ts'),
        outputDir: resolve(config.outDir, 'content-scripts'),
        skipped: false,
      },
    ],
    [
      'overlay.content.tsx',
      {
        type: 'content-script',
        name: 'overlay',
        inputPath: resolve(config.entrypointsDir, 'overlay.content.tsx'),
        outputDir: resolve(config.outDir, 'content-scripts'),
        skipped: false,
      },
    ],
  ])(
    'should find and load content script entrypoint config from %s',
    async (path, expected) => {
      const options: ContentScriptEntrypoint['options'] = {
        matches: ['<all_urls>'],
      };
      globMock.mockResolvedValueOnce([path]);
      importEntrypointMock.mockResolvedValue(options);

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toHaveLength(1);
      expect(entrypoints[0]).toEqual({ ...expected, options });
      expect(importEntrypointMock).toBeCalledWith(expected.inputPath);
    },
  );

  it.each<[string, Omit<BackgroundEntrypoint, 'options'>]>([
    [
      'background.ts',
      {
        type: 'background',
        name: 'background',
        inputPath: resolve(config.entrypointsDir, 'background.ts'),
        outputDir: config.outDir,
        skipped: false,
      },
    ],
    [
      'background/index.ts',
      {
        type: 'background',
        name: 'background',
        inputPath: resolve(config.entrypointsDir, 'background/index.ts'),
        outputDir: config.outDir,
        skipped: false,
      },
    ],
  ])(
    'should find and load background entrypoint config from %s',
    async (path, expected) => {
      const options: BackgroundEntrypointOptions = {
        type: 'module',
      };
      globMock.mockResolvedValueOnce([path]);
      importEntrypointMock.mockResolvedValue(options);

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toHaveLength(1);
      expect(entrypoints[0]).toEqual({ ...expected, options });
      expect(importEntrypointMock).toBeCalledWith(expected.inputPath);
    },
  );

  it.each<[string, string, SidepanelEntrypoint]>([
    [
      'sidepanel.html',
      `
        <html>
          <head>
            <title>Default Title</title>
            <meta name="manifest.default_icon" content="{ '16': '/icon/16.png' }" />
            <meta name="manifest.open_at_install" content="true" />
          </head>
        </html>
      `,
      {
        type: 'sidepanel',
        name: 'sidepanel',
        inputPath: resolve(config.entrypointsDir, 'sidepanel.html'),
        outputDir: config.outDir,
        options: {
          defaultTitle: 'Default Title',
          defaultIcon: { '16': '/icon/16.png' },
          openAtInstall: true,
        },
        skipped: false,
      },
    ],
    [
      'sidepanel/index.html',
      `<html></html>`,
      {
        type: 'sidepanel',
        name: 'sidepanel',
        inputPath: resolve(config.entrypointsDir, 'sidepanel/index.html'),
        options: {},
        outputDir: config.outDir,
        skipped: false,
      },
    ],
    [
      'named.sidepanel.html',
      `<html></html>`,
      {
        type: 'sidepanel',
        name: 'named',
        inputPath: resolve(config.entrypointsDir, 'named.sidepanel.html'),
        options: {},
        outputDir: config.outDir,
        skipped: false,
      },
    ],
    [
      'named.sidepanel/index.html',
      `<html></html>`,
      {
        type: 'sidepanel',
        name: 'named',
        inputPath: resolve(config.entrypointsDir, 'named.sidepanel/index.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
  ])(
    'should find and load sidepanel entrypoint config from %s',
    async (path, content, expected) => {
      globMock.mockResolvedValueOnce([path]);
      readFileMock.mockResolvedValueOnce(content);

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toHaveLength(1);
      expect(entrypoints[0]).toEqual(expected);
    },
  );

  it('should remove type=module from MV2 background scripts', async () => {
    setFakeWxt({
      config: {
        manifestVersion: 2,
      },
      builder: wxt.builder,
    });
    const options: BackgroundEntrypointOptions = {
      type: 'module',
    };
    globMock.mockResolvedValueOnce(['background.ts']);
    importEntrypointMock.mockResolvedValue(options);

    const entrypoints = await findEntrypoints();

    expect(entrypoints[0].options).toEqual({});
  });

  it('should allow type=module for MV3 background service workers', async () => {
    setFakeWxt({
      config: {
        manifestVersion: 3,
      },
      builder: wxt.builder,
    });
    const options: BackgroundEntrypointOptions = {
      type: 'module',
    };
    globMock.mockResolvedValueOnce(['background.ts']);
    importEntrypointMock.mockResolvedValue(options);

    const entrypoints = await findEntrypoints();

    expect(entrypoints[0].options).toEqual(options);
  });

  it("should include a virtual background script so dev reloading works when there isn't a background entrypoint defined by the user", async () => {
    setFakeWxt({
      config: {
        ...config,
        command: 'serve',
      },
      builder: wxt.builder,
    });
    globMock.mockResolvedValueOnce(['popup.html']);

    const entrypoints = await findEntrypoints();

    expect(entrypoints).toHaveLength(2);
    expect(entrypoints).toContainEqual({
      type: 'background',
      inputPath: 'virtual:user-background',
      name: 'background',
      options: {},
      outputDir: config.outDir,
      skipped: false,
    });
  });

  it.each<string>([
    'injected.ts',
    'injected.tsx',
    'injected.js',
    'injected.jsx',
    'injected/index.ts',
    'injected/index.tsx',
    'injected/index.js',
    'injected/index.jsx',
  ])(
    'should find and load unlisted-script entrypoint config from %s',
    async (path) => {
      const expected = {
        type: 'unlisted-script',
        name: 'injected',
        inputPath: resolve(config.entrypointsDir, path),
        outputDir: config.outDir,
        skipped: false,
      };
      const options: BaseEntrypointOptions = {};
      globMock.mockResolvedValueOnce([path]);
      importEntrypointMock.mockResolvedValue(options);

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toHaveLength(1);
      expect(entrypoints[0]).toEqual({ ...expected, options });
      expect(importEntrypointMock).toBeCalledWith(expected.inputPath);
    },
  );

  it.each<[string, GenericEntrypoint]>([
    // Sandbox
    [
      'sandbox.html',
      {
        type: 'sandbox',
        name: 'sandbox',
        inputPath: resolve(config.entrypointsDir, 'sandbox.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'sandbox/index.html',
      {
        type: 'sandbox',
        name: 'sandbox',
        inputPath: resolve(config.entrypointsDir, 'sandbox/index.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'named.sandbox.html',
      {
        type: 'sandbox',
        name: 'named',
        inputPath: resolve(config.entrypointsDir, 'named.sandbox.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'named.sandbox/index.html',
      {
        type: 'sandbox',
        name: 'named',
        inputPath: resolve(config.entrypointsDir, 'named.sandbox/index.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],

    // bookmarks
    [
      'bookmarks.html',
      {
        type: 'bookmarks',
        name: 'bookmarks',
        inputPath: resolve(config.entrypointsDir, 'bookmarks.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'bookmarks/index.html',
      {
        type: 'bookmarks',
        name: 'bookmarks',
        inputPath: resolve(config.entrypointsDir, 'bookmarks/index.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],

    // history
    [
      'history.html',
      {
        type: 'history',
        name: 'history',
        inputPath: resolve(config.entrypointsDir, 'history.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'history/index.html',
      {
        type: 'history',
        name: 'history',
        inputPath: resolve(config.entrypointsDir, 'history/index.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],

    // newtab
    [
      'newtab.html',
      {
        type: 'newtab',
        name: 'newtab',
        inputPath: resolve(config.entrypointsDir, 'newtab.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'newtab/index.html',
      {
        type: 'newtab',
        name: 'newtab',
        inputPath: resolve(config.entrypointsDir, 'newtab/index.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],

    // devtools
    [
      'devtools.html',
      {
        type: 'devtools',
        name: 'devtools',
        inputPath: resolve(config.entrypointsDir, 'devtools.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'devtools/index.html',
      {
        type: 'devtools',
        name: 'devtools',
        inputPath: resolve(config.entrypointsDir, 'devtools/index.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],

    // unlisted-page
    [
      'onboarding.html',
      {
        type: 'unlisted-page',
        name: 'onboarding',
        inputPath: resolve(config.entrypointsDir, 'onboarding.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'onboarding/index.html',
      {
        type: 'unlisted-page',
        name: 'onboarding',
        inputPath: resolve(config.entrypointsDir, 'onboarding/index.html'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],

    // unlisted-style
    [
      'iframe.scss',
      {
        type: 'unlisted-style',
        name: 'iframe',
        inputPath: resolve(config.entrypointsDir, 'iframe.scss'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],
    [
      'iframe.css',
      {
        type: 'unlisted-style',
        name: 'iframe',
        inputPath: resolve(config.entrypointsDir, 'iframe.css'),
        outputDir: config.outDir,
        options: {},
        skipped: false,
      },
    ],

    // content-script-style
    [
      'content.css',
      {
        type: 'content-script-style',
        name: 'content',
        inputPath: resolve(config.entrypointsDir, 'content.css'),
        outputDir: resolve(config.outDir, 'content-scripts'),
        options: {},
        skipped: false,
      },
    ],
    [
      'overlay.content.css',
      {
        type: 'content-script-style',
        name: 'overlay',
        inputPath: resolve(config.entrypointsDir, 'overlay.content.css'),
        outputDir: resolve(config.outDir, 'content-scripts'),
        options: {},
        skipped: false,
      },
    ],
    [
      'content/index.css',
      {
        type: 'content-script-style',
        name: 'content',
        inputPath: resolve(config.entrypointsDir, 'content/index.css'),
        outputDir: resolve(config.outDir, 'content-scripts'),
        options: {},
        skipped: false,
      },
    ],
    [
      'overlay.content/index.css',
      {
        type: 'content-script-style',
        name: 'overlay',
        inputPath: resolve(config.entrypointsDir, 'overlay.content/index.css'),
        outputDir: resolve(config.outDir, 'content-scripts'),
        options: {},
        skipped: false,
      },
    ],
  ])('should find entrypoint for %s', async (path, expected) => {
    globMock.mockResolvedValueOnce([path]);

    const entrypoints = await findEntrypoints();

    expect(entrypoints).toHaveLength(1);
    expect(entrypoints[0]).toEqual(expected);
  });

  it('should not allow multiple entrypoints with the same name', async () => {
    globMock.mockResolvedValueOnce([
      'options/index.html',
      'options/index.jsx',
      'popup.html',
      'popup/index.html',
      'popup/index.ts',
      'ui.html',
    ]);

    await expect(() => findEntrypoints()).rejects.toThrowError(
      [
        'Multiple entrypoints with the same name detected, only one entrypoint for each name is allowed.',
        '',
        '- options',
        `  - ${unnormalizePath('src/entrypoints/options/index.html')}`,
        `  - ${unnormalizePath('src/entrypoints/options/index.jsx')}`,
        '- popup',
        `  - ${unnormalizePath('src/entrypoints/popup.html')}`,
        `  - ${unnormalizePath('src/entrypoints/popup/index.html')}`,
        `  - ${unnormalizePath('src/entrypoints/popup/index.ts')}`,
      ].join('\n'),
    );
  });

  it('throw an error if there are no entrypoints', async () => {
    globMock.mockResolvedValueOnce([]);

    await expect(() => findEntrypoints()).rejects.toThrowError(
      `No entrypoints found in ${unnormalizePath(config.entrypointsDir)}`,
    );
  });

  describe('include option', () => {
    it("should filter out the background when include doesn't contain the target browser", async () => {
      globMock.mockResolvedValueOnce(['background.ts']);
      importEntrypointMock.mockResolvedValue({
        include: ['not' + config.browser],
      });

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });

    it("should filter out content scripts when include doesn't contain the target browser", async () => {
      globMock.mockResolvedValueOnce(['example.content.ts']);
      importEntrypointMock.mockResolvedValue({
        include: ['not' + config.browser],
      });

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });

    it("should filter out the popup when include doesn't contain the target browser", async () => {
      globMock.mockResolvedValueOnce(['popup.html']);
      readFileMock.mockResolvedValueOnce(
        `<html>
          <head>
            <meta name="manifest.include" content="['${
              'not' + config.browser
            }']" />
          </head>
        </html>`,
      );

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });

    it("should filter out the options page when include doesn't contain the target browser", async () => {
      globMock.mockResolvedValueOnce(['options.html']);
      readFileMock.mockResolvedValueOnce(
        `<html>
          <head>
            <meta name="manifest.include" content="['${
              'not' + config.browser
            }']" />
          </head>
        </html>`,
      );

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });

    it("should filter out an unlisted page when include doesn't contain the target browser", async () => {
      globMock.mockResolvedValueOnce(['unlisted.html']);
      readFileMock.mockResolvedValueOnce(
        `<html>
          <head>
            <meta name="manifest.include" content="['${
              'not' + config.browser
            }']" />
          </head>
        </html>`,
      );

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });
  });

  describe('exclude option', () => {
    it('should filter out the background when exclude contains the target browser', async () => {
      globMock.mockResolvedValueOnce(['background.ts']);
      importEntrypointMock.mockResolvedValue({
        exclude: [config.browser],
      });

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });

    it('should filter out content scripts when exclude contains the target browser', async () => {
      globMock.mockResolvedValueOnce(['example.content.ts']);
      importEntrypointMock.mockResolvedValue({
        exclude: [config.browser],
      });

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });

    it('should filter out the popup when exclude contains the target browser', async () => {
      globMock.mockResolvedValueOnce(['popup.html']);
      readFileMock.mockResolvedValueOnce(
        `<html>
          <head>
            <meta name="manifest.exclude" content="['${config.browser}']" />
          </head>
        </html>`,
      );

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });

    it('should filter out the options page when exclude contains the target browser', async () => {
      globMock.mockResolvedValueOnce(['options.html']);
      readFileMock.mockResolvedValueOnce(
        `<html>
          <head>
            <meta name="manifest.exclude" content="['${config.browser}']" />
          </head>
        </html>`,
      );

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });

    it('should filter out an unlisted page when exclude contains the target browser', async () => {
      globMock.mockResolvedValueOnce(['unlisted.html']);
      readFileMock.mockResolvedValueOnce(
        `<html>
          <head>
            <meta name="manifest.exclude" content="['${config.browser}']" />
          </head>
        </html>`,
      );

      const entrypoints = await findEntrypoints();

      expect(entrypoints).toEqual([]);
    });
  });

  describe('filterEntrypoints option', () => {
    it('should control entrypoints accessible', async () => {
      globMock.mockResolvedValue([
        'options/index.html',
        'popup/index.html',
        'ui.content/index.ts',
        'injected.content/index.ts',
      ]);
      const filterEntrypoints = ['popup', 'ui'];
      setFakeWxt({
        config: {
          root: '/',
          entrypointsDir: resolve('/src/entrypoints'),
          outDir: resolve('.output'),
          command: 'build',
          filterEntrypoints: new Set(filterEntrypoints),
        },
        builder: wxt.builder,
      });

      importEntrypointMock.mockResolvedValue({});

      const entrypoints = await findEntrypoints();
      const names = entrypoints.map((item) => item.name);
      expect(names).toHaveLength(2);
      expect(names).toEqual(filterEntrypoints);
    });
  });
});
