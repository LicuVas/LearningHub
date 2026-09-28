"""Proba „Enter după Tab” în foaia Excel simulată (tip-excel.js), 28.09.2026 — față de Excel-ul REAL.

Excel real (instanță nouă, desktop ascuns, taste reale; _campaign/revizuire_completa_2026_09/motor_lectie/
excel_real_tab_enter*.json): A5 ⇥ ⇥ ↵ -> A6 (și cu text scris); o săgeată rupe șirul; Home îl rupe; un clic pe altă
celulă îl rupe; Esc NU îl rupe. Aici, în simulator, cu tastele și clicurile adevărate ale browserului:
  S1  A5 ⇥ ⇥ ↵            -> A6        S2  A5 x ⇥ y ⇥ z ↵          -> A6 (în scriere)
  S3  A5 ⇥ ⇥ → ↵          -> D6        S4  A5 ⇥ ⇥ Esc ↵            -> A6
  S5  A5 ⇥ ⇥ clic B5 ↵    -> B6        S6  B5 ⇥ ⇥ Home ↵           -> A6
  S7  C5 ↵                -> C6 (fără șir, Enter coboară simplu)
(rândul 5 când foaia are cel puțin 6 rânduri; altfel rândul 1). Plus: textul lung din celule se taie fără „…”.
Paginile: excel-viii, excel-pas-cu-pas-viii, excel-antrenament-viii, lectii/viii/m1-l0*; 390 px cu atingere și 1280 px.
    python proba_tab_enter.py [--tip-excel <fișier>]   (--tip-excel = servește altă versiune, ex. cea dinainte)
Ultima linie = numărul de probleme."""
import argparse
import functools
import http.server
import sys
import threading
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass

SITE = Path(__file__).resolve().parents[2]
probleme = []
DISP = {"390-atingere": {"viewport": {"width": 390, "height": 844}, "has_touch": True, "is_mobile": True, "device_scale_factor": 2},
        "1280": {"viewport": {"width": 1280, "height": 900}}}


class Tacut(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass


# primul loc (exercițiu din pași / atelier) cu o foaie Excel adevărată (nu variante de răspuns)
LOCURI = """()=>{const C=JocMotor.test.config(),out=[];C.nivele.forEach((L,li)=>{if(!L.pasi)return;
  L.pasi.forEach((P,si)=>[P.incearca].concat(P.inca||[]).filter(Boolean).forEach((Q,k)=>{if(!Array.isArray(Q.o))out.push([li,'p'+si,k])}));
  if(L.atelier)[L.atelier].concat(L.atelier.inca||[]).forEach((Q,k)=>{if(!Array.isArray(Q.o))out.push([li,'atelier',k])})});return out}"""
ACTIVA = "(()=>{const t=document.querySelector('#body td.act[data-a]');return t?t.dataset.a:null})()"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tip-excel")
    a = ap.parse_args()
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8782), functools.partial(Tacut, directory=str(SITE)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    pagini = ["jocuri/excel-viii/index.html", "jocuri/excel-pas-cu-pas-viii/index.html", "jocuri/excel-antrenament-viii/index.html"]
    pagini += sorted(str(p.relative_to(SITE)).replace("\\", "/") for p in SITE.glob("lectii/viii/m1-l0*/index.html"))
    from playwright.sync_api import sync_playwright
    scenarii = 0
    with sync_playwright() as p:
        br = p.chromium.launch()
        for disp in DISP:
            for cale in pagini:
                tag = f"{cale.split('/')[1] if cale.startswith('jocuri') else '/'.join(cale.split('/')[1:3])}@{disp}"
                ctx = br.new_context(**DISP[disp])
                ctx.route("**/*", lambda r: r.continue_() if ("127.0.0.1" in r.request.url or "localhost" in r.request.url) else r.abort())   # REGULA 24: nicio cerere în afara serverului local (nici elevi falși în panoul profesorului)
                ctx.route("**/api/**", lambda r: r.fulfill(status=200, body='{"ok":true}', headers={"access-control-allow-origin": "*"}))
                if a.tip_excel:
                    ctx.route("**/_motor/tip-excel.js*", lambda r: r.fulfill(status=200, body=Path(a.tip_excel).read_text(encoding="utf-8"),
                                                                             headers={"content-type": "application/javascript; charset=utf-8"}))
                pg = ctx.new_page()
                pg.set_default_timeout(8000)
                erori = []
                pg.on("pageerror", lambda e: erori.append("pageerror: " + str(e)[:160]))
                pg.on("console", lambda m: erori.append("console: " + m.text[:160]) if m.type == "error" and "net::ERR_FAILED" not in m.text else None)
                pg.goto(f"http://127.0.0.1:8782/{cale}", wait_until="load")
                pg.evaluate("localStorage.clear();localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
                pg.reload(wait_until="load")
                pg.wait_for_timeout(400)
                pg.evaluate("JocMotor.test.deblocheaza();document.getElementById('go-home').click()")
                gasit = None
                for li, unde, k in pg.evaluate(LOCURI):
                    pg.evaluate("document.getElementById('go-home').click()")
                    pg.evaluate("l=>document.querySelector('.lvl[data-l=\"'+l+'\"]').click()", li)
                    if unde == "atelier":
                        pg.evaluate("JocMotor.test.atelier()")
                    else:
                        pg.evaluate("JocMotor.test.pas(%d)" % int(unde[1:])); pg.evaluate("JocMotor.test.exercitiu(%d)" % k)
                    pg.wait_for_timeout(250)
                    dim = pg.evaluate("(()=>{const t=[...document.querySelectorAll('#body .gw td[data-a]')].map(x=>x.dataset.a);if(!t.length)return null;"
                                      "const c=new Set(t.map(a=>a.match(/^[A-Z]+/)[0])),r=new Set(t.map(a=>+a.match(/\\d+$/)[0]));return [c.size,Math.max(...r)]})()")
                    if dim and dim[0] >= 4 and dim[1] >= 2:
                        gasit = (li, unde, k, dim)
                        break
                if not gasit:
                    are_foi = pg.evaluate("(()=>{const C=JocMotor.test.config();return C.nivele.some(L=>(L.pasi||[]).some(P=>[P.incearca].concat(P.inca||[]).some(Q=>Q&&/excel|foaie/.test(Q.t)))||(L.atelier&&/excel|foaie/.test(L.atelier.t)))})()")
                    if cale.startswith("jocuri/excel-antrenament") or not are_foi:
                        print(f"{tag}: fără foaie Excel în pași sau atelier — sărit")
                    else:
                        probleme.append(f"{tag}: nicio foaie Excel (≥ 4 coloane, ≥ 2 rânduri) găsită")
                    ctx.close()
                    continue
                r = 5 if gasit[3][1] >= 6 else 1
                cel = lambda ad: pg.locator(f"#body td[data-a='{ad}']")

                def porneste(ad):
                    pg.keyboard.press("Escape")
                    for _ in range(4):   # foaia se redesenează după fiecare gest: celula se caută din nou până stă pe loc
                        try:
                            cel(ad).scroll_into_view_if_needed(timeout=3000); pg.wait_for_timeout(300)
                            if disp == "390-atingere":
                                bb = cel(ad).bounding_box(); pg.touchscreen.tap(bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2)
                                pg.evaluate("document.querySelector('#body .gw')&&document.querySelector('#body .gw').focus({preventScroll:true})")
                            else:
                                cel(ad).click(timeout=3000)
                            break
                        except Exception:
                            pg.wait_for_timeout(300)
                    pg.wait_for_timeout(150)
                    return pg.evaluate(ACTIVA)

                def taste(*t):
                    for x in t:
                        pg.keyboard.press(x) if len(x) > 1 else pg.keyboard.type(x)
                        pg.wait_for_timeout(60)
                    pg.wait_for_timeout(120)
                    return pg.evaluate(ACTIVA)
                A, B, C, D = (f"{c}{r}" for c in "ABCD")
                jos = lambda c: f"{c}{r + 1}"
                cazuri = [
                    ("S1 A ⇥ ⇥ ↵", A, lambda: taste("Tab", "Tab", "Enter"), jos("A")),
                    ("S2 A x ⇥ y ⇥ z ↵", A, lambda: taste("x", "Tab", "y", "Tab", "z", "Enter"), jos("A")),
                    ("S3 A ⇥ ⇥ → ↵", A, lambda: taste("Tab", "Tab", "ArrowRight", "Enter"), jos("D")),
                    ("S4 A ⇥ ⇥ Esc ↵", A, lambda: taste("Tab", "Tab", "Escape", "Enter"), jos("A")),
                    ("S5 A ⇥ ⇥ clic B ↵", A, lambda: (taste("Tab", "Tab"), porneste(B), taste("Enter"))[-1], jos("B")),
                    ("S6 B ⇥ ⇥ Home ↵", B, lambda: taste("Tab", "Tab", "Home", "Enter"), jos("A")),
                    ("S7 C ↵", C, lambda: taste("Enter"), jos("C")),
                ]
                rez = []
                for nume, start, fa, asteptat in cazuri:
                    a0 = porneste(start)
                    if a0 != start:
                        probleme.append(f"{tag} {nume}: nu pot porni din {start} (activa={a0})"); continue
                    try:
                        got = fa()
                    except Exception as e:
                        probleme.append(f"{tag} {nume}: {str(e).splitlines()[0][:120]}"); continue
                    scenarii += 1
                    rez.append(f"{nume.split()[0]}={got}")
                    if got != asteptat:
                        probleme.append(f"{tag} {nume.replace('A', start[0], 1) if False else nume} (rândul {r}): celula activă {got}, trebuia {asteptat}")
                        print("  RĂU  " + probleme[-1])
                to = pg.evaluate("getComputedStyle(document.querySelector('#body .xl td')).textOverflow")
                if to != "clip":
                    probleme.append(f"{tag}: celulele au text-overflow={to!r} (Excel taie fără „…”)")
                if erori:
                    probleme.append(f"{tag}: {len(erori)} erori în consolă: {erori[:2]}")
                print(f"{tag}: foaia din nivelul {gasit[0]+1} {gasit[1]} ex.{gasit[2]+1} ({gasit[3][0]}x{gasit[3][1]}), rândul {r}: {' '.join(rez)} · text-overflow={to} · erori={len(erori)}")
                ctx.close()
        br.close()
    srv.shutdown()
    for x in probleme:
        if not x.startswith("  "):
            print("PROBLEMĂ", x)
    print(f"Scenarii jucate: {scenarii}")
    print("Rezultat: " + ("TOATE OK" if not probleme else f"{len(probleme)} probleme"))
    print(len(probleme))
    return 1 if probleme else 0


if __name__ == "__main__":
    sys.exit(main())
