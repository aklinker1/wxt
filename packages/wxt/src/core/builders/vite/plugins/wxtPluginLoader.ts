import { parseHTML } from 'linkedom';
import type * as vite from 'vite';
import { normalizePath } from '../../../utils/paths';
import { ResolvedConfig } from '../../../../types';

/**
 * Resolve and load plugins for each entrypoint. This handles both JS entrypoints via the `virtual:wxt-plugins` import, and HTML files by adding `virtual:wxt-html-plugins` to the document's `<head>`
 */
export function wxtPluginLoader(config: ResolvedConfig): vite.Plugin {
  const virtualModuleId = 'virtual:wxt-plugins';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
  const virtualHtmlModuleId = 'virtual:wxt-html-plugins';
  const resolvedVirtualHtmlModuleId = '\0' + virtualHtmlModuleId;

  return {
    name: 'wxt:plugin-loader',
    resolveId(id) {
      if (id === virtualModuleId) return resolvedVirtualModuleId;
      if (id === virtualHtmlModuleId) return resolvedVirtualHtmlModuleId;
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        // Import and init all plugins
        const imports = config.plugins
          .map(
            (plugin, i) =>
              `import initPlugin${i} from '${normalizePath(plugin)}';`,
          )
          .join('\n');
        const initCalls = config.plugins
          .map((_, i) => `  initPlugin${i}();`)
          .join('\n');
        return `${imports}\n\nexport function initPlugins() {\n${initCalls}\n}`;
      }
      if (id === resolvedVirtualHtmlModuleId) {
        return `import { initPlugins } from '${virtualModuleId}';

try {
  initPlugins();
} catch (err) {
  console.error("[wxt] Failed to initialize plugins", err);
}`;
      }
    },
    transformIndexHtml: {
      // Use "pre" so the new script is added before vite bundles all the scripts
      order: 'pre',
      handler(html, _ctx) {
        const src =
          config.command === 'serve'
            ? `${config.dev.server?.origin}/@id/${virtualHtmlModuleId}`
            : virtualHtmlModuleId;

        const { document } = parseHTML(html);
        const existing = document.querySelector(`script[src='${src}']`);
        if (existing) return;

        const script = document.createElement('script');
        script.type = 'module';
        script.src = src;

        if (document.head == null) {
          const newHead = document.createElement('head');
          document.documentElement.prepend(newHead);
        }
        document.head.prepend(script);
        return document.toString();
      },
    },
  };
}
