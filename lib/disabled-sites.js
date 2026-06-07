const DISABLED_SITES_KEY = "disabledSites";

function normalizeHostname(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    return "";
  }

  let hostname = trimmed;
  try {
    const url = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    hostname = new URL(url).hostname;
  } catch {
    hostname = trimmed.split("/")[0];
  }

  hostname = hostname.toLowerCase();
  return hostname.startsWith("www.") ? hostname.slice(4) : hostname;
}

function matchPatternsForHostname(hostname) {
  const site = hostname.toLowerCase();
  return [`*://${site}/*`, `*://*.${site}/*`];
}

async function loadDisabledSites() {
  const result = await browser.storage.sync.get([DISABLED_SITES_KEY]);
  const sites = result[DISABLED_SITES_KEY];
  return Array.isArray(sites) ? sites : [];
}

async function saveDisabledSites(sites) {
  await browser.storage.sync.set({ [DISABLED_SITES_KEY]: sites });
}
