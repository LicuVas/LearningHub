# A3: ferestrele Font / Paragraph / Insert Table: OK / Enter / Cancel / Esc / x, valori gresite
import sys, json; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe')
from h import Ham, st, ev, clic, centru, nesimulat
R = {}
def S(pg):
    s = st(pg); return {'pc': [(b['text'], b['bold'], b['italic'], b['underline'], b['marime']) for b in (s.get('formatare_pe_caractere') or [])],
                        'par': s.get('paragrafe_text'), 'dlg': s.get('dialog'), 'mod': s.get('modificat'), 'forme': [d['forme'] for d in s['diapozitive']]}
def campuri(pg):
    return pg.evaluate("""(()=>{const d=document.querySelector('.lh-ap-strat-dialog');if(!d)return null;
      return [...d.querySelectorAll('input,select')].filter(e=>e.offsetParent).map(e=>{const p=e.closest('[data-lh-eticheta]');return [p&&p.getAttribute('data-lh-tip'),p&&p.getAttribute('data-lh-eticheta'),e.tagName,e.value,e.readOnly||e.disabled]})})()""")
def butoane(pg):
    return pg.evaluate("""(()=>{const d=document.querySelector('.lh-ap-strat-dialog');if(!d)return null;return [...d.querySelectorAll('[data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta')+':'+(e.getAttribute('data-lh-id')||''))})()""")
def camp(pg, et):   # clic in campul cu eticheta et, selecteaza tot, scrie
    r = pg.evaluate("""(et)=>{const d=document.querySelector('.lh-ap-strat-dialog');if(!d)return null;const p=[...d.querySelectorAll('[data-lh-eticheta]')].find(e=>e.getAttribute('data-lh-eticheta')===et&&e.querySelector('input'));if(!p)return null;const i=p.querySelector('input');const r=i.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,i.readOnly]}""", et)
    if not r: return None
    pg.mouse.click(r[0], r[1]); pg.keyboard.press('Control+a'); return r
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii activi']}], 'selectie_text': [1, 1], 'forma_citita': [1, 1]}
with Ham() as H:
    pg = H.app('powerpoint', C); pg.set_default_timeout(15000)
    ok = clic(pg, 'lansator:Home/Font'); R['lans_font'] = [ok, ev(pg), S(pg)['dlg']]
    R['font_campuri'] = campuri(pg); R['font_butoane'] = butoane(pg)
    R['font_rect'] = pg.evaluate("(()=>{const d=document.querySelector('.lh-ap-strat-dialog [data-lh-suprafata]');if(!d)return null;const r=d.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(Math.round)})()")
    # Font style -> Bold (tastand), OK
    rr = camp(pg, 'Font style'); R['fs_camp'] = rr
    if rr: pg.keyboard.type('Bold')
    clic(pg, 'fereastra:OK'); R['font_bold_ok'] = {'ev': ev(pg), 's': S(pg)}
    # Size 0 -> OK
    clic(pg, 'lansator:Home/Font'); ev(pg); camp(pg, 'Size'); pg.keyboard.type('0'); clic(pg, 'fereastra:OK'); R['size0'] = {'ev': ev(pg), 's': S(pg), 'nesim': nesimulat(pg)}
    clic(pg, 'lansator:Home/Font'); ev(pg); camp(pg, 'Size'); pg.keyboard.type('5000'); pg.keyboard.press('Enter'); R['size5000'] = {'ev': ev(pg), 's': S(pg)}
    clic(pg, 'lansator:Home/Font'); ev(pg); camp(pg, 'Size'); pg.keyboard.type('abc'); pg.keyboard.press('Enter'); R['sizeabc'] = {'ev': ev(pg), 's': S(pg)}
    clic(pg, 'lansator:Home/Font'); ev(pg); camp(pg, 'Size'); pg.keyboard.type('40'); pg.keyboard.press('Escape'); R['size40esc'] = {'ev': ev(pg), 's': S(pg)}
    clic(pg, 'lansator:Home/Font'); ev(pg); camp(pg, 'Size'); pg.keyboard.type('40'); clic(pg, 'fereastra:Cancel'); R['size40cancel'] = {'ev': ev(pg), 's': S(pg)}
    clic(pg, 'lansator:Home/Font'); ev(pg); camp(pg, 'Size'); pg.keyboard.type('40'); clic(pg, 'fereastra:Close'); R['size40x'] = {'ev': ev(pg), 's': S(pg)}
    clic(pg, 'lansator:Home/Font'); ev(pg); camp(pg, 'Size'); pg.keyboard.type('40'); pg.keyboard.press('Enter'); R['size40enter'] = {'ev': ev(pg), 's': S(pg)}
    pg.keyboard.press('Control+z'); R['size40_z'] = {'ev': ev(pg), 's': S(pg)}
    # Paragraph: Alignment -> Right, Before 12
    ok = clic(pg, 'lansator:Home/Paragraph'); R['lans_par'] = [ok, ev(pg), S(pg)['dlg']]
    R['par_campuri'] = campuri(pg); R['par_butoane'] = butoane(pg)
    rr = camp(pg, 'Alignment'); R['al_camp'] = rr
    if rr: pg.keyboard.type('Right')
    camp(pg, 'Before'); pg.keyboard.type('12 pt'); clic(pg, 'fereastra:OK'); R['par_ok'] = {'ev': ev(pg), 'par': S(pg)['par']}
    pg.close()
    # Insert Table: 0 si 100 coloane, More/Less, Cancel, Esc
    pg = H.app('powerpoint', {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii']}]})
    clic(pg, 'fila:Insert'); ev(pg); clic(pg, 'mso:TableInsertGallery'); R['tab_ev'] = ev(pg)
    ok = clic(pg, 'meniu:Insert Table...'); R['tab_ins'] = [ok, ev(pg), st(pg).get('dialog')]
    R['tab_campuri'] = campuri(pg); R['tab_butoane'] = butoane(pg)
    camp(pg, 'Number of columns'); pg.keyboard.type('0'); clic(pg, 'fereastra:OK'); R['tab0'] = {'ev': ev(pg), 's': S(pg), 'nesim': nesimulat(pg)}
    camp(pg, 'Number of columns'); pg.keyboard.type('100'); pg.keyboard.press('Enter'); R['tab100'] = {'ev': ev(pg), 's': S(pg)}
    camp(pg, 'Number of columns'); pg.keyboard.type('4'); pg.keyboard.press('Escape'); R['tab4esc'] = {'ev': ev(pg), 's': S(pg)}
    clic(pg, 'mso:TableInsertGallery'); clic(pg, 'meniu:Insert Table...'); ev(pg); camp(pg, 'Number of columns'); pg.keyboard.type('4'); pg.keyboard.press('Enter'); R['tab4'] = {'ev': ev(pg), 's': S(pg), 'ctx': pg.evaluate("[...document.querySelectorAll('[data-lh-tinta=fila]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-id'))")}
    pg.keyboard.press('Control+z'); R['tab4_z'] = S(pg)['forme']; ev(pg)
    R['erori'] = list(H.erori)
print(json.dumps(R, ensure_ascii=False))
