#!/usr/bin/env python3
"""Audit the SharePoint links that replaced the local asset files.

A STRUCTURAL check that runs fully offline. It cannot confirm a link is live
(SharePoint sits behind KP SSO), but it gates the removal of the local assets/
folder by proving the site no longer depends on it.

FATAL (exit non-zero):
  1. Any stray *local* `assets/<path>` reference (href/src/url/JSON value),
     except the inline images intentionally kept local (KEEP_LOCAL). After the
     assets/ folder is deleted, such a reference would 404.
  2. Any inline embed `embed.aspx?UniqueId=<guid>` whose GUID is not in
     data/sharepoint-embeds.json.

WARNING (informational, exit still 0):
  * A SharePoint direct link whose decoded path is not in the embed-map
    inventory (the SharePoint REST snapshot). Usually means the file post-dates
    the snapshot — confirm it's actually uploaded before relying on the link.
  * Links to other KP SharePoint sites (left as-is, not validated).

This check does not depend on the assets/ folder existing, so it keeps working
after the local copies are deleted.
"""
import json
import os
import re
import sys
import urllib.parse
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EMBED_MAP = os.path.join(ROOT, "data", "sharepoint-embeds.json")

# Previously held the inline images kept in the repo; now empty since every
# asset (images included) has been gated behind SharePoint embeds.
KEEP_LOCAL = set()

# Direct download/open link into the migrated assets library.
DIRECT_RE = re.compile(
    r"https://sp-cloud\.kp\.org/sites/ERtoolkit/Shared%20Documents/assets/assets/"
    r"([^\"'`)\s]+)"
)
# Inline preview embed.
EMBED_RE = re.compile(r"embed\.aspx\?UniqueId=([0-9a-fA-F-]{36})")
# Any sp-cloud link, to spot ones pointing at other sites.
ANY_SP_RE = re.compile(r"https://sp-cloud\.kp\.org/[^\"'`)\s]+")
# A *local* asset reference: a quote / paren / equals immediately before
# "assets/" (so it's the start of an attribute or string value, not the
# ".../assets/assets/" tail of a SharePoint URL, which is preceded by "/").
LOCAL_RE = re.compile(r"(?<=[\"'(=])assets/([^\"'`)>\s]+)")


def source_files():
    skip_dirs = {".git", "node_modules", "assets", ".playwright-cli"}
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in skip_dirs]
        for name in filenames:
            if name.endswith((".html", ".js", ".json")):
                yield os.path.join(dirpath, name)


def rel(path):
    return os.path.relpath(path, ROOT)


def _clean(path):
    """Decode and strip any #fragment / ?query."""
    return urllib.parse.unquote(re.split(r"[#?]", path, 1)[0])


def main():
    with open(EMBED_MAP, encoding="utf-8") as fh:
        embed_map = json.load(fh)["embeds"]
    guids = {g.lower() for g in embed_map.values()}
    inventory = set(embed_map.keys())  # every asset path known to SharePoint

    stray_local = []       # (file, ref) local assets/ ref that would 404
    unknown_guids = []     # (file, guid) not in the embed map
    unknown_sp = []        # (file, path) SP link not in the inventory snapshot
    direct_paths = set()
    used_guids = set()
    other_sites = defaultdict(int)

    for src in source_files():
        with open(src, encoding="utf-8", errors="replace") as fh:
            text = fh.read()

        for m in LOCAL_RE.finditer(text):
            path = _clean(m.group(1))
            if os.path.basename(path) in KEEP_LOCAL:
                continue
            stray_local.append((rel(src), "assets/" + path))

        for m in DIRECT_RE.finditer(text):
            path = _clean(m.group(1))
            direct_paths.add(path)
            if path not in inventory:
                unknown_sp.append((rel(src), path))

        for m in EMBED_RE.finditer(text):
            guid = m.group(1).lower()
            used_guids.add(guid)
            if guid not in guids:
                unknown_guids.append((rel(src), guid))

        for m in ANY_SP_RE.finditer(text):
            seg = re.search(r"/sites/([^/]+)/", m.group(0))
            site = seg.group(1) if seg else "(unknown)"
            if site != "ERtoolkit":
                other_sites[site] += 1

    print("SharePoint link audit")
    print("=====================")
    print(f"Direct file links     : {len(direct_paths)} distinct paths")
    print(f"Inline embeds         : {len(used_guids)} distinct GUIDs")
    print(f"Embed GUIDs in mapping : {len(guids)}")
    print(f"Local refs kept (imgs) : {len(KEEP_LOCAL)}")
    print()

    ok = True

    if stray_local:
        ok = False
        uniq = sorted(set(f"{f}: {r}" for f, r in stray_local))
        print(f"FATAL — {len(uniq)} stray local asset reference(s) (would 404 "
              f"after deleting assets/):")
        for line in uniq:
            print(f"  {line}")
        print()

    if unknown_guids:
        ok = False
        print(f"FATAL — {len(unknown_guids)} embed(s) use a GUID not in the map:")
        for f, g in unknown_guids:
            print(f"  {f}: {g}")
        print()

    if unknown_sp:
        uniq = sorted(set(p for _, p in unknown_sp))
        print(f"WARNING — {len(uniq)} SharePoint link(s) point to a path not in "
              f"the {len(inventory)}-file inventory snapshot. Confirm these are "
              f"uploaded to SharePoint:")
        for p in uniq:
            print(f"  assets/{p}")
        print()

    if other_sites:
        print("Links to other KP SharePoint sites (left as-is, not validated):")
        for site, n in sorted(other_sites.items()):
            print(f"  {site}: {n} link(s)")
        print()

    if ok:
        print("RESULT: no local asset dependencies remain; the assets/ folder "
              "is fully migrated to SharePoint.")
        print("(Live reachability still requires a signed-in KP browser check.)")
    else:
        print("RESULT: FATAL problems found — do NOT delete assets/ yet.")

    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
