import sys, json; sys.path.insert(0, r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-1')
from comun import *
with poligon() as pg:
    deschide(pg, {'celule': {'A1': 'Elev', 'B1': 'Nota', 'A2': 'Ana', 'B2': 9, 'A3': 'Dan', 'B3': 7}, 'selectie': 'A1'})
    clic(pg, 'fila:Insert'); print([x for x in tinte(pg, 'Insert/')])
    clic(pg, 'fila:Data'); print([x for x in tinte(pg, 'Data/')])
    clic(pg, 'fila:Insert')
    md = [x for x in tinte(pg, 'meniu_derulant:Insert/') if 'Column' in x]
    print(md)
    clic(pg, md[0]); print(tinte(pg, 'meniu:'))
