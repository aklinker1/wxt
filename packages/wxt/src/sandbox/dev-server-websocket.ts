import { logger } from './utils/logger';

interface WebSocketMessage {
  type: string;
  event: string;
  data?: any;
}

export interface WxtWebSocket extends WebSocket {
  addWxtEventListener(
    type: 'wxt:reload-extension',
    callback: (event: CustomEvent<undefined>) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;
  addWxtEventListener(
    type: 'wxt:reload-content-script',
    callback?: (event: CustomEvent<ReloadContentScriptPayload>) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;
  addWxtEventListener(
    type: 'wxt:reload-page',
    callback?: (event: CustomEvent<string>) => void,
    options?: AddEventListenerOptions | boolean,
  ): void;
  sendCustom(event: string, payload?: any): void;
}

let ws: WxtWebSocket | undefined;

/**
 * Connect to the websocket and listen for messages.
 *
 * @param onMessage Optional callback that is called when a message is recieved and we've verified
 *                  it's structure is what we expect.
 */
export function getDevServerWebSocket(): WxtWebSocket {
  if (import.meta.env.COMMAND !== 'serve')
    throw Error(
      'Must be running WXT dev command to connect to call getDevServerWebSocket()',
    );

  if (ws == null) {
    const serverUrl = __DEV_SERVER_ORIGIN__;
    logger.debug('Connecting to dev server @', serverUrl);

    ws = new WebSocket(serverUrl, 'vite-hmr') as WxtWebSocket;
    ws.addWxtEventListener = ws.addEventListener.bind(ws);
    ws.sendCustom = (event, payload) =>
      ws?.send(JSON.stringify({ type: 'custom', event, payload }));

    ws.addEventListener('open', () => {
      logger.debug('Connected to dev server');
    });
    ws.addEventListener('close', () => {
      logger.debug('Disconnected from dev server');
    });
    ws.addEventListener('error', (event) => {
      logger.error('Failed to connect to dev server', event);
    });

    ws.addEventListener('message', (e) => {
      try {
        const message = JSON.parse(e.data) as WebSocketMessage;
        if (message.type === 'custom') {
          ws?.dispatchEvent(
            new CustomEvent(message.event, { detail: message.data }),
          );
        }
      } catch (err) {
        logger.error('Failed to handle message', err);
      }
    });
  }

  return ws;
}

export interface ReloadContentScriptPayload {
  registration?: 'manifest' | 'runtime';
  contentScript: {
    matches: string[];
    js?: string[];
    css?: string[];
  };
}
