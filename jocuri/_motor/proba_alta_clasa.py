"""Proba „Altă clasă din școala asta” pe formularul Cine ești? (assets/js/prezenta.js, 28.09.2026).
  python proba_alta_clasa.py                      -> server LOCAL pe folderul LearningHub
  python proba_alta_clasa.py --baza https://proba.learninghub-8z6.pages.dev   -> situl publicat
Regula 24 LearningHub: tot ce nu e situl probat se abandonează — nicio înregistrare pe serverul viu al
testelor (înscrierea rămâne doar în localStorage-ul browserului de probă). Ultima linie = numărul de probleme."""
import argparse, json, subprocess, sys, time, socket
from playwright.sync_api import sync_playwright

ap = argparse.ArgumentParser()
ap.add_argument("--baza", default="")
BAZA = ap.parse_args().baza.rstrip("/")
ROOT = r"C:\00\Projects\LearningHub"
PORT = 8765
ORIGINE = BAZA or "http://127.0.0.1:%d" % PORT
PAGE = ORIGINE + "/lectii/v/m1-l02/"
PERMIS = (ORIGINE,) if BAZA else ("http://127.0.0.1", "http://localhost")

# (școala, ce scrie elevul, ce trebuie să ajungă în profil)
CAZURI = [
    ("brauner", "a vi-a b", "VI B"),      # clasă care nu e a profesorului -> forma curată
    ("brauner", "6a", "6 A"),             # e de fapt clasa lui „6 A” -> eticheta lui
    ("forestier", "clasa a XI-a c", "XI C"),  # e clasa lui „XI C”
    ("brauner", "vib", "VI B"),           # lipit, roman
    ("brauner", "7ma", "7 MA"),           # lipit, e clasa lui „7 MA”
    ("brauner", "", None),                # gol -> mesaj de eroare, nu se înscrie
]

srv = None
if not BAZA:
    srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"],
                           cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(50):
        try:
            socket.create_connection(("127.0.0.1", PORT), 0.2).close(); break
        except OSError:
            time.sleep(0.1)

probleme = 0
def rau(msg):
    global probleme
    probleme += 1
    print("PROBLEMA:", msg)

try:
    with sync_playwright() as p:
        b = p.chromium.launch()
        for sc, scris, asteptat in CAZURI:
            ctx = b.new_context()
            ctx.route("**/*", lambda r: r.continue_() if r.request.url.startswith(PERMIS) else r.abort())
            pg = ctx.new_page()
            pg.goto(PAGE)
            pg.wait_for_timeout(800)
            pg.mouse.click(5, 5)                     # primul gest strânge întrebarea în etichetă
            pg.wait_for_timeout(300)
            for sel in ["#lhp-cine", "text=Spune cine ești"]:
                if pg.locator(sel).count():
                    pg.locator(sel).first.click(); break
            pg.wait_for_function("document.querySelector('#lhp-s') && document.querySelector('#lhp-s').options.length > 2", timeout=8000)
            pg.select_option("#lhp-s", sc)
            vals = pg.eval_on_selector_all("#lhp-c option", "o => o.map(x => x.value || x.textContent)")
            if "__alta" not in vals:
                rau("%s: lipsește opțiunea Altă clasă (opțiuni: %s)" % (sc, vals))
            if vals and vals[-1] != "__alta":
                rau("%s: Altă clasă nu e ultima" % sc)
            if pg.is_visible("#lhp-cx"):
                rau("%s: câmpul de scris e vizibil înainte de alegere" % sc)
            pg.select_option("#lhp-c", "__alta")
            if not pg.is_visible("#lhp-cx"):
                rau("%s: câmpul de scris NU apare după Altă clasă" % sc)
            pg.fill("#lhp-cx", scris)
            pg.fill("#lhp-n", "Proba Local")
            pg.fill("#lhp-k", "1234")
            pg.click("#lhp-ok")
            pg.wait_for_timeout(1500)
            prof = pg.evaluate("localStorage.getItem('lh_prezenta')")
            clasa = (json.loads(prof) or {}).get("clasa") if prof else None
            err = pg.text_content("#lhp-e") if pg.locator("#lhp-e").count() else ""
            if asteptat is None:
                if clasa:
                    rau("gol: s-a înscris totuși cu clasa %r" % clasa)
                elif "Scrie clasa" not in (err or ""):
                    rau("gol: mesaj neașteptat %r" % err)
                else:
                    print("OK  gol -> %r" % err)
            elif clasa != asteptat:
                rau("%s %r -> %r (așteptat %r)" % (sc, scris, clasa, asteptat))
            else:
                print("OK  %s %r -> %r" % (sc, scris, clasa))
            # alegerea unei clase din listă tot merge (regresie)
            ctx.close()
        ctx = b.new_context()
        ctx.route("**/*", lambda r: r.continue_() if r.request.url.startswith(PERMIS) else r.abort())
        pg = ctx.new_page(); pg.goto(PAGE); pg.wait_for_timeout(800); pg.mouse.click(5, 5); pg.wait_for_timeout(300)
        for sel in ["#lhp-cine", "text=Spune cine ești"]:
            if pg.locator(sel).count():
                pg.locator(sel).first.click(); break
        pg.wait_for_function("document.querySelector('#lhp-s') && document.querySelector('#lhp-s').options.length > 2", timeout=8000)
        pg.select_option("#lhp-s", "brauner"); pg.select_option("#lhp-c", "6 A")
        pg.fill("#lhp-n", "Proba Local"); pg.fill("#lhp-k", "1234"); pg.click("#lhp-ok"); pg.wait_for_timeout(1500)
        prof = pg.evaluate("localStorage.getItem('lh_prezenta')")
        c2 = (json.loads(prof) or {}).get("clasa") if prof else None
        if c2 != "6 A":
            rau("regresie: clasa din listă -> %r" % c2)
        else:
            print("OK  clasa din listă '6 A' -> %r" % c2)
        ctx.close(); b.close()
finally:
    if srv:
        srv.terminate()
print(probleme)
