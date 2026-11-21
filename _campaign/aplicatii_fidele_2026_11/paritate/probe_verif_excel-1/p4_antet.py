# Verificatorul excel-1, a treia trecere: Sort › My data has headers (lista Sort by cu și fără antet) și butoanele barei fx în editare.
import sys, json
sys.path.insert(0, r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-1')
from comun import *
REZ = {}
C = {'A1': 'Elev', 'B1': 'Nota', 'A2': 'Dan', 'B2': 8, 'A3': 'Ana', 'B3': 9, 'A4': 'Bogdan', 'B4': 7}
def sortby(pg, debifeaza):
    deschide(pg, {'celule': C, 'selectie': 'A2'})
    clic(pg, 'fila:Data'); clic(pg, 'panglica:Data/Sort & Filter/Sort...'); pg.wait_for_timeout(300)
    if debifeaza:
        clic(pg, 'fereastra:My data has headers'); pg.wait_for_timeout(700)
    k = 'F014.' + ('fara' if debifeaza else 'cu')
    scrie(pg, REZ, k + '.selectie', stare(pg)['selectie'])
    inainte = set(tinte(pg)); clic(pg, 'camp:Sort by'); pg.wait_for_timeout(300)
    opt = [x for x in tinte(pg) if x not in inainte]; scrie(pg, REZ, k + '.optiuni', opt)
    alege = [x for x in opt if x.endswith('Elev') or x.endswith('Column A')]
    if alege:
        clic(pg, alege[0]); pg.wait_for_timeout(700)
    clic(pg, 'fereastra:OK'); pg.wait_for_timeout(300)
    s = stare(pg); scrie(pg, REZ, k + '.dupa', {'dialog': s['dialog'], 'A': [(s['celule'].get(a) or {}).get('text') for a in ('A1', 'A2', 'A3', 'A4')]})
with poligon() as pg:
    sortby(pg, False); sortby(pg, True)
    deschide(pg, {'celule': {'B2': 2, 'C2': 3}, 'selectie': 'D2'})
    clic(pg, 'celula:D2'); clic(pg, 'bara_formule'); pg.keyboard.type('=B2*C2'); pg.wait_for_timeout(200)
    scrie(pg, REZ, 'F102.butoane_fx', pg.evaluate("""() => [...document.querySelectorAll('[data-lh-aplicatie=excel] [data-lh-eticheta]')].map(x => x.getAttribute('data-lh-eticheta')).filter(t => /^(Enter|Cancel|Insert Function)$/.test(t))"""))
with open(r'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate/probe_verif_excel-1/rezultate_joc3.json', 'w', encoding='utf-8') as f:
    json.dump(REZ, f, ensure_ascii=False, indent=1)
