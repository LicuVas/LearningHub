"""Proba ghidului: un 'elev' simulat prin COM (fara mouse) parcurge lectia; la fiecare pas facem o captura
a ferestrei Excel ca sa VEDEM chenarul si balonul. Ultima linie = nr. de pasi care NU au avansat singuri.

python proba_ghid.py [dosar_capturi]
"""
import ctypes
import os
import sys

import ghid_excel as g
from PIL import ImageGrab
import win32gui

DOSAR = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), "capturi")
os.makedirs(DOSAR, exist_ok=True)

xl = g.porneste_excel()
ws = xl.ActiveSheet
ghid = g.Ghid(xl)
root = ghid.root

# ce face 'elevul' la fiecare pas (dupa ce i-am fotografiat instructiunea)
def a1(): ws.Range("A1").Value = "Nota"
def a2(): ws.Range("A2:A6").Value = [[9], [7], [10], [8], [6]]
def a3(): ws.Range("A7").Select()
def a4(): ws.Range("A7").Formula = "=SUM(A2:A6)"
def a5(): ws.Range("B7").Formula = "=AVERAGE(A2:A6)"
def a6(): ws.Range("A1").Font.Bold = True
ACTIUNI = [a1, a2, a3, a4, a5, a6]

vx = ctypes.windll.user32.GetSystemMetrics(76)
vy = ctypes.windll.user32.GetSystemMetrics(77)
blocati = []


def captura(nume):
    x1, y1, x2, y2 = win32gui.GetWindowRect(xl.Hwnd)
    img = ImageGrab.grab(all_screens=True)
    img.crop((x1 - vx, y1 - vy, x2 - vx, y2 - vy)).save(os.path.join(DOSAR, nume))


def pas(k):
    if k >= len(ACTIUNI):
        captura("7_final.png")
        root.after(800, final)
        return
    if ghid.i != k:
        blocati.append(f"pasul {k + 1}: ghidul era la {ghid.i + 1}")
    captura(f"{k + 1}_inainte.png")
    ACTIUNI[k]()
    root.after(1500, lambda: verifica(k))


def verifica(k):
    if ghid.i != k + 1:
        blocati.append(f"pasul {k + 1} nu a avansat (ghidul e la {ghid.i + 1})")
    pas(k + 1)


def final():
    print("\n".join(blocati) or "toti pasii au avansat singuri")
    wb = xl.ActiveWorkbook
    wb.Saved = True
    xl.Quit()
    root.destroy()


root.after(2500, lambda: pas(0))
ghid.la_final = None
ghid.ruleaza()
print(len(blocati))
