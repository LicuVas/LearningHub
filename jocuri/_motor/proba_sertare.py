"""Proba PROGRESULUI PE ELEV: lista „Cine lucrează acum?” pe calculatorul comun + progresul online (26.09.2026).

  python proba_sertare.py [--baza URL] [--nor-real]

Fără --baza pornește un server local pe folderul site-ului. Evidența activității e simulată (nu pleacă nimic).
Progresul online (/api/progres) e simulat de un server în memorie cu ACEEAȘI regulă de unire ca progres.mjs;
cu --nor-real merge pe teste-vasile.netlify.app (nume de probă unice la fiecare rulare).
Scenariul:
  1. Ana joacă nivelul 1 NEÎNSCRISĂ, apoi se înscrie (cu cod) -> își păstrează nivelul (primul elev moștenește)
  2. „Nu ești tu? Alege-te din listă” -> lista are Ana -> „Nu sunt în listă” -> Bogdan, de la zero; face 2 niveluri
  3. alegerea din listă: Ana -> doar nivelul ei; Bogdan -> cele 2 ale lui. NIMIC nu se șterge la schimbare
  4. AL DOILEA calculator: Bogdan se înscrie cu același nume + cod -> are cele 2 niveluri; face al 3-lea
  5. înapoi pe primul: Bogdan ales din listă -> are 3 niveluri (a venit al 3-lea de pe celălalt)
  6. pe al doilea calculator, Ana cu cod GREȘIT -> pornește de la zero (nu primește progresul nimănui)
  7. lecțiile: cheia de progres diferă între elevi
Ultima linie = numărul de probleme.
"""
import argparse
import functools
import http.server
import json
import secrets
import sys
import threading
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

SITE = Path(__file__).resolve().parents[2]
JOC = "excel-viii"
LECTIE = "/content/tic/cls5/m1-sisteme/lectia1-calculator.html"
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
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8770), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return "http://127.0.0.1:8770"


# ---- serverul de progres simulat: aceeași unire ca netlify/functions/progres.mjs ----
NOR = {}


def uneste(a, b):
    if not a:
        return b
    if not b:
        return a
    try:
        x, y = json.loads(a["v"]), json.loads(b["v"])
    except Exception:
        x = y = None
    if isinstance(x, dict) and isinstance(y, dict) and isinstance(x.get("lv"), dict) and isinstance(y.get("lv"), dict):
        nou, vechi = (y, x) if b.get("u", 0) >= a.get("u", 0) else (x, y)
        lv = dict(vechi["lv"])
        for i, l in nou["lv"].items():
            p = lv.get(i)
            lv[i] = {**p, **l, "stars": max(p.get("stars", 0), l.get("stars", 0)), "xp": max(p.get("xp", 0), l.get("xp", 0))} if p else l
        o = {**vechi, **nou, "lv": lv, "nume": nou.get("nume") or vechi.get("nume") or ""}
        return {"v": json.dumps(o, ensure_ascii=False), "u": max(a.get("u", 0), b.get("u", 0))}
    return b if b.get("u", 0) >= a.get("u", 0) else a


def nor_simulat(route):
    b = json.loads(route.request.post_data or "{}")
    pe = NOR.setdefault(b["h"], {})
    if b.get("op") == "scrie":
        for k, x in (b.get("date") or {}).items():
            pe[k] = uneste(pe.get(k), x)
    route.fulfill(status=200, body=json.dumps({"ok": True, "date": pe}), headers={"access-control-allow-origin": "*", "content-type": "application/json"})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza")
    ap.add_argument("--nor-real", action="store_true")
    a = ap.parse_args()
    baza = (a.baza or server_local()).rstrip("/")
    sufix = secrets.token_hex(3)
    ANA, BOGDAN = "Ana Proba" + sufix, "Bogdan Proba" + sufix
    print("Proba progresului pe elev pe", baza, "(nor real)" if a.nor_real else "(nor simulat)")
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch()
        erori = []

        def calculator():
            ctx = br.new_context(viewport={"width": 1366, "height": 800})
            ctx.route("**/api/activitate", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
            if not a.nor_real:
                ctx.route("**/api/progres", nor_simulat)
            pg = ctx.new_page()
            pg.on("pageerror", lambda e: erori.append(str(e)))
            return pg

        joc = "%s/jocuri/%s/index.html" % (baza, JOC)

        def deschide(pg, url):
            pg.goto(url, wait_until="load")
            pg.wait_for_function("window.Prezenta&&document.getElementById('lhp')", timeout=15000)

        def niveluri(pg):
            return pg.evaluate("Object.keys(JSON.parse(localStorage.getItem((()=>{const k=JocMotor.test.config().cheie,p=localStorage.getItem('learninghub_active_profile');return p&&p.charAt(0)!=='_'?k+'@'+p:k})()))?.lv||{}).map(Number).sort()")

        def joaca(pg, li):
            pg.click('.lvl[data-l="%d"]' % li); pg.click("#go")
            for _ in range(pg.evaluate("JocMotor.test.config().nivele[%d].qs.length" % li)):
                pg.evaluate("JocMotor.test.rezolva()")
                if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                    pg.click("#chk")
                pg.click("#next")
            pg.click("#toc")

        def inscrie(pg, nume, cod="4827"):
            pg.wait_for_selector("#lhp-s", timeout=10000)
            pg.wait_for_function("document.querySelectorAll('#lhp-s option').length>2", timeout=15000)
            pg.select_option("#lhp-s", "forestier"); pg.select_option("#lhp-c", "X E"); pg.fill("#lhp-n", nume); pg.fill("#lhp-k", cod)
            with pg.expect_navigation(timeout=20000):
                pg.click("#lhp-ok")
            pg.wait_for_function("window.Prezenta&&document.getElementById('lhp-pill')", timeout=15000)

        def din_lista(pg, nume, schimba=True):
            if schimba:
                pg.click("#lhp-pill"); pg.click("#lhp-alt")
            pg.wait_for_selector("#lhp-lista", timeout=5000)
            with pg.expect_navigation(timeout=20000):
                pg.locator("#lhp-lista .el", has_text=nume).click()
            pg.wait_for_function("window.Prezenta&&document.getElementById('lhp-pill')", timeout=15000)

        pc1 = calculator()
        print("1. Ana joacă neînscrisă, apoi se înscrie")
        deschide(pc1, joc)
        pc1.evaluate("localStorage.clear()")
        deschide(pc1, joc)
        joaca(pc1, 0)
        verifica(niveluri(pc1) == [0], "neînscrisă: nivelul 1 făcut")
        pc1.click("#lhp-cine")
        inscrie(pc1, ANA)
        verifica(niveluri(pc1) == [0], "după înscriere Ana își păstrează nivelul 1 (%s)" % niveluri(pc1))
        verifica(pc1.evaluate("(localStorage.getItem('learninghub_active_profile')||'').startsWith('e_')"), "primul elev are și el sertarul lui (profil e_…)")

        print("2. „Nu ești tu? Alege-te din listă” -> Bogdan, de la zero")
        pc1.wait_for_selector("#alt-elev", timeout=8000)
        verifica("Alege-te" in pc1.inner_text("#alt-elev"), "butonul din joc nu mai spune „încep de la zero” (%r)" % pc1.inner_text("#alt-elev"))
        pc1.click("#alt-elev")
        pc1.wait_for_selector("#lhp-lista", timeout=5000)
        verifica(ANA in pc1.inner_text("#lhp-lista"), "lista calculatorului o are pe Ana")
        pc1.click("#lhp-nou")
        inscrie(pc1, BOGDAN)
        verifica(niveluri(pc1) == [], "Bogdan pornește de la zero (%s)" % niveluri(pc1))
        joaca(pc1, 0); joaca(pc1, 1)
        verifica(niveluri(pc1) == [0, 1], "Bogdan: nivelurile 1 și 2")
        pc1.evaluate("Prezenta.salveaza()"); pc1.wait_for_timeout(1500)

        print("3. alegere din listă, fără ștergeri")
        din_lista(pc1, ANA)
        verifica(niveluri(pc1) == [0], "Ana aleasă din listă: DOAR nivelul ei (%s)" % niveluri(pc1))
        din_lista(pc1, BOGDAN)
        verifica(niveluri(pc1) == [0, 1], "Bogdan ales din listă: nivelurile lui (%s)" % niveluri(pc1))

        print("4. al doilea calculator: Bogdan cu același cod")
        pc2 = calculator()
        deschide(pc2, joc)
        pc2.click("#lhp-cine")
        inscrie(pc2, BOGDAN)
        verifica(niveluri(pc2) == [0, 1], "pe PC2 Bogdan are nivelurile de pe PC1 (%s)" % niveluri(pc2))
        joaca(pc2, 2)
        pc2.evaluate("Prezenta.salveaza()"); pc2.wait_for_timeout(2000)

        print("5. înapoi pe primul calculator")
        din_lista(pc1, ANA)
        din_lista(pc1, BOGDAN)
        verifica(niveluri(pc1) == [0, 1, 2], "pe PC1 Bogdan are și nivelul făcut pe PC2 (%s)" % niveluri(pc1))

        print("6. cod greșit")
        pc2.click("#lhp-pill"); pc2.click("#lhp-alt"); pc2.click("#lhp-nou")
        inscrie(pc2, ANA, cod="1111")
        verifica(niveluri(pc2) == [], "Ana cu cod greșit pe PC2: de la zero, nimic străin (%s)" % niveluri(pc2))

        print("7. lecțiile, pe profilul elevului")
        deschide(pc1, baza + LECTIE)
        kb = pc1.evaluate("typeof AtomicLearning!=='undefined'&&AtomicLearning.getStorageKey()")
        din_lista(pc1, ANA)
        ka = pc1.evaluate("typeof AtomicLearning!=='undefined'&&AtomicLearning.getStorageKey()")
        verifica(bool(ka) and bool(kb) and ka != kb, "cheia lecției diferă: Ana %r, Bogdan %r" % (ka, kb))
        if not a.nor_real:
            # progresul lecției (profilul stă la MIJLOCUL cheii) pleacă și el online, sub forma generică ~P
            pc1.evaluate("k=>{localStorage.setItem(k,JSON.stringify({pas:3}));Prezenta.salveaza()}", ka)
            pc1.wait_for_timeout(1500)
            generic = ka.replace(pc1.evaluate("localStorage.getItem('learninghub_active_profile')"), "~P")
            verifica(any(generic in d for d in NOR.values()), "progresul lecției a urcat online ca %r" % generic)
        verifica(not erori, "fără erori JavaScript %s" % erori[:3])
        br.close()
    print("Rezultat: " + ("TOATE OK" if not probleme else "; ".join(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
