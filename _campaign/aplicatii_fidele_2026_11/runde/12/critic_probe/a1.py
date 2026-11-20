# -*- coding: utf-8 -*-
"""A: P1 (KeyTips), P2 (Font Color pe drumul lectiei), P3 (inchiderea, Save your changes, Don't Save, Ctrl+N, Ctrl+O) + aspectul lor."""
import json, sys
sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe')
from h import Ham, st, ev, clic, centru, nesimulat
from m import JS_ARB, compara
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe/'
rez = {}
VULC = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}, {"aspect": "Title and Content", "texte": ["B"]}], "diapozitiv_activ": 1}
KT = """(()=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [...document.querySelectorAll('.lh-ap-keytip')].filter(x=>x.offsetParent).map(x=>{const r=x.getBoundingClientRect();return [x.textContent,Math.round(r.x-R.x),Math.round(r.y-R.y),Math.round(r.width),Math.round(r.height)]})})()"""
TXT = """(t)=>{const e=LH.aplicatii.element('powerpoint',t);if(!e)return null;return [...e.querySelectorAll('*')].filter(x=>[...x.childNodes].some(n=>n.nodeType==3&&n.textContent.trim())).map(x=>{const cs=getComputedStyle(x);return [x.textContent.trim().slice(0,30),cs.color,cs.fontWeight,cs.fontSize]})}"""
GRI = """(ids)=>ids.map(i=>{const e=document.querySelector('[data-lh-id-mso="'+i+'"]');if(!e)return [i,null];return [i,e.getAttribute('aria-disabled')||'',e.classList.contains('lh-ap-gri'),getComputedStyle(e).opacity,getComputedStyle(e).color]})"""
TITLU = """(()=>{const t=document.querySelector('.lh-ap-x-titlu');return t?t.textContent:null})()"""


def k(pg, key, w=120):
    pg.keyboard.press(key); pg.wait_for_timeout(w)


def sub(s, *ch):
    return {c: s.get(c) for c in ch}


with Ham() as H:
    # ---------------- P1 KeyTips: cursorul in text (editare)
    pg = H.app('powerpoint', VULC)
    c = centru(pg, 'forma:1/1'); pg.mouse.click(c[0], c[1]); pg.wait_for_timeout(100); ev(pg)
    k(pg, 'Alt'); rez['p1_alt_insigne'] = pg.evaluate(KT); rez['p1_alt_ev'] = ev(pg)
    pg.screenshot(path=OUT + 'a1_kt_alt.png', clip={'x': 0, 'y': 0, 'width': 1366, 'height': 190})
    k(pg, 'h'); rez['p1_h_insigne'] = pg.evaluate(KT); rez['p1_h_ev'] = ev(pg)
    pg.screenshot(path=OUT + 'a1_kt_h.png', clip={'x': 0, 'y': 0, 'width': 1366, 'height': 190})
    k(pg, '1'); rez['p1_1_ev'] = ev(pg); rez['p1_1_insigne_dupa'] = pg.evaluate(KT)
    s = st(pg); rez['p1_1_stare'] = sub(s, 'formatare_text', 'diapozitive')
    rez['p1_1_ecran'] = pg.evaluate(TXT, 'forma:1/1')
    # Esc: Alt, H, Esc, Esc
    k(pg, 'Alt'); k(pg, 'h'); k(pg, 'Escape'); rez['p1_esc1_insigne'] = [x[0] for x in pg.evaluate(KT)]
    k(pg, 'Escape'); rez['p1_esc2_insigne'] = pg.evaluate(KT); rez['p1_esc_ev'] = ev(pg)
    # Alt, H, F, S -> Font Size
    k(pg, 'Alt'); k(pg, 'h'); k(pg, 'f'); rez['p1_hf_insigne'] = [x[0] for x in pg.evaluate(KT)]
    k(pg, 's'); rez['p1_hfs_focus'] = pg.evaluate("(()=>{const a=document.activeElement;return [a.tagName,a.value,a.closest('[data-lh-tip]')&&a.closest('[data-lh-tip]').getAttribute('data-lh-eticheta')]})()")
    pg.keyboard.type('40'); k(pg, 'Enter'); rez['p1_hfs_ev'] = ev(pg); rez['p1_hfs_stare'] = st(pg).get('formatare_text')
    # Alt, H, I -> lista New Slide; Esc
    k(pg, 'Alt'); k(pg, 'h'); k(pg, 'i', 250)
    rez['p1_hi_lista'] = pg.evaluate("(()=>{const m=document.querySelector('[data-lh-suprafata^=\"lista.\"]');return m&&m.getAttribute('data-lh-suprafata')})()")
    rez['p1_hi_insigne'] = [x[0] for x in pg.evaluate(KT)]; rez['p1_hi_ev'] = ev(pg)
    pg.screenshot(path=OUT + 'a1_kt_hi.png', clip={'x': 0, 'y': 0, 'width': 700, 'height': 600})
    k(pg, 'Escape'); rez['p1_hi_esc'] = [pg.evaluate("(()=>{const m=document.querySelector('[data-lh-suprafata^=\"lista.\"]');return m&&m.getAttribute('data-lh-suprafata')})()"), [x[0] for x in pg.evaluate(KT)]]
    k(pg, 'Escape'); k(pg, 'Escape'); ev(pg)
    # Alt, A, C -> Animation Pane
    k(pg, 'Alt'); k(pg, 'a'); k(pg, 'c', 250); rez['p1_ac_ev'] = ev(pg)
    rez['p1_ac_panou'] = pg.evaluate("(()=>{const p=document.querySelector('.lh-ap-p-panou');return p&&p.getAttribute('data-lh-suprafata')})()")
    rez['p1_text_final'] = [d.get('texte') for d in st(pg).get('diapozitive', [])]
    pg.close()

    # ---------------- P2 Font Color pe drumul m1-l06: clic in text -> clic pe chenar -> Font Color ▾ -> Dark Blue
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}]})
    c = centru(pg, 'forma:1/1'); pg.mouse.click(c[0], c[1]); pg.wait_for_timeout(100)
    rez['p2_margine'] = centru(pg, 'margine_forma:1/1')
    clic(pg, 'margine_forma:1/1'); rez['p2_sel_ev'] = ev(pg)
    clic(pg, 'mso:TabHome'); clic(pg, 'mso:FontColorPicker_Dropdown'); pg.wait_for_timeout(200)
    clic(pg, 'meniu:Dark Blue'); pg.wait_for_timeout(150)
    s = st(pg); rez['p2_stare'] = sub(s, 'culoare_text', 'formatare_text'); rez['p2_ev'] = ev(pg)
    rez['p2_ecran'] = pg.evaluate(TXT, 'forma:1/1')
    rez['p2_miniatura'] = pg.evaluate("""(()=>{const m=LH.aplicatii.element('powerpoint','miniatura:1');if(!m)return null;return [...m.querySelectorAll('*')].filter(x=>[...x.childNodes].some(n=>n.nodeType==3&&n.textContent.trim())).map(x=>[x.textContent.trim().slice(0,20),getComputedStyle(x).color])})()""")
    k(pg, 'Control+z'); rez['p2_z'] = [st(pg).get('culoare_text'), pg.evaluate(TXT, 'forma:1/1')]
    # Font Color fara text ales: gri?
    pg.mouse.click(5, 740); pg.wait_for_timeout(100)
    rez['p2_fc_fara_sel'] = pg.evaluate(GRI, ['FontColorPicker', 'Bold', 'FontSize'])
    pg.close()

    # ---------------- P3 inchiderea
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]})
    c = centru(pg, 'forma:1/1'); pg.mouse.click(c[0], c[1]); pg.keyboard.type(' 0'); pg.wait_for_timeout(100); ev(pg)
    rez['p3_titlu_inainte'] = pg.evaluate(TITLU)
    k(pg, 'Control+w', 300); rez['p3_ctrlw_ev'] = ev(pg)
    m = pg.evaluate(JS_ARB, '[data-lh-suprafata="dialog.save_your_changes_to_this_file"]')
    rez['p3_dialog_cmp'] = compara('dialog.save_your_changes_to_this_file', m)
    rez['p3_dialog_noduri'] = [(n['tip'], n['et'], n['r'], n['vis'], n['txt'][:40], n['tinta']) for n in (m or {}).get('noduri', [])]
    rez['p3_dialog_focus'] = pg.evaluate("(()=>{const a=document.activeElement;return [a.tagName,a.value,a.getAttribute('aria-label'),a.closest('[data-lh-tinta]')&&a.closest('[data-lh-tinta]').getAttribute('data-lh-tinta')]})()")
    rez['p3_dialog_stare'] = sub(st(pg), 'dialog', 'prezentari_deschise', 'prezentare_activa')
    rez['p3_dialog_text'] = pg.evaluate("(()=>{const d=document.querySelector('[data-lh-suprafata=\"dialog.save_your_changes_to_this_file\"]');return d?d.innerText:null})()")
    rez['p3_dialog_butoane_stil'] = pg.evaluate("""(()=>{const d=document.querySelector('[data-lh-suprafata="dialog.save_your_changes_to_this_file"]');if(!d)return null;return [...d.querySelectorAll('[data-lh-tip="Button"]')].map(b=>{const cs=getComputedStyle(b);return [b.getAttribute('data-lh-eticheta'),cs.backgroundColor,cs.borderColor,cs.borderWidth,cs.color]})})()""")
    if m:
        pg.screenshot(path=OUT + 'a1_dialog.png', clip={'x': 430, 'y': 200, 'width': 510, 'height': 370})
    k(pg, 'Escape', 200); rez['p3_esc'] = [ev(pg), sub(st(pg), 'dialog', 'prezentari_deschise'), pg.evaluate(TITLU)]
    k(pg, 'Control+w', 300); ev(pg)
    clic(pg, "fereastra:Cancel"); rez['p3_cancel'] = [ev(pg), sub(st(pg), 'dialog', 'prezentari_deschise')]
    k(pg, 'Control+w', 300); ev(pg)
    # Enter in File name
    k(pg, 'Enter', 300); rez['p3_enter'] = [ev(pg), sub(st(pg), 'dialog', 'prezentari_deschise', 'nume_fisier', 'prezentare_activa')]
    pg.close()
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]})
    c = centru(pg, 'forma:1/1'); pg.mouse.click(c[0], c[1]); pg.keyboard.type(' 0'); ev(pg)
    k(pg, 'Control+w', 300); ev(pg)
    clic(pg, "fereastra:Don't Save"); pg.wait_for_timeout(300)
    rez['p3_dontsave'] = [ev(pg), sub(st(pg), 'dialog', 'prezentari_deschise', 'prezentare_activa', 'diapozitive'), pg.evaluate(TITLU)]
    rez['p3_dontsave_gri'] = pg.evaluate(GRI, ['FileTabButton', 'TabHome', 'Paste', 'SlideNewGallery', 'Bold', 'FontColorPicker', 'TabInsert', 'TabDesign'])
    pg.screenshot(path=OUT + 'a1_fara_prez.png', clip={'x': 0, 'y': 0, 'width': 1366, 'height': 768})
    # clic pe Bold, pe New Slide si pe zona goala fara prezentare
    clic(pg, 'mso:Bold'); clic(pg, 'mso:SlideNewGallery'); rez['p3_fara_prez_clic'] = ev(pg)
    k(pg, 'Control+n', 300); rez['p3_ctrln'] = [ev(pg), sub(st(pg), 'prezentari_deschise', 'prezentare_activa', 'diapozitive'), pg.evaluate(TITLU)]
    rez['p3_ctrln_gri'] = pg.evaluate(GRI, ['Paste', 'SlideNewGallery', 'Bold', 'FontColorPicker'])
    k(pg, 'Control+n', 300); rez['p3_ctrln2'] = [sub(st(pg), 'prezentari_deschise', 'prezentare_activa'), pg.evaluate(TITLU)]
    # File > Close pe prezentarea NEmodificata, apoi pe una modificata
    c = centru(pg, 'forma:1/1'); pg.mouse.click(c[0], c[1]); pg.keyboard.type('Toamna'); ev(pg)
    clic(pg, 'fila:File'); pg.wait_for_timeout(250); clic(pg, 'backstage:Close'); pg.wait_for_timeout(300)
    rez['p3_file_close'] = [ev(pg), sub(st(pg), 'dialog', 'prezentari_deschise', 'prezentare_activa')]
    rez['p3_file_close_numeprop'] = pg.evaluate("(()=>{const i=document.querySelector('[data-lh-suprafata=\"dialog.save_your_changes_to_this_file\"] input');return i&&i.value})()")
    clic(pg, 'fereastra:Cancel'); ev(pg)
    clic(pg, 'bara_titlu:Close'); pg.wait_for_timeout(300); rez['p3_x'] = [ev(pg), sub(st(pg), 'dialog')]
    clic(pg, 'fereastra:Cancel'); ev(pg)
    # Ctrl+O -> Backstage Open -> Browse
    k(pg, 'Control+o', 300); rez['p3_ctrlo'] = [ev(pg), pg.evaluate("(()=>{const b=document.querySelector('.lh-ap-strat-backstage');return b?[...b.querySelectorAll('[data-lh-suprafata]')].map(x=>x.getAttribute('data-lh-suprafata')):null})()")]
    r = clic(pg, 'backstage:Browse'); pg.wait_for_timeout(300); rez['p3_browse'] = [r, ev(pg), nesimulat(pg), sub(st(pg), 'dialog')]
    pg.close()
    rez['erori'] = H.erori; rez['plecate'] = H.plecate
json.dump(rez, open(OUT + 'a1_out.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('gata')
