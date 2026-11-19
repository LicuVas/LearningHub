# -*- coding: utf-8 -*-
"""Critic r10 p7: Alt+Y / Alt+N in „We found a typo…” (referinta: dialog.eroare_formula › Yes „ALT+Y”, No „ALT+N”);
Alt, N, C, Esc, Esc, Esc; tastarea in celula cu tastatura telefonului (control pentru GRAV T1)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/10/critic_probe")
from h import *
out = {}
DATE = {"B1": "Nr", "B2": 9, "B3": 7, "B4": 8, "B5": 10, "B6": 6, "B7": 8}
MOD = "()=>{const e=[...document.querySelectorAll('[data-lh-aplicatie] [data-lh-tip=\"Text\"]')].find(x=>/^Cell Mode/.test(x.getAttribute('data-lh-eticheta')||''));return e?e.textContent:null}"
s = Sesiune(); K = s.page.keyboard
def D(): return [(s.stare()["celule"].get("D%d" % i) or {}).get("text") for i in range(2, 7)]
try:
    deschide_cu(s, {"celule": DATE, "selectie": "A1"})
    clic_cel(s, "D2"); K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(300); ev_reset(s)
    K.press("Alt+y"); s.page.wait_for_timeout(300)
    out["1_alt_y"] = {"D": D(), "dlg": dialog_vizibil(s), "ev": ultimele_ev(s, 2), "kt": keytips(s), "mod": s.ev(MOD)}
    deschide_cu(s, {"celule": DATE, "selectie": "A1"})
    clic_cel(s, "D2"); K.type("=SUM(B2:B7)B2:B6"); K.press("Enter"); s.page.wait_for_timeout(300); ev_reset(s)
    K.press("Alt+n"); s.page.wait_for_timeout(300)
    out["2_alt_n"] = {"D": D(), "dlg": dialog_vizibil(s), "ev": ultimele_ev(s, 2), "kt": keytips(s), "mod": s.ev(MOD)}
    deschide_cu(s, {"celule": DATE, "selectie": "A1"}); clic_cel(s, "B2"); ev_reset(s)
    for t in ["Alt", "n", "c"]: K.press(t); s.page.wait_for_timeout(200)
    r = []
    for i in range(3):
        K.press("Escape"); s.page.wait_for_timeout(200)
        r.append({"lista": s.ev("()=>!!document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"lista.ChartTypeColumnInsertGallery\"]')"), "kt": keytips(s)[:6], "ev": ultimele_ev(s, 1), "focus": focus(s)})
    out["3_alt_n_c_esc"] = r
    out["erori"] = s.erori
finally:
    s.gata()
s = Sesiune(375, 667, mobil=True); K = s.page.keyboard; cdp = s.ctx.new_cdp_session(s.page)
try:
    deschide_cu(s, {"celule": DATE, "selectie": "A1"})
    b = s.ev(CEL, "C2"); s.page.touchscreen.tap(*b); s.page.wait_for_timeout(300); ev_reset(s)
    for ch in ["M", "ă", "r"]: cdp.send("Input.insertText", {"text": ch}); s.page.wait_for_timeout(100)
    K.press("Enter"); s.page.wait_for_timeout(250)
    out["4_tel_celula"] = {"C2": (s.stare()["celule"].get("C2") or {}).get("text"), "ev": ultimele_ev(s, 4)}
    out["erori_tel"] = s.erori
finally:
    json.dump(out, open(P + "p7.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
