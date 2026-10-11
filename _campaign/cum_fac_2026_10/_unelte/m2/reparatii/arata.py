# Arata fisele cerute (id-uri ca argumente) intr-o forma compacta, ca sa le pot repara.
import json, sys
SURSA = 'C:/00/Projects/LearningHub/cum-fac/_sursa/'
fise = {}
for f in ['fise_m2_windows.json', 'fise_m2_audio_evaluari.json']:
    for x in json.load(open(SURSA + f, encoding='utf-8')):
        fise[x['id']] = (f, x)
ids = sys.argv[1:] or list(fise)
for i in ids:
    f, x = fise[i]
    print('=' * 8, i, '|', f)
    print('TITLU:', x['titlu'], '| Q:', x['intrebare'], '| SC:', x['scurtatura'])
    for n, p in enumerate(x['pasi'], 1):
        print(f'  {n}. {p}')
    print('REZ:', x['rezultat'])
    print('ATENTIE:', x['atentie'])
    print('TERMENI:', '; '.join(t['t'] + '=' + t['d'] for t in x['termeni']))
    print('CAPT:', (x['captura'] or {}).get('src'))
    print('FORM:', ' | '.join(x['formulari']))
    print('CUV:', ' | '.join(x['cuvinte']))
    s = x['sursa']
    print('SURSA:', s['cale'], s['pas'], '«' + s['ancora'] + '»')
    print('INRUD:', x['inrudite'])
