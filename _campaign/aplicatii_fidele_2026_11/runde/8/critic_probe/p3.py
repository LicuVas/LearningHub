# -*- coding: utf-8 -*-
"""Critic r8 p3: X8 — Save this file, Save your changes (Save / Don't Save / Cancel / Esc / ✕), starea „modificat”, Ctrl+N, File › Close, Ctrl+Z dupa salvare."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
CH = ("dialog", "registru_activ", "registre", "nume_fisier", "titlu_fereastra", "pagina_backstage", "fereastra_mesaj", "selectie")
def pas(nume, *a):
    x = s.stare()
    out[nume] = {k: x.get(k) for k in CH}
    out[nume].update({"cel": {k: x["celule"].get(k) for k in a}, "dlg": dialog_vizibil(s), "focus": focus(s), "ev": ultimele_ev(s, 3), "mesaj": mesaj_tot(s),
                      "titlu_ecran": s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"bara_titlu\"]');return e?e.textContent.replace(/\s+/g,' ').trim().slice(0,80):null}")})
def dlg_text():
    return s.ev("()=>{const d=[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-strat-dialog')].filter(e=>e.getClientRects().length).pop();if(!d)return null;return [...d.querySelectorAll('[data-lh-tip]')].filter(e=>e.getClientRects().length&&/^(Text|Button|Edit|ComboBox|SplitButton)$/.test(e.getAttribute('data-lh-tip'))).map(e=>e.getAttribute('data-lh-tip')+':'+(e.getAttribute('data-lh-eticheta')||'')+(e.querySelector('input')?'='+e.querySelector('input').value:''))}")
try:
    # 1) registru nou gol (poligon fara continut): tastez x in A1, Ctrl+S
    deschide_cu(s, {"celule": {}, "selectie": "A1"})
    pas("0_gol_deschis")
    K.type("x"); K.press("Enter"); s.page.wait_for_timeout(150)
    K.press("Control+s"); s.page.wait_for_timeout(300); pas("1_ctrl_s_nou", "A1"); out["1_dlg_text"] = dlg_text(); s.shot("p3_save_this_file.png")
    K.press("Escape"); s.page.wait_for_timeout(200); pas("1b_esc", "A1")
    # Acces rapid Save
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="acces_rapid"][data-lh-id="Save"], [data-lh-aplicatie] [data-lh-tinta="acces_rapid:Save"]'); s.page.wait_for_timeout(300)
    pas("1c_qat_save"); 
    K.press("Control+a"); K.type("Tema_mea"); K.press("Enter"); s.page.wait_for_timeout(300); pas("2_save_enter", "A1")
    # Ctrl+W pe registrul salvat, nemodificat -> se inchide
    # intai modific: B1 = 5 ; Ctrl+W -> intrebare
    clic_cel(s, "B1"); s.page.wait_for_timeout(650); K.type("5"); K.press("Enter"); s.page.wait_for_timeout(150)
    K.press("Control+w"); s.page.wait_for_timeout(300); pas("3_ctrl_w_modificat_numit", "B1"); out["3_dlg_text"] = dlg_text(); s.shot("p3_save_changes_numit.png")
    K.press("Escape"); s.page.wait_for_timeout(200); pas("3b_esc", "B1")
    K.press("Control+w"); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Cancel"]'); pas("3c_cancel", "B1")
    # Ctrl+Z dupa salvare: anulez B1 -> e modificat? Ctrl+W
    K.press("Control+s"); s.page.wait_for_timeout(200); pas("4_ctrl_s_numit", "B1")
    K.press("Control+z"); s.page.wait_for_timeout(200); pas("4b_ctrl_z_dupa_salvare", "B1")
    K.press("Control+w"); s.page.wait_for_timeout(300); pas("4c_ctrl_w_dupa_undo", "B1")
    # 5) registru cu continut de pornire (fara nume) -> Ctrl+W
    deschide_cu(s, {"celule": {"A1": "x"}, "selectie": "A1"})
    pas("5_pornire_x")
    K.press("Control+w"); s.page.wait_for_timeout(300); pas("5b_ctrl_w", "A1"); out["5_dlg_text"] = dlg_text(); s.shot("p3_save_changes_nou.png")
    # Tab prin fereastra
    seq = []
    for i in range(8):
        K.press("Tab"); s.page.wait_for_timeout(80); seq.append(focus(s))
    out["5c_tab_seq"] = seq
    K.press("Escape"); s.page.wait_for_timeout(200); pas("5d_esc", "A1")
    # Don't Save
    K.press("Control+w"); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Don\'t Save"]'); pas("5e_dont_save", "A1")
    # acum Excel gol; Ctrl+N -> Book?
    K.press("Control+n"); s.page.wait_for_timeout(300); pas("6_ctrl_n_dupa_gol", "A1")
    K.type("y"); K.press("Enter"); s.page.wait_for_timeout(150)
    K.press("Control+n"); s.page.wait_for_timeout(300); pas("6b_ctrl_n_2", "A1")
    K.press("Control+w"); s.page.wait_for_timeout(300); pas("6c_ctrl_w_nemodificat", "A1")
    # File > Close pe registrul modificat
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="FileTabButton"]'); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] [data-lh-tip="ListItem"][data-lh-eticheta="Close"]'); s.page.wait_for_timeout(300); pas("7_file_close_modificat", "A1")
    # Save in intrebare -> File name -> scriu nume -> Save
    K.press("Control+a"); K.type("Robotica_8A"); s.page.wait_for_timeout(100)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Save"]'); s.page.wait_for_timeout(300); pas("7b_save", "A1")
    # More options in Save this file
    K.press("Control+n"); s.page.wait_for_timeout(300); K.type("z"); K.press("Enter"); K.press("Control+s"); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="More options…"]'); s.page.wait_for_timeout(300); pas("8_more_options", "A1")
    K.press("Escape"); s.page.wait_for_timeout(200); pas("8b_esc_backstage", "A1")
    # Choose a Location
    K.press("Control+s"); s.page.wait_for_timeout(300)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Open"]'); s.page.wait_for_timeout(200); pas("9_choose_location")
    K.press("Escape"); s.page.wait_for_timeout(200)
    # Save cu numele gol
    K.press("Control+s"); s.page.wait_for_timeout(300); K.press("Control+a"); K.press("Delete"); K.press("Enter"); s.page.wait_for_timeout(200); pas("10_save_nume_gol")
    K.press("Escape"); s.page.wait_for_timeout(150)
    # Save cu nume cu caractere interzise
    K.press("Control+s"); s.page.wait_for_timeout(300); K.press("Control+a"); K.type("a/b?c"); K.press("Enter"); s.page.wait_for_timeout(200); pas("11_save_nume_interzis")
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p3.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
