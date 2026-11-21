# Proba 2 (foi + registru) in poligonul bibliotecii, headless. Server 127.0.0.1:8762 pornit separat.
import json
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:8762/aplicatii/poligon.html?aplicatie=excel'
out = {}


def st(p):
    return p.evaluate("()=>{const s=LH.aplicatii.stare('excel');return {foi:s.foi,activa:s.foaie_activa,culori:s.culori_file,dialog:s.dialog?JSON.stringify(s.dialog).slice(0,160):null,fisier:s.nume_fisier,titlu:s.titlu_fereastra,reg:s.registru_activ,registre:s.registre,backstage:s.pagina_backstage}}")


def act(p):
    return p.evaluate("()=>(window.__lhAplicatieEv||[]).slice(-1).map(e=>e.gest+'>'+e.actiune+'@'+e.tinta)[0]")


def tab(p, n):
    return p.locator(f'[data-lh-tinta="fila_foii"][data-lh-id="{n}"]').first


def centru(loc):
    b = loc.bounding_box()
    return b['x'] + b['width'] / 2, b['y'] + b['height'] / 2


def meniu_fila(p, n, item):
    x, y = centru(tab(p, n))
    p.mouse.click(x, y, button='right'); p.wait_for_timeout(200)
    if item:
        p.locator(f'[data-lh-suprafata="meniu_contextual.fila_foii"] [data-lh-eticheta="{item}"]').first.click(); p.wait_for_timeout(200)


def ren(p, vechi, nou):
    x, y = centru(tab(p, vechi))
    p.mouse.dblclick(x, y); p.wait_for_timeout(200)
    p.keyboard.press('Control+a')
    if nou:
        p.keyboard.type(nou)
    else:
        p.keyboard.press('Delete')
    p.keyboard.press('Enter'); p.wait_for_timeout(200)


def pas(nume, fn, p):
    try:
        fn()
        out[nume] = {'stare': st(p), 'act': act(p)}
    except Exception as e:
        out[nume] = 'EROARE ' + str(e)[:160]
    try:
        p.keyboard.press('Escape'); p.wait_for_timeout(120)
    except Exception:
        pass


with sync_playwright() as pw:
    br = pw.chromium.launch(headless=True)
    ctx = br.new_context(viewport={'width': 1366, 'height': 768})
    ctx.route('**/*', lambda r: r.continue_() if ('127.0.0.1' in r.request.url or 'localhost' in r.request.url) else r.abort())
    p = ctx.new_page(); p.goto(URL); p.wait_for_timeout(1500)
    plus = p.locator('[data-lh-tinta="fila_foii_buton:Add Sheet"]').first
    pas('plus', lambda: plus.click(), p)
    pas('plus_undo', lambda: p.keyboard.press('Control+z'), p)
    pas('plus_x3', lambda: (plus.click(), plus.click(), plus.click()), p)   # numele dupa anulare (Sheet3 sters -> Sheet4 in vechi)
    pas('ren_apostrof', lambda: ren(p, 'Sheet1', "'Note"), p)
    pas('ren_gol', lambda: ren(p, 'Sheet1', ''), p)
    pas('ren_dublat', lambda: ren(p, 'Sheet1', 'sheet2'), p)
    p.keyboard.press('Escape'); p.wait_for_timeout(150)
    pas('ren_ok', lambda: ren(p, 'Sheet1', 'Septembrie'), p)
    pas('ren_undo', lambda: p.keyboard.press('Control+z'), p)
    nume1 = st(p)['foi'][0]
    pas('culoare', lambda: (meniu_fila(p, nume1, 'Tab Color'), p.locator('[data-lh-suprafata="lista.TabColor"] [data-lh-eticheta="Green"]').first.click(), p.wait_for_timeout(150)), p)
    pas('culoare_undo', lambda: p.keyboard.press('Control+z'), p)
    # mutare prin tragere: prima fila dupa ultima
    def trage():
        foi = st(p)['foi']
        x, y = centru(tab(p, foi[0])); x2, y2 = centru(tab(p, foi[-1]))
        p.mouse.move(x, y); p.mouse.down(); p.mouse.move(x + 20, y, steps=3); p.mouse.move(x2 + 40, y2, steps=8); p.mouse.up(); p.wait_for_timeout(200)
    pas('trage_muta', trage, p)
    pas('trage_undo', lambda: p.keyboard.press('Control+z'), p)
    # Move or Copy cu Create a copy, (move to end)
    def mc():
        foi = st(p)['foi']
        meniu_fila(p, foi[0], 'Move or Copy...')
        p.locator('[data-lh-suprafata="dialog.SheetMoveOrCopy"] [data-lh-eticheta="(move to end)"]').first.click()
        p.locator('[data-lh-suprafata="dialog.SheetMoveOrCopy"] [data-lh-eticheta="Create a copy"]').first.click()
        p.locator('[data-lh-suprafata="dialog.SheetMoveOrCopy"] [data-lh-eticheta="OK"]').first.click(); p.wait_for_timeout(200)
    pas('mutare_copie_dialog', mc, p)
    # stergere foaie cu date (Sheet1 are datele poligonului)
    def sterge():
        foi = st(p)['foi']
        meniu_fila(p, foi[0], 'Delete')
    pas('sterge_cu_date', sterge, p)
    pas('sterge_confirm', lambda: p.locator('[data-lh-eticheta="Delete"][data-lh-tip="Button"]').first.click(), p)
    pas('sterge_undo', lambda: p.keyboard.press('Control+z'), p)
    # Ctrl+PageDown la capat
    def pgd():
        for _ in range(8):
            p.keyboard.press('Control+PageDown'); p.wait_for_timeout(40)
    pas('ctrl_pgdown_x8', pgd, p)
    # salvare
    pas('ctrl_s', lambda: p.keyboard.press('Control+s'), p)
    def scrie_nume():
        inp = p.locator('[data-lh-tinta="camp:nume_fisier"] input').first
        inp.fill('Popescu_Ana_8A_lectia3'); p.keyboard.press('Enter'); p.wait_for_timeout(200)
    pas('ctrl_s_salveaza', scrie_nume, p)
    pas('f12', lambda: p.keyboard.press('F12'), p)
    pas('f12_tip', lambda: p.locator('[data-lh-tinta="camp:tip_fisier"]').first.click(), p)
    pas('f12_cancel', lambda: p.keyboard.press('Escape'), p)
    pas('ctrl_o', lambda: p.keyboard.press('Control+o'), p)
    pas('ctrl_o_browse', lambda: p.locator('[data-lh-suprafata="backstage.Open"] [data-lh-eticheta="Browse"]').first.click(), p)
    # inchidere cu modificari: adaug o foaie, apoi File > Close
    def inchide_mod():
        plus.click(); p.wait_for_timeout(100)
        p.keyboard.press('Control+w'); p.wait_for_timeout(200)
    pas('ctrl_w_modificat', inchide_mod, p)
    pas('dont_save', lambda: p.locator('[data-lh-eticheta="Don\'t Save"]').first.click(), p)
    pas('ctrl_n', lambda: p.keyboard.press('Control+n'), p)
    print(json.dumps(out, ensure_ascii=False, indent=0))
    br.close()
