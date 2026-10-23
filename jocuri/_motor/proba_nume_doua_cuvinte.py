"""Proba formularului „Cine ești?” (assets/js/prezenta.js): numele = cel puțin DOUĂ cuvinte de litere (23.10.2026).

  python proba_nume_doua_cuvinte.py [--baza https://learninghub-8z6.pages.dev]

El: „«Amalia 💕» nu știu cine este - și poate prevenim astfel de cazuri - când elevul nu are cel puțin două cuvinte pentru
nume și prenume”. Formularul număra cuvintele după spații, deci „Amalia 💕” trecea. Acum: doar litere (cu - ' . între ele),
cel puțin două cuvinte de minim 2 litere. Fără --baza pornește un server local pe folderul LearningHub. TOATE cererile POST
sunt oprite în browser (nimic nu ajunge pe serverul viu): numele bun trece de verificarea numelui și se oprește la cod
(„Verific codul…” / eroare de rețea), numele rău rămâne la mesajul despre nume. Ultima linie = numărul de probleme.
Oracolul: pe situl publicat ÎNAINTE de reparație „Amalia 💕” trece (probleme > 0), local după reparație -> 0.
"""
import argparse
import functools
import http.server
import sys
import threading
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

LH = Path(__file__).resolve().parents[2]
LECTIE = "/content/tic/cls5/index.html"
MESAJ = "cel puțin două cuvinte"   # din mesajul formularului despre nume
RELE = ["Amalia 💕", "Amalia", "Ingrid C", "Ana 123", "💕 💕", "A B"]
BUNE = ["Popescu Ana-Maria", "ilasc evelin", "Bădiţa Alexandra", "Țoțoiu Mathilda", "D'Angelo Marco"]
probleme = []


def verifica(cond, ce):
    print(("  ok   " if cond else "  RĂU  ") + ce)
    if not cond:
        probleme.append(ce)


def server_local():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(LH))
    h.log_message = lambda *a, **k: None
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8767), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return "http://127.0.0.1:8767"


def formular(br, baza):
    ctx = br.new_context(viewport={"width": 390, "height": 844})
    ctx.route("**/*", lambda r: r.abort() if r.request.method == "POST" else r.continue_())   # nimic spre serverul viu
    pg = ctx.new_page()
    pg.goto(baza + LECTIE, wait_until="load")
    pg.wait_for_selector("#lhp-cine, #lhp-nimeni, #lhp-cere", timeout=15000)
    pg.click(next(s for s in ("#lhp-cine", "#lhp-nimeni", "#lhp-cere") if pg.locator(s).count()))
    if pg.locator("#lhp-nou").count():
        pg.click("#lhp-nou")
    pg.wait_for_function("document.querySelectorAll('#lhp-s option').length > 1", timeout=15000)
    pg.select_option("#lhp-s", "transporturi")   # 23.10.2026: X E (Forestier) stă sub Colegiul Tehnic de Transporturi
    pg.select_option("#lhp-c", "X E")
    pg.fill("#lhp-k", "4827")
    return ctx, pg


def incearca(br, baza, nume):
    """mesajul de sub formular după „Gata” (caseta închisă = numele a trecut: "")"""
    ctx, pg = formular(br, baza)
    pg.fill("#lhp-n", nume)
    pg.click("#lhp-ok")
    pg.wait_for_timeout(400)
    t = pg.locator("#lhp-e").inner_text() if pg.locator("#lhp-e").count() else ""
    ctx.close()
    return t


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza")
    a = ap.parse_args()
    baza = (a.baza or server_local()).rstrip("/")
    from playwright.sync_api import sync_playwright
    print("Formularul „Cine ești?” pe", baza)
    with sync_playwright() as p:
        br = p.chromium.launch()
        for n in RELE:   # fiecare într-un formular nou (codul vechi le primea și închidea caseta)
            t = incearca(br, baza, n)
            verifica(MESAJ in t, "refuzat %r -> %r" % (n, t[:90]))
        for n in BUNE:   # numele bun merge mai departe, spre cod
            t = incearca(br, baza, n)
            verifica(MESAJ not in t, "primit %r (trece la cod: %r)" % (n, t[:70]))
        br.close()
    print(len(probleme))
    sys.exit(1 if probleme else 0)


if __name__ == "__main__":
    main()
