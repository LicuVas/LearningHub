# Ajutoarele comune ale jocurilor verificatorului powerpoint-da (peste h.py)
from h import *

R = {}
TESTE = []


def test(nume):
    def dec(f):
        def g(ctx, port):
            try:
                R[nume] = f(ctx, port)
            except Exception as e:
                R[nume] = {'EROARE': repr(e)[:600]}
            print(nume, json.dumps(R[nume], ensure_ascii=False)[:2500])
        g.nume = nume
        TESTE.append(g)
        return g
    return dec


def pp(ctx, port, c=None):
    return App(ctx, port, 'powerpoint', c)


def rclic(a, t):
    b = a.bbox(t)
    a.pg.mouse.click(b['x'] + b['w'] / 2, b['y'] + b['h'] / 2, button='right')
    a.pg.wait_for_timeout(300)


def trage(a, t, dx, dy, pasi=10, fx=0.5, fy=0.5, mijloc=None):
    b = a.bbox(t)
    x, y = b['x'] + b['w'] * fx, b['y'] + b['h'] * fy
    a.pg.mouse.move(x, y)
    a.pg.mouse.down()
    a.pg.wait_for_timeout(80)
    rez = None
    for i in range(1, pasi + 1):
        a.pg.mouse.move(x + dx * i / pasi, y + dy * i / pasi)
        a.pg.wait_for_timeout(40)
        if mijloc and i == pasi:
            rez = mijloc()
    a.pg.mouse.up()
    a.pg.wait_for_timeout(350)
    return rez


def asp(a):
    return [d['aspect'] for d in a.stare()['diapozitive']]


def titluri(a):
    return [(d['texte'] or [''])[0] for d in a.stare()['diapozitive']]


IND = "() => { const e = document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-eticheta^=\"View Indicator\"]'); return e ? e.textContent.trim() : null; }"


def indicator(a):
    return a.pg.evaluate(IND)


def file_ctx(a):
    return a.tinte('fila:')


def selectate(a):
    return a.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-selectat]')].map(e => (e.getAttribute('data-lh-tinta')||'') + ':' + (e.getAttribute('data-lh-id')||''))")


def html(a, tinta, n=600):
    return a.pg.evaluate("([t, n]) => { const e = LH.aplicatii.element('powerpoint', t); return e ? e.outerHTML.slice(0, n) : null; }", [tinta, n])


def ruleaza(nume_fisier):
    with sesiune() as (ctx, port, blocate):
        sel = sys.argv[1:]
        for t in TESTE:
            if not sel or any(s in t.nume for s in sel):
                t(ctx, port)
        print('BLOCATE', blocate)
    rezultat(nume_fisier + ('_' + '_'.join(sys.argv[1:]) if sys.argv[1:] else ''), R)
