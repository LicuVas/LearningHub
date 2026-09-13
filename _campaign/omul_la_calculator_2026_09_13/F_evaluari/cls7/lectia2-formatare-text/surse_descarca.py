"""v2.2: deschid EFECTIV paginile (HTTP GET, text brut, fara WebFetch), scot textul si copiez randurile cu comanda.
Iesire: surse/<pas>.txt (adresa + randurile copiate), surse/raw/*.txt (textul intreg al paginii),
surse/raw/*.html (HTML brut). Tipareste un sumar scurt."""
import html
import re
import sys
import urllib.request
from pathlib import Path

L = Path(__file__).resolve().parent
S = L / "surse"
(S / "raw").mkdir(parents=True, exist_ok=True)

FP = "https://support.microsoft.com/{}/word/use-the-format-painter"
CL = "https://support.microsoft.com/{}/office/clear-all-text-formatting-c094c4da-7f09-4cea-9a8d-c166949c9c80"
PA = "https://support.microsoft.com/{}/word/control-the-formatting-when-you-paste-text"
KS = "https://support.microsoft.com/{}/office/keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2"
HL = "https://support.microsoft.com/{}/office/apply-or-remove-highlighting-1747d808-6db7-4d49-86ac-1f0c3cc87e2e"
TE = "https://support.microsoft.com/{}/word/add-or-remove-text-effects"
TH = "https://support.microsoft.com/{}/office/new-office-theme-e7bbfe02-d1fb-4c4d-b3b7-6a47f0cefd3f"
SS = "https://support.microsoft.com/{}/word/format-text-as-superscript-or-subscript-in-word"

PAGINI = {
    "s01_pornire_font": [(SS.format("ro-ro"), ["Pornire", "grupul Font"]), (SS.format("en-us"), ["Home", "Font group"])],
    "s02_descriptor_formate": [(FP.format("ro-ro"), ["Descriptor", "Pornire", "Esc"]), (FP.format("en-us"), ["Format Painter", "double-click", "Esc"])],
    "s03_golire_formatare": [(CL.format("ro-ro"), ["Pornire", "formatare", "Normal"]), (CL.format("en-us"), ["Clear All Formatting", "Home"])],
    "s04_lipire_fara_formatare": [(PA.format("ro-ro"), ["Păstrare", "text", "Lipire"]), (PA.format("en-us"), ["Keep Text Only", "Merge Formatting", "Keep Source"])],
    "s05_scurtaturi": [(KS.format("en-us"), ["Ctrl+Spacebar", "Ctrl+Q", "Ctrl+Alt+V", "Ctrl+D", "Ctrl+Equal", "Ctrl+Shift+Plus", "Ctrl+Shift+>", "Ctrl+Shift+Right angle", "Ctrl+Shift+Left angle", "Ctrl+Shift+<", "Ctrl+B", "Ctrl+I", "Ctrl+U"]),
                       (KS.format("ro-ro"), ["Ctrl+Spațiu", "Ctrl+Q", "Ctrl+Alt+V", "Ctrl+D", "Ctrl+semnul egal", "Ctrl+Shift+semnul plus", "Ctrl+Shift+>", "Ctrl+Shift+<"])],
    "s06_evidentiere": [(HL.format("ro-ro"), ["evidențiere", "Pornire", "Fără culoare"]), (HL.format("en-us"), ["Text Highlight Color", "No Color"])],
    "s07_efecte_text": [(TE.format("ro-ro"), ["Efecte", "Pornire", "Contur", "Umbră"]), (TE.format("en-us"), ["Text Effects", "Outline", "Shadow", "Emboss", "Engrave"])],
    "s08_aptos_implicit": [(TH.format("en-us"), ["Aptos", "Calibri", "default"]), (TH.format("ro-ro"), ["Aptos", "Calibri", "implicit"])],
    "s09_emboss_engrave": [("https://wordribbon.tips.net/T007793_Engraving_and_Embossing_Text.html", ["Emboss", "Engrave", "compatibility", "2010"])],
}


def fetch(url):
    lang = url.split("/")[3] if "support.microsoft.com" in url else "en-us"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept-Language": lang})
    return urllib.request.urlopen(req, timeout=60).read().decode("utf-8", errors="replace")


def text_of(raw):
    raw = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", raw)
    raw = re.sub(r"(?i)<br\s*/?>|</(p|li|h\d|tr|td|div)>", "\n", raw)
    t = html.unescape(re.sub(r"<[^>]+>", " ", raw))
    return "\n".join(x.strip() for x in re.sub(r"[ \t ]+", " ", t).split("\n") if x.strip())


sumar = []
for pas, lst in PAGINI.items():
    bloc = []
    for url, chei in lst:
        nume = re.sub(r"[^A-Za-z0-9]+", "_", url[8:])[:90]
        try:
            raw = fetch(url)
        except Exception as e:  # noqa: BLE001
            bloc.append(f"ADRESA: {url}\nEROARE la deschidere: {e}\n")
            sumar.append(f"{pas} EROARE {url[:70]} {e}")
            continue
        (S / "raw" / (nume + ".html")).write_text(raw, encoding="utf-8")
        t = text_of(raw)
        (S / "raw" / (nume + ".txt")).write_text(t, encoding="utf-8")
        gasite = {k: [ln[:300] for ln in t.split("\n") if k.lower() in ln.lower()][:4] for k in chei}
        bloc.append(f"ADRESA: {url}\nDESCHISA: HTTP GET 13.09.2026, text brut al paginii {len(t)} caractere\n" +
                    "\n".join(f"  [{k}] " + (" || ".join(v) if v else "NEGASIT PE PAGINA") for k, v in gasite.items()) + "\n")
        sumar.append(f"{pas} {len(t):6d}c " + " ".join(f"{k[:14]}={len(v)}" for k, v in gasite.items()))
    (S / f"{pas}.txt").write_text("\n".join(bloc), encoding="utf-8")
print("\n".join(sumar))
sys.exit(0)
