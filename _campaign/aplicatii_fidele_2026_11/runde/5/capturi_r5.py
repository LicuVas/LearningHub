# -*- coding: utf-8 -*-
"""Capturi headless ale ferestrelor noi (Open, Save As PDF) pe poligon; rută doar locală. Folosește ajutoarele probei rundei 4."""
import importlib.util, os, sys
from playwright.sync_api import sync_playwright
AICI = os.path.dirname(os.path.abspath(__file__))
s_ = importlib.util.spec_from_file_location("p4", os.path.join(AICI, "..", "4", "proba_grav.py")); p4 = importlib.util.module_from_spec(s_); s_.loader.exec_module(p4)
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(AICI, "capturi")
srv = p4.server()
with sync_playwright() as p:
    b = p.chromium.launch(headless=True); cx = b.new_context(viewport={"width": 1366, "height": 768}); cx.route("**/*", p4.doar_local)
    pg = cx.new_page(); pg.goto("http://127.0.0.1:%d/aplicatii/poligon.html" % srv.server_address[1]); pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
    p4.deschide(pg, {"paragrafe": [""], "fisiere": [{"folder": "Descărcări", "nume": "club-lectura", "text": ["Clubul de lectură"]}, {"nume": "Popescu_Ana_7A_orar", "text": ["Orar"]}]})
    p4.taste(pg, "Control+o"); p4.clic_tinta(pg, "backstage:Browse"); p4.clic_tinta(pg, "arbore:Descărcări"); p4.clic_tinta(pg, "lista:club-lectura.docx")
    pg.screenshot(path=os.path.join(OUT, "r5_open_descarcari.png"))
    p4.deschide(pg, {"paragrafe": ["Orar"]}); p4.taste(pg, "F12"); p4.deschide_lista_tip(pg); p4.clic_tinta(pg, "meniu:PDF (*.pdf)"); p4.taste(pg, "Alt+e")
    pg.screenshot(path=os.path.join(OUT, "r5_saveas_pdf.png"))
    cx.close(); b.close()
srv.shutdown(); print(0)
