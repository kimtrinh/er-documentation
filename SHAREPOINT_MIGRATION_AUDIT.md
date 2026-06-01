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
| Inline images kept in `assets/` | 2 | ⚪ Intentionally local (an `<img>` can't use an auth-gated embed) |
| Other local documents (`docs/announcements/`) | 1 | ❌ **Still local** — the only actionable item |
| SharePoint links not in the inventory snapshot | 2 | ⚠️ Confirm uploaded |
| Links to other KP SharePoint sites | ~10 | ⚪ Left as-is, not validated |

`scripts/check-sharepoint-links.py` currently passes (no stray local `assets/`
dependencies), so the asset half of the migration is structurally complete.

---

## 2. Still hosted locally — the one actionable document

**File:** `docs/announcements/ED_RADIOLOGY_EPIC_DOWNTIME.docx`

It is referenced **3×**, all in `hospital-protocols.html`, and all currently
routed through the **public** Office Online viewer pointing back at github.io
(so it renders for anyone, off-network included — unlike the migrated assets):

| Line | Kind | Current target |
| --- | --- | --- |
| `hospital-protocols.html:2313` | Download/open button | `view.officeapps.live.com/op/view.aspx?src=…github.io/…/ED_RADIOLOGY_EPIC_DOWNTIME.docx` |
| `hospital-protocols.html:2321` | "Open in Word ↗" link | same `op/view.aspx` viewer URL |
| `hospital-protocols.html:2323` | Inline preview `<iframe>` | `view.officeapps.live.com/op/embed.aspx?src=…github.io/…/…docx` |

It is **not** in `data/sharepoint-embeds.json` and **not** in the search or
chatbot indexes, so it is self-contained to this one page.

### Completion checklist for this document

1. **Upload** `ED_RADIOLOGY_EPIC_DOWNTIME.docx` into the SharePoint library,
   matching how assets were placed (assets live under
   `Shared Documents/assets/assets/…`; pick the equivalent folder, e.g.
   `Shared Documents/assets/docs/announcements/`).
2. **Capture two values** from the signed-in SharePoint browser:
   - the file's **`UniqueId` GUID** (for the inline preview embed), and
   - its **direct path** under `…/Shared Documents/…` (for the open/download links).
3. **Repoint the two open/download links** (`:2313`, `:2321`) to the direct
   SharePoint URL — same transform as `OFFICE_OPEN_RE` in
   `scripts/sharepoint-relink.py`:
   `…/Shared%20Documents/assets/docs/announcements/ED_RADIOLOGY_EPIC_DOWNTIME.docx`.
4. **Repoint the inline preview** (`:2323`) to
   `https://sp-cloud.kp.org/sites/ERtoolkit/_layouts/15/embed.aspx?UniqueId=<GUID>`
   — same transform as `scripts/sharepoint-embed.py` (`EMBED_BASE`).
5. **Add the GUID to `data/sharepoint-embeds.json`** so the audit recognizes it.
6. **Delete** the local `docs/announcements/ED_RADIOLOGY_EPIC_DOWNTIME.docx`.
7. **Re-run the gate:** `python3 scripts/check-sharepoint-links.py` (expect no
   FATAL) and `node scripts/smoke-check.js`.

> Trade-off to confirm before doing this: the migrated copy will render **only
> for signed-in KP staff** (off-network shows nothing), matching the rest of the
> assets. Today this downtime doc is publicly viewable. If public visibility is
> intentional, leave it as-is.

The existing scripts hard-code a `FILES` list of pages and only handle the
`assets/` prefix, so they won't pick up this `docs/announcements/` file without
a small edit — the steps above are the manual equivalent.

---

## 3. Intentionally kept local (no action needed)

These two `<img>` sources stay in the repo because an image tag can't display an
SSO-gated SharePoint embed. Both are whitelisted as `KEEP_LOCAL` /`KEEP` in the
migration + audit scripts:

- `assets/restraint-orders.jpg`
- `assets/pnl-adult-acute-transfusion-reaction.png`

If you ever want these off GitHub too, they'd need to become click-through
links to SharePoint rather than inline `<img>` previews (a UX change).

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

### 4b. Links to other KP SharePoint sites ⚪
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
