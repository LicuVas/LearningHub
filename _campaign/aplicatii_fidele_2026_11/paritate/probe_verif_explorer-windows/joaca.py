# Verificatorul independent, grupul explorer-windows (21.11.2026): joaca functiile esantionului in poligon, headless.
# Pornire: python joaca.py <port>  (serverul http.server il porneste cine cheama; aici doar 127.0.0.1 / localhost)
import json, sys, time
from playwright.sync_api import sync_playwright

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8771
BASE = f'http://127.0.0.1:{PORT}/aplicatii/poligon.html'
OUT = {}


def doar_local(route):
    u = route.request.url
    if u.startswith('http://127.0.0.1') or u.startswith('http://localhost') or u.startswith('data:') or u.startswith('blob:'):
        return route.continue_()
    return route.abort()


def pagina(ctx, q):
    p = ctx.new_page()
    p.goto(BASE + q)
    p.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.radacini().length>0", timeout=15000)
    p.wait_for_timeout(400)
    return p


def st(p, app):
    return p.evaluate("a=>LH.aplicatii.stare(a)", app)


def mesaj(p):
    return p.evaluate("()=>[...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(x=>x.textContent)")


def ultim_ev(p, n=3):
    return p.evaluate("n=>(window.__lhAplicatieEv||[]).slice(-n).map(e=>({gest:e.gest,actiune:e.actiune,tinta:e.tinta}))", n)


def T(fel, id_=None):
    return f'[data-lh-tinta="{fel}"]' + (f'[data-lh-id="{id_}"]' if id_ is not None else ':not([data-lh-id])')


def explorer(ctx):
    # ---- F011: selectie cu un clic
    p = pagina(ctx, '?aplicatie=explorer')
    r = {}
    p.click(T('lista', 'notite.txt'))
    r['dupa_clic_notite'] = st(p, 'explorer')['selectie']
    p.click(T('lista', 'Desene'))
    r['dupa_clic_Desene'] = st(p, 'explorer')['selectie']
    r['randul_marcat'] = p.evaluate("()=>[...document.querySelectorAll('.lh-ap-e-rand[data-lh-selectat]')].map(x=>x.getAttribute('data-lh-id'))")
    r['cale'] = st(p, 'explorer')['cale_curenta']
    OUT['F011'] = r
    p.close()

    # ---- F001: deschiderea unui folder (dublu clic, Enter, clic dreapta > Deschideti)
    p = pagina(ctx, '?aplicatie=explorer')
    r = {}
    p.dblclick(T('lista', 'Desene'))
    p.wait_for_timeout(200)
    r['dublu_clic_Desene'] = st(p, 'explorer')['cale_curenta']
    p.click(T('nav', 'inapoi'))
    p.click(T('lista', 'Proiect'))
    p.keyboard.press('Enter')
    p.wait_for_timeout(200)
    r['enter_Proiect'] = st(p, 'explorer')['cale_curenta']
    r['lista_in_Proiect'] = p.evaluate("()=>[...document.querySelectorAll('.lh-ap-e-rand')].map(x=>x.getAttribute('data-lh-id'))")
    p.click(T('nav', 'inapoi'))
    p.click(T('lista', 'Desene'), button='right')
    p.wait_for_timeout(150)
    r['meniu'] = p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"meniu\"]')].map(x=>x.getAttribute('data-lh-id'))")
    if p.locator(T('meniu', 'Deschideți')).count():
        p.click(T('meniu', 'Deschideți'))
        r['meniu_Deschideti'] = st(p, 'explorer')['cale_curenta']
    OUT['F001'] = r
    p.close()

    # ---- F009: bara de adresa -> caseta cu calea
    p = pagina(ctx, '?aplicatie=explorer')
    r = {}
    bb = p.locator('.lh-ap-e-adr').bounding_box()
    p.mouse.click(bb['x'] + bb['width'] - 12, bb['y'] + bb['height'] / 2)
    p.wait_for_timeout(150)
    caseta = "()=>{const i=document.querySelector('.lh-ap-e-adr-in');return i?{valoare:i.value,toata_selectata:i.selectionStart===0&&i.selectionEnd===i.value.length,focus:document.activeElement===i,vizibila:i.getBoundingClientRect().width>0}:null}"
    r['clic_parte_goala'] = p.evaluate(caseta)
    p.keyboard.press('Escape'); p.wait_for_timeout(100)
    r['dupa_Esc'] = p.evaluate(caseta)
    p.click(T('lista', 'notite.txt'))
    p.keyboard.press('Control+l'); p.wait_for_timeout(100)
    r['ctrl_L'] = p.evaluate(caseta)
    p.keyboard.press('Enter'); p.wait_for_timeout(100)
    r['dupa_Enter'] = p.evaluate(caseta)
    p.keyboard.press('F4'); p.wait_for_timeout(100)
    r['F4'] = p.evaluate(caseta)
    p.click(T('lista', 'tema.docx')); p.wait_for_timeout(100)
    r['dupa_clic_in_lista'] = p.evaluate(caseta)
    p.keyboard.press('Alt+d'); p.wait_for_timeout(100)
    r['alt_D'] = p.evaluate(caseta)
    p.dblclick(T('lista', 'Desene')); p.wait_for_timeout(150)
    p.keyboard.press('Control+l'); p.wait_for_timeout(100)
    r['in_Desene_ctrl_L'] = p.evaluate(caseta)
    OUT['F009'] = r
    p.close()

    # ---- F032 + F064: Cosul de reciclare (restaurare, golire)
    p = pagina(ctx, '?aplicatie=explorer')
    r = {}
    for n in ('notite.txt', 'harta.png'):
        p.click(T('lista', n)); p.keyboard.press('Delete'); p.wait_for_timeout(100)
    s = st(p, 'explorer')
    r['in_cos'] = s['in_cos']; r['nume_fisiere'] = s['nume_fisiere']
    r['desktop_cos_exista'] = p.locator(T('desktop', 'Coș de reciclare')).count()
    p.dblclick(T('desktop', 'Coș de reciclare')); p.wait_for_timeout(200)
    r['cale_dupa_dublu_clic_cos'] = st(p, 'explorer')['cale_curenta']
    r['randuri_cos'] = p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"cos\"]')].map(x=>x.getAttribute('data-lh-id'))")
    r['bara_comenzi_in_cos'] = p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"bara_comenzi\"],[data-lh-tinta=\"meniu_derulant\"]')].map(x=>x.getAttribute('data-lh-id')+(x.getAttribute('aria-disabled')==='true'?' (gri)':''))")
    r['text_Golire_pe_ecran'] = p.evaluate("()=>document.body.innerText.indexOf('Golire')>=0")
    r['text_Restaurare_pe_ecran_inainte_de_meniu'] = p.evaluate("()=>document.body.innerText.indexOf('Restaurare')>=0")
    p.click(T('cos', 'notite.txt')); p.wait_for_timeout(100)
    r['selectie_in_cos'] = st(p, 'explorer')['selectie']
    p.click(T('cos', 'notite.txt'), button='right'); p.wait_for_timeout(150)
    r['meniu_cos'] = p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"meniu\"]')].map(x=>x.getAttribute('data-lh-id'))")
    p.click(T('meniu', 'Restaurare')); p.wait_for_timeout(150)
    s = st(p, 'explorer')
    r['dupa_Restaurare'] = {'in_cos': s['in_cos'], 'nume_fisiere': s['nume_fisiere'], 'ev': ultim_ev(p, 1)}
    # golirea: comanda Stergere din bara, Delete pe element, clic dreapta pe fond
    p.click(T('cos', 'harta.png')); p.wait_for_timeout(100)
    p.click(T('bara_comenzi', 'Ștergere')); p.wait_for_timeout(150)
    r['Stergere_din_bara_in_cos'] = {'mesaj': mesaj(p), 'in_cos': st(p, 'explorer')['in_cos'], 'dialog': st(p, 'explorer')['dialog']}
    p.click(T('cos', 'harta.png')); p.keyboard.press('Delete'); p.wait_for_timeout(150)
    r['Delete_in_cos'] = {'mesaj': mesaj(p), 'in_cos': st(p, 'explorer')['in_cos']}
    lb = p.locator('.lh-ap-e-lista').bounding_box()
    p.mouse.click(lb['x'] + lb['width'] / 2, lb['y'] + lb['height'] - 20, button='right'); p.wait_for_timeout(150)
    r['clic_dreapta_fond_cos'] = p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"meniu\"]')].map(x=>x.getAttribute('data-lh-id'))")
    OUT['F032_F064'] = r
    p.close()

    # ---- F061: Lipire dupa redenumirea sursei copiate
    p = pagina(ctx, '?aplicatie=explorer')
    r = {}
    p.click(T('lista', 'notite.txt'))
    p.keyboard.press('Control+c')
    p.keyboard.press('F2'); p.wait_for_timeout(150)
    p.keyboard.press('Control+a'); p.keyboard.type('note2'); p.keyboard.press('Enter'); p.wait_for_timeout(150)
    r['dupa_redenumire'] = st(p, 'explorer')['nume_fisiere']
    p.dblclick(T('lista', 'Desene')); p.wait_for_timeout(150)
    p.keyboard.press('Control+v'); p.wait_for_timeout(200)
    s = st(p, 'explorer')
    r['dupa_Ctrl_V'] = {'dialog': s['dialog'], 'mesaj': mesaj(p), 'ev': ultim_ev(p, 1),
                        'lista_Desene': p.evaluate("()=>[...document.querySelectorAll('.lh-ap-e-rand')].map(x=>x.getAttribute('data-lh-id'))"),
                        'dialog_pe_ecran': p.evaluate("()=>{const d=document.querySelector('.lh-ap-e-dlg');return d?d.innerText:null}")}
    # varianta: sursa stearsa (in Cos) intre Copiere si Lipire
    p.click(T('nav', 'inapoi')); p.wait_for_timeout(100)
    p.click(T('lista', 'tema.docx')); p.keyboard.press('Control+c')
    p.keyboard.press('Delete'); p.wait_for_timeout(100)
    p.dblclick(T('lista', 'Desene')); p.wait_for_timeout(150)
    p.keyboard.press('Control+v'); p.wait_for_timeout(200)
    r['sursa_stearsa_apoi_Ctrl_V'] = {'dialog': st(p, 'explorer')['dialog'], 'mesaj': mesaj(p), 'ev': ultim_ev(p, 1)}
    OUT['F061'] = r
    p.close()

    # ---- F046 + F021: locurile (stick E:, Desktop, C:), panoul de navigare
    p = pagina(ctx, '?aplicatie=explorer')
    r = {}
    r['noduri_arbore'] = p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"arbore\"]')].map(x=>x.getAttribute('data-lh-id')+(x.getAttribute('data-e-cale')?' -> '+x.getAttribute('data-e-cale'):' (fara cale)'))")
    r['E_sau_stick_pe_ecran'] = p.evaluate("()=>/\\(E:\\)|Stick|USB/i.test(document.body.innerText)")
    clicuri = {}
    for nod in p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"arbore\"]')].filter(x=>!x.getAttribute('data-e-cale')).map(x=>x.getAttribute('data-lh-id'))"):
        loc = p.locator(T('arbore', nod))
        if loc.count() and loc.first.is_visible():
            loc.first.click(); p.wait_for_timeout(120)
            clicuri[nod] = {'mesaj': mesaj(p), 'cale': st(p, 'explorer')['cale_curenta']}
    r['clic_pe_noduri_fara_cale'] = clicuri
    # stergerea definitiva exista doar pe Shift+Delete (nu legata de un stick)
    p.click(T('arbore', 'Clasa a V-a')); p.wait_for_timeout(100)
    p.click(T('lista', 'notite.txt')); p.keyboard.press('Shift+Delete'); p.wait_for_timeout(150)
    r['Shift_Delete'] = st(p, 'explorer')['dialog']
    p.keyboard.press('Escape'); p.wait_for_timeout(100)
    # mutare intre doua foldere din Documente (Clasa a V-a -> Teme): Ctrl+X, clic in panou pe Teme, Ctrl+V
    p.click(T('lista', 'tema.docx')); p.keyboard.press('Control+x')
    p.click(T('arbore', 'Teme')); p.wait_for_timeout(120)
    p.keyboard.press('Control+v'); p.wait_for_timeout(150)
    r['mutare_in_Teme'] = {'cale': st(p, 'explorer')['cale_curenta'],
                           'lista_Teme': p.evaluate("()=>[...document.querySelectorAll('.lh-ap-e-rand')].map(x=>x.getAttribute('data-lh-id'))"),
                           'nume_fisiere_Clasa': st(p, 'explorer')['nume_fisiere']}
    OUT['F046_F021'] = r
    p.close()

    # ---- F016: coloana Data modificarii
    p = pagina(ctx, '?aplicatie=explorer')
    r = {}
    r['antet'] = p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"antet_coloana\"]')].map(x=>x.getAttribute('data-lh-id'))")
    r['date_pe_randuri'] = p.evaluate("()=>[...document.querySelectorAll('.lh-ap-e-rand')].map(x=>[x.getAttribute('data-lh-id'),x.querySelector('.lh-ap-e-c1').textContent])")
    # o pagina care da date proprii fiecarui fisier (formatul vechi: [cale, data, dimensiune]) - le primeste?
    p.evaluate("""async()=>{await LH.aplicatii.deschide('explorer',{loc:'[data-lh-aplicatie-loc]',continut:{folder:'Ana',arbore:['a.txt','b.png'],
        date:{'a.txt':'01.09.2026 08:00','b.png':'02.10.2026 09:30'},continut:{'a.txt':'x'}},focus:true})}""")
    p.wait_for_timeout(300)
    r['date_cu_continut_propriu'] = p.evaluate("()=>[...document.querySelectorAll('.lh-ap-e-rand')].map(x=>[x.getAttribute('data-lh-id'),x.querySelector('.lh-ap-e-c1').textContent])")
    OUT['F016'] = r
    p.close()


def windows(ctx):
    def deschide(p, ferestre):
        p.evaluate("""async f=>{await LH.aplicatii.deschide('windows',{loc:'[data-lh-aplicatie-loc]',continut:{ferestre:f},focus:true})}""", ferestre)
        p.wait_for_timeout(400)

    FER = [{'aplicatie': 'word', 'titlu': 'Document1 - Word', 'stare': 'normal', 'x': 80, 'y': 60, 'w': 520, 'h': 320},
           {'aplicatie': 'excel', 'titlu': 'Book1 - Excel', 'stare': 'normal', 'activa': True, 'x': 300, 'y': 140, 'w': 520, 'h': 320}]
    fer = lambda p: {f['aplicatie']: (f['stare'], f['activa'], f['x'], f['y'], f['w'], f['h']) for f in st(p, 'windows')['ferestre']}

    # ---- F044: butonul aplicatiei din bara de activitati
    p = pagina(ctx, '?aplicatie=windows')
    deschide(p, FER)
    r = {'inainte': fer(p)}
    bx = '[data-lh-tinta="bara_activitati"][data-lh-app="excel"]'
    bw = '[data-lh-tinta="bara_activitati"][data-lh-app="word"]'
    r['butoane_aplicatii'] = p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"bara_activitati\"][data-lh-app]')].filter(x=>x.getAttribute('data-lh-app')).map(x=>x.getAttribute('data-lh-app'))")
    p.click(bx); p.wait_for_timeout(150); r['clic_excel_activa'] = fer(p)
    p.click(bx); p.wait_for_timeout(150); r['clic_excel_minimizata'] = fer(p)
    p.click(bw); p.wait_for_timeout(150); r['clic_word_din_spate'] = fer(p)
    r['z_word_peste_excel'] = p.evaluate("()=>{const z=a=>+getComputedStyle(document.querySelector('.lh-w-fer[data-lh-id=\"'+a+'\"]')).zIndex;return z('word')>z('excel')}")
    r['ev'] = ultim_ev(p, 3)
    OUT['F044'] = r

    # ---- F080: mutarea prin tragerea barei de titlu
    deschide(p, FER)
    r = {'inainte': fer(p)['excel']}
    tb = p.locator('.lh-w-fer[data-lh-id="excel"] .lh-w-titlu').bounding_box()
    x0, y0 = tb['x'] + 60, tb['y'] + tb['height'] / 2
    p.mouse.move(x0, y0); p.mouse.down(); p.mouse.move(x0 + 60, y0 + 30, steps=5); p.mouse.move(x0 + 120, y0 + 60, steps=5); p.mouse.up()
    p.wait_for_timeout(150)
    r['dupa_tragere_120_60'] = fer(p)['excel']
    r['ev'] = ultim_ev(p, 1)
    # cu sagetile, focusul pe bara de titlu
    tb = p.locator('.lh-w-fer[data-lh-id="excel"] .lh-w-titlu').bounding_box()
    p.mouse.click(tb['x'] + 60, tb['y'] + tb['height'] / 2); p.keyboard.press('ArrowRight'); p.keyboard.press('ArrowRight'); p.wait_for_timeout(100)
    r['dupa_sageti'] = fer(p)['excel']
    # fereastra maximizata trasa de bara de titlu
    p.click('.lh-w-fer[data-lh-id="excel"] [data-lh-tinta="bara_titlu"][data-lh-id="Maximizare"]'); p.wait_for_timeout(150)
    r['maximizata'] = fer(p)['excel']
    tb = p.locator('.lh-w-fer[data-lh-id="excel"] .lh-w-titlu').bounding_box()
    x0, y0 = tb['x'] + 300, tb['y'] + tb['height'] / 2
    p.mouse.move(x0, y0); p.mouse.down(); p.mouse.move(x0 + 50, y0 + 80, steps=8); p.mouse.up(); p.wait_for_timeout(150)
    r['maximizata_trasa'] = fer(p)['excel']
    OUT['F080'] = r

    # ---- F081: redimensionarea de margine / colt
    deschide(p, FER)
    r = {'inainte': fer(p)['excel']}
    box = p.locator('.lh-w-fer[data-lh-id="excel"]').bounding_box()
    r['cursor_margine_dreapta'] = p.evaluate("([x,y])=>{const e=document.elementFromPoint(x,y);return e?getComputedStyle(e).cursor+' / '+e.className:null}", [box['x'] + box['width'] - 2, box['y'] + box['height'] / 2])
    xr, ym = box['x'] + box['width'] - 2, box['y'] + box['height'] / 2
    p.mouse.move(xr, ym); p.mouse.down(); p.mouse.move(xr + 100, ym, steps=8); p.mouse.up(); p.wait_for_timeout(150)
    r['dupa_tragere_margine_dreapta_+100'] = fer(p)['excel']
    box = p.locator('.lh-w-fer[data-lh-id="excel"]').bounding_box()
    xc, yc = box['x'] + box['width'] - 2, box['y'] + box['height'] - 2
    p.mouse.move(xc, yc); p.mouse.down(); p.mouse.move(xc + 80, yc + 60, steps=8); p.mouse.up(); p.wait_for_timeout(150)
    r['dupa_tragere_colt_dreapta_jos'] = fer(p)['excel']
    box = p.locator('.lh-w-fer[data-lh-id="excel"]').bounding_box()
    xs, ys = box['x'] + 1, box['y'] + box['height'] / 2
    p.mouse.move(xs, ys); p.mouse.down(); p.mouse.move(xs - 60, ys, steps=8); p.mouse.up(); p.wait_for_timeout(150)
    r['dupa_tragere_margine_stanga_-60'] = fer(p)['excel']
    r['ev'] = ultim_ev(p, 2)
    OUT['F081'] = r

    # ---- F076: dublu clic pe bara de titlu
    deschide(p, FER)
    r = {'inainte': fer(p)['excel']}
    tb = p.locator('.lh-w-fer[data-lh-id="excel"] .lh-w-titlu').bounding_box()
    p.mouse.dblclick(tb['x'] + 80, tb['y'] + tb['height'] / 2); p.wait_for_timeout(200)
    r['dupa_dublu_clic'] = fer(p)['excel']
    r['ev'] = ultim_ev(p, 3)
    p.click('.lh-w-fer[data-lh-id="excel"] [data-lh-tinta="bara_titlu"][data-lh-id="Maximizare"]'); p.wait_for_timeout(150)
    r['buton_Maximizare_pentru_comparatie'] = fer(p)['excel']
    tb = p.locator('.lh-w-fer[data-lh-id="excel"] .lh-w-titlu').bounding_box()
    p.mouse.dblclick(tb['x'] + 200, tb['y'] + tb['height'] / 2); p.wait_for_timeout(200)
    r['dublu_clic_pe_maximizata'] = fer(p)['excel']
    OUT['F076'] = r

    # ---- F089: browserul (fereastra cu file)
    deschide(p, [])
    r = {'aplicatii_cunoscute': p.evaluate("()=>Object.keys((LH.aplicatii._date||{}).windows||{}).length"),
         'butoane_bara': p.evaluate("()=>[...document.querySelectorAll('[data-lh-tinta=\"bara_activitati\"]')].map(x=>x.getAttribute('data-lh-id').split('\\n')[0])")}
    ch = p.evaluate("()=>{const b=[...document.querySelectorAll('[data-lh-tinta=\"bara_activitati\"]')].find(x=>/Chrome|Edge|browser/i.test(x.getAttribute('data-lh-id')));return b?b.getAttribute('data-lh-id'):null}")
    r['buton_browser'] = ch
    if ch:
        p.click(f'[data-lh-tinta="bara_activitati"][data-lh-id="{ch}"]'); p.wait_for_timeout(150)
        r['clic_buton_browser'] = {'mesaj': mesaj(p), 'ferestre': st(p, 'windows')['ferestre']}
    OUT['F089'] = r

    # ---- Explorer montat in fereastra shell-ului (dosarul galben din bara): selectie, deschidere, Cos
    deschide(p, [])
    r = {}
    dos = p.evaluate("()=>{const b=[...document.querySelectorAll('[data-lh-tinta=\"bara_activitati\"]')].find(x=>/Explorer/.test(x.getAttribute('data-lh-id')));return b?b.getAttribute('data-lh-id'):null}")
    r['buton_explorer'] = dos
    p.click(f'[data-lh-tinta="bara_activitati"][data-lh-id="{dos}"]'); p.wait_for_timeout(800)
    r['ferestre'] = st(p, 'windows')['ferestre']
    ex = st(p, 'explorer')
    r['explorer_montat'] = {'cale': ex and ex['cale_curenta'], 'titlu': ex and ex.get('titlu'), 'nume': ex and ex['nume_fisiere']}
    if ex and ex['nume_fisiere']:
        primul_folder = next((n[:-1] for n in ex['nume_fisiere'] if n.endswith('/')), None)
        primul_fisier = next((n for n in ex['nume_fisiere'] if not n.endswith('/')), None)
        if primul_fisier:
            p.click(T('lista', primul_fisier)); p.wait_for_timeout(100)
            r['clic_fisier_montat'] = st(p, 'explorer')['selectie']
        if primul_folder:
            p.dblclick(T('lista', primul_folder)); p.wait_for_timeout(200)
            r['dublu_clic_folder_montat'] = st(p, 'explorer')['cale_curenta']
            r['titlu_fereastra_shell'] = [f['titlu'] for f in st(p, 'windows')['ferestre']]
    r['cos_in_explorer_montat'] = p.locator('[data-lh-aplicatie="explorer"] ' + T('desktop', 'Coș de reciclare')).count()
    cos = p.locator('[data-lh-aplicatie="windows"] ' + T('desktop', 'Coș de reciclare'))
    r['cos_pe_desktopul_shell'] = cos.count()
    if cos.count():
        cos.first.dblclick(); p.wait_for_timeout(200)
        r['dublu_clic_cos_shell'] = {'mesaj': mesaj(p), 'cale_explorer': (st(p, 'explorer') or {}).get('cale_curenta')}
    OUT['montat'] = r
    p.close()


with sync_playwright() as pw:
    b = pw.chromium.launch(headless=True)
    ctx = b.new_context(viewport={'width': 1366, 'height': 768}, locale='ro-RO')
    ctx.route('**/*', doar_local)
    for f in (explorer, windows):
        try:
            f(ctx)
        except Exception as e:
            OUT['EROARE_' + f.__name__] = repr(e)[:800]
    b.close()

json.dump(OUT, open(__file__.replace('joaca.py', 'rezultat.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(json.dumps(OUT, ensure_ascii=False)[:200])
