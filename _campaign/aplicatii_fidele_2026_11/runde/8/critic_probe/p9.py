# -*- coding: utf-8 -*-
"""Critic r8 p9: modul din bara de stare (Cell Mode) dupa Σ / ▾ Average (referinta: Point) si dupa inchiderea ferestrelor de eroare
(referinta: typo -> Edit, virgula / too few -> Ready); ce face o sageata in fiecare caz."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
DATE = {"A1": 4, "A2": 5, "A3": 6, "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8}
MOD = "()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"Text\"]')].find(x=>/^Cell Mode/.test(x.getAttribute('data-lh-eticheta')||''));return e?e.textContent:null}"
def pas(nume, *a):
    x = s.stare()
    out[nume] = {"cel": {k: x["celule"].get(k) for k in a}, "mod": s.ev(MOD), "edit": x.get("ramane_in_editare"), "dialog": (x.get("dialog") or {}).get("titlu"),
                 "dlg": dialog_vizibil(s), "sel": x.get("selectie", {}).get("activa"), "ev": ultimele_ev(s, 2)}
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(200)
try:
    deschide_cu(s, {"celule": DATE, "selectie": "B8"})
    clic_cel(s, "B8"); s.page.wait_for_timeout(650); fila("Home")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="AutoSum"]'); s.page.wait_for_timeout(200); pas("s1_sigma", "B8")
    K.press("ArrowDown"); s.page.wait_for_timeout(200); pas("s2_sigma_jos", "B8", "B9")
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    clic_cel(s, "B8"); s.page.wait_for_timeout(650)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="AutoSumMenu_Dropdown"]'); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.AutoSum"] [data-lh-eticheta="Average"]'); s.page.wait_for_timeout(200); pas("s3_average", "B8")
    K.press("Enter"); s.page.wait_for_timeout(200); pas("s4_average_enter", "B8")
    # typo -> No -> sageata stanga
    clic_cel(s, "D2"); s.page.wait_for_timeout(650); K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(250)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="No"]'); pas("t1_typo_no", "D2")
    K.press("ArrowLeft"); s.page.wait_for_timeout(200); pas("t2_typo_no_stanga", "D2")
    K.press("Escape"); K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    # virgula -> OK -> sageata stanga
    clic_cel(s, "D3"); s.page.wait_for_timeout(650); K.type("=SUM(A1,A2)"); K.press("Enter"); s.page.wait_for_timeout(250)
    K.press("Enter"); s.page.wait_for_timeout(200); pas("v1_virgula_ok", "D3")
    K.press("ArrowLeft"); s.page.wait_for_timeout(200); pas("v2_virgula_ok_stanga", "D3")
    K.press("Escape"); K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p9.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
