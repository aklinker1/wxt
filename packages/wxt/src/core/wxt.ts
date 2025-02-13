import { InlineConfig, Wxt, WxtCommand, WxtHooks, WxtModule } from '../types';
import { resolveConfig } from './resolve-config';
import { createHooks } from 'hookable';
import { createWxtPackageManager } from './package-managers';
import { createViteBuilder } from './builders/vite';
import { builtinModules } from '../builtin-modules';
import { relative } from 'path';

/**
 * Global variable set once `createWxt` is called once. Since this variable is used everywhere, this
 * global can be used instead of passing the variable as a function parameter everywhere.
 */
export let wxt: Wxt;

/**
 * Create and register a global instance of the Wxt interface for use throughout the project.
 */
export async function registerWxt(
  command: WxtCommand,
  inlineConfig: InlineConfig = {},
): Promise<void> {
  // Default NODE_ENV environment variable before other packages, like vite, do it
  // See https://github.com/wxt-dev/wxt/issues/873#issuecomment-2254555523
  process.env.NODE_ENV ??=
    inlineConfig.mode ?? (command === 'serve' ? 'development' : 'production');

  const hooks = createHooks<WxtHooks>();
  const config = await resolveConfig(inlineConfig, command);
  const builder = await createViteBuilder(config, hooks, () => wxt.server);
  const pm = await createWxtPackageManager(config.root);

  wxt = {
    config,
    hooks,
    hook: hooks.hook.bind(hooks),
    get logger() {
      return config.logger;
    },
    async reloadConfig() {
      // Prevent changing the server port when resolving config multiple times
      // get-port-please doesn't always return the same port if it was recently closed.
      if (wxt.config.dev.server?.port) {
        inlineConfig.dev ??= {};
        inlineConfig.dev.server ??= {};
        inlineConfig.dev.server.port = wxt.config.dev.server.port;
      }

      wxt.config = await resolveConfig(inlineConfig, command);
      await wxt.hooks.callHook('config:resolved', wxt);
    },
    pm,
    builder,
    server: undefined,
  };

  await initWxtModules();
}

export async function initWxtModules() {
  // Call setup function and add hooks
  for (const mod of builtinModules) await initWxtModule(mod);
  for (const mod of wxt.config.userModules) await initWxtModule(mod);

  // Initialize hooks
  wxt.hooks.addHooks(wxt.config.hooks);

  // Print order for debugging
  if (wxt.config.debug) {
    const order = [
      ...builtinModules.map((module) => module.name),
      ...wxt.config.userModules.map((module) =>
        relative(wxt.config.root, module.id),
      ),
      'wxt.config.ts > hooks',
    ];
    wxt.logger.debug('Hook execution order:');
    order.forEach((name, i) => {
      wxt.logger.debug(`  ${i + 1}. ${name}`);
    });
  }

  await wxt.hooks.callHook('ready', wxt);
  await wxt.hooks.callHook('config:resolved', wxt);
}

async function initWxtModule(module: WxtModule<any>): Promise<void> {
  if (module.hooks) wxt.hooks.addHooks(module.hooks);
  await module.setup?.(
    wxt,
    // @ts-expect-error: Untyped configKey field
    module.configKey ? wxt.config[module.configKey] : undefined,
  );
}

/**
 * Unloads WXT modules.
 */
export function deinitWxtModules(): void {
  wxt.hooks.removeAllHooks();
}

/**
 * @internal ONLY USE FOR TESTING.
 *
 * @example
 * setWxtForTesting(fakeWxt({ ... }));
 * // Or use the shorthand
 * setFakeWxt({ ... })
 */
export function setWxtForTesting(testInstance: Wxt) {
  wxt = testInstance;
}
