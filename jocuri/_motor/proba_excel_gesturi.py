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
        ctx = br.new_context(viewport={"width": 1366, "height": 900}, permissions=["clipboard-read", "clipboard-write"])
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
        x1, y1 = centru("B2"); x2, y2 = centru("C2")
        pg.mouse.move(x1, y1); pg.mouse.down(); pg.mouse.move(x2, y2, steps=6)
        verifica(nb() == "1R x 2C", "cât tragi, caseta de nume arată mărimea: 1R x 2C (ca în Excel): %s" % nb())
        pg.mouse.up()
        verifica(nb() == "B2", "după tragere, caseta de nume arată celula activă B2 (Excel; Sheets ar arăta B2:C2): %s" % nb())
        st = pg.inner_text("#xst")
        verifica("17" in st and "Medie" in st and "Număr" in st, "bara de stare: Medie / Număr / Sumă 17 (%s)" % st.replace("\n", " "))
        pg.keyboard.press("Shift+ArrowDown")
        verifica("Număr (Count): 4" in pg.inner_text("#xst") and nb() == "B2", "Shift+săgeată extinde zona la 4 celule, celula activă rămâne B2")
        trage("B2", "C2")
        verifica_corect("sarcina „selectează B2:C2” acceptată")

        print("2. scrierea direct în celulă")
        la(2, 0)
        cel("A1").click(); pg.keyboard.type("Elev"); pg.keyboard.press("Tab")
        verifica(nb() == "B1", "Tab după scriere -> trece la dreapta (B1)")
        pg.keyboard.type("Nota"); pg.keyboard.press("Enter")
        verifica(nb() == "B2", "Enter după scriere -> coboară (B2)")
        verifica(cel("A1").inner_text().strip() == "Elev", "A1 arată „Elev”")
        verifica_corect("capul de tabel scris direct în celulă, acceptat")
        la(2, 1)
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
        la(2, 3)
        cel("C3").click(); pg.keyboard.press("Delete")
        verifica(cel("C3").inner_text().strip() == "", "Delete golește celula")
        verifica_corect("golirea cu Delete acceptată")
        la(2, 2)
        cel("B3").click(); pg.keyboard.press("F2"); pg.keyboard.press("End"); pg.keyboard.press("Backspace"); pg.keyboard.type("8"); pg.keyboard.press("Escape")
        verifica(cel("B3").inner_text().strip() == "3", "F2 + modificare + Esc -> renunță, rămâne 3 (ca în Excel)")
        pg.keyboard.type("8"); pg.keyboard.press("Enter")
        verifica_corect("scris peste valoarea greșită (8), acceptat")

        print("3. formula cu adrese puse cu mouse-ul")
        la(4, 0)
        cel("D2").click(); pg.keyboard.type("=")
        cel("B2").click(); pg.keyboard.type("+"); cel("C2").click()
        verifica(fx() == "=B2+C2", "= apoi clic pe B2, +, clic pe C2 -> bara fx arată =B2+C2 (%s)" % fx())
        pg.keyboard.press("Enter")
        verifica(cel("D2").inner_text().strip() == "17", "Enter -> D2 arată rezultatul 17")
        cel("D2").click()
        verifica(fx() == "=B2+C2", "D2 aleasă -> bara fx arată formula, nu rezultatul")
        verifica_corect("prima formulă cu clic pe celule acceptată")
        la(4, 2)
        cel("D3").click(); pg.keyboard.type("="); pg.keyboard.press("ArrowLeft")
        verifica(fx() == "=C3", "= apoi săgeată stânga -> indică C3 (modul de indicare din Excel): %s" % fx())
        pg.keyboard.type("-"); pg.keyboard.press("ArrowLeft"); pg.keyboard.press("ArrowLeft")
        verifica(fx() == "=C3-B3", "- apoi două săgeți stânga -> =C3-B3 (%s)" % fx())
        pg.keyboard.press("Enter")
        verifica_corect("formula făcută doar din tastatură (săgeți) acceptată")

        print("4. tras de colț (fill handle)")
        la(5, 0)
        cel("D2").click(); pg.keyboard.type("=B2*C2"); pg.keyboard.press("Enter")
        cel("D2").click(); trage_colt("D5")
        verifica(cel("D5").inner_text().strip() == "4", "tras de colț până la D5 -> D5 = 1*4 = 4")
        cel("D5").click()
        verifica(fx() == "=B5*C5", "D5 are formula mutată =B5*C5, ca la AutoFill în Excel (%s)" % fx())
        cel("D2").click()
        verifica_corect("coloana calculată prin tragere, acceptată")

        print("5. funcție cu zona trasă cu mouse-ul")
        la(6, 0)
        cel("B7").click(); pg.keyboard.type("=SUM("); trage("B2", "B6")
        verifica(fx() == "=SUM(B2:B6", "=SUM( apoi tras B2..B6 -> =SUM(B2:B6 (%s)" % fx())
        pg.keyboard.type(")"); pg.keyboard.press("Enter")
        verifica(cel("B7").inner_text().strip() == "36", "B7 = 36")
        verifica_corect("SUM cu zona trasă acceptat")

        print("6. F4 și adresa fixă")
        la(11, 0)
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
        la(7, 0)
        cel("D2").click(); pg.keyboard.type('=IF(B2>=5,"admis","respins")'); pg.keyboard.press("Enter")
        dlg = pg.locator(".xl .dlg").count() and pg.inner_text(".xl .dlg")
        verifica(bool(dlg) and "problem" in dlg, "setări RO + virgulă -> fereastra „There's a problem with this formula”")
        pg.fill("#xfx", '=IF(B2>=5;"admis";"respins")'); pg.keyboard.press("Enter")
        verifica(cel("D2").inner_text().strip() == "admis", "cu ; -> D2 = admis")
        cel("D2").click(); trage_colt("D6")
        verifica(cel("D3").inner_text().strip() == "admis" and cel("D5").inner_text().strip() == "admis" and cel("D6").inner_text().strip() == "admis", "tras până la D6 -> verdictele coloanei")
        verifica_corect("IF pe setări RO, tras în jos, acceptat")

        print("8. lista de funcții, Tab și bula")
        la(1, 1)
        cel("B7").click(); pg.keyboard.type("=SU")
        verifica(pg.locator(".xl .lista").count() > 0 and "SUM" in pg.inner_text(".xl .lista"), "=SU -> apare lista de funcții cu SUM")
        pg.keyboard.press("Tab")
        verifica(fx() == "=SUM(", "Tab completează: =SUM( (%s)" % fx())
        b = pg.inner_text(".xl .bula") if pg.locator(".xl .bula").count() else ""
        verifica("SUM(number1; [number2]; …)" in b, "bula pe setări RO: SUM(number1; [number2]; …) (%s)" % b[:60])
        trage("B2", "B6"); pg.keyboard.press("Enter")
        cel("B7").click()
        verifica(fx() == "=SUM(B2:B6)" and cel("B7").inner_text().strip() == "36", "Enter fără ) -> Excel închide paranteza: =SUM(B2:B6) = 36 (%s)" % fx())
        verifica_corect("SUM prin completare cu Tab acceptat")
        la(1, 2)
        cel("C7").click(); pg.keyboard.type("=IF(")
        b = pg.inner_text(".xl .bula") if pg.locator(".xl .bula").count() else ""
        verifica("IF(logical_test, [value_if_true], [value_if_false])" in b, "bula pe setări EN: părțile despărțite cu virgulă (%s)" % b[:70])
        pg.keyboard.type("C2>5,")
        verifica("<b>[value_if_true]</b>" in pg.inner_html(".xl .bula"), "după virgulă, bula îngroașă partea a doua")
        pg.keyboard.press("Escape")

        print("9. litere mari, F2, săgețile în text")
        la(4, 0)
        cel("D2").click(); pg.keyboard.type("=sum(b2:c2"); pg.keyboard.press("Enter")
        cel("D2").click()
        verifica(fx() == "=SUM(B2:C2)", "=sum(b2:c2 -> Excel scrie =SUM(B2:C2) (%s)" % fx())
        cel("E2").click(); pg.keyboard.type("=B2+C2")
        verifica("Introducere" in pg.inner_text("#xst") or "Indicare" in pg.inner_text("#xst"), "cât scrii, bara de jos arată modul Introducere/Indicare")
        pg.keyboard.press("F2")
        verifica("Editare" in pg.inner_text("#xst"), "F2 trece în modul Editare (Edit)")
        pg.keyboard.press("ArrowLeft"); pg.keyboard.type("3")
        verifica(fx() == "=B2+C32", "în Editare săgeata merge prin text: =B2+C32 (%s)" % fx())
        pg.keyboard.press("Escape")

        print("10. scurtăturile")
        la(5, 2)
        trage("D2", "D5"); pg.keyboard.press("Control+d")
        cel("D5").click()
        verifica(fx() == "=B5*C5", "Ctrl+D copiază formula în jos: D5 = =B5*C5 (%s)" % fx())
        trage("D2", "D5"); pg.keyboard.press("Control+d")
        verifica_corect("sarcina cu Ctrl+D acceptată")
        la(5, 2)
        cel("D2").click(); pg.keyboard.press("Control+c"); cel("E3").click(); pg.keyboard.press("Control+v")
        verifica(fx() == "=C3*D3", "Ctrl+C din D2, Ctrl+V în E3 -> adresele se mută: =C3*D3 (%s)" % fx())
        pg.keyboard.press("Control+z")
        verifica(cel("E3").inner_text().strip() == "", "Ctrl+Z anulează lipirea")
        pg.keyboard.press("Control+y")
        verifica(cel("E3").inner_text().strip() != "", "Ctrl+Y o reface")
        trage("E2", "E4"); pg.keyboard.type("ok"); pg.keyboard.press("Control+Enter")
        verifica(all(cel(a).inner_text().strip() == "ok" for a in ("E2", "E3", "E4")), "Ctrl+Enter scrie același lucru în toată zona")
        cel("A1").click(); pg.keyboard.press("Control+ArrowDown")
        verifica(nb() == "A5", "Ctrl+săgeată jos sare la capătul datelor: A5 (%s)" % nb())
        pg.click('[data-copiaza]'); pg.wait_for_selector(".xl .info", timeout=5000)
        cb = pg.evaluate("navigator.clipboard.readText()")
        verifica("Produs\tPreț" in cb and "=B2*C2" in cb, "„Copiază tabelul” pune foaia în clipboard, cu formule (%r)" % cb[:40])

        print("11. încearcă singur (foaie vie în întrebare)")
        la(0, 3)
        trage("B2", "C4")
        verifica(nb() == "B2", "în foaia vie: după selectare caseta arată B2")
        pg.click('.opt:has-text("B2"):not(:has-text(":"))')
        verifica(pg.locator("#fb .fb.ok").count() > 0, "răspunsul dat după încercare e acceptat")

        print("12. panglica: formatarea")
        la(3, 0)
        trage("A1", "C1"); pg.click('[data-rb="b"]'); pg.click('[data-mn="fill"]'); pg.locator('[data-fill]').first.click()
        st = cel("A1").get_attribute("style") or ""
        verifica("font-weight:700" in st.replace(" ", "") and "background" in st, "A1: aldin + umplere (%s)" % st)
        verifica_corect("capul de tabel formatat, acceptat")
        la(3, 1)
        trage("A1", "C6"); pg.click('[data-mn="bd"]'); pg.click('[data-bd="all"]')
        verifica_corect("toate bordurile pe A1:C6, acceptat")
        la(3, 3)
        trage("C2", "C4"); pg.select_option('[data-nf]', "percent")
        verifica(cel("C2").inner_text().strip() == "19%", "formatul Procent: 0,19 apare 19%% (%s)" % cel("C2").inner_text())
        cel("C2").click()
        verifica(fx() in ("0,19", "0.19"), "valoarea rămâne 0,19 în bara fx (%s)" % fx())
        trage("C2", "C4")
        verifica_corect("procentele acceptate")
        la(3, 4)
        trage("A1", "C1"); pg.click('[data-rb="merge"]')
        verifica(cel("A1").get_attribute("colspan") == "3", "Îmbină și centrează: A1 ocupă 3 coloane")
        cel("B3").click(); pg.keyboard.press("Control+b")
        verifica("font-weight:700" in (cel("B3").get_attribute("style") or "").replace(" ", ""), "Ctrl+B pune aldin")
        verifica_corect("titlul îmbinat, acceptat")

        print("13. panglica: AutoSum")
        la(6, 0)
        cel("B7").click(); pg.click('[data-rb="sum"]')
        verifica(fx() == "=SUM(B2:B6)", "Σ AutoSum sub coloană propune =SUM(B2:B6) (%s)" % fx())
        pg.keyboard.press("Enter")
        verifica(cel("B7").inner_text().strip() == "36", "Enter -> 36")

        print("14. panglica: sortarea")
        la(8, 0)
        cel("C3").click(); pg.click('[data-tab="data"]'); pg.click('[data-so="desc"]')
        verifica(cel("A2").inner_text().strip() == "Ana" and cel("C6").inner_text().strip() in ("6,75", "6.75"), "Z→A pe Media: Ana sus, 6,75 jos; rândurile întregi")
        verifica(cel("A1").inner_text().strip() == "Elev", "antetul a rămas sus")
        verifica_corect("sortarea descrescătoare acceptată")
        la(8, 3)
        trage("C2", "C6"); pg.click('[data-tab="data"]'); pg.click('[data-so="desc"]')
        verifica(pg.locator('[data-av]').count() == 3, "selecție doar pe o coloană -> apare avertismentul de sortare (Sort Warning)")
        pg.click('[data-av="curenta"]')
        verifica(cel("A2").inner_text().strip() == "Dan" and cel("C2").inner_text().strip() in ("9,25", "9.25"), "„Continuă cu selecția curentă” amestecă: Dan primește 9,25")
        pg.click('.opt:has-text("amestecat")')
        verifica(pg.locator("#fb .fb.ok").count() > 0, "răspunsul după încercare, acceptat")
        la(8, 2)
        cel("B2").click(); pg.click('[data-tab="data"]'); pg.click('[data-so="dlg"]')
        pg.click('[data-sd="adauga"]'); pg.select_option('[data-sd="col"][data-i="1"]', "2"); pg.select_option('[data-sd="ord"][data-i="1"]', "desc"); pg.click('[data-sd="ok"]')
        ordine = [cel("A%d" % r).inner_text().strip() for r in range(2, 7)]
        verifica(ordine == ["Carmen", "Elena", "Dan", "Ana", "Bogdan"], "Custom Sort: Clasa A→Z, apoi Media Z→A (%s)" % ordine)
        verifica_corect("sortarea pe două niveluri acceptată")

        print("15. panglica: graficele")
        la(9, 0)
        trage("A1", "B6"); pg.click('[data-tab="insert"]'); pg.click('[data-gr="column"]')
        verifica(pg.locator(".xl .graf svg rect").count() >= 5, "grafic cu coloane desenat (5 coloane)")
        verifica_corect("graficul cu coloane acceptat")
        la(9, 1)
        trage("A1", "B7"); pg.click('[data-tab="insert"]'); pg.click('[data-gr="line"]')
        pg.fill('[data-gt]', "Temperatura pe zile")
        verifica(pg.locator(".xl .graf polyline").count() == 1, "grafic linie desenat")
        verifica_corect("graficul linie cu titlu acceptat")

        verifica(not erori, "fără erori JavaScript %s" % erori[:3])
        br.close()
    print("Rezultat: " + ("TOATE OK" if not probleme else "; ".join(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
