# -*- coding: utf-8 -*-
"""Proba rundei 22 (B-windows, unghiul gest_tastatura): cele 5 GRAV din runde/18/critic.md (W1-W5), pe poligon, cu gesturi
ADEVĂRATE: page.mouse, page.keyboard, page.touchscreen.tap, atingeri CDP (Input.dispatchTouchEvent) pentru glisări.
Headless, rețeaua tăiată în afară de 127.0.0.1 (regula 24, structura_lib.blocheaza_externe), server pe port liber.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/22/proba_grav.py [--eticheta pornire|final]
Ieșirea: runde/22/probe_iesiri/proba_grav_<eticheta>.json; ultima linie = verificări picate.
"""
import argparse
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
AICI = Path(__file__).resolve().parent
D = AICI.parents[1]
WT = D.parents[1]
sys.path.insert(0, str(D / "oracole"))
import structura_lib as SL      # noqa: E402  (doar citit)

IES = AICI / "probe_iesiri"
IES.mkdir(exist_ok=True)
REZ = {"verificari": [], "erori_js": [], "plecate": []}
ASCULTA = "window.__E=[];window.addEventListener('lh-aplicatie',e=>window.__E.push(JSON.parse(JSON.stringify(e.detail))));"
EXPLORER = '[data-lh-tinta="bara_activitati"][data-lh-id^="Explorer"]'
CASETA = '[data-lh-tinta="start"][data-lh-id="Căutați aplicații, setări și documente"]'
CATEG = ["Productivitate", "Instrumente pentru dezvoltatori", "Creativitate", "Utilități și instrumente", "Altele", "Divertisment",
         "Accesibilitate"]


def bifa(gr, nume, ok, dovada=None):
    REZ["verificari"].append({"grav": gr, "nume": nume, "ok": bool(ok), "dovada": dovada})
    print(("  OK   " if ok else "  PICĂ ") + gr + " " + nume + ("" if ok else "  <- " + json.dumps(dovada, ensure_ascii=False)[:260]))


def pagina(br, base, w, h, continut=None, telefon=False):
    ctx = br.new_context(viewport={"width": w, "height": h}, has_touch=telefon, is_mobile=telefon)
    SL.blocheaza_externe(ctx)
    pg = ctx.new_page()
    pg.on("pageerror", lambda e: REZ["erori_js"].append(str(e)[:200]))
    pg.on("request", lambda r: REZ["plecate"].append(r.url) if not r.url.startswith(("http://127.0.0.1", "http://localhost", "data:", "blob:")) else None)
    pg.goto(base + "aplicatii/poligon.html", wait_until="load")
    pg.evaluate(ASCULTA)
    pg.evaluate("c => LH.aplicatii.deschide('windows', {focus: true, continut: c})", continut or {})
    pg.wait_for_timeout(300)
    return pg


def st(pg):
    return pg.evaluate("LH.aplicatii.stare('windows')")


def ev(pg):
    return pg.evaluate("window.__E.splice(0)")


def cutie(pg, sel):
    loc = pg.locator(sel)
    return loc.first.bounding_box() if loc.count() else None


def centru(b):
    return (b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)


def tasteaza(pg, text):
    for ch in text:
        pg.keyboard.press(ch)
        pg.wait_for_timeout(40)
    pg.wait_for_timeout(120)


def gliseaza(pg, x0, y0, x1, y1, pasi=10):
    c = pg.context.new_cdp_session(pg)
    c.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y0}]})
    for k in range(1, pasi + 1):
        c.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 + (x1 - x0) * k / pasi, "y": y0 + (y1 - y0) * k / pasi}]})
        pg.wait_for_timeout(16)
    c.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
    pg.wait_for_timeout(400)


RANDURI_JS = """sel => [...document.querySelectorAll(sel + ' .lh-w-r')].map(e => { const b = e.getBoundingClientRect();
  const c = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
  return {n: e.getAttribute('data-lh-id'), r: [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)], vazut: !!(c && e.contains(c))}; })"""


def w1(br, base):
    for (w, h), (px, py) in (((1536, 864), (952, 200)), ((1366, 768), (1024, 690)), ((1093, 526), (600, 440)), ((1093, 526), (600, 120))):
        pg = pagina(br, base, w, h)
        pg.mouse.click(px, py, button="right")
        pg.wait_for_timeout(150)
        sel = '[data-lh-suprafata="meniu_desktop"]'
        rs = pg.evaluate(RANDURI_JS, sel)
        fond = pg.evaluate("sel => { const f = document.querySelector(sel + ' .lh-w-fond'); if (!f) return null; const b = f.getBoundingClientRect(); return [b.left, b.top, b.right, b.bottom].map(Math.round); }", sel)
        lucru = h - 48
        tag = "%dx%d@%d,%d" % (w, h, px, py)
        bifa("W1", tag + ": meniul are 10 rânduri", len(rs) == 10, len(rs))
        bifa("W1", tag + ": fundalul cuprinde toate rândurile", bool(fond) and all(fond[0] <= r["r"][0] and fond[1] <= r["r"][1] and r["r"][2] <= fond[2] and r["r"][3] <= fond[3] for r in rs), {"fond": fond, "ultimul": rs[-1:] if rs else None})
        bifa("W1", tag + ": toate rândurile deasupra barei și vizibile (inclusiv Nou, Afișați mai multe opțiuni)", bool(rs) and all(r["r"][3] <= lucru and r["r"][1] >= 0 and r["vazut"] for r in rs), [r for r in rs if not (r["r"][3] <= lucru and r["vazut"])][:3])
        pg.context.close()


def w4(br, base):
    pg = pagina(br, base, 1366, 768)
    b = cutie(pg, EXPLORER)
    galben = pg.evaluate("""sel => { const e = document.querySelector(sel); if (!e) return null;
      return [...e.querySelectorAll('svg *, span, i')].map(x => getComputedStyle(x)).map(s => [s.fill, s.backgroundColor]).flat()
        .map(c => (c || '').match(/rgba?\\((\\d+), (\\d+), (\\d+)/)).filter(Boolean).some(m => +m[1] > 200 && +m[2] > 150 && +m[3] < 130); }""", EXPLORER)
    bifa("W4", "butonul Explorer din bară are dosarul galben", galben is True, galben)
    pg.mouse.move(*centru(b))
    pg.wait_for_timeout(1500)
    vaz = pg.evaluate("""() => [...document.querySelectorAll('.lh-ap-windows *')].filter(e => { if (e.childElementCount) return false;
      const t = (e.textContent || '').trim(); if (t !== 'Explorer') return false; const b = e.getBoundingClientRect(); const s = getComputedStyle(e);
      return b.width > 0 && b.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0'; }).map(e => e.getBoundingClientRect().top)""")
    bifa("W4", "ținând mouse-ul 1,5 s pe Explorer îi apare numele („Explorer”)", bool(vaz), vaz)
    pg.mouse.move(5, 5)
    pg.wait_for_timeout(300)
    ev(pg)
    pg.mouse.click(*centru(cutie(pg, EXPLORER)))
    pg.wait_for_timeout(200)
    e = ev(pg)
    msg = pg.evaluate("() => { const m = document.querySelector('[data-lh-nesimulat]:not([data-lh-tip])'); return m ? m.textContent : null; }")
    s = st(pg)
    bifa("W4", "clicul pe Explorer (fără fereastră deschisă): evenimentul §4 + Explorer deschis sau mesajul central (R12)",
         any(x.get("gest") == "clic" and str(x.get("tinta", "")).startswith("bara_activitati:Explorer") for x in e) and
         (any(f["aplicatie"] == "explorer" for f in s["ferestre"]) or bool(msg)), {"ev": [(x.get("gest"), x.get("actiune"), x.get("tinta")) for x in e], "msg": msg})
    pg.context.close()


def w3(br, base):
    pg = pagina(br, base, 1366, 768)
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(150)
    ev(pg)
    tasteaza(pg, "pai")
    e = ev(pg)
    txt = pg.evaluate("sel => { const e = document.querySelector(sel); return e ? e.textContent.trim() : null; }", CASETA)
    bifa("W3", "Start + „pai”: caseta de căutare din Start arată „pai”", txt is not None and "pai" in txt, txt)
    rez = pg.locator('.lh-w-start [data-lh-id="Paint"]')
    bifa("W3", "Start + „pai”: rezultatul „Paint” e pe ecran", rez.count() > 0 and rez.first.is_visible(), rez.count())
    bifa("W3", "evenimentele tastării: ținta în Start, acțiunea nu e goală („tastare”)", len(e) >= 3 and all(str(x.get("tinta", "")).startswith("start") and x.get("actiune") not in ("tastare", None) for x in e[-3:]),
         [(x.get("gest"), x.get("actiune"), x.get("tinta")) for x in e])
    if rez.count():
        pg.mouse.click(*centru(rez.first.bounding_box()))
        pg.wait_for_timeout(200)
    s = st(pg)
    bara = cutie(pg, '[data-lh-tinta="bara_activitati"][data-lh-app="paint"]')
    bifa("W3", "clic pe Paint: Paint pornește (fereastra în stare, activă) și Start se închide", any(f["aplicatie"] == "paint" and f["activa"] for f in s["ferestre"]) and not s["meniu_start_deschis"], s["ferestre"])
    bifa("W3", "Paint are butonul lui în bară (cu linia de dedesubt)", bool(bara) and pg.locator('[data-lh-app="paint"] .lh-w-ind').count() == 1, bara)
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(120)
    tasteaza(pg, "calc")
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(200)
    s = st(pg)
    bifa("W3", "Start + „calc” + Enter: pornește Calculator (primul rezultat)", any(f["aplicatie"] == "calculator" and f["activa"] for f in s["ferestre"]) and not s["meniu_start_deschis"], s["ferestre"])
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(120)
    tasteaza(pg, "zqx")
    pg.wait_for_timeout(1200)
    msg = pg.evaluate("() => { const m = document.querySelector('[data-lh-nesimulat]:not([data-lh-tip])'); if (!m) return null; const b = m.getBoundingClientRect(); return b.width > 0 ? m.textContent : null; }")
    bifa("W3", "Start + text fără potrivire: mesajul central (R12), încă pe ecran după 1,2 s", bool(msg), msg)
    pg.keyboard.press("Backspace")
    pg.wait_for_timeout(120)
    txt = pg.evaluate("sel => { const e = document.querySelector(sel); return e ? e.textContent.trim() : null; }", CASETA)
    bifa("W3", "Backspace șterge ultima literă din caseta de căutare", txt is not None and "zq" in txt and "zqx" not in txt, txt)
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(120)
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(120)
    txt = pg.evaluate("sel => { const e = document.querySelector(sel); return e ? e.textContent.trim() : null; }", CASETA)
    bifa("W3", "Esc închide Start; la redeschidere caseta e goală (textul-indiciu)", txt is not None and "zq" not in txt, txt)
    pg.context.close()


ZONA = ".lh-w-zona-apps"
VIZ_CAT_JS = """name => { const z = document.querySelector('.lh-w-zona-apps'); if (!z) return false; const zb = z.getBoundingClientRect();
  const e = [...z.querySelectorAll('[data-lh-eticheta]')].find(x => (x.getAttribute('data-lh-eticheta') || '').indexOf(name + ' categorie') === 0);
  if (!e) return false; const b = e.getBoundingClientRect(); return b.top >= zb.top - 1 && b.bottom <= zb.bottom + 1 && b.height > 100; }"""


def w2(br, base):
    pg = pagina(br, base, 1536, 864)
    pg.mouse.click(*centru(cutie(pg, '[data-lh-tinta="bara_activitati"][data-lh-id="Start"]')))
    pg.wait_for_timeout(200)
    m = pg.evaluate("z => { const e = document.querySelector(z); return e ? [e.scrollHeight, e.clientHeight, e.scrollTop] : null; }", ZONA)
    bifa("W2", "Start › lista se poate derula (scrollHeight > clientHeight)", bool(m) and m[0] > m[1] + 20, m)
    cats = pg.evaluate("""cs => cs.map(c => { const e = [...document.querySelectorAll('.lh-w-zona-apps [data-lh-eticheta]')].find(x => (x.getAttribute('data-lh-eticheta') || '').indexOf(c + ' categorie') === 0);
      return e ? {c, txt: (e.textContent || '').indexOf(c) >= 0 || [...e.querySelectorAll('*')].some(x => (getComputedStyle(x, '::after').content || '').indexOf(c) >= 0), btn: [...e.querySelectorAll('[data-lh-tip="Button"]')].map(b => { const r = b.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; })} : {c, lipsa: true}; })""", CATEG)
    bifa("W2", "toate cele 7 categorii din start_toate sunt în listă", all(not c.get("lipsa") for c in cats), [c["c"] for c in cats if c.get("lipsa")])
    bifa("W2", "fiecare categorie își arată numele pe ecran", all(c.get("txt") for c in cats), [c["c"] for c in cats if not c.get("txt")])
    bifa("W2", "butoanele aplicațiilor din categorii sunt 68×68 (±2), câte 3", all(len(c.get("btn") or []) == 3 and all(abs(x - 68) <= 2 and abs(y - 68) <= 2 for x, y in c["btn"]) for c in cats), [c.get("btn") for c in cats][:3])
    zb = cutie(pg, ZONA)
    pg.mouse.move(zb["x"] + zb["width"] / 2, zb["y"] + zb["height"] / 2)
    for _ in range(6):
        pg.mouse.wheel(0, 300)
        pg.wait_for_timeout(80)
    pg.wait_for_timeout(300)
    bifa("W2", "rotița derulează lista până la „Accesibilitate”", pg.evaluate(VIZ_CAT_JS, "Accesibilitate"), pg.evaluate("z => document.querySelector(z) && document.querySelector(z).scrollTop", ZONA))
    pg.keyboard.press("Escape")
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(200)
    # S-MS „Navigate to Pinned and All apps”: Tab până la Fixate, apoi săgețile (vezi diferente.md)
    pg.keyboard.press("Tab")
    pg.wait_for_timeout(60)
    for _ in range(14):
        pg.keyboard.press("ArrowDown")
        pg.wait_for_timeout(30)
    pg.wait_for_timeout(200)
    bifa("W2", "tastatura (Tab, apoi săgeata în jos de 14 ori, din Start) ajunge în „Toate”: lista derulată, focusul pe un element din ea",
         pg.evaluate("z => { const e = document.querySelector(z); const f = document.activeElement; return !!(e && e.scrollTop > 100 && f && e.contains(f)); }", ZONA),
         pg.evaluate("z => [document.querySelector(z) && document.querySelector(z).scrollTop, document.activeElement && document.activeElement.getAttribute('data-lh-id')]", ZONA))
    pg.context.close()
    for w, h in ((360, 740), (390, 844)):
        pg = pagina(br, base, w, h, telefon=True)
        pg.touchscreen.tap(*centru(cutie(pg, '[data-lh-tinta="bara_activitati"][data-lh-id="Start"]')))
        pg.wait_for_timeout(250)
        zb = cutie(pg, ZONA)
        for _ in range(5):
            gliseaza(pg, zb["x"] + zb["width"] / 2, zb["y"] + zb["height"] * 0.85, zb["x"] + zb["width"] / 2, zb["y"] + zb["height"] * 0.15)
            if pg.evaluate(VIZ_CAT_JS, "Accesibilitate"):
                break
        bifa("W2", "telefon %d: glisarea cu degetul aduce „Accesibilitate” în listă" % w, pg.evaluate(VIZ_CAT_JS, "Accesibilitate"),
             pg.evaluate("z => { const e = document.querySelector(z); return e && [e.scrollTop, e.scrollHeight, e.clientHeight]; }", ZONA))
        pg.context.close()


def w5(br, base):
    for w, h in ((360, 740), (390, 844)):
        pg = pagina(br, base, w, h, {"ferestre": [{"aplicatie": "explorer", "titlu": "Acest PC"}]}, telefon=True)
        bt = pg.evaluate("""() => [...document.querySelectorAll('.lh-w-fer .lh-w-tb')].map(e => { const b = e.getBoundingClientRect(); return [e.getAttribute('data-lh-id'), Math.round(b.left), Math.round(b.right)]; })""")
        bifa("W5", "telefon %d: Minimizare / Maximizare / Închidere în ecran" % w, len(bt) == 3 and all(x[1] >= 0 and x[2] <= w for x in bt), bt)
        stv = pg.evaluate("""() => { const e = document.querySelector('[data-lh-tinta="bara_activitati"][data-lh-id="Start"]'); if (!e) return null; const b = e.getBoundingClientRect();
          const c = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2); return !!(c && e.contains(c)) && b.left >= 0 && b.right <= innerWidth; }""")
        bifa("W5", "telefon %d: Start se vede și se poate atinge cu o aplicație activă în bandă (regresul prins de proba r18)" % w, stv is True, stv)
        tb = cutie(pg, '.lh-w-fer .lh-w-titlu')
        x0 = st(pg)["ferestre"][0]["x"]
        gliseaza(pg, tb["x"] + 30, tb["y"] + 16, tb["x"] + 30, tb["y"] + 120)
        s = st(pg)["ferestre"][0]
        bifa("W5", "telefon %d: glisarea barei de titlu mută fereastra" % w, s["y"] != 60 or s["x"] != x0, s)
        mn = cutie(pg, '.lh-w-fer .lh-w-tb[data-lh-id="Minimizare"]')
        if mn:
            pg.touchscreen.tap(*centru(mn))
            pg.wait_for_timeout(200)
        bifa("W5", "telefon %d: atingerea pe Minimizare ascunde fereastra" % w, st(pg)["ferestre"][0]["stare"] == "min", st(pg)["ferestre"])
        vaz = None
        for k in range(4):
            vaz = pg.evaluate("""sel => { const e = document.querySelector(sel); const m = document.querySelector('.lh-w-mijloc'); if (!e) return null;
              const b = e.getBoundingClientRect(), mb = m ? m.getBoundingClientRect() : {left: 0, right: innerWidth};
              return b.left >= mb.left - 1 && b.right <= mb.right + 1 && b.right <= innerWidth ? [b.left, b.right] : false; }""", EXPLORER)
            if vaz:
                break
            mb = cutie(pg, ".lh-w-mijloc")
            gliseaza(pg, mb["x"] + mb["width"] * 0.8, mb["y"] + 24, mb["x"] + mb["width"] * 0.2, mb["y"] + 24, 6)
        bifa("W5", "telefon %d: butonul Explorer din bară se vede (direct sau după glisare)" % w, bool(vaz), vaz)
        gol = pg.evaluate("""() => { const bs = [...document.querySelectorAll('.lh-w-mijloc .lh-w-b')].filter(e => getComputedStyle(e).display !== 'none')
              .map(e => e.getBoundingClientRect()).sort((a, b) => a.left - b.left); let g = 0; for (let i = 1; i < bs.length; i++) g = Math.max(g, bs[i].left - bs[i - 1].right); return g; }""")
        bifa("W5", "telefon %d: niciun gol mai mare de 24 px între butoanele benzii" % w, gol is not None and gol <= 24, gol)
        if vaz:
            b = cutie(pg, EXPLORER)
            pg.touchscreen.tap(*centru(b))
            pg.wait_for_timeout(200)
        bifa("W5", "telefon %d: atingerea pe Explorer readuce fereastra" % w, st(pg)["ferestre"][0]["stare"] != "min", st(pg)["ferestre"])
        lat = pg.evaluate("document.documentElement.scrollWidth")
        bifa("W5", "telefon %d: pagina nu se lățește" % w, lat <= w, lat)
        pg.context.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--eticheta", default="final")
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    srv, base = SL.porneste_server(WT)
    with sync_playwright() as p:
        br = p.chromium.launch()
        for nume, fn in (("W1", w1), ("W4", w4), ("W3", w3), ("W2", w2), ("W5", w5)):
            print(nume)
            try:
                fn(br, base)
            except Exception as e:
                bifa(nume, "proba a mers până la capăt", False, str(e)[:300])
        br.close()
    srv.shutdown()
    bifa("-", "nicio eroare JS", not REZ["erori_js"], REZ["erori_js"][:3])
    bifa("-", "nicio cerere în afara 127.0.0.1", not REZ["plecate"], REZ["plecate"][:3])
    pic = {}
    for v in REZ["verificari"]:
        pic.setdefault(v["grav"], [0, 0])
        pic[v["grav"]][0] += 1
        pic[v["grav"]][1] += 0 if v["ok"] else 1
    picate = sum(1 for v in REZ["verificari"] if not v["ok"])
    REZ["rezumat"] = {"verificari": len(REZ["verificari"]), "picate": picate, "pe_grav": pic}
    f = IES / ("proba_grav_%s.json" % a.eticheta)
    f.write_text(json.dumps(REZ, ensure_ascii=False, indent=1), encoding="utf-8")
    print("pe GRAV (verificări, picate): " + ", ".join("%s=%s" % kv for kv in pic.items()))
    print(f)
    print(picate)


if __name__ == "__main__":
    main()
