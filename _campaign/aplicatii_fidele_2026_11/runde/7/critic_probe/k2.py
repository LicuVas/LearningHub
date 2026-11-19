# -*- coding: utf-8 -*-
"""Critic r7: navigare cu Shift/Ctrl, diacritice (keydown real, insertText, compunere), bara de formule, caseta de nume."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
def st(): x = s.stare(); return {"sel": x.get("selectie"), "cel": {k: (v.get("valoare"), v.get("text"), v.get("formula"), v.get("editare")) for k, v in (x.get("celule") or {}).items()}}
def ev(n=3): return ultimele_ev(s, n)
def foc(): return s.ev("()=>{const a=document.activeElement;return a?(a.tagName+'.'+(a.className||'')+' '+(a.getAttribute('data-lh-tinta')||'')+' '+(a.getAttribute('aria-label')||'')).slice(0,90):null}")
def rec(k, **v): out[k] = v; print(k, json.dumps(v, ensure_ascii=False)[:900])
def pauza(): s.page.wait_for_timeout(650)
cdp = s.ctx.new_cdp_session(s.page)
def tasta_ro(ch, code):
    # o tasta romaneasca reala (Romanian Standard: ș pe tasta ;) = keydown cu key='ș' + char
    cdp.send("Input.dispatchKeyEvent", {"type": "keyDown", "key": ch, "code": code, "text": ch, "unmodifiedText": ch, "windowsVirtualKeyCode": 186})
    cdp.send("Input.dispatchKeyEvent", {"type": "keyUp", "key": ch, "code": code, "windowsVirtualKeyCode": 186})
try:
    s.deschide()
    r = {}
    clic_cel(s, "A1"); pauza(); K.press("Shift+ArrowRight"); K.press("Shift+ArrowDown"); r["shift_dreapta_jos"] = st()["sel"]
    pauza(); clic_cel(s, "A1"); pauza(); K.press("Control+Shift+ArrowDown"); r["ctrl_shift_jos"] = st()["sel"]
    K.press("Control+Shift+ArrowRight"); r["ctrl_shift_dreapta"] = st()["sel"]
    pauza(); clic_cel(s, "B3"); pauza(); K.press("Control+Shift+Home"); r["ctrl_shift_home"] = st()["sel"]
    pauza(); clic_cel(s, "C2"); pauza(); K.press("Home"); r["home"] = st()["sel"]
    rec("navigare", **r, ev=ev(2))
    # diacritice: keydown real (key='ș') in modul Ready, apoi in editare
    pauza(); clic_cel(s, "E2"); pauza()
    tasta_ro("ș", "Semicolon"); K.type("i"); tasta_ro("ț", "Quote"); K.press("Enter")
    rec("diacritice_keydown", E2=st()["cel"].get("E2"), ev=ev(4))
    # Playwright type cu diacritice (insertText pentru caracterele din afara US) in Ready
    pauza(); clic_cel(s, "E3"); pauza(); K.type("Mădălina"); K.press("Enter")
    rec("diacritice_insertText_ready", E3=st()["cel"].get("E3"), ev=ev(3))
    # compunere IME in Ready: „ș” compus, apoi „i”
    pauza(); clic_cel(s, "E4"); pauza()
    cdp.send("Input.imeSetComposition", {"text": "s", "selectionStart": 1, "selectionEnd": 1})
    cdp.send("Input.imeSetComposition", {"text": "ș", "selectionStart": 1, "selectionEnd": 1})
    cdp.send("Input.insertText", {"text": "ș"})
    K.type("i"); K.press("Enter")
    rec("compunere_ready", E4=st()["cel"].get("E4"), ev=ev(4))
    # AltGr (Romanian Programmers: AltGr+s = ș) — Chrome pe Windows: ctrlKey+altKey
    pauza(); clic_cel(s, "E5"); pauza()
    cdp.send("Input.dispatchKeyEvent", {"type": "keyDown", "key": "ș", "code": "KeyS", "text": "ș", "modifiers": 3, "windowsVirtualKeyCode": 83})
    cdp.send("Input.dispatchKeyEvent", {"type": "keyUp", "key": "ș", "code": "KeyS", "modifiers": 3, "windowsVirtualKeyCode": 83})
    K.press("Enter")
    rec("altgr", E5=st()["cel"].get("E5"), ev=ev(3))
    # bara de formule: clic in ea, tastare, Enter
    pauza(); clic_cel(s, "B4"); pauza()
    bf = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-bara-in');if(!e)return null;const b=e.getBoundingClientRect();return [b.x+b.width-30,b.y+b.height/2,e.value,e.readOnly]}")
    s.page.mouse.click(bf[0], bf[1]); s.page.wait_for_timeout(150)
    f1 = foc(); K.press("End"); K.type("5"); K.press("Enter")
    rec("bara_formule", inainte=bf[2:], foc_dupa_clic=f1, B4=st()["cel"].get("B4"), sel=st()["sel"], ev=ev(3))
    # caseta de nume: clic, scrie D3, Enter
    pauza()
    nb = s.ev("()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] input')].find(x=>/Name Box/i.test(x.getAttribute('aria-label')||''));if(!e)return null;const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]}")
    if nb:
        s.page.mouse.click(nb[0], nb[1]); K.press("Control+a"); K.type("D3"); K.press("Enter")
        rec("caseta_nume", sel=st()["sel"], foc=foc(), ev=ev(2))
    else: rec("caseta_nume", lipsa=True)
    rec("erori", e=s.erori)
finally:
    json.dump(out, open(P + "k2.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
