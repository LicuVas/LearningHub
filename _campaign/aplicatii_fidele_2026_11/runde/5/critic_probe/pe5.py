# -*- coding: utf-8 -*-
"""Telefonul (390x844, atingere): fereastra Open si Save As — butoanele Open / Save se pot atinge? Se poate derula
fereastra (stramosi cu scroll)? Drumul m1-l03:240 numai cu atingeri: File > Open > Browse > Descarcari > fisa > Open.
Iesirea: re5.json."""
from h5 import *

JS_SCROLL = r"""(t) => { const e = LH.aplicatii.element('word', t); if (!e) return null; const o = [];
  for (let x = e.parentElement; x; x = x.parentElement) { const cs = getComputedStyle(x);
    if (x.scrollWidth > x.clientWidth + 2 && /(auto|scroll)/.test(cs.overflowX)) o.push((x.className || x.tagName) + ' sw=' + x.scrollWidth + ' cw=' + x.clientWidth); }
  const se = document.scrollingElement; return {derulabile: o, pagina: [se.scrollWidth, se.clientWidth, getComputedStyle(document.body).overflowX], vw: innerWidth}; }"""


def swipe_stanga(pg, cdp, x0, y, dx):
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x0, 'y': y}]})
    for i in range(1, 11):
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x0 - dx * i / 10, 'y': y}]})
        pg.wait_for_timeout(16)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    pg.wait_for_timeout(400)


s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b, 390, 844, touch=True); pg = pagina(ctx, port)
    cdp = ctx.new_cdp_session(pg)

    def drum_240_telefon():
        deschide(pg, {'paragrafe': [''], 'fisiere': [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB}, ORAR_ANA]})
        j = []
        j.append(['File', tap(pg, 'fila:File')]); pg.wait_for_timeout(300)
        opn = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if t == 'backstage:Open']
        j.append(['Open (stanga)', tap(pg, opn[0]) if opn else 'LIPSA']); pg.wait_for_timeout(300)
        j.append(['Browse', tap(pg, 'backstage:Browse')]); pg.wait_for_timeout(350)
        d = dlg(pg)
        j.append(['Descarcari', tap(pg, 'arbore:Descărcări')])
        r = rect(pg, 'lista:club-lectura.docx')
        if r:
            pg.touchscreen.tap(r[0] + 30, r[1] + r[3] / 2); pg.wait_for_timeout(250)
        j.append(['rand (partea vizibila)', r])
        ro = rect(pg, 'fereastra:Open'); rs = pg.evaluate(JS_SCROLL, 'fereastra:Open')
        pg.screenshot(path=OUT + 'pe5_open_telefon.png')
        # incerc sa aduc butonul in ecran cu o tragere a degetului spre stanga, peste fereastra
        swipe_stanga(pg, cdp, 300, 300, 250)
        ro2 = rect(pg, 'fereastra:Open')
        if ro2 and ro2[0] + ro2[2] / 2 < 390:
            pg.touchscreen.tap(ro2[0] + ro2[2] / 2, ro2[1] + ro2[3] / 2); pg.wait_for_timeout(300)
        x = scurt(pg)
        return {'pasi': j, 'dlg_deschis': d and d['sup'], 'rect_open': ro, 'derulare': rs, 'rect_open_dupa_swipe': ro2,
                'final': {k: x[k] for k in ('nume', 'folder', 'docs', 'dlg', 'msg', 'focus')}}
    caz('drum_240_telefon', drum_240_telefon)

    def saveas_telefon():
        deschide(pg, {'paragrafe': ['Orar']})
        tap(pg, 'fila:File'); pg.wait_for_timeout(300)
        sa = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if t in ('backstage:Save As', 'backstage:Save as')]
        if sa:
            tap(pg, sa[0]); pg.wait_for_timeout(300)
        tap(pg, 'backstage:Browse'); pg.wait_for_timeout(350)
        rsv = rect(pg, 'dialog_salvare:Save'); rs = pg.evaluate(JS_SCROLL, 'dialog_salvare:Save')
        swipe_stanga(pg, cdp, 300, 300, 250)
        rsv2 = rect(pg, 'dialog_salvare:Save')
        if rsv2 and rsv2[0] + rsv2[2] / 2 < 390:
            pg.touchscreen.tap(rsv2[0] + rsv2[2] / 2, rsv2[1] + rsv2[3] / 2); pg.wait_for_timeout(300)
        x = scurt(pg)
        pg.screenshot(path=OUT + 'pe5_saveas_telefon.png')
        return {'save_as_backstage': sa, 'dlg': dlg(pg) and dlg(pg)['sup'], 'rect_save': rsv, 'derulare': rs, 'rect_save_dupa_swipe': rsv2,
                'final': {k: x[k] for k in ('nume', 'salvate', 'dlg', 'msg')}}
    caz('saveas_telefon', saveas_telefon)
    ctx.close(); b.close()
s.shutdown()
salveaza(R, OUT + 're5.json')
print(json.dumps(R, ensure_ascii=False, indent=1)[:5000])
