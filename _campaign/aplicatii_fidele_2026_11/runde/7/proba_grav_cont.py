# -*- coding: utf-8 -*-
"""Runda 7, continuarea (constructorul 2): proba GRAV-urilor rămase din criticul 6, cu GESTURI REALE pe poligon
(Playwright headless, mouse + tastatură). Refolosește serverul, ruta și clasa S din proba_grav.py (constructorul 1).

Cazuri: X7r (Fill Color, Borders ▾ › All Borders, Bottom Border, No Border, Percent Style, Wrap Text) · X10s (Sort cu
niveluri: Sort by / Add Level / Then by / Order / OK, Sort Warning). Așteptările vin din Excel real: runde/7/com_r7c.json
(DispatchEx, model_obiect) și uia_excel.json (dialog.SortDialog, dialog.SortWarning, panglica.TabHome).

Rulare:  python proba_grav_cont.py [--iesire <fisier.json>] [--doar X7r,X10s]
Rădăcina servită: LH_SERVIT (un dosar care conține `aplicatii/`), altfel worktree-ul. Ultima linie = verificări picate."""
import argparse, json, os, sys
AICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AICI)
import proba_grav as PG
from proba_grav import S, verif, REZ
from playwright.sync_api import sync_playwright

ZONA = """q=>{const [a,b]=q.split(':');const f=x=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="'+x+'"]');const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]};return [f(a),f(b||a)]}"""
def alege_zona(s, q):
    (x0, y0), (x1, y1) = s.ev(ZONA, q)
    s.pg.mouse.move(x0, y0); s.pg.mouse.down(); s.pg.mouse.move(x1, y1, steps=5); s.pg.mouse.up(); s.pg.wait_for_timeout(150)
def fc(s): return s.stare().get("format_celule") or {}
def bord(s, a): return (fc(s).get(a) or {}).get("borduri") or {}
VIZ = "s=>{const e=[...document.querySelectorAll(s)].find(e=>e.getClientRects().length);return e?e.textContent.trim():null}"
ETICHETE = "s=>[...document.querySelectorAll(s)].filter(e=>e.getClientRects().length).map(e=>e.getAttribute('data-lh-eticheta'))"

# ------------------------------------------------------------------ X7 rest (m1-l06:76, :77, :177, :255)
def x7r(pw, base):
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Elev", "B1": "Suma", "C1": "Cod", "A2": "Ana", "B2": 150, "C2": "'001", "A3": "Bogdan", "B3": 75.5, "C3": "'002",
                           "A4": "Cristi", "B4": 120, "C4": "'003"}, "selectie": "A1"})
    # Fill Color (butonul principal = „Fill Color RGB(255, 255, 0)”, uia_excel.json; com_r7c.json › fill: Color 65535)
    alege_zona(s, "A1:C1")
    s.clic_sel('[data-lh-aplicatie] [data-lh-eticheta="Fill Color RGB(255, 255, 0)"]')
    f = fc(s)
    verif("X7r", "Fill Color pe A1:C1: umplere FFFF00 în stare (com_r7c › fill = 65535)", all((f.get(a) or {}).get("umplere") == "FFFF00" for a in ("A1", "B1", "C1")), {a: f.get(a) for a in ("A1", "B1", "C1")})
    bg = s.ev("a=>getComputedStyle(document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"celula\"][data-lh-id=\"'+a+'\"]')).backgroundColor", "B1")
    verif("X7r", "… și pe ecran B1 e galbenă, fără mesaj central", bg == "rgb(255, 255, 0)" and not s.mesaj(), {"bg": bg, "mesaj": s.mesaj()})
    s.pg.keyboard.press("Control+z"); s.pg.wait_for_timeout(150)
    verif("X7r", "Ctrl+Z scoate umplerea", not (fc(s).get("A1") or {}).get("umplere"), fc(s).get("A1"))
    # Fill Color ▾: galeria nu e în referință → mesajul central cu numele comenzii, nu „More Options”
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="CellFillColorPicker_Dropdown"]')
    m = " ".join(s.mesaj())
    verif("X7r", "Fill Color ▾ (fără referință): mesajul numește „Fill Color”, nu „More Options”", "Fill Color" in m and "More Options" not in m, m[:160])
    # mesajul central dispare singur după 5 s (aplicatii.js › nesimulat); proba nu așteaptă: îl scoate după ce l-a citit
    s.ev("()=>document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])').forEach(x=>x.remove())")
    s.pg.wait_for_timeout(150)
    # Borders ▾ › All Borders pe A1:C4 (lista = BordersGallery din lista Microsoft S11, etichetele din Excel real: com_r7c › etichete)
    alege_zona(s, "A1:C4")
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="BordersGallery_Dropdown"]')
    et = s.ev(ETICHETE, '[data-lh-aplicatie] .lh-ap-x-meniu-borduri [data-lh-tinta^="meniu:"]') or []
    verif("X7r", "Borders ▾ deschide lista: Bottom, Top, Left, Right Border, No Border, All Borders, Outside, Thick Outside… (ordinea S11)",
          et[:8] == ["Bottom Border", "Top Border", "Left Border", "Right Border", "No Border", "All Borders", "Outside Borders", "Thick Outside Borders"], et)
    s.clic_sel('[data-lh-aplicatie] .lh-ap-x-meniu-borduri [data-lh-eticheta="All Borders"]')
    ok = all(bord(s, a) == {"sus": "subtire", "jos": "subtire", "stanga": "subtire", "dreapta": "subtire"} for a in ("A1", "B2", "C4", "A4", "C1"))
    verif("X7r", "All Borders: fiecare celulă din A1:C4 are linii pe toate laturile (com_r7c › all_borders)", ok and not s.mesaj(), {a: bord(s, a) for a in ("A1", "B2", "C4")})
    lin = s.ev("a=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"celula\"][data-lh-id=\"'+a+'\"]');const c=getComputedStyle(e);return [c.borderBottomStyle,c.borderRightStyle,c.borderBottomColor]}", "B2")
    verif("X7r", "… liniile se văd pe ecran (B2: chenar NEGRU jos, nu linia gri a grilei)", lin[0] == "solid" and lin[1] == "solid" and lin[2] == "rgb(0, 0, 0)", lin)
    # No Border pe B2:B3: muchiile comune dispar și de la vecini (com_r7c › none_border: B1.jos, A2.dreapta, C2.stanga, B4.sus)
    alege_zona(s, "B2:B3")
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="BordersGallery_Dropdown"]')
    s.clic_sel('[data-lh-aplicatie] .lh-ap-x-meniu-borduri [data-lh-eticheta="No Border"]')
    b = {a: bord(s, a) for a in ("B1", "A2", "C2", "B4", "B2")}
    verif("X7r", "No Border pe B2:B3: B2 fără linii; B1 fără jos, A2 fără dreapta, C2 fără stânga, B4 fără sus (ca Excel real)",
          not b["B2"] and "jos" not in b["B1"] and "dreapta" not in b["A2"] and "stanga" not in b["C2"] and "sus" not in b["B4"] and b["B1"].get("sus") == "subtire", b)
    # butonul principal Borders = Bottom Border pe E2:F3 → doar marginea de jos a zonei (com_r7c › bottom_border)
    alege_zona(s, "E2:F3")
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="BorderBottomNoToggle"]')
    b = {a: bord(s, a) for a in ("E2", "F2", "E3", "F3")}
    verif("X7r", "Borders (butonul, Bottom Border) pe E2:F3: doar E3 și F3 au linie jos", b == {"E2": {}, "F2": {}, "E3": {"jos": "subtire"}, "F3": {"jos": "subtire"}}, b)
    s.gata()
    # Percent Style pe C2:C4 (lecția m1-l06 inca: 0,1 0,25 0,5 → 10% 25% 50%; com_r7c › percent)
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Produs", "B1": "Preț", "C1": "Reducere", "A2": "Caiet", "B2": 8, "C2": 0.1, "A3": "Stilou", "B3": 25, "C3": 0.25,
                           "A4": "Rucsac", "B4": 120, "C4": 0.5, "C5": 0.125}, "selectie": "A1"})
    alege_zona(s, "C2:C5")
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="PercentStyle"]')
    st = s.stare(); c = st["celule"]
    verif("X7r", "Percent Style: C2:C5 arată 10%, 25%, 50%, 13%; valorile rămân 0,1 0,25 0,5 0,125 (com_r7c › percent)",
          [c[a]["text"] for a in ("C2", "C3", "C4", "C5")] == ["10%", "25%", "50%", "13%"] and [c[a]["valoare"] for a in ("C2", "C3", "C4", "C5")] == [0.1, 0.25, 0.5, 0.125]
          and (st["format_celule"].get("C3") or {}).get("format_numar") == "0%" and not s.mesaj(), {a: c[a] for a in ("C2", "C5")})
    verif("X7r", "… ecranul arată „25%” în C3", (PG.vede(s, "C3") or {}).get("text") == "25%", PG.vede(s, "C3"))
    s.gata()
    # Wrap Text pe B2 (lecția m1-l06:177; com_r7c › wrap: rândul 2 de la 14,4 la 72 pt = 5 rânduri; D5 → 57,6 pt = 4 rânduri)
    s = S(pw, base)
    s.deschide({"celule": {"A1": "Elev", "B1": "Observație", "A2": "Ana", "B2": "Plătește restul în octombrie, la dirigintă", "A3": "Bogdan", "B3": "Plătit",
                           "D5": "Situația notelor la informatică"}, "selectie": "B2"})
    h0 = s.ev("()=>document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"antet_rand\"][data-lh-id=\"2\"]').getBoundingClientRect().height")
    s.clic("B2")
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="WrapText"]')
    st = s.stare()
    h2 = s.ev("()=>document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"antet_rand\"][data-lh-id=\"2\"]').getBoundingClientRect().height")
    verif("X7r", "Wrap Text pe B2: incadrare în stare, rândul 2 = 5 rânduri de text (95 px; Excel: 72 pt = 5 × 14,4)",
          (st["format_celule"].get("B2") or {}).get("incadrare") is True and (st.get("inaltimi_randuri") or {}).get("2") == 95 and abs(h2 - 95) < 1 and abs(h0 - 19) < 1 and not s.mesaj(),
          {"fmt": st["format_celule"].get("B2"), "inaltimi": st.get("inaltimi_randuri"), "h0": h0, "h2": h2})
    v = s.ev("a=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"celula\"][data-lh-id=\"'+a+'\"]');const t=e.querySelector('.lh-ap-x-t');const r=e.getBoundingClientRect(),q=t.getBoundingClientRect();return [q.right-r.right,q.bottom-r.bottom,q.height,t.textContent]}", "B2")
    verif("X7r", "… textul stă în B2 (nu mai trece în C2), pe mai multe rânduri, tot textul", v[0] <= 1 and v[1] <= 1 and v[2] > 40 and v[3] == "Plătește restul în octombrie, la dirigintă", v)
    y3 = s.rect("B3")
    verif("X7r", "… rândul 3 coboară sub rândul înalt (clicul pe B3 alege B3)", True if not y3 else (s.clic("B3") or s.stare()["selectie"]["activa"] == "B3"), s.stare()["selectie"])
    s.clic("D5"); s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="WrapText"]')
    verif("X7r", "Wrap Text pe D5 („Situația notelor la informatică”): 4 rânduri = 76 px (Excel: 57,6 pt)", (s.stare().get("inaltimi_randuri") or {}).get("5") == 76, s.stare().get("inaltimi_randuri"))
    s.pg.keyboard.press("Control+z"); s.pg.wait_for_timeout(150)
    verif("X7r", "Ctrl+Z întoarce încadrarea lui D5 și înălțimea rândului 5", "5" not in (s.stare().get("inaltimi_randuri") or {}) and not (s.stare()["format_celule"].get("D5") or {}).get("incadrare"), s.stare().get("inaltimi_randuri"))
    verif("X7r", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

# ------------------------------------------------------------------ X10: Sort cu niveluri (m2-l10:63) + Sort Warning (m2-l10:62, :148)
TABEL = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII B", "C2": 78, "A3": "Bogdan", "B3": "VIII A", "C3": 95,
         "A4": "Cristi", "B4": "VIII B", "C4": 95, "A5": "Dan", "B5": "VIII A", "C5": 60, "A6": "Elena", "B6": "VIII A", "C6": 88, "A7": "Flavia", "B7": "VIII B", "C7": 60}
def coloana(s, c, n=7): return [((s.cel(c + str(r)) or {}).get("text")) for r in range(2, n + 1)]
def combo(s, rand, camp, valoare):
    """deschide lista câmpului `camp` (Column / Order) din nivelul `rand` (0 = Sort by) și alege `valoare`"""
    ok = s.clic_sel('[data-lh-aplicatie] [data-lh-suprafata="dialog.SortDialog"] [data-lh-nivel="%d"] [data-lh-camp="%s"]' % (rand, camp))
    if not ok: return False
    return s.clic_sel('[data-lh-aplicatie] .lh-ap-x-lista-combo [data-lh-eticheta="%s"]' % valoare)
def x10s(pw, base):
    s = S(pw, base)
    s.deschide({"celule": TABEL, "format": {"A1": {"bold": True}, "B1": {"bold": True}, "C1": {"bold": True}}, "selectie": "B3"})
    s.clic("B3")
    s.clic_sel('[data-lh-aplicatie] [data-lh-tinta="fila:Data"]')
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="SortDialog"]')
    st = s.stare()
    hd = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortDialog\"] [data-lh-eticheta=\"My data has headers\"]');return e?e.classList.contains('lh-ap-bifat'):null}")
    verif("X10s", "Data › Sort deschide fereastra Sort, cu „My data has headers” bifat (uia_excel.json › dialog.SortDialog)", (st.get("dialog") or {}).get("titlu") == "Sort" and hd is True, {"dialog": st.get("dialog"), "antet": hd})
    ok1 = combo(s, 0, "coloana", "Clasa") and combo(s, 0, "ordine", "A to Z")
    lab = s.ev(VIZ, '[data-lh-aplicatie] [data-lh-suprafata="dialog.SortDialog"] [data-lh-nivel="0"] .lh-ap-x-nivel-et')
    verif("X10s", "Sort by: lista coloanei are numele din antet; aleg Clasa, A to Z", ok1 and lab == "Sort by", lab)
    s.clic_sel('[data-lh-aplicatie] [data-lh-suprafata="dialog.SortDialog"] [data-lh-eticheta="Add Level"]')
    lab2 = s.ev(VIZ, '[data-lh-aplicatie] [data-lh-suprafata="dialog.SortDialog"] [data-lh-nivel="1"] .lh-ap-x-nivel-et')
    verif("X10s", "Add Level adaugă al doilea nivel, „Then by”", lab2 == "Then by" and not s.mesaj(), {"et": lab2, "mesaj": s.mesaj()})
    ord_ = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortDialog\"] [data-lh-nivel=\"1\"] [data-lh-camp=\"coloana\"]');return e?1:0}")
    ok2 = combo(s, 1, "coloana", "Punctaj") and combo(s, 1, "ordine", "Largest to Smallest")
    verif("X10s", "Then by: Punctaj, Largest to Smallest (numerele au ordinea „Smallest/Largest”)", bool(ord_ and ok2), ok2)
    s.clic_sel('[data-lh-aplicatie] [data-lh-suprafata="dialog.SortDialog"] [data-lh-eticheta="OK"]')
    st = s.stare()
    verif("X10s", "OK: tabelul e sortat după Clasa, apoi Punctaj descrescător, ca Excel real (com_r7c › sortare_doua_niveluri)",
          coloana(s, "A") == ["Bogdan", "Elena", "Dan", "Cristi", "Ana", "Flavia"] and coloana(s, "C") == ["95", "88", "60", "95", "78", "60"] and not st.get("dialog") and not s.mesaj(),
          {"A": coloana(s, "A"), "C": coloana(s, "C"), "dialog": st.get("dialog"), "mesaj": s.mesaj()})
    verif("X10s", "antetul rămâne pe rândul 1", [(s.cel(x) or {}).get("text") for x in ("A1", "B1", "C1")] == ["Nume", "Clasa", "Punctaj"], None)
    s.pg.keyboard.press("Control+z"); s.pg.wait_for_timeout(150)
    verif("X10s", "Ctrl+Z întoarce tabelul", coloana(s, "A") == ["Ana", "Bogdan", "Cristi", "Dan", "Elena", "Flavia"], coloana(s, "A"))
    # Sort Warning: doar C2:C7 aleasă + Sort Largest to Smallest → fereastra; Expand the selection (aleasă) + Sort... = rânduri întregi
    alege_zona(s, "C2:C7")
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]')
    st = s.stare()
    rad = s.ev("()=>{const e=document.querySelector('[data-lh-aplicatie] [data-lh-suprafata=\"dialog.SortWarning\"] [data-lh-eticheta=\"Expand the selection\"]');return e?e.classList.contains('lh-ap-bifat'):null}")
    verif("X10s", "C2:C7 + Sort Largest to Smallest → fereastra Sort Warning, cu „Expand the selection” aleasă (uia_excel.json › dialog.SortWarning)",
          (st.get("dialog") or {}).get("titlu") == "Sort Warning" and rad is True, {"dialog": st.get("dialog"), "expand": rad})
    s.clic_sel('[data-lh-aplicatie] [data-lh-suprafata="dialog.SortWarning"] [data-lh-eticheta="Sort..."]')
    verif("X10s", "Sort... cu Expand: rândurile rămân întregi (Bogdan 95, Cristi 95, Elena 88, Ana 78…)", coloana(s, "A")[:4] == ["Bogdan", "Cristi", "Elena", "Ana"] and coloana(s, "C")[:4] == ["95", "95", "88", "78"] and not s.stare().get("dialog"), {"A": coloana(s, "A"), "C": coloana(s, "C")})
    s.pg.keyboard.press("Control+z"); s.pg.wait_for_timeout(150)
    # Continue with the current selection: doar punctajele se mută (capcana din lecție)
    alege_zona(s, "C2:C7")
    s.clic_sel('[data-lh-aplicatie] [data-lh-id-mso="SortDescendingExcel"]')
    s.clic_sel('[data-lh-aplicatie] [data-lh-suprafata="dialog.SortWarning"] [data-lh-eticheta="Continue with the current selection"]')
    s.clic_sel('[data-lh-aplicatie] [data-lh-suprafata="dialog.SortWarning"] [data-lh-eticheta="Sort..."]')
    verif("X10s", "Continue with the current selection: se mută doar punctajele (Ana are acum 95)", coloana(s, "A")[0] == "Ana" and coloana(s, "C") == ["95", "95", "88", "78", "60", "60"], {"A": coloana(s, "A"), "C": coloana(s, "C")})
    verif("X10s", "fără erori în pagină", not s.erori, s.erori[:3])
    s.gata()

PROBE = {"X7r": x7r, "X10s": x10s}

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--iesire", default=os.path.join(AICI, "proba_grav_cont.json"))
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
