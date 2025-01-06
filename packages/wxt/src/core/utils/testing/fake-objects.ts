/**
 * SHOULD ONLY BE IMPORTED IN TESTS.
 */
import { resolve } from 'path';
import { faker } from '@faker-js/faker';
import merge from 'lodash.merge';
import {
  FsCache,
  ResolvedConfig,
  WxtDevServer,
  BackgroundEntrypoint,
  ContentScriptEntrypoint,
  GenericEntrypoint,
  OptionsEntrypoint,
  PopupEntrypoint,
  OutputChunk,
  OutputFile,
  OutputAsset,
  BuildOutput,
  BuildStepOutput,
  UserManifest,
  Wxt,
  SidepanelEntrypoint,
  BaseEntrypoint,
} from '../../../types';
import { mock } from 'vitest-mock-extended';
import { vi } from 'vitest';
import { setWxtForTesting } from '../../../core/wxt';

faker.seed(import.meta.test.SEED);

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
function fakeObjectCreator<T>(base: () => T) {
  return (overrides?: DeepPartial<T>): T => merge(base(), overrides);
}

export function fakeFileName(): string {
  return faker.string.alphanumeric() + '.' + faker.string.alpha({ length: 3 });
}

export function fakeFile(root = process.cwd()): string {
  return resolve(root, fakeFileName());
}

export function fakeDir(root = process.cwd()): string {
  return resolve(root, faker.string.alphanumeric());
}

export const fakeEntrypoint = (options?: DeepPartial<BaseEntrypoint>) =>
  faker.helpers.arrayElement([
    fakePopupEntrypoint,
    fakeGenericEntrypoint,
    fakeOptionsEntrypoint,
    fakeBackgroundEntrypoint,
    fakeContentScriptEntrypoint,
    fakeUnlistedScriptEntrypoint,
  ])(options);

export const fakeContentScriptEntrypoint =
  fakeObjectCreator<ContentScriptEntrypoint>(() => ({
    type: 'content-script',
    inputPath: fakeFile('src'),
    name: faker.string.alpha(),
    options: {
      matches: [],
      matchAboutBlank: faker.datatype.boolean(),
      matchOriginAsFallback: faker.helpers.arrayElement([
        true,
        false,
        undefined,
      ]),
      runAt: faker.helpers.arrayElement([
        'document_start',
        'document_end',
        'document_idle',
        undefined,
      ]),
    },
    outputDir: fakeDir('.output'),
    skipped: faker.datatype.boolean(),
  }));

export const fakeBackgroundEntrypoint = fakeObjectCreator<BackgroundEntrypoint>(
  () => ({
    type: 'background',
    inputPath: 'entrypoints/background.ts',
    name: 'background',
    options: {
      persistent: faker.datatype.boolean(),
      type: faker.helpers.maybe(() => 'module'),
    },
    outputDir: fakeDir('.output'),
    skipped: faker.datatype.boolean(),
  }),
);

export const fakeUnlistedScriptEntrypoint =
  fakeObjectCreator<GenericEntrypoint>(() => ({
    type: 'unlisted-script',
    inputPath: fakeFile('src'),
    name: faker.string.alpha(),
    outputDir: fakeDir('.output'),
    options: {},
    skipped: faker.datatype.boolean(),
  }));

export const fakeOptionsEntrypoint = fakeObjectCreator<OptionsEntrypoint>(
  () => ({
    type: 'options',
    inputPath: 'entrypoints/options.html',
    name: 'options',
    outputDir: fakeDir('.output'),
    options: {
      browserStyle: faker.datatype.boolean(),
      chromeStyle: faker.datatype.boolean(),
      openInTab: faker.datatype.boolean(),
    },
    skipped: faker.datatype.boolean(),
  }),
);

export const fakePopupEntrypoint = fakeObjectCreator<PopupEntrypoint>(() => ({
  type: 'popup',
  inputPath: 'entrypoints/popup.html',
  name: 'popup',
  outputDir: fakeDir('.output'),
  options: {
    defaultTitle: faker.helpers.arrayElement([
      faker.person.fullName(),
      undefined,
    ]),
    defaultIcon: faker.helpers.arrayElement([
      {
        '16': 'icon/16.png',
        '24': 'icon/24.png',
        '64': 'icon/64.png',
      },
    ]),
    mv2Key: faker.helpers.arrayElement([
      'browser_action',
      'page_action',
      undefined,
    ]),
  },
  skipped: faker.datatype.boolean(),
}));

export const fakeSidepanelEntrypoint = fakeObjectCreator<SidepanelEntrypoint>(
  () => ({
    type: 'sidepanel',
    inputPath: 'entrypoints/sidepanel.html',
    name: 'sidepanel',
    outputDir: fakeDir('.output'),
    options: {
      defaultTitle: faker.helpers.arrayElement([
        faker.person.fullName(),
        undefined,
      ]),
      defaultIcon: faker.helpers.arrayElement([
        {
          '16': 'icon/16.png',
          '24': 'icon/24.png',
          '64': 'icon/64.png',
        },
      ]),
      openAtInstall: faker.helpers.arrayElement([true, false, undefined]),
    },
    skipped: faker.datatype.boolean(),
  }),
);

export const fakeGenericEntrypoint = fakeObjectCreator<GenericEntrypoint>(
  () => ({
    type: faker.helpers.arrayElement([
      'sandbox',
      'bookmarks',
      'history',
      'newtab',
      'devtools',
      'unlisted-page',
      'unlisted-script',
    ]),
    inputPath: fakeFile('src'),
    name: faker.string.alpha(),
    outputDir: fakeDir('.output'),
    options: {},
    skipped: faker.datatype.boolean(),
  }),
);

export const fakeOutputChunk = fakeObjectCreator<OutputChunk>(() => ({
  type: 'chunk',
  fileName: faker.string.alphanumeric(),
  moduleIds: [],
}));

export const fakeOutputAsset = fakeObjectCreator<OutputAsset>(() => ({
  type: 'asset',
  fileName: fakeFileName(),
}));

export function fakeOutputFile(): OutputFile {
  return faker.helpers.arrayElement([fakeOutputAsset(), fakeOutputChunk()]);
}

export const fakeManifest = fakeObjectCreator<chrome.runtime.Manifest>(() => ({
  manifest_version: faker.helpers.arrayElement([2, 3]),
  name: faker.string.alphanumeric(),
  version: `${faker.number.int()}.${faker.number.int()}.${faker.number.int()}`,
}));

export const fakeUserManifest = fakeObjectCreator<UserManifest>(() => ({
  name: faker.string.alphanumeric(),
  version: `${faker.number.int()}.${faker.number.int()}.${faker.number.int()}`,
}));

export function fakeArray<T>(createItem: () => T, count = 3): T[] {
  const array: T[] = [];
  for (let i = 0; i < count; i++) {
    array.push(createItem());
  }
  return array;
}

export const fakeResolvedConfig = fakeObjectCreator<ResolvedConfig>(() => {
  const browser = faker.helpers.arrayElement(['chrome', 'firefox']);
  const command = faker.helpers.arrayElement(['build', 'serve'] as const);
  const manifestVersion = faker.helpers.arrayElement([2, 3] as const);
  const mode = faker.helpers.arrayElement(['development', 'production']);

  return {
    browser,
    command,
    entrypointsDir: fakeDir(),
    modulesDir: fakeDir(),
    builtinModules: [],
    userModules: [],
    env: { browser, command, manifestVersion, mode },
    fsCache: mock<FsCache>(),
    imports: {
      disabled: faker.datatype.boolean(),
      eslintrc: {
        enabled: faker.helpers.arrayElement([false, 8, 9]),
        filePath: fakeFile(),
        globalsPropValue: faker.helpers.arrayElement([
          true,
          false,
          'readable',
          'readonly',
          'writable',
          'writeable',
        ] as const),
      },
    },
    logger: mock(),
    manifest: fakeUserManifest(),
    manifestVersion,
    mode,
    outBaseDir: fakeDir(),
    outDir: fakeDir(),
    publicDir: fakeDir(),
    root: fakeDir(),
    wxtModuleDir: fakeDir(),
    runnerConfig: {
      config: {},
    },
    debug: faker.datatype.boolean(),
    srcDir: fakeDir(),
    typesDir: fakeDir(),
    wxtDir: fakeDir(),
    analysis: {
      enabled: false,
      open: false,
      template: 'treemap',
      outputFile: fakeFile(),
      outputDir: fakeDir(),
      outputName: 'stats',
      keepArtifacts: false,
    },
    zip: {
      artifactTemplate: '{{name}}-{{version}}.zip',
      includeSources: [],
      excludeSources: [],
      exclude: [],
      sourcesRoot: fakeDir(),
      sourcesTemplate: '{{name}}-sources.zip',
      name: faker.person.firstName().toLowerCase(),
      downloadedPackagesDir: fakeDir(),
      downloadPackages: [],
      compressionLevel: 9,
      zipSources: false,
    },
    userConfigMetadata: {},
    alias: {},
    experimental: {},
    dev: {
      reloadCommand: 'Alt+R',
    },
    hooks: {},
    vite: () => ({}),
    plugins: [],
  };
});

export const fakeWxt = fakeObjectCreator<Wxt>(() => ({
  config: fakeResolvedConfig(),
  hook: vi.fn(),
  hooks: mock(),
  logger: mock(),
  reloadConfig: vi.fn(),
  pm: mock(),
  server: faker.helpers.arrayElement([undefined, fakeWxtDevServer()]),
  builder: mock(),
}));

export const fakeWxtDevServer = fakeObjectCreator<WxtDevServer>(() => ({
  currentOutput: fakeBuildOutput(),
  hostname: 'localhost',
  origin: 'http://localhost:3000',
  port: 3000,
  reloadContentScript: vi.fn(),
  reloadExtension: vi.fn(),
  reloadPage: vi.fn(),
  restart: vi.fn(),
  restartBrowser: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  transformHtml: vi.fn(),
  watcher: mock(),
  ws: mock(),
}));

export function setFakeWxt(overrides?: DeepPartial<Wxt>) {
  const wxt = fakeWxt(overrides);
  setWxtForTesting(wxt);
  return wxt;
}

export const fakeBuildOutput = fakeObjectCreator<BuildOutput>(() => ({
  manifest: fakeManifest(),
  publicAssets: fakeArray(fakeOutputAsset),
  steps: fakeArray(fakeBuildStepOutput),
}));

export const fakeBuildStepOutput = fakeObjectCreator<BuildStepOutput>(() => ({
  chunks: fakeArray(fakeOutputChunk),
  entrypoints: fakeArray(fakeEntrypoint),
}));

export const fakeManifestCommand = fakeObjectCreator<chrome.commands.Command>(
  () => ({
    description: faker.string.sample(),
    suggested_key: {
      default: `${faker.helpers.arrayElement(['ctrl', 'alt'])}+${faker.number.int(
        {
          min: 0,
          max: 9,
        },
      )}`,
    },
  }),
);

export const fakeDevServer = fakeObjectCreator<WxtDevServer>(() => ({
  hostname: 'localhost',
  origin: 'http://localhost',
  port: 5173,
  reloadContentScript: vi.fn(),
  reloadExtension: vi.fn(),
  reloadPage: vi.fn(),
  restart: vi.fn(),
  restartBrowser: vi.fn(),
  stop: vi.fn(),
  start: vi.fn(),
  watcher: mock(),
  transformHtml: vi.fn(),
  ws: mock(),
  currentOutput: undefined,
}));
