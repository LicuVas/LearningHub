# -*- coding: utf-8 -*-
"""Critic r10 p3: telefon 375x667 (atingeri reale prin CDP): graficul nou pe tabelul LUNI (m2-l11) - se poate muta cu degetul?
se poate atinge C5 (pasul „Clic pe C5, scrie 30”)? se poate sterge (tastatura telefonului)? Plus Delete pe calculator."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe")
from h import *
out = {}
LUNI = {"A1": "Luna", "B1": "8A", "C1": "8B", "A2": "septembrie", "B2": 12, "C2": 9, "A3": "octombrie", "B3": 18, "C3": 14, "A4": "noiembrie", "B4": 25, "C4": 20, "A5": "decembrie", "B5": 15, "C5": 22}
PE = """()=>{window.__pe=[];['pointerdown','pointermove','pointerup','pointercancel'].forEach(t=>document.addEventListener(t,e=>{const l=window.__pe;if(t!=='pointermove'||!l.length||l[l.length-1][0]!=='pointermove')l.push([t,Math.round(e.clientX),Math.round(e.clientY)]);else l[l.length-1][3]=(l[l.length-1][3]||1)+1},true))}"""
for nume, w, h, mob in [("tel", 375, 667, True), ("pc", 1366, 768, False)]:
    s = Sesiune(w, h, mobil=mob); K = s.page.keyboard; r = {}
    cdp = s.ctx.new_cdp_session(s.page)
    def centru(sel):
        return s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
    def atinge(x, y):
        if mob: s.page.touchscreen.tap(x, y)
        else: s.page.mouse.click(x, y)
        s.page.wait_for_timeout(350)
    def tap(sel):
        s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(e)e.scrollIntoView({block:'nearest',inline:'nearest'})}", sel); s.page.wait_for_timeout(150)
        b = centru(sel)
        if b: atinge(*b)
        return b
    def trage(x0, y0, x1, y1):
        if mob:
            cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y0}]})
            for i in range(1, 13): cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 + (x1 - x0) * i / 12, "y": y0 + (y1 - y0) * i / 12}]}); s.page.wait_for_timeout(30)
            cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
        else:
            s.page.mouse.move(x0, y0); s.page.mouse.down(); s.page.mouse.move(x1, y1, steps=10); s.page.mouse.up()
        s.page.wait_for_timeout(350)
    def gr():
        g = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-grafic');if(!e)return null;const q=e.getBoundingClientRect();return [Math.round(q.left),Math.round(q.top),Math.round(q.width),Math.round(q.height),e.classList.contains('lh-ap-x-gr-ales')]}")
        return {"rect": g, "poz": [x.get("pozitie") for x in (s.stare().get("grafice") or [])], "sel": s.stare().get("selectie")}
    try:
        deschide_cu(s, {"celule": LUNI, "selectie": "A1"}); s.page.wait_for_timeout(300)
        tap('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A1"]')
        tap('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
        tap('[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]')
        b = centru('[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]'); atinge(*b)
        r["0_inserat"] = gr()
        c5 = s.ev(CEL, "C5"); r["0_C5_centru"] = c5
        r["0_sub_C5"] = s.ev("([x,y])=>{const e=document.elementFromPoint(x,y);const t=e&&e.closest('[data-lh-tinta]');return t?(t.getAttribute('data-lh-tinta')+':'+(t.getAttribute('data-lh-id')||'')):null}", c5)
        s.shot("p3_%s_inserat.png" % nume)
        # 1. trag graficul de marginea alba (sus, langa colt) spre dreapta-jos
        s.ev(PE); ev_reset(s)
        g = gr()["rect"]; x0, y0 = g[0] + 20, g[1] + 5
        trage(x0, y0, x0 + 200, y0 + 30)
        r["1_tragere"] = dict(gr(), ev=ultimele_ev(s, 2), pointer=s.ev("()=>window.__pe"))
        # 2. ating C5 (unde e acum pe ecran) si scriu 30, Enter
        c5 = s.ev(CEL, "C5"); r["2_C5_centru"] = c5
        r["2_sub_C5"] = s.ev("([x,y])=>{const e=document.elementFromPoint(x,y);const t=e&&e.closest('[data-lh-tinta]');return t?(t.getAttribute('data-lh-tinta')+':'+(t.getAttribute('data-lh-id')||'')):null}", c5)
        ev_reset(s); atinge(*c5)
        if mob: cdp.send("Input.insertText", {"text": "30"})
        else: K.type("30")
        K.press("Enter"); s.page.wait_for_timeout(300)
        r["2_C5_30"] = dict(gr(), C5=(s.stare()["celule"].get("C5") or {}).get("valoare"), ev=ultimele_ev(s, 3))
        # 3. aleg graficul (atingere pe marginea alba vizibila) si incerc sa-l sterg: Backspace (telefon), Delete (PC)
        g = gr()["rect"]; atinge(g[0] + 8, g[1] + 4); r["3_ales"] = gr()
        ev_reset(s); K.press("Backspace"); s.page.wait_for_timeout(250)
        r["3_backspace"] = dict(n=len(s.stare().get("grafice") or []), ev=ultimele_ev(s, 1))
        if not mob:
            K.press("Delete"); s.page.wait_for_timeout(250); r["3_delete"] = dict(n=len(s.stare().get("grafice") or []), ev=ultimele_ev(s, 1))
        else:
            # tastatura telefonului: tasta ⌫ trimite beforeinput deleteContentBackward pe caseta de intrare (CDP: Input.dispatchKeyEvent ca Gboard)
            for t in ("rawKeyDown", "keyUp"): cdp.send("Input.dispatchKeyEvent", {"type": t, "key": "Unidentified", "code": "", "windowsVirtualKeyCode": 229})
            s.page.wait_for_timeout(200)
            r["3_tasta_229"] = dict(n=len(s.stare().get("grafice") or []), ev=ultimele_ev(s, 1), focus=focus(s))
            # Home › Cut cu graficul ales (alt drum fara tasta Delete)
            tap('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Home"], [data-lh-aplicatie] [data-lh-tinta="fila:Home"]')
            r["3_dupa_home"] = gr()
            ev_reset(s); tap('[data-lh-aplicatie] [data-lh-id-mso="Cut"]')
            r["3_cut"] = dict(n=len(s.stare().get("grafice") or []), ev=ultimele_ev(s, 1), mesaj=mesaj_tot(s))
        r["erori"] = s.erori
    except Exception as e:
        r["exceptie"] = repr(e)
    finally:
        out[nume] = r
        s.gata()
json.dump(out, open(P + "p3.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
