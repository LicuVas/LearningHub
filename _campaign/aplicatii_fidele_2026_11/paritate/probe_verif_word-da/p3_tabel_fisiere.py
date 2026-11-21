# Probele word-da, partea 3: tabel, fișiere, zoom, file, Backstage (F048-F106) — jucate în poligon
from u import *

T = []
def test(nume):
    def d(f):
        T.append((nume, f)); return f
    return d

DOC = ['Ana are mere.', 'Doi pomi mari.']
CHEI = ('documente_deschise', 'titlu_fereastra', 'nume_fisier', 'folder_fisier', 'dialog_salvare', 'dialog', 'pagina_backstage', 'fisiere_salvate', 'text')


def bs_tinte(a):
    return [t for t in a.tinte() if t.startswith(('backstage', 'lista', 'camp', 'dialog_salvare', 'fereastra', 'arbore', 'meniu:'))]


@test('F048_tabel_grila')
def f048(ctx, port):
    out = {}
    for cheie, (par, k) in {'capat_paragraf': (1, 13), 'paragraf_gol': (2, 0)}.items():
        a = App(ctx, port, 'word', {'paragrafe': ['Orar', '', 'Final']})
        clic_la(a, par, k)
        a.clic('fila:Insert')
        tg = [t for t in a.tinte() if 'Table' in t][:6]
        a.clic('mso:TableInsertGallery'); a.pg.wait_for_timeout(300)
        grila = [t for t in a.tinte('meniu:') if 'Table' in t]
        # trec cu mouse-ul peste 3x2 (previzualizarea / eticheta), apoi clic
        b = a.bbox('meniu:3x2 Table')
        eticheta = None
        if b:
            a.pg.mouse.move(b['x'] + b['w'] / 2, b['y'] + b['h'] / 2); a.pg.wait_for_timeout(200)
            eticheta = a.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=word] *')].filter(e => /\\dx\\d Table/.test(e.textContent || '') && e.children.length === 0 && e.getBoundingClientRect().width > 0).map(e => e.textContent).slice(0, 3)")
            a.clic('meniu:3x2 Table')
        s = a.stare('tabele', 'text', 'selectie')
        out[cheie] = {'tinte_insert': tg, 'grila_n': len(grila), 'grila_exemplu': grila[:3] + grila[-2:], 'eticheta_hover': eticheta, 'dupa': s, 'ev': a.ev()[-1:]}
        a.pg.close()
    return out


@test('F051_tab_in_tabel')
def f051(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Orar', '']})
    clic_la(a, 2, 0)
    a.clic('fila:Insert'); a.clic('mso:TableInsertGallery'); a.pg.wait_for_timeout(300); a.clic('meniu:2x2 Table')
    a.scrie('L'); a.taste('Tab'); a.scrie('Ma'); a.taste('Tab'); a.scrie('Mi'); a.taste('Tab'); a.scrie('J')
    t1 = a.stare()['tabele']
    a.taste('Tab'); a.scrie('V')
    t2 = a.stare()['tabele']
    return {'dupa_3_tab': t1, 'tab_ultima_celula': t2, 'ev': a.ev()[-3:]}


@test('F074_document_nou')
def f074(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    a.taste('Control+n'); r1 = a.stare(*CHEI)
    a.clic('fila:File'); a.pg.wait_for_timeout(300)
    t_home = bs_tinte(a)
    blank = [t for t in a.tinte() if 'Blank' in t]
    r2 = None
    if blank:
        a.clic(blank[0]); r2 = a.stare(*CHEI)
    a.clic('fila:File'); a.pg.wait_for_timeout(300)
    nou = [t for t in a.tinte() if t.endswith(':New')]
    r3 = None
    if nou:
        a.clic(nou[0]); a.pg.wait_for_timeout(300)
        blank2 = [t for t in a.tinte() if 'Blank' in t]
        if blank2:
            a.clic(blank2[0]); r3 = a.stare(*CHEI)
    return {'ctrl_n': r1, 'tinte_backstage_home': t_home[:40], 'blank_tinte': blank, 'file_home_blank': r2, 'nou_tinte': nou, 'file_new_blank': r3}


@test('F076_ctrl_s')
def f076(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': ['Excursia la munte', 'Ziua 1']})
    a.taste('Control+s'); r1 = a.stare(*CHEI)
    tinte_dlg = bs_tinte(a)
    a.taste('Enter', asteapta=400); r2 = a.stare(*CHEI)
    a.taste('Control+End'); a.scrie(' si 2')
    a.taste('Control+s', asteapta=400); r3 = a.stare(*CHEI)
    return {'ctrl_s_nou': r1, 'tinte_dialog': tinte_dlg, 'dupa_enter': r2, 'ctrl_s_salvat': r3, 'ev': a.ev()[-2:]}


@test('F077_save_as')
def f077(ctx, port):
    out = {}
    a = App(ctx, port, 'word', {'paragrafe': ['Compunere', 'Text']})
    a.taste('F12', asteapta=400)
    out['f12'] = a.stare('dialog_salvare', 'dialog')
    out['tinte_f12'] = bs_tinte(a)
    arb = [t for t in a.tinte() if t.startswith('arbore:')]
    out['arbore'] = arb
    ales = None
    for cand in ['arbore:Desktop', 'arbore:Downloads', 'arbore:Pictures']:
        if cand in arb:
            ales = cand; a.clic(cand); break
    out['folder_ales'] = ales
    out['dupa_folder'] = a.stare('dialog_salvare', 'dialog')
    a.clic('camp:nume_fisier'); a.taste('Control+a'); a.scrie('Tema mea')
    a.clic('dialog_salvare:Save', asteapta=400)
    out['dupa_save'] = a.stare(*CHEI)
    out['fisiere'] = a.stare()['fisiere']
    a.pg.close()
    # File › Save As › Browse, apoi Enter în File name
    a = App(ctx, port, 'word', {'paragrafe': ['Compunere', 'Text']})
    a.clic('fila:File'); a.pg.wait_for_timeout(300)
    sa = [t for t in a.tinte() if t.endswith(':Save As')]
    out['save_as_tinte'] = sa
    if sa:
        a.clic(sa[0]); a.pg.wait_for_timeout(300)
        br = [t for t in a.tinte() if 'Browse' in t]
        out['browse_tinte'] = br
        if br:
            a.clic(br[0], asteapta=400)
            a.clic('camp:nume_fisier'); a.taste('Control+a'); a.scrie('Alta'); a.taste('Enter', asteapta=400)
            out['browse_enter'] = a.stare(*CHEI)
    return out


@test('F082_semne_interzise')
def f082(ctx, port):
    out = {}
    for nume in ['Tema/1', 'Ce?', 'a:b']:
        a = App(ctx, port, 'word', {'paragrafe': ['Compunere']})
        a.taste('F12', asteapta=400)
        a.clic('camp:nume_fisier'); a.taste('Control+a'); a.scrie(nume)
        a.clic('dialog_salvare:Save', asteapta=400)
        out[nume] = {'stare': a.stare('nume_fisier', 'fisiere_salvate', 'dialog_salvare'), 'mesaje': nesim(a)}
        a.pg.close()
    return out


@test('F084_inchidere_x')
def f084(ctx, port):
    out = {}
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    a.clic('bara_titlu:Close', asteapta=400)
    out['un_document_nemodificat'] = a.stare('documente_deschise', 'titlu_fereastra', 'dialog')
    out['ecran_dupa'] = a.pg.evaluate("() => { const r = LH.aplicatii.radacini().find(r => r.getAttribute('data-lh-aplicatie') === 'word'); return r ? {vizibil: r.getBoundingClientRect().height, text: (r.innerText || '').slice(0, 200)} : null }")
    a.pg.close()
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    a.taste('Control+n'); a.clic('bara_titlu:Close', asteapta=400)
    out['doua_documente'] = a.stare('documente_deschise', 'titlu_fereastra', 'dialog')
    a.pg.close()
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    a.taste('Control+End'); a.scrie(' X')
    a.clic('bara_titlu:Close', asteapta=400)
    out['modificat'] = a.stare('documente_deschise', 'dialog')
    return out


@test('F085_deschidere')
def f085(ctx, port):
    out = {}
    fis = [{'nume': 'Poezie.docx', 'text': ['Somnoroase pasarele']}, {'nume': 'Orar.docx', 'text': ['Luni']}]
    a = App(ctx, port, 'word', {'paragrafe': DOC, 'fisiere': fis, 'recente': [{'nume': 'Poezie.docx'}]})
    a.taste('Control+o', asteapta=400)
    out['ctrl_o'] = a.stare('pagina_backstage')
    out['tinte_open'] = [t for t in a.tinte() if t.startswith(('backstage', 'lista', 'meniu'))][:40]
    rec = [t for t in a.tinte() if 'Poezie' in t]
    out['rand_recent'] = rec
    if rec:
        a.clic(rec[0], asteapta=400)
        out['din_recent'] = a.stare('documente_deschise', 'titlu_fereastra', 'text', 'nume_fisier')
    a.pg.close()
    a = App(ctx, port, 'word', {'paragrafe': DOC, 'fisiere': fis})
    a.clic('fila:File'); a.pg.wait_for_timeout(300)
    op = [t for t in a.tinte() if t.endswith(':Open')]
    out['open_tinte'] = op
    if op:
        a.clic(op[0]); a.pg.wait_for_timeout(300)
    br = [t for t in a.tinte() if 'Browse' in t]
    out['browse'] = br
    if br:
        a.clic(br[0], asteapta=400)
        out['dialog_open'] = a.stare('dialog')
        out['lista'] = [t for t in a.tinte() if t.startswith('lista:')]
        if 'lista:Orar.docx' in out['lista']:
            a.clic('lista:Orar.docx', dublu=True, asteapta=500)
            out['dublu_clic'] = a.stare('documente_deschise', 'titlu_fereastra', 'text', 'dialog')
    a.pg.close()
    # Browse → alege → butonul Open
    a = App(ctx, port, 'word', {'paragrafe': DOC, 'fisiere': fis})
    a.taste('Control+o', asteapta=300)
    br = [t for t in a.tinte() if 'Browse' in t]
    if br:
        a.clic(br[0], asteapta=400)
        if a.exista('lista:Poezie.docx'):
            a.clic('lista:Poezie.docx')
            btn = [t for t in a.tinte() if t.startswith(('fereastra:', 'dialog_salvare:')) and 'Open' in t]
            out['butoane_open'] = btn
            if btn:
                a.clic(btn[0], asteapta=400)
            out['buton_open'] = a.stare('documente_deschise', 'titlu_fereastra', 'text', 'dialog')
    return out


@test('F095_zoom')
def f095(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    z = "() => { const e = LH.aplicatii.element('word', 'zoom:Zoom'); return e ? (e.getAttribute('data-lh-eticheta') + ' | ' + (e.textContent || '').trim()) : null }"
    out = {'start': a.pg.evaluate(z)}
    for i in range(2):
        a.clic('zoom:Zoom In (Ctrl +)'); out['plus%d' % (i + 1)] = a.pg.evaluate(z)
    for i in range(4):
        a.clic('zoom:Zoom Out (Ctrl -)'); out['minus%d' % (i + 1)] = a.pg.evaluate(z)
    out['font_pagina'] = a.pg.evaluate("() => { const z = LH.aplicatii.radacini()[0].querySelector('[data-lh-zona] [data-lh-tinta=\"text\"]'); return z ? getComputedStyle(z).fontSize + ' w=' + Math.round(z.getBoundingClientRect().width) : null }")
    out['ev'] = a.ev()[-2:]
    return out


@test('F101_file_panglica')
def f101(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    out = {}
    for f in ['Insert', 'Layout', 'View', 'Home']:
        a.clic('fila:' + f)
        tt = [t for t in a.tinte() if t.startswith(('panglica:', 'meniu_derulant:', 'lansator:'))]
        out[f] = {'n': len(tt), 'exemplu': tt[:4], 'selectata': a.pg.evaluate("f => { const e = LH.aplicatii.element('word', 'fila:' + f); return e ? (e.getAttribute('aria-selected') || e.getAttribute('data-lh-selectat')) : null }", f)}
    out['mesaje'] = nesim(a)
    return out


@test('F106_file_backstage')
def f106(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    out = {}
    a.clic('fila:File'); a.pg.wait_for_timeout(300)
    out['dupa_file'] = a.stare('pagina_backstage')
    inapoi = [t for t in a.tinte() if 'Back' in t or 'back' in t]
    out['tinte_inapoi'] = inapoi
    if inapoi:
        a.clic(inapoi[0]); out['dupa_back'] = a.stare('pagina_backstage')
    a.clic('fila:File'); a.pg.wait_for_timeout(300)
    a.taste('Escape'); out['dupa_esc'] = a.stare('pagina_backstage')
    a.scrie('Z'); out['tastare_dupa_esc'] = a.stare()['text']
    return out


if __name__ == '__main__':
    import sys
    alese = sys.argv[1:]
    ruleaza([t for t in T if not alese or t[0].split('_')[0] in alese], 'rez_p3' + ('_' + '_'.join(alese) if alese else ''))
