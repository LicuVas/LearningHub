# -*- coding: utf-8 -*-
"""Proba 6 (I1): telefon 375×740 cu atingeri + fereastra mică 1366×657 la 125% (1093×526 css)."""
import sys, json
sys.path.insert(0, __import__('os').path.dirname(__file__))
from h import Ham, st, ev, el, clic, nesimulat, scrie, centru, AICI

C3 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Clasa a VI-a']},
                      {'aspect': 'Title and Content', 'texte': ['Ce sunt', 'Munti de foc']}], 'diapozitiv_activ': 1}
MAS = """(()=>{const r=document.querySelector('[data-lh-aplicatie=powerpoint]');const R0=r.getBoundingClientRect();
 const vw=document.documentElement.clientWidth, sw=document.documentElement.scrollWidth;
 const pl=r.querySelector('.lh-ap-loc-panglica');const cs=pl?getComputedStyle(pl):null;let sc=pl;while(sc&&sc!==r&&!(sc.scrollWidth>sc.clientWidth+2&&/(auto|scroll)/.test(getComputedStyle(sc).overflowX)))sc=sc.parentElement;
 const mici=[...r.querySelectorAll('.lh-ap-loc-panglica [data-lh-tinta], [data-lh-tinta=miniatura], [data-lh-tinta^="fila:"]')].filter(e=>e.offsetParent).map(e=>{const q=e.getBoundingClientRect();return [e.getAttribute('data-lh-tinta')+(e.getAttribute('data-lh-id')?':'+e.getAttribute('data-lh-id'):''),Math.round(q.width),Math.round(q.height)]}).filter(x=>x[1]<32||x[2]<32);
 const slide=r.querySelector('.lh-ap-p-slide').getBoundingClientRect();
 return {vw,sw,root:[Math.round(R0.width),Math.round(R0.height)],derulare_panglica:sc&&sc!==r?[sc.className,sc.scrollWidth,sc.clientWidth]:null,mici:mici.length,exemple_mici:mici.slice(0,8),slide:[Math.round(slide.x),Math.round(slide.y),Math.round(slide.width),Math.round(slide.height)]}})()"""
R = {}
for nume, vp, sc, mob in [('telefon375', (375, 740), 2, True), ('telefon360', (360, 640), 3, True), ('fereastra_mica', (1093, 526), 1.25, False)]:
    with Ham(viewport=vp, scale=sc, mobil=mob) as H:
        pg = H.app('powerpoint', C3)
        pg.wait_for_timeout(300)
        m = pg.evaluate(MAS)
        pg.screenshot(path=str(AICI / ('cap_' + nume + '.png')))
        rez = {'masura': m}
        # atingere pe titlu și tastare (CDP insertText ca tastatura telefonului)
        c = centru(pg, 'forma:1/1')
        if mob:
            pg.touchscreen.tap(c[0], c[1])
        else:
            pg.mouse.click(c[0], c[1])
        pg.wait_for_timeout(200)
        cdp = pg.context.new_cdp_session(pg)
        cdp.send('Input.insertText', {'text': ' activi'})
        pg.wait_for_timeout(150)
        rez['dupa_tastare'] = st(pg)['diapozitive'][0]['texte']
        rez['ev'] = [x['g'] + '/' + x['a'] + '@' + str(x['t']) for x in ev(pg)]
        # fereastra Font pe ecranul mic: încape?
        pg.evaluate("LH.aplicatii.deschideSuprafata && 0")
        c = centru(pg, 'forma:1/1')
        pg.mouse.click(c[0], c[1], button='right'); pg.wait_for_timeout(100)
        okf = clic(pg, 'meniu:Font...'); pg.wait_for_timeout(100)
        rez['font_dialog'] = pg.evaluate("(()=>{const d=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"dialog.FontDialogPowerPoint\"]');if(!d)return null;const r=d.getBoundingClientRect();const ok=d.querySelector('[data-lh-tinta=\"fereastra:OK\"]');const o=ok?ok.getBoundingClientRect():null;return {r:[Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)],ok:o?[Math.round(o.x),Math.round(o.y),Math.round(o.width),Math.round(o.height)]:null,vw:innerWidth,vh:innerHeight}})()")
        rez['font_clic'] = okf
        if rez['font_dialog']:
            pg.screenshot(path=str(AICI / ('cap_' + nume + '_font.png')))
            okc = clic(pg, 'fereastra:OK')
            rez['font_ok'] = [okc, st(pg)['dialog']]
        # meniul miniaturii pe telefon: încape?
        pg.keyboard.press('Escape')
        c = centru(pg, 'miniatura:1')
        if c:
            pg.mouse.click(c[0], c[1], button='right'); pg.wait_for_timeout(100)
            rez['meniu_mini'] = pg.evaluate("(()=>{const m=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"meniu_contextual.miniatura\"]');if(!m)return null;const r=m.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),innerWidth,innerHeight]})()")
        rez['erori'] = list(H.erori)
        R[nume] = rez
scrie(R, 'p6_telefon.json')
print('gata')
