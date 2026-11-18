# -*- coding: utf-8 -*-
"""dump_shell_uia.py — referința de INTERFAȚĂ pentru Windows 11 (RO) și File Explorer: citește cu UI Automation
arborele unei suprafețe (etichetă, tip, clasă, id, scurtătură, dreptunghi normalizat la 100% DPI) și îl adaugă în
referinte/uia_windows.json sau referinte/uia_explorer.json. DOAR CITIRE: nu mișcă mouse-ul, nu apasă taste, nu
deschide nimic pe ecranul omului (campania „Aplicațiile fidele”, Etapa 0, 16.11.2026).

Subcomenzi:
  lista                         suprafețele: ce deschide omul, în ce fișier intră
  pregateste                    creează folderul neutru %TEMP%\\lh_explorer_ref\\sesiune (fișiere fără date) pentru sesiune
  captura <suprafata> --cu-omul [--max 90]
                                DOAR în sesiunea cu omul, pe ecranul lui: pornește ÎNAINTE ca el să deschidă suprafața;
                                așteaptă s-o vadă apărând, o citește, bip, o adaugă în JSON. Fără --cu-omul refuză pe
                                desktopul „Default”. Ultima linie: 0 = capturată și curată, 1 = nu.
  proba [--max 20]              AUTOVERIFICARE pe desktopul ascuns (se relansează singură acolo): deschide, în procesul ei,
                                fereastra Proprietăți a unui fișier temporar (SHObjectProperties), o citește fila cu filă cu
                                ACELAȘI cod ca în sesiune și verifică: fereastra e în procesul ei, file ≥ 2, OK/Anulare
                                prezente, dreptunghiuri în fereastră, zero date personale. Dacă trece, o adaugă ca suprafața
                                „proprietati_fisier” în uia_explorer.json. Ultima linie = numărul de probleme.
  verifica [fisier ...]         caută date personale (cont, calculator, nume afișat, e-mail, telefon) în fișierele date
                                (implicit uia_windows.json + uia_explorer.json). Ultima linie = numărul de potriviri.
Formatul unui nod: {"nume", "tip" (ControlType UIA, ex. Button/MenuItem), "tip_local", "clasa", "id" (AutomationId),
"rect": [x, y, l, h] față de colțul ferestrei, la 100% DPI, opțional "scurtatura", "tasta_acces", "dezactivat",
"in_afara_ecranului", "bifat", "selectat", "extins", "valoare", "copii": [...]}. Contul (MeControl/Account) e sărit;
numele de fișiere/elemente recente străine de sesiune sunt înlocuite cu „[… ascuns]”.
"""
import ctypes
import json
import os
import re
import sys
import time
from ctypes import wintypes as wt, byref
from pathlib import Path

AICI = Path(__file__).resolve().parent
MOTOR = AICI / 'explorer_motor'
UNELTE = Path(r'C:/00/AI_0/tools')
SESIUNE = Path(os.environ.get('TEMP', '.')) / 'lh_explorer_ref' / 'sesiune'
PROBA_DIR = Path(os.environ.get('TEMP', '.')) / 'lh_explorer_ref' / 'proba'

u32 = ctypes.WinDLL('user32', use_last_error=True)
k32 = ctypes.WinDLL('kernel32', use_last_error=True)
try:
    u32.SetProcessDpiAwarenessContext(ctypes.c_void_p(-4))      # per-monitor v2: dreptunghiuri în pixeli fizici
except Exception:
    pass

# ---------------------------------------------------------------- suprafețele
FISIERE_SESIUNE = ['tema.docx', 'poza.png', 'notite.txt', 'fișier2.txt', 'fișier10.txt', 'Proiect/']
SUPRAFETE = {
    # --- Windows (uia_windows.json)
    'bara_activitati': {'fisier': 'uia_windows.json', 'mod': 'clasa', 'clase': ['Shell_TrayWnd', 'Shell_SecondaryTrayWnd'],
                        'ce_e': 'bara de activități (cu butonul Start, căutarea, aplicațiile fixate, zona de notificare)',
                        'omul': 'nimic de deschis: doar să nu fie ascunsă bara (o citesc direct)'},
    'start': {'fisier': 'uia_windows.json', 'mod': 'nou_sau_prim_plan', 'procese': ['startmenuexperiencehost.exe'],
              'ce_e': 'meniul Start (Fixate + Recomandate)', 'omul': 'apasă tasta Windows o dată și lasă meniul deschis'},
    'start_toate': {'fisier': 'uia_windows.json', 'mod': 'nou_sau_prim_plan', 'procese': ['startmenuexperiencehost.exe'],
                    'intarziere': 4.0, 'ce_e': 'meniul Start, lista „Toate” aplicațiile',
                    'omul': 'tasta Windows, apoi imediat clic pe „Toate” (ai 4 secunde) și lasă lista deschisă'},
    'meniu_desktop': {'fisier': 'uia_windows.json', 'mod': 'nou', 'procese': ['explorer.exe'],
                      'ce_e': 'meniul de clic dreapta pe desktop (cel nou, Windows 11)', 'omul': 'clic dreapta pe un loc GOL de pe desktop'},
    'meniu_desktop_clasic': {'fisier': 'uia_windows.json', 'mod': 'nou', 'procese': ['explorer.exe'], 'clase': ['#32768'], 'intarziere': 1.2,
                             'ce_e': 'meniul clasic de pe desktop („Afișați mai multe opțiuni”)',
                             'omul': 'clic dreapta pe desktop, apoi „Afișați mai multe opțiuni”'},
    # --- File Explorer (uia_explorer.json)
    'explorer_fereastra': {'fisier': 'uia_explorer.json', 'mod': 'prim_plan', 'procese': ['explorer.exe'], 'clase': ['CabinetWClass'],
                           'titlu': 'sesiune', 'intarziere': 1.5,
                           'ce_e': 'fereastra File Explorer pe folderul de sesiune: bara de comenzi, adresa, panoul de navigare, lista, bara de stare',
                           'omul': 'deschide folderul de sesiune (îl lipesc eu în bara de adresă a Explorer-ului deschis de tine) și dă clic pe fereastră'},
    'explorer_meniu_nou': {'fisier': 'uia_explorer.json', 'mod': 'nou', 'procese': ['explorer.exe'],
                           'ce_e': 'meniul butonului „Nou” din bara de comenzi', 'omul': 'clic pe „Nou” (sus, în stânga) și lasă meniul deschis'},
    'explorer_meniu_sortare': {'fisier': 'uia_explorer.json', 'mod': 'nou', 'procese': ['explorer.exe'],
                               'ce_e': 'meniul butonului „Sortare”', 'omul': 'clic pe „Sortare” și lasă meniul deschis'},
    'explorer_meniu_vizualizare': {'fisier': 'uia_explorer.json', 'mod': 'nou', 'procese': ['explorer.exe'], 'intarziere': 3.0,
                                   'ce_e': 'meniul butonului „Vizualizare” (cu submeniul „Afișare” deschis)',
                                   'omul': 'clic pe „Vizualizare”, apoi imediat mouse-ul peste „Afișare” (ai 3 secunde)'},
    'explorer_meniu_fisier': {'fisier': 'uia_explorer.json', 'mod': 'nou', 'procese': ['explorer.exe'],
                              'ce_e': 'meniul de clic dreapta pe un fișier (cel nou, cu pictogramele sus)', 'omul': 'clic dreapta pe tema.docx'},
    'explorer_meniu_fisier_clasic': {'fisier': 'uia_explorer.json', 'mod': 'nou', 'procese': ['explorer.exe'], 'clase': ['#32768'],
                                     'ce_e': 'meniul clasic al fișierului („Afișați mai multe opțiuni”)',
                                     'omul': 'clic dreapta pe tema.docx, apoi „Afișați mai multe opțiuni”'},
    'explorer_meniu_fundal': {'fisier': 'uia_explorer.json', 'mod': 'nou', 'procese': ['explorer.exe'],
                              'ce_e': 'meniul de clic dreapta pe locul gol din folder', 'omul': 'clic dreapta pe un loc gol din lista de fișiere'},
    'explorer_proprietati': {'fisier': 'uia_explorer.json', 'mod': 'nou_sau_prim_plan', 'procese': ['explorer.exe'], 'clase': ['#32770'],
                             'ce_e': 'fereastra Proprietăți a unui fișier, deschisă din Explorer (martor pentru „proprietati_fisier”)',
                             'omul': 'clic pe tema.docx, apoi Alt+Enter'},
}
ZGOMOT = {'SysShadow', 'tooltips_class32', 'IME', 'MSCTFIME UI', 'UAC_InputIndicatorOverlayWnd', 'UAC Input Indicator',
          'Windows.UI.Core.CoreWindow#tooltip'}

# ---------------------------------------------------------------- date personale
def _nume_afisat():
    try:
        sec = ctypes.WinDLL('secur32')
        n = ctypes.c_ulong(0)
        sec.GetUserNameExW(3, None, byref(n))
        b = ctypes.create_unicode_buffer(n.value + 1)
        if sec.GetUserNameExW(3, b, byref(n)):
            return b.value
    except Exception:
        pass
    return ''


def _inlocuiri():
    out = []
    for v, cu in ((os.environ.get('TEMP', ''), '%TEMP%'), (os.environ.get('USERPROFILE', ''), '%USERPROFILE%'),
                  (os.environ.get('USERNAME', ''), '[utilizator]'), (os.environ.get('COMPUTERNAME', ''), '[calculator]'),
                  (_nume_afisat(), '[utilizator]')):
        if v and len(v) >= 3:
            out.append((v, cu))
            if '\\' in v:
                out.append((v.replace('\\', '/'), cu))
    return out


def _parti_nume():
    """Părțile numelui afișat al contului: se caută doar ca CUVINTE întregi (nu în interiorul altor cuvinte)."""
    return [re.compile(r'(?<!\w)' + re.escape(p) + r'(?!\w)', re.I) for p in _nume_afisat().split() if len(p) >= 4]


INLOC = _inlocuiri()
PARTI = _parti_nume()
RE_EMAIL = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+')
RE_TEL = re.compile(r'\+?4?0?\s?7\d{2}[\s.]?\d{3}[\s.]?\d{3}')
RE_FISIER = re.compile(r'\w\.(docx?|xlsx?|pptx?|pdf|txt|png|jpe?g|gif|bmp|webp|mp[34]|wav|zip|rar|7z|csv|od[tsp]|html?|py|ahk|lnk)\b', re.I)
UI_PERMISE = {'mai multe', 'mai puține', 'toate', 'more', 'all', 'înapoi', 'back', 'următorul', 'anteriorul'}
RE_SID = re.compile(r'S-1-\d+(-\d+){2,}')
RE_TOKEN_FISIER = re.compile(r'[^\s\\/:"<>|]+\.(?:docx?|xlsx?|pptx?|pdf|txt|png|jpe?g|gif|bmp|webp|mp[34]|wav|zip|rar|7z|csv|od[tsp]|html?|py|ahk|lnk)\b', re.I)
RE_CONT_IN_LISTA = re.compile(r'\[utilizator\]|\[calculator\]|\[SID\]|\[email\]|Cont necunoscut|Unknown account', re.I)


def fisier_strain(s):
    """Are un nume de fișier care NU e al sesiunii/probei? (titlurile cu numele altor documente se ascund)"""
    tok = [t.lower() for t in RE_TOKEN_FISIER.findall(s)] if RE_FISIER.search(s) else []
    return any(t not in PERMISE for t in tok) if tok else bool(RE_FISIER.search(s))
RE_CONT = re.compile(r'MeControl|Account|UserTile|AccountPicture|ProfilePicture|PersonPicture|UserName|Avatar', re.I)
RE_RECENT = re.compile(r'Recomandat|Recommended|Recent|Acces rapid|Quick access|Favorite', re.I)
NAV_STANDARD = {'acasă', 'galerie', 'onedrive', 'acest pc', 'desktop', 'descărcări', 'documente', 'imagini', 'muzică',
                'videoclipuri', 'rețea', 'linux', 'coș de reciclare', 'acces rapid', 'favorite', 'biblioteci', 'home',
                'gallery', 'this pc', 'network', 'recycle bin', 'downloads', 'documents', 'pictures', 'music', 'videos'}
PERMISE = {x.rstrip('/').lower() for x in FISIERE_SESIUNE} | {'sesiune', 'lh_explorer_ref', 'proba', 'temp', 'local', 'appdata'}


def curata(s):
    if not isinstance(s, str) or not s:
        return s
    for v, cu in INLOC:
        i = s.lower().find(v.lower())
        while i >= 0:
            s = s[:i] + cu + s[i + len(v):]
            i = s.lower().find(v.lower(), i + len(cu))
    for rx in PARTI:
        s = rx.sub('[nume]', s)
    s = RE_SID.sub('[SID]', s)
    s = RE_EMAIL.sub('[email]', s)
    s = RE_TEL.sub('[telefon]', s)
    return s


def potriviri_personale(text):
    gas = []
    for v, _cu in INLOC:
        if v.lower() in text.lower():
            gas.append('inlocuire:' + _cu)
    for rx in PARTI:
        if rx.search(text):
            gas.append('nume afisat')
    if RE_SID.search(text):
        gas.append('SID de cont')
    if RE_EMAIL.search(text):
        gas.append('email')
    if RE_TEL.search(text):
        gas.append('telefon')
    return gas


# ---------------------------------------------------------------- ferestre (fără UIA)
dwm = ctypes.WinDLL('dwmapi')


def nume_proces(pid):
    h = k32.OpenProcess(0x1000, False, pid)       # PROCESS_QUERY_LIMITED_INFORMATION
    if not h:
        return ''
    try:
        buf = ctypes.create_unicode_buffer(520)
        n = wt.DWORD(520)
        if k32.QueryFullProcessImageNameW(h, 0, buf, byref(n)):
            return os.path.basename(buf.value).lower()
        return ''
    finally:
        k32.CloseHandle(h)


def ascunsa_dwm(h):
    v = wt.DWORD(0)
    try:
        dwm.DwmGetWindowAttribute(wt.HWND(h), 14, byref(v), 4)     # DWMWA_CLOAKED
    except Exception:
        return False
    return v.value != 0


def ferestre_vizibile():
    out = {}
    CB = ctypes.WINFUNCTYPE(wt.BOOL, wt.HWND, wt.LPARAM)

    def cb(h, _):
        if u32.IsWindowVisible(h) and not ascunsa_dwm(h):
            cls = ctypes.create_unicode_buffer(256)
            u32.GetClassNameW(h, cls, 256)
            pid = wt.DWORD()
            u32.GetWindowThreadProcessId(h, byref(pid))
            r = wt.RECT()
            u32.GetWindowRect(h, byref(r))
            out[h] = {'clasa': cls.value, 'pid': pid.value, 'arie': max(0, r.right - r.left) * max(0, r.bottom - r.top)}
        return True
    u32.EnumWindows(CB(cb), 0)
    return out


def desktop_curent():
    h = u32.GetThreadDesktop(k32.GetCurrentThreadId())
    buf = ctypes.create_unicode_buffer(256)
    n = ctypes.c_ulong()
    u32.GetUserObjectInformationW(h, 2, buf, 512, byref(n))
    return buf.value


def versiune_windows():
    import winreg
    try:
        k = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r'SOFTWARE\Microsoft\Windows NT\CurrentVersion')
        g = lambda n: winreg.QueryValueEx(k, n)[0]
        return {'versiune': g('DisplayVersion'), 'build': str(g('CurrentBuild')) + '.' + str(g('UBR')),
                'limba_interfetei_LANGID': k32.GetUserDefaultUILanguage()}
    except OSError:
        return {}


# ---------------------------------------------------------------- UI Automation: citirea arborelui (o singură cerere cu cache)
class Cititor:
    def __init__(self):
        import comtypes.client
        comtypes.client.GetModule('UIAutomationCore.dll')
        from comtypes.gen import UIAutomationClient as U
        self.U = U
        self.ua = comtypes.client.CreateObject(U.CUIAutomation, interface=U.IUIAutomation)
        self.CT = {getattr(U, n): n[4:-len('ControlTypeId')] for n in dir(U) if n.startswith('UIA_') and n.endswith('ControlTypeId')}
        cr = self.ua.CreateCacheRequest()
        self.P = {'nume': 30005, 'ct': 30003, 'loc': 30004, 'clasa': 30012, 'id': 30011, 'rect': 30001, 'offscreen': 30022,
                  'enabled': 30010, 'accel': 30006, 'access': 30007, 'toggle': 30086, 'selectat': 30079, 'extins': 30070,
                  'valoare': 30045}
        for pid in self.P.values():
            cr.AddProperty(pid)
        cr.TreeScope = U.TreeScope_Subtree
        self.cr = cr

    def element(self, hwnd):
        return self.ua.ElementFromHandle(hwnd)

    def citeste(self, hwnd, ctx, max_noduri=6000):
        el = self.ua.ElementFromHandle(hwnd).BuildUpdatedCache(self.cr)
        r = wt.RECT()
        u32.GetWindowRect(hwnd, byref(r))
        dpi = u32.GetDpiForWindow(hwnd) or 96
        s = dpi / 96.0
        ctx.update({'n': 0, 'max': max_noduri, 'taiat': False, 'ox': r.left, 'oy': r.top, 's': s})
        arbore = self._nod(el, ctx, 0, False)
        return {'rect_ecran_100': [round(r.left / s), round(r.top / s), round((r.right - r.left) / s), round((r.bottom - r.top) / s)],
                'dpi': dpi, 'scara': round(s, 3), 'arbore': arbore}

    def _val(self, e, cheie):
        try:
            v = e.GetCachedPropertyValue(self.P[cheie])
        except Exception:
            return None
        if isinstance(v, (bool, int, float, str)):
            return v
        return None

    def _nod(self, e, ctx, adanc, sub_recent):
        ctx['n'] += 1
        if ctx['n'] > ctx['max'] or adanc > 40:
            ctx['taiat'] = True
            return {'taiat': True}
        try:
            nume = e.CachedName or ''
            ct = e.CachedControlType
            cls = e.CachedClassName or ''
            aid = e.CachedAutomationId or ''
            loc = e.CachedLocalizedControlType or ''
        except Exception:
            return {'eroare': 'element dispărut'}
        tip = self.CT.get(ct, str(ct))
        if RE_CONT.search(aid) or RE_CONT.search(cls) or (nume and RE_CONT.search(nume) and tip in ('Button', 'Group', 'Pane')):
            ctx['ascunse_cont'] = ctx.get('ascunse_cont', 0) + 1
            return {'tip': tip, 'ascuns': 'cont (MeControl/Account) — sărit'}
        recent = sub_recent or bool(RE_RECENT.search(nume) or RE_RECENT.search(aid))
        nume_c = curata(nume)
        if nume_c and tip in ('ListItem', 'TreeItem', 'Text') and RE_CONT_IN_LISTA.search(nume_c):
            nume_c = '[cont ascuns]'                      # liste de conturi/grupuri (fila Securitate etc.)
            ctx['ascunse_cont'] = ctx.get('ascunse_cont', 0) + 1
        if nume_c and tip in ('ListItem', 'TreeItem', 'Button', 'MenuItem', 'DataItem', 'Hyperlink', 'Text', 'Edit', 'SplitButton',
                              'Window', 'TitleBar', 'TabItem'):
            simplu = nume_c.strip().lower()
            if RE_FISIER.search(nume_c) and fisier_strain(nume_c):
                nume_c = '[nume de fișier ascuns]'
                ctx['ascunse_continut'] = ctx.get('ascunse_continut', 0) + 1
            elif recent and tip in ('ListItem', 'Button', 'Hyperlink', 'TreeItem') and adanc > 1 and not RE_RECENT.search(nume) \
                    and simplu not in UI_PERMISE:
                if ctx.get('nav_permisa') and (simplu in NAV_STANDARD or simplu in PERMISE or re.search(r'\([A-Z]:\)$', nume_c)):
                    pass
                else:
                    nume_c = '[element recent ascuns]'
                    ctx['ascunse_continut'] = ctx.get('ascunse_continut', 0) + 1
            elif ctx.get('nav_permisa') and tip == 'TreeItem' and simplu not in NAV_STANDARD and simplu not in PERMISE \
                    and not re.search(r'\([A-Z]:\)$', nume_c) and not simplu.startswith('onedrive'):
                nume_c = '[element personal ascuns]'
                ctx['ascunse_continut'] = ctx.get('ascunse_continut', 0) + 1
            if simplu.startswith('onedrive - '):
                nume_c = 'OneDrive - [cont]'
        d = {'nume': nume_c, 'tip': tip}
        if loc:
            d['tip_local'] = loc
        if cls:
            d['clasa'] = cls
        if aid and not aid.isdigit():
            d['id'] = curata(aid)
        try:
            rc = e.CachedBoundingRectangle
            if rc.right > rc.left and rc.bottom > rc.top:
                s = ctx['s']
                d['rect'] = [round((rc.left - ctx['ox']) / s), round((rc.top - ctx['oy']) / s),
                             round((rc.right - rc.left) / s), round((rc.bottom - rc.top) / s)]
        except Exception:
            pass
        for cheie, nume_camp in (('accel', 'scurtatura'), ('access', 'tasta_acces')):
            v = self._val(e, cheie)
            if v:
                d[nume_camp] = v
        if self._val(e, 'enabled') is False:
            d['dezactivat'] = True
        if self._val(e, 'offscreen') is True:
            d['in_afara_ecranului'] = True
        tg = self._val(e, 'toggle')
        if isinstance(tg, int) and not isinstance(tg, bool):
            d['bifat'] = {0: False, 1: True, 2: 'nedeterminat'}.get(tg, tg)
        if self._val(e, 'selectat') is True:
            d['selectat'] = True
        ex = self._val(e, 'extins')
        if isinstance(ex, int) and not isinstance(ex, bool) and ex in (0, 1, 2):
            d['extins'] = {0: False, 1: True, 2: 'partial'}[ex]
        val = self._val(e, 'valoare')
        if val:
            val_c = curata(val)
            d['valoare'] = '[nume de fișier ascuns]' if fisier_strain(val_c) else val_c
        try:
            kids = e.GetCachedChildren()
            n_kids = kids.Length if kids else 0          # pointer NULL = frunză
        except (Exception, ValueError):
            kids, n_kids = None, 0
        if n_kids:
            d['copii'] = [self._nod(kids.GetElement(i), ctx, adanc + 1, recent) for i in range(n_kids)]
        return d


def numara(nod):
    if not isinstance(nod, dict):
        return 0
    return 1 + sum(numara(c) for c in nod.get('copii', []))


def toate(nod):
    if isinstance(nod, dict):
        yield nod
        for c in nod.get('copii', []):
            yield from toate(c)


# ---------------------------------------------------------------- scriere
def adauga_suprafata(fisier, cheie, rec):
    p = AICI / fisier
    try:
        D = json.loads(p.read_text(encoding='utf-8'))
    except (OSError, ValueError):
        D = {}
    D.setdefault('_despre', {
        'ce': 'Referința înghețată de interfață (UI Automation) pentru Windows 11 RO / File Explorer — campania „Aplicațiile fidele”.',
        'format_nod': 'nume, tip (ControlType UIA), tip_local, clasa, id (AutomationId), rect [x, y, lățime, înălțime] față de colțul '
                      'ferestrei, la 100% DPI; opțional scurtatura, tasta_acces, dezactivat, in_afara_ecranului, bifat, selectat, '
                      'extins, valoare, copii',
        'date_personale': 'contul (MeControl/Account) e sărit; numele contului/calculatorului înlocuite cu [utilizator]/[calculator]; '
                          'fișierele și elementele recente străine de sesiune = „[… ascuns]”',
        'scris_de': 'referinte/dump_shell_uia.py'})
    D.setdefault('suprafete', {})[cheie] = rec
    txt = json.dumps(D, ensure_ascii=False, indent=1) + '\n'
    gas = potriviri_personale(txt)
    if gas:
        raise RuntimeError('REFUZ să scriu: date personale în rezultat: ' + ', '.join(sorted(set(gas))))
    tmp = p.with_suffix('.tmp')
    tmp.write_text(txt, encoding='utf-8')
    os.replace(tmp, p)
    return p


def inregistrare(cheie, sup, ferestre, sursa):
    noduri = sum(numara(f.get('arbore')) + sum(numara(x.get('arbore')) for x in f.get('file', [])) for f in ferestre)
    return {'suprafata': cheie, 'ce_e': sup.get('ce_e', ''), 'capturat': time.strftime('%Y-%m-%d %H:%M'), 'sursa': sursa,
            'windows': versiune_windows(), 'ferestre': ferestre, 'noduri': noduri}


# ---------------------------------------------------------------- captura (sesiunea cu omul)
def gaseste(sup, baza, t_max):
    t0 = time.time()
    mod = sup['mod']
    procese = sup.get('procese')
    clase = sup.get('clase')
    while time.time() - t0 < t_max:
        acum = ferestre_vizibile()
        if mod == 'clasa':
            alese = [h for h, i in acum.items() if i['clasa'] in clase]
            if alese:
                return alese
        else:
            def bun(h, i):
                if i['clasa'] in ZGOMOT:
                    return False
                if procese and nume_proces(i['pid']) not in procese:
                    return False
                if sup.get('titlu'):                 # ex. Explorer-ul abia DUPĂ ce a ajuns în folderul de sesiune
                    b = ctypes.create_unicode_buffer(512)
                    u32.GetWindowTextW(h, b, 512)
                    if sup['titlu'].lower() not in b.value.lower():
                        return False
                return not clase or i['clasa'] in clase
            def candidati(acum):
                noi = [h for h, i in acum.items() if h not in baza and bun(h, i)]
                if clase and mod == 'nou':
                    noi += [h for h, i in acum.items() if h in baza and bun(h, i) and i['clasa'] == '#32768']
                if mod in ('prim_plan', 'nou_sau_prim_plan'):
                    fg = u32.GetForegroundWindow()
                    if fg in acum and bun(fg, acum[fg]) and fg not in noi:
                        noi = [fg] + noi             # fereastra din prim-plan a procesului cerut (deja deschisă)
                return noi
            noi = candidati(acum)
            if noi:
                time.sleep(sup.get('intarziere', 0.7))   # animația + al doilea clic al omului (submeniu, „Toate”)
                acum = ferestre_vizibile()
                noi = [h for h in candidati(acum) if h in acum]
                if noi:
                    return sorted(noi, key=lambda h: -acum[h]['arie'])
        time.sleep(0.25)
    return []


def cmd_captura(cheie, cu_omul, t_max):
    if cheie not in SUPRAFETE:
        print('suprafață necunoscută; vezi: lista')
        print(1)
        return 1
    if desktop_curent().lower() == 'default' and not cu_omul:
        print('REFUZ: acesta e ecranul omului. Captura se face DOAR în sesiunea cu el, cu --cu-omul.')
        print(1)
        return 1
    sup = SUPRAFETE[cheie]
    baza = ferestre_vizibile()
    print('aștept:', sup['omul'], '(max', t_max, 's)', flush=True)
    hs = gaseste(sup, baza, t_max)
    if not hs:
        print('nu a apărut nicio fereastră potrivită în', t_max, 's')
        print(1)
        return 1
    cit = Cititor()
    ferestre, ctx_tot = [], {}
    for h in hs[:4]:
        info = ferestre_vizibile().get(h, {})
        ctx = {'nav_permisa': cheie.startswith('explorer')}
        try:
            f = cit.citeste(h, ctx)
        except Exception as ex:
            f = {'eroare': str(ex)[:200], 'arbore': None}
        pid = info.get('pid') or 0
        f.update({'clasa': info.get('clasa'), 'proces': nume_proces(pid), 'noduri': numara(f.get('arbore')),
                  'taiat': ctx.get('taiat', False), 'ascunse_cont': ctx.get('ascunse_cont', 0),
                  'ascunse_continut': ctx.get('ascunse_continut', 0)})
        ferestre.append(f)
    if desktop_curent().lower() == 'default':
        try:
            import winsound
            winsound.MessageBeep()                    # semnalul pentru om: „gata, poți închide”
        except Exception:
            pass
    rec = inregistrare(cheie, sup, ferestre, sup.get('sursa', 'UI Automation pe ecranul omului, în sesiunea cu el (doar citire)'))
    try:
        p = adauga_suprafata(sup['fisier'], cheie, rec)
    except RuntimeError as ex:
        print(ex)
        print(1)
        return 1
    for f in ferestre:
        print(' fereastra', f.get('clasa'), f.get('proces'), 'noduri', f.get('noduri'), 'rect100', f.get('rect_ecran_100'),
              'ascunse cont/conținut', f.get('ascunse_cont'), f.get('ascunse_continut'), 'tăiat' if f.get('taiat') else '')
    print('scris în', p.name, '->', cheie, '|', rec['noduri'], 'noduri')
    print(0 if rec['noduri'] >= 5 else 1)
    return 0 if rec['noduri'] >= 5 else 1


# ---------------------------------------------------------------- proba pe desktopul ascuns (Proprietăți, în procesul acesta)
def plasa_de_siguranta(token):
    """Dacă fereastra NU a apărut în procesul meu: o caut pe desktopul „Default” DOAR după titlul cu numele unic al
    fișierului meu și o închid (WM_CLOSE). Nu citesc nimic altceva de acolo."""
    inchise = 0
    hd = u32.OpenDesktopW('Default', 0, False, 0x0001 | 0x0040)   # DESKTOP_READOBJECTS | DESKTOP_ENUMERATE
    if not hd:
        return -1
    CB = ctypes.WINFUNCTYPE(wt.BOOL, wt.HWND, wt.LPARAM)

    def cb(h, _):
        nonlocal inchise
        b = ctypes.create_unicode_buffer(512)
        u32.GetWindowTextW(h, b, 512)
        if token in b.value:
            u32.PostMessageW(h, 0x0010, 0, 0)
            inchise += 1
        return True
    u32.EnumDesktopWindows(hd, CB(cb), 0)
    u32.CloseDesktop(hd)
    return inchise


def cmd_proba(t_max):
    if desktop_curent().lower() == 'default':
        sys.path.insert(0, str(UNELTE))
        from hidden_desktop import HiddenProcess
        hp = HiddenProcess([sys.executable, str(Path(__file__).resolve()), 'proba', '--max', str(t_max)])
        try:
            cod = hp.wait(t_max + 90)
            if cod is None:
                hp.kill_tree()
                hp.wait(10)
            out, err = hp.read_output()
        finally:
            hp.close()
        out = curata(out)
        if err.strip():
            print('--- stderr (desktopul ascuns) ---')
            print(curata(err[-1500:]))
        print(out.rstrip())
        linii = [x for x in out.strip().splitlines() if x.strip()]
        if cod is None or not linii or not re.fullmatch(r'-?\d+', linii[-1].strip()):
            print('proba pe desktopul ascuns nu s-a terminat curat (cod', cod, ')')
            print(1)
            return 2
        return 0 if linii[-1].strip() == '0' else 1

    probleme = []
    PROBA_DIR.mkdir(parents=True, exist_ok=True)
    token = 'lhref_proba_' + str(os.getpid()) + '.docx'
    PERMISE.add(token.lower())
    f = PROBA_DIR / token
    f.write_text('fișier de probă, fără conținut', encoding='utf-8')
    baza = ferestre_vizibile()
    sh32 = ctypes.WinDLL('shell32')
    sh32.SHObjectProperties.argtypes = [wt.HWND, wt.DWORD, wt.LPCWSTR, wt.LPCWSTR]
    ok = sh32.SHObjectProperties(None, 2, str(f), None)          # SHOP_FILEPATH
    print('SHObjectProperties ->', bool(ok), flush=True)
    sup = {'mod': 'nou', 'clase': ['#32770'], 'ce_e': 'fereastra Proprietăți a unui fișier .docx (foaia de proprietăți din shell32)'}
    hs = []
    t0 = time.time()
    while time.time() - t0 < t_max and not hs:
        acum = ferestre_vizibile()
        hs = [h for h, i in acum.items() if h not in baza and i['pid'] == os.getpid() and i['clasa'] == '#32770']
        time.sleep(0.25)
    if not hs:
        n = plasa_de_siguranta(token)
        probleme.append('fereastra Proprietăți NU a apărut în procesul meu în %d s (plasa de siguranță a închis %d ferestre)' % (t_max, n))
        return raport_proba(probleme, None, f)
    h = hs[0]
    time.sleep(1.0)
    cit = Cititor()
    U = cit.U
    el = cit.element(h)
    tab_cond = cit.ua.CreatePropertyCondition(30003, U.UIA_TabItemControlTypeId)
    filele = el.FindAll(U.TreeScope_Descendants, tab_cond)
    nume_file = [filele.GetElement(i).CurrentName for i in range(filele.Length)]
    file_rec = []
    for i, nf in enumerate(nume_file):
        u32.SendMessageW(h, 0x0400 + 101, i, 0)                   # PSM_SETCURSEL: foaia de proprietăți trece pe fila i
        time.sleep(0.7)
        ctx = {'nav_permisa': True}
        fr = cit.citeste(h, ctx)
        fr.update({'fila': curata(nf), 'noduri': numara(fr['arbore']), 'taiat': ctx.get('taiat', False),
                   'ascunse_cont': ctx.get('ascunse_cont', 0), 'ascunse_continut': ctx.get('ascunse_continut', 0)})
        file_rec.append(fr)
    u32.SendMessageW(h, 0x0400 + 101, 0, 0)
    info = ferestre_vizibile().get(h, {})
    proces = nume_proces(info.get('pid', 0))
    u32.PostMessageW(h, 0x0010, 0, 0)                               # închid fereastra mea
    time.sleep(0.8)
    # ---- verificările
    if info.get('pid') != os.getpid():
        probleme.append('fereastra nu e a procesului meu')
    if len(nume_file) < 2:
        probleme.append('mai puțin de 2 file: %r' % nume_file)
    for fr in file_rec:
        if fr['noduri'] < 10:
            probleme.append('fila %s are doar %d noduri' % (fr['fila'], fr['noduri']))
        w, hh = fr['rect_ecran_100'][2], fr['rect_ecran_100'][3]
        if not (250 <= w <= 900 and 300 <= hh <= 900):
            probleme.append('dimensiunea ferestrei la 100%% DPI neplauzibilă: %dx%d' % (w, hh))
        afara = 0
        for n in toate(fr['arbore']):
            r = n.get('rect')
            if r and not n.get('in_afara_ecranului') and (r[0] < -2 or r[1] < -2 or r[0] + r[2] > w + 2 or r[1] + r[3] > hh + 2):
                afara += 1
        if afara:
            probleme.append('fila %s: %d dreptunghiuri în afara ferestrei (normalizare greșită?)' % (fr['fila'], afara))
    nume_toate = {n.get('nume') for fr in file_rec for n in toate(fr['arbore'])}
    for trebuie in ('OK', 'Anulare'):
        if trebuie not in nume_toate:
            probleme.append('lipsește butonul %s' % trebuie)
    rec = inregistrare('proprietati_fisier', sup, [{'clasa': info.get('clasa'), 'proces': '[procesul probei]', 'file': file_rec,
                                                     'nume_file': [curata(x) for x in nume_file],
                                                     'nota': 'aceeași foaie de proprietăți din shell32 pe care o deschide Explorer '
                                                             '(Alt+Enter); deschisă cu SHObjectProperties pe desktopul ascuns, citită '
                                                             'fila cu filă (PSM_SETCURSEL); fișier .docx de probă'}],
                       'desktop ascuns (A6Hidden), SHObjectProperties în procesul probei — nu ecranul omului')
    rec['noduri'] = sum(fr['noduri'] for fr in file_rec)
    # numele fișierului de probă (cu PID) se înlocuiește cu un nume stabil
    txt = json.dumps(rec, ensure_ascii=False).replace(token, 'proba.docx').replace(token[:-5], 'proba')
    rec = json.loads(txt)
    gas = potriviri_personale(json.dumps(rec, ensure_ascii=False))
    if gas:
        probleme.append('date personale în rezultat: ' + ', '.join(sorted(set(gas))))
    return raport_proba(probleme, rec, f, proces)


def raport_proba(probleme, rec, f, proces=''):
    MOTOR.mkdir(parents=True, exist_ok=True)
    out = {'probleme': probleme, 'rezultat': rec, 'cand': time.strftime('%Y-%m-%d %H:%M:%S'), 'desktop': desktop_curent()}
    txt = json.dumps(out, ensure_ascii=False, indent=1) + '\n'
    if potriviri_personale(txt):
        txt = json.dumps({'probleme': probleme + ['rezultatul brut nu se scrie: date personale'], 'rezultat': None}, ensure_ascii=False, indent=1)
    (MOTOR / 'proba_dump_proprietati.json').write_text(txt, encoding='utf-8')
    if rec and not probleme:
        try:
            adauga_suprafata('uia_explorer.json', 'proprietati_fisier', rec)
            print('adăugat în uia_explorer.json: proprietati_fisier,', rec['noduri'], 'noduri,', len(rec['ferestre'][0]['file']), 'file:',
                  ', '.join(rec['ferestre'][0]['nume_file']))
        except RuntimeError as ex:
            probleme.append(str(ex))
    try:
        f.unlink()
    except OSError:
        pass
    for p in probleme:
        print('PROBLEMĂ:', p)
    print('detalii: explorer_motor/proba_dump_proprietati.json')
    print(len(probleme))
    return 0 if not probleme else 1


def cmd_proba_captura():
    """Proba drumului din sesiune (linia de bază, fereastra NOUĂ a altui proces, citirea, scrierea), pe desktopul ascuns:
    un proces-copil deschide Proprietăți DUPĂ ce captura a pornit; captura trebuie s-o găsească și s-o scrie într-un
    fișier de probă (explorer_motor/proba_captura_test.json), nu în referință. Ultima linie = numărul de probleme."""
    if desktop_curent().lower() == 'default':
        sys.path.insert(0, str(UNELTE))
        from hidden_desktop import HiddenProcess
        hp = HiddenProcess([sys.executable, str(Path(__file__).resolve()), 'proba-captura'])
        try:
            cod = hp.wait(120)
            if cod is None:
                hp.kill_tree()
                hp.wait(10)
            out, err = hp.read_output()
        finally:
            hp.close()
        if err.strip():
            print('--- stderr (desktopul ascuns) ---')
            print(curata(err[-1500:]))
        out = curata(out).rstrip()
        print(out)
        linii = [x for x in out.splitlines() if x.strip()]
        if cod is None or not linii or not re.fullmatch(r'-?\d+', linii[-1].strip()):
            print(1)
            return 2
        return 0 if linii[-1].strip() == '0' else 1
    import subprocess
    import threading
    PROBA_DIR.mkdir(parents=True, exist_ok=True)
    f = PROBA_DIR / 'proba.docx'
    PERMISE.add('proba.docx')
    f.write_text('fișier de probă', encoding='utf-8')
    test = MOTOR / 'proba_captura_test.json'
    if test.exists():
        test.unlink()
    exe = os.path.basename(sys.executable).lower()
    SUPRAFETE['_proba_captura'] = {'fisier': 'explorer_motor/proba_captura_test.json', 'mod': 'nou', 'procese': [exe],
                                   'clase': ['#32770'], 'ce_e': 'proba drumului de captură', 'omul': '(procesul-copil)',
                                   'sursa': 'proba pe desktopul ascuns: proces-copil cu SHObjectProperties'}
    copil = {}

    def porneste():
        time.sleep(2.5)
        cod = ('import ctypes,time;s=ctypes.windll.shell32;s.SHObjectProperties.argtypes=[ctypes.c_void_p,ctypes.c_uint32,'
               'ctypes.c_wchar_p,ctypes.c_wchar_p];s.SHObjectProperties(None,2,%r,None);time.sleep(40)' % str(f))
        copil['p'] = subprocess.Popen([sys.executable, '-c', cod], creationflags=0x08000000)
    th = threading.Thread(target=porneste, daemon=True)
    th.start()
    probleme = []
    try:
        rez = cmd_captura('_proba_captura', False, 25)
    finally:
        th.join(5)
        if copil.get('p'):
            copil['p'].kill()
    if rez != 0:
        probleme.append('captura nu a găsit/scris fereastra procesului-copil')
    else:
        D = json.loads(test.read_text(encoding='utf-8'))
        s = D['suprafete']['_proba_captura']
        fe = s['ferestre'][0]
        if fe.get('proces') != exe:
            probleme.append('procesul ferestrei capturate: %r' % fe.get('proces'))
        if fe.get('clasa') != '#32770':
            probleme.append('clasa ferestrei capturate: %r' % fe.get('clasa'))
        if s['noduri'] < 20:
            probleme.append('prea puține noduri: %d' % s['noduri'])
        nume = {n.get('nume') for n in toate(fe['arbore'])}
        if 'OK' not in nume or 'General' not in nume:
            probleme.append('lipsesc OK / General din arborele capturat')
        if potriviri_personale(test.read_text(encoding='utf-8')):
            probleme.append('date personale în fișierul de probă')
    try:
        f.unlink()
    except OSError:
        pass
    for p in probleme:
        print('PROBLEMĂ:', p)
    print(len(probleme))
    return 0 if not probleme else 1


# ---------------------------------------------------------------- restul subcomenzilor
def cmd_lista():
    for k, s in SUPRAFETE.items():
        print('%-28s -> %-18s | %s | omul: %s' % (k, s['fisier'], s['ce_e'], s['omul']))
    print(0)
    return 0


def cmd_pregateste():
    SESIUNE.mkdir(parents=True, exist_ok=True)
    for n in FISIERE_SESIUNE:
        if n.endswith('/'):
            (SESIUNE / n[:-1]).mkdir(exist_ok=True)
        else:
            (SESIUNE / n).write_text('fișier de sesiune, fără date', encoding='utf-8')
    print('folderul de sesiune:', curata(str(SESIUNE)), '|', sorted(os.listdir(SESIUNE)))
    print(0)
    return 0


def cmd_verifica(fisiere):
    fis = [Path(x) for x in fisiere] or [AICI / 'uia_windows.json', AICI / 'uia_explorer.json']
    n = 0
    for p in fis:
        if not p.exists():
            print('lipsește (nu e o potrivire):', p.name)
            continue
        gas = potriviri_personale(p.read_text(encoding='utf-8', errors='replace'))
        if gas:
            print('POTRIVIRI în', p.name, ':', ', '.join(sorted(set(gas))))
            n += len(gas)
        else:
            print('curat:', p.name)
    print(n)
    return 0 if n == 0 else 1


def main(argv):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    if not argv:
        print(__doc__)
        print(1)
        return 1
    cmd = argv[0]
    t_max = 90
    if '--max' in argv:
        t_max = int(argv[argv.index('--max') + 1])
    if cmd == 'lista':
        return cmd_lista()
    if cmd == 'pregateste':
        return cmd_pregateste()
    if cmd == 'captura' and len(argv) >= 2:
        return cmd_captura(argv[1], '--cu-omul' in argv, t_max)
    if cmd == 'proba':
        return cmd_proba(min(t_max, 30))
    if cmd == 'proba-captura':
        return cmd_proba_captura()
    if cmd == 'verifica':
        return cmd_verifica([a for a in argv[1:] if not a.startswith('--')])
    print('comandă necunoscută; vezi docstring-ul')
    print(1)
    return 1


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
