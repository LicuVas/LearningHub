# -*- coding: utf-8 -*-
"""B · R13-4 (caseta Font), Home/End în liste, asistentul cu tastele de acces, telefonul (tastatura de pe ecran prin CDP)."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *
from b1 import rul, arata, C

T = ('clic', 'forma:1/1')
B = ('clic', 'margine_forma:1/1')
R = {}
with Ham() as H:
    # R13-4: clic în textul casetei Font (stânga) față de săgeata ▾
    R['font_clic_text'] = rul(H, [T, B, ('clic', 'panglica:Home/Font/Font', 0.2, 0.5)], [], [('type', 'Ari'), ('k', 'Enter')])
    R['font_clic_text_home_end'] = rul(H, [T, B, ('clic', 'panglica:Home/Font/Font', 0.2, 0.5)], ['End', 'Home', 'ArrowDown', 'Enter'])
    R['font_clic_sageata'] = rul(H, [T, B, ('clic', 'meniu_derulant:Home/Font/Font')], ['ArrowDown', 'End', 'Home', 'a'], [('type', 'rial'), ('k', 'Enter')])
    R['font_sageata_esc'] = rul(H, [T, B, ('clic', 'meniu_derulant:Home/Font/Font')], ['Escape'], [('type', 'Q')])
    R['shapes_home_end'] = rul(H, [('clic', 'fila:Insert'), ('clic', 'meniu_derulant:Insert/Illustrations/Shapes')], ['End', 'Home', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'Escape'])
    R['culori_sageti'] = rul(H, [T, B, ('clic', 'meniu_derulant:Home/Font/Font Color')], ['ArrowDown', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'End', 'Enter'])
    # asistentul: un pas = Yellow din Shape Fill; drumul din taste
    STEA = [('clic', 'miniatura:2'), ('clic', 'forma:2/2'),
            ('js', "window.__as=LH.aplicatii.asistent('powerpoint',{pasi:[{tinta:'meniu:Yellow',indiciu:'Alege Yellow'}],dupaGreseli:2,dupaSecunde:300})")]
    R['asistent_taste'] = rul(H, STEA, ['Alt', 'h', 's', 'f', 'ArrowDown', 'ArrowDown', 'ArrowDown'])
    R['plecate'] = H.plecate
    pg = H.app('powerpoint', C)
    # câte indicii apar în asistent_taste se citesc separat (mai jos, pe o instanță nouă)
    pg.close()
    rez = {}
    pg = H.app('powerpoint', C)
    for p in STEA:
        if p[0] == 'clic': clic(pg, p[1])
        else: pg.evaluate(p[1]); pg.wait_for_timeout(80)
    ind = []
    for kk in ['Alt', 'h', 's', 'f', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp']:
        pg.keyboard.press(kk); pg.wait_for_timeout(120)
        ind.append([kk, pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-indiciu]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-pentru')))()")])
    rez['asistent_indicii'] = ind
    pg.close()
    # mouse, ca martor: clic pe Shape Fill ▾ apoi nimic
    pg = H.app('powerpoint', C)
    for p in STEA:
        if p[0] == 'clic': clic(pg, p[1])
        else: pg.evaluate(p[1]); pg.wait_for_timeout(80)
    clic(pg, 'meniu_derulant:Home/Drawing/Shape Fill'); pg.wait_for_timeout(150)
    rez['asistent_mouse_dupa_lista'] = pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-indiciu]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-pentru')))()")
    pg.close()
    R['asistent_extra'] = rez
scrie(R, 'b4_out.json')
arata({k: v for k, v in R.items() if k != 'asistent_extra'}, 'b4_out.txt')
print(json.dumps(R['asistent_extra'], ensure_ascii=False))

# ---- telefonul: 360 × 740, atingere, tastatura de pe ecran prin CDP
TEL = {}
with Ham(viewport=(360, 740), scale=2, mobil=True) as H:
    pg = H.app('powerpoint', C)
    cdp = pg.context.new_cdp_session(pg)

    def atinge(t):
        r = centru(pg, t)
        if not r: return None
        pg.touchscreen.tap(r[0], r[1]); pg.wait_for_timeout(200)
        return [round(x) for x in r]
    TEL['note_rect'] = atinge('zona_note')
    TEL['foc_dupa_note'] = pg.evaluate("(()=>{const a=document.activeElement;return {tag:a.tagName,cls:a.className,im:a.getAttribute('inputmode'),ro:a.readOnly,vis:getComputedStyle(a).visibility,disp:getComputedStyle(a).display,op:getComputedStyle(a).opacity}})()")
    ev(pg)
    cdp.send('Input.insertText', {'text': 'Ăla e cal'}); pg.wait_for_timeout(200)
    TEL['note_dupa_insert'] = S(pg, 'note_diapozitive')['note_diapozitive']
    TEL['ev_insert'] = ev(pg)
    cdp.send('Input.imeSetComposition', {'text': 'ș', 'selectionStart': 1, 'selectionEnd': 1}); pg.wait_for_timeout(120)
    cdp.send('Input.imeSetComposition', {'text': 'șa', 'selectionStart': 2, 'selectionEnd': 2}); pg.wait_for_timeout(120)
    TEL['note_in_compunere'] = S(pg, 'note_diapozitive')['note_diapozitive']
    cdp.send('Input.insertText', {'text': 'șah'}); pg.wait_for_timeout(200)
    TEL['note_dupa_compunere'] = S(pg, 'note_diapozitive')['note_diapozitive']
    TEL['ev_compunere'] = ev(pg)
    TEL['ecran_note'] = pg.evaluate("(()=>{const e=document.querySelector('[data-lh-tinta=\"zona_note\"]');return e?e.innerText:null})()")
    TEL['titlu_rect'] = atinge('forma:1/1')
    TEL['foc_dupa_titlu'] = foc(pg)
    cdp.send('Input.insertText', {'text': 'Ș'}); pg.wait_for_timeout(200)
    TEL['texte_dupa_titlu'] = S(pg, 'diapozitive')['diapozitive'][0].get('texte')
    TEL['erori'] = H.erori; TEL['plecate'] = H.plecate
scrie(TEL, 'b4_tel.json')
print(json.dumps(TEL, ensure_ascii=False)[:2500])
