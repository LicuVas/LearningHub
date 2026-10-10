"""Catalogul titlurilor pentru scriitorii setului de test: DOAR id, aplicatie, titlu, clasa, lectia (fără formulări,
fără pași, fără cuvinte-cheie), ca setul să nu copieze vorbele fișelor. Scrie _campaign/cum_fac_2026_10/catalog_titluri.json.
Ultima linie = numărul de fișe."""
import json, glob, os

SURSA = r'C:/00/Projects/LearningHub/cum-fac/_sursa'
OUT = r'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/catalog_titluri.json'
cat = []
for f in sorted(glob.glob(os.path.join(SURSA, 'fise_*.json'))):
    for x in json.load(open(f, encoding='utf-8')):
        cat.append({'id': x['id'], 'aplicatie': x['aplicatie'], 'titlu': x['titlu'], 'clasa': x['clasa'], 'lectia': x['lectia']})
cat.sort(key=lambda x: (x['aplicatie'], x['id']))
json.dump(cat, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
from collections import Counter
print(dict(Counter(x['aplicatie'] for x in cat)))
print(len(cat))
