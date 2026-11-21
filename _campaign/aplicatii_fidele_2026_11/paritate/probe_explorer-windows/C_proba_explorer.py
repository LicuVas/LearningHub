# Proba partii C: drumul scanarii din siguranta-pc.js jucat pe L/explorer.js (si Explorer-ul montat in windows.js). Headless.
# Rulare: python C_proba_explorer.py <port>
import json, subprocess, sys, time, os, atexit
from playwright.sync_api import sync_playwright

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 9342
ROOT = r"C:/00/Projects/LearningHub_fidel"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "C_proba_explorer.json")
rez = {}
atexit.register(lambda: json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1))
srv = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1", "--directory", ROOT],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(1.5)
try:
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        ctx = b.new_context(viewport={"width": 1366, "height": 768})
        ctx.route("**/*", lambda r: r.continue_() if ("127.0.0.1" in r.request.url or "localhost" in r.request.url) else r.abort())
        pg = ctx.new_page()
        pg.goto(f"http://127.0.0.1:{PORT}/aplicatii/poligon.html?aplicatie=nimic")
        pg.wait_for_function("window.LH && LH.aplicatii")
        pg.evaluate("""async () => {
          const d = document.createElement('div'); d.id = 'gazda'; d.style.cssText = 'width:1366px;height:740px;position:relative';
          document.body.prepend(d);
          window.__ev = [];
          LH.aplicatii.asculta(e => window.__ev.push({g: e.gest, a: e.actiune, t: e.tinta}));
          window.__api = await LH.aplicatii.deschide('explorer', {loc: d, continut: {parinte: 'Descărcări', folder: 'STICK (E:)',
             arbore: ['Tema_6A_Pop.pptx', 'joc_gratis.exe', 'Fisa_TIC.docx']}});
        }""")
        pg.wait_for_timeout(500)
        st = lambda: pg.evaluate("LH.aplicatii.stare('explorer')")
        ev = lambda: pg.evaluate("window.__ev.slice()")
        msg = lambda: pg.evaluate("[...document.querySelectorAll('.lh-ap-mesaj')].map(x=>x.textContent).join(' | ')")
        rez["cale_curenta"] = st().get("cale_curenta")
        rez["randuri_tip"] = pg.evaluate("[...document.querySelectorAll('[data-lh-tinta=\"lista\"]')].map(x=>x.innerText.replace(/\\n/g,' / ')).slice(0,6)")
        rez["arbore_noduri"] = pg.evaluate("[...document.querySelectorAll('[data-lh-tinta=\"arbore\"]')].map(x=>x.getAttribute('data-lh-id')+(x.getAttribute('data-e-cale')?' ->'+x.getAttribute('data-e-cale'):' (fara cale)'))")
        # clic pe "Acest PC" in panoul de navigare
        loc = pg.locator('[data-lh-tinta="arbore"][data-lh-id="Acest PC"]')
        if loc.count():
            loc.first.click(); pg.wait_for_timeout(250)
            rez["clic_acest_pc"] = {"ev": ev()[-1:], "msg": msg()}
        # clic dreapta pe fisier -> meniul Windows 11
        it = pg.locator('[data-lh-tinta="lista"][data-lh-id="Fisa_TIC.docx"], [data-lh-tinta="lista"][data-lh-id="Fisa_TIC"]').first
        it.click(button="right"); pg.wait_for_timeout(300)
        rez["meniu_fisier"] = {"ev": ev()[-1:], "randuri": pg.evaluate("[...document.querySelectorAll('[data-lh-tinta=\"meniu\"]')].map(x=>x.getAttribute('data-lh-id'))")[:20]}
        pg.locator('[data-lh-tinta="meniu"][data-lh-id="Afișați mai multe opțiuni"]').first.click(); pg.wait_for_timeout(300)
        rez["meniu_clasic"] = {"ev": ev()[-1:], "are_scanare": pg.locator('[data-lh-tinta="meniu"][data-lh-id="Scanați cu Microsoft Defender..."]').count()}
        pg.locator('[data-lh-tinta="meniu"][data-lh-id="Scanați cu Microsoft Defender..."]').first.click(); pg.wait_for_timeout(300)
        rez["scanare"] = {"ev": ev()[-1:], "msg": msg(), "stare_dialog": st().get("dialog")}
        # deschidere: dublu-clic pe .docx si pe .exe
        it.dblclick(); pg.wait_for_timeout(300)
        rez["dublu_docx"] = {"ev": ev()[-1:], "msg": msg()}
        pg.locator('[data-lh-tinta="lista"][data-lh-id^="joc_gratis"]').first.dblclick(); pg.wait_for_timeout(300)
        rez["dublu_exe"] = {"ev": ev()[-1:], "msg": msg()}
        rez["stare_finala_chei"] = sorted(st().keys())
        # Explorer montat in Windows: butonul dosarului galben din bara
        pg.evaluate("""async () => { LH.aplicatii.inchide('explorer'); const d = document.getElementById('gazda'); d.innerHTML='';
          window.__api = await LH.aplicatii.deschide('windows', {loc: d, continut: {explorer: {arbore: ['tema.docx']}}}); }""")
        pg.wait_for_timeout(400)
        pg.locator('.lh-w-b[data-lh-id-mso="Appid: Microsoft.Windows.Explorer"]').first.click(); pg.wait_for_timeout(1200)
        rez["explorer_montat"] = {"ferestre": pg.evaluate("LH.aplicatii.stare('windows').ferestre.map(f=>[f.aplicatie,f.titlu,f.stare])"), "ev": ev()[-1:]}
        pg.locator('.lh-w-b[data-lh-id-mso="Appid: Chrome"]').first.click(); pg.wait_for_timeout(300)
        rez["chrome_din_bara"] = {"ev": ev()[-1:], "msg": msg()}
        b.close()
finally:
    srv.terminate()
print("scris", OUT)
