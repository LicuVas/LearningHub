# -*- coding: utf-8 -*-
"""Proba 5: comenzile citate de lecții (rezText) — ce întoarce fiecare clic (acțiune sau nesimulat)."""
import sys, json
sys.path.insert(0, __import__('os').path.dirname(__file__))
from h import Ham, st, ev, el, clic, nesimulat, scrie, centru

C3 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Clasa a VI-a']},
                      {'aspect': 'Title and Content', 'texte': ['Ce sunt', 'Munti de foc']}], 'diapozitiv_activ': 2}
CAZURI = [
    ('m1-l02 Notes bara stare', [], 'bara_stare:Notes '),
    ('m1-l02 Slide Sorter', [], 'bara_stare:Slide Sorter'),
    ('m1-l02 Slide Show bara stare', [], 'bara_stare:Slide Show'),
    ('m1-l02 View>Notes', ['mso:TabView'], 'mso:ViewNotesPageView'),
    ('m1-l07 Duration More', ['mso:TabTransitions'], 'mso:TransitionDuration'),
    ('m1-l07 Animation Pane Move Earlier', ['forma:2/1', 'mso:TabAnimations'], 'mso:AnimationMoveEarlier'),
    ('m1-l07 Start combobox', ['forma:2/1', 'mso:TabAnimations'], 'panglica:Animations/Timing/Start'),
    ('m2-l08 Font list', ['forma:2/1'], 'mso:Font'),
    ('m1-l06 Background Styles', ['mso:TabDesign'], 'mso:BackgroundStylesGallery'),
    ('m1-l06 Format Background (Design)', ['mso:TabDesign'], 'mso:FormatBackground'),
    ('m2-l10 Shapes', ['mso:TabInsert'], 'mso:ShapesInsertGallery'),
    ('m1-l03 File>Open', ['fila:File'], 'backstage:Open'),
    ('m1-l03 File>New', ['fila:File'], 'backstage:New'),
    ('m1-l03 File>Save', ['fila:File'], 'backstage:Save'),
]
R = {}
with Ham() as H:
    pg = H.app('powerpoint', C3)
    tinte = pg.evaluate("LH.aplicatii.tinte('powerpoint')")
    R['tinte_bara_stare'] = [t for t in tinte if t.startswith('bara_stare') or t.startswith('zoom')][:30]
    pg.close()
    for nume, prep, t in CAZURI:
        pg = H.app('powerpoint', C3)
        for p in prep:
            clic(pg, p); pg.wait_for_timeout(550)
        ev(pg)
        ok = clic(pg, t)
        e = ev(pg)
        R[nume] = {'tinta': t, 'gasit': ok, 'ev': [x['g'] + '/' + x['a'] + '@' + str(x['t']) for x in e], 'nes': nesimulat(pg)[:1]}
        pg.close()
    # Save As: Save as type, dublu clic pe un folder, lista folderelor
    pg = H.app('powerpoint', C3)
    pg.keyboard.press('F12'); pg.wait_for_timeout(100)
    ok = clic(pg, 'camp:tip_fisier'); e = ev(pg)
    R['saveas_tip'] = {'gasit': ok, 'ev': [x['g'] + '/' + x['a'] + '@' + str(x['t']) for x in e][-2:], 'nes': nesimulat(pg)[:1],
                       'liste': pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [role=menuitem],[data-lh-aplicatie=powerpoint] [role=option]')].filter(e=>e.offsetParent).map(e=>e.textContent).slice(0,12)")}
    R['saveas_tinte'] = pg.evaluate("[...document.querySelectorAll('[data-lh-aplicatie=powerpoint] [data-lh-suprafata=\"dialog.FileSaveAs\"] [data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta')).slice(0,80)")
    pg.close()
    R['erori'] = H.erori
scrie(R, 'p5_comenzi.json')
print('gata')
