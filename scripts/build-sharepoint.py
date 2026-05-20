#!/usr/bin/env python3
"""Build a SharePoint-ready copy of the site with externally-loaded resources
stripped. Outputs to ./build-sharepoint/ and a ./er-documentation-sharepoint.zip."""

import os
import re
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "build-sharepoint"
ZIP_PATH = ROOT / "er-documentation-sharepoint.zip"

INCLUDE_TOP_LEVEL = {
    "agreements.html", "algorithms.html", "calculators.html", "changelog.html",
    "dotphrase.html", "ed-phone-directory.html", "feedback.html", "home.html",
    "hospital-protocols.html", "index.html", "links.html", "mdm-slash.html",
    "mdm.html", "mockup-redesign.html", "neurohub.html", "pedsfever.html",
    "roadmap.html", "rsi.html", "service-agreements.html", "service-requests.html",
    "sitemap.html", "vasopressors.html", "vertigo-helper.html",
    "analytics.js", "chatbot.js", "mdm.js", "mdm_risk_engine.js", "mdm_slash.js",
    "search-index.js", "theme.js",
    "mobile.css", "theme.css",
    "chatbot-index.json", "history_helper.json", "manifest.json",
    "mdm_packs.json",
    "LICENSE", ".nojekyll",
}
INCLUDE_DIRS = {"assets", "data", "docs"}


# --- HTML / JS transformations -------------------------------------------

EXTERNAL_SCRIPT_TAG = re.compile(
    r'<script\s+[^>]*src="https://(?:cdn\.jsdelivr\.net/npm/@emailjs|static\.cloudflareinsights\.com)[^"]*"[^>]*>\s*</script>\s*',
    re.IGNORECASE,
)

GOOGLE_FONTS_IMPORT = re.compile(
    r"@import\s+url\(\s*['\"]https://fonts\.googleapis\.com/[^'\"]+['\"]\s*\)\s*;",
    re.IGNORECASE,
)

SERVICE_WORKER_REG = re.compile(
    r"<script>\s*if\s*\(\s*['\"]serviceWorker['\"]\s+in\s+navigator\s*\)[^<]*</script>\s*",
    re.IGNORECASE,
)

EMAILJS_SHIM = """<script>
/* SharePoint build: EmailJS is unreachable from Kaiser network.
   Provide a stub so existing send() calls fail gracefully. */
window.emailjs = window.emailjs || {
  init: function () {},
  send: function () { return Promise.reject(new Error('Feedback form disabled in SharePoint build. Email the ED informatics team directly.')); }
};
</script>
"""

CHATBOT_NOTICE = """<script>
/* SharePoint build: Firebase Firestore chatbot may be blocked by the Kaiser
   firewall. Calls are already wrapped in try/catch and fall back to a
   local-only mode -- no further action required. */
</script>
"""


def transform_html(text: str) -> str:
    original = text

    # 1. Strip external <script src="..."> tags (EmailJS, Cloudflare beacon).
    text, n_scripts = EXTERNAL_SCRIPT_TAG.subn("", text)

    # 2. Inject an EmailJS stub once if any emailjs.* calls remain in the file.
    if "emailjs." in text and "window.emailjs = window.emailjs ||" not in text:
        text = re.sub(r"(<head[^>]*>)", r"\1\n" + EMAILJS_SHIM, text, count=1)

    # 3. Comment out Google Fonts CSS @import (fall back to system fonts).
    text, n_fonts = GOOGLE_FONTS_IMPORT.subn(
        "/* @import url(...fonts.googleapis.com...) removed for SharePoint build; falls back to system fonts */",
        text,
    )

    # 4. Remove the inline service-worker registration.
    text, n_sw = SERVICE_WORKER_REG.subn("", text)

    # 5. Insert a small note before any Firebase dynamic import (no behaviour change).
    if "firebasejs/11.4.0" in text and "/* SharePoint build:" not in text:
        text = re.sub(r"(<head[^>]*>)", r"\1\n" + CHATBOT_NOTICE, text, count=1)

    return text


def transform_analytics_js(text: str) -> str:
    # Blank the Cloudflare token so the beacon script is never appended.
    return re.sub(
        r"const\s+CF_BEACON_TOKEN\s*=\s*'[^']*';",
        "const CF_BEACON_TOKEN = '';  /* SharePoint build: analytics disabled */",
        text,
    )


# --- build ----------------------------------------------------------------

def reset_output():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    if ZIP_PATH.exists():
        ZIP_PATH.unlink()


def copy_tree(src: Path, dst: Path):
    shutil.copytree(src, dst)


def copy_and_transform():
    for name in INCLUDE_TOP_LEVEL:
        src = ROOT / name
        if not src.exists():
            print(f"  skip (missing): {name}")
            continue
        dst = OUT / name
        if name.endswith(".html"):
            dst.write_text(transform_html(src.read_text(encoding="utf-8")), encoding="utf-8")
        elif name == "analytics.js":
            dst.write_text(transform_analytics_js(src.read_text(encoding="utf-8")), encoding="utf-8")
        else:
            shutil.copy2(src, dst)

    for d in INCLUDE_DIRS:
        src = ROOT / d
        if src.exists():
            copy_tree(src, OUT / d)


SHAREPOINT_README = """ER Documentation -- SharePoint Build
=====================================

This is a static copy of the kimtrinh.github.io/er-documentation site,
modified so it can be hosted from a Kaiser SharePoint document library
without depending on externally-blocked services.

What's preserved
----------------
* All HTML pages and navigation
* All embedded PDFs / Word / PowerPoint files under assets/
* Protocols, agreements, calculators, dotphrases, algorithms, MDM
  helpers, vasopressors, RSI, peds fever, vertigo helper, neurohub,
  ED phone directory, hospital protocols, etc.
* Local-only client-side search (search-index.js)
* Theme / styling (with system-font fallback)

What's been disabled or stubbed
-------------------------------
* Google Fonts CSS @import        -> commented out; system fonts used
* Cloudflare Web Analytics        -> token blanked; beacon never loads
* EmailJS feedback / service forms-> replaced with a stub that rejects
                                     the send; users get a clear error.
                                     Replace these forms with a mailto:
                                     link or a SharePoint List form.
* Firebase / Firestore chatbot &
  announcement sync               -> imports left in place but wrapped
                                     in try/catch; if Kaiser blocks
                                     gstatic.com or googleapis.com the
                                     page falls back to local-only mode
                                     (no errors visible to users).
* Service worker registration     -> removed (SharePoint sub-paths
                                     can't host a root-scoped SW).

How to deploy
-------------
1. Get a SharePoint site / document library provisioned for the ED
   team. A Communication Site works well.

2. IMPORTANT: SharePoint Online has "Custom Script" disabled by default
   for security. HTML files uploaded to a normal document library will
   download instead of render. You have two options:

   a. Ask your SharePoint admin to enable custom script for this
      specific site (Site Settings > Site Collection Features, or via
      Set-SPOSite -DenyAddAndCustomizePages $false in PowerShell).
      Once enabled, upload everything in this folder to a document
      library and open index.html in the browser.

   b. Don't enable custom script. Instead, port the key reference
      pages to native SharePoint Pages and link to the PDFs / Word
      docs in assets/ as document-library files. This is more work
      but doesn't require a security exception.

3. Upload the *contents* of this folder (not the folder itself) to the
   target library, preserving the directory structure. The assets/,
   data/, and docs/ folders must come along.

4. Open index.html (or home.html) in the browser. Verify navigation
   works; you may need to adjust the base URL or relative paths
   depending on where the library sits.

5. The Firebase announcement sync and EmailJS feedback will not work.
   If you need those features, you'll need a Kaiser-approved backend
   (e.g. a SharePoint List for announcements; a Microsoft Form for
   feedback).

Known limitations
-----------------
* Some browsers / SharePoint configurations strip <script> tags from
  uploaded HTML even when custom script is enabled. If pages render
  but interactivity is broken, this is why.
* The mobile.css and theme.css have been left untouched -- if Kaiser's
  proxy blocks fonts.googleapis.com these files may have already had
  the @import commented out (only HTML files have inline <style>
  blocks containing that import).
* Internal links use relative paths. If you host this in a subfolder,
  the paths should still resolve.
"""


def write_readme():
    (OUT / "SHAREPOINT_README.txt").write_text(SHAREPOINT_README, encoding="utf-8")


def make_zip():
    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for path in sorted(OUT.rglob("*")):
            if path.is_file():
                arc = path.relative_to(OUT)
                zf.write(path, arcname=str(arc))
    return ZIP_PATH.stat().st_size


def main():
    print("Resetting output...")
    reset_output()
    print("Copying & transforming files...")
    copy_and_transform()
    write_readme()
    print("Zipping...")
    size = make_zip()
    print(f"Done.")
    print(f"  build dir: {OUT}")
    print(f"  zip file : {ZIP_PATH} ({size/1024/1024:.1f} MB)")


if __name__ == "__main__":
    main()
