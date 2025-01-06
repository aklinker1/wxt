import { browser } from 'wxt/browser';

export class WxtLocationChangeEvent extends Event {
  static EVENT_NAME = getUniqueEventName('wxt:locationchange');

  constructor(
    readonly newUrl: URL,
    readonly oldUrl: URL,
  ) {
    super(WxtLocationChangeEvent.EVENT_NAME, {});
  }
}

/**
 * Returns an event name unique to the extension and content script that's running.
 */
export function getUniqueEventName(eventName: string): string {
  return `${browser?.runtime?.id}:${import.meta.env.ENTRYPOINT}:${eventName}`;
}
