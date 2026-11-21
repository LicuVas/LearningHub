# Proba headless a operatiilor cu foi/registru in biblioteca (poligon excel). Server pe 127.0.0.1:8762, pornit separat.
import json, sys
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:8762/aplicatii/poligon.html?aplicatie=excel'
out = {}


def st(p):
    return p.evaluate("()=>{const s=LH.aplicatii.stare('excel');return {foi:s.foi,activa:s.foaie_activa,culori:s.culori_file,dialog:s.dialog||null,mesaj:s.fereastra_mesaj||null,fisier:s.nume_fisier,reg:s.registru_activ,registre:s.registre,backstage:s.pagina_backstage}}")


def ev(p):
    return p.evaluate("()=>(window.__lhAplicatieEv||[]).slice(-2).map(e=>JSON.stringify(e).slice(0,200))")


def tab(p, n):
    return p.locator(f'[data-lh-tinta="fila_foii"][data-lh-id="{n}"]').first


def meniu_fila(p, n, item):
    b = tab(p, n).bounding_box()
    p.mouse.click(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2, button='right')
    p.wait_for_timeout(200)
    items = p.evaluate("()=>[...document.querySelectorAll('[data-lh-suprafata=\"meniu_contextual.fila_foii\"] [data-lh-eticheta]')].map(x=>x.getAttribute('data-lh-eticheta'))")
    if item:
        p.locator(f'[data-lh-suprafata="meniu_contextual.fila_foii"] [data-lh-eticheta="{item}"]').first.click()
        p.wait_for_timeout(200)
    return items


def ren(p, vechi, nou):
    b = tab(p, vechi).bounding_box()
    p.mouse.dblclick(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2)
    p.wait_for_timeout(200)
    p.keyboard.press('Control+a')
    if nou:
        p.keyboard.type(nou)
    else:
        p.keyboard.press('Delete')
    p.keyboard.press('Enter')
    p.wait_for_timeout(200)


with sync_playwright() as pw:
    br = pw.chromium.launch(headless=True)
    ctx = br.new_context(viewport={'width': 1366, 'height': 768})
    ctx.route('**/*', lambda r: r.continue_() if ('127.0.0.1' in r.request.url or 'localhost' in r.request.url) else r.abort())
    p = ctx.new_page()
    p.goto(URL)
    p.wait_for_timeout(1500)
    out['start'] = st(p)
    out['tabs_dom'] = p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta^=\"fila_foii\"]')].map(x=>x.getAttribute('data-lh-tinta')+'|'+x.getAttribute('data-lh-id')+'|'+x.getAttribute('data-lh-eticheta'))")
    plus = p.locator('[data-lh-tinta="fila_foii_buton:Add Sheet"]').first
    plus.click(); p.wait_for_timeout(200); out['plus'] = st(p)['foi']
    p.keyboard.press('Control+z'); p.wait_for_timeout(200); out['plus_undo'] = st(p)['foi']
    plus.click(); plus.click(); p.wait_for_timeout(200); out['plus2'] = st(p)['foi']
    out['meniu_items'] = meniu_fila(p, 'Sheet1', None)
    p.keyboard.press('Escape'); p.wait_for_timeout(100)
    for it in ['Hide', 'Unhide...', 'Insert...', 'Select All Sheets', 'View Code', 'Protect Sheet...']:
        try:
            meniu_fila(p, 'Sheet1', it)
            out['meniu_' + it] = {'foi': st(p)['foi'], 'dialog': st(p)['dialog'], 'ev': ev(p)}
        except Exception as e:
            out['meniu_' + it] = 'EROARE ' + str(e)[:120]
        p.keyboard.press('Escape'); p.wait_for_timeout(150)
    tab(p, 'Sheet1').click(); p.wait_for_timeout(100)
    p.keyboard.press('Shift+F11'); p.wait_for_timeout(200)
    out['shift_f11'] = {'foi': st(p)['foi'], 'ev': ev(p)}
    for nume in ['Ore/2', 'History', "'Note", '']:
        ren(p, 'Sheet1', nume)
        out['ren_' + (nume or 'gol')] = {'foi': st(p)['foi'], 'dialog': st(p)['dialog'], 'ev': ev(p)}
        p.keyboard.press('Escape'); p.wait_for_timeout(150)
        if 'Sheet1' not in json.dumps(st(p)['foi'], ensure_ascii=False):
            break
    nume1 = 'Sheet1' if 'Sheet1' in json.dumps(st(p)['foi'], ensure_ascii=False) else None
    if nume1:
        ren(p, 'Sheet1', 'Septembrie'); out['ren_ok'] = st(p)['foi']
        p.keyboard.press('Control+z'); p.wait_for_timeout(200); out['ren_undo'] = st(p)['foi']
    print(json.dumps(out, ensure_ascii=False, indent=0)[:7000])
    br.close()
