# -*- coding: utf-8 -*-
"""Runda 15 (B-explorer) — proba constructorului pe poligon: gesturi REALE (mouse + tastatură Playwright) pe
aplicatii/poligon.html?aplicatie=explorer, headless, server pe ("127.0.0.1", 0), tot ce nu e 127.0.0.1/localhost se
abandonează (regula 24). Ieșirea: runde/15/probe_iesiri/proba_explorer.json (+ capturi PNG la 1366 și 375 px).
Ultima linie = numărul de verificări picate.
    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/15/proba_explorer.py [--fum]
"""
import functools
import http.server
import json
import sys
import threading
from pathlib import Path
from urllib.parse import urlsplit

sys.stdout.reconfigure(encoding="utf-8")
AICI = Path(__file__).resolve().parent
WT = AICI.parents[3]
OUT = AICI / "probe_iesiri"
OUT.mkdir(exist_ok=True)


class Tacut(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".js": "application/javascript", ".json": "application/json"}

    def log_message(self, *a):
        pass


def server():
    h = functools.partial(Tacut, directory=str(WT))
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, "http://127.0.0.1:%d/" % s.server_address[1]


def ruta(r):
    if urlsplit(r.request.url).hostname in ("127.0.0.1", "localhost"):
        r.continue_()
    else:
        r.abort()


def main():
    from playwright.sync_api import sync_playwright
    fum = "--fum" in sys.argv
    srv, base = server()
    rez = {"verificari": [], "erori_js": []}

    def v(nume, ok, det=""):
        rez["verificari"].append({"ce": nume, "ok": bool(ok), "det": det})
        print(("  ok   " if ok else "  RĂU  ") + nume + ("" if ok else "  " + str(det)[:200]), flush=True)

    with sync_playwright() as p:
        br = p.chromium.launch()
        for lat, nume in ((1366, "lat"), (375, "telefon")):
            ctx = br.new_context(viewport={"width": lat, "height": 768 if lat > 500 else 740})
            ctx.route("**/*", ruta)
            pg = ctx.new_page()
            pg.on("pageerror", lambda e: rez["erori_js"].append(str(e)))
            pg.goto(base + "aplicatii/poligon.html?aplicatie=explorer", wait_until="load")
            pg.wait_for_selector('[data-lh-aplicatie="explorer"] .lh-ap-e-win', timeout=10000)
            pg.wait_for_timeout(300)
            pg.screenshot(path=str(OUT / ("poligon_%s.png" % nume)))
            sup = pg.evaluate("()=>[...document.querySelectorAll('[data-lh-suprafata]')].map(e=>e.getAttribute('data-lh-suprafata'))")
            v("%s: suprafețele ferestrei" % nume, all(k in sup for k in ("fereastra", "file_fereastra", "butoane_navigare", "bara_adresa", "cautare", "bara_comenzi", "panou_navigare", "zona_continut", "bara_stare")), sup)
            if lat < 500:
                ov = pg.evaluate("()=>document.documentElement.scrollWidth-document.documentElement.clientWidth")
                v("telefon: fără derulare laterală a paginii", ov <= 1, ov)
                mici = pg.evaluate("""()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta]')].filter(e=>{const r=e.getBoundingClientRect();
                  return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden'&&(r.height<32&&r.width<32)}).map(e=>e.getAttribute('data-lh-tinta')+':'+(e.getAttribute('data-lh-id')||''))""")
                v("telefon: zonele de atins ≥ 32 px", not mici, mici[:8])
            if fum:
                ctx.close()
                continue
            ctx.close()
        br.close()
    srv.shutdown()
    rau = sum(1 for x in rez["verificari"] if not x["ok"]) + len(rez["erori_js"])
    if rez["erori_js"]:
        print("erori JS:", rez["erori_js"][:3])
    (OUT / "proba_explorer.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    print(OUT / "proba_explorer.json")
    print(rau)


if __name__ == "__main__":
    main()
