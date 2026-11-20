# -*- coding: utf-8 -*-
"""Proba 4: KeyTips cu cursorul în text; drumurile m1-l05 (diapozitive), m1-l07 (tranziții/animații/expunere), tema; Format Background."""
import sys, json
sys.path.insert(0, __import__('os').path.dirname(__file__))
from h import Ham, st, ev, el, clic, nesimulat, scrie, centru

C3 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Clasa a VI-a']},
                      {'aspect': 'Title and Content', 'texte': ['Ce sunt', 'Munti de foc']},
                      {'aspect': 'Title and Content', 'texte': ['Lava', 'Roca topita']}], 'diapozitiv_activ': 1}
R = {}
ECRAN = """(()=>{const r=document.querySelector('[data-lh-aplicatie=powerpoint]');return {ind:(r.querySelector('[data-lh-eticheta^="View Indicator"]')||{}).textContent,
 mini:[...r.querySelectorAll('[data-lh-tinta=miniatura]')].map(m=>m.innerText.replace(/\\s+/g,' ').trim()),
 slide:[...r.querySelectorAll('.lh-ap-p-slide [data-lh-tinta=forma]')].map(m=>m.innerText.replace(/\\s+/g,' ').trim()),
 teme:[...new Set([...r.querySelectorAll('[data-lh-tinta=miniatura]')].map(m=>m.getAttribute('data-lh-tema')))],
 stele:r.querySelectorAll('.lh-ap-p-mini-stea').length}})()"""


def T(s):
    return [[d['aspect'][:12]] + d['texte'] + [d.get('tranzitie_cod'), d.get('animatii_cod')] for d in s['diapozitive']]


with Ham() as H:
    # 1. KeyTips cu cursorul în titlu: Alt, H, 1
    pg = H.app('powerpoint', C3)
    clic(pg, 'forma:1/1'); pg.keyboard.press('End')
    pg.keyboard.press('Alt'); pg.keyboard.press('h'); pg.keyboard.press('1'); pg.wait_for_timeout(80)
    s = st(pg)
    R['keytips_in_text'] = {'texte': s['diapozitive'][0]['texte'], 'bold': s['formatare_text'], 'ev': ev(pg)[-3:]}
    pg.keyboard.press('Alt'); pg.keyboard.press('h'); pg.keyboard.press('i'); pg.wait_for_timeout(80)
    s = st(pg)
    R['keytips_alt_h_i'] = {'n': len(s['diapozitive']), 'texte': s['diapozitive'][0]['texte'], 'ev': ev(pg)[-3:]}
    pg.close()

    # 2. m1-l05: New Slide, Duplicate (meniu), Delete Slide (meniu), Ctrl+C / Ctrl+V în miniaturi, Ctrl+X, tragere, Ctrl+Z
    pg = H.app('powerpoint', C3)
    pas = []
    clic(pg, 'miniatura:2'); pg.keyboard.press('Control+c'); pg.keyboard.press('Control+v'); pg.wait_for_timeout(50)
    pas.append(['ctrl_c_v pe 2', T(st(pg)), st(pg)['diapozitiv_activ'], pg.evaluate(ECRAN)['ind']])
    pg.keyboard.press('Control+x'); pas.append(['ctrl_x', T(st(pg)), st(pg)['diapozitiv_activ']])
    clic(pg, 'miniatura:1'); pg.keyboard.press('Control+v'); pas.append(['ctrl_v dupa 1', T(st(pg)), st(pg)['diapozitiv_activ']])
    clic(pg, 'miniatura:3', button='right'); clic(pg, 'meniu:Delete Slide'); pas.append(['meniu Delete Slide pe 3', T(st(pg)), st(pg)['diapozitiv_activ']])
    # tragere miniatura 1 sub ultima
    a = centru(pg, 'miniatura:1'); b = centru(pg, 'miniatura:3')
    pg.mouse.move(a[0], a[1]); pg.mouse.down(); pg.mouse.move(a[0], a[1] + 20, steps=4); pg.mouse.move(b[0], b[1] + b[3] * 0.45, steps=8); pg.mouse.up(); pg.wait_for_timeout(80)
    pas.append(['tragere 1 dupa 3', T(st(pg)), st(pg)['diapozitiv_activ'], pg.evaluate(ECRAN)])
    for i in range(5):
        pg.keyboard.press('Control+z'); pas.append(['ctrl_z', T(st(pg)), st(pg)['diapozitiv_activ']])
    R['m1_l05'] = {'pasi': pas, 'ev': [e['a'] + '@' + str(e['t']) for e in ev(pg)]}
    pg.close()

    # 3. m1-l07: Transitions Fade pe 1, Apply To All, Animations Fly In pe titlul 2, apoi pe conținut 2, Animation Pane, F5, Esc
    pg = H.app('powerpoint', C3)
    pas = []
    clic(pg, 'mso:TabTransitions'); clic(pg, 'meniu:Fade'); pas.append(['fade pe 1', T(st(pg)), st(pg)['tranzitie_galerie'], pg.evaluate(ECRAN)['stele']])
    clic(pg, 'mso:SlideTransitionApplyToAll'); pas.append(['apply to all', T(st(pg)), pg.evaluate(ECRAN)['stele']])
    clic(pg, 'miniatura:2'); clic(pg, 'mso:TabAnimations')
    gal = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','meniu:Fly In');return e?[e.getAttribute('aria-disabled'),e.className]:null})()")
    clic(pg, 'meniu:Fly In'); pas.append(['fly in fara forma', T(st(pg)), gal, ev(pg)[-1:]])
    clic(pg, 'forma:2/1'); clic(pg, 'meniu:Fly In'); pas.append(['fly in titlu (cursor in text)', T(st(pg)), st(pg)['animatie_galerie']])
    clic(pg, 'forma:2/2'); pg.wait_for_timeout(600); clic(pg, 'meniu:Fly In'); pas.append(['fly in continut', T(st(pg)), st(pg)['animatie_galerie']])
    clic(pg, 'mso:AnimationCustom'); pg.wait_for_timeout(80)
    pane = pg.evaluate("(()=>{const p=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"panou.AnimationCustom\"]');return p?[...p.querySelectorAll('.lh-ap-p-anim-rand')].map(x=>x.textContent):null})()")
    pas.append(['animation pane', pane])
    clic(pg, 'forma:2/1'); pg.wait_for_timeout(600); clic(pg, 'meniu:Wipe'); pas.append(['wipe pe titlu', T(st(pg)), pg.evaluate("(()=>{const p=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"panou.AnimationCustom\"]');return p?[...p.querySelectorAll('.lh-ap-p-anim-rand')].map(x=>x.textContent):null})()")])
    clic(pg, 'miniatura:1')
    pg.keyboard.press('F5'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); e5 = st(pg)['expunere']
    pg.keyboard.press('Escape'); pas.append(['F5 de pe 1, -> ->, Esc', e5, st(pg)['diapozitiv_activ'], st(pg)['expunere']])
    # From Beginning din Acces rapid; clic în expunere până la capăt
    clic(pg, 'acces_rapid:From Beginning'); n = 0
    while st(pg)['expunere'] and n < 8:
        pg.mouse.click(600, 400); n += 1
    pas.append(['From Beginning + clicuri pana iese', n, st(pg)['expunere']])
    R['m1_l07'] = {'pasi': pas, 'ev': [e['g'] + '/' + e['a'] + '@' + str(e['t']) for e in ev(pg)][-30:]}
    pg.close()

    # 4. Tema: Design › Ion pe toate; Ctrl+Z
    pg = H.app('powerpoint', C3)
    clic(pg, 'mso:TabDesign'); clic(pg, 'meniu:Ion'); e1 = pg.evaluate(ECRAN)
    s1 = st(pg)['tema']; pg.keyboard.press('Control+z'); s2 = st(pg)['tema']; e2 = pg.evaluate(ECRAN)
    R['tema'] = {'dupa': [s1, e1['teme']], 'ctrlz': [s2, e2['teme']], 'ev': ev(pg)[-3:]}
    # 5. Format Background: clic dreapta pe un loc gol al diapozitivului
    r = pg.evaluate("(()=>{const e=document.querySelector('[data-lh-aplicatie=powerpoint] .lh-ap-p-fundal');const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
    pg.mouse.click(r[0] + 8, r[1] + r[3] - 8, button='right'); pg.wait_for_timeout(80)
    m = pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] .lh-ap-p-meniu [data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta'))")
    clic(pg, 'meniu:Format Background...'); pg.wait_for_timeout(80)
    tinte = pg.evaluate("(()=>{const p=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"panou.LaunchFormatBackground\"]');if(!p)return null;return [...p.querySelectorAll('[data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta'))})()")
    res = []
    for t in (tinte or [])[:14]:
        if clic(pg, t):
            e = ev(pg)
            res.append([t, e[-1]['a'] if e else None])
    R['format_bg'] = {'meniu_fundal': m, 'tinte_panou': tinte, 'clicuri': res, 'stare_tema': st(pg)['tema']}
    pg.close()
    R['erori'] = H.erori
scrie(R, 'p4_drumuri.json')
print('gata')
