# Proba partii A (explorer-windows): cateva comportamente ale bibliotecii jucate headless in poligon.
# Server local pornit separat pe 127.0.0.1:<port>; orice cerere care nu e localhost e abandonata.
import json, sys
from playwright.sync_api import sync_playwright

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8947
BAZA = f'http://127.0.0.1:{PORT}/aplicatii/poligon.html'
rez = {}

def ruta(route):
    u = route.request.url
    if u.startswith('http://127.0.0.1') or u.startswith('http://localhost') or u.startswith('data:') or u.startswith('blob:'):
        return route.continue_()
    return route.abort()

def stare(pg, app):
    return pg.evaluate(f"LH.aplicatii.stare('{app}')")

def mesaj(pg):
    return pg.evaluate("(()=>{const m=document.querySelector('[data-lh-nesimulat]:not([data-lh-tip])');return m?m.textContent:null})()")

with sync_playwright() as p:
    br = p.chromium.launch(headless=True)
    ctx = br.new_context(viewport={'width': 1400, 'height': 900})
    ctx.route('**/*', ruta)
    pg = ctx.new_page()

    # ---------- Explorer, continutul implicit al poligonului
    pg.goto(BAZA + '?aplicatie=explorer'); pg.wait_for_timeout(1200)
    rez['ex_stare0'] = stare(pg, 'explorer')
    pg.click('.lh-ap-e-lista'); pg.keyboard.press('Control+l'); pg.wait_for_timeout(200)
    rez['ex_ctrl_l_valoare'] = pg.evaluate("(document.querySelector('.lh-ap-e-adr-in')||{}).value||null")
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    pg.click('.lh-ap-e-lista'); pg.keyboard.press('Alt+d'); pg.wait_for_timeout(200)
    rez['ex_alt_d_caseta'] = pg.evaluate("!!document.querySelector('.lh-ap-e-adr-in')")
    pg.keyboard.press('Escape')
    # cautarea: plan.txt sta in Proiect/ (un nivel mai jos)
    pg.click('.lh-ap-e-caut-in'); pg.keyboard.type('plan'); pg.wait_for_timeout(300)
    rez['ex_cautare_plan_ordine'] = stare(pg, 'explorer')['ordine_afisata']
    rez['ex_cautare_plan_randuri'] = pg.evaluate("[...document.querySelectorAll('.lh-ap-e-rand')].map(r=>r.getAttribute('data-lh-id'))")
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    # Acest PC din panoul de navigare
    pg.click('[data-lh-tinta="arbore"][data-lh-id="Acest PC"]'); pg.wait_for_timeout(200)
    rez['ex_acest_pc_mesaj'] = mesaj(pg)
    # tipurile din coloana Tip si data/dimensiunea
    rez['ex_coloane'] = pg.evaluate("[...document.querySelectorAll('.lh-ap-e-rand')].map(r=>[r.getAttribute('data-lh-id'),r.querySelector('.lh-ap-e-c1').textContent,r.querySelector('.lh-ap-e-c2').textContent,r.querySelector('.lh-ap-e-c3').textContent])")
    # sus din folderul de lucru, apoi sus din Documente
    pg.click('[data-lh-tinta="nav"][data-lh-id="sus"]'); pg.wait_for_timeout(150)
    rez['ex_sus1'] = stare(pg, 'explorer')['cale_curenta']
    pg.click('[data-lh-tinta="nav"][data-lh-id="sus"]'); pg.wait_for_timeout(150)
    rez['ex_sus2'] = stare(pg, 'explorer')['cale_curenta']; rez['ex_sus2_mesaj'] = mesaj(pg)

    # ---------- Explorer cu un stick: parinte E:, folder Scoala
    pg.evaluate("LH.aplicatii.inchide && LH.aplicatii.inchide('explorer')")
    pg.evaluate("""LH.aplicatii.deschide('explorer',{loc:document.body,focus:true,continut:{parinte:'E:',folder:'Scoala',
        arbore:['Muzica/colind.mp3','TIC/afis.png','TIC/afis.docx','TIC/film.mp4']}})""")
    pg.wait_for_timeout(1000)
    rez['stick_stare0'] = stare(pg, 'explorer')
    rez['stick_arbore'] = pg.evaluate("[...document.querySelectorAll('[data-lh-tinta=\"arbore\"]')].map(n=>[n.getAttribute('data-lh-id'),n.getAttribute('data-e-cale')])")
    pg.dblclick('[data-lh-tinta="lista"][data-lh-id="TIC"]'); pg.wait_for_timeout(300)
    rez['stick_tic_cale'] = stare(pg, 'explorer')['cale_curenta']
    rez['stick_tic_randuri'] = pg.evaluate("[...document.querySelectorAll('.lh-ap-e-rand')].map(r=>[r.getAttribute('data-lh-id'),r.querySelector('[data-e-nume]').textContent,r.querySelector('.lh-ap-e-c2').textContent])")
    rez['stick_firimituri'] = pg.evaluate("[...document.querySelectorAll('.lh-ap-e-cr')].map(b=>b.textContent)")
    pg.click('.lh-ap-e-adr-edit', position={'x': 600, 'y': 10}); pg.wait_for_timeout(200)
    rez['stick_adresa_clic_gol'] = pg.evaluate("(document.querySelector('.lh-ap-e-adr-in')||{}).value||null")
    pg.keyboard.press('Escape')
    rez['stick_stare_tic'] = stare(pg, 'explorer')

    # ---------- Windows
    pg.goto(BAZA + '?aplicatie=windows'); pg.wait_for_timeout(1200)
    rez['win_stare0'] = stare(pg, 'windows')
    pg.click('[data-lh-tinta="bara_activitati"][data-lh-id="Start"]'); pg.wait_for_timeout(300)
    rez['win_start_deschis'] = stare(pg, 'windows')['meniu_start_deschis']
    seta = pg.query_selector('[data-lh-tinta="start"][data-lh-id="Setări"]')
    if seta:
        seta.click(); pg.wait_for_timeout(200)
        rez['win_setari_mesaj'] = mesaj(pg); rez['win_setari_ferestre'] = stare(pg, 'windows')['ferestre']
    else:
        rez['win_setari_mesaj'] = 'nu am gasit dala Setări'
    if not stare(pg, 'windows')['meniu_start_deschis']:
        pg.click('[data-lh-tinta="bara_activitati"][data-lh-id="Start"]'); pg.wait_for_timeout(300)
    pg.keyboard.type('pai'); pg.wait_for_timeout(200); pg.keyboard.press('Enter'); pg.wait_for_timeout(400)
    rez['win_paint_ferestre'] = stare(pg, 'windows')['ferestre']
    pg.click('[data-lh-tinta="bara_activitati"][data-lh-id="Start"]'); pg.wait_for_timeout(300)
    pg.keyboard.type('notepad'); pg.wait_for_timeout(200); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
    rez['win_notepad_mesaj'] = mesaj(pg); rez['win_notepad_ferestre'] = [f['aplicatie'] for f in stare(pg, 'windows')['ferestre']]
    if stare(pg, 'windows')['meniu_start_deschis']:
        pg.keyboard.press('Escape')
    fp = '.lh-w-fer[data-lh-id="paint"]'
    pg.click(fp + ' [data-lh-id="Maximizare"]'); pg.wait_for_timeout(200)
    rez['win_paint_max'] = [f['stare'] for f in stare(pg, 'windows')['ferestre'] if f['aplicatie'] == 'paint']
    pg.click(fp + ' [data-lh-id="Minimizare"]'); pg.wait_for_timeout(200)
    rez['win_paint_min'] = [f['stare'] for f in stare(pg, 'windows')['ferestre'] if f['aplicatie'] == 'paint']
    b = pg.query_selector('.lh-w-b[data-lh-app="paint"]')
    if b:
        b.click(); pg.wait_for_timeout(200)
    rez['win_paint_dupa_bara'] = [(f['stare'], f['activa']) for f in stare(pg, 'windows')['ferestre'] if f['aplicatie'] == 'paint']
    pg.click(fp + ' [data-lh-id="Închidere"]'); pg.wait_for_timeout(200)
    rez['win_paint_inchis'] = [f['aplicatie'] for f in stare(pg, 'windows')['ferestre']]
    # clic pe desktopul gol cu Start deschis
    pg.click('[data-lh-tinta="bara_activitati"][data-lh-id="Start"]'); pg.wait_for_timeout(200)
    pg.mouse.click(30, 600); pg.wait_for_timeout(200)
    rez['win_start_dupa_clic_desktop'] = stare(pg, 'windows')['meniu_start_deschis']
    # Cosul de pe desktop: dublu clic
    pg.dblclick('.lh-w-ico[data-lh-id="Coș de reciclare"]'); pg.wait_for_timeout(200)
    rez['win_cos_dublu_mesaj'] = mesaj(pg)
    br.close()

print(json.dumps(rez, ensure_ascii=False, indent=1))
