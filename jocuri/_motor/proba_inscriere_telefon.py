"""Proba ÎNSCRIERII PE TELEFON MIC (26.09.2026, găsită de /bucla): panourile prezenta.js (formular, listă, cod)
   nu ies din ecran la 740x360 și 320x460; fiecare câmp și „Gata” se pot aduce în ecran. Ultima linie = nr. de probleme.
"""
import functools, http.server, threading, sys, json
from playwright.sync_api import sync_playwright
LH = str(__import__('pathlib').Path(__file__).resolve().parents[2])
h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=LH)
h.log_message = lambda *a, **k: None
srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8771), h)
threading.Thread(target=srv.serve_forever, daemon=True).start()
URL = "http://127.0.0.1:8771/jocuri/web-viii/index.html"
prob = []
def ok(c, m):
    print(("  ok   " if c else "  RAU  ") + m)
    if not c: prob.append(m)

CHECK = """(ids) => { const bar = document.querySelector('#lhp .bar'); const r = bar.getBoundingClientRect();
 const out = {barTop: r.top, barBottom: r.bottom, ih: innerHeight, sh: bar.scrollHeight, ch: bar.clientHeight, el: {}};
 for (const id of ids) { const e = document.getElementById(id); if (!e) { out.el[id] = null; continue; }
   e.scrollIntoView({block:'nearest'}); const q = e.getBoundingClientRect(); out.el[id] = [q.top, q.bottom]; }
 bar.scrollTop = 0; return out; }"""

with sync_playwright() as p:
    b = p.chromium.launch()
    for w, hh in [(740, 360), (320, 460)]:
        ctx = b.new_context(viewport={"width": w, "height": hh}, is_mobile=True, has_touch=True)
        pg = ctx.new_page()
        pg.route("https://**", lambda r: r.abort() if "teste-vasile" in r.request.url and r.request.method == "POST" else r.continue_())
        pg.goto(URL); pg.wait_for_selector("#lhp-cine", timeout=15000)
        pg.click("#lhp-cine")
        pg.wait_for_function("document.getElementById('lhp-s') && document.getElementById('lhp-s').options.length>1", timeout=15000)
        pg.select_option("#lhp-s", "alta")
        pg.wait_for_timeout(200)
        o = pg.evaluate(CHECK, ["lhp-s", "lhp-as", "lhp-n", "lhp-ok"])
        tag = f"{w}x{hh} formular"
        ok(o["barTop"] >= 0, f"{tag}: bara top={o['barTop']:.0f} >= 0 (scroll {o['sh']}/{o['ch']})")
        ok(o["barBottom"] <= o["ih"], f"{tag}: bara bottom={o['barBottom']:.0f} <= {o['ih']}")
        for k, v in o["el"].items():
            ok(v is not None and v[0] >= 0 and v[1] <= o["ih"] + 0.5, f"{tag}: #{k} adus pe ecran {v}")
        # lista "Cine lucreaza acum?" cu multi elevi + ecranul "Pastreaza progresul online"
        pg.evaluate("""() => { const l=[]; for (let i=0;i<30;i++) l.push({k:'k'+i,id:'i'+i,scoala:'x',clasa:'VIII A',nume:'Elev Proba '+i,numeEnc:'enc'+i});
            localStorage.setItem('lh_elevi_pc', JSON.stringify(l)); }""")
        pg.reload(); pg.wait_for_selector("#lhp-lista", timeout=15000)
        o = pg.evaluate(CHECK, ["lhp-lista", "lhp-nou", "lhp-x"])
        tag = f"{w}x{hh} lista"
        ok(o["barTop"] >= 0, f"{tag}: bara top={o['barTop']:.0f} >= 0")
        for k, v in o["el"].items():
            ok(v is not None and v[0] >= 0 and v[1] <= o["ih"] + 0.5 or (k == "lhp-lista" and v and v[0] >= 0), f"{tag}: #{k} pe ecran {v}")
        pg.click(".el >> nth=0"); pg.wait_for_selector("#lhp-pill", timeout=15000)
        pg.click("#lhp-pill"); pg.click("#lhp-cod"); pg.wait_for_selector("#lhp-k")
        o = pg.evaluate(CHECK, ["lhp-k", "lhp-ok", "lhp-x"])
        tag = f"{w}x{hh} cod online"
        ok(o["barTop"] >= 0, f"{tag}: bara top={o['barTop']:.0f} >= 0")
        for k, v in o["el"].items():
            ok(v is not None and v[0] >= 0 and v[1] <= o["ih"] + 0.5, f"{tag}: #{k} pe ecran {v}")
        ctx.close()
    b.close()
srv.shutdown()
print("probleme:")
print("-")
print(len(prob))
