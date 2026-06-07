const siteInput = document.getElementById("site-input");
const addSiteButton = document.getElementById("add-site-button");
const siteList = document.getElementById("site-list");
const emptyState = document.getElementById("empty-state");
const formError = document.getElementById("form-error");

function showError(message) {
  formError.textContent = message;
  formError.hidden = !message;
}

async function renderSiteList(sites) {
  siteList.replaceChildren();
  emptyState.hidden = sites.length > 0;

  for (const hostname of [...sites].sort()) {
    const item = document.createElement("li");
    item.className = "site-item";

    const name = document.createElement("span");
    name.textContent = hostname;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove ${hostname}`);
    removeButton.addEventListener("click", async () => {
      const next = (await loadDisabledSites()).filter((site) => site !== hostname);
      await saveDisabledSites(next);
      await renderSiteList(next);
    });

    item.append(name, removeButton);
    siteList.append(item);
  }
}

async function addSite() {
  showError("");

  const hostname = normalizeHostname(siteInput.value);
  if (!hostname || !hostname.includes(".")) {
    showError("Enter a hostname, for example discord.com.");
    return;
  }

  const sites = await loadDisabledSites();
  if (sites.includes(hostname)) {
    showError(`${hostname} already has shortcuts disabled.`);
    return;
  }

  const next = [...sites, hostname];
  await saveDisabledSites(next);

  siteInput.value = "";
  await renderSiteList(next);
}

addSiteButton.addEventListener("click", addSite);
siteInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addSite();
  }
});

loadDisabledSites().then(renderSiteList).catch(() => {
  showError("Could not load saved sites.");
});
