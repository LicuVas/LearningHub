#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PROBA PASULUI 5 — identitatea completa (clasa + profil) si „continua de unde ai ramas".

  A. elev NOU de liceu: alege clasa a 9-a -> apare intrebarea despre profil
  B. cu profilul ales, ajunge DIRECT la clasa lui (content/liceu/artistic/cls9),
     nu la selectorul de profiluri
  C. la gimnaziu NU se intreaba de profil (nu exista)
  D. PROFIL VECHI (grade cls12, fara campul track, scris direct in localStorage
     ca si cum ar fi de anul trecut) merge exact ca inainte - NU e trimis in
     hub-ul de gimnaziu. Asta e atacul care a ucis varianta cu id-uri schimbate.
  E. dupa ce elevul lucreaza intr-o lectie, ecranul de intrare ii scrie
     „Ultima data ai lucrat la <lectie>", iar butonul il duce fix acolo
  F. zero erori JavaScript

Rulare: python C:/00/Projects/LearningHub/_campaign/ux_2026_09_11/proba_pas5.py
"""
import functools
import http.server
import json
import os
import socketserver
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SHOTS = os.path.dirname(os.path.abspath(__file__))
PORT = 8755
LECTIE = "/content/liceu/artistic/cls9/m1-societate-digitala/lectia1-forme-comunicare.html"

esecuri = []


def pica(m):
    esecuri.append(m)
    print("  PICA: " + m)


def server():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(("127.0.0.1", PORT), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd


def main():
    httpd = server()
    base = f"http://127.0.0.1:{PORT}"
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)

            # ============================================== A + B + E
            ctx = browser.new_context(viewport={"width": 1200, "height": 950})
            erori = []
            page = ctx.new_page()
            page.on("pageerror", lambda e: erori.append(str(e)))
            page.goto(base + "/index.html", wait_until="domcontentloaded")
            page.wait_for_timeout(1300)

            page.fill("#us-name-input", "IoanaTest")
            page.select_option("#us-grade-select", "cls9")
            page.wait_for_timeout(400)
            track = page.locator("#us-track-select")
            if track.count() == 0 or not track.is_visible():
                pica("A. dupa ce alege clasa a 9-a, NU apare intrebarea despre profil")
            else:
                print("  A. clasa a 9-a -> apare selectorul de profil. OK")
                page.screenshot(path=os.path.join(SHOTS, "proba_pas5_selector.png"))
                page.select_option("#us-track-select", "artistic")
            page.click("#us-create-btn")
            page.wait_for_timeout(2200)
            url = page.url.replace(base, "")
            if url != "/content/liceu/artistic/cls9/index.html":
                pica(f"B. a ajuns la '{url}' in loc de '/content/liceu/artistic/cls9/index.html'")
            else:
                print(f"  B. dintr-un clic dupa ce si-a spus cine e -> {url}. OK")

            # lucreaza intr-o lectie ca sa avem ce relua
            page.goto(base + LECTIE, wait_until="domcontentloaded")
            page.wait_for_timeout(1200)
            q = page.locator(".atom:not(.ux-step-hidden) .atom-question")
            for i in range(q.count()):
                try:
                    q.nth(i).locator(".atom-option").first.click()
                    page.wait_for_timeout(300)
                except Exception:
                    pass
            page.wait_for_timeout(900)

            page.goto(base + "/index.html", wait_until="domcontentloaded")
            page.wait_for_timeout(1300)
            linie = page.locator("#identity-resume")
            if linie.count() == 0 or not linie.is_visible():
                pica("E. ecranul de intrare nu arata 'Ultima data ai lucrat la...'")
            else:
                t = linie.inner_text().strip()
                print(f"  E. ecranul de intrare: '{t[:80]}'")
                page.screenshot(path=os.path.join(SHOTS, "proba_pas5_continua.png"))
                page.click("#identity-yes")
                page.wait_for_timeout(1800)
                u2 = page.url.replace(base, "")
                if "lectia1-forme-comunicare" not in u2:
                    pica(f"E. butonul l-a dus la '{u2}', nu la lectia la care ramasese")
                else:
                    print(f"  E. butonul il duce fix la lectia lui: {u2}. OK")
            ctx.close()

            # ============================================== C
            ctx = browser.new_context()
            page = ctx.new_page()
            page.goto(base + "/index.html", wait_until="domcontentloaded")
            page.wait_for_timeout(1300)
            page.select_option("#us-grade-select", "cls6")
            page.wait_for_timeout(400)
            if page.locator("#us-track-select").is_visible():
                pica("C. la gimnaziu se intreaba de profil, desi nu exista profiluri")
            else:
                print("  C. la gimnaziu nu se intreaba de profil. OK")
            ctx.close()

            # ============================================== D (atacul)
            ctx = browser.new_context()
            erori_d = []
            page = ctx.new_page()
            page.on("pageerror", lambda e: erori_d.append(str(e)))
            vechi = [{"id": "vechitest", "name": "VechiTest", "avatar": "🦊",
                      "grade": "cls12", "created": "2025-10-01T10:00:00.000Z"}]
            page.goto(base + "/index.html", wait_until="domcontentloaded")
            page.evaluate(
                "(p) => { localStorage.setItem('learninghub_profiles', JSON.stringify(p));"
                " localStorage.setItem('learninghub_active_profile', 'vechitest'); }", vechi)
            page.goto(base + "/index.html", wait_until="domcontentloaded")
            page.wait_for_timeout(1300)
            if not page.locator("[data-ux-identity-confirm]").is_visible():
                pica("D. profilul vechi nu primeste intrebarea 'tu esti?'")
            else:
                nume = page.locator("#identity-who").inner_text().strip()
                clasa = page.locator("#identity-grade").inner_text().strip()
                print(f"  D. profil VECHI recunoscut: '{nume}' / '{clasa}'")
                page.click("#identity-yes")
                page.wait_for_timeout(2000)
                u = page.url.replace(base, "")
                if "/hub/" in u or "/content/tic/" in u:
                    pica(f"D. profilul vechi de clasa a 12-a a ajuns la '{u}' "
                         f"(hub de gimnaziu) - exact defectul pe care-l evitam")
                elif u != "/content/liceu/index.html":
                    pica(f"D. profilul vechi a ajuns la '{u}', asteptat '/content/liceu/index.html'")
                else:
                    print(f"  D. profilul vechi merge ca inainte -> {u}. OK")
            if erori_d:
                pica(f"F. erori JavaScript pe profilul vechi: {erori_d[:2]}")
            ctx.close()

            if erori:
                pica(f"F. erori JavaScript: {erori[:2]}")
            else:
                print("  F. zero erori JavaScript. OK")

            browser.close()
    finally:
        httpd.shutdown()

    print("\n" + "=" * 60)
    if esecuri:
        print(f"PASUL 5: PICA — {len(esecuri)} probleme")
        for e in esecuri:
            print("  - " + e)
        return 1
    print("PASUL 5: TRECE — elevul ajunge la clasa LUI dintr-un clic, "
          "iar profilurile vechi nu s-au rupt.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
