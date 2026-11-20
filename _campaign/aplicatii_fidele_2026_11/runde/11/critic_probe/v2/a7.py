# A7: asistentul 6.3; Duration; Ctrl+C pe caseta aleasa ca obiect; Delete pe caseta; Design > Format Background
import sys, json; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe')
from h import Ham, st, ev as ev0, clic as clic0, centru, nesimulat
R = {}
def ev(pg): pg.wait_for_timeout(120); return ev0(pg)
def clic(pg, t, **k): r = clic0(pg, t, **k); pg.wait_for_timeout(80); return r
IND = "(()=>[...document.querySelectorAll('[data-lh-indiciu]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-pentru')))()"
C3 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['A', 'a']}, {'aspect': 'Title and Content', 'texte': ['B', 'b']}], 'diapozitiv_activ': 1}
with Ham() as H:
    pg = H.app('powerpoint', C3); pg.set_default_timeout(15000)
    pg.evaluate("window.__as=LH.aplicatii.asistent('powerpoint',{pasi:[{tinta:'mso:Bold',indiciu:'Apasa Bold'},{tinta:'miniatura:2',indiciu:'Alege 2'}],dupaGreseli:2,dupaSecunde:300})")
    clic(pg, 'forma:1/1'); pg.keyboard.press('Escape'); ev(pg); R['as_dupa_alegere'] = [pg.evaluate('window.__as.pas()'), pg.evaluate(IND)]
    for k in ['Alt', 'h']: pg.keyboard.press(k)
    R['as_keytips'] = [ev(pg), pg.evaluate('window.__as.pas()'), pg.evaluate(IND), st(pg)['diapozitive'][0]['texte']]
    pg.keyboard.press('Control+z'); ev(pg)
    clic(pg, 'forma:1/1'); pg.keyboard.press('Escape'); ev(pg)
    clic(pg, 'mso:Bold'); R['as_bold'] = [ev(pg), pg.evaluate('window.__as.pas()'), pg.evaluate(IND)]
    z = pg.evaluate("(()=>{const z=document.querySelector('[data-lh-zona]');const r=z.getBoundingClientRect();return [r.x+8,r.y+r.height-8]})()")
    pg.mouse.click(z[0], z[1]); pg.mouse.click(z[0], z[1] - 3); R['as_2gres'] = [ev(pg), pg.evaluate('window.__as.pas()'), pg.evaluate(IND)]
    clic(pg, 'miniatura:2'); R['as_mini'] = [ev(pg), pg.evaluate('window.__as.pas()'), pg.evaluate(IND)]
    pg.evaluate('window.__as.opreste()')
    # Duration in Transitions
    clic(pg, 'fila:Transitions'); ev(pg)
    R['durata'] = pg.evaluate("(()=>{const e=[...document.querySelectorAll('[data-lh-eticheta^=\"Duration\"]')].filter(x=>x.offsetParent).map(x=>{const i=x.querySelector('input');return [x.getAttribute('data-lh-tip'),x.getAttribute('data-lh-eticheta'),x.getAttribute('aria-disabled'),i?[i.value,i.readOnly]:null]});return e})()")
    clic(pg, 'meniu:Fade'); ev(pg)
    d = pg.evaluate("(()=>{const x=[...document.querySelectorAll('[data-lh-eticheta^=\"Duration\"] input')].find(i=>i.offsetParent);if(!x)return null;const r=x.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,x.readOnly,x.value]})()")
    R['durata_dupa_fade'] = d
    if d:
        pg.mouse.click(d[0], d[1]); pg.keyboard.press('Control+a'); pg.keyboard.type('0,5'); pg.keyboard.press('Enter')
        R['durata_scris'] = [ev(pg), nesimulat(pg), pg.evaluate("[...document.querySelectorAll('[data-lh-eticheta^=\"Duration\"] input')].filter(i=>i.offsetParent).map(i=>i.value)")]
    pg.close()
    # Ctrl+C pe caseta aleasa ca obiect, lipire pe alt diapozitiv; Delete pe caseta
    pg = H.app('powerpoint', C3)
    clic(pg, 'forma:1/1'); pg.keyboard.press('Escape'); ev(pg)
    pg.keyboard.press('Control+c'); R['c_obiect'] = ev(pg)
    clic(pg, 'miniatura:2'); pg.keyboard.press('Control+v'); R['v_obiect'] = [ev(pg), [(d['texte'], d['forme']) for d in st(pg)['diapozitive']]]
    pg.keyboard.press('Control+z'); ev(pg)
    clic(pg, 'miniatura:1'); clic(pg, 'forma:1/1'); pg.keyboard.press('Escape'); pg.keyboard.press('Delete'); R['del_caseta'] = [ev(pg), [(d['texte'], d['forme']) for d in st(pg)['diapozitive']]]
    R['zona_text'] = pg.evaluate("(()=>{const z=document.querySelector('[data-lh-zona]');return z.innerText.slice(0,120)})()")
    pg.close()
    # Design: Format Background / Background Styles
    pg = H.app('powerpoint', C3)
    clic(pg, 'fila:Design'); ev(pg)
    R['design_cmd'] = pg.evaluate("[...document.querySelectorAll('[data-lh-suprafata=\"panglica.TabDesign\"] [data-lh-id-mso]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-id-mso')+(e.getAttribute('aria-disabled')==='true'?'(gri)':''))")
    for t in ['mso:SlideBackgroundFormatDialog', 'mso:BackgroundStylesGallery', 'mso:LaunchFormatBackground']:
        if pg.evaluate("(t)=>!!LH.aplicatii.element('powerpoint',t)", t):
            clic(pg, t); R['d_' + t] = [ev(pg), nesimulat(pg), pg.evaluate("!!document.querySelector('.lh-ap-p-panou')")]
    R['erori'] = list(H.erori)
print(json.dumps(R, ensure_ascii=False))
