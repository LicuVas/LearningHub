# -*- coding: utf-8 -*-
"""Partea A (N4: drumurile lecției m1-l03, cu parametrii noi de conținut) + partea B (unghiul gest_tastatura):
taste, scurtături, taste de acces, Tab/Esc/Enter/Alt+↓ în ferestrele și listele noi, unde stă focusul, evenimentele §4
și asistentul §6.3. Gesturi reale: page.keyboard / page.mouse. Fiecare caz e izolat (try/except)."""
import json, sys, traceback
sys.path.insert(0, r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe")
from h4 import *
OUT = r"C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/4/critic_probe/"
R = {}
ORAR = ['Orarul meu', 'Luni: română, matematică, TIC']
ORAR_ANA = {'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar', 'text': ORAR}
K = ('text', 'nume', 'folder', 'salvate', 'fisiere', 'recente', 'dialog', 'docs', 'titlu', 'bs', 'tip_afisat', 'focus', 'msg', 'dlg',
     'lista', 'font_box', 'tip_box', 'nume_box', 'keytips', 'pas', 'indicii', 'fmt')


def o(pg, *chei):
    x = obs(pg)
    x['ev'] = evt(pg)
    return {k: x[k] for k in (chei or K + ('ev',))}


def caz(nume, fn):
    try:
        R[nume] = fn()
    except Exception as e:
        R[nume] = {'EROARE': repr(e), 'tb': traceback.format_exc()[-800:]}


s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)

    # ======================= N4: drumurile lecției m1-l03 =======================
    def n4_127():
        deschide(pg, {'paragrafe': ORAR, 'fisiere': [{'folder': 'Descărcări', 'nume': 'orar-model', 'text': ['Orar-model']}]})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        a = o(pg, 'nume_box', 'focus')
        pg.keyboard.press('Control+a'); pg.keyboard.type('Popescu_Ana_7A_orar'); pg.keyboard.press('Enter'); pg.wait_for_timeout(50)
        r = o(pg, 'nume', 'folder', 'titlu', 'fisiere', 'focus', 'ev')
        return {'la_f12': a, 'dupa_enter': r}
    caz('n4_127_f12_nume_enter', n4_127)

    def n4_143():
        deschide(pg, {'paragrafe': ['Poezia mea', 'Toamna vine cu frunze ruginii.']})
        pg.keyboard.press('Control+s'); pg.wait_for_timeout(300)
        a = o(pg, 'dlg', 'nume_box', 'focus')
        pg.keyboard.type('Marin_Ioana_7B_poezie'); pg.keyboard.press('Enter'); pg.wait_for_timeout(50)
        return {'la_ctrls': a, 'dupa': o(pg, 'nume', 'folder', 'titlu', 'fisiere', 'focus', 'ev')}
    caz('n4_143_ctrls_nou', n4_143)

    def n4_167():
        deschide(pg, {'paragrafe': ['Orarul meu', 'Luni: sport, TIC, istorie'], 'fisiere': [ORAR_ANA]})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pg.keyboard.press('Control+a'); pg.keyboard.type('Popescu_Ana_7A_orar'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
        return o(pg, 'nume', 'fisiere', 'dlg', 'dialog', 'msg', 'titlu', 'ev')
    caz('n4_167_nume_colega_existent', n4_167)

    def n4_189():
        deschide(pg, {'paragrafe': ORAR + ['Marți: sport'], 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'modificat': True, 'fisiere': [ORAR_ANA]})
        a = o(pg, 'nume', 'folder', 'titlu', 'fisiere')
        pg.keyboard.press('Control+s'); pg.wait_for_timeout(200)
        b1 = o(pg, 'nume', 'fisiere', 'dlg', 'ev')
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        c = o(pg, 'nume_box', 'tip_box', 'focus')
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)')
        ct(pg, 'dialog_salvare:Save')   # „lasă același nume și apasă Salvare” (m1-l03:85)
        d = o(pg, 'nume', 'salvate', 'fisiere', 'titlu', 'dlg', 'msg')
        return {'start': a, 'dupa_ctrls': b1, 'f12_propune': c, 'dupa_pdf_acelasi_nume': d}
    caz('n4_189_ctrls_apoi_pdf', n4_189)

    def n4_212(cum):
        def f():
            deschide(pg, {'paragrafe': ORAR + ['Miercuri: desen'], 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'modificat': True,
                          'fisiere': [ORAR_ANA, {'folder': 'Documente', 'nume': 'Popescu_Ana_7B_orar', 'text': ['Orarul Anei din 7B', 'Luni: fizică, chimie']}],
                          'recente': [{'folder': 'Documente', 'nume': 'Popescu_Ana_7B_orar'}, {'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar'}]},
                     asistent={'pasi': [{'tinta': 'fereastra:Save'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
            pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
            a = o(pg, 'dlg', 'dialog', 'nume_box', 'focus', 'ev')
            if cum == 'clic':
                ct(pg, 'fereastra:Save')
            elif cum == 'enter':
                pg.keyboard.press('Enter')
            else:
                pg.keyboard.press('Alt+s')
            pg.wait_for_timeout(200)
            b1 = o(pg, 'text', 'docs', 'titlu', 'fisiere', 'dialog', 'focus', 'pas', 'ev', 'dlg')
            pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
            rr = pg.evaluate("""() => [...document.querySelectorAll('[data-lh-id-mso="GroupRecentDocuments"] [data-lh-tip="ListItem"]')].filter(x => getComputedStyle(x).display !== 'none').map(x => x.innerText.trim() + ' @' + x.getAttribute('data-lh-tinta'))""")
            pg.screenshot(path=OUT + 'n4_212_recent_' + cum + '.png')
            ct(pg, 'backstage:Popescu_Ana_7A_orar')
            c = o(pg, 'text', 'nume', 'docs', 'titlu', 'bs', 'ev')
            return {'dupa_ctrlw': a, 'dupa_save': b1, 'randuri_recent': rr, 'dupa_clic_7A': c}
        return f
    for cum in ('clic', 'enter', 'alt_s'):
        caz('n4_212_' + cum, n4_212(cum))

    def n4_x():
        deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente'})
        ct(pg, 'bara_titlu:Close')
        return o(pg, 'docs', 'titlu', 'text', 'dlg', 'msg', 'ev')
    caz('n4_x_salvat', n4_x)

    def n4_browse():
        deschide(pg, {'paragrafe': [''], 'fisiere': [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': ['Club']}]})
        pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
        ct(pg, 'backstage:Browse')
        a = o(pg, 'dlg', 'msg', 'bs', 'ev')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
        return {'browse': a, 'ctrl_f12': o(pg, 'dlg', 'msg', 'bs', 'ev')}
    caz('n4_browse_open', n4_browse)

    # ======================= B: gest_tastatura =======================
    def b_fs_altjos():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}},
                 asistent={'pasi': [{'tinta': 'meniu:20'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
        ct(pg, 'panglica:Home/Font/Font Size', 0.3, 0.5)
        pg.keyboard.press('Alt+ArrowDown'); pg.wait_for_timeout(150)
        a = o(pg, 'lista', 'focus', 'font_box', 'indicii', 'pas')
        for _ in range(5):
            pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(40)
        b1 = o(pg, 'lista', 'focus', 'font_box')
        pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
        c = o(pg, 'lista', 'focus', 'font_box', 'fmt', 'pas', 'indicii', 'ev')
        pg.keyboard.type('X'); pg.wait_for_timeout(100)
        d = o(pg, 'text', 'font_box', 'focus')
        return {'dupa_alt_jos': a, 'dupa_5_jos': b1, 'dupa_enter': c, 'apoi_X': d}
    caz('b_fs_altjos_sageti_enter', b_fs_altjos)

    def b_fs_mouse_asist():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}},
                 asistent={'pasi': [{'tinta': 'meniu:20'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
        ct(pg, 'meniu_derulant:Home/Font/Font Size'); ct(pg, 'meniu:20')
        return o(pg, 'fmt', 'pas', 'indicii', 'ev')
    caz('b_fs_mouse_asistent', b_fs_mouse_asist)

    def b_fs_lista_tastare():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}})
        ct(pg, 'meniu_derulant:Home/Font/Font Size')
        a = o(pg, 'lista', 'focus')
        pg.keyboard.type('20'); pg.wait_for_timeout(150)
        b1 = o(pg, 'lista', 'focus', 'text', 'font_box', 'fmt', 'ev')
        pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
        return {'lista_deschisa': a, 'dupa_20': b1, 'dupa_enter': o(pg, 'lista', 'text', 'fmt', 'font_box', 'ev')}
    caz('b_fs_lista_deschisa_tastez_20', b_fs_lista_tastare)

    def b_fs_esc():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}})
        ct(pg, 'panglica:Home/Font/Font Size', 0.3, 0.5)
        pg.keyboard.press('Alt+ArrowDown'); pg.wait_for_timeout(100)
        pg.keyboard.press('ArrowDown'); pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
        a = o(pg, 'lista', 'focus', 'font_box', 'fmt')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
        return {'esc1': a, 'esc2': o(pg, 'lista', 'focus', 'font_box', 'ev')}
    caz('b_fs_esc', b_fs_esc)

    def b_fs_keytips():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}})
        for k in ('Alt', 'h', 'f', 's'):
            pg.keyboard.press(k); pg.wait_for_timeout(80)
        a = o(pg, 'focus', 'font_box', 'keytips', 'lista')
        pg.keyboard.press('Alt+ArrowDown'); pg.wait_for_timeout(100)
        b1 = o(pg, 'lista', 'focus')
        pg.keyboard.press('ArrowDown'); pg.keyboard.press('Enter'); pg.wait_for_timeout(100)
        return {'alt_h_f_s': a, 'alt_jos': b1, 'jos_enter': o(pg, 'fmt', 'font_box', 'focus', 'ev')}
    caz('b_fs_keytips_alt_h_fs', b_fs_keytips)

    def b_tip_tastatura():
        deschide(pg, {'paragrafe': ['Orar', 'Marti: sport'], 'cursor': 0},
                 asistent={'pasi': [{'tinta': 'camp:tip_fisier'}, {'tinta': 'meniu:PDF (*.pdf)'}, {'tinta': 'dialog_salvare:Save'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pg.keyboard.press('Alt+t'); pg.wait_for_timeout(100)
        a = o(pg, 'focus', 'pas', 'ev')
        pg.keyboard.press('Alt+ArrowDown'); pg.wait_for_timeout(100)
        b1 = o(pg, 'lista', 'focus', 'pas', 'indicii')
        for _ in range(6):
            pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(30)
        c = o(pg, 'lista', 'tip_box')
        pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
        d = o(pg, 'lista', 'tip_box', 'tip_afisat', 'focus', 'pas', 'indicii', 'dlg')
        pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
        e = o(pg, 'salvate', 'nume', 'dlg', 'pas', 'indicii', 'ev')
        return {'alt_t': a, 'alt_jos': b1, 'sase_jos': c, 'enter1': d, 'enter2': e}
    caz('b_tip_tastatura_asistent', b_tip_tastatura)

    def b_tip_mouse_asist():
        deschide(pg, {'paragrafe': ['Orar', 'Marti: sport'], 'cursor': 0},
                 asistent={'pasi': [{'tinta': 'camp:tip_fisier'}, {'tinta': 'meniu:PDF (*.pdf)'}, {'tinta': 'dialog_salvare:Save'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)'); ct(pg, 'dialog_salvare:Save')
        return o(pg, 'salvate', 'pas', 'indicii', 'ev')
    caz('b_tip_mouse_asistent', b_tip_mouse_asist)

    def b_tip_inchisa_sageti():
        deschide(pg, {'paragrafe': ['Orar'], 'cursor': 0})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pg.keyboard.press('Alt+t'); pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(100)
        a = o(pg, 'tip_box', 'lista', 'focus')
        pg.keyboard.press('p'); pg.wait_for_timeout(100)
        return {'jos': a, 'litera_p': o(pg, 'tip_box', 'lista', 'focus', 'ev')}
    caz('b_tip_inchisa_sageti_litera', b_tip_inchisa_sageti)

    def b_tip_esc():
        deschide(pg, {'paragrafe': ['Orar'], 'cursor': 0})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        ct(pg, 'camp:tip_fisier')
        a = o(pg, 'lista', 'focus')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
        b1 = o(pg, 'lista', 'dlg', 'focus')
        pg.keyboard.press('Enter'); pg.wait_for_timeout(100)
        return {'lista_clic': a, 'esc': b1, 'apoi_enter': o(pg, 'lista', 'dlg', 'salvate', 'nume', 'focus', 'ev')}
    caz('b_tip_lista_clic_esc_enter', b_tip_esc)

    def b_tab(gest, n=5):
        def f():
            deschide(pg, {'paragrafe': ['Ana are mere']})
            pg.keyboard.press(gest); pg.wait_for_timeout(300)
            seq = [obs(pg)['focus']]
            for _ in range(n):
                pg.keyboard.press('Tab'); pg.wait_for_timeout(60)
                seq.append(obs(pg)['focus'])
            pg.keyboard.press('Shift+Tab'); pg.wait_for_timeout(60)
            seq.append('S-TAB ' + str(obs(pg)['focus']))
            pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
            return {'focus_pe_rand': seq, 'dupa_enter': o(pg, 'dlg', 'nume', 'salvate', 'docs', 'msg', 'ev')}
        return f
    caz('b_tab_saveas_f12', b_tab('F12'))
    caz('b_tab_savethis_ctrls', b_tab('Control+s'))
    caz('b_tab_intrebare_ctrlw', b_tab('Control+w'))

    def b_intrebare(tasta):
        def f():
            deschide(pg, {'paragrafe': ['Ana are mere']}, asistent={'pasi': [{'tinta': "fereastra:Don't Save"}], 'dupaGreseli': 2, 'dupaSecunde': 600})
            pg.keyboard.type(' azi'); pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
            pg.keyboard.press(tasta); pg.wait_for_timeout(200)
            return o(pg, 'text', 'docs', 'titlu', 'dialog', 'dlg', 'salvate', 'nume', 'focus', 'pas', 'msg', 'ev')
        return f
    for t in ('Alt+n', 'Alt+s', 'Escape', 'Enter'):
        caz('b_intrebare_' + t, b_intrebare(t))

    def b_savethis(tasta):
        def f():
            deschide(pg, {'paragrafe': ['Poezia mea']})
            pg.keyboard.press('Control+s'); pg.wait_for_timeout(300)
            pg.keyboard.type('Marin'); pg.keyboard.press(tasta); pg.wait_for_timeout(200)
            return o(pg, 'dlg', 'nume', 'salvate', 'titlu', 'bs', 'focus', 'msg', 'ev')
        return f
    for t in ('Alt+s', 'Escape', 'Alt+o', 'Alt+ArrowDown'):
        caz('b_savethis_' + t, b_savethis(t))

    def b_alt_in_dialog():
        deschide(pg, {'paragrafe': ['Orar']})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pg.keyboard.press('Alt'); pg.wait_for_timeout(100)
        a = o(pg, 'keytips', 'focus')
        pg.keyboard.press('h'); pg.wait_for_timeout(100)
        b1 = o(pg, 'keytips', 'focus', 'nume_box', 'dlg', 'ev')
        pg.keyboard.press('Alt+s'); pg.wait_for_timeout(150)
        return {'alt': a, 'h': b1, 'alt_s': o(pg, 'dlg', 'nume', 'ev')}
    caz('b_alt_in_saveas', b_alt_in_dialog)

    def b_alt_n_saveas():
        deschide(pg, {'paragrafe': ['Orar']})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pg.keyboard.press('Alt+t'); pg.wait_for_timeout(80)
        pg.keyboard.press('Alt+n'); pg.wait_for_timeout(80)
        a = o(pg, 'focus', 'nume_box')
        pg.keyboard.press('Alt+l'); pg.wait_for_timeout(100)
        return {'alt_n': a, 'alt_l_tools': o(pg, 'msg', 'ev')}
    caz('b_alt_n_l_saveas', b_alt_n_saveas)

    def b_recent_tastatura():
        deschide(pg, {'paragrafe': ['Orar'], 'fisiere': [ORAR_ANA], 'recente': [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar'}]})
        pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
        pg.keyboard.press('Alt'); pg.wait_for_timeout(100)
        a = o(pg, 'keytips', 'bs')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
        b0 = o(pg, 'bs')
        if b0['bs'] is None:
            pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
        pg.keyboard.press('Tab'); pg.keyboard.press('ArrowDown'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
        c = o(pg, 'bs', 'nume', 'text', 'focus', 'ev')
        deschide(pg, {'paragrafe': ['Orar'], 'fisiere': [ORAR_ANA], 'recente': [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar'}]})
        for k in ('Alt', 'f', 'o'):
            pg.keyboard.press(k); pg.wait_for_timeout(100)
        d = o(pg, 'keytips', 'bs')
        kt = d['keytips']
        for ch in 'Y3':
            pg.keyboard.press(ch); pg.wait_for_timeout(100)
        e = o(pg, 'bs', 'nume', 'text', 'keytips', 'ev')
        return {'alt_in_open': a, 'esc': b0, 'tab_jos_enter': c, 'alt_f_o': d, 'y3': e}
    caz('b_recent_tastatura', b_recent_tastatura)

    def b_fara_document():
        deschide(pg, {'paragrafe': ['Ana are mere']})
        pg.keyboard.type(' azi'); pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
        ct(pg, "fereastra:Don't Save")
        a = o(pg, 'docs', 'titlu', 'text', 'focus')
        golev(pg)
        for k in ('a', 'Control+n', 'F12', 'Control+s', 'Control+w', 'Control+b'):
            pg.keyboard.press(k); pg.wait_for_timeout(120)
        b1 = o(pg, 'docs', 'titlu', 'text', 'dlg', 'bs', 'msg', 'ev')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
        pg.keyboard.press('Alt'); pg.wait_for_timeout(100)
        c = o(pg, 'keytips')
        return {'dupa_dont_save': a, 'taste': b1, 'alt': c}
    caz('b_fara_document', b_fara_document)

    def b_ctrlw_nemodificat_salvat():
        deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente'})
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(200)
        return o(pg, 'docs', 'titlu', 'dlg', 'dialog', 'ev')
    caz('b_ctrlw_nemodificat', b_ctrlw_nemodificat_salvat)

    def b_alt_h_chord():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}})
        pg.keyboard.press('Alt+h'); pg.wait_for_timeout(120)
        return o(pg, 'keytips', 'focus', 'ev')
    caz('b_alt_h_tinut', b_alt_h_chord)

    b.close()
s.shutdown()
salveaza(R, OUT + 'rb4.json')
print('ok', len(R))
