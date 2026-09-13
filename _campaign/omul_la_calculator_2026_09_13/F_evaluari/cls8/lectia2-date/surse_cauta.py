"""Protocol v2.2: textul BRUT al paginilor Microsoft Support (descarcate cu curl in surse/raw/),
fara <script>/<style>/etichete; caut fraze si scriu surse/<nume>.txt cu URL + citatele (context +-220 caractere).
Folosire: python surse_cauta.py nume1 "fraza1" "fraza2" ...  (nume = fisierul din surse/raw fara .html, URL in surse/urls.txt)
Tipareste <= 20 de randuri."""
import html
import re
import sys
from pathlib import Path

L = Path(__file__).resolve().parent
RAW = L / "surse" / "raw"
RAW_L1 = L.parent / "lectia1-interfata" / "surse" / "raw"
URLS = dict(line.split(" ", 1) for line in (L / "surse" / "urls.txt").read_text(encoding="utf-8").split("\n") if " " in line)


def text_brut(p: Path) -> str:
    s = p.read_text(encoding="utf-8", errors="replace")
    s = re.sub(r"<script.*?</script>|<style.*?</style>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s)).replace(" ", " ")


nume = sys.argv[1]
fraze = sys.argv[2:]
p = RAW / f"{nume}.html"
if not p.is_file():
    p = RAW_L1 / f"{nume}.html"
t = text_brut(p)
url = URLS.get(nume, "").strip()
out = [f"URL: {url}", f"Fisier brut: {p}", f"Titlu pagina (text brut): {t[:120].strip()}", ""]
for f in fraze:
    hits = [m.start() for m in re.finditer(re.escape(f), t)]
    out.append(f"[{f}] aparitii: {len(hits)}")
    for h in hits[:2]:
        out.append("   …" + t[max(0, h - 220): h + 220] + "…")
    out.append("")
(L / "surse" / f"{nume}.txt").write_text("\n".join(out), encoding="utf-8")
for line in out:
    if line.startswith("[") or line.startswith("URL") or line.startswith("Titlu"):
        print(line[:160])
