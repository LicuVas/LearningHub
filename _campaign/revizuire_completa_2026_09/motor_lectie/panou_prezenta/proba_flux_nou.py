"""Proba fluxului NOU al panoului de prezență (27.09.2026), pe telefon 390x844 cu atingere, lecția VI/4.
Trimiterile spre server sunt prinse și răspunse local (nimic nu ajunge pe serverul viu); se numără.
  1. prima vizită: întrebarea mare apare; la primul gest (derulare) se strânge în eticheta „Spune cine ești”
  2. eticheta -> formularul; „Mai târziu” -> înapoi la etichetă, fără să-l facă vizitator (nu se scrie refuzul)
  3. înscrierea din etichetă merge: eticheta „Profesorul vede activitatea ta”, identitate criptată, trimitere la /api/activitate
  4. timpul lucrat se numără (jurnalul elevului crește cu mișcare, ~5 s pe tic)
  5. meniul etichetei se închide la un gest în pagină
  6. „Nu ești tu? Schimbă elevul” -> lista; la un gest se strânge în „Cine lucrează acum?”; apăsată -> lista; se alege din listă
  7. „Ești tot X?” NU se strânge la gesturi (trebuie răspuns)
  8. 0 erori în consolă
Ultima linie = numărul de probleme."""
import json
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

LH = Path(r"C:\00\Projects\LearningHub")
PORT = 8786
URL = f"http://127.0.0.1:{PORT}/lectii/vi/m1-l04/index.html"
prob = []


def ok(c, m):
    print(("  ok   " if c else "  RAU  ") + m)
    if not c:
        prob.append(m)


srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", str(LH)],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.2)
try:
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": 390, "height": 844}, is_mobile=True, has_touch=True)
        pg = ctx.new_page()
        erori, trimise = [], []
        pg.on("pageerror", lambda e: erori.append("pageerror: " + str(e)))
        pg.on("console", lambda m: erori.append(m.text) if m.type == "error" else None)
        pg.on("request", lambda r: trimise.append((r.url.split("/api/")[-1], r.post_data or "")) if r.method == "POST" and "/api/" in r.url else None)
        ctx.route("**/api/**", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*", "content-type": "application/json"}))
        ls = lambda k: pg.evaluate("k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }", k)

        print("1. prima vizită")
        pg.goto(URL, wait_until="networkidle"); pg.evaluate("localStorage.clear()"); pg.reload(wait_until="networkidle")
        pg.wait_for_selector("#lhp-cine", timeout=10000)
        h0 = pg.evaluate("document.querySelector('#lhp .bar').getBoundingClientRect().height")
        ok(pg.is_visible("#lhp-viz") and h0 > 150, f"întrebarea mare apare la încărcare ({h0:.0f} px) cu „Nu, doar vizitez”")
        pg.mouse.move(195, 300); pg.mouse.wheel(0, 150); pg.wait_for_timeout(400)
        h1 = pg.evaluate("document.querySelector('#lhp').firstElementChild.getBoundingClientRect().height")
        ok(pg.locator("#lhp .pill.cere#lhp-cine").count() == 1 and h1 <= 34, f"la primul gest s-a strâns în eticheta „Spune cine ești” ({h1:.0f} px)")
        ok(not trimise, "nimic spre server înainte de înscriere")

        print("2. eticheta -> formular -> „Mai târziu”")
        pg.evaluate("scrollTo(0, document.documentElement.scrollHeight)"); pg.wait_for_timeout(300)   # la capăt eticheta stă pe loc liber
        pg.click("#lhp-cine"); pg.wait_for_selector("#lhp-s", timeout=5000)
        ok(pg.is_visible("#lhp-n") and pg.is_visible("#lhp-k"), "eticheta deschide formularul „Cine ești?”")
        pg.wait_for_function("document.querySelectorAll('#lhp-s option').length > 2", timeout=15000)
        pg.mouse.move(195, 60); pg.mouse.wheel(0, -100); pg.wait_for_timeout(300)   # gest AFARĂ din formular
        ok(pg.is_visible("#lhp-s"), "formularul NU se strânge la gesturi (elevul scrie în el)")
        pg.click("#lhp-x"); pg.wait_for_timeout(300)
        ok(pg.locator("#lhp-cine").count() == 1 and ls("lh_prezenta") is None, "„Mai târziu” -> înapoi la etichetă, fără refuz salvat")

        print("3. înscrierea")
        pg.evaluate("scrollTo(0, document.documentElement.scrollHeight)"); pg.wait_for_timeout(300)
        pg.click("#lhp-cine"); pg.wait_for_function("document.querySelectorAll('#lhp-s option').length > 2", timeout=15000)
        sc = pg.evaluate("document.querySelectorAll('#lhp-s option')[1].value")
        pg.select_option("#lhp-s", sc)
        cl = pg.evaluate("document.querySelectorAll('#lhp-c option')[1].value")
        pg.select_option("#lhp-c", cl); pg.fill("#lhp-n", "Proba Flux Nou"); pg.fill("#lhp-k", "4827")
        pg.click("#lhp-ok")
        pg.wait_for_selector("#lhp-pill", timeout=20000); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(800)
        eu = ls("lh_prezenta") or {}
        ok(len(eu.get("id") or "") == 32 and len(eu.get("numeEnc") or "") > 300, f"identitate: id + nume criptat ({sc}, {cl})")
        ok("Profesorul vede activitatea ta" in pg.inner_text("#lhp") and "Nou P." in pg.inner_text("#lhp"), "eticheta „Profesorul vede activitatea ta · Nou P.”")
        act = [d for u, d in trimise if u.startswith("activitate")]
        ok(any(eu.get("id", "?") in d and "Proba Flux Nou" not in d for d in act), f"a plecat trimiterea la /api/activitate, fără numele în clar ({len(act)})")

        print("4. timpul lucrat se numără")
        j0 = sum(((ls("lh_prezenta_jurnal") or {}).get("zile") or {}).values())
        for i in range(7):
            pg.mouse.move(100 + i * 20, 400); pg.mouse.wheel(0, 40 if i % 2 else -40); pg.wait_for_timeout(2000)
        j1 = sum(((ls("lh_prezenta_jurnal") or {}).get("zile") or {}).values())
        ok(j1 - j0 >= 10, f"jurnalul elevului a crescut cu {j1 - j0} s în ~14 s de lucru")

        print("5. meniul etichetei")
        pg.evaluate("scrollTo(0, document.documentElement.scrollHeight)"); pg.wait_for_timeout(300)
        pg.click("#lhp-pill"); pg.wait_for_selector("#lhp-alt", timeout=5000)
        ok(pg.is_visible("#lhp-alt"), "meniul se deschide (Jurnalul meu, Schimbă elevul)")
        pg.mouse.move(195, 60); pg.mouse.wheel(0, -200); pg.wait_for_timeout(300)   # gest AFARĂ din meniu
        ok(pg.locator("#lhp-alt").count() == 0 and pg.locator("#lhp-pill").count() == 1, "la un gest în pagină meniul se închide la loc în etichetă")

        print("6. lista calculatorului")
        pg.evaluate("scrollTo(0, document.documentElement.scrollHeight)"); pg.wait_for_timeout(300)
        pg.click("#lhp-pill"); pg.click("#lhp-alt"); pg.wait_for_selector("#lhp-lista", timeout=5000)
        ok("Proba Flux Nou" in pg.inner_text("#lhp-lista"), "„Schimbă elevul” -> lista „Cine lucrează acum?” cu el în ea")
        pg.mouse.move(195, 60); pg.mouse.wheel(0, -150); pg.wait_for_timeout(300)   # gest AFARĂ din listă
        ok(pg.locator("#lhp-cere").count() == 1, "lista se strânge la un gest în eticheta „Cine lucrează acum?”")
        pg.evaluate("scrollTo(0, document.documentElement.scrollHeight)"); pg.wait_for_timeout(300)
        pg.click("#lhp-cere"); pg.wait_for_selector("#lhp-lista", timeout=5000)
        with pg.expect_navigation(timeout=20000):
            pg.click("#lhp-lista .el >> nth=0")
        pg.wait_for_selector("#lhp-pill", timeout=15000)
        ok((ls("lh_prezenta") or {}).get("id") == eu.get("id"), "alegerea din listă -> același elev, același id")

        print("7. „Ești tot X?” rămâne pe ecran")
        pg.evaluate("() => { const e = JSON.parse(localStorage.getItem('lh_prezenta')); e.ultima = Date.now() - 2 * 3600e3; localStorage.setItem('lh_prezenta', JSON.stringify(e)); }")
        pg.reload(wait_until="networkidle"); pg.wait_for_selector("#lhp-da", timeout=10000)
        pg.mouse.wheel(0, 200); pg.wait_for_timeout(300); pg.touchscreen.tap(195, 120); pg.wait_for_timeout(300)
        ok(pg.is_visible("#lhp-da"), "întrebarea „Ești tot X?” nu se strânge la gesturi")
        pg.click("#lhp-da"); pg.wait_for_selector("#lhp-pill", timeout=5000)
        ok(pg.locator("#lhp-pill").count() == 1, "„Da, sunt eu” -> eticheta revine")

        ok(not erori, f"0 erori în consolă ({erori[:3]})")
        br.close()
finally:
    srv.terminate()
print(len(prob))
