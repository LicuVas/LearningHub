# -*- coding: utf-8 -*-
"""Runda 29 (B-excel#3, unghiul stare_finala_erori): proba țintelor din supliment_B_excel_runda29.md, pe gesturi reale.
Headless, server 127.0.0.1 pe port liber, rețeaua tăiată în afară de 127.0.0.1/localhost (proba/hc29.py).
    python proba_grav.py --iesire <fisier.json>              # codul de azi; ultima linie = numărul verificărilor picate
    LH_VECHI=1 python proba_grav.py --iesire <fisier.json>   # codul de dinainte de rundă (runde/29/inainte/), servit prin rută
G = G25-1 (runde/25/critic.md:68): foile din viii/m1-l03 (:238-:269, atelierul :288, :306, :321) — Delete pe filă (cu date: întrebarea,
    goală: direct, singura: refuzul), Home › Delete ▾ › Delete Sheet, Move or Copy (lista foilor, OK, Create a copy), tragerea filei
    (și cu Ctrl), Tab Color › Standard Colors, Ctrl+Z după ștergere (m1-l03:239: nu aduce foaia);
P = Ctrl+PageDown / Ctrl+PageUp (R25-7, m1-l03:197, :230); A = MINOR 1 al criticului 25 (Alt într-o fereastră)."""
import argparse, json, os, sys, traceback
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/29/proba")
from hc29 import *

R = {}
LUNA = {"A1": "Nume", "A2": "Ana"}


def pune(id_, ok, **d):
    R[id_] = {"ok": bool(ok), **d}


def foi(s):
    x = s.stare(); return [x.get("foaie_activa"), x.get("foi")]


def tab(s, n):
    return s.ev("n=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"fila_foii\"][data-lh-id=\"'+n+'\"]');if(!e)return null;const b=e.getBoundingClientRect();return [b.x+b.width/2,b.y+b.height/2,b.left,b.right]}", n)


def meniu_fila(s, n, rand):
    xy = tab(s, n); s.page.mouse.click(xy[0], xy[1], button="right"); s.page.wait_for_timeout(350)
    ok = clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="meniu_contextual.fila_foii"] [data-lh-eticheta="%s"]' % rand); s.page.wait_for_timeout(350)
    return ok


def texte_dialog(s):
    return s.ev("()=>{const d=[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-strat-dialog')].filter(e=>e.getClientRects().length).pop();if(!d)return null;"
                "return {texte:[...d.querySelectorAll('[data-lh-tip=\"Text\"]')].map(e=>e.textContent.trim()),butoane:[...d.querySelectorAll('[data-lh-tip=\"Button\"]')].filter(e=>!e.closest('[data-lh-tip=\"TitleBar\"]')).map(e=>e.getAttribute('data-lh-eticheta')),"
                "focus:document.activeElement&&d.contains(document.activeElement)?(document.activeElement.closest('[data-lh-eticheta]')||{getAttribute:()=>null}).getAttribute('data-lh-eticheta'):null}}")


def buton_dialog(s, et):
    return clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="Button"][data-lh-eticheta="%s"]' % et)


def ultim(s):
    e = ev_toate(s); return e[-1] if e else None


def are_ev(evs, gest, act, tinta=None):
    return any(e[0] == gest and e[1] == act and (tinta is None or e[2] == tinta) for e in evs)


def fara_nesimulat(evs):
    return not any(e[1] == "nesimulat" for e in evs)


def lista_mc(s):
    return s.ev("()=>{const d=document.querySelector('[data-lh-aplicatie] .lh-ap-strat-dialog');return d?[...d.querySelectorAll('[data-lh-tip=\"ListItem\"]')].filter(e=>e.getClientRects().length).map(e=>[e.getAttribute('data-lh-eticheta'),e.hasAttribute('data-lh-selectat')]):null}")


def stil_fila(s, n):
    return s.ev("n=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"fila_foii\"][data-lh-id=\"'+n+'\"]');if(!e)return null;const c=getComputedStyle(e);return {bg:c.backgroundColor,bs:c.boxShadow}}", n)


def trage_fila(s, de, la_x, ctrl=False):
    a = tab(s, de)
    if ctrl: s.page.keyboard.down("Control")
    s.page.mouse.move(a[0], a[1]); s.page.mouse.down(); s.page.mouse.move(la_x, a[1], steps=10); s.page.mouse.up(); s.page.wait_for_timeout(350)
    if ctrl: s.page.keyboard.up("Control")


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--iesire", required=True); a = ap.parse_args()
    s = Sesiune(); K = s.page.keyboard
    try:
        PATRU = {"foi": [{"nume": "Septembrie", "celule": LUNA}, {"nume": "Ciornă", "celule": {"A1": "de șters"}}, {"nume": "Noiembrie", "celule": LUNA}, {"nume": "Octombrie", "celule": LUNA}], "selectie": "A1"}
        # ---- G1-G4: m1-l03:247 — Ciornă (cu date) › Delete: întrebarea; Cancel o păstrează; Delete o șterge; Ctrl+Z n-o aduce (:239)
        deschide_cu(s, PATRU)
        ev_reset(s); meniu_fila(s, "Ciornă", "Delete")
        td = texte_dialog(s); e1 = ev_toate(s); st1 = s.stare()
        pune("G1_delete_cu_date_intreaba", td and any("permanently delete this sheet" in t for t in td["texte"]) and td["butoane"] == ["Delete", "Cancel"]
             and st1["foi"] == ["Septembrie", "Ciornă", "Noiembrie", "Octombrie"] and (st1.get("dialog") or {}).get("butoane") == ["Delete", "Cancel"]
             and fara_nesimulat(e1) and td["focus"] == "Delete", dialog=td, ev=e1, foi=st1["foi"], dialog_stare=st1.get("dialog"), mesaj=mesaj_tot(s))
        ev_reset(s); okc = buton_dialog(s, "Cancel"); e2 = ev_toate(s)
        pune("G2_cancel_pastreaza", okc and foi(s)[1] == ["Septembrie", "Ciornă", "Noiembrie", "Octombrie"] and not dialog_vizibil(s) and are_ev(e2, "clic", "anulare", "fereastra:Cancel"),
             ev=e2, foi=foi(s), dialog=dialog_vizibil(s))
        # o celulă tastată ÎNAINTE de ștergere (ca Ctrl+Z să aibă ce anula, dacă istoricul ar rămâne)
        fila_x(s, "Home"); s.page.wait_for_timeout(200)
        xy = tab(s, "Septembrie"); s.page.mouse.click(xy[0], xy[1]); s.page.wait_for_timeout(250)
        scrie(s, "B2", "9")
        meniu_fila(s, "Ciornă", "Delete"); ev_reset(s); okd = buton_dialog(s, "Delete"); e3 = ev_toate(s); f3 = foi(s)
        pune("G3_delete_sterge", okd and f3[1] == ["Septembrie", "Noiembrie", "Octombrie"] and not dialog_vizibil(s) and are_ev(e3, "clic", "stergere_foaie", "fereastra:Delete"),
             ev=e3, foi=f3)
        ev_reset(s); K.press("Control+z"); s.page.wait_for_timeout(300); e4 = ev_toate(s); st4 = s.stare()
        # după ștergerea foii active (Ciornă, aleasă de clicul dreapta) e activă vecina din dreapta, Noiembrie; B2 = 9 rămâne pe Septembrie
        xy = tab(s, "Septembrie"); s.page.mouse.click(xy[0], xy[1]); s.page.wait_for_timeout(250); b2 = (s.stare()["celule"].get("B2") or {})
        pune("G4_ctrl_z_nu_aduce_foaia", st4["foi"] == ["Septembrie", "Noiembrie", "Octombrie"] and st4["foaie_activa"] == "Noiembrie" and fara_nesimulat(e4) and not mesaj_tot(s)
             and b2.get("valoare") in (9, "9") and e4 and e4[-1][1] == "fara_efect", ev=e4, foi=[st4["foaie_activa"], st4["foi"]], B2_septembrie=b2, mesaj=mesaj_tot(s))
        # ---- G5: m1-l03:243, :321 — o foaie goală dispare fără întrebare
        deschide_cu(s, {"foi": [{"nume": "Note", "celule": {"A1": "Elev", "B1": "Nota"}}, {"nume": "Sheet2", "celule": {}}], "selectie": "A1"})
        ev_reset(s); meniu_fila(s, "Sheet2", "Delete"); e5 = ev_toate(s); f5 = foi(s)
        pune("G5_goala_direct", f5 == ["Note", ["Note"]] and not dialog_vizibil(s) and are_ev(e5, "clic", "stergere_foaie", "meniu:Delete"), ev=e5, foi=f5)
        # ---- G6: m1-l03:266 — singura foaie: Excel refuză (fereastra lui, OK), foaia rămâne
        deschide_cu(s, {"foi": [{"nume": "Septembrie", "celule": LUNA}], "selectie": "A1"})
        ev_reset(s); meniu_fila(s, "Septembrie", "Delete"); td6 = texte_dialog(s); e6 = ev_toate(s); st6 = s.stare()
        ok6 = td6 and any("at least one visible worksheet" in t for t in td6["texte"]) and td6["butoane"] == ["OK"] and st6["foi"] == ["Septembrie"] and fara_nesimulat(e6)
        ev_reset(s); okk = buton_dialog(s, "OK"); e6b = ev_toate(s)
        pune("G6_singura_refuz", ok6 and okk and not dialog_vizibil(s) and foi(s)[1] == ["Septembrie"] and (st6.get("fereastra_mesaj") or {}).get("butoane") == ["OK"],
             dialog=td6, ev=e6, ev_ok=e6b, foi=st6["foi"], mesaj_stare=st6.get("fereastra_mesaj"))
        # ---- G7: Home › Delete ▾ › Delete Sheet = același drum (supliment, ținta 1)
        deschide_cu(s, PATRU); xy = tab(s, "Ciornă"); s.page.mouse.click(xy[0], xy[1]); s.page.wait_for_timeout(250)
        fila_x(s, "Home"); s.page.wait_for_timeout(250); ev_reset(s)
        okd7 = clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="panglica.TabHome"] [data-lh-id-mso="TableDeleteRowsAndColumnsMenu_Dropdown"]'); s.page.wait_for_timeout(350)
        rows7 = s.ev("()=>{const m=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata^=\"lista.\"]')].filter(e=>e.getClientRects().length).pop();return m?[m.getAttribute('data-lh-suprafata'),[...m.querySelectorAll('[data-lh-eticheta]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta'))]:null}")
        okl = clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata^="lista."] [data-lh-eticheta="Delete Sheet"]'); s.page.wait_for_timeout(350)
        td7 = texte_dialog(s); buton_dialog(s, "Delete"); e7 = ev_toate(s); f7 = foi(s)
        pune("G7_home_delete_sheet", okd7 and okl and td7 and "Delete" in td7["butoane"] and f7[1] == ["Septembrie", "Noiembrie", "Octombrie"] and fara_nesimulat(e7)
             and are_ev(e7, "meniu_derulant", "meniu_derulant") and are_ev(e7, "clic", "stergere_foaie", "fereastra:Delete"), lista=rows7, dialog=td7, ev=e7, foi=f7)
        # ---- G8: Move or Copy — lista are foile registrului; Noiembrie › OK → Octombrie înaintea lui Noiembrie (m1-l03:247, :240)
        ev_reset(s); meniu_fila(s, "Octombrie", "Move or Copy..."); l8 = lista_mc(s)
        okn = clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="ListItem"][data-lh-eticheta="Noiembrie"]'); l8b = lista_mc(s)
        oko = buton_dialog(s, "OK"); e8 = ev_toate(s); f8 = foi(s)
        pune("G8_move_or_copy_muta", l8 and [x[0] for x in l8] == ["Septembrie", "Noiembrie", "Octombrie", "(move to end)"] and okn and oko
             and f8 == ["Octombrie", ["Septembrie", "Octombrie", "Noiembrie"]] and not dialog_vizibil(s) and are_ev(e8, "clic", "mutare_foaie", "fereastra:OK") and fara_nesimulat(e8),
             lista=l8, lista_dupa_clic=l8b, ev=e8, foi=f8)
        # ---- G9: Create a copy + (move to end) → „Septembrie (2)”, la sfârșit, activă, cu aceleași date (m1-l03:244, :255)
        ev_reset(s); meniu_fila(s, "Septembrie", "Move or Copy...")
        clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip="ListItem"][data-lh-eticheta="(move to end)"]')
        okb = clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-eticheta="Create a copy"]'); bif = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-strat-dialog [data-lh-tip=\"CheckBox\"]');return e?e.getAttribute('aria-checked'):null}")
        buton_dialog(s, "OK"); e9 = ev_toate(s); st9 = s.stare()
        pune("G9_copie_la_sfarsit", st9["foi"] == ["Septembrie", "Octombrie", "Noiembrie", "Septembrie (2)"] and st9["foaie_activa"] == "Septembrie (2)" and bif == "true"
             and (st9["celule"].get("A2") or {}).get("valoare") == "Ana" and are_ev(e9, "clic", "copiere_foaie", "fereastra:OK") and fara_nesimulat(e9),
             ev=e9, foi=[st9["foaie_activa"], st9["foi"]], A2=st9["celule"].get("A2"), bifat=bif)
        # ---- G10: Tab Color › Green (Standard Colors) — m1-l03:220; fila neactivă e plină de culoare (:204)
        ev_reset(s); meniu_fila(s, "Octombrie", "Tab Color"); s.page.wait_for_timeout(200)
        sub = s.ev("()=>{const m=document.querySelector('[data-lh-aplicatie] [data-lh-submeniu]');return m?[m.getAttribute('data-lh-suprafata'),[...m.querySelectorAll('[data-lh-eticheta]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta')).filter(x=>/^(Standard Colors|Green|Red|Yellow|No Color|More Colors...)$/.test(x))]:null}")
        okg = clic_el(s, '[data-lh-aplicatie] [data-lh-submeniu] [data-lh-eticheta="Green"]'); s.page.wait_for_timeout(250)
        xy = tab(s, "Septembrie"); s.page.mouse.click(xy[0], xy[1]); s.page.wait_for_timeout(250)
        e10 = ev_toate(s); st10 = s.stare(); sf = stil_fila(s, "Octombrie")
        pune("G10_tab_color_green", okg and st10.get("culori_file") == {"Octombrie": "#00B050"} and sf and sf["bg"] == "rgb(0, 176, 80)" and are_ev(e10, "clic", "culoare_fila", "meniu:Green")
             and fara_nesimulat(e10), submeniu=sub, ev=e10, culori=st10.get("culori_file"), stil=sf)
        # ---- G11: tragerea filei mută foaia (m1-l03:240); G12: Ctrl + tragere o copiază (:244)
        deschide_cu(s, PATRU); ev_reset(s)
        sx = tab(s, "Ciornă"); trage_fila(s, "Octombrie", sx[2] + 4)
        e11 = ev_toate(s); f11 = foi(s)
        pune("G11_tragere_muta", f11[1] == ["Septembrie", "Octombrie", "Ciornă", "Noiembrie"] and are_ev(e11, "tragere", "mutare_foaie", "fila_foii:Octombrie") and len(e11) == 1,
             ev=e11, foi=f11)
        ev_reset(s); nx = tab(s, "Noiembrie"); trage_fila(s, "Septembrie", nx[3] + 8, ctrl=True)
        e12 = ev_toate(s); st12 = s.stare()
        pune("G12_ctrl_tragere_copiaza", st12["foi"] == ["Septembrie", "Octombrie", "Ciornă", "Noiembrie", "Septembrie (2)"] and st12["foaie_activa"] == "Septembrie (2)"
             and are_ev(e12, "tragere", "copiere_foaie", "fila_foii:Septembrie"), ev=e12, foi=[st12["foaie_activa"], st12["foi"]])
        # ---- P: Ctrl+PageDown ×6 din prima foaie → a patra, pe loc (m1-l03:230); Ctrl+PageUp ×6 → prima
        deschide_cu(s, {"foi": [{"nume": n, "celule": LUNA} for n in ("Septembrie", "Octombrie", "Noiembrie", "Decembrie")], "selectie": "A1"})
        clic_cel(s, "A1"); ev_reset(s)
        pas = []
        for _ in range(6): K.press("Control+PageDown"); s.page.wait_for_timeout(120); pas.append(s.stare()["foaie_activa"])
        e13 = ev_toate(s); a13 = s.stare()["selectie"]
        pune("P1_ctrl_pgdn", pas == ["Octombrie", "Noiembrie", "Decembrie", "Decembrie", "Decembrie", "Decembrie"] and len(e13) == 6 and all(x[0] == "tasta_pagina" for x in e13)
             and [x[1] for x in e13] == ["foaie_urmatoare"] * 3 + ["fara_efect"] * 3, pasi=pas, ev=e13, selectie=a13)
        ev_reset(s); pas2 = []
        for _ in range(6): K.press("Control+PageUp"); s.page.wait_for_timeout(120); pas2.append(s.stare()["foaie_activa"])
        e14 = ev_toate(s)
        pune("P2_ctrl_pgup", pas2 == ["Noiembrie", "Octombrie", "Septembrie", "Septembrie", "Septembrie", "Septembrie"] and [x[1] for x in e14] == ["foaie_anterioara"] * 3 + ["fara_efect"] * 3,
             pasi=pas2, ev=e14)
        # ---- A: Alt apăsat și eliberat într-o fereastră (Format Cells) → arata_taste_acces (MINOR 1 critic 25)
        clic_cel(s, "B2"); s.page.mouse.click(*s.ev(CEL, "B2"), button="right"); s.page.wait_for_timeout(300)
        clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="meniu_contextual.celula"] [data-lh-eticheta="Format Cells..."]'); s.page.wait_for_timeout(300)
        ev_reset(s); K.press("Alt"); s.page.wait_for_timeout(200); e15 = ev_toate(s); dv = dialog_vizibil(s)
        pune("A1_alt_in_fereastra", len(e15) == 1 and e15[0][1] == "arata_taste_acces" and dv, ev=e15, dialog=dv)
        K.press("Escape"); s.page.wait_for_timeout(200)
        # ---- G13: tastele în întrebarea ștergerii: Esc = Cancel, Enter = Delete (butonul cu focusul)
        deschide_cu(s, PATRU); meniu_fila(s, "Ciornă", "Delete"); ev_reset(s); K.press("Escape"); s.page.wait_for_timeout(250)
        e16 = ev_toate(s); f16 = foi(s)[1]
        meniu_fila(s, "Ciornă", "Delete"); s.page.wait_for_timeout(150); ev_reset(s); K.press("Enter"); s.page.wait_for_timeout(300)
        e17 = ev_toate(s); f17 = foi(s)[1]
        pune("G13_taste_intrebare", f16 == ["Septembrie", "Ciornă", "Noiembrie", "Octombrie"] and f17 == ["Septembrie", "Noiembrie", "Octombrie"]
             and are_ev(e17, "tasta_enter", "stergere_foaie"), esc=[e16, f16], enter=[e17, f17])
        # ---- G14: meniul filei › Insert... NU deschide fereastra celulelor (Insert Cells), ci mesajul central
        ev_reset(s); meniu_fila(s, "Septembrie", "Insert..."); dv14 = dialog_vizibil(s); e18 = ev_toate(s)
        pune("G14_insert_fila_nu_celule", "dialog.CellsInsertDialog" not in (dv14 or []), dialog=dv14, ev=e18, mesaj=mesaj_tot(s))
        gol_mesaj(s)
        # ---- G15 (unghiul stare_finala_erori): redenumirea cu numele altei foi (m1-l03:226-229 „citește mesajul”) → mesajul Excel,
        #      fila neschimbată; OK (Enter) → fila revine în redenumire cu textul tastat; Esc → numele vechi
        deschide_cu(s, {"foi": [{"nume": "Septembrie", "celule": LUNA}, {"nume": "Noiembrie", "celule": LUNA}], "selectie": "A1"})
        xy = tab(s, "Noiembrie"); s.page.mouse.dblclick(xy[0], xy[1]); s.page.wait_for_timeout(300); ev_reset(s)
        K.type("septembrie"); K.press("Enter"); s.page.wait_for_timeout(300)
        td15 = texte_dialog(s); e19 = ev_toate(s); st15 = s.stare()
        K.press("Enter"); s.page.wait_for_timeout(300)
        inp = s.ev("()=>{const i=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ff-in');return i?[i.value,document.activeElement===i]:null}"); dv15 = dialog_vizibil(s)
        K.press("Escape"); s.page.wait_for_timeout(250); f15 = foi(s)
        pune("G15_nume_existent_mesaj", td15 and any("already taken" in t for t in td15["texte"]) and td15["butoane"] == ["OK"] and st15["foi"] == ["Septembrie", "Noiembrie"]
             and e19 and e19[-1][:3] == ["tasta_enter", "nume_existent", "fila_foii:Noiembrie"] and inp == ["septembrie", True] and not dv15 and f15[1] == ["Septembrie", "Noiembrie"],
             dialog=td15, ev=e19, dialog_stare=st15.get("dialog"), dupa_ok=inp, foi_final=f15)
        R["erori"] = list(s.erori)
    except Exception:
        R["exceptie"] = traceback.format_exc()[-1500:]; R["erori"] = list(s.erori)
    finally:
        s.gata()
    json.dump(R, open(a.iesire, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    pic = [k for k, v in R.items() if isinstance(v, dict) and not v.get("ok")]
    for k, v in R.items():
        if isinstance(v, dict): print(("OK   " if v.get("ok") else "PICA ") + k)
    if R.get("exceptie") or R.get("erori"): print("EXCEPTIE/ERORI:", R.get("exceptie", "")[-400:], R.get("erori"))
    print(len(pic) + (1 if R.get("exceptie") or R.get("erori") else 0))


if __name__ == "__main__":
    main()
