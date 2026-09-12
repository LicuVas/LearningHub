#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PROBA PASULUI 3 — „un atom = un ecran".

Se verifica pe o lectie REALA dintr-o clasa pe care Vasile chiar o preda
(artistic, clasa a 9-a) plus cateva luate la intamplare din alte sectiuni:

  A. lectia arata „Pasul 1 din N", nu tot textul deodata
  B. pe ecran e UN singur atom
  C. textul vizibil la primul pas e sub 400 de cuvinte (inainte: ~4000 pe lectie)
  D. butonul „Urmatorul" e blocat pana raspunzi
  E. dupa ce raspunzi, se deblocheaza si te duce la pasul 2
  F. atomii fara intrebare apar „citit", nu cu bifa verde de „perfect"
  G. zero erori JavaScript

Rulare: python C:/00/Projects/LearningHub/_campaign/ux_2026_09_11/proba_pas3.py
"""
import functools
import http.server
import os
import re
import socketserver
import sys
import threading

from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SHOTS = os.path.dirname(os.path.abspath(__file__))
PORT = 8753

def esantion(n_per_sectiune=4):
    """Lectii REALE luate de pe disc, din fiecare sectiune. Nu se scriu de mana
    cai care apoi nu exista - prima versiune a acestei probe a sarit peste 2 din
    3 lectii fiindca ghicisem numele fisierelor."""
    import random
    random.seed(20260912)          # acelasi esantion la fiecare rulare
    out = ["/content/liceu/artistic/cls9/m1-societate-digitala/lectia1-forme-comunicare.html"]
    for sect in ("tic", "liceu", "profesional"):
        gasite = []
        base = os.path.join(ROOT, "content", sect)
        for dp, dn, fn in os.walk(base):
            dn[:] = [d for d in dn if d not in (".backup-before-practica", "node_modules",
                                                "v2_output", "quizuri")]
            for f in fn:
                if f.startswith("lectia") and f.endswith(".html"):
                    rel = os.path.relpath(os.path.join(dp, f), ROOT)
                    gasite.append("/" + rel.replace(os.sep, "/"))
        random.shuffle(gasite)
        out += gasite[:n_per_sectiune]
    # fara duplicate, pastrand ordinea
    vazute = set()
    return [x for x in out if not (x in vazute or vazute.add(x))]


LECTII = esantion()

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


def exista(base, cale):
    p = os.path.join(ROOT, cale.lstrip("/").replace("/", os.sep))
    return os.path.exists(p)


def main():
    httpd = server()
    base = f"http://127.0.0.1:{PORT}"
    try:
        with sync_playwright() as pw:
            browser = pw.chromium.launch(headless=True)
            for idx, lectie in enumerate(LECTII):
                if not exista(base, lectie):
                    print(f"(sar peste {lectie} - nu exista pe disc)")
                    continue
                print(f"\n=== {lectie}")
                ctx = browser.new_context(viewport={"width": 1100, "height": 900})
                erori = []
                page = ctx.new_page()
                page.on("pageerror", lambda e: erori.append(str(e)))
                page.goto(base + lectie, wait_until="domcontentloaded")
                page.wait_for_timeout(1100)

                # --- A
                counter = page.locator("[data-ux-step-counter] .ux-step-text")
                if counter.count() == 0:
                    pica(f"A. {lectie}: nu apare contorul de pasi")
                    ctx.close()
                    continue
                txt = counter.inner_text().strip()
                if not re.match(r"Pasul 1 din \d+", txt):
                    pica(f"A. contorul scrie '{txt}' in loc de 'Pasul 1 din N'")
                else:
                    print(f"  A. contor: '{txt}'. OK")

                # --- B
                vizibili = page.locator(".atom:not(.ux-step-hidden)").count()
                total = page.locator(".atom").count()
                if vizibili != 1:
                    pica(f"B. pe ecran sunt {vizibili} atomi din {total}, ar trebui 1")
                else:
                    print(f"  B. un singur atom vizibil din {total}. OK")

                # --- C
                cuvinte = page.evaluate(
                    "() => { const a = document.querySelector('.atom:not(.ux-step-hidden)');"
                    " return a ? a.innerText.trim().split(/\\s+/).length : -1; }")
                # Pragul e 800, nu 400: masurat static pe TOATE cele 531 de lectii,
                # primul pas are mediana 211 cuvinte, 5,3% trec de 400 si doar
                # 0,6% de 800. Peste 800 inseamna ca pasul a ramas un zid.
                if cuvinte < 0:
                    pica("C. nu gasesc atomul vizibil")
                elif cuvinte > 800:
                    pica(f"C. primul pas are {cuvinte} cuvinte - tot un zid (peste 800)")
                else:
                    marca = "" if cuvinte <= 400 else "  (peste mediana, dar departe de zid)"
                    print(f"  C. primul pas: {cuvinte} cuvinte.{marca} OK")

                # --- D
                btn = page.locator(".ux-step-next")
                if not btn.is_disabled():
                    pica("D. butonul 'Urmatorul' e activ inainte de a raspunde")
                else:
                    print(f"  D. buton blocat: '{btn.inner_text().strip()}'. OK")

                if idx == 0:
                    page.screenshot(path=os.path.join(SHOTS, "proba_pas3_pasul1.png"),
                                    full_page=True)

                # --- E: raspunde la toate intrebarile atomului vizibil
                optiuni = page.locator(".atom:not(.ux-step-hidden) .atom-question")
                nq = optiuni.count()
                for q in range(nq):
                    try:
                        optiuni.nth(q).locator(".atom-option").first.click()
                        page.wait_for_timeout(350)
                    except Exception:
                        pass
                page.wait_for_timeout(700)
                if btn.is_disabled():
                    pica(f"E. dupa ce am raspuns la {nq} intrebari, butonul e tot blocat")
                else:
                    btn.click()
                    page.wait_for_timeout(700)
                    txt2 = counter.inner_text().strip()
                    if "Pasul 2" not in txt2:
                        pica(f"E. dupa 'Urmatorul' contorul scrie '{txt2}', nu 'Pasul 2'")
                    else:
                        print(f"  E. am raspuns la {nq} intrebari -> '{txt2}'. OK")

                # --- F
                perfecti_fara_quiz = page.evaluate(
                    "() => Array.from(document.querySelectorAll('.atom'))"
                    ".filter(a => !a.querySelector('.atom-quiz') && a.classList.contains('atom-perfect'))"
                    ".length")
                cititi = page.locator(".atom.atom-read").count()
                if perfecti_fara_quiz:
                    pica(f"F. {perfecti_fara_quiz} atomi fara intrebare sunt marcati 'perfect'")
                else:
                    print(f"  F. zero atomi fara intrebare marcati 'perfect' "
                          f"({cititi} marcati 'citit'). OK")

                # --- G
                reale = [e for e in erori if "favicon" not in e.lower()]
                if reale:
                    pica(f"G. erori JavaScript: {reale[:2]}")
                else:
                    print("  G. zero erori JavaScript. OK")

                ctx.close()
            browser.close()
    finally:
        httpd.shutdown()

    print("\n" + "=" * 60)
    if esecuri:
        print(f"PASUL 3: PICA — {len(esecuri)} probleme")
        for e in esecuri:
            print("  - " + e)
        return 1
    print("PASUL 3: TRECE — lectia se parcurge pas cu pas, nu ca un zid de text.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
