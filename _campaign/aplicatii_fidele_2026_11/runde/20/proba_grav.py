# -*- coding: utf-8 -*-
r"""Proba rundei 20 (Word, valul B-word#2, unghiul stare_finala_erori), pe poligon — constructorul.

K1 (runde/16/critic.md:65-94): Tab / Shift+Tab nu ies din ferestrele Save As, Open, „Save this file”, „Save your changes”;
drumul PDF din m1-l03 (:192, :195, :269) făcut cu Tab dă .pdf, cu documentul neschimbat.
E* (supliment_B_word_runda20.md, „Ținta” 2): stare_finala_erori pe drumurile cu fișiere — nume greșit apoi corect, Cancel
apoi Ctrl+S, Open pe fișierul greșit apoi Ctrl+W › Don't Save, Ctrl+Z după tastare / formatare, Esc în fiecare fereastră.
După fiecare: stare() = ecranul, evenimentele §4, asistentul §6.3.

Server static pe 127.0.0.1, port liber; Chromium headless; ruta abandonează tot ce nu e 127.0.0.1/localhost (regula 24);
gesturi reale (page.keyboard / page.mouse). Nu atinge Word real, nici serverul viu, nici ecranul omului.
    python -X utf8 -B .../runde/20/proba_grav.py [--iesire <fisier.json>] [--radacina <sit>] [--doar K1,E2]
Ultima linie = numărul de verificări picate (0 = toate trec). Cod 0 / 1.
"""
import argparse
import os
import sys
import traceback

sys.dont_write_bytecode = True
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from h20 import *  # noqa: E402,F401,F403
from playwright.sync_api import sync_playwright  # noqa: E402

REZ = []
DOAR = []


def caz(_n, ok, **det):
    REZ.append({"caz": _n, "ok": bool(ok), **det})
    print(("TRECE " if ok else "PICĂ  ") + _n + ("" if ok else "  " + json.dumps(det, ensure_ascii=False, default=str)[:900]))


def ruleaza(nume, fn):
    if DOAR and not any(nume.startswith(d) for d in DOAR):
        return
    try:
        fn()
    except Exception as e:  # o verificare care se prăbușește = picată
        caz(nume + ":eroare", False, eroare=repr(e)[:300], tb=traceback.format_exc()[-600:])


JS_BUTON = r"""(et) => { %s
  const R = document.querySelector('[data-lh-aplicatie="word"]');
  const d = R.querySelector('.lh-ap-strat-dialog [data-lh-suprafata^="dialog"]');
  if (!d) return null;
  const x = [...d.querySelectorAll('[data-lh-eticheta]')].filter(vis).find(y => y.getAttribute('data-lh-eticheta') === et);
  if (!x) return null;
  const b = x.getBoundingClientRect();
  return [b.x, b.y, b.width, b.height];
}""" % VIZ

# ecranul = starea: paragrafele desenate în pagină și bucățile îngroșate de pe ecran
JS_ECRAN = r"""() => {
  const R = document.querySelector('[data-lh-aplicatie="word"]');
  const ps = [...R.querySelectorAll('[data-lh-tinta="text"][data-lh-id]')];
  const text = ps.map(p => (p.innerText || '').replace(/¶/g, '').replace(/\n$/, ''));
  const bold = [...R.querySelectorAll('[data-lh-tinta="text"] *')].filter(x => x.children.length === 0 &&
      (x.textContent || '').trim() && parseInt(getComputedStyle(x).fontWeight, 10) >= 600).map(x => x.textContent);
  const titlu = [...R.querySelectorAll('[data-lh-tip="TitleBar"], .lh-ap-titlu')].map(x => (x.innerText || '').trim()).filter(Boolean);
  return {text, bold, titlu: titlu.slice(0, 2)};
}"""


def buton(pg, et):
    r = pg.evaluate(JS_BUTON, et)
    if not r:
        return None
    pg.mouse.click(r[0] + r[2] / 2, r[1] + r[3] / 2)
    pg.wait_for_timeout(300)
    return r


def ecran(pg):
    return pg.evaluate(JS_ECRAN)


def tab_pana_la(pg, et, maxim=25, inapoi=False):
    """Tab (sau Shift+Tab) până când focusul e pe controlul cu eticheta `et`; întoarce drumul"""
    drum = []
    for _ in range(maxim):
        tasta(pg, 'Shift+Tab' if inapoi else 'Tab', asteapta=60)
        f = foc(pg)
        drum.append(foc_scurt(pg))
        if f['eticheta'] == et and f['in_dialog']:
            return drum, True
    return drum, False


def ocol_ferestre(pg, deschide_fereastra, cerute, nume):
    """Tab ×15 și Shift+Tab ×8: focusul rămâne în fereastră; ocolul trece prin controalele cerute; evenimentele Tab
    au acțiunea `mutare_focus` (nu `fara_efect`)"""
    deschide_fereastra()
    d0 = dlg(pg)
    start = foc(pg)
    golev(pg)
    inainte, inapoi = [], []
    for _ in range(15):
        tasta(pg, 'Tab', asteapta=60)
        inainte.append(foc(pg))
    for _ in range(8):
        tasta(pg, 'Shift+Tab', asteapta=60)
        inapoi.append(foc(pg))
    ev = evs(pg)
    d1 = dlg(pg)
    toate = inainte + inapoi
    # ocolul întreg: Tab până când focusul revine pe controlul de pornire (cel mult 80); trebuie să treacă prin cele cerute
    # (corectat după pornire: ocolul Save As / Open are peste 23 de opriri, deci Tab ×15 + Shift+Tab ×8 nu revine în File name)
    ocol = []
    for _ in range(80):
        tasta(pg, 'Tab', asteapta=40)
        f = foc(pg)
        ocol.append(f)
        if f['eticheta'] == start['eticheta'] and f['tip'] == start['tip'] and f['in_dialog']:
            break
    inchis = bool(ocol) and ocol[-1]['eticheta'] == start['eticheta'] and ocol[-1]['in_dialog']
    vazute = {f['eticheta'] for f in toate + ocol if f['in_dialog']}
    lipsa = [c for c in cerute if c not in vazute]
    afara_ocol = [i for i, f in enumerate(ocol) if not f['in_dialog']]
    afara = [i for i, f in enumerate(toate) if not f['in_dialog']]
    ev_tab = [e for e in ev if e.startswith('tasta_tab|')]
    ev_rau = [e for e in ev_tab if e.split('|')[1] != 'mutare_focus']
    ok = d0 is not None and d1 is not None and not afara and not lipsa and len(ev_tab) == 23 and not ev_rau and inchis and not afara_ocol
    caz(nume, ok, fereastra=d0 and d0['sup'], afara=afara[:5], lipsa=lipsa, start=start['eticheta'], ocol_inchis=inchis,
        opriri_ocol=len(ocol), ocol_intreg=[str(f['eticheta']) for f in ocol], afara_ocol=afara_ocol[:5],
        ocol=[('D' if f['in_dialog'] else '-') + ':' + str(f['eticheta']) for f in inainte],
        inapoi=[('D' if f['in_dialog'] else '-') + ':' + str(f['eticheta']) for f in inapoi],
        ev_tab=len(ev_tab), ev_rau=ev_rau[:3], ramane=d1 and d1['sup'])


def cazuri(pg):
    # ================================================================== K1: Tab în ferestrele de fișiere
    def k1_pdf_cu_tab():
        """runde/16/critic.md:66 — F12, Ctrl+A, nume, Tab, Alt+↓, ↓×6, Enter, Enter → .pdf, documentul neschimbat"""
        deschide(pg, {'paragrafe': ORAR_MEU})
        tasta(pg, 'F12', asteapta=300)
        tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai_7A_orar')
        golev(pg)
        tasta(pg, 'Tab', asteapta=150)
        f_tab = foc_scurt(pg)
        tasta(pg, 'Alt+ArrowDown', asteapta=200)
        tasta(pg, 'ArrowDown', n=6, asteapta=150)
        tasta(pg, 'Enter', asteapta=300)
        d_mijloc = dlg(pg)
        tasta(pg, 'Enter', asteapta=400)
        x = obs(pg)
        ev = evs(pg)
        e = ecran(pg)
        pdf = [f for f in x['fisiere'] if f.startswith('Documente/Pop_Mihai_7A_orar.pdf:')]
        docx = [f for f in x['fisiere'] if 'Pop_Mihai_7A_orar.docx' in f]
        ok = bool(pdf) and not docx and x['text'] == ORAR_MEU and e['text'] == ORAR_MEU and not x['dlg'] and \
            f_tab == 'D:ComboBox:Save as type:' and d_mijloc and d_mijloc['sup'] == 'dialog.FileSaveAs_pdf'
        caz('K1_pdf_cu_tab', ok, focus_dupa_tab=f_tab, fereastra_dupa_primul_enter=d_mijloc and d_mijloc['sup'],
            fisiere=x['fisiere'], text=x['text'], ecran=e['text'], dlg=x['dlg'], nume=x['nume'], ev=ev)
    ruleaza('K1_pdf_cu_tab', k1_pdf_cu_tab)

    def k1b_alt_t():
        """etalonul (runde/16/critic.md:73): același drum cu Alt+T în loc de Tab"""
        deschide(pg, {'paragrafe': ORAR_MEU})
        tasta(pg, 'F12', asteapta=300)
        tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai_7A_orar')
        tasta(pg, 'Alt+t', asteapta=150)
        tasta(pg, 'Alt+ArrowDown', asteapta=200)
        tasta(pg, 'ArrowDown', n=6, asteapta=150)
        tasta(pg, 'Enter', asteapta=300)
        tasta(pg, 'Enter', asteapta=400)
        x = obs(pg)
        ok = any(f.startswith('Documente/Pop_Mihai_7A_orar.pdf:') for f in x['fisiere']) and x['text'] == ORAR_MEU and not x['dlg']
        caz('K1b_pdf_cu_alt_t', ok, fisiere=x['fisiere'], text=x['text'])
    ruleaza('K1b_pdf_cu_alt_t', k1b_alt_t)

    def k1_lectia_189_192():
        """m1-l03:189-192 cu tastele: Ctrl+S, apoi F12, Tab, Alt+↓, ↓×6, Enter, Enter → .docx cu rândul + .pdf, .docx deschis"""
        deschide(pg, {'paragrafe': ORAR + ['Marți: sport'], 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente',
                      'fisiere': [ORAR_ANA]})
        tasta(pg, 'Control+s', asteapta=300)
        tasta(pg, 'F12', asteapta=300)
        tasta(pg, 'Tab', asteapta=150)
        tasta(pg, 'Alt+ArrowDown', asteapta=200)
        tasta(pg, 'ArrowDown', n=6, asteapta=150)
        tasta(pg, 'Enter', asteapta=300)
        tasta(pg, 'Enter', asteapta=400)
        x = obs(pg)
        fis = {f.split(':')[0]: f for f in x['fisiere']}
        ok = 'Marți: sport' in fis.get('Documente/Popescu_Ana_7A_orar.docx', '') and \
            'Marți: sport' in fis.get('Documente/Popescu_Ana_7A_orar.pdf', '') and x['nume'] == 'Popescu_Ana_7A_orar.docx' and not x['dlg']
        caz('K1_lectia_189_192_cu_tab', ok, fisiere=x['fisiere'], nume=x['nume'], dlg=x['dlg'])
    ruleaza('K1_lectia_189_192_cu_tab', k1_lectia_189_192)

    ruleaza('K1_ocol_save_as', lambda: ocol_ferestre(
        pg, lambda: (deschide(pg, {'paragrafe': ORAR_MEU}), tasta(pg, 'F12', asteapta=300)),
        ['File name:', 'Save as type:', 'Save', 'Cancel'], 'K1_ocol_save_as'))
    ruleaza('K1_ocol_save_as_pdf', lambda: ocol_ferestre(
        pg, lambda: (deschide(pg, {'paragrafe': ORAR_MEU}), tasta(pg, 'F12', asteapta=300), tasta(pg, 'Alt+t'),
                     tasta(pg, 'Alt+ArrowDown', asteapta=200), tasta(pg, 'ArrowDown', n=6), tasta(pg, 'Enter', asteapta=300)),
        ['File name:', 'Save as type:', 'Save', 'Cancel', 'Options...'], 'K1_ocol_save_as_pdf'))
    ruleaza('K1_ocol_open', lambda: ocol_ferestre(
        pg, lambda: (deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': FIS3}), tasta(pg, 'Control+F12', asteapta=300)),
        ['File name:', 'Files of type:', 'Open', 'Cancel'], 'K1_ocol_open'))
    ruleaza('K1_ocol_save_this_file', lambda: ocol_ferestre(
        pg, lambda: (deschide(pg, {'paragrafe': ORAR_MEU}), tasta(pg, 'Control+s', asteapta=300)),
        ['File name', 'Save', 'Cancel'], 'K1_ocol_save_this_file'))
    ruleaza('K1_ocol_save_your_changes', lambda: ocol_ferestre(
        pg, lambda: (deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': [ORAR_ANA]}),
                     tasta(pg, 'Control+End'), scrie(pg, ' x'), tasta(pg, 'Control+w', asteapta=300)),
        ['File name', 'Save', "Don't Save", 'Cancel'], 'K1_ocol_save_your_changes'))

    def k1_litere_dupa_tab():
        """critic 16:77 — după Tab, literele nu mai ajungeau în fereastră; acum: Tab, Shift+Tab, litere → File name"""
        deschide(pg, {'paragrafe': ORAR_MEU})
        tasta(pg, 'F12', asteapta=300)
        tasta(pg, 'Tab'); tasta(pg, 'Shift+Tab')
        f = foc_scurt(pg)
        tasta(pg, 'Control+a'); scrie(pg, 'Nou_dupa_tab')
        d = dlg(pg)
        tasta(pg, 'Enter', asteapta=300)
        x = obs(pg)
        ok = f.startswith('D:') and f.endswith(':File name:') and d and d['nume_box'] == 'Nou_dupa_tab' and 'Documente/Nou_dupa_tab.docx' in [y.split(':')[0] for y in x['fisiere']]
        caz('K1_litere_dupa_tab', ok, focus=f, nume_box=d and d['nume_box'], fisiere=x['fisiere'])
    ruleaza('K1_litere_dupa_tab', k1_litere_dupa_tab)

    def k1_enter_pe_cancel():
        """Enter pe butonul cu focusul îl apasă (dlgbox-programming-considerations; ca în PowerPoint, T1): Tab până la
        Cancel + Enter = Cancel, nu Save"""
        deschide(pg, {'paragrafe': ORAR_MEU})
        tasta(pg, 'F12', asteapta=300)
        drum, gasit = tab_pana_la(pg, 'Cancel')
        golev(pg)
        tasta(pg, 'Enter', asteapta=300)
        x = obs(pg)
        ev = evs(pg)
        ok = gasit and not x['dlg'] and not x['fisiere'] and x['text'] == ORAR_MEU and x['salvate'] in (None, [], 0)
        caz('K1_enter_pe_cancel_save_as', ok, drum=drum, dlg=x['dlg'], fisiere=x['fisiere'], salvate=x['salvate'], ev=ev)
    ruleaza('K1_enter_pe_cancel_save_as', k1_enter_pe_cancel)

    def k1_space_pe_cancel_open():
        deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': FIS3})
        tasta(pg, 'Control+F12', asteapta=300)
        drum, gasit = tab_pana_la(pg, 'Cancel')
        golev(pg)
        tasta(pg, ' ', asteapta=300)
        x = obs(pg)
        ev = evs(pg)
        ok = gasit and not x['dlg'] and x['docs'] == 1 and x['text'] == ORAR_MEU
        caz('K1_space_pe_cancel_open', ok, drum=drum, dlg=x['dlg'], docs=x['docs'], text=x['text'], ev=ev)
    ruleaza('K1_space_pe_cancel_open', k1_space_pe_cancel_open)

    def k1_enter_pe_dont_save():
        deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': [ORAR_ANA]})
        tasta(pg, 'Control+End'); scrie(pg, ' x')
        tasta(pg, 'Control+w', asteapta=300)
        drum, gasit = tab_pana_la(pg, "Don't Save")
        golev(pg)
        tasta(pg, 'Enter', asteapta=300)
        x = obs(pg)
        ev = evs(pg)
        fis = {f.split(':')[0]: f for f in x['fisiere']}
        ok = gasit and x['docs'] == 0 and ' x' not in fis.get('Documente/Popescu_Ana_7A_orar.docx', '') and not x['dlg']
        caz('K1_enter_pe_dont_save', ok, drum=drum, docs=x['docs'], fisiere=x['fisiere'], ev=ev)
    ruleaza('K1_enter_pe_dont_save', k1_enter_pe_dont_save)

    def k1_enter_pe_save_butonul():
        """Tab până la Save + Enter = Save (butonul cu focusul), cu numele din File name"""
        deschide(pg, {'paragrafe': ORAR_MEU})
        tasta(pg, 'F12', asteapta=300)
        tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai_7A_tab')
        drum, gasit = tab_pana_la(pg, 'Save')
        tasta(pg, 'Enter', asteapta=300)
        x = obs(pg)
        ok = gasit and 'Documente/Pop_Mihai_7A_tab.docx' in [y.split(':')[0] for y in x['fisiere']] and not x['dlg']
        caz('K1_enter_pe_save', ok, drum=drum, fisiere=x['fisiere'], dlg=x['dlg'])
    ruleaza('K1_enter_pe_save', k1_enter_pe_save_butonul)

    # ================================================================== E: stare_finala_erori pe drumurile cu fișiere
    def e1_nume_gresit_apoi_corect():
        """m1-l03:156 (nume cu semne interzise) — refuzul lasă fereastra deschisă, cu focusul în File name; corectarea salvează
        o singură dată; asistentul (pas dialog_salvare:Save) NU trece la refuz"""
        for cum in ('F12', 'Control+s'):
            deschide(pg, {'paragrafe': ORAR_MEU}, asistent={'pasi': [{'tinta': 'dialog_salvare:Save', 'indiciu': 'Save'}, {'tinta': 'text', 'indiciu': 'x'}]})
            tasta(pg, cum, asteapta=300)
            tasta(pg, 'Control+a'); scrie(pg, 'Pop:Mihai')
            tasta(pg, 'Enter', asteapta=300)
            a = obs(pg)
            f = foc_scurt(pg)
            tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai')
            tasta(pg, 'Enter', asteapta=300)
            x = obs(pg)
            e = ecran(pg)
            ok = a['dlg'] and not a['fisiere'] and f.startswith('D:') and \
                [y.split(':')[0] for y in x['fisiere']] == ['Documente/Pop_Mihai.docx'] and x['nume'] == 'Pop_Mihai.docx' and \
                x['titlu'] == 'Pop_Mihai  -  Word' and not x['dlg'] and e['text'] == ORAR_MEU and x['pas'] == 1
            # asistentul la refuz: MINOR vechi din runda 5, în aplicatii.js (comun) — numărat separat, nu e al benzii Word
            caz('MINOR_COMUN_asistent_refuz_' + cum, a['pas'] == 0, pas_dupa_refuz=a['pas'])
            caz('E1_nume_gresit_apoi_corect_' + cum, ok, dupa_refuz={'dlg': a['dlg'], 'fisiere': a['fisiere'], 'pas': a['pas'], 'focus': f, 'msg': a['msg']},
                final={'fisiere': x['fisiere'], 'nume': x['nume'], 'titlu': x['titlu'], 'dlg': x['dlg'], 'pas': x['pas'], 'ecran': e['text']})
    ruleaza('E1_nume_gresit_apoi_corect', e1_nume_gresit_apoi_corect)

    def e2_cancel_apoi_ctrl_s():
        """Cancel în Save As (clic, Esc, Tab+Enter), apoi Ctrl+S: documentul nou rămâne nesalvat, iar Ctrl+S deschide
        „Save this file” (scenarii_real/word-ctrl-s-document-nou.json); asistentul nu trece pasul Save la Cancel"""
        for cum in ('clic', 'esc', 'tab_enter'):
            deschide(pg, {'paragrafe': ORAR_MEU}, asistent={'pasi': [{'tinta': 'dialog_salvare:Save', 'indiciu': 'Save'}]})
            tasta(pg, 'F12', asteapta=300)
            if cum == 'clic':
                buton(pg, 'Cancel')
            elif cum == 'esc':
                tasta(pg, 'Escape', asteapta=300)
            else:
                tab_pana_la(pg, 'Cancel'); tasta(pg, 'Enter', asteapta=300)
            a = obs(pg)
            tasta(pg, 'Control+s', asteapta=300)
            b = obs(pg)
            ok = not a['dlg'] and not a['fisiere'] and a['nume'] in (None, 'Document1') and \
                b['dlg'] == ['dialog.save_this_file'] and not b['fisiere'] and (cum == 'tab_enter' or (a['pas'] == 0 and b['pas'] == 0))
            if cum == 'tab_enter':
                # Tab TRECE peste Save (focusul pe Save, apoi Tab): evenimentul tasta_tab are ținta = focusul din momentul tastei
                # (§4) = dialog_salvare:Save, iar asistentul comun (aplicatii.js › L.asistent: „bun” = ev.tinta === pasul) trece
                # pasul. E în aplicatii.js (comun), ca la PowerPoint; numărat separat
                caz('COMUN_asistent_tab_peste_save', a['pas'] == 0, pas_dupa_cancel=a['pas'])
            caz('E2_cancel_save_as_apoi_ctrl_s_' + cum, ok, dupa_cancel={'dlg': a['dlg'], 'fisiere': a['fisiere'], 'nume': a['nume'], 'pas': a['pas']},
                dupa_ctrl_s={'dlg': b['dlg'], 'fisiere': b['fisiere'], 'pas': b['pas']})
    ruleaza('E2_cancel_save_as_apoi_ctrl_s', e2_cancel_apoi_ctrl_s)

    def e3_open_gresit_ctrl_w():
        """Open pe fișierul greșit (tema din Desktop), o literă, Ctrl+W › Don't Save (Alt+N / Tab+Enter / clic): fișierul
        greșit neatins pe disc, documentul de dinainte rămâne activ și întreg, pe ecran; apoi Open pe fișierul bun merge"""
        for cum in ('alt_n', 'tab_enter', 'clic'):
            deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': FIS3})
            tasta(pg, 'Control+F12', asteapta=300)
            ct(pg, 'arbore:Desktop')
            dublu(pg, 'lista:tema.docx')
            a = obs(pg)
            tasta(pg, 'Control+End'); scrie(pg, 'X')
            tasta(pg, 'Control+w', asteapta=300)
            q = obs(pg)
            if cum == 'alt_n':
                tasta(pg, 'Alt+n', asteapta=300)
            elif cum == 'tab_enter':
                tab_pana_la(pg, "Don't Save"); tasta(pg, 'Enter', asteapta=300)
            else:
                buton(pg, "Don't Save")
            x = obs(pg)
            e = ecran(pg)
            fis = {f.split(':')[0]: f for f in x['fisiere']}
            ok = a['nume'] == 'tema.docx' and a['docs'] == 2 and q['dlg'] == ['dialog.save_your_changes_to_this_file'] and \
                x['docs'] == 1 and x['nume'] == 'Popescu_Ana_7A_orar.docx' and x['text'] == ORAR and e['text'] == ORAR and \
                fis.get('Desktop/tema.docx', '').endswith('["Tema"]') and not x['dlg']
            caz('E3_open_gresit_ctrl_w_dont_save_' + cum, ok, dupa_open={'nume': a['nume'], 'docs': a['docs']}, intrebare=q['dlg'],
                final={'docs': x['docs'], 'nume': x['nume'], 'text': x['text'], 'ecran': e['text'], 'tema': fis.get('Desktop/tema.docx'), 'dlg': x['dlg'], 'titlu': x['titlu']})
    ruleaza('E3_open_gresit_ctrl_w_dont_save', e3_open_gresit_ctrl_w)

    def e4_ctrl_z():
        """Ctrl+Z după tastare și după formatare: stare() = ecranul (text și aldin)"""
        deschide(pg, {'paragrafe': ['Ana are']})
        tasta(pg, 'Control+End'); scrie(pg, ' mere')
        tasta(pg, 'Control+z', asteapta=200)
        a = obs(pg); ea = ecran(pg)
        tasta(pg, 'Control+a'); tasta(pg, 'Control+b', asteapta=150)
        b = obs(pg); eb = ecran(pg)
        tasta(pg, 'Control+z', asteapta=200)
        c = obs(pg); ec = ecran(pg)
        ok = a['text'] == ea['text'] and b['text'] == eb['text'] and c['text'] == ec['text'] and \
            any(f.endswith('B') for f in b['fmt']) and bool(eb['bold']) and not any(f.endswith('B') for f in c['fmt']) and not ec['bold']
        caz('E4_ctrl_z_tastare_formatare', ok, dupa_z_tastare={'stare': a['text'], 'ecran': ea['text']},
            dupa_bold={'fmt': b['fmt'], 'ecran_bold': eb['bold']}, dupa_z_bold={'fmt': c['fmt'], 'ecran_bold': ec['bold'], 'text': c['text'], 'ecran': ec['text']})
    ruleaza('E4_ctrl_z_tastare_formatare', e4_ctrl_z)

    FERESTRE = [
        ('save_as', lambda: (deschide(pg, {'paragrafe': ORAR_MEU}), tasta(pg, 'F12', asteapta=300))),
        ('save_as_dupa_tab', lambda: (deschide(pg, {'paragrafe': ORAR_MEU}), tasta(pg, 'F12', asteapta=300), tasta(pg, 'Tab', n=3))),
        ('open', lambda: (deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': FIS3}), tasta(pg, 'Control+F12', asteapta=300))),
        ('save_this_file', lambda: (deschide(pg, {'paragrafe': ORAR_MEU}), tasta(pg, 'Control+s', asteapta=300))),
        ('font', lambda: (deschide(pg, {'paragrafe': ORAR_MEU}), tasta(pg, 'Control+d', asteapta=300))),
    ]

    def e5_esc():
        """Esc în fiecare fereastră: se închide, nimic scris, focusul înapoi în document (o literă ajunge în document)"""
        for nume, f in FERESTRE:
            f()
            a = obs(pg)
            golev(pg)
            tasta(pg, 'Escape', asteapta=300)
            ev = evs(pg)
            tasta(pg, 'Control+End'); scrie(pg, 'Q')
            x = obs(pg)
            e = ecran(pg)
            # fișierele de după Esc = cele de dinainte (conținutul ferestrei Open pornește cu FIS3; corectat după pornire)
            ok = bool(a['dlg']) and not x['dlg'] and x['fisiere'] == a['fisiere'] and x['text'] == [ORAR_MEU[0], ORAR_MEU[1] + 'Q'] and e['text'] == x['text']
            caz('E5_esc_' + nume, ok, deschis=a['dlg'], dupa={'dlg': x['dlg'], 'fisiere': x['fisiere'], 'text': x['text'], 'ecran': e['text']}, ev=ev)
    ruleaza('E5_esc', e5_esc)

    def e5_esc_intrebare():
        """Esc în „Save your changes…” = Cancel (IDCANCEL): documentul rămâne deschis, nesalvat; stare().dialog.apasat ca la clicul
        pe Cancel (scenarii_real/word-x-nesalvat-cancel.json)"""
        res = {}
        for cum in ('clic', 'esc', 'tab_esc'):
            deschide(pg, {'paragrafe': ORAR, 'nume': 'Popescu_Ana_7A_orar', 'folder': 'Documente', 'fisiere': [ORAR_ANA]})
            tasta(pg, 'Control+End'); scrie(pg, ' x')
            tasta(pg, 'Control+w', asteapta=300)
            if cum == 'clic':
                buton(pg, 'Cancel')
            else:
                if cum == 'tab_esc':
                    tasta(pg, 'Tab', n=2)
                tasta(pg, 'Escape', asteapta=300)
            s = pg.evaluate("() => { const s = LH.aplicatii.stare('word'); return {dialog: s.dialog, docs: s.documente_deschise, text: s.text}; }")
            res[cum] = s
        ok = all(r['docs'] == 1 and r['text'] == [ORAR[0], ORAR[1] + ' x'] for r in res.values()) and \
            res['esc']['dialog'] == res['clic']['dialog'] and res['tab_esc']['dialog'] == res['clic']['dialog']
        caz('E5_esc_save_your_changes_ca_cancel', ok, rezultate=res)
    ruleaza('E5_esc_save_your_changes', e5_esc_intrebare)

    # ================================================================== MINOR din runde/16/critic.md:189-192 (adăugate după pornire)
    def m1_taste_din_eticheta():
        """Alt+↑ / F5 / Alt+← / Alt+→ / Alt+L în Save As și Open: tasta e scrisă în eticheta butonului din referință
        („Până la "Desktop" (Alt + săgeată în sus)”, „Reîmprospătare "Documente" (F5)”, „Înapoi (Alt + săgeată la stânga)”
        activ:false, Tools „Alt+l”) → același efect ca clicul (mesajul central = acțiunea `nesimulat`); butonul gri: fără efect"""
        for cum, fer in (('F12', 'save_as'), ('Control+F12', 'open')):
            deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': FIS3})
            tasta(pg, cum, asteapta=300)
            rez = {}
            for k in ('Alt+ArrowUp', 'F5', 'Alt+ArrowLeft', 'Alt+ArrowRight', 'Alt+l'):
                golev(pg)
                tasta(pg, k, asteapta=200)
                rez[k] = evs(pg)
                d = dlg(pg)
                if not d:
                    tasta(pg, cum, asteapta=300)
            un = all(len(v) == 1 for v in rez.values())
            ok = un and rez['Alt+ArrowUp'][0].split('|')[1] == 'nesimulat' and 'Până la' in rez['Alt+ArrowUp'][0] and \
                rez['F5'][0].split('|')[1] == 'nesimulat' and 'Reîmprospătare' in rez['F5'][0] and \
                rez['Alt+ArrowLeft'][0].split('|')[1] == 'fara_efect' and rez['Alt+ArrowRight'][0].split('|')[1] == 'fara_efect' and \
                rez['Alt+l'][0].split('|')[1] == 'nesimulat' and 'Tools' in rez['Alt+l'][0]
            caz('M1_taste_din_eticheta_' + fer, ok, ev=rez)
    ruleaza('M1_taste_din_eticheta', m1_taste_din_eticheta)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--iesire')
    ap.add_argument('--radacina', default=WT)
    ap.add_argument('--doar', default='')
    ap.add_argument('--word-inainte', action='store_true', help='servește runde/20/inainte/word.js în locul aplicatii/word.js (doar citit)')
    a = ap.parse_args()
    DOAR.extend([x for x in a.doar.split(',') if x])
    s = server(a.radacina)
    port = s.server_address[1]
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        cx = context(b)
        if a.word_inainte:
            corp = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'inainte', 'word.js'), 'rb').read()
            cx.route('**/aplicatii/word.js*', lambda route: route.fulfill(status=200, body=corp, headers={'Content-Type': 'application/javascript; charset=utf-8', 'Cache-Control': 'no-store'}))
        pg = pagina(cx, port)
        pg.wait_for_function("window.LH && LH.aplicatii && LH.aplicatii.gata")
        erori = []
        pg.on('pageerror', lambda e: erori.append(str(e)[:300]))
        try:
            cazuri(pg)
        except Exception as e:
            caz('eroare_proba', False, eroare=repr(e)[:400])
        if erori:
            caz('erori_pagina', False, erori=erori[:5])
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
