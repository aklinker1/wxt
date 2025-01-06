import { describe, it, expect } from 'vitest';
import { TestProject } from '../utils';

describe('Output Directory Structure', () => {
  it('should not output hidden files and directories that start with "."', async () => {
    const project = new TestProject();
    project.addFile('entrypoints/.DS_Store');
    project.addFile('entrypoints/.hidden1/index.html', '<html></html>');
    project.addFile('entrypoints/.hidden2.html', '<html></html>');
    project.addFile('entrypoints/unlisted.html', '<html></html>');

    await project.build();

    expect(await project.serializeOutput()).toMatchInlineSnapshot(`
      ".output/chrome-mv3/chunks/unlisted-DPbbfBKe.js
      ----------------------------------------
      (function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function s(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=s(e);fetch(e.href,r)}})();try{}catch(i){console.error("[wxt] Failed to initialize plugins",i)}

      ================================================================================
      .output/chrome-mv3/manifest.json
      ----------------------------------------
      {"manifest_version":3,"name":"E2E Extension","description":"Example description","version":"0.0.0"}
      ================================================================================
      .output/chrome-mv3/unlisted.html
      ----------------------------------------
      <html><head>  <script type="module" crossorigin src="/chunks/unlisted-DPbbfBKe.js"></script>
      </head></html>"
    `);
  });

  it('should output separate CSS files for each content script', async () => {
    const project = new TestProject();
    project.addFile(
      'entrypoints/one.content/index.ts',
      `import './style.css';
      export default defineContentScript({
        matches: ["*://*/*"],
        main: () => {},
      })`,
    );
    project.addFile(
      'entrypoints/one.content/style.css',
      `body { color: blue }`,
    );
    project.addFile(
      'entrypoints/two.content/index.ts',
      `import './style.css';
      export default defineContentScript({
        matches: ["*://*/*"],
        main: () => {},
      })`,
    );
    project.addFile('entrypoints/two.content/style.css', `body { color: red }`);

    await project.build();

    expect(
      await project.serializeOutput([
        '.output/chrome-mv3/content-scripts/one.js',
        '.output/chrome-mv3/content-scripts/two.js',
      ]),
    ).toMatchInlineSnapshot(`
      ".output/chrome-mv3/content-scripts/one.css
      ----------------------------------------
      body{color:#00f}

      ================================================================================
      .output/chrome-mv3/content-scripts/one.js
      ----------------------------------------
      <contents-ignored>
      ================================================================================
      .output/chrome-mv3/content-scripts/two.css
      ----------------------------------------
      body{color:red}

      ================================================================================
      .output/chrome-mv3/content-scripts/two.js
      ----------------------------------------
      <contents-ignored>
      ================================================================================
      .output/chrome-mv3/manifest.json
      ----------------------------------------
      {"manifest_version":3,"name":"E2E Extension","description":"Example description","version":"0.0.0","content_scripts":[{"matches":["*://*/*"],"css":["content-scripts/one.css","content-scripts/two.css"],"js":["content-scripts/one.js","content-scripts/two.js"]}]}"
    `);
  });

  it('should allow inputs with invalid JS variable names, like dashes', async () => {
    const project = new TestProject();
    project.addFile(
      'entrypoints/overlay-one.content.ts',
      `export default defineContentScript({
        matches: ["*://*/*"],
        main: () => {},
      })`,
    );

    await project.build();

    expect(
      await project.serializeOutput([
        '.output/chrome-mv3/content-scripts/overlay-one.js',
      ]),
    ).toMatchInlineSnapshot(`
      ".output/chrome-mv3/content-scripts/overlay-one.js
      ----------------------------------------
      <contents-ignored>
      ================================================================================
      .output/chrome-mv3/manifest.json
      ----------------------------------------
      {"manifest_version":3,"name":"E2E Extension","description":"Example description","version":"0.0.0","content_scripts":[{"matches":["*://*/*"],"js":["content-scripts/overlay-one.js"]}]}"
    `);
  });

  it('should not include an entrypoint if the target browser is not in the list of included targets', async () => {
    const project = new TestProject();
    project.addFile('entrypoints/options.html', '<html></html>');
    project.addFile(
      'entrypoints/background.ts',
      `
          export default defineBackground({
            include: ["chrome"],
            main() {},
          })
        `,
    );

    await project.build({ browser: 'firefox' });

    expect(await project.fileExists('.output/firefox-mv2/background.js')).toBe(
      false,
    );
  });

  it('should not include an entrypoint if the target browser is in the list of excluded targets', async () => {
    const project = new TestProject();
    project.addFile('entrypoints/options.html', '<html></html>');
    project.addFile(
      'entrypoints/background.ts',
      `
          export default defineBackground({
            exclude: ["chrome"],
            main() {},
          })
        `,
    );

    await project.build({ browser: 'chrome' });

    expect(await project.fileExists('.output/firefox-mv2/background.js')).toBe(
      false,
    );
  });

  it('should generate a stats file when analyzing the bundle', async () => {
    const project = new TestProject();
    project.setConfigFileConfig({
      analysis: {
        enabled: true,
        template: 'sunburst',
      },
    });
    project.addFile(
      'entrypoints/background.ts',
      `export default defineBackground(() => {});`,
    );
    project.addFile('entrypoints/popup.html', '<html></html>');
    project.addFile(
      'entrypoints/overlay.content.ts',
      `export default defineContentScript({
        matches: [],
        main() {},
      });`,
    );

    await project.build();

    expect(await project.fileExists('stats.html')).toBe(true);
  });

  it('should support JavaScript entrypoints', async () => {
    const project = new TestProject();
    project.addFile(
      'entrypoints/background.js',
      `export default defineBackground(() => {});`,
    );
    project.addFile(
      'entrypoints/unlisted.js',
      `export default defineUnlistedScript(() => {})`,
    );
    project.addFile(
      'entrypoints/content.js',
      `export default defineContentScript({
        matches: ["*://*.google.com/*"],
        main() {},
      })`,
    );
    project.addFile(
      'entrypoints/named.content.jsx',
      `export default defineContentScript({
        matches: ["*://*.duckduckgo.com/*"],
        main() {},
      })`,
    );

    await project.build();

    expect(await project.serializeFile('.output/chrome-mv3/manifest.json'))
      .toMatchInlineSnapshot(`
        ".output/chrome-mv3/manifest.json
        ----------------------------------------
        {"manifest_version":3,"name":"E2E Extension","description":"Example description","version":"0.0.0","background":{"service_worker":"background.js"},"content_scripts":[{"matches":["*://*.google.com/*"],"js":["content-scripts/content.js"]},{"matches":["*://*.duckduckgo.com/*"],"js":["content-scripts/named.js"]}]}"
      `);
    expect(await project.fileExists('.output/chrome-mv3/background.js'));
    expect(
      await project.fileExists('.output/chrome-mv3/content-scripts/content.js'),
    );
    expect(
      await project.fileExists('.output/chrome-mv3/content-scripts/named.js'),
    );
    expect(await project.fileExists('.output/chrome-mv3/unlisted.js'));
  });

  it("should output to a custom directory when overriding 'outDir'", async () => {
    const project = new TestProject();
    project.addFile('entrypoints/unlisted.html', '<html></html>');
    project.setConfigFileConfig({
      outDir: 'dist',
    });

    await project.build();

    expect(await project.fileExists('dist/chrome-mv3/manifest.json')).toBe(
      true,
    );
  });

  it('should generate ESM background script when type=module', async () => {
    const project = new TestProject();
    project.addFile(
      'utils/log.ts',
      `export function logHello(name: string) {
        console.log(\`Hello \${name}!\`);
      }`,
    );
    project.addFile(
      'entrypoints/background.ts',
      `export default defineBackground({
        type: "module",
        main() {
          logHello("background");
        },
      })`,
    );
    project.addFile(
      'entrypoints/popup/index.html',
      `<html>
        <head>
          <script type="module" src="./main.ts"></script>
        </head>
      </html>`,
    );
    project.addFile('entrypoints/popup/main.ts', `logHello('popup')`);

    await project.build({
      vite: () => ({
        build: {
          // Make output for snapshot readible
          minify: false,
        },
      }),
    });

    expect(await project.serializeFile('.output/chrome-mv3/background.js'))
      .toMatchInlineSnapshot(`
        ".output/chrome-mv3/background.js
        ----------------------------------------
        var _a, _b;
        import { l as logHello, i as initPlugins } from "./chunks/_virtual_wxt-plugins-OjKtWpmY.js";
        function defineBackground(arg) {
          if (arg == null || typeof arg === "function") return { main: arg };
          return arg;
        }
        const definition = defineBackground({
          type: "module",
          main() {
            logHello("background");
          }
        });
        // @ts-expect-error
        ((_b = (_a = globalThis.browser) == null ? void 0 : _a.runtime) == null ? void 0 : _b.id) == null ? globalThis.chrome : (
          // @ts-expect-error
          globalThis.browser
        );
        function print(method, ...args) {
          return;
        }
        const logger = {
          debug: (...args) => print(console.debug, ...args),
          log: (...args) => print(console.log, ...args),
          warn: (...args) => print(console.warn, ...args),
          error: (...args) => print(console.error, ...args)
        };
        let result;
        try {
          initPlugins();
          result = definition.main();
          if (result instanceof Promise) {
            console.warn(
              "The background's main() function return a promise, but it must be synchronous"
            );
          }
        } catch (err) {
          logger.error("The background crashed on startup!");
          throw err;
        }
        "
      `);
  });

  it('should generate IIFE background script when type=undefined', async () => {
    const project = new TestProject();
    project.addFile(
      'utils/log.ts',
      `export function logHello(name: string) {
          console.log(\`Hello \${name}!\`);
        }`,
    );
    project.addFile(
      'entrypoints/background.ts',
      `export default defineBackground({
          main() {
            logHello("background");
          },
        })`,
    );
    project.addFile(
      'entrypoints/popup/index.html',
      `<html>
          <head>
            <script type="module" src="./main.ts"></script>
          </head>
        </html>`,
    );
    project.addFile('entrypoints/popup/main.ts', `logHello('popup')`);

    await project.build({
      vite: () => ({
        build: {
          // Make output for snapshot readible
          minify: false,
        },
      }),
    });

    expect(await project.serializeFile('.output/chrome-mv3/background.js'))
      .toMatchInlineSnapshot(`
        ".output/chrome-mv3/background.js
        ----------------------------------------
        var background = function() {
          "use strict";
          var _a, _b;
          function defineBackground(arg) {
            if (arg == null || typeof arg === "function") return { main: arg };
            return arg;
          }
          function logHello(name) {
            console.log(\`Hello \${name}!\`);
          }
          background;
          const definition = defineBackground({
            main() {
              logHello("background");
            }
          });
          background;
          function initPlugins() {
          }
          // @ts-expect-error
          ((_b = (_a = globalThis.browser) == null ? void 0 : _a.runtime) == null ? void 0 : _b.id) == null ? globalThis.chrome : (
            // @ts-expect-error
            globalThis.browser
          );
          function print(method, ...args) {
            return;
          }
          const logger = {
            debug: (...args) => print(console.debug, ...args),
            log: (...args) => print(console.log, ...args),
            warn: (...args) => print(console.warn, ...args),
            error: (...args) => print(console.error, ...args)
          };
          let result;
          try {
            initPlugins();
            result = definition.main();
            if (result instanceof Promise) {
              console.warn(
                "The background's main() function return a promise, but it must be synchronous"
              );
            }
          } catch (err) {
            logger.error("The background crashed on startup!");
            throw err;
          }
          const result$1 = result;
          return result$1;
        }();
        background;
        "
      `);
  });
});
