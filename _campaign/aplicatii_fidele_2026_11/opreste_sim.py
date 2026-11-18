# -*- coding: utf-8 -*-
"""Simulatoarele lui opreste.py: jurnale FALSE cu decizia cunoscută dinainte; dovada că opreste.py decide corect.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/opreste_sim.py

Fiecare caz scrie un jurnal.jsonl fals într-un dosar temporar (%TEMP%), rulează opreste.py ca proces separat
(--jurnal, --dosar, --consum-nivel dat de caz, ca rezultatul să nu depindă de consumul real) și compară ultima linie
(CONTINUA/OPRESTE) și tipul din „DECIZIE: X (TIP)” cu cele așteptate. Plus: pe un caz CONTINUA fără --fara-prompt,
promptul rundei următoare trebuie să apară, complet (fără {LOCURI}), cu unghiul N mod 3.
Ultima linie = numărul de cazuri decise GREȘIT (0 = opreste.py decide cum spune regula). Cod 0/1.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

AICI = Path(__file__).resolve().parent
# LH_OPRESTE_SUB_TEST = un opreste.py stricat intenționat (dovada că simulatoarele îl prind); implicit cel adevărat
OPRESTE = Path(os.environ.get("LH_OPRESTE_SUB_TEST") or AICI / "opreste.py")
UN =["aspect", "gest_tastatura", "stare_finala_erori"]
O0 = {f"O{i}": 0 for i in range(1, 10)}


def O(**kw):
    o = dict(O0)
    o.update(kw)
    return o


def rand(n, o, porti=0, grav=0, lock=True, etapa="B", app="word", unghi=None, **extra):
    r = {"runda": n, "etapa": etapa, "aplicatia": app, "unghi": unghi or UN[n % 3], "oracole_inainte": o, "oracole_dupa": o,
         "porti_inainte": porti, "porti_dupa": porti, "tinta": f"ținta {n}", "reparat": True, "critic_grav_deschise": grav,
         "publicat_nonce": None, "repere_lock_ok": lock}
    r.update(extra)
    return r


SCADE = [O(O3=40, O4=12), O(O3=31, O4=12), O(O3=22, O4=9), O(O3=15, O4=9), O(O3=9, O4=4), O(O3=4, O4=1)]


def PP(**kw):
    """porțile pe poartă, {poarta: n} (n = probleme, ca în masurare.json › pentru_jurnal.porti); implicit toate 0"""
    p = {"test_joc": 0, "controale_taiate": 0, "cum_fac": 0, "fereastra_mica": 0, "date_personale": 0, "word2007_j2": 0}
    p.update(kw)
    return p


P41 = PP(cum_fac=41)
P80 = PP(cum_fac=80)
CAZURI = [
    # (nume, rânduri | text brut, nivel consum, decizia așteptată, tipul așteptat)
    ("gol", [], "VERDE", "CONTINUA", "START"),
    ("convergenta", [rand(1, O(O3=5), grav=2), rand(2, O0, grav=1), rand(3, O0), rand(4, O0), rand(5, O0)], "VERDE", "OPRESTE", "CONVERGENTA"),
    ("GRAV deschis în ultima rundă", [rand(3, O0), rand(4, O0), rand(5, O0, grav=1)], "VERDE", "CONTINUA", "CONTINUA"),
    ("GRAV ca listă", [rand(3, O0), rand(4, O0), rand(5, O0, grav=["GRAV: fila Home lipsește la m2-l12"])], "VERDE", "CONTINUA", "CONTINUA"),
    ("GRAV doar în runda mai veche din cele 3", [rand(3, O0, grav=1), rand(4, O0), rand(5, O0)], "VERDE", "CONTINUA", "CONTINUA"),
    ("doar 2 unghiuri diferite", [rand(3, O0, unghi="aspect"), rand(4, O0, unghi="aspect"), rand(5, O0, unghi="gest_tastatura")],
     "VERDE", "CONTINUA", "CONTINUA"),
    ("doar 2 runde curate", [rand(4, O0), rand(5, O0)], "VERDE", "CONTINUA", "CONTINUA"),
    ("porți picate", [rand(3, O0, porti=1), rand(4, O0, porti=1), rand(5, O0, porti=1)], "VERDE", "CONTINUA", "CONTINUA"),
    # 17.11.2026: porțile pe poartă (n = probleme) — înainte rundele 3-4 aveau porti=0, iar runda 5 cum_fac 41; azi asta e
    # o creștere 0 -> 41 de la o rundă la alta (REGRES, caz separat mai jos), deci cum_fac e roșu în toate cele 3 runde
    ("porți ca dicționar cu una picată (aceeași în 3 runde)", [rand(3, O0, porti=P41), rand(4, O0, porti=P41), rand(5, O0, porti=P41)],
     "VERDE", "CONTINUA", "CONTINUA"),
    # REGRES, n cu n pe fiecare poartă (verificare_etapa0.md 3.h, reparația 6): cum_fac era deja PICAT cu 41
    ("cum_fac 41 -> 80 în rundă (porti_inainte -> porti_dupa)", [rand(1, O(O3=12), porti=P80, porti_inainte=P41)],
     "VERDE", "OPRESTE", "REGRES"),
    ("cum_fac 41 -> 80 de la o rundă la alta", [rand(3, O(O3=12), porti=P41), rand(4, O(O3=9), porti=P80)],
     "VERDE", "OPRESTE", "REGRES"),
    ("cum_fac 0 -> 41 de la o rundă la alta", [rand(4, O0), rand(5, O0, porti=P41)], "VERDE", "OPRESTE", "REGRES"),
    ("o poartă crește cât scade alta (suma tot 41)", [rand(3, O(O3=12), porti=P41),
                                                       rand(4, O(O3=9), porti=PP(cum_fac=30, date_personale=11))],
     "VERDE", "OPRESTE", "REGRES"),
    ("poartă deja roșie, neschimbată (41 -> 41)", [rand(3, O(O3=12), porti=P41), rand(4, O(O3=9), porti=P41)],
     "VERDE", "CONTINUA", "CONTINUA"),
    ("poartă care scade (41 -> 30)", [rand(3, O(O3=12), porti=P41), rand(4, O(O3=9), porti=PP(cum_fac=30), porti_inainte=P41)],
     "VERDE", "CONTINUA", "CONTINUA"),
    ("porți ca întreg (formă veche): 41 -> 80", [rand(3, O(O3=12), porti=41), rand(4, O(O3=9), porti=80)], "VERDE", "OPRESTE", "REGRES"),
    ("poartă scoasă din jurnal (cum_fac lipsește)", [rand(3, O(O3=12), porti=P41),
                                                     rand(4, O(O3=9), porti={k: v for k, v in P41.items() if k != "cum_fac"})],
     "VERDE", "OPRESTE", "NECONCLUDENT"),
    ("oracol care crește în rundă (O3 12 -> 15)", [rand(1, O(O3=15), oracole_inainte=O(O3=12))], "VERDE", "OPRESTE", "REGRES"),
    ("rundă `acoperire`: cum_fac 41 -> 80 are voie", [rand(3, O(O3=12), porti=P41), rand(4, O(O3=9), porti=P80, porti_inainte=P41,
                                                                                        acoperire=True)],
     "VERDE", "CONTINUA", "CONTINUA"),
    ("convergență cu porțile pe poartă, toate 0", [rand(3, O0, porti=PP()), rand(4, O0, porti=PP()), rand(5, O0, porti=PP())],
     "VERDE", "OPRESTE", "CONVERGENTA"),
    ("regres + lacăt rupt: tipul = lacătul", [rand(3, O(O3=12), porti=P41), rand(4, O(O3=9), porti=P80, lock=False)],
     "VERDE", "OPRESTE", "LACAT_RUPT"),
    ("platou", [rand(1, O(O3=12, O4=7)), rand(2, O(O3=12, O4=7)), rand(3, O(O3=12, O4=7))], "VERDE", "OPRESTE", "PLATOU"),
    ("platou după scădere", [rand(1, O(O3=20)), rand(2, O(O3=12, O4=7)), rand(3, O(O3=12, O4=7)), rand(4, O(O3=12, O4=7))],
     "VERDE", "OPRESTE", "PLATOU"),
    ("doar 2 runde la fel", [rand(1, O(O3=20)), rand(2, O(O3=12)), rand(3, O(O3=12))], "VERDE", "CONTINUA", "CONTINUA"),
    ("zero-uri la fel dar GRAV deschis (nu e platou)", [rand(3, O0, grav=1), rand(4, O0, grav=1), rand(5, O0, grav=1)],
     "VERDE", "CONTINUA", "CONTINUA"),
    ("numere în scădere", [rand(i + 1, SCADE[i]) for i in range(4)], "VERDE", "CONTINUA", "CONTINUA"),
    ("limita valului (6 runde)", [rand(i + 1, SCADE[i], grav=1) for i in range(6)], "VERDE", "OPRESTE", "LIMITA_VAL"),
    ("6 runde dar val nou de la a 5-a", [rand(i + 1, SCADE[i], grav=1, app="word" if i < 4 else "excel") for i in range(6)],
     "VERDE", "CONTINUA", "CONTINUA"),
    ("6 runde, câmpul val schimbat", [rand(i + 1, SCADE[i], grav=1, val="B-word-1" if i < 2 else "B-word-2") for i in range(6)],
     "VERDE", "CONTINUA", "CONTINUA"),
    ("lacăt rupt", [rand(1, SCADE[0]), rand(2, SCADE[1], lock=False)], "VERDE", "OPRESTE", "LACAT_RUPT"),
    ("lacăt nespus (lipsă)", [rand(1, SCADE[0]), {k: v for k, v in rand(2, SCADE[1]).items() if k != "repere_lock_ok"}],
     "VERDE", "OPRESTE", "LACAT_RUPT"),
    ("oracol neconcludent (-1)", [rand(1, SCADE[0]), rand(2, O(O6=-1, O3=5))], "VERDE", "OPRESTE", "NECONCLUDENT"),
    ("lipsește O9", [rand(1, SCADE[0]), rand(2, {k: v for k, v in SCADE[1].items() if k != "O9"})], "VERDE", "OPRESTE", "NECONCLUDENT"),
    ("porți neconcludente (-1)", [rand(1, SCADE[0]), rand(2, SCADE[1], porti=-1)], "VERDE", "OPRESTE", "NECONCLUDENT"),
    ("buget ROSU", [rand(i + 1, SCADE[i]) for i in range(3)], "ROSU", "OPRESTE", "BUGET"),
    ("buget GALBEN (nu oprește)", [rand(i + 1, SCADE[i]) for i in range(3)], "GALBEN", "CONTINUA", "CONTINUA"),
    ("buget necunoscut (nu oprește)", [rand(i + 1, SCADE[i]) for i in range(3)], "NECUNOSCUT", "CONTINUA", "CONTINUA"),
    ("convergență + ROSU: tipul = convergența", [rand(3, O0), rand(4, O0), rand(5, O0)], "ROSU", "OPRESTE", "CONVERGENTA"),
    ("oracole ca listă de 9", [rand(3, [0] * 9), rand(4, [0] * 9), rand(5, [0] * 9)], "VERDE", "OPRESTE", "CONVERGENTA"),
    ("jurnal stricat", '{"runda": 1, "etapa": "B"\nnu e json\n', "VERDE", "OPRESTE", "JURNAL_STRICAT"),
]


def ruleaza(dosar, jurnal, nivel, fara_prompt=True):
    cmd = [sys.executable, str(OPRESTE), "--jurnal", str(jurnal), "--dosar", str(dosar), "--consum-nivel", nivel]
    if fara_prompt:
        cmd.append("--fara-prompt")
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=180)
    linii = [x for x in p.stdout.splitlines() if x.strip()]
    m = re.search(r"DECIZIE: (\w+) \((\w+)\)", p.stdout)
    return (linii[-1].strip() if linii else ""), (m.group(2) if m else None), p.returncode, p.stdout


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    tmp = Path(tempfile.mkdtemp(prefix="lh_opreste_sim_"))
    gresite = 0
    try:
        for i, (nume, rows, nivel, dec, tip) in enumerate(CAZURI):
            d = tmp / f"c{i:02d}"
            d.mkdir()
            j = d / "jurnal.jsonl"
            j.write_text(rows if isinstance(rows, str) else "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows), encoding="utf-8")
            ult, t, cod, _ = ruleaza(d, j, nivel)
            cod_asteptat = 0 if dec == "CONTINUA" else 1
            ok = ult == dec and t == tip and cod == cod_asteptat
            gresite += not ok
            print(f"  {'ok    ' if ok else 'GREȘIT'} {nume}: {ult} ({t}), cod {cod}" + ("" if ok else f" — așteptam {dec} ({tip}), cod {cod_asteptat}"))
        # promptul rundei următoare (CONTINUA fără --fara-prompt), pe șablonul adevărat
        d = tmp / "prompt"
        d.mkdir()
        shutil.copy(AICI / "prompt_runda.md", d / "prompt_runda.md")
        (d / "runde" / "4").mkdir(parents=True)
        (d / "runde" / "4" / "critic.md").write_text("Pe unghiul gest_tastatura:\nGRAV: Ctrl+Z anulează un cuvânt întreg (word.js:120)\n"
                                                    "MĂRUNT: umbra butonului\n", encoding="utf-8")
        j = d / "jurnal.jsonl"
        j.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in [rand(3, SCADE[2]), rand(4, SCADE[3], grav=1)]), encoding="utf-8")
        ult, t, cod, out = ruleaza(d, j, "VERDE", fara_prompt=False)
        pf = d / "runde" / "5" / "prompt.md"
        txt = pf.read_text(encoding="utf-8") if pf.exists() else ""
        verificari = {
            "decizia CONTINUA": ult == "CONTINUA",
            "runde/5/prompt.md scris": bool(txt),
            "fără {LOCURI} necompletate": bool(txt) and not re.search(r"\{[A-Z_]+(?:\+1)?\}", txt),
            "Ești runda 5 (etapa B)": "Ești runda 5 (etapa B)" in txt,
            f"unghiul 5 mod 3 = {UN[5 % 3]}": f"Pe unghiul {UN[5 % 3]}" in txt,
            "ținta propusă = GRAV-ul criticului din runda 4": "Ctrl+Z anulează un cuvânt întreg" in txt and "MĂRUNT: umbra" not in txt,
            "runda următoare = 6 în pasul 10": "runde/6/prompt.md" in txt,
            "comentariul șablonului scos": "Se completează de `pregateste_runda.py`" not in txt,
        }
        for k, v in verificari.items():
            gresite += not v
            print(f"  {'ok    ' if v else 'GREȘIT'} prompt: {k}")
        # unghiurile pe rândul rundelor 1..3 sunt 3 diferite (convergența cere 3 unghiuri: N mod 3 le dă mereu)
        u = []
        for n in (1, 2, 3):
            p = subprocess.run([sys.executable, str(AICI / "pregateste_runda.py"), str(n), "--etapa", "B", "--aplicatia", "word",
                                "--dosar", str(d)], capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=60)
            m = re.search(r"unghiul (\w+)", p.stdout)
            u.append(m.group(1) if m else None)
        ok = u == [UN[1], UN[2], UN[0]]
        gresite += not ok
        print(f"  {'ok    ' if ok else 'GREȘIT'} unghiurile rundelor 1-3: {u}")
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print(f"cazuri: {len(CAZURI)} jurnale false + 8 verificări ale promptului + 1 a unghiurilor · decise greșit: {gresite}")
    print("opreste_sim.py (fără fișier de detalii: totul e mai sus)")
    print(gresite)
    return 0 if gresite == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
