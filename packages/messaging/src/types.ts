export type RemoveListener = () => void;

export type ContentScriptId = string;

export type MessageTarget =
  | {
      target: 'background';
    }
  | {
      target: 'external';
    }
  | {
      target: 'content-script';
      tabId?: number;
      frameId?: number;
    }
  | {
      target: 'parent-content-script';
      id: ContentScriptId;
    }
  | {
      target: 'main-world';
      tabId?: number;
      frameId?: number;
    }
  | {
      target: 'child-main-world';
    }
  | {
      target: 'user-script';
      // TODO: Not sure what options should go here...
    };

export interface MessageMetadata<TType, TData> {
  id: number;
  sentAt: number;
  type: TType;
  data: TData;
  sender?: unknown; // Runtime.Sender
  target?: MessageTarget;
}

/**
 * Transport layer for sending and recieving messages between two "adjacent"
 * contexts. They are responsible for sending/recieving messages and properly
 * handling errors throw during `on*` callbacks.
 *
 * Transports are used by the higher-level messaging APIs as a low-level,
 * pluggable primative for controlling how messages are passed. You will likely
 * never use a transport directly, just pass them in as options.
 */
export interface MessageTransport {
  /**
   * Send a message without expecting a response.
   */
  sendBroadcast<TType, TData>(
    type: TType,
    data?: TData,
    target?: MessageTarget,
  ): Promise<void>;
  /**
   * Listen for broadcast messages of a specific type, returning a function to remove the listener.
   */
  onBroadcast<TType, TData>(
    type: TType,
    onMessage: (data: TData, metadata: MessageMetadata<TType, TData>) => void,
  ): RemoveListener;

  /**
   * Send a message and return the response.
   */
  sendRequest<TType, TData, TResponse>(
    type: TType,
    data?: TData,
    target?: MessageTarget,
  ): Promise<TResponse>;
  /**
   * Listen for messages of a specific type and respond to them.
   */
  onRequest<TType, TData, TResponse>(
    type: TType,
    onMessage: (
      data: TData,
      metadata: MessageMetadata<TType, TData>,
    ) => Promise<TResponse>,
  ): RemoveListener;

  /**
   * Close the transport, preventing any further messages from being sent or received.
   */
  close(): Promise<void>;
}

export interface ProtocolMap {
  [messageType: string]: (data: any) => any;
}
export type GetProtocolData<
  TProtocolMap extends ProtocolMap,
  TType extends keyof TProtocolMap,
> = Parameters<TProtocolMap[TType]>[0];
export type GetProtocolResponse<
  TProtocolMap extends ProtocolMap,
  TType extends keyof TProtocolMap,
> = Awaited<ReturnType<TProtocolMap[TType]>>;
