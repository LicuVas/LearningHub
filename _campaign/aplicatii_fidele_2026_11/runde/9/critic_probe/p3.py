# -*- coding: utf-8 -*-
"""Critic r9 p3 (aspect): (a) clic pe o celula IN AFARA graficului il lasa neales; (b) dreptunghiurile ferestrelor rundelor 7-9 fata de
referinta (rect_css, la 1366x768); (c) bara de stare cu B2:C4 aleasa; (d) telefon 375x667 si fereastra mica 1093x526 (1366x657 la 125%):
lista ▾ a graficelor, graficul, Change Chart Type, Sort — incap? se ajunge la OK?"""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/9/critic_probe")
from h import *
out = {}
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9, "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}
DATE = {"A1": 4, "A2": 5, "A3": 6, "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8, "C2": 7, "C3": 10, "C4": 5}
TAB = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 88, "A3": "Bogdan", "B3": "VIII B", "C3": 95, "A4": "Carmen", "B4": "VIII A", "C4": 60}
DLG = """()=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();const V=[innerWidth,innerHeight];
 return [...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-suprafata]')].filter(e=>e.getClientRects().length).map(d=>{const b=d.getBoundingClientRect();
  const bt=[...d.querySelectorAll('[data-lh-tip="Button"]')].filter(e=>e.getClientRects().length).map(e=>{const q=e.getBoundingClientRect();const cs=getComputedStyle(e);return [e.getAttribute('data-lh-eticheta'),Math.round(q.left-R.left),Math.round(q.top-R.top),Math.round(q.width),Math.round(q.height),cs.borderTopColor+' '+cs.borderTopWidth+' '+cs.outlineStyle,
   q.left>=0&&q.top>=0&&q.right<=V[0]&&q.bottom<=V[1]]});
  const q=d.querySelector('[data-lh-dialog-intrebare]');
  return {s:d.getAttribute('data-lh-suprafata'),rect:[Math.round(b.left-R.left),Math.round(b.top-R.top),Math.round(b.width),Math.round(b.height)],in_ecran:b.left>=0&&b.top>=0&&b.right<=V[0]&&b.bottom<=V[1],
   intrebare:q?q.textContent.trim().slice(0,160):null,butoane:bt}})}"""
GR = """()=>{const V=[innerWidth,innerHeight];return [...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-grafic')].map(g=>{const b=g.getBoundingClientRect();return {rect:[Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)],in_ecran:b.left>=0&&b.top>=0&&b.right<=V[0]&&b.bottom<=V[1],man:[...g.querySelectorAll('.lh-ap-x-gr-maner')].length}})}"""
LISTA = """()=>{const V=[innerWidth,innerHeight];const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"]')].find(x=>x.getClientRects().length);if(!e)return null;const b=e.getBoundingClientRect();
 const it=[...e.querySelectorAll('[data-lh-tip="ListItem"],[data-lh-tip="MenuItem"]')].map(x=>{const q=x.getBoundingClientRect();return [x.getAttribute('data-lh-eticheta'),q.left>=0&&q.top>=0&&q.right<=V[0]&&q.bottom<=V[1]]});
 return {rect:[Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)],vp:V,nevazute:it.filter(x=>!x[1]).map(x=>x[0])}}"""
def fila(s, n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(250)
def drag(s, a, b):
    x0, y0 = s.ev(CEL, a); x1, y1 = s.ev(CEL, b)
    s.page.mouse.move(x0, y0); s.page.mouse.down(); s.page.mouse.move(x1, y1, steps=6); s.page.mouse.up(); s.page.wait_for_timeout(250)
def proaspat(s, cont, sel):
    deschide_cu(s, {"celule": cont, "selectie": sel}); clic_cel(s, sel); s.page.wait_for_timeout(650); ev_reset(s)
# ---------------- 1366x768
s = Sesiune(); K = s.page.keyboard
try:
    proaspat(s, CARTI, "A1"); drag(s, "A1", "B6"); fila(s, "Insert")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]'); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]'); s.page.wait_for_timeout(400)
    clic_cel(s, "A10"); s.page.wait_for_timeout(650)
    x = s.stare(); out["a_neales"] = {"activ": x.get("grafic_activ"), "ev": ultimele_ev(s, 1), "sel": x.get("selectie"), "gr": s.ev(GR),
        "tabs": s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"TabItem\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta')+(e.getAttribute('aria-selected')==='true'?'*':''))")}
    # Quick Styles: elementul MenuItem fara eticheta din mijlocul galeriei
    g = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-grafic');const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}")
    s.page.mouse.click(g[0] + 6, g[1] + g[3] - 6); s.page.wait_for_timeout(650)
    out["qs_menuitem"] = s.ev("""()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-id-mso="ChartStylesGallery"]');if(!e)return null;const r=e.getBoundingClientRect();
      return {rect:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)],copii:[...e.children].map(c=>c.tagName+'.'+c.className.toString().slice(0,40)+'|'+(c.getAttribute('aria-hidden')||'')),text:e.textContent.trim().slice(0,30),
      style1:(()=>{const x=e.querySelector('[data-lh-eticheta="Style 1"]');return x?[x.getAttribute('aria-selected'),x.className]:null})()}}""")
    out["qs_clic"] = None
    if clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="panglica_context.Ctx_ChartDesign"] [data-lh-eticheta="Style 3"]'):
        out["qs_clic"] = {"ev": ultimele_ev(s, 1), "mesaj": mesaj_tot(s)}
    gol_mesaj(s)
    # ferestrele: Sort, Sort Warning, nivel gol, typo, virgula, too few, Save this file, Save your changes, lista Σ
    proaspat(s, TAB, "B2"); fila(s, "Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]'); s.page.wait_for_timeout(300)
    out["d_sort"] = s.ev(DLG)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Add Level"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="OK"]'); s.page.wait_for_timeout(250)
    out["d_nivel_gol"] = s.ev(DLG)
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(200)
    proaspat(s, TAB, "C2")
    for i in range(2): K.press("Shift+ArrowDown")
    fila(s, "Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(300)
    out["d_sort_warning"] = s.ev(DLG); K.press("Escape")
    proaspat(s, DATE, "D2"); K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(300); out["d_typo"] = s.ev(DLG); s.shot("p3_typo.png", clip={"x": 480, "y": 250, "width": 410, "height": 280})
    K.press("Escape"); K.press("Escape"); K.press("Escape")
    proaspat(s, DATE, "D3"); K.type("=SUM(B2,B3"); K.press("Enter"); s.page.wait_for_timeout(300); out["d_virgula"] = s.ev(DLG); K.press("Escape"); K.press("Escape"); K.press("Escape")
    proaspat(s, DATE, "D4"); K.type("=IF("); K.press("Enter"); s.page.wait_for_timeout(300); out["d_toofew_IF"] = s.ev(DLG); K.press("Escape"); K.press("Escape"); K.press("Escape")
    proaspat(s, DATE, "D5"); K.type("=SU"); K.press("Tab"); K.press("Enter"); s.page.wait_for_timeout(300); out["d_su_tab"] = s.ev(DLG); K.press("Escape"); K.press("Escape"); K.press("Escape")
    proaspat(s, DATE, "E2"); K.press("Control+s"); s.page.wait_for_timeout(300); out["d_save_this"] = s.ev(DLG); s.shot("p3_save_this.png", clip={"x": 440, "y": 215, "width": 490, "height": 350}); K.press("Escape")
    proaspat(s, DATE, "E2"); K.type("x"); K.press("Enter"); K.press("Control+w"); s.page.wait_for_timeout(300); out["d_save_changes"] = s.ev(DLG); K.press("Escape")
    proaspat(s, DATE, "B8"); fila(s, "Home"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="AutoSumMenu_Dropdown"]'); s.page.wait_for_timeout(250)
    out["l_sigma"] = s.ev("()=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"lista.AutoSum\"]')].find(x=>x.getClientRects().length);if(!e)return null;const b=e.getBoundingClientRect();return [Math.round(b.left-R.left),Math.round(b.top-R.top),Math.round(b.width),Math.round(b.height)]}")
    K.press("Escape")
    # bara de stare: B2:C4
    proaspat(s, DATE, "B2"); drag(s, "B2", "C4")
    out["bara"] = s.ev("()=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();const sb=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"bara_stare\"]');if(!sb)return null;return [...sb.querySelectorAll('[data-lh-tip]')].filter(e=>e.getClientRects().length).map(e=>{const b=e.getBoundingClientRect();return [e.getAttribute('data-lh-tip'),e.getAttribute('data-lh-eticheta'),e.textContent.trim().slice(0,20),Math.round(b.left-R.left),Math.round(b.top-R.top),Math.round(b.width),Math.round(b.height)]})}")
    out["erori_1366"] = s.erori
finally:
    s.gata()
# ---------------- telefon si fereastra mica
for nume, w, h, mob in [("tel", 375, 667, True), ("mica", 1093, 526, False)]:
    s = Sesiune(w, h, mobil=mob); K = s.page.keyboard
    try:
        r = {}
        proaspat(s, CARTI, "A1")
        def tap(sel):
            b = s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.x,r.y,r.width,r.height]}", sel)
            if not b: return None
            if mob: s.page.touchscreen.tap(b[0], b[1])
            else: s.page.mouse.click(b[0], b[1])
            s.page.wait_for_timeout(350); return b
        # zona A1:B6: clic A1, shift+clic B6 (pe telefon: atingere + Shift ar cere tastatura; folosesc tastatura)
        tap('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A1"]'); s.page.wait_for_timeout(400)
        for i in range(5): K.press("Shift+ArrowDown")
        K.press("Shift+ArrowRight"); s.page.wait_for_timeout(150); r["sel"] = s.stare().get("selectie")
        r["fila_insert"] = tap('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
        r["buton"] = tap('[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]')
        r["lista"] = s.ev(LISTA)
        s.shot("p3_%s_lista.png" % nume)
        r["clustered"] = tap('[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]')
        x = s.stare(); r["dupa"] = {"n": len(x.get("grafice") or []), "ev": ultimele_ev(s, 1), "gr": s.ev(GR)}
        s.shot("p3_%s_grafic.png" % nume)
        r["cct_btn"] = tap('[data-lh-aplicatie] [data-lh-id-mso="ChartChangeType"]')
        r["cct"] = s.ev(DLG)
        s.shot("p3_%s_cct.png" % nume)
        r["pie"] = tap('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="ListItem"][data-lh-eticheta="Pie"]')
        r["ok"] = tap('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="OK"]')
        r["dupa_ok"] = {"tip": [g["tip"] for g in s.stare().get("grafice") or []], "ev": ultimele_ev(s, 1), "dlg": dialog_vizibil(s)}
        r["erori"] = s.erori
        out[nume] = r
    finally:
        s.gata()
json.dump(out, open(P + "p3.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
