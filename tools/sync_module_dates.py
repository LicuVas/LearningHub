#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Sincronizeaza intervalele de date scrise pe paginile de clasa cu structura
anului scolar din curriculum/school_year_<an>.json.

De ce exista: paginile de gimnaziu aveau scrise de mana intervalele anului
2025-2026 („M5 ... 15 apr - 19 iun"), iar active-module.js CITESTE chiar textul
ala ca sa decida ce modul e activ. Deci un an nou facea motorul sa se uite la
datele anului trecut. Acum datele vin dintr-un singur loc.

Ce atinge, si numai atat:
  - textul din <div class="domain-label">  ->  intervalul de la coada
  - textul din <div class="module-meta">   ->  „S<a>-S<b> (interval)"
  - sterge orice „ACTIV ACUM" scris de mana in sursa (motorul il pune la rulare)

NU face inlocuiri oarbe: lucreaza doar inauntrul acestor doua feluri de div-uri,
niciodata pe </body>, </script> sau alt tag de inchidere. (Vezi JOURNAL.md:158 —
un pas de build care inlocuia orb a spart paginile cu exemple de HTML.)

Rulare:   python C:/00/Projects/LearningHub/tools/sync_module_dates.py [--apply]
Implicit e uscat: arata ce ar schimba, fara sa scrie.
"""
import datetime
import glob
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# Prescurtarile pe care le folosesc PAGINILE (nu inventam altele: „3 nov", „8 sept").
LUNI_SCURT = ["ian", "feb", "mar", "apr", "mai", "iun", "iul", "aug",
              "sept", "oct", "nov", "dec"]


def structura():
    fisiere = sorted(glob.glob(os.path.join(ROOT, "curriculum", "school_year_*.json")))
    if not fisiere:
        print("EROARE: nu exista curriculum/school_year_*.json", file=sys.stderr)
        sys.exit(2)
    with open(fisiere[-1], encoding="utf-8") as fh:
        return json.load(fh), os.path.basename(fisiere[-1])


def zi(s):
    return datetime.date(*[int(x) for x in s.split("-")])


def scurt(d):
    return "%d %s" % (d.day, LUNI_SCURT[d.month - 1])


def saptamani_de_cursuri(s, e):
    """Cate saptamani de SCOALA are intervalul: numarul de luni din el, plus
    saptamana partiala de la inceput daca modulul nu incepe luni.
    (Numararea calendaristica de la 7 septembrie ar include si vacantele si
    ar da S35 pentru modulul 5 — gresit: anul are 36 de saptamani de cursuri.)"""
    n = 0
    d = s
    if d.weekday() != 0:                      # modulul incepe in cursul saptamanii
        n += 1
        d += datetime.timedelta(days=7 - d.weekday())
    while d <= e:
        n += 1
        d += datetime.timedelta(days=7)
    return n


def construieste(an):
    """{1: {'interval': '7 sept - 23 oct', 'sapt': 'S1-S7'}, ...}"""
    out = {}
    cumul = 0
    for m in an["modules"]:
        s, e = zi(m["courses_start"]), zi(m["courses_end"])
        n = saptamani_de_cursuri(s, e)
        out[m["module_index"]] = {
            "interval": "%s - %s" % (scurt(s), scurt(e)),
            "sapt": "S%d-S%d" % (cumul + 1, cumul + n),
            "saptamani": n,
        }
        cumul += n
    out["_total"] = cumul
    return out


RX_INTERVAL = re.compile(
    r"\d{1,2}\s+(?:ian|feb|mar|apr|mai|iun|iul|aug|sept?|oct|no[iv]|dec)\w*"
    r"\s*[-\u2013]\s*"
    r"\d{1,2}\s+(?:ian|feb|mar|apr|mai|iun|iul|aug|sept?|oct|no[iv]|dec)\w*",
    re.I)
RX_SAPT = re.compile(r"S\d{1,2}\s*[-\u2013]\s*S\d{1,2}")
RX_ACTIV = re.compile(r"\s*(?:&bull;|\u2022)\s*(?:<strong[^>]*>\s*)?ACTIV ACUM(?:\s*</strong>)?", re.I)


def numar_modul(text):
    m = re.search(r"\bM(?:odul)?\s*(\d)\b", text, re.I)
    return int(m.group(1)) if m else None


def proceseaza(cale, mods, aplica):
    with open(cale, encoding="utf-8", errors="replace") as fh:
        original = fh.read()
    h = original
    schimbari = []

    def fa(bloc_rx, eticheta):
        nonlocal h

        def repl(m):
            deschis, continut, inchis = m.group(1), m.group(2), m.group(3)
            plat = re.sub(r"(?s)<[^>]+>", " ", continut)
            nr = numar_modul(plat)
            if not nr or nr not in mods:
                return m.group(0)
            nou = continut
            nou = RX_ACTIV.sub("", nou)
            if RX_INTERVAL.search(nou):
                vechi = RX_INTERVAL.search(nou).group(0)
                if vechi.strip() != mods[nr]["interval"]:
                    schimbari.append((eticheta, nr, vechi.strip(), mods[nr]["interval"]))
                nou = RX_INTERVAL.sub(mods[nr]["interval"], nou, count=1)
            if RX_SAPT.search(nou):
                vechi = RX_SAPT.search(nou).group(0)
                if vechi != mods[nr]["sapt"]:
                    schimbari.append((eticheta + "/sapt", nr, vechi, mods[nr]["sapt"]))
                nou = RX_SAPT.sub(mods[nr]["sapt"], nou, count=1)
            return deschis + nou + inchis

        h = bloc_rx.sub(repl, h)

    fa(re.compile(r'(?is)(<div[^>]*class="domain-label"[^>]*>)(.*?)(</div>)'), "domain-label")
    fa(re.compile(r'(?is)(<div[^>]*class="module-meta"[^>]*>)(.*?)(</div>)'), "module-meta")

    if h != original and aplica:
        with open(cale, "w", encoding="utf-8", newline="") as fh:
            fh.write(h)
    return schimbari, h != original


def main():
    aplica = "--apply" in sys.argv
    an, sursa = structura()
    mods = construieste(an)

    print("Structura folosita: %s (%s)" % (sursa, an["school_year"]))
    for i in sorted(k for k in mods if isinstance(k, int)):
        print("   Modulul %d: %-18s %-10s (%d saptamani)"
              % (i, mods[i]["interval"], mods[i]["sapt"], mods[i]["saptamani"]))
    print("   TOTAL saptamani de cursuri: %d" % mods["_total"])
    print()

    tinte = []
    for dp, dn, fn in os.walk(os.path.join(ROOT, "content")):
        dn[:] = [d for d in dn if d not in (".backup-before-practica", "node_modules", "v2_output")]
        if "index.html" in fn:
            p = os.path.join(dp, "index.html")
            with open(p, encoding="utf-8", errors="replace") as fh:
                if 'class="domain-label"' in fh.read():
                    tinte.append(p)

    total = 0
    atinse = 0
    for p in sorted(tinte):
        schimbari, modificat = proceseaza(p, mods, aplica)
        if schimbari:
            atinse += 1
            total += len(schimbari)
            print(os.path.relpath(p, ROOT).replace(os.sep, "/"))
            for et, nr, vechi, nou in schimbari:
                print("   M%d %-16s %-22s -> %s" % (nr, et, vechi, nou))
        elif modificat:
            atinse += 1
            print(os.path.relpath(p, ROOT).replace(os.sep, "/") + "   (sters „ACTIV ACUM\" scris de mana)")

    print()
    print("%d intervale in %d pagini%s" % (total, atinse, "" if aplica else "  — RULARE USCATA, n-am scris nimic (adauga --apply)"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
