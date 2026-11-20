# -*- coding: utf-8 -*-
"""Sonda rundei 16, după reparații (doar citiri): gesturi vecine pe unghiul gest_tastatura, ca să nu las criticului
lucruri evidente. Ieșirea: sonda16b.json."""
import os
import sys
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from h16 import *  # noqa
from playwright.sync_api import sync_playwright

R = {}
s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)

    # 1. Switch Windows după Ctrl+N
    deschide(pg, {'paragrafe': ['Excursie'], 'modificat': True})
    tasta(pg, 'Control+n', asteapta=250)
    ct(pg, 'fila:View'); golev(pg)
    ct(pg, 'meniu_derulant:View/Window/Switch Windows')
    R['switch_windows'] = {'msg': obs(pg)['msg'], 'ev': evs(pg)[-1:]}

    # 2. Alt+↓ în File name (Save As) și în Files of type (Open) — față de clicul pe ▾
    deschide(pg, {'paragrafe': ['Orar'], 'modificat': True})
    tasta(pg, 'F12', asteapta=300); golev(pg)
    tasta(pg, 'Alt+ArrowDown', asteapta=250)
    R['saveas_file_name_alt_jos'] = {'msg': obs(pg)['msg'], 'ev': evs(pg)[-1:], 'dlg': obs(pg)['dlg']}
    tasta(pg, 'Escape', asteapta=150)

    # 3. fără document: KeyTips Alt, H, F, S (caseta gri) și Alt, H, 1
    deschide(pg, {'paragrafe': ['']})
    tasta(pg, 'Control+w', asteapta=250); golev(pg)
    tasta(pg, 'Alt'); scrie(pg, 'h'); scrie(pg, 'f'); scrie(pg, 's')
    foc = pg.evaluate("() => { const a = document.activeElement; return a ? a.tagName + ':' + (a.closest('[data-lh-id-mso]') || {getAttribute: () => ''}).getAttribute('data-lh-id-mso') : null; }")
    R['fara_doc_keytips_fs'] = {'focus': foc, 'ev': evs(pg)[-3:], 'msg': obs(pg)['msg']}
    tasta(pg, 'Escape', asteapta=100)
    # titlul și bara de stare fără document
    R['fara_doc_titlu'] = obs(pg)['titlu']

    # 4. Save As: după „already exists”, lista arată fișierul existent; Alt+T, Alt+↓, ↓, Enter = PDF, lista se reumple
    deschide(pg, {'paragrafe': ['Orarul meu'], 'modificat': True, 'fisiere': [ORAR_ANA, {'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar.pdf', 'text': ORAR}]})
    tasta(pg, 'F12', asteapta=300)
    a = dlg(pg)
    tasta(pg, 'Alt+t'); tasta(pg, 'Alt+ArrowDown', asteapta=200)
    pdf_idx = pg.evaluate("() => { const r = [...document.querySelectorAll('.lh-ap-lista-ref [data-lh-tip=\"ListItem\"]')]; return [r.findIndex(x => x.classList.contains('lh-ap-ales')), r.findIndex(x => /PDF/.test(x.getAttribute('data-lh-eticheta')))]; }")
    if pdf_idx[0] >= 0 and pdf_idx[1] >= 0:
        tasta(pg, 'ArrowDown', n=pdf_idx[1] - pdf_idx[0])
    tasta(pg, 'Enter', asteapta=300)
    c = dlg(pg)
    R['saveas_lista_tip'] = {'docx': [r['text'] for r in a['lista']], 'pdf_idx': pdf_idx, 'dupa_pdf': [r['text'] for r in c['lista']], 'sup': c['sup'], 'ev': evs(pg)[-2:]}

    # 5. Recent după S4: fișierul deschis de două ori apare o dată în Recent
    deschide(pg, {'paragrafe': [''], 'fisiere': FIS3})
    tasta(pg, 'Control+w', asteapta=250)
    for _ in range(2):
        tasta(pg, 'Control+F12', asteapta=300); ct(pg, 'arbore:Descărcări'); dublu(pg, 'lista:club-lectura.docx')
    R['recente_dupa_dubla_deschidere'] = pg.evaluate("() => LH.aplicatii.stare('word').recente")
    ctx.close(); b.close()
s.shutdown()
salveaza(R, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sonda16b.json'))
print(json.dumps(R, ensure_ascii=False, indent=1)[:5000])
