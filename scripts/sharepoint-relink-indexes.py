#!/usr/bin/env python3
"""Finish the SharePoint migration for the generated index files.

scripts/sharepoint-relink.py repointed the HTML pages, but three generated /
index files still referenced the local assets/ copies and so were left behind:

  * search-index.js                    - search result `u:` targets
  * chatbot-index.json                 - chatbot citation `url` / `page`
  * data/service_agreements_index.json - `source_filename`

This applies the SAME rules the HTML migration used so the indexes point at
SharePoint and the local assets/ folder can be deleted:

  1. Office Online viewer open-links
       https://view.officeapps.live.com/op/view.aspx?src=<github.io>/assets/<p>
     collapse to the direct SharePoint URL  SP_BASE + <p>.
     (The viewer can't fetch an auth-gated SharePoint file; SharePoint renders
     Office docs itself for signed-in staff. Mirrors OFFICE_OPEN_RE in
     sharepoint-relink.py.)
  2. Bare github.io asset URLs   <github.io>/assets/<p>            -> SP_BASE + <p>
  3. Quoted local refs           "assets/<p>" / 'assets/<p>'       -> SP_BASE + <p>

The two inline images intentionally kept in the repo are never rewritten.
Idempotent: re-running on already-migrated files is a no-op.
"""
import re
import sys

# Same base used by scripts/sharepoint-relink.py (local assets/ was copied into
# a SharePoint "assets" folder, hence the doubled assets/assets/).
SP_BASE = "https://sp-cloud.kp.org/sites/ERtoolkit/Shared%20Documents/assets/assets/"
GH_PREFIX = "https://kimtrinh.github.io/er-documentation/assets/"
OFFICE_VIEW = "https://view.officeapps.live.com/op/view.aspx?src="

FILES = [
    "search-index.js",
    "chatbot-index.json",
    "data/service_agreements_index.json",
]

# Inline images kept local (an <img> can't point at SharePoint) — never repoint.
KEEP = {"restraint-orders.jpg"}


def _kept(tail):
    return tail.split("#")[0].rsplit("/", 1)[-1] in KEEP


# 1) Office viewer open-link wrapping a github.io asset URL.
OFFICE_RE = re.compile(re.escape(OFFICE_VIEW) + re.escape(GH_PREFIX) + r"([^'\"\s]+)")
# 2) Bare github.io asset URL.
GH_RE = re.compile(re.escape(GH_PREFIX) + r"([^'\"\s]+)")
# 3) Quoted ref whose value *starts* with assets/ (JSON or JS string literal).
REL_RE = re.compile(r"(['\"])assets/([^'\"]*)\1")


def relink(text):
    counts = {"office": 0, "gh": 0, "rel": 0}

    def office_sub(m):
        tail = m.group(1)
        if _kept(tail):
            return m.group(0)
        counts["office"] += 1
        return SP_BASE + tail

    def gh_sub(m):
        tail = m.group(1)
        if _kept(tail):
            return m.group(0)
        counts["gh"] += 1
        return SP_BASE + tail

    def rel_sub(m):
        q, tail = m.group(1), m.group(2)
        if _kept(tail):
            return m.group(0)
        counts["rel"] += 1
        return f"{q}{SP_BASE}{tail}{q}"

    text = OFFICE_RE.sub(office_sub, text)   # before GH_RE: it contains GH_PREFIX
    text = GH_RE.sub(gh_sub, text)
    text = REL_RE.sub(rel_sub, text)
    return text, counts


def main():
    total = {"office": 0, "gh": 0, "rel": 0}
    for fn in FILES:
        with open(fn, encoding="utf-8") as f:
            src = f.read()
        out, counts = relink(src)
        if out != src:
            with open(fn, "w", encoding="utf-8") as f:
                f.write(out)
        for k in total:
            total[k] += counts[k]
        print(f"{fn:38} office:{counts['office']:3} gh:{counts['gh']:3} rel:{counts['rel']:3}")
    print(f"{'TOTAL':38} office:{total['office']:3} gh:{total['gh']:3} rel:{total['rel']:3}")


if __name__ == "__main__":
    sys.exit(main())
