# -*- coding: utf-8 -*-
"""Partea A (2): T4 (Ctrl+F12), T5 (Word fara document), T6 (tastatura in liste + asistentul) si regresul GRAV-urilor
inchise inainte (telefon, titlul dupa salvare, Enter = Save + asistent, Font Size, Save as type, Save As texte,
„Save your changes…”, „Save this file”). Iesirea: rb5.json."""
from h5 import *


def tinta_cu(pg, prefix, cuvant):
    t = pg.evaluate("() => LH.aplicatii.tinte('word')")
    c = [x for x in t if x.startswith(prefix) and cuvant in x]
    return c[0] if c else None


s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)

    # ---------------- T4
    def t4():
        out = {}
        deschide(pg, {'paragrafe': ['Ana'], 'fisiere': [ORAR_ANA]})
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
        d = dlg(pg); out['ctrl_f12'] = {'sup': d and d['sup'], 'titlu': d and d['titlu'], 'ev': evt(pg)[-1:], 'dialog_salvare': obs(pg)['dialog_salvare']}
        pg.keyboard.press('Enter'); pg.wait_for_timeout(200)   # Enter cu File name gol
        x = scurt(pg); out['enter_gol'] = {k: x[k] for k in ('dlg', 'msg', 'salvate', 'nume')}; out['enter_gol']['ev'] = evt(pg)[-1:]
        pg.keyboard.press('Escape'); pg.wait_for_timeout(150)
        # Shift+F12: document nou, apoi document salvat
        pg.keyboard.press('Shift+F12'); pg.wait_for_timeout(300)
        d = dlg(pg); out['shift_f12_nou'] = {'sup': d and d['sup'], 'ev': evt(pg)[-1:]}
        pg.keyboard.press('Escape')
        deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'modificat': True, 'fisiere': [ORAR_ANA]})
        pg.keyboard.press('Control+End'); pg.keyboard.type(' x')
        pg.keyboard.press('Shift+F12'); pg.wait_for_timeout(300)
        x = scurt(pg); out['shift_f12_salvat'] = {k: x[k] for k in ('dlg', 'fisiere', 'msg')}; out['shift_f12_salvat']['ev'] = evt(pg)[-1:]
        # profilul word2007
        deschide(pg, {'paragrafe': ['Ana']}, profil='word2007')
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
        x = scurt(pg); out['ctrl_f12_word2007'] = {k: x[k] for k in ('dlg', 'msg')}; out['ctrl_f12_word2007']['ev'] = evt(pg)[-1:]
        return out
    caz('t4', t4)

    # ---------------- T5
    def t5():
        out = {}
        deschide(pg, {'paragrafe': ['Ana are mere']})
        pg.keyboard.press('Control+End'); pg.keyboard.type(' azi'); pg.keyboard.press('Control+w'); pg.wait_for_timeout(300)
        ct(pg, "fereastra:Don't Save"); pg.wait_for_timeout(200)
        x = scurt(pg); out['dupa_dont_save'] = {k: x[k] for k in ('docs', 'titlu', 'text')}; out['dupa_dont_save']['titlu_ecran'] = titlu_ecran(pg)
        pg.screenshot(path=OUT + 't5_fara_doc.png')
        golev(pg)
        for g in ('Control+b', 'F12', 'Control+s', 'Control+w', 'Control+z', 'Control+a', 'a', 'Enter', 'Control+p'):
            pg.keyboard.press(g); pg.wait_for_timeout(150)
            x = scurt(pg)
            out['tasta ' + g] = {'msg': x['msg'], 'ev': evt(pg)[-1:], 'docs': x['docs'], 'dlg': x['dlg']}
            pg.keyboard.press('Escape'); pg.wait_for_timeout(80)
        for t in ('mso:Bold', 'mso:FontSize', 'fila:Insert'):
            golev(pg); r = ct(pg, t)
            x = scurt(pg); out['clic ' + t] = {'msg': x['msg'], 'ev': evt(pg)[-1:], 'gasit': not (isinstance(r, str))}
        golev(pg)
        pg.keyboard.press('Control+n'); pg.wait_for_timeout(250)
        x = scurt(pg); out['ctrl_n'] = {k: x[k] for k in ('docs', 'titlu', 'text', 'ecran', 'nume', 'msg')}; out['ctrl_n']['ev'] = evt(pg)[-1:]; out['ctrl_n']['titlu_ecran'] = titlu_ecran(pg)
        pg.keyboard.type('Test')
        x = scurt(pg); out['ctrl_n_tastare'] = {k: x[k] for k in ('text', 'ecran', 'titlu')}
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(250)
        x = scurt(pg); out['ctrl_w_pe_nou'] = {k: x[k] for k in ('dlg', 'dialog')}
        ct(pg, "fereastra:Don't Save"); pg.wait_for_timeout(200)
        ct(pg, 'fila:File'); pg.wait_for_timeout(300)
        bl = tinta_cu(pg, 'backstage:', 'Blank document')
        ct(pg, bl); pg.wait_for_timeout(250)
        x = scurt(pg); out['blank_document'] = {k: x[k] for k in ('docs', 'titlu', 'text', 'bs', 'msg')}; out['blank_document']['tinta'] = bl; out['blank_document']['ev'] = evt(pg)[-1:]
        # File > New > Blank document
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(200)
        ct(pg, 'fila:File'); pg.wait_for_timeout(300)
        nw = tinta_cu(pg, 'backstage:', 'New')
        ct(pg, nw); pg.wait_for_timeout(300)
        bl2 = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if 'Blank' in t]
        if bl2:
            ct(pg, bl2[0]); pg.wait_for_timeout(250)
        x = scurt(pg); out['new_blank'] = {k: x[k] for k in ('docs', 'titlu', 'bs', 'msg')}; out['new_blank']['tinte_blank'] = bl2; out['new_blank']['ev'] = evt(pg)[-2:]
        return out
    caz('t5', t5)

    def t5_ctrl_n_cu_document():
        deschide(pg, {'paragrafe': ['Lucrarea mea'], 'modificat': True})
        pg.keyboard.press('Control+n'); pg.wait_for_timeout(250)
        a = scurt(pg)
        pg.keyboard.type('Doi')
        b_ = scurt(pg)
        pg.keyboard.press('Control+n'); pg.wait_for_timeout(250)
        c = scurt(pg)
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(250)
        d = scurt(pg)
        pg.keyboard.press('Control+w'); pg.wait_for_timeout(250)
        e = scurt(pg)
        if e['dlg']:
            ct(pg, "fereastra:Don't Save"); pg.wait_for_timeout(200)
        f = scurt(pg)
        return {'dupa_ctrl_n': {k: a[k] for k in ('docs', 'titlu', 'text')}, 'tastare': {k: b_[k] for k in ('docs', 'titlu', 'text')},
                'al_doilea_ctrl_n': {k: c[k] for k in ('docs', 'titlu', 'text')}, 'ctrl_w_1': {k: d[k] for k in ('docs', 'titlu', 'text', 'dlg')},
                'ctrl_w_2': {k: e[k] for k in ('docs', 'titlu', 'text', 'dlg')}, 'dupa_dont_save': {k: f[k] for k in ('docs', 'titlu', 'text', 'dlg')}}
    caz('t5_ctrl_n_cu_document', t5_ctrl_n_cu_document)

    # ---------------- T6
    def t6_fs(cum):
        def f():
            deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}},
                     asistent={'pasi': [{'tinta': 'meniu:20', 'indiciu': 'Alege 20'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
            jurnal = []
            def nota(gest):
                x = obs(pg); jurnal.append([gest, x['pas'], x['indicii'], evt(pg)[-1:] if evt(pg) else []])
            if cum == 'clic_caseta':
                clic(pg, '[data-lh-id-mso="FontSize"] input'); nota('clic caseta')
            else:
                for k in ('Alt', 'h', 'f', 's'):
                    pg.keyboard.press(k); pg.wait_for_timeout(120); nota(k)
            pg.keyboard.press('Alt+ArrowDown'); pg.wait_for_timeout(200); nota('Alt+↓')
            for i in range(5):
                pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(60)
            nota('↓×5')
            pg.keyboard.press('Enter'); pg.wait_for_timeout(250); nota('Enter')
            x = obs(pg)
            return {'jurnal': jurnal, 'fmt': x['fmt'], 'font_box': x['font_box'], 'focus': x['focus']}
        return f
    caz('t6_fs_clic_caseta', t6_fs('clic_caseta'))
    caz('t6_fs_keytips', t6_fs('keytips'))

    def t6_fs_mouse():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}},
                 asistent={'pasi': [{'tinta': 'meniu:20', 'indiciu': 'Alege 20'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
        ct(pg, 'meniu_derulant:Home/Font/Font Size'); a = obs(pg)
        ct(pg, 'meniu:20'); x = obs(pg)
        return {'dupa_sageata': [a['pas'], a['indicii']], 'final': [x['pas'], x['indicii'], x['fmt']], 'ev': evt(pg)}
    caz('t6_fs_mouse', t6_fs_mouse)

    def t6_tip(cum):
        def f():
            deschide(pg, {'paragrafe': ['Orar']}, asistent={'pasi': [{'tinta': 'camp:tip_fisier'}, {'tinta': 'meniu:PDF (*.pdf)'}, {'tinta': 'dialog_salvare:Save'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
            jurnal = []
            def nota(gest):
                x = obs(pg); jurnal.append([gest, x['pas'], x['indicii'], evt(pg)[-1:] if evt(pg) else []])
            pg.keyboard.press('F12'); pg.wait_for_timeout(300); nota('F12')
            if cum == 'tastatura':
                pg.keyboard.press('Alt+t'); pg.wait_for_timeout(150); nota('Alt+T')
                pg.keyboard.press('Alt+ArrowDown'); pg.wait_for_timeout(200); nota('Alt+↓')
                for i in range(6):
                    pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(60)
                nota('↓×6')
                pg.keyboard.press('Enter'); pg.wait_for_timeout(250); nota('Enter (rand)')
                d = dlg(pg)
                pg.keyboard.press('Enter'); pg.wait_for_timeout(250); nota('Enter (Save)')
            else:
                ct(pg, 'camp:tip_fisier'); nota('clic caseta')
                ct(pg, 'meniu:PDF (*.pdf)'); nota('clic PDF')
                d = dlg(pg)
                ct(pg, 'dialog_salvare:Save'); nota('clic Save')
            x = scurt(pg)
            return {'jurnal': jurnal, 'dlg_dupa_pdf': d and {k: d[k] for k in ('sup', 'tip', 'focus')}, 'salvate': x['salvate']}
        return f
    caz('t6_tip_tastatura', t6_tip('tastatura'))
    caz('t6_tip_mouse', t6_tip('mouse'))

    # ---------------- regresul
    def r_titlu():
        out = {}
        for cum in ('f12_enter', 'ctrls_clic'):
            deschide(pg, {'paragrafe': ['Poezia mea', 'Toamna vine.']})
            pg.keyboard.press('F12' if cum == 'f12_enter' else 'Control+s'); pg.wait_for_timeout(300)
            pg.keyboard.press('Control+a'); pg.keyboard.type('Marin_Ioana_7B_poezie')
            if cum == 'f12_enter':
                pg.keyboard.press('Enter')
            else:
                ct(pg, 'dialog_salvare:Save')
            out[cum] = {'ecran_imediat': titlu_ecran(pg), 'stare': obs(pg)['titlu'], 'nume': obs(pg)['nume']}
        return out
    caz('reg_titlu_dupa_salvare', r_titlu)

    def r_enter_asistent():
        out = {}
        for g in ('F12', 'Control+s'):
            deschide(pg, {'paragrafe': ['Orar']}, asistent={'pasi': [{'tinta': 'dialog_salvare:Save'}, {'tinta': 'mso:Bold'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
            pg.keyboard.press(g); pg.wait_for_timeout(300)
            pg.keyboard.press('Control+a'); pg.keyboard.type('Popescu_Ana_7A_orar'); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
            x = obs(pg)
            out[g] = {'pas': x['pas'], 'nume': x['nume'], 'indicii': x['indicii'], 'ev_ultim': evt(pg)[-1]}
        return out
    caz('reg_enter_save_asistent', r_enter_asistent)

    def r_font_mouse():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}})
        ct(pg, 'meniu_derulant:Home/Font/Font Size'); a = obs(pg)
        ct(pg, 'meniu:20'); x = obs(pg)
        return {'lista': a['lista'], 'fmt': x['fmt'], 'font_box': x['font_box']}
    caz('reg_font_size_lista', r_font_mouse)

    def r_a1_a2():
        deschide(pg, {'paragrafe': ['Orar']})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        d0 = dlg(pg)
        hdr = pg.evaluate("""() => [...document.querySelectorAll('.lh-ap-strat-dialog [data-lh-tip="SplitButton"]')].map(x => (x.innerText || '').trim()).filter(t => /^(Nume|Data modificării|Tip|Dimensiune|Documente)$/.test(t))""")
        ct(pg, 'camp:tip_fisier'); a = obs(pg); ct(pg, 'meniu:PDF (*.pdf)')
        d1 = dlg(pg); x = obs(pg)
        ct(pg, 'dialog_salvare:Save'); y = obs(pg)
        return {'texte': hdr, 'adr': d0['adr'], 'lista_tip': a['lista'], 'tip_box': x['tip_box'], 'tip_afisat': x['tip_afisat'], 'sup': d1['sup'], 'salvate': y['salvate'], 'nume': y['nume']}
    caz('reg_a1_a2', r_a1_a2)

    def r_intrebari():
        out = {}
        for cum in ('Control+w', 'x'):
            deschide(pg, {'paragrafe': ['Ana']})
            pg.keyboard.press('Control+End'); pg.keyboard.type(' azi')
            if cum == 'x':
                ct(pg, 'bara_titlu:Close')
            else:
                pg.keyboard.press(cum)
            pg.wait_for_timeout(300)
            x = scurt(pg); out[cum] = {k: x[k] for k in ('dlg', 'dialog')}
            ct(pg, 'fereastra:Cancel'); pg.wait_for_timeout(200)
            y = scurt(pg); out[cum]['dupa_cancel'] = {k: y[k] for k in ('docs', 'text', 'dlg')}
        deschide(pg, {'paragrafe': ['Ana', 'are']})
        pg.keyboard.press('Control+s'); pg.wait_for_timeout(300)
        d = dlg(pg); out['ctrl_s_nou'] = {'sup': d and d['sup'], 'nume_box': d and d['nume_box'], 'dialog_salvare': obs(pg)['dialog_salvare']}
        return out
    caz('reg_intrebari', r_intrebari)
    ctx.close()

    # ---------------- telefonul
    ctx = context(b, 390, 844, touch=True); pg = pagina(ctx, port)
    cdp = ctx.new_cdp_session(pg)
    pg.evaluate("""() => { const v = document.createElement('button'); v.id = 'verifica'; v.textContent = 'Verifică';
        v.style.cssText = 'position:fixed;right:4px;bottom:4px;z-index:99999;width:110px;height:44px';
        v.addEventListener('click', () => { window.__citit = LH.aplicatii.stare('word').text; }); document.body.appendChild(v); }""")

    def t_dubluri():
        deschide(pg, {'paragrafe': ['']})
        tap(pg, 'text:1')
        cdp_compune(pg, cdp, ['a', 'an', 'ana'], 'ana')
        cdp_compune(pg, cdp, [], ' ')
        cdp_compune(pg, cdp, ['a', 'ar', 'are'], 'are')
        return {'text': obs(pg)['text'], 'ecran': obs(pg)['ecran']}
    caz('reg_telefon_fara_dubluri', t_dubluri)

    def t_compunere_verifica():
        deschide(pg, {'paragrafe': ['Numele: ']})
        tap(pg, 'text:1')
        cdp_compune(pg, cdp, ['I', 'Io', 'Ion'])
        pg.evaluate("() => { window.__citit = null; }")
        c = centru(pg, '#verifica'); pg.touchscreen.tap(c[0], c[1]); pg.wait_for_timeout(250)
        return {'citit_la_click': pg.evaluate("() => window.__citit"), 'text_dupa': obs(pg)['text']}
    caz('reg_telefon_compunere_verifica', t_compunere_verifica)

    def t_open_telefon():
        deschide(pg, {'paragrafe': [''], 'fisiere': [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB}]})
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
        r1 = tap(pg, 'arbore:Descărcări'); a = dlg(pg)
        r2 = tap(pg, 'lista:club-lectura.docx')
        r3 = tap(pg, 'fereastra:Open')
        x = scurt(pg)
        pg.screenshot(path=OUT + 'telefon_open.png')
        return {'rect_descarcari': r1, 'rect_rand': r2, 'rect_open': r3, 'dupa_descarcari': a and a['lista'], 'final': {k: x[k] for k in ('nume', 'folder', 'docs', 'msg')}}
    caz('telefon_open', t_open_telefon)
    ctx.close(); b.close()
s.shutdown()
salveaza(R, OUT + 'rb5.json')
print('gata')
