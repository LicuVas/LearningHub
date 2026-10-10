"""Proba BAREI PAȘILOR, PE ELEV (10.10.2026; cerința profesorului din 08.10.2026, 05_STANDARD_LECTIE.md, „Bara pașilor, de jos”).

    python proba_bara_pasi.py              # proba pe motor.js (ultima linie = câte verificări au picat)
    python proba_bara_pasi.py --mutanti    # proba + mutanții (ultima linie = mutanți NEprinși + verificările picate pe motorul adevărat)

Ce verifică, cu clicuri reale în browser, pe lecția reală lectii/vii/m1-l04 (P1..Pn, Atelier, Aplicația, Î1..Îk):
  1. doi elevi pe ACELAȘI calculator (profiluri diferite, același localStorage): A merge până la P3, B până la Î2;
     la A sunt butoane exact P1-P3, la B exact până la Î2; după reîncărcare la fel; fiecare își vede doar drumul lui;
  2. „Continuă de unde ai rămas: …” pe cuprins; ?pas=q2 la A (n-a ajuns) -> P3, cu notă; ?pas=p2 -> P2; ?continua=1 ->
     cel mai îndepărtat pas atins; B continuă de la Î2, rezolvă tot (și Î1, pe care finalul i-o cere) și ia 3 stele;
  3. profil activ FĂRĂ sertar (elev nou) = doar P1 curent, nimic apăsabil, pagina nu crapă;
  4. date vechi (doar ps:[0,1], at:1) -> P1, P2, Atelier apăsabile; nivel terminat (doar stele) -> tot apăsabil;
  5. evenimentul „lh-pas” (și window.__lhPas) cu cheie, nivel, pas, etichetă, titlu, real;
  6. jocurile: ?pas=p2&nivel=N; ?recitire=1 merge ca înainte.
Regula 24: situl e servit LOCAL (127.0.0.1); în browser tot ce nu e local e abandonat (se numără ce a încercat să plece
spre teste-vasile.netlify.app). prezenta.js e oprit (proba e a motorului; profilul se pune direct, ca pe calculatorul
comun). Browserul pornește cu --mute-audio.
"""
import argparse
import functools
import http.server
import json
import sys
import threading
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")
MOTOR_DIR = Path(__file__).resolve().parent
LH = MOTOR_DIR.parents[1]
MOTOR = MOTOR_DIR / "motor.js"
LECTIE = "lectii/vii/m1-l04/index.html"
JOC = "jocuri/grafica-v/index.html"
LOCALE = ("127.0.0.1", "localhost")
TITLU_BLOCAT = "Ajungi aici după ce termini pașii de dinainte"

# mutanții: fiecare strică motorul într-un loc; proba trebuie să pice pe fiecare
MUTANTI = [
    ("M1 toate apăsabile, ca înainte", "return pasiNivel(i).map((e,x)=>gata||", "return pasiNivel(i).map((e,x)=>true||"),
    ("M2 Î1 apăsabil de la început (vazut=k<=R.max)", "const qm=Lv.bazin?numar(aici&&aici.qm):Math.max(numar(l.qm),numar(aici&&aici.qm));",
     "const qm=aici?aici.max+1:0;"),
    ("M3 qm nu se salvează", "l.qm=Math.max(numar(l.qm),qn);", ""),
    ("M4 ?pas fără verificarea atingerii", "else if(!A[x]){", "else if(false){"),
    ("M5 evenimentul lh-pas nu pleacă", "window.dispatchEvent(new CustomEvent('lh-pas',{detail:d}))", "0"),
    ("M6 bara uită sertarul (doar deschiderea de acum)", "l=sertarLv()[i]||{},gata=", "l={},gata="),
]


class Proba:
    def __init__(self, br, baza, motor_txt=None, tacut=False):
        self.br, self.baza, self.motor_txt, self.tacut = br, baza, motor_txt, tacut
        self.probleme, self.spre_server, self.externe, self.erori = [], [], [], []

    def verifica(self, c, ce):
        if not self.tacut:
            print(("  ok   " if c else "  RĂU  ") + ce, flush=True)
        if not c:
            self.probleme.append(ce)

    # ---- rețeaua: doar 127.0.0.1; prezenta.js oprit; motorul (mutantul) din memorie ----
    def ruta(self, r):
        u = r.request.url
        s = urlsplit(u)
        if s.scheme in ("data", "blob"):
            return r.continue_()
        if s.hostname not in LOCALE:
            self.externe.append(u)
            if "teste-vasile" in u:
                self.spre_server.append(u)
            return r.abort()
        if s.path == "/__gol":
            return r.fulfill(status=200, body="<!doctype html><title>gol</title>", headers={"content-type": "text/html"})
        if s.path.endswith("/assets/js/prezenta.js"):
            return r.fulfill(status=200, body="/* prezenta.js oprit în proba barei */", headers={"content-type": "application/javascript"})
        if self.motor_txt is not None and s.path.endswith("/jocuri/_motor/motor.js"):
            return r.fulfill(status=200, body=self.motor_txt, headers={"content-type": "application/javascript; charset=utf-8"})
        return r.continue_()

    def context(self):
        ctx = self.br.new_context(viewport={"width": 1280, "height": 900})
        ctx.route("**/*", self.ruta)
        ctx.add_init_script("window.__evs=[];addEventListener('lh-pas',e=>window.__evs.push(e.detail));")
        pg = ctx.new_page()
        pg.set_default_timeout(8000)
        pg.on("pageerror", lambda e: self.erori.append(str(e)))
        return ctx, pg

    # ---- ajutoare ----
    def profil(self, pg, prof, sertar=None, cheie="lectie_vii_m1_l04"):
        pg.goto(self.baza + "/__gol")
        pg.evaluate("([p,k,s])=>{localStorage.setItem('learninghub_active_profile',p);if(s!==null)localStorage.setItem(k+'@'+p,s)}",
                    [prof, cheie, json.dumps(sertar) if sertar is not None else None])

    def deschide(self, pg, cale=LECTIE, q=""):
        pg.goto(self.baza + "/" + cale + q, timeout=30000)
        pg.wait_for_function("window.JocMotor&&document.getElementById('app')&&document.getElementById('app').children.length>0")
        pg.wait_for_timeout(150)

    @staticmethod
    def bara(pg):
        return pg.evaluate("""()=>[...document.querySelectorAll('.tabs > *')].map(e=>e.tagName==='BUTTON'?'buton'
            :e.classList.contains('now')?'acum':e.classList.contains('urm')?'urm':e.classList.contains('blocat')?'blocat':'altceva')""")

    @staticmethod
    def stare(pg):
        return pg.evaluate("JocMotor.test.stare()")

    @staticmethod
    def sertar(pg, prof, cheie="lectie_vii_m1_l04"):
        return pg.evaluate("k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}", cheie + "@" + prof)

    @staticmethod
    def asteptat(N, atinse, acum):
        top = max(list(atinse) + ([acum] if acum is not None else []), default=-1)
        return ["acum" if x == acum else "buton" if x in atinse else "urm" if x == top + 1 else "blocat" for x in range(N)]

    def bara_e(self, pg, atinse, acum, ce):
        b = self.bara(pg)
        a = self.asteptat(len(b), set(atinse), acum)
        self.verifica(b == a, "%s: bara %s" % (ce, "corectă" if b == a else "GREȘITĂ\n         are:      %s\n         trebuia:  %s" % (b, a)))

    def raspunde(self, pg):
        pg.evaluate("JocMotor.test.rezolva()")
        if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
            pg.click("#chk")
        return pg.locator("#fb .fb.ok").count() > 0

    def ultimul_ev(self, pg):
        return pg.evaluate("window.__evs.length?window.__evs[window.__evs.length-1]:null")

    # ---- scenariul ----
    def ruleaza(self):
        ctx, pg = self.context()
        try:
            self._lectie(pg)
            self._joc(pg)
        except Exception as e:
            self.verifica(False, "proba s-a oprit: " + str(e).splitlines()[0][:220])
        finally:
            ctx.close()
        self.verifica(not self.erori, "fără erori JavaScript (%s)" % self.erori[:2])
        return self.probleme

    def _lectie(self, pg):
        A, B, C, D, E = "e_proba_bara_a", "e_proba_bara_b", "e_proba_bara_c", "e_proba_bara_d", "e_proba_bara_e"
        # --- structura lecției ---
        self.profil(pg, A)
        self.deschide(pg)
        cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
        Lv = cfg["nivele"][0]
        n, AT, k = len(Lv["pasi"]), 1 if Lv.get("atelier") else 0, len(Lv["qs"])
        self.verifica(pg.locator("#continua").count() == 0, "A, elev nou: pe cuprins NU e „Continuă de unde ai rămas”")
        pg.click('.lvl[data-l="0"]')
        N = len(self.bara(pg))
        RE = N - n - AT - k
        self.verifica(n >= 4 and AT == 1 and RE == 1 and k >= 3, "lecția are P1..P%d, Atelier, Aplicația, Î1..Î%d (bara are %d elemente)" % (n, k, N))
        iat, ire = n, n + AT
        iq = lambda j: n + AT + RE + j - 1   # Îj (de la 1)
        tot = set(range(N))

        # --- 1. elevul A: P1 -> P3 ---
        self.bara_e(pg, [], 0, "A, elev nou, P1")
        titluri = pg.evaluate("[...document.querySelectorAll('.tabs span.blocat')].map(e=>e.title)")
        self.verifica(titluri and all(TITLU_BLOCAT in t for t in titluri), "pașii neatinși au titlul „%s”" % TITLU_BLOCAT)
        self.verifica(pg.locator('.tabs button[data-pas="0"]').count() == 0, "Î1 NU se poate apăsa la început (greșeala veche: vazut=k<=R.max)")
        pg.click("#pas-next")
        pg.click("#pas-next")
        st = self.stare(pg)
        self.verifica(st and st["phase"] == "learn" and st["si"] == 2, "A a ajuns la P3 (%s)" % st)
        self.bara_e(pg, [0, 1], 2, "A pe P3")
        ev = self.ultimul_ev(pg)
        self.verifica(ev and ev.get("cheie") == "lectie_vii_m1_l04" and ev.get("nivel") == 0 and ev.get("pas") == "p3" and ev.get("eticheta") == "P3"
                      and ev.get("titlu") == Lv["t"] and ev.get("real") is False, "lh-pas la P3: %s" % ev)
        self.verifica(pg.evaluate("!!window.__lhPas&&JSON.stringify(window.__lhPas)===JSON.stringify(window.__evs[window.__evs.length-1])"),
                      "window.__lhPas = ultimul detaliu trimis")
        s = (self.sertar(pg, A) or {}).get("lv", {}).get("0", {})
        self.verifica(s.get("ps") == [0, 1, 2] and s.get("ul") == "p3" and "qm" not in s and "re" not in s, "sertarul lui A: ps [0,1,2], ul p3, fără qm/re (%s)" % s)

        # --- 1. elevul B, pe același calculator: tot drumul până la Î2 ---
        self.profil(pg, B)
        self.deschide(pg)
        self.verifica(pg.locator("#continua").count() == 0, "B, elev nou: fără „Continuă” (nu vede drumul lui A)")
        pg.click('.lvl[data-l="0"]')
        self.bara_e(pg, [], 0, "B, elev nou, P1 (nu vede drumul lui A)")
        for _ in range(n - 1):
            pg.click("#pas-next")
        pg.click("#pas-next")   # -> atelier
        st = self.stare(pg)
        self.verifica(st and st["phase"] == "atelier", "B a ajuns la atelier")
        ev = self.ultimul_ev(pg) or {}
        self.verifica(ev.get("pas") == "atelier" and ev.get("eticheta") == "Atelier" and ev.get("real") is False, "lh-pas la atelier: %s" % ev)
        pg.click("#go")   # -> aplicația
        ev = self.ultimul_ev(pg) or {}
        et_re = pg.evaluate("document.querySelector('.tabs span.now').textContent.trim()")
        self.verifica(ev.get("pas") == "real" and ev.get("real") is True and ev.get("eticheta") == et_re, "lh-pas în aplicația adevărată: real=true, eticheta %r (%s)" % (et_re, ev))
        pg.click("#go")   # -> Î1
        self.bara_e(pg, set(range(n + AT + RE)), iq(1), "B pe Î1")
        self.verifica(self.raspunde(pg), "B: Î1 rezolvată")
        pg.click("#next")
        st = self.stare(pg)
        self.verifica(st and st["phase"] == "q" and st["qi"] == 1, "B a ajuns la Î2 (%s)" % st)
        self.bara_e(pg, set(range(iq(2))), iq(2), "B pe Î2")
        ev = self.ultimul_ev(pg) or {}
        self.verifica(ev.get("pas") == "q2" and ev.get("eticheta") == "Î2" and ev.get("nivel") == 0, "lh-pas la Î2: %s" % ev)
        s = (self.sertar(pg, B) or {}).get("lv", {}).get("0", {})
        self.verifica(s.get("qm") == 2 and s.get("re") == 1 and s.get("at") == 1 and s.get("ul") == "q2" and s.get("ps") == list(range(n)),
                      "sertarul lui B: qm 2, re 1, at 1, ul q2, toți pașii P (%s)" % {x: s.get(x) for x in ("qm", "re", "at", "ul", "ps")})
        sa = (self.sertar(pg, A) or {}).get("lv", {}).get("0", {})
        self.verifica(sa.get("ps") == [0, 1, 2] and "qm" not in sa, "sertarul lui A a rămas neatins de B")

        # --- după reîncărcare: B, apoi A ---
        self.deschide(pg)
        ev = self.ultimul_ev(pg) or {}
        self.verifica(ev.get("pas") == "cuprins" and ev.get("nivel") is None, "lh-pas pe cuprins: %s" % ev)
        c = pg.locator("#continua")
        self.verifica(c.count() == 1 and "Î2" in c.inner_text(), "B, după reîncărcare: „Continuă de unde ai rămas: Î2” (%r)" % (c.inner_text() if c.count() else None))
        pg.set_viewport_size({"width": 390, "height": 800})
        w = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
        self.verifica(w[0] <= w[1] + 1, "la 390 px, cuprinsul cu „Continuă” nu iese din ecran (%s)" % w)
        pg.set_viewport_size({"width": 1280, "height": 900})
        pg.click('.lvl[data-l="0"]')
        self.bara_e(pg, set(range(1, iq(3))), 0, "B după reîncărcare, P1")
        self.profil(pg, A)
        self.deschide(pg)
        c = pg.locator("#continua")
        self.verifica(c.count() == 1 and "P3" in c.inner_text(), "A, după reîncărcare: „Continuă de unde ai rămas: P3” (%r)" % (c.inner_text() if c.count() else None))
        pg.click('.lvl[data-l="0"]')
        self.bara_e(pg, [1, 2], 0, "A după reîncărcare, P1")
        pg.click('.tabs button[data-pas="p2"]')
        st = self.stare(pg)
        self.verifica(st and st["phase"] == "learn" and st["si"] == 2, "A: P3 din bară duce la P3")

        # --- 2. legăturile directe ---
        self.deschide(pg, q="?pas=q2")
        st = self.stare(pg)
        nota = pg.locator(".nota-pas")
        self.verifica(st and st["phase"] == "learn" and st["si"] == 2, "A, ?pas=q2 (n-a ajuns): deschide P3, cel mai îndepărtat atins (%s)" % st)
        self.verifica(nota.count() == 1 and "Î2" in nota.inner_text() and "P3" in nota.inner_text(), "A, ?pas=q2: nota spune că n-a ajuns la Î2 și că e la P3 (%r)" % (nota.inner_text() if nota.count() else None))
        self.verifica("pas=" not in pg.evaluate("location.search"), "parametrul ?pas se scoate din adresă după folosire")
        self.deschide(pg, q="?pas=p2")
        st = self.stare(pg)
        self.verifica(st and st["phase"] == "learn" and st["si"] == 1 and pg.locator(".nota-pas").count() == 0, "A, ?pas=p2 (atins): deschide P2, fără notă (%s)" % st)
        self.deschide(pg, q="?continua=1")
        st = self.stare(pg)
        self.verifica(st and st["phase"] == "learn" and st["si"] == 2, "A, ?continua=1: deschide P3 (%s)" % st)
        self.profil(pg, B)
        self.deschide(pg, q="?continua=1")
        st = self.stare(pg)
        self.verifica(st and st["phase"] == "q" and st["qi"] == 1, "B, ?continua=1: deschide Î2 (%s)" % st)
        # B termină de aici: Î2..Îk, apoi finalul îi cere Î1 (nerezolvată în deschiderea asta), apoi 3 stele
        for j in range(2, k + 1):
            self.raspunde(pg)
            if j < k:
                pg.click("#next")
        nx = pg.locator("#next")
        self.verifica(nx.count() == 1 and "Î1" in nx.inner_text(), "la ultima întrebare, finalul cere întâi Î1 (%r)" % (nx.inner_text() if nx.count() else None))
        pg.click("#next")
        st = self.stare(pg)
        self.verifica(st and st["phase"] == "q" and st["qi"] == 0, "„Mai ai de rezolvat: Î1” duce la Î1")
        self.verifica(self.raspunde(pg), "B: Î1 rezolvată")
        nx = pg.locator("#next")
        self.verifica(nx.count() == 1 and "Termină" in nx.inner_text(), "după Î1, butonul e „Termină …” (%r)" % (nx.inner_text() if nx.count() else None))
        pg.click("#next")
        st = self.stare(pg)
        self.verifica(st and st["phase"] == "end", "B a terminat lecția")
        s = (self.sertar(pg, B) or {}).get("lv", {}).get("0", {})
        self.verifica(s.get("stars") == 3 and s.get("ul") == "gata" and s.get("qm") == k, "B: 3 stele (toate răspunsurile din prima), ul gata, qm %d (%s)" % (k, {x: s.get(x) for x in ("stars", "ul", "qm")}))
        self.bara_e(pg, tot, None, "B, lecție terminată (ecranul de final)")
        ev = self.ultimul_ev(pg) or {}
        self.verifica(ev.get("pas") == "gata", "lh-pas la final: gata (%s)" % ev.get("pas"))
        self.deschide(pg)
        self.verifica(pg.locator("#continua").count() == 0, "B, lecție terminată: fără „Continuă”")
        pg.click('.lvl[data-l="0"]')
        self.bara_e(pg, tot - {0}, 0, "B, lecție terminată, redeschisă: tot apăsabil")

        # --- 3. profil activ fără sertar ---
        self.profil(pg, C)
        self.deschide(pg)
        pg.click('.lvl[data-l="0"]')
        self.bara_e(pg, [], 0, "C, profil activ FĂRĂ sertar")
        self.verifica(pg.locator(".tabs button").count() == 0, "C: nimic apăsabil în bară")

        # --- 4. date vechi ---
        self.profil(pg, D, {"nume": "", "lv": {"0": {"at": 1, "ps": [0, 1], "v": 1}}})
        self.deschide(pg)
        pg.click('.lvl[data-l="0"]')
        self.bara_e(pg, [1, iat], 0, "D, sertar vechi (doar ps:[0,1], at:1)")
        self.profil(pg, E, {"nume": "", "lv": {"0": {"stars": 2, "xp": 30}}})
        self.deschide(pg)
        pg.click('.lvl[data-l="0"]')
        self.bara_e(pg, tot - {0}, 0, "E, sertar vechi terminat (doar stele)")

    def _joc(self, pg):
        # jocurile: ?pas=p2&nivel=N (N de la 1), ?recitire=1 neatins
        cheie = "jocuri_grafica_v"
        self.profil(pg, "e_proba_bara_g", cheie=cheie)
        self.deschide(pg, JOC)
        cfg = pg.evaluate("JSON.parse(JSON.stringify(JocMotor.test.config(),(k,v)=>typeof v==='function'?'[fn]':v))")
        cheie = cfg["cheie"]
        li = next((i for i, lv in enumerate(cfg["nivele"]) if i >= 1 and lv.get("pasi") and len(lv["pasi"]) >= 3), None)
        if li is None:
            self.verifica(False, "jocul %s nu are un nivel ≥2 cu pași" % JOC)
            return
        lv = {str(i): {"stars": 3, "xp": 50} for i in range(li)}
        lv[str(li)] = {"pn": len(cfg["nivele"][li]["pasi"]), "ps": [0, 1], "v": 1}
        self.profil(pg, "e_proba_bara_g", {"nume": "", "lv": lv}, cheie=cheie)
        self.deschide(pg, JOC, "?pas=p2&nivel=%d" % (li + 1))
        st = self.stare(pg)
        self.verifica(st and st["li"] == li and st["phase"] == "learn" and st["si"] == 1, "joc, ?pas=p2&nivel=%d: nivelul %d, P2 (%s)" % (li + 1, li + 1, st))
        self.bara_e(pg, [0], 1, "joc, nivelul %d deschis la P2" % (li + 1))
        self.deschide(pg, JOC, "?pas=q1&nivel=%d" % (li + 1))
        st = self.stare(pg)
        self.verifica(st and st["li"] == li and st["phase"] == "learn" and st["si"] == 1 and pg.locator(".nota-pas").count() == 1,
                      "joc, ?pas=q1 neatins: P2, cu notă (%s)" % st)
        self.deschide(pg, JOC, "?recitire=1")
        self.verifica(pg.locator(".recitire-banda").count() == 1 and pg.locator(".tabs [data-rpas]").count() >= 1 and self.stare(pg)["phase"] == "learn",
                      "?recitire=1 merge ca înainte (banda de recitire, pașii din bară)")


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


class Server(http.server.ThreadingHTTPServer):
    def handle_error(self, request, client_address):
        pass   # browserul închide conexiuni la fiecare navigare: fără urme pe ecran


def server():
    srv = Server(("127.0.0.1", 0), functools.partial(Tacut, directory=str(LH)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mutanti", action="store_true")
    a = ap.parse_args()
    srv = server()
    baza = "http://127.0.0.1:%d" % srv.server_address[1]
    spre_server, externe = [], []
    try:
        with sync_playwright() as p:
            br = p.chromium.launch(args=["--mute-audio"])
            print("Proba pe motor.js (%s)" % baza)
            P = Proba(br, baza)
            prob = P.ruleaza()
            spre_server += P.spre_server
            externe += P.externe
            scapati = 0
            if a.mutanti:
                txt = MOTOR.read_text(encoding="utf-8")
                print("Mutanții (fiecare = proba întreagă pe o copie stricată a motorului)")
                for nume, din, in_ in MUTANTI:
                    if txt.count(din) != 1:
                        print("  RĂU  %s: textul de mutat apare de %d ori" % (nume, txt.count(din)))
                        scapati += 1
                        continue
                    M = Proba(br, baza, txt.replace(din, in_), tacut=True)
                    pm = M.ruleaza()
                    spre_server += M.spre_server
                    externe += M.externe
                    prins = bool([x for x in pm if not x.startswith("proba s-a oprit")])
                    print(("  ok   " if prins else "  RĂU  ") + "%s: %s (%s)" % (nume, "prins" if prins else "SCĂPAT", ("; ".join(pm[:2]) or "nicio verificare picată")[:200].replace("\n", " ")), flush=True)
                    scapati += not prins
            br.close()
    finally:
        srv.shutdown()
        srv.server_close()
    print("cereri spre teste-vasile.netlify.app oprite în browser: %d (plecate: 0, ruta le abandonează); alte cereri externe oprite: %d"
          % (len(spre_server), len(externe) - len(spre_server)))
    if a.mutanti:
        print("Rezultat: %d verificări picate pe motorul adevărat; mutanți neprinși: %d" % (len(prob), scapati))
        print(scapati + len(prob))
    else:
        print("Rezultat: " + ("TOATE OK" if not prob else "; ".join(x.split("\n")[0] for x in prob)[:600]))
        print(len(prob))


if __name__ == "__main__":
    main()
