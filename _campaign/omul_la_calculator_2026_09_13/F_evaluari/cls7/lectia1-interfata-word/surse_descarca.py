"""v2.1: deschid EFECTIV paginile Microsoft (HTTP GET), scot textul si copiez randurile care contin comanda.
Iesire: surse/pasNN.txt (adresa + randurile copiate), surse/raw/*.txt (textul intreg al paginii)."""
import html
import re
import sys
import urllib.request
from pathlib import Path

L = Path(__file__).resolve().parent
S = L / "surse"
(S / "raw").mkdir(parents=True, exist_ok=True)

PAGINI = {
    "pas03": [("https://support.microsoft.com/ro-ro/word/format-text-as-superscript-or-subscript-in-word", ["Pornire", "Font"]),
              ("https://support.microsoft.com/en-us/word/format-text-as-superscript-or-subscript-in-word", ["Home", "Font"])],
    "pas06": [("https://support.microsoft.com/ro-ro/office/particularizarea-barei-de-instrumente-acces-rapid-43fff1c9-ebc4-4963-bdbd-c2b6b0739e52", ["Adăugare la bara", "Acces rapid"]),
              ("https://support.microsoft.com/en-us/office/customize-the-quick-access-toolbar-43fff1c9-ebc4-4963-bdbd-c2b6b0739e52", ["Add to Quick Access Toolbar"])],
    "pas07": [("https://support.microsoft.com/ro-ro/office/particularizarea-barei-de-instrumente-acces-rapid-43fff1c9-ebc4-4963-bdbd-c2b6b0739e52", ["dedesubtul Panglicii", "Afișare bară"]),
              ("https://support.microsoft.com/en-us/office/customize-the-quick-access-toolbar-43fff1c9-ebc4-4963-bdbd-c2b6b0739e52", ["Show Below the Ribbon", "Show Quick Access Toolbar"])],
    "pas08": [("https://support.microsoft.com/en-us/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2", ["Ctrl+F1", "collapse the ribbon"])],
    "pas15": [("https://support.microsoft.com/en-us/word/collapse-or-expand-parts-of-a-document", ["Outline", "View"]),
              ("https://support.microsoft.com/ro-RO/Word/add-a-heading-in-a-word-document", ["Schiță", "Vizualizare", "Titlu 1"])],
    "pas16": [("https://support.microsoft.com/ro-RO/Word/add-a-heading-in-a-word-document", ["fila Pornire", "Stiluri", "Titlu 1", "Titlu 2"])],
    "pas12": [("https://support.microsoft.com/ro-ro/office/salvarea-sau-conversia-%C3%AEn-pdf-sau-xps-%C3%AEn-programele-office-desktop-d85416c5-7d77-4fd6-a216-6f4bf7c7c110", ["Salvare ca", "copie", "PDF"])],
    "f06_qat_implicit": [("https://www.avantixlearning.ca/microsoft-excel/how-to-show-or-unhide-the-quick-access-toolbar-in-word-excel-and-powerpoint/", ["hidden", "default"]),
                         ("https://techcommunity.microsoft.com/t5/microsoft-365-insider-blog/quick-access-toolbar-on-by-default/ba-p/4219349", ["hidden", "default"])],
}


def text_of(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept-Language": url.split("/")[3]})
    raw = urllib.request.urlopen(req, timeout=60).read().decode("utf-8", errors="replace")
    raw = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", raw)
    raw = re.sub(r"(?i)<br\s*/?>|</(p|li|h\d|tr|td|div)>", "\n", raw)
    t = html.unescape(re.sub(r"<[^>]+>", " ", raw))
    return "\n".join(x.strip() for x in re.sub(r"[ \t ]+", " ", t).split("\n") if x.strip())


sumar = []
for pas, lst in PAGINI.items():
    bloc = []
    for url, chei in lst:
        try:
            t = text_of(url)
        except Exception as e:  # noqa: BLE001
            bloc.append(f"ADRESA: {url}\nEROARE la deschidere: {e}\n")
            sumar.append(f"{pas} EROARE {url[:70]}")
            continue
        (S / "raw" / (re.sub(r"[^A-Za-z0-9]+", "_", url[8:])[:90] + ".txt")).write_text(t, encoding="utf-8")
        gasite = {k: [ln for ln in t.split("\n") if k.lower() in ln.lower()][:4] for k in chei}
        bloc.append(f"ADRESA: {url}\nDESCHISA: HTTP GET 13.09.2026, text pagina {len(t)} caractere\n" +
                    "\n".join(f"  [{k}] " + (" || ".join(v) if v else "NEGASIT PE PAGINA") for k, v in gasite.items()) + "\n")
        sumar.append(f"{pas} {len(t):6d}c " + " ".join(f"{k}={len(v)}" for k, v in gasite.items()))
    (S / f"{pas}.txt").write_text("\n".join(bloc), encoding="utf-8")
print("\n".join(sumar))
sys.exit(0)
