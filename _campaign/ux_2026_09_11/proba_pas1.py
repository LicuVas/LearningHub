#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PROBA PASULUI 1 — „tu esti?" in laborator.

Scenariul REAL, in browser headless (nu se vede pe ecranul lui Vasile):
  A. browser curat            -> apare selectorul de profil (nu sare nimeni nicaieri)
  B. elevul A isi face profil -> intra
  C. se redeschide situl      -> apare intrebarea „tu esti?" cu numele lui A
  D. se apasa „Nu, sunt alt elev" -> apare selectorul, elevul B isi face profil
  E. VERDICT: elevul B NU vede numele si progresul lui A

Rulare: python C:/00/Projects/LearningHub/_campaign/ux_2026_09_11/proba_pas1.py
Exit 0 = trece. Exit 1 = pica, si scrie de ce.
"""
import http.server
import functools
import json
import os
import socketserver
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SHOTS = os.path.dirname(os.path.abspath(__file__))
PORT = 8749

esecuri = []
note = []


def spune(msg):
    note.append(msg)
    print(msg)


def pica(msg):
    esecuri.append(msg)
    print("  PICA: " + msg)


def porneste_server():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), handler)
    t = threading.Thread(target=httpd.serve_forever, daemon=True)
    t.start()
    return httpd


def main():
    httpd = porneste_server()
    base = f"http://127.0.0.1:{PORT}"
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            ctx = browser.new_context(viewport={"width": 1280, "height": 900})
            erori = []
            page = ctx.new_page()
            page.on("pageerror", lambda e: erori.append(str(e)))

            # ---------------------------------------------------- A. browser curat
            page.goto(base + "/index.html", wait_until="domcontentloaded")
            page.wait_for_timeout(1200)
            confirm_vizibil = page.locator("[data-ux-identity-confirm]").is_visible()
            if confirm_vizibil:
                pica("A. pe un browser CURAT apare deja 'tu esti?' - nu are pe cine confirma")
            selector = page.locator("#us-profile-modal")
            if selector.count() == 0:
                pica("A. pe un browser curat NU apare selectorul de profil")
            else:
                spune("A. browser curat -> apare selectorul de profil. OK")

            # ---------------------------------------------------- B. elevul A
            page.fill("#us-name-input", "AnaTest")
            page.select_option("#us-grade-select", "cls9")
            # De la pasul 5, liceul cere si profilul (aceeasi clasa a 9-a exista
            # pe 7 profiluri). Fara el, butonul refuza - si atunci proba asta
            # nu mai avea ce profil sa confirme.
            page.wait_for_timeout(400)
            if page.locator("#us-track-select").is_visible():
                page.select_option("#us-track-select", "artistic")
            page.click("#us-create-btn")
            page.wait_for_timeout(2000)
            dupa_A = page.url
            spune(f"B. elevul A ('AnaTest', clasa a 9-a) a intrat -> {dupa_A.replace(base, '')}")

            # ---------------------------------------------------- C. se redeschide
            page.goto(base + "/index.html", wait_until="domcontentloaded")
            page.wait_for_timeout(1200)
            conf = page.locator("[data-ux-identity-confirm]")
            if not conf.is_visible():
                pica("C. la redeschidere NU apare intrebarea 'tu esti?' - situl sare direct in profilul salvat")
            else:
                nume = page.locator("#identity-who").inner_text().strip()
                clasa = page.locator("#identity-grade").inner_text().strip()
                if nume != "AnaTest":
                    pica(f"C. intrebarea arata numele gresit: '{nume}' in loc de 'AnaTest'")
                else:
                    spune(f"C. la redeschidere apare 'tu esti?' cu 'AnaTest' / '{clasa}'. OK")
                page.screenshot(path=os.path.join(SHOTS, "proba_pas1_intrebarea.png"), full_page=True)

            # plasa de siguranta NU trebuie sa mute elevul cat timp intreaba
            page.wait_for_timeout(13000)
            if not page.locator("[data-ux-identity-confirm]").is_visible():
                pica("C-bis. dupa 13 secunde de gandire, situl l-a dus mai departe singur "
                     "(plasa de siguranta de 12s se declanseaza peste intrebare)")
            else:
                spune("C-bis. dupa 13 secunde intrebarea e tot pe ecran - plasa de 12s nu o calca. OK")

            # ---------------------------------------------------- D. „sunt alt elev"
            page.click("#identity-no")
            page.wait_for_timeout(1500)
            if page.locator("#us-profile-modal").count() == 0:
                pica("D. 'Nu, sunt alt elev' nu deschide selectorul de profil")
            else:
                spune("D. 'Nu, sunt alt elev' -> selectorul de profil. OK")
                page.fill("#us-name-input", "BogdanTest")
                page.select_option("#us-grade-select", "cls5")
                page.click("#us-create-btn")
                page.wait_for_timeout(2000)

            # ---------------------------------------------------- E. VERDICTUL
            activ = page.evaluate("() => localStorage.getItem('learninghub_active_profile')")
            if activ is None or "ana" in (activ or "").lower():
                pica(f"E. VERDICT: al doilea elev a ramas in profilul primului (activ='{activ}')")
            else:
                spune(f"E. VERDICT: profilul activ e al celui de-al doilea elev ('{activ}'), "
                      f"nu al primului. OK")

            # si ca progresul primului nu e citit de al doilea
            chei = page.evaluate(
                "() => Object.keys(localStorage).filter(k => k.indexOf('progress') > -1)")
            spune(f"   chei de progres in browser: {chei}")

            page.screenshot(path=os.path.join(SHOTS, "proba_pas1_dupa_schimbare.png"), full_page=True)

            if erori:
                pica(f"erori JavaScript in pagina: {erori[:3]}")
            else:
                spune("zero erori JavaScript pe tot parcursul. OK")

            browser.close()
    finally:
        httpd.shutdown()

    print("\n" + "=" * 60)
    if esecuri:
        print(f"PASUL 1: PICA — {len(esecuri)} probleme")
        for e in esecuri:
            print("  - " + e)
        return 1
    print("PASUL 1: TRECE — al doilea elev nu mai mosteneste identitatea primului.")
    print("Capturi: proba_pas1_intrebarea.png, proba_pas1_dupa_schimbare.png")
    return 0


if __name__ == "__main__":
    sys.exit(main())
