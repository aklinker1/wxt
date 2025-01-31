import { createNanoEvents } from 'nanoevents';
import { MessageMetadata, MessageTransport } from '../types';

export function createWindowMessageTransport(): MessageTransport {
  const events = createNanoEvents<{
    message: (message: MessageMetadata<string, any>) => void;
    response: (
      requestId: number,
      response: { type: 'success'; res: any } | { type: 'error'; err: unknown },
    ) => void;
  }>();

  window.addEventListener('message', ({ data }) => {
    if (data.type === 'success' || data.err)
      events.emit('response', data.id, data);
  });

  return {
    sendRequest(type, data, target) {
      const message: MessageMetadata<string, any> = {
        id: Math.random(),
        data,
        type: type as string,
        sentAt: Date.now(),
        sender: undefined,
        target,
      };
      return new Promise((resolve, reject) => {
        const unbind = events.on('response', (messageId, response) => {
          if (messageId !== message.id) return;

          if (response.type === 'success') resolve(response.res);
          else reject(response.err);

          unbind();
        });

        window.postMessage(message);
      });
    },
    onRequest(type, onMessage) {
      window.addEventListener('message', async ({ data }) => {
        if (data.type !== type) return;
        try {
          const res = await onMessage(data.data, data as any);
          window.postMessage({
            type: 'success',
            id: data.id,
            res,
          });
        } catch (err) {
          window.postMessage({
            id: data.id,
            err,
          });
        }
      });
      return events.on('message', async (message) => {
        if (message.type !== type) return;
      });
    },
  };
}
