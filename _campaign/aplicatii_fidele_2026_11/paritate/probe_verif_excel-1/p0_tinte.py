import sys, json; sys.path.insert(0, r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-1')
from comun import *
with poligon() as pg:
    deschide(pg, {'celule': {'A1': 'Elev', 'B1': 'Nota', 'A2': 'Ana', 'B2': 9}, 'selectie': 'A1'})
    t = tinte(pg)
    print(len(t)); print([x for x in t if not x.startswith('celula:') and not x.startswith('antet_')])
    print(sorted(stare(pg).keys()))
