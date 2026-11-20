import json,sys,os; sys.path.insert(0,os.path.dirname(__file__))
from k import *
C={'diapozitive':[{'aspect':'Title Slide','texte':['Vulcanii','Ce sunt']},{'aspect':'Title Only','texte':['Soarele'],'forme':[{'fel':'forma','forma':'Star: 5 Points','pozitie':[60,180,180,170]}]}],'diapozitiv_activ':1}
with Ham() as H:
    pg=H.app('powerpoint',C)
    r={}
    r['font']=pg.evaluate("""(()=>{const e=LH.aplicatii.element('powerpoint','mso:Font');if(!e)return null;const i=e.querySelectorAll('input');
      return {tinta:e.getAttribute('data-lh-tinta'),tip:e.getAttribute('data-lh-tip'),inputs:[...i].map(x=>({ro:x.readOnly,v:x.value})),kids:[...e.querySelectorAll('[data-lh-tinta]')].map(x=>x.getAttribute('data-lh-tinta')+'|'+x.getAttribute('data-lh-tip')+'|'+x.getBoundingClientRect().width.toFixed(0))}})()""")
    r['start']=pg.evaluate("""(()=>[...document.querySelectorAll('[data-lh-tip="ComboBox"]')].map(x=>x.getAttribute('data-lh-eticheta')+'|'+x.getAttribute('data-lh-tinta')+'|'+[...x.querySelectorAll('input')].map(i=>i.readOnly)).slice(0,20))()""")
    r['note']=pg.evaluate("(()=>{const e=document.querySelector('[data-lh-tinta=\"zona_note\"]');if(!e)return null;const b=e.getBoundingClientRect();return [b.x,b.y,b.width,b.height,e.textContent.slice(0,40)]})()")
    r['intrare']=pg.evaluate("(()=>{const a=document.activeElement;return a.tagName+'|'+a.className+'|'+(a.getAttribute('inputmode')||'')+'|'+(a.getAttribute('aria-label')||'')})()")
    r['stare_chei']=sorted(S(pg).keys())
    r['stare']=json.dumps(S(pg,'vedere','note_diapozitive','font_text','umplere_forme','prezentare_activa','prezentari_deschise','diapozitiv_activ'),ensure_ascii=False)
    r['erori']=H.erori; r['plecate']=H.plecate
    print(json.dumps(r,ensure_ascii=False,indent=0)[:4000])
