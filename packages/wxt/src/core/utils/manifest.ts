import type { Manifest } from 'wxt/browser';
import {
  Entrypoint,
  BackgroundEntrypoint,
  BuildOutput,
  ContentScriptEntrypoint,
  OptionsEntrypoint,
  PopupEntrypoint,
  SidepanelEntrypoint,
} from '../../types';
import fs from 'fs-extra';
import { resolve } from 'path';
import { getEntrypointBundlePath } from './entrypoints';
import { ContentSecurityPolicy } from './content-security-policy';
import {
  hashContentScriptOptions,
  mapWxtOptionsToContentScript,
} from './content-scripts';
import { getPackageJson } from './package';
import { normalizePath } from './paths';
import { writeFileIfDifferent } from './fs';
import defu from 'defu';
import { wxt } from '../wxt';

/**
 * Writes the manifest to the output directory and the build output.
 */
export async function writeManifest(
  manifest: Manifest.WebExtensionManifest,
  output: BuildOutput,
): Promise<void> {
  const str =
    wxt.config.mode === 'production'
      ? JSON.stringify(manifest)
      : JSON.stringify(manifest, null, 2);

  await fs.ensureDir(wxt.config.outDir);
  await writeFileIfDifferent(resolve(wxt.config.outDir, 'manifest.json'), str);

  output.publicAssets.unshift({
    type: 'asset',
    fileName: 'manifest.json',
  });
}

/**
 * Generates the manifest based on the config and entrypoints.
 */
export async function generateManifest(
  allEntrypoints: Entrypoint[],
  buildOutput: Omit<BuildOutput, 'manifest'>,
): Promise<{ manifest: Manifest.WebExtensionManifest; warnings: any[][] }> {
  const entrypoints = allEntrypoints.filter((entry) => !entry.skipped);

  const warnings: any[][] = [];
  const pkg = await getPackageJson();

  let versionName =
    wxt.config.manifest.version_name ??
    wxt.config.manifest.version ??
    pkg?.version;
  if (versionName == null) {
    versionName = '0.0.0';
    wxt.logger.warn(
      'Extension version not found, defaulting to "0.0.0". Add a version to your `package.json` or `wxt.config.ts` file. For more details, see: https://wxt.dev/guide/key-concepts/manifest.html#version-and-version-name',
    );
  }
  const version = wxt.config.manifest.version ?? simplifyVersion(versionName);

  const baseManifest: Manifest.WebExtensionManifest = {
    manifest_version: wxt.config.manifestVersion,
    name: pkg?.name,
    description: pkg?.description,
    version,
    short_name: pkg?.shortName,
    icons: discoverIcons(buildOutput),
  };
  const userManifest = wxt.config.manifest;
  if (userManifest.manifest_version) {
    delete userManifest.manifest_version;
    wxt.logger.warn(
      '`manifest.manifest_version` config was set, but ignored. To change the target manifest version, use the `manifestVersion` option or the `--mv2`/`--mv3` CLI flags.\nSee https://wxt.dev/guide/essentials/target-different-browsers.html#target-a-manifest-version',
    );
  }

  let manifest = defu(
    userManifest,
    baseManifest,
  ) as Manifest.WebExtensionManifest;

  // Add reload command in dev mode
  if (wxt.config.command === 'serve' && wxt.config.dev.reloadCommand) {
    if (
      manifest.commands &&
      // If the following limit is exceeded, Chrome will fail to load the extension.
      // Error: "Too many commands specified for 'commands': The maximum is 4."
      Object.values(manifest.commands).filter(
        (command) => command.suggested_key,
      ).length >= 4
    ) {
      warnings.push([
        "Extension already has 4 registered commands with suggested keys, WXT's reload command is disabled",
      ]);
    } else {
      manifest.commands ??= {};
      manifest.commands['wxt:reload-extension'] = {
        description: 'Reload the extension during development',
        suggested_key: {
          default: wxt.config.dev.reloadCommand,
        },
      };
    }
  }

  // Apply the final version fields after merging the user manifest
  manifest.version = version;
  manifest.version_name =
    // Firefox doesn't support version_name
    wxt.config.browser === 'firefox' || versionName === version
      ? undefined
      : versionName;

  addEntrypoints(manifest, entrypoints, buildOutput);

  if (wxt.config.command === 'serve') addDevModeCsp(manifest);
  if (wxt.config.command === 'serve') addDevModePermissions(manifest);

  // TODO: Remove in v1
  wxt.config.transformManifest?.(manifest);
  await wxt.hooks.callHook('build:manifestGenerated', wxt, manifest);

  if (wxt.config.manifestVersion === 2) {
    convertWebAccessibleResourcesToMv2(manifest);
    convertActionToMv2(manifest);
    convertCspToMv2(manifest);
    moveHostPermissionsToPermissions(manifest);
  }

  if (wxt.config.manifestVersion === 3) {
    validateMv3WebAccessibleResources(manifest);
  }

  stripKeys(manifest);

  if (manifest.name == null)
    throw Error(
      "Manifest 'name' is missing. Either:\n1. Set the name in your <rootDir>/package.json\n2. Set a name via the manifest option in your wxt.config.ts",
    );
  if (manifest.version == null) {
    throw Error(
      "Manifest 'version' is missing. Either:\n1. Add a version in your <rootDir>/package.json\n2. Pass the version via the manifest option in your wxt.config.ts",
    );
  }

  return {
    manifest,
    warnings,
  };
}

/**
 * Removes suffixes from the version, like X.Y.Z-alpha1 (which browsers don't allow), so it's a
 * simple version number, like X or X.Y or X.Y.Z, which browsers allow.
 */
function simplifyVersion(versionName: string): string {
  // Regex adapted from here: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version#version_format
  const version = /^((0|[1-9][0-9]{0,8})([.](0|[1-9][0-9]{0,8})){0,3}).*$/.exec(
    versionName,
  )?.[1];

  if (version == null)
    throw Error(
      `Cannot simplify package.json version "${versionName}" to a valid extension version, "X.Y.Z"`,
    );

  return version;
}

function addEntrypoints(
  manifest: Manifest.WebExtensionManifest,
  entrypoints: Entrypoint[],
  buildOutput: Omit<BuildOutput, 'manifest'>,
): void {
  const entriesByType = entrypoints.reduce<
    Partial<Record<Entrypoint['type'], Entrypoint[]>>
  >((map, entrypoint) => {
    map[entrypoint.type] ??= [];
    map[entrypoint.type]?.push(entrypoint);
    return map;
  }, {});

  const background = entriesByType['background']?.[0] as
    | BackgroundEntrypoint
    | undefined;
  const bookmarks = entriesByType['bookmarks']?.[0];
  const contentScripts = entriesByType['content-script'] as
    | ContentScriptEntrypoint[]
    | undefined;
  const devtools = entriesByType['devtools']?.[0];
  const history = entriesByType['history']?.[0];
  const newtab = entriesByType['newtab']?.[0];
  const options = entriesByType['options']?.[0] as
    | OptionsEntrypoint
    | undefined;
  const popup = entriesByType['popup']?.[0] as PopupEntrypoint | undefined;
  const sandboxes = entriesByType['sandbox'];
  const sidepanels = entriesByType['sidepanel'] as
    | SidepanelEntrypoint[]
    | undefined;

  if (background) {
    const script = getEntrypointBundlePath(
      background,
      wxt.config.outDir,
      '.js',
    );
    if (wxt.config.browser === 'firefox' && wxt.config.manifestVersion === 3) {
      manifest.background = {
        type: background.options.type,
        scripts: [script],
      };
    } else if (wxt.config.manifestVersion === 3) {
      manifest.background = {
        type: background.options.type,
        service_worker: script,
      };
    } else {
      manifest.background = {
        persistent: background.options.persistent,
        scripts: [script],
      };
    }
  }

  if (bookmarks) {
    if (wxt.config.browser === 'firefox') {
      wxt.logger.warn(
        'Bookmarks are not supported by Firefox. chrome_url_overrides.bookmarks was not added to the manifest',
      );
    } else {
      manifest.chrome_url_overrides ??= {};
      // @ts-expect-error: bookmarks is untyped in webextension-polyfill, but supported by chrome
      manifest.chrome_url_overrides.bookmarks = getEntrypointBundlePath(
        bookmarks,
        wxt.config.outDir,
        '.html',
      );
    }
  }

  if (history) {
    if (wxt.config.browser === 'firefox') {
      wxt.logger.warn(
        'Bookmarks are not supported by Firefox. chrome_url_overrides.history was not added to the manifest',
      );
    } else {
      manifest.chrome_url_overrides ??= {};
      // @ts-expect-error: history is untyped in webextension-polyfill, but supported by chrome
      manifest.chrome_url_overrides.history = getEntrypointBundlePath(
        history,
        wxt.config.outDir,
        '.html',
      );
    }
  }

  if (newtab) {
    manifest.chrome_url_overrides ??= {};
    manifest.chrome_url_overrides.newtab = getEntrypointBundlePath(
      newtab,
      wxt.config.outDir,
      '.html',
    );
  }

  if (popup) {
    const default_popup = getEntrypointBundlePath(
      popup,
      wxt.config.outDir,
      '.html',
    );
    const options: Manifest.ActionManifest = {};
    if (popup.options.defaultIcon)
      options.default_icon = popup.options.defaultIcon;
    if (popup.options.defaultTitle)
      options.default_title = popup.options.defaultTitle;
    if (popup.options.browserStyle)
      options.browser_style = popup.options.browserStyle;
    if (manifest.manifest_version === 3) {
      manifest.action = {
        ...manifest.action,
        ...options,
        default_popup,
      };
    } else {
      const key = popup.options.mv2Key ?? 'browser_action';
      manifest[key] = {
        ...manifest[key],
        ...options,
        default_popup,
      };
    }
  }

  if (devtools) {
    manifest.devtools_page = getEntrypointBundlePath(
      devtools,
      wxt.config.outDir,
      '.html',
    );
  }

  if (options) {
    const page = getEntrypointBundlePath(options, wxt.config.outDir, '.html');
    manifest.options_ui = {
      open_in_tab: options.options.openInTab,
      browser_style:
        wxt.config.browser === 'firefox'
          ? options.options.browserStyle
          : undefined,
      chrome_style:
        wxt.config.browser !== 'firefox'
          ? options.options.chromeStyle
          : undefined,
      page,
    };
  }

  if (sandboxes?.length) {
    if (wxt.config.browser === 'firefox') {
      wxt.logger.warn(
        'Sandboxed pages not supported by Firefox. sandbox.pages was not added to the manifest',
      );
    } else {
      // @ts-expect-error: sandbox not typed
      manifest.sandbox = {
        pages: sandboxes.map((entry) =>
          getEntrypointBundlePath(entry, wxt.config.outDir, '.html'),
        ),
      };
    }
  }

  if (sidepanels?.length) {
    const defaultSidepanel =
      sidepanels.find((entry) => entry.name === 'sidepanel') ?? sidepanels[0];
    const page = getEntrypointBundlePath(
      defaultSidepanel,
      wxt.config.outDir,
      '.html',
    );

    if (wxt.config.browser === 'firefox') {
      manifest.sidebar_action = {
        default_panel: page,
        browser_style: defaultSidepanel.options.browserStyle,
        default_icon: defaultSidepanel.options.defaultIcon,
        default_title: defaultSidepanel.options.defaultTitle,
        open_at_install: defaultSidepanel.options.openAtInstall,
      };
    } else if (wxt.config.manifestVersion === 3) {
      // @ts-expect-error: Untyped
      manifest.side_panel = {
        default_path: page,
      };
      addPermission(manifest, 'sidePanel');
    } else {
      wxt.logger.warn(
        'Side panel not supported by Chromium using MV2. side_panel.default_path was not added to the manifest',
      );
    }
  }

  if (contentScripts?.length) {
    const cssMap = getContentScriptsCssMap(buildOutput, contentScripts);

    // Don't add content scripts to the manifest in dev mode for MV3 - they're managed and reloaded
    // at runtime
    if (wxt.config.command === 'serve' && wxt.config.manifestVersion === 3) {
      contentScripts.forEach((script) => {
        script.options.matches?.forEach((matchPattern) => {
          addHostPermission(manifest, matchPattern);
        });
      });
    } else {
      // Manifest scripts
      const hashToEntrypointsMap = contentScripts
        .filter((cs) => cs.options.registration !== 'runtime')
        .reduce((map, script) => {
          const hash = hashContentScriptOptions(script.options);
          if (map.has(hash)) map.get(hash)?.push(script);
          else map.set(hash, [script]);
          return map;
        }, new Map<string, ContentScriptEntrypoint[]>());
      const manifestContentScripts = Array.from(
        hashToEntrypointsMap.values(),
      ).map((scripts) =>
        mapWxtOptionsToContentScript(
          scripts[0].options,
          scripts.map((entry) =>
            getEntrypointBundlePath(entry, wxt.config.outDir, '.js'),
          ),
          getContentScriptCssFiles(scripts, cssMap),
        ),
      );
      if (manifestContentScripts.length >= 0) {
        manifest.content_scripts ??= [];
        manifest.content_scripts.push(...manifestContentScripts);
      }

      // Runtime content scripts
      const runtimeContentScripts = contentScripts.filter(
        (cs) => cs.options.registration === 'runtime',
      );
      if (
        runtimeContentScripts.length > 0 &&
        wxt.config.manifestVersion === 2
      ) {
        throw Error(
          'Cannot use `registration: "runtime"` with MV2 content scripts, it is a MV3-only feature.',
        );
      }
      runtimeContentScripts.forEach((script) => {
        script.options.matches?.forEach((matchPattern) => {
          addHostPermission(manifest, matchPattern);
        });
      });
    }

    const contentScriptCssResources = getContentScriptCssWebAccessibleResources(
      contentScripts,
      cssMap,
    );
    if (contentScriptCssResources.length > 0) {
      manifest.web_accessible_resources ??= [];
      manifest.web_accessible_resources.push(...contentScriptCssResources);
    }
  }
}

function discoverIcons(
  buildOutput: Omit<BuildOutput, 'manifest'>,
): Manifest.WebExtensionManifest['icons'] {
  const icons: [string, string][] = [];
  // prettier-ignore
  // #region snippet
  const iconRegex = [
    /^icon-([0-9]+)\.png$/,                 // icon-16.png
    /^icon-([0-9]+)x[0-9]+\.png$/,          // icon-16x16.png
    /^icon@([0-9]+)w\.png$/,                // icon@16w.png
    /^icon@([0-9]+)h\.png$/,                // icon@16h.png
    /^icon@([0-9]+)\.png$/,                 // icon@16.png
    /^icons?[/\\]([0-9]+)\.png$/,          // icon/16.png | icons/16.png
    /^icons?[/\\]([0-9]+)x[0-9]+\.png$/,   // icon/16x16.png | icons/16x16.png
  ];
  // #endregion snippet

  buildOutput.publicAssets.forEach((asset) => {
    let size: string | undefined;
    for (const regex of iconRegex) {
      const match = asset.fileName.match(regex);
      if (match?.[1] != null) {
        size = match[1];
        break;
      }
    }
    if (size == null) return;

    icons.push([size, normalizePath(asset.fileName)]);
  });

  return icons.length > 0 ? Object.fromEntries(icons) : undefined;
}

function addDevModeCsp(manifest: Manifest.WebExtensionManifest): void {
  const permission = `http://${wxt.server?.hostname ?? ''}/*`;
  const allowedCsp = wxt.server?.origin ?? 'http://localhost:*';

  if (manifest.manifest_version === 3) {
    addHostPermission(manifest, permission);
  } else {
    addPermission(manifest, permission);
  }

  const extensionPagesCsp = new ContentSecurityPolicy(
    // @ts-expect-error: extension_pages exists, we convert MV2 CSPs to this earlier in the process
    manifest.content_security_policy?.extension_pages ??
      (manifest.manifest_version === 3
        ? DEFAULT_MV3_EXTENSION_PAGES_CSP
        : DEFAULT_MV2_CSP),
  );
  const sandboxCsp = new ContentSecurityPolicy(
    // @ts-expect-error: sandbox is not typed
    manifest.content_security_policy?.sandbox ?? DEFAULT_MV3_SANDBOX_CSP,
  );

  if (wxt.config.command === 'serve') {
    extensionPagesCsp.add('script-src', allowedCsp);
    sandboxCsp.add('script-src', allowedCsp);
  }

  manifest.content_security_policy ??= {};
  // @ts-expect-error: extension_pages is not typed
  manifest.content_security_policy.extension_pages =
    extensionPagesCsp.toString();
  // @ts-expect-error: sandbox is not typed
  manifest.content_security_policy.sandbox = sandboxCsp.toString();
}

function addDevModePermissions(manifest: Manifest.WebExtensionManifest) {
  // For reloading the page
  addPermission(manifest, 'tabs');

  // For registering content scripts
  if (wxt.config.manifestVersion === 3) addPermission(manifest, 'scripting');
}

/**
 * Returns the bundle paths to CSS files associated with a list of content scripts, or undefined if
 * there is no associated CSS.
 */
export function getContentScriptCssFiles(
  contentScripts: ContentScriptEntrypoint[],
  contentScriptCssMap: Record<string, string | undefined>,
): string[] | undefined {
  const css: string[] = [];

  contentScripts.forEach((script) => {
    if (
      script.options.cssInjectionMode === 'manual' ||
      script.options.cssInjectionMode === 'ui'
    )
      return;

    const cssFile = contentScriptCssMap[script.name];
    if (cssFile == null) return;

    if (cssFile) css.push(cssFile);
  });

  if (css.length > 0) return css;
  return undefined;
}

/**
 * Content scripts configured with `cssInjectionMode: "ui"` need to add their CSS files to web
 * accessible resources so they can be fetched as text and added to shadow roots that the UI is
 * added to.
 */
export function getContentScriptCssWebAccessibleResources(
  contentScripts: ContentScriptEntrypoint[],
  contentScriptCssMap: Record<string, string | undefined>,
): any[] {
  const resources: Manifest.WebExtensionManifestWebAccessibleResourcesC2ItemType[] =
    [];

  contentScripts.forEach((script) => {
    if (script.options.cssInjectionMode !== 'ui') return;

    const cssFile = contentScriptCssMap[script.name];
    if (cssFile == null) return;

    resources.push({
      resources: [cssFile],
      matches: script.options.matches?.map((matchPattern) =>
        stripPathFromMatchPattern(matchPattern),
      ),
    });
  });

  return resources;
}

/**
 * Based on the build output, return a Record of each content script's name to it CSS file if the
 * script includes one.
 */
export function getContentScriptsCssMap(
  buildOutput: Omit<BuildOutput, 'manifest'>,
  scripts: ContentScriptEntrypoint[],
) {
  const map: Record<string, string | undefined> = {};
  const allChunks = buildOutput.steps.flatMap((step) => step.chunks);
  scripts.forEach((script) => {
    const relatedCss = allChunks.find(
      (chunk) => chunk.fileName === `content-scripts/${script.name}.css`,
    );
    if (relatedCss != null) map[script.name] = relatedCss.fileName;
  });
  return map;
}

function addPermission(
  manifest: Manifest.WebExtensionManifest,
  permission: string,
): void {
  manifest.permissions ??= [];
  if (manifest.permissions.includes(permission)) return;
  manifest.permissions.push(permission);
}

function addHostPermission(
  manifest: Manifest.WebExtensionManifest,
  hostPermission: string,
): void {
  manifest.host_permissions ??= [];
  if (manifest.host_permissions.includes(hostPermission)) return;
  manifest.host_permissions.push(hostPermission);
}

/**
 * - "<all_urls>" &rarr; "<all_urls>"
 * - "*://play.google.com/books/*" &rarr; "*://play.google.com/*"
 */
export function stripPathFromMatchPattern(pattern: string) {
  const protocolSepIndex = pattern.indexOf('://');
  if (protocolSepIndex === -1) return pattern;

  const startOfPath = pattern.indexOf('/', protocolSepIndex + 3);
  return pattern.substring(0, startOfPath) + '/*';
}

/**
 * Converts all MV3 web accessible resources to their MV2 forms. MV3 web accessible resources are
 * generated in this file, and may be defined by the user in their manifest. In both cases, when
 * targeting MV2, automatically convert their definitions down to the basic MV2 array.
 */
export function convertWebAccessibleResourcesToMv2(
  manifest: Manifest.WebExtensionManifest,
): void {
  if (manifest.web_accessible_resources == null) return;

  manifest.web_accessible_resources = Array.from(
    new Set(
      manifest.web_accessible_resources.flatMap((item) => {
        if (typeof item === 'string') return item;
        return item.resources;
      }),
    ),
  );
}

function moveHostPermissionsToPermissions(
  manifest: Manifest.WebExtensionManifest,
): void {
  if (!manifest.host_permissions?.length) return;

  manifest.host_permissions.forEach((permission) =>
    addPermission(manifest, permission),
  );
  delete manifest.host_permissions;
}

function convertActionToMv2(manifest: Manifest.WebExtensionManifest): void {
  if (
    manifest.action == null ||
    manifest.browser_action != null ||
    manifest.page_action != null
  )
    return;

  manifest.browser_action = manifest.action;
}

function convertCspToMv2(manifest: Manifest.WebExtensionManifest): void {
  if (
    typeof manifest.content_security_policy === 'string' ||
    manifest.content_security_policy?.extension_pages == null
  )
    return;

  manifest.content_security_policy =
    manifest.content_security_policy.extension_pages;
}

/**
 * Make sure all resources are in MV3 format. If not, add a wanring
 */
export function validateMv3WebAccessibleResources(
  manifest: Manifest.WebExtensionManifest,
): void {
  if (manifest.web_accessible_resources == null) return;

  const stringResources = manifest.web_accessible_resources.filter(
    (item) => typeof item === 'string',
  );
  if (stringResources.length > 0) {
    throw Error(
      `Non-MV3 web_accessible_resources detected: ${JSON.stringify(
        stringResources,
      )}. When manually defining web_accessible_resources, define them as MV3 objects ({ matches: [...], resources: [...] }), and WXT will automatically convert them to MV2 when necessary.`,
    );
  }
}

/**
 * Remove keys from the manifest based on the build target.
 */
function stripKeys(manifest: Manifest.WebExtensionManifest): void {
  let keysToRemove: string[] = [];
  if (wxt.config.manifestVersion === 2) {
    keysToRemove.push(...mv3OnlyKeys);
    if (wxt.config.browser === 'firefox')
      keysToRemove.push(...firefoxMv3OnlyKeys);
  } else {
    keysToRemove.push(...mv2OnlyKeys);
  }

  keysToRemove.forEach((key) => {
    delete manifest[key as keyof Manifest.WebExtensionManifest];
  });
}

const mv2OnlyKeys = [
  'page_action',
  'browser_action',
  'automation',
  'content_capabilities',
  'converted_from_user_script',
  'current_locale',
  'differential_fingerprint',
  'event_rules',
  'file_browser_handlers',
  'file_system_provider_capabilities',
  'input_components',
  'nacl_modules',
  'natively_connectable',
  'offline_enabled',
  'platforms',
  'replacement_web_app',
  'system_indicator',
  'user_scripts',
];

const mv3OnlyKeys = [
  'action',
  'export',
  'optional_host_permissions',
  'side_panel',
];
const firefoxMv3OnlyKeys = ['host_permissions'];

const DEFAULT_MV3_EXTENSION_PAGES_CSP =
  "script-src 'self' 'wasm-unsafe-eval'; object-src 'self';";
const DEFAULT_MV3_SANDBOX_CSP =
  "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self';";
const DEFAULT_MV2_CSP = "script-src 'self'; object-src 'self';";
