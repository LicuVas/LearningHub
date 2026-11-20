# A1: diapozitivele - New Slide (centru / partea de sus / lista), Ctrl+M, Layout, Duplicate, Delete, ultimul diapozitiv, mutarea
import sys, json; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe')
from h import Ham, st, ev, clic, centru, nesimulat
R = {}
def dia(pg): return [(d['aspect'], d['texte'], d['forme']) for d in st(pg)['diapozitive']]
def r(pg, t):
    return pg.evaluate("([a,t])=>{const e=LH.aplicatii.element(a,t);if(!e)return null;const r=e.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height)]}", ['powerpoint', t])
C1 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii']}]}
C2 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii']}, {'aspect': 'Title and Content', 'texte': ['Ce sunt']}], 'diapozitiv_activ': 2, 'panou': 'miniaturi'}
with Ham() as H:
    pg = H.app('powerpoint', C1); pg.set_default_timeout(15000)
    R['rect_SlideNewGallery'] = r(pg, 'mso:SlideNewGallery'); R['rect_Dropdown'] = r(pg, 'mso:SlideNewGallery_Dropdown')
    clic(pg, 'mso:SlideNewGallery'); R['centru_ev'] = ev(pg); R['centru_dia'] = dia(pg)
    R['centru_meniu'] = pg.evaluate("[...document.querySelectorAll('[data-lh-tinta=meniu]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-id'))")
    pg.keyboard.press('Escape'); ev(pg)
    clic(pg, 'mso:SlideNewGallery', dy=0.2); R['sus_ev'] = ev(pg); R['sus_dia'] = dia(pg); R['sus_activ'] = st(pg)['diapozitiv_activ']
    # Ctrl+M in caseta (editare text)
    clic(pg, 'forma:2/1'); ev(pg); pg.keyboard.press('Control+m'); R['ctrlm_in_text_ev'] = ev(pg); R['ctrlm_in_text_dia'] = dia(pg)
    # Ctrl+Z x2
    pg.keyboard.press('Control+z'); pg.keyboard.press('Control+z'); R['z2_ev'] = ev(pg); R['z2_dia'] = dia(pg)
    pg.keyboard.press('Control+y'); R['y_ev'] = ev(pg); R['y_dia'] = dia(pg)
    pg.close()
    # Delete pe miniaturi; ultimul diapozitiv
    pg = H.app('powerpoint', C2)
    clic(pg, 'miniatura:2'); ev(pg); pg.keyboard.press('Delete'); R['del_ev'] = ev(pg); R['del_dia'] = dia(pg)
    pg.keyboard.press('Delete'); R['del_ultim_ev'] = ev(pg); R['del_ultim_dia'] = dia(pg); R['del_ultim_stare'] = {k: v for k, v in st(pg).items() if k in ('diapozitiv_activ', 'panou', 'formatare_text', 'tranzitie_galerie')}
    R['del_ultim_ecran_mini'] = pg.evaluate("document.querySelectorAll('.lh-ap-p-mini').length")
    R['del_ultim_ecran_zona'] = pg.evaluate("(()=>{const z=document.querySelector('[data-lh-zona]');return z?z.innerText.slice(0,200):null})()")
    pg.keyboard.press('Delete'); R['del_0_ev'] = ev(pg)
    pg.keyboard.type('x'); R['tast_0_ev'] = ev(pg)
    pg.keyboard.press('F5'); R['f5_0_ev'] = ev(pg); pg.keyboard.press('Escape'); ev(pg)
    pg.keyboard.press('Control+m'); R['ctrlm_0_ev'] = ev(pg); R['ctrlm_0_dia'] = dia(pg)
    R['erori_pagina'] = list(H.erori)
    pg.close()
    # meniul de clic dreapta pe miniatura + Duplicate / Delete Slide / mutarea prin tragere
    pg = H.app('powerpoint', {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['A']}, {'aspect': 'Title and Content', 'texte': ['B']}, {'aspect': 'Title and Content', 'texte': ['C']}], 'diapozitiv_activ': 1})
    clic(pg, 'miniatura:2', button='right'); R['ctx_ev'] = ev(pg)
    R['ctx_meniu'] = pg.evaluate("[...document.querySelectorAll('[data-lh-suprafata^=meniu_contextual] [data-lh-eticheta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-eticheta')+(e.getAttribute('aria-disabled')==='true'?'(gri)':''))")
    clic(pg, 'meniu:Duplicate Slide'); R['dup_ev'] = ev(pg); R['dup_dia'] = dia(pg); R['dup_activ'] = st(pg)['diapozitiv_activ']
    a = centru(pg, 'miniatura:1'); b = centru(pg, 'miniatura:4')
    pg.mouse.move(a[0], a[1]); pg.mouse.down(); pg.mouse.move(a[0], a[1] + 20, steps=3); pg.mouse.move(b[0], b[1] + b[3] * 0.4, steps=8); pg.mouse.up()
    R['trage_ev'] = ev(pg); R['trage_dia'] = dia(pg); R['trage_activ'] = st(pg)['diapozitiv_activ']
    pg.keyboard.press('Control+z'); R['trage_z_dia'] = dia(pg); ev(pg)
    clic(pg, 'miniatura:1', button='right'); ev(pg); clic(pg, 'meniu:Delete Slide'); R['delmen_ev'] = ev(pg); R['delmen_dia'] = dia(pg)
    R['erori_pagina2'] = list(H.erori)
print(json.dumps(R, ensure_ascii=False, indent=0)[:9000])
