# -*- coding: utf-8 -*-
"""Proba pazei de rețea a porților sitului (porti_extra/paza_browser/sitecustomize.py), cu control pozitiv ȘI negativ.
17.11.2026, reverificare_etapa0.md 6.c.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/oracole/porti_extra/paza_proba.py

Ce face (totul în %TEMP%, nimic scris în dosarul lucrării sau în sit): un sit-jucărie (o pagină care încarcă
/assets/js/prezenta.js, cheamă navigator.sendBeacon spre serverul local și cere o imagine din afară), servit pe
127.0.0.1 cu port liber; o „probă de poartă” scrisă ca porțile sitului — ruta EI lasă să treacă tot ce e local
(deci și prezenta.js, și fișierele de pe disc, file:) — care deschide pagina pe 4 drumuri: Browser.new_context +
BrowserContext.route cu un argument, Browser.new_page + Page.route cu două argumente, pagina deschisă DE PE DISC
(file:///…, cum o deschid test_joc.py și oracol_controale_taiate.py; prima rulare a porților din 17.11 a arătat că o
pază care abandonează file: oprește porțile întregi) și un proces Python COPIL (cum se împarte oracol_controale_taiate.py).
Rulată de două ori:
  CU paza (PYTHONPATH = porti_extra/paza_browser, ca în porti.py): pe fiecare drum prezenta.js NU se încarcă,
     sendBeacon întoarce false, serverul nu primește niciun POST, imaginea din afară e abandonată, pagina de pe disc SE
     deschide, iar jurnalul pazei are 2 procese cu contexte păzite (4 contexte);
  FĂRĂ paza (controlul negativ): prezenta.js SE încarcă și beacon-ul AJUNGE la serverul local — dovada că proba
     chiar vede diferența (altfel „0” ar fi adevărat prin construcție).
Ultima linie = numărul așteptărilor nerespectate (0 = paza funcționează ȘI proba o poate deosebi), cod 0/1."""
import http.server
import json
import os
import subprocess
import sys
import tempfile
import threading
import time
from functools import partial
from pathlib import Path

AICI = Path(__file__).resolve().parent
PAZA = AICI / "paza_browser"
IESIRE = Path(os.environ["LH_IESIRE"]).resolve() if os.environ.get("LH_IESIRE") else Path(tempfile.gettempdir()) / "lh_paza_proba"

PAGINA = """<!doctype html><meta charset="utf-8"><title>paza</title>
<script>window.__prezenta = 0;</script>
<script src="/assets/js/prezenta.js"></script>
<img src="http://exemplu.invalid/x.png">
<script>window.__beacon = navigator.sendBeacon('/beacon', 'x');</script>"""
# aceeași pagină, deschisă de pe disc: prezenta.js relativ (file:///…/assets/js/prezenta.js), beacon-ul spre serverul local
PAGINA_DISC = """<!doctype html><meta charset="utf-8"><title>paza disc</title>
<script>window.__prezenta = 0;</script>
<script src="assets/js/prezenta.js"></script>
<img src="http://exemplu.invalid/x.png">
<script>window.__beacon = navigator.sendBeacon('{BAZA}/beacon', 'x');</script>"""

PROBA = r'''# proba-de-poartă (scrisă de paza_proba.py): ruta ei lasă să treacă tot ce e local, ca porțile sitului
import json, os, subprocess, sys
from playwright.sync_api import sync_playwright
url, url_disc = sys.argv[1], sys.argv[2]
copil = len(sys.argv) > 3 and sys.argv[3] == "--copil"
LOCAL = ("http://127.0.0.1", "http://localhost", "file:", "data:", "blob:")
def ruta1(r):
    u = r.request.url
    return r.continue_() if u.startswith(LOCAL) else r.abort()
def ruta2(r, req):
    u = req.url
    return r.continue_() if u.startswith(LOCAL) else r.abort()
out = []
with sync_playwright() as p:
    b = p.chromium.launch()
    drumuri = ["copil"] if copil else ["context+route1", "new_page+page.route2", "disc(file:)+route1"]
    for drum in drumuri:
        if drum == "new_page+page.route2":
            pg = b.new_page()
            pg.route("**/*", ruta2)
        else:
            ctx = b.new_context()
            ctx.route("**/*", ruta1)
            pg = ctx.new_page()
        pg.goto(url_disc if drum.startswith("disc") else url)
        pg.wait_for_timeout(300)
        out.append({"drum": drum, "prezenta": pg.evaluate("window.__prezenta"), "beacon": pg.evaluate("window.__beacon")})
        pg.close()
    b.close()
if not copil:
    r = subprocess.run([sys.executable, __file__, url, url_disc, "--copil"], capture_output=True, text=True, encoding="utf-8")
    out += json.loads(r.stdout.strip().splitlines()[-1])
print(json.dumps(out))
'''


def sit_jucarie(dir_):
    (dir_ / "assets/js").mkdir(parents=True, exist_ok=True)
    (dir_ / "index.html").write_text(PAGINA, encoding="utf-8")
    (dir_ / "assets/js/prezenta.js").write_text("window.__prezenta = 1;", encoding="utf-8")


def server(dir_, cereri):
    class H(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a):
            pass

        def do_GET(self):
            cereri.append(("GET", self.path))
            return super().do_GET()

        def do_POST(self):
            cereri.append(("POST", self.path))
            self.send_response(204)
            self.end_headers()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), partial(H, directory=str(dir_)))
    srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def ruleaza(cu_paza, tmp, url, url_disc, cereri):
    cereri.clear()
    script = tmp / "proba_poarta.py"
    script.write_text(PROBA, encoding="utf-8")
    jurnal = tmp / f"paza_{'cu' if cu_paza else 'fara'}.jsonl"
    if jurnal.exists():
        jurnal.unlink()
    env = {k: v for k, v in os.environ.items() if k not in ("PYTHONPATH", "LH_PAZA_JURNAL")}
    env.update(PYTHONDONTWRITEBYTECODE="1", PYTHONIOENCODING="utf-8")
    if cu_paza:
        env.update(PYTHONPATH=str(PAZA), LH_PAZA_JURNAL=str(jurnal))
    r = subprocess.run([sys.executable, str(script), url, url_disc], capture_output=True, text=True, encoding="utf-8", env=env, cwd=str(tmp),
                       timeout=180)
    time.sleep(1.5)            # beacon-ul (controlul negativ) pleacă asincron
    try:
        drumuri = json.loads(r.stdout.strip().splitlines()[-1])
    except Exception:  # noqa: BLE001
        drumuri = []
    procese = [json.loads(x) for x in jurnal.read_text(encoding="utf-8").splitlines() if x.strip()] if jurnal.exists() else []
    return {"cod": r.returncode, "eroare": (r.stderr or "")[-400:] if r.returncode else "", "drumuri": drumuri,
            "post_beacon": sum(1 for m, p in cereri if m == "POST"), "get_prezenta": sum(1 for m, p in cereri if p.endswith("prezenta.js")),
            "jurnal_paza": procese}


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    IESIRE.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="lh_paza_"))
    sit = tmp / "sit"
    sit_jucarie(sit)
    cereri = []
    srv = server(sit, cereri)
    baza = f"http://127.0.0.1:{srv.server_address[1]}"
    url = baza + "/index.html"
    (sit / "disc.html").write_text(PAGINA_DISC.replace("{BAZA}", baza), encoding="utf-8")
    url_disc = (sit / "disc.html").resolve().as_uri()
    cu = ruleaza(True, tmp, url, url_disc, cereri)
    fara = ruleaza(False, tmp, url, url_disc, cereri)
    N = 4                                  # drumuri: context+route1, new_page+page.route2, disc(file:), copil
    srv.shutdown()
    nerespectate = []

    def astept(cond, ce):
        if not cond:
            nerespectate.append(ce)
    astept(cu["cod"] == 0 and len(cu["drumuri"]) == N, f"CU paza: proba a rulat pe toate cele {N} drumuri (cod {cu['cod']}, {len(cu['drumuri'])} drumuri)")
    for d in cu["drumuri"]:
        astept(d["prezenta"] == 0, f"CU paza, {d['drum']}: prezenta.js NU se încarcă")
        astept(d["beacon"] is False, f"CU paza, {d['drum']}: sendBeacon întoarce false")
    astept(cu["post_beacon"] == 0, f"CU paza: serverul nu primește niciun beacon (a primit {cu['post_beacon']})")
    astept(cu["get_prezenta"] == 0, f"CU paza: serverul nu primește cererea prezenta.js (a primit {cu['get_prezenta']})")
    pr = [p for p in cu["jurnal_paza"] if p.get("contexte")]
    astept(len(pr) == 2 and sum(p["contexte"] for p in pr) == N,
           f"CU paza: jurnalul are 2 procese cu {N} contexte păzite (are {len(pr)} procese, {sum(p['contexte'] for p in pr)} contexte)")
    astept(sum(p.get("cereri_externe_oprite", 0) for p in pr) >= N, "CU paza: imaginea din afară abandonată de paza însăși pe fiecare drum")
    astept(sum(p.get("cereri_locale_oprite", 0) for p in pr) >= N, "CU paza: prezenta.js abandonată de paza însăși pe fiecare drum (și de pe disc)")
    astept(fara["cod"] == 0 and len(fara["drumuri"]) == N, f"FĂRĂ paza: proba a rulat (cod {fara['cod']})")
    astept(all(d["prezenta"] == 1 for d in fara["drumuri"]) and fara["get_prezenta"] >= N - 1,
           "FĂRĂ paza (control negativ): prezenta.js SE încarcă pe fiecare drum")
    astept(all(d["beacon"] is True for d in fara["drumuri"]) and fara["post_beacon"] >= 1,
           f"FĂRĂ paza (control negativ): beacon-ul ajunge la serverul local (POST primite: {fara['post_beacon']})")
    for x in nerespectate:
        print("NERESPECTAT: " + x)
    print(f"cu paza: {cu['drumuri']}; POST {cu['post_beacon']}, prezenta.js {cu['get_prezenta']}; procese păzite {len(pr)}")
    print(f"fără paza: {fara['drumuri']}; POST {fara['post_beacon']}, prezenta.js {fara['get_prezenta']}")
    det = IESIRE / "paza_proba.json"
    det.write_text(json.dumps({"cu_paza": cu, "fara_paza": fara, "nerespectate": nerespectate,
                               "generat": time.strftime("%Y-%m-%d %H:%M:%S")}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("detalii: <LH_IESIRE>/paza_proba.json" if os.environ.get("LH_IESIRE") else "detalii: %TEMP%/lh_paza_proba/paza_proba.json")
    print(len(nerespectate))
    return 0 if not nerespectate else 1


if __name__ == "__main__":
    sys.exit(main())
