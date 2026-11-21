"""Proba excel-b: câteva comportamente ale bibliotecii pe care codul nu le lămurește singur (headless, doar 127.0.0.1).
Rulare: python proba_b.py <port>  (serverul îl pornește cine rulează: python -m http.server <port> --bind 127.0.0.1 --directory C:/00/Projects/LearningHub_fidel)
"""
import json, sys
from playwright.sync_api import sync_playwright

PORT = sys.argv[1] if len(sys.argv) > 1 else '8771'
URL = f'http://127.0.0.1:{PORT}/aplicatii/poligon.html'

def deschide(pg, celule, selectie='A1'):
    pg.evaluate("""async ([c,s])=>{const L=window.LH.aplicatii;await L.gata;
      const loc=document.querySelector('[data-lh-aplicatie-loc]')||document.body;
      window.__I=await L.deschide('excel',{loc,continut:{celule:c,selectie:s},scenariu:true,focus:true});}""", [celule, selectie])
    pg.wait_for_timeout(300)

def stare(pg):
    return pg.evaluate("()=>window.__I.stare()")

def clic_mso(pg, idm):
    r = pg.evaluate("""(id)=>{const e=[...window.__I.radacina.querySelectorAll('[data-lh-id-mso="'+id+'"]')].find(x=>x.getClientRects().length);if(!e)return null;
      const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+Math.min(r.height/2,12)]}""", idm)
    if not r: return 'lipsa'
    pg.mouse.click(r[0], r[1]); return 'ok'

def fila(pg, nume):
    r = pg.evaluate("""(n)=>{const e=[...window.__I.radacina.querySelectorAll('[data-lh-tip="TabItem"]')].find(x=>(x.getAttribute('data-lh-eticheta')||'')===n&&x.getClientRects().length);if(!e)return null;
      const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}""", nume)
    if not r: return 'lipsa'
    pg.mouse.click(r[0], r[1]); return 'ok'

def scrie(pg, text, tasta='Enter'):
    pg.evaluate("()=>window.__I.focus()")
    pg.keyboard.type(text, delay=5)
    pg.keyboard.press(tasta)
    pg.wait_for_timeout(150)

rez = {}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = b.new_context(viewport={'width': 1400, 'height': 900})
    ctx.route('**/*', lambda r: r.continue_() if ('127.0.0.1' in r.request.url or 'localhost' in r.request.url) else r.abort())
    pg = ctx.new_page()
    pg.goto(URL + '?aplicatie=excel')
    pg.wait_for_timeout(800)

    # 1. sortarea mută formulele cu rândul? (Excel: =B2*C2 dus pe rândul 4 devine =B4*C4)
    deschide(pg, {'A1': 'Produs', 'B1': 'Pret', 'C1': 'Buc', 'D1': 'Total', 'A2': 'Caiet', 'B2': 5, 'C2': 2, 'D2': '=B2*C2',
                  'A3': 'Pix', 'B3': 3, 'C3': 10, 'D3': '=B3*C3', 'A4': 'Rigla', 'B4': 4, 'C4': 1, 'D4': '=B4*C4'}, 'D2')
    rez['fila_data'] = fila(pg, 'Data')
    pg.wait_for_timeout(200)
    rez['sort_desc'] = clic_mso(pg, 'SortDescendingExcel')
    pg.wait_for_timeout(300)
    s = stare(pg)
    rez['dupa_sortare'] = {a: s['celule'].get(a) for a in ['A2', 'A3', 'A4', 'D2', 'D3', 'D4']}

    # 2. paranteza uitată la sfârșit: Excel o pune singur
    deschide(pg, {'A1': 1, 'A2': 2, 'A3': 3}, 'A4')
    scrie(pg, '=SUM(A1:A3')
    s = stare(pg)
    rez['paranteza_uitata'] = {'A4': s['celule'].get('A4'), 'editare': s['ramane_in_editare'], 'dialog': s.get('dialog'), 'mesaj': s.get('fereastra_mesaj')}

    # 3. IF cu patru părți: ce fereastră?
    deschide(pg, {'B2': 6}, 'C2')
    scrie(pg, '=IF(B2>=5;"a";"b";"c")')
    s = stare(pg)
    rez['if_patru_parti'] = {'C2': s['celule'].get('C2'), 'dialog': s.get('dialog'), 'mesaj': s.get('fereastra_mesaj')}
    pg.keyboard.press('Escape'); pg.keyboard.press('Escape')

    # 4. ghilimele întoarse (Excel: #NAME?, formula primită)
    deschide(pg, {'B2': 6}, 'C2')
    scrie(pg, '=IF(B2>=5;\u201cda\u201d;\u201cnu\u201d)')
    s = stare(pg)
    rez['ghilimele_intoarse'] = {'C2': s['celule'].get('C2'), 'editare': s['ramane_in_editare'], 'mesaj': s.get('fereastra_mesaj')}
    pg.keyboard.press('Escape')

    # 5. Ctrl+Enter pe o zonă: același text în toată zona
    deschide(pg, {'A1': 'x'}, 'B2:B4')
    pg.evaluate("()=>window.__I.focus()")
    pg.keyboard.type('7', delay=5)
    pg.keyboard.press('Control+Enter')
    pg.wait_for_timeout(150)
    s = stare(pg)
    rez['ctrl_enter'] = {a: s['celule'].get(a) for a in ['B2', 'B3', 'B4']}

    # 6. Sort Warning la două coloane din trei (Excel: fără întrebare, sortează doar selecția)
    deschide(pg, {'A1': 'Elev', 'B1': 'N1', 'C1': 'N2', 'A2': 'Ana', 'B2': 9, 'C2': 5, 'A3': 'Bob', 'B3': 4, 'C3': 8}, 'B1:C3')
    fila(pg, 'Data'); pg.wait_for_timeout(150)
    rez['doua_coloane'] = clic_mso(pg, 'SortAscendingExcel')
    pg.wait_for_timeout(250)
    s = stare(pg)
    rez['doua_coloane_dialog'] = s.get('dialog')

    # 7. butonul Pie din Inserare
    deschide(pg, {'A1': 'Luna', 'B1': 'Lei', 'A2': 'ian', 'B2': 5, 'A3': 'feb', 'B3': 7}, 'A1')
    fila(pg, 'Insert'); pg.wait_for_timeout(150)
    rez['pie_buton'] = clic_mso(pg, 'ChartTypePieInsertGallery')
    pg.wait_for_timeout(250)
    s = stare(pg)
    rez['pie_dupa'] = {'grafice': len(s.get('grafice') or []), 'mesaj': pg.evaluate("()=>{const m=document.querySelector('.lh-ap-mesaj, [data-lh-nesimulat]');return m?m.textContent.slice(0,120):null}")}

    b.close()
print(json.dumps(rez, ensure_ascii=False, indent=1))
