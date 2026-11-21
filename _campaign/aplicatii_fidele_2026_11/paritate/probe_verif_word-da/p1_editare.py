# Probele word-da, partea 1: editare, navigare, selectare (F001-F016), jucate în poligon
from u import *

T = []
def test(nume):
    def d(f):
        T.append((nume, f)); return f
    return d

DOC = ['Ana are mere.', 'Doi pomi mari.']


@test('F001_tastare')
def f001(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 4)                     # înainte de „are”
    s0 = sel(a)
    a.scrie('si ')
    t1 = a.stare()['text']
    ev = a.ev()[-2:]
    # calea „input” (telefon / IME): intrarea documentului primește textul
    info = a.pg.evaluate("""() => { const r0 = LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie') === 'word');
      const x = r0.querySelector('input:not([type=hidden]), textarea'); if (!x) return null;
      const r = x.getBoundingClientRect(); return {tag: x.tagName, aria: x.getAttribute('aria-label'), w: r.width, h: r.height, vizibila: getComputedStyle(x).opacity}; }""")
    a.pg.evaluate("""() => { const r0 = LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie') === 'word');
      const x = document.activeElement; x.value = 'Z'; x.dispatchEvent(new InputEvent('input', {inputType: 'insertText', data: 'Z', bubbles: true})); }""")
    a.pg.wait_for_timeout(200)
    return {'cursor_dupa_clic': s0, 'dupa_tastare': t1, 'ev': ev, 'intrarea': info, 'dupa_input': a.stare()['text'], 'ecran': scris_vizibil(a)}


@test('F002_enter')
def f002(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 2); a.taste('Control+e')            # centrat
    clic_la(a, 1, 8); a.taste('Enter')                # „Ana are | mere.”
    r1 = a.stare('text', 'aliniere_paragrafe', 'selectie')
    clic_la(a, 3, 4, de=2, asteapta=300)              # dublu-clic pe „pomi”
    s = sel(a)
    a.taste('Enter')
    r2 = a.stare('text', 'aliniere_paragrafe')
    return {'enter_mijloc': r1, 'selectie_inainte': s, 'enter_peste_selectie': r2, 'butoane_sub_fereastra': nesim(a)}


@test('F003_backspace')
def f003(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 3); a.taste('Backspace')
    r1 = a.stare()['text']
    clic_la(a, 2, 0); a.taste('Backspace')
    r2 = a.stare('text', 'selectie')
    return {'bs_litera': r1, 'bs_inceput_paragraf': r2, 'ecran': scris_vizibil(a)}


@test('F004_delete')
def f004(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 0); a.taste('Delete')
    r1 = a.stare()['text']
    a.taste('End'); a.taste('Delete')
    r2 = a.stare('text', 'selectie')
    return {'del_litera': r1, 'del_capat_paragraf': r2}


@test('F008_tab')
def f008(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 4); a.taste('Tab')
    r1 = a.stare()['text']
    clic_la(a, 2, 0); a.taste('Tab')
    r2 = a.stare()['text']
    return {'tab_mijloc': r1, 'tab_inceput_paragraf': r2, 'ev': a.ev()[-2:]}


@test('F009_navigare')
def f009(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 4)
    out = {'start': sel(a)['de_la']}
    for k in ['ArrowRight', 'ArrowLeft', 'Control+ArrowRight', 'Control+ArrowLeft', 'End', 'Home', 'ArrowDown', 'ArrowUp',
              'Control+End', 'Control+Home', 'Control+ArrowDown']:
        a.taste(k); out[k] = sel(a)['de_la']
    return out


@test('F010_derulare')
def f010(ctx, port):
    lung = ['Rândul %d din documentul lung, ca să fie nevoie de derulare.' % i for i in range(1, 140)]
    a = App(ctx, port, 'word', {'paragrafe': lung})
    sc = "() => { const z = LH.aplicatii.radacini()[0].querySelector('[data-lh-zona]'); let e = z; while (e && e.scrollHeight <= e.clientHeight + 2) e = e.parentElement; return e ? Math.round(e.scrollTop) : null; }"
    a.taste('Control+Home'); out = {'start': a.pg.evaluate(sc)}
    a.clic('bara_derulare:Line down'); out['line_down'] = a.pg.evaluate(sc)
    a.clic('bara_derulare:Page down'); out['page_down_bara'] = a.pg.evaluate(sc)
    a.clic('bara_derulare:Line up'); out['line_up'] = a.pg.evaluate(sc)
    clic_la(a, 1, 0) if False else None
    a.taste('PageDown'); out['tasta_pagedown'] = a.pg.evaluate(sc)
    a.taste('PageUp'); out['tasta_pageup'] = a.pg.evaluate(sc)
    out['ev'] = a.ev()[-3:]
    out['tinte_derulare'] = a.tinte('bara_derulare')
    return out


@test('F011_clic_intre_litere')
def f011(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 9); s1 = sel(a)        # înainte de „mere”
    clic_la(a, 2, 2); s2 = sel(a)        # „Do|i”  -> 14 + 2 = 16
    return {'clic_1_9': s1, 'clic_2_2': s2}


@test('F012_tragere_selectie')
def f012(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    trage(a, punct(a, 1, 1, True), punct(a, 1, 6, True))       # din „Ana” (A|na) până în „are”
    s1 = sel(a)
    trage(a, punct(a, 1, 5, True), punct(a, 1, 6, True))       # în interiorul aceluiași cuvânt
    s2 = sel(a)
    trage(a, punct(a, 1, 1, True), punct(a, 2, 5, True))       # pe două paragrafe
    s3 = sel(a)
    return {'doua_cuvinte': s1, 'in_cuvant': s2, 'doua_paragrafe': s3}


@test('F013_dublu_clic')
def f013(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300)
    s1 = sel(a)
    a.scrie('X')
    return {'selectie': s1, 'dupa_tastare': a.stare()['text'], 'ev': a.ev()[-4:]}


@test('F014_triplu_clic')
def f014(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=3, asteapta=300)
    s1 = sel(a)
    return {'selectie': s1, 'ev': a.ev()[-3:]}


@test('F016_shift')
def f016(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 4)
    clic_la(a, 1, 12, mod='Shift'); s1 = sel(a)
    a.taste('Shift+ArrowRight'); s2 = sel(a)
    a.taste('Shift+ArrowDown'); s3 = sel(a)
    a.taste('Shift+ArrowLeft'); s4 = sel(a)
    a.taste('Shift+ArrowUp'); s5 = sel(a)
    return {'shift_clic': s1, 'shift_dreapta': s2, 'shift_jos': s3, 'shift_stanga': s4, 'shift_sus': s5}


if __name__ == '__main__':
    import sys
    alese = sys.argv[1:]
    ruleaza([t for t in T if not alese or t[0].split('_')[0] in alese], 'rez_p1' + ('_' + '_'.join(alese) if alese else ''))
