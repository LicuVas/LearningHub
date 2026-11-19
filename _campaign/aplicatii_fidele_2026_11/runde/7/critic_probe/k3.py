# -*- coding: utf-8 -*-
"""Critic r7: tastatura in ferestre (Sort, Sort Warning, Column Width, Save As, Format Cells), redenumirea filei, lista Borders."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe")
from h import *
TABEL = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII B", "C2": 78, "A3": "Bogdan", "B3": "VIII A", "C3": 95,
         "A4": "Cristi", "B4": "VIII B", "C4": 95, "A5": "Dan", "B5": "VIII A", "C5": 60, "A6": "Elena", "B6": "VIII A", "C6": 88, "A7": "Flavia", "B7": "VIII B", "C7": 60}
out = {}
s = Sesiune()
K = s.page.keyboard
def ev(n=3): return ultimele_ev(s, n)
def foc(): return s.ev("()=>{const a=document.activeElement;if(!a)return null;const t=a.closest('[data-lh-tinta]');return (a.tagName+'|'+(a.getAttribute('data-lh-eticheta')||a.getAttribute('aria-label')||'')+'|'+(t?t.getAttribute('data-lh-tinta')+':'+(t.getAttribute('data-lh-id')||''):'')).slice(0,100)}")
def rec(k, **v): out[k] = v; print(k, json.dumps(v, ensure_ascii=False)[:1100])
def gol(): s.ev("()=>{window.__lhAplicatieEv&&(window.__lhAplicatieEv.length=0)}")
def dlg(): return s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata^=\"dialog\"]')].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-suprafata'))")
FOCUSABILE = """b=>{const d=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata="'+b+'"]');if(!d)return null;
 return [...d.querySelectorAll('button,input,select,textarea,[tabindex]')].filter(e=>e.tabIndex>=0&&e.getClientRects().length).map(e=>(e.tagName+':'+(e.getAttribute('data-lh-eticheta')||e.getAttribute('aria-label')||e.value||'')).slice(0,40))}"""
def taburi(n=4):
    f = []
    for i in range(n): K.press("Tab"); s.page.wait_for_timeout(80); f.append(foc())
    return f
def pauza(): s.page.wait_for_timeout(650)
def sel_txt(a): return s.ev("a=>{const x=LH.aplicatii.stare('excel').celule[a];return x?x.text:null}", a)
try:
    # ---------- Sort (Data > Sort...) cu tastatura
    deschide_cu(s, {"celule": TABEL, "selectie": "B3"})
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Data"], [data-lh-aplicatie] [data-lh-id-mso="TabData"]')
    gol(); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]'); s.page.wait_for_timeout(200)
    rec("sort_deschis", dialog=dlg(), foc=foc(), focusabile=s.ev(FOCUSABILE, "dialog.SortDialog"), ev=ev(1))
    K.press("Alt+ArrowDown"); s.page.wait_for_timeout(150)
    lista = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-lista-combo [role=option]')].map(e=>e.textContent)")
    rec("sort_alt_jos", lista=lista, foc=foc(), ev=ev(1))
    K.press("ArrowDown"); K.press("ArrowDown"); K.press("Enter"); s.page.wait_for_timeout(150)
    v0 = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-nivel=\"0\"] [data-lh-camp=\"coloana\"]');return e?e.getAttribute('data-lh-valoare'):null}")
    rec("sort_sageti_enter", coloana_nivel0=v0, dialog=dlg(), ev=ev(3))
    rec("sort_tab", focusuri=taburi(4), ev=ev(1))
    K.press("Alt+a"); s.page.wait_for_timeout(150)
    niv = s.ev("()=>document.querySelectorAll('[data-lh-aplicatie] [data-lh-nivel]').length")
    rec("sort_alt_a_add_level", niveluri=niv, ev=ev(1))
    K.press("Escape"); s.page.wait_for_timeout(150)
    rec("sort_esc", dialog=dlg(), foc=foc(), ev=ev(1))
    # Sort cu mouse pana la OK, apoi Enter (OK = butonul implicit) — eveniment: activat?
    gol(); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]'); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-nivel="0"] [data-lh-camp="coloana"]')
    clic_el(s, '[data-lh-aplicatie] .lh-ap-x-lista-combo [data-lh-eticheta="Punctaj"]')
    gol(); K.press("Enter"); s.page.wait_for_timeout(200)
    rec("sort_enter_ok", dialog=dlg(), C2=sel_txt("C2"), C7=sel_txt("C7"), A2=sel_txt("A2"), foc=foc(), ev=ev(2))
    # dupa inchidere: tastarea ajunge in celula activa?
    K.type("7"); s.page.wait_for_timeout(100)
    rec("dupa_sort_tastare", activa=s.stare()["selectie"], ed=s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed');return e?e.value:null}"), ev=ev(1))
    K.press("Escape"); K.press("Control+z")
    # ---------- Sort Warning: doar C2:C7, Data > Sort Largest to Smallest (Sort Z to A)
    pauza(); clic_cel(s, "C2"); s.page.keyboard.press("Shift+ArrowDown"); [K.press("Shift+ArrowDown") for _ in range(4)]
    gol(); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(200)
    rec("avert_deschis", dialog=dlg(), foc=foc(), focusabile=s.ev(FOCUSABILE, "dialog.SortWarning"),
        radio=s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortWarning\"] [data-lh-tip=\"RadioButton\"]')].map(e=>e.getAttribute('data-lh-eticheta')+'='+e.getAttribute('aria-checked'))"), ev=ev(1))
    K.press("ArrowDown"); s.page.wait_for_timeout(100)
    r1 = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortWarning\"] [data-lh-tip=\"RadioButton\"]')].map(e=>e.getAttribute('aria-checked'))")
    K.press("Alt+c"); s.page.wait_for_timeout(100)
    r2 = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortWarning\"] [data-lh-tip=\"RadioButton\"]')].map(e=>e.getAttribute('aria-checked'))")
    rec("avert_sageata_altc", dupa_sageata=r1, dupa_alt_c=r2, ev=ev(2))
    rec("avert_tab", focusuri=taburi(3))
    gol(); K.press("Enter"); s.page.wait_for_timeout(200)
    rec("avert_enter", dialog=dlg(), A2=sel_txt("A2"), C2=sel_txt("C2"), ev=ev(1))
    K.press("Control+z")
    # ---------- Column Width: clic dreapta pe antetul C > Column Width...
    pauza()
    b = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"antet_coloana\"][data-lh-id=\"C\"]');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    s.page.mouse.click(b[0], b[1], button="right"); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="meniu"][data-lh-id="Column Width..."], [data-lh-aplicatie] [data-lh-tinta="meniu:Column Width..."]')
    s.page.wait_for_timeout(200)
    rec("cw_deschis", dialog=dlg(), foc=foc(), focusabile=s.ev(FOCUSABILE, "dialog.ColumnWidth"))
    K.type("20"); gol(); K.press("Tab"); s.page.wait_for_timeout(100); f_tab = foc()
    K.press("Shift+Tab"); f_stab = foc()
    gol(); K.press("Enter"); s.page.wait_for_timeout(200)
    rec("cw_tab_enter", foc_dupa_tab=f_tab, foc_dupa_shift_tab=f_stab, dialog=dlg(), latimi=s.stare().get("latimi_coloane"), foc=foc(), ev=ev(2))
    # Alt+C in Column Width (tasta_acces din referinta: Edit 'Column width' ALT+C) — focusul pe OK intai
    s.page.mouse.click(b[0], b[1], button="right"); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="meniu"][data-lh-id="Column Width..."], [data-lh-aplicatie] [data-lh-tinta="meniu:Column Width..."]')
    gol(); K.press("Escape"); s.page.wait_for_timeout(150)
    rec("cw_esc", dialog=dlg(), foc=foc(), ev=ev(1))
    # ---------- Save As (F12)
    pauza(); clic_cel(s, "E1"); gol(); K.press("F12"); s.page.wait_for_timeout(250)
    rec("f12", dialog=dlg(), foc=foc(), focusabile=s.ev(FOCUSABILE, "dialog.FileSaveAs"), ev=ev(1))
    K.type("Clasa_8A"); K.press("Tab"); f1 = foc(); K.press("Alt+ArrowDown"); s.page.wait_for_timeout(150)
    tipuri = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [role=listbox] [role=option], [data-lh-aplicatie] .lh-ap-lista [data-lh-tip=ListItem]')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim()).slice(0,12)")
    rec("f12_tab_altjos", foc_dupa_tab=f1, lista_tip=tipuri, ev=ev(2), mesaj=mesaj(s))
    K.press("Escape"); s.page.wait_for_timeout(100)
    rec("f12_dupa_esc_lista", dialog=dlg(), foc=foc())
    # inapoi in File name: Alt+N (tasta_acces din referinta) si Enter
    K.press("Alt+n"); f2 = foc(); gol(); K.press("Enter"); s.page.wait_for_timeout(200)
    rec("f12_altn_enter", foc_dupa_alt_n=f2, dialog=dlg(), nume=s.stare().get("nume_fisier"), ev=ev(2))
    if dlg(): K.press("Escape")
    # ---------- Format Cells (clic dreapta pe celula > Format Cells...) si tastele lui
    pauza(); x, y = s.ev(CEL, "B2"); s.page.mouse.click(x, y, button="right"); s.page.wait_for_timeout(200)
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="meniu"][data-lh-id="Format Cells..."], [data-lh-aplicatie] [data-lh-tinta="meniu:Format Cells..."]')
    s.page.wait_for_timeout(200)
    rec("fc_deschis", dialog=dlg(), foc=foc(), focusabile=(s.ev(FOCUSABILE, "dialog.FormatCellsDialog") or [])[:10], mesaj=mesaj(s))
    gol(); K.press("Control+Tab"); s.page.wait_for_timeout(100)
    rec("fc_ctrl_tab", fila=s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata^=\"dialog.FormatCells\"] [data-lh-tip=TabItem][aria-selected=true]');return e?e.getAttribute('data-lh-eticheta'):null}"), ev=ev(1))
    gol(); K.press("Enter"); s.page.wait_for_timeout(150)
    rec("fc_enter", dialog=dlg(), mesaj=mesaj(s), ev=ev(1))
    if dlg(): K.press("Escape")
    # ---------- redenumirea filei: dublu clic, scrie cu diacritice, Enter; apoi Esc
    pauza()
    t = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"fila_foii\"]');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    s.page.mouse.dblclick(t[0], t[1]); s.page.wait_for_timeout(200)
    f0 = foc(); K.type("Notă"); gol(); K.press("Enter"); s.page.wait_for_timeout(150)
    rec("redenumire_enter", foc_la_inceput=f0, foi=s.stare().get("foi"), foc=foc(), ev=ev(2))
    pauza(); t = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"fila_foii\"]');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    s.page.mouse.dblclick(t[0], t[1]); s.page.wait_for_timeout(200)
    K.type("Altceva"); K.press("Escape"); s.page.wait_for_timeout(150)
    rec("redenumire_esc", foi=s.stare().get("foi"), foc=foc(), ev=ev(1))
    # clic dreapta pe fila > Rename (R din meniu) cu tastatura: tasta R
    t = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"fila_foii\"]');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    s.page.mouse.click(t[0], t[1], button="right"); s.page.wait_for_timeout(200)
    gol(); K.press("r"); s.page.wait_for_timeout(150)
    rec("meniu_fila_tasta_R", meniu_deschis=s.ev("()=>!!document.querySelector('[data-lh-aplicatie] .lh-ap-x-meniu')"), foc=foc(), A1=sel_txt("A1"), stare_ed=s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed');return e?e.value:null}"), ev=ev(2))
    K.press("Escape"); K.press("Escape")
    # meniul de clic dreapta pe celula: sageti + Enter
    pauza(); x, y = s.ev(CEL, "B3"); s.page.mouse.click(x, y, button="right"); s.page.wait_for_timeout(200)
    gol(); K.press("ArrowDown"); K.press("ArrowDown"); K.press("Enter"); s.page.wait_for_timeout(150)
    rec("meniu_celula_sageti", meniu_deschis=s.ev("()=>!!document.querySelector('[data-lh-aplicatie] .lh-ap-x-meniu')"), sel=s.stare()["selectie"], ev=ev(3), mesaj=mesaj(s))
    K.press("Escape")
    # ---------- lista Borders ▾: sageti / Enter / Esc
    pauza(); clic_cel(s, "A1"); clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Home"], [data-lh-aplicatie] [data-lh-id-mso="TabHome"]')
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="BordersGallery_Dropdown"]')
    gol(); K.press("ArrowDown"); K.press("Enter"); s.page.wait_for_timeout(150)
    rec("borders_sageti", lista=s.ev("()=>!!document.querySelector('[data-lh-aplicatie] .lh-ap-x-meniu-borduri')"), A1_fmt=(s.stare().get("format_celule") or {}).get("A1"), foc=foc(), ev=ev(2))
    gol(); K.press("Escape"); s.page.wait_for_timeout(100)
    rec("borders_esc", lista=s.ev("()=>!!document.querySelector('[data-lh-aplicatie] .lh-ap-x-meniu-borduri')"), ev=ev(1))
    rec("erori", e=s.erori)
finally:
    json.dump(out, open(P + "k3.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
