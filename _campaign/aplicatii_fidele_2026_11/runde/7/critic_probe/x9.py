# -*- coding: utf-8 -*-
"""Critic r7: X9 telefonul (375x667, atingere, tastatura care compune) + X4 banda de jos cu barele lui Chrome vizibile."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe")
from h import *
from playwright.sync_api import sync_playwright
out = {}
def rec(k, **v): out[k] = v; print(k, json.dumps(v, ensure_ascii=False)[:1200])
try:
    s = Sesiune(375, 667, mobil=True)
    s.deschide()
    cdp = s.ctx.new_cdp_session(s.page)
    def atinge(a):
        x, y = s.ev(CEL, a); s.page.touchscreen.tap(x, y); s.page.wait_for_timeout(300)
    def foc(): return s.ev("()=>{const a=document.activeElement;return a?(a.tagName+'.'+(a.className||'')).slice(0,60):null}")
    def cel(a): return s.ev("a=>LH.aplicatii.stare('excel').celule[a]||null", a)
    dim = s.ev("""()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="D3"]');const b=e.getBoundingClientRect();return [Math.round(b.width),Math.round(b.height)]}""")
    atinge("D3"); f = foc()
    cdp.send("Input.insertText", {"text": "7,5"}); s.page.wait_for_timeout(150)
    v1 = cel("D3")
    # Enter de pe tastatura telefonului (Gboard trimite keydown Enter, keyCode 13)
    s.page.keyboard.press("Enter"); s.page.wait_for_timeout(150)
    rec("X9_insertText", celula_px=dim, foc_dupa_atingere=f, D3_inainte_enter=v1, D3=cel("D3"), sel=s.stare()["selectie"], ev=ultimele_ev(s, 3))
    atinge("A6"); s.page.wait_for_timeout(700)
    for t in ["A", "An", "Ana"]:
        cdp.send("Input.imeSetComposition", {"text": t, "selectionStart": len(t), "selectionEnd": len(t)}); s.page.wait_for_timeout(60)
    cdp.send("Input.insertText", {"text": "Ana"}); s.page.wait_for_timeout(150)
    atinge("B6"); s.page.wait_for_timeout(150)
    rec("X9_compunere", A6=cel("A6"), sel=s.stare()["selectie"], ev=ultimele_ev(s, 3))
    # diacritice pe telefon: compunere „Mădălina” intr-o celula noua
    s.page.wait_for_timeout(700); atinge("A7"); s.page.wait_for_timeout(700)
    cdp.send("Input.imeSetComposition", {"text": "Mădălina", "selectionStart": 8, "selectionEnd": 8}); cdp.send("Input.insertText", {"text": "Mădălina"})
    s.page.keyboard.press("Enter"); s.page.wait_for_timeout(150)
    rec("X9_diacritice", A7=cel("A7"), ev=ultimele_ev(s, 2))
    # stergerea de pe telefon (Backspace al tastaturii = beforeinput deleteContentBackward)
    s.page.wait_for_timeout(700); atinge("A7"); s.page.wait_for_timeout(700)
    cdp.send("Input.dispatchKeyEvent", {"type": "keyDown", "key": "Unidentified", "windowsVirtualKeyCode": 229}); cdp.send("Input.dispatchKeyEvent", {"type": "keyUp", "key": "Unidentified", "windowsVirtualKeyCode": 229})
    s.page.keyboard.press("Backspace"); s.page.wait_for_timeout(150)
    rec("X9_backspace", A7=cel("A7"), ev=ultimele_ev(s, 2))
    s.shot("x9_tel.png")
    s.gata()
    # X4 cu barele lui Chrome vizibile (fara --hide-scrollbars), ca pe Windows
    srv, base = server()
    pw = sync_playwright().start()
    br = pw.chromium.launch(headless=True, ignore_default_args=["--hide-scrollbars"])
    ctx = br.new_context(viewport={"width": 1366, "height": 768}); ctx.route("**/*", ruta)
    pg = ctx.new_page(); pg.goto(base + "/aplicatii/poligon.html?aplicatie=excel"); pg.wait_for_selector('[data-lh-aplicatie="excel"]'); pg.wait_for_timeout(800)
    r = pg.evaluate(RECT, '[data-lh-tip="Tab"], .lh-ap-x-sb, [data-lh-tip="ScrollBar"], [data-lh-eticheta="Book1"], .lh-ap-x-file-foi')
    sb = pg.evaluate("""()=>{const r=document.querySelector('[data-lh-aplicatie]');const R=r.getBoundingClientRect();return [...r.querySelectorAll('*')].filter(e=>{const c=getComputedStyle(e);return (c.overflowX==='auto'||c.overflowX==='scroll'||c.overflowY==='auto'||c.overflowY==='scroll')&&(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1)&&e.offsetWidth-e.clientWidth+e.offsetHeight-e.clientHeight>0}).map(e=>[e.className.slice(0,30),Math.round(e.getBoundingClientRect().left-R.left),Math.round(e.getBoundingClientRect().top-R.top),e.offsetWidth-e.clientWidth,e.offsetHeight-e.clientHeight])}""")
    pg.screenshot(path=P + "x4_cu_derulare.png")
    pg.screenshot(path=P + "x4_jos.png", clip={"x": 0, "y": 690, "width": 1366, "height": 78})
    rec("X4", dreptunghiuri=r, bare_chrome_vizibile=sb)
    ctx.close(); br.close(); pw.stop(); srv.shutdown()
finally:
    json.dump(out, open(P + "x9.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
