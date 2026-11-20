# -*- coding: utf-8 -*-
"""Proba 1: comenzile de pe drumul lecțiilor VI (gesturi reale) — ce face fiecare: efect, mesaj nesimulat sau nimic."""
import sys
sys.path.insert(0, __import__('os').path.dirname(__file__))
from h import Ham, st, ev, el, clic, nesimulat, scrie, centru

C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Clasa a VI-a']},
                     {'aspect': 'Title and Content', 'texte': ['Ce sunt', 'Munti']}], 'diapozitiv_activ': 2}
R = {}
with Ham() as H:
    def caz(nume, pasi):
        pg = H.app('powerpoint', C)
        log = []
        for p in pasi:
            if p[0] == 'clic':
                ok = clic(pg, p[1])
                log.append([p[1], ok])
            elif p[0] == 'tasta':
                pg.keyboard.press(p[1]); pg.wait_for_timeout(60); log.append([p[1]])
            elif p[0] == 'scrie':
                pg.keyboard.type(p[1], delay=10); log.append(['scrie', p[1]])
            elif p[0] == 'liste':
                log.append(['meniu', pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-tinta^=\"meniu:\"]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta')).slice(0,40)")])
        s = st(pg)
        R[nume] = {'pasi': log, 'ev': ev(pg)[-6:], 'nesimulat': nesimulat(pg),
                   'dia': s['diapozitive'], 'formatare': s.get('formatare_pe_caractere'), 'par': s.get('paragrafe_text'),
                   'modificat': s.get('modificat'), 'dialog': s.get('dialog'), 'backstage': s.get('backstage')}
        pg.close()

    caz('pictures', [('clic', 'mso:TabInsert'), ('clic', 'mso:FlyoutAnchorInsertPictures'), ('liste',)])
    caz('layout_lista', [('clic', 'mso:SlideLayoutGallery'), ('liste',)])
    caz('newslide_lista', [('clic', 'mso:SlideNewGallery_Dropdown'), ('liste',)])
    caz('font_color_buton', [('clic', 'forma:2/2'), ('tasta', 'Escape'), ('clic', 'mso:FontColorPicker')])
    caz('font_color_drop', [('clic', 'forma:2/2'), ('tasta', 'Escape'), ('clic', 'mso:FontColorPicker_Dropdown')])
    caz('center', [('clic', 'forma:2/2'), ('clic', 'mso:AlignCenter')])
    caz('shape_fill', [('clic', 'forma:2/2'), ('tasta', 'Escape'), ('clic', 'mso:ShapeFillColorPicker')])
    caz('file_close', [('clic', 'fila:File'), ('clic', 'backstage:Close')])
    caz('ctrl_w', [('clic', 'forma:2/1'), ('scrie', 'X'), ('tasta', 'Control+w')])
    caz('format_bg', [('clic', 'diapozitiv:2')])
    pg = H.app('powerpoint', C)
    # format background: clic dreapta pe fundal -> meniu -> Format Background...
    r = centru(pg, 'diapozitiv:2')
    pg.mouse.click(r[0] - r[2] * 0.4, r[1] + r[3] * 0.4, button='right'); pg.wait_for_timeout(100)
    R['fb_meniu'] = pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-tinta^=\"meniu:\"]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta'))")
    clic(pg, 'meniu:Format Background...')
    R['fb_panou'] = pg.evaluate("(()=>{const p=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"panou.LaunchFormatBackground\"]');if(!p)return null;return [...p.querySelectorAll('[data-lh-tinta]')].map(e=>e.getAttribute('data-lh-tinta')).slice(0,40)})()")
    # clic pe Solid fill și pe Color
    for t in ['panglica:Solid fill', 'meniu_derulant:Color']:
        pass
    btns = pg.evaluate("(()=>{const p=document.querySelector('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"panou.LaunchFormatBackground\"]');if(!p)return [];return [...p.querySelectorAll('[data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta'))})()")
    R['fb_rez'] = []
    for t in btns[:12]:
        ok = clic(pg, t)
        R['fb_rez'].append([t, ok, ev(pg)[-1:] , nesimulat(pg)[:1]])
    R['erori'] = H.erori
    R['plecate'] = H.plecate
scrie(R, 'p1_lectii.json')
print('gata', len(R))
