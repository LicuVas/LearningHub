# -*- coding: utf-8 -*-
"""R6 (contract.md): capturi ÎNAINTE (codul din git HEAD, servit în locul fișierului de pe disc) și DUPĂ (disc) pentru
fiecare fișier comun atins de bucla din 10-11.11.2026, pe o lecție care îl folosește, laptop 1366x657 și Pixel 7.
Rețeaua externă e abandonată (regula 24). Ieșire: capturi_inainte_dupa/<fisier>_<ecran>.png = stânga ÎNAINTE, dreapta DUPĂ.
La explorer-*: și meniul de clic dreapta deschis lângă marginea dreaptă a ferestrei (unde se tăia „Ștergere”)."""
import subprocess
import tempfile
from pathlib import Path
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright

R = Path(r"C:\00\Projects\LearningHub")
AICI = Path(__file__).parent
OUT = AICI / "capturi_inainte_dupa"
OUT.mkdir(exist_ok=True)
# fișier atins -> (lecție, cum se deschide exercițiul, clic dreapta?)
CAZURI = {
    "jocuri/_motor/ui-panglica.js": ("vi/m2-l10", "JocMotor.test.pas(2);JocMotor.test.exercitiu(0)", False),
    "lectii/_sim/simppt.js": ("vi/m2-l10", "JocMotor.test.pas(2);JocMotor.test.exercitiu(0)", False),
    "lectii/_sim/simppt-formatare.js": ("vi/m2-l10", "JocMotor.test.atelier();JocMotor.test.exercitiu(0)", False),
    "lectii/_sim/wordobj-pagina.js": ("vii/m1-l07", "JocMotor.test.atelier();JocMotor.test.exercitiu(0)", False),
    "lectii/_sim/wordobj-interfata.js": ("vii/m1-l02", "JocMotor.test.pas(1);JocMotor.test.exercitiu(0)", False),
    "lectii/_sim/excelx-sortare.js": ("viii/m2-l12", "JocMotor.test.atelier();JocMotor.test.exercitiu(0)", False),
    "lectii/_sim/explorer-operatii.js": ("v/m2-l10", "JocMotor.test.pas(5);JocMotor.test.exercitiu(0)", True),
    "lectii/_sim/explorer-organizare.js": ("v/m2-l11", "JocMotor.test.atelier();JocMotor.test.exercitiu(0)", True),
    "lectii/_sim/fotografie.js": ("v/m1-l02", "JocMotor.test.pas(2);JocMotor.test.exercitiu(0)", False),
}
tmp = Path(tempfile.mkdtemp(prefix="cap_head_"))
HEAD = {}
for f in CAZURI:
    dst = tmp / Path(f).name
    dst.write_bytes(subprocess.run(["git", "-C", str(R), "show", f"HEAD:{f}"], capture_output=True).stdout)
    HEAD[Path(f).name] = dst


def ruta_pt(inainte):
    def ruta(r):
        u = r.request.url
        if inainte:
            for nume, cale in HEAD.items():
                if u.split("?")[0].endswith("/" + nume):
                    return r.fulfill(path=str(cale), content_type="application/javascript")
        return r.continue_() if u.startswith(("file:", "data:", "blob:")) or "127.0.0.1" in u or "localhost" in u else r.abort()
    return ruta


def captura(p, b, lec, cum, ctxmeniu, ecran, inainte):
    a = dict(p.devices["Pixel 7"]) if ecran == "telefon" else {"viewport": {"width": 1366, "height": 657}}
    ctx = b.new_context(**a)
    ctx.route("**/*", ruta_pt(inainte))
    pg = ctx.new_page()
    pg.goto((R / "lectii" / lec / "index.html").as_uri())
    pg.wait_for_timeout(600)
    for bid in ("#lhp-viz", "#lhp-x"):
        if pg.locator(bid).count() and pg.locator(bid).first.is_visible():
            pg.locator(bid).first.click()
    pg.evaluate("JocMotor.test.deblocheaza()")
    pg.click('.lvl[data-l="0"]')
    for s in cum.split(";"):
        pg.evaluate(s)
        pg.wait_for_timeout(150)
    pg.wait_for_timeout(300)
    el = pg.locator("#body").first
    if ctxmeniu:   # clic dreapta în fereastra Explorer, la 90% din lățime și 60% din înălțime
        w = pg.locator("#body .exo").first if pg.locator("#body .exo").count() else el
        w.scroll_into_view_if_needed()
        bb = w.bounding_box()
        pg.mouse.click(bb["x"] + bb["width"] * 0.9, bb["y"] + bb["height"] * 0.6, button="right")
        pg.wait_for_timeout(300)
    el.scroll_into_view_if_needed()
    png = tmp / f"{lec.replace('/', '_')}_{ecran}_{'i' if inainte else 'd'}.png"
    el.screenshot(path=str(png))
    ctx.close()
    return png


def alaturi(st, dr, dest):
    A, B = Image.open(st), Image.open(dr)
    h = max(A.height, B.height)
    C = Image.new("RGB", (A.width + B.width + 30, h + 28), "white")
    C.paste(A, (0, 28))
    C.paste(B, (A.width + 30, 28))
    d = ImageDraw.Draw(C)
    d.text((6, 6), "INAINTE (git HEAD)", fill="black")
    d.text((A.width + 36, 6), "DUPA (reparat)", fill="black")
    C.save(dest)


import sys as _s
DOAR = _s.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch()
    for f, (lec, cum, cm) in CAZURI.items():
        if DOAR and not any(x in f for x in DOAR):
            continue
        for ecran in ("laptop", "telefon"):
            try:
                i = captura(p, b, lec, cum, cm, ecran, True)
                d = captura(p, b, lec, cum, cm, ecran, False)
                dest = OUT / f"{Path(f).stem}_{ecran}.png"
                alaturi(i, d, dest)
                print("ok", dest.name)
            except Exception as e:
                print("EROARE", f, ecran, str(e).splitlines()[0][:150])
    b.close()
