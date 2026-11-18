# -*- coding: utf-8 -*-
"""Judecător L02 — uneltele comune ale probelor în browser (Chromium headless).
Regula 24: TOATE cererile care nu merg spre 127.0.0.1 / localhost sunt oprite (și notate).
Regula 22: nimic nu pleacă spre servicii externe (nici fonturile Google: oprite)."""
import functools
import http.server
import threading
from pathlib import Path

import os  # noqa: E402
# COPIE (16.11.2026) din C:/00/Projects/LearningHub/lectii/vii/m1-l02/_verificare/j_comun.py (sha256 38b61e2d...; _verificare nu e in git).
# Singura schimbare: radacina sitului vine din LH_RADACINA (oracole/CONVENTIE_RADACINA.md); implicit worktree-ul LearningHub_fidel.
LH = Path(os.environ.get("LH_RADACINA") or Path(__file__).resolve().parents[4]).resolve()
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(LH))
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None


def server():
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), H)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{srv.server_address[1]}"


# 17.11.2026 (verificare_etapa0.md, punctul 7 și reparația 12; ca în ../sarcini_lib/joaca.py): jocuri/_motor/garda_locala.py
# spune că sendBeacon la închiderea paginii a scăpat odată de rută și a scris pe serverul viu. Deci: navigator.sendBeacon
# înlocuit înainte de orice script al paginii cu o funcție care întoarce false (nimic trimis), iar fișierele locale care
# vorbesc cu serverul viu (prezenta.js, site-credit.js) nu se încarcă deloc.
FARA_BEACON_JS = ("(() => { try { Object.defineProperty(navigator, 'sendBeacon', "
                  "{ value: function () { return false; }, configurable: true }); } catch (e) {} })();")
FARA = ("/assets/js/prezenta.js", "/assets/js/site-credit.js")


def context(br, tel, R):
    ctx = br.new_context(viewport={"width": 390, "height": 844} if tel else {"width": 1280, "height": 900},
                         device_scale_factor=2 if tel else 1, is_mobile=tel, has_touch=tel, locale="ro-RO")
    ctx.add_init_script(FARA_BEACON_JS)

    def ruta(r):
        u = r.request.url
        local = u.startswith("http://127.0.0.1") or u.startswith("http://localhost")
        if local and not u.split("?")[0].split("#")[0].endswith(FARA):
            return r.continue_()
        if local:
            # local, dar vorbește cu serverul viu: abandonat (ca în joaca.py). Abandonul îl notez separat, ca proba să-i
            # poată deosebi eroarea de consolă („Failed to load resource” pe prezenta.js) de o eroare adevărată a paginii.
            R.setdefault("cereri_locale_oprite", []).append(u[:100])
            return r.abort()
        R.setdefault("cereri_oprite", []).append(u[:100])
        return r.abort()
    ctx.route("**/*", ruta)
    return ctx


class Pagina:
    """gesturi de om: clic/atingere, dublu-clic, taste adevărate pe calculator, butoane pe telefon"""
    def __init__(self, pg, tel, R, dev):
        self.pg, self.tel, self.R, self.dev = pg, tel, R, dev

    def w(self, ms=150):
        self.pg.wait_for_timeout(ms)

    def apasa(self, loc):
        loc = loc.first
        loc.evaluate("e=>e.scrollIntoView({block:'center',inline:'nearest'})")
        self.w(250)
        (loc.tap() if self.tel else loc.click())
        self.w(150)

    def la(self, x, y):
        (self.pg.touchscreen.tap(x, y) if self.tel else self.pg.mouse.click(x, y))
        self.w(350)

    def dublu(self, x, y):
        if self.tel:
            self.pg.touchscreen.tap(x, y); self.pg.wait_for_timeout(90); self.pg.touchscreen.tap(x, y)
        else:
            self.pg.mouse.dblclick(x, y)
        self.w(300)

    def doc(self):
        return self.pg.evaluate("[...document.querySelectorAll('#body .wo-doc .wo-p')].map(p=>[...p.querySelectorAll(':scope > [data-o], :scope > .wo-pend')].map(s=>s.textContent).join(''))")

    def sel(self):
        return self.pg.evaluate("[...document.querySelectorAll('#body .wo-doc .wo-sl')].map(s=>s.textContent).join('')")

    def car(self, b, o, parte="st"):
        loc = self.pg.locator(f'#body .wo-doc .wo-p[data-b="{b}"] > [data-o="{o}"]').first
        loc.scroll_into_view_if_needed()
        self.w(120)
        bb = loc.bounding_box()
        for _ in range(15):
            self.w(80)
            b2 = loc.bounding_box()
            if b2 == bb:
                break
            bb = b2
        f = {"st": 0.12, "dr": 0.9, "mij": 0.5}[parte]
        return bb["x"] + bb["width"] * f, bb["y"] + bb["height"] / 2

    def buton(self, sel):
        self.apasa(self.pg.locator(f"#body {sel}"))

    def k(self, ce, n=1):
        for _ in range(n):
            if self.tel:
                s = {"enter": '.wo-k[data-k="enter"]', "bs": '.wo-k[data-k="bs"]', "del": '.wo-k[data-k="del"]', "z": '.wo-k[data-k="z"]',
                     "y": '.wo-k[data-wu="y"]', "st": '[data-wu="k-st"]', "dr": '[data-wu="k-dr"]', "sst": '[data-wu="k-sst"]', "sdr": '[data-wu="k-sdr"]'}[ce]
                self.buton(s)
            else:
                self.pg.keyboard.press({"enter": "Enter", "bs": "Backspace", "del": "Delete", "z": "Control+z", "y": "Control+y",
                                        "st": "ArrowLeft", "dr": "ArrowRight", "sst": "Shift+ArrowLeft", "sdr": "Shift+ArrowRight"}[ce])
                self.w(70)

    def scrie(self, t):
        if self.tel:
            self.pg.locator("#body .wo-in").tap()
            self.w(100)
        self.pg.keyboard.type(t, delay=25)
        self.w(150)

    def fb(self):
        return self.pg.locator("#fb").inner_text().strip().replace("\n", " ") if self.pg.locator("#fb").count() else ""

    def verifica(self):
        self.apasa(self.pg.locator("#chk"))
        self.w(250)
        return self.fb()

    def stare(self):
        return self.pg.locator("#body .wu-stare").inner_text().replace("\n", " ") if self.pg.locator("#body .wu-stare").count() else ""

    def activ(self):
        return self.pg.evaluate("(()=>{const a=document.activeElement;return a?(a.className||a.tagName)+'|'+(a.id||''):''})()")
