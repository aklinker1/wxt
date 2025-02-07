import { Plugin } from 'vite';
import { ResolvedConfig, WxtDevServer } from '../../../../types';

/**
 * Defines global constants about the dev server. Helps scripts connect to the server's web socket.
 */
export function devServerGlobals(
  config: ResolvedConfig,
  server: WxtDevServer | undefined,
): Plugin {
  return {
    name: 'wxt:dev-server-globals',
    config() {
      if (server == null || config.command == 'build') return;

      return {
        define: {
          __DEV_SERVER_ORIGIN__: JSON.stringify(
            server.origin.replace(/^http(s):/, 'ws$1:'),
          ),
        },
      };
    },
  };
}
