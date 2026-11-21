# -*- coding: utf-8 -*-
"""Runda 23 (B-explorer, ciclul paralel C, unghiul stare_finala_erori) — proba GRAV-urilor, pe gesturi reale.

Secțiuni (python proba_grav.py [N2 N1 MONT SFE] [--radacina <copie>] [--eticheta x]):
  N2   critic 19 › N2: în câmpurile Explorer (caseta de nume după F2 și după Ctrl+Shift+N, adresa, căutarea) scurtăturile
       browserului se opresc (defaultPrevented), iar tastele de editare rămân ale câmpului (nu se opresc ȘI lucrează);
  N1   critic 19 › N1: pe fereastra mică (1366×657 la 125 % = 1093×526 css) mesajul central e în pagină și deasupra; la fel pe
       telefon (360×740, 390×844); la 1366×768 fereastra rămâne de 640 px (aspectul măsurat de O3 nu se mișcă);
  MONT A22-1: Explorer montat într-o fereastră străină (runde/23/probe/montare.html?gazda=div|windows);
  SFE  unghiul stare_finala_erori: cele 9 greșeli tipice din supliment; după fiecare: stare() = ecranul, evenimentul §4.
Server static pe 127.0.0.1 (port liber), Chromium headless, tot ce nu e 127.0.0.1/localhost abandonat (regula 24).
Ieșirea: runde/23/probe_iesiri/proba_grav_<eticheta>.json; ULTIMA LINIE = numărul de verificări picate."""
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent / 'probe'))
from h23 import Ham, ev, clic, atinge, st, MES, RAND, BARA, OUT

ARGS = [a for a in sys.argv[1:]]
RAD = None
ETI = 'acum'
if '--radacina' in ARGS:
    i = ARGS.index('--radacina'); RAD = Path(ARGS[i + 1]); del ARGS[i:i + 2]
if '--eticheta' in ARGS:
    i = ARGS.index('--eticheta'); ETI = ARGS[i + 1]; del ARGS[i:i + 2]
SECT = ARGS or ['N2', 'N1', 'MONT', 'SFE']
REZ = {'verificari': []}


def verif(s, nume, ok, det=None):
    REZ['verificari'].append({'sectiune': s, 'nume': nume, 'ok': bool(ok), 'detalii': None if ok else det})
    print(('  ok    ' if ok else '  PICAT ') + s + ' · ' + nume + ('' if ok else '  ' + json.dumps(det, ensure_ascii=False)[:300]))


PD = "window.__pd=[];window.addEventListener('keydown',e=>{if(!/^(Control|Shift|Alt|Meta)$/.test(e.key))window.__pd.push([e.key,e.defaultPrevented])});"
CAMP = """(()=>{const a=document.activeElement;if(!a||a.tagName!=='INPUT')return null;return {cls:a.className,v:a.value,s:[a.selectionStart,a.selectionEnd]}})()"""
ECRAN = """()=>[...document.querySelectorAll('[data-lh-aplicatie="explorer"] .lh-ap-e-rand[data-lh-id]')].filter(x=>x.getClientRects().length).map(x=>x.getAttribute('data-lh-id'))"""


def focus_in(pg, loc):
    clic(pg, RAND % 'harta.png')
    k = {'caseta_F2': 'F2', 'caseta_folder_nou': 'Control+Shift+N', 'adresa': 'F4', 'cautare': 'Control+e'}[loc]
    pg.keyboard.press(k)
    pg.wait_for_timeout(120)
    return pg.evaluate(CAMP)


# ------------------------------------------------------------------------------------------------ N2
OPRITE = ['F5', 'F3', 'F4', 'F6', 'F7', 'F10', 'F11', 'F12', 'Control+r', 'Control+p', 'Control+s', 'Control+l', 'Control+e',
          'Control+f', 'Control+d', 'Control+h', 'Control+j', 'Control+o', 'Control+u', 'Control+g', 'Alt+ArrowLeft',
          'Alt+ArrowRight', 'Alt+ArrowUp', 'Alt+Home', 'Control+Shift+C', 'Control+Shift+Delete']
EDITARE = ['Control+a', 'Control+c', 'Control+x', 'Control+v', 'Control+z', 'Control+y', 'Control+Shift+z', 'Shift+ArrowLeft',
           'Shift+Home', 'Home', 'End', 'ArrowLeft', 'Backspace', 'Delete', 'Control+ArrowLeft', 'Control+ArrowRight',
           'Control+Shift+ArrowLeft', 'Control+Backspace', 'Control+Delete', 'Control+Home', 'Control+End']


def sectiunea_n2(H):
    S = 'N2'
    c = H.ctx()
    for loc in ('caseta_F2', 'caseta_folder_nou', 'adresa', 'cautare'):
        pg = H.pagina(c, 'explorer')
        pg.evaluate(PD)
        rau_o, rau_e = [], []
        for k in OPRITE + EDITARE:
            f0 = focus_in(pg, loc)
            if not f0:
                rau_o.append([k, 'fără câmp']); continue
            pg.evaluate('window.__pd.length=0')
            pg.keyboard.press(k)
            pg.wait_for_timeout(70)
            pd = [x[1] for x in pg.evaluate('window.__pd')]
            if k in OPRITE and pd != [True]:
                rau_o.append([k, pd])
            if k in EDITARE and pd != [False]:
                rau_e.append([k, pd])
            pg.keyboard.press('Escape'); pg.wait_for_timeout(50)
            if st(pg)['cale_curenta'] != 'Documente/Clasa a V-a/' or 'Folder nou/' in st(pg)['nume_fisiere']:
                pg.close(); pg = H.pagina(c, 'explorer'); pg.evaluate(PD)
        verif(S, loc + ': %d scurtături ale browserului / aplicației (F5, Ctrl+R, Alt+←, Ctrl+P, F6, F10 …) oprite în câmp' % len(OPRITE), not rau_o, rau_o)
        verif(S, loc + ': %d taste de editare (Ctrl+A/C/X/V/Z/Y, Shift+săgeți, Home/End, Ctrl+←/→, Ctrl+Backspace …) rămân ale câmpului' % len(EDITARE), not rau_e, rau_e)
        pg.close()
    # editarea chiar lucrează (caseta F2 pe harta.png: „harta” ales tot)
    pg = H.pagina(c, 'explorer')
    f = focus_in(pg, 'caseta_F2')
    pg.keyboard.press('End'); pg.keyboard.type('xy'); a1 = pg.evaluate(CAMP)
    pg.keyboard.press('Control+a'); a2 = pg.evaluate(CAMP)
    pg.keyboard.press('Control+x'); a3 = pg.evaluate(CAMP)
    pg.keyboard.press('Control+z'); a4 = pg.evaluate(CAMP)
    pg.keyboard.press('End'); pg.keyboard.press('Control+Backspace'); a5 = pg.evaluate(CAMP)
    pg.keyboard.type('nou'); pg.keyboard.press('Control+ArrowLeft'); a6 = pg.evaluate(CAMP)
    cdp = pg.context.new_cdp_session(pg)
    pg.keyboard.press('End'); cdp.send('Input.insertText', {'text': ' știri ț'}); a7 = pg.evaluate(CAMP)
    pg.keyboard.press('Enter'); pg.wait_for_timeout(120)
    s = st(pg)
    det = [f, a1, a2, a3, a4, a5, a6, a7, s['nume_fisiere']]
    verif(S, 'caseta F2: End + „xy” → „hartaxy”', a1 and a1['v'] == 'hartaxy', det)
    verif(S, 'caseta F2: Ctrl+A alege tot', a2 and a2['s'] == [0, 7], det)
    verif(S, 'caseta F2: Ctrl+X golește, Ctrl+Z aduce înapoi „hartaxy”', a3 and a3['v'] == '' and a4 and a4['v'] == 'hartaxy', det)
    verif(S, 'caseta F2: Ctrl+Backspace șterge cuvântul; „nou” + Ctrl+← mută cursorul la începutul cuvântului', a5 and a5['v'] == '' and a6 and a6['v'] == 'nou' and a6['s'] == [0, 0], det)
    verif(S, 'caseta F2: textul compus (CDP insertText, diacritice) intră; Enter redenumește', a7 and a7['v'] == 'nou știri ț' and 'nou știri ț.png' in s['nume_fisiere'], det)
    pg.close()
    # telefonul: scrisul prin evenimentul input, în caseta de nume
    cm = H.ctx(360, 740, mobil=True)
    pg = H.pagina(cm, 'explorer')
    atinge(pg, RAND % 'notite.txt'); atinge(pg, BARA % 'Redenumire', pauza=500)
    cdp = pg.context.new_cdp_session(pg)
    pg.evaluate("(()=>{const i=document.querySelector('.lh-ap-e-ren');if(i){i.focus();i.select()}})()")
    cdp.send('Input.insertText', {'text': 'lecții'})
    v = pg.evaluate(CAMP)
    pg.keyboard.press('Enter'); pg.wait_for_timeout(150)
    s = st(pg)
    verif(S, 'telefon 360: Redenumire + scris prin input („lecții”) + Enter → lecții.txt', 'lecții.txt' in s['nume_fisiere'], [v, s['nume_fisiere']])
    pg.close()
    # în listă (nu în câmp) tastele se opresc ca înainte
    pg = H.pagina(c, 'explorer'); pg.evaluate(PD)
    rau = []
    for k in ['F5', 'Control+r', 'Alt+ArrowLeft', 'Control+a', 'Control+c', 'Control+z']:
        clic(pg, RAND % 'harta.png'); pg.evaluate('window.__pd.length=0'); pg.keyboard.press(k); pg.wait_for_timeout(60)
        pd = [x[1] for x in pg.evaluate('window.__pd')]
        if pd != [True]: rau.append([k, pd])
        pg.keyboard.press('Escape')
    verif(S, 'în listă (rădăcina): F5 / Ctrl+R / Alt+← / Ctrl+A / Ctrl+C / Ctrl+Z oprite, ca înainte', not rau, rau)
    pg.close()


# ------------------------------------------------------------------------------------------------ N1
def mesaj(pg, gest):
    if gest == 'acest_pc':
        clic(pg, '.lh-ap-e-nod[data-lh-id="Acest PC"]')
    else:
        clic(pg, RAND % 'tema.docx'); pg.keyboard.press('Alt+Enter')
    pg.wait_for_timeout(300)
    return pg.evaluate(MES, 'explorer')


def sectiunea_n1(H):
    S = 'N1'
    for nume, kw in (('mica_1093x526@1.25', dict(w=1093, h=526, scale=1.25)), ('telefon_360x740', dict(w=360, h=740, mobil=True)),
                     ('telefon_390x844', dict(w=390, h=844, mobil=True)), ('pc_1366x768', dict(w=1366, h=768))):
        c = H.ctx(**kw)
        for gest in ('acest_pc', 'alt_enter'):
            if gest == 'alt_enter' and 'telefon' in nume:
                continue
            pg = H.pagina(c, 'explorer')
            if 'telefon' in nume and gest == 'acest_pc':
                b = pg.evaluate("s=>{const e=document.querySelector(s);if(!e)return null;e.scrollIntoView({block:'nearest',inline:'nearest'});const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}", '.lh-ap-e-nod[data-lh-id="Acest PC"]')
                pg.touchscreen.tap(b[0] + 30, b[1] + b[3] / 2); pg.wait_for_timeout(300)
                m = pg.evaluate(MES, 'explorer')
            else:
                m = mesaj(pg, gest)
            E = ev(pg)
            verif(S, '%s · %s → evenimentul „nesimulat” + UN mesaj central în pagină și deasupra' % (nume, gest),
                  any(e['a'] == 'nesimulat' for e in E) and len(m) == 1 and m[0]['inPagina'] and m[0]['deasupra'], {'m': m, 'ev': E[:3]})
            pg.close()
        pg = H.pagina(c, 'explorer')
        g = pg.evaluate("""()=>{const r=document.querySelector('[data-lh-aplicatie="explorer"]').getBoundingClientRect();
          const b=document.querySelector('[data-lh-aplicatie="explorer"] [data-lh-suprafata="bara_stare"]');const rb=b?b.getBoundingClientRect():null;
          return {rad:[Math.round(r.y),Math.round(r.height)],ih:innerHeight,bara:rb?[Math.round(rb.y),Math.round(rb.bottom)]:null}}""")
        if nume.startswith('pc'):
            verif(S, nume + ' · fereastra rămâne de 640 px (aspectul de la 1366×768 neschimbat)', g['rad'][1] == 640, g)
        else:
            verif(S, nume + ' · fereastra încape în ecran (înălțimea ≤ ecranul) și bara de stare e în pagină',
                  g['rad'][0] + g['rad'][1] <= g['ih'] + 1 and g['bara'] and g['bara'][1] <= g['ih'] + 1, g)
        pg.close()
        c.close()


# ------------------------------------------------------------------------------------------------ MONT (A22-1)
URL_M = '/_campaign/aplicatii_fidele_2026_11/runde/23/probe/montare.html?gazda='


def pagina_m(H, c, gazda):
    pg = c.new_page()
    pg.on('pageerror', lambda e: H.erori.append(str(e)[:300]))
    pg.add_init_script("window.__ev=[];window.addEventListener('lh-aplicatie',e=>{const d=e.detail;window.__ev.push({ap:d.aplicatie,g:d.gest,a:d.actiune,t:d.tinta})});")
    pg.goto(H.baza + URL_M + gazda, wait_until='load')
    pg.wait_for_function('window.__gata!==undefined', timeout=30000)
    ok = pg.evaluate('window.__gata')
    pg.wait_for_timeout(400)
    return pg, ok


def sectiunea_mont(H):
    S = 'MONT'
    c = H.ctx(1366, 768)
    for gazda in ('div', 'windows'):
        pg, ok = pagina_m(H, c, gazda)
        verif(S, gazda + ' · deschide(explorer, {loc, incadrat:true}) se deschide în corpul gazdei', ok and pg.evaluate("!!(window.__ap&&window.__ap.radacina.parentElement&&window.__ap.radacina.parentElement.classList.contains('corp'))"),
              pg.evaluate('window.__eroare||null'))
        if not ok:
            pg.close(); continue
        g = pg.evaluate("""()=>{const R=window.__ap.radacina,c=R.parentElement.getBoundingClientRect(),r=R.getBoundingClientRect();
          return {titlu:R.querySelectorAll('.lh-ap-e-r1,[data-lh-tinta="bara_titlu"]').length,cos:R.querySelectorAll('.lh-ap-e-desk').length,
           rad:[r.x-c.x,r.y-c.y,r.width-c.width,r.height-c.height].map(Math.round),atr:R.getAttribute('data-lh-incadrat')}}""")
        verif(S, gazda + ' · fără bara de titlu proprie și fără Coș (desktop); umple corpul gazdei', g['titlu'] == 0 and g['cos'] == 0 and g['rad'] == [0, 0, 0, 0], g)
        s0 = pg.evaluate('window.__ap.stare()')
        verif(S, gazda + ' · stare() are titlul ferestrei („Clasa a V-a - Explorer”, ca „sesiune - Explorer” din referință)', s0.get('titlu') == 'Clasa a V-a - Explorer', s0.get('titlu'))
        pg.evaluate('window.__gazdaEv.length=0;window.__ev.length=0')
        clic(pg, RAND % 'harta.png')
        pg.mouse.click(*[v for v in pg.evaluate("s=>{const r=document.querySelector(s).getBoundingClientRect();return [r.x+30,r.y+r.height/2]}", RAND % 'notite.txt')], button='right')
        pg.wait_for_timeout(150); pg.keyboard.press('Escape'); pg.wait_for_timeout(80)
        clic(pg, RAND % 'Desene', n=2); pg.wait_for_timeout(150)
        pg.keyboard.press('Backspace'); pg.wait_for_timeout(100)
        pg.mouse.move(500, 400); pg.mouse.wheel(0, 120); pg.wait_for_timeout(100)
        E = pg.evaluate('window.__ev.slice()'); G = pg.evaluate('window.__gazdaEv.slice()')
        straine = [e for e in E if e['ap'] != 'explorer']
        proprii = [e for e in E if e['ap'] == 'explorer']
        verif(S, gazda + ' · clic, clic dreapta, dublu clic, Backspace, rotița în Explorer → evenimente §4 doar „explorer” (0 ale gazdei)',
              bool(proprii) and not straine, {'straine': straine[:6], 'proprii': len(proprii)})
        if gazda == 'div':
            verif(S, 'div · ascultătorii gazdei (click / keydown / contextmenu / wheel în bubbling) nu primesc nimic din Explorer',
                  not [x for x in G if x[0] != 'pointerdown'], G[:10])
        s1 = pg.evaluate('window.__ap.stare()')
        verif(S, gazda + ' · titlul urmează folderul (Desene, apoi înapoi)', s1.get('cale_curenta') == 'Documente/Clasa a V-a/' and s1.get('titlu') == 'Clasa a V-a - Explorer', [s1.get('cale_curenta'), s1.get('titlu'), proprii[-6:]])
        # redesenarea gazdei: stratul rescris, api.radacina pusă înapoi
        clic(pg, RAND % 'tema.docx'); pg.keyboard.press('Control+c'); pg.wait_for_timeout(60)
        pg.evaluate('window.redeseneazaGazda()')
        s2 = pg.evaluate("LH.aplicatii.stare('explorer')")
        pg.keyboard.press('Control+v'); pg.wait_for_timeout(150)
        s3 = pg.evaluate("LH.aplicatii.stare('explorer')")
        verif(S, gazda + ' · după redesenarea gazdei: instanța trăiește, starea e păstrată, Ctrl+V lipește „tema - Copie.docx”',
              s2 and s2['selectie'] == ['tema.docx'] and s3 and 'tema - Copie.docx' in s3['nume_fisiere'], [s2 and s2['selectie'], s3 and s3['nume_fisiere']])
        # deschideSuprafata: aplicația cerută, nu prima vie
        r = pg.evaluate("""()=>LH.aplicatii.deschideSuprafata('meniu_nou','explorer').then(x=>({x,m:!!window.__ap.radacina.querySelector('[data-lh-suprafata="meniu_nou"]')}),e=>({err:String(e)}))""")
        verif(S, gazda + " · deschideSuprafata('meniu_nou', 'explorer') deschide meniul Nou al Explorer-ului", r.get('m') is True, r)
        pg.close()
    c.close()


# ------------------------------------------------------------------------------------------------ SFE
def sectiunea_sfe(H):
    S = 'SFE'
    c = H.ctx()

    def ecran_eq(pg, s):
        e = pg.evaluate(ECRAN)
        return [x.rstrip('/') for x in s['ordine_afisata']] == [x.rstrip('/') for x in e], e

    def caz(nume, pasi, astept, ev_astept=None):
        pg = H.pagina(c, 'explorer')
        s0 = st(pg)
        det = pasi(pg)
        pg.wait_for_timeout(150)
        s = st(pg); E = ev(pg)
        eq, e = ecran_eq(pg, s)
        m = pg.evaluate(MES, 'explorer')
        ok, why = astept(s0, s, m)
        verif(S, nume + ' → ' + why, ok, {'stare': {k: s[k] for k in ('nume_fisiere', 'cale_curenta', 'selectie', 'in_cos')}, 'mesaj': [x['t'] for x in m], 'det': det})
        verif(S, nume + ' → ecranul = starea', eq, {'ecran': e, 'ordine': s['ordine_afisata']})
        verif(S, nume + ' → evenimentul §4 (aplicatie explorer, actiune' + ((' ' + ev_astept) if ev_astept else '') + ')',
              E and all(x['g'] and x['a'] for x in E) and (not ev_astept or any(x['a'] == ev_astept for x in E)), E[-5:])
        pg.close()

    def ren(nume_rand, text, final='Enter'):
        def f(pg):
            clic(pg, RAND % nume_rand); pg.keyboard.press('F2'); pg.wait_for_timeout(80)
            pg.keyboard.press('Control+a'); pg.keyboard.type(text); v = pg.evaluate(CAMP)
            pg.keyboard.press(final); pg.wait_for_timeout(150)
            return v
        return f
    # 1. numele există deja (folderul Proiect) — referința n-are dialogul pentru folder (R15-9): mesajul central, nimic schimbat
    caz('1 Desene › F2 › „Proiect” (există)', ren('Desene', 'Proiect'),
        lambda s0, s, m: (sorted(s['nume_fisiere']) == sorted(s0['nume_fisiere']) and len(m) == 1, 'nimic schimbat + mesajul central'))
    # 2. semne interzise
    for t in ('a/b', 'x:y', 'de ce?', 'a<b>'):
        caz('2 notite › F2 › „%s”' % t, ren('notite.txt', t),
            lambda s0, s, m: (sorted(s['nume_fisiere']) == sorted(s0['nume_fisiere']) and not any(ch in n.rstrip('/') for n in s['nume_fisiere'] for ch in '\\/:*?"<>|') and len(m) == 1,
                              'numele rămâne, niciun nume cu \\ / : * ? " < > |, mesajul central'))
    # 3. Esc în mijlocul redenumirii
    caz('3 harta › F2 › „zz” › Esc', ren('harta.png', 'zz', 'Escape'),
        lambda s0, s, m: (s['nume_fisiere'] == s0['nume_fisiere'], 'numele rămâne'), 'anulare_redenumire')

    # 4. Nou › Folder de două ori
    def nou2(pg):
        for _ in range(2):
            clic(pg, BARA % 'Nou'); pg.wait_for_timeout(120); clic(pg, '.lh-ap-e-mr[data-lh-id="Folder"]'); pg.wait_for_timeout(150); pg.keyboard.press('Enter'); pg.wait_for_timeout(120)
    caz('4 Nou › Folder ×2', nou2, lambda s0, s, m: ('Folder nou/' in s['nume_fisiere'] and 'Folder nou (2)/' in s['nume_fisiere'], '„Folder nou” și „Folder nou (2)”'))

    def del_z(pg):
        clic(pg, RAND % 'harta.png'); pg.keyboard.press('Delete'); pg.wait_for_timeout(100); pg.keyboard.press('Control+z')
    caz('5 harta › Delete › Ctrl+Z', del_z, lambda s0, s, m: (sorted(s['nume_fisiere']) == sorted(s0['nume_fisiere']) and not s['in_cos'], 'harta înapoi, Coșul gol'), 'anulare')

    def xv(pg):
        clic(pg, RAND % 'tema.docx'); pg.keyboard.press('Control+x'); pg.keyboard.press('Control+v')
    caz('6 tema › Ctrl+X › Ctrl+V (același folder)', xv, lambda s0, s, m: (sorted(s['nume_fisiere']) == sorted(s0['nume_fisiere']), 'nimic schimbat, nicio copie'))

    def v0(pg):
        clic(pg, RAND % 'tema.docx'); pg.keyboard.press('Control+v')
    caz('7 Ctrl+V fără nimic copiat', v0, lambda s0, s, m: (s['nume_fisiere'] == s0['nume_fisiere'], 'nimic schimbat'), 'fara_efect')

    def bs(pg):
        for _ in range(4):
            clic(pg, '.lh-ap-e-nb[data-lh-id="sus"]'); pg.wait_for_timeout(100)
        cale = st(pg)['cale_curenta']
        pg.keyboard.press('Backspace'); pg.keyboard.press('Backspace'); pg.keyboard.press('Backspace'); pg.keyboard.press('Backspace')
        return cale
    caz('8 Sus până la capăt, apoi Backspace ×4', bs, lambda s0, s, m: (s['nume_fisiere'] == s0['nume_fisiere'], 'fișierele neatinse, nicio eroare'))

    def caut(pg):
        pg.keyboard.press('Control+e'); pg.keyboard.type('zzz'); pg.wait_for_timeout(200)
        s = st(pg); e = pg.evaluate(ECRAN)
        pg.keyboard.press('Escape'); pg.wait_for_timeout(150)
        return {'in_cautare': [s['ordine_afisata'], e]}
    caz('9 căutare „zzz” (fără rezultat) › Esc', caut, lambda s0, s, m: (s['ordine_afisata'] == s0['ordine_afisata'], 'lista întreagă înapoi'))
    c.close()


with Ham(RAD) if RAD else Ham() as H:
    for sct, fn in (('N2', sectiunea_n2), ('N1', sectiunea_n1), ('MONT', sectiunea_mont), ('SFE', sectiunea_sfe)):
        if sct in SECT:
            print('==', sct)
            try:
                fn(H)
            except Exception as e:
                verif(sct, 'secțiunea a rulat până la capăt', False, repr(e)[:300])
    REZ['erori_pagina'] = H.erori[:10]
    REZ['cereri_plecate'] = len(H.plecate)
picate = [v for v in REZ['verificari'] if not v['ok']]
REZ['picate'] = len(picate)
with open(OUT / ('proba_grav_%s.json' % ETI), 'w', encoding='utf-8') as f:
    json.dump(REZ, f, ensure_ascii=False, indent=1)
print('erori de pagină:', len(H.erori), '· cereri plecate:', len(H.plecate), '· verificări:', len(REZ['verificari']))
print(len(picate))
