# -*- coding: utf-8 -*-
"""Critic r9 p8: regresul X8 pe vechi (30dbbe30, git archive in %TEMP%) fata de nou: Ctrl+W pe registrul de pornire (cu si fara continut), apoi Ctrl+N."""
import io, json, os, shutil, subprocess, sys, tarfile, functools, http.server, threading
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/9/critic_probe")
import h
from playwright.sync_api import sync_playwright
VECHI = os.path.join(os.environ["TEMP"], "lh_critic_r9_x8")
shutil.rmtree(VECHI, ignore_errors=True); os.makedirs(VECHI)
tar = subprocess.run(["git", "-C", h.WT, "archive", "30dbbe30", "aplicatii"], capture_output=True, check=True).stdout
tarfile.open(fileobj=io.BytesIO(tar)).extractall(VECHI)
def srv(d):
    class Tc(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k): pass
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tc, directory=d)); threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, "http://127.0.0.1:%d" % s.server_address[1]
pw = sync_playwright().start(); br = pw.chromium.launch(headless=True); out = {}
ST = "()=>{const x=LH.aplicatii.stare('excel');return [x.registru_activ,x.dialog?x.dialog.intrebare:null,x.titlu_fereastra]}"
try:
    for et, d in [("vechi", VECHI), ("nou", h.WT)]:
        s, base = srv(d); ctx = br.new_context(viewport={"width": 1366, "height": 768}); ctx.route("**/*", h.ruta); pg = ctx.new_page(); K = pg.keyboard
        r = {}
        pg.goto(base + "/aplicatii/poligon.html?aplicatie=excel"); pg.wait_for_selector('[data-lh-aplicatie="excel"]'); pg.wait_for_timeout(800)
        pg.mouse.click(400, 400); pg.wait_for_timeout(650); K.press("Control+w"); pg.wait_for_timeout(300); r["implicit_ctrl_w"] = pg.evaluate(ST)
        K.press("Escape"); pg.wait_for_timeout(200)
        pg.goto(base + "/aplicatii/poligon.html"); pg.wait_for_function("()=>window.LH&&LH.aplicatii&&LH.aplicatii.deschide")
        pg.evaluate("()=>LH.aplicatii.deschide('excel',{loc:document.querySelector('[data-lh-aplicatie-loc]'),continut:{celule:{A1:1},selectie:'B2'},focus:true})"); pg.wait_for_timeout(800)
        pg.mouse.click(400, 400); pg.wait_for_timeout(650); K.press("Control+w"); pg.wait_for_timeout(300); r["continut_ctrl_w"] = pg.evaluate(ST)
        out[et] = r; ctx.close(); s.shutdown()
finally:
    br.close(); pw.stop(); shutil.rmtree(VECHI, ignore_errors=True)
json.dump(out, open(h.P + "p8.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1); print(json.dumps(out, ensure_ascii=False))
