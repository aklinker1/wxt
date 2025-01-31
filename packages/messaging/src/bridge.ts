import type {
  GetProtocolData,
  GetProtocolResponse,
  ProtocolMap,
  RemoveListener,
} from './types';

/**
 * Create a messaging API that can directly send messages to any JS context.
 */
export function createMessageBridge<
  TProtocolMap extends ProtocolMap = ProtocolMap,
>(): MessageBridge<TProtocolMap> {
  throw Error('TODO');
}

export interface MessageBridge<TProtocolMap extends ProtocolMap> {
  send: <TType extends keyof TProtocolMap>(
    type: TType,
    data: GetProtocolData<TProtocolMap, TType>,
  ) => GetProtocolResponse<TProtocolMap, TType>;
  onMessage: () => RemoveListener;
}
