# -*- coding: utf-8 -*-
"""Runda 10 (B-excel): proba GRAV-urilor A1 (locul graficului nou), A2 (rezumatul selecției în bara de stare), E5 (vărsarea)
+ ținta tastelor cu graficul ales (MINOR 4.1) și Esc în Sort pe Then by (MINOR 4.2), cu GESTURI REALE pe poligonul bibliotecii
(Playwright headless, mouse / atingeri / tastatură, doar 127.0.0.1). Refolosește serverul, ruta și clasa S din runde/7 și 9.

Referințele (înghețate sau COM, toate citite pe disc):
- A1: runde/9/critic_probe/com_r9.json › carti (left 378 pt, top 155,7 pt, H11, 360 × 216 pt) și runde/10/probe/com_r10_b.json
  (aceeași Excel, 6 mărimi de fereastră: left = (UsableWidth − 360)/2 − 10,2 pt, top = (UsableHeight − 216)/2 − 7,2 pt,
  left = 0 când fereastra e mai îngustă decât graficul; la 1366×768 → G10). În px la 100 %: × 4/3.
- A2: uia_excel.json › suprafete › bara_stare#selectie_numere (B2:C4 = 9, 7 / 8, 10 / 6, 5 → Average 7,5 [859,2], Count 6
  [933,6], Sum 45 [988,8]; fără Display Settings) și bara_stare (Display Settings [925, 746, 116, 21], fără selecție).
- E5: runde/8/critic_probe/com_r8.json (=SUM(B2:B7)*B2:B6 → D2:D6 = 432, 336, 384, 480, 288; 2_D2_spill true;
  2_D3_formula2 "").
- api_biblioteca.md §4: „la taste: ținta focusului”.

Rulare:  python proba_grav.py [--iesire <fisier.json>] [--doar A1,A2,E5,M1,M2]
Ultima linie = verificări picate."""
import argparse, importlib.util, json, os, sys
AICI = os.path.dirname(os.path.abspath(__file__))
_sp = importlib.util.spec_from_file_location("pg9", os.path.join(AICI, "..", "9", "proba_grav.py"))
P9 = importlib.util.module_from_spec(_sp); _sp.loader.exec_module(P9)
PG, S, verif, REZ = P9.PG, P9.S, P9.verif, P9.REZ
tasta, scrie_taste, nev, evd, ae, fila, zona, ecran, txt = P9.tasta, P9.scrie_taste, P9.nev, P9.evd, P9.ae, P9.fila, P9.zona, P9.ecran, P9.txt
graf_rect, graf_ecran, deschide_lista, rand_lista, fereastra = P9.graf_rect, P9.graf_ecran, P9.deschide_lista, P9.rand_lista, P9.fereastra
from playwright.sync_api import sync_playwright

APP = P9.APP
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 4, "A3": "Bogdan", "B3": 7, "A4": "Carla", "B4": 3,
         "A5": "Dan", "B5": 9, "A6": "Elena", "B6": 5}
GRID = """()=>{const c=document.querySelector('[data-lh-aplicatie] .lh-ap-x-corp');const b=c.getBoundingClientRect();
  return {x:b.x,y:b.y,cw:c.clientWidth,ch:c.clientHeight,sl:c.scrollLeft,st:c.scrollTop,vw:innerWidth,vh:innerHeight}}"""
CEL_SUB = """([x,y])=>{const e=document.elementsFromPoint(x,y).find(e=>e.matches('[data-lh-tinta="celula"]'));return e?e.getAttribute('data-lh-id'):null}"""
TITLU = """()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta$="/titlu"]')].find(e=>e.getClientRects().length);
  if(!e)return null;const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}"""

def gr0(s): return (s.stare().get("grafice") or [None])[0]
def col_rand(adr):
    import re
    m = re.match(r"([A-Z]+)(\d+)$", adr or "")
    return (m.group(1), int(m.group(2))) if m else (None, None)
def asteptat(g, z=1.0):
    """formula din com_r10_b.json, în px la 100 % (pt × 4/3), raportată la zona vizibilă a grilei"""
    U, V = g["cw"] / z, g["ch"] / z
    x = max(0.0, (U - 480) / 2 - 13.6) + g["sl"] / z
    y = max(0.0, (V - 288) / 2 - 9.6) + g["st"] / z
    return round(x), round(y)
def inauntru(r, g, marja=1):
    """dreptunghiul r = [x, y, w, h] în zona vizibilă a grilei și în fereastră"""
    return (r[0] >= g["x"] - marja and r[1] >= g["y"] - marja and r[0] + r[2] <= g["x"] + g["cw"] + marja
            and r[1] + r[3] <= g["y"] + g["ch"] + marja and r[0] + r[2] <= g["vw"] + marja and r[1] + r[3] <= g["vh"] + marja)
def punct_vizibil(px, py, g): return g["x"] <= px <= g["x"] + g["cw"] and g["y"] <= py <= g["y"] + g["ch"] and 0 <= px <= g["vw"] and 0 <= py <= g["vh"]
def atinge_sel(s, sel):
    b = s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;e.scrollIntoView({block:'nearest',inline:'nearest'});const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
    if not b: return False
    s.pg.touchscreen.tap(b[0], b[1]); s.pg.wait_for_timeout(300); return True
def descrie(s, g):
    r = graf_rect(s); st = gr0(s) or {}
    tl = s.ev(CEL_SUB, [r[0] + 2, r[1] + 2]) if r else None
    return {"rect": r, "pozitie": st.get("pozitie"), "grila": g, "celula_stanga_sus": tl, "titlu_rect": s.ev(TITLU)}

# ------------------------------------------------------------------ A1: locul graficului nou
def a1(pw, base):
    # 1. 1366×768, mouse: A1:B6 trasă, Insert › ▾ › Clustered Column
    s = S(pw, base); s.deschide({"celule": dict(CARTI), "selectie": "A1"})
    zona(s, "A1", "B6"); fila(s, "TabInsert"); deschide_lista(s); rand_lista(s, "Clustered Column")
    g = s.ev(GRID); d = descrie(s, g); c, rr = col_rand(d["celula_stanga_sus"])
    # suplimentul cerea H11 ± 1 (com_r9, fereastră invizibilă FĂRĂ panglică: UsableHeight 565,8 pt = 754 px). com_r10_b/c arată că locul
    # urmează zona utilă; pe grila vizibilă a simulatorului la 1366×768 (1338 × 470 px, ca referința) formula dă G5 (diferente.md D-A1-1)
    verif("A1", "1366×768, mouse: celula din stânga-sus a graficului = G5 (formula Excel din com_r10_b/c pe grila vizibilă 1338×470; supliment H11±1 contrazis, D-A1-1)",
          (c, rr) == ("G", 5), d)
    ex = asteptat(g); p = d["pozitie"] or {}
    verif("A1", "1366×768: pozitie = formula din COM raportată la zona vizibilă ((U−480)/2−13,6; (V−288)/2−9,6 px), mărimea 480×288",
          abs(p.get("x", -99) - ex[0]) <= 1 and abs(p.get("y", -99) - ex[1]) <= 1 and p.get("w") == 480 and p.get("h") == 288, {"asteptat": ex, "pozitie": p})
    r = d["rect"] or [0, 0, 0, 0]
    verif("A1", "1366×768: ecranul = starea (dreptunghiul = grila + pozitie − derularea) și graficul întreg în zona vizibilă",
          abs(r[0] - (g["x"] + p.get("x", 0) - g["sl"])) <= 1.5 and abs(r[1] - (g["y"] + p.get("y", 0) - g["st"])) <= 1.5 and inauntru(r, g), d)
    verif("A1", "fără erori în pagină (1)", not s.erori, s.erori[:3])
    s.gata()
    # 2. 1366×768, numai tastatura: celula A1 (o celulă = zona curentă), Alt, N, C, ↓, Enter → același loc (nu depinde de tabel)
    s = S(pw, base); s.deschide({"celule": dict(CARTI), "selectie": "A1"})
    s.clic("A1"); tasta(s, "Control+Home"); n0 = nev(s)
    for k in ("Alt", "n", "c"): tasta(s, k)
    tasta(s, "ArrowDown"); tasta(s, "Enter")
    g = s.ev(GRID); d2 = descrie(s, g); ev = evd(s, n0)
    verif("A1", "tastatura Alt, N, C, ↓, Enter din A1: un grafic pe A1:B6, în același loc ca la mouse (com_r10_b: locul nu depinde de tabel)",
          (gr0(s) or {}).get("zona") == "A1:B6" and d2["pozitie"] == d["pozitie"] and any(e["actiune"] == "inserare_grafic" for e in ev), {"d": d2, "ev": ev[-3:]})
    s.gata()
    # 3. fereastra mică 1093×526 (= 1366×657 la 125 %, I1): graficul întreg pe ecran
    s = S(pw, base, 1093, 526); s.deschide({"celule": dict(CARTI), "selectie": "A1"})
    zona(s, "A1", "B6"); fila(s, "TabInsert"); deschide_lista(s); rand_lista(s, "Clustered Column")
    g = s.ev(GRID); d = descrie(s, g); r = d["rect"] or [0, 0, 0, 0]; t = d["titlu_rect"] or [-999, -999, 0, 0]; ex = asteptat(g); p = d["pozitie"] or {}
    # grila vizibilă are 228 px, graficul 288: Excel real într-o fereastră mai joasă decât graficul îl lipește sus (top 0) și NU-l
    # micșorează (com_r10_c.json: UsableHeight 168,6 / 219 pt → top 0, 360 × 216 pt) — deci „întreg” = după derularea grilei
    verif("A1", "fereastra mică 1093×526: lipit sus (pozitie = formula, top 0), lățimea întreagă, colțul stânga-sus și titlul pe ecran imediat (com_r10_c)",
          abs(p.get("x", -99) - ex[0]) <= 1 and p.get("y") == ex[1] == 0 and r[0] >= g["x"] - 1 and r[0] + r[2] <= g["x"] + g["cw"] + 1
          and punct_vizibil(r[0] + 1, r[1] + 1, g) and punct_vizibil(t[0], t[1], g) and punct_vizibil(t[0] + t[2], t[1] + t[3], g), {"asteptat": ex, **d})
    s.pg.mouse.move(g["x"] + 20, g["y"] + 20); s.pg.mouse.wheel(0, 120); s.pg.wait_for_timeout(300)
    g2 = s.ev(GRID); r2 = graf_rect(s) or [0, 0, 0, 0]
    verif("A1", "fereastra mică: după derularea grilei cu rotița, marginea de jos a graficului (legenda / numele) e pe ecran",
          punct_vizibil(r2[0] + 1, r2[1] + r2[3] - 1, g2), {"grila": g2, "rect": r2})
    s.gata()
    # 4. telefon 375×667, atingeri: colțul stânga-sus și titlul pe ecran
    s = S(pw, base, 375, 667, mobil=True); s.deschide({"celule": dict(CARTI), "selectie": "A1"})
    s.atinge("A2"); atinge_sel(s, APP + '[data-lh-tip="TabItem"][data-lh-id-mso="TabInsert"]')
    atinge_sel(s, APP + '[data-lh-id-mso="ChartTypeColumnInsertGallery"]')
    atinge_sel(s, APP + '[data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-tip="ListItem"][data-lh-eticheta="Clustered Column"]')
    g = s.ev(GRID); d = descrie(s, g); r = d["rect"] or [-999, -999, 0, 0]; t = d["titlu_rect"] or [-999, -999, 0, 0]
    verif("A1", "telefon 375×667, atingeri: după Clustered Column se văd colțul stânga-sus al graficului și titlul întreg",
          (gr0(s) or {}).get("zona") == "A1:B6" and punct_vizibil(r[0] + 1, r[1] + 1, g) and punct_vizibil(t[0], t[1], g) and punct_vizibil(t[0] + t[2], t[1] + t[3], g), d)
    p = d["pozitie"] or {}
    verif("A1", "telefon: ecranul = starea (colțul graficului = grila + pozitie × 1,7 − derularea; mărimea 480×288 la zoomul registrului)",
          abs(r[0] - (g["x"] + p.get("x", 0) * 1.7 - g["sl"])) <= 1.5 and abs(r[1] - (g["y"] + p.get("y", 0) * 1.7 - g["st"])) <= 1.5
          and abs(r[2] - p.get("w", 0)) <= 1.5 and abs(r[3] - p.get("h", 0)) <= 1.5, d)
    verif("A1", "fără erori în pagină (telefon)", not s.erori, s.erori[:3])
    s.gata()
    # 5. grila derulată (rotița) cu tabelul ales: graficul apare în zona vizibilă, nu la H11 absolut (de_verificat R10-1)
    s = S(pw, base); s.deschide({"celule": dict(CARTI), "selectie": "A1"})
    zona(s, "A1", "B6"); gb = s.ev(GRID); s.pg.mouse.move(gb["x"] + 300, gb["y"] + 200); s.pg.mouse.wheel(0, 760); s.pg.wait_for_timeout(300)
    for k in ("Alt", "n", "c", "ArrowDown", "Enter"): tasta(s, k)
    g = s.ev(GRID); d = descrie(s, g); r = d["rect"] or [0, 0, 0, 0]
    verif("A1", "grila derulată (rotița, ~40 de rânduri): graficul nou apare întreg în zona vizibilă", g["st"] > 0 and inauntru(r, g), d)
    s.gata()

# ------------------------------------------------------------------ A2: rezumatul selecției în bara de stare
NUM = {"B2": 9, "C2": 7, "B3": 8, "C3": 10, "B4": 6, "C4": 5, "B1": "Nota", "C1": "Nr"}
BARA = """()=>{const b=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata="bara_stare"]')].find(e=>e.getClientRects().length);
  if(!b)return null;return [...b.querySelectorAll('[data-lh-tip]')].filter(e=>e.getClientRects().length&&e.parentElement.closest('[data-lh-tip]')===b)
  .map(e=>{const r=e.getBoundingClientRect();return [e.getAttribute('data-lh-eticheta'),Math.round(r.x*10)/10,Math.round(r.width*10)/10]})}"""
def rezumat(s):
    b = s.ev(BARA) or []
    return [x for x in b if x[0] and (x[0].startswith("Average") or x[0].startswith("Count") or x[0].startswith("Sum") or x[0].startswith("Display Settings"))]
REF_A2 = [["Average 7,5", 859.2, 74.4], ["Count 6", 933.6, 55.2], ["Sum 45", 988.8, 53.6]]
def la_loc(rz, ref, dx=3):
    return len(rz) == len(ref) and all(a[0] == b[0] and abs(a[1] - b[1]) <= dx and abs(a[2] - b[2]) <= dx for a, b in zip(rz, ref))
def a2(pw, base):
    s = S(pw, base); s.deschide({"celule": dict(NUM), "selectie": "A1"})
    s.clic("B2")
    rz0 = rezumat(s)
    verif("A2", "o singură celulă (B2 = 9): fără rezumat, Display Settings la locul din bara_stare [925, 116] (de_verificat R10-2)",
          len(rz0) == 1 and rz0[0][0].startswith("Display Settings") and abs(rz0[0][1] - 925) <= 3, rz0)
    # tastatura: Shift+→, Shift+↓ ×2 → B2:C4 (exact selecția referinței)
    n0 = nev(s)
    for k in ("Shift+ArrowRight", "Shift+ArrowDown", "Shift+ArrowDown"): tasta(s, k, 120)
    sel = (s.stare().get("selectie") or {}).get("zona")
    rz = rezumat(s); bara = s.ev(BARA)
    verif("A2", "Shift+săgeți → B2:C4: bara arată Average 7,5 · Count 6 · Sum 45 la locurile din bara_stare#selectie_numere (±3 px), fără Display Settings",
          sel == "B2:C4" and la_loc(rz, REF_A2), {"selectie": sel, "rezumat": rz})
    ordine = [x[0] for x in (bara or [])]
    verif("A2", "ordinea elementelor = referința: Cell Mode Ready, Macro Recording, Accessibility, Average, Count, Sum, Normal, Page Layout, Page Break Preview …",
          ordine[:9] == ["Cell Mode Ready", "Macro Recording Not Recording", "Accessibility Checker Accessibility: Good to go", "Average 7,5", "Count 6", "Sum 45", "Normal", "Page Layout", "Page Break Preview"], ordine)
    # mouse: schimbarea selecției actualizează rezumatul (B2:C3 = 9, 7, 8, 10)
    zona(s, "B2", "C3"); rz = rezumat(s)
    verif("A2", "mouse B2:C3 → Average 8,5 · Count 4 · Sum 34 (se actualizează la schimbarea selecției; aliniate la dreapta ca în referință)",
          [x[0] for x in rz] == ["Average 8,5", "Count 4", "Sum 34"] and abs(rz[-1][1] + rz[-1][2] - 1042.4) <= 3, rz)
    # valoarea se schimbă cu selecția pe loc: Delete golește, Ctrl+Z pune înapoi
    zona(s, "B2", "C4"); tasta(s, "Delete"); rz_del = rezumat(s)
    tasta(s, "Control+z"); rz_z = rezumat(s)
    verif("A2", "B2:C4 aleasă: Delete → fără rezumat (celule goale), Display Settings înapoi; Ctrl+Z → Average 7,5 · Count 6 · Sum 45 înapoi",
          len(rz_del) == 1 and rz_del[0][0].startswith("Display Settings") and la_loc(rz_z, REF_A2), {"dupa_delete": rz_del, "dupa_ctrl_z": rz_z})
    # text + numere (antetul): Count = celulele ne-goale, Average / Sum pe numere [NEVERIFICAT R10-2]
    zona(s, "B1", "B3"); rz = rezumat(s)
    verif("A2", "[NEVERIFICAT R10-2] B1:B3 = Nota, 9, 8 → Average 8,5 · Count 3 · Sum 17", [x[0] for x in rz] == ["Average 8,5", "Count 3", "Sum 17"], rz)
    verif("A2", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ E5: vărsarea
NOTE6 = dict(P9.NOTE6)
def stare_d(s): return [txt(s, "D%d" % i) for i in range(2, 8)]
def ecran_d(s): return [ecran(s, "D%d" % i) for i in range(2, 8)]
VARS = ["432", "336", "384", "480", "288", None]
def e5(pw, base):
    # 1. numai tastatura: formula + Enter → „We found a typo…” (focusul pe Yes) → Enter
    s = S(pw, base); s.deschide({"celule": dict(NOTE6), "selectie": "D2"})
    s.clic("D2"); scrie_taste(s, "=SUM(B2:B7)B2:B6"); tasta(s, "Enter")
    dlg = fereastra(s, "dialog.eroare_formula"); n0 = nev(s); tasta(s, "Enter")
    st, ec = stare_d(s), ecran_d(s); d2, d3 = s.cel("D2") or {}, s.cel("D3") or {}
    verif("E5", "tastatura: Enter pe Yes → D2:D6 = 432, 336, 384, 480, 288 în stare și pe ecran, D7 gol (com_r8 › 2_D2_D7_text)",
          dlg and st == VARS and [x or None for x in ec] == VARS, {"dialog": dlg, "stare": st, "ecran": ec, "ev": evd(s, n0)})
    verif("E5", "formula doar în D2 („=SUM(B2:B7)*B2:B6”); D3 fără formulă (com_r8 › 2_D3_formula2 = \"\")",
          d2.get("formula") == "=SUM(B2:B7)*B2:B6" and not d3.get("formula"), {"D2": d2, "D3": d3})
    # 2. recalcul: B2 = 10 → SUM = 49 → 490, 343, 392, 490, 294
    s.scrie("B2", "10")
    st, ec = stare_d(s), ecran_d(s)
    verif("E5", "recalcul: B2 = 10 → D2:D6 = 490, 343, 392, 490, 294 în stare și pe ecran", st[:5] == ["490", "343", "392", "490", "294"] and ec[:5] == st[:5], {"stare": st, "ecran": ec})
    # 3. Ctrl+Z ×2: întâi B2, apoi toată vărsarea
    tasta(s, "Control+z"); st1 = stare_d(s)
    tasta(s, "Control+z"); st2, ec2 = stare_d(s), ecran_d(s)
    verif("E5", "Ctrl+Z → înapoi 432…288; încă un Ctrl+Z scoate toată vărsarea (D2:D6 goale în stare și pe ecran)",
          st1 == VARS and all(x in (None, "") for x in st2) and all(not x for x in ec2), {"dupa_1": st1, "dupa_2": st2, "ecran_2": ec2})
    verif("E5", "fără erori în pagină (tastatura)", not s.erori, s.erori[:3])
    s.gata()
    # 4. mouse: clic pe Yes
    s = S(pw, base); s.deschide({"celule": dict(NOTE6), "selectie": "D2"})
    s.clic("D2"); scrie_taste(s, "=SUM(B2:B7)B2:B6"); tasta(s, "Enter")
    s.clic_sel(APP + '[data-lh-suprafata="dialog.eroare_formula"] [data-lh-tip="Button"][data-lh-eticheta="Yes"]')
    st, ec = stare_d(s), ecran_d(s)
    verif("E5", "mouse: clic pe Yes → aceeași vărsare în stare și pe ecran", st == VARS and [x or None for x in ec] == VARS, {"stare": st, "ecran": ec})
    # 5. o formulă scrisă direct, fără fereastră: =B2:B6*2 → 18, 14, 16, 20, 12
    s.scrie("F2", "=B2:B6*2")
    st = [txt(s, "F%d" % i) for i in range(2, 7)]
    verif("E5", "=B2:B6*2 scrisă direct → F2:F6 = 18, 14, 16, 20, 12 (aceeași regulă: operația pe zonă varsă)", st == ["18", "14", "16", "20", "12"], st)
    verif("E5", "fără erori în pagină (mouse)", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ M1: ținta tastelor cu graficul ales (§4: „la taste: ținta focusului”)
def m1(pw, base):
    s = S(pw, base); s.deschide({"celule": dict(CARTI), "selectie": "A1"})
    zona(s, "A1", "B6"); fila(s, "TabInsert"); deschide_lista(s); rand_lista(s, "Clustered Column")
    r = graf_rect(s); n0 = nev(s)
    s.pg.mouse.click(r[0] + 6, r[1] + r[3] - 6); s.pg.wait_for_timeout(200)
    t_gr = [e["tinta"] for e in evd(s, n0)]
    t = s.ev(TITLU); n1 = nev(s); s.pg.mouse.click(t[0] + t[2] / 2, t[1] + t[3] / 2); s.pg.wait_for_timeout(200)
    t_ti = [e["tinta"] for e in evd(s, n1)]
    scrie_taste(s, "Cărți"); n2 = nev(s); tasta(s, "Enter"); e_ent = evd(s, n2)
    r = graf_rect(s); s.pg.mouse.click(r[0] + 6, r[1] + r[3] - 6); s.pg.wait_for_timeout(200)   # titlul rămâne ales după Enter: alege graficul
    n3 = nev(s); tasta(s, "Delete"); e_del = evd(s, n3)
    verif("M1", "Enter pe titlul ales → tinta = ținta titlului (ca la clicul pe el), nu celula activă",
          e_ent and e_ent[-1]["actiune"] == "titlu_grafic" and t_ti and e_ent[-1]["tinta"] == t_ti[-1], {"clic_titlu": t_ti, "enter": e_ent})
    verif("M1", "Delete pe graficul ales → tinta = ținta graficului (ca la clicul pe el), nu celula activă",
          e_del and e_del[-1]["actiune"] == "stergere_grafic" and t_gr and e_del[-1]["tinta"] == t_gr[-1], {"clic_grafic": t_gr, "delete": e_del})
    s.gata()

# ------------------------------------------------------------------ M2: Esc în Sort cu focusul pe Then by (nivelul 2)
def m2(pw, base):
    s = S(pw, base); s.deschide({"celule": dict(P9.CLASA), "selectie": "A1"})
    s.clic("A2"); fila(s, "TabData")
    s.clic_sel(APP + '[data-lh-id-mso="SortDialog"]'); s.pg.wait_for_timeout(300)
    s.clic_sel(APP + '[data-lh-suprafata="dialog.SortDialog"] [data-lh-tip="Button"][data-lh-eticheta="Add Level"]')
    ok = P9.tab_pana_la(s, 1, "coloana")
    f = ae(s) or {}; n0 = nev(s); tasta(s, "Escape"); e = evd(s, n0)
    verif("M2", "Esc cu focusul pe Then by (al doilea rând) → tasta_esc / anulare cu tinta = ținta focusului, nu camp:Sort by",
          ok and e and e[-1]["gest"] == "tasta_esc" and e[-1]["tinta"] == f.get("tinta") == "camp:Then by", {"focus": f, "ev": e})
    s.gata()
    # cazul criticului 9 (k1x): trei rânduri, alegere din listă pe al treilea (nivelul 2), apoi Esc
    s = S(pw, base); s.deschide({"celule": dict(P9.CLASA), "selectie": "A1"})
    s.clic("A2"); fila(s, "TabData")
    s.clic_sel(APP + '[data-lh-id-mso="SortDialog"]'); s.pg.wait_for_timeout(300)
    for _ in range(2): s.clic_sel(APP + '[data-lh-suprafata="dialog.SortDialog"] [data-lh-tip="Button"][data-lh-eticheta="Add Level"]')
    ok = P9.tab_pana_la(s, 2, "coloana", 24)
    if ok: P9.alege_din_lista_tastatura(s, "Punctaj")
    f = ae(s) or {}; n0 = nev(s); tasta(s, "Escape"); e = evd(s, n0)
    verif("M2", "trei rânduri, Then by pe nivelul 2 ales din listă, apoi Esc → tasta_esc / anulare cu tinta = ținta focusului (rândul 2), fereastra închisă",
          ok and f.get("nivel") == "2" and e and e[-1]["gest"] == "tasta_esc" and e[-1]["tinta"] == f.get("tinta") == "camp:Then by" and not fereastra(s, "dialog.SortDialog"), {"focus": f, "ev": e})
    s.gata()

# ------------------------------------------------------------------ M3: axa valorilor (com_r9.json › carti.axa [0, 10, 1], carti_b4_20_axa [0, 25, 5], luni.axa [0, 30, 5])
AXA = "()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-grafic .lh-ap-x-gr-val')].map(e=>+e.textContent.replace(',','.'))"
def m3(pw, base):
    s = S(pw, base); s.deschide({"celule": dict(CARTI), "selectie": "A1"})
    s.clic("A2")
    for k in ("Alt", "n", "c", "ArrowDown", "Enter"): tasta(s, k)
    ax1 = s.ev(AXA)
    s.clic("A12"); s.scrie("B4", "20"); ax2 = s.ev(AXA)
    verif("M3", "CARTI: axa 0–10 din 1; după B4 = 20: 0–25 din 5 (Excel real, com_r9.json)", ax1 == list(range(0, 11)) and ax2 == [0, 5, 10, 15, 20, 25], {"carti": ax1, "b4_20": ax2})
    s.gata()
    s = S(pw, base); s.deschide({"celule": dict(P9.LUNI), "selectie": "A1"})
    s.clic("A2")
    for k in ("Alt", "n", "c", "ArrowDown", "Enter"): tasta(s, k)
    ax = s.ev(AXA)
    verif("M3", "LUNI: axa 0–30 din 5 (Excel real, com_r9.json › luni.axa)", ax == [0, 5, 10, 15, 20, 25, 30], ax)
    s.gata()

PROBE = {"A1": a1, "A2": a2, "E5": e5, "M1": m1, "M2": m2, "M3": m3}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire", default=os.path.join(AICI, "proba_grav.json"))
    ap.add_argument("--doar", default="")
    a = ap.parse_args()
    doar = [x.strip() for x in a.doar.split(",") if x.strip()] or list(PROBE)
    srv, base = PG.server()
    with sync_playwright() as pw:
        for k in doar:
            try: PROBE[k](pw, base)
            except Exception as e: verif(k, "proba a căzut", False, repr(e)[:300])
    srv.shutdown()
    picate = [r for r in REZ if not r["ok"]]
    json.dump({"radacina": "LH_SERVIT" if os.environ.get("LH_SERVIT") else "worktree", "verificari": REZ, "picate": len(picate)},
              open(a.iesire, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for r in REZ: print(("ok   " if r["ok"] else "PICAT") + " " + r["grav"] + " " + r["verificare"][:110] + ("" if r["ok"] else "  <- " + json.dumps(r["detaliu"], ensure_ascii=False)[:300]))
    print(len(picate))

if __name__ == "__main__":
    main()
