# -*- coding: utf-8 -*-
"""Capturi K3 (runda 26): telefon 360 px, caseta din Start în timpul compunerii („pa”) și după textul trimis („pai”). Headless, doar 127.0.0.1."""
import sys
from pathlib import Path
sys.dont_write_bytecode = True
AICI = Path(__file__).resolve().parent
D = AICI.parents[1]
sys.path.insert(0, str(D / "oracole"))
import structura_lib as SL  # noqa: E402
from playwright.sync_api import sync_playwright
srv, base = SL.porneste_server(D.parents[1])
with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(viewport={"width": 360, "height": 740}, has_touch=True, is_mobile=True)
    SL.blocheaza_externe(ctx)
    pg = ctx.new_page()
    pg.goto(base + "aplicatii/poligon.html", wait_until="load")
    pg.evaluate("LH.aplicatii.deschide('windows', {focus: true})")
    pg.wait_for_timeout(300)
    for sel in ('.lh-w-bara [data-lh-id="Start"]', '.lh-w-cautare-st'):
        b = pg.locator(sel).first.bounding_box()
        pg.touchscreen.tap(b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)
        pg.wait_for_timeout(250)
    c = ctx.new_cdp_session(pg)
    c.send("Input.imeSetComposition", {"text": "pa", "selectionStart": 2, "selectionEnd": 2})
    pg.wait_for_timeout(200)
    pg.screenshot(path=str(AICI / "probe_iesiri" / "k3_tel360_compune.png"), clip={"x": 0, "y": 0, "width": 360, "height": 200})
    c.send("Input.insertText", {"text": "pai"})
    pg.wait_for_timeout(300)
    pg.screenshot(path=str(AICI / "probe_iesiri" / "k3_tel360_pai.png"))
    br.close()
srv.shutdown()
print(0)
