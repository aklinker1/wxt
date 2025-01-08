import { describe, expectTypeOf, it } from 'vitest';
import { browser } from '../browser';

describe('browser', () => {
  describe('types', () => {
    it('should work as a namespace, exporting types', () => {
      expectTypeOf<browser.runtime.MessageSender>().toMatchTypeOf<chrome.runtime.MessageSender>();
      expectTypeOf<browser.storage.AreaName>().toMatchTypeOf<chrome.storage.AreaName>();
      expectTypeOf<browser.i18n.LanguageDetectionResult>().toMatchTypeOf<chrome.i18n.LanguageDetectionResult>();
    });
  });
});
