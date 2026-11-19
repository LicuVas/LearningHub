# -*- coding: utf-8 -*-
"""Runda 11 · proba constructorului: gesturi REALE (mouse + tastatură, Playwright headless) pe aplicatii/poligon.html cu
PowerPoint, starea înainte și după fiecare gest, plus evenimentele §4 emise. Doar 127.0.0.1 (regula 24: restul se
abandonează). Ieșirea: runde/11/proba_powerpoint.json; ultima linie = numărul de verificări picate.
    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/proba_powerpoint.py
"""
import functools
import http.server
import json
import sys
import threading
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

AICI = Path(__file__).resolve().parent
WT = AICI.parents[3]
IESIRE = AICI / "proba_powerpoint.json"


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def server():
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=str(WT)))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, "http://127.0.0.1:%d" % s.server_address[1]


REZ = []


def verifica(nume, ok, detalii=None):
    REZ.append({"verificare": nume, "ok": bool(ok), "detalii": detalii})
    print(("  ok   " if ok else "  RĂU ") + nume + ("" if ok else "  " + json.dumps(detalii, ensure_ascii=False)[:300]))


def main():
    srv, baza = server()
    plecate = []
    with sync_playwright() as p:
        br = p.chromium.launch(headless=True)
        ctx = br.new_context(viewport={"width": 1366, "height": 768})

        def ruta(r):
            if urlsplit(r.request.url).hostname not in ("127.0.0.1", "localhost"):
                plecate.append(r.request.url)
                return r.abort()
            return r.continue_()
        ctx.route("**/*", ruta)
        pg = ctx.new_page()
        erori = []
        pg.on("pageerror", lambda e: erori.append(str(e)))
        pg.goto(baza + "/aplicatii/poligon.html?aplicatie=powerpoint", wait_until="load")
        pg.wait_for_selector('[data-lh-aplicatie="powerpoint"] [data-lh-tinta="miniatura"]', timeout=15000)
        pg.evaluate("window.__marca=(window.__lhAplicatieEv||[]).length")
        st = lambda: pg.evaluate("LH.aplicatii.stare('powerpoint')")
        ev = lambda: pg.evaluate("(()=>{const E=window.__lhAplicatieEv||[];const o=E.slice(window.__marca).map(e=>({gest:e.gest,actiune:e.actiune,tinta:e.tinta}));window.__marca=E.length;return o})()")
        el = lambda t: pg.evaluate_handle("t=>LH.aplicatii.element('powerpoint',t)", t).as_element()

        s0 = st()
        verifica("pornire: 3 diapozitive din poligon", len(s0["diapozitive"]) == 3, s0["diapozitive"])
        # 1. clic pe miniatura 2, apoi Ctrl+M
        el("miniatura:2").click()
        pg.keyboard.press("Control+m")
        s1 = st()
        verifica("Ctrl+M după miniatura 2: 4 diapozitive, al 3-lea Title and Content, activ 3",
                 len(s1["diapozitive"]) == 4 and s1["diapozitive"][2]["aspect"] == "Title and Content" and s1["diapozitiv_activ"] == 3, s1["diapozitive"])
        e1 = ev()
        verifica("evenimente: clic pe miniatură + ctrl_m", any(e["tinta"] == "miniatura:2" for e in e1) and any(e["gest"] == "ctrl_m" and e["actiune"] == "diapozitiv_nou" for e in e1), e1)
        # 2. clic în titlul diapozitivului nou, tastare
        el("forma:3/1").click()
        pg.keyboard.type("Lava", delay=15)
        s2 = st()
        verifica("tastare în titlu: texte [Lava]", s2["diapozitive"][2]["texte"] == ["Lava"], s2["diapozitive"][2])
        ecran = pg.evaluate("LH.aplicatii.element('powerpoint','forma:3/1').innerText.replace(/\\s+/g,'')")
        verifica("ecranul = starea (titlul arată Lava)", ecran == "Lava", ecran)
        # 3. Ctrl+Z de două ori: tastarea (o unitate), apoi diapozitivul nou
        pg.keyboard.press("Control+z")
        pg.keyboard.press("Control+z")
        s3 = st()
        verifica("Ctrl+Z ×2: înapoi la 3 diapozitive", len(s3["diapozitive"]) == 3 and s3["diapozitive"] == s0["diapozitive"], s3["diapozitive"])
        # 4. Design › tema Ion (galeria derulată la rândul 2)
        el("mso:TabDesign").click()
        el("meniu:Ion").click()
        verifica("Design › Ion: tema = Ion", st()["tema"] == "Ion", st()["tema"])
        # 5. clic dreapta pe miniatura 1 › Duplicate Slide
        el("miniatura:1").click(button="right")
        verifica("meniul miniaturii din referință", el("meniu:Duplicate Slide") is not None)
        el("meniu:Duplicate Slide").click()
        s5 = st()
        verifica("Duplicate Slide: 4 diapozitive, 1 și 2 identice", len(s5["diapozitive"]) == 4 and s5["diapozitive"][0] == s5["diapozitive"][1], s5["diapozitive"][:2])
        # 6. comandă nesimulată -> mesajul central
        el("mso:TabReview").click()
        nes = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','mso:SpellingAccess')||[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-loc-panglica] [data-lh-tinta^=\"panglica:\"],[data-lh-aplicatie=powerpoint] .lh-ap-loc-panglica [data-lh-tinta^=\"panglica:\"]')][0];if(!e)return null;e.click();const m=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-nesimulat]:not([data-lh-tip])');return m&&m.getAttribute('role')==='status'?m.textContent:null})()")
        verifica("comandă nesimulată: mesajul central cu data-lh-nesimulat", bool(nes), nes)
        # 7. F5 = expunerea; Esc iese
        pg.keyboard.press("F5")
        verifica("F5: expunerea pornește de la diapozitivul 1", st()["expunere"] == 1, st()["expunere"])
        pg.keyboard.press("Escape")
        verifica("Esc: ieșire din expunere", st()["expunere"] is None, st()["expunere"])
        # 8. telefon (I1): la 375 px panglica se derulează lateral, nu se taie
        pg.set_viewport_size({"width": 375, "height": 740})
        pg.wait_for_timeout(300)
        lat = pg.evaluate("(()=>{const s=document.querySelector('[data-lh-aplicatie=powerpoint] .lh-ap-sus');return {client:s.clientWidth,scroll:s.scrollWidth,ov:getComputedStyle(s).overflowX}})()")
        verifica("telefon 375 px: banda de sus derulabilă (overflow-x auto)", lat["ov"] == "auto" and lat["scroll"] > lat["client"], lat)
        verifica("fără erori JS", not erori, erori[:3])
        br.close()
    srv.shutdown()
    picate = [r for r in REZ if not r["ok"]]
    IESIRE.write_text(json.dumps({"verificari": REZ, "picate": len(picate), "cereri_blocate": len(plecate)}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(len(picate))
    return 0 if not picate else 1


if __name__ == "__main__":
    sys.exit(main())
