import { ProtocolMap } from './types';

/**
 * TODO - events API
 */
export function createGlobalEvents<
  TProtocolMap extends ProtocolMap = ProtocolMap,
>(): EventBus<TProtocolMap> {
  throw Error('TODO');
}

export interface EventBus<TProtocolMap extends ProtocolMap> {
  // TODO
}
