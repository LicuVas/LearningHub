# -*- coding: utf-8 -*-
"""Cele 21 de sloturi de lectie care exista in mai multe profiluri de liceu,
cu ce preda fiecare profil. Fara prag, fara scor - se citeste si se vede.
"""
import os, io, re, collections, html as _html

R = r"C:\00\Projects\LearningHub"
LICEU = os.path.join(R, "content", "liceu")


def viz(s):
    s = re.sub(r"\s+", " ", _html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()
    for a, b in (("\u0103", "a"), ("\u00e2", "a"), ("\u00ee", "i"), ("\u0219", "s"),
                 ("\u021b", "t"), ("\u015f", "s"), ("\u0163", "t"), ("\u2014", "-")):
        s = s.replace(a, b)
    return s


sloturi = collections.defaultdict(list)
for profil in sorted(os.listdir(LICEU)):
    d = os.path.join(LICEU, profil)
    if not os.path.isdir(d):
        continue
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
            sloturi[os.path.relpath(p, d).replace(os.sep, "/")].append(
                (profil, viz(h1.group(1)) if h1 else "(fara h1)"))

comune = {k: v for k, v in sloturi.items() if len(v) >= 3}
print("sloturi prezente in >=3 profiluri: %d" % len(comune))
print("")
for slot in sorted(comune):
    print("== %s" % slot)
    for profil, h1 in sorted(comune[slot]):
        print("     %-12s %s" % (profil, h1[:78]))
    print("")
