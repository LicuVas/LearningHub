"""Proces Python NOU: redeschide artefactele (U7) si recalculeaza timpul pe doua ritmuri (U12, sensibilitate).
Iesiri: 07_redeschis.json, u12_sensibilitate.txt"""
import json
from pathlib import Path

L = Path(__file__).resolve().parent
r = json.loads((L / "u1_raspunsuri_elev.json").read_text(encoding="utf-8"))
s = json.loads((L / "u7_salvare_iesire.json").read_text(encoding="utf-8"))
u3 = json.loads((L / "u3_iesire.json").read_text(encoding="utf-8"))
red = {
    "u1_raspunsuri_elev.json": {"intrari": len(r), "ex1_raspuns": r[1]["raspuns_elev_11_ani"][:60]},
    "u7_salvare_iesire.json": {"dupa_reincarcare": s["dupa_reincarcare_acelasi_browser"][:40],
                               "alt_profil": s["alt_profil_browser"], "cheie": s["chei_localStorage"][-1]},
    "u3_iesire.json": {"cheie_eq_parcurgere": sum(o["cheie_eq_parcurgere"] for o in u3), "din": len(u3)},
}
(L / "07_redeschis.json").write_text(json.dumps(red, ensure_ascii=False, indent=1), encoding="utf-8")

pasi = json.loads((L / "03_pasi.json").read_text(encoding="utf-8"))
m = json.loads((L / "masuri.json").read_text(encoding="utf-8"))
cl = sum(p["clicuri"] for p in pasi)
ch = sum(p["caractere"] for p in pasi)
lines = [f"cuvinte lectie {m['cuvinte_total']} | clicuri {cl} | caractere {ch}"]
for nume, (sc, cpm, wpm) in {"provizoriu cls5": (20, 40, 90), "dublu": (10, 80, 180)}.items():
    citire = m["cuvinte_total"] / wpm
    sarcina = (cl * sc + ch * 60 / cpm) / 60
    lines.append(f"{nume}: pornire 8 + citire {citire:.1f} + sarcina {sarcina:.1f} = {8 + citire + sarcina:.1f} min")
tq = m["cuvinte_total"] / 90
lines.append(f"doar citirea + intrebarile (fara exercitii), ritm provizoriu: {8 + tq + 15 * 20 / 60:.1f} min")
(L / "u12_sensibilitate.txt").write_text("\n".join(lines), encoding="utf-8")
print(json.dumps(red, ensure_ascii=False))
print("\n".join(lines))
