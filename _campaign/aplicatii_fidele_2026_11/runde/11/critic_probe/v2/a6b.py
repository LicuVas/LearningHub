import sys, json; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe')
from h import Ham, st, ev, centru, nesimulat
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe/v2/'
R = {}
OKR = """(t)=>{const e=[...document.querySelectorAll('.lh-ap-strat-dialog [data-lh-tinta]')].find(x=>(x.getAttribute('data-lh-tinta')+':'+(x.getAttribute('data-lh-id')||'')).startsWith(t));if(!e)return null;const r=e.getBoundingClientRect();
 const s=document.querySelector('.lh-ap-strat-dialog');let sc=null;for(let p=e.parentElement;p;p=p.parentElement){const c=getComputedStyle(p);if(/auto|scroll/.test(c.overflowX+c.overflowY)&&(p.scrollWidth>p.clientWidth+2||p.scrollHeight>p.clientHeight+2)){sc=[p.className.slice(0,30),p.scrollWidth,p.clientWidth];break}}
 return {r:[r.x,r.y,r.width,r.height].map(Math.round),in_ecran:r.right<=innerWidth&&r.bottom<=innerHeight&&r.left>=0,derulabil:sc}}"""
def tap(pg, js):
    e = pg.evaluate(js)
    if e: pg.touchscreen.tap(e[0], e[1]); pg.wait_for_timeout(200)
    return e
for app, lans in [('powerpoint', 'lansator:Home/Font'), ('word', 'lansator:Home/Font')]:
    with Ham(viewport=(360, 740), mobil=True, scale=2) as H:
        pg = H.app(app, {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii']}]} if app == 'powerpoint' else None); pg.set_default_timeout(15000)
        if app == 'powerpoint':
            c = centru(pg, 'forma:1/1'); pg.touchscreen.tap(c[0], c[1]); pg.wait_for_timeout(150)
        tap(pg, "(()=>{const e=LH.aplicatii.element('%s','%s');if(!e)return null;e.scrollIntoView({inline:'center',block:'nearest'});const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()" % (app, lans))
        R[app + '_font_OK'] = pg.evaluate(OKR, 'fereastra:OK')
        R[app + '_font_Cancel'] = pg.evaluate(OKR, 'fereastra:Cancel')
        R[app + '_font_dlg'] = pg.evaluate("(()=>{const d=document.querySelector('.lh-ap-strat-dialog [data-lh-suprafata]')||document.querySelector('[data-lh-suprafata^=\"dialog.\"]');if(!d)return null;const r=d.getBoundingClientRect();return [r.x,r.y,r.width,r.height].map(Math.round)})()")
        if app == 'powerpoint':
            # File pe telefon
            f = tap(pg, "(()=>{document.querySelector('.lh-ap-strat-dialog')&&0;return null})()")
            pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
            R['ppt_dlg_dupa_esc'] = st(pg).get('dialog')
            f = tap(pg, "(()=>{const e=LH.aplicatii.element('powerpoint','fila:File');if(!e)return null;e.scrollIntoView({inline:'nearest',block:'nearest'});const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.width,r.height]})()")
            R['ppt_file'] = [f, st(pg).get('backstage')]
            R['ppt_bs_nav'] = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','backstage:Save As');const n=[...document.querySelectorAll('[data-lh-tinta=backstage]')].filter(x=>x.getAttribute('data-lh-id')==='Save As').map(x=>{const r=x.getBoundingClientRect();return [r.x,r.y,r.width,r.height,getComputedStyle(x).visibility,!!x.offsetParent].map(v=>typeof v==='number'?Math.round(v):v)});return [!!e,n]})()")
            pg.screenshot(path=OUT + 'cap_tel360_file.png')
print(json.dumps(R, ensure_ascii=False))
