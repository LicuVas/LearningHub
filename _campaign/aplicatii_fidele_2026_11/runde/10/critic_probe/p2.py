# -*- coding: utf-8 -*-
"""Critic r10 p2: E5 reluat (zona ocupata, =B2:B6*2, =B2:B6) la 1366x768 + A1 pe telefon 375x667 (atingeri, CDP) si in
fereastra mica 1093x526: locul graficului, ce se vede, drumul m2-l11 (titlu, mutare, marire, Delete)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe")
from h import *
out = {}
DATE = {"B1": "Nr", "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8}
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9, "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}
VP = """()=>{const r=document.querySelector('[data-lh-aplicatie]');const c=r.querySelector('.lh-ap-x-corp');const C=c.getBoundingClientRect();
 const rr=e=>{const q=e.getBoundingClientRect();return [Math.round(q.left),Math.round(q.top),Math.round(q.width),Math.round(q.height)]};
 const g=[...r.querySelectorAll('.lh-ap-x-grafic')].map(rr);
 const vis=g.map(q=>{const x0=Math.max(q[0],C.left,0),y0=Math.max(q[1],C.top,0),x1=Math.min(q[0]+q[2],C.left+c.clientWidth,innerWidth),y1=Math.min(q[1]+q[3],C.top+c.clientHeight,innerHeight);return [Math.max(0,Math.round(x1-x0)),Math.max(0,Math.round(y1-y0))]});
 const man=[...r.querySelectorAll('.lh-ap-x-gr-maner')].filter(e=>e.getClientRects().length).map(e=>{const q=e.getBoundingClientRect();const x=q.left+q.width/2,y=q.top+q.height/2;return [Math.round(x),Math.round(y),x>=Math.max(0,C.left)&&x<=Math.min(innerWidth,C.left+c.clientWidth)&&y>=Math.max(0,C.top)&&y<=Math.min(innerHeight,C.top+c.clientHeight)]});
 const t=r.querySelector('.lh-ap-x-grafic [data-lh-tinta$="/titlu"], .lh-ap-x-grafic .lh-ap-x-gr-titlu');
 return {grafic_vp:g,vizibil:vis,maner:man,titlu:t?rr(t):null,corp_vp:[Math.round(C.left),Math.round(C.top),c.clientWidth,c.clientHeight,c.scrollLeft,c.scrollTop,c.scrollWidth,c.scrollHeight],
  pagina:[scrollX,scrollY,innerWidth,innerHeight,document.documentElement.scrollWidth],root:rr(r)}}"""
def col(s, c, a=1, b=8):
    x = s.stare()["celule"]
    return {c + str(i): (x.get(c + str(i)) or {}).get("text") for i in range(a, b) if x.get(c + str(i))}
# ---------------- E5 reluat
s = Sesiune(); K = s.page.keyboard
try:
    deschide_cu(s, {"celule": dict(DATE, D4="x"), "selectie": "A1"})
    clic_cel(s, "D2"); K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(300); K.press("Enter"); s.page.wait_for_timeout(300)
    out["e5_ocupat"] = {"D": col(s, "D"), "ecran": {a: ecran(s, a) for a in ["D2", "D3", "D4"]}}
    deschide_cu(s, {"celule": DATE, "selectie": "A1"})
    clic_cel(s, "D2"); K.type("=B2:B6*2"); K.press("Enter"); s.page.wait_for_timeout(250)
    out["e5_ori2"] = col(s, "D")
    clic_cel(s, "F5"); K.type("=B2:B6"); K.press("Enter"); s.page.wait_for_timeout(250)
    out["e5_simplu_F5"] = col(s, "F", 4, 11)
    clic_cel(s, "H2"); K.type("=B2:B6>8"); K.press("Enter"); s.page.wait_for_timeout(250)
    out["e5_comp_H"] = col(s, "H", 2, 7)
    out["erori_e5"] = s.erori
finally:
    s.gata()
# ---------------- A1 pe telefon si in fereastra mica
for nume, w, h, mob in [("tel", 375, 667, True), ("mica", 1093, 526, False)]:
    s = Sesiune(w, h, mobil=mob); K = s.page.keyboard; r = {}
    cdp = s.ctx.new_cdp_session(s.page)
    def centru(sel):
        return s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
    def tap(sel, vezi=True):
        if vezi: s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(e)e.scrollIntoView({block:'nearest',inline:'nearest'})}", sel); s.page.wait_for_timeout(150)
        b = centru(sel)
        if not b: return None
        if mob: s.page.touchscreen.tap(b[0], b[1])
        else: s.page.mouse.click(b[0], b[1])
        s.page.wait_for_timeout(400); return [round(b[0]), round(b[1])]
    def trage(x0, y0, x1, y1):
        if mob:
            cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y0}]})
            for i in range(1, 9): cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 + (x1 - x0) * i / 8, "y": y0 + (y1 - y0) * i / 8}]}); s.page.wait_for_timeout(30)
            cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []})
        else:
            s.page.mouse.move(x0, y0); s.page.mouse.down(); s.page.mouse.move(x1, y1, steps=8); s.page.mouse.up()
        s.page.wait_for_timeout(300)
    def poz(): return [(g.get("pozitie"), g.get("titlu")) for g in (s.stare().get("grafice") or [])]
    try:
        deschide_cu(s, {"celule": CARTI, "selectie": "A1"}); s.page.wait_for_timeout(300)
        tap('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A1"]')
        tap('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
        tap('[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]')
        tap('[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]', vezi=False)
        r["0_inserat"] = {"vp": s.ev(VP), "poz": poz(), "ev": ultimele_ev(s, 1)}
        s.shot("p2_%s_inserat.png" % nume)
        # titlul: o atingere / un clic pe el, apoi tastez (telefon: CDP insertText), Enter
        tb = r["0_inserat"]["vp"]["titlu"]
        if tb:
            x, y = tb[0] + tb[2] / 2, tb[1] + tb[3] / 2
            if mob: s.page.touchscreen.tap(x, y)
            else: s.page.mouse.click(x, y)
            s.page.wait_for_timeout(300)
            if mob: cdp.send("Input.insertText", {"text": "Cărți"})
            else: K.type("Cărți")
            s.page.wait_for_timeout(200); K.press("Enter"); s.page.wait_for_timeout(300)
        r["1_titlu"] = {"poz": poz(), "ev": ultimele_ev(s, 3), "titlu_vizibil": tb}
        # mutarea: trag de marginea alba (sus, langa colt) spre dreapta cu 120 px
        g = s.ev(VP)["grafic_vp"][0]
        mx, my = g[0] + 30, g[1] + 6
        trage(mx, my, mx + 120, my + 10)
        r["2_mutare"] = {"poz": poz(), "ev": ultimele_ev(s, 1), "vp": s.ev(VP)}
        # marirea: colțul dreapta-jos; daca nu se vede, derulez grila ca omul (rotita / tragere cu degetul pe grila)
        v = s.ev(VP); m = [q for q in v["maner"]]
        r["3_maner_inainte"] = m
        if mob:
            c = v["corp_vp"]; trage(c[0] + 40, c[1] + c[3] - 20, c[0] + 40, c[1] + 40)
        else:
            s.page.mouse.move(v["corp_vp"][0] + 50, v["corp_vp"][1] + 50); s.page.mouse.wheel(0, 200); s.page.wait_for_timeout(300)
        v2 = s.ev(VP); r["3_dupa_derulare"] = {"vp": v2, "poz": poz(), "ev": ultimele_ev(s, 1)}
        dj = [q for q in v2["maner"] if q[2]]
        if v2["maner"]:
            q = max(v2["maner"], key=lambda q: q[0] + q[1])
            r["3_colt_dj"] = q
            if q[2]: trage(q[0], q[1], q[0] + 40, q[1] + 30)
        r["4_marire"] = {"poz": poz(), "ev": ultimele_ev(s, 1)}
        # Delete: tasta Delete, apoi Backspace (tastatura telefonului n-are Delete)
        tap('[data-lh-aplicatie] .lh-ap-x-grafic', vezi=False)
        ev_reset(s); K.press("Backspace"); s.page.wait_for_timeout(200)
        r["5_backspace"] = {"n": len(s.stare().get("grafice") or []), "ev": ultimele_ev(s, 1)}
        K.press("Delete"); s.page.wait_for_timeout(200)
        r["6_delete"] = {"n": len(s.stare().get("grafice") or []), "ev": ultimele_ev(s, 1)}
        r["erori"] = s.erori
    except Exception as e:
        r["exceptie"] = repr(e)
    finally:
        out[nume] = r
        s.gata()
json.dump(out, open(P + "p2.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
