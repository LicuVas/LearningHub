"""U12 + U5: reproduc calculul de timp al portii (aceleasi formule, ritmurile cls7 din G_poarta.py) si il variez.
Iesire: u12_sensibilitate.txt."""
import json
from pathlib import Path

L = Path(__file__).resolve().parent
pasi = json.loads((L / "03_pasi.json").read_text(encoding="utf-8"))
cuv = json.loads((L / "masuri.json").read_text(encoding="utf-8"))["cuvinte_total"]
S_CLIC, CPM, WPM, PORNIRE = 15, 60, 115, 8
clic = sum(p["clicuri"] for p in pasi)
car = sum(p["caractere"] for p in pasi)
cit = sum(p["cuvinte_citite"] for p in pasi)
rows = [f"pasi={len(pasi)} clicuri={clic} caractere={car} cuvinte_citite_in_afara_lectiei={cit} cuvinte_lectie={cuv}"]
for nume, f in [("ritm poarta", 1), ("ritm x1.5", 1.5), ("ritm dublu", 2)]:
    citire = cuv / (WPM * f)
    sarcina = (clic * S_CLIC / f + car * 60 / (CPM * f) + cit * 60 / (WPM * f)) / 60
    tot = PORNIRE + citire + sarcina
    rows.append(f"{nume:12s}: pornire {PORNIRE} + citire {citire:.1f} + sarcina {sarcina:.1f} = {tot:.1f} min -> {'incape' if tot <= 50 else 'nu incape'}")
# scenariul „profesorul preda frontal, elevii nu citesc atomii” (alternativa C din 06_premortem.md)
sarcina = (clic * S_CLIC + car * 60 / CPM + cit * 60 / WPM) / 60
rows.append(f"fara citirea atomilor (predare frontala 10 min): {PORNIRE} + 10 + {sarcina:.1f} = {PORNIRE + 10 + sarcina:.1f} min")
rows.append("atomi: 10 (spec 4-8); ora 6 din plan = formatarea textului SI a paragrafului (lectia3-paragrafe ~4.700 cuvinte in B_inventar.csv)")
(L / "u12_sensibilitate.txt").write_text("\n".join(rows) + "\n", encoding="utf-8")
print("\n".join(rows))
