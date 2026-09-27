"""proba_corectura_tastatura.py — atelierul „Corectează ca în Word” (word-vii N2) rezolvat CA ELEVUL (27.09.2026).

Cursorul pus imediat după litera în plus, Backspace, apoi Verifică → trebuie „Corect”. Și invers: elevul care ar
scrie firesc forma articulată nu mai trebuie respins (bug-ul raportat: „muzeu” vs „muzeul”).
Ultima linie: numărul de verificări picate.
"""
import sys
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass
RAD = Path(__file__).resolve().parents[1]
url = (RAD / "jocuri" / "word-vii" / "index.html").as_uri()
picate = 0


def nota(ok, t):
    global picate
    print(("  ok   " if ok else "  PICAT ") + t)
    picate += 0 if ok else 1


from playwright.sync_api import sync_playwright  # noqa: E402
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={"width": 1280, "height": 900})
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(url)
    pg.evaluate("localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
    pg.reload()
    pg.evaluate("JocMotor.test.deblocheaza()"); pg.evaluate("document.getElementById('go-home').click()")
    pg.click('.lvl[data-l="1"]')
    pg.evaluate("JocMotor.test.atelier()")
    ta = pg.locator("#body textarea, #body [contenteditable=true]").first
    nota(ta.count() == 1, "caseta de corectat e pe pagină")
    text = ta.input_value() if ta.evaluate("e=>e.tagName") == "TEXTAREA" else ta.inner_text()
    nota("muzeull" in text and "mergemm" in text, f"textul de start: {text!r}")
    for cuv in ("muzeull", "mergemm"):         # de la dreapta la stânga, ca pozițiile să nu se mute
        text = ta.input_value()
        poz = text.index(cuv) + len(cuv)
        ta.evaluate("(e,p)=>{e.focus();e.setSelectionRange(p,p)}", poz)
        pg.keyboard.press("Backspace")
    nota(ta.input_value() == "Mâine mergem la muzeul de istorie.", f"după două Backspace: {ta.input_value()!r}")
    pg.locator("#chk").click()
    fb = pg.locator("#fb").inner_text()
    nota("Corect" in fb or "Bravo" in fb or pg.locator("#fb .fb.ok").count() == 1, f"Verifică: {fb[:80]!r}")
    nota(not errs, f"fără erori JS {errs[:2]}")
    b.close()
print("----")
print(picate)
