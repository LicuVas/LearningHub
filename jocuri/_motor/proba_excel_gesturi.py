"""Proba GESTURILOR din simulatorul Excel (tip-excel.js), cu mouse și tastatură ADEVĂRATE (25.09.2026).

  python proba_excel_gesturi.py [--baza URL]

Poarta obișnuită (test_joc.py) pune soluția direct; aici elevul e jucat „cu mâna”: clic, tragere, tastare,
Enter/Tab/săgeți, F2, F4, Esc, Delete, pătrățelul de umplere, setări RO/EN. Fiecare comportament e comparat cu
ce face Excel-ul adevărat (descris în comentarii). Ultima linie = numărul de probleme.
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
JOC = "excel-pas-cu-pas-viii"
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
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8771), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return "http://127.0.0.1:8771"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza")
    a = ap.parse_args()
    baza = (a.baza or server_local()).rstrip("/")
    print("Proba gesturilor Excel pe", baza)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": 1366, "height": 900})
        ctx.route("**/api/activitate", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
        pg = ctx.new_page()
        erori = []
        pg.on("pageerror", lambda e: erori.append(str(e)))
        pg.goto("%s/jocuri/%s/index.html" % (baza, JOC), wait_until="load")
        pg.evaluate("localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")   # fără banda de înscriere
        pg.reload(wait_until="load")
        pg.evaluate("JocMotor.test.deblocheaza()"); pg.evaluate("document.getElementById('go-home').click()")

        def la(nivel, intrebare):
            pg.evaluate("document.getElementById('go-home').click()")
            pg.click('.lvl[data-l="%d"]' % nivel); pg.click("#go")
            for _ in range(intrebare):
                pg.evaluate("JocMotor.test.rezolva()")
                if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                    pg.click("#chk")
                pg.click("#next")
            pg.wait_for_selector(".xl")

        cel = lambda ad: pg.locator('td[data-a="%s"]' % ad)
        nb = lambda: pg.inner_text(".xl .nb").strip()
        fx = lambda: pg.input_value("#xfx")

        def centru(ad):
            b = cel(ad).bounding_box()
            return b["x"] + b["width"] / 2, b["y"] + b["height"] / 2

        def trage(de_la, pana_la):
            x1, y1 = centru(de_la); x2, y2 = centru(pana_la)
            pg.mouse.move(x1, y1); pg.mouse.down(); pg.mouse.move((x1 + x2) / 2, (y1 + y2) / 2, steps=4); pg.mouse.move(x2, y2, steps=4); pg.mouse.up()

        def trage_colt(pana_la):
            h = pg.locator(".xl .fh").bounding_box()
            x2, y2 = centru(pana_la)
            pg.mouse.move(h["x"] + 4, h["y"] + 4); pg.mouse.down(); pg.mouse.move(x2, y2, steps=8); pg.mouse.up()

        def verifica_corect(ce):
            pg.click("#chk"); pg.wait_for_timeout(150)
            ok = pg.locator("#fb .fb.ok").count() > 0
            verifica(ok, ce + ("" if ok else " — mesaj: " + pg.inner_text("#fb")[:160]))

        print("1. selectarea")
        la(0, 0)
        cel("C4").click()
        verifica(nb() == "C4", "clic pe C4 -> caseta de nume arată C4 (ca în Excel)")
        verifica_corect("sarcina „alege C4” acceptată")
        la(0, 2)
        trage("B2", "C2")
        verifica(nb() == "B2:C2", "tras de la B2 la C2 -> caseta de nume B2:C2")
        st = pg.inner_text("#xst")
        verifica("17" in st and "Medie" in st and "Număr" in st, "bara de stare: Medie / Număr / Sumă 17 (%s)" % st.replace("\n", " "))
        pg.keyboard.press("Shift+ArrowDown")
        verifica(nb() == "B2:C3", "Shift+săgeată extinde zona (B2:C3), ca în Excel")
        trage("B2", "C2")
        verifica_corect("sarcina „selectează B2:C2” acceptată")

        print("2. scrierea direct în celulă")
        la(1, 0)
        cel("A1").click(); pg.keyboard.type("Elev"); pg.keyboard.press("Tab")
        verifica(nb() == "B1", "Tab după scriere -> trece la dreapta (B1)")
        pg.keyboard.type("Nota"); pg.keyboard.press("Enter")
        verifica(nb() == "B2", "Enter după scriere -> coboară (B2)")
        verifica(cel("A1").inner_text().strip() == "Elev", "A1 arată „Elev”")
        verifica_corect("capul de tabel scris direct în celulă, acceptat")
        la(1, 1)
        cel("B2").click(); pg.keyboard.type("9"); pg.keyboard.press("Enter")
        pg.keyboard.type("7.5"); pg.keyboard.press("Enter")
        cls = cel("B3").get_attribute("class") or ""
        verifica(" n" not in (" " + cls) and cel("B3").inner_text().strip() == "7.5", "setări RO: 7.5 cu punct rămâne TEXT, la stânga (ca în Excel)")
        cel("B3").click(); pg.keyboard.type("7,5"); pg.keyboard.press("Enter")
        verifica(" n" in (" " + (cel("B3").get_attribute("class") or "")), "setări RO: 7,5 cu virgulă e NUMĂR, la dreapta")
        verifica(" n" in (" " + (cel("B2").get_attribute("class") or "")), "9 e număr, la dreapta")
        verifica_corect("notele 9 și 7,5 acceptate")
        pg.click('[data-mod="en"]')
        verifica(cel("B3").inner_text().strip() == "7.5", "trecut pe setări EN: numărul se afișează 7.5")
        la(1, 3)
        cel("C3").click(); pg.keyboard.press("Delete")
        verifica(cel("C3").inner_text().strip() == "", "Delete golește celula")
        verifica_corect("golirea cu Delete acceptată")
        la(1, 2)
        cel("B3").click(); pg.keyboard.press("F2"); pg.keyboard.press("End"); pg.keyboard.press("Backspace"); pg.keyboard.type("8"); pg.keyboard.press("Escape")
        verifica(cel("B3").inner_text().strip() == "3", "F2 + modificare + Esc -> renunță, rămâne 3 (ca în Excel)")
        pg.keyboard.type("8"); pg.keyboard.press("Enter")
        verifica_corect("scris peste valoarea greșită (8), acceptat")

        print("3. formula cu adrese puse cu mouse-ul")
        la(2, 0)
        cel("D2").click(); pg.keyboard.type("=")
        cel("B2").click(); pg.keyboard.type("+"); cel("C2").click()
        verifica(fx() == "=B2+C2", "= apoi clic pe B2, +, clic pe C2 -> bara fx arată =B2+C2 (%s)" % fx())
        pg.keyboard.press("Enter")
        verifica(cel("D2").inner_text().strip() == "17", "Enter -> D2 arată rezultatul 17")
        cel("D2").click()
        verifica(fx() == "=B2+C2", "D2 aleasă -> bara fx arată formula, nu rezultatul")
        verifica_corect("prima formulă cu clic pe celule acceptată")
        la(2, 2)
        cel("D3").click(); pg.keyboard.type("="); pg.keyboard.press("ArrowLeft")
        verifica(fx() == "=C3", "= apoi săgeată stânga -> indică C3 (modul de indicare din Excel): %s" % fx())
        pg.keyboard.type("-"); pg.keyboard.press("ArrowLeft"); pg.keyboard.press("ArrowLeft")
        verifica(fx() == "=C3-B3", "- apoi două săgeți stânga -> =C3-B3 (%s)" % fx())
        pg.keyboard.press("Enter")
        verifica_corect("formula făcută doar din tastatură (săgeți) acceptată")

        print("4. tras de colț (fill handle)")
        la(3, 0)
        cel("D2").click(); pg.keyboard.type("=B2*C2"); pg.keyboard.press("Enter")
        cel("D2").click(); trage_colt("D5")
        verifica(cel("D5").inner_text().strip() == "4", "tras de colț până la D5 -> D5 = 1*4 = 4")
        cel("D5").click()
        verifica(fx() == "=B5*C5", "D5 are formula mutată =B5*C5, ca la AutoFill în Excel (%s)" % fx())
        cel("D2").click()
        verifica_corect("coloana calculată prin tragere, acceptată")

        print("5. funcție cu zona trasă cu mouse-ul")
        la(4, 0)
        cel("B7").click(); pg.keyboard.type("=SUM("); trage("B2", "B6")
        verifica(fx() == "=SUM(B2:B6", "=SUM( apoi tras B2..B6 -> =SUM(B2:B6 (%s)" % fx())
        pg.keyboard.type(")"); pg.keyboard.press("Enter")
        verifica(cel("B7").inner_text().strip() == "36", "B7 = 36")
        verifica_corect("SUM cu zona trasă acceptat")

        print("6. F4 și adresa fixă")
        la(5, 0)
        cel("C2").click(); pg.keyboard.type("=B2*"); cel("F1").click(); pg.keyboard.press("F4")
        verifica(fx() == "=B2*$F$1", "F4 după clic pe F1 -> $F$1 (%s)" % fx())
        pg.keyboard.press("F4"); ok2 = fx() == "=B2*F$1"; pg.keyboard.press("F4"); ok3 = fx() == "=B2*$F1"; pg.keyboard.press("F4"); ok4 = fx() == "=B2*F1"
        verifica(ok2 and ok3 and ok4, "F4 repetat: F$1 -> $F1 -> F1 (ordinea din Excel)")
        pg.keyboard.press("F4"); pg.keyboard.press("Enter")
        cel("C2").click(); trage_colt("C5")
        cel("C5").click()
        verifica(fx() == "=B5*$F$1", "tras în jos: B se mută, $F$1 rămâne (%s)" % fx())
        verifica_corect("TVA cu $F$1 și tragere acceptat")

        print("7. setările RO: virgula greșită între părți")
        la(6, 0)
        cel("D2").click(); pg.keyboard.type('=IF(B2>=5,"admis","respins")'); pg.keyboard.press("Enter")
        dlg = pg.locator(".xl .dlg").count() and pg.inner_text(".xl .dlg")
        verifica(bool(dlg) and "problem" in dlg, "setări RO + virgulă -> fereastra „There's a problem with this formula”")
        pg.fill("#xfx", '=IF(B2>=5;"admis";"respins")'); pg.keyboard.press("Enter")
        verifica(cel("D2").inner_text().strip() == "admis", "cu ; -> D2 = admis")
        cel("D2").click(); trage_colt("D6")
        verifica(cel("D3").inner_text().strip() == "admis" and cel("D5").inner_text().strip() == "admis" and cel("D6").inner_text().strip() == "admis", "tras până la D6 -> verdictele coloanei")
        verifica_corect("IF pe setări RO, tras în jos, acceptat")

        verifica(not erori, "fără erori JavaScript %s" % erori[:3])
        br.close()
    print("Rezultat: " + ("TOATE OK" if not probleme else "; ".join(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
