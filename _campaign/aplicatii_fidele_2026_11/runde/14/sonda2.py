# -*- coding: utf-8 -*-
import sys, os, json
sys.path.insert(0, os.path.dirname(__file__))
from k import *
C = {'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Vulcanii', 'Ce sunt']}], 'fisiere': [{'nume': 'Plante_6A_Pop.pptx', 'diapozitive': [{'aspect': 'Title Slide', 'texte': ['Plante']}]}]}
with Ham() as H:
    pg = H.app('powerpoint', C)
    taste(pg, 'Control+o'); clic(pg, 'backstage:Browse'); ev(pg)
    for k in ['Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Alt+n']:
        print(pas(pg, k))
    pg.keyboard.type('Plante_6A_Pop.pptx'); pg.wait_for_timeout(100); ev(pg)
    print(pas(pg, 'Alt+o'))
    print(S(pg, 'prezentare_activa', 'prezentari_deschise', 'dialog'))
    print(H.erori)
