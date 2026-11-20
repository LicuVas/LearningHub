import json,sys,os; sys.path.insert(0,os.path.dirname(__file__))
from k import *
L08={'diapozitive':[{'aspect':'Title Slide','texte':['Munții Rodnei','Ce sunt'],'fonturi':['Comic Sans MS',None]},{'aspect':'Title Slide','texte':['Fără font','x']}],'diapozitiv_activ':1}
JS="""(()=>{const z=document.querySelector('.lh-ap-p-zona');const o=[];z.querySelectorAll('[data-lh-tinta="forma"]').forEach(f=>{const s=[...f.querySelectorAll('span,div')].filter(x=>[...x.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()));o.push([f.getAttribute('data-lh-id'),s.map(x=>x.textContent.slice(0,14)+' => '+getComputedStyle(x).fontFamily.slice(0,40))])});return o})()"""
with Ham() as H:
    pg=H.app('powerpoint',L08)
    print('start',json.dumps(pg.evaluate(JS),ensure_ascii=False))
    clic(pg,'forma:1/1'); clic(pg,'margine_forma:1/1'); clic(pg,'meniu_derulant:Home/Font/Font'); clic(pg,'meniu:Calibri Light (Headings)')
    print('dupa',json.dumps(pg.evaluate(JS),ensure_ascii=False), S(pg,'font_text'))
    clic(pg,'meniu_derulant:Home/Font/Font'); clic(pg,'meniu:Arial Black')
    print('arial black',json.dumps(pg.evaluate(JS),ensure_ascii=False), S(pg,'font_text'))
    pg.screenshot(path=os.path.join(os.path.dirname(__file__),'a2_font.png'),clip={'x':180,'y':150,'width':700,'height':260})
    # Font Color: panglica, mini-bara, Format Background
    def pal(k):
        return pg.evaluate("""k=>{const m=document.querySelector('[data-lh-suprafata="'+k+'"]');if(!m)return null;
          const g=[...m.querySelectorAll('[data-lh-tip="Group"]')].map(x=>[x.getAttribute('data-lh-eticheta'),(x.innerText||'').split(String.fromCharCode(10))[0].trim()]).filter(x=>x[0]&&x[0].trim());
          const it=[...m.querySelectorAll('[data-lh-tip="ListItem"]')];return {grupuri:g,n:it.length,fara_title:it.filter(x=>!x.getAttribute('title')).length}}""",k)
    clic(pg,'meniu_derulant:Home/Font/Font Color'); print('FC',pal('lista.FontColorPicker')); clic(pg,'meniu:Dark Blue'); print(S(pg,'culoare_text'))
    clic(pg,'forma:1/1',button='right'); pg.wait_for_timeout(200)
    mb=pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-tinta]')].filter(x=>x.offsetParent&&/Font Color/.test(x.getAttribute('data-lh-tinta'))&&x.closest('.lh-ap-p-meniu')).map(x=>x.getAttribute('data-lh-tinta')))()"); print('minibara tinte',mb)
    if mb: clic(pg,mb[-1]); print('FCmini',pal('lista.FontColorPicker_minibara'))
    taste(pg,'Escape'); taste(pg,'Escape')
    clic(pg,'diapozitiv',button='right'); clic(pg,'meniu:Format Background...'); clic(pg,'fereastra:Solid fill')
    c=pg.evaluate("(()=>[...document.querySelectorAll('[data-lh-tinta]')].filter(x=>x.offsetParent&&/Color/.test(x.getAttribute('data-lh-tinta')||'')&&x.closest('.lh-ap-p-panou,[data-lh-suprafata^=\"panou.\"]')).map(x=>x.getAttribute('data-lh-tinta')).slice(0,6))()"); print('FB tinte',c)
    for t in c:
        if 'meniu_derulant' in t or t.endswith('Color'): clic(pg,t); break
    print('FBcolor',pal('lista.FormatBackground_Color'))
    # adresa ferestrei Open
    pg2=H.app('powerpoint',{'diapozitive':[{'aspect':'Title Slide'}],'fisiere':[{'nume':'Plante_6A_Pop.pptx','diapozitive':[{'aspect':'Title Slide','texte':['Plante']}]}]})
    taste(pg2,'Control+o'); clic(pg2,'backstage:Browse')
    print('open adresa',pg2.evaluate("(()=>{const d=document.querySelector('[data-lh-suprafata=\"dialog.FileOpen\"]');return [...d.querySelectorAll('[data-lh-eticheta]')].filter(x=>x.offsetParent&&/Documente|Toate|Acest PC|Desktop/.test(x.getAttribute('data-lh-eticheta'))).map(x=>x.getAttribute('data-lh-tip')+':'+x.getAttribute('data-lh-eticheta')+'|'+x.innerText.trim().slice(0,20))})()"))
    print('erori',H.erori,'plecate',H.plecate)
