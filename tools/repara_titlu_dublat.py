# -*- coding: utf-8 -*-
"""Scoate titlul "Vrei mai mult?" repetat in interiorul casetei de aprofundare.

    python tools/repara_titlu_dublat.py            -> arata ce ar schimba
    python tools/repara_titlu_dublat.py --aplica   -> scrie

Caseta e construita de depth_io.py ca:
    <div class="depth-box">
        <h3>Vrei mai mult?</h3>
        <CORPUL SCRIS DE AGENT>
    </div>
Multi agenti si-au inceput corpul cu inca un titlu ("<p><strong>Vrei mai mult?</strong></p>"
sau un <h3>/<h4> propriu), asa ca elevul vede titlul de doua ori. Unealta taie DOAR
acel al doilea titlu, si numai daca sta imediat dupa <h3>-ul casetei - nu atinge un
"Vrei mai mult?" care apare mai tarziu in text ca parte dintr-o fraza.
"""
import os, io, re, sys

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DESCHIDERE = re.compile(r'(<div class="depth-box">\s*<h3>\s*Vrei mai mult\?\s*</h3>\s*)', re.I)
# Cazul 1: un <p>/<h2>/<h3>/<h4> care contine DOAR "Vrei mai mult?" -> se taie tot elementul
AL_DOILEA = re.compile(r'\s*<(p|h2|h3|h4)\b[^>]*>\s*(?:<strong>\s*|<b>\s*)?Vrei mai mult\?\s*(?:</strong>\s*|</b>\s*)?</\1>\s*',
                       re.I)
# Cazul 2: titlul e doar INCEPUTUL primului paragraf, urmat de continut real in
# acelasi <p> ("<p><strong>Vrei mai mult?</strong> Deschide Setari > ...").
# Aici se taie DOAR eticheta, nu paragraful - altfel as arunca text bun.
CA_INCEPUT = re.compile(r'(\s*<p\b[^>]*>)\s*(?:<strong>|<b>)\s*Vrei mai mult\?\s*(?:</strong>|</b>)\s*(?=\S)',
                        re.I)


def repara(src):
    """(src_nou, cate_taiate)"""
    m = DESCHIDERE.search(src)
    if not m:
        return src, 0
    rest = src[m.end():]
    m2 = AL_DOILEA.match(rest)
    if m2:
        return src[:m.end()] + rest[m2.end():], 1
    m3 = CA_INCEPUT.match(rest)
    if m3:
        return src[:m.end()] + m3.group(1) + rest[m3.end():], 1
    return src, 0


def fisiere():
    for root, _, fs in os.walk(os.path.join(R, "content")):
        if ".backup" in root.lower():
            continue
        for f in sorted(fs):
            if f.endswith(".html"):
                yield os.path.join(root, f)


if __name__ == "__main__":
    aplica = "--aplica" in sys.argv
    n = 0
    for p in fisiere():
        src = io.open(p, encoding="utf-8", errors="replace").read()
        if 'class="depth-box"' not in src:
            continue
        nou, k = repara(src)
        if not k:
            continue
        n += 1
        rel = os.path.relpath(p, R).replace(os.sep, "/")
        if aplica:
            io.open(p, "w", encoding="utf-8", newline="").write(nou)
        if n <= 8:
            print("  %s" % rel)
    print()
    print(("SCRIS: %d fisiere" % n) if aplica else
          ("s-ar schimba: %d fisiere\nruleaza cu --aplica ca sa scrie" % n))
