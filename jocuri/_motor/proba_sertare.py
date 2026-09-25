"""Proba PROGRESULUI PE ELEV pe același calculator (25.09.2026): fiecare elev își reia jocurile și lecțiile.

  python proba_sertare.py [--baza URL]

Fără --baza pornește un server local pe folderul site-ului. Trimiterile spre serverul de evidență sunt
simulate (nu pleacă nimic). Scenariul, pe UN calculator:
  1. Ana joacă nivelul 1 NEÎNSCRISĂ, apoi se înscrie -> fiind primul elev, își păstrează nivelul (nimic pierdut)
  2. „Sunt alt elev” în joc -> „Ești tot Ana?” -> „Nu” -> se înscrie Bogdan -> pagina trece pe profilul lui:
     jocul e de la zero (nu vede nivelul Anei); Bogdan face nivelurile 1 și 2
  3. se reînscrie Ana -> vede DOAR nivelul ei; se reînscrie Bogdan -> vede cele 2 niveluri ale lui
  4. lecțiile: progresul se salvează pe profilul elevului (cheia lecției diferă între Ana și Bogdan)
Ultima linie = numărul de probleme.
"""
import argparse
import functools
import http.server
import sys
import threading
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

SITE = Path(__file__).resolve().parents[2]
JOC = "excel-viii"
LECTIE = "/content/tic/cls5/m1-sisteme/lectia1-calculator.html"
probleme = []


def verifica(cond, ce):
    print(("  ok   " if cond else "  RĂU  ") + ce)
    if not cond:
        probleme.append(ce)


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def server_local():
    h = functools.partial(Tacut, directory=str(SITE))
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8770), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return "http://127.0.0.1:8770"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza")
    a = ap.parse_args()
    baza = (a.baza or server_local()).rstrip("/")
    print("Proba progresului pe elev pe", baza)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": 1366, "height": 800})
        ctx.route("**/api/activitate", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
        pg = ctx.new_page()
        erori = []
        pg.on("pageerror", lambda e: erori.append(str(e)))
        joc = "%s/jocuri/%s/index.html" % (baza, JOC)

        def deschide(url):
            pg.goto(url, wait_until="load")
            pg.wait_for_function("window.Prezenta&&document.getElementById('lhp')", timeout=15000)

        def niveluri():
            return pg.evaluate("Object.keys(JSON.parse(localStorage.getItem((()=>{const k=JocMotor.test.config().cheie,p=localStorage.getItem('learninghub_active_profile');return p&&p!=='_guest'?k+'@'+p:k})()))?.lv||{}).map(Number).sort()")

        def joaca(li):
            pg.evaluate("JocMotor.test.deblocheaza&&0")
            pg.click('.lvl[data-l="%d"]' % li); pg.click("#go")
            for _ in range(pg.evaluate("JocMotor.test.config().nivele[%d].qs.length" % li)):
                pg.evaluate("JocMotor.test.rezolva()")
                if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                    pg.click("#chk")
                pg.click("#next")
            pg.click("#toc")

        def inscrie(nume, reincarca=True):
            pg.wait_for_selector("#lhp-s", timeout=10000)
            pg.wait_for_function("document.querySelectorAll('#lhp-s option').length>2", timeout=15000)
            pg.select_option("#lhp-s", "forestier"); pg.select_option("#lhp-c", "X E"); pg.fill("#lhp-n", nume)
            if reincarca:
                with pg.expect_navigation(timeout=15000):
                    pg.click("#lhp-ok")
            else:
                pg.click("#lhp-ok")
            pg.wait_for_function("window.Prezenta&&document.getElementById('lhp-pill')", timeout=15000)

        def schimba(nume, reincarca=True):
            pg.click("#lhp-pill"); pg.click("#lhp-alt"); inscrie(nume, reincarca)

        print("1. Ana joacă neînscrisă, apoi se înscrie")
        deschide(joc)
        pg.evaluate("localStorage.clear()")
        deschide(joc)
        joaca(0)
        verifica(niveluri() == [0], "neînscrisă: nivelul 1 făcut")
        pg.click("#lhp-cine")
        inscrie("Ana Proba", reincarca=False)   # primul elev: moștenește profilul existent, nu e nevoie de reîncărcare
        verifica(niveluri() == [0], "după înscriere Ana își păstrează nivelul 1 (primul elev moștenește)")

        print("2. „Sunt alt elev” -> Bogdan, de la zero")
        pg.click("#alt-elev")
        pg.wait_for_selector("#lhp-nu", timeout=5000)
        verifica(niveluri() == [0], "„Sunt alt elev” (elev înscris) nu mai șterge nimic, doar întreabă")
        pg.click("#lhp-nu")
        inscrie("Bogdan Proba")
        verifica(niveluri() == [], "Bogdan pornește de la zero (nu vede nivelul Anei): %s" % niveluri())
        joaca(0); joaca(1)
        verifica(niveluri() == [0, 1], "Bogdan: nivelurile 1 și 2")

        print("3. revin pe rând")
        schimba("Ana Proba")
        verifica(niveluri() == [0], "Ana revine: vede DOAR nivelul ei (%s)" % niveluri())
        verifica("Ana Proba" in pg.input_value("#nume") or pg.input_value("#nume") == "", "numele din joc nu e al lui Bogdan (%r)" % pg.input_value("#nume"))
        schimba("Bogdan Proba")
        verifica(niveluri() == [0, 1], "Bogdan revine: nivelurile lui (%s)" % niveluri())

        print("4. lecțiile, pe profilul elevului")
        deschide(baza + LECTIE)
        kb = pg.evaluate("typeof AtomicLearning!=='undefined'&&AtomicLearning.getStorageKey()")
        schimba("Ana Proba")
        ka = pg.evaluate("typeof AtomicLearning!=='undefined'&&AtomicLearning.getStorageKey()")
        verifica(bool(ka) and bool(kb) and ka != kb, "cheia lecției diferă: Ana %r, Bogdan %r" % (ka, kb))
        verifica(not erori, "fără erori JavaScript %s" % erori[:3])
        br.close()
    print("Rezultat: " + ("TOATE OK" if not probleme else "; ".join(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
