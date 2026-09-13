"""Descarca TEXTUL BRUT al paginilor Microsoft Support despre tabele (en-us + ro-ro) in surse/raw/ si extrage textul.
Adaptat din lectia4-liste/surse_descarca.py. Tipareste doar un rezumat scurt."""
import html
import re
import subprocess
from pathlib import Path

R = Path(__file__).resolve().parent / "surse" / "raw"
R.mkdir(parents=True, exist_ok=True)
PAGINI = {
    "delete_table": "https://support.microsoft.com/{loc}/office/delete-a-table-3e2df7a1-bfa6-436b-8a57-62bfc82f01d5",
    "delete_rowcol": "https://support.microsoft.com/{loc}/office/delete-a-row-column-or-cell-from-a-table-45dab66c-f6b3-4c92-b2ab-642aa240b9dc",
    "add_cell_row": "https://support.microsoft.com/{loc}/office/add-a-cell-row-or-column-to-a-table-in-word-b030ef77-f219-4998-868b-ba85534867f1",
    "add_delete_rows": "https://support.microsoft.com/{loc}/office/add-or-delete-table-rows-and-columns-d7c33b25-2ffe-469c-aea9-c03b3b50cc80",
    "merge_split": "https://support.microsoft.com/{loc}/office/merge-and-split-table-cells-in-word-3e42e8d8-89e8-4345-a79c-524a815f40ce",
    "convert_text": "https://support.microsoft.com/{loc}/office/convert-text-to-a-table-or-a-table-to-text-b5ce45db-52d5-4fe3-8e9c-e04b62f189e1",
    "resize_table": "https://support.microsoft.com/{loc}/word/resize-a-table-column-or-row",
    "change_rows_cols": "https://support.microsoft.com/{loc}/office/change-rows-or-columns-in-a-table-9ad02c74-60b5-432f-b191-5c899139e284",
    "table_props": "https://support.microsoft.com/{loc}/office/set-or-change-table-properties-3237de89-b287-4379-8e0c-86d94873b2e0",
    "change_margins": "https://support.microsoft.com/{loc}/word/training/change-margins",
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
