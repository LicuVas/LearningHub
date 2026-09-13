"""U5/U12: reproduc 'nu incape' si arat ca verdictul rezista si la ritmuri mult mai rapide decat cele provizorii.
Formula = cea din G_poarta.py (pornire 8 + cuvinte/ritm + pasi). Iesire: u12_sensibilitate.txt."""
import json
import re
from pathlib import Path

L = Path(__file__).resolve().parent
HTML = Path(r"C:\00\Projects\LearningHub\content\tic\cls7\m1-word-fundamente\lectia1-interfata-word.html")
m = json.loads((L / "masuri.json").read_text(encoding="utf-8"))
pasi = json.loads((L / "03_pasi.json").read_text(encoding="utf-8"))
cuv = m["cuvinte_total"]
cl = sum(p["clicuri"] for p in pasi)
ch = sum(p["caractere"] for p in pasi)
wc = sum(p["cuvinte_citite"] for p in pasi)
src = HTML.read_text(encoding="utf-8")
out = [f"cuvinte lectie={cuv}  atomi={m['atomi']}  <img> in HTML={len(re.findall(r'<img', src))}  clicuri={cl} caractere={ch} cuvinte_in_program={wc}"]
for nume, (s_clic, cpm, wpm) in {"provizoriu cls7": (15, 60, 115), "de 2 ori mai rapid": (7.5, 120, 230),
                                 "adult rapid": (5, 200, 250)}.items():
    citire = cuv / wpm
    sarcina = (cl * s_clic + ch * 60 / cpm + wc * 60 / wpm) / 60
    tot = 8 + citire + sarcina
    out.append(f"{nume:20s} pornire 8 + citire {citire:5.1f} + sarcina {sarcina:5.1f} = {tot:5.1f} min -> {'incape' if tot <= 50 else 'NU INCAPE'}")
# doar teoria + intrebarile, fara exercitii (varianta 'ora 1 = teorie')
linii = (L / "innerText.txt").read_text(encoding="utf-8").split("\n")
k = next(i for i, x in enumerate(linii) if x.strip() == "Exercitii practice")
dupa = len(re.sub(r"\[/?ASCUNS[^\]]*\]", " ", "\n".join(linii[k:])).split())
theory_words = cuv - dupa
out.append(f"cuvinte de la 'Exercitii practice' (rand {k + 1}) la final: {dupa}")
out.append(f"doar teorie (~{theory_words} cuvinte) + 22 clicuri quiz, ritm provizoriu: {8 + theory_words/115 + 22*15/60:.1f} min")
(L / "u12_sensibilitate.txt").write_text("\n".join(out) + "\n", encoding="utf-8")
print("\n".join(out))
