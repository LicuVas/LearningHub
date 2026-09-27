"""proba_panglica_word_ppt.py — panglicile reale Word și PowerPoint, folosite CA ELEVUL (27.09.2026).

Word (word-vii, primul nivel cu simulatorul „editor”): panglica reală e pe pagină (file = cele din date, Home activă);
un cuvânt atins + Bold de pe panglică => cuvântul e aldin și butonul apare apăsat; Center => paragraful centrat;
fila Insert și înapoi Home păstrează lucrul; Format Painter spune pe ecran că nu-l folosim.
PowerPoint (prezentari-vi, primul nivel cu simulatorul „ppt”): panglica reală e pe pagină, fila Transitions arată
galeria cu tranzițiile reale (None, Morph, Fade…), iar Fade are mânerul simulatorului (data-t="tr-fade").
Pe PC și pe telefon: pagina nu e mai lată decât ecranul; fără erori JS. Capturi în _tests/_capturi/.
Ultima linie: numărul de verificări picate.
"""
import json
import sys
from pathlib import Path

for s in (sys.stdout, sys.stderr):
    try:
        s.reconfigure(encoding="utf-8")
    except Exception:
        pass
RAD = Path(__file__).resolve().parents[1]
J = RAD / "jocuri"
CAPT = RAD / "_tests" / "_capturi"
CAPT.mkdir(exist_ok=True)
picate = 0


def nota(ok, t):
    global picate
    print(("  ok   " if ok else "  PICAT ") + t)
    picate += 0 if ok else 1


def date(app):
    return json.loads((J / "_motor" / f"panglica-{app}.json").read_text(encoding="utf-8"))


def nivel_cu(pg, tip):
    """indexul primului nivel cu un atelier/exercițiu de tipul dat și calea spre el"""
    # la „editor” vrem unul cu formatarea fontului (unelte implicite = font + aliniere); cel cu doar clipboard n-are Bold legat
    return pg.evaluate("""t=>{const ok=e=>e&&e.t===t&&(t!=='editor'||!e.unelte||e.unelte.includes('font'));
      const C=JocMotor.test.config();for(let i=0;i<C.nivele.length;i++){const L=C.nivele[i];
      if(ok(L.atelier))return {li:i,unde:'atelier'};
      for(let s=0;s<(L.pasi||[]).length;s++){const P=L.pasi[s];const ex=[P.incearca,...(P.inca||[])];
        const k=ex.findIndex(ok);if(k>=0)return {li:i,unde:'pas',si:s,k}}}return null}""", tip)


def deschide(pg, slug, tip):
    pg.goto((J / slug / "index.html").as_uri())
    pg.evaluate("localStorage.setItem('lh_prezenta',JSON.stringify({refuz:Date.now()}))")
    pg.reload()
    pg.evaluate("JocMotor.test.deblocheaza()"); pg.evaluate("document.getElementById('go-home').click()")
    loc = nivel_cu(pg, tip)
    pg.click(f'.lvl[data-l="{loc["li"]}"]')
    if loc["unde"] == "atelier":
        pg.evaluate("JocMotor.test.atelier()")
    else:
        pg.evaluate(f"JocMotor.test.pas({loc['si']})")
        if loc["k"]:
            pg.evaluate(f"JocMotor.test.exercitiu({loc['k']})")
    return loc


from playwright.sync_api import sync_playwright  # noqa: E402
with sync_playwright() as p:
    b = p.chromium.launch()
    for disp, opt in (("pc", {"viewport": {"width": 1280, "height": 900}}), ("telefon", p.devices["Pixel 7"])):
        print(f"== Word · {disp} ==")
        ctx = b.new_context(**opt)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        loc = deschide(pg, "word-vii", "editor")
        rb = pg.locator(".wd-tb .rb.pg")
        nota(rb.count() == 1, f"panglica reală Word e în editor (nivelul {loc['li'] + 1}, {loc['unde']})")
        if rb.count():
            nota(rb.locator(".tabs [data-tab]").all_inner_texts() == [f["eticheta"] for f in date("word")["file"]], "filele Word din date")
            ed = pg.locator(".wd-ed").first
            bold = ed.locator('.rb.pg [data-c="b"]')
            nota(bold.count() == 1, "Bold de pe panglică are mânerul simulatorului")
            if bold.count():
                ed.locator(".wd-w").first.click()
                bold.click()
                nota(ed.locator(".wd-w").first.evaluate("e=>getComputedStyle(e).fontWeight>=600||!!e.querySelector('b,strong')"),
                     "cuvântul atins a devenit aldin")
                nota("act" in (ed.locator('.rb.pg [data-c="b"]').get_attribute("class") or ""), "Bold apare apăsat pe panglică")
            cen = ed.locator('.rb.pg [data-a="center"]')
            if cen.count():
                ed.locator(".wd-w").first.click()
                cen.click()
                nota(ed.locator(".wd-doc p, .wd-doc .wd-p").first.evaluate("e=>getComputedStyle(e).textAlign") == "center",
                     "Center: paragraful e centrat")
            ed.locator('.rb.pg [data-tab="TabInsert"]').click()
            nota(ed.locator('.rb.pg .tabs [data-tab="TabInsert"].on').count() == 1, "fila Insert se deschide")
            ed.locator('.rb.pg [data-tab="TabHome"]').click()
            fp = ed.locator('.rb.pg [aria-label="Format Painter"]')
            if fp.count():
                fp.click()
                nota("nu-l folosim" in ed.locator(".rb.pg .pg-nota").inner_text(), "Format Painter spune că nu-l folosim")
            w = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
            nota(w[0] <= w[1] + 1, f"pagina nu e mai lată decât ecranul ({w[0]} ≤ {w[1]})")
            ed.screenshot(path=str(CAPT / f"panglica_word_{disp}.png"))
        nota(not errs, f"fără erori JS {errs[:2]}")
        ctx.close()

        print(f"== PowerPoint · {disp} ==")
        ctx = b.new_context(**opt)
        pg = ctx.new_page()
        errs = []
        pg.on("pageerror", lambda e: errs.append(str(e)))
        loc = deschide(pg, "prezentari-vi", "ppt")
        rb = pg.locator(".pp .rb.pg")
        nota(rb.count() == 1, f"panglica reală PowerPoint e în simulator (nivelul {loc['li'] + 1}, {loc['unde']})")
        if rb.count():
            pg.locator('.pp .rb.pg [data-t="tab-transitions"]').click()
            dale = pg.locator(".pp .rb.pg .pg-dala").all_inner_texts()
            nota(all(x in " ".join(dale) for x in ("None", "Morph", "Fade", "Push", "Wipe")), f"galeria de tranziții reale: {dale[:6]}")
            nota(pg.locator('.pp .rb.pg [data-t="tr-fade"]').count() == 1, "Fade are mânerul simulatorului (tr-fade)")
            w = pg.evaluate("[document.documentElement.scrollWidth, innerWidth]")
            nota(w[0] <= w[1] + 1, f"pagina nu e mai lată decât ecranul ({w[0]} ≤ {w[1]})")
            pg.locator(".pp").first.screenshot(path=str(CAPT / f"panglica_ppt_{disp}.png"))
        nota(not errs, f"fără erori JS {errs[:2]}")
        ctx.close()
    b.close()
print("----")
print(picate)
