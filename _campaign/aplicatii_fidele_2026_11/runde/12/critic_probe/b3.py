# -*- coding: utf-8 -*-
"""B: Format Background pe fereastra mica si pe telefon: se poate AJUNGE la Apply to All cu un gest de om (rotita / glisare), fara scrollIntoView?"""
import json, sys
sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe')
from h import Ham, st, ev, centru
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe/'
rez = {}
VULC = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}, {"aspect": "Title and Content", "texte": ["B"]}], "diapozitiv_activ": 1}
INFO = """(t)=>{const e=LH.aplicatii.element('powerpoint',t)||[...document.querySelectorAll('[data-lh-tinta="fereastra"]')].find(x=>x.getAttribute('data-lh-id')===t.split(':')[1]);
 if(!e)return null;const r=e.getBoundingClientRect();const cx=r.x+r.width/2,cy=r.y+r.height/2;const h=document.elementFromPoint(cx,cy);
 const lant=[];let p=e.parentElement;while(p&&p!==document.documentElement){const cs=getComputedStyle(p);if(cs.overflowX!=='visible'||cs.overflowY!=='visible'||p.scrollTop||p.scrollLeft)lant.push([p.className.slice(0,40)||p.tagName,cs.overflowX,cs.overflowY,p.scrollHeight,p.clientHeight,p.scrollTop,Math.round(p.getBoundingClientRect().bottom)]);p=p.parentElement}
 return {rect:[r.x,r.y,r.width,r.height].map(Math.round),vh:innerHeight,vw:innerWidth,lovit:h?(h===e||e.contains(h)):null,lovit_ce:h?(h.className||h.tagName).toString().slice(0,40):null,lant,doc:[document.scrollingElement.scrollHeight,innerHeight,scrollY]}}"""


def deschide_fb(pg):
    c = centru(pg, 'diapozitiv'); pg.mouse.click(c[0], c[1], button='right'); pg.wait_for_timeout(200)
    r = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','meniu:Format Background...');if(!e)return null;const q=e.getBoundingClientRect();return [q.x+q.width/2,q.y+q.height/2,q.bottom<=innerHeight]})()")
    if r:
        pg.mouse.click(r[0], r[1]); pg.wait_for_timeout(250)
    return r


for nume, vp, sc, mobil in [('mica', (1093, 526), 1.25, False), ('tel360', (360, 740), 2, True), ('tel390', (390, 844), 3, True)]:
    o = {}
    with Ham(viewport=vp, scale=sc, mobil=mobil) as H:
        pg = H.app('powerpoint', VULC)
        o['meniu_fb'] = deschide_fb(pg)
        o['solid'] = pg.evaluate(INFO, 'fereastra:Solid fill')
        o['apply_inainte'] = pg.evaluate(INFO, 'fereastra:Apply to All')
        # gestul omului: rotita (laptop) sau glisare (telefon) peste panou
        p = pg.evaluate("(()=>{const e=document.querySelector('.lh-ap-p-panou');const r=e.getBoundingClientRect();return [r.x+r.width/2,Math.min(r.y+r.height/2,innerHeight-40)]})()")
        if mobil:
            cdp = pg.context.new_cdp_session(pg)
            for _ in range(3):
                cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': p[0], 'y': p[1]}]})
                for i in range(1, 11):
                    cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': p[0], 'y': p[1] - 30 * i}]})
                cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
                pg.wait_for_timeout(300)
        else:
            pg.mouse.move(p[0], p[1])
            for _ in range(6):
                pg.mouse.wheel(0, 200); pg.wait_for_timeout(120)
        pg.wait_for_timeout(300)
        o['apply_dupa_gest'] = pg.evaluate(INFO, 'fereastra:Apply to All')
        a = o['apply_dupa_gest']
        if a and a['lovit'] and a['rect'][1] + a['rect'][3] <= a['vh']:
            x, y = a['rect'][0] + a['rect'][2] / 2, a['rect'][1] + a['rect'][3] / 2
            if mobil:
                pg.touchscreen.tap(x, y)
            else:
                pg.mouse.click(x, y)
            pg.wait_for_timeout(200)
            o['apply_ev'] = ev(pg)
        o['shot'] = pg.screenshot(path=OUT + 'b3_%s.png' % nume) and None
        # Animation Pane cu doua animatii: ultimele randuri / butoanele
        pg.close()
        rez[nume] = o
json.dump(rez, open(OUT + 'b3_out.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('gata')
