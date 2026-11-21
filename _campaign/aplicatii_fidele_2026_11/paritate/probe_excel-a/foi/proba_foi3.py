# Proba 3: salvarea (Save this file / Save As), stergerea unei foi cu date, Don't Save. Headless, server 127.0.0.1:8762.
import json
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:8762/aplicatii/poligon.html?aplicatie=excel'
out = {}


def st(p):
    return p.evaluate("()=>{const s=LH.aplicatii.stare('excel');return {foi:s.foi,activa:s.foaie_activa,dialog:s.dialog?JSON.stringify(s.dialog).slice(0,200):null,fisier:s.nume_fisier,titlu:s.titlu_fereastra,reg:s.registru_activ,registre:s.registre,bs:s.pagina_backstage,mesaj:s.fereastra_mesaj?JSON.stringify(s.fereastra_mesaj).slice(0,160):null}}")


def act(p):
    return p.evaluate("()=>(window.__lhAplicatieEv||[]).slice(-1).map(e=>e.gest+'>'+e.actiune+'@'+e.tinta)[0]")


def tinte(p):
    return p.evaluate("()=>[...document.querySelectorAll('.lh-ap-strat-dialog [data-lh-tinta], .lh-ap-strat-backstage [data-lh-tinta]')].map(x=>x.getAttribute('data-lh-tinta')).filter((v,i,a)=>a.indexOf(v)===i).slice(0,60)")


def pas(nume, fn, p):
    try:
        r = fn()
        out[nume] = {'stare': st(p), 'act': act(p), 'r': r}
    except Exception as e:
        out[nume] = 'EROARE ' + str(e)[:160]


with sync_playwright() as pw:
    br = pw.chromium.launch(headless=True)
    ctx = br.new_context(viewport={'width': 1366, 'height': 768})
    ctx.route('**/*', lambda r: r.continue_() if ('127.0.0.1' in r.request.url or 'localhost' in r.request.url) else r.abort())
    p = ctx.new_page(); p.goto(URL); p.wait_for_timeout(1500)
    pas('ctrl_s', lambda: (p.keyboard.press('Control+s'), p.wait_for_timeout(200), tinte(p))[2], p)
    def salveaza():
        inp = p.locator('.lh-ap-strat-dialog input').first
        inp.fill('Popescu_Ana_8A_lectia3'); p.keyboard.press('Enter'); p.wait_for_timeout(200)
    pas('ctrl_s_save', salveaza, p)
    pas('ctrl_s_iar', lambda: (p.keyboard.press('Control+s'), p.wait_for_timeout(200))[1], p)
    pas('f12', lambda: (p.keyboard.press('F12'), p.wait_for_timeout(200), tinte(p))[2], p)
    pas('f12_tip', lambda: (p.locator('.lh-ap-strat-dialog [data-lh-tinta="camp:tip_fisier"]').first.click(timeout=3000), p.wait_for_timeout(200))[1], p)
    p.keyboard.press('Escape'); p.wait_for_timeout(150); p.keyboard.press('Escape'); p.wait_for_timeout(150)
    pas('ctrl_o', lambda: (p.keyboard.press('Control+o'), p.wait_for_timeout(200), tinte(p))[2], p)
    p.keyboard.press('Escape'); p.wait_for_timeout(150)
    # stergerea foii cu date (Sheet1 = datele poligonului), cand exista 2 foi
    def sterge():
        p.locator('[data-lh-tinta="fila_foii_buton:Add Sheet"]').first.click(); p.wait_for_timeout(150)
        t = p.locator('[data-lh-tinta="fila_foii"][data-lh-id="Sheet1"]').first; b = t.bounding_box()
        p.mouse.click(b['x'] + b['width'] / 2, b['y'] + b['height'] / 2, button='right'); p.wait_for_timeout(200)
        p.locator('[data-lh-suprafata="meniu_contextual.fila_foii"] [data-lh-eticheta="Delete"]').first.click(); p.wait_for_timeout(200)
        return tinte(p)
    pas('sterge_cu_date', sterge, p)
    pas('sterge_ok', lambda: (p.keyboard.press('Enter'), p.wait_for_timeout(200))[1], p)
    pas('sterge_undo', lambda: (p.keyboard.press('Control+z'), p.wait_for_timeout(200))[1], p)
    def inchide():
        p.locator('[data-lh-tinta="fila_foii_buton:Add Sheet"]').first.click(); p.wait_for_timeout(150)
        p.keyboard.press('Control+w'); p.wait_for_timeout(200)
        return tinte(p)
    pas('ctrl_w', inchide, p)
    pas('dont_save', lambda: (p.locator('.lh-ap-strat-dialog [data-lh-eticheta="Don\'t Save"]').first.click(timeout=3000), p.wait_for_timeout(200))[1], p)
    pas('ctrl_o_gol', lambda: (p.keyboard.press('Control+o'), p.wait_for_timeout(200), tinte(p))[2], p)
    print(json.dumps(out, ensure_ascii=False, indent=0))
    br.close()
