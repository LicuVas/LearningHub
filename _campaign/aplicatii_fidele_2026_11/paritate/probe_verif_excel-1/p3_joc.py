# Verificatorul excel-1, a doua trecere: reluări cu pauze între clicuri (fără dublu clic nedorit) și cazurile rămase.
import sys, json, traceback
sys.path.insert(0, r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-1')
from comun import *

REZ = {}
OUT = r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-1/rezultate_joc2.json'
NOTE = {'A1': 'Elev', 'B1': 'Nota', 'A2': 'Ana', 'B2': 9, 'A3': 'Bogdan', 'B3': 7, 'A4': 'Dan', 'B4': 8}


def pauza(pg):
    pg.wait_for_timeout(700)


def tasteaza_in(pg, a, text):
    pauza(pg); clic(pg, 'celula:' + a); pg.keyboard.type(text); pg.keyboard.press('Enter'); pg.wait_for_timeout(150)


def grafic(pg, rand='meniu:Clustered Column'):
    clic(pg, 'fila:Insert'); clic(pg, 'meniu_derulant:Insert/Charts/Insert Column or Bar Chart'); clic(pg, rand)


def pas(nume, fn, pg):
    try:
        fn(pg)
    except Exception:
        scrie(pg, REZ, nume + '.EROARE', traceback.format_exc()[-700:])


def f016(pg):
    deschide(pg, {'celule': {}, 'selectie': 'A1'})
    tasteaza_in(pg, 'A1', '8.5')
    pauza(pg); clic(pg, 'celula:A1'); pg.keyboard.press('Delete'); pg.wait_for_timeout(200)
    s = stare(pg); scrie(pg, REZ, 'F016.dupa_delete', {'c': s['celule'].get('A1'), 'f': s['format_celule'].get('A1'), 'ev': ev(pg, 1)})
    tasteaza_in(pg, 'A1', '8,5')
    s = stare(pg); scrie(pg, REZ, 'F016.dupa_8,5', {'c': s['celule'].get('A1'), 'f': s['format_celule'].get('A1')})
    scrie(pg, REZ, 'F016.ecran', text_celula(pg, 'A1')['text'])


def f108(pg):
    deschide(pg, {'celule': {'A1': 'Titlu'}, 'selectie': 'A1:C1'})
    clic(pg, 'panglica:Home/Alignment/Merge & Center'); pauza(pg)
    s = stare(pg); scrie(pg, REZ, 'F108.unu', s['format_celule'].get('A1'))
    scrie(pg, REZ, 'F108.ecran_latime', el(pg, 'celula:A1')['w'])
    clic(pg, 'panglica:Home/Alignment/Merge & Center'); pauza(pg)
    s = stare(pg); scrie(pg, REZ, 'F108.doi', {'fmt': s['format_celule'], 'ev': ev(pg, 1), 'w': el(pg, 'celula:A1')['w']})


def f051(pg):
    deschide(pg, {'celule': NOTE, 'selectie': 'A2'})
    grafic(pg)
    g = lambda: pg.evaluate("""() => { const e = LH.aplicatii.element('excel', 'grafic:1'); const t = document.querySelector('[data-lh-tinta="grafic:1/titlu"]');
        const z = e || (t && t.parentElement); if (!z) return null; const rs = [...z.querySelectorAll('rect')].filter(r => +r.getAttribute('height') > 0 && +r.getAttribute('width') > 0);
        return {rect: rs.length, inaltimi: rs.map(r => Math.round(+r.getAttribute('height'))).join(',')} }""")
    a = g(); tasteaza_in(pg, 'B2', '2'); b = g()
    pauza(pg); clic(pg, 'celula:B3'); pg.keyboard.press('Delete'); pg.wait_for_timeout(300); c = g()
    scrie(pg, REZ, 'F051.ecran', {'inceput': a, 'dupa_B2_2': b, 'dupa_delete_B3': c})


def pie(pg):
    deschide(pg, {'celule': NOTE, 'selectie': 'A2'})
    grafic(pg)
    cd = [x for x in tinte(pg) if 'Change Chart Type' in x]; scrie(pg, REZ, 'PIE.cct', cd)
    inainte = set(tinte(pg))
    clic(pg, cd[0]); pg.wait_for_timeout(300)
    noi = [x for x in tinte(pg) if x not in inainte]; scrie(pg, REZ, 'PIE.noi', noi[:60])
    pie_t = [x for x in noi if x.endswith(':Pie')]
    if pie_t:
        clic(pg, pie_t[0]); pg.wait_for_timeout(200)
        clic(pg, 'fereastra:OK'); pg.wait_for_timeout(300)
    s = stare(pg); g0 = (s['grafice'] or [{}])[0]
    scrie(pg, REZ, 'PIE.dupa', {'tip': s['tip_grafic'], 'titlu': g0.get('titlu'), 'legenda': g0.get('legenda'), 'serii': s['serii_grafic']})
    scrie(pg, REZ, 'PIE.legenda_ecran', pg.evaluate("() => [...document.querySelectorAll('.lh-ap-x-gr-leg-el')].map(x => x.innerText)"))
    scrie(pg, REZ, 'PIE.titlu_ecran', pg.evaluate("() => { const t = document.querySelector('[data-lh-tinta=\"grafic:1/titlu\"]'); return t ? t.innerText : null }"))
    # etichete pe radial
    ace = [x for x in tinte(pg) if 'Add Chart Element' in x]
    if ace:
        clic(pg, ace[0]); clic(pg, 'meniu:Data Labels'); pg.wait_for_timeout(200)
        scrie(pg, REZ, 'PIE.data_labels', {'mesaj': mesaj_central(pg), 'ev': ev(pg, 1), 'et': stare(pg)['etichete_date']})


def f014(pg):
    c = {'A1': 'Elev', 'B1': 'Nota', 'A2': 'Dan', 'B2': 8, 'A3': 'Ana', 'B3': 9, 'A4': 'Bogdan', 'B4': 7}
    deschide(pg, {'celule': c, 'selectie': 'A2'})
    clic(pg, 'fila:Data'); inainte = set(tinte(pg))
    clic(pg, 'panglica:Data/Sort & Filter/Sort...'); pg.wait_for_timeout(300)
    noi = [x for x in tinte(pg) if x not in inainte]; scrie(pg, REZ, 'F014.noi', noi[:50])
    col = [x for x in noi if 'Sort by' in x or 'Column' in x or x.startswith('meniu_derulant:') or x.startswith('camp:')]
    scrie(pg, REZ, 'F014.col', col)
    # deschid lista coloanelor
    lst = [x for x in noi if x.startswith('meniu_derulant:') or x.startswith('lista')]
    if lst:
        inainte2 = set(tinte(pg)); clic(pg, lst[0]); pg.wait_for_timeout(250)
        opt = [x for x in tinte(pg) if x not in inainte2]; scrie(pg, REZ, 'F014.optiuni_cu_antet', opt)
        if 'meniu:Elev' in opt:
            clic(pg, 'meniu:Elev')
        else:
            pg.keyboard.press('Escape')
    # debifez antetul și văd ce nume are lista
    cb = [x for x in noi if 'My data has headers' in x]
    scrie(pg, REZ, 'F014.cb_tinta', cb)
    if 'fereastra:OK' in noi:
        clic(pg, 'fereastra:OK'); pg.wait_for_timeout(300)
    s = stare(pg); scrie(pg, REZ, 'F014.dupa_ok', {'dialog': s['dialog'], 'mesaj': s['fereastra_mesaj'], 'A': [(s['celule'].get(a) or {}).get('text') for a in ('A1', 'A2', 'A3', 'A4')]})


def f014b(pg):
    c = {'A1': 'Elev', 'B1': 'Nota', 'A2': 'Dan', 'B2': 8, 'A3': 'Ana', 'B3': 9, 'A4': 'Bogdan', 'B4': 7}
    deschide(pg, {'celule': c, 'selectie': 'A2'})
    clic(pg, 'fila:Data'); clic(pg, 'panglica:Data/Sort & Filter/Sort...'); pg.wait_for_timeout(300)
    p = pg.evaluate("""() => { const c = document.querySelector('[data-lh-tip="CheckBox"][data-lh-eticheta="My data has headers"]'); const r = c.getBoundingClientRect(); return {x: r.left + 7, y: r.top + r.height/2} }""")
    pg.mouse.click(p['x'], p['y']); pg.wait_for_timeout(250)
    scrie(pg, REZ, 'F014b.bifa_dupa_clic', pg.evaluate("""() => { const c = document.querySelector('[data-lh-tip="CheckBox"][data-lh-eticheta="My data has headers"]'); return c.getAttribute('aria-checked') }"""))
    noi = [x for x in tinte(pg) if x.startswith('meniu_derulant:')]
    lst = [x for x in noi if 'Sort' in x or 'Column' in x]
    scrie(pg, REZ, 'F014b.liste', lst)
    if lst:
        inainte2 = set(tinte(pg)); clic(pg, lst[0]); pg.wait_for_timeout(250)
        scrie(pg, REZ, 'F014b.optiuni_fara_antet', [x for x in tinte(pg) if x not in inainte2])
        pg.keyboard.press('Escape')
    scrie(pg, REZ, 'F014b.selectie_in_foaie', stare(pg)['selectie'])


def gesturi(pg):
    deschide(pg, {'celule': {'A1': 3, 'A2': 4, 'B1': '=A1*2'}, 'selectie': 'A3'})
    pauza(pg); clic(pg, 'celula:A3'); clic(pg, 'panglica:Home/Editing/AutoSum'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
    e1 = ev(pg, 3)
    pauza(pg); clic(pg, 'celula:B1'); pg.wait_for_timeout(200)
    m = el(pg, 'maner_umplere'); d = el(pg, 'celula:B2')
    if m:
        pg.mouse.move(m['x'], m['y']); pg.mouse.down(); pg.mouse.move(d['x'], d['y'] + 3, steps=8); pg.mouse.up(); pg.wait_for_timeout(250)
    s = stare(pg)
    scrie(pg, REZ, 'GEST', {'autosum_ev': e1, 'A3': s['celule'].get('A3'), 'umplere_ev': ev(pg, 1), 'B2': s['celule'].get('B2')})


with poligon() as pg:
    for n, f in [('F016', f016), ('F108', f108), ('F051', f051), ('PIE', pie), ('F014', f014), ('F014b', f014b), ('GEST', gesturi)]:
        print('---', n); pas(n, f, pg)
with open(OUT, 'w', encoding='utf-8') as fo:
    json.dump(REZ, fo, ensure_ascii=False, indent=1)
print('SCRIS', OUT, len(REZ))
