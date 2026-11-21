# Jocurile verificatorului powerpoint-da, partea 1: diapozitive, text, obiecte (poligon.html?aplicatie=powerpoint, headless)
from comun import *


@test('F001_new_slide')
def f001(ctx, port):
    a = pp(ctx, port); r = {}
    a.clic('miniatura:1'); a.clic('panglica:Home/Slides/New Slide')
    r['dupa_title_slide'] = [asp(a), a.stare()['diapozitiv_activ']]
    a.clic('miniatura:4'); a.clic('panglica:Home/Slides/New Slide')
    r['dupa_title_only'] = [asp(a), a.stare()['diapozitiv_activ']]
    a.clic('miniatura:2'); a.taste('Control+m')
    r['ctrl_m_pe_miniatura2'] = [asp(a), a.stare()['diapozitiv_activ']]
    b = pp(ctx, port)
    rclic(b, 'miniatura:1'); b.clic('meniu:New Slide')
    r['clic_dreapta_new_slide'] = [asp(b), b.stare()['diapozitiv_activ']]
    c = pp(ctx, port); c.clic('margine_forma:1/1'); c.taste('Control+m')
    r['ctrl_m_cu_caseta_aleasa'] = [asp(c), c.stare()['diapozitiv_activ']]
    r['mesaje'] = a.mesaje() + b.mesaje() + c.mesaje()
    return r


@test('F002_new_slide_lista')
def f002(ctx, port):
    a = pp(ctx, port); a.clic('miniatura:1')
    a.clic('meniu_derulant:Home/Slides/New Slide')
    lista = a.tinte('meniu:')
    a.clic('meniu:Two Content')
    r = {'lista': lista, 'dupa': [asp(a), a.stare()['diapozitiv_activ']]}
    a.clic('meniu_derulant:Home/Slides/New Slide'); a.clic('meniu:Section Header')
    r['dupa2'] = [asp(a), a.stare()['diapozitiv_activ']]
    a.clic('fila:Insert'); a.clic('meniu_derulant:Insert/Slides/New Slide'); a.clic('meniu:Blank')
    r['din_insert'] = [asp(a), a.stare()['diapozitiv_activ']]
    r['mesaje'] = a.mesaje()
    return r


@test('F004_alege_miniatura')
def f004(ctx, port):
    a = pp(ctx, port); r = {'inainte': [a.stare()['diapozitiv_activ'], indicator(a)]}
    a.clic('miniatura:2')
    zona = a.pg.evaluate("() => { const z = document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-zona]'); return z ? z.innerText.replace(/\\s+/g,' ').slice(0,200) : null; }")
    r['dupa'] = [a.stare()['diapozitiv_activ'], indicator(a), zona, a.stare()['panou']]
    a.clic('miniatura:3'); r['dupa3'] = [a.stare()['diapozitiv_activ'], indicator(a)]
    return r


@test('F005_sageti_miniaturi')
def f005(ctx, port):
    a = pp(ctx, port); a.clic('miniatura:1'); r = []
    for k in ['ArrowDown', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'End', 'Home']:
        a.taste(k); r.append([k, a.stare()['diapozitiv_activ'], indicator(a)])
    return {'pasi': r, 'ev': a.ev()[-3:]}


PANOU = "() => document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-tinta=miniatura]').parentElement"


@test('F006_muta_miniatura')
def f006(ctx, port):
    a = pp(ctx, port)
    b3 = a.bbox('miniatura:3'); b1 = a.bbox('miniatura:1')
    h0 = a.pg.evaluate("() => { const m = document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-tinta=miniatura]').parentElement; return [m.children.length, m.innerHTML.length]; }")

    def mij():
        a.poza('F006_in_timpul_tragerii')
        return a.pg.evaluate("() => { const m = document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-tinta=miniatura]').parentElement; return [m.children.length, m.innerHTML.length]; }")
    m = trage(a, 'miniatura:1', 0, (b3['y'] + b3['h'] * 0.85) - (b1['y'] + b1['h'] / 2), pasi=12, mijloc=mij)
    return {'panou_inainte': h0, 'panou_in_timpul': m, 'dupa': [titluri(a), a.stare()['diapozitiv_activ']], 'ev': a.ev()[-2:]}


@test('F008_sterge_diapozitiv')
def f008(ctx, port):
    r = {}
    a = pp(ctx, port); a.clic('miniatura:2'); a.taste('Delete')
    r['delete_pe_2'] = [titluri(a), a.stare()['diapozitiv_activ']]
    a.clic('miniatura:2'); a.taste('Backspace')
    r['backspace_pe_ultimul'] = [titluri(a), a.stare()['diapozitiv_activ']]
    a.clic('miniatura:1'); a.taste('Delete')
    r['delete_singurul'] = [titluri(a), a.stare()['diapozitiv_activ'], a.mesaje()]
    b = pp(ctx, port); rclic(b, 'miniatura:1'); b.clic('meniu:Delete Slide')
    r['clic_dreapta_delete_slide'] = [titluri(b), b.stare()['diapozitiv_activ']]
    return r


@test('F011_scrie_text')
def f011(ctx, port):
    a = pp(ctx, port, {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['', '']}, {'aspect': 'Title and Content', 'texte': ['', '']}]})
    a.clic('forma:1/1'); a.scrie('Vulcanii')
    a.clic('forma:1/2'); a.scrie('Clasa a VI-a')
    a.clic('miniatura:2'); a.clic('forma:2/1'); a.scrie('Ce sunt')
    a.clic('forma:2/2'); a.scrie('Lava'); a.taste('Enter'); a.scrie('Cenusa')
    r = {'texte': [d['texte'] for d in a.stare()['diapozitive']]}
    a.poza('F011_dupa_scris')
    b = pp(ctx, port); b.clic('forma:1/1'); b.taste('End'); b.scrie(' activi')
    r['in_text_existent'] = b.stare()['diapozitive'][0]['texte']
    return r


@test('F017_forme')
def f017(ctx, port):
    a = pp(ctx, port); a.clic('miniatura:3'); r = {}
    a.clic('fila:Insert'); a.clic('meniu_derulant:Insert/Illustrations/Shapes')
    lista = a.tinte('meniu:'); r['nr_forme_in_lista'] = len(lista)
    cerute = ['Rectangle', 'Rectangle: Rounded Corners', 'Oval', 'Isosceles Triangle', 'Arrow: Right', 'Arrow: Left', 'Star: 5 Points']
    r['cerute_prezente'] = {c: ('meniu:' + c) in lista for c in cerute}
    a.taste('Escape')
    pus = []
    for i, c in enumerate(cerute):
        a.clic('fila:Insert'); a.clic('meniu_derulant:Insert/Illustrations/Shapes')
        if not a.exista('meniu:' + c):
            pus.append([c, 'lipsa']); a.taste('Escape'); continue
        a.clic('meniu:' + c)
        a.clic('diapozitiv', dx=0.08 + 0.12 * i, dy=0.75)
        f = a.stare()['forme_diapozitiv'][2]
        pus.append([c, f[-1], len(f)])
    r['puse'] = pus; r['file_ctx'] = file_ctx(a)[-3:]
    a.poza('F017_forme')
    a.clic('fila:Home'); a.clic('meniu_derulant:Home/Drawing/Shapes'); r['home_shapes'] = len(a.tinte('meniu:'))
    r['mesaje'] = a.mesaje()
    return r


@test('F019_alege_obiect')
def f019(ctx, port):
    a = pp(ctx, port, {'diapozitive': [{'aspect': 'Title Only', 'texte': ['Formă'], 'forme': [{'fel': 'forma', 'forma': 'Rectangle', 'pozitie': [100, 200, 200, 100]}]}]})
    r = {'file_inainte': file_ctx(a)[-3:]}
    a.clic('forma:1/2')
    r['forma'] = [selectate(a), file_ctx(a)[-3:], a.stare()['selectie_forma']]
    a.clic('diapozitiv', dx=0.9, dy=0.9)
    r['dupa_clic_gol'] = [selectate(a), file_ctx(a)[-3:]]
    a.clic('fila:Insert'); a.clic('meniu_derulant:Insert/Tables/Table'); a.clic('meniu:3x2 Table')
    a.clic('diapozitiv', dx=0.97, dy=0.97)
    r['tinte_dupa_tabel'] = [t for t in a.tinte() if t.startswith(('forma:', 'margine_forma:', 'tabel', 'imagine'))]
    tab = [t for t in a.tinte() if t.startswith('forma:1/3') or t.startswith('tabel')]
    if tab:
        a.clic(tab[0])
    r['tabel'] = [tab, selectate(a), file_ctx(a)[-3:]]
    a.clic('diapozitiv', dx=0.97, dy=0.97)
    a.clic('fila:Insert'); a.clic('meniu_derulant:Insert/Images/Pictures')
    r['pictures_lista'] = a.tinte('meniu:')
    if a.exista('meniu:This Device...'):
        a.clic('meniu:This Device...')
        fis = a.tinte('lista:'); r['fisiere'] = fis[:6]; r['butoane_dialog'] = a.tinte('fereastra:')
        if fis:
            a.clic(fis[0])
            if a.exista('fereastra:Open'):
                a.clic('fereastra:Open')
            elif a.exista('fereastra:Insert'):
                a.clic('fereastra:Insert')
        r['dupa_insert_imagine'] = [file_ctx(a)[-3:], a.stare()['forme_diapozitiv'][0]]
        a.clic('diapozitiv', dx=0.97, dy=0.97)
        im = [t for t in a.tinte() if t.startswith('forma:1/4') or t.startswith('imagine')]
        if im:
            a.clic(im[0])
        r['imagine'] = [im, selectate(a), file_ctx(a)[-3:]]
    r['mesaje'] = a.mesaje()
    return r


@test('F020_muta_obiect')
def f020(ctx, port):
    c = {'diapozitive': [{'aspect': 'Title Only', 'texte': ['Titlu'], 'forme': [{'fel': 'forma', 'forma': 'Oval', 'pozitie': [100, 200, 200, 100]}]}]}
    a = pp(ctx, port, c)
    p0 = a.stare()['pozitii_forme'][0]
    a.clic('forma:1/2'); trage(a, 'forma:1/2', 120, 60)
    p1 = a.stare()['pozitii_forme'][0]
    trage(a, 'forma:1/1', 0, 80, fx=0.3, fy=0.5)
    p2 = a.stare()['pozitii_forme'][0]
    trage(a, 'margine_forma:1/1', 0, 80)
    p3 = a.stare()['pozitii_forme'][0]
    b = pp(ctx, port, c)
    trage(b, 'forma:1/2', -60, -40)
    p4 = b.stare()['pozitii_forme'][0]
    d = pp(ctx, port, {'diapozitive': [{'aspect': 'Blank', 'texte': [], 'forme': [{'fel': 'caseta_text', 'text': 'Caseta', 'pozitie': [100, 100, 200, 50]}]}]})
    q0 = d.stare()['pozitii_forme'][0]
    trage(d, 'margine_forma:1/1', 100, 100)
    q1 = d.stare()['pozitii_forme'][0]
    return {'start': p0, 'forma_aleasa_trasa': p1, 'titlu_tras_din_mijloc_nealeasa': p2, 'titlu_tras_de_chenar': p3,
            'forma_nealeasa_trasa': p4, 'caseta_text_start': q0, 'caseta_trasa_de_chenar': q1}


if __name__ == '__main__':
    ruleaza('rez1')
