import { MessageMetadata, MessageTransport } from '../types';
import { createNanoEvents } from 'nanoevents';
import { browser, Runtime } from 'wxt/browser';

export enum MessageTransportPort {
  runtime = 'runtime',
  tab = 'tab',
}

/**
 * Creates a MessageTransport that connects to a port in another extension or tab.
 * @param type PortType
 * @param id Extension id or tab id
 * @returns MessageTransport
 */
export function createPortMessageTransport<T extends MessageTransportPort>(
  /**
   * The type of port to connect to. Defaults to "runtime", which is the
   * background script's port.
   * @default "runtime"
   */
  type: T = MessageTransportPort.runtime as T,
  /**
   * The id of the extension or tab to connect to. Defaults to the current extension, is required if type is "tab".
   */
  id?: T extends MessageTransportPort.tab ? number : string,
): MessageTransport {
  const events = createNanoEvents<{
    message: (
      message: MessageMetadata<string, any> & {
        sender: Runtime.MessageSender;
      },
    ) => void;
    response: (
      requestId: number,
      response: { type: 'success'; res: any } | { type: 'error'; err: unknown },
    ) => void;
  }>();

  let otherContextPort: Runtime.Port | undefined = undefined;
  let connectedPorts: Runtime.Port[] = [];

  return {
    async close() {
      for (const port of connectedPorts) {
        port.disconnect();
      }
      otherContextPort?.disconnect();
    },
    onRequest(onRequestType, onMessage) {
      const listener = (port: Runtime.Port) => {
        if (port.name !== onRequestType) return;
        if (id) {
          //* Make sure tab id matches if type is tab
          if (type === MessageTransportPort.tab && port.sender?.tab?.id !== id)
            return;
          //* Make sure extension id matches if type is runtime
          if (type === MessageTransportPort.runtime && port.sender?.id !== id)
            return;
        }

        connectedPorts.push(port);
        port.onMessage.addListener((message, port) => {
          events.emit('message', { ...message, sender: port.sender });
        });
        port.onDisconnect.addListener((disconnectedPort) => {
          connectedPorts = connectedPorts.filter(
            (port) => port !== disconnectedPort,
          );
        });
      };

      browser.runtime.onConnect.addListener(listener);

      const unbind = events.on('message', async (message) => {
        if (message.type !== onRequestType) return;

        const returnTo = connectedPorts.find((port) => {
          if (port.sender?.tab?.id !== message.sender.tab?.id) return false;
          if (port.sender?.id !== message.sender.id) return false;
          return true;
        });

        try {
          const res = await onMessage(message.data, message as any);

          returnTo?.postMessage({
            type: 'success',
            id: message.id,
            res,
          });
        } catch (err) {
          returnTo?.postMessage({
            id: message.id,
            err,
          });
        }
      });

      return () => {
        for (const port of connectedPorts) {
          port.disconnect();
        }
        connectedPorts = [];
        browser.runtime.onConnect.removeListener(listener);
        unbind();
      };
    },
    sendRequest(sendRequestType, data, target) {
      const name = sendRequestType as string;
      const message: MessageMetadata<string, any> = {
        id: Math.random(),
        data,
        type: name,
        sentAt: Date.now(),
        sender: undefined,
        target,
      };
      return new Promise((resolve, reject) => {
        if (!otherContextPort) {
          try {
            //TODO How do I catch the runtime.error when you reload the extension?
            if (type === MessageTransportPort.runtime) {
              if (id) {
                if (typeof id !== 'string')
                  throw Error(
                    'id must be a string when connecting to a runtime port',
                  );

                otherContextPort = browser.runtime.connect(id, {
                  name: name,
                });
              } else
                otherContextPort = browser.runtime.connect({
                  name: name,
                });
            } else {
              if (typeof id !== 'number')
                throw Error(
                  'id must be a number when connecting to a tab port',
                );

              otherContextPort = browser.tabs.connect(id, {
                name: name,
              });
            }

            otherContextPort.onMessage.addListener((message) => {
              events.emit('response', message.id, message);
            });
            otherContextPort.onDisconnect.addListener(() => {
              const error = browser.runtime.lastError;
              if (error) reject(error);
              otherContextPort = undefined;
              connectedPorts = connectedPorts.filter(
                (port) => port !== otherContextPort,
              );
            });
          } catch (err) {
            reject(err);
          }

          //TODO: Remove listener on unbind
        }

        const unbind = events.on('response', (messageId, response) => {
          if (messageId !== message.id) return;

          if (response.type === 'success') resolve(response.res);
          else reject(response.err);

          unbind();
        });

        otherContextPort?.postMessage(message);
      });
    },
  };
}
