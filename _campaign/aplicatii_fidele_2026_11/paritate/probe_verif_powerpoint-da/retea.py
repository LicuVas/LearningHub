# Verificarea rețelei și a imaginilor: ce cereri locale eșuează în poligon (galeriile goale din capturi)
from comun import *

with sesiune() as (ctx, port, blocate):
    rau = []
    pg = ctx.new_page()
    pg.on('response', lambda r: rau.append([r.status, r.url]) if r.status >= 400 else None)
    pg.on('requestfailed', lambda r: rau.append(['esuat', r.url]))
    cons = []
    pg.on('console', lambda m: cons.append(m.type + ': ' + m.text[:200]) if m.type in ('error', 'warning') else None)
    pg.goto('http://127.0.0.1:%d/aplicatii/poligon.html?aplicatie=powerpoint' % port)
    pg.wait_for_timeout(1500)
    pg.evaluate("() => { const e = LH.aplicatii.element('powerpoint', 'fila:Transitions'); e.click && 0; }")
    a = App.__new__(App); a.app = 'powerpoint'; a.pg = pg; a.erori = []
    a.ev0()
    a.clic('fila:Transitions')
    g = pg.evaluate("() => { const e = LH.aplicatii.element('powerpoint', 'meniu:Fade'); if (!e) return null; return {html: e.outerHTML.slice(0, 700), text: e.innerText, titlu: e.title || e.getAttribute('aria-label')}; }")
    q = pg.evaluate("() => { const e = LH.aplicatii.element('powerpoint', 'acces_rapid:Undo'); return e ? e.outerHTML.slice(0, 500) : null; }")
    s = pg.evaluate("() => { const e = LH.aplicatii.element('powerpoint', 'bara_stare:Slide Show'); return e ? e.outerHTML.slice(0, 500) : null; }")
    print(json.dumps({'cereri_rele': rau, 'consola': cons, 'fade': g, 'undo_qat': q, 'bara_slide_show': s, 'blocate': blocate}, ensure_ascii=False, indent=1))
