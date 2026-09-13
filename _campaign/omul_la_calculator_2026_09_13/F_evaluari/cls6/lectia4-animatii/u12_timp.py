"""U12: aceeasi formula ca G_poarta.py (ritm cls6 provizoriu: 20 s/clic, 50 car/min, 100 cuv/min), pe drumuri diferite.
Scrie u12_sensibilitate.txt. (Tiparul: lectia3-text-imagini/u12_timp.py.)"""
import json
from pathlib import Path

L = Path(__file__).resolve().parent
pasi = json.loads((L / "03_pasi.json").read_text(encoding="utf-8"))
cuv = json.loads((L / "masuri.json").read_text(encoding="utf-8"))["cuvinte_total"]
rez = json.loads((L / "u3_iesire.json").read_text(encoding="utf-8"))["cuvinte"]
S_CLIC, CPM, WPM, PORNIRE = 20, 50, 100, 8


def sec(p):
    return p["clicuri"] * S_CLIC + p["caractere"] * 60 / CPM + p["cuvinte_citite"] * 60 / WPM


def drum(nume, nr, cuvinte):
    s = sum(sec(p) for p in pasi if p["nr"] in nr) / 60
    t = PORNIRE + cuvinte / WPM + s
    d = PORNIRE + (cuvinte / WPM + s) / 2
    return f"{nume}: pornire {PORNIRE} + citire {cuvinte / WPM:.1f} + pasi {s:.1f} = {t:.1f} min | ritm dublu {d:.1f} min"


rows = [f"cuvinte in lectie (masuri.json): {cuv}; pana la Ex.1: {rez['pana_la_Ex1']}; Ex.1: {rez['Ex1']}; Ex.2: {rez['Ex2']}; Ex.3: {rez['Ex3']}",
        drum("TOT (Incearca tu + Ex.1-3), lectia intreaga citita", set(range(1, 19)), cuv),
        drum("Drum minim: Incearca tu + Ex.1, lectia intreaga citita", set(range(1, 11)), cuv),
        drum("Drum minim scurtat: Incearca tu + Ex.1, citit pana la Ex.1 + Ex.1", set(range(1, 11)), rez["pana_la_Ex1"] + rez["Ex1"]),
        drum("Standard: Incearca tu + Ex.1 + Ex.2, citit pana la Ex.2 inclusiv", set(range(1, 15)), rez["pana_la_Ex1"] + rez["Ex1"] + rez["Ex2"]),
        f"Doar citirea lectiei: {PORNIRE} + {cuv / WPM:.1f} = {PORNIRE + cuv / WPM:.1f} min (fara niciun clic)",
        "Ora 7 din plan = animatii + tranzitii (lectia5-tranzitii) in 50 min: timpul de mai sus e doar pentru jumatatea „animatii”.",
        "Pe pasi (min): " + ", ".join(f"{p['nr']}={sec(p) / 60:.1f}" for p in pasi)]
(L / "u12_sensibilitate.txt").write_text("\n".join(rows), encoding="utf-8")
print("\n".join(rows))
