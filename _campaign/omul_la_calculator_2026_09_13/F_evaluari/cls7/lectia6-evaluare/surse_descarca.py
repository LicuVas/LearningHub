"""Descarca TEXTUL BRUT al paginilor Microsoft Support (en-us + ro-ro) pentru lectia6-evaluare.
Adaptat din lectia5-tabele/surse_descarca.py. Copiaza si pagina de scurtaturi din lectia2. Tipareste un rezumat scurt."""
import html
import re
import shutil
import subprocess
from pathlib import Path

L = Path(__file__).resolve().parent
R = L / "surse" / "raw"
R.mkdir(parents=True, exist_ok=True)
PAGINI = {
    "insert_pictures": "https://support.microsoft.com/{loc}/office/insert-pictures-3c51edf4-22e1-460a-b372-9329a8724344",
    "wrap_text": "https://support.microsoft.com/{loc}/office/wrap-text-around-a-picture-in-word-bdbbe1fe-c089-4b5c-b85c-43997da64a12",
    "crop": "https://support.microsoft.com/{loc}/office/crop-a-picture-in-office-14d69647-bc93-4f06-9528-df95103aa1e6",
    "qat_customize": "https://support.microsoft.com/{loc}/office/customize-the-quick-access-toolbar-43fff1c9-ebc4-4963-bdbd-c2b6b0739e52",
    "undo_redo": "https://support.microsoft.com/{loc}/office/undo-redo-or-repeat-an-action-84bdb9bc-4e23-4f06-ba78-f7b893eb2d28",
    "qat_move": "https://support.microsoft.com/{loc}/office/move-the-quick-access-toolbar-d74e73f2-0471-442a-8178-f37cc93d0954",
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

src = L.parent / "lectia2-formatare-text" / "surse" / "raw"
for loc in ("en_us", "ro_ro"):
    n = f"support_microsoft_com_{loc}_office_keyboard_shortcuts_in_word_95ef89dd_7142_4b50_afb2_f762.txt"
    shutil.copy(src / n, R / f"shortcuts_{loc.replace('_', '-')}.txt")
print("copiat shortcuts en-us/ro-ro din lectia2")
