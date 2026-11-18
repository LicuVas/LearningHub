# -*- coding: utf-8 -*-
"""Înlocuiește în fișierele criticului orice cale care conține numele utilizatorului Windows cu %TEMP% / %USERPROFILE%."""
import os, sys, glob
D = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe"
prof = os.environ.get('USERPROFILE', '')
tmp = os.environ.get('TEMP', '')
variante = []
for baza, inloc in ((tmp, '%TEMP%'), (prof, '%USERPROFILE%')):
    if baza:
        for v in (baza, baza.replace('\\', '\\\\'), baza.replace('\\', '/')):
            variante.append((v, inloc))
for f in glob.glob(os.path.join(D, '*')):
    if not os.path.isfile(f) or f.endswith('.png'):
        continue
    try:
        t = open(f, encoding='utf-8').read()
    except Exception:
        continue
    n = t
    for v, inloc in variante:
        n = n.replace(v, inloc)
    if n != t:
        open(f, 'w', encoding='utf-8').write(n)
        print('curățat', os.path.basename(f))
rest = [os.path.basename(f) for f in glob.glob(os.path.join(D, '*')) if os.path.isfile(f) and not f.endswith('.png')
        and os.path.basename(prof).lower() in open(f, encoding='utf-8', errors='ignore').read().lower()]
print('fisiere care mai conțin numele utilizatorului:', rest)
