#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Poarta mecanica a campaniei UX 2026-09-11.

Nu citeste niciun jurnal. Deschide fisierele de pe disc si le masoara.
Exit 0 = toti cei 5 pasi trec. Exit 1 = mai e de lucru (si scrie exact ce).

Rulare:  python C:/00/Projects/LearningHub/_campaign/ux_2026_09_11/status.py [--md]
"""
import glob
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
    """Modul 'un atom = un ecran' exista, e pornit, si primul pas e o bucata,
    nu un zid. Cifra care conteaza: cate cuvinte vede elevul cand deschide."""
    import statistics
    p = os.path.join(ROOT, "assets", "js", "atomic-learning.js")
    js = read(p)
    detail = []
    if "setupStepByStep" not in js or "ux-step-counter" not in js:
        detail.append("atomic-learning.js nu are modul pas-cu-pas")
    if not re.search(r"stepByStep:\s*true", js):
        detail.append("modul pas-cu-pas exista, dar nu e pornit implicit")

    primii = []
    for f in walk("content", lambda f: f.startswith("lectia") and f.endswith(".html")):
        chunks = _split_atoms(read(f))
        if not chunks:
            continue
        t = re.sub(r"(?s)<[^>]+>", " ", chunks[0])
        primii.append(len(re.sub(r"\s+", " ", t).split()))

    masura = {}
    if primii:
        mediana = statistics.median(primii)
        ziduri = sum(1 for x in primii if x > 800)
        masura = {"lectii": len(primii), "mediana_primului_pas": mediana,
                  "primul_pas_peste_800": ziduri}
        if mediana > 400:
            detail.append(f"primul pas are mediana {mediana} de cuvinte (tinta: sub 400)")
        if ziduri > 10:
            detail.append(f"{ziduri} lectii se deschid cu peste 800 de cuvinte")

    return (not detail), detail, masura


def pas4_date_moarte():
    """Nimic despre „acum" nu mai e scris de mana.

    NOTA de masurare (corectata 12.09.2026): prima versiune a portii cauta sirul
    „Modulul 5" si „2025-2026" oriunde pe sit si raporta 80 de „date moarte".
    Era gresit: „Modulul 5" e NUMELE real al unui modul de clasa, iar „2025-2026"
    apare in date fictive dintr-un exercitiu si intr-o nota despre un plan-cadru.
    Ce conteaza cu adevarat sunt intervalele pe care le CITESTE motorul.
    """
    import subprocess
    detail = []
    an_curent = sorted(glob.glob(os.path.join(ROOT, "curriculum", "school_year_*.json")))
    if not an_curent:
        detail.append("nu exista niciun curriculum/school_year_*.json")
        return False, detail, {}
    etichete = [os.path.basename(f) for f in an_curent]

    # 1. fisierul generat exista si e la zi fata de JSON
    sy_js = os.path.join(ROOT, "assets", "js", "school-year.js")
    if not os.path.exists(sy_js):
        detail.append("lipseste assets/js/school-year.js (ruleaza tools/gen_school_year_js.py)")
    else:
        inainte = read(sy_js)
        subprocess.run([sys.executable, os.path.join(ROOT, "tools", "gen_school_year_js.py")],
                       capture_output=True)
        if read(sy_js) != inainte:
            detail.append("assets/js/school-year.js NU era la zi fata de fisierul JSON")

    # 2. motorul n-are anul ars in COD. Comentariile se scot intai: documentatia
    #    fisierului citeaza chiar linia veche („var year = m >= 8 ? 2025 : 2026"),
    #    iar o poarta care se impiedica de propria explicatie te invata sa nu explici.
    js = read(os.path.join(ROOT, "assets", "js", "active-module.js"))
    cod = re.sub(r"(?s)/\*.*?\*/", " ", js)
    cod = re.sub(r"(?m)^\s*//.*$", " ", cod)
    if re.search(r"\b202\d\s*:\s*202\d\b", cod) or re.search(r"new Date\(\s*20\d\d\s*,", cod):
        detail.append("active-module.js are inca anul scolar ars in cod")

    # 3. harta claselor exista si acopera tot situl
    nd = os.path.join(ROOT, "assets", "js", "now-data.js")
    nr_clase = 0
    if not os.path.exists(nd):
        detail.append("lipseste assets/js/now-data.js (ruleaza tools/gen_now_data.py)")
    else:
        nr_clase = read(nd).count('"cale":')
        if nr_clase < 30:
            detail.append(f"now-data.js acopera doar {nr_clase} clase")

    # 4. hub-ul nu mai are modulul scris de mana
    hub = read(os.path.join(ROOT, "hub", "index.html"))
    if re.search(r'class="module-badge">\s*MODUL', hub):
        detail.append("hub/index.html are inca modulul scris de mana in HTML")

    # 5. intervalele de pe paginile de clasa sunt sincrone cu structura anului
    r = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "sync_module_dates.py")],
                       capture_output=True, text=True)
    m = re.search(r"(\d+) intervale in (\d+) pagini", r.stdout or "")
    nesincrone = int(m.group(1)) if m else -1
    if nesincrone > 0:
        detail.append(f"{nesincrone} intervale de pe paginile de clasa nu sunt sincrone "
                      f"cu structura anului (ruleaza tools/sync_module_dates.py --apply)")
    elif nesincrone < 0:
        detail.append("nu pot masura sincronizarea intervalelor (sync_module_dates.py a esuat)")

    return (not detail), detail, {"an_folosit": etichete[-1], "clase_in_harta": nr_clase,
                                  "intervale_nesincrone": max(nesincrone, 0)}


def pas5_rutare():
    """Profilul e al doilea camp (nu id schimbat), ruta duce la clasa lui,
    si ecranul de intrare stie sa reia de unde a ramas."""
    us = read(os.path.join(ROOT, "assets", "js", "user-system.js"))
    idx = read(os.path.join(ROOT, "index.html"))
    nd = os.path.join(ROOT, "assets", "js", "now-data.js")
    detail = []

    if "TRACKS:" not in us or "gradeHasTrack" not in us:
        detail.append("user-system.js n-are profilul de liceu ca al doilea camp (TRACKS)")
    if "us-track-select" not in us:
        detail.append("selectorul de profil nu apare in fereastra de creare profil")
    if "function destinatie" not in idx or "content/liceu/' + profile.track" not in idx:
        detail.append("index.html nu compune ruta din (clasa + profil)")
    if "identity-resume" not in idx or "ultimaLectie" not in idx:
        detail.append("ecranul de intrare nu arata 'continua de unde ai ramas'")
    if not os.path.exists(nd) or '"lectii"' not in read(nd):
        detail.append("now-data.js n-are harta lessonId -> adresa lectiei "
                      "(fara ea, 'continua' n-are unde trimite)")

    # id-urile vechi TREBUIE sa ramana - altfel profilurile existente se rup
    ids_intacte = all(f"id: '{g}'" in us for g in ("cls9", "cls10", "cls11", "cls12"))
    if not ids_intacte:
        detail.append("ATENTIE: id-urile de clasa au fost SCHIMBATE - asta rupe "
                      "profilurile existente (elevul de a 12-a ajunge in hubul de gimnaziu)")
    return (not detail), detail


# ---------------------------------------------------------------- raport

def main():
    md = "--md" in sys.argv
    rows = []

    ok1, d1 = pas1_identitate()
    rows.append(("1. Identitatea in laborator ('tu esti?')", ok1, d1))

    ok2, d2, m2 = pas2_atomi_fara_intrebare()
    rows.append(("2. Zero atomi care se trec singuri cu 100", ok2, d2))

    ok3, d3, m3 = pas3_pas_cu_pas()
    rows.append(("3. Modul pas-cu-pas (un atom = un ecran)", ok3, d3))

    ok4, d4, m4 = pas4_date_moarte()
    rows.append(("4. Nimic despre 'acum' nu mai e scris de mana", ok4, d4))

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
    m2.pop("fisiere", None)
    print(json.dumps({"atomi": m2, "pas_cu_pas": m3, "acum": m4},
                     ensure_ascii=False, indent=2)[:1400])

    return 0 if gata == len(rows) else 1


if __name__ == "__main__":
    sys.exit(main())
