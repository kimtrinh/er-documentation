#!/usr/bin/env python3
"""One-off migration: repoint asset *open/download* links to SharePoint.

Rules (confirmed with the site owner):
  * Convert click-out links only:
      - <a href="assets/...">            (direct PDF download/open buttons)
      - Office viewer "Open" links:
        href=".../op/view.aspx?src=https://kimtrinh.github.io/er-documentation/assets/..."
  * Leave inline previews untouched:
      - <iframe src="assets/...">         (local PDF previews)
      - Office viewer embeds: .../op/embed.aspx?src=...   (stay public)

SharePoint layout: the local assets/ folder was copied into a SharePoint
"assets" folder, so local "assets/<path>" lives at
"Shared Documents/assets/assets/<path>" (subfolders preserved).
"""
import re
import sys

# Local "assets/<path>" was copied into a SharePoint "assets" folder, so the
# target is "Shared Documents/assets/assets/<path>". Our regexes capture the
# part *after* the local "assets/", so the base must include both levels.
SP_BASE = "https://sp-cloud.kp.org/sites/ERtoolkit/Shared%20Documents/assets/assets/"
GH_PREFIX = "https://kimtrinh.github.io/er-documentation/assets/"

FILES = [
    "links.html",
    "pedsfever.html",
    "algorithms.html",
    "service-agreements.html",
    "hospital-protocols.html",
]

# 1) Direct <a href="assets/..."> (single or double quoted). Local paths are
#    clean ASCII (verified), so we can prefix without re-encoding. Any #fragment
#    rides along inside the captured group.
HREF_RE = re.compile(r'href=(["\'])assets/([^"\']*)\1')

# 2) Office viewer OPEN links only (view.aspx, NOT embed.aspx). The asset path
#    after .../assets/ is already percent-encoded in the src; reuse it as-is.
OFFICE_OPEN_RE = re.compile(
    r'href=(["\'])https://view\.officeapps\.live\.com/op/view\.aspx\?src='
    + re.escape(GH_PREFIX) + r'([^"\']*)\1'
)


def relink(text):
    n_href = [0]
    n_office = [0]

    def href_sub(m):
        q, path = m.group(1), m.group(2)
        n_href[0] += 1
        return f'href={q}{SP_BASE}{path}{q}'

    def office_sub(m):
        q, path = m.group(1), m.group(2)
        n_office[0] += 1
        return f'href={q}{SP_BASE}{path}{q}'

    text = HREF_RE.sub(href_sub, text)
    text = OFFICE_OPEN_RE.sub(office_sub, text)
    return text, n_href[0], n_office[0]


def main():
    total_href = total_office = 0
    for fn in FILES:
        with open(fn, encoding="utf-8") as f:
            src = f.read()
        out, nh, no = relink(src)
        if out != src:
            with open(fn, "w", encoding="utf-8") as f:
                f.write(out)
        total_href += nh
        total_office += no
        print(f"{fn:28} direct-href: {nh:3}   office-open: {no:3}")
    print(f"{'TOTAL':28} direct-href: {total_href:3}   office-open: {total_office:3}")


if __name__ == "__main__":
    sys.exit(main())
