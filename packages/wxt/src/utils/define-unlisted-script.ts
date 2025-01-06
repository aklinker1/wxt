/** @module wxt/utils/define-unlisted-script */
import type { UnlistedScriptDefinition } from '../types';

export function defineUnlistedScript(
  main: () => void,
): UnlistedScriptDefinition;
export function defineUnlistedScript(
  definition: UnlistedScriptDefinition,
): UnlistedScriptDefinition;
export function defineUnlistedScript(
  arg: (() => void) | UnlistedScriptDefinition,
): UnlistedScriptDefinition {
  if (arg == null || typeof arg === 'function') return { main: arg };
  return arg;
}
