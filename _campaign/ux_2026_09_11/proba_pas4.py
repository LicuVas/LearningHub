#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PROBA PASULUI 4 — „ce invatam acum" nu mai poate imbatrani.

Se verifica in browser headless, cu ceasul MUTAT, ca pagina isi schimba singura
raspunsul. Asta e diferenta intre un text scris de mana si unul generat.

  A. azi (12 sept 2026)  -> hub scrie „MODULUL 1", 7 sept - 23 oct 2026
  B. 15 noiembrie 2026   -> hub scrie singur „MODULUL 2"
  C. 28 octombrie 2026   -> hub scrie „VACANTA"
  D. hub listeaza toate cele 34 de clase, nu 4
  E. pagina clasei a 5-a marcheaza Modulul 1 ca ACTIV ACUM (azi), nu Modulul 3
  F. zero erori JavaScript

Rulare: python C:/00/Projects/LearningHub/_campaign/ux_2026_09_11/proba_pas4.py
"""
import functools
import http.server
import os
import socketserver
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SHOTS = os.path.dirname(os.path.abspath(__file__))
PORT = 8751

esecuri = []


def spune(m):
    print(m)


def pica(m):
    esecuri.append(m)
    print("  PICA: " + m)


def server():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def cu_ceasul(ctx, iso):
    """Muta ceasul paginii inainte sa ruleze scripturile ei."""
    ctx.add_init_script(
        "(() => { const F = Date;"
        " const fix = new F('%s').getTime();"
        " class D extends F {"
        "   constructor(...a){ if(a.length===0){ super(fix); } else { super(...a); } }"
        "   static now(){ return fix; } }"
        " window.Date = D; })();" % iso)


def main():
    httpd = server()
    base = f"http://127.0.0.1:{PORT}"
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)

            def hub_la(iso):
                ctx = browser.new_context(viewport={"width": 1280, "height": 1000})
                cu_ceasul(ctx, iso)
                erori = []
                page = ctx.new_page()
                page.on("pageerror", lambda e: erori.append(str(e)))
                page.goto(base + "/hub/index.html", wait_until="domcontentloaded")
                page.wait_for_timeout(900)
                badge = page.locator("#now-badge").inner_text().strip()
                dates = page.locator("#now-dates").inner_text().strip()
                carduri = page.locator("#now-classes .grade-topic").count()
                return page, ctx, badge, dates, carduri, erori

            # ---------------------------------------------------------- A
            page, ctx, badge, dates, carduri, erori = hub_la("2026-09-12T10:00:00")
            if badge != "MODULUL 1":
                pica(f"A. azi hub scrie '{badge}' in loc de 'MODULUL 1'")
            else:
                spune(f"A. azi (12 sept 2026) -> '{badge}' / '{dates}'. OK")
            if carduri < 30:
                pica(f"D. hub listeaza doar {carduri} clase (asteptat 34)")
            else:
                spune(f"D. hub listeaza {carduri} clase (inainte: 4). OK")
            page.screenshot(path=os.path.join(SHOTS, "proba_pas4_hub_azi.png"), full_page=True)
            if erori:
                pica(f"F. erori JavaScript pe hub: {erori[:2]}")
            else:
                spune("F. zero erori JavaScript pe hub. OK")
            ctx.close()

            # ---------------------------------------------------------- B
            page, ctx, badge, dates, _, _ = hub_la("2026-11-15T10:00:00")
            if badge != "MODULUL 2":
                pica(f"B. pe 15 noiembrie hub scrie '{badge}' in loc de 'MODULUL 2'")
            else:
                spune(f"B. 15 noiembrie 2026 -> '{badge}' / '{dates}'. OK")
            ctx.close()

            # ---------------------------------------------------------- C
            page, ctx, badge, dates, _, _ = hub_la("2026-10-28T10:00:00")
            if badge != "VACANTA":
                pica(f"C. in vacanta de toamna hub scrie '{badge}' in loc de 'VACANTA'")
            else:
                spune(f"C. 28 octombrie 2026 -> '{badge}' / '{dates}'. OK")
            ctx.close()

            # ---------------------------------------------------------- E
            ctx = browser.new_context(viewport={"width": 1280, "height": 1000})
            cu_ceasul(ctx, "2026-09-12T10:00:00")
            erori = []
            page = ctx.new_page()
            page.on("pageerror", lambda e: erori.append(str(e)))
            page.goto(base + "/content/tic/cls5/index.html", wait_until="domcontentloaded")
            page.wait_for_timeout(900)
            banner = page.locator("#active-module-banner")
            txt = banner.inner_text().strip() if banner.count() else "(lipseste)"
            activ = page.locator(".domain-label.module-is-active")
            activ_txt = activ.first.inner_text().strip() if activ.count() else "(niciunul)"
            if "Modulul 1" not in txt and "M1" not in activ_txt:
                pica(f"E. pagina clasei a 5-a nu marcheaza Modulul 1: banner='{txt}', activ='{activ_txt}'")
            else:
                spune(f"E. clasa a 5-a: banner='{txt}'")
                spune(f"   modul marcat activ: '{activ_txt[:70]}'. OK")
            if "vara" in txt.lower() or "2025" in txt:
                pica(f"E-bis. bannerul inca vorbeste despre anul trecut: '{txt}'")
            if erori:
                pica(f"F. erori JavaScript pe pagina clasei: {erori[:2]}")
            else:
                spune("F. zero erori JavaScript pe pagina clasei. OK")
            page.screenshot(path=os.path.join(SHOTS, "proba_pas4_clasa5.png"), full_page=True)
            ctx.close()

            browser.close()
    finally:
        httpd.shutdown()

    print("\n" + "=" * 60)
    if esecuri:
        print(f"PASUL 4: PICA — {len(esecuri)} probleme")
        for e in esecuri:
            print("  - " + e)
        return 1
    print("PASUL 4: TRECE — muti ceasul, si situl isi schimba singur raspunsul.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
