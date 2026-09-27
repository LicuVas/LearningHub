# -*- coding: utf-8 -*-
"""Banda „În lucru” pe paginile VECHI de gimnaziu (content/tic/cls5..cls8/**/*.html).

    python C:/00/Projects/LearningHub/lectii/_build/banda_veche.py           # pune / împrospătează banda
    python C:/00/Projects/LearningHub/lectii/_build/banda_veche.py --check   # nu scrie; ultima linie = pagini fără bandă

Banda stă între <!-- REVIZIE:START ... --> și <!-- REVIZIE:END -->, imediat după <body ...> (primul <body după
</head>, ca să nu prindă exemplele de cod care conțin „<body>”). Idempotent: dacă markerii există, se rescrie DOAR
ce e între ei. Restul fișierului rămâne octet cu octet (se verifică la fiecare scriere: fișierul fără bandă ==
fișierul de dinainte). Nu atinge liceul, jocuri/ sau alți markeri (JOCURI:START/END etc.).

Lecțiile din VARIANTA_TARE primesc „Nu folosi încă această lecție: are greșeli cunoscute și se reface.”
Ultimele trei linii tipărite sunt pline; ultima = DOAR numărul de pagini fără bandă (sau cu bandă greșită).
"""
import os
import re
import sys
from pathlib import Path

LH = Path(__file__).resolve().parents[2]
CLASE = {"cls5": ("v", "a V-a"), "cls6": ("vi", "a VI-a"), "cls7": ("vii", "a VII-a"), "cls8": ("viii", "a VIII-a")}
VARIANTA_TARE = {
    "content/tic/cls8/m2-formule-functii/lectia1-introducere-formule.html",
}
START = "<!-- REVIZIE:START (generat de lectii/_build/banda_veche.py) -->"
END = "<!-- REVIZIE:END -->"
BLOC_RE = re.compile(r"<!-- REVIZIE:START[^>]*-->.*?<!-- REVIZIE:END -->", re.S)
HEAD_END = re.compile(r"</head\s*>", re.I)
BODY = re.compile(r"<body\b[^>]*>", re.I)

STIL = ("position:relative;z-index:2147483000;box-sizing:border-box;width:100%;max-width:none;margin:0;"
        "padding:10px 16px;font:600 16px/1.45 'Segoe UI',system-ui,-apple-system,sans-serif;text-align:left;")
STIL_OBISNUIT = STIL + "background:#FEF3C7;color:#422006;border-bottom:3px solid #D97706;"
STIL_TARE = STIL + "background:#FEE2E2;color:#450A0A;border-bottom:3px solid #DC2626;"
STIL_LINK = "color:#7C2D12;text-decoration:underline;font-weight:700;"


def banda(fisier, rel):
    clasa, nume = CLASE[rel.split("/")[2]]
    tinta = os.path.relpath(LH / "lectii" / clasa / "index.html", fisier.parent).replace("\\", "/")
    link = f'<a href="{tinta}" style="{STIL_LINK}">lecțiile noi ale clasei {nume} →</a>'
    if rel in VARIANTA_TARE:
        corp = (f'<div class="lh-revizie lh-revizie-tare" role="alert" style="{STIL_TARE}">'
                f'<strong>Nu folosi încă această lecție: are greșeli cunoscute și se reface.</strong> '
                f'Lecțiile noi ale clasei: {link}</div>')
    else:
        corp = (f'<div class="lh-revizie" role="note" style="{STIL_OBISNUIT}">'
                f'În lucru: lecțiile se refac de la capăt. Lecțiile noi ale clasei: {link}</div>')
    return f"{START}\n{corp}\n{END}"


def pozitie_body(text):
    h = HEAD_END.search(text)
    m = BODY.search(text, h.end() if h else 0)
    return m.end() if m else -1


def main():
    check = "--check" in sys.argv[1:]
    fisiere = sorted(p for c in CLASE for p in (LH / "content" / "tic" / c).rglob("*.html"))
    fara, scrise, la_zi, erori = [], 0, 0, []
    for f in fisiere:
        rel = f.relative_to(LH).as_posix()
        brut = f.read_bytes()
        try:
            text = brut.decode("utf-8")
        except UnicodeDecodeError:
            erori.append(f"{rel}: nu e UTF-8, sărit")
            fara.append(rel)
            continue
        nl = "\r\n" if "\r\n" in text else "\n"
        bloc = banda(f, rel).replace("\n", nl)
        m = BLOC_RE.search(text)
        if m:
            if m.group(0) == bloc:
                la_zi += 1
                continue
            if check:
                fara.append(rel + " (bandă veche/greșită)")
                continue
            nou = text[:m.start()] + bloc + text[m.end():]
            original_fara_banda = text[:m.start()] + text[m.end():]
            verif = nou[:m.start()] + nou[m.start() + len(bloc):]
        else:
            if check:
                fara.append(rel)
                continue
            i = pozitie_body(text)
            if i < 0:
                erori.append(f"{rel}: nu are <body>, sărit")
                fara.append(rel)
                continue
            inserat = nl + bloc
            nou = text[:i] + inserat + text[i:]
            original_fara_banda = text
            verif = nou[:i] + nou[i + len(inserat):]
        if verif != original_fara_banda or nou.count("<!-- JOCURI:START") != text.count("<!-- JOCURI:START"):
            erori.append(f"{rel}: verificarea „fără bandă == original” a picat, NU am scris")
            fara.append(rel)
            continue
        f.write_bytes(nou.encode("utf-8"))
        scrise += 1
    for e in erori:
        print("  EROARE", e)
    if check:
        for r in fara[:40]:
            print("  fără bandă:", r)
    mod = "verificare, nu s-a scris nimic" if check else f"scrise {scrise}"
    print(f"pagini vechi de gimnaziu: {len(fisiere)} · cu banda la zi: {la_zi} · {mod}")
    print("pagini fără bandă (sau cu bandă greșită):")
    print(len(fara))
    return 1 if fara else 0


if __name__ == "__main__":
    sys.exit(main())
