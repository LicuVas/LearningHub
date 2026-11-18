# -*- coding: utf-8 -*-
"""Bara de titlu de pe ecran în Backstage › Open după Ctrl+W › Save, cu `fisiere` + `recente` (drumul m1-l03:212)."""
import json, sys
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe")
from h4 import *
from pc4_js import JS_TITLU_ECRAN
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe/"
ORAR = ['Orarul meu', 'Luni: română, matematică, TIC']
JS_TOATE = """() => { const R = document.querySelector('[data-lh-aplicatie="word"]');
  return [...R.querySelectorAll('*')].filter(e => e.children.length === 0 && /Word/.test(e.textContent) && e.getBoundingClientRect().width > 0 && getComputedStyle(e).visibility !== 'hidden')
    .map(e => { const r = e.getBoundingClientRect(); const t = e.closest('[data-lh-tinta]'); const s = e.closest('[data-lh-suprafata]');
      return e.textContent.trim() + ' @' + Math.round(r.x) + ',' + Math.round(r.y) + ' tinta=' + (t ? t.getAttribute('data-lh-tinta') : '-') + ' sup=' + (s ? s.getAttribute('data-lh-suprafata') : '-'); }); }"""
R = {}
s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)
    for cu_recente in (True, False):
        c = {'paragrafe': ORAR + ['Miercuri: desen'], 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'modificat': True}
        if cu_recente:
            c['fisiere'] = [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar', 'text': ORAR}]
            c['recente'] = [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar'}]
        deschide(pg, c)
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
        ct(pg, 'fereastra:Save'); pg.wait_for_timeout(200)
        a = pg.evaluate(JS_TOATE)
        pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
        R['cu_recente' if cu_recente else 'fara_recente'] = {'dupa_save': a, 'in_open': pg.evaluate(JS_TOATE), 'stare': obs(pg)['titlu']}
        pg.screenshot(path=OUT + ('pe4_open_cu_recente.png' if cu_recente else 'pe4_open_fara_recente.png'))
    b.close()
s.shutdown()
print(json.dumps(R, ensure_ascii=False, indent=1))
