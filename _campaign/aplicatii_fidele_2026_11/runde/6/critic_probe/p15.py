# Regresul Word: aceleasi gesturi pe aplicatii/ din HEAD (bc56ca36, copie in %TEMP%) si pe worktree-ul de acum; capturi + dreptunghiuri.
import sys, os, json, functools, http.server, threading
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/6/critic_probe")
import h
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
VECHI = os.path.join(os.environ["TEMP"], "lh_critic_r6_vechi")
def srv(d):
    class Tc(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k): pass
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tc, directory=d)); threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, "http://127.0.0.1:%d" % s.server_address[1]
pw = sync_playwright().start(); br = pw.chromium.launch(headless=True)
rez = {}
for eticheta, d, w, hh, mob in [("vechi", VECHI, 1366, 768, False), ("nou", h.WT, 1366, 768, False), ("vechi_tel", VECHI, 375, 667, True), ("nou_tel", h.WT, 375, 667, True)]:
    s, base = srv(d)
    kw = dict(viewport={"width": w, "height": hh}); 
    if mob: kw.update(is_mobile=True, has_touch=True, device_scale_factor=2)
    ctx = br.new_context(**kw); ctx.route("**/*", h.ruta); pg = ctx.new_page(); err = []; pg.on("pageerror", lambda e: err.append(str(e)))
    pg.goto(base + "/aplicatii/poligon.html?aplicatie=word"); pg.wait_for_selector('[data-lh-aplicatie="word"]'); pg.wait_for_timeout(900)
    R = {}
    def cap(n):
        pg.screenshot(path=h.P + "w_%s_%s.png" % (eticheta, n))
        R[n] = pg.evaluate(h.RECT, '[data-lh-tip]')
    cap("0_deschis")
    if not mob:
        pg.keyboard.press("F12"); pg.wait_for_timeout(500); cap("1_saveas"); pg.keyboard.press("Escape"); pg.wait_for_timeout(300)
        pg.keyboard.type("abc"); pg.keyboard.press("Control+w"); pg.wait_for_timeout(500); cap("2_ctrlw"); pg.keyboard.press("Escape"); pg.wait_for_timeout(300)
        b = pg.evaluate("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-id-mso=\"FontSize\"] [data-lh-eticheta=\"Open\"], [data-lh-aplicatie] [data-lh-id-mso=\"FontSize\"] .lh-ap-sag');const r=(e||document.querySelector('[data-lh-id-mso=\"FontSize\"]')).getBoundingClientRect();return [r.right-6,r.y+r.height/2]}")
        pg.mouse.click(*b); pg.wait_for_timeout(400); cap("3_fontsize"); pg.keyboard.press("Escape"); pg.wait_for_timeout(300)
        pg.keyboard.press("Control+F12"); pg.wait_for_timeout(500); cap("4_open"); pg.keyboard.press("Escape"); pg.wait_for_timeout(300)
        R["stare"] = pg.evaluate("()=>{const x=LH.aplicatii.stare('word');return {text:x.text,dialog:x.dialog,titlu:x.titlu_fereastra}}")
    R["erori"] = err
    rez[eticheta] = R; ctx.close(); s.shutdown()
br.close(); pw.stop()
for a, b in [("vechi", "nou"), ("vechi_tel", "nou_tel")]:
    for n in [k for k in rez[a] if k[0].isdigit()]:
        A = Image.open(h.P + "w_%s_%s.png" % (a, n)).convert("RGB"); B = Image.open(h.P + "w_%s_%s.png" % (b, n)).convert("RGB")
        bb = ImageChops.difference(A, B).getbbox()
        ra, rb = rez[a][n], rez[b][n]
        print(b, n, "pixeli diferiti in:", bb, "| noduri", len(ra), len(rb), "| dreptunghiuri diferite:", sum(1 for x, y in zip(ra, rb) if x != y))
print("stare", json.dumps(rez["vechi"].get("stare"), ensure_ascii=False)[:200]); print("stare", json.dumps(rez["nou"].get("stare"), ensure_ascii=False)[:200])
print("erori", {k: v["erori"] for k, v in rez.items()})
