# -*- coding: utf-8 -*-
"""Critic r8 p1: K4 (=AV+Tab), K5 (modul Point), K6 (KeyTips, Alt+=, Ctrl+Shift+%), X5 (lista ▾ Σ), cu Ctrl+Z dupa fiecare."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
DATE = {"A1": "Elev", "B1": "Nota", "A2": "Ana", "B2": 9, "A3": "Bogdan", "B3": 7, "A4": "Carmen", "B4": 8, "E2": 4}
def pas(nume, *chei_cel):
    out[nume] = {"cel": cel(s, *chei_cel), "ecran": {a: ecran(s, a) for a in chei_cel}, "ed": st(s, "ramane_in_editare", "fereastra_mesaj", "dialog", "selectie"),
                 "ev": ultimele_ev(s, 4), "mesaj": mesaj_tot(s), "keytips": keytips(s), "focus": focus(s)}
try:
    deschide_cu(s, {"celule": DATE, "selectie": "A1"})
    # K4
    clic_cel(s, "C6"); s.page.wait_for_timeout(650); K.type("=AV"); K.press("Tab"); K.type("B2:B4)"); K.press("Enter"); s.page.wait_for_timeout(150)
    pas("K4_av_tab", "C6")
    clic_cel(s, "C7"); s.page.wait_for_timeout(650); K.type("=AVER"); K.press("Tab"); K.type("B2:B4)"); K.press("Enter"); s.page.wait_for_timeout(150)
    pas("K4_aver_tab", "C7")
    # K5
    clic_cel(s, "B5"); s.page.wait_for_timeout(650); K.type("="); K.press("ArrowUp"); s.page.wait_for_timeout(100)
    pas("K5_egal_sus_inainte_enter", "B5")
    out["K5_bara_stare"] = s.ev("()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"Text\"]')].find(x=>/^Cell Mode/.test(x.getAttribute('data-lh-eticheta')||''));return e?e.textContent:null}")
    K.press("ArrowUp"); K.press("ArrowUp"); s.page.wait_for_timeout(100)
    pas("K5_egal_sus3", "B5")
    K.press("Enter"); s.page.wait_for_timeout(150)
    pas("K5_dupa_enter", "B5", "B6")
    clic_cel(s, "D2"); s.page.wait_for_timeout(650); K.type("=B2+"); K.press("ArrowRight"); K.press("Enter"); s.page.wait_for_timeout(150)
    pas("K5_plus_dreapta", "D2")
    # Point apoi tastare de cifra dupa referinta (=B2+E2 apoi "5" -> in Excel: =B2+E25? nu, iese din Point si adauga)
    clic_cel(s, "D3"); s.page.wait_for_timeout(650); K.type("=B2+"); K.press("ArrowRight"); K.type("*2"); K.press("Enter"); s.page.wait_for_timeout(150)
    pas("K5_point_apoi_operator", "D3")
    # Point dupa text (nu dupa operator): "=B2" + -> trebuie sa primeasca formula (mod Enter)
    clic_cel(s, "D4"); s.page.wait_for_timeout(650); K.type("=B2"); K.press("ArrowDown"); s.page.wait_for_timeout(150)
    pas("K5_dupa_adresa_sageata", "D4", "D5")
    # K6: Alt, H, 1 pe A1
    clic_cel(s, "A1"); s.page.wait_for_timeout(650); ev_reset(s)
    K.press("Alt"); s.page.wait_for_timeout(200); pas("K6_alt", "A1")
    K.press("h"); s.page.wait_for_timeout(200); pas("K6_alt_h", "A1")
    K.press("1"); s.page.wait_for_timeout(200); pas("K6_alt_h_1", "A1")
    out["K6_fmt_A1"] = s.stare().get("format_celule", {}).get("A1")
    K.press("Control+z"); s.page.wait_for_timeout(150); out["K6_dupa_ctrl_z_fmt_A1"] = s.stare().get("format_celule", {}).get("A1")
    # Alt, H, apoi Esc, apoi litera x -> nu trebuie sa ajunga in celula? (dupa Esc din nivelul 2 se urca la nivelul 1: literele filelor)
    ev_reset(s); K.press("Alt"); s.page.wait_for_timeout(150); K.press("h"); s.page.wait_for_timeout(150); K.press("Escape"); s.page.wait_for_timeout(150)
    pas("K6_alt_h_esc", "A1")
    K.press("x"); s.page.wait_for_timeout(150); pas("K6_alt_h_esc_x", "A1")
    K.press("Escape"); K.press("Escape"); s.page.wait_for_timeout(150)
    # Alt, Q (litera inexistenta) apoi z
    ev_reset(s); K.press("Alt"); s.page.wait_for_timeout(150); K.press("q"); s.page.wait_for_timeout(150); pas("K6_alt_q", "A1")
    K.press("Escape"); s.page.wait_for_timeout(100); K.press("Escape"); s.page.wait_for_timeout(100)
    # Alt+= sub B2:B4
    clic_cel(s, "B5"); s.page.wait_for_timeout(650)
    K.press("Delete"); s.page.wait_for_timeout(100); ev_reset(s)
    K.press("Alt+Equal"); s.page.wait_for_timeout(200); pas("K6_alt_egal", "B5")
    K.press("Enter"); s.page.wait_for_timeout(150); pas("K6_alt_egal_enter", "B5", "B6")
    K.press("Control+z"); s.page.wait_for_timeout(150); pas("K6_alt_egal_ctrl_z", "B5")
    # Ctrl+Shift+% pe B3
    clic_cel(s, "B3"); s.page.wait_for_timeout(650); ev_reset(s)
    K.press("Control+Shift+Digit5"); s.page.wait_for_timeout(200); pas("K6_ctrl_shift_5", "B3")
    out["K6_fmt_B3"] = s.stare().get("format_celule", {}).get("B3")
    K.press("Control+z"); s.page.wait_for_timeout(150); pas("K6_pct_ctrl_z", "B3")
    # Alt, H, P (Percent Style) si Alt, H, W (Wrap)
    ev_reset(s); K.press("Alt"); s.page.wait_for_timeout(150); K.press("h"); s.page.wait_for_timeout(150); K.press("p"); s.page.wait_for_timeout(200)
    pas("K6_alt_h_p", "B3")
    K.press("Control+z"); s.page.wait_for_timeout(150)
    # X5: lista Σ cu mouse-ul, Average pe B5 (gol)
    clic_cel(s, "B5"); s.page.wait_for_timeout(650); K.press("Delete"); s.page.wait_for_timeout(100); ev_reset(s)
    ok = clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="AutoSumMenu_Dropdown"]')
    out["X5_lista_deschisa"] = ok
    out["X5_randuri"] = s.ev("()=>{const m=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"lista.AutoSum\"]');return m?[...m.querySelectorAll('[data-lh-tip]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-tip')+':'+(e.getAttribute('data-lh-eticheta')||'')+(e.getAttribute('data-lh-tinta')?' ['+e.getAttribute('data-lh-tinta')+(e.getAttribute('data-lh-id')?':'+e.getAttribute('data-lh-id'):'')+']':'')):null}")
    s.shot("p1_x5_lista.png")
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="lista.AutoSum"] [data-lh-eticheta="Average"]')
    pas("X5_average_clic", "B5")
    K.press("Enter"); s.page.wait_for_timeout(150); pas("X5_average_enter", "B5")
    K.press("Control+z"); s.page.wait_for_timeout(150); pas("X5_average_ctrl_z", "B5")
    # X5 cu tastatura: Alt, H, U, A
    clic_cel(s, "B5"); s.page.wait_for_timeout(650); ev_reset(s)
    for t in ["Alt", "h", "u"]:
        K.press(t); s.page.wait_for_timeout(180)
    pas("X5_alt_h_u", "B5")
    K.press("a"); s.page.wait_for_timeout(200); pas("X5_alt_h_u_a", "B5")
    K.press("Enter"); s.page.wait_for_timeout(150); pas("X5_alt_h_u_a_enter", "B5")
    # lista Σ cu săgeți: ▾ apoi ↓ ↓ Enter
    clic_cel(s, "C5"); s.page.wait_for_timeout(650); ev_reset(s)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="AutoSumMenu_Dropdown"]')
    K.press("ArrowDown"); K.press("ArrowDown"); s.page.wait_for_timeout(100); pas("X5_sageti", "C5")
    K.press("Enter"); s.page.wait_for_timeout(150); pas("X5_sageti_enter", "C5")
    K.press("Escape"); s.page.wait_for_timeout(100)
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
