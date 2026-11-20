# -*- coding: utf-8 -*-
"""Tabelul drumurilor: comenzile din rezText-ul lectiilor VI (m1-l02 ... m2-l10), facute cu clicuri adevarate pe poligon."""
import json, sys
sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe')
from h import Ham, st, ev, clic, centru, nesimulat
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe/'
rez = {}
TREI = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}, {"aspect": "Title and Content", "texte": ["Lava", "Rand 1"]}, {"aspect": "Title Only", "texte": ["Ziua"]}], "diapozitiv_activ": 1}
GASESTE = """([et,sup])=>{const rad=document.querySelector('[data-lh-aplicatie]');const zona=sup?document.querySelectorAll(sup):[rad];
 for(const z of zona){const x=[...z.querySelectorAll('[data-lh-eticheta]')].find(y=>y.getAttribute('data-lh-eticheta')===et&&y.getClientRects().length&&getComputedStyle(y).visibility!=='hidden');
 if(x){x.scrollIntoView({block:'nearest',inline:'nearest'});const r=x.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,x.getAttribute('aria-disabled'),x.getAttribute('data-lh-tinta')]}}return null}"""


def cmd(pg, et, sup=None, button='left'):
    r = pg.evaluate(GASESTE, [et, sup])
    if not r:
        return [et, 'NEGASIT']
    pg.mouse.click(r[0], r[1], button=button); pg.wait_for_timeout(180)
    e = ev(pg); n = nesimulat(pg)
    return [et, r[2], [(x['g'], x['a'], x['t']) for x in e][-2:], n[:1]]


def k(pg, key, w=150):
    pg.keyboard.press(key); pg.wait_for_timeout(w)


def selecteaza(pg, d_s):
    c = centru(pg, 'forma:' + d_s); pg.mouse.click(c[0], c[1]); pg.wait_for_timeout(80); clic(pg, 'margine_forma:' + d_s); ev(pg)


with Ham() as H:
    L = {}
    # m1-l02: Notes, View>Notes, Slide Sorter, Normal, Slide Show din bara de stare, F5 pana la ecranul negru
    pg = H.app('powerpoint', TREI)
    L['m1-l02'] = [cmd(pg, 'Notes', '[data-lh-suprafata="bara_stare"]'), cmd(pg, 'Notes', '[data-lh-suprafata="bara_stare"]'),
                   cmd(pg, 'View'), cmd(pg, 'Notes', '[data-lh-suprafata="panglica.TabView"]'),
                   cmd(pg, 'Slide Sorter', '[data-lh-suprafata="bara_stare"]'), cmd(pg, 'Normal', '[data-lh-suprafata="bara_stare"]'),
                   cmd(pg, 'Slide Show', '[data-lh-suprafata="bara_stare"]')]
    k(pg, 'Escape'); ev(pg)
    k(pg, 'F5', 300)
    for i in range(5):
        pg.mouse.click(683, 400); pg.wait_for_timeout(120)
    L['m1-l02'].append(['F5+5 clicuri', [(x['g'], x['a']) for x in ev(pg)][-3:], st(pg).get('diapozitiv_activ')])
    k(pg, 'Escape'); ev(pg)
    L['m1-l02'].append(cmd(pg, 'Insert')); L['m1-l02'].append(cmd(pg, 'Table', '[data-lh-suprafata="panglica.TabInsert"]'))
    pg.close()
    # m1-l03: File > New > Blank Presentation, Save As > Browse, Save as type, Ctrl+O > Browse
    pg = H.app('powerpoint', TREI)
    L['m1-l03'] = [cmd(pg, 'File'), cmd(pg, 'New', '.lh-ap-strat-backstage'), cmd(pg, 'Blank Presentation', '.lh-ap-strat-backstage')]
    L['m1-l03'].append(['dupa Blank', st(pg).get('prezentare_activa'), st(pg).get('prezentari_deschise')])
    k(pg, 'F12', 300); L['m1-l03'].append(['F12', [(x['g'], x['a']) for x in ev(pg)], (st(pg).get('dialog_salvare') or st(pg).get('dialog'))])
    L['m1-l03'].append(cmd(pg, 'Save as type:', None))
    k(pg, 'Escape', 200); ev(pg)
    k(pg, 'Control+s', 300); L['m1-l03'].append(['Ctrl+S', [(x['g'], x['a'], x['t']) for x in ev(pg)]])
    L['m1-l03'].append(cmd(pg, 'More options...', '.lh-ap-strat-backstage'))
    L['m1-l03'].append(cmd(pg, 'Browse', '.lh-ap-strat-backstage'))
    k(pg, 'Escape', 200); k(pg, 'Escape', 200); ev(pg)
    pg.close()
    # m1-l05: Duplicate Slide, Delete, Ctrl+X pe sageata, drag imagine (doar ce se poate)
    pg = H.app('powerpoint', TREI)
    c = centru(pg, 'miniatura:2'); pg.mouse.click(c[0], c[1], button='right'); pg.wait_for_timeout(200); ev(pg)
    L['m1-l05'] = [cmd(pg, 'Duplicate Slide')]
    L['m1-l05'].append(['dupa', [d['texte'] for d in st(pg)['diapozitive']]])
    pg.close()
    # m1-l06: Shape Fill / Shape Outline pe o forma inserata; Background Styles; Italic; teme
    pg = H.app('powerpoint', TREI)
    clic(pg, 'mso:TabInsert'); clic(pg, 'mso:ShapesInsertGallery'); pg.wait_for_timeout(150); clic(pg, 'meniu:Star: 5 Points')
    sr = pg.evaluate("(()=>{const r=document.querySelector('.lh-ap-p-slide').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
    pg.mouse.click(sr[0] + sr[2] * 0.75, sr[1] + sr[3] * 0.75); pg.wait_for_timeout(200); ev(pg)
    L['m1-l06'] = [['fila context', pg.evaluate("[...document.querySelectorAll('[data-lh-id-mso]')].filter(x=>/^Tab/.test(x.getAttribute('data-lh-id-mso'))&&x.getClientRects().length).map(x=>x.getAttribute('data-lh-eticheta')).slice(-3)")]]
    L['m1-l06'].append(cmd(pg, 'Shape Format'))
    L['m1-l06'].append(cmd(pg, 'Shape Fill'))
    L['m1-l06'].append(cmd(pg, 'More Options', '[data-lh-eticheta="Shape Fill"]'))
    L['m1-l06'].append(cmd(pg, 'Yellow')); L['m1-l06'].append(['forme', st(pg).get('forme_diapozitiv')])
    pg.keyboard.press('Escape'); ev(pg)
    L['m1-l06'].append(cmd(pg, 'More Options', '[data-lh-eticheta="Shape Outline"]'))
    pg.keyboard.press('Escape'); ev(pg)
    L['m1-l06'].append(cmd(pg, 'Design'))
    L['m1-l06'].append(cmd(pg, 'Background Styles', '[data-lh-suprafata="panglica.TabDesign"]'))
    L['m1-l06'].append(cmd(pg, 'More Options', '[data-lh-suprafata="panglica.TabDesign"] [data-lh-eticheta="Background Styles"]'))
    L['m1-l06'].append(cmd(pg, 'Format Background', '[data-lh-suprafata="panglica.TabDesign"]'))
    pg.close()
    # m1-l07: Transitions Push, Animations None / Appear, Start: After Previous / With Previous
    pg = H.app('powerpoint', TREI)
    selecteaza(pg, '1/1')
    L['m1-l07'] = [cmd(pg, 'Animations'), cmd(pg, 'Appear', '[data-lh-suprafata="panglica.TabAnimations"]'), cmd(pg, 'None', '[data-lh-suprafata="panglica.TabAnimations"]')]
    L['m1-l07'].append(cmd(pg, 'Fade', '[data-lh-suprafata="panglica.TabAnimations"]'))
    L['m1-l07'].append(cmd(pg, 'Start', '[data-lh-suprafata="panglica.TabAnimations"]'))
    L['m1-l07'].append(cmd(pg, 'Open', '[data-lh-suprafata="panglica.TabAnimations"] [data-lh-eticheta="Start"]'))
    L['m1-l07'].append(cmd(pg, 'After Previous'))
    pg.keyboard.press('Escape'); ev(pg)
    L['m1-l07'].append(['animatii', st(pg).get('diapozitive')[0]])
    pg.close()
    # m2-l08: Font > Calibri Light (Headings)
    pg = H.app('powerpoint', TREI)
    selecteaza(pg, '1/1')
    L['m2-l08'] = [cmd(pg, 'Home'), cmd(pg, 'Open', '[data-lh-suprafata="panglica.TabHome"] [data-lh-eticheta="Font"]'), cmd(pg, 'Font', '[data-lh-suprafata="panglica.TabHome"]')]
    L['m2-l08'].append(cmd(pg, 'Calibri Light (Headings)'))
    L['m2-l08'].append(['font', pg.evaluate("(()=>{const i=document.querySelector('[data-lh-id-mso=\"Font\"] input');return i&&i.value})()")])
    pg.close()
    # m2-l09 / m2-l10: Insert Picture - lista de fisiere, butonul Insert; clic pe sageata -> Animations -> Fade
    pg = H.app('powerpoint', TREI)
    clic(pg, 'mso:TabInsert'); clic(pg, 'mso:FlyoutAnchorInsertPictures'); pg.wait_for_timeout(150); clic(pg, 'meniu:This Device...'); pg.wait_for_timeout(300); ev(pg)
    L['m2-l09'] = [['Insert Picture', pg.evaluate("(()=>{const d=document.querySelector('[data-lh-suprafata=\"dialog.PictureInsertFromFilePowerPoint\"]');if(!d)return null;return {butoane:[...d.querySelectorAll('[data-lh-tip=\"Button\"],[data-lh-tip=\"SplitButton\"]')].filter(b=>(b.innerText||'').trim()).map(b=>(b.innerText||'').trim()).slice(-6),lista:[...d.querySelectorAll('[data-lh-tip=\"ListItem\"]')].map(x=>x.getAttribute('data-lh-eticheta')).slice(0,8)}})()")]]
    k(pg, 'Escape', 200); ev(pg)
    clic(pg, 'miniatura:3'); clic(pg, 'mso:TabInsert'); clic(pg, 'mso:ShapesInsertGallery'); pg.wait_for_timeout(150); clic(pg, 'meniu:Arrow: Right')
    pg.mouse.click(sr[0] + sr[2] * 0.4, sr[1] + sr[3] * 0.6); pg.wait_for_timeout(200)
    pg.mouse.click(5, 740); pg.wait_for_timeout(100); ev(pg)
    ids = pg.evaluate("[...document.querySelectorAll('.lh-ap-p-slide [data-lh-tinta=\"forma\"]')].map(e=>e.getAttribute('data-lh-id'))")
    c = centru(pg, 'forma:' + ids[-1]); pg.mouse.click(c[0], c[1]); pg.wait_for_timeout(120)
    L['m2-l10'] = [['clic pe sageata', [(x['g'], x['a'], x['t']) for x in ev(pg)]]]
    L['m2-l10'].append(cmd(pg, 'Animations')); L['m2-l10'].append(cmd(pg, 'Fade', '[data-lh-suprafata="panglica.TabAnimations"]'))
    L['m2-l10'].append(['animatii d3', (st(pg).get('diapozitive') or [{}, {}, {}])[2]])
    k(pg, 'Control+c'); L['m2-l10'].append(['Ctrl+C dupa clic pe sageata', [(x['g'], x['a']) for x in ev(pg)]])
    pg.close()
    rez['L'] = L; rez['erori'] = H.erori; rez['plecate'] = H.plecate
json.dump(rez, open(OUT + 'l1_out.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('gata')
