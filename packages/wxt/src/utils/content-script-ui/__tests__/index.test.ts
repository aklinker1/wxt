/** @vitest-environment happy-dom */
import { describe, it, beforeEach, vi, expect, afterEach } from 'vitest';
import { createIntegratedUi } from '../integrated';
import { createIframeUi } from '../iframe';
import { createShadowRootUi } from '../shadow-root';
import { ContentScriptContext } from '../../content-script-context';
import { ContentScriptUi } from '../types';

/**
 * Util for floating promise.
 */
async function runMicrotasks() {
  return await new Promise((resolve) => setTimeout(resolve, 0));
}

function appendTestApp(container: HTMLElement) {
  container.innerHTML = '<app>Hello world</app>';
}

function appendTestElement({
  tagName = 'div',
  id,
}: {
  tagName?: string;
  id: string;
}) {
  const parent = document.querySelector('#parent');
  if (!parent) {
    throw Error(
      'Parent element not found. Please check the testing environment DOM',
    );
  }
  const element = document.createElement(tagName);
  element.id = id;
  parent.append(element);
  return element;
}

const fetch = vi.fn();

describe('Content Script UIs', () => {
  let ctx: ContentScriptContext;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="parent">
        <p id="one">one</p>
        <p id="two">two</p>
        <p id="three"></p>
      </div>
    `;
    window.fetch = fetch;
    fetch.mockResolvedValue({ text: () => Promise.resolve('') });
    ctx = new ContentScriptContext('test');
  });

  describe('type', () => {
    describe('integrated', () => {
      it('should add a wrapper and custom UI to the page', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          onMount: appendTestApp,
        });
        ui.mount();

        expect(
          document.querySelector('div[data-wxt-integrated]'),
        ).not.toBeNull();
        expect(document.querySelector('app')).not.toBeNull();
      });

      it('should allow customizing the wrapper tag', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          tag: 'pre',
          onMount: appendTestApp,
        });
        ui.mount();

        expect(
          document.querySelector('pre[data-wxt-integrated]'),
        ).not.toBeNull();
        expect(document.querySelector('app')).not.toBeNull();
      });
    });

    describe('iframe', () => {
      it('should add a wrapper and iframe to the page', () => {
        const ui = createIframeUi(ctx, {
          page: '/page.html',
          position: 'inline',
        });
        ui.mount();

        expect(document.querySelector('div[data-wxt-iframe]')).toBeDefined();
        expect(document.querySelector('iframe')).toBeDefined();
      });
    });

    describe('shadow-root', () => {
      it('should load a shadow root to the page', async () => {
        const ui = await createShadowRootUi(ctx, {
          position: 'inline',
          name: 'test-component',
          onMount(uiContainer) {
            appendTestApp(uiContainer);
          },
        });
        ui.mount();

        expect(
          document.querySelector('test-component[data-wxt-shadow-root]'),
        ).not.toBeNull();
        expect(ui.shadow.querySelector('app')).not.toBeNull();
      });

      it.each([
        ['open', 'open'],
        [undefined, 'open'],
        ['closed', 'closed'],
      ] as const)(
        'should respect the shadow root mode (%s -> %s)',
        async (input, expected) => {
          const ui = await createShadowRootUi(ctx, {
            position: 'inline',
            name: 'test-component',
            mode: input,
            onMount: appendTestApp,
          });

          expect(ui.shadow.mode).toBe(expected);
        },
      );
    });
  });

  describe('position', () => {
    describe('inline', () => {
      it('should wrap the UI in a simple div', () => {
        const ui = createIframeUi(ctx, {
          position: 'inline',
          page: '/page.html',
        });

        expect(ui.wrapper.outerHTML).toMatchInlineSnapshot(
          `"<div data-wxt-iframe=""><iframe src="chrome-extension://test-extension-id/page.html"></iframe></div>"`,
        );
      });
    });

    describe('overlay', () => {
      it('should wrap the UI in a positioned div when alignment=undefined', () => {
        const ui = createIframeUi(ctx, {
          position: 'overlay',
          page: '/page.html',
        });
        ui.mount();

        expect(ui.wrapper.outerHTML).toMatchInlineSnapshot(
          `"<div data-wxt-iframe="" style="overflow: visible; position: relative; width: 0px; height: 0px; display: block;"><iframe src="chrome-extension://test-extension-id/page.html" style="position: absolute; top: 0px; left: 0px;"></iframe></div>"`,
        );
      });

      it('should wrap the UI in a positioned div when alignment=top-left', () => {
        const ui = createIframeUi(ctx, {
          position: 'overlay',
          page: '/page.html',
          alignment: 'top-left',
        });
        ui.mount();

        expect(ui.wrapper.outerHTML).toMatchInlineSnapshot(
          `"<div data-wxt-iframe="" style="overflow: visible; position: relative; width: 0px; height: 0px; display: block;"><iframe src="chrome-extension://test-extension-id/page.html" style="position: absolute; top: 0px; left: 0px;"></iframe></div>"`,
        );
      });

      it('should wrap the UI in a positioned div when alignment=top-right', () => {
        const ui = createIframeUi(ctx, {
          position: 'overlay',
          page: '/page.html',
          alignment: 'top-right',
        });
        ui.mount();

        expect(ui.wrapper.outerHTML).toMatchInlineSnapshot(
          `"<div data-wxt-iframe="" style="overflow: visible; position: relative; width: 0px; height: 0px; display: block;"><iframe src="chrome-extension://test-extension-id/page.html" style="position: absolute; top: 0px; right: 0px;"></iframe></div>"`,
        );
      });

      it('should wrap the UI in a positioned div when alignment=bottom-right', () => {
        const ui = createIframeUi(ctx, {
          position: 'overlay',
          page: '/page.html',
          alignment: 'bottom-right',
        });
        ui.mount();

        expect(ui.wrapper.outerHTML).toMatchInlineSnapshot(
          `"<div data-wxt-iframe="" style="overflow: visible; position: relative; width: 0px; height: 0px; display: block;"><iframe src="chrome-extension://test-extension-id/page.html" style="position: absolute; bottom: 0px; right: 0px;"></iframe></div>"`,
        );
      });

      it('should wrap the UI in a positioned div when alignment=bottom-left', () => {
        const ui = createIframeUi(ctx, {
          position: 'overlay',
          page: '/page.html',
          alignment: 'bottom-left',
        });
        ui.mount();

        expect(ui.wrapper.outerHTML).toMatchInlineSnapshot(
          `"<div data-wxt-iframe="" style="overflow: visible; position: relative; width: 0px; height: 0px; display: block;"><iframe src="chrome-extension://test-extension-id/page.html" style="position: absolute; bottom: 0px; left: 0px;"></iframe></div>"`,
        );
      });

      it('should respect the provided zIndex', () => {
        const zIndex = 123;
        const ui = createIframeUi(ctx, {
          position: 'overlay',
          page: '/page.html',
          zIndex,
        });
        ui.mount();

        expect(ui.wrapper.style.zIndex).toBe(String(zIndex));
      });
    });

    describe('modal', () => {
      it('should wrap the UI in a div with a fixed position', () => {
        const ui = createIframeUi(ctx, {
          position: 'modal',
          page: '/page.html',
        });
        ui.mount();

        expect(ui.wrapper.outerHTML).toMatchInlineSnapshot(
          `"<div data-wxt-iframe="" style="overflow: visible; position: relative; width: 0px; height: 0px; display: block;"><iframe src="chrome-extension://test-extension-id/page.html" style="position: fixed; top: 0px; bottom: 0px; left: 0px; right: 0px;"></iframe></div>"`,
        );
      });

      it('should respect the provided zIndex', () => {
        const zIndex = 123;
        const ui = createIframeUi(ctx, {
          position: 'modal',
          page: '/page.html',
          zIndex,
        });
        ui.mount();

        expect(ui.wrapper.style.zIndex).toBe(String(zIndex));
      });
    });
  });

  describe('anchor', () => {
    describe('undefined', () => {
      it('should append the element to the body', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          onMount: appendTestApp,
        });
        ui.mount();

        expect(
          document.querySelector('body > div[data-wxt-integrated]'),
        ).not.toBeNull();
      });
    });

    describe('string', () => {
      it('should append the element using the specified query selector', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          onMount: appendTestApp,
          anchor: '#parent',
        });
        ui.mount();

        expect(
          document.querySelector('#parent > div[data-wxt-integrated]'),
        ).not.toBeNull();
      });

      it('should append the element using an XPath string', () => {
        vi.stubGlobal('XPathResult', { FIRST_ORDERED_NODE_TYPE: 9 });
        document.evaluate = vi.fn().mockReturnValue({
          singleNodeValue: document.querySelector('#three'),
        });

        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          onMount: appendTestApp,
          anchor: '//p[@id="three"]',
        });
        ui.mount();

        expect(
          document.querySelector('#three > div[data-wxt-integrated]'),
        ).not.toBeNull();
      });
    });

    describe('Element', () => {
      it('should append the element using the specified element', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          onMount: appendTestApp,
          anchor: document.getElementById('parent'),
        });
        ui.mount();

        expect(
          document.querySelector('#parent > div[data-wxt-integrated]'),
        ).not.toBeNull();
      });
    });

    describe('function', () => {
      it('should append the element using the specified function', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          onMount: appendTestApp,
          anchor: () => document.getElementById('parent'),
        });
        ui.mount();

        expect(
          document.querySelector('#parent > div[data-wxt-integrated]'),
        ).not.toBeNull();
      });
    });

    it('should throw an error when the anchor does not exist', () => {
      const ui = createIntegratedUi(ctx, {
        position: 'inline',
        onMount: appendTestApp,
        anchor: () => document.getElementById('i-do-not-exist'),
      });

      expect(ui.mount).toThrow();
    });
  });

  describe('append', () => {
    describe.each([undefined, 'last'] as const)('%s', (append) => {
      it('should append the element as the last child of the anchor', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          anchor: '#parent',
          append,
          onMount: appendTestApp,
        });
        ui.mount();

        expect(
          document.querySelector(
            '#parent > div[data-wxt-integrated]:last-child',
          ),
        ).not.toBeNull();
      });
    });

    describe('first', () => {
      it('should append the element as the last child of the anchor', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          anchor: '#parent',
          append: 'first',
          onMount: appendTestApp,
        });
        ui.mount();

        expect(
          document.querySelector(
            '#parent > div[data-wxt-integrated]:first-child',
          ),
        ).not.toBeNull();
      });
    });

    describe('replace', () => {
      it('should replace the the anchor', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          anchor: '#parent',
          append: 'replace',
          onMount: appendTestApp,
        });
        ui.mount();

        expect(
          document.querySelector('body > div[data-wxt-integrated]'),
        ).not.toBeNull();
        expect(document.querySelector('#parent')).toBeNull();
      });
    });

    describe('before', () => {
      it('should append the UI before the anchor', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          anchor: '#one',
          append: 'before',
          onMount: appendTestApp,
        });
        ui.mount();

        expect(
          document.querySelector(
            '#parent > div[data-wxt-integrated]:first-child',
          ),
        ).not.toBeNull();
      });
    });

    describe('after', () => {
      it('should append the UI after the anchor', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          anchor: '#three',
          append: 'after',
          onMount: appendTestApp,
        });
        ui.mount();

        expect(
          document.querySelector(
            '#parent > div[data-wxt-integrated]:last-child',
          ),
        ).not.toBeNull();
      });
    });

    describe('function', () => {
      it('should append the UI using a function', () => {
        const ui = createIntegratedUi(ctx, {
          position: 'inline',
          anchor: '#parent',
          append: (anchor, ui) => {
            anchor.replaceWith(ui);
          },
          onMount: appendTestApp,
        });
        ui.mount();

        expect(
          document.querySelector('body > div[data-wxt-integrated]'),
        ).not.toBeNull();
        expect(document.querySelector('#parent')).toBeNull();
      });
    });
  });

  describe('mounted value', () => {
    describe('integrated', () => {
      it('should set the mounted value based on the onMounted return value', () => {
        const expected = Symbol();

        const ui = createIntegratedUi(new ContentScriptContext('test'), {
          position: 'inline',
          onMount: () => expected,
        });
        expect(ui.mounted).toBeUndefined();

        ui.mount();
        expect(ui.mounted).toBe(expected);

        ui.remove();
        expect(ui.mounted).toBeUndefined();
      });
    });

    describe('iframe', () => {
      it('should set the mounted value based on the onMounted return value', async () => {
        const expected = Symbol();

        const ui = createIframeUi(new ContentScriptContext('test'), {
          page: '',
          position: 'inline',
          onMount: () => expected,
        });
        expect(ui.mounted).toBeUndefined();

        ui.mount();
        expect(ui.mounted).toBe(expected);

        ui.remove();
        expect(ui.mounted).toBeUndefined();
      });
    });

    describe('shadow-root', () => {
      it('should set the mounted value based on the onMounted return value', async () => {
        const expected = Symbol();

        const ui = await createShadowRootUi(new ContentScriptContext('test'), {
          name: 'test-component',
          position: 'inline',
          onMount: () => expected,
        });
        expect(ui.mounted).toBeUndefined();

        ui.mount();
        expect(ui.mounted).toBe(expected);

        ui.remove();
        expect(ui.mounted).toBeUndefined();
      });
    });
  });

  /**
   * Need call runMicrotasks after floating-promise and append/remove dom
   */
  describe('auto mount', () => {
    const DYNAMIC_CHILD_ID = 'dynamic-child';
    let ui: ContentScriptUi<any>;
    beforeEach(async () => {
      ui?.remove();
      await runMicrotasks();
    });
    afterEach(async () => {
      ui?.remove();
      await runMicrotasks();
    });

    describe.each([
      {
        name: 'integrated',
        createUiFunction: createIntegratedUi,
        uiSelector: 'div[data-wxt-integrated]',
      },
      {
        name: 'iframe',
        createUiFunction: createIframeUi,
        uiSelector: 'div[data-wxt-iframe]',
      },
      {
        name: 'shadow-root',
        createUiFunction: createShadowRootUi,
        uiSelector: 'test-component[data-wxt-shadow-root]',
      },
    ] as const)(
      'built-in UI type: $name',
      ({ name, createUiFunction, uiSelector }) => {
        it('should mount when an anchor is dynamically added and unmount when an anchor is removed', async () => {
          const onMount = vi.fn(appendTestApp);
          const onRemove = vi.fn();
          ui = await createUiFunction(ctx, {
            position: 'inline',
            onMount,
            onRemove,
            anchor: `#parent > #${DYNAMIC_CHILD_ID}`,
            page: name === 'iframe' ? '/page.html' : undefined,
            name: 'test-component',
          });
          let dynamicEl;
          ui.autoMount();
          await runMicrotasks();

          for (let index = 0; index < 3; index++) {
            await expect
              .poll(() => document.querySelector(uiSelector))
              .toBeNull();

            dynamicEl = appendTestElement({ id: DYNAMIC_CHILD_ID });
            await runMicrotasks();
            await expect
              .poll(() => document.querySelector(uiSelector))
              .not.toBeNull();

            dynamicEl.remove();
            await runMicrotasks();
          }

          expect(onMount).toHaveBeenCalledTimes(3);
          expect(onRemove).toHaveBeenCalledTimes(3);
        });

        describe('options', () => {
          it('should auto-mount only once mount and remove when the `once` option is true', async () => {
            const onMount = vi.fn(appendTestApp);
            const onRemove = vi.fn();
            ui = await createUiFunction(ctx, {
              position: 'inline',
              onMount,
              onRemove,
              anchor: `#parent > #${DYNAMIC_CHILD_ID}`,
              page: name === 'iframe' ? '/page.html' : undefined,
              name: 'test-component',
            });
            let dynamicEl;
            ui.autoMount({ once: true });
            await runMicrotasks();
            await expect
              .poll(() => document.querySelector(uiSelector))
              .toBeNull();

            dynamicEl = appendTestElement({ id: DYNAMIC_CHILD_ID });
            await runMicrotasks();
            await expect
              .poll(() => document.querySelector(uiSelector))
              .not.toBeNull();

            dynamicEl.remove();
            await runMicrotasks();
            expect(onMount).toHaveBeenCalledTimes(1);
            expect(onRemove).toHaveBeenCalledTimes(1);

            // re-append after once cycle
            dynamicEl = appendTestElement({ id: DYNAMIC_CHILD_ID });
            await runMicrotasks();

            // expect stop automount
            await expect
              .poll(() => document.querySelector(uiSelector))
              .toBeNull();
            expect(onMount).toHaveBeenCalledTimes(1);
            expect(onRemove).toHaveBeenCalledTimes(1);
          });
        });

        describe('invalid anchors', () => {
          it('should throw when anchor is set as type Element', async () => {
            ui = await createUiFunction(ctx, {
              position: 'inline',
              onMount: appendTestApp,
              anchor: document.documentElement,
              page: name === 'iframe' ? '/page.html' : undefined,
              name: 'test-component',
            });
            expect(() => ui.autoMount()).toThrowError(
              'autoMount and Element anchor option cannot be combined. Avoid passing `Element` directly or `() => Element` to the anchor.',
            );
          });

          it('should throw when anchor is set as type `() => Element`', async () => {
            ui = await createUiFunction(ctx, {
              position: 'inline',
              onMount: appendTestApp,
              anchor: () => document.documentElement,
              page: name === 'iframe' ? '/page.html' : undefined,
              name: 'test-component',
            });
            expect(() => ui.autoMount()).toThrowError(
              'autoMount and Element anchor option cannot be combined. Avoid passing `Element` directly or `() => Element` to the anchor.',
            );
          });
        });

        describe('StopAutoMount', () => {
          it('should stop auto-mounting and remove ui when `ui.remove` is called', async () => {
            const onMount = vi.fn(appendTestApp);
            const onRemove = vi.fn();
            ui = await createUiFunction(ctx, {
              position: 'inline',
              onMount,
              onRemove,
              anchor: `#parent > #${DYNAMIC_CHILD_ID}`,
              page: name === 'iframe' ? '/page.html' : undefined,
              name: 'test-component',
            });
            let dynamicEl;
            ui.autoMount();
            await runMicrotasks();

            dynamicEl = appendTestElement({ id: DYNAMIC_CHILD_ID });
            await runMicrotasks();
            await expect
              .poll(() => document.querySelector(uiSelector))
              .not.toBeNull();

            dynamicEl.remove();
            await runMicrotasks();
            expect(onMount).toHaveBeenCalledTimes(1);
            expect(onRemove).toHaveBeenCalledTimes(1);

            ui.remove();

            dynamicEl = appendTestElement({ id: DYNAMIC_CHILD_ID });
            dynamicEl.remove();
            await runMicrotasks();
            expect(onMount).toHaveBeenCalledTimes(1);
            expect(onRemove).toHaveBeenCalledTimes(2);
          });

          it('should call internal StopAutoMount when `ui.remove` is called', async () => {
            const onMount = vi.fn(appendTestApp);
            const onRemove = vi.fn();
            const onStop = vi.fn();
            ui = await createUiFunction(ctx, {
              position: 'inline',
              onMount,
              onRemove,
              anchor: `#parent > #${DYNAMIC_CHILD_ID}`,
              page: name === 'iframe' ? '/page.html' : undefined,
              name: 'test-component',
            });
            ui.autoMount({ onStop });
            ui.remove();
            expect(onStop).toHaveBeenCalledTimes(1);
            expect(onRemove).toHaveBeenCalledTimes(1);
          });

          it('should allow calling automount again after internal StopAutoMount is called', async () => {
            const onMount = vi.fn(appendTestApp);
            ui = await createUiFunction(ctx, {
              position: 'inline',
              onMount,
              anchor: `#parent > #${DYNAMIC_CHILD_ID}`,
              page: name === 'iframe' ? '/page.html' : undefined,
              name: 'test-component',
            });
            const onStop = vi.fn();
            ui.autoMount({ onStop });
            ui.autoMount({ onStop });

            ui.remove();
            expect(onStop).toBeCalledTimes(1);

            ui.autoMount({ onStop });

            ui.remove();
            expect(onStop).toBeCalledTimes(2);
          });
        });
      },
    );
  });
});
