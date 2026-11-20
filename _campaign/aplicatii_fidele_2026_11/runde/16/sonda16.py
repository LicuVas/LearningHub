# -*- coding: utf-8 -*-
"""Sonda rundei 16 (doar citiri): ce comenzi are Word pe bara de titlu / panglică, ce ținte au săgețile ▾ ale casetelor."""
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
    deschide(pg, {'paragrafe': ['Ana are mere'], 'fisiere': FIS3})
    R['titlu_mso'] = pg.evaluate("""() => [...document.querySelectorAll('[data-lh-aplicatie="word"] [data-lh-suprafata="bara_titlu"] [data-lh-id-mso]')].map(x => x.getAttribute('data-lh-id-mso') + ' | ' + x.getAttribute('data-lh-tip') + ' | ' + (x.getAttribute('data-lh-tinta')||''))""")
    R['file_noi'] = pg.evaluate("""() => [...document.querySelectorAll('[data-lh-aplicatie="word"] [data-lh-id-mso="FileNewDefault"], [data-lh-aplicatie="word"] [data-lh-id-mso="FileOpen"], [data-lh-aplicatie="word"] [data-lh-id-mso="FileSave"], [data-lh-aplicatie="word"] [data-lh-id-mso*="Undo"]')].map(x => x.getAttribute('data-lh-id-mso') + ' | ' + (x.getAttribute('data-lh-tinta')||'') + ' | ' + x.closest('[data-lh-suprafata]').getAttribute('data-lh-suprafata'))""")
    R['combo_panglica'] = pg.evaluate("""() => [...document.querySelectorAll('[data-lh-aplicatie="word"] .lh-ap-loc-panglica [data-lh-tip="ComboBox"]')].map(c => c.getAttribute('data-lh-eticheta') + ' | id=' + c.getAttribute('data-lh-id-mso') + ' | input=' + !!c.querySelector('input') + ' | butoane=' + [...c.querySelectorAll('[data-lh-tip="Button"]')].map(x => (x.getAttribute('data-lh-eticheta')||'') + '@' + (x.getAttribute('data-lh-tinta')||'') + '#' + (window.LH.aplicatii._canon ? '' : '')).join(',')) """)
    R['canon_fs'] = pg.evaluate("""() => { const x = LH.aplicatii.element('word', 'meniu_derulant:Home/Font/Font Size'); return x ? [x.getAttribute('data-lh-tip'), x.getAttribute('data-lh-eticheta'), x.getAttribute('data-lh-tinta'), typeof LH.aplicatii._canon === 'function' ? LH.aplicatii._canon(x) : 'n/a'] : null; }""")
    R['tinte_panglica_derulant'] = [t for t in tinte(pg) if t.startswith('meniu_derulant:')]
    pg.keyboard.press('F12'); pg.wait_for_timeout(400)
    R['saveas_tinte'] = [t for t in tinte(pg) if not t.startswith(('panglica:', 'fila:', 'meniu_derulant:Home', 'lansator:', 'text:'))]
    R['saveas_combo'] = pg.evaluate("""() => [...document.querySelectorAll('.lh-ap-strat-dialog [data-lh-tip="ComboBox"]')].map(c => c.getAttribute('data-lh-eticheta') + ' | tinta=' + (c.getAttribute('data-lh-tinta')||'') + ' | butoane=' + [...c.querySelectorAll('[data-lh-tip="Button"]')].map(x => (x.getAttribute('data-lh-eticheta')||'') + '@' + (x.getAttribute('data-lh-tinta')||'') + '@ta=' + ((x.__nod||{}).ta||'')).join(','))""")
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    pg.keyboard.press('Control+F12'); pg.wait_for_timeout(400)
    R['open_combo'] = pg.evaluate("""() => [...document.querySelectorAll('.lh-ap-strat-dialog [data-lh-tip="ComboBox"]')].map(c => c.getAttribute('data-lh-eticheta') + ' | tinta=' + (c.getAttribute('data-lh-tinta')||'') + ' | butoane=' + [...c.querySelectorAll('[data-lh-tip="Button"]')].map(x => (x.getAttribute('data-lh-eticheta')||'') + '@' + (x.getAttribute('data-lh-tinta')||'')).join(','))""")
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    pg.keyboard.press('Control+s'); pg.wait_for_timeout(400)
    R['stf_combo'] = pg.evaluate("""() => [...document.querySelectorAll('.lh-ap-strat-dialog [data-lh-tip="ComboBox"]')].map(c => c.getAttribute('data-lh-eticheta') + ' | tinta=' + (c.getAttribute('data-lh-tinta')||'') + ' | input=' + !!c.querySelector('input') + ' | butoane=' + [...c.querySelectorAll('[data-lh-tip="Button"]')].map(x => (x.getAttribute('data-lh-eticheta')||'') + '@' + (x.getAttribute('data-lh-tinta')||'')).join(','))""")
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    for fila in ('fila:Layout', 'fila:View', 'fila:Insert'):
        ct(pg, fila)
        R['combo_' + fila] = pg.evaluate("""() => [...document.querySelectorAll('[data-lh-aplicatie="word"] .lh-ap-loc-panglica [data-lh-tip="ComboBox"], [data-lh-aplicatie="word"] .lh-ap-loc-panglica [data-lh-tip="Spinner"]')].map(c => c.getAttribute('data-lh-tip') + ':' + c.getAttribute('data-lh-eticheta') + ' | input=' + !!c.querySelector('input'))""")
        R['sw_' + fila] = [t for t in tinte(pg) if 'Switch' in t or 'Window' in t or 'New Window' in t]
    ctx.close(); b.close()
s.shutdown()
salveaza(R, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sonda16.json'))
print(json.dumps(R, ensure_ascii=False, indent=1)[:6000])
