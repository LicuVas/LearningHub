"""Proba UNIRII LA VEDERE Forestier + Transporturi (23.10.2026; AI_0\\projects\\teste-elevi\\contracte\\2026-10-23_unire_ctt_la_vedere).

  python proba_unire_ctt.py [--baza https://learninghub-8z6.pages.dev] [--vechi 84f61371]

El: „sa unim cele doua unitati (Forestier si auto) in una singura - Colegiul Tehnic de Transporturi”; „Da, A” = doar la
vedere: elevul vede o școală, clasa își păstrează CHEIA veche (școala intră în amprenta codului). Verifică, ca un elev:
  R1  „Cine ești?”: o singură școală CTT, niciun „Forestier”, sub ea exact cele 10 clase
  R2  la fiecare din cele 10 clase, amprenta cerută serverului („stare”) = cea calculată AICI cu cheia veche (5 × forestier,
      5 × transporturi) și diferită de cea cu cheia gazdei; elevul salvat pe aparat are cheia veche și numele CTT
  R3  elevul salvat de versiunea veche (forestier · XII C): corectura arată CTT + XII C, „Salvează” fără schimbări =
      „N-ai schimbat nimic”, nicio cerere „redenumeste” (progresul nu se mută)
  R4  „Altă clasă” scrisă de mână („a XII-a C”) sub CTT -> forestier; „Altă școală” + „Liceul Forestier, Piatra Neamț” ->
      formularul alege CTT + XII C, iar a doua apăsare pleacă cu forestier
  R5  „Mi-am uitat codul” din formular: cererea pleacă cu școala forestier și amprenta ei
  R6  diploma („Trimite diploma profesorului”): CTT, fără Forestier; X E pleacă cu forestier; pagina de păreri: CTT cu 10 clase
  R8  prezenta.js VECHI (din git, --vechi) + datele noi: arată ca înainte două școli, iar Forestier · XII C are aceeași amprentă
TOATE cererile POST sunt prinse și oprite în browser (nimic spre serverul viu). Fără --baza: server local pe LearningHub.
Ultima linie = numărul de probleme.
"""
import argparse
import functools
import hashlib
import http.server
import json
import re
import subprocess
import sys
import threading
import time
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, r"C:\00\AI_0\tools")
import litere  # noqa: E402  (aceeași scoatere a diacriticelor ca prezenta.js faraDiacritice)

LH = Path(__file__).resolve().parents[2]
LECTIE = "/content/tic/cls5/index.html"
JOC = "/jocuri/excel-viii/index.html"
CTT = "Colegiul Tehnic de Transporturi"
FORESTIER = ["X E", "XI C", "XI D", "XII C", "XII D"]
TRANSPORTURI = ["X B", "Anul I F (Maiștri)", "I A AMG", "I B AMG", "II C AMF"]
NUME, COD = "Popescu Ana-Maria", "4827"
probleme = []


def verifica(cond, ce):
    print(("  ok   " if cond else "  RĂU  ") + ce)
    if not cond:
        probleme.append(ce)


def n(s):   # = prezenta.js amprenta() n()
    return re.sub(r"[^a-z0-9]+", " ", litere.fara_diacritice(s or "").lower()).strip()


def amprenta(scoala, clasa, nume, cod):   # = prezenta.js amprenta(), calculată separat
    sir = "lh-progres|%s|%s|%s|%s" % (scoala, re.sub(r"^a ", "", n(clasa)), " ".join(sorted(n(nume).split())), cod)
    return hashlib.sha256(sir.encode("utf-8")).hexdigest()


class _Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):   # fără un rând pe fiecare fișier servit
        pass


def server_local():
    h = functools.partial(_Tacut, directory=str(LH))
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8768), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return "http://127.0.0.1:8768"


def context(br, prez_vechi=None, eu=None, lat=390):
    """context nou: cererile POST notate și oprite; prez_vechi = textul unui prezenta.js vechi pus în locul celui servit"""
    ctx = br.new_context(viewport={"width": lat, "height": 844})
    cereri = []

    def ruta(r):
        if r.request.method == "POST":
            try:
                cereri.append((r.request.url, json.loads(r.request.post_data or "{}")))
            except ValueError:
                cereri.append((r.request.url, {}))
            return r.abort()
        if prez_vechi is not None and r.request.url.split("?")[0].endswith("/assets/js/prezenta.js"):
            return r.fulfill(status=200, content_type="application/javascript", body=prez_vechi)
        return r.continue_()
    ctx.route("**/*", ruta)
    if eu:
        ctx.add_init_script("try{localStorage.setItem('lh_prezenta', %s)}catch(e){}" % json.dumps(json.dumps(eu)))
    return ctx, cereri


def formular(br, baza, **k):
    ctx, cereri = context(br, **k)
    pg = ctx.new_page()
    pg.goto(baza + LECTIE, wait_until="load")
    pg.wait_for_selector("#lhp-cine, #lhp-nimeni, #lhp-cere", timeout=15000)
    pg.click(next(s for s in ("#lhp-cine", "#lhp-nimeni", "#lhp-cere") if pg.locator(s).count()))
    if pg.locator("#lhp-nou").count():
        pg.click("#lhp-nou")
    pg.wait_for_function("document.querySelectorAll('#lhp-s option').length > 1", timeout=15000)
    return ctx, pg, cereri


def asteapta(cereri, op, sec=8):
    t = time.time()
    while time.time() - t < sec:
        x = [c for _, c in cereri if c.get("op") == op]
        if x:
            return x[0]
        time.sleep(0.2)
    return None


def optiuni(pg, sel):
    return pg.eval_on_selector_all(sel + " option", "o => o.map(x => [x.value, x.textContent.trim()])")


def inscrie(pg, cereri, clasa=None, scris=None):
    """CTT + clasa (sau „Altă clasă” scrisă de mână) + nume + cod -> Gata; întoarce cererea „stare” (amprenta)"""
    pg.select_option("#lhp-s", "transporturi")
    if scris:
        pg.select_option("#lhp-c", "__alta")
        pg.fill("#lhp-cx", scris)
    else:
        pg.select_option("#lhp-c", clasa)
    pg.fill("#lhp-n", NUME)
    pg.fill("#lhp-k", COD)
    pg.click("#lhp-ok")
    return asteapta(cereri, "stare")


def eu_salvat(pg):
    try:
        pg.wait_for_function("(JSON.parse(localStorage.getItem('lh_prezenta')||'{}')).h", timeout=8000)
    except Exception:
        return {}
    return pg.evaluate("JSON.parse(localStorage.getItem('lh_prezenta')||'{}')")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza")
    ap.add_argument("--vechi", default="84f61371", help="commitul cu prezenta.js de dinainte de unire (cel publicat pe 23.10 la 13:40)")
    a = ap.parse_args()
    baza = (a.baza or server_local()).rstrip("/")
    vechi = subprocess.run(["git", "-C", str(LH), "show", "%s:assets/js/prezenta.js" % a.vechi], capture_output=True,
                           text=True, encoding="utf-8").stdout
    from playwright.sync_api import sync_playwright
    print("Unirea CTT la vedere, pe", baza)
    with sync_playwright() as p:
        br = p.chromium.launch()

        print("R1 formularul „Cine ești?”")
        ctx, pg, _ = formular(br, baza)
        sc = [t for v, t in optiuni(pg, "#lhp-s") if v not in ("", "alta")]
        verifica(sum(CTT in t for t in sc) == 1 and not any("Forestier" in t for t in sc), "o singură școală CTT, fără Forestier: %s" % sc)
        pg.select_option("#lhp-s", "transporturi")
        cl = sorted(v for v, _ in optiuni(pg, "#lhp-c") if v not in ("", "__alta"))
        verifica(cl == sorted(FORESTIER + TRANSPORTURI), "sub CTT exact cele 10 clase: %s" % cl)
        ctx.close()

        print("R2 cheia veche, la fiecare clasă (amprenta cerută serverului)")
        for c in FORESTIER + TRANSPORTURI:
            cheie, alta = ("forestier", "transporturi") if c in FORESTIER else ("transporturi", "forestier")
            ctx, pg, cereri = formular(br, baza)
            st = inscrie(pg, cereri, clasa=c) or {}
            e = eu_salvat(pg)
            verifica(st.get("h") == amprenta(cheie, c, NUME, COD) != amprenta(alta, c, NUME, COD)
                     and e.get("scoala") == cheie and e.get("scoalaNume") == CTT and e.get("h") == st.get("h"),
                     "%s -> %s (amprenta %s…, salvat: %s · %s)" % (c, cheie, (st.get("h") or "-")[:8], e.get("scoala"), e.get("scoalaNume")))
            ctx.close()

        print("R3 elevul salvat de versiunea veche: corectura nu mută nimic")
        H = amprenta("forestier", "XII C", NUME, COD)
        eu = {"id": "proba" + "0" * 27, "scoala": "forestier", "scoalaNume": "Liceul Forestier", "clasa": "XII C", "nume": NUME,
              "numeEnc": "x", "h": H, "ultima": int(time.time() * 1000)}
        ctx, cereri = context(br, eu=eu)
        pg = ctx.new_page()
        pg.goto(baza + LECTIE, wait_until="load")
        pg.wait_for_function("window.Prezenta && Prezenta.identitate && Prezenta.identitate()", timeout=15000)
        pg.evaluate("Prezenta.formular({cod: '%s'})" % COD)
        pg.wait_for_function("document.querySelectorAll('#lhp-s option').length > 1 && document.getElementById('lhp-n').value", timeout=15000)
        verifica(pg.input_value("#lhp-s") == "transporturi" and pg.input_value("#lhp-c") == "XII C",
                 "corectura arată CTT + XII C (%s · %s)" % (pg.input_value("#lhp-s"), pg.input_value("#lhp-c")))
        pg.click("#lhp-ok")
        pg.wait_for_timeout(600)
        mesaj = pg.inner_text("#lhp-e")
        e = pg.evaluate("JSON.parse(localStorage.getItem('lh_prezenta')||'{}')")
        verifica("N-ai schimbat nimic" in mesaj and not [c for _, c in cereri if c.get("op") == "redenumeste"]
                 and e.get("h") == H and e.get("scoala") == "forestier",
                 "„Salvează” fără schimbări: %r, 0 cereri redenumeste, amprenta și cheia neschimbate" % mesaj[:60])
        ctx.close()

        print("R4 clasa scrisă de mână; „Altă școală” cu „Liceul Forestier”")
        ctx, pg, cereri = formular(br, baza)
        st = inscrie(pg, cereri, scris="a XII-a C") or {}
        verifica(st.get("h") == amprenta("forestier", "XII C", NUME, COD), "„Altă clasă” „a XII-a C” sub CTT -> forestier")
        ctx.close()
        ctx, pg, cereri = formular(br, baza)
        pg.select_option("#lhp-s", "alta")
        pg.fill("#lhp-as", "Liceul Forestier")
        pg.fill("#lhp-al", "Piatra Neamț")
        pg.fill("#lhp-ac", "a XII-a C")
        pg.fill("#lhp-n", NUME)
        pg.fill("#lhp-k", COD)
        pg.click("#lhp-ok")
        pg.wait_for_timeout(500)
        mesaj = pg.inner_text("#lhp-e")
        verifica(CTT in mesaj and "XII C" in mesaj and pg.input_value("#lhp-s") == "transporturi" and pg.input_value("#lhp-c") == "XII C",
                 "formularul propune CTT + XII C: %r" % mesaj[:90])
        pg.click("#lhp-ok")
        st = asteapta(cereri, "stare") or {}
        verifica(st.get("h") == amprenta("forestier", "XII C", NUME, COD), "a doua apăsare pleacă cu forestier")
        ctx.close()

        print("R5 „Mi-am uitat codul” din formular")
        ctx, pg, cereri = formular(br, baza)
        pg.select_option("#lhp-s", "transporturi")
        pg.select_option("#lhp-c", "XII C")
        pg.fill("#lhp-n", NUME)
        pg.click("#lhp-uitat")
        pg.wait_for_selector("#lhp-n1", timeout=10000)
        pg.fill("#lhp-n1", "5555")
        pg.fill("#lhp-n2", "5555")
        pg.click("#lhp-trimite")
        c = asteapta(cereri, "cerere") or {}
        verifica(c.get("scoala") == "forestier" and c.get("clasa") == "XII C" and c.get("h") == amprenta("forestier", "XII C", NUME, "5555"),
                 "cererea pleacă cu forestier · XII C și amprenta ei (%s)" % c.get("scoala"))
        ctx.close()

        print("R6 diploma și pagina de păreri")
        ctx, cereri = context(br, lat=1366)
        pg = ctx.new_page()
        pg.goto(baza + JOC, wait_until="load")
        pg.evaluate("localStorage.clear()")
        pg.reload(wait_until="load")
        pg.wait_for_function("window.JocMotor && JocMotor.test", timeout=15000)
        pg.evaluate("JocMotor.test.deblocheaza()")
        pg.reload(wait_until="load")
        pg.click("#dipl")
        pg.wait_for_selector("#d-nume")
        pg.fill("#d-nume", NUME)
        pg.wait_for_function("document.querySelectorAll('#d-scoala option').length>2", timeout=10000)
        sc = [t for v, t in optiuni(pg, "#d-scoala") if v]
        verifica(sum(CTT in t for t in sc) == 1 and not any("Forestier" in t for t in sc), "diploma: o școală CTT, fără Forestier")
        pg.select_option("#d-scoala", "transporturi")
        pg.select_option("#d-clasa", "X E")
        pg.click("#d-trimite")
        t0 = time.time()
        while time.time() - t0 < 8 and not [u for u, _ in cereri if "/api/diploma" in u]:
            time.sleep(0.2)
        d = [c for u, c in cereri if "/api/diploma" in u]
        verifica(bool(d) and d[0].get("scoala") == "forestier" and d[0].get("clasa") == "X E", "diploma de la X E pleacă cu forestier (%s)" % (d[0].get("scoala") if d else "-"))
        pg.goto(baza + "/hub/feedback.html", wait_until="load")
        pg.wait_for_function("[...document.querySelectorAll('#school option')].some(o => o.value.includes('Transporturi'))", timeout=10000)
        sc = [t for _, t in optiuni(pg, "#school")]
        pg.select_option("#school", CTT)
        cl = [v for v, _ in optiuni(pg, "#classSelect") if v and v != "Alta"]
        verifica(sum(CTT in t for t in sc) == 1 and not any("Forestier" in t for t in sc) and sorted(cl) == sorted(FORESTIER + TRANSPORTURI),
                 "pagina de păreri: CTT cu cele 10 clase, fără Forestier (%d clase)" % len(cl))
        ctx.close()

        print("R8 prezenta.js VECHI (%s) cu datele noi" % a.vechi)
        if not vechi:
            verifica(False, "nu găsesc prezenta.js la commitul %s" % a.vechi)
        else:
            ctx, pg, cereri = formular(br, baza, prez_vechi=vechi)
            sc = [t for v, t in optiuni(pg, "#lhp-s") if v not in ("", "alta")]
            pg.select_option("#lhp-s", "forestier")
            pg.select_option("#lhp-c", "XII C")
            pg.fill("#lhp-n", NUME)
            pg.fill("#lhp-k", COD)
            pg.click("#lhp-ok")
            st = asteapta(cereri, "stare") or {}
            verifica(any("Forestier" in t for t in sc) and st.get("h") == amprenta("forestier", "XII C", NUME, COD),
                     "versiunea veche arată tot două școli, iar Forestier · XII C are aceeași amprentă")
            ctx.close()
        br.close()
    print(len(probleme))
    sys.exit(1 if probleme else 0)


if __name__ == "__main__":
    main()
