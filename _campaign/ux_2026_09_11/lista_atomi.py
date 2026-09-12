#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Lista EXACTA a atomilor fara intrebare: fisier, al catelea atom, titlul lui,
cate cuvinte are si daca e ultimul din lectie.

Scrie _campaign/ux_2026_09_11/atomi_fara_intrebare.json — de acolo isi iau
agentii loturile, ca sa nu care tot situl in context.

Rulare: python C:/00/Projects/LearningHub/_campaign/ux_2026_09_11/lista_atomi.py
"""
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CONTENT = os.path.join(ROOT, "content")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "atomi_fara_intrebare.json")
SKIP = {".backup-before-practica", "node_modules", "v2_output", "quizuri", "_tests"}

TAG = re.compile(r'<div[^>]*\sclass="([^"]*)"[^>]*>', re.I)


def bucati(html):
    st = [m.start() for m in TAG.finditer(html) if "atom" in m.group(1).split()]
    return [(s, html[s:(st[i + 1] if i + 1 < len(st) else len(html))])
            for i, s in enumerate(st)]


def text(x):
    t = re.sub(r"(?is)<(script|style).*?</\1>", " ", x)
    t = re.sub(r"(?s)<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", t).strip()


def titlu_atom(chunk):
    m = re.search(r"(?is)<h[23][^>]*>(.*?)</h[23]>", chunk)
    if m:
        return text(m.group(1))[:110]
    return text(chunk)[:80]


def main():
    out = []
    for dp, dn, fn in os.walk(CONTENT):
        dn[:] = [d for d in dn if d not in SKIP]
        for f in sorted(fn):
            if not (f.startswith("lectia") and f.endswith(".html")):
                continue
            p = os.path.join(dp, f)
            with open(p, encoding="utf-8", errors="replace") as fh:
                h = fh.read()
            A = bucati(h)
            if not A:
                continue
            lid = None
            m = re.search(r"""AtomicLearning\.init\(\s*['"]([^'"]+)['"]""", h)
            if m:
                lid = m.group(1)
            titlu_lectie = None
            m = re.search(r"(?is)<h1[^>]*>(.*?)</h1>", h)
            if m:
                titlu_lectie = text(m.group(1))[:120]
            for i, (poz, chunk) in enumerate(A):
                if "atom-quiz" in chunk:
                    continue
                aid = None
                mm = re.search(r'\b(?:data-atom-id|id)="([^"]+)"', chunk[:400])
                if mm:
                    aid = mm.group(1)
                out.append({
                    "fisier": os.path.relpath(p, ROOT).replace("\\", "/"),
                    "lesson_id": lid,
                    "titlu_lectie": titlu_lectie,
                    "atom_index": i + 1,
                    "atomi_total": len(A),
                    "ultimul": i == len(A) - 1,
                    "atom_id": aid,
                    "titlu_atom": titlu_atom(chunk),
                    "cuvinte": len(text(chunk).split()),
                })

    with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)

    fisiere = sorted(set(x["fisier"] for x in out))
    print("atomi fara intrebare : %d" % len(out))
    print("lectii atinse        : %d" % len(fisiere))
    print("dintre ei ULTIMUL din lectie: %d (%d%%)" %
          (sum(1 for x in out if x["ultimul"]),
           100 * sum(1 for x in out if x["ultimul"]) // max(len(out), 1)))
    print("fara atom_id (nu pot fi tintiti): %d" % sum(1 for x in out if not x["atom_id"]))
    print("scris: %s" % os.path.relpath(OUT, ROOT).replace(os.sep, "/"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
