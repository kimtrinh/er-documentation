# SharePoint Migration — Audit & Completion Checklist

_Generated 2026-06-01. Audit only — no site pages were modified._

This report inventories exactly what has already moved from the public GitHub
site (`kimtrinh.github.io/er-documentation`) to the KP intranet SharePoint site
(`sp-cloud.kp.org/sites/ERtoolkit`), what is still hosted locally, and the
steps to finish. It uses the migration pattern already established in
`scripts/sharepoint-relink.py`, `scripts/sharepoint-embed.py`,
`scripts/sharepoint-relink-indexes.py`, and the audit gate
`scripts/check-sharepoint-links.py`.

> **Where the bytes live:** the SharePoint site is behind KP SSO and is not
> reachable from CI or this tooling. Uploading files to SharePoint and reading
> their `UniqueId` GUIDs must be done from a signed-in KP browser/session. The
> repo scripts only rewrite *references*; they never move bytes.

---

## 1. Status at a glance

| Category | Count | State |
| --- | --- | --- |
| Asset documents (PDF/DOCX/PPTX) in `assets/` | ~180 | ✅ Migrated; local copies deleted (commit `a9c5101`) |
| `docs/announcements/ED_RADIOLOGY_EPIC_DOWNTIME.docx` | 1 | ✅ Migrated; local copy deleted (this PR) |
| Inline images served publicly from `assets/` | 0 | ✅ Both images now gated behind SharePoint embeds; `assets/` is empty — see §3 |
| SharePoint links not in the inventory snapshot | 2 | ⚠️ Confirm uploaded |
| Links to other KP SharePoint sites | ~10 | ⚪ Left as-is, not validated |

**No downloadable documents remain on GitHub Pages.** Every PDF/DOCX/PPTX —
including the last `docs/announcements/` Word doc — now resolves to the
SSO-gated SharePoint library. `scripts/check-sharepoint-links.py` and
`scripts/smoke-check.js` both pass.

---

## 2. `docs/announcements/ED_RADIOLOGY_EPIC_DOWNTIME.docx` — ✅ done

Migrated in this PR. The file was uploaded to
`Shared Documents/assets/docs/announcements/` and the three references in
`hospital-protocols.html` were repointed:

| Line | Kind | New target |
| --- | --- | --- |
| download button | open link | `…/Shared%20Documents/assets/docs/announcements/ED_RADIOLOGY_EPIC_DOWNTIME.docx` |
| "Open in Word ↗" | open link | same direct SharePoint URL |
| inline `<iframe>` | preview | `…/_layouts/15/embed.aspx?UniqueId=5b6bec0c-8b67-4daa-b42a-ffcbebbdd23f` |

GUID added to `data/sharepoint-embeds.json`; local copy deleted; both gate
scripts pass. As with the rest of the library, the inline preview now renders
**only for signed-in KP staff** (off-network shows nothing).

---

## 3. Inline images — ✅ all gated

Both images that were previously served publicly via `<img src="assets/…">` have
been replaced with the SSO-gated `embed.aspx?UniqueId=<GUID>` iframe and their
local files deleted. **`assets/` is now empty.**

| File | What it is | State |
| --- | --- | --- |
| `pnl-adult-acute-transfusion-reaction.png` | **Screenshot of a KP Epic order set** (nursing orders, drug doses) | ✅ Gated (`UniqueId=2c5c16eb-…`). Also removed the verbatim drug-dose `alt` text that was previously public. |
| `restraint-orders.jpg` | Restraint-orders quick-reference comparison | ✅ Gated (`UniqueId=f3e66ce3-…`). |

The `KEEP_LOCAL` / `KEEP` whitelists in the scripts are now empty — no asset is
intentionally kept public anymore. Both images render only for signed-in KP staff.

---

## 4. Loose ends to confirm

### 4a. Two SharePoint links not in the inventory snapshot ⚠️
The audit's inventory is a REST snapshot taken 2026-05-29. These two files are
already pointed at SharePoint but post-date the snapshot, and are referenced
**only by the generated indexes** (`search-index.js`, `chatbot-index.json`) —
no HTML page links them:

- `2024-05-29 - …ICH-related NEURO and ED Order Sets… - 2684_INTRACRANIAL_HEMORRHAGE_ED_SCAL.docx`
- `2024-05-29 - …ICH-related NEURO and ED Order Sets… - 2022 ICH Guideline Update_ED_v5 F.pptx`

**Action:** confirm both are actually uploaded to the ERtoolkit library. If yes,
optionally add them to `data/sharepoint-embeds.json` to clear the warning; if
no, those two index entries will 404 for users who click them.

### 4b. Phone directory (`ed-phone-directory.html`) — low priority ⚪
Contains ~39 phone numbers plus pager/Vocera/Cisco device references. Spot-check
shows they are mostly toll-free / main institutional lines (e.g. `800-464-4000`,
local `909-…` hospital numbers) rather than personal PII. It is operational
internal info on a public site, but not document-class confidential. Flagged for
awareness; no migration action proposed unless Compliance wants the directory
gated.

### 4c. Public text indexes — already redaction-aware ✅
`data/service_agreements_index.json` stores **summaries** (`summary_bullets`,
`ed_actions`, …) with an explicit `redaction_notes` field and a `sharepoint_url`
to the gated source — not verbatim agreement text. `chatbot-index.json` /
`search-index.js` only index text that already appears on the public HTML pages.
So migrating the source documents did not leave their full text behind in a
public index.

### 4d. Links to other KP SharePoint sites ⚪
Left untouched by design (the migration only owns the ERtoolkit library).
Logged for awareness, not validated:

- `sites/FONTANANEDOCS/…` — 6 links (NEDOCS embed `Doc.aspx` views)
- `sites/Fontario/…` — 4 links (PLOS service agreement PDF, CollabHome, Vocera-Web)

---

## 5. The other reading: hosting the whole web app on SharePoint

If "migrating most files" was meant to move the **application pages**
(HTML/JS/CSS/JSON) off GitHub Pages and serve them from SharePoint, that is a
materially larger effort with real functionality risk. Captured here so the
trade-offs are on record:

- **Custom JavaScript is blocked by default** on modern SharePoint Online
  (the NoScript / "custom script" restriction). Nearly every page here ships
  inline `<script>` and depends on bundled JS (`search-index.js`, `mdm.js`,
  `mdm_slash.js`, `chatbot.js`, `theme.js`, `dotphrases.js`, etc.), so a plain
  document-library upload would not run.
- **Dynamic features that assume a web origin would break or need rework:**
  - Firestore-backed features (`index.html`, `home.html`, `dotphrase.html`,
    `service-requests.html`) — needs allowed origins / auth domain config.
  - PWA + offline service worker (`sw.js`, registered on 22 pages) — service
    workers require a controllable origin and HTTPS scope SharePoint won't give
    a doc-library path.
  - Cloudflare Web Analytics (`analytics.js`) and the existing Cloudflare
    Workers static-asset deploy (`wrangler.jsonc`, `.assetsignore`).
  - Relative URLs and hash-anchor navigation that `search-index.js` and
    `chatbot-index.json` depend on (validated by `scripts/smoke-check.js`).
- **Viable SharePoint-hosting routes**, if pursued, are roughly: (a) an SPFx
  web part / app catalog deployment, (b) classic site pages with script
  allowed, or (c) keep the app on GitHub/Cloudflare and only embed it inside a
  SharePoint page via the Embed web part. Each is its own project.

**Recommendation:** keep the app hosted on GitHub Pages / Cloudflare and keep
*documents* on SharePoint (the current direction). Only Section 2 remains to
reach full document parity.

---

## 6. Tooling reference (already in the repo)

| Script | Role |
| --- | --- |
| `scripts/sharepoint-relink.py` | Repoint `<a href>` open/download links → direct SharePoint URL |
| `scripts/sharepoint-embed.py` | Repoint inline preview `<iframe>` → `embed.aspx?UniqueId=<GUID>` |
| `scripts/sharepoint-relink-indexes.py` | Apply the same rules to `search-index.js`, `chatbot-index.json`, `data/service_agreements_index.json` |
| `scripts/check-sharepoint-links.py` | Offline gate: fails on stray local `assets/` refs or unknown embed GUIDs |
| `scripts/build-chatbot-index.js` | Rebuilds `chatbot-index.json` from page HTML |
| `scripts/smoke-check.js` | Validates JS/inline-script syntax and `search-index.js` URL/anchor targets |
| `data/sharepoint-embeds.json` | Asset-path → `UniqueId` GUID map (the embed inventory) |

**Definition of "done" for the document migration:** Section 2 completed,
`check-sharepoint-links.py` passes with no FATAL and no inventory warnings, and
the two Section 4a files confirmed uploaded.
