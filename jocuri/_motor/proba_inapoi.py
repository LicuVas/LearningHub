"""Proba pentru „Pasul anterior” (motor.js) și Anulare/Refacere (tip-excel.js), cu clicuri reale în browser.

    python jocuri/_motor/proba_inapoi.py [slug]                      # fișierele locale
    python jocuri/_motor/proba_inapoi.py [slug] --baza https://proba.learninghub-8z6.pages.dev   # site-ul LIVE

Ultima linie = numărul de probleme (0 = totul merge).
"""
import argparse
import re
from pathlib import Path

from playwright.sync_api import sync_playwright

JOCURI = Path(__file__).resolve().parent.parent
ap = argparse.ArgumentParser()
ap.add_argument("slug", nargs="?", default="excel-pas-cu-pas-viii")
ap.add_argument("--baza", help="adresa site-ului (fără ea: fișierele locale)")
args = ap.parse_args()
slug = args.slug
URL = f"{args.baza.rstrip('/')}/jocuri/{slug}/" if args.baza else (JOCURI / slug / "index.html").as_uri()
probleme = []


def xp(pg):
    m = re.search(r"(\d+) XP", pg.locator("#hud").inner_text() if pg.locator("#hud").count() else "")
    return int(m.group(1)) if m else None


def hud(pg):
    return pg.evaluate("(document.getElementById('hud')||{}).innerText||''")


def raspunde(pg):
    pg.evaluate("JocMotor.test.rezolva()")
    if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
        pg.click("#chk")
    return pg.locator("#fb .fb.ok").count() > 0


def verifica(cond, text):
    print(("OK   " if cond else "PROB ") + text)
    if not cond:
        probleme.append(text)


with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    erori = []
    pg.on("pageerror", lambda e: erori.append(str(e)))
    print(f"pagina: {URL}")
    pg.goto(URL, timeout=30000)
    pg.wait_for_timeout(300)
    pg.evaluate("JocMotor.test.deblocheaza()")
    pg.evaluate("document.getElementById('go-home').click()")
    cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
    li = next(i for i, lv in enumerate(cfg["nivele"]) if len(lv.get("qs", [])) >= 3)
    pg.click(f'.lvl[data-l="{li}"]')
    pg.click("#go")

    # 1. Î1 corect, apoi Î2
    verifica(raspunde(pg), "Î1 rezolvată")
    xp1 = xp(pg)
    pg.click("#next")
    verifica("Întrebarea 2" in hud(pg), f"am ajuns la Î2 ({hud(pg)!r})")

    # 2. „← Pasul anterior” -> Î1, refăcută fără XP în plus
    pg.click("#inapoi")
    verifica("Întrebarea 1" in hud(pg), "butonul Pasul anterior duce la Î1")
    verifica(pg.get_by_text("Refaci un pas deja rezolvat").count() > 0, "Î1 spune că e pas refăcut")
    verifica(raspunde(pg), "Î1 refăcută e acceptată")
    verifica("deja" in pg.locator("#fb").inner_text(), "mesajul spune că punctele le-a primit deja")
    verifica(xp(pg) == xp1, f"XP nu crește la pas refăcut ({xp1} -> {xp(pg)})")

    # 3. bara de jos: Î2 e buton (vizitată), Î3 nu (nevizitată); Citire e buton
    verifica(pg.locator('.tabs button[data-pas="1"]').count() == 1, "Î2 din bară se poate apăsa")
    verifica(pg.locator('.tabs button[data-pas="2"]').count() == 0, "Î3 (nevizitată) NU se poate apăsa")
    pg.click('.tabs button[data-pas="citire"]')
    verifica(pg.locator("#go").count() == 1, "Citire din bară deschide pagina de citit")
    pg.click("#go")
    verifica("Întrebarea 1" in hud(pg), "din pagina de citit revin unde eram (Î1)")
    pg.click('.tabs button[data-pas="1"]')
    verifica("Întrebarea 2" in hud(pg), "Î2 din bară duce la Î2")

    # 4. anti-truc: greșesc la Î2, plec înapoi și revin -> nu mai primesc 10 XP de „prima încercare”
    are_gresit = pg.evaluate("JocMotor.test.gresit()")
    if are_gresit:
        if pg.locator("#chk").count():
            pg.click("#chk")
        verifica(pg.locator("#fb .fb.bad").count() > 0, "Î2 greșită: „Nu încă”")
        pg.click("#inapoi")
        pg.click('.tabs button[data-pas="1"]')
        x0 = xp(pg)
        raspunde(pg)
        verifica(xp(pg) - x0 == 4, f"după greșeală + dus-întors, Î2 dă 4 XP, nu 10 (a dat {xp(pg) - x0})")
    else:
        print("-    Î2 nu are gresit(); anti-truc netestat pe acest nivel")

    # 5. Anulare / Refacere în foaie - pe o întrebare NErezolvată (după rezolvare foaia se blochează, corect)
    pg.click("#next")
    if pg.locator(".xl").count():
        und, red = pg.locator('[data-ud="undo"]'), pg.locator('[data-ud="redo"]')
        verifica(und.count() == 1 and red.count() == 1, "butoanele Anulare/Refacere există")
        verifica(und.is_disabled(), "Anulare e gri la început (nimic de anulat)")
        cel = pg.locator("td[data-a]").nth(0)
        adr = cel.get_attribute("data-a")
        tinta = pg.locator("td[data-a='H8']") if pg.locator("td[data-a='H8']").count() else pg.locator("td[data-a]").last
        adr = tinta.get_attribute("data-a")
        tinta.click()
        pg.keyboard.type("proba")
        pg.keyboard.press("Enter")
        val = lambda: pg.locator(f"td[data-a='{adr}']").inner_text().strip()
        verifica(val() == "proba", f"am scris în {adr}")
        verifica(not und.is_disabled(), "Anulare devine activă după scriere")
        und.click()
        verifica(val() == "", f"Anulare golește {adr} (are {val()!r})")
        verifica(not red.is_disabled(), "Refacere devine activă")
        red.click()
        verifica(val() == "proba", "Refacere readuce textul")
        # formatarea se anulează și ea
        pg.locator(f"td[data-a='{adr}']").click()
        bold = pg.locator('[data-rb="b"]')
        if bold.count():
            bold.click()
            st = lambda: pg.locator(f"td[data-a='{adr}']").get_attribute("style") or ""
            verifica("font-weight:700" in st(), "Aldin aplicat")
            pg.locator('[data-ud="undo"]').click()
            verifica("font-weight:700" not in st(), "Anulare scoate și Aldin (formatarea)")
            pg.locator(f"td[data-a='{adr}']").click()
            pg.keyboard.press("Control+y")
            verifica("font-weight:700" in st(), "Ctrl+Y reface Aldin")
            pg.keyboard.press("Control+z")
            verifica("font-weight:700" not in st(), "Ctrl+Z anulează Aldin")
    else:
        print("-    nicio foaie în primele întrebări; Anulare/Refacere netestate aici")

    verifica(not erori, f"fără erori JavaScript ({erori[:2]})")
    b.close()

print(len(probleme))
