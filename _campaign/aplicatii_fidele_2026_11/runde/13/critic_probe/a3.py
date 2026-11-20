# -*- coding: utf-8 -*-
"""A3 · Format Background și Animation Pane pe fereastra mică (1093×526 css, 125 %) și pe telefon (360×740, 390×844)."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *

C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']}, {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1}
R = {}


def lovit(pg, t):
    return pg.evaluate("""t=>{const e=LH.aplicatii.element('powerpoint',t);if(!e)return null;const r=e.getBoundingClientRect();
      const x=r.x+r.width/2,y=r.y+r.height/2;const h=document.elementFromPoint(x,y);
      return {r:[r.x,r.y,r.width,r.height].map(Math.round),vp:[innerWidth,innerHeight],lovit:!!(h&&(h===e||e.contains(h)))}}""", t)


def atinge(pg, t, mobil):
    r = pg.evaluate("t=>{const e=LH.aplicatii.element('powerpoint',t);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", t)
    if not r: return False
    if mobil: pg.touchscreen.tap(r[0], r[1])
    else: pg.mouse.click(r[0], r[1])
    pg.wait_for_timeout(150)
    return True


def gliseaza(pg, x, y0, y1):
    c = pg.context.new_cdp_session(pg)
    c.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y0}]})
    for i in range(1, 9):
        c.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y0 + (y1 - y0) * i / 8}]})
        pg.wait_for_timeout(16)
    c.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    pg.wait_for_timeout(300)


def fb(H, mobil, nume):
    pg = H.app('powerpoint', C)
    out = {}
    try:
        r = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','diapozitiv');const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]})()")
        pg.mouse.click(r[0], r[1], button='right'); pg.wait_for_timeout(200)
        out['meniu'] = atinge(pg, 'meniu:Format Background...', mobil)
        out['solid'] = atinge(pg, 'fereastra:Solid fill', mobil)
        out['apply_inainte'] = lovit(pg, 'fereastra:Apply to All')
        out['color_inainte'] = lovit(pg, 'fereastra:Color')
        # gest de derulare peste panou
        p = pg.evaluate("(()=>{const e=document.querySelector('[data-lh-suprafata^=\"panou.LaunchFormatBackground\"]');if(!e)return null;const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/3,b.x,b.y,b.width,b.height]})()")
        out['panou'] = p
        if p:
            if mobil: gliseaza(pg, p[0], p[1] + 80, p[1] - 80)
            else:
                pg.mouse.move(p[0], p[1]);
                for _ in range(4): pg.mouse.wheel(0, 120); pg.wait_for_timeout(80)
        out['apply_dupa'] = lovit(pg, 'fereastra:Apply to All')
        out['color_dupa'] = lovit(pg, 'fereastra:Color')
        out['reset_dupa'] = lovit(pg, 'fereastra:Reset Background')
        atinge(pg, 'fereastra:Color', mobil); out['lista_color'] = men(pg)
        atinge(pg, 'meniu:Light Green', mobil)
        out['apply_tap'] = atinge(pg, 'fereastra:Apply to All', mobil)
        out['fundal'] = S(pg, 'fundal_diapozitive')['fundal_diapozitive']
        out['ev'] = [(e['g'], e['a'], e['t']) for e in ev(pg)][-3:]
        pg.screenshot(path=os.path.join(os.path.dirname(__file__), 'a3_' + nume + '.png'))
    except Exception:
        out['eroare'] = traceback.format_exc()[-400:]
    pg.close()
    return out


def ap(H, mobil):
    pg = H.app('powerpoint', C)
    out = {}
    try:
        atinge(pg, 'forma:1/1', mobil); atinge(pg, 'margine_forma:1/1', mobil); atinge(pg, 'fila:Animations', mobil); atinge(pg, 'meniu:Fade', mobil)
        atinge(pg, 'forma:1/2', mobil); atinge(pg, 'margine_forma:1/2', mobil); atinge(pg, 'meniu:Fly In', mobil)
        t = pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-tinta]')].map(x=>x.getAttribute('data-lh-tinta')).filter(x=>/Animation Pane/.test(x)))()")
        out['tinte_ap'] = t
        if t: atinge(pg, t[0], mobil)
        rows = pg.evaluate("(()=>{const p=document.querySelector('[data-lh-suprafata^=\"panou.AnimationCustom\"]');if(!p)return null;return [...p.querySelectorAll('[data-lh-tinta^=\"fereastra:\"]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-tinta'))})()")
        out['randuri'] = [r for r in (rows or []) if 'Fly In' in r or 'Fade' in r]
        if out['randuri']:
            out['rand2'] = lovit(pg, out['randuri'][-1]); atinge(pg, out['randuri'][-1], mobil)
        out['move_up'] = lovit(pg, 'fereastra:Move Up')
        atinge(pg, 'fereastra:Move Up', mobil)
        out['ordine'] = S(pg, 'ordine_animatii')['ordine_animatii']
    except Exception:
        out['eroare'] = traceback.format_exc()[-400:]
    pg.close()
    return out


with Ham(viewport=(1093, 526), scale=1.25) as H:
    R['mica_fb'] = fb(H, False, 'mica')
    R['mica_ap'] = ap(H, False)
    R['plecate_mica'] = H.plecate
for w, h in [(360, 740), (390, 844)]:
    with Ham(viewport=(w, h), scale=2, mobil=True) as H:
        R['tel%d_fb' % w] = fb(H, True, 'tel%d' % w)
        R['tel%d_ap' % w] = ap(H, True)
        R['plecate_%d' % w] = H.plecate
scrie(R, 'a3_out.json')
for k, v in R.items():
    print('##', k, json.dumps(v, ensure_ascii=False)[:1100])
