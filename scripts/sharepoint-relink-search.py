#!/usr/bin/env python3
"""Repoint asset links in search-index.js to SharePoint.

The static search entries carry a `u:'...'` link. Two asset forms exist:
  * Office viewer: u:'https://view.officeapps.live.com/op/view.aspx?src=
                      https://kimtrinh.github.io/er-documentation/assets/<file>'
  * Direct:        u:'assets/<file>'

Both become the SharePoint direct path (same target as the page download
links): https://sp-cloud.kp.org/sites/ERtoolkit/Shared%20Documents/assets/assets/<file>

chatbot-index.json derives its links from these `u:` values, so rebuild it
afterwards (node scripts/build-chatbot-index.js).
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE = os.path.join(ROOT, "search-index.js")
SP = "https://sp-cloud.kp.org/sites/ERtoolkit/Shared%20Documents/assets/assets/"
OFFICE = "https://view.officeapps.live.com/op/view.aspx?src=https://kimtrinh.github.io/er-documentation/assets/"


def main():
    with open(FILE, encoding="utf-8") as f:
        text = f.read()
    before = text
    n_office = text.count(OFFICE)
    text = text.replace(OFFICE, SP)
    n_direct = text.count("u:'assets/")
    text = text.replace("u:'assets/", "u:'" + SP)
    if text != before:
        with open(FILE, "w", encoding="utf-8") as f:
            f.write(text)
    print(f"search-index.js  office-viewer: {n_office}   direct: {n_direct}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
