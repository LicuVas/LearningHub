# -*- coding: utf-8 -*-
"""Critic r7: tastatura in grila (poligon Excel, 1366x768)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/7/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
def st(): x = s.stare(); return {"sel": x.get("selectie"), "cel": {k: (v.get("valoare"), v.get("text"), v.get("formula")) for k, v in (x.get("celule") or {}).items()}}
def ev(n=3): return ultimele_ev(s, n)
def foc(): return s.ev("()=>{const a=document.activeElement;return a?(a.tagName+'.'+(a.className||'')+' '+(a.getAttribute('data-lh-tinta')||'')+' '+(a.getAttribute('aria-label')||'')).slice(0,90):null}")
def rec(k, **v): out[k] = v; print(k, json.dumps(v, ensure_ascii=False)[:900])
def gol(): s.ev("()=>{window.__lhAplicatieEv&&(window.__lhAplicatieEv.length=0)}")
try:
    s.deschide()
    # 1. Enter / Tab (m1-l02, excel-tab-apoi-enter) pe F1
    clic_cel(s, "F1")
    for t in ["Elev", "Tab", "Suma", "Enter", "Ana", "Tab", "150", "Enter"]:
        (K.press(t) if t in ("Tab", "Enter") else K.type(t)); s.page.wait_for_timeout(60)
    x = st(); rec("tab_enter", sel=x["sel"], F1=x["cel"].get("F1"), G1=x["cel"].get("G1"), F2=x["cel"].get("F2"), G2=x["cel"].get("G2"), ev=ev(2), foc=foc())
    K.press("Shift+Tab"); a1 = st()["sel"]; K.press("Shift+Enter"); a2 = st()["sel"]
    rec("shift_tab_enter", dupa_shift_tab=a1, dupa_shift_enter=a2, ev=ev(2))
    # 2. Esc renunta
    clic_cel(s, "A1"); K.type("Test"); K.press("Escape"); rec("esc", A1=st()["cel"].get("A1"), ev=ev(1))
    # 3. F2
    clic_cel(s, "B2"); K.press("F2"); K.press("Backspace"); K.type("5"); K.press("Enter"); rec("f2", B2=st()["cel"].get("B2"), sel=st()["sel"], ev=ev(4))
    # 4. F4
    clic_cel(s, "H1"); K.type("=B2"); K.press("F4"); K.press("Enter"); clic_cel(s, "H2"); K.type("=B2"); K.press("F4"); K.press("F4"); K.press("Enter")
    x = st(); rec("f4", H1=x["cel"].get("H1"), H2=x["cel"].get("H2"), ev=ev(3))
    # 5. Ctrl+Z / Ctrl+Y
    clic_cel(s, "B3"); K.type("1"); K.press("Enter"); K.press("Control+z"); z = st()["cel"].get("B3"); K.press("Control+y"); y = st()["cel"].get("B3")
    rec("undo_redo", dupa_z=z, dupa_y=y, ev=ev(2))
    # 6. Ctrl+C/V + Esc; Ctrl+X/V
    clic_cel(s, "B2"); K.press("Control+c")
    ants = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-clip')].map(e=>getComputedStyle(e).display+' '+Math.round(e.getBoundingClientRect().width))")
    clic_cel(s, "J1"); K.press("Control+v"); K.press("Escape")
    ants2 = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] .lh-ap-x-clip')].map(e=>getComputedStyle(e).display)")
    clic_cel(s, "C2"); K.press("Control+x"); clic_cel(s, "J2"); K.press("Control+v")
    x = st(); rec("copy_cut", J1=x["cel"].get("J1"), J2=x["cel"].get("J2"), C2=x["cel"].get("C2"), ants_dupa_copy=ants, ants_dupa_esc=ants2, ev=ev(4))
    K.press("Control+z")
    # 7. navigare
    clic_cel(s, "A1"); r = {}
    K.press("Control+ArrowDown"); r["ctrl_jos"] = st()["sel"]
    K.press("Control+ArrowRight"); r["ctrl_dreapta"] = st()["sel"]
    K.press("Control+Home"); r["ctrl_home"] = st()["sel"]
    K.press("Control+End"); r["ctrl_end"] = st()["sel"]
    clic_cel(s, "A1"); K.press("Shift+ArrowRight"); K.press("Shift+ArrowDown"); r["shift_sageti"] = st()["sel"]
    clic_cel(s, "A1"); K.press("Control+Shift+ArrowDown"); r["ctrl_shift_jos"] = st()["sel"]
    K.press("Control+Shift+ArrowRight"); r["ctrl_shift_dreapta"] = st()["sel"]
    rec("navigare", **r, ev=ev(2))
    # 8. Delete pe zona
    clic_cel(s, "J1"); K.press("Shift+ArrowDown"); K.press("Delete"); x = st(); rec("delete", J1=x["cel"].get("J1"), J2=x["cel"].get("J2"), ev=ev(1))
    # 9. Alt+= sub B2:B4
    clic_cel(s, "B5"); gol(); K.press("Alt+Equal"); s.page.wait_for_timeout(150)
    ed = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed');return e?e.value:null}")
    rec("alt_egal", stare_B5=st()["cel"].get("B5"), editare=ed, ev=ev(3), mesaj=mesaj(s))
    K.press("Escape")
    # 10. Alt (KeyTips), apoi H, 1 (Bold: Alt, H, 1)
    clic_cel(s, "A1"); gol()
    K.press("Alt"); s.page.wait_for_timeout(150)
    kt = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] *')].filter(e=>/^[A-Z0-9]{1,2}$/.test((e.textContent||'').trim())&&e.children.length===0&&e.getClientRects().length&&/kt|tasta|keytip/i.test(e.className+' '+[...e.attributes].map(a=>a.name).join(' '))).length")
    K.press("h"); K.press("1"); s.page.wait_for_timeout(150)
    x = s.stare(); rec("keytips", bule_vizibile=kt, A1=x["celule"].get("A1"), A1_format=(x.get("format_celule") or {}).get("A1"), editare=s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] .lh-ap-x-ed');return e?e.value:null}"), ev=ev(5), foc=foc())
    K.press("Escape"); K.press("Escape")
    # 11. Ctrl+1, Ctrl+Shift+%, Ctrl+PageDown
    gol(); clic_cel(s, "B2")
    K.press("Control+1"); s.page.wait_for_timeout(200)
    dlg = s.ev("()=>[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-suprafata^=\"dialog\"]')].map(e=>e.getAttribute('data-lh-suprafata'))")
    rec("ctrl_1", dialog=dlg, ev=ev(3), mesaj=mesaj(s)); K.press("Escape")
    gol(); clic_cel(s, "C3")
    K.press("Control+Shift+Digit5"); s.page.wait_for_timeout(150)
    x = s.stare(); rec("ctrl_shift_procent", C3=x["celule"].get("C3"), C3_fmt=(x.get("format_celule") or {}).get("C3"), ev=ev(3), mesaj=mesaj(s))
    gol(); clic_cel(s, "A1")
    K.press("Control+PageDown"); s.page.wait_for_timeout(150)
    x = s.stare(); rec("ctrl_pagedown", sel=x.get("selectie"), foi=x.get("foi"), foaie_activa=x.get("foaie_activa"), ev=ev(2))
    # 12. Alt+Enter in editare
    clic_cel(s, "A8"); K.type("unu"); K.press("Alt+Enter"); K.type("doi"); K.press("Enter")
    x = st(); rec("alt_enter", A8=x["cel"].get("A8"), A9=x["cel"].get("A9"), sel=x["sel"], ev=ev(4))
    # 13. Ctrl+N / Ctrl+W
    gol()
    K.press("Control+n"); x = s.stare(); a = {"registru_activ": x.get("registru_activ"), "titlu": x.get("titlu_fereastra")}
    K.press("Control+w"); x = s.stare(); b = {"registru_activ": x.get("registru_activ"), "titlu": x.get("titlu_fereastra")}
    K.press("Control+w"); x = s.stare(); c = {"registru_activ": x.get("registru_activ"), "titlu": x.get("titlu_fereastra")}
    rec("ctrl_n_w", dupa_n=a, dupa_w1=b, dupa_w2_registru_modificat=c, ev=ev(3), mesaj=mesaj(s))
    rec("chei_stare", k=sorted(s.stare().keys()))
    rec("erori", e=s.erori)
finally:
    json.dump(out, open(P + "k1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
