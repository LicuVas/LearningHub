"""Joc: graficele — F029 (zona graficului), F035 (Insert cu graficul ales), F040 (ștergerea titlului), F042 (Data Labels); plus F134 (mai multe coloane, tragere pe litere) și F147 (bordurile)."""
import sys, json, time; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-2')
from h import H
J = lambda x: json.dumps(x, ensure_ascii=False)
JS_VIZ = """re=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-tinta')+(x.getAttribute('data-lh-id')?':'+x.getAttribute('data-lh-id'):'')).filter(t=>new RegExp(re).test(t))"""
def viz(h, re): return h.ev(JS_VIZ, re)
def gr(h):
    s = h.stare(); return {k: s.get(k) for k in ['grafice', 'grafic_activ', 'grafic_element_ales', 'tip_grafic', 'serii_grafic', 'categorii_grafic', 'etichete_date']}
def trage(h, t1, t2):
    a = h.cutie(t1); b = h.cutie(t2)
    h.pg.mouse.move(a['x'] + a['w'] / 2, a['y'] + a['h'] / 2); h.pg.mouse.down()
    h.pg.mouse.move(b['x'] + b['w'] / 2, b['y'] + b['h'] / 2, steps=8); h.pg.mouse.up(); time.sleep(0.3)
def insereaza_coloane(h):
    h.clic('fila:Insert'); time.sleep(0.3)
    cand = viz(h, 'Column|Bar Chart')
    print('   tinte Insert:', cand[:8])
    dd = [x for x in cand if x.startswith('meniu_derulant') and 'Column' in x] or [x for x in cand if 'Column' in x]
    h.clic(dd[0]); time.sleep(0.3)
    m = viz(h, '^meniu:Clustered Column')
    h.clic(m[0]); time.sleep(0.4)

DATE = {'A1': 'Elev', 'B1': 'Nota 1', 'C1': 'Nota 2', 'A2': 'Ana', 'B2': 9, 'C2': 10, 'A3': 'Bogdan', 'B3': 7, 'C3': 8, 'A4': 'Dan', 'B4': 8, 'C4': 6}
with H() as h:
    # ---- F040: clic pe titlu + Delete
    h.deschide(DATE, 'B3'); h.clic('celula:B3'); insereaza_coloane(h)
    t = viz(h, 'grafic|titlu')
    print('   tinte grafic:', t[:15])
    tit = [x for x in t if x.startswith('grafic:') and x.endswith('/titlu')]
    print('   titlu inainte:', J({k: v for k, v in h.stare().items() if 'grafic' in k}))
    if tit:
        h.clic(tit[0]); time.sleep(0.3); print('   ales:', h.stare().get('grafic_element_ales'), h.evenimente(1))
        h.taste('Delete'); time.sleep(0.3)
        print('F040 dupa Delete:', J(gr(h)['grafice']), h.stare().get('grafic_element_ales'), h.evenimente(1), 'titlu pe ecran:', h.ev("[...document.querySelectorAll('[data-lh-aplicatie] svg text, [data-lh-aplicatie] .lh-ap-x-gr *')].map(x=>x.textContent).filter(t=>/Title|Nota|Titlu/i.test(t)).slice(0,5)"))
    # ---- F042: Add Chart Element › Data Labels (coloane, apoi linie)
    h.deschide(DATE, 'B3'); h.clic('celula:B3'); insereaza_coloane(h)
    ace = viz(h, 'Add Chart Element'); print('   ACE:', ace)
    h.clic(ace[0]); time.sleep(0.3); dl = viz(h, '^meniu:Data Labels'); h.clic(dl[0]); time.sleep(0.3)
    print('F042 coloane, rânduri Data Labels:', viz(h, '^meniu:'))
    oe = viz(h, '^meniu:Inside Base'); h.clic(oe[0]); time.sleep(0.3); print('F042 dupa Inside Base:', J(h.stare().get('etichete_date')), h.evenimente(1))
    h.clic(ace[0]); time.sleep(0.3); h.clic(dl[0]); time.sleep(0.3); h.clic(viz(h, '^meniu:None')[0]); time.sleep(0.3); print('F042 dupa None:', J(h.stare().get('etichete_date')))
    # linie
    h.clic('fila:Insert'); time.sleep(0.3); ln = viz(h, 'Line'); dd = [x for x in ln if x.startswith('meniu_derulant')] or ln
    h.clic(dd[0]); time.sleep(0.3); h.clic(viz(h, '^meniu:Line$')[0]); time.sleep(0.4)
    print('   tip dupa Line:', h.stare().get('tip_grafic'), viz(h, '^fila:'))
    fd = viz(h, '^fila:Chart Design'); h.clic(fd[0]); time.sleep(0.3)
    ace = viz(h, 'Add Chart Element'); h.clic(ace[0]); time.sleep(0.3); dl = viz(h, '^meniu:Data Labels'); h.clic(dl[0]); time.sleep(0.3)
    print('F042 linie, rânduri Data Labels:', viz(h, '^meniu:'))
    ab = viz(h, '^meniu:Above'); h.clic(ab[0]); time.sleep(0.3); print('F042 linie dupa Above:', J(h.stare().get('etichete_date')), 'tip', h.stare().get('tip_grafic'))
    # ---- F134: mai multe coloane selectate prin tragere pe litere, dublu clic pe marginea uneia
    LUNG = {'A2': 'Un text foarte foarte lung aici', 'B2': 'Alt text lung de tot, mai lung', 'C2': 'scurt'}
    h.deschide(LUNG, 'A1'); trage(h, 'antet_coloana:A', 'antet_coloana:B'); print('F134 selectie dupa tragere:', h.stare()['selectie'])
    h.clic('antet_coloana_margine:B', dublu=True); time.sleep(0.3); print('F134 A:B selectate, dublu clic pe marginea B:', J(h.stare().get('latimi_coloane')))
    # ---- F147: bordurile (butonul Borders = Bottom Border) se anulează cu un Ctrl+Z
    h.deschide(DATE, 'A1'); h.clic('celula:A3'); h.pg.keyboard.down('Shift'); h.clic('celula:B4'); h.pg.keyboard.up('Shift')
    h.clic('panglica:Home/Font/Borders'); time.sleep(0.3)
    s = h.stare(); print('F147 borduri dupa buton:', J({k: v for k, v in (s.get('format_celule') or {}).items()}), [k for k in s.keys() if 'bord' in k.lower()], h.evenimente(1))
    h.taste('Control+z'); time.sleep(0.3); s = h.stare(); print('F147 borduri dupa Ctrl+Z:', J(s.get('format_celule')))
    print('erori', h.erori)
