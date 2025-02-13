import 'wxt';
import 'wxt/sandbox';
import {
  addAlias,
  addViteConfig,
  addWxtPlugin,
  defineWxtModule,
} from 'wxt/modules';
import { relative, resolve } from 'node:path';
import type { AnalyticsConfig } from './types';

declare module 'wxt/sandbox' {
  export interface WxtAppConfig {
    analytics: AnalyticsConfig;
  }
}

export default defineWxtModule({
  name: 'analytics',
  imports: [{ name: 'analytics', from: '#analytics' }],
  setup(wxt) {
    // Paths
    const wxtAnalyticsFolder = resolve(wxt.config.wxtDir, 'analytics');
    const wxtAnalyticsIndex = resolve(wxtAnalyticsFolder, 'index.ts');
    const clientModuleId = import.meta.env.NPM
      ? '@wxt-dev/analytics'
      : resolve(wxt.config.modulesDir, 'analytics/client');
    const pluginModuleId = import.meta.env.NPM
      ? '@wxt-dev/analytics/background-plugin'
      : resolve(wxt.config.modulesDir, 'analytics/background-plugin');

    // Add required permissions
    wxt.hook('build:manifestGenerated', (_, manifest) => {
      manifest.permissions ??= [];
      if (!manifest.permissions.includes('storage')) {
        manifest.permissions.push('storage');
      }
    });

    // Generate #analytics module
    const wxtAnalyticsCode = [
      `import { createAnalytics } from '${
        import.meta.env.NPM
          ? clientModuleId
          : relative(wxtAnalyticsFolder, clientModuleId)
      }';`,
      `import { useAppConfig } from 'wxt/client';`,
      ``,
      `export const analytics = createAnalytics(useAppConfig().analytics);`,
      ``,
    ].join('\n');
    addAlias(wxt, '#analytics', wxtAnalyticsIndex);
    wxt.hook('prepare:types', async (_, entries) => {
      entries.push({
        path: wxtAnalyticsIndex,
        text: wxtAnalyticsCode,
      });
    });

    // Ensure there is a background entrypoint
    wxt.hook('entrypoints:resolved', (_, entrypoints) => {
      const hasBackground = entrypoints.find(
        (entry) => entry.type === 'background',
      );
      if (!hasBackground) {
        entrypoints.push({
          type: 'background',
          inputPath: 'virtual:user-background',
          name: 'background',
          options: {},
          outputDir: wxt.config.outDir,
          skipped: false,
        });
      }
    });

    // Ensure analytics is initialized in every context, mainly the background.
    // TODO: Once there's a way to filter which entrypoints a plugin is applied to, only apply this to the background
    addWxtPlugin(wxt, pluginModuleId);

    // Fix issues with dependencies
    addViteConfig(wxt, () => ({
      optimizeDeps: {
        // Ensure the "#analytics" import is processed by vite in the background plugin
        exclude: ['@wxt-dev/analytics'],
        // Ensure the CJS subdependency is preprocessed into ESM
        include: ['@wxt-dev/analytics > ua-parser-js'],
      },
    }));
  },
});
