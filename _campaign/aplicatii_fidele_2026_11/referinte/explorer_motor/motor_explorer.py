# -*- coding: utf-8 -*-
"""Referința de COMPORTAMENT pentru File Explorer (Windows 11, română), măsurată cu motorul REAL al shell-ului,
FĂRĂ nicio fereastră Explorer și fără ecranul omului (Etapa 0, campania „Aplicațiile fidele”, 16.11.2026).

Ce face: pentru fiecare scenariu din SCENARII creează un folder de lucru în %TEMP%\\lh_explorer_ref\\motor,
pune fișierele de pornire, face operația cu ACEEAȘI mașină pe care o cheamă Explorer, citește starea și scrie:
  - scenariul în formatul comun:  _campaign/aplicatii_fidele_2026_11/scenarii/explorer/<id>.json
  - rezultatul real:              _campaign/aplicatii_fidele_2026_11/referinte/scenarii_real/<id>.json
  - toate dovezile brute:         referinte/explorer_motor/motor_rezultat.json  (+ motor_iesire.txt)
Mașinile folosite („cum”):
  - Nou > Folder      = obiectul „Nou” al shell-ului (CLSID_NewMenu, verbul canonic NewFolder), prin IContextMenu3
  - Copiere + Lipire  = ținta de plasare a folderului (IDropTarget al lui IShellFolder, DROPEFFECT_COPY) — calea pe care
                        o folosește Lipire, fără clipboard (regula: clipboardul nu se atinge)
  - Delete / Shift+Delete = verbul „delete” din meniul de context al fișierului (IShellItem → BHID_SFUIObject →
                        IContextMenu), cu CMIC_MASK_SHIFT_DOWN pentru Shift (cum trimite Explorer)
  - F2 + Enter        = IShellFolder::SetNameOf (numele scris în casetă); selecția din casetă NU e măsurată aici
  - Restaurare din Coș = verbul „Restaurare” al elementului din Coș (Shell.Application)
  - ordinea după Nume = IShellFolder::CompareIDs pe coloana 0 (comparatorul vizualizării) + StrCmpLogicalW
Ferestrele de întrebare ale shell-ului apar pe desktopul ascuns, în procesul acesta; un fir de pază le citește cu
UI Automation și apasă butonul cerut de scenariu. Coșul de reciclare: se citesc DOAR elementele care au plecat din
folderul de lucru (restul nu se păstrează nicăieri), iar la final acestea se șterg definitiv. Nicio setare schimbată:
setările care decid rezultatul (extensii vizibile, confirmarea la Coș) doar se CITESC și se scriu în rezultat.

Folosire:  python <calea>/motor_explorer.py           (se relansează singur pe desktopul ascuns A6Hidden)
           python <calea>/motor_explorer.py --doar-scenarii   (scrie doar scenariile, fără rulare)
Ultima linie = numărul de scenarii NEPROBATE (eroare sau mod neprobat); 0 = toate probate. Cod: 0 / 1; altul = prăbușire.
"""
import ctypes
import functools
import json
import os
import shutil
import sys
import threading
import time
import traceback
import winreg
from ctypes import wintypes as wt, POINTER, byref, c_void_p, c_uint, HRESULT
from pathlib import Path

AICI = Path(__file__).resolve().parent
REF = AICI.parent
CAMP = REF.parent
SCEN_DIR = CAMP / 'scenarii' / 'explorer'
REAL_DIR = REF / 'scenarii_real'
OUT = AICI / 'motor_rezultat.json'
IESIRE = AICI / 'motor_iesire.txt'
UNELTE = Path(r'C:/00/AI_0/tools')
BAZA = Path(os.environ.get('TEMP', os.environ.get('TMP', '.'))) / 'lh_explorer_ref' / 'motor'

u32 = ctypes.WinDLL('user32', use_last_error=True)
k32 = ctypes.WinDLL('kernel32')
sh32 = ctypes.WinDLL('shell32')
shlw = ctypes.WinDLL('shlwapi')


def desktop_curent():
    h = u32.GetThreadDesktop(k32.GetCurrentThreadId())
    buf = ctypes.create_unicode_buffer(256)
    n = ctypes.c_ulong()
    u32.GetUserObjectInformationW(h, 2, buf, 512, ctypes.byref(n))
    return buf.value


# ---------------------------------------------------------------- date personale: niciuna în ce se scrie
def _nume_afisat():
    try:
        n = ctypes.c_ulong(0)
        sec = ctypes.WinDLL('secur32')
        sec.GetUserNameExW(3, None, byref(n))
        b = ctypes.create_unicode_buffer(n.value + 1)
        if sec.GetUserNameExW(3, b, byref(n)):
            return b.value
    except Exception:
        pass
    return ''


_INLOC = []
for _v, _cu in ((os.environ.get('TEMP', ''), '%TEMP%'), (os.environ.get('USERPROFILE', ''), '%USERPROFILE%'),
                (os.environ.get('USERNAME', ''), '[utilizator]'), (os.environ.get('COMPUTERNAME', ''), '[calculator]'),
                (_nume_afisat(), '[utilizator]')):
    if _v and len(_v) >= 3:
        _INLOC.append((_v, _cu))
        if '\\' in _v:
            _INLOC.append((_v.replace('\\', '/'), _cu))


def curata(s):
    if not isinstance(s, str):
        return s
    for v, cu in _INLOC:
        i = s.lower().find(v.lower())
        while i >= 0:
            s = s[:i] + cu + s[i + len(v):]
            i = s.lower().find(v.lower(), i + len(cu))
    return s


def curata_tot(o):
    if isinstance(o, dict):
        return {curata(k): curata_tot(v) for k, v in o.items()}
    if isinstance(o, list):
        return [curata_tot(x) for x in o]
    return curata(o)


def scrie_json(p, o):
    p.parent.mkdir(parents=True, exist_ok=True)
    txt = json.dumps(curata_tot(o), ensure_ascii=False, indent=1) + '\n'
    if p.exists() and p.read_text(encoding='utf-8') == txt:
        return
    tmp = p.with_suffix('.tmp')
    tmp.write_text(txt, encoding='utf-8')
    os.replace(tmp, p)


# ---------------------------------------------------------------- SCENARIILE (formatul comun; nu se schimbă aici)
L10 = 'lectii/v/m2-l10/index.html'
L12 = 'lectii/v/m2-l12/index.html'
EXT_VIZ = 'extensii_vizibile'

def _sc(id_, descriere, start, pasi, stare_citita, lectii, sursa_gest, cum, rulare):
    return {'id': id_, 'aplicatie': 'explorer', 'mod': 'model_obiect', 'descriere': descriere, 'start': start,
            'pasi': pasi, 'stare_citita': stare_citita, 'lectii': lectii, 'sursa_gest': sursa_gest,
            '_cum': cum, '_rulare': rulare}

NOTA_NUME = ('nume_fisiere = numele reale din folder (cu extensie; folderele cu „/” la capăt), ordonate cu sorted() '
             'din Python (comparație de mulțime, NU ordinea afișată).')

SCENARII = [
    _sc('explorer_control_citire',
        'PROBA MODULUI (rezultat cunoscut): folderul are doar control.txt, pus de script; citirea stării trebuie să dea '
        'exact [\"control.txt\"]. Dacă nu, niciun alt scenariu nu e probat. ' + NOTA_NUME,
        {'folder': 'Control', 'arbore': ['control.txt']}, [], ['nume_fisiere'], [], None,
        'os.listdir + Shell.Application.NameSpace().Items() (aceeași citire ca la celelalte)', {'tip': 'control'}),
    _sc('explorer_folder_nou',
        'Folder nou într-un folder gol: Nou, apoi Folder, apoi Enter (păstrezi numele dat de Windows). ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': []},
        [{'gest': 'comanda_panglica', 'comanda': 'Nou', 'zona': 'bara de comenzi'}, {'gest': 'meniu', 'element': 'Folder'},
         {'gest': 'taste', 'taste': 'Enter'}],
        ['nume_fisiere'], ['v/m2-l10', 'v/m2-l11', 'v/m2-l12', 'v/m2-l15'], L10 + ':160',
        'CLSID_NewMenu (meniul „Nou” al shell-ului), IContextMenu3, elementul „Folder” (verbul canonic NewFolder)',
        {'tip': 'folder_nou', 'de_cate_ori': 1}),
    _sc('explorer_folder_nou_2',
        'Al doilea folder nou în același loc: în folder există deja „Folder nou”; Nou, apoi Folder, apoi Enter. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['Folder nou/']},
        [{'gest': 'comanda_panglica', 'comanda': 'Nou', 'zona': 'bara de comenzi'}, {'gest': 'meniu', 'element': 'Folder'},
         {'gest': 'taste', 'taste': 'Enter'}],
        ['nume_fisiere'], ['v/m2-l10', 'v/m2-l11'], L10 + ':160',
        'CLSID_NewMenu, IContextMenu3, elementul „Folder” (NewFolder), cu „Folder nou” deja în folder',
        {'tip': 'folder_nou', 'de_cate_ori': 1}),
    _sc('explorer_copie_acelasi_folder',
        'Copiere și Lipire în ACELAȘI folder: clic pe tema.docx, Ctrl+C, Ctrl+V. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['tema.docx']},
        [{'gest': 'clic', 'tinta': 'tema.docx'}, {'gest': 'taste', 'taste': 'Ctrl+C'}, {'gest': 'taste', 'taste': 'Ctrl+V'}],
        ['nume_fisiere'], ['v/m2-l10', 'v/m2-l11'], L10 + ':118',
        'IDropTarget al folderului (IShellFolder.CreateViewObject), DragEnter+Drop cu DROPEFFECT_COPY, obiectul de date din GetUIObjectOf',
        {'tip': 'lipire', 'sursa': 'tema.docx', 'de_cate_ori': 1}),
    _sc('explorer_copie_acelasi_folder_2',
        'Lipire de DOUĂ ori în același folder: clic pe tema.docx, Ctrl+C, Ctrl+V, Ctrl+V. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['tema.docx']},
        [{'gest': 'clic', 'tinta': 'tema.docx'}, {'gest': 'taste', 'taste': 'Ctrl+C'}, {'gest': 'taste', 'taste': 'Ctrl+V'},
         {'gest': 'taste', 'taste': 'Ctrl+V'}],
        ['nume_fisiere'], ['v/m2-l10', 'v/m2-l11'], L10 + ':335',
        'IDropTarget al folderului, DROPEFFECT_COPY, de două ori cu același obiect de date (tema.docx)',
        {'tip': 'lipire', 'sursa': 'tema.docx', 'de_cate_ori': 2}),
    _sc('explorer_copie_a_copiei',
        'Copia unei copii, în același folder: clic pe „vulpea - Copie.png”, Ctrl+C, Ctrl+V. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['vulpea - Copie.png', 'vulpea.png']},
        [{'gest': 'clic', 'tinta': 'vulpea - Copie.png'}, {'gest': 'taste', 'taste': 'Ctrl+C'}, {'gest': 'taste', 'taste': 'Ctrl+V'}],
        ['nume_fisiere'], ['v/m2-l10'], L10 + ':336',
        'IDropTarget al folderului, DROPEFFECT_COPY, sursa „vulpea - Copie.png”',
        {'tip': 'lipire', 'sursa': 'vulpea - Copie.png', 'de_cate_ori': 1}),
    _sc('explorer_lipire_conflict_omitere',
        'Lipire într-ALT folder unde există deja un fișier cu același nume: Windows întreabă („Înlocuire sau omitere '
        'fișiere”); elevul alege omiterea. Folderul Colegul are tema.docx cu conținutul „din Colegul”. '
        'continut_fisiere = textul fiecărui fișier din folderul de lucru. ' + NOTA_NUME,
        {'folder': 'Colegul', 'arbore': ['tema.docx'], 'continut': {'tema.docx': 'din Colegul'},
         'sursa_lipirii': {'folder': 'Ana', 'arbore': ['tema.docx'], 'continut': {'tema.docx': 'din Ana'}}},
        [{'gest': 'clic', 'tinta': 'Ana/tema.docx'}, {'gest': 'taste', 'taste': 'Ctrl+C'},
         {'gest': 'dublu_clic', 'tinta': 'Colegul'}, {'gest': 'taste', 'taste': 'Ctrl+V'},
         {'gest': 'clic', 'tinta': 'fereastra:Se omite acest fișier'}],
        ['nume_fisiere', 'continut_fisiere', 'dialog'], ['v/m2-l10', 'v/m2-l11'], L10 + ':241',
        'IDropTarget al folderului Colegul, DROPEFFECT_COPY; fereastra copierii citită cu UI Automation pe desktopul ascuns',
        {'tip': 'lipire_alt_folder', 'raspuns': ['Se omite', 'Omitere', 'Skip']}),
    _sc('explorer_lipire_conflict_inlocuire',
        'Ca mai sus, dar elevul alege înlocuirea fișierului din destinație. ' + NOTA_NUME,
        {'folder': 'Colegul', 'arbore': ['tema.docx'], 'continut': {'tema.docx': 'din Colegul'},
         'sursa_lipirii': {'folder': 'Ana', 'arbore': ['tema.docx'], 'continut': {'tema.docx': 'din Ana'}}},
        [{'gest': 'clic', 'tinta': 'Ana/tema.docx'}, {'gest': 'taste', 'taste': 'Ctrl+C'},
         {'gest': 'dublu_clic', 'tinta': 'Colegul'}, {'gest': 'taste', 'taste': 'Ctrl+V'},
         {'gest': 'clic', 'tinta': 'fereastra:Înlocuire fișier de la destinație'}],
        ['nume_fisiere', 'continut_fisiere', 'dialog'], ['v/m2-l10', 'v/m2-l11'], L10 + ':241',
        'IDropTarget al folderului Colegul, DROPEFFECT_COPY; fereastra copierii citită cu UI Automation pe desktopul ascuns',
        {'tip': 'lipire_alt_folder', 'raspuns': ['Înlocuire fișier', 'Replace']}),
    _sc('explorer_redenumire_pastreaza_extensia',
        'Redenumire cu extensia păstrată (extensiile se văd): clic pe harta.png, F2, Ctrl+A, scrii „harta mare.png”, Enter. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['harta.png'], 'setari': {EXT_VIZ: True}},
        [{'gest': 'clic', 'tinta': 'harta.png'}, {'gest': 'taste', 'taste': 'F2'}, {'gest': 'taste', 'taste': 'Ctrl+A'},
         {'gest': 'tasteaza', 'text': 'harta mare.png'}, {'gest': 'taste', 'taste': 'Enter'}],
        ['nume_fisiere', 'dialog'], ['v/m2-l10', 'v/m2-l12'], L10 + ':117',
        'IShellFolder::SetNameOf(fereastra-proprietar, pidl, nume, SHGDN_INFOLDER|SHGDN_FOREDITING)',
        {'tip': 'redenumire', 'sursa': 'harta.png', 'nume': 'harta mare.png', 'raspuns': ['Nu', 'No']}),
    _sc('explorer_redenumire_scoate_extensia_nu',
        'Redenumire care ȘTERGE extensia (extensiile se văd): F2, Ctrl+A, scrii „harta mare”, Enter; Windows întreabă '
        '„Sigur modificați extensia?”; elevul apasă Nu. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['harta.png'], 'setari': {EXT_VIZ: True}},
        [{'gest': 'clic', 'tinta': 'harta.png'}, {'gest': 'taste', 'taste': 'F2'}, {'gest': 'taste', 'taste': 'Ctrl+A'},
         {'gest': 'tasteaza', 'text': 'harta mare'}, {'gest': 'taste', 'taste': 'Enter'}, {'gest': 'clic', 'tinta': 'fereastra:Nu'}],
        ['nume_fisiere', 'dialog'], ['v/m2-l10', 'v/m2-l12'], L12 + ':223',
        'IShellFolder::SetNameOf(fereastra-proprietar, ...); fereastra „Redenumire” citită cu UI Automation, apăsat Nu',
        {'tip': 'redenumire', 'sursa': 'harta.png', 'nume': 'harta mare', 'raspuns': ['Nu', 'No']}),
    _sc('explorer_redenumire_scoate_extensia_da',
        'Ca mai sus, dar elevul apasă Da la „Sigur modificați extensia?”. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['harta.png'], 'setari': {EXT_VIZ: True}},
        [{'gest': 'clic', 'tinta': 'harta.png'}, {'gest': 'taste', 'taste': 'F2'}, {'gest': 'taste', 'taste': 'Ctrl+A'},
         {'gest': 'tasteaza', 'text': 'harta mare'}, {'gest': 'taste', 'taste': 'Enter'}, {'gest': 'clic', 'tinta': 'fereastra:Da'}],
        ['nume_fisiere', 'dialog'], ['v/m2-l12'], L12 + ':223',
        'IShellFolder::SetNameOf(fereastra-proprietar, ...); fereastra „Redenumire” citită cu UI Automation, apăsat Da',
        {'tip': 'redenumire', 'sursa': 'harta.png', 'nume': 'harta mare', 'raspuns': ['Da', 'Yes']}),
    _sc('explorer_redenumire_nume_existent_nu',
        'Redenumire cu un nume care EXISTĂ deja în folder: lista.txt → „mic.txt” (F2, Ctrl+A, scrii, Enter); la întrebarea '
        'lui Windows elevul apasă Nu. (Cazul nu e predat explicit; simulatorul vechi îl are ca NESIGUR: '
        'lectii/_sim/explorer-organizare.js:58-59.) ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['lista.txt', 'mic.txt'], 'setari': {EXT_VIZ: True}},
        [{'gest': 'clic', 'tinta': 'lista.txt'}, {'gest': 'taste', 'taste': 'F2'}, {'gest': 'taste', 'taste': 'Ctrl+A'},
         {'gest': 'tasteaza', 'text': 'mic.txt'}, {'gest': 'taste', 'taste': 'Enter'}, {'gest': 'clic', 'tinta': 'fereastra:Nu'}],
        ['nume_fisiere', 'dialog'], ['v/m2-l10'], L10 + ':117',
        'IShellFolder::SetNameOf cu un nume ocupat; fereastra citită cu UI Automation, apăsat Nu',
        {'tip': 'redenumire', 'sursa': 'lista.txt', 'nume': 'mic.txt', 'raspuns': ['Nu', 'No']}),
    _sc('explorer_redenumire_nume_existent_da',
        'Ca mai sus, dar elevul apasă Da la întrebarea lui Windows. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['lista.txt', 'mic.txt'], 'setari': {EXT_VIZ: True}},
        [{'gest': 'clic', 'tinta': 'lista.txt'}, {'gest': 'taste', 'taste': 'F2'}, {'gest': 'taste', 'taste': 'Ctrl+A'},
         {'gest': 'tasteaza', 'text': 'mic.txt'}, {'gest': 'taste', 'taste': 'Enter'}, {'gest': 'clic', 'tinta': 'fereastra:Da'}],
        ['nume_fisiere', 'dialog'], ['v/m2-l10'], L10 + ':117',
        'IShellFolder::SetNameOf cu un nume ocupat; fereastra citită cu UI Automation, apăsat Da',
        {'tip': 'redenumire', 'sursa': 'lista.txt', 'nume': 'mic.txt', 'raspuns': ['Da', 'Yes']}),
    _sc('explorer_stergere_cos',
        'Ștergere cu tasta Delete: fișierul pleacă în Coșul de reciclare (cu confirmarea la Coș OPRITĂ, cum e citită pe PC). '
        'in_cos = numele elementelor din Coș care au plecat din folderul de lucru. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['notite.txt'], 'setari': {'confirmare_la_cos': False}},
        [{'gest': 'clic', 'tinta': 'notite.txt'}, {'gest': 'taste', 'taste': 'Delete'}],
        ['nume_fisiere', 'in_cos', 'dialog'], ['v/m2-l10', 'v/m2-l11', 'v/m2-l12', 'v/m2-l15', 'v/m5-l31'], L10 + ':119',
        'verbul „delete” din IContextMenu al fișierului (IShellItem→BHID_SFUIObject), fără Shift; Coșul citit prin Shell.Application.NameSpace(10)',
        {'tip': 'stergere', 'sursa': 'notite.txt', 'shift': False, 'raspuns': ['Da', 'Yes']}),
    _sc('explorer_stergere_definitiva_da',
        'Ștergere definitivă cu Shift+Delete: Windows întreabă „Sigur ștergeți definitiv acest fișier?”; elevul apasă Da. '
        '(Aceeași întrebare o predă lecția la ștergerea de pe stick.) ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['ciorna.txt']},
        [{'gest': 'clic', 'tinta': 'ciorna.txt'}, {'gest': 'taste', 'taste': 'Shift+Delete'}, {'gest': 'clic', 'tinta': 'fereastra:Da'}],
        ['nume_fisiere', 'in_cos', 'dialog'], ['v/m2-l10'], L10 + ':264',
        'verbul „delete” din IContextMenu al fișierului, cu CMIC_MASK_SHIFT_DOWN; fereastra citită cu UI Automation, apăsat Da',
        {'tip': 'stergere', 'sursa': 'ciorna.txt', 'shift': True, 'raspuns': ['Da', 'Yes']}),
    _sc('explorer_stergere_definitiva_nu',
        'Ca mai sus, dar elevul apasă Nu: fișierul rămâne. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['ciorna.txt']},
        [{'gest': 'clic', 'tinta': 'ciorna.txt'}, {'gest': 'taste', 'taste': 'Shift+Delete'}, {'gest': 'clic', 'tinta': 'fereastra:Nu'}],
        ['nume_fisiere', 'in_cos', 'dialog'], ['v/m2-l10'], L10 + ':273',
        'verbul „delete” cu CMIC_MASK_SHIFT_DOWN; fereastra citită cu UI Automation, apăsat Nu',
        {'tip': 'stergere', 'sursa': 'ciorna.txt', 'shift': True, 'raspuns': ['Nu', 'No']}),
    _sc('explorer_restaurare_din_cos',
        'Delete pe notite.txt, apoi în Coșul de reciclare clic dreapta pe el și Restaurare: fișierul se întoarce. ' + NOTA_NUME,
        {'folder': 'Exercitii', 'arbore': ['notite.txt'], 'setari': {'confirmare_la_cos': False}},
        [{'gest': 'clic', 'tinta': 'notite.txt'}, {'gest': 'taste', 'taste': 'Delete'},
         {'gest': 'dublu_clic', 'tinta': 'desktop:Coș de reciclare'}, {'gest': 'clic_dreapta', 'tinta': 'cos:notite.txt'},
         {'gest': 'meniu', 'element': 'Restaurare'}],
        ['nume_fisiere', 'in_cos'], ['v/m2-l10'], L10 + ':121',
        'verbul „delete” (fără Shift), apoi verbul „Restaurare” al elementului din Coș (Shell.Application FolderItem.Verbs)',
        {'tip': 'restaurare', 'sursa': 'notite.txt'}),
    _sc('explorer_sortare_nume',
        'Ordinea afișată când vizualizarea e sortată după Nume, crescător (start.sortare): folderele întâi, apoi fișierele, '
        'numerele din nume comparate ca numere (fișier2 înaintea lui fișier10), fără deosebire între litere mari și mici. '
        'ordine_afisata = numele reale, cu „/” la foldere, în ordinea comparatorului vizualizării. '
        '[NEVERIFICAT aici: că un folder nou se deschide sortat după Nume — se vede în sesiunea cu omul.]',
        {'folder': 'Sortare', 'sortare': {'coloana': 'Nume', 'directie': 'crescator'},
         'arbore': ['fișier10.txt', 'fișier2.txt', 'fișier1.txt', 'Fișier3.txt', 'alfa.txt', 'Zebra.txt', 'ștrumf.txt',
                    'sapte.txt', 'tabel.txt', '10.txt', '2.txt', '1.txt', '_nota.txt', 'a b.txt', 'ab.txt', 'zeta/', 'Beta/']},
        [], ['ordine_afisata'], ['v/m2-l09', 'v/m2-l10', 'v/m2-l11', 'v/m2-l12'], None,
        'IShellFolder::CompareIDs(coloana 0 = Nume) al folderului; martor: StrCmpLogicalW (shlwapi)',
        {'tip': 'sortare'}),
]


def fara_interne(s):
    return {k: v for k, v in s.items() if not k.startswith('_')}


def scrie_scenariile():
    for s in SCENARII:
        scrie_json(SCEN_DIR / (s['id'] + '.json'), fara_interne(s))
    return len(SCENARII)


# ---------------------------------------------------------------- relansarea pe desktopul ascuns
def ruleaza_ascuns():
    sys.path.insert(0, str(UNELTE))
    from hidden_desktop import HiddenProcess  # noqa
    hp = HiddenProcess([sys.executable, str(Path(__file__).resolve()), '--interior'])
    try:
        cod = hp.wait(300)
        if cod is None:
            hp.kill_tree()
            hp.wait(10)
        out, err = hp.read_output()
    finally:
        hp.close()
    IESIRE.write_text(curata(out + ('\n--- stderr ---\n' + err if err.strip() else '')), encoding='utf-8')
    print('desktop ascuns: cod', cod, '| ieșirea în', IESIRE.name)
    if cod is None or not OUT.exists():
        print('RULAREA NU S-A TERMINAT (timp depășit sau prăbușire); vezi', IESIRE.name)
        print(curata(err[-1500:]))
        sys.exit(2)
    R = json.loads(OUT.read_text(encoding='utf-8'))
    neprobate = 0
    for s in SCENARII:
        p = REAL_DIR / (s['id'] + '.json')
        r = json.loads(p.read_text(encoding='utf-8')) if p.exists() else None
        ok = bool(r and r.get('mod_probat') and not r.get('eroare'))
        neprobate += 0 if ok else 1
        rez = json.dumps(r.get('stare') if r else None, ensure_ascii=False)
        print(('OK  ' if ok else 'NU  ') + s['id'] + ' -> ' + rez[:230] + ('' if ok else '  | eroare: ' + str(r and r.get('eroare'))))
    print('setari citite:', json.dumps(R.get('setari_citite'), ensure_ascii=False))
    print('registru schimbat (chei Explorer):', len(R.get('registru_schimbari', [])))
    print('detalii:', OUT)
    print(neprobate)
    sys.exit(0 if neprobate == 0 else 1)


# ---------------------------------------------------------------- interiorul (doar pe un desktop care NU e al omului)
def interior():
    import pythoncom
    import win32gui
    import win32con
    import win32com.client
    from win32com.shell import shell, shellcon
    import comtypes
    import comtypes.client
    from comtypes import GUID, IUnknown, COMMETHOD

    PID = os.getpid()
    R = {'pornit': time.strftime('%Y-%m-%d %H:%M:%S'), 'desktop': desktop_curent(), 'scenarii': {}, 'dialoguri': [],
         'fapte_suplimentare': {}, 'erori': []}

    # ---- definiții COM minime (comtypes) pentru meniurile shell-ului
    class CMINVOKECOMMANDINFOEX(ctypes.Structure):
        _fields_ = [('cbSize', wt.DWORD), ('fMask', wt.DWORD), ('hwnd', wt.HWND), ('lpVerb', c_void_p),
                    ('lpParameters', c_void_p), ('lpDirectory', c_void_p), ('nShow', ctypes.c_int),
                    ('dwHotKey', wt.DWORD), ('hIcon', wt.HANDLE), ('lpTitle', c_void_p), ('lpVerbW', c_void_p),
                    ('lpParametersW', c_void_p), ('lpDirectoryW', c_void_p), ('lpTitleW', c_void_p), ('ptInvoke', wt.POINT)]

    class IShellExtInit(IUnknown):
        _iid_ = GUID('{000214E8-0000-0000-C000-000000000046}')
        _methods_ = [COMMETHOD([], HRESULT, 'Initialize', (['in'], c_void_p, 'pidl'), (['in'], c_void_p, 'pdo'), (['in'], c_void_p, 'hkey'))]

    class IContextMenu(IUnknown):
        _iid_ = GUID('{000214E4-0000-0000-C000-000000000046}')
        _methods_ = [COMMETHOD([], HRESULT, 'QueryContextMenu', (['in'], wt.HMENU, 'hm'), (['in'], c_uint, 'idx'), (['in'], c_uint, 'first'), (['in'], c_uint, 'last'), (['in'], c_uint, 'flags')),
                     COMMETHOD([], HRESULT, 'InvokeCommand', (['in'], POINTER(CMINVOKECOMMANDINFOEX), 'pici')),
                     COMMETHOD([], HRESULT, 'GetCommandString', (['in'], ctypes.c_size_t, 'id'), (['in'], c_uint, 'type'), (['in'], c_void_p, 'res'), (['in'], c_void_p, 'name'), (['in'], c_uint, 'cch'))]

    class IContextMenu2(IContextMenu):
        _iid_ = GUID('{000214F4-0000-0000-C000-000000000046}')
        _methods_ = [COMMETHOD([], HRESULT, 'HandleMenuMsg', (['in'], c_uint, 'msg'), (['in'], wt.WPARAM, 'wp'), (['in'], wt.LPARAM, 'lp'))]

    class IContextMenu3(IContextMenu2):
        _iid_ = GUID('{BCFCE0A0-EC17-11d0-8D10-00A0C90F2719}')
        _methods_ = [COMMETHOD([], HRESULT, 'HandleMenuMsg2', (['in'], c_uint, 'msg'), (['in'], wt.WPARAM, 'wp'), (['in'], wt.LPARAM, 'lp'), (['in'], c_void_p, 'res'))]

    class IShellItem(IUnknown):
        _iid_ = GUID('{43826D1E-E718-42EE-BC55-A1E261C37BFE}')
        _methods_ = [COMMETHOD([], HRESULT, 'BindToHandler', (['in'], c_void_p, 'pbc'), (['in'], POINTER(GUID), 'bhid'),
                               (['in'], POINTER(GUID), 'riid'), (['out'], POINTER(POINTER(IUnknown)), 'ppv'))]

    CLSID_NewMenu = GUID('{D969A300-E7FF-11d0-A93B-00A0C90F2719}')
    BHID_SFUIObject = GUID('{3981E225-F559-11D3-8E3A-00C04F6837D5}')
    sh32.SHParseDisplayName.argtypes = [wt.LPCWSTR, c_void_p, POINTER(c_void_p), wt.ULONG, POINTER(wt.ULONG)]
    sh32.SHCreateItemFromParsingName.argtypes = [wt.LPCWSTR, c_void_p, POINTER(GUID), POINTER(POINTER(IShellItem))]
    shlw.StrCmpLogicalW.argtypes = [wt.LPCWSTR, wt.LPCWSTR]
    sh32.ILFree.argtypes = [c_void_p]

    pythoncom.CoInitialize()
    owner = win32gui.CreateWindow('STATIC', 'lhref_motor', win32con.WS_OVERLAPPED, 0, 0, 10, 10, 0, 0, 0, None)

    def pump(sec):
        t = time.time() + sec
        while time.time() < t:
            pythoncom.PumpWaitingMessages()
            time.sleep(0.04)

    def menu_items(hm):
        out = []
        for i in range(u32.GetMenuItemCount(hm)):
            buf = ctypes.create_unicode_buffer(512)
            u32.GetMenuStringW(hm, i, buf, 512, 0x400)
            out.append({'i': i, 'text': buf.value, 'id': u32.GetMenuItemID(hm, i), 'sub': u32.GetSubMenu(hm, i)})
        return out

    # ---- setările care decid rezultatul: doar CITITE
    class SFS(ctypes.Structure):
        _fields_ = [('b', ctypes.c_uint32)]
    sfs = SFS()
    sh32.SHGetSettings(byref(sfs), 0x2 | 0x8000)
    try:
        k = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced')
        hide = winreg.QueryValueEx(k, 'HideFileExt')[0]
    except OSError:
        hide = None
    R['setari_citite'] = {'extensii_vizibile': bool(sfs.b & 2), 'fara_confirmare_la_cos': bool(sfs.b & 4),
                          'HideFileExt': hide, 'limba_interfetei_LANGID': k32.GetUserDefaultUILanguage(),
                          'cum': 'SHGetSettings(SSF_SHOWEXTENSIONS|SSF_NOCONFIRMRECYCLE) + HKCU\\...\\Explorer\\Advanced\\HideFileExt (doar citire)'}

    # ---- registrul Explorer: instantaneu înainte/după (ce chei s-ar fi schimbat; fără valori)
    CHEI = [r'Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\BagMRU',
            r'Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags',
            r'Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32',
            r'Software\Microsoft\Windows\CurrentVersion\Explorer\RecentDocs',
            r'Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced',
            r'Software\Microsoft\Windows\CurrentVersion\Explorer\OperationStatusManager']

    def snap():
        d = {}
        def walk(path):
            try:
                kk = winreg.OpenKey(winreg.HKEY_CURRENT_USER, path)
            except OSError:
                return
            vals, i = {}, 0
            while True:
                try:
                    n, v, t = winreg.EnumValue(kk, i)
                except OSError:
                    break
                vals[n] = (t, repr(v))
                i += 1
            d[path] = vals
            subs, i = [], 0
            while True:
                try:
                    subs.append(winreg.EnumKey(kk, i))
                except OSError:
                    break
                i += 1
            winreg.CloseKey(kk)
            for s in subs:
                walk(path + '\\' + s)
        for c in CHEI:
            walk(c)
        return d

    def diff(a, b):
        out = []
        for p in sorted(set(a) | set(b)):
            sc_ = p.replace(r'Software\Classes\Local Settings\Software\Microsoft\Windows\Shell', 'Shell').replace(r'Software\Microsoft\Windows\CurrentVersion\Explorer', 'Explorer')
            if p not in a:
                out.append(['cheie_noua', sc_]); continue
            if p not in b:
                out.append(['cheie_stearsa', sc_]); continue
            for n in sorted(set(a[p]) | set(b[p])):
                if a[p].get(n) != b[p].get(n):
                    out.append(['valoare', sc_, '#' if n.isdigit() else n])
        return out

    inainte = snap()

    # ---- firul de pază: ferestrele de întrebare ale shell-ului (doar ale procesului acesta)
    PAZA = {'scenariu': None, 'raspuns': []}
    vazute = set()

    def paza(stop):
        pythoncom.CoInitialize()
        comtypes.client.GetModule('UIAutomationCore.dll')
        from comtypes.gen import UIAutomationClient as U
        ua = comtypes.client.CreateObject(U.CUIAutomation, interface=U.IUIAutomation)
        prima = {}
        while not stop.is_set():
            hs = []

            def cb(h, _):
                p = ctypes.c_ulong()
                u32.GetWindowThreadProcessId(h, ctypes.byref(p))
                if p.value == PID and h != owner and win32gui.IsWindowVisible(h):
                    hs.append(h)
                return True
            win32gui.EnumWindows(cb, None)
            for h in hs:
                if h in vazute:
                    continue
                prima.setdefault(h, time.time())
                try:
                    titlu = win32gui.GetWindowText(h)
                    cls = win32gui.GetClassName(h)
                    el = ua.ElementFromHandle(h)
                    arr = el.FindAll(U.TreeScope_Subtree, ua.CreateTrueCondition())
                    elemente = []
                    for i in range(arr.Length):
                        e = arr.GetElement(i)
                        try:
                            elemente.append((e, e.CurrentControlType, e.CurrentLocalizedControlType, e.CurrentName or '',
                                             e.CurrentAutomationId or ''))
                        except Exception:
                            pass
                    if not titlu and not any(x[3] for x in elemente):
                        vazute.add(h)             # ferestre goale ale sistemului (indicatorul de intrare): nu sunt întrebări
                        continue
                    vrea = PAZA['raspuns']
                    butoane = [x for x in elemente if x[1] == U.UIA_ButtonControlTypeId and x[3]]
                    walker = ua.RawViewWalker
                    bara_titlu = set()
                    for x in butoane:             # butoanele barei de titlu (părinte TitleBar) nu fac parte din corpul ferestrei
                        try:
                            par = walker.GetParentElement(x[0])
                            if par is not None and par.CurrentControlType == U.UIA_TitleBarControlTypeId:
                                bara_titlu.add(x[3])
                        except Exception:
                            pass
                    potrivit = None
                    for w in vrea:
                        for x in butoane:
                            if x[3].strip().lower().startswith(w.lower()):
                                potrivit = x
                                break
                        if potrivit:
                            break
                    vechi = time.time() - prima[h] > 10
                    if not potrivit and vechi:      # niciun buton cerut după 10 s: răspunsul cel mai sigur (nu înlocuiește, nu șterge)
                        for w in ('Se omite', 'Omitere', 'Skip', 'Anulare', 'Cancel', 'Nu', 'No'):
                            potrivit = next((x for x in butoane if x[3].strip().lower().startswith(w.lower())), None)
                            if potrivit:
                                break
                    if not potrivit and cls != '#32770' and not vechi:
                        continue          # fereastra de progres a copierii, încă fără întrebare
                    if not titlu and not potrivit and not vechi:
                        continue
                    time.sleep(0.5)
                    vazute.add(h)
                    apasat = None
                    if potrivit:
                        try:
                            potrivit[0].GetCurrentPattern(U.UIA_InvokePatternId).QueryInterface(U.IUIAutomationInvokePattern).Invoke()
                            apasat = potrivit[3]
                        except Exception as ex:
                            R['erori'].append('paza invoke: ' + str(ex))
                    if not apasat and cls == '#32770':
                        win32gui.PostMessage(h, win32con.WM_CLOSE, 0, 0)
                        apasat = 'WM_CLOSE (niciun buton cerut)'
                    R['dialoguri'].append({'scenariu': PAZA['scenariu'], 'titlu': titlu, 'clasa': cls,
                                           'texte': [[x[2], x[3]] for x in elemente if x[3]],
                                           'texte_simple': [x[3] for x in elemente if x[3] and x[1] == U.UIA_TextControlTypeId],
                                           'butoane': [x[3] for x in butoane],
                                           'butoane_bara_titlu': sorted(bara_titlu),
                                           'butoane_corp': [x[3] for x in butoane if x[3] not in bara_titlu],
                                           'apasat': apasat})
                except Exception:
                    R['erori'].append('paza: ' + traceback.format_exc()[-500:])
            time.sleep(0.2)

    stop = threading.Event()
    th = threading.Thread(target=paza, args=(stop,), daemon=True)
    th.start()

    # ---- unelte
    def folder_sf(p):
        return shell.SHGetDesktopFolder().BindToObject(shell.SHParseDisplayName(str(p), 0, None)[0], None, shell.IID_IShellFolder)

    def child(sf, nume):
        return sf.ParseDisplayName(owner, None, nume)[1]

    def nume_fisiere(d):
        return sorted((n + '/') if (d / n).is_dir() else n for n in os.listdir(d))

    def nume_shell(d):
        sha = win32com.client.Dispatch('Shell.Application')
        f = sha.NameSpace(str(d))
        return sorted((it.Name + ('/' if it.IsFolder else '')) for it in f.Items())

    def pregateste(d, arbore, continut=None):
        d.mkdir(parents=True, exist_ok=True)
        for n in arbore:
            if n.endswith('/'):
                (d / n[:-1]).mkdir(exist_ok=True)
            else:
                (d / n).write_text((continut or {}).get(n, 'lh ' + n), encoding='utf-8')

    def din_cos(d, sterge=False):
        """Numele elementelor din Coș care au plecat din folderul d (celelalte NU se rețin)."""
        sha = win32com.client.Dispatch('Shell.Application')
        cos = sha.NameSpace(10)
        tinta = os.path.normcase(os.path.normpath(str(d)))
        gasite = []
        for it in cos.Items():
            loc = cos.GetDetailsOf(it, 1) or ''
            if os.path.normcase(os.path.normpath(loc)) == tinta:
                gasite.append((it.Name, it.Path, it))
        if sterge:
            for _n, cale, _it in gasite:
                try:
                    fo = pythoncom.CoCreateInstance(shell.CLSID_FileOperation, None, pythoncom.CLSCTX_ALL, shell.IID_IFileOperation)
                    fo.SetOperationFlags(shellcon.FOF_NOCONFIRMATION | shellcon.FOF_SILENT | shellcon.FOF_NOERRORUI)
                    fo.DeleteItem(shell.SHCreateItemFromParsingName(cale, None, shell.IID_IShellItem), None)
                    fo.PerformOperations()
                except Exception as ex:
                    R['erori'].append('curatare cos: ' + str(ex))
        return gasite

    def dialog_pentru(id_):
        """Fereastra de întrebare a scenariului: titlu, întrebarea (primul text terminat cu „?”, altfel primul text care
        citează un nume cu „…”), butoanele din corpul ferestrei (fără cele ale barei de titlu) și ce s-a apăsat."""
        ds = [x for x in R['dialoguri'] if x['scenariu'] == id_ and (x['titlu'] or x['apasat'])]
        if not ds:
            return None
        x = ds[-1]
        ts = x.get('texte_simple') or []
        intreb = [t for t in ts if t.strip().endswith('?')] or [t for t in ts if '„' in t]
        return {'titlu': x['titlu'], 'intrebare': intreb[0].replace('\r\n', '\n') if intreb else None,
                'butoane': x.get('butoane_corp', x['butoane']), 'apasat': x['apasat']}

    def lipeste(sursa_d, nume, tinta_d, ori=1, asteapta=None):
        sf_s = folder_sf(sursa_d)
        dob = sf_s.GetUIObjectOf(owner, [child(sf_s, nume)], pythoncom.IID_IDataObject, 0)
        dob = dob[1] if isinstance(dob, tuple) else dob
        rez = []
        for k in range(ori):
            inainte_ = set(os.listdir(tinta_d))
            dt = folder_sf(tinta_d).CreateViewObject(owner, pythoncom.IID_IDropTarget)
            ef = dt.DragEnter(dob, 0, (0, 0), 1)
            dr = dt.Drop(dob, 0, (0, 0), 1)
            rez.append({'DragEnter': ef, 'Drop': dr})
            for _ in range(75):           # copierea poate rula pe un fir al shell-ului: așteptăm schimbarea
                pump(0.2)
                if asteapta and asteapta():
                    break
                if not asteapta and set(os.listdir(tinta_d)) != inainte_:
                    break
        return rez

    def meniu_nou_folder(d):
        pidl = c_void_p()
        hr = sh32.SHParseDisplayName(str(d), None, byref(pidl), 0, None)
        if hr != 0:
            raise OSError('SHParseDisplayName ' + hex(hr & 0xFFFFFFFF))
        nm = comtypes.CoCreateInstance(CLSID_NewMenu, interface=IShellExtInit)
        nm.Initialize(pidl.value, None, None)
        cm = nm.QueryInterface(IContextMenu3)
        hm = u32.CreatePopupMenu()
        cm.QueryContextMenu(hm, 0, 1, 0x7FFF, 0)
        lista_nou, tinta, verb = [], None, None
        for x in menu_items(hm):
            if x['sub']:
                res = ctypes.c_ssize_t()
                cm.HandleMenuMsg2(0x0117, x['sub'], x['i'], ctypes.addressof(res))   # WM_INITMENUPOPUP: se umple „Nou”
                for s in menu_items(x['sub']):
                    lista_nou.append(s['text'])
                    if s['text'].replace('&', '').strip().lower() == 'folder':
                        tinta = s['id']
        if not tinta:
            raise RuntimeError('„Folder” nu e în meniul Nou: ' + json.dumps(lista_nou, ensure_ascii=False))
        buf = ctypes.create_unicode_buffer(128)
        try:
            cm.GetCommandString(tinta - 1, 4, None, ctypes.addressof(buf), 128)   # GCS_VERBW
            verb = buf.value
        except Exception as ex:
            verb = 'eroare ' + str(ex)
        ci = CMINVOKECOMMANDINFOEX()
        ci.cbSize = ctypes.sizeof(ci); ci.fMask = 0x4000; ci.hwnd = owner
        ci.lpVerb = tinta - 1; ci.lpVerbW = tinta - 1; ci.nShow = 1
        cm.InvokeCommand(byref(ci))
        pump(1.2)
        u32.DestroyMenu(hm)
        sh32.ILFree(pidl)
        return {'meniul_nou': lista_nou, 'verb': verb}

    def verb_fisier(cale, verb, shift=False):
        it = POINTER(IShellItem)()
        hr = sh32.SHCreateItemFromParsingName(str(cale), None, byref(IShellItem._iid_), byref(it))
        if hr != 0:
            raise OSError('SHCreateItemFromParsingName ' + hex(hr & 0xFFFFFFFF))
        cm = it.BindToHandler(None, byref(BHID_SFUIObject), byref(IContextMenu._iid_)).QueryInterface(IContextMenu)
        hm = u32.CreatePopupMenu()
        cm.QueryContextMenu(hm, 0, 1, 0x7FFF, 0)
        va = ctypes.create_string_buffer(verb.encode('ascii'))
        vw = ctypes.create_unicode_buffer(verb)
        ci = CMINVOKECOMMANDINFOEX()
        ci.cbSize = ctypes.sizeof(ci)
        ci.fMask = 0x4000 | (0x10000000 if shift else 0)     # CMIC_MASK_UNICODE | CMIC_MASK_SHIFT_DOWN
        ci.hwnd = owner
        ci.lpVerb = ctypes.addressof(va); ci.lpVerbW = ctypes.addressof(vw); ci.nShow = 1
        cm.InvokeCommand(byref(ci))
        u32.DestroyMenu(hm)

    def meniu_clasic_fisier(cale):
        """Meniul clasic al fișierului („Afișați mai multe opțiuni”): doar elementele cu verb al lui Windows."""
        STANDARD = {'open', 'openas', 'edit', 'print', 'cut', 'copy', 'delete', 'rename', 'properties', 'link', 'sendto',
                    'opennewwindow', 'opencontaining', 'pintohome', 'pintostartscreen', 'copyaspath', 'share',
                    'windows.share', 'windows.modernshare', 'runas', 'preview', 'setdesktopwallpaper', 'rotate90',
                    'rotate270', 'compressedfolder', 'windows.compressedfolder'}
        it = POINTER(IShellItem)()
        sh32.SHCreateItemFromParsingName(str(cale), None, byref(IShellItem._iid_), byref(it))
        cm = it.BindToHandler(None, byref(BHID_SFUIObject), byref(IContextMenu._iid_)).QueryInterface(IContextMenu)
        hm = u32.CreatePopupMenu()
        cm.QueryContextMenu(hm, 0, 1, 0x7FFF, 0)
        pastrate, alte = [], 0
        for x in menu_items(hm):
            if x['id'] in (0, 0xFFFFFFFF) and not x['sub'] and not x['text']:
                pastrate.append({'text': '—', 'verb': None})
                continue
            verb = None
            if not x['sub'] and x['id'] not in (0, 0xFFFFFFFF):
                buf = ctypes.create_unicode_buffer(128)
                try:
                    cm.GetCommandString(x['id'] - 1, 4, None, ctypes.addressof(buf), 128)
                    verb = buf.value or None
                except Exception:
                    verb = None
            if (verb or '').lower() in STANDARD or (x['sub'] and x['text'].replace('&', '') in ('Trimitere către', 'Deschidere cu')):
                pastrate.append({'text': x['text'], 'verb': verb, 'submeniu': bool(x['sub'])})
            else:
                alte += 1
        u32.DestroyMenu(hm)
        return {'elemente_windows': pastrate, 'alte_elemente_ascunse': alte,
                'nota': 'elementele adăugate de aplicațiile instalate pe acest PC sunt doar numărate; separatoarele = „—”'}

    def asteapta(cond, sec=15):
        t = time.time() + sec
        while time.time() < t:
            if cond():
                return True
            pump(0.2)
        return cond()

    # ---- rularea scenariilor
    if BAZA.exists():
        shutil.rmtree(BAZA, ignore_errors=True)
    BAZA.mkdir(parents=True, exist_ok=True)
    control_ok = False

    for s in SCENARII:
        id_, st, ru = s['id'], s['start'], s['_rulare']
        PAZA['scenariu'] = id_
        PAZA['raspuns'] = ru.get('raspuns', [])
        radac = BAZA / id_
        d = radac / st['folder']
        brut = {'cum': s['_cum']}
        stare, eroare = {}, None
        try:
            pregateste(d, st.get('arbore', []), st.get('continut'))
            tip = ru['tip']
            if tip == 'control':
                a, b = nume_fisiere(d), nume_shell(d)
                brut['os_listdir'] = a; brut['shell_items'] = b
                stare['nume_fisiere'] = a
                b_ok = b == ['control.txt'] or (not R['setari_citite']['extensii_vizibile'] and b == ['control'])
                control_ok = (a == ['control.txt'] and b_ok)
                if not control_ok:
                    eroare = 'citirea nu dă rezultatul cunoscut: ' + json.dumps([a, b], ensure_ascii=False)
            elif tip == 'folder_nou':
                for _k in range(ru['de_cate_ori']):
                    brut.setdefault('nou', []).append(meniu_nou_folder(d))
                stare['nume_fisiere'] = nume_fisiere(d)
                WIN_OFFICE = ('&Folder', '&Comandă rapidă', '', 'Imagine cu structură bitmap', 'Document text',
                              'Folder comprimat (ZIP)', 'Microsoft Word Document', 'Microsoft Excel Worksheet',
                              'Microsoft PowerPoint Presentation', 'Microsoft Access Database', 'Microsoft Publisher Document')
                mn = brut['nou'][0]['meniul_nou']
                R['fapte_suplimentare']['meniul_nou_al_shell_ului'] = {
                    'elemente_windows_si_office_in_ordine': [('—' if t == '' else t) for t in mn if t in WIN_OFFICE],
                    'alte_elemente_ascunse': sum(1 for t in mn if t not in WIN_OFFICE),
                    'nota': 'ordinea reală din meniul „Nou” al shell-ului pe acest PC; tipurile adăugate de alte aplicații '
                            'instalate sunt doar numărate; „—” = separator; numele documentelor Office sunt în engleză '
                            'pentru că Office are interfața în engleză'}
                brut['nou'] = [{'verb': x['verb']} for x in brut['nou']]
            elif tip == 'lipire':
                brut['drop'] = lipeste(d, ru['sursa'], d, ru['de_cate_ori'])
                stare['nume_fisiere'] = nume_fisiere(d)
            elif tip == 'lipire_alt_folder':
                ss = st['sursa_lipirii']
                ds = radac / ss['folder']
                pregateste(ds, ss['arbore'], ss.get('continut'))
                tinta_text = 'din Ana'
                brut['drop'] = lipeste(ds, 'tema.docx', d, 1,
                                       asteapta=lambda: any(x['scenariu'] == id_ and x['apasat'] for x in R['dialoguri']))
                pump(2.0)
                stare['nume_fisiere'] = nume_fisiere(d)
                stare['continut_fisiere'] = {n: (d / n).read_text(encoding='utf-8') for n in os.listdir(d) if (d / n).is_file()}
                stare['dialog'] = dialog_pentru(id_)
                brut['sursa_neatinsa'] = (ds / 'tema.docx').read_text(encoding='utf-8') == tinta_text
            elif tip == 'redenumire':
                sf = folder_sf(d)
                try:
                    sf.SetNameOf(owner, child(sf, ru['sursa']), ru['nume'], shellcon.SHGDN_INFOLDER | shellcon.SHGDN_FOREDITING)
                    brut['SetNameOf'] = 'ok'
                except Exception as ex:
                    brut['SetNameOf'] = 'refuzat: ' + str(ex)
                pump(0.8)
                stare['nume_fisiere'] = nume_fisiere(d)
                stare['dialog'] = dialog_pentru(id_)
            elif tip == 'stergere':
                cale = d / ru['sursa']
                brut['verb'] = 'delete' + (' + Shift' if ru['shift'] else '')
                try:
                    verb_fisier(cale, 'delete', shift=ru['shift'])
                    brut['InvokeCommand'] = 'S_OK'
                except comtypes.COMError as ex:
                    if (ex.hresult & 0xFFFFFFFF) != 0x80270000:     # COPYENGINE_E_USER_CANCELLED = omul a răspuns Nu
                        raise
                    brut['InvokeCommand'] = '0x80270000 COPYENGINE_E_USER_CANCELLED (răspunsul Nu)'
                asteapta(lambda: (not cale.exists()) or any(x['scenariu'] == id_ for x in R['dialoguri']), 15)
                pump(1.5)
                stare['nume_fisiere'] = nume_fisiere(d)
                stare['in_cos'] = sorted(n for n, _p, _i in din_cos(d))
                stare['dialog'] = dialog_pentru(id_)
            elif tip == 'restaurare':
                cale = d / ru['sursa']
                verb_fisier(cale, 'delete', shift=False)
                asteapta(lambda: not cale.exists(), 15)
                pump(1.0)
                gas = din_cos(d)
                brut['in_cos_dupa_stergere'] = sorted(n for n, _p, _i in gas)
                verbe = []
                for n, _p, it in gas:
                    if n == ru['sursa']:
                        for v in it.Verbs():
                            verbe.append(v.Name)
                        for v in it.Verbs():
                            if v.Name.replace('&', '').lower().startswith(('restaur', 'restore')):
                                v.DoIt()
                                brut['verb_restaurare'] = v.Name
                                break
                brut['verbe_in_cos'] = verbe
                asteapta(lambda: cale.exists(), 15)
                pump(1.0)
                stare['nume_fisiere'] = nume_fisiere(d)
                stare['in_cos'] = sorted(n for n, _p, _i in din_cos(d))
            elif tip == 'sortare':
                sf = folder_sf(d)
                el = [(n, child(sf, n.rstrip('/'))) for n in nume_fisiere(d)]
                def cmp(a, b):
                    r = sf.CompareIDs(0, a[1], b[1])
                    return ctypes.c_short(r & 0xFFFF).value
                ordine = [x[0] for x in sorted(el, key=functools.cmp_to_key(cmp))]
                stare['ordine_afisata'] = ordine
                fis = [n for n in nume_fisiere(d) if not n.endswith('/')]
                brut['StrCmpLogicalW_doar_fisiere'] = sorted(fis, key=functools.cmp_to_key(lambda a, b: shlw.StrCmpLogicalW(a, b)))
                brut['sorted_python_doar_fisiere'] = sorted(fis)
                brut['comparator_shell_egal_StrCmpLogicalW_pe_fisiere'] = [x for x in ordine if not x.endswith('/')] == brut['StrCmpLogicalW_doar_fisiere']
                sha = win32com.client.Dispatch('Shell.Application')
                fns = sha.NameSpace(str(d))
                R['fapte_suplimentare']['coloanele_unui_folder'] = [fns.GetDetailsOf(None, i) for i in range(0, 8)]
                R['fapte_suplimentare']['coloanele_cosului'] = [sha.NameSpace(10).GetDetailsOf(None, i) for i in range(0, 7)]
                R['fapte_suplimentare']['meniul_clasic_al_unui_fisier_txt'] = meniu_clasic_fisier(d / 'alfa.txt')
            else:
                eroare = 'tip necunoscut ' + tip
        except Exception:
            eroare = traceback.format_exc()[-900:]
        finally:
            try:
                din_cos(d, sterge=True)
            except Exception as ex:
                R['erori'].append('cos ' + id_ + ': ' + str(ex))
        brut['dialoguri'] = [x for x in R['dialoguri'] if x['scenariu'] == id_]
        R['scenarii'][id_] = {'stare': stare, 'brut': brut, 'eroare': eroare}
        print(id_, json.dumps(curata_tot(stare), ensure_ascii=False)[:300], '| eroare:', (eroare or '-')[:200], flush=True)

    stop.set()
    th.join(3)
    # mod probat = controlul (rezultat cunoscut) a trecut în aceeași rulare
    for s in SCENARII:
        x = R['scenarii'][s['id']]
        scrie_json(REAL_DIR / (s['id'] + '.json'),
                   {'id': s['id'], 'mod_probat': bool(control_ok and not x['eroare']),
                    'stare': {k: x['stare'].get(k) for k in s['stare_citita']},
                    'eroare': x['eroare'] if x['eroare'] else (None if control_ok else 'controlul (explorer_control_citire) nu a trecut'),
                    'cum': s['_cum'] + ' — pe desktopul ascuns, Windows 11 RO, ' + time.strftime('%d.%m.%Y')})
    shutil.rmtree(BAZA, ignore_errors=True)
    R['folder_de_lucru_sters'] = not BAZA.exists()
    R['registru_schimbari'] = diff(inainte, snap())
    R['terminat'] = time.strftime('%Y-%m-%d %H:%M:%S')
    R['control_ok'] = control_ok
    scrie_json(OUT, R)
    win32gui.DestroyWindow(owner)
    print('GATA', len(R['dialoguri']), 'ferestre de întrebare;', len(R['registru_schimbari']), 'schimbări în registrul Explorer', flush=True)


if __name__ == '__main__':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    if '--doar-scenarii' in sys.argv:
        print('scenarii scrise:', scrie_scenariile())
        print(0)
        sys.exit(0)
    if '--interior' in sys.argv:
        if desktop_curent().lower() == 'default':
            print('REFUZ: acesta e desktopul omului; rulează fără --interior (se relansează pe desktopul ascuns).')
            sys.exit(3)
        scrie_scenariile()
        interior()
        sys.exit(0)
    if desktop_curent().lower() != 'default':
        scrie_scenariile()
        interior()
        sys.exit(0)
    scrie_scenariile()
    ruleaza_ascuns()
