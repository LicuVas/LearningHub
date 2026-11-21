# -*- coding: utf-8 -*-
"""Runda `acoperire` pe Word + Excel după ciclul paralel C (21.11.2026): deblocatorii platoului O4.

Generator-soră al lui acoperire_excel_r7.py, acoperire_word_r3.py și acoperire_excel_r14.py (le folosește clasele).
Tot din Office-ul REAL de pe PC: instanță NOUĂ (`EXCEL.EXE /x` / `WINWORD.EXE`, prin clasele din ruleaza_real.py) pe
desktopul ASCUNS LHScenarii; refuză ecranul omului. Închid doar PID-ul meu; Office-ul care rula înainte e al omului.
PowerPoint nu se pornește. Clipboard-ul omului: folosit doar dacă e gol sau are numai text — salvat înainte, golit înainte de
Ctrl+C / Ctrl+X, pus la loc după. O sesiune durează cel mult 10 minute: după LIMITA_S nu mai pornesc nimic nou.

  stare --eticheta=X — starea mașinii (fără nume): PID-urile EXCEL / WINWORD / POWERPNT, secvența clipboard-ului și dacă
                 are doar text, câte intrări are lista Recent, câte fișiere lh_r26_* în %TEMP%.
  excel        — pe Excel real: (1) diagnosticul sortării pe două niveluri (Range.Sort cu argumente numite / poziționale /
                 Worksheet.Sort.SortFields) + scenariul `excel-sortare-doua-niveluri`, jucat de clasa din
                 acoperire_excel_r7.py (corectată); (2) autocompletare / separator în două momente; (3) proba tragerii
                 (zona B2→C4 și pătrățelul de umplere) și, doar dacă trece, scenariile `excel-tragere-*`.
  word         — pe Word real: (a) meniul Insert › Pictures ▾ (UIA: rândurile, tastele, ce deschide „This Device…”);
                 (b) proba canalelor noi: focusul casetei Font Size prin UIA, tragerea cu mouse-ul postat;
                 (c) scenariile: clicul la granița „me|re”, imaginea, Font Size tastat, Ctrl+C/V, Ctrl+X/V, tragerea.
                 --doar=captura sau --doar=scenarii.
  scrie_scenarii — scenariile schimbate / noi în ../scenarii/ (citește eticheta rândului din captura `word`).
  verifica     — oracolul livrabilului; ULTIMA linie = numărul de probleme.
Ieșirile brute: ../runde/26/acoperire_office/ (fără căi personale: %TEMP%).
"""
import json
import re
import subprocess
import sys
import time
import traceback
from pathlib import Path

AICI = Path(__file__).resolve().parent
D = AICI.parent
sys.path.insert(0, str(AICI))
import acoperire_excel_r7 as R7  # noqa: E402

IES = D / "runde" / "26" / "acoperire_office"
BRUT_W = IES / "capturi_word_brut.json"
HIDDEN = Path(r"C:\00\AI_0\tools\hidden_desktop.py")
DESKTOP_SC = "LHScenarii"
LIMITA_S = 480
RULAT_DE = "referinte/acoperire_office_r26.py"
U = RR = W3 = None
log = R7.log
LOG = R7.LOG

TABEL_SORT = {"A1": "Nume", "B1": "Clasa", "C1": "Punctaj", "A2": "Ana", "B2": "VIII A", "C2": 88, "A3": "Bogdan",
              "B3": "VIII B", "C3": 95, "A4": "Carmen", "B4": "VIII A", "C4": 60, "A5": "Dan", "B5": "VIII B", "C5": 78,
              "A6": "Elena", "B6": "VIII A", "C6": 95, "A7": "Florin", "B7": "VIII B", "C7": 60}

D_MSG = ("Stare: fereastra_mesaj = {titlu, texte, butoane} dacă apare un mesaj al aplicației (altfel null); "
         "ramane_in_editare = Excel n-a primit formula și a rămas în modul de editare (true/false).")
D_CEL = ("celule = {adresă: {valoare, text afișat, formula dacă are}} pentru celulele nevide.")
MOMENT1 = (" MOMENTUL 1 (runda `acoperire` Office, 21.11.2026): starea se citește cât mesajul e pe ecran. Celulele NU se "
           "citesc aici: cât Excel e în modul de editare, modelul obiect nu răspunde, deci realul le citea abia după Esc + Esc "
           "(runde/25/raport_constructor.md, R25-2). Le citește scenariul-pereche „{p}”, care are pașii Esc, Esc.")
MOMENT2 = (" MOMENTUL 2 (runda `acoperire` Office, 21.11.2026): după mesaj, elevul apasă Esc (închide mesajul, rămâne în "
           "celulă) și încă o dată Esc (renunță la ce a scris: „Esc renunță”, jocuri/_fixtura-excel/index.html:92). Starea se "
           "citește după acești pași, la fel în simulator și în Excel real.")


def incarca():
    global U, RR, W3
    R7.incarca()
    U, RR, W3 = R7.U, R7.RR, R7.W3


def curat(o):
    if isinstance(o, str):
        return R7.W3.fara_cale_personala(o) if R7.W3 else o
    if isinstance(o, list):
        return [curat(x) for x in o]
    if isinstance(o, dict):
        return {k: curat(v) for k, v in o.items()}
    return o


def pids(img):
    r = subprocess.run(["tasklist", "/FI", f"IMAGENAME eq {img}", "/FO", "CSV", "/NH"], capture_output=True, text=True)
    return sorted(int(x.split('","')[1]) for x in r.stdout.splitlines() if x.startswith(f'"{img}"'))


# ------------------------------------------------------------------------------------------------ clipboard-ul omului
def clip_doar_text():
    import acoperire_powerpoint_r11 as R11
    return R11.clipboard_doar_text()


def clip_pune(text):
    import acoperire_powerpoint_r11 as R11
    return R11.clipboard_pune(text)


def clip_text():
    import win32clipboard as cb
    for _ in range(10):
        try:
            cb.OpenClipboard()
            break
        except Exception:  # noqa: BLE001
            time.sleep(0.2)
    else:
        return "clipboard ocupat"
    try:
        return cb.GetClipboardData(13) if cb.IsClipboardFormatAvailable(13) else None
    finally:
        cb.CloseClipboard()


def secventa_clip():
    import ctypes
    return int(ctypes.windll.user32.GetClipboardSequenceNumber())


# ------------------------------------------------------------------------------------------------ mouse: tragerea postată
class StareButon:
    """Ține butonul stâng „apăsat” în starea tastaturii firului aplicației (GetKeyState(VK_LBUTTON)), doar a lui."""

    def __init__(self, h):
        import win32process
        self.tid, _ = win32process.GetWindowThreadProcessId(h)

    def __enter__(self):
        import ctypes
        self.me = RR.k32.GetCurrentThreadId()
        self.atasat = bool(RR.u32.AttachThreadInput(self.me, self.tid, True))
        st = (ctypes.c_ubyte * 256)()
        RR.u32.GetKeyboardState(st)
        self.vechi = bytes(st)
        st[0x01] = 0x80
        RR.u32.SetKeyboardState(st)
        return self

    def __exit__(self, *a):
        import ctypes
        RR.u32.SetKeyboardState((ctypes.c_ubyte * 256).from_buffer_copy(self.vechi))
        if self.atasat:
            RR.u32.AttachThreadInput(self.me, self.tid, False)


def trage_postat(h, a, b, cu_buton=True, stare_buton=False, pasi=8):
    """WM_LBUTTONDOWN în a, WM_MOUSEMOVE (MK_LBUTTON) până în b, WM_LBUTTONUP în b — postate, coordonate de ecran.
    Control (cu_buton=False): apăsare și ridicare în a, apoi mișcarea până în b FĂRĂ buton."""
    import contextlib
    import win32gui

    def lp(pt):
        cx, cy = win32gui.ScreenToClient(h, (int(round(pt[0])), int(round(pt[1]))))
        return ((cy & 0xFFFF) << 16) | (cx & 0xFFFF)

    P = win32gui.PostMessage
    ctx = StareButon(h) if stare_buton else contextlib.nullcontext()
    with ctx:
        P(h, RR.WM_MOUSEMOVE, 0, lp(a))
        time.sleep(0.1)
        P(h, RR.WM_LBD, 1, lp(a))
        time.sleep(0.2)
        if not cu_buton:
            P(h, RR.WM_LBU, 0, lp(a))
            time.sleep(0.2)
        for i in range(1, pasi + 1):
            pt = (a[0] + (b[0] - a[0]) * i / pasi, a[1] + (b[1] - a[1]) * i / pasi)
            P(h, RR.WM_MOUSEMOVE, 1 if cu_buton else 0, lp(pt))
            time.sleep(0.08)
        if cu_buton:
            time.sleep(0.2)
            P(h, RR.WM_LBU, 0, lp(b))
        time.sleep(0.6)
    if stare_buton and cu_buton:      # starea firului e iar „buton ridicat”: încă o ridicare închide o buclă de urmărire
        time.sleep(0.5)
        P(h, RR.WM_LBU, 0, lp(b))
    time.sleep(0.3)
    RR.bariera()
    time.sleep(0.6)


# ================================================================================================ EXCEL
def dreptunghi_celula(r, adresa):
    A = U.A
    cond = A.CreateAndCondition(A.CreatePropertyCondition(U.P_CLS, "XLSpreadsheetCell"),
                                A.CreatePropertyCondition(U.P_NAME, adresa))
    el = U.din_hwnd(r.hdoc).FindFirst(4, cond)
    if not el:
        raise RuntimeError(f"celula {adresa} nu e vizibilă în UI Automation")
    b = el.CurrentBoundingRectangle
    return b.left, b.top, b.right, b.bottom


def colt_umplere(r, adresa):
    """Pătrățelul de umplere stă pe colțul din dreapta-jos al zonei alese (ultima celulă)."""
    _, _, x2, y2 = dreptunghi_celula(r, adresa)
    return x2 - 1, y2 - 1


def diagnostic_sortare(r):
    """De ce rezultatul real din runda 7 avea Punctaj crescător (runde/25 R25-1): trei apeluri pe același tabel."""
    ws = r.ws
    rez = {}

    def coloana():
        return [[str(ws.Range(f"A{i}").Value), str(ws.Range(f"B{i}").Value), int(ws.Range(f"C{i}").Value)]
                for i in range(2, 8)]

    feluri = {
        "a_Range.Sort_argumente_numite (codul din runda 7)":
            lambda: ws.Range("A1:C7").Sort(Key1=ws.Range("B1"), Order1=1, Key2=ws.Range("C1"), Order2=2, Header=1),
        "b_Range.Sort_pozitional (Key1, Order1, Key2, Type, Order2, Key3, Order3, Header)":
            lambda: ws.Range("A1:C7").Sort(ws.Range("B1"), 1, ws.Range("C1"), None, 2, None, 1, 1),
        "c_Worksheet.Sort.SortFields (obiectul ferestrei Sort: un nivel = un SortField)": lambda: sortare_niveluri(ws),
    }
    for nume, f in feluri.items():
        try:
            r.start({"celule": TABEL_SORT, "selectie": "A1"})
            f()
            time.sleep(0.4)
            rez[nume] = coloana()
        except Exception as e:  # noqa: BLE001
            rez[nume] = f"eroare: {type(e).__name__}: {e}"[:200]
        log(f"  sortare {nume[:2]}: {rez[nume]}")
    return rez


def sortare_niveluri(ws):
    # aceeași funcție ca în acoperire_excel_r7.py (corectat în runda 26)
    return R7.sortare_doua_niveluri(ws)


def clasa_excel():
    Baza = R7.clasa_excel_r7()

    class ExcelR26(Baza):
        def inchide_tot(self):
            """Ca în acoperire_excel_r7.py, dar o fereastră care nu răspunde la UI Automation (COMError la
            ElementFromHandle: a dispărut sau n-are furnizor) primește Esc în loc să oprească scenariul."""
            import win32gui
            for _ in range(6):
                ramase = [(x, c) for x, c, _ in self.ferestre() if x not in self.baza and x != self.hmain]
                if not ramase:
                    break
                for x, c in ramase:
                    b = None
                    try:
                        el = U.din_hwnd(x)
                        for n in W3.CANCEL + ("OK",):
                            b = RR.gaseste_nume(el, n, (50000,))
                            if b is not None:
                                break
                    except Exception as e:  # noqa: BLE001
                        log(f"    inchide_tot: fereastra {c} fără UI Automation ({type(e).__name__}) — Esc")
                    try:
                        if b is not None and c != "Net UI Tool Window":
                            W3.pornit_in_fir(lambda b=b: RR.uia_invoke(b), 5)
                        else:
                            win32gui.PostMessage(x, 0x0100, 0x1B, 0)
                            win32gui.PostMessage(x, 0x0101, 0x1B, 0)
                    except Exception:  # noqa: BLE001
                        pass
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

        def pas_gest(self, p):
            if p.get("gest") == "trage":
                return self.trage(p)
            if p.get("gest") == "taste" and p.get("taste") == "Esc" and self.mesaj_deschis():
                return self.esc_in_mesaj()
            return super().pas_gest(p)

        def mesaj_deschis(self):
            return [(x, c) for x, c, _ in self.ferestre() if x not in self.baza and c in ("#32770", "NUIDialog")]

        def esc_in_mesaj(self):
            """Cu mesajul pe ecran, tastatura adevărată ajunge în el (fereastra modală are focusul): Esc = Cancel/OK.
            Pe desktopul ascuns firul n-are fereastră activă, deci tasta se postează direct butonului mesajului."""
            import win32gui
            h, c = self.mesaj_deschis()[0]
            netui = U.copii_clasa(h, ["NetUIHWND"])    # fereastra NetUI își ține tastatura în copilul NetUIHWND
            tinta = (netui[0] if netui else None) or win32gui.FindWindowEx(h, 0, "Button", None) or h
            win32gui.PostMessage(tinta, RR.WM_KEYDOWN, 0x1B, RR.lparam_tasta(0x1B))
            time.sleep(0.2)
            try:
                win32gui.PostMessage(tinta, RR.WM_KEYUP, 0x1B, RR.lparam_tasta(0x1B, True))
            except Exception:  # noqa: BLE001
                pass
            inchis = False
            for _ in range(20):
                time.sleep(0.25)
                if not any(x == h for x, _ in self.mesaj_deschis()):
                    inchis = True
                    break
            time.sleep(0.5)
            self.canale_r7.add("taste_in_mesaj")
            return f"WM_KEYDOWN/UP Esc în fereastra mesajului ({c}, copilul NetUIHWND care ține tastatura ferestrei NetUI){'' if inchis else ' — mesajul NU s-a închis'}"

        def trage(self, p):
            if p.get("ce") == "patratelul_de_umplere":
                zona = p["sursa"].split(":")
                a = colt_umplere(self, zona[-1])
                dest = p["destinatie"].split(":")[-1]
                x1, y1, x2, y2 = dreptunghi_celula(self, dest)
                b = (x2 - 1, y2 - 1)
                cum = f"pătrățelul de umplere al lui {p['sursa']} tras până la {p['destinatie']}"
            else:
                x1, y1, x2, y2 = dreptunghi_celula(self, p["de_la"])
                a = ((x1 + x2) / 2, (y1 + y2) / 2)
                x1, y1, x2, y2 = dreptunghi_celula(self, p["la"])
                b = ((x1 + x2) / 2, (y1 + y2) / 2)
                cum = f"din mijlocul lui {p['de_la']} până în mijlocul lui {p['la']}"
            trage_postat(self.hdoc, a, b, stare_buton=self.cu_stare_buton)
            self.canale_r7.add("trage_mouse")
            return ("mouse postat: WM_LBUTTONDOWN, WM_MOUSEMOVE (MK_LBUTTON) ×8, WM_LBUTTONUP, " + cum +
                    (" (butonul ținut și în starea tastaturii firului)" if self.cu_stare_buton else ""))

    ExcelR26.cu_stare_buton = False
    return ExcelR26


def citeste_rabdator(r, cheie):
    """Citirea prin COM după o tragere: dacă Excel e ocupat (0x800ac472, o buclă de urmărire a mouse-ului rămasă), mai
    aștept și îi trimit o ridicare de buton / Esc, de cel mult 6 ori; altfel întorc eroarea ca text."""
    import win32gui
    for i in range(6):
        try:
            return r.citeste([cheie])[cheie]
        except Exception as e:  # noqa: BLE001
            err = f"{type(e).__name__}: {e}"[:120]
            win32gui.PostMessage(r.hdoc, RR.WM_LBU, 0, 0)
            if i >= 2:
                win32gui.PostMessage(r.hdoc, RR.WM_KEYDOWN, 0x1B, RR.lparam_tasta(0x1B))
                win32gui.PostMessage(r.hdoc, RR.WM_KEYUP, 0x1B, RR.lparam_tasta(0x1B, True))
            time.sleep(1.0)
    return {"eroare_citire": err}


def proba_esc_mesaj(r):
    """Canalul „taste_in_mesaj”: pozitiv = „=SUM(A1,A2)” + Enter dă mesajul; Esc postat butonului mesajului îl închide, iar
    Excel rămâne în modul de editare; control = fără Esc, mesajul e tot acolo după aceeași așteptare."""
    st = {"celule": {"A1": 4, "A2": 5, "A3": 6}, "selectie": "B1"}
    r.start(st)
    RR.trimite_text(r.hdoc, "=SUM(A1,A2)")
    RR.trimite_taste(r.hdoc, "Enter")
    time.sleep(1.0)
    era = bool(r.mesaj_deschis())
    cum = r.esc_in_mesaj() if era else "mesajul n-a apărut"
    dupa, edit = bool(r.mesaj_deschis()), bool(r.ocupata())
    r.inchide_tot()
    r.start(st)
    RR.trimite_text(r.hdoc, "=SUM(A1,A2)")
    RR.trimite_taste(r.hdoc, "Enter")
    time.sleep(1.0 + 5.5)
    ramas = bool(r.mesaj_deschis())
    r.inchide_tot()
    poz, neg = era and not dupa and edit, ramas
    r.probe["taste_in_mesaj"] = {"pozitiv": poz, "control": neg, "trecut": poz and neg,
                                 "detalii": {"mesaj_aparut": era, "dupa_esc_mesaj_ramas": dupa, "inca_in_editare": edit,
                                             "cum": cum, "control_fara_esc_mesaj_ramas": ramas}}
    log(f"  proba taste_in_mesaj: pozitiv={poz} control={neg} {r.probe['taste_in_mesaj']['detalii']}")
    return r.probe["taste_in_mesaj"]


def proba_trage_excel(r):
    """Canalul „trage_mouse” pe Excel: pozitiv = zona B2→C4 aleasă + pătrățelul A1:A2 → A5 umple 3, 4, 5;
    control = apăsare și ridicare în B2, apoi mișcare fără buton → doar B2; tragerea din mijlocul lui A2 (nu din
    pătrățel) nu umple nimic."""
    rez = {}
    for stare_buton in (False, True):
        r.cu_stare_buton = stare_buton
        r.start({"selectie": "A1"})
        r.trage({"de_la": "B2", "la": "C4"})
        poz_z = citeste_rabdator(r, "selectie")
        r.start({"selectie": "A1"})
        x1, y1, x2, y2 = dreptunghi_celula(r, "B2")
        a = ((x1 + x2) / 2, (y1 + y2) / 2)
        x1, y1, x2, y2 = dreptunghi_celula(r, "C4")
        trage_postat(r.hdoc, a, ((x1 + x2) / 2, (y1 + y2) / 2), cu_buton=False, stare_buton=stare_buton)
        neg_z = citeste_rabdator(r, "selectie")
        r.start({"celule": {"A1": 1, "A2": 2}, "selectie": "A1:A2"})
        r.trage({"ce": "patratelul_de_umplere", "sursa": "A1:A2", "destinatie": "A1:A5"})
        poz_u = citeste_rabdator(r, "celule")
        r.start({"celule": {"A1": 1, "A2": 2}, "selectie": "A1:A2"})
        x1, y1, x2, y2 = dreptunghi_celula(r, "A2")
        a = ((x1 + x2) / 2, (y1 + y2) / 2)
        x1, y1, x2, y2 = dreptunghi_celula(r, "A5")
        trage_postat(r.hdoc, a, ((x1 + x2) / 2, (y1 + y2) / 2), stare_buton=stare_buton)
        neg_u = citeste_rabdator(r, "celule")
        poz = poz_z == {"activa": "B2", "zona": "B2:C4"} and [poz_u.get(f"A{i}", {}).get("valoare") for i in range(1, 6)] == [1, 2, 3, 4, 5]
        neg = neg_z.get("zona") != "B2:C4" and "A5" not in neg_u
        rez["cu_stare_buton" if stare_buton else "doar_postat"] = {
            "pozitiv": poz, "control": neg, "trecut": poz and neg,
            "detalii": {"zona_B2_C4": poz_z, "control_fara_buton": neg_z, "umplere_A1_A2_la_A5": poz_u,
                        "control_din_mijlocul_A2": neg_u}}
        log(f"  proba trage_mouse (stare_buton={stare_buton}): pozitiv={poz} control={neg} {poz_z} {neg_z}")
        if poz and neg:
            break
    ales = rez.get("doar_postat", {}).get("trecut") and "doar_postat" or ("cu_stare_buton" if rez.get("cu_stare_buton", {}).get("trecut") else None)
    r.cu_stare_buton = ales == "cu_stare_buton"
    r.probe["trage_mouse"] = {"pozitiv": bool(ales), "control": bool(ales), "trecut": bool(ales),
                              "varianta": ales, "detalii": rez}
    return r.probe["trage_mouse"]


def ruleaza_unul(r, sc, versiune, generator, extra_cum=""):
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
    canale = set(getattr(r, "canale_r7", None) or getattr(r, "canale_r3", None) or set())
    probat = eroare is None and bool(canale) and all(r.probe.get(c, {}).get("trecut") for c in canale)
    app = sc["aplicatie"]
    rez = {"id": sc["id"], "mod_probat": probat, "stare": stare, "eroare": eroare,
           "cum": W3.fara_cale_personala(
               (f"{mod} — instanță NOUĂ {app} ({versiune}), desktop ascuns {DESKTOP_SC}, {time.strftime('%d.%m.%Y %H:%M')}, "
                f"{generator}; pașii: " + " · ".join(cum) + "; pornirea și citirea stării prin COM (ferestrele care "
                "întreabă citite prin UI Automation înainte de a fi închise)" + extra_cum +
                (f"; {rec} intrări din lista Recent (fișierele mele) șterse" if rec else ""))),
           "canale": sorted(canale), "canale_neprobate": sorted(c for c in canale if not r.probe.get(c, {}).get("trecut"))}
    if not probat and eroare is None:
        rez["nota"] = "mod_probat = false: un canal folosit n-a trecut proba în aceeași rulare (vezi canale_neprobate)"
    (RR.REAL / f"{sc['id']}.json").write_text(json.dumps(rez, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    log(f"  {sc['id']}: {'OK' if eroare is None else 'EROARE ' + eroare[:160]} probat={probat} "
        f"stare={json.dumps(stare, ensure_ascii=False)[:300]}")
    return rez


def scenariu(app, sid):
    return json.loads((D / "scenarii" / app / f"{sid}.json").read_text(encoding="utf-8"))


EXCEL_ESC = ["excel-autocompletare-tab", "excel-autocompletare-tab-esc-esc", "excel-separator-virgula",
             "excel-separator-virgula-esc-esc"]
EXCEL_TRAGE = ["excel-tragere-zona", "excel-tragere-umplere-gest"]


def excel_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    straine = pids("EXCEL.EXE")
    log(f"EXCEL.EXE înainte de pornire: {len(straine)} procese (nu le ating)")
    r = clasa_excel()("excel")
    rez, fapte, t0, sarite = [], {}, time.time(), []
    try:
        r.porneste()
        log(f"  PID-ul meu: nou = {r.s.proc.pid not in straine}")
        versiune = f"{U.versiune_exe(U.APPS['excel']['exe'])}, build COM {r.s.build}"
        try:
            RR.proba(r)
        except Exception:  # noqa: BLE001
            log("proba a căzut:\n" + traceback.format_exc())
        if "--fara-sortare" not in sys.argv:
            try:
                fapte["sortare_diagnostic"] = diagnostic_sortare(r)
            except Exception:  # noqa: BLE001
                log("diagnostic_sortare a căzut:\n" + traceback.format_exc())
            rez.append(ruleaza_unul(r, scenariu("excel", "excel-sortare-doua-niveluri"), versiune,
                                    "referinte/acoperire_excel_r7.py (pasul com:sort2 corectat în runda `acoperire` Office: "
                                    "Worksheet.Sort cu două SortFields, ca nivelurile ferestrei Sort), rulat prin " + RULAT_DE))
        try:
            fapte["proba_esc_mesaj"] = proba_esc_mesaj(r)
        except Exception:  # noqa: BLE001
            log("proba_esc_mesaj a căzut: " + traceback.format_exc())
        for sid in EXCEL_ESC:
            if sid.endswith("-esc-esc") and not r.probe.get("taste_in_mesaj", {}).get("trecut"):
                log(f"  {sid}: NERULAT — Esc în mesaj nu ajunge invizibil (proba taste_in_mesaj)")
                continue
            rez.append(ruleaza_unul(r, scenariu("excel", sid), versiune, RULAT_DE + " (pe clasele din acoperire_excel_r7.py "
                                    "și ruleaza_real.py)"))
        if "--fara-tragere" not in sys.argv:
            try:
                fapte["proba_trage_mouse"] = proba_trage_excel(r)
            except Exception:  # noqa: BLE001
                log("proba_trage_excel a căzut:\n" + traceback.format_exc())
        if r.probe.get("trage_mouse", {}).get("trecut"):
            for sid in EXCEL_TRAGE:
                if time.time() - t0 > LIMITA_S:
                    sarite.append(sid)
                    continue
                sc = scenariu("excel", sid)
                if sc.get("rulat_de") != RULAT_DE:
                    log(f"  {sid}: încă trimis la profesor în scenarii/ — rulat doar ca probă, rezultatul în jurnal")
                rez.append(ruleaza_unul(r, sc, versiune, RULAT_DE + " (pe clasele din acoperire_excel_r7.py și ruleaza_real.py)"))
    except Exception:  # noqa: BLE001
        log(traceback.format_exc())
    finally:
        try:
            r.inchide()
        except Exception:  # noqa: BLE001
            log("închidere: " + traceback.format_exc())
    dupa = pids("EXCEL.EXE")
    jurnal = {"generat": time.strftime("%Y-%m-%d %H:%M"), "desktop": DESKTOP_SC, "probe": r.probe, "fapte": fapte,
              "rezultate": [{k: x[k] for k in ("id", "mod_probat", "eroare")} for x in rez], "sarite_limita": sarite,
              "procese": {"excel_straine_inainte": len(straine), "pid_meu_ramas": r.s.proc.pid in dupa,
                          "straine_neatinse": all(p in dupa for p in straine)},
              "erori_sesiune": r.s.erori, "durata_s": round(time.time() - t0), "jurnal": LOG}
    IES.mkdir(parents=True, exist_ok=True)
    (IES / f"excel_jurnal_{time.strftime('%H%M')}.json").write_text(
        json.dumps(curat(jurnal), ensure_ascii=False, indent=1, default=str), encoding="utf-8")
    print(f"excel: {len(rez)} rulate, {sum(1 for x in rez if x['mod_probat'])} probate, {round(time.time() - t0)} s, "
          f"procese {jurnal['procese']}")
    return 0


# ================================================================================================ WORD
def clasa_word():
    Baza = W3.clasa_word_r3()

    class WordR26(Baza):
        def punct_capat(self, rng, capat):
            w = self.a.ActiveWindow
            o = w._oleobj_
            dispid = o.GetIDsOfNames("GetPoint")
            x, y, l, h = o.InvokeTypes(dispid, 0, 1, (24, 0), ((16387, 2), (16387, 2), (16387, 2), (16387, 2), (9, 1)),
                                       0, 0, 0, 0, rng._oleobj_)
            if capat == "stanga":
                return x + 1, y + h // 2
            if capat == "dreapta":
                return x + l - 1, y + h // 2
            return x + l // 2, y + h // 2

        def pas_gest(self, p):
            g = p["gest"]
            if g == "clic" and p.get("id_mso") == "FontSize":
                return self.focus_font_size(p)
            if g == "trage":
                a = self.punct_capat(self.domeniu(p["de_la"]), p["de_la"].get("capat", "stanga"))
                b = self.punct_capat(self.domeniu(p["la"]), p["la"].get("capat", "dreapta"))
                trage_postat(self.hdoc, a, b, stare_buton=self.cu_stare_buton)
                self.canale_r3.add("trage_mouse")
                return ("mouse postat: WM_LBUTTONDOWN la începutul lui „%s”, WM_MOUSEMOVE (MK_LBUTTON) ×8, WM_LBUTTONUP la "
                        "capătul din dreapta al lui „%s”" % (p["de_la"].get("cuvant"), p["la"].get("cuvant")))
            if g == "taste" and p["taste"] in ("Ctrl+C", "Ctrl+X", "Ctrl+V"):
                antes = secventa_clip()
                rr = super().pas_gest(p)
                self.fapte_clip.append({"tasta": p["taste"], "secventa_schimbata": secventa_clip() != antes,
                                        "clipboard_text_dupa": clip_text()})
                return rr
            return super().pas_gest(p)

        def focus_font_size(self, p):
            if p.get("fila"):
                self.fila(p["fila"])
            cb, ed = self.caseta_font_size()
            if ed is None:
                raise RuntimeError("caseta FontSize n-are Edit")
            ed.SetFocus()
            time.sleep(0.8)
            focus = bool(ed.CurrentHasKeyboardFocus)
            sel = None
            try:
                tp = U.pattern(ed, 10014, U.IText)
                rs = tp.GetSelection() if tp else None
                sel = [rs.GetElement(i).GetText(-1) for i in range(rs.Length)] if rs else None
            except Exception as e:  # noqa: BLE001
                sel = f"necitit: {e!r}"[:60]
            val = None
            try:
                lp = U.pattern(ed, 10018, U.ILegacy)
                val = str(lp.CurrentValue) if lp else None
            except Exception:  # noqa: BLE001
                pass
            self.fapt_caseta = {"focus_in_caseta": focus, "selectia_din_caseta": sel, "valoarea_casetei": val}
            if not focus:
                raise RuntimeError(f"UIA SetFocus nu a dus focusul în caseta Font Size ({self.fapt_caseta})")
            if val is not None and sel is not None and sel != [val]:
                raise RuntimeError(f"după focus, textul casetei nu e ales întreg ({self.fapt_caseta}) — nu e ce face clicul")
            self.canale_r3.add("caseta_focus_uia")
            return (f"UIA SetFocus pe caseta Font Size (în locul clicului: clicul postat nu dă focusul pe desktopul ascuns, "
                    f"runde/3 AC-1; după focus: {self.fapt_caseta})")

        def pas_model(self, p):
            if p.get("gest") == "comanda_panglica" and p.get("id_mso") == "FlyoutAnchorInsertPictures":
                self.canale_r3.add("model_obiect")
                self.d.InlineShapes.AddPicture(str(RR.WT / p["fisier"]), False, True, self.a.Selection.Range)
                return f"Insert › Pictures ▾ › „{p.get('element')}” = InlineShapes.AddPicture (fereastra de fișiere nu face parte din scenariu)"
            self.canale_r3.add("model_obiect")
            return RR.Word.pas_model(self, p)

    WordR26.cu_stare_buton = False
    WordR26.fapte_clip = []
    return WordR26


def captura_pictures(r):
    """Insert › Pictures ▾ pe Word real: rândurile meniului (UIA), apoi ce deschide rândul „This Device…” (Cancel)."""
    cap = W3.Cap(r.s)
    r.start({"paragrafe": ["Vulcanul", ""], "cursor": 9})
    r.fila("TabInsert")
    el = RR.gaseste_id(U.din_hwnd(r.hmain), "FlyoutAnchorInsertPictures")
    if el is None:
        raise RuntimeError("FlyoutAnchorInsertPictures nu e pe fila Insert")
    inainte = {x for x, _, _ in cap.ferestre()}
    if not RR.uia_expand(el):
        RR.uia_invoke(el)
    noi = cap.noi(inainte, 6.0)
    nod = cap.lista_deschisa(el, noi)
    randuri = [{"tip": t, "eticheta": e} for t, e in W3.etichete(nod)] if nod else []
    detalii = []

    def plimba(n):
        if isinstance(n, dict):
            if n.get("tip") in ("MenuItem", "Button", "ListItem") and n.get("eticheta"):
                detalii.append({k: n.get(k) for k in ("tip", "eticheta", "id_mso", "tasta_acces", "scurtatura", "ajutor")
                                if n.get(k) is not None})
            for c in n.get("copii", []):
                plimba(c)
    plimba(nod or {})
    rand = next((d for d in detalii if str(d.get("eticheta", "")).startswith("This Device")), None)
    deschide = None
    if rand is not None:
        it = R7.element_in_noi(cap, noi, rand["eticheta"], (50011, 50000, 50007)) or \
            RR.gaseste_nume(el, rand["eticheta"], (50011, 50000, 50007))
        inainte2 = {x for x, _, _ in cap.ferestre()}
        if it is not None:
            R7.apasa_in_fir(it)
            noi2 = cap.noi(inainte2, 8.0)
            deschide = [{"clasa": c, "titlu": t} for _, c, t in noi2]
    r.inchide_tot()
    return {"randuri_meniu": detalii, "etichete": randuri, "this_device": rand, "dupa_this_device": deschide,
            "cum": "UIA ExpandCollapse.Expand pe Pictures (FlyoutAnchorInsertPictures) pe fila Insert, rândurile citite din "
                   "fereastra nouă; „This Device…” apăsat prin UIA Invoke într-un fir separat; fereastra apărută închisă cu "
                   "Cancel / Esc (nimic inserat)"}


def proba_font_size(r):
    """Canalul „caseta_focus_uia”: pozitiv = SetFocus pe caseta Font Size + „20” + Enter → „are” are 20 pt;
    control = fără SetFocus, „20” tastat ajunge în document (înlocuiește „are”), nicio mărime 20."""
    st = {"paragrafe": ["Ana are mere"], "selectie": {"de_la": 4, "pana_la": 7}}
    r.start(st)
    c1 = r.focus_font_size({"fila": "TabHome"})
    r.pas_gest({"gest": "tasteaza", "text": "20", "in": "Font Size"})
    r.pas_gest({"gest": "taste", "taste": "Enter"})
    a1 = r.citeste(["text", "formatare_pe_caractere"])
    r.start(st)
    RR.trimite_text(r.hdoc, "20")
    a2 = r.citeste(["text", "formatare_pe_caractere"])
    poz = a1["text"] == ["Ana are mere"] and any(x["text"].strip() == "are" and x["marime"] == 20
                                                  for x in a1["formatare_pe_caractere"])
    neg = a2["text"] != ["Ana are mere"] and not any(x["marime"] == 20 for x in a2["formatare_pe_caractere"])
    r.probe["caseta_focus_uia"] = {"pozitiv": poz, "control": neg, "trecut": poz and neg,
                                   "detalii": {"SetFocus + 20 + Enter": a1, "cum": c1, "fără SetFocus (control)": a2}}
    log(f"  proba caseta_focus_uia: pozitiv={poz} control={neg}")
    return r.probe["caseta_focus_uia"]


def proba_trage_word(r):
    """Canalul „trage_mouse” pe Word: pozitiv = tragerea din „Al” până după „doilea” alege mai mult decât un cursor;
    control = apăsare și ridicare la început, apoi mișcare fără buton → cursor, nimic ales."""
    rez = {}
    st = {"paragrafe": ["Al doilea paragraf"], "cursor": 0}
    for stare_buton in (False, True):
        r.cu_stare_buton = stare_buton
        r.start(st)
        a = r.punct_capat(r.d.Range(0, 2), "stanga")
        b = r.punct_capat(r.d.Range(3, 9), "dreapta")
        trage_postat(r.hdoc, a, b, stare_buton=stare_buton)
        s1 = r.citeste(["selectie"])["selectie"]
        r.start(st)
        trage_postat(r.hdoc, a, b, cu_buton=False, stare_buton=stare_buton)
        s2 = r.citeste(["selectie"])["selectie"]
        poz = s1["pana_la"] - s1["de_la"] >= 6
        neg = s2["pana_la"] == s2["de_la"]
        rez["cu_stare_buton" if stare_buton else "doar_postat"] = {"pozitiv": poz, "control": neg, "trecut": poz and neg,
                                                                   "detalii": {"tragere": s1, "control_fara_buton": s2}}
        log(f"  proba trage_mouse word (stare_buton={stare_buton}): {s1} / {s2}")
        if poz and neg:
            break
    ales = "doar_postat" if rez.get("doar_postat", {}).get("trecut") else (
        "cu_stare_buton" if rez.get("cu_stare_buton", {}).get("trecut") else None)
    r.cu_stare_buton = ales == "cu_stare_buton"
    r.probe["trage_mouse"] = {"pozitiv": bool(ales), "control": bool(ales), "trecut": bool(ales), "varianta": ales,
                              "detalii": rez}
    return r.probe["trage_mouse"]


WORD_SC = ["word-clic-pune-cursorul", "word-imagine-inserare", "word-font-size-tastat"]
WORD_CLIP = ["word-copiere-lipire", "word-decupare-lipire"]
WORD_TRAGE = ["word-tragere-selectie"]


def word_intern():
    incarca()
    if U.nume_desktop_curent().lower() == "default":
        print("REFUZ: rulez pe desktopul VIZIBIL al omului.", file=sys.stderr)
        return 2
    doar = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--doar=")), "tot")
    U.init_uia()
    import pythoncom
    pythoncom.CoInitialize()
    straine = pids("WINWORD.EXE")
    log(f"WINWORD.EXE înainte de pornire: {len(straine)} procese (nu le ating)")
    ok_clip, clip = clip_doar_text()
    sec0 = secventa_clip()
    r = clasa_word()("word")
    rez, fapte, t0 = [], {"clipboard_omului_doar_text": ok_clip}, time.time()
    try:
        r.porneste()
        RR.BARIERA[0] = lambda: r.a.Selection.Start
        log(f"  PID-ul meu: nou = {r.s.proc.pid not in straine}")
        versiune = f"{U.versiune_exe(U.APPS['word']['exe'])}, build COM {r.s.build}"
        try:
            RR.proba(r)
        except Exception:  # noqa: BLE001
            log("proba a căzut:\n" + traceback.format_exc())
        if doar in ("tot", "captura"):
            try:
                fapte["pictures"] = captura_pictures(r)
                BRUT_W.write_text(json.dumps(curat(fapte["pictures"]), ensure_ascii=False, indent=1), encoding="utf-8")
            except Exception:  # noqa: BLE001
                log("captura_pictures a căzut:\n" + traceback.format_exc())
        for nume, f in (("proba_font_size", proba_font_size), ("proba_trage_word", proba_trage_word)):
            try:
                fapte[nume] = f(r)
            except Exception:  # noqa: BLE001
                log(f"{nume} a căzut:\n" + traceback.format_exc())
        if doar in ("tot", "scenarii"):
            gen = RULAT_DE + " (pe clasele din acoperire_word_r3.py și ruleaza_real.py)"
            for sid in WORD_SC:
                if time.time() - t0 > LIMITA_S:
                    break
                if sid == "word-font-size-tastat" and not r.probe.get("caseta_focus_uia", {}).get("trecut"):
                    log(f"  {sid}: NERULAT — focusul casetei Font Size nu se poate da invizibil (proba caseta_focus_uia)")
                    continue
                rez.append(ruleaza_unul(r, scenariu("word", sid), versiune, gen))
            for sid in WORD_CLIP:
                if time.time() - t0 > LIMITA_S:
                    break
                if not ok_clip:
                    log(f"  {sid}: NERULAT — clipboard-ul omului are și altceva decât text ({clip}); nu-l ating")
                    continue
                clip_pune(None)
                r.fapte_clip = []
                x = ruleaza_unul(r, scenariu("word", sid), versiune, gen,
                                 "; clipboard-ul omului (gol sau doar text) salvat înainte, golit înainte de Ctrl+C / Ctrl+X, "
                                 "pus la loc după scenariu")
                x["clipboard"] = list(r.fapte_clip)
                if not all(c["secventa_schimbata"] for c in r.fapte_clip if c["tasta"] != "Ctrl+V"):
                    x["mod_probat"] = False
                    x["nota"] = "Ctrl+C / Ctrl+X n-a schimbat clipboard-ul: tasta n-a ajuns"
                (RR.REAL / f"{sid}.json").write_text(json.dumps(x, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
                fapte.setdefault("clipboard_pus_la_loc", []).append(clip_pune(clip))
                rez.append(x)
            if r.probe.get("trage_mouse", {}).get("trecut"):
                for sid in WORD_TRAGE:
                    if time.time() - t0 > LIMITA_S:
                        break
                    rez.append(ruleaza_unul(r, scenariu("word", sid), versiune, gen))
    except Exception:  # noqa: BLE001
        log(traceback.format_exc())
    finally:
        try:
            r.inchide()
        except Exception:  # noqa: BLE001
            log("închidere: " + traceback.format_exc())
        if ok_clip:
            fapte["clipboard_final_pus_la_loc"] = clip_pune(clip)
    dupa = pids("WINWORD.EXE")
    jurnal = {"generat": time.strftime("%Y-%m-%d %H:%M"), "desktop": DESKTOP_SC, "probe": r.probe, "fapte": fapte,
              "rezultate": [{k: x[k] for k in ("id", "mod_probat", "eroare")} for x in rez],
              "clipboard": {"secventa_inainte": sec0, "secventa_dupa": secventa_clip(), "text_dupa_egal_cu_inainte": clip_text() == clip},
              "procese": {"word_straine_inainte": len(straine), "pid_meu_ramas": r.s.proc.pid in dupa,
                          "straine_neatinse": all(p in dupa for p in straine)},
              "erori_sesiune": r.s.erori, "durata_s": round(time.time() - t0), "jurnal": LOG}
    IES.mkdir(parents=True, exist_ok=True)
    (IES / f"word_jurnal_{time.strftime('%H%M')}.json").write_text(
        json.dumps(curat(jurnal), ensure_ascii=False, indent=1, default=str), encoding="utf-8")
    print(f"word: {len(rez)} rulate, {sum(1 for x in rez if x['mod_probat'])} probate, {round(time.time() - t0)} s, "
          f"procese {jurnal['procese']}, clipboard {jurnal['clipboard']}")
    return 0


# ================================================================================================ scenariile
def scrie_scenarii():
    dosar = D / "scenarii"
    schimbate = []

    def scrie(app, sc):
        (dosar / app / f"{sc['id']}.json").write_text(json.dumps(sc, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        schimbate.append(sc["id"])

    # 1. sortarea: pașii rămân; descrierea spune acum ce apel joacă fereastra Sort
    s = scenariu("excel", "excel-sortare-doua-niveluri")
    s["descriere"] = re.sub(r"Prin model: .*?\. celule", "Prin model: Worksheet.Sort cu două niveluri, ca fereastra Sort "
                            "(SortFields: Clasa, Cell Values, A to Z; Punctaj, Cell Values, Largest to Smallest; Header = "
                            "xlYes). celule", s["descriere"])
    s["descriere"] = s["descriere"].replace("rezultatul real: referinte/acoperire_excel_r7.py scenarii)",
                                            "rezultatul real: referinte/acoperire_excel_r7.py, refăcut în runda `acoperire` "
                                            "Office 21.11.2026 — vechiul Range.Sort cu argumente numite dădea Punctaj "
                                            "crescător, R25-1)")
    scrie("excel", s)
    # 2. autocompletare / separator: două momente
    for sid in ("excel-autocompletare-tab", "excel-separator-virgula"):
        s = scenariu("excel", sid)
        baza = s["descriere"].split(" Stare:")[0].rstrip(". ")
        pereche = sid + "-esc-esc"
        s1 = dict(s)
        s1["descriere"] = baza + ". " + D_MSG + MOMENT1.format(p=pereche)
        s1["stare_citita"] = ["fereastra_mesaj", "ramane_in_editare"]
        s1["rulat_de"] = RULAT_DE
        scrie("excel", s1)
        s2 = dict(s)
        s2["id"] = pereche
        s2["descriere"] = baza + ", apoi Esc, Esc. " + D_CEL + " " + D_MSG + MOMENT2
        s2["pasi"] = list(s["pasi"]) + [{"gest": "taste", "taste": "Esc"}, {"gest": "taste", "taste": "Esc"}]
        s2["stare_citita"] = ["celule", "fereastra_mesaj", "ramane_in_editare"]
        s2["rulat_de"] = RULAT_DE
        scrie("excel", s2)
    # 3. clicul: la granița „me|re” (caracterul 10), nu la mijlocul în pixeli al cuvântului
    s = scenariu("word", "word-clic-pune-cursorul")
    s["descriere"] = ("„Ana are mere multe”, selectat „Ana”; un clic în „mere”, între „me” și „re” (caretul înaintea "
                      "caracterului 10: ținta `pozitie:10`, api_biblioteca.md §7.2) — selecția dispare, cursorul intră în "
                      "cuvânt. Punctul clicului e chiar granița dintre litere, deci cea mai apropiată graniță e aceeași pe "
                      "ambele părți (runda `acoperire` Office, 21.11.2026: înainte, clicul la mijlocul în pixeli al "
                      "cuvântului cădea la 0,5 px de centrul lui „e”, R24-1). Stare: selectie = {de_la, pana_la, text} în "
                      "caractere de la începutul documentului.")
    s["pasi"] = [{"gest": "clic", "de_la": 10, "pana_la": 10}]
    s["rulat_de"] = RULAT_DE
    scrie("word", s)
    # 4. imaginea: meniul Pictures ▾ întâi, apoi rândul capturat din Word real
    b = json.loads(BRUT_W.read_text(encoding="utf-8")) if BRUT_W.exists() else {}
    rand = (b.get("this_device") or {}).get("eticheta")
    if rand:
        s = scenariu("word", "word-imagine-inserare")
        s["descriere"] = (f"Insert › Pictures ▾ › „{rand}”, un fișier PNG — prin model: InlineShapes.AddPicture (fereastra "
                          "Windows de alegere a fișierului nu face parte din scenariu). Pasul deschide întâi meniul Pictures, "
                          "ca în Word real (rândurile capturate în runda `acoperire` Office, 21.11.2026: "
                          "runde/26/acoperire_office/capturi_word_brut.json). imagini = {in_linie, flotante}.")
        s["pasi"] = [{"gest": "comanda_panglica", "fila": "TabInsert", "id_mso": "FlyoutAnchorInsertPictures",
                      "element": rand, "fisier": "tutoriale/excel/media/01-latime-coloana.png"}]
        s["rulat_de"] = RULAT_DE
        scrie("word", s)
    else:
        print("ATENȚIE: captura Pictures lipsește — word-imagine-inserare nescris")
    # 5. fără real: le iau doar pe cele cu rezultat real probat (după rulare: --dupa-rulare)
    if "--dupa-rulare" in sys.argv:
        for app, sid in [("word", x) for x in ("word-font-size-tastat", "word-copiere-lipire", "word-decupare-lipire",
                                                "word-tragere-selectie")] + [("excel", x) for x in EXCEL_TRAGE]:
            rf = RR_REAL() / f"{sid}.json"
            if not rf.exists():
                continue
            real = json.loads(rf.read_text(encoding="utf-8"))
            s = scenariu(app, sid)
            if real.get("mod_probat") is True and not real.get("eroare"):
                s.pop("trimis_la_profesor", None)
                s["rulat_de"] = RULAT_DE
                if "Trimis la profesor." in s["descriere"] or "trimis la profesor." in s["descriere"]:
                    s["descriere"] = re.sub(r" NU se (rulează|poate rula) invizibil.*?[Tt]rimis la profesor\.", "",
                                            s["descriere"], flags=re.S)
                else:
                    s["descriere"] = re.sub(r" NU se (rulează|poate rula) invizibil[^.]*\.", "", s["descriere"])
                s["descriere"] = re.sub(r" Clicul postat pe caseta din panglică NU.*$", "", s["descriere"])
                s["descriere"] += (" Rezultat real în runda `acoperire` Office (21.11.2026): " + real["cum"].split("; pașii: ")[1].split(";")[0] + ".")
                scrie(app, s)
            else:
                rf.unlink()
                print(f"{sid}: realul nu e probat — fișierul real șters, scenariul rămâne la profesor")
    print(f"scenarii scrise: {len(schimbate)}: {', '.join(schimbate)}")
    return 0


def RR_REAL():  # noqa: N802
    return AICI / "scenarii_real"


# ================================================================================================ starea mașinii
def stare_masina():
    import os
    import winreg
    et = next((a.split("=", 1)[1] for a in sys.argv if a.startswith("--eticheta=")), "acum")

    def valori(cheie):
        n = 0
        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, cheie) as k:
                i = 0
                while True:
                    try:
                        winreg.EnumValue(k, i)
                        n += 1
                        i += 1
                    except OSError:
                        break
        except OSError:
            return None
        return n
    ok, _ = clip_doar_text()
    tmp = Path(os.environ.get("TEMP", "."))
    st = {"eticheta": et, "ora": time.strftime("%Y-%m-%d %H:%M:%S"),
          "pid": {img: pids(img) for img in ("EXCEL.EXE", "WINWORD.EXE", "POWERPNT.EXE")},
          "clipboard": {"secventa": secventa_clip(), "gol_sau_doar_text": ok},
          "recent": {"word_mru": valori(r"Software\Microsoft\Office\16.0\Word\User MRU"),
                     "excel_resiliency": valori(r"Software\Microsoft\Office\16.0\Excel\Resiliency\DocumentRecovery"),
                     "word_resiliency": valori(r"Software\Microsoft\Office\16.0\Word\Resiliency\DocumentRecovery")},
          "fisiere_lh_r26_in_temp": len(list(tmp.glob("lh_r26_*")))}
    IES.mkdir(parents=True, exist_ok=True)
    (IES / f"stare_masina_{et}.json").write_text(json.dumps(st, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps(st, ensure_ascii=False))
    return 0


# ================================================================================================ verifica
NOI = ["excel-autocompletare-tab-esc-esc", "excel-separator-virgula-esc-esc"]
ATINSE = {"excel": ["excel-sortare-doua-niveluri", "excel-autocompletare-tab", "excel-separator-virgula"] + NOI,
          "word": ["word-clic-pune-cursorul", "word-imagine-inserare"]}


def verifica():
    p = []
    for app, iduri in ATINSE.items():
        for sid in iduri:
            f = D / "scenarii" / app / f"{sid}.json"
            if not f.exists():
                p.append(f"scenariul {sid} lipsește")
                continue
            s = json.loads(f.read_text(encoding="utf-8"))
            rf = AICI / "scenarii_real" / f"{sid}.json"
            if not rf.exists():
                p.append(f"{sid}: fără rezultat real")
                continue
            r = json.loads(rf.read_text(encoding="utf-8"))
            if r.get("mod_probat") is not True or r.get("eroare"):
                p.append(f"{sid}: realul nu e probat ({r.get('eroare') or r.get('nota')})"[:200])
            lipsa = [k for k in s.get("stare_citita", []) if k not in (r.get("stare") or {})]
            if lipsa:
                p.append(f"{sid}: realul n-are cheile {lipsa}")
            if "14.11" in r.get("cum", "") or "19.11.2026" in r.get("cum", "") or "17.11.2026" in r.get("cum", ""):
                p.append(f"{sid}: realul e cel vechi (nu recapturat)")
    s = json.loads((AICI / "scenarii_real" / "excel-sortare-doua-niveluri.json").read_text(encoding="utf-8"))
    cel = (s.get("stare") or {}).get("celule", {})
    for cls, rr in (("VIII A", range(2, 5)), ("VIII B", range(5, 8))):
        pct = [cel.get(f"C{i}", {}).get("valoare") for i in rr]
        if [cel.get(f"B{i}", {}).get("valoare") for i in rr] != [cls] * 3 or pct != sorted(pct, reverse=True):
            p.append(f"sortarea reală: {cls} nu e Largest to Smallest ({pct})")
    for f in list(IES.glob("*.json")) + list(IES.glob("*.md")) + list(IES.glob("*.txt")) + [Path(__file__)] + \
            [AICI / "scenarii_real" / f"{x}.json" for v in ATINSE.values() for x in v]:
        if f.exists() and re.search(r"c:[\\/]+users[\\/]", f.read_text(encoding="utf-8", errors="replace").lower()):
            p.append(f"cale cu C:/Users în {f.name}")
    for x in p:
        print("PROBLEMĂ:", x)
    print(len(p))
    return 1 if p else 0


# ================================================================================================ main
def pe_desktop_ascuns(cmd):
    args = [sys.executable, str(HIDDEN), "run", "--desktop", DESKTOP_SC, "--timeout", "900", "--",
            sys.executable, str(Path(__file__)), cmd + "_intern"] + [a for a in sys.argv[2:]]
    r = subprocess.run(args, capture_output=True, text=True, encoding="utf-8", errors="replace")
    print(W3_fara(r.stdout)[-6000:])
    if r.stderr.strip():
        print("stderr:", W3_fara(r.stderr)[-3000:])
    return r.returncode


def W3_fara(t):  # noqa: N802
    import acoperire_word_r3 as W
    return W.fara_cale_personala(t)


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd in ("excel", "word"):
        return pe_desktop_ascuns(cmd)
    if cmd == "excel_intern":
        return excel_intern()
    if cmd == "word_intern":
        return word_intern()
    if cmd == "scrie_scenarii":
        return scrie_scenarii()
    if cmd == "stare":
        return stare_masina()
    if cmd == "verifica":
        return verifica()
    print(__doc__)
    return 2


if __name__ == "__main__":
    sys.exit(main())
