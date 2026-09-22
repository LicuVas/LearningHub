#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Leaga ghidurile de telefon de jocurile care le cer (harta.json -> index.html).

De ce exista: ghidul e facut o data si folosit de mai multe jocuri. Cine pe cine
foloseste scrie in `jocuri\\_ghiduri\\harta.json`. Unealta asta duce harta in
paginile jocurilor, mecanic, ca sa nu se uite un joc si sa nu se lipeasca de mana.

Ce scrie in `jocuri\\<joc>\\index.html`:
  1. dupa `<script src="../_motor/motor.js"></script>`, cate un rand
     `<script src="../_ghiduri/<id>/pasi.js"></script>` pentru fiecare ghid;
  2. in configuratia `JocMotor.porneste({...})`, randul `ghiduri:['a','b'],`.

REGULA CARE CONTEAZA: un ghid se leaga DOAR daca e gata cu adevarat - are
`pasi.js` SI cel putin o captura `.webp`. Altfel elevul ar vedea butonul
„Cum fac pe telefon" si ar cadea intr-un ghid fara poze. Mai bine niciun buton
decat o promisiune goala. Ghidurile nepregatite se raporteaza ca probleme, nu
se leaga.

Rulare:
    python ghid_leaga.py              # leaga ce e gata si raporteaza restul
    python ghid_leaga.py --verifica   # nu scrie nimic, doar numara (oracol)

Ultima linie tiparita = numarul de probleme (oracol pentru contracte).
"""
import argparse
import json
import os
import re
import sys

AICI = os.path.dirname(os.path.abspath(__file__))
JOCURI = os.path.dirname(AICI)
GHIDURI = os.path.join(JOCURI, "_ghiduri")
HARTA = os.path.join(GHIDURI, "harta.json")

RAND_MOTOR = '<script src="../_motor/motor.js"></script>'
TIPAR_PASI = '<script src="../_ghiduri/%s/pasi.js"></script>'


def citeste(cale):
    with open(cale, encoding="utf-8", newline="") as f:
        return f.read()


def scrie(cale, text):
    with open(cale, "w", encoding="utf-8", newline="") as f:
        f.write(text)


def ghid_gata(idg):
    """Un ghid e gata cand are pasi.js SI cel putin o captura."""
    dosar = os.path.join(GHIDURI, idg)
    if not os.path.isdir(dosar):
        return False, "nu exista dosarul _ghiduri/%s" % idg
    if not os.path.exists(os.path.join(dosar, "pasi.js")):
        return False, "lipseste _ghiduri/%s/pasi.js (nu s-au facut capturile)" % idg
    capturi = [f for f in os.listdir(dosar) if f.lower().endswith(".webp")]
    if not capturi:
        return False, "_ghiduri/%s nu are nicio captura .webp" % idg
    return True, "%d capturi" % len(capturi)


def scoate_randuri_pasi(text):
    """Sterge randurile de <script ... _ghiduri/*/pasi.js> existente (rescriem curat)."""
    return re.sub(r'[ \t]*<script src="\.\./_ghiduri/[^"]+/pasi\.js"></script>\r?\n', "", text)


def pune_scripturi(text, iduri, joc, probleme):
    text = scoate_randuri_pasi(text)
    if not iduri:
        return text
    poz = text.find(RAND_MOTOR)
    if poz < 0:
        probleme.append("%s: nu gasesc randul care incarca motorul, nu pot pune ghidurile" % joc)
        return text
    capat = poz + len(RAND_MOTOR)
    # pastreaza sfarsitul de rand folosit in fisier
    sfarsit = "\r\n" if text[capat:capat + 2] == "\r\n" else "\n"
    bucata = "".join(sfarsit + (TIPAR_PASI % i) for i in iduri)
    return text[:capat] + bucata + text[capat:]


def pune_ghiduri_in_config(text, iduri, joc, probleme):
    """Randul `ghiduri:[...]` in configuratia jocului, imediat dupa `cheie:`."""
    nou = "  ghiduri:[%s]," % ",".join("'%s'" % i for i in iduri)
    vechi = re.search(r"^[ \t]*ghiduri:\[[^\]]*\],[ \t]*\r?\n", text, re.M)
    if not iduri:
        return re.sub(r"^[ \t]*ghiduri:\[[^\]]*\],[ \t]*\r?\n", "", text, flags=re.M)
    if vechi:
        return text[:vechi.start()] + nou + vechi.group(0)[len(vechi.group(0).rstrip("\r\n")):] + text[vechi.end():]
    m = re.search(r"JocMotor\.porneste\(\{", text)
    if not m:
        probleme.append("%s: nu gasesc JocMotor.porneste, nu pot scrie lista de ghiduri" % joc)
        return text
    mc = re.search(r"^([ \t]*)cheie:[^\n]*\r?\n", text[m.end():], re.M)
    if not mc:
        probleme.append("%s: nu gasesc randul `cheie:` in configuratie" % joc)
        return text
    taie = m.end() + mc.end()
    sfarsit = "\r\n" if text[taie - 2:taie] == "\r\n" else "\n"
    return text[:taie] + nou + sfarsit + text[taie:]


def main():
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--verifica", action="store_true", help="nu scrie nimic, doar numara problemele")
    a = p.parse_args()

    with open(HARTA, encoding="utf-8") as f:
        harta = json.load(f)["jocuri"]

    probleme = []
    legate = 0
    for joc in sorted(harta):
        cerute = harta[joc]
        cale = os.path.join(JOCURI, joc, "index.html")
        if not os.path.exists(cale):
            probleme.append("%s: nu exista jocuri/%s/index.html, dar e in harta" % (joc, joc))
            continue
        text = citeste(cale)
        if RAND_MOTOR not in text or "JocMotor.porneste" not in text:
            probleme.append("%s: pagina nu foloseste motorul comun, deci nu poate arata ghiduri "
                            "(scoate-l din harta sau mut-o pe motor)" % joc)
            continue

        gata, nepregatite = [], []
        for idg in cerute:
            ok, de_ce = ghid_gata(idg)
            (gata if ok else nepregatite).append(idg if ok else (idg, de_ce))
        for idg, de_ce in nepregatite:
            probleme.append("%s: ghidul „%s” nu e gata - %s" % (joc, idg, de_ce))

        nou = pune_ghiduri_in_config(pune_scripturi(text, gata, joc, probleme), gata, joc, probleme)
        if nou != text:
            if a.verifica:
                probleme.append("%s: legaturile din pagina nu sunt la zi (ruleaza fara --verifica)" % joc)
            else:
                scrie(cale, nou)
                print("  %-28s -> %s" % (joc, ", ".join(gata) if gata else "(niciun ghid gata)"))
        if gata:
            legate += 1

    print()
    print("Jocuri cu cel putin un ghid legat: %d din %d" % (legate, len(harta)))
    for x in probleme:
        print("  PROBLEMA:", x)
    print("PROBLEME:", len(probleme))
    print(len(probleme))
    return 0 if not probleme else 1


if __name__ == "__main__":
    sys.exit(main())
