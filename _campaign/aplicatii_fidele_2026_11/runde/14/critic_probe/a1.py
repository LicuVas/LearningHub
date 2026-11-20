# -*- coding: utf-8 -*-
"""Criticul 14 · A: T1 (ferestrele din taste), T2 (Shape Format J D), T4 (Esc = tasta_esc) cu gesturi adevărate, 1366×768.
Pe lângă ce spun constructorii: focusul DUPĂ ce fereastra se închide (Ctrl+Z / tastarea mai merg?), insignele KeyTips după Alt+literă."""
import json, sys, os, traceback
sys.path.insert(0, os.path.dirname(__file__))
from k import *

R = {}
STAR = {'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']},
                     {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [STAR]},
                     {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1,
     'fisiere': [{'nume': 'Plante_6A_Pop.pptx', 'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Plante']}]}]}


def fx(nume, f, cont=C, app='powerpoint'):
    try:
        pg = H.app(app, cont)
        R[nume] = f(pg)
        pg.close()
    except Exception:
        R[nume] = {'eroare': traceback.format_exc()[-600:]}


def P(pg, k):
    """o tastă: evenimentele ei (felul, acțiunea, ținta, activat), focusul, ferestrele, insignele"""
    if isinstance(k, tuple):
        pg.keyboard.type(k[1]); pg.wait_for_timeout(120)
    else:
        pg.keyboard.press(k); pg.wait_for_timeout(110)
    f = foc(pg) or {}
    return {'k': k if not isinstance(k, tuple) else 'type:' + k[1], 'ev': [(e['g'], e['a'], e['t'], e['act']) for e in ev(pg)],
            'foc': [f.get('tag'), f.get('supr'), f.get('tinta'), f.get('inRoot'), f.get('val')], 'dlg': dlg(pg), 'kt': kt(pg)[:6]}


def dupa_inchidere(pg):
    """după ce fereastra s-a închis: unde e focusul și dacă Ctrl+Z mai ajunge la aplicație"""
    f = foc(pg) or {}
    pg.keyboard.press('Control+z'); pg.wait_for_timeout(120)
    e = [(x['g'], x['a']) for x in ev(pg)]
    return {'foc': [f.get('tag'), f.get('cls'), f.get('inRoot')], 'ctrl_z': e}


with Ham() as H:
    # ---- T1 Open
    def t1_open(pg):
        taste(pg, 'Control+o'); clic(pg, 'backstage:Browse'); ev(pg)
        o = {'la_deschidere': foc(pg)}
        o['pasi'] = [P(pg, k) for k in ['Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab', 'Alt+n', ('t', 'Plante_6A_Pop.pptx'), 'Alt+o']]
        o['st'] = S(pg, 'prezentare_activa', 'prezentari_deschise', 'dialog')
        o['dupa'] = dupa_inchidere(pg)
        return o
    fx('t1_open', t1_open)

    # ---- T1 Save your changes: Alt+N (Don't Save), Alt+S (Save), Tab..Cancel+Enter, Esc
    def modif(pg):
        clic(pg, 'forma:1/1'); pg.keyboard.type('X'); pg.wait_for_timeout(80); taste(pg, 'Control+w'); ev(pg)

    def sc_altn(pg):
        modif(pg); o = {'la_deschidere': foc(pg), 'pasi': [P(pg, 'Alt+n')]}
        o['st'] = S(pg, 'prezentare_activa', 'prezentari_deschise', 'dialog'); o['titlu'] = pg.title()
        return o
    fx('t1_sc_alt_n', sc_altn)

    def sc_alts(pg):
        modif(pg); o = {'pasi': [P(pg, 'Alt+s')]}
        o['st'] = S(pg, 'prezentare_activa', 'prezentari_deschise', 'dialog', 'nume_fisier')
        return o
    fx('t1_sc_alt_s', sc_alts)

    def sc_tab(pg):
        modif(pg); o = {'pasi': [P(pg, k) for k in ['Tab'] * 7]}
        # Tab până la Cancel, apoi Enter
        for i in range(8):
            f = foc(pg) or {}
            if f.get('tinta') == 'fereastra:Cancel':
                break
            pg.keyboard.press('Tab'); pg.wait_for_timeout(90)
        ev(pg)
        o['enter_pe'] = (foc(pg) or {}).get('tinta'); o['enter'] = P(pg, 'Enter')
        o['st'] = S(pg, 'prezentari_deschise', 'dialog', 'diapozitive')
        o['dupa'] = dupa_inchidere(pg)
        return o
    fx('t1_sc_tab_cancel', sc_tab)

    def sc_esc(pg):
        modif(pg); o = {'esc': P(pg, 'Escape'), 'st': S(pg, 'prezentari_deschise', 'dialog')}
        o['dupa'] = dupa_inchidere(pg)
        pg.keyboard.type('Q'); pg.wait_for_timeout(100)
        o['tastare_dupa'] = [(x['g'], x['a']) for x in ev(pg)]
        o['titlu_text'] = S(pg, 'diapozitive')['diapozitive'][0]
        return o
    fx('t1_sc_esc', sc_esc)

    # ---- T1 Insert Picture
    def pic(pg):
        o = {'pasi': [P(pg, k) for k in ['Alt', 'n', 'p', 'd']]}
        o['la_deschidere'] = foc(pg)
        o['pasi2'] = [P(pg, k) for k in ['Tab', 'Tab', 'Alt+n', ('t', 'pamant.png'), 'Alt+o']]
        o['st'] = S(pg, 'forme_diapozitiv', 'dialog')
        o['dupa'] = dupa_inchidere(pg)
        o['st2'] = S(pg, 'forme_diapozitiv')
        return o
    fx('t1_picture', pic)

    # ---- T1 Save As F12
    def sa(pg):
        taste(pg, 'F12'); ev(pg)
        o = {'la_deschidere': foc(pg), 'pasi': [P(pg, k) for k in ['Tab', 'Tab', 'Alt+n', ('t', 'Vulcanii'), 'Alt+s']]}
        o['st'] = S(pg, 'nume_fisier', 'dialog', 'prezentare_activa'); o['titlu_bara'] = pg.evaluate("(()=>{const t=document.querySelector('[data-lh-aplicatie=\"powerpoint\"] [data-lh-suprafata=\"bara_titlu\"]');return t?t.innerText.replace(/\\n/g,' | ').slice(0,120):null})()")
        o['dupa'] = dupa_inchidere(pg)
        return o
    fx('t1_saveas', sa)

    # ---- T1 Font / Paragraph
    def fnt(pg):
        clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1'); clic(pg, 'lansator:Home/Font'); pg.wait_for_timeout(150); ev(pg)
        o = {'la_deschidere': foc(pg), 'pasi': [P(pg, k) for k in ['Alt+s', ('t', '40'), 'Enter']]}
        o['st'] = S(pg, 'formatare_text', 'dialog')
        o['dupa'] = dupa_inchidere(pg)
        o['st_dupa_z'] = S(pg, 'formatare_text')
        return o
    fx('t1_font', fnt)

    def fnt_tab(pg):
        clic(pg, 'forma:1/1'); clic(pg, 'margine_forma:1/1'); clic(pg, 'lansator:Home/Font'); pg.wait_for_timeout(150); ev(pg)
        p = [P(pg, 'Tab') for _ in range(14)]
        o = {'ordine': [x['foc'][2] or x['foc'][0] for x in p], 'toate_in': all(x['foc'][1] == 'dialog.FontDialogPowerPoint' for x in p)}
        o['esc'] = P(pg, 'Escape'); o['dupa'] = dupa_inchidere(pg)
        return o
    fx('t1_font_tab', fnt_tab)

    def par(pg):
        clic(pg, 'forma:1/1'); clic(pg, 'lansator:Home/Paragraph'); pg.wait_for_timeout(150); ev(pg)
        o = {'la_deschidere': foc(pg), 'pasi': [P(pg, k) for k in ['Alt+g', 'Tab', 'Alt+q', 'Escape']]}
        o['dupa'] = dupa_inchidere(pg)
        return o
    fx('t1_paragraph', par)

    # ---- T2 Shape Format
    def t2(pg):
        clic(pg, 'miniatura:2'); clic(pg, 'forma:2/2'); ev(pg)
        o = {'sel': S(pg, 'selectie_forma')}
        o['pasi'] = [P(pg, k) for k in ['Alt', 'j', 'd', 's', 'f']]
        o['lista_sf'] = men(pg)
        o['esc1'] = P(pg, 'Escape')
        o['pasi_so'] = [P(pg, k) for k in ['s', 'o', 'w']]
        o['lista_w'] = men(pg)
        o['litera_x'] = P(pg, 'x')
        o['jos'] = [P(pg, k) for k in ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown', 'Enter']]
        o['st'] = S(pg, 'forme_diapozitiv', 'umplere_forme')
        o['dupa'] = [P(pg, k) for k in ['Escape', 'Escape', 'Escape']]
        o['text_stea'] = S(pg, 'forme_diapozitiv')['forme_diapozitiv'][1]
        return o
    fx('t2_jd', t2)

    def t2_sf_yellow(pg):
        clic(pg, 'miniatura:2'); clic(pg, 'forma:2/2'); ev(pg)
        o = {'pasi': [P(pg, k) for k in ['Alt', 'j', 'd', 's', 'f']], 'lista': men(pg)}
        # Yellow = rândul standard; cu săgețile până la Yellow (nu știm câte) → clic cu mouse-ul pe meniu:Yellow
        clic(pg, 'meniu:Yellow'); o['ev_yellow'] = [(e['g'], e['a'], e['t']) for e in ev(pg)]
        o['st'] = S(pg, 'umplere_forme')['umplere_forme'][1]
        o['dupa'] = dupa_inchidere(pg); o['st_z'] = S(pg, 'umplere_forme')['umplere_forme'][1]
        o['kt_dupa'] = kt(pg)
        return o
    fx('t2_sf_yellow', t2_sf_yellow)

    # ---- T4 Esc
    def t4(app, cont):
        def f(pg):
            if app == 'powerpoint':
                clic(pg, 'forma:1/1')
            ev(pg)
            return [P(pg, k) for k in ['Alt', 'h', 'Escape', 'Escape', 'Alt', 'Alt']]
        return f
    fx('t4_ppt', t4('powerpoint', C))
    fx('t4_word', t4('word', None), cont=None, app='word')
    fx('t4_excel', t4('excel', None), cont=None, app='excel')

    def t4_as(pg):
        clic(pg, 'miniatura:2'); clic(pg, 'forma:2/2'); ev(pg)
        pg.evaluate("t=>{window.__as=LH.aplicatii.asistent('powerpoint',{pasi:[{tinta:t,indiciu:'Aici'}],dupaGreseli:2,dupaSecunde:600})}", 'meniu:Yellow')
        p = [P(pg, k) for k in ['Alt', 'Escape', 'Alt', 'h', 'Escape', 'Escape', 'Alt', 'j', 'd', 's', 'f']]
        n1 = pg.evaluate("document.querySelectorAll('[data-lh-indiciu]').length")
        # două greșeli adevărate: clic gol pe diapozitiv de două ori
        taste(pg, 'Escape', 'Escape', 'Escape'); ev(pg)
        return {'pasi': [x['ev'] for x in p], 'indicii_dupa_navigare': n1}
    fx('t4_asistent', t4_as)
    R['plecate'] = H.plecate
    R['erori'] = H.erori
scrie(R, 'a1_out.json')
print('gata', len(json.dumps(R)))
