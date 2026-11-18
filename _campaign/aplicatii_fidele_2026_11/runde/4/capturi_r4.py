# -*- coding: utf-8 -*-
"""Capturi de control (aspect) pentru runda 4, pe poligon: Save As cu lista Save as type deschisă, „Save your changes…”,
„Save this file”, lista Font Size. Server 127.0.0.1, rută doar locală, headless. Ieșiri: runde/4/capturi/*.png"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import proba_grav as P  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "capturi")
os.makedirs(OUT, exist_ok=True)
s = P.server()
url = "http://127.0.0.1:%d/aplicatii/poligon.html" % s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    cx = b.new_context(viewport={"width": 1366, "height": 768})
    cx.route("**/*", P.doar_local)
    pg = cx.new_page()
    pg.goto(url)
    pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
    P.deschide(pg, {"paragrafe": ["Orar", "Marti: sport"], "cursor": 0})
    P.taste(pg, "F12")
    P.deschide_lista_tip(pg)
    pg.screenshot(path=os.path.join(OUT, "saveas_lista_tip.png"))
    P.clic_tinta(pg, "meniu:PDF (*.pdf)")
    pg.screenshot(path=os.path.join(OUT, "saveas_dupa_pdf.png"))
    P.deschide(pg, {"paragrafe": ["Ana are mere"]})
    P.scrie(pg, " azi")
    P.taste(pg, "Control+w")
    pg.screenshot(path=os.path.join(OUT, "save_your_changes.png"))
    P.deschide(pg, {"paragrafe": ["Poezia mea", "Toamna vine."], "cursor": 0})
    P.taste(pg, "Control+s")
    pg.screenshot(path=os.path.join(OUT, "save_this_file.png"))
    P.deschide(pg, {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}})
    P.clic_sel(pg, P.SAGEATA_FONT)
    pg.screenshot(path=os.path.join(OUT, "font_size_lista.png"), clip={"x": 0, "y": 0, "width": 700, "height": 560})
    b.close()
s.shutdown()
print(0)
