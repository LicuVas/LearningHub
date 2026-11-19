# -*- coding: utf-8 -*-
"""Critic r9 p4: (a) bara de stare cu B2:C4 aleasa (9,7 / 8,10 / 6,5 ca in referinta); (b) elementul fara eticheta din mijlocul
galeriei Quick Styles; (c) telefon 375x667 si fereastra mica 1093x526: se poate DERULA panglica pana la butoane (roata / glisare)?
apoi lista, graficul, Change Chart Type, OK."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/9/critic_probe")
from h import *
out = {}
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9, "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}
NUM = {"B2": 9, "C2": 7, "B3": 8, "C3": 10, "B4": 6, "C4": 5}
DLG = """()=>{const V=[innerWidth,innerHeight];return [...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-suprafata]')].filter(e=>e.getClientRects().length).map(d=>{const b=d.getBoundingClientRect();
 const ok=[...d.querySelectorAll('[data-lh-tip="Button"]')].find(e=>e.getAttribute('data-lh-eticheta')==='OK');const q=ok?ok.getBoundingClientRect():null;
 return {s:d.getAttribute('data-lh-suprafata'),rect:[Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)],vp:V,ok:q?[Math.round(q.left),Math.round(q.top),q.right<=V[0]&&q.bottom<=V[1]]:null}})}"""
SCROLL = """s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const L=[];let p=e.parentElement;
 while(p&&p!==document.body){const cs=getComputedStyle(p);if(p.scrollWidth>p.clientWidth+2)L.push([p.className.toString().slice(0,40),cs.overflowX,p.scrollWidth,p.clientWidth,p.scrollLeft]);p=p.parentElement}return L}"""
POS = "s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),r.right<=innerWidth&&r.left>=0]}"
def proaspat(s, cont, sel):
    deschide_cu(s, {"celule": cont, "selectie": sel}); clic_cel(s, sel); s.page.wait_for_timeout(650); ev_reset(s)
s = Sesiune(); K = s.page.keyboard
try:
    proaspat(s, NUM, "B2"); K.press("Shift+ArrowDown"); K.press("Shift+ArrowDown"); K.press("Shift+ArrowRight"); s.page.wait_for_timeout(300)
    out["a_sel"] = s.stare().get("selectie")
    out["a_bara"] = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"bara_stare\"] [data-lh-tip]')].filter(e=>e.getClientRects().length).map(e=>(e.getAttribute('data-lh-eticheta')||'')+'|'+e.textContent.trim().slice(0,20))")
    s.shot("p4_bara.png", clip={"x": 700, "y": 740, "width": 666, "height": 28})
    # (b)
    proaspat(s, CARTI, "A1"); K.press("Shift+ArrowDown"); [K.press("Shift+ArrowDown") for i in range(4)]; K.press("Shift+ArrowRight")
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]'); s.page.wait_for_timeout(250)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]'); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]'); s.page.wait_for_timeout(400)
    out["b_punct"] = s.ev("""()=>{const L=document.elementsFromPoint(571,110).slice(0,5);return L.map(e=>[e.tagName,e.className.toString().slice(0,50),e.getAttribute('data-lh-tip'),e.getAttribute('data-lh-eticheta'),e.getAttribute('data-lh-id-mso'),e.getAttribute('aria-hidden')])}""")
    out["b_style1"] = s.ev("()=>{const x=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"panglica_context.Ctx_ChartDesign\"] [data-lh-eticheta=\"Style 1\"]');return x?[x.getAttribute('aria-selected'),x.className,getComputedStyle(x).backgroundColor,getComputedStyle(x).outlineStyle]:null}")
    s.page.mouse.click(571, 112); s.page.wait_for_timeout(300); out["b_clic"] = {"ev": ultimele_ev(s, 1), "mesaj": mesaj_tot(s)}
    out["erori"] = s.erori
finally:
    s.gata()
for nume, w, h, mob in [("tel", 375, 667, True), ("mica", 1093, 526, False)]:
    s = Sesiune(w, h, mobil=mob); K = s.page.keyboard
    r = {}
    def tap(sel, deruleaza=True):
        if deruleaza:
            # gestul omului: glisare / rotita peste panglica pana se vede butonul; aici aduc elementul in vedere cum ar face derularea
            r.setdefault("derulare", []).append([sel[-60:], s.ev(SCROLL, sel)])
            p0 = s.ev(POS, sel)
            if p0 and not p0[4]:
                # incerc intai rotita orizontala (Shift+rotita) peste panglica, ca omul
                s.page.mouse.move(min(p0[0], w - 20) if p0[0] > 0 else 20, p0[1] + 5)
                for i in range(8): s.page.mouse.wheel(300, 0); s.page.wait_for_timeout(60)
                r.setdefault("dupa_rotita", []).append([sel[-50:], s.ev(POS, sel)])
        b = s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.right<=innerWidth]}", sel)
        if not b: return None
        if mob: s.page.touchscreen.tap(b[0], b[1])
        else: s.page.mouse.click(b[0], b[1])
        s.page.wait_for_timeout(350); return b
    try:
        proaspat(s, CARTI, "A1")
        for i in range(5): K.press("Shift+ArrowDown")
        K.press("Shift+ArrowRight")
        tap('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
        r["buton"] = tap('[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]')
        r["lista"] = s.ev("()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"]')].find(x=>x.getClientRects().length);if(!e)return null;const b=e.getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height),innerWidth,innerHeight]}")
        s.shot("p4_%s_lista.png" % nume)
        r["clustered"] = tap('[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]', False)
        r["grafic"] = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-grafic')].map(g=>{const b=g.getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height),innerWidth,innerHeight]})")
        s.shot("p4_%s_grafic.png" % nume)
        r["cct_btn"] = tap('[data-lh-aplicatie] [data-lh-id-mso="ChartChangeType"]')
        r["cct"] = s.ev(DLG)
        s.shot("p4_%s_cct.png" % nume)
        r["ok"] = tap('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="OK"]', False)
        r["dupa"] = {"ev": ultimele_ev(s, 2), "dlg": dialog_vizibil(s)}
        r["erori"] = s.erori
    finally:
        out[nume] = r
        s.gata()
json.dump(out, open(P + "p4.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
