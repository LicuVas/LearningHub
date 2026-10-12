# -*- coding: utf-8 -*-
r"""Proba FERESTREI MICI (12.10.2026; contract: _campaign/fereastra_mica_2026_10/contract.md).

Pe pasul „Acum în aplicația adevărată”, butonul „⧉ Ține pașii deasupra, cât lucrezi” deschide o fereastră Document
Picture-in-Picture (mereu deasupra) cu pașii și bifele. Verifică, în Chrome, pe motor.js adevărat (rețeaua doar
127.0.0.1 — regula 24; tot ce pleacă în afară e abandonat și numărat):
  R1  butonul apare pe pasul din aplicație în TOATE lecțiile cu `aplicatieReala` (azi 60);
  R2  fereastra arată exact pașii din pagină (același text, aceeași ordine), titlul și „Unde lucrezi”;
  R3  bifa pusă în fereastră apare în pagină și invers; bifele rămân după închiderea ferestrei și la redeschidere;
  R4  „Am terminat → La verificare” închide fereastra și duce lecția la Î1; „Adu pașii înapoi” o închide pe loc;
      fereastra se închide singură când pagina pleacă de pe pas (← Înapoi);
  R5  fără fereastra de document (Chrome/Edge vechi, Firefox): fără buton, cu sfatul „Windows + ←”; 0 erori;
  R6  pe telefon: nici buton, nici sfat; pagina nu iese din ecran.
Controlul: --mutanti servește motor.js stricat în 7 feluri; proba trebuie să-i prindă pe toți.
    python C:\00\Projects\LearningHub\jocuri\_motor\proba_fereastra_mica.py [--mutanti] [--lectie lectii/viii/m1-l07/]
    python C:\00\Projects\LearningHub\jocuri\_motor\proba_fereastra_mica.py --baza https://learninghub-8z6.pages.dev
Cu --baza, proba lucrează pe situl publicat; orice cerere spre /api/ sau spre alt domeniu e tot abandonată.
Ultima linie = UN număr (0 = curat).
"""
import argparse
import functools
import http.server

import subprocess
import sys
import threading
from pathlib import Path
from urllib.parse import urlsplit

sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright  # noqa: E402

MOTOR_DIR = Path(__file__).resolve().parent
LH = MOTOR_DIR.parents[1]
MOTOR = MOTOR_DIR / "motor.js"
LECTIE = "lectii/viii/m1-l07/"
COMPLETATE = ["lectii/vi/m1-l01/", "lectii/viii/m1-l01/"]   # pașii primesc rezultatele atelierului după desenare
FARA_PIP ="Object.defineProperty(window,'documentPictureInPicture',{value:undefined,configurable:true})"
MUTANTI = [
    ("M1 butonul nu apare niciodată", "if(!arePip())return `<p", "if(true)return `<p"),
    ("M2 fereastra pierde primul pas", "  veche.replaceWith(nou);", "  nou.querySelector('li').remove();veche.replaceWith(nou);"),
    ("M8 fereastra ia pașii goi din lecție, nu pe cei completați din pagină",
     "const y=d.scrollingElement?d.scrollingElement.scrollTop:0,nou=d.importNode(sursa,true);",
     "const y=0,t=d.createElement('div');t.innerHTML=listaReal(aplicatieReala(C.nivele[R.li]));const nou=t.firstElementChild;"),
    ("M3 fereastra nu se reface după o schimbare în pagină", "function oglindaCurand(){if(PIP&&!oglindaProgramata)", "function oglindaCurand(){if(false)"),
    ("M9 clicul din fereastră nu ajunge în pagină", "e.preventDefault();pereche.click();oglindaCurand();", "return;"),
    ("M10 bifă dublă pe pașii care au bifele lor", "${/type=[\"']?checkbox/i.test(x)?'':", "${false?'':"),
    ("M4 „Am terminat” nu duce la verificare", "try{window.focus()}catch(e){}R.mode='test';R.phase='q';question()", "try{window.focus()}catch(e){}"),
    ("M5 sfatul apare și pe telefon", "  if(!cuMouse())return '';\n", ""),
    ("M6 fereastra rămâne deschisă după ce pagina pleacă de pe pas", "if(!app.querySelector('ol[data-real-lista]'))PIP.close();", "if(false)PIP.close();"),
    ("M7 bifele nu țin după închiderea ferestrei", "try{sessionStorage.setItem(cheieBife(),", "try{void(cheieBife(),"),
    ("M11 bifele nu țin seama de elev", "return 'lh_bife_real|'+cheieJoc()+'|'+R.li", "return 'lh_bife_real|'+C.cheie+'|'+R.li"),
]


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


def lectii_cu_aplicatie(doar_publicate=False):
    """Lecțiile de pe disc cu pas în aplicație; doar_publicate (pentru --baza): doar cele din git (lecțiile în lucru,
    încă neadăugate, nu sunt pe sit)."""
    pub = None
    if doar_publicate:
        r = subprocess.run(["git", "-C", str(LH), "ls-files", "lectii"], capture_output=True, text=True, encoding="utf-8")
        pub = set(r.stdout.split())
    return sorted(p.parent.relative_to(LH).as_posix() + "/" for p in (LH / "lectii").glob("*/m*-l*/index.html")
                  if "aplicatieReala" in p.read_text(encoding="utf-8", errors="ignore")
                  and (pub is None or p.relative_to(LH).as_posix() in pub))


class Proba:
    def __init__(self, br, baza, motor_txt=None, tacut=False):
        self.br, self.baza, self.motor_txt, self.tacut = br, baza, motor_txt, tacut
        self.probleme, self.externe, self.api, self.erori = [], [], [], []

    def verifica(self, c, ce, det: object = ""):
        if not self.tacut:
            print(("  ok   " if c else "  RĂU  ") + ce + (("  — " + str(det)[:300]) if det and not c else ""), flush=True)
        if not c:
            self.probleme.append(ce)

    def context(self, **kw):
        init = kw.pop("init", None)
        ctx = self.br.new_context(**kw)

        gazde = ("127.0.0.1", "localhost", urlsplit(self.baza).hostname)   # --baza: și situl publicat

        def ruta(r):
            s = urlsplit(r.request.url)
            if s.hostname not in gazde or "/api/" in s.path:   # nimic spre panoul profesorului (regula 24)
                self.externe.append(r.request.url)
                if "/api/" in s.path:
                    self.api.append(r.request.url)
                return r.abort()
            if self.motor_txt is not None and s.path.endswith("/jocuri/_motor/motor.js"):
                return r.fulfill(status=200, headers={"content-type": "application/javascript; charset=utf-8"}, body=self.motor_txt)
            return r.continue_()
        ctx.route("**/*", ruta)
        if init:
            ctx.add_init_script(init)
        return ctx

    def la_aplicatie(self, pg, lectie):
        """Deschide lecția curată și sare la pasul din aplicația adevărată (prin cârligul de test al motorului)."""
        pg.goto(self.baza + "/__gol_404")
        pg.evaluate("localStorage.clear();sessionStorage.clear()")
        pg.goto(self.baza + "/" + lectie)
        pg.wait_for_function("window.JocMotor&&JocMotor.test&&JocMotor.test.config()", timeout=15000)
        pg.click('.lvl[data-l="0"]', timeout=8000)
        pg.evaluate("JocMotor.test.real()")
        pg.wait_for_selector(".aplicatie-reala", timeout=8000)

    def pip_deschis(self, pg):
        return pg.evaluate("!!(window.documentPictureInPicture&&documentPictureInPicture.window)")

    def detaliat(self, lectie):
        ctx = self.context(viewport={"width": 1366, "height": 768})
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: self.erori.append(str(e)))
        try:
            self.la_aplicatie(pg, lectie)
            n = pg.evaluate("(()=>{const C=JocMotor.test.config(),L=C.nivele[0],A=L.aplicatieReala||C.aplicatieReala||{};return (A.pasi||(C.diploma||{}).provocare||[]).length})()")
            self.verifica(pg.locator("#pip-deschide").is_visible(), "R1 %s: butonul „Ține pașii deasupra” e pe pasul din aplicație" % lectie)
            self.verifica(pg.locator(".aplicatie-reala input.bifa-real").count() == n and n > 0, "pagina: câte o bifă pe fiecare pas (%d)" % n)
            pg.click("#pip-deschide")
            pg.wait_for_function("window.documentPictureInPicture.window&&documentPictureInPicture.window.document.querySelector('#pip-gata')", timeout=10000)
            s = pg.evaluate("""() => { const d = documentPictureInPicture.window.document, t = e => e.innerText.replace(/\\s+/g,' ').trim();
                return { pip: [...d.querySelectorAll('.aplicatie-reala li')].map(t), pag: [...document.querySelectorAll('#app .aplicatie-reala li')].map(t),
                         titlu: t(d.querySelector('.pip-cap b')), h2: t(document.querySelector('#app h2')), unde: d.body.innerText.includes('Unde lucrezi'),
                         undePag: document.querySelector('#app').innerText.includes('Unde lucrezi'), bife: d.querySelectorAll('input.bifa-real').length,
                         ascuns: getComputedStyle(document.getElementById('pip-deschide')).display, deschisa: getComputedStyle(document.querySelector('.fereastra-deschisa')).display,
                         linkuri: [...d.querySelectorAll('a[href]')].map(a => [a.href, a.target]) }; }""")
            self.verifica(s["pip"] == s["pag"] and len(s["pip"]) == n, "R2 fereastra: aceiași %d pași, în aceeași ordine, ca în pagină" % n, (s["pip"][:2], s["pag"][:2]))
            self.verifica(s["titlu"] == s["h2"] and s["unde"] == s["undePag"], "R2 fereastra: titlul pasului și „Unde lucrezi”", (s["titlu"], s["h2"]))
            self.verifica(s["bife"] == n, "R3 fereastra: câte o bifă pe fiecare pas")
            self.verifica(s["ascuns"] == "none" and s["deschisa"] != "none", "pagina: în locul butonului, „Pașii sunt în fereastra mică · Adu pașii înapoi”")
            self.verifica(all(h.startswith("http") and t == "_blank" for h, t in s["linkuri"]), "linkurile din fereastră: adrese întregi, în fila browserului (%d)" % len(s["linkuri"]), s["linkuri"][:2])
            # R3: bifă în fereastră -> în pagină; bifă în pagină -> în fereastră
            pg.evaluate("documentPictureInPicture.window.document.querySelector('input.bifa-real[data-k=\"0\"]').click()")
            pg.locator('#app input.bifa-real[data-k="%d"]' % (n - 1)).click()
            b = pg.evaluate("""() => { const d = documentPictureInPicture.window.document, f = r => [...r.querySelectorAll('input.bifa-real')].map(x => x.checked);
                return { pag: f(document.querySelector('#app')), pip: f(d), nr: d.querySelector('.bife-numar').innerText }; }""")
            astept = [k in (0, n - 1) for k in range(n)]
            self.verifica(b["pag"] == astept, "R3 bifa pusă în fereastră se vede în pagină", b["pag"])
            self.verifica(b["pip"] == astept, "R3 bifa pusă în pagină se vede în fereastră", b["pip"])
            self.verifica(b["nr"].startswith("%d din %d" % (2 if n > 1 else 1, n)), "fereastra numără bifele („2 din %d pași bifați”)" % n, b["nr"])
            # R4: „Adu pașii înapoi” o închide; bifele rămân; redeschisă, le are
            pg.click("#pip-inapoi")
            pg.wait_for_function("!window.documentPictureInPicture.window", timeout=5000)
            self.verifica(pg.locator("#pip-deschide").is_visible(), "R4 „Adu pașii înapoi” închide fereastra și butonul revine")
            self.verifica(pg.evaluate("[...document.querySelectorAll('#app input.bifa-real')].map(x=>x.checked)") == astept, "R3 bifele rămân în pagină după închidere")
            pg.click("#pip-deschide")
            pg.wait_for_function("window.documentPictureInPicture.window&&documentPictureInPicture.window.document.querySelector('#pip-gata')", timeout=10000)
            self.verifica(pg.evaluate("[...documentPictureInPicture.window.document.querySelectorAll('input.bifa-real')].map(x=>x.checked)") == astept,
                          "R3 redeschisă, fereastra are bifele de dinainte")
            pg.reload()
            pg.wait_for_function("window.JocMotor&&JocMotor.test&&JocMotor.test.config()", timeout=15000)
            pg.click('.lvl[data-l="0"]', timeout=8000)
            pg.evaluate("JocMotor.test.real()")
            pg.wait_for_selector(".aplicatie-reala", timeout=8000)
            self.verifica(pg.evaluate("[...document.querySelectorAll('#app input.bifa-real')].map(x=>x.checked)") == astept, "R3 bifele țin și după reîncărcarea filei")
            # R4: „Am terminat → La verificare”
            pg.click("#pip-deschide")
            pg.wait_for_function("window.documentPictureInPicture.window&&documentPictureInPicture.window.document.querySelector('#pip-gata')", timeout=10000)
            pg.evaluate("documentPictureInPicture.window.document.getElementById('pip-gata').click()")
            pg.wait_for_timeout(500)
            st = pg.evaluate("JocMotor.test.stare()")
            self.verifica(st and st["phase"] == "q" and st["qi"] == 0, "R4 „Am terminat → La verificare”: lecția e la Î1", st)
            self.verifica(not self.pip_deschis(pg), "R4 „Am terminat”: fereastra mică s-a închis")
            # R4: plecarea de pe pas (← Înapoi) închide fereastra
            pg.evaluate("JocMotor.test.real()")
            pg.wait_for_selector("#pip-deschide", timeout=8000)
            pg.click("#pip-deschide")
            pg.wait_for_function("!!(window.documentPictureInPicture.window)", timeout=10000)
            pg.click("#pas-prev")
            pg.wait_for_timeout(500)
            self.verifica(not self.pip_deschis(pg), "R4 „← Înapoi” de pe pas: fereastra mică se închide singură")
        except Exception as e:
            self.verifica(False, "proba detaliată s-a oprit: " + str(e).splitlines()[0][:200])
        finally:
            ctx.close()

    def oglinda(self):
        """Lecțiile cu bifele lor în pași: V/10 (câte o bifă pe punct, fără bifă dublă) și VI/9 (lista de autoverificare,
        cu numărătorul ei). Clic în fereastră -> elementul din pagină (cu scripturile lecției); clic în pagină -> fereastra."""
        ctx = self.context(viewport={"width": 1366, "height": 768})
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: self.erori.append(str(e)))
        deschide = "window.documentPictureInPicture.window&&documentPictureInPicture.window.document.querySelector('#pip-gata')"
        try:
            self.la_aplicatie(pg, "lectii/v/m2-l10/")
            self.verifica(pg.locator("#app .aplicatie-reala label.bifez input").count() > 0, "V/10: pașii au bifele lor (câte una pe punct)")
            self.verifica(pg.locator("#app .aplicatie-reala li:has(.bifa-real):has(label.bifez)").count() == 0, "V/10: nicio bifă dublă (a lecției + a ferestrei) pe același pas")
            pg.click("#pip-deschide")
            pg.wait_for_function(deschide, timeout=10000)
            pg.evaluate("documentPictureInPicture.window.document.querySelector('.aplicatie-reala label.bifez input').click()")
            pg.wait_for_timeout(300)
            s = pg.evaluate("""() => ({ pag: document.querySelector('#app .aplicatie-reala label.bifez input').checked,
                                       pip: documentPictureInPicture.window.document.querySelector('.aplicatie-reala label.bifez input').checked })""")
            self.verifica(s["pag"] and s["pip"], "V/10: bifa lecției pusă în fereastră e pusă și în pagină (și rămâne în fereastră)", s)
            pg.evaluate("documentPictureInPicture.window.close()")

            self.la_aplicatie(pg, "lectii/vi/m2-l09/")
            pg.click("#pip-deschide")
            pg.wait_for_function(deschide, timeout=10000)
            stare = """() => { const d = documentPictureInPicture.window.document, f = r => [...r.querySelectorAll('input[data-av]')].slice(0, 2).map(x => x.checked);
                return { pag: f(document.querySelector('#app')), pip: f(d), nrPag: document.querySelector('#app [data-av-nr]').innerText,
                         nrPip: d.querySelector('[data-av-nr]').innerText,
                         dePag: document.querySelector('#app .av-dece').open, dePip: d.querySelector('.av-dece').open }; }"""
            pg.evaluate("documentPictureInPicture.window.document.querySelector('input[data-av]').click()")
            pg.wait_for_timeout(300)
            s = pg.evaluate(stare)
            self.verifica(s["pag"][0] and s["pip"][0] and s["nrPag"] == "1" and s["nrPip"] == "1",
                          "VI/9: bifa de autoverificare pusă în fereastră: bifată în pagină, numărătorul lecției 1 în ambele", s)
            pg.locator("#app input[data-av]").nth(1).click()
            pg.wait_for_timeout(300)
            s = pg.evaluate(stare)
            self.verifica(s["pip"] == [True, True] and s["nrPip"] == "2", "VI/9: bifa pusă în pagină se vede în fereastră, cu numărătorul 2", s)
            pg.evaluate("documentPictureInPicture.window.document.querySelector('.av-dece summary').click()")
            pg.wait_for_timeout(300)
            s = pg.evaluate(stare)
            self.verifica(s["dePag"] and s["dePip"], "VI/9: „De ce?” deschis din fereastră se deschide și în pagină", s)
            pg.evaluate("documentPictureInPicture.window.close()")
        except Exception as e:
            self.verifica(False, "proba oglinzii s-a oprit: " + str(e).splitlines()[0][:200])
        finally:
            ctx.close()

    def firefox(self, lectie):
        """R5 într-un browser ADEVĂRAT fără fereastra de document (self.br = Firefox): fără buton, cu sfatul, bifele merg."""
        ctx = self.context(viewport={"width": 1366, "height": 768})
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: self.erori.append("firefox: " + str(e)))
        try:
            self.la_aplicatie(pg, lectie)
            self.verifica(not pg.evaluate("!!window.documentPictureInPicture"), "Firefox: browserul chiar nu are fereastra de document")
            self.verifica(pg.locator("#pip-deschide").count() == 0 and pg.locator(".fereastra-sfat").is_visible(),
                          "R5 Firefox adevărat: fără buton, cu sfatul „Windows + ←”")
            pg.locator("#app input.bifa-real").first.click()
            self.verifica(pg.locator("#app input.bifa-real").first.is_checked(), "R5 Firefox: bifele merg")
        except Exception as e:
            self.verifica(False, "proba în Firefox s-a oprit: " + str(e).splitlines()[0][:200])
        finally:
            ctx.close()

    def pe_elev(self, lectie):
        """Bifele sunt ale ELEVULUI (profilul activ), pe aceeași filă: A bifează, B nu vede bifa lui A, A o regăsește."""
        ctx = self.context(viewport={"width": 1366, "height": 768})
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: self.erori.append(str(e)))

        def ca(profil):
            pg.evaluate("p => localStorage.setItem('learninghub_active_profile', p)", profil)
            pg.reload()
            pg.wait_for_function("window.JocMotor&&JocMotor.test&&JocMotor.test.config()", timeout=15000)
            pg.click('.lvl[data-l="0"]', timeout=8000)
            pg.evaluate("JocMotor.test.real()")
            pg.wait_for_selector("#app input.bifa-real", timeout=8000)
            return pg.evaluate("[...document.querySelectorAll('#app input.bifa-real')].map(x=>x.checked)")
        try:
            self.la_aplicatie(pg, lectie)
            ca("ProbaA")
            pg.locator('#app input.bifa-real[data-k="0"]').click()
            b = ca("ProbaB")
            self.verifica(not any(b), "pe elev: elevul B, pe aceeași filă, NU vede bifa pusă de A", b)
            a = ca("ProbaA")
            self.verifica(a[:1] == [True] and not any(a[1:]), "pe elev: întors la A, bifa lui e tot acolo", a)
            ls = pg.evaluate("Object.keys(localStorage).filter(k=>/bife/i.test(k))")
            self.verifica(not ls, "pe elev: bifele NU stau în localStorage (sertarul)", ls)
        except Exception as e:
            self.verifica(False, "proba pe elev s-a oprit: " + str(e).splitlines()[0][:200])
        finally:
            ctx.close()

    def fara_pip_si_telefon(self, lectie):
        ctx = self.context(viewport={"width": 1366, "height": 768}, init=FARA_PIP)
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: self.erori.append(str(e)))
        try:
            self.la_aplicatie(pg, lectie)
            self.verifica(pg.locator("#pip-deschide").count() == 0 and pg.locator(".fereastra-sfat").is_visible(),
                          "R5 fără fereastra de document: fără buton, cu sfatul „Windows + ←”")
            pg.locator("#app input.bifa-real").first.click()
            self.verifica(pg.locator("#app input.bifa-real").first.is_checked(), "R5 bifele merg și fără fereastră")
        except Exception as e:
            self.verifica(False, "proba fără fereastră s-a oprit: " + str(e).splitlines()[0][:200])
        finally:
            ctx.close()
        ctx = self.context(viewport={"width": 412, "height": 860}, is_mobile=True, has_touch=True, device_scale_factor=2.6)
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: self.erori.append(str(e)))
        try:
            self.la_aplicatie(pg, lectie)
            self.verifica(pg.locator("#pip-deschide").count() == 0 and pg.locator(".fereastra-sfat").count() == 0, "R6 pe telefon: nici buton, nici sfat")
            lat = pg.evaluate("document.documentElement.scrollWidth")
            self.verifica(lat <= 412, "R6 pe telefon: pagina nu iese din ecran (%d px)" % lat)
        except Exception as e:
            self.verifica(False, "proba pe telefon s-a oprit: " + str(e).splitlines()[0][:200])
        finally:
            ctx.close()

    def toate(self, lectii):
        ctx = self.context(viewport={"width": 1366, "height": 768})
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: self.erori.append(str(e)))
        bune, rele, active = 0, [], []
        for lectie in lectii:
            try:
                self.la_aplicatie(pg, lectie)
                if not pg.locator("#pip-deschide").is_visible():
                    rele.append(lectie + ": fără buton")
                    continue
                pg.click("#pip-deschide")
                pg.wait_for_function("window.documentPictureInPicture.window&&documentPictureInPicture.window.document.querySelector('#pip-gata')", timeout=10000)
                s = pg.evaluate("""() => { const t = e => e.innerText.replace(/\\s+/g,' ').trim(), d = documentPictureInPicture.window.document;
                    const r = { pip: [...d.querySelectorAll('.aplicatie-reala li')].map(t), pag: [...document.querySelectorAll('#app .aplicatie-reala li')].map(t),
                                img: [...d.images].filter(i => !i.src.startsWith('http')).length,
                                active: document.querySelectorAll('#app .aplicatie-reala :is(button,select,textarea,input:not(.bifa-real))').length,
                                duble: document.querySelectorAll('#app .aplicatie-reala li:has(> .bifa-real):has(input[type=checkbox]:not(.bifa-real))').length };
                    documentPictureInPicture.window.close(); return r; }""")
                if s["pip"] != s["pag"] or not s["pip"]:
                    rele.append(lectie + ": pașii diferă (%d în fereastră, %d în pagină)" % (len(s["pip"]), len(s["pag"])))
                elif s["img"]:
                    rele.append(lectie + ": %d imagini fără adresă întreagă" % s["img"])
                elif s["duble"]:
                    rele.append(lectie + ": %d pași cu bifă dublă" % s["duble"])
                else:
                    bune += 1
                if s["active"]:
                    active.append("%s: %d" % (lectie, s["active"]))
            except Exception as e:
                rele.append(lectie + ": " + str(e).splitlines()[0][:120])
        ctx.close()
        self.verifica(not rele and bune == len(lectii), "R1+R2 în toate lecțiile cu pas în aplicație: %d/%d" % (bune, len(lectii)), rele[:4])
        if not self.tacut:   # butoane/câmpuri în pași: în fereastră sunt o copie, fără scripturile lecției (informativ)
            print("  info elemente active în pașii din aplicație: " + (", ".join(active) or "niciunul"))
        return bune


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mutanti", action="store_true")
    ap.add_argument("--lectie", default=LECTIE)
    ap.add_argument("--fara-toate", action="store_true", help="sare peste trecerea prin toate lecțiile")
    ap.add_argument("--baza", help="situl publicat (ex. https://learninghub-8z6.pages.dev); implicit: server local")
    a = ap.parse_args()
    lectii = lectii_cu_aplicatie(doar_publicate=bool(a.baza))
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=str(LH)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    baza = a.baza.rstrip("/") if a.baza else "http://127.0.0.1:%d" % srv.server_address[1]
    scapati = 0
    try:
        with sync_playwright() as p:
            try:
                br = p.chromium.launch(channel="chrome", args=["--mute-audio"])
            except Exception:
                br = p.chromium.launch(args=["--mute-audio"])
            print("Proba ferestrei mici (%s, Chrome %s, %d lecții cu pas în aplicație)" % (baza, br.version, len(lectii)))
            P = Proba(br, baza)
            P.detaliat(a.lectie)
            P.oglinda()
            P.pe_elev(a.lectie)
            try:   # R5 într-un Firefox adevărat (python -m playwright install firefox); lipsă = doar informație
                fx = p.firefox.launch()
            except Exception:
                fx = None
                print("  info Firefox pentru probe nu e instalat: R5 doar prin simulare în Chrome")
            if fx:
                PF = Proba(fx, baza)
                PF.firefox(a.lectie)
                P.probleme += PF.probleme
                P.erori += PF.erori
                fx.close()
            P.fara_pip_si_telefon(a.lectie)
            if not a.fara_toate:
                P.toate(lectii)
            P.verifica(not P.erori, "0 erori JS", P.erori[:2])
            if a.baza:   # pe situl publicat, prezenta.js încearcă /api/vizitatori; ruta le abandonează pe toate (nu pleacă)
                print("  info %d încercări spre /api/ abandonate de rută, niciuna plecată (regula 24); %d cereri externe abandonate"
                      % (len(P.api), len(P.externe)))
            else:
                P.verifica(not P.api, "nicio cerere spre /api/ (regula 24; %d cereri externe abandonate)" % len(P.externe), P.api[:2])
            if a.mutanti:
                txt = MOTOR.read_text(encoding="utf-8")
                for nume, din, in_ in MUTANTI:
                    if txt.count(din) != 1:
                        print("  RĂU  %s: textul de mutat apare de %d ori" % (nume, txt.count(din)))
                        scapati += 1
                        continue
                    M = Proba(br, baza, motor_txt=txt.replace(din, in_), tacut=True)
                    M.detaliat(a.lectie)
                    M.oglinda()
                    M.pe_elev(a.lectie)
                    M.fara_pip_si_telefon(a.lectie)
                    M.toate(COMPLETATE)   # lecțiile care își completează pașii după desenare (M8)
                    prins = bool(M.probleme)
                    print(("  ok   " if prins else "  RĂU  ") + "%s: %s" % (nume, "prins (%s)" % M.probleme[0][:70] if prins else "SCĂPAT"), flush=True)
                    scapati += not prins
            br.close()
    finally:
        srv.shutdown()
        srv.server_close()
    if a.mutanti:
        print("Rezultat: %d verificări picate pe motorul adevărat; mutanți neprinși: %d din %d" % (len(P.probleme), scapati, len(MUTANTI)))
        print(len(P.probleme) + scapati)
    else:
        print("Rezultat: " + ("TOATE OK" if not P.probleme else "; ".join(P.probleme)[:500]))
        print(len(P.probleme))


if __name__ == "__main__":
    main()
