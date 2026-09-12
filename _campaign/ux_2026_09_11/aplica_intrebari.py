#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Pune intrebarile scrise de agenti in lectii — DETERMINIST.

De ce exista: ultima campanie in care agentii au editat direct HTML-ul a
introdus defecte noi in 43% din lectiile atinse (JOURNAL.md). Deci agentii
scriu DOAR date (un JSON cu intrebarea), iar inserarea in pagina o face codul
asta, o singura data, la fel peste tot, cu verificare inainte si dupa.

Ce face pentru fiecare atom tintit:
  1. adauga atributul data-quiz='[...]' pe <div class="atom" id="...">
  2. pune <div class="atom-quiz"></div> la finalul continutului atomului
  3. verifica dupa scriere ca JSON-ul se parseaza si ca regulile R1 trec

Intrare: un fisier JSON cu lista de
  {"fisier": "content/...", "atom_id": "atom-7", "quiz": [ {question, options, correct, hint} ]}

Rulare:
  python .../aplica_intrebari.py <fisier.json>            # uscat, doar verifica
  python .../aplica_intrebari.py <fisier.json> --apply    # scrie
"""
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
TAG = re.compile(r'<div[^>]*\sclass="([^"]*)"[^>]*>', re.I)


def bucati(html):
    st = [m.start() for m in TAG.finditer(html) if "atom" in m.group(1).split()]
    return [(s, (st[i + 1] if i + 1 < len(st) else len(html)))
            for i, s in enumerate(st)]


def text(x):
    t = re.sub(r"(?s)<[^>]+>", " ", x)
    return re.sub(r"\s+", " ", t).strip()


# ------------------------------------------------------------------ reguli R1
def verifica_item(q, idx):
    """Regulile din knowledge/learninghub_calitate/00_INDEX.md. Intoarce lista de probleme."""
    p = []
    if not isinstance(q, dict):
        return ["item %d nu e obiect" % idx]
    for k in ("question", "options", "correct", "hint"):
        if k not in q:
            p.append("item %d: lipseste '%s'" % (idx, k))
    if p:
        return p
    opts = q["options"]
    if not isinstance(opts, list) or len(opts) < 3:
        p.append("item %d: are %s variante (minim 3)" % (idx, len(opts) if isinstance(opts, list) else "?"))
        return p
    corect = str(q["correct"]).strip().lower()
    # R1.5: cheia e O litera
    if len(corect) != 1 or corect not in "abcd"[:len(opts)]:
        p.append("item %d: cheia '%s' nu e o singura litera valida" % (idx, q["correct"]))
        return p
    ci = "abcd".index(corect)
    # R1.1: varianta corecta nu are voie sa fie mult mai lunga
    lung = [len(str(o)) for o in opts]
    distractori = [lung[i] for i in range(len(lung)) if i != ci]
    medie = sum(distractori) / len(distractori)
    if medie and lung[ci] > 1.2 * medie:
        p.append("item %d: varianta corecta e cu %d%% mai lunga decat media distractorilor (R1.1)"
                 % (idx, round(100 * (lung[ci] / medie - 1))))
    # R1.4-bis: indiciul nu numeste litera
    if re.search(r"(?i)\b(varianta|optiunea|opțiunea|raspunsul corect este)\s*[a-d]\b", str(q["hint"])):
        p.append("item %d: indiciul numeste litera variantei (R1.4-bis)" % idx)
    # variante duplicate
    if len(set(str(o).strip().lower() for o in opts)) != len(opts):
        p.append("item %d: are variante identice" % idx)
    if len(str(q["question"]).strip()) < 15:
        p.append("item %d: intrebarea e prea scurta" % idx)
    return p


def aplica(intrare, scrie):
    with open(intrare, encoding="utf-8") as fh:
        cereri = json.load(fh)

    ok = 0
    sarite = 0
    probleme = []
    pe_fisier = {}
    for c in cereri:
        pe_fisier.setdefault(c["fisier"], []).append(c)

    for rel, lista in sorted(pe_fisier.items()):
        p = os.path.join(ROOT, rel.replace("/", os.sep))
        if not os.path.exists(p):
            probleme.append("%s: fisierul nu exista" % rel)
            continue
        with open(p, encoding="utf-8", errors="replace") as fh:
            h = fh.read()
        original = h

        for c in lista:
            aid = c["atom_id"]
            quiz = c["quiz"]

            rele = []
            for i, q in enumerate(quiz):
                rele += verifica_item(q, i + 1)
            if rele:
                probleme.append("%s/%s: %s" % (rel, aid, "; ".join(rele)))
                sarite += 1
                continue

            # gaseste atomul dupa id
            m = None
            for s, e in bucati(h):
                cap = h[s:min(e, s + 400)]
                mm = re.search(r'\b(?:data-atom-id|id)="([^"]+)"', cap)
                if mm and mm.group(1) == aid:
                    m = (s, e)
                    break
            if not m:
                probleme.append("%s: nu gasesc atomul '%s'" % (rel, aid))
                sarite += 1
                continue
            s, e = m
            chunk = h[s:e]
            if "atom-quiz" in chunk:
                sarite += 1
                continue

            # 1) atributul data-quiz pe tagul de deschidere
            tag_end = h.index(">", s)
            tag = h[s:tag_end + 1]
            if "data-quiz" in tag:
                probleme.append("%s/%s: are deja data-quiz dar n-are container" % (rel, aid))
                sarite += 1
                continue
            payload = json.dumps(quiz, ensure_ascii=False)
            if "'" in payload:
                # atributul e delimitat cu apostrof; un apostrof in text ar inchide atributul
                payload = payload.replace("'", "’")
            tag_nou = tag[:-1] + " data-quiz='" + payload + "'>"

            # 2) containerul, chiar inainte de ultimul </div> al atomului
            corp = h[tag_end + 1:e]
            poz = corp.rfind("</div>")
            if poz < 0:
                probleme.append("%s/%s: nu gasesc unde sa pun containerul" % (rel, aid))
                sarite += 1
                continue
            corp_nou = corp[:poz] + '<div class="atom-quiz"></div>\n            ' + corp[poz:]

            h = h[:s] + tag_nou + corp_nou + h[e:]
            ok += 1

        if h != original and scrie:
            with open(p, "w", encoding="utf-8", newline="") as fh:
                fh.write(h)
            # verificare DUPA scriere: JSON-ul chiar se parseaza din fisier
            with open(p, encoding="utf-8", errors="replace") as fh:
                dupa = fh.read()
            for mm in re.finditer(r"data-quiz='([^']*)'", dupa):
                try:
                    json.loads(mm.group(1))
                except Exception as ex:
                    probleme.append("%s: data-quiz nu se parseaza DUPA scriere (%s)" % (rel, ex))

    print("intrebari puse : %d" % ok)
    print("sarite         : %d" % sarite)
    if probleme:
        print("PROBLEME (%d):" % len(probleme))
        for x in probleme[:40]:
            print("   - " + x)
    if not scrie:
        print("RULARE USCATA - n-am scris nimic (adauga --apply)")
    return 1 if probleme else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    sys.exit(aplica(sys.argv[1], "--apply" in sys.argv))
