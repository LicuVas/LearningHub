# -*- coding: utf-8 -*-
"""Critic r8 p2: ferestrele de eroare a formulei (virgula, typo, too few), butoanele lor, starea dupa; erorile #; Ctrl+Z."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
DATE = {"A1": 4, "A2": 5, "A3": 6, "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8, "C2": "x"}
def pas(nume, *a):
    x = s.stare()
    out[nume] = {"cel": {k: x["celule"].get(k) for k in a}, "ecran": {k: ecran(s, k) for k in a}, "mesaj_f": x.get("fereastra_mesaj"),
                 "edit": x.get("ramane_in_editare"), "dialog": x.get("dialog"), "sel": x.get("selectie", {}).get("activa"),
                 "dlg_vizibil": dialog_vizibil(s), "focus": focus(s), "ev": ultimele_ev(s, 3), "mesaj": mesaj_tot(s),
                 "mod": s.ev("()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"Text\"]')].find(x=>/^Cell Mode/.test(x.getAttribute('data-lh-eticheta')||''));return e?e.textContent:null}"),
                 "bara_formule": s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"bara_formule\"], [data-lh-aplicatie] .lh-ap-x-fx input, [data-lh-aplicatie] [data-lh-eticheta=\"Formula Bar\"]');return e?(e.value!==undefined?e.value:e.textContent):null}")}
def tasteaza(a, text):
    clic_cel(s, a); s.page.wait_for_timeout(650); K.type(text); K.press("Enter"); s.page.wait_for_timeout(200)
try:
    deschide_cu(s, {"celule": DATE, "selectie": "D1"})
    # a) virgula
    tasteaza("D3", "=SUM(A1,A2)"); pas("a_virgula_enter", "D3"); s.shot("p2_virgula.png")
    K.press("Enter"); s.page.wait_for_timeout(200); pas("a_virgula_ok_enter", "D3")
    K.press("Enter"); s.page.wait_for_timeout(200); pas("a_virgula_enter2", "D3")
    K.press("Escape"); s.page.wait_for_timeout(200); pas("a_virgula_esc_fereastra", "D3")
    K.press("Escape"); s.page.wait_for_timeout(200); pas("a_virgula_esc_celula", "D3")
    # a2) virgula, clic pe OK, apoi corectez cu ; prin bara: Home, sterg, scriu
    tasteaza("D3", "=SUM(A1,A2)")
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="OK"]'); pas("a2_clic_ok", "D3")
    K.type("x"); s.page.wait_for_timeout(150); pas("a2_dupa_ok_tastez_x", "D3")
    K.press("Escape"); s.page.wait_for_timeout(150)
    # b) typo
    tasteaza("D2", "=SUM(B2:B7)B2:B6"); pas("b_typo_enter", "D2"); s.shot("p2_typo.png")
    K.press("Tab"); s.page.wait_for_timeout(120); pas("b_typo_tab", "D2")
    K.press("Shift+Tab"); s.page.wait_for_timeout(120)
    K.press("Enter"); s.page.wait_for_timeout(250); pas("b_typo_yes_enter", "D2", "D3", "D4", "D5", "D6")
    K.press("Control+z"); s.page.wait_for_timeout(150); pas("b_typo_ctrl_z", "D2")
    tasteaza("D2", "=SUM(B2:B7)B2:B6")
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="No"]'); pas("b_typo_no", "D2")
    K.press("Escape"); s.page.wait_for_timeout(150); pas("b_typo_no_esc", "D2")
    tasteaza("D2", "=SUM(B2:B7)B2:B6"); K.press("Escape"); s.page.wait_for_timeout(200); pas("b_typo_esc", "D2")
    K.press("Escape"); s.page.wait_for_timeout(150)
    # c) too few
    clic_cel(s, "D4"); s.page.wait_for_timeout(650); K.type("=SU"); K.press("Tab"); K.type("A1:A3)"); K.press("Enter"); s.page.wait_for_timeout(200)
    pas("c_toofew", "D4")
    K.press("Enter"); s.page.wait_for_timeout(200); pas("c_toofew_ok", "D4")
    K.press("Escape"); s.page.wait_for_timeout(150); pas("c_toofew_esc", "D4")
    # d) erori #
    for a, f in [("E2", "=1/0"), ("E3", "=C2+1"), ("E4", "=SUMA(B2:B4)"), ("E5", "=E5+1"), ("E6", "=AVERAGE(G1:G3)"), ("E7", "=B2/A9")]:
        tasteaza(a, f)
    pas("d_erori", "E2", "E3", "E4", "E5", "E6", "E7")
    # e) ghilimele romanesti (m2-l09)
    s.page.keyboard.press("Escape")
    clic_cel(s, "F2"); s.page.wait_for_timeout(650); K.type("=IF(B2>=9;"); s.page.keyboard.insert_text("„da”;„nu”)"); K.press("Enter"); s.page.wait_for_timeout(200)
    pas("e_ghilimele_ro", "F2"); s.shot("p2_ghilimele.png")
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    # f) paranteza lipsa
    tasteaza("F3", "=SUM(B2:B4"); pas("f_paranteza_lipsa", "F3")
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    tasteaza("F4", "=(B2+B3/2"); pas("f_paranteza_lipsa2", "F4")
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    # g) "=" singur + Enter
    tasteaza("F5", "="); pas("g_egal_singur", "F5")
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    # h) operator la final
    tasteaza("F6", "=B2+"); pas("h_operator_final", "F6")
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p2.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
