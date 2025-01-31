import { MessageMetadata, MessageTransport } from '../types';
import { createNanoEvents } from 'nanoevents';

type TestMessageMetadata = MessageMetadata<string, any>;

interface EventsMap {
  message: (message: TestMessageMetadata) => void;
  response: (
    requestId: number,
    response: { type: 'success'; res: any } | { type: 'error'; err: unknown },
  ) => void;
}

/**
 * Transport for unit testing. Calling either `send*` methods will trigger it's
 * own `on*` callbacks.
 */
export function createTestMessageTransport(): MessageTransport {
  const events = createNanoEvents<EventsMap>();

  return {
    async close() {},
    async sendBroadcast(type, data, target) {
      try {
        events.emit('message', {
          id: Math.random(),
          data,
          type: type as string,
          sentAt: Date.now(),
          sender: undefined,
          target,
        });
      } catch {
        // ignore
      }
    },
    onBroadcast(type, onMessage) {
      return events.on('message', (message) => {
        if (message.type !== type) return;

        onMessage(message.data, message as any);
      });
    },

    sendRequest(type, data, target) {
      const message: TestMessageMetadata = {
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
        events.emit('message', message);
      });
    },
    onRequest(type, onMessage) {
      return events.on('message', async (message) => {
        if (message.type !== type) return;

        try {
          const res = await onMessage(message.data, message as any);
          events.emit('response', message.id, { type: 'success', res });
        } catch (err) {
          events.emit('response', message.id, { type: 'error', err });
        }
      });
    },
  };
}

export interface TestTransport extends MessageTransport {
  id: number;
}
