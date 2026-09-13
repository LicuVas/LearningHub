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
CAI = {  # lectia4-animatii (13.09.2026)
    "animare": "office/animate-text-or-objects-305a1c94-83b1-4778-8df5-fcf7a9b7b7c6",
    "timp": "office/set-the-start-time-and-speed-of-an-animation-effect-bf8c1cb4-c827-48b6-b756-8c1a3e681a60",
    "trigger": "office/trigger-an-animation-effect-651726d6-9454-4bfd-b8e5-11d84767a6da",
    "traseu": "powerpoint/add-a-motion-path-animation-effect",
    "rand": "office/animate-or-make-words-appear-one-line-at-a-time-in-powerpoint-cfb5ebdc-90cf-4324-8933-874c7c840175",
    "modifica": "office/change-remove-or-turn-off-animation-effects-fb8a3ab0-f651-45e0-b5f0-b18ba2e7c711",
    "baza": "powerpoint/animation-basics-for-your-presentation",
    "multiple": "office/apply-multiple-animation-effects-to-one-object-9bb7b925-ab0f-47d4-bc11-85d939194bed",
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
