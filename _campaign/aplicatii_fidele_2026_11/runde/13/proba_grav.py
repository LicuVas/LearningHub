# -*- coding: utf-8 -*-
"""Proba constructorului 13 (B-powerpoint, unghiul gest_tastatura): P4, A4 (listele, notele, vederile), P3 și MINOR-urile
reparate, cu gesturi reale (mouse.click pe centrul / colțul țintei, keyboard.press / type), pe poligon, headless, doar 127.0.0.1.
    python runde/13/proba_grav.py              # worktree   → proba_grav_dupa.json
    python runde/13/proba_grav.py --inainte    # HEAD (git archive în %TEMP%) → proba_grav_inainte.json
Ultima linie = numărul de verificări picate."""
import io, json, subprocess, sys, tarfile, tempfile, shutil
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from h import Ham, st, el, clic, WT, AICI   # noqa: E402

STEA = {"diapozitive": [{"aspect": "Title Only", "texte": ["Soarele"], "forme": [{"fel": "forma", "forma": "Star: 5 Points", "pozitie": [60, 180, 180, 170]}]},
                        {"aspect": "Title Only", "texte": ["Planetele"]}], "diapozitiv_activ": 1}
TITLU = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Munții Rodnei"], "fonturi": ["Comic Sans MS"]}], "selectie_forma": [1, 1], "forma_citita": [1, 1]}
DOUA = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}, {"aspect": "Title and Content", "texte": ["B"]}], "diapozitiv_activ": 1}
FIS = {"diapozitive": [{"aspect": "Title Slide"}], "fisiere": [{"nume": "Plante_6A_Pop.pptx", "diapozitive": [{"aspect": "Title Slide", "texte": ["Plante"]}]}]}
TWO = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Planetele"]}, {"aspect": "Two Content", "texte": ["Pământul", "A treia planetă"]}], "diapozitiv_activ": 2}
R = []


def v(nume, ok, dovada):
    R.append({"verificare": nume, "ok": bool(ok), "dovada": dovada})


def taste(pg, *k):
    for x in k:
        pg.keyboard.press(x)
        pg.wait_for_timeout(80)


def fila(pg, nume):
    clic(pg, 'fila:' + nume)
    pg.wait_for_timeout(80)


def mso(pg, idm):
    r = pg.evaluate("i=>{const e=[...document.querySelectorAll('[data-lh-id-mso=\"'+i+'\"]')].find(x=>x.offsetParent);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", idm)
    if r:
        pg.mouse.click(r[0], r[1])
        pg.wait_for_timeout(100)
    return bool(r)


def meniu_vizibil(pg):
    return pg.evaluate("!!document.querySelector('.lh-ap-p-lista-ref')")


def p4(H):
    # ---- P4: clicul pe formă, chenarul, Ctrl+C / V, Delete
    pg = H.app('powerpoint', STEA)
    clic(pg, 'forma:1/2')
    s = st(pg)
    v('P4 M clic în mijlocul stelei = forma ca obiect', s['selectie_forma'] == [1, 2] and s['selectie_text'] is None, [s['selectie_forma'], s['selectie_text']])
    clic(pg, 'diapozitiv')
    clic(pg, 'forma:1/2', dx=0.04, dy=0.96)
    s = st(pg)
    v('P4 M clic pe chenarul stelei, în afara desenului = nimic ales', s['selectie_forma'] is None and s['selectie_text'] is None, [s['selectie_forma'], s['selectie_text']])
    clic(pg, 'forma:1/2')
    taste(pg, 'Control+c')
    clic(pg, 'miniatura:2')
    taste(pg, 'Control+v')
    s = st(pg)
    v('P4 K Ctrl+C pe stea → miniatura 2 → Ctrl+V = „Star: 5 Points” pe 2, același loc', any(f.get('forma') == 'Star: 5 Points' for f in s['forme_diapozitiv'][1]) and [60, 180, 180, 170] in s['pozitii_forme'][1],
      [s['forme_diapozitiv'][1], s['pozitii_forme'][1]])
    clic(pg, 'miniatura:1')
    clic(pg, 'forma:1/2')
    taste(pg, 'Delete')
    s = st(pg)
    v('P4 K Delete pe steaua aleasă o șterge', len(s['forme_diapozitiv'][0]) == 1, s['forme_diapozitiv'][0])


def a4_font(H):
    # ---- start.fonturi + Font ▾ (mouse), caseta Font (tastatura), săgeți + Enter în listă
    pg = H.app('powerpoint', TITLU)
    s0 = st(pg)['font_text']
    mso(pg, 'Font')
    vis = meniu_vizibil(pg)
    clic(pg, 'meniu:Calibri Light (Headings)')
    s = st(pg)
    cas = pg.evaluate("(document.querySelector('[data-lh-id-mso=\"Font\"] input')||{}).value")
    v('A4 M Font ▾ › Calibri Light (Headings) → font_text „Calibri Light”, caseta „Calibri Light (Headings)”', s0 == 'Comic Sans MS' and vis and s['font_text'] == 'Calibri Light' and cas == 'Calibri Light (Headings)', [s0, vis, s['font_text'], cas])
    taste(pg, 'Alt')
    taste(pg, 'h', 'f', 'f')
    pg.keyboard.type('Arial')
    taste(pg, 'Enter')
    s = st(pg)
    v('A4 K Alt, H, F F → „Arial” + Enter → font_text Arial', s['font_text'] == 'Arial', s['font_text'])
    mso(pg, 'Font')
    n = pg.evaluate("[...document.querySelectorAll('.lh-ap-p-lista-ref [data-lh-tinta^=\"meniu:\"]')].length")
    taste(pg, 'ArrowDown')
    ales = pg.evaluate("(document.querySelector('.lh-ap-p-lista-ref .lh-ap-p-tasta')||{}).getAttribute&&document.querySelector('.lh-ap-p-lista-ref .lh-ap-p-tasta').getAttribute('data-lh-eticheta')")
    taste(pg, 'Enter')
    s = st(pg)
    v('A4 K în lista Font: ↓ + Enter = fontul rândului următor (lista are toate fonturile)', n > 300 and ales and s['font_text'] == ales.replace(' (Headings)', '').replace(' (Body)', '') and not meniu_vizibil(pg), [n, ales, s['font_text']])


def a4_start(H):
    # ---- Animations › Start ▾
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Norul"]}], "selectie_forma": [1, 1]})
    fila(pg, 'Animations')
    clic(pg, 'meniu_derulant:Animations/Animation/Fade') or clic(pg, 'panglica:Animations/Animation/Fade')
    if st(pg)['animatie_galerie'] != 'Fade':
        pg.evaluate("(()=>{const e=[...document.querySelectorAll('.lh-ap-p-galerie-el[data-lh-eticheta=\"Fade\"]')].find(x=>x.offsetParent);e&&e.scrollIntoView({block:'nearest'})})()")
        r = pg.evaluate("(()=>{const e=[...document.querySelectorAll('.lh-ap-p-galerie-el[data-lh-eticheta=\"Fade\"]')].find(x=>x.offsetParent);if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()")
        if r:
            pg.mouse.click(*r)
    clic(pg, 'panglica:Animations/Timing/Start')
    clic(pg, 'meniu:After Previous')
    s = st(pg)
    cas = pg.evaluate("(()=>{const c=[...document.querySelectorAll('[data-lh-tip=\"ComboBox\"][data-lh-eticheta=\"Start\"] input')].find(x=>x.offsetParent);return c?c.value:null})()")
    v('A4 M Animations › Start ▾ › After Previous → dupa_precedenta, caseta „After Previous”', s['pornire_animatii'] == [['dupa_precedenta']] and cas == 'After Previous', [s['pornire_animatii'], cas])
    clic(pg, 'panglica:Animations/Timing/Start')
    taste(pg, 'ArrowUp', 'Enter')
    s = st(pg)
    v('A4 K Start ▾ (deschisă pe After Previous): ↑ + Enter = With Previous → cu_precedenta', s['pornire_animatii'] == [['cu_precedenta']], s['pornire_animatii'])


def a4_umplere(H):
    # ---- Shape Fill / Outline (Home › Drawing), Esc închide lista
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Only", "texte": ["Soarele"], "forme": [{"fel": "forma", "forma": "Star: 5 Points", "pozitie": [380, 200, 200, 190]}]}], "selectie_forma": [1, 2]})
    s0 = st(pg)['umplere_forme']
    mso(pg, 'ShapeFillColorPicker_Dropdown')
    clic(pg, 'meniu:Yellow')
    s = st(pg)
    v('A4 M Shape Fill ▾ (Home) › Yellow → solid #FFFF00 pe stea, titlul fără umplere', s0 == [[{'tip': 'fara'}, {'tip': 'solid', 'culoare': '#4472C4'}]] and s['umplere_forme'] == [[{'tip': 'fara'}, {'tip': 'solid', 'culoare': '#FFFF00'}]], [s0, s['umplere_forme']])
    mso(pg, 'OutlineColorPicker_Dropdown')
    clic(pg, 'meniu:Weight')
    clic(pg, 'meniu:3 pt')
    mso(pg, 'OutlineColorPicker_Dropdown')
    clic(pg, 'meniu:Orange')
    stroke = pg.evaluate("(()=>{const p=document.querySelector('.lh-ap-p-slide .lh-ap-p-fig svg>*');return p?[p.getAttribute('stroke'),p.getAttribute('stroke-width')]:null})()")
    v('A4 M Shape Outline ▾ › Weight ▸ 3 pt, apoi Orange → conturul #FFC000, mai gros', stroke and stroke[0] == '#FFC000' and float(stroke[1]) > 3, stroke)
    mso(pg, 'ShapeFillColorPicker_Dropdown')
    a = meniu_vizibil(pg)
    taste(pg, 'Escape')
    v('A4 K Esc închide lista Shape Fill', a and not meniu_vizibil(pg), [a, meniu_vizibil(pg)])


def a4_fundal(H):
    # ---- Background Styles
    pg = H.app('powerpoint', DOUA)
    fila(pg, 'Design')
    mso(pg, 'SlideBackgroundStylesGallery')
    clic(pg, 'meniu:Style 6')
    s = st(pg)
    v('A4 M Design › Background Styles ▾ › Style 6 → #E9E7E7 pe AMBELE', s['fundal_diapozitive'] == [{'tip': 'solid', 'culoare': '#E9E7E7'}] * 2, s['fundal_diapozitive'])


def p3(H):
    # ---- P3
    pg = H.app('powerpoint', FIS)
    clic(pg, 'fila:File')
    clic(pg, 'backstage:New')
    clic(pg, 'backstage:Blank Presentation')
    s = st(pg)
    v('P3 M File › New › Blank Presentation → Presentation2, 2 deschise, Backstage închis', s['prezentare_activa'] == 'Presentation2' and s['prezentari_deschise'] == 2 and s['backstage'] is None,
      [s['prezentare_activa'], s['prezentari_deschise'], s['backstage']])
    pg = H.app('powerpoint', FIS)
    taste(pg, 'Control+o')
    clic(pg, 'backstage:Browse')
    lst = pg.evaluate("[...document.querySelectorAll('[data-lh-tinta^=\"lista:\"]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-tinta'))")
    pg.keyboard.type('Plante_6A_Pop.pptx')
    taste(pg, 'Enter')
    s = st(pg)
    v('P3 K Ctrl+O › Browse → lista = start.fisiere; nume + Enter → Plante_6A_Pop.pptx, 2 deschise', lst == ['lista:Plante_6A_Pop.pptx'] and s['prezentare_activa'] == 'Plante_6A_Pop.pptx' and s['prezentari_deschise'] == 2,
      [lst, s['prezentare_activa'], s['prezentari_deschise']])
    pg = H.app('powerpoint', FIS)
    taste(pg, 'Control+o')
    clic(pg, 'backstage:Browse')
    d1 = st(pg)['dialog']
    taste(pg, 'Escape')
    s = st(pg)
    v('P3 K Esc în fereastra Open o închide, nimic deschis', d1 and d1.get('titlu') == 'Open' and s['prezentari_deschise'] == 1 and not pg.evaluate("!!document.querySelector('.lh-ap-strat-dialog')"), [d1, s['prezentari_deschise']])
    pg = H.app('powerpoint', FIS)
    taste(pg, 'Control+o')
    clic(pg, 'backstage:Browse')
    pg.dblclick('[data-lh-tinta="lista:Plante_6A_Pop.pptx"]')
    pg.wait_for_timeout(100)
    s = st(pg)
    v('P3 M dublu clic pe fișier în Open → deschis', s['prezentare_activa'] == 'Plante_6A_Pop.pptx', s['prezentare_activa'])


def a4_note(H):
    # ---- A4 notele și vederile
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Șahul"]}, {"aspect": "Title and Content", "texte": ["Cum mută calul"]}], "diapozitiv_activ": 2})
    vz = bool(el(pg, 'zona_note'))
    clic(pg, 'zona_note')
    pg.keyboard.type('Arăt o mutare.')
    s = st(pg)
    v('A4 M zona de note la pornire + clic + tastare → note_diapozitive', vz and s['note_diapozitive'] == ['', 'Arăt o mutare.'], [vz, s['note_diapozitive']])
    clic(pg, 'bara_stare:Notes')
    a = bool(el(pg, 'zona_note'))
    fila(pg, 'View')
    mso(pg, 'ShowNotes')
    b = bool(el(pg, 'zona_note'))
    v('A4 M Notes (bara de stare) ascunde zona, View › Notes o arată', not a and b, [a, b])
    clic(pg, 'bara_stare:Slide Sorter')
    s1 = st(pg)['vedere']
    fara_note = not el(pg, 'bara_stare:Notes')
    clic(pg, 'bara_stare:Normal')
    s2 = st(pg)['vedere']
    v('A4 M Slide Sorter → sortare (bara fără Notes), Normal → normala', s1 == 'sortare' and fara_note and s2 == 'normala', [s1, fara_note, s2])
    clic(pg, 'bara_stare:Reading View')
    s1 = st(pg)['vedere']
    taste(pg, 'Escape')
    s2 = st(pg)['vedere']
    v('A4 M Reading View → citire, Esc → normala', s1 == 'citire' and s2 == 'normala', [s1, s2])
    clic(pg, 'bara_stare:Slide Show')
    s1 = st(pg)
    taste(pg, 'Escape')
    s2 = st(pg)['vedere']
    v('A4 M Slide Show (bara de stare) → expunere de la diapozitivul curent, Esc → normala', s1['vedere'] == 'expunere' and s1['expunere'] == 2 and s2 == 'normala', [s1['vedere'], s1['expunere'], s2])
    taste(pg, 'F5')
    s1 = st(pg)
    taste(pg, 'Escape')
    v('A4 K F5 → expunere de la 1, Esc → normala', s1['vedere'] == 'expunere' and s1['expunere'] == 1 and st(pg)['vedere'] == 'normala', [s1['vedere'], s1['expunere']])


def minor_c1(H):
    # ---- MINOR: duratele, imaginea pe Two Content
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["A"]}]})
    fila(pg, 'Transitions')
    rs = {}
    for ef in ('Push', 'Wipe', 'Fade'):
        r = pg.evaluate("n=>{const e=[...document.querySelectorAll('.lh-ap-p-galerie-el[data-lh-eticheta=\"'+n+'\"]')].find(x=>x.offsetParent);if(!e)return null;e.scrollIntoView({block:'nearest'});const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}", ef)
        if r:
            pg.mouse.click(*r)
            pg.wait_for_timeout(80)
        rs[ef] = st(pg)['durata_tranzitie']
    v('MINOR M duratele: Push 1, Wipe 1, Fade 0,7 (d_durate)', rs == {'Push': [1], 'Wipe': [1], 'Fade': [0.7]}, rs)
    pg = H.app('powerpoint', TWO)
    fila(pg, 'Insert')
    mso(pg, 'FlyoutAnchorInsertPictures')
    clic(pg, 'meniu:This Device...')
    pg.keyboard.type('pamant.png')
    taste(pg, 'Enter')
    s = st(pg)
    v('MINOR K imaginea pe Two Content intră în caseta goală: 3 forme, a treia imagine [486, 163, 408, 304]',
      [f['fel'] for f in s['forme_diapozitiv'][1]] == ['substituent', 'substituent', 'imagine'] and s['pozitii_forme'][1][2] == [486, 163, 408, 304], [s['forme_diapozitiv'][1], s['pozitii_forme'][1]])


# ================================================================ constructorul 2: A3, A1, A2, MINOR (mouse ȘI tastatură)
from urllib.parse import urlsplit   # noqa: E402
VULC = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}, {"aspect": "Title and Content", "texte": ["B"]}], "diapozitiv_activ": 1}
ECRANE = [('mica', (1093, 526), 1.25, False), ('tel360', (360, 740), 2, True), ('tel390', (390, 844), 3, True)]
INFO = """(t)=>{const e=LH.aplicatii.element('powerpoint',t);if(!e)return null;const r=e.getBoundingClientRect();const cx=r.x+r.width/2,cy=r.y+r.height/2;
 const h=document.elementFromPoint(cx,cy);return {rect:[r.x,r.y,r.width,r.height].map(Math.round),vh:innerHeight,vw:innerWidth,c:[cx,cy],
 lovit:!!h&&(h===e||e.contains(h)),jos_in_ecran:r.bottom<=innerHeight&&r.right<=innerWidth&&r.x>=0}}"""
DERULABIL = """(()=>{const p=document.querySelector('.lh-ap-p-panou');if(!p)return null;const d=[...p.querySelectorAll('[data-lh-tip=Pane],[data-lh-tip=List]')].find(x=>getComputedStyle(x).overflowY==='auto');
 if(!d)return null;const r=d.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,d.scrollTop,d.scrollHeight-d.clientHeight]})()"""


def ecran(H, vp, sc, mobil):
    """un context nou în ACELAȘI Chromium headless, cu alt ecran (fereastra mică = 1366×657 la 125 % → 1093×526 css; telefon cu
    atingeri); tot ce nu e 127.0.0.1/localhost abandonat"""
    ctx = H.br.new_context(viewport={'width': vp[0], 'height': vp[1]}, device_scale_factor=sc, is_mobile=mobil, has_touch=mobil)

    def ruta(r):
        if urlsplit(r.request.url).hostname not in ('127.0.0.1', 'localhost'):
            H.plecate.append(r.request.url)
            return r.abort()
        return r.continue_()
    ctx.route('**/*', ruta)
    return ctx


def pagina(H, ctx, continut):
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: H.erori.append(str(e)[:300]))
    pg.goto(H.baza + '/aplicatii/poligon.html', wait_until='load')
    pg.wait_for_function('window.LH && LH.aplicatii && LH.aplicatii.gata')
    pg.evaluate("([a,c])=>LH.aplicatii.deschide(a,{continut:c,focus:true}).then(()=>{window.__m=(window.__lhAplicatieEv||[]).length})", ['powerpoint', continut])
    pg.wait_for_timeout(300)
    return pg


def apasa(pg, xy, mobil, buton='left'):
    """gestul omului în punctul dat: atingere pe telefon, clic de mouse altfel"""
    if mobil and buton == 'left':
        pg.touchscreen.tap(xy[0], xy[1])
    else:
        pg.mouse.click(xy[0], xy[1], button=buton)
    pg.wait_for_timeout(150)


def apasa_tinta(pg, t, mobil, buton='left'):
    i = pg.evaluate(INFO, t)
    if i:
        apasa(pg, i['c'], mobil, buton)
    return i


def glisare(pg, x, y, mobil, pasi=3):
    """rotița (laptop) sau degetul (telefon, CDP touch) peste punctul dat — fără scrollIntoView"""
    if mobil:
        cdp = pg.context.new_cdp_session(pg)
        for _ in range(pasi):
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
            for i in range(1, 11):
                cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': max(1, y - 10 * i)}]})
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
            pg.wait_for_timeout(250)
    else:
        pg.mouse.move(x, y)
        for _ in range(pasi * 2):
            pg.mouse.wheel(0, 120)
            pg.wait_for_timeout(100)
    pg.wait_for_timeout(250)


def a3(H):
    for nume, vp, sc, mobil in ECRANE:
        ctx = ecran(H, vp, sc, mobil)
        try:
            pg = pagina(H, ctx, VULC)
            apasa_tinta(pg, 'diapozitiv', mobil, 'right')
            m = apasa_tinta(pg, 'meniu:Format Background...', mobil)
            apasa_tinta(pg, 'fereastra:Solid fill', mobil)
            apasa_tinta(pg, 'fereastra:Color', mobil)
            apasa_tinta(pg, 'meniu:Light Blue', mobil)
            der0 = pg.evaluate(DERULABIL)
            ap0 = pg.evaluate(INFO, 'fereastra:Apply to All')
            if der0:
                glisare(pg, der0[0], der0[1], mobil)
            der1 = pg.evaluate(DERULABIL)
            ap = pg.evaluate(INFO, 'fereastra:Apply to All')
            rb = pg.evaluate(INFO, 'fereastra:Reset Background')
            s1 = st(pg)['fundal_diapozitive']
            if ap and ap['lovit'] and ap['jos_in_ecran']:
                apasa(pg, ap['c'], mobil)
            s2 = st(pg)['fundal_diapozitive']
            v('A3 %s Format Background: Solid fill › Color › Light Blue; conținutul se derulează cu %s; Apply to All și Reset Background '
              'rămân la vedere; Apply to All atins în centru (elementFromPoint) → toate #00B0F0' % (nume, 'degetul' if mobil else 'rotița'),
              bool(der0) and der1 and (der1[3] <= 0 or der1[2] > 0) and ap and ap['lovit'] and ap['jos_in_ecran'] and rb and rb['jos_in_ecran']
              and s1[0] == {'tip': 'solid', 'culoare': '#00B0F0'} and s2 == [{'tip': 'solid', 'culoare': '#00B0F0'}] * 2,
              {'meniu': m, 'derulabil_inainte': der0, 'derulabil_dupa': der1, 'apply_inainte': ap0, 'apply': ap, 'reset': rb, 's1': s1, 's2': s2})
            pg.close()
            # Animation Pane (două animații): panoul se termină în zonă; rândul 2 → Move Up, atinse în centru
            pg = pagina(H, ctx, {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}], "selectie_forma": [1, 1]})
            fila(pg, 'Animations')
            clic(pg, 'meniu:Fade')
            apasa_tinta(pg, 'forma:1/2', mobil)   # pe telefon chenarul casetei nealese nu se atinge (aplicatii.css @media): caseta, apoi efectul
            clic(pg, 'meniu:Fly In')
            clic(pg, 'mso:AnimationCustom')
            pn = pg.evaluate("(()=>{const p=document.querySelector('.lh-ap-p-panou');if(!p)return null;const r=p.getBoundingClientRect();const z=document.querySelector('.lh-ap-p-zona').getBoundingClientRect();return [Math.round(r.top),Math.round(r.bottom),Math.round(z.bottom),innerHeight]})()")
            r2 = pg.evaluate("(()=>{const r=document.querySelectorAll('.lh-ap-p-anim-rand')[1];if(!r)return null;const q=r.getBoundingClientRect();return [q.x+q.width/2,q.y+q.height/2]})()")
            if r2:
                apasa(pg, r2, mobil)
            mu = apasa_tinta(pg, 'fereastra:Move Up', mobil)
            o = st(pg)['ordine_animatii']
            v('A3 %s Animation Pane: panoul se termină în zona de pe ecran; rândul 2 → Move Up (la vedere, atins în centru) → [2, 1]' % nume,
              pn and pn[1] <= min(pn[2], pn[3]) + 1 and mu and mu['lovit'] and o == [2, 1], {'panou_sus_jos_zona_ecran': pn, 'move_up': mu, 'ordine': o})
            pg.close()
        finally:
            ctx.close()
    # 1366×768: panoul la locul din referință (y = 218 → 37 px sub zonă, 8 px de la dreapta), 520 înalt, butoanele la locul lor
    pg = H.app('powerpoint', VULC)
    clic(pg, 'diapozitiv', button='right')
    clic(pg, 'meniu:Format Background...')
    clic(pg, 'fereastra:Solid fill')
    g = pg.evaluate("(()=>{const p=document.querySelector('.lh-ap-p-panou').getBoundingClientRect();const a=LH.aplicatii.element('powerpoint','fereastra:Apply to All').getBoundingClientRect();return [p.x,p.y,p.width,p.height,a.x,a.y].map(Math.round)})()")
    v('A3 1366×768 Format Background la locul din referință: panou [≈1088, 218, 269, 520], Apply to All [≈1095, 701] (MINOR: era 34 px mai sus)',
      abs(g[0] - 1088) <= 3 and abs(g[1] - 218) <= 1 and g[3] == 520 and abs(g[4] - 1095) <= 3 and abs(g[5] - 701) <= 2, g)
    pg.close()


LISTA = """(()=>{const m=document.querySelector('.lh-ap-p-lista-ref');if(!m)return null;const r=m.getBoundingClientRect();
 const ant=[...m.querySelectorAll('.lh-ap-p-antet')].map(a=>{const q=a.getBoundingClientRect();return [a.textContent,Math.round(q.height),getComputedStyle(a).display!=='none'&&q.width>0]});
 return {cheie:m.getAttribute('data-lh-suprafata'),rect:[r.x,r.y,r.width,r.height].map(Math.round),antete:ant,scroll:[m.scrollTop,m.scrollHeight-m.clientHeight],
  titluri:[...m.querySelectorAll('[data-lh-tip=ListItem][title]')].length,randuri:[...m.querySelectorAll('[data-lh-tip=ListItem]')].length}})()"""
GRUPURI_FORME = ['Recently Used Shapes', 'Lines', 'Rectangles', 'Basic Shapes', 'Block Arrows', 'Equation Shapes', 'Flowchart', 'Stars and Banners',
                 'Callouts', 'Action Buttons']


def rand_lista(pg, nume):
    """dreptunghiul rândului din lista deschisă + ce se află în centrul lui (elementFromPoint)"""
    return pg.evaluate("""n=>{const m=document.querySelector('.lh-ap-p-lista-ref');if(!m)return null;const e=m.querySelector('[data-lh-eticheta="'+CSS.escape(n)+'"]');if(!e)return null;
     const r=e.getBoundingClientRect();const h=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
     return {rect:[r.x,r.y,r.width,r.height].map(Math.round),c:[r.x+r.width/2,r.y+r.height/2],lovit:!!h&&(h===e||e.contains(h)),title:e.title,
      svg:(e.querySelector('svg')||{}).innerHTML||null,sag:!!e.querySelector('.lh-ap-sag')}}""", nume)


def a1(H):
    # ---- M: Insert › Shapes ▾ — lipită sub buton, titlurile grupurilor, desenele, numele la hover, Action Buttons, Arrow: Right pe diapozitiv
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Only", "texte": ["Călătoria"]}]})
    fila(pg, 'Insert')
    mso(pg, 'ShapesInsertGallery')
    L = pg.evaluate(LISTA)
    ant = {a[0]: a for a in (L or {}).get('antete', [])}
    desene = pg.evaluate("[...new Set([...document.querySelectorAll('.lh-ap-p-lista-ref [data-lh-tip=ListItem] svg')].map(s=>s.innerHTML))].length")
    v('A1 M Shapes ▾ (Insert): lista lipită sub buton (y ≈ 159, nu 3), 190 de rânduri cu title, 10 titluri de grup scrise pe banda lor, desene diferite',
      L and abs(L['rect'][1] - 159) <= 4 and L['randuri'] == 190 and L['titluri'] == 190 and all(g in ant and ant[g][2] and ant[g][1] >= 28 for g in GRUPURI_FORME) and desene >= 15,
      {'lista': L and {k: L[k] for k in ('rect', 'randuri', 'titluri', 'scroll')}, 'antete': L and L['antete'], 'desene_diferite': desene})
    ar = rand_lista(pg, 'Arrow: Right')
    st_ = rand_lista(pg, 'Star: 5 Points')
    v('A1 M „Arrow: Right” și „Star: 5 Points”: title = numele, desenul lor (săgeată / stea, nu pătratul comun), la vedere',
      ar and ar['title'] == 'Arrow: Right' and ar['lovit'] and 'polygon' in (ar['svg'] or '') and st_ and st_['title'] == 'Star: 5 Points' and st_['svg'] != ar['svg'],
      {'arrow': ar, 'stea': st_ and {k: st_[k] for k in ('title', 'lovit')}})
    ab0 = rand_lista(pg, 'Action Button: Blank')
    c = pg.evaluate("(()=>{const r=document.querySelector('.lh-ap-p-lista-ref').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()")
    glisare(pg, c[0], c[1], False, pasi=5)
    ab = rand_lista(pg, 'Action Button: Blank')
    L2 = pg.evaluate(LISTA)
    v('A1 M Action Buttons: 12 rânduri cu mărime (nu 0×0); rotița derulează lista până la ele, „Action Button: Blank” se atinge în centru',
      ab and ab['rect'][2] >= 20 and ab['rect'][3] >= 20 and ab['lovit'] and L2['scroll'][0] > 0
      and pg.evaluate("[...document.querySelectorAll('.lh-ap-p-lista-ref [data-lh-eticheta^=\"Action Button:\"]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>=20&&r.height>=20}).length") == 12,
      {'inainte': ab0, 'dupa': ab, 'scroll': L2['scroll']})
    pg.mouse.wheel(0, -5000)
    pg.wait_for_timeout(200)
    ar = rand_lista(pg, 'Arrow: Right')
    pg.mouse.click(*ar['c'])
    pg.wait_for_timeout(120)
    c = pg.evaluate("(()=>{const r=LH.aplicatii.element('powerpoint','diapozitiv').getBoundingClientRect();return [r.x+r.width*0.5,r.y+r.height*0.6]})()")
    pg.mouse.click(c[0], c[1])
    pg.wait_for_timeout(150)
    s = st(pg)
    v('A1 M clic pe „Arrow: Right” în galerie, apoi clic pe diapozitiv → săgeata pe diapozitiv', any(f.get('forma') == 'Arrow: Right' for f in s['forme_diapozitiv'][0]), s['forme_diapozitiv'][0])
    pg.close()
    # ---- K: Alt, N, S, H deschide galeria; săgețile mută alegerea, Esc închide; Enter = ca clicul (pune desenarea; unde o pune: [presupus] R13-14)
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Only", "texte": ["Călătoria"]}]})
    taste(pg, 'Alt')
    taste(pg, 'n', 's', 'h')
    a = meniu_vizibil(pg) and pg.evaluate("document.querySelector('.lh-ap-p-lista-ref').getAttribute('data-lh-suprafata')")
    taste(pg, 'ArrowDown', 'ArrowDown')
    t = pg.evaluate("(document.querySelector('.lh-ap-p-lista-ref .lh-ap-p-tasta')||{getAttribute:()=>null}).getAttribute('data-lh-eticheta')")
    doi = pg.evaluate("[...document.querySelectorAll('.lh-ap-p-lista-ref [data-lh-tip=ListItem]')][1].getAttribute('data-lh-eticheta')")
    taste(pg, 'Escape')
    b = meniu_vizibil(pg)
    v('A1 K Alt, N, S, H → galeria Shapes; ↓ ↓ → al doilea rând ales; Esc o închide', a == 'lista.ShapesInsertGallery' and t == doi and not b, [a, t, doi, b])
    pg.close()
    # ---- fereastra mică (1093×526): lista lipită sub buton, tăiată jos și derulabilă cu rotița
    ctx = ecran(H, (1093, 526), 1.25, False)
    try:
        pg = pagina(H, ctx, {"diapozitive": [{"aspect": "Title Only", "texte": ["Călătoria"]}]})
        fila(pg, 'Insert')
        mso(pg, 'ShapesInsertGallery')
        L = pg.evaluate(LISTA)
        c = [L['rect'][0] + L['rect'][2] / 2, L['rect'][1] + L['rect'][3] / 2] if L else [0, 0]
        glisare(pg, c[0], c[1], False, pasi=6)
        ab = rand_lista(pg, 'Action Button: Blank')
        v('A1 mica Shapes ▾: lipită sub buton, se termină în fereastră, rotița ajunge la Action Buttons (atins în centru)',
          L and abs(L['rect'][1] - 159) <= 4 and L['rect'][1] + L['rect'][3] <= 526 and ab and ab['lovit'], {'lista': L and L['rect'], 'action_blank': ab})
        pg.close()
    finally:
        ctx.close()


def a2(H):
    # ---- M: Font Color ▾ în panglică pe titlul ales — „Theme Colors” / „Standard Colors” scrise, title pe toate pătratele, fără ▾ la More Colors / Eyedropper
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "selectie_forma": [1, 1]})
    mso(pg, 'FontColorPicker_Dropdown')
    L = pg.evaluate(LISTA)
    ant = {a[0]: a for a in (L or {}).get('antete', [])}
    db = rand_lista(pg, 'Dark Blue')
    mc, ey = rand_lista(pg, 'More Colors...'), rand_lista(pg, 'Eyedropper')
    v('A2 M Font Color ▾: „Theme Colors” (32 px) și „Standard Colors” (35 px) scrise; 70 de pătrate cu title = numele; „Dark Blue” are title; fără ▾ la More Colors / Eyedropper',
      L and ant.get('Theme Colors', [0, 0])[1] == 32 and ant.get('Standard Colors', [0, 0])[1] == 35 and L['titluri'] == 70 and db and db['title'] == 'Dark Blue'
      and mc and not mc['sag'] and ey and not ey['sag'], {'antete': L and L['antete'], 'titluri': L and L['titluri'], 'dark_blue': db, 'more_colors_sag': mc and mc['sag']})
    pg.mouse.click(*db['c'])
    pg.wait_for_timeout(120)
    s = st(pg)
    v('A2 M clic pe „Dark Blue” → textul titlului #002060', s['culoare_text'] == '#002060', s['culoare_text'])
    pg.close()
    # ---- K: Alt, H, F C deschide paleta; ↓ + Enter alege; Esc închide
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "selectie_forma": [1, 1]})
    taste(pg, 'Alt')
    taste(pg, 'h', 'f', 'c')
    a = meniu_vizibil(pg) and pg.evaluate("document.querySelector('.lh-ap-p-lista-ref').getAttribute('data-lh-suprafata')")
    taste(pg, 'Escape')
    b = meniu_vizibil(pg)
    v('A2 K Alt, H, F C → paleta Font Color (cu titlurile); Esc o închide', a == 'lista.FontColorPicker' and not b, [a, b])
    taste(pg, 'Escape', 'Escape')
    taste(pg, 'Alt')
    taste(pg, 'h', 'f', 'c', 'ArrowDown', 'ArrowDown', 'ArrowDown')
    t = pg.evaluate("(document.querySelector('.lh-ap-p-lista-ref .lh-ap-p-tasta')||{getAttribute:()=>null}).getAttribute('data-lh-eticheta')")
    trei = pg.evaluate("[...document.querySelectorAll('.lh-ap-p-lista-ref [data-lh-tip=ListItem]')][2].getAttribute('data-lh-eticheta')")
    taste(pg, 'Enter')
    s = st(pg)
    v('A2 K Alt, H, F C, ↓ ↓ ↓, Enter → al treilea pătrat al paletei pe titlu (nu mai e negru), lista închisă',
      t == trei and s['culoare_text'] not in (None, '#000000') and not meniu_vizibil(pg), [t, trei, s['culoare_text']])
    pg.close()
    # ---- celelalte palete: mini-bara, Format Background › Color, Shape Fill (Home), Shape Outline — aceleași titluri și title
    rez = {}
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Only", "texte": ["Soarele"], "forme": [{"fel": "forma", "forma": "Star: 5 Points", "pozitie": [380, 200, 200, 190]}]}], "selectie_forma": [1, 2]})
    for idm in ('ShapeFillColorPicker_Dropdown', 'OutlineColorPicker_Dropdown'):
        mso(pg, idm)
        L = pg.evaluate(LISTA)
        rez[idm] = L and {'antete': [a[0] for a in L['antete'] if a[2]], 'titluri': L['titluri'], 'cheie': L['cheie']}
        taste(pg, 'Escape')
    pg.close()
    pg = H.app('powerpoint', VULC)
    clic(pg, 'diapozitiv', button='right')
    clic(pg, 'meniu:Format Background...')
    clic(pg, 'fereastra:Solid fill')
    clic(pg, 'fereastra:Color')
    L = pg.evaluate(LISTA)
    rez['FormatBackground_Color'] = L and {'antete': [a[0] for a in L['antete'] if a[2]], 'titluri': L['titluri'], 'cheie': L['cheie']}
    pg.close()
    v('A2 M Shape Fill ▾, Shape Outline ▾, Format Background › Color: „Theme Colors” + „Standard Colors” scrise, pătratele cu title (același cod)',
      all(x and 'Theme Colors' in x['antete'] and 'Standard Colors' in x['antete'] and x['titluri'] >= 60 for x in rez.values()), rez)


def minor_c2(H):
    # ---- Font Color „Font Color Red” cu text ales (a_font_color › buton_cu_text_ales), „Font Color” fără
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "selectie_forma": [1, 1]})
    nume = lambda: pg.evaluate("[...document.querySelectorAll('[data-lh-id-mso=\"FontColorPicker\"] > [data-lh-tip=\"Button\"]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-eticheta'))")
    a = nume()
    clic(pg, 'diapozitiv')
    b = nume()
    v('MINOR M butonul Font Color: „Font Color Red” cu caseta aleasă, „Font Color” după clic pe un loc gol', a == ['Font Color Red'] and b == ['Font Color'], [a, b])
    pg.close()
    # ---- fără diapozitive: indicatorul gol, nu „Slide 1 of 0” (tastatura: Delete pe ultima miniatură)
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["A"]}], "panou": "miniaturi"})
    clic(pg, 'miniatura:1')
    taste(pg, 'Delete')
    ind = pg.evaluate("(()=>{const e=[...document.querySelectorAll('[data-lh-eticheta^=\"View Indicator\"]')].find(x=>x.offsetParent);return e?e.textContent.trim():null})()")
    v('MINOR K Delete pe ultimul diapozitiv → bara de stare fără „Slide 1 of 0”', ind == '' and st(pg)['diapozitiv_activ'] is None, ind)
    pg.close()
    # ---- Format Background: Solid fill bifat după clic; panoul la locul lui
    pg = H.app('powerpoint', VULC)
    clic(pg, 'diapozitiv', button='right')
    clic(pg, 'meniu:Format Background...')
    clic(pg, 'fereastra:Solid fill')
    r = pg.evaluate("(()=>{const e=document.querySelector('.lh-ap-p-panou [data-lh-tip=RadioButton][data-lh-eticheta=\"Solid fill\"]');return e?[e.getAttribute('aria-checked'),e.classList.contains('lh-ap-bifat'),!!e.querySelector('.lh-ap-caseta svg')]:null})()")
    v('MINOR M Format Background › Solid fill → butonul apare bifat (starea solid)', r == ['true', True, True] and st(pg)['fundal_diapozitive'][0]['tip'] == 'solid', r)
    pg.close()
    # ---- Animation Pane: rândurile 22 / 22; „Play From” cu un rând ales, „Play All” fără
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}], "selectie_forma": [1, 1]})
    fila(pg, 'Animations')
    clic(pg, 'meniu:Fade')
    clic(pg, 'margine_forma:1/2')
    clic(pg, 'meniu:Fly In')
    clic(pg, 'diapozitiv')
    clic(pg, 'mso:AnimationCustom')
    play = lambda: pg.evaluate("[...document.querySelectorAll('.lh-ap-p-panou [data-lh-eticheta^=\"Play \"]')].map(x=>x.getAttribute('data-lh-eticheta'))")
    p0 = play()
    rr = pg.evaluate("[...document.querySelectorAll('.lh-ap-p-anim-rand')].map(r=>{const q=r.getBoundingClientRect();return [Math.round(q.y),Math.round(q.height)]})")
    pg.mouse.click(*pg.evaluate("(()=>{const q=document.querySelectorAll('.lh-ap-p-anim-rand')[0].getBoundingClientRect();return [q.x+q.width/2,q.y+q.height/2]})()"))
    pg.wait_for_timeout(100)
    p1 = play()
    v('MINOR M Animation Pane: rândurile la 22 px pas, 22 înalte; „Play All” fără rând ales → „Play From” cu rândul 1 ales',
      len(rr) == 2 and rr[1][0] - rr[0][0] == 22 and rr[0][1] == 22 and p0 == ['Play All'] and p1 == ['Play From'], {'randuri': rr, 'fara': p0, 'cu_rand': p1})
    pg.close()
    # ---- „Save your changes”: Ctrl+W (tastatura) pe prezentarea modificată — bara de titlu goală, întrebarea în corp; Esc o închide
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "selectie_text": [1, 1]})
    pg.keyboard.type('X')
    taste(pg, 'Control+w')
    d = pg.evaluate("(()=>{const d=document.querySelector('.lh-ap-strat-dialog');if(!d)return null;const t=d.querySelector('.lh-ap-titlu-dialog'),q=d.querySelector('.lh-ap-p-intrebare');return [t?t.textContent:null,q?q.textContent:null,q?q.getBoundingClientRect().width>0:false]})()")
    taste(pg, 'Escape')
    s = st(pg)
    v('MINOR K Ctrl+W → „Save your changes”: bara de titlu goală (TitleBar \'\'), întrebarea scrisă în fereastră; Esc → prezentarea rămâne',
      d == ['', 'Save your changes to this file?', True] and s['prezentari_deschise'] == 1 and (s['dialog'] or {}).get('apasat') == 'Cancel' and not pg.evaluate("!!document.querySelector('.lh-ap-strat-dialog')"), {'fereastra': d, 'dupa_esc': [s['prezentari_deschise'], s['dialog']]})
    pg.close()


SECTIUNI = [p4, a4_font, a4_start, a4_umplere, a4_fundal, p3, a4_note, minor_c1, a3, a1, a2, minor_c2]


def main():
    # --inainte = pornirea rundei 13 (7ab108fe: aplicatii/ ca la 8ad9e9a9); --ref <sha> = altă rădăcină (ex. 6751b1f6, predarea
    # constructorului 1); --doar a3,a1 = doar unele secțiuni
    ref = sys.argv[sys.argv.index('--ref') + 1] if '--ref' in sys.argv else ('7ab108fe' if '--inainte' in sys.argv else None)
    doar = sys.argv[sys.argv.index('--doar') + 1].split(',') if '--doar' in sys.argv else None
    rad, tmp = WT, None
    if ref:
        tmp = Path(tempfile.mkdtemp(prefix='lh_r13_' + ref + '_'))
        arh = subprocess.run(['git', '-C', str(WT), 'archive', ref, 'aplicatii'], capture_output=True, check=True).stdout
        tarfile.open(fileobj=io.BytesIO(arh)).extractall(tmp)
        rad = tmp
    try:
        with Ham(radacina=rad) as H:
            for f in SECTIUNI:
                if doar and f.__name__ not in doar:
                    continue
                try:
                    f(H)
                except Exception as e:   # o secțiune care se oprește la mijloc = o verificare picată; celelalte secțiuni merg
                    v(f.__name__ + ' (s-a oprit)', False, repr(e)[:300])
            erori, plecate = H.erori, H.plecate
    finally:
        if tmp:
            shutil.rmtree(tmp, ignore_errors=True)
    picate = [x['verificare'] for x in R if not x['ok']]
    nume = ('proba_grav_inainte' if ref == '7ab108fe' else 'proba_grav_' + ref) if ref else 'proba_grav_dupa'
    out = AICI / ((nume + '_' + '_'.join(doar) if doar else nume) + '.json')
    out.write_text(json.dumps({"radacina": (ref + " (git archive în %TEMP%)") if ref else "worktree", "verificari": R, "picate": picate,
                               "erori_pagina": erori[:20], "cereri_plecate": plecate[:20]}, ensure_ascii=False, indent=1), encoding='utf-8')
    for x in picate:
        print('PICAT:', x)
    print(f'{len(R) - len(picate)}/{len(R)} trecute · erori pagina {len(erori)} · cereri plecate {len(plecate)}')
    print(len(picate))


if __name__ == '__main__':
    main()
