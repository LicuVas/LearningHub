"""U12 — aceeasi formula ca G_poarta.py (ritmuri cls7: 15 s/clic, 60 car/min, 115 cuv/min, pornire 8), pe variante.
Scrie u12_sensibilitate.txt; tipareste <= 20 de randuri."""
import json
from pathlib import Path

L = Path(__file__).resolve().parent
pasi = json.loads((L / "03_pasi.json").read_text(encoding="utf-8"))
cuv = json.loads((L / "masuri.json").read_text(encoding="utf-8"))["cuvinte_total"]
S, CPM, WPM, PORN = 15, 60, 115, 8


def sarcina(nrs):
    s = 0.0
    for p in pasi:
        if p["nr"] in nrs:
            s += p["clicuri"] * S + p["caractere"] * 60 / CPM + p["cuvinte_citite"] * 60 / WPM
    return s / 60


VAR = {
    "A. tot ce cere lectia (citit + 11 grile + Ex.1 + Ex.2 + Ex.3 + provocare)": (cuv, range(1, 18)),
    "B. citit + grile + Ex.1": (cuv, range(1, 10)),
    "C. fara cititul atomilor: grile + Ex.1 (profesorul da doar sarcina)": (0, range(1, 10)),
    "D. fara citit: doar Ex.1": (0, range(2, 10)),
    "E. fara citit: doar Ex.3 (nivel performanta)": (0, [12, 13, 14, 15, 16]),
}
rows = [f"cuvinte_total lectie = {cuv}; citire = {cuv / WPM:.1f} min"]
for k, (c, nrs) in VAR.items():
    cit = c / WPM
    t = sarcina(nrs)
    tot = PORN + cit + t
    dub = PORN + (cit + t) / 2
    rows.append(f"{k}: pornire 8 + citit {cit:.1f} + sarcina {t:.1f} = {tot:.1f} min ({'incape' if tot <= 50 else 'NU incape'}) | ritm dublu {dub:.1f}")
rows.append("Nota: timpul profesorului de a CORECTA documentele nu intra aici (vezi 05_evaluare.md, barem).")
(L / "u12_sensibilitate.txt").write_text("\n".join(rows) + "\n", encoding="utf-8")
print("\n".join(rows))
