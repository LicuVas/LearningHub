"""proba_panglica_reala.py — panglica reală din simulatorul Excel se vede și e cea din date (26.09.2026).

Deschide jocuri/_fixtura-excel (prin server local, ca proba de gesturi) pe PC (1280x800) și pe telefon (Pixel 7):
  1. apare panglica reală (.rb.pg), nu cea simplă de rezervă;
  2. filele = cele din panglica-excel.json, în ordine; Home e activă;
  3. fiecare grup din Home are numele și numărul de butoane din date;
  4. butoanele legate de simulator (Bold, Fill Color, Merge & Center, Sum, Sort, grafice) au mânerele vechi;
  5. un buton nefolosit (Format Painter) spune pe ecran că nu-l folosim, fără erori;
  6. pagina nu e mai lată decât ecranul (banda se derulează în ea); fără erori JS.
Capturi: _tests/_capturi/panglica_pc.png, panglica_telefon.png. Ultima linie: numărul de verificări picate.
"""
import functools
import http.server
import json
import sys
import threading
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass
RAD = Path(__file__).resolve().parents[1]
DATE = json.loads((RAD / "jocuri" / "_motor" / "panglica-excel.json").read_text(encoding="utf-8"))
CAPT = RAD / "_tests" / "_capturi"
CAPT.mkdir(exist_ok=True)
picate = 0


def nota(ok, text):
    global picate
    print(("  ok   " if ok else "  PICAT ") + text)
    picate += 0 if ok else 1


srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(RAD)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f"http://127.0.0.1:{srv.server_address[1]}/jocuri/_fixtura-excel/index.html"

from playwright.sync_api import sync_playwright  # noqa: E402
with sync_playwright() as p:
    b = p.chromium.launch()
    for nume, ctx_opt in (("pc", {"viewport": {"width": 1280, "height": 800}}), ("telefon", p.devices["Pixel 7"])):
        print(f"== {nume} ==")
        ctx = b.new_context(**ctx_opt)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        ctx.route("**/api/activitate", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
        pg.goto(url, wait_until="load")
        pg.evaluate("localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
        pg.reload(wait_until="load")
        pg.evaluate("JocMotor.test.deblocheaza()"); pg.evaluate("document.getElementById('go-home').click()")
        pg.click('.lvl[data-l="3"]'); pg.click("#go")          # nivelul cu formatarea din panglică (ca proba de gesturi)
        pg.evaluate("JocMotor.test.rezolva()")
        if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
            pg.click("#chk")
        pg.click("#next")
        pg.wait_for_selector(".xl")
        try:
            pg.wait_for_selector(".rb.pg", timeout=10000)
        except Exception:  # noqa: BLE001
            pass
        nota(pg.locator(".rb.pg").count() >= 1, "panglica reală e pe pagină")
        if pg.locator(".rb.pg").count() == 0:
            continue
        rb = pg.locator(".rb.pg").first
        file_ = rb.locator(".tabs [data-tab]").all_inner_texts()
        nota(file_ == [f["eticheta"] for f in DATE["file"]], f"filele: {file_}")
        nota(rb.locator(".tabs [data-tab].on").inner_text() == "Home", "Home e fila activă")
        home = DATE["file"][0]
        for g in home["grupuri"]:
            loc = rb.locator(f'.pg-grup[aria-label="{g["eticheta"]}"]')
            n = loc.locator(".pg-b").count() if loc.count() else -1
            nota(n == len(g["butoane"]), f"grupul {g['eticheta']}: {n} butoane (date: {len(g['butoane'])})")
        for sel in ('[data-rb="b"]', '[data-mn="fill"]', '[data-rb="merge"]', '[data-rb="sum"]', "select[data-nf]"):
            nota(rb.locator(sel).count() == 1, f"mânerul {sel} e pe butonul real")
        rb.locator('[aria-label="Format Painter"]').click()
        nota("nu-l folosim" in pg.locator(".rb.pg .pg-nota").inner_text(), "Format Painter spune pe ecran că nu-l folosim")
        pg.locator('.rb.pg [data-tab="data"]').click()
        nota(pg.locator('.rb.pg [data-so="desc"]').count() == 1, "fila Data are Sort Z to A legat")
        pg.locator('.rb.pg [data-tab="home"]').click()
        w = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
        nota(w[0] <= w[1] + 1, f"pagina nu e mai lată decât ecranul ({w[0]} ≤ {w[1]})")
        rb.scroll_into_view_if_needed()
        rb.screenshot(path=str(CAPT / f"panglica_{nume}.png"))
        nota(not errs, f"fără erori JS {errs[:2]}")
        ctx.close()
    b.close()
srv.shutdown()
print("----")
print(picate)
