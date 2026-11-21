# -*- coding: utf-8 -*-
r"""Proba rundei 24 (Word, valul B-word#2, unghiul aspect), pe poligon — constructorul.

AS* asistentul comun (runde/20/critic.md:99-110, supliment_B_word_runda24.md › Ținta 1): Tab (`tasta_tab` /
    `mutare_focus`) nu bifează pasul și nu e greșeală; drumul PDF din m1-l03 făcut cu tastele: bula nu apare după pașii
    buni, pasul Save se bifează doar la salvarea adevărată; Tab în fereastra PowerPoint; Tab în DOCUMENT rămâne greșeală.
MN* MINOR-urile Word din runde/20/critic.md:170-184: Alt+F4 într-o fereastră = Cancel; mesajul de eroare dispare la
    salvarea reușită; fereastra mică (1366x657 la 125% = 1093x526 css): Save / Cancel și rândul PDF din lista Save as type
    în ecran; la 1366x768 fereastra Save As are dreptunghiurile de azi (referința).

Server static pe 127.0.0.1, port liber; Chromium headless; ruta abandonează tot ce nu e 127.0.0.1/localhost (regula 24);
gesturi reale (page.keyboard / page.mouse). Nu atinge Word real, nici serverul viu, nici ecranul omului.
    python -X utf8 -B .../runde/24/proba_grav.py [--iesire <fisier.json>] [--doar AS,MN1]
Ultima linie = numărul de verificări picate (0 = toate trec). Cod 0 / 1.
"""
import argparse
import json
import os
import sys
import traceback

sys.dont_write_bytecode = True
AICI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AICI, 'probe'))
from hc20 import server, doar_local, pagina, deschide, tasta, scrie, salveaza, evs, golev, rect, FIS3, ORAR_ANA  # noqa: E402
from p20a import foc  # noqa: E402
from p20b import asist, apas, tab_pana  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

REZ = []
DOAR = []
FIS = FIS3 + [{'folder': 'Documente', 'nume': 'Pop_Mihai_7A_compunere', 'text': ['x']}]


def caz(_n, ok, **det):
    REZ.append({"caz": _n, "ok": bool(ok), **det})
    print(("TRECE " if ok else "PICĂ  ") + _n + ("" if ok else "  " + json.dumps(det, ensure_ascii=False, default=str)[:900]))


def ruleaza(nume, fn, *a):
    if DOAR and not any(nume.startswith(d) for d in DOAR):
        return
    try:
        fn(*a)
    except Exception as e:  # o verificare care se prăbușește = picată
        caz(nume + ":eroare", False, eroare=repr(e)[:300], tb=traceback.format_exc()[-600:])


def ctx_nou(b, w=1366, h=768, dsf=1):
    c = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=dsf)
    c.route("**/*", doar_local)
    return c


def st(pg, app='word'):
    return pg.evaluate("a => LH.aplicatii.stare(a)", app)


def nfis(pg):
    return len(st(pg).get('fisiere') or [])


def dlg(pg):
    return pg.evaluate("() => [...document.querySelectorAll('.lh-ap-strat-dialog [data-lh-suprafata]')].map(d => d.getAttribute('data-lh-suprafata')).filter(x => /^dialog/.test(x))")


def mesaje(pg):
    return pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie] [data-lh-nesimulat]:not([data-lh-tip])')].filter(m => m.isConnected && m.getBoundingClientRect().width > 0).map(m => m.getAttribute('data-lh-nesimulat'))")


def asist_app(pg, app, pasi):
    pg.evaluate("([a, p]) => { if (window.__asist && window.__asist.opreste) try { window.__asist.opreste(); } catch (e) {}; window.__asist = LH.aplicatii.asistent(a, {pasi: p.map(t => ({tinta: t, indiciu: 'i:' + t})), dupaGreseli: 2, dupaSecunde: 300}); }", [app, pasi])


def k(pg, key, n=1, asteapta=200):
    golev(pg)
    tasta(pg, key, n=n, asteapta=asteapta)
    return evs(pg)


# ------------------------------------------------------------------ AS: asistentul
def as1_drum_pdf_taste(pg):
    """lecția m1-l03:189-192 după F12, doar cu tastele: pașii PDF, apoi Save (rc20.json › M6)"""
    deschide(pg, {'paragrafe': ['Orarul meu', 'Marți: sport'], 'fisiere': FIS})
    tasta(pg, 'F12', asteapta=400)
    asist(pg, ['meniu:PDF (*.pdf)', 'dialog_salvare:Save'])
    jurnal, bule = [], []
    for key, n in [('Tab', 1), ('Alt+ArrowDown', 1), ('ArrowDown', 6), ('Enter', 1)]:
        e = k(pg, key, n=n, asteapta=250)
        a = apas(pg)
        jurnal.append([key, e[-1:], a])
        bule += a['indicii']
    pas_pdf = apas(pg)['pas']
    n0 = nfis(pg)
    while True:
        f = foc(pg)
        if f['tip'] == 'Button' and f['et'] == 'Save' or len(jurnal) > 40:
            break
        e = k(pg, 'Tab', asteapta=80)
        a = apas(pg)
        jurnal.append(['Tab', e[-1:], a])
        bule += a['indicii']
    e = k(pg, 'Tab', asteapta=200)   # pleacă de pe Save
    a = apas(pg)
    jurnal.append(['Tab peste Save', e, a])
    bule += a['indicii']
    peste = {'pas': a['pas'], 'nfis': nfis(pg), 'dlg': dlg(pg)}
    caz('AS1a_fara_bula_dupa_pasii_buni', not bule, bule=bule, jurnal=jurnal)
    caz('AS1b_pdf_bifat_la_enter', pas_pdf == 1, pas=pas_pdf)
    caz('AS1c_tab_peste_save_nu_bifeaza', peste['pas'] == 1 and peste['nfis'] == n0 and peste['dlg'], **peste)
    tasta(pg, 'Shift+Tab', asteapta=120)
    f = foc(pg)
    e = k(pg, 'Enter', asteapta=350)
    s = st(pg)
    pdf = [x for x in (s.get('fisiere') or []) if x['nume'].endswith('.pdf')]
    caz('AS1d_save_bifat_la_salvarea_adevarata', apas(pg)['pas'] == 2 and len(pdf) == 1 and not dlg(pg),
        foc=f['et'], ev=e, pas=apas(pg)['pas'], pdf=[x['nume'] for x in pdf], dlg=dlg(pg))


def as2_tab_pana_la_cancel(pg):
    """E2 din critic 20: Tab până la Cancel trece peste Save"""
    deschide(pg, {'paragrafe': ['Poezia mea', 'Toamna vine.'], 'fisiere': FIS})
    tasta(pg, 'F12', asteapta=400)
    asist(pg, ['dialog_salvare:Save'])
    n = tab_pana(pg, 'Button', 'Cancel')
    a = apas(pg)
    caz('AS2_tab_pana_la_cancel_nu_bifeaza_save', n > 0 and a['pas'] == 0 and not a['indicii'], taburi=n, **a)
    tasta(pg, 'Escape', asteapta=200)


def as3_greselile_raman(pg):
    """Tab-urile nu sunt greșeli, dar o greșeală adevărată tot se numără: Tab ×12, F5 (mesajul central) ×1 → fără bulă; ×2 → bula pe Save"""
    deschide(pg, {'paragrafe': ['Poezia mea'], 'fisiere': FIS})
    tasta(pg, 'F12', asteapta=400)
    asist(pg, ['dialog_salvare:Save'])
    tasta(pg, 'Tab', n=12, asteapta=150)
    a0 = apas(pg)
    e1 = k(pg, 'F5', asteapta=250)
    a1 = apas(pg)
    e2 = k(pg, 'F5', asteapta=400)
    a2 = apas(pg)
    caz('AS3_tab_nu_e_greseala_dar_f5_da', not a0['indicii'] and not a1['indicii'] and a2['indicii'] == ['dialog_salvare:Save'] and a2['pas'] == 0,
        dupa_tab=a0, f5_1=[e1, a1], f5_2=[e2, a2])
    tasta(pg, 'Escape', asteapta=200)


def as4_powerpoint(pg):
    """PowerPoint: F12, Tab ×14 (peste Save) → pasul Save nebifat, fără bulă; clic pe Save → bifat"""
    pg.evaluate("async () => { if (window.__asist && window.__asist.opreste) try { window.__asist.opreste(); } catch (e) {}; await LH.aplicatii.deschide('powerpoint', {continut: {}, focus: true}); }")
    pg.wait_for_timeout(400)
    tasta(pg, 'F12', asteapta=400)
    asist_app(pg, 'powerpoint', ['dialog_salvare:Save'])
    golev(pg)
    tasta(pg, 'Tab', n=14, asteapta=200)
    ev = evs(pg)
    a = apas(pg)
    trecut = any('dialog_salvare:Save' in x for x in ev)
    r = pg.evaluate("() => { const e = LH.aplicatii.element('powerpoint', 'dialog_salvare:Save'); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }")
    if r:
        pg.mouse.click(r[0], r[1]); pg.wait_for_timeout(300)
    b2 = apas(pg)
    caz('AS4_powerpoint_tab_in_fereastra', trecut and a['pas'] == 0 and not a['indicii'] and b2['pas'] == 1,
        tab_a_trecut_peste_save=trecut, dupa_tab=a, dupa_clic=b2, ev=ev[-3:])


def as5_tab_in_document(pg):
    """Tab în DOCUMENT (scrie un tab) rămâne greșeală: 2 × Tab → bula pe Bold (regula §6.3 neschimbată în rest)"""
    deschide(pg, {'paragrafe': ['Ana are mere']})
    asist(pg, ['panglica:Home/Font/Bold'])
    tasta(pg, 'End')
    golev(pg)
    tasta(pg, 'Tab', asteapta=200)
    a1 = apas(pg)
    tasta(pg, 'Tab', asteapta=400)
    a2 = apas(pg)
    caz('AS5_tab_in_document_ramane_greseala', not a1['indicii'] and a2['indicii'] == ['panglica:Home/Font/Bold'], ev=evs(pg), a1=a1, a2=a2)


# ------------------------------------------------------------------ MN: MINOR-urile Word
def mn1_alt_f4(pg):
    # Save As, focusul în File name
    deschide(pg, {'paragrafe': ['Poezia mea', 'Toamna vine.'], 'fisiere': FIS})
    tasta(pg, 'F12', asteapta=400)
    n0 = nfis(pg)
    e = k(pg, 'Alt+F4', asteapta=300)
    d1, n1 = dlg(pg), nfis(pg)
    e2 = k(pg, 'Control+s', asteapta=400)
    ds = st(pg).get('dialog_salvare')
    caz('MN1a_alt_f4_inchide_save_as', not d1 and n1 == n0 and any('|anulare|' in x for x in e) and ds and ds.get('titlu') == 'Save this file',
        ev=e, dlg=d1, ctrl_s=[e2, ds])
    tasta(pg, 'Escape', asteapta=200)
    # Open (Ctrl+F12)
    deschide(pg, {'paragrafe': ['Ana'], 'fisiere': FIS})
    tasta(pg, 'Control+F12', asteapta=400)
    d0 = dlg(pg)
    e = k(pg, 'Alt+F4', asteapta=300)
    caz('MN1b_alt_f4_inchide_open', d0 and not dlg(pg) and st(pg).get('documente_deschise') == 1, inainte=d0, dupa=dlg(pg), ev=e)
    # „Save your changes…” (Ctrl+W pe documentul nou modificat) = Cancel: documentul rămâne
    deschide(pg, {'paragrafe': ['Ana are mere'], 'fisiere': FIS})
    tasta(pg, 'Control+End')
    scrie(pg, ' azi')
    tasta(pg, 'Control+w', asteapta=400)
    d0 = dlg(pg)
    e = k(pg, 'Alt+F4', asteapta=300)
    s = st(pg)
    caz('MN1c_alt_f4_in_save_your_changes_e_cancel', d0 and not dlg(pg) and s.get('documente_deschise') == 1 and (s.get('dialog') or {}).get('apasat') == 'Cancel'
        and s.get('text') == ['Ana are mere azi'], inainte=d0, dupa=dlg(pg), ev=e, dialog=s.get('dialog'), text=s.get('text'))


def mn2_mesaj_dispare(pg):
    deschide(pg, {'paragrafe': ['Orarul meu'], 'fisiere': FIS})
    tasta(pg, 'F12', asteapta=400)
    tasta(pg, 'Control+a'); scrie(pg, 'Pop:Mihai_7A'); tasta(pg, 'Enter', asteapta=300)
    m0 = mesaje(pg)
    tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai_7A'); tasta(pg, 'Enter', asteapta=300)
    m1 = mesaje(pg)
    s = st(pg)
    caz('MN2a_mesaj_nume_interzis_dispare_la_salvare', m0 and not m1 and s.get('nume_fisier') == 'Pop_Mihai_7A.docx', inainte=m0, dupa=m1, nume=s.get('nume_fisier'))
    deschide(pg, {'paragrafe': ['Orarul meu'], 'fisiere': FIS})
    tasta(pg, 'F12', asteapta=400)
    tasta(pg, 'Control+a'); scrie(pg, 'Popescu_Ana_7A_orar'); tasta(pg, 'Enter', asteapta=300)
    m0 = mesaje(pg)
    tasta(pg, 'End'); scrie(pg, '2'); tasta(pg, 'Enter', asteapta=300)
    m1 = mesaje(pg)
    s = st(pg)
    caz('MN2b_mesaj_already_exists_dispare_la_salvare', m0 and not m1 and s.get('nume_fisier') == 'Popescu_Ana_7A_orar2.docx', inainte=m0, dupa=m1, nume=s.get('nume_fisier'))
    # un mesaj care NU ține de salvare (Tools) nu e atins de salvarea reușită
    deschide(pg, {'paragrafe': ['Orarul meu'], 'fisiere': FIS})
    tasta(pg, 'F12', asteapta=400)
    r = rect(pg, 'fereastra:Tools')
    if r:
        pg.mouse.click(r[0] + r[2] / 2, r[1] + r[3] / 2); pg.wait_for_timeout(250)
    m0 = mesaje(pg)
    caz('MN2c_mesajul_tools_apare', bool(m0), mesaje=m0)


DR = r"""() => { const R = document.querySelector('[data-lh-aplicatie="word"]'); const b = x => { if (!x) return null; const r = x.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
  const d = R.querySelector('.lh-ap-strat-dialog [data-lh-suprafata^="dialog"]');
  const but = n => d ? [...d.querySelectorAll('[data-lh-tip="Button"][data-lh-eticheta="' + n + '"]')].map(b)[0] : null;
  const lst = R.querySelector('.lh-ap-lista-ref');
  const pdf = lst ? [...lst.querySelectorAll('[data-lh-tip="ListItem"]')].find(y => /PDF/.test(y.getAttribute('data-lh-eticheta') || '')) : null;
  return {vw: innerWidth, vh: innerHeight, root: b(R), dialog: b(d), save: but('Save'), cancel: but('Cancel'), lista: b(lst), pdf: b(pdf)}; }"""


def in_ecran(r, vw, vh):
    return bool(r) and r[0] >= 0 and r[1] >= 0 and r[0] + r[2] <= vw and r[1] + r[3] <= vh


def mn3_fereastra_mica(b):
    c = ctx_nou(b, 1093, 526, 1.25)
    pg = pagina(c, PORT)
    deschide(pg, {'paragrafe': ['Orarul meu', 'Marți: sport'], 'fisiere': FIS})
    tasta(pg, 'F12', asteapta=400)
    d0 = pg.evaluate(DR)
    caz('MN3a_mica_save_cancel_in_ecran', in_ecran(d0['save'], d0['vw'], d0['vh']) and in_ecran(d0['cancel'], d0['vw'], d0['vh']), **d0)
    n = tab_pana(pg, 'Button', 'Save')
    d1 = pg.evaluate(DR)
    caz('MN3b_mica_tab_pe_save_in_ecran', n > 0 and in_ecran(d1['save'], d1['vw'], d1['vh']), taburi=n, **d1)
    tasta(pg, 'Escape', asteapta=200)
    tasta(pg, 'F12', asteapta=400)
    cb = pg.evaluate("() => { const e = document.querySelector('.lh-ap-strat-dialog [data-lh-tinta=\"camp:tip_fisier\"]'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }")
    pg.mouse.click(cb[0], cb[1]); pg.wait_for_timeout(300)
    d2 = pg.evaluate(DR)
    ok_pdf = in_ecran(d2['pdf'], d2['vw'], d2['vh'])
    if d2['pdf']:
        pg.mouse.click(d2['pdf'][0] + d2['pdf'][2] / 2, d2['pdf'][1] + d2['pdf'][3] / 2); pg.wait_for_timeout(350)
    d3 = pg.evaluate(DR)
    if d3['save']:
        pg.mouse.click(d3['save'][0] + d3['save'][2] / 2, d3['save'][1] + d3['save'][3] / 2); pg.wait_for_timeout(350)
    salvate = st(pg).get('fisiere_salvate')
    caz('MN3c_mica_pdf_cu_mouse_fara_derulare', ok_pdf and in_ecran(d3['save'], d3['vw'], d3['vh']) and salvate and any(x.endswith('.pdf') for x in salvate),
        lista=d2, dupa_pdf=d3, salvate=salvate)
    c.close()


def mn4_1366_neschimbat(b):
    """la 1366x768 (ecranul referinței) Save As are dreptunghiurile de azi: fereastra [1,1,960,566], Save [750,518,88,26]"""
    c = ctx_nou(b)
    pg = pagina(c, PORT)
    deschide(pg, {'paragrafe': ['Orarul meu'], 'fisiere': FIS})
    tasta(pg, 'F12', asteapta=400)
    d = pg.evaluate(DR)
    caz('MN4_1366_save_as_neschimbat', d['dialog'] == [1, 1, 960, 566] and d['save'] == [750, 518, 88, 26] and d['cancel'] == [850, 518, 88, 26], **d)
    c.close()


def main():
    global PORT
    ap = argparse.ArgumentParser()
    ap.add_argument('--iesire', default=os.path.join(AICI, 'proba_grav.json'))
    ap.add_argument('--doar', default='')
    a = ap.parse_args()
    DOAR.extend([x for x in a.doar.split(',') if x])
    s = server()
    PORT = s.server_address[1]
    erori = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        c = ctx_nou(b)
        pg = pagina(c, PORT)
        pg.on('pageerror', lambda e: erori.append(str(e)[:200]))
        for nume, fn in [('AS1', as1_drum_pdf_taste), ('AS2', as2_tab_pana_la_cancel), ('AS3', as3_greselile_raman),
                         ('AS5', as5_tab_in_document), ('MN1', mn1_alt_f4), ('MN2', mn2_mesaj_dispare), ('AS4', as4_powerpoint)]:
            ruleaza(nume, fn, pg)
        c.close()
        ruleaza('MN3', mn3_fereastra_mica, b)
        ruleaza('MN4', mn4_1366_neschimbat, b)
        b.close()
    s.shutdown()
    picate = [r['caz'] for r in REZ if not r['ok']]
    salveaza({'rezultate': REZ, 'erori_pagina': erori, 'picate': picate}, a.iesire)
    caz('erori_pagina_0', not erori, erori=erori)
    picate = [r['caz'] for r in REZ if not r['ok']]
    print('picate:', picate)
    print(len(picate))
    sys.exit(1 if picate else 0)


if __name__ == '__main__':
    main()
