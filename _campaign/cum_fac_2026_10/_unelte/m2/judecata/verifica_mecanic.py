"""Verificari mecanice pentru judecata fiselor m2 (windows + audio).
Ruleaza: python -I verifica_mecanic.py
Tipareste: sedile (ş ţ), inrudite inexistente, numar formulari/pasi/lungime titlu,
termeni lipsa din glosarul comun, formulari dublate intre fise."""
import json, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
BAZA = 'C:/00/Projects/LearningHub/'
FISE = ['cum-fac/_sursa/fise_m2_windows.json', 'cum-fac/_sursa/fise_m2_audio_evaluari.json']
CATALOG = BAZA + '_campaign/cum_fac_2026_10/catalog_titluri.json'

catalog = {y['id'] for y in json.load(open(CATALOG, encoding='utf-8'))}
toate = []
for f in FISE:
    toate += json.load(open(BAZA + f, encoding='utf-8'))
ids_noi = {x['id'] for x in toate}

probleme = 0
form_loc = {}
for x in toate:
    s = json.dumps(x, ensure_ascii=False)
    sed = [c for c in s if c in 'şţŞŢ']
    if sed:
        print('SEDILA', x['id'], ''.join(sed)); probleme += 1
    lipsa = [i for i in x['inrudite'] if i not in catalog and i not in ids_noi]
    if lipsa:
        print('INRUDITE_LIPSA', x['id'], lipsa); probleme += 1
    nf, np_, lt = len(x['formulari']), len(x['pasi']), len(x['titlu'])
    if not (8 <= nf <= 15) or not (1 <= np_ <= 7) or lt > 70:
        print('NUMERE', x['id'], nf, np_, lt); probleme += 1
    if not x['intrebare'].endswith('?'):
        print('INTREBARE', x['id']); probleme += 1
    for fo in x['formulari']:
        form_loc.setdefault(fo.strip().lower(), []).append(x['id'])

for fo, unde in form_loc.items():
    if len(unde) > 1:
        print('FORMULARE_DUBLA', repr(fo), unde); probleme += 1

print(probleme)
