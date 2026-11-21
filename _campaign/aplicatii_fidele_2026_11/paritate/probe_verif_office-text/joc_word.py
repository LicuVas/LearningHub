# Jocurile Word ale verificatorului office-text (poligon.html?aplicatie=word, headless, rețea doar 127.0.0.1)
from h import *

R = {}


def clic_css(a, sel, i=0, dx=0.5, dy=0.5, asteapta=250):
    b = a.pg.evaluate("([s,i]) => { const e = document.querySelectorAll(s)[i]; if (!e) return null; e.scrollIntoView({block:'nearest'}); const r = e.getBoundingClientRect(); return {x:r.x,y:r.y,w:r.width,h:r.height}; }", [sel, i])
    if not b:
        raise RuntimeError('css lipsă: ' + sel)
    a.pg.mouse.click(b['x'] + b['w'] * dx, b['y'] + b['h'] * dy); a.pg.wait_for_timeout(asteapta)


def campuri(a):
    return a.pg.evaluate("""() => [...document.querySelectorAll('[data-lh-aplicatie] input, [data-lh-aplicatie] [role=checkbox], [data-lh-aplicatie] [data-lh-tip=CheckBox]')]
      .filter(e => e.getBoundingClientRect().width > 0)
      .map(e => (e.getAttribute('aria-label') || (e.closest('[data-lh-eticheta]')||{getAttribute(){return ''}}).getAttribute('data-lh-eticheta')) + ' = ' + (e.value !== undefined ? e.value : '') + ' ' + (e.getAttribute('aria-checked')||''))""")


def umple(a, eticheta_re, valoare):
    ok = a.pg.evaluate("""([re, v]) => { const r = new RegExp(re); const e = [...document.querySelectorAll('[data-lh-aplicatie] input')].find(x => r.test(x.getAttribute('aria-label') || (x.closest('[data-lh-eticheta]')||{getAttribute(){return ''}}).getAttribute('data-lh-eticheta') || ''));
      if (!e) return false; e.focus(); e.select(); return true; }""", [eticheta_re, valoare])
    if ok:
        a.pg.keyboard.press('Control+A'); a.pg.keyboard.type(str(valoare)); a.pg.wait_for_timeout(150)
    return ok


def test(nume):
    def dec(f):
        def g(ctx, port):
            try:
                R[nume] = f(ctx, port)
            except Exception as e:
                R[nume] = {'EROARE': repr(e)[:400]}
            print(nume, json.dumps(R[nume], ensure_ascii=False)[:1500])
        return g
    return dec


@test('word-F049_insert_table_dialog')
def t49(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Orar']})
    a.clic('fila:Insert'); a.clic('mso:TableInsertGallery')
    meniu = [t for t in a.tinte('meniu:') if 'Table' in t][:8]
    a.clic('meniu:Insert Table...')
    c0 = campuri(a)
    umple(a, 'Number of columns', 4); umple(a, 'Number of rows', 3)
    a.clic('fereastra:OK')
    return {'meniu': meniu, 'campuri': c0, 'tabele': a.stare()['tabele'], 'mesaje': a.mesaje(), 'ev': a.ev()[-3:]}


@test('word-F069_margini')
def t69(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Text']})
    a.clic('fila:Layout'); a.clic('mso:PageMarginsGallery')
    rand = a.tinte('meniu:')
    a.clic('meniu:Narrow Margins')
    p1 = a.stare()['pagina']['margini_cm']
    return {'randuri_lista': rand, 'dupa_narrow': p1, 'mesaje': a.mesaje()}


@test('word-F045_show_hide')
def t45(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Ana are mere', 'Doi']})
    a.clic('panglica:Home/Paragraph/Show All')
    on = a.pg.evaluate("() => { const r = LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie')==='word'); const z = r.querySelector('[data-lh-zona]'); return {clasa: r.classList.contains('lh-ap-semne'), html_semne: (z.innerHTML.match(/¶|·/g)||[]).length, apasat: (LH.aplicatii.element('word','panglica:Home/Paragraph/Show All')||{getAttribute(){}}).getAttribute('aria-pressed')} }")
    a.poza('word_F045_semne')
    a.clic('panglica:Home/Paragraph/Show All')
    off = a.pg.evaluate("() => LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie')==='word').classList.contains('lh-ap-semne')")
    return {'pornit': on, 'oprit_clasa': off, 'text': a.stare()['text'], 'ev': a.ev()}


@test('word-F078_pdf')
def t78(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Orar']})
    a.taste('F12')
    a.clic('camp:tip_fisier')
    pdf = [t for t in a.tinte('meniu:') if 'PDF' in t]
    if pdf:
        a.clic(pdf[0])
    c = campuri(a)
    umple(a, 'File name', 'Orar')
    a.clic('dialog_salvare:Save')
    s = a.stare('fisiere_salvate', 'nume_fisier', 'titlu_fereastra', 'documente_deschise', 'text', 'dialog_salvare')
    return {'rand_pdf': pdf, 'campuri_dialog': c, 'stare': s, 'mesaje': a.mesaje()}


@test('word-F050_celula')
def t50(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Orar'], 'tabel': {'randuri': 2, 'coloane': 2, 'celule': [['Luni', ''], ['', '']]}})
    clic_css(a, '[data-lh-aplicatie="word"] [data-lh-zona] td[data-r="1"][data-c="1"]')
    a.scrie('Mate')
    t1 = a.stare()['tabele']
    a.taste('Backspace', 'Backspace')
    t2 = a.stare()['tabele']
    clic_css(a, '[data-lh-aplicatie="word"] [data-lh-zona] td[data-r="0"][data-c="0"]', dx=0.02)
    a.taste('Delete')
    t3 = a.stare()['tabele']
    return {'dupa_scris': t1, 'dupa_2bs': t2, 'dupa_delete_la_inceput_luni': t3}


@test('word-F052_enter_celula')
def t52(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Orar'], 'tabel': {'randuri': 2, 'coloane': 2, 'celule': [['Luni', 'Marti'], ['', '']]}})
    h0 = a.pg.evaluate("() => document.querySelector('[data-lh-aplicatie=word] [data-lh-zona] td[data-r=\"0\"][data-c=\"0\"]').getBoundingClientRect().height")
    clic_css(a, '[data-lh-aplicatie="word"] [data-lh-zona] td[data-r="0"][data-c="0"]', dx=0.95)
    a.taste('End', 'Enter'); a.scrie('Mate')
    h1 = a.pg.evaluate("() => document.querySelector('[data-lh-aplicatie=word] [data-lh-zona] td[data-r=\"0\"][data-c=\"0\"]').getBoundingClientRect().height")
    return {'tabele': a.stare()['tabele'], 'inaltime_inainte': h0, 'inaltime_dupa': h1, 'text': a.stare()['text']}


@test('word-F017_ctrl_a')
def t17(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Unu', 'Doi'], 'tabel': {'randuri': 1, 'coloane': 2, 'celule': [['Luni', 'Marti']]}})
    a.clic('text:1'); a.taste('Control+a')
    s1 = a.stare()['selectie']
    clic_css(a, '[data-lh-aplicatie="word"] [data-lh-zona] td[data-r="0"][data-c="1"]')
    a.taste('Control+a')
    s2 = a.stare()['selectie']
    return {'in_paragraf': s1, 'in_celula': s2}


@test('word-F037_ctrl_space')
def t37(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Ana are mere']})
    a.clic('text:1'); a.taste('Control+a', 'Control+b', 'Control+i')
    f1 = a.stare()['formatare_pe_caractere']
    a.taste('Control+Space')
    f2 = a.stare()['formatare_pe_caractere']
    return {'inainte': f1, 'dupa_ctrl_space': f2, 'text': a.stare()['text'], 'ev': a.ev()[-2:], 'mesaje': a.mesaje()}


@test('word-F005_ctrl_bs')
def t05(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Ana are mere multe'], 'tabel': {'randuri': 1, 'coloane': 1, 'celule': [['Luni Marti']]}})
    a.clic('text:1', dx=0.99); a.taste('End', 'Control+Backspace')
    t1 = a.stare()['text']
    a.taste('Home', 'Control+Delete')
    t2 = a.stare()['text']
    clic_css(a, '[data-lh-aplicatie="word"] [data-lh-zona] td[data-r="0"][data-c="0"]', dx=0.98)
    a.taste('End', 'Control+Backspace')
    t3 = a.stare()['tabele']
    return {'ctrl_bs_la_capat': t1, 'apoi_ctrl_del_la_inceput': t2, 'ctrl_bs_in_celula': t3}


@test('word-F027_anulare')
def t27(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['']})
    a.clic('text:1'); a.scrie('abc'); a.taste('Backspace'); a.scrie('de')
    t0 = a.stare()['text']
    pasi = []
    for _ in range(4):
        a.taste('Control+z'); pasi.append(a.stare()['text'][0])
    b = App(ctx, port, 'word', {'paragrafe': ['']})
    b.clic('text:1'); b.scrie('xyz'); b.taste('Backspace', 'Backspace')
    p2 = []
    for _ in range(3):
        b.taste('Control+z'); p2.append(b.stare()['text'][0])
    return {'dupa_abc_bs_de': t0, 'ctrl_z_succesive': pasi, 'xyz_bs_bs__ctrl_z': p2}


@test('word-F083_ctrl_w')
def t83(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['']})
    a.clic('text:1'); a.scrie('Tema mea')
    a.taste('Control+w')
    d1 = a.stare()['dialog']
    a.clic('fereastra:Cancel')
    s1 = a.stare('text', 'documente_deschise', 'dialog')
    a.taste('Control+w'); a.clic("fereastra:Don't Save")
    s2 = a.stare('documente_deschise', 'titlu_fereastra', 'text')
    vizibil = a.pg.evaluate("() => !!LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie')==='word')")
    return {'dialog': d1, 'dupa_cancel': s1, 'dupa_dont_save': s2, 'word_ramane': vizibil}


@test('word-F080_exista')
def t80(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Text']})
    a.taste('F12'); umple(a, 'File name', 'Tema'); a.clic('dialog_salvare:Save')
    s0 = a.stare('nume_fisier', 'fisiere_salvate')
    a.clic('text:1'); a.scrie('x')
    a.taste('F12'); umple(a, 'File name', 'Tema'); a.clic('dialog_salvare:Save')
    return {'prima': s0, 'a_doua': a.stare('nume_fisier', 'dialog', 'dialog_salvare'), 'mesaje': a.mesaje(), 'dialog_deschis': bool(a.tinte('dialog_salvare:'))}


@test('word-F081_clic_fisier_save_as')
def t81(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Text']})
    a.taste('F12'); umple(a, 'File name', 'Compunere'); a.clic('dialog_salvare:Save')
    a.taste('F12')
    lst = a.tinte('lista:')
    c0 = [c for c in campuri(a) if 'File name' in c]
    if lst:
        a.clic(lst[0])
    c1 = [c for c in campuri(a) if 'File name' in c]
    return {'lista': lst, 'inainte': c0, 'dupa_clic': c1}


@test('word-F086_deschis_iar')
def t86(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Text']})
    a.taste('F12'); umple(a, 'File name', 'Poezie'); a.clic('dialog_salvare:Save')
    a.clic('text:1'); a.scrie(' nou')
    a.taste('Control+o')
    rec = [t for t in a.pg.evaluate("a => LH.aplicatii.tinte(a)", 'word') if 'Poezie' in t]
    if rec:
        a.clic(rec[0])
    return {'tinte_poezie': rec, 'stare': a.stare('documente_deschise', 'titlu_fereastra', 'text', 'pagina_backstage'), 'mesaje': a.mesaje()}


@test('word-F103_zone')
def t103(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Text']})
    out = {}
    for t, dx, dy in [('bara_titlu:Document1  -  Word', 0.5, 0.5), ('panglica:Home/Font/Bold', 0.5, 0.5), ('document', 0.5, 0.9), ('bara_derulare:Line down', 0.5, 0.5), ('bara_stare:Page Number', 0.5, 0.5)]:
        try:
            a.clic(t, dx, dy); out[t] = [(e['gest'], e['actiune'], e['tinta']) for e in a.ev()]
        except Exception as e:
            out[t] = repr(e)[:120]
    out['rigla_exista'] = a.pg.evaluate("() => !!document.querySelector('[data-lh-aplicatie=word] [data-lh-eticheta*=Ruler i], [data-lh-aplicatie=word] .lh-ap-rigla')")
    a.clic('fila:View'); out['view_ruler'] = a.tinte('Ruler')
    return out


@test('word-F063_imagine')
def t63(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Poza:']})
    a.clic('fila:Insert'); a.clic('mso:PictureInsertFromFilePowerPoint' if a.exista('mso:PictureInsertFromFilePowerPoint') else 'mso:PicturesInsert' if a.exista('mso:PicturesInsert') else 'panglica:Insert/Illustrations/Pictures')
    m = a.tinte('meniu:')
    dev = [t for t in m if 'Device' in t or 'This' in t]
    if dev:
        a.clic(dev[0])
    umple(a, 'File name', 'vulcan.png'); a.taste('Enter')
    im = a.stare()['imagini']
    if a.exista('imagine:1'):
        a.clic('imagine:1')
    manere = a.pg.evaluate("() => { const r = document.querySelector('[data-lh-aplicatie=word]'); const i = r.querySelector('[data-lh-tinta=imagine]'); return {img: i ? [i.getBoundingClientRect().width, i.getBoundingClientRect().height] : null, manere: r.querySelectorAll('[class*=maner],[data-lh-tinta*=maner]').length}; }")
    return {'meniu': m[:10], 'imagini': im, 'dupa_clic': manere, 'file': a.tinte('fila:')[-3:], 'mesaje': a.mesaje()}


with sesiune() as (ctx, port, blocate):
    for f in [t49, t69, t45, t78, t50, t52, t17, t37, t05, t27, t83, t80, t81, t86, t103, t63]:
        f(ctx, port)
    R['_blocate'] = blocate
rezultat('rez_word', R)
