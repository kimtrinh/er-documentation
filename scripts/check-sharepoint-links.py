#!/usr/bin/env python3
"""Audit the SharePoint links that replaced the local asset files.

This is a STRUCTURAL check that runs fully offline. It does not (and cannot
from a non-KP network) confirm that a link is live — SharePoint sits behind
KP SSO. What it does confirm:

  1. Every direct file link
       https://sp-cloud.kp.org/.../Shared%20Documents/assets/assets/<path>
     decodes to a file that still exists under the local assets/ folder.
     (The local assets/ tree was copied verbatim into a SharePoint "assets"
     folder, so "assets/<path>" lives at "assets/assets/<path>" there.)

  2. Every inline embed
       .../_layouts/15/embed.aspx?UniqueId=<guid>
     uses a GUID that exists in data/sharepoint-embeds.json.

  3. Reports informational items: assets present locally but never linked,
     and links to other KP SharePoint sites (left as-is, not validated).

Exit status is non-zero if any link is structurally broken (a dead file path
or an unknown embed GUID), so it can gate a release.
"""
import json
import os
import re
import sys
import urllib.parse
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
EMBED_MAP = os.path.join(ROOT, "data", "sharepoint-embeds.json")

# Direct download/open link into the migrated assets library.
DIRECT_RE = re.compile(
    r"https://sp-cloud\.kp\.org/sites/ERtoolkit/Shared%20Documents/assets/assets/"
    r"([^\"'`)\s]+)"
)
# Inline preview embed.
EMBED_RE = re.compile(r"embed\.aspx\?UniqueId=([0-9a-fA-F-]{36})")
# Any sp-cloud link, to spot ones pointing at other sites.
ANY_SP_RE = re.compile(r"https://sp-cloud\.kp\.org/[^\"'`)\s]+")


def source_files():
    skip_dirs = {".git", "node_modules", "assets", ".playwright-cli"}
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for name in filenames:
            if name.endswith((".html", ".js")):
                yield os.path.join(dirpath, name)


def rel(path):
    return os.path.relpath(path, ROOT)


def main():
    with open(EMBED_MAP, encoding="utf-8") as fh:
        embed_map = json.load(fh)["embeds"]
    guids = {g.lower() for g in embed_map.values()}
    # Reverse map: embed GUID -> asset path, so a file embedded (but not
    # directly linked) still counts as referenced.
    guid_to_path = {g.lower(): p for p, g in embed_map.items()}

    broken_files = []      # (file, link path) where the local asset is missing
    unknown_guids = []     # (file, guid) not present in the embed map
    linked_assets = set()  # asset paths (relative to assets/) referenced by a link
    used_guids = set()
    other_sites = defaultdict(int)

    for src in source_files():
        with open(src, encoding="utf-8", errors="replace") as fh:
            text = fh.read()

        for m in DIRECT_RE.finditer(text):
            # Drop any #fragment (e.g. PDF #page=7) or ?query before resolving.
            raw = re.split(r"[#?]", m.group(1), 1)[0]
            decoded = urllib.parse.unquote(raw)
            linked_assets.add(decoded)
            if not os.path.isfile(os.path.join(ASSETS, decoded)):
                broken_files.append((rel(src), decoded))

        for m in EMBED_RE.finditer(text):
            guid = m.group(1).lower()
            used_guids.add(guid)
            if guid not in guids:
                unknown_guids.append((rel(src), guid))

        for m in ANY_SP_RE.finditer(text):
            url = m.group(0)
            seg = re.search(r"/sites/([^/]+)/", url)
            site = seg.group(1) if seg else "(unknown)"
            if site != "ERtoolkit":
                other_sites[site] += 1

    # Assets on disk that nothing links to (informational only).
    on_disk = set()
    for dirpath, _, filenames in os.walk(ASSETS):
        for name in filenames:
            on_disk.add(os.path.relpath(os.path.join(dirpath, name), ASSETS))
    embedded_paths = {guid_to_path[g] for g in used_guids if g in guid_to_path}
    referenced = linked_assets | embedded_paths
    orphans = sorted(on_disk - referenced)

    print("SharePoint link audit")
    print("=====================")
    print(f"Direct file links resolved : {len(linked_assets)} distinct assets")
    print(f"Inline embeds resolved     : {len(used_guids)} distinct GUIDs")
    print(f"Embed GUIDs in mapping     : {len(guids)}")
    print(f"Asset files on disk        : {len(on_disk)}")
    print()

    ok = True

    if broken_files:
        ok = False
        print(f"BROKEN — {len(broken_files)} link(s) point to a missing file:")
        for f, p in broken_files:
            print(f"  {f}: assets/{p}")
        print()

    if unknown_guids:
        ok = False
        print(f"BROKEN — {len(unknown_guids)} embed(s) use a GUID not in the map:")
        for f, g in unknown_guids:
            print(f"  {f}: {g}")
        print()

    if other_sites:
        print("Links to other KP SharePoint sites (left as-is, not validated):")
        for site, n in sorted(other_sites.items()):
            print(f"  {site}: {n} link(s)")
        print()

    if orphans:
        print(f"Note — {len(orphans)} asset file(s) on disk are not linked anywhere:")
        for p in orphans:
            print(f"  assets/{p}")
        print()

    if ok:
        print("RESULT: all SharePoint links are structurally valid.")
        print("(Live reachability still requires a signed-in KP browser check.)")
    else:
        print("RESULT: structural problems found — see BROKEN sections above.")

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
