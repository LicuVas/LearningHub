# -*- coding: utf-8 -*-
r"""Proba rundei 28 (Word, valul B-word#3, unghiul gest_tastatura, ciclul paralel D), pe poligon — constructorul.

W0* ținta 0 (supliment_B_word_runda28.md): meniul Pictures cu rândurile reale „This Device...”, „Stock Images...”,
    „Online Pictures...” sub „Insert Picture From” (runde/26/acoperire_office/capturi_word_brut.json), rândul deschide
    Insert Picture, cu mouse-ul și cu tastele de acces Alt, N, P, D; lipirea pune spațiul ca Word real
    (referinte/scenarii_real/word-copiere-lipire.json: „Ana are mere. mere”), decuparea rămâne ca realul
    (word-decupare-lipire.json: „Plecăm luni.Aduceți apă. ”), Ctrl+Z ia lipirea într-un singur pas.
AS* ținta 1, asistentul comun (aplicatii.js › L.asistent): (a) refuzul nu face pasul; (b) Alt+↓ care doar deschide lista nu
    e greșeală; (c) tastarea într-un câmp de text nu e greșeală; un pas cu `asteapta` hotărăște singur; greșelile adevărate
    (clic în gol, tastarea în document) cheamă tot indiciul după 2, pe Word, Excel, PowerPoint, Explorer, Windows.
M2  ținta 2 (critic 24, MINOR 2): pe laptopul la 125 % lista Save as type e micșorată odată cu fereastra.
M1  ținta 3 (critic 24, MINOR 1): casetele Font / Font Size și butoanele lor ▾ la locul din referinte/uia_word.json (±1 px
    față de caseta din jur, ±2 px față de fereastră).

Server static pe 127.0.0.1, port liber; Chromium headless; ruta abandonează tot ce nu e 127.0.0.1/localhost (regula 24);
gesturi reale (page.keyboard / page.mouse). Nu atinge Word real, nici serverul viu, nici ecranul omului.
    python -X utf8 -B .../runde/28/proba_grav.py [--iesire <fisier.json>] [--doar W0,AS]
Ultima linie = numărul de verificări picate (0 = toate trec). Cod 0 / 1.
"""
import argparse
import json
import os
import sys
import traceback

sys.dont_write_bytecode = True
AICI = os.path.dirname(os.path.abspath(__file__))
D = os.path.dirname(os.path.dirname(AICI))
sys.path.insert(0, os.path.join(AICI, 'probe'))
from hc20 import server, doar_local, pagina, deschide, tasta, scrie, salveaza, evs, golev, FIS3, ORAR_ANA  # noqa: E402
from playwright.sync_api import sync_playwright  # noqa: E402

REZ = []
DOAR = []
ORAR_MEU = ['Orarul meu', 'Marți: sport']
IND = "() => ({pas: window.__asist ? window.__asist.pas() : null, indicii: [...document.querySelectorAll('[data-lh-indiciu]')].filter(e => e.getBoundingClientRect().width > 0).map(e => e.getAttribute('data-lh-pentru'))})"
CANON = "const canon=e=>{const t=e.getAttribute('data-lh-tinta')||'',id=e.getAttribute('data-lh-id');return t.includes(':')||id==null||id===''?t:t+':'+id};"
GOALE = """([a,n])=>{const r=document.querySelector('[data-lh-aplicatie="'+a+'"]');if(!r)return [];""" + CANON + """
  const viz=e=>{const b=e.getBoundingClientRect();if(b.width<4||b.height<4)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'};
  const z=[...r.querySelectorAll('[data-lh-zona]')].filter(viz)[0];if(!z)return [];
  const b=z.getBoundingClientRect(),x0=Math.max(b.left,0)+3,x1=Math.min(b.right,innerWidth)-3,y0=Math.max(b.top,0)+3,y1=Math.min(b.bottom,innerHeight)-3;
  const goale=[];for(let j=1;j<=9;j++)for(let i=1;i<=13;i++){const x=Math.round(x0+(x1-x0)*i/14),y=Math.round(y0+(y1-y0)*j/10),e=document.elementFromPoint(x,y);
    if(!e||!r.contains(e))continue;const t=e.closest('[data-lh-tinta]'),c=t&&r.contains(t)?canon(t):'';if(!c||t===z||!z.contains(t))goale.push({x,y,tinta:c||null})}
  return goale.slice(0,n||4)}"""


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


INAINTE = os.environ.get('LH_R28_INAINTE') == '1'   # 1 = word.js și aplicatii.js din runde/28/inainte/ (pornirea rundei)


def ctx_nou(b, w=1366, h=768, dsf=1):
    c = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=dsf)
    c.route("**/*", doar_local)
    if INAINTE:
        for nume in ('word.js', 'aplicatii.js'):
            with open(os.path.join(AICI, 'inainte', nume), encoding='utf-8') as f:
                corp = f.read()
            def raspuns(corp):
                return lambda route: route.fulfill(status=200, content_type='application/javascript; charset=utf-8', body=corp)
            c.route('**/aplicatii/' + nume + '*', raspuns(corp))
    return c


def app_nou(b, port, a, w=1366, h=768):
    c = ctx_nou(b, w, h)
    pg = c.new_page()
    pg.goto(f'http://127.0.0.1:{port}/aplicatii/poligon.html?aplicatie={a}')
    pg.wait_for_function("window.LH && LH.aplicatii")
    pg.wait_for_function(f"() => !!document.querySelector('[data-lh-aplicatie=\"{a}\"]')", timeout=20000)
    pg.wait_for_timeout(800)
    pg.evaluate("() => { window.__lhAplicatieEv = window.__lhAplicatieEv || []; }")
    return c, pg


def st(pg, app='word'):
    return pg.evaluate("a => LH.aplicatii.stare(a)", app)


def ind(pg):
    return pg.evaluate(IND)


def asist(pg, app, pasi):
    """pasi: listă de ținte (str) sau de obiecte {tinta, asteapta_js} — asteapta_js = corpul unei funcții (ev) => bool"""
    pg.evaluate("""([a, p]) => { if (window.__asist && window.__asist.opreste) try { window.__asist.opreste(); } catch (e) {};
      window.__asist = LH.aplicatii.asistent(a, {pasi: p.map(t => typeof t === 'string' ? {tinta: t, indiciu: 'i:' + t}
        : Object.assign({tinta: t.tinta, indiciu: 'i:' + t.tinta}, t.asteapta_js ? {asteapta: new Function('ev', t.asteapta_js)} : {})),
        dupaGreseli: 2, dupaSecunde: 300}); }""", [app, pasi])


def rect_sel(pg, sel):
    return pg.evaluate("s => { const e = [...document.querySelectorAll(s)].find(x => x.getBoundingClientRect().width > 0); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }", sel)


def clic_r(pg, r, asteapta=250):
    pg.mouse.click(r[0] + r[2] / 2, r[1] + r[3] / 2)
    pg.wait_for_timeout(asteapta)


def clic_tinta(pg, tinta, app='word', asteapta=250):
    r = pg.evaluate("([a, t]) => { const e = LH.aplicatii.element(a, t); if (!e) return null; e.scrollIntoView({block: 'nearest'}); const b = e.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }", [app, tinta])
    if r:
        clic_r(pg, r, asteapta)
    return r


def dialoguri(pg):
    return pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=\"word\"] .lh-ap-strat-dialog [data-lh-suprafata]')].map(d => d.getAttribute('data-lh-suprafata')).filter(x => /^dialog/.test(x))")


def fisiere(pg):
    return [f['folder'] + '/' + f['nume'] for f in (st(pg).get('fisiere') or [])]


def fila_insert(pg):
    return clic_r(pg, rect_sel(pg, '[data-lh-aplicatie="word"] [data-lh-tip="TabItem"][data-lh-eticheta="Insert"]'))


def meniu_randuri(pg):
    return pg.evaluate("() => { const m = document.querySelector('[data-lh-aplicatie=\"word\"] .lh-ap-meniu'); if (!m) return null; return {randuri: [...m.querySelectorAll('[data-lh-tinta]')].map(x => [x.getAttribute('data-lh-tinta'), x.innerText.trim()]), antet: [...m.querySelectorAll('.lh-ap-meniu-antet')].map(x => x.innerText.trim())}; }")


# ------------------------------------------------------------------ W0: ținta 0
def w0_pictures(pg):
    deschide(pg, {'paragrafe': ['Vulcanul', ''], 'cursor': 9})
    fila_insert(pg)
    golev(pg)
    clic_tinta(pg, 'mso:FlyoutAnchorInsertPictures')
    m = meniu_randuri(pg)
    asteptat = [['meniu:This Device...', 'This Device...'], ['meniu:Stock Images...', 'Stock Images...'], ['meniu:Online Pictures...', 'Online Pictures...']]
    caz('W0a_pictures_randurile_reale', bool(m) and m['randuri'] == asteptat and m['antet'] == ['Insert Picture From'], meniu=m, ev=evs(pg))
    golev(pg)
    clic_tinta(pg, 'meniu:This Device...', asteapta=400)
    caz('W0b_this_device_deschide_insert_picture', dialoguri(pg) == ['dialog.PictureInsertFromFile'], dlg=dialoguri(pg), ev=evs(pg))


def w0_taste_acces(pg):
    deschide(pg, {'paragrafe': ['Vulcanul', ''], 'cursor': 9})
    golev(pg)
    for kk in ('Alt', 'n', 'p'):
        tasta(pg, kk, asteapta=250)
    insigne = pg.evaluate("() => [...document.querySelectorAll('[data-lh-aplicatie=\"word\"] .lh-ap-keytip')].map(x => x.textContent)")
    tasta(pg, 'd', asteapta=400)
    e = evs(pg)
    caz('W0c_alt_n_p_d_deschide_insert_picture', dialoguri(pg) == ['dialog.PictureInsertFromFile'] and all(x in insigne for x in ('D', 'S', 'O')) and
        any(x.startswith('tasta_acces|') and '|meniu:This Device...' in x for x in e), dlg=dialoguri(pg), insigne=insigne, ev=e)


def w0_lipire(pg):
    deschide(pg, {'paragrafe': ['Ana are mere.'], 'selectie': {'de_la': 8, 'pana_la': 12}})
    tasta(pg, 'Control+c'); tasta(pg, 'End'); tasta(pg, 'Control+v', asteapta=250)
    t1 = st(pg)['text']
    caz('W0d_lipire_pune_spatiul_ca_word', t1 == ['Ana are mere. mere'], text=t1, real=['Ana are mere. mere'])
    tasta(pg, 'Control+z', asteapta=250)
    t2 = st(pg)['text']
    caz('W0e_ctrl_z_ia_lipirea_intr_un_pas', t2 == ['Ana are mere.'], text=t2)
    deschide(pg, {'paragrafe': ['Aduceți apă. Plecăm luni.'], 'selectie': {'de_la': 13, 'pana_la': 25}})
    tasta(pg, 'Control+x'); tasta(pg, 'Home'); tasta(pg, 'Control+v', asteapta=250)
    t3 = st(pg)['text']
    caz('W0f_decupare_ramane_ca_realul', t3 == ['Plecăm luni.Aduceți apă. '], text=t3, real=['Plecăm luni.Aduceți apă. '])
    deschide(pg, {'paragrafe': ['Ana are mere.'], 'selectie': {'de_la': 8, 'pana_la': 12}})
    tasta(pg, 'Control+c'); tasta(pg, 'End')
    clic_tinta(pg, 'mso:Paste', asteapta=300)
    t4 = st(pg)['text']
    caz('W0g_lipire_din_panglica_la_fel', t4 == ['Ana are mere. mere'], text=t4)


# ------------------------------------------------------------------ GT: unghiul gest_tastatura (support.microsoft.com/en-us/office/
# keyboard-shortcuts-in-word-95ef89dd-7142-4b50-afb2-f762f663ceb2, citit 21.11.2026)
def gt_taste(pg):
    def sel():
        s = st(pg).get('selectie') or {}
        return [s.get('de_la'), s.get('pana_la')]
    # „Delete one word to the left. | Ctrl+Backspace”
    deschide(pg, {'paragrafe': ['Ana are mere'], 'cursor': 12})
    golev(pg)
    tasta(pg, 'Control+Backspace', asteapta=200)
    t1, e1 = st(pg)['text'], evs(pg)
    caz('GT1_ctrl_backspace_sterge_un_cuvant', t1 == ['Ana are '] and e1 and e1[-1].startswith('tasta_backspace|stergere|'), text=t1, ev=e1)
    tasta(pg, 'Control+z', asteapta=200)
    caz('GT1b_ctrl_z_il_pune_inapoi', st(pg)['text'] == ['Ana are mere'], text=st(pg)['text'])
    # „Delete one word to the right. | Ctrl+Delete”
    deschide(pg, {'paragrafe': ['Ana are mere'], 'cursor': 0})
    tasta(pg, 'Control+Delete', asteapta=200)
    caz('GT2_ctrl_delete_sterge_un_cuvant', st(pg)['text'] == ['are mere'], text=st(pg)['text'])
    # „Move the cursor down / up by one paragraph. | Ctrl+Down / Ctrl+Up arrow key”
    deschide(pg, {'paragrafe': ['Unu doi', 'Trei patru', 'Cinci'], 'cursor': 2})
    tasta(pg, 'Control+ArrowDown', asteapta=150)
    s1 = sel()
    tasta(pg, 'Control+ArrowDown', asteapta=150)
    s2 = sel()
    tasta(pg, 'Control+ArrowUp', asteapta=150)
    s3 = sel()
    caz('GT3_ctrl_jos_sus_un_paragraf', s1 == [8, 8] and s2 == [19, 19] and s3 == [8, 8], dupa_jos=s1, dupa_jos2=s2, dupa_sus=s3)
    tasta(pg, 'Control+Shift+ArrowDown', asteapta=150)
    caz('GT3b_ctrl_shift_jos_selecteaza_paragraful', sel() == [8, 19], sel=sel())
    # Ctrl+Home / Ctrl+End (aceeași pagină: „Move the cursor to the beginning / end of the document”)
    tasta(pg, 'Control+End', asteapta=150)
    a = sel()
    tasta(pg, 'Control+Home', asteapta=150)
    caz('GT4_ctrl_home_end', a == [24, 24] and sel() == [0, 0], end=a, home=sel())


# ------------------------------------------------------------------ AS: asistentul
def as_a_refuz(pg):
    fis = FIS3
    for cum in ('Enter', 'clic'):
        deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': fis})
        tasta(pg, 'F12', asteapta=400)
        asist(pg, 'word', ['dialog_salvare:Save', 'document'])
        tasta(pg, 'Control+a'); scrie(pg, 'Pop:Mihai')
        n0 = len(fisiere(pg))
        golev(pg)
        if cum == 'Enter':
            tasta(pg, 'Enter', asteapta=300)
        else:
            clic_tinta(pg, 'dialog_salvare:Save', asteapta=300)
        a = ind(pg)
        caz('AS_a_nume_interzis_nu_face_pasul_' + cum, a['pas'] == 0 and dialoguri(pg) and len(fisiere(pg)) == n0, asist=a, ev=evs(pg), dlg=dialoguri(pg))
    # „already exists” + clic pe Save (m1-l03:157), apoi numele bun + Enter
    deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': fis})
    tasta(pg, 'F12', asteapta=400)
    asist(pg, 'word', ['dialog_salvare:Save', 'document'])
    tasta(pg, 'Control+a'); scrie(pg, 'Popescu_Ana_7A_orar')
    golev(pg)
    clic_tinta(pg, 'dialog_salvare:Save', asteapta=300)
    a = ind(pg)
    e = evs(pg)
    caz('AS_a_already_exists_nu_face_pasul', a['pas'] == 0 and dialoguri(pg), asist=a, ev=e, dlg=dialoguri(pg))
    tasta(pg, 'Control+a'); scrie(pg, 'Popescu_Ana_7A_orar1')
    tasta(pg, 'Enter', asteapta=400)
    a = ind(pg)
    caz('AS_a_salvarea_buna_face_pasul', a['pas'] == 1 and 'Documente/Popescu_Ana_7A_orar1.docx' in fisiere(pg), asist=a, fisiere=fisiere(pg))


def as_b_alt_jos(pg):
    deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': FIS3})
    tasta(pg, 'F12', asteapta=400)
    asist(pg, 'word', ['meniu:PDF (*.pdf)', 'dialog_salvare:Save'])
    jurnal = []
    for key in ('Tab', 'Alt+ArrowDown', 'Escape', 'Alt+ArrowDown'):
        golev(pg)
        tasta(pg, key, asteapta=250)
        jurnal.append([key, evs(pg), ind(pg)])
    a = ind(pg)
    caz('AS_b_alt_jos_deschide_lista_nu_e_greseala', not a['indicii'] and a['pas'] == 0, asist=a, jurnal=jurnal)
    tasta(pg, 'ArrowDown', n=6, asteapta=150)
    tasta(pg, 'Enter', asteapta=300)
    caz('AS_b_pdf_ales_face_pasul', ind(pg)['pas'] == 1, asist=ind(pg), tip=st(pg).get('dialog_salvare'))


def as_c_camp_word(pg):
    deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': FIS3})
    tasta(pg, 'F12', asteapta=400)
    asist(pg, 'word', ['dialog_salvare:Save', 'document'])
    golev(pg)
    tasta(pg, 'Control+a'); scrie(pg, 'Pop_Mihai_7A_orax'); tasta(pg, 'Backspace'); scrie(pg, 'r')
    a = ind(pg)
    e = evs(pg)
    caz('AS_c_tastarea_in_file_name_nu_e_greseala', not a['indicii'] and a['pas'] == 0, asist=a, ev=e[:6] + ['…'] + e[-3:])
    tasta(pg, 'Enter', asteapta=400)
    caz('AS_c_enter_salveaza_face_pasul', ind(pg)['pas'] == 1 and 'Documente/Pop_Mihai_7A_orar.docx' in fisiere(pg), asist=ind(pg), fisiere=fisiere(pg))
    # asteapta hotărăște singur: pasul care așteaptă tastarea în File name e făcut de prima literă
    deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': FIS3})
    tasta(pg, 'F12', asteapta=400)
    asist(pg, 'word', [{'tinta': 'camp:nume_fisier', 'asteapta_js': "return ev.gest === 'tastare';"}, 'dialog_salvare:Save'])
    scrie(pg, 'a')
    caz('AS_c_asteapta_hotaraste_singur', ind(pg)['pas'] == 1, asist=ind(pg))
    # tastarea în DOCUMENT rămâne greșeală
    deschide(pg, {'paragrafe': ['Ana are mere']})
    asist(pg, 'word', ['mso:Bold'])
    golev(pg)
    scrie(pg, 'xy')
    a = ind(pg)
    caz('AS_c_tastarea_in_document_ramane_greseala', a['indicii'] == ['mso:Bold'] or a['indicii'] == ['panglica:Home/Font/Bold'], asist=a, ev=evs(pg))


def as_c_windows(b, port):
    c, pg = app_nou(b, port, 'windows')
    try:
        pg.evaluate("() => document.querySelector('[data-lh-aplicatie=\"windows\"]').focus()")
        asist(pg, 'windows', ['bara_activitati:Start', 'start:Paint'])
        golev(pg)
        tasta(pg, 'Meta', asteapta=500)
        jurnal = []
        for lit in 'pai':
            scrie(pg, lit)
            jurnal.append([lit, ind(pg)])
        a = ind(pg)
        caz('AS_c_windows_pai_fara_indiciu_pe_drumul_bun', a['pas'] == 1 and not a['indicii'], asist=a, jurnal=jurnal, ev=evs(pg))
        tasta(pg, 'Enter', asteapta=600)
        caz('AS_c_windows_enter_face_pasul_paint', ind(pg)['pas'] == 2, asist=ind(pg), ev=evs(pg)[-2:])
    finally:
        c.close()


def as_c_excel_celula(b, port):
    c, pg = app_nou(b, port, 'excel')
    try:
        pg.evaluate("() => document.querySelector('[data-lh-aplicatie=\"excel\"]').focus()")
        asist(pg, 'excel', ['mso:Bold'])
        golev(pg)
        scrie(pg, 'ab')
        a = ind(pg)
        caz('AS_c_excel_tastarea_in_celula_ramane_greseala', bool(a['indicii']) and a['pas'] == 0, asist=a, ev=evs(pg))
    finally:
        c.close()


def as_e_greseala_adevarata(b, port, a, T):
    c, pg = app_nou(b, port, a)
    try:
        if a == 'word':
            deschide(pg, {'paragrafe': ['Ana are mere'], 'fisiere': FIS3})
        asist(pg, a, [T])
        pts = pg.evaluate(GOALE, [a, 4])
        if a == 'excel':   # Excel n-are loc gol fără țintă: greșeala = clic pe o celulă oarecare (critic 24 › A6: celula:F2, celula:R2)
            pts = [dict(zip(('x', 'y'), pg.evaluate("t => { const e = LH.aplicatii.element('excel', t); const b = e.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }", t)), tinta=t) for t in ('celula:F2', 'celula:R2')]
        if len(pts) < 2:
            caz('AS_e_%s_clic_in_gol_de_doua_ori' % a, False, eroare='n-am găsit 2 locuri goale', pts=pts)
            return
        golev(pg)
        pg.mouse.click(pts[0]['x'], pts[0]['y']); pg.wait_for_timeout(450)
        d1 = ind(pg)
        p2 = pts[2 if len(pts) > 2 else 1]
        pg.mouse.click(p2['x'], p2['y']); pg.wait_for_timeout(650)
        d2 = ind(pg)
        caz('AS_e_%s_clic_in_gol_de_doua_ori' % a, not d1['indicii'] and len(d2['indicii']) == 1, dupa_1=d1, dupa_2=d2, ev=evs(pg))
    finally:
        c.close()


def as_b_explorer_navigare(b, port):
    """Alt+↑ / Alt+← care schimbă folderul rămân greșeli (starea se schimbă)"""
    c, pg = app_nou(b, port, 'explorer')
    try:
        pg.evaluate("() => document.querySelector('[data-lh-aplicatie=\"explorer\"]').focus()")
        cale0 = json.dumps(st(pg, 'explorer'), ensure_ascii=False)[:0]
        asist(pg, 'explorer', ['bara_comenzi:Nou'])
        golev(pg)
        tasta(pg, 'Alt+ArrowUp', asteapta=300)
        tasta(pg, 'Alt+ArrowLeft', asteapta=400)
        a = ind(pg)
        e = evs(pg)
        schimbat = [x for x in e if x.startswith('alt_sageti|') and '|fara_efect|' not in x]
        caz('AS_b_explorer_alt_sageti_care_navigheaza_raman_greseli', len(schimbat) == 2 and len(a['indicii']) == 1, asist=a, ev=e, _=cale0)
    finally:
        c.close()


# ------------------------------------------------------------------ M2 / M1
def m2_lista_laptop(b, port):
    c = ctx_nou(b, 1093, 526)
    pg = pagina(c, port)
    try:
        deschide(pg, {'paragrafe': ORAR_MEU, 'fisiere': FIS3})
        tasta(pg, 'F12', asteapta=400)
        clic_tinta(pg, 'camp:tip_fisier', asteapta=350)
        m = pg.evaluate("""() => { const R = document.querySelector('[data-lh-aplicatie="word"]');
          const d = R.querySelector('.lh-ap-strat-dialog [data-lh-suprafata^="dialog"]'), l = R.querySelector('.lh-ap-lista-ref');
          const cb = R.querySelector('[data-lh-tinta="camp:tip_fisier"]');
          if (!d || !l || !cb) return null; const bd = d.getBoundingClientRect(), bl = l.getBoundingClientRect(), bc = cb.getBoundingClientRect();
          const rand = l.querySelector('[data-lh-tip="ListItem"]'), br = rand ? rand.getBoundingClientRect() : null;
          const rcb = cb.querySelector('input') || cb; const fcb = rcb.getBoundingClientRect();
          return {dialog: [bd.x, bd.y, bd.width, bd.height], lista: [bl.x, bl.y, bl.width, bl.height], caseta: [bc.x, bc.y, bc.width, bc.height],
                  rand_h: br ? br.height : null, transform_dialog: getComputedStyle(d).transform, R: [R.clientWidth, R.clientHeight]}; }""")
        ok = bool(m) and m['lista'][0] + m['lista'][2] <= m['dialog'][0] + m['dialog'][2] + 1 and abs(m['lista'][2] - m['caseta'][2]) <= 3 and \
            m['lista'][1] >= -1 and m['lista'][1] + m['lista'][3] <= m['R'][1] + 1
        caz('M2_lista_tip_micsorata_cu_fereastra_pe_laptop', ok, masura=m)
        # rândul PDF cu mouse-ul, apoi Save: tot scrie .pdf
        r = pg.evaluate("() => { const x = [...document.querySelectorAll('.lh-ap-lista-ref [data-lh-tip=\"ListItem\"]')].find(e => /^PDF/.test(e.getAttribute('data-lh-eticheta') || '')); if (!x) return null; const b = x.getBoundingClientRect(); return [b.x, b.y, b.width, b.height]; }")
        if r:
            clic_r(pg, r, 300)
        clic_tinta(pg, 'dialog_salvare:Save', asteapta=400)
        caz('M2_pdf_cu_mouse_pe_laptop_scrie_pdf', any(f.endswith('.pdf') for f in fisiere(pg)), rand=r, fisiere=fisiere(pg))
        # 1366x768: lista are dreptunghiul de azi (lățimea casetei)
    finally:
        c.close()


def m1_font(pg):
    deschide(pg, {'paragrafe': ['Ana are mere']})
    with open(os.path.join(D, 'referinte', 'uia_word.json'), encoding='utf-8') as f:
        ref = json.load(f)
    want = {}

    def walk(n, path):
        if isinstance(n, dict):
            e = n.get('eticheta') or ''
            if e in ('Font', 'Font Size', 'Open') and 'Font' in path and n.get('rect_css'):
                want.setdefault(path.split('/')[-1] if e == 'Open' else e, {})[n.get('tip')] = n['rect_css']
            for k, v in n.items():
                if isinstance(v, (dict, list)):
                    walk(v, path + '/' + str(e or k))
        elif isinstance(n, list):
            for x in n:
                walk(x, path)
    walk(ref['suprafete']['panglica.TabHome'], '')
    sim = pg.evaluate("""() => { const R = document.querySelector('[data-lh-aplicatie="word"]'), W = R.getBoundingClientRect(), o = {};
      R.querySelectorAll('[data-lh-id-mso="Font"], [data-lh-id-mso="FontSize"]').forEach(cb => {
        const k = cb.getAttribute('data-lh-id-mso') === 'Font' ? 'Font' : 'Font Size', f = x => { const b = x.getBoundingClientRect(); return [b.x - W.x, b.y - W.y, b.width, b.height]; };
        o[k] = {ComboBox: f(cb)}; [...cb.children].forEach(c => { const t = c.getAttribute('data-lh-tip'); if (t) o[k][t] = f(c); }); });
      return o; }""")
    abateri = []
    for k in ('Font', 'Font Size'):
        rc, sc = want[k]['ComboBox'], sim[k]['ComboBox']
        for t in ('Edit', 'Button'):
            r, s = want[k][t], sim[k].get(t)
            if not s:
                abateri.append([k, t, 'lipsă'])
                continue
            rel = [round((s[0] - sc[0]) - (r[0] - rc[0]), 1), round((s[1] - sc[1]) - (r[1] - rc[1]), 1)]
            ab = [round(s[0] - r[0], 1), round(s[1] - r[1], 1)]
            if max(map(abs, rel)) > 1 or max(map(abs, ab)) > 2:
                abateri.append([k, t, 'față de casetă', rel, 'față de fereastră', ab])
    caz('M1_casetele_font_la_locul_din_referinta', not abateri, abateri=abateri, sim=sim, ref=want)


def main():
    global DOAR
    ap = argparse.ArgumentParser()
    ap.add_argument('--iesire')
    ap.add_argument('--doar', default='')
    a = ap.parse_args()
    DOAR = [x for x in a.doar.split(',') if x]
    s = server()
    port = s.server_address[1]
    erori = []
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        c = ctx_nou(b)
        pg = pagina(c, port)
        pg.on('pageerror', lambda e: erori.append(str(e)[:200]))
        ruleaza('W0_pictures', w0_pictures, pg)
        ruleaza('W0_taste_acces', w0_taste_acces, pg)
        ruleaza('W0_lipire', w0_lipire, pg)
        ruleaza('GT', gt_taste, pg)
        ruleaza('AS_a', as_a_refuz, pg)
        ruleaza('AS_b_word', as_b_alt_jos, pg)
        ruleaza('AS_c_word', as_c_camp_word, pg)
        ruleaza('M1', m1_font, pg)
        c.close()
        ruleaza('AS_b_explorer', as_b_explorer_navigare, b, port)
        ruleaza('AS_c_windows', as_c_windows, b, port)
        ruleaza('AS_c_excel', as_c_excel_celula, b, port)
        for app, T in (('word', 'mso:Bold'), ('excel', 'mso:Bold'), ('powerpoint', 'mso:Bold'), ('explorer', 'bara_comenzi:Nou'), ('windows', 'bara_activitati:Start')):
            ruleaza('AS_e_' + app, as_e_greseala_adevarata, b, port, app, T)
        ruleaza('M2', m2_lista_laptop, b, port)
        b.close()
    s.shutdown()
    caz('ZZ_fara_erori_de_pagina', not erori, erori=erori[:5])
    pic = sum(1 for r in REZ if not r['ok'])
    if a.iesire:
        salveaza({'rezultate': REZ, 'picate': pic}, a.iesire)
    print(pic)
    return 1 if pic else 0


if __name__ == '__main__':
    sys.exit(main())
