# -*- coding: utf-8 -*-
"""Partea A (1): N4 (drumurile m1-l03 prin fereastra Open), T1 (F12 pe document salvat), T2 (nume existent), T3 (zona PDF).
Gesturi reale: page.keyboard / page.mouse. Iesirea: ra5.json."""
from h5 import *


def tinta_cu(pg, prefix, cuvant):
    t = pg.evaluate("() => LH.aplicatii.tinte('word')")
    c = [x for x in t if x.startswith(prefix) and cuvant in x]
    return c[0] if c else None


def dublu(pg, tinta):
    r = rect(pg, tinta)
    if not r:
        return 'LIPSA ' + tinta
    pg.mouse.dblclick(r[0] + r[2] / 2, r[1] + r[3] / 2)
    pg.wait_for_timeout(300)
    return r


s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)
    FIS_240 = [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB}, ORAR_ANA]

    # ---------------- N4: m1-l03:240-242 (N1P6E1) Ctrl+O > Browse > Descarcari > fisa > Open, cu mouse-ul
    def n4_240(cum):
        def f():
            deschide(pg, {'paragrafe': [''], 'fisiere': FIS_240})
            pg.keyboard.press('Control+w'); pg.wait_for_timeout(250)
            a = scurt(pg)
            pg.keyboard.press('Control+o'); pg.wait_for_timeout(350)
            br = tinta_cu(pg, 'backstage:', 'Browse')
            ct(pg, br); pg.wait_for_timeout(350)
            d0 = dlg(pg)
            ct(pg, 'arbore:Descărcări'); pg.wait_for_timeout(250)
            d1 = dlg(pg)
            if cum == 'clic_open':
                ct(pg, 'lista:club-lectura.docx'); d2 = dlg(pg)
                ct(pg, 'fereastra:Open')
            elif cum == 'dublu':
                d2 = None; dublu(pg, 'lista:club-lectura.docx')
            elif cum == 'enter':
                ct(pg, 'lista:club-lectura.docx'); d2 = dlg(pg); pg.keyboard.press('Enter')
            elif cum == 'alt_o':
                ct(pg, 'lista:club-lectura.docx'); d2 = dlg(pg); pg.keyboard.press('Alt+o')
            elif cum == 'scris':
                ct(pg, 'camp:nume_fisier'); pg.keyboard.type('club-lectura'); d2 = dlg(pg); pg.keyboard.press('Enter')
            pg.wait_for_timeout(300)
            x = scurt(pg)
            return {'fara_doc': {k: a[k] for k in ('docs', 'titlu')}, 'browse': br, 'dlg_deschis': d0, 'dupa_descarcari': d1, 'dupa_alegere': d2,
                    'final': {k: x[k] for k in ('nume', 'folder', 'text', 'ecran', 'docs', 'titlu', 'msg', 'dlg', 'bs')}, 'ev': evt(pg)[-6:],
                    'titlu_ecran': titlu_ecran(pg)}
        return f
    for cum in ('clic_open', 'dublu', 'enter', 'alt_o', 'scris'):
        caz('n4_240_' + cum, n4_240(cum))

    # ---------------- N4: :86 dupa Ctrl+W: Open > Browse > Documente > fisierul tau > Open; apoi Ctrl+W
    def n4_86():
        deschide(pg, {'paragrafe': ORAR + ['Marți am sport.'], 'nume': 'Pop_Mihai_7A_orar', 'folder': 'Documente', 'salvat': True, 'modificat': False,
                      'fisiere': [ORAR_ANA]})
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(250)
        pg.keyboard.press('Control+o'); pg.wait_for_timeout(350)
        ct(pg, tinta_cu(pg, 'backstage:', 'Browse')); pg.wait_for_timeout(300)
        ct(pg, 'arbore:Documente'); d1 = dlg(pg)
        ct(pg, 'lista:Pop_Mihai_7A_orar.docx'); ct(pg, 'fereastra:Open')
        x = scurt(pg)
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(200)
        y = scurt(pg)
        return {'documente': d1, 'deschis': {k: x[k] for k in ('nume', 'folder', 'text', 'docs', 'titlu', 'msg')}, 'dupa_ctrlw': {k: y[k] for k in ('docs', 'titlu', 'msg')}}
    caz('n4_86', n4_86)

    # ---------------- N4: atelierul :262-290, drumul solutiei, cu gesturi reale
    def n4_atelier():
        fis = [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB},
               {'folder': 'Documente', 'nume': 'Popescu_Ana_7A_club', 'text': CLUB[:3] + ['Numele meu: Ana Popescu']}]
        deschide(pg, {'paragrafe': [''], 'fisiere': fis, 'recente': [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_club'}]})
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(250)
        pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
        ct(pg, tinta_cu(pg, 'backstage:', 'Browse')); pg.wait_for_timeout(300)
        ct(pg, 'arbore:Descărcări'); ct(pg, 'lista:club-lectura.docx'); ct(pg, 'fereastra:Open'); pg.wait_for_timeout(250)
        o = scurt(pg)
        pg.keyboard.press('Control+End'); pg.keyboard.type(' Pop Mihai'); pg.wait_for_timeout(150)
        pg.keyboard.press('F12'); pg.wait_for_timeout(350)
        f12 = dlg(pg)
        ct(pg, 'arbore:Documente'); f12b = dlg(pg)
        ct(pg, 'camp:nume_fisier'); pg.keyboard.press('Control+a'); pg.keyboard.type('Pop_Mihai_7A_club'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
        s1 = scurt(pg)
        pg.keyboard.press('F12'); pg.wait_for_timeout(350)
        f12c = dlg(pg)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)'); pg.wait_for_timeout(200)
        pdfd = dlg(pg)
        ct(pg, 'dialog_salvare:Save'); pg.wait_for_timeout(300)
        s2 = scurt(pg)
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
        s3 = scurt(pg)
        return {'deschis': {k: o[k] for k in ('nume', 'folder', 'docs', 'titlu')}, 'f12_initial': f12, 'f12_dupa_documente': f12b,
                'dupa_save_docx': {k: s1[k] for k in ('nume', 'folder', 'titlu', 'fisiere', 'msg')}, 'f12_a_doua': f12c, 'pdf_dlg': pdfd,
                'dupa_pdf': {k: s2[k] for k in ('nume', 'salvate', 'fisiere', 'msg')}, 'dupa_ctrlw': {k: s3[k] for k in ('docs', 'titlu', 'msg', 'dlg', 'dialog')},
                'ev': evt(pg)[-8:]}
    caz('n4_atelier', n4_atelier)

    # ---------------- N4: Open, apoi Cancel / Esc / inchidere; bara de adrese la a doua navigare
    def n4_cancel_esc():
        out = {}
        for cum in ('Cancel', 'Escape', 'Închidere'):
            deschide(pg, {'paragrafe': ['Ana'], 'fisiere': FIS_240})
            pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
            ct(pg, tinta_cu(pg, 'backstage:', 'Browse')); pg.wait_for_timeout(300)
            if cum == 'Escape':
                pg.keyboard.press('Escape')
            else:
                ct(pg, 'fereastra:' + cum)
            pg.wait_for_timeout(250)
            x = scurt(pg)
            out[cum] = {k: x[k] for k in ('dlg', 'bs', 'docs', 'text', 'msg')}
            out[cum]['ev'] = evt(pg)[-1:]
        return out
    caz('n4_cancel_esc', n4_cancel_esc)

    # ---------------- T1: m1-l03:189-192 (N1P4E1) Ctrl+S, apoi F12 > PDF, „lasa acelasi nume”
    def t1_189():
        deschide(pg, {'paragrafe': ORAR + ['Marți: sport'], 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'modificat': True, 'fisiere': [ORAR_ANA]})
        pg.keyboard.press('Control+s'); pg.wait_for_timeout(250)
        a = scurt(pg)
        pg.keyboard.press('F12'); pg.wait_for_timeout(350)
        d = dlg(pg)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)'); pg.wait_for_timeout(200)
        d2 = dlg(pg)
        ct(pg, 'dialog_salvare:Save'); pg.wait_for_timeout(300)
        x = scurt(pg)
        return {'dupa_ctrls': {k: a[k] for k in ('fisiere', 'msg', 'dlg')}, 'f12': {k: d[k] for k in ('nume_box', 'adr')}, 'dupa_pdf': {k: d2[k] for k in ('nume_box', 'sup', 'tip')},
                'final': {k: x[k] for k in ('nume', 'folder', 'salvate', 'fisiere', 'titlu', 'msg')}}
    caz('t1_189', t1_189)

    # T1, mai greu: document salvat de elev (F12 > nume > Enter), modificat, apoi F12 iar; si unul deschis din Open
    def t1_greu():
        deschide(pg, {'paragrafe': ['Tema de azi', 'Scriu ceva.']})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pg.keyboard.press('Control+a'); pg.keyboard.type('Ion_Pop_7A_tema'); pg.keyboard.press('Enter'); pg.wait_for_timeout(250)
        pg.keyboard.press('Control+End'); pg.keyboard.type(' Mai mult.')
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        a = dlg(pg)
        pg.keyboard.press('Escape'); pg.wait_for_timeout(150)
        deschide(pg, {'paragrafe': [''], 'fisiere': FIS_240})
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
        ct(pg, 'arbore:Descărcări'); dublu(pg, 'lista:club-lectura.docx')
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        b_ = dlg(pg)
        return {'salvat_de_elev_f12': {k: a[k] for k in ('nume_box', 'adr')}, 'deschis_din_descarcari_f12': {k: b_[k] for k in ('nume_box', 'adr', 'nav')},
                'stare_doc': {k: scurt(pg)[k] for k in ('nume', 'folder')}}
    caz('t1_greu', t1_greu)

    # ---------------- T2: m1-l03:167-172 (N1P3E2) numele colegei
    def t2_167():
        deschide(pg, {'paragrafe': ['Orarul meu', 'Luni: sport, TIC, istorie'], 'modificat': True, 'fisiere': [ORAR_ANA]})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pg.keyboard.press('Control+a'); pg.keyboard.type('Popescu_Ana_7A_orar'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
        a = scurt(pg); ad = dlg(pg); ea = evt(pg)[-1:]
        msg_html = pg.evaluate("() => [...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(m => [m.getAttribute('data-lh-nesimulat'), m.getAttribute('role'), m.textContent.trim()])")
        ct(pg, 'dialog_salvare:Save'); pg.wait_for_timeout(250)
        b2 = scurt(pg)
        # recuperarea din lectie (:82): o cifra la capatul numelui, apoi iar Save
        ct(pg, 'camp:nume_fisier'); pg.keyboard.press('End'); pg.keyboard.press('Backspace'); pg.keyboard.press('Backspace'); pg.keyboard.press('Backspace'); pg.keyboard.press('Backspace'); pg.keyboard.press('Backspace')
        nb = dlg(pg)['nume_box']
        pg.keyboard.type('1'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
        c = scurt(pg)
        return {'prima': {k: a[k] for k in ('fisiere', 'msg', 'dlg', 'nume', 'salvate', 'dialog')}, 'msg_atribute': msg_html, 'ev': ea, 'dlg_dupa': {k: ad[k] for k in ('sup', 'nume_box')},
                'a_doua_save': {k: b2[k] for k in ('msg', 'dlg', 'fisiere')}, 'nume_box_inainte_de_cifra': nb,
                'dupa_cifra': {k: c[k] for k in ('nume', 'folder', 'fisiere', 'titlu', 'dlg', 'msg', 'salvate')}}
    caz('t2_167', t2_167)

    def t2_variante():
        out = {}
        # litere mici + .docx scris
        for nume in ('popescu_ana_7a_orar', 'Popescu_Ana_7A_orar.docx', 'Popescu_Ana_7A_orar '):
            deschide(pg, {'paragrafe': ['Orarul meu', 'Luni: sport'], 'modificat': True, 'fisiere': [ORAR_ANA]})
            pg.keyboard.press('F12'); pg.wait_for_timeout(300)
            pg.keyboard.press('Control+a'); pg.keyboard.type(nume); pg.keyboard.press('Enter'); pg.wait_for_timeout(250)
            x = scurt(pg)
            out['f12:' + nume] = {k: x[k] for k in ('fisiere', 'msg', 'dlg', 'nume')}
        # Ctrl+S (Save this file) cu numele colegei
        deschide(pg, {'paragrafe': ['Orarul meu', 'Luni: sport'], 'modificat': True, 'fisiere': [ORAR_ANA]})
        pg.keyboard.press('Control+s'); pg.wait_for_timeout(300)
        pg.keyboard.press('Control+a'); pg.keyboard.type('Popescu_Ana_7A_orar'); pg.keyboard.press('Enter'); pg.wait_for_timeout(250)
        x = scurt(pg); out['ctrls'] = {k: x[k] for k in ('fisiere', 'msg', 'dlg', 'nume')}
        # Ctrl+W > Save your changes > Save cu numele colegei
        deschide(pg, {'paragrafe': ['Orarul meu', 'Luni: sport'], 'modificat': True, 'fisiere': [ORAR_ANA]})
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
        ct(pg, 'camp:nume_fisier'); pg.keyboard.press('Control+a'); pg.keyboard.type('Popescu_Ana_7A_orar')
        ct(pg, 'fereastra:Save'); pg.wait_for_timeout(250)
        x = scurt(pg); out['ctrlw_save'] = {k: x[k] for k in ('fisiere', 'msg', 'dlg', 'nume', 'docs', 'dialog')}
        # PDF peste un PDF existent (lectia :85 / :159 „You already have a file named…”)
        deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': [ORAR_ANA, {'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar.pdf', 'text': ['vechi']}]})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)'); ct(pg, 'dialog_salvare:Save'); pg.wait_for_timeout(250)
        x = scurt(pg); out['pdf_peste_pdf'] = {k: x[k] for k in ('fisiere', 'msg', 'dlg', 'salvate')}
        # documentul salvat, F12, Enter pe propriul nume
        deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': [ORAR_ANA]})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300); pg.keyboard.press('Enter'); pg.wait_for_timeout(250)
        x = scurt(pg); out['f12_enter_propriul_nume'] = {k: x[k] for k in ('fisiere', 'msg', 'dlg', 'nume')}
        return out
    caz('t2_variante', t2_variante)

    # ---------------- T3: zona PDF
    def t3_pdf():
        deschide(pg, {'paragrafe': ['Orar', 'Luni']})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)'); pg.wait_for_timeout(250)
        d0 = dlg(pg)
        pg.screenshot(path=OUT + 't3_pdf.png')
        golev(pg)
        pas = {}
        for k in ('Alt+e', 'Alt+m', 'Alt+a', 'Alt+o'):
            pg.keyboard.press(k); pg.wait_for_timeout(200)
            dd = dlg(pg)
            pas[k] = {'ctl': dd['ctl'] if dd else None, 'ev': evt(pg)[-1:], 'msg': obs(pg)['msg'], 'sup': dd['sup'] if dd else None}
        # clic pe bifa si pe radio
        golev(pg)
        ct(pg, 'fereastra:Open file after publishing'); c1 = dlg(pg)
        ct(pg, 'fereastra:Minimum size (publishing online)'); c2 = dlg(pg)
        ev = evt(pg)
        ct(pg, 'dialog_salvare:Save'); pg.wait_for_timeout(300)
        x = scurt(pg)
        return {'dupa_pdf': d0, 'taste': pas, 'clic_bifa': c1['ctl'] if c1 else None, 'clic_radio': c2['ctl'] if c2 else None, 'ev_clic': ev,
                'final': {k: x[k] for k in ('salvate', 'fisiere', 'nume', 'msg', 'dlg')}}
    caz('t3_pdf', t3_pdf)

    def t3_inapoi_docx_si_folder():
        deschide(pg, {'paragrafe': ['Orar'], 'fisiere': FIS_240})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        ct(pg, 'arbore:Descărcări'); a = dlg(pg)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)'); pg.wait_for_timeout(200)
        b_ = dlg(pg)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:Word Document (*.docx)'); pg.wait_for_timeout(200)
        c = dlg(pg)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)'); pg.wait_for_timeout(200)
        ct(pg, 'dialog_salvare:Save'); pg.wait_for_timeout(250)
        x = scurt(pg)
        return {'descarcari': {k: a[k] for k in ('adr', 'nav')}, 'pdf': {k: b_[k] for k in ('sup', 'adr', 'nav', 'ctl')}, 'docx_iar': {k: c[k] for k in ('sup', 'ctl', 'adr')},
                'final': {k: x[k] for k in ('salvate', 'fisiere')}}
    caz('t3_inapoi_docx_si_folder', t3_inapoi_docx_si_folder)

    ctx.close(); b.close()
s.shutdown()
salveaza(R, OUT + 'ra5.json')
print('gata')
