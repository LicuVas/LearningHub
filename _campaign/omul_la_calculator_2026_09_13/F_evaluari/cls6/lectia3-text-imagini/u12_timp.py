"""U12: aceeasi formula ca G_poarta.py (ritm cls6 provizoriu: 20 s/clic, 50 car/min, 100 cuv/min), pe drumuri diferite.
Scrie u12_sensibilitate.txt. (Tiparul: lectia2-slide-uri/u12_timp.py.)"""
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


baza = rez["pana_la_Ex1"] - rez["atomii_6_10"] + rez["Ex1"]
rows = [f"cuvinte in lectie (masuri.json): {cuv}; pana la Ex.1: {rez['pana_la_Ex1']}; din care atomii 6-10 (dupa bannerul EXTINDERE): {rez['atomii_6_10']}",
        drum("TOT (Incearca tu + Ex.1-3), lectia intreaga citita", set(range(1, 21)), cuv),
        drum("Drum minim: Ex.1, lectia intreaga citita", set(range(5, 12)), cuv),
        drum("Drum minim scurtat: Ex.1, citit doar atomii 1-5 + Ex.1 (sare EXTINDEREA)", set(range(5, 12)), baza),
        f"Doar citirea lectiei: {PORNIRE} + {cuv / WPM:.1f} = {PORNIRE + cuv / WPM:.1f} min (fara niciun clic)",
        "Pe pasi (min): " + ", ".join(f"{p['nr']}={sec(p) / 60:.1f}" for p in pasi)]
(L / "u12_sensibilitate.txt").write_text("\n".join(rows), encoding="utf-8")
print("\n".join(rows))
