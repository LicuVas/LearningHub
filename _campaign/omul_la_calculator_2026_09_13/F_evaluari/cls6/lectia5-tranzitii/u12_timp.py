"""U12: aceeasi formula ca G_poarta.py (ritm cls6 provizoriu: 20 s/clic, 50 car/min, 100 cuv/min), pe drumuri diferite,
+ lectia4 si lectia5 ADUNATE fata de aceeasi ora 7 din plan. Scrie u12_sensibilitate.txt. (Adaptat din lectia4-animatii/u12_timp.py.)"""
import json
from pathlib import Path

L = Path(__file__).resolve().parent
L4 = L.parent / "lectia4-animatii"
S_CLIC, CPM, WPM, PORNIRE = 20, 50, 100, 8


def sec(p):
    return p["clicuri"] * S_CLIC + p["caractere"] * 60 / CPM + p["cuvinte_citite"] * 60 / WPM


def date(d):
    pasi = json.loads((d / "03_pasi.json").read_text(encoding="utf-8"))
    cuv = json.loads((d / "masuri.json").read_text(encoding="utf-8"))["cuvinte_total"]
    rez = json.loads((d / "u3_iesire.json").read_text(encoding="utf-8"))["cuvinte"]
    return pasi, cuv, rez


def minute(pasi, nr, cuvinte):
    return cuvinte / WPM + sum(sec(p) for p in pasi if p["nr"] in nr) / 60


p5, c5, r5 = date(L)
p4, c4, r4 = date(L4)
MIN5 = set(range(1, 12))            # Incearca tu + atomii + Ex.1
STD5 = set(range(1, 16))            # + Ex.2
MIN4 = set(range(1, 11))            # L4: Incearca tu + Ex.1 (drumul minim din lectia4-animatii/u12_sensibilitate.txt)
rows = [f"L5 cuvinte (masuri.json): {c5}; pana la Ex.1: {r5['pana_la_Ex1']}; Ex.1: {r5['Ex1']}; Ex.2: {r5['Ex2']}; Ex.3: {r5['Ex3']}"]
t_tot = minute(p5, set(range(1, 22)), c5)
rows.append(f"L5 TOT (Incearca tu + atomi + Ex.1-3), lectia intreaga citita: {PORNIRE} + {t_tot:.1f} = {PORNIRE + t_tot:.1f} min | ritm dublu {PORNIRE + t_tot / 2:.1f}")
t_min = minute(p5, MIN5, r5["pana_la_Ex1"] + r5["Ex1"])
rows.append(f"L5 drum minim (citit pana la Ex.1 + Ex.1, pasii 1-11): {PORNIRE} + {t_min:.1f} = {PORNIRE + t_min:.1f} min | ritm dublu {PORNIRE + t_min / 2:.1f}")
t_std = minute(p5, STD5, r5["pana_la_Ex1"] + r5["Ex1"] + r5["Ex2"])
rows.append(f"L5 standard (+ Ex.2): {PORNIRE} + {t_std:.1f} = {PORNIRE + t_std:.1f} min | ritm dublu {PORNIRE + t_std / 2:.1f}")
t4 = minute(p4, MIN4, r4["pana_la_Ex1"] + r4["Ex1"])
rows.append(f"L4 drum minim (acelasi calcul pe lectia4-animatii): {t4:.1f} min fara pornire")
rows.append(f"ORA 7 = L4 minim + L5 minim, o singura pornire: {PORNIRE} + {t4:.1f} + {t_min:.1f} = {PORNIRE + t4 + t_min:.1f} min "
            f"| ritm dublu {PORNIRE + (t4 + t_min) / 2:.1f} min | fata de 50 min")
rows.append(f"ORA 7 doar citind (L4 {c4} + L5 {c5} cuvinte): {PORNIRE} + {(c4 + c5) / WPM:.1f} = {PORNIRE + (c4 + c5) / WPM:.1f} min, fara niciun clic")
rows.append("Pe pasi L5 (min): " + ", ".join(f"{p['nr']}={sec(p) / 60:.1f}" for p in p5))
(L / "u12_sensibilitate.txt").write_text("\n".join(rows), encoding="utf-8")
print("\n".join(rows))
