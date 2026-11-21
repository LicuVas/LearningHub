# -*- coding: utf-8 -*-
"""Runda 25 (B-excel#2, unghiul gest_tastatura): proba țintelor din supliment_B_excel_runda25.md, pe codul de azi.
Headless, server 127.0.0.1 pe port liber, rețeaua tăiată în afară de 127.0.0.1/localhost (proba/hc25.py).
    python proba_grav.py --iesire <fisier.json>              # codul de azi; ultima linie = numărul verificărilor picate
    LH_VECHI=1 python proba_grav.py --iesire <fisier.json>   # codul de dinainte de rundă (runde/25/inainte/), servit prin rută
F = fereastra de 150 de rânduri (R21-2 + MINOR 1-3 din runde/21/critic.md), gesturile criticului 21 (critic_probe/pA.py › 7-12, pA2.py › a, b);
M = MINOR 5-6 (grila față de uia_excel.json › zona_document; numele bucăților barelor);
N = grila normală rămâne cum era (regres)."""
import argparse, json, os, sys, traceback
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/25/proba")
from hc25 import *

R = {}
T = {"A1": 1, "A2": 2, "A3": 3, "A4": 4, "A5": 5, "A6": 6, "A7": 7, "B7": 8, "C7": 9}


def pune(id_, ok, **d):
    R[id_] = {"ok": bool(ok), **d}


def la_jos(s):
    """Ctrl+Home, clic A7, Ctrl+↓ → A1048576 (scenariul excel-ctrl-jos-ultimul-rand)"""
    s.page.keyboard.press("Control+Home"); s.page.wait_for_timeout(300)
    clic_cel(s, "A7"); s.page.keyboard.press("Control+ArrowDown"); s.page.wait_for_timeout(500)


def la_adresa(s, a):
    nb = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-nume input')||document.querySelector('[data-lh-aplicatie] [data-lh-eticheta=\"Name Box\"] input');const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2]}")
    s.page.mouse.click(*nb); s.page.wait_for_timeout(150); s.page.keyboard.press("Control+a"); s.page.keyboard.type(a); s.page.keyboard.press("Enter"); s.page.wait_for_timeout(800)


def g3(s):
    g = grila(s)
    return {k: g[k] for k in ("prim", "ult", "sus_gol", "jos_gol", "gaps", "nonc", "nealin", "st", "sh", "chh", "n")}


def curat(g):
    return not g["gaps"] and not g["nonc"] and not g["nealin"]


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--iesire", required=True); a = ap.parse_args()
    s = Sesiune(); K = s.page.keyboard
    try:
        deschide_cu(s, {"celule": T, "selectie": "A1"})
        # ---- N: grila normală (A1): rotița jos și înapoi sus nu mută nimic altceva decât derularea
        g0 = g3(s); roata(s, 600, n=3); g1 = g3(s); roata(s, -600, n=3); g2 = g3(s)
        pune("N1_grila_normala_rotita", g0["n"] == g2["n"] and g2["prim"] == 1 and g1["prim"] > 1 and curat(g1), inainte=g0, jos=g1, sus=g2)
        # ---- F1: Ctrl+↓
        la_jos(s); x = act(s)
        pune("F1_ctrl_jos", x.get("id") == "A1048576" and x.get("intreaga"), act=x)
        # ---- F2/F3: rotița în sus din A1048576, 12 crestături de 600 px
        ev_reset(s); pasi = []
        for k in range(12):
            roata(s, -600, n=1, w=250); pasi.append(g3(s))
        pr = [p["prim"] for p in pasi]; d = [pr[i - 1] - pr[i] for i in range(1, len(pr))]
        evs = ev_toate(s)
        pune("F2_rotita_trece_de_fereastra", all(curat(p) for p in pasi) and all(25 <= x <= 38 for x in d) and pr[-1] < 1048427 - 100,
             prim=pr, delta=d, probleme=[p for p in pasi if not curat(p)][:2])
        pune("F3_rotita_eveniment_selectie", bool(evs) and all(e[0] == "rotita" and e[1] == "derulare" for e in evs) and s.stare().get("selectie", {}).get("activa") == "A1048576",
             ev=evs[-3:], n_ev=len(evs), sel=s.stare().get("selectie"))
        # ---- F4: rotița urcă până la rândul 1 (din A2600, în afara grilei normale = fereastra)
        K.press("Control+Home"); s.page.wait_for_timeout(300); la_adresa(s, "A2600")
        st = g3(s); drum = []
        for k in range(220):
            roata(s, -1900, n=1, w=60)
            if k % 10 == 9:
                g = g3(s); drum.append([g["prim"], curat(g)])
                if g["prim"] == 1: break
        g = g3(s)
        pune("F4_rotita_pana_la_randul_1", g["prim"] == 1 and g["sus_gol"] == 0 and all(c for _, c in drum), start=st["prim"], final=g, drum=drum[:6] + drum[-3:])
        # ---- F5: „Line up” peste marginea de sus a ferestrei (130 de clicuri din A1048576)
        la_jos(s); gp = g3(s); p0 = gp["prim"]
        # primul clic doar aliniază rândul de sus, văzut pe jumătate (sus_gol < 0; la fel în codul vechi, derulare › Line up): 129 de rânduri
        asteptat = p0 - 130 + (1 if gp["sus_gol"] is not None and gp["sus_gol"] < -0.5 else 0)
        sel_lu = '[data-lh-aplicatie] .lh-ap-x-db-v [data-lh-eticheta="Line up"]'
        b = s.ev("s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel_lu)
        for i in range(130):
            s.page.mouse.click(*b); s.page.wait_for_timeout(25)
        s.page.wait_for_timeout(300); g = g3(s)
        pune("F5_line_up_peste_margine", g["prim"] == asteptat and curat(g), prim_inainte=p0, sus_gol_inainte=gp["sus_gol"], asteptat=asteptat, prim_dupa=g["prim"], g=g)
        # ---- F6: cursorul barei verticale tras până sus → rândul 1 (bara arată locul în toată foaia)
        la_jos(s)
        cur = s.ev("()=>{const c=document.querySelector('[data-lh-aplicatie] .lh-ap-x-db-v .lh-ap-x-sb-cursor').getBoundingClientRect();const p=document.querySelector('[data-lh-aplicatie] .lh-ap-x-db-v .lh-ap-x-sb-pista').getBoundingClientRect();return [c.x+c.width/2,c.y+c.height/2,p.top,p.bottom,c.top,c.height]}")
        s.page.mouse.move(cur[0], cur[1]); s.page.mouse.down(); tr = []
        for i in range(1, 9):
            s.page.mouse.move(cur[0], cur[1] - (cur[1] - cur[2]) * i / 8 - 2); s.page.wait_for_timeout(80)
            g = g3(s); tr.append([g["prim"], curat(g)])
        s.page.mouse.up(); s.page.wait_for_timeout(200); g = g3(s)
        pune("F6_cursor_tras_sus_randul_1", g["prim"] == 1 and all(c for _, c in tr), cursor_jos=cur, drum=tr, final=g["prim"])
        # ---- F7: ↑ peste marginea de sus a ferestrei (MINOR 1): câte un rând, celula activă sus
        la_jos(s); sus = []
        for i in range(1, 153):
            K.press("ArrowUp"); s.page.wait_for_timeout(10)
            if i in (147, 148, 149, 150, 151, 152):
                s.page.wait_for_timeout(200); x = act(s); g = g3(s)
                sus.append({"i": i, "act": x.get("id"), "y": x.get("y_in_grila"), "prim": g["prim"], "curat": curat(g)})
        ok = all(sus[j]["prim"] == sus[j - 1]["prim"] - 1 and sus[j]["y"] == 0 and sus[j]["curat"] for j in range(1, len(sus)))
        pune("F7_sageata_sus_un_rand", ok, pasi=sus)
        # ---- F8: PgDn din grila normală în fereastră (MINOR 2): același pas, celula activă în același loc
        K.press("Control+Home"); s.page.wait_for_timeout(300); la_adresa(s, "A1995")
        pg = []; x = act(s); g = g3(s); pg.append({"pas": "A1995", "act": x.get("id"), "y": x.get("y_in_grila"), "prim": g["prim"]})
        for i in range(4):
            K.press("PageDown"); s.page.wait_for_timeout(700); x = act(s); g = g3(s)
            pg.append({"pas": "PgDn%d" % (i + 1), "act": x.get("id"), "y": x.get("y_in_grila"), "prim": g["prim"], "curat": curat(g)})
        dd = [pg[i]["prim"] - pg[i - 1]["prim"] for i in range(1, len(pg))]
        da = [int(pg[i]["act"][1:]) - int(pg[i - 1]["act"][1:]) for i in range(1, len(pg))]
        pune("F8_pgdn_pas_constant", len(set(dd)) == 1 and dd[0] > 0 and dd == da and len({p["y"] for p in pg}) == 1 and all(p.get("curat", True) for p in pg), pasi=pg, delta_vedere=dd, delta_celula=da)
        # ---- F9: fâșia de sub rândul 1048576 (MINOR 3)
        la_jos(s); roata(s, 600, n=3, w=250); g = g3(s)
        pune("F9_fara_fasie_sub_ultimul_rand", g["ult"] == 1048576 and g["jos_gol"] is not None and g["jos_gol"] <= 0.5, g=g)
        K.press("Control+Home"); s.page.wait_for_timeout(300)
        # ---- M5: grila față de referință (uia_excel.json › zona_document: Grid [1,220,1342,493], Vertical [1346,220,17,496], „1” [1,240,26,19])
        rg = s.rect('[data-lh-tip="DataGrid"][data-lh-eticheta="Grid"]'); rv = s.rect('.lh-ap-x-db-v'); r1 = s.rect('.lh-ap-x-ant-rand[data-lh-id="1"]')
        # MINOR 5 = y și înălțimea (cât e de jos și cât e de scurtă); x / lățimea „Grid” (1364 față de 1342, sub bara verticală,
        # nevăzută pe ecran) nu sunt în MINOR 5: se scriu, nu se judecă
        ap_ = lambda r, ref: r and abs(r[0][1] - ref[1]) <= 1 and abs(r[0][3] - ref[3]) <= 1
        pune("M5_grila_la_referinta", ap_(rg, [1, 220, 1342, 493]) and ap_(rv, [1346, 220, 17, 496]) and ap_(r1, [1, 240, 26, 19]), grid=rg[:1], vertical=rv[:1], rand1=r1[:1])
        # ---- M6: numele bucăților barelor (zona_document: Line up / Page down / Line down; Column left / Page right / Column right)
        nv = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-db-v [data-lh-tip=\"Button\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta'))")
        nh = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-db-h [data-lh-tip=\"Button\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta'))")
        pune("M6_nume_bare", nv == ["Line up", "Page down", "Line down"] and nh == ["Column left", "Page right", "Column right"], vertical=nv, orizontal=nh)
        R["erori_pagina"] = list(s.erori)
        pune("E1_fara_erori_in_pagina", not s.erori, erori=s.erori[:3])
    except Exception:
        R["exceptie"] = traceback.format_exc()[-1500:]
        pune("E2_fara_exceptie", False)
    finally:
        s.gata()
    pic = [k for k, v in R.items() if isinstance(v, dict) and "ok" in v and not v["ok"]]
    R["_rezumat"] = {"vechi": VECHI, "verificari": sum(1 for v in R.values() if isinstance(v, dict) and "ok" in v), "picate": pic}
    json.dump(R, open(a.iesire, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for k, v in R.items():
        if isinstance(v, dict) and "ok" in v:
            print(("OK   " if v["ok"] else "PICĂ ") + k)
    print(len(pic))


if __name__ == "__main__":
    main()
