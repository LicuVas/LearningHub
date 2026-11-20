# -*- coding: utf-8 -*-
"""B: telefonul (360 si 390 px, atingeri) si fereastra mica (1093x526 css = 1366x657 la 125%): listele, paletele, panourile, fereastra noua."""
import json, sys
sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe')
from h import Ham, st, ev, centru
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe/'
rez = {}
VULC = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}, {"aspect": "Title and Content", "texte": ["B"]}], "diapozitiv_activ": 1}
# masura unei suprafete: dreptunghiul, cat iese din fereastra (viewport) si din radacina, cat de mici sunt tintele din ea
MAS = """(sel)=>{const s=document.querySelector(sel);if(!s)return null;const r=s.getBoundingClientRect();const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();
 const vw=innerWidth,vh=innerHeight;const T=[...s.querySelectorAll('[data-lh-tinta]')].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden');
 const mici=T.map(e=>{const q=e.getBoundingClientRect();return [e.getAttribute('data-lh-tinta')+':'+(e.getAttribute('data-lh-id')||''),Math.round(q.width),Math.round(q.height)]}).filter(x=>x[1]<32||x[2]<32);
 const afara=T.filter(e=>{const q=e.getBoundingClientRect();return q.right>vw+1||q.bottom>vh+1||q.left<-1||q.top<-1}).map(e=>e.getAttribute('data-lh-tinta')+':'+(e.getAttribute('data-lh-id')||'')).slice(0,12);
 let p=s.parentElement,der=null;while(p&&p!==document.body){const cs=getComputedStyle(p);if((p.scrollWidth>p.clientWidth+1&&/auto|scroll/.test(cs.overflowX))||(p.scrollHeight>p.clientHeight+1&&/auto|scroll/.test(cs.overflowY))){der=[p.className,p.scrollWidth,p.clientWidth,p.scrollHeight,p.clientHeight];break}p=p.parentElement}
 return {rect:[r.x,r.y,r.width,r.height].map(Math.round),vw,vh,radacina:[R.x,R.y,R.width,R.height].map(Math.round),tinte:T.length,n_mici:mici.length,mici:mici.slice(0,8),n_afara:afara.length,afara,derulare_parinte:der,
   overflow:[getComputedStyle(s).overflowX,getComputedStyle(s).overflowY,s.scrollHeight,s.clientHeight]}}"""


def atinge(pg, t, mobil, dx=0.5, dy=0.5):
    r = pg.evaluate("""(t)=>{const e=LH.aplicatii.element('powerpoint',t);if(!e)return null;e.scrollIntoView({block:'nearest',inline:'nearest'});const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}""", t)
    if not r:
        return None
    x, y = r[0] + r[2] * dx, r[1] + r[3] * dy
    if mobil:
        pg.touchscreen.tap(x, y)
    else:
        pg.mouse.click(x, y)
    pg.wait_for_timeout(200)
    return [round(v) for v in r]


def ruleaza(H, nume, mobil):
    o = {}
    pg = H.app('powerpoint', VULC)
    o['radacina'] = pg.evaluate("(()=>{const r=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
    # titlul ales ca obiect: textul, apoi chenarul
    o['tap_text'] = atinge(pg, 'forma:1/1', mobil)
    o['tap_chenar'] = atinge(pg, 'margine_forma:1/1', mobil, 0.5, 0.5)
    o['ev_sel'] = ev(pg)
    atinge(pg, 'mso:TabHome', mobil)
    o['fc_buton'] = atinge(pg, 'mso:FontColorPicker_Dropdown', mobil)
    o['fontcolor'] = pg.evaluate(MAS, '[data-lh-suprafata="lista.FontColorPicker"]')
    pg.screenshot(path=OUT + 'b2_%s_fontcolor.png' % nume)
    o['fc_red'] = atinge(pg, 'meniu:Red', mobil); o['fc_red_stare'] = st(pg).get('culoare_text'); o['ev_fc'] = ev(pg)
    atinge(pg, 'mso:SlideLayoutGallery', mobil); o['layout'] = pg.evaluate(MAS, '[data-lh-suprafata="lista.SlideLayoutGallery"]')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    atinge(pg, 'mso:TabInsert', mobil); atinge(pg, 'mso:ShapesInsertGallery', mobil)
    o['shapes'] = pg.evaluate(MAS, '[data-lh-suprafata="lista.ShapesInsertGallery"]')
    pg.screenshot(path=OUT + 'b2_%s_shapes.png' % nume)
    o['arrow'] = atinge(pg, 'meniu:Arrow: Right', mobil); o['ev_arrow'] = ev(pg)
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    atinge(pg, 'mso:TableInsertGallery', mobil); o['table'] = pg.evaluate(MAS, '[data-lh-suprafata="lista.TableInsertGallery"]')
    pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
    # Format Background din clic dreapta (pe telefon: apasare lunga nu e simulata -> deschid prin clic dreapta de mouse, ca proba de aspect)
    c = centru(pg, 'diapozitiv'); o['tinta_diapozitiv'] = c
    pg.mouse.click(c[0], c[1], button='right'); pg.wait_for_timeout(200)
    o['meniu_diapozitiv'] = pg.evaluate(MAS, '[data-lh-suprafata="meniu_contextual.diapozitiv"]')
    atinge(pg, 'meniu:Format Background...', mobil)
    o['fb'] = pg.evaluate(MAS, '.lh-ap-p-panou')
    atinge(pg, 'fereastra:Solid fill', mobil); atinge(pg, 'fereastra:Color', mobil)
    o['fbcolor'] = pg.evaluate(MAS, '[data-lh-suprafata="lista.FormatBackground_Color"]')
    o['fb_lb'] = atinge(pg, 'meniu:Light Blue', mobil)
    o['fb_apply'] = atinge(pg, 'fereastra:Apply to All', mobil)
    o['fb_stare'] = st(pg).get('fundal_diapozitive'); o['ev_fb'] = ev(pg)
    pg.screenshot(path=OUT + 'b2_%s_fb.png' % nume)
    # Animation Pane
    atinge(pg, 'mso:TabAnimations', mobil); atinge(pg, 'mso:AnimationCustom', mobil)
    o['pane'] = pg.evaluate(MAS, '.lh-ap-p-panou')
    atinge(pg, 'mso:AnimationCustom', mobil)
    # fereastra Save your changes: tastez in titlu, apoi X
    atinge(pg, 'forma:1/1', mobil); pg.keyboard.insert_text(' 0'); pg.wait_for_timeout(100)
    o['x'] = atinge(pg, 'bara_titlu:Close', mobil)
    o['dialog'] = pg.evaluate(MAS, '[data-lh-suprafata="dialog.save_your_changes_to_this_file"]')
    o['dialog_stare'] = (st(pg).get('dialog') or {}).get('butoane')
    pg.screenshot(path=OUT + 'b2_%s_dialog.png' % nume)
    o['cancel'] = atinge(pg, 'fereastra:Cancel', mobil); o['ev_dialog'] = ev(pg)
    pg.close()
    return o


for nume, vp, sc, mobil in [('tel360', (360, 740), 2, True), ('tel390', (390, 844), 3, True), ('mica', (1093, 526), 1.25, False)]:
    with Ham(viewport=vp, scale=sc, mobil=mobil) as H:
        rez[nume] = ruleaza(H, nume, mobil)
        rez[nume]['erori'] = H.erori; rez[nume]['plecate'] = H.plecate
json.dump(rez, open(OUT + 'b2_out.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('gata')
