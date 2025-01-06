import { ContentScriptContext } from '../content-script-context';
import { WxtLocationChangeEvent } from './custom-events';

/**
 * Create a util that watches for URL changes, dispatching the custom event when detected. Stops
 * watching when content script is invalidated.
 */
export function createLocationWatcher(ctx: ContentScriptContext) {
  let interval: number | undefined;
  let oldUrl: URL;

  return {
    /**
     * Ensure the location watcher is actively looking for URL changes. If it's already watching,
     * this is a noop.
     */
    run() {
      if (interval != null) return;

      oldUrl = new URL(location.href);
      interval = ctx.setInterval(() => {
        let newUrl = new URL(location.href);
        if (newUrl.href !== oldUrl.href) {
          window.dispatchEvent(new WxtLocationChangeEvent(newUrl, oldUrl));
          oldUrl = newUrl;
        }
      }, 1e3);
    },
  };
}
