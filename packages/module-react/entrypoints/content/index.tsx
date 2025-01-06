import {
  defineContentScript,
  ContentScriptContext,
  createShadowRootUi,
} from '#imports';
import React from 'react';
import ReactDOM from 'react-dom/client';

export default defineContentScript({
  matches: ['*://*/*'],

  async main(ctx) {
    const ui = await createUi(ctx);
    ui.mount();
  },
});

function createUi(ctx: ContentScriptContext) {
  return createShadowRootUi(ctx, {
    name: 'react-ui',
    position: 'inline',
    append: 'first',
    onMount(container) {
      const root = ReactDOM.createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      );
      return root;
    },
    onRemove(root) {
      root?.unmount();
    },
  });
}
