#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Poarta mecanica a campaniei UX 2026-09-11.

Nu citeste niciun jurnal. Deschide fisierele de pe disc si le masoara.
Exit 0 = toti cei 5 pasi trec. Exit 1 = mai e de lucru (si scrie exact ce).

Rulare:  python C:/00/Projects/LearningHub/_campaign/ux_2026_09_11/status.py [--md]
"""
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SKIP_DIRS = {".backup-before-practica", "node_modules", "_campaign", "_tests",
             "tools", "v2_output", "_tmp_caseta", "_tmp_vrei_mai_mult",
             "_content_orfan", ".git", "results", "_logs"}


def walk(sub, pattern):
    """Toate fisierele care se potrivesc, sarind folderele moarte."""
    base = os.path.join(ROOT, sub)
    out = []
    for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if pattern(fn):
                out.append(os.path.join(dirpath, fn))
    return out


def read(p):
    with open(p, encoding="utf-8", errors="replace") as fh:
        return fh.read()


# ---------------------------------------------------------------- pasii

def pas1_identitate():
    """Situl intreaba 'tu esti?' cand gaseste un profil deja activ, si se poate schimba elevul."""
    p = os.path.join(ROOT, "index.html")
    h = read(p)
    has_confirm = "data-ux-identity-confirm" in h
    # varianta veche sare direct: welcomeAndGo apelat neconditionat pe profil existent
    skips = bool(re.search(r"if\s*\(\s*UserSystem\.getActiveProfile\(\)\s*\)\s*\{\s*\n\s*welcomeAndGo",
                           h))
    ok = has_confirm and not skips
    detail = []
    if not has_confirm:
        detail.append("index.html nu are ecranul de confirmare (marcaj data-ux-identity-confirm)")
    if skips:
        detail.append("index.html inca sare peste selector cand exista un profil activ")
    return ok, detail


# Motorul foloseste querySelectorAll('.atom') — deci clasa EXACTA "atom",
# nu "atom-content"/"atom-quiz"/"atom-option". Potrivirea pe \batom\b le prinde
# si pe acelea (un "-" e granita de cuvant) si umfla numaratoarea de 6 ori.
TAG_RE = re.compile(r'<div[^>]*\sclass="([^"]*)"[^>]*>', re.I)


def _is_atom(class_attr):
    return "atom" in class_attr.split()


def _split_atoms(html):
    """Bucatile de HTML ale fiecarui atom, taiate pana la urmatorul atom."""
    starts = [m.start() for m in TAG_RE.finditer(html) if _is_atom(m.group(1))]
    chunks = []
    for i, s in enumerate(starts):
        e = starts[i + 1] if i + 1 < len(starts) else len(html)
        chunks.append(html[s:e])
    return chunks


def pas2_atomi_fara_intrebare():
    """Zero atomi fara container .atom-quiz (altfel se trec singuri cu 100)."""
    lectii = walk("content", lambda f: f.startswith("lectia") and f.endswith(".html"))
    fara = 0
    fisiere = []
    total = 0
    for p in lectii:
        h = read(p)
        chunks = _split_atoms(h)
        total += len(chunks)
        n = sum(1 for c in chunks if "atom-quiz" not in c)
        if n:
            fara += n
            fisiere.append((os.path.relpath(p, ROOT).replace("\\", "/"), n))
    detail = [] if fara == 0 else [
        f"{fara} atomi fara intrebare, in {len(fisiere)} lectii (din {total} atomi, {len(lectii)} lectii)"
    ]
    return fara == 0, detail, {"atomi_fara_quiz": fara, "atomi_total": total,
                               "lectii_atinse": len(fisiere), "lectii_total": len(lectii),
                               "fisiere": fisiere[:40]}


def pas3_pas_cu_pas():
    """Modul 'un atom = un ecran' exista in motor si e pornit."""
    p = os.path.join(ROOT, "assets", "js", "atomic-learning.js")
    js = read(p)
    ok = "stepByStep" in js and "ux-step-counter" in js
    detail = [] if ok else ["atomic-learning.js nu are modul pas-cu-pas (stepByStep + ux-step-counter)"]
    return ok, detail


DEAD_DATE = re.compile(
    r"2025-2026|2025–2026|15 Aprilie|19 Iunie|MODUL 5|Modulul 5\b|Modul 5\b", re.I)


def pas4_date_moarte():
    """Structura anului 2026-2027 exista, active-module.js n-are anul ars, zero date moarte."""
    detail = []
    sy = os.path.join(ROOT, "curriculum", "school_year_2026_2027.json")
    has_sy = os.path.exists(sy)
    if not has_sy:
        detail.append("lipseste curriculum/school_year_2026_2027.json")

    am = os.path.join(ROOT, "assets", "js", "active-module.js")
    js = read(am)
    baked = bool(re.search(r"\b202[0-9]\s*:\s*202[0-9]\b", js)) or "new Date(2026, 5, 20)" in js
    if baked:
        detail.append("active-module.js are anul scolar ars in cod")

    hits = set()
    files = [os.path.join(ROOT, "index.html")]
    for sub in ("content", "hub", "assets"):
        files += walk(sub, lambda f: f.endswith((".html", ".js")))
    for p in files:
        h = read(p)
        for m in DEAD_DATE.finditer(h):
            line = h.count("\n", 0, m.start()) + 1
            hits.add(f"{os.path.relpath(p, ROOT).replace(chr(92), '/')}:{line}")
    hits = sorted(hits)
    if hits:
        detail.append(f"{len(hits)} date moarte ramase (primele: {', '.join(hits[:5])})")

    ok = has_sy and not baked and not hits
    return ok, detail, {"date_moarte": len(hits), "primele": hits[:40]}


def pas5_rutare():
    """Profilul e al doilea camp (nu id schimbat), iar LANDING duce la clasa, nu la selector."""
    us = read(os.path.join(ROOT, "assets", "js", "user-system.js"))
    idx = read(os.path.join(ROOT, "index.html"))
    detail = []
    # id-urile vechi TREBUIE sa ramana - altfel profilurile existente se rup
    ids_intacte = all(f"id: '{g}'" in us for g in ("cls9", "cls10", "cls11", "cls12"))
    if not ids_intacte:
        detail.append("ATENTIE: id-urile de clasa au fost schimbate - rupe profilurile existente")
    are_profil = "PROFILES_LICEU" in us or "trackId" in us or "profil" in us.lower() and "getActiveTrack" in us
    if not are_profil:
        detail.append("user-system.js n-are profilul ca al doilea camp")
    ruteaza = "LANDING_PROFIL" in idx or bool(re.search(r"cls9-\w+\s*:", idx))
    if not ruteaza:
        detail.append("index.html nu ruteaza pe (clasa + profil) catre pagina clasei")
    ok = ids_intacte and are_profil and ruteaza
    return ok, detail


# ---------------------------------------------------------------- raport

def main():
    md = "--md" in sys.argv
    rows = []

    ok1, d1 = pas1_identitate()
    rows.append(("1. Identitatea in laborator ('tu esti?')", ok1, d1))

    ok2, d2, m2 = pas2_atomi_fara_intrebare()
    rows.append(("2. Zero atomi care se trec singuri cu 100", ok2, d2))

    ok3, d3 = pas3_pas_cu_pas()
    rows.append(("3. Modul pas-cu-pas (un atom = un ecran)", ok3, d3))

    ok4, d4, m4 = pas4_date_moarte()
    rows.append(("4. Anul scolar 2026-2027 + zero date moarte", ok4, d4))

    ok5, d5 = pas5_rutare()
    rows.append(("5. Profil ca al doilea camp + rutare directa", ok5, d5))

    gata = sum(1 for _, ok, _ in rows if ok)
    if md:
        print("| Pas | Stare |")
        print("|:--|:--|")
        for name, ok, _ in rows:
            print(f"| {name} | {'GATA' if ok else 'DE FACUT'} |")
        print(f"\n**Gata {gata} din {len(rows)}.**\n")
    else:
        print(f"CAMPANIA UX LearningHub — gata {gata} din {len(rows)}\n")
        for name, ok, _ in rows:
            print(f"  [{'x' if ok else ' '}] {name}")

    print("\nCe nu trece inca:")
    nimic = True
    for name, ok, det in rows:
        if not ok:
            nimic = False
            print(f"\n  {name}")
            for line in det:
                print(f"     - {line}")
    if nimic:
        print("  nimic — toti pasii trec.")

    print("\nMasuratori brute:")
    print(json.dumps({"atomi": m2, "date_moarte": m4}, ensure_ascii=False, indent=2)[:1500])

    return 0 if gata == len(rows) else 1


if __name__ == "__main__":
    sys.exit(main())
