# A2: textul, formatarea pe bucati, Font Size, anularea, modificat, salvarea
import sys, json; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe')
from h import Ham, st, ev, clic, centru, nesimulat
R = {}
def S(pg):
    s = st(pg); return {'pc': [(b['text'], b['bold'], b['italic'], b['underline'], b['marime']) for b in (s.get('formatare_pe_caractere') or [])],
                        'ft': s.get('formatare_text'), 'sel': s.get('selectie_text'), 'sf': s.get('selectie_forma'), 'mod': s.get('modificat'),
                        'texte': [d['texte'] for d in s['diapozitive']]}
def titlu(pg): return pg.evaluate("(()=>{const t=[...document.querySelectorAll('[data-lh-suprafata=bara_titlu] [data-lh-tip=TitleBar]')].map(e=>e.textContent.trim());return t})()")
def ecran(pg): return pg.evaluate("(()=>{const f=LH.aplicatii.element('powerpoint','forma:1/1');if(!f)return null;return [...f.querySelectorAll('span')].filter(s=>!s.children.length&&s.textContent).map(s=>{const c=getComputedStyle(s);return [s.textContent,c.fontWeight,c.fontStyle,c.textDecorationLine,c.fontSize]})})()")
C1 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii activi']}]}
with Ham() as H:
    pg = H.app('powerpoint', C1); pg.set_default_timeout(15000)
    R['0'] = S(pg); R['titlu0'] = titlu(pg)
    # cursor in mijlocul cuvantului "Vulcanii" (dreptunghiul virtual cuvant:...)
    rr = pg.evaluate("LH.aplicatii.dreptunghi ? JSON.stringify(LH.aplicatii.dreptunghi('powerpoint','cuvant:Vulcanii#1@mijloc')) : null")
    R['dreptunghi_cuvant'] = rr
    c = centru(pg, 'forma:1/1'); R['centru_titlu'] = c
    clic(pg, 'forma:1/1'); ev(pg); R['clic1'] = S(pg)
    # du cursorul la inceput si 3 dreapta -> in "Vulcanii"
    pg.keyboard.press('Home'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); ev(pg)
    R['cursor'] = S(pg)['sel']
    pg.keyboard.press('Control+b'); R['b_ev'] = ev(pg); R['b'] = S(pg); R['b_ecran'] = ecran(pg)
    pg.keyboard.press('End'); pg.keyboard.type('X'); ev(pg); R['tast_dupa_normal'] = S(pg)['pc']
    pg.keyboard.press('Home'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight'); pg.keyboard.press('ArrowRight')
    pg.keyboard.type('Y'); ev(pg); R['tast_dupa_bold'] = S(pg)['pc']
    # bucata: Shift+Left x3 -> Ctrl+I
    pg.keyboard.press('End'); pg.keyboard.press('Shift+ArrowLeft'); pg.keyboard.press('Shift+ArrowLeft'); pg.keyboard.press('Shift+ArrowLeft'); ev(pg)
    R['sel3'] = S(pg)['sel']
    pg.keyboard.press('Control+i'); R['i_ev'] = ev(pg); R['i'] = S(pg)
    # Ctrl+Z o data: ce revine? selectia?
    pg.keyboard.press('Control+z'); R['z1_ev'] = ev(pg); R['z1'] = S(pg)
    pg.keyboard.press('Control+z'); R['z2'] = S(pg); ev(pg)
    pg.keyboard.press('Control+z'); R['z3'] = S(pg); ev(pg)
    pg.keyboard.press('Control+y'); R['y1'] = S(pg); ev(pg)
    # tastare in serie apoi un Ctrl+Z
    clic(pg, 'forma:1/2'); ev(pg); pg.keyboard.type('Lava mare'); ev(pg); R['tast_lava'] = S(pg)['texte']
    pg.keyboard.press('Control+z'); R['z_lava_ev'] = ev(pg); R['z_lava'] = S(pg)['texte']
    pg.keyboard.press('Control+z'); R['z_lava2'] = S(pg)['texte']; ev(pg)
    # caseta ca obiect: Esc -> Ctrl+U
    clic(pg, 'forma:1/1'); pg.keyboard.press('Escape'); R['esc_ev'] = ev(pg); R['esc'] = S(pg)['sf']
    pg.keyboard.press('Control+u'); R['u_ev'] = ev(pg); R['u'] = S(pg)['pc']
    # Font Size: 0, 5000, abc, 40
    for v in ['0', '5000', 'abc', '40']:
        clic(pg, 'mso:FontSize', dx=0.3); pg.keyboard.type(v); pg.keyboard.press('Enter')
        R['fs_' + v] = {'ev': ev(pg), 'ft': S(pg)['ft'], 'caseta': pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','mso:FontSize');const i=e&&e.querySelector('input');return i?i.value:null})()"), 'nesim': nesimulat(pg)}
    # FontSizeIncrease pe marimi amestecate: ales doar "Vulc" ca text
    R['mod_inainte_salvare'] = S(pg)['mod']
    # Ctrl+S fara nume
    pg.keyboard.press('Control+s'); R['ctrls_ev'] = ev(pg); R['ctrls_backstage'] = st(pg).get('backstage')
    R['bs_items'] = pg.evaluate("[...document.querySelectorAll('[data-lh-tinta^=backstage]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-id')||e.getAttribute('data-lh-tinta')).slice(0,60)")
    ok = clic(pg, 'backstage:Browse'); R['browse'] = [ok, ev(pg), st(pg).get('dialog')]
    pg.keyboard.press('Control+a'); pg.keyboard.type('Proiect'); pg.keyboard.press('Enter'); R['save_ev'] = ev(pg)
    R['dupa_save'] = {'nume': st(pg)['nume_fisier'], 'mod': S(pg)['mod'], 'titlu': titlu(pg), 'backstage': st(pg).get('backstage')}
    pg.keyboard.press('Control+z'); ev(pg); R['z_dupa_save'] = {'mod': S(pg)['mod'], 'texte': S(pg)['texte'], 'titlu': titlu(pg)}
    pg.keyboard.press('Control+s'); R['ctrls2_ev'] = ev(pg); R['ctrls2'] = {'mod': S(pg)['mod'], 'bs': st(pg).get('backstage')}
    # Ctrl+W, Ctrl+N, Ctrl+O, File > Close, X din bara de titlu
    for k in ['Control+w', 'Control+n', 'Control+o']:
        pg.keyboard.press(k); R[k] = {'ev': ev(pg), 'nesim': nesimulat(pg)}
    clic(pg, 'fila:File'); ev(pg); clic(pg, 'backstage:Close'); R['file_close'] = {'ev': ev(pg), 'nesim': nesimulat(pg), 'bs': st(pg).get('backstage')}
    pg.keyboard.press('Escape'); ev(pg)
    clic(pg, 'bara_titlu:Close'); R['x_close'] = {'ev': ev(pg), 'nesim': nesimulat(pg)}
    R['erori'] = list(H.erori)
print(json.dumps(R, ensure_ascii=False))
