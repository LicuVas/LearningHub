# -*- coding: utf-8 -*-
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from k import *
STAR = {'fel': 'forma', 'forma': 'Star: 5 Points', 'pozitie': [60, 180, 180, 170]}
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']},
                     {'aspect': 'Title Only', 'texte': ['Soarele'], 'forme': [STAR]},
                     {'aspect': 'Title and Content', 'texte': ['B']}], 'diapozitiv_activ': 1}
with Ham() as H:
    pg = H.app('powerpoint', C)
    s = st(pg)
    print(json.dumps(s, ensure_ascii=False)[:2500])
    print(pg.evaluate("""(()=>{const r=document.querySelector('[data-lh-aplicatie="powerpoint"]');
      return {mini:[...r.querySelectorAll('[data-lh-tinta="miniatura"]')].length, zona:!!r.querySelector('[data-lh-zona]'),
      titlu:(r.querySelector('[data-lh-suprafata="bara_titlu"]')||{}).innerText, tinte:[...new Set([...r.querySelectorAll('[data-lh-tinta]')].map(x=>x.getAttribute('data-lh-tinta')))].slice(0,40)}})()"""))
