# -*- coding: utf-8 -*-
"""MINOR-urile vechi (critic 11 §6) + mici verificari: modificat dupa Ctrl+Z, ultimul diapozitiv sters, Notes din bara de stare,
Blank Presentation, lista Insert Picture, zona de lucru fara prezentare."""
import json, sys
sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe')
from h import Ham, st, ev, clic, centru, nesimulat
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe/'
rez = {}


def k(pg, key, w=150):
    pg.keyboard.press(key); pg.wait_for_timeout(w)


with Ham() as H:
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "nume_fisier": "Proiect.pptx"})
    c = centru(pg, 'forma:1/1'); pg.mouse.click(c[0], c[1]); pg.keyboard.type('X'); ev(pg)
    a = st(pg).get('modificat'); k(pg, 'Control+s', 250); b = st(pg).get('modificat'); k(pg, 'Control+z', 200); cc = st(pg).get('modificat')
    k(pg, 'Control+s', 250); d = st(pg).get('modificat'); k(pg, 'Control+y', 200); e = st(pg).get('modificat')
    rez['M1_modificat'] = [a, b, cc, d, e, [(x['g'], x['a']) for x in ev(pg)]]
    pg.close()
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]})
    clic(pg, 'miniatura:1'); k(pg, 'Delete', 200)
    s = st(pg); rez['M2_ultimul'] = [s.get('diapozitive'), s.get('diapozitiv_activ')]
    k(pg, 'Control+z', 200); rez['M2_z'] = [len(st(pg).get('diapozitive')), st(pg).get('diapozitiv_activ')]
    # Notes din bara de stare (eticheta reala „Notes ”, cu spatiu)
    r = pg.evaluate("(()=>{const x=[...document.querySelectorAll('[data-lh-suprafata=\"bara_stare\"] [data-lh-eticheta]')].find(y=>/^Notes/.test(y.getAttribute('data-lh-eticheta')));if(!x)return null;const q=x.getBoundingClientRect();return [q.x+q.width/2,q.y+q.height/2,x.getAttribute('data-lh-eticheta')]})()")
    if r:
        pg.mouse.click(r[0], r[1]); pg.wait_for_timeout(150)
    rez['notes_bara'] = [r, [(x['g'], x['a'], x['t']) for x in ev(pg)], nesimulat(pg)[:1]]
    # File > New > Blank Presentation
    clic(pg, 'fila:File'); pg.wait_for_timeout(250)
    rez['file_nav'] = pg.evaluate("[...document.querySelectorAll('.lh-ap-strat-backstage [data-lh-tinta]')].map(x=>x.getAttribute('data-lh-tinta')+':'+(x.getAttribute('data-lh-id')||'')).filter(t=>/backstage/.test(t)).slice(0,14)")
    clic(pg, 'backstage:New'); pg.wait_for_timeout(250); ev(pg)
    r = pg.evaluate("(()=>{const x=[...document.querySelectorAll('.lh-ap-strat-backstage [data-lh-eticheta]')].find(y=>/^Blank Presentation/.test(y.getAttribute('data-lh-eticheta'))&&y.getClientRects().length);if(!x)return null;const q=x.getBoundingClientRect();return [q.x+q.width/2,q.y+q.height/2,x.getAttribute('data-lh-eticheta'),x.getAttribute('data-lh-tinta')]})()")
    if r:
        pg.mouse.click(r[0], r[1]); pg.wait_for_timeout(250)
    rez['blank'] = [r, [(x['g'], x['a'], x['t']) for x in ev(pg)], nesimulat(pg)[:1], st(pg).get('prezentari_deschise'), st(pg).get('prezentare_activa')]
    pg.close()
    # Insert Picture: textul vizibil al listei de fisiere
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]})
    clic(pg, 'mso:TabInsert'); clic(pg, 'mso:FlyoutAnchorInsertPictures'); pg.wait_for_timeout(150); clic(pg, 'meniu:This Device...'); pg.wait_for_timeout(300)
    rez['poza_lista'] = pg.evaluate("[...document.querySelectorAll('[data-lh-suprafata=\"dialog.PictureInsertFromFilePowerPoint\"] [data-lh-tip=\"ListItem\"]')].slice(0,4).map(x=>[(x.innerText||'').trim().slice(0,40),x.getClientRects().length>0])")
    pg.screenshot(path=OUT + 'm1_poza.png', clip={'x': 300, 'y': 120, 'width': 760, 'height': 520})
    pg.close()
    # fara prezentare: ce se vede in zona de lucru
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}]})
    k(pg, 'Control+w', 300)
    rez['fara_prez_zona'] = pg.evaluate("""(()=>{const z=document.querySelector('.lh-ap-p-zona');const m=document.querySelector('.lh-ap-p-miniaturi');const s=document.querySelector('.lh-ap-p-slide');const p=document.querySelector('.lh-ap-p-pane');
      const v=e=>e?[getComputedStyle(e).display,getComputedStyle(e).visibility,getComputedStyle(e).backgroundColor,Math.round(e.getBoundingClientRect().width)]:null;
      return {zona:v(z),mini:v(m),slide:v(s),pane:v(p),stare_bara:(document.querySelector('[data-lh-suprafata="bara_stare"]')||{}).innerText}})()""")
    pg.screenshot(path=OUT + 'm1_fara_prez.png', clip={'x': 0, 'y': 150, 'width': 1366, 'height': 618})
    pg.close()
    rez['erori'] = H.erori; rez['plecate'] = H.plecate
json.dump(rez, open(OUT + 'm1_out.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('gata')
