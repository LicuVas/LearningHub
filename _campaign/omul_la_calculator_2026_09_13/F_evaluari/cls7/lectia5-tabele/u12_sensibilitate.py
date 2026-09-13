"""U12 — sensibilitatea timpului: aceleasi formule ca G_poarta.py (ritmuri cls7 provizorii 15 s/clic, 60 car/min, 115 cuv/min),
pe variante de ora. Copiat din lectia4-liste si adaptat (pasul 16 = raspunsurile scrise pe site; 1-3 = Ex.1, 5-7 = Ex.2, 9 = Ex.3, 13 = provocarea).
Iesire: u12_sensibilitate.txt."""
import json
from pathlib import Path
L = Path(__file__).resolve().parent
pasi = json.loads((L / "03_pasi.json").read_text(encoding="utf-8"))
m = json.loads((L / "masuri.json").read_text(encoding="utf-8"))
cuv = m["cuvinte_total"]
pc = json.loads((L / "parcurgere.json").read_text(encoding="utf-8"))
cuv_atomi = sum(p.get("cuvinte", 0) for p in pc)


def sarcina(ps):
    return sum(p["clicuri"] * 15 + p["caractere"] + p["cuvinte_citite"] * 60 / 115 for p in ps) / 60


def fara(*nr):
    return [p for p in pasi if p["nr"] not in nr]


def doar(*nr):
    return [p for p in pasi if p["nr"] in nr]


var = {
 "lectia asa cum e (citit tot + Word + raspunsuri scrise)": (cuv / 115, sarcina(pasi)),
 "doar citirea lectiei (fara Word)": (cuv / 115, 0),
 "doar cei 11 atomi cititi (fara exercitii, fara sfaturi)": (cuv_atomi / 115, 0),
 "doar exercitiile Ex.1-Ex.3 + provocarea in Word, fara citire": (0, sarcina(fara(16))),
 "doar Ex.1 in Word (pasii 1-4, 15), fara citire": (0, sarcina(doar(1, 2, 3, 4, 15))),
 "ora 4 propusa: atomii 1-5 cititi (~ primii 5 din parcurgere) + Ex.1": (sum(p.get("cuvinte", 0) for p in pc[:5]) / 115, sarcina(doar(1, 2, 3, 4, 15))),
}
out = [f"cuvinte_total={cuv}, cuvinte in atomi={cuv_atomi}, atomi={m['atomi']}"]
for k, (c, s) in var.items():
    t, t2 = 8 + c + s, 8 + (c + s) / 2
    out.append(f"{k}: pornire 8 + citire {c:.1f} + sarcina {s:.1f} = {t:.1f} min | ritm dublu {t2:.1f} min -> {'incape' if t2 <= 50 else 'NU incape nici la ritm dublu'}")
out.append("Context: ora 4 (29.09 VII A/B, 02.10.2026 7 MA) = «Obiecte: text, imagini, tabele»; ora 7 (20.10 / 23.10.2026) = «Formatarea imaginii, a tabelului si a paginii».")
(L / "u12_sensibilitate.txt").write_text("\n".join(out), encoding="utf-8")
print("\n".join(out))
