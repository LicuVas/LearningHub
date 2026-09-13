"""Extrage textul brut din paginile descarcate cu curl (surse/raw/*.html) si cauta frazele exacte.
Iesire: surse/citate_verificate.txt (fiecare fraza: GASIT/NEGASIT + fragmentul copiat din pagina + URL)."""
import html
import re
from pathlib import Path

D = Path(__file__).resolve().parent
RAW = D / "raw"
CAUT = [
    ("nist_binary.html", "https://physics.nist.gov/cuu/Units/binary.html",
     ["kibibit", "1024 bit", "1000 bit", "IEC 60027-2"]),
    ("tnmoc_colossus.html", "https://www.tnmoc.org/colossus",
     ["first of the electronic digital machines with programmability", "early February 1944"]),
    ("chm_eniac.html", "https://www.computerhistory.org/revolution/birth-of-the-computer/4/78",
     ["18,000 vacuum tubes", "1943 and 1945"]),
]


def text(p: Path) -> str:
    s = p.read_text(encoding="utf-8", errors="replace")
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", html.unescape(s))


out = []
for fn, url, fraze in CAUT:
    t = text(RAW / fn)
    out.append(f"== {url}  (descarcat cu curl -sL, 13.09.2026, fisier raw/{fn})")
    for f in fraze:
        i = t.find(f)
        if i < 0:
            out.append(f"  NEGASIT: {f!r}")
        else:
            out.append(f"  GASIT: {f!r} -> „{t[max(0, i - 140):i + len(f) + 140].strip()}”")
(D / "citate_verificate.txt").write_text("\n".join(out), encoding="utf-8")
print("\n".join(x[:160] for x in out))
