"""Descarca (curl) paginile Microsoft ro-ro + en-us despre TRANZITII, scoate textul BRUT -> raw/<nume>.txt,
apoi cauta termenii dati -> cautari.txt.  (Adaptat din lectia4-animatii/surse/extrage.py, 13.09.2026)
Folosire: python extrage.py [--descarca] "termen1" "termen2" ..."""
import html
import re
import subprocess
import sys
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"
RAW.mkdir(exist_ok=True)
CAI = {  # lectia5-tranzitii
    "tranzitii": "office/add-change-or-remove-transitions-between-slides-3f8244bf-f893-4efd-a7eb-3a4845c9c971",
    "timp": "office/set-the-timing-and-speed-of-a-transition-c3c3c66f-4cca-4821-b8b9-7de0f3f6ead1",
    "morph": "office/use-the-morph-transition-in-powerpoint-8dd1c7b2-b935-44f5-a74c-741d8d9244ea",
    "diferenta": "office/the-difference-between-animations-and-transitions-bae174a4-dad3-4268-bf9c-c201a70995f1",
    "autorulare": "powerpoint/training/create-a-self-running-presentation",
    "livrare": "office/use-keyboard-shortcuts-to-deliver-powerpoint-presentations-1524ffce-bd2a-45f4-9a7f-f18b992b93a0",
    "adauga": "office/add-transitions-between-slides-e89a076e-ed81-404e-9598-021a918fa1ba",
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
if args and args[0] == "--descarca":
    args = args[1:]
    for nume, url in URL.items():
        subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", url, "-o", str(RAW / f"{nume}.html")], check=False)

out = []
for nume, url in URL.items():
    f = RAW / f"{nume}.html"
    if not f.is_file():
        out.append(f"=== {nume} LIPSESTE")
        continue
    src = f.read_text(encoding="utf-8", errors="replace")
    t = text(src)
    (RAW / f"{nume}.txt").write_text(url + "\n\n" + t, encoding="utf-8")
    tm = re.search(r"<title>(.*?)</title>", src, re.S)
    out.append(f"=== {nume} | {url} | title: {html.unescape(tm.group(1)).strip() if tm else '?'} | {len(t)} car")
    for term in args:
        for m in list(re.finditer(re.escape(term), t))[:2]:
            out.append(f"  [{term}] ...{t[max(0, m.start()-130):m.end()+130]}...")
(D / "cautari.txt").write_text("\n".join(out), encoding="utf-8")
print("\n".join(l for l in out if l.startswith("===")))
