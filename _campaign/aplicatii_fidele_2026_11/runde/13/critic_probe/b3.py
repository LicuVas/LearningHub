import json,sys,os; sys.path.insert(0,os.path.dirname(__file__))
from k import *
from b1 import C
with Ham() as H:
    pg=H.app('powerpoint',C)
    clic(pg,'miniatura:2'); clic(pg,'forma:2/2'); taste(pg,'Control+c'); clic(pg,'miniatura:3'); taste(pg,'Control+v')
    s=S(pg,'forme_diapozitiv','pozitii_forme','selectie_forma','diapozitiv_activ'); print('dupa V',json.dumps(s,ensure_ascii=False))
    taste(pg,'Control+z'); print('dupa Z',json.dumps(S(pg,'forme_diapozitiv'),ensure_ascii=False)[:300])
    taste(pg,'Control+y'); print('dupa Y',json.dumps(S(pg,'forme_diapozitiv','selectie_forma'),ensure_ascii=False)[:400])
    # focusul dupa Tab in Open: ce element e
    pg2=H.app('powerpoint',dict(C,fisiere=[{'nume':'Plante_6A_Pop.pptx','diapozitive':[{'aspect':'Title Slide','texte':['Plante']}]}]))
    taste(pg2,'Control+o'); clic(pg2,'backstage:Browse'); print('foc deschidere',foc(pg2))
    taste(pg2,'Tab'); print('dupa Tab',pg2.evaluate("(()=>{const a=document.activeElement;return a.outerHTML.slice(0,200)+' | inRoot '+!!a.closest('[data-lh-aplicatie]')+' | inDialog '+!!a.closest('[data-lh-suprafata^=\"dialog.\"]')})()"))
    # sublinierea literelor de acces
    print('sublinieri',pg2.evaluate("(()=>[...document.querySelectorAll('[data-lh-suprafata=\"dialog.FileOpen\"] u, [data-lh-suprafata=\"dialog.FileOpen\"] .lh-ap-acces')].length)()"))
    print('erori',H.erori,'plecate',H.plecate)
