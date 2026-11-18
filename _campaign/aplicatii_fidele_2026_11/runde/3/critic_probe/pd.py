# -*- coding: utf-8 -*-
"""Criticul rece, runda 3: bara de titlu după salvare cu un nume lung (numele elevului)."""
import sys
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe")
from h import *
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/3/critic_probe/"
R = {}
s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)
    for nume in ("Popescu_Ana_7A_orar", "Constantinescu_Alexandra_7B_orar"):
        deschide(pg, ["Orar"], 0)
        pg.keyboard.press("F12"); pg.wait_for_timeout(200)
        pg.keyboard.press("Control+A"); pg.keyboard.type(nume, delay=5); pg.keyboard.press("Enter"); pg.wait_for_timeout(200)
        R[nume] = pg.evaluate("""() => { const b = [...document.querySelectorAll('[data-lh-suprafata="bara_titlu"] [data-lh-tip="Button"]')].find(x => / - /.test(x.textContent)); const t = b.querySelector('.lh-ap-text'); const p = b.parentElement.getBoundingClientRect(); const r = b.getBoundingClientRect();
            const c = document.createElement('canvas').getContext('2d'); c.font = getComputedStyle(t).font; const nume = b.textContent.trim().split('  -  ')[0];
            return {text: b.textContent.trim(), buton: [Math.round(r.x), Math.round(r.width)], zona_titlu: [Math.round(p.x), Math.round(p.width)], nevoie_px: t.scrollWidth, vizibil_px: t.clientWidth, nume_px: Math.round(c.measureText(nume).width), font: getComputedStyle(t).font}; }""")
        pg.screenshot(path=OUT + "titlu_" + nume + ".png", clip={"x": 0, "y": 0, "width": 560, "height": 50})
    b.close()
s.shutdown()
salveaza(R, OUT + "rd.json")
for k, v in R.items(): print(k, v)
