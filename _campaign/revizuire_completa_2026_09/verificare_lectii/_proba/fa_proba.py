# -*- coding: utf-8 -*-
"""Proba liniei de verificare (27.09.2026): extrage din jocuri/excel-viii/index.html nivelul cu lectii:[4]
intr-o pagina cu UN singur nivel, in forma unei lectii noi (lectii/<clasa>/m1-lNN/index.html).

Ce se schimba fata de joc (si numai atat):
  - LEVELS = doar nivelul „Selectare, copiere, mutare, stergere” (lectii:[4]), cu final:true
    (poarta cere un nivel final; o lectie noua are un singur nivel, deci el e finalul);
  - caile relative: ../_motor, ../_ghiduri, ../excel-viii/img -> aceleasi fisiere din jocuri/, prin cale relativa corecta;
  - cheie (ca progresul probei sa nu se amestece cu jocul), lectii:'4', intro gol (introul jocului descrie 8 niveluri).
Configuratia motorului (tipuri, diploma, datele NOTE/MAG..., ajutoarele fig/grila) ramane neatinsa.
Nu modifica jocuri/. Scrie doar _proba/viii/m1-l04-proba/index.html.
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
SRC = Path(r"C:/00/Projects/LearningHub/jocuri/excel-viii/index.html")
DEST = Path(__file__).resolve().parent / "viii" / "m1-l04-proba" / "index.html"
REL = "../../../../../../jocuri/"          # din _proba/viii/m1-l04-proba/ pana in LearningHub/jocuri/

h = SRC.read_text(encoding="utf-8")
L = h.split("\n")
start = next(i for i, l in enumerate(L) if l.startswith("{t:'Selectare, copiere, mutare, ștergere',lectii:[4]"))
end = next(i for i in range(start + 1, len(L)) if re.match(r"^/\* =+ \d+\.", L[i]))
nivel = "\n".join(L[start:end]).rstrip()
assert nivel.endswith("},"), nivel[-40:]
nivel = nivel[:-1]  # fara virgula finala
nivel = nivel.replace("lectii:[4],", "lectii:[4],final:true,", 1)

i0 = next(i for i, l in enumerate(L) if l.startswith("const LEVELS=["))
i1 = next(i for i in range(i0, len(L)) if L[i] == "];")
L = L[:i0] + ["const LEVELS=[", "/* proba: doar nivelul lectiei 4 din excel-viii */", nivel, "];"] + L[i1 + 1:]
h2 = "\n".join(L)

h2 = h2.replace('"../_motor/', f'"{REL}_motor/').replace('"../_ghiduri/', f'"{REL}_ghiduri/')
h2 = h2.replace("../excel-viii/img/", f"{REL}excel-viii/img/")
h2 = h2.replace("cheie:'misiunea_analist_viii'", "cheie:'proba_lectie_viii_m1_l04'")
h2 = h2.replace("lectii:'2–12'", "lectii:'4'")
h2 = re.sub(r"\n  intro:'[^\n]*',\n", "\n  intro:'',\n", h2, count=1)
assert "../_motor/" not in h2.replace(REL, "") and "intro:''" in h2 and "final:true" in h2
DEST.parent.mkdir(parents=True, exist_ok=True)
DEST.write_text(h2, encoding="utf-8")
print(f"nivel: liniile {start + 1}-{end} din {SRC.name}; scris {DEST} ({len(h2)} caractere)")
