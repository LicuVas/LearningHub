# -*- coding: utf-8 -*-
"""Critic r10 p1 (1366x768): E5 (varsarea), A2 (rezumatul din bara de stare), A1 (locul graficului) cu gesturi reale."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
DATE = {"B1": "Nr", "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8}
REF = {"A1": "Nume", "B1": "X", "C1": "Y", "A2": "Ana", "A3": "Bogdan", "A4": "Carmen", "B2": 9, "C2": 7, "B3": 8, "C3": 10, "B4": 6, "C4": 5}
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9, "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}
MOD = "()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"Text\"]')].find(x=>/^Cell Mode/.test(x.getAttribute('data-lh-eticheta')||''));return e?e.textContent:null}"
FX = "()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"bara_formule\"]');if(!e)return null;const i=e.matches('input,textarea')?e:e.querySelector('input,textarea');return i?i.value:e.textContent}"
BARA = """()=>{const r=document.querySelector('[data-lh-aplicatie]');const R=r.getBoundingClientRect();const b=r.querySelector('[data-lh-suprafata="bara_stare"]')||r;
 return [...b.querySelectorAll('[data-lh-tip]')].filter(e=>e.getClientRects().length&&getComputedStyle(e).display!=='none').map(e=>{const q=e.getBoundingClientRect();return [e.getAttribute('data-lh-eticheta'),+(q.left-R.left).toFixed(1),+(q.top-R.top).toFixed(1),+q.width.toFixed(1),+q.height.toFixed(1),e.getAttribute('data-lh-tinta')]}).filter(x=>!/^(Zoom|Position|Size box)/.test(x[0]||''))}"""
def col(c, a=1, b=8):
    x = s.stare()["celule"]
    return {c + str(i): [(x.get(c + str(i)) or {}).get("valoare"), (x.get(c + str(i)) or {}).get("text"), (x.get(c + str(i)) or {}).get("formula")] for i in range(a, b)}
def ecr(c, a=1, b=8): return {c + str(i): ecran(s, c + str(i)) for i in range(a, b)}
def pas(nume, extra=None):
    x = s.stare()
    out[nume] = {"D": col("D"), "ecran_D": ecr("D"), "sel": x.get("selectie"), "mod": s.ev(MOD), "fx": s.ev(FX), "dlg": dialog_vizibil(s),
                 "ev": ultimele_ev(s, 3), "mesaj": mesaj_tot(s), "edit": x.get("ramane_in_editare"), "fm": x.get("fereastra_mesaj")}
    if extra: out[nume].update(extra)
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(200)
def drag(a, b):
    x0, y0 = s.ev(CEL, a); x1, y1 = s.ev(CEL, b)
    s.page.mouse.move(x0, y0); s.page.mouse.down(); s.page.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, steps=4); s.page.mouse.move(x1, y1, steps=4); s.page.mouse.up(); s.page.wait_for_timeout(200)
def typo(cel="D2"):
    clic_cel(s, cel); K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(300)
GR = """()=>{const r=document.querySelector('[data-lh-aplicatie]');const R=r.getBoundingClientRect();const c=r.querySelector('.lh-ap-x-corp');const C=c.getBoundingClientRect();
 const g=[...r.querySelectorAll('.lh-ap-x-grafic')].map(e=>{const q=e.getBoundingClientRect();return [+(q.left-R.left).toFixed(1),+(q.top-R.top).toFixed(1),+q.width.toFixed(1),+q.height.toFixed(1)]});
 const vis=g.map(q=>{const x0=Math.max(q[0],C.left-R.left),y0=Math.max(q[1],C.top-R.top),x1=Math.min(q[0]+q[2],C.left-R.left+c.clientWidth),y1=Math.min(q[1]+q[3],C.top-R.top+c.clientHeight);return [Math.max(0,x1-x0),Math.max(0,y1-y0)]});
 const tl=g.map(q=>{let best=null;r.querySelectorAll('[data-lh-tinta="celula"]').forEach(e=>{const b=e.getBoundingClientRect();if(q[0]+R.left>=b.left-0.5&&q[0]+R.left<b.right&&q[1]+R.top>=b.top-0.5&&q[1]+R.top<b.bottom)best=e.getAttribute('data-lh-id')});return best});
 const ales=[...r.querySelectorAll('.lh-ap-x-gr-maner')].filter(e=>e.getClientRects().length).map(e=>{const q=e.getBoundingClientRect();return [Math.round(q.left-R.left+q.width/2),Math.round(q.top-R.top+q.height/2)]});
 return {grafice:g,vizibil_px:vis,colt_stanga_sus:tl,corp:[+(C.left-R.left).toFixed(1),+(C.top-R.top).toFixed(1),c.clientWidth,c.clientHeight,c.scrollLeft,c.scrollTop],maner:ales,root:[R.width,R.height],vw:[innerWidth,innerHeight]}}"""
def gr(): return {"geom": s.ev(GR), "st": [(g.get("tip"), g.get("pozitie"), g.get("titlu")) for g in (s.stare().get("grafice") or [])], "ev": ultimele_ev(s, 3), "focus": focus(s)}
try:
    # ================= E5
    deschide_cu(s, {"celule": DATE, "selectie": "A1"}); ev_reset(s)
    typo(); pas("e5_0_fereastra", {"focus": focus(s)})
    ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(400); pas("e5_1_yes_enter")
    clic_cel(s, "D3"); pas("e5_2_clic_D3")
    clic_cel(s, "D2"); pas("e5_2b_clic_D2")
    clic_cel(s, "B2"); K.type("10"); K.press("Enter"); s.page.wait_for_timeout(250); pas("e5_3_B2_10")
    ev_reset(s); K.press("Control+z"); s.page.wait_for_timeout(250); pas("e5_4_ctrlz1")
    K.press("Control+z"); s.page.wait_for_timeout(250); pas("e5_5_ctrlz2")
    K.press("Control+y"); s.page.wait_for_timeout(250); pas("e5_6_ctrly")
    # scriu peste o celula varsata
    clic_cel(s, "D4"); K.type("5"); K.press("Enter"); s.page.wait_for_timeout(250); pas("e5_7_D4_5")
    K.press("Control+z"); s.page.wait_for_timeout(250); pas("e5_8_ctrlz")
    # Delete pe o celula varsata, F2 pe ea
    clic_cel(s, "D3"); ev_reset(s); K.press("Delete"); s.page.wait_for_timeout(200); pas("e5_9_delete_D3")
    K.press("F2"); s.page.wait_for_timeout(200); pas("e5_10_f2_D3")
    K.press("Enter"); s.page.wait_for_timeout(200); pas("e5_11_f2_enter")
    clic_cel(s, "D3"); K.press("F2"); K.type("1"); K.press("Enter"); s.page.wait_for_timeout(200); pas("e5_12_f2_1_enter")
    K.press("Control+z"); s.page.wait_for_timeout(200); pas("e5_13_ctrlz")
    clic_cel(s, "D2"); K.press("Delete"); s.page.wait_for_timeout(200); pas("e5_14_delete_D2")
    # zona ocupata dinainte
    deschide_cu(s, dict(DATE, D4="x"), extra=None); ev_reset(s)
    typo(); K.press("Enter"); s.page.wait_for_timeout(300); pas("e5_15_ocupat_yes")
    # =B2:B6*2 tastata direct; =B2:B6 simplu
    deschide_cu(s, DATE); clic_cel(s, "D2"); K.type("=B2:B6*2"); K.press("Enter"); s.page.wait_for_timeout(250); pas("e5_16_inmultire")
    clic_cel(s, "F5"); K.type("=B2:B6"); K.press("Enter"); s.page.wait_for_timeout(250); out["e5_17_simplu_F5"] = {"F": col("F")}
    # ================= A2
    deschide_cu(s, {"celule": REF, "selectie": "B2"}); clic_cel(s, "B2"); s.page.wait_for_timeout(200)
    out["a2_0_o_celula"] = s.ev(BARA)
    K.press("Shift+ArrowRight"); K.press("Shift+ArrowDown"); K.press("Shift+ArrowDown"); s.page.wait_for_timeout(250)
    out["a2_1_shift_B2C4"] = {"sel": s.stare().get("selectie"), "bara": s.ev(BARA), "ev": ultimele_ev(s, 1)}
    s.shot("p1_a2_bara.png", clip={"x": 800, "y": 740, "width": 566, "height": 28})
    clic_cel(s, "B2"); K.press("Control+Shift+ArrowDown"); s.page.wait_for_timeout(250)
    out["a2_2_ctrl_shift_jos"] = {"sel": s.stare().get("selectie"), "bara": s.ev(BARA)}
    clic_cel(s, "A1"); K.press("Control+Shift+ArrowRight"); s.page.wait_for_timeout(250)
    out["a2_3_text_A1C1"] = {"sel": s.stare().get("selectie"), "bara": s.ev(BARA)}
    clic_cel(s, "A2"); K.press("Shift+ArrowRight"); s.page.wait_for_timeout(250)
    out["a2_4_amestec_A2B2"] = {"sel": s.stare().get("selectie"), "bara": s.ev(BARA)}
    clic_cel(s, "C4"); K.press("Shift+ArrowDown"); s.page.wait_for_timeout(250)
    out["a2_5_C4C5_un_numar"] = {"sel": s.stare().get("selectie"), "bara": s.ev(BARA)}
    drag("B2", "C4"); out["a2_6_mouse_B2C4"] = {"sel": s.stare().get("selectie"), "bara": s.ev(BARA)}
    clic_cel(s, "E9"); out["a2_7_dupa"] = s.ev(BARA)
    clic_cel(s, "B2"); K.press("Control+Shift+End"); s.page.wait_for_timeout(250)
    out["a2_8_ctrl_shift_end"] = {"sel": s.stare().get("selectie"), "bara": s.ev(BARA)}
    clic_cel(s, "B3"); K.type("=1/0"); K.press("Enter"); drag("B2", "C4"); out["a2_9_eroare"] = {"bara": s.ev(BARA), "B3": col("B", 3, 4)}
    # ================= A1 (1366x768)
    deschide_cu(s, {"celule": CARTI, "selectie": "A1"}); drag("A1", "B6"); fila("Insert"); ev_reset(s)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]'); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]'); s.page.wait_for_timeout(400)
    out["a1_0_mouse"] = gr(); s.shot("p1_a1_mouse.png")
    # tastatura: Alt, N, C, jos, Enter (din A1, tabelul curent)
    deschide_cu(s, {"celule": CARTI, "selectie": "A1"}); clic_cel(s, "A1"); ev_reset(s)
    for t in ["Alt", "n", "c"]: K.press(t); s.page.wait_for_timeout(220)
    out["a1_1_alt_n_c"] = {"ev": ultimele_ev(s, 3), "focus": focus(s), "kt": keytips(s), "ales": s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"] [aria-selected=\"true\"], [data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"] .lh-ap-marcat')].map(e=>e.getAttribute('data-lh-eticheta'))")}
    K.press("ArrowDown"); s.page.wait_for_timeout(200)
    out["a1_2_jos"] = {"ev": ultimele_ev(s, 1), "focus": focus(s), "ales": s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"] [aria-selected=\"true\"], [data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"] .lh-ap-marcat')].map(e=>e.getAttribute('data-lh-eticheta'))")}
    K.press("Enter"); s.page.wait_for_timeout(400)
    out["a1_3_enter"] = gr()
    # tastele cu graficul ales
    ev_reset(s)
    for t in ["ArrowDown", "ArrowRight", "a", "Enter", "Escape"]:
        K.press(t); s.page.wait_for_timeout(150)
    out["a1_4_taste_grafic"] = {"ev": ultimele_ev(s, 5), "sel": s.stare().get("selectie"), "gr_ales": s.ev("()=>!!document.querySelector('[data-lh-aplicatie] .lh-ap-x-gr-ales')"), "A1": col("A", 1, 3)}
    ev_reset(s); K.press("Control+c"); s.page.wait_for_timeout(150); K.press("Control+x"); s.page.wait_for_timeout(150)
    out["a1_5_ctrl_c_x"] = {"ev": ultimele_ev(s, 2), "gr": gr()["st"], "furnici": s.ev("()=>document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-copiere, [data-lh-aplicatie] [class*=\"furnic\"], [data-lh-aplicatie] [class*=\"clip\"]').length")}
    K.press("Escape"); s.page.wait_for_timeout(150)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-x-grafic'); ev_reset(s); K.press("Delete"); s.page.wait_for_timeout(200)
    out["a1_6_delete"] = {"ev": ultimele_ev(s, 1), "n": len(s.stare().get("grafice") or [])}
    K.press("Control+z"); s.page.wait_for_timeout(250); out["a1_7_ctrlz"] = {"ev": ultimele_ev(s, 1), "gr": gr()}
    # derulat: rotita in grila, apoi Insert
    deschide_cu(s, {"celule": CARTI, "selectie": "A1"}); drag("A1", "B6")
    s.page.mouse.move(600, 500); s.page.mouse.wheel(0, 400); s.page.wait_for_timeout(300)
    fila("Insert"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]'); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]'); s.page.wait_for_timeout(400)
    out["a1_8_derulat"] = gr()
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
