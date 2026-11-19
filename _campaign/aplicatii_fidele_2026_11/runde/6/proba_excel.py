# -*- coding: utf-8 -*-
"""Runda 6 · proba constructorului: Excel din bibliotecă, pe poligon (aplicatii/poligon.html?aplicatie=excel), cu gesturi
REALE (Playwright: mouse și tastatură), headless, doar 127.0.0.1 (regula 24). Fiecare așteptare are sursa ei:
  ASPECT  — poziția elementelor zonei foii față de referinte/uia_excel.json › zona_document (toleranța O3: 8 px), textul
            barei de stare și al barei de titlu, ordinea filelor (file_panglicii);
  GEST    — starea după gest, cu regula luată din referinte/scenarii_real/excel-*.json (citat în `sursa`).
Rulare (ultima linie = numărul de cazuri picate):
    python .../runde/6/proba_excel.py [--iesire <fisier.json>]
Dosarul servit: LH_SERVIT (o copie a sitului) sau worktree-ul. Nu scrie nimic în afara fișierului --iesire."""
import argparse
import functools
import http.server
import json
import os
import sys
import threading
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

WT = "C:/00/Projects/LearningHub_fidel"
D = Path(WT) / "_campaign" / "aplicatii_fidele_2026_11"
REF = json.loads((D / "referinte" / "uia_excel.json").read_text(encoding="utf-8"))
TOL = 8


def real(i):
    return json.loads((D / "referinte" / "scenarii_real" / (i + ".json")).read_text(encoding="utf-8"))["stare"]


def ref_nod(pred, n=None):
    n = n or REF["suprafete"]["zona_document"]
    if pred(n):
        return n
    for c in n.get("copii") or []:
        x = ref_nod(pred, c)
        if x:
            return x
    return None


def server():
    class Tacut(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k):
            pass
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tacut, directory=os.environ.get("LH_SERVIT") or WT))
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, "http://127.0.0.1:%d" % s.server_address[1]


def ruta(r):
    h = urlparse(r.request.url).hostname
    return r.continue_() if h in ("127.0.0.1", "localhost") else r.abort()


RECT = """s=>{const r=document.querySelector('[data-lh-aplicatie="excel"]');if(!r)return null;const R=r.getBoundingClientRect();
  const e=r.querySelector(s);if(!e)return null;const b=e.getBoundingClientRect();
  return [Math.round(b.left-R.left),Math.round(b.top-R.top),Math.round(b.width),Math.round(b.height)]}"""
STARE = "()=>window.LH&&LH.aplicatii&&LH.aplicatii.stare('excel')"


def deschide(pg, baza):
    pg.goto(baza + "/aplicatii/poligon.html?aplicatie=excel", wait_until="load", timeout=25000)
    pg.wait_for_selector('[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="A1"]', timeout=10000)
    pg.wait_for_timeout(200)


def clic(pg, sel, **kw):
    pg.locator('[data-lh-aplicatie="excel"] ' + sel).first.click(timeout=5000, **kw)
    pg.wait_for_timeout(120)


def caz_aspect(pg):
    out = []
    # rădăcina = cadrul ferestrei (CONVENTIE_ARBORE.md §1); referința e față de colțul cadrului vizibil
    tinte = [
        ("Name Box", '[data-lh-tip="ComboBox"][data-lh-eticheta="Name Box"]', ref_nod(lambda n: n.get("tip") == "ComboBox" and n.get("eticheta") == "Name Box")),
        ("Formula Bar", '[data-lh-tip="Edit"][data-lh-eticheta="Formula Bar"]', ref_nod(lambda n: n.get("id_mso") == "FormulaBar")),
        ("antet A", '[data-lh-tinta="antet_coloana"][data-lh-id="A"]', ref_nod(lambda n: n.get("tip") == "DataItem" and n.get("eticheta") == "A")),
        ("antet C", '[data-lh-tinta="antet_coloana"][data-lh-id="C"]', ref_nod(lambda n: n.get("tip") == "DataItem" and n.get("eticheta") == "C")),
        ("antet 1", '[data-lh-tinta="antet_rand"][data-lh-id="1"]', ref_nod(lambda n: n.get("tip") == "DataItem" and n.get("eticheta") == "1")),
        ("antet 5", '[data-lh-tinta="antet_rand"][data-lh-id="5"]', ref_nod(lambda n: n.get("tip") == "DataItem" and n.get("eticheta") == "5")),
        ("Select All", '[data-lh-tip="HeaderItem"]', ref_nod(lambda n: n.get("tip") == "HeaderItem")),
        ("Sheet1", '[data-lh-tinta="fila_foii"][data-lh-id="Sheet1"]', ref_nod(lambda n: n.get("tip") == "TabItem" and n.get("eticheta") == "Sheet1")),
        ("Add Sheet", '[data-lh-tip="Button"][data-lh-eticheta="Add Sheet"]', ref_nod(lambda n: n.get("eticheta") == "Add Sheet")),
    ]
    for nume, sel, n in tinte:
        r = pg.evaluate(RECT, sel)
        rr = [round(x) for x in n["rect_css"]] if n else None
        ok = bool(r and rr and abs(r[0] - rr[0]) <= TOL and abs(r[1] - rr[1]) <= TOL)
        out.append({"id": "aspect." + nume, "ok": ok, "simulator": r, "referinta": rr,
                    "sursa": "uia_excel.json › zona_document (x, y față de cadru; toleranța %d px)" % TOL})
    t = pg.evaluate("""()=>{const r=document.querySelector('[data-lh-aplicatie="excel"]');const v=s=>{const e=r.querySelector(s);return e?e.innerText.trim():null};
      return {mod:v('[data-lh-suprafata="bara_stare"] [data-lh-eticheta^="Cell Mode"]'),zoom:v('[data-lh-suprafata="bara_stare"] [data-lh-eticheta^="Zoom 1"]'),
        titlu:v('[data-lh-suprafata="bara_titlu"] .lh-ap-x-titlu'),
        file:[...r.querySelectorAll('[data-lh-suprafata="file_panglicii"] [data-lh-tip="TabItem"]')].map(e=>e.innerText.trim()),
        qat:[...r.querySelectorAll('[data-lh-suprafata="acces_rapid"] [data-lh-tinta^="acces_rapid:"]')].map(e=>e.getAttribute('data-lh-tinta'))}}""")
    fr = [c.get("eticheta") for c in REF["suprafete"]["file_panglicii"]["copii"][1]["copii"] if c.get("tip") == "TabItem"]
    out.append({"id": "aspect.bara_stare", "ok": t["mod"] == "Ready" and t["zoom"] == "100 %", "simulator": [t["mod"], t["zoom"]],
                "referinta": ["Cell Mode Ready", "Zoom 100 %"], "sursa": "uia_excel.json › bara_stare (Text „Cell Mode Ready”, „Zoom 100 %”)"})
    # spațiile succesive se citesc ca unul (CONVENTIE_ARBORE.md §5: „spațiile strânse”; innerText la fel)
    out.append({"id": "aspect.titlu", "ok": " ".join((t["titlu"] or "").split()) == " ".join(ref_nod(lambda n: n.get("tip") == "TitleBar" and " - " in (n.get("eticheta") or ""), REF["suprafete"]["bara_titlu"])["eticheta"].split()), "simulator": t["titlu"], "referinta": "Book1  -  Excel",
                "sursa": "uia_excel.json › bara_titlu › TitleBar „Book1  -  Excel”"})
    out.append({"id": "aspect.file", "ok": t["file"] == fr, "simulator": t["file"], "referinta": fr, "sursa": "uia_excel.json › file_panglicii"})
    out.append({"id": "aspect.acces_rapid", "ok": t["qat"][:3] == ["acces_rapid:Save", "acces_rapid:Undo", "acces_rapid:Redo"], "simulator": t["qat"],
                "referinta": ["Save", "Undo", "Redo"], "sursa": "uia_excel.json › acces_rapid (afisat True: Save, Undo, Redo)"})
    return out


def caz_gesturi(pg):
    out = []
    ev0 = pg.evaluate("()=>(window.__lhAplicatieEv||[]).length")
    # 1. media pe românește: „;” între argumente (excel-separator-punct-si-virgula), virgula zecimală (excel-zecimale-virgula)
    clic(pg, '[data-lh-tinta="celula"][data-lh-id="D2"]')
    pg.keyboard.type("=AVERAGE(B2;C2)", delay=10)
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(150)
    s = pg.evaluate(STARE)
    d2 = (s or {}).get("celule", {}).get("D2")
    out.append({"id": "gest.media_ro", "ok": d2 == {"valoare": 9.5, "text": "9,5", "formula": "=AVERAGE(B2,C2)"} and s["selectie"]["activa"] == "D3",
                "simulator": [d2, (s or {}).get("selectie")], "referinta": "D2 = 9,5 (=AVERAGE(B2,C2)), activa D3",
                "sursa": "scenarii_real/excel-separator-punct-si-virgula.json (formula: " + real("excel-separator-punct-si-virgula")["celule"]["B1"]["formula"]
                         + "); excel-zecimale-virgula.json (text " + real("excel-zecimale-virgula")["celule"]["B2"]["text"] + ")"})
    # 2. pătrățelul de umplere D2 → D4 (excel-umplere-formula: formula se mută relativ)
    clic(pg, '[data-lh-tinta="celula"][data-lh-id="D2"]')
    m = pg.locator('[data-lh-aplicatie="excel"] [data-lh-tinta="maner_umplere"]').bounding_box()
    t = pg.locator('[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="D4"]').bounding_box()
    pg.mouse.move(m["x"] + m["width"] / 2, m["y"] + m["height"] / 2)
    pg.mouse.down()
    for k in range(1, 11):
        pg.mouse.move(m["x"] + m["width"] / 2, m["y"] + (t["y"] + t["height"] / 2 - m["y"]) * k / 10)
    pg.mouse.up()
    pg.wait_for_timeout(150)
    c = pg.evaluate(STARE)["celule"]
    ecr = pg.evaluate("()=>['D3','D4'].map(a=>{const e=document.querySelector('[data-lh-aplicatie=\"excel\"] [data-lh-tinta=\"celula\"][data-lh-id=\"'+a+'\"]');return e?e.innerText.trim():null})")
    out.append({"id": "gest.umplere_formula", "ok": c.get("D3", {}).get("formula") == "=AVERAGE(B3,C3)" and c.get("D4", {}).get("text") == "7" and ecr == ["7,5", "7"],
                "simulator": [c.get("D3"), c.get("D4"), ecr], "referinta": "D3 =AVERAGE(B3,C3) 7,5; D4 =AVERAGE(B4,C4) 7 (și pe ecran)",
                "sursa": "scenarii_real/excel-umplere-formula.json (B2 " + real("excel-umplere-formula")["celule"]["B2"]["formula"] + ")"})
    # 3. Ctrl+Z de două ori: umplerea, apoi media dispar (excel-ctrl-z-celula: o confirmare = o unitate)
    pg.keyboard.press("Control+z")
    pg.keyboard.press("Control+z")
    pg.wait_for_timeout(120)
    c = pg.evaluate(STARE)["celule"]
    out.append({"id": "gest.ctrl_z", "ok": "D2" not in c and "D3" not in c, "simulator": sorted(c), "referinta": "fără D2, D3",
                "sursa": "scenarii_real/excel-ctrl-z-celula.json (celule după Ctrl+Z: %s)" % json.dumps(real("excel-ctrl-z-celula")["celule"])})
    # 4. clic dreapta pe o celulă: meniul din referință (uia_excel.json › meniu_contextual.celula)
    pg.locator('[data-lh-aplicatie="excel"] [data-lh-tinta="celula"][data-lh-id="B3"]').click(button="right")
    pg.wait_for_timeout(150)
    mn = pg.evaluate("""()=>{const m=document.querySelector('[data-lh-aplicatie="excel"] [data-lh-suprafata="meniu_contextual.celula"]');
      return m?[...m.querySelectorAll('[data-lh-tinta^="meniu:"]')].map(e=>e.getAttribute('data-lh-tinta').slice(6)).slice(0,4):null}""")
    UN = {"Button", "SplitButton", "MenuItem", "ListItem", "Edit", "ComboBox", "CheckBox"}
    prime = []

    def umbla(n):
        if n.get("tip") in UN and n.get("eticheta"):
            prime.append(n["eticheta"])
            return
        for x in n.get("copii") or []:
            umbla(x)
    umbla(REF["suprafete"]["meniu_contextual.celula"])
    out.append({"id": "gest.clic_dreapta", "ok": bool(mn) and mn[:3] == prime[:3], "simulator": mn, "referinta": prime[:3],
                "sursa": "uia_excel.json › meniu_contextual.celula"})
    pg.keyboard.press("Escape")
    # 5. File → Backstage (backstage.nav), Esc → înapoi
    clic(pg, '[data-lh-id-mso="FileTabButton"]')
    nav = pg.evaluate("""()=>{const n=document.querySelector('[data-lh-aplicatie="excel"] [data-lh-suprafata="backstage.nav"]');
      return n?[...n.querySelectorAll('[data-lh-tip="ListItem"]')].map(e=>e.getAttribute('data-lh-eticheta')).slice(0,4):null}""")
    pg.keyboard.press("Escape")
    pg.wait_for_timeout(120)
    inchis = pg.evaluate("()=>!document.querySelector('[data-lh-aplicatie=\"excel\"] [data-lh-suprafata=\"backstage.nav\"]')")
    out.append({"id": "gest.file_backstage", "ok": nav == ["Back", "Home", "New", "Open"] and inchis, "simulator": [nav, inchis],
                "referinta": ["Back", "Home", "New", "Open"], "sursa": "uia_excel.json › backstage.nav"})
    # 6. F12 → fereastra Save As; „Note” + Enter → nume_fisier = Note.xlsx (excel-salvare-ca)
    clic(pg, '[data-lh-tinta="celula"][data-lh-id="A6"]')
    pg.keyboard.press("F12")
    pg.wait_for_timeout(200)
    are = pg.evaluate("()=>!!document.querySelector('[data-lh-aplicatie=\"excel\"] [data-lh-suprafata=\"dialog.FileSaveAs\"] [data-lh-tinta=\"camp:nume_fisier\"]')")
    pg.keyboard.press("Control+a")
    pg.keyboard.type("Note", delay=10)
    pg.keyboard.press("Enter")
    pg.wait_for_timeout(150)
    s = pg.evaluate(STARE)
    out.append({"id": "gest.salvare_ca", "ok": are and s["nume_fisier"] == real("excel-salvare-ca")["nume_fisier"], "simulator": [are, s["nume_fisier"], s["titlu_fereastra"]],
                "referinta": real("excel-salvare-ca")["nume_fisier"], "sursa": "scenarii_real/excel-salvare-ca.json; uia_excel.json › dialog.FileSaveAs"})
    # 7. fiecare gest a emis evenimente standard (§4)
    ev = pg.evaluate("()=>(window.__lhAplicatieEv||[]).length") - ev0
    out.append({"id": "gest.evenimente", "ok": ev >= 20, "simulator": ev, "referinta": ">= 20 (un eveniment pe gest)", "sursa": "api_biblioteca.md §4"})
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--iesire")
    a = ap.parse_args()
    srv, baza = server()
    rez = []
    try:
        with sync_playwright() as p:
            try:
                br = p.chromium.launch(channel="chrome", headless=True)
            except Exception:
                br = p.chromium.launch(headless=True)
            ctx = br.new_context(viewport={"width": 1366, "height": 768})
            ctx.route("**/*", ruta)
            pg = ctx.new_page()
            erori = []
            pg.on("pageerror", lambda e: erori.append(str(e)))
            try:
                deschide(pg, baza)
                rez += caz_aspect(pg)
                rez += caz_gesturi(pg)
            except Exception as e:
                rez.append({"id": "deschidere", "ok": False, "simulator": str(e).splitlines()[0][:200], "referinta": "Excel pe poligon", "sursa": "api_biblioteca.md §1"})
            if erori:
                rez.append({"id": "erori_js", "ok": False, "simulator": erori[:3], "referinta": [], "sursa": "consola paginii"})
            br.close()
    finally:
        srv.shutdown()
    picate = [r for r in rez if not r["ok"]]
    for r in rez:
        print(("  ok   " if r["ok"] else "  PICAT ") + r["id"] + ("" if r["ok"] else "  — simulator %s / referință %s" % (json.dumps(r["simulator"], ensure_ascii=False)[:200], json.dumps(r["referinta"], ensure_ascii=False)[:120])))
    if a.iesire:
        Path(a.iesire).write_text(json.dumps({"servit": "LH_SERVIT" if os.environ.get("LH_SERVIT") else "worktree", "cazuri": rez,
                                              "picate": len(picate)}, ensure_ascii=False, indent=1), encoding="utf-8")
    print("cazuri: %d · picate: %d" % (len(rez), len(picate)))
    print(len(picate))
    return 0 if not picate else 1


if __name__ == "__main__":
    sys.exit(main())
