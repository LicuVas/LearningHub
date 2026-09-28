"""Cât costă noua fereste() din prezenta.js (grilă de puncte mai deasă): timpul petrecut în document.elementsFromPoint
cât elevul derulează și scrie în simulatorul Excel, prezenta.js de la HEAD vs cel nou, 390 px atingere, CPU încetinit 4x.
Rețeaua închisă. Nu dă verdict singur: tipărește cifrele."""
import functools, http.server, subprocess, sys, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8")
LH = Path(r"C:\00\Projects\LearningHub")
VECHI = subprocess.run(["git", "-C", str(LH), "show", "HEAD:assets/js/prezenta.js"], capture_output=True).stdout


class T(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(T, directory=str(LH)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{srv.server_address[1]}"
CONTOR = """(() => { window.__efp = {n: 0, ms: 0}; const o = document.elementsFromPoint.bind(document);
  document.elementsFromPoint = (x, y) => { const t = performance.now(); const r = o(x, y); window.__efp.n++; window.__efp.ms += performance.now() - t; return r; };
  const ext = u => { try { const x = new URL(String(u), location.href); return /^https?:$/.test(x.protocol) && !['127.0.0.1','localhost'].includes(x.hostname); } catch (e) { return false; } };
  if (navigator.sendBeacon) { const sb = navigator.sendBeacon.bind(navigator); navigator.sendBeacon = (u, d) => ext(u) ? true : sb(u, d); }
  const f = window.fetch.bind(window); window.fetch = (u, o2) => { const s = (typeof u === 'string' || u instanceof URL) ? String(u) : (u && u.url) || '';
  return ext(s) ? Promise.resolve(new Response('{}', {status: 200})) : f(u, o2); }; })();"""
with sync_playwright() as p:
    b = p.chromium.launch()
    for eticheta, vechi in (("HEAD", True), ("NOU", False), ("HEAD", True), ("NOU", False)):
        ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True, device_scale_factor=2.625, service_workers="block")
        ctx.add_init_script(CONTOR)

        def ruta(r, vechi=vechi):
            u = r.request.url
            if not ("127.0.0.1" in u or u.startswith(("data:", "blob:"))):
                return r.fulfill(status=200, body="{}" if r.request.method == "POST" else "", content_type="text/plain")
            if vechi and u.split("?")[0].endswith("/assets/js/prezenta.js"):
                return r.fulfill(status=200, body=VECHI, content_type="application/javascript")
            return r.continue_()
        ctx.route("**/*", ruta)
        pg = ctx.new_page()
        cdp = ctx.new_cdp_session(pg)
        pg.goto(f"{BASE}/jocuri/excel-viii/index.html", wait_until="load")
        pg.evaluate("() => {localStorage.clear(); localStorage.setItem('lh_prezenta', JSON.stringify({id: 'x1', scoala: 'x', clasa: 'y', nume: 'Popescu Ana-Maria', numeEnc: 'E', ultima: Date.now()}));"
                    "localStorage.setItem('learninghub_active_profile', 'e_x'); localStorage.setItem('lh_sertare', JSON.stringify({'x|y|ana maria popescu': 'e_x'}))}")
        pg.reload(wait_until="load"); pg.wait_for_timeout(1000)
        pg.evaluate("document.querySelector('.lvl[data-l=\"0\"]').click()"); pg.wait_for_timeout(500)
        cdp.send("Emulation.setCPUThrottlingRate", {"rate": 4})
        pg.evaluate("window.__efp = {n: 0, ms: 0}")
        t0 = pg.evaluate("performance.now()")
        for i in range(40):   # derulare pas cu pas, ca un deget
            pg.mouse.wheel(0, 120 if i < 20 else -120); pg.wait_for_timeout(50)
        for i in range(6):    # pașii (desen nou -> MutationObserver)
            if pg.locator("#pas-next").count():
                pg.locator("#pas-next").evaluate("e => e.click()"); pg.wait_for_timeout(250)
        m = pg.evaluate("window.__efp"); dt = pg.evaluate("performance.now()") - t0
        print(f"{eticheta}: elementsFromPoint {m['n']} apeluri, {m['ms']:.0f} ms în {dt:.0f} ms ({100 * m['ms'] / dt:.1f}% din timp), eticheta: {pg.evaluate('(document.getElementById(\"lhp\")||{}).className')!r}")
        cdp.send("Emulation.setCPUThrottlingRate", {"rate": 1})
        ctx.close()
    b.close()
srv.shutdown()
