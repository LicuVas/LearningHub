# -*- coding: utf-8 -*-
"""Oracolul regulii „nota lucrării de modul = 80% lucrarea + 20% munca pe LearningHub” în lecțiile 1 (07.10.2026).

Pentru fiecare lecție dată (implicit v, vi, vii, viii / m1-l01) numără ce LIPSEȘTE:
  - un pas al cărui titlu conține „LearningHub”, cu: 80 (procente sau puncte din 100), 20 de puncte, oficiu,
    „Arată-mi răspunsul”, minutele (că nu contează), anunțul, calea fără calculator acasă (la oră / foaie),
    absența motivată, exemplul „nimic pe site → 8” și o casetă „Încearcă tu” (incearca:{...});
  - pasul despre lucrare (cel cu „punctaj : 10”) trimite spre munca de pe LearningHub.
Regula: C:\\00\\Projects\\Info_Gimnaziu_2026\\SISTEM_EVALUARE.md §4.5 și C:\\00\\AI_0\\tools\\nota_site.py.
Rulare: python oracol_nota_site.py [v vi vii viii] -> ultima linie = probleme (0 = bine)."""
import re
import sys
import unicodedata
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
R = Path(r"C:\00\Projects\LearningHub\lectii")


def fd(s):
    s = unicodedata.normalize("NFKD", s)
    return "".join(c for c in s if not unicodedata.combining(c)).lower()


CERINTE = [
    ("80 (procente sau puncte)", r"80\s*(%|de puncte|din 100|la suta)"),
    ("20 de puncte de pe site", r"\b20\b"),
    ("oficiul de site", r"oficiu"),
    ("„Arată-mi răspunsul”", r"arata-mi raspunsul"),
    ("minutele nu contează", r"minut"),
    ("de la anunț", r"anunt"),
    ("calea fără calculator acasă (la oră / pe foaie)", r"foaie|calculatorul scolii|la ora"),
    ("absența motivată", r"motivat"),
    ("exemplul: nimic pe site -> 8", r"nimic.{0,160}\b8\b|\b8\b.{0,160}nimic"),
    ("o casetă „Încearcă tu”", r"incearca\s*:\s*\{"),
]


def regiune_pas(t, start):
    """De la titlul pasului până la textul pasului următor (al doilea „text:`” după start)."""
    a = t.find("text:`", start)
    b = t.find("text:`", a + 6) if a >= 0 else -1
    return t[start:b if b > 0 else start + 8000]


def verifica(cls):
    f = R / cls / "m1-l01" / "index.html"
    t = f.read_text(encoding="utf-8")
    probleme = []
    m = re.search(r"\{t:'([^']*LearningHub[^']*)'", t)
    if not m:
        probleme.append("lipsește pasul despre munca pe LearningHub (titlu cu „LearningHub”)")
    else:
        reg = fd(regiune_pas(t, m.start()))
        for nume, tipar in CERINTE:
            if not re.search(tipar, reg, flags=re.S):
                probleme.append("pasul „%s”: lipsește %s" % (m.group(1), nume))
    # pasul despre lucrare: textul care conține „punctaj : 10” trebuie să pomenească LearningHub
    gasit = False
    for mm in re.finditer(r"text:`(.*?)`", t, flags=re.S):
        if re.search(r"punctaj\s*:\s*10", mm.group(1)):
            gasit = True
            if "LearningHub" not in mm.group(1):
                probleme.append("pasul cu „punctaj : 10” nu trimite spre munca pe LearningHub")
            break
    if not gasit:
        probleme.append("n-am găsit pasul despre lucrare (textul cu „punctaj : 10”)")
    return probleme


def main():
    clase = [a for a in sys.argv[1:] if not a.startswith("-")] or ["v", "vi", "vii", "viii"]
    total = 0
    for c in clase:
        p = verifica(c.split("/")[0])
        total += len(p)
        for x in p:
            print("%s/m1-l01: %s" % (c, x))
        if not p:
            print("%s/m1-l01: OK" % c)
    print("probleme:")
    print(total)
    return total


if __name__ == "__main__":
    raise SystemExit(1 if main() else 0)
