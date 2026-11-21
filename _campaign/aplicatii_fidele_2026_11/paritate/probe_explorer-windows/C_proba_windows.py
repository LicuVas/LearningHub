# Proba partii C (inventarul de paritate explorer-windows): gesturi reale pe L/windows.js, headless, server local.
# Rulare: python C_proba_windows.py <port>
import json, subprocess, sys, time, os
from playwright.sync_api import sync_playwright

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 9341
ROOT = r"C:/00/Projects/LearningHub_fidel"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "C_proba_windows.json")

srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", ROOT],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
rez = {}
import atexit
atexit.register(lambda: json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1))
try:
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        ctx = b.new_context(viewport={"width": 1366, "height": 768})
        ctx.route("**/*", lambda r: r.continue_() if ("127.0.0.1" in r.request.url or "localhost" in r.request.url) else r.abort())
        pg = ctx.new_page()
        pg.goto(f"http://127.0.0.1:{PORT}/aplicatii/poligon.html?aplicatie=nimic")
        pg.wait_for_function("window.LH && LH.aplicatii")

        def deschide(cont):
            pg.evaluate("""async (c) => {
              try { LH.aplicatii.inchide('windows'); } catch(e) {}
              try { LH.aplicatii.inchide('explorer'); } catch(e) {}
              let d = document.getElementById('gazda'); if (d) d.remove();
              d = document.createElement('div'); d.id = 'gazda'; d.style.cssText = 'width:1366px;height:740px;position:relative';
              document.body.prepend(d);
              window.__ev = [];
              if (!window.__asc) window.__asc = LH.aplicatii.asculta(e => window.__ev.push({g: e.gest, a: e.actiune, t: e.tinta}));
              window.__api = await LH.aplicatii.deschide('windows', {loc: d, continut: c});
            }""", cont)
            pg.wait_for_timeout(400)

        st = lambda: pg.evaluate("LH.aplicatii.stare('windows')")
        ev = lambda: pg.evaluate("window.__ev.slice()")
        msg = lambda: pg.evaluate("[...document.querySelectorAll('.lh-ap-mesaj')].map(x=>x.textContent).join(' | ')")
        def box(sel):
            return pg.locator(sel).first.bounding_box()
        def clic(sel, n=1):
            bb = box(sel); x, y = bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2
            pg.mouse.click(x, y, click_count=1)
            if n == 2:
                pg.mouse.click(x, y, click_count=2)
            pg.wait_for_timeout(250)
        def startDeschis():
            if not st()["meniu_start_deschis"]:
                clic('.lh-w-b[data-lh-id="Start"]')
        def fer(app):
            return [f for f in st()["ferestre"] if f["aplicatie"] == app]

        PAINT = {"aplicatie": "paint", "titlu": "Fără titlu - Paint", "x": 200, "y": 60, "w": 600, "h": 400}
        CALC = {"aplicatie": "calculator", "titlu": "Calculator", "x": 120, "y": 40, "w": 360, "h": 420}

        # 1. Start + cautare + Enter
        deschide({"pictograme": [{"nume": "Calculator", "fel": "fisier"}]})
        clic('.lh-w-b[data-lh-id="Start"]')
        rez["start_deschis"] = st()["meniu_start_deschis"]
        pg.keyboard.type("pai"); pg.wait_for_timeout(200)
        rez["cautare_rezultate"] = pg.evaluate("[...document.querySelectorAll('[data-lh-rezultat]')].map(x=>x.getAttribute('data-lh-id'))")
        pg.keyboard.press("Enter"); pg.wait_for_timeout(300)
        rez["dupa_enter_paint"] = fer("paint"); rez["ev_enter"] = ev()[-1:]; rez["msg_enter"] = msg()
        # 2. dala Setari din Start
        startDeschis()
        clic('.lh-w-p[data-lh-id="Setări"]')
        rez["dala_setari"] = {"ev": ev()[-1:], "ferestre": [f["aplicatie"] for f in st()["ferestre"]], "msg": msg()}
        # 3. Alimentare
        startDeschis()
        rez["start_dupa_setari"] = st()["meniu_start_deschis"]
        clic('.lh-w-start [data-lh-id="Alimentare"]')
        rez["alimentare"] = {"ev": ev()[-1:], "msg": msg()}
        if st()["meniu_start_deschis"]:
            pg.keyboard.press("Escape")
        # 4. ceasul
        clic('.lh-w-b[data-lh-id^="Ceas"]')
        rez["ceas_clic"] = {"ev": ev()[-1:], "msg": msg(), "text": pg.locator('.lh-w-ceas').first.inner_text()}
        # 5. dublu-clic pe pictograma desktopului
        clic('.lh-w-ico[data-lh-id="Calculator"]', 2)
        rez["dublu_pictograma"] = {"ev": ev()[-3:], "msg": msg(), "ferestre": [f["aplicatie"] for f in st()["ferestre"]]}
        # 6. fereastra: maximizare / restabilire
        deschide({"ferestre": [CALC, PAINT]})
        f0 = fer("paint")[0]
        clic('.lh-w-fer[data-lh-id="paint"] .lh-w-tb[data-lh-id="Maximizare"]')
        f1 = fer("paint")[0]
        lab = pg.evaluate("[...document.querySelectorAll('.lh-w-fer[data-lh-id=\"paint\"] .lh-w-tb')].map(x=>x.getAttribute('data-lh-eticheta'))")
        clic('.lh-w-fer[data-lh-id="paint"] .lh-w-tb[data-lh-id="Maximizare"]')
        f2 = fer("paint")[0]
        rez["max_restabilire"] = {"inainte": f0, "max": f1, "butoane_cand_max": lab, "dupa": f2, "ev": ev()[-2:]}
        # 7. dublu-clic pe bara de titlu
        bb = box('.lh-w-fer[data-lh-id="paint"] .lh-w-tt')
        pg.mouse.dblclick(bb["x"] + 20, bb["y"] + bb["height"] / 2); pg.wait_for_timeout(300)
        rez["dublu_titlu"] = {"stare": fer("paint")[0]["stare"], "ev": ev()[-3:]}
        # 8. tragere bara de titlu (normal)
        a = fer("paint")[0]
        bb = box('.lh-w-fer[data-lh-id="paint"] .lh-w-tt')
        x0, y0 = bb["x"] + 30, bb["y"] + bb["height"] / 2
        pg.mouse.move(x0, y0); pg.mouse.down(); pg.mouse.move(x0 + 150, y0 + 40, steps=8); pg.mouse.up(); pg.wait_for_timeout(300)
        b2 = fer("paint")[0]
        rez["tragere_titlu"] = {"x_inainte": a["x"], "x_dupa": b2["x"], "y_dupa": b2["y"], "ev": ev()[-1:]}
        # 9. tragere spre marginea din stanga (lipire) si spre sus (maximizare)
        bb = box('.lh-w-fer[data-lh-id="paint"] .lh-w-tt')
        x0, y0 = bb["x"] + 30, bb["y"] + bb["height"] / 2
        pg.mouse.move(x0, y0); pg.mouse.down(); pg.mouse.move(1, y0, steps=10); pg.mouse.up(); pg.wait_for_timeout(300)
        rez["tragere_margine_stanga"] = fer("paint")[0]
        bb = box('.lh-w-fer[data-lh-id="paint"] .lh-w-tt')
        x0, y0 = bb["x"] + 30, bb["y"] + bb["height"] / 2
        pg.mouse.move(x0, y0); pg.mouse.down(); pg.mouse.move(x0, 1, steps=10); pg.mouse.up(); pg.wait_for_timeout(300)
        rez["tragere_sus"] = fer("paint")[0]
        # 10. redimensionare: tragere de marginea dreapta si de coltul dreapta-jos
        a = fer("paint")[0]
        bb = box('.lh-w-fer[data-lh-id="paint"]')
        xe, ye = bb["x"] + bb["width"] - 2, bb["y"] + bb["height"] / 2
        pg.mouse.move(xe, ye); pg.mouse.down(); pg.mouse.move(xe + 120, ye, steps=8); pg.mouse.up(); pg.wait_for_timeout(300)
        xc, yc = bb["x"] + bb["width"] - 2, bb["y"] + bb["height"] - 2
        pg.mouse.move(xc, yc); pg.mouse.down(); pg.mouse.move(xc - 120, yc - 80, steps=8); pg.mouse.up(); pg.wait_for_timeout(300)
        b2 = fer("paint")[0]
        rez["redimensionare"] = {"w_inainte": a["w"], "h_inainte": a["h"], "w_dupa": b2["w"], "h_dupa": b2["h"]}
        # 11. tragere fereastra maximizata
        clic('.lh-w-fer[data-lh-id="paint"] .lh-w-tb[data-lh-id="Maximizare"]')
        bb = box('.lh-w-fer[data-lh-id="paint"] .lh-w-tt')
        x0, y0 = bb["x"] + 200, bb["y"] + bb["height"] / 2
        pg.mouse.move(x0, y0); pg.mouse.down(); pg.mouse.move(x0 + 100, y0 + 150, steps=10); pg.mouse.up(); pg.wait_for_timeout(300)
        rez["tragere_maximizata"] = fer("paint")[0]
        clic('.lh-w-fer[data-lh-id="paint"] .lh-w-tb[data-lh-id="Maximizare"]')
        # 12. bara de activitati: activ -> min -> readus; activare prin clic pe fereastra
        clic('.lh-w-b[data-lh-app="paint"]')
        s1 = fer("paint")[0]["stare"]
        clic('.lh-w-b[data-lh-app="paint"]')
        s2 = fer("paint")[0]
        clic('.lh-w-b[data-lh-app="calculator"]')
        s3 = [(f["aplicatie"], f["activa"]) for f in st()["ferestre"]]
        rez["bara"] = {"dupa_clic_activ": s1, "dupa_al_doilea": s2, "dupa_clic_calc": s3, "ev": ev()[-3:]}
        clic('.lh-w-fer[data-lh-id="paint"] .lh-w-tt')
        rez["clic_pe_fereastra"] = [(f["aplicatie"], f["activa"]) for f in st()["ferestre"]]
        # 13. clic pe desktopul gol: mai e vreo fereastra activa?
        pg.mouse.click(1300, 650); pg.wait_for_timeout(250)
        rez["clic_desktop_gol"] = [(f["aplicatie"], f["activa"]) for f in st()["ferestre"]]
        # 14. inchidere
        clic('.lh-w-fer[data-lh-id="paint"] .lh-w-tb[data-lh-id="Închidere"]')
        rez["inchidere"] = {"ferestre": [f["aplicatie"] for f in st()["ferestre"]], "ev": ev()[-1:]}
        # 15. doua ferestre ale aceleiasi aplicatii (grupul din bara)
        deschide({"ferestre": [PAINT, dict(PAINT, x=300, y=120)]})
        clic('.lh-w-b[data-lh-app="paint"]')
        rez["grup_bara"] = {"butoane_paint": pg.locator('.lh-w-b[data-lh-app="paint"]').count(), "ev": ev()[-1:],
                            "lista": pg.evaluate("document.querySelectorAll('[role=menu],[role=listbox]').length"),
                            "ferestre": [(f["stare"], f["activa"]) for f in st()["ferestre"]]}
        # 16. Calculator: tastele lui
        deschide({"ferestre": [CALC]})
        rez["calc_continut"] = pg.evaluate("document.querySelector('.lh-w-fer[data-lh-id=\"calculator\"] .lh-w-corp').innerHTML.slice(0,200)")
        b.close()
finally:
    srv.terminate()
json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("scris", OUT)
