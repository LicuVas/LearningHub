# -*- coding: utf-8 -*-
"""Runda 17: locul listelor noi față de referință (uia_excel.json › rect_css, 1366x768). Pentru fiecare rând: deplasarea
(x, y) față de colțul listei și mărimea, în simulator și în referință; plus colțul listei față de butonul ei."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/17/proba")
from h17 import *
D = "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/"
REF = json.load(open(D + "referinte/uia_excel.json", encoding="utf-8"))["suprafete"]
ATELIER = {"A1": "Clasa", "B1": "miercuri", "C1": "joi", "D1": "vineri", "A2": "8A", "B2": 45, "C2": 60, "D2": 90, "A3": "8B", "B3": 50, "C3": 42, "D3": 80, "A4": "8C", "B4": 38, "C4": 66, "D4": 72, "A5": "8D", "B5": 55, "C5": 48, "D5": 70}
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9, "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}
JS = """k=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();const m=document.querySelector('[data-lh-suprafata="'+k+'"]');if(!m)return null;
 const q=m.getBoundingClientRect();return {lista:[q.left-R.left,q.top-R.top,q.width,q.height],randuri:[...m.querySelectorAll('[data-lh-tip="ListItem"],[data-lh-tip="MenuItem"]')].filter(e=>e.closest('[data-lh-suprafata]')===m).map(e=>{const b=e.getBoundingClientRect();return [e.getAttribute('data-lh-eticheta'),Math.round(b.left-q.left),Math.round(b.top-q.top),Math.round(b.width),Math.round(b.height)]})}}"""


def ref_randuri(k):
    v = REF[k]; o = []; x0, y0 = v["rect_css"][0], v["rect_css"][1]
    def u(n):
        if n.get("tip") in ("ListItem", "MenuItem") and n.get("rect_css"):
            r = n["rect_css"]; o.append([n.get("eticheta"), round(r[0] - x0), round(r[1] - y0), round(r[2]), round(r[3])])
        for c in n.get("copii") or []: u(c)
    for c in v.get("copii") or []: u(c)
    return v["rect_css"], o


out = {}
s = Sesiune(1366, 768)
try:
    for cont, zona, chei in [(ATELIER, "A1:D5", ["lista.ChartTypeLineInsertGallery", "lista.AddChartElementMenu", "lista.AddChartElementMenu#Data Labels"]),
                             (CARTI, "A1:B6", ["lista.AddChartElementMenu#Data Labels#Clustered Column"])]:
        for k in chei:
            deschide_cu(s, {"celule": cont, "selectie": zona})
            ok = s.ev("async k=>{try{return await LH.aplicatii.deschideSuprafata(k)}catch(e){return String(e)}}", k); s.page.wait_for_timeout(300)
            sim = s.ev(JS, k)
            rr, ro = ref_randuri(k)
            dif = []
            if sim:
                ds = {r[0]: r for r in sim["randuri"]}
                for r in ro:
                    x = ds.get(r[0])
                    if not x: dif.append(["lipsa", r[0]]); continue
                    if abs(x[1] - r[1]) > 8 or abs(x[2] - r[2]) > 8: dif.append(["pozitie", r[0], x[1:], r[1:]])
            out[k] = {"deschis": ok, "lista_sim": sim and [round(v) for v in sim["lista"]], "lista_ref": rr, "dif_peste_8px": dif, "n_sim": sim and len(sim["randuri"]), "n_ref": len(ro)}
finally:
    s.gata()
json.dump(out, open(P + "geom.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for k, v in out.items():
    print(k, "deschis:", v["deschis"], "lista sim/ref:", v["lista_sim"], v["lista_ref"], "rânduri:", v["n_sim"], "/", v["n_ref"], "dif>8px:", len(v["dif_peste_8px"]))
