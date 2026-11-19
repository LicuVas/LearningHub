# -*- coding: utf-8 -*-
"""Critic r9 p2: X10 + unghiul aspect pe grafice, la 1366x768: lista ▾ Insert Column (dreptunghi, randuri, titluri), graficul inserat
(loc, marime, titlu, bare), filele Chart Design / Format (locul grupurilor si butoanelor fata de referinta), Change Chart Type
(dreptunghi, file, lista din stanga, subtipuri, OK/Cancel), Switch Row/Column, titlul, mutarea, marirea, Delete, Ctrl+Z, KeyTips."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/9/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9, "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}
LUNI = {"A1": "Luna", "B1": "8A", "C1": "8B", "A2": "septembrie", "B2": 12, "C2": 9, "A3": "octombrie", "B3": 18, "C3": 14, "A4": "noiembrie", "B4": 25, "C4": 20, "A5": "decembrie", "B5": 15, "C5": 22}
ROOT = "()=>{const r=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [r.x,r.y,r.width,r.height]}"
# dreptunghi fata de radacina, pentru un selector + eticheta
RE = """([sel,et])=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();
 const L=[...document.querySelectorAll(sel)].filter(e=>e.getClientRects().length&&(!et||(e.getAttribute('data-lh-eticheta')||'')===et));
 return L.map(e=>{const b=e.getBoundingClientRect();return [+(b.left-R.left).toFixed(1),+(b.top-R.top).toFixed(1),+b.width.toFixed(1),+b.height.toFixed(1),e.getAttribute('data-lh-tip'),(e.getAttribute('data-lh-eticheta')||'').slice(0,40)]})}"""
TABS = """()=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip="TabItem"]')].filter(e=>e.getClientRects().length&&!e.closest('.lh-ap-strat-dialog')).map(e=>{const b=e.getBoundingClientRect();return [e.getAttribute('data-lh-eticheta'),Math.round(b.left-R.left),Math.round(b.top-R.top),Math.round(b.width),Math.round(b.height),e.getAttribute('aria-selected'),getComputedStyle(e).color]})}"""
GR = """()=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-grafic')].map(g=>{const b=g.getBoundingClientRect();
 const t=g.querySelector('.lh-ap-x-gr-titlu');const tb=t?t.getBoundingClientRect():null;
 const bars=[...g.querySelectorAll('rect.lh-ap-x-gr-bara')].map(r=>{const q=r.getBoundingClientRect();return [r.getAttribute('data-lh-valoare'),Math.round(q.height*10)/10,Math.round(q.width*10)/10,r.getAttribute('fill')]});
 const fel=[...g.querySelectorAll('path.lh-ap-x-gr-felie')].map(r=>r.getAttribute('data-lh-valoare'));
 const lin=[...g.querySelectorAll('polyline.lh-ap-x-gr-linie')].length;
 const leg=[...g.querySelectorAll('.lh-ap-x-gr-leg-text')].map(x=>x.textContent);
 const cat=[...g.querySelectorAll('text.lh-ap-x-gr-cat')].map(x=>x.textContent);
 const val=[...g.querySelectorAll('text.lh-ap-x-gr-val')].map(x=>x.textContent);
 const man=[...g.querySelectorAll('.lh-ap-x-gr-maner')].filter(x=>x.getClientRects().length).length;
 return {rect:[Math.round(b.left-R.left),Math.round(b.top-R.top),Math.round(b.width),Math.round(b.height)],titlu:t?t.textContent:null,titlu_rect:tb?[Math.round(tb.left-b.left),Math.round(tb.top-b.top),Math.round(tb.width),Math.round(tb.height)]:null,
  titlu_font:t?getComputedStyle(t).fontSize+' '+getComputedStyle(t).fontFamily.slice(0,30):null,bars,fel,lin,leg,cat,val,man,cls:g.className,border:getComputedStyle(g).border}})}"""
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(250)
def drag(a, b):
    x0, y0 = s.ev(CEL, a); x1, y1 = s.ev(CEL, b)
    s.page.mouse.move(x0, y0); s.page.mouse.down(); s.page.mouse.move((x0 + x1) / 2, (y0 + y1) / 2, steps=4); s.page.mouse.move(x1, y1, steps=4); s.page.mouse.up(); s.page.wait_for_timeout(250)
def st_gr():
    x = s.stare(); return {"grafice": x.get("grafice"), "grafic_activ": x.get("grafic_activ"), "ales": x.get("grafic_element_ales")}
def nume_box(): return s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"caseta_nume\"] input, [data-lh-aplicatie] input[data-lh-eticheta=\"Name Box\"], [data-lh-aplicatie] [data-lh-eticheta=\"Name Box\"] input');return e?e.value:null}")
try:
    deschide_cu(s, {"celule": CARTI, "selectie": "A1"})
    out["root"] = s.ev(ROOT)
    out["tabs0"] = s.ev(TABS)
    drag("A1", "B6"); out["sel"] = s.stare().get("selectie")
    fila("Insert")
    out["insert_charts_btn"] = s.ev(RE, ['[data-lh-aplicatie] [data-lh-suprafata="panglica.TabInsert"] [data-lh-id-mso]', None])
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]'); s.page.wait_for_timeout(300)
    out["lista_ev"] = ultimele_ev(s, 2)
    out["lista"] = s.ev(RE, ['[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"], [data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-tip]', None])
    out["lista_grup_titluri"] = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-gr-grup')].filter(e=>e.getClientRects().length).map(e=>{const b=e.getBoundingClientRect();return [e.textContent,Math.round(b.height),getComputedStyle(e).fontWeight,getComputedStyle(e).backgroundColor]})")
    s.shot("p2_lista.png", clip={"x": 560, "y": 60, "width": 320, "height": 480})
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]'); s.page.wait_for_timeout(400)
    out["ins_ev"] = ultimele_ev(s, 2)
    out["ins_gr"] = s.ev(GR); out["ins_st"] = st_gr(); out["ins_tabs"] = s.ev(TABS); out["ins_namebox"] = nume_box()
    out["ins_sel"] = s.stare().get("selectie")
    out["ctx_design"] = s.ev(RE, ['[data-lh-aplicatie] [data-lh-suprafata="panglica_context.Ctx_ChartDesign"] [data-lh-tip]', None])
    s.shot("p2_inserat.png")
    fila("Format"); out["ctx_format"] = s.ev(RE, ['[data-lh-aplicatie] [data-lh-suprafata="panglica_context.Ctx_Format"] [data-lh-tip]', None])
    out["format_spinner"] = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"panglica_context.Ctx_Format\"] [data-lh-tip=\"Spinner\"]')].map(e=>[e.getAttribute('data-lh-eticheta'),e.textContent.trim(),(e.querySelector('input')||{}).value])")
    s.shot("p2_format.png", clip={"x": 0, "y": 40, "width": 1366, "height": 150})
    fila("Chart Design")
    # Change Chart Type
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartChangeType"]'); s.page.wait_for_timeout(400)
    out["cct_ev"] = ultimele_ev(s, 1)
    out["cct"] = s.ev(RE, ['[data-lh-aplicatie] [data-lh-suprafata^="dialog.ChartChangeType"], [data-lh-aplicatie] [data-lh-suprafata^="dialog.ChartChangeType"] [data-lh-tip]', None])
    out["cct_ales"] = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-strat-dialog [aria-selected=\"true\"]')].map(e=>e.getAttribute('data-lh-tip')+'|'+e.getAttribute('data-lh-eticheta'))")
    out["cct_focus"] = s.ev("()=>{const a=document.activeElement;const t=a&&a.closest('[data-lh-tip]');return t?[t.getAttribute('data-lh-tip'),t.getAttribute('data-lh-eticheta')]:[a&&a.tagName]}")
    s.shot("p2_cct.png", clip={"x": 340, "y": 70, "width": 690, "height": 640})
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="ListItem"][data-lh-eticheta="Pie"]'); s.page.wait_for_timeout(250)
    out["cct_pie_ales"] = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-strat-dialog [aria-selected=\"true\"]')].map(e=>e.getAttribute('data-lh-tip')+'|'+e.getAttribute('data-lh-eticheta'))")
    out["cct_pie_text"] = s.ev(RE, ['[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="Text"]', None])
    s.shot("p2_cct_pie.png", clip={"x": 340, "y": 70, "width": 690, "height": 640})
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="OK"]'); s.page.wait_for_timeout(300)
    out["pie_ev"] = ultimele_ev(s, 1); out["pie_gr"] = s.ev(GR); out["pie_st"] = st_gr()
    s.shot("p2_pie.png")
    # Change Chart Type -> Line (Enter) ; apoi Column
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartChangeType"]'); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="ListItem"][data-lh-eticheta="Line"]'); s.page.wait_for_timeout(200)
    K.press("Enter"); s.page.wait_for_timeout(300); out["line_ev"] = ultimele_ev(s, 1); out["line_gr"] = s.ev(GR); out["line_st"] = st_gr()
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartChangeType"]'); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="ListItem"][data-lh-eticheta="Column"]'); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="OK"]'); s.page.wait_for_timeout(300); out["col_st"] = st_gr()["grafice"][0]["tip"]
    # titlul: un clic pe titlu, scriu, Enter
    clic_el(s, '[data-lh-aplicatie] .lh-ap-x-gr-titlu'); s.page.wait_for_timeout(650)
    out["titlu_ales"] = st_gr()["ales"]; out["titlu_namebox"] = nume_box()
    K.type("Cărți"); s.page.wait_for_timeout(150); out["titlu_fx"] = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] input')].filter(e=>e.getClientRects().length).map(e=>e.value).filter(Boolean)")
    out["titlu_ecran_inainte_enter"] = s.ev(GR)[0]["titlu"]
    K.press("Enter"); s.page.wait_for_timeout(250); out["titlu_ev"] = ultimele_ev(s, 1); out["titlu_gr"] = s.ev(GR)[0]["titlu"]; out["titlu_st"] = st_gr()["grafice"][0]["titlu"]
    # dublu clic pe titlu (lectia: cursorul clipeste in titlu)
    clic_cel(s, "D10"); s.page.wait_for_timeout(650)
    b = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-gr-titlu');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    s.page.mouse.dblclick(b[0], b[1]); s.page.wait_for_timeout(300); out["dublu_titlu_ev"] = ultimele_ev(s, 3)
    K.type("X"); s.page.wait_for_timeout(200); out["dublu_titlu_X"] = {"gr": s.ev(GR)[0]["titlu"], "st": st_gr()["grafice"][0]["titlu"], "ev": ultimele_ev(s, 1)}
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(200)
    # clic pe celula -> neales; file contextuale
    clic_cel(s, "D12"); s.page.wait_for_timeout(650); out["neales_tabs"] = s.ev(TABS); out["neales_st"] = st_gr(); out["neales_man"] = s.ev(GR)[0]["man"]
    # clic pe marginea alba (zona graficului, nu titlu) -> ales
    g = s.ev(GR)[0]["rect"]; R = s.ev(ROOT)
    s.page.mouse.click(R[0] + g[0] + 6, R[1] + g[1] + g[3] - 6); s.page.wait_for_timeout(650); out["ales_margine"] = {"st": st_gr()["ales"], "ev": ultimele_ev(s, 2), "tabs": [t[0] for t in s.ev(TABS)]}
    # mutare: trag din interior 100,60
    g = s.ev(GR)[0]["rect"]
    x0, y0 = R[0] + g[0] + 30, R[1] + g[1] + g[3] - 12
    s.page.mouse.move(x0, y0); s.page.mouse.down(); s.page.mouse.move(x0 + 50, y0 + 30, steps=5); s.page.mouse.move(x0 + 100, y0 + 60, steps=5); s.page.mouse.up(); s.page.wait_for_timeout(300)
    out["mutare"] = {"inainte": g, "dupa": s.ev(GR)[0]["rect"], "st": st_gr()["grafice"][0]["pozitie"], "ev": ultimele_ev(s, 2)}
    # marire: maner dreapta-jos +60,+40
    m = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-gr-maner[data-lh-colt=\"jd\"]');if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    out["maner_jd"] = m
    if m:
        s.page.mouse.move(m[0], m[1]); s.page.mouse.down(); s.page.mouse.move(m[0] + 30, m[1] + 20, steps=4); s.page.mouse.move(m[0] + 60, m[1] + 40, steps=4); s.page.mouse.up(); s.page.wait_for_timeout(300)
        out["marire"] = {"dupa": s.ev(GR)[0]["rect"], "st": st_gr()["grafice"][0]["pozitie"], "ev": ultimele_ev(s, 1)}
    s.shot("p2_mutat_marit.png")
    # legatura cu tabelul: B4 = 20
    clic_cel(s, "B4"); s.page.wait_for_timeout(650); K.type("20"); K.press("Enter"); s.page.wait_for_timeout(300)
    out["legat"] = {"bars": s.ev(GR)[0]["bars"], "st": st_gr()["grafice"][0]["valori"], "val": s.ev(GR)[0]["val"]}
    # Delete pe grafic ales, apoi Ctrl+Z
    g = s.ev(GR)[0]["rect"]; s.page.mouse.click(R[0] + g[0] + 6, R[1] + g[1] + g[3] - 6); s.page.wait_for_timeout(650)
    K.press("Delete"); s.page.wait_for_timeout(250); out["delete"] = {"st": st_gr(), "dom": len(s.ev(GR)), "ev": ultimele_ev(s, 1), "tabs": [t[0] for t in s.ev(TABS)]}
    K.press("Control+z"); s.page.wait_for_timeout(250); out["ctrlz"] = {"st": len(st_gr()["grafice"] or []), "dom": len(s.ev(GR)), "ev": ultimele_ev(s, 1)}
    # ---------- Switch Row/Column pe LUNI
    deschide_cu(s, {"celule": LUNI, "selectie": "A1"}); drag("A1", "C5"); fila("Insert")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]'); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]'); s.page.wait_for_timeout(400)
    out["luni_gr"] = s.ev(GR); out["luni_st"] = st_gr()
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartSwitchRowColumn"]'); s.page.wait_for_timeout(300)
    out["switch_ev"] = ultimele_ev(s, 1); out["switch_gr"] = s.ev(GR); out["switch_st"] = st_gr()
    s.shot("p2_switch.png")
    # ---------- lectia: Insert Line ▾ si Add Chart Element
    fila("Chart Design"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="AddChartElementMenu"]'); s.page.wait_for_timeout(300)
    out["add_elem"] = {"ev": ultimele_ev(s, 1), "mesaj": mesaj_tot(s)}
    gol_mesaj(s); fila("Insert"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeLineInsertGallery"]'); s.page.wait_for_timeout(300)
    out["ins_line"] = {"ev": ultimele_ev(s, 1), "mesaj": mesaj_tot(s), "st": [g["tip"] for g in st_gr()["grafice"]]}
    gol_mesaj(s)
    # ---------- KeyTips cu graficul ales
    g = s.ev(GR)[0]["rect"]; s.page.mouse.click(R[0] + g[0] + 6, R[1] + g[1] + g[3] - 6); s.page.wait_for_timeout(650)
    K.press("Alt"); s.page.wait_for_timeout(250); out["kt_alt"] = s.ev("()=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-keytip')].filter(e=>e.getClientRects().length).map(e=>{const b=e.getBoundingClientRect();return [e.textContent,Math.round(b.left-R.left),Math.round(b.top-R.top)]})}")
    K.press("j"); s.page.wait_for_timeout(200); out["kt_j"] = keytips(s)
    K.press("c"); s.page.wait_for_timeout(250); out["kt_jc"] = {"kt": keytips(s), "ev": ultimele_ev(s, 2)}
    K.press("c"); s.page.wait_for_timeout(300); out["kt_jcc"] = {"ev": ultimele_ev(s, 1), "dlg": dialog_vizibil(s)}
    K.press("Escape"); s.page.wait_for_timeout(200)
    # Alt, N, C -> lista; sageata jos + Enter
    clic_cel(s, "E12"); s.page.wait_for_timeout(650); drag("A1", "C5")
    for t in ["Alt", "n", "c"]: K.press(t); s.page.wait_for_timeout(200)
    out["kt_nc"] = {"ev": ultimele_ev(s, 3), "lista": len(s.ev(RE, ['[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"]', None])), "kt": keytips(s)}
    K.press("ArrowDown"); s.page.wait_for_timeout(150); K.press("Enter"); s.page.wait_for_timeout(300)
    out["kt_nc_enter"] = {"ev": ultimele_ev(s, 2), "n": len(st_gr()["grafice"] or []), "tip": [g["tip"] for g in st_gr()["grafice"]]}
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p2.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
