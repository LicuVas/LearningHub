# Simuleaza doi elevi pe acelasi calculator: elevul A scrie la Ex1 si salveaza; elevul B deschide lectia in acelasi browser.
# Plus: raspuns gresit la intrebarea 1 -> se deblocheaza pasul 2?
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = Path(r"C:\00\Projects\LearningHub\content\tic\cls7\m1-word-fundamente\lectia5-tabele.html").as_uri()
PROF = Path(r"C:\Users\licuv\AppData\Local\Temp\claude\C--00-AI-0\d1ddcc30-0251-43d9-a426-7c5c0b2e2d92\scratchpad\pwprof")
res = {}
with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(str(PROF), headless=True)
    pg = ctx.new_page()
    pg.goto(URL); pg.wait_for_timeout(1500)
    ta = pg.locator('textarea').first
    res['textarea_count'] = pg.locator('textarea').count()
    res['textarea_vizibil_la_deschidere'] = ta.is_visible()
    pg.evaluate("""() => { const t = document.querySelector('textarea'); t.value = 'Elevul A din VII A: am facut tabelul 6x8';
        t.dispatchEvent(new Event('input', {bubbles:true}));
        const b = [...document.querySelectorAll('button')].find(x => x.textContent.includes('Salveaza raspunsul')); b.click(); }""")
    pg.wait_for_timeout(500)
    res['localStorage_keys_dupa_A'] = pg.evaluate('Object.keys(localStorage)')
    # raspuns gresit la q1
    q = pg.locator('#atom-1 .atom-question')
    corect = q.get_attribute('data-correct')
    gresit = [o for o in ['a', 'b', 'c'] if o != corect][0]
    pg.locator(f'#atom-1 .atom-option[data-answer="{gresit}"]').first.click(); pg.wait_for_timeout(800)
    res['q1_corect'] = corect; res['q1_ales'] = gresit
    res['feedback'] = pg.locator('#atom-1 .atom-feedback').first.inner_text()
    res['atom2_class_dupa_gresit'] = pg.locator('#atom-2').get_attribute('class')
    ctx.close()
    ctx = p.chromium.launch_persistent_context(str(PROF), headless=True)
    pg = ctx.new_page(); pg.goto(URL); pg.wait_for_timeout(1500)
    res["elev_B_vede_in_textarea"] = pg.evaluate("() => document.querySelector('textarea').value")
    res['elev_B_atom1_class'] = pg.locator('#atom-1').get_attribute('class')
    ctx.close()
print(json.dumps(res, ensure_ascii=False, indent=1))
