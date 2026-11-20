# -*- coding: utf-8 -*-
"""Runda 21 (B-excel#2, unghiul aspect): proba GRAV-urilor G17-1 si G17-2 din runde/17/critic.md, pe codul de azi.
Headless, server 127.0.0.1 pe port liber, reteaua taiata in afara de 127.0.0.1/localhost (proba/h21.py, copiat din critic_probe/hc.py).
    python proba_grav.py --iesire <fisier.json>              # codul de azi; ultima linie = numarul verificarilor picate
    LH_VECHI=1 python proba_grav.py --iesire <fisier.json>   # codul de dinainte de runda (copiile din runde/21/inainte/, servite prin ruta)
G17-1: gesturile criticului (critic_probe/p5.py › C_nou, p6.py › a): A1:A7 pline, clic pe A7, Ctrl+↓ (scenariul excel-ctrl-jos-ultimul-rand),
       „5” + Enter acolo, apoi Ctrl+↑, Ctrl+Home, ↑; Ctrl+→ din C7 (excel-ctrl-dreapta-ultima-coloana) si Ctrl+← inapoi.
G17-2: telefon 375×667, atingere pe A1, apoi degetul tras pe grila (CDP Input.dispatchTouchEvent, ca p5.py › T_nou si p2c.py › 2_deget_grila);
       apoi o atingere scurta pe o celula vazuta."""
import argparse, json, os, sys, traceback
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/21/proba")
from h21 import *

R = {}


def pune(id_, ok, **d):
    R[id_] = {"ok": bool(ok), **d}


VIZ = """a=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="'+a+'"]');if(!e)return null;
 const b=e.getBoundingClientRect();const g=document.querySelector('[data-lh-aplicatie] [data-lh-zona]').getBoundingClientRect();
 const inZona=b.top>=g.top-1&&b.bottom<=g.bottom+1&&b.left>=g.left-1&&b.right<=g.right+1;
 const t=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);
 const bv=document.querySelector('[data-lh-aplicatie] .lh-ap-x-db-v');const v=bv&&bv.getClientRects().length?bv.getBoundingClientRect():null;
 return {x:Math.round(b.left),y:Math.round(b.top),in_zona:inZona,deasupra:!!(t&&(t===e||e.contains(t))),langa_bara:!v||b.right<=v.left+1}}"""
FOC = "()=>{const a=document.activeElement;return a?{tag:a.tagName,in_app:!!a.closest('[data-lh-aplicatie]'),celula:(a.closest('[data-lh-tinta=\"celula\"]')||{getAttribute:()=>null}).getAttribute('data-lh-id')}:null}"
# antetele de rand si celulele care se vad in zona grilei (nu doar in DOM): „grila alba” = 0 randuri vazute
VAZUTE = """()=>{const g=document.querySelector('[data-lh-aplicatie] [data-lh-zona]').getBoundingClientRect();
 const ar=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ant-r').getBoundingClientRect();
 const rn=[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-ant-rand')].filter(e=>{const b=e.getBoundingClientRect();return b.height>0&&b.top>=ar.top-1&&b.bottom<=ar.bottom+1}).map(e=>e.textContent);
 const cn=[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-ant-col')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.left>=g.left-1&&b.right<=g.right+1}).map(e=>e.textContent);
 const cel=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta="celula"]')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.top>=g.top-1&&b.bottom<=g.bottom+1&&b.left>=g.left-1&&b.right<=g.right+1}).length;
 const tot=document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta="celula"]').length;
 /* numarul randului se citeste intreg (nu taiat de latimea antetului) */
 const tai=[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-ant-rand')].filter(e=>e.scrollWidth>e.clientWidth+1).length;
 return {randuri:rn.length,primul:rn[0]||null,ultimul:rn[rn.length-1]||null,coloane:cn.length,col_prima:cn[0]||null,col_ultima:cn[cn.length-1]||null,celule_vazute:cel,celule_dom:tot,antete_taiate:tai}}"""
TAB7 = {"A1": 1, "A2": 2, "A3": 3, "A4": 4, "A5": 5, "A6": 6, "A7": 7, "B7": 8, "C7": 9}


def ultim_ev(s):
    e = ultimele_ev(s, 1)
    return e[-1] if e else None


def g17_1():
    s = Sesiune(1366, 768)
    K = s.page.keyboard
    try:
        deschide_cu(s, {"celule": TAB7, "selectie": "A1"})
        clic_cel(s, "A7"); ev_reset(s); K.press("Control+ArrowDown"); s.page.wait_for_timeout(300)
        v, e, vz = s.ev(VIZ, "A1048576"), ultim_ev(s), s.ev(VAZUTE)
        s.shot("g1_ctrl_jos.png", clip={"x": 0, "y": 150, "width": 760, "height": 618})
        pune("G1.1_ctrl_jos_celula_vazuta", s.stare().get("selectie", {}).get("activa") == "A1048576" and nume_box(s) == "A1048576" and v and v["in_zona"] and v["deasupra"],
             sel=s.stare().get("selectie"), nb=nume_box(s), cel=v)
        pune("G1.2_ctrl_jos_grila_cu_randuri", vz["randuri"] >= 10 and vz["ultimul"] == "1048576" and vz["celule_vazute"] >= 100 and vz["antete_taiate"] == 0, vazute=vz)
        pune("G1.3_ctrl_jos_eveniment_tinta_focus", bool(e) and e["tinta"] == "celula:A1048576" and s.ev(FOC)["in_app"], ev=e, foc=s.ev(FOC))
        ev_reset(s); K.type("5"); s.page.wait_for_timeout(150); e = ultim_ev(s)
        pune("G1.4_tastare_tinta", bool(e) and e["tinta"] == "celula:A1048576" and e["actiune"] != "fara_efect", ev=e)
        ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(400); e = ultim_ev(s)
        st_ = cel(s, "A1048576")["A1048576"] or {}
        pune("G1.5_enter_stare_egal_ecran", st_.get("valoare") == 5 and ecran(s, "A1048576") == "5" and (s.ev(VIZ, "A1048576") or {}).get("deasupra")
             and s.ev(FOC)["in_app"] and bool(e) and str(e["tinta"]).startswith("celula:"),
             stare=st_, ecran=ecran(s, "A1048576"), cel=s.ev(VIZ, "A1048576"), foc=s.ev(FOC), ev=e, vazute=s.ev(VAZUTE))
        s.shot("g1_ctrl_jos_tastat.png", clip={"x": 0, "y": 150, "width": 760, "height": 618})
        pune("G1.6_dom_marginit", s.ev(VAZUTE)["celule_dom"] <= 20000, celule_dom=s.ev(VAZUTE)["celule_dom"])
        ev_reset(s); K.press("Control+ArrowUp"); s.page.wait_for_timeout(300); e = ultim_ev(s)
        pune("G1.7_ctrl_sus_inapoi", s.stare()["selectie"]["activa"] == "A7" and bool(e) and e["tinta"] == "celula:A7" and (s.ev(VIZ, "A7") or {}).get("deasupra"),
             sel=s.stare()["selectie"], ev=e, cel=s.ev(VIZ, "A7"), celule_dom=s.ev(VAZUTE)["celule_dom"])
        K.press("Control+ArrowDown"); s.page.wait_for_timeout(300)
        jos2 = s.stare()["selectie"]["activa"]
        ev_reset(s); K.press("ArrowUp"); s.page.wait_for_timeout(300); e = ultim_ev(s)
        pune("G1.8_sageata_sus", jos2 == "A1048576" and s.stare()["selectie"]["activa"] == "A1048575" and bool(e) and e["tinta"] == "celula:A1048575"
             and (s.ev(VIZ, "A1048575") or {}).get("deasupra"), jos2=jos2, sel=s.stare()["selectie"], ev=e)
        ev_reset(s); K.press("Control+Home"); s.page.wait_for_timeout(300); e = ultim_ev(s)
        pune("G1.9_ctrl_home", s.stare()["selectie"]["activa"] == "A1" and bool(e) and e["tinta"] == "celula:A1" and (s.ev(VIZ, "A1") or {}).get("deasupra")
             and s.ev(VAZUTE)["primul"] == "1", sel=s.stare()["selectie"], ev=e, vazute=s.ev(VAZUTE))
        clic_cel(s, "C7"); ev_reset(s); K.press("Control+ArrowRight"); s.page.wait_for_timeout(300); e = ultim_ev(s); vz = s.ev(VAZUTE)
        s.shot("g1_ctrl_dreapta.png", clip={"x": 0, "y": 150, "width": 1366, "height": 618})
        pune("G1.10_ctrl_dreapta_XFD7", s.stare()["selectie"]["activa"] == "XFD7" and (s.ev(VIZ, "XFD7") or {}).get("deasupra") and (s.ev(VIZ, "XFD7") or {}).get("langa_bara")
             and bool(e) and e["tinta"] == "celula:XFD7"
             and vz["col_ultima"] == "XFD", sel=s.stare()["selectie"], cel=s.ev(VIZ, "XFD7"), ev=e, vazute=vz)
        ev_reset(s); K.press("Control+ArrowLeft"); s.page.wait_for_timeout(300); e = ultim_ev(s)
        pune("G1.11_ctrl_stanga_inapoi", s.stare()["selectie"]["activa"] == "C7" and bool(e) and e["tinta"] == "celula:C7" and (s.ev(VIZ, "C7") or {}).get("deasupra"),
             sel=s.stare()["selectie"], ev=e)
        # clic cu mouse-ul pe o celula vazuta langa A1048576, apoi Ctrl+Home (iesirea criticului, p6.py › a)
        K.press("Control+Home"); clic_cel(s, "A7"); K.press("Control+ArrowDown"); s.page.wait_for_timeout(300)
        ev_reset(s); clic_cel(s, "B1048570"); s.page.wait_for_timeout(200); e = ultim_ev(s)
        pune("G1.12_clic_langa_capat", s.stare()["selectie"]["activa"] == "B1048570" and bool(e) and e["tinta"] == "celula:B1048570", sel=s.stare()["selectie"], ev=e)
        # un grafic inserat in fereastra se vede acolo; dupa Ctrl+Home nu lungeste derularea grilei normale
        GRAF = "()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-grafic')].map(e=>{const b=e.getBoundingClientRect();const g=document.querySelector('[data-lh-aplicatie] [data-lh-zona]');const z=g.getBoundingClientRect();return {vede:!!e.getClientRects().length&&b.bottom>z.top&&b.top<z.bottom&&b.right>z.left&&b.left<z.right,sh:g.scrollHeight}})"
        fila_x(s, "Insert"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]'); s.page.wait_for_timeout(300)
        rand(s, "lista.ChartTypeColumnInsertGallery", "Clustered Column"); s.page.wait_for_timeout(400)
        g_in = s.ev(GRAF)
        clic_cel(s, "A1048575"); s.page.wait_for_timeout(200); K.press("Control+Home"); s.page.wait_for_timeout(400)
        g_home = s.ev(GRAF)
        pune("G1.13_grafic_in_fereastra", len(g_in) == 1 and g_in[0]["vede"] and len(g_home) == 1 and not g_home[0]["vede"] and g_home[0]["sh"] < 5000
             and s.stare()["selectie"]["activa"] == "A1", in_fereastra=g_in, dupa_home=g_home, n=len(s.stare().get("grafice") or []))
        pune("G1.0_erori_pagina", not s.erori, erori=s.erori)
    except Exception:
        pune("G1.exceptie", False, tb=traceback.format_exc()[-1500:], erori=s.erori)
    finally:
        s.gata()


def tras_deget(cdp, s, x0, y0, dx, dy, n=12):
    cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y0}]})
    for i in range(1, n + 1):
        cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 + dx * i, "y": y0 + dy * i}]}); s.page.wait_for_timeout(30)
    cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []}); s.page.wait_for_timeout(400)


DERULARE = "()=>{const c=document.querySelector('[data-lh-aplicatie] [data-lh-zona]');return [Math.round(c.scrollLeft),Math.round(c.scrollTop)]}"
EV_STARE = "()=>(window.__lhAplicatieEv||[]).map(e=>({gest:e.gest,actiune:e.actiune,tinta:e.tinta,sel_ina:JSON.stringify((e.inainte||{}).selectie),sel_dupa:JSON.stringify((e.dupa||{}).selectie)}))"


def g17_2():
    s = Sesiune(375, 667, mobil=True)
    cdp = s.ctx.new_cdp_session(s.page)
    try:
        deschide_cu(s, {"celule": LUNI, "selectie": "A1"})
        ev_reset(s); s.page.touchscreen.tap(*s.ev(CEL, "A1")); s.page.wait_for_timeout(300); e = ultim_ev(s)
        pune("G2.1_atingere_A1", s.stare()["selectie"]["activa"] == "A1" and bool(e) and e["actiune"] == "selectare_celula" and e["tinta"] == "celula:A1", ev=e)
        c7 = s.ev(CEL, "C7"); d0 = s.ev(DERULARE); ev_reset(s)
        tras_deget(cdp, s, c7[0], c7[1], -14, -6)
        evs = s.ev(EV_STARE); d1 = s.ev(DERULARE)
        schimbate = [x for x in evs if x["sel_ina"] != x["sel_dupa"]]
        pune("G2.2_deget_C7_stanga_sus", s.stare()["selectie"]["activa"] == "A1" and d1 != d0, sel=s.stare()["selectie"], derulare=[d0, d1], ev=evs, ev_cu_selectia_schimbata=len(schimbate))
        # p2c › 2_deget_grila: atingere pe C6, apoi degetul pe B7 tras in sus (derulare verticala)
        s.page.touchscreen.tap(*s.ev(CEL, "C6")); s.page.wait_for_timeout(300)
        b7 = s.ev(CEL, "B7"); d0 = s.ev(DERULARE); ev_reset(s)
        tras_deget(cdp, s, b7[0], b7[1], -2, -12)
        evs = s.ev(EV_STARE); d1 = s.ev(DERULARE)
        pune("G2.3_deget_B7_sus", s.stare()["selectie"]["activa"] == "C6" and d1 != d0, sel=s.stare()["selectie"], derulare=[d0, d1], ev=evs)
        # atingerea scurta dupa derulare: o celula aflata acum in zona grilei
        tinta = s.ev("""()=>{const g=document.querySelector('[data-lh-aplicatie] [data-lh-zona]').getBoundingClientRect();
          const c=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta="celula"]')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.left>=g.left+2&&b.right<=g.right-2&&b.top>=g.top+2&&b.bottom<=g.bottom-2});
          const e=c[Math.floor(c.length/2)];if(!e)return null;const b=e.getBoundingClientRect();return [e.getAttribute('data-lh-id'),b.x+b.width/2,b.y+b.height/2]}""")
        ev_reset(s)
        if tinta: s.page.touchscreen.tap(tinta[1], tinta[2]); s.page.wait_for_timeout(300)
        e = ultim_ev(s)
        pune("G2.4_atingere_dupa_derulare", bool(tinta) and s.stare()["selectie"]["activa"] == tinta[0] and bool(e) and e["actiune"] == "selectare_celula" and e["tinta"] == "celula:" + tinta[0],
             tinta=tinta and tinta[0], sel=s.stare()["selectie"], ev=s.ev(EV_STARE))
        # tastatura telefonului dupa atingere (regres, p6.py › b_tel): B3, „10”, Enter
        s.ev("()=>{const c=document.querySelector('[data-lh-aplicatie] [data-lh-zona]');c.scrollLeft=0;c.scrollTop=0}"); s.page.wait_for_timeout(200)
        s.page.touchscreen.tap(*s.ev(CEL, "B3")); s.page.wait_for_timeout(300); ev_reset(s)
        cdp.send("Input.insertText", {"text": "10"}); s.page.wait_for_timeout(150); s.page.keyboard.press("Enter"); s.page.wait_for_timeout(300)
        evs = ultimele_ev(s, 3)
        pune("G2.5_tastare_dupa_atingere", (cel(s, "B3")["B3"] or {}).get("valoare") == 10 and ecran(s, "B3") == "10" and s.stare()["selectie"]["activa"] == "B4"
             and any(x["tinta"] == "celula:B3" and x["gest"] == "tastare" for x in evs), B3=cel(s, "B3"), ecran=ecran(s, "B3"), ev=evs)
        # dubla atingere = editarea celulei (ca dublul clic), cu evenimentele clic, clic, dublu_clic
        ev_reset(s); p = s.ev(CEL, "A3"); s.page.touchscreen.tap(*p); s.page.wait_for_timeout(120); s.page.touchscreen.tap(*p); s.page.wait_for_timeout(400)
        evs = ultimele_ev(s, 4)
        pune("G2.6_dubla_atingere", [x["gest"] for x in evs][-3:] == ["clic", "clic", "dublu_clic"] and s.stare()["selectie"]["activa"] == "A3", ev=evs, ed=s.stare().get("ramane_in_editare"))
        pune("G2.0_erori_pagina", not s.erori, erori=s.erori)
    except Exception:
        pune("G2.exceptie", False, tb=traceback.format_exc()[-1500:], erori=s.erori)
    finally:
        s.gata()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire", default=P + ("proba_grav_vechi.json" if VECHI else "proba_grav.json"))
    a = ap.parse_args()
    g17_1()
    g17_2()
    json.dump({"vechi": VECHI, "rezultate": R}, open(a.iesire, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    picate = [k for k, v in R.items() if not v["ok"]]
    for k, v in R.items():
        print(("ok    " if v["ok"] else "PICAT ") + k)
    print("picate:", ", ".join(picate) if picate else "-")
    print(len(picate))
