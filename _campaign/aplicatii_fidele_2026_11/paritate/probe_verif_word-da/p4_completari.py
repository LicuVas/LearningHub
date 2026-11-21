# Probele word-da, partea 4: completări — ✕ pe ultimul document (F084), folderul din Save As (F077), mesajul zoomului (F095),
# grila Insert › Table la trecere și la atingere (F048), Undo pe panglică (F024)
from u import *

T = []
def test(nume):
    def d(f):
        T.append((nume, f)); return f
    return d

DOC = ['Ana are mere.', 'Doi pomi mari.']


@test('F084b_ultimul_document')
def f084b(ctx, port):
    out = {}
    a = App(ctx, port, 'word', {'paragrafe': DOC, 'nume': 'Tema', 'salvat': True, 'modificat': False})
    a.clic('bara_titlu:Close', asteapta=400)
    out['salvat_x'] = {'s': a.stare('documente_deschise', 'titlu_fereastra', 'dialog'), 'clasa': a.pg.evaluate("() => LH.aplicatii.radacini()[0].className"), 'ev': a.ev()[-1:]}
    a.pg.close()
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    a.clic('bara_titlu:Close', asteapta=400)
    a.clic("fereastra:Don't Save", asteapta=400)
    out['modificat_dont_save'] = {'s': a.stare('documente_deschise', 'titlu_fereastra', 'dialog'), 'clasa': a.pg.evaluate("() => LH.aplicatii.radacini()[0].className"), 'ev': a.ev()[-1:]}
    a.pg.close()
    # Ctrl+N (Document2), ✕ → rămâne Document1; ✕ încă o dată pe Document1 (modificat) → întrebare
    a = App(ctx, port, 'word', {'paragrafe': DOC, 'nume': 'Tema', 'salvat': True, 'modificat': False})
    a.taste('Control+n'); a.clic('bara_titlu:Close', asteapta=400)
    r1 = a.stare('documente_deschise', 'titlu_fereastra')
    a.clic('bara_titlu:Close', asteapta=400)
    out['doua_apoi_ultimul'] = {'dupa_primul_x': r1, 'dupa_al_doilea_x': a.stare('documente_deschise', 'titlu_fereastra', 'dialog'), 'clasa': a.pg.evaluate("() => LH.aplicatii.radacini()[0].className")}
    return out


@test('F077b_folder')
def f077b(ctx, port):
    out = {}
    a = App(ctx, port, 'word', {'paragrafe': ['Compunere'], 'fisiere': [{'nume': 'Vechi.docx', 'folder': 'Desktop', 'text': ['x']}]})
    a.taste('F12', asteapta=400)
    arb = [t for t in a.tinte() if t.startswith('arbore:')]
    out['arbore'] = arb
    for cand in ['arbore:Desktop', 'arbore:Acest PC', 'arbore:Acasă']:
        if cand in arb:
            a.clic(cand, asteapta=300)
            out['clic_' + cand] = {'lista': [t for t in a.tinte() if t.startswith('lista:')], 'adresa': a.pg.evaluate("() => { const e = [...document.querySelectorAll('[data-lh-aplicatie=word] [data-lh-eticheta]')].find(x => /Adres|Address/.test(x.getAttribute('data-lh-eticheta'))); return e ? e.getAttribute('data-lh-eticheta') + ' | ' + (e.textContent || '').trim().slice(0, 80) : null }"), 'mesaje': nesim(a), 'ev': a.ev()[-1:]}
            if cand == 'arbore:Desktop':
                break
    a.clic('camp:nume_fisier'); a.taste('Control+a'); a.scrie('Pe desktop')
    a.clic('dialog_salvare:Save', asteapta=400)
    out['dupa_save'] = a.stare('nume_fisier', 'folder_fisier', 'fisiere_salvate')
    out['fisiere'] = [(f['nume'], f['folder']) for f in a.stare()['fisiere']]
    a.pg.close()
    # fără fișiere în alt folder: ce foldere se pot alege
    a = App(ctx, port, 'word', {'paragrafe': ['Compunere']})
    a.taste('F12', asteapta=400)
    out['fara_continut_arbore'] = [t for t in a.tinte() if t.startswith('arbore:')]
    a.clic('arbore:Acest PC', asteapta=300)
    out['fara_continut_acest_pc'] = {'mesaje': nesim(a), 'ev': a.ev()[-1:], 'lista': [t for t in a.tinte() if t.startswith('lista:')]}
    a.poza('F077b_acest_pc')
    return out


@test('F095b_zoom_mesaj')
def f095b(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    a.clic('zoom:Zoom In (Ctrl +)', asteapta=300)
    m1 = nesim(a)
    a.clic('zoom', asteapta=300)
    m2 = nesim(a)
    a.poza('F095b_zoom')
    return {'mesaj_plus': m1, 'mesaj_glisor': m2, 'ev': a.ev()}


@test('F048b_grila')
def f048b(ctx, port):
    out = {}
    a = App(ctx, port, 'word', {'paragrafe': ['Orar', '']})
    clic_la(a, 2, 0)
    a.clic('fila:Insert'); a.clic('mso:TableInsertGallery'); a.pg.wait_for_timeout(300)
    b = a.bbox('meniu:4x3 Table')
    a.pg.mouse.move(b['x'] + b['w'] / 2, b['y'] + b['h'] / 2); a.pg.wait_for_timeout(300)
    out['la_trecere'] = a.pg.evaluate("""() => { const r = LH.aplicatii.radacini()[0];
      const txt = [...r.querySelectorAll('*')].filter(e => e.children.length === 0 && e.getBoundingClientRect().width > 0 && /(Table|Tabel)/.test(e.textContent || '')).map(e => e.textContent.trim()).slice(0, 8);
      const aprinse = [...r.querySelectorAll('[data-lh-tinta^="meniu"]')].filter(e => /Table$/.test(e.getAttribute('data-lh-id') || e.getAttribute('data-lh-tinta')) && (e.classList.contains('activ') || e.classList.contains('lh-ap-aprins') || e.hasAttribute('data-lh-selectat') || getComputedStyle(e).backgroundColor !== 'rgba(0, 0, 0, 0)')).length;
      return {texte: txt, celule_colorate: aprinse}; }""")
    a.poza('F048b_trecere')
    a.pg.close()
    # atingere (ecran tactil): un tap
    c2 = ctx.browser.new_context(viewport={'width': 1400, 'height': 900}, has_touch=True)
    c2.route('**/*', lambda r: r.continue_() if r.request.url.startswith(('http://127.0.0.1', 'data:', 'blob:')) else r.abort())
    a = App(c2, port, 'word', {'paragrafe': ['Orar', '']})
    x, y = punct(a, 2, 0)
    a.pg.touchscreen.tap(x, y); a.pg.wait_for_timeout(300)
    b = a.bbox('fila:Insert'); a.pg.touchscreen.tap(b['x'] + b['w'] / 2, b['y'] + b['h'] / 2); a.pg.wait_for_timeout(300)
    b = a.bbox('mso:TableInsertGallery'); a.pg.touchscreen.tap(b['x'] + b['w'] / 2, b['y'] + b['h'] / 2); a.pg.wait_for_timeout(400)
    b = a.bbox('meniu:3x2 Table')
    a.pg.touchscreen.tap(b['x'] + b['w'] / 2, b['y'] + b['h'] / 2); a.pg.wait_for_timeout(400)
    out['un_tap'] = {'tabele': a.stare()['tabele'], 'grila_deschisa': a.exista('meniu:3x2 Table')}
    c2.close()
    return out


@test('F024b_undo_panglica')
def f024b(ctx, port):
    a = App(ctx, port, 'word', {'paragrafe': DOC})
    out = {}
    for f in ['Home', 'Draw']:
        a.clic('fila:' + f)
        out[f] = [t for t in a.tinte() if 'Undo' in t or 'Redo' in t or 'Repeat' in t]
    return out


if __name__ == '__main__':
    import sys
    alese = sys.argv[1:]
    ruleaza([t for t in T if not alese or t[0].split('_')[0] in alese], 'rez_p4' + ('_' + '_'.join(alese) if alese else ''))
