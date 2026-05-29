#!/usr/bin/env python3
"""Convert inline document *previews* to SharePoint embeds.

Goal (confirmed with owner): previews should render only inside the KP network.
SharePoint's _layouts/15/embed.aspx?UniqueId=<GUID> endpoint does exactly that
(it renders for signed-in KP staff and shows nothing off-network).

What this rewrites (only inside <iframe ...> tags):
  * src="assets/<path>"                                  (local PDF previews)
  * src=".../op/embed.aspx?src=https://kimtrinh.github.io/er-documentation/assets/<path>"
  * src=".../op/view.aspx?src=https://kimtrinh.github.io/er-documentation/assets/<path>"
    (one stray Office viewer used as an iframe)

What it leaves alone:
  * <a href> download/open links (already point to SharePoint)
  * <img> tags and any iframe whose file isn't in the SharePoint map (reported)
  * iframes already pointing at sp-cloud (e.g. the orbital-fractures test)

GUID map: data/sharepoint-embeds.json (filename relative to assets/ -> UniqueId).
"""
import json
import os
import re
import sys
from urllib.parse import unquote

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP_PATH = os.path.join(ROOT, "data", "sharepoint-embeds.json")
EMBED_BASE = "https://sp-cloud.kp.org/sites/ERtoolkit/_layouts/15/embed.aspx?UniqueId="
GH_MARK = "kimtrinh.github.io/er-documentation/assets/"

FILES = [
    "links.html", "pedsfever.html", "algorithms.html",
    "service-agreements.html", "hospital-protocols.html",
]

IFRAME_RE = re.compile(r'<iframe\b[^>]*>', re.IGNORECASE)
SRC_RE = re.compile(r'(\ssrc=)(["\'])(.*?)\2', re.IGNORECASE)


def asset_key_from_src(src):
    """Return the assets-relative key for a preview src, or None to skip."""
    if src.startswith("assets/"):
        rel = src[len("assets/"):]
    elif GH_MARK in src and "officeapps.live.com" in src:
        rel = src.split(GH_MARK, 1)[1]
    else:
        return None  # already sp-cloud, or non-asset (e.g. docs/announcements)
    rel = rel.split("#", 1)[0].split("&", 1)[0]  # drop #fragment / extra params
    return unquote(rel)


def main():
    with open(MAP_PATH, encoding="utf-8") as f:
        embeds = json.load(f)["embeds"]

    # --- Validation: every mapped key must be a real local file -------------
    missing_on_disk = [k for k in embeds if not os.path.exists(os.path.join(ROOT, "assets", k))]
    if missing_on_disk:
        print("ERROR: map keys with no matching local file:")
        for k in missing_on_disk:
            print("   -", k)
        return 1

    converted = 0
    skipped = []   # (file, src) we left untouched

    for fn in FILES:
        path = os.path.join(ROOT, fn)
        with open(path, encoding="utf-8") as f:
            text = f.read()

        def fix_iframe(m):
            nonlocal converted
            tag = m.group(0)
            sm = SRC_RE.search(tag)
            if not sm:
                return tag
            src = sm.group(3)
            key = asset_key_from_src(src)
            if key is None:
                return tag
            guid = embeds.get(key)
            if not guid:
                skipped.append((fn, src))
                return tag
            converted += 1
            new_src = f'{sm.group(1)}{sm.group(2)}{EMBED_BASE}{guid}{sm.group(2)}'
            return tag[:sm.start()] + new_src + tag[sm.end():]

        out = IFRAME_RE.sub(fix_iframe, text)
        if out != text:
            with open(path, "w", encoding="utf-8") as f:
                f.write(out)

    print(f"Converted {converted} preview iframes to SharePoint embeds.")
    if skipped:
        print(f"Left {len(skipped)} iframe(s) untouched (asset not in SharePoint map):")
        for fn, src in skipped:
            print(f"   - {fn}: {src[:90]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
