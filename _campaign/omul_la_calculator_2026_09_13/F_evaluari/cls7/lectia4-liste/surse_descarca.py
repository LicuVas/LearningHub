"""Descarca TEXTUL BRUT al paginilor Microsoft Support despre liste (en-us + ro-ro) in surse/raw/ si extrage textul.
Adaptat din lectia3-paragrafe/surse_descarca.py. Tipareste doar un rezumat scurt."""
import html
import re
import subprocess
from pathlib import Path

R = Path(__file__).resolve().parent / "surse" / "raw"
R.mkdir(parents=True, exist_ok=True)
PAGINI = {
    "create_list": "https://support.microsoft.com/{loc}/office/create-a-bulleted-or-numbered-list-9ff81241-58a8-4d88-8d8c-acab3006a23e",
    "define_new": "https://support.microsoft.com/{loc}/office/define-new-bullets-numbers-and-multilevel-lists-6c06ef65-27ad-4893-80c9-0b944cb81f5f",
    "sort_list": "https://support.microsoft.com/{loc}/word/sort-a-list-alphabetically-in-word",
    "color_size": "https://support.microsoft.com/{loc}/word/change-the-color-size-or-format-of-bullets-or-numbers-in-a-list-in-word",
    "add_bullets": "https://support.microsoft.com/{loc}/office/add-bullets-or-numbers-to-text-a6f1b87e-fca8-47da-ade9-5d99b7f41f04",
    "change_numbering": "https://support.microsoft.com/{loc}/word/change-the-numbering-in-a-numbered-list",
    "auto_bullets": "https://support.microsoft.com/{loc}/word/turn-on-or-off-automatic-bullets-or-numbering-in-word",
    "shortcuts":"https://support.microsoft.com/{loc}/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2",
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
