"""Extrage textul brut din surse/raw/<nume>.html (fara script/style/etichete) -> <nume>.txt
si tipareste randurile care contin cheile date. Folosire: surse_extrage.py <nume> cheie1 cheie2 ..."""
import html
import re
import sys
from pathlib import Path

R = Path(__file__).resolve().parent / "surse" / "raw"
nume, chei = sys.argv[1], sys.argv[2:]
raw = (R / f"{nume}.html").read_text(encoding="utf-8", errors="replace")
raw = re.sub(r"(?is)<(script|style|noscript)[^>]*>.*?</\1>", " ", raw)
raw = re.sub(r"(?i)<br\s*/?>|</(p|li|h\d|tr|td|div|pre)>", "\n", raw)
t = html.unescape(re.sub(r"<[^>]+>", " ", raw))
t = "\n".join(x.strip() for x in re.sub(r"[ \t ]+", " ", t).split("\n") if x.strip())
(R / f"{nume}.txt").write_text(t, encoding="utf-8")
n = 0
for ln in t.split("\n"):
    if any(k.lower() in ln.lower() for k in chei):
        print(ln[:260])
        n += 1
        if n >= 14:
            break
print(f"[{nume}: {len(t)} caractere text, {n} randuri afisate]")
