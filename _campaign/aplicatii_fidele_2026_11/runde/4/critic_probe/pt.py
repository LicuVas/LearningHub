# -*- coding: utf-8 -*-
"""Ordinea evenimentelor la tastarea în caseta File name (cu marcajul de timp ts și momentul gestului)."""
import json, sys, time
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe")
from h4 import *
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe/"
R = {}


def rect(pg, tinta):
    return pg.evaluate("t => { const e = LH.aplicatii.element('word', t); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }", tinta)


def ct(pg, tinta):
    r = rect(pg, tinta)
    pg.mouse.click(r[0] + r[2] / 2, r[1] + r[3] / 2)
    pg.wait_for_timeout(200)


JS_EV = "() => (window.__lhAplicatieEv || []).map(e => [e.ts, e.gest, e.actiune, e.tinta, e.activat || ''].join('|'))"
s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)
    for cum in ('type', 'press'):
        deschide(pg, {"paragrafe": ["Orar"], "cursor": 0},
                 asistent={"pasi": [{"tinta": "camp:nume_fisier"}, {"tinta": "dialog_salvare:Save"}, {"tinta": "mso:Bold"}], "dupaGreseli": 2, "dupaSecunde": 600})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        ct(pg, 'camp:nume_fisier')
        pg.keyboard.press('Control+a')
        t0 = pg.evaluate("() => Date.now()")
        if cum == 'type':
            pg.keyboard.type('Orar')
        else:
            for ch in 'Orar':
                pg.keyboard.press(ch)
        t1 = pg.evaluate("() => Date.now()")
        pg.wait_for_timeout(300)
        ev_inainte_save = pg.evaluate(JS_EV)
        ct(pg, 'dialog_salvare:Save')
        pg.wait_for_timeout(300)
        o = obs(pg)
        R[cum] = {'t_tastare': [t0, t1], 'ev_inainte_save': ev_inainte_save, 'ev_final': pg.evaluate(JS_EV), 'pas': o['pas'], 'indicii': o['indicii'], 'nume': o['nume']}
    b.close()
s.shutdown()
salveaza(R, OUT + 'rt.json')
print(json.dumps(R, ensure_ascii=False, indent=1))
