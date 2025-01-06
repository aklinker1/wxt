import { ContentScriptEntrypoint, ResolvedConfig } from '../../types';
import { getEntrypointBundlePath } from './entrypoints';
import { ManifestContentScript } from './types';

/**
 * Returns a unique and consistent string hash based on a content scripts options.
 *
 * It is able to recognize default values,
 */
export function hashContentScriptOptions(
  options: ContentScriptEntrypoint['options'],
): string {
  const simplifiedOptions = mapWxtOptionsToContentScript(
    options,
    undefined,
    undefined,
  );

  // Remove undefined fields and use defaults to generate hash
  Object.keys(simplifiedOptions).forEach((key) => {
    // @ts-expect-error: key not typed as keyof ...
    if (simplifiedOptions[key] == null) delete simplifiedOptions[key];
  });

  const withDefaults: ManifestContentScript = {
    exclude_globs: [],
    exclude_matches: [],
    include_globs: [],
    match_about_blank: false,
    run_at: 'document_idle',
    all_frames: false,
    // @ts-expect-error: Untyped
    match_origin_as_fallback: false,
    world: 'ISOLATED',
    ...simplifiedOptions,
  };
  return JSON.stringify(
    Object.entries(withDefaults)
      // Sort any arrays so their values are consistent
      .map<[string, unknown]>(([key, value]) => {
        if (Array.isArray(value)) return [key, value.sort()];
        else return [key, value];
      })
      // Sort all the fields alphabetically
      .sort((l, r) => l[0].localeCompare(r[0])),
  );
}

export function mapWxtOptionsToContentScript(
  options: ContentScriptEntrypoint['options'],
  js: string[] | undefined,
  css: string[] | undefined,
): ManifestContentScript {
  return {
    matches: options.matches ?? [],
    all_frames: options.allFrames,
    match_about_blank: options.matchAboutBlank,
    exclude_globs: options.excludeGlobs,
    exclude_matches: options.excludeMatches,
    include_globs: options.includeGlobs,
    run_at: options.runAt,
    css,
    js,
    // @ts-expect-error: Untyped
    match_origin_as_fallback: options.matchOriginAsFallback,
    world: options.world,
  };
}

export function mapWxtOptionsToRegisteredContentScript(
  options: ContentScriptEntrypoint['options'],
  js: string[] | undefined,
  css: string[] | undefined,
): Omit<chrome.scripting.RegisteredContentScript, 'id'> {
  return {
    allFrames: options.allFrames,
    excludeMatches: options.excludeMatches,
    matches: options.matches,
    runAt: options.runAt,
    js,
    css,
    world: options.world,
  };
}

export function getContentScriptJs(
  config: ResolvedConfig,
  entrypoint: ContentScriptEntrypoint,
): string[] {
  return [getEntrypointBundlePath(entrypoint, config.outDir, '.js')];
}
