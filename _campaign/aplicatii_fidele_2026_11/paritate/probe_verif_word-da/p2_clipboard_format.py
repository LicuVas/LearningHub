# Probele word-da, partea 2: tragere (F012 reluat), clipboard, anulare, formatare, stiluri — jucate în poligon
from u import *

T = []
def test(nume):
    def d(f):
        T.append((nume, f)); return f
    return d

DOC = ['Ana are mere.', 'Doi pomi mari.']


@test('F012_tragere_selectie')
def f012(ctx, port):
    out = {}
    for cheie, (p1, p2) in {'doua_cuvinte': ((1, 1), (1, 6)), 'in_cuvant': ((1, 4), (1, 6)), 'doua_paragrafe': ((1, 1), (2, 5)),
                            'inapoi': ((1, 10), (1, 1))}.items():
        a = App(ctx, port, 'word', {'paragrafe': DOC})
        trage(a, punct(a, p1[0], p1[1], True), punct(a, p2[0], p2[1], True))
        out[cheie] = sel(a)
        a.pg.close()
    return out


def lipeste_la_capat(a):
    a.taste('Control+End'); a.taste('Control+v')
    return a.stare()['text']


@test('F018_copiere')
def f018(ctx, port):
    out = {}
    # Ctrl+C
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300); a.taste('Control+c')
    out['ctrl_c'] = {'dupa_copiere': a.stare()['text'], 'dupa_lipire': lipeste_la_capat(a)}
    a.pg.close()
    # Home › Copy
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300); a.clic('panglica:Home/Clipboard/Copy')
    out['home_copy'] = {'dupa_copiere': a.stare()['text'], 'dupa_lipire': lipeste_la_capat(a), 'mesaje': nesim(a)}
    a.pg.close()
    # clic dreapta › Copy
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300)
    x, y = punct(a, 1, 5, True); a.pg.mouse.click(x, y, button='right'); a.pg.wait_for_timeout(300)
    meniu = a.tinte('meniu:')
    a.clic('meniu:Copy')
    out['clic_dreapta'] = {'meniu': meniu, 'dupa_lipire': lipeste_la_capat(a), 'mesaje': nesim(a)}
    # fără selecție: Copy gri?
    a.taste('Control+Home')
    out['fara_selectie_copy'] = a.pg.evaluate("() => { const e = LH.aplicatii.element('word', 'panglica:Home/Clipboard/Copy'); return e ? {dezactivat: e.getAttribute('aria-disabled'), clasa: e.className} : null }")
    return out


@test('F019_decupare')
def f019(ctx, port):
    out = {}
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300); a.taste('Control+x')
    out['ctrl_x'] = {'dupa_decupare': a.stare()['text'], 'dupa_lipire': lipeste_la_capat(a)}
    a.pg.close()
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300); a.clic('panglica:Home/Clipboard/Cut')
    out['home_cut'] = {'dupa_decupare': a.stare()['text'], 'dupa_lipire': lipeste_la_capat(a), 'mesaje': nesim(a)}
    a.pg.close()
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300)
    x, y = punct(a, 1, 5, True); a.pg.mouse.click(x, y, button='right'); a.pg.wait_for_timeout(300)
    a.clic('meniu:Cut')
    out['clic_dreapta'] = {'dupa_decupare': a.stare()['text'], 'dupa_lipire': lipeste_la_capat(a), 'mesaje': nesim(a)}
    return out


@test('F022_mutare_tragere')
def f022(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=2, asteapta=600)      # „are ”
    s0 = sel(a)
    a.pg.wait_for_timeout(600)
    trage(a, punct(a, 1, 5, True), punct(a, 2, 4), pasi=15)  # în „Doi |pomi”
    r1 = a.stare('text', 'selectie')
    ev = a.ev()[-3:]
    return {'selectie': s0, 'dupa_tragere': r1, 'ev': ev, 'ecran': scris_vizibil(a)}


@test('F024_anulare')
def f024(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    a.taste('Control+End'); a.scrie(' Mai sunt pere')
    t1 = a.stare()['text']
    a.taste('Control+z'); t2 = a.stare()['text']
    a.taste('Control+z'); t3 = a.stare()['text']
    a.taste('Control+z'); t4 = a.stare()['text']
    # anularea unei formatări și a unui Enter
    a2 = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a2, 1, 5, mijloc=True, de=2, asteapta=300); a2.taste('Control+b')
    f1 = [x for x in a2.stare()['formatare_pe_caractere'] if x.get('bold')]
    a2.taste('Control+z'); f2 = [x for x in a2.stare()['formatare_pe_caractere'] if x.get('bold')]
    clic_la(a2, 1, 4); a2.taste('Enter'); e1 = a2.stare()['text']; a2.taste('Control+z'); e2 = a2.stare()['text']
    tinte_undo = [t for t in a2.tinte() if 'Undo' in t or 'undo' in t]
    return {'tastat': t1, 'z1': t2, 'z2': t3, 'z3': t4, 'bold': f1, 'bold_z': f2, 'enter': e1, 'enter_z': e2, 'tinte_undo_vizibile': tinte_undo}


@test('F025_refacere')
def f025(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    a.taste('Control+End'); a.scrie(' Pere')
    a.taste('Control+z'); t1 = a.stare()['text']
    a.taste('Control+y'); t2 = a.stare()['text']
    a.taste('Control+y'); t3 = a.stare()['text']
    # Ctrl+Y fără nimic de refăcut, după o tastare: repetă?
    a.scrie('X'); a.taste('Control+y'); t4 = a.stare()['text']
    return {'dupa_z': t1, 'dupa_y': t2, 'y_din_nou': t3, 'y_dupa_tastare': t4, 'ev': a.ev()[-2:], 'mesaje': nesim(a)}


def bold_cuvinte(a):
    return [(x['text'], x.get('bold'), x.get('marime')) for x in a.stare()['formatare_pe_caractere']]


@test('F031_cuvant_fara_selectie')
def f031(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 6)                       # „ar|e”
    a.clic('panglica:Home/Font/Bold'); r1 = bold_cuvinte(a); s1 = sel(a)
    clic_la(a, 2, 6); a.taste('Control+i')
    r2 = [(x['text'], x.get('italic')) for x in a.stare()['formatare_pe_caractere']]
    clic_la(a, 2, 11)                       # „ma|ri”
    a.clic('panglica:Home/Font/Grow Font'); r3 = bold_cuvinte(a)
    clic_la(a, 1, 1)
    a.clic('meniu_derulant:Home/Font/Font Size'); a.pg.wait_for_timeout(300)
    lista = a.tinte('meniu:')
    if 'meniu:20' in lista:
        a.clic('meniu:20')
    r4 = bold_cuvinte(a)
    return {'bold_buton': r1, 'selectie_dupa': s1, 'italic_ctrl_i': r2, 'grow_font': r3, 'marime_20_in_Ana': r4}


@test('F032_formatare_tastare')
def f032(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 13)            # la capăt
    a.clic('panglica:Home/Font/Bold'); a.scrie(' Bune')
    r1 = bold_cuvinte(a)
    a.taste('Control+b'); a.scrie(' rosii')
    r2 = bold_cuvinte(a)
    return {'dupa_B_si_tastare': r1, 'dupa_ctrl_b_iar': r2}


@test('F034_marime')
def f034(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300)
    a.clic('meniu_derulant:Home/Font/Font Size'); a.pg.wait_for_timeout(300)
    lista = [t for t in a.tinte('meniu:')]
    a.clic('meniu:28'); r1 = bold_cuvinte(a)
    out = {'lista': lista, 'din_lista_28': r1}
    # numărul scris în casetă
    caseta = a.pg.evaluate("""() => { const e = LH.aplicatii.element('word', 'panglica:Home/Font/Font Size'); if (!e) return null; const i = e.matches('input') ? e : e.querySelector('input'); return {tag: e.tagName, input: !!i, val: i ? i.value : e.textContent}; }""")
    out['caseta'] = caseta
    for v in ['13.3', '13,7', '2000', 'abc', '0.4', '100']:
        clic_la(a, 1, 5, mijloc=True, de=2, asteapta=300)
        a.clic('panglica:Home/Font/Font Size'); a.pg.wait_for_timeout(150)
        a.taste('Control+a'); a.scrie(v, asteapta=100); a.taste('Enter', asteapta=300)
        dlg = a.stare()['dialog']
        out['scris_' + v] = {'fmt': [(x['text'], x.get('marime')) for x in a.stare()['formatare_pe_caractere']], 'dialog': dlg, 'mesaje': nesim(a)}
        if dlg:
            a.taste('Enter', asteapta=300)
            out['scris_' + v]['dupa_ok'] = a.stare()['dialog']
            a.taste('Escape', asteapta=200)
    return out


@test('F038_aliniere')
def f038(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    clic_la(a, 1, 3)
    out = {}
    for b in ['Center', 'Center', 'Align Right', 'Align Right', 'Align Left', 'Align Left']:
        a.clic('panglica:Home/Paragraph/' + b); out.setdefault('butoane', []).append((b, a.stare()['aliniere_paragrafe'][0]))
    # Justify (e meniu derulant: partea de sus a butonului)
    a.clic('meniu_derulant:Home/Paragraph/Justify', dx=0.3, dy=0.3); out['justify_buton'] = a.stare()['aliniere_paragrafe'][0]
    a.clic('meniu_derulant:Home/Paragraph/Justify', dx=0.3, dy=0.3); out['justify_buton_2'] = a.stare()['aliniere_paragrafe'][0]
    out['meniu_justify'] = a.tinte('meniu:')
    a.taste('Escape')
    clic_la(a, 1, 3)
    for k in ['Control+e', 'Control+e', 'Control+r', 'Control+r', 'Control+j', 'Control+j', 'Control+l', 'Control+l']:
        a.taste(k); out.setdefault('taste', []).append((k, a.stare()['aliniere_paragrafe'][0]))
    return out


@test('F047_enter_dupa_titlu')
def f047(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Vulcanii', 'Text']})
    clic_la(a, 1, 3)
    st = a.tinte('meniu:Heading')
    a.clic('meniu:Heading 1')
    r0 = a.stare('stil_paragrafe')
    a.taste('End'); a.taste('Enter'); a.scrie('Rand nou')
    r1 = a.stare('text', 'stil_paragrafe')
    clic_la(a, 1, 4); a.taste('Enter')
    r2 = a.stare('text', 'stil_paragrafe')
    a.taste('Control+z'); a.taste('Control+z')
    r3 = a.stare('text', 'stil_paragrafe')
    return {'galerie': st, 'dupa_heading': r0, 'enter_la_capat': r1, 'enter_la_mijloc': r2, 'dupa_z': r3}


if __name__ == '__main__':
    import sys
    alese = sys.argv[1:]
    ruleaza([t for t in T if not alese or t[0].split('_')[0] in alese], 'rez_p2' + ('_' + '_'.join(alese) if alese else ''))
