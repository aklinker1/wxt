import { beforeEach, describe, expect, it } from 'vitest';
import { DevModeChange, detectDevChanges } from '../../../utils/building';
import {
  fakeBackgroundEntrypoint,
  fakeContentScriptEntrypoint,
  fakeFile,
  fakeGenericEntrypoint,
  fakeManifest,
  fakeOptionsEntrypoint,
  fakePopupEntrypoint,
  fakeOutputAsset,
  fakeOutputChunk,
  fakeWxt,
  setFakeWxt,
} from '../../../utils/testing/fake-objects';
import { BuildOutput, BuildStepOutput } from '../../../../types';
import { setWxtForTesting } from '../../../wxt';

describe('Detect Dev Changes', () => {
  beforeEach(() => {
    setWxtForTesting(fakeWxt());
  });

  describe('No changes', () => {
    it("should return 'no-change' when the changed file isn't used by any of the entrypoints", () => {
      const changes = ['/some/path.ts'];
      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [],
        steps: [
          {
            entrypoints: fakeContentScriptEntrypoint(),
            chunks: [fakeOutputChunk(), fakeOutputChunk()],
          },
          {
            entrypoints: fakeContentScriptEntrypoint(),
            chunks: [fakeOutputChunk(), fakeOutputChunk(), fakeOutputChunk()],
          },
        ],
      };

      const actual = detectDevChanges(changes, currentOutput);

      expect(actual).toEqual({ type: 'no-change' });
    });
  });

  describe('wxt.config.ts', () => {
    it("should return 'full-restart' when one of the changed files is the config file", () => {
      const configFile = '/root/wxt.config.ts';
      setFakeWxt({
        config: {
          userConfigMetadata: {
            configFile,
          },
        },
      });
      const changes = ['/root/src/public/image.svg', configFile];
      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [],
        steps: [],
      };
      const expected: DevModeChange = {
        type: 'full-restart',
      };

      const actual = detectDevChanges(changes, currentOutput);

      expect(actual).toEqual(expected);
    });
  });

  describe('modules/*', () => {
    it("should return 'full-restart' when one of the changed files is in the WXT modules folder", () => {
      const modulesDir = '/root/modules';
      setFakeWxt({
        config: {
          modulesDir,
        },
      });
      const changes = [
        '/root/src/public/image.svg',
        `${modulesDir}/example.ts`,
      ];
      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [],
        steps: [],
      };
      const expected: DevModeChange = {
        type: 'full-restart',
      };

      const actual = detectDevChanges(changes, currentOutput);

      expect(actual).toEqual(expected);
    });
  });

  describe('web-ext.config.ts', () => {
    it("should return 'browser-restart' when one of the changed files is the config file", () => {
      const runnerFile = '/root/web-ext.config.ts';
      setFakeWxt({
        config: {
          runnerConfig: {
            configFile: runnerFile,
          },
        },
      });
      const changes = ['/root/src/public/image.svg', runnerFile];
      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [],
        steps: [],
      };
      const expected: DevModeChange = {
        type: 'browser-restart',
      };

      const actual = detectDevChanges(changes, currentOutput);

      expect(actual).toEqual(expected);
    });
  });

  describe('Public Assets', () => {
    it("should return 'extension-reload' without any groups to rebuild when the changed file is a public asset", () => {
      const changes = ['/root/src/public/image.svg'];
      setFakeWxt({
        config: {
          publicDir: '/root/src/public',
        },
      });
      const asset1 = fakeOutputAsset({
        fileName: 'image.svg',
      });
      const asset2 = fakeOutputAsset({
        fileName: 'some-other-image.svg',
      });
      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [asset1, asset2],
        steps: [],
      };
      const expected: DevModeChange = {
        type: 'extension-reload',
        rebuildGroups: [],
        cachedOutput: currentOutput,
      };

      const actual = detectDevChanges(changes, currentOutput);

      expect(actual).toEqual(expected);
    });
  });

  describe('Background', () => {
    it("should rebuild the background and reload the extension when the changed file in it's chunks' `moduleIds` field", () => {
      const changedPath = '/root/utils/shared.ts';
      const contentScript = fakeContentScriptEntrypoint({
        inputPath: '/root/overlay.content.ts',
      });
      const background = fakeBackgroundEntrypoint({
        inputPath: '/root/background.ts',
      });

      const step1: BuildStepOutput = {
        entrypoints: contentScript,
        chunks: [
          fakeOutputChunk({
            moduleIds: [fakeFile(), fakeFile()],
          }),
        ],
      };
      const step2: BuildStepOutput = {
        entrypoints: background,
        chunks: [
          fakeOutputChunk({
            moduleIds: [fakeFile(), changedPath, fakeFile()],
          }),
        ],
      };

      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [],
        steps: [step1, step2],
      };
      const expected: DevModeChange = {
        type: 'extension-reload',
        cachedOutput: {
          ...currentOutput,
          steps: [step1],
        },
        rebuildGroups: [background],
      };

      const actual = detectDevChanges([changedPath], currentOutput);

      expect(actual).toEqual(expected);
    });
  });

  describe('HTML Pages', () => {
    it('should detect changes to entrypoints/<name>.html files', async () => {
      const changedPath = '/root/page1.html';
      const htmlPage1 = fakePopupEntrypoint({
        inputPath: changedPath,
      });
      const htmlPage2 = fakeOptionsEntrypoint({
        inputPath: '/root/page2.html',
      });
      const htmlPage3 = fakeGenericEntrypoint({
        type: 'sandbox',
        inputPath: '/root/page3.html',
      });

      const step1: BuildStepOutput = {
        entrypoints: [htmlPage1, htmlPage2],
        chunks: [
          fakeOutputAsset({
            fileName: 'page1.html',
          }),
        ],
      };
      const step2: BuildStepOutput = {
        entrypoints: [htmlPage3],
        chunks: [
          fakeOutputAsset({
            fileName: 'page2.html',
          }),
        ],
      };

      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [],
        steps: [step1, step2],
      };
      const expected: DevModeChange = {
        type: 'html-reload',
        cachedOutput: {
          ...currentOutput,
          steps: [step2],
        },
        rebuildGroups: [[htmlPage1, htmlPage2]],
      };

      const actual = detectDevChanges([changedPath], currentOutput);

      expect(actual).toEqual(expected);
    });

    it('should detect changes to entrypoints/<name>/index.html files', async () => {
      const changedPath = '/root/page1/index.html';
      const htmlPage1 = fakePopupEntrypoint({
        inputPath: changedPath,
      });
      const htmlPage2 = fakeOptionsEntrypoint({
        inputPath: '/root/page2/index.html',
      });
      const htmlPage3 = fakeGenericEntrypoint({
        type: 'sandbox',
        inputPath: '/root/page3/index.html',
      });

      const step1: BuildStepOutput = {
        entrypoints: [htmlPage1, htmlPage2],
        chunks: [
          fakeOutputAsset({
            fileName: 'page1.html',
          }),
        ],
      };
      const step2: BuildStepOutput = {
        entrypoints: [htmlPage3],
        chunks: [
          fakeOutputAsset({
            fileName: 'page2.html',
          }),
        ],
      };

      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [],
        steps: [step1, step2],
      };
      const expected: DevModeChange = {
        type: 'html-reload',
        cachedOutput: {
          ...currentOutput,
          steps: [step2],
        },
        rebuildGroups: [[htmlPage1, htmlPage2]],
      };

      const actual = detectDevChanges([changedPath], currentOutput);

      expect(actual).toEqual(expected);
    });
  });

  describe('Content Scripts', () => {
    it('should rebuild then reload only the effected content scripts', async () => {
      const changedPath = '/root/utils/shared.ts';
      const script1 = fakeContentScriptEntrypoint({
        inputPath: '/root/overlay1.content/index.ts',
      });
      const script2 = fakeContentScriptEntrypoint({
        inputPath: '/root/overlay2.ts',
      });
      const script3 = fakeContentScriptEntrypoint({
        inputPath: '/root/overlay3.content/index.ts',
      });

      const step1: BuildStepOutput = {
        entrypoints: script1,
        chunks: [
          fakeOutputChunk({
            moduleIds: [fakeFile(), changedPath],
          }),
        ],
      };
      const step2: BuildStepOutput = {
        entrypoints: script2,
        chunks: [
          fakeOutputChunk({
            moduleIds: [fakeFile(), fakeFile(), fakeFile()],
          }),
        ],
      };
      const step3: BuildStepOutput = {
        entrypoints: script3,
        chunks: [
          fakeOutputChunk({
            moduleIds: [changedPath, fakeFile(), fakeFile()],
          }),
        ],
      };

      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [],
        steps: [step1, step2, step3],
      };
      const expected: DevModeChange = {
        type: 'content-script-reload',
        cachedOutput: {
          ...currentOutput,
          steps: [step2],
        },
        changedSteps: [step1, step3],
        rebuildGroups: [script1, script3],
      };

      const actual = detectDevChanges([changedPath], currentOutput);

      expect(actual).toEqual(expected);
    });

    it('should detect changes to import files with `?suffix`', () => {
      const importedPath = '/root/utils/shared.css?inline';
      const changedPath = '/root/utils/shared.css';
      const script1 = fakeContentScriptEntrypoint({
        inputPath: '/root/overlay1.content/index.ts',
      });
      const script2 = fakeContentScriptEntrypoint({
        inputPath: '/root/overlay2.ts',
      });
      const script3 = fakeContentScriptEntrypoint({
        inputPath: '/root/overlay3.content/index.ts',
      });

      const step1: BuildStepOutput = {
        entrypoints: script1,
        chunks: [
          fakeOutputChunk({
            moduleIds: [fakeFile(), importedPath],
          }),
        ],
      };
      const step2: BuildStepOutput = {
        entrypoints: script2,
        chunks: [
          fakeOutputChunk({
            moduleIds: [fakeFile(), fakeFile(), fakeFile()],
          }),
        ],
      };
      const step3: BuildStepOutput = {
        entrypoints: script3,
        chunks: [
          fakeOutputChunk({
            moduleIds: [importedPath, fakeFile(), fakeFile()],
          }),
        ],
      };

      const currentOutput: BuildOutput = {
        manifest: fakeManifest(),
        publicAssets: [],
        steps: [step1, step2, step3],
      };
      const expected: DevModeChange = {
        type: 'content-script-reload',
        cachedOutput: {
          ...currentOutput,
          steps: [step2],
        },
        changedSteps: [step1, step3],
        rebuildGroups: [script1, script3],
      };

      const actual = detectDevChanges([changedPath], currentOutput);

      expect(actual).toEqual(expected);
    });
  });
});
