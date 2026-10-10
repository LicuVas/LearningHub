# -*- coding: utf-8 -*-
"""Proba de browser a paginii „Cum fac…?” (contract R7, I3, I4, I7, I9; SPEC.md).

    python C:/00/Projects/LearningHub/cum-fac/_teste/proba_browser.py

Server local pe portul 0 (portul îl alege sistemul; pe Windows allow_reuse_address=False, ca să nu răspundă alt
server de pe același port), Chromium fără ecran, User-Agent neutru (regula 22) și TOATE cererile care nu merg spre
127.0.0.1/localhost blocate și numărate (regula 24; contract I3: trebuie 0).
Măsoară: cereri externe încercate, timpul de la tastare la rezultate (căutare + desenare, în pagină), primul rezultat
deasupra marginii de jos la 1366×768 și la 390×844 (capturi în _teste/capturi/), deschiderea fișei în aceeași pagină,
„Înapoi” care păstrează căutarea, săgeți + Enter, „n-am găsit” cu 3 propuneri și răsfoirea, tema întunecată și cea
luminoasă, zonele de atins ≥ 32 px pe telefon, fără derulare orizontală, textul fișelor escapat corect (o fișă de
probă cu <title>, &lt;&gt;, ghilimele, injectată doar în proba asta), viteza pe 300 de fișe, erorile JS din consolă.
Ultima linie = numărul de probleme.
"""
import json
import os
import re
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, quote

from playwright.sync_api import sync_playwright

LH = "C:/00/Projects/LearningHub"
CAPTURI = os.path.join(LH, "cum-fac", "_teste", "capturi")
UA = "LearningHub-lectii/1.0 (educational site)"
INTREBARE = "cum salvez un fisier excel"      # exemplul profesorului (R5), fără diacritice
AFARA = "cum fac clatite"

probleme = []
info = []


def P(m):
    probleme.append(m)
    print("  ✗", m)


def OK(m):
    print("  ✓", m)


class Tacut(SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def porneste_server():
    ThreadingHTTPServer.allow_reuse_address = False
    srv = ThreadingHTTPServer(("127.0.0.1", 0), partial(Tacut, directory=LH))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv


def citeste_date():
    t = open(os.path.join(LH, "cum-fac", "date.js"), encoding="utf-8").read()
    i = t.index("window.CUM_FAC_DATE = ") + len("window.CUM_FAC_DATE = ")
    return json.loads(t[i:t.rstrip().rindex(";")])


def main():
    os.makedirs(CAPTURI, exist_ok=True)
    date = citeste_date()
    fise = date["fise"]
    if not fise:
        P("date.js nu are nicio fișă (rulează _build/build.mjs)")
        print(len(probleme))
        return
    srv = porneste_server()
    baza = f"http://127.0.0.1:{srv.server_address[1]}/cum-fac/"
    externe = []
    erori_js = []
    inlocuiri = {}   # cale -> conținut servit în locul fișierului (doar pentru probele de escapare / 300 de fișe)

    def ruta(route):
        u = urlparse(route.request.url)
        if u.hostname not in ("127.0.0.1", "localhost"):
            externe.append(route.request.url)
            return route.abort()
        if u.path in inlocuiri:
            return route.fulfill(status=200, content_type="application/javascript; charset=utf-8", body=inlocuiri[u.path])
        return route.continue_()

    with sync_playwright() as pw:
        br = pw.chromium.launch()

        def context(**kw):
            ctx = br.new_context(user_agent=UA, **kw)
            ctx.route("**/*", ruta)
            return ctx

        def pagina(ctx):
            pg = ctx.new_page()
            pg.on("console", lambda m: m.type == "error" and erori_js.append(m.text))
            pg.on("pageerror", lambda e: erori_js.append(str(e)))
            pg.on("dialog", lambda d: (erori_js.append("dialog: " + d.message), d.dismiss()))
            return pg

        def gata(pg):
            pg.wait_for_function("window.__cumFac && window.__cumFac.gata === true", timeout=15000)

        # ------------------------------------------------------------ 1. laborator 1366×768
        ctx = context(viewport={"width": 1366, "height": 768}, color_scheme="dark")
        pg = pagina(ctx)
        pg.goto(baza, wait_until="load")
        gata(pg)
        info.append(f"indexul: {pg.evaluate('window.__cumFac.msIndex')} ms pentru {len(fise)} fișe")
        if pg.locator('[data-marcaj="cum-fac-2026-10"]').count() != 1:
            P("lipsește marcajul paginii (data-marcaj=cum-fac-2026-10)")
        # răsfoirea, fără căutare
        apps = sorted({f["aplicatie"] for f in fise})
        n_det = pg.locator("#rasfoire details").count()
        if n_det != len(apps):
            P(f"răsfoirea are {n_det} secțiuni, aștept {len(apps)} (câte aplicații au fișe)")
        else:
            OK(f"fără căutare: răsfoire pe {n_det} aplicații, cu numărul de fișe")
        pg.evaluate("window.__fara_reincarcare = 1")
        pg.click("#q")
        pg.keyboard.type(INTREBARE, delay=40)
        pg.wait_for_function("document.querySelectorAll('#rezultate a.r').length > 0", timeout=5000)
        cautari = pg.evaluate("window.__cumFac.cautari")
        ms = [c["ms"] for c in cautari]
        if not ms or max(ms) >= 100:
            P(f"timpul de la tastare la rezultate: maxim {max(ms) if ms else '—'} ms (prag 100)")
        else:
            OK(f"de la tastare la rezultate (căutare + desenare): mediu {sum(ms) / len(ms):.1f} ms, maxim {max(ms):.1f} ms, {len(ms)} taste")
        info.append(f"timp tastare->rezultate: maxim {max(ms):.1f} ms")
        primul = pg.evaluate("window.__cumFac.cautari[window.__cumFac.cautari.length-1].primul")
        box = pg.locator("#r0").bounding_box()
        pg.screenshot(path=os.path.join(CAPTURI, "rezultate_1366x768.png"))
        if not box or box["y"] + box["height"] > 768:
            P(f"1366×768: primul rezultat nu e întreg deasupra marginii de jos ({box})")
        else:
            OK(f"1366×768: primul rezultat ({primul}) se vede fără derulare: de la {box['y']:.0f} la {box['y'] + box['height']:.0f} px")
        # în listă: aplicația, titlul, scurtătura, primii 2 pași
        f0 = next(f for f in fise if f["id"] == primul)
        r0 = pg.locator("#r0")
        if r0.locator(".ap").count() != 1 or r0.locator(".t").count() != 1 or r0.locator("ol li").count() != min(2, len(f0["pasi"])):
            P("rezultatul din listă nu arată aplicația, titlul și primii 2 pași")
        if f0["scurtatura"] and r0.locator(".sc kbd").count() == 0:
            P("rezultatul din listă nu arată scurtătura cu <kbd>")
        # săgeți + Enter
        pg.keyboard.press("ArrowDown")
        if "activ" not in (pg.get_attribute("#r0", "class") or ""):
            P("săgeata jos nu marchează primul rezultat")
        n_rez = pg.locator("#rezultate a.r").count()
        if n_rez > 1:
            pg.keyboard.press("ArrowDown")
            if "activ" not in (pg.get_attribute("#r1", "class") or ""):
                P("a doua săgeată jos nu trece pe al doilea rezultat")
            pg.keyboard.press("ArrowUp")
        pg.keyboard.press("Enter")
        pg.wait_for_selector("#vedere-fisa:not([hidden]) article.fisa", timeout=5000)
        if pg.evaluate("window.__fara_reincarcare") != 1:
            P("fișa s-a deschis cu o încărcare nouă a paginii (trebuie în aceeași pagină)")
        h = urlparse(pg.url)
        if h.fragment != primul or "q=" not in h.query:
            P(f"adresa după deschiderea fișei nu e ?q=…#{primul}: {pg.url}")
        n_pasi = pg.locator("article.fisa ol.pasi li").count()
        if n_pasi != len(f0["pasi"]):
            P(f"fișa arată {n_pasi} pași, are {len(f0['pasi'])}")
        else:
            OK(f"Enter deschide fișa în aceeași pagină: {n_pasi} pași, adresa {h.query}#{h.fragment}")
        ex = pg.locator("#exersezi")
        if ex.count() != 1:
            P("fișa n-are legătura „Exersezi în lecția …”")
        else:
            href = ex.get_attribute("href")
            astept = "../" + f0["sursa"]["cale"] + "?vezi=" + f0["sursa"]["pas"]
            if href != astept:
                P(f"legătura spre lecție e {href}, aștept {astept}")
            numar = f0["sursa"]["pas"].lstrip("p")
            text_leg = ex.inner_text()
            if f"lecția {f0['lectia']} (clasa {f0['clasa']}): pasul P{numar}" not in text_leg and f0["sursa"]["pas"] != "real":
                P(f"textul legăturii nu e „Exersezi în lecția N (clasa …): pasul Px «…»”: {text_leg}")
            r = pg.request.get(baza + href)
            if r.status != 200:
                P(f"lecția din legătură răspunde {r.status}")
            else:
                OK(f"„Exersezi…” duce la {href} (lecția răspunde 200)")
        pg.screenshot(path=os.path.join(CAPTURI, "fisa_1366x768.png"), full_page=True)
        # „Înapoi” (al browserului) păstrează căutarea
        pg.go_back()
        pg.wait_for_selector("#vedere-cautare:not([hidden])", timeout=5000)
        val = pg.input_value("#q")
        if val != INTREBARE or pg.locator("#rezultate a.r").count() == 0 or pg.evaluate("window.__fara_reincarcare") != 1:
            P(f"„Înapoi” nu păstrează căutarea: căsuța „{val}”, {pg.locator('#rezultate a.r').count()} rezultate")
        else:
            OK("„Înapoi” al browserului revine la aceeași căutare, cu rezultatele, fără reîncărcare")
        # clic pe rezultat + butonul „Înapoi la căutare”
        pg.click("#r0")
        pg.wait_for_selector("#vedere-fisa:not([hidden]) article.fisa", timeout=5000)
        pg.click("#inapoi")
        pg.wait_for_selector("#vedere-cautare:not([hidden])", timeout=5000)
        if pg.input_value("#q") != INTREBARE or pg.locator("#rezultate a.r").count() == 0:
            P("butonul „Înapoi la căutare” nu păstrează căutarea")
        else:
            OK("clic pe rezultat deschide fișa; „Înapoi la căutare” păstrează căutarea")
        # captura din fișă se încarcă (dacă o fișă din date are captură)
        cu_poza = next((f for f in fise if f.get("captura")), None)
        if cu_poza:
            pg.evaluate(f"location.hash = {json.dumps(cu_poza['id'])}")
            pg.wait_for_selector("figure.captura img", timeout=5000)
            pg.locator("figure.captura img").scroll_into_view_if_needed()
            pg.wait_for_function("(() => { const i = document.querySelector('figure.captura img'); return i && i.complete; })()", timeout=8000)
            if pg.evaluate("document.querySelector('figure.captura img').naturalWidth") == 0:
                P(f"captura fișei {cu_poza['id']} nu se încarcă ({cu_poza['captura']['src']})")
            else:
                OK(f"captura fișei {cu_poza['id']} se încarcă din ../{cu_poza['captura']['src']}")
            pg.go_back()
        # „n-am găsit”
        pg.fill("#q", "")
        pg.keyboard.type(AFARA, delay=20)
        try:
            pg.wait_for_selector("#mesaj-negasit", timeout=3000)
            n_prop = pg.locator("#rezultate a.r").count()
            vizibil = pg.locator("#rasfoire").is_visible() and pg.locator("#rasfoire details").count() > 0
            if n_prop != min(3, len(fise)) or not vizibil:
                P(f"„n-am găsit”: {n_prop} propuneri (aștept 3) și răsfoirea {'vizibilă' if vizibil else 'ascunsă'}")
            else:
                OK(f"„{AFARA}”: mesaj „n-am găsit” + {n_prop} propuneri + răsfoirea pe aplicații")
            pg.screenshot(path=os.path.join(CAPTURI, "negasit_1366x768.png"))
        except Exception:
            P(f"„{AFARA}” nu dă „n-am găsit”")
        # filtrul de aplicație
        pg.fill("#q", "")
        pg.keyboard.type("salvez", delay=10)
        app0 = fise[0]["aplicatie"]
        pg.click(f'#aplicatii button[data-filtru="{app0}"]')
        alte = pg.evaluate(f"Array.from(document.querySelectorAll('#rezultate a.r')).filter(a => a.dataset.app !== {json.dumps(app0)}).length")
        if alte or f"app={app0}" not in pg.url:
            P(f"butonul „{app0}” nu filtrează rezultatele ({alte} din altă aplicație) sau nu intră în adresă")
        else:
            OK(f"butonul de aplicație „{app0}” filtrează și intră în adresă")
        # tema
        def fundal(p):
            return p.evaluate("getComputedStyle(document.body).backgroundColor")

        def lum(c):
            v = [int(x) for x in re.findall(r"\d+", c)[:3]]
            return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]
        f_dark = fundal(pg)
        pg.click("#tema")
        f_light = fundal(pg)
        if not (lum(f_dark) < 60 and lum(f_light) > 200):
            P(f"tema: întunecată {f_dark}, după buton {f_light}")
        else:
            OK(f"tema întunecată ({f_dark}) și, la buton, cea luminoasă ({f_light})")
        ctx.close()

        # ------------------------------------------------------------ 2. telefon 390×844, tema luminoasă a sistemului
        ctx = context(viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True, has_touch=True, color_scheme="light")
        pg = pagina(ctx)
        pg.goto(baza + "?q=" + quote(INTREBARE), wait_until="load")
        gata(pg)
        pg.wait_for_selector("#r0", timeout=5000)
        box = pg.locator("#r0").bounding_box()
        pg.screenshot(path=os.path.join(CAPTURI, "rezultate_390x844.png"))
        if not box or box["y"] + box["height"] > 844:
            P(f"390×844: primul rezultat nu e întreg deasupra marginii de jos ({box})")
        else:
            OK(f"390×844: primul rezultat se vede fără derulare: de la {box['y']:.0f} la {box['y'] + box['height']:.0f} px")
        if lum(fundal(pg)) < 200:
            P("telefon cu tema luminoasă a sistemului: pagina nu e luminoasă")
        lat = pg.evaluate("[document.documentElement.scrollWidth, window.innerWidth]")
        if lat[0] > lat[1]:
            P(f"390 px: derulare orizontală ({lat[0]} > {lat[1]})")

        def mici(p):
            return p.evaluate("""() => Array.from(document.querySelectorAll('button, a, summary, input'))
              .filter(e => e.offsetParent !== null && !e.closest('footer') && !e.closest('.r ol') && !e.closest('ol.pasi')
                        && !e.closest('p.bun') && !e.closest('p.atentie'))
              .map(e => [e.tagName + (e.id ? '#' + e.id : '') + ' ' + (e.textContent || '').trim().slice(0, 30), e.getBoundingClientRect().height])
              .filter(x => x[1] < 32)""")
        m = mici(pg)
        pg.click("#r0")
        pg.wait_for_selector("article.fisa", timeout=5000)
        m += mici(pg)
        pg.screenshot(path=os.path.join(CAPTURI, "fisa_390x844.png"))
        pg.click("#inapoi")
        pg.fill("#q", "")
        pg.wait_for_selector("#rasfoire details", timeout=3000)
        pg.locator("#rasfoire summary").first.click()
        m += mici(pg)
        if m:
            P(f"zone de atins sub 32 px pe telefon: {m[:6]}")
        else:
            OK("telefon: toate zonele de atins au cel puțin 32 px; fără derulare orizontală")
        ctx.close()

        # ------------------------------------------------------------ 3. escaparea textului (fișă de probă, doar aici)
        rau = {
            "id": "web-proba-escapare", "aplicatie": "web", "titlu": "Scrii eticheta <code>&lt;title&gt;</code> în antet",
            "intrebare": "Cum scriu &lt;title&gt;?", "scurtatura": "Ctrl+S",
            "pasi": ["Scrie <code>&lt;&gt;</code> și <code>&lt;title&gt;Pagina mea&lt;/title&gt;</code>.", "Apasă <kbd>Ctrl</kbd>+<kbd>S</kbd> & gata.",
                     "Uită-te în <b>antetul</b> paginii: celula nu are ce căuta aici, iar antetul rămâne sus."],
            "rezultat": "Vezi =IF(A1&lt;&gt;\"\";1;0) scris corect.", "atentie": "",
            "termeni": [{"t": "<title>", "d": "eticheta \"titlului\" <b>nu</b> se închide singură"}],
            "captura": None, "formulari": ["<script>alert(1)</script>"], "cuvinte": ["\"><img src=x onerror=alert(2)>"],
            "sursa": {"cale": fise[0]["sursa"]["cale"], "pas": "p1", "titlu_pas": "Antetul: <title> și <meta charset=\"utf-8\">"},
            "clasa": "a VIII-a", "lectia": 15, "inrudite": []}
        d2 = dict(date)
        d2["fise"] = fise + [rau]
        # glosarul de probă: un termen al aplicației (apare), unul al altei aplicații (NU apare), unul dublură a fișei
        d2["termeni"] = [
            {"t": "antet", "forme": ["antetul", "antetului"], "d": "partea <head> a paginii, cu titlul filei", "aplicatii": ["web"]},
            {"t": "celulă", "forme": ["celula", "celule"], "d": "căsuța din foaia Excel", "aplicatii": ["excel"]},
            {"t": "title", "forme": ["<title>"], "d": "altă definiție, nu trebuie să apară", "aplicatii": []}]
        inlocuiri["/cum-fac/date.js"] = "window.CUM_FAC_DATE = " + json.dumps(d2, ensure_ascii=False) + ";"
        ctx = context(viewport={"width": 1366, "height": 768})
        pg = pagina(ctx)
        pg.goto(baza + "#web-proba-escapare", wait_until="load")
        gata(pg)
        pg.wait_for_selector("article.fisa", timeout=5000)
        txt = pg.inner_text("article.fisa")
        pasi_html = pg.inner_html("article.fisa ol.pasi")
        necaz = []
        for astept in ["<>", "<title>Pagina mea</title>", '=IF(A1<>"";1;0)', "Antetul: <title> și <meta charset=\"utf-8\">", "<title>", "& gata"]:
            if astept not in txt:
                necaz.append(f"lipsește textul „{astept}”")
        if "&lt;" in txt or "&amp;" in txt:
            necaz.append("pe ecran apar entități (&lt; / &amp;) în loc de < și &")
        if pg.locator("article.fisa title, article.fisa meta, article.fisa script, article.fisa img").count():
            necaz.append("textul fișei a creat elemente HTML (title/meta/script/img)")
        if "<code>" not in pasi_html or "<kbd>" not in pasi_html:
            necaz.append("etichetele permise (<code>, <kbd>) nu mai sunt formatare")
        if pg.locator("article.fisa dl.termeni b").count() != 0:
            necaz.append("definiția termenului (text simplu) a fost interpretată ca HTML")
        if necaz:
            P("escapare: " + "; ".join(necaz))
        else:
            OK("escapare: <title>, <meta>, &lt;&gt;, ghilimele și & apar ca text; <b> <kbd> <code> rămân formatare")
        # glosarul: „Cuvinte de știut” = termenii fișei + ai glosarului din pași (doar aplicația fișei), fără dubluri;
        # prima apariție din pași e subliniată și arată definiția la atingere
        dt = pg.eval_on_selector_all("article.fisa dl.termeni dt", "e => e.map(x => x.textContent)")
        gl = []
        if dt.count("<title>") != 1 or dt.count("antet") != 1 or "celulă" in dt or len(dt) != 2:
            gl.append(f"„Cuvinte de știut” = {dt} (aștept <title> din fișă și antet din glosar, fără celulă și fără dubluri)")
        if "nu trebuie să apară" in txt:
            gl.append("definiția dublurii din glosar a înlocuit-o pe a fișei")
        sub = pg.locator("article.fisa ol.pasi .termen")
        if sub.count() != 1 or sub.first.inner_text() != "antetul":
            gl.append(f"subliniate în pași: {sub.count()} (aștept 1: prima apariție a lui „antetul”)")
        else:
            sub.first.click()
            if pg.locator("article.fisa ol.pasi .def").count() != 1 or "partea <head>" not in pg.inner_text("article.fisa ol.pasi .def"):
                gl.append("atingerea termenului nu arată definiția")
            sub.first.click()
            if pg.locator("article.fisa ol.pasi .def").count() != 0:
                gl.append("a doua atingere nu ascunde definiția")
        if gl:
            P("glosar: " + "; ".join(gl))
        else:
            OK("glosar: termenii fișei + ai glosarului (doar aplicația fișei), fără dubluri; „antetul” subliniat, definiția la atingere")
        # pe datele reale: o fișă cu &lt; în pași (de ex. IF cu <code>&lt;&gt;</code>) trebuie să arate <
        reala = next((f for f in fise if any("&lt;" in p for p in f["pasi"])), None)
        if reala:
            pg.evaluate(f"location.hash = {json.dumps(reala['id'])}")
            pg.wait_for_selector(f'article[id="fisa-{reala["id"]}"]', timeout=5000)
            t2 = pg.inner_text("article.fisa ol.pasi")
            if "&lt;" in t2 or "<" not in t2:
                P(f"fișa reală {reala['id']}: „&lt;” nu apare ca „<”")
            else:
                OK(f"fișa reală {reala['id']}: &lt; din pași apare ca <")
        else:
            info.append("în date nu e nicio fișă cu &lt; în pași (verificat doar pe fișa de probă)")
        tp = next((f for f in fise if "<" in f["sursa"].get("titlu_pas", "")), None)
        if tp:
            pg.evaluate(f"location.hash = {json.dumps(tp['id'])}")
            pg.wait_for_selector(f'article[id="fisa-{tp["id"]}"]', timeout=5000)
            if tp["sursa"]["titlu_pas"] not in pg.inner_text("#exersezi"):
                P(f"fișa reală {tp['id']}: titlul pasului cu < nu apare întocmai")
            else:
                OK(f"fișa reală {tp['id']}: titlul pasului „{tp['sursa']['titlu_pas'][:40]}” apare întocmai")
        reala_app = next((f for f in fise if f["sursa"]["pas"] == "real"), None)
        if reala_app:
            pg.evaluate(f"location.hash = {json.dumps(reala_app['id'])}")
            pg.wait_for_selector(f'article[id="fisa-{reala_app["id"]}"]', timeout=5000)
            href = pg.get_attribute("#exersezi", "href") or ""
            tl = pg.inner_text("#exersezi")
            # pasul „în aplicația adevărată” n-are ?vezi=: legătura deschide lecția, textul spune că pasul e la final
            if "?" in href or not href.endswith("/") or "la finalul lecției, pasul «" not in tl:
                P(f"fișa {reala_app['id']} (pasul „real”): legătura {href}, textul „{tl}”")
            else:
                OK(f"fișa {reala_app['id']}: legătura fără ?vezi= spre lecție, „{tl.strip()[:80]}…”")
        ctx.close()

        # ------------------------------------------------------------ 4. viteza pe 300 de fișe
        multe = []
        k = 0
        while len(fise) + len(multe) < 300:
            c = json.loads(json.dumps(fise[k % len(fise)]))
            c["id"] = c["id"] + "-copie" + str(k)
            c["inrudite"] = []
            multe.append(c)
            k += 1
        d3 = dict(date)
        d3["fise"] = fise + multe
        inlocuiri["/cum-fac/date.js"] = "window.CUM_FAC_DATE = " + json.dumps(d3, ensure_ascii=False) + ";"
        ctx = context(viewport={"width": 1366, "height": 768})
        pg = pagina(ctx)
        pg.goto(baza, wait_until="load")
        gata(pg)
        pg.click("#q")
        pg.keyboard.type("selectare mai multe celule in excel", delay=15)
        pg.wait_for_timeout(200)
        ms3 = [c["ms"] for c in pg.evaluate("window.__cumFac.cautari")]
        idx3 = pg.evaluate("window.__cumFac.msIndex")
        if not ms3 or max(ms3) >= 100:
            P(f"300 de fișe: tastare->rezultate maxim {max(ms3) if ms3 else '—'} ms (prag 100)")
        else:
            OK(f"300 de fișe: tastare->rezultate mediu {sum(ms3) / len(ms3):.1f} ms, maxim {max(ms3):.1f} ms; indexul {idx3} ms")
        info.append(f"300 de fișe: maxim {max(ms3):.1f} ms, index {idx3} ms")
        ctx.close()
        inlocuiri.clear()
        br.close()
    srv.shutdown()

    if externe:
        P(f"cereri externe încercate: {len(externe)} ({sorted(set(externe))[:5]})")
    else:
        OK("cereri externe încercate: 0")
    if erori_js:
        P(f"erori JS în consolă: {len(erori_js)} ({erori_js[:3]})")
    else:
        OK("erori JS în consolă: 0")
    for x in info:
        print("  info", x)
    print(f"proba de browser · {len(fise)} fișe în date.js (versiunea {date.get('versiune')}) · capturi în cum-fac/_teste/capturi/ · probleme:")
    print(len(probleme))


if __name__ == "__main__":
    main()
    sys.exit(1 if probleme else 0)
