# -*- coding: utf-8 -*-
"""Runda `acoperire` pe Excel după runda 7 a valului B-excel (19.11.2026) — generator-soră al lui acoperire_word_r3.py.

Tot din Excel-ul REAL de pe PC: instanță NOUĂ `EXCEL.EXE /x` pe desktopul ASCUNS (LHRefOffice pentru capturi,
LHScenarii pentru scenarii); refuză ecranul omului. Fereastra 1366×768 css (Sesiune din dump_uia_office.py), gesturile
ca în ruleaza_real.py (WM_CHAR / WM_KEYDOWN cu Ctrl ținut; UIA Expand/Invoke/Select/Toggle). Niciun Save adevărat în
Documentele omului (Cancel / Esc; ce salvează un scenariu stă în %TEMP%, dosar unic, șters). Închid doar PID-ul meu.

  capturi   — a. Ctrl+S pe registru NOU (ce fereastră) + More options…;  b. Ctrl+W pe registru modificat (fereastra care
              întreabă; Cancel);  c. lista ▾ de lângă Σ (Home și Formulas) + ce scrie Average + modul după Σ;
              d. fereastra Sort: Order (numere / text), Sort On, coloanele cu și fără antet, Add Level, eroarea la OK cu
              nivel gol;  e. fereastra de eroare a formulei (=SUM(B2:B7)B2:B6, =SUM(A1,A2), =SU+Tab);  f. galeriile
              Fill Color ▾ și Borders ▾;  g. lista de completare după =AV și =SU;  h. galeria Insert Column or Bar Chart
              + filele / selecția după inserare;  i. bara de stare cu B2:C4 numere + modul după „=” și săgeată;
              k. panoul din stânga al ferestrei Save As;  z. Excel fără registru (Ctrl+W pe ultimul, nemodificat).
              Ieșirea brută: ../runde/7/acoperire/capturi_excel_brut.json (redactată ca dump-ul).  --doar=f1,f2 reia doar unele.
  scrie     — cheile noi în uia_excel.json (cele vechi neatinse) + blocul `acoperire_r7`. Fără Office.
  verifica  — oracolul livrabilului; ULTIMA linie = numărul de probleme.
"""
import json
import os
import re
import subprocess
import sys
import threading
import time
import traceback
from pathlib import Path

AICI = Path(__file__).resolve().parent
D = AICI.parent
sys.path.insert(0, str(AICI))
IES = D / "runde" / "7" / "acoperire"
BRUT = IES / "capturi_excel_brut.json"
REF = AICI / "uia_excel.json"
HIDDEN = Path(r"C:\00\AI_0\tools\hidden_desktop.py")
DESKTOP = "LHRefOffice"
DESKTOP_SC = "LHScenarii"
CT_NUME = {50000: "Button", 50002: "CheckBox", 50003: "ComboBox", 50004: "Edit", 50007: "ListItem", 50008: "List",
           50011: "MenuItem", 50020: "Text", 50029: "DataItem", 50031: "SplitButton", 50019: "TabItem"}
U = RR = W3 = None
LOG = []


def log(m):
    print(m, flush=True)
    LOG.append(m)


def incarca():
    global U, RR, W3
    import dump_uia_office as U_
    import ruleaza_real as RR_
    import acoperire_word_r3 as W3_
    U, RR, W3 = U_, RR_, W3_
    RR.U = U
    W3.U, W3.RR, W3.log = U, RR, log


def slug(t):
    return re.sub(r"[^a-z0-9]+", "_", str(t or "").lower()).strip("_")[:60]


# ------------------------------------------------------------------------------------------------ ajutoare
def mso_in_fir(s, mso):
    """CommandBars.ExecuteMso într-un fir separat (o fereastră modală ține apelul blocat) — ca Sesiune.dialog."""
    hdoc, rez = s.hdoc, {}

    def lucru():
        import pythoncom
        pythoncom.CoInitialize()
        try:
            U.com_din(hdoc).Application.CommandBars.ExecuteMso(mso)
            rez["ok"] = True
        except Exception as e:  # noqa: BLE001
            rez["err"] = repr(e)
        finally:
            pythoncom.CoUninitialize()
    t = threading.Thread(target=lucru, daemon=True)
    t.start()
    return t, rez


def focus_in(c, h):
    """Elementele cu focusul tastaturii DIN fereastra h (nu GetFocusedElement: acela ar citi desktopul omului)."""
    out = []
    try:
        arr = U.din_hwnd(h).FindAll(4, U.A.CreatePropertyCondition(30008, True))
        for i in range(arr.Length if arr else 0):
            e = arr.GetElement(i)
            out.append({"tip": CT_NUME.get(e.CurrentControlType, str(e.CurrentControlType)),
                        "eticheta": c.s.cur.text(str(e.CurrentName or ""))})
    except Exception as e:  # noqa: BLE001
        out.append({"eroare": repr(e)[:100]})
    return out


def alese(c, h):
    """Rândurile alese (SelectionItem.IsSelected) din fereastra / elementul h."""
    out = []
    el = U.din_hwnd(h) if isinstance(h, int) else h
    try:
        arr = el.FindAll(4, U.A.CreatePropertyCondition(30079, True))
        for i in range(arr.Length if arr else 0):
            out.append(c.s.cur.text(str(arr.GetElement(i).CurrentName or "")))
    except Exception:  # noqa: BLE001
        pass
    return out


def captura(c, x, cl, t, cum, fara_liste=False):
    nod = c.nod(x, fara_liste=fara_liste)
    nod["clasa_fereastra"] = cl
    nod["titlu_fereastra"] = c.s.cur.text(t)
    nod["deschis_prin"] = cum
    nod["butoane_ordine"] = c.butoane(x)
    nod["texte"] = c.texte(x)
    nod["focus"] = focus_in(c, x)
    return nod


def noi_reale(c, inainte, asteapta=8.0, clase=None):
    return [w for w in c.noi(inainte, asteapta, clase) if w[1] not in ("Net UI Tool Window", "MSO_BORDEREFFECT_WINDOW_CLASS")]


def nume_fereastra_interioara(nod):
    inter = W3.cauta_noduri(nod, lambda n: n.get("tip") == "Window" and n.get("eticheta"))
    return inter[0]["eticheta"] if inter else (nod.get("titlu_fereastra") or nod.get("eticheta") or "")


def mod_celula(c):
    """Textul „Cell Mode …” din bara de stare (UIA; merge și când Excel e în editare și refuză COM)."""
    try:
        arr = U.din_hwnd(c.s.hmain).FindAll(4, U.A.CreatePropertyCondition(U.P_CT, 50020))
        for i in range(arr.Length if arr else 0):
            n = str(arr.GetElement(i).CurrentName or "")
            if n.startswith("Cell Mode"):
                return n
    except Exception as e:  # noqa: BLE001
        return f"necitit: {e!r}"[:80]
    return None


def bara_stare_nod(c):
    b = U.arbore(U.din_hwnd(c.s.hmain))
    sb = U.cauta(b, lambda n: n.get("ct") == 50017)
    return c.s.norm().nod(sb[0]) if sb else None


def fila(c, tid):
    RR.Rulare.fila(type("X", (), {"hmain": c.s.hmain})(), tid)


def gaseste_split(c, nume):
    return RR.gaseste_nume(U.din_hwnd(c.s.hmain), nume, (50031,))


def deschide_lista(c, el, cheie, cum):
    inainte = {x for x, _, _ in c.ferestre()}
    ok = RR.uia_expand(el)
    noi = c.noi(inainte, 6)
    nod = c.lista_deschisa(el, noi)
    if nod is None:
        c.erori.append(f"{cheie}: lista nu s-a deschis (expand={ok})")
        return None, inainte, noi
    nod["deschis_prin"] = cum
    c.supr[cheie] = nod
    randuri = [e for t_, e in W3.etichete(nod) if t_ in ("ListItem", "MenuItem", "Button", "DataItem")]
    c.fapte[f"randuri.{cheie}"] = randuri
    log(f"  {cheie}: {len(randuri)} rânduri {randuri[:24]}")
    return nod, inainte, noi


def element_in_noi(c, noi, nume, tipuri=(50007, 50011, 50000)):
    for x, _, _ in noi:
        for hc in U.copii_clasa(x, ["NetUIHWND"]) + [x]:
            it = RR.gaseste_nume(U.din_hwnd(hc), nume, tipuri)
            if it is not None:
                return it
    return None


def apasa_in_fir(el, timeout=4):
    return W3.pornit_in_fir(lambda e=el: RR.uia_invoke(e) or RR.uia_select(e) or RR.uia_legacy(e), timeout)


def esc(c, n=1):
    c.esc_main(n)


# ------------------------------------------------------------------------------------------------ capturile
def a_ctrl_s(c):
    """a. Ctrl+S pe un registru NOU, nesalvat (Book1, A1 = „Elev”)."""
    s = c.s
    s.appcom.ActiveSheet.Range("A1").Value = "Elev"
    time.sleep(0.6)
    inainte = {x for x, _, _ in c.ferestre()}
    RR.trimite_taste(s.hdoc, "Ctrl+S")
    noi = noi_reale(c, inainte, 10)
    fapt = {"gest": "Ctrl+S (WM_KEYDOWN/UP cu Ctrl ținut, ca ruleaza_real.py)", "registru": "nou (Book1), nesalvat, A1 = „Elev”",
            "ferestre_noi": [{"clasa": cl, "titlu": s.cur.text(t)} for _, cl, t in noi], "backstage": c.backstage_pagina()}
    for x, cl, t in noi:
        nod = captura(c, x, cl, t, "Ctrl+S pe registru nou nesalvat", fara_liste=(cl == "#32770"))
        nume = nume_fereastra_interioara(nod)
        cheie = "dialog." + (slug(nume) or "ctrl_s_registru_nou")
        c.supr[cheie] = nod
        fapt.update(cheie=cheie, nume=nume, butoane=nod["butoane_ordine"], texte=nod["texte"], focus=nod["focus"])
        log(f"  a. Ctrl+S -> {cl} {nume!r}: {U.numara(nod)} noduri; butoane {nod['butoane_ordine']}; focus {nod['focus']}")
        mo = None
        for n in ("More options…", "More options...", "More save options", "More save options..."):
            mo = RR.gaseste_nume(U.din_hwnd(x), n, (50000, 50005, 50011, 50020))
            if mo is not None:
                break
        if mo is not None:
            inainte2 = {y for y, _, _ in c.ferestre()}
            apasa_in_fir(mo)
            noi2 = noi_reale(c, inainte2 - {x}, 6)
            time.sleep(1.5)
            fapt["more_options"] = {"ferestre_noi": [{"clasa": cl2, "titlu": s.cur.text(t2)} for y, cl2, t2 in noi2 if y != x],
                                    "backstage": c.backstage_pagina()}
            log(f"  a. More options -> {fapt['more_options']}")
        break
    c.inchide_noi(inainte)
    if c.backstage_pagina():
        s.iesi_backstage()
    c.fapte["a_ctrl_s_registru_nou"] = fapt


def b_ctrl_w(c):
    """b. Ctrl+W pe registrul nou, modificat (fereastra care întreabă) — apoi Cancel."""
    s = c.s
    s.appcom.ActiveSheet.Range("A2").Value = "x"
    time.sleep(0.6)
    saved = bool(s.appcom.ActiveWorkbook.Saved)
    inainte = {x for x, _, _ in c.ferestre()}
    RR.trimite_taste(s.hdoc, "Ctrl+W")
    noi = noi_reale(c, inainte, 10)
    f = {"gest": "Ctrl+W (WM_KEYDOWN/UP cu Ctrl ținut)", "registru_saved_inainte": saved,
         "ferestre_noi": [{"clasa": cl, "titlu": s.cur.text(t)} for _, cl, t in noi]}
    for x, cl, t in noi:
        nod = captura(c, x, cl, t, "Ctrl+W pe registru NOU, modificat, nesalvat")
        nume = nume_fereastra_interioara(nod)
        cheie = "dialog." + (slug(nume) or "ctrl_w_registru_modificat")
        c.supr[cheie] = nod
        f.update(cheie=cheie, nume=nume, butoane=nod["butoane_ordine"], texte=nod["texte"], focus=nod["focus"])
        log(f"  b. Ctrl+W -> {cl} {nume!r}: texte {nod['texte']} butoane {nod['butoane_ordine']} focus {nod['focus']}")
        break
    c.inchide_noi(inainte)
    time.sleep(1)
    try:
        f["registre_dupa_cancel"] = int(s.appcom.Workbooks.Count)
    except Exception as e:  # noqa: BLE001
        f["registre_dupa_cancel"] = f"necitit: {e!r}"[:80]
    c.fapte["b_ctrl_w_modificat"] = f


def c_autosum(c):
    """c. Lista ▾ de lângă Σ (Home › Editing; apoi Formulas), Average pe B8, modul după Σ."""
    s = c.s
    ws = s.appcom.ActiveSheet
    ws.Cells.Clear()
    for i, v in enumerate([9, 7, 8, 10, 6, 8], start=2):
        ws.Range(f"B{i}").Value = v
    ws.Range("B8").Select()
    fila(c, "TabHome")
    sb = gaseste_split(c, "AutoSum")
    if sb is None:
        c.erori.append("c: SplitButton AutoSum negăsit pe Home")
        return
    nod, inainte, noi = deschide_lista(c, sb, "lista.AutoSum",
                                       "UIA ExpandCollapse.Expand pe SplitButton „AutoSum” (Home › Editing); B2:B7 numere, B8 activă")
    f = {}
    av = element_in_noi(c, noi, "Average") if nod is not None else None
    if av is not None:
        apasa_in_fir(av)
        time.sleep(2.0)
        f["mod_dupa_average"] = mod_celula(c)
        RR.trimite_taste(s.hdoc, "Enter")
        time.sleep(1.0)
        try:
            f["B8_formula"], f["B8_text"] = str(ws.Range("B8").Formula), str(ws.Range("B8").Text)
        except Exception as e:  # noqa: BLE001
            f["B8_eroare"] = repr(e)[:120]
    else:
        f["average"] = "rândul Average negăsit"
    c.inchide_noi(inainte)
    esc(c, 1)
    # Formulas › AutoSum ▾: aceeași listă?
    fila(c, "TabFormulas")
    sb2 = gaseste_split(c, "AutoSum")
    if sb2 is not None:
        nod2, inainte2, _ = deschide_lista(c, sb2, "lista.AutoSum_Formulas",
                                           "UIA ExpandCollapse.Expand pe SplitButton „AutoSum” (Formulas › Function Library)")
        if nod2 is not None and nod is not None:
            la_fel = c.fapte.get("randuri.lista.AutoSum") == c.fapte.get("randuri.lista.AutoSum_Formulas")
            f["formulas_la_fel_ca_home"] = la_fel
            if la_fel:
                c.supr.pop("lista.AutoSum_Formulas", None)
        RR.uia_collapse(sb2)
        c.inchide_noi(inainte2)
        esc(c, 1)
    fila(c, "TabHome")
    # Σ (butonul Sum, Alt+= în referință) pe D5 sub D2:D4: modul din bara de stare
    for i, v in enumerate([1, 2, 3], start=2):
        ws.Range(f"D{i}").Value = v
    ws.Range("D5").Select()
    btn = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "AutoSum")
    if btn is not None:
        W3.pornit_in_fir(lambda b=btn: RR.uia_invoke(b), 4)
        time.sleep(1.5)
        f["mod_dupa_sigma"] = mod_celula(c)
        RR.trimite_taste(s.hdoc, "Enter")
        time.sleep(0.8)
        try:
            f["D5_formula"] = str(ws.Range("D5").Formula)
        except Exception as e:  # noqa: BLE001
            f["D5_eroare"] = repr(e)[:120]
    esc(c, 1)
    c.fapte["c_autosum"] = f
    log(f"  c. {f}")


def combo(x, nume, al_catelea=0):
    A = U.A
    cond = A.CreateAndCondition(A.CreatePropertyCondition(U.P_NAME, nume), A.CreatePropertyCondition(U.P_CT, 50003))
    try:
        arr = U.din_hwnd(x).FindAll(4, cond)
        if arr and arr.Length > al_catelea:
            return arr.GetElement(al_catelea)
    except Exception:  # noqa: BLE001
        pass
    return None


def alege_in_combo(c, cb_f, nume, h):
    """Alege rândul `nume` în caseta derulantă (cb_f() o regăsește). Întoarce metoda care a schimbat VALOAREA casetei
    (citită după fiecare încercare), sau None. Rezerva: focusul pe casetă + săgeata ↓ postată ferestrei (ca tastatura)."""
    import win32gui
    for metoda in ("Invoke", "SelectionItem.Select", "LegacyDefaultAction"):
        cb = cb_f()
        inainte = {y for y, _, _ in c.ferestre()}
        RR.uia_expand(cb)
        noi = c.noi(inainte, 4)
        time.sleep(0.8)
        it = element_in_noi(c, noi, nume, (50007, 50011, 50000)) or RR.gaseste_nume(cb, nume, (50007,))
        if it is not None:
            try:
                {"Invoke": RR.uia_invoke, "SelectionItem.Select": RR.uia_select, "LegacyDefaultAction": RR.uia_legacy}[metoda](it)
            except Exception:  # noqa: BLE001
                pass
            time.sleep(0.8)
        RR.uia_collapse(cb_f())
        time.sleep(0.8)
        if RR.Word._val(cb_f()) == nume:
            return f"UIA {metoda} pe rândul „{nume}”"
    for _ in range(6):
        cb = cb_f()
        try:
            cb.SetFocus()
        except Exception:  # noqa: BLE001
            pass
        t = RR.focus_din(h)
        win32gui.PostMessage(t, 0x0100, 0x28, RR.lparam_tasta(0x28))
        win32gui.PostMessage(t, 0x0101, 0x28, RR.lparam_tasta(0x28, True))
        time.sleep(0.8)
        if RR.Word._val(cb_f()) == nume:
            return "focus pe casetă + săgeata ↓ (WM_KEYDOWN)"
    return None


def lista_combo(c, cb, cheie, cum):
    nod, inainte, noi = deschide_lista(c, cb, cheie, cum)
    if nod is not None:
        c.fapte[f"ales.{cheie}"] = [a for x, _, _ in noi for a in alese(c, x)] or alese(c, cb)
    RR.uia_collapse(cb)
    time.sleep(0.8)


def d_sort(c):
    """d. Fereastra Sort pe un tabel cu antet (Nume / Clasa / Punctaj): listele Order, Sort On, Sort by; Add Level;
    eroarea la OK cu un nivel fără coloană; coloanele fără „My data has headers”. Cancel la final (nimic sortat)."""
    s = c.s
    ws = s.appcom.ActiveSheet
    ws.Cells.Clear()
    date = [("Nume", "Clasa", "Punctaj"), ("Ana", "VIII A", 88), ("Bogdan", "VIII B", 95), ("Carmen", "VIII A", 60),
            ("Dan", "VIII B", 78), ("Elena", "VIII A", 95), ("Florin", "VIII B", 60)]
    for r, rand in enumerate(date, start=1):
        for k, v in enumerate(rand):
            ws.Cells(r, k + 1).Value = v
    ws.Range("A1").Select()
    inainte = {x for x, _, _ in c.ferestre()}
    t, rez = mso_in_fir(s, "SortDialog")
    noi = noi_reale(c, inainte, 8, ("NUIDialog", "bosa_sdm_XL9", "#32770"))
    if not noi:
        c.erori.append(f"d: SortDialog nu a deschis fereastra ({rez})")
        return
    x, cl, tt = noi[0]
    f = {"deschis_prin": "CommandBars.ExecuteMso('SortDialog'), A1 activă în tabelul A1:C7 cu antet",
         "focus_la_deschidere": focus_in(c, x)}
    sb = combo(x, "Sort by")
    f["sort_by_initial"] = RR.Word._val(sb) if sb is not None else None
    if sb is not None:
        lista_combo(c, sb, "lista.SortDialog_SortBy", "Sort › ComboBox „Sort by” (UIA Expand), tabel cu antet")
        cb = combo(x, "Order")
        if cb is not None:
            lista_combo(c, cb, "lista.SortDialog_Order", "Sort › „Sort by” încă gol (nicio coloană), ComboBox „Order” (UIA Expand)")
        so = combo(x, "Sort On")
        if so is not None:
            lista_combo(c, so, "lista.SortDialog_SortOn", "Sort › ComboBox „Sort On” (UIA Expand)")
        for col, cheie, fel in (("Punctaj", "lista.SortDialog_Order_numere", "numere"), ("Nume", "lista.SortDialog_Order_text", "text")):
            cum = alege_in_combo(c, lambda: combo(x, "Sort by"), col, x)
            val = RR.Word._val(combo(x, "Sort by"))
            cb = combo(x, "Order")
            f[f"sort_by_{fel}"] = {"cum": cum, "sort_by_arata": val, "order_arata": RR.Word._val(cb) if cb is not None else None}
            log(f"  d. Sort by = {col}: {f[f'sort_by_{fel}']}")
            if cb is not None and val == col:       # doar dacă alegerea chiar s-a aplicat
                lista_combo(c, cb, cheie, f"Sort › „Sort by” = {col} ({fel}; ales prin {cum}), ComboBox „Order” (UIA Expand)")
    al = RR.gaseste_nume(U.din_hwnd(x), "Add Level", (50000,))
    if al is not None:
        apasa_in_fir(al)
        time.sleep(1.5)
        nod = captura(c, x, cl, tt, "Sort (A1:C7 cu antet, Sort by = Nume), apoi Add Level (UIA Invoke)")
        c.supr["dialog.SortDialog#Add Level"] = nod
        randuri = [n for n in W3.cauta_noduri(nod, lambda n: n.get("tip") == "ListItem")]
        f["dupa_add_level"] = [[(k.get("tip"), k.get("eticheta")) for k in W3.cauta_noduri(r, lambda n: n.get("tip") in
                                                                                             ("DataItem", "Text", "ComboBox"))]
                               for r in randuri]
        f["focus_dupa_add_level"] = nod["focus"]
        log(f"  d. Add Level: {f['dupa_add_level']}")
        ok = RR.gaseste_nume(U.din_hwnd(x), "OK", (50000,))
        if ok is not None:
            inainte_e = {y for y, _, _ in c.ferestre()}
            apasa_in_fir(ok)
            noi_e = noi_reale(c, inainte_e, 5)
            for y, cl2, t2 in noi_e:
                if y == x:
                    continue
                n2 = captura(c, y, cl2, t2, "Sort: Add Level, apoi OK cu al doilea nivel fără coloană (UIA Invoke)")
                c.supr["dialog.SortDialog_eroare_nivel_gol"] = n2
                f["eroare_nivel_gol"] = {"clasa": cl2, "titlu": s.cur.text(t2), "texte": n2["texte"], "butoane": n2["butoane_ordine"]}
                log(f"  d. OK cu nivel gol -> {f['eroare_nivel_gol']}")
                b_ok = RR.gaseste_nume(U.din_hwnd(y), "OK", (50000,))
                if b_ok is not None:
                    apasa_in_fir(b_ok)
                else:
                    import win32gui
                    win32gui.PostMessage(y, 0x0010, 0, 0)
                time.sleep(1.2)
                break
            else:
                f["eroare_nivel_gol"] = "nicio fereastră nouă după OK" + (" (Sort s-a închis)" if x not in
                                                                          {y for y, _, _ in c.ferestre()} else "")
    if x in {y for y, _, _ in c.ferestre()}:
        hdr = RR.gaseste_nume(U.din_hwnd(x), "My data has headers", (50002,))
        if hdr is not None:
            RR.uia_toggle(hdr)
            time.sleep(1.0)
            sb = combo(x, "Sort by")
            if sb is not None:
                lista_combo(c, sb, "lista.SortDialog_SortBy_fara_antet",
                            "Sort › „My data has headers” debifat (UIA Toggle), ComboBox „Sort by” (UIA Expand)")
    c.fapte["d_sort"] = f
    c.inchide_noi(inainte)
    t.join(10)
    try:
        f["A2_dupa_cancel"] = str(ws.Range("A2").Value)
    except Exception:  # noqa: BLE001
        pass


def e_eroare_formula(c):
    """e. Formula respinsă + Enter: ce fereastră (titlu, text, butoane, implicitul)."""
    s = c.s
    ws = s.appcom.ActiveSheet
    ws.Cells.Clear()
    for i, v in enumerate([4, 5, 6], start=1):
        ws.Range(f"A{i}").Value = v
    for i, v in enumerate([9, 7, 8, 10, 6, 8], start=2):
        ws.Range(f"B{i}").Value = v
    cazuri = [("sum_lipit", "D2", ["=SUM(B2:B7)B2:B6"]), ("sum_virgula", "D3", ["=SUM(A1,A2)"]),
              ("su_tab", "D4", ["=SU", "Tab", "A1:A3)"])]
    vazute = {}
    for nume, cel, pasi in cazuri:
        ws.Range(cel).Select()
        time.sleep(0.4)
        inainte = {x for x, _, _ in c.ferestre()}
        for p in pasi:
            if p == "Tab":
                RR.trimite_taste(s.hdoc, "Tab")
            else:
                RR.trimite_text(s.hdoc, p)
        RR.trimite_taste(s.hdoc, "Enter")
        noi = noi_reale(c, inainte, 6)
        f = {"celula": cel, "tastat": " + ".join(pasi) + " + Enter", "ferestre_noi": [{"clasa": cl, "titlu": s.cur.text(t)} for _, cl, t in noi]}
        for x, cl, t in noi:
            nod = captura(c, x, cl, t, f"{cel}: „{' + '.join(pasi)}” + Enter (WM_CHAR / WM_KEYDOWN)")
            sem = json.dumps([nod["titlu_fereastra"], nod["texte"], [b["eticheta"] for b in nod["butoane_ordine"]]], ensure_ascii=False)
            if sem not in vazute:
                cheie = "dialog.eroare_formula" + ("" if not vazute else f"_{len(vazute) + 1}")
                vazute[sem] = cheie
                c.supr[cheie] = nod
            f.update(cheie=vazute[sem], titlu=nod["titlu_fereastra"], texte=nod["texte"], butoane=nod["butoane_ordine"],
                     focus=nod["focus"])
            break
        f["mod_cu_fereastra"] = mod_celula(c)
        c.inchide_noi(inainte)
        time.sleep(0.8)
        f["mod_dupa_inchidere"] = mod_celula(c)
        esc(c, 2)
        time.sleep(0.6)
        try:
            f["celula_dupa_esc"] = str(ws.Range(cel).Formula)
        except Exception as e:  # noqa: BLE001
            f["celula_dupa_esc"] = f"COM refuzat: {e!r}"[:100]
        c.fapte[f"e_{nume}"] = f
        log(f"  e. {nume}: {f}")


def f_galerii(c):
    """f. Fill Color ▾ și Borders ▾ (Home › Font), deschise."""
    s = c.s
    s.appcom.ActiveSheet.Range("B2").Select()
    fila(c, "TabHome")
    for cheie, el, cum in (("lista.CellFillColorPicker", U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "CellFillColorPicker"),
                            "UIA ExpandCollapse.Expand pe SplitButton „Fill Color” (CellFillColorPicker), B2 activă"),
                           ("lista.Borders", gaseste_split(c, "Borders"),
                            "UIA ExpandCollapse.Expand pe SplitButton „Borders” (Home › Font), B2 activă")):
        if el is None:
            c.erori.append(f"f: {cheie}: controlul negăsit")
            continue
        _, inainte, _ = deschide_lista(c, el, cheie, cum)
        RR.uia_collapse(el)
        c.inchide_noi(inainte)
        esc(c, 1)


def g_completare(c):
    """g. Lista de completare a funcțiilor după =AV și =SU: rândurile, ordinea, cea aleasă."""
    s = c.s
    ws = s.appcom.ActiveSheet
    for txt, cel in (("=AV", "F6"), ("=SU", "F7")):
        ws.Range(cel).Select()
        time.sleep(0.4)
        inainte = {x for x, _, _ in c.ferestre()}
        RR.trimite_text(s.hdoc, txt)
        time.sleep(1.5)
        noi = c.noi(inainte, 4)
        f = {"tastat": txt, "ferestre_noi": [{"clasa": cl, "titlu": s.cur.text(t)} for _, cl, t in noi]}
        for x, cl, t in noi:
            nod = c.nod(x)
            rand = [e for t_, e in W3.etichete(nod) if t_ in ("ListItem", "MenuItem", "DataItem")]
            if not rand:
                continue
            nod.update(clasa_fereastra=cl, deschis_prin=f"„{txt}” tastat (WM_CHAR) într-o celulă goală", alese=alese(c, x))
            f.update(randuri=rand, ales=nod["alese"], clasa=cl)
            if txt == "=AV":
                c.supr["lista_functii"] = nod
            break
        if "randuri" not in f:     # lista poate sta în fereastra principală
            b = U.arbore(U.din_hwnd(s.hmain))
            lst = U.cauta(b, lambda n: n.get("ct") == 50008)
            f["liste_in_fereastra_principala"] = [s.cur.text(str(n.get("n"))) for n in lst][:5]
        c.fapte[f"g_{txt}"] = f
        log(f"  g. {txt}: {f}")
        esc(c, 2)


def h_grafice(c):
    """h. Insert › Insert Column or Bar Chart ▾ (galeria) + inserarea primului grafic: filele, selecția."""
    s = c.s
    ws = s.appcom.ActiveSheet
    ws.Cells.Clear()
    for r, (a, b) in enumerate([("Luna", "Elevi"), ("Sept", 20), ("Oct", 24), ("Nov", 22)], start=1):
        ws.Cells(r, 1).Value, ws.Cells(r, 2).Value = a, b
    ws.Range("A1:B4").Select()
    fila(c, "TabInsert")
    el = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "ChartTypeColumnInsertGallery")
    if el is None:
        c.erori.append("h: ChartTypeColumnInsertGallery negăsit")
        return
    nod, inainte, noi = deschide_lista(c, el, "lista.ChartTypeColumnInsertGallery",
                                       "UIA ExpandCollapse.Expand pe „Insert Column or Bar Chart” (Insert › Charts), A1:B4 aleasă")
    f = {}
    rand = c.fapte.get("randuri.lista.ChartTypeColumnInsertGallery") or []
    primul = "Clustered Column" if "Clustered Column" in rand else None
    it = element_in_noi(c, noi, primul) if primul else None
    if it is not None:
        apasa_in_fir(it)
        time.sleep(3.0)
        f["inserat"] = primul
        b = U.arbore(U.din_hwnd(s.hmain))
        file_ = U.cauta(b, lambda n: n.get("ct") == 50019)
        f["file_dupa"] = [s.cur.text(str(n.get("n"))) for n in file_]
        f["fila_aleasa"] = alese(c, s.hmain)[:6]
        try:
            f["grafice_pe_foaie"] = int(ws.ChartObjects().Count)
            f["grafic_activ"] = s.appcom.ActiveChart is not None
        except Exception as e:  # noqa: BLE001
            f["com"] = repr(e)[:120]
    else:
        f["inserat"] = f"rândul „{primul}” negăsit"
    c.fapte["h_grafic"] = f
    try:
        c.inchide_noi(inainte)
        esc(c, 1)
    except Exception as e:  # noqa: BLE001  (o fereastră a galeriei dispare chiar în timpul citirii)
        log(f"  h: închiderea galeriei: {e!r}"[:160])
    try:
        while ws.ChartObjects().Count:
            ws.ChartObjects(1).Delete()
        ws.Range("A1").Select()
    except Exception as e:  # noqa: BLE001
        c.erori.append(f"h: ștergerea graficului: {e!r}"[:160])
    fila(c, "TabHome")
    c.fapte["h_grafic"] = f
    log(f"  h. {f}")


def i_bara_stare(c):
    """i. Bara de stare cu B2:C4 numere alese; modul după „=” și după „=” + ↑."""
    s = c.s
    ws = s.appcom.ActiveSheet
    ws.Cells.Clear()
    for k, v in enumerate([9, 7, 8, 10, 6, 5]):
        ws.Cells(2 + k // 2, 2 + k % 2).Value = v
    ws.Range("B2:C4").Select()
    time.sleep(1.5)
    nod = bara_stare_nod(c)
    if nod is not None:
        nod["deschis_prin"] = "B2:C4 aleasă (Range.Select), numerele 9, 7 / 8, 10 / 6, 5"
        c.supr["bara_stare#selectie_numere"] = nod
    f = {"texte": [(n.get("tip"), n.get("eticheta"), n.get("rect_css")) for n in W3.cauta_noduri(nod or {}, lambda n: n.get("tip") in ("Text", "Button"))]}
    ws.Range("B5").Select()
    time.sleep(0.4)
    RR.trimite_text(s.hdoc, "=")
    f["mod_dupa_egal"] = mod_celula(c)
    RR.trimite_taste(s.hdoc, "Up")
    f["mod_dupa_egal_sus"] = mod_celula(c)
    RR.trimite_taste(s.hdoc, "Enter")
    time.sleep(0.6)
    try:
        f["B5_formula"] = str(ws.Range("B5").Formula)
    except Exception as e:  # noqa: BLE001
        f["B5_formula"] = f"COM refuzat: {e!r}"[:100]
    esc(c, 1)
    c.fapte["i_bara_stare"] = f
    log(f"  i. {f}")


def k_save_as(c):
    """k. F12: panoul din stânga al ferestrei Save As (doar elementele implicite Windows) — Cancel."""
    s = c.s
    inainte = {x for x, _, _ in c.ferestre()}
    noi = []
    for incercare in range(2):
        if incercare:
            esc(c, 2)
            s.appcom.ActiveSheet.Range("A1").Select()
            time.sleep(1.0)
        RR.trimite_taste(s.hdoc, "F12")
        noi = c.noi(inainte, 10, ("#32770",))
        if noi:
            break
        if c.backstage_pagina():
            c.fapte["k_f12_backstage"] = c.backstage_pagina()
            s.iesi_backstage()
    if not noi:
        c.erori.append("k: F12 nu a deschis fereastra Save As")
        return
    x, cl, t = noi[0]
    time.sleep(3.0)
    nav = W3.nav_implicit(c, x, None, "dialog.FileSaveAs")
    if nav:
        c.supr["lista.FileSaveAs_navigare"] = dict(nav, deschis_prin="F12 pe registru nou (fereastra Save As)")
    c.fapte["k_save_as"] = {"titlu": s.cur.text(t), "focus": focus_in(c, x)}
    c.inchide_noi(inainte)


def z_fara_registru(c):
    """z. Un singur registru, nemodificat: Ctrl+W → Excel fără registru (titlul, filele, panglica, zona)."""
    import win32gui
    s = c.s
    a = s.appcom
    a.ActiveWorkbook.Saved = True
    inainte = {x for x, _, _ in c.ferestre()}
    esc(c, 2)
    a.ActiveSheet.Range("A1").Select()
    a.ActiveWorkbook.Saved = True
    time.sleep(1.0)
    try:
        RR.trimite_taste(s.hdoc, "Ctrl+W")
    except Exception as e:  # noqa: BLE001  (fereastra registrului s-a închis între KEYDOWN și KEYUP)
        log(f"  z: Ctrl+W: {e!r}"[:160])
    for _ in range(40):
        time.sleep(0.5)
        try:
            if int(a.Workbooks.Count) == 0:
                break
        except Exception:  # noqa: BLE001
            pass
    time.sleep(2.0)
    noi = noi_reale(c, inainte, 2)
    principale = [h for h, cl, _ in c.ferestre() if cl == "XLMAIN"]
    if principale and s.hmain not in principale:
        s.hmain = principale[0]
    f = {"gest": "Ctrl+W pe singurul registru, nemodificat (Saved = True)", "ferestre_noi": [(cl, s.cur.text(t)) for _, cl, t in noi],
         "titlu": s.cur.text(win32gui.GetWindowText(s.hmain)), "registre": int(a.Workbooks.Count),
         "EXCEL7": len(U.copii_clasa(s.hmain, ["EXCEL7"])), "ferestre_XLMAIN": len(principale)}
    b = U.arbore(U.din_hwnd(s.hmain))
    tabs = U.cauta(b, lambda n: n.get("ct") == 50019)
    f["file"] = [s.cur.text(str(n.get("n"))) for n in tabs if n.get("n") != "Developer"]   # Developer = setare personală
    zona = U.cauta(b, lambda n: n.get("c") in ("XLDESK", "EXCEL7") or n.get("ct") == 50033)
    f["zona_document"] = [(CT_NUME.get(n.get("ct"), n.get("ct")), n.get("c"), s.cur.text(str(n.get("n") or ""))) for n in zona][:6]
    home = U.cauta(b, lambda n: n.get("id") == "TabHome")
    f["fila_aleasa"] = alese(c, s.hmain)[:4]
    btn = [n for n in U.cauta(b, lambda n: n.get("ct") in (50000, 50031, 50011, 50003))
           if n.get("id") in ("Bold", "Paste", "AutoSum", "CellFillColorPicker", "WrapText", "FileTabButton", "SortFilterMenu")]
    N = s.norm()
    f["comenzi_activ"] = {n.get("id"): N.nod(dict(n, k=[])).get("activ", True) for n in btn}
    f["home_gasit"] = bool(home)
    log(f"  z. {f}")
    c.fapte["z_fara_registru"] = f
    for _, cl, t in noi:
        c.erori.append(f"z: fereastră neașteptată {cl} {t!r}")
    c.inchide_noi(inainte)
    a.Workbooks.Add()
    time.sleep(3.0)
    for h, cl, _ in c.ferestre():          # Excel e SDI: registrul nou poate avea altă fereastră XLMAIN
        if cl == "XLMAIN" and U.copii_clasa(h, ["EXCEL7"]):
            s.hmain, s.hdoc = h, U.copii_clasa(h, ["EXCEL7"])[0]
            break
    f["dupa_workbooks_add"] = {"hmain_nou": True, "EXCEL7": bool(U.copii_clasa(s.hmain, ["EXCEL7"]))}
    a.ActiveWorkbook.Saved = True


TOATE = (a_ctrl_s, b_ctrl_w, c_autosum, d_sort, e_eroare_formula, f_galerii, g_completare, h_grafice, i_bara_stare,
         k_save_as, z_fara_registru)


def capturi_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    s = U.Sesiune("excel")
    c = W3.Cap(s)
    t0 = time.time()
    doar = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--doar=")), None)
    alese_f = [f for f in TOATE if not doar or f.__name__ in doar]
    try:
        s.porneste()
        RR.BARIERA[0] = lambda: s.appcom.Version
        for f in alese_f:
            try:
                log(f"== {f.__name__}")
                f(c)
            except Exception:  # noqa: BLE001
                c.erori.append(f"{f.__name__}: " + traceback.format_exc()[-600:])
                log(traceback.format_exc()[-600:])
                try:
                    c.inchide_noi({s.hmain})
                    if c.backstage_pagina():
                        s.iesi_backstage()
                    c.esc_main(2)
                except Exception:  # noqa: BLE001
                    pass
    finally:
        try:
            s.inchide()
        except Exception:  # noqa: BLE001
            c.erori.append("închidere: " + traceback.format_exc()[-300:])
    out = {"aplicatie": "excel", "generat": time.strftime("%Y-%m-%d %H:%M"), "versiune": U.versiune_exe("EXCEL.EXE"),
           "versiune_com_build": s.build, "desktop": DESKTOP, "dpi_factor": s.f, "fereastra": getattr(s, "fereastra_css", None),
           "suprafete": c.supr, "fapte": c.fapte, "excluse_personal": c.excluse, "redactari": s.cur.redactari,
           "sarite_cont": sorted(set(s.sarite)), "erori": c.erori + s.erori, "jurnal": LOG,
           "durata_s": round(time.time() - t0), "rulari": [{"generat": time.strftime("%Y-%m-%d %H:%M"),
                                                            "functii": [f.__name__ for f in alese_f]}]}
    if doar and BRUT.exists():
        vechi = json.loads(BRUT.read_text(encoding="utf-8"))
        vechi["suprafete"].update(c.supr)
        vechi["fapte"].update(c.fapte)
        vechi["excluse_personal"] = sorted(set(vechi.get("excluse_personal", [])) | set(c.excluse))
        for k, v in s.cur.redactari.items():
            vechi["redactari"][k] = vechi["redactari"].get(k, 0) + v
        vechi["erori"] = [e for e in vechi.get("erori", []) if not any(e.startswith(f.__name__) for f in alese_f)] + c.erori + s.erori
        vechi["jurnal"] = vechi.get("jurnal", []) + LOG
        vechi["rulari"] = vechi.get("rulari", []) + out["rulari"]
        vechi["generat"] = out["generat"]
        out = vechi
    text = W3.fara_cale_personala(json.dumps(out, ensure_ascii=False, indent=1))
    for x in s.cur.interzise:
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas în ieșire — NU scriu fișierul")
    IES.mkdir(parents=True, exist_ok=True)
    BRUT.write_text(text, encoding="utf-8")
    print(f"{BRUT.name}: {len(c.supr)} suprafețe, {len(c.erori)} erori, {out['durata_s']} s")
    return 0


# ------------------------------------------------------------------------------------------------ scenariile noi
RULAT_DE = "referinte/acoperire_excel_r7.py"
JURNAL_SC = IES / "scenarii_excel_jurnal.json"
TABEL_SORT = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 88, "A3": "Bogdan",
              "B3": "VIII B", "C3": 95, "A4": "Carmen", "B4": "VIII A", "C4": 60, "A5": "Dan", "B5": "VIII B", "C5": 78,
              "A6": "Elena", "B6": "VIII A", "C6": 95, "A7": "Florin", "B7": "VIII B", "C7": 60}
D_CEL = ("celule = {adresă: {valoare, text afișat, formula dacă are}} pentru celulele nevide; selectie = {activa, zona} "
         "(adrese fără $)")


def sortare_doua_niveluri(ws):
    """Fereastra Sort cu două niveluri (Sort by Clasa, A to Z; Add Level; Then by Punctaj, Largest to Smallest; My data
    has headers), prin obiectul ei: Worksheet.Sort, un SortField pe nivel (SortOn 0 = Cell Values, Order 1 = xlAscending
    / 2 = xlDescending). Corectat în runda `acoperire` Office, 21.11.2026 (R25-1): vechiul Range.Sort cu argumente numite
    dădea Punctaj crescător."""
    s = ws.Sort
    s.SortFields.Clear()
    s.SortFields.Add(ws.Range("B2:B7"), 0, 1)
    s.SortFields.Add(ws.Range("C2:C7"), 0, 2)
    s.SetRange(ws.Range("A1:C7"))
    s.Header = 1
    s.Apply()
    s.SortFields.Clear()
    return ("Worksheet.Sort: SortFields.Add(Clasa, Cell Values, A to Z) + SortFields.Add(Punctaj, Cell Values, Largest to "
            "Smallest), SetRange A1:C7, Header = xlYes, Apply")
D_MESAJ = ("fereastra_mesaj = fereastra apărută după ultimul pas {titlu, texte, butoane} (null dacă n-a apărut); "
           "ramane_in_editare = Excel a rămas în modul de editare (true/false); la final Esc în mesaj și Esc în celulă, apoi "
           "se citesc celulele")
D_LAT = ("latimi_coloane = {litera: lățimea în pixeli la 100% (Column.Width în puncte × 4/3, rotunjit)} doar pentru coloanele "
         "cu altă lățime decât cea standard (64 px)")
SCEN_R7 = [   # ordinea contează: Ctrl+N primul (numele BookN depinde de câte registre noi a făcut instanța)
    {"id": "excel-ctrl-n", "mod": "gest_real", "start": {"celule": {"A1": "x"}, "selectie": "A1"},
     "pasi": [{"gest": "taste", "taste": "Ctrl+N"}], "stare_citita": ["registru_activ"],
     "descriere": "Book1 cu „x” în A1; Ctrl+N. registru_activ = numele registrului activ după gest (Workbook.Name; null dacă "
                  "Excel n-are niciun registru).", "lectii": ["viii/m1-l03"], "sursa_gest": "lectii/viii/m1-l03/index.html:59"},
    {"id": "excel-point-egal-sus", "mod": "gest_real", "start": {"celule": {"B2": 9, "B3": 7, "B4": 8}, "selectie": "B5"},
     "pasi": [{"gest": "tasteaza", "text": "="}, {"gest": "taste", "taste": "Up"}, {"gest": "taste", "taste": "Enter"}],
     "stare_citita": ["celule", "selectie"],
     "descriere": "B2:B4 = 9, 7, 8; B5 activă; „=”, săgeata ↑ (modul Point alege B4), Enter. " + D_CEL,
     "lectii": ["viii/m2-l08"], "sursa_gest": "runde/7/critic.md › K5 (com_r7k.json › T1)"},
    {"id": "excel-point-plus-dreapta", "mod": "gest_real", "start": {"celule": {"B2": 9, "B3": 7, "B4": 8, "E2": 4}, "selectie": "D2"},
     "pasi": [{"gest": "tasteaza", "text": "=B2+"}, {"gest": "taste", "taste": "Right"}, {"gest": "taste", "taste": "Enter"}],
     "stare_citita": ["celule", "selectie"],
     "descriere": "B2 = 9, E2 = 4; D2 activă; „=B2+”, săgeata → (modul Point alege E2), Enter. " + D_CEL,
     "lectii": ["viii/m2-l08"], "sursa_gest": "runde/7/critic.md › K5 (com_r7k.json › T2)"},
    {"id": "excel-av-tab", "mod": "gest_real", "start": {"celule": {"B2": 9, "B3": 7, "B4": 8}, "selectie": "C6"},
     "pasi": [{"gest": "tasteaza", "text": "=AV"}, {"gest": "taste", "taste": "Tab"}, {"gest": "tasteaza", "text": "B2:B4)"},
              {"gest": "taste", "taste": "Enter"}], "stare_citita": ["celule", "fereastra_mesaj", "ramane_in_editare"],
     "descriere": "B2:B4 = 9, 7, 8; C6 activă; „=AV”, Tab (completarea alege prima funcție din listă), „B2:B4)”, Enter. "
                  + D_CEL + "; " + D_MESAJ, "lectii": ["viii/m2-l08"], "sursa_gest": "lectii/viii/m2-l08/index.html:66"},
    {"id": "excel-aver-tab", "mod": "gest_real", "start": {"celule": {"B2": 9, "B3": 7, "B4": 8}, "selectie": "C7"},
     "pasi": [{"gest": "tasteaza", "text": "=AVER"}, {"gest": "taste", "taste": "Tab"}, {"gest": "tasteaza", "text": "B2:B4)"},
              {"gest": "taste", "taste": "Enter"}], "stare_citita": ["celule", "fereastra_mesaj", "ramane_in_editare"],
     "descriere": "Ca excel-av-tab, cu „=AVER”. " + D_CEL + "; " + D_MESAJ, "lectii": ["viii/m2-l08"],
     "sursa_gest": "lectii/viii/m2-l08/index.html:66"},
    {"id": "excel-alt-egal", "mod": "gest_real", "start": {"celule": {"B2": 9, "B3": 7, "B4": 8}, "selectie": "B5"},
     "pasi": [{"gest": "taste", "taste": "Alt+="}, {"gest": "taste", "taste": "Enter"}], "stare_citita": ["celule", "selectie"],
     "descriere": "B2:B4 = 9, 7, 8; B5 activă; Alt+= (scurtătura Sum din referință, panglica.TabHome › AutoSum), Enter. " + D_CEL,
     "lectii": ["viii/m2-l08"], "sursa_gest": "referinte/uia_excel.json › panglica.TabHome › Sum (scurtatura Alt+=)"},
    {"id": "excel-column-width-enter", "mod": "gest_real", "start": {"celule": {"A1": "Nume"}, "selectie": "C1"},
     "pasi": [{"gest": "clic_dreapta", "tinta": "antet_coloana:C", "real": "com:Columns(C).Select"},
              {"gest": "clic", "tinta": "meniu:Column Width...", "real": "mso:ColumnWidth"},
              {"gest": "tasteaza", "text": "20"}, {"gest": "taste", "taste": "Enter"}], "stare_citita": ["latimi_coloane"],
     "descriere": "Clic dreapta pe litera C › Column Width…, „20”, Enter (Enter = OK, butonul implicit). " + D_LAT,
     "lectii": ["viii/m1-l06"], "sursa_gest": "runde/7/critic.md › K2 (Column Width, Enter)"},
    {"id": "excel-ctrl-w-modificat", "mod": "gest_real", "start": {"celule": {"A1": "x"}, "selectie": "A1"},
     "pasi": [{"gest": "taste", "taste": "Ctrl+W"}], "stare_citita": ["dialog", "registru_activ"],
     "descriere": "Book1 nou cu „x” în A1 (modificat, nesalvat); Ctrl+W: Excel întreabă. dialog = fereastra care a întrebat "
                  "(null dacă n-a apărut): {titlu: textul barei de titlu (\"\" dacă n-are), intrebare: textul mare din "
                  "fereastră, butoane: etichetele butoanelor de jos, de la stânga la dreapta, apasat: null}; registru_activ = "
                  "numele registrului activ (fereastra încă deschisă: registrul n-a fost închis).",
     "lectii": ["viii/m1-l03"], "sursa_gest": "lectii/viii/m1-l03/index.html:182"},
    {"id": "excel-sortare-doua-niveluri", "mod": "model_obiect", "start": {"celule": TABEL_SORT, "selectie": "A1"},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabData", "id_mso": "SortDialog", "real": "com:sort2"},
              {"gest": "clic", "tinta": "camp:Sort by"}, {"gest": "clic", "tinta": "meniu:Clasa"},
              {"gest": "clic", "tinta": "fereastra:Add Level"}, {"gest": "clic", "tinta": "camp:Then by"},
              {"gest": "clic", "tinta": "meniu:Punctaj"}, {"gest": "clic", "tinta": "camp:Order#2"},
              {"gest": "clic", "tinta": "meniu:Largest to Smallest"}, {"gest": "clic", "tinta": "fereastra:OK"}],
     "stare_citita": ["celule"],
     "descriere": "Tabelul Nume / Clasa / Punctaj (A1:C7, cu antet); Data › Sort: Sort by Clasa (A to Z), Add Level, Then by "
                  "Punctaj, Largest to Smallest, OK. Prin model: Worksheet.Sort cu două niveluri, ca fereastra Sort "
                  "(SortFields: Clasa, Cell Values, A to Z; Punctaj, Cell Values, Largest to Smallest; Header = xlYes). "
                  + D_CEL, "lectii": ["viii/m2-l10"], "sursa_gest": "lectii/viii/m2-l10/index.html:63"},
    {"id": "excel-numere-afisare", "mod": "gest_real", "start": {"selectie": "A1"},
     "pasi": [{"gest": "tasteaza", "text": "=1/30000"}, {"gest": "taste", "taste": "Tab"},
              {"gest": "tasteaza", "text": "=1/7000000"}, {"gest": "taste", "taste": "Tab"},
              {"gest": "tasteaza", "text": "=25/3"}, {"gest": "taste", "taste": "Tab"},
              {"gest": "tasteaza", "text": "1234567890"}, {"gest": "taste", "taste": "Tab"},
              {"gest": "tasteaza", "text": "12345678901234"}, {"gest": "taste", "taste": "Enter"}],
     "stare_citita": ["celule", "latimi_coloane"],
     "descriere": "Coloanele de 64 px; A1 „=1/30000”, B1 „=1/7000000”, C1 „=25/3”, D1 „1234567890”, E1 „12345678901234” "
                  "(Tab între ele, Enter la capăt). " + D_CEL + "; " + D_LAT, "lectii": ["viii/m1-l06"],
     "sursa_gest": "de_verificat.md R7-3, R7-4"},
    {"id": "excel-autofit-latime", "mod": "model_obiect", "start": {"celule": {"A1": "Situația notelor la informatică"}, "selectie": "A1"},
     "pasi": [{"gest": "dublu_clic", "tinta": "antet_coloana_margine:A", "real": "com:autofit:A"}],
     "stare_citita": ["latimi_coloane"],
     "descriere": "Dublu clic pe linia dintre A și B (potrivirea lățimii după text). Prin model: Columns(\"A\").AutoFit. " + D_LAT,
     "lectii": ["viii/m1-l06"], "sursa_gest": "de_verificat.md R7-6"},
    {"id": "excel-wrap-de-doua-ori", "mod": "gest_real", "start": {"celule": {"B2": "Situația notelor la informatică"}, "selectie": "B2"},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabHome", "id_mso": "WrapText"},
              {"gest": "comanda_panglica", "fila": "TabHome", "id_mso": "WrapText"}],
     "stare_citita": ["format_celule", "inaltimi_randuri"],
     "descriere": "B2 cu text lung; Wrap Text apăsat de două ori. format_celule = {adresă: {bold, italic, aliniere, imbinat, "
                  "format_numar, incadrare}} doar cu ce diferă de implicit (incadrare = Wrap Text pornit); inaltimi_randuri = "
                  "{rând: înălțimea în pixeli la 100% (Row.Height × 4/3, rotunjit)} doar pentru rândurile cu altă înălțime "
                  "decât cea standard.", "lectii": ["viii/m1-l06"], "sursa_gest": "de_verificat.md R7-10"},
]
# scenariile vechi pe care le rulează acum acest generator (cu ferestrele care întreabă lăsate să apară)
VECHI_R7 = ["excel-salvare-ca"]
# excel-autocompletare-tab și excel-separator-virgula: preluate în runda `acoperire` Office (21.11.2026) de
# acoperire_office_r26.py, care le citește în două momente (mesajul / după Esc + Esc; R25-2)
SALVARE_CA_PASI = [{"gest": "clic", "tinta": "mso:FileTabButton", "real": "uia:FileTabButton"},
                   {"gest": "clic", "tinta": "backstage:Save As", "real": "uia:nav:Save As"},
                   {"gest": "clic", "tinta": "backstage:Browse", "real": "uia:Browse"},
                   {"gest": "tasteaza", "text": "Note", "real": "cale_temp"},
                   {"gest": "taste", "taste": "Enter"}]


def scrie_scenarii():
    """Scrie scenariile noi în ../scenarii/excel/ și marchează scenariile vechi rulate de acest generator."""
    dosar = D / "scenarii" / "excel"
    for s in SCEN_R7:
        sc = {"id": s["id"], "aplicatie": "excel", "mod": s["mod"], "descriere": s["descriere"] + " (runda `acoperire` "
              "după runda 7, 19.11.2026; rezultatul real: referinte/acoperire_excel_r7.py scenarii)", "start": s["start"],
              "pasi": s["pasi"], "stare_citita": s["stare_citita"], "lectii": s["lectii"], "sursa_gest": s["sursa_gest"],
              "rulat_de": RULAT_DE}
        (dosar / f"{s['id']}.json").write_text(json.dumps(sc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for i in VECHI_R7:
        f = dosar / f"{i}.json"
        sc = json.loads(f.read_text(encoding="utf-8"))
        sc["rulat_de"] = RULAT_DE
        if i == "excel-salvare-ca":
            sc["mod"] = "gest_real"
            sc["pasi"] = SALVARE_CA_PASI
            sc["descriere"] = ("Registrul nou cu „Elev” în A1; drumul real: File › Save As › Browse, numele „Note”, Enter "
                               "(Enter = Save). nume_fisier = numele cu extensia pus de Excel (Workbook.Name după salvare). "
                               "Rescris în runda `acoperire` după runda 7 (de_verificat.md R6-5): în Excel real butonul File "
                               "are idMso FileTabButton, iar Save As / Browse din Backstage n-au idMso.")
        f.write_text(json.dumps(sc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"scenarii: {len(SCEN_R7)} noi, {len(VECHI_R7)} vechi marcate rulat_de")
    return 0


def clasa_excel_r7():
    import win32gui

    class ExcelR7(RR.Excel):
        CHEI_AMPRENTA = ["celule", "format_celule", "selectie", "inaltimi_randuri"]
        CHEI_UIA = ("dialog", "fereastra_mesaj", "ramane_in_editare")

        def porneste(self):
            super().porneste()
            self.a.DisplayAlerts = True        # ferestrele care întreabă TREBUIE să apară (ca pe PC-ul elevului)
            self.canale_r7, self.dialog_r7, self.mesaj_r7, self.ocupat_r7 = set(), None, None, False

        def ferestre(self):
            return [(x, c, t) for x, c, t in U.ferestre_pid(self.s.proc.pid) if c not in W3.UAC]

        def registre_curate(self):
            a = self.a
            for _ in range(6):
                n = int(a.Workbooks.Count)
                if n <= 1:
                    break
                wb = a.Workbooks(n)
                wb.Saved = True
                wb.Close(False)
                del wb
            if int(a.Workbooks.Count) == 0:
                a.Workbooks.Add()
            a.Workbooks(1).Activate()
            d = U.copii_clasa(self.hmain, ["EXCEL7"])
            if d:
                self.s.hdoc = d[0]

        def start(self, st):
            self.canale_r7, self.dialog_r7, self.mesaj_r7, self.ocupat_r7 = set(), None, None, False
            self.inchide_ferestre_straine()
            if self.backstage_pagina():
                self.s.iesi_backstage()
            self.registre_curate()
            super().start(st)

        def backstage_pagina(self):
            return W3.Cap.backstage_pagina(self)

        def latimi(self):
            ws, out = self.ws, {}
            std = float(ws.StandardWidth)
            for k in range(1, 27):
                col = ws.Columns(k)
                if abs(float(col.ColumnWidth) - std) > 1e-6:
                    out[chr(64 + k)] = round(float(col.Width) * 4 / 3)
            return out

        def inaltimi(self):
            ws, out = self.ws, {}
            std = float(ws.StandardHeight)
            for k in range(1, 31):
                h = float(ws.Rows(k).RowHeight)
                if abs(h - std) > 1e-6:
                    out[str(k)] = round(h * 4 / 3)
            return out

        def intrebare_uia(self):
            """Fereastra care întreabă / mesajul apărut (UIA, înainte de a o închide)."""
            for x, c, t in self.ferestre():
                if x in self.baza or c not in ("#32770", "NUIDialog", "bosa_sdm_XL9"):
                    continue
                el = U.din_hwnd(x)
                nod = self.s.norm().nod(U.arbore(el))
                texte = [self.s.cur.text(str(n.get("eticheta"))) for n in W3.cauta_noduri(nod, lambda n: n.get("tip") == "Text")
                         if n.get("eticheta")]
                cap = W3.Cap(self.s)
                bt = [b["eticheta"] for b in cap.butoane(x) if b["eticheta"] not in ("Închidere", "Close", "Ajutor contextual")]
                # rândul de JOS (ca la Word): fără „Open” = săgeata casetei „Choose a Location”
                jos = [e for e in bt if e != "Open"]
                inter = nume_fereastra_interioara(nod) if c == "NUIDialog" else ""
                intreb = inter if inter and inter != "Microsoft Excel" else (texte[1] if len(texte) > 1 and texte[0] == t else
                                                                             (texte[0] if texte else ""))
                return x, {"titlu": self.s.cur.text(t or ""), "intrebare": intreb, "butoane": jos,
                           "apasat": None}, {"titlu": self.s.cur.text(t or ""), "texte": texte, "butoane": bt}
            return None, None, None

        def alt_egal(self, cu_alt=True):
            t = RR.tinta_tastatura(self.hdoc)
            import win32process
            tid, _ = win32process.GetWindowThreadProcessId(t)
            me = RR.k32.GetCurrentThreadId()
            atasat = bool(RR.u32.AttachThreadInput(me, tid, True))
            import ctypes
            st = (ctypes.c_ubyte * 256)()
            RR.u32.GetKeyboardState(st)
            vechi = bytes(st)
            if cu_alt:
                st[0x12] = st[0xA4] = 0x80
                RR.u32.SetKeyboardState(st)
            try:
                alt = 1 << 29
                if cu_alt:
                    win32gui.PostMessage(t, 0x0104, 0x12, RR.lparam_tasta(0x12) | alt)
                win32gui.PostMessage(t, 0x0104 if cu_alt else 0x0100, 0xBB, RR.lparam_tasta(0xBB) | (alt if cu_alt else 0))
                time.sleep(0.25)
                win32gui.PostMessage(t, 0x0105 if cu_alt else 0x0101, 0xBB, RR.lparam_tasta(0xBB, True) | (alt if cu_alt else 0))
                if cu_alt:
                    win32gui.PostMessage(t, 0x0101, 0x12, RR.lparam_tasta(0x12, True))
                time.sleep(0.2)
                RR.bariera()
                time.sleep(0.6)
            finally:
                RR.u32.SetKeyboardState((ctypes.c_ubyte * 256).from_buffer_copy(vechi))
                if atasat:
                    RR.u32.AttachThreadInput(me, tid, False)
            return "WM_SYSKEYDOWN Alt, WM_SYSKEYDOWN „=” (VK_OEM_PLUS, bitul 29), Alt ținut în starea tastaturii firului Excel"

        def real(self, p):
            r = p.get("real", "")
            if r == "com:Columns(C).Select":
                self.ws.Columns("C").Select()
                self.canale_r7.add("model_obiect")
                return "coloana C aleasă prin COM (Columns(\"C\").Select) — în locul clicului dreapta pe literă"
            if r.startswith("mso:"):
                inainte = {x for x, _, _ in self.ferestre()}
                s = self.s
                mso_in_fir(s, r[4:])
                for _ in range(30):
                    time.sleep(0.25)
                    if [x for x, _, _ in self.ferestre() if x not in inainte]:
                        break
                time.sleep(1.0)
                self.canale_r7.add("panglica")
                return f"fereastra deschisă prin CommandBars.ExecuteMso('{r[4:]}') — în locul clicului pe rândul din meniu"
            if r == "uia:FileTabButton":
                el = U.gaseste(U.din_hwnd(self.hmain), U.P_AID, "FileTabButton")
                U.apasa(el)
                time.sleep(3.0)
                self.canale_r7.add("panglica")
                return "UIA pe File (FileTabButton)"
            if r.startswith("uia:nav:"):
                nume = r[8:]
                nav = U.gaseste(U.din_hwnd(self.hmain), U.P_AID, "NavBarMenu")
                it = RR.gaseste_nume(nav, nume, (50019, 50007, 50011, 50000)) if nav else None
                if it is None:
                    raise RuntimeError(f"Backstage: „{nume}” nu e în bara din stânga")
                if not U.selecteaza(it):
                    U.apasa(it)
                time.sleep(2.5)
                self.canale_r7.add("panglica")
                return f"UIA pe „{nume}” (Backstage)"
            if r == "uia:Browse":
                it = RR.gaseste_nume(U.din_hwnd(self.hmain), "Browse", (50000, 50007, 50011, 50005))
                if it is None:
                    raise RuntimeError("Backstage › Save As: „Browse” negăsit")
                inainte = {x for x, _, _ in self.ferestre()}
                W3.pornit_in_fir(lambda e=it: RR.uia_invoke(e) or RR.uia_legacy(e), 4)
                for _ in range(40):
                    time.sleep(0.25)
                    if [x for x, c, _ in self.ferestre() if x not in inainte and c == "#32770"]:
                        break
                time.sleep(2.0)
                self.canale_r7.add("panglica")
                return "UIA Invoke pe „Browse” (fereastra Save As)"
            if r == "cale_temp":
                RR.trimite_text(self.hdoc, str(self.tmp / p["text"]))
                self.canale_r7.add("tastare")
                return ("WM_CHAR în File name: numele „" + p["text"] + "” cu dosarul temporar în față (%TEMP%\\…\\" +
                        p["text"] + ") — ca să nu salvez în Documentele omului; numele fișierului rămâne același")
            raise RuntimeError(f"pasul real necunoscut: {r}")

        def pas_gest(self, p):
            if p.get("real"):
                return self.real(p)
            if p["gest"] == "taste" and p["taste"] == "Alt+=":
                self.canale_r7.add("taste_alt")
                return self.alt_egal()
            self.canale_r7 |= RR.canale_pas("excel", "gest_real", p)
            try:
                return super().pas_gest(p)
            except Exception as e:  # noqa: BLE001
                # tasta a închis fereastra care avea focusul (Enter = Save): KEYDOWN a ajuns, KEYUP n-are unde
                if p["gest"] == "taste" and "1400" in repr(e):
                    time.sleep(2.0)
                    return f"WM_KEYDOWN {p['taste']} (fereastra cu focus s-a închis la tastă; KEYUP fără destinatar)"
                raise

        def pas_model(self, p):
            r = p.get("real", "")
            self.canale_r7.add("model_obiect")
            if r == "com:sort2":
                # runda `acoperire` Office (21.11.2026, R25-1): Range.Sort(Key1=…, Order2=2, …) cu argumente numite
                # dădea Punctaj CRESCĂTOR; nivelurile ferestrei Sort = Worksheet.Sort.SortFields, câte unul pe nivel
                return sortare_doua_niveluri(self.ws)
            if r.startswith("com:autofit:"):
                self.ws.Columns(r.split(":")[-1]).AutoFit()
                return "Columns.AutoFit"
            if not r:
                return "(pasul de interfață al aceleiași comenzi; nimic în plus prin model)"
            return super().pas_model(p)

        def citeste(self, chei):
            rez = {}
            if set(chei) & set(self.CHEI_UIA):
                h, dlg, mesaj = self.intrebare_uia()
                self.ocupat_r7 = bool(self.ocupata())
                if "dialog" in chei:
                    rez["dialog"] = dlg
                if "fereastra_mesaj" in chei:
                    rez["fereastra_mesaj"] = mesaj
                if "ramane_in_editare" in chei:
                    rez["ramane_in_editare"] = self.ocupat_r7
                self.inchide_tot()
            baza = [k for k in chei if k in ("celule", "format_celule", "selectie", "nume_fisier")]
            if baza:
                rez.update(super().citeste(baza))
            if "format_celule" in chei:
                ur = self.ws.UsedRange
                for c in (ur.Cells if ur.Count <= 400 else []):
                    if c.WrapText is True:
                        rez["format_celule"].setdefault(RR.adr(c), {})["incadrare"] = True
            for k in chei:
                if k == "latimi_coloane":
                    rez[k] = self.latimi()
                elif k == "inaltimi_randuri":
                    rez[k] = self.inaltimi()
                elif k == "registru_activ":
                    rez[k] = str(self.a.ActiveWorkbook.Name) if int(self.a.Workbooks.Count) else None
            return {k: rez[k] for k in chei}

        def inchide_tot(self):
            """Ferestrele rămase: Cancel (nimic salvat) / Esc; Backstage închis; Esc în celulă până COM răspunde."""
            for _ in range(6):
                ramase = [(x, c) for x, c, _ in self.ferestre() if x not in self.baza and x != self.hmain]
                if not ramase:
                    break
                for x, c in ramase:
                    b = None
                    for n in W3.CANCEL + ("OK",):
                        b = RR.gaseste_nume(U.din_hwnd(x), n, (50000,))
                        if b is not None:
                            break
                    if b is not None and c != "Net UI Tool Window":
                        W3.pornit_in_fir(lambda b=b: RR.uia_invoke(b), 5)
                    else:
                        win32gui.PostMessage(x, 0x0100, 0x1B, 0)
                        win32gui.PostMessage(x, 0x0101, 0x1B, 0)
                time.sleep(1.0)
            for _ in range(4):
                if not self.ocupata():
                    break
                t = RR.tinta_tastatura(self.hdoc)
                win32gui.PostMessage(t, 0x0100, 0x1B, RR.lparam_tasta(0x1B))
                win32gui.PostMessage(t, 0x0101, 0x1B, RR.lparam_tasta(0x1B, True))
                time.sleep(1.0)
            if self.backstage_pagina():
                self.s.iesi_backstage()

        def curata_recente(self):
            n, tmp = 0, str(self.tmp).lower()
            try:
                for i in range(int(self.a.RecentFiles.Count), 0, -1):
                    rf = self.a.RecentFiles(i)
                    if str(rf.Path).lower().startswith(tmp):
                        rf.Delete()
                        n += 1
            except Exception as e:  # noqa: BLE001
                log(f"  RecentFiles: {e!r}")
            return n
    return ExcelR7


def proba_alt(r):
    """Canalul „taste_alt” (Alt+= postat): pozitiv = Σ scrie =SUM(B2:B4) în B5; control = aceeași tastă fără Alt
    ținut NU scrie =SUM( (scrie „=”)."""
    rez = {}
    for cu_alt in (True, False):
        r.start({"celule": {"B2": 9, "B3": 7, "B4": 8}, "selectie": "B5"})
        r.alt_egal(cu_alt)
        RR.trimite_taste(r.hdoc, "Enter")
        r.inchide_tot()
        try:
            rez[cu_alt] = str(r.ws.Range("B5").Formula)
        except Exception as e:  # noqa: BLE001
            rez[cu_alt] = f"eroare: {e!r}"[:80]
    poz = rez[True].upper().startswith("=SUM(")
    neg = not rez[False].upper().startswith("=SUM(")
    r.probe["taste_alt"] = {"pozitiv": poz, "control": neg, "trecut": poz and neg,
                            "detalii": {"cu Alt ținut": rez[True], "fără Alt (control)": rez[False]}}
    log(f"  proba taste_alt: {r.probe['taste_alt']}")


def ruleaza_unul_r7(r, sc, versiune):
    cum, eroare, stare = [], None, {}
    mod = sc["mod"]
    try:
        r.start(sc["start"])
        for p in sc["pasi"]:
            cum.append(r.pas_gest(p) if mod == "gest_real" else r.pas_model(p))
        time.sleep(0.8)
        stare = r.citeste(sc["stare_citita"])
    except Exception as e:  # noqa: BLE001
        eroare = W3.fara_cale_personala(f"{type(e).__name__}: {e}"[:600])
        stare = {}
        log(traceback.format_exc()[-1200:])
    finally:
        try:
            r.inchide_tot()
        except Exception:  # noqa: BLE001
            pass
        rec = r.curata_recente()
    canale = set(r.canale_r7)
    probat = eroare is None and bool(canale) and all(r.probe.get(c, {}).get("trecut") for c in canale)
    fisiere = sorted(f.name for f in r.tmp.iterdir() if f.is_file()) if r.tmp.exists() else []
    rez = {"id": sc["id"], "mod_probat": probat, "stare": stare, "eroare": eroare,
           "cum": W3.fara_cale_personala(
               (f"{mod} — instanță NOUĂ excel ({versiune}), desktop ascuns {DESKTOP_SC}, {time.strftime('%d.%m.%Y %H:%M')}, "
                "referinte/acoperire_excel_r7.py (pe clasele din ruleaza_real.py), DisplayAlerts = True; pașii: " +
                " · ".join(cum) + "; pornirea prin COM; ferestrele care întreabă citite prin UI Automation înainte de a fi "
                "închise cu Cancel / Esc, restul prin COM" + (f"; fișiere în %TEMP% (dosar unic, șters): {fisiere}" if fisiere else "") +
                (f"; {rec} intrări din lista Recent (fișierele mele) șterse" if rec else ""))),
           "canale": sorted(canale), "canale_neprobate": sorted(c for c in canale if not r.probe.get(c, {}).get("trecut"))}
    if not probat and eroare is None:
        rez["nota"] = "mod_probat = false: un canal folosit n-a trecut proba în aceeași rulare (vezi canale_neprobate)"
    for f in fisiere:
        try:
            (r.tmp / f).unlink()
        except Exception:  # noqa: BLE001
            pass
    (RR.REAL / f"{sc['id']}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    log(f"  {sc['id']}: {'OK' if eroare is None else 'EROARE ' + eroare[:160]} probat={probat} "
        f"stare={json.dumps(stare, ensure_ascii=False)[:260]}")
    return rez


def scenarii_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    toate = {}
    for f in sorted((RR.SCEN / "excel").glob("*.json")):
        s = json.loads(f.read_text(encoding="utf-8"))
        if s.get("rulat_de") == RULAT_DE:
            toate[s["id"]] = s
    ordine = [s["id"] for s in SCEN_R7] + VECHI_R7
    iduri = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--id=")), ordine)
    sc = [toate[i] for i in ordine if i in iduri and i in toate]
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    r = clasa_excel_r7()("excel")
    rez, t0 = [], time.time()
    try:
        r.porneste()
        versiune = f"{U.versiune_exe(U.APPS['excel']['exe'])}, build COM {r.s.build}"
        try:
            RR.proba(r)
        except Exception:  # noqa: BLE001
            log("proba a căzut:\n" + traceback.format_exc())
        try:
            proba_alt(r)
        except Exception:  # noqa: BLE001
            log("proba_alt a căzut:\n" + traceback.format_exc())
        for s in sc:
            rez.append(ruleaza_unul_r7(r, s, versiune))
    except Exception:  # noqa: BLE001
        log(traceback.format_exc())
    finally:
        try:
            r.inchide()
        except Exception:  # noqa: BLE001
            log("închidere: " + traceback.format_exc())
    jurnal = {"generat": time.strftime("%Y-%m-%d %H:%M"), "desktop": DESKTOP_SC, "probe": r.probe,
              "scenarii": [x["id"] for x in sc], "rezultate": [{k: x[k] for k in ("id", "mod_probat", "eroare")} for x in rez],
              "erori_sesiune": r.s.erori, "durata_s": round(time.time() - t0), "jurnal": LOG}
    IES.mkdir(parents=True, exist_ok=True)
    JURNAL_SC.write_text(W3.fara_cale_personala(json.dumps(jurnal, ensure_ascii=False, indent=1, default=str)), encoding="utf-8")
    print(f"scenarii: {len(rez)} rulate, {sum(1 for x in rez if x['mod_probat'])} probate, {round(time.time() - t0)} s")
    return 0


# ------------------------------------------------------------------------------------------------ scrie / verifica
def scrie():
    import acoperire_word_r3 as W
    b = json.loads(BRUT.read_text(encoding="utf-8"))
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    ale_mele = set(r.get("acoperire_r7", {}).get("suprafete_adaugate", []))
    puse, sarite = [], []
    # Order după „Sort by” = Punctaj / Nume: caseta a arătat coloana, dar Order a rămas „A to Z” și lista identică cu cea
    # fără coloană — nu pot dovedi că fereastra a primit alegerea (R7-12) → NU intră în referință
    nedovedite = {"lista.SortDialog_Order_numere", "lista.SortDialog_Order_text"}
    hg = b["fapte"].get("h_grafic") or {}
    if "file_dupa" in hg:     # fila Developer = setarea omului (profilul curat R4 n-o are), ca în dump_uia_office
        hg["file_dupa"] = [x for x in hg["file_dupa"] if x != "Developer"]
    b["fapte"]["NEVERIFICAT"] = {
        "lista.SortDialog_Order_numere/_text": "Sort by arăta Punctaj / Nume (ales cu săgeata ↓), dar Order a rămas „A to Z” "
        "cu aceeași listă ca fără coloană — alegerea poate să nu fi ajuns la fereastră; scoase din referință (de_verificat R7-12)",
        "z_fara_registru": "Ctrl+W pe singurul registru nemodificat: după 20 s registrul era tot deschis (Book1) — tasta poate să "
        "nu fi ajuns; nu e un fapt despre Excel (de_verificat R7-16)",
        "g_completare": "după „=AV” / „=SU” tastate, nicio fereastră nouă și nicio listă în fereastra principală pe desktopul "
        "ascuns — lista de completare n-a putut fi citită (de_verificat R6-2)"}
    for k, v in b["suprafete"].items():
        if k in nedovedite:
            continue
        if k in S and k not in ale_mele:
            sarite.append(k)            # cheile vechi rămân neatinse
            continue
        v = json.loads(json.dumps(v))
        if k.startswith("dialog.") and v.get("clasa_fereastra") == "NUIDialog":
            inter = W.cauta_noduri(v, lambda n: n.get("tip") == "Window" and n.get("eticheta"))
            if inter and not v.get("eticheta"):
                v["eticheta"] = inter[0]["eticheta"]
                v["nota"] = ("eticheta rădăcinii = numele ferestrei interioare (textul afișat); în UI Automation fereastra "
                             "exterioară NUIDialog n-are nume")
        if k.startswith("lista.") and not k.startswith(("lista.FileSaveAs", "lista.SortDialog")):
            pop = W.cauta_noduri(v, lambda n: n.get("tip") == "Menu")
            if pop:
                nv = dict(pop[0])
                nv["deschis_prin"] = v.get("deschis_prin")
                nv["nota"] = ("lista deschisă = fereastra-popup (Menu) a controlului din panglică; controlul („" +
                              str(v.get("eticheta")) + "”) e în panglica.<filă>")
                v = nv
        if k == "lista.FileSaveAs_navigare":
            def scoate(n):
                n["copii"] = [scoate(x) for x in n.get("copii", []) if not str(x.get("eticheta", "")).startswith("[element personal")]
                return n
            v = scoate(v)
            v["copii"] = [cc for x in v.get("copii", []) for cc in ((x.get("copii") or []) if x.get("eticheta") == "Desktop" else [x])]
            v["nota"] = ("panoul din stânga al ferestrei Save As (F12), elementele IMPLICITE Windows 11; celelalte (foldere "
                         "fixate de om, contul OneDrive cu nume) scoase ca personale — vezi acoperire_r7.excluse_personal")
        S[k] = v
        puse.append(k)
    r["acoperire_r7"] = {
        "generat": b["generat"], "versiune": b["versiune"], "versiune_com_build": b["versiune_com_build"],
        "cum": ("referinte/acoperire_excel_r7.py capturi: instanță NOUĂ EXCEL.EXE /x pe desktopul ascuns "
                f"{b['desktop']}, fereastra 1366×768 css (Sesiune din dump_uia_office.py), gesturile ca în ruleaza_real.py "
                "(WM_CHAR / WM_KEYDOWN cu Ctrl ținut; UIA Expand/Invoke/Select/Toggle; ferestrele Sort / Column Width prin "
                "CommandBars.ExecuteMso); niciun Save adevărat — ferestrele închise cu Cancel / Esc; arborii normalizați "
                "și redactați ca în dump"),
        "suprafete_adaugate": puse, "chei_vechi_neatinse": sarite, "fapte": b["fapte"],
        "excluse_personal": b["excluse_personal"], "redactari": b["redactari"], "erori": b["erori"],
        "rulari": b.get("rulari", []),
    }
    text = json.dumps(r, ensure_ascii=False, indent=1)
    for x in W.interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas — NU scriu uia_excel.json")
    if re.search(r"c:[\\/]+users[\\/]", text.lower()):
        raise RuntimeError("o cale C:/Users a rămas — NU scriu uia_excel.json")
    REF.write_text(text, encoding="utf-8")
    print(f"uia_excel.json: {len(puse)} suprafețe noi: {puse}; neatinse: {sarite}")
    return 0


def verifica():
    import acoperire_word_r3 as W
    p = []
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    ac = r.get("acoperire_r7")
    if not ac:
        p.append("uia_excel.json nu are blocul acoperire_r7")
    else:
        for k in ac.get("suprafete_adaugate", []):
            if k not in S:
                p.append(f"suprafața {k} anunțată, dar lipsă")
    text = REF.read_text(encoding="utf-8").lower()
    for x in W.interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text):
            p.append("nume interzis în uia_excel.json")
    if re.search(r"c:[\\/]+users[\\/]", text):
        p.append("cale cu C:/Users în uia_excel.json")
    for s in SCEN_R7:
        f = D / "scenarii" / "excel" / f"{s['id']}.json"
        if not f.exists():
            p.append(f"scenariul {s['id']} lipsește")
    for i in [s["id"] for s in SCEN_R7] + VECHI_R7:
        f = AICI / "scenarii_real" / f"{i}.json"
        if f.exists():
            t = f.read_text(encoding="utf-8")
            if re.search(r"c:[\\/]+users[\\/]", t.lower()):
                p.append(f"cale cu C:/Users în scenarii_real/{i}.json")
    for x in p:
        print("PROBLEMĂ:", x)
    print(len(p))
    return 1 if p else 0


# ------------------------------------------------------------------------------------------------ main
def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd in ("capturi", "scenarii"):
        import dump_uia_office as U_
        intern = {"capturi": capturi_intern, "scenarii": lambda: scenarii_intern()}[cmd]
        if U_.nume_desktop_curent().lower() != "default":
            return intern()
        r = subprocess.run([sys.executable, str(HIDDEN), "run", "--desktop", DESKTOP if cmd == "capturi" else DESKTOP_SC,
                            "--timeout", "1500", "--", sys.executable, str(Path(__file__).resolve()), "_" + cmd] +
                           [a for a in sys.argv if a.startswith(("--doar=", "--id="))])
        return r.returncode
    if cmd == "_capturi":
        return capturi_intern()
    if cmd == "_scenarii":
        return scenarii_intern()
    if cmd == "scrie":
        return scrie()
    if cmd == "scrie_scenarii":
        return scrie_scenarii()
    if cmd == "verifica":
        return verifica()
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
