"""U12 — sensibilitatea timpului: aceleasi formule ca G_poarta.py (ritmuri cls7 provizorii 15 s/clic, 60 car/min, 115 cuv/min),
pe variante de ora. Iesire: u12_sensibilitate.txt."""
import json
from pathlib import Path
L = Path(__file__).resolve().parent
pasi = json.loads((L / "03_pasi.json").read_text(encoding="utf-8"))
cuv = json.loads((L / "masuri.json").read_text(encoding="utf-8"))["cuvinte_total"]
def sarcina(ps): return sum(p["clicuri"] * 15 + p["caractere"] + p["cuvinte_citite"] * 60 / 115 for p in ps) / 60
raspunsuri = {8, 11, 14}
var = {
 "lectia asa cum e (citit tot + Word + raspunsuri scrise)": (cuv / 115, sarcina(pasi)),
 "fara raspunsurile scrise pe site": (cuv / 115, sarcina([p for p in pasi if p["nr"] not in raspunsuri])),
 "doar exercitiile in Word, fara citirea atomilor": (0, sarcina([p for p in pasi if p["nr"] not in raspunsuri])),
 "doar citirea atomilor (fara Word)": (cuv / 115, 0),
}
out = []
for k, (c, s) in var.items():
    t, t2 = 8 + c + s, 8 + (c + s) / 2
    out.append(f"{k}: pornire 8 + citire {c:.1f} + sarcina {s:.1f} = {t:.1f} min | ritm dublu {t2:.1f} min -> {'incape' if t2 <= 50 else 'NU incape nici la ritm dublu'}")
out.append("Context: ora 6 din plan (13.10.2026 VII A/VII B, 16.10.2026 7 MA) cuprinde si lectia 2 (78,4 min la poarta, JURNAL.md).")
(L / "u12_sensibilitate.txt").write_text("\n".join(out), encoding="utf-8")
print("\n".join(out))
