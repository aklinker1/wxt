import { browser } from 'wxt/browser';
import { logger } from '../../utils/internal/logger';
import { MatchPattern } from 'wxt/utils/match-patterns';
import type { ReloadContentScriptPayload } from '../../utils/internal/dev-server-websocket';

export function reloadContentScript(payload: ReloadContentScriptPayload) {
  const manifest = browser.runtime.getManifest();
  if (manifest.manifest_version == 2) {
    void reloadContentScriptMv2(payload);
  } else {
    void reloadContentScriptMv3(payload);
  }
}

export async function reloadContentScriptMv3({
  registration,
  contentScript,
}: ReloadContentScriptPayload) {
  if (registration === 'runtime') {
    await reloadRuntimeContentScriptMv3(contentScript);
  } else {
    await reloadManifestContentScriptMv3(contentScript);
  }
}

type ContentScript = ReloadContentScriptPayload['contentScript'];

export async function reloadManifestContentScriptMv3(
  contentScript: ContentScript,
) {
  const id = `wxt:${contentScript.js![0]}`;
  logger.log('Reloading content script:', contentScript);
  const registered = await browser.scripting.getRegisteredContentScripts();
  logger.debug('Existing scripts:', registered);

  const existing = registered.find((cs) => cs.id === id);

  if (existing) {
    logger.debug('Updating content script', existing);
    await browser.scripting.updateContentScripts([{ ...contentScript, id }]);
  } else {
    logger.debug('Registering new content script...');
    await browser.scripting.registerContentScripts([{ ...contentScript, id }]);
  }

  await reloadTabsForContentScript(contentScript);
}

export async function reloadRuntimeContentScriptMv3(
  contentScript: ContentScript,
) {
  logger.log('Reloading content script:', contentScript);
  const registered = await browser.scripting.getRegisteredContentScripts();
  logger.debug('Existing scripts:', registered);

  const matches = registered.filter((cs) => {
    const hasJs = contentScript.js?.find((js) => cs.js?.includes(js));
    const hasCss = contentScript.css?.find((css) => cs.css?.includes(css));
    return hasJs || hasCss;
  });

  if (matches.length === 0) {
    logger.log(
      'Content script is not registered yet, nothing to reload',
      contentScript,
    );
    return;
  }

  await browser.scripting.updateContentScripts(matches);
  await reloadTabsForContentScript(contentScript);
}

async function reloadTabsForContentScript(contentScript: ContentScript) {
  const allTabs = await browser.tabs.query({});
  const matchPatterns = contentScript.matches.map(
    (match) => new MatchPattern(match),
  );
  const matchingTabs = allTabs.filter((tab) => {
    const url = tab.url;
    if (!url) return false;
    return !!matchPatterns.find((pattern) => pattern.includes(url));
  });
  await Promise.all(
    matchingTabs.map(async (tab) => {
      try {
        await browser.tabs.reload(tab.id!);
      } catch (err) {
        logger.warn('Failed to reload tab:', err);
      }
    }),
  );
}

export async function reloadContentScriptMv2(
  _payload: ReloadContentScriptPayload,
) {
  throw Error('TODO: reloadContentScriptMv2');
}
