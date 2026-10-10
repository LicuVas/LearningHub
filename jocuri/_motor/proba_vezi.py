# -*- coding: utf-8 -*-
r"""Proba legăturii ?vezi=pN pe LECȚII (10.10.2026, cerută de sesiunea „Cum fac…?”): pasul de învățat N, doar citire.

Verifică, în Chromium, pe motor.js adevărat (rețeaua doar 127.0.0.1 — regula 24; /api/* abandonate și numărate):
  - lecție ?vezi=p3 -> recitire la pasul 3 („pasul 3 din N”), banda „Recitire — nu se notează” cu „Cuprinsul lecției”,
    parametrul scos din adresă, prezenta.js NEîncărcat, nicio cheie nouă în localStorage (sertarul neatins), fără profil;
  - ?vezi=p99 / ?vezi=x -> încărcare obișnuită (fără recitire);
  - joc ?vezi=p2 -> ignorat (încărcare obișnuită); joc ?recitire=1 -> recitirea veche, neschimbată („Cuprinsul jocului”).
Controlul: --mutanti servește motor.js cu ?vezi ignorat și cu parametrul lăsat în adresă — proba trebuie să pice.
Ultima linie = UN număr (0 = curat).
"""
import argparse
import functools
import http.server
import sys
import threading
from pathlib import Path
from urllib.parse import urlsplit

sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright  # noqa: E402

MOTOR_DIR = Path(__file__).resolve().parent
LH = MOTOR_DIR.parents[1]
MOTOR = MOTOR_DIR / "motor.js"
LECTIE = "lectii/v/m1-l03/"
JOC = "jocuri/excel-viii/index.html"
MUTANTI = [
    ("M1 ?vezi ignorat pe lecții", "RECITIRE=eLectie()?paramVezi():paramRecitire();", "RECITIRE=eLectie()?null:paramRecitire();"),
    ("M2 parametrul rămâne în adresă", "VEZI_SI=N-1;q.delete('vezi');", "VEZI_SI=N-1;"),
    ("M3 pornește tot de la primul pas", "si:Math.min(VEZI_SI,Lv.pasi.length-1)", "si:0"),
]


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def ruleaza(br, baza, motor_txt=None, tacut=False):
    probleme, externe, erori, prezenta = [], [], [], []

    def verifica(c, ce, det=""):
        if not tacut:
            print(("  ok   " if c else "  RĂU  ") + ce + (("  — " + str(det)[:300]) if det and not c else ""), flush=True)
        if not c:
            probleme.append(ce)

    def ruta(r):
        s = urlsplit(r.request.url)
        if s.hostname not in ("127.0.0.1", "localhost"):
            externe.append(r.request.url)
            return r.abort()
        if s.path.endswith("/assets/js/prezenta.js"):
            prezenta.append(r.request.url)
        if motor_txt is not None and s.path.endswith("/jocuri/_motor/motor.js"):
            return r.fulfill(status=200, headers={"content-type": "application/javascript; charset=utf-8"}, body=motor_txt)
        return r.continue_()

    ctx = br.new_context()
    ctx.route("**/*", ruta)
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: erori.append(str(e)))
    stare = "({banda:(document.querySelector('.recitire-banda')||{innerText:''}).innerText,eyebrow:(document.querySelector('.eyebrow')||{innerText:''}).innerText,"\
            "search:location.search,ls:Object.keys(localStorage).sort(),pasi:(window.JocMotor&&JocMotor.test.config().nivele[0].pasi||[]).length})"
    try:
        # 1) lecția, ?vezi=p3, fără profil
        pg.goto(baza + "/__gol_404")
        pg.evaluate("localStorage.clear()")
        pg.goto(baza + "/" + LECTIE + "?vezi=p3")
        pg.wait_for_function("window.JocMotor&&JocMotor.test&&JocMotor.test.config()", timeout=15000)
        pg.wait_for_timeout(700)
        s = pg.evaluate(stare)
        verifica("Recitire" in s["banda"] and "nu se notează" in s["banda"] and "Cuprinsul lecției" in s["banda"],
                 "lecție ?vezi=p3: banda „Recitire — nu se notează” cu „Cuprinsul lecției”", s["banda"])
        verifica(("pasul 3 din %d" % s["pasi"]) in s["eyebrow"].lower(),   # eticheta e cu majuscule din CSS
                 "lecție ?vezi=p3: deschis direct la pasul 3", s["eyebrow"])
        verifica("vezi" not in s["search"], "parametrul ?vezi scos din adresă după folosire", s["search"])
        verifica(not prezenta, "prezenta.js NU se încarcă în recitire (nu intră în evidența activității)", prezenta[:1])
        verifica(not [k for k in s["ls"] if k.startswith("lectie_") or k.startswith("lh_prezenta")], "sertarul neatins (nicio cheie de lecție / înscriere)", s["ls"])
        # 2) ?vezi=p99 și ?vezi=x: încărcare obișnuită
        for q in ("p99", "x"):
            pg.goto(baza + "/" + LECTIE + "?vezi=" + q)
            pg.wait_for_function("window.JocMotor&&JocMotor.test&&JocMotor.test.config()", timeout=15000)
            pg.wait_for_timeout(500)
            s = pg.evaluate(stare)
            verifica(not s["banda"], "lecție ?vezi=%s: încărcare obișnuită (fără recitire)" % q, s["banda"])
        # 3) jocul: ?vezi ignorat; ?recitire=1 ca înainte
        pg.goto(baza + "/" + JOC + "?vezi=p2")
        pg.wait_for_function("window.JocMotor&&JocMotor.test&&JocMotor.test.config()", timeout=15000)
        pg.wait_for_timeout(500)
        verifica(not pg.evaluate(stare)["banda"], "joc ?vezi=p2: ignorat (încărcare obișnuită)")
        pg.goto(baza + "/" + JOC + "?recitire=1")
        pg.wait_for_function("window.JocMotor&&JocMotor.test&&JocMotor.test.config()", timeout=15000)
        pg.wait_for_timeout(500)
        s = pg.evaluate(stare)
        verifica("Cuprinsul jocului" in s["banda"] and "nu deschide nivelul" in s["banda"] and "pasul 1 din" in s["eyebrow"].lower(),
                 "joc ?recitire=1: recitirea veche, neschimbată", (s["banda"], s["eyebrow"]))
    except Exception as e:
        verifica(False, "proba s-a oprit: " + str(e).splitlines()[0][:200])
    finally:
        ctx.close()
    verifica(not erori, "0 erori JS", erori[:2])
    # regula 24: tot ce nu e 127.0.0.1 e ABANDONAT de rută (fonturile Google); scurgere = o cerere spre /api/ (evidența, progresul)
    verifica(not [u for u in externe if "/api/" in u], "nicio cerere spre /api/ (regula 24; %d cereri externe abandonate)" % len(externe), externe[:2])
    return probleme


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mutanti", action="store_true")
    a = ap.parse_args()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=str(LH)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    baza = "http://127.0.0.1:%d" % srv.server_address[1]
    scapati = 0
    try:
        with sync_playwright() as p:
            br = p.chromium.launch(args=["--mute-audio"])
            print("Proba ?vezi=pN pe lecții (%s)" % baza)
            prob = ruleaza(br, baza)
            if a.mutanti:
                txt = MOTOR.read_text(encoding="utf-8")
                for nume, din, in_ in MUTANTI:
                    if txt.count(din) != 1:
                        print("  RĂU  %s: textul de mutat apare de %d ori" % (nume, txt.count(din)))
                        scapati += 1
                        continue
                    pm = ruleaza(br, baza, motor_txt=txt.replace(din, in_), tacut=True)
                    prins = bool([x for x in pm if not x.startswith("proba s-a oprit")])
                    print(("  ok   " if prins else "  RĂU  ") + "%s: %s" % (nume, "prins" if prins else "SCĂPAT"), flush=True)
                    scapati += not prins
            br.close()
    finally:
        srv.shutdown()
        srv.server_close()
    if a.mutanti:
        print("Rezultat: %d verificări picate pe motorul adevărat; mutanți neprinși: %d din %d" % (len(prob), scapati, len(MUTANTI)))
        print(len(prob) + scapati)
    else:
        print("Rezultat: " + ("TOATE OK" if not prob else "; ".join(prob)[:500]))
        print(len(prob))


if __name__ == "__main__":
    main()
