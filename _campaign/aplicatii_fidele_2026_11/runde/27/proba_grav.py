# -*- coding: utf-8 -*-
"""Runda 27 (B-explorer#2, ciclul paralel D, unghiul aspect) — proba țintelor din supliment, pe gesturi reale.

Secțiuni (python proba_grav.py [M4 M1 M2 REG] [--inainte] [--eticheta x]):
  M4   critic 23 › MINOR 4: Explorer montat ({loc, incadrat: true}, pagina probe/m.html); gazda își rescrie stratul cu redenumirea
       deschisă -> caseta rămâne cu textul ei, niciun nume nu se schimbă până la Enter (și nici un eveniment §4 nu pleacă);
  M1   critic 23 › MINOR 1: meniurile mai înalte decât fereastra (Nou din bară / din meniul de fundal, meniul clasic) — fiecare rând
       se poate apăsa după derularea MENIULUI cu rotița (gest real), pe fereastra mică 1093×526 @1,25, telefon 360×740, 1366×768;
  M2   critic 23 › MINOR 2: Ctrl+Z / Ctrl+Y în căutare = aceleași valori ca un <input> martor din pagină, pe aceleași taste;
  REG  regresul gesturilor vecine din poligon: redenumirea confirmată de clic pe alt rând / loc gol / căutare / Tab, Esc,
       telefonul (Nou › Folder + insertText + Enter), căutarea (filtrul, Esc, bara de stare).
--inainte = aceleași probe pe o copie a lui aplicatii/ cu explorer.js din runde/27/inainte (cifra „picate la pornire”).
Server static pe 127.0.0.1 (port liber), Chromium headless, tot ce nu e 127.0.0.1/localhost abandonat (regula 24).
Ieșirea: runde/27/probe_iesiri/proba_grav_<eticheta>.json; ULTIMA LINIE = numărul de verificări picate."""
import json, shutil, sys, tempfile
from pathlib import Path
AICI = Path(__file__).resolve().parent
sys.path.insert(0, str(AICI / 'probe'))
from h27 import Ham, WT, OUT, ev, clic, atinge, st, RAND, BARA

ARGS = sys.argv[1:]
INAINTE = '--inainte' in ARGS
if INAINTE:
    ARGS.remove('--inainte')
ETI = 'inainte' if INAINTE else 'acum'
if '--eticheta' in ARGS:
    i = ARGS.index('--eticheta'); ETI = ARGS[i + 1]; del ARGS[i:i + 2]
SECT = ARGS or ['M4', 'M1', 'M2', 'REG']
REZ = {'verificari': [], 'eticheta': ETI}

RAD, MPATH, TMP = WT, '/_campaign/aplicatii_fidele_2026_11/runde/27/probe/m.html', None
if INAINTE:
    TMP = Path(tempfile.gettempdir()) / 'r27_proba_inainte'
    if TMP.exists():
        shutil.rmtree(TMP)
    shutil.copytree(WT / 'aplicatii', TMP / 'aplicatii')
    shutil.copy(AICI / 'inainte' / 'explorer.js', TMP / 'aplicatii' / 'explorer.js')
    shutil.copy(AICI / 'probe' / 'm.html', TMP / 'm.html')
    RAD, MPATH = TMP, '/m.html'


def verif(s, nume, ok, det=None):
    REZ['verificari'].append({'sectiune': s, 'nume': nume, 'ok': bool(ok), 'detalii': det})
    print(('  ok    ' if ok else '  PICAT ') + s + ' · ' + nume + ('' if ok else '  ' + json.dumps(det, ensure_ascii=False)[:400]))


EVA = """window.__eva=[];window.addEventListener('lh-aplicatie',e=>{const d=e.detail;window.__eva.push([d.gest,d.actiune,d.tinta])});"""
CAS = """()=>{const R=document.querySelector('[data-lh-aplicatie="explorer"]');const c=R.querySelector('.lh-ap-e-ren');const a=document.activeElement;
 return {caseta:c?c.value:null,focusCaseta:!!(c&&a===c),focusIn:R.contains(a),conectat:R.isConnected}}"""


def eva(pg):
    return pg.evaluate('(()=>{const o=window.__eva.slice();window.__eva.length=0;return o})()')


def nume(pg):
    return st(pg)['nume_fisiere']


# ------------------------------------------------------------------------------------------------ M4
def sect_m4(H):
    S = 'M4'
    c = H.ctx()
    pg = c.new_page()
    pg.on('pageerror', lambda e: H.erori.append(str(e)[:300]))
    pg.add_init_script(EVA)
    pg.goto(H.baza + MPATH, wait_until='load')
    pg.wait_for_function('window.__ap&&LH.aplicatii.stare("explorer")', timeout=45000)
    pg.wait_for_timeout(400)
    eva(pg)
    n0 = nume(pg)
    # (a) gestul criticului 23: F2 pe tema, „comp”, redeseneaza()
    clic(pg, RAND % 'tema.docx'); pg.keyboard.press('F2'); pg.wait_for_timeout(150); pg.keyboard.type('comp', delay=15)
    eva(pg)
    activa = pg.evaluate('redeseneaza()'); pg.wait_for_timeout(300)
    i, e_, n1 = pg.evaluate(CAS), eva(pg), nume(pg)
    verif(S, 'a_caseta_ramane_cu_textul', activa and i['caseta'] == 'comp' and i['conectat'], {'activa': activa, 'info': i})
    verif(S, 'a_niciun_nume_schimbat', n1 == n0, {'inainte': n0, 'dupa': n1})
    verif(S, 'a_niciun_eveniment_la_mutare', e_ == [], e_)
    verif(S, 'a_focusul_in_caseta', i['focusCaseta'], i)
    pg.keyboard.type('X', delay=15); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
    n2, e2 = nume(pg), eva(pg)
    verif(S, 'a_enter_confirma_numele_intreg', 'compX.docx' in n2 and 'tema.docx' not in n2, n2)
    verif(S, 'a_enter_emite_redenumire', ['tasta_enter', 'redenumire'] in [x[:2] for x in e2], e2)
    # (b) Esc după mutare: nimic schimbat
    n0 = nume(pg)
    clic(pg, RAND % 'harta.png'); pg.keyboard.press('F2'); pg.wait_for_timeout(150); pg.keyboard.type('abc', delay=15)
    pg.evaluate('redeseneaza()'); pg.wait_for_timeout(250)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(200)
    i, n1, e_ = pg.evaluate(CAS), nume(pg), eva(pg)
    verif(S, 'b_esc_dupa_mutare_anuleaza', n1 == n0 and i['caseta'] is None and ['tasta_esc', 'anulare_redenumire'] in [x[:2] for x in e_], {'n': n1, 'i': i, 'ev': e_})
    # (c) gazda inactivă (redeseneaza(true) = fără focus()): caseta rămâne; clicul pe alt rând o confirmă, ca un clic în altă parte
    n0 = nume(pg)
    clic(pg, RAND % 'harta.png'); pg.keyboard.press('F2'); pg.wait_for_timeout(150); pg.keyboard.type('hh', delay=15)
    pg.evaluate('redeseneaza(true)'); pg.wait_for_timeout(250)
    i, n1 = pg.evaluate(CAS), nume(pg)
    verif(S, 'c_fara_focus_caseta_ramane', i['caseta'] == 'hh' and n1 == n0, {'i': i, 'n': n1})
    clic(pg, RAND % 'notite.txt'); pg.wait_for_timeout(250)
    n2, s2 = nume(pg), st(pg)
    verif(S, 'c_clic_pe_alt_rand_confirma', 'hh.png' in n2 and 'harta.png' not in n2 and pg.evaluate(CAS)['caseta'] is None, {'n': n2, 'sel': s2['selectie']})
    # (d) Folder nou (Ctrl+Shift+N) + „Ex” + mutare + Enter
    pg.keyboard.press('Control+Shift+N'); pg.wait_for_timeout(200); pg.keyboard.type('Ex', delay=15)
    pg.evaluate('redeseneaza()'); pg.wait_for_timeout(250)
    i, n1 = pg.evaluate(CAS), nume(pg)
    verif(S, 'd_folder_nou_caseta_ramane', i['caseta'] == 'Ex' and 'Folder nou/' in n1 and 'Ex/' not in n1, {'i': i, 'n': n1})
    pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
    n2 = nume(pg)
    verif(S, 'd_folder_nou_enter', 'Ex/' in n2 and 'Folder nou/' not in n2, n2)
    # (e) două mutări la rând, apoi Enter
    clic(pg, RAND % 'notite.txt'); pg.keyboard.press('F2'); pg.wait_for_timeout(150); pg.keyboard.type('n1', delay=15)
    pg.evaluate('redeseneaza()'); pg.wait_for_timeout(150); pg.evaluate('redeseneaza()'); pg.wait_for_timeout(250)
    i = pg.evaluate(CAS)
    pg.keyboard.type('2', delay=15); pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
    n2 = nume(pg)
    verif(S, 'e_doua_mutari_apoi_enter', i['caseta'] == 'n1' and 'n12.txt' in n2, {'i': i, 'n': n2})
    # (f) martorul vechi: focusul în listă + mutare -> tastele merg (critic 23 › C1)
    clic(pg, RAND % 'Proiect'); pg.wait_for_timeout(100); eva(pg)
    pg.evaluate('redeseneaza()'); pg.wait_for_timeout(250)
    pg.keyboard.press('ArrowDown'); pg.wait_for_timeout(120)
    s = st(pg)
    verif(S, 'f_lista_dupa_mutare_sageata', s['selectie'] != ['Proiect/'] and len(s['selectie']) == 1, s['selectie'])
    # (g) clic în bara gazdei cu caseta deschisă: ca înainte (confirmă; MINOR 5 rămâne, doar se notează)
    clic(pg, RAND % 'Desene'); pg.keyboard.press('F2'); pg.wait_for_timeout(150); pg.keyboard.type('Ds', delay=15)
    pg.mouse.click(300, 45); pg.wait_for_timeout(250)
    REZ['m4_clic_bara_gazda'] = {'nume': nume(pg), 'caseta': pg.evaluate(CAS)['caseta']}
    pg.close(); c.close()


# ------------------------------------------------------------------------------------------------ M1
MENIU = """()=>{const R=document.querySelector('[data-lh-aplicatie="explorer"]');
 const el=[...R.querySelectorAll('.lh-ap-e-mr')].filter(e=>e.getClientRects().length);
 const m=R.querySelector('.lh-ap-e-meniu');const w=R.querySelector('.lh-ap-e-mw');const mr=m?m.getBoundingClientRect():null;const wr=w?w.getBoundingClientRect():null;
 return {meniu:mr?[Math.round(mr.x),Math.round(mr.y),Math.round(mr.width),Math.round(mr.height)]:null,
  fereastra:wr?[Math.round(wr.x),Math.round(wr.y),Math.round(wr.width),Math.round(wr.height)]:null,derulabil:w?w.scrollHeight>w.clientHeight+1:false,
  ids:el.map(e=>e.getAttribute('data-lh-id')||'')}}"""
HIT = """id=>{const e=[...document.querySelectorAll('.lh-ap-e-mr')].find(x=>x.getAttribute('data-lh-id')===id);if(!e)return null;const r=e.getBoundingClientRect();
 const c=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {ok:!!(c&&(c===e||e.contains(c))),y:[Math.round(r.y),Math.round(r.bottom)],c:[r.x+r.width/2,r.y+r.height/2],
  inPag:r.top>=0&&r.bottom<=innerHeight+1&&r.left>=0&&r.right<=innerWidth+1}}"""


def neapasabile_cu_rotita(pg, ids, mob=False):
    """fiecare rând: dacă nu se poate apăsa pe loc, rotița (sau tragerea cu degetul) peste meniu, de cel mult 12 ori; apoi elementFromPoint"""
    rau = []
    for k in ids:
        h = pg.evaluate(HIT, k)
        n = 0
        while h and not h['ok'] and n < 12:
            w = pg.evaluate("(()=>{const w=document.querySelector('.lh-ap-e-mw');const r=w.getBoundingClientRect();return [r.x+r.width/2,r.y+Math.min(r.height-20,60),r.y+r.height/2]})()")
            jos = h['y'][0] > w[2]
            if mob:
                pg.evaluate("d=>{const w=document.querySelector('.lh-ap-e-mw');w.scrollBy(0,d)}", 160 if jos else -160)   # tragerea cu degetul = derularea nativă a cutiei
            else:
                pg.mouse.move(w[0], w[1]); pg.mouse.wheel(0, 120 if jos else -120)
            pg.wait_for_timeout(80)
            h = pg.evaluate(HIT, k)
            n += 1
        if not h or not h['ok']:
            rau.append([k, h and h['y']])
    return rau


def deschide_meniu(pg, fel, mob):
    if fel == 'nou_bara':
        (atinge if mob else clic)(pg, BARA % 'Nou', dx=20) if not mob else atinge(pg, BARA % 'Nou')
    elif fel == 'fundal_nou':
        g = pg.evaluate("(()=>{const l=document.querySelector('.lh-ap-e-lista');const r=l.getBoundingClientRect();const rs=[...l.querySelectorAll('.lh-ap-e-rand')];const ub=rs[rs.length-1].getBoundingClientRect().bottom;return [r.x+Math.min(200,r.width*.3),(ub+Math.min(r.bottom,innerHeight))/2]})()")
        pg.mouse.click(g[0], g[1], button='right'); pg.wait_for_timeout(250)
        nb = pg.evaluate(HIT, 'Nou')
        pg.mouse.click(nb['c'][0], nb['c'][1])
    elif fel == 'fisier_clasic':
        clic(pg, RAND % 'tema.docx', button='right'); pg.wait_for_timeout(250)
        mo = pg.evaluate("(()=>{const e=[...document.querySelectorAll('.lh-ap-e-mr')].find(x=>/mai multe/i.test(x.getAttribute('data-lh-id')||''));const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()")
        pg.mouse.click(mo[0], mo[1])
    pg.wait_for_timeout(300)


def sect_m1(H):
    S = 'M1'
    REZ['m1'] = {}
    for nume_c, kw in (('mica', dict(w=1093, h=526, scale=1.25)), ('t360', dict(w=360, h=740, mobil=True)), ('pc1366', dict(w=1366, h=768)), ('tabla', dict(w=1920, h=1080))):
        mob = kw.get('mobil')
        c = H.ctx(**kw)
        pg = H.pagina(c, 'explorer')
        for fel in (('nou_bara',) if mob else ('nou_bara', 'fundal_nou', 'fisier_clasic')):
            deschide_meniu(pg, fel, mob)
            m = pg.evaluate(MENIU)
            rau = neapasabile_cu_rotita(pg, m['ids'], mob)
            REZ['m1'][nume_c + '/' + fel] = {'meniu': m['meniu'], 'cutie': m['fereastra'], 'derulabil': m['derulabil'], 'randuri': len(m['ids']), 'neapasabile': rau}
            verif(S, '%s_%s_toate_randurile_apasabile' % (nume_c, fel), m['ids'] and not rau, {'randuri': len(m['ids']), 'neapasabile': rau, 'meniu': m['meniu'], 'cutie': m['fereastra']})
            # ultimul rând chiar se apasă: un gest real pe el, după derulare -> evenimentul meniului
            if m['ids'] and not rau:
                k = m['ids'][-1]
                ev(pg)
                h = pg.evaluate(HIT, k)
                (pg.touchscreen.tap if mob else pg.mouse.click)(h['c'][0], h['c'][1])
                pg.wait_for_timeout(250)
                e_ = ev(pg)
                verif(S, '%s_%s_ultimul_rand_apasat' % (nume_c, fel), any(x['t'] == 'meniu:' + k for x in e_), {'rand': k, 'ev': e_[-3:]})
            for _ in range(3):
                pg.keyboard.press('Escape'); pg.wait_for_timeout(60)
            pg.evaluate("document.querySelectorAll('[data-lh-nesimulat]').forEach(x=>x.remove())")
        pg.close(); c.close()


# ------------------------------------------------------------------------------------------------ M2
# martorul = un <input> obișnuit care, ca orice filtru viu, schimbă la fiecare literă un text din pagină. În Chromium orice schimbare a
# paginii între două litere închide grupul de anulare (probat: runde/27/raport_constructor.md › MINOR 2), deci martorul fără nicio
# schimbare ar anula tot cuvântul, iar orice căutare care filtrează pe loc ar anula literă cu literă. Se compară cu ce poate face o pagină.
MARTOR = """()=>{if(document.getElementById('martor27'))return;const i=document.createElement('input');i.id='martor27';i.style.cssText='position:fixed;left:0;bottom:0;width:200px;z-index:99999';
 const s=document.createElement('span');s.id='martor27s';s.style.cssText='position:fixed;left:210px;bottom:0;z-index:99999';i.addEventListener('input',()=>{s.textContent=i.value});
 document.body.appendChild(i);document.body.appendChild(s)}"""
VAL = """()=>{const a=document.activeElement;return a&&a.tagName==='INPUT'?[a.value,a.selectionStart,a.selectionEnd]:null}"""
SECV = [('t', 'har'), ('k', 'Control+z'), ('k', 'Control+z'), ('k', 'Control+y'), ('t', 'ta'), ('k', 'Backspace'), ('k', 'Control+z'),
        ('k', 'Control+Shift+z'), ('k', 'Control+a'), ('t', 'no'), ('k', 'Control+z'), ('k', 'Control+z'), ('k', 'Control+y')]


def joaca(pg):
    o = []
    for fel, x in SECV:
        if fel == 't':
            pg.keyboard.type(x, delay=30)
        else:
            pg.keyboard.press(x)
        pg.wait_for_timeout(120)
        o.append(pg.evaluate(VAL))
    return o


def sect_m2(H):
    S = 'M2'
    c = H.ctx()
    pg = H.pagina(c, 'explorer')
    pg.evaluate(MARTOR)
    pg.click('#martor27'); pg.wait_for_timeout(100)
    m = joaca(pg)
    clic(pg, '.lh-ap-e-caut-in'); pg.wait_for_timeout(150)
    a = joaca(pg)
    dif = [(SECV[i], m[i], a[i]) for i in range(len(SECV)) if (m[i] or [None])[0] != (a[i] or [None])[0]]
    REZ['m2'] = {'martor': m, 'cautare': a, 'dif_martor_informativ': dif}
    # Mărimea pasului de anulare (cuvânt / literă) ține de Chromium: orice schimbare a paginii între litere închide grupul (vezi sus);
    # nu se cere egalitatea cu martorul, ci ca anularea și refacerea să lucreze în casetă ca într-un <input> obișnuit.
    v = [(x or [None])[0] for x in a]
    ok = (v[0] == 'har' and isinstance(v[1], str) and 'har'.startswith(v[1]) and len(v[1]) < 3          # Ctrl+Z scoate din ce s-a scris
          and isinstance(v[2], str) and v[1].startswith(v[2]) and len(v[2]) < len(v[1])                 # al doilea Ctrl+Z merge mai departe
          and v[3] == v[1]                                                                               # Ctrl+Y reface
          and v[5] == v[4][:-1] and v[6] == v[4] and v[7] == v[5]                                       # Backspace, Ctrl+Z, Ctrl+Shift+Z
          and v[9] == 'no' and v[7] in (v[10], v[11]))                                                   # Ctrl+A + „no”, Ctrl+Z aduce textul vechi
    verif(S, 'ctrl_z_y_lucreaza_in_caseta', ok, v)
    # filtrul urmează valoarea de după Ctrl+Z (ecranul = starea)
    s = st(pg)
    ecr = pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-aplicatie=explorer] .lh-ap-e-rand')].map(x=>x.getAttribute('data-lh-id')))()")
    val = (a[-1] or [''])[0]
    exp = [x for x in s['nume_fisiere'] if val.lower() in x.rstrip('/').lower()]
    verif(S, 'filtrul_dupa_undo_egal_ecranul', [x.rstrip('/') for x in s['ordine_afisata']] == ecr and s['ordine_afisata'] == exp, {'val': val, 'ordine': s['ordine_afisata'], 'ecran': ecr, 'asteptat': exp})
    nr = pg.evaluate("(()=>document.querySelector('[data-lh-aplicatie=explorer] .lh-ap-e-nr').textContent)()")
    verif(S, 'bara_stare_numara_filtrul', nr.split(' ')[0] == str(len(ecr)), {'nr': nr, 'ecran': len(ecr)})
    pg.close(); c.close()


# ------------------------------------------------------------------------------------------------ REG
def sect_reg(H):
    S = 'REG'
    c = H.ctx()
    pg = H.pagina(c, 'explorer')
    # F2 + scris + clic pe alt rând
    clic(pg, RAND % 'tema.docx'); pg.keyboard.press('F2'); pg.wait_for_timeout(120); pg.keyboard.type('compunere', delay=10)
    clic(pg, RAND % 'harta.png'); pg.wait_for_timeout(200)
    s = st(pg)
    verif(S, 'clic_alt_rand_confirma', 'compunere.docx' in s['nume_fisiere'] and s['selectie'] == ['harta.png'], {'n': s['nume_fisiere'], 'sel': s['selectie']})
    # G27-1: tastele de după clicul care a confirmat numele ajung la Explorer (Delete -> harta în Coș; Ctrl+Z -> înapoi)
    pg.keyboard.press('Delete'); pg.wait_for_timeout(150)
    s = st(pg)
    verif(S, 'G27_1_delete_dupa_clic_confirmare', s['in_cos'] == ['harta.png'] and 'harta.png' not in s['nume_fisiere'], {'n': s['nume_fisiere'], 'cos': s['in_cos']})
    pg.keyboard.press('Control+z'); pg.wait_for_timeout(150)
    s = st(pg)
    verif(S, 'G27_1_ctrl_z_inapoi', 'harta.png' in s['nume_fisiere'] and s['in_cos'] == [], {'n': s['nume_fisiere'], 'cos': s['in_cos']})
    # F2 + scris + clic pe loc gol
    clic(pg, RAND % 'notite.txt'); pg.keyboard.press('F2'); pg.wait_for_timeout(120); pg.keyboard.type('n2', delay=10)
    g = pg.evaluate("(()=>{const l=document.querySelector('.lh-ap-e-lista');const r=l.getBoundingClientRect();const rs=[...l.querySelectorAll('.lh-ap-e-rand')];const ub=rs[rs.length-1].getBoundingClientRect().bottom;return [r.x+200,(ub+Math.min(r.bottom,innerHeight))/2]})()")
    pg.mouse.click(g[0], g[1]); pg.wait_for_timeout(200)
    s = st(pg)
    verif(S, 'clic_loc_gol_confirma', 'n2.txt' in s['nume_fisiere'], s['nume_fisiere'])
    # F2 + scris + clic în căutare
    clic(pg, RAND % 'harta.png'); pg.keyboard.press('F2'); pg.wait_for_timeout(120); pg.keyboard.type('h3', delay=10)
    clic(pg, '.lh-ap-e-caut-in'); pg.wait_for_timeout(200)
    s = st(pg)
    verif(S, 'clic_cautare_confirma', 'h3.png' in s['nume_fisiere'], s['nume_fisiere'])
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    # F2 + scris + clic pe un loc fără focus din pagină (sub fereastră) — blur fără țintă, ca înainte: confirmă
    clic(pg, RAND % 'h3.png'); pg.keyboard.press('F2'); pg.wait_for_timeout(120); pg.keyboard.type('h4', delay=10)
    pg.mouse.click(1300, 760); pg.wait_for_timeout(200)
    s = st(pg)
    verif(S, 'clic_in_afara_aplicatiei_confirma', 'h4.png' in s['nume_fisiere'], s['nume_fisiere'])
    # Esc
    clic(pg, RAND % 'Desene'); pg.keyboard.press('F2'); pg.wait_for_timeout(120); pg.keyboard.type('Zz', delay=10); pg.keyboard.press('Escape'); pg.wait_for_timeout(150)
    s = st(pg)
    verif(S, 'esc_anuleaza', 'Desene/' in s['nume_fisiere'] and 'Zz/' not in s['nume_fisiere'], s['nume_fisiere'])
    # Tab în casetă: ce făcea înainte (se compară cu --inainte); se notează
    clic(pg, RAND % 'Proiect'); pg.keyboard.press('F2'); pg.wait_for_timeout(120); pg.keyboard.type('Pr2', delay=10); pg.keyboard.press('Tab'); pg.wait_for_timeout(200)
    REZ['reg_tab'] = {'nume': st(pg)['nume_fisiere'], 'caseta': pg.evaluate(CAS)['caseta']}
    # căutarea: „ha”, Esc
    clic(pg, '.lh-ap-e-caut-in'); pg.keyboard.type('h', delay=30); pg.wait_for_timeout(150)
    s = st(pg)
    ecr = pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-aplicatie=explorer] .lh-ap-e-rand')].map(x=>x.getAttribute('data-lh-id')))()")
    verif(S, 'cautare_filtreaza', [x.rstrip('/') for x in s['ordine_afisata']] == ecr and all('h' in x.lower() for x in ecr), {'o': s['ordine_afisata'], 'e': ecr})
    foc = pg.evaluate("(()=>document.activeElement&&document.activeElement.className)()")
    verif(S, 'cautare_focus_ramane', foc == 'lh-ap-e-caut-in', foc)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(150)
    s = st(pg)
    verif(S, 'cautare_esc_toate', len(s['ordine_afisata']) == len(s['nume_fisiere']), s['ordine_afisata'])
    pg.close(); c.close()
    # telefonul: Nou › Folder + insertText + Enter
    c = H.ctx(w=390, h=844, mobil=True)
    pg = H.pagina(c, 'explorer')
    atinge(pg, BARA % 'Nou'); pg.wait_for_timeout(300)
    atinge(pg, '.lh-ap-e-mr[data-lh-id="Folder"]'); pg.wait_for_timeout(400)
    cd = pg.context.new_cdp_session(pg)
    cd.send('Input.insertText', {'text': 'Ex Pop'}); pg.wait_for_timeout(150)
    pg.keyboard.press('Enter'); pg.wait_for_timeout(200)
    s = st(pg)
    verif(S, 'telefon_folder_nou', 'Ex Pop/' in s['nume_fisiere'], s['nume_fisiere'])
    pg.close(); c.close()


with Ham(RAD) as H:
    for s in SECT:
        print('== ' + s)
        {'M4': sect_m4, 'M1': sect_m1, 'M2': sect_m2, 'REG': sect_reg}[s](H)
    REZ['plecate'] = H.plecate
    REZ['erori'] = H.erori
if TMP:
    shutil.rmtree(TMP, ignore_errors=True)
pic = [v for v in REZ['verificari'] if not v['ok']]
REZ['picate'] = len(pic)
REZ['total'] = len(REZ['verificari'])
with open(OUT / ('proba_grav_%s.json' % ETI), 'w', encoding='utf-8') as f:
    json.dump(REZ, f, ensure_ascii=False, indent=1)
print('plecate=%d erori=%s' % (len(REZ['plecate']), REZ['erori'][:3]))
print('verificari=%d picate=%d (%s)' % (REZ['total'], len(pic), ', '.join(v['sectiune'] + ':' + v['nume'] for v in pic)[:900]))
print(len(pic))
