"""Scoate textul BRUT din paginile Microsoft descarcate cu curl (surse/raw/*.html) si cauta frazele exacte.
Scrie surse/raw/<nume>.txt si surse/cautari.txt (fiecare termen cu contextul lui, copiat din text)."""
import html
import re
import sys
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"
URL = {
    "scurtaturi_ro": "https://support.microsoft.com/ro-ro/office/ebb3d20e-dcd4-444f-a38e-bb5c5ed180f4",
    "scurtaturi_en": "https://support.microsoft.com/en-us/office/ebb3d20e-dcd4-444f-a38e-bb5c5ed180f4",
    "vizualizari_ro": "https://support.microsoft.com/ro-ro/office/alege%C8%9Bi-vizualizarea-corect%C4%83-pentru-activitatea-din-powerpoint-21332d8d-adbc-4717-a2c6-e25a697b40e9",
    "vizualizari_en": "https://support.microsoft.com/en-us/office/choose-the-right-view-for-the-task-in-powerpoint-21332d8d-adbc-4717-a2c6-e25a697b40e9",
    "diapozitive_ro": "https://support.microsoft.com/ro-ro/powerpoint/training/add-rearrange-duplicate-and-delete-slides-in-powerpoint",
    "diapozitive_en": "https://support.microsoft.com/en-us/powerpoint/training/add-rearrange-duplicate-and-delete-slides-in-powerpoint",
    "pdf_ro": "https://support.microsoft.com/ro-ro/office/collab-files/save-or-convert-to-pdf-or-xps-in-office-desktop-apps",
    "pdf_en": "https://support.microsoft.com/en-us/office/collab-files/save-or-convert-to-pdf-or-xps-in-office-desktop-apps",
    "baza_ro": "https://support.microsoft.com/ro-ro/office/activit%C4%83%C8%9Bi-de-baz%C4%83-pentru-crearea-unei-prezent%C4%83ri-powerpoint-efbbc1cd-c5f1-4264-b48e-c8a7b0334e36",
    "baza_en": "https://support.microsoft.com/en-us/office/basic-tasks-for-creating-a-powerpoint-presentation-efbbc1cd-c5f1-4264-b48e-c8a7b0334e36",
}


def text(h):
    h = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"(?s)<[^>]+>", " ", h)
    return re.sub(r"\s+", " ", html.unescape(h)).strip()


termeni = [a for a in sys.argv[1:]]
out = []
for nume, url in URL.items():
    f = RAW / f"{nume}.html"
    if not f.is_file():
        continue
    t = text(f.read_text(encoding="utf-8", errors="replace"))
    (RAW / f"{nume}.txt").write_text(url + "\n\n" + t, encoding="utf-8")
    tm = re.search(r"<title>(.*?)</title>", f.read_text(encoding="utf-8", errors="replace"), re.S)
    out.append(f"=== {nume} | {url} | title: {html.unescape(tm.group(1)).strip() if tm else '?'}")
    for term in termeni:
        for m in list(re.finditer(re.escape(term), t))[:2]:
            out.append(f"  [{term}] ...{t[max(0, m.start()-110):m.end()+110]}...")
(D / "cautari.txt").write_text("\n".join(out), encoding="utf-8")
print(len(out), "linii")
