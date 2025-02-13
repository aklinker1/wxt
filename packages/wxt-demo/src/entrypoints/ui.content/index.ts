import 'uno.css';
import './style.css';
import manualStyle from './manual-style.css?inline';

export default defineContentScript({
  matches: ['https://*.duckduckgo.com/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const style = document.createElement('style');
    style.textContent = manualStyle;
    document.head.append(style);

    const ui = await createShadowRootUi(ctx, {
      name: 'demo-ui',
      position: 'inline',
      append: 'before',
      anchor: 'form[role=search]',
      onMount: (container) => {
        const app = document.createElement('div');
        app.classList.add('m-4', 'text-red-500');
        app.textContent = i18n.t('prompt_for_name');
        container.append(app);
      },
    });
    ui.mount();

    setTimeout(ui.remove, 5000);
  },
});
