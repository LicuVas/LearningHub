"""Proba excel-a: tastarea în biblioteca nouă (poligon, headless). Ce face Excel-ul simulat cu textul tastat
(tipuri de date pe setări românești), Tab-Enter, caseta de nume, Esc, Delete după copiere.
Rulare: python proba_tipuri.py <port>  (serverul http pornit separat pe 127.0.0.1:<port>)."""
import json, sys
from playwright.sync_api import sync_playwright

PORT = sys.argv[1] if len(sys.argv) > 1 else "8764"
URL = f"http://127.0.0.1:{PORT}/aplicatii/poligon.html?aplicatie=excel"
OUT = __file__.replace("proba_tipuri.py", "proba_tipuri.json")


def local(route):
    u = route.request.url
    if u.startswith(f"http://127.0.0.1:{PORT}/") or u.startswith("http://localhost"):
        return route.continue_()
    return route.abort()


def main():
    rez = {}
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        ctx = b.new_context(viewport={"width": 1400, "height": 900}, locale="ro-RO")
        ctx.route("**/*", local)
        pg = ctx.new_page()
        erori = []
        pg.on("pageerror", lambda e: erori.append(str(e)))
        pg.goto(URL)
        pg.wait_for_function("() => window.LH && LH.aplicatii && LH.aplicatii.stare && LH.aplicatii.stare('excel')", timeout=20000)
        pg.wait_for_timeout(800)
        tinte = pg.evaluate("() => LH.aplicatii.tinte('excel').slice(0, 400)")
        rez["tinte_exemple"] = [t for t in tinte if t.startswith(("celula", "antet", "camp", "fila", "bara", "zoom"))][:40]

        def el(tinta):
            return pg.evaluate("t => { const e = LH.aplicatii.element('excel', t); if (!e) return null; e.scrollIntoView({block:'nearest', inline:'nearest'}); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }", tinta)

        def clic(tinta):
            xy = el(tinta)
            if not xy:
                return False
            pg.mouse.click(xy[0], xy[1])
            pg.wait_for_timeout(60)
            return True

        def stare():
            return pg.evaluate("() => LH.aplicatii.stare('excel')")

        def celula(a):
            c = (stare().get("celule") or {}).get(a)
            return c

        # tinta celulei: aflăm forma (celula:A1 sau alta)
        cand = [t for t in tinte if "A1" in t][:5]
        rez["tinte_A1"] = cand
        tc = next((t for t in tinte if t.endswith(":A1") and t.startswith("celula")), None)
        rez["tinta_celula"] = tc
        pref = tc[:-2] if tc else "celula:"

        intrari = ["7,5", "7.5", "6.75", "1.250", "12 lei", "10%", "27.09.2026", "27/09/2026", "2026-09-27",
                   "12 octombrie 2026", "12:30", "'007", "007", "TRUE", "1,5E3", "1 1/2", "(5)", "7B", "12 elevi", "9,50"]
        tip = {}
        for i, t in enumerate(intrari, start=1):
            a = f"F{i+5}"
            if not clic(pref + a):
                tip[t] = "fara_tinta"
                continue
            pg.keyboard.type(t)
            pg.keyboard.press("Enter")
            pg.wait_for_timeout(40)
            tip[t] = celula(a)
        rez["tipuri"] = tip

        # forma care rămâne: 7.5 apoi 7,5 peste, apoi Ctrl+Z de două ori
        clic(pref + "H6"); pg.keyboard.type("7.5"); pg.keyboard.press("Enter")
        r1 = celula("H6")
        clic(pref + "H6"); pg.keyboard.type("7,5"); pg.keyboard.press("Enter")
        r2 = celula("H6")
        pg.keyboard.press("Control+z"); pg.wait_for_timeout(50); r3 = celula("H6")
        pg.keyboard.press("Control+z"); pg.wait_for_timeout(50); r4 = celula("H6")
        clic(pref + "H6"); pg.keyboard.type("7,5"); pg.keyboard.press("Enter"); r5 = celula("H6")
        st = stare()
        rez["forma_ramasa"] = {"dupa_7.5": r1, "7,5_peste": r2, "ctrlz1": r3, "ctrlz2": r4, "7,5_dupa_anulari": r5,
                               "format_C1": (st.get("format_celule") or {}).get("H6")}
        # Delete pastrează forma?
        clic(pref + "H7"); pg.keyboard.type("7.5"); pg.keyboard.press("Enter")
        clic(pref + "H7"); pg.keyboard.press("Delete"); pg.wait_for_timeout(40)
        clic(pref + "H7"); pg.keyboard.type("7,5"); pg.keyboard.press("Enter")
        rez["delete_pastreaza_forma"] = {"H7": celula("H7"), "format_C2": (stare().get("format_celule") or {}).get("H7")}

        # Tab, Tab, Enter -> rândul următor, coloana de pornire
        clic(pref + "H10"); pg.keyboard.type("x"); pg.keyboard.press("Tab"); pg.keyboard.type("y"); pg.keyboard.press("Tab")
        pg.keyboard.type("z"); pg.keyboard.press("Enter")
        rez["tab_enter"] = stare().get("selectie")
        # Esc renunță
        clic(pref + "H10"); pg.keyboard.type("abc"); pg.keyboard.press("Escape")
        rez["esc"] = celula("H10")
        # caseta de nume
        nb = next((t for t in tinte if "Name Box" in t), None)
        rez["tinta_caseta"] = nb
        if nb and clic(nb):
            pg.keyboard.press("Control+a"); pg.keyboard.type("H15"); pg.keyboard.press("Enter"); pg.wait_for_timeout(60)
            rez["caseta_H15"] = stare().get("selectie")
            clic(nb); pg.keyboard.press("Control+a"); pg.keyboard.type("B2:C4"); pg.keyboard.press("Enter"); pg.wait_for_timeout(60)
            rez["caseta_B2C4"] = stare().get("selectie")
            clic(nb); pg.keyboard.press("Control+a"); pg.keyboard.type("Excursie"); pg.keyboard.press("Enter"); pg.wait_for_timeout(60)
            rez["caseta_cuvant"] = {"selectie": stare().get("selectie"), "mesaj": stare().get("fereastra_mesaj")}
        # Backspace pe o zonă: golește doar celula activă și intră în scriere
        clic(pref + "K6"); pg.keyboard.type("1"); pg.keyboard.press("Enter"); pg.keyboard.type("2"); pg.keyboard.press("Enter")
        clic(pref + "K6"); pg.keyboard.down("Shift"); clic(pref + "K7"); pg.keyboard.up("Shift")
        pg.keyboard.press("Backspace"); pg.keyboard.press("Enter")
        rez["backspace_zona"] = {"K6": celula("K6"), "K7": celula("K7")}
        # copiere + Enter (în Excel: lipește și oprește copierea)
        clic(pref + "K7"); pg.keyboard.press("Control+c"); clic(pref + "L6"); pg.keyboard.press("Enter"); pg.wait_for_timeout(60)
        rez["enter_dupa_copiere"] = {"L6": celula("L6"), "selectie": stare().get("selectie")}
        pg.keyboard.press("Escape")
        # lipire pe o zonă multiplu (2 celule copiate pe 4)
        clic(pref + "M6"); pg.keyboard.type("a"); pg.keyboard.press("Enter"); pg.keyboard.type("b"); pg.keyboard.press("Enter")
        clic(pref + "M6"); pg.keyboard.down("Shift"); clic(pref + "M7"); pg.keyboard.up("Shift"); pg.keyboard.press("Control+c")
        clic(pref + "N6"); pg.keyboard.down("Shift"); clic(pref + "N9"); pg.keyboard.up("Shift"); pg.keyboard.press("Control+v"); pg.wait_for_timeout(60)
        rez["lipire_multiplu"] = {a: celula(a) for a in ["N6", "K2", "K3", "N9"]}
        clic(pref + "O6"); pg.keyboard.down("Shift"); clic(pref + "O8"); pg.keyboard.up("Shift"); pg.keyboard.press("Control+v"); pg.wait_for_timeout(60)
        rez["lipire_nepotrivita"] = {"O6": celula("O6"), "O8": celula("O8"), "mesaj": stare().get("fereastra_mesaj")}
        # Ctrl+- , Shift+Space, Ctrl+Space, Shift+F10
        clic(pref + "B8"); pg.keyboard.press("Shift+Space"); pg.wait_for_timeout(40); rez["shift_space"] = stare().get("selectie")
        clic(pref + "B8"); pg.keyboard.press("Control+Space"); pg.wait_for_timeout(40); rez["ctrl_space"] = stare().get("selectie")
        clic(pref + "B8"); pg.keyboard.press("Control+Minus"); pg.wait_for_timeout(80); rez["ctrl_minus"] = {"dialog": stare().get("dialog"), "mesaj": stare().get("fereastra_mesaj")}
        pg.keyboard.press("Escape")
        clic(pref + "B8"); pg.keyboard.press("Shift+F10"); pg.wait_for_timeout(80)
        rez["shift_f10_meniu"] = pg.evaluate("() => !!document.querySelector('[data-lh-suprafata^=\"meniu_contextual\"]')")
        pg.keyboard.press("Escape")
        rez["erori_pagina"] = erori
        b.close()
    json.dump(rez, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("scris", OUT)


if __name__ == "__main__":
    main()
