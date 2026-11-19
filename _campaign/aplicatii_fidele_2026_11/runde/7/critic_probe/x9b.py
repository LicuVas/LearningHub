# -*- coding: utf-8 -*-
"""Critic r7: X9 pe telefon, pe o celula vizibila (B3): atingere -> focus -> textul tastaturii -> Enter."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe")
from h import *
out = {}
def rec(k, **v): out[k] = v; print(k, json.dumps(v, ensure_ascii=False)[:1200])
s = Sesiune(375, 667, mobil=True)
try:
    s.deschide()
    cdp = s.ctx.new_cdp_session(s.page)
    def cel(a): return s.ev("a=>LH.aplicatii.stare('excel').celule[a]||null", a)
    def foc(): return s.ev("()=>{const a=document.activeElement;return a?(a.tagName+'.'+(a.className||'')).slice(0,60):null}")
    x, y = s.ev(CEL, "B3"); vw = s.ev("()=>innerWidth")
    s.page.touchscreen.tap(x, y); s.page.wait_for_timeout(400)
    f = foc(); sel = s.stare()["selectie"]
    cdp.send("Input.insertText", {"text": "7,5"}); s.page.wait_for_timeout(150); v1 = cel("B3")
    s.page.keyboard.press("Enter"); s.page.wait_for_timeout(150)
    rec("X9_B3", centru=[round(x), round(y)], latime_ecran=vw, foc=f, sel_dupa_atingere=sel, B3_inainte_enter=v1, B3=cel("B3"), sel=s.stare()["selectie"], ev=ultimele_ev(s, 3))
    # celula D3 (în afara ecranului la 375 px): elevul derulează grila cu degetul, apoi atinge D3
    corp = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-corp');const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]}")
    s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-corp');e.scrollLeft=200}"); s.page.wait_for_timeout(300)
    x, y = s.ev(CEL, "D3")
    if 0 < x < vw:
        s.page.touchscreen.tap(x, y); s.page.wait_for_timeout(400)
        cdp.send("Input.imeSetComposition", {"text": "8", "selectionStart": 1, "selectionEnd": 1}); cdp.send("Input.insertText", {"text": "8"})
        s.page.keyboard.press("Enter"); s.page.wait_for_timeout(150)
        rec("X9_D3_dupa_derulare", centru=[round(x), round(y)], D3=cel("D3"), foc=foc(), ev=ultimele_ev(s, 3))
    s.shot("x9b_tel.png")
finally:
    json.dump(out, open(P + "x9b.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
