# -*- coding: utf-8 -*-
"""Sonda constructorului 14: ce controale au ferestrele PowerPoint (tip, eticheta, tinta, ta), in ordinea DOM."""
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from h import Ham, st, ev, clic
JS = """(b)=>{const d=document.querySelector('[data-lh-suprafata="'+b+'"]');if(!d)return null;
 return [...d.querySelectorAll('[data-lh-tip]')].filter(x=>x.offsetParent&&!x.closest('[data-lh-tip=TitleBar]')).map(x=>{const n=x.__nod||{};
 return [n.t,n.e,x.getAttribute('data-lh-tinta'),n.ta||'',!!x.querySelector(':scope > input'),x.getAttribute('aria-disabled')]}).filter(r=>/^(Edit|ComboBox|Button|SplitButton|CheckBox|RadioButton|Spinner|ListItem|TabItem|MenuItem)$/.test(r[0]))}"""
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']}], 'fisiere': [{'nume': 'Plante_6A_Pop.pptx', 'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Plante']}]}]}
R = {}
with Ham() as H:
    for b in sys.argv[1:]:
        pg = H.app('powerpoint', C)
        pg.evaluate("b=>LH.aplicatii.deschideSuprafata(b)", b)
        pg.wait_for_timeout(200)
        R[b] = pg.evaluate(JS, b)
        pg.close()
for b, v in R.items():
    print('==', b, len(v or []))
    for r in (v or [])[:60]:
        print('  ', r)
