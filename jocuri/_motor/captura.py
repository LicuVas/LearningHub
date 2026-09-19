"""Capturi din aplicația reală pentru lecțiile-joc (README §6b).

    python jocuri/_motor/captura.py lista                                   # ferestrele vizibile (titlu + dimensiune)
    python jocuri/_motor/captura.py fereastra "Excel" --out jocuri/excel-viii/img/panglica.webp --ce "Panglica Excel, fila Home"
          [--regiune x,y,l,h]   # decupaj în pixeli, RELATIV la colțul ferestrei (după maximizare)
          [--latime 1000]       # lățimea maximă a imaginii finale (implicit 1000)
          [--nu-maximiza]       # implicit fereastra se aduce în față și se maximizează
          [--asteapta 1.2]      # secunde de așteptare după aducerea în față
    python jocuri/_motor/captura.py ecran --regiune x,y,l,h --out ... --ce "..."   # regiune absolută de pe ecran

Fiecare captură se trece în <folderul imaginii>/SURSE.json (fișier, aplicație, fereastră, dată, regiune, ce arată).
Oracolul `ilustratii.py` numără imaginile fără rând în SURSE.json.
Pixelii sunt FIZICI (procesul e DPI-aware), la fel ca în uneltele de coordonate ale sistemului.
"""
import argparse
import ctypes
import json
import sys
import time
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageGrab

try:
    ctypes.windll.shcore.SetProcessDpiAwareness(2)
except Exception:
    ctypes.windll.user32.SetProcessDPIAware()

import win32con
import win32gui
import win32process

try:
    import psutil
except ImportError:  # proveniența merge și fără numele procesului
    psutil = None


def ferestre():
    out = []

    def cb(h, _):
        if win32gui.IsWindowVisible(h) and win32gui.GetWindowText(h).strip():
            l, t, r, b = win32gui.GetWindowRect(h)
            if r - l > 80 and b - t > 60:
                out.append((h, win32gui.GetWindowText(h), (l, t, r, b)))
        return True

    win32gui.EnumWindows(cb, None)
    return out


def proces(h):
    if not psutil:
        return ""
    try:
        return psutil.Process(win32process.GetWindowThreadProcessId(h)[1]).name()
    except Exception:
        return ""


def in_fata(h, maximizeaza, asteapta):
    win32gui.ShowWindow(h, win32con.SW_MAXIMIZE if maximizeaza else win32con.SW_RESTORE)
    try:
        # SetForegroundWindow refuză dacă procesul nostru nu are focusul; o apăsare de Alt deblochează regula
        ctypes.windll.user32.keybd_event(0x12, 0, 0, 0)
        win32gui.SetForegroundWindow(h)
        ctypes.windll.user32.keybd_event(0x12, 0, 2, 0)
    except Exception as e:
        print(f"avertisment: n-am putut aduce fereastra în față ({e}); captura poate conține altceva", file=sys.stderr)
    time.sleep(asteapta)
    if win32gui.GetForegroundWindow() != h:
        print("avertisment: fereastra NU e în față — verifică imaginea înainte s-o folosești", file=sys.stderr)


def salveaza(img, out, latime, rand):
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    if img.width > latime:
        img = img.resize((latime, round(img.height * latime / img.width)), Image.Resampling.LANCZOS)
    img = img.convert("RGB")
    fmt = "WEBP" if out.suffix.lower() == ".webp" else "PNG"
    img.save(out, fmt, quality=86, method=6) if fmt == "WEBP" else img.save(out, fmt, optimize=True)
    surse = out.parent / "SURSE.json"
    date = json.loads(surse.read_text(encoding="utf-8")) if surse.exists() else []
    date = [d for d in date if d.get("fisier") != out.name]
    date.append(dict(rand, fisier=out.name, latime=img.width, inaltime=img.height, kb=round(out.stat().st_size / 1024, 1),
                     data=datetime.now().strftime("%Y-%m-%d %H:%M")))
    surse.write_text(json.dumps(sorted(date, key=lambda d: d["fisier"]), ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{out}  {img.width}x{img.height}  {out.stat().st_size // 1024} KB")


def regiune(s):
    x, y, l, h = (int(v) for v in s.split(","))
    return x, y, l, h


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mod", choices=["lista", "fereastra", "ecran"])
    ap.add_argument("titlu", nargs="?")
    ap.add_argument("--out")
    ap.add_argument("--ce", default="")
    ap.add_argument("--regiune", type=regiune)
    ap.add_argument("--latime", type=int, default=1000)
    ap.add_argument("--nu-maximiza", action="store_true")
    ap.add_argument("--asteapta", type=float, default=1.2)
    a = ap.parse_args()

    if a.mod == "lista":
        for h, t, (l, tp, r, b) in ferestre():
            print(f"{r - l}x{b - tp}\t{proces(h)}\t{t}")
        return
    if not a.out or not a.ce:
        sys.exit("lipsesc --out și/sau --ce (ce arată imaginea, pentru SURSE.json)")

    if a.mod == "ecran":
        if not a.regiune:
            sys.exit("modul ecran cere --regiune x,y,l,h")
        x, y, l, h = a.regiune
        img = ImageGrab.grab(bbox=(x, y, x + l, y + h), all_screens=True)
        salveaza(img, a.out, a.latime, {"aplicatie": "", "fereastra": "(ecran)", "regiune": [x, y, l, h], "ce": a.ce})
        return

    gasite = [f for f in ferestre() if a.titlu and a.titlu.lower() in f[1].lower()]
    if not gasite:
        sys.exit(f"nicio fereastră vizibilă cu „{a.titlu}” în titlu — rulează `lista`")
    h, titlu, _ = gasite[0]
    in_fata(h, not a.nu_maximiza, a.asteapta)
    l, t, r, b = win32gui.GetWindowRect(h)
    if ctypes.windll.user32.IsZoomed(h):  # o fereastră maximizată iese cu ~8px în afara ecranului pe fiecare latură
        l, t, r, b = l + 8, t + 8, r - 8, b - 8
    if a.regiune:
        x, y, w, hh = a.regiune
        box = (l + x, t + y, min(l + x + w, r), min(t + y + hh, b))
    else:
        box = (l, t, r, b)
    img = ImageGrab.grab(bbox=box, all_screens=True)
    salveaza(img, a.out, a.latime, {"aplicatie": proces(h), "fereastra": titlu, "regiune": list(a.regiune or []), "ce": a.ce})


if __name__ == "__main__":
    main()
