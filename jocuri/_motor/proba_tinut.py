"""Proba NIVELURILOR ȚINUTE DEOPARTE (26.09.2026, găsită de /bucla): ce se face cât stă „Ești tot X?” pe ecran
   nu intră la X; la „Nu” / „Alege-te din listă” ajunge la cel care se alege. Ultima linie = nr. de probleme.
   python proba_tinut.py [joc]
   Adusă la zi pe 10.10.2026: de la 30.09.2026 (706734c6) un nume din „Cine lucrează acum?” cere codul lui (fereastra
   #lhp-pc → „Intră”), iar proba aștepta reîncărcarea direct după clic (TimeoutError la „scenariul Da”); de la 28.09.2026
   (f1790874) „Da” cu muncă ținută deoparte mai întreabă „Ai lucrat TU asta, acum?” (#lhp-da2). Tot atunci:
   regula 24 — tot ce nu e 127.0.0.1 / localhost se abandonează, /api/* e simulat, iar o cerere scăpată e problemă.
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

# regula 24 (05_STANDARD_LECTIE.md): pagina vorbește doar cu situl local; /api/activitate și /api/progres sunt simulate
LOCALE = ("http://127.0.0.1", "http://localhost", "data:", "blob:")
SIMULATE = ("/api/activitate", "/api/progres")
oprite, scapate = [], []


def taie(r):
    if r.request.url.startswith(LOCALE):
        return r.continue_()
    oprite.append(r.request.url)
    return r.abort()


with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(viewport={"width": 1366, "height": 800})
    ctx.route("**/*", taie)   # întâi: tot ce nu e local se abandonează; rutele de mai jos (simulate) au întâietate
    # scurgere = o cerere spre altă adresă care a primit răspuns (nu cele oprite, nu cele simulate de probă)
    ctx.on("requestfinished", lambda q: scapate.append(q.url) if not q.url.startswith(LOCALE) and not any(s in q.url for s in SIMULATE) else None)
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

    def din_lista(nume, cod="4827"):
        # de la 30.09.2026 numele din listă cere codul lui (fereastra de cod, „Intră”), abia apoi se reîncarcă pagina
        pg.locator("#lhp-lista .el", has_text=nume).click()
        pg.wait_for_selector("#lhp-pc", timeout=5000)
        for i in ("#lhp-pc", "#lhp-pc2"):
            if pg.locator(i).count():
                pg.fill(i, cod)
        with pg.expect_navigation(timeout=20000):
            pg.click("#lhp-intra")
        pg.wait_for_function("window.Prezenta&&document.getElementById('lhp-pill')", timeout=15000)

    def intreaba():
        pg.evaluate("(()=>{const e=JSON.parse(localStorage.getItem('lh_prezenta'));e.ultima=Date.now()-2*3600e3;localStorage.setItem('lh_prezenta',JSON.stringify(e))})()")
        deschide()
        pg.wait_for_selector("#lhp-da", timeout=8000)

    try:
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
        din_lista("Ana Proba")
        verifica(profil() == pA, "Ana a intrat din listă cu codul ei")
        intreaba()
        joaca(1)
        verifica(lv(kA) == [0], "A (întrebare): încă nu primește (%s)" % lv(kA))
        pg.click("#lhp-da")
        # de la 28.09.2026 (f1790874), cu muncă ținută deoparte, „Da” mai întreabă o dată: „Ai lucrat TU asta, acum?”
        pg.wait_for_selector("#lhp-da2", timeout=5000)
        verifica(lv(kA) == [0], "între „Da” și „Da, eu am lucrat”: A încă nu primește (%s)" % lv(kA))
        pg.click("#lhp-da2"); pg.wait_for_timeout(300)
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
    except Exception as e:   # o oprire (selector care nu mai apare) e o problemă numărată, nu o stivă fără număr
        verifica(False, "proba s-a oprit: " + " | ".join(l.strip() for l in str(e).splitlines() if l.strip())[:300])

    verifica(not erori, "fără erori JS %s" % erori[:3])
    # trimiterile de la închiderea paginii (sendBeacon pe pagehide) trec și ele prin rute, cât contextul e încă deschis
    pg.goto("about:blank"); pg.wait_for_timeout(500)
    verifica(not scapate, "nimic n-a plecat în afara 127.0.0.1 (%d oprite) %s" % (len(oprite), scapate[:3]))
    br.close()
srv.shutdown()
print("Rezultat: " + ("TOATE OK" if not probleme else "; ".join(probleme)))
print(len(probleme))
