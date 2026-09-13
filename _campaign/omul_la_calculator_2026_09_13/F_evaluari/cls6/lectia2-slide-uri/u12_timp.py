"""U12: aceeasi formula ca G_poarta.py (ritm cls6 provizoriu: 20 s/clic, 50 car/min, 100 cuv/min), pe drumuri diferite.
Scrie u12_sensibilitate.txt. Verifica si ca 'Linear Diagonal' nu apare in sursele Microsoft descarcate."""
import json
from pathlib import Path

L = Path(__file__).resolve().parent
pasi = json.loads((L / "03_pasi.json").read_text(encoding="utf-8"))
cuv = json.loads((L / "masuri.json").read_text(encoding="utf-8"))["cuvinte_total"]
S_CLIC, CPM, WPM, PORNIRE = 20, 50, 100, 8


def sec(p):
    return p["clicuri"] * S_CLIC + p["caractere"] * 60 / CPM + p["cuvinte_citite"] * 60 / WPM


def drum(nume, nr):
    s = sum(sec(p) for p in pasi if p["nr"] in nr) / 60
    t = PORNIRE + cuv / WPM + s
    d = PORNIRE + (cuv / WPM + s) / 2
    return f"{nume}: pornire {PORNIRE} + citire {cuv / WPM:.1f} + pasi {s:.1f} = {t:.1f} min | ritm dublu {d:.1f} min"


rows = [f"cuvinte in lectie (masuri.json): {cuv}",
        drum("TOT (Incearca tu + Ex.1-4)", set(range(1, 17))),
        drum("Drum minim (Incearca tu + Ex.1)", {1, 2, 3, 4, 5, 6, 7, 8, 9, 10}),
        drum("Doar Ex.1 (fara Incearca tu)", {4, 5, 6, 7, 8, 9, 10}),
        f"Doar citirea lectiei: {PORNIRE} + {cuv / WPM:.1f} = {PORNIRE + cuv / WPM:.1f} min (fara niciun clic)",
        "Pe pasi (min): " + ", ".join(f"{p['nr']}={sec(p) / 60:.1f}" for p in pasi)]
for n in ("fundal_en", "fundal_ro"):
    t = (L / "surse" / "raw" / f"{n}.txt").read_text(encoding="utf-8")
    rows.append(f"'Linear Diagonal' in {n}: {'Linear Diagonal' in t}; 'Top Left' in {n}: {'Top Left' in t}")
(L / "u12_sensibilitate.txt").write_text("\n".join(rows), encoding="utf-8")
print("\n".join(rows))
