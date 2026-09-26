"""Proba NIVELURILOR ȚINUTE DEOPARTE (26.09.2026, găsită de /bucla): ce se face cât stă „Ești tot X?” pe ecran
   nu intră la X; la „Nu” / „Alege-te din listă” ajunge la cel care se alege. Ultima linie = nr. de probleme.
   python proba_tinut.py [joc]
"""
import functools, http.server, json, sys, threading
from pathlib import Path
sys.stdout.reconfigure(encoding="utf-8")
SITE = Path(__file__).resolve().parents[2]
JOC = sys.argv[1] if len(sys.argv) > 1 else "web-viii"
probleme = []


def verifica(c, ce):
    print(("  ok   " if c else "  RĂU  ") + ce)
    if not c:
        probleme.append(ce)


class T(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8781), functools.partial(T, directory=str(SITE)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
baza = "http://127.0.0.1:8781"
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(viewport={"width": 1366, "height": 800})
    ctx.route("**/api/activitate", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
    ctx.route("**/api/progres", lambda r: r.fulfill(status=200, body='{"ok":true,"date":{}}', headers={"access-control-allow-origin": "*", "content-type": "application/json"}))
    pg = ctx.new_page()
    erori = []
    pg.on("pageerror", lambda e: erori.append(str(e)))
    joc = "%s/jocuri/%s/index.html" % (baza, JOC)

    def deschide():
        pg.goto(joc, wait_until="load")
        pg.wait_for_function("window.Prezenta&&document.getElementById('lhp')", timeout=15000)

    def lv(k):
        return pg.evaluate("k=>Object.keys((JSON.parse(localStorage.getItem(k))||{}).lv||{}).map(Number).sort()", k)

    def cheie(suf):
        return pg.evaluate("s=>JocMotor.test.config().cheie+'@'+s", suf)

    def profil():
        return pg.evaluate("localStorage.getItem('learninghub_active_profile')")

    def joaca(li):
        pg.click('.lvl[data-l="%d"]' % li)
        pg.click("#go")
        for _ in range(pg.evaluate("JocMotor.test.config().nivele[%d].qs.length" % li)):
            pg.evaluate("JocMotor.test.rezolva()")
            if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                pg.click("#chk")
            pg.click("#next")
        pg.click("#toc")

    def inscrie(nume, cod="4827"):
        pg.wait_for_selector("#lhp-s", timeout=10000)
        pg.wait_for_function("document.querySelectorAll('#lhp-s option').length>2", timeout=15000)
        pg.select_option("#lhp-s", "forestier"); pg.select_option("#lhp-c", "X E"); pg.fill("#lhp-n", nume); pg.fill("#lhp-k", cod)
        with pg.expect_navigation(timeout=20000):
            pg.click("#lhp-ok")
        pg.wait_for_function("window.Prezenta&&document.getElementById('lhp-pill')", timeout=15000)

    def intreaba():
        pg.evaluate("(()=>{const e=JSON.parse(localStorage.getItem('lh_prezenta'));e.ultima=Date.now()-2*3600e3;localStorage.setItem('lh_prezenta',JSON.stringify(e))})()")
        deschide()
        pg.wait_for_selector("#lhp-da", timeout=8000)

    print("Joc:", JOC)
    deschide(); pg.evaluate("localStorage.clear()"); deschide()
    pg.click("#lhp-cine"); inscrie("Ana Proba")
    pA = profil(); kA = cheie(pA)
    joaca(0)
    verifica(lv(kA) == [0], "A: nivelul 1 în %s (%s)" % (kA, lv(kA)))

    print("scenariul „Nu”")
    intreaba()
    joaca(1)
    verifica(lv(kA) == [0], "cât stă întrebarea, sertarul lui A NU primește nivelul 2 (%s)" % lv(kA))
    verifica(lv(cheie("_tinut")) == [1], "nivelul 2 ținut deoparte în @_tinut (%s)" % lv(cheie("_tinut")))
    pg.click("#lhp-nu")
    pg.wait_for_selector("#lhp-lista", timeout=5000)
    verifica(lv(kA) == [0], "după „Nu”: @A are DOAR nivelul 0 (%s)" % lv(kA))
    verifica(lv(cheie("_neinscris")) == [1], "după „Nu”: nivelul 2 la cel care stă acum (@_neinscris) (%s)" % lv(cheie("_neinscris")))
    pg.click("#lhp-nou"); inscrie("Bogdan Proba")
    pB = profil(); kB = cheie(pB)
    verifica(pB != pA and lv(kB) == [1], "B s-a ales: nivelul 2 e al lui (%s)" % lv(kB))
    verifica(lv(kA) == [0], "A tot doar nivelul 0 (%s)" % lv(kA))
    verifica(lv(cheie("_neinscris")) == [] and lv(cheie("_tinut")) == [], "nimic rămas deoparte")

    print("scenariul „Da”")
    pg.click("#lhp-pill"); pg.click("#lhp-alt")
    pg.wait_for_selector("#lhp-lista", timeout=5000)
    with pg.expect_navigation(timeout=20000):
        pg.locator("#lhp-lista .el", has_text="Ana Proba").click()
    pg.wait_for_function("document.getElementById('lhp-pill')", timeout=15000)
    intreaba()
    joaca(1)
    verifica(lv(kA) == [0], "A (întrebare): încă nu primește (%s)" % lv(kA))
    pg.click("#lhp-da"); pg.wait_for_timeout(300)
    verifica(lv(kA) == [0, 1], "„Da”: nivelul 2 trece la A (%s)" % lv(kA))
    verifica(lv(cheie("_tinut")) == [], "@_tinut golit")
    joaca(2) if pg.evaluate("JocMotor.test.config().nivele.length") > 2 else None
    verifica(2 in lv(kA) or pg.evaluate("JocMotor.test.config().nivele.length") <= 2, "după „Da” salvează normal la A (%s)" % lv(kA))

    print("„Alege-te din listă” + „Mai târziu”")
    pg.wait_for_selector("#alt-elev", timeout=8000)
    pg.click("#alt-elev"); pg.wait_for_selector("#lhp-lista", timeout=5000)
    pg.click("#lhp-x"); pg.wait_for_timeout(300)
    verifica(pg.evaluate("Object.keys(JSON.parse(localStorage.getItem(JocMotor.test.config().cheie+'@_neinscris')||'{}').lv||{}).length") == 0, "neînscrisul pornește fără nivelurile lui A")
    toc_done = pg.evaluate("document.querySelectorAll('.lvl.done, .lvl .stars .on').length")
    joaca(0)
    antes = lv(kA)
    verifica(lv(cheie("_neinscris")) == [0], "nivelul neînscrisului e în @_neinscris (%s)" % lv(cheie("_neinscris")))
    pg.click("#lhp-elev"); inscrie("Carmen Proba")
    kC = cheie(profil())
    verifica(lv(kC) == [0], "Carmen primește nivelul făcut neînscrisă (%s)" % lv(kC))
    verifica(lv(kA) == antes, "A neatins (%s)" % lv(kA))
    verifica(not erori, "fără erori JS %s" % erori[:3])
    br.close()
srv.shutdown()
print("Rezultat: " + ("TOATE OK" if not probleme else "; ".join(probleme)))
print(len(probleme))
