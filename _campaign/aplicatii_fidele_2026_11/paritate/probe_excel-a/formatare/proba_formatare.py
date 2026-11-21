# Proba excel-a / formatare: joacă în poligonul bibliotecii (headless) comenzile de formatare ale vechiului
# lectii/_sim/excelx-formatare.js și scrie ce s-a întâmplat (starea, meniul/fereastra deschisă, mesajul „nesimulat”).
import json, subprocess, sys, time, socket
from pathlib import Path
from playwright.sync_api import sync_playwright

RAD = r'C:/00/Projects/LearningHub_fidel'
PORT = 8761
OUT = Path(__file__).with_name('rezultat_proba.json')

def liber(p):
    s = socket.socket(); r = s.connect_ex(('127.0.0.1', p)); s.close(); return r != 0

srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1', '--directory', RAD],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for _ in range(50):
    if not liber(PORT): break
    time.sleep(0.1)

CELULE = {'A1': 'Titlu lung al tabelului', 'C1': 'x', 'A2': 'Elev', 'B2': 7.125, 'C2': 0.125, 'A3': 'Ana', 'B3': 1234567, 'C3': 0.5}
rez = {}
try:
    with sync_playwright() as pw:
        br = pw.chromium.launch(headless=True)
        ctx = br.new_context(viewport={'width': 1700, 'height': 950})
        ctx.route('**/*', lambda r: r.continue_() if r.request.url.startswith(('http://127.0.0.1', 'http://localhost')) else r.abort())
        pg = ctx.new_page()
        pg.goto(f'http://127.0.0.1:{PORT}/aplicatii/poligon.html', wait_until='load')

        def deschide():
            pg.evaluate("""async (c)=>{try{LH.aplicatii.inchide('excel')}catch(e){};
              window.__i = await LH.aplicatii.deschide('excel',{continut:{celule:c,selectie:'A1'},focus:true});}""", CELULE)
            pg.wait_for_timeout(300)

        def stare():
            return pg.evaluate("()=>{const s=window.__i.stare();return {fmt:s.format_celule,cel:Object.fromEntries(Object.entries(s.celule).map(([k,v])=>[k,v.text])),dialog:s.dialog,mesaj:s.fereastra_mesaj,latimi:s.latimi_coloane,inaltimi:s.inaltimi_randuri,sel:s.selectie}}")

        def vizibil():
            # meniuri / ferestre / mesaje deschise după gest
            return pg.evaluate("""()=>{const r=document.querySelector('[data-lh-aplicatie]');const o=[];
              r.querySelectorAll('.lh-ap-x-meniu,[role=menu],[role=dialog],[data-lh-suprafata^="dialog"],[data-lh-suprafata^="lista"]').forEach(x=>{if(x.offsetParent!==null)o.push((x.getAttribute('data-lh-suprafata')||x.className)+' :: '+(x.textContent||'').trim().slice(0,160))});
              const t=[...document.querySelectorAll('body *')].filter(x=>/nesimulat|nu e simulat|nu e încă|nu are|nu e în/i.test(x.textContent||'')&&x.children.length===0&&x.offsetParent!==null).map(x=>x.textContent.trim().slice(0,160));
              return {deschise:o,mesaje:t.slice(0,3)}}""")

        def cel(a):
            return pg.locator(f'[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="{a}"]').first

        def zona(a, b):
            cel(a).click(); cel(b).click(modifiers=['Shift']); pg.wait_for_timeout(80)

        def buton(idm, sageata=False):
            loc = pg.locator(f'[data-lh-aplicatie] [data-lh-id-mso="{idm}"]')
            n = loc.count()
            if n == 0:
                return f'lipsește {idm} din panglică'
            el = loc.first
            el.scroll_into_view_if_needed()
            bb = el.bounding_box()
            if not bb:
                return f'{idm} nu se vede'
            x = bb['x'] + (bb['width'] - 4 if sageata else bb['width'] / 2)
            pg.mouse.click(x, bb['y'] + bb['height'] / 2)
            pg.wait_for_timeout(200)
            return 'ok'

        def proba(nume, a, b, idm, sageata=False):
            deschide(); zona(a, b)
            r = {'clic': buton(idm, sageata)}
            r.update(vizibil()); r['stare'] = stare()
            rez[nume] = r
            pg.keyboard.press('Escape')

        proba('merge_doua_valori', 'A1', 'C1', 'MergeCenter')
        proba('merge_sageata', 'A1', 'C1', 'MergeCenter', True)
        proba('merge_o_celula', 'A1', 'A1', 'MergeCenter')
        proba('fill_buton', 'A2', 'C2', 'CellFillColorPicker')
        proba('fill_sageata', 'A2', 'C2', 'CellFillColorPicker', True)
        proba('fontcolor_buton', 'A2', 'C2', 'FontColorPicker')
        proba('fontcolor_sageata', 'A2', 'C2', 'FontColorPicker', True)
        proba('borders_buton', 'A2', 'C3', 'BorderBottomNoToggle')
        proba('borders_sageata', 'A2', 'C3', 'BordersGallery_Dropdown')
        # All Borders din lista deschisă
        deschide(); zona('A2', 'C3'); buton('BordersGallery_Dropdown')
        it = pg.locator('[data-lh-aplicatie] [data-lh-eticheta="All Borders"]')
        rez['borders_all'] = {'gasit': it.count()}
        if it.count():
            it.first.click(); pg.wait_for_timeout(200)
        rez['borders_all']['stare'] = stare()
        proba('fontsize', 'A1', 'A1', 'FontSize')
        proba('fontsize_inc', 'A1', 'A1', 'FontSizeIncrease')
        proba('align_middle', 'A1', 'A1', 'AlignMiddleExcel')
        proba('align_top', 'A1', 'A1', 'AlignTopExcel')
        proba('align_center_x2', 'A1', 'A1', 'AlignCenter')
        proba('numberformat', 'B2', 'B2', 'NumberFormatGallery')
        proba('accounting', 'B2', 'B2', 'InternationalCurrency')
        proba('comma', 'B2', 'B2', 'CommaStyle')
        proba('dec_inc', 'B2', 'B2', 'DecimalsIncrease')
        proba('dec_dec', 'B2', 'B2', 'DecimalsDecrease')
        proba('percent', 'C2', 'C3', 'PercentStyle')
        proba('cellstyles', 'A1', 'A1', 'CellStylesGallery')
        proba('format_menu', 'A1', 'A1', 'FormatCellsMenu')
        proba('clear_menu', 'A1', 'A1', 'ClearMenu')
        proba('wrap', 'A1', 'A1', 'WrapText')
        # Ctrl+1 și Ctrl+Shift+% de la tastatură
        deschide(); zona('C2', 'C3'); pg.keyboard.press('Control+Shift+Digit5'); pg.wait_for_timeout(150)
        rez['ctrl_shift_5'] = {'stare': stare(), **vizibil()}
        deschide(); zona('A1', 'A1'); pg.keyboard.press('Control+1'); pg.wait_for_timeout(150)
        rez['ctrl_1'] = {**vizibil(), 'dialog': stare()['dialog']}
        # bara de formule sub procent
        deschide(); zona('C2', 'C2'); buton('PercentStyle'); cel('C3').click(); cel('C2').click(); pg.wait_for_timeout(100)
        rez['bara_formule_procent'] = pg.evaluate("()=>{const r=document.querySelector('[data-lh-aplicatie]');const i=r.querySelector('[data-lh-tinta=\"bara_formule\"] input, [data-lh-tinta=\"bara_formule\"], .lh-ap-x-fx');return i?(i.value||i.textContent||'').trim().slice(0,40):'?'}")
        # marginea antetului de rând: există ținta de tragere?
        rez['margine_rand'] = pg.evaluate("()=>document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta^=\"antet_rand_margine\"]').length")
        rez['margine_coloana'] = pg.evaluate("()=>document.querySelectorAll('[data-lh-aplicatie] [data-lh-tinta^=\"antet_coloana_margine\"]').length")
        # tastarea unei date într-o coloană îngustă: se lățește singură?
        deschide(); cel('E5').click(); pg.keyboard.type('27.09.2026'); pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
        s = stare(); rez['data_tastata_E5'] = {'text': s['cel'].get('E5'), 'latimi': s['latimi']}
        deschide(); cel('E5').click(); pg.keyboard.type('123456789012'); pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
        s = stare(); rez['numar_mare_E5'] = {'text': s['cel'].get('E5'), 'latimi': s['latimi']}
        # Ctrl+Z după Bold
        deschide(); zona('A1', 'A1'); pg.keyboard.press('Control+b'); pg.wait_for_timeout(80); b1 = stare()['fmt'].get('A1')
        pg.keyboard.press('Control+z'); pg.wait_for_timeout(80); rez['bold_undo'] = {'dupa_b': b1, 'dupa_z': stare()['fmt'].get('A1')}
        # clic dreapta pe antetul de rând: Row Height... -> OK
        deschide(); hdr = pg.locator('[data-lh-aplicatie] [data-lh-tinta="antet_rand"][data-lh-id="2"]')
        rez['antet_rand_gasit'] = hdr.count()
        if hdr.count():
            hdr.first.click(button='right'); pg.wait_for_timeout(150)
            it = pg.locator('[data-lh-aplicatie] [data-lh-eticheta="Row Height..."]')
            rez['row_height_item'] = it.count()
            if it.count():
                it.first.click(); pg.wait_for_timeout(150)
                rez['row_height_dialog'] = stare()['dialog']
                ok = pg.locator('[data-lh-aplicatie] [data-lh-eticheta="OK"]')
                if ok.count(): ok.first.click(); pg.wait_for_timeout(150)
                rez['row_height_dupa_ok'] = {**vizibil(), 'inaltimi': stare()['inaltimi']}
        br.close()
finally:
    srv.terminate()
OUT.write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding='utf-8')
print('scris', OUT)
