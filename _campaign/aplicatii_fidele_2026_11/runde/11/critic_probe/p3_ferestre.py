# -*- coding: utf-8 -*-
"""Proba 3: ferestrele (dreptunghiuri față de referință, câmpuri vizibile, evenimentele OK), New Slide (geometria), KeyTips."""
import sys, json
sys.path.insert(0, __import__('os').path.dirname(__file__))
from h import Ham, st, ev, el, clic, nesimulat, scrie, centru, AICI

C2 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Clasa a VI-a']},
                      {'aspect': 'Title and Content', 'texte': ['Ce sunt', 'Munti de foc']}], 'diapozitiv_activ': 1}
REF = json.load(open('C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/uia_powerpoint.json', encoding='utf-8'))['suprafete']
R = {}
RECT = """(s)=>{const root=document.querySelector('[data-lh-aplicatie=powerpoint]');const R0=root.getBoundingClientRect();const d=root.querySelector('[data-lh-suprafata="'+s+'"]');if(!d)return null;
 const r=d.getBoundingClientRect();const inp=[...d.querySelectorAll('input')].filter(i=>i.offsetParent).map(i=>{const q=i.getBoundingClientRect();return [i.closest('[data-lh-eticheta]')&&i.closest('[data-lh-eticheta]').getAttribute('data-lh-eticheta'),i.value,Math.round(q.x-R0.x),Math.round(q.y-R0.y),Math.round(q.width),Math.round(q.height),getComputedStyle(i).visibility]});
 return {rect:[Math.round(r.x-R0.x),Math.round(r.y-R0.y),Math.round(r.width),Math.round(r.height)],inputs:inp}}"""
with Ham() as H:
    pg = H.app('powerpoint', C2)
    # Insert Table: toate evenimentele
    clic(pg, 'mso:TabInsert'); clic(pg, 'mso:TableInsertGallery'); clic(pg, 'meniu:Insert Table...')
    pg.wait_for_timeout(100)
    R['tabel_rect'] = pg.evaluate(RECT, 'dialog.TableInsertDialog'); R['tabel_ref'] = REF['dialog.TableInsertDialog']['rect_css']
    d = pg.evaluate("(()=>{const d=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"dialog.TableInsertDialog\"]');const r=d.getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()")
    pg.screenshot(path=str(AICI / 'cap_tabel.png'), clip={'x': d[0] - 4, 'y': d[1] - 4, 'width': d[2] + 8, 'height': d[3] + 8})
    ev(pg)
    ok = clic(pg, 'fereastra:OK'); pg.wait_for_timeout(300)
    R['tabel_ok'] = {'clic': ok, 'ev': ev(pg), 'forme': st(pg)['diapozitive'][0]['forme'], 'sel': st(pg)['selectie_forma']}
    pg.keyboard.press('Control+z'); R['tabel_ctrlz'] = st(pg)['diapozitive'][0]['forme']
    # Font, Paragraph: dreptunghiuri
    clic(pg, 'forma:1/1', button='right'); clic(pg, 'meniu:Font...'); pg.wait_for_timeout(100)
    R['font_rect'] = pg.evaluate(RECT, 'dialog.FontDialogPowerPoint'); R['font_ref'] = REF['dialog.FontDialogPowerPoint']['rect_css']
    d = R['font_rect']['rect'] if R['font_rect'] else None
    if d:
        b = pg.evaluate("document.querySelector('[data-lh-aplicatie=powerpoint]').getBoundingClientRect().toJSON()")
        pg.screenshot(path=str(AICI / 'cap_font.png'), clip={'x': b['x'] + d[0], 'y': b['y'] + d[1], 'width': d[2], 'height': d[3]})
    R['font_tinte'] = pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-suprafata^=\"dialog.FontDialogPowerPoint\"] [data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta')+(e.getAttribute('data-lh-id')?':'+e.getAttribute('data-lh-id'):'')).slice(0,60)")
    # Font style: încerc să aleg Bold din lista Font style
    R['font_style_clic'] = []
    for t in ['camp:Font style', 'camp:Bold', 'meniu:Bold']:
        okc = clic(pg, t)
        R['font_style_clic'].append([t, okc, ev(pg)[-1:], nesimulat(pg)[:1]])
    pg.keyboard.press('Escape')
    clic(pg, 'forma:1/1', button='right'); clic(pg, 'meniu:Paragraph...'); pg.wait_for_timeout(100)
    R['par_rect'] = pg.evaluate(RECT, 'dialog.PowerPointParagraphDialog'); R['par_ref'] = REF['dialog.PowerPointParagraphDialog']['rect_css']
    R['par_tinte'] = pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-suprafata^=\"dialog.PowerPointParagraphDialog\"] [data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta')+(e.getAttribute('data-lh-id')?':'+e.getAttribute('data-lh-id'):'')).slice(0,60)")
    okc = clic(pg, 'camp:Alignment'); R['par_alignment_clic'] = [okc, ev(pg)[-1:], nesimulat(pg)[:1]]
    pg.keyboard.press('Escape')
    # Save As
    pg.keyboard.press('F12'); pg.wait_for_timeout(100)
    R['saveas_rect'] = pg.evaluate(RECT, 'dialog.FileSaveAs'); R['saveas_ref'] = REF['dialog.FileSaveAs']['rect_css']
    pg.keyboard.press('Escape')
    # meniurile de clic dreapta: dreptunghiuri
    clic(pg, 'miniatura:1', button='right'); pg.wait_for_timeout(80)
    R['meniu_mini'] = pg.evaluate("(()=>{const m=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"meniu_contextual.miniatura\"]');if(!m)return null;const r=m.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height),[...m.querySelectorAll('[data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta'))]})()")
    pg.keyboard.press('Escape')
    # New Slide: geometria SplitButton și ce cade la centru
    clic(pg, 'mso:TabHome')
    R['newslide'] = pg.evaluate("""(()=>{const R0=document.querySelector('[data-lh-aplicatie=powerpoint]').getBoundingClientRect();const q=s=>{const e=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-id-mso="'+s+'"]');if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.x-R0.x),Math.round(r.y-R0.y),Math.round(r.width),Math.round(r.height)]};
      const e=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-id-mso="SlideNewGallery"]');const r=e.getBoundingClientRect();const t=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
      return {split:q('SlideNewGallery'),drop:q('SlideNewGallery_Dropdown'),la_centru:t&&t.closest('[data-lh-tinta]')&&t.closest('[data-lh-tinta]').getAttribute('data-lh-tinta')}})()""")
    R['newslide_ref'] = [REF['panglica.TabHome']['rect_css']]
    ev(pg)
    clic(pg, 'mso:SlideNewGallery'); R['newslide_clic_centru'] = [ev(pg), len(st(pg)['diapozitive'])]
    pg.keyboard.press('Escape')
    clic(pg, 'mso:SlideNewGallery', dy=0.2); R['newslide_clic_sus'] = [ev(pg), len(st(pg)['diapozitive'])]
    # KeyTips: Alt, H, apoi I (New Slide), Esc la mijloc
    pg.keyboard.press('Alt'); pg.wait_for_timeout(80)
    kt = pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-tasta-acces],[data-lh-aplicatie=powerpoint] .lh-ap-keytip')].filter(e=>e.offsetParent).map(e=>e.textContent).slice(0,20)")
    pg.keyboard.press('h'); pg.wait_for_timeout(80)
    kt2 = pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-tasta-acces],[data-lh-aplicatie=powerpoint] .lh-ap-keytip')].filter(e=>e.offsetParent).map(e=>e.textContent).slice(0,40)")
    pg.keyboard.press('i'); pg.wait_for_timeout(80)
    n1 = len(st(pg)['diapozitive'])
    R['keytips'] = {'alt': kt, 'alt_h': kt2, 'dupa_i_diapozitive': n1, 'ev': ev(pg)}
    pg.keyboard.press('Alt'); pg.keyboard.press('h'); pg.keyboard.press('Escape'); pg.keyboard.press('Escape'); pg.keyboard.type('q')
    R['keytips_esc'] = {'ev': ev(pg), 'nes': nesimulat(pg)}
    pg.keyboard.press('Alt'); pg.keyboard.press('h'); pg.keyboard.press('1')
    R['keytips_bold'] = {'ev': ev(pg)}
    R['erori'] = H.erori
scrie(R, 'p3_ferestre.json')
print('gata')
