"""Ghid peste Excel-ul REAL: chenar peste locul unde trebuie sa dea clic elevul + balon cu instructiunea.

Porneste un Excel propriu (nu atinge alte Excel-uri deschise), cu un registru nou, si merge pas cu pas:
- butoanele din panglica le gaseste prin UI Automation, dupa ID-ul Microsoft (TabHome, AutoSum...) -
  acelasi ID in Office romanesc si englezesc;
- celulele le gaseste dupa antetele de coloana/rand raportate tot prin UI Automation;
- ce a facut elevul citeste prin COM (valori, formule, celula selectata) si trece singur la pasul urmator.
Lectiile stau in lectii/*.yaml (formatul: lectie.py).

Rulare:
  ghid_excel.py                         alegi lectia dintr-o lista
  ghid_excel.py lectii/01_....yaml      direct lectia
  ghid_excel.py --verifica [lectie]     elev simulat parcurge lectia (sau toate); ultima linie = pasi blocati
  ghid_excel.py --verifica --capturi D  ... si salveaza o captura la fiecare pas in D
"""
import argparse
import ctypes
import os
import re
import sys
import tkinter as tk
from pathlib import Path

ctypes.windll.shcore.SetProcessDpiAwareness(2)  # coordonate in pixeli fizici, ca UI Automation

import pythoncom
import pywintypes
import win32com.client
import win32gui
from pywinauto import Desktop

import lectie as L

ROSU = "#e8173c"
GALBEN = "#fffbe6"
GROS = 4          # grosimea chenarului
PAS_MS = 350      # cat de des ne uitam la Excel

GWL_EXSTYLE = -20
WS_EX_NOACTIVATE = 0x08000000
WS_EX_TOOLWINDOW = 0x00000080
WS_EX_TRANSPARENT = 0x00000020
WS_EX_LAYERED = 0x00080000


def dosar_program():
    """Langa .exe cand e impachetat (PyInstaller), altfel langa acest fisier."""
    return Path(sys.executable).parent if getattr(sys, "frozen", False) else Path(__file__).parent


def fara_focus(win, click_prin=False):
    """Fereastra nu fura focusul de la Excel (optional: clicurile trec prin ea)."""
    win.update_idletasks()
    hwnd = ctypes.windll.user32.GetParent(win.winfo_id())
    st = ctypes.windll.user32.GetWindowLongW(hwnd, GWL_EXSTYLE)
    st |= WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW
    if click_prin:
        st |= WS_EX_TRANSPARENT | WS_EX_LAYERED
    ctypes.windll.user32.SetWindowLongW(hwnd, GWL_EXSTYLE, st)


# ---------------------------------------------------------------- unde e tinta pe ecran

class Grila:
    """Unde e o celula pe ecran, dupa antetele de coloana (A, B...) si de rand (1, 2...) pe care Excel le
    raporteaza prin UI Automation. PointsToScreenPixels din COM greseste cand foaia e derulata
    (masurat: oracol_pozitii.py), deci nu ne bazam pe el. Antetele se recitesc doar cand se schimba
    zoom-ul, derularea sau fereastra (citirea dureaza ~1 s)."""

    def __init__(self, xl):
        self.xl = xl
        self.uia = Desktop(backend="uia").window(handle=xl.Hwnd)
        self.cheie = None
        self.antete = {}

    def _citeste(self):
        w = self.xl.ActiveWindow
        cheie = (w.ScrollRow, w.ScrollColumn, w.Zoom, win32gui.GetWindowRect(self.xl.Hwnd))
        if cheie == self.cheie:
            return
        antete = {}
        for el in self.uia.descendants(control_type="DataItem"):
            n = el.window_text().strip()
            if re.fullmatch(r"[A-Z]{1,3}|\d{1,7}", n) and n not in antete:
                r = el.rectangle()
                antete[n] = (r.left, r.top, r.right, r.bottom)
        self.antete, self.cheie = antete, cheie

    def dreptunghi(self, adresa):
        """Dreptunghiul pe ecran (pixeli fizici) al unui domeniu ca A1 sau A2:A6, sau None daca nu se vede."""
        self._citeste()
        capete = [re.fullmatch(r"\$?([A-Z]+)\$?(\d+)", c.strip()) for c in adresa.split(":")]
        c1, c2 = capete[0], capete[-1]
        col1, col2 = self.antete.get(c1.group(1)), self.antete.get(c2.group(1))
        rand1, rand2 = self.antete.get(c1.group(2)), self.antete.get(c2.group(2))
        if not (col1 and col2 and rand1 and rand2):
            return None
        return col1[0], rand1[1], col2[2], rand2[3]

    def sus_grila(self):
        """Marginea de sus a grilei (sub bara de formule) - acolo punem balonul pentru butoanele din panglica."""
        self._citeste()
        a = self.antete.get("A") or next((v for k, v in self.antete.items() if k.isalpha()), None)
        return a[3] if a else None


class Panglica:
    """Cauta butoane din panglica dupa ID-ul Microsoft (acelasi in RO si EN)."""

    def __init__(self, hwnd):
        self.win = Desktop(backend="uia").window(handle=hwnd)
        self.cache = {}

    def dreptunghi(self, auto_id):
        el = self.cache.get(auto_id)
        try:
            if el is None:
                el = self.win.child_window(auto_id=auto_id).wrapper_object()
                self.cache[auto_id] = el
            r = el.rectangle()
            if r.width() <= 0 or r.height() <= 0:
                return None
            return r.left, r.top, r.right, r.bottom
        except Exception:
            self.cache.pop(auto_id, None)
            return None


# ---------------------------------------------------------------- ferestrele de pe ecran

class Chenar:
    """Patru benzi subtiri in jurul tintei: nu acopera nimic, deci clicul ajunge in Excel."""

    def __init__(self, root):
        self.benzi = []
        for _ in range(4):
            b = tk.Toplevel(root)
            b.overrideredirect(True)
            b.attributes("-topmost", True)
            b.configure(bg=ROSU)
            fara_focus(b, click_prin=True)
            b.withdraw()
            self.benzi.append(b)
        self.ultim = None

    def arata(self, d):
        if d == self.ultim:
            return
        self.ultim = d
        if d is None:
            for b in self.benzi:
                b.withdraw()
            return
        x1, y1, x2, y2 = d
        x1 -= GROS + 2
        y1 -= GROS + 2
        x2 += 2
        y2 += 2
        w, h = x2 - x1 + GROS, y2 - y1 + GROS
        pozitii = [
            (w, GROS, x1, y1),            # sus
            (w, GROS, x1, y2),            # jos
            (GROS, h, x1, y1),            # stanga
            (GROS, h, x2, y1),            # dreapta
        ]
        for b, (bw, bh, bx, by) in zip(self.benzi, pozitii):
            b.geometry(f"{bw}x{bh}+{bx}+{by}")
            b.deiconify()
            b.lift()


class Balon:
    def __init__(self, root, la_inchidere, la_inapoi, la_inainte, la_sari):
        t = tk.Toplevel(root)
        t.overrideredirect(True)
        t.attributes("-topmost", True)
        t.configure(bg=ROSU)
        interior = tk.Frame(t, bg=GALBEN, padx=14, pady=10)
        interior.pack(padx=2, pady=2)
        self.titlu = tk.Label(interior, bg=GALBEN, fg="#8a0f24", font=("Segoe UI", 11, "bold"), anchor="w",
                              justify="left")
        self.titlu.pack(fill="x")
        self.text = tk.Label(interior, bg=GALBEN, fg="#1b1b1b", font=("Segoe UI", 13), anchor="w",
                             justify="left", wraplength=460)
        self.text.pack(fill="x", pady=(4, 6))
        self.stare = tk.Label(interior, bg=GALBEN, fg="#6b6b6b", font=("Segoe UI", 10, "italic"), anchor="w",
                              justify="left", wraplength=460)
        self.stare.pack(fill="x")
        jos = tk.Frame(interior, bg=GALBEN)
        jos.pack(fill="x", pady=(6, 0))
        buton = dict(relief="flat", bg="#eee", activebackground="#ddd", padx=8)
        tk.Button(jos, text="Închide", command=la_inchidere, **buton).pack(side="left")
        self.b_inapoi = tk.Button(jos, text="‹ Înapoi", command=la_inapoi, **buton)
        self.b_sari = tk.Button(jos, text="Sari pasul ›", command=la_sari, **buton)
        self.b_inainte = tk.Button(jos, text="Înainte ›", command=la_inainte, bg="#1f7a47", fg="white",
                                   activebackground="#17613a", relief="flat", padx=8)
        self.jos = jos
        fara_focus(t)
        self.t = t
        self.hwnd = ctypes.windll.user32.GetParent(t.winfo_id())

    def butoane(self, inapoi, inainte, sari):
        for b in (self.b_inapoi, self.b_sari, self.b_inainte):
            b.pack_forget()
        if inainte:
            self.b_inainte.pack(side="right")
        if sari:
            self.b_sari.pack(side="right")
        if inapoi:
            self.b_inapoi.pack(side="right", padx=(0, 6))

    def seteaza(self, titlu, text, stare=""):
        self.titlu.config(text=titlu)
        self.text.config(text=text)
        self.stare.config(text=stare)

    def aseaza(self, d, ecran_excel, sub=None):
        """Langa tinta, fara s-o acopere. `sub` = cel mai sus unde are voie (ex. sub panglica,
        ca balonul sa nu acopere butoanele vecine ale celui cautat)."""
        self.t.update_idletasks()
        bw, bh = self.t.winfo_reqwidth(), self.t.winfo_reqheight()
        ex1, ey1, ex2, ey2 = ecran_excel
        if d is None:
            x, y = ex2 - bw - 30, ey2 - bh - 60
        else:
            x1, y1, x2, y2 = d
            x = min(max(x1, ex1 + 10), ex2 - bw - 10)
            y = max(y2 + 14, (sub or 0) + 10)
            if y + bh > ey2 - 10:
                y = y1 - bh - 14
            if x1 < x + bw and x2 > x and y1 < y + bh and y2 > y:  # ar acoperi tinta -> la dreapta ei
                x, y = x2 + 18, y1
        x, y = int(x), int(y)
        # Tk muta balonul inapoi la pozitia lui interna (0,0) cand se schimba textul (masurat) ->
        # comparam cu locul REAL din Windows si il mutam direct, la fiecare tic
        if win32gui.GetWindowRect(self.hwnd) != (x, y, x + bw, y + bh):
            # win32gui, nu ctypes: -1 (HWND_TOPMOST) trebuie trimis ca pointer pe 64 de biti
            win32gui.SetWindowPos(self.hwnd, -1, x, y, bw, bh,
                                  0x0010 | 0x0040)  # SWP_NOACTIVATE | SWP_SHOWWINDOW


# ---------------------------------------------------------------- bucla

class Ghid:
    """i = pasul aratat; max = cel mai departe pas atins. Pe pasul `max` ghidul asteapta ca elevul sa-l faca;
    pe un pas dinainte (dupa „‹ Înapoi”) doar il arata, cu „Înainte ›” - altfel ar sari imediat inapoi,
    fiindca pasul e deja facut in foaie."""

    def __init__(self, xl, lectia, la_final=None):
        self.xl = xl
        self.ws = xl.ActiveSheet
        self.lectia = lectia
        self.pasi = lectia["pasi"]
        self.i = 0
        self.max = 0
        self.gata_tot = False
        self.la_final = la_final
        self.root = tk.Tk()
        self.root.withdraw()
        self.panglica = Panglica(xl.Hwnd)
        self.grila = Grila(xl)
        self.chenar = Chenar(self.root)
        self.balon = Balon(self.root, self.inchide, self.inapoi, self.inainte, self.sari)
        self.arata_pasul()
        self.urmator_tic = self.root.after(PAS_MS, self.tic)

    def programeaza(self):
        self.urmator_tic = self.root.after(PAS_MS, self.tic)

    def arata_pasul(self):
        p = self.pasi[self.i]
        revazut = self.i < self.max
        self.balon.seteaza(p["titlu"], p["text"], "Pas deja făcut ✓ — apasă Înainte când vrei." if revazut else "")
        self.balon.butoane(inapoi=self.i > 0, inainte=revazut, sari=not revazut)

    def inapoi(self):
        if self.gata_tot:
            self.gata_tot = False
            self.i = len(self.pasi) - 1
        elif self.i > 0:
            self.i -= 1
        self.arata_pasul()

    def inainte(self):
        if self.i < self.max:
            self.i += 1
            self.arata_pasul()

    def sari(self):
        self.urmatorul()

    def urmatorul(self):
        if self.i + 1 >= len(self.pasi):
            self.max = len(self.pasi)
            self.gata_tot = True
            self.chenar.arata(None)
            self.balon.seteaza("Gata! Bravo!", self.lectia["final"])
            self.balon.butoane(inapoi=True, inainte=False, sari=False)
            self.balon.aseaza(None, win32gui.GetWindowRect(self.xl.Hwnd))
            if self.la_final:
                self.root.after(1500, self.la_final)
            return
        self.i += 1
        self.max = max(self.max, self.i)
        self.arata_pasul()

    def inchide(self):
        try:
            self.root.after_cancel(self.urmator_tic)
        except (tk.TclError, AttributeError):
            pass
        self.root.destroy()

    def tinta(self, p):
        """(dreptunghi, sub) - sub = cel mai sus unde poate sta balonul."""
        if p["tinta"][0] == "celula":
            return self.grila.dreptunghi(p["tinta"][1]), None
        _, buton, fila = p["tinta"]
        d = self.panglica.dreptunghi(buton)
        if d is None:  # panglica e pe alta fila sau strânsă -> aratam fila
            self.balon.stare.config(text=f"Întâi dă clic pe fila {L.NUME_FILA.get(fila, fila)}.")
            return self.panglica.dreptunghi(fila), self.grila.sus_grila()
        if self.i >= self.max:
            self.balon.stare.config(text="")
        return d, self.grila.sus_grila()

    def tic(self):
        if self.gata_tot:
            self.programeaza()
            return
        try:
            if not win32gui.IsWindow(self.xl.Hwnd):
                self.inchide()
                return
            p = self.pasi[self.i]
            if self.i >= self.max and p["gata"](self.ws, self.xl):
                self.urmatorul()
            else:
                d, sub = self.tinta(p)
                self.chenar.arata(d)
                self.balon.aseaza(d, win32gui.GetWindowRect(self.xl.Hwnd), sub)
        except pywintypes.com_error:
            # Excel refuza apelurile cat timp elevul scrie intr-o celula - e normal
            self.balon.stare.config(text="… scrii în celulă — apasă Enter când ai terminat.")
        except (AttributeError, tk.TclError):
            pass
        self.programeaza()

    def ruleaza(self):
        self.root.mainloop()


def porneste_excel(lectia=None):
    pythoncom.CoInitialize()
    xl = win32com.client.DispatchEx("Excel.Application")  # instanta proprie
    xl.Visible = True
    xl.Workbooks.Add()
    xl.WindowState = -4137  # maximizat
    ws = xl.ActiveSheet
    for a, v in ((lectia or {}).get("pregatire") or {}).items():
        ws.Range(a).Value = v
    ws.Range("A1").Select()
    return xl


# ---------------------------------------------------------------- alegerea lectiei

def alege_lectia(fisiere):
    ales = {}
    r = tk.Tk()
    r.title("Ghid Excel — alege lecția")
    r.configure(bg=GALBEN, padx=18, pady=14)
    tk.Label(r, text="Ce lecție faci azi?", bg=GALBEN, font=("Segoe UI", 14, "bold")).pack(anchor="w", pady=(0, 8))
    for f in fisiere:
        try:
            titlu = L.incarca(f)["titlu"]
        except L.LectieGresita as e:
            titlu = f"{f.stem} (greșită: {e})"
        tk.Button(r, text=titlu, anchor="w", font=("Segoe UI", 12), relief="flat", bg="white", padx=10, pady=4,
                  command=lambda f=f: (ales.setdefault("f", f), r.destroy())).pack(fill="x", pady=2)
    r.mainloop()
    return ales.get("f")


def arata_eroare(text):
    r = tk.Tk()
    r.withdraw()
    from tkinter import messagebox
    messagebox.showerror("Ghid Excel", text)
    r.destroy()


# ---------------------------------------------------------------- --verifica: elevul simulat

def verifica_lectia(cale, dosar_capturi=None):
    """Parcurge lectia cu elevul simulat (actiunile `proba`). Intoarce lista pasilor care NU au avansat singuri."""
    from PIL import ImageGrab
    lectia = L.incarca(cale)
    fara_proba = [k + 1 for k, p in enumerate(lectia["pasi"]) if p["proba"] is None]
    if fara_proba:
        return [f"{Path(cale).name}: pașii {fara_proba} nu au „proba” — nu pot fi verificați"]
    xl = porneste_excel(lectia)
    ghid = Ghid(xl, lectia)
    blocati = []
    vx = ctypes.windll.user32.GetSystemMetrics(76)
    vy = ctypes.windll.user32.GetSystemMetrics(77)

    def captura(nume):
        if not dosar_capturi:
            return
        os.makedirs(dosar_capturi, exist_ok=True)
        x1, y1, x2, y2 = win32gui.GetWindowRect(xl.Hwnd)
        img = ImageGrab.grab(all_screens=True)
        img.crop((x1 - vx, y1 - vy, x2 - vx, y2 - vy)).save(os.path.join(dosar_capturi, f"{Path(cale).stem}_{nume}.png"))

    def pas(k):
        if k >= len(lectia["pasi"]):
            captura("final")
            ghid.root.after(600, final)
            return
        if ghid.i != k:
            blocati.append(f"pasul {k + 1}: ghidul era la {ghid.i + 1}")
        if lectia["pasi"][k]["gata"](xl.ActiveSheet, xl):
            blocati.append(f"pasul {k + 1}: era „gata” ÎNAINTE ca elevul să facă ceva (condiție prea largă)")
        captura(f"{k + 1}")
        lectia["pasi"][k]["proba"](xl.ActiveSheet, xl)
        ghid.root.after(1500, lambda: dupa(k))

    def dupa(k):
        if ghid.i != k + 1 and not (k + 1 == len(lectia["pasi"]) and ghid.gata_tot):
            blocati.append(f"pasul {k + 1} nu a avansat după acțiunea elevului")
        pas(k + 1)

    def final():
        xl.ActiveWorkbook.Saved = True
        xl.Quit()
        ghid.inchide()

    ghid.root.after(2500, lambda: pas(0))
    ghid.ruleaza()
    return [f"{Path(cale).name}: {b}" for b in blocati]


def main():
    ap = argparse.ArgumentParser(description="Ghid peste Excel-ul real")
    ap.add_argument("lectie", nargs="?", help="fișierul .yaml al lecției")
    ap.add_argument("--verifica", action="store_true", help="elev simulat; ultima linie = pași blocați")
    ap.add_argument("--capturi", help="dosar pentru capturi la --verifica")
    a = ap.parse_args()
    dosar_lectii = dosar_program() / "lectii"

    if a.verifica:
        fisiere = [Path(a.lectie)] if a.lectie else L.lectii(dosar_lectii)
        probleme = []
        for f in fisiere:
            try:
                p = verifica_lectia(f, a.capturi)
            except L.LectieGresita as e:
                p = [str(e)]
            print(f"{f.name}: {'OK' if not p else 'PROBLEME'}")
            for x in p:
                print("   " + x)
            probleme += p
        print(len(probleme))
        return 1 if probleme else 0

    cale = Path(a.lectie) if a.lectie else None
    if cale is None:
        fisiere = L.lectii(dosar_lectii)
        if not fisiere:
            arata_eroare(f"Nu am găsit nicio lecție în\n{dosar_lectii}")
            return 1
        cale = fisiere[0] if len(fisiere) == 1 else alege_lectia(fisiere)
        if cale is None:
            return 0
    try:
        lectia = L.incarca(cale)
    except L.LectieGresita as e:
        arata_eroare(str(e))
        return 1
    try:
        xl = porneste_excel(lectia)
    except pywintypes.com_error:
        arata_eroare("Nu pot porni Microsoft Excel pe acest calculator.")
        return 1
    Ghid(xl, lectia).ruleaza()
    return 0


if __name__ == "__main__":
    sys.exit(main())
