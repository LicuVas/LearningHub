"""Descarcă pagini Microsoft Support (ro-ro și en-us) și salvează citatele cu adresa, în surse/.
Folosire: python surse_descarca.py  -> scrie surse/<nume>.txt și tipărește un rezumat scurt."""
import html
import re
import sys
import urllib.request
from pathlib import Path

L = Path(__file__).resolve().parent
OUT = L / "surse"
OUT.mkdir(exist_ok=True)

PAGINI = {
    # nume: (url, [cuvinte căutate])
    "shortcuts_ro": ("https://support.microsoft.com/ro-ro/office/scurt%C4%83turi-de-la-tastatur%C4%83-%C3%AEn-excel-1798d9d5-842a-42b8-9c99-9b7213f0040f",
                     ["Ctrl+End", "Ctrl+Home", "Pornire", "Inserare", "Formule", "Date"]),
    "shortcuts_en": ("https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-excel-1798d9d5-842a-42b8-9c99-9b7213f0040f",
                     ["Ctrl+End", "Ctrl+Home", "Name Box"]),
    "foi_ro": ("https://support.microsoft.com/ro-RO/Excel/get-started/insert-or-delete-a-worksheet",
               ["Redenumi", "Ștergere", "Șterge", "Inserare", "Foaie nouă", "anula", "Pornire"]),
    "foi_en": ("https://support.microsoft.com/en-US/Excel/get-started/insert-or-delete-a-worksheet",
               ["Rename", "Delete", "undo", "Undo", "New sheet"]),
    "redenumire_ro": ("https://support.microsoft.com/ro-ro/office/redenumirea-unei-foi-de-lucru-3f1f7148-ee83-404d-8ef0-9ff99fbad1f9",
                      ["Redenumire", "Pornire", "Foaie"]),
    "mutare_ro": ("https://support.microsoft.com/ro-ro/office/mutarea-sau-copierea-foilor-de-lucru-sau-datelor-din-foile-de-lucru-47207967-bbb2-4e95-9b5c-3c174aa69328",
                  ["Mutare sau copiere", "Mutare"]),
    "nume_formule_ro": ("https://support.microsoft.com/ro-RO/Excel/names-in-formulas",
                        ["Caseta Nume", "caseta Nume", "bara de formule", "Formule"]),
    "nume_formule_en": ("https://support.microsoft.com/en-us/excel/names-in-formulas",
                        ["Name Box", "formula bar"]),
    "limite_ro": ("https://support.microsoft.com/ro-ro/office/specifica%C8%9Bii-%C8%99i-limite-excel-1672b34d-7043-467e-8e27-269d656771c3",
                  ["1.048.576", "16.384", "1,048,576", "16,384"]),
    "limite_en": ("https://support.microsoft.com/en-us/office/excel-specifications-and-limits-1672b34d-7043-467e-8e27-269d656771c3",
                  ["1,048,576", "16,384"]),
    "sortare_ro": ("https://support.microsoft.com/ro-ro/office/sortarea-datelor-dintr-o-zon%C4%83-sau-dintr-un-tabel-62d0b95d-2a90-4610-a6ae-2e545c4a4654",
                   ["fila Date", "Date >", "Sortare"]),
    "sortare_en": ("https://support.microsoft.com/en-us/office/sort-data-in-a-range-or-table-62d0b95d-2a90-4610-a6ae-2e545c4a4654",
                   ["Data tab", "Data >"]),
    "grafic_ro": ("https://support.microsoft.com/ro-ro/office/crearea-unei-diagrame-de-la-%C3%AEnceput-la-sf%C3%A2r%C8%99it-0baf399e-dd61-4e18-8a73-b3fd5d5680c2",
                  ["Inserare", "fila Inserare"]),
    "grafic_en": ("https://support.microsoft.com/en-us/office/create-a-chart-from-start-to-finish-0baf399e-dd61-4e18-8a73-b3fd5d5680c2",
                  ["Insert"]),
    "text_coloane_en": ("https://support.microsoft.com/en-us/office/split-text-into-different-columns-with-the-convert-text-to-columns-wizard-30b14928-5550-41f5-97ca-7a3e9c363ed7",
                        ["Text to Columns", "Delimited", "Space", "Tab"]),
    "text_coloane_ro": ("https://support.microsoft.com/ro-ro/office/%C3%AEmp%C4%83r%C8%9Birea-textului-%C3%AEn-coloane-diferite-cu-expertul-conversie-text-%C3%AEn-coloane-30b14928-5550-41f5-97ca-7a3e9c363ed7",
                        ["Text în coloane", "Delimitat", "Spațiu", "Tab"]),
}
if len(sys.argv) > 1:
    PAGINI = {k: v for k, v in PAGINI.items() if k in sys.argv[1:]}


RAW = OUT / "raw"
RAW.mkdir(exist_ok=True)


def text(url: str, nume: str = "pagina") -> str:
    # protocol v2.2: textul BRUT al paginii (nu WebFetch); HTML-ul brut se pastreaza in surse/raw/
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept-Language": url.split("/")[3]})
    raw = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "replace")
    (RAW / f"{nume}.html").write_text(raw, encoding="utf-8")
    raw = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", raw)
    t = html.unescape(re.sub(r"<[^>]+>", " ", raw))
    return re.sub(r"\s+", " ", t)


rez = []
for nume, (url, cheie) in PAGINI.items():
    try:
        t = text(url, nume)
    except Exception as e:  # noqa: BLE001
        rez.append(f"{nume}: EROARE {e}")
        (OUT / f"{nume}.txt").write_text(f"URL: {url}\nEROARE la descărcare: {e}\n", encoding="utf-8")
        continue
    titlu = re.search(r"^(.{0,120})", t).group(1)
    linii = [f"URL: {url}", f"Descărcat: 13.09.2026 (urllib)", f"Început pagină: {titlu}", ""]
    gasite = 0
    for k in cheie:
        for m in list(re.finditer(re.escape(k), t))[:4]:
            linii.append(f"[{k}] …{t[max(0, m.start()-160):m.end()+160]}…")
            gasite += 1
    (OUT / f"{nume}.txt").write_text("\n".join(linii) + "\n", encoding="utf-8")
    rez.append(f"{nume}: {len(t)} car., {gasite} citate")
print("\n".join(rez[:20]))
