/** @module wxt/utils/content-script-ui/iframe */
import { browser } from 'wxt/browser';
import { ContentScriptContext } from '../content-script-context';
import type { ContentScriptUi, ContentScriptUiOptions } from './types';
import { applyPosition, createMountFunctions, mountUi } from './shared';

/**
 * Create a content script UI using an iframe.
 *
 * @see https://wxt.dev/guide/essentials/content-scripts.html#iframe
 */
export function createIframeUi<TMounted>(
  ctx: ContentScriptContext,
  options: IframeContentScriptUiOptions<TMounted>,
): IframeContentScriptUi<TMounted> {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('data-wxt-iframe', '');
  const iframe = document.createElement('iframe');
  // @ts-expect-error: getURL is defined per-project, but not inside the package
  iframe.src = browser.runtime.getURL(options.page);
  wrapper.appendChild(iframe);

  let mounted: TMounted | undefined = undefined;
  const mount = () => {
    applyPosition(wrapper, iframe, options);
    mountUi(wrapper, options);
    mounted = options.onMount?.(wrapper, iframe);
  };
  const remove = () => {
    options.onRemove?.(mounted);
    wrapper.remove();
    mounted = undefined;
  };

  const mountFunctions = createMountFunctions({ mount, remove }, options);

  ctx.onInvalidated(remove);

  return {
    get mounted() {
      return mounted;
    },
    iframe,
    wrapper,
    ...mountFunctions,
  };
}

export interface IframeContentScriptUi<TMounted>
  extends ContentScriptUi<TMounted> {
  /**
   * The iframe added to the DOM.
   */
  iframe: HTMLIFrameElement;
  /**
   * A wrapper div that assists in positioning.
   */
  wrapper: HTMLDivElement;
}

export type IframeContentScriptUiOptions<TMounted> =
  ContentScriptUiOptions<TMounted> & {
    /**
     * The path to the HTML page that will be shown in the iframe. This string is passed into
     * `browser.runtime.getURL`.
     */
    // @ts-expect-error: HtmlPublicPath is generated per-project
    page: import('wxt/browser').HtmlPublicPath;
    /**
     * Callback executed when mounting the UI. Use this function to customize the iframe or wrapper
     * element's appearance. It is called every time `ui.mount()` is called.
     *
     * Optionally return a value that can be accessed at `ui.mounted` or in the `onRemove` callback.
     */
    onMount?: (wrapper: HTMLElement, iframe: HTMLIFrameElement) => TMounted;
  };
