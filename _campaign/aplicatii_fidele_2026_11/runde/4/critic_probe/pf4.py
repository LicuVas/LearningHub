# -*- coding: utf-8 -*-
"""După „PDF (*.pdf)” în Save As: ce controale are fereastra (față de uia_word.json › dialog.FileSaveAs_pdf) și ce fac
tastele lor de acces (Alt+E „Open file after publishing”, Alt+O „Options...”, Alt+M „Minimum size”)."""
import json, sys
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe")
from h4 import *
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe/"
JS = """() => { const d = document.querySelector('.lh-ap-strat-dialog'); if (!d) return null;
  const vis = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const caut = ['Optimize for:', 'Standard (publishing online and printing)', 'Minimum size (publishing online)', 'Options...', 'Open file after publishing', 'Save Thumbnail'];
  const sup = [...d.querySelectorAll('[data-lh-suprafata]')].map(x => x.getAttribute('data-lh-suprafata'));
  return {suprafete: sup, controale: Object.fromEntries(caut.map(c => [c, [...d.querySelectorAll('[data-lh-eticheta]')].some(x => x.getAttribute('data-lh-eticheta') === c && vis(x))]))}; }"""
R = {}
s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)
    deschide(pg, {'paragrafe': ['Orar', 'Marti: sport']})
    pg.keyboard.press('F12'); pg.wait_for_timeout(300)
    R['inainte_pdf'] = pg.evaluate(JS)
    ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)')
    R['dupa_pdf'] = pg.evaluate(JS)
    golev(pg)
    for k in ('Alt+e', 'Alt+o', 'Alt+m'):
        pg.keyboard.press(k); pg.wait_for_timeout(120)
    x = obs(pg)
    R['taste_alt_e_o_m'] = {'ev': evt(pg), 'msg': x['msg'], 'dlg': x['dlg'], 'focus': x['focus']}
    b.close()
s.shutdown()
salveaza(R, OUT + 'rf4.json')
print(json.dumps(R, ensure_ascii=False, indent=1))
