# -*- coding: utf-8 -*-
"""Zona de lucru dupa Ctrl+W -> Don't Save (fara nicio prezentare): ecranul fata de stare."""
import json, sys
sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe')
from h import Ham, st, ev, clic
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe/'
with Ham() as H:
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]})
    pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
    clic(pg, "fereastra:Don't Save"); pg.wait_for_timeout(300)
    r = pg.evaluate("""(()=>{const v=s=>{const e=document.querySelector(s);if(!e)return null;const r=e.getBoundingClientRect();return [getComputedStyle(e).display,getComputedStyle(e).visibility,getComputedStyle(e).backgroundColor,Math.round(r.width),Math.round(r.height),e.children.length]};
      return {zona:v('.lh-ap-p-zona'),mini:v('.lh-ap-p-miniaturi'),slide:v('.lh-ap-p-slide'),pane:v('.lh-ap-p-pane'),miniaturi:document.querySelectorAll('[data-lh-tinta="miniatura"]').length,
      bara_stare:(document.querySelector('[data-lh-suprafata="bara_stare"]')||{}).innerText}})()""")
    r['stare'] = {k: st(pg).get(k) for k in ['prezentari_deschise', 'prezentare_activa', 'diapozitive', 'diapozitiv_activ']}
    pg.screenshot(path=OUT + 'm2_fara_prez.png', clip={'x': 0, 'y': 170, 'width': 1366, 'height': 598})
    print(json.dumps(r, ensure_ascii=False))
