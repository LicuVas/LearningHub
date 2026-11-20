# -*- coding: utf-8 -*-
"""Runda 17 (B-excel#2): proba GRAV-urilor X10, A1, T1 din runde/10/critic.md, pe codul de azi.
Headless, server 127.0.0.1 pe port liber, rețeaua tăiată în afară de 127.0.0.1/localhost (h17.py, copiat din criticul 10).
    python proba_grav.py --iesire <fisier.json>      # ultima linie = numărul verificărilor picate
Referințele: uia_excel.json › lista.ChartTypeLineInsertGallery, lista.AddChartElementMenu, lista.AddChartElementMenu#Data Labels
(+ #Clustered Column), acoperire_r14.fapte.x_line / y_data_labels_line / z_data_labels_coloana; scenarii_real/excel-grafic-*."""
import argparse, json, sys, traceback
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/17/proba")
from h17 import *

ATELIER = {"A1": "Clasa", "B1": "miercuri", "C1": "joi", "D1": "vineri", "A2": "8A", "B2": 45, "C2": 60, "D2": 90, "A3": "8B", "B3": 50,
           "C3": 42, "D3": 80, "A4": "8C", "B4": 38, "C4": 66, "D4": 72, "A5": "8D", "B5": 55, "C5": 48, "D5": 70}
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9, "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}
LUNI = {"A1": "Luna", "B1": "8A", "C1": "8B", "A2": "septembrie", "B2": 12, "C2": 9, "A3": "octombrie", "B3": 18, "C3": 14, "A4": "noiembrie", "B4": 25, "C4": 20, "A5": "decembrie", "B5": 15, "C5": 22}
LINE_REF = ["Line", "Stacked Line", "100% Stacked Line", "Line with Markers", "Stacked Line with Markers", "100% Stacked Line with Markers", "3-D Line",
            "Area", "Stacked Area", "100% Stacked Area", "3-D Area", "3-D Stacked Area", "3-D 100% Stacked Area"]
ACE_REF = ["Axes", "Axis Titles", "Chart Title", "Data Labels", "Data Table", "Error Bars", "Gridlines", "Legend", "Lines", "Trendline", "Up/Down Bars"]
DL_LINE = ["None", "Center", "Left", "Right", "Above", "Below", "Data Callout"]
DL_COL = ["None", "Center", "Inside End", "Inside Base", "Outside End", "Data Callout"]
R = {}


def pune(id_, ok, **d):
    R[id_] = {"ok": bool(ok), **d}


SUP = "[data-lh-aplicatie] [data-lh-suprafata=\"%s\"]"
RANDURI = """s=>{const m=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!m)return null;
 return [...m.querySelectorAll('[data-lh-tip="ListItem"],[data-lh-tip="MenuItem"]')].filter(e=>e.getClientRects().length).map(e=>[e.getAttribute('data-lh-eticheta'),e.getAttribute('aria-disabled')==='true'||e.classList.contains('lh-ap-gri')])}"""
ETICHETE = "()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-grafic [data-lh-eticheta-date]')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim())"


def gstare(s):
    x = s.stare()
    return {k: x.get(k) for k in ("tip_grafic", "serii_grafic", "categorii_grafic", "etichete_date")}


def clic_tinta(s, sel):
    return clic_el(s, sel)


def pc_line(s, continut, zona):
    deschide_cu(s, {"celule": continut, "selectie": zona})
    ev_reset(s)
    clic_tinta(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
    clic_tinta(s, '[data-lh-aplicatie] [data-lh-suprafata="panglica.TabInsert"] [data-lh-id-mso="ChartTypeLineInsertGallery"]')
    return ultimele_ev(s, 1)


def x10_pc():
    s = Sesiune(1366, 768)
    try:
        e0 = pc_line(s, ATELIER, "A1:D5")
        rs = s.ev(RANDURI, SUP % "lista.ChartTypeLineInsertGallery") or []
        grupuri = s.ev("s=>{const m=document.querySelector(s);return m?[...m.querySelectorAll('[data-lh-tip=\"Group\"]')].map(e=>(e.getAttribute('data-lh-eticheta')||'').trim()).filter(Boolean):null}", SUP % "lista.ChartTypeLineInsertGallery")
        pune("X10.1_galeria_line", [r[0] for r in rs] == LINE_REF + ["More Line Charts..."] and grupuri == ["2-D Line", "3-D Line", "2-D Area", "3-D Area"]
             and e0 and e0[-1]["actiune"] != "nesimulat", randuri=[r[0] for r in rs], grupuri=grupuri, ev=e0, mesaj=mesaj_tot(s))
        ev_reset(s)
        clic_tinta(s, (SUP % "lista.ChartTypeLineInsertGallery") + ' [data-lh-eticheta="Line"]')
        g = gstare(s); e1 = ultimele_ev(s, 1)
        pune("X10.2_line_inserat", g["tip_grafic"] == "Line" and g["serii_grafic"] == ["miercuri", "joi", "vineri"] and g["categorii_grafic"] == ["8A", "8B", "8C", "8D"]
             and e1 and e1[-1]["actiune"] == "inserare_grafic", stare=g, ev=e1)
        ev_reset(s)
        clic_tinta(s, '[data-lh-aplicatie] [data-lh-id-mso="AddChartElementMenu"]')
        rs = s.ev(RANDURI, SUP % "lista.AddChartElementMenu") or []
        gri = sorted(r[0] for r in rs if r[1])
        pune("X10.3_add_chart_element", [r[0] for r in rs] == ACE_REF and gri == ["Lines", "Up/Down Bars"] and ultimele_ev(s, 1)[-1]["actiune"] != "nesimulat",
             randuri=rs, ev=ultimele_ev(s, 1), mesaj=mesaj_tot(s))
        ev_reset(s)
        clic_tinta(s, (SUP % "lista.AddChartElementMenu") + ' [data-lh-eticheta="Data Labels"]')
        rs = s.ev(RANDURI, SUP % "lista.AddChartElementMenu#Data Labels") or []
        pune("X10.4_data_labels_line", [r[0] for r in rs] == DL_LINE + ["More Data Label Options..."], randuri=[r[0] for r in rs], ev=ultimele_ev(s, 1))
        ev_reset(s)
        clic_tinta(s, (SUP % "lista.AddChartElementMenu#Data Labels") + ' [data-lh-eticheta="Right"]')
        g = gstare(s); et = s.ev(ETICHETE); e2 = ultimele_ev(s, 1)
        pune("X10.5_right", g["etichete_date"] == {"miercuri": "Right", "joi": "Right", "vineri": "Right"} and sorted(et) == sorted(str(v) for k, v in ATELIER.items() if isinstance(v, int))
             and e2 and e2[-1]["tinta"] == "meniu:Right", stare=g, etichete_pe_ecran=et, ev=e2)
        k(s, "Control+z", w=250)
        pune("X10.6_ctrl_z_scoate_etichetele", (gstare(s)["etichete_date"] or {}) == {"miercuri": None, "joi": None, "vineri": None}, stare=gstare(s))
        # coloane (CARTI): lista Data Labels a coloanelor
        deschide_cu(s, {"celule": CARTI, "selectie": "A1:B6"})
        clic_tinta(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
        clic_tinta(s, '[data-lh-aplicatie] [data-lh-suprafata="panglica.TabInsert"] [data-lh-id-mso="ChartTypeColumnInsertGallery"]')
        clic_tinta(s, (SUP % "lista.ChartTypeColumnInsertGallery") + ' [data-lh-eticheta="Clustered Column"]')
        clic_tinta(s, '[data-lh-aplicatie] [data-lh-id-mso="AddChartElementMenu"]')
        clic_tinta(s, (SUP % "lista.AddChartElementMenu") + ' [data-lh-eticheta="Data Labels"]')
        rs = s.ev(RANDURI, SUP % "lista.AddChartElementMenu#Data Labels#Clustered Column") or []
        clic_tinta(s, (SUP % "lista.AddChartElementMenu#Data Labels#Clustered Column") + ' [data-lh-eticheta="Outside End"]')
        g = gstare(s); et = s.ev(ETICHETE)
        pune("X10.7_coloane_outside_end", [r[0] for r in rs] == DL_COL + ["More Data Label Options..."] and g["tip_grafic"] == "Clustered Column"
             and g["etichete_date"] == {"Cărți citite": "Outside End"} and sorted(et) == ["3", "4", "6", "7", "9"], randuri=[r[0] for r in rs], stare=g, etichete_pe_ecran=et)
        # tastele: Alt, N, N, 1 -> galeria; ↓, Enter -> Line; Alt, J, C, A, D, R -> Right
        deschide_cu(s, {"celule": ATELIER, "selectie": "A1:D5"})
        ev_reset(s)
        taste = ["Alt", "n", "n", "1", "ArrowDown", "Enter"]
        k(s, *taste, w=200)
        ev = ultimele_ev(s, 20); g = gstare(s)
        pune("X10.8_taste_line", g["tip_grafic"] == "Line" and g["serii_grafic"] == ["miercuri", "joi", "vineri"] and len(ev) == len(taste),
             stare=g, ev=ev, nr_taste=len(taste))
        ev_reset(s)
        taste = ["Alt", "j", "c", "a", "d", "r"]
        k(s, *taste, w=200)
        ev = ultimele_ev(s, 20); g = gstare(s)
        pune("X10.9_taste_right", g["etichete_date"] == {"miercuri": "Right", "joi": "Right", "vineri": "Right"} and len(ev) == len(taste)
             and ev[-1]["tinta"] == "meniu:Right", stare=g, ev=ev, keytips=keytips(s))
        # drumul laboratorului m2-l11 pe calculator (LUNI): Line, etichete Right, C5 = 30 -> eticheta arată 30
        e0 = pc_line(s, LUNI, "A1:C5")
        clic_tinta(s, (SUP % "lista.ChartTypeLineInsertGallery") + ' [data-lh-eticheta="Line"]')
        clic_tinta(s, '[data-lh-aplicatie] [data-lh-id-mso="AddChartElementMenu"]')
        clic_tinta(s, (SUP % "lista.AddChartElementMenu") + ' [data-lh-eticheta="Data Labels"]')
        clic_tinta(s, (SUP % "lista.AddChartElementMenu#Data Labels") + ' [data-lh-eticheta="Right"]')
        # mutarea graficului de margine spre dreapta, ca lecția (m2-l11:64), apoi C5
        b = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-grafic');if(!e)return null;const q=e.getBoundingClientRect();return [q.left,q.top,q.width]}")
        if b:
            s.page.mouse.move(b[0] + 6, b[1] + 4); s.page.mouse.down(); s.page.mouse.move(b[0] + 500, b[1] + 4, steps=10); s.page.mouse.up(); s.page.wait_for_timeout(250)
        scrie(s, "C5", "30")
        et = s.ev(ETICHETE); g = gstare(s)
        pune("X10.10_lab_m2l11_pc", g["tip_grafic"] == "Line" and g["serii_grafic"] == ["8A", "8B"] and "30" in et and (s.stare()["celule"].get("C5") or {}).get("valoare") == 30,
             stare=g, etichete_pe_ecran=et, erori=s.erori)
        pune("X10.0_erori_pagina", not s.erori, erori=s.erori)
    finally:
        s.gata()


def telefon():
    s = Sesiune(375, 667, mobil=True)
    cdp = s.ctx.new_cdp_session(s.page)

    def centru(sel):
        return s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)

    def tap(sel):
        s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(e)e.scrollIntoView({block:'nearest',inline:'nearest'})}", sel); s.page.wait_for_timeout(150)
        b = centru(sel)
        if b: s.page.touchscreen.tap(*b); s.page.wait_for_timeout(350)
        return b

    def gr():
        g = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-grafic');if(!e)return null;const q=e.getBoundingClientRect();return [Math.round(q.left),Math.round(q.top),Math.round(q.width),Math.round(q.height)]}")
        return {"rect": g, "poz": [x.get("pozitie") for x in (s.stare().get("grafice") or [])]}

    def insereaza():
        tap('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A1"]')
        tap('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
        tap('[data-lh-aplicatie] [data-lh-suprafata="panglica.TabInsert"] [data-lh-id-mso="ChartTypeLineInsertGallery"]')
        if tap((SUP % "lista.ChartTypeLineInsertGallery") + ' [data-lh-eticheta="Line"]'):
            return "Line"
        gol_mesaj(s)
        tap('[data-lh-aplicatie] [data-lh-suprafata="panglica.TabInsert"] [data-lh-id-mso="ChartTypeColumnInsertGallery"]')
        tap((SUP % "lista.ChartTypeColumnInsertGallery") + ' [data-lh-eticheta="Clustered Column"]')
        return "Clustered Column (Line nu se poate insera)"

    def sub(xy):
        return s.ev("([x,y])=>{const e=document.elementFromPoint(x,y);const t=e&&e.closest('[data-lh-tinta]');return t?(t.getAttribute('data-lh-tinta')+':'+(t.getAttribute('data-lh-id')||'')):null}", xy)
    try:
        deschide_cu(s, {"celule": LUNI, "selectie": "A1"})
        tip = insereaza()
        g0 = gr()
        # A1: tragerea cu degetul de marginea albă, spre dreapta, până la marginea ecranului (m2-l11:64)
        x0, y0 = g0["rect"][0] + 14, g0["rect"][1] + 4
        ev_reset(s)
        cdp.send("Input.dispatchTouchEvent", {"type": "touchStart", "touchPoints": [{"x": x0, "y": y0}]})
        for i in range(1, 16):
            cdp.send("Input.dispatchTouchEvent", {"type": "touchMove", "touchPoints": [{"x": x0 + (360 - x0) * i / 15, "y": y0}]}); s.page.wait_for_timeout(30)
        cdp.send("Input.dispatchTouchEvent", {"type": "touchEnd", "touchPoints": []}); s.page.wait_for_timeout(400)
        g1 = gr(); e1 = ultimele_ev(s, 3)
        dx = (g1["poz"][0]["x"] - g0["poz"][0]["x"]) if g0["poz"] and g1["poz"] else 0
        pune("A1.1_tragere_deget", dx > 150 and any(e["actiune"] == "mutare_grafic" for e in e1), tip=tip, inainte=g0, dupa=g1, dx_grila=dx, ev=e1)
        c5 = s.ev(CEL, "C5"); su = sub(c5)
        ev_reset(s); s.page.touchscreen.tap(*c5); s.page.wait_for_timeout(350)
        cdp.send("Input.insertText", {"text": "30"}); s.page.keyboard.press("Enter"); s.page.wait_for_timeout(350)
        c = (s.stare()["celule"].get("C5") or {}).get("valoare")
        pune("A1.2_C5_30_dupa_mutare", su == "celula:C5" and c == 30, sub_C5=su, C5=c, ev=ultimele_ev(s, 3))
        # T1: titlul atins, literele de pe tastatura telefonului (insertText) -> ținta grafic:1/titlu
        tap('[data-lh-aplicatie] .lh-ap-x-grafic [data-lh-tinta$="/titlu"]')   # derulează grila până se vede titlul, apoi îl atinge
        s.ev("()=>{window.__as=LH.aplicatii.asistent('excel',{pasi:[{tinta:'grafic:1/titlu',indiciu:'Scrie titlul'}],dupaGreseli:2,dupaSecunde:300})}")
        ev_reset(s)
        for ch in ["C", "ă", "r"]:
            cdp.send("Input.insertText", {"text": ch}); s.page.wait_for_timeout(120)
        e2 = ultimele_ev(s, 3)
        ind = s.ev("()=>[...document.querySelectorAll('[data-lh-indiciu]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-pentru'))")
        pune("T1.1_litere_titlu_tinta", len(e2) == 3 and all(e["tinta"] == "grafic:1/titlu" for e in e2), ev=e2)
        pune("T1.2_asistent_fara_indiciu", s.ev("()=>window.__as.pas()") == 1 and not ind, pas=s.ev("()=>window.__as.pas()"), indiciu=ind)
        s.ev("()=>window.__as.opreste()")
        s.page.keyboard.press("Enter"); s.page.wait_for_timeout(300)
        titlu = [x.get("titlu") for x in s.stare().get("grafice") or []]
        # graficul ales (nu titlul): „30” -> ținta grafic:1
        s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-grafic');if(e)e.scrollIntoView({block:'nearest',inline:'start'})}"); s.page.wait_for_timeout(200)
        g = gr()["rect"]
        s.page.touchscreen.tap(min(370, max(5, g[0] + 20)), g[1] + g[3] // 2); s.page.wait_for_timeout(350)   # desenul n-are evenimente: atingerea e a cutiei
        ev_reset(s); cdp.send("Input.insertText", {"text": "30"}); s.page.wait_for_timeout(200)
        e3 = ultimele_ev(s, 1)
        pune("T1.3_grafic_ales_tinta", e3 and e3[-1]["tinta"] == "grafic:1" and titlu == ["Căr"], ev=e3, titlu=titlu, ales=s.stare().get("grafic_element_ales"))
        pune("T1.0_erori_pagina", not s.erori, erori=s.erori)
    finally:
        s.gata()


def paritate():
    """T1, asistentul criticului 10 (pasul 2 cu asteapta: titlu_grafic): telefonul trebuie să dea ACELAȘI rezultat ca calculatorul."""
    out = {}
    for nume, w, h, mob in [("pc", 1366, 768, False), ("tel", 375, 667, True)]:
        s = Sesiune(w, h, mobil=mob)
        cdp = s.ctx.new_cdp_session(s.page)
        def ia(sel):
            s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(e)e.scrollIntoView({block:'nearest',inline:'nearest'})}", sel); s.page.wait_for_timeout(150)
            b = s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
            if b:
                if mob: s.page.touchscreen.tap(*b)
                else: s.page.mouse.click(*b)
                s.page.wait_for_timeout(350)
        try:
            deschide_cu(s, {"celule": LUNI, "selectie": "A1:C5"})
            ia('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
            ia('[data-lh-aplicatie] [data-lh-suprafata="panglica.TabInsert"] [data-lh-id-mso="ChartTypeColumnInsertGallery"]')
            ia((SUP % "lista.ChartTypeColumnInsertGallery") + ' [data-lh-eticheta="Clustered Column"]')
            s.ev("()=>{window.__as=LH.aplicatii.asistent('excel',{pasi:[{tinta:'grafic:1/titlu',indiciu:'Atinge titlul'},{tinta:'grafic:1/titlu',indiciu:'Scrie titlul si apasa Enter',asteapta:e=>e.actiune==='titlu_grafic'}],dupaGreseli:2,dupaSecunde:300})}")
            ia('[data-lh-aplicatie] .lh-ap-x-grafic [data-lh-tinta$="/titlu"]')
            for ch in ["C", "a", "r"]:
                if mob: cdp.send("Input.insertText", {"text": ch})
                else: s.page.keyboard.press(ch)
                s.page.wait_for_timeout(120)
            out[nume] = {"tinte": [e["tinta"] for e in ultimele_ev(s, 3)], "indiciu": s.ev("()=>document.querySelectorAll('[data-lh-indiciu]').length"), "pas": s.ev("()=>window.__as.pas()")}
        finally:
            s.gata()
    pune("T1.4_paritate_pc_telefon", out.get("pc") == out.get("tel"), **out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire", required=True)
    a = ap.parse_args()
    for f in (x10_pc, telefon, paritate):
        try:
            f()
        except Exception:
            pune("EXCEPTIE_" + f.__name__, False, tb=traceback.format_exc()[-1500:])
    json.dump(R, open(a.iesire, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    picate = [k for k, v in R.items() if not v["ok"]]
    for k_ in sorted(R):
        print(("ok   " if R[k_]["ok"] else "PICĂ ") + k_)
    print("picate: %d din %d" % (len(picate), len(R)))
    print(len(picate))


if __name__ == "__main__":
    main()
