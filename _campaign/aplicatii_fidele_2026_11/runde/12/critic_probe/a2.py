# -*- coding: utf-8 -*-
"""A: P4 (Two Content, Pictures, Shapes, Ctrl+C/V obiect), P5 (Duration, Animation Pane, Format Background) + aspectul lor (ecranul = starea)."""
import json, sys
sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe')
from h import Ham, st, ev, clic, centru, nesimulat
from m import JS_ARB, compara
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe/'
rez = {}
# formele de pe ecran ale diapozitivului activ, in puncte (fata de .lh-ap-p-slide, impartit la pxPePunct)
ECRAN = """(()=>{const s=document.querySelector('.lh-ap-p-slide');const z=LH.aplicatii.pxPePunct('powerpoint');const rs=s.getBoundingClientRect();
 return [...s.querySelectorAll('[data-lh-tinta="forma"]')].map(e=>{const r=e.getBoundingClientRect();const svg=e.querySelector('svg');const img=e.querySelector('img');
  return {id:e.getAttribute('data-lh-id'),pt:[(r.x-rs.x)/z,(r.y-rs.y)/z,r.width/z,r.height/z].map(v=>Math.round(v)),txt:(e.innerText||'').trim().slice(0,30),
  svg:svg?svg.outerHTML.slice(0,160):null,img:img?img.getAttribute('src')&&img.getAttribute('src').slice(0,40):null,bg:getComputedStyle(e).backgroundColor,bgi:getComputedStyle(e).backgroundImage.slice(0,60),bord:getComputedStyle(e).borderStyle,cls:e.className}})})()"""
FUNDAL = """(()=>{const s=document.querySelector('.lh-ap-p-slide');const cs=getComputedStyle(s);const f=s.querySelector('.lh-ap-p-fundal');
 const mini=[...document.querySelectorAll('[data-lh-tinta="miniatura"]')].map(m=>{const c=m.querySelector('[class*=slide],[class*=mini]')||m;return [m.getAttribute('data-lh-id'),getComputedStyle(c).backgroundColor,[...m.querySelectorAll('*')].map(x=>getComputedStyle(x).backgroundColor).filter(b=>b!=='rgba(0, 0, 0, 0)').slice(0,3)]});
 return {slide_bg:cs.backgroundColor,fundal_bg:f?getComputedStyle(f).backgroundColor:null,mini}})()"""
DUR = """(()=>{const e=document.querySelector('[data-lh-id-mso="TransitionDuration"]');if(!e)return null;const i=e.matches('input')?e:e.querySelector('input');const r=e.getBoundingClientRect();
 return {val:i?i.value:(e.innerText||''),ro:i?i.readOnly:null,rect:[r.x,r.y,r.width,r.height].map(Math.round),tag:e.tagName,et:e.getAttribute('data-lh-eticheta'),dis:e.getAttribute('aria-disabled')}})()"""


def k(pg, key, w=150):
    pg.keyboard.press(key); pg.wait_for_timeout(w)


def sub(s, *ch):
    return {c: s.get(c) for c in ch}


def galerie(pg, mso, element):
    clic(pg, 'mso:' + mso); pg.wait_for_timeout(200)
    ok = clic(pg, 'meniu:' + element)
    if not ok:
        ok = pg.evaluate("""([m,e])=>{const g=document.querySelector('[data-lh-id-mso="'+m+'"]');const x=g&&[...g.querySelectorAll('[data-lh-eticheta]')].find(y=>y.getAttribute('data-lh-eticheta')===e);if(!x)return null;x.scrollIntoView({block:'nearest'});const r=x.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]}""", [mso, element])
        if ok:
            pg.mouse.click(ok[0], ok[1]); ok = 'direct'
    pg.wait_for_timeout(150)
    return ok


with Ham() as H:
    # ---------------- P4 Two Content + Pictures + Shapes
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Soarele"]}, {"aspect": "Title and Content", "texte": ["Steaua noastră"]}], "diapozitiv_activ": 2})
    clic(pg, 'mso:TabHome'); clic(pg, 'mso:SlideLayoutGallery'); pg.wait_for_timeout(200); clic(pg, 'meniu:Two Content'); pg.wait_for_timeout(200)
    s = st(pg); rez['p4_two'] = [ev(pg), sub(s, 'diapozitive', 'forme_diapozitiv', 'pozitii_forme')]
    rez['p4_two_ecran'] = pg.evaluate(ECRAN)
    pg.screenshot(path=OUT + 'a2_two.png', clip={'x': 180, 'y': 180, 'width': 1186, 'height': 560})
    c = centru(pg, 'forma:2/2'); pg.mouse.click(c[0], c[1]); pg.keyboard.type('Are apa'); pg.wait_for_timeout(100); ev(pg)
    clic(pg, 'mso:TabInsert'); clic(pg, 'mso:FlyoutAnchorInsertPictures'); pg.wait_for_timeout(200); clic(pg, 'meniu:This Device...'); pg.wait_for_timeout(300)
    rez['p4_poza_dialog'] = [ev(pg), pg.evaluate("(()=>{const d=document.querySelector('[data-lh-suprafata^=\"dialog.\"]');return d&&[d.getAttribute('data-lh-suprafata'),document.activeElement.tagName,document.activeElement.value]})()")]
    if not clic(pg, 'camp:nume_fisier'):
        rez['p4_camp'] = 'fara camp'
    pg.keyboard.press('Control+a'); pg.keyboard.type('pamant.png'); k(pg, 'Enter', 300)
    s = st(pg); rez['p4_poza'] = [ev(pg), sub(s, 'diapozitive', 'forme_diapozitiv', 'pozitii_forme')]
    rez['p4_poza_ecran'] = pg.evaluate(ECRAN)
    pg.screenshot(path=OUT + 'a2_poza.png', clip={'x': 180, 'y': 180, 'width': 1186, 'height': 560})
    pg.close()
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Soarele"]}, {"aspect": "Title Only", "texte": ["Ziua și noaptea"]}], "diapozitiv_activ": 2})
    clic(pg, 'mso:TabInsert'); clic(pg, 'mso:ShapesInsertGallery'); pg.wait_for_timeout(200)
    rez['p4_arrow_rand'] = centru(pg, 'meniu:Arrow: Right')
    clic(pg, 'meniu:Arrow: Right'); pg.wait_for_timeout(150); rez['p4_arrow_ev1'] = ev(pg)
    rez['p4_cursor'] = pg.evaluate("getComputedStyle(document.querySelector('.lh-ap-p-slide')).cursor")
    sr = pg.evaluate("(()=>{const r=document.querySelector('.lh-ap-p-slide').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
    rez['p4_slide_rect'] = sr
    pg.mouse.click(sr[0] + sr[2] * 0.3, sr[1] + sr[3] * 0.6); pg.wait_for_timeout(200)
    s = st(pg); rez['p4_arrow'] = [ev(pg), sub(s, 'diapozitive', 'forme_diapozitiv', 'pozitii_forme')]
    rez['p4_arrow_ecran'] = pg.evaluate(ECRAN)
    rez['p4_arrow_clic_pt'] = [round(sr[2] * 0.3 / pg.evaluate("LH.aplicatii.pxPePunct('powerpoint')")), round(sr[3] * 0.6 / pg.evaluate("LH.aplicatii.pxPePunct('powerpoint')"))]
    pg.screenshot(path=OUT + 'a2_arrow.png', clip={'x': 180, 'y': 180, 'width': 1186, 'height': 560})
    rez['p4_arrow_context'] = pg.evaluate("[...document.querySelectorAll('[data-lh-tip=\"TabItem\"],[data-lh-suprafata^=\"panglica_context\"]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-eticheta')||x.getAttribute('data-lh-suprafata')).slice(0,20)")
    # Ctrl+C pe sageata aleasa -> miniatura 1 -> Ctrl+V
    k(pg, 'Control+c'); clic(pg, 'miniatura:1'); k(pg, 'Control+v', 250)
    s = st(pg); rez['p4_cv'] = [ev(pg), sub(s, 'forme_diapozitiv', 'pozitii_forme')]
    rez['p4_cv_ecran'] = pg.evaluate(ECRAN)
    # steaua: Star: 5 Points pe diapozitivul 1, clic pe ea, Ctrl+C, miniatura 2, Ctrl+V
    clic(pg, 'mso:TabInsert'); clic(pg, 'mso:ShapesInsertGallery'); pg.wait_for_timeout(200); clic(pg, 'meniu:Star: 5 Points')
    pg.mouse.click(sr[0] + sr[2] * 0.8, sr[1] + sr[3] * 0.8); pg.wait_for_timeout(200); ev(pg)
    pg.mouse.click(5, 740); pg.wait_for_timeout(100)
    ecr = pg.evaluate(ECRAN); rez['p4_stea_ecran'] = ecr
    stea = [e for e in ecr if 'Star' in json.dumps(e) or (e.get('svg') and 'polygon' in (e.get('svg') or ''))]
    ids = [e['id'] for e in ecr]
    last = ids[-1] if ids else None
    if last:
        c = centru(pg, 'forma:' + last); pg.mouse.click(c[0], c[1]); pg.wait_for_timeout(100)
        rez['p4_stea_clic'] = ev(pg)
        k(pg, 'Control+c'); clic(pg, 'miniatura:2'); k(pg, 'Control+v', 250)
        rez['p4_stea_cv'] = [ev(pg), sub(st(pg), 'forme_diapozitiv')]
    pg.close()

    # ---------------- P5 Duration
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["A"]}, {"aspect": "Title and Content", "texte": ["B"]}, {"aspect": "Title and Content", "texte": ["C"]}], "diapozitiv_activ": 1})
    clic(pg, 'mso:TabTransitions'); pg.wait_for_timeout(150)
    rez['p5_dur_inainte'] = pg.evaluate(DUR)
    rez['p5_fade'] = galerie(pg, 'AnimationTransitionGallery', 'Fade'); rez['p5_fade_ev'] = ev(pg)
    rez['p5_dur_dupa_fade'] = [pg.evaluate(DUR), st(pg).get('durata_tranzitie')]
    d = pg.evaluate(DUR)
    pg.mouse.click(d['rect'][0] + d['rect'][2] / 2, d['rect'][1] + d['rect'][3] / 2); pg.wait_for_timeout(100)
    pg.keyboard.press('Control+a'); pg.keyboard.type('0,5'); k(pg, 'Enter', 200)
    rez['p5_dur_05'] = [ev(pg), pg.evaluate(DUR), st(pg).get('durata_tranzitie')]
    clic(pg, 'mso:SlideTransitionApplyToAll'); pg.wait_for_timeout(200)
    rez['p5_apply'] = [ev(pg), pg.evaluate(DUR), st(pg).get('durata_tranzitie')]
    clic(pg, 'miniatura:3'); pg.wait_for_timeout(150); rez['p5_dur_mini3'] = pg.evaluate(DUR)
    pg.screenshot(path=OUT + 'a2_dur.png', clip={'x': 900, 'y': 90, 'width': 466, 'height': 80})
    for ef in ['Push', 'Wipe']:
        rez['p5_' + ef] = [galerie(pg, 'AnimationTransitionGallery', ef), ev(pg), pg.evaluate(DUR), st(pg).get('durata_tranzitie'), st(pg).get('tranzitie_galerie')]
    pg.close()

    # ---------------- P5 Animation Pane
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}], "selectie_forma": [1, 1]})
    clic(pg, 'mso:TabAnimations'); rez['p5_anim_fade'] = galerie(pg, 'AnimationGallery', 'Fade')
    c = centru(pg, 'forma:1/2'); pg.mouse.click(c[0], c[1]); pg.wait_for_timeout(100); clic(pg, 'margine_forma:1/2')
    rez['p5_anim_fly'] = galerie(pg, 'AnimationGallery', 'Fly In'); ev(pg)
    clic(pg, 'mso:AnimationCustom'); pg.wait_for_timeout(250); rez['p5_pane_ev'] = ev(pg)
    m = pg.evaluate(JS_ARB, '.lh-ap-p-panou')
    rez['p5_pane_cmp'] = compara('panou.AnimationCustom#doua_animatii', m)
    rez['p5_pane_noduri'] = [(n['tip'], n['et'], n['r'], n['vis'], n['txt'][:50], n['gri']) for n in (m or {}).get('noduri', [])]
    pg.screenshot(path=OUT + 'a2_pane.png', clip={'x': 1080, 'y': 200, 'width': 286, 'height': 160})
    rows = pg.evaluate("[...document.querySelectorAll('.lh-ap-p-anim-rand')].map(r=>{const b=r.getBoundingClientRect();return [r.getAttribute('data-lh-tinta'),b.x+b.width/2,b.y+b.height/2]})")
    rez['p5_rows'] = rows
    if len(rows) >= 2:
        pg.mouse.click(rows[0][1], rows[0][2]); pg.wait_for_timeout(150)
        rez['p5_rand1'] = [ev(pg), [(n['et'], n['gri']) for n in pg.evaluate(JS_ARB, '.lh-ap-p-panou')['noduri'] if n['tip'] == 'Button']]
        rows = pg.evaluate("[...document.querySelectorAll('.lh-ap-p-anim-rand')].map(r=>{const b=r.getBoundingClientRect();return [r.getAttribute('data-lh-tinta'),b.x+b.width/2,b.y+b.height/2]})")
        pg.mouse.click(rows[1][1], rows[1][2]); pg.wait_for_timeout(150)
        rez['p5_rand2'] = [ev(pg), [(n['et'], n['gri']) for n in pg.evaluate(JS_ARB, '.lh-ap-p-panou')['noduri'] if n['tip'] == 'Button']]
        clic(pg, 'fereastra:Move Up'); pg.wait_for_timeout(150)
        rez['p5_moveup'] = [ev(pg), sub(st(pg), 'ordine_animatii'), pg.evaluate("[...document.querySelectorAll('.lh-ap-p-anim-rand')].map(r=>[r.textContent,r.getAttribute('aria-selected')])")]
    pg.close()

    # ---------------- P5 Format Background
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}, {"aspect": "Title and Content", "texte": ["B"]}], "diapozitiv_activ": 1})
    c = centru(pg, 'diapozitiv'); pg.mouse.click(c[0], c[1], button='right'); pg.wait_for_timeout(200)
    clic(pg, 'meniu:Format Background...'); pg.wait_for_timeout(300); ev(pg)
    m = pg.evaluate(JS_ARB, '.lh-ap-p-panou'); rez['p5_fb0_cmp'] = compara('panou.LaunchFormatBackground', m)
    rez['p5_fb0_butoane'] = [(n['et'], n['gri'], n['vis']) for n in (m or {}).get('noduri', []) if n['tip'] in ('Button', 'RadioButton')]
    clic(pg, 'fereastra:Solid fill'); pg.wait_for_timeout(200); rez['p5_solid_ev'] = ev(pg)
    m = pg.evaluate(JS_ARB, '.lh-ap-p-panou'); rez['p5_fb1_cmp'] = compara('panou.LaunchFormatBackground#Solid fill', m)
    rez['p5_fb1_butoane'] = [(n['tip'], n['et'], n['gri'], n['vis'], n['txt'][:20]) for n in (m or {}).get('noduri', []) if n['tip'] in ('Button', 'RadioButton', 'MenuItem', 'CheckBox', 'Edit')]
    rez['p5_fb1_radio'] = pg.evaluate("[...document.querySelectorAll('.lh-ap-p-panou [data-lh-tip=\"RadioButton\"]')].map(x=>[x.getAttribute('data-lh-eticheta'),x.getAttribute('aria-checked'),x.querySelector('input')&&x.querySelector('input').checked,x.classList.contains('lh-ap-apasat')])")
    rez['p5_fb_stare0'] = sub(st(pg), 'fundal_diapozitive')
    pg.screenshot(path=OUT + 'a2_fb.png', clip={'x': 1080, 'y': 200, 'width': 286, 'height': 548})
    clic(pg, 'fereastra:Color'); pg.wait_for_timeout(200); clic(pg, 'meniu:Light Blue'); pg.wait_for_timeout(200)
    rez['p5_lightblue'] = [ev(pg), sub(st(pg), 'fundal_diapozitive'), pg.evaluate(FUNDAL), pg.evaluate("(()=>{const e=document.querySelector('.lh-ap-p-panou [data-lh-tinta=\"fereastra\"][data-lh-id=\"Color\"],.lh-ap-p-panou [data-lh-eticheta^=\"Fill Color\"]');return e&&e.getAttribute('data-lh-eticheta')})()")]
    clic(pg, 'fereastra:Apply to All'); pg.wait_for_timeout(200)
    rez['p5_fb_toate'] = [ev(pg), sub(st(pg), 'fundal_diapozitive'), pg.evaluate(FUNDAL)]
    rez['p5_fb_reset'] = pg.evaluate("[...document.querySelectorAll('.lh-ap-p-panou [data-lh-tip=\"Button\"]')].map(x=>[x.getAttribute('data-lh-eticheta'),x.getAttribute('aria-disabled')])")
    clic(pg, 'fereastra:Reset Background'); rez['p5_fb_reset_clic'] = [ev(pg), nesimulat(pg)]
    pg.close()
    rez['erori'] = H.erori; rez['plecate'] = H.plecate
json.dump(rez, open(OUT + 'a2_out.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('gata')
