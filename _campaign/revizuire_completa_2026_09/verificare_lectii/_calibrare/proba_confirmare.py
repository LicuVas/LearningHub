# -*- coding: utf-8 -*-
"""Proba confirmării obiectivelor LIPSA la teach-back (în ambele direcții), pe situl T1 al lecției VII nr. 4:
  - un obiectiv pe care lecția îl PREDĂ (pasul 2: „Alegi obiectul după ce vrei să afle cititorul…”) -> trebuie „predat”;
  - un obiectiv pe care lecția NU îl predă (formatarea = lecțiile 6-7) -> trebuie „nepredat” (rămâne blocant).

    python proba_confirmare.py

Scrie în _calibrare/rezultate/confirmare_proba/confirmare/. Costă ~3 cititori haiku."""
import sys
from pathlib import Path
from types import SimpleNamespace

AICI = Path(__file__).resolve().parent
sys.path.insert(0, str(AICI.parent))
import verifica_lectie as VL  # noqa: E402

SIT = AICI.parent / "vii-m1-l04" / "t1" / "sit"
T1 = AICI / "rezultate" / "confirmare_proba"
PREDAT = ("Elevul poate spune cum decide ce obiect (text, imagine sau tabel) să folosească într-un document, "
          "după ce vrea să afle cititorul.")
NEPREDAT = "Elevul spune ce înseamnă a formata un obiect dintr-un document (text, imagine, tabel, pagină)."

T1.mkdir(parents=True, exist_ok=True)
a = SimpleNamespace(model="haiku", paralel=3, seed=7, buget=0.5)
rez = {}
r = VL.confirma_obiective(T1, SIT, [PREDAT, NEPREDAT], a, (SIT / "index.md").read_text(encoding="utf-8"), rez)
p = r.get(VL.VV._norm(PREDAT)) or {}
n = r.get(VL.VV._norm(NEPREDAT)) or {}
print(f"predat   -> {p}")
print(f"nepredat -> {n}")
print(f"cost: {round(rez.get('cost_usd', 0), 3)} USD")
ok = p.get("predat") is True and n.get("predat") is False
print("PROBA CONFIRMARE:", "TRECUTĂ" if ok else "PICATĂ")
sys.exit(0 if ok else 1)
