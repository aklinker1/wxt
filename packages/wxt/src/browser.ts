/// <reference types="chrome" />
/**
 * Contains the `browser` export which you should use to access the extension APIs in your project:
 * ```ts
 * import { browser } from 'wxt/browser';
 *
 * browser.runtime.onInstalled.addListener(() => {
 *   // ...
 * })
 * ```
 * @module wxt/browser
 */

/**
 * This interface is empty because it is generated per-project when running `wxt prepare`. See:
 * - `.wxt/types/paths.d.ts`
 */
export interface WxtRuntime {}

/**
 * This interface is empty because it is generated per-project when running `wxt prepare`. See:
 * - `.wxt/types/i18n.d.ts`
 */
export interface WxtI18n {}

export type WxtBrowser = Omit<typeof chrome, 'runtime' | 'i18n'> & {
  runtime: WxtRuntime & Omit<(typeof chrome)['runtime'], 'getURL'>;
  i18n: WxtI18n & Omit<(typeof chrome)['i18n'], 'getMessage'>;
};

// #region snippet
export const browser: WxtBrowser =
  // @ts-expect-error
  globalThis.browser?.runtime?.id == null
    ? globalThis.chrome
    : // @ts-expect-error
      globalThis.browser;
// #endregion snippet
