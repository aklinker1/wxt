/** @module wxt/utils/content-script-ui/integrated */
import { ContentScriptContext } from '../content-script-context';
import type { ContentScriptUi, ContentScriptUiOptions } from './types';
import { applyPosition, createMountFunctions, mountUi } from './shared';

/**
 * Create a content script UI without any isolation.
 *
 * @see https://wxt.dev/guide/essentials/content-scripts.html#integrated
 */
export function createIntegratedUi<TMounted>(
  ctx: ContentScriptContext,
  options: IntegratedContentScriptUiOptions<TMounted>,
): IntegratedContentScriptUi<TMounted> {
  const wrapper = document.createElement(options.tag || 'div');
  wrapper.setAttribute('data-wxt-integrated', '');

  let mounted: TMounted | undefined = undefined;
  const mount = () => {
    applyPosition(wrapper, undefined, options);
    mountUi(wrapper, options);
    mounted = options.onMount?.(wrapper);
  };
  const remove = () => {
    options.onRemove?.(mounted);
    wrapper.replaceChildren();
    wrapper.remove();
    mounted = undefined;
  };

  const mountFunctions = createMountFunctions(
    {
      mount,
      remove,
    },
    options,
  );

  ctx.onInvalidated(remove);

  return {
    get mounted() {
      return mounted;
    },
    wrapper,
    ...mountFunctions,
  };
}

/**
 * Shared types for the different `wxt/utils/content-script-ui/*` modules.
 * @module wxt/utils/content-script-ui/types
 */
export interface IntegratedContentScriptUi<TMounted>
  extends ContentScriptUi<TMounted> {
  /**
   * A wrapper div that assists in positioning.
   */
  wrapper: HTMLElement;
}

export type IntegratedContentScriptUiOptions<TMounted> =
  ContentScriptUiOptions<TMounted> & {
    /**
     * Tag used to create the wrapper element.
     *
     * @default "div"
     */
    tag?: string;
    /**
     * Callback executed when mounting the UI. This function should create and append the UI to the
     * `wrapper` element. It is called every time `ui.mount()` is called.
     *
     * Optionally return a value that can be accessed at `ui.mounted` or in the `onRemove` callback.
     */
    onMount: (wrapper: HTMLElement) => TMounted;
  };
