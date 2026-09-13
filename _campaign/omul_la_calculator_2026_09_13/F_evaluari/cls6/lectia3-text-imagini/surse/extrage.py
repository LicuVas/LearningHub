"""Descarca (curl) paginile Microsoft ro-ro + en-us, scoate textul BRUT (fara script/style/etichete) -> raw/<nume>.txt,
apoi cauta termenii dati in linia de comanda -> cautari.txt.  (Adaptat din lectia2-slide-uri/surse/extrage.py)
Folosire: python extrage.py [--descarca] "termen1" "termen2" ..."""
import html
import re
import subprocess
import sys
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"
RAW.mkdir(exist_ok=True)
CAI = {
    "imagine": "office/insert-a-picture-in-powerpoint-5f7368d2-ee94-4b94-a6f2-a663646a07e1",
    "crop": "office/graphics-visuals/crop-a-picture-to-fit-in-a-shape",
    "fundalimg": "office/remove-the-background-of-a-picture-in-office-c0819a62-6844-4190-8d67-6fb1713a12bf",
    "grupare": "office/group-or-ungroup-shapes-pictures-or-other-objects-a7374c35-20fe-4e0a-9637-7de7d844724b",
    "aliniere": "office/graphics-visuals/align-or-arrange-objects",
    "dimensiune": "office/graphics-visuals/change-the-size-of-a-picture-shape-text-box-or-wordart",
    "stoc": "powerpoint/insert-images-icons-and-more-in-microsoft-365",
    "icoane": "powerpoint/insert-icons-in-microsoft-365",
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
