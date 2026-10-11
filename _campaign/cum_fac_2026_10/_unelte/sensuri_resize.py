"""Corectura din feedback-ul profesorului (11.10.2026, „excel resize cell”): grupul „marime” era prea larg — „resize”
stătea lângă „mare/mic”, deci se potrivea cu orice fișă care conține „mare” (MAX = „cea mai mare valoare”, zoom…).
- scoate din „marime”: redimensionez, redimensionare, resize și cuvintele goale mare/mari/mic/mici (rămân „mai mare/mai mic”);
- „resize/redimensionez/dimensiune” intră în „latime” și „inaltime” (a redimensiona = a schimba lățimea/înălțimea).
Rulare: python sensuri_resize.py -> scrie cum-fac/_sursa/sensuri.json (păstrează formatul: indentare, CRLF)."""
import json

P = r'C:/00/Projects/LearningHub/cum-fac/_sursa/sensuri.json'
raw = open(P, 'rb').read()
crlf = b'\r\n' in raw
txt = raw.decode('utf-8')
ind = 2 if txt.startswith('{\n  ') or txt.startswith('{\r\n  ') else 1
s = json.loads(txt)
G = {g['id']: g for g in s['grupuri']}
scoase = ['redimensionez', 'redimensionare', 'resize', 'mare', 'mari', 'mic', 'mici', 'dimensiune', 'dimensiunea', 'dimensiuni']
G['marime']['cuvinte'] = [c for c in G['marime']['cuvinte'] if c not in scoase]
noi = ['redimensionez', 'redimensionezi', 'redimensionare', 'redimensionat', 'resize', 'dimensiune', 'dimensiunea', 'dimensiuni']
for gid in ('latime', 'inaltime'):
    for c in noi:
        if c not in G[gid]['cuvinte']:
            G[gid]['cuvinte'].append(c)
out = json.dumps(s, ensure_ascii=False, indent=ind)
if crlf:
    out = out.replace('\n', '\r\n')
open(P, 'wb').write((out + ('\r\n' if crlf else '\n') if raw.endswith(b'\n') else out).encode('utf-8'))
print('marime:', G['marime']['cuvinte'])
print('latime:', G['latime']['cuvinte'][-8:])

# pasul 2 (după prima măsurare): „încape” e alt sens (textul să încapă: lățime SAU încadrare), nu „lățime” — grup separat
INC = ['încape', 'să încapă', 'nu încape']
G['latime']['cuvinte'] = [c for c in G['latime']['cuvinte'] if c not in INC]
if 'incape' not in G:
    s['grupuri'].append({'id': 'incape', 'cuvinte': INC})
out = json.dumps(s, ensure_ascii=False, indent=ind)
if crlf:
    out = out.replace('\n', '\r\n')
open(P, 'wb').write((out + ('\r\n' if crlf else '\n') if raw.endswith(b'\n') else out).encode('utf-8'))
print('incape separat:', INC)
