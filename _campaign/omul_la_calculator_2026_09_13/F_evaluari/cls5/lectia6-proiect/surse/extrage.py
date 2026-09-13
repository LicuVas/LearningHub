"""Extrage textul brut din paginile descarcate cu curl (surse/raw/*.html) si cauta fraze.
Scrie surse/<nume>.txt (URL + text) si surse/citate.json. Tipareste <= 20 de randuri."""
import html as H
import json
import re
import sys
from pathlib import Path

S = Path(__file__).resolve().parent
URLS = json.loads((S / "urls.json").read_text(encoding="utf-8"))
CAUT = json.loads((S / "cautari.json").read_text(encoding="utf-8"))
out = {}
for nume, url in URLS.items():
    f = S / "raw" / f"{nume}.html"
    if not f.is_file():
        out[nume] = {"url": url, "eroare": "lipseste raw"}
        continue
    t = f.read_text(encoding="utf-8", errors="replace")
    t = re.sub(r"<(script|style|noscript)[^>]*>.*?</\1>", " ", t, flags=re.S | re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    t = re.sub(r"\s+", " ", H.unescape(t)).strip()
    (S / f"{nume}.txt").write_text(f"URL: {url} | descarcat cu curl 13.09.2026\n\n{t}\n", encoding="utf-8")
    gas = {}
    for fr in CAUT.get(nume, []):
        m = re.search(r".{0,160}" + re.escape(fr) + r".{0,160}", t, flags=re.I)
        gas[fr] = m.group(0) if m else None
    out[nume] = {"url": url, "caractere": len(t), "gasit": gas}
(S / "citate.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
for n, v in out.items():
    print(n, v.get("caractere"), {k: (x is not None) for k, x in (v.get("gasit") or {}).items()})
