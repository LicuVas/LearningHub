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


def ruleaza(H):
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
    # ---- Background Styles
    pg = H.app('powerpoint', DOUA)
    fila(pg, 'Design')
    mso(pg, 'SlideBackgroundStylesGallery')
    clic(pg, 'meniu:Style 6')
    s = st(pg)
    v('A4 M Design › Background Styles ▾ › Style 6 → #E9E7E7 pe AMBELE', s['fundal_diapozitive'] == [{'tip': 'solid', 'culoare': '#E9E7E7'}] * 2, s['fundal_diapozitive'])
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


def main():
    inainte = '--inainte' in sys.argv
    rad, tmp = WT, None
    if inainte:
        tmp = Path(tempfile.mkdtemp(prefix='lh_r13_head_'))
        arh = subprocess.run(['git', '-C', str(WT), 'archive', 'HEAD', 'aplicatii'], capture_output=True, check=True).stdout
        tarfile.open(fileobj=io.BytesIO(arh)).extractall(tmp)
        rad = tmp
    try:
        with Ham(radacina=rad) as H:
            try:
                ruleaza(H)
            except Exception as e:   # o probă care se oprește la mijloc = restul verificărilor picate
                v('proba s-a oprit', False, repr(e)[:300])
    finally:
        if tmp:
            shutil.rmtree(tmp, ignore_errors=True)
    picate = [x['verificare'] for x in R if not x['ok']]
    out = AICI / ('proba_grav_inainte.json' if inainte else 'proba_grav_dupa.json')
    out.write_text(json.dumps({"radacina": "HEAD (git archive în %TEMP%)" if inainte else "worktree", "verificari": R, "picate": picate}, ensure_ascii=False, indent=1), encoding='utf-8')
    for x in picate:
        print('PICAT:', x)
    print(f'{len(R) - len(picate)}/{len(R)} trecute')
    print(len(picate))


if __name__ == '__main__':
    main()
