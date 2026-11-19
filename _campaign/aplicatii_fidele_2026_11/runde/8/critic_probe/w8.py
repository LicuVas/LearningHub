# -*- coding: utf-8 -*-
"""Regresul Word (critic r8): aceleasi gesturi pe aplicatii/ din 4b53a65a (inceputul rundei 8) (copie git archive in %TEMP%) si pe worktree; capturi + dreptunghiuri + stare + evenimente."""
import sys, os, json, functools, http.server, threading, subprocess, shutil, tarfile, io
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
import h
from playwright.sync_api import sync_playwright
from PIL import Image, ImageChops
VECHI = os.path.join(os.environ["TEMP"], "lh_critic_r8_vechi")
shutil.rmtree(VECHI, ignore_errors=True); os.makedirs(VECHI)
tar = subprocess.run(["git", "-C", h.WT, "archive", "4b53a65a", "aplicatii"], capture_output=True, check=True).stdout
tarfile.open(fileobj=io.BytesIO(tar)).extractall(VECHI)
def srv(d):
    class Tc(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a, **k): pass
    s = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Tc, directory=d)); threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, "http://127.0.0.1:%d" % s.server_address[1]
pw = sync_playwright().start(); br = pw.chromium.launch(headless=True)
rez = {}
EV = "()=>(window.__lhAplicatieEv||[]).map(e=>[e.gest,e.actiune,e.tinta,e.activat||null])"
try:
    for eticheta, d, w, hh, mob in [("vechi", VECHI, 1366, 768, False), ("nou", h.WT, 1366, 768, False), ("vechi_tel", VECHI, 375, 667, True), ("nou_tel", h.WT, 375, 667, True)]:
        s, base = srv(d)
        kw = dict(viewport={"width": w, "height": hh})
        if mob: kw.update(is_mobile=True, has_touch=True, device_scale_factor=2)
        ctx = br.new_context(**kw); ctx.route("**/*", h.ruta); pg = ctx.new_page(); err = []; pg.on("pageerror", lambda e: err.append(str(e)))
        pg.goto(base + "/aplicatii/poligon.html?aplicatie=word"); pg.wait_for_selector('[data-lh-aplicatie="word"]'); pg.wait_for_timeout(900)
        R = {}
        def cap(n):
            pg.screenshot(path=h.P + "w8_%s_%s.png" % (eticheta, n))
            R[n] = pg.evaluate(h.RECT, '[data-lh-tip]')
        cap("0_deschis")
        K = pg.keyboard
        if not mob:
            K.type("Mădălina are 5 mere"); K.press("Enter"); pg.wait_for_timeout(200); cap("1_tastare")
            K.press("Alt"); pg.wait_for_timeout(300); cap("2_keytips"); K.press("h"); K.press("1"); pg.wait_for_timeout(300); cap("3_alt_h_1"); K.press("Escape"); K.press("Escape")
            K.press("F12"); pg.wait_for_timeout(500); cap("4_saveas"); K.press("Control+a"); K.type("Tema_mea"); K.press("Enter"); pg.wait_for_timeout(400); cap("5_salvat")
            K.type("x"); K.press("Control+w"); pg.wait_for_timeout(500); cap("6_ctrlw"); K.press("Escape"); pg.wait_for_timeout(300)
            b = pg.evaluate("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-id-mso=\"FontSize\"]');const r=e.getBoundingClientRect();return [r.right-6,r.y+r.height/2]}")
            pg.mouse.click(*b); pg.wait_for_timeout(400); cap("7_fontsize"); K.press("Escape"); pg.wait_for_timeout(300)
            K.press("Control+F12"); pg.wait_for_timeout(500); cap("8_open"); K.press("Escape"); pg.wait_for_timeout(300); K.press("Control+z"); pg.wait_for_timeout(300); cap("9_ctrl_z"); K.press("Control+z"); pg.wait_for_timeout(300); cap("10_ctrl_z2")
            R["stare"] = pg.evaluate("()=>{const x=LH.aplicatii.stare('word');return {text:x.text,dialog:x.dialog,titlu:x.titlu_fereastra,nume:x.nume_fisier,fmt:x.formatare_pe_caractere}}")
        else:
            b = pg.evaluate("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-zona]');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+60]}")
            pg.touchscreen.tap(*b); pg.wait_for_timeout(300)
            cdp = ctx.new_cdp_session(pg); cdp.send("Input.imeSetComposition", {"text": "Ană", "selectionStart": 3, "selectionEnd": 3}); cdp.send("Input.insertText", {"text": "Ană"}); pg.wait_for_timeout(300)
            cap("1_tel_tastare")
            R["stare"] = pg.evaluate("()=>{const x=LH.aplicatii.stare('word');return {text:x.text}}")
        R["ev"] = pg.evaluate(EV)
        R["erori"] = err
        rez[eticheta] = R; ctx.close(); s.shutdown()
finally:
    br.close(); pw.stop()
out = {}
for a, b in [("vechi", "nou"), ("vechi_tel", "nou_tel")]:
    for n in [k for k in rez[a] if k[0].isdigit()]:
        A = Image.open(h.P + "w8_%s_%s.png" % (a, n)).convert("RGB"); B = Image.open(h.P + "w8_%s_%s.png" % (b, n)).convert("RGB")
        bb = ImageChops.difference(A, B).getbbox()
        ra, rb = rez[a][n], rez[b][n]
        out[b + "/" + n] = {"pixeli_diferiti": bb, "noduri": [len(ra), len(rb)], "dreptunghiuri_diferite": sum(1 for x, y in zip(ra, rb) if x != y)}
out["stare_egala"] = rez["vechi"]["stare"] == rez["nou"]["stare"]; out["stare_tel_egala"] = rez["vechi_tel"]["stare"] == rez["nou_tel"]["stare"]
out["ev_egale"] = rez["vechi"]["ev"] == rez["nou"]["ev"]; out["ev_tel_egale"] = rez["vechi_tel"]["ev"] == rez["nou_tel"]["ev"]
out["stare_nou"] = rez["nou"]["stare"]; out["ev_nou_ultimele"] = rez["nou"]["ev"][-12:]; out["stare_tel_nou"] = rez["nou_tel"]["stare"]
out["erori"] = {k: v["erori"] for k, v in rez.items()}
json.dump(out, open(h.P + "w8.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(json.dumps(out, ensure_ascii=False, indent=1)[:5000])
shutil.rmtree(VECHI, ignore_errors=True)
