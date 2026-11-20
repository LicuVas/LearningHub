# -*- coding: utf-8 -*-
"""Runda `acoperire` pe PowerPoint după runda 11 a valului B-powerpoint (20.11.2026) — generator-soră al lui
acoperire_excel_r7.py.

Tot din PowerPoint-ul REAL de pe PC: `POWERPNT /B` pe desktopul ASCUNS (LHRefOffice pentru capturi, LHScenarii pentru
scenarii); refuză ecranul omului. PowerPoint are O SINGURĂ instanță pe mașină: înainte de fiecare pornire verific că nu
rulează niciun POWERPNT.EXE (altfel nu pornesc și nu ating nimic); legătura COM o iau din fereastra instanței mele
(AccessibleObjectFromWindow, ca dump_uia_office.py), niciodată Dispatch / GetObject / GetActiveObject / DispatchEx.
Prezentările mele poartă eticheta LHREF; înainte de închidere le număr: dacă a intrat una străină, NU închid nimic.
Închiderea: prezentările marcate „salvate”, WM_CLOSE pe ferestrele PID-ului meu, forțat doar după 90 s, doar PID-ul meu.
Fișierele de probă stau în %TEMP%\\lh_ppt_r11_*; intrările lor din lista Recent se șterg la final (doar ele).

  capturi   — a. Font Color ▾ (paleta din panglică + paleta din mini-bara de clic dreapta, culoarea butonului la pornire);
              b. închiderea: Ctrl+W / File › Close / ✕ pe o prezentare modificată (fereastra care întreabă; Esc, Cancel),
                 Don't Save (PowerPoint fără prezentare), Ctrl+N (din fereastra goală și cu o prezentare), Ctrl+O;
              c. listele Insert › Pictures, Insert › Shapes, Insert › Table, Home › New Slide ▾, Home › Layout;
              d. Duration „0,5”+Enter (+ Apply To All), Animation Pane cu două animații (Move Up / Move Down),
                 Format Background › Solid fill (+ paleta Color ▾).
              Ieșirea brută: ../runde/11/acoperire/capturi_powerpoint_brut.json.  --doar=f1,f2 reia doar unele.
  scrie     — cheile noi în uia_powerpoint.json (cele vechi neatinse) + blocul `acoperire_r11`. Fără Office.
  scrie_scenarii — scenariile noi / rescrise în ../scenarii/powerpoint/.
  scenarii  — rezultatele reale ale scenariilor (referinte/scenarii_real/), pe desktopul ascuns LHScenarii.  --id=a,b
  verifica  — oracolul livrabilului; ULTIMA linie = numărul de probleme.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import traceback
from pathlib import Path

AICI = Path(__file__).resolve().parent
D = AICI.parent
sys.path.insert(0, str(AICI))
IES = D / "runde" / "11" / "acoperire"
BRUT = IES / "capturi_powerpoint_brut.json"
REF = AICI / "uia_powerpoint.json"
HIDDEN = Path(r"C:\00\AI_0\tools\hidden_desktop.py")
DESKTOP = "LHRefOffice"
DESKTOP_SC = "LHScenarii"
MARCAJ = "lh_ppt_r11_"
RULAT_DE = "referinte/acoperire_powerpoint_r11.py"
JURNAL_SC = IES / "scenarii_powerpoint_jurnal.json"
WM_KEYDOWN, WM_KEYUP, WM_CHAR, WM_CLOSE = 0x0100, 0x0101, 0x0102, 0x0010
U = RR = W3 = X7 = None
LOG = []


class Straina(RuntimeError):
    """În instanța mea a intrat o prezentare care nu e a mea: nu mai ating nimic."""


def log(m):
    print(m, flush=True)
    LOG.append(m)


def incarca():
    global U, RR, W3, X7
    import dump_uia_office as U_
    import ruleaza_real as RR_
    import acoperire_word_r3 as W3_
    import acoperire_excel_r7 as X7_
    U, RR, W3, X7 = U_, RR_, W3_, X7_
    RR.U = U
    W3.U, W3.RR, W3.log = U, RR, log
    X7.U, X7.RR, X7.W3, X7.log = U, RR, W3, log


def slug(t):
    return re.sub(r"[^a-z0-9]+", "_", str(t or "").lower()).strip("_")[:60]


def hexrgb(v):
    v = int(v)
    return "#%02X%02X%02X" % (v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF)


def ppt_ruleaza():
    out = subprocess.run(["tasklist", "/FI", "IMAGENAME eq POWERPNT.EXE", "/NH"], capture_output=True, text=True,
                         timeout=30).stdout
    return "powerpnt.exe" in out.lower()


# ------------------------------------------------------------------------------------------------ instanța mea
def a_mea(p):
    try:
        return str(p.Tags("LHREF")) == "1"
    except Exception:  # noqa: BLE001
        return False


def straine(a):
    return [str(p.Name) for p in a.Presentations if not a_mea(p)]


def eticheteaza_noua(a, inainte):
    """O prezentare apărută după gestul meu (Ctrl+N): exact una nouă, nesalvată, „PresentationN” → o etichetez."""
    noi = [p for p in a.Presentations if str(p.Name) not in inainte]
    if len(noi) != 1 or str(noi[0].Path) or not re.fullmatch(r"Presentation\d+", str(noi[0].Name)):
        raise Straina(f"după Ctrl+N: prezentări noi neașteptate {[str(p.Name) for p in noi]}")
    noi[0].Tags.Add("LHREF", "1")
    return str(noi[0].Name)


def cadru(s, exclus=()):
    """Fereastra PowerPoint curentă (cea a prezentării active; după Ctrl+N cea nouă): hmain, hdoc (mdiClass), hpane."""
    import win32gui
    fs = [h for h, c, _ in U.ferestre_pid(s.proc.pid) if c == "PPTFrameClass"]
    try:
        nume = str(s.appcom.ActivePresentation.Name).rsplit(".", 1)[0] if int(s.appcom.Presentations.Count) else None
    except Exception:  # noqa: BLE001
        nume = None
    ales = [h for h in fs if h not in exclus and nume and win32gui.GetWindowText(h).startswith(nume + " ")] or \
        [h for h in fs if h not in exclus] or fs
    if ales:
        s.hmain = ales[0]
        mdi = U.copii_clasa(s.hmain, ["mdiClass"])
        pane = U.copii_clasa(s.hmain, ["paneClassDC"])
        s.hdoc = mdi[0] if mdi else s.hmain
        s.hpane = pane[0] if pane else s.hdoc
    return fs


def porneste(s):
    if ppt_ruleaza():
        raise RuntimeError("SĂRIT: POWERPNT.EXE rulează deja (o singură instanță) — nu pornesc și nu ating nimic")
    s.porneste()
    cadru(s)
    RR.BARIERA[0] = lambda: s.appcom.Version
    s.appcom.DisplayAlerts = 1   # ppAlertsNone pentru apelurile COM; ferestrele gesturilor apar oricum (le cer gesturile)


def curata_mru(marcaj=MARCAJ):
    """Intrările din listele Recent ale lui PowerPoint (File MRU / Place MRU) și ale ferestrelor Windows de fișiere
    (ComDlg32) care arată spre fișierele / dosarele MELE (%TEMP%\\lh_ppt_r11_*). Celelalte rămân neatinse (doar
    renumerotate la File/Place MRU, ca lista să nu aibă găuri)."""
    import winreg
    sters = []
    m = marcaj.lower()
    H = winreg.HKEY_CURRENT_USER

    def subchei(cale):
        try:
            k = winreg.OpenKey(H, cale)
        except OSError:
            return []
        out, i = [], 0
        while True:
            try:
                out.append(winreg.EnumKey(k, i))
            except OSError:
                break
            i += 1
        return out

    def valori(k):
        out, i = [], 0
        while True:
            try:
                out.append(winreg.EnumValue(k, i))
            except OSError:
                break
            i += 1
        return out
    baza = r"Software\Microsoft\Office\16.0\PowerPoint"
    liste = [baza + r"\File MRU", baza + r"\Place MRU"]
    for sk in subchei(baza + r"\User MRU"):
        liste += [baza + rf"\User MRU\{sk}\File MRU", baza + rf"\User MRU\{sk}\Place MRU"]
    for cale in liste:
        try:
            k = winreg.OpenKey(H, cale, 0, winreg.KEY_ALL_ACCESS)
        except OSError:
            continue
        items = [(n, v, t) for n, v, t in valori(k) if re.fullmatch(r"Item \d+", n)]
        items.sort(key=lambda x: int(x[0].split()[1]))
        rame = [(n, v, t) for n, v, t in items if m not in str(v).lower()]
        if len(rame) != len(items):
            sters.append(f"{cale}: {len(items) - len(rame)}")
            meta = {n: (v, t) for n, v, t in valori(k) if re.fullmatch(r"Item Metadata \d+", n)}
            for n, _, _ in items:
                winreg.DeleteValue(k, n)
                if f"Item Metadata {n.split()[1]}" in meta:
                    winreg.DeleteValue(k, f"Item Metadata {n.split()[1]}")
            for i, (n, v, t) in enumerate(rame, start=1):
                winreg.SetValueEx(k, f"Item {i}", 0, t, v)
                mv = meta.get(f"Item Metadata {n.split()[1]}")
                if mv:
                    winreg.SetValueEx(k, f"Item Metadata {i}", 0, mv[1], mv[0])
        winreg.CloseKey(k)
    # ferestrele Windows de fișiere (Save As / Insert Picture): PIDL-uri binare; numele dosarului meu apare în UTF-16
    cd = r"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32"
    for cale in [cd + r"\OpenSavePidlMRU\\" + x for x in subchei(cd + r"\OpenSavePidlMRU")] + [cd + r"\LastVisitedPidlMRU"]:
        try:
            k = winreg.OpenKey(H, cale, 0, winreg.KEY_ALL_ACCESS)
        except OSError:
            continue
        vals = valori(k)
        de_sters = [n for n, v, t in vals if n != "MRUListEx" and isinstance(v, bytes) and
                    (m.encode("utf-16-le") in v.lower() or m.encode() in v.lower())]
        if de_sters:
            lst = next((v for n, v, t in vals if n == "MRUListEx"), b"")
            idx = [int.from_bytes(lst[i:i + 4], "little") for i in range(0, len(lst), 4)]
            idx = [i for i in idx if str(i) not in de_sters and i != 0xFFFFFFFF]
            for n in de_sters:
                winreg.DeleteValue(k, n)
            winreg.SetValueEx(k, "MRUListEx", 0, winreg.REG_BINARY,
                              b"".join(i.to_bytes(4, "little") for i in idx) + (0xFFFFFFFF).to_bytes(4, "little"))
            sters.append(f"{cale}: {len(de_sters)}")
        winreg.CloseKey(k)
    return sters


def inchide_sigur(s, erori):
    """Închiderea instanței MELE: număr prezentările; dacă e una străină NU închid nimic (Straina). Altfel le marchez
    „salvate”, pun la loc poziția ferestrei, WM_CLOSE; forțat doar după 90 s și doar PID-ul meu."""
    import gc
    import win32gui
    if not s.proc:
        return {"iesit": True}
    try:
        s.iesi_backstage()
    except Exception:  # noqa: BLE001
        pass
    for x, c, _ in U.ferestre_pid(s.proc.pid):
        if c not in ("PPTFrameClass",) + W3.UAC:
            win32gui.PostMessage(x, WM_CLOSE, 0, 0)
    time.sleep(1.5)
    a = s.appcom
    st = straine(a)
    rez = {"prezentari": [s.cur.text(str(p.Name)) for p in a.Presentations], "straine": st}
    if st:
        erori.append(f"PREZENTARE STRĂINĂ în instanța mea: {st} — NU am închis nimic (NU_SE_POATE)")
        rez["iesit"] = False
        return rez
    for p in a.Presentations:
        p.Saved = -1
    fs = [h for h, c, _ in U.ferestre_pid(s.proc.pid) if c == "PPTFrameClass"]
    for h in fs:
        if s.orig:
            try:
                win32gui.SetWindowPlacement(h, s.orig)   # PowerPoint ține minte poziția ferestrei la ieșire
            except Exception:  # noqa: BLE001
                pass
    a = None
    s.com = s.appcom = None
    gc.collect()
    time.sleep(1)
    for h in fs:
        win32gui.PostMessage(h, WM_CLOSE, 0, 0)
    try:
        s.proc.wait(60)
        rez["iesit"], rez["cum"] = True, "WM_CLOSE"
        return rez
    except subprocess.TimeoutExpired:
        pass
    for h, c, _ in U.ferestre_pid(s.proc.pid):
        if c == "PPTFrameClass":
            win32gui.PostMessage(h, WM_CLOSE, 0, 0)
    try:
        s.proc.wait(30)
        rez["iesit"], rez["cum"] = True, "WM_CLOSE (a doua oară)"
    except subprocess.TimeoutExpired:
        erori.append("NU s-a închis în 90 s: oprit forțat (doar PID-ul meu, doar cu prezentările mele)")
        s.proc.kill()
        rez["iesit"], rez["cum"] = True, "oprit forțat (PID-ul meu)"
    return rez


# ------------------------------------------------------------------------------------------------ ajutoare
def struct(nod, acc=None, lim=320):
    """Rândurile cu nume ale unui nod, în ordine: [tip, eticheta, tasta_acces?, activ?]."""
    acc = [] if acc is None else acc
    if len(acc) >= lim:
        return acc
    if nod.get("eticheta"):
        r = [nod.get("tip"), nod.get("eticheta")]
        if nod.get("tasta_acces"):
            r.append("tasta " + nod["tasta_acces"])
        if nod.get("activ") is False:
            r.append("gri")
        acc.append(r)
    for k in nod.get("copii", []):
        struct(k, acc, lim)
    return acc


def randuri(nod):
    return [e for t_, e in W3.etichete(nod) if t_ in ("ListItem", "MenuItem", "Button", "DataItem") and e]


def gid(s, aid):
    return RR.gaseste_id(U.din_hwnd(s.hmain), aid)


def fila(s, tid):
    RR.Rulare.fila(type("X", (), {"hmain": s.hmain})(), tid)


def tit(c, n=1):
    """Prezentarea mea: n diapozitive (1 = Title Slide „Vulcanii” / „Ce sunt”, restul Title and Content), vederea
    Normal, panoul diapozitivului activ, diapozitivul 1."""
    a = c.s.appcom
    p = a.ActivePresentation
    while p.Slides.Count < 1:
        p.Slides.Add(1, 1)
    while p.Slides.Count < n:
        p.Slides.Add(p.Slides.Count + 1, 2)
    sl = p.Slides(1)
    sl.Shapes(1).TextFrame.TextRange.Text = "Vulcanii"
    if sl.Shapes.Count > 1 and sl.Shapes(2).HasTextFrame:
        sl.Shapes(2).TextFrame.TextRange.Text = "Ce sunt"
    w = a.ActiveWindow
    w.ViewType = 9
    w.Panes(2).Activate()
    w.View.GotoSlide(1)
    try:
        w.Selection.Unselect()
    except Exception:  # noqa: BLE001
        pass
    time.sleep(0.8)
    return p


def deschide_lista(c, el, cheie, cum):
    """Lista / galeria unui control din panglică sau din panou: Expand, altfel Invoke (fir separat), altfel acțiunea
    implicită; rândurile citite după ce nu mai cresc."""
    inainte = {x for x, _, _ in c.ferestre()}
    ok = False
    for nume, f in (("Expand", RR.uia_expand), ("Invoke", RR.uia_invoke), ("DefaultAction", RR.uia_legacy)):
        try:
            if nume == "Expand":
                ok = f(el)
            else:
                W3.pornit_in_fir(lambda e=el, f=f: f(e), 4)
                ok = True
        except Exception:  # noqa: BLE001
            ok = False
        if ok:
            noi = c.noi(inainte, 5)
            if noi or nume != "Expand":
                break
    noi = c.noi(inainte, 3)
    nod = c.lista_deschisa(el, noi)
    if nod is None or not randuri(nod):
        c.erori.append(f"{cheie}: lista nu s-a deschis (ultima metodă {nume})")
        return None, inainte, noi
    nod["deschis_prin"] = cum + f" (UIA {nume})"
    c.supr[cheie] = nod
    c.fapte[f"randuri.{cheie}"] = randuri(nod)
    log(f"  {cheie}: {len(randuri(nod))} rânduri {randuri(nod)[:30]}")
    return nod, inainte, noi


def clic_dreapta_la(c, x, y):
    import win32gui
    s = c.s
    h = U.hwnd_la(s.hmain, int(x), int(y))
    inainte = {q for q, _, _ in c.ferestre()}
    cx, cy = win32gui.ScreenToClient(h, (int(x), int(y)))
    lp = ((cy & 0xFFFF) << 16) | (cx & 0xFFFF)
    win32gui.PostMessage(h, 0x0200, 0, lp)
    time.sleep(0.2)
    win32gui.PostMessage(h, 0x0204, 0x0002, lp)
    time.sleep(0.1)
    win32gui.PostMessage(h, 0x0205, 0, lp)
    return inainte, c.noi(inainte, 6)


def cauta_in(noi, pred_nume, tipuri):
    A = U.A
    cond = A.CreateOrConditionFromArray([A.CreatePropertyCondition(U.P_CT, t) for t in tipuri])
    for x, _, _ in noi:
        for hc in U.copii_clasa(x, ["NetUIHWND"]) + [x]:
            try:
                arr = U.din_hwnd(hc).FindAll(4, cond)
                for i in range(arr.Length if arr else 0):
                    e = arr.GetElement(i)
                    if pred_nume(str(e.CurrentName or "")):
                        return e
            except Exception:  # noqa: BLE001
                pass
    return None


def esc_la(h):
    import win32gui
    t = RR.focus_din(h)
    win32gui.PostMessage(t, WM_KEYDOWN, 0x1B, RR.lparam_tasta(0x1B))
    win32gui.PostMessage(t, WM_KEYUP, 0x1B, RR.lparam_tasta(0x1B, True))


def taste_in(t, combo, pauza=0.5):
    """Ca ruleaza_real.trimite_taste, dar direct în fereastra t (focusul e într-o casetă a panglicii, unde
    tinta_tastatura ar trimite tasta în document)."""
    import win32gui
    mods, vk = RR.parse_taste(combo)
    vm = [{"Ctrl": 0x11, "Shift": 0x10}[m] for m in mods]
    with RR.StareTaste(t, mods):
        for v in vm:
            win32gui.PostMessage(t, WM_KEYDOWN, v, RR.lparam_tasta(v))
        win32gui.PostMessage(t, WM_KEYDOWN, vk, RR.lparam_tasta(vk))
        time.sleep(0.2)
        win32gui.PostMessage(t, WM_KEYUP, vk, RR.lparam_tasta(vk, True))
        for v in reversed(vm):
            win32gui.PostMessage(t, WM_KEYUP, v, RR.lparam_tasta(v, True))
        time.sleep(0.15)
        RR.bariera()
        time.sleep(pauza)


def text_in(t, text):
    import win32gui
    for ch in text:
        win32gui.PostMessage(t, WM_CHAR, ord(ch), 1)
        time.sleep(0.05)
    time.sleep(0.3)
    RR.bariera()


def focus_pe(el):
    """SetFocus UIA pe un control al panglicii; întoarce fereastra cu focus a firului PowerPoint și dacă elementul îl are."""
    try:
        el.SetFocus()
    except Exception:  # noqa: BLE001
        pass
    time.sleep(0.6)
    try:
        are = bool(el.CurrentHasKeyboardFocus)
    except Exception:  # noqa: BLE001
        are = None
    return are


def valoare(el):
    try:
        return str(el.GetCurrentPropertyValue(30045))
    except Exception:  # noqa: BLE001
        return None


def panou(s, nume_partial=None):
    b = U.arbore(U.din_hwnd(s.hmain))
    ps = U.cauta(b, lambda n: n.get("c") == "MsoWorkPane" and n.get("n") not in ("Ribbon", "Status Bar"))
    if nume_partial:
        ps = [p for p in ps if nume_partial.lower() in str(p.get("n")).lower()] or ps
    return ps[0] if ps else None


def panou_el(s, nume):
    for e in U.gaseste_toate(U.din_hwnd(s.hmain), U.P_NAME, nume):
        try:
            if e.CurrentClassName == "MsoWorkPane":
                return e
        except Exception:  # noqa: BLE001
            pass
    return None


def stari(el, nume_lista):
    out = {}
    for n in nume_lista:
        e = RR.gaseste_nume(el, n, (50000, 50031, 50011))
        try:
            out[n] = None if e is None else bool(e.CurrentIsEnabled)
        except Exception:  # noqa: BLE001
            out[n] = None
    return out


# ------------------------------------------------------------------------------------------------ capturile
def a_font_color(c):
    """a. Font Color ▾: butonul la pornire, paleta din panglică (text ales), paleta din mini-bara de clic dreapta."""
    s = c.s
    p = tit(c)
    f = {}
    el = gid(s, "FontColorPicker")
    f["buton_fara_text_ales"] = c.nod(el) if el else None
    tr = p.Slides(1).Shapes(1).TextFrame.TextRange
    f["culoare_titlu_com_la_pornire"] = hexrgb(tr.Font.Color.RGB)
    tr.Select()
    time.sleep(1.2)
    el = gid(s, "FontColorPicker")
    f["buton_cu_text_ales"] = c.nod(el)
    nod, inainte, _ = deschide_lista(c, el, "lista.FontColorPicker",
                                     "Font Color ▾ (Home › Font), cu tot textul titlului „Vulcanii” ales")
    if nod:
        f["structura"] = struct(nod)
    c.inchide_noi(inainte)
    time.sleep(0.8)
    # mini-bara: clic dreapta pe literele titlului (textul ales), Font Color ▾ din ea
    w = s.appcom.ActiveWindow
    w.Panes(2).Activate()
    tr.Characters(3, 0).Select()      # ca dump_uia_office: textul în editare, altfel PowerPoint dă meniul diapozitivului
    time.sleep(0.6)
    x = w.PointsToScreenPixelsX(tr.BoundLeft + tr.BoundWidth / 2)
    y = w.PointsToScreenPixelsY(tr.BoundTop + tr.BoundHeight / 2)
    inainte, noi = clic_dreapta_la(c, x, y)
    meniu_text = cauta_in(noi, lambda n: n == "Font...", (50011, 50000)) is not None
    f["mini_bara_ferestre"] = [(cl, s.cur.text(t)) for _, cl, t in noi]
    fc = cauta_in(noi, lambda n: n.startswith("Font Color"), (50031,))
    f["mini_bara"] = {"meniu_text_verificat (are Font...)": meniu_text, "font_color_gasit": fc is not None}
    if fc is not None and meniu_text:
        f["mini_bara"]["buton"] = c.nod(fc)
        dd = None
        try:
            ch = fc.FindAll(2, U.A.CreateTrueCondition())
            for i in range(ch.Length if ch else 0):
                e = ch.GetElement(i)
                if e.CurrentControlType == 50011:
                    dd = e
        except Exception:  # noqa: BLE001
            pass
        nod2, _, _ = deschide_lista(c, dd or fc, "lista.FontColorPicker_minibara",
                                    "Font Color ▾ din mini-bara (clic dreapta pe literele titlului ales)")
        if nod2:
            la_fel = randuri(nod2) == c.fapte.get("randuri.lista.FontColorPicker")
            f["mini_bara"]["paleta_la_fel_ca_panglica"] = la_fel
            if la_fel:
                c.supr.pop("lista.FontColorPicker_minibara", None)
    c.inchide_noi(inainte)
    c.esc_main(1)
    c.fapte["a_font_color"] = f


def gest_inchidere(c, fel):
    s = c.s
    if fel == "ctrl_w":
        RR.trimite_taste(s.hpane, "Ctrl+W")
        return "Ctrl+W (WM_KEYDOWN/UP cu Ctrl ținut, în panoul diapozitivului)"
    if fel == "file_close":
        ft = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "FileTabButton")
        U.apasa(ft)
        time.sleep(3)
        nav = U.gaseste(U.din_hwnd(s.hmain), U.P_AID, "NavBarMenu")
        it = RR.gaseste_nume(nav, "Close", (50019, 50007, 50011, 50000)) if nav else None
        if it is None:
            raise RuntimeError("File › Close negăsit în bara Backstage")
        W3.pornit_in_fir(lambda e=it: U.selecteaza(e) or U.apasa(e), 4)
        return "File (UIA pe FileTabButton) › Close (UIA Select/Invoke în bara Backstage, fir separat)"
    btn = W3.buton_close(s.hmain)
    if btn is None:
        raise RuntimeError("butonul ✕ (Close) din bara de titlu negăsit")
    W3.pornit_in_fir(lambda e=btn: RR.uia_invoke(e) or RR.uia_legacy(e), 3)
    return "✕ din bara de titlu (UIA Invoke pe butonul „Close”, fir separat)"


def fereastra_goala(c):
    """PowerPoint fără nicio prezentare: titlul, filele, comenzile active / gri, zona documentului."""
    import win32gui
    s = c.s
    a = s.appcom
    fs = [(h, t) for h, cl, t in c.ferestre() if cl == "PPTFrameClass"]
    f = {"prezentari": int(a.Presentations.Count), "ferestre_powerpoint": [s.cur.text(t) for _, t in fs]}
    if not fs:
        return f
    h = fs[0][0]
    s.hmain = h
    b = U.arbore(U.din_hwnd(h))
    f["titlu"] = s.cur.text(win32gui.GetWindowText(h))
    f["file"] = [s.cur.text(str(n.get("n"))) for n in U.cauta(b, lambda n: n.get("ct") == 50019)]
    f["fila_aleasa"] = X7.alese(c, h)[:4]
    ids = ("FileTabButton", "Bold", "SlideNewGallery", "FontColorPicker", "PasteMenu", "Paste", "SlideLayoutGallery",
           "FlyoutAnchorInsertPictures", "TabHome")
    N = s.norm()
    f["comenzi_activ"] = {n.get("id"): N.nod(dict(n, k=[])).get("activ", True)
                          for n in U.cauta(b, lambda n: n.get("id") in ids)}
    f["copii_ferestre"] = sorted({win32gui.GetClassName(x) for x in U.copii_clasa(h, ["mdiClass", "paneClassDC",
                                                                                         "MDIClient"])})
    f["zona_document"] = [(n.get("ct"), n.get("c"), s.cur.text(str(n.get("n") or "")))
                          for n in b.get("k", []) if n.get("c") not in ("MsoCommandBarDock", "DropShadow")][:8]
    return f


def b_inchidere(c):
    """b. Ctrl+W / File › Close / ✕ pe o prezentare modificată; Esc, Cancel; Don't Save; Ctrl+N; Ctrl+O."""
    s = c.s
    a = s.appcom
    tit(c)
    rez = {}
    for k, fel in enumerate(("ctrl_w", "file_close", "x")):
        p = a.ActivePresentation
        p.Slides(1).Shapes(1).TextFrame.TextRange.Text = f"Vulcanii {k}"
        f = {"saved_inainte": bool(p.Saved)}
        inainte = {x for x, _, _ in c.ferestre()}
        cum = gest_inchidere(c, fel)
        noi = X7.noi_reale(c, inainte, 10)
        f["gest"], f["ferestre_noi"] = cum, [{"clasa": cl, "titlu": s.cur.text(t)} for _, cl, t in noi]
        for x, cl, t in noi:
            nod = X7.captura(c, x, cl, t, cum + " pe o prezentare NOUĂ, modificată, nesalvată")
            nume = X7.nume_fereastra_interioara(nod)
            rez[fel] = (nume, nod)
            f.update(nume=nume, butoane=nod["butoane_ordine"], texte=nod["texte"], focus=nod["focus"])
            log(f"  b. {fel} -> {cl} {nume!r}: butoane {nod['butoane_ordine']} focus {nod['focus']}")
            if fel == "ctrl_w":
                esc_la(x)
                time.sleep(2.0)
                f["dupa_esc"] = {"fereastra_inchisa": x not in {y for y, _, _ in c.ferestre()},
                                 "prezentari": int(a.Presentations.Count), "titlu_prezentare": str(a.ActivePresentation.Name)}
            break
        c.inchide_noi(inainte)
        time.sleep(1.2)
        f["dupa_cancel"] = {"prezentari": int(a.Presentations.Count), "backstage": c.backstage_pagina(),
                            "text_titlu": str(a.ActivePresentation.Slides(1).Shapes(1).TextFrame.TextRange.Text)}
        if c.backstage_pagina():
            s.iesi_backstage()
        c.fapte[f"b_{fel}"] = f
    if "ctrl_w" in rez:
        nume, nod = rez["ctrl_w"]
        cheie = "dialog." + (slug(nume) or "ctrl_w_prezentare_modificata")
        c.supr[cheie] = nod
        for fel in ("file_close", "x"):
            if fel in rez:
                la_fel = json.dumps(W3.etichete(rez[fel][1])) == json.dumps(W3.etichete(nod))
                c.fapte[f"b_{fel}"]["la_fel_ca_ctrl_w"] = la_fel
                if not la_fel:
                    c.supr[f"{cheie}#{fel}"] = rez[fel][1]
    # Don't Save la Ctrl+W: PowerPoint fără prezentare
    p = a.ActivePresentation
    p.Slides(1).Shapes(1).TextFrame.TextRange.Text = "Vulcanii 9"
    inainte = {x for x, _, _ in c.ferestre()}
    RR.trimite_taste(s.hpane, "Ctrl+W")
    noi = X7.noi_reale(c, inainte, 10)
    ds = cauta_in(noi, lambda n: n in ("Don't Save", "Don’t Save"), (50000,))
    g = {"dont_save_gasit": ds is not None}
    if ds is not None:
        W3.pornit_in_fir(lambda e=ds: RR.uia_invoke(e) or RR.uia_legacy(e), 5)
        time.sleep(3.5)
        g.update(fereastra_goala(c))
    else:
        c.inchide_noi(inainte)
    log(f"  b. Don't Save -> {g}")
    c.fapte["b_dont_save"] = g
    # Ctrl+N din fereastra fără prezentare
    if int(a.Presentations.Count) == 0:
        h = [x for x, cl, _ in c.ferestre() if cl == "PPTFrameClass"]
        if h:
            RR.trimite_taste(h[0], "Ctrl+N")
            for _ in range(20):
                time.sleep(0.5)
                if int(a.Presentations.Count) == 1:
                    break
            n = {"prezentari": int(a.Presentations.Count)}
            if n["prezentari"] == 1:
                n["nume"] = eticheteaza_noua(a, set())
                n["diapozitive"] = [str(sl.CustomLayout.Name) for sl in a.ActivePresentation.Slides]
            n["ferestre_powerpoint"] = [s.cur.text(t) for _, cl, t in c.ferestre() if cl == "PPTFrameClass"]
            c.fapte["b_ctrl_n_din_fereastra_goala"] = n
            log(f"  b. Ctrl+N (fără prezentare) -> {n}")
    if int(a.Presentations.Count) == 0:
        a.Presentations.Add(True).Tags.Add("LHREF", "1")
        time.sleep(2)
    cadru(s)
    tit(c)
    # Ctrl+N cu o prezentare deschisă
    vechi = {str(p.Name) for p in a.Presentations}
    h0 = s.hmain
    RR.trimite_taste(s.hpane, "Ctrl+N")
    for _ in range(20):
        time.sleep(0.5)
        if int(a.Presentations.Count) == len(vechi) + 1:
            break
    n = {"prezentari": int(a.Presentations.Count)}
    if n["prezentari"] == len(vechi) + 1:
        n["nume"] = eticheteaza_noua(a, vechi)
        n["prezentare_activa"] = str(a.ActivePresentation.Name)
        n["fereastra_activa_com"] = s.cur.text(str(a.ActiveWindow.Caption))
        n["diapozitive"] = [str(sl.CustomLayout.Name) for sl in a.ActivePresentation.Slides]
    n["ferestre_powerpoint"] = [s.cur.text(t) for _, cl, t in c.ferestre() if cl == "PPTFrameClass"]
    c.fapte["b_ctrl_n_cu_prezentare"] = n
    log(f"  b. Ctrl+N (cu prezentare) -> {n}")
    for p in list(a.Presentations):
        if a_mea(p) and str(p.Name) not in vechi:
            p.Saved = -1
            p.Close()
    time.sleep(1.5)
    cadru(s)
    # Ctrl+O
    RR.trimite_taste(s.hpane, "Ctrl+O")
    time.sleep(3)
    c.fapte["b_ctrl_o"] = {"backstage": c.backstage_pagina(),
                           "ferestre_noi": [(cl, s.cur.text(t)) for x, cl, t in c.ferestre() if cl not in ("PPTFrameClass",)
                                            and x not in {h0}][:4]}
    log(f"  b. Ctrl+O -> {c.fapte['b_ctrl_o']}")
    if c.backstage_pagina():
        s.iesi_backstage()


def c_obiecte(c):
    """c. Insert › Pictures / Shapes / Table ▾ și Home › New Slide ▾ / Layout: listele deschise."""
    s = c.s
    tit(c)
    fila(s, "TabInsert")
    for cheie, aid in (("lista.FlyoutAnchorInsertPictures", "FlyoutAnchorInsertPictures"),
                       ("lista.ShapesInsertGallery", "ShapesInsertGallery"), ("lista.TableInsertGallery", "TableInsertGallery")):
        el = gid(s, aid)
        if el is None:
            c.erori.append(f"{cheie}: {aid} nu e în panglică")
            continue
        nod, inainte, noi = deschide_lista(c, el, cheie, f"{aid} (Insert), cu diapozitivul 1 activ, nimic ales")
        if nod is not None:
            c.fapte[f"structura.{cheie}"] = struct(nod)
        if aid == "FlyoutAnchorInsertPictures" and nod is not None:
            it = cauta_in(noi, lambda n: n.startswith("This Device"), (50011, 50000, 50007))
            f = {"this_device_gasit": it is not None}
            if it is not None:
                inainte2 = {x for x, _, _ in c.ferestre()}
                W3.pornit_in_fir(lambda e=it: RR.uia_invoke(e) or RR.uia_legacy(e), 4)
                noi2 = X7.noi_reale(c, inainte2, 8)
                f["ferestre_noi"] = [{"clasa": cl, "titlu": s.cur.text(t)} for _, cl, t in noi2]
                for x, cl, t in noi2:
                    if cl == "#32770":
                        f["butoane"] = [b["eticheta"] for b in c.butoane(x)]
                        f["focus"] = X7.focus_in(c, x)
                inainte = inainte | inainte2
            c.fapte["c_pictures_this_device"] = f
            log(f"  c. This Device… -> {f}")
        c.inchide_noi(inainte)
        time.sleep(0.8)
    fila(s, "TabHome")
    for cheie, aid in (("lista.SlideNewGallery", "SlideNewGallery"), ("lista.SlideLayoutGallery", "SlideLayoutGallery")):
        el = gid(s, aid)
        nod, inainte, _ = deschide_lista(c, el, cheie, f"{aid} ▾ (Home › Slides), diapozitivul 1 activ")
        if nod is not None:
            c.fapte[f"structura.{cheie}"] = struct(nod)
        c.inchide_noi(inainte)
        time.sleep(0.8)


def d_efecte(c):
    """d. Duration „0,5”+Enter (+Apply To All); Animation Pane cu două animații; Format Background › Solid fill."""
    import win32gui
    s = c.s
    a = s.appcom
    p = tit(c, 3)
    f = {}
    # --- Duration
    fila(s, "TabTransitions")
    p.Slides(1).SlideShowTransition.EntryEffect = 3849     # Fade (scenariile reale: tranzitie_cod 3849)
    time.sleep(1.5)
    sp = gid(s, "TransitionDuration")
    f["duration_dupa_fade"] = {"valoare_uia": valoare(sp), "com": float(p.Slides(1).SlideShowTransition.Duration),
                               "activ": bool(sp.CurrentIsEnabled)}
    are = focus_pe(sp)
    t = RR.focus_din(s.hmain)
    f["duration_focus"] = {"are_focus": are, "clasa_focus": win32gui.GetClassName(t)}
    taste_in(t, "Ctrl+A")
    text_in(t, "0,5")
    f["duration_inainte_de_enter"] = valoare(gid(s, "TransitionDuration"))
    taste_in(t, "Enter", 1.0)
    sp = gid(s, "TransitionDuration")
    f["duration_dupa_enter"] = {"valoare_uia": valoare(sp), "com": float(p.Slides(1).SlideShowTransition.Duration),
                                "nod": c.nod(sp)}
    log(f"  d. Duration: {f['duration_dupa_fade']} -> {f['duration_dupa_enter']['valoare_uia']} / com "
        f"{f['duration_dupa_enter']['com']}")
    at = gid(s, "SlideTransitionApplyToAll")
    RR.uia_invoke(at)
    time.sleep(1.5)
    f["dupa_apply_to_all"] = [{"tranzitie_cod": int(sl.SlideShowTransition.EntryEffect),
                               "durata": float(sl.SlideShowTransition.Duration)} for sl in p.Slides]
    log(f"  d. Apply To All: {f['dupa_apply_to_all']}")
    # --- Animation Pane cu două animații (puse prin model) pe diapozitivul 1
    sl = p.Slides(1)
    seq = sl.TimeLine.MainSequence
    seq.AddEffect(sl.Shapes(1), 10)      # msoAnimEffectFade
    seq.AddEffect(sl.Shapes(2), 2)       # msoAnimEffectFly
    a.ActiveWindow.View.GotoSlide(1)
    fila(s, "TabAnimations")
    X7.mso_in_fir(s, "AnimationCustom")
    time.sleep(3)
    pn = panou(s, "Animation")
    g = {"panou_gasit": pn is not None}
    if pn is not None:
        nod = s.norm().nod(pn)
        nod["deschis_prin"] = ("CommandBars.ExecuteMso('AnimationCustom'), cu două animații pe diapozitivul 1 (Fade pe titlu, "
                               "Fly In pe subtitlu, puse prin TimeLine.MainSequence.AddEffect)")
        c.supr["panou.AnimationCustom#doua_animatii"] = nod
        g["structura"] = struct(nod)
        pe = panou_el(s, pn.get("n"))
        A = U.A
        rows = []
        if pe is not None:
            cond = A.CreateOrConditionFromArray([A.CreatePropertyCondition(U.P_CT, x) for x in (50007, 50029, 50024)])
            arr = pe.FindAll(4, cond)
            rows = [arr.GetElement(i) for i in range(arr.Length if arr else 0)]
        g["randuri"] = [s.cur.text(str(r.CurrentName)) for r in rows]
        for i, r in enumerate(rows[:2], start=1):
            ok = RR.uia_select(r) or RR.uia_invoke(r)
            time.sleep(1.2)
            g[f"rand_{i}_ales"] = {"select": ok, "ales": X7.alese(c, pe), **stari(pe, ("Move Up", "Move Down", "Play From"))}
        if len(rows) >= 2:
            mu = RR.gaseste_nume(pe, "Move Up", (50000,))
            if mu is not None and mu.CurrentIsEnabled:
                RR.uia_invoke(mu)
                time.sleep(1.5)
            ids = {int(sl.Shapes(k).Id): k for k in range(1, sl.Shapes.Count + 1)}
            g["ordine_dupa_move_up"] = [ids.get(int(seq.Item(i).Shape.Id)) for i in range(1, seq.Count + 1)]
            pe = panou_el(s, pn.get("n"))
            g["randuri_dupa_move_up"] = [s.cur.text(str(r.CurrentName)) for r in
                                         [pe.FindAll(4, cond).GetElement(i) for i in range(pe.FindAll(4, cond).Length)]]
        X7.mso_in_fir(s, "AnimationCustom")
        time.sleep(1.5)
    log(f"  d. Animation Pane: {g}")
    f["animation_pane"] = g
    # --- Format Background › Solid fill
    fila(s, "TabHome")
    w = a.ActiveWindow
    w.Panes(2).Activate()
    w.Selection.Unselect()
    x = w.PointsToScreenPixelsX(p.PageSetup.SlideWidth * 0.97)
    y = w.PointsToScreenPixelsY(p.PageSetup.SlideHeight * 0.97)
    inainte, noi = clic_dreapta_la(c, x, y)
    art = cauta_in(noi, lambda n: n == "Format Background...", (50011, 50000))
    h = {"meniu_diapozitiv_verificat": art is not None}
    if art is not None:
        U.apasa(art)
        time.sleep(3)
        pe = panou_el(s, "Format Background")
        sf = RR.gaseste_nume(pe, "Solid fill", (50013,)) if pe is not None else None
        h["solid_fill_gasit"] = sf is not None
        if sf is not None:
            ok = RR.uia_select(sf) or RR.uia_invoke(sf) or RR.uia_legacy(sf)
            time.sleep(2)
            pn = panou(s, "Format Background")
            nod = s.norm().nod(pn)
            nod["deschis_prin"] = "clic dreapta pe diapozitiv › Format Background... › Solid fill (UIA Select)"
            c.supr["panou.LaunchFormatBackground#Solid fill"] = nod
            h["select"] = ok
            h["structura"] = struct(nod)
            pe = panou_el(s, "Format Background")
            h["stari"] = stari(pe, ("Apply to All", "Reset Background", "Close"))
            col = None
            arr = pe.FindAll(4, U.A.CreateTrueCondition())
            cand = []
            for i in range(arr.Length if arr else 0):
                e = arr.GetElement(i)
                nm = str(e.CurrentName or "")
                if "color" in nm.lower() and e.CurrentControlType in (50031, 50000, 50011):
                    cand.append((nm, e.CurrentControlType))
                    if col is None or e.CurrentControlType == 50031:
                        col = e
            h["controale_culoare"] = cand
            if col is not None:
                nod2, inainte2, _ = deschide_lista(c, col, "lista.FormatBackground_Color",
                                                   "Format Background › Solid fill › Color ▾")
                if nod2 is not None:
                    h["paleta_la_fel_ca_font_color"] = randuri(nod2) == c.fapte.get("randuri.lista.FontColorPicker")
                    h["structura_paleta"] = struct(nod2)
                c.inchide_noi(inainte2)
        if pe is not None:
            for e in U.gaseste_toate(pe, U.P_NAME, "Close"):
                if U.apasa(e):
                    break
            time.sleep(1)
    else:
        c.inchide_noi(inainte)
    log(f"  d. Format Background: { {k: v for k, v in h.items() if k not in ('structura', 'structura_paleta')} }")
    f["format_background"] = h
    c.fapte["d_efecte"] = f


TOATE = (a_font_color, b_inchidere, c_obiecte, d_efecte)


def capturi_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    if ppt_ruleaza():
        print("SĂRIT: POWERPNT.EXE rulează deja — nu pornesc.")
        return 3
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    s = U.Sesiune("powerpoint")
    c = W3.Cap(s)
    t0 = time.time()
    doar = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--doar=")), None)
    alese_f = [f for f in TOATE if not doar or f.__name__ in doar]
    inchis = {}
    try:
        porneste(s)
        for f in alese_f:
            if time.time() - t0 > 540:
                c.erori.append(f"{f.__name__}: sărită (sesiunea a trecut de 9 minute)")
                continue
            try:
                log(f"== {f.__name__}")
                st = straine(s.appcom)
                if st:
                    raise Straina(f"prezentări străine: {st}")
                f(c)
            except Straina:
                raise
            except Exception:  # noqa: BLE001
                c.erori.append(f"{f.__name__}: " + traceback.format_exc()[-600:])
                log(traceback.format_exc()[-600:])
                try:
                    c.inchide_noi({x for x, cl, _ in c.ferestre() if cl == "PPTFrameClass"})
                    if c.backstage_pagina():
                        s.iesi_backstage()
                    cadru(s)
                except Exception:  # noqa: BLE001
                    pass
    except Straina as e:
        c.erori.append(f"STRĂINĂ: {e}")
    finally:
        try:
            inchis = inchide_sigur(s, c.erori)
        except Exception:  # noqa: BLE001
            c.erori.append("închidere: " + traceback.format_exc()[-300:])
    out = {"aplicatie": "powerpoint", "generat": time.strftime("%Y-%m-%d %H:%M"), "versiune": U.versiune_exe("POWERPNT.EXE"),
           "versiune_com_build": s.build, "desktop": DESKTOP, "dpi_factor": s.f, "fereastra": getattr(s, "fereastra_css", None),
           "suprafete": c.supr, "fapte": c.fapte, "excluse_personal": c.excluse, "redactari": s.cur.redactari,
           "sarite_cont": sorted(set(s.sarite)), "erori": c.erori + s.erori, "jurnal": LOG, "inchidere": inchis,
           "durata_s": round(time.time() - t0), "rulari": [{"generat": time.strftime("%Y-%m-%d %H:%M"),
                                                            "functii": [f.__name__ for f in alese_f], "inchidere": inchis}]}
    if doar and BRUT.exists():
        vechi = json.loads(BRUT.read_text(encoding="utf-8"))
        vechi["suprafete"].update(c.supr)
        vechi["fapte"].update(c.fapte)
        for k, v in s.cur.redactari.items():
            vechi["redactari"][k] = vechi["redactari"].get(k, 0) + v
        vechi["erori"] = [e for e in vechi.get("erori", []) if not any(e.startswith(f.__name__) for f in alese_f)] + c.erori + s.erori
        vechi["jurnal"] = vechi.get("jurnal", []) + LOG
        vechi["rulari"] = vechi.get("rulari", []) + out["rulari"]
        vechi["generat"] = out["generat"]
        out = vechi
    text = W3.fara_cale_personala(json.dumps(out, ensure_ascii=False, indent=1, default=str))
    for x in s.cur.interzise:
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas în ieșire — NU scriu fișierul")
    IES.mkdir(parents=True, exist_ok=True)
    BRUT.write_text(text, encoding="utf-8")
    print(f"{BRUT.name}: {len(c.supr)} suprafețe, {len(c.erori)} erori, {out['durata_s']} s, închidere {inchis}")
    return 0


# ------------------------------------------------------------------------------------------------ scrie / verifica
def scrie():
    incarca()
    b = json.loads(BRUT.read_text(encoding="utf-8"))
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    ale_mele = set(r.get("acoperire_r11", {}).get("suprafete_adaugate", []))
    puse, sarite = [], []
    for k, v in b["suprafete"].items():
        if k in S and k not in ale_mele:
            sarite.append(k)
            continue
        v = json.loads(json.dumps(v))
        if k.startswith("dialog.") and v.get("clasa_fereastra") == "NUIDialog":
            inter = W3.cauta_noduri(v, lambda n: n.get("tip") == "Window" and n.get("eticheta"))
            if inter and not v.get("eticheta"):
                v["eticheta"] = inter[0]["eticheta"]
                v["nota"] = ("eticheta rădăcinii = numele ferestrei interioare (textul afișat); în UI Automation fereastra "
                             "exterioară NUIDialog n-are nume")
        if k.startswith("lista."):
            pop = W3.cauta_noduri(v, lambda n: n.get("tip") == "Menu")
            if pop and pop[0] is not v:
                nv = dict(pop[0])
                nv["deschis_prin"] = v.get("deschis_prin")
                nv["nota"] = ("lista deschisă = fereastra-popup (Menu) a controlului; controlul („" + str(v.get("eticheta")) +
                              "”) e în panglica.<filă> / panou.<…>")
                v = nv
        S[k] = v
        puse.append(k)
    r["acoperire_r11"] = {
        "generat": b["generat"], "versiune": b["versiune"], "versiune_com_build": b["versiune_com_build"],
        "cum": ("referinte/acoperire_powerpoint_r11.py capturi: instanța MEA POWERPNT /B pe desktopul ascuns "
                f"{b['desktop']} (pornită doar după ce tasklist n-a arătat niciun POWERPNT.EXE), fereastra 1366×768 css "
                "(Sesiune din dump_uia_office.py), legătura COM din fereastra instanței (AccessibleObjectFromWindow); "
                "gesturile ca în ruleaza_real.py (WM_KEYDOWN cu Ctrl ținut, WM_CHAR; UIA Expand/Invoke/Select; clic dreapta "
                "la coordonate PointsToScreenPixels, verificat după conținut); nicio prezentare salvată — ferestrele "
                "închise cu Esc / Cancel / Don't Save; arborii normalizați și redactați ca în dump"),
        "suprafete_adaugate": puse, "chei_vechi_neatinse": sarite, "fapte": b["fapte"],
        "NEVERIFICAT": b.get("NEVERIFICAT", {}), "excluse_personal": b.get("excluse_personal", []),
        "redactari": b.get("redactari", {}), "erori": b.get("erori", []), "rulari": b.get("rulari", []),
    }
    text = json.dumps(r, ensure_ascii=False, indent=1)
    for x in W3.interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas — NU scriu uia_powerpoint.json")
    if re.search(r"c:[\\/]+users[\\/]", text.lower()):
        raise RuntimeError("o cale C:/Users a rămas — NU scriu uia_powerpoint.json")
    REF.write_text(text, encoding="utf-8")
    print(f"uia_powerpoint.json: {len(puse)} suprafețe noi: {puse}; neatinse: {sarite}")
    return 0


def verifica():
    incarca()
    p = []
    r = json.loads(REF.read_text(encoding="utf-8"))
    S = r["suprafete"]
    ac = r.get("acoperire_r11")
    if not ac:
        p.append("uia_powerpoint.json nu are blocul acoperire_r11")
    else:
        for k in ac.get("suprafete_adaugate", []):
            if k not in S:
                p.append(f"suprafața {k} anunțată, dar lipsă")
    text = REF.read_text(encoding="utf-8").lower()
    for x in W3.interzise():
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text):
            p.append("nume interzis în uia_powerpoint.json")
    if re.search(r"c:[\\/]+users[\\/]", text):
        p.append("cale cu C:/Users în uia_powerpoint.json")
    try:
        sc = SCENARII
    except NameError:
        sc = []
    for s in sc:
        f = D / "scenarii" / "powerpoint" / f"{s['id']}.json"
        if not f.exists():
            p.append(f"scenariul {s['id']} lipsește")
        fr = AICI / "scenarii_real" / f"{s['id']}.json"
        if fr.exists() and re.search(r"c:[\\/]+users[\\/]", fr.read_text(encoding="utf-8").lower()):
            p.append(f"cale cu C:/Users în scenarii_real/{s['id']}.json")
    for x in p:
        print("PROBLEMĂ:", x)
    print(len(p))
    return 1 if p else 0


# ------------------------------------------------------------------------------------------------ main
def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd in ("capturi", "scenarii"):
        if ppt_ruleaza():
            print("SĂRIT: POWERPNT.EXE rulează deja (o singură instanță) — nu pornesc și nu ating nimic.")
            return 3
        import dump_uia_office as U_
        if U_.nume_desktop_curent().lower() != "default":
            return {"capturi": capturi_intern, "scenarii": scenarii_intern}[cmd]()
        r = subprocess.run([sys.executable, str(HIDDEN), "run", "--desktop", DESKTOP if cmd == "capturi" else DESKTOP_SC,
                            "--timeout", "900", "--", sys.executable, str(Path(__file__).resolve()), "_" + cmd] +
                           [a for a in sys.argv if a.startswith(("--doar=", "--id="))])
        try:
            print("curățare Recent:", curata_mru() or "nimic de șters")
        except Exception as e:  # noqa: BLE001
            print("curățare Recent: eroare", repr(e))
        print("POWERPNT.EXE încă rulează după sesiune:" if ppt_ruleaza() else "nicio instanță PowerPoint rămasă")
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
    if cmd == "curata_mru":
        print(curata_mru())
        return 0
    print(__doc__)
    return 2


# ------------------------------------------------------------------------------------------------ scenariile (lotul 2)
D_DIA = ("diapozitive = [{aspect (numele aspectului), texte (textele casetelor nevide), forme (câte), tranzitie_cod?, "
         "animatii_cod?}]")
D_FORME = ("forme_diapozitiv = pe fiecare diapozitiv, formele în ordinea din Shapes: {fel: substituent | forma | imagine | "
           "caseta_text | tabel | alta, forma: numele formei din galeria Shapes (doar la fel = forma; ex. „Arrow: Right”), "
           "text: textul ei (\"\" dacă n-are)}; pozitii_forme = pe fiecare diapozitiv, [stânga, sus, lățime, înălțime] ale "
           "fiecărei forme, în puncte, rotunjite")
FORME_COD = {1: "Rectangle", 5: "Rectangle: Rounded Corners", 9: "Oval", 33: "Arrow: Right", 34: "Arrow: Left",
             35: "Arrow: Up", 36: "Arrow: Down", 92: "Star: 5 Points"}
SURSA_PNG = D.parents[1] / "tutoriale" / "excel" / "media" / "01-latime-coloana.png"
L = "lectii/vi/"
SCENARII = [   # ordinea contează: Ctrl+N primul (numele PresentationN depinde de câte prezentări noi a făcut instanța)
    {"id": "powerpoint-ctrl-n", "mod": "gest_real", "start": {"diapozitive": [{"aspect": "Title Slide"}]},
     "pasi": [{"gest": "taste", "taste": "Ctrl+N"}], "stare_citita": ["prezentare_activa", "prezentari_deschise"],
     "descriere": "PowerPoint abia pornit, cu prezentarea lui („Presentation1”, un diapozitiv Title Slide gol); Ctrl+N. "
                  "prezentare_activa = numele prezentării active după gest (Presentation.Name; null fără prezentare); "
                  "prezentari_deschise = câte prezentări sunt deschise.",
     "lectii": ["vi/m1-l03"], "sursa_gest": L + "m1-l03/index.html:106"},
    {"id": "powerpoint-ctrl-w-modificat", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]},
     "pasi": [{"gest": "taste", "taste": "Ctrl+W"}, {"gest": "clic", "tinta": "fereastra:Cancel", "real": "uia:fereastra:Cancel"}],
     "stare_citita": ["dialog", "prezentari_deschise", "diapozitive"],
     "descriere": "Prezentare nouă, modificată (titlul „Vulcanii”), nesalvată; Ctrl+W: PowerPoint întreabă; Cancel. dialog = "
                  "fereastra care a întrebat (null dacă n-a apărut): {titlu: textul barei de titlu (\"\" dacă n-are), "
                  "intrebare: textul mare din fereastră, butoane: etichetele butoanelor, în ordinea de pe ecran (sus-jos, "
                  "stânga-dreapta), apasat: butonul apăsat}; prezentari_deschise = câte prezentări sunt deschise după Cancel. "
                  + D_DIA + ".", "lectii": ["vi/m1-l02", "vi/m2-l08"], "sursa_gest": L + "m2-l08/index.html:330"},
    {"id": "powerpoint-font-color-titlu", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "selectie_text": [1, 1],
               "forma_citita": [1, 1]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabHome", "id_mso": "FontColorPicker_Dropdown", "element": "Red"}],
     "stare_citita": ["culoare_text"],
     "descriere": "Tot textul titlului „Vulcanii” ales; Home › Font Color ▾ › Red (Standard Colors). culoare_text = culoarea "
                  "literelor casetei din forma_citita, #RRGGBB (TextRange.Font.Color.RGB).",
     "lectii": ["vi/m1-l06", "vi/m2-l08", "vi/m2-l09"], "sursa_gest": L + "m1-l06/index.html:150"},
    {"id": "powerpoint-two-content-new-slide", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Soarele"]}]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabHome", "id_mso": "SlideNewGallery_Dropdown", "element": "Two Content"}],
     "stare_citita": ["diapozitive"],
     "descriere": "Un diapozitiv Title Slide; Home › New Slide ▾ (săgeata) › Two Content. " + D_DIA + ".",
     "lectii": ["vi/m2-l10"], "sursa_gest": L + "m2-l10/index.html:150"},
    {"id": "powerpoint-two-content-layout", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Soarele"]},
                               {"aspect": "Title and Content", "texte": ["Steaua noastră"]}], "diapozitiv_activ": 2},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabHome", "id_mso": "SlideLayoutGallery", "element": "Two Content"}],
     "stare_citita": ["diapozitive"],
     "descriere": "Diapozitivul 2 (Title and Content, titlul „Steaua noastră”) activ; Home › Layout › Two Content. " + D_DIA + ".",
     "lectii": ["vi/m2-l09", "vi/m2-l10"], "sursa_gest": L + "m2-l09/index.html:228"},
    {"id": "powerpoint-ctrl-c-v-caseta", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Soarele", "O stea"]},
                               {"aspect": "Title Only", "texte": ["Planetele"]}], "diapozitiv_activ": 1,
               "selectie_forma": [1, 2]},
     "pasi": [{"gest": "taste", "taste": "Ctrl+C"},
              {"gest": "clic", "diapozitiv": 2, "real": "com:miniatura:2"},
              {"gest": "taste", "taste": "Ctrl+V"}],
     "stare_citita": ["diapozitive", "forme_diapozitiv", "pozitii_forme"],
     "descriere": "Caseta de subtitlu „O stea” a diapozitivului 1 aleasă ca obiect; Ctrl+C; clic pe miniatura diapozitivului 2; "
                  "Ctrl+V. " + D_DIA + "; " + D_FORME + ".", "lectii": ["vi/m1-l05"], "sursa_gest": L + "m1-l05/index.html:184"},
    {"id": "powerpoint-sageata-dreapta", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Only", "texte": ["Ziua și noaptea"]}]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabInsert", "id_mso": "ShapesInsertGallery", "element": "Arrow: Right",
               "real": "uia:galerie_fara_schimbare"},
              {"gest": "clic", "tinta": "diapozitiv", "real": "mouse:diapozitiv"}],
     "stare_citita": ["diapozitive", "forme_diapozitiv"],
     "descriere": "Un diapozitiv Title Only; Insert › Shapes › Arrow: Right, apoi un clic pe mijlocul diapozitivului (forma de "
                  "mărimea implicită). " + D_DIA + "; " + D_FORME + ".", "lectii": ["vi/m2-l10"],
     "sursa_gest": L + "m2-l10/index.html:151"},
    {"id": "powerpoint-durata-aplica-la-toate", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["A"]}, {"aspect": "Title and Content", "texte": ["B"]},
                               {"aspect": "Title and Content", "texte": ["C"]}], "diapozitiv_activ": 1},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabTransitions", "id_mso": "AnimationTransitionGallery", "element": "Fade"},
              {"gest": "comanda_panglica", "fila": "TabTransitions", "id_mso": "SlideTransitionApplyToAll"}],
     "stare_citita": ["diapozitive", "durata_tranzitie"],
     "descriere": "Trei diapozitive, primul activ; Transitions › Fade (din galerie), apoi Apply To All — durata pe care o "
                  "pune Fade și pe care Apply To All o copiază pe toate. " + D_DIA + "; durata_tranzitie = durata tranziției "
                  "fiecărui diapozitiv, în secunde (SlideShowTransition.Duration, 2 zecimale). Scrierea „0,5” + Enter în caseta "
                  "Duration NU e aici: pe desktopul ascuns caseta n-a primit focusul (nici prin UIA SetFocus, nici prin clicul "
                  "postat) — [NEVERIFICAT], de_verificat.md R11-14.", "lectii": ["vi/m1-l07", "vi/m2-l09"],
     "sursa_gest": L + "m1-l07/index.html:156"},
    {"id": "powerpoint-animatii-move-up", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}], "selectie_forma": [1, 1]},
     "pasi": [{"gest": "comanda_panglica", "fila": "TabAnimations", "id_mso": "AnimationGallery", "element": "Fade"},
              {"gest": "clic", "tinta": "margine_forma:1/2", "real": "com:selecteaza:1/2"},
              {"gest": "comanda_panglica", "fila": "TabAnimations", "id_mso": "AnimationGallery", "element": "Fly In"},
              {"gest": "comanda_panglica", "fila": "TabAnimations", "id_mso": "AnimationCustom", "real": "uia:comutator"},
              {"gest": "clic", "tinta": "fereastra:Move Up", "real": "uia:apasa:Move Up"}],
     "stare_citita": ["ordine_animatii", "diapozitive"],
     "descriere": "Titlul ales ca obiect → Animations › Fade; caseta de subtitlu aleasă (clic pe margine) → Fly In; Animation "
                  "Pane deschis (rândul ales = animația casetei alese, Fly In); Move Up. ordine_animatii = pe diapozitivul "
                  "activ, a câta formă (indicele din Shapes, de la 1) are fiecare animație, în ordinea din Animation Pane "
                  "(TimeLine.MainSequence). " + D_DIA + ".", "lectii": ["vi/m1-l07"], "sursa_gest": L + "m1-l07/index.html:194"},
    {"id": "powerpoint-fundal-aplica-la-toate", "mod": "gest_real",
     "start": {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}, {"aspect": "Title and Content", "texte": ["B"]}],
               "diapozitiv_activ": 1},
     "pasi": [{"gest": "clic_dreapta", "tinta": "diapozitiv", "real": "mouse:clic_dreapta:diapozitiv"},
              {"gest": "clic", "tinta": "meniu:Format Background...", "real": "uia:meniu:Format Background..."},
              {"gest": "clic", "tinta": "fereastra:Solid fill", "real": "uia:alege:Solid fill"},
              {"gest": "clic", "tinta": "fereastra:Color", "real": "uia:culoare_fundal"},
              {"gest": "clic", "tinta": "meniu:Light Blue", "real": "uia:meniu:Light Blue"},
              {"gest": "clic", "tinta": "fereastra:Apply to All", "real": "uia:apasa:Apply to All"}],
     "stare_citita": ["fundal_diapozitive"],
     "descriere": "Două diapozitive, primul activ; clic dreapta pe un loc gol al diapozitivului › Format Background... › Solid "
                  "fill › Color ▾ › Light Blue (Standard Colors) › Apply to All. fundal_diapozitive = pe fiecare diapozitiv "
                  "{tip: solid | gradient | imagine | textura | model | alt, culoare: #RRGGBB (doar la solid)} — umplerea "
                  "fundalului (Slide.Background.Fill).", "lectii": ["vi/m1-l06"], "sursa_gest": L + "m1-l06/index.html:150"},
]
# scenariile vechi rescrise pe drumul real (critic.md, „Verdictul pe cele 4 scenarii”) și rulate acum de acest generator
VECHI_R11 = {
    "powerpoint-diapozitiv-nou-buton": {
        "pasi": [{"gest": "comanda_panglica", "fila": "TabHome", "tinta": "panglica:Home/Slides/New Slide", "real": "uia:nou_sus"}],
        "descriere": "Un diapozitiv Title Slide; clic pe partea de SUS a butonului New Slide (Home › Slides), nu pe săgeata ▾. "
                     "În referință (uia_powerpoint.json › panglica.TabHome) New Slide e un SplitButton cu doi copii: Button "
                     "„New Slide” (sus, 37 px) și MenuItem „More Options” (SlideNewGallery_Dropdown, jos) — ținta canonică a "
                     "părții de sus = panglica:Home/Slides/New Slide. Rescris în runda `acoperire` după runda 11 (critic.md). "
                     + D_DIA + "."},
    "powerpoint-salvare-ca": {
        "mod": "gest_real",
        "pasi": [{"gest": "clic", "tinta": "mso:FileTabButton", "real": "uia:FileTabButton"},
                 {"gest": "clic", "tinta": "backstage:Save As", "real": "uia:nav:Save As"},
                 {"gest": "clic", "tinta": "backstage:Browse", "real": "uia:Browse"},
                 {"gest": "tasteaza", "text": "Vulcanii", "real": "cale_temp"},
                 {"gest": "taste", "taste": "Enter"}],
        "descriere": "Prezentarea nouă cu titlul „Vulcanii”; drumul real: File › Save As › Browse, numele „Vulcanii”, Enter "
                     "(Enter = Save). nume_fisier = numele cu extensia pus de PowerPoint (Presentation.Name după salvare; null "
                     "dacă prezentarea n-a fost salvată). Rescris în runda `acoperire` după runda 11 (critic.md: în PowerPoint "
                     "real Save As din Backstage n-are idMso)."},
    "powerpoint-imagine": {
        "mod": "gest_real",
        "pasi": [{"gest": "comanda_panglica", "fila": "TabInsert", "id_mso": "FlyoutAnchorInsertPictures",
                  "element": "This Device...", "fisier": "vulcan.png", "real": "uia:imagine"}],
        "descriere": "Diapozitivul 1 (Title Slide „Vulcanii”), nimic ales; Insert › Pictures › This Device..., în fereastra "
                     "Insert Picture numele fișierului „vulcan.png”, Enter (Enter = Insert). " + D_DIA + ". Rescris în runda "
                     "`acoperire` după runda 11 (critic.md: PictureInsertFromFile nu e pe ecran; lista Pictures e acum în "
                     "referință, lista.FlyoutAnchorInsertPictures)."},
}


def scrie_scenarii():
    dosar = D / "scenarii" / "powerpoint"
    for s in SCENARII:
        sc = {"id": s["id"], "aplicatie": "powerpoint", "mod": s["mod"], "descriere": s["descriere"] + " (runda `acoperire` "
              "după runda 11, 20.11.2026; rezultatul real: referinte/acoperire_powerpoint_r11.py scenarii)", "start": s["start"],
              "pasi": s["pasi"], "stare_citita": s["stare_citita"], "lectii": s["lectii"], "sursa_gest": s["sursa_gest"],
              "rulat_de": RULAT_DE}
        (dosar / f"{s['id']}.json").write_text(json.dumps(sc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for i, schimb in VECHI_R11.items():
        f = dosar / f"{i}.json"
        sc = json.loads(f.read_text(encoding="utf-8"))
        sc.update(schimb)
        sc["rulat_de"] = RULAT_DE
        f.write_text(json.dumps(sc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"scenarii: {len(SCENARII)} noi, {len(VECHI_R11)} rescrise (rulat_de = {RULAT_DE})")
    return 0


def tip_forma(sh):
    t = int(sh.Type)
    if t == 14:
        return {"fel": "substituent"}
    if t == 1:
        cod = int(sh.AutoShapeType)
        return {"fel": "forma", "forma": FORME_COD.get(cod, f"cod {cod}")}
    return {"fel": {13: "imagine", 17: "caseta_text", 19: "tabel"}.get(t, "alta")}


def text_forma(sh):
    try:
        return str(sh.TextFrame.TextRange.Text) if sh.HasTextFrame and sh.TextFrame.HasText else ""
    except Exception:  # noqa: BLE001
        return ""


def clasa_ppt_r11():
    import win32gui

    class PowerPointR11(RR.PowerPoint):
        @property
        def CHEI_AMPRENTA(self):   # noqa: N802
            return ["diapozitive", "tema", "fundal_diapozitive", "durata_tranzitie"] + \
                (["formatare_text", "culoare_text"] if getattr(self, "forma_citita", None) else [])

        def porneste(self):
            if ppt_ruleaza():
                raise RuntimeError("SĂRIT: POWERPNT.EXE rulează deja")
            shutil.rmtree(self.tmp, ignore_errors=True)
            self.tmp = Path(tempfile.mkdtemp(prefix=MARCAJ))
            super().porneste()
            self.cap = W3.Cap(self.s)
            self.canale_r11, self.dlg_r11, self.noi_r11 = set(), None, []

        # ---- pornirea fiecărui scenariu
        def curata(self):
            a = self.a
            st = straine(a)
            if st:
                raise Straina(f"prezentări străine: {st}")
            self.inchide_ferestre_straine()
            if self.cap.backstage_pagina():
                self.s.iesi_backstage()
            act = str(a.ActivePresentation.Name) if int(a.Presentations.Count) else None
            for p in list(a.Presentations):
                if str(p.Name) != act:
                    p.Saved = -1
                    p.Close()
            if int(a.Presentations.Count) == 0:
                a.Presentations.Add(True).Tags.Add("LHREF", "1")
                time.sleep(1.5)
            self.ferestre()

        def start(self, st):
            self.canale_r11, self.dlg_r11, self.noi_r11, self.dlg_x = set(), None, [], None
            self.forma_citita = st.get("forma_citita")
            self.curata()
            super().start(st)
            self.ferestre()
            self.a.ActiveWindow.ViewType = 9

        def start_pornire(self, st):
            """Ctrl+N: pe prezentarea de la pornire (Presentation1), fără Presentations.Add."""
            self.canale_r11, self.dlg_r11, self.noi_r11 = set(), None, []
            self.forma_citita = None
            p = self.p
            if int(self.a.Presentations.Count) != 1 or not re.fullmatch(r"Presentation1", str(p.Name)) or not a_mea(p):
                raise RuntimeError(f"prezentarea de la pornire nu e Presentation1 a mea: {[str(x.Name) for x in self.a.Presentations]}")
            lay = {str(cl.Name): cl for cl in p.SlideMaster.CustomLayouts}
            while p.Slides.Count:
                p.Slides(1).Delete()
            for i, dz in enumerate(st.get("diapozitive", []), start=1):
                p.Slides.AddSlide(i, lay[dz.get("aspect", "Title Slide")])
            self.ferestre()
            self.baza = {x for x, _, _ in U.ferestre_pid(self.s.proc.pid)}
            self.a.ActiveWindow.Panes(2).Activate()
            time.sleep(0.8)

        # ---- gesturile
        def nou_noi(self, inainte, t=5):
            self.noi_r11 = self.cap.noi(inainte, t)
            return self.noi_r11

        def dialog_uia(self):
            for _ in range(30):
                for x, c, t in self.cap.ferestre():
                    if x in self.baza or c not in ("#32770", "NUIDialog"):
                        continue
                    nod = self.s.norm().nod(U.arbore(U.din_hwnd(x)))
                    texte = [self.s.cur.text(str(n.get("eticheta"))) for n in W3.cauta_noduri(nod, lambda n: n.get("tip") == "Text")
                             if n.get("eticheta")]
                    bt = [b["eticheta"] for b in self.cap.butoane(x)
                          if b["eticheta"] not in ("Închidere", "Close", "Ajutor contextual", "Open")]
                    inter = X7.nume_fereastra_interioara(nod) if c == "NUIDialog" else ""
                    intreb = inter if inter and inter != "Microsoft PowerPoint" else (texte[0] if texte else "")
                    return x, {"titlu": self.s.cur.text(t or ""), "intrebare": intreb, "butoane": bt, "apasat": None}
                time.sleep(0.3)
            return None, None

        def punct_diapozitiv(self, fx, fy):
            w = self.a.ActiveWindow
            w.Panes(2).Activate()
            ps = self.p.PageSetup
            return w.PointsToScreenPixelsX(ps.SlideWidth * fx), w.PointsToScreenPixelsY(ps.SlideHeight * fy)

        def real(self, p):
            r, s = p["real"], self.s
            root = U.din_hwnd(self.hmain)
            if r == "uia:nou_sus":
                self.fila("TabHome")
                el = RR.gaseste_id(U.din_hwnd(self.hmain), "SlideNewGallery")
                ch = el.FindAll(2, U.A.CreatePropertyCondition(U.P_CT, 50000)) if el else None
                bt = ch.GetElement(0) if ch and ch.Length else None
                if bt is None or str(bt.CurrentName) != "New Slide":
                    raise RuntimeError("partea de sus a lui New Slide (Button „New Slide”) negăsită")
                RR.uia_invoke(bt)
                time.sleep(1.5)
                self.canale_r11.add("panglica")
                return "UIA Invoke pe partea de sus a lui New Slide (copilul Button „New Slide” al SplitButton-ului SlideNewGallery)"
            if r == "uia:FileTabButton":
                U.apasa(U.gaseste(root, U.P_AID, "FileTabButton"))
                time.sleep(3.0)
                self.canale_r11.add("panglica")
                return "UIA pe File (FileTabButton)"
            if r.startswith("uia:nav:"):
                nav = U.gaseste(root, U.P_AID, "NavBarMenu")
                it = RR.gaseste_nume(nav, r[8:], (50019, 50007, 50011, 50000)) if nav else None
                if it is None:
                    raise RuntimeError(f"Backstage: „{r[8:]}” nu e în bara din stânga")
                if not U.selecteaza(it):
                    U.apasa(it)
                time.sleep(2.5)
                self.canale_r11.add("panglica")
                return f"UIA pe „{r[8:]}” (Backstage)"
            if r == "uia:Browse":
                it = RR.gaseste_nume(root, "Browse", (50000, 50007, 50011, 50005))
                if it is None:
                    raise RuntimeError("Backstage › Save As: „Browse” negăsit")
                inainte = {x for x, _, _ in self.cap.ferestre()}
                W3.pornit_in_fir(lambda e=it: RR.uia_invoke(e) or RR.uia_legacy(e), 4)
                self.cap.noi(inainte, 10, ("#32770",))
                time.sleep(1.5)
                self.canale_r11.add("panglica")
                return "UIA Invoke pe „Browse” (fereastra Save As)"
            if r == "cale_temp":
                RR.trimite_text(self.hdoc, str(self.tmp / p["text"]))
                self.canale_r11.add("tastare")
                return ("WM_CHAR în File name: numele „" + p["text"] + "” cu dosarul temporar în față (%TEMP%\\…\\" + p["text"] +
                        ") — ca să nu salvez în Documentele omului; numele fișierului rămâne același")
            if r == "uia:imagine":
                shutil.copyfile(SURSA_PNG, self.tmp / p["fisier"])
                self.fila(p["fila"])
                el = RR.gaseste_id(U.din_hwnd(self.hmain), p["id_mso"])
                inainte = {x for x, _, _ in self.cap.ferestre()}
                if not RR.uia_expand(el):
                    W3.pornit_in_fir(lambda e=el: RR.uia_invoke(e), 4)
                noi = self.nou_noi(inainte, 5)
                it = cauta_in(noi, lambda n: n == p["element"], (50011, 50000, 50007))
                if it is None:
                    raise RuntimeError(f"„{p['element']}” nu e în lista Pictures")
                inainte2 = {x for x, _, _ in self.cap.ferestre()}
                W3.pornit_in_fir(lambda e=it: RR.uia_invoke(e) or RR.uia_legacy(e), 4)
                dl = self.cap.noi(inainte2, 10, ("#32770",))
                if not dl:
                    raise RuntimeError("fereastra Insert Picture n-a apărut")
                time.sleep(1.5)
                RR.trimite_text(self.hdoc, str(self.tmp / p["fisier"]))
                try:
                    RR.trimite_taste(self.hdoc, "Enter", 1.0)
                except Exception as e:  # noqa: BLE001
                    if "1400" not in repr(e):
                        raise
                for _ in range(30):
                    time.sleep(0.3)
                    if dl[0][0] not in {x for x, _, _ in self.cap.ferestre()}:
                        break
                time.sleep(1.5)
                self.canale_r11 |= {"panglica", "tastare", "taste"}
                return (f"UIA Expand pe Pictures ({p['id_mso']}), UIA Invoke pe „{p['element']}” (fir separat), fereastra "
                        f"Windows „{s.cur.text(dl[0][2])}” (#32770): WM_CHAR în File name = „{p['fisier']}” cu dosarul "
                        "temporar în față (%TEMP%\\…), Enter (WM_KEYDOWN)")
            if r.startswith("uia:fereastra:"):
                nume = r[len("uia:fereastra:"):]
                x = self.dlg_x
                b = RR.gaseste_nume(U.din_hwnd(x), nume, (50000,)) if x else None
                if b is None:
                    raise RuntimeError(f"butonul „{nume}” nu e în fereastra care întreabă")
                W3.pornit_in_fir(lambda e=b: RR.uia_invoke(e), 5)
                time.sleep(2.0)
                if self.dlg_r11 is not None:
                    self.dlg_r11["apasat"] = nume
                self.canale_r11.add("panglica")
                return f"UIA Invoke pe „{nume}” în fereastra care întreabă (fir separat)"
            if r == "uia:galerie_fara_schimbare":
                rr = self.panglica(dict(p, fara_schimbare=True))
                self.canale_r11.add("panglica")
                return rr + " (PowerPoint așteaptă acum clicul pe diapozitiv)"
            if r == "mouse:diapozitiv":
                x, y = self.punct_diapozitiv(0.5, 0.62)
                h = U.hwnd_la(self.hmain, int(x), int(y))
                RR.trimite_mouse(h, x, y, "clic")
                time.sleep(1.0)
                self.canale_r11.add("mouse")
                return "clic de mouse postat (WM_LBUTTONDOWN/UP) pe diapozitiv, la jumătatea lățimii și 62% din înălțime (sub titlu)"
            if r == "mouse:clic_dreapta:diapozitiv":
                self.a.ActiveWindow.Selection.Unselect()
                x, y = self.punct_diapozitiv(0.97, 0.97)
                _, noi = clic_dreapta_la(self.cap, x, y)
                self.noi_r11 = noi
                self.canale_r11.add("mouse")
                return "clic dreapta de mouse postat (WM_RBUTTONDOWN/UP) într-un colț gol al diapozitivului (97%, 97%)"
            if r.startswith("mouse:mso:"):
                el = RR.gaseste_id(U.din_hwnd(self.hmain), r[10:])
                rc = el.CurrentBoundingRectangle
                x, y = (rc.left + rc.right) // 2, (rc.top + rc.bottom) // 2
                h = U.hwnd_la(self.hmain, x, y)
                RR.trimite_mouse(h, x, y, "clic")
                time.sleep(0.8)
                self.focus_r11 = {"are_focus": bool(el.CurrentHasKeyboardFocus),
                                  "clasa": win32gui.GetClassName(RR.focus_din(self.hmain))}
                if not self.focus_r11["are_focus"]:
                    raise RuntimeError(f"clicul postat pe {r[10:]} n-a dat focusul casetei (focus în "
                                       f"{self.focus_r11['clasa']}): gestul n-a ajuns, rezultatul n-ar fi al elevului")
                self.canale_r11.add("mouse")
                return (f"clic de mouse postat pe {r[10:]} (centrul dreptunghiului UIA) — după clic: focus pe casetă = "
                        f"{self.focus_r11['are_focus']}")
            if r == "focus:text":
                text_in(RR.focus_din(self.hmain), p["text"])
                self.canale_r11.add("tastare")
                return "WM_CHAR literă cu literă în fereastra cu focus a panglicii"
            if r == "focus:taste":
                taste_in(RR.focus_din(self.hmain), p["taste"], 1.0)
                self.canale_r11.add("taste")
                return f"WM_KEYDOWN/UP {p['taste']} în fereastra cu focus a panglicii"
            if r.startswith("com:selecteaza:"):
                n, k = (int(v) for v in r.split(":")[-1].split("/"))
                self.p.Slides(n).Shapes(k).Select()
                time.sleep(0.6)
                self.canale_r11.add("model_obiect")
                return f"caseta {n}/{k} aleasă ca obiect prin COM (Shape.Select) — în locul clicului pe margine"
            if r.startswith("com:miniatura:"):
                n = int(r.split(":")[-1])
                self.a.ActiveWindow.Panes(1).Activate()
                self.p.Slides(n).Select()
                time.sleep(0.8)
                self.canale_r11.add("model_obiect")
                return f"miniatura {n} aleasă prin COM (Panes(1).Activate + Slide.Select) — în locul clicului pe miniatură"
            if r == "uia:comutator":
                self.fila(p["fila"])
                el = RR.gaseste_id(U.din_hwnd(self.hmain), p["id_mso"])
                if not (RR.uia_toggle(el) or RR.uia_invoke(el)):
                    raise RuntimeError(f"{p['id_mso']}: Toggle/Invoke refuzate")
                time.sleep(3.0)
                self.canale_r11.add("panglica")
                return f"UIA Toggle/Invoke pe {p['id_mso']} (panoul se deschide)"
            if r.startswith("uia:apasa:"):
                nume = r[len("uia:apasa:"):]
                b = RR.gaseste_nume(U.din_hwnd(self.hmain), nume, (50000,))
                if b is None:
                    raise RuntimeError(f"butonul „{nume}” negăsit în fereastra PowerPoint")
                activ = bool(b.CurrentIsEnabled)
                W3.pornit_in_fir(lambda e=b: RR.uia_invoke(e), 5)
                time.sleep(1.5)
                self.canale_r11.add("panglica")
                return f"UIA Invoke pe „{nume}” (era {'activ' if activ else 'GRI'})"
            if r.startswith("uia:alege:"):
                nume = r[len("uia:alege:"):]
                b = RR.gaseste_nume(U.din_hwnd(self.hmain), nume, (50013, 50002))
                if b is None:
                    raise RuntimeError(f"„{nume}” negăsit în panou")
                if not (RR.uia_select(b) or RR.uia_invoke(b) or RR.uia_legacy(b)):
                    raise RuntimeError(f"„{nume}”: Select/Invoke refuzate")
                time.sleep(2.0)
                self.canale_r11.add("panglica")
                return f"UIA Select pe „{nume}”"
            if r == "uia:culoare_fundal":
                pe = panou_el(s, "Format Background")
                col = None
                arr = pe.FindAll(4, U.A.CreatePropertyCondition(U.P_CT, 50011)) if pe is not None else None
                for i in range(arr.Length if arr else 0):
                    e = arr.GetElement(i)
                    if str(e.CurrentName or "").startswith("Fill Color"):
                        col = e
                if col is None:
                    raise RuntimeError("Color ▾ (Fill Color) negăsit în Format Background")
                inainte = {x for x, _, _ in self.cap.ferestre()}
                if not RR.uia_expand(col):
                    W3.pornit_in_fir(lambda e=col: RR.uia_invoke(e), 4)
                self.nou_noi(inainte, 5)
                self.canale_r11.add("panglica")
                return f"UIA Expand pe Color ▾ („{s.cur.text(str(col.CurrentName))}”)"
            if r.startswith("uia:meniu:"):
                nume = r[len("uia:meniu:"):]
                it = None
                for _ in range(10):
                    it = cauta_in(self.noi_r11, lambda n: n == nume, (50011, 50000, 50007))
                    if it is not None:
                        break
                    time.sleep(0.4)
                if it is None:
                    raise RuntimeError(f"„{nume}” nu e în lista deschisă")
                inainte = {x for x, _, _ in self.cap.ferestre()}
                W3.pornit_in_fir(lambda e=it: RR.uia_invoke(e) or RR.uia_legacy(e) or U.apasa(e), 4)
                time.sleep(2.5)
                self.noi_r11 = [w for w in self.cap.ferestre() if w[0] not in inainte]
                self.canale_r11.add("panglica")
                return f"UIA Invoke pe „{nume}” în lista deschisă"
            raise RuntimeError(f"pasul real necunoscut: {r}")

        def pas_gest(self, p):
            if p.get("real"):
                return self.real(p)
            self.canale_r11 |= RR.canale_pas("powerpoint", "gest_real", p)
            try:
                rr = super().pas_gest(p)
            except Exception as e:  # noqa: BLE001
                # tasta a închis fereastra care avea focusul (Enter = Save): KEYDOWN a ajuns, KEYUP n-are unde (ca la Excel)
                if p["gest"] == "taste" and "1400" in repr(e):
                    time.sleep(3.0)
                    return f"WM_KEYDOWN {p['taste']} (fereastra cu focus s-a închis la tastă; KEYUP fără destinatar)"
                raise
            if p["gest"] == "taste" and p["taste"] in ("Ctrl+W",):
                self.dlg_x, self.dlg_r11 = self.dialog_uia()
            return rr

        # ---- citirea stării
        def citeste(self, chei):
            baza = [k for k in chei if k in ("diapozitive", "tema", "tranzitie_galerie", "animatie_galerie", "formatare_text",
                                             "nume_fisier", "diapozitiv_activ")]
            rez = super().citeste(baza) if baza else {}
            a = self.a
            n = int(a.Presentations.Count)
            for k in chei:
                if k == "dialog":
                    rez[k] = self.dlg_r11
                elif k == "prezentari_deschise":
                    rez[k] = n
                elif k == "prezentare_activa":
                    rez[k] = str(a.ActivePresentation.Name) if n else None
                elif k == "culoare_text":
                    d, f = self.forma_citita
                    rez[k] = hexrgb(self.p.Slides(d).Shapes(f).TextFrame.TextRange.Font.Color.RGB)
                elif k == "durata_tranzitie":
                    rez[k] = [round(float(sl.SlideShowTransition.Duration), 2) for sl in self.p.Slides]
                elif k == "ordine_animatii":
                    sl = a.ActiveWindow.View.Slide
                    ids = {int(sl.Shapes(i).Id): i for i in range(1, sl.Shapes.Count + 1)}
                    seq = sl.TimeLine.MainSequence
                    rez[k] = [ids.get(int(seq.Item(i).Shape.Id)) for i in range(1, seq.Count + 1)]
                elif k == "fundal_diapozitive":
                    out = []
                    for sl in self.p.Slides:
                        fl = sl.Background.Fill
                        t = {1: "solid", 3: "gradient", 6: "imagine", 4: "textura", 2: "model"}.get(int(fl.Type), "alt")
                        o = {"tip": t}
                        if t == "solid":
                            o["culoare"] = hexrgb(fl.ForeColor.RGB)
                        out.append(o)
                    rez[k] = out
                elif k == "forme_diapozitiv":
                    rez[k] = [[dict(tip_forma(sh), text=text_forma(sh)) for sh in sl.Shapes] for sl in self.p.Slides]
                elif k == "pozitii_forme":
                    rez[k] = [[[round(float(sh.Left)), round(float(sh.Top)), round(float(sh.Width)), round(float(sh.Height))]
                               for sh in sl.Shapes] for sl in self.p.Slides]
            return {k: rez[k] for k in chei}

        def inchide_tot(self):
            """Ferestrele rămase: Cancel / Esc (nimic salvat); Backstage închis; Esc în document."""
            self.cap.inchide_noi(self.baza | {x for x, c, _ in self.cap.ferestre() if c == "PPTFrameClass"})
            try:
                if self.cap.backstage_pagina():
                    self.s.iesi_backstage()
            except Exception:  # noqa: BLE001
                pass
            esc_la(self.hdoc)
            time.sleep(0.5)
    return PowerPointR11


def proba_mouse(r):
    """Canalul „mouse” pe PowerPoint: pozitiv = clicul postat pe literele titlului pune cursorul în text (Selection.Type =
    ppSelectionText); control = același clic într-un colț gol al diapozitivului NU dă text ales."""
    rez = {}
    for poz in (True, False):
        r.start({"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]})
        w = r.a.ActiveWindow
        w.Panes(2).Activate()
        w.Selection.Unselect()
        time.sleep(0.5)
        if poz:
            tr = r.p.Slides(1).Shapes(1).TextFrame.TextRange
            x = w.PointsToScreenPixelsX(tr.BoundLeft + tr.BoundWidth / 2)
            y = w.PointsToScreenPixelsY(tr.BoundTop + tr.BoundHeight / 2)
        else:
            x, y = r.punct_diapozitiv(0.97, 0.97)
        RR.trimite_mouse(U.hwnd_la(r.hmain, int(x), int(y)), x, y, "clic")
        time.sleep(0.8)
        try:
            rez[poz] = int(w.Selection.Type)
        except Exception as e:  # noqa: BLE001
            rez[poz] = f"eroare {e!r}"[:60]
    r.probe["mouse"] = {"pozitiv": rez[True] == 3, "control": rez[False] != 3, "trecut": rez[True] == 3 and rez[False] != 3,
                        "detalii": {"clic pe titlu: Selection.Type (3 = text)": rez[True],
                                    "clic în colțul gol (control)": rez[False]}}
    log(f"  proba mouse: {r.probe['mouse']}")


def clipboard_doar_text():
    """(True, textul) dacă clipboard-ul omului e gol sau are doar text; (False, formatele) altfel. Nu-l schimbă."""
    import win32clipboard as cb
    for _ in range(10):
        try:
            cb.OpenClipboard()
            break
        except Exception:  # noqa: BLE001
            time.sleep(0.2)
    else:
        return False, "clipboard ocupat"
    try:
        f, fs = 0, []
        while True:
            f = cb.EnumClipboardFormats(f)
            if not f:
                break
            fs.append(f)
        if not set(fs) <= {1, 7, 13, 16}:
            return False, fs
        return True, (cb.GetClipboardData(13) if 13 in fs else None)
    finally:
        cb.CloseClipboard()


def clipboard_pune(text):
    import win32clipboard as cb
    for _ in range(10):
        try:
            cb.OpenClipboard()
            break
        except Exception:  # noqa: BLE001
            time.sleep(0.2)
    else:
        return False
    try:
        cb.EmptyClipboard()
        if text is not None:
            cb.SetClipboardData(13, text)
        return True
    finally:
        cb.CloseClipboard()


def ruleaza_unul_r11(r, sc, versiune, pornire=False):
    cum, eroare, stare, extra = [], None, {}, {}
    clip = None
    try:
        if sc["id"] == "powerpoint-ctrl-c-v-caseta":
            ok, clip = clipboard_doar_text()
            if not ok:
                clip = None
                raise RuntimeError(f"NERULAT: clipboard-ul omului are și altceva decât text ({clip}) — nu-l ating")
            extra["clipboard"] = "clipboard-ul omului (doar text) salvat înainte și pus la loc după scenariu"
        if pornire:
            r.start_pornire(sc["start"])
        else:
            r.start(sc["start"])
        for p in sc["pasi"]:
            cum.append(r.pas_gest(p))
            if p["gest"] == "taste" and p["taste"] == "Ctrl+N":
                for _ in range(20):
                    time.sleep(0.5)
                    if int(r.a.Presentations.Count) == 2:
                        break
                if int(r.a.Presentations.Count) == 2:
                    eticheteaza_noua(r.a, {"Presentation1"})
        time.sleep(1.0)
        if getattr(r, "focus_r11", None):
            extra["focus_dupa_clic"] = r.focus_r11
        ram = [(c, r.s.cur.text(t)) for x, c, t in r.cap.ferestre() if x not in r.baza and c in ("#32770", "NUIDialog")]
        if ram:
            extra["ferestre_ramase_dupa_pasi"] = ram
            r.inchide_tot()
        stare = r.citeste(sc["stare_citita"])
    except Straina:
        raise
    except Exception as e:  # noqa: BLE001
        eroare = W3.fara_cale_personala(f"{type(e).__name__}: {e}"[:600])
        stare = {}
        log(traceback.format_exc()[-1200:])
    finally:
        try:
            r.inchide_tot()
        except Exception:  # noqa: BLE001
            pass
        r.focus_r11 = None
        if clip is not None or extra.get("clipboard"):
            extra["clipboard_pus_la_loc"] = clipboard_pune(clip)
    canale = set(r.canale_r11)
    rez = {"id": sc["id"], "stare": stare, "eroare": eroare,
           "cum": W3.fara_cale_personala(
               f"gest_real — instanță NOUĂ powerpoint ({versiune}), desktop ascuns {DESKTOP_SC}, "
               f"{time.strftime('%d.%m.%Y %H:%M')}, referinte/acoperire_powerpoint_r11.py (pe clasele din ruleaza_real.py); "
               "pașii: " + " · ".join(cum) + "; pornirea și citirea stării prin COM; fereastra care întreabă citită prin UI "
               "Automation; fișierele de probă în %TEMP% (dosar unic, șters la final)"),
           "canale": sorted(canale), **extra}
    log(f"  {sc['id']}: {'OK' if eroare is None else 'EROARE ' + eroare[:200]} canale={sorted(canale)} "
        f"stare={json.dumps(stare, ensure_ascii=False)[:300]}")
    return rez


def scenarii_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    if ppt_ruleaza():
        print("SĂRIT: POWERPNT.EXE rulează deja — nu pornesc.")
        return 3
    toate = {}
    for f in sorted((RR.SCEN / "powerpoint").glob("*.json")):
        s = json.loads(f.read_text(encoding="utf-8"))
        if s.get("rulat_de") == RULAT_DE:
            toate[s["id"]] = s
    ordine = [s["id"] for s in SCENARII] + list(VECHI_R11)
    iduri = next((a.split("=", 1)[1].split(",") for a in sys.argv if a.startswith("--id=")), ordine)
    sc = [toate[i] for i in ordine if i in iduri and i in toate]
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    r = clasa_ppt_r11()("powerpoint")
    rez, t0, erori, inchis = [], time.time(), [], {}
    try:
        r.porneste()
        RR.BARIERA[0] = lambda: r.a.Version
        versiune = f"{U.versiune_exe('POWERPNT.EXE')}, build COM {r.s.build}"
        if sc and sc[0]["id"] == "powerpoint-ctrl-n":
            rez.append(ruleaza_unul_r11(r, sc.pop(0), versiune, pornire=True))
        try:
            RR.proba(r)
        except Straina:
            raise
        except Exception:  # noqa: BLE001
            log("proba a căzut:\n" + traceback.format_exc()[-800:])
        try:
            proba_mouse(r)
        except Straina:
            raise
        except Exception:  # noqa: BLE001
            log("proba_mouse a căzut:\n" + traceback.format_exc()[-800:])
        for s in sc:
            if time.time() - t0 > 500:
                erori.append(f"{s['id']}: sărit (sesiunea a trecut de ~8 minute)")
                continue
            rez.append(ruleaza_unul_r11(r, s, versiune))
    except Straina as e:
        erori.append(f"STRĂINĂ: {e} — NU_SE_POATE")
    except Exception:  # noqa: BLE001
        erori.append(traceback.format_exc()[-800:])
        log(traceback.format_exc())
    finally:
        try:
            inchis = inchide_sigur(r.s, erori)
        except Exception:  # noqa: BLE001
            erori.append("închidere: " + traceback.format_exc()[-300:])
        shutil.rmtree(r.tmp, ignore_errors=True)
    RR.REAL.mkdir(parents=True, exist_ok=True)
    for x in rez:
        canale = x["canale"]
        probat = x["eroare"] is None and bool(canale) and all(r.probe.get(c, {}).get("trecut") for c in canale)
        neprob = sorted(c for c in canale if not r.probe.get(c, {}).get("trecut"))
        out = {"id": x["id"], "mod_probat": probat, "stare": x["stare"], "eroare": x["eroare"], "cum": x["cum"],
               "canale": canale, "canale_neprobate": neprob}
        out.update({k: v for k, v in x.items() if k not in out})
        if not probat and x["eroare"] is None:
            out["nota"] = "mod_probat = false: un canal folosit n-a trecut proba în aceeași rulare (vezi canale_neprobate)"
        text = W3.fara_cale_personala(json.dumps(out, ensure_ascii=False, indent=1))
        if re.search(r"c:[\\/]+users[\\/]", text.lower()):
            raise RuntimeError(f"{x['id']}: o cale C:/Users a rămas — nu scriu rezultatul")
        (RR.REAL / f"{x['id']}.json").write_text(text + "\n", encoding="utf-8")
    jurnal = {"generat": time.strftime("%Y-%m-%d %H:%M"), "desktop": DESKTOP_SC, "probe": r.probe,
              "scenarii": [x["id"] for x in rez], "rezultate": [{"id": x["id"], "eroare": x["eroare"]} for x in rez],
              "erori": erori, "erori_sesiune": r.s.erori, "inchidere": inchis, "durata_s": round(time.time() - t0),
              "jurnal": LOG}
    vechi = json.loads(JURNAL_SC.read_text(encoding="utf-8")) if JURNAL_SC.exists() else {"rulari": []}
    vechi.setdefault("rulari", []).append(jurnal)
    JURNAL_SC.write_text(W3.fara_cale_personala(json.dumps(vechi, ensure_ascii=False, indent=1, default=str)), encoding="utf-8")
    print(f"scenarii: {len(rez)} rulate, probe {[(k, v.get('trecut')) for k, v in r.probe.items()]}, erori {erori}, "
          f"{round(time.time() - t0)} s, închidere {inchis}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
