# AMO submission copy

Copy the sections below into the AMO upload form. This file is not included in the release zip.

---

## Summary (short description)

Stop websites you choose from hijacking keyboard shortcuts so browser shortcuts keep working.

---

## Description (full listing)

Some websites register global keyboard listeners that intercept shortcuts you expect Firefox to handle (reload, close tab, workspace switching, and similar).

Disable Shortcuts for Firefox lets you register hostnames where the extension prevents the page from attaching keyboard event listeners. Browser shortcuts continue to work normally. Typing in inputs is unaffected because the extension does not intercept or cancel key events—it only blocks sites from registering listeners in the first place.

**How to use**

1. Click the extension icon.
2. Enter a hostname (for example `discord.com`) and click **Add**.
3. Reload tabs on that site for the change to take effect.
4. Remove a site from the list and reload to restore its shortcuts.

**Requirements:** Firefox 142 or later.

**Source code:** https://github.com/GrassPlanet/disable_shortcuts_for_firefox

---

## Privacy policy

No data is collected, transmitted, or sold. Your list of disabled sites is stored locally in Firefox Sync storage (`storage.sync`) and is not sent to the developer or any third party. The extension does not read page content or log keystrokes.

---

## Permission justification (reviewer notes)

**`<all_urls>` host permission**

Required so `scripting.registerContentScripts` can inject a content script on hostnames the user adds. The extension does not run on all sites by default—it only registers scripts for sites in the user's list. There is no blanket content script in the manifest.

**`storage`**

Stores the user's list of hostnames where shortcuts should be disabled.

**`scripting`**

Registers and unregisters per-hostname content scripts when the user adds or removes sites.

**Content script behavior**

On registered sites only, a MAIN-world script at `document_start` prevents pages from registering `keydown`/`keyup`/`keypress` listeners via `addEventListener` and `onkeydown`-style properties. This is the extension's sole purpose and is disclosed in the listing.

---

## Notes for reviewers

1. Load the extension and open the popup.
2. Add `discord.com` (or any site with aggressive keyboard shortcuts).
3. Reload a tab on that site.
4. Confirm site-specific shortcuts no longer fire.
5. Confirm browser shortcuts (for example reload, close tab) still work.
6. Remove the site in the popup, reload, and confirm site shortcuts work again.

No account or credentials are required.

---

## Suggested categories

- Tabs
- Accessibility (optional)

---

## License (AMO field if asked)

MIT — see `LICENSE` in the repository and release package.
