import { fakeWxt } from '../core/utils/testing/fake-objects';
import { addImportPreset, addViteConfig } from '../modules';
import { describe, it, expect } from 'vitest';
import { createHooks } from 'hookable';

describe('Module Utilities', () => {
  describe('addViteConfig', () => {
    it('should add base vite config', async () => {
      const wxt = fakeWxt({
        hooks: createHooks(),
      });
      const expected = { build: { sourcemap: true } };
      const userConfig = {};
      const moduleConfig = { build: { sourcemap: true } };

      wxt.config.vite = () => Promise.resolve(userConfig);
      addViteConfig(wxt, () => moduleConfig);
      await wxt.hooks.callHook('config:resolved', wxt);
      const actual = await wxt.config.vite(wxt.config.env);

      expect(actual).toEqual(expected);
    });

    it('should allow user config to override any changes made', async () => {
      const wxt = fakeWxt({
        hooks: createHooks(),
      });
      const expected = { build: { sourcemap: true, test: 2 } };
      const userConfig = { build: { sourcemap: true } };
      const moduleConfig = { build: { sourcemap: false, test: 2 } };

      wxt.config.vite = () => userConfig;
      addViteConfig(wxt, () => moduleConfig);
      await wxt.hooks.callHook('config:resolved', wxt);
      const actual = await wxt.config.vite(wxt.config.env);

      expect(actual).toEqual(expected);
    });
  });

  describe('addImportPreset', () => {
    it('should add the import to the config', async () => {
      const preset = 'vue';
      const wxt = fakeWxt({ hooks: createHooks() });

      addImportPreset(wxt, preset);
      await wxt.hooks.callHook('config:resolved', wxt);

      expect(wxt.config.imports && wxt.config.imports.presets).toContain(
        preset,
      );
    });

    it('should not add duplicate presets', async () => {
      const preset = 'vue';
      const wxt = fakeWxt({
        hooks: createHooks(),
        config: {
          imports: {
            presets: ['vue', 'react'],
          },
        },
      });

      addImportPreset(wxt, preset);
      await wxt.hooks.callHook('config:resolved', wxt);

      expect(wxt.config.imports && wxt.config.imports.presets).toHaveLength(2);
    });
  });
});
