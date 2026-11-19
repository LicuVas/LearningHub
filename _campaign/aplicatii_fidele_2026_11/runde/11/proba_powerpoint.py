# -*- coding: utf-8 -*-
"""Runda 11 · proba constructorului: gesturi REALE (mouse + tastatură, Playwright headless) pe aplicatii/poligon.html cu
PowerPoint, starea înainte și după fiecare gest, plus evenimentele §4 emise. Doar 127.0.0.1 (regula 24: restul se
abandonează). Ieșirea: runde/11/proba_powerpoint.json; ultima linie = numărul de verificări picate.
    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/proba_powerpoint.py
"""
import functools
import http.server
import json
import sys
import threading
from pathlib import Path
from urllib.parse import urlsplit

from playwright.sync_api import sync_playwright

AICI = Path(__file__).resolve().parent
WT = AICI.parents[3]
IESIRE = AICI / "proba_powerpoint.json"


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


def server():
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=str(WT)))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, "http://127.0.0.1:%d" % s.server_address[1]


REZ = []


def verifica(nume, ok, detalii=None):
    REZ.append({"verificare": nume, "ok": bool(ok), "detalii": detalii})
    print(("  ok   " if ok else "  RĂU ") + nume + ("" if ok else "  " + json.dumps(detalii, ensure_ascii=False)[:300]))


def main():
    srv, baza = server()
    plecate = []
    with sync_playwright() as p:
        br = p.chromium.launch(headless=True)
        ctx = br.new_context(viewport={"width": 1366, "height": 768})

        def ruta(r):
            if urlsplit(r.request.url).hostname not in ("127.0.0.1", "localhost"):
                plecate.append(r.request.url)
                return r.abort()
            return r.continue_()
        ctx.route("**/*", ruta)
        pg = ctx.new_page()
        erori = []
        pg.on("pageerror", lambda e: erori.append(str(e)))
        pg.goto(baza + "/aplicatii/poligon.html?aplicatie=powerpoint", wait_until="load")
        pg.wait_for_selector('[data-lh-aplicatie="powerpoint"] [data-lh-tinta="miniatura"]', timeout=15000)
        pg.evaluate("window.__marca=(window.__lhAplicatieEv||[]).length")
        st = lambda: pg.evaluate("LH.aplicatii.stare('powerpoint')")
        ev = lambda: pg.evaluate("(()=>{const E=window.__lhAplicatieEv||[];const o=E.slice(window.__marca).map(e=>({gest:e.gest,actiune:e.actiune,tinta:e.tinta}));window.__marca=E.length;return o})()")
        el = lambda t: pg.evaluate_handle("t=>LH.aplicatii.element('powerpoint',t)", t).as_element()

        s0 = st()
        verifica("pornire: 3 diapozitive din poligon", len(s0["diapozitive"]) == 3, s0["diapozitive"])
        # 1. clic pe miniatura 2, apoi Ctrl+M
        el("miniatura:2").click()
        pg.keyboard.press("Control+m")
        s1 = st()
        verifica("Ctrl+M după miniatura 2: 4 diapozitive, al 3-lea Title and Content, activ 3",
                 len(s1["diapozitive"]) == 4 and s1["diapozitive"][2]["aspect"] == "Title and Content" and s1["diapozitiv_activ"] == 3, s1["diapozitive"])
        e1 = ev()
        verifica("evenimente: clic pe miniatură + ctrl_m", any(e["tinta"] == "miniatura:2" for e in e1) and any(e["gest"] == "ctrl_m" and e["actiune"] == "diapozitiv_nou" for e in e1), e1)
        # 2. clic în titlul diapozitivului nou, tastare
        el("forma:3/1").click()
        pg.keyboard.type("Lava", delay=15)
        s2 = st()
        verifica("tastare în titlu: texte [Lava]", s2["diapozitive"][2]["texte"] == ["Lava"], s2["diapozitive"][2])
        ecran = pg.evaluate("LH.aplicatii.element('powerpoint','forma:3/1').innerText.replace(/\\s+/g,'')")
        verifica("ecranul = starea (titlul arată Lava)", ecran == "Lava", ecran)
        # 3. Ctrl+Z de două ori: tastarea (o unitate), apoi diapozitivul nou
        pg.keyboard.press("Control+z")
        pg.keyboard.press("Control+z")
        s3 = st()
        verifica("Ctrl+Z ×2: înapoi la 3 diapozitive", len(s3["diapozitive"]) == 3 and s3["diapozitive"] == s0["diapozitive"], s3["diapozitive"])
        # 4. Design › tema Ion (galeria derulată la rândul 2)
        el("mso:TabDesign").click()
        el("meniu:Ion").click()
        verifica("Design › Ion: tema = Ion", st()["tema"] == "Ion", st()["tema"])
        # 5. clic dreapta pe miniatura 1 › Duplicate Slide
        el("miniatura:1").click(button="right")
        verifica("meniul miniaturii din referință", el("meniu:Duplicate Slide") is not None)
        el("meniu:Duplicate Slide").click()
        s5 = st()
        verifica("Duplicate Slide: 4 diapozitive, 1 și 2 identice", len(s5["diapozitive"]) == 4 and s5["diapozitive"][0] == s5["diapozitive"][1], s5["diapozitive"][:2])
        # 6. comandă nesimulată -> mesajul central
        el("mso:TabReview").click()
        nes = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','mso:SpellingAccess')||[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-loc-panglica] [data-lh-tinta^=\"panglica:\"],[data-lh-aplicatie=powerpoint] .lh-ap-loc-panglica [data-lh-tinta^=\"panglica:\"]')][0];if(!e)return null;e.click();const m=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-nesimulat]:not([data-lh-tip])');return m&&m.getAttribute('role')==='status'?m.textContent:null})()")
        verifica("comandă nesimulată: mesajul central cu data-lh-nesimulat", bool(nes), nes)
        # 7. F5 = expunerea; Esc iese
        pg.keyboard.press("F5")
        verifica("F5: expunerea pornește de la diapozitivul 1", st()["expunere"] == 1, st()["expunere"])
        pg.keyboard.press("Escape")
        verifica("Esc: ieșire din expunere", st()["expunere"] is None, st()["expunere"])
        # ---------- constructorul 2: formatarea pe bucăți, ferestrele, salvarea
        R = "[data-lh-aplicatie=powerpoint] "
        pg.evaluate("window.__T=[];window.addEventListener('lh-aplicatie',e=>__T.push({gest:e.detail.gest,actiune:e.detail.actiune,tinta:e.detail.tinta,activat:e.detail.activat||null}))")
        aldin_ecran = lambda t: pg.evaluate("t=>[...LH.aplicatii.element('powerpoint',t).querySelectorAll('.lh-ap-p-par span:not([aria-hidden])')].filter(s=>getComputedStyle(s).fontWeight>=600).map(s=>s.textContent).join('')", t)
        el("mso:TabHome").click()
        el("miniatura:1").click()
        el("forma:1/1").click()
        pg.keyboard.press("Home")
        for _ in range(3):
            pg.keyboard.press("Shift+ArrowRight")
        pg.keyboard.press("Control+b")
        s9 = st()
        t9 = s9["formatare_pe_caractere"]
        titlu = s9["formatare_text"]["text"]
        verifica("Bold pe 3 litere: doar ele aldine (formatare_pe_caractere)", t9 and t9[0]["text"] == titlu[:3] and t9[0]["bold"] and all(not b["bold"] for b in t9[1:]), t9)
        verifica("ecranul = starea: pe diapozitiv doar cele 3 litere sunt aldine", aldin_ecran("forma:1/1") == titlu[:3], aldin_ecran("forma:1/1"))
        verifica("Bold apăsat în panglică (selecția e toată aldină)", pg.evaluate("LH.aplicatii.element('powerpoint','mso:Bold').getAttribute('aria-pressed')") == "true")
        pg.keyboard.press("ArrowLeft")   # cursorul strâns după litera 3 (în cuvânt) — apoi tastare: litera nouă moștenește aldinul
        pg.keyboard.press("End")
        pg.keyboard.press("Home")
        for _ in range(3):
            pg.keyboard.press("ArrowRight")
        pg.keyboard.type("X")
        s10 = st()
        verifica("litera scrisă după bucata aldină e aldină", s10["formatare_pe_caractere"][0]["text"] == titlu[:3] + "X", s10["formatare_pe_caractere"])
        pg.keyboard.press("Control+z")
        pg.keyboard.press("Control+z")
        s11 = st()
        verifica("Ctrl+Z ×2: textul și formatul de la pornire", s11["formatare_pe_caractere"] == [{"text": titlu, "bold": False, "italic": False, "underline": False, "marime": s11["formatare_text"]["marime"]}], s11["formatare_pe_caractere"])
        # cursor strâns ÎN cuvânt + Ctrl+I = tot cuvântul
        el("forma:1/1").click()
        pg.keyboard.press("Home")
        pg.keyboard.press("ArrowRight")
        pg.keyboard.press("ArrowRight")
        pg.keyboard.press("Control+i")
        s12 = st()
        cuv = titlu.split()[0]
        verifica("Ctrl+I cu cursorul în cuvânt: tot cuvântul cursiv", s12["formatare_pe_caractere"][0]["text"] == cuv and s12["formatare_pe_caractere"][0]["italic"], s12["formatare_pe_caractere"])
        pg.keyboard.press("Control+z")
        # caseta Font Size din Home: tot titlul ales, 40 + Enter
        el("forma:1/1").click()
        pg.keyboard.press("Control+a")
        inp = el("mso:FontSize").query_selector("[data-lh-tip=Edit] input")
        verifica("caseta Font Size arată mărimea titlului", inp.input_value() == str(s12["formatare_text"]["marime"]).replace(".0", ""), inp.input_value())
        inp.click()
        pg.keyboard.press("Control+a")
        pg.keyboard.type("40")
        pg.keyboard.press("Enter")
        s13 = st()
        verifica("Font Size 40 + Enter: tot titlul are 40", s13["formatare_text"]["marime"] == 40 and len(s13["formatare_pe_caractere"]) == 1, s13["formatare_pe_caractere"])
        verifica("focusul se întoarce în diapozitiv", pg.evaluate("document.activeElement && document.activeElement.hasAttribute('data-lh-intrare-document')"))
        # fereastra Font: Size arată 40; 28 + OK aplică; 10 + Esc nu schimbă nimic
        el("mso:FontDialogPowerPoint").click()
        sz = pg.locator(R + "[data-lh-tip=Edit][data-lh-eticheta=Size] input")
        verifica("Font: Size arată 40, Font style = Regular", sz.input_value() == "40" and pg.locator(R + "[data-lh-tip=ComboBox][data-lh-eticheta='Font style'] input").input_value() == "Regular", sz.input_value())
        sz.fill("28")
        el("fereastra:OK").click()
        verifica("Font › Size 28 › OK: titlul are 28", st()["formatare_text"]["marime"] == 28 and st()["dialog"] is None, st()["formatare_text"])
        el("mso:FontDialogPowerPoint").click()
        pg.locator(R + "[data-lh-tip=Edit][data-lh-eticheta=Size] input").fill("10")
        pg.keyboard.press("Escape")
        verifica("Font › 10 › Esc: nimic schimbat", st()["formatare_text"]["marime"] == 28 and st()["dialog"] is None, st()["formatare_text"])
        # fereastra Paragraph: After 12 + OK
        el("mso:PowerPointParagraphDialog").click()
        verifica("Paragraph: At = 0,9, Alignment = Centered (titlul Title Slide)", pg.locator(R + "[data-lh-tip=Edit][data-lh-eticheta=At] input").input_value() == "0,9"
                 and pg.locator(R + "[data-lh-tip=ComboBox][data-lh-eticheta=Alignment] input").input_value() == "Centered")
        pg.locator(R + "[data-lh-tip=Edit][data-lh-eticheta=After] input").fill("12")
        pg.keyboard.press("Enter")
        s15 = st()
        verifica("Paragraph › After 12 › Enter (= OK): spațiul după = 12 pt", s15["paragrafe_text"][0]["dupa"] == 12 and s15["dialog"] is None, s15["paragrafe_text"])
        # Insert › Table ▾ › Insert Table...: 4 coloane, rânduri 2 → More → 3, OK
        n0 = s15["diapozitive"][0]["forme"]
        el("mso:TabInsert").click()
        el("mso:TableInsertGallery").click()
        el("meniu:Insert Table...").click()
        verifica("Insert Table: fereastra din referință (5 × 2)", st()["dialog"] == {"titlu": "Insert Table"} and pg.locator(R + "[data-lh-tip=Edit][data-lh-eticheta='Number of columns'] input").input_value() == "5")
        pg.locator(R + "[data-lh-tip=Edit][data-lh-eticheta='Number of columns'] input").fill("4")
        pg.locator(R + "[data-lh-tip=Spinner][data-lh-eticheta='Number of rows'] [data-lh-eticheta=More]").click()
        el("fereastra:OK").click()
        s16 = st()
        tab = pg.evaluate("(()=>{const t=document.querySelector('[data-lh-aplicatie=powerpoint] .lh-ap-p-slide .lh-ap-p-tabel');return t?[t.rows.length,t.rows[0].cells.length]:null})()")
        verifica("Insert Table › 4, More, OK: tabel 3 × 4 pe diapozitiv", s16["diapozitive"][0]["forme"] == n0 + 1 and tab == [3, 4], [s16["diapozitive"][0], tab])
        # starea „modificat” și Save As (F12, nume, Enter)
        verifica("modificat = true după schimbări", s16["modificat"] is True)
        pg.keyboard.press("F12")
        pg.keyboard.press("Control+a")
        pg.keyboard.type("Vulcanii")
        pg.keyboard.press("Enter")
        s17 = st()
        verifica("Save As › Vulcanii › Enter: nume_fisier, modificat = false, titlul ferestrei", s17["nume_fisier"] == "Vulcanii.pptx" and s17["modificat"] is False
                 and "Vulcanii" in pg.evaluate("document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-tip=TitleBar]').textContent"), [s17["nume_fisier"], s17["modificat"]])
        pg.wait_for_timeout(50)
        e9 = pg.evaluate("__T")
        verifica("evenimente §4 pe gesturile noi (ctrl_b aldin, tasta_enter cu activat fereastra:OK, salvare)",
                 any(e["gest"] == "ctrl_b" and e["actiune"] == "aldin" for e in e9) and any(e["gest"] == "tasta_enter" and e["actiune"] == "paragraf" and e["activat"] == "fereastra:OK" for e in e9) and any(e["gest"] == "tasta_enter" and e["actiune"] == "salvare" and e["activat"] == "dialog_salvare:Save" for e in e9) and any(e["gest"] == "tasta_f12" and e["tinta"] != "camp:nume_fisier" for e in e9),
                 [x["gest"] + ">" + str(x["actiune"]) for x in e9][-12:])
        # 8. telefon (I1): la 375 px panglica se derulează lateral, nu se taie
        pg.set_viewport_size({"width": 375, "height": 740})
        pg.wait_for_timeout(300)
        lat = pg.evaluate("(()=>{const s=document.querySelector('[data-lh-aplicatie=powerpoint] .lh-ap-sus');return {client:s.clientWidth,scroll:s.scrollWidth,ov:getComputedStyle(s).overflowX}})()")
        verifica("telefon 375 px: banda de sus derulabilă (overflow-x auto)", lat["ov"] == "auto" and lat["scroll"] > lat["client"], lat)
        verifica("fără erori JS", not erori, erori[:3])
        br.close()
    srv.shutdown()
    picate = [r for r in REZ if not r["ok"]]
    IESIRE.write_text(json.dumps({"verificari": REZ, "picate": len(picate), "cereri_blocate": len(plecate)}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(len(picate))
    return 0 if not picate else 1


if __name__ == "__main__":
    sys.exit(main())
