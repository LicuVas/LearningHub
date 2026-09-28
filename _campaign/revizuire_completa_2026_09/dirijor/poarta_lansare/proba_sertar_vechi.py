"""Compatibilitatea cu progresul existent al elevilor (28.09.2026): sertare scrise de motorul de la HEAD (ce e LIVE acum)
se încarcă la fel cu motorul nou. Rețeaua închisă (regula 24). Ultima linie = nr. de probleme.
  A. sertar nesufixat (C.cheie), fără identitate: stelele se văd, nivelul următor e deschis, TOTAL corect;
  B. sertar scris de motorul HEAD, jucat (deblocheaza + un nivel terminat) pe profil + elev înscris, apoi deschis cu motorul nou;
  C. sertar nesufixat cu numele elevului + profil activ: load() îl mută în sertarul profilului (migrarea veche, neschimbată);
  D. sertar nesufixat + înscriere PRIN CASETA REALĂ: ajunge la elevul nou înscris (mutaFaraProfil), vizibil după reîncărcare;
  E. @_tinut scris de HEAD (cu u recent) + „Ești tot X?”: se vede ca „ținut deoparte”, „Da” + „Da, eu am lucrat” îl dă lui X;
  F. cheile vechi de „exersat” din tip-excel și „_vazut_” ale antrenamentului rămân neatinse la încărcare.
"""
import functools, http.server, json, subprocess, sys, threading
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8")
LH = Path(r"C:\00\Projects\LearningHub")
COMUNE = ["jocuri/_motor/motor.js", "jocuri/_motor/motor.css", "jocuri/_motor/tip-excel.js", "assets/js/prezenta.js"]
VECHI = {c: subprocess.run(["git", "-C", str(LH), "show", "HEAD:" + c], capture_output=True).stdout for c in COMUNE}
assert all(VECHI.values())
probleme = []


def V(c, ce):
    print(("  ok   " if c else "  RĂU  ") + ce, flush=True)
    if not c:
        probleme.append(ce)


class T(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(T, directory=str(LH)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f"http://127.0.0.1:{srv.server_address[1]}"
GARDA = """(() => { const ext = u => { try { const x = new URL(String(u), location.href); return /^https?:$/.test(x.protocol) && !['127.0.0.1','localhost'].includes(x.hostname); } catch (e) { return false; } };
 if (navigator.sendBeacon) { const sb = navigator.sendBeacon.bind(navigator); navigator.sendBeacon = (u, d) => ext(u) ? true : sb(u, d); }
 const f = window.fetch.bind(window); window.fetch = (u, o) => { const s = (typeof u === 'string' || u instanceof URL) ? String(u) : (u && u.url) || '';
 return ext(s) ? Promise.resolve(new Response('{}', {status: 200})) : f(u, o); }; })();"""
EXT = []


def contextul(b, vechi, stare=None):
    ctx = b.new_context(viewport={"width": 1280, "height": 900}, service_workers="block", storage_state=stare)
    ctx.add_init_script(GARDA)

    def ruta(r):
        u = r.request.url
        h = u.split("/")[2].split(":")[0] if "://" in u else ""
        if u.startswith(("data:", "blob:")):
            return r.continue_()
        if h not in ("127.0.0.1", "localhost"):
            EXT.append(u[:80])
            return r.fulfill(status=200, body="{}" if r.request.method == "POST" else "", content_type="text/plain")
        for c in COMUNE if vechi else []:
            if u.split("?")[0].endswith("/" + c):
                return r.fulfill(status=200, body=VECHI[c], content_type="text/css" if c.endswith(".css") else "application/javascript")
        return r.continue_()
    ctx.route("**/*", ruta)
    pg = ctx.new_page()
    pg.set_default_timeout(10000)
    er = []
    pg.on("pageerror", lambda e: er.append(str(e)[:200]))
    return ctx, pg, er


def stele(pg):
    return pg.evaluate("Array.from(document.querySelectorAll('.lvl')).map(b => [b.querySelectorAll('.s .on').length, b.disabled])")


def total(pg):
    return pg.evaluate("(document.getElementById('hud') || {}).innerText || ''")


JOC = "jocuri/web-viii/index.html"
with sync_playwright() as p:
    b = p.chromium.launch()

    print("A. sertar nesufixat, fără identitate (vizitator)")
    ctx, pg, er = contextul(b, False)
    pg.goto(f"{BASE}/{JOC}", wait_until="load")
    ch = pg.evaluate("JocMotor.test.config().cheie")
    pg.evaluate("k => {localStorage.clear(); localStorage.setItem('lh_prezenta', JSON.stringify({refuz: Date.now()}));"
                "localStorage.setItem(k, JSON.stringify({nume: 'Ion Pop', lv: {0: {stars: 3, xp: 40}, 1: {stars: 2, xp: 25}}}))}", ch)
    pg.reload(wait_until="load"); pg.wait_for_timeout(800)
    s = stele(pg)
    V(s[0][0] == 3 and s[1][0] == 2 and not s[2][1], f"stelele 3,2 și nivelul 3 deschis: {s[:4]}")
    V("5/" in total(pg) and "65 XP" in total(pg), f"TOTAL: {total(pg)!r}")
    V(pg.input_value("#nume") == "Ion Pop", f"numele pentru diplomă: {pg.input_value('#nume')!r}")
    V(json.loads(pg.evaluate("k => localStorage.getItem(k)", ch))["lv"]["1"]["xp"] == 25, "sertarul neatins la încărcare")
    V(not er, f"fără erori JS {er[:2]}")
    ctx.close()

    print("B. sertar scris de motorul HEAD (profil + elev înscris), deschis cu motorul nou")
    ctx, pg, er = contextul(b, True)
    pg.goto(f"{BASE}/{JOC}", wait_until="load")
    pg.evaluate("() => {localStorage.clear(); localStorage.setItem('learninghub_active_profile', 'e_vechi');"
                "localStorage.setItem('lh_sertare', JSON.stringify({'x|y|ana pop': 'e_vechi'}));"
                "localStorage.setItem('lh_prezenta', JSON.stringify({id: 'abc123', scoala: 'x', clasa: 'y', nume: 'Pop Ana', numeEnc: 'ENC', ultima: Date.now()}))}")
    pg.reload(wait_until="load"); pg.wait_for_timeout(800)
    pg.evaluate("JocMotor.test.deblocheaza()")
    pg.wait_for_timeout(200)
    k = pg.evaluate("JocMotor.test.config().cheie") + "@e_vechi"
    scris = pg.evaluate("k => localStorage.getItem(k)", k)
    V(bool(scris) and len(json.loads(scris)["lv"]) >= 3, f"HEAD a scris sertarul {k}: {str(scris)[:120]}")
    V(not er, f"HEAD fără erori {er[:2]}")
    stare = ctx.storage_state()
    ctx.close()
    ctx, pg, er = contextul(b, False, stare)
    pg.goto(f"{BASE}/{JOC}", wait_until="load"); pg.wait_for_timeout(900)
    V(pg.evaluate("JocMotor.recitire && JocMotor.recitire() === false"), "motorul NOU e cel încărcat (are recitire())")
    s = stele(pg)
    n = len(json.loads(scris)["lv"])
    V(all(x[0] == 1 for x in s[:n]) and all(not x[1] for x in s), f"toate nivelurile HEAD (1 stea) se văd și sunt deschise: {s}")
    V(pg.evaluate("k => localStorage.getItem(k)", k) == scris, "sertarul HEAD neatins la încărcare")
    V("Pop Ana" in pg.evaluate("document.getElementById('cine-lucreaza').innerText"), "„Lucrezi ca Pop Ana”")
    V(pg.evaluate("document.getElementById('lhp') && document.getElementById('lhp').innerText.includes('Ana P.')"), "eticheta arată elevul din identitatea HEAD")
    V(not er, f"fără erori JS {er[:2]}")
    ctx.close()

    print("C. sertar nesufixat cu numele elevului + profil activ: migrarea din load()")
    ctx, pg, er = contextul(b, False)
    pg.goto(f"{BASE}/{JOC}", wait_until="load")
    ch = pg.evaluate("JocMotor.test.config().cheie")
    pg.evaluate("k => {localStorage.clear(); localStorage.setItem('learninghub_active_profile', 'e_ion');"
                "localStorage.setItem('lh_sertare', JSON.stringify({'x|y|ion pop': 'e_ion'}));"
                "localStorage.setItem('lh_prezenta', JSON.stringify({id: 'i1', scoala: 'x', clasa: 'y', nume: 'Pop Ion', numeEnc: 'ENC', ultima: Date.now()}));"
                "localStorage.setItem(k, JSON.stringify({nume: 'Ion Pop', lv: {0: {stars: 3, xp: 40}}}))}", ch)
    pg.reload(wait_until="load"); pg.wait_for_timeout(800)
    V(stele(pg)[0][0] == 3, f"stelele se văd: {stele(pg)[:2]}")
    mut = pg.evaluate("k => [localStorage.getItem(k), localStorage.getItem(k + '@e_ion')]", ch)
    V(mut[0] is None and mut[1] and json.loads(mut[1])["lv"]["0"]["stars"] == 3, f"mutat în @e_ion: {mut}")
    V(not er, f"fără erori JS {er[:2]}")
    ctx.close()

    print("D. sertar nesufixat + înscriere prin caseta reală")
    ctx, pg, er = contextul(b, False)
    pg.goto(f"{BASE}/{JOC}", wait_until="load")
    ch = pg.evaluate("JocMotor.test.config().cheie")
    pg.evaluate("k => {localStorage.clear(); localStorage.setItem(k, JSON.stringify({nume: '', lv: {0: {stars: 2, xp: 30}, 1: {stars: 3, xp: 50}}}))}", ch)
    pg.reload(wait_until="load"); pg.wait_for_timeout(800)
    V([x[0] for x in stele(pg)[:2]] == [2, 3], f"înainte de înscriere se văd: {stele(pg)[:3]}")
    pg.click("#lhp-cine")
    pg.wait_for_function("document.querySelector('#lhp-s').options.length > 2")
    sc = pg.evaluate("Array.from(document.querySelector('#lhp-s').options).map(o => o.value).filter(v => v && v !== 'alta')[0]")
    pg.select_option("#lhp-s", sc)
    pg.wait_for_function("!document.querySelector('#lhp-c').disabled")
    pg.select_option("#lhp-c", pg.evaluate("Array.from(document.querySelector('#lhp-c').options).map(o => o.value).filter(Boolean)[0]"))
    pg.fill("#lhp-n", "Ionescu Dan"); pg.fill("#lhp-k", "1234")
    with pg.expect_navigation(timeout=15000):
        pg.click("#lhp-ok")
    pg.wait_for_selector("#lhp-pill"); pg.wait_for_timeout(600)
    prof = pg.evaluate("localStorage.getItem('learninghub_active_profile')")
    V([x[0] for x in stele(pg)[:2]] == [2, 3], f"după înscriere, progresul e al lui (profil {prof}): {stele(pg)[:3]}")
    V(pg.evaluate("k => localStorage.getItem(k) === null", ch), "cheia nesufixată a fost mutată, nu copiată de două ori")
    V(not er, f"fără erori JS {er[:2]}")
    ctx.close()

    print("E. @_tinut scris de HEAD + „Ești tot X?” (motorul nou)")
    ctx, pg, er = contextul(b, False)
    pg.goto(f"{BASE}/{JOC}", wait_until="load")
    ch = pg.evaluate("JocMotor.test.config().cheie")
    pg.evaluate("k => {localStorage.clear(); localStorage.setItem('learninghub_active_profile', 'e_x');"
                "localStorage.setItem('lh_sertare', JSON.stringify({'x|y|ana pop': 'e_x'}));"
                "localStorage.setItem('lh_prezenta', JSON.stringify({id: 'x1', scoala: 'x', clasa: 'y', nume: 'Pop Ana', numeEnc: 'ENC', ultima: Date.now(), intreaba: true}));"
                "localStorage.setItem(k + '@e_x', JSON.stringify({nume: 'Pop Ana', lv: {0: {stars: 3, xp: 40}}}));"
                "localStorage.setItem(k + '@_tinut', JSON.stringify({nume: '', lv: {1: {stars: 2, xp: 20}}, u: Date.now()}))}", ch)
    pg.reload(wait_until="load"); pg.wait_for_timeout(900)
    V("ținut deoparte" in pg.evaluate("document.querySelector('.lvl[data-l=\"1\"]').innerText"), "nivelul 2 apare „ținut deoparte”")
    V(pg.locator("#lhp-da").count() == 1, "caseta „Ești tot Pop Ana?”")
    pg.click("#lhp-da"); pg.wait_for_timeout(300)
    V(pg.locator("#lhp-da2").count() == 1, "a doua întrebare „Ai lucrat TU asta?”")
    pg.click("#lhp-da2"); pg.wait_for_timeout(500)
    x = json.loads(pg.evaluate("k => localStorage.getItem(k + '@e_x')", ch))
    V(sorted(x["lv"]) == ["0", "1"], f"după „Da, eu am lucrat”, X are nivelurile 1-2: {x}")
    V([s[0] for s in stele(pg)[:2]] == [3, 2], f"cuprinsul redesenat: {stele(pg)[:3]}")
    V(not er, f"fără erori JS {er[:2]}")
    ctx.close()

    print("F. cheile de exersat (tip-excel) și _vazut_ (antrenament) neatinse")
    ctx, pg, er = contextul(b, False)
    pg.goto(f"{BASE}/jocuri/excel-antrenament-viii/index.html", wait_until="load")
    ch = pg.evaluate("JocMotor.test.config().cheie")
    pg.evaluate("k => {localStorage.clear(); localStorage.setItem('lh_prezenta', JSON.stringify({refuz: Date.now()}));"
                "localStorage.setItem('lh_excel_exersat|abc', JSON.stringify({serie: 2, stapanit: false}));"
                "localStorage.setItem(k + '_vazut_0', JSON.stringify([0, 1, 2]))}", ch)
    snap = pg.evaluate("JSON.stringify(Object.entries(localStorage).sort())")
    pg.reload(wait_until="load"); pg.wait_for_timeout(800)
    V(pg.evaluate("JSON.stringify(Object.entries(localStorage).sort())") == snap, "localStorage identic după încărcare")
    V(not er, f"fără erori JS {er[:2]}")
    ctx.close()
    b.close()
srv.shutdown()
print("externe oprite:", sorted(set(EXT)))
print(len(probleme))
