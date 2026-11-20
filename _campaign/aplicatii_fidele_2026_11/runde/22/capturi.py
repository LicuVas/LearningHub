# -*- coding: utf-8 -*-
"""Capturi pentru ochi (runda 22): meniul nou jos, Start › Toate derulat, căutarea „pai”, indiciul Explorer, telefonul."""
import sys
from pathlib import Path
sys.dont_write_bytecode = True
AICI = Path(__file__).resolve().parent
D = AICI.parents[1]; WT = D.parents[1]
sys.path.insert(0, str(D / "oracole")); sys.path.insert(0, str(AICI))
import structura_lib as SL
from proba_grav import pagina, cutie, centru, tasteaza
O = AICI / "probe_iesiri" / "capturi"; O.mkdir(parents=True, exist_ok=True)
from playwright.sync_api import sync_playwright
srv, base = SL.porneste_server(WT)
with sync_playwright() as p:
    br = p.chromium.launch()
    pg = pagina(br, base, 1366, 768); pg.mouse.click(1024, 690, button="right"); pg.wait_for_timeout(200); pg.screenshot(path=str(O / "w1_1366_meniu_jos.png")); pg.context.close()
    pg = pagina(br, base, 1536, 864); pg.mouse.click(*centru(cutie(pg, '[data-lh-tinta="bara_activitati"][data-lh-id="Start"]'))); pg.wait_for_timeout(200)
    pg.evaluate("document.querySelector('.lh-w-zona-apps').scrollTop = 520"); pg.wait_for_timeout(150); pg.screenshot(path=str(O / "w2_1536_toate.png"))
    pg.keyboard.press("Escape"); pg.keyboard.press("Meta"); pg.wait_for_timeout(150); tasteaza(pg, "pai"); pg.screenshot(path=str(O / "w3_1536_pai.png")); pg.context.close()
    pg = pagina(br, base, 1366, 768, {"ferestre": [{"aplicatie": "explorer", "titlu": "Acest PC"}]}); pg.mouse.move(*centru(cutie(pg, '[data-lh-tinta="bara_activitati"][data-lh-id^="Explorer"]'))); pg.wait_for_timeout(900)
    pg.screenshot(path=str(O / "w4_1366_indiciu.png"), clip={"x": 500, "y": 600, "width": 500, "height": 168}); pg.context.close()
    pg = pagina(br, base, 360, 740, {"ferestre": [{"aplicatie": "explorer", "titlu": "Acest PC"}]}, telefon=True); pg.screenshot(path=str(O / "w5_360.png"))
    pg.touchscreen.tap(*centru(cutie(pg, '[data-lh-tinta="bara_activitati"][data-lh-id="Start"]'))); pg.wait_for_timeout(200)
    pg.evaluate("document.querySelector('.lh-w-zona-apps').scrollTop = 99999"); pg.wait_for_timeout(150); pg.screenshot(path=str(O / "w2_360_toate_jos.png")); pg.context.close()
    br.close()
srv.shutdown()
print(0)
