"""ruleaza_real.py — scenariile de comportament rulate în Word / Excel / PowerPoint REALE, invizibil (Etapa 0, R5).

Ce face: citește scenariile din ../scenarii/{word,excel,powerpoint}/*.json, le rulează într-o instanță NOUĂ a aplicației
reale pe un desktop ASCUNS (nimic pe ecranul omului) și scrie starea finală în scenarii_real/<id>.json:
    {"id", "mod_probat": true|false, "stare": {...cheile din stare_citita...}, "eroare": null|"...", "cum": "..."}

Cele două moduri (dovedite pe rezultate cunoscute în probe_mod.md, la fiecare rulare, înaintea scenariilor):
  gest_real    = gestul ajunge la aplicație ca gest, prin coada de mesaje a ferestrei ei:
                 tastare = WM_CHAR; taste = WM_KEYDOWN/WM_KEYUP (TranslateMessage le face caractere, ca la tastatura
                 adevărată), precedate de WM_KEYDOWN-ul lui Ctrl/Shift și cu Ctrl/Shift ținute în starea tastaturii
                 firului aplicației (AttachThreadInput + SetKeyboardState); mouse = WM_LBUTTONDOWN/UP/DBLCLK la punctul calculat al cuvântului/celulei;
                 panglica = UI Automation pe butonul/galeria din panglică (Toggle / Invoke / ExpandCollapse).
                 Pregătirea (textul de pornire, selecția de pornire) și CITIREA stării se fac prin COM.
  model_obiect = pașii se fac prin modelul de obiecte (COM) — dovedește STAREA FINALĂ a unei comenzi, nu răspunsul
                 aplicației la tastă/mouse. Folosit unde gestul ar atinge clipboard-ul omului (Ctrl+C/X/V), unde nu se
                 poate rula invizibil (tragerea pătrățelului de umplere) sau unde fereastra e a sistemului.
mod_probat = true doar dacă proba canalului folosit a trecut în ACEEAȘI rulare (pozitivă + de control) și scenariul a
mers fără eroare; un pas de panglică după care starea nu se schimbă = eroare (gestul n-a ajuns).

Rulare (de pe ecranul obișnuit; se mută singur pe desktopul ascuns):
    python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/ruleaza_real.py
    python .../ruleaza_real.py toate [--id ID ...]        # toate trei aplicațiile (PowerPoint sărit dacă rulează deja)
    python .../ruleaza_real.py verifica                    # verificarea livrabilului; ULTIMA linie = nr. de probleme
Intern (pe desktopul ascuns): python .../ruleaza_real.py word|excel|powerpoint [--id ID ...]

Reguli: instanță NOUĂ (WINWORD /x, EXCEL /x, POWERPNT /B), pe desktopul ascuns „LHScenarii”; refuz pe desktopul vizibil;
PowerPoint sărit dacă POWERPNT.EXE rulează deja; nicio setare Office/Windows schimbată; clipboard-ul omului neatins;
fișierele salvate de scenarii stau într-un dosar temporar șters la final; închid doar PID-ul pornit de mine.
"""
import ctypes
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import traceback
from ctypes import wintypes as wt
from pathlib import Path

AICI = Path(__file__).resolve().parent                    # .../referinte
D = AICI.parent                                           # dosarul lucrării
WT = D.parents[1]                                         # C:/00/Projects/LearningHub_fidel
SCEN = D / "scenarii"
REAL = AICI / "scenarii_real"
PROBE_MD = AICI / "probe_mod.md"
DESKTOP = "LHScenarii"
HIDDEN = Path(r"C:\00\AI_0\tools\hidden_desktop.py")
APPS = ("word", "excel", "powerpoint")
GESTURI = {"tasteaza", "taste", "clic", "dublu_clic", "triplu_clic", "clic_dreapta", "selecteaza", "comanda_panglica",
           "meniu", "trage"}
TOGGLE = {"Bold", "Italic", "Underline", "UnderlineGallery", "AlignLeft", "AlignCenter", "AlignRight",
          "AlignJustify", "BulletsGalleryWord", "NumberingGalleryWord", "BulletsGallery", "NumberingGallery",
          "MergeCenter", "WrapText", "ParagraphMarks"}

sys.path.insert(0, str(AICI))
U = None  # dump_uia_office (sesiunea pe desktop ascuns, UIA, COM din fereastră) — încărcat doar când rulează aplicația

u32 = ctypes.WinDLL("user32", use_last_error=True)
k32 = ctypes.windll.kernel32
WM_KEYDOWN, WM_KEYUP, WM_CHAR = 0x0100, 0x0101, 0x0102
WM_MOUSEMOVE, WM_LBD, WM_LBU, WM_LBDBL = 0x0200, 0x0201, 0x0202, 0x0203
VK = {"Enter": 0x0D, "Tab": 0x09, "Esc": 0x1B, "Backspace": 0x08, "Delete": 0x2E, "Left": 0x25, "Up": 0x26,
      "Right": 0x27, "Down": 0x28, "Home": 0x24, "End": 0x23, "F2": 0x71, "F4": 0x73, "F5": 0x74, "F12": 0x7B,
      "Space": 0x20, "PageDown": 0x22, "PageUp": 0x21}
EXTINS = {0x2E, 0x25, 0x26, 0x27, 0x28, 0x24, 0x23, 0x22, 0x21}


class GUITHREADINFO(ctypes.Structure):
    _fields_ = [("cbSize", wt.DWORD), ("flags", wt.DWORD), ("hwndActive", wt.HWND), ("hwndFocus", wt.HWND),
                ("hwndCapture", wt.HWND), ("hwndMenuOwner", wt.HWND), ("hwndMoveSize", wt.HWND),
                ("hwndCaret", wt.HWND), ("rcCaret", wt.RECT)]


BARIERA = [None]   # un apel COM ieftin în aplicație: ajunge în coada ei DUPĂ mesajele postate → „s-au procesat”


def bariera():
    """Așteaptă ca aplicația să fi procesat tot ce i-am postat (apelul COM intră în aceeași coadă, după ele).
    Fără ea, starea Ctrl/Shift se putea pune la loc înainte ca aplicația să citească tasta (văzut: primul Shift+→)."""
    f = BARIERA[0]
    if f is None:
        time.sleep(0.5)
        return
    for _ in range(3):
        try:
            f()
            return
        except Exception:  # noqa: BLE001  (aplicația ocupată / în modul de editare: tot după mesajele mele)
            time.sleep(0.3)


def log(m):
    print(m, flush=True)


# =============================================================================================== canalele gest_real
def focus_din(h):
    """Fereastra cu focus a firului care deține h (unde ar ajunge tastatura adevărată); altfel h."""
    import win32process
    tid, _ = win32process.GetWindowThreadProcessId(h)
    g = GUITHREADINFO()
    g.cbSize = ctypes.sizeof(g)
    if u32.GetGUIThreadInfo(tid, ctypes.byref(g)) and g.hwndFocus:
        return g.hwndFocus
    return h


class StareTaste:
    """Ține Ctrl/Shift „apăsate” în starea tastaturii firului aplicației (doar a lui, nu global) cât trimit un gest."""

    def __init__(self, h, mods):
        import win32process
        self.tid, _ = win32process.GetWindowThreadProcessId(h)
        self.mods = mods

    def __enter__(self):
        self.me = k32.GetCurrentThreadId()
        self.atasat = bool(u32.AttachThreadInput(self.me, self.tid, True))
        st = (ctypes.c_ubyte * 256)()
        u32.GetKeyboardState(st)
        self.vechi = bytes(st)
        for m in self.mods:
            for vk in {"Ctrl": (0x11, 0xA2), "Shift": (0x10, 0xA0)}[m]:
                st[vk] = 0x80
        u32.SetKeyboardState(st)
        return self

    def __exit__(self, *a):
        u32.SetKeyboardState((ctypes.c_ubyte * 256).from_buffer_copy(self.vechi))
        if self.atasat:
            u32.AttachThreadInput(self.me, self.tid, False)


def lparam_tasta(vk, sus=False):
    sc = u32.MapVirtualKeyW(vk, 0) & 0xFF
    lp = 1 | (sc << 16) | ((1 << 24) if vk in EXTINS else 0)
    if sus:
        lp |= (1 << 30) | (1 << 31)
    return lp


def parse_taste(combo):
    parti = combo.split("+")
    mods = [p for p in parti[:-1] if p in ("Ctrl", "Shift")]
    tasta = parti[-1]
    if tasta in VK:
        vk = VK[tasta]
    elif len(tasta) == 1 and tasta.isalnum():
        vk = ord(tasta.upper())
    else:
        raise ValueError(f"tastă necunoscută: {combo}")
    return mods, vk


def tinta_tastatura(h):
    """Unde ar ajunge tastatura: fereastra cu focus a aplicației; dacă focusul a rămas pe panglică (după un gest UIA),
    fereastra documentului — un clic de mouse pe panglică nu ia tastatura documentului în aplicația reală."""
    import win32gui
    t = focus_din(h)
    try:
        cls = win32gui.GetClassName(t)
    except Exception:  # noqa: BLE001
        cls = ""
    return h if (cls.startswith("NetUI") or cls == "Net UI Tool Window") else t


def trimite_taste(h, combo, pauza=0.6):
    import win32gui
    mods, vk = parse_taste(combo)
    tinta = tinta_tastatura(h)
    vk_mod = [{"Ctrl": 0x11, "Shift": 0x10}[m] for m in mods]
    with StareTaste(tinta, mods):
        for vm in vk_mod:     # ca tastatura adevărată: întâi Ctrl/Shift apăsate (Word ține „ancora” selecției de la
            win32gui.PostMessage(tinta, WM_KEYDOWN, vm, lparam_tasta(vm))   # apăsarea lui Shift), apoi tasta
        win32gui.PostMessage(tinta, WM_KEYDOWN, vk, lparam_tasta(vk))
        time.sleep(0.25)
        win32gui.PostMessage(tinta, WM_KEYUP, vk, lparam_tasta(vk, True))
        for vm in reversed(vk_mod):
            win32gui.PostMessage(tinta, WM_KEYUP, vm, lparam_tasta(vm, True))
        time.sleep(0.15)
        bariera()
        time.sleep(pauza)
    return tinta


def trimite_text(h, text, pauza=0.04):
    """Tastare literă cu literă: un WM_CHAR pe semn; '\n' = tasta Enter."""
    import win32gui
    tinta = tinta_tastatura(h)
    for ch in text:
        if ch == "\n":
            trimite_taste(h, "Enter", 0.15)
            continue
        win32gui.PostMessage(tinta, WM_CHAR, ord(ch), 1)
        time.sleep(pauza)
    time.sleep(0.3)
    bariera()
    time.sleep(0.4)
    return tinta


def trimite_mouse(h, sx, sy, fel, mods=()):
    import win32gui
    cx, cy = win32gui.ScreenToClient(h, (int(sx), int(sy)))
    lp = ((cy & 0xFFFF) << 16) | (cx & 0xFFFF)
    mk = (0x4 if "Shift" in mods else 0) | (0x8 if "Ctrl" in mods else 0)
    P = win32gui.PostMessage
    vk_mod = [{"Ctrl": 0x11, "Shift": 0x10}[m] for m in mods]
    with StareTaste(h, mods):
        for vm in vk_mod:
            P(h, WM_KEYDOWN, vm, lparam_tasta(vm))
        P(h, WM_MOUSEMOVE, mk, lp)
        time.sleep(0.1)
        P(h, WM_LBD, 1 | mk, lp)
        P(h, WM_LBU, mk, lp)
        if fel in ("dublu_clic", "triplu_clic"):
            P(h, WM_LBDBL, 1 | mk, lp)
            P(h, WM_LBU, mk, lp)
        if fel == "triplu_clic":
            P(h, WM_LBD, 1 | mk, lp)
            P(h, WM_LBU, mk, lp)
        for vm in reversed(vk_mod):
            P(h, WM_KEYUP, vm, lparam_tasta(vm, True))
        time.sleep(0.3)
        bariera()
        time.sleep(0.6)


# =============================================================================================== UI Automation
def uia_pattern(el, pid, itf):
    try:
        p = el.GetCurrentPattern(pid)
        return p.QueryInterface(itf) if p else None
    except Exception:  # noqa: BLE001
        return None


def uia_toggle(el):
    from comtypes.gen.UIAutomationClient import IUIAutomationTogglePattern
    p = uia_pattern(el, 10015, IUIAutomationTogglePattern)
    if p is None:
        return False
    p.Toggle()
    return True


def uia_invoke(el):
    p = uia_pattern(el, 10000, U.IInvoke)
    if p is None:
        return False
    p.Invoke()
    return True


def uia_legacy(el):
    p = uia_pattern(el, 10018, U.ILegacy)
    if p is None:
        return False
    p.DoDefaultAction()
    return True


def uia_select(el):
    p = uia_pattern(el, 10010, U.ISelItem)
    if p is None:
        return False
    p.Select()
    return True


def uia_expand(el):
    from comtypes.gen.UIAutomationClient import IUIAutomationExpandCollapsePattern
    p = uia_pattern(el, 10005, IUIAutomationExpandCollapsePattern)
    if p is None:
        return False
    p.Expand()
    return True


def uia_collapse(el):
    from comtypes.gen.UIAutomationClient import IUIAutomationExpandCollapsePattern
    try:
        p = uia_pattern(el, 10005, IUIAutomationExpandCollapsePattern)
        if p is not None:
            p.Collapse()
    except Exception:  # noqa: BLE001
        pass


def gaseste_nume(radacina, nume, tipuri=(50007, 50011, 50000, 50031)):
    """Primul descendent cu numele dat și unul din tipurile date (ListItem, MenuItem, Button, SplitButton)."""
    A = U.A
    cond = A.CreateAndCondition(A.CreatePropertyCondition(U.P_NAME, nume),
                                A.CreateOrConditionFromArray([A.CreatePropertyCondition(U.P_CT, t) for t in tipuri]))
    try:
        el = radacina.FindFirst(4, cond)
        return el if el else None          # comtypes întoarce un pointer NULL, nu None
    except Exception:  # noqa: BLE001
        return None


def gaseste_id(radacina, aid):
    el = U.gaseste(radacina, U.P_AID, aid)
    return el if el else None


# =============================================================================================== sesiunea + adaptoare
class Rulare:
    """Aplicația reală pornită pe desktopul ascuns + citirea/scrierea stării prin COM."""

    def __init__(self, app):
        self.app = app
        self.s = U.Sesiune(app)
        self.tmp = Path(tempfile.mkdtemp(prefix="lh_scenarii_"))
        self.probe = {}
        self.clip = None          # „clipboard-ul” modelului (doar în model_obiect; clipboard-ul omului nu e atins)

    # ---- pornire / închidere
    def porneste(self):
        self.s.porneste()
        self.a = self.s.appcom
        time.sleep(1)
        self.baza = {x for x, _, _ in U.ferestre_pid(self.s.proc.pid)}
        a = self.a
        BARIERA[0] = (lambda: a.Version) if self.app != "word" else (lambda: a.Selection.Start)
        if self.app == "excel":
            self.a.DisplayAlerts = False
        if self.app == "word":
            self.a.DisplayAlerts = 0
            d = self.a.ActiveDocument
            ps = d.PageSetup
            self.pagina0 = (int(ps.Orientation), float(ps.TopMargin), float(ps.BottomMargin), float(ps.LeftMargin),
                            float(ps.RightMargin))
        if self.app == "powerpoint":
            self.a.DisplayAlerts = 1   # ppAlertsNone
            self.ferestre()

    def inchide(self):
        try:
            self.s.inchide()
        finally:
            shutil.rmtree(self.tmp, ignore_errors=True)

    @property
    def hmain(self):
        return self.s.hmain

    @property
    def hdoc(self):
        return self.s.hdoc

    def inchide_ferestre_straine(self):
        """Dialoguri/meniuri rămase deschise de un scenariu (ferestrele PID-ului meu care nu erau la pornire):
        Esc în ele și în document; dialogurile primesc și WM_CLOSE."""
        import win32gui
        baza = getattr(self, "baza", set())
        for _ in range(5):
            alte = [(x, c, t) for x, c, t in U.ferestre_pid(self.s.proc.pid)
                    if x not in baza and x != self.hmain and c not in ("OpusApp", "XLMAIN", "PPTFrameClass",
                                                                       "UAC_InputIndicatorOverlayWnd",
                                                                       "UAC Input Indicator")]
            if not alte:
                return
            for x, c, t in alte:
                win32gui.PostMessage(x, WM_KEYDOWN, 0x1B, 0)
                win32gui.PostMessage(x, WM_KEYUP, 0x1B, 0xC0000001)
                if c in ("#32770", "bosa_sdm_msword", "bosa_sdm_XL9", "NUIDialog"):
                    win32gui.PostMessage(x, 0x0010, 0, 0)
            if self.hdoc:
                win32gui.PostMessage(self.hdoc, WM_KEYDOWN, 0x1B, 0)
                win32gui.PostMessage(self.hdoc, WM_KEYUP, 0x1B, 0xC0000001)
            time.sleep(1)

    def fereastra_mesaj(self):
        """Un mesaj/dialog al aplicației apărut în scenariu (ex. eroarea de formulă din Excel): titlu, texte, butoane."""
        A = U.A
        baza = getattr(self, "baza", set())
        for x, c, t in U.ferestre_pid(self.s.proc.pid):
            if x in baza or c not in ("#32770", "NUIDialog", "bosa_sdm_XL9", "bosa_sdm_msword"):
                continue
            rez = {"titlu": self.s.cur.text(t), "texte": [], "butoane": []}
            el = U.din_hwnd(x)
            for ct, cheie in ((50020, "texte"), (50000, "butoane")):
                try:
                    arr = el.FindAll(4, A.CreatePropertyCondition(U.P_CT, ct))
                    for i in range(arr.Length if arr else 0):
                        n = arr.GetElement(i).CurrentName
                        if n and n not in rez[cheie]:
                            rez[cheie].append(self.s.cur.text(n))
                except Exception:  # noqa: BLE001
                    pass
            if not rez["titlu"] and not rez["texte"]:
                continue     # butonul plutitor „Quick Analysis” (Excel, după o selecție) nu e un mesaj
            return rez
        # un dialog desenat ÎN fereastra aplicației (fără fereastră Win32 proprie)
        try:
            arr = U.din_hwnd(self.hmain).FindAll(4, A.CreatePropertyCondition(U.P_CT, 50032))
            for i in range(arr.Length if arr else 0):
                el = arr.GetElement(i)
                rez = {"titlu": self.s.cur.text(el.CurrentName or ""), "texte": [], "butoane": []}
                for ct, cheie in ((50020, "texte"), (50000, "butoane")):
                    a2 = el.FindAll(4, A.CreatePropertyCondition(U.P_CT, ct))
                    for j in range(a2.Length if a2 else 0):
                        n = a2.GetElement(j).CurrentName
                        if n and n not in rez[cheie]:
                            rez[cheie].append(self.s.cur.text(n))
                if rez["texte"]:
                    rez["in_fereastra_aplicatiei"] = True
                    return rez
        except Exception:  # noqa: BLE001
            pass
        return None

    def ocupata(self):
        """Aplicația refuză apelurile COM (ex. Excel a rămas în modul de editare a celulei)."""
        try:
            self.a.Version
            return False
        except Exception as e:  # noqa: BLE001
            return "-2147417846" in repr(e) or "-2147418111" in repr(e)

    # ---- comenzile panglicii (gest_real, UI Automation)
    def fila(self, tab_id):
        el = gaseste_id(U.din_hwnd(self.hmain), tab_id)
        if el is None:
            raise RuntimeError(f"fila {tab_id} nu e în panglică")
        U.selecteaza(el)
        time.sleep(1.0)

    def panglica(self, pas):
        """comanda_panglica: {fila, id_mso, element?}. Întoarce metoda UIA care a schimbat starea."""
        import win32gui
        if pas.get("fila"):
            self.fila(pas["fila"])
        root = U.din_hwnd(self.hmain)
        el = gaseste_id(root, pas["id_mso"])
        if el is None:
            raise RuntimeError(f"controlul {pas['id_mso']} nu e în panglică")
        inainte = self.amprenta()
        elem = pas.get("element")
        if not elem:
            metode = (("Toggle", uia_toggle), ("Invoke", uia_invoke)) if pas["id_mso"] in TOGGLE else \
                (("Invoke", uia_invoke), ("Toggle", uia_toggle))
            for nume, f in metode + (("LegacyDefaultAction", uia_legacy),):
                try:
                    if not f(el):
                        continue
                except Exception as e:  # noqa: BLE001
                    log(f"    {pas['id_mso']} {nume}: {e!r}")
                    continue
                time.sleep(1.2)
                if pas.get("fara_schimbare") or self.amprenta() != inainte:
                    return f"UIA {nume} pe {pas['id_mso']}"
            raise RuntimeError(f"comanda {pas['id_mso']}: starea nu s-a schimbat după Toggle/Invoke/DefaultAction")
        # element dintr-o galerie: întâi în panglică (galeria deschisă pe filă), altfel în lista derulantă
        it = gaseste_nume(el, elem)
        deschis = None
        if it is None:
            vechi = {x for x, _, _ in U.ferestre_pid(self.s.proc.pid)}
            if not uia_expand(el):
                uia_invoke(el)
            for _ in range(20):
                time.sleep(0.25)
                noi = [x for x, c, _ in U.ferestre_pid(self.s.proc.pid) if x not in vechi]
                if noi:
                    break
            time.sleep(0.8)
            for _ in range(24):                     # lista se umple după ce apare fereastra
                it = gaseste_nume(el, elem)         # elementele listei apar sub controlul din panglică
                if it is None:
                    for x, c, _ in U.ferestre_pid(self.s.proc.pid):
                        if x in vechi:
                            continue
                        for hc in U.copii_clasa(x, ["NetUIHWND"]) + [x]:
                            it = gaseste_nume(U.din_hwnd(hc), elem)
                            if it is not None:
                                break
                        if it is not None:
                            break
                if it is not None:
                    deschis = True
                    break
                time.sleep(0.25)
            if it is None:
                it = gaseste_nume(U.din_hwnd(self.hmain), elem)
        if it is None:
            uia_collapse(el)
            self.inchide_ferestre_straine()
            raise RuntimeError(f"elementul „{elem}” nu apare în {pas['id_mso']}")
        for nume, f in (("Invoke", uia_invoke), ("SelectionItem.Select", uia_select), ("LegacyDefaultAction", uia_legacy)):
            try:
                if not f(it):
                    continue
            except Exception as e:  # noqa: BLE001
                log(f"    {elem} {nume}: {e!r}")
                continue
            time.sleep(1.5)
            if pas.get("fara_schimbare") or self.amprenta() != inainte:
                return f"UIA {nume} pe „{elem}” din {pas['id_mso']}" + (" (lista derulantă)" if deschis else "")
        uia_collapse(el)
        self.inchide_ferestre_straine()
        raise RuntimeError(f"„{elem}” din {pas['id_mso']}: starea nu s-a schimbat")

    # ---- interfața comună (suprascrisă pe aplicație)
    def amprenta(self):
        try:
            return json.dumps(self.citeste(self.CHEI_AMPRENTA), sort_keys=True, ensure_ascii=False)
        except Exception as e:  # noqa: BLE001  (ex. Excel în modul de editare: COM respins = s-a întâmplat ceva)
            return f"exceptie:{e!r}:{time.time()}"


# ----------------------------------------------------------------------------------------------- Word
WD_ALINIERE = {0: "stanga", 1: "centru", 2: "dreapta", 3: "stanga-dreapta"}


class Word(Rulare):
    CHEI_AMPRENTA = ["text", "formatare_pe_caractere", "aliniere_paragrafe", "liste", "stil_paragrafe", "pagina",
                     "tabele", "imagini"]

    @property
    def d(self):
        return self.a.ActiveDocument

    def start(self, st):
        d = self.d
        self.inchide_ferestre_straine()
        for t in list(d.Tables):
            t.Delete()
        for s in list(d.InlineShapes):
            s.Delete()
        for s in list(d.Shapes):
            s.Delete()
        d.Content.Text = "\r".join(st.get("paragrafe", [""]))
        c = d.Content
        c.Style = -1                      # wdStyleNormal
        c.Font.Reset()
        c.ParagraphFormat.Reset()
        c.ListFormat.RemoveNumbers()
        ps = d.PageSetup
        o, t, b, l, r = self.pagina0
        ps.Orientation = o
        ps.TopMargin, ps.BottomMargin, ps.LeftMargin, ps.RightMargin = t, b, l, r
        for f in st.get("formatare", []):
            rg = d.Range(f["de_la"], f["pana_la"])
            for k, attr in (("bold", "Bold"), ("italic", "Italic"), ("underline", "Underline")):
                if k in f:
                    setattr(rg.Font, attr, 1 if f[k] else 0)
            if "marime" in f:
                rg.Font.Size = f["marime"]
        for i, al in enumerate(st.get("aliniere", []), start=1):
            inv = {v: k for k, v in WD_ALINIERE.items()}
            d.Paragraphs(i).Alignment = inv[al]
        if st.get("tabel"):
            tb = st["tabel"]
            rg = d.Range(d.Content.End - 1, d.Content.End - 1)
            t = d.Tables.Add(rg, tb["randuri"], tb["coloane"])
            for i, rand in enumerate(tb.get("celule", []), start=1):
                for j, v in enumerate(rand, start=1):
                    t.Cell(i, j).Range.Text = v
        if "selectie" in st:
            d.Range(st["selectie"]["de_la"], st["selectie"]["pana_la"]).Select()
        elif "cursor" in st:
            d.Range(st["cursor"], st["cursor"]).Select()
        elif st.get("cursor_in_celula"):
            r_, c_ = st["cursor_in_celula"]
            cel = d.Tables(1).Cell(r_, c_).Range
            d.Range(cel.End - 1, cel.End - 1).Select()
        else:
            d.Range(d.Content.End - 1, d.Content.End - 1).Select()
        d.UndoClear()
        time.sleep(0.4)

    # ---- ținte
    def domeniu(self, pas):
        d = self.d
        if "cuvant" in pas:
            text = d.Content.Text
            idx = -1
            for _ in range(pas.get("aparitia", 1)):
                idx = text.find(pas["cuvant"], idx + 1)
            if idx < 0:
                raise RuntimeError(f"cuvântul „{pas['cuvant']}” nu e în document")
            return d.Range(idx, idx + len(pas["cuvant"]))
        if "paragraf" in pas:
            return d.Paragraphs(pas["paragraf"]).Range
        if "de_la" in pas:
            return d.Range(pas["de_la"], pas["pana_la"])
        if "celula" in pas:
            r_, c_ = pas["celula"]
            return d.Tables(1).Cell(r_, c_).Range
        raise RuntimeError(f"pas fără țintă: {pas}")

    def punct(self, rng, unde="mijloc"):
        w = self.a.ActiveWindow
        o = w._oleobj_
        dispid = o.GetIDsOfNames("GetPoint")
        x, y, l, h = o.InvokeTypes(dispid, 0, 1, (24, 0), ((16387, 2), (16387, 2), (16387, 2), (16387, 2), (9, 1)),
                                   0, 0, 0, 0, rng._oleobj_)
        if unde == "mijloc":
            return x + l // 2, y + h // 2
        return x + 1, y + h // 2

    def pas_gest(self, p):
        g = p["gest"]
        if g == "tasteaza":
            if p.get("in") == "dialog_salvare":
                return self.dialog_salvare(p)
            trimite_text(self.hdoc, p["text"])
            return "WM_CHAR literă cu literă"
        if g == "taste":
            for _ in range(p.get("repeta", 1)):
                trimite_taste(self.hdoc, p["taste"])
            if p["taste"] == "F12" or p["taste"] == "Ctrl+S":
                return self.asteapta_dialog()
            return f"WM_KEYDOWN/UP {p['taste']}" + (f" ×{p['repeta']}" if p.get("repeta", 1) > 1 else "")
        if g in ("clic", "dublu_clic", "triplu_clic"):
            if p.get("tinta") == "dialog_salvare:Save":
                return self.salveaza_din_dialog()
            x, y = self.punct(self.domeniu(p))
            trimite_mouse(self.hdoc, x, y, g, p.get("modificatori", []))
            return f"mouse postat ({g})"
        if g == "selecteaza":
            self.domeniu(p).Select()
            return "selecția de pornire prin COM"
        if g == "comanda_panglica":
            return self.panglica(p)
        raise RuntimeError(f"gestul {g} nu se poate rula ca gest_real în Word")

    def pas_model(self, p):
        d, sel = self.d, self.a.Selection
        g = p["gest"]
        if g == "selecteaza":
            self.domeniu(p).Select()
            return "Range.Select"
        if g == "clic":
            r = self.domeniu(p)
            d.Range(r.Start, r.Start).Select()
            return "Range.Select (cursor)"
        if g == "tasteaza":
            for i, bucata in enumerate(p["text"].split("\n")):
                if i:
                    sel.TypeParagraph()
                if bucata:
                    sel.TypeText(bucata)
            return "Selection.TypeText"
        if g == "taste":
            t = p["taste"]
            if t in ("Ctrl+C", "Ctrl+X"):
                self.clip = (int(sel.Start), int(sel.End), t == "Ctrl+X")
                return f"{t}: domeniul ținut în model (fără clipboard)"
            if t == "Ctrl+V":
                a0, b0, taie = self.clip
                src = d.Range(a0, b0)
                dest = sel.Range
                pos = int(dest.Start)
                dest.FormattedText = src.FormattedText
                n = b0 - a0
                if taie:
                    if a0 >= pos:
                        d.Range(a0 + n, b0 + n).Delete()
                    else:
                        d.Range(a0, b0).Delete()
                        pos -= n
                d.Range(pos + n, pos + n).Select()
                return "Ctrl+V: Range.FormattedText (+ ștergerea sursei la Ctrl+X), fără clipboard"
            raise RuntimeError(f"tasta {t} n-are echivalent în model")
        if g == "comanda_panglica":
            m = p["id_mso"]
            if m == "TableInsertGallery":
                d.Tables.Add(sel.Range, p["randuri"], p["coloane"])
                return f"Tables.Add({p['randuri']}, {p['coloane']})"
            if m == "PictureInsertFromFile":
                d.InlineShapes.AddPicture(str(WT / p["fisier"]), False, True, sel.Range)
                return "InlineShapes.AddPicture"
            if m == "FileSaveAs":
                d.SaveAs2(str(self.tmp / p["nume"]))
                return "Document.SaveAs2 (nume fără extensie, tipul implicit)"
        raise RuntimeError(f"pasul {p} n-are echivalent în model")

    # ---- fereastra de salvare (F12 / Ctrl+S) — gest_real pe fereastra Windows, pe desktopul ascuns
    def asteapta_dialog(self):
        for _ in range(40):
            time.sleep(0.25)
            for x, c, t in U.ferestre_pid(self.s.proc.pid):
                if c == "#32770":
                    self.dlg = x
                    el = U.din_hwnd(x)
                    nume = gaseste_id(el, "1001")
                    tip = gaseste_id(el, "FileTypeControlHost")
                    self.dlg_info = {"titlu": t, "nume_propus": self._val(nume), "tip_propus": self._val(tip)}
                    return "WM_KEYDOWN/UP + fereastra Windows de salvare"
        self.dlg = None
        self.dlg_info = None
        return "WM_KEYDOWN/UP (nicio fereastră de salvare în 10 s)"

    @staticmethod
    def _val(el):
        if el is None:
            return None
        try:
            v = el.GetCurrentPropertyValue(30045)
            if v:
                return str(v)
            return str(el.CurrentName)
        except Exception:  # noqa: BLE001
            return None

    def dialog_salvare(self, p):
        """Tastează numele în caseta File name; numele se pune în dosarul temporar (nu în Documentele omului)."""
        import win32gui
        if not getattr(self, "dlg", None):
            raise RuntimeError("fereastra de salvare nu e deschisă")
        el = gaseste_id(U.din_hwnd(self.dlg), "1001")
        if el is None:
            raise RuntimeError("caseta File name nu e în fereastra de salvare")
        h = el.CurrentNativeWindowHandle
        win32gui.PostMessage(h, 0x00B1, 0, -1)       # EM_SETSEL: tot textul propus (cum îl găsește elevul, selectat)
        time.sleep(0.2)
        cale = str(self.tmp / p["text"])
        for ch in cale:
            win32gui.PostMessage(h, WM_CHAR, ord(ch), 1)
            time.sleep(0.01)
        time.sleep(0.5)
        return "WM_CHAR în caseta File name (cu dosarul temporar în față)"

    def salveaza_din_dialog(self):
        A = U.A
        try:
            b = U.din_hwnd(self.dlg).FindFirst(4, A.CreateAndCondition(A.CreatePropertyCondition(U.P_AID, "1"),
                                                                       A.CreatePropertyCondition(U.P_CT, 50000)))
            b = b if b else None
        except Exception:  # noqa: BLE001
            b = None
        if b is None or not uia_invoke(b):
            raise RuntimeError("butonul Save nu a putut fi apăsat")
        for _ in range(40):
            time.sleep(0.25)
            if not any(x == self.dlg for x, _, _ in U.ferestre_pid(self.s.proc.pid)):
                break
        time.sleep(1.0)
        self.dlg = None
        return "UIA Invoke pe Save"

    # ---- citirea stării
    def citeste(self, chei):
        d = self.d
        rez = {}
        pars = list(d.Paragraphs)
        for k in chei:
            if k == "text":
                rez[k] = [p.Range.Text.rstrip("\r\x07") for p in pars if p.Range.Tables.Count == 0]
            elif k == "formatare_pe_caractere":
                runs = []
                for ch in d.Characters:
                    t = ch.Text
                    f = ch.Font
                    a = {"bold": bool(f.Bold), "italic": bool(f.Italic), "underline": int(f.Underline) != 0,
                         "marime": float(f.Size)}
                    if t in ("\r", "\x07"):
                        continue
                    if runs and {k2: v for k2, v in runs[-1].items() if k2 != "text"} == a:
                        runs[-1]["text"] += t
                    else:
                        runs.append({"text": t, **a})
                rez[k] = runs
            elif k == "aliniere_paragrafe":
                rez[k] = [WD_ALINIERE.get(int(p.Alignment), str(p.Alignment)) for p in pars]
            elif k == "liste":
                out = []
                for p in pars:
                    lt = int(p.Range.ListFormat.ListType)
                    sim = p.Range.ListFormat.ListString or None
                    o = {"tip": {0: None, 2: "marcatori", 3: "numerotare"}.get(lt, f"tip{lt}"), "simbol": sim}
                    if sim and any(0xE000 <= ord(c) <= 0xF8FF for c in sim):
                        o["simbol_cod"] = " ".join(f"U+{ord(c):04X}" for c in sim)   # simbol din fontul Symbol
                    out.append(o)
                rez[k] = out
            elif k == "stil_paragrafe":
                rez[k] = [str(p.Style.NameLocal) for p in pars]
            elif k == "selectie":
                s = self.a.Selection
                rez[k] = {"de_la": int(s.Start), "pana_la": int(s.End), "text": s.Text if s.End > s.Start else ""}
            elif k == "pagina":
                ps = d.PageSetup
                cm = lambda v: round(float(v) / 72 * 2.54, 2)   # noqa: E731
                rez[k] = {"orientare": "vedere" if int(ps.Orientation) == 1 else "portret",
                          "latime_cm": cm(ps.PageWidth), "inaltime_cm": cm(ps.PageHeight),
                          "margini_cm": {"sus": cm(ps.TopMargin), "jos": cm(ps.BottomMargin),
                                         "stanga": cm(ps.LeftMargin), "dreapta": cm(ps.RightMargin)}}
            elif k == "tabele":
                out = []
                for t in d.Tables:
                    cel = [[t.Cell(i, j).Range.Text.rstrip("\r\x07") for j in range(1, t.Columns.Count + 1)]
                           for i in range(1, t.Rows.Count + 1)]
                    out.append({"randuri": int(t.Rows.Count), "coloane": int(t.Columns.Count), "celule": cel})
                rez[k] = out
            elif k == "imagini":
                rez[k] = {"in_linie": int(d.InlineShapes.Count), "flotante": int(d.Shapes.Count)}
            elif k == "nume_fisier":
                rez[k] = str(d.Name) if d.Path else None
            elif k == "dialog_salvare":
                rez[k] = getattr(self, "dlg_info_scenariu", None)
            elif k == "cuvinte":
                rez[k] = int(d.ComputeStatistics(0))     # wdStatisticWords, ca în bara de stare
            else:
                raise RuntimeError(f"cheie de stare necunoscută pentru Word: {k}")
        return rez


# ----------------------------------------------------------------------------------------------- Excel
XL_ALINIERE = {1: "general", -4131: "stanga", -4108: "centru", -4152: "dreapta", 7: "centru_pe_selectie"}


def adr(r):
    """Adresa fără $ (A1, A1:C3, A1,C3), indiferent dacă pywin32 dă Address ca proprietate sau ca metodă."""
    v = r.Address
    if callable(v):
        v = v()
    return str(v).replace("$", "")


def nr(v):
    if isinstance(v, float) and v.is_integer():
        return int(v)
    return v


class Excel(Rulare):
    CHEI_AMPRENTA = ["celule", "format_celule", "selectie"]

    @property
    def ws(self):
        return self.a.ActiveSheet

    def start(self, st):
        self.inchide_ferestre_straine()
        trimite_taste(self.hdoc, "Esc", 0.3)       # ieșire din orice mod de editare rămas
        ws = self.ws
        self.a.CutCopyMode = False
        ws.Cells.Clear()
        ws.Cells.ColumnWidth = ws.StandardWidth
        ws.Cells.RowHeight = ws.StandardHeight
        for adr, v in st.get("celule", {}).items():
            ws.Range(adr).Formula = v
        for adr, f in st.get("format", {}).items():
            r = ws.Range(adr)
            if "bold" in f:
                r.Font.Bold = bool(f["bold"])
        ws.Range(st.get("selectie", "A1")).Select()
        if st.get("celula_activa"):
            ws.Range(st["celula_activa"]).Activate()
        time.sleep(0.3)

    def punct_celula(self, adresa):
        """Centrul celulei pe ecran, din dreptunghiul celulei în UI Automation (XLSpreadsheetCell cu numele adresei).
        PointsToScreenPixels dădea alt loc pe acest PC (proba din 17.11: C3 calculat → K7)."""
        A = U.A
        cond = A.CreateAndCondition(A.CreatePropertyCondition(U.P_CLS, "XLSpreadsheetCell"),
                                    A.CreatePropertyCondition(U.P_NAME, adresa))
        el = U.din_hwnd(self.hdoc).FindFirst(4, cond)
        if not el:
            raise RuntimeError(f"celula {adresa} nu e vizibilă în UI Automation")
        b = el.CurrentBoundingRectangle
        return (b.left + b.right) / 2, (b.top + b.bottom) / 2

    def pas_gest(self, p):
        g = p["gest"]
        if g == "tasteaza":
            trimite_text(self.hdoc, p["text"])
            return "WM_CHAR literă cu literă"
        if g == "taste":
            for _ in range(p.get("repeta", 1)):
                trimite_taste(self.hdoc, p["taste"])
            return f"WM_KEYDOWN/UP {p['taste']}" + (f" ×{p['repeta']}" if p.get("repeta", 1) > 1 else "")
        if g in ("clic", "dublu_clic"):
            x, y = self.punct_celula(p["celula"])
            trimite_mouse(self.hdoc, x, y, g, p.get("modificatori", []))
            return f"mouse postat ({g}{'+' + '+'.join(p['modificatori']) if p.get('modificatori') else ''})"
        if g == "selecteaza":
            self.ws.Range(p["zona"]).Select()
            if p.get("celula_activa"):
                self.ws.Range(p["celula_activa"]).Activate()
            return "selecția de pornire prin COM"
        if g == "comanda_panglica":
            return self.panglica(p)
        raise RuntimeError(f"gestul {g} nu se poate rula ca gest_real în Excel")

    def pas_model(self, p):
        ws = self.ws
        g = p["gest"]
        if g == "selecteaza":
            ws.Range(p["zona"]).Select()
            return "Range.Select"
        if g == "clic":
            ws.Range(p["celula"]).Select()
            return "Range.Select"
        if g == "taste":
            t = p["taste"]
            if t in ("Ctrl+C", "Ctrl+X"):
                self.clip = (adr(self.a.Selection), t == "Ctrl+X")
                return f"{t}: zona ținută în model (fără clipboard)"
            if t == "Ctrl+V":
                src, taie = self.clip
                dest = self.a.ActiveCell
                if taie:
                    ws.Range(src).Cut(dest)
                else:
                    ws.Range(src).Copy(dest)
                return "Ctrl+V: Range.Copy/Cut(Destination), fără clipboard"
        if g == "trage" and p.get("ce") == "patratelul_de_umplere":
            ws.Range(p["sursa"]).AutoFill(ws.Range(p["destinatie"]), 0)   # xlFillDefault = ca tragerea
            return "Range.AutoFill(xlFillDefault)"
        if g == "comanda_panglica" and p["id_mso"] == "FileSaveAs":
            self.a.ActiveWorkbook.SaveAs(str(self.tmp / p["nume"]))
            return "Workbook.SaveAs (nume fără extensie, tipul implicit)"
        raise RuntimeError(f"pasul {p} n-are echivalent în model")

    def citeste(self, chei):
        ws = self.ws
        rez = {}
        ur = ws.UsedRange
        celule = [c for c in ur.Cells] if ur.Count <= 400 else []
        for k in chei:
            if k == "celule":
                out = {}
                for c in celule:
                    if c.Formula in ("", None) and c.Value2 is None:
                        continue
                    o = {"valoare": nr(c.Value2), "text": str(c.Text)}
                    if c.HasFormula:
                        o["formula"] = str(c.Formula)
                    out[adr(c)] = o
                rez[k] = out
            elif k == "format_celule":
                out = {}
                for c in celule:
                    o = {}
                    if c.Font.Bold:
                        o["bold"] = True
                    if c.Font.Italic:
                        o["italic"] = True
                    ha = int(c.HorizontalAlignment)
                    if ha != 1:
                        o["aliniere"] = XL_ALINIERE.get(ha, str(ha))
                    if c.MergeCells:
                        o["imbinat"] = adr(c.MergeArea)
                    if str(c.NumberFormat) != "General":
                        o["format_numar"] = str(c.NumberFormat)
                    if o:
                        out[adr(c)] = o
                rez[k] = out
            elif k == "selectie":
                rez[k] = {"activa": adr(self.a.ActiveCell), "zona": adr(self.a.Selection)}
            elif k == "nume_fisier":
                wb = self.a.ActiveWorkbook
                rez[k] = str(wb.Name) if wb.Path else None
            else:
                raise RuntimeError(f"cheie de stare necunoscută pentru Excel: {k}")
        return rez


# ----------------------------------------------------------------------------------------------- PowerPoint
class PowerPoint(Rulare):
    @property
    def CHEI_AMPRENTA(self):   # noqa: N802
        return ["diapozitive", "tema"] + (["formatare_text"] if getattr(self, "forma_citita", None) else [])

    @property
    def p(self):
        return self.a.ActivePresentation

    def ferestre(self):
        """Fereastra prezentării curente: cadrul (panglica), mdiClass (legătura COM) și panoul de lucru (tastele)."""
        import win32gui
        for _ in range(40):
            fs = [h for h, c, _ in U.ferestre_pid(self.s.proc.pid) if c == "PPTFrameClass"]
            if len(fs) == 1:
                mdi = U.copii_clasa(fs[0], ["mdiClass"])
                pane = U.copii_clasa(fs[0], ["paneClassDC"])
                if mdi and (pane or _ > 20):
                    self.s.hmain, self.s.hdoc = fs[0], mdi[0]
                    self.hpane = pane[0] if pane else mdi[0]
                    return
            time.sleep(0.25)
        raise RuntimeError(f"fereastra prezentării nu s-a găsit: {[(c, t) for _, c, t in U.ferestre_pid(self.s.proc.pid)]}")

    @property
    def hdoc(self):
        h = getattr(self, "hpane", None)
        return h if h else self.s.hdoc

    def start(self, st):
        """Prezentare NOUĂ la fiecare scenariu (tema și tranzițiile nu trec dintr-un scenariu în altul)."""
        self.inchide_ferestre_straine()
        vechi = self.p
        nou = self.a.Presentations.Add(True)
        nou.Tags.Add("LHREF", "1")
        vechi.Saved = -1
        vechi.Close()
        time.sleep(1.5)
        self.ferestre()
        self.baza = {x for x, _, _ in U.ferestre_pid(self.s.proc.pid)}
        p = self.p
        lay = {str(cl.Name): cl for cl in p.SlideMaster.CustomLayouts}
        for i, dz in enumerate(st.get("diapozitive", [{"aspect": "Title Slide"}]), start=1):
            sl = p.Slides.AddSlide(i, lay[dz.get("aspect", "Title Slide")])
            texte = dz.get("texte", [])
            k = 0
            for sh in sl.Shapes:
                if sh.HasTextFrame and k < len(texte):
                    sh.TextFrame.TextRange.Text = texte[k]
                    k += 1
        self.a.ActiveWindow.View.GotoSlide(st.get("diapozitiv_activ", 1))
        if st.get("selectie_forma"):
            n, k = st["selectie_forma"]
            p.Slides(n).Shapes(k).Select()
        if st.get("selectie_text"):
            n, k = st["selectie_text"]
            p.Slides(n).Shapes(k).TextFrame.TextRange.Select()
        if st.get("panou") == "miniaturi":
            self.a.ActiveWindow.Panes(1).Activate()
            p.Slides(st.get("diapozitiv_activ", 1)).Select()
        time.sleep(0.8)

    def pas_gest(self, p):
        g = p["gest"]
        if g == "taste":
            for _ in range(p.get("repeta", 1)):
                trimite_taste(self.hdoc, p["taste"])
            return f"WM_KEYDOWN/UP {p['taste']} în fereastra cu focus"
        if g == "tasteaza":
            trimite_text(self.hdoc, p["text"])
            return "WM_CHAR literă cu literă"
        if g == "selecteaza":
            if "diapozitiv" in p and "forma" not in p:
                self.a.ActiveWindow.Panes(1).Activate()
                self.p.Slides(p["diapozitiv"]).Select()
            else:
                self.p.Slides(p["diapozitiv"]).Shapes(p["forma"]).Select()
            return "selecția de pornire prin COM"
        if g == "comanda_panglica":
            r = self.panglica(p)
            self.ferestre()
            return r
        raise RuntimeError(f"gestul {g} nu se poate rula ca gest_real în PowerPoint")

    def pas_model(self, p):
        pr = self.p
        g = p["gest"]
        if g == "clic_dreapta":
            self.tinta_meniu = p.get("diapozitiv", 1)
            return "clic dreapta: ținta ținută în model"
        if g == "meniu" and p.get("element") == "Duplicate Slide":
            pr.Slides(self.tinta_meniu).Duplicate()
            return "Duplicate Slide: Slide.Duplicate"
        if g == "comanda_panglica":
            m = p["id_mso"]
            if m == "TableInsertGallery":
                sl = pr.Slides(p.get("diapozitiv", 1))
                sl.Shapes.AddTable(p["randuri"], p["coloane"])
                return "Shapes.AddTable"
            if m == "PictureInsertFromFile":
                sl = pr.Slides(p.get("diapozitiv", 1))
                sl.Shapes.AddPicture(str(WT / p["fisier"]), False, True, 100, 100)
                return "Shapes.AddPicture"
            if m == "FileSaveAs":
                pr.SaveAs(str(self.tmp / p["nume"]))
                return "Presentation.SaveAs (nume fără extensie, tipul implicit)"
            if m == "SlideDuplicate":
                pr.Slides(p["diapozitiv"]).Duplicate()
                return "Slide.Duplicate"
        raise RuntimeError(f"pasul {p} n-are echivalent în model")

    def selectat_in_galerie(self, id_mso):
        el = gaseste_id(U.din_hwnd(self.hmain), id_mso)
        if el is None:
            return None
        A = U.A
        arr = el.FindAll(4, A.CreatePropertyCondition(U.P_CT, 50007))
        for i in range(arr.Length if arr else 0):
            it = arr.GetElement(i)
            try:
                if it.GetCurrentPropertyValue(30079):    # SelectionItem.IsSelected
                    return str(it.CurrentName)
            except Exception:  # noqa: BLE001
                pass
        return None

    def citeste(self, chei):
        p = self.p
        rez = {}
        for k in chei:
            if k == "diapozitive":
                out = []
                for sl in p.Slides:
                    texte = [str(sh.TextFrame.TextRange.Text) for sh in sl.Shapes
                             if sh.HasTextFrame and sh.TextFrame.HasText]
                    o = {"aspect": str(sl.CustomLayout.Name), "texte": texte, "forme": int(sl.Shapes.Count)}
                    tr = sl.SlideShowTransition
                    if int(tr.EntryEffect) != 0:
                        o["tranzitie_cod"] = int(tr.EntryEffect)
                    seq = sl.TimeLine.MainSequence
                    if seq.Count:
                        o["animatii_cod"] = [int(seq.Item(i).EffectType) for i in range(1, seq.Count + 1)]
                    out.append(o)
                rez[k] = out
            elif k == "tema":
                rez[k] = str(p.SlideMaster.Design.Name)
            elif k == "tranzitie_galerie":
                rez[k] = self.selectat_in_galerie("AnimationTransitionGallery")
            elif k == "animatie_galerie":
                rez[k] = self.selectat_in_galerie("AnimationGallery")
            elif k == "formatare_text":
                n, kk = self.forma_citita
                tr = p.Slides(n).Shapes(kk).TextFrame.TextRange
                rez[k] = {"text": str(tr.Text), "bold": bool(tr.Font.Bold), "marime": float(tr.Font.Size)}
            elif k == "nume_fisier":
                rez[k] = str(p.Name) if p.Path else None
            elif k == "diapozitiv_activ":
                rez[k] = int(self.a.ActiveWindow.View.Slide.SlideIndex)
            else:
                raise RuntimeError(f"cheie de stare necunoscută pentru PowerPoint: {k}")
        return rez


CLASE = {"word": Word, "excel": Excel, "powerpoint": PowerPoint}


# =============================================================================================== probele modurilor
def proba(r):
    """Fiecare canal, pe un rezultat cunoscut (pozitiv) + o probă de control care TREBUIE să pice/să nu se întâmple."""
    app = r.app
    P = {}

    def inreg(canal, poz, neg, detalii):
        P[canal] = {"pozitiv": bool(poz), "control": bool(neg), "trecut": bool(poz) and bool(neg), "detalii": detalii}
        log(f"  proba {canal}: pozitiv={poz} control={neg}")

    if app == "word":
        # model_obiect
        r.start({"paragrafe": ["Ana are mere"]})
        r.d.Range(0, 3).Font.Bold = True
        f = r.citeste(["formatare_pe_caractere"])["formatare_pe_caractere"]
        poz = f[0] == {"text": "Ana", "bold": True, "italic": False, "underline": False, "marime": f[0]["marime"]}
        neg = f[1]["bold"] is False and f[0] != {"text": "Ana", "bold": False}
        inreg("model_obiect", poz, neg, {"dupa_Range.Font.Bold": f})
        # tastare
        r.start({"paragrafe": [""]})
        trimite_text(r.hdoc, "xy")
        t = r.citeste(["text"])["text"]
        inreg("tastare", t == ["xy"], t != ["xz"], {"tastat": "xy", "citit": t, "control": "așteptarea „xz” pică"})
        # taste cu Ctrl
        r.start({"paragrafe": ["Ana are mere"], "selectie": {"de_la": 0, "pana_la": 3}})
        trimite_taste(r.hdoc, "Ctrl+B")
        a1 = r.citeste(["text", "formatare_pe_caractere"])
        r.start({"paragrafe": ["Ana are mere"], "selectie": {"de_la": 0, "pana_la": 3}})
        trimite_taste(r.hdoc, "B")
        a2 = r.citeste(["text", "formatare_pe_caractere"])
        poz = a1["text"] == ["Ana are mere"] and a1["formatare_pe_caractere"][0]["bold"] is True
        neg = a2["text"] == ["b are mere"] and not any(x["bold"] for x in a2["formatare_pe_caractere"])
        inreg("taste", poz, neg, {"Ctrl+B": a1, "B fara Ctrl (control)": a2})
        # mouse
        r.start({"paragrafe": ["Ana are mere multe"], "cursor": 0})
        x, y = r.punct(r.d.Range(8, 12))
        trimite_mouse(r.hdoc, x, y, "dublu_clic")
        s1 = r.citeste(["selectie"])["selectie"]
        r.start({"paragrafe": ["Ana are mere multe"], "cursor": 0})
        trimite_mouse(r.hdoc, x, y, "clic")
        s2 = r.citeste(["selectie"])["selectie"]
        inreg("mouse", s1["text"].strip() == "mere", s2["de_la"] == s2["pana_la"] and s2["de_la"] > 0,
              {"dublu_clic_pe_mere": s1, "clic_simplu (control: nu selectează)": s2})
        # panglica
        r.start({"paragrafe": ["Ana are mere"], "selectie": {"de_la": 0, "pana_la": 3}})
        c1 = r.panglica({"fila": "TabHome", "id_mso": "Bold"})
        b1 = r.citeste(["formatare_pe_caractere"])["formatare_pe_caractere"]
        r.start({"paragrafe": ["Ana are mere"], "selectie": {"de_la": 0, "pana_la": 3}})
        r.panglica({"fila": "TabHome", "id_mso": "Italic"})
        b2 = r.citeste(["formatare_pe_caractere"])["formatare_pe_caractere"]
        inreg("panglica", b1[0]["bold"] is True and b1[0]["text"] == "Ana",
              b2[0]["bold"] is False and b2[0]["italic"] is True,
              {"Bold": b1, "cum": c1, "Italic (control: nu face bold)": b2})
    elif app == "excel":
        r.start({"celule": {"A1": 5}})
        r.ws.Range("A1").Font.Bold = True
        f = r.citeste(["format_celule"])["format_celule"]
        inreg("model_obiect", f.get("A1", {}).get("bold") is True, "A2" not in f, {"format": f})
        r.start({"selectie": "A1"})
        trimite_text(r.hdoc, "12")
        trimite_taste(r.hdoc, "Enter")
        c = r.citeste(["celule", "selectie"])
        inreg("tastare", c["celule"].get("A1", {}).get("valoare") == 12 and c["selectie"]["activa"] == "A2",
              c["celule"].get("A1", {}).get("valoare") != 13, {"citit": c, "control": "așteptarea 13 pică"})
        r.start({"celule": {"A1": "Ana"}, "selectie": "A1"})
        trimite_taste(r.hdoc, "Ctrl+B")
        a1 = r.citeste(["celule", "format_celule"])
        r.start({"celule": {"A1": "Ana"}, "selectie": "A1"})
        trimite_taste(r.hdoc, "B")
        trimite_taste(r.hdoc, "Enter")
        a2 = r.citeste(["celule", "format_celule"])
        inreg("taste", a1["format_celule"].get("A1", {}).get("bold") is True and a1["celule"]["A1"]["valoare"] == "Ana",
              a2["celule"].get("A1", {}).get("valoare") == "b" and not a2["format_celule"].get("A1", {}).get("bold"),
              {"Ctrl+B": a1, "B fara Ctrl (control)": a2})
        r.start({"selectie": "A1"})
        x, y = r.punct_celula("C3")
        trimite_mouse(r.hdoc, x, y, "clic")
        s1 = r.citeste(["selectie"])["selectie"]
        r.start({"selectie": "A1"})
        trimite_mouse(r.hdoc, x, y, "clic", ["Shift"])
        s2 = r.citeste(["selectie"])["selectie"]
        inreg("mouse", s1 == {"activa": "C3", "zona": "C3"}, s2 == {"activa": "A1", "zona": "A1:C3"},
              {"clic_C3": s1, "Shift+clic_C3 (control: alt rezultat)": s2})
        r.start({"celule": {"A1": "Ana"}, "selectie": "A1"})
        c1 = r.panglica({"fila": "TabHome", "id_mso": "Bold"})
        b1 = r.citeste(["format_celule"])["format_celule"]
        r.start({"celule": {"A1": "Ana"}, "selectie": "A1"})
        r.panglica({"fila": "TabHome", "id_mso": "Italic"})
        b2 = r.citeste(["format_celule"])["format_celule"]
        inreg("panglica", b1.get("A1", {}).get("bold") is True,
              not b2.get("A1", {}).get("bold") and b2.get("A1", {}).get("italic") is True,
              {"Bold": b1, "cum": c1, "Italic (control)": b2})
    else:
        r.start({"diapozitive": [{"aspect": "Title Slide", "texte": ["Titlu"]}]})
        r.p.Slides.AddSlide(2, r.p.SlideMaster.CustomLayouts(2))
        n = r.citeste(["diapozitive"])["diapozitive"]
        inreg("model_obiect", len(n) == 2, len(n) != 3, {"diapozitive": n})
        r.start({"diapozitive": [{"aspect": "Title Slide"}]})
        c1 = r.panglica({"fila": "TabHome", "id_mso": "SlideNewGallery"})
        n1 = r.citeste(["diapozitive"])["diapozitive"]
        inreg("panglica", len(n1) == 2, len(n1) != 3, {"dupa_New_Slide": n1, "cum": c1,
                                                        "control": "așteptarea 3 diapozitive pică"})
        r.start({"diapozitive": [{"aspect": "Title Slide"}], "panou": "miniaturi"})
        trimite_taste(r.hdoc, "Ctrl+M")
        n2 = r.citeste(["diapozitive"])["diapozitive"]
        r.start({"diapozitive": [{"aspect": "Title Slide"}], "panou": "miniaturi"})
        trimite_taste(r.hdoc, "M")
        n3 = r.citeste(["diapozitive"])["diapozitive"]
        inreg("taste", len(n2) == 2, len(n3) == 1, {"Ctrl+M": n2, "M fara Ctrl (control)": n3})
        r.start({"diapozitive": [{"aspect": "Title Slide"}], "selectie_text": [1, 1]})
        trimite_text(r.hdoc, "xy")
        t = r.citeste(["diapozitive"])["diapozitive"][0]["texte"]
        inreg("tastare", t == ["xy"], t != ["xz"], {"tastat în titlul gol": "xy", "citit": t,
                                                    "control": "așteptarea „xz” pică"})
    r.probe = P
    return P


def canale_pas(app, mod, p):
    if mod == "model_obiect":
        return {"model_obiect"}
    g = p["gest"]
    if g == "tasteaza":
        return {"tastare"} | ({"taste"} if "\n" in p.get("text", "") else set())
    if g == "taste":
        return {"taste"}
    if g in ("clic", "dublu_clic", "triplu_clic"):
        return {"panglica"} if str(p.get("tinta", "")).startswith("dialog") else {"mouse"}
    if g == "comanda_panglica":
        return {"panglica"}
    return set()


# =============================================================================================== rularea scenariilor
def scenarii(app, iduri=None):
    out = []
    for f in sorted((SCEN / app).glob("*.json")):
        s = json.loads(f.read_text(encoding="utf-8"))
        if iduri and s["id"] not in iduri:
            continue
        out.append(s)
    return out


def ruleaza_unul(r, sc, versiune):
    mod = sc["mod"]
    cum = []
    canale = set()
    r.dlg = None
    r.dlg_info = None
    try:
        r.start(sc["start"])
        if r.app == "powerpoint" and sc["start"].get("forma_citita"):
            r.forma_citita = sc["start"]["forma_citita"]
        for p in sc["pasi"]:
            canale |= canale_pas(r.app, mod, p)
            cum.append(r.pas_gest(p) if mod == "gest_real" else r.pas_model(p))
            if getattr(r, "dlg_info", None):
                r.dlg_info_scenariu = r.dlg_info
        time.sleep(0.6)
        mesaj = r.fereastra_mesaj()
        ocupata = r.ocupata()
        if mesaj is not None or ocupata:   # citesc mesajul, apoi Esc (mesaj + editare) ca să pot citi prin COM
            import win32gui
            r.inchide_ferestre_straine()
            for _ in range(3):
                if not r.ocupata():
                    break
                win32gui.PostMessage(tinta_tastatura(r.hdoc), WM_KEYDOWN, 0x1B, lparam_tasta(0x1B))
                win32gui.PostMessage(tinta_tastatura(r.hdoc), WM_KEYUP, 0x1B, lparam_tasta(0x1B, True))
                time.sleep(1.0)
        speciale = ("fereastra_mesaj", "ramane_in_editare")
        stare = r.citeste([k for k in sc["stare_citita"] if k not in speciale])
        if "fereastra_mesaj" in sc["stare_citita"]:
            stare["fereastra_mesaj"] = mesaj
        elif mesaj is not None:
            raise RuntimeError(f"a apărut o fereastră neașteptată: {mesaj}")
        if "ramane_in_editare" in sc["stare_citita"]:
            stare["ramane_in_editare"] = bool(ocupata)
        elif ocupata:
            raise RuntimeError("aplicația a rămas ocupată după pași (mod de editare sau mesaj nevăzut)")
        eroare = None
    except Exception as e:  # noqa: BLE001
        stare = {}
        eroare = f"{type(e).__name__}: {e}"[:600]
        log(traceback.format_exc()[-1500:])
    finally:
        r.dlg_info_scenariu = None
        try:
            r.inchide_ferestre_straine()
        except Exception:  # noqa: BLE001
            pass
    probat = eroare is None and all(r.probe.get(c, {}).get("trecut") for c in canale) and bool(canale)
    neprobate = sorted(c for c in canale if not r.probe.get(c, {}).get("trecut"))
    loc = (f"instanță NOUĂ {r.app} ({versiune}), desktop ascuns {DESKTOP}, "
           f"{time.strftime('%d.%m.%Y %H:%M')}")
    if mod == "gest_real":
        cum_txt = (f"gest_real — {loc}; pașii: " + " · ".join(cum) +
                   "; textul/selecția de pornire și citirea stării prin COM")
    else:
        cum_txt = f"model_obiect (COM) — {loc}; pașii: " + " · ".join(cum)
    rez = {"id": sc["id"], "mod_probat": probat, "stare": stare, "eroare": eroare, "cum": cum_txt,
           "canale": sorted(canale), "canale_neprobate": neprobate}
    (REAL / f"{sc['id']}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    log(f"  {sc['id']}: {'OK' if eroare is None else 'EROARE ' + eroare[:120]} probat={probat}")
    return rez


def principal(app, iduri=None):
    global U
    if app not in CLASE:
        print(f"aplicație necunoscută: {app}", file=sys.stderr)
        return 2
    import dump_uia_office as U_
    U = U_
    if U.nume_desktop_curent().lower() == "default" and "--permite-ecran" not in sys.argv:
        print("REFUZ: rulez pe desktopul VIZIBIL al omului. Pornește-mă fără argumente (mă mut singur pe desktopul "
              "ascuns).", file=sys.stderr)
        return 2
    if app == "powerpoint" and U.ruleaza_deja("POWERPNT.EXE"):
        print("SĂRIT: POWERPNT.EXE rulează deja (o singură instanță; Quit i-ar închide prezentările).")
        return 3
    toate_sc = scenarii(app, iduri)
    REAL.mkdir(parents=True, exist_ok=True)
    for s in toate_sc:
        if s.get("profil") == "word2007":
            scrie_word2007(s)
        if s.get("trimis_la_profesor"):
            (REAL / f"{s['id']}.json").unlink(missing_ok=True)   # gest care nu se poate rula invizibil: fără rezultat
    sc = [s for s in toate_sc if s.get("profil", "") != "word2007" and not s.get("trimis_la_profesor")]
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    REAL.mkdir(parents=True, exist_ok=True)
    r = CLASE[app](app)
    rezultate = []
    probe = {}
    try:
        r.porneste()
        versiune = f"{U.versiune_exe(U.APPS[app]['exe'])}, build COM {r.s.build}"
        try:
            probe = proba(r)
        except Exception:  # noqa: BLE001
            log("proba a căzut:\n" + traceback.format_exc())
            probe = r.probe
        for s in sc:
            rezultate.append(ruleaza_unul(r, s, versiune))
    except Exception:  # noqa: BLE001
        log(traceback.format_exc())
    finally:
        try:
            r.inchide()
        except Exception:  # noqa: BLE001
            log("închidere: " + traceback.format_exc())
    jurnal ={"aplicatie": app, "generat": time.strftime("%Y-%m-%d %H:%M"), "probe": probe,
              "scenarii": len(sc), "rulate": len(rezultate), "erori_sesiune": r.s.erori,
              "mod_probat": sum(1 for x in rezultate if x["mod_probat"])}
    scrie_probe(app, jurnal)
    print(json.dumps({k: v for k, v in jurnal.items() if k != "probe"}, ensure_ascii=False))
    return 0


def scrie_word2007(s):
    """Profilul word2007 nu se rulează (Word 2007 nu e pe acest PC): „rezultatul” e faptul de la profesor, marcat ca atare."""
    rez = {"id": s["id"], "mod_probat": False, "stare": s["stare_asteptata"], "eroare": None,
           "cum": f"NERULAT — fapt de la profesor, nu rulare: {s['sursa_starii']}", "profil": "word2007",
           "rulat": False, "canale": [], "canale_neprobate": []}
    (REAL / f"{s['id']}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1) + chr(10), encoding="utf-8")


def scrie_probe(app, jurnal):
    """Rezultatul probelor intră în secțiunea generată din probe_mod.md (între marcaje), pe aplicație."""
    text = PROBE_MD.read_text(encoding="utf-8") if PROBE_MD.exists() else ""
    a, b = f"<!-- PROBE:{app}:START -->", f"<!-- PROBE:{app}:END -->"
    bloc = (f"{a}\n```json\n{json.dumps(jurnal, ensure_ascii=False, indent=1)}\n```\n{b}")
    if a in text and b in text:
        text = text[:text.index(a)] + bloc + text[text.index(b) + len(b):]
    else:
        text = text.rstrip() + "\n\n" + bloc + "\n"
    PROBE_MD.write_text(text, encoding="utf-8")


def probe_din_md():
    text = PROBE_MD.read_text(encoding="utf-8") if PROBE_MD.exists() else ""
    rez = {}
    for app in APPS:
        m = re.search(rf"<!-- PROBE:{app}:START -->\s*```json\n(.*?)\n```", text, re.S)
        if m:
            rez[app] = json.loads(m.group(1))
    return rez


def toate(iduri=None):
    sys.path.insert(0, str(HIDDEN.parent))
    import hidden_desktop
    for app in APPS:
        if app == "powerpoint":
            out = subprocess.run(["tasklist", "/FI", "IMAGENAME eq POWERPNT.EXE", "/NH"], capture_output=True,
                                 text=True, timeout=30).stdout
            if "powerpnt.exe" in out.lower():
                print("powerpoint -> SĂRIT: POWERPNT.EXE rulează deja")
                continue
        argv = [sys.executable, str(Path(__file__).resolve()), app] + (["--id"] + iduri if iduri else [])
        r = hidden_desktop.run(argv, timeout=1500, desktop=DESKTOP)
        print(app, "->", r["returncode"], "TIMEOUT" if r["timed_out"] else "", (r["output"] or "")[-600:],
              (r["stderr"] or "")[-600:])
    return verifica()


# =============================================================================================== verificarea livrabilului
def verifica():
    """Probleme: format greșit, sursa_gest care nu există, scenariu fără rezultat real și fără rând în de_verificat.md,
    mod_probat fără proba canalului trecută, gest_real cu pași COM, nume personale în ieșiri."""
    probleme = []
    dv = (D / "de_verificat.md").read_text(encoding="utf-8") if (D / "de_verificat.md").exists() else ""
    probe = probe_din_md()
    nume_interzise = [x.lower() for x in (os.environ.get("USERNAME"), os.environ.get("COMPUTERNAME")) if x]
    n_sc = n_real = n_probat = n_prof = 0
    for app in APPS:
        for f in sorted((SCEN / app).glob("*.json")):
            n_sc += 1
            try:
                s = json.loads(f.read_text(encoding="utf-8"))
            except Exception as e:  # noqa: BLE001
                probleme.append(f"{f.name}: JSON invalid {e}")
                continue
            sid = s.get("id")
            if sid != f.stem:
                probleme.append(f"{f.name}: id {sid!r} ≠ numele fișierului")
            for k in ("id", "aplicatie", "mod", "descriere", "start", "pasi", "stare_citita", "lectii", "sursa_gest"):
                if k not in s:
                    probleme.append(f"{sid}: lipsește cheia {k}")
            if s.get("aplicatie") != app:
                probleme.append(f"{sid}: aplicatie={s.get('aplicatie')!r} în dosarul {app}")
            if s.get("mod") not in ("gest_real", "model_obiect"):
                probleme.append(f"{sid}: mod invalid {s.get('mod')!r}")
            for p in s.get("pasi", []):
                if p.get("gest") not in GESTURI:
                    probleme.append(f"{sid}: gest necunoscut {p.get('gest')!r}")
            if not s.get("stare_citita") or not s.get("lectii"):
                probleme.append(f"{sid}: stare_citita/lectii goale")
            m = re.fullmatch(r"(.+):(\d+)", str(s.get("sursa_gest", "")))
            if not m or not (WT / m.group(1)).exists():
                probleme.append(f"{sid}: sursa_gest {s.get('sursa_gest')!r} nu e fișier:rând existent")
            else:
                linii = (WT / m.group(1)).read_text(encoding="utf-8", errors="replace").splitlines()
                if int(m.group(2)) > len(linii):
                    probleme.append(f"{sid}: sursa_gest rândul {m.group(2)} > {len(linii)}")
            for l_ in s.get("lectii", []):
                cand = [WT / "lectii" / l_ / "index.html", WT / l_ / "index.html", WT / l_]
                if not any(c.exists() for c in cand):
                    probleme.append(f"{sid}: lecția {l_} nu există")
            if s.get("profil") == "word2007":
                n_prof += 1
                if "stare_asteptata" not in s or "sursa_starii" not in s:
                    probleme.append(f"{sid}: profil word2007 fără stare_asteptata/sursa_starii")
                continue
            rf = REAL / f"{sid}.json"
            if s.get("trimis_la_profesor"):
                if sid not in dv:
                    probleme.append(f"{sid}: marcat trimis_la_profesor, dar nu apare în de_verificat.md")
                continue
            if not rf.exists():
                if sid not in dv:
                    probleme.append(f"{sid}: fără rezultat real și fără rând în de_verificat.md")
                continue
            n_real += 1
            r = json.loads(rf.read_text(encoding="utf-8"))
            for k in ("id", "mod_probat", "stare", "eroare", "cum"):
                if k not in r:
                    probleme.append(f"{sid}: rezultatul real n-are cheia {k}")
            if r.get("eroare"):
                probleme.append(f"{sid}: rularea reală a dat eroare: {str(r['eroare'])[:160]}")
            if r.get("mod_probat"):
                n_probat += 1
                pa = probe.get(app, {}).get("probe", {})
                for c in r.get("canale", []):
                    if not pa.get(c, {}).get("trecut"):
                        probleme.append(f"{sid}: mod_probat=true, dar proba canalului {c} n-a trecut în probe_mod.md")
                if not r.get("canale"):
                    probleme.append(f"{sid}: mod_probat=true fără canale")
            else:
                if not r.get("eroare") and sid not in dv:
                    probleme.append(f"{sid}: mod_probat=false fără explicație (eroare sau rând în de_verificat.md)")
            if s.get("mod") == "gest_real" and "model_obiect" in r.get("canale", []):
                probleme.append(f"{sid}: gest_real cu pași prin COM")
            if not r.get("eroare"):
                lipsa = [k for k in s.get("stare_citita", []) if k not in r.get("stare", {})]
                if lipsa:
                    probleme.append(f"{sid}: starea reală n-are cheile {lipsa}")
            txt = rf.read_text(encoding="utf-8").lower()
            for x in nume_interzise:
                if x in txt:
                    probleme.append(f"{sid}: un nume personal (utilizator/calculator) apare în rezultat")
    for app in APPS:
        if app not in probe:
            probleme.append(f"probe_mod.md: lipsesc probele pentru {app}")
            continue
        for c, v in probe[app].get("probe", {}).items():
            if not v.get("trecut"):
                probleme.append(f"proba {app}/{c} n-a trecut: pozitiv={v.get('pozitiv')} control={v.get('control')}")
    for x in probleme:
        print("-", x)
    print(f"scenarii: {n_sc} (word2007: {n_prof}) · cu rezultat real: {n_real} · mod_probat=true: {n_probat}")
    print(len(probleme))
    return 0 if not probleme else 1


if __name__ == "__main__":
    args = sys.argv[1:]
    iduri = None
    if "--id" in args:
        i = args.index("--id")
        iduri = [x for x in args[i + 1:] if not x.startswith("--")]
        args = args[:i]
    args = [a for a in args if not a.startswith("--")]
    cmd = args[0] if args else "toate"
    if cmd == "verifica":
        sys.exit(verifica())
    if cmd == "toate":
        sys.exit(toate(iduri))
    sys.exit(principal(cmd, iduri))
