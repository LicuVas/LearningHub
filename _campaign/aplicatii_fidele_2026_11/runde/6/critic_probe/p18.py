import sys, json; sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
from h import *
s = Sesiune(375, 667, mobil=True)
for app in ("word", "excel"):
    s.deschide(app)
    r = s.rect('[data-lh-tinta]')
    vis = [x for x in r if x[0] < 375 and x[0]+x[2] > 0 and x[1] < 667 and x[2] > 0]
    mici = [x for x in vis if min(x[2], x[3]) < 32 and not (x[4] in ('',) )]
    cel = [x for x in mici if s.ev("([x,y])=>{const e=document.elementFromPoint(x,y);return e&&e.closest('[data-lh-tinta]')?e.closest('[data-lh-tinta]').getAttribute('data-lh-tinta'):''}", [x[0]+x[2]/2, x[1]+x[3]/2]) in ('celula',)]
    print(app, "tinte vizibile", len(vis), "sub 32px", len(mici), "din care celule", len(cel), "| exemple non-celula:", [x for x in mici if x not in cel][:6])
s.gata()
