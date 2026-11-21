# Depanare: Home › Copy / Cut din panglică (F018, F019) și mărimea scrisă cu jumătate (F034)
from u import *

T = []
def test(nume):
    def d(f):
        T.append((nume, f)); return f
    return d

DOC = ['Ana are mere.', 'Doi pomi mari.']


@test('F018b_home_copy')
def f018b(ctx, port):
    out = {}
    for buton in ['Copy', 'Cut']:
        a = App(ctx, port, 'word', {'paragrafe': DOC})
        clic_la(a, 1, 5, mijloc=True, de=2, asteapta=600)
        s0 = sel(a)
        el = a.pg.evaluate("t => { const e = LH.aplicatii.element('word', t); return e ? {dez: e.getAttribute('aria-disabled'), cls: e.className, r: e.getBoundingClientRect().toJSON()} : null }", 'panglica:Home/Clipboard/' + buton)
        a.clic('panglica:Home/Clipboard/' + buton, asteapta=400)
        ev1 = a.ev()
        t1 = a.stare('text', 'selectie')
        a.taste('Control+End'); a.taste('Control+v')
        ev2 = a.ev()
        # a doua încercare: Paste din panglică
        a.clic('panglica:Home/Clipboard/Paste', asteapta=400)
        out[buton] = {'sel': s0, 'buton': el, 'ev_clic': ev1, 'dupa_clic': t1, 'ev_lipire': ev2, 'final': a.stare()['text'], 'ev_paste_panglica': a.ev(), 'mesaje': nesim(a)}
        a.poza('F018b_' + buton)
        a.pg.close()
    return out


@test('F034b_jumatati')
def f034b(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    out = {}
    for v in ['13.5', '13,5', '13.3', '2000']:
        clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300)
        a.clic('panglica:Home/Font/Font Size'); a.pg.wait_for_timeout(150)
        a.taste('Control+a'); a.scrie(v, asteapta=100); a.taste('Enter', asteapta=300)
        out[v] = {'fmt': [(x['text'], x.get('marime')) for x in a.stare()['formatare_pe_caractere']], 'caseta': a.pg.evaluate("() => { const e = LH.aplicatii.element('word', 'panglica:Home/Font/Font Size'); const i = e && (e.matches('input') ? e : e.querySelector('input')); return i ? i.value : null }"), 'ev': a.ev()[-1:], 'mesaje': nesim(a)}
    a.poza('F034b_2000')
    return out


if __name__ == '__main__':
    ruleaza(T, 'rez_p2b')
