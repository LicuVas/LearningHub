# -*- coding: utf-8 -*-
"""Proba rundei 30 (B-windows#2, unghiul aspect): N1, N2 din runde/26/critic.md, W4 (Explorer-ul bibliotecii montat în fereastra
shell-ului, cu A23-1 P1 + P2), A26-2 (Start la ridicarea tastei Windows) și MINOR „start_fundal”, pe poligon, cu gesturi ADEVĂRATE:
page.keyboard, page.mouse, page.touchscreen.tap (360 și 390 px). Headless, rețeaua tăiată în afară de 127.0.0.1
(structura_lib.blocheaza_externe), server pe port liber.

    python .../runde/30/proba_grav.py [N1 N2 W4 A262 SF TEL] [--eticheta pornire|final] [--minor4]
--minor4 = proba include redenumirea din Explorer în timpul redesenării gazdei (doar dacă runde/27/stare_autor.md are MINOR4_GATA).
Ieșirea: runde/30/probe_iesiri/proba_grav_<eticheta>.json; ultima linie = verificări picate.
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
MESAJ = "(() => [...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(m => m.textContent))()"
FOCUS = """(() => { const a = document.activeElement; return a ? {tag: a.tagName, in_windows: !!a.closest('[data-lh-aplicatie="windows"]'),
  in_explorer: !!a.closest('[data-lh-aplicatie="explorer"]'), clasa: String(a.className || '').slice(0, 40)} : null; })()"""
BUTON_EXPLORER = '.lh-w-bara [data-lh-id-mso="Appid: Microsoft.Windows.Explorer"]'
RAND = '[data-lh-aplicatie="explorer"] .lh-ap-e-rand[data-lh-id="%s"] .lh-ap-e-nume'
CONT_EX = {"folder": "Clasa a V-a", "arbore": ["Desene/", "Proiect/", "Proiect/plan.txt", "harta.png", "notite.txt", "tema.docx"],
           "continut": {"notite.txt": "De citit capitolul 2."}}
MONTAJ = """(() => { const w = document.querySelector('[data-lh-aplicatie="windows"]'), x = document.querySelector('[data-lh-aplicatie="explorer"]');
  if (!x) return {explorer: false};
  const fer = x.closest('.lh-w-fer'), corp = x.parentElement, c = corp.getBoundingClientRect(), r = x.getBoundingClientRect();
  const s = LH.aplicatii.stare('explorer');
  return {explorer: true, in_windows: !!(w && w.contains(x)), in_corp: !!(corp && corp.classList.contains('lh-w-corp')),
    fereastra: fer ? fer.getAttribute('data-lh-eticheta') : null, titlu_bara: fer ? fer.querySelector('.lh-w-tt').textContent : null,
    titlu_stare: s && s.titlu, incadrat: x.hasAttribute('data-lh-incadrat'), bara_proprie: x.querySelectorAll('.lh-ap-e-r1').length,
    umple: [r.x - c.x, r.y - c.y, r.width - c.width, r.height - c.height].map(Math.round), vizibil: r.width > 0 && r.height > 0,
    in_radacini: LH.aplicatii.radacini().indexOf(x) >= 0, cale: s && s.cale_curenta }; })()"""


def bifa(gr, nume, ok, dovada=None):
    REZ["verificari"].append({"grav": gr, "nume": nume, "ok": bool(ok), "dovada": None if ok else dovada})
    print(("  OK   " if ok else "  PICĂ ") + gr + " " + nume + ("" if ok else "  <- " + json.dumps(dovada, ensure_ascii=False)[:300]))


def pagina(br, base, w=1366, h=768, continut=None, telefon=False):
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


def st(pg, app="windows"):
    return pg.evaluate("a => LH.aplicatii.stare(a)", app)


def ev(pg):
    return pg.evaluate("window.__E.splice(0)")


def scurt(evs):
    return [(e["aplicatie"][:3], e["gest"], e["actiune"], e["tinta"], e.get("activat")) for e in evs]


def cutie(pg, sel):
    loc = pg.locator(sel)
    return loc.first.bounding_box() if loc.count() else None


def centru(b):
    return (b["x"] + b["width"] / 2, b["y"] + b["height"] / 2)


def clic(pg, sel, buton="left", n=1):
    b = cutie(pg, sel)
    if not b:
        return False
    pg.mouse.click(*centru(b), button=buton, click_count=n)
    pg.wait_for_timeout(150)
    return True


def atinge(pg, sel):
    b = cutie(pg, sel)
    if not b:
        return False
    pg.touchscreen.tap(*centru(b))
    pg.wait_for_timeout(300)
    return True


def win_cu(pg, tasta, pauza=60):
    pg.keyboard.down("Meta")
    pg.wait_for_timeout(pauza)
    pg.keyboard.press(tasta)
    pg.wait_for_timeout(60)
    pg.keyboard.up("Meta")
    pg.wait_for_timeout(200)


def start_vazut(pg):
    return pg.evaluate("!!document.querySelector('[data-lh-aplicatie=\"windows\"] .lh-w-start')")


def folder_nou_pe_desktop(pg):
    pg.mouse.click(700, 300, button="right")
    pg.wait_for_timeout(150)
    clic(pg, '[data-lh-suprafata="meniu_desktop"] [data-lh-id="Nou"]')
    clic(pg, '[data-lh-suprafata="meniu_desktop_nou"] [data-lh-id="Folder"]')
    pg.wait_for_timeout(150)


# ---------------------------------------------------------------- N1: focusul după redenumirea de pe desktop
def n1(br, base):
    drumuri = (("Enter", "Teme"), ("Esc", None), ("nume gol + Enter", ""), ("clic în afară", "Teme"))
    for drum, text in drumuri:
        pg = pagina(br, base)
        folder_nou_pe_desktop(pg)
        if text is not None:
            pg.keyboard.press("Control+a")
            if text:
                pg.keyboard.type(text)
            else:
                pg.keyboard.press("Backspace")
        if drum == "Esc":
            pg.keyboard.press("Escape")
        elif drum == "clic în afară":
            pg.mouse.click(900, 500)
        else:
            pg.keyboard.press("Enter")
        pg.wait_for_timeout(200)
        s = st(pg)
        f = pg.evaluate(FOCUS)
        nume = "Teme" if text == "Teme" else "Folder nou"
        bifa("N1", "%s: redenumirea s-a încheiat, „%s” pe desktop" % (drum, nume), s["redenumire"] is None and nume in s["pictograme_desktop"], [s["redenumire"], s["pictograme_desktop"]])
        bifa("N1", "%s: focusul e în rădăcina Windows (nu pe <body>)" % drum, f and f["in_windows"], f)
        if drum != "clic în afară":
            ales = pg.evaluate("n => { const e = document.querySelector('.lh-w-desk .lh-w-ico[data-lh-id=\"' + n + '\"]'); return e ? e.classList.contains('lh-w-ales') : null; }", nume)
            bifa("N1", "%s: pictograma „%s” rămâne selectată (stare + ecran)" % (drum, nume), s["selectie"] == [nume] and ales, [s["selectie"], ales])
            ev(pg)
            if drum == "Enter":
                pg.keyboard.press("Delete")
                pg.wait_for_timeout(150)
                e = ev(pg)
                s2 = st(pg)
                bifa("N1", "Enter, apoi Delete → mutare_in_cos, „Teme” pleacă de pe desktop", any(x["actiune"] == "mutare_in_cos" for x in e) and "Teme" not in s2["pictograme_desktop"], [scurt(e), s2["pictograme_desktop"]])
            else:
                pg.keyboard.press("F2")
                pg.wait_for_timeout(150)
                e = ev(pg)
                bifa("N1", "%s, apoi F2 → redenumire_incepe" % drum, any(x["actiune"] == "redenumire_incepe" for x in e) and st(pg)["redenumire"] == nume, scurt(e))
                pg.keyboard.press("Escape")
                pg.wait_for_timeout(150)
        else:
            ev(pg)
            pg.keyboard.press("F2")
            pg.wait_for_timeout(120)
            e = ev(pg)
            bifa("N1", "clic în afară, apoi F2 → un eveniment (nu tăcere)", len(e) == 1, scurt(e))
        ev(pg)
        pg.keyboard.press("Meta")
        pg.wait_for_timeout(200)
        e = ev(pg)
        bifa("N1", "%s: la final, tasta Windows → deschide_start, Start pe ecran" % drum, any(x["actiune"] == "deschide_start" for x in e) and start_vazut(pg), scurt(e))
        pg.context.close()


# ---------------------------------------------------------------- N2: tasta Windows + altă tastă decât o literă
N2_TASTE = (("Space", "Windows + Spațiu"), ("1", "Windows + 1"), ("Period", "Windows + ."), ("Tab", "Windows + Tab"),
            ("ArrowUp", "Windows + ↑"), ("Comma", "Windows + ,"))


def n2(br, base):
    for tasta, mesaj in N2_TASTE:
        for fel in ("desktop", "Start deschis cu mouse-ul"):
            pg = pagina(br, base, continut={"ferestre": [{"aplicatie": "explorer", "titlu": "Acasă", "activa": True}]})
            if fel != "desktop":
                clic(pg, '.lh-w-bara [data-lh-id="Start"]')
            ev(pg)
            win_cu(pg, tasta)
            pg.wait_for_timeout(100)
            e = ev(pg)
            w = [x for x in e if x["gest"].startswith("win_")]
            m = pg.evaluate(MESAJ)
            s = st(pg)
            bifa("N2", "%s · Windows + %s: un singur gest win_*" % (fel, tasta), len(w) == 1, scurt(e))
            bifa("N2", "%s · Windows + %s: mesajul central „%s”" % (fel, tasta, mesaj), any(("„" + mesaj + "”") in x for x in m), m)
            bifa("N2", "%s · Windows + %s: Start închis (stare + ecran)" % (fel, tasta), not s["meniu_start_deschis"] and not start_vazut(pg), [s["meniu_start_deschis"], scurt(e)])
            pg.context.close()
    # Windows + Shift + S rămâne ca la runda 26; Windows + E nu mai e „nesimulat” (W4), Windows + D rămâne mesajul
    pg = pagina(br, base)
    ev(pg)
    pg.keyboard.down("Meta")
    pg.keyboard.press("Shift+s")
    pg.keyboard.up("Meta")
    pg.wait_for_timeout(200)
    e = ev(pg)
    bifa("N2", "Windows + Shift + S → win_shift_s (neschimbat)", [x["gest"] for x in e if x["gest"].startswith("win_")] == ["win_shift_s"], scurt(e))
    win_cu(pg, "d")
    e = ev(pg)
    bifa("N2", "Windows + D → win_d + mesajul „Windows + D” (neschimbat)", [x["gest"] for x in e] == ["win_d"] and any("„Windows + D”" in x for x in pg.evaluate(MESAJ)), scurt(e))
    pg.context.close()


# ---------------------------------------------------------------- W4: Explorer-ul bibliotecii montat în fereastra shell-ului
def deschide_montat(pg, cum):
    ev(pg)
    if cum == "clic":
        clic(pg, BUTON_EXPLORER)
    else:
        win_cu(pg, "e")
    try:
        pg.wait_for_function("!!document.querySelector('[data-lh-aplicatie=\"explorer\"]') && !!LH.aplicatii.stare('explorer')", timeout=4000)
    except Exception:
        pass
    pg.wait_for_timeout(300)
    return ev(pg)


def w4(br, base, minor4):
    for cum in ("clic", "Windows + E"):
        pg = pagina(br, base, continut={"explorer": CONT_EX})
        e = deschide_montat(pg, cum)
        m = pg.evaluate(MONTAJ)
        s = st(pg)
        bifa("W4", "%s → Explorer-ul bibliotecii e montat în corpul unei ferestre a shell-ului" % cum, m.get("explorer") and m.get("in_windows") and m.get("in_corp"), m)
        if not m.get("explorer"):
            bifa("W4", "%s → evenimentul Windows nu e „nesimulat”" % cum, False, scurt(e))
            pg.context.close()
            continue
        bifa("W4", "%s → fără bara de titlu proprie, umple corpul, e în LH.aplicatii.radacini()" % cum, m["incadrat"] and m["bara_proprie"] == 0 and m["umple"] == [0, 0, 0, 0] and m["in_radacini"], m)
        bifa("W4", "%s → titlul ferestrei = stare().titlu al Explorer-ului („Clasa a V-a - Explorer”)" % cum, m["titlu_bara"] == m["titlu_stare"] == m["fereastra"] == "Clasa a V-a - Explorer", m)
        fe = [f for f in s["ferestre"] if f["aplicatie"] == "explorer"]
        bifa("W4", "%s → stare(): o fereastră explorer, activă, cu titlul Explorer-ului; Start închis" % cum, len(fe) == 1 and fe[0]["activa"] and fe[0]["titlu"] == "Clasa a V-a - Explorer" and not s["meniu_start_deschis"], s["ferestre"])
        we = [x for x in e if x["aplicatie"] == "windows"]
        bifa("W4", "%s → evenimentul Windows: pornire_aplicatie (nu nesimulat), fără mesajul „Windows + E”" % cum, any(x["actiune"] == "pornire_aplicatie" for x in we) and not any(x["actiune"] == "nesimulat" for x in we) and not any("Windows + E" in x for x in pg.evaluate(MESAJ)), scurt(e))
        f = pg.evaluate(FOCUS)
        bifa("W4", "%s → focusul tastaturii e în Explorer" % cum, f and f["in_explorer"], f)
        if cum == "clic":
            # P1: clicurile din Explorer sunt doar ale lui
            clic(pg, RAND % "harta.png")
            clic(pg, RAND % "notite.txt", buton="right")
            pg.keyboard.press("Escape")
            pg.wait_for_timeout(100)
            clic(pg, RAND % "Desene", n=2)
            pg.wait_for_timeout(250)
            e = ev(pg)
            straine = [x for x in e if x["aplicatie"] != "explorer"]
            bifa("W4", "clic / clic dreapta / dublu clic în Explorer → evenimente doar „explorer”, 0 ale gazdei (A23-1 P1)", e and not straine, {"straine": scurt(straine)[:5], "toate": len(e)})
            m = pg.evaluate(MONTAJ)
            bifa("W4", "dublu clic pe „Desene” → titlul ferestrei shell-ului urmează folderul („Desene - Explorer”)", m["titlu_bara"] == m["titlu_stare"] == "Desene - Explorer" and st(pg)["ferestre"][0]["titlu"] == "Desene - Explorer", m)
            pg.keyboard.press("Backspace")
            pg.wait_for_timeout(200)
            # P2: deschideSuprafata(cheie, aplicația cerută)
            r = pg.evaluate("""() => LH.aplicatii.deschideSuprafata('meniu_nou', 'explorer').then(x => ({x, m: !!document.querySelector('[data-lh-aplicatie="explorer"] [data-lh-suprafata="meniu_nou"]')}), e => ({err: String(e)}))""")
            bifa("W4", "deschideSuprafata('meniu_nou', 'explorer') deschide meniul Nou al Explorer-ului montat (A23-1 P2)", r.get("m") is True, r)
            r0 = pg.evaluate("() => LH.aplicatii.deschideSuprafata('start').then(x => x, e => String(e))")
            bifa("W4", "deschideSuprafata('start') fără al doilea argument = prima aplicație vie (Windows), ca înainte", r0 is True and st(pg)["meniu_start_deschis"], r0)
            pg.keyboard.press("Escape")
            pg.wait_for_timeout(150)
            clic(pg, RAND % "harta.png")
            ev(pg)
            # minimizare / readucere
            cale0 = st(pg, "explorer")["cale_curenta"]
            clic(pg, '.lh-w-fer [data-lh-tinta="bara_titlu"][data-lh-id="Minimizare"]')
            s = st(pg)
            sx = st(pg, "explorer")
            bifa("W4", "Minimizare → fereastra „min”, Explorer-ul trăiește (stare citită) și nu se vede", s["ferestre"][0]["stare"] == "min" and sx is not None and not pg.evaluate("(() => { const x = document.querySelector('[data-lh-aplicatie=\"explorer\"]'); return !!x && x.getClientRects().length > 0; })()"), [s["ferestre"], sx and sx["cale_curenta"]])
            clic(pg, BUTON_EXPLORER)
            pg.wait_for_timeout(150)
            m = pg.evaluate(MONTAJ)
            s = st(pg)
            bifa("W4", "clic pe dosarul galben → restaurare: Explorer-ul înapoi în corp, același folder, focusul în el", s["ferestre"][0]["stare"] == "normal" and m.get("in_corp") and m.get("cale") == cale0 and (pg.evaluate(FOCUS) or {}).get("in_explorer"), [s["ferestre"], m, pg.evaluate(FOCUS)])
            e = ev(pg)
            bifa("W4", "… evenimentele Windows: minimizare, restaurare", [x["actiune"] for x in e if x["aplicatie"] == "windows"] == ["minimizare", "restaurare"], scurt(e))
            # redesenarea gazdei (ResizeObserver → deseneaza)
            clic(pg, RAND % "tema.docx")
            pg.keyboard.press("Control+c")
            pg.set_viewport_size({"width": 1280, "height": 720})
            pg.wait_for_timeout(400)
            m = pg.evaluate(MONTAJ)
            f = pg.evaluate(FOCUS)
            sx = st(pg, "explorer")
            bifa("W4", "redesenarea gazdei (1366 → 1280): Explorer-ul pus înapoi în corp, aceeași stare, focusul în el", m.get("in_corp") and sx and sx["selectie"] == ["tema.docx"] and f and f["in_explorer"], [m, sx and sx["selectie"], f])
            pg.keyboard.press("Control+v")
            pg.wait_for_timeout(200)
            sx = st(pg, "explorer")
            bifa("W4", "… Ctrl+V după redesenare lipește „tema - Copie.docx” (tastele merg tot la Explorer)", sx and "tema - Copie.docx" in sx["nume_fisiere"], sx and sx["nume_fisiere"])
            if minor4:
                clic(pg, RAND % "notite.txt")
                pg.keyboard.press("F2")
                pg.wait_for_timeout(100)
                pg.keyboard.press("Control+a")
                pg.keyboard.type("abc")
                pg.set_viewport_size({"width": 1366, "height": 768})
                pg.wait_for_timeout(400)
                pg.keyboard.type("d")
                pg.keyboard.press("Enter")
                pg.wait_for_timeout(200)
                sx = st(pg, "explorer")
                bifa("W4", "MINOR 4: redenumire în Explorer, redesenarea gazdei la mijloc, apoi „d” + Enter → „abcd.txt”", sx and "abcd.txt" in sx["nume_fisiere"], sx and sx["nume_fisiere"])
            # tasta Windows cu focusul în Explorer = a shell-ului
            clic(pg, RAND % "harta.png")
            ev(pg)
            pg.keyboard.press("Meta")
            pg.wait_for_timeout(250)
            e = ev(pg)
            bifa("W4", "tasta Windows cu focusul în Explorer → Start se deschide (eveniment Windows deschide_start), Explorer-ul nu o ia", any(x["aplicatie"] == "windows" and x["actiune"] == "deschide_start" for x in e) and not any(x["aplicatie"] == "explorer" for x in e) and start_vazut(pg), scurt(e))
            pg.keyboard.press("Escape")
            pg.wait_for_timeout(150)
            # meniul desktopului deschis, apoi clic în Explorer: meniul se închide, fereastra rămâne activă
            pg.mouse.click(40, 400, button="right")
            pg.wait_for_timeout(150)
            menu1 = st(pg)["meniu_deschis"]
            clic(pg, RAND % "harta.png")
            s = st(pg)
            bifa("W4", "meniul desktopului deschis, apoi clic în Explorer → meniul se închide", menu1 == "meniu_desktop" and s["meniu_deschis"] is None, [menu1, s["meniu_deschis"]])
            # o altă fereastră deasupra, apoi clic în Explorer → Explorer devine activ
            pg.keyboard.press("Meta")
            pg.wait_for_timeout(150)
            for ch in "pai":
                pg.keyboard.press(ch)
                pg.wait_for_timeout(50)
            pg.keyboard.press("Enter")
            pg.wait_for_timeout(300)
            s = st(pg)
            act = [f["aplicatie"] for f in s["ferestre"] if f["activa"]]
            fx = [f for f in s["ferestre"] if f["aplicatie"] == "explorer"][0]
            pg.mouse.click(fx["x"] + fx["w"] - 60, fx["y"] + fx["h"] - 60)
            pg.wait_for_timeout(200)
            s2 = st(pg)
            act2 = [f["aplicatie"] for f in s2["ferestre"] if f["activa"]]
            bifa("W4", "Paint deasupra (activ), clic în Explorer → fereastra Explorer devine activă", act == ["paint"] and act2 == ["explorer"], [act, act2])
            # închiderea
            ev(pg)
            clic(pg, '.lh-w-fer[data-lh-id="explorer"] [data-lh-tinta="bara_titlu"][data-lh-id="Închidere"]')
            pg.wait_for_timeout(200)
            s = st(pg)
            e = ev(pg)
            bifa("W4", "Închidere → fereastra pleacă din stare și din bară, instanța Explorer e închisă", not [f for f in s["ferestre"] if f["aplicatie"] == "explorer"] and st(pg, "explorer") is None and not pg.evaluate("!!document.querySelector('[data-lh-aplicatie=\"explorer\"]')") and any(x["actiune"] == "inchidere_fereastra" for x in e), [s["ferestre"], scurt(e)])
            e = deschide_montat(pg, "clic")
            bifa("W4", "după închidere, dosarul galben îl deschide din nou (montat, folderul de pornire)", (pg.evaluate(MONTAJ) or {}).get("titlu_bara") == "Clasa a V-a - Explorer", [pg.evaluate(MONTAJ), scurt(e)])
        pg.context.close()
    # Explorer-ul deschis separat (lecția îl are deja) nu e furat de shell
    pg = pagina(br, base)
    pg.evaluate("() => { const d = document.createElement('div'); d.id = 'loc2'; document.body.appendChild(d); return LH.aplicatii.deschide('explorer', {loc: '#loc2'}); }")
    pg.wait_for_timeout(300)
    ev(pg)
    clic(pg, BUTON_EXPLORER)
    pg.wait_for_timeout(300)
    rad = pg.evaluate("(() => { const x = document.querySelector('[data-lh-aplicatie=\"explorer\"]'); return x ? x.parentElement.id : null; })()")
    bifa("W4", "cu un Explorer deschis separat de pagină: dosarul galben nu-l mută și nu-l închide", rad == "loc2", [rad, scurt(ev(pg))])
    pg.context.close()


# ---------------------------------------------------------------- A26-2: Start la ridicarea tastei Windows
def a262(br, base):
    pg = pagina(br, base)
    ev(pg)
    pg.keyboard.down("Meta")
    pg.wait_for_timeout(180)
    clipa = start_vazut(pg)
    e0 = ev(pg)
    pg.keyboard.press("e")
    pg.wait_for_timeout(60)
    pg.keyboard.up("Meta")
    pg.wait_for_timeout(300)
    e = ev(pg)
    bifa("A262", "Windows ținut 180 ms, apoi E: Start nu se desenează între timp (fără clipire)", not clipa and not e0, [clipa, scurt(e0)])
    bifa("A262", "… și nu se emite tasta_windows / deschide_start (asistentul nu bifează pasul Start)", not any(x["gest"] == "tasta_windows" for x in e0 + e), scurt(e0 + e))
    pg.context.close()
    pg = pagina(br, base)
    ev(pg)
    pg.keyboard.down("Meta")
    pg.wait_for_timeout(120)
    jos = start_vazut(pg)
    pg.keyboard.up("Meta")
    pg.wait_for_timeout(200)
    e = ev(pg)
    s = st(pg)
    bifa("A262", "tasta Windows singură: Start apare la ridicare (nu la apăsare)", not jos and s["meniu_start_deschis"] and start_vazut(pg), [jos, s["meniu_start_deschis"]])
    bifa("A262", "… un singur eveniment: tasta_windows / deschide_start, activat = bara_activitati:Start",
         len(e) == 1 and e[0]["gest"] == "tasta_windows" and e[0]["actiune"] == "deschide_start" and e[0].get("activat") == "bara_activitati:Start", scurt(e))
    pg.keyboard.press("Meta")
    pg.wait_for_timeout(200)
    e = ev(pg)
    bifa("A262", "a doua apăsare: tasta_windows / inchide_start, Start închis", len(e) == 1 and e[0]["actiune"] == "inchide_start" and not start_vazut(pg), scurt(e))
    pg.context.close()


# ---------------------------------------------------------------- unghiul aspect: fereastra Explorer montată pe ecranele clasei
GEOM = """(() => { const r = document.querySelector('[data-lh-aplicatie="windows"]').getBoundingClientRect();
  const f = document.querySelector('.lh-w-fer[data-lh-id="explorer"]'), x = document.querySelector('[data-lh-aplicatie="explorer"]');
  if (!f || !x) return null;
  const g = f.getBoundingClientRect(), c = x.parentElement.getBoundingClientRect(), xr = x.getBoundingClientRect();
  const bara = document.querySelector('.lh-w-bara').getBoundingClientRect();
  const bt = [...f.querySelectorAll('[data-lh-tinta="bara_titlu"]')].map(b => { const q = b.getBoundingClientRect(), e = document.elementFromPoint(q.x + q.width / 2, q.y + q.height / 2);
    return {id: b.getAttribute('data-lh-id'), pe_ecran: !!(e && e.closest('[data-lh-tinta="bara_titlu"]') === b)}; });
  return {fer: [g.x - r.x, g.y - r.y, g.width, g.height].map(Math.round), radacina: [r.width, r.height].map(Math.round), bara_sus: Math.round(bara.top - r.y),
    umple: [xr.x - c.x, xr.y - c.y, xr.width - c.width, xr.height - c.height].map(Math.round), butoane: bt,
    lat_pagina: document.documentElement.scrollWidth, ingust_ex: x.classList.contains('lh-ap-e-ingust'),
    font_titlu: getComputedStyle(f.querySelector('.lh-w-tt')).fontFamily.split(',')[0]}; })()"""


def asp(br, base):
    for w, h, dsf, tel_ in ((1366, 768, 1, False), (1366, 768, 1.25, False), (1920, 1080, 1, False), (1093, 526, 1, False), (360, 740, 1, True), (390, 844, 1, True)):
        ctx = br.new_context(viewport={"width": w, "height": h}, device_scale_factor=dsf, has_touch=tel_, is_mobile=tel_)
        SL.blocheaza_externe(ctx)
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: REZ["erori_js"].append(str(e)[:200]))
        pg.on("request", lambda r: REZ["plecate"].append(r.url) if not r.url.startswith(("http://127.0.0.1", "http://localhost", "data:", "blob:")) else None)
        pg.goto(base + "aplicatii/poligon.html", wait_until="load")
        pg.evaluate(ASCULTA)
        pg.evaluate("c => LH.aplicatii.deschide('windows', {focus: true, continut: c})", {"explorer": CONT_EX})
        pg.wait_for_timeout(300)
        pg.keyboard.down("Meta")
        pg.keyboard.press("e")
        pg.keyboard.up("Meta")
        try:
            pg.wait_for_function("!!LH.aplicatii.stare('explorer')", timeout=4000)
        except Exception:
            pass
        pg.wait_for_timeout(400)
        g = pg.evaluate(GEOM)
        et = "%dx%d@%s" % (w, h, dsf)
        if not g:
            bifa("ASP", et + ": fereastra Explorer montată există", False, g)
            ctx.close()
            continue
        fx, fy, fw, fh = g["fer"]
        incape = fx >= 0 and fy >= 0 and fx + fw <= g["radacina"][0] and fy + fh <= g["bara_sus"]
        bifa("ASP", et + ": fereastra încape în zona de lucru (deasupra barei), pagina nu se lățește", incape and g["lat_pagina"] <= w, g)
        bifa("ASP", et + ": Minimizare / Maximizare / Închidere pe ecran (elementFromPoint = butonul)", g["butoane"] and all(b["pe_ecran"] for b in g["butoane"]), g["butoane"])
        bifa("ASP", et + ": Explorer-ul umple corpul ferestrei (0 px) și titlul e în Segoe UI", g["umple"] == [0, 0, 0, 0] and "Segoe UI" in g["font_titlu"], [g["umple"], g["font_titlu"]])
        if w >= 1366:
            bifa("ASP", et + ": fereastra nu e mai mare decât cea din referință (1534 × 814) și ocupă cel puțin 70 % din lățime", fw <= 1534 and fh <= 814 and fw >= 0.7 * w, g["fer"])
        pg.screenshot(path=str(IES / ("asp_%s.png" % et.replace("@", "_").replace(".", "_"))))
        ctx.close()


# ---------------------------------------------------------------- MINOR start_fundal
def sf(br, base):
    pg = pagina(br, base)
    clic(pg, '.lh-w-bara [data-lh-id="Start"]')
    ev(pg)
    pg.mouse.click(60, 200, button="right")
    pg.wait_for_timeout(200)
    e = ev(pg)
    m = pg.evaluate(MESAJ)
    bifa("SF", "clic dreapta în afara panoului Start → Start închis, fără eticheta internă „start_fundal” în mesaj",
         not st(pg)["meniu_start_deschis"] and not any("start_fundal" in x for x in m), [scurt(e), m])
    if not start_vazut(pg):
        clic(pg, '.lh-w-bara [data-lh-id="Start"]')
    b = cutie(pg, '.lh-w-panou')
    ev(pg)
    pg.mouse.click(b["x"] + 8, b["y"] + b["height"] - 4, button="right")
    pg.wait_for_timeout(200)
    m = pg.evaluate(MESAJ)
    bifa("SF", "clic dreapta pe fondul panoului Start → niciun mesaj cu ținta internă („start”)", not any("„start”" in x or "start_fundal" in x for x in m), [scurt(ev(pg)), m])
    pg.context.close()


# ---------------------------------------------------------------- telefonul (360 / 390)
def tel(br, base):
    for w, h in ((360, 740), (390, 844)):
        pg = pagina(br, base, w, h, continut={"explorer": CONT_EX}, telefon=True)
        ev(pg)
        # pe ecranul îngust dosarul galben stă în banda derulabilă a barei, după Vizualizare activități / To Do: glisare adevărată
        # (CDP Input.dispatchTouchEvent, degetul spre stânga, ca proba criticului 26 › c3.py) până se vede, apoi atingere
        bm = cutie(pg, ".lh-w-mijloc")
        cdp = pg.context.new_cdp_session(pg)
        x0, y0 = bm["x"] + bm["width"] - 10, bm["y"] + 24
        cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y0}]})
        for k in range(1, 13):
            cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 - 80 * k / 12, "y": y0}]})
            pg.wait_for_timeout(30)
        pg.wait_for_timeout(120)
        cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
        pg.wait_for_timeout(500)
        vaz = pg.evaluate("s => { const b = document.querySelector(s).getBoundingClientRect(), x = b.x + b.width / 2, y = b.y + b.height / 2, e = document.elementFromPoint(x, y); return !!(e && e.closest(s)); }", BUTON_EXPLORER)
        bifa("TEL", "%d px: după glisarea benzii barei, dosarul galben se vede și se poate atinge" % w, vaz, vaz)
        atinge(pg, BUTON_EXPLORER)
        try:
            pg.wait_for_function("!!LH.aplicatii.stare('explorer')", timeout=4000)
        except Exception:
            pass
        pg.wait_for_timeout(300)
        m = pg.evaluate(MONTAJ)
        s = st(pg)
        fe = [f for f in s["ferestre"] if f["aplicatie"] == "explorer"]
        lat = pg.evaluate("document.documentElement.scrollWidth")
        bifa("TEL", "%d px: atingerea pe dosarul galben montează Explorer-ul, fereastra maximizată, pagina nu se lățește" % w,
             m.get("in_corp") and fe and fe[0]["stare"] == "max" and lat <= w, [m, s["ferestre"], lat])
        if m.get("in_corp"):
            ev(pg)
            atinge(pg, RAND % "harta.png")
            e = ev(pg)
            sx = st(pg, "explorer")
            bifa("TEL", "%d px: atingere pe „harta.png” → selectată în Explorer, 0 evenimente ale gazdei" % w,
                 sx and sx["selectie"] == ["harta.png"] and not [x for x in e if x["aplicatie"] != "explorer"], [sx and sx["selectie"], scurt(e)])
            atinge(pg, '.lh-w-fer [data-lh-tinta="bara_titlu"][data-lh-id="Închidere"]')
            bifa("TEL", "%d px: butonul Închidere e pe ecran și închide Explorer-ul" % w, st(pg, "explorer") is None, st(pg)["ferestre"])
        pg.context.close()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sect", nargs="*")
    ap.add_argument("--eticheta", default="final")
    ap.add_argument("--minor4", action="store_true")
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    srv, base = SL.porneste_server(WT)
    toate = (("N1", n1), ("N2", n2), ("W4", lambda b, u: w4(b, u, a.minor4)), ("A262", a262), ("SF", sf), ("TEL", tel), ("ASP", asp))
    with sync_playwright() as p:
        br = p.chromium.launch()
        for nume, fn in toate:
            if a.sect and nume not in a.sect:
                continue
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
    print(f.name)
    print(picate)


if __name__ == "__main__":
    main()
