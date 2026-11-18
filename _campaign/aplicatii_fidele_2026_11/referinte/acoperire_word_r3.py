# -*- coding: utf-8 -*-
"""Runda `acoperire` pe Word după platoul valului B-word (18.11.2026) — generator-soră al lui dump_uia_office.py.

Ce face (tot din Word-ul REAL de pe PC, instanță NOUĂ, pe desktopul ASCUNS; refuză ecranul omului):
  capturi   — arborii UI Automation ai suprafețelor pe care referința din 16.11 nu le avea:
              a. Ctrl+S pe un document NOU nesalvat (ce fereastră apare) + „More save options” din ea;
              b. Ctrl+W și ✕ pe un document cu modificări nesalvate (fereastra care întreabă; butoanele, ordinea,
                 butonul implicit) — închisă cu Cancel, nimic salvat;
              c. lista derulantă a casetei Font Size (Home › Font), deschisă;
              d. File › Open (Ctrl+O): ce pagină se deschide + structura UNUI rând din Recent (textele înlocuite cu
                 „<fișier>”, nimic personal) + fereastra Windows Open (Ctrl+F12);
              e. fereastra Save As (F12): panoul din stânga (doar elementele implicite Windows; restul = personal, scos),
                 lista „Save as type” deschisă, fereastra după alegerea PDF (bifa „Open file after publishing”) — Cancel;
              f. listele derulante din de_verificat.md R1-2 (Bullets, Numbering, Borders, Change Case, Line and
                 Paragraph Spacing, Insert › Table, Layout › Margins, Orientation);
              g. faptele R1-5 / R1-7 (Ctrl+P, Ctrl+F, Ctrl+H, File pe document nou: ce apare).
              Ieșirea brută: ../runde/3/acoperire/capturi_word_brut.json (redactată ca dump-ul: nume/căi/e-mailuri).
  scrie     — mută suprafețele capturate în uia_word.json (chei NOI; cele vechi rămân neatinse) + blocul
              `acoperire_r3` (cum, când, ce s-a scos ca personal). Fără Office.
  verifica  — oracolul livrabilului: cheile noi prezente, niciun nume interzis, nicio cale cu numele utilizatorului;
              ULTIMA linie = numărul de probleme.

Rulare:
  python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/acoperire_word_r3.py capturi
      (se mută singur pe desktopul ascuns LHRefOffice prin C:/00/AI_0/tools/hidden_desktop.py)
  python .../acoperire_word_r3.py scrie
  python .../acoperire_word_r3.py verifica

Reguli: instanță nouă /x; fereastra 1366×768 css (Sesiune.aseaza); niciun Save adevărat (doar Cancel / Don't Save /
Esc); DisplayAlerts lăsat cum e (ferestrele care întreabă TREBUIE să apară); închidere ca în dump_uia_office (COM Quit
fără salvare, forțat doar PID-ul nostru după 90 s). Nicio setare schimbată.
"""
import ctypes
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
IES = D / "runde" / "3" / "acoperire"
BRUT = IES / "capturi_word_brut.json"
REF = AICI / "uia_word.json"
HIDDEN = Path(r"C:\00\AI_0\tools\hidden_desktop.py")
DESKTOP = "LHRefOffice"
UAC = ("UAC_InputIndicatorOverlayWnd", "UAC Input Indicator")
WM_CLOSE, WM_SYSCOMMAND, SC_CLOSE = 0x0010, 0x0112, 0xF060
CANCEL = ("Cancel", "Revocare", "Anulare")
# panoul din stânga al ferestrelor de fișiere Windows 11 (română): elementele IMPLICITE; orice alt nume (foldere fixate
# de om, contul OneDrive cu numele lui) = personal, nu intră în referință
NAV_IMPLICIT = {"Acasă", "Galerie", "Desktop", "Descărcări", "Documente", "Imagini", "Muzică", "Videoclipuri",
                "Acest PC", "Rețea", "OneDrive", "Linux", "Acces rapid"}
LISTE_PANGLICA = [   # (cheia, fila, idMso) — de_verificat.md R1-2
    ("lista.BulletsGalleryWord", "TabHome", "BulletsGalleryWord"),
    ("lista.NumberingGalleryWord", "TabHome", "NumberingGalleryWord"),
    ("lista.BordersSelectionGallery", "TabHome", "BordersSelectionGallery"),
    ("lista.ChangeCaseGallery", "TabHome", "ChangeCaseGallery"),
    ("lista.LineSpacingGallery", "TabHome", "LineSpacingGallery"),
    ("lista.TableInsertGallery", "TabInsert", "TableInsertGallery"),
    ("lista.PageMarginsGallery", "TabPageLayoutWord", "PageMarginsGallery"),
    ("lista.PageOrientationGallery", "TabPageLayoutWord", "PageOrientationGallery"),
]
U = None
RR = None


def log(m):
    print(m, flush=True)
    LOG.append(m)


LOG = []


# ------------------------------------------------------------------------------------------------ ajutoare
class Cap:
    """Capturile unei sesiuni Word (Sesiune din dump_uia_office), cu ferestrele noi ale PID-ului nostru."""

    def __init__(self, s):
        self.s = s
        self.supr = {}
        self.fapte = {}
        self.excluse = []
        self.erori = []

    @property
    def pid(self):
        return self.s.proc.pid

    def ferestre(self):
        return [(x, c, t) for x, c, t in U.ferestre_pid(self.pid) if c not in UAC]

    def noi(self, inainte, asteapta=8.0, clase=None):
        t0 = time.time()
        rez = []
        while time.time() - t0 < asteapta:
            time.sleep(0.25)
            rez = [(x, c, t) for x, c, t in self.ferestre() if x not in inainte and (clase is None or c in clase)]
            if rez:
                time.sleep(1.5)       # conținutul ferestrei se umple după ce apare
                return [(x, c, t) for x, c, t in self.ferestre() if x not in inainte and (clase is None or c in clase)]
        return rez

    def nod(self, h_sau_el, fara_liste=False):
        el = U.din_hwnd(h_sau_el) if isinstance(h_sau_el, int) else h_sau_el
        return self.s.norm().nod(U.arbore(el), fara_elemente_lista=fara_liste)

    def lista_deschisa(self, ctl, noi, asteapta=6.0):
        """Conținutul unei liste/galerii deschise din panglică: rândurile apar după fereastră, fie sub controlul din
        panglică, fie în NetUIHWND-ul ferestrei noi (ca în ruleaza_real.py › panglica). Întoarce nodul cu cele mai multe
        rânduri (ListItem / MenuItem / Button) după ce numărul lor nu mai crește."""
        def rand(n):
            return sum(1 for t_, _ in etichete(n) if t_ in ("ListItem", "MenuItem", "Button", "DataItem"))
        best, n_best, stabil, t0 = None, -1, 0, time.time()
        while time.time() - t0 < asteapta:
            cand = []
            for x, cl, _ in noi:
                for hc in U.copii_clasa(x, ["NetUIHWND"]) + [x]:
                    try:
                        n = self.nod(hc)
                        n["clasa_fereastra"] = cl
                        cand.append(n)
                    except Exception:  # noqa: BLE001
                        pass
            if ctl is not None:
                try:
                    cand.append(dict(self.nod(ctl), nota="rândurile listei apar sub controlul din panglică"))
                except Exception:  # noqa: BLE001
                    pass
            for n in cand:
                r = rand(n)
                if r > n_best:
                    best, n_best, stabil = n, r, 0
            stabil += 1
            if n_best > 0 and stabil >= 3:
                break
            time.sleep(0.6)
        return best

    def backstage_pagina(self):
        """Pagina Backstage selectată acum (None dacă Backstage nu e deschis)."""
        nav = U.gaseste(U.din_hwnd(self.s.hmain), U.P_AID, "NavBarMenu")
        if not nav:
            return None
        for ct in (50019, 50007, 50011):     # TabItem / ListItem / MenuItem
            for e in U.gaseste_toate(nav, U.P_CT, ct):
                try:
                    if e.GetCurrentPropertyValue(30079):       # SelectionItem.IsSelected
                        return str(e.CurrentName)
                except Exception:  # noqa: BLE001
                    pass
        return "(Backstage deschis, nicio pagină selectată citită)"

    def butoane(self, h):
        """Butoanele ferestrei, în ordinea de pe ecran (sus-jos, stânga-dreapta), cu implicitul (STATE_SYSTEM_DEFAULT)
        și focusul."""
        el = U.din_hwnd(h)
        out = []
        for b in U.gaseste_toate(el, U.P_CT, 50000):
            try:
                r = b.CurrentBoundingRectangle
                st = 0
                p = U.pattern(b, 10018, U.ILegacy)
                if p is not None:
                    st = int(p.CurrentState)
                nume = str(b.CurrentName or "")
                if not nume or r.right - r.left <= 0:
                    continue
                out.append({"eticheta": self.s.cur.text(nume), "implicit": bool(st & 0x100),
                            "focus": bool(b.CurrentHasKeyboardFocus), "x": r.left, "y": r.top})
            except Exception:  # noqa: BLE001
                pass
        out.sort(key=lambda b: (round(b["y"] / 8), b["x"]))
        for b in out:
            b.pop("x"), b.pop("y")
        return out

    def texte(self, h):
        el = U.din_hwnd(h)
        out = []
        for t in U.gaseste_toate(el, U.P_CT, 50020):
            try:
                n = str(t.CurrentName or "")
                if n and n not in out:
                    out.append(self.s.cur.text(n))
            except Exception:  # noqa: BLE001
                pass
        return out

    def inchide_noi(self, inainte):
        """Cancel în ferestrele noi (altfel WM_CLOSE), apoi Esc; nimic salvat."""
        import win32gui
        for _ in range(8):
            ramase = [(x, c, t) for x, c, t in self.ferestre() if x not in inainte]
            if not ramase:
                return True
            for x, c, t in ramase:
                b = None
                for n in CANCEL:
                    b = RR.gaseste_nume(U.din_hwnd(x), n, (50000,))
                    if b is not None:
                        break
                if b is not None and c != "Net UI Tool Window":
                    pornit_in_fir(lambda b=b: RR.uia_invoke(b), 5)
                else:
                    win32gui.PostMessage(x, 0x0100, 0x1B, 0)
                    win32gui.PostMessage(x, 0x0101, 0x1B, 0)
                    if c != "Net UI Tool Window":
                        win32gui.PostMessage(x, WM_CLOSE, 0, 0)
            time.sleep(1.0)
        return not [x for x, _, _ in self.ferestre() if x not in inainte]

    def esc_main(self, n=2):
        import win32gui
        for _ in range(n):
            t = RR.tinta_tastatura(self.s.hdoc)
            win32gui.PostMessage(t, 0x0100, 0x1B, RR.lparam_tasta(0x1B))
            win32gui.PostMessage(t, 0x0101, 0x1B, RR.lparam_tasta(0x1B, True))
            time.sleep(0.5)


def pornit_in_fir(f, timeout=10):
    """Un apel UIA care poate bloca (Invoke pe un buton care deschide o fereastră modală) — într-un fir separat."""
    rez = {}

    def lucru():
        import pythoncom
        pythoncom.CoInitialize()
        try:
            rez["r"] = f()
        except Exception as e:  # noqa: BLE001
            rez["err"] = repr(e)
        finally:
            pythoncom.CoUninitialize()
    t = threading.Thread(target=lucru, daemon=True)
    t.start()
    t.join(timeout)
    return t, rez


def placeholder(nod, eticheta="<fișier>"):
    """Structura fără conținut personal: orice text/valoare/ajutor -> eticheta-substitut; tipul și locul rămân."""
    n = {k: v for k, v in nod.items() if k not in ("ajutor", "valoare", "copii")}
    if n.get("eticheta"):
        n["eticheta"] = eticheta
    n["copii"] = [placeholder(c, eticheta) for c in nod.get("copii", [])]
    return n


# ------------------------------------------------------------------------------------------------ capturile
def a_ctrl_s(c):
    """a. Ctrl+S pe document NOU nesalvat (cu text, ca în lecție): ce fereastră apare."""
    s = c.s
    d = s.appcom.ActiveDocument
    d.Content.Text = "Poezia mea\rToamna vine."
    time.sleep(0.8)
    inainte = {x for x, _, _ in c.ferestre()}
    RR.trimite_taste(s.hdoc, "Ctrl+S")
    noi = c.noi(inainte, 10)
    fapt = {"gest": "Ctrl+S (WM_KEYDOWN/UP cu Ctrl ținut, ca ruleaza_real.py)", "document": "nou, nesalvat, 2 paragrafe",
            "ferestre_noi": [{"clasa": cl, "titlu": s.cur.text(t)} for _, cl, t in noi],
            "backstage": c.backstage_pagina()}
    for x, cl, t in noi:
        if cl == "Net UI Tool Window":
            continue
        fisier_win = cl == "#32770"
        nod = c.nod(x, fara_liste=fisier_win)
        nod["clasa_fereastra"] = cl
        nod["titlu_fereastra"] = s.cur.text(t)
        nod["deschis_prin"] = "Ctrl+S pe document nou nesalvat"
        nod["butoane_ordine"] = c.butoane(x)
        nod["texte"] = c.texte(x)
        cheie = "dialog.save_this_file" if not fisier_win else "dialog.ctrl_s_document_nou"
        c.supr[cheie] = nod
        fapt["cheie"] = cheie
        log(f"  a. Ctrl+S -> {cl} {t!r}: {U.numara(nod)} noduri; butoane {[b['eticheta'] for b in nod['butoane_ordine']]}")
        # „More save options” (R3-8): ce deschide
        mo = None
        for n in ("More options…", "More save options", "More save options...", "More options..."):
            mo = RR.gaseste_nume(U.din_hwnd(x), n, (50000, 50005, 50011, 50020))
            if mo is not None:
                break
        if mo is not None:
            inainte2 = {y for y, _, _ in c.ferestre()}
            pornit_in_fir(lambda mo=mo: RR.uia_invoke(mo) or RR.uia_legacy(mo), 4)
            noi2 = c.noi(inainte2 - {x}, 8)
            fapt["more_save_options"] = {"ferestre_noi": [{"clasa": cl2, "titlu": s.cur.text(t2)} for _, cl2, t2 in noi2
                                                          if _ != x],
                                         "backstage": c.backstage_pagina()}
            log(f"  a. More save options -> {fapt['more_save_options']}")
            c.inchide_noi(inainte)
            if c.backstage_pagina():
                s.iesi_backstage()
        break
    if fapt["backstage"] and "cheie" not in fapt:
        b = U.arbore(U.din_hwnd(s.hmain))
        bv = U.cauta(b, lambda n: n.get("id") == "BackstageView")
        if bv:
            c.supr["backstage.ctrl_s_document_nou"] = s.norm().nod(bv[0])
            fapt["cheie"] = "backstage.ctrl_s_document_nou"
    c.inchide_noi(inainte)
    if c.backstage_pagina():
        s.iesi_backstage()
    c.fapte["a_ctrl_s_document_nou"] = fapt


def b_inchidere(c):
    """b. Ctrl+W și ✕ pe un document cu modificări nesalvate: fereastra care întreabă (apoi Cancel)."""
    s = c.s
    rez = {}
    for fel in ("ctrl_w", "x"):
        d = s.appcom.ActiveDocument
        d.Content.Text = "Ana are mere"
        RR.trimite_text(s.hdoc, "")          # nimic tastat; documentul e oricum modificat (Saved = False)
        try:
            saved = bool(d.Saved)
        except Exception:  # noqa: BLE001
            saved = None
        inainte = {x for x, _, _ in c.ferestre()}
        if fel == "ctrl_w":
            RR.trimite_taste(s.hdoc, "Ctrl+W")
            cum = "Ctrl+W (WM_KEYDOWN/UP cu Ctrl ținut)"
        else:
            btn = buton_close(s.hmain)
            c.fapte["b_buton_close_gasit"] = btn is not None
            if btn is not None:
                pornit_in_fir(lambda e=btn: RR.uia_invoke(e) or RR.uia_legacy(e), 3)
                cum = "UIA Invoke pe butonul „Close” (✕) din bara de titlu, într-un fir separat"
            else:
                import win32gui
                win32gui.PostMessage(s.hmain, WM_SYSCOMMAND, SC_CLOSE, 0)
                cum = "WM_SYSCOMMAND SC_CLOSE (butonul Close nu a fost găsit în UIA)"
        noi = c.noi(inainte, 10)
        f = {"gest": cum, "document_saved_inainte": saved,
             "ferestre_noi": [{"clasa": cl, "titlu": s.cur.text(t)} for _, cl, t in noi]}
        for x, cl, t in noi:
            if cl == "Net UI Tool Window":
                continue
            nod = c.nod(x)
            nod["clasa_fereastra"] = cl
            nod["titlu_fereastra"] = s.cur.text(t)
            nod["deschis_prin"] = cum + " pe un document NOU modificat, nesalvat"
            nod["butoane_ordine"] = c.butoane(x)
            nod["texte"] = c.texte(x)
            rez[fel] = nod
            f["titlu"] = s.cur.text(t)
            f["texte"] = nod["texte"]
            f["butoane"] = nod["butoane_ordine"]
            log(f"  b. {fel} -> {cl} {t!r}: texte {nod['texte']} butoane {nod['butoane_ordine']}")
            break
        c.inchide_noi(inainte)
        time.sleep(1)
        f["word_inca_deschis"] = bool([h for h, cl, _ in c.ferestre() if cl == "OpusApp"])
        try:
            f["documente_dupa_cancel"] = int(s.appcom.Documents.Count)
        except Exception as e:  # noqa: BLE001
            f["documente_dupa_cancel"] = f"necitit: {e!r}"[:80]
        c.fapte[f"b_{fel}_modificat"] = f
    if "ctrl_w" in rez:
        c.supr["dialog.save_your_changes_to_this_file"] = rez["ctrl_w"]
    if "x" in rez:
        a, b = rez.get("ctrl_w"), rez["x"]
        la_fel = a is not None and json.dumps(etichete(a)) == json.dumps(etichete(b))
        c.fapte["b_x_la_fel_ca_ctrl_w"] = la_fel
        if not la_fel:
            c.supr["dialog.save_your_changes_to_this_file_x"] = b


def buton_close(hmain):
    """Butonul ✕ („Close”) din bara de titlu Word: Button cu numele Close, în banda de sus a ferestrei."""
    import win32gui
    top = win32gui.GetWindowRect(hmain)[1]
    A = U.A
    cond = A.CreateAndCondition(A.CreatePropertyCondition(U.P_NAME, "Close"), A.CreatePropertyCondition(U.P_CT, 50000))
    try:
        arr = U.din_hwnd(hmain).FindAll(4, cond)
        for i in range(arr.Length if arr else 0):
            e = arr.GetElement(i)
            if e.CurrentBoundingRectangle.top - top < 60:
                return e
    except Exception as e:  # noqa: BLE001
        log(f"  buton_close: {e!r}")
    return None


def etichete(n, acc=None):
    acc = [] if acc is None else acc
    acc.append((n.get("tip"), n.get("eticheta")))
    for k in n.get("copii", []):
        etichete(k, acc)
    return acc


def c_font_size(c):
    """c. lista derulantă a casetei Font Size (Home › Font), deschisă."""
    s = c.s
    d = s.appcom.ActiveDocument
    d.Content.Text = "Ana are mere"
    d.Range(4, 7).Select()
    RR.Rulare.fila(type("X", (), {"hmain": s.hmain})(), "TabHome")
    cb = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "FontSize")
    if not cb:
        c.erori.append("c: ComboBox FontSize negăsit")
        return
    inainte = {x for x, _, _ in c.ferestre()}
    ok = RR.uia_expand(cb)
    noi = c.noi(inainte, 6)
    nod = c.lista_deschisa(cb, noi)
    nod["deschis_prin"] = "UIA ExpandCollapse.Expand pe ComboBox „Font Size” (id FontSize), selecție „are” în „Ana are mere”"
    c.supr["lista.FontSize"] = nod
    randuri = [e for t_, e in etichete(nod) if t_ == "ListItem"]
    c.fapte["c_font_size_lista"] = {"expand": ok, "ferestre_noi": [(cl, t) for _, cl, t in noi], "randuri": randuri}
    log(f"  c. Font Size ▾: {len(randuri)} rânduri {randuri[:20]}")
    RR.uia_collapse(cb)
    c.inchide_noi(inainte)
    c.esc_main(1)


def d_open(c):
    """d. Ctrl+O -> pagina Backstage + structura unui rând Recent (fără nume); Ctrl+F12 -> fereastra Windows Open."""
    s = c.s
    inainte = {x for x, _, _ in c.ferestre()}
    RR.trimite_taste(s.hdoc, "Ctrl+O")
    time.sleep(3.5)
    pag = c.backstage_pagina()
    f = {"gest": "Ctrl+O", "backstage": pag, "ferestre_noi": [(cl, s.cur.text(t)) for _, cl, t in c.noi(inainte, 1)]}
    if pag:
        bv = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "GroupRecentDocuments")
        if bv:
            b = U.arbore(bv)
            itemi = U.cauta(b, lambda n: n.get("ct") == 50007)       # ListItem
            rand = [n for n in itemi if n.get("key")]                  # rândurile de fișier au tasta de acces (Y 3…)
            if rand:
                nod = placeholder(s.norm().nod(rand[0]))
                nod["nota"] = ("structura PRIMULUI rând din Recent (Ctrl+O): toate textele înlocuite cu „<fișier>” "
                               "(numele, calea, data sunt ale omului)")
                nod["deschis_prin"] = "Ctrl+O pe document nou"
                c.supr["backstage.Open_rand_recent"] = nod
                f["rand_recent_tipuri"] = [t_ for t_, _ in etichete(nod)]
            f["randuri_recent"] = len(rand)
        s.iesi_backstage()
    c.fapte["d_ctrl_o"] = f
    log(f"  d. Ctrl+O -> {f}")
    c.inchide_noi(inainte)
    # fereastra Windows „Open” (aceeași care apare din Browse): Ctrl+F12
    inainte = {x for x, _, _ in c.ferestre()}
    RR.trimite_taste(s.hdoc, "Ctrl+F12")
    noi = c.noi(inainte, 10, ("#32770",))
    for x, cl, t in noi:
        time.sleep(2.0)
        nod = c.nod(x, fara_liste=True)
        nav_implicit(c, x, nod, "dialog.open")
        nod["clasa_fereastra"] = cl
        nod["titlu_fereastra"] = s.cur.text(t)
        nod["deschis_prin"] = "Ctrl+F12 (fereastra Windows Open; Backstage › Open › Browse deschide aceeași fereastră [DEDUS])"
        c.supr["dialog.open"] = nod
        c.fapte["d_ctrl_f12"] = {"titlu": s.cur.text(t), "clasa": cl, "butoane": c.butoane(x)}
        log(f"  d. Ctrl+F12 -> {cl} {t!r}: {U.numara(nod)} noduri")
        break
    c.inchide_noi(inainte)


def nav_implicit(c, h, nod, cheie):
    """Panoul din stânga al unei ferestre de fișiere: doar elementele de pe primul nivel, cele implicite Windows cu
    eticheta lor; restul = personal (scos, numărat). Scrie lista în fapte[cheie]."""
    s = c.s
    el = U.din_hwnd(h)
    tree = U.gaseste(el, U.P_NAME, "Panou de navigare")
    if not tree:
        c.fapte[f"nav_{cheie}"] = "Tree „Panou de navigare” negăsit"
        return None
    b = U.arbore(tree)
    N = s.norm()
    personale = [0]
    implicite = []

    def item(k, nivel):
        nume = (k.get("n") or "").strip()
        n = N.nod(dict(k, k=[]))
        if nume in NAV_IMPLICIT:
            n["eticheta"] = nume
            implicite.append(("  " * nivel) + nume)
        else:
            personale[0] += 1
            n["eticheta"] = "[element personal, nesalvat]"
        n["copii"] = []
        if nivel < 2 and nume in NAV_IMPLICIT:
            n["copii"] = [item(kk, nivel + 1) for kk in k.get("k", []) if kk.get("ct") == 50024]
        return n
    primul = [item(k, 1) for k in b.get("k", []) if k.get("ct") == 50024]
    rez = {"tip": "Tree", "eticheta": "Panou de navigare", "rect_css": N.rect(b["r"]), "copii": primul,
           "nota": "două niveluri; elementele implicite Windows 11 (română) cu eticheta lor, restul (foldere fixate "
                   "de om, contul OneDrive cu nume) înlocuite cu „[element personal, nesalvat]”"}
    personale = personale[0]
    c.fapte[f"nav_{cheie}"] = {"implicite": implicite, "personale_scoase": personale}
    if personale:
        c.excluse.append(f"{cheie}: {personale} elemente personale din panoul din stânga (foldere fixate / cont)")
    return rez


def e_save_as(c):
    """e. F12: fereastra Save As — panoul din stânga, lista „Save as type” deschisă, fereastra după alegerea PDF."""
    s = c.s
    d = s.appcom.ActiveDocument
    d.Content.Text = "Orar\rMarti: sport"
    inainte = {x for x, _, _ in c.ferestre()}
    RR.trimite_taste(s.hdoc, "F12")
    noi = c.noi(inainte, 10, ("#32770",))
    if not noi:
        c.erori.append("e: F12 nu a deschis fereastra Save As")
        return
    x, cl, t = noi[0]
    time.sleep(3.0)           # panoul din stânga se umple după fereastră
    nav = nav_implicit(c, x, None, "dialog.FileSaveAs")
    if nav:
        c.supr["lista.FileSaveAs_navigare"] = dict(nav, deschis_prin="F12 pe document nou (fereastra Save As)")
    el = U.din_hwnd(x)
    # bara de adrese + antetele (le are deja dialog.FileSaveAs; aici doar faptul, pentru raport)
    adresa = U.gaseste(el, U.P_NAME, "Adresă: Documente")
    c.fapte["e_bara_adrese"] = str(adresa.CurrentName) if adresa else None
    tip = U.gaseste(el, U.P_AID, "FileTypeControlHost")
    if tip:
        inainte2 = {y for y, _, _ in c.ferestre()}
        ok = RR.uia_expand(tip)
        time.sleep(1.5)
        noi2 = [(y, cl2, t2) for y, cl2, t2 in c.ferestre() if y not in inainte2]
        lst = None
        for y, cl2, _ in noi2:
            lst = c.nod(y)
            lst["clasa_fereastra"] = cl2
            break
        if lst is None:
            lst = c.nod(tip)
        lst["deschis_prin"] = "F12, apoi UIA ExpandCollapse.Expand pe ComboBox „Save as type:”"
        c.supr["lista.FileSaveAs_tip"] = lst
        randuri = [e for t_, e in etichete(lst) if t_ == "ListItem"]
        c.fapte["e_save_as_type_randuri"] = randuri
        log(f"  e. Save as type ▾: {len(randuri)} rânduri: {randuri}")
        pdf = RR.gaseste_nume(U.din_hwnd(noi2[0][0]) if noi2 else tip, "PDF (*.pdf)", (50007,))
        if pdf is None:
            pdf = RR.gaseste_nume(tip, "PDF (*.pdf)", (50007,))
        if pdf is not None:
            RR.uia_select(pdf)
            time.sleep(0.5)
            RR.uia_collapse(tip)
            time.sleep(2.0)
            el = U.din_hwnd(x)
            tip = U.gaseste(el, U.P_AID, "FileTypeControlHost")
            val = RR.Word._val(tip) if tip else None
            nod = c.nod(x, fara_liste=True)
            nod["clasa_fereastra"] = cl
            nod["titlu_fereastra"] = s.cur.text(t)
            nod["deschis_prin"] = "F12, Save as type ▾ › „PDF (*.pdf)” (UIA SelectionItem.Select), lista închisă"
            c.supr["dialog.FileSaveAs_pdf"] = nod
            bife = {}
            for cbx in U.gaseste_toate(el, U.P_CT, 50002):
                try:
                    bife[str(cbx.CurrentName)] = int(cbx.GetCurrentPropertyValue(30086))   # Toggle.ToggleState
                except Exception:  # noqa: BLE001
                    pass
            c.fapte["e_dupa_pdf"] = {"save_as_type_arata": val, "bife": bife}
            log(f"  e. după PDF: caseta arată {val!r}; bife {bife}")
        else:
            c.erori.append("e: rândul „PDF (*.pdf)” negăsit în listă")
            RR.uia_collapse(tip)
    c.inchide_noi(inainte)


def f_liste(c):
    """f. Listele derulante din de_verificat.md R1-2."""
    s = c.s
    d = s.appcom.ActiveDocument
    d.Content.Text = "Ana are mere"
    d.Range(4, 7).Select()
    for cheie, fila, idm in LISTE_PANGLICA:
        try:
            RR.Rulare.fila(type("X", (), {"hmain": s.hmain})(), fila)
            el = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, idm)
            if not el:
                c.erori.append(f"f: {idm} negăsit pe {fila}")
                continue
            inainte = {x for x, _, _ in c.ferestre()}
            ok = RR.uia_expand(el)
            noi = c.noi(inainte, 6)
            if not noi:
                c.erori.append(f"f: {idm} nu a deschis nicio fereastră (expand={ok})")
                RR.uia_collapse(el)
                continue
            nod = c.lista_deschisa(el, noi)
            nod["deschis_prin"] = f"UIA ExpandCollapse.Expand pe {idm} ({fila}), selecție „are” în „Ana are mere”"
            c.supr[cheie] = nod
            log(f"  f. {idm}: {U.numara(nod)} noduri")
            RR.uia_collapse(el)
            c.inchide_noi(inainte)
            c.esc_main(1)
        except Exception as e:  # noqa: BLE001
            c.erori.append(f"f: {idm}: {e!r}"[:200])
    RR.Rulare.fila(type("X", (), {"hmain": s.hmain})(), "TabHome")


def g_fapte(c):
    """g. R1-7 (File pe document nou: ce pagină) și R1-5 (Ctrl+P, Ctrl+F, Ctrl+H: ce apare)."""
    s = c.s
    ft = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "FileTabButton")
    if ft:
        U.apasa(ft)
        time.sleep(3)
        c.fapte["g_file_document_nou"] = {"backstage": c.backstage_pagina()}
        s.iesi_backstage()
    for combo in ("Ctrl+P", "Ctrl+F", "Ctrl+H"):
        inainte = {x for x, _, _ in c.ferestre()}
        RR.trimite_taste(s.hdoc, combo)
        noi = c.noi(inainte, 5)
        time.sleep(1.5)
        f = {"ferestre_noi": [{"clasa": cl, "titlu": s.cur.text(t)} for _, cl, t in noi],
             "backstage": c.backstage_pagina()}
        f["panou"] = []
        for _ in range(3):
            try:
                b = U.arbore(U.din_hwnd(s.hmain))
                panou = U.cauta(b, lambda n: n.get("c") == "MsoWorkPane" and n.get("n") not in ("Ribbon", "Status Bar"))
                f["panou"] = [s.cur.text(p.get("n")) for p in panou]
                break
            except Exception:  # noqa: BLE001
                time.sleep(1.0)
        c.fapte[f"g_{combo}"] = f
        log(f"  g. {combo} -> {f}")
        c.inchide_noi(inainte)
        if f["backstage"]:
            s.iesi_backstage()
        if combo == "Ctrl+F" and f["panou"]:
            RR.trimite_taste(s.hdoc, "Ctrl+F")    # comută panoul Navigation înapoi (închis)
            c.esc_main(1)


def capturi_intern():
    global U, RR
    import dump_uia_office as U_
    import ruleaza_real as RR_
    U, RR = U_, RR_
    RR.U = U
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    s = U.Sesiune("word")
    c = Cap(s)
    t0 = time.time()
    toate = (c_font_size, e_save_as, d_open, f_liste, a_ctrl_s, g_fapte, b_inchidere)
    doar = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--doar=")), None)
    alese = [f for f in toate if not doar or f.__name__ in doar]
    try:
        s.porneste()
        RR.BARIERA[0] = lambda: s.appcom.Version
        for f in alese:
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
                except Exception:  # noqa: BLE001
                    pass
    finally:
        try:
            s.inchide()
        except Exception:  # noqa: BLE001
            c.erori.append("închidere: " + traceback.format_exc()[-300:])
    out = {"aplicatie": "word", "generat": time.strftime("%Y-%m-%d %H:%M"), "versiune": U.versiune_exe("WINWORD.EXE"),
           "versiune_com_build": s.build, "desktop": DESKTOP, "dpi_factor": s.f, "fereastra": getattr(s, "fereastra_css", None),
           "suprafete": c.supr, "fapte": c.fapte, "excluse_personal": c.excluse, "redactari": s.cur.redactari,
           "sarite_cont": sorted(set(s.sarite)), "erori": c.erori + s.erori, "jurnal": LOG,
           "durata_s": round(time.time() - t0), "rulari": [{"generat": time.strftime("%Y-%m-%d %H:%M"),
                                                            "functii": [f.__name__ for f in alese]}]}
    if doar and BRUT.exists():          # rulare parțială: completează capturile precedente (cheile noi le înlocuiesc)
        vechi = json.loads(BRUT.read_text(encoding="utf-8"))
        vechi["suprafete"].update(c.supr)
        vechi["fapte"].update(c.fapte)
        vechi["excluse_personal"] = sorted(set(vechi.get("excluse_personal", [])) | set(c.excluse))
        for k, v in s.cur.redactari.items():
            vechi["redactari"][k] = vechi["redactari"].get(k, 0) + v
        vechi["erori"] = [e for e in vechi.get("erori", []) if not any(e.startswith(f.__name__) for f in alese)] + \
            c.erori + s.erori
        vechi["jurnal"] = vechi.get("jurnal", []) + LOG
        vechi["rulari"] = vechi.get("rulari", [{"generat": vechi["generat"], "functii": "toate"}]) + out["rulari"]
        vechi["generat"] = out["generat"]
        out = vechi
    text = json.dumps(out, ensure_ascii=False, indent=1)
    for x in s.cur.interzise:
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas în ieșire — NU scriu fișierul")
    IES.mkdir(parents=True, exist_ok=True)
    BRUT.write_text(text, encoding="utf-8")
    print(f"{BRUT.name}: {len(c.supr)} suprafețe, {len(c.erori)} erori, {out['durata_s']} s")
    return 0


# ------------------------------------------------------------------------------------------------ scenariile reale noi
# ordinea contează: ultimul închide documentul (Ctrl+W › Don't Save)
SCENARII_R3 = ["word-ctrl-s-document-nou", "word-salvare-ca-enter", "word-salvare-ca-titlu", "word-font-size-tastat",
               "word-font-size-lista", "word-ctrl-o", "word-salvare-pdf", "word-ctrl-w-nesalvat", "word-x-nesalvat-cancel",
               "word-ctrl-w-nu-salva"]
DESKTOP_SC = "LHScenarii"
JURNAL_SC = IES / "scenarii_word_jurnal.json"
CHEI_UIA = ("dialog", "titlu_fereastra", "pagina_backstage", "dialog_salvare", "tip_salvare_afisat", "fisiere_salvate")


def clasa_word_r3():
    class WordR3(RR.Word):
        """ruleaza_real.Word + gesturile rundei: caseta și lista Font Size, Save as type, ✕, butoanele ferestrei care
        întreabă, Ctrl+S / Ctrl+W / Ctrl+O; cheile noi de stare. Fiecare pas își declară canalul (probat de proba(r))."""

        def ferestre(self):
            return [(x, c, t) for x, c, t in U.ferestre_pid(self.s.proc.pid) if c not in UAC]

        def reimprospateaza(self):
            import win32gui
            m = [x for x, c, _ in self.ferestre() if c == "OpusApp"]
            if m:
                self.s.hmain = m[0]
                d = U.copii_clasa(m[0], U.APPS["word"]["doc"])
                if d:
                    self.s.hdoc = d[0]
                self.baza = {x for x, _, _ in self.ferestre()}
                try:
                    win32gui.GetWindowRect(self.s.hmain)
                    self.s.aseaza()
                except Exception:  # noqa: BLE001
                    pass

        def document_nou(self):
            """Fiecare scenariu pornește pe un document NOU, nesalvat (Ctrl+S pe un document salvat nu deschide nimic)."""
            a = self.a
            docs = list(a.Documents)
            if len(docs) == 1 and not str(docs[0].Path):
                return
            a.Documents.Add()
            for d in docs:
                d.Close(0)                    # wdDoNotSaveChanges: documentele mele, din dosarul temporar
            time.sleep(1.5)
            self.reimprospateaza()

        def start(self, st):
            self.a.DisplayAlerts = -1        # wdAlertsAll: fereastra care întreabă TREBUIE să apară (doar instanța mea)
            self.document_nou()
            for f in self.tmp.iterdir():
                if f.is_file():
                    f.unlink()
            self.dlg = self.dlg_info = self.dialog_r3 = self.dlg_info_r3 = self.tip_afisat = None
            self.fapt_caseta = self.lista_ctl = self.hintreaba = None
            self.canale_r3 = set()
            super().start(st)

        # ---- ajutoare
        def noi(self, inainte, asteapta=8.0, clase=None):
            t0 = time.time()
            while time.time() - t0 < asteapta:
                time.sleep(0.25)
                n = [(x, c, t) for x, c, t in self.ferestre() if x not in inainte and (clase is None or c in clase)]
                if n:
                    time.sleep(1.2)
                    return [(x, c, t) for x, c, t in self.ferestre() if x not in inainte and (clase is None or c in clase)]
            return []

        def fereastra_care_intreaba(self, h):
            el = U.din_hwnd(h)
            import win32gui
            intrebare = None
            for w in U.gaseste_toate(el, U.P_CT, 50032):          # Window interior cu nume = textul mare
                try:
                    if w.CurrentName:
                        intrebare = str(w.CurrentName)
                        break
                except Exception:  # noqa: BLE001
                    pass
            bt = []
            for b in U.gaseste_toate(el, U.P_CT, 50000):
                try:
                    r = b.CurrentBoundingRectangle
                    if b.CurrentName and r.right > r.left:
                        bt.append((str(b.CurrentName), r.left, (r.top + r.bottom) / 2))
                except Exception:  # noqa: BLE001
                    pass
            jos = max(y for _, _, y in bt) if bt else 0
            rand = sorted([b for b in bt if abs(b[2] - jos) <= 12], key=lambda b: b[1])
            return {"titlu": self.s.cur.text(win32gui.GetWindowText(h)), "intrebare": self.s.cur.text(intrebare),
                    "butoane": [self.s.cur.text(n) for n, _, _ in rand], "apasat": None}

        def asteapta_intrebarea(self, inainte):
            for x, c, t in self.noi(inainte, 10, ("NUIDialog", "#32770")):
                self.hintreaba = x
                self.dialog_r3 = self.fereastra_care_intreaba(x)
                return f"fereastra care întreabă: {c}"
            return "nicio fereastră nouă în 10 s"

        def titlu_bara(self):
            m = [x for x, c, _ in self.ferestre() if c == "OpusApp"]
            if not m:
                return None
            vazute = []
            for _ in range(4):
                for h in m:
                    try:
                        b = U.arbore(U.din_hwnd(h))
                    except Exception:  # noqa: BLE001
                        continue
                    for n in U.cauta(b, lambda n: n.get("ct") == 50037 and n.get("n")):     # TitleBar cu nume
                        vazute.append(n["n"])
                        if n["n"].rstrip().endswith("Word"):
                            return self.s.cur.text(n["n"])
                time.sleep(1.0)
            log(f"    titlu_bara: niciun TitleBar „… Word”; văzute {vazute[:6]}")
            return None

        def backstage_pagina(self):
            return Cap.backstage_pagina(self)

        def focus_taste(self, combo):
            """Tasta la fereastra cu focus a firului Word, fără redirecționarea spre document (caseta din panglică)."""
            import win32gui
            mods, vk = RR.parse_taste(combo)
            tinta = RR.focus_din(self.hmain)
            vk_mod = [{"Ctrl": 0x11, "Shift": 0x10}[m] for m in mods]
            with RR.StareTaste(tinta, mods):
                for vm in vk_mod:
                    win32gui.PostMessage(tinta, RR.WM_KEYDOWN, vm, RR.lparam_tasta(vm))
                win32gui.PostMessage(tinta, RR.WM_KEYDOWN, vk, RR.lparam_tasta(vk))
                time.sleep(0.25)
                win32gui.PostMessage(tinta, RR.WM_KEYUP, vk, RR.lparam_tasta(vk, True))
                for vm in reversed(vk_mod):
                    win32gui.PostMessage(tinta, RR.WM_KEYUP, vm, RR.lparam_tasta(vm, True))
                time.sleep(0.15)
                RR.bariera()
                time.sleep(0.6)
            return tinta

        def caseta_font_size(self):
            cb = U.gaseste(U.din_hwnd(self.hmain), U.P_AID, "FontSize")
            if not cb:
                raise RuntimeError("caseta FontSize nu e în panglică")
            ed = U.gaseste(cb, U.P_CT, 50004)
            return cb, (ed if ed else None)

        # ---- gesturile
        def pas_gest(self, p):
            import win32gui
            g, t = p["gest"], str(p.get("tinta") or "")
            if g == "clic" and p.get("id_mso") == "FontSize":
                if p.get("fila"):
                    self.fila(p["fila"])
                cb, ed = self.caseta_font_size()
                if ed is None:
                    raise RuntimeError("caseta FontSize n-are Edit")
                r = ed.CurrentBoundingRectangle
                sx, sy = (r.left + r.right) // 2, (r.top + r.bottom) // 2
                h = U.hwnd_la(self.hmain, sx, sy)
                try:      # fereastra Word activă pe desktopul ascuns, cum e la clicul omului (nu atinge ecranul lui)
                    win32gui.SetForegroundWindow(self.hmain)
                except Exception:  # noqa: BLE001
                    pass
                cx, cy = win32gui.ScreenToClient(h, (sx, sy))
                win32gui.PostMessage(h, 0x0021, self.hmain, (0x0201 << 16) | 1)    # WM_MOUSEACTIVATE (HTCLIENT)
                RR.trimite_mouse(h, sx, sy, "clic")
                time.sleep(0.8)
                focus = bool(ed.CurrentHasKeyboardFocus)
                sel = None
                try:
                    tp = U.pattern(ed, 10014, U.IText)
                    rs = tp.GetSelection() if tp else None
                    sel = [rs.GetElement(i).GetText(-1) for i in range(rs.Length)] if rs else None
                except Exception as e:  # noqa: BLE001
                    sel = f"necitit: {e!r}"[:60]
                self.fapt_caseta = {"focus_in_caseta": focus, "selectia_din_caseta": sel}
                if not focus:
                    raise RuntimeError(f"clicul nu a dus focusul în caseta Font Size ({self.fapt_caseta})")
                self.canale_r3.add("mouse")
                return f"WM_LBUTTONDOWN/UP pe caseta Font Size (după clic: focus {focus}, selecția din casetă {sel!r})"
            if g == "tasteaza" and p.get("in") == "Font Size":
                tinta = RR.focus_din(self.hmain)
                for ch in p["text"]:
                    win32gui.PostMessage(tinta, RR.WM_CHAR, ord(ch), 1)
                    time.sleep(0.05)
                RR.bariera()
                time.sleep(0.3)
                self.canale_r3.add("tastare")
                return "WM_CHAR în caseta cu focus (Font Size)"
            if g == "taste" and p["taste"] == "Enter" and getattr(self, "fapt_caseta", None) and not self.dlg:
                self.focus_taste("Enter")
                self.fapt_caseta = None
                self.canale_r3.add("taste")
                return "WM_KEYDOWN/UP Enter în caseta Font Size"
            if g == "clic" and t == "meniu_derulant:Home/Font/Font Size":
                self.fila("TabHome")
                cb, _ = self.caseta_font_size()
                self.vechi_lista = {x for x, _, _ in self.ferestre()}
                if not RR.uia_expand(cb):
                    raise RuntimeError("Font Size: Expand nu a mers")
                self.lista_ctl = cb
                time.sleep(1.5)
                self.canale_r3.add("panglica")
                return "UIA ExpandCollapse.Expand pe Font Size (▾)"
            if g == "clic" and t == "camp:tip_fisier":
                if not self.dlg:
                    raise RuntimeError("fereastra Save As nu e deschisă")
                tip = U.gaseste(U.din_hwnd(self.dlg), U.P_AID, "FileTypeControlHost")
                self.vechi_lista = {x for x, _, _ in self.ferestre()}
                if not tip or not RR.uia_expand(tip):
                    raise RuntimeError("Save as type: Expand nu a mers")
                self.lista_ctl = tip
                time.sleep(1.5)
                self.canale_r3.add("panglica")
                return "UIA ExpandCollapse.Expand pe caseta Save as type"
            if g == "clic" and t.startswith("meniu:"):
                elem = t[6:]
                ctl = getattr(self, "lista_ctl", None)
                it = None
                for _ in range(16):
                    it = RR.gaseste_nume(ctl, elem, (50007, 50011, 50000)) if ctl is not None else None
                    if it is None:
                        for x, c, _ in self.ferestre():
                            if x in getattr(self, "vechi_lista", set()):
                                continue
                            for hc in U.copii_clasa(x, ["NetUIHWND"]) + [x]:
                                it = RR.gaseste_nume(U.din_hwnd(hc), elem, (50007, 50011, 50000))
                                if it is not None:
                                    break
                            if it is not None:
                                break
                    if it is not None:
                        break
                    time.sleep(0.3)
                if it is None:
                    raise RuntimeError(f"rândul „{elem}” nu apare în lista deschisă")
                inainte = self.amprenta()
                for nume, f in (("SelectionItem.Select", RR.uia_select), ("Invoke", RR.uia_invoke)):
                    try:
                        if f(it):
                            break
                    except Exception:  # noqa: BLE001
                        continue
                time.sleep(1.0)
                if ctl is not None and self.dlg:
                    RR.uia_collapse(ctl)
                    time.sleep(1.0)
                self.lista_ctl = None
                self.canale_r3.add("panglica")
                if not self.dlg and self.amprenta() == inainte:
                    raise RuntimeError(f"„{elem}”: starea documentului nu s-a schimbat")
                return f"UIA {nume} pe rândul „{elem}”"
            if g == "clic" and t == "camp:nume_fisier":
                ed = RR.gaseste_id(U.din_hwnd(self.dlg), "1001")
                if ed is None:
                    raise RuntimeError("caseta File name lipsește")
                r = ed.CurrentBoundingRectangle
                RR.trimite_mouse(ed.CurrentNativeWindowHandle, (r.left + r.right) // 2, (r.top + r.bottom) // 2, "clic")
                self.canale_r3.add("mouse")
                return "WM_LBUTTONDOWN/UP în caseta File name"
            if g == "taste" and p["taste"] == "Ctrl+A" and self.dlg:
                RR.trimite_taste(self.hdoc, "Ctrl+A")
                self.canale_r3.add("taste")
                return "WM_KEYDOWN/UP Ctrl+A în caseta File name"
            if g == "clic" and t == "dialog_salvare:Save":
                tip = U.gaseste(U.din_hwnd(self.dlg), U.P_AID, "FileTypeControlHost") if self.dlg else None
                self.tip_afisat = RR.Word._val(tip) if tip else None
                for cbx in U.gaseste_toate(U.din_hwnd(self.dlg), U.P_CT, 50002) if self.dlg else []:
                    try:
                        if str(cbx.CurrentName) == "Open file after publishing" and int(cbx.GetCurrentPropertyValue(30086)):
                            raise RuntimeError("„Open file after publishing” e bifat: NU salvez (s-ar deschide un "
                                               "vizualizator PDF, poate pe ecranul omului)")
                    except RuntimeError:
                        raise
                    except Exception:  # noqa: BLE001
                        pass
                self.canale_r3.add("panglica")
                return self.salveaza_din_dialog()
            if g == "taste" and p["taste"] == "Enter" and self.dlg:
                dlg = self.dlg
                tinta = RR.tinta_tastatura(self.hdoc)
                win32gui.PostMessage(tinta, RR.WM_KEYDOWN, 0x0D, RR.lparam_tasta(0x0D))
                time.sleep(0.25)
                try:      # fereastra se închide la KEYDOWN (caseta dispare): KEYUP-ul n-are unde ajunge, ca la tastatura reală
                    win32gui.PostMessage(tinta, RR.WM_KEYUP, 0x0D, RR.lparam_tasta(0x0D, True))
                except Exception:  # noqa: BLE001
                    pass
                RR.bariera()
                for _ in range(40):
                    time.sleep(0.25)
                    if not any(x == dlg for x, _, _ in self.ferestre()):
                        break
                time.sleep(1.0)
                inchisa = not any(x == dlg for x, _, _ in self.ferestre())
                self.dlg = None if inchisa else dlg
                self.canale_r3.add("taste")
                return f"WM_KEYDOWN/UP Enter în caseta File name (fereastra Save As {'închisă' if inchisa else 'încă deschisă'})"
            if g == "taste" and p["taste"] in ("Ctrl+W", "Ctrl+O", "Ctrl+S") and not self.dlg:
                inainte = {x for x, _, _ in self.ferestre()}
                RR.trimite_taste(self.hdoc, p["taste"])
                self.canale_r3.add("taste")
                if p["taste"] == "Ctrl+O":
                    time.sleep(3.0)
                    return "WM_KEYDOWN/UP Ctrl+O"
                if p["taste"] == "Ctrl+W":
                    return "WM_KEYDOWN/UP Ctrl+W · " + self.asteapta_intrebarea(inainte)
                for x, c, tt in self.noi(inainte, 10, ("NUIDialog", "#32770")):
                    el = U.din_hwnd(x)
                    titlu = tt
                    for w in U.gaseste_toate(el, U.P_CT, 50032):
                        try:
                            if w.CurrentName:
                                titlu = str(w.CurrentName)
                                break
                        except Exception:  # noqa: BLE001
                            pass
                    nume = (U.gaseste(el, U.P_NAME, "File name") if c == "NUIDialog" else RR.gaseste_id(el, "1001"))
                    tip = (U.gaseste(el, U.P_NAME, "Save as type") if c == "NUIDialog"
                           else U.gaseste(el, U.P_AID, "FileTypeControlHost"))
                    self.dlg_info_r3 = {"titlu": self.s.cur.text(titlu), "nume_propus": RR.Word._val(nume) if nume else None,
                                        "tip_propus": RR.Word._val(tip) if tip else None}
                    self.hintreaba = x
                    return f"WM_KEYDOWN/UP Ctrl+S · fereastra {c}"
                return "WM_KEYDOWN/UP Ctrl+S · nicio fereastră în 10 s"
            if g == "clic" and t == "bara_titlu:Close":
                import win32gui
                top = win32gui.GetWindowRect(self.hmain)[1]
                b = U.arbore(U.din_hwnd(self.hmain))
                n = U.cauta(b, lambda n: n.get("n") == "Close" and n.get("ct") == 50000 and n["r"][1] - top < 60)
                if not n:
                    raise RuntimeError("butonul Close (✕) nu e în bara de titlu")
                x, y, w, h_ = n[0]["r"]
                sx, sy = x + w // 2, y + h_ // 2
                inainte = {q for q, _, _ in self.ferestre()}
                RR.trimite_mouse(U.hwnd_la(self.hmain, sx, sy), sx, sy, "clic")
                self.canale_r3.add("mouse")
                return "WM_LBUTTONDOWN/UP pe ✕ (Close) din bara de titlu · " + self.asteapta_intrebarea(inainte)
            if g == "clic" and t.startswith("fereastra:"):
                et = t[len("fereastra:"):]
                h = getattr(self, "hintreaba", None)
                if not h:
                    raise RuntimeError("nicio fereastră care întreabă")
                b = RR.gaseste_nume(U.din_hwnd(h), et, (50000,))
                if b is None:
                    raise RuntimeError(f"butonul „{et}” nu e în fereastră")
                pornit_in_fir(lambda b=b: RR.uia_invoke(b), 5)
                for _ in range(40):
                    time.sleep(0.25)
                    if not any(x == h for x, _, _ in self.ferestre()):
                        break
                time.sleep(1.5)
                if self.dialog_r3 is not None:
                    self.dialog_r3["apasat"] = et
                self.hintreaba = None
                self.canale_r3.add("panglica")
                return f"UIA Invoke pe „{et}”, într-un fir separat"
            r = super().pas_gest(p)
            self.canale_r3 |= RR.canale_pas("word", "gest_real", p)
            return r

        def inchide_tot(self):
            """Ferestrele rămase deschise de scenariu: Cancel (nimic salvat), apoi Esc; Backstage închis."""
            import win32gui
            for _ in range(6):
                ramase = [(x, c) for x, c, _ in self.ferestre() if x not in self.baza]
                if not ramase:
                    break
                for x, c in ramase:
                    b = None
                    for n in CANCEL:
                        b = RR.gaseste_nume(U.din_hwnd(x), n, (50000,))
                        if b is not None:
                            break
                    if b is not None and c != "Net UI Tool Window":
                        pornit_in_fir(lambda b=b: RR.uia_invoke(b), 5)
                    else:
                        win32gui.PostMessage(x, 0x0100, 0x1B, 0)
                        win32gui.PostMessage(x, 0x0101, 0x1B, 0)
                time.sleep(1.0)
            if self.backstage_pagina():
                self.s.iesi_backstage()
            self.dlg = None

        def citeste(self, chei):
            if not set(chei) & (set(CHEI_UIA) | {"documente_deschise"}):
                return super().citeste(chei)       # amprenta() și cheile vechi: neschimbat, fără să închid ferestre
            rez = {}
            for k in chei:
                if k == "dialog":
                    rez[k] = self.dialog_r3
                elif k == "titlu_fereastra":
                    rez[k] = self.titlu_bara()
                elif k == "pagina_backstage":
                    rez[k] = self.backstage_pagina()
                elif k == "dialog_salvare" and self.dlg_info_r3 is not None:
                    rez[k] = self.dlg_info_r3
                elif k == "tip_salvare_afisat":
                    rez[k] = self.tip_afisat
                elif k == "fisiere_salvate":
                    rez[k] = sorted(f.name for f in self.tmp.iterdir() if f.is_file() and not f.name.startswith("~$"))
            self.inchide_tot()                      # COM nu răspunde cât e deschisă o fereastră modală
            rest = [k for k in chei if k not in rez]
            if "documente_deschise" in rest:
                rez["documente_deschise"] = int(self.a.Documents.Count)
                rest.remove("documente_deschise")
            if rest:
                rez.update(super().citeste(rest))
            return {k: rez[k] for k in chei}

        def curata_recente(self):
            """Fișierele mele de probă (din dosarul temporar) ies din lista Recent a lui Word."""
            n = 0
            tmp = str(self.tmp).lower()
            try:
                for i in range(int(self.a.RecentFiles.Count), 0, -1):
                    rf = self.a.RecentFiles(i)
                    if str(rf.Path).lower().startswith(tmp):
                        rf.Delete()
                        n += 1
            except Exception as e:  # noqa: BLE001
                log(f"  RecentFiles: {e!r}")
            return n
    return WordR3


def fara_cale_personala(text):
    """Căile cu numele utilizatorului Windows (dosarul temporar) -> %TEMP% / %USERPROFILE% (poarta date_personale)."""
    text = re.sub(r"[A-Za-z]:[\\/]+Users[\\/]+[^\\/\"']+[\\/]+AppData[\\/]+Local[\\/]+Temp", "%TEMP%", str(text), flags=re.I)
    return re.sub(r"[A-Za-z]:[\\/]+Users[\\/]+[^\\/\"'\s]+", "%USERPROFILE%", text, flags=re.I)


def ruleaza_unul_r3(r, sc, versiune):
    cum, eroare, stare = [], None, {}
    try:
        r.start(sc["start"])
        for p in sc["pasi"]:
            cum.append(r.pas_gest(p))
        time.sleep(0.6)
        stare = r.citeste(sc["stare_citita"])
    except Exception as e:  # noqa: BLE001
        eroare = f"{type(e).__name__}: {e}"[:600]
        stare = {}
        log(traceback.format_exc()[-1200:])
    finally:
        try:
            r.inchide_tot()
        except Exception:  # noqa: BLE001
            pass
        rec = r.curata_recente()
    canale = set(getattr(r, "canale_r3", set()))
    probat = eroare is None and bool(canale) and all(r.probe.get(c, {}).get("trecut") for c in canale)
    if eroare:
        eroare = fara_cale_personala(eroare)
    rez = {"id": sc["id"], "mod_probat": probat, "stare": stare, "eroare": eroare,
           "cum": (f"gest_real — instanță NOUĂ word ({versiune}), desktop ascuns {DESKTOP_SC}, "
                   f"{time.strftime('%d.%m.%Y %H:%M')}, referinte/acoperire_word_r3.py (pe clasele din ruleaza_real.py); "
                   "pașii: " + " · ".join(cum) + "; textul/selecția de pornire prin COM; cheile ferestrelor (dialog, "
                   "titlu_fereastra, pagina_backstage, dialog_salvare, tip_salvare_afisat) citite prin UI Automation "
                   "înainte de a închide ferestrele, restul prin COM; fișierele în %TEMP% (dosar unic, șters la final)" +
                   (f"; {rec} intrări din lista Recent a lui Word (fișierele mele de probă) șterse" if rec else "")),
           "canale": sorted(canale), "canale_neprobate": sorted(c for c in canale if not r.probe.get(c, {}).get("trecut"))}
    (RR.REAL / f"{sc['id']}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    log(f"  {sc['id']}: {'OK' if eroare is None else 'EROARE ' + eroare[:160]} probat={probat} stare={json.dumps(stare, ensure_ascii=False)[:300]}")
    return rez


def scenarii_intern():
    global U, RR
    import dump_uia_office as U_
    import ruleaza_real as RR_
    U, RR = U_, RR_
    RR.U = U
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    iduri = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--id=")), SCENARII_R3)
    toate = {}
    for f in sorted((RR.SCEN / "word").glob("*.json")):     # nu RR.scenarii(): acela le sare pe ale mele (rulat_de)
        s = json.loads(f.read_text(encoding="utf-8"))
        toate[s["id"]] = s
    sc = [toate[i] for i in SCENARII_R3 if i in iduri and i in toate]
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    W = clasa_word_r3()
    r = W("word")
    rez, probe = [], {}
    t0 = time.time()
    try:
        r.porneste()
        RR.BARIERA[0] = lambda: r.a.Selection.Start
        versiune = f"{U.versiune_exe(U.APPS['word']['exe'])}, build COM {r.s.build}"
        try:
            probe = RR.proba(r)
        except Exception:  # noqa: BLE001
            log("proba a căzut:\n" + traceback.format_exc())
            probe = r.probe
        for s in sc:
            rez.append(ruleaza_unul_r3(r, s, versiune))
    except Exception:  # noqa: BLE001
        log(traceback.format_exc())
    finally:
        try:
            r.inchide()
        except Exception:  # noqa: BLE001
            log("închidere: " + traceback.format_exc())
    jurnal = {"generat": time.strftime("%Y-%m-%d %H:%M"), "desktop": DESKTOP_SC, "probe": probe,
              "scenarii": [x["id"] for x in sc], "rezultate": [{k: x[k] for k in ("id", "mod_probat", "eroare")} for x in rez],
              "erori_sesiune": r.s.erori, "durata_s": round(time.time() - t0), "jurnal": LOG}
    def curat(o):
        if isinstance(o, str):
            return fara_cale_personala(o)
        if isinstance(o, list):
            return [curat(x) for x in o]
        if isinstance(o, dict):
            return {k: curat(v) for k, v in o.items()}
        return o
    text = json.dumps(curat(jurnal), ensure_ascii=False, indent=1)
    IES.mkdir(parents=True, exist_ok=True)
    JURNAL_SC.write_text(text, encoding="utf-8")
    print(f"scenarii: {len(rez)} rulate, {sum(1 for x in rez if x['mod_probat'])} probate, {round(time.time() - t0)} s")
    return 0


# ------------------------------------------------------------------------------------------------ scrie / verifica
CHEI_NOI = ["dialog.save_this_file", "dialog.save_your_changes_to_this_file", "lista.FontSize", "backstage.Open_rand_recent",
            "dialog.open", "lista.FileSaveAs_navigare", "lista.FileSaveAs_tip", "dialog.FileSaveAs_pdf"] + \
           [k for k, _, _ in LISTE_PANGLICA]


def cauta_noduri(n, pred, acc=None):
    acc = [] if acc is None else acc
    if pred(n):
        acc.append(n)
    for c in n.get("copii", []):
        cauta_noduri(c, pred, acc)
    return acc


def interzise():
    out = set()
    for v in (os.environ.get("USERNAME"), os.environ.get("COMPUTERNAME")):
        if v and len(v) >= 3:
            out.add(v.lower())
    return out


def scrie():
    b = json.loads(BRUT.read_text(encoding="utf-8"))
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    puse = []
    for k, v in b["suprafete"].items():
        if k in S and not k.startswith(("dialog.save_", "lista.", "backstage.Open_rand", "dialog.open", "dialog.FileSaveAs_")):
            continue        # cheile vechi rămân neatinse
        v = json.loads(json.dumps(v))
        if k in ("dialog.save_this_file", "dialog.save_your_changes_to_this_file"):
            # fereastra Office (NUIDialog) n-are nume în UIA; numele afișat e al ferestrei interioare („Save this file”)
            inter = [c for c in cauta_noduri(v, lambda n: n.get("tip") == "Window" and n.get("eticheta"))]
            if inter:
                v["eticheta"] = inter[0]["eticheta"]
                v["nota"] = ("eticheta rădăcinii = numele ferestrei interioare (textul mare afișat); în UI Automation "
                             "fereastra exterioară NUIDialog n-are nume, iar bara ei de titlu are doar ✕ („Închidere”). "
                             "„Documents” / „OneDrive - Personal” din „Choose a Location” = locul implicit de pe PC-ul "
                             "acesta (pe PC-ul din laborator poate fi altul) [NEVERIFICAT pe laborator]")
        if k.startswith("lista.") and not k.startswith("lista.FileSaveAs"):
            # captura are ca rădăcină controlul din panglică (ComboBox / SplitButton / MenuItem), iar lista deschisă e
            # fereastra-popup a lui (primul Menu de sub el); controlul însuși e deja în panglica.<filă>
            pop = cauta_noduri(v, lambda n: n.get("tip") == "Menu")
            if pop:
                nv = dict(pop[0])
                nv["deschis_prin"] = v.get("deschis_prin")
                nv["nota"] = ("lista deschisă = fereastra-popup (Menu) a controlului din panglică; controlul („" +
                              str(v.get("eticheta")) + "”) e în panglica.<filă>")
                v = nv
        if k == "lista.FileSaveAs_navigare":
            def scoate(n):
                n["copii"] = [scoate(c) for c in n.get("copii", []) if not str(c.get("eticheta", "")).startswith("[element personal")]
                return n
            v = scoate(v)
            # rădăcina „Desktop” e invizibilă (0×0, în afara ecranului): pe ecran elementele ei stau pe primul rând
            v["copii"] = [cc for c in v.get("copii", []) for cc in (c.get("copii") or [] if c.get("eticheta") == "Desktop" else [c])]
            v["nota"] = ("panoul din stânga al ferestrei Save As (F12), două niveluri: rădăcina Desktop (în afara "
                         "ecranului) și elementele IMPLICITE Windows 11 de sub ea; celelalte (foldere fixate de om, "
                         "contul OneDrive cu nume, biblioteci etc.) au fost scoase ca personale — vezi acoperire_r3.excluse_personal")
        S[k] = v
        puse.append(k)
    fapte = dict(b["fapte"])
    for k in ("g_Ctrl+F", "g_Ctrl+H"):
        if k in fapte and not fapte[k].get("ferestre_noi") and not fapte[k].get("panou"):
            fapte[k] = {"NEVERIFICAT": "nicio fereastră și niciun panou văzut după tastă; tasta poate să nu fi ajuns "
                                       "(trimisă după ieșirea din Backstage › Print) — nu e un fapt despre Word"}
    b["fapte"] = fapte
    r["acoperire_r3"] = {
        "generat": b["generat"], "versiune": b["versiune"], "versiune_com_build": b["versiune_com_build"],
        "cum": ("referinte/acoperire_word_r3.py capturi: instanță NOUĂ WINWORD /x pe desktopul ascuns "
                f"{b['desktop']}, fereastra 1366×768 css (Sesiune.aseaza din dump_uia_office.py), gesturile ca în "
                "ruleaza_real.py (WM_KEYDOWN/UP cu Ctrl ținut; UIA Expand/Invoke/Select); niciun Save adevărat — "
                "ferestrele închise cu Cancel / Esc; arborii normalizați și redactați ca în dump"),
        "suprafete_adaugate": puse, "fapte": b["fapte"], "excluse_personal": b["excluse_personal"],
        "redactari": b["redactari"], "erori": b["erori"],
    }
    text = json.dumps(r, ensure_ascii=False, indent=1)
    for x in interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas — NU scriu uia_word.json")
    REF.write_text(text, encoding="utf-8")
    print(f"uia_word.json: {len(puse)} suprafețe noi: {puse}")
    return 0


def verifica():
    p = []
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    ac = r.get("acoperire_r3")
    if not ac:
        p.append("uia_word.json nu are blocul acoperire_r3")
    else:
        for k in ac.get("suprafete_adaugate", []):
            if k not in S:
                p.append(f"suprafața {k} anunțată, dar lipsă")
    text = REF.read_text(encoding="utf-8").lower()
    for x in interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text):
            p.append("nume interzis în uia_word.json")
    if re.search(r"c:[\\/]+users[\\/]", text):
        p.append("cale cu C:/Users în uia_word.json")
    for x in p:
        print("PROBLEMĂ:", x)
    print(len(p))
    return 1 if p else 0


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "capturi":
        import dump_uia_office as U_
        if U_.nume_desktop_curent().lower() != "default":
            return capturi_intern()
        r = subprocess.run([sys.executable, str(HIDDEN), "run", "--desktop", DESKTOP, "--timeout", "1500", "--",
                            sys.executable, str(Path(__file__).resolve()), "_capturi"] +
                           [a for a in sys.argv if a.startswith("--doar=")])
        return r.returncode
    if cmd == "_capturi":
        return capturi_intern()
    if cmd == "scenarii":
        import dump_uia_office as U_
        if U_.nume_desktop_curent().lower() != "default":
            return scenarii_intern()
        r = subprocess.run([sys.executable, str(HIDDEN), "run", "--desktop", DESKTOP_SC, "--timeout", "1500", "--",
                            sys.executable, str(Path(__file__).resolve()), "_scenarii"] +
                           [a for a in sys.argv if a.startswith("--id=")])
        return r.returncode
    if cmd == "_scenarii":
        return scenarii_intern()
    if cmd == "scrie":
        return scrie()
    if cmd == "verifica":
        return verifica()
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
