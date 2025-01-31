import { createPortMessageTransport } from './transports';
import { MessageTarget, MessageTransport, RemoveListener } from './types';

//
// PUBLIC API
//

/**
 * Register a service to execute when calling functions on a RPC proxy of the
 * same name in a different JS context. This function sets up a message
 * listener using the provided transport, and executes function specified, and
 * returns the response.
 *
 * @param name A unique identifier that connects the service passed into this
 *             function to RPC proxies created in other contexts.
 * @param service The function, class, object, or deeply nested object that
 *                will be executed when the RPC proxy in the other context is
 *                called.
 * @param transport The transport used when listening for messages. Defaults to
 *                  using `createPortMessageTransport()`.
 */
export function registerRpcService<TService>(
  name: string,
  service: TService,
  transport: MessageTransport = createPortMessageTransport(),
): RemoveListener {
  const messageType = getMessageType(name);

  return transport.onRequest<string, ProxyMessageData, unknown>(
    messageType,
    async ({ path, params }) => {
      const { fn, thisArg } = path.reduce<any>(
        ({ fn }, key) => ({ fn: fn[key], thisArg: fn }),
        { fn: service, thisArg: undefined },
      );
      return await fn.apply(thisArg, params);
    },
  );
}

export function createRpcProxy<TService>(
  name: string,
  transport: MessageTransport = createPortMessageTransport(),
): AsyncRpcService<TService> {
  const messageType = getMessageType(name);

  const deepProxy = (path: string[] = []): any => {
    const proxy = new Proxy(() => {}, {
      // Executed when the proxy is called as a function
      apply(_target, _thisArg, params) {
        return transport.sendRequest<string, ProxyMessageData, unknown>(
          messageType,
          { path, params },
        );
      },

      // Executed when accessing a property on the proxy
      get(target, propertyName, receiver) {
        if (propertyName === '__proxy' || typeof propertyName === 'symbol') {
          return Reflect.get(target, propertyName, receiver);
        }
        return deepProxy([...path, propertyName]);
      },
    });
    // @ts-expect-error: Adding a hidden property
    proxy.__proxy = true;
    return proxy;
  };

  return deepProxy();
}

function getMessageType(name: string): string {
  return `wxt:rpc-proxy:${name}`;
}

//
// TYPES
//

export type RpcFunction = (...args: any[]) => any;

/**
 * Ensure's a function's return type is a promise.
 */
export type AsyncRpcFunction<T extends RpcFunction> =
  T extends () => Promise<any>
    ? T
    : (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;

/**
 * Ensures the return type of all functions in TService are promises.
 */
export type AsyncRpcService<TService> = TService extends RpcFunction
  ? AsyncRpcFunction<TService>
  : TService extends Record<string, any>
    ? {
        [key in keyof TService]: AsyncRpcService<TService[key]>;
      }
    : never;

interface ProxyMessageData {
  path: string[];
  params: any[];
}
