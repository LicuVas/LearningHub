"""Proba EVIDENȚEI ACTIVITĂȚII din browser (24.09.2026): assets/js/prezenta.js pe lecții și jocuri + panoul.

  python proba_prezenta.py [--baza https://learninghub-8z6.pages.dev] [--fara-panou]

Fără --baza pornește un server local pe folderul LearningHub (trimiterile merg tot la serverul VIU al testelor).
Joacă „ca un elev” pe un calculator de laborator (1366 px) și pe un telefon (390 px):
  1. o lecție: apare întrebarea „Spune cine ești”; nimic nu pleacă spre server înainte de înscriere
  2. înscrierea (Forestier X E, nume de probă) -> eticheta „Profesorul vede activitatea ta”; numele nu pleacă în clar
  3. după ~30 s de lucru pleacă prima trimitere și ajunge pe server (secunde > 0 pe pagina lecției)
  4. fără mișcare, timpul se OPREȘTE (ceas simulat: 7 minute fără nimic -> cel mult 2 minute numărate)
  5. un joc: numele e pus singur la diplomă; nivelul terminat ajunge pe server cu stelele lui
  6. „Ești tot X?” după 90 de minute fără activitate; până la răspuns nu se numără nimic
  7. „Nu ești tu?” (în joc) deschide lista elevilor calculatorului; vizitatorul nu mai e urmărit
  8. /jurnal/ arată minutele; pe telefon nimic nu iese din ecran
  9. panoul profesorului (activitate.html) deschide numele în browser și îl arată la Forestier X E
Înregistrările de probă se șterg de pe server la final. Ultima linie = numărul de probleme.
"""
import argparse
import functools
import http.server
import json
import sys
import threading
import time
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

LH = Path(__file__).resolve().parents[2]
sys.path.insert(0, r"C:\00\AI_0\tools")
import teste  # noqa: E402
import diplome  # noqa: E402
import activitate  # noqa: E402

NUME = "Proba Prezenta Stergere"
LECTIE = "/content/tic/cls5/index.html"
CHEIE_LECTIE = "/content/tic/cls5/"      # așa o scrie prezenta.js (forma scurtă, ca pe Cloudflare)
JOC = "excel-viii"
LECTIE_NOTA = "/content/tic/cls5/m1-sisteme/lectia1-calculator.html"   # o lecție cu lesson-summary.js
CHEIE_NOTA = "/content/tic/cls5/m1-sisteme/lectia1-calculator"
probleme = []
ids = set()


def verifica(cond, ce):
    print(("  ok   " if cond else "  RĂU  ") + ce)
    if not cond:
        probleme.append(ce)


def server_local():
    h = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(LH))
    h.log_message = lambda *a, **k: None
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8766), h)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return "http://127.0.0.1:8766"


def ls(pg, k):
    return pg.evaluate("k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}}", k)


def pe_server(idp):
    return next((x for x in teste.api({"actiune": "activitate"}).get("activ", []) if x.get("id") == idp), None)


def misca(pg, sec):
    """„lucrează”: mișcă mouse-ul și derulează, câte o dată la 2 secunde"""
    for i in range(int(sec / 2)):
        pg.mouse.move(200 + (i % 7) * 40, 300 + (i % 5) * 30)
        pg.mouse.wheel(0, 40 if i % 2 else -40)
        pg.wait_for_timeout(2000)


ZBOR = {}


def urmareste(pg):
    """ține evidența cererilor neterminate ale paginii (pentru diagnostic)"""
    pg.on("request", lambda r: ZBOR.__setitem__(id(r), r.url))
    pg.on("requestfinished", lambda r: ZBOR.pop(id(r), None))
    pg.on("requestfailed", lambda r: ZBOR.pop(id(r), None))


def linistit(pg, url):
    """goto până la „rețea liniștită”; dacă nu se liniștește în 15 s, spune ce a rămas deschis și merge mai
    departe cu pagina încărcată (proba verifică apoi exact ce contează, nu liniștea rețelei)"""
    try:
        pg.goto(url, wait_until="networkidle", timeout=15000)
    except Exception:
        print("  (notă: pagina nu s-a liniștit în 15 s; cereri deschise: %s)" % [u[:80] for u in list(ZBOR.values())[:5]])
        pg.wait_for_load_state("load")


def inscrie(pg):
    pg.click("#lhp-cine")
    pg.select_option("#lhp-s", "forestier")
    pg.select_option("#lhp-c", "X E")
    pg.fill("#lhp-n", NUME)
    pg.fill("#lhp-k", "4827")   # 26.09.2026: codul de 4 cifre (progresul pe orice aparat)
    pg.click("#lhp-ok")
    pg.wait_for_selector("#lhp-pill", timeout=20000)   # primul elev primește sertar nou -> pagina se reîncarcă
    pg.wait_for_load_state("load")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--baza")
    ap.add_argument("--fara-panou", action="store_true")
    a = ap.parse_args()
    baza = (a.baza or server_local()).rstrip("/")
    print("Proba evidenței pe", baza)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        br = p.chromium.launch()
        try:
            ruleaza(br, baza, a)
        finally:
            br.close()
            for i in ids:
                teste.api({"actiune": "activitate-sterge", "ids": [i]})
            ramase = [x for x in teste.api({"actiune": "activitate"}).get("activ", []) if x.get("id") in ids]
            verifica(not ramase, "curățenia: înregistrările de probă (%d) șterse de pe server" % len(ids))
    print("Rezultat: " + ("TOATE OK" if not probleme else "; ".join(probleme)))
    print(len(probleme))
    return 1 if probleme else 0


def ruleaza(br, baza, a):
    ctx = br.new_context(viewport={"width": 1366, "height": 800})
    pg = ctx.new_page()
    erori, trimiteri = [], []
    pg.on("pageerror", lambda e: erori.append(str(e)))
    pg.on("request", lambda r: trimiteri.append(r.post_data or "") if "/api/activitate" in r.url else None)
    urmareste(pg)

    print("1. lecția, înainte de înscriere")
    linistit(pg, baza + LECTIE)
    pg.evaluate("localStorage.clear()")
    pg.reload(wait_until="load")   # contorul de vizitatori poate ține rețeaua „neliniștită” (26.09.2026)
    pg.wait_for_selector("#lhp-cine", timeout=10000)
    verifica(pg.is_visible("#lhp-cine") and pg.is_visible("#lhp-viz"), "apare „Spune cine ești” + „Nu, doar vizitez”")
    pg.wait_for_timeout(6000)
    verifica(not trimiteri, "nimic spre server înainte de înscriere")

    print("2. înscrierea")
    inscrie(pg)
    eu = ls(pg, "lh_prezenta") or {}
    ids.add(eu.get("id"))
    verifica(len(eu.get("id") or "") == 32 and len(eu.get("numeEnc") or "") > 300, "identitate: id aleator + nume criptat")
    verifica("Stergere P." in pg.inner_text("#lhp-pill") and "Profesorul vede" in pg.inner_text("#lhp-pill"),
             "eticheta: „%s”" % pg.inner_text("#lhp-pill").strip())

    print("3. lucrul se numără și ajunge pe server")
    misca(pg, 40)
    pg.wait_for_timeout(3000)
    verifica(any(NUME not in t and eu["id"] in t for t in trimiteri), "a plecat o trimitere, fără numele în clar (%d)" % len(trimiteri))
    r = pe_server(eu["id"])
    s = ((r or {}).get("pagini") or {}).get(CHEIE_LECTIE, {}).get("s", 0)
    verifica(r is not None and s >= 25, "pe server: %s s pe lecție, clasa %s" % (s, (r or {}).get("clasa")))
    pg.click("#lhp-pill")
    verifica(pg.is_visible("#lhp-alt") and "Jurnalul meu" in pg.inner_text("#lhp"), "meniul etichetei: Jurnalul meu + Schimbă elevul")
    pg.click("#lhp-x")

    print("3b. nota dintr-o lecție ajunge la profesor (25.09.2026)")
    linistit(pg, baza + LECTIE_NOTA)
    pg.wait_for_selector("#lhp-pill", timeout=10000)
    # învățarea atomică „terminată”: 5 din 6 corecte, fără exersare -> 1 + round(5/6*6)=5 -> nota 6
    fa = """()=>{LessonSummary.atomicScore={totalCorrect:5,totalQuestions:6,atomsCompleted:6,atomsTotal:6};
        LessonSummary.interactedThisSession=true;LessonSummary.updateSummaryDisplay();LessonSummary.updateSummaryDisplay();}"""
    pg.evaluate(fa)
    pg.wait_for_timeout(4000)
    r = pe_server(eu["id"]) or {}
    n = (r.get("note") or {}).get(CHEIE_NOTA) or {}
    verifica(n.get("nota") == 6 and n.get("incercari") == 1, "pe server: nota 6 la lecție, o singură încercare deși rezumatul s-a redesenat (%s)" % n)
    verifica("atomic 5/6" in (n.get("detalii") or ""), "detaliile notei: %s" % n.get("detalii"))

    print("4. fără mișcare timpul se oprește (ceas simulat)")
    p2 = ctx.new_page()
    p2.clock.install()
    p2.goto(baza + "/content/tic/cls6/index.html", wait_until="networkidle")
    p2.bring_to_front()
    p2.route("**/api/activitate", lambda route: route.abort())   # coada rămâne pe loc, o putem citi
    p2.clock.run_for(7 * 60 * 1000)
    c = ls(p2, "lh_prezenta_coada") or {}
    sec = ((c.get("pag") or {}).get("/content/tic/cls6/") or {}).get("s", 0)
    verifica(sec <= 130, "7 minute fără nicio mișcare -> %s s numărate (cel mult ~120)" % sec)
    p2.unroute("**/api/activitate")
    p2.close()
    pg.bring_to_front()

    print("5. jocul")
    linistit(pg, "%s/jocuri/%s/index.html" % (baza, JOC))
    pg.wait_for_timeout(1500)
    verifica(pg.input_value("#nume") == NUME, "numele e pus singur la diplomă: „%s”" % pg.input_value("#nume"))
    jucat = "gata"
    try:
        pg.click('.lvl[data-l="0"]'); pg.click("#go")
        n = pg.evaluate("JocMotor.test.config().nivele[0].qs.length")
        for qi in range(n):
            pg.evaluate("JocMotor.test.rezolva()")
            if pg.locator("#chk").count() and not pg.locator("#fb .fb.ok").count():
                pg.click("#chk")
            pg.click("#next")
        if not pg.locator(".end-stars").count():
            jucat = "fără ecranul de final"
    except Exception as e:
        jucat = str(e).splitlines()[0][:120]
    verifica(jucat == "gata", "nivelul 1 jucat până la capăt (%s)" % jucat)
    pg.wait_for_timeout(4000)
    r = pe_server(eu["id"]) or {}
    niv = ((r.get("jocuri") or {}).get(JOC) or {}).get("nivele") or {}
    verifica(niv.get("1", 0) >= 1, "pe server: %s nivelul 1 cu %s stele" % (JOC, niv.get("1")))
    # 25.09.2026 (Filip, „sunt la nivelul 4 demult”): niveluri terminate fără să plece (ex. înainte de înscriere)
    # trebuie să ajungă la redeschiderea jocului - aici le punem direct în memoria jocului, ca și cum s-ar fi pierdut
    pg.evaluate("""()=>{const p=localStorage.getItem('learninghub_active_profile'),k=JocMotor.test.config().cheie+(p&&p.charAt(0)!=='_'?'@'+p:''),s=JSON.parse(localStorage.getItem(k));
        s.lv[1]={stars:2,xp:10};s.lv[2]={stars:3,xp:10};localStorage.setItem(k,JSON.stringify(s))}""")
    pg.reload(wait_until="load"); pg.wait_for_timeout(6000)
    niv = (((pe_server(eu["id"]) or {}).get("jocuri") or {}).get(JOC) or {}).get("nivele") or {}
    verifica(niv.get("2") == 2 and niv.get("3") == 3, "la redeschidere pleacă și nivelurile făcute înainte: %s" % niv)

    print("6. „Ești tot X?” după 90 de minute")
    pg.evaluate("()=>{const e=JSON.parse(localStorage.getItem('lh_prezenta'));e.ultima=Date.now()-2*3600e3;localStorage.setItem('lh_prezenta',JSON.stringify(e));localStorage.removeItem('lh_prezenta_coada')}")
    linistit(pg, baza + LECTIE)
    pg.wait_for_selector("#lhp-da", timeout=10000)
    verifica(NUME in pg.inner_text("#lhp"), "întreabă „Ești tot %s?”" % NUME)
    misca(pg, 12)
    c = ls(pg, "lh_prezenta_coada") or {}
    verifica(not ((c.get("pag") or {}).get(CHEIE_LECTIE) or {}).get("s"), "până la răspuns nu intră nimic în coada elevului")
    t = ((ls(pg, "lh_prezenta_tinut") or {}).get("pag") or {}).get(CHEIE_LECTIE, {}).get("s", 0)
    verifica(t >= 5, "dar timpul lucrat se ține DEOPARTE, nu se pierde (%s s)" % t)
    pg.route("**/api/activitate", lambda route: route.abort())   # ca să citim coada înainte să plece
    pg.click("#lhp-da")
    c = ls(pg, "lh_prezenta_coada") or {}
    verifica(((c.get("pag") or {}).get(CHEIE_LECTIE) or {}).get("s", 0) >= t and not ls(pg, "lh_prezenta_tinut"),
             "după „Da” timpul ținut deoparte trece pe numele lui")
    pg.unroute("**/api/activitate")
    verifica(pg.is_visible("#lhp-pill"), "după „Da” revine eticheta")

    print("6b. „Refă lecția de la zero” NU scoate elevul (25.09 + 26.09.2026)")
    linistit(pg, baza + LECTIE_NOTA)
    pg.wait_for_selector(".ux-new-student", timeout=10000)
    pg.click(".ux-new-student >> nth=0"); pg.click(".ux-new-student >> nth=0")
    pg.wait_for_load_state("load"); pg.wait_for_selector("#lhp-pill", timeout=10000)
    verifica((ls(pg, "lh_prezenta") or {}).get("id") == eu["id"], "înscrierea a rămas (același elev) după „Refă lecția”")
    verifica(pg.is_visible("#lhp-pill"), "lucrează mai departe pe numele lui, fără întrebări")

    print("7. „Sunt alt elev” în joc + vizitatorul")
    linistit(pg, "%s/jocuri/%s/index.html" % (baza, JOC))
    alt = pg.query_selector("#alt-elev") or pg.query_selector(".alt-elev button")
    if alt:
        alt.click()
        pg.wait_for_selector("#lhp-lista", timeout=5000)
        verifica(NUME in pg.inner_text("#lhp-lista") and ls(pg, "lh_prezenta") is None,
                 "„Nu ești tu?” în joc -> lista elevilor calculatorului (cu el în ea), înscrierea curentă se închide")
        pg.click("#lhp-x")   # „Mai târziu” din listă = vizitator
    else:
        verifica(False, "n-am găsit butonul „Nu ești tu?” în joc")
    linistit(pg, baza + LECTIE)
    pg.wait_for_timeout(1500)
    verifica(not pg.is_visible("#lhp-cine") and not pg.is_visible("#lhp-pill"), "vizitatorul nu mai e întrebat și nu e urmărit")
    # 25.09.2026: „doar vizitez” apăsat din greșeală nu trebuie să închidă drumul spre înscriere
    verifica(pg.is_visible("#lhp-elev"), "vizitatorul are butonul mic „Sunt elev — mă înscriu”")
    pg.click("#lhp-elev")
    pg.wait_for_selector("#lhp-s", timeout=5000)
    pg.click("#lhp-x")
    verifica(pg.is_visible("#lhp-elev") and not pg.is_visible("#lhp-cine"), "„Mai târziu” îl lasă vizitator (butonul mic rămâne)")
    pg.click("#lhp-elev")
    pg.select_option("#lhp-s", "forestier"); pg.select_option("#lhp-c", "X E"); pg.fill("#lhp-n", NUME); pg.fill("#lhp-k", "4827"); pg.click("#lhp-ok")
    pg.wait_for_selector("#lhp-pill", timeout=20000)
    ids.add((ls(pg, "lh_prezenta") or {}).get("id"))
    verifica(pg.is_visible("#lhp-pill"), "după butonul mic se înscrie normal și apare eticheta")
    ctx.close()

    print("8. telefon + jurnal")
    tel = br.new_context(viewport={"width": 390, "height": 800}, is_mobile=True, has_touch=True)
    pt = tel.new_page()
    pt.on("pageerror", lambda e: erori.append(str(e)))
    pt.goto(baza + LECTIE, wait_until="load")
    pt.wait_for_selector("#lhp-cine", timeout=10000)
    lat = pt.evaluate("()=>{const b=document.getElementById('lhp').getBoundingClientRect();return [b.left,b.right,innerWidth]}")
    verifica(lat[0] >= 0 and lat[1] <= lat[2], "telefon: întrebarea încape în ecran (%s)" % lat)
    pt.click("#lhp-cine")
    lat = pt.evaluate("()=>{const b=document.getElementById('lhp').getBoundingClientRect();return [b.left,b.right,b.top,innerWidth]}")
    verifica(lat[0] >= 0 and lat[1] <= lat[3] and lat[2] >= 0, "telefon: formularul încape în ecran (%s)" % lat)
    pt.select_option("#lhp-s", "forestier"); pt.select_option("#lhp-c", "X E"); pt.fill("#lhp-n", NUME); pt.fill("#lhp-k", "4827"); pt.click("#lhp-ok")
    pt.wait_for_selector("#lhp-pill", timeout=20000)
    ids.add((ls(pt, "lh_prezenta") or {}).get("id"))
    for i in range(20):
        pt.touchscreen.tap(200, 400); pt.wait_for_timeout(2000)
    pt.goto(baza + "/jurnal/", wait_until="load")
    pt.wait_for_timeout(800)
    txt = pt.inner_text("main")
    verifica(NUME in txt and "săptămâna asta" in txt and "Ce vede profesorul" in txt, "jurnalul arată elevul, minutele și ce vede profesorul")
    verifica(pt.evaluate("document.documentElement.scrollWidth<=innerWidth"), "jurnal: nimic nu iese din ecran pe telefon")
    tel.close()
    verifica(not erori, "fără erori JavaScript (%s)" % erori[:3])

    if a.fara_panou:
        return
    print("9. panoul profesorului")
    url, _ = activitate.link_panou()
    pp = br.new_page(viewport={"width": 1366, "height": 900})
    pp.goto(url, wait_until="networkidle")
    pin = teste.config().get("admin_pin", "")
    if pp.query_selector("#pinval"):
        pp.fill("#pinval", pin); pp.click("#pinok")
    pp.wait_for_selector("#fs", timeout=20000)
    verifica("#" not in pp.url, "cheile au dispărut din bara de adrese")
    pp.select_option("#fs", "forestier")
    pp.select_option("#fc", "forestier|X E")
    pp.wait_for_timeout(500)
    t = pp.inner_text("#corp")
    verifica(NUME in t, "panoul arată numele deschis în browser, la Forestier X E")
    verifica("nu e în catalog" in t, "numele de probă e marcat „nu e în catalog”")
    verifica("Note la lecții" in t and "6,00" in t, "coloana „Note la lecții” arată media 6,00")
    verifica("N-au lucrat deloc" in t or "au lucrat săptămâna asta" in t, "rezumatul clasei e acolo")
    pp.close()


if __name__ == "__main__":
    sys.exit(main())
