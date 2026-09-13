"""Text BRUT din paginile Microsoft descarcate cu curl (raw/*.html) -> raw/<nume>.txt + cautari.txt.
Folosire: python extrage.py "termen1" "termen2" ...   (cauta in toate paginile, max 2 aparitii/termen)"""
import html
import re
import sys
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"
URL = {
    "master_ro": "https://support.microsoft.com/ro-ro/office/b9abb2a0-7aef-4257-a14e-4329c904da54",
    "master_en": "https://support.microsoft.com/en-us/office/b9abb2a0-7aef-4257-a14e-4329c904da54",
    "master2_ro": "https://support.microsoft.com/ro-ro/powerpoint/training/customize-a-slide-master",
    "master2_en": "https://support.microsoft.com/en-us/powerpoint/training/customize-a-slide-master",
    "layout_ro": "https://support.microsoft.com/ro-ro/office/158e6dba-e53e-479b-a6fc-caab72609689",
    "layout_en": "https://support.microsoft.com/en-us/office/158e6dba-e53e-479b-a6fc-caab72609689",
    "fundal_ro": "https://support.microsoft.com/ro-ro/office/3ac2075c-f51b-4fbd-b356-b4c6748ec966",
    "fundal_en": "https://support.microsoft.com/en-us/office/3ac2075c-f51b-4fbd-b356-b4c6748ec966",
    "teme_ro": "https://support.microsoft.com/ro-ro/office/a54d6866-8c32-4fbc-b15d-6fcc4bd1edf6",
    "teme_en": "https://support.microsoft.com/en-us/office/a54d6866-8c32-4fbc-b15d-6fcc4bd1edf6",
    "numere_ro": "https://support.microsoft.com/ro-ro/office/8bad6395-a1f4-4af6-a360-0df412e510bf",
    "numere_en": "https://support.microsoft.com/en-us/office/8bad6395-a1f4-4af6-a360-0df412e510bf",
    "scurtaturi_ro": "https://support.microsoft.com/ro-ro/office/ebb3d20e-dcd4-444f-a38e-bb5c5ed180f4",
    "scurtaturi_en": "https://support.microsoft.com/en-us/office/ebb3d20e-dcd4-444f-a38e-bb5c5ed180f4",
    "diapozitive_ro": "https://support.microsoft.com/ro-ro/powerpoint/training/add-rearrange-duplicate-and-delete-slides-in-powerpoint",
    "diapozitive_en": "https://support.microsoft.com/en-us/powerpoint/training/add-rearrange-duplicate-and-delete-slides-in-powerpoint",
}


def text(h):
    h = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"(?s)<[^>]+>", " ", h)
    return re.sub(r"\s+", " ", html.unescape(h)).strip()


termeni = sys.argv[1:]
out = []
for nume, url in URL.items():
    f = RAW / f"{nume}.html"
    if not f.is_file():
        continue
    src = f.read_text(encoding="utf-8", errors="replace")
    t = text(src)
    (RAW / f"{nume}.txt").write_text(url + "\n\n" + t, encoding="utf-8")
    tm = re.search(r"<title>(.*?)</title>", src, re.S)
    out.append(f"=== {nume} | {url} | title: {html.unescape(tm.group(1)).strip() if tm else '?'}")
    for term in termeni:
        for m in list(re.finditer(re.escape(term), t))[:2]:
            out.append(f"  [{term}] ...{t[max(0, m.start()-120):m.end()+120]}...")
(D / "cautari.txt").write_text("\n".join(out), encoding="utf-8")
print(len(out), "linii")
