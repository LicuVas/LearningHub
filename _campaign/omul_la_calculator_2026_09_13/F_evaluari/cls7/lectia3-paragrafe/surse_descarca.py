"""Descarca TEXTUL BRUT al paginilor Microsoft Support (en-us + ro-ro) in surse/raw/ si extrage textul.
Folosire: python surse_descarca.py   (lista de pagini e mai jos). Tipareste doar un rezumat scurt."""
import html
import re
import subprocess
from pathlib import Path

R = Path(__file__).resolve().parent / "surse" / "raw"
R.mkdir(parents=True, exist_ok=True)
PAGINI = {
    "line_spacing": "https://support.microsoft.com/{loc}/office/change-the-line-spacing-in-word-04ada056-b8ef-4b84-87dd-5d7c28a85712",
    "default_line_spacing": "https://support.microsoft.com/{loc}/office/change-the-default-line-spacing-in-word-411437a0-0646-490d-b426-a9249a78b315",
    "indents_spacing": "https://support.microsoft.com/{loc}/word/adjust-indents-and-spacing-in-word",
    "hanging_indent": "https://support.microsoft.com/{loc}/office/create-a-hanging-indent-in-word-7bdfb86a-c714-41a8-ac7a-3782a91ccad5",
    "ruler": "https://support.microsoft.com/{loc}/office/using-the-ruler-in-word-775014ca-7bb9-4b75-ba19-4478c4a836d1",
    "tab_marks": "https://support.microsoft.com/{loc}/office/show-or-hide-tab-marks-in-word-84a53213-5d02-404a-b022-09cae1a3958b",
}


def text_din(raw: str) -> str:
    raw = re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>", " ", raw)
    raw = re.sub(r"(?i)<br\s*/?>|</(p|li|h\d|tr|td|div|pre)>", "\n", raw)
    t = html.unescape(re.sub(r"<[^>]+>", " ", raw))
    return "\n".join(x.strip() for x in re.sub(r"[ \t ]+", " ", t).split("\n") if x.strip())


for nume, url in PAGINI.items():
    for loc in ("en-us", "ro-ro"):
        u = url.format(loc=loc)
        f = R / f"{nume}_{loc}.html"
        subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", u, "-o", str(f)], check=False)
        t = text_din(f.read_text(encoding="utf-8", errors="replace")) if f.is_file() else ""
        (R / f"{nume}_{loc}.txt").write_text("ADRESA: " + u + "\n" + t, encoding="utf-8")
        print(f"{nume}_{loc}: {len(t)} caractere")
