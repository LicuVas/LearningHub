# -*- coding: utf-8 -*-
"""Critic r8 p10: Ctrl+Z / Ctrl+Y dupa sortare A-Z, umplere cu manerul, Wrap Text, Delete pe zona, lipire, Esc in editare;
starea si ecranul dupa fiecare (ecranul = starea, §3)."""
import json, sys
sys.path.insert(0, "C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/8/critic_probe")
from h import *
out = {}
s = Sesiune()
K = s.page.keyboard
TAB = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 88, "A3": "Bogdan", "B3": "VIII B", "C3": 95, "A4": "Carmen", "B4": "VIII A", "C4": 60}
ADR = ["A2", "A3", "A4", "C2", "C3", "C4", "D2", "D3", "D4", "E2"]
def poza(nume):
    x = s.stare()
    st = {a: (x["celule"].get(a) or {}).get("text") for a in ADR}
    ec = {a: ecran(s, a) for a in ADR}
    out[nume] = {"stare": st, "ecran_diferit": {a: [st[a], ec[a]] for a in ADR if (st[a] or "") != (ec[a] or "")}, "ev": ultimele_ev(s, 1),
                 "fmt_C2": x.get("format_celule", {}).get("C2")}
def fila(n):
    clic_el(s, '[data-lh-aplicatie] [data-lh-tinta="fila"][data-lh-id="%s"], [data-lh-aplicatie] [data-lh-tinta="fila:%s"]' % (n, n)); s.page.wait_for_timeout(200)
try:
    deschide_cu(s, {"celule": TAB, "selectie": "C3"})
    clic_cel(s, "C3"); s.page.wait_for_timeout(650)
    fila("Data"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]'); s.page.wait_for_timeout(250); poza("1_sort_za")
    K.press("Control+z"); s.page.wait_for_timeout(200); poza("1b_ctrl_z")
    K.press("Control+y"); s.page.wait_for_timeout(200); poza("1c_ctrl_y")
    K.press("Control+z"); s.page.wait_for_timeout(200)
    # umplere: D2 = =C2*2, maner pana la D4
    clic_cel(s, "D2"); s.page.wait_for_timeout(650); K.type("=C2*2"); K.press("Enter"); s.page.wait_for_timeout(150); clic_cel(s, "D2"); s.page.wait_for_timeout(650)
    m = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"maner_umplere\"]');if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}")
    d4 = s.ev(CEL, "D4")
    if m:
        s.page.mouse.move(m[0], m[1]); s.page.mouse.down(); s.page.mouse.move(m[0], d4[1], steps=6); s.page.mouse.up(); s.page.wait_for_timeout(250)
    poza("2_umplere")
    K.press("Control+z"); s.page.wait_for_timeout(200); poza("2b_ctrl_z")
    K.press("Control+y"); s.page.wait_for_timeout(200); poza("2c_ctrl_y")
    # Wrap Text pe C2
    clic_cel(s, "C2"); s.page.wait_for_timeout(650); fila("Home"); clic_el(s, '[data-lh-aplicatie] [data-lh-id-mso="WrapText"]'); s.page.wait_for_timeout(200); poza("3_wrap")
    K.press("Control+z"); s.page.wait_for_timeout(200); poza("3b_ctrl_z")
    # Delete pe A2:A4
    clic_cel(s, "A2"); s.page.wait_for_timeout(650); K.press("Shift+ArrowDown"); K.press("Shift+ArrowDown"); K.press("Delete"); s.page.wait_for_timeout(200); poza("4_delete")
    K.press("Control+z"); s.page.wait_for_timeout(200); poza("4b_ctrl_z")
    # copiere C2 -> E2
    clic_cel(s, "C2"); s.page.wait_for_timeout(650); K.press("Control+c"); clic_cel(s, "E2"); s.page.wait_for_timeout(650); K.press("Control+v"); s.page.wait_for_timeout(200); poza("5_lipire")
    K.press("Control+z"); s.page.wait_for_timeout(200); poza("5b_ctrl_z")
    # Esc in editare
    clic_cel(s, "C3"); s.page.wait_for_timeout(650); K.type("100"); poza("6_editare"); K.press("Escape"); s.page.wait_for_timeout(150); poza("6b_esc")
    # Ctrl+Z dupa Alt+= + Enter, apoi Ctrl+Y
    clic_cel(s, "C5"); s.page.wait_for_timeout(650); K.press("Alt+Equal"); K.press("Enter"); s.page.wait_for_timeout(200)
    out["7_alt_egal"] = s.stare()["celule"].get("C5")
    K.press("Control+z"); s.page.wait_for_timeout(200); out["7b_ctrl_z"] = s.stare()["celule"].get("C5")
    K.press("Control+y"); s.page.wait_for_timeout(200); out["7c_ctrl_y"] = s.stare()["celule"].get("C5")
    out["erori"] = s.erori
finally:
    json.dump(out, open(P + "p10.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    s.gata()
