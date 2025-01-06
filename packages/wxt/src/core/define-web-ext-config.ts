import consola from 'consola';
import { WebExtConfig } from '../types';

/**
 * @deprecated Use `defineWebExtConfig` instead. Same function, different name.
 */
export function defineRunnerConfig(config: WebExtConfig): WebExtConfig {
  consola.warn(
    '`defineRunnerConfig` is deprecated, use `defineWebExtConfig` instead. See https://wxt.dev/guide/resources/upgrading.html#v0-19-0-rarr-v0-20-0',
  );
  return defineWebExtConfig(config);
}

/**
 * Configure how [`web-ext`](https://github.com/mozilla/web-ext) starts the browser during development.
 */
export function defineWebExtConfig(config: WebExtConfig): WebExtConfig {
  return config;
}
