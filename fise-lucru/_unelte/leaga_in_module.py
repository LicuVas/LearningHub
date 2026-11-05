"""Pune în paginile de modul ale LearningHub câte un card spre fișele de lucru electronice dintr-o zi.

    python fise-lucru/_unelte/leaga_in_module.py          # arată ce ar schimba
    python fise-lucru/_unelte/leaga_in_module.py --scrie  # scrie (idempotent: nu dublează cardul)
Cardul intră primul în <div class="lessons-grid"> al modulului. Creat 05.11.2026 (inspecția ARACIP la CTT).
"""
import sys
from pathlib import Path

LH = Path(__file__).resolve().parents[2]
ZI = "2026-11-05"
ZI_TEXT = "joi, 5 noiembrie 2026"
MODULE = {
    "content/liceu/tehnologic/cls10/m2-calcul-tabelar/index.html": [
        ("x-b", "X B", "Formule simple și completarea automată — devizul de piese auto"),
        ("x-e", "X E", "Formule simple și completarea automată — devizul băncii de grădină"),
    ],
    "content/liceu/tehnologic/cls11/m4-surse-si-cautare/index.html": [
        ("xi-c", "XI C", "Surse de informație: aceeași întrebare în trei surse, comparate"),
        ("xi-d", "XI D", "Surse de informație: fondul forestier al județului Neamț, în trei surse"),
    ],
    "content/liceu/tehnologic/cls12/m2-web-creare-site/index.html": [
        ("xii-c", "XII C", "Ierarhia paginilor, meniul comun și legăturile rupte"),
    ],
    "content/profesional/maistri/an1/c1-aplicatii-software/index.html": [
        ("maistri-i-f", "Anul I F", "Proba practică a competenței 1: reprezentări grafice în Word și Excel"),
    ],
}
GRID = '<div class="lessons-grid">'


def card(slug, clasa, desc):
    return (f'\n            <a href="/fise-lucru/{ZI}/{slug}/" class="lesson-card">\n'
            f'                <div class="lesson-number">★</div>\n'
            f'                <div class="lesson-content">\n'
            f'                    <div class="lesson-title">Fișa de lucru de la oră — {clasa}, {ZI_TEXT}</div>\n'
            f'                    <div class="lesson-desc">{desc}</div>\n'
            f'                </div>\n'
            f'                <div class="lesson-meta">\n'
            f'                    <span class="meta-badge badge-tic">Fișă electronică</span>\n'
            f'                    <span class="lesson-duration">la oră</span>\n'
            f'                </div>\n'
            f'            </a>')


def main(scrie):
    schimbate = 0
    for rel, carduri in MODULE.items():
        f = LH / rel
        t = f.read_text(encoding="utf-8")
        if f"/fise-lucru/{ZI}/" in t:
            print("deja legat:", rel)
            continue
        if t.count(GRID) != 1:
            print("NU găsesc o singură listă de lecții în", rel)
            continue
        nou = t.replace(GRID, GRID + "".join(card(*c) for c in carduri), 1)
        print(("scris: " if scrie else "aș scrie: ") + rel, f"(+{len(carduri)} card)")
        if scrie:
            f.write_text(nou, encoding="utf-8")
        schimbate += 1
    return schimbate


if __name__ == "__main__":
    main("--scrie" in sys.argv)
