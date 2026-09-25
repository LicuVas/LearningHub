"""Oracol independent pentru pozitia celulelor: selectam celula prin COM, Excel isi deseneaza chenarul verde
de selectie, il gasim in captura de ecran si il comparam cu ce calculeaza ghidul (Grila, din antetele UIA).
Scenarii: zoom 100/150/75, foaie derulata. Ultima linie = nr. de nepotriviri (> 4 pixeli).

Istoric: prima varianta calcula din COM (PointsToScreenPixels) - corecta nederulat, gresita cu 30-40 px
cand foaia e derulata. De aceea ghidul citeste antetele prin UI Automation.
"""
import ctypes
import time
import ghid_excel as g
from PIL import ImageGrab
import win32gui

xl = g.porneste_excel()
time.sleep(2)
w = xl.ActiveWindow
ws = xl.ActiveSheet
grila = g.Grila(xl)
vx = ctypes.windll.user32.GetSystemMetrics(76)
vy = ctypes.windll.user32.GetSystemMetrics(77)
gresite = 0


def chenar_verde(zona):
    """Cutia pixelilor de culoarea selectiei Excel (#107C41 aprox.) din zona grilei."""
    x1, y1, x2, y2 = zona
    img = ImageGrab.grab(all_screens=True).crop((x1 - vx, y1 - vy, x2 - vx, y2 - vy)).convert("RGB")
    px = img.load()
    xs, ys = [], []
    for y in range(img.height):
        for x in range(img.width):
            r, gg, b = px[x, y]
            if r < 60 and 100 < gg < 150 and 40 < b < 90:
                xs.append(x)
                ys.append(y)
    if not xs:
        return None
    return min(xs) + x1, min(ys) + y1, max(xs) + x1, max(ys) + y1


SCENARII = [(100, 1, 1, ["A1", "C5", "F12"]), (150, 1, 1, ["B3", "D8"]), (100, 10, 3, ["E15", "D10"]),
            (75, 20, 5, ["H30", "G25"])]
for zoom, rand, col, celule in SCENARII:
    w.Zoom = zoom
    w.ScrollRow, w.ScrollColumn = rand, col
    for c in celule:
        ws.Range(c).Select()
        time.sleep(0.6)
        d = grila.dreptunghi(c)
        # zona grilei = de sub antetul de coloane, la dreapta antetului de randuri
        prima_col = grila.antete[ws.Cells(1, col).GetAddress(False, False).rstrip("0123456789")]
        primul_rand = grila.antete[str(rand)]
        wx1, wy1, wx2, wy2 = win32gui.GetWindowRect(xl.Hwnd)
        zona = (prima_col[0], primul_rand[1], wx2 - 40, wy2 - 80)
        v = chenar_verde(zona)
        if d is None or v is None:
            print(f"zoom {zoom} scroll {rand},{col} {c}: lipsa ghid={d} verde={v}")
            gresite += 1
            continue
        abatere = max(abs(a - b) for a, b in zip(d, v))
        ok = abatere <= 4
        gresite += not ok
        print(f"zoom {zoom} scroll {rand},{col} {c}: ghid {d} verde {v} abatere {abatere}px {'OK' if ok else 'GRESIT'}")

xl.ActiveWorkbook.Saved = True
xl.Quit()
print(gresite)
