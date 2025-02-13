import { beforeEach, describe, expect, it } from 'vitest';
import { generateManifest, stripPathFromMatchPattern } from '../manifest';
import {
  fakeArray,
  fakeBackgroundEntrypoint,
  fakeBuildOutput,
  fakeContentScriptEntrypoint,
  fakeEntrypoint,
  fakeManifestCommand,
  fakeOptionsEntrypoint,
  fakePopupEntrypoint,
  fakeSidepanelEntrypoint,
  fakeWxtDevServer,
  setFakeWxt,
} from '../testing/fake-objects';
import { Manifest } from 'webextension-polyfill';
import {
  BuildOutput,
  ContentScriptEntrypoint,
  Entrypoint,
  OutputAsset,
} from '../../../types';
import { wxt } from '../../wxt';
import { mock } from 'vitest-mock-extended';

const outDir = '/output';
const contentScriptOutDir = '/output/content-scripts';

describe('Manifest Utils', () => {
  beforeEach(() => {
    setFakeWxt();
  });

  describe('generateManifest', () => {
    describe('popup', () => {
      type ActionType = 'browser_action' | 'page_action';
      const popupEntrypoint = (type?: ActionType) =>
        fakePopupEntrypoint({
          options: {
            // @ts-expect-error: Force this to be undefined instead of inheriting the random value
            mv2Key: type ?? null,
            defaultIcon: {
              '16': '/icon/16.png',
            },
            defaultTitle: 'Default Iitle',
          },
          outputDir: outDir,
          skipped: false,
        });

      it('should include an action for mv3', async () => {
        const popup = popupEntrypoint();
        const buildOutput = fakeBuildOutput();

        setFakeWxt({
          config: {
            manifestVersion: 3,
            outDir,
          },
        });
        const expected: Partial<Manifest.WebExtensionManifest> = {
          action: {
            default_icon: popup.options.defaultIcon,
            default_title: popup.options.defaultTitle,
            default_popup: 'popup.html',
          },
        };

        const { manifest: actual } = await generateManifest(
          [popup],
          buildOutput,
        );

        expect(actual).toMatchObject(expected);
      });

      it.each<{
        inputType: ActionType | undefined;
        expectedType: ActionType;
      }>([
        { inputType: undefined, expectedType: 'browser_action' },
        { inputType: 'browser_action', expectedType: 'browser_action' },
        { inputType: 'page_action', expectedType: 'page_action' },
      ])(
        'should use the correct action for mv2: %j',
        async ({ inputType, expectedType }) => {
          const popup = popupEntrypoint(inputType);
          const buildOutput = fakeBuildOutput();
          setFakeWxt({
            config: {
              manifestVersion: 2,
              outDir,
            },
          });
          const expected = {
            default_icon: popup.options.defaultIcon,
            default_title: popup.options.defaultTitle,
            default_popup: 'popup.html',
          };

          const { manifest: actual } = await generateManifest(
            [popup],
            buildOutput,
          );

          expect(actual[expectedType]).toEqual(expected);
        },
      );
    });

    describe('action without popup', () => {
      it('should respect the action field in the manifest without a popup', async () => {
        const buildOutput = fakeBuildOutput();
        setFakeWxt({
          config: {
            outDir,
            manifestVersion: 3,
            manifest: {
              action: {
                default_icon: 'icon-16.png',
                default_title: 'Example title',
              },
            },
          },
        });

        const { manifest: actual } = await generateManifest([], buildOutput);

        expect(actual.action).toEqual(wxt.config.manifest.action);
        expect(actual.browser_action).toBeUndefined();
        expect(actual.page_action).toBeUndefined();
      });

      it('should generate `browser_action` for MV2 when only `action` is defined', async () => {
        const buildOutput = fakeBuildOutput();
        setFakeWxt({
          config: {
            outDir,
            manifestVersion: 2,
            manifest: {
              action: {
                default_title: 'Action',
              },
            },
          },
        });

        const { manifest: actual } = await generateManifest([], buildOutput);

        expect(actual.action).toBeUndefined();
        expect(actual.browser_action).toEqual(wxt.config.manifest.action);
        expect(actual.page_action).toBeUndefined();
      });

      it('should keep the `page_action` for MV2 when both `action` and `page_action` are defined', async () => {
        const buildOutput = fakeBuildOutput();
        setFakeWxt({
          config: {
            outDir,
            manifestVersion: 2,
            manifest: {
              action: {
                default_title: 'Action',
              },
              page_action: {
                default_title: 'Page Action',
              },
            },
          },
        });

        const { manifest: actual } = await generateManifest([], buildOutput);

        expect(actual.action).toBeUndefined();
        expect(actual.browser_action).toBeUndefined();
        expect(actual.page_action).toEqual(wxt.config.manifest.page_action);
      });

      it('should keep the custom `browser_action` for MV2 when both `action` and `browser_action` are defined', async () => {
        const buildOutput = fakeBuildOutput();
        setFakeWxt({
          config: {
            outDir,
            manifestVersion: 2,
            manifest: {
              action: {
                default_title: 'Action',
              },
              browser_action: {
                default_title: 'Browser Action',
              },
            },
          },
        });

        const { manifest: actual } = await generateManifest([], buildOutput);

        expect(actual.action).toBeUndefined();
        expect(actual.browser_action).toEqual(
          wxt.config.manifest.browser_action,
        );
        expect(actual.page_action).toBeUndefined();
      });
    });

    describe('options', () => {
      const options = fakeOptionsEntrypoint({
        outputDir: outDir,
        options: {
          openInTab: false,
          chromeStyle: true,
          browserStyle: true,
        },
        skipped: false,
      });

      it('should include a options_ui and chrome_style for chrome', async () => {
        setFakeWxt({
          config: {
            manifestVersion: 3,
            outDir,
            browser: 'chrome',
          },
        });
        const buildOutput = fakeBuildOutput();
        const expected = {
          open_in_tab: false,
          chrome_style: true,
          page: 'options.html',
        };

        const { manifest: actual } = await generateManifest(
          [options],
          buildOutput,
        );

        expect(actual.options_ui).toEqual(expected);
      });

      it('should include a options_ui and browser_style for firefox', async () => {
        setFakeWxt({
          config: {
            manifestVersion: 3,
            browser: 'firefox',
            outDir,
          },
        });
        const buildOutput = fakeBuildOutput();
        const expected = {
          open_in_tab: false,
          browser_style: true,
          page: 'options.html',
        };

        const { manifest: actual } = await generateManifest(
          [options],
          buildOutput,
        );

        expect(actual.options_ui).toEqual(expected);
      });
    });

    describe('background', () => {
      const background = fakeBackgroundEntrypoint({
        outputDir: outDir,
        options: {
          persistent: true,
          type: 'module',
        },
        skipped: false,
      });

      describe('MV3', () => {
        it.each(['chrome', 'safari'])(
          'should include a service worker and type for %s',
          async (browser) => {
            setFakeWxt({
              config: {
                outDir,
                manifestVersion: 3,
                browser,
              },
            });
            const buildOutput = fakeBuildOutput();
            const expected = {
              type: 'module',
              service_worker: 'background.js',
            };

            const { manifest: actual } = await generateManifest(
              [background],
              buildOutput,
            );

            expect(actual.background).toEqual(expected);
          },
        );

        it('should include a background script and type for firefox', async () => {
          setFakeWxt({
            config: {
              outDir,
              manifestVersion: 3,
              browser: 'firefox',
            },
          });
          const buildOutput = fakeBuildOutput();
          const expected = {
            type: 'module',
            scripts: ['background.js'],
          };

          const { manifest: actual } = await generateManifest(
            [background],
            buildOutput,
          );

          expect(actual.background).toEqual(expected);
        });
      });

      describe('MV2', () => {
        it.each(['chrome', 'safari'])(
          'should include scripts and persistent for %s',
          async (browser) => {
            setFakeWxt({
              config: {
                outDir,
                manifestVersion: 2,
                browser,
              },
            });
            const buildOutput = fakeBuildOutput();
            const expected = {
              persistent: true,
              scripts: ['background.js'],
            };

            const { manifest: actual } = await generateManifest(
              [background],
              buildOutput,
            );

            expect(actual.background).toEqual(expected);
          },
        );

        it('should include a background script and persistent for firefox mv2', async () => {
          setFakeWxt({
            config: {
              outDir,
              manifestVersion: 2,
              browser: 'firefox',
            },
          });
          const buildOutput = fakeBuildOutput();
          const expected = {
            persistent: true,
            scripts: ['background.js'],
          };

          const { manifest: actual } = await generateManifest(
            [background],
            buildOutput,
          );

          expect(actual.background).toEqual(expected);
        });
      });
    });

    describe('icons', () => {
      it('should auto-discover icons with the correct name', async () => {
        const entrypoints = fakeArray(() => fakeEntrypoint({ skipped: false }));
        const buildOutput = fakeBuildOutput({
          publicAssets: [
            { type: 'asset', fileName: 'icon-16.png' },
            { type: 'asset', fileName: 'icon/32.png' },
            { type: 'asset', fileName: 'icon@48w.png' },
            { type: 'asset', fileName: 'icon-64x64.png' },
            { type: 'asset', fileName: 'icon@96.png' },
            { type: 'asset', fileName: 'icons/128x128.png' },
          ],
        });

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual.icons).toEqual({
          16: 'icon-16.png',
          32: 'icon/32.png',
          48: 'icon@48w.png',
          64: 'icon-64x64.png',
          96: 'icon@96.png',
          128: 'icons/128x128.png',
        });
      });

      it('should return undefined when no icons are found', async () => {
        const entrypoints = fakeArray(() => fakeEntrypoint({ skipped: false }));
        const buildOutput = fakeBuildOutput({
          publicAssets: [
            { type: 'asset', fileName: 'logo.png' },
            { type: 'asset', fileName: 'icon-16.jpeg' },
          ],
        });

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual.icons).toBeUndefined();
      });

      it('should allow icons to be overwritten from the wxt.config.ts file', async () => {
        const entrypoints = fakeArray(() => fakeEntrypoint({ skipped: false }));
        const buildOutput = fakeBuildOutput({
          publicAssets: [
            { type: 'asset', fileName: 'icon-16.png' },
            { type: 'asset', fileName: 'icon-32.png' },
            { type: 'asset', fileName: 'logo-16.png' },
            { type: 'asset', fileName: 'logo-32.png' },
            { type: 'asset', fileName: 'logo-48.png' },
          ],
        });
        const expected = {
          16: 'logo-16.png',
          32: 'logo-32.png',
          48: 'logo-48.png',
        };
        setFakeWxt({
          config: {
            manifest: {
              icons: expected,
            },
          },
        });

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual.icons).toEqual(expected);
      });
    });

    describe('content_scripts', () => {
      it('should group content scripts and styles together based on their manifest properties', async () => {
        const cs1: ContentScriptEntrypoint = {
          type: 'content-script',
          name: 'one',
          inputPath: 'entrypoints/one.content/index.ts',
          outputDir: contentScriptOutDir,
          options: {
            matches: ['*://google.com/*'],
          },
          skipped: false,
        };
        const cs1Styles: OutputAsset = {
          type: 'asset',
          fileName: 'content-scripts/one.css',
        };
        const cs2: ContentScriptEntrypoint = {
          type: 'content-script',
          name: 'two',
          inputPath: 'entrypoints/two.content/index.ts',
          outputDir: contentScriptOutDir,
          options: {
            matches: ['*://google.com/*'],
            runAt: 'document_end',
          },
          skipped: false,
        };
        const cs2Styles: OutputAsset = {
          type: 'asset',
          fileName: 'content-scripts/two.css',
        };
        const cs3: ContentScriptEntrypoint = {
          type: 'content-script',
          name: 'three',
          inputPath: 'entrypoints/three.content/index.ts',
          outputDir: contentScriptOutDir,
          options: {
            matches: ['*://google.com/*'],
            runAt: 'document_end',
          },
          skipped: false,
        };
        const cs3Styles: OutputAsset = {
          type: 'asset',
          fileName: 'content-scripts/three.css',
        };
        const cs4: ContentScriptEntrypoint = {
          type: 'content-script',
          name: 'four',
          inputPath: 'entrypoints/four.content/index.ts',
          outputDir: contentScriptOutDir,
          options: {
            matches: ['*://duckduckgo.com/*'],
            runAt: 'document_end',
          },
          skipped: false,
        };
        const cs4Styles: OutputAsset = {
          type: 'asset',
          fileName: 'content-scripts/four.css',
        };
        const cs5: ContentScriptEntrypoint = {
          type: 'content-script',
          name: 'five',
          inputPath: 'entrypoints/five.content/index.ts',
          outputDir: contentScriptOutDir,
          options: {
            matches: ['*://google.com/*'],
            world: 'MAIN',
          },
          skipped: false,
        };
        const cs5Styles: OutputAsset = {
          type: 'asset',
          fileName: 'content-scripts/five.css',
        };

        const entrypoints = [cs1, cs2, cs3, cs4, cs5];
        setFakeWxt({
          config: {
            command: 'build',
            outDir,
            manifestVersion: 3,
          },
        });
        const buildOutput: Omit<BuildOutput, 'manifest'> = {
          publicAssets: [],
          steps: [
            { entrypoints: cs1, chunks: [cs1Styles] },
            { entrypoints: cs2, chunks: [cs2Styles] },
            { entrypoints: cs3, chunks: [cs3Styles] },
            { entrypoints: cs4, chunks: [cs4Styles] },
            { entrypoints: cs5, chunks: [cs5Styles] },
          ],
        };

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual.content_scripts).toContainEqual({
          matches: ['*://google.com/*'],
          css: ['content-scripts/one.css'],
          js: ['content-scripts/one.js'],
        });
        expect(actual.content_scripts).toContainEqual({
          matches: ['*://google.com/*'],
          run_at: 'document_end',
          css: ['content-scripts/two.css', 'content-scripts/three.css'],
          js: ['content-scripts/two.js', 'content-scripts/three.js'],
        });
        expect(actual.content_scripts).toContainEqual({
          matches: ['*://duckduckgo.com/*'],
          run_at: 'document_end',
          css: ['content-scripts/four.css'],
          js: ['content-scripts/four.js'],
        });
        expect(actual.content_scripts).toContainEqual({
          matches: ['*://google.com/*'],
          css: ['content-scripts/five.css'],
          js: ['content-scripts/five.js'],
          world: 'MAIN',
        });
      });

      it('should merge any content scripts declared in wxt.config.ts', async () => {
        const cs: ContentScriptEntrypoint = {
          type: 'content-script',
          name: 'one',
          inputPath: 'entrypoints/one.content.ts',
          outputDir: contentScriptOutDir,
          options: {
            matches: ['*://google.com/*'],
          },
          skipped: false,
        };
        const generatedContentScript = {
          matches: ['*://google.com/*'],
          js: ['content-scripts/one.js'],
        };
        const userContentScript = {
          css: ['content-scripts/two.css'],
          matches: ['*://*.google.com/*'],
        };

        const entrypoints = [cs];
        const buildOutput = fakeBuildOutput();
        setFakeWxt({
          config: {
            outDir,
            command: 'build',
            manifest: {
              content_scripts: [userContentScript],
            },
          },
        });

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual.content_scripts).toContainEqual(userContentScript);
        expect(actual.content_scripts).toContainEqual(generatedContentScript);
      });

      describe('cssInjectionMode', () => {
        it.each([undefined, 'manifest'] as const)(
          'should add a CSS entry when cssInjectionMode is %s',
          async (cssInjectionMode) => {
            const cs: ContentScriptEntrypoint = {
              type: 'content-script',
              name: 'one',
              inputPath: 'entrypoints/one.content.ts',
              outputDir: contentScriptOutDir,
              options: {
                matches: ['*://google.com/*'],
                cssInjectionMode,
              },
              skipped: false,
            };
            const styles: OutputAsset = {
              type: 'asset',
              fileName: 'content-scripts/one.css',
            };

            const entrypoints = [cs];
            const buildOutput: Omit<BuildOutput, 'manifest'> = {
              publicAssets: [],
              steps: [{ entrypoints: cs, chunks: [styles] }],
            };
            setFakeWxt({
              config: {
                outDir,
                command: 'build',
              },
            });

            const { manifest: actual } = await generateManifest(
              entrypoints,
              buildOutput,
            );

            expect(actual.content_scripts).toEqual([
              {
                js: ['content-scripts/one.js'],
                css: ['content-scripts/one.css'],
                matches: ['*://google.com/*'],
              },
            ]);
          },
        );

        it.each(['manual', 'ui'] as const)(
          'should not add an entry for CSS when cssInjectionMode is %s',
          async (cssInjectionMode) => {
            const cs: ContentScriptEntrypoint = {
              type: 'content-script',
              name: 'one',
              inputPath: 'entrypoints/one.content.ts',
              outputDir: contentScriptOutDir,
              options: {
                matches: ['*://google.com/*'],
                cssInjectionMode,
              },
              skipped: false,
            };
            const styles: OutputAsset = {
              type: 'asset',
              fileName: 'content-scripts/one.css',
            };

            const entrypoints = [cs];
            const buildOutput: Omit<BuildOutput, 'manifest'> = {
              publicAssets: [],
              steps: [{ entrypoints: cs, chunks: [styles] }],
            };
            setFakeWxt({
              config: {
                outDir,
                command: 'build',
              },
            });

            const { manifest: actual } = await generateManifest(
              entrypoints,
              buildOutput,
            );

            expect(actual.content_scripts).toEqual([
              {
                js: ['content-scripts/one.js'],
                matches: ['*://google.com/*'],
              },
            ]);
          },
        );

        it('should add CSS file to `web_accessible_resources` when cssInjectionMode is "ui" for MV3', async () => {
          const cs: ContentScriptEntrypoint = {
            type: 'content-script',
            name: 'one',
            inputPath: 'entrypoints/one.content.ts',
            outputDir: contentScriptOutDir,
            options: {
              matches: ['*://google.com/*'],
              cssInjectionMode: 'ui',
            },
            skipped: false,
          };
          const styles: OutputAsset = {
            type: 'asset',
            fileName: 'content-scripts/one.css',
          };

          const entrypoints = [cs];
          const buildOutput: Omit<BuildOutput, 'manifest'> = {
            publicAssets: [],
            steps: [{ entrypoints: cs, chunks: [styles] }],
          };
          setFakeWxt({
            config: {
              outDir,
              command: 'build',
              manifestVersion: 3,
            },
          });

          const { manifest: actual } = await generateManifest(
            entrypoints,
            buildOutput,
          );

          expect(actual.web_accessible_resources).toEqual([
            {
              matches: ['*://google.com/*'],
              resources: ['content-scripts/one.css'],
            },
          ]);
        });

        it('should add CSS file to `web_accessible_resources` when cssInjectionMode is "ui" for MV2', async () => {
          const cs: ContentScriptEntrypoint = {
            type: 'content-script',
            name: 'one',
            inputPath: 'entrypoints/one.content.ts',
            outputDir: contentScriptOutDir,
            options: {
              matches: ['*://google.com/*'],
              cssInjectionMode: 'ui',
            },
            skipped: false,
          };
          const styles: OutputAsset = {
            type: 'asset',
            fileName: 'content-scripts/one.css',
          };

          const entrypoints = [cs];
          const buildOutput: Omit<BuildOutput, 'manifest'> = {
            publicAssets: [],
            steps: [{ entrypoints: cs, chunks: [styles] }],
          };
          setFakeWxt({
            config: {
              outDir,
              command: 'build',
              manifestVersion: 2,
            },
          });

          const { manifest: actual } = await generateManifest(
            entrypoints,
            buildOutput,
          );

          expect(actual.web_accessible_resources).toEqual([
            'content-scripts/one.css',
          ]);
        });

        it('should strip the path off the match pattern so the pattern is valid for `web_accessible_resources`', async () => {
          const cs: ContentScriptEntrypoint = {
            type: 'content-script',
            name: 'one',
            inputPath: 'entrypoints/one.content.ts',
            outputDir: contentScriptOutDir,
            options: {
              matches: ['*://play.google.com/books/*'],
              cssInjectionMode: 'ui',
            },
            skipped: false,
          };
          const styles: OutputAsset = {
            type: 'asset',
            fileName: 'content-scripts/one.css',
          };

          const entrypoints = [cs];
          const buildOutput: Omit<BuildOutput, 'manifest'> = {
            publicAssets: [],
            steps: [{ entrypoints: cs, chunks: [styles] }],
          };
          setFakeWxt({
            config: {
              outDir,
              command: 'build',
              manifestVersion: 3,
            },
          });

          const { manifest: actual } = await generateManifest(
            entrypoints,
            buildOutput,
          );

          expect(actual.web_accessible_resources).toEqual([
            {
              matches: ['*://play.google.com/*'],
              resources: ['content-scripts/one.css'],
            },
          ]);
        });
      });

      describe('registration', () => {
        it('should throw an error when registration=runtime for MV2', async () => {
          const cs: ContentScriptEntrypoint = fakeContentScriptEntrypoint({
            options: {
              registration: 'runtime',
            },
            skipped: false,
          });

          const entrypoints = [cs];
          const buildOutput: Omit<BuildOutput, 'manifest'> = {
            publicAssets: [],
            steps: [{ entrypoints: cs, chunks: [] }],
          };
          setFakeWxt({
            config: {
              manifestVersion: 2,
            },
          });

          await expect(
            generateManifest(entrypoints, buildOutput),
          ).rejects.toThrowError();
        });

        it('should add host_permissions instead of content_scripts when registration=runtime', async () => {
          const cs: ContentScriptEntrypoint = {
            type: 'content-script',
            name: 'one',
            inputPath: 'entrypoints/one.content.ts',
            outputDir: contentScriptOutDir,
            options: {
              matches: ['*://google.com/*'],
              registration: 'runtime',
            },
            skipped: false,
          };
          const styles: OutputAsset = {
            type: 'asset',
            fileName: 'content-scripts/one.css',
          };

          const entrypoints = [cs];
          const buildOutput: Omit<BuildOutput, 'manifest'> = {
            publicAssets: [],
            steps: [{ entrypoints: cs, chunks: [styles] }],
          };
          setFakeWxt({
            config: {
              manifestVersion: 3,
              outDir,
              command: 'build',
            },
          });

          const { manifest: actual } = await generateManifest(
            entrypoints,
            buildOutput,
          );

          expect(actual.content_scripts).toEqual([]);
          expect(actual.host_permissions).toEqual(['*://google.com/*']);
        });
      });
    });

    describe('sidepanel', () => {
      it.each(['chrome', 'safari', 'edge'])(
        'should include the side_panel and permission, ignoring all options for %s',
        async (browser) => {
          const sidepanel = fakeSidepanelEntrypoint({
            outputDir: outDir,
            skipped: false,
          });
          const buildOutput = fakeBuildOutput();

          setFakeWxt({
            config: {
              manifestVersion: 3,
              browser,
              outDir,
              command: 'build',
            },
          });
          const expected = {
            side_panel: {
              default_path: 'sidepanel.html',
            },
            permissions: ['sidePanel'],
          };

          const { manifest: actual } = await generateManifest(
            [sidepanel],
            buildOutput,
          );

          expect(actual).toMatchObject(expected);
        },
      );

      it.each(['firefox'])(
        'should include a sidebar_action for %s',
        async (browser) => {
          const sidepanel = fakeSidepanelEntrypoint({
            outputDir: outDir,
            skipped: false,
          });
          const buildOutput = fakeBuildOutput();

          setFakeWxt({
            config: {
              manifestVersion: 3,
              browser,
              outDir,
            },
          });
          const expected = {
            sidebar_action: {
              default_panel: 'sidepanel.html',
              open_at_install: sidepanel.options.openAtInstall,
              default_title: sidepanel.options.defaultTitle,
              default_icon: sidepanel.options.defaultIcon,
              browser_style: sidepanel.options.browserStyle,
            },
          };

          const { manifest: actual } = await generateManifest(
            [sidepanel],
            buildOutput,
          );

          expect(actual).toMatchObject(expected);
        },
      );
    });

    describe('web_accessible_resources', () => {
      it('should combine user defined resources and generated resources for MV3', async () => {
        const cs: ContentScriptEntrypoint = {
          type: 'content-script',
          name: 'one',
          inputPath: 'entrypoints/one.content.ts',
          outputDir: contentScriptOutDir,
          options: {
            matches: ['*://google.com/*'],
            cssInjectionMode: 'ui',
          },
          skipped: false,
        };
        const styles: OutputAsset = {
          type: 'asset',
          fileName: 'content-scripts/one.css',
        };

        const entrypoints = [cs];
        const buildOutput: Omit<BuildOutput, 'manifest'> = {
          publicAssets: [],
          steps: [{ entrypoints: cs, chunks: [styles] }],
        };
        setFakeWxt({
          config: {
            outDir,
            command: 'build',
            manifestVersion: 3,
            manifest: {
              web_accessible_resources: [
                { resources: ['one.png'], matches: ['*://one.com/*'] },
              ],
            },
          },
        });

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual.web_accessible_resources).toEqual([
          { resources: ['one.png'], matches: ['*://one.com/*'] },
          {
            resources: ['content-scripts/one.css'],
            matches: ['*://google.com/*'],
          },
        ]);
      });

      it('should combine user defined resources and generated resources for MV2', async () => {
        const cs: ContentScriptEntrypoint = {
          type: 'content-script',
          name: 'one',
          inputPath: 'entrypoints/one.content.ts',
          outputDir: contentScriptOutDir,
          options: {
            matches: ['*://google.com/*'],
            cssInjectionMode: 'ui',
          },
          skipped: false,
        };
        const styles: OutputAsset = {
          type: 'asset',
          fileName: 'content-scripts/one.css',
        };

        const entrypoints = [cs];
        const buildOutput: Omit<BuildOutput, 'manifest'> = {
          publicAssets: [],
          steps: [{ entrypoints: cs, chunks: [styles] }],
        };
        setFakeWxt({
          config: {
            outDir,
            command: 'build',
            manifestVersion: 2,
            manifest: {
              web_accessible_resources: ['one.png'],
            },
          },
        });

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual.web_accessible_resources).toEqual([
          'one.png',
          'content-scripts/one.css',
        ]);
      });

      it('should convert mv3 items to mv2 strings automatically', async () => {
        setFakeWxt({
          config: {
            outDir,
            manifestVersion: 2,
            manifest: {
              web_accessible_resources: [
                {
                  matches: ['*://*/*'],
                  resources: ['/icon-128.png'],
                },
                {
                  matches: ['https://google.com'],
                  resources: ['/icon-128.png', '/icon-32.png'],
                },
              ],
            },
          },
        });

        const { manifest: actual } = await generateManifest(
          [],
          fakeBuildOutput(),
        );

        expect(actual.web_accessible_resources).toEqual([
          '/icon-128.png',
          '/icon-32.png',
        ]);
      });

      it('should convert mv2 strings to mv3 items with a warning automatically', async () => {
        setFakeWxt({
          config: {
            outDir,
            manifestVersion: 3,
            manifest: {
              web_accessible_resources: ['/icon.svg'],
            },
          },
        });

        await expect(() =>
          generateManifest([], fakeBuildOutput()),
        ).rejects.toThrow(
          'Non-MV3 web_accessible_resources detected: ["/icon.svg"]. When manually defining web_accessible_resources, define them as MV3 objects ({ matches: [...], resources: [...] }), and WXT will automatically convert them to MV2 when necessary.',
        );
      });
    });

    describe('transformManifest option', () => {
      it("should call the transformManifest option after the manifest is generated, but before it's returned", async () => {
        const entrypoints: Entrypoint[] = [];
        const buildOutput = fakeBuildOutput();
        const newAuthor = 'Custom Author';
        setFakeWxt({
          config: {
            transformManifest(manifest: any) {
              manifest.author = newAuthor;
            },
          },
        });
        const expected = {
          author: newAuthor,
        };

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual).toMatchObject(expected);
      });
    });

    describe('version', () => {
      it.each(['chrome', 'safari', 'edge'] as const)(
        'should include version and version_name as is on %s',
        async (browser) => {
          const version = '1.0.0';
          const versionName = '1.0.0-alpha1';
          const entrypoints: Entrypoint[] = [];
          const buildOutput = fakeBuildOutput();
          setFakeWxt({
            config: {
              browser,
              manifest: {
                version,
                version_name: versionName,
              },
            },
          });

          const { manifest: actual } = await generateManifest(
            entrypoints,
            buildOutput,
          );

          expect(actual.version).toBe(version);
          expect(actual.version_name).toBe(versionName);
        },
      );

      it.each(['firefox'] as const)(
        'should not include a version_name on %s because it is unsupported',
        async (browser) => {
          const version = '1.0.0';
          const versionName = '1.0.0-alpha1';
          const entrypoints: Entrypoint[] = [];
          const buildOutput = fakeBuildOutput();
          setFakeWxt({
            config: {
              browser,
              manifest: {
                version,
                version_name: versionName,
              },
            },
          });

          const { manifest: actual } = await generateManifest(
            entrypoints,
            buildOutput,
          );

          expect(actual.version).toBe(version);
          expect(actual.version_name).toBeUndefined();
        },
      );

      it.each(['chrome', 'firefox', 'safari', 'edge'])(
        'should not include the version_name if it is equal to version',
        async (browser) => {
          const version = '1.0.0';
          const entrypoints: Entrypoint[] = [];
          const buildOutput = fakeBuildOutput();
          setFakeWxt({
            config: {
              browser,
              manifest: {
                version,
                version_name: version,
              },
            },
          });

          const { manifest: actual } = await generateManifest(
            entrypoints,
            buildOutput,
          );

          expect(actual.version).toBe(version);
          expect(actual.version_name).toBeUndefined();
        },
      );

      it('should log a warning if the version could not be detected', async () => {
        const entrypoints: Entrypoint[] = [];
        const buildOutput = fakeBuildOutput();
        setFakeWxt({
          config: {
            manifest: {
              // @ts-ignore: Purposefully removing version from fake object
              version: null,
            },
          },
        });

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual.version).toBe('0.0.0');
        expect(actual.version_name).toBeUndefined();
        expect(wxt.logger.warn).toBeCalledTimes(1);
        expect(wxt.logger.warn).toBeCalledWith(
          expect.stringContaining('Extension version not found'),
        );
      });
    });

    describe('commands', () => {
      const reloadCommandName = 'wxt:reload-extension';
      const reloadCommand = {
        description: expect.any(String),
        suggested_key: {
          default: 'Alt+R',
        },
      };

      it('should include a command for reloading the extension during development', async () => {
        setFakeWxt({
          config: { command: 'serve' },
        });
        const output = fakeBuildOutput();
        const entrypoints = fakeArray(fakeEntrypoint);

        const { manifest: actual } = await generateManifest(
          entrypoints,
          output,
        );

        expect(actual.commands).toEqual({
          [reloadCommandName]: reloadCommand,
        });
      });

      it('should customize the reload commands key binding if passing a custom command', async () => {
        setFakeWxt({
          config: {
            command: 'serve',
            dev: {
              reloadCommand: 'Ctrl+E',
            },
          },
        });
        const output = fakeBuildOutput();
        const entrypoints = fakeArray(fakeEntrypoint);

        const { manifest: actual } = await generateManifest(
          entrypoints,
          output,
        );

        expect(actual.commands).toEqual({
          [reloadCommandName]: {
            ...reloadCommand,
            suggested_key: {
              default: 'Ctrl+E',
            },
          },
        });
      });

      it("should not include the reload command when it's been disabled", async () => {
        setFakeWxt({
          config: {
            command: 'serve',
            dev: {
              reloadCommand: false,
            },
          },
        });
        const output = fakeBuildOutput();
        const entrypoints = fakeArray(fakeEntrypoint);

        const { manifest: actual } = await generateManifest(
          entrypoints,
          output,
        );

        expect(actual.commands).toBeUndefined();
      });

      it('should not override any existing commands when adding the one to reload the extension', async () => {
        const customCommandName = 'custom-command';
        const customCommand = fakeManifestCommand();
        setFakeWxt({
          config: {
            command: 'serve',
            manifest: {
              commands: {
                [customCommandName]: customCommand,
              },
            },
          },
        });
        const output = fakeBuildOutput();
        const entrypoints = fakeArray(fakeEntrypoint);

        const { manifest: actual } = await generateManifest(
          entrypoints,
          output,
        );

        expect(actual.commands).toEqual({
          [reloadCommandName]: reloadCommand,
          [customCommandName]: customCommand,
        });
      });

      it('should not include the command if there are already 4 others (the max)', async () => {
        const commands = {
          command1: fakeManifestCommand(),
          command2: fakeManifestCommand(),
          command3: fakeManifestCommand(),
          command4: fakeManifestCommand(),
        };
        setFakeWxt({
          config: {
            command: 'serve',
            manifest: { commands },
          },
        });
        const output = fakeBuildOutput();
        const entrypoints = fakeArray(fakeEntrypoint);

        const { manifest: actual, warnings } = await generateManifest(
          entrypoints,
          output,
        );

        expect(actual.commands).toEqual(commands);
        expect(warnings).toHaveLength(1);
      });

      it('should not include the command when building an extension', async () => {
        setFakeWxt({
          config: { command: 'build' },
        });
        const output = fakeBuildOutput();
        const entrypoints = fakeArray(fakeEntrypoint);

        const { manifest: actual } = await generateManifest(
          entrypoints,
          output,
        );

        expect(actual.commands).toBeUndefined();
      });
    });

    describe('Stripping keys', () => {
      const mv2Manifest = {
        page_action: {},
        browser_action: {},
        automation: {},
        content_capabilities: {},
        converted_from_user_script: {},
        current_locale: {},
        differential_fingerprint: {},
        event_rules: {},
        file_browser_handlers: {},
        file_system_provider_capabilities: {},
        input_components: {},
        nacl_modules: {},
        natively_connectable: {},
        offline_enabled: {},
        platforms: {},
        replacement_web_app: {},
        system_indicator: {},
        user_scripts: {},
      };
      const mv3Manifest = {
        action: {},
        export: {},
        optional_host_permissions: {},
        side_panel: {},
      };
      const hostPermissionsManifest = {
        host_permissions: {},
      };
      const manifest: any = {
        ...mv2Manifest,
        ...mv3Manifest,
        ...hostPermissionsManifest,
      };

      it.each([
        ['firefox', 2, mv2Manifest],
        ['chrome', 2, { ...mv2Manifest, ...hostPermissionsManifest }],
        ['safari', 2, { ...mv2Manifest, ...hostPermissionsManifest }],
        ['edge', 2, { ...mv2Manifest, ...hostPermissionsManifest }],
        ['firefox', 3, { ...mv3Manifest, ...hostPermissionsManifest }],
        ['chrome', 3, { ...mv3Manifest, ...hostPermissionsManifest }],
        ['safari', 3, { ...mv3Manifest, ...hostPermissionsManifest }],
        ['edge', 3, { ...mv3Manifest, ...hostPermissionsManifest }],
      ] as const)(
        "%s MV%s should only include that version's keys",
        async (browser, manifestVersion, expected) => {
          setFakeWxt({
            config: {
              browser,
              manifest,
              manifestVersion,
              command: 'build',
            },
          });
          const output = fakeBuildOutput();

          const { manifest: actual } = await generateManifest([], output);

          expect(actual).toEqual({
            name: expect.any(String),
            version: expect.any(String),
            manifest_version: manifestVersion,
            ...expected,
          });
        },
      );
    });

    describe('host_permissions', () => {
      it('should keep host_permissions as-is for MV3', async () => {
        const expectedHostPermissions = ['https://google.com/*'];
        const expectedPermissions = ['scripting'];
        setFakeWxt({
          config: {
            manifest: {
              host_permissions: expectedHostPermissions,
              permissions: expectedPermissions,
            },
            manifestVersion: 3,
            command: 'build',
          },
        });
        const output = fakeBuildOutput();

        const { manifest: actual } = await generateManifest([], output);

        expect(actual.permissions).toEqual(expectedPermissions);
        expect(actual.host_permissions).toEqual(expectedHostPermissions);
      });

      it('should move host_permissions to permissions for MV2, ignoring duplicates', async () => {
        const expectedPermissions = [
          'scripting',
          '*://*.youtube.com/*',
          'https://google.com/*',
        ];
        setFakeWxt({
          config: {
            manifest: {
              host_permissions: ['https://google.com/*', '*://*.youtube.com/*'],
              permissions: ['scripting', '*://*.youtube.com/*'],
            },
            manifestVersion: 2,
            command: 'build',
          },
        });
        const output = fakeBuildOutput();

        const { manifest: actual } = await generateManifest([], output);

        expect(actual.permissions).toEqual(expectedPermissions);
        expect(actual.host_permissions).toBeUndefined();
      });
    });

    describe('Dev mode', () => {
      it('should not add any code for production builds', async () => {
        setFakeWxt({
          config: {
            command: 'build',
          },
          server: {
            hostname: 'localhost',
            port: 3000,
            origin: 'http://localhost:3000',
          },
        });
        const output = fakeBuildOutput();
        const entrypoints: Entrypoint[] = [];

        const { manifest: actual } = await generateManifest(
          entrypoints,
          output,
        );

        expect(actual.permissions).toBeUndefined();
        expect(actual.content_security_policy).toBeUndefined();
      });

      it('should add required permissions for dev mode to function for MV2', async () => {
        setFakeWxt({
          config: {
            command: 'serve',
            manifestVersion: 2,
          },
          server: fakeWxtDevServer({
            port: 3000,
            hostname: 'localhost',
            origin: 'http://localhost:3000',
          }),
        });
        const output = fakeBuildOutput();
        const entrypoints: Entrypoint[] = [];

        const { manifest: actual } = await generateManifest(
          entrypoints,
          output,
        );

        expect(actual).toMatchObject({
          content_security_policy:
            "script-src 'self' http://localhost:3000; object-src 'self';",
          permissions: ['http://localhost/*', 'tabs'],
        });
      });

      it('should add required permissions for dev mode to function for MV3', async () => {
        setFakeWxt({
          config: {
            command: 'serve',
            manifestVersion: 3,
            browser: 'chrome',
          },
          server: fakeWxtDevServer({
            hostname: 'localhost',
            port: 3000,
            origin: 'http://localhost:3000',
          }),
        });
        const output = fakeBuildOutput();
        const entrypoints: Entrypoint[] = [];

        const { manifest: actual } = await generateManifest(
          entrypoints,
          output,
        );

        expect(actual).toMatchObject({
          content_security_policy: {
            extension_pages:
              "script-src 'self' 'wasm-unsafe-eval' http://localhost:3000; object-src 'self';",
            sandbox:
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000; sandbox allow-scripts allow-forms allow-popups allow-modals; child-src 'self';",
          },
          host_permissions: ['http://localhost/*'],
          permissions: ['tabs', 'scripting'],
        });
      });

      it('should convert MV3 CSP object to MV2 CSP string with localhost for MV2', async () => {
        const entrypoints: Entrypoint[] = [];
        const buildOutput = fakeBuildOutput();
        const inputCsp =
          "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';";
        const expectedCsp =
          "script-src 'self' 'wasm-unsafe-eval' http://localhost:3000; object-src 'self';";

        // Setup WXT for Firefox and serve command
        setFakeWxt({
          config: {
            browser: 'firefox',
            command: 'serve',
            manifestVersion: 2,
            manifest: {
              content_security_policy: {
                extension_pages: inputCsp,
              },
            },
          },
          server: fakeWxtDevServer({
            port: 3000,
            hostname: 'localhost',
            origin: 'http://localhost:3000',
          }),
        });

        const { manifest: actual } = await generateManifest(
          entrypoints,
          buildOutput,
        );

        expect(actual.content_security_policy).toEqual(expectedCsp);
      });
    });

    it('should not add skipped entrypoints to manifest', async () => {
      const popup = fakePopupEntrypoint({ skipped: true });
      const content = fakeContentScriptEntrypoint({ skipped: true });
      const sidePanel = fakeSidepanelEntrypoint({ skipped: true });
      const buildOutput = fakeBuildOutput();

      setFakeWxt({
        config: {
          command: 'build',
          manifestVersion: 3,
        },
      });

      const { manifest } = await generateManifest(
        [popup, content, sidePanel],
        buildOutput,
      );

      expect(manifest.action).toBeUndefined();
      expect(manifest.sidebar_action).toBeUndefined();
      expect(manifest.content_scripts).toBeUndefined();
    });

    describe('manifest_version', () => {
      it('should ignore and log a warning when someone sets `manifest_version` inside the manifest', async () => {
        const buildOutput = fakeBuildOutput();
        const expectedVersion = 2;
        setFakeWxt({
          logger: mock(),
          config: {
            command: 'build',
            manifestVersion: expectedVersion,
            manifest: {
              manifest_version: 3,
            },
          },
        });

        const { manifest } = await generateManifest([], buildOutput);

        expect(manifest.manifest_version).toBe(expectedVersion);
        expect(wxt.logger.warn).toBeCalledTimes(1);
        expect(wxt.logger.warn).toBeCalledWith(
          expect.stringContaining(
            '`manifest.manifest_version` config was set, but ignored',
          ),
        );
      });
    });
  });

  describe('stripPathFromMatchPattern', () => {
    it.each([
      ['<all_urls>', '<all_urls>'],
      ['*://play.google.com/books/*', '*://play.google.com/*'],
      ['*://*/*', '*://*/*'],
      ['https://github.com/wxt-dev/*', 'https://github.com/*'],
    ])('should convert "%s" to "%s"', (input, expected) => {
      const actual = stripPathFromMatchPattern(input);
      expect(actual).toEqual(expected);
    });
  });
});
