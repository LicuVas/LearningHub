"""Joc: F117 (Delete ▾), F137 (Column Width…), F134 (potrivire lățime), F147 (Ctrl+Z pe formatare), F159 (History), F161 (Ctrl+Z redenumire), F004 (sortare cu format), F111 (Clear ▾)."""
import sys, json, time; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-2')
from h import H
J = lambda x: json.dumps(x, ensure_ascii=False)
JS_MENIU = """[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta]')].filter(x=>x.offsetParent && /^meniu/.test(x.getAttribute('data-lh-tinta'))).map(x=>x.getAttribute('data-lh-tinta')+(x.getAttribute('data-lh-id')?':'+x.getAttribute('data-lh-id'):''))"""
JS_DLG = """[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta]')].filter(x=>x.offsetParent && /^(fereastra|camp|optiune|radio|caseta)/.test(x.getAttribute('data-lh-tinta'))).map(x=>x.getAttribute('data-lh-tinta')+(x.getAttribute('data-lh-id')?':'+x.getAttribute('data-lh-id'):'')).slice(0,40)"""
def meniu(h): return [x for x in h.ev(JS_MENIU) if not x.startswith('meniu_derulant')]
def dlg(h): return h.ev(JS_DLG)
def sel_zona(h, a, b):
    h.clic('celula:' + a); h.pg.keyboard.down('Shift'); h.clic('celula:' + b); h.pg.keyboard.up('Shift')

with H() as h:
    CEL = {'A1': 'Elev', 'B1': 'Nota', 'A2': 'Ana', 'B2': 9, 'A3': 'Bogdan', 'B3': 7, 'A4': 'Dan', 'B4': 8, 'A5': 'Eva', 'B5': 10}
    # ---- F117: Home > Delete ▾
    h.deschide(CEL, 'A3'); h.clic('celula:A3'); h.clic('meniu_derulant:Home/Cells/Delete'); time.sleep(0.3)
    print('F117 lista:', meniu(h))
    h.clic('meniu:Delete Sheet Rows'); time.sleep(0.3)
    s = h.stare(); print('F117 dupa Delete Sheet Rows: A3', J(s['celule'].get('A3')), 'A4', J(s['celule'].get('A4')), '| central', h.mesaje()[:1], '| ev', h.evenimente(1))
    h.deschide(CEL, 'B3'); h.clic('celula:B3'); h.clic('meniu_derulant:Home/Cells/Delete'); time.sleep(0.3); h.clic('meniu:Delete Sheet Columns'); time.sleep(0.3)
    s = h.stare(); print('F117 dupa Delete Sheet Columns: B1', J(s['celule'].get('B1')), '| central', h.mesaje()[:1], '| ev', h.evenimente(1))
    h.deschide(CEL, 'A3'); h.clic('celula:A3'); h.clic('meniu_derulant:Home/Cells/Delete'); time.sleep(0.3); h.clic('meniu:Delete Cells...'); time.sleep(0.4)
    s = h.stare(); print('F117 Delete Cells…: dialog', J(s.get('dialog')), 'tinte', dlg(h))
    t0 = [x for x in dlg(h) if 'shift cells up' in x.lower()]
    if t0: h.clic(t0[0]); time.sleep(0.2)
    print('F117 Shift cells up ->', h.evenimente(1))
    t = [x for x in dlg(h) if 'entire row' in x.lower()]
    if t: h.clic(t[0]); time.sleep(0.2)
    ok = [x for x in dlg(h) if x.endswith(':OK')]
    if ok: h.clic(ok[0]); time.sleep(0.3)
    s = h.stare(); print('F117 dupa Delete Cells (Entire row, OK): A3', J(s['celule'].get('A3')), 'B3', J(s['celule'].get('B3')), '| dialog', J(s.get('dialog')), '| ev', h.evenimente(2))
    h.taste('Escape')
    # ---- F137: Column Width… din clic dreapta pe literă și din Format ▾
    h.deschide(CEL, 'A1'); h.clic('antet_coloana:B', dreapta=True); time.sleep(0.3)
    print('F137 meniu clic dreapta:', meniu(h)[:20])
    h.clic('meniu:Column Width...'); time.sleep(0.3)
    print('F137 dialog:', J(h.stare().get('dialog')), dlg(h))
    h.pg.keyboard.press('Control+A'); h.scrie('20'); h.taste('Enter'); time.sleep(0.3)
    print('F137 latimi dupa 20 (clic dreapta pe B):', J(h.stare().get('latimi_coloane')))
    pass  # Format ▾ = nesimulat (p3b_format.py)
    h.taste('Escape'); h.taste('Escape')
    # ---- F134: dublu clic pe marginea literei
    LUNG = {'A2': 'Un text foarte foarte lung aici', 'B2': 'Alt text lung de tot, mai lung', 'C2': 'scurt'}
    h.deschide(LUNG, 'A1')
    print('F134 inainte:', J(h.stare().get('latimi_coloane')))
    h.clic('antet_coloana_margine:A', dublu=True); time.sleep(0.3); print('F134 dupa dublu clic pe marginea A:', J(h.stare().get('latimi_coloane')), h.evenimente(1))
    h.deschide(LUNG, 'A1')
    h.clic('antet_coloana:A'); h.pg.keyboard.down('Shift'); h.clic('antet_coloana:B'); h.pg.keyboard.up('Shift')
    print('F134 selectie A:B:', h.stare()['selectie'])
    h.clic('antet_coloana_margine:B', dublu=True); time.sleep(0.3); print('F134 dupa dublu clic pe marginea B cu A:B selectate:', J(h.stare().get('latimi_coloane')))
    # ---- F147: Ctrl+Z pe formatare — fiecare comandă un pas
    h.deschide(CEL, 'A1')
    h.clic('celula:B2'); h.taste('Control+b'); time.sleep(0.15)
    h.clic('antet_coloana_margine:A', dublu=True); time.sleep(0.2)
    sel_zona(h, 'A1', 'B1'); h.clic('panglica:Home/Alignment/Merge & Center'); time.sleep(0.2)
    sel_zona(h, 'A3', 'B4'); h.clic('panglica:Home/Font/Borders'); time.sleep(0.2)
    def rez():
        s = h.stare(); fc = s.get('format_celule') or {}
        return {'B2': fc.get('B2'), 'A1': fc.get('A1'), 'A3': fc.get('A3'), 'lat': s.get('latimi_coloane')}
    print('F147 dupa 4 comenzi:', J(rez()))
    for i in range(4):
        h.taste('Control+z'); time.sleep(0.2); print('F147 Ctrl+Z #%d:' % (i + 1), J(rez()))
    # ---- F159: History ca nume de foaie
    h.deschide(CEL, 'A1')
    h.clic('fila_foii:Sheet1', dublu=True); time.sleep(0.3); h.pg.keyboard.press('Control+A'); h.scrie('History'); h.taste('Enter'); time.sleep(0.4)
    s = h.stare(); print('F159 foi:', J(s.get('foi')), '| mesaj', J(s.get('fereastra_mesaj')), '| dialog', J(s.get('dialog')), '| central', h.mesaje()[:1], h.evenimente(1))
    h.taste('Escape'); h.taste('Escape')
    # ---- F161: Ctrl+Z după redenumire
    h.deschide(CEL, 'A1')
    h.clic('fila_foii:Sheet1', dublu=True); time.sleep(0.3); h.pg.keyboard.press('Control+A'); h.scrie('Note'); h.taste('Enter'); time.sleep(0.3)
    print('F161 dupa redenumire:', J(h.stare().get('foi')))
    h.clic('celula:D5'); h.taste('Control+z'); time.sleep(0.3); print('F161 dupa Ctrl+Z:', J(h.stare().get('foi')), h.evenimente(1))
    h.clic('acces_rapid:Undo'); time.sleep(0.3); print('F161 dupa Undo din bara:', J(h.stare().get('foi')), h.evenimente(1))
    # ---- F004: sortarea mută formatarea rândului
    h.deschide({'A1': 'Elev', 'B1': 'Nota', 'A2': 'Zoe', 'B2': 5, 'A3': 'Ana', 'B3': 9, 'A4': 'Mihai', 'B4': 7}, 'A2')
    sel_zona(h, 'A2', 'B2'); h.taste('Control+b'); time.sleep(0.15)
    h.clic('panglica:Home/Font/Fill Color'); time.sleep(0.2)
    s = h.stare(); print('F004 inainte: fmt A2', J((s['format_celule'] or {}).get('A2')), 'fmt B2', J((s['format_celule'] or {}).get('B2')))
    h.clic('celula:A3'); h.clic('fila:Data'); time.sleep(0.3)
    print('F004 buton sort', h.cutie('mso:SortAscendingExcel'))
    h.clic('mso:SortAscendingExcel'); time.sleep(0.4)
    s = h.stare(); fc = s.get('format_celule') or {}
    print('F004 dupa Sort A to Z:', {a: (s['celule'].get(a) or {}).get('valoare') for a in ['A2', 'A3', 'A4']}, 'fmt', J({a: fc.get(a) for a in ['A2', 'B2', 'A3', 'B3', 'A4', 'B4']}), h.evenimente(1))
    # ---- F111: Clear ▾ (Clear Formats)
    h.clic('fila:Home'); time.sleep(0.2); h.clic('meniu_derulant:Home/Editing/Clear'); time.sleep(0.3)
    print('F111 lista Clear ▾:', meniu(h), '| central', h.mesaje()[:1], h.evenimente(1))
    print('erori', h.erori)
