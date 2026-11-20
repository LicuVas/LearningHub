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


def scenarii_intern():
    raise NotImplementedError("scenariile vin în secțiunea următoare")


def scrie_scenarii():
    raise NotImplementedError("scenariile vin în secțiunea următoare")


if __name__ == "__main__":
    sys.exit(main())
