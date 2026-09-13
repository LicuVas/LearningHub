"""Explorare: cauta cuvinte-cheie (regex, case-insensitive) in textul BRUT al paginilor din surse/raw si scrie contextul
in surse/_explor.txt (nu e dovada, doar ca sa aflu fraza exacta pe care o dau apoi lui surse_cauta.py).
Folosire: python surse_explor.py nume "regex1" "regex2" ..."""
import html
import re
import sys
from pathlib import Path

L = Path(__file__).resolve().parent


def text_brut(p):
    s = p.read_text(encoding="utf-8", errors="replace")
    s = re.sub(r"<script.*?</script>|<style.*?</style>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s))


nume = sys.argv[1]
t = text_brut(L / "surse" / "raw" / f"{nume}.html")
out = [f"== {nume} ({len(t)} caractere)"]
for rx in sys.argv[2:]:
    hits = [m.start() for m in re.finditer(rx, t, re.I)]
    out.append(f"[{rx}] {len(hits)}")
    for h in hits[:3]:
        out.append("  ..." + t[max(0, h - 160): h + 200] + "...")
with (L / "surse" / "_explor.txt").open("a", encoding="utf-8") as f:
    f.write("\n".join(out) + "\n")
print("\n".join(x[:400] for x in out)[:3500])
