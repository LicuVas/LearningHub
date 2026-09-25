"""Ghid peste Excel-ul REAL: chenar peste locul unde trebuie sa dea clic elevul + balon cu instructiunea.

Porneste un Excel propriu (nu atinge alte Excel-uri deschise), cu un registru nou, si merge pas cu pas:
- butoanele din panglica le gaseste prin UI Automation, dupa ID-ul Microsoft (TabHome, AutoSum...) -
  acelasi ID in Office romanesc si englezesc;
- celulele le gaseste prin COM (pozitia pe ecran a celulei);
- ce a facut elevul citeste tot prin COM (valori, formule, celula selectata) si trece singur la pasul urmator.

Rulare:  python ghid_excel.py
"""
import ctypes
import re
import sys
import tkinter as tk

ctypes.windll.shcore.SetProcessDpiAwareness(2)  # coordonate in pixeli fizici, ca UI Automation

import pythoncom
import pywintypes
import win32com.client
from pywinauto import Desktop

ROSU = "#e8173c"
GROS = 4          # grosimea chenarului
PAS_MS = 350      # cat de des ne uitam la Excel

GWL_EXSTYLE = -20
WS_EX_NOACTIVATE = 0x08000000
WS_EX_TOOLWINDOW = 0x00000080
WS_EX_TRANSPARENT = 0x00000020
WS_EX_LAYERED = 0x00080000


def fara_focus(win, click_prin=False):
    """Fereastra nu fura focusul de la Excel (optional: clicurile trec prin ea)."""
    win.update_idletasks()
    hwnd = ctypes.windll.user32.GetParent(win.winfo_id())
    st = ctypes.windll.user32.GetWindowLongW(hwnd, GWL_EXSTYLE)
    st |= WS_EX_NOACTIVATE | WS_EX_TOOLWINDOW
    if click_prin:
        st |= WS_EX_TRANSPARENT | WS_EX_LAYERED
    ctypes.windll.user32.SetWindowLongW(hwnd, GWL_EXSTYLE, st)


# ---------------------------------------------------------------- lectia

def numere(ws, adresa):
    vals = ws.Range(adresa).Value
    return [v[0] for v in vals]


def e_nota(v):
    return isinstance(v, (int, float)) and 1 <= v <= 10


PASI = [
    {
        "titlu": "Pasul 1 din 6 · Capul de tabel",
        "text": "Dă clic în celula A1, scrie  Nota  și apasă Enter.",
        "tinta": ("celula", "A1"),
        "gata": lambda ws, xl: isinstance(ws.Range("A1").Value, str) and ws.Range("A1").Value.strip() != "",
    },
    {
        "titlu": "Pasul 2 din 6 · Notele",
        "text": "Scrie 5 note (de la 1 la 10) în celulele A2 … A6.\nDupă fiecare notă apasă Enter — Excel coboară singur.",
        "tinta": ("celula", "A2:A6"),
        "gata": lambda ws, xl: all(e_nota(v) for v in numere(ws, "A2:A6")),
    },
    {
        "titlu": "Pasul 3 din 6 · Unde punem suma",
        "text": "Dă clic în celula A7. Acolo va apărea suma notelor.",
        "tinta": ("celula", "A7"),
        "gata": lambda ws, xl: xl.ActiveCell.Address == "$A$7" or ws.Range("A7").HasFormula,
    },
    {
        "titlu": "Pasul 4 din 6 · Butonul AutoSum",
        "text": "Pe fila Pornire (Home), apasă butonul AutoSum (Σ).\nExcel încercuiește notele — apasă Enter.",
        "tinta": ("buton", "AutoSum", "TabHome"),
        "gata": lambda ws, xl: "SUM(" in str(ws.Range("A7").Formula).upper(),
    },
    {
        "titlu": "Pasul 5 din 6 · Media, scrisă de mână",
        "text": "Dă clic în B7 și scrie formula mediei, apoi Enter:\n"
                "   =AVERAGE(A2:A6)\n"
                "(pe unele calculatoare Excel scrie virgulă sau ; — ambele sunt bune aici)",
        "tinta": ("celula", "B7"),
        "gata": lambda ws, xl: "AVERAGE(" in str(ws.Range("B7").Formula).upper(),
    },
    {
        "titlu": "Pasul 6 din 6 · Îngroșat",
        "text": "Selectează din nou A1 și apasă butonul Aldin (Bold, B) din fila Pornire (Home).",
        "tinta": ("buton", "Bold", "TabHome"),
        "gata": lambda ws, xl: bool(ws.Range("A1").Font.Bold),
    },
]


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
        import win32gui
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
    def __init__(self, root, la_inchidere, la_sari):
        t = tk.Toplevel(root)
        t.overrideredirect(True)
        t.attributes("-topmost", True)
        t.configure(bg=ROSU)
        interior = tk.Frame(t, bg="#fffbe6", padx=14, pady=10)
        interior.pack(padx=2, pady=2)
        self.titlu = tk.Label(interior, bg="#fffbe6", fg="#8a0f24", font=("Segoe UI", 11, "bold"), anchor="w",
                              justify="left")
        self.titlu.pack(fill="x")
        self.text = tk.Label(interior, bg="#fffbe6", fg="#1b1b1b", font=("Segoe UI", 13), anchor="w",
                             justify="left", wraplength=460)
        self.text.pack(fill="x", pady=(4, 6))
        self.stare = tk.Label(interior, bg="#fffbe6", fg="#6b6b6b", font=("Segoe UI", 10, "italic"), anchor="w")
        self.stare.pack(fill="x")
        jos = tk.Frame(interior, bg="#fffbe6")
        jos.pack(fill="x", pady=(6, 0))
        tk.Button(jos, text="Închide ghidul", command=la_inchidere, relief="flat", bg="#eee").pack(side="left")
        self.buton_sari = tk.Button(jos, text="Sari pasul ›", command=la_sari, relief="flat", bg="#eee")
        self.buton_sari.pack(side="right")
        fara_focus(t)
        self.t = t
        self.hwnd = ctypes.windll.user32.GetParent(t.winfo_id())
        self.ultim = None

    def seteaza(self, titlu, text):
        self.titlu.config(text=titlu)
        self.text.config(text=text)
        self.ultim = None

    def aseaza(self, d, ecran_excel):
        """Langa tinta: dedesubt daca e loc in fereastra Excel, altfel deasupra; nu peste tinta."""
        self.t.update_idletasks()
        bw, bh = self.t.winfo_reqwidth(), self.t.winfo_reqheight()
        ex1, ey1, ex2, ey2 = ecran_excel
        if d is None:
            x, y = ex2 - bw - 30, ey2 - bh - 60
        else:
            x1, y1, x2, y2 = d
            x = min(max(x1, ex1 + 10), ex2 - bw - 10)
            y = y2 + 14 if y2 + 14 + bh < ey2 - 10 else y1 - bh - 14
            if x1 < x + bw and x2 > x and y1 < y + bh and y2 > y:  # ar acoperi tinta -> la dreapta ei
                x, y = x2 + 18, y1
        x, y = int(x), int(y)
        self.ultim = (x, y)
        # Tk muta balonul inapoi la pozitia lui interna (0,0) cand se schimba textul (masurat) ->
        # comparam cu locul REAL din Windows si il mutam direct, la fiecare tic
        import win32gui
        if win32gui.GetWindowRect(self.hwnd) != (x, y, x + bw, y + bh):
            # win32gui, nu ctypes: -1 (HWND_TOPMOST) trebuie trimis ca pointer pe 64 de biti
            win32gui.SetWindowPos(self.hwnd, -1, x, y, bw, bh,
                                  0x0010 | 0x0040)  # SWP_NOACTIVATE | SWP_SHOWWINDOW


# ---------------------------------------------------------------- bucla

class Ghid:
    def __init__(self, xl, pasi=PASI, la_final=None):
        import win32gui
        self.win32gui = win32gui
        self.xl = xl
        self.ws = xl.ActiveSheet
        self.pasi = pasi
        self.i = 0
        self.la_final = la_final
        self.root = tk.Tk()
        self.root.withdraw()
        self.panglica = Panglica(xl.Hwnd)
        self.grila = Grila(xl)
        self.chenar = Chenar(self.root)
        self.balon = Balon(self.root, self.inchide, self.sari)
        self.arata_pasul()
        self.root.after(PAS_MS, self.tic)

    def arata_pasul(self):
        p = self.pasi[self.i]
        self.balon.seteaza(p["titlu"], p["text"])
        self.balon.stare.config(text="")

    def sari(self):
        self.urmatorul()

    def urmatorul(self):
        self.i += 1
        if self.i >= len(self.pasi):
            self.chenar.arata(None)
            self.balon.seteaza("Gata! Bravo!", "Ai făcut tabelul cu suma și media — în Excel-ul adevărat.")
            self.balon.buton_sari.pack_forget()
            self.balon.stare.config(text="")
            self.balon.aseaza(None, self.win32gui.GetWindowRect(self.xl.Hwnd))
            if self.la_final:
                self.root.after(1500, self.la_final)
            return
        self.arata_pasul()

    def inchide(self):
        self.root.destroy()

    def tinta(self, p):
        fel = p["tinta"][0]
        if fel == "celula":
            return self.grila.dreptunghi(p["tinta"][1])
        _, buton, fila = p["tinta"]
        d = self.panglica.dreptunghi(buton)
        if d is None:  # panglica e pe alta fila sau strânsă -> aratam fila
            self.balon.stare.config(text="Întâi dă clic pe fila Pornire (Home).")
            return self.panglica.dreptunghi(fila)
        return d

    def tic(self):
        if self.i >= len(self.pasi):
            return
        try:
            if not self.win32gui.IsWindow(self.xl.Hwnd):
                raise pywintypes.com_error
            p = self.pasi[self.i]
            if p["gata"](self.ws, self.xl):
                self.urmatorul()
            else:
                if p["tinta"][0] == "celula":
                    self.balon.stare.config(text="")
                d = self.tinta(p)
                self.chenar.arata(d)
                self.balon.aseaza(d, self.win32gui.GetWindowRect(self.xl.Hwnd))
        except pywintypes.com_error:
            # Excel refuza apelurile cat timp elevul scrie intr-o celula - e normal
            try:
                if not self.win32gui.IsWindow(self.xl.Hwnd):
                    self.root.destroy()
                    return
            except Exception:
                pass
            self.balon.stare.config(text="… scrii în celulă — apasă Enter când ai terminat.")
        except AttributeError:
            pass
        self.root.after(PAS_MS, self.tic)

    def ruleaza(self):
        self.root.mainloop()


def porneste_excel():
    pythoncom.CoInitialize()
    xl = win32com.client.DispatchEx("Excel.Application")  # instanta proprie
    xl.Visible = True
    xl.Workbooks.Add()
    xl.WindowState = -4137  # maximizat
    xl.ActiveSheet.Range("A1").Select()
    return xl


if __name__ == "__main__":
    xl = porneste_excel()
    Ghid(xl).ruleaza()
    sys.exit(0)
