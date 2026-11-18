# -*- coding: utf-8 -*-
"""Runda 4 — I1 (telefon 390 px, atingere): ✕ → „Save your changes…” → Cancel / Don't Save; Font Size ▾ → „20”;
F12 → Save as type → PDF. Atingeri reale (page.touchscreen.tap), rută doar locală, headless. Ultima linie = picate."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import proba_grav as P  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402


def atinge(pg, t):
    c = pg.evaluate("""t => { const e = LH.aplicatii.element('word', t); if (!e) return null; e.scrollIntoView({block: 'center', inline: 'center'});
        const r = e.getBoundingClientRect(); const x = r.x + r.width / 2, y = r.y + r.height / 2;
        const sub = document.elementFromPoint(x, y); return sub && (e === sub || e.contains(sub)) ? [x, y] : ['acoperit', x, y]; }""", t)
    if not c or c[0] == 'acoperit':
        return False
    pg.touchscreen.tap(c[0], c[1])
    pg.wait_for_timeout(250)
    return True


rez = []
s = P.server()
url = "http://127.0.0.1:%d/aplicatii/poligon.html" % s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    cx = b.new_context(viewport={"width": 390, "height": 800}, has_touch=True, is_mobile=True, device_scale_factor=2)
    cx.route("**/*", P.doar_local)
    pg = cx.new_page()
    pg.goto(url)
    pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
    for buton, docs in (("Cancel", 1), ("Don't Save", 0)):
        P.deschide(pg, {"paragrafe": ["Ana are mere azi"]})
        a = atinge(pg, "bara_titlu:Close")
        b2 = atinge(pg, "fereastra:" + buton)
        st = P.stare(pg)
        P.caz(rez, "tel_x_" + buton, a and b2 and st.get("documente_deschise") == docs, x=a, buton=b2, docs=st.get("documente_deschise"))
    P.deschide(pg, {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}})
    a = atinge(pg, "meniu_derulant:Home/Font/Font Size")
    b2 = atinge(pg, "meniu:20")
    st = P.stare(pg)
    P.caz(rez, "tel_font_size_20", a and b2 and P.marime_la(st, "are") == 20, sageata=a, rand=b2, marime=P.marime_la(st, "are"))
    P.deschide(pg, {"paragrafe": ["Orar"], "cursor": 0})
    P.taste(pg, "F12")
    a = atinge(pg, "camp:tip_fisier")
    b2 = atinge(pg, "meniu:PDF (*.pdf)")
    P.caz(rez, "tel_saveas_pdf", a and b2 and P.valoare_caseta_tip(pg) == "PDF (*.pdf)", caseta=a, rand=b2, v=P.valoare_caseta_tip(pg))
    b.close()
s.shutdown()
picate = [r["caz"] for r in rez if not r["ok"]]
json.dump({"cazuri": rez, "picate": picate}, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "proba_telefon.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=1)
print("picate:", picate)
print(len(picate))
