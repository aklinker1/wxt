import { Plugin } from 'vite';
import { VIRTUAL_NOOP_BACKGROUND_MODULE_ID } from '../../../utils/constants';

/**
 * In dev mode, if there's not a background script listed, we need to add one so that the web socket
 * connection is setup and the extension reloads HTML pages and content scripts correctly.
 */
export function noopBackground(): Plugin {
  const virtualModuleId = VIRTUAL_NOOP_BACKGROUND_MODULE_ID;
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  return {
    name: 'wxt:noop-background',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `import { defineBackground } from 'wxt/utils/define-background';\nexport default defineBackground(() => void 0)`;
      }
    },
  };
}
