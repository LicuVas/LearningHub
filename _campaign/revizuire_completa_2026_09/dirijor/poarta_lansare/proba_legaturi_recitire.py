"""Toate legăturile ?recitire=N din sit (lecțiile de evaluare inițială): deschid pașii unui nivel, nu mesajul de eroare.
Rețeaua închisă. Ultima linie = nr. de legături care duc la „nu există” / „nu are pași” / erori JS."""
import functools, http.server, re, sys, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8")
LH = Path(r"C:\00\Projects\LearningHub")
RX = re.compile(r"jocuri/([a-z0-9-]+)/(?:index\.html)?\?recitire=([0-9A-Za-z]+)")
leg = {}
for f in list((LH / "lectii").rglob("*.html")) + list((LH / "lectii").rglob("*.json")) + list((LH / "hub").rglob("*.html")):
    if "_campaign" in f.parts or "_backup" in str(f):
        continue
    try:
        t = f.read_text(encoding="utf-8")
    except Exception:
        continue
    for m in RX.finditer(t):
        leg.setdefault((m.group(1), m.group(2)), set()).add(str(f.relative_to(LH)).replace("\\", "/"))


class T(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(T, directory=str(LH)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{srv.server_address[1]}"
rau = []
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True, service_workers="block")
    ctx.route("**/*", lambda r: r.continue_() if ("127.0.0.1" in r.request.url or r.request.url.startswith(("data:", "blob:"))) else r.fulfill(status=200, body=""))
    pg = ctx.new_page(); er = []
    pg.on("pageerror", lambda e: er.append(str(e)[:150]))
    for (slug, n), surse in sorted(leg.items()):
        er.clear()
        pg.goto(f"{BASE}/jocuri/{slug}/?recitire={n}", wait_until="load"); pg.wait_for_timeout(400)
        h = pg.evaluate("(document.getElementById('rec-h') || {}).innerText || ''")
        eyebrow = pg.evaluate("(document.querySelector('.eyebrow') || {}).innerText || ''")
        ok = "recitire · pasul 1" in eyebrow.lower() and not er
        print(("  ok   " if ok else "  RĂU  ") + f"{slug}?recitire={n}: „{h[:60]}” {eyebrow[:50]!r} {er[:1]}  <- {sorted(surse)[:2]}")
        if not ok:
            rau.append(f"{slug}?recitire={n}")
    ctx.close(); b.close()
srv.shutdown()
print(f"{len(leg)} legături unice")
print(len(rau))
