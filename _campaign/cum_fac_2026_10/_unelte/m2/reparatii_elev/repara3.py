"""Runda 3 (recitire): „scrie” ambiguu (tastezi / e scris) la Windows Security; exemplul din rezultatul legaturii = cel din pasul 1."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.insert(0, 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reparatii_elev')
from forma import citeste, scrie

W = 'fise_m2_windows.json'
w = citeste(W)
v = ' Pe Windows în engleză scrie numele ei englezesc, <code>Windows Security</code>.'
n = ' Pe Windows în engleză tastezi în loc numele ei englezesc: <code>Windows Security</code>.'
for fid in ('windows-securitate-stare-antivirus', 'windows-securitate-istoric-protectie'):
    f = next(x for x in w if x['id'] == fid)
    assert f['pasi'][0].endswith(v), 'OPRIT: ' + fid
    f['pasi'][0] = f['pasi'][0][:-len(v)] + n
f = next(x for x in w if x['id'] == 'windows-browser-legatura')
assert f['rezultat'] == 'Se deschide pagina spre care duce legătura, de exemplu pagina lupului.', 'OPRIT: legatura'
f['rezultat'] = 'Se deschide pagina spre care duce legătura, de exemplu lecția pe al cărei titlu ai dat clic.'
scrie(W, w)
print('runda 3 scrisa')
