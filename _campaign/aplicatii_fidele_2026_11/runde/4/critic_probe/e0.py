# -*- coding: utf-8 -*-
"""Recunoaștere: țintele vizibile după F12, după Ctrl+S, după Ctrl+W (modificat), Font Size; DOM-ul casetei Font Size."""
import json, sys
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe")
from h4 import *
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe/"
s = server(); port = s.server_address[1]
res = {}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)
    deschide(pg, {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}})
    res['font_dom'] = pg.evaluate("""() => { const c = document.querySelector('[data-lh-id-mso="FontSize"]'); return c ? c.outerHTML.slice(0, 1500) : null; }""")
    res['tinte0'] = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if 'Font' in t]
    pg.keyboard.press('F12'); pg.wait_for_timeout(300)
    res['tinte_f12'] = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if not t.startswith(('panglica', 'fila', 'acces', 'text', 'lansator', 'meniu_derulant', 'zoom', 'bara_stare'))]
    res['obs_f12'] = obs(pg)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    pg.keyboard.press('Control+s'); pg.wait_for_timeout(300)
    res['tinte_ctrls'] = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if not t.startswith(('panglica', 'fila', 'acces', 'text', 'lansator', 'meniu_derulant', 'zoom'))]
    res['obs_ctrls'] = obs(pg)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
    res['tinte_ctrlw'] = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if not t.startswith(('panglica', 'fila', 'acces', 'text', 'lansator', 'meniu_derulant', 'zoom'))]
    res['obs_ctrlw'] = obs(pg)
    b.close()
s.shutdown()
salveaza(res, OUT + 'e0.json')
print(json.dumps(res, ensure_ascii=False, indent=1)[:9000])
