# B_proba_explorer.py — partea B a inventarului de paritate explorer-windows (21.11.2026).
# Joacă în poligonul bibliotecii (headless) gesturile pe care codul nu le lămurește. Server local pornit separat:
#   python -m http.server 9151 --bind 127.0.0.1 --directory C:/00/Projects/LearningHub_fidel
import json, sys
from playwright.sync_api import sync_playwright

URL = 'http://127.0.0.1:9151/aplicatii/poligon.html'
CONT = {'folder': 'Ex', 'arbore': ['Romana/', 'Romana/Toamna/', 'Romana/Toamna/compunere toamna.docx', 'b.txt', 'c.txt']}
rez = {}

def deschide(pg):
    pg.goto(URL)
    pg.wait_for_function('window.LH && LH.aplicatii')
    pg.evaluate('c => LH.aplicatii.deschide("explorer", {continut: c, focus: true})', CONT)
    pg.wait_for_selector('.lh-ap-e-rand')

def stare(pg):
    return pg.evaluate('LH.aplicatii.stare("explorer")')

def rand(pg, nume):
    return pg.locator('.lh-ap-e-rand[data-lh-id="%s"]' % nume)

def mesaj(pg):
    return pg.evaluate('(document.querySelector("[data-lh-nesimulat]")||{}).textContent||""')

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={'width': 1400, 'height': 900})
    ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(('http://127.0.0.1', 'http://localhost')) else r.abort())
    pg = ctx.new_page()

    # T1 căutarea: din Ex (fișierul e în Romana/Toamna) și din Documente
    deschide(pg)
    pg.fill('.lh-ap-e-caut-in', 'compunere'); pg.wait_for_timeout(200)
    rez['T1_cautare_din_Ex_randuri'] = pg.locator('.lh-ap-e-rand').count()
    pg.fill('.lh-ap-e-caut-in', 'b'); pg.wait_for_timeout(200)
    rez['T1b_cautare_b_randuri'] = [pg.locator('.lh-ap-e-rand').nth(i).get_attribute('data-lh-id') for i in range(pg.locator('.lh-ap-e-rand').count())]

    # T2 Shift+F10 pe elementul selectat
    deschide(pg)
    rand(pg, 'b.txt').click(); pg.keyboard.press('Shift+F10'); pg.wait_for_timeout(150)
    rez['T2_shiftF10_meniu'] = pg.locator('.lh-ap-e-meniu').count()
    pg.keyboard.press('Escape')

    # T3 Decupare folder Romana, Lipire în Romana/Toamna (subfolderul lui)
    deschide(pg)
    rand(pg, 'Romana').click(); pg.keyboard.press('Control+x')
    rand(pg, 'Romana').dblclick(); pg.wait_for_timeout(100)
    rand(pg, 'Toamna').dblclick(); pg.wait_for_timeout(100)
    pg.keyboard.press('Control+v'); pg.wait_for_timeout(150)
    rez['T3_dialog'] = stare(pg).get('dialog')
    rez['T3_cale'] = stare(pg).get('cale_curenta')
    rez['T3_chei'] = pg.evaluate('LH.aplicatii.stare("explorer").nume_fisiere')
    rez['T3_mesaj'] = mesaj(pg)

    # T4 casetele de selectare: clic pe rândul b, apoi clic pe caseta lui c
    deschide(pg)
    pg.locator('[data-lh-id="Vizualizați"]').click(); pg.wait_for_timeout(100)
    pg.locator('.lh-ap-e-mr[data-lh-id="Afișați"]').click(); pg.wait_for_timeout(100)
    pg.locator('.lh-ap-e-mr[data-lh-id="Casete de selectare element"]').click(); pg.wait_for_timeout(100)
    rand(pg, 'b.txt').click()
    rand(pg, 'c.txt').locator('[data-e-nume] > span').first.click(); pg.wait_for_timeout(100)
    rez['T4_selectie_dupa_caseta'] = stare(pg)['selectie']
    rez['T7_bara_stare'] = pg.locator('.lh-ap-e-nr').inner_text()
    rand(pg, 'b.txt').click(modifiers=['Control']); pg.wait_for_timeout(100)
    rez['T7b_selectie_ctrl'] = stare(pg)['selectie']
    rez['T7b_bara_stare'] = pg.locator('.lh-ap-e-nr').inner_text()

    # T5 Copiere b, apoi redenumire b -> d, apoi Lipire în Romana
    deschide(pg)
    rand(pg, 'b.txt').click(); pg.keyboard.press('Control+c'); pg.keyboard.press('F2')
    pg.keyboard.press('Control+a'); pg.keyboard.type('d'); pg.keyboard.press('Enter'); pg.wait_for_timeout(100)
    rand(pg, 'Romana').dblclick(); pg.wait_for_timeout(100)
    pg.keyboard.press('Control+v'); pg.wait_for_timeout(150)
    rez['T5_dupa_lipire_in_Romana'] = [pg.locator('.lh-ap-e-rand').nth(i).get_attribute('data-lh-id') for i in range(pg.locator('.lh-ap-e-rand').count())]
    rez['T5_dialog'] = stare(pg).get('dialog'); rez['T5_mesaj'] = mesaj(pg)

    # T6 Coșul: Delete pe b, dublu-clic pe Coș, Delete pe elementul din Coș
    deschide(pg)
    rand(pg, 'b.txt').click(); pg.keyboard.press('Delete'); pg.wait_for_timeout(100)
    pg.locator('.lh-ap-e-desk-ic').dblclick(); pg.wait_for_timeout(150)
    rez['T6_cale'] = stare(pg)['cale_curenta']
    rez['T6_bara_comenzi'] = [x.get_attribute('data-lh-id') for x in pg.locator('.lh-ap-e-cb').all()]
    pg.locator('.lh-ap-e-rand').first.click(); pg.keyboard.press('Delete'); pg.wait_for_timeout(100)
    rez['T6_mesaj_delete_in_cos'] = mesaj(pg)
    pg.locator('.lh-ap-e-rand').first.click(button='right'); pg.wait_for_timeout(100)
    rez['T6_meniu_cos'] = [x.get_attribute('data-lh-id') for x in pg.locator('.lh-ap-e-mr').all()]

    # T8 Shift+Delete pe un folder
    deschide(pg)
    rand(pg, 'Romana').click(); pg.keyboard.press('Shift+Delete'); pg.wait_for_timeout(100)
    rez['T8_shiftdel_folder_mesaj'] = mesaj(pg); rez['T8_dialog'] = stare(pg).get('dialog')

    # T9 Sus din Documente
    deschide(pg)
    pg.locator('.lh-ap-e-nb[data-lh-id="sus"]').click(); pg.wait_for_timeout(100)
    rez['T9_dupa_sus'] = stare(pg)['cale_curenta']
    pg.locator('.lh-ap-e-nb[data-lh-id="sus"]').click(); pg.wait_for_timeout(100)
    rez['T9_sus_din_Documente'] = [stare(pg)['cale_curenta'], mesaj(pg)]
    b.close()

json.dump(rez, sys.stdout, ensure_ascii=False, indent=1)
print('\nGATA')
