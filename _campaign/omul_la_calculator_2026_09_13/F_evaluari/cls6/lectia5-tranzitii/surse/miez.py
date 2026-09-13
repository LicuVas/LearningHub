"""Scoate miezul articolului din raw/<nume>.txt (intre 'Se aplică la'/'Applies To' si subsolul paginii) -> raw/<nume>.miez.txt."""
import re
import sys
from pathlib import Path

RAW = Path(__file__).resolve().parent / "raw"
for nume in sys.argv[1:]:
    t = (RAW / f"{nume}.txt").read_text(encoding="utf-8")
    a = min([i for i in (t.find("Se aplică la"), t.find("Applies To")) if i >= 0] or [0])
    ends = [i for i in (t.find("Aveți nevoie de mai mult ajutor"), t.find("Need more help"), t.find("Abonați-vă la RSS"), t.find("SUBSCRIBE RSS FEEDS"), t.find("Vă mulțumim pentru feedback"), t.find("Was this information helpful")) if i > a]
    b = min(ends) if ends else len(t)
    m = t[a:b]
    (RAW / f"{nume}.miez.txt").write_text(m, encoding="utf-8")
    print(nume, len(m))
