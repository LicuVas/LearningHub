# A5: Font Color cu text ales; KeyTips in Word (control al gestului); Animation Pane; Format Background; Ctrl+C/V; tragerea casetei
import sys, json; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe')
from h import Ham, st, ev as ev0, clic as clic0, centru, nesimulat
R = {}
def ev(pg): pg.wait_for_timeout(120); return ev0(pg)
def clic(pg, t, app='powerpoint', **k): r = clic0(pg, t, app=app, **k); pg.wait_for_timeout(80); return r
def dis(pg, t): return pg.evaluate("(t)=>{const e=LH.aplicatii.element('powerpoint',t);return e?[e.getAttribute('aria-disabled'),e.className.slice(0,80)]:null}", t)
C3 = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['A', 'a']}, {'aspect': 'Title and Content', 'texte': ['B', 'b']}], 'diapozitiv_activ': 2}
with Ham() as H:
    pg = H.app('powerpoint', C3); pg.set_default_timeout(15000)
    R['fc_nimic'] = dis(pg, 'mso:FontColorPicker')
    clic(pg, 'forma:2/1'); ev(pg); R['fc_edit'] = dis(pg, 'mso:FontColorPicker'); R['sel_edit'] = st(pg)['selectie_text']
    ok = clic(pg, 'mso:FontColorPicker', dx=0.3); R['fc_edit_clic'] = [ok, ev(pg), nesimulat(pg)]
    clic(pg, 'forma:2/1'); pg.keyboard.press('Escape'); ev(pg); R['sf'] = st(pg)['selectie_forma']; R['fc_obiect'] = dis(pg, 'mso:FontColorPicker')
    ok = clic(pg, 'mso:FontColorPicker', dx=0.9); R['fc_obiect_sageata'] = [ok, ev(pg), nesimulat(pg)]
    # Animations: doua casete cu efecte, apoi schimb efectul primei
    clic(pg, 'fila:Animations'); ev(pg)
    clic(pg, 'forma:2/1'); pg.keyboard.press('Escape'); clic(pg, 'meniu:Fly In'); ev(pg)
    clic(pg, 'forma:2/2'); pg.keyboard.press('Escape'); clic(pg, 'meniu:Fade'); ev(pg)
    R['anim2'] = st(pg)['diapozitive'][1]
    clic(pg, 'forma:2/1'); pg.keyboard.press('Escape'); clic(pg, 'meniu:Wipe'); ev(pg)
    R['anim_inlocuit'] = st(pg)['diapozitive'][1]
    R['anim_ecran_numere'] = pg.evaluate("[...document.querySelectorAll('[data-lh-zona] *')].filter(e=>e.children.length===0&&/^\d$/.test(e.textContent.trim())&&e.offsetParent).map(e=>e.textContent)")
    ok = clic(pg, 'mso:AnimationCustom'); R['pane'] = [ok, ev(pg)]
    R['pane_continut'] = pg.evaluate("(()=>{const p=document.querySelector('.lh-ap-p-panou');if(!p)return null;return [p.innerText.replace(/\s+/g,' ').slice(0,300),[...p.querySelectorAll('[data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta')+':'+(e.getAttribute('data-lh-id')||'')+(e.getAttribute('aria-disabled')==='true'?'(gri)':''))]})()")
    for t in ['fereastra:Move Earlier', 'fereastra:Move Later', 'panou:Move Earlier', 'meniu:Move Earlier']:
        e = pg.evaluate("(t)=>!!LH.aplicatii.element('powerpoint',t)", t); R['pane_' + t] = e
    pg.close()
    # Format Background din clic dreapta pe diapozitiv
    pg = H.app('powerpoint', C3)
    clic(pg, 'miniatura:2', button='right'); ev(pg); ok = clic(pg, 'meniu:Format Background...'); R['fb'] = [ok, ev(pg)]
    R['fb_continut'] = pg.evaluate("(()=>{const p=document.querySelector('.lh-ap-p-panou');if(!p)return null;const r=p.getBoundingClientRect();return [[r.x,r.y,r.width,r.height].map(Math.round),[...p.querySelectorAll('[data-lh-tinta]')].filter(e=>e.offsetParent).map(e=>e.getAttribute('data-lh-tinta')+':'+(e.getAttribute('data-lh-id')||'')).slice(0,40)]})()")
    for t in ['fereastra:Solid fill', 'camp:Solid fill', 'fereastra:Apply to All', 'fereastra:Color']:
        if pg.evaluate("(t)=>!!LH.aplicatii.element('powerpoint',t)", t):
            clic(pg, t); R['fb_' + t] = [ev(pg), nesimulat(pg)]
    pg.close()
    # Ctrl+C / Ctrl+V pe miniaturi si pe text
    pg = H.app('powerpoint', C3)
    clic(pg, 'miniatura:1'); ev(pg); pg.keyboard.press('Control+c'); pg.keyboard.press('Control+v'); R['cv_dia'] = [ev(pg), [d['texte'] for d in st(pg)['diapozitive']], st(pg)['diapozitiv_activ']]
    pg.keyboard.press('Control+z'); R['cv_z'] = [d['texte'] for d in st(pg)['diapozitive']]; ev(pg)
    clic(pg, 'forma:1/1'); pg.keyboard.press('Control+a'); pg.keyboard.press('Control+x'); R['x_text'] = [ev(pg), [d['texte'] for d in st(pg)['diapozitive']]]
    clic(pg, 'forma:1/2'); pg.keyboard.press('End'); pg.keyboard.press('Control+v'); R['v_text'] = [ev(pg), [d['texte'] for d in st(pg)['diapozitive']]]
    pg.close()
    # tragerea casetei: margine si interior; scenariul tragere-forma (forma 1/1, cu [0,100])
    pg = H.app('powerpoint', {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii']}]})
    R['margine_tinte'] = pg.evaluate("[...document.querySelectorAll('[data-lh-tinta=margine_forma],[data-lh-tinta^=\"margine_forma:\"]')].map(e=>{const r=e.getBoundingClientRect();return [e.getAttribute('data-lh-id'),[r.x,r.y,r.width,r.height].map(Math.round),getComputedStyle(e).pointerEvents]})")
    c = centru(pg, 'forma:1/1'); pg.mouse.move(c[0], c[1]); pg.mouse.down(); pg.mouse.move(c[0], c[1] + 60, steps=6); pg.mouse.up(); R['trage_interior'] = [ev(pg), st(pg)['selectie_text'], st(pg)['selectie_forma'], st(pg)['modificat']]
    R['dem'] = pg.evaluate("JSON.stringify(LH.aplicatii.demonstratie?LH.aplicatii.demonstratie('powerpoint','tragere'):null)")
    R['erori'] = list(H.erori)
print(json.dumps(R, ensure_ascii=False))
