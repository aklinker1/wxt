import { logger } from '../utils/internal/logger';
import { getDevServerWebSocket } from '../utils/internal/dev-server-websocket';

if (import.meta.env.COMMAND === 'serve') {
  try {
    const ws = getDevServerWebSocket();
    ws.addWxtEventListener('wxt:reload-page', (event) => {
      // "popup.html" === "/popup.html".substring(1)
      if (event.detail === location.pathname.substring(1)) location.reload();
    });
  } catch (err) {
    logger.error('Failed to setup web socket connection with dev server', err);
  }
}
