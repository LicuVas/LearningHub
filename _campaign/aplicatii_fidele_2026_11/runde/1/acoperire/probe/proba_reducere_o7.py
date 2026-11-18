# -*- coding: utf-8 -*-
"""Proba reparației A (O7), fără browser: o pagină care ÎNCARCĂ biblioteca (pentru Word) e judecată EXACT ca de regula veche
(cea de la HEAD), inclusiv `lipsa_in_biblioteca`; fișele Cum fac de Word la fel (Word e luat din bibliotecă de o pagină);
tot restul = exact ca la pornire (fără bibliotecă). Randarea e simulată: L.randare() întoarce o singură instanță Word în mod
„conventie”, cu arborele GOL (biblioteca n-are nimic) -> orice citat bun de pe acea pagină trebuie să iasă „lipsă”.
Ultima linie = abateri."""
import importlib.util
import json
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
D = Path(r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11")
AICI = Path(__file__).resolve().parent
sys.path.insert(0, str(D / "oracole"))
import structura_lib as L  # noqa: E402

CAMPURI = ("unde", "sursa", "lant", "fel", "fila_spusa", "grupul_spus", "aplicatii", "aplicatii_fara_referinta", "motiv")
P = sys.argv[1] if len(sys.argv) > 1 else "lectii/vii/m1-l03/index.html"
APP = sys.argv[2] if len(sys.argv) > 2 else "word"


def modul(nume, cale):
    s = importlib.util.spec_from_file_location(nume, cale)
    m = importlib.util.module_from_spec(s)
    s.loader.exec_module(m)
    return m


nou = modul("o7_nou", D / "oracole" / "oracol_text_ui.py")
vechi = modul("o7_vechi", AICI / "oracol_text_ui_vechi.py")   # git show HEAD:.../oracol_text_ui.py
L.biblioteca_exista = lambda: True
L.randare = lambda *a, **k: {"pagini": {P: {"pagina": P, "instante": [{"aplicatie": APP, "mod": "conventie", "suprafete": {}}]}}}

n_nou, det_nou, _ = nou.masoara()
n_vechi, det_vechi, _ = vechi.masoara()
pornire = json.loads((D / "runde/1/iesiri_pornire/O7/oracol_text_ui.json").read_text(encoding="utf-8"))


def k(p):
    return json.dumps({c: p.get(c) for c in CAMPURI}, sort_keys=True, ensure_ascii=False)


def in_bib(p):   # locurile care iau APP din bibliotecă: pagina P și fișele Cum fac ale lui APP
    return (p["unde"] == "lectie" and p["sursa"].split(":")[0] == P) or (p["unde"] == "cum_fac" and p["aplicatii"][0] == APP)


a_nou = [k(p) for p in det_nou["probleme"] if in_bib(p)]
a_vechi = [k(p) for p in det_vechi["probleme"] if in_bib(p)]
r_nou = [k(p) for p in det_nou["probleme"] if not in_bib(p)]
r_porn = [k(p) for p in pornire["probleme"] if not in_bib(p)]
lipsa_nou = sum(1 for p in det_nou["probleme"] if p["motiv"] == "lipsa_in_biblioteca")
lipsa_P = sum(1 for p in det_nou["probleme"] if p["motiv"] == "lipsa_in_biblioteca" and p["unde"] == "lectie")
print(f"pagina care încarcă biblioteca: {P} ({APP}); regula NOUĂ: {n_nou} probleme, din care lipsa_in_biblioteca {lipsa_nou} "
      f"({lipsa_P} pe pagină, {lipsa_nou - lipsa_P} în fișele Cum fac {APP}); regula VECHE (HEAD) pe tot situl: {n_vechi}")
print(f"  locurile cu biblioteca: nou {len(a_nou)} probleme / vechi {len(a_vechi)} — identice: {a_nou == a_vechi}")
print(f"  restul: nou {len(r_nou)} / pornire {len(r_porn)} — identice: {r_nou == r_porn}")
abateri = (a_nou != a_vechi) + (r_nou != r_porn) + (lipsa_P == 0)
print("abateri:", abateri)
print(abateri)
