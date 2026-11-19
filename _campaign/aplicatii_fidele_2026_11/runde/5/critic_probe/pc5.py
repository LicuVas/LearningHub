# -*- coding: utf-8 -*-
"""Partea B (stare_finala_erori) + T6 mai greu: pasii scenariului inghetat word-font-size-lista in asistent, pe tastatura.
Iesirea: rc5.json."""
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


FIS3 = [{'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB}, ORAR_ANA, {'folder': 'Desktop', 'nume': 'tema', 'text': ['Tema']}]

s = server(); port = s.server_address[1]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    ctx = context(b); pg = pagina(ctx, port)

    # ---- T6 mai greu: pasii din scenarii/word/word-font-size-lista.json (meniu_derulant:Home/Font/Font Size, meniu:20)
    def t6_scenariu(cum):
        def f():
            deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}},
                     asistent={'pasi': [{'tinta': 'meniu_derulant:Home/Font/Font Size', 'indiciu': 'Deschide lista'}, {'tinta': 'meniu:20', 'indiciu': 'Alege 20'}], 'dupaGreseli': 2, 'dupaSecunde': 600})
            j = []
            def nota(g):
                x = obs(pg); j.append([g, x['pas'], x['indicii'], (evt(pg) or [''])[-1]])
            if cum == 'mouse':
                ct(pg, 'meniu_derulant:Home/Font/Font Size'); nota('clic ▾')
                ct(pg, 'meniu:20'); nota('clic 20')
            else:
                clic(pg, '[data-lh-id-mso="FontSize"] input'); nota('clic caseta')
                pg.keyboard.press('Alt+ArrowDown'); pg.wait_for_timeout(200); nota('Alt+↓')
                for i in range(5):
                    pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(50)
                nota('↓×5')
                pg.keyboard.press('Enter'); pg.wait_for_timeout(250); nota('Enter')
            x = obs(pg)
            return {'jurnal': j, 'fmt': x['fmt']}
        return f
    caz('t6_scenariu_mouse', t6_scenariu('mouse'))
    caz('t6_scenariu_tastatura', t6_scenariu('tastatura'))

    # ---- B1: bara de adrese la a doua navigare (Open si Save As) — ecranul vs folderul ferestrei
    def b1_open():
        deschide(pg, {'paragrafe': [''], 'fisiere': FIS3})
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
        pasi = []
        for f in ('Descărcări', 'Documente', 'Desktop', 'Descărcări'):
            ct(pg, 'arbore:' + f); d = dlg(pg)
            pasi.append({'clic': f, 'adr': d['adr'], 'nav_ales': [n for n in d['nav'] if '[ales]' in n], 'lista': d['lista']})
        pg.screenshot(path=OUT + 'b1_open_a_patra_navigare.png')
        return pasi
    caz('b1_open_adresa', b1_open)

    def b1_saveas():
        deschide(pg, {'paragrafe': ['Lucrare'], 'fisiere': FIS3})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pasi = []
        for f in ('Descărcări', 'Desktop'):
            ct(pg, 'arbore:' + f); d = dlg(pg)
            pasi.append({'clic': f, 'adr': d['adr'], 'nav_ales': [n for n in d['nav'] if '[ales]' in n]})
        pg.screenshot(path=OUT + 'b1_saveas_desktop.png')
        ct(pg, 'camp:nume_fisier'); pg.keyboard.press('Control+a'); pg.keyboard.type('Pop_Mihai_7A_lucrare'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
        x = scurt(pg)
        return {'pasi': pasi, 'final': {k: x[k] for k in ('nume', 'folder', 'titlu')}, 'fisier_nou': [f for f in x['fisiere'] if 'Pop_Mihai' in f]}
    caz('b1_saveas_adresa', b1_saveas)

    # ---- B2: lista ferestrei Save As (folderul are fisiere) vs stare().fisiere; clic pe un rand
    def b2_saveas_lista():
        deschide(pg, {'paragrafe': ['Orarul meu', 'Luni: sport'], 'modificat': True, 'fisiere': [ORAR_ANA, {'folder': 'Documente', 'nume': 'Pop_Mihai_7A_compunere', 'text': ['x']}]})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        d = dlg(pg)
        golev(pg)
        r = pg.evaluate("""() => { const x = [...document.querySelectorAll('.lh-ap-strat-dialog [data-lh-tip="List"] [data-lh-tip="ListItem"]')].find(e => e.getBoundingClientRect().height > 0); if (!x) return null; const b = x.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }""")
        if r:
            pg.mouse.click(r[0] + 40, r[1] + r[3] / 2); pg.wait_for_timeout(200)
        x = scurt(pg)
        pg.screenshot(path=OUT + 'b2_saveas_lista.png')
        return {'fisiere_in_documente': [f.split(':')[0] for f in x['fisiere']], 'lista_pe_ecran': d['lista'], 'clic_rand_1': {'msg': x['msg'], 'ev': evt(pg), 'nume_box': dlg(pg)['nume_box']}}
    caz('b2_saveas_lista', b2_saveas_lista)

    # ---- B3: Open — greseli tipice: nume scris gresit, fisierul din alt folder, PDF, dublu clic pe PDF, nume cu .docx
    def b3_open_greseli():
        out = {}
        fis = FIS3 + [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar.pdf', 'text': ORAR}]
        for cum, val in (('gresit', 'club-lectur'), ('alt_folder', 'club-lectura'), ('cu_ext', 'Popescu_Ana_7A_orar.docx'), ('pdf', 'Popescu_Ana_7A_orar.pdf'), ('litere_mici', 'popescu_ana_7a_orar')):
            deschide(pg, {'paragrafe': [''], 'fisiere': fis})
            pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
            pg.keyboard.type(val); pg.keyboard.press('Enter'); pg.wait_for_timeout(250)
            x = scurt(pg)
            out[cum] = {'scris': val, 'nume': x['nume'], 'folder': x['folder'], 'docs': x['docs'], 'dlg': x['dlg'], 'msg': x['msg'], 'ev': evt(pg)[-1:]}
        deschide(pg, {'paragrafe': [''], 'fisiere': fis})
        pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
        d = dlg(pg)
        pdf = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if t.startswith('lista:') and t.endswith('.pdf')]
        if pdf:
            dublu(pg, pdf[0])
        x = scurt(pg)
        out['dublu_pe_pdf'] = {'lista': d['lista'], 'tinta': pdf, 'nume': x['nume'], 'msg': x['msg'], 'dlg': x['dlg'], 'ev': evt(pg)[-1:]}
        return out
    caz('b3_open_greseli', b3_open_greseli)

    # ---- B4: deschid un fisier care e deja deschis (modificat), din Open si din Recent
    def b4_deja_deschis():
        out = {}
        for cale in ('open', 'recent'):
            deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': [ORAR_ANA],
                          'recente': [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar'}]})
            pg.keyboard.press('Control+End'); pg.keyboard.press('Enter'); pg.keyboard.type('Marți: sport')
            a = scurt(pg)
            if cale == 'open':
                pg.keyboard.press('Control+F12'); pg.wait_for_timeout(300)
                dublu(pg, 'lista:Popescu_Ana_7A_orar.docx')
            else:
                pg.keyboard.press('Control+o'); pg.wait_for_timeout(300)
                rr = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if t.startswith('backstage:') and 'Popescu_Ana_7A_orar' in t]
                if rr:
                    ct(pg, rr[0])
            pg.wait_for_timeout(250)
            x = scurt(pg)
            pg.keyboard.press('Control+w'); pg.wait_for_timeout(250)
            y = scurt(pg)
            out[cale] = {'inainte': {k: a[k] for k in ('text', 'docs', 'titlu')}, 'dupa_deschidere': {k: x[k] for k in ('text', 'docs', 'titlu', 'msg')},
                         'dupa_ctrl_w': {k: y[k] for k in ('text', 'docs', 'titlu', 'dlg')}}
        return out
    caz('b4_deja_deschis', b4_deja_deschis)

    # ---- B5: nume cu semne pe care Windows nu le primeste (lectia m1-l03:156)
    def b5_nume_invalid():
        out = {}
        for nume in ('Pop_Mihai:7A', 'Pop?Mihai', 'Pop*Mihai', 'Pop"Mihai'):
            deschide(pg, {'paragrafe': ['Orarul meu'], 'modificat': True})
            pg.keyboard.press('F12'); pg.wait_for_timeout(300)
            pg.keyboard.press('Control+a'); pg.keyboard.type(nume); pg.keyboard.press('Enter'); pg.wait_for_timeout(250)
            x = scurt(pg)
            out[nume] = {'nume': x['nume'], 'titlu': x['titlu'], 'fisiere': x['fisiere'], 'msg': x['msg'], 'dlg': x['dlg'], 'ev': evt(pg)[-1:]}
        return out
    caz('b5_nume_invalid', b5_nume_invalid)

    # ---- B6: mesajul central ramane pe ecran dupa ce situatia s-a rezolvat?
    def b6_mesaj_ramas():
        deschide(pg, {'paragrafe': ['Orarul meu'], 'modificat': True, 'fisiere': [ORAR_ANA]})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        pg.keyboard.press('Control+a'); pg.keyboard.type('Popescu_Ana_7A_orar'); pg.keyboard.press('Enter'); pg.wait_for_timeout(250)
        a = obs(pg)['msg']
        pg.keyboard.press('Control+a'); pg.keyboard.type('Pop_Mihai_7A_orar'); pg.keyboard.press('Enter'); pg.wait_for_timeout(300)
        b_ = scurt(pg)
        pg.wait_for_timeout(6000)
        c = obs(pg)['msg']
        pg.keyboard.type(' text nou'); pg.wait_for_timeout(200)
        d = obs(pg)['msg']
        vis = pg.evaluate("""() => [...document.querySelectorAll('[data-lh-nesimulat]:not([data-lh-tip])')].map(m => { const r = m.getBoundingClientRect(); const cs = getComputedStyle(m); return [r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0', m.textContent.trim().slice(0, 60)]; })""")
        pg.screenshot(path=OUT + 'b6_mesaj_ramas.png')
        return {'dupa_already': a, 'dupa_save_reusit': {k: b_[k] for k in ('msg', 'nume', 'dlg')}, 'dupa_6s': c, 'dupa_tastare': d, 'vizibil': vis}
    caz('b6_mesaj_ramas', b6_mesaj_ramas)

    # ---- B7: Esc / Cancel in Save As dupa PDF: ce ramane (tip_salvare_afisat, fisiere), apoi F12 iar
    def b7_cancel_pdf():
        deschide(pg, {'paragrafe': ['Orar']})
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)')
        ct(pg, 'dialog_salvare:Cancel'); pg.wait_for_timeout(200)
        a = scurt(pg)
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        d = dlg(pg)
        return {'dupa_cancel': {k: a[k] for k in ('salvate', 'tip_afisat', 'dlg', 'nume')}, 'f12_iar': {k: d[k] for k in ('sup', 'tip', 'nume_box')}, 'tip_afisat_acum': obs(pg)['tip_afisat']}
    caz('b7_cancel_pdf', b7_cancel_pdf)

    # ---- B8: Ctrl+N cu documentul elevului deschis: ce raporteaza stare() si ecranul; cum se intoarce la el
    def b8_ctrl_n():
        deschide(pg, {'paragrafe': ['Excursie la Bicaz'], 'modificat': True})
        a = scurt(pg)
        pg.keyboard.press('Control+n'); pg.wait_for_timeout(250)
        x = scurt(pg)
        pg.screenshot(path=OUT + 'b8_dupa_ctrl_n.png')
        tinte = [t for t in pg.evaluate("() => LH.aplicatii.tinte('word')") if 'Switch' in t or 'Fereastr' in t or 'Window' in t]
        pg.keyboard.press('F12'); pg.wait_for_timeout(300)
        d = dlg(pg)
        pg.keyboard.press('Escape')
        return {'inainte': {k: a[k] for k in ('text', 'titlu', 'docs')}, 'dupa_ctrl_n': {k: x[k] for k in ('text', 'ecran', 'titlu', 'docs', 'nume')},
                'titlu_ecran': titlu_ecran(pg), 'tinte_comutare': tinte, 'f12_propune': d and d['nume_box']}
    caz('b8_ctrl_n', b8_ctrl_n)

    ctx.close(); b.close()
s.shutdown()
salveaza(R, OUT + 'rc5.json')
print('gata')
