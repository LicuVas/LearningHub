"""PROBA PROPRIE a porții de lansare (28.09.2026), independentă de probele autorilor.

  python proba_poarta.py <390|1280> <gol|progres|fara>      -> poarta_<lat>_<stare>.json ; ultima linie = nr. de probleme

Pe TOATE paginile (27 de jocuri + lecțiile m1-l0* publicate + v/m1-l01 + viii/m1-l02), server local, rețeaua închisă:
  - 0 erori JS (pageerror + console.error care nu sunt cereri oprite);
  - pagina pornește (innerText > 300);
  - nimic mai lat decât ecranul (scrollWidth > clientWidth);
  - butoanele de nivel / pas / „Verifică” / variantele nu sunt acoperite de eticheta prezenta.js (#lhp),
    întâi FĂRĂ derulare (cum le vede elevul după desen), apoi derulate la marginea de jos a ecranului;
  - o întrebare jucată până la „Corect” (clic real pe varianta corectă la choice/tf, altfel rezolvitorul motorului
    + clic real pe „Verifică”);
  - stările: gol = localStorage gol la fiecare pagină; fara/progres = elev înscris PRIN CASETA REALĂ (formularul din
    prezenta.js) o dată pe context; progres = plus sertarul jocului (format HEAD: {nume, lv:{0:{stars,xp}}}) pe profilul lui;
  - la jocuri (nu la lecții), în plus ?recitire=1: pornește, fără erori, fără lățime în plus, fără etichetă și fără să
    scrie NIMIC în localStorage.
REGULA 24: route pe context (tot ce nu e 127.0.0.1/localhost primește răspuns local), garda din pagină pentru
sendBeacon/fetch/XMLHttpRequest, service workers blocați; închidere DOAR cu ctx.close()/browser.close().
"""
import functools
import http.server
import json
import sys
import threading
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

LH = Path(r"C:\00\Projects\LearningHub")
AICI = Path(__file__).resolve().parent
LAT, STARE = sys.argv[1], sys.argv[2]
NUME = "Popescu Ana-Maria"


def pagini():
    out = []
    for d in sorted((LH / "jocuri").iterdir()):
        f = d / "index.html"
        if d.is_dir() and not d.name.startswith("_") and f.exists() and "_motor/motor.js" in f.read_text(encoding="utf-8"):
            out.append(("joc", f"jocuri/{d.name}/index.html"))
    plan = json.loads((LH / "lectii" / "plan.json").read_text(encoding="utf-8"))
    lec = []

    def walk(o):
        if isinstance(o, dict):
            if "cale" in o and "stare" in o and "/m1-l0" in o["cale"] and o["stare"] == "publicat":
                lec.append(o["cale"])
            for v in o.values():
                walk(v)
        elif isinstance(o, list):
            for v in o:
                walk(v)
    walk(plan)
    lec += ["lectii/v/m1-l01/", "lectii/viii/m1-l02/"]
    for c in sorted(set(lec)):
        out.append(("lectie", c.rstrip("/") + "/index.html"))
    import os
    f = os.environ.get("FILTRU")
    return [x for x in out if not f or any(s in x[1] for s in f.split(","))]


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


GARDA = r"""(() => {
  window.__ext = [];
  const ext = u => { try { const x = new URL(String(u), location.href); return /^https?:$/.test(x.protocol) && !['127.0.0.1','localhost'].includes(x.hostname); } catch (e) { return false; } };
  if (navigator.sendBeacon) { const sb = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (u, d) => { if (ext(u)) { window.__ext.push('beacon ' + u); return true; } return sb(u, d); }; }
  const f = window.fetch.bind(window);
  window.fetch = (u, o) => { const s = (typeof u === 'string' || u instanceof URL) ? String(u) : (u && u.url) || '';
    if (ext(s)) { window.__ext.push('fetch ' + s); return Promise.resolve(new Response('{}', {status: 200, headers: {'content-type': 'application/json'}})); }
    return f(u, o); };
  const xo = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (m, u) { if (ext(u)) { window.__ext.push('xhr ' + u); arguments[1] = 'data:,'; } return xo.apply(this, arguments); };
})();"""

EXTERNE = []
# BAZA=HEAD: aceleași probe cu componentele comune de la HEAD (ce e acum LIVE), ca să se vadă ce e NOU
import os
import subprocess
BAZA = os.environ.get("BAZA") == "HEAD"
COMUNE = ["jocuri/_motor/motor.js", "jocuri/_motor/motor.css", "jocuri/_motor/tip-excel.js", "assets/js/prezenta.js"]
VECHI = {c: subprocess.run(["git", "-C", str(LH), "show", "HEAD:" + c], capture_output=True).stdout for c in COMUNE} if BAZA else {}


def ruta(r):
    u = r.request.url
    if u.startswith(("data:", "blob:")):
        return r.continue_()
    h = u.split("/")[2].split(":")[0] if "://" in u else ""
    if h in ("127.0.0.1", "localhost"):
        cale = u.split("?")[0].split("#")[0]
        for c in COMUNE if BAZA else []:
            if cale.endswith("/" + c):
                return r.fulfill(status=200, body=VECHI[c], content_type="text/css; charset=utf-8" if c.endswith(".css") else "application/javascript; charset=utf-8")
        return r.continue_()
    EXTERNE.append(r.request.method + " " + u[:120])
    ct = "text/css" if ".css" in u or "fonts.googleapis" in u else "application/json" if r.request.method == "POST" else "text/plain"
    return r.fulfill(status=200, content_type=ct, body="{}" if r.request.method == "POST" else "")


ACOPERIT = r"""(el) => {
  const r = el.getBoundingClientRect(), W = document.documentElement.clientWidth, H = innerHeight;
  const cs = getComputedStyle(el);
  if (!r.width || !r.height || cs.visibility === 'hidden' || cs.display === 'none') return {vis: false};
  const lhp = document.getElementById('lhp');
  const pts = [[.5,.5],[.2,.3],[.8,.3],[.2,.7],[.8,.7]], out = [];
  for (const [fx, fy] of pts) {
    const x = r.left + r.width * fx, y = r.top + r.height * fy;
    if (x < 0 || y < 0 || x >= W || y >= H) { out.push('afara'); continue; }
    const h = document.elementFromPoint(x, y);
    if (!h) { out.push('nimic'); continue; }
    if (h === el || el.contains(h)) { out.push('ok'); continue; }
    if (lhp && lhp.contains(h)) { out.push('ETICHETA'); continue; }
    out.push('alt:' + h.tagName + (h.id ? '#' + h.id : '') + (typeof h.className === 'string' && h.className ? '.' + h.className.split(' ')[0] : ''));
  }
  return {vis: true, pts: out, w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), lhp: lhp ? lhp.className : null,
          lhpTxt: lhp ? (lhp.innerText || '').slice(0, 60) : null};
}"""

LATIME = r"""() => {
  const W = document.documentElement.clientWidth, sw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
  if (sw <= W + 1) return null;
  const bad = [];
  for (const e of document.querySelectorAll('body *')) {
    const r = e.getBoundingClientRect(); if (r.right <= W + 1 || !r.width) continue;
    let p = e.parentElement, clip = false;
    while (p && p !== document.body) { const o = getComputedStyle(p).overflowX; if (o !== 'visible') { clip = true; break; } p = p.parentElement; }
    if (!clip) bad.push(e.tagName + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className ? '.' + e.className.split(' ')[0] : '') + ' ' + Math.round(r.right));
    if (bad.length > 4) break;
  }
  return {W, sw, bad};
}"""

ALES = "Array.from(document.querySelectorAll(%s)).filter(e => e.offsetParent !== null)"


def main():
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=str(LH)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{srv.server_address[1]}"
    mobil = LAT == "390"
    rez, probleme, info = {}, [], []

    def P(pag, ce):
        probleme.append(f"{pag} :: {ce}")
        rez.setdefault(pag, {}).setdefault("probleme", []).append(ce)

    with sync_playwright() as p:
        b = p.chromium.launch()
        opt = dict(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True, device_scale_factor=2.625,
                   user_agent=p.devices["Pixel 7"]["user_agent"]) if mobil else dict(viewport={"width": 1280, "height": 900})
        ctx = b.new_context(service_workers="block", **opt)
        ctx.route("**/*", ruta)
        ctx.add_init_script(GARDA)
        pg = ctx.new_page()
        pg.set_default_timeout(8000)
        erori = []
        pg.on("pageerror", lambda e: erori.append("pageerror: " + str(e)[:200]))
        pg.on("console", lambda m: erori.append("console: " + m.text[:200]) if m.type == "error" and "Failed to load resource" not in m.text else None)
        apasa = (lambda loc: loc.tap(timeout=5000)) if mobil else (lambda loc: loc.click(timeout=5000))

        def acoperire(pag, loc, eticheta, derulat):
            try:
                h = loc.element_handle(timeout=2000)
            except Exception:
                return
            if derulat:
                h.evaluate("el => el.scrollIntoView({block: 'end', inline: 'nearest'})")
                pg.wait_for_timeout(350)
            m = h.evaluate(ACOPERIT)
            if not m.get("vis"):
                return
            pts = m["pts"]
            if pts[0] == "ETICHETA" or pts.count("ETICHETA") >= 2:
                P(pag, f"„{eticheta}” ACOPERIT de eticheta ({'derulat jos' if derulat else 'fără derulare'}): {pts} #lhp.{m['lhp']} „{m['lhpTxt']}”")
            elif pts[0].startswith("alt:"):
                info.append(f"{pag} :: „{eticheta}” centrul lovește {pts[0]} ({'derulat' if derulat else 'fără derulare'})")
            return m

        def butoane_vizibile(sel):
            return pg.evaluate(f"() => {ALES % json.dumps(sel)}.filter(e => {{const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.width > 0}}).length")

        def verif_pas(pag, faza):
            # FĂRĂ derulare: ce e deja pe ecran după desen (eticheta s-a poziționat singură)
            pg.wait_for_timeout(450)
            for sel, et in (("#pas-next", "Pasul următor"), ("#go", "#go"), ("#chk", "Verifică"), (".tabs button", "buton de pas (bara)"),
                            (".opt", "variantă"), (".lvl", "nivel din cuprins"), ("#rec-next", "Pasul următor (recitire)")):
                n = pg.locator(sel).count()
                for i in range(min(n, 6)):
                    loc = pg.locator(sel).nth(i)
                    try:
                        vis = loc.is_visible()
                    except Exception:
                        vis = False
                    if not vis:
                        continue
                    inview = loc.evaluate("e => {const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight}")
                    if inview:
                        acoperire(pag, loc, f"{et} [{faza}]", False)
            # DERULAT: butoanele principale aduse la marginea de jos a ecranului, unde stă eticheta
            for sel, et in (("#pas-next", "Pasul următor"), ("#go", "#go"), ("#chk", "Verifică"), (".tabs button", "buton de pas (bara)")):
                if pg.locator(sel).count() and pg.locator(sel).first.is_visible():
                    acoperire(pag, pg.locator(sel).first, f"{et} [{faza}]", True)

        # ---------- înscrierea PRIN CASETA REALĂ ----------
        if STARE in ("progres", "fara"):
            pg.goto(f"{base}/jocuri/web-viii/index.html", wait_until="load")
            pg.evaluate("localStorage.clear()")
            pg.reload(wait_until="load"); pg.wait_for_timeout(800)
            if pg.locator("#lhp-cine").count() == 0 and pg.locator("#lhp-cere").count():
                apasa(pg.locator("#lhp-cere"))
            apasa(pg.locator("#lhp-cine"))
            pg.wait_for_function("document.querySelector('#lhp-s') && document.querySelector('#lhp-s').options.length > 2")
            sc = pg.evaluate("Array.from(document.querySelector('#lhp-s').options).map(o => o.value).filter(v => v && v !== 'alta')[0]")
            pg.select_option("#lhp-s", sc)
            pg.wait_for_function("!document.querySelector('#lhp-c').disabled && document.querySelector('#lhp-c').options.length > 1")
            cl = pg.evaluate("Array.from(document.querySelector('#lhp-c').options).map(o => o.value).filter(Boolean)[0]")
            pg.select_option("#lhp-c", cl)
            pg.fill("#lhp-n", NUME); pg.fill("#lhp-k", "4827")
            try:
                with pg.expect_navigation(timeout=15000):
                    apasa(pg.locator("#lhp-ok"))
            except Exception as e:
                info.append(f"înscriere: fără reîncărcare ({str(e)[:80]})")
            pg.wait_for_selector("#lhp-pill", timeout=15000)
            ident = pg.evaluate("[JSON.parse(localStorage.getItem('lh_prezenta')), localStorage.getItem('learninghub_active_profile')]")
            if not (ident[0] and ident[0].get("id") and ident[0].get("numeEnc") and ident[0].get("nume") == NUME and ident[1]):
                P("înscriere", f"identitatea nu s-a pus prin casetă: {str(ident)[:200]}")
            rez["_inscriere"] = {"scoala": sc, "clasa": cl, "profil": ident[1]}
            PROFIL = ident[1]
        erori.clear()

        for tip, cale in pagini():
            pag = cale.replace("/index.html", "")
            t0 = time.time()
            url = f"{base}/{cale}"
            erori.clear()
            try:
                if STARE == "gol":
                    pg.goto(url, wait_until="load"); pg.evaluate("localStorage.clear();sessionStorage.clear()")
                    pg.reload(wait_until="load")
                elif STARE == "progres":
                    pg.goto(url, wait_until="load"); pg.wait_for_timeout(300)
                    ch = pg.evaluate("JocMotor.test.config().cheie")
                    pg.evaluate("([k, n]) => localStorage.setItem(k, JSON.stringify({nume: n, lv: {0: {stars: 3, xp: 40}}}))", [ch + "@" + PROFIL, NUME])
                    pg.reload(wait_until="load")
                else:
                    pg.goto(url, wait_until="load")
                pg.wait_for_timeout(900)
                r = rez.setdefault(pag, {})
                txt = pg.evaluate("document.body.innerText.length")
                r["text"] = txt
                if txt <= 300:
                    P(pag, f"text {txt} <= 300 (nu pornește?)")
                w = pg.evaluate(LATIME)
                if w:
                    P(pag, f"mai lat decât ecranul (cuprins): {w}")
                # identitatea așa cum se vede
                lhp = pg.evaluate("(() => {const e = document.getElementById('lhp'); return e ? [e.className, e.innerText.slice(0, 90)] : null})()")
                r["eticheta"] = lhp
                if STARE in ("progres", "fara"):
                    if not lhp or "Popescu" not in (lhp[1] or "") and "Ana-Maria" not in (lhp[1] or ""):
                        P(pag, f"eticheta nu arată elevul înscris: {lhp}")
                    cine = pg.evaluate("(document.getElementById('cine-lucreaza') || {}).innerText || ''")
                    if NUME not in cine:
                        P(pag, f"„cine lucrează” nu-l arată pe {NUME}: {cine[:120]!r}")
                    if "Ești tot" in (lhp[1] if lhp else ""):
                        P(pag, "elevul abia înscris primește „Ești tot X?”")
                else:
                    if not lhp:
                        P(pag, "profil gol: nu apare caseta/eticheta „Spune cine ești”")
                stele = pg.evaluate("document.querySelectorAll('.lvl[data-l=\"0\"] .s .on').length")
                if STARE == "progres" and stele != 3:
                    P(pag, f"progresul din sertar nu se vede: nivelul 1 are {stele} stele în loc de 3")
                if STARE != "progres" and stele:
                    P(pag, f"stele pe nivelul 1 fără progres: {stele}")
                verif_pas(pag, "cuprins")
                # nivelul 1: apăsare REALĂ
                lv0 = pg.locator('.lvl[data-l="0"]')
                try:
                    apasa(lv0)
                except Exception as e:
                    P(pag, f"butonul nivelului 1 nu se poate apăsa: {str(e).splitlines()[0][:160]}")
                    lv0.evaluate("e => e.click()")
                pg.wait_for_timeout(400)
                faza0 = pg.evaluate("JocMotor.test.stare() && JocMotor.test.stare().phase")
                verif_pas(pag, f"nivel/{faza0}")
                if pg.evaluate(LATIME):
                    P(pag, f"mai lat decât ecranul ({faza0}): {pg.evaluate(LATIME)}")
                # spre verificare: #go / #pas-next, cu apăsări reale
                for _ in range(8):
                    st = pg.evaluate("JocMotor.test.stare()")
                    if st and st["phase"] == "q":
                        break
                    tinta = "#go" if pg.locator("#go").count() and pg.locator("#go").first.is_visible() else "#pas-next"
                    try:
                        apasa(pg.locator(tinta).first)
                    except Exception as e:
                        P(pag, f"„{tinta}” nu se poate apăsa ({st and st['phase']}): {str(e).splitlines()[0][:160]}")
                        pg.locator(tinta).first.evaluate("e => e.click()")
                    pg.wait_for_timeout(350)
                st = pg.evaluate("JocMotor.test.stare()")
                if not st or st["phase"] != "q":
                    P(pag, f"n-am ajuns la verificare: {st}")
                    continue
                verif_pas(pag, "întrebarea 1")
                if pg.evaluate(LATIME):
                    P(pag, f"mai lat decât ecranul (întrebare): {pg.evaluate(LATIME)}")
                q = pg.evaluate("(() => {const s = JocMotor.test.stare(), Q = JocMotor.test.config().nivele[s.li].qs[s.qi]; return {t: Q.t, ok: Q.ok}})()")
                r["tip"] = q["t"]
                if q["t"] in ("choice", "tf"):
                    k = q["ok"] if q["t"] == "choice" else (0 if q["ok"] else 1)
                    loc = pg.locator(f'#body .opt[data-k="{k}"]')
                    acoperire(pag, loc, "varianta corectă", True)
                    apasa(loc)
                else:
                    if not pg.evaluate("JocMotor.test.rezolva()"):
                        P(pag, f"tipul {q['t']} nu are rezolvitor: nu pot juca întrebarea")
                pg.wait_for_timeout(250)
                chk = pg.locator("#chk")
                if chk.count() and chk.is_visible() and chk.is_enabled():
                    acoperire(pag, chk, "Verifică", True)
                    try:
                        apasa(chk)
                    except Exception as e:
                        P(pag, f"„Verifică” nu se poate apăsa: {str(e).splitlines()[0][:160]}")
                        chk.evaluate("e => e.click()")
                pg.wait_for_timeout(500)
                fb = pg.evaluate("(document.getElementById('fb') || {}).innerText || ''")
                r["fb"] = fb[:80]
                if "Corect" not in fb:
                    P(pag, f"întrebarea 1 ({q['t']}) nu ajunge la „Corect”: {fb[:120]!r}")
                if erori:
                    P(pag, f"erori JS: {erori[:3]}"); erori.clear()
                # ?recitire=1 (doar jocurile): nu scrie nimic, fără etichetă
                if tip == "joc":
                    # pagina neutră (fără scripturi): descărcarea paginii de dinainte (pagehide -> prezenta.js) se termină aici
                    pg.goto(f"{base}/jocuri/README.md", wait_until="load"); pg.wait_for_timeout(200)
                    ls0 = pg.evaluate("JSON.stringify(Object.keys(localStorage).sort().map(k => [k, k.startsWith('lh_prezenta') && k !== 'lh_prezenta' ? '' : localStorage.getItem(k)]))")
                    pg.goto(url + "?recitire=1", wait_until="load"); pg.wait_for_timeout(900)
                    tr = pg.evaluate("document.body.innerText.length")
                    if tr <= 300 and "nu are pași" not in pg.evaluate("document.body.innerText"):
                        P(pag, f"?recitire=1: text {tr}")
                    if pg.evaluate(LATIME):
                        P(pag, f"?recitire=1 mai lat decât ecranul: {pg.evaluate(LATIME)}")
                    if pg.evaluate("!!document.getElementById('lhp')"):
                        P(pag, "?recitire=1: apare eticheta prezenta.js (n-ar trebui să se încarce)")
                    if pg.locator("#rec-next").count() and pg.locator("#rec-next").is_enabled():
                        apasa(pg.locator("#rec-next")); pg.wait_for_timeout(300)
                    # „Încearcă tu” din recitire, rezolvat: tot nu trebuie să scrie nimic
                    try:
                        if pg.locator("#pq").count() and pg.evaluate("(() => {try {return JocMotor.test.rezolva()} catch (e) {return false}})()"):
                            pg.wait_for_timeout(200)
                            if pg.locator("#chk").count() and pg.locator("#chk").is_enabled():
                                pg.locator("#chk").evaluate("e => e.click()")
                            pg.wait_for_timeout(300)
                            rez[pag]["recitire_exercitiu"] = pg.evaluate("(document.getElementById('fb') || {}).innerText || ''")[:60]
                    except Exception as e:
                        rez[pag]["recitire_exercitiu"] = "exceptie " + str(e)[:80]
                    if erori:
                        P(pag, f"?recitire=1 erori JS: {erori[:3]}"); erori.clear()
                    pg.goto(f"{base}/jocuri/README.md", wait_until="load"); pg.wait_for_timeout(200)
                    ls1 = pg.evaluate("JSON.stringify(Object.keys(localStorage).sort().map(k => [k, k.startsWith('lh_prezenta') && k !== 'lh_prezenta' ? '' : localStorage.getItem(k)]))")
                    if ls0 != ls1:
                        a, bb = dict(json.loads(ls0)), dict(json.loads(ls1))
                        dif = [k for k in set(a) | set(bb) if a.get(k) != bb.get(k)]
                        P(pag, f"?recitire=1 a schimbat localStorage: {dif[:5]}")
                ex = pg.evaluate("window.__ext || []")
                if ex:
                    r["ext_garda"] = ex[:5]
                if erori:
                    P(pag, f"erori JS: {erori[:3]}")
            except Exception as e:
                P(pag, f"EXCEPȚIE în probă: {str(e).splitlines()[0][:200]}")
            rez.setdefault(pag, {})["sec"] = round(time.time() - t0, 1)
        ctx.close()
        b.close()
    srv.shutdown()
    rez["_externe_oprite"] = sorted(set(x.split("?")[0] for x in EXTERNE))
    rez["_info"] = info
    (AICI / f"poarta_{LAT}_{STARE}{'_HEAD' if BAZA else ''}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding="utf-8")
    n = len([k for k in rez if not k.startswith("_")])
    for x in probleme:
        print("PROBLEMĂ", x)
    print(f"{LAT} {STARE}: {n} pagini, externe oprite: {rez['_externe_oprite'][:6]}, info: {len(info)}")
    print(len(probleme))


if __name__ == "__main__":
    main()
