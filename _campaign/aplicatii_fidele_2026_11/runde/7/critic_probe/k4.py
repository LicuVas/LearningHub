# -*- coding: utf-8 -*-
"""Critic r7: Enter in ferestre fata de asistentul §6.3; Save As cu tastatura; Ctrl+S > Browse; File > Close / New; Sort pe niveluri; grafic; ####."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe")
from h import *
TABEL = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII B", "C2": 78, "A3": "Bogdan", "B3": "VIII A", "C3": 95,
         "A4": "Cristi", "B4": "VIII B", "C4": 95, "A5": "Dan", "B5": "VIII A", "C5": 60, "A6": "Elena", "B6": "VIII A", "C6": 88, "A7": "Flavia", "B7": "VIII B", "C7": 60}
out = {}
def rec(k, **v): out[k] = v; print(k, json.dumps(v, ensure_ascii=False)[:1200])
s = Sesiune()
K = s.page.keyboard
def ev(n=3): return ultimele_ev(s, n)
def pauza(): s.page.wait_for_timeout(650)
def dlg(): return s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata^=\"dialog\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-suprafata'))")
def foc(): return s.ev("()=>{const a=document.activeElement;if(!a)return null;const t=a.closest('[data-lh-tinta]');return (a.tagName+'|'+(a.getAttribute('data-lh-eticheta')||a.getAttribute('aria-label')||'')+'|'+(t?t.getAttribute('data-lh-tinta')+':'+(t.getAttribute('data-lh-id')||''):'')).slice(0,100)}")
def cw_deschide(col="C"):
    b = s.ev("c=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"antet_coloana\"][data-lh-id=\"'+c+'\"]');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", col)
    s.page.mouse.click(b[0], b[1], button="right"); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="meniu"][data-lh-id="Column Width..."], [data-lh-aplicatie] [data-lh-tinta="meniu:Column Width..."]'); s.page.wait_for_timeout(200)
def indicii(): return s.ev("()=>[...document.querySelectorAll('[data-lh-indiciu]')].map(e=>e.getAttribute('data-lh-pentru'))")
try:
    deschide_cu(s, {"celule": TABEL, "selectie": "B3"})
    # (a) butonul OK al ferestrei Column Width: ce tinta are clicul?
    cw_deschide("C"); clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="dialog.ColumnWidth"] [data-lh-eticheta="OK"]')
    rec("cw_clic_ok", ev=ev(1), dialog=dlg())
    # asistent cu pasul „OK in Column Width”; elevul scrie 20 si apasa Enter (de doua ori, pe doua deschideri)
    a = s.ev("()=>{window.__as=LH.aplicatii.asistent('excel',{pasi:[{tinta:'fereastra:OK',indiciu:'Apasă OK'},{tinta:'celula:A1',indiciu:'x'}],dupaGreseli:2,dupaSecunde:300});return window.__as.pas()}")
    cw_deschide("C"); K.type("20"); K.press("Enter"); s.page.wait_for_timeout(200)
    p1 = s.ev("()=>window.__as.pas()"); e1 = ev(1)
    cw_deschide("C"); K.type("22"); K.press("Enter"); s.page.wait_for_timeout(300)
    rec("asistent_cw_enter", pas_inainte=a, pas_dupa_enter1=p1, pas_dupa_enter2=s.ev("()=>window.__as.pas()"), ev_enter1=e1, ev_enter2=ev(1), indicii=indicii(), latimi=s.stare().get("latimi_coloane"))
    s.ev("()=>{window.__as.opreste();LH.aplicatii.ascunde()}")
    # acelasi asistent, pasul OK facut cu mouse-ul
    s.ev("()=>{window.__as=LH.aplicatii.asistent('excel',{pasi:[{tinta:'fereastra:OK',indiciu:'Apasă OK'},{tinta:'celula:A1',indiciu:'x'}],dupaGreseli:2,dupaSecunde:300})}")
    cw_deschide("C"); K.type("21"); clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="dialog.ColumnWidth"] [data-lh-eticheta="OK"]')
    rec("asistent_cw_clic", pas=s.ev("()=>window.__as.pas()"), ev=ev(1))
    s.ev("()=>{window.__as.opreste();LH.aplicatii.ascunde()}")
    # Sort: OK cu mouse vs Enter
    pauza(); clic_cel(s, "B3")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="TabData"]'); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]')
    clic_el(s, '[data-lh-aplicatie] [data-lh-nivel="0"] [data-lh-camp="coloana"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-combo [data-lh-eticheta="Nume"]')
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="dialog.SortDialog"] [data-lh-eticheta="OK"]')
    rec("sort_clic_ok", ev=ev(1))
    # (d) Sort pe niveluri cu mouse-ul: Clasa A-Z, apoi Punctaj descrescator (m2-l13:219)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]')
    clic_el(s, '[data-lh-aplicatie] [data-lh-nivel="0"] [data-lh-camp="coloana"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-combo [data-lh-eticheta="Clasa"]')
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="dialog.SortDialog"] [data-lh-eticheta="Add Level"]')
    clic_el(s, '[data-lh-aplicatie] [data-lh-nivel="1"] [data-lh-camp="coloana"]'); clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-combo [data-lh-eticheta="Punctaj"]')
    clic_el(s, '[data-lh-aplicatie] [data-lh-nivel="1"] [data-lh-camp="ordine"]')
    ord_l = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-lista-combo [role=option]')].map(e=>e.textContent)")
    clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-combo [data-lh-eticheta="Largest to Smallest"]')
    s.shot("k4_sort_niveluri.png")
    clic_el(s, '[data-lh-aplicatie] [data-lh-suprafata="dialog.SortDialog"] [data-lh-eticheta="OK"]')
    st = s.stare()["celule"]
    rec("X10_sort_niveluri", lista_ordine=ord_l, rezultat=[(st.get("A%d" % i) or {}).get("text") + "/" + (st.get("B%d" % i) or {}).get("text") + "/" + (st.get("C%d" % i) or {}).get("text") for i in range(2, 8)], ev=ev(1), mesaj=mesaj(s))
    # grafic (m2-l11)
    pauza(); clic_cel(s, "A1")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="TabInsert"]')
    ok = clic_el(s, '[data-lh-aplicatie] [data-lh-eticheta="Insert Column or Bar Chart"]')
    rec("X10_grafic", gasit=ok, mesaj=mesaj(s), ev=ev(1)); gol_mesaj(s); K.press("Escape")
    # (e) #### : latimea C = 1 caracter, apoi C3 (95)
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="TabHome"]')
    pauza(); clic_cel(s, "C3"); cw_deschide("C"); K.type("1"); K.press("Enter"); s.page.wait_for_timeout(150)
    rec("diez", C3=s.ev("a=>LH.aplicatii.stare('excel').celule[a]", "C3"), ecran=vezi(s, "C3")["text"], latimi=s.stare().get("latimi_coloane"))
    # (b) F12 cu tastatura: nume, Tab, Alt+N, Enter
    pauza(); clic_cel(s, "E1"); K.press("F12"); s.page.wait_for_timeout(250)
    K.type("Clasa_8A"); K.press("Tab"); f1 = foc(); K.press("Alt+n"); f2 = foc(); K.press("Alt+s"); s.page.wait_for_timeout(150)
    rec("f12_alt", foc_dupa_tab=f1, foc_dupa_alt_n=f2, dialog_dupa_alt_s=dlg(), nume=s.stare().get("nume_fisier"), ev=ev(2))
    if dlg():
        clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="camp:nume_fisier"] input'); K.press("Control+a"); K.type("Clasa_8A"); K.press("Enter"); s.page.wait_for_timeout(200)
        rec("f12_enter", dialog=dlg(), nume=s.stare().get("nume_fisier"), ev=ev(1))
    # (c) Ctrl+N, scriu, Ctrl+S > Browse > nume > Documente > Save; Ctrl+W; File > New > Blank; File > Close
    K.press("Control+n"); pauza(); scrie(s, "A1", "proba"); K.press("Control+s"); s.page.wait_for_timeout(250)
    ok = clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-backstage [data-lh-eticheta="Browse"]'); s.page.wait_for_timeout(250)
    d = dlg()
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="arbore:Documente"]')
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="camp:nume_fisier"] input'); K.press("Control+a"); K.type("Popescu_Ana_8A_lectia3"); K.press("Enter"); s.page.wait_for_timeout(200)
    x = s.stare(); rec("ctrl_s_browse", browse=ok, dialog=d, nume=x.get("nume_fisier"), registru=x.get("registru_activ"), ev=ev(2))
    K.press("Control+w"); x = s.stare(); rec("ctrl_w_dupa_salvare", registru_activ=x.get("registru_activ"), titlu=x.get("titlu_fereastra"), ev=ev(1), mesaj=mesaj(s))
    K.press("Control+w"); x = s.stare(); rec("ctrl_w_din_nou", registru_activ=x.get("registru_activ"), ev=ev(1))
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="FileTabButton"], [data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="File"]'); s.page.wait_for_timeout(200)
    nav = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-strat-backstage [data-lh-tip=ListItem]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta')+(e.getAttribute('aria-disabled')==='true'?'(gri)':''))")
    rec("backstage_fara_registru", nav=nav)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-backstage [data-lh-tip=ListItem][data-lh-eticheta="New"]'); s.page.wait_for_timeout(200)
    ok = clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-backstage [data-lh-eticheta="Blank workbook"]'); s.page.wait_for_timeout(200)
    x = s.stare(); rec("file_new_blank", gasit=ok, registru_activ=x.get("registru_activ"), ev=ev(1))
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="FileTabButton"]'); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] .lh-ap-strat-backstage [data-lh-tip=ListItem][data-lh-eticheta="Close"]'); s.page.wait_for_timeout(200)
    x = s.stare(); rec("file_close", registru_activ=x.get("registru_activ"), ev=ev(1))
    rec("erori", e=s.erori)
finally:
    json.dump(out, open(P + "k4.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
