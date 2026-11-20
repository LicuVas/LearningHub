# A6: telefon 360/390 (atingeri) si fereastra mica 1366x657 la 125% (= 1093x526 css)
import sys, json; sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe')
from h import Ham, st, ev, centru, nesimulat
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/11/critic_probe/v2/'
R = {}
MAS = """(()=>{const rad=document.querySelector('[data-lh-aplicatie=powerpoint]');const W=innerWidth,Hh=innerHeight;
 const pg=document.querySelector('[data-lh-suprafata^="panglica"]');const sc=pg&&pg.closest('*');
 let ov=null; for(let e=pg;e&&e!==document.body;e=e.parentElement){const c=getComputedStyle(e);if(/auto|scroll/.test(c.overflowX)&&e.scrollWidth>e.clientWidth+2){ov=[e.className.slice(0,40),e.scrollWidth,e.clientWidth];break}}
 const mici=[...rad.querySelectorAll('[data-lh-tip=Button],[data-lh-tip=SplitButton],[data-lh-tip=MenuItem],[data-lh-tip=TabItem],[data-lh-tinta]')].filter(e=>{if(!e.offsetParent)return false;const r=e.getBoundingClientRect();return r.width>0&&r.right>0&&r.left<W&&r.bottom>0&&r.top<Hh&&(r.width<32||r.height<32)});
 const taiat=[...rad.querySelectorAll('[data-lh-tip=Group]')].filter(e=>{const r=e.getBoundingClientRect();return e.offsetParent&&r.width>0&&r.height<20}).length;
 const rr=rad.getBoundingClientRect();
 return {W,Hh,rad:[rr.x,rr.y,rr.width,rr.height].map(Math.round),docScroll:document.documentElement.scrollWidth,derulare_panglica:ov,mici:mici.length,exemple_mici:mici.slice(0,6).map(e=>{const r=e.getBoundingClientRect();return (e.getAttribute('data-lh-eticheta')||e.getAttribute('data-lh-tinta'))+' '+Math.round(r.width)+'x'+Math.round(r.height)}),grupuri_turtite:taiat}})()"""
def dlg(pg): return pg.evaluate("(()=>{const d=document.querySelector('.lh-ap-strat-dialog [data-lh-suprafata]');if(!d)return null;const r=d.getBoundingClientRect();return [[r.x,r.y,r.width,r.height].map(Math.round),innerWidth,innerHeight]})()")
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii']}, {'aspect': 'Title and Content', 'texte': ['Ce sunt']}]}
for nume, vp, mobil in [('tel360', (360, 740), True), ('tel390', (390, 844), True), ('mica', (1093, 526), False)]:
    with Ham(viewport=vp, mobil=mobil, scale=(2 if mobil else 1.25)) as H:
        pg = H.app('powerpoint', C); pg.set_default_timeout(15000)
        r = {'m': pg.evaluate(MAS)}
        c = centru(pg, 'forma:1/1')
        if c:
            if mobil: pg.touchscreen.tap(c[0], c[1])
            else: pg.mouse.click(c[0], c[1])
            pg.wait_for_timeout(150)
            cdp = pg.context.new_cdp_session(pg)
            cdp.send('Input.insertText', {'text': ' mari'}); pg.wait_for_timeout(150)
            r['dupa_tap_scris'] = [st(pg)['diapozitive'][0]['texte'], st(pg)['selectie_text'], ev(pg)[-3:]]
            r['vizibil_titlu'] = c
        # Font: lansatorul (derulat in vedere)
        e = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','lansator:Home/Font');if(!e)return null;e.scrollIntoView({inline:'center',block:'nearest'});const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.width,r.height]})()")
        r['lansator_font'] = e
        if e:
            if mobil: pg.touchscreen.tap(e[0], e[1])
            else: pg.mouse.click(e[0], e[1])
            pg.wait_for_timeout(200); r['font_dlg'] = dlg(pg)
            pg.screenshot(path=OUT + 'cap_' + nume + '_font.png')
            pg.keyboard.press('Escape')
        # File > Save As > Browse: dialogul Save As incape?
        f = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','fila:File');if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()")
        if f:
            pg.mouse.click(f[0], f[1]); pg.wait_for_timeout(150)
            b = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','backstage:Save As');if(!e)return null;const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.width,r.height]})()")
            r['bs_save_as'] = b
            if b:
                pg.mouse.click(b[0], b[1]); pg.wait_for_timeout(150)
                br = pg.evaluate("(()=>{const e=LH.aplicatii.element('powerpoint','backstage:Browse');if(!e)return null;e.scrollIntoView({block:'nearest',inline:'nearest'});const r=e.getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2,r.width,r.height]})()")
                r['browse'] = br
                if br:
                    pg.mouse.click(br[0], br[1]); pg.wait_for_timeout(200); r['saveas_dlg'] = dlg(pg)
                    r['camp_nume'] = pg.evaluate("(()=>{const i=document.querySelector('.lh-ap-strat-dialog input[aria-label^=\"File name\"]');if(!i)return null;const r=i.getBoundingClientRect();return [Math.round(r.x),Math.round(r.y),Math.round(r.width),Math.round(r.height),r.right<=innerWidth&&r.bottom<=innerHeight]})()")
        pg.screenshot(path=OUT + 'cap_' + nume + '_saveas.png')
        r['erori'] = list(H.erori)
        R[nume] = r
print(json.dumps(R, ensure_ascii=False))
