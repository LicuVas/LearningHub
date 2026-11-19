# -*- coding: utf-8 -*-
"""Critic r10 p5: bara de stare cu rezumatul (B2:C4) in fereastra mica 1093x526 si pe telefon 375x667 (suprapuneri, ce se vede);
Ctrl+→ dupa bloc; Alt, N, C, Esc, Esc (unde ajung tastele de acces si focusul)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe")
from h import *
out = {}
REF = {"A1": "Nume", "B1": "X", "C1": "Y", "A2": "Ana", "A3": "Bogdan", "A4": "Carmen", "B2": 9, "C2": 7, "B3": 8, "C3": 10, "B4": 6, "C4": 5}
BARA = """()=>{const r=document.querySelector('[data-lh-aplicatie]');const b=r.querySelector('[data-lh-suprafata="bara_stare"]');const B=b.getBoundingClientRect();
 const it=[...b.querySelectorAll(':scope [data-lh-tip]')].filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none'&&!e.closest('[data-lh-tip="Slider"]')).map(e=>{const q=e.getBoundingClientRect();return [e.getAttribute('data-lh-eticheta'),Math.round(q.left),Math.round(q.right),Math.round(q.top)]});
 const supra=[];for(let i=0;i<it.length;i++)for(let j=i+1;j<it.length;j++){const a=it[i],c=it[j];if(Math.abs(a[3]-c[3])<5&&a[1]<c[2]-1&&c[1]<a[2]-1)supra.push([a[0],c[0]])}
 return {bara:[Math.round(B.left),Math.round(B.right),b.scrollWidth,b.clientWidth],elemente:it,suprapuse:supra,vw:innerWidth}}"""
for nume, w, h, mob in [("mica", 1093, 526, False), ("tel", 375, 667, True), ("pc", 1366, 768, False)]:
    s = Sesiune(w, h, mobil=mob); K = s.page.keyboard; r = {}
    try:
        deschide_cu(s, {"celule": REF, "selectie": "B2"})
        if mob:
            b = s.ev(CEL, "B2"); s.page.touchscreen.tap(*b); s.page.wait_for_timeout(300)
        else: clic_cel(s, "B2")
        for t in ["Shift+ArrowRight", "Shift+ArrowDown", "Shift+ArrowDown"]: K.press(t); s.page.wait_for_timeout(120)
        r["sel"] = s.stare().get("selectie"); r["bara"] = s.ev(BARA)
        s.shot("p5_%s_bara.png" % nume)
        if not mob:
            clic_cel(s, "C4"); K.press("Control+ArrowRight"); s.page.wait_for_timeout(150); r["ctrl_dreapta_C4"] = s.stare().get("selectie")
            clic_cel(s, "A1"); ev_reset(s)
            for t in ["Alt", "n", "c"]: K.press(t); s.page.wait_for_timeout(200)
            K.press("Escape"); s.page.wait_for_timeout(200)
            r["esc1"] = {"lista": s.ev("()=>!!document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"]')"), "kt": keytips(s), "ev": ultimele_ev(s, 1)}
            K.press("Escape"); s.page.wait_for_timeout(200)
            r["esc2"] = {"kt": keytips(s), "ev": ultimele_ev(s, 1)}
            K.press("Escape"); s.page.wait_for_timeout(200)
            r["esc3"] = {"kt": keytips(s), "ev": ultimele_ev(s, 1), "focus": focus(s)}
        r["erori"] = s.erori
    except Exception as e:
        r["exceptie"] = repr(e)
    finally:
        out[nume] = r; s.gata()
json.dump(out, open(P + "p5.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
