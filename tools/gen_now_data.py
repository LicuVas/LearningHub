#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Scrie assets/js/now-data.js — harta REALA a claselor de pe sit.

De ce exista: sectiunea „Ce invatam acum" din hub era scrisa de mana, arata
Modulul 5 din 15 aprilie 2026 si acoperea 4 clase din 34. Acum se genereaza
din ce e pe disc: fiecare clasa, modulele ei, cate lectii are, unde duce linkul.

Ce NU face: nu inventeaza „azi clasa a 9-a artistic face lectia X". Paginile de
liceu n-au calendar, deci nu exista pe disc informatia asta. Minciuna e mai rea
decat lipsa. Ce livreaza: unde suntem in anul scolar (adevarat, din structura
oficiala) + fiecare clasa cu modulele si lectiile ei, la un clic.

Rulare:  python C:/00/Projects/LearningHub/tools/gen_now_data.py
"""
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CONTENT = os.path.join(ROOT, "content")
OUT = os.path.join(ROOT, "assets", "js", "now-data.js")
SKIP = {".backup-before-practica", "node_modules", "v2_output", "_tests", "quizuri"}

MODUL_DIR = re.compile(r"^(m\d+|c\d+|an\d+|extra-|proba-|proiecte$)")

SECTIUNI = {
    "tic": "Gimnaziu",
    "liceu": "Liceu",
    "profesional": "Maistri si postliceal",
}

PROFIL_NUME = {
    "artistic": "artistic",
    "mat-info": "matematica-informatica",
    "militar": "militar",
    "pedagogic": "pedagogic",
    "stiinte": "stiintele naturii",
    "tehnologic": "tehnologic",
    "umanist": "umanist",
    "cercetare": "cercetare",
}


def titlu_din(path):
    """Titlul unei pagini: <h1>, altfel <title> fara coada de brand."""
    try:
        with open(path, encoding="utf-8", errors="replace") as fh:
            h = fh.read(20000)
    except OSError:
        return None
    m = re.search(r"(?is)<h1[^>]*>(.*?)</h1>", h)
    if not m:
        m = re.search(r"(?is)<title[^>]*>(.*?)</title>", h)
    if not m:
        return None
    t = re.sub(r"(?s)<[^>]+>", " ", m.group(1))
    t = re.sub(r"&[a-z]+;|&#\d+;", " ", t)
    t = re.sub(r"\s+", " ", t).strip()
    t = re.split(r"\s*[|–—]\s*", t)[0].strip()
    return t or None


def eticheta_clasa(rel):
    """'liceu/artistic/cls9' -> 'Clasa a 9-a, profil artistic'."""
    p = rel.split("/")
    m = re.match(r"cls(\d+)", p[-1])
    if m:
        nr = m.group(1)
        baza = f"Clasa a {nr}-a"
        if p[0] == "liceu" and len(p) >= 2:
            return baza + ", profil " + PROFIL_NUME.get(p[1], p[1])
        return baza
    if p[0] == "profesional":
        if "maistri" in rel:
            return "Scoala de maistri, anul I"
        if "an1-medicina" in rel:
            return "Postliceal sanitar, anul I (medicina generala)"
        if "an2-farmacie" in rel:
            return "Postliceal sanitar, anul II (farmacie)"
    return titlu_din(os.path.join(CONTENT, rel, "index.html")) or rel


def numara_lectii(d):
    n = 0
    for dirpath, dirnames, filenames in os.walk(d):
        dirnames[:] = [x for x in dirnames if x not in SKIP]
        n += sum(1 for f in filenames if f.startswith("lectia") and f.endswith(".html"))
    return n


def main():
    clase = []
    for sect in SECTIUNI:
        base = os.path.join(CONTENT, sect)
        if not os.path.isdir(base):
            continue
        for dirpath, dirnames, filenames in os.walk(base):
            dirnames[:] = [d for d in dirnames if d not in SKIP]
            if "index.html" not in filenames:
                continue
            mod_dirs = sorted(d for d in dirnames if MODUL_DIR.match(d))
            if not mod_dirs:
                continue
            lectii = numara_lectii(dirpath)
            if not lectii:
                continue
            rel = os.path.relpath(dirpath, CONTENT).replace("\\", "/")

            module = []
            for md in mod_dirs:
                mi = os.path.join(dirpath, md, "index.html")
                module.append({
                    "dir": md,
                    "titlu": (titlu_din(mi) if os.path.exists(mi) else None) or md,
                    "url": "content/" + rel + "/" + md + "/index.html",
                    "lectii": numara_lectii(os.path.join(dirpath, md)),
                })

            clase.append({
                "cale": rel,
                "sectiune": SECTIUNI[sect],
                "eticheta": eticheta_clasa(rel),
                "url": "content/" + rel + "/index.html",
                "lectii": lectii,
                "module": module,
            })

    clase.sort(key=lambda c: (list(SECTIUNI.values()).index(c["sectiune"]), c["cale"]))

    js = (
        "/* GENERAT AUTOMAT de tools/gen_now_data.py — NU EDITA DE MANA.\n"
        "   Harta claselor reale de pe sit: eticheta, link, module, cate lectii.\n"
        "   Se regenereaza dupa ORICE adaugare de continut, altfel imbatraneste. */\n"
        "window.NOW_DATA = " + json.dumps({"clase": clase}, ensure_ascii=False, indent=1) + ";\n"
    )
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(js)

    total_lectii = sum(c["lectii"] for c in clase)
    print(f"scris: {os.path.relpath(OUT, ROOT)}")
    print(f"  {len(clase)} clase, {total_lectii} lectii, "
          f"{sum(len(c['module']) for c in clase)} module")
    for s in SECTIUNI.values():
        n = sum(1 for c in clase if c["sectiune"] == s)
        print(f"  {s}: {n} clase")
    return 0


if __name__ == "__main__":
    sys.exit(main())
