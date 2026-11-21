# Jocurile verificatorului powerpoint-da, partea 2: New Slide ▾, imaginea, formatarea textului și a formelor, fundalul
from comun import *

FORMA = {'diapozitive': [{'aspect': 'Title Only', 'texte': ['Vulcanii'], 'forme': [{'fel': 'forma', 'forma': 'Rectangle', 'pozitie': [100, 200, 200, 100]}]},
                         {'aspect': 'Title and Content', 'texte': ['Doi', 'Lava']}]}


@test('F002_new_slide_lista')
def f002(ctx, port):
    a = pp(ctx, port); a.clic('miniatura:1')
    a.clic('meniu_derulant:Home/Slides/New Slide')
    lista = a.tinte('meniu:')
    a.clic('meniu:Two Content')
    r = {'lista': lista, 'dupa': [asp(a), a.stare()['diapozitiv_activ']]}
    a.clic('meniu_derulant:Home/Slides/New Slide'); a.clic('meniu:Section Header')
    r['dupa2'] = [asp(a), a.stare()['diapozitiv_activ']]
    a.clic('fila:Insert'); a.clic('meniu_derulant:Insert/Slides/New Slide')
    r['lista_insert'] = a.tinte('meniu:')
    a.taste('Escape')
    r['mesaje'] = a.mesaje()
    return r


@test('F019_imagine')
def f019b(ctx, port):
    a = pp(ctx, port, {'diapozitive': [{'aspect': 'Title Only', 'texte': ['Poza']}]})
    a.clic('fila:Insert'); a.clic('meniu_derulant:Insert/Images/Pictures'); a.clic('meniu:This Device...')
    a.clic('camp:nume_fisier'); a.taste('Control+a'); a.scrie('vulcan.png')
    a.clic('fereastra:Open')
    r = {'dupa_open': [a.stare()['forme_diapozitiv'][0], selectate(a), file_ctx(a)[-3:]]}
    a.clic('diapozitiv', dx=0.02, dy=0.97)
    r['dupa_clic_gol'] = [selectate(a), file_ctx(a)[-3:]]
    im = [t for t in a.tinte() if t.startswith('forma:1/2')]
    if im:
        a.clic(im[0])
    r['clic_pe_imagine'] = [selectate(a), file_ctx(a)[-3:]]
    a.clic('forma:1/1')
    r['clic_pe_titlu'] = [selectate(a), file_ctx(a)[-3:]]
    return r


def fmt(a):
    s = a.stare()
    return s['formatare_pe_caractere']


@test('F027_F028_F029_BIU')
def biu(ctx, port):
    r = {}
    for nume, btn, k in [('bold', 'Bold', 'b'), ('italic', 'Italic', 'i'), ('underline', 'Underline', 'u')]:
        a = pp(ctx, port)
        a.clic('margine_forma:1/1'); a.clic('panglica:Home/Font/' + btn)
        x1 = fmt(a)
        a.taste('Control+' + k); x2 = fmt(a)
        a.clic('forma:1/2'); a.taste('Control+a'); a.taste('Control+' + k)
        a.clic('miniatura:1')
        a.clic('margine_forma:1/2'); x3 = fmt(a)
        # cuvânt ales cu dublu clic + buton
        b = pp(ctx, port)
        b.clic('miniatura:2'); b.clic('forma:2/2'); b.clic('forma:2/2', dublu=True)
        sel = b.stare()['selectie_text']
        b.clic('panglica:Home/Font/' + btn)
        b.clic('miniatura:2'); b.clic('margine_forma:2/2'); x4 = fmt(b)
        r[nume] = {'caseta_aleasa_buton': x1, 'apoi_ctrl': x2, 'subtitlu_ctrl_a_ctrl': x3, 'cuvant': [sel and sel.get('text'), x4]}
    return r


@test('F031_marime_pas')
def f031(ctx, port):
    a = pp(ctx, port); a.clic('margine_forma:1/1'); r = [fmt(a)[0]['marime']]
    for b in ['Increase', 'Increase', 'Decrease', 'Decrease', 'Decrease']:
        a.clic('panglica:Home/Font/' + b + ' Font Size'); r.append([b, [x['marime'] for x in fmt(a)]])
    a.clic('margine_forma:1/2'); r.append(['subtitlu', fmt(a)[0]['marime']])
    a.taste('Control+bracketright'); r.append(['ctrl+]', [x['marime'] for x in fmt(a)]])
    a.taste('Control+Shift+Period'); r.append(['ctrl+shift+>', [x['marime'] for x in fmt(a)]])
    return r


@test('F034_font_color')
def f034(ctx, port):
    a = pp(ctx, port); a.clic('margine_forma:1/1'); r = {'inainte': a.stare()['culoare_text']}
    a.clic('panglica:Home/Font/Font Color'); r['buton'] = a.stare()['culoare_text']
    a.clic('meniu_derulant:Home/Font/Font Color')
    lista = a.tinte('meniu:'); r['nr_culori'] = len(lista); r['lista'] = lista[:14] + ['...'] + lista[-14:]
    r['titluri_grupuri'] = a.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] *')].filter(e => e.children.length === 0 && /^(Theme Colors|Standard Colors|Recent Colors)$/.test((e.textContent||'').trim()) && e.getBoundingClientRect().width > 0).map(e => e.textContent.trim())")
    if a.exista('meniu:Blue'):
        a.clic('meniu:Blue')
    r['dupa_blue'] = a.stare()['culoare_text']
    a.clic('margine_forma:1/2'); a.clic('panglica:Home/Font/Font Color'); r['buton_dupa_blue_pe_subtitlu'] = a.stare()['culoare_text']
    a.clic('meniu_derulant:Home/Font/Font Color')
    tc = [t for t in a.tinte('meniu:') if 'Accent 2' in t]
    r['tema_accent2'] = tc[:3]
    if tc:
        a.clic(tc[0]); r['dupa_accent2'] = a.stare()['culoare_text']
    return r


def contur_dom(a, tinta):
    return a.pg.evaluate("t => { const e = LH.aplicatii.element('powerpoint', t); if (!e) return null; const s = e.querySelector('polygon,rect,ellipse,path'); return s ? {fill: s.getAttribute('fill'), stroke: s.getAttribute('stroke'), sw: s.getAttribute('stroke-width'), css: getComputedStyle(s).stroke} : e.getAttribute('style'); }", tinta)


@test('F036_no_fill')
def f036(ctx, port):
    a = pp(ctx, port, FORMA); a.clic('forma:1/2')
    r = {'inainte': a.stare()['umplere_forme'][0], 'dom0': contur_dom(a, 'forma:1/2')}
    a.clic('meniu_derulant:Home/Drawing/Shape Fill')
    r['lista_are_no_fill'] = a.exista('meniu:No Fill')
    a.clic('meniu:No Fill')
    r['dupa_home'] = [a.stare()['umplere_forme'][0], contur_dom(a, 'forma:1/2')]
    b = pp(ctx, port, FORMA); b.clic('forma:1/2'); b.clic('fila:Shape Format')
    sf = [t for t in b.tinte() if 'Shape Fill' in t]
    r['shape_format_tinte'] = sf
    dd = [t for t in sf if t.startswith('meniu_derulant')]
    if dd:
        b.clic(dd[0]); b.clic('meniu:No Fill'); r['dupa_shape_format'] = b.stare()['umplere_forme'][0]
    c = pp(ctx, port, FORMA); c.clic('margine_forma:1/1'); c.clic('meniu_derulant:Home/Drawing/Shape Fill'); c.clic('meniu:Yellow')
    c.clic('meniu_derulant:Home/Drawing/Shape Fill'); c.clic('meniu:No Fill')
    r['caseta_titlu_galben_apoi_no_fill'] = c.stare()['umplere_forme'][0]
    return r


@test('F037_shape_outline')
def f037(ctx, port):
    a = pp(ctx, port, FORMA); a.clic('forma:1/2')
    r = {'dom0': contur_dom(a, 'forma:1/2')}
    a.clic('panglica:Home/Drawing/Shape Outline'); r['buton'] = contur_dom(a, 'forma:1/2')
    a.clic('meniu_derulant:Home/Drawing/Shape Outline')
    l = a.tinte('meniu:'); r['nr'] = len(l); r['extra'] = [t for t in l if not any(c in t for c in ['Accent', 'Lighter', 'Darker', 'Background', 'Text'])][:30]
    a.clic('meniu:Red'); r['red'] = contur_dom(a, 'forma:1/2')
    a.clic('panglica:Home/Drawing/Shape Outline'); r['buton_dupa_red'] = contur_dom(a, 'forma:1/2')
    a.clic('margine_forma:1/1'); a.clic('panglica:Home/Drawing/Shape Outline'); r['titlu_buton'] = html(a, 'forma:1/1', 400)
    r['ev'] = a.ev()[-2:]
    return r


@test('F040_F041_F042_fundal')
def fundal(ctx, port):
    a = pp(ctx, port); r = {}
    a.clic('miniatura:2'); a.clic('fila:Design'); a.clic('meniu_derulant:Design/Customize/Background Styles')
    r['lista_bg_styles'] = a.tinte('meniu:')[-4:]
    a.clic('meniu:Format Background...')
    pan = [t for t in a.tinte() if t not in ('',)]
    r['panou_deschis'] = a.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] *')].some(e => e.children.length === 0 && (e.textContent||'').trim() === 'Format Background' && e.getBoundingClientRect().width > 0)")
    r['tinte_panou'] = [t for t in a.tinte() if any(k in t for k in ['fill', 'Fill', 'Color', 'Apply', 'Reset', 'Hide', 'Transparency', 'Format Background'])][:40]
    a.poza('F040_panou')
    # Solid fill + Color
    sol = [t for t in a.tinte() if t.endswith('Solid fill')]
    if sol:
        a.clic(sol[0])
    col = [t for t in a.tinte() if t.startswith('meniu_derulant') and t.endswith('Color')]
    r['col_tinte'] = col
    if col:
        a.clic(col[-1]); r['lista_culori_nr'] = len(a.tinte('meniu:'))
        if a.exista('meniu:Light Green'):
            a.clic('meniu:Light Green')
        elif a.exista('meniu:Green'):
            a.clic('meniu:Green')
    r['fundal_dupa_culoare'] = a.stare()['fundal_diapozitive']
    ap = [t for t in a.tinte() if 'Apply to All' in t or 'Apply To All' in t]
    r['apply_tinte'] = ap
    if ap:
        a.clic(ap[0])
    r['fundal_dupa_apply_all'] = a.stare()['fundal_diapozitive']
    r['mesaje'] = a.mesaje()
    b = pp(ctx, port); rclic(b, 'miniatura:3'); b.clic('meniu:Format Background...')
    r['clic_dreapta_panou'] = b.pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=powerpoint] *')].some(e => e.children.length === 0 && (e.textContent||'').trim() === 'Format Background' && e.getBoundingClientRect().width > 0)")
    r['clic_dreapta_activ'] = b.stare()['diapozitiv_activ']
    return r


if __name__ == '__main__':
    ruleaza('rez2')
