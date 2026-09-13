"""Playwright headless: (1) raspuns GRESIT la quiz - ce feedback vede copilul; (2) ce pune butonul Copiaza in clipboard;
(3) sub ce cheie se salveaza raspunsul la exercitiu (calculator folosit de doua clase)."""
import json
import pathlib
from playwright.sync_api import sync_playwright

LESSON = pathlib.Path(r"C:\00\Projects\LearningHub\content\tic\cls8\m1-excel-fundamente\lectia3-formule.html").as_uri()
OUT = pathlib.Path(r"C:\00\Projects\LearningHub\_campaign\omul_la_calculator_2026_09_13\P_hibrid\lectia3-formule\test")

res = {}
with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 1366, "height": 768}, permissions=["clipboard-read", "clipboard-write"])
    pg = ctx.new_page()
    pg.goto(LESSON)
    pg.wait_for_timeout(1500)

    # (2) clipboard
    btn = pg.locator(".copy-btn").first
    btn.click()
    pg.wait_for_timeout(500)
    try:
        clip = pg.evaluate("navigator.clipboard.readText()")
    except Exception as e:  # file:// poate refuza
        clip = "EROARE:" + str(e)
    res["clipboard_repr"] = repr(clip)[:300]
    res["clipboard_are_tab"] = "\t" in clip

    # (1) quiz atom 1: alegem un raspuns gresit (+)
    atom1 = pg.locator("#atom-1")
    opts = atom1.locator(".atom-option")
    res["atom1_optiuni"] = [opts.nth(i).inner_text() for i in range(opts.count())]
    for i in range(opts.count()):
        if "plus" in opts.nth(i).inner_text():
            opts.nth(i).click()
            break
    pg.wait_for_timeout(800)
    res["atom1_text_vizibil_dupa_gresit"] = atom1.inner_text()[-600:]
    pg.screenshot(path=str(OUT / "quiz_gresit.png"), full_page=False)
    atom1.screenshot(path=str(OUT / "quiz_gresit_atom.png"))

    # (3) salvare raspuns exercitiu
    res["salvare_js"] = pg.evaluate("""() => {
        const ta = document.querySelector('textarea');
        ta.value = 'raspunsul elevului din clasa 8A';
        ta.dispatchEvent(new Event('input', {bubbles: true}));
        const btns = [...document.querySelectorAll('button')].filter(b => b.textContent.includes('Salveaza'));
        if (btns[0]) btns[0].click();
        return btns.length;
    }""")
    pg.wait_for_timeout(600)
    res["localStorage_chei"] = pg.evaluate("Object.keys(localStorage)")
    # alt elev, aceeasi masina: pagina redeschisa
    pg2 = ctx.new_page()
    pg2.goto(LESSON)
    pg2.wait_for_timeout(1500)
    res["textarea_la_redeschidere"] = pg2.evaluate("document.querySelector('textarea').value")
    res["localStorage_valori"] = pg2.evaluate("Object.fromEntries(Object.keys(localStorage).map(k => [k, localStorage.getItem(k).slice(0, 200)]))")
    b.close()

(OUT / "pw_rezultat.json").write_text(json.dumps(res, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(res, ensure_ascii=False, indent=1))
