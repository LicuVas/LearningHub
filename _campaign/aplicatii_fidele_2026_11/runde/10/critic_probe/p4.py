# -*- coding: utf-8 -*-
"""Critic r10 p4: unghiul GEST_TASTATURA pe Excel (1366x768): Esc in Sort pe Then by, Enter/Tab in grila si intr-o zona aleasa,
Ctrl+sageti/Home/End, diacritice, bara de formule, Ctrl+Shift+%, Ctrl+C/V/X + Esc, Alt, J, C (graficul), Change Chart Type din
taste, Ctrl+S / F12; plus asistentul §6.3 pe telefon cu titlul graficului (tinta tastelor venite prin caseta de intrare)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe")
from h import *
out = {}
TAB = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 88, "A3": "Bogdan", "B3": "VIII B", "C3": 95, "A4": "Carmen", "B4": "VIII A", "C4": 60,
       "A5": "Dan", "B5": "VIII B", "C5": 78, "A6": "Elena", "B6": "VIII A", "C6": 95, "A7": "Florin", "B7": "VIII B", "C7": 60}
CARTI = {"A1": "Elev", "B1": "Cărți citite", "A2": "Ana", "B2": 6, "A3": "Bogdan", "B3": 4, "A4": "Carla", "B4": 9, "A5": "Dan", "B5": 3, "A6": "Elena", "B6": 7}
FOC = "()=>{const a=document.activeElement;const t=a&&a.closest('[data-lh-tip]');const n=a&&a.closest('[data-lh-nivel]');return t?[t.getAttribute('data-lh-tip'),t.getAttribute('data-lh-eticheta'),n?n.getAttribute('data-lh-nivel'):null]:[a&&a.tagName]}"
FX = "()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"bara_formule\"]');if(!e)return null;const i=e.matches('input,textarea')?e:e.querySelector('input,textarea');return i?i.value:e.textContent}"
s = Sesiune(); K = s.page.keyboard; cdp0 = s.ctx.new_cdp_session(s.page)
def ro(ch):
    """o tasta de pe tastatura romaneasca (Windows: ă = BracketLeft): keyDown cu key si text, apoi keyUp"""
    cdp0.send("Input.dispatchKeyEvent", {"type": "keyDown", "key": ch, "text": ch, "unmodifiedText": ch, "code": "BracketLeft", "windowsVirtualKeyCode": 219})
    cdp0.send("Input.dispatchKeyEvent", {"type": "keyUp", "key": ch, "code": "BracketLeft", "windowsVirtualKeyCode": 219})
def sel(): return s.stare().get("selectie")
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(200)
def k(*t, w=120):
    for x in t: K.press(x); s.page.wait_for_timeout(w)
try:
    # 1. Esc in Sort cu focusul pe Then by
    deschide_cu(s, {"celule": TAB, "selectie": "A2"}); clic_cel(s, "A3"); fila("Data")
    clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]'); s.page.wait_for_timeout(350)
    k("Alt+a"); out["1_alt_a"] = s.ev(FOC)
    for i in range(12):
        f = s.ev(FOC)
        if f[0] == "ComboBox" and f[1] == "Then by": break
        k("Tab", w=60)
    out["1_tab_then_by"] = s.ev(FOC)
    ev_reset(s); k("Escape", w=250); out["1_esc"] = {"ev": ultimele_ev(s, 1), "dlg": dialog_vizibil(s), "focus": focus(s)}
    # 2. Enter / Tab / Shift+Tab / Shift+Enter in grila; Enter intr-o zona aleasa
    deschide_cu(s, {"celule": TAB, "selectie": "A1"}); clic_cel(s, "B2")
    r = []
    for t in ["Tab", "Tab", "Enter", "Shift+Tab", "Shift+Enter"]:
        k(t); r.append([t, sel()["activa"]])
    out["2_tab_enter"] = r
    clic_cel(s, "B2"); k("Shift+ArrowRight", "Shift+ArrowDown", "Shift+ArrowDown")
    r = [["zona", sel()]]
    for t in ["Enter", "Enter", "Enter", "Tab", "Shift+Enter"]:
        k(t); r.append([t, sel()])
    out["2_enter_in_zona"] = r
    # 3. Ctrl+sageti, Ctrl+Home, Ctrl+End, Ctrl+Shift+sageti, Shift+sageti din editare
    clic_cel(s, "A1"); r = []
    for t in ["Control+ArrowDown", "Control+ArrowDown", "Control+ArrowUp", "Control+ArrowRight", "Control+Home", "Control+End", "Control+Shift+Home"]:
        k(t); r.append([t, sel()])
    out["3_ctrl_sageti"] = r
    out["3_ev"] = ultimele_ev(s, 2)
    # 4. diacritice: tastate ca pe tastatura romaneasca (keydown cu key 'ă') si prin insertText
    clic_cel(s, "E2"); ev_reset(s)
    for ch in ["M", "ă", "d", "ă", "l", "i", "n", "a"]:
        (ro(ch) if ord(ch) > 127 else K.press(ch)); s.page.wait_for_timeout(40)
    out["4_in_editare"] = {"fx": s.ev(FX), "ecran": ecran(s, "E2"), "ev": ultimele_ev(s, 2)}
    k("Enter"); out["4_dupa"] = {"E2": (s.stare()["celule"].get("E2") or {}).get("text"), "sel": sel()}
    clic_cel(s, "E3"); K.type("Țară"); k("Enter"); out["4_type"] = (s.stare()["celule"].get("E3") or {}).get("text")
    # 5. bara de formule: clic in ea, tastez, Enter / Esc
    clic_cel(s, "F2"); clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="bara_formule"]'); ev_reset(s)
    K.type("=C2*2"); out["5_fx_tastare"] = {"fx": s.ev(FX), "ecran_F2": ecran(s, "F2"), "ev": ultimele_ev(s, 1), "focus": focus(s)}
    k("Enter"); out["5_fx_enter"] = {"F2": s.stare()["celule"].get("F2"), "sel": sel(), "ev": ultimele_ev(s, 1)}
    clic_cel(s, "F3"); clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="bara_formule"]'); K.type("abc"); k("Escape")
    out["5_fx_esc"] = {"F3": s.stare()["celule"].get("F3"), "sel": sel(), "ev": ultimele_ev(s, 1)}
    # 6. Ctrl+Shift+% pe C2; Ctrl+C / Ctrl+V; Esc stinge furnicile; Ctrl+X / Ctrl+V
    clic_cel(s, "C2"); ev_reset(s); k("Control+Shift+Digit5"); out["6_procent"] = {"C2": s.stare()["celule"].get("C2"), "ev": ultimele_ev(s, 1)}
    k("Control+z")
    clic_cel(s, "C2"); k("Shift+ArrowDown", "Control+c"); clic_cel(s, "H2"); k("Control+v")
    out["6_copiere"] = {"H2": (s.stare()["celule"].get("H2") or {}).get("text"), "H3": (s.stare()["celule"].get("H3") or {}).get("text"), "ev": ultimele_ev(s, 2)}
    k("Escape"); out["6_esc"] = ultimele_ev(s, 1)
    # 7. graficul din taste: Alt, J, C (Chart Design), Alt, J, C, C (Change Chart Type), in fereastra: Tab, sageti, Enter, Esc
    deschide_cu(s, {"celule": CARTI, "selectie": "A1"}); clic_cel(s, "A1")
    for t in ["Alt", "n", "c", "ArrowDown", "Enter"]: K.press(t); s.page.wait_for_timeout(220)
    out["7_inserat"] = {"n": len(s.stare().get("grafice") or []), "fila": s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"fila\"][aria-selected=\"true\"]');return e?e.getAttribute('data-lh-id'):null}")}
    ev_reset(s); K.press("Alt"); s.page.wait_for_timeout(250); out["7_alt_kt"] = keytips(s)
    K.press("j"); s.page.wait_for_timeout(200); out["7_alt_j"] = {"kt": keytips(s), "ev": ultimele_ev(s, 1)}
    K.press("c"); s.page.wait_for_timeout(250); out["7_alt_j_c"] = {"kt": keytips(s), "ev": ultimele_ev(s, 1)}
    K.press("c"); s.page.wait_for_timeout(350); out["7_alt_j_c_c"] = {"dlg": dialog_vizibil(s), "focus": focus(s), "ev": ultimele_ev(s, 1)}
    r = []
    for t in ["Tab", "Tab", "Tab", "ArrowDown", "ArrowDown"]:
        K.press(t); s.page.wait_for_timeout(150); r.append([t, focus(s), ultimele_ev(s, 1)[0]["actiune"] if ultimele_ev(s, 1) else None])
    out["7_cct_taste"] = r
    ev_reset(s); K.press("Escape"); s.page.wait_for_timeout(250)
    out["7_cct_esc"] = {"dlg": dialog_vizibil(s), "focus": focus(s), "ev": ultimele_ev(s, 1), "tip": [g["tip"] for g in s.stare().get("grafice") or []], "ales": s.ev("()=>!!document.querySelector('[data-lh-aplicatie] .lh-ap-x-gr-ales')")}
    # dupa Esc din fereastra: Delete sterge graficul? (focusul a ramas pe grafic?)
    ev_reset(s); K.press("Delete"); s.page.wait_for_timeout(200)
    out["7_delete_dupa_esc"] = {"n": len(s.stare().get("grafice") or []), "ev": ultimele_ev(s, 1)}
    # 8. Ctrl+S pe registrul nou, Esc; F12, Esc
    deschide_cu(s, {"celule": TAB, "selectie": "A1"}); clic_cel(s, "A1"); K.type("x"); k("Enter")
    ev_reset(s); k("Control+s", w=350); out["8_ctrl_s"] = {"dlg": dialog_vizibil(s), "focus": focus(s), "ev": ultimele_ev(s, 1)}
    k("Escape", w=250); out["8_esc"] = {"dlg": dialog_vizibil(s), "ev": ultimele_ev(s, 1), "focus": focus(s)}
    k("F12", w=350); out["8_f12"] = {"dlg": dialog_vizibil(s), "focus": focus(s), "ev": ultimele_ev(s, 1)}
    k("Escape", w=250); out["8_f12_esc"] = {"dlg": dialog_vizibil(s), "ev": ultimele_ev(s, 1)}
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p4.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
# 9. asistentul §6.3 pe telefon: pasul „scrie titlul” (tinta grafic:1/titlu); tastatura telefonului (insertText)
s = Sesiune(375, 667, mobil=True); K = s.page.keyboard; r = {}
cdp = s.ctx.new_cdp_session(s.page)
try:
    deschide_cu(s, {"celule": CARTI, "selectie": "A1"})
    def tapsel(sel):
        s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(e)e.scrollIntoView({block:'nearest',inline:'nearest'})}", sel); s.page.wait_for_timeout(150)
        b = s.ev("s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", sel)
        s.page.touchscreen.tap(*b); s.page.wait_for_timeout(350)
    tapsel('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="A1"]')
    tapsel('[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="Insert"], [data-lh-aplicatie] [data-lh-tinta="fila:Insert"]')
    tapsel('[data-lh-aplicatie] [data-lh-id-mso="ChartTypeColumnInsertGallery"]')
    b = s.ev("s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", '[data-lh-aplicatie] [data-lh-suprafata="lista.ChartTypeColumnInsertGallery"] [data-lh-eticheta="Clustered Column"]')
    s.page.touchscreen.tap(*b); s.page.wait_for_timeout(400)
    s.ev("()=>{window.__as=LH.aplicatii.asistent('excel',{pasi:[{tinta:'grafic:1/titlu',indiciu:'Atinge titlul'},{tinta:'grafic:1/titlu',indiciu:'Scrie titlul si apasa Enter',asteapta:e=>e.actiune==='titlu_grafic'}],dupaGreseli:2,dupaSecunde:300})}")
    tb = s.ev("()=>{const t=document.querySelector('[data-lh-aplicatie] .lh-ap-x-grafic [data-lh-tinta$=\"/titlu\"]');const q=t.getBoundingClientRect();return [q.x+q.width/2,q.y+q.height/2]}")
    s.page.touchscreen.tap(*tb); s.page.wait_for_timeout(300)
    r["dupa_atingere_titlu"] = {"pas": s.ev("()=>window.__as.pas()"), "indiciu": s.ev("()=>document.querySelectorAll('[data-lh-indiciu]').length")}
    ev_reset(s)
    for ch in ["C", "ă", "r"]: cdp.send("Input.insertText", {"text": ch}); s.page.wait_for_timeout(120)
    r["dupa_3_litere"] = {"pas": s.ev("()=>window.__as.pas()"), "indiciu": s.ev("()=>[...document.querySelectorAll('[data-lh-indiciu]')].map(e=>e.getAttribute('data-lh-pentru')+' | '+e.textContent)"), "ev": ultimele_ev(s, 3), "titlu_in_lucru": s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"bara_formule\"]');const i=e&&(e.matches('input,textarea')?e:e.querySelector('input,textarea'));return i?i.value:(e?e.textContent:null)}")}
    s.shot("p4_tel_indiciu.png")
    K.press("Enter"); s.page.wait_for_timeout(300)
    r["dupa_enter"] = {"pas": s.ev("()=>window.__as.pas()"), "titlu": [g["titlu"] for g in s.stare().get("grafice") or []], "ev": ultimele_ev(s, 1)}
    # aceleasi 3 litere pe calculator (keydown), pentru comparatie
    r["erori"] = s.erori
except Exception as e:
    r["exceptie"] = repr(e)
finally:
    out["9_asistent_tel"] = r
    json.dump(out, open(P + "p4.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
