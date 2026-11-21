# Jocurile PowerPoint ale verificatorului office-text (poligon.html?aplicatie=powerpoint, headless, rețea doar 127.0.0.1)
from h import *

R = {}


def test(nume):
    def dec(f):
        def g(ctx, port):
            try:
                R[nume] = f(ctx, port)
            except Exception as e:
                R[nume] = {'EROARE': repr(e)[:500]}
            print(nume, json.dumps(R[nume], ensure_ascii=False)[:1800])
        return g
    return dec


def pp(ctx, port, continut=None):
    return App(ctx, port, 'powerpoint', continut)


def cauta(a, *parti):
    return [t for t in a.tinte() if all(p in t for p in parti)]


@test('powerpoint-F091_inchidere')
def t91(ctx, port):
    a = pp(ctx, port)
    a.clic('forma:1/1'); a.scrie('X')
    a.taste('Control+w')
    d = a.stare()['dialog']
    a.clic('fereastra:Cancel'); s1 = a.stare('prezentari_deschise', 'dialog')
    a.clic('fila:File'); bs = cauta(a, 'backstage:Close')
    if bs:
        a.clic(bs[0])
    d2 = a.stare()['dialog']
    a.clic("fereastra:Don't Save")
    s2 = a.stare('prezentari_deschise', 'prezentare_activa')
    b = pp(ctx, port); b.clic('forma:1/1'); b.scrie('Y'); b.clic('bara_titlu:Close'); d3 = b.stare()['dialog']
    return {'dialog_ctrl_w': d, 'dupa_cancel': s1, 'dialog_file_close': d2, 'dupa_dont_save': s2, 'dialog_x': d3}


@test('powerpoint-F015_tabel')
def t15(ctx, port):
    a = pp(ctx, port)
    a.clic('miniatura:3'); a.clic('fila:Insert'); a.clic('mso:TableInsertGallery')
    m = a.tinte('meniu:'); grila = [t for t in m if t.endswith(' Table') and 'x' in t]
    a.clic('meniu:3x2 Table')
    f1 = a.stare()['forme_diapozitiv'][2]
    a.clic('mso:TableInsertGallery'); a.clic('meniu:Insert Table...')
    a.pg.evaluate("() => { const i = [...document.querySelectorAll('[data-lh-aplicatie] input')].filter(e => e.getBoundingClientRect().width > 0); window.__in = i.map(e => e.getAttribute('aria-label')); }")
    campuri = a.pg.evaluate("() => window.__in")
    ok = []
    for et, v in (('Number of columns', '4'), ('Number of rows', '5')):
        r = a.pg.evaluate("et => { const e = [...document.querySelectorAll('[data-lh-aplicatie] input')].find(x => x.getBoundingClientRect().width > 0 && (x.getAttribute('aria-label')||'').startsWith(et)); if (!e) return false; e.focus(); e.select(); return true; }", et)
        if r:
            a.pg.keyboard.press('Control+A'); a.pg.keyboard.type(v)
        ok.append(r)
    a.clic('fereastra:OK')
    f2 = a.stare()['forme_diapozitiv'][2]
    b = pp(ctx, port, {'diapozitive': [{'aspect': 'Title and Content', 'texte': ['Tabel', '']}]})
    icon = [t for t in b.tinte() if 'Table' in t]
    return {'nr_grila': len(grila), 'dupa_grila': f1, 'campuri': campuri, 'umplut': ok, 'dupa_fereastra': f2, 'stare_tabel': a.stare().get('tabele'), 'tinte_table_in_caseta_goala': icon, 'mesaje': a.mesaje()}


@test('powerpoint-F048_F047_tranzitii')
def t48(ctx, port):
    a = pp(ctx, port)
    a.clic('fila:Transitions')
    gal = [t for t in a.tinte('meniu:')][:12] or cauta(a, 'Transitions/')[:15]
    fade = [t for t in a.tinte() if t.endswith(':Fade')]
    a.clic('miniatura:1'); a.clic('miniatura:2', mod='Control')
    sel = a.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-tinta=miniatura]')].filter(e => e.getBoundingClientRect().width>0).map(e => e.getAttribute('data-lh-id') + ':' + (e.getAttribute('aria-selected')) + ':' + e.hasAttribute('data-lh-selectat'))")
    ev_ctrl = a.ev()
    if fade:
        a.clic(fade[0])
    tr = []
    for i in (1, 2, 3):
        a.clic('miniatura:%d' % i); tr.append(a.stare()['tranzitie_galerie'])
    a.clic('miniatura:2')
    none = [t for t in a.tinte() if t.endswith(':None')]
    if none:
        a.clic(none[0])
    return {'galerie': gal, 'fade': fade, 'miniaturi_dupa_ctrl_clic': sel, 'ev_ctrl_clic': ev_ctrl[-2:], 'tranzitii_1_2_3_dupa_fade': tr, 'none': none,
            'dupa_none_d2': a.stare('tranzitie_galerie', 'durata_tranzitie')}


@test('powerpoint-F035_F038_F039_forme')
def t35(ctx, port):
    a = pp(ctx, port, {'diapozitive': [{'aspect': 'Title Only', 'texte': ['Forme'], 'forme': [{'fel': 'forma', 'forma': 'Rectangle', 'pozitie': [100, 200, 200, 120]}]}]})
    a.clic('forma:1/2')
    a.clic('meniu_derulant:Home/Drawing/Shape Fill')
    culori = a.tinte('meniu:')[:14]
    y = [t for t in a.tinte('meniu:') if t in ('meniu:Yellow', 'meniu:Red')]
    a.clic(y[0]); u1 = a.stare()['umplere_forme']
    a.clic('panglica:Home/Drawing/Shape Fill'); u_buton = a.stare()['umplere_forme']
    a.clic('meniu_derulant:Home/Drawing/Shape Outline')
    m = a.tinte('meniu:')
    a.clic('meniu:No Outline')
    s_no = a.stare()
    desen_no = a.pg.evaluate("() => { const s = document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-zona] svg.lh-ap-p-sageata path, [data-lh-aplicatie=powerpoint] [data-lh-zona] svg.lh-ap-p-sageata rect, [data-lh-aplicatie=powerpoint] [data-lh-zona] svg.lh-ap-p-sageata polygon, [data-lh-aplicatie=powerpoint] [data-lh-zona] svg.lh-ap-p-sageata *'); return s && [s.getAttribute('stroke'), s.getAttribute('stroke-width')]; }")
    a.clic('meniu_derulant:Home/Drawing/Shape Outline'); a.clic('meniu:Weight')
    w = [t for t in a.tinte('meniu:') if 'pt' in t]
    if 'meniu:3 pt' in w:
        a.clic('meniu:3 pt')
    desen_w = a.pg.evaluate("() => { const s = document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-zona] svg.lh-ap-p-sageata *'); return s && [s.getAttribute('stroke'), s.getAttribute('stroke-width')]; }")
    chei_contur = [k for k in s_no if 'contur' in k or 'linie' in k or 'outline' in k.lower()]
    return {'culori_lista': culori, 'umplere_dupa_lista': u1, 'umplere_dupa_buton': u_buton, 'meniu_outline': m[:16], 'svg_dupa_no_outline': desen_no,
            'grosimi': w, 'svg_dupa_3pt': desen_w, 'chei_contur_in_stare': chei_contur, 'mesaje': a.mesaje()}


@test('powerpoint-F033_font')
def t33(ctx, port):
    a = pp(ctx, port)
    a.clic('margine_forma:1/1', dx=0.5, dy=0.02)
    a.clic('meniu_derulant:Home/Font/Font')
    lst = a.tinte('meniu:')
    teme = [t for t in lst if '(Headings)' in t or '(Body)' in t]
    a.clic('meniu:Calibri (Body)') if 'meniu:Calibri (Body)' in lst else None
    f1 = a.stare('font_text', 'selectie_forma')
    a.clic('meniu_derulant:Home/Font/Font')
    lst2 = a.tinte('meniu:')
    alt = [t for t in lst2 if t in ('meniu:Arial', 'meniu:Times New Roman', 'meniu:Comic Sans MS')]
    if alt:
        a.clic(alt[0])
    f2 = a.stare('font_text')
    return {'nr_fonturi': len(lst), 'fonturi_tema': teme, 'primele': lst[:6], 'dupa_body': f1, 'ales_all_fonts': alt[:1], 'dupa_all_fonts': f2, 'mesaje': a.mesaje()}


@test('powerpoint-F078_redo')
def t78(ctx, port):
    a = pp(ctx, port)
    a.clic('margine_forma:1/1', dx=0.5, dy=0.02); a.taste('Control+b')
    b1 = a.stare()['formatare_text']
    a.taste('Control+z'); b2 = a.stare()['formatare_text']
    a.taste('Control+y'); b3 = a.stare()['formatare_text']
    a.taste('Control+z'); a.clic('acces_rapid:Redo'); b4 = a.stare()['formatare_text']
    return {'bold': b1, 'dupa_z': b2, 'dupa_y': b3, 'dupa_z_si_redo_buton': b4}


@test('powerpoint-F083_salvare')
def t83(ctx, port):
    a = pp(ctx, port)
    a.taste('Control+s')
    s1 = a.stare('dialog', 'backstage', 'nume_fisier')
    vede = a.tinte('dialog_salvare:') + a.tinte('camp:nume_fisier')
    nume = a.pg.evaluate("() => { const e = [...document.querySelectorAll('[data-lh-aplicatie] input')].find(x => x.getBoundingClientRect().width > 0 && /File name|nume/i.test(x.getAttribute('aria-label')||'')); return e && e.value; }")
    bs = a.tinte('backstage:')[:20]
    br = [t for t in bs if 'Browse' in t]
    if br:
        a.clic(br[0])
        a.pg.evaluate("() => { const e = [...document.querySelectorAll('[data-lh-aplicatie] input')].find(x => x.getBoundingClientRect().width > 0 && /File name/i.test(x.getAttribute('aria-label')||'')); if (e) { e.focus(); e.select(); } }")
        a.pg.keyboard.type('Vulcanii'); a.taste('Enter')
    s2 = a.stare('nume_fisier', 'dialog', 'backstage')
    a.clic('forma:1/1'); a.scrie('!')
    a.ev(); a.taste('Control+s')
    s3 = a.stare('nume_fisier', 'dialog', 'backstage', 'modificat')
    e3 = a.ev()
    b = pp(ctx, port); b.clic('acces_rapid:Save'); qat = b.stare('dialog', 'backstage')
    return {'ctrl_s_nou': s1, 'tinte_dialog': vede, 'nume_propus': nume, 'backstage': bs, 'dupa_browse_enter': s2, 'ctrl_s_a_doua': s3, 'ev': e3, 'qat_save_nou': qat}


@test('powerpoint-F059_F060_animatii')
def t59(ctx, port):
    a = pp(ctx, port)
    a.clic('miniatura:2'); a.clic('margine_forma:2/1', dx=0.5, dy=0.02)
    a.clic('fila:Animations')
    fade = [t for t in a.tinte() if t.endswith(':Fade')]
    if fade:
        a.clic(fade[0])
    a.clic('margine_forma:2/2', dx=0.5, dy=0.02)
    fly = [t for t in a.tinte() if t.endswith(':Fly In') or t.endswith(':Appear')]
    if fly:
        a.clic(fly[0])
    s0 = a.stare('ordine_animatii', 'forme_diapozitiv')
    numere = a.pg.evaluate("() => { const z = document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-zona]'); return [...z.querySelectorAll('*')].filter(e => e.children.length===0 && /^\\s*\\d\\s*$/.test(e.textContent) && e.getBoundingClientRect().width>0).map(e => e.className + ':' + e.textContent.trim()).slice(0,10); }")
    a.poza('ppt_F060_animations')
    pane = [t for t in a.tinte() if 'Animation Pane' in t]
    if pane:
        a.clic(pane[0])
    randuri = [t for t in a.tinte() if t.startswith('fereastra:On Click')]
    out = {'fade': fade, 'fly': fly, 'dupa_doua_efecte': s0, 'numere_pe_diapozitiv': numere, 'pane': pane, 'randuri_panou': randuri}
    if randuri:
        a.clic(randuri[0]); a.ev(); a.taste('Delete')
        out['dupa_delete_pe_rand'] = a.stare('ordine_animatii', 'forme_diapozitiv')
        out['ev_delete'] = a.ev()
        a.taste('Control+z')
        r2 = [t for t in a.tinte() if t.startswith('fereastra:On Click')]
        mn = [t for t in a.tinte() if 'meniu_derulant' in t and ('On Click' in t or 'Fade' in t)]
        out['sageata_pe_rand'] = mn[:4]
        a.clic('margine_forma:2/1', dx=0.5, dy=0.02)
        none = [t for t in a.tinte() if t.endswith(':None')]
        if none:
            a.clic(none[0]); out['dupa_galerie_none'] = a.stare('ordine_animatii', 'forme_diapozitiv')
    return out


@test('powerpoint-F096_ferestre')
def t96(ctx, port):
    a = pp(ctx, port)
    a.taste('Control+n')
    s1 = a.stare('prezentari_deschise', 'prezentare_activa')
    a.clic('fila:View')
    sw = [t for t in a.tinte() if 'Switch' in t]
    out = {'dupa_ctrl_n': s1, 'switch': sw}
    if sw:
        a.clic(sw[0]); out['lista'] = a.tinte('meniu:')[:6]
        p1 = [t for t in a.tinte('meniu:') if 'Presentation1' in t]
        if p1:
            a.clic(p1[0])
        out['dupa'] = a.stare('prezentari_deschise', 'prezentare_activa')
    out['mesaje'] = a.mesaje()
    out['tinte_fereastra_app'] = [t for t in a.tinte() if t.startswith('fereastra_app') or 'Presentation' in t][:6]
    return out


@test('powerpoint-F100_F101_fundal_marime')
def t100(ctx, port):
    a = pp(ctx, port)
    a.clic('fila:Design')
    fb = [t for t in a.tinte() if 'Format Background' in t]
    out = {'format_background': fb}
    if fb:
        a.clic(fb[0])
        out['panou'] = [t for t in a.tinte() if 'fill' in t.lower() or 'Color' in t][:10]
        sf = [t for t in a.tinte() if t.endswith('Solid fill')]
        if sf:
            a.clic(sf[0])
        col = [t for t in a.tinte() if t.endswith(':Color') or 'Fill Color' in t]
        out['col'] = col
        if col:
            a.clic(col[0])
            cul = a.tinte('meniu:')
            out['culori'] = cul[:12]
            o = [t for t in cul if t in ('meniu:Orange', 'meniu:Dark Blue', 'meniu:Gray', 'meniu:Orange, Accent 2')]
            if o:
                a.clic(o[0])
    out['fundal'] = a.stare()['fundal_diapozitive']
    b = pp(ctx, port)
    b.clic('margine_forma:1/1', dx=0.5, dy=0.02)
    b.clic('meniu_derulant:Home/Font/Font Size')
    mar = b.tinte('meniu:')
    out['marimi'] = mar[:20]
    if 'meniu:36' in mar:
        b.clic('meniu:36')
    out['titlu_dupa_36'] = b.stare()['formatare_text']
    b.clic('margine_forma:1/2', dx=0.5, dy=0.02)
    b.pg.evaluate("() => { const e = LH.aplicatii.element('powerpoint','panglica:Home/Font/Font Size'); const i = e && (e.querySelector('input') || e); i.focus(); i.select && i.select(); }")
    b.pg.keyboard.press('Control+A'); b.pg.keyboard.type('44'); b.taste('Enter')
    out['text_dupa_44'] = b.stare()['formatare_text']
    return out


with sesiune() as (ctx, port, blocate):
    for f in [t91, t15, t48, t35, t33, t78, t83, t59, t96, t100]:
        f(ctx, port)
    R['_blocate'] = blocate
rezultat('rez_ppt', R)
