const LISTENER_SCRIPT = "content/disable-page-listeners.js";
const SCRIPT_ID_PREFIX = "disable-";

function scriptIdForHostname(hostname) {
  const sanitized = hostname
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${SCRIPT_ID_PREFIX}${sanitized}`;
}

function isManagedScriptId(scriptId) {
  return scriptId.startsWith(SCRIPT_ID_PREFIX);
}

function buildRegistrations(hostnames) {
  return hostnames.map((hostname) => ({
    id: scriptIdForHostname(hostname),
    matches: matchPatternsForHostname(hostname),
    js: [LISTENER_SCRIPT],
    runAt: "document_start",
    allFrames: true,
    world: "MAIN",
  }));
}

async function syncListenerScripts() {
  const desired = buildRegistrations(await loadDisabledSites());
  const existing = await browser.scripting.getRegisteredContentScripts();
  const managedIds = existing
    .filter((script) => isManagedScriptId(script.id))
    .map((script) => script.id);

  if (managedIds.length > 0) {
    await browser.scripting.unregisterContentScripts({ ids: managedIds });
  }

  if (desired.length > 0) {
    await browser.scripting.registerContentScripts(desired);
  }
}

function scheduleSync() {
  syncListenerScripts().catch((error) => {
    console.error("disable_shortcuts_for_firefox: sync failed", error);
  });
}

browser.runtime.onInstalled.addListener(scheduleSync);
browser.runtime.onStartup.addListener(scheduleSync);
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes[DISABLED_SITES_KEY]) {
    scheduleSync();
  }
});

scheduleSync();
