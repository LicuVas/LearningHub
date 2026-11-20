# -*- coding: utf-8 -*-
"""Proba rundei 18 (B-windows): Windows 11 din biblioteca centrală, pe aplicatii/poligon.html, cu gesturi ADEVĂRATE
(mouse + tastatură Playwright, headless, rețeaua tăiată în afară de 127.0.0.1 — regula 24; server pe port liber).

Partea 1 — comportamentul cerut de supliment (Start, meniurile desktopului, Nou › Folder, ferestrele din bară, mesajul
central, evenimentele §4 pe fiecare gest). Fiecare verificare = un rând {nume, ok, dovada}.
Partea 2 — O3 de diagnostic (codul ÎNGHEȚAT al oracolelor: arbore_randat.js + structura_lib.compara + oracol_ui.puncte,
referința shell structura_lib.referinte_shell()["windows"], plasa _deschide_shell), la DOUĂ ferestre: 1366×768 (ce ar
vedea O3) și 1536×864 (ecranul referinței). NU e O3 (O3 măsoară lecțiile din inventar; azi nicio lecție nu încarcă Windows).
Partea 3 — I1: la 375×740 nimic nu iese din pagină, butoanele barei și dalele Start ≥ 32 px.

    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/18/proba_windows.py
Ieșirea: runde/18/probe_iesiri/proba_windows.json; ultima linie = verificări picate (partea 1 + 3).
"""
import json
import sys
from collections import Counter
from pathlib import Path

sys.dont_write_bytecode = True
AICI = Path(__file__).resolve().parent
D = AICI.parents[1]
WT = D.parents[1]
sys.path.insert(0, str(D / "oracole"))
import structura_lib as SL      # noqa: E402  (doar citit)
import oracol_ui as OUI         # noqa: E402

IES = AICI / "probe_iesiri"
IES.mkdir(exist_ok=True)
REZ = {"verificari": [], "o3": {}, "telefon": {}, "erori_js": []}


def bifa(nume, ok, dovada=None):
    REZ["verificari"].append({"nume": nume, "ok": bool(ok), "dovada": dovada})
    print(("  OK   " if ok else "  PICĂ ") + nume + ("" if ok else "  ← " + json.dumps(dovada, ensure_ascii=False)[:300]))


ASCULTA = "window.__E=[];window.addEventListener('lh-aplicatie',e=>window.__E.push(JSON.parse(JSON.stringify(e.detail))));"


def deschide(pg, base, continut=None, w=1366, h=768):
    pg.set_viewport_size({"width": w, "height": h})
    pg.goto(base + "aplicatii/poligon.html", wait_until="load")
    pg.evaluate(ASCULTA)
    pg.evaluate("c => LH.aplicatii.deschide('windows', {focus: true, continut: c})", continut or {})
    pg.wait_for_timeout(250)


def st(pg):
    return pg.evaluate("LH.aplicatii.stare('windows')")


def ev(pg):
    return pg.evaluate("window.__E.splice(0)")


def centru(pg, sel):
    b = pg.locator(sel).first.bounding_box()
    return (b["x"] + b["width"] / 2, b["y"] + b["height"] / 2) if b else None


def clic(pg, sel, **kw):
    c = centru(pg, sel)
    if not c:
        raise RuntimeError("nu e pe ecran: " + sel)
    pg.mouse.click(c[0], c[1], **kw)
    pg.wait_for_timeout(120)


def ev_valid(e, gest=None, tinta=None):
    ok = isinstance(e, dict) and e.get("aplicatie") == "windows" and isinstance(e.get("inainte"), dict) and \
        isinstance(e.get("dupa"), dict) and isinstance(e.get("ts"), (int, float)) and e.get("actiune") and e.get("tinta")
    return ok and (gest is None or e.get("gest") == gest) and (tinta is None or e.get("tinta") == tinta)


def partea1(pg, base):
    deschide(pg, base)
    s = st(pg)
    bifa("starea are ferestre + meniu_start_deschis (api §5)", "ferestre" in s and "meniu_start_deschis" in s, list(s))
    # Start: clic, Esc, tasta Windows
    clic(pg, '[data-lh-tinta="bara_activitati"][data-lh-id="Start"]')
    e = ev(pg)
    bifa("clic pe Start deschide Start (stare + suprafața start pe ecran)", st(pg)["meniu_start_deschis"] and pg.locator('[data-lh-suprafata="start"]').count() == 1, st(pg)["meniu_start_deschis"])
    bifa("evenimentul clicului pe Start: tinta bara_activitati:Start, actiune deschide_start", any(ev_valid(x, "clic", "bara_activitati:Start") and x["actiune"] == "deschide_start" for x in e), e[-1:] )
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(120)
    e = ev(pg)
    bifa("Esc închide Start", not st(pg)["meniu_start_deschis"] and any(ev_valid(x, "tasta_esc") for x in e), [x.get("actiune") for x in e])
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(120)
    e = ev(pg)
    bifa("tasta Windows deschide Start (gest tasta_windows)", st(pg)["meniu_start_deschis"] and any(ev_valid(x, "tasta_windows") for x in e), [x.get("gest") for x in e])
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(120)
    bifa("tasta Windows a doua oară închide Start", not st(pg)["meniu_start_deschis"])
    # clic dreapta pe desktopul gol -> meniul nou; Afișați mai multe opțiuni -> clasic
    desk = pg.locator(".lh-w-desk").bounding_box()
    px, py = desk["x"] + desk["width"] * 0.55, desk["y"] + desk["height"] * 0.4
    pg.mouse.click(px, py, button="right")
    pg.wait_for_timeout(150)
    e = ev(pg)
    bifa("clic dreapta pe desktop deschide meniu_desktop", st(pg)["meniu_deschis"] == "meniu_desktop" and pg.locator('[data-lh-suprafata="meniu_desktop"]').count() == 1, st(pg)["meniu_deschis"])
    bifa("evenimentul clic_dreapta (fereastra_app:windows → desktop gol)", any(ev_valid(x, "clic_dreapta") and x["actiune"] == "meniu_contextual" for x in e), e[-1:])
    clic(pg, '[data-lh-tinta="meniu"][data-lh-id="Afișați mai multe opțiuni"]')
    e = ev(pg)
    bifa("„Afișați mai multe opțiuni” deschide meniul clasic", st(pg)["meniu_deschis"] == "meniu_desktop_clasic", st(pg)["meniu_deschis"])
    bifa("în meniul clasic „Lipire” e gri (referința: dezactivat)", pg.locator('[data-lh-suprafata="meniu_desktop_clasic"] [data-lh-id="Lipire"][aria-disabled="true"]').count() == 1)
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(100)
    bifa("Esc închide meniul", st(pg)["meniu_deschis"] is None)
    pg.keyboard.down("Shift")
    pg.mouse.click(px, py, button="right")
    pg.keyboard.up("Shift")
    pg.wait_for_timeout(150)
    bifa("Shift + clic dreapta deschide direct meniul clasic", st(pg)["meniu_deschis"] == "meniu_desktop_clasic", st(pg)["meniu_deschis"])
    pg.keyboard.press("Escape")
    ev(pg)
    # Nou › Folder, cu numele în editare; Enter; din nou → „Folder nou”, Esc; a treia oară → „Folder nou (2)”
    for k, (scrie, asteptat) in enumerate([("Teme", "Teme"), (None, "Folder nou"), (None, "Folder nou (2)")]):
        pg.mouse.click(px + 180 * k - 200, py + 120, button="right")
        pg.wait_for_timeout(120)
        clic(pg, '[data-lh-suprafata="meniu_desktop"] [data-lh-id="Nou"]')
        bifa("Nou deschide submeniul (meniu_desktop_nou) #%d" % (k + 1), st(pg)["meniu_deschis"] == "meniu_desktop_nou", st(pg)["meniu_deschis"])
        clic(pg, '[data-lh-suprafata="meniu_desktop_nou"] [data-lh-id="Folder"]')
        pg.wait_for_timeout(100)
        s = st(pg)
        nume_nou = "Folder nou" if k < 2 else "Folder nou (2)"
        foc = pg.evaluate("document.activeElement && document.activeElement.tagName === 'INPUT' && document.activeElement.value")
        bifa("Nou › Folder pune „%s” pe desktop, cu numele în editare (focus în casetă)" % nume_nou, s["redenumire"] == nume_nou and nume_nou in s["pictograme_desktop"] and foc == nume_nou, {"redenumire": s["redenumire"], "focus": foc})
        if scrie:
            pg.keyboard.press("Control+A")
            pg.keyboard.type(scrie, delay=20)
            pg.keyboard.press("Enter")
        else:
            pg.keyboard.press("Escape")
        pg.wait_for_timeout(150)
        s = st(pg)
        bifa("după %s: pe desktop „%s”, fără editare" % ("Enter" if scrie else "Esc", asteptat), asteptat in s["pictograme_desktop"] and s["redenumire"] is None, s["pictograme_desktop"])
    e = ev(pg)
    bifa("evenimente cu ținta meniu:Folder și actiune folder_nou", sum(1 for x in e if ev_valid(x, "clic", "meniu:Folder") and x["actiune"] == "folder_nou") == 3, [x.get("actiune") for x in e if x.get("tinta") == "meniu:Folder"])
    # F2 pe pictograma aleasă
    clic(pg, '[data-lh-tinta="desktop"][data-lh-id="Teme"]')
    pg.keyboard.press("F2")
    pg.wait_for_timeout(100)
    bifa("F2 pe pictograma aleasă intră în redenumire", st(pg)["redenumire"] == "Teme")
    pg.keyboard.press("Escape")
    # mesajul central standard pe o comandă afișată nesimulată
    clic(pg, '[data-lh-tinta="bara_activitati"][data-lh-id-mso="WidgetsButton"]')
    m = pg.locator('[data-lh-nesimulat]:not([data-lh-tip])')
    bifa("Widgeturi (nesimulat) dă mesajul central cu data-lh-nesimulat, role=status", m.count() == 1 and m.first.get_attribute("role") == "status", m.first.inner_text() if m.count() else None)
    ev(pg)
    # ferestrele din `ferestre` în bară: minimizare / restaurare / activare; butoanele ferestrei
    deschide(pg, base, {"ferestre": [{"aplicatie": "explorer", "titlu": "Acest PC", "stare": "normal", "activa": True, "x": 100, "y": 60, "w": 600, "h": 380},
                                     {"aplicatie": "word", "titlu": "Document1 - Word", "stare": "normal", "activa": False, "x": 300, "y": 120, "w": 600, "h": 380}]})
    b_exp = '[data-lh-tinta="bara_activitati"][data-lh-id="Explorer - 1 fereastră deschisă"]'
    b_word = '[data-lh-tinta="bara_activitati"][data-lh-id="Word - 1 fereastră deschisă"]'
    bifa("fixatul Explorer devine „Explorer - 1 fereastră deschisă” (șablonul din referință); Word apare după fixate",
         pg.locator(b_exp).count() == 1 and pg.locator(b_word).count() == 1, pg.evaluate("LH.aplicatii.tinte('windows').filter(t=>t.startsWith('bara_activitati:'))"))
    clic(pg, b_exp)
    f = {x["aplicatie"]: x for x in st(pg)["ferestre"]}
    bifa("clic pe butonul ferestrei active o minimizează", f["explorer"]["stare"] == "min" and not f["explorer"]["activa"], f["explorer"])
    clic(pg, b_exp)
    f = {x["aplicatie"]: x for x in st(pg)["ferestre"]}
    bifa("clic pe butonul ferestrei minimizate o restaurează și o activează", f["explorer"]["stare"] == "normal" and f["explorer"]["activa"], f["explorer"])
    clic(pg, b_word)
    f = {x["aplicatie"]: x for x in st(pg)["ferestre"]}
    bifa("clic pe butonul unei ferestre neactive o activează", f["word"]["activa"] and not f["explorer"]["activa"], {k: v["activa"] for k, v in f.items()})
    clic(pg, '[data-lh-fer] [data-lh-tinta="bara_titlu"][data-lh-id="Maximizare"] >> nth=-1')
    f = {x["aplicatie"]: x for x in st(pg)["ferestre"]}
    bifa("Maximizare pe fereastra activă → stare max", f["word"]["stare"] == "max", f["word"])
    clic(pg, '[data-lh-fer] [data-lh-tinta="bara_titlu"][data-lh-id="Închidere"] >> nth=-1')
    s = st(pg)
    bifa("Închidere scoate fereastra din `ferestre` și din bară", [x["aplicatie"] for x in s["ferestre"]] == ["explorer"] and pg.locator(b_word).count() == 0, [x["aplicatie"] for x in s["ferestre"]])
    e = ev(pg)
    bifa("fiecare gest de mai sus are evenimentul standard valid (§4)", len(e) >= 5 and all(ev_valid(x) for x in e), [(x.get("gest"), x.get("actiune"), x.get("tinta")) for x in e if not ev_valid(x)][:3])
    # asistarea (§6) pe Start
    pg.evaluate("LH.aplicatii.indiciu('bara_activitati:Start', 'Apasă aici', {aplicatie:'windows'})")
    bifa("indiciul se pune lângă butonul Start (data-lh-pentru)", pg.locator('[data-lh-indiciu][data-lh-pentru="bara_activitati:Start"]').count() == 1)


def o3_fereastra(p, base, w, h):
    js = SL.JS_EXTRACTOR.read_text(encoding="utf-8")
    ctx = p.chromium.launch().new_context(viewport={"width": w, "height": h})
    SL.blocheaza_externe(ctx)
    pg = ctx.new_page()
    erori = []
    pg.on("pageerror", lambda e: erori.append(str(e)))

    def mergi(_nav=None):
        pg.goto(base + "aplicatii/poligon.html", wait_until="load")
        pg.evaluate("() => LH.aplicatii.deschide('windows', {focus: true})")
        pg.wait_for_timeout(250)
        pg.evaluate(js)

    def extrage(o):
        return pg.evaluate("o => __LHO.extrage(o)", o)
    mergi()
    o = {"app": "windows", "refTabs": []}
    sup = dict(extrage(o)["suprafete"])
    rez = {"erori": []}
    inst = {"id": "poligon", "aplicatie": "windows", "nav": None, "tip": "poligon"}
    are_plasa = SL._deschide_shell(pg, js, inst, o, sup, rez, mergi, extrage)
    ref = SL.referinte_shell()["windows"]
    canon = {k: SL.canon(k, v) for k, v in sup.items()}
    total, pe_sup, pe_fel = 0, {}, Counter()
    for k, refc in ref.canon.items():
        d = set(SL.chei_diferente(k, SL.compara(k, refc, canon.get(k), detaliat=True)))
        for x in d:
            pe_fel[x.split("|")[2]] += 1
        pct, ncmd = OUI.puncte(d)
        pe_sup[k] = {"puncte": pct, "desenata": k in canon, "unitati_referinta": SL.nr_unitati(refc), "comenzi_cu_diferente": ncmd,
                     "diferente": sorted(d)}
        total += pct
    pg.context.browser.close()
    return {"fereastra": [w, h], "total": total, "plasa": are_plasa, "pe_fel": dict(pe_fel.most_common()), "pe_suprafata": pe_sup,
            "erori": rez["erori"], "erori_js": erori[:5], "suprafete_randate": sorted(sup)}


def telefon(p, base):
    br = p.chromium.launch()
    ctx = br.new_context(viewport={"width": 375, "height": 740}, has_touch=True)
    SL.blocheaza_externe(ctx)
    pg = ctx.new_page()
    deschide(pg, base, {"ferestre": [{"aplicatie": "explorer", "titlu": "Acest PC"}]}, 375, 740)
    lat = pg.evaluate("document.documentElement.scrollWidth")
    mici = pg.evaluate("""[...document.querySelectorAll('.lh-w-bara [data-lh-tinta]')].filter(e=>{const s=getComputedStyle(e);return s.display!=='none'})
        .map(e=>{const b=e.getBoundingClientRect();return [e.getAttribute('data-lh-id').slice(0,30),Math.round(b.width),Math.round(b.height)]}).filter(x=>x[1]<32&&!/^Afișați desktopul/.test(x[0])||x[2]<32)""")
    bifa("telefon 375 px: pagina nu se lățește (scrollWidth ≤ 375)", lat <= 375, lat)
    bifa("telefon: butoanele barei ≥ 32 px (în afară de „Afișați desktopul”, 12 px și în referință)", not mici, mici)
    clic(pg, '[data-lh-tinta="bara_activitati"][data-lh-id="Start"]')
    pan = pg.locator(".lh-w-panou").bounding_box()
    bifa("telefon: panoul Start încape pe lățime", pan and pan["x"] >= 0 and pan["x"] + pan["width"] <= 375, pan)
    dale = pg.evaluate("[...document.querySelectorAll('.lh-w-dala')].map(e=>{const b=e.getBoundingClientRect();return [Math.round(b.width),Math.round(b.height),Math.round(b.right)]})")
    bifa("telefon: dalele Start ≥ 32 px și în fereastră", dale and all(w >= 32 and h >= 32 and r <= 375 for w, h, r in dale), dale[:4])
    REZ["telefon"] = {"scrollWidth": lat, "panou": pan, "dale": len(dale)}
    br.close()


def main():
    from playwright.sync_api import sync_playwright
    srv, base = SL.porneste_server(WT)
    with sync_playwright() as p:
        br = p.chromium.launch()
        ctx = br.new_context(viewport={"width": 1366, "height": 768})
        SL.blocheaza_externe(ctx)
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: REZ["erori_js"].append(str(e)))
        print("Partea 1 — comportamentul (1366×768)")
        try:
            partea1(pg, base)
        except Exception as e:
            bifa("partea 1 a mers până la capăt", False, str(e)[:300])
        bifa("nicio eroare JS pe poligon", not REZ["erori_js"], REZ["erori_js"][:3])
        br.close()
        print("Partea 2 — O3 de diagnostic")
        for w, h in ((1366, 768), (1536, 864)):
            r = o3_fereastra(p, base, w, h)
            REZ["o3"]["%dx%d" % (w, h)] = r
            print("  %d×%d: %d puncte · " % (w, h, r["total"]) + ", ".join("%s=%d" % (k, v["puncte"]) for k, v in r["pe_suprafata"].items()) +
                  " · pe fel: " + ", ".join("%s=%d" % kv for kv in list(r["pe_fel"].items())[:8]))
        print("Partea 3 — telefon (I1)")
        telefon(p, base)
    srv.shutdown()
    picate = sum(1 for v in REZ["verificari"] if not v["ok"])
    REZ["rezumat"] = {"verificari": len(REZ["verificari"]), "picate": picate}
    f = IES / "proba_windows.json"
    f.write_text(json.dumps(REZ, ensure_ascii=False, indent=1), encoding="utf-8")
    print("verificări: %d, picate: %d" % (len(REZ["verificari"]), picate))
    print(f)
    print(picate)


if __name__ == "__main__":
    main()
