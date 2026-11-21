# Probele word-da, partea 5: selectarea trăgând cu DEGETUL (F012) și mutarea cu degetul (F022), pe ecran tactil (CDP touch)
from u import *

T = []
def test(nume):
    def d(f):
        T.append((nume, f)); return f
    return d

DOC = ['Ana are mere frumoase si rosii.', 'Doi pomi mari.']


def deget(a, p1, p2, pasi=12):
    cdp = a.pg.context.new_cdp_session(a.pg)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': p1[0], 'y': p1[1]}]})
    a.pg.wait_for_timeout(120)
    for i in range(1, pasi + 1):
        x = p1[0] + (p2[0] - p1[0]) * i / pasi; y = p1[1] + (p2[1] - p1[1]) * i / pasi
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y}]})
        a.pg.wait_for_timeout(25)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    a.pg.wait_for_timeout(300)


@test('F012d_deget_selectie')
def f012d(ctx, port):
    c2 = ctx.browser.new_context(viewport={'width': 390, 'height': 800}, has_touch=True, is_mobile=True)
    c2.route('**/*', lambda r: r.continue_() if r.request.url.startswith(('http://127.0.0.1', 'data:', 'blob:')) else r.abort())
    out = {}
    try:
        a = App(c2, port, 'word', {'paragrafe': DOC})
        a.pg.evaluate("() => { window.__pc = 0; document.addEventListener('pointercancel', () => window.__pc++, true); }")
        out['touch_action_zona'] = a.pg.evaluate("() => { const z = LH.aplicatii.radacini()[0].querySelector('[data-lh-zona]'); return [getComputedStyle(z).touchAction, getComputedStyle(z.querySelector('[data-lh-tinta=\"text\"]') || z).touchAction]; }")
        p1 = punct(a, 1, 1, True); p2 = punct(a, 1, 10, True)
        out['puncte'] = [p1, p2]
        deget(a, p1, p2)
        out['orizontal'] = {'sel': sel(a), 'pointercancel': a.pg.evaluate('window.__pc'), 'ev': a.ev()[-3:]}
        a.pg.close()
        a = App(c2, port, 'word', {'paragrafe': DOC})
        a.pg.evaluate("() => { window.__pc = 0; document.addEventListener('pointercancel', () => window.__pc++, true); }")
        p1 = punct(a, 1, 1, True); p2 = punct(a, 2, 5, True)
        deget(a, p1, p2)
        out['in_jos'] = {'sel': sel(a), 'pointercancel': a.pg.evaluate('window.__pc'), 'ev': a.ev()[-3:]}
        # mutarea cu degetul: dublu-atingere pe „frumoase”, apoi trag selecția
        a.pg.close()
        a = App(c2, port, 'word', {'paragrafe': DOC})
        x, y = punct(a, 1, 15, True)
        a.pg.touchscreen.tap(x, y); a.pg.wait_for_timeout(80); a.pg.touchscreen.tap(x, y); a.pg.wait_for_timeout(600)
        s0 = sel(a)
        a.pg.evaluate("() => { window.__pc = 0; document.addEventListener('pointercancel', () => window.__pc++, true); }")
        deget(a, (x, y), punct(a, 2, 4))
        out['mutare_deget'] = {'sel_inainte': s0, 'text': a.stare()['text'], 'pointercancel': a.pg.evaluate('window.__pc'), 'ev': a.ev()[-2:]}
    finally:
        c2.close()
    return out


if __name__ == '__main__':
    ruleaza(T, 'rez_p5')
