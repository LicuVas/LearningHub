"""Descarca (curl) paginile Microsoft ro-ro + en-us, scoate textul BRUT (fara script/style/etichete) -> raw/<nume>.txt,
apoi cauta termenii dati -> cautari.txt. (Adaptat din lectia3-text-imagini/surse/extrage.py)
Folosire: python extrage.py [--descarca] "termen1" "termen2" ...
Citat: python extrage.py --citat <nume_raw> "fraza" <fisier_iesire>  -> scrie sursa + citatul cu 100 de caractere context."""
import html
import re
import subprocess
import sys
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"
RAW.mkdir(exist_ok=True)
CAI = {
    "hyperlink": "office/add-a-hyperlink-to-a-slide-239c6c94-d52f-480c-99ae-8b0acf7df6d9",
    "pdf": "office/save-powerpoint-presentations-as-pdf-files-9b5c786b-9c6e-4fe6-81f6-9372f77c47c8",
    "teme": "office/add-color-and-design-to-your-slides-with-themes-a54d6866-8c32-4fbc-b15d-6fcc4bd1edf6",
    "cuprins": "powerpoint/manually-create-a-table-of-contents-in-powerpoint",
    "export": "office/export-a-presentation-6ee4272e-8f64-47f6-bd32-12fe50eef477",
    "stoc": "powerpoint/insert-images-icons-and-more-in-microsoft-365",
    "numerotare": "office/add-bullets-or-numbers-to-text-on-slides-in-powerpoint-8b9fd0e9-5e3d-4a4b-9ea5-3e0e7ff2ddd1",
}
URL = {}
for n, c in CAI.items():
    URL[n + "_en"] = "https://support.microsoft.com/en-us/" + c
    URL[n + "_ro"] = "https://support.microsoft.com/ro-ro/" + c


def text(h):
    h = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", h)
    h = re.sub(r"(?s)<[^>]+>", " ", h)
    return re.sub(r"\s+", " ", html.unescape(h)).strip()


args = sys.argv[1:]
if args and args[0] == "--citat":
    nume, fraza, iesire = args[1], args[2], args[3]
    t = (RAW / f"{nume}.txt").read_text(encoding="utf-8")
    i = t.find(fraza)
    with open(D / iesire, "a", encoding="utf-8") as f:
        f.write(f"Sursa: {URL[nume]}\nDescarcat: curl -sL -A Mozilla/5.0, 13.09.2026 -> surse/raw/{nume}.html (text brut: raw/{nume}.txt)\n")
        f.write(f"Citat exact: \"{t[max(0, i - 100): i + len(fraza) + 100]}\"\n\n" if i >= 0 else f"NEGASIT: \"{fraza}\"\n\n")
    print("gasit" if i >= 0 else "NEGASIT", nume, fraza)
    sys.exit(0)
if args and args[0] == "--descarca":
    args = args[1:]
    for nume, url in URL.items():
        subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", url, "-o", str(RAW / f"{nume}.html")], check=False)
for f in RAW.glob("*.html"):
    (RAW / (f.stem + ".txt")).write_text(text(f.read_text(encoding="utf-8", errors="replace")), encoding="utf-8")
out = []
for termen in args:
    for f in sorted(RAW.glob("*.txt")):
        t = f.read_text(encoding="utf-8")
        for m in list(re.finditer(re.escape(termen), t))[:3]:
            out.append(f"[{termen}] {f.name}: ...{t[max(0, m.start() - 110): m.end() + 110]}...")
    if not any(o.startswith(f"[{termen}]") for o in out):
        out.append(f"[{termen}] NEGASIT in nicio pagina")
(D / "cautari.txt").write_text("\n".join(out), encoding="utf-8")
print("\n".join(o[:200] for o in out[:20]))
