import path from 'node:path';
import type * as vite from 'vite';
import { ResolvedConfig } from '../../../../types';

/**
 * Mock `wxt/browser` and stub the global `browser`/`chrome` types with a fake version of the extension APIs
 */
export function extensionApiMock(config: ResolvedConfig): vite.PluginOption {
  const virtualSetupModule = 'virtual:wxt-setup';
  const resolvedVirtualSetupModule = '\0' + virtualSetupModule;

  return {
    name: 'wxt:extension-api-mock',
    config() {
      const replacement = path.resolve(
        config.wxtModuleDir,
        'dist/virtual/mock-browser',
      );
      return {
        test: {
          setupFiles: [virtualSetupModule],
        },
        resolve: {
          alias: [
            // wxt/browser, wxt/browser/...
            { find: 'wxt/browser', replacement },
          ],
        },
        ssr: {
          // Inline all WXT modules subdependencies can be mocked
          noExternal: ['wxt'],
        },
      };
    },
    resolveId(id) {
      if (id.endsWith(virtualSetupModule)) return resolvedVirtualSetupModule;
    },
    load(id) {
      if (id === resolvedVirtualSetupModule) return setupTemplate;
    },
  };
}

const setupTemplate = `
  import { vi } from 'vitest';
  import { fakeBrowser } from 'wxt/testing';

  vi.stubGlobal("chrome", fakeBrowser);
  vi.stubGlobal("browser", fakeBrowser);
`;
