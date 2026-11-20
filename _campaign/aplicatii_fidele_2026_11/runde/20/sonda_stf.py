# -*- coding: utf-8 -*-
"""Sonda r20: de ce caseta mică Save as type din „Save this file” nu e oprire Tab (doar citește DOM-ul)."""
import os, sys
sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from h20 import *  # noqa
from playwright.sync_api import sync_playwright
s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True); cx = context(b); pg = pagina(cx, port)
    pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
    for k in ("Control+s", "Control+w"):
        deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': [ORAR_ANA]} if k == 'Control+w' else {'paragrafe': ORAR_MEU}); tasta(pg, 'Control+End'); scrie(pg, ' x'); tasta(pg, k, asteapta=300)
        print(json.dumps(pg.evaluate("""() => { %s
          const d = document.querySelector('[data-lh-aplicatie="word"] .lh-ap-strat-dialog [data-lh-suprafata^="dialog"]');
          return [...d.querySelectorAll('[data-lh-tip]')].filter(x => /^(Edit|ComboBox|Button)$/.test(x.getAttribute('data-lh-tip')))
            .map(x => [x.getAttribute('data-lh-eticheta'), x.parentElement.closest('[data-lh-tip]') ? x.parentElement.closest('[data-lh-tip]').getAttribute('data-lh-eticheta') : null, !!x.querySelector('input')]); }""" % VIZ), ensure_ascii=False))
    cx.close(); b.close()
s.shutdown()
