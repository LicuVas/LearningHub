# -*- coding: utf-8 -*-
"""Critic r9 p5: telefon 375x667 (atingeri) si fereastra mica 1093x526: drumul graficului cu panglica derulata ca de om
(glisare = elementul adus in vedere), apoi Change Chart Type: incape? se poate derula fereastra pana la OK? Sort, pentru comparatie."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/9/critic_probe")
from h import *
out = {}
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9, "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}
DLG = """()=>{const V=[innerWidth,innerHeight];return [...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-suprafata]')].filter(e=>e.getClientRects().length).map(d=>{const b=d.getBoundingClientRect();
 const bt=[...d.querySelectorAll('[data-lh-tip="Button"]')].filter(e=>/^(OK|Cancel)$/.test(e.getAttribute('data-lh-eticheta'))).map(e=>{const q=e.getBoundingClientRect();return [e.getAttribute('data-lh-eticheta'),Math.round(q.left),Math.round(q.top),q.left>=0&&q.right<=V[0]&&q.top>=0&&q.bottom<=V[1]]});
 const st=d.closest('.lh-ap-strat-dialog');const cs=getComputedStyle(st);const L=[];let p=d.parentElement;while(p&&p!==document.body){const c=getComputedStyle(p);if(p.scrollHeight>p.clientHeight+2||p.scrollWidth>p.clientWidth+2)L.push([p.className.toString().slice(0,30),c.overflowX,c.overflowY,p.scrollWidth,p.clientWidth,p.scrollHeight,p.clientHeight]);p=p.parentElement}
 return {s:d.getAttribute('data-lh-suprafata'),rect:[Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)],vp:V,butoane:bt,transform:getComputedStyle(d).transform,strat:[cs.overflow,cs.position],derulabile:L}})}"""
for nume, w, h, mob in [("tel", 375, 667, True), ("mica", 1093, 526, False)]:
    s = Sesiune(w, h, mobil=mob); K = s.page.keyboard
    r = {}
    def tap(sel):
        s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(e)e.scrollIntoView({block:'nearest',inline:'center'})}", sel); s.page.wait_for_timeout(150)
        b = s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
        if not b: return None
        if mob: s.page.touchscreen.tap(b[0], b[1])
        else: s.page.mouse.click(b[0], b[1])
        s.page.wait_for_timeout(400); return [round(b[0]), round(b[1])]
    try:
        deschide_cu(s, {"celule": CARTI, "selectie": "A1"}); s.page.wait_for_timeout(300)
        tap('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A1"]'); s.page.wait_for_timeout(500)
        for i in range(5): K.press("Shift+ArrowDown")
        K.press("Shift+ArrowRight")
        r["fila"] = tap('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
        r["buton"] = tap('[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]')
        r["lista"] = s.ev("()=>{const V=[innerWidth,innerHeight];const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"]')].find(x=>x.getClientRects().length);if(!e)return null;const b=e.getBoundingClientRect();const it=[...e.querySelectorAll('[data-lh-tip=\"ListItem\"],[data-lh-tip=\"MenuItem\"]')].filter(x=>{const q=x.getBoundingClientRect();return !(q.left>=0&&q.right<=V[0]&&q.top>=0&&q.bottom<=V[1])}).map(x=>x.getAttribute('data-lh-eticheta'));return [Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height),it]}")
        s.shot("p5_%s_lista.png" % nume)
        r["clustered"] = tap('[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]')
        r["grafic"] = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-grafic')].map(g=>{const b=g.getBoundingClientRect();return [Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)]})")
        r["fila_cd"] = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"TabItem\"]')].filter(e=>e.getClientRects().length&&e.getAttribute('aria-selected')==='true').map(e=>e.getAttribute('data-lh-eticheta'))")
        s.shot("p5_%s_grafic.png" % nume)
        r["cct_btn"] = tap('[data-lh-aplicatie] [data-lh-id-mso="ChartChangeType"]')
        r["cct"] = s.ev(DLG)
        s.shot("p5_%s_cct.png" % nume)
        r["pie"] = tap('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="ListItem"][data-lh-eticheta="Pie"]')
        r["ok"] = tap('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="OK"]')
        r["dupa_ok"] = {"tip": [g["tip"] for g in s.stare().get("grafice") or []], "ev": ultimele_ev(s, 1), "dlg": dialog_vizibil(s)}
        K.press("Escape"); s.page.wait_for_timeout(200)
        # Sort, pentru comparatie
        tap('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A20"]'); s.page.wait_for_timeout(500)
        tap('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A2"]'); s.page.wait_for_timeout(500)
        tap('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Data"], [data-lh-aplicatie] [data-lh-tinta="fila:Data"]')
        tap('[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]')
        r["sort"] = s.ev(DLG)
        s.shot("p5_%s_sort.png" % nume)
        r["erori"] = s.erori
    finally:
        out[nume] = r
        s.gata()
json.dump(out, open(P + "p5.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
