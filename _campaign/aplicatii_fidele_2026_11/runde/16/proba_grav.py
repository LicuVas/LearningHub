# -*- coding: utf-8 -*-
r"""Proba celor 8 GRAV deschise din runde/5/critic.md (S1, S2, S5, S4, S6, S3, T6, T5), pe poligon — runda 16, constructorul.

Server static pe 127.0.0.1, port liber; Chromium headless; ruta abandonează tot ce nu e 127.0.0.1/localhost (regula 24);
gesturi reale (page.keyboard / page.mouse). Ce cere fiecare caz e citat lângă el (critic 5, com_r5.json = Word real prin COM,
uia_word.json, lecția m1-l03). Nu atinge Word real, nici serverul viu.
    python -X utf8 -B .../runde/16/proba_grav.py [--iesire <fisier.json>] [--radacina <sit>]
Ultima linie = numărul de verificări picate (0 = toate trec). Cod 0 / 1.
"""
import argparse
import os
import sys
import traceback

sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from h16 import *  # noqa: E402,F401,F403
from playwright.sync_api import sync_playwright  # noqa: E402

REZ = []


def caz(_n, ok, **det):
    REZ.append({"caz": _n, "ok": bool(ok), **det})
    print(("TRECE " if ok else "PICĂ  ") + _n + ("" if ok else "  " + json.dumps(det, ensure_ascii=False, default=str)[:600]))


def ruleaza(nume, fn):
    try:
        fn()
    except Exception as e:  # o verificare care se prăbușește = picată
        caz(nume + ":eroare", False, eroare=repr(e)[:300], tb=traceback.format_exc()[-600:])


def adresa(d):
    """bara de adrese: eticheta ToolBar-ului „Adresă: X” și textul vizibil al butonului folderului"""
    if not d:
        return None
    et = (d.get("adr_eticheta") or "").replace("Adresă: ", "")
    ecran = [x for x in d.get("adr_ecran") or [] if x]
    return et if (ecran and ecran[-1] == et) else (et + " / ecran=" + "|".join(ecran))


def fara_functioneaza(msg):
    return not any("funcționează" in m for m in msg or [])


def cazuri(pg):
    # ------------------------------------------------------------------ S1: bara de adrese urmează folderul ales
    def s1_saveas():
        deschide(pg, {'paragrafe': ['Lucrare'], 'fisiere': FIS3})
        tasta(pg, 'F12', asteapta=300)
        pasi = []
        for f in ('Descărcări', 'Desktop', 'Documente', 'Desktop'):
            ct(pg, 'arbore:' + f)
            d = dlg(pg)
            pasi.append({'clic': f, 'adresa': adresa(d), 'nav_ales': d and d['nav_ales']})
        ct(pg, 'camp:nume_fisier'); tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai_7A_lucrare'); tasta(pg, 'Enter', asteapta=300)
        x = obs(pg)
        ok = all(p['adresa'] == p['clic'] and p['nav_ales'] == [p['clic']] for p in pasi) and x['folder'] == 'Desktop'
        caz('S1_saveas_bara_adrese', ok, pasi=pasi, folder_salvat=x['folder'])
    ruleaza('S1_saveas_bara_adrese', s1_saveas)

    def s1_open():
        deschide(pg, {'paragrafe': [''], 'fisiere': FIS3})
        tasta(pg, 'Control+F12', asteapta=300)
        pasi = []
        for f in ('Descărcări', 'Documente', 'Desktop', 'Descărcări'):
            ct(pg, 'arbore:' + f)
            d = dlg(pg)
            pasi.append({'clic': f, 'adresa': adresa(d), 'lista': [r['text'] for r in d['lista']]})
        ok = all(p['adresa'] == p['clic'] for p in pasi) and pasi[0]['lista'] == ['club-lectura'] and pasi[2]['lista'] == ['tema']
        caz('S1_open_bara_adrese', ok, pasi=pasi)
    ruleaza('S1_open_bara_adrese', s1_open)

    # ------------------------------------------------------------------ S2: F12 pe document deschis din alt folder
    def deschide_club():
        deschide(pg, {'paragrafe': [''], 'fisiere': FIS3})
        tasta(pg, 'Control+w', asteapta=250)
        tasta(pg, 'Control+F12', asteapta=300)
        ct(pg, 'arbore:Descărcări')
        dublu(pg, 'lista:club-lectura.docx')

    def s2_f12_folder_doc():
        deschide_club()
        a = obs(pg)
        tasta(pg, 'F12', asteapta=300)
        d = dlg(pg)
        ct(pg, 'camp:nume_fisier'); tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai_7A_club'); tasta(pg, 'Enter', asteapta=300)
        x = obs(pg)
        ok = a['folder'] == 'Descărcări' and adresa(d) == 'Descărcări' and d['nav_ales'] == ['Descărcări'] and x['folder'] == 'Descărcări'
        caz('S2_f12_in_folderul_documentului', ok, deschis=a['folder'], adresa_f12=adresa(d), nav=d['nav_ales'], salvat_in=x['folder'], nume=x['nume'])
    ruleaza('S2_f12_in_folderul_documentului', s2_f12_folder_doc)

    def s2_modificat():
        deschide_club()
        tasta(pg, 'Control+End'); scrie(pg, ' Pop Mihai')
        tasta(pg, 'F12', asteapta=300)
        d = dlg(pg)
        tasta(pg, 'Escape')
        # documentul pornit deja salvat, prin conținut (nume + folder): la fel
        deschide(pg, {'paragrafe': CLUB, 'nume': 'club-lectura', 'folder': 'Descărcări', 'fisiere': FIS3})
        tasta(pg, 'F12', asteapta=300)
        d2 = dlg(pg)
        ok = adresa(d) == 'Descărcări' and adresa(d2) == 'Descărcări'
        caz('S2_f12_modificat_si_din_continut', ok, modificat=adresa(d), din_continut=adresa(d2))
    ruleaza('S2_f12_modificat_si_din_continut', s2_modificat)

    def s2_lectia_documente():
        """m1-l03:273 „F12 › Documente › File name”: drumul lecției salvează în Documente (regres)"""
        deschide_club()
        tasta(pg, 'Control+End'); scrie(pg, ' Pop Mihai')
        tasta(pg, 'F12', asteapta=300)
        ct(pg, 'arbore:Documente')
        ct(pg, 'camp:nume_fisier'); tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai_7A_club'); tasta(pg, 'Enter', asteapta=300)
        x = obs(pg)
        nou = obs(pg)
        deschide(pg, {'paragrafe': ['Tema mea'], 'fisiere': FIS3})
        tasta(pg, 'F12', asteapta=300)
        d = dlg(pg)
        ok = x['folder'] == 'Documente' and x['nume'] == 'Pop_Mihai_7A_club.docx' and adresa(d) == 'Documente' and \
            any(f.startswith('Descărcări/club-lectura.docx') and 'Pop Mihai' not in f for f in nou['fisiere'])
        caz('S2_regres_lectia_documente_si_document_nou', ok, salvat=[x['folder'], x['nume']], nou_f12=adresa(d))
    ruleaza('S2_regres_lectia_documente_si_document_nou', s2_lectia_documente)

    # ------------------------------------------------------------------ S5: lista ferestrei Save As = fișierele folderului
    def s5_lista():
        deschide(pg, {'paragrafe': ['Orarul meu', 'Luni: sport'], 'modificat': True,
                      'fisiere': [ORAR_ANA, {'folder': 'Documente', 'nume': 'Pop_Mihai_7A_compunere', 'text': ['x']},
                                  {'folder': 'Descărcări', 'nume': 'club-lectura', 'text': CLUB}]})
        tasta(pg, 'F12', asteapta=300)
        d = dlg(pg)
        texte = [r['text'] for r in d['lista']]
        golev(pg)
        ct(pg, 'lista:Popescu_Ana_7A_orar.docx')
        x = obs(pg)
        e = evs(pg)
        box = dlg(pg)['nume_box'] if dlg(pg) else None
        ct(pg, 'arbore:Descărcări')
        d2 = dlg(pg)
        ok = sorted(texte) == ['Pop_Mihai_7A_compunere', 'Popescu_Ana_7A_orar'] and box in ('Popescu_Ana_7A_orar', 'Popescu_Ana_7A_orar.docx') \
            and fara_functioneaza(x['msg']) and [r['text'] for r in d2['lista']] == ['club-lectura']
        caz('S5_saveas_lista_fisierele_folderului', ok, lista=texte, clic_rand={'nume_box': box, 'msg': x['msg'], 'ev': e[-1:]},
            lista_descarcari=[r['text'] for r in d2['lista']])
    ruleaza('S5_saveas_lista_fisierele_folderului', s5_lista)

    def s5_greseala_colegei():
        """m1-l03:171-172: clic pe fișierul colegei + Save NU îl înlocuiește (T2 rămâne): mesaj, fișierul neatins"""
        deschide(pg, {'paragrafe': ['Orarul meu', 'Marți: sport'], 'modificat': True, 'fisiere': [ORAR_ANA]})
        tasta(pg, 'F12', asteapta=300)
        ct(pg, 'lista:Popescu_Ana_7A_orar.docx')
        ct(pg, 'dialog_salvare:Save')
        x = obs(pg)
        ana = [f for f in x['fisiere'] if 'Popescu_Ana_7A_orar.docx' in f]
        ok = ana and 'Marți' not in ana[0] and x['dlg'] and x['msg'] and x['nume'] is None
        caz('S5_clic_pe_fisierul_colegei_nu_inlocuieste', ok, ana=ana, msg=x['msg'], dlg=x['dlg'], nume=x['nume'])
    ruleaza('S5_clic_pe_fisierul_colegei_nu_inlocuieste', s5_greseala_colegei)

    # ------------------------------------------------------------------ S4: același fișier deschis a doua oară
    def s4_atelier():
        deschide(pg, {'paragrafe': [''], 'fisiere': FIS3})
        tasta(pg, 'Control+w', asteapta=250)
        for _ in range(2):
            tasta(pg, 'Control+F12', asteapta=300); ct(pg, 'arbore:Descărcări'); dublu(pg, 'lista:club-lectura.docx')
        a = obs(pg)
        tasta(pg, 'Control+End'); scrie(pg, ' Pop Mihai')
        tasta(pg, 'F12', asteapta=300); ct(pg, 'arbore:Documente')
        ct(pg, 'camp:nume_fisier'); tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai_7A_club'); tasta(pg, 'Enter', asteapta=300)
        tasta(pg, 'Control+w', asteapta=300)
        x = obs(pg)
        ok = a['docs'] == 1 and a['titlu'] == 'club-lectura  -  Word' and x['docs'] == 0 and x['titlu'] == 'Word'
        caz('S4_deschis_de_doua_ori_atelier', ok, dupa_a_doua_deschidere=[a['docs'], a['titlu']], dupa_ctrl_w=[x['docs'], x['titlu']])
    ruleaza('S4_deschis_de_doua_ori_atelier', s4_atelier)

    def s4_modificat():
        """munca elevului nu se ascunde sub versiunea de pe disc (rc5.json › b4_deja_deschis); din Open și din Recent"""
        out = {}
        for cale in ('open', 'recent'):
            deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': [ORAR_ANA],
                          'recente': [{'folder': 'Documente', 'nume': 'Popescu_Ana_7A_orar'}]})
            tasta(pg, 'Control+End'); tasta(pg, 'Enter'); scrie(pg, 'Marți: sport')
            if cale == 'open':
                tasta(pg, 'Control+F12', asteapta=300); dublu(pg, 'lista:Popescu_Ana_7A_orar.docx')
            else:
                tasta(pg, 'Control+o', asteapta=300)
                rr = [t for t in tinte(pg) if t.startswith('backstage:') and 'Popescu_Ana_7A_orar' in t]
                if rr:
                    ct(pg, rr[0])
            x = obs(pg)
            out[cale] = {'docs': x['docs'], 'text': x['text'], 'dlg': x['dlg'], 'bs': x['bs']}
        ok = all(v['docs'] == 1 and 'Marți: sport' in (v['text'] or []) and not v['dlg'] and not v['bs'] for v in out.values())
        caz('S4_deschis_iar_modificat_munca_ramane', ok, **out)
    ruleaza('S4_deschis_iar_modificat_munca_ramane', s4_modificat)

    def s4_in_spate():
        """fișierul deschis e în altă fereastră (după Ctrl+N): Open îl aduce în față, fără a treia fereastră"""
        deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': [ORAR_ANA]})
        tasta(pg, 'Control+n', asteapta=250)
        scrie(pg, 'Nou')
        tasta(pg, 'Control+F12', asteapta=300); dublu(pg, 'lista:Popescu_Ana_7A_orar.docx')
        x = obs(pg)
        tasta(pg, 'Control+w', asteapta=300)
        y = obs(pg)
        ok = x['docs'] == 2 and x['titlu'] == 'Popescu_Ana_7A_orar  -  Word' and y['docs'] == 1 and y['text'] == ['Nou']
        caz('S4_deschis_in_alta_fereastra_vine_in_fata', ok, dupa_open=[x['docs'], x['titlu']], dupa_ctrl_w=[y['docs'], y['titlu'], y['text']])
    ruleaza('S4_deschis_in_alta_fereastra_vine_in_fata', s4_in_spate)

    # ------------------------------------------------------------------ S6: Document2, Document3…
    def s6_ctrl_n():
        deschide(pg, {'paragrafe': ['Excursie la Bicaz'], 'modificat': True})
        a = obs(pg)
        tasta(pg, 'Control+n', asteapta=250)
        x = obs(pg)
        tasta(pg, 'F12', asteapta=300)
        box = (dlg(pg) or {}).get('nume_box')
        tasta(pg, 'Escape')
        tasta(pg, 'Control+n', asteapta=250)
        y = obs(pg)
        ok = a['titlu'] == 'Document1  -  Word' and x['titlu'] == 'Document2  -  Word' and x['docs'] == 2 and x['text'] == [''] \
            and y['titlu'] == 'Document3  -  Word' and y['docs'] == 3 and box == 'Doc2.docx'
        caz('S6_ctrl_n_numerotare', ok, titluri=[a['titlu'], x['titlu'], y['titlu']], docs=[x['docs'], y['docs']], f12_gol=box)
    ruleaza('S6_ctrl_n_numerotare', s6_ctrl_n)

    def s6_dupa_inchidere():
        """com_r5.json: nou1 Document1, nou2 Document2, nou3_dupa_inchiderea_tuturor Document3; File › Blank document la fel"""
        deschide(pg, {'paragrafe': ['']})
        tasta(pg, 'Control+n', asteapta=250)                      # Document2
        tasta(pg, 'Control+w', asteapta=250); tasta(pg, 'Control+w', asteapta=250)   # nemodificate → docs 0
        a = obs(pg)
        tasta(pg, 'Control+n', asteapta=250)
        x = obs(pg)
        ct(pg, 'fila:File'); pg.wait_for_timeout(250)
        ct(pg, 'backstage:Blank document'); pg.wait_for_timeout(250)
        y = obs(pg)
        ok = a['docs'] == 0 and x['titlu'] == 'Document3  -  Word' and y['titlu'] == 'Document4  -  Word' and y['docs'] == 2
        caz('S6_dupa_inchiderea_tuturor_si_blank', ok, inainte=a['docs'], ctrl_n=x['titlu'], blank=[y['titlu'], y['docs']])
    ruleaza('S6_dupa_inchiderea_tuturor_si_blank', s6_dupa_inchidere)

    # ------------------------------------------------------------------ S3: nume cu semne interzise
    def s3_nume():
        out = {}
        for nume in ('Pop_Mihai:7A', 'Pop?Mihai', 'Pop*Mihai', 'Pop"Mihai', 'Pop<Mihai', 'Pop>Mihai', 'Pop|Mihai', 'Pop/Mihai', 'Pop\\Mihai'):
            deschide(pg, {'paragrafe': ['Orarul meu'], 'modificat': True})
            tasta(pg, 'F12', asteapta=300)
            tasta(pg, 'Control+a'); scrie(pg, nume); tasta(pg, 'Enter', asteapta=300)
            x = obs(pg)
            out[nume] = {'nume': x['nume'], 'fisiere': x['fisiere'], 'msg': x['msg'], 'dlg': x['dlg'], 'titlu': x['titlu']}
        ok = all(v['nume'] is None and not v['fisiere'] and v['msg'] and fara_functioneaza(v['msg']) and v['dlg'] for v in out.values())
        caz('S3_nume_interzise_f12', ok, **{k: v for k, v in out.items() if not (v['nume'] is None and not v['fisiere'] and v['msg'] and fara_functioneaza(v['msg']) and v['dlg'])})
    ruleaza('S3_nume_interzise_f12', s3_nume)

    def s3_alte_drumuri():
        """Save this file (Ctrl+S pe document nou), PDF, butonul Save; apoi un nume bun trece"""
        out = {}
        deschide(pg, {'paragrafe': ['Orarul meu'], 'modificat': True})
        tasta(pg, 'Control+s', asteapta=300)
        ct(pg, 'camp:nume_fisier'); tasta(pg, 'Control+a'); scrie(pg, 'Pop?Mihai'); ct(pg, 'dialog_salvare:Save')
        x = obs(pg); out['save_this_file'] = {'nume': x['nume'], 'fisiere': x['fisiere'], 'msg': x['msg'], 'dlg': x['dlg']}
        deschide(pg, {'paragrafe': ['Orarul meu'], 'modificat': True})
        tasta(pg, 'F12', asteapta=300)
        ct(pg, 'camp:tip_fisier'); ct(pg, 'meniu:PDF (*.pdf)')
        ct(pg, 'camp:nume_fisier'); tasta(pg, 'Control+a'); scrie(pg, 'Orar:7A'); ct(pg, 'dialog_salvare:Save')
        x = obs(pg); out['pdf'] = {'salvate': x['salvate'], 'fisiere': x['fisiere'], 'msg': x['msg'], 'dlg': x['dlg']}
        ct(pg, 'camp:nume_fisier'); tasta(pg, 'Control+a'); scrie(pg, 'Orar_7A'); ct(pg, 'dialog_salvare:Save')
        y = obs(pg); out['dupa_nume_bun'] = {'salvate': y['salvate'], 'dlg': y['dlg']}
        ok = (out['save_this_file']['nume'] is None and not out['save_this_file']['fisiere'] and out['save_this_file']['dlg'] and out['save_this_file']['msg']
              and fara_functioneaza(out['save_this_file']['msg'])
              and not out['pdf']['salvate'] and out['pdf']['dlg'] and out['pdf']['msg'] and fara_functioneaza(out['pdf']['msg'])
              and out['dupa_nume_bun']['salvate'] == ['Orar_7A.pdf'] and not out['dupa_nume_bun']['dlg'])
        caz('S3_nume_interzise_alte_drumuri', ok, **out)
    ruleaza('S3_nume_interzise_alte_drumuri', s3_alte_drumuri)

    # ------------------------------------------------------------------ T6: Alt+↓ poartă `activat`, ca la mouse
    PASI_FS = [{'tinta': 'meniu_derulant:Home/Font/Font Size', 'indiciu': 'Deschide lista'}, {'tinta': 'meniu:20', 'indiciu': 'Alege 20'}]

    def t6_scenariu():
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}},
                 asistent={'pasi': PASI_FS, 'dupaGreseli': 2, 'dupaSecunde': 600})
        jurnal = []
        clic_sel(pg, '[data-lh-aplicatie="word"] [data-lh-id-mso="FontSize"] input')
        jurnal.append(['clic caseta', obs(pg)['pas']])
        golev(pg)
        tasta(pg, 'Alt+ArrowDown', asteapta=250)
        e_alt = evs(pg)
        jurnal.append(['Alt+↓', obs(pg)['pas'], e_alt[-1:]])
        tasta(pg, 'ArrowDown', n=5)
        tasta(pg, 'Enter', asteapta=300)
        x = obs(pg)
        jurnal.append(['Enter', x['pas'], x['indicii']])
        ok = x['pas'] == 2 and not x['indicii'] and 'are@20' in x['fmt'] and any(s.endswith('|meniu_derulant:Home/Font/Font Size') for s in e_alt)
        caz('T6_font_size_tastatura_scenariu', ok, jurnal=jurnal, fmt=x['fmt'])
    ruleaza('T6_font_size_tastatura_scenariu', t6_scenariu)

    def t6_keytips():
        """Alt, H, F, S pune cursorul în Font Size; apoi Alt+↓ / ↓ / Enter — același rezultat"""
        deschide(pg, {'paragrafe': ['Ana are mere'], 'selectie': {'de_la': 4, 'pana_la': 7}},
                 asistent={'pasi': PASI_FS, 'dupaGreseli': 2, 'dupaSecunde': 600})
        tasta(pg, 'Alt'); scrie(pg, 'h'); scrie(pg, 'f'); scrie(pg, 's')
        tasta(pg, 'Alt+ArrowDown', asteapta=250)
        tasta(pg, 'ArrowDown', n=5)
        tasta(pg, 'Enter', asteapta=300)
        x = obs(pg)
        caz('T6_font_size_keytips', x['pas'] == 2 and not x['indicii'] and 'are@20' in x['fmt'], pas=x['pas'], indicii=x['indicii'], fmt=x['fmt'])
    ruleaza('T6_font_size_keytips', t6_keytips)

    def t6_alte_liste():
        """aceeași tastă în celelalte casete cu ▾ ale lui Word: Alt+↓ = clic pe ▾ (aceeași acțiune, `activat` = ținta ▾)"""
        out = {}
        # Save As › Save as type (uia_word.json: Button „Deschidere”, tasta_acces „Alt+Săgeată în jos”)
        deschide(pg, {'paragrafe': ['Orar'], 'modificat': True})
        tasta(pg, 'F12', asteapta=300)
        ct(pg, 'camp:tip_fisier'); tasta(pg, 'Escape', asteapta=150)    # lista deschisă de clic → Esc o închide
        golev(pg)
        tasta(pg, 'Alt+t'); tasta(pg, 'Alt+ArrowDown', asteapta=250)
        e = evs(pg)
        lst = pg.evaluate("() => !!document.querySelector('[data-lh-aplicatie=\"word\"] .lh-ap-lista-ref')")
        out['save_as_type'] = {'ev': e[-1:], 'lista': lst}
        tasta(pg, 'Escape', asteapta=150); tasta(pg, 'Escape', asteapta=150)
        # caseta Font (nume) din Home: clicul pe ▾ dă mesajul central (lista nu e în referință) — tasta trebuie să dea același lucru
        deschide(pg, {'paragrafe': ['Ana are mere']})
        golev(pg)
        ct(pg, 'meniu_derulant:Home/Font/Font')
        e_m = evs(pg)
        clic_sel(pg, '[data-lh-aplicatie="word"] [data-lh-id-mso="Font"] input')
        golev(pg)
        tasta(pg, 'Alt+ArrowDown', asteapta=250)
        e_t = evs(pg)
        out['font'] = {'mouse': e_m[-1:], 'tastatura': e_t[-1:]}
        ok_sat = bool(e) and e[-1].split('|')[3] != '' and lst
        ok_font = bool(e_t) and bool(e_m) and e_t[-1].split('|')[1] == e_m[-1].split('|')[1] and e_t[-1].split('|')[3] == e_m[-1].split('|')[2]
        caz('T6_alte_liste_alt_jos', ok_sat and ok_font, **out)
    ruleaza('T6_alte_liste_alt_jos', t6_alte_liste)

    # ------------------------------------------------------------------ T5: fără document, panglica gri
    def fara_doc():
        deschide(pg, {'paragrafe': ['']})
        tasta(pg, 'Control+w', asteapta=300)

    GRI = """() => { const R = document.querySelector('[data-lh-aplicatie="word"] .lh-ap-loc-panglica');
        const g = id => { const x = R.querySelector('[data-lh-id-mso="' + id + '"]'); return x ? x.getAttribute('aria-disabled') === 'true' : null; };
        const toate = [...R.querySelectorAll('[data-lh-tip="Button"],[data-lh-tip="SplitButton"],[data-lh-tip="ComboBox"],[data-lh-tip="CheckBox"],[data-lh-tip="MenuItem"]')];
        const file = [...document.querySelectorAll('[data-lh-aplicatie="word"] [data-lh-tip="TabItem"]')].filter(t => t.getAttribute('aria-disabled') === 'true').map(t => t.getAttribute('data-lh-eticheta'));
        const fs = R.querySelector('[data-lh-id-mso="FontSize"] input');
        return {Bold: g('Bold'), Italic: g('Italic'), FontSize: g('FontSize'), Paste: g('Paste'), active: toate.filter(x => x.getAttribute('aria-disabled') !== 'true').map(x => x.getAttribute('data-lh-eticheta')).slice(0, 12),
                total: toate.length, file_gri: file, fs_input_dezactivat: fs ? (fs.disabled || fs.readOnly) : null}; }"""

    def t5_gri():
        fara_doc()
        a = obs(pg)
        g = pg.evaluate(GRI)
        ct(pg, 'fila:Insert'); pg.wait_for_timeout(150)
        g2 = pg.evaluate(GRI)
        ct(pg, 'fila:Home'); pg.wait_for_timeout(150)
        ok = a['docs'] == 0 and g['Bold'] and g['Italic'] and g['FontSize'] and g['Paste'] and not g['active'] and not g['file_gri'] \
            and not g2['active'] and g['fs_input_dezactivat']
        caz('T5_fara_document_panglica_gri', ok, docs=a['docs'], home=g, insert={'active': g2['active'], 'total': g2['total']})
    ruleaza('T5_fara_document_panglica_gri', t5_gri)

    def t5_mesaje():
        fara_doc()
        out = {}
        golev(pg)
        ct(pg, 'mso:Bold')
        out['clic_bold'] = {'msg': obs(pg)['msg'], 'ev': evs(pg)[-1:]}
        for k in ('Control+b', 'F12', 'Control+s', 'Shift+F12', 'Control+w', 'Control+z', 'Control+a', 'Control+p'):
            golev(pg)
            tasta(pg, k, asteapta=200)
            x = obs(pg)
            out[k] = {'msg': x['msg'], 'dlg': x['dlg'], 'docs': x['docs'], 'ev': evs(pg)[-1:]}
        tasta(pg, 'Alt'); scrie(pg, 'h'); scrie(pg, '1')
        out['keytips_bold'] = {'msg': obs(pg)['msg'], 'ev': evs(pg)[-1:]}
        tasta(pg, 'Escape')
        tasta(pg, 'Alt'); scrie(pg, 'h'); scrie(pg, 'f'); scrie(pg, 's')
        in_fs = pg.evaluate("() => !!(document.activeElement && document.activeElement.closest && document.activeElement.closest('[data-lh-id-mso=\"FontSize\"]'))")
        out['keytips_font_size'] = {'msg': obs(pg)['msg'], 'ev': evs(pg)[-1:], 'docs': 0 if not in_fs else 'FOCUS IN CASETA GRI'}
        rau = {k: v for k, v in out.items() if not fara_functioneaza(v['msg']) or v.get('dlg') or (v.get('docs') not in (None, 0))}
        caz('T5_fara_document_fara_mesaj_fals', not rau, **(rau or {'toate': 'ok'}))
    ruleaza('T5_fara_document_fara_mesaj_fals', t5_mesaje)

    def t5_raman_active():
        """com_r5.json › activ_fara_document: FileNewDefault, FileOpen = true → Ctrl+N, Ctrl+O, Ctrl+F12 merg; după Ctrl+N panglica revine"""
        fara_doc()
        tasta(pg, 'Control+o', asteapta=300)
        bs = obs(pg)['bs']
        tasta(pg, 'Escape', asteapta=200)
        tasta(pg, 'Control+F12', asteapta=300)
        d = obs(pg)['dlg']
        tasta(pg, 'Escape', asteapta=200)
        tasta(pg, 'Control+n', asteapta=300)
        g = pg.evaluate(GRI)
        scrie(pg, 'Ana')
        ct(pg, 'mso:Bold')
        x = obs(pg)
        ok = bs == 'Open' and d == ['dialog.open'] and not g['Bold'] and not g['FontSize'] and x['text'] == ['Ana'] and x['docs'] == 1 and \
            not g['fs_input_dezactivat']
        caz('T5_raman_active_si_revine_panglica', ok, ctrl_o=bs, ctrl_f12=d, dupa_ctrl_n={'Bold_gri': g['Bold'], 'FontSize_gri': g['FontSize'], 'fs_input': g['fs_input_dezactivat']}, text=x['text'])
    ruleaza('T5_raman_active_si_revine_panglica', t5_raman_active)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--iesire')
    ap.add_argument('--radacina', default=WT)
    a = ap.parse_args()
    s = server(a.radacina)
    port = s.server_address[1]
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        cx = context(b)
        pg = pagina(cx, port)
        pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
        try:
            cazuri(pg)
        except Exception as e:
            caz('eroare_proba', False, eroare=repr(e)[:400])
        cx.close()
        b.close()
    s.shutdown()
    picate = [r['caz'] for r in REZ if not r['ok']]
    if a.iesire:
        salveaza({'radacina': a.radacina, 'cazuri': REZ, 'picate': picate}, a.iesire)
    print('picate:', picate)
    print(len(picate))
    return 1 if picate else 0


if __name__ == '__main__':
    sys.exit(main())
