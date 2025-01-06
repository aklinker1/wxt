import {
  defineContentScript,
  ContentScriptContext,
  createShadowRootUi,
} from '#imports';
import { render } from 'solid-js/web';

export default defineContentScript({
  matches: ['*://*/*'],

  async main(ctx) {
    const ui = await createUi(ctx);
    ui.mount();
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: 'solid-ui',
    position: 'inline',
    append: 'first',
    onMount(container) {
      return render(() => <App />, container);
    },
    onRemove(unmount) {
      unmount?.();
    },
  });
}
