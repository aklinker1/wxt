import type * as vite from 'vite';
import {
  download,
  tsconfigPaths,
  globals,
  extensionApiMock,
  resolveAppConfig,
} from '../core/builders/vite/plugins';
import { InlineConfig } from '../types';
import { vitePlugin as unimportPlugin } from '../builtin-modules/unimport';
import { createUnimport } from 'unimport';
import { registerWxt, wxt } from '../core/wxt';

/**
 * Vite plugin that configures Vitest with everything required to test a WXT extension, based on the `<root>/wxt.config.ts`
 *
 * ```ts
 * // vitest.config.ts
 * import { defineConfig } from 'vitest/config';
 * import { WxtVitest } from 'wxt/testing';
 *
 * export default defineConfig({
 *   plugins: [WxtVitest()],
 * });
 * ```
 *
 * @param inlineConfig Customize WXT's config for testing. Any config specified here overrides the config from your `wxt.config.ts` file.
 */
export async function WxtVitest(
  inlineConfig?: InlineConfig,
): Promise<vite.PluginOption[]> {
  await registerWxt('serve', inlineConfig ?? {});

  const plugins: vite.PluginOption[] = [
    globals(wxt.config),
    download(wxt.config),
    tsconfigPaths(wxt.config),
    resolveAppConfig(wxt.config),
    extensionApiMock(wxt.config),
  ];
  const unimport = createUnimport(wxt.config.imports);
  await unimport.init();
  plugins.push(unimportPlugin(unimport, !wxt.config.imports.disabled));

  return plugins;
}
