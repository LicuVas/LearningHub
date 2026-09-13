"""U12: aceeasi formula ca G_poarta.py (ritm cls6 provizoriu: 20 s/clic, 50 car/min, 100 cuv/min), pe drumuri diferite,
+ sustinerea orala (pe care formula portii n-o vede) si notarea de catre profesor, pe numar de elevi NECUNOSCUT (tabel, nu o cifra).
Scrie u12_sensibilitate.txt. (Adaptat din lectia5-tranzitii/u12_timp.py.)"""
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
S_CLIC, CPM, WPM, PORNIRE = 20, 50, 100, 8
pasi = json.loads((L / "03_pasi.json").read_text(encoding="utf-8"))
total_cuv = json.loads((L / "masuri.json").read_text(encoding="utf-8"))["cuvinte_total"]
t = (L / "innerText.txt").read_text(encoding="utf-8").splitlines()


def cuv(a, b):
    return sum(len(re.sub(r"\[/?ASCUNS[^\]]*\]", "", x).split()) for x in t[a - 1:b])


def sec(p):
    return p["clicuri"] * S_CLIC + p["caractere"] * 60 / CPM + p["cuvinte_citite"] * 60 / WPM


def minute(nr, cuvinte):
    return cuvinte / WPM + sum(sec(p) for p in pasi if p["nr"] in nr) / 60


C_PANA_EX1, C_EX1, C_EX2, C_EX3 = cuv(1, 769), cuv(770, 799), cuv(800, 829), cuv(830, 859)
rows = [f"Cuvinte: total {total_cuv} (masuri.json); pana la Ex.1 {C_PANA_EX1}; Ex.1 {C_EX1}; Ex.2 {C_EX2}; Ex.3 {C_EX3} (cu rezolvarile pliate)"]
drumuri = {
    "A. Poarta: lectia intreaga citita + toti pasii 1-18": (set(range(1, 19)), total_cuv),
    "B. Lectie + Ex.1 (plan) - fara PowerPoint": ({1, 2, 3}, C_PANA_EX1 + C_EX1),
    "C. Lectie + Ex.1 + Ex.2 (produsul notat)": (set(range(1, 15)), C_PANA_EX1 + C_EX1 + C_EX2),
    "D. FARA atomi (lectia citita la ora 8): doar Ex.1 + Ex.2 citite si facute": ({1, 3} | set(range(4, 15)), C_EX1 + C_EX2),
    "E. FARA atomi: doar Ex.2 (planul facut acasa)": (set(range(4, 15)), C_EX2),
}
for nume, (nr, c) in drumuri.items():
    m = minute(nr, c)
    rows.append(f"{nume}: {PORNIRE} + {m:.1f} = {PORNIRE + m:.1f} min | ritm dublu {PORNIRE + m / 2:.1f}")
mE = minute(set(range(4, 15)), C_EX2)
rows.append("")
rows.append("SUSTINEREA (plan ora 9: „realizare + sustinere”; lectia Ex.3: 3-5 min de elev). Numarul de elevi NU e cunoscut -> tabel:")
rows.append("elevi | sustinere 3 min | 5 min | + pornire 8 + doar Ex.2 (drum E) la 3 min")
for n in (6, 10, 14, 18, 22, 26):
    rows.append(f"{n:>5} | {3 * n:>4} min | {5 * n:>4} min | {PORNIRE + mE + 3 * n:.0f} min")
n_max = int((50 - PORNIRE - mE) // 3)
rows.append(f"Cati elevi pot sustine in aceeasi ora, dupa drumul E, la 3 min fiecare: {max(n_max, 0)}")
rows.append(f"Cati elevi pot sustine intr-o ora INTREAGA doar de sustineri (50 min, fara pornire, 3 min + 1 min schimbarea la calculator): {50 // 4}")
rows.append("")
rows.append("NOTAREA de catre profesor (u1_notare.md: 18 criterii, 0 puncte; 3 criterii doar in Slide Show, 2 doar ascultand):")
rows.append("ipoteza NEMASURATA: 2 min/proiect deschis in F5 (7 diapozitive + 3 linkuri) -> 20 de proiecte = 40 min, in afara orei")
(L / "u12_sensibilitate.txt").write_text("\n".join(rows), encoding="utf-8")
print("\n".join(rows))
