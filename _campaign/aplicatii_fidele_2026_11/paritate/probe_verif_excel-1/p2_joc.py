# Verificatorul excel-1: funcțiile jucate în poligon (mouse și tastatură adevărate, headless).
import sys, json, traceback
sys.path.insert(0, r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-1')
from comun import *

REZ = {}
OUT = r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-1/rezultate_joc.json'
NOTE = {'A1': 'Elev', 'B1': 'Nota', 'A2': 'Ana', 'B2': 9, 'A3': 'Bogdan', 'B3': 7, 'A4': 'Dan', 'B4': 8}


def tasteaza_in(pg, a, text):
    clic(pg, 'celula:' + a)
    pg.keyboard.type(text)
    pg.keyboard.press('Enter')
    pg.wait_for_timeout(150)


def test(nume):
    def dec(fn):
        def run(pg):
            try:
                fn(pg)
            except Exception as e:
                scrie(pg, REZ, nume + '.EROARE', traceback.format_exc()[-600:])
        run.nume = nume
        TESTE.append(run)
        return fn
    return dec


TESTE = []


@test('F108_merge')
def _(pg):
    deschide(pg, {'celule': {'A1': 'Titlu', 'A2': 1}, 'selectie': 'A1'})
    clic(pg, 'celula:A1')
    p = el(pg, 'celula:C1'); pg.keyboard.down('Shift'); pg.mouse.click(p['x'], p['y']); pg.keyboard.up('Shift'); pg.wait_for_timeout(200)
    scrie(pg, REZ, 'F108.sel', stare(pg)['selectie'])
    clic(pg, 'panglica:Home/Alignment/Merge & Center')
    s = stare(pg); scrie(pg, REZ, 'F108.dupa1', {'fmt': s['format_celule'], 'sel': s['selectie'], 'ev': ev(pg, 1)})
    scrie(pg, REZ, 'F108.ecranA1', el(pg, 'celula:A1'))
    clic(pg, 'panglica:Home/Alignment/Merge & Center')
    s = stare(pg); scrie(pg, REZ, 'F108.dupa2', {'fmt': s['format_celule'], 'sel': s['selectie'], 'ev': ev(pg, 1)})


@test('F193_ctrlw')
def _(pg):
    deschide(pg, {'celule': {'A1': 'x'}, 'nume': 'Note.xlsx'})
    s = stare(pg); scrie(pg, REZ, 'F193.inainte', {k: s[k] for k in ('titlu_fereastra', 'registru_activ', 'registre', 'nume_fisier')})
    clic(pg, 'celula:B2')
    pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
    s = stare(pg); scrie(pg, REZ, 'F193.dupa', {k: s[k] for k in ('titlu_fereastra', 'registru_activ', 'registre', 'dialog')})
    scrie(pg, REZ, 'F193.ev', ev(pg, 2))
    scrie(pg, REZ, 'F193.gol_vizibil', pg.evaluate("() => { const g = document.querySelector('.lh-ap-x-gol'); return g ? getComputedStyle(g).display : null }"))
    # File › Close pe un registru nou, nemodificat (Ctrl+N apoi File › Close)
    pg.keyboard.press('Control+n'); pg.wait_for_timeout(300)
    s = stare(pg); scrie(pg, REZ, 'F193.dupa_ctrln', {k: s[k] for k in ('titlu_fereastra', 'registru_activ')})
    clic(pg, 'fila:File')
    bs = tinte(pg, 'backstage:'); scrie(pg, REZ, 'F193.backstage', bs[:30])
    if 'backstage:Close' in bs:
        clic(pg, 'backstage:Close')
    s = stare(pg); scrie(pg, REZ, 'F193.dupa_file_close', {k: s[k] for k in ('titlu_fereastra', 'registru_activ', 'dialog')})


@test('F197_open')
def _(pg):
    deschide(pg, {'celule': {'A1': 'x'}, 'nume': 'Note.xlsx'})
    pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
    pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
    s = stare(pg); scrie(pg, REZ, 'F197.ctrl_o', {k: s[k] for k in ('pagina_backstage', 'dialog', 'registru_activ')})
    bs = tinte(pg, 'backstage:'); scrie(pg, REZ, 'F197.backstage', bs[:40])
    txt = pg.evaluate("() => { const b = document.querySelector('[data-lh-aplicatie=excel]'); return b.innerText.slice(0, 1500) }")
    scrie(pg, REZ, 'F197.text_pagina', 'Note.xlsx' in txt)
    for t in ('backstage:Browse', 'backstage:This PC'):
        if t in bs:
            clic(pg, t); scrie(pg, REZ, 'F197.' + t, {'ev': ev(pg, 1), 'mesaj': mesaj_central(pg), 'dialog': stare(pg)['dialog']})
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
    s = stare(pg); scrie(pg, REZ, 'F197.ctrl_f12', {'pag': s['pagina_backstage'], 'dialog': s['dialog'], 'ev': ev(pg, 1)})


@test('F010_apostrof')
def _(pg):
    deschide(pg, {'celule': {}, 'selectie': 'A1'})
    tasteaza_in(pg, 'A1', "'007")
    s = stare(pg); scrie(pg, REZ, 'F010.celula', s['celule'].get('A1'))
    scrie(pg, REZ, 'F010.ecran', text_celula(pg, 'A1'))
    # orice semn în celulă în afară de text (triunghiul verde)
    scrie(pg, REZ, 'F010.copii', pg.evaluate("""() => { const e = LH.aplicatii.element('excel', 'celula:A1'); return [...e.querySelectorAll('*')].map(x => x.className + '|' + (x.getAttribute('title')||'')) }"""))


@test('F001_virgula')
def _(pg):
    deschide(pg, {'celule': {}, 'selectie': 'A1'})
    tasteaza_in(pg, 'A1', '7,5')
    s = stare(pg); scrie(pg, REZ, 'F001.celula', s['celule'].get('A1'))
    scrie(pg, REZ, 'F001.ecran', text_celula(pg, 'A1'))


@test('F016_delete_data')
def _(pg):
    deschide(pg, {'celule': {}, 'selectie': 'A1'})
    tasteaza_in(pg, 'A1', '8.5')
    s = stare(pg); scrie(pg, REZ, 'F016.dupa_8.5', {'c': s['celule'].get('A1'), 'f': s['format_celule'].get('A1')})
    clic(pg, 'celula:A1'); pg.keyboard.press('Delete'); pg.wait_for_timeout(150)
    s = stare(pg); scrie(pg, REZ, 'F016.dupa_delete', {'c': s['celule'].get('A1'), 'f': s['format_celule'].get('A1')})
    tasteaza_in(pg, 'A1', '8,5')
    s = stare(pg); scrie(pg, REZ, 'F016.dupa_8,5', {'c': s['celule'].get('A1'), 'f': s['format_celule'].get('A1')})
    scrie(pg, REZ, 'F016.ecran', text_celula(pg, 'A1')['text'])


@test('F074_min')
def _(pg):
    deschide(pg, {'celule': {'A2': 'a', 'A3': 'b', 'A4': 'c', 'B2': 5, 'B3': 3, 'B4': 8, 'C2': 4, 'C3': 2.5, 'C4': 9}, 'selectie': 'D1'})
    tasteaza_in(pg, 'D1', '=MIN(B2:C4)')
    tasteaza_in(pg, 'E1', '=MIN(A2:A4)')
    s = stare(pg); scrie(pg, REZ, 'F074', {'D1': s['celule'].get('D1'), 'E1': s['celule'].get('E1')})


@test('F056_comparari')
def _(pg):
    deschide(pg, {'celule': {'B2': 9}, 'selectie': 'C1'})
    fs = ['=B2>5', '=B2<5', '=B2>=9', '=B2<=8', '=B2=9', '=B2<>9', '=IF(B2>=5;"admis";"respins")']
    for i, f in enumerate(fs):
        tasteaza_in(pg, 'C' + str(i + 1), f)
    s = stare(pg); scrie(pg, REZ, 'F056', {('C' + str(i + 1)): (fs[i], (s['celule'].get('C' + str(i + 1)) or {}).get('text')) for i in range(len(fs))})


@test('F127_procent')
def _(pg):
    deschide(pg, {'celule': {'A1': 0.125, 'A2': 0.5}, 'selectie': 'A1'})
    clic(pg, 'celula:A1'); clic(pg, 'panglica:Home/Number/Percent Style')
    clic(pg, 'celula:A2'); pg.keyboard.press('Control+Shift+Digit5'); pg.wait_for_timeout(200)
    s = stare(pg); scrie(pg, REZ, 'F127', {'A1': s['celule'].get('A1'), 'A2': s['celule'].get('A2'), 'fmt': s['format_celule'], 'ev': ev(pg, 1)})
    scrie(pg, REZ, 'F127.ecran', [text_celula(pg, 'A1')['text'], text_celula(pg, 'A2')['text']])


@test('F053_zoom')
def _(pg):
    deschide(pg, {'celule': NOTE, 'selectie': 'A1'})
    z = lambda: pg.evaluate("() => [...document.querySelectorAll('[data-lh-eticheta^=\"Zoom \"]')].map(x => x.getAttribute('data-lh-eticheta') + '|' + x.textContent.trim())")
    scrie(pg, REZ, 'F053.inainte', z())
    clic(pg, 'zoom:Zoom In'); clic(pg, 'zoom:Zoom In')
    scrie(pg, REZ, 'F053.dupa2plus', z())
    clic(pg, 'zoom:Zoom Out')
    scrie(pg, REZ, 'F053.dupa_minus', z())
    scrie(pg, REZ, 'F053.ev', ev(pg, 3))


def doua_foi(pg, cu_date=True):
    deschide(pg, {'foi': [{'nume': 'Sheet1', 'celule': {'A1': 'a'}}, {'nume': 'Sheet2', 'celule': {'A1': 'b'} if cu_date else {}}, {'nume': 'Sheet3', 'celule': {}}]})


@test('F173_trage_fila')
def _(pg):
    doua_foi(pg)
    a = el(pg, 'fila_foii:Sheet3'); b = el(pg, 'fila_foii:Sheet1')
    pg.mouse.move(a['x'], a['y']); pg.mouse.down()
    pg.mouse.move(a['x'] - 20, a['y'], steps=4)
    pg.mouse.move(b['x'] - b['w'] / 2 + 3, b['y'], steps=8); pg.wait_for_timeout(150)
    semn = pg.evaluate("() => { const m = document.querySelector('.lh-ap-x-ff-loc'); return m ? {left: m.style.left, vizibil: getComputedStyle(m).display} : null }")
    scrie(pg, REZ, 'F173.semn_in_tragere', semn)
    pg.mouse.up(); pg.wait_for_timeout(250)
    s = stare(pg); scrie(pg, REZ, 'F173.foi', {'foi': s['foi'], 'activa': s['foaie_activa'], 'ev': ev(pg, 1)})


@test('F165_sterge_foaie_cu_date')
def _(pg):
    doua_foi(pg)
    clic(pg, 'fila_foii:Sheet2', dreapta=True)
    m = tinte(pg, 'meniu:'); scrie(pg, REZ, 'F165.meniu', m)
    clic(pg, 'meniu:Delete')
    s = stare(pg); scrie(pg, REZ, 'F165.dialog', s['dialog'])
    scrie(pg, REZ, 'F165.butoane', tinte(pg, 'fereastra:'))
    clic(pg, 'fereastra:Delete')
    s = stare(pg); scrie(pg, REZ, 'F165.dupa', {'foi': s['foi'], 'activa': s['foaie_activa'], 'dialog': s['dialog'], 'ev': ev(pg, 1)})
    # foaia goală: dispare fără întrebare
    clic(pg, 'fila_foii:Sheet3', dreapta=True); clic(pg, 'meniu:Delete')
    s = stare(pg); scrie(pg, REZ, 'F165.goala', {'foi': s['foi'], 'dialog': s['dialog']})


@test('F168_singura_foaie')
def _(pg):
    deschide(pg, {'celule': {'A1': 'x'}})
    clic(pg, 'fila_foii:Sheet1', dreapta=True); clic(pg, 'meniu:Delete')
    s = stare(pg); scrie(pg, REZ, 'F168.dialog', {'dialog': s['dialog'], 'mesaj': s['fereastra_mesaj'], 'foi': s['foi'], 'ev': ev(pg, 1)})


@test('F156_nume_luat')
def _(pg):
    doua_foi(pg)
    clic(pg, 'fila_foii:Sheet2', dublu=True)
    pg.keyboard.press('Control+a'); pg.keyboard.type('SHEET1'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
    s = stare(pg); scrie(pg, REZ, 'F156.dialog', {'dialog': s['dialog'], 'mesaj': s['fereastra_mesaj'], 'foi': s['foi']})
    scrie(pg, REZ, 'F156.butoane', tinte(pg, 'fereastra:'))
    clic(pg, 'fereastra:OK'); pg.wait_for_timeout(300)
    scrie(pg, REZ, 'F156.dupa_ok', pg.evaluate("() => { const a = document.activeElement; return {tag: a.tagName, val: a.value, inFila: !!a.closest('[data-lh-tinta=\"fila_foii\"],[data-lh-tinta^=\"fila_foii\"]'), sel: a.selectionStart + '-' + a.selectionEnd} }"))
    pg.keyboard.press('Control+a'); pg.keyboard.type('Nou'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
    scrie(pg, REZ, 'F156.final', stare(pg)['foi'])


def grafic(pg, rand='meniu:Clustered Column'):
    clic(pg, 'fila:Insert'); clic(pg, 'meniu_derulant:Insert/Charts/Insert Column or Bar Chart'); clic(pg, rand)


@test('F025_F032_grafic')
def _(pg):
    deschide(pg, {'celule': NOTE, 'selectie': 'A1'})
    clic(pg, 'celula:A2'); grafic(pg)
    s = stare(pg); g = (s['grafice'] or [{}])[0]
    scrie(pg, REZ, 'F025.o_serie', {'tip': s['tip_grafic'], 'serii': s['serii_grafic'], 'cat': s['categorii_grafic'], 'titlu': g.get('titlu'), 'legenda': g.get('legenda'), 'zona': g.get('zona'), 'ev': ev(pg, 1)})
    scrie(pg, REZ, 'F025.svg', pg.evaluate("() => { const s = document.querySelector('[data-lh-aplicatie=excel] svg rect') ; return document.querySelectorAll('[data-lh-tinta^=\"grafic:\"]').length }"))
    # două serii
    deschide(pg, {'celule': dict(NOTE, C1='Teza', C2=10, C3=6, C4=7), 'selectie': 'B3'})
    clic(pg, 'celula:B3'); grafic(pg)
    s = stare(pg); g = (s['grafice'] or [{}])[0]
    scrie(pg, REZ, 'F032.doua_serii', {'serii': s['serii_grafic'], 'titlu': g.get('titlu'), 'legenda': g.get('legenda')})
    scrie(pg, REZ, 'F032.legenda_loc', pg.evaluate("() => { const l = document.querySelector('.lh-ap-x-gr-leg-el'); const t = document.querySelector('[data-lh-tinta=\"grafic:1/titlu\"]'); if (!l || !t) return null; const a = l.getBoundingClientRect(), b = t.getBoundingClientRect(); return {leg_y: a.top, titlu_y: b.top, text: l.parentElement.innerText} }"))
    # radial: Insert Pie
    deschide(pg, {'celule': NOTE, 'selectie': 'A1'})
    clic(pg, 'celula:A2'); clic(pg, 'fila:Insert'); clic(pg, 'meniu_derulant:Insert/Charts/Insert Pie or Doughnut Chart')
    m = tinte(pg, 'meniu:'); scrie(pg, REZ, 'F032.meniu_pie', m)
    if 'meniu:Pie' in m:
        clic(pg, 'meniu:Pie')
    s = stare(pg); g = (s['grafice'] or [{}])[0]
    scrie(pg, REZ, 'F032.pie', {'tip': s['tip_grafic'], 'titlu': g.get('titlu'), 'legenda': g.get('legenda'), 'mesaj': mesaj_central(pg), 'ev': ev(pg, 1)})


@test('F037_titlu')
def _(pg):
    deschide(pg, {'celule': dict(NOTE, C1='Teza', C2=10, C3=6, C4=7), 'selectie': 'A1'})
    clic(pg, 'celula:A2'); grafic(pg)
    clic(pg, 'grafic:1/titlu'); pg.wait_for_timeout(200)
    scrie(pg, REZ, 'F037.ales', stare(pg)['grafic_element_ales'])
    pg.keyboard.type('Notele clasei'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
    s = stare(pg); scrie(pg, REZ, 'F037.dupa', {'titlu': (s['grafice'] or [{}])[0].get('titlu'), 'ales': s['grafic_element_ales'], 'A2': s['celule'].get('A2')})
    scrie(pg, REZ, 'F037.ecran', pg.evaluate("() => { const t = document.querySelector('[data-lh-tinta=\"grafic:1/titlu\"]'); return t ? t.innerText : null }"))


@test('F051_grafic_viu')
def _(pg):
    deschide(pg, {'celule': NOTE, 'selectie': 'A1'})
    clic(pg, 'celula:A2'); grafic(pg)
    v0 = (stare(pg)['grafice'] or [{}])[0].get('valori')
    nb = lambda: pg.evaluate("() => { const g = document.querySelector('[data-lh-tinta=\"grafic:1\"]'); return g ? g.querySelectorAll('rect').length : null }")
    n0 = nb()
    tasteaza_in(pg, 'B2', '2')
    v1 = (stare(pg)['grafice'] or [{}])[0].get('valori')
    clic(pg, 'celula:B3'); pg.keyboard.press('Delete'); pg.wait_for_timeout(250)
    v2 = (stare(pg)['grafice'] or [{}])[0].get('valori')
    scrie(pg, REZ, 'F051', {'v0': v0, 'v1': v1, 'v2': v2, 'rect0': n0, 'rect2': nb()})


@test('F043_etichete')
def _(pg):
    deschide(pg, {'celule': NOTE, 'selectie': 'A1'})
    clic(pg, 'celula:A2'); grafic(pg, 'meniu:Clustered Bar')
    s = stare(pg); scrie(pg, REZ, 'F043.tip', s['tip_grafic'])
    md = [x for x in tinte(pg) if 'Add Chart Element' in x]; scrie(pg, REZ, 'F043.ace', md)
    if md:
        clic(pg, md[0]); scrie(pg, REZ, 'F043.meniu', tinte(pg, 'meniu:'))
        if 'meniu:Data Labels' in tinte(pg, 'meniu:'):
            clic(pg, 'meniu:Data Labels'); pg.wait_for_timeout(200)
            scrie(pg, REZ, 'F043.bar', {'sub': tinte(pg, 'meniu:'), 'mesaj': mesaj_central(pg), 'et': stare(pg)['etichete_date'], 'ev': ev(pg, 1)})
    # control: pe Clustered Column etichetele există
    deschide(pg, {'celule': NOTE, 'selectie': 'A1'})
    clic(pg, 'celula:A2'); grafic(pg)
    md = [x for x in tinte(pg) if 'Add Chart Element' in x]
    if md:
        clic(pg, md[0]); clic(pg, 'meniu:Data Labels'); pg.wait_for_timeout(200)
        sub = tinte(pg, 'meniu:'); scrie(pg, REZ, 'F043.col_sub', sub)
        if 'meniu:Outside End' in sub:
            clic(pg, 'meniu:Outside End'); scrie(pg, REZ, 'F043.col_et', stare(pg)['etichete_date'])


@test('F088_ctrld')
def _(pg):
    deschide(pg, {'celule': {'A1': 5, 'A2': '=A1*2', 'B1': 1, 'C1': 2}, 'selectie': 'A2'})
    clic(pg, 'celula:A2'); p = el(pg, 'celula:A4'); pg.keyboard.down('Shift'); pg.mouse.click(p['x'], p['y']); pg.keyboard.up('Shift')
    pg.keyboard.press('Control+d'); pg.wait_for_timeout(200)
    s = stare(pg); scrie(pg, REZ, 'F088.ctrl_d', {a: s['celule'].get(a) for a in ('A3', 'A4')})
    clic(pg, 'celula:A2'); p = el(pg, 'celula:C2'); pg.keyboard.down('Shift'); pg.mouse.click(p['x'], p['y']); pg.keyboard.up('Shift')
    pg.keyboard.press('Control+r'); pg.wait_for_timeout(200)
    s = stare(pg); scrie(pg, REZ, 'F088.ctrl_r', {a: s['celule'].get(a) for a in ('B2', 'C2')})
    scrie(pg, REZ, 'F088.ev', ev(pg, 1))


@test('F005_sortare_formule')
def _(pg):
    c = {'A1': 'Produs', 'B1': 'Pret', 'C1': 'Cant', 'D1': 'Total', 'A2': 'mere', 'B2': 2, 'C2': 3, 'D2': '=B2*C2',
         'A3': 'pere', 'B3': 5, 'C3': 1, 'D3': '=B3*C3', 'A4': 'nuci', 'B4': 9, 'C4': 2, 'D4': '=B4*C4'}
    deschide(pg, {'celule': c, 'selectie': 'B2'})
    clic(pg, 'celula:B3'); clic(pg, 'fila:Data'); clic(pg, 'panglica:Data/Sort & Filter/Sort Z to A')
    s = stare(pg); scrie(pg, REZ, 'F005', {a: s['celule'].get(a) for a in ('A2', 'B2', 'D2', 'A4', 'D4', 'A1')})


@test('F014_antet')
def _(pg):
    c = {'A1': 'Elev', 'B1': 'Nota', 'A2': 'Dan', 'B2': 8, 'A3': 'Ana', 'B3': 9, 'A4': 'Bogdan', 'B4': 7}
    deschide(pg, {'celule': c, 'selectie': 'A2'})
    clic(pg, 'celula:A2'); clic(pg, 'fila:Data'); clic(pg, 'panglica:Data/Sort & Filter/Sort...')
    s = stare(pg); scrie(pg, REZ, 'F014.dialog', s['dialog'])
    cb = pg.evaluate("""() => { const c = document.querySelector('[data-lh-tip="CheckBox"][data-lh-eticheta="My data has headers"]'); if (!c) return null;
        const r = c.getBoundingClientRect(); return {x: r.left + 8, y: r.top + r.height/2, bifat: c.getAttribute('aria-checked') || c.getAttribute('data-lh-bifat') || c.className} }""")
    scrie(pg, REZ, 'F014.bifa', cb)
    # lista Sort by: numele coloanelor
    scrie(pg, REZ, 'F014.text_dialog', pg.evaluate("() => { const d = document.querySelector('[data-lh-tip=\"Window\"]'); return d ? d.innerText.slice(0, 400) : null }"))
    tinte_d = [x for x in tinte(pg) if x.startswith('fereastra:') or x.startswith('meniu') or x.startswith('camp')]
    scrie(pg, REZ, 'F014.tinte', tinte_d[:40])
    if 'fereastra:OK' in tinte_d:
        clic(pg, 'fereastra:OK')
    s = stare(pg); scrie(pg, REZ, 'F014.dupa_ok', {a: (s['celule'].get(a) or {}).get('text') for a in ('A1', 'A2', 'A3', 'A4')})


@test('F102_bara_fx')
def _(pg):
    deschide(pg, {'celule': {'B1': 'Pret', 'C1': 'Cant', 'B2': 2, 'C2': 3, 'B3': 4, 'C3': 5}, 'selectie': 'D2'})
    clic(pg, 'celula:D2'); clic(pg, 'bara_formule')
    pg.keyboard.type('=B2*C2'); pg.wait_for_timeout(150)
    tb = [x for x in tinte(pg) if x.startswith('bara_formule')]
    scrie(pg, REZ, 'F102.tinte_fx', tb)
    enter = [x for x in tb if 'Enter' in x]
    if enter:
        clic(pg, enter[0])
    else:
        pg.keyboard.press('Enter')
    s = stare(pg); scrie(pg, REZ, 'F102.dupa', {'D2': s['celule'].get('D2'), 'D3': s['celule'].get('D3')})


with poligon() as pg:
    for t in TESTE:
        print('---', t.nume)
        t(pg)
with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(REZ, f, ensure_ascii=False, indent=1)
print('SCRIS', OUT, len(REZ))
