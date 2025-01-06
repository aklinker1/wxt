/** @vitest-environment happy-dom */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ContentScriptContext } from '../content-script-context';
import { fakeBrowser } from '@webext-core/fake-browser';

/**
 * When dispatching events on document/window/etc, they are fired on the next
 * tick of the event loop. So waiting a timeout of 0 will ensure they've been
 * fired.
 */
function waitForEventsToFire() {
  return new Promise((res) => setTimeout(res));
}

describe('Content Script Context', () => {
  beforeEach(() => {
    vi.useRealTimers();
    fakeBrowser.runtime.id = 'anything';
  });

  it("should recognize when the content script has lost it's connection to the extension API", () => {
    const ctx = new ContentScriptContext('test');
    const onInvalidated = vi.fn();

    ctx.onInvalidated(onInvalidated);
    // @ts-ignore
    delete fakeBrowser.runtime.id;
    const isValid = ctx.isValid;

    expect(onInvalidated).toBeCalled();
    expect(isValid).toBe(false);
  });

  it('should invalidate the current content script when a new context is created', async () => {
    const name = 'test';
    const onInvalidated = vi.fn();
    const ctx = new ContentScriptContext(name);
    ctx.onInvalidated(onInvalidated);

    // Wait for events to run before next tick next tick
    await waitForEventsToFire();

    // Create a new context after first is initialized, and wait for it to initialize
    new ContentScriptContext(name);
    await waitForEventsToFire();

    expect(onInvalidated).toBeCalled();
    expect(ctx.isValid).toBe(false);
  });

  it('should not invalidate the current content script when a new context is created with a different name', async () => {
    const onInvalidated = vi.fn();
    const ctx = new ContentScriptContext('test1');
    ctx.onInvalidated(onInvalidated);

    // Wait for events to run before next tick next tick
    await waitForEventsToFire();

    // Create a new context after first is initialized, and wait for it to initialize
    new ContentScriptContext('test2');
    await waitForEventsToFire();

    expect(onInvalidated).not.toBeCalled();
    expect(ctx.isValid).toBe(true);
  });

  describe('addEventListener', () => {
    const context = new ContentScriptContext('test');
    it('should infer types correctly for the window target', () => {
      context.addEventListener(window, 'DOMContentLoaded', (_) => {});
      context.addEventListener(window, 'orientationchange', (_) => {});
      context.addEventListener(window, 'wxt:locationchange', (_) => {});
      // @ts-expect-error
      context.addEventListener(window, 'visibilitychange', (_) => {});
    });

    it('should infer types correctly for the document target', () => {
      context.addEventListener(document, 'visibilitychange', (_) => {});
      context.addEventListener(document, 'readystatechange', (_) => {});
    });

    it('should infer types correctly for HTML element targets', () => {
      const button = document.createElement('button');
      context.addEventListener(button, 'click', (_) => {});
      context.addEventListener(button, 'mouseover', (_) => {});
    });
  });
});
