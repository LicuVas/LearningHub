"""Runda 2 (recitirea mea): liniuta NU e langa X (V/8 p5: liniuta, patratul, X); Atentia zonelor Clipchamp fara afirmatii in plus."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.insert(0, 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reparatii_elev')
from forma import citeste, scrie

W, A = 'fise_m2_windows.json', 'fise_m2_audio_evaluari.json'
w, a = citeste(W), citeste(A)
f = next(x for x in w if x['id'] == 'windows-cos-restaurare')
v = 'Liniuța (Minimizare) e în dreapta sus a fiecărei ferestre, lângă X.'
assert f['pasi'][1].endswith(v), 'OPRIT: pasul 2 al cosului s-a schimbat'
f['pasi'][1] = f['pasi'][1][:-len(v)] + ('Liniuța (Minimizare) e în dreapta sus a fiecărei ferestre, '
                                         'primul din cele trei butoane: liniuța, pătratul și X.')
g = next(x for x in a if x['id'] == 'audio-clipchamp-zone')
assert g['atentie'].startswith('Clipchamp e editorul video din Windows 11. Pe poză'), 'OPRIT: atentia zonelor s-a schimbat'
g['atentie'] = 'Clipchamp e editorul video din Windows 11.'
scrie(W, w)
scrie(A, a)
print('runda 2 scrisa')
