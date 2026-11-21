# Jocurile verificatorului powerpoint-da, partea 4: expunerea, vederile, notele, interfața, anularea, fila File, atelierul
from comun import *


def ex(a):
    s = a.stare()
    return [s['expunere'], s['vedere']]


def clic_ecran(a):
    a.pg.mouse.click(700, 450); a.pg.wait_for_timeout(300)


@test('F062_F063_F064_expunere')
def show(ctx, port):
    r = {}
    a = pp(ctx, port); a.clic('miniatura:3'); a.taste('F5'); r['f5_de_pe_3'] = ex(a)
    a.poza('F062_expunere')
    a.taste('Escape'); r['esc'] = ex(a)
    a.clic('fila:Slide Show'); a.clic('panglica:Slide Show/Start Slide Show/From Beginning'); r['from_beginning'] = ex(a); a.taste('Escape')
    a.clic('miniatura:2'); a.taste('Shift+F5'); r['shift_f5_de_pe_2'] = ex(a); a.taste('Escape')
    a.clic('miniatura:2'); a.clic('fila:Slide Show'); a.clic('panglica:Slide Show/Start Slide Show/From Current Slide'); r['from_current'] = ex(a); a.taste('Escape')
    a.clic('miniatura:2'); a.clic('bara_stare:Slide Show'); r['bara_stare_slide_show'] = ex(a); a.taste('Escape')
    b = pp(ctx, port); b.taste('F5'); pas = [['start', ex(b)]]
    for g in ['clic', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'Enter', 'ArrowLeft', 'Space', 'Space', 'clic', 'clic']:
        if g == 'clic':
            clic_ecran(b)
        else:
            b.taste(g)
        pas.append([g, ex(b)])
    r['inainte_inapoi'] = pas
    b.poza('F064_final')
    r['mesaje'] = a.mesaje() + b.mesaje()
    return r


@test('F070_slide_sorter')
def f070(ctx, port):
    a = pp(ctx, port); r = {}
    a.clic('bara_stare:Slide Sorter'); r['bara_stare'] = [a.stare()['vedere'], a.exista('zona_note'), len(a.tinte('miniatura:'))]
    a.poza('F070_sorter')
    a.clic('bara_stare:Normal'); r['inapoi_normal'] = a.stare()['vedere']
    a.clic('fila:View'); a.clic('panglica:View/Presentation Views/Slide Sorter'); r['view'] = a.stare()['vedere']
    a.clic('miniatura:3', dublu=True); r['dublu_clic_in_sorter'] = [a.stare()['vedere'], a.stare()['diapozitiv_activ']]
    return r


@test('F073_F074_note')
def note(ctx, port):
    a = pp(ctx, port); r = {}
    a.clic('miniatura:2'); a.clic('zona_note'); a.scrie('Spun despre lava.')
    a.clic('miniatura:1'); a.clic('zona_note'); a.scrie('Salut')
    r['note'] = a.stare()['note_diapozitive']
    a.clic('miniatura:2')
    r['zona_note_text_pe_2'] = a.pg.evaluate("() => { const e = LH.aplicatii.element('powerpoint', 'zona_note'); return e ? e.innerText.trim() : null; }")
    a.clic('bara_stare:Notes'); r['ascuns_bara'] = a.exista('zona_note')
    a.clic('bara_stare:Notes'); r['aratat_bara'] = a.exista('zona_note')
    a.clic('fila:View'); a.clic('panglica:View/Show/Notes'); r['ascuns_view'] = a.exista('zona_note')
    a.clic('panglica:View/Show/Notes'); r['aratat_view'] = a.exista('zona_note')
    r['mesaje'] = a.mesaje()
    return r


@test('F075_file_zone')
def f075(ctx, port):
    a = pp(ctx, port); r = {}
    for f in ['Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'View', 'Review', 'Draw', 'Record', 'Help', 'Home']:
        a.clic('fila:' + f)
        r[f] = len([t for t in a.tinte() if t.startswith(('panglica:' + f, 'meniu_derulant:' + f, 'lansator:' + f))]) or len(a.tinte('meniu:'))
    a.ev0()
    for z in ['diapozitiv', 'zona_note', 'bara_stare:Language']:
        a.clic(z)
    b = a.bbox('miniatura:3'); a.pg.mouse.click(b['x'] + b['w'] / 2, b['y'] + b['h'] + 60); a.pg.wait_for_timeout(250)
    r['ev_zone'] = a.ev(); r['mesaje'] = a.mesaje()
    return r


@test('F077_undo')
def f077(ctx, port):
    a = pp(ctx, port); r = {}
    a.clic('forma:1/1'); a.taste('End'); a.scrie('X')
    a.clic('margine_forma:1/1'); a.clic('panglica:Home/Font/Bold')
    a.clic('miniatura:1'); a.clic('panglica:Home/Slides/New Slide')
    st = lambda: [a.stare()['diapozitive'][0]['texte'][0], a.stare()['formatare_pe_caractere'] and a.stare()['formatare_pe_caractere'][0].get('bold'), len(a.stare()['diapozitive'])]
    a.clic('miniatura:1'); r['dupa_3_pasi'] = st()
    a.taste('Control+z'); r['z1'] = st()
    a.taste('Control+z'); r['z2'] = st()
    a.clic('acces_rapid:Undo'); r['qat_undo'] = st()
    a.clic('acces_rapid:Undo'); r['qat_undo_gol'] = [st(), a.mesaje()]
    r['qat_undo_html'] = html(a, 'acces_rapid:Undo', 300)
    return r


@test('F080_F082_file')
def fisier(ctx, port):
    a = pp(ctx, port); r = {}
    a.taste('Control+n'); s = a.stare(); r['ctrl_n'] = [s['prezentari_deschise'], s['prezentare_activa'], [d['aspect'] for d in s['diapozitive']], [d['texte'] for d in s['diapozitive']]]
    a.clic('fila:File'); r['backstage_tinte'] = a.tinte('backstage:'); r['pagina'] = a.stare()['backstage']
    for p in ['Home', 'New', 'Open', 'Info', 'Save', 'Save As']:
        t = 'backstage:' + p
        if a.exista(t):
            a.clic(t); r['pag_' + p] = [a.stare()['backstage'], a.stare()['dialog'] and a.stare()['dialog'].get('titlu'), a.mesaje()[-1:]]
            if a.stare()['dialog']:
                a.taste('Escape')
        else:
            r['pag_' + p] = 'lipsa'
    a.clic('backstage:New') if a.exista('backstage:New') else None
    bl = [t for t in a.tinte() if 'Blank Presentation' in t]
    r['blank_tinte'] = bl
    if bl:
        a.clic(bl[0]); s = a.stare(); r['blank'] = [s['prezentari_deschise'], s['prezentare_activa'], s['backstage'], [d['aspect'] for d in s['diapozitive']]]
    a.clic('fila:File'); a.taste('Escape'); r['esc'] = a.stare()['backstage']
    a.clic('fila:File'); back = [t for t in a.tinte() if 'Back' in t]; r['back_tinte'] = back
    if back:
        a.clic(back[0]); r['back'] = a.stare()['backstage']
    a.clic('fila:File')
    if a.exista('backstage:Close'):
        a.clic('backstage:Close'); s = a.stare(); r['close'] = [s['prezentari_deschise'], s['prezentare_activa'], s['dialog'] and s['dialog'].get('titlu')]
    r['mesaje'] = a.mesaje()
    return r


@test('F099_F102_atelier')
def atelier(ctx, port):
    # nu există atelierul „repară diapozitivul” în bibliotecă; joc drumul PowerPoint cel mai apropiat:
    # culoarea textului = Font Color pe fiecare casetă; un rând scos = îl alegi și îl ștergi (Ctrl+Z îl aduce înapoi)
    a = pp(ctx, port, {'diapozitive': [{'aspect': 'Title and Content', 'texte': ['Vulcanii', 'Lava\nCenusa\nGlume']}]})
    a.clic('margine_forma:1/1'); a.clic('meniu_derulant:Home/Font/Font Color'); a.clic('meniu:Yellow')
    a.clic('margine_forma:1/2'); a.clic('meniu_derulant:Home/Font/Font Color'); a.clic('meniu:Yellow')
    r = {'culoare_continut': a.stare()['culoare_text']}
    a.clic('margine_forma:1/1'); r['culoare_titlu'] = a.stare()['culoare_text']
    a.clic('forma:1/2'); a.taste('Control+End'); a.taste('Shift+Home'); a.taste('Backspace'); a.taste('Backspace')
    r['rand_scos'] = a.stare()['diapozitive'][0]['texte']
    a.taste('Control+z'); a.taste('Control+z'); r['rand_inapoi'] = a.stare()['diapozitive'][0]['texte']
    r['atelier_in_biblioteca'] = [t for t in a.tinte() if any(k in t.lower() for k in ['textul', 'fundalul', 'păstrez', 'scot'])]
    return r


if __name__ == '__main__':
    ruleaza('rez4')
