# Proba 2 excel-a / formatare: Ctrl+B / Ctrl+Z, bara de formule sub procent, potrivirea cu mai multe coloane selectate.
import json, subprocess, sys, time, socket
from pathlib import Path
from playwright.sync_api import sync_playwright

RAD = r'C:/00/Projects/LearningHub_fidel'
PORT = 8761
OUT = Path(__file__).with_name('rezultat_proba2.json')
srv = subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT), '--bind', '127.0.0.1', '--directory', RAD],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for _ in range(50):
    s = socket.socket(); r = s.connect_ex(('127.0.0.1', PORT)); s.close()
    if r == 0: break
    time.sleep(0.1)
CELULE = {'A1': 'Titlu', 'A2': 'Elev', 'B2': 7.125, 'C2': 0.125, 'A3': 'Ana Maria Popescu', 'B3': 'Bogdan Ionescu Lung', 'C3': 0.5}
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
        st = lambda: pg.evaluate("()=>window.__i.stare()")
        cel = lambda a: pg.locator(f'[data-lh-aplicatie] [data-lh-tinta="celula"][data-lh-id="{a}"]').first
        deschide(); cel('A1').click(); pg.keyboard.down('Control'); pg.keyboard.press('KeyB'); pg.keyboard.up('Control'); pg.wait_for_timeout(120)
        b = st()['format_celule'].get('A1')
        pg.keyboard.down('Control'); pg.keyboard.press('KeyZ'); pg.keyboard.up('Control'); pg.wait_for_timeout(120)
        rez['ctrl_b_apoi_ctrl_z'] = {'dupa_b': b, 'dupa_z': st()['format_celule'].get('A1')}
        deschide(); cel('C2').click(); pg.locator('[data-lh-aplicatie] [data-lh-id-mso="PercentStyle"]').first.click(); pg.wait_for_timeout(100)
        cel('C3').click(); cel('C2').click(); pg.wait_for_timeout(100)
        rez['bara_formule_C2_procent'] = pg.evaluate("()=>{const b=document.querySelector('[data-lh-aplicatie] [data-lh-tinta=\"bara_formule\"]');return b?b.textContent.trim():null}")
        rez['C2_afisat'] = st()['celule']['C2']['text']
        # coloanele A:C selectate (clic pe A, Shift+clic pe C), apoi dublu-clic pe marginea lui A
        deschide()
        ha = pg.locator('[data-lh-aplicatie] [data-lh-tinta="antet_coloana"][data-lh-id="A"]').first
        hc = pg.locator('[data-lh-aplicatie] [data-lh-tinta="antet_coloana"][data-lh-id="C"]').first
        rez['antet_gasit'] = [ha.count(), hc.count()]
        ha.click(); hc.click(modifiers=['Shift']); pg.wait_for_timeout(100)
        rez['selectie_coloane'] = st()['selectie']
        mg = pg.locator('[data-lh-aplicatie] [data-lh-tinta="antet_coloana_margine"][data-lh-id="A"]').first
        bb = mg.bounding_box(); rez['margine_A'] = bb
        if bb:
            pg.mouse.dblclick(bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2); pg.wait_for_timeout(150)
        rez['latimi_dupa_dublu_clic_A'] = st()['latimi_coloane']
        br.close()
finally:
    srv.terminate()
OUT.write_text(json.dumps(rez, ensure_ascii=False, indent=1), encoding='utf-8')
print(json.dumps(rez, ensure_ascii=False))
