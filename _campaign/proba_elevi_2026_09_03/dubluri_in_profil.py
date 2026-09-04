# -*- coding: utf-8 -*-
"""Aceeasi lectie scrisa de doua ori in ACELASI profil de liceu.

Test fara ambiguitate: daca doua fisiere diferite din acelasi profil au acelasi
titlu si aceiasi atomi, unul dintre ele ocupa slotul altui subiect - iar acel
subiect nu se mai preda nicaieri.
"""
import os, io, re, collections, difflib, html as _html

R = r"C:\00\Projects\LearningHub"
LICEU = os.path.join(R, "content", "liceu")


def viz(s):
    s = re.sub(r"\s+", " ", _html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()
    for a, b in (("\u0103", "a"), ("\u00e2", "a"), ("\u00ee", "i"), ("\u0219", "s"),
                 ("\u021b", "t"), ("\u015f", "s"), ("\u0163", "t"), ("\u2014", "-")):
        s = s.replace(a, b)
    return s.lower()


total = 0
for profil in sorted(os.listdir(LICEU)):
    d = os.path.join(LICEU, profil)
    if not os.path.isdir(d):
        continue
    lectii = []
    for dp, _, fns in os.walk(d):
        if ".backup" in dp.lower():
            continue
        for f in fns:
            if not f.endswith(".html") or f == "index.html":
                continue
            p = os.path.join(dp, f)
            s = io.open(p, encoding="utf-8", errors="replace").read()
            if "atomic-learning.js" not in s:
                continue
            h1 = re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S | re.I)
            atomi = [viz(a) for a in re.findall(r'<h3 class="atom-title"[^>]*>(.*?)</h3>', s, re.S | re.I)]
            lectii.append((os.path.relpath(p, d).replace(os.sep, "/"),
                           viz(h1.group(1)) if h1 else "", atomi))

    perechi = []
    for i in range(len(lectii)):
        for j in range(i + 1, len(lectii)):
            a, b = lectii[i], lectii[j]
            if not a[1] or not b[1]:
                continue
            st = difflib.SequenceMatcher(None, a[1], b[1]).ratio()
            at = difflib.SequenceMatcher(None, " ".join(a[2]), " ".join(b[2])).ratio() if a[2] and b[2] else 0
            if st > 0.85 or (st > 0.6 and at > 0.7):
                perechi.append((a[0], b[0], a[1], st, at))
    if perechi:
        print("== %s: %d perechi" % (profil, len(perechi)))
        for x, y, titlu, st, at in perechi:
            print("   %s" % titlu[:76])
            print("      %s" % x)
            print("      %s   (titlu %.0f%%, atomi %.0f%%)" % (y, st * 100, at * 100))
        print("")
        total += len(perechi)

print("total perechi de lectii duplicate in acelasi profil: %d" % total)
