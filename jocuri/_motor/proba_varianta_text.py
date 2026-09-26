"""Proba „ca elevul”: la sarcinile „Alege celula …” variantele se rezolvă DIN TEXT, nu din verificare.

De ce (26.09.2026): textul variantei rămânea „coloanei B cu rândul 6”, iar verificarea aștepta celula mutată
(C7) - varianta corectă era marcată greșită. proba_exersare.py nu prindea asta: rezolva variantele cu
JocExcel.rezolvaPractica(), adică din chiar verificarea sarcinii. Aici ținta se citește DIN TEXTUL afișat
(„B6” sau „coloana B … rândul 6”), se dă clic pe ea și trebuie acceptată. Mai verifică:
  - textul variantei diferă de întrebarea inițială (nu se repetă întrebarea);
  - cât exersează, sarcina inițială (întrebarea + foaia) e ascunsă: o singură foaie pe ecran;
  - „Gata cu exersarea” readuce sarcina inițială.
  python proba_varianta_text.py [--baza URL] [--joc excel-pas-cu-pas-viii] [--n 25]
Ultima linie = numărul de probleme."""
import argparse
import functools
import http.server
import re
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


def tinta_din_text(t):
    """Celula cerută, citită ca un elev: întâi o adresă scrisă (C4), apoi „coloana X … rândul N”."""
    m = re.search(r"\b([A-Z]{1,2})(\d{1,3})\b", t)
    if m:
        return m.group(1) + m.group(2)
    c = re.search(r"coloan(?:a|ei)\s+([A-Z]{1,2})\b", t)
    r = re.search(r"rând(?:ul|ului)\s+(\d+)", t)
    return (c.group(1) + r.group(1)) if c and r else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza")
    ap.add_argument("--joc", default="excel-pas-cu-pas-viii")
    ap.add_argument("--n", type=int, default=25)
    a = ap.parse_args()
    if not a.baza:
        srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8774), functools.partial(Tacut, directory=str(SITE)))
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        a.baza = "http://127.0.0.1:8774"
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
        cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config().nivele.map(n=>n.qs.map(q=>({t:q.t,q:q.q,v:q.verifica||{},liber:Array.isArray(q.o)})))))")
        pg.evaluate("JocMotor.test.deblocheaza()")
        sarcini = 0
        for li, qs in enumerate(cfg):
            for qi, q in enumerate(qs):
                if q["t"] != "excel" or q["liber"] or list(q["v"].keys()) != ["sel"]:
                    continue
                sarcini += 1
                et = "N%dÎ%d" % (li + 1, qi + 1)
                pg.evaluate("document.getElementById('go-home').click()")
                pg.click('.lvl[data-l="%d"]' % li); pg.click("#go")
                for _ in range(qi):
                    pg.evaluate("JocMotor.test.rezolva()")
                    if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                        pg.click("#chk")
                    pg.click("#next")
                pg.evaluate("JocMotor.test.rezolva()"); pg.click("#chk")
                if not verifica(pg.locator("[data-exs]").count() == 1, "%s: lipsește „Exersează”" % et):
                    continue
                q_orig = re.sub(r"<[^>]+>", "", q["q"])
                pg.click("[data-exs]")
                vizibile = pg.evaluate("[...document.querySelectorAll('.xl')].filter(x=>x.offsetParent!==null).length")
                verifica(vizibile == 1, "%s: cât exersează se văd %d foi (trebuie 1)" % (et, vizibile))
                verifica(not pg.locator(".stack > .q").is_visible(), "%s: întrebarea inițială rămâne vizibilă lângă variantă" % et)
                for k in range(a.n):
                    if k:
                        pg.click("[data-exa]")
                    text = pg.inner_text(".xl-ex .q")
                    verifica(text.strip() != q_orig.strip(), "%s v%d: varianta repetă întrebarea: %r" % (et, k + 1, text))
                    t = tinta_din_text(text)
                    if not verifica(t is not None, "%s v%d: nu pot citi celula din text: %r" % (et, k + 1, text)):
                        break
                    celula = pg.locator("#xexb td[data-a='%s']" % t)
                    if not verifica(celula.count() == 1, "%s v%d: celula %s din text nu e în foaie" % (et, k + 1, t)):
                        break
                    celula.click()
                    pg.click("[data-exv]")
                    if not verifica(pg.locator(".xl-ex .fb.ok").count() == 1,
                                    "%s v%d: textul cere %s, clic acolo, dar e respins: %s" % (et, k + 1, t, pg.inner_text("#xexf")[:160])):
                        pg.evaluate("JocExcel.rezolvaPractica()"); pg.click("[data-exv]")
                pg.click("[data-exg]")
                verifica(pg.locator(".stack > .q").is_visible() and pg.locator("[data-exs]").count() == 1,
                         "%s: „Gata cu exersarea” nu readuce sarcina inițială" % et)
        verifica(sarcini > 0, "nicio sarcină „Alege celula” găsită (proba n-a verificat nimic)")
        verifica(not erori, "erori JavaScript: %s" % erori[:3])
        br.close()
    print("Sarcini „Alege celula” verificate: %d × %d variante" % (sarcini, a.n))
    print("Rezultat: " + ("TOATE OK" if not probleme else "%d probleme" % len(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
