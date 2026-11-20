# -*- coding: utf-8 -*-
"""Fundalul pe ecran (pixelii capturii) după Background Styles › Style 6 și după Ctrl+Z; elementul de sub un punct gol."""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from k import *
from PIL import Image
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']}, {'aspect': 'Title Only', 'texte': ['Soarele']}], 'diapozitiv_activ': 1}
R = {}
PCT = "(()=>{const e=LH.aplicatii.element('powerpoint','forma:1/2');const b=e.getBoundingClientRect();const x=b.x+8,y=b.y+b.height+40;const h=document.elementFromPoint(x,y);return [x,y,h?h.className:null,h?getComputedStyle(h).backgroundColor:null,h?getComputedStyle(h).backgroundImage.slice(0,60):null]})()"
def pix(pg, nume):
    p = pg.evaluate(PCT); f = os.path.join(os.path.dirname(__file__), nume)
    pg.screenshot(path=f); im = Image.open(f).convert('RGB'); v = im.getpixel((int(p[0]), int(p[1]))); os.remove(f)
    return {'punct': p, 'pixel': v}
with Ham() as H:
    pg = H.app('powerpoint', C)
    R['inainte'] = pix(pg, '_t0.png')
    clic(pg, 'fila:Design'); clic(pg, 'meniu_derulant:Design/Customize/Background Styles'); clic(pg, 'meniu:Style 6'); pg.mouse.move(5, 700); pg.wait_for_timeout(300)
    R['style6'] = pix(pg, '_t1.png'); R['st'] = S(pg, 'fundal_diapozitive')
    taste(pg, 'Control+z'); pg.wait_for_timeout(200); R['z'] = pix(pg, '_t2.png')
    R['plecate'] = H.plecate
scrie(R, 'b6_out.json'); print(json.dumps(R, ensure_ascii=False))
