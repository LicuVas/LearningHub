# A4: Design / Transitions / Animations / Animation Pane / Format Background / F5-Esc / KeyTips / Esc in liste / Pictures / Font Color
import sys, json; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe')
from h import Ham, st, ev as ev0, clic as clic0, centru, nesimulat
R = {}
def ev(pg): pg.wait_for_timeout(120); return ev0(pg)
def clic(pg, t, **k): r = clic0(pg, t, **k); pg.wait_for_timeout(80); return r
def S(pg):
    s = st(pg); return {k: s.get(k) for k in ('diapozitive', 'tema', 'tranzitie_galerie', 'animatie_galerie', 'diapozitiv_activ', 'selectie_forma', 'expunere', 'modificat')}
def vizibile(pg, sel):
    return pg.evaluate("(s)=>[...document.querySelectorAll(s)].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta')+'|'+(e.getAttribute('data-lh-id')||'')+'|'+(e.getAttribute('data-lh-eticheta')||'')).slice(0,80)", sel)
C3 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['A', 'a']}, {'aspect': 'Title and Content', 'texte': ['B', 'b']}, {'aspect': 'Title and Content', 'texte': ['C', 'c']}], 'diapozitiv_activ': 2}
with Ham() as H:
    pg = H.app('powerpoint', C3); pg.set_default_timeout(15000)
    clic(pg, 'fila:Design'); ev(pg); clic(pg, 'meniu:Ion') or None
    R['tema_ion_tinta'] = vizibile(pg, '[data-lh-id-mso=SlideThemesGallery] [data-lh-tinta]')[:12]
    ok = clic(pg, 'mso:SlideThemesGallery'); R['tema_clic'] = [ok, ev(pg), S(pg)['tema']]
    R['tema_ecran'] = pg.evaluate("[...document.querySelectorAll('[data-lh-tema]')].map(e=>e.getAttribute('data-lh-tema'))")
    pg.keyboard.press('Control+z'); R['tema_z'] = [ev(pg), S(pg)['tema']]
    # Transitions: Fade pe activ, apoi alt diapozitiv, Apply To All
    clic(pg, 'fila:Transitions'); ev(pg)
    R['tr_items'] = vizibile(pg, '[data-lh-id-mso=AnimationTransitionGallery] [data-lh-tinta]')[:14]
    fade = [x for x in R['tr_items'] if '|Fade|' in x or x.endswith('|Fade')]
    R['fade'] = fade
    pg.close()
    # Animations: fara forma aleasa; cu forma; ordinea; Animation Pane
    pg = H.app('powerpoint', C3)
    clic(pg, 'fila:Animations'); ev(pg)
    R['an_items'] = vizibile(pg, '[data-lh-id-mso=AnimationGallery] [data-lh-tinta]')[:16]
    R['an_gri_fara_forma'] = pg.evaluate("(()=>{const g=document.querySelector('[data-lh-id-mso=AnimationGallery]');return g?[g.getAttribute('aria-disabled'),[...g.querySelectorAll('[aria-disabled=true]')].length,g.querySelectorAll('[data-lh-tinta]').length]:null})()")
    R['an_ref'] = None
    pg.close()
    # F5 / sageti / Esc
    pg = H.app('powerpoint', C3)
    pg.keyboard.press('F5'); R['f5'] = [ev(pg), S(pg)['expunere']]
    pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); R['f5_dr2'] = [ev(pg), S(pg)['expunere']]
    pg.keyboard.press('Escape'); R['f5_esc'] = [ev(pg), S(pg)['expunere'], S(pg)['diapozitiv_activ']]
    pg.keyboard.press('Shift+F5'); R['shf5'] = [ev(pg), S(pg)['expunere']]
    for i in range(4): pg.keyboard.press('ArrowRight')
    R['f5_final'] = [ev(pg), S(pg)['expunere'], pg.evaluate("(()=>{const x=document.querySelector('.lh-ap-p-expunere');return x?[x.innerText.slice(0,100),getComputedStyle(x).backgroundColor]:null})()")]
    pg.keyboard.press('ArrowRight'); R['f5_dupa_final'] = [ev(pg), S(pg)['expunere']]
    # KeyTips: Alt, H, apoi Esc; Alt, H, 1 (Bold) cu forma aleasa
    pg.keyboard.press('Alt'); R['alt'] = [ev(pg), pg.evaluate("[...document.querySelectorAll('[data-lh-tasta-acces],.lh-ap-tasta-acces,.lh-ap-keytip')].filter(e=>e.offsetParent).map(e=>e.textContent).slice(0,20)")]
    pg.keyboard.press('h'); R['alt_h'] = [ev(pg), pg.evaluate("[...document.querySelectorAll('[data-lh-tasta-acces],.lh-ap-tasta-acces,.lh-ap-keytip')].filter(e=>e.offsetParent).map(e=>e.textContent).slice(0,40)")]
    pg.keyboard.press('Escape'); R['alt_h_esc'] = [ev(pg), pg.evaluate("[...document.querySelectorAll('[data-lh-tasta-acces],.lh-ap-tasta-acces,.lh-ap-keytip')].filter(e=>e.offsetParent).length")]
    pg.keyboard.press('Escape'); R['alt_h_esc2'] = [ev(pg), pg.evaluate("[...document.querySelectorAll('[data-lh-tasta-acces],.lh-ap-tasta-acces,.lh-ap-keytip')].filter(e=>e.offsetParent).length")]
    clic(pg, 'forma:2/1'); pg.keyboard.press('Escape'); ev(pg)
    for k in ['Alt', 'h', '1']: pg.keyboard.press(k)
    R['alt_h_1'] = [ev(pg), [(b['text'], b['bold']) for b in st(pg)['formatare_pe_caractere'] or []]]
    for k in ['Alt', 'h', 'f', 's']: pg.keyboard.press(k)
    R['alt_h_fs'] = [ev(pg), pg.evaluate("document.activeElement&&[document.activeElement.tagName,(document.activeElement.closest('[data-lh-id-mso]')||{getAttribute:()=>null}).getAttribute('data-lh-id-mso')]")]
    pg.keyboard.press('Escape'); ev(pg)
    # Esc in mijlocul unei liste (Layout)
    clic(pg, 'mso:SlideLayoutGallery'); ev(pg); R['layout_lista'] = vizibile(pg, '.lh-ap-p-lista [data-lh-tinta]')
    pg.keyboard.press('Escape'); R['layout_esc'] = [ev(pg), len(vizibile(pg, '.lh-ap-p-lista [data-lh-tinta]'))]
    # Font Color si Pictures si Shapes
    clic(pg, 'forma:2/1'); ev(pg); pg.keyboard.press('Escape'); ev(pg)
    for t in ['mso:FontColorPicker']:
        ok = clic(pg, t); R['fc_corp'] = [ok, ev(pg), nesimulat(pg)]
        ok = clic(pg, t, dx=0.9); R['fc_sageata'] = [ok, ev(pg), nesimulat(pg)]
    clic(pg, 'fila:Insert'); ev(pg)
    ok = clic(pg, 'mso:FlyoutAnchorInsertPictures'); R['pictures'] = [ok, ev(pg), nesimulat(pg), st(pg).get('dialog')]
    ok = clic(pg, 'mso:ShapesInsertGallery'); R['shapes'] = [ok, ev(pg), nesimulat(pg)]
    R['erori'] = list(H.erori)
print(json.dumps(R, ensure_ascii=False))
