# -*- coding: utf-8 -*-
"""Runda 7, continuarea 2 (constructorul 3): proba GRAV-urilor X8, X3, X4 din criticul 6, cu GESTURI REALE pe poligon
(Playwright headless, mouse + tastatură). Refolosește serverul, ruta și clasa S din proba_grav.py.

Cazuri:
  X8 (m1-l03:58-59, :110, :129, :285) — Ctrl+N = registru nou BookN (com_r7c.json › registre_noi), Ctrl+W = închiderea
     registrului (nemodificat: se închide; modificat: mesajul central, de_verificat), Excel rămâne deschis, gol; dublu clic pe
     fila foii = redenumire pe loc (textul NU ajunge în celulă); clic dreapta › Rename; panoul din stânga al ferestrei Save As
     (F12): elementele implicite Windows 11 (fereastra comună #32770; uia_word.json › lista.FileSaveAs_navigare).
     Ctrl+S pe registru nou NU se probează (DE ACOPERIT, de_verificat).
  X3 (uia_excel.json › bara_titlu › ToolBar 'Quick Access Toolbar') — Save fără lupă, Undo / Redo cu desen, Undo funcțional.
  X4 (uia_excel.json › zona_document) — bara de derulare orizontală [838,720,508,17] în dreapta filelor, despărțitorul
     [806,714,32,31], bara verticală [1346,220,17,496]; barele lui Chrome ascunse; săgețile derulează; pe telefon nimic nu iese.

Rulare:  python proba_grav_cont2.py [--iesire <fisier.json>] [--doar X8,X3,X4]
Rădăcina servită: LH_SERVIT (un dosar care conține `aplicatii/`), altfel worktree-ul. Ultima linie = verificări picate."""
import argparse, json, os, sys
AICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AICI)
import proba_grav as PG
from proba_grav import S, verif, REZ
from playwright.sync_api import sync_playwright

R = "s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const b=e.getBoundingClientRect();return [Math.round(b.x),Math.round(b.y),Math.round(b.width),Math.round(b.height)]}"
D = "s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);if(!e)return null;const p=e.querySelector('svg path');return p?p.getAttribute('d'):''}"
VIZ = "s=>[...document.querySelectorAll(s)].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta'))"
def aproape(r, ref, tol):
    return bool(r) and all(abs(a - b) <= tol for a, b in zip(r, ref))
def tasta(s, k): s.pg.keyboard.press(k); s.pg.wait_for_timeout(200)
def titlu(s): return (s.stare().get("titlu_fereastra") or "").replace("  ", " ")
def fila(s, nume): return '[data-lh-aplicatie] [data-lh-tinta="fila_foii"][data-lh-id="%s"]' % nume

# ------------------------------------------------------------------ X8: m1-l03
def x8(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Ana", "B1": 5}, "selectie": "C3"})
    s.clic("C3")
    tasta(s, "Control+n")
    st = s.stare()
    verif("X8", "Ctrl+N deschide un registru nou, Book2, gol, cu o foaie (com_r7c.json › registre_noi)",
          titlu(s).startswith("Book2 - Excel") and not (st.get("celule") or {}) and st.get("foi") == ["Sheet1"] and not s.mesaj(),
          {"titlu": titlu(s), "celule": st.get("celule"), "foi": st.get("foi"), "mesaj": s.mesaj()})
    tasta(s, "Control+n")
    verif("X8", "a doua oară Ctrl+N: Book3", titlu(s).startswith("Book3 - Excel"), titlu(s))
    tasta(s, "Control+w")
    verif("X8", "Ctrl+W pe Book3 (nemodificat) îl închide; rămâne Book2", titlu(s).startswith("Book2 - Excel") and not s.mesaj(), {"titlu": titlu(s), "mesaj": s.mesaj()})
    tasta(s, "Control+w")
    verif("X8", "Ctrl+W pe Book2: rămâne Book1, cu datele lui (A1 = Ana)", titlu(s).startswith("Book1 - Excel") and (s.cel("A1") or {}).get("text") == "Ana", {"titlu": titlu(s), "A1": s.cel("A1")})
    s.scrie("C3", "7")
    tasta(s, "Control+w")
    verif("X8", "Ctrl+W pe un registru MODIFICAT: mesajul central (fereastra „Save your changes” nu e în referință) și registrul rămâne",
          titlu(s).startswith("Book1 - Excel") and any("Ctrl+W" in m or "Close" in m for m in s.mesaj()), {"titlu": titlu(s), "mesaj": s.mesaj()})
    s.gata()
    # Excel rămâne deschis, gol (m1-l03:59), apoi Ctrl+N = registru nou
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Ana"}, "selectie": "A1"})
    s.clic("B2")
    tasta(s, "Control+w")
    st = s.stare()
    gol = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"celula\"][data-lh-id=\"A1\"]');if(!e)return true;const b=e.getBoundingClientRect();const x=document.elementFromPoint(b.x+b.width/2,b.y+b.height/2);return !(x&&x.closest('[data-lh-tinta=\"celula\"]'))}")
    verif("X8", "Ctrl+W pe singurul registru, nemodificat: Excel rămâne deschis, gol (nicio celulă de atins, niciun registru activ)",
          st.get("registru_activ", "lipsa") is None and gol and not s.mesaj(), {"registru_activ": st.get("registru_activ", "lipsa"), "gol": gol, "titlu": titlu(s), "mesaj": s.mesaj()})
    tasta(s, "Control+n")
    verif("X8", "din Excel gol, Ctrl+N deschide Book2", titlu(s).startswith("Book2 - Excel") and s.stare().get("registru_activ") == "Book2", {"titlu": titlu(s), "activ": s.stare().get("registru_activ")})
    s.gata()
    # redenumirea pe filă (m1-l03:285)
    s = S(pw, base)
    s.deschide({"foi": [{"nume": "Sheet1", "celule": {"A1": "Ana"}}, {"nume": "Sheet2", "celule": {}}], "selectie": "A1"})
    s.clic_sel(fila(s, "Sheet2"))
    b = s.ev(R, fila(s, "Sheet2"))
    s.pg.mouse.dblclick(b[0] + b[2] / 2, b[1] + b[3] / 2); s.pg.wait_for_timeout(200)
    s.pg.keyboard.type("Note"); tasta(s, "Enter")
    st = s.stare()
    verif("X8", "dublu clic pe fila Sheet2, „Note”, Enter: fila se numește Note, iar textul NU ajunge în celulă",
          st.get("foi") == ["Sheet1", "Note"] and not (st.get("celule") or {}) and not s.mesaj(), {"foi": st.get("foi"), "celule": st.get("celule"), "mesaj": s.mesaj()})
    b = s.ev(R, fila(s, "Note"))
    s.pg.mouse.dblclick(b[0] + b[2] / 2, b[1] + b[3] / 2); s.pg.wait_for_timeout(200)
    s.pg.keyboard.type("Altceva"); tasta(s, "Escape")
    verif("X8", "Esc în timpul redenumirii păstrează numele", s.stare().get("foi") == ["Sheet1", "Note"], s.stare().get("foi"))
    b = s.ev(R, fila(s, "Sheet1"))
    s.pg.mouse.click(b[0] + b[2] / 2, b[1] + b[3] / 2, button="right"); s.pg.wait_for_timeout(200)
    ok = s.clic_sel('[data-lh-aplicatie] [data-lh-tip="MenuItem"][data-lh-eticheta="Rename"]')
    s.pg.keyboard.type("Date"); tasta(s, "Enter")
    verif("X8", "clic dreapta pe filă › Rename, „Date”, Enter: fila se numește Date", ok and s.stare().get("foi") == ["Date", "Note"] and (s.cel("A1") or {}).get("text") == "Ana",
          {"foi": s.stare().get("foi"), "A1": s.cel("A1"), "mesaj": s.mesaj()})
    # panoul din stânga al ferestrei Save As (F12) — m1-l03:129 „În fereastră alegi folderul în stânga”
    tasta(s, "F12")
    nav = s.ev(VIZ, '[data-lh-aplicatie] [data-lh-suprafata="dialog.FileSaveAs"] [data-lh-tip="Tree"][data-lh-eticheta="Panou de navigare"] [data-lh-tip="TreeItem"]')
    verif("X8", "Save As (F12): panoul din stânga are elementele implicite Windows 11 (Acasă, Galerie, Acest PC, Rețea)",
          all(x in (nav or []) for x in ("Acasă", "Galerie", "Acest PC", "Rețea")), nav)
    ok = s.clic_sel('[data-lh-aplicatie] [data-lh-suprafata="dialog.FileSaveAs"] [data-lh-tip="TreeItem"][data-lh-eticheta="Documente"]')
    sel = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.FileSaveAs\"] [data-lh-tip=\"TreeItem\"][data-lh-eticheta=\"Documente\"]');return e?e.getAttribute('aria-selected'):null}")
    verif("X8", "clic pe Documente în stânga: rândul e ales, fără mesaj", ok and sel == "true" and not s.mesaj(), {"ales": sel, "mesaj": s.mesaj()})
    verif("X8", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X3: bara Acces rapid
QAT = '[data-lh-aplicatie] [data-lh-suprafata="acces_rapid"] '
LUPA = "M8.5 3a5.5"
def x3(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Ana"}, "selectie": "B2"})
    d_save = s.ev(D, QAT + '[data-lh-tip="Button"][data-lh-eticheta="Save"]')
    verif("X3", "Save din Acces rapid are discheta (Fluent save, MIT), nu lupa", bool(d_save) and not d_save.startswith(LUPA) and d_save.startswith("M3 5c0-1.1"), (d_save or "")[:40])
    d_u = s.ev(D, QAT + '[data-lh-tip="Button"][data-lh-eticheta="Undo"]')
    d_r = s.ev(D, QAT + '[data-lh-tip="Button"][data-lh-eticheta="Redo"]')
    verif("X3", "Undo are săgeata întoarsă ↶ (Fluent arrow_undo), Redo ↷ (arrow_redo)", (d_u or "").startswith("M5 2.5") and (d_r or "").startswith("M15 2.5"), [(d_u or "")[:20], (d_r or "")[:20]])
    d_c = s.ev(D, QAT + '[data-lh-tip="MenuItem"][data-lh-eticheta="Customize Quick Access Toolbar"]')
    verif("X3", "Customize Quick Access Toolbar nu mai are lupa", d_c is not None and not (d_c or "").startswith(LUPA), (d_c or "")[:20])
    s.scrie("B2", "5")
    ok = s.clic_sel(QAT + '[data-lh-tip="Button"][data-lh-eticheta="Undo"]')
    verif("X3", "după ce scrii 5 în B2, butonul Undo din Acces rapid o anulează (m1-l06:95)", ok and not s.cel("B2"), {"B2": s.cel("B2"), "mesaj": s.mesaj()})
    lupa = s.ev(D, '[data-lh-aplicatie] [data-lh-tip="Edit"][data-lh-eticheta="Search"], [data-lh-aplicatie] [data-lh-eticheta="Search"]')
    verif("X3", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X4: banda de sub foaie
SB = "[data-lh-aplicatie] [data-lh-eticheta='%s'] [data-lh-tip='ScrollBar']"
def x4(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Ana"}, "selectie": "A1"})
    h = s.ev(R, SB % "Horizontal"); v = s.ev(R, SB % "Vertical")
    verif("X4", "bara de derulare orizontală în dreapta filelor, pe rândul lor: [838,720,508,17] (uia_excel.json › zona_document)", aproape(h, [838, 720, 508, 17], 3), h)
    verif("X4", "bara verticală de la rândul antetelor: [1346,220,17,496]", aproape(v, [1346, 220, 17, 496], 4), v)
    dp = s.ev(R, "[data-lh-aplicatie] .lh-ap-x-desp")
    verif("X4", "despărțitorul dintre file și bară: [806,714,32,31]; nu mai e fâșia albă", aproape(dp, [806, 714, 32, 31], 3), dp)
    nat = s.ev("()=>{const c=document.querySelector('[data-lh-aplicatie] .lh-ap-x-corp');return c?getComputedStyle(c).scrollbarWidth:null}")
    verif("X4", "barele lui Chrome de pe grilă sunt ascunse (nu mai acoperă rândul 25)", nat == "none", nat)
    ff = s.ev(R, "[data-lh-aplicatie] .lh-ap-x-file-foi")
    verif("X4", "filele foilor rămân [1,713,805,32]", aproape(ff, [1, 713, 805, 32], 2), ff)
    s.clic_sel(SB % "Vertical" + " [data-lh-eticheta='Line down']")
    s.clic_sel(SB % "Horizontal" + " [data-lh-eticheta='Line right']")
    sc = s.ev("()=>{const c=document.querySelector('[data-lh-aplicatie] .lh-ap-x-corp');return [c.scrollTop,c.scrollLeft]}")
    verif("X4", "săgețile barelor derulează foaia (Line down: un rând, Line right: o coloană)", sc[0] > 0 and sc[1] > 0 and not s.mesaj(), {"scroll": sc, "mesaj": s.mesaj()})
    verif("X4", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()
    s = S(pw, base, 390, 844, mobil=True)
    s.deschide({"celule": {"A1": "Ana"}, "selectie": "A1"})
    rt = s.ev(R, "[data-lh-aplicatie]"); h = s.ev(R, SB % "Horizontal"); t1 = s.ev(R, fila(s, "Sheet1"))
    verif("X4", "telefon 390 px: bara orizontală încape în fereastră, fila Sheet1 se vede", bool(h and rt and t1) and h[0] + h[2] <= rt[0] + rt[2] + 1 and t1[0] + t1[2] <= rt[0] + rt[2], {"rad": rt, "h": h, "fila": t1})
    s.gata()

PROBE = {"X8": x8, "X3": x3, "X4": x4}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire", default=os.path.join(AICI, "proba_grav_cont2.json"))
    ap.add_argument("--doar", default="")
    a = ap.parse_args()
    doar = [x.strip() for x in a.doar.split(",") if x.strip()] or list(PROBE)
    srv, base = PG.server()
    with sync_playwright() as pw:
        for k in doar:
            try: PROBE[k](pw, base)
            except Exception as e: verif(k, "proba a căzut", False, repr(e)[:300])
    srv.shutdown()
    picate = [r for r in REZ if not r["ok"]]
    json.dump({"radacina": "LH_SERVIT" if os.environ.get("LH_SERVIT") else "worktree", "verificari": REZ, "picate": len(picate)},
              open(a.iesire, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    for r in REZ: print(("ok   " if r["ok"] else "PICAT") + " " + r["grav"] + " " + r["verificare"] + ("" if r["ok"] else "  ← " + json.dumps(r["detaliu"], ensure_ascii=False)[:160]))
    print(len(picate))

if __name__ == "__main__":
    main()
