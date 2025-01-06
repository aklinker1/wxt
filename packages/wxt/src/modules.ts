/**
 * Utilities for creating [WXT Modules](https://wxt.dev/guide/essentials/wxt-modules.html).
 *
 * @module wxt/modules
 */
import type {
  Entrypoint,
  Wxt,
  WxtModule,
  WxtModuleOptions,
  WxtModuleSetup,
} from './types';
import * as vite from 'vite';
import glob from 'fast-glob';
import { resolve } from 'node:path';
import type { UnimportOptions } from 'unimport';

// Re-export to prevent TS2742 type errors
export { WxtModule };

export function defineWxtModule<TOptions extends WxtModuleOptions>(
  module: WxtModule<TOptions> | WxtModuleSetup<TOptions>,
): WxtModule<TOptions> {
  if (typeof module === 'function') return { setup: module };
  return module;
}

/**
 * Adds a TS/JS file as an entrypoint to the project. This file will be bundled
 * along with the other entrypoints.
 *
 * If you're publishing the module to NPM, you should probably pre-build the
 * entrypoint and use `addPublicAssets` instead to copy pre-bundled assets into
 * the output directory. This will speed up project builds since it just has to
 * copy some files instead of bundling them.
 *
 * To extract entrypoint options from a JS/TS file, use
 * `wxt.builder.importEntrypoint` (see example).
 *
 * @param wxt The wxt instance provided by the module's setup function.
 * @param entrypoint The entrypoint to be bundled along with the extension.
 *
 * @example
 * export default defineWxtModule(async (wxt, options) => {
 *   const entrypointPath = "/path/to/my-entrypoint.ts";
 *   addEntrypoint(wxt, {
 *     type: "content-script",
 *     name: "some-name",
 *     inputPath: entrypointPath,
 *     outputDir: wxt.config.outDir,
 *     options: await wxt.builder.importEntrypoint(entrypointPath),
 *   });
 * });
 */
export function addEntrypoint(wxt: Wxt, entrypoint: Entrypoint): void {
  wxt.hooks.hook('entrypoints:resolved', (_, entrypoints) => {
    entrypoints.push(entrypoint);
  });
}

/**
 * Copy files inside a directory (as if it were the public directory) into the
 * extension's output directory. The directory itself is not copied, just the
 * files inside it. If a filename matches an existing one, it is ignored.
 *
 * @param wxt The wxt instance provided by the module's setup function.
 * @param dir The directory to copy.
 *
 * @example
 * export default defineWxtModule((wxt, options) => {
 *   addPublicAssets(wxt, "./dist/prebundled");
 * });
 */
export function addPublicAssets(wxt: Wxt, dir: string): void {
  wxt.hooks.hook('build:publicAssets', async (wxt, files) => {
    const moreFiles = await glob('**/*', { cwd: dir });
    if (moreFiles.length === 0) {
      wxt.logger.warn('No files to copy in', dir);
      return;
    }
    moreFiles.forEach((file) => {
      files.unshift({ absoluteSrc: resolve(dir, file), relativeDest: file });
    });
  });
}

/**
 * Merge additional vite config for one or more entrypoint "groups" that make
 * up individual builds. Config in the project's `wxt.config.ts` file takes
 * precedence over any config added by this function.
 *
 * @param wxt The wxt instance provided by the module's setup function.
 * @param viteConfig A function that returns the vite config the module is
                     adding. Same format as `vite` in `wxt.config.ts`.
 *
 * @example
 * export default defineWxtModule((wxt, options) => {
 *   addViteConfig(wxt, () => ({
 *     build: {
 *       sourceMaps: true,
 *     },
 *   });
 * });
 */
export function addViteConfig(
  wxt: Wxt,
  viteConfig: (env: vite.ConfigEnv) => vite.UserConfig | undefined,
): void {
  wxt.hooks.hook('config:resolved', (wxt) => {
    const userVite = wxt.config.vite;
    wxt.config.vite = async (env) => {
      const fromUser = await userVite(env);
      const fromModule = viteConfig(env) ?? {};
      return vite.mergeConfig(fromModule, fromUser);
    };
  });
}

/**
 * Add a runtime plugin to the project. In each entrypoint, before executing
 * the `main` function, plugins are executed.
 *
 * @param wxt The wxt instance provided by the module's setup function.
 * @param plugin An import from an NPM module, or an absolute file path to the
 *               file to load at runtime.
 *
 * @example
 * export default defineWxtModule((wxt) => {
 *   addWxtPlugin(wxt, "wxt-module-analytics/client-plugin");
 * });
 */
export function addWxtPlugin(wxt: Wxt, plugin: string): void {
  wxt.hooks.hook('config:resolved', (wxt) => {
    wxt.config.plugins.push(plugin);
  });
}

/**
 * Add an Unimport preset ([built-in](https://github.com/unjs/unimport?tab=readme-ov-file#built-in-presets),
 * [custom](https://github.com/unjs/unimport?tab=readme-ov-file#custom-presets),
 * or [auto-scanned](https://github.com/unjs/unimport?tab=readme-ov-file#exports-auto-scan)),
 * to the project's list of auto-imported utilities.
 *
 * Some things to note:
 * - This function will only de-duplicate built-in preset names. It will not
 *   stop you adding duplicate custom or auto-scanned presets.
 * - If the project has disabled imports, this function has no effect.
 *
 * @param wxt The wxt instance provided by the module's setup function.
 * @param preset The preset to add to the project.
 *
 * @example
 * export default defineWxtModule((wxt) => {
 *   // Built-in preset:
 *   addImportPreset(wxt, "vue");
 *   // Custom preset:
 *   addImportPreset(wxt, {
 *     from: "vue",
 *     imports: ["ref", "reactive", ...],
 *   });
 *   // Auto-scanned preset:
 *   addImportPreset(wxt, { package: "vue" });
 * });
 */
export function addImportPreset(
  wxt: Wxt,
  preset: UnimportOptions['presets'][0],
): void {
  wxt.hooks.hook('config:resolved', (wxt) => {
    // In older versions of WXT, `wxt.config.imports` could be false
    if (!wxt.config.imports) return;

    wxt.config.imports.presets ??= [];
    // De-dupelicate built-in named presets
    if (wxt.config.imports.presets.includes(preset)) return;

    wxt.config.imports.presets.push(preset);
  });
}

/**
 * Adds an import alias to the project's TSConfig paths and bundler. Path can
 * be absolute or relative to the project's root directory.
 *
 * Usually, this is used to provide access to some code generated by your
 * module. In the example below, a `i18n` plugin generates a variable that it
 * wants to provide access to, so it creates the file and adds an import alias
 * to it.
 *
 * @example
 * import path from 'node:path';
 *
 * export default defineWxtModule((wxt) => {
 *   const i18nPath = path.resolve(wxt.config.wxtDir, "i18n.ts");
 *
 *   // Generate the file
 *   wxt.hooks.hook("prepare:types", (_, entries) => {
 *     entries.push({
 *       path: i18nPath,
 *       text: `export const i18n = ...`,
 *     });
 *   });
 *
 *   // Add alias
 *   addAlias(wxt, "#i18n", i18nPath);
 * });
 */
export function addAlias(wxt: Wxt, alias: string, path: string) {
  wxt.hooks.hook('config:resolved', (wxt) => {
    const target = resolve(wxt.config.root, path);
    if (wxt.config.alias[alias] != null && wxt.config.alias[alias] !== target) {
      wxt.logger.warn(
        `Skipped adding alias (${alias} => ${target}) because an alias with the same name already exists: ${alias} => ${wxt.config.alias[alias]}`,
      );
      return;
    }
    wxt.config.alias[alias] = target;
  });
}
