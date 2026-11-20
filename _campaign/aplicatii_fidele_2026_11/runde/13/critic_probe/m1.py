import json,sys,os; sys.path.insert(0,os.path.dirname(__file__))
from k import *
C={'diapozitive':[{'aspect':'Title Slide','texte':['Vulcanii','Ce sunt']},{'aspect':'Title and Content','texte':['B']}],'diapozitiv_activ':1}
o={}
with Ham() as H:
    pg=H.app('powerpoint',C)
    clic(pg,'forma:1/1'); clic(pg,'margine_forma:1/1')
    o['fc_buton']=pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','mso:FontColorPicker')||document.querySelector('[data-lh-tinta^=\"panglica:Home/Font/Font Color\"]');return e?(e.getAttribute('data-lh-eticheta')+'|'+e.getAttribute('aria-label')):null})()")
    clic(pg,'meniu_derulant:Home/Font/Font Color')
    o['more_colors']=pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-suprafata=\"lista.FontColorPicker\"] [data-lh-tip=\"MenuItem\"]')].map(x=>x.getAttribute('data-lh-eticheta')+'|'+JSON.stringify(x.innerText)))()")
    taste(pg,'Escape')
    clic(pg,'fila:Animations'); clic(pg,'meniu:Fade'); clic(pg,'forma:1/2'); clic(pg,'margine_forma:1/2'); clic(pg,'meniu:Fly In')
    clic(pg,'panglica:Animations/Advanced Animation/Animation Pane')
    rows=pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-suprafata^=\"panou.AnimationCustom\"] [data-lh-tinta^=\"fereastra:\"]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-tinta')))()")
    r=[x for x in rows if 'Fade' in x]; 
    if r: clic(pg,r[0])
    o['play']=pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-suprafata^=\"panou.AnimationCustom\"] [data-lh-eticheta^=\"Play\"]')].filter(x=>x.offsetParent).map(x=>x.getAttribute('data-lh-eticheta')+'|'+x.innerText.trim()))()")
    o['ap_legenda']=pg.evaluate("(()=>{const c=document.querySelector('.lh-ap-p-panou-cap');return c?[c.innerText,c.getBoundingClientRect().y]:null})()")
    o['ap_rect']=pg.evaluate("(()=>{const p=document.querySelector('[data-lh-suprafata^=\"panou.AnimationCustom\"]');const b=p.getBoundingClientRect();return [b.x,b.y,b.width,b.height].map(Math.round)})()")
    clic(pg,'diapozitiv',button='right'); clic(pg,'meniu:Format Background...'); clic(pg,'fereastra:Solid fill')
    o['solid_bifat']=pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','fereastra:Solid fill');return e?[e.getAttribute('aria-checked'),e.className.slice(0,60)]:null})()")
    pg2=H.app('powerpoint',C); taste(pg2,'Control+w'); 
    if dlg(pg2): clic(pg2,"fereastra:Don't Save")
    o['fara_prez_bara']=pg2.evaluate("(()=>{const b=document.querySelector('[data-lh-suprafata^=\"bara_stare\"]');return b?b.innerText.replace(/\s+/g,' ').slice(0,80):null})()")
    o['fara_prez_stare']=S(pg2,'prezentari_deschise','diapozitiv_activ')
    o['erori']=H.erori; o['plecate']=H.plecate
print(json.dumps(o,ensure_ascii=False)[:1800])
