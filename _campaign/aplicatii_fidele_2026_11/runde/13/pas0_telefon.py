# -*- coding: utf-8 -*-
"""Pasul 0: căderea „MINOR telefon 360: ce se vede e la fel ca la 552ac0c5” din runde/12/proba_grav.py.
Rulează dintr-o copie în %TEMP% a probei 12 (argv[1] = dosarul copiei). Compară cele 4 capturi 360 px (552ac0c5 vs worktree)
și încă o dată cu zona de note închisă în worktree (aceleași 4 capturi, după comutarea notelor). Scrie bbox-ul pixelilor diferiți."""
import io, json, shutil, sys
from pathlib import Path
sys.path.insert(0, sys.argv[1])
import proba_grav as P   # noqa: E402
from h import Ham, centru  # noqa: E402
from PIL import Image, ImageChops  # noqa: E402


def poze(H, rad, fara_note):
    out = []
    with P.Tel(H, rad) as T:
        pg = T.app(P.C_TEL)
        if fara_note:
            pg.evaluate("()=>{const e=LH.aplicatii.element('powerpoint','bara_stare:Notes');e.click()}")
            pg.wait_for_timeout(200)
        snap = lambda: out.append(pg.screenshot(animations='disabled', caret='hide'))
        snap()
        c = centru(pg, 'forma:1/1'); P.tap(pg, c[0], c[1]); snap()
        pg.evaluate("()=>{const e=LH.aplicatii.element('powerpoint','lansator:Home/Font');e.querySelector('svg').scrollIntoView({inline:'center',block:'nearest'})}"); pg.wait_for_timeout(100); snap()
        P.taste(pg, 'Escape'); P.taste(pg, 'Alt', 'h'); snap()
        note = pg.evaluate("()=>LH.aplicatii.stare('powerpoint').note_diapozitive")
        font = pg.evaluate("()=>{const e=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-tip=ComboBox][data-lh-eticheta=Font]');return e?e.textContent.trim()+' | '+(e.querySelector('input')||{}).value:null}")
    return out, font


def bboxuri(a, b):
    r = []
    for x, y in zip(a, b):
        A, B = Image.open(io.BytesIO(x)).convert('RGB'), Image.open(io.BytesIO(y)).convert('RGB')
        if A.size != B.size:
            r.append({'marimi': [A.size, B.size]}); continue
        d = ImageChops.difference(A, B)
        bb = d.getbbox()
        n = sum(1 for p in d.getdata() if p != (0, 0, 0))
        # benzi orizontale: unde sunt rândurile cu diferențe (în px css, /2)
        rows = []
        if bb:
            g = d.convert('L').point(lambda v: 255 if v else 0)
            w, h = g.size
            px = g.load()
            cur = None
            for yy in range(h):
                any_ = any(px[xx, yy] for xx in range(0, w, 2))
                if any_ and cur is None: cur = yy
                if not any_ and cur is not None: rows.append([cur // 2, yy // 2]); cur = None
            if cur is not None: rows.append([cur // 2, h // 2])
        r.append({'bbox_css': [v // 2 for v in bb] if bb else None, 'pixeli': n, 'benzi_y_css': rows[:12]})
    return r


tmp = P.arhiva(P.REF_VIZUAL)
try:
    with Ham() as H:
        a, fa = poze(H, tmp, False)
        b, fb = poze(H, P.WT, False)
        c, fc = poze(H, P.WT, True)
    rez = {'font_caseta': {'552ac0c5': fa, 'wt': fb, 'wt_fara_note': fc},
           'cu_note_deschise': bboxuri(a, b), 'cu_note_inchise': bboxuri(a, c)}
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    for nume, L in (('ref', a), ('wt', b), ('wt_fara_note', c)):
        for i, x in enumerate(L):
            (out / f'{nume}_{i}.png').write_bytes(x)
    print(json.dumps(rez, ensure_ascii=False, indent=1))
finally:
    shutil.rmtree(tmp, ignore_errors=True)
