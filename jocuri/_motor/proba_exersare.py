"""Proba EXERSĂRII PE VARIANTE (25.09.2026): pentru fiecare sarcină „excel” din joc (în afară de „încearcă singur”):
rezolvă sarcina de bază, deschide „Exersează pe variante” și verifică:
  - varianta e ALTA (numere / poziție / text diferite de bază);
  - soluția potrivită variantei e acceptată, o soluție greșită e respinsă și resetează seria;
  - după 3 corecte la rând apare „stăpânit”.
  python proba_exersare.py [--baza URL] [--joc excel-pas-cu-pas-viii]
Ultima linie = numărul de probleme."""
import argparse
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

SITE = Path(__file__).resolve().parents[2]
probleme = []


def verifica(cond, ce):
    if not cond:
        print("  RĂU  " + ce)
        probleme.append(ce)
    return cond


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza")
    ap.add_argument("--joc", default="excel-pas-cu-pas-viii")
    a = ap.parse_args()
    if not a.baza:
        srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8773), functools.partial(Tacut, directory=str(SITE)))
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        a.baza = "http://127.0.0.1:8773"
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": 1366, "height": 900})
        ctx.route("**/api/activitate", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
        pg = ctx.new_page()
        erori = []
        pg.on("pageerror", lambda e: erori.append(str(e)))
        pg.goto("%s/jocuri/%s/index.html" % (a.baza, a.joc), wait_until="load")
        pg.evaluate("localStorage.clear();localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
        pg.reload(wait_until="load")
        cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config().nivele.map(n=>n.qs.map(q=>({t:q.t,liber:Array.isArray(q.o)})))))")
        pg.evaluate("JocMotor.test.deblocheaza()")
        n_sarcini = 0
        for li, qs in enumerate(cfg):
            for qi, q in enumerate(qs):
                if q["t"] != "excel" or q["liber"]:
                    continue
                n_sarcini += 1
                eticheta = "N%dÎ%d" % (li + 1, qi + 1)
                pg.evaluate("document.getElementById('go-home').click()")
                pg.click('.lvl[data-l="%d"]' % li); pg.click("#go")
                for _ in range(qi):
                    pg.evaluate("JocMotor.test.rezolva()")
                    if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                        pg.click("#chk")
                    pg.click("#next")
                pg.evaluate("JocMotor.test.rezolva()"); pg.click("#chk")
                if not verifica(pg.locator("[data-exs]").count() == 1, "%s: după rezolvare lipsește butonul „Exersează”" % eticheta):
                    continue
                baza = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config().nivele[%d].qs[%d]))" % (li, qi))
                pg.click("[data-exs]")
                pr = pg.evaluate("JocExcel.practica()")
                verifica(pr and (json.dumps(pr["cells"], sort_keys=True) != json.dumps(baza.get("cells", {}), sort_keys=True) or pr["q"] != baza["q"]),
                         "%s: varianta nu diferă de sarcina de bază" % eticheta)
                # greșit -> respins, serie 0
                pg.evaluate("JocExcel.gresestePractica()"); pg.click("[data-exv]")
                verifica(pg.locator(".xl-ex .fb.bad").count() == 1, "%s: varianta greșită nu e respinsă" % eticheta)
                # ca un elev: „Arată-mi” (vede soluția), apoi cere altă variantă
                if pg.locator("[data-exr]").count():
                    pg.click("[data-exr]")
                verifica(pg.locator("[data-exa]").count() == 1, "%s: după „Arată-mi” lipsește „Altă variantă”" % eticheta)
                pg.click("[data-exa]")
                # 3 variante corecte la rând
                for k in range(3):
                    if k:
                        pg.click("[data-exa]")
                    pg.evaluate("JocExcel.rezolvaPractica()"); pg.click("[data-exv]")
                    ok = pg.locator(".xl-ex .fb.ok").count() == 1
                    if not verifica(ok, "%s: varianta %d, rezolvată corect, NU e acceptată: %s | %s" % (eticheta, k + 1, pg.inner_text(".xl-ex #xexf")[:140], json.dumps(pg.evaluate("JocExcel.practica()"), ensure_ascii=False)[:300])):
                        break
                else:
                    verifica("stăpânit" in pg.inner_text(".xl-ex"), "%s: după 3 la rând nu apare „stăpânit”" % eticheta)
        verifica(not erori, "erori JavaScript: %s" % erori[:3])
        br.close()
    print("Sarcini verificate: %d" % n_sarcini)
    print("Rezultat: " + ("TOATE OK" if not probleme else "%d probleme" % len(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
