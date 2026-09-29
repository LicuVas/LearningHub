# -*- coding: utf-8 -*-
"""Oracolul lucrării „nota = punctaj : 10” (29.09.2026): numără urmele REGULII VECHI de notare
în lecțiile /lectii/ (ce se publică: index.html, afirmatii.json, profil.json).

Regula veche: praguri 27/20/14 luate în ordine, nivelul dădea banda notei, 9/8/7 note pe an,
la proiecte „nivelul = cel mai mic dintre criterii”. Regula nouă: REGULA_NOUA.md.

Rulare: python C:/00/Projects/LearningHub/_campaign/notare_punctaj_2026_09_29/verifica_regula.py
Ultima linie = numărul de urme (0 = curat).
"""
import glob
import os
import re

ROOT = r"C:/00/Projects/LearningHub/lectii"
FISIERE = ("index.html", "afirmatii.json", "profil.json")

TIPARE = [
    (r"cel pu[țţt]in 27", "prag 27"),
    (r"sub 27", "prag 27"),
    (r"≥\s*27|&gt;=\s*27|>=\s*27", "prag 27"),
    (r"27 din 40", "prag 27"),
    (r"cel pu[țţt]in 20 (din 30 )?la B", "prag 20"),
    (r"cel pu[țţt]in 14 (din 20 )?la C", "prag 14"),
    (r"primul [„\"]nu[”\"]", "scara: te oprești la primul nu"),
    (r"praguril?e? (de la|sunt regula|27)", "pragurile"),
    (r"band[aă] de not|d[aă] banda|din band[aă]", "nivelul dă banda notei"),
    (r"oric[aâ]t ar avea", "nota blocată de nivel"),
    (r"cel mai mic dintre (nivelurile )?criteri", "grila: nivelul = cel mai mic"),
    (r"Pe an iei \d|\b\d+ note pe an|cel pu[țţt]in [6-9] note|(?<!media a )\b[6-9] note\b", "număr de note vechi"),
    (r"din portofoliu", "împărțirea notelor (portofoliu)"),
]


def main():
    urme = 0
    for f in sorted(glob.glob(os.path.join(ROOT, "*", "*", "*"))):
        if os.path.basename(f) not in FISIERE:
            continue
        if "_verificare" in f or "_proba" in f:
            continue
        for nr, rand in enumerate(open(f, encoding="utf-8", errors="replace"), 1):
            for tipar, eticheta in TIPARE:
                for m in re.finditer(tipar, rand, flags=re.IGNORECASE):
                    urme += 1
                    a = max(0, m.start() - 60)
                    rel = os.path.relpath(f, ROOT).replace(os.sep, "/")
                    print("%s:%d  [%s]  …%s…" % (rel, nr, eticheta, rand[a:m.end() + 40].strip()))
    print("urme ale regulii vechi:")
    print(urme)


if __name__ == "__main__":
    main()
