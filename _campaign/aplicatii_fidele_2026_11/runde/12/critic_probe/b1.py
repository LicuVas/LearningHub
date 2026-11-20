# -*- coding: utf-8 -*-
"""B: listele si paletele noi la 1366x768, fata de lista.* din referinta."""
import json, sys
sys.path.insert(0, 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe')
from h import Ham, st, ev, clic, centru
from m import JS_ARB, compara
OUT = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/12/critic_probe/'
rez = {}
VULC = {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii", "Ce sunt"]}, {"aspect": "Title and Content", "texte": ["B"]}], "diapozitiv_activ": 1}
ROOTR = "(()=>{const r=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [r.x,r.y,r.width,r.height]})()"


def lista(pg, cheie, nume):
    m = pg.evaluate(JS_ARB, '[data-lh-suprafata="%s"]' % cheie)
    rez[nume] = compara(cheie, m)
    if m:
        s = m['s']; R = m['root']
        try:
            x = R[0] + max(0, s[0] - 40); y = R[1] + max(0, s[1] - 40)
            pg.screenshot(path=OUT + 'b1_%s.png' % nume, clip={'x': x, 'y': y, 'width': min(s[2] + 80, R[2] - x), 'height': min(s[3] + 80, R[3] - y)})
        except Exception as e:
            rez[nume]['shot'] = str(e)[:100]
    rez[nume]['ev'] = ev(pg)


JS_TXT = """(c)=>[...document.querySelectorAll('[data-lh-suprafata="'+c+'"] [data-lh-tip]')].filter(e=>/Group|MenuItem|Button/.test(e.getAttribute('data-lh-tip'))).map(e=>[e.getAttribute('data-lh-tip'),e.getAttribute('data-lh-eticheta'),(e.innerText||'').trim().split('\\n')[0].slice(0,40),e.getAttribute('aria-disabled')])"""
JS_LI = """(c)=>[...document.querySelectorAll('[data-lh-suprafata="'+c+'"] [data-lh-tip="ListItem"]')].map(e=>{const r=e.getBoundingClientRect();return [e.getAttribute('data-lh-eticheta'),(e.innerText||'').trim(),Math.round(r.width),Math.round(r.height),e.querySelectorAll('svg,img,span,div').length]})"""
JS_VIZ = """(c)=>{const s=document.querySelector('[data-lh-suprafata="'+c+'"]');if(!s)return null;const rs=s.getBoundingClientRect();const L=[...s.querySelectorAll('[data-lh-tip="ListItem"],[data-lh-tip="MenuItem"],[data-lh-tip="Group"]')];
  return {n:L.length,in_vedere:L.filter(e=>{const r=e.getBoundingClientRect();return r.bottom<=rs.bottom+1&&r.top>=rs.top-1}).length,
  grupuri:L.filter(e=>e.getAttribute('data-lh-tip')=='Group').map(e=>[e.getAttribute('data-lh-eticheta'),(e.innerText||'').split('\\n')[0].trim().slice(0,30)]),
  pictograme_goale:L.filter(e=>e.getAttribute('data-lh-tip')=='ListItem').filter(e=>{const i=e.querySelector('[aria-hidden]');if(!i)return true;const cs=getComputedStyle(i);return cs.backgroundImage==='none'&&!i.querySelector('svg')&&!i.innerHTML.trim()}).length,
  exemplu_li:L.filter(e=>e.getAttribute('data-lh-tip')=='ListItem').slice(0,2).map(e=>e.outerHTML.slice(0,300))}}"""

with Ham() as H:
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "selectie_text": [1, 1], "forma_citita": [1, 1]})
    rez['root'] = pg.evaluate(ROOTR)
    clic(pg, 'mso:TabHome'); clic(pg, 'mso:FontColorPicker_Dropdown'); pg.wait_for_timeout(200)
    lista(pg, 'lista.FontColorPicker', 'fontcolor')
    rez['fontcolor_txt'] = pg.evaluate(JS_TXT, 'lista.FontColorPicker')
    clic(pg, 'meniu:Red'); pg.wait_for_timeout(150)
    s = st(pg); rez['dupa_red'] = {'culoare_text': s.get('culoare_text'), 'ev': ev(pg)}
    rez['dupa_red_ecran'] = pg.evaluate("""(()=>{const f=LH.aplicatii.element('powerpoint','forma:1/1');if(!f)return null;const sp=[...f.querySelectorAll('*')].filter(x=>[...x.childNodes].some(n=>n.nodeType==3&&n.textContent.trim()));return sp.map(x=>[x.textContent.trim().slice(0,20),getComputedStyle(x).color])})()""")
    rez['buton_fc'] = pg.evaluate("""(()=>{const e=document.querySelector('[data-lh-id-mso="FontColorPicker"]');if(!e)return null;return [e.getAttribute('data-lh-eticheta'),[...e.querySelectorAll('[data-lh-tip]')].map(x=>[x.getAttribute('data-lh-tip'),x.getAttribute('data-lh-eticheta'),x.getAttribute('aria-disabled')])]})()""")
    pg.close()
    # mini-bara
    pg = H.app('powerpoint', {"diapozitive": [{"aspect": "Title Slide", "texte": ["Vulcanii"]}], "selectie_text": [1, 1], "forma_citita": [1, 1]})
    c = centru(pg, 'forma:1/1')
    pg.mouse.click(c[0], c[1], button='right'); pg.wait_for_timeout(250)
    mb = pg.evaluate("""(()=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();const m=document.querySelector('[data-lh-suprafata^="meniu_contextual"]');if(!m)return null;const r=m.getBoundingClientRect();
      const sb=[...m.querySelectorAll('[data-lh-tip="SplitButton"]')].find(x=>/^Font Color/.test(x.getAttribute('data-lh-eticheta')||''));
      const mi=sb&&sb.querySelector('[data-lh-tip="MenuItem"]'); const b=mi&&mi.getBoundingClientRect(); const bs=sb&&sb.getBoundingClientRect();
      const bt=sb&&sb.querySelector('[data-lh-tip="Button"]');
      return {cheie:m.getAttribute('data-lh-suprafata'),meniu:[r.x-R.x,r.y-R.y,r.width,r.height],sb:bs?[bs.x-R.x,bs.y-R.y,bs.width,bs.height]:null,sb_et:sb&&sb.getAttribute('data-lh-eticheta'),buton_et:bt&&bt.getAttribute('data-lh-eticheta'),mi:b?[b.x+b.width/2,b.y+b.height/2]:null}})()""")
    rez['minibara_meniu'] = mb; rez['minibara_ev'] = ev(pg); rez['minibara_sel'] = st(pg).get('formatare_text')
    if mb and mb.get('mi'):
        pg.mouse.click(mb['mi'][0], mb['mi'][1]); pg.wait_for_timeout(250)
        lista(pg, 'lista.FontColorPicker_minibara', 'minibara')
        clic(pg, 'meniu:Blue'); pg.wait_for_timeout(150)
        rez['minibara_blue'] = {'culoare_text': st(pg).get('culoare_text'), 'ev': ev(pg)}
    pg.close()
    for mso, cheie, nume in [('SlideLayoutGallery', 'lista.SlideLayoutGallery', 'layout'), ('SlideNewGallery_Dropdown', 'lista.SlideNewGallery', 'newslide')]:
        pg = H.app('powerpoint', VULC); clic(pg, 'mso:TabHome'); clic(pg, 'mso:' + mso); pg.wait_for_timeout(200); lista(pg, cheie, nume)
        rez[nume + '_li'] = pg.evaluate(JS_LI, cheie)
        rez[nume + '_txt'] = pg.evaluate(JS_TXT, cheie)
        pg.close()
    for mso, cheie, nume in [('FlyoutAnchorInsertPictures', 'lista.FlyoutAnchorInsertPictures', 'pictures'), ('ShapesInsertGallery', 'lista.ShapesInsertGallery', 'shapes'), ('TableInsertGallery', 'lista.TableInsertGallery', 'table')]:
        pg = H.app('powerpoint', VULC); clic(pg, 'mso:TabInsert'); clic(pg, 'mso:' + mso); pg.wait_for_timeout(200); lista(pg, cheie, nume)
        rez[nume + '_viz'] = pg.evaluate(JS_VIZ, cheie)
        rez[nume + '_txt'] = pg.evaluate(JS_TXT, cheie)[:20]
        pg.close()
    pg = H.app('powerpoint', VULC)
    rez['tinta_diapozitiv'] = pg.evaluate("""(()=>{const R=document.querySelector('[data-lh-aplicatie]').getBoundingClientRect();return [...document.querySelectorAll('[data-lh-tinta="diapozitiv"]')].map(e=>{const r=e.getBoundingClientRect();const cs=getComputedStyle(e);return [e.className,r.x-R.x,r.y-R.y,r.width,r.height,cs.backgroundColor,cs.borderStyle,cs.outlineStyle,cs.zIndex,cs.cursor,cs.opacity]})})()""")
    c = centru(pg, 'diapozitiv'); rez['centru_diapozitiv'] = c
    pg.mouse.click(c[0], c[1], button='right'); pg.wait_for_timeout(200)
    rez['fb_meniu'] = ev(pg)
    clic(pg, 'meniu:Format Background...'); pg.wait_for_timeout(250)
    clic(pg, 'fereastra:Solid fill'); pg.wait_for_timeout(150)
    clic(pg, 'fereastra:Color'); pg.wait_for_timeout(250)
    lista(pg, 'lista.FormatBackground_Color', 'fbcolor')
    rez['fbcolor_txt'] = pg.evaluate(JS_TXT, 'lista.FormatBackground_Color')
    pg.close()
    rez['erori_pagina'] = H.erori; rez['plecate'] = H.plecate
json.dump(rez, open(OUT + 'b1_out.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('gata')
