"""Referințele REALE Office (Word, Excel, PowerPoint) prin UI Automation — Etapa 0, „Aplicațiile fidele” (16.11.2026).

Ce face: pornește o instanță NOUĂ a aplicației instalate (Office 16, interfață engleză), pe un DESKTOP ASCUNS
(nimic pe ecranul omului), aduce fereastra la 1366×768 pixeli CSS (pe monitorul cu 100% DPI dacă există; altfel
împarte la factorul DPI) și citește arborele UI Automation al suprafețelor:
  bara_titlu, acces_rapid (Quick Access Toolbar), file_panglicii, panglica.<TabId> (TOATE filele afișate),
  bara_stare, zona_document, backstage.<pagina> (Home/New/Open/Info/Save As/Print/Share/Export),
  meniu_contextual.<loc>, dialog.<idMso>[#<fila dialogului>], panglica_context.<TabId> (file contextuale).
Ce e PERSONAL (fila Developer, grupurile aduse de add-in-uri instalate de om) iese din referință pe DOVEZI și se
listează în `excluse_personal`. Modul /safe NU se folosește: la pornire Word cere o alegere de setare („Default File
Types”), iar a răspunde ar schimba o setare. La final compară filele și grupurile cu lista oficială Microsoft
(M365 SAEC, _cercetare/office_comenzi/M365_SAEC) și scrie diferențele în `comparatie_saec`.

Rulare (OBLIGATORIU pe desktop ascuns; scriptul refuză pe desktopul vizibil):
  python C:/00/AI_0/tools/hidden_desktop.py run --desktop LHRefOffice --timeout 900 -- python <calea>/dump_uia_office.py word
  python <calea>/dump_uia_office.py toate          # le pornește pe rând pe desktopul ascuns (word, excel, powerpoint)
  python <calea>/dump_uia_office.py verifica       # verifică JSON-urile; ULTIMA linie = numărul de probleme (cod 0/1)
                                                   # (și: nicio filă personală — Developer — în rândul filelor sau în altă listă)
  python <calea>/dump_uia_office.py scoate_personale excel   # scoate Developer din rândul filelor pe JSON-ul DEJA scris
                                                   # (fără Office); ultima linie = câte file a scos
Ieșire: uia_<aplicatie>.json lângă script.

Reguli respectate: instanță nouă (/x la Word/Excel); PowerPoint NU se pornește dacă POWERPNT.EXE rulează deja;
fereastra își recapătă poziția inițială înainte de închidere (Office ține minte poziția la ieșire); închidere prin COM
fără salvare, forțat doar dacă nu se închide în 90 s și doar PID-ul nostru; zoom-ul Word pus la 100% pentru captură și
înapoi la valoarea omului înainte de ieșire; nicio setare schimbată (registru, panglică, opțiuni); contul (MeControl)
sărit, nume/căi/e-mailuri/fișiere recente redactate; ultima plasă: fișierul NU se scrie dacă un nume interzis a rămas.
"""
import ctypes
import json
import os
import re
import subprocess
import sys
import tempfile
import threading
import time
import traceback
from ctypes import wintypes as wt
from pathlib import Path

AICI = Path(__file__).resolve().parent
WT = AICI.parents[2]                       # C:/00/Projects/LearningHub_fidel
SAEC = WT / "_cercetare" / "office_comenzi" / "M365_SAEC"
HIDDEN = Path(r"C:\00\AI_0\tools\hidden_desktop.py")
DESKTOP = "LHRefOffice"
OFFICE = Path(r"C:\Program Files\Microsoft Office\root\Office16")
TINTA_CSS = (1366, 768)

APPS = {
    "word": {"exe": "WINWORD.EXE", "args": ["/x", "/q", "/w"], "clasa": "OpusApp", "doc": ["_WwG"], "saec": "wordcontrols.xlsx"},
    "excel": {"exe": "EXCEL.EXE", "args": ["/x"], "clasa": "XLMAIN", "doc": ["EXCEL7"], "saec": "excelcontrols.xlsx"},
    "powerpoint": {"exe": "POWERPNT.EXE", "args": ["/B"], "clasa": "PPTFrameClass", "doc": ["mdiClass", "paneClassDC"],
                   "saec": "powerpointcontrols.xlsx"},
}
# dialogurile folosite în lecții (grep în lectii/_sim + jocuri, 16.11.2026; vezi README_referinte.md)
DIALOGURI = {
    "word": ["FontDialog", "ParagraphDialog", "PageSetupDialog", "TableInsertDialogWord", "BordersShadingDialogWord",
             "ColumnsDialog", "PictureInsertFromFile", "FileSaveAs"],
    "excel": ["FormatCellsDialog", "SortDialog", "CellsInsertDialog", "CellsDelete", "ColumnWidth", "RowHeight",
              "SheetMoveOrCopy", "FunctionWizard", "FileSaveAs", "ChartChangeType"],
    "powerpoint": ["FontDialogPowerPoint", "PowerPointParagraphDialog", "TableInsertDialog",
                   "PictureInsertFromFilePowerPoint", "FileSaveAs", "AnimationCustom"],   # + panou.LaunchFormatBackground (panou_format_fundal)
}
PAGINI_BACKSTAGE = ["Home", "New", "Open", "Info", "Save As", "Print", "Share", "Export"]
SARI_ID = ("MeControl", "PersonaPicture", "AccountPicture", "AccountName", "UserName", "ProfilePicture")  # PREFIXE de AutomationId (contul omului)
# dialoguri care nu se deschid prin ExecuteMso: a doua încercare prin Application.Dialogs(n).Display()
GRUPURI_ADDIN = {"Claude"}   # grupuri aduse de add-in-uri instalate de om (dovezile: scoate_personale)
DIALOG_REZERVA = {"word": {"TableInsertDialogWord": 129},   # wdDialogTableInsertTable
                  "powerpoint": {"TableInsertDialog": "TableInsert", "PowerPointParagraphDialog": "ParagraphDialog"}}
CT = {50000: "Button", 50001: "Calendar", 50002: "CheckBox", 50003: "ComboBox", 50004: "Edit", 50005: "Hyperlink",
      50006: "Image", 50007: "ListItem", 50008: "List", 50009: "Menu", 50010: "MenuBar", 50011: "MenuItem",
      50012: "ProgressBar", 50013: "RadioButton", 50014: "ScrollBar", 50015: "Slider", 50016: "Spinner",
      50017: "StatusBar", 50018: "Tab", 50019: "TabItem", 50020: "Text", 50021: "ToolBar", 50022: "ToolTip",
      50023: "Tree", 50024: "TreeItem", 50025: "Custom", 50026: "Group", 50027: "Thumb", 50028: "DataGrid",
      50029: "DataItem", 50030: "Document", 50031: "SplitButton", 50032: "Window", 50033: "Pane", 50034: "Header",
      50035: "HeaderItem", 50036: "Table", 50037: "TitleBar", 50038: "Separator", 50039: "SemanticZoom", 50040: "AppBar"}
P_NAME, P_AID, P_CT, P_RECT, P_CLS, P_OFF = 30005, 30011, 30003, 30001, 30012, 30022
P_HELP, P_ACC, P_KEY, P_EN, P_VAL, P_TOG = 30013, 30006, 30007, 30010, 30045, 30086
PROPS = (P_NAME, P_AID, P_CT, P_RECT, P_CLS, P_OFF, P_HELP, P_ACC, P_KEY, P_EN, P_VAL, P_TOG)

LOG = []


def log(msg):
    LOG.append(f"{time.strftime('%H:%M:%S')} {msg}")
    print(msg, flush=True)


# ---------------------------------------------------------------- desktop / procese
def nume_desktop_curent():
    u = ctypes.windll.user32
    h = u.GetThreadDesktop(ctypes.windll.kernel32.GetCurrentThreadId())
    buf = ctypes.create_unicode_buffer(256)
    n = wt.DWORD()
    u.GetUserObjectInformationW(h, 2, buf, 512, ctypes.byref(n))
    return buf.value


def ruleaza_deja(exe):
    out = subprocess.run(["tasklist", "/FI", f"IMAGENAME eq {exe}", "/NH"], capture_output=True, text=True,
                         timeout=30).stdout
    return exe.lower() in out.lower()


def versiune_exe(exe):
    import win32api
    i = win32api.GetFileVersionInfo(str(OFFICE / exe), chr(92))
    ms, ls = i["FileVersionMS"], i["FileVersionLS"]
    return f"{ms >> 16}.{ms & 0xffff}.{ls >> 16}.{ls & 0xffff}"


def produs_office():
    """Citire (doar citire) din registrul Click-to-Run: ce produs și ce canal sunt instalate."""
    import winreg
    rez = {}
    try:
        k = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\Microsoft\Office\ClickToRun\Configuration")
        for nume in ("ProductReleaseIds", "VersionToReport", "CDNBaseUrl", "Platform"):
            try:
                rez[nume] = winreg.QueryValueEx(k, nume)[0]
            except OSError:
                pass
    except OSError as e:
        rez["eroare"] = str(e)
    canale = {"492350f6-3a01-4f97-b9c0-c7c6ddf67d60": "Current Channel",
              "55336b82-a18d-4dd6-b5f6-9e5095c314a6": "Monthly Enterprise Channel",
              "7ffbc6bf-bc32-4f92-8982-f9dd17fd3114": "Semi-Annual Enterprise Channel"}
    for g, n in canale.items():
        if g in rez.get("CDNBaseUrl", ""):
            rez["canal"] = n
    return rez


# ---------------------------------------------------------------- UI Automation
def init_uia():
    global A, IInvoke, ISelItem, ILegacy, IText
    ctypes.windll.shcore.SetProcessDpiAwareness(2)
    from pywinauto.uia_defines import IUIA
    A = IUIA().iuia
    from comtypes.gen.UIAutomationClient import (IUIAutomationInvokePattern, IUIAutomationSelectionItemPattern,
                                                 IUIAutomationLegacyIAccessiblePattern, IUIAutomationTextPattern)
    IInvoke, ISelItem, ILegacy, IText = (IUIAutomationInvokePattern, IUIAutomationSelectionItemPattern,
                                         IUIAutomationLegacyIAccessiblePattern, IUIAutomationTextPattern)


def cerere_cache():
    cr = A.CreateCacheRequest()
    for p in PROPS:
        cr.AddProperty(p)
    cr.TreeScope = 7  # element + descendenți
    return cr


def _val(el, p):
    try:
        v = el.GetCachedPropertyValue(p)
    except Exception:  # noqa: BLE001
        return None
    if isinstance(v, (str, int, float, bool, tuple)):
        return v
    return None


def brut(el, adancime=0):
    """Arborele brut (din cache) al unui element UIA."""
    r = _val(el, P_RECT)
    n = {"n": _val(el, P_NAME) or "", "id": _val(el, P_AID) or "", "ct": _val(el, P_CT), "c": _val(el, P_CLS) or "",
         "r": [int(x) for x in r] if r else [0, 0, 0, 0], "off": bool(_val(el, P_OFF)),
         "help": _val(el, P_HELP) or "", "acc": _val(el, P_ACC) or "", "key": _val(el, P_KEY) or "",
         "en": _val(el, P_EN), "val": _val(el, P_VAL), "tog": _val(el, P_TOG), "k": []}
    if adancime < 80:
        try:
            ch = el.GetCachedChildren()
            if ch:
                n["k"] = [brut(ch.GetElement(i), adancime + 1) for i in range(ch.Length)]
        except Exception:  # noqa: BLE001
            pass
    return n


def arbore(el):
    return brut(el.BuildUpdatedCache(cerere_cache()))


def din_hwnd(h):
    return A.ElementFromHandle(h)


def gaseste(el, prop, valoare, scope=4):
    try:
        return el.FindFirst(scope, A.CreatePropertyCondition(prop, valoare))
    except Exception:  # noqa: BLE001
        return None


def gaseste_toate(el, prop, valoare, scope=4):
    try:
        arr = el.FindAll(scope, A.CreatePropertyCondition(prop, valoare))
        return [arr.GetElement(i) for i in range(arr.Length)] if arr else []
    except Exception:  # noqa: BLE001
        return []


def pattern(el, pid, itf):
    try:
        p = el.GetCurrentPattern(pid)
        return p.QueryInterface(itf) if p else None
    except Exception:  # noqa: BLE001
        return None


def apasa(el):
    """Invoke; altfel acțiunea implicită MSAA; altfel selectare."""
    for pid, itf, f in ((10000, IInvoke, lambda p: p.Invoke()), (10018, ILegacy, lambda p: p.DoDefaultAction()),
                        (10010, ISelItem, lambda p: p.Select())):
        p = pattern(el, pid, itf)
        if p is not None:
            try:
                f(p)
                return True
            except Exception as e:  # noqa: BLE001
                log(f"  apasa({pid}): {e!r}")
    return False


def selecteaza(el):
    p = pattern(el, 10010, ISelItem)
    if p is not None:
        try:
            p.Select()
            return True
        except Exception as e:  # noqa: BLE001
            log(f"  select: {e!r}")
    return apasa(el)


# ---------------------------------------------------------------- Win32
def ferestre_pid(pid):
    import win32gui
    import win32process
    rez = []

    def cb(h, _):
        try:
            if win32process.GetWindowThreadProcessId(h)[1] == pid and win32gui.IsWindowVisible(h):
                rez.append((h, win32gui.GetClassName(h), win32gui.GetWindowText(h)))
        except Exception:  # noqa: BLE001
            pass
        return True
    win32gui.EnumWindows(cb, None)
    return rez


def copii_clasa(hwnd, clase):
    import win32gui
    rez = []

    def cb(h, _):
        if win32gui.GetClassName(h) in clase:
            rez.append(h)
        return True
    try:
        win32gui.EnumChildWindows(hwnd, cb, None)
    except Exception:  # noqa: BLE001
        pass
    return rez


def cadru_vizibil(h):
    """Dreptunghiul VIZIBIL al ferestrei (fără marginile invizibile de redimensionare), DWMWA_EXTENDED_FRAME_BOUNDS."""
    r = wt.RECT()
    if ctypes.windll.dwmapi.DwmGetWindowAttribute(wt.HWND(h), 9, ctypes.byref(r), ctypes.sizeof(r)) == 0:
        return [r.left, r.top, r.right, r.bottom]
    import win32gui
    return list(win32gui.GetWindowRect(h))


def monitor_tinta():
    """Monitorul cu 100% DPI (dacă există), altfel cel principal: (stânga, sus, dpi)."""
    import win32api
    alese = []
    for m in win32api.EnumDisplayMonitors():
        hm = m[0]
        dx, dy = ctypes.c_uint(), ctypes.c_uint()
        ctypes.windll.shcore.GetDpiForMonitor(int(hm), 0, ctypes.byref(dx), ctypes.byref(dy))
        info = win32api.GetMonitorInfo(hm)
        alese.append((dx.value != 96, not info["Flags"] & 1, info["Work"], dx.value))
    alese.sort()
    w = alese[0][2]
    return w[0], w[1], alese[0][3]


def hwnd_la(hparinte, sx, sy):
    import win32gui
    h = hparinte
    for _ in range(20):
        cx, cy = win32gui.ScreenToClient(h, (sx, sy))
        try:
            ch = win32gui.ChildWindowFromPointEx(h, (cx, cy), 0x1 | 0x4)
        except Exception:  # noqa: BLE001
            ch = 0
        if not ch or ch == h:
            return h
        h = ch
    return h


def com_din(hwnd):
    import pythoncom
    import win32com.client
    import win32gui
    res = win32gui.SendMessageTimeout(hwnd, 0x003D, 0, -16 & 0xFFFFFFFF, 0x2, 10000)
    lres = res[1] if isinstance(res, tuple) else res
    obj = pythoncom.ObjectFromLresult(lres, pythoncom.IID_IDispatch, 0)
    return win32com.client.Dispatch(obj)


def in_fir(f, timeout=60, nume="apel"):
    """Rulează f() într-un fir cu COM propriu; întoarce (terminat, rezultat/excepție)."""
    rez = {}

    def w():
        import pythoncom
        pythoncom.CoInitialize()
        try:
            rez["ok"] = f()
        except Exception as e:  # noqa: BLE001
            rez["err"] = e
        finally:
            pythoncom.CoUninitialize()
    t = threading.Thread(target=w, daemon=True, name=nume)
    t.start()
    t.join(timeout)
    return (not t.is_alive()), rez


# ---------------------------------------------------------------- curățare + normalizare
class Curatator:
    EMAIL = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+")
    CALE = re.compile(r"[A-Za-z]:\\|\\\\|\\[^\\\s]+\\|https?://")
    FISIER = re.compile(r"(?<!\*)\.(docx?|docm|dotx|xlsx?|xlsm|xlsb|csv|pptx?|ppsx|potx|pdf|txt|odt|ods|odp|rtf|png|jpe?g)\b",
                        re.I)

    def __init__(self):
        self.interzise = set()
        for v in (os.environ.get("USERNAME"), os.environ.get("COMPUTERNAME")):
            if v and len(v) >= 3:
                self.interzise.add(v.lower())
        self.redactari = {}

    def adauga_nume(self, text):
        for parte in re.split(r"[\s,;]+", text or ""):
            if len(parte) >= 3:
                self.interzise.add(parte.lower())

    def _numara(self, motiv):
        self.redactari[motiv] = self.redactari.get(motiv, 0) + 1

    def text(self, s):
        if not s:
            return s
        s = str(s).replace("\u202a", "").replace("\u202c", "")
        jos = s.lower()
        if any(re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", jos) for x in self.interzise):
            self._numara("nume")
            return "[redactat: nume]"
        if self.EMAIL.search(s):
            self._numara("e-mail")
            return "[redactat: e-mail]"
        if self.CALE.search(s):
            self._numara("cale")
            return "[redactat: cale]"
        if self.FISIER.search(s):
            self._numara("fișier")
            return "[redactat: fișier]"
        return s


def este_idmso(s):
    return bool(s) and bool(re.fullmatch(r"[A-Za-z][A-Za-z0-9_]*", s)) and not s.isdigit()


class Normalizator:
    def __init__(self, x0, y0, f, cur, sarite):
        self.x0, self.y0, self.f, self.cur = x0, y0, f, cur
        self.sarite = sarite

    def rect(self, r):
        f = self.f
        return [round((r[0] - self.x0) / f, 1), round((r[1] - self.y0) / f, 1), round(r[2] / f, 1), round(r[3] / f, 1)]

    def nod(self, b, fara_elemente_lista=False, fara_celule=False):
        aid = b.get("id") or ""
        if aid.startswith(SARI_ID):
            self.sarite.append(f"{CT.get(b.get('ct'), b.get('ct'))} id={aid}")
            return None
        tip = CT.get(b.get("ct"), str(b.get("ct")))
        n = {"tip": tip, "eticheta": self.cur.text(b.get("n") or "")}
        if este_idmso(aid):
            n["id_mso"] = aid
        elif aid:
            n["id_win32"] = aid
        if b.get("c"):
            n["clasa"] = b["c"]
        n["rect_css"] = self.rect(b["r"])
        n["rect_brut"] = b["r"]
        if b.get("off"):
            n["vizibil"] = False
        if b.get("en") is False:
            n["activ"] = False
        if b.get("help"):
            n["ajutor"] = self.cur.text(b["help"][:400])
        if b.get("acc"):
            n["scurtatura"] = b["acc"]
        if b.get("key"):
            n["tasta_acces"] = b["key"]
        if isinstance(b.get("tog"), int) and tip in ("Button", "CheckBox", "MenuItem", "SplitButton", "ListItem"):
            n["bifat"] = b["tog"]
        if isinstance(b.get("val"), str) and b["val"] and tip in ("ComboBox", "Edit", "Text", "Spinner", "Slider"):
            n["valoare"] = self.cur.text(b["val"][:120])
        if fara_elemente_lista and tip in ("ListItem", "TreeItem", "DataItem"):
            n["eticheta"] = "[element de listă, nesalvat]"
            n["copii"] = []
            return n
        copii = []
        celule = 0
        for k in b.get("k", []):
            if fara_celule and k.get("c") == "XLSpreadsheetCell":
                celule += 1
                continue
            c = self.nod(k, fara_elemente_lista, fara_celule)
            if c is not None:
                copii.append(c)
        n["copii"] = copii
        if celule:
            n["celule_omise"] = celule
        return n


def cauta(b, pred, acc=None):
    acc = [] if acc is None else acc
    if pred(b):
        acc.append(b)
    for k in b.get("k", []):
        cauta(k, pred, acc)
    return acc


def numara(n):
    return 1 + sum(numara(c) for c in n.get("copii", []))


# ---------------------------------------------------------------- sesiunea cu aplicația
class Sesiune:
    def __init__(self, app, sigur=False):
        self.app, self.sigur, self.cfg = app, sigur, APPS[app]
        self.proc = None
        self.hmain = None
        self.orig = None
        self.com = None
        self.cur = Curatator()
        self.erori = []
        self.nedeschise = []
        self.supr = {}
        self.dpi = 96
        self.f = 1.0
        self.x0 = self.y0 = 0
        self.fereastra_brut = None
        self.sarite = []
        self.build = None

    # ---- pornire
    def porneste(self):
        import win32gui
        args = list(self.cfg["args"]) + (["/safe"] if self.sigur else [])
        self.cmd = [str(OFFICE / self.cfg["exe"])] + args
        log(f"pornesc {' '.join(self.cmd)} (desktop: {nume_desktop_curent()})")
        self.proc = subprocess.Popen(self.cmd)
        t0 = time.time()
        esc = 0
        while time.time() - t0 < 120:
            time.sleep(1)
            fs = ferestre_pid(self.proc.pid)
            principale = [h for h, c, _ in fs if c == self.cfg["clasa"]]
            if not principale:
                # dialog de pornire (recuperare / mod sigur): Esc = închide fără să aleagă nimic
                if fs and int(time.time() - t0) % 15 == 14 and esc < 3:
                    for h, c, t in fs:
                        if c not in ("UAC_InputIndicatorOverlayWnd", "UAC Input Indicator", "MsoSplash"):
                            log(f"  dialog la pornire: {c} {t!r} -> WM_CLOSE")
                            win32gui.PostMessage(h, 0x0010, 0, 0)
                            esc += 1
                continue
            self.hmain = principale[0]
            if gaseste(din_hwnd(self.hmain), P_AID, "TabHome") is not None or gaseste(
                    din_hwnd(self.hmain), P_NAME, "Blank workbook") is not None:
                break
        if not self.hmain:
            raise RuntimeError(f"fereastra principală nu a apărut în 120 s: {ferestre_pid(self.proc.pid)}")
        time.sleep(3)
        self.orig = win32gui.GetWindowPlacement(self.hmain)
        if self.app == "excel" and not copii_clasa(self.hmain, ["EXCEL7"]):
            b = gaseste(din_hwnd(self.hmain), P_NAME, "Blank workbook")
            log(f"  ecranul de pornire Excel: Blank workbook = {b is not None}")
            if b is not None:
                apasa(b)
            for _ in range(40):
                time.sleep(1)
                if copii_clasa(self.hmain, ["EXCEL7"]) and gaseste(din_hwnd(self.hmain), P_AID, "TabHome"):
                    break
            time.sleep(2)
        self.aseaza()
        docs = copii_clasa(self.hmain, self.cfg["doc"])
        for d in docs:
            try:
                self.com = com_din(d)
                self.hdoc = d
                break
            except Exception as e:  # noqa: BLE001
                self.erori.append(f"COM din {win32gui.GetClassName(d)}: {e!r}")
        if self.com is None:
            raise RuntimeError("nu am obținut obiectul COM al instanței (AccessibleObjectFromWindow)")
        self.appcom = self.com.Application
        self.build = str(self.appcom.Build)
        log(f"  COM ok: Build {self.build}")
        self.zoom_orig = None
        self.prez_init = []
        if self.app == "powerpoint":
            self.prez_init = [str(p.Name) for p in self.appcom.Presentations]
            for p in self.appcom.Presentations:   # eticheta prezentărilor mele (în documentul nesalvat, nu în setări)
                p.Tags.Add("LHREF", "1")
        if self.app == "word":
            # zoom-ul documentului NOU vine din ultima sesiune a omului (ex. 289%); capturăm la 100% și îl punem
            # înapoi înainte de ieșire, ca Word să nu țină minte altă valoare
            try:
                z = self.appcom.ActiveWindow.View.Zoom
                self.zoom_orig = (int(z.PageFit), int(z.Percentage))
                z.PageFit = 0
                z.Percentage = 100
                log(f"  zoom inițial {self.zoom_orig} -> 100%")
                time.sleep(1)
            except Exception as e:  # noqa: BLE001
                self.erori.append(f"zoom: {e!r}")
        # numele contului (doar ca să-l redactăm oriunde ar apărea; NU se scrie nicăieri)
        me = gaseste(din_hwnd(self.hmain), P_AID, "MeControlWidget")
        if me is not None:
            try:
                self.cur.adauga_nume(me.CurrentName)
            except Exception:  # noqa: BLE001
                pass

    def aseaza(self):
        """Fereastra la 1366×768 px CSS (cadrul vizibil), pe monitorul cu 100% DPI dacă există."""
        import win32con
        import win32gui
        u = ctypes.windll.user32
        mx, my, _ = monitor_tinta()
        win32gui.ShowWindow(self.hmain, win32con.SW_RESTORE)
        time.sleep(1)
        u.MoveWindow(self.hmain, mx + 20, my + 20, TINTA_CSS[0], TINTA_CSS[1], True)
        time.sleep(1.5)
        for _ in range(3):
            self.dpi = u.GetDpiForWindow(self.hmain) or 96
            self.f = self.dpi / 96
            wr = win32gui.GetWindowRect(self.hmain)
            vz = cadru_vizibil(self.hmain)
            extra_w = (wr[2] - wr[0]) - (vz[2] - vz[0])
            extra_h = (wr[3] - wr[1]) - (vz[3] - vz[1])
            w = round(TINTA_CSS[0] * self.f) + extra_w
            h = round(TINTA_CSS[1] * self.f) + extra_h
            u.MoveWindow(self.hmain, mx + 20, my + 20, w, h, True)
            time.sleep(2)
            vz = cadru_vizibil(self.hmain)
            if abs((vz[2] - vz[0]) - round(TINTA_CSS[0] * self.f)) <= 1 and abs(
                    (vz[3] - vz[1]) - round(TINTA_CSS[1] * self.f)) <= 1:
                break
        self.x0, self.y0 = vz[0], vz[1]
        self.fereastra_brut = [vz[2] - vz[0], vz[3] - vz[1]]
        self.fereastra_css = [round(self.fereastra_brut[0] / self.f, 1), round(self.fereastra_brut[1] / self.f, 1)]
        log(f"  fereastra: dpi {self.dpi} (factor {self.f}), cadru vizibil {self.fereastra_brut} -> css {self.fereastra_css}")

    def norm(self):
        return Normalizator(self.x0, self.y0, self.f, self.cur, self.sarite)

    # ---- suprafețele ferestrei principale
    def panglica_bruta(self):
        b = arbore(din_hwnd(self.hmain))
        rib = cauta(b, lambda n: n.get("c") == "NetUInetpane" and n.get("n") == "Ribbon")
        return b, (rib[0] if rib else None)

    def captureaza_cadrul(self):
        b, rib = self.panglica_bruta()
        if rib is None:
            raise RuntimeError("panglica (NetUInetpane 'Ribbon') nu a fost găsită")
        file_ = cauta(rib, lambda n: n.get("n") == "Ribbon Tabs")
        y_file = file_[0]["r"][1] if file_ else 10 ** 6
        N = self.norm()
        # bara de titlu = tot ce stă deasupra rândului de file
        titlu = [k for k in rib["k"] if k["r"][1] < y_file and k.get("n") != "Lower Ribbon"]
        nod_t = {"tip": "TitleBar", "eticheta": "bara de titlu (desenată de Office)",
                 "rect_css": N.rect([rib["r"][0], rib["r"][1], rib["r"][2], max(1, y_file - rib["r"][1])]),
                 "copii": [c for c in (N.nod(k) for k in titlu) if c]}
        self.supr["bara_titlu"] = nod_t
        qat = [k for k in titlu if k.get("n") == "Quick Access Toolbar"]
        if qat:
            q = N.nod(qat[0])
            q["afisat"] = True
            self.supr["acces_rapid"] = q
        else:
            self.supr["acces_rapid"] = {"tip": "ToolBar", "eticheta": "Quick Access Toolbar", "afisat": False,
                                        "rect_css": None, "copii": [],
                                        "nota": "nu apare în bara de titlu a acestei instanțe (ascunsă)"}
        rand = [k for k in rib["k"] if y_file <= k["r"][1] < y_file + 40 and k.get("n") != "Lower Ribbon"
                or k.get("n") == "Ribbon Display Options"]
        self.supr["file_panglicii"] = {"tip": "Tab", "eticheta": "rândul filelor",
                                       "rect_css": N.rect(file_[0]["r"]) if file_ else None,
                                       "copii": [c for c in (N.nod(k) for k in rand) if c]}
        sb = cauta(b, lambda n: n.get("c") == "NetUInetpane" and n.get("n") == "Status Bar")
        if sb:
            self.supr["bara_stare"] = N.nod(sb[0])
        else:
            self.nedeschise.append({"suprafata": "bara_stare", "motiv": "bara de stare nu a fost găsită în arbore"})
        # zona documentului (fără conținut: celulele Excel se numără, nu se salvează)
        zona = [k for k in b["k"] if k.get("c") not in ("MsoCommandBarDock", "DropShadow")
                and k.get("n") not in ("MsoDockTop", "MsoDockBottom", "DropShadowTop")
                and not cauta(k, lambda n: n.get("c") == "NetUInetpane")]
        copii = [c for c in (N.nod(k, fara_celule=True) for k in zona) if c]
        if self.app == "powerpoint":
            for h in copii_clasa(self.hmain, ["mdiClass"]):
                try:
                    copii.append(N.nod(arbore(din_hwnd(h))))
                except Exception as e:  # noqa: BLE001
                    self.erori.append(f"zona_document mdiClass: {e!r}")
        self.supr["zona_document"] = {"tip": "Pane", "eticheta": "zona documentului (fără conținut)",
                                      "rect_css": N.rect(b["r"]), "copii": copii}
        return rib

    def lista_file(self):
        el = gaseste(din_hwnd(self.hmain), P_NAME, "Ribbon Tabs")
        if el is None:
            return []
        rez = []
        arr = el.FindAll(4, A.CreatePropertyCondition(P_CT, 50019))   # și filele contextuale (imbricate)
        for i in range(arr.Length):
            e = arr.GetElement(i)
            try:
                if e.CurrentControlType == 50019:
                    rez.append((e.CurrentAutomationId, e.CurrentName, e))
            except Exception:  # noqa: BLE001
                pass
        return rez

    def captureaza_fila(self, tid, eticheta, el, prefix="panglica"):
        tid = tid or ("Ctx_" + re.sub(r"\W+", "", eticheta or "Fara"))   # filele contextuale pot avea id gol
        if not selecteaza(el):
            self.erori.append(f"{tid}: nu pot selecta fila")
            return None
        time.sleep(1.8)
        low = gaseste(din_hwnd(self.hmain), P_NAME, "Lower Ribbon")
        if low is None:
            self.erori.append(f"{tid}: 'Lower Ribbon' lipsește")
            return None
        nod = self.norm().nod(arbore(low))
        nod["fila"] = {"id_mso": tid, "eticheta": eticheta}
        self.supr[f"{prefix}.{tid}"] = nod
        grupuri = [c for c in nod["copii"][0]["copii"]] if nod["copii"] else []
        log(f"  {prefix}.{tid} ({eticheta}): {len(grupuri)} grupuri, {numara(nod)} noduri")
        return nod

    def toate_filele(self, personale=("TabDeveloper",)):
        self.file_baza = []
        self.excluse = []
        for tid, et, el in self.lista_file():
            self.file_baza.append(tid)
            if tid in personale:
                nod = self.captureaza_fila(tid, et, el, prefix="_personal")
                g = [c["eticheta"] for c in nod["copii"][0]["copii"]] if nod and nod["copii"] else []
                self.supr.pop(f"_personal.{tid}", None)
                self.excluse.append({"ce": f"fila {et} ({tid})", "grupuri": g,
                                     "motiv": "ascunsă implicit; e afișată de o setare a omului (File › Options › "
                                              "Customize Ribbon). NU am schimbat setarea.",
                                     "sursa": "https://support.microsoft.com/en-us/office/"
                                              "show-the-developer-tab-e1192344-5e56-4d45-931b-e5fd9bea2d45"})
                continue
            self.captureaza_fila(tid, et, el)
        acasa = [e for t, _, e in self.lista_file() if t == "TabHome"]
        if acasa:
            selecteaza(acasa[0])
            time.sleep(1)

    # ---- backstage
    def backstage(self):
        ft = gaseste(din_hwnd(self.hmain), P_AID, "FileTabButton")
        if ft is None or not apasa(ft):
            self.nedeschise.append({"suprafata": "backstage", "motiv": "butonul File nu a putut fi apăsat"})
            return
        time.sleep(3)
        N = self.norm()
        b = arbore(din_hwnd(self.hmain))
        nav = cauta(b, lambda n: n.get("id") == "NavBarMenu")
        if nav:
            self.supr["backstage.nav"] = N.nod(nav[0])
        cap = cauta(b, lambda n: n.get("c") == "NetUIFullpageUIWindow")
        if cap:
            self.supr["backstage.cadru"] = {"tip": "Pane", "eticheta": "cadrul Backstage (fără conținutul paginii)",
                                            "rect_css": N.rect(cap[0]["r"]),
                                            "copii": [c for c in (N.nod(k) for k in cap[0]["k"]
                                                                  if k.get("id") not in ("BackstageView",))
                                                      if c and c.get("id_mso") != "NavBarMenu"]}
        for pag in PAGINI_BACKSTAGE:
            navel = gaseste(din_hwnd(self.hmain), P_AID, "NavBarMenu")
            item = None
            if navel is not None:
                for e in gaseste_toate(navel, P_NAME, pag):
                    item = e
                    break
            if item is None:
                self.nedeschise.append({"suprafata": f"backstage.{pag}", "motiv": "pagina nu există în meniul File"})
                continue
            selecteaza(item)
            time.sleep(3.5)
            bv = gaseste(din_hwnd(self.hmain), P_AID, "BackstageView")
            if bv is None:
                # unele pagini (Save la document nou) deschid altceva: notăm
                self.nedeschise.append({"suprafata": f"backstage.{pag}", "motiv": "BackstageView lipsește după selectare"})
                continue
            nod = N.nod(arbore(bv), fara_elemente_lista=(pag in ("Open",)))
            self.supr[f"backstage.{pag}"] = nod
            log(f"  backstage.{pag}: {numara(nod)} noduri")
        self.iesi_backstage()

    def iesi_backstage(self):
        nav = gaseste(din_hwnd(self.hmain), P_AID, "NavBarMenu")
        if nav is None:
            return
        back = gaseste(nav, P_AID, "FileTabButton")
        if back is not None:
            apasa(back)
            time.sleep(2)
        if gaseste(din_hwnd(self.hmain), P_AID, "NavBarMenu") is not None:
            import win32gui
            win32gui.PostMessage(self.hmain, 0x0100, 0x1B, 0)
            win32gui.PostMessage(self.hmain, 0x0101, 0x1B, 0)
            time.sleep(2)

    # ---- meniuri de clic dreapta
    def clic_dreapta(self, nume, sx, sy):
        import win32gui
        h = hwnd_la(self.hmain, int(sx), int(sy))
        inainte = {x for x, _, _ in ferestre_pid(self.proc.pid)}
        cx, cy = win32gui.ScreenToClient(h, (int(sx), int(sy)))
        lp = ((cy & 0xFFFF) << 16) | (cx & 0xFFFF)
        win32gui.PostMessage(h, 0x0200, 0, lp)
        time.sleep(0.2)
        win32gui.PostMessage(h, 0x0204, 0x0002, lp)
        time.sleep(0.1)
        win32gui.PostMessage(h, 0x0205, 0, lp)
        noi = []
        for _ in range(25):
            time.sleep(0.2)
            noi = [(x, c, t) for x, c, t in ferestre_pid(self.proc.pid) if x not in inainte]
            if any(c == "Net UI Tool Window" for _, c, _ in noi):
                break
        time.sleep(1.0)
        noi = [(x, c, t) for x, c, t in ferestre_pid(self.proc.pid) if x not in inainte]
        if not noi:
            self.nedeschise.append({"suprafata": f"meniu_contextual.{nume}",
                                    "motiv": f"nicio fereastră nouă după clic dreapta (fereastra țintă {win32gui.GetClassName(h)})"})
            return
        N = self.norm()
        copii = []
        for x, c, t in noi:
            try:
                copii.append(N.nod(arbore(din_hwnd(x))))
            except Exception as e:  # noqa: BLE001
                self.erori.append(f"meniu_contextual.{nume}: {e!r}")
        self.supr[f"meniu_contextual.{nume}"] = {"tip": "Menu", "eticheta": f"clic dreapta: {nume}",
                                                 "punct_css": N.rect([int(sx), int(sy), 0, 0])[:2],
                                                 "fereastra_tinta": win32gui.GetClassName(h), "copii": copii}
        log(f"  meniu_contextual.{nume}: {len(noi)} ferestre, {sum(numara(c) for c in copii)} noduri")
        for x, _, _ in noi:
            win32gui.PostMessage(x, 0x0100, 0x1B, 0)
            win32gui.PostMessage(x, 0x0101, 0x1B, 0)
        time.sleep(0.8)
        for _ in range(10):
            ramase = [x for x, _, _ in ferestre_pid(self.proc.pid) if x not in inainte]
            if not ramase:
                break
            win32gui.PostMessage(h, 0x0100, 0x1B, 0)
            win32gui.PostMessage(h, 0x0101, 0x1B, 0)
            time.sleep(0.5)

    # ---- dialoguri
    def dialog(self, mso, pregatire=None, cheie=None, titlu_asteptat=None):
        import win32gui
        cheie = cheie or mso
        if pregatire:
            try:
                pregatire()
            except Exception as e:  # noqa: BLE001
                self.erori.append(f"dialog.{mso} pregătire: {e!r}")
        inainte = {x for x, _, _ in ferestre_pid(self.proc.pid)}
        hdoc = self.hdoc
        rez = {}
        rezerva = DIALOG_REZERVA.get(self.app, {}).get(mso)

        def porneste(cale):
            def lucru():
                import pythoncom
                pythoncom.CoInitialize()
                try:
                    a = com_din(hdoc).Application
                    if cale == "mso":
                        a.CommandBars.ExecuteMso(mso)
                    elif isinstance(rezerva, str):
                        a.CommandBars.ExecuteMso(rezerva)
                    else:
                        a.Dialogs(rezerva).Display()
                    rez["ok"] = cale
                except Exception as e:  # noqa: BLE001
                    rez["err"] = repr(e)
                finally:
                    pythoncom.CoUninitialize()
            fir = threading.Thread(target=lucru, daemon=True)
            fir.start()
            gasite = []
            for _ in range(40):
                time.sleep(0.25)
                gasite = [(x, c, tt) for x, c, tt in ferestre_pid(self.proc.pid)
                          if x not in inainte and c != "Net UI Tool Window"]
                if gasite or not fir.is_alive():
                    break
            time.sleep(1.2)
            gasite = [(x, c, tt) for x, c, tt in ferestre_pid(self.proc.pid)
                      if x not in inainte and c != "Net UI Tool Window"]
            return fir, gasite
        t, noi = porneste("mso")
        cale = "mso"
        if not noi and rezerva:
            t.join(5)
            log(f"  dialog.{mso}: ExecuteMso n-a deschis nimic; a doua încercare: {rezerva}")
            t, noi = porneste("dialogs")
            cale = "dialogs"
        N = self.norm()
        if not noi:
            # panou de activități (Format Background) sau pagina Backstage (Save As): în fereastra principală
            t.join(5)
            b = arbore(din_hwnd(self.hmain))
            panou = cauta(b, lambda n: n.get("c") == "MsoWorkPane" and n.get("n") not in ("Ribbon", "Status Bar"))
            if panou:
                self.supr[f"panou.{cheie}"] = N.nod(panou[0])
                log(f"  panou.{cheie}: {numara(self.supr[f'panou.{cheie}'])} noduri")
                if self.app == "powerpoint":
                    try:
                        self.appcom.CommandBars.ExecuteMso(mso)   # comută panoul înapoi (închis)
                    except Exception:  # noqa: BLE001
                        pass
                    time.sleep(1)
                return
            if cauta(b, lambda n: n.get("id") == "NavBarMenu"):
                self.nedeschise.append({"suprafata": f"dialog.{cheie}",
                                        "motiv": "ExecuteMso a deschis Backstage (pagina Save As), nu o fereastră; "
                                                 "pagina e în backstage.Save As"})
                self.iesi_backstage()
                return
            self.nedeschise.append({"suprafata": f"dialog.{cheie}",
                                    "motiv": f"nicio fereastră nouă; ExecuteMso: {rez.get('err') or 'fără eroare'}"})
            return
        fisier_win = any(c == "#32770" for _, c, _ in noi)
        for x, c, tt in noi:
            el = din_hwnd(x)
            b = arbore(el)
            nod = N.nod(b, fara_elemente_lista=fisier_win)
            nod["clasa_fereastra"] = c
            nod["deschis_prin"] = (f"CommandBars.ExecuteMso('{mso}')" if cale == "mso" else
                                   f"CommandBars.ExecuteMso('{rezerva}')" if isinstance(rezerva, str) else
                                   f"Application.Dialogs({rezerva}).Display()")
            self.supr[f"dialog.{cheie}"] = nod
            log(f"  dialog.{cheie}: {c} {self.cur.text(tt)!r}, {numara(nod)} noduri")
            if titlu_asteptat and tt != titlu_asteptat:
                self.supr.pop(f"dialog.{cheie}")
                self.nedeschise.append({"suprafata": f"dialog.{cheie}",
                                        "motiv": f"s-a deschis {tt!r}, nu {titlu_asteptat!r}"})
                break
            # filele dialogului (Font/Advanced, Margins/Paper/Layout, Number/Alignment/...)
            file_d = [k for k in cauta(b, lambda n: n.get("ct") == 50019)]
            nume_file = [k.get("n") for k in file_d]
            if len(file_d) > 1 and not fisier_win:
                nod["file_dialog"] = nume_file
                for nf in nume_file[1:]:
                    tab = gaseste(el, P_NAME, nf)
                    if tab is None:
                        continue
                    sel_tab = None
                    for cand in gaseste_toate(el, P_NAME, nf):
                        try:
                            if cand.CurrentControlType == 50019:
                                sel_tab = cand
                                break
                        except Exception:  # noqa: BLE001
                            pass
                    if sel_tab is None or not selecteaza(sel_tab):
                        self.erori.append(f"dialog.{cheie}: nu pot selecta fila {nf!r}")
                        continue
                    time.sleep(1.0)
                    nd = N.nod(arbore(el))
                    nd["clasa_fereastra"] = c
                    self.supr[f"dialog.{cheie}#{nf}"] = nd
                    log(f"    #{nf}: {numara(nd)} noduri")
            break
        for x, c, tt in noi:
            win32gui.PostMessage(x, 0x0010, 0, 0)
        t.join(15)
        for _ in range(10):
            ramase = [x for x, cc, _ in ferestre_pid(self.proc.pid) if x not in inainte and cc != "Net UI Tool Window"]
            if not ramase:
                break
            for x in ramase:
                win32gui.PostMessage(x, 0x0010, 0, 0)
            time.sleep(1)
        if t.is_alive():
            self.erori.append(f"dialog.{mso}: ExecuteMso nu s-a întors după închidere")

    # ---- închidere
    def inchide(self):
        import win32gui
        if not self.proc:
            return
        try:
            self.iesi_backstage()
        except Exception:  # noqa: BLE001
            pass
        for x, c, _ in ferestre_pid(self.proc.pid):
            if x != self.hmain and c not in ("UAC_InputIndicatorOverlayWnd", "UAC Input Indicator"):
                win32gui.PostMessage(x, 0x0010, 0, 0)
        time.sleep(1)
        if self.hmain and self.orig:
            try:
                win32gui.SetWindowPlacement(self.hmain, self.orig)   # Office ține minte poziția la ieșire
                time.sleep(1)
            except Exception as e:  # noqa: BLE001
                self.erori.append(f"poziția inițială: {e!r}")
        hdoc, app, zoom = getattr(self, "hdoc", None), self.app, getattr(self, "zoom_orig", None)
        prez_init, cur = list(getattr(self, "prez_init", [])), self.cur
        stare = {}
        # Excel nu iese cât timp un client COM îi mai ține referințe: le eliberăm pe ale noastre ÎNAINTE de Quit
        import gc
        self.com = self.appcom = None
        gc.collect()

        def iesire():
            a = com_din(hdoc).Application
            if app == "word":
                if zoom:
                    try:
                        z = a.ActiveWindow.View.Zoom
                        z.Percentage = zoom[1]
                        z.PageFit = zoom[0]
                    except Exception:  # noqa: BLE001
                        pass
                for d in a.Documents:
                    d.Saved = True
                a.Quit(0)
            elif app == "excel":
                for w in a.Workbooks:
                    w.Saved = True
                a.Quit()
            else:
                # PowerPoint are O SINGURĂ instanță: alt program (alt agent) se poate lipi de ea. Ale mele poartă
                # eticheta LHREF (pusă la pornire; numele NU ajunge: PowerPoint redenumește prezentarea după titlu).
                def a_mea(p):
                    try:
                        return str(p.Tags("LHREF")) == "1"
                    except Exception:  # noqa: BLE001
                        return False
                straine = [str(p.Name) for p in a.Presentations if not a_mea(p)]
                for p in list(a.Presentations):
                    if a_mea(p):
                        p.Saved = -1
                if straine:
                    stare["straine"] = [cur.text(x) for x in straine]
                    for p in list(a.Presentations):
                        if a_mea(p):
                            p.Close()
                    return True
                stare["wm_close"] = True   # Quit prin COM nu închide PowerPoint pornit de om: WM_CLOSE (fără întrebări)
            return True
        if hdoc:
            gata, r = in_fir(iesire, 60, "iesire")
            if "err" in r:
                self.erori.append(f"Quit prin COM: {r['err']!r}")
            if stare.get("straine"):
                self.erori.append(f"PowerPoint: în instanța mea au intrat prezentări străine {stare['straine']}: "
                                  "am închis doar prezentarea mea și NU am oprit aplicația")
                return
            if stare.get("wm_close") and self.hmain:
                import gc
                gc.collect()
                win32gui.PostMessage(self.hmain, 0x0010, 0, 0)
        self.com = self.appcom = None
        try:
            self.proc.wait(60)
            log(f"  închis normal (cod {self.proc.returncode})")
            return
        except subprocess.TimeoutExpired:
            pass
        if self.hmain:
            win32gui.PostMessage(self.hmain, 0x0010, 0, 0)
        try:
            self.proc.wait(30)
            log("  închis prin WM_CLOSE")
        except subprocess.TimeoutExpired:
            self.erori.append("NU s-a închis în 90 s: oprit forțat (doar PID-ul nostru)")
            self.proc.kill()


# ---------------------------------------------------------------- pregătiri pe aplicație (conținut neutru, nesalvat)
def pregateste_continut(s):
    a = s.appcom
    if s.app == "word":
        d = a.ActiveDocument
        d.Content.Text = "Sample text for the reference."
        d.Content.NoProofing = True
    elif s.app == "excel":
        ws = a.ActiveSheet
        for i, (x, y) in enumerate([("Item", "Value"), ("A", 3), ("B", 1), ("C", 2)], start=1):
            ws.Cells(i, 1).Value = x
            ws.Cells(i, 2).Value = y
        ws.Range("A1").Select()
    else:
        p = a.ActivePresentation
        if p.Slides.Count == 0:
            p.Slides.Add(1, 1)


def meniuri_contextuale(s):
    import win32gui
    N = s.norm()
    if s.app == "word":
        el = din_hwnd(s.hdoc)
        tp = pattern(el, 10014, IText)
        rects = []
        try:
            rects = list(tp.DocumentRange.GetBoundingRectangles()) if tp is not None else []
        except Exception as e:  # noqa: BLE001
            s.erori.append(f"TextPattern Word: {e!r}")
        if len(rects) >= 4:
            x, y, w, h = rects[:4]
            s.clic_dreapta("text", x + min(40, w / 4), y + h / 2)
            verifica_meniu(s, "text", ("Font...", "Paragraph..."))
            s.appcom.ActiveDocument.Range(0, 6).Select()
            time.sleep(0.5)
            s.clic_dreapta("text_selectat", x + 15, y + h / 2)
        else:
            r = win32gui.GetWindowRect(s.hdoc)
            s.nedeschise.append({"suprafata": "meniu_contextual.text", "motiv": f"poziția textului necunoscută ({r})"})
    elif s.app == "excel":
        hm = din_hwnd(s.hmain)
        def centru(prop, val):
            e = gaseste(hm, prop, val)
            if e is None:
                return None
            r = e.CurrentBoundingRectangle
            return ((r.left + r.right) / 2, (r.top + r.bottom) / 2)
        p = centru(P_AID, "B3")
        if p:
            s.clic_dreapta("celula", *p)
            verifica_meniu(s, "celula", ("Format Cells...",))
        for nume, (prop, val) in (("antet_coloana", (P_NAME, "C")), ("antet_rand", (P_NAME, "3"))):
            el = None
            for e in gaseste_toate(hm, prop, val):
                try:
                    if e.CurrentClassName in ("XLGridColumnHeader", "XLGridRowHeader"):
                        el = e
                        break
                except Exception:  # noqa: BLE001
                    pass
            if el is not None:
                r = el.CurrentBoundingRectangle
                s.clic_dreapta(nume, (r.left + r.right) / 2, (r.top + r.bottom) / 2)
                verifica_meniu(s, nume, ("Column Width...", "Row Height..."))
            else:
                s.nedeschise.append({"suprafata": f"meniu_contextual.{nume}", "motiv": "antetul nu a fost găsit"})
        p = None
        for e in gaseste_toate(hm, P_NAME, "Sheet1"):
            try:
                if e.CurrentControlType == 50019:
                    r = e.CurrentBoundingRectangle
                    p = ((r.left + r.right) / 2, (r.top + r.bottom) / 2)
                    break
            except Exception:  # noqa: BLE001
                pass
        if p:
            s.clic_dreapta("fila_foii", *p)
            verifica_meniu(s, "fila_foii", ("Rename", "Move or Copy..."))
        else:
            s.nedeschise.append({"suprafata": "meniu_contextual.fila_foii", "motiv": "fila Sheet1 nu a fost găsită"})
        s.appcom.ActiveSheet.Range("A1").Select()
    else:
        w = s.appcom.ActiveWindow
        p = s.appcom.ActivePresentation
        sw, sh = p.PageSetup.SlideWidth, p.PageSetup.SlideHeight
        try:
            w.ViewType = 9  # ppViewNormal
            w.Panes(2).Activate()
        except Exception:  # noqa: BLE001
            pass
        # zona goală a diapozitivului (colțul din dreapta-jos, în afara substituenților)
        try:
            x, y = w.PointsToScreenPixelsX(sw * 0.97), w.PointsToScreenPixelsY(sh * 0.97)
            s.clic_dreapta("diapozitiv", x, y)
        except Exception as e:  # noqa: BLE001
            s.erori.append(f"diapozitiv: {e!r}")
        # textul titlului: pe literele lui (BoundLeft/Top), cu textul în editare (altfel PowerPoint dă meniul diapozitivului)
        try:
            sp = p.Slides(1).Shapes(1)
            tr = sp.TextFrame.TextRange
            tr.Text = "Title"
            tr.Characters(3, 0).Select()
            time.sleep(0.5)
            x = w.PointsToScreenPixelsX(tr.BoundLeft + tr.BoundWidth / 2)
            y = w.PointsToScreenPixelsY(tr.BoundTop + tr.BoundHeight / 2)
            s.clic_dreapta("text", x, y)
            verifica_meniu(s, "text", ("Font...", "Paragraph..."))
        except Exception as e:  # noqa: BLE001
            s.erori.append(f"text PowerPoint: {e!r}")
        # miniatura diapozitivului 1: PowerPoint nu-și expune panoul de miniaturi în UI Automation și nici ferestre
        # copil; panoul stă între marginea stângă a zonei de document și marginea stângă a diapozitivului
        try:
            w.Panes(2).Activate()   # PointsToScreenPixels dă „Illegal value” cu panoul de miniaturi activ
            time.sleep(0.5)
            x_sl = w.PointsToScreenPixelsX(0)
            mdi = copii_clasa(s.hmain, ["MDIClient"])
            stanga, sus = (win32gui.GetWindowRect(mdi[0])[:2] if mdi else (s.x0, s.y0))
            w.Panes(1).Activate()
            time.sleep(0.5)
            s.clic_dreapta("miniatura", stanga + (x_sl - stanga) * 0.5, sus + 50 * s.f)
            verifica_meniu(s, "miniatura", ("Delete Slide", "Duplicate Slide"))
            w.Panes(2).Activate()
        except Exception as e:  # noqa: BLE001
            s.erori.append(f"miniatura: {e!r}")


def etichete(n, acc=None):
    acc = [] if acc is None else acc
    acc.append(n.get("eticheta") or "")
    for c in n.get("copii", []):
        etichete(c, acc)
    return acc


def verifica_meniu(s, nume, asteptate):
    """Meniul capturat chiar e cel cerut? Dacă nu are niciun articol așteptat, NU intră în referință."""
    k = f"meniu_contextual.{nume}"
    if k not in s.supr:
        return
    et = etichete(s.supr[k])
    if not any(a in et for a in asteptate):
        s.nedeschise.append({"suprafata": k, "motiv": f"clicul a deschis alt meniu (lipsesc {list(asteptate)}); "
                                                     f"primele articole: {[e for e in et if e.strip()][:8]}"})
        s.supr.pop(k)


def pregatiri_dialog(s):
    a = s.appcom
    if s.app == "word":
        def la_final():   # Insert Table cu text selectat NU deschide fereastra (convertește textul): cursorul la final
            a.Selection.EndKey(6)
        return {"FontDialog": lambda: a.ActiveDocument.Range(0, 6).Select(), "TableInsertDialogWord": la_final}
    if s.app == "excel":
        def grafic():
            ws = a.ActiveSheet
            if ws.ChartObjects().Count == 0:
                ws.Range("A1:B4").Select()
                ws.Shapes.AddChart2(-1, 51)
            ws.ChartObjects(1).Activate()
            time.sleep(1)
        return {"SortDialog": lambda: a.ActiveSheet.Range("A2").Select(),
                "FormatCellsDialog": lambda: a.ActiveSheet.Range("B2").Select(),
                "CellsInsertDialog": lambda: a.ActiveSheet.Range("D5").Select(),
                "CellsDelete": lambda: a.ActiveSheet.Range("D5").Select(),
                "ChartChangeType": grafic}
    def text_titlu():
        a.ActiveWindow.ViewType = 9
        a.ActiveWindow.Panes(2).Activate()
        sp = a.ActivePresentation.Slides(1).Shapes(1)
        if not sp.TextFrame.TextRange.Text:
            sp.TextFrame.TextRange.Text = "Title"
        sp.TextFrame.TextRange.Select()

    def diapozitiv():
        a.ActiveWindow.ViewType = 9
        a.ActiveWindow.Panes(2).Activate()
        a.ActiveWindow.Selection.Unselect()
    return {"FontDialogPowerPoint": text_titlu, "PowerPointParagraphDialog": text_titlu,
            "TableInsertDialog": diapozitiv, "PictureInsertFromFilePowerPoint": diapozitiv}


def panou_format_fundal(s):
    """Format Background (PowerPoint) e un PANOU, nu o fereastră, și nu pornește prin ExecuteMso pe acest build:
    îl deschid exact ca elevul — clic dreapta pe diapozitiv › Format Background... — și citesc panoul."""
    import win32gui
    a = s.appcom
    w, p = a.ActiveWindow, a.ActivePresentation
    try:
        w.ViewType = 9
        w.Panes(2).Activate()
        w.Selection.Unselect()
    except Exception:  # noqa: BLE001
        pass
    x = w.PointsToScreenPixelsX(p.PageSetup.SlideWidth * 0.97)
    y = w.PointsToScreenPixelsY(p.PageSetup.SlideHeight * 0.97)
    h = hwnd_la(s.hmain, int(x), int(y))
    inainte = {q for q, _, _ in ferestre_pid(s.proc.pid)}
    cx, cy = win32gui.ScreenToClient(h, (int(x), int(y)))
    lp = ((cy & 0xFFFF) << 16) | (cx & 0xFFFF)
    win32gui.PostMessage(h, 0x0204, 0x0002, lp)
    win32gui.PostMessage(h, 0x0205, 0, lp)
    meniu = None
    for _ in range(25):
        time.sleep(0.2)
        noi = [q for q, c, _ in ferestre_pid(s.proc.pid) if q not in inainte and c == "Net UI Tool Window"]
        if noi:
            meniu = noi[0]
            break
    if meniu is None:
        s.nedeschise.append({"suprafata": "panou.LaunchFormatBackground", "motiv": "meniul de clic dreapta nu a apărut"})
        return
    time.sleep(0.6)
    art = None
    for e in gaseste_toate(din_hwnd(meniu), P_NAME, "Format Background..."):
        art = e
        break
    if art is None or not apasa(art):
        s.nedeschise.append({"suprafata": "panou.LaunchFormatBackground",
                             "motiv": "articolul 'Format Background...' nu a putut fi apăsat"})
        win32gui.PostMessage(meniu, 0x0100, 0x1B, 0)
        return
    time.sleep(3)
    b = arbore(din_hwnd(s.hmain))
    panou = cauta(b, lambda n: n.get("c") == "MsoWorkPane" and n.get("n") not in ("Ribbon", "Status Bar"))
    if not panou:
        s.nedeschise.append({"suprafata": "panou.LaunchFormatBackground", "motiv": "panoul nu a apărut după clic"})
        return
    nod = s.norm().nod(panou[0])
    nod["deschis_prin"] = "clic dreapta pe diapozitiv › Format Background..."
    s.supr["panou.LaunchFormatBackground"] = nod
    log(f"  panou.LaunchFormatBackground: {numara(nod)} noduri")
    # închid panoul cu butonul lui de închidere
    pel = gaseste(din_hwnd(s.hmain), P_NAME, panou[0].get("n") or "Format Background")
    if pel is not None:
        for e in gaseste_toate(pel, P_NAME, "Close"):
            if apasa(e):
                break
    time.sleep(1)


def obiecte_contextuale(s):
    """File contextuale (apar doar cu un obiect selectat): tabel, formă, imagine, diagramă."""
    a = s.appcom
    png = Path(tempfile.gettempdir()) / "lh_ref_patrat.png"
    try:
        from PIL import Image
        Image.new("RGB", (64, 64), (70, 130, 180)).save(png)
    except Exception as e:  # noqa: BLE001
        s.erori.append(f"imaginea de probă: {e!r}")
    pasi = []
    if s.app == "word":
        d = a.ActiveDocument

        def tabel():
            r = d.Content
            r.InsertParagraphAfter()
            t = d.Tables.Add(d.Paragraphs(d.Paragraphs.Count).Range, 2, 2)
            t.Cell(1, 1).Select()

        def imagine():
            sh = d.InlineShapes.AddPicture(str(png), False, True, d.Paragraphs(1).Range)
            sh.Select()

        def forma():
            sh = d.Shapes.AddShape(1, 300, 200, 80, 50)
            sh.Select()
        pasi = [("tabel", tabel), ("imagine", imagine), ("forma", forma)]
    elif s.app == "excel":
        def grafic():
            ws = a.ActiveSheet
            if ws.ChartObjects().Count == 0:
                ws.Range("A1:B4").Select()
                ws.Shapes.AddChart2(-1, 51)
            ws.ChartObjects(1).Activate()
        pasi = [("grafic", grafic)]
    else:
        sl = a.ActivePresentation.Slides(1)

        def forma():
            sl.Shapes.AddShape(1, 600, 380, 80, 50).Select()

        def imagine():
            sl.Shapes.AddPicture(str(png), False, True, 50, 380, 64, 64).Select()

        def tabel():
            sl.Shapes.AddTable(2, 2, 300, 380, 200, 60).Select()
        pasi = [("forma", forma), ("imagine", imagine), ("tabel", tabel)]
    for nume, f in pasi:
        try:
            f()
        except Exception as e:  # noqa: BLE001
            s.erori.append(f"obiect {nume}: {e!r}")
            continue
        time.sleep(1.5)
        for tid, et, el in s.lista_file():
            tid = tid or ("Ctx_" + re.sub(r"\W+", "", et or "Fara"))
            if tid in s.file_baza or f"panglica_context.{tid}" in s.supr:
                continue
            nod = s.captureaza_fila(tid, et, el, prefix="panglica_context")
            if nod is not None:
                nod["obiect_selectat"] = nume
    try:
        png.unlink()
    except OSError:
        pass


# ---------------------------------------------------------------- rulări
def rulare_normala(app):
    s = Sesiune(app)
    prep = {}
    try:
        s.porneste()
        s.captureaza_cadrul()
        s.toate_filele()
        s.backstage()
        pregateste_continut(s)
        meniuri_contextuale(s)
        prep = pregatiri_dialog(s)
        for mso in DIALOGURI[app]:
            s.dialog(mso, prep.get(mso))
        if app == "excel":
            # „Sort Warning”: apare când e selectată doar o coloană dintr-un tabel (excelx-sortare.js, tip-excel.js)
            s.dialog("SortDialog", lambda: s.appcom.ActiveSheet.Range("B1:B4").Select(), cheie="SortWarning",
                     titlu_asteptat="Sort Warning")
        if app == "powerpoint":
            panou_format_fundal(s)
        obiecte_contextuale(s)
    except Exception:  # noqa: BLE001
        s.erori.append(traceback.format_exc())
    finally:
        prep = None   # funcțiile de pregătire țin referințe COM: Excel n-ar ieși
        try:
            s.inchide()
        except Exception:  # noqa: BLE001
            s.erori.append("închidere: " + traceback.format_exc())
    return s


def grupuri_din(nod):
    """Grupurile unei file: copiii lui 'Lower Ribbon' › NetUIOrderedGroup."""
    if not nod or not nod.get("copii"):
        return []
    return [g for g in nod["copii"][0].get("copii", []) if g.get("tip") == "Group"]


def iduri(nod, acc=None):
    acc = set() if acc is None else acc
    if nod.get("id_mso"):
        acc.add(nod["id_mso"])
    for c in nod.get("copii", []):
        iduri(c, acc)
    return acc


def rezumat_grupuri(nod):
    return [{"eticheta": g["eticheta"], "id_mso": sorted(iduri(g))} for g in grupuri_din(nod)]


def citeste_saec(app):
    import openpyxl
    wb = openpyxl.load_workbook(SAEC / APPS[app]["saec"], read_only=True)
    ws = wb.active
    file_, ctl = {}, {}
    for i, row in enumerate(ws.iter_rows(values_only=True)):
        if i == 0:
            continue
        nume, _tip, tset, tab, grp = row[:5]
        if tset == "None (Core Tab)" and tab and tab != "None":
            file_.setdefault(tab, [])
            if grp and grp != "None" and grp not in file_[tab]:
                file_[tab].append(grp)
            if nume and grp:
                ctl.setdefault(nume, set()).add((tab, grp))
    return file_, ctl


def compara_saec(app, supr):
    file_saec, ctl = citeste_saec(app)
    rez = {"sursa": f"_cercetare/office_comenzi/M365_SAEC/{APPS[app]['saec']} (Tab Set = 'None (Core Tab)')",
           "file": {}, "file_doar_in_aplicatie": [], "file_saec_neafisate": []}
    afisate = [k.split(".", 1)[1] for k in supr if k.startswith("panglica.")]
    rez["file_doar_in_aplicatie"] = [t for t in afisate if t not in file_saec]
    rez["file_saec_neafisate"] = [t for t in file_saec if t not in afisate]
    for tid in afisate:
        nod = supr[f"panglica.{tid}"]
        gr = grupuri_din(nod)
        gsaec = file_saec.get(tid, [])
        lista = []
        recunoscute = set()
        for g in gr:
            voturi = {}
            for i in iduri(g):
                for (t, gg) in ctl.get(i, ()):
                    if t == tid:
                        voturi[gg] = voturi.get(gg, 0) + 1
            gid = max(voturi, key=voturi.get) if voturi else None
            g["id_grup_saec"] = gid
            if gid:
                recunoscute.add(gid)
            lista.append({"eticheta": g["eticheta"], "id_grup_saec": gid,
                          "controale_necunoscute_saec": sorted(i for i in iduri(g) if i not in ctl)})
        rez["file"][tid] = {"grupuri_aplicatie": len(gr), "grupuri_saec": len(gsaec), "grupuri": lista,
                            "grupuri_saec_neafisate": [x for x in gsaec if x not in recunoscute],
                            "grupuri_fara_corespondent_saec": [x["eticheta"] for x in lista if not x["id_grup_saec"]]}
    return rez


def cache_panglica_web(app):
    """Dovada (doar citire, registru) că aplicația are panglica modificată de add-in-uri web (Office Add-ins)."""
    import winreg
    nume = {"word": "Word", "excel": "Excel", "powerpoint": "PowerPoint"}[app]
    try:
        k = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Office\16.0\WEF")
        return winreg.QueryValueEx(k, f"{nume}_RibbonCache")[0]
    except OSError:
        return None


def scoate_personale(app, supr, ctl_toate):
    """Grupurile aduse de add-in-uri instalate de om (ex. 'Claude'): fără niciun idMso în ele, eticheta în
    GRUPURI_ADDIN, iar aplicația are cache de panglică pentru add-in-uri web (HKCU, cheia Office 16.0 WEF). Ies din referință."""
    excl = []
    dovada = cache_panglica_web(app)
    for k, nod in supr.items():
        if not k.startswith(("panglica.", "panglica_context.")):
            continue
        for g in list(grupuri_din(nod)):
            if g["eticheta"] in GRUPURI_ADDIN and not iduri(g):
                excl.append({"ce": f"grupul '{g['eticheta']}' din {k}",
                             "motiv": "adus de un add-in Office instalat de om, nu de Office: nu are niciun idMso, nu e în "
                                      "lista Microsoft SAEC, lipsește în Word, iar registrul arată panglică "
                                      f"modificată de add-in-uri web (WEF {app}_RibbonCache = {dovada})",
                             "copii": [c.get("eticheta") for c in g.get("copii", [])]})
                nod["copii"][0]["copii"].remove(g)
    return excl


FILE_PERSONALE = ("TabDeveloper",)   # file afișate de o setare a omului, nu de Office implicit (contract R4: profil curat)
NOTA_RAND_PERSONAL = "scoasă: profilul curat al contractului R4 nu are Developer"


def _ids_personale(excluse):
    """id-urile filelor personale: cele fixe + cele scrise în excluse_personal ca „fila X (TabId)”"""
    ids = set(FILE_PERSONALE)
    for e in excluse or []:
        m = re.match(r"fila .*\((Tab\w+)\)", str(e.get("ce", "")))
        if m:
            ids.add(m.group(1))
    return ids


def _e_fila_personala(nod, ids):
    return nod.get("tip") == "TabItem" and (nod.get("id_mso") in ids or nod.get("eticheta") == "Developer")


def file_personale_ramase(supr, excluse=None):
    """(cale, nod) pentru fiecare TabItem al unei file personale rămas în ORICE suprafață (rândul filelor inclus)"""
    ids = _ids_personale(excluse)
    gasite = []

    def umbla(nod, cale):
        if not isinstance(nod, dict):
            return
        if _e_fila_personala(nod, ids):
            gasite.append((cale, nod))
        for i, c in enumerate(nod.get("copii") or []):
            umbla(c, f"{cale}/{i}:{c.get('eticheta', '?') if isinstance(c, dict) else '?'}")
    for k, nod in supr.items():
        umbla(nod, k)
    return gasite


def scoate_file_personale_din_rand(supr, excluse=None):
    """Scoate TabItem-ul filelor personale (Developer) din rândul filelor și din orice altă listă de file, iar filele de
    după el le mută la stânga cu cât ocupa fila scoasă (filele stau lipite: x_următoarei − x_celei scoase, măsurat în
    același rând), ca rândul să fie al unui profil curat. Bara „Share” și celelalte elemente care nu sunt TabItem rămân pe
    loc (sunt ancorate la dreapta). Întoarce notele pentru excluse_personal."""
    ids = _ids_personale(excluse)
    note = []

    def umbla(nod, cale):
        if not isinstance(nod, dict):
            return
        copii = nod.get("copii") or []
        i = 0
        while i < len(copii):
            c = copii[i]
            if isinstance(c, dict) and _e_fila_personala(c, ids):
                urm = [x for x in copii[i + 1:] if isinstance(x, dict) and x.get("tip") == "TabItem"]
                mutate = []
                if urm:
                    for camp in ("rect_css", "rect_brut"):
                        if c.get(camp) and urm[0].get(camp):
                            dx = urm[0][camp][0] - c[camp][0]
                            for x in urm:
                                if x.get(camp):
                                    vechi = x[camp][0]
                                    x[camp][0] = type(vechi)(vechi - dx)
                                    if camp == "rect_css":
                                        mutate.append(f"{x.get('eticheta')}: x {vechi} -> {x[camp][0]}")
                copii.pop(i)
                note.append({"ce": f"fila {c.get('eticheta')} ({c.get('id_mso')}) din {cale}", "motiv": NOTA_RAND_PERSONAL,
                             "filele_mutate_la_stanga": mutate,
                             "cum": "filele de după ea mutate la stânga cu x_următoarei − x_ei (filele stau lipite în rândul "
                                    "măsurat, cu 1 px între ele); dedus din rândul măsurat, nu re-măsurat într-un profil fără "
                                    "Developer"})
                continue
            umbla(c, f"{cale}/{c.get('eticheta', '?') if isinstance(c, dict) else '?'}")
            i += 1
    for k, nod in supr.items():
        umbla(nod, k)
    return note


def scoate_personale_din_fisier(app):
    """Aplică scoate_file_personale_din_rand pe uia_<app>.json DEJA scris (fără Office, fără dump nou)."""
    p = AICI / f"uia_{app}.json"
    d = json.loads(p.read_text(encoding="utf-8"))
    note = scoate_file_personale_din_rand(d["suprafete"], d.get("excluse_personal"))
    if note:
        d.setdefault("excluse_personal", []).extend(note)
        p.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    for n in note:
        print(f"- {app}: {n['ce']} — {n['motiv']}; mutate: {', '.join(n['filele_mutate_la_stanga']) or 'niciuna'}")
    print(len(note))
    return 0


def reuniune_rect(nod):
    """rect_css pentru rădăcinile construite de script (meniuri, rânduri): reuniunea dreptunghiurilor copiilor."""
    rs = [c["rect_css"] for c in nod.get("copii", []) if c.get("rect_css")]
    if not rs:
        return None
    x0 = min(r[0] for r in rs)
    y0 = min(r[1] for r in rs)
    x1 = max(r[0] + r[2] for r in rs)
    y1 = max(r[1] + r[3] for r in rs)
    return [round(x0, 1), round(y0, 1), round(x1 - x0, 1), round(y1 - y0, 1)]


def scrie(app, normal):
    supr = normal.supr
    for nod in supr.values():
        if not nod.get("rect_css"):
            nod["rect_css"] = reuniune_rect(nod)
    excl = list(getattr(normal, "excluse", []))
    excl += scoate_personale(app, supr, None)
    excl += scoate_file_personale_din_rand(supr, excl)   # și TabItem-ul Developer din rândul filelor (17.11.2026)
    saec = compara_saec(app, supr)
    out = {
        "aplicatie": app,
        "versiune": versiune_exe(APPS[app]["exe"]),
        "versiune_com_build": normal.build,
        "produs": produs_office(),
        "generat": time.strftime("%Y-%m-%d %H:%M"),
        "mod_pornire": (f"normal: {APPS[app]['exe']} {' '.join(APPS[app]['args'])} (instanță nouă) pe desktop ascuns "
                        f"'{DESKTOP}', interfață engleză, profilul omului; personalizările lui scoase pe dovezi "
                        f"(excluse_personal). /safe NU a fost folosit: la pornire cere o alegere de setare "
                        f"(fereastra 'Default File Types'), vezi README_referinte.md"),
        "dpi_factor": normal.f,
        "dpi": normal.dpi,
        "fereastra": normal.fereastra_css if getattr(normal, "fereastra_css", None) else None,
        "fereastra_brut": normal.fereastra_brut,
        "nota_rect": "rect_css = [x, y, lățime, înălțime] în pixeli CSS la 100% DPI, față de colțul stânga-sus al "
                     "cadrului VIZIBIL al ferestrei; rect_brut = pixeli fizici pe ecranul desktopului ascuns",
        "suprafete": supr,
        "excluse_personal": excl,
        "sarite_cont": sorted(set(normal.sarite)),
        "redactari": normal.cur.redactari,
        "nedeschise": normal.nedeschise,
        "acces_rapid_implicit": "[NEVERIFICAT] Word are bara Acces rapid ascunsă, Excel și PowerPoint o au afișată, "
                                "în același profil; paginile Microsoft se contrazic asupra stării implicite (vezi "
                                "surse_microsoft.md). Referința păstrează starea găsită, pe aplicație.",
        "comparatie_saec": saec,
        "erori": normal.erori,
        "jurnal": LOG,
    }
    text = json.dumps(out, ensure_ascii=False, indent=1)
    for x in normal.cur.interzise:   # ultima plasă: niciun nume interzis în fișier
        if re.search(r"(?<![a-zăâîșț])" + re.escape(x) + r"(?![a-zăâîșț])", text.lower()):
            raise RuntimeError("un nume interzis a rămas în ieșire — NU scriu fișierul")
    p = AICI / f"uia_{app}.json"
    p.write_text(text, encoding="utf-8")
    return p


def principal(app):
    if app not in APPS:
        print(f"aplicație necunoscută: {app}", file=sys.stderr)
        return 2
    if nume_desktop_curent().lower() == "default" and "--permite-ecran" not in sys.argv:
        print("REFUZ: rulez pe desktopul VIZIBIL al omului. Pornește-mă prin hidden_desktop.py (vezi docstring).",
              file=sys.stderr)
        return 2
    if app == "powerpoint" and ruleaza_deja("POWERPNT.EXE"):
        print("SĂRIT: POWERPNT.EXE rulează deja (o singură instanță; Quit i-ar închide prezentările).")
        return 3
    init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    t0 = time.time()
    normal = rulare_normala(app)
    p = scrie(app, normal)
    print(f"{p} — {len(normal.supr)} suprafețe, {sum(numara(v) for v in normal.supr.values())} noduri, "
          f"{len(normal.erori)} erori, {round(time.time() - t0)} s")
    return 0


# ---------------------------------------------------------------- verificare (oracol al livrabilului)
CERUTE = {"bara_titlu", "acces_rapid", "file_panglicii", "bara_stare", "backstage.Home", "backstage.New",
          "backstage.Open", "backstage.Save As", "backstage.Print"}
CTX_CERUTE = {"word": ["text"], "excel": ["celula", "fila_foii"], "powerpoint": ["diapozitiv", "miniatura"]}


def verifica():
    probleme = []
    for app in APPS:
        p = AICI / f"uia_{app}.json"
        if not p.exists():
            probleme.append(f"{app}: lipsește {p.name}")
            continue
        d = json.loads(p.read_text(encoding="utf-8"))
        for k in ("aplicatie", "versiune", "generat", "mod_pornire", "dpi_factor", "fereastra", "suprafete",
                  "excluse_personal"):
            if k not in d:
                probleme.append(f"{app}: cheia {k} lipsește")
        s = d.get("suprafete", {})
        ned = {x["suprafata"] for x in d.get("nedeschise", [])}
        for c in CERUTE:
            if c not in s and c not in ned:
                probleme.append(f"{app}: suprafața {c} lipsește și nu e explicată în 'nedeschise'")
        for c in CTX_CERUTE[app]:
            k = f"meniu_contextual.{c}"
            if k not in s and k not in ned:
                probleme.append(f"{app}: {k} lipsește și nu e explicat")
        for m in DIALOGURI[app]:
            if not any(k.startswith(f"dialog.{m}") or k == f"panou.{m}" for k in s) and f"dialog.{m}" not in ned:
                probleme.append(f"{app}: dialog.{m} lipsește și nu e explicat")
        if app == "powerpoint" and "panou.LaunchFormatBackground" not in s and "panou.LaunchFormatBackground" not in ned:
            probleme.append(f"{app}: panou.LaunchFormatBackground lipsește și nu e explicat")
        file_ = [k for k in s if k.startswith("panglica.")]
        if len(file_) < 8:
            probleme.append(f"{app}: doar {len(file_)} file capturate")
        if "panglica.TabDeveloper" in s:
            probleme.append(f"{app}: fila Developer (personală) a intrat în referință")
        # 17.11.2026 (verificare_etapa0.md, punctul 4): și TabItem-ul din RÂNDUL filelor (file_panglicii) sau din orice altă
        # listă de file — înainte se căuta doar suprafața panglica.TabDeveloper, iar fila din rând trecea neobservată
        for cale, nod in file_personale_ramase(s, d.get("excluse_personal", [])):
            probleme.append(f"{app}: fila personală „{nod.get('eticheta')}” ({nod.get('id_mso')}) e încă în {cale}")
        if d.get("fereastra") and (abs(d["fereastra"][0] - 1366) > 1 or abs(d["fereastra"][1] - 768) > 1):
            probleme.append(f"{app}: fereastra {d['fereastra']} nu e 1366×768 css")
        text = p.read_text(encoding="utf-8")
        for x in filter(None, (os.environ.get("USERNAME"),)):
            if x.lower() in text.lower():
                probleme.append(f"{app}: numele de utilizator Windows apare în fișier")
        if re.search(r"[\w.+-]+@[\w-]+\.[a-z]{2,}", text):
            probleme.append(f"{app}: o adresă de e-mail apare în fișier")
        if any("Traceback" in e for e in d.get("erori", [])):
            probleme.append(f"{app}: rularea a avut o excepție (vezi 'erori')")
    for x in probleme:
        print("-", x)
    print(len(probleme))
    return 0 if not probleme else 1


def toate():
    sys.path.insert(0, str(HIDDEN.parent))
    import hidden_desktop
    cod = 0
    for app in APPS:
        r = hidden_desktop.run([sys.executable, str(Path(__file__).resolve()), app], timeout=900, desktop=DESKTOP)
        print(app, "->", r["returncode"], "timeout" if r["timed_out"] else "", (r["output"] or "")[-400:],
              (r["stderr"] or "")[-800:])
        cod = cod or (0 if r["success"] else 1)
    return cod


if __name__ == "__main__":
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd == "verifica":
        sys.exit(verifica())
    if cmd == "scoate_personale":   # pe JSON-ul deja scris, fără Office: python dump_uia_office.py scoate_personale excel
        sys.exit(scoate_personale_din_fisier(sys.argv[2] if len(sys.argv) > 2 else ""))
    if cmd == "toate":
        sys.exit(toate())
    sys.exit(principal(cmd))
