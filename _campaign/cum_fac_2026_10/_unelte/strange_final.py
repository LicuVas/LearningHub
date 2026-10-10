"""Strânge, pe grupuri de fișe, tot ce e încă de reparat după judecata 2 și elevul de probă:
_verificare/judecata2_*.json (deschise), _proba_elev/raport_clasa_*.json (INCURCA/BLOCAJ), constatări ale dirijorului.
Scrie _verificare/final_<grup>.json. Ultima linie = numărul total de puncte."""
import json, glob, os

B = r'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10'
SURSA = r'C:/00/Projects/LearningHub/cum-fac/_sursa'
grup = {}
for f in glob.glob(os.path.join(SURSA, 'fise_*.json')):
    g = os.path.basename(f)[5:-5]
    for x in json.load(open(f, encoding='utf-8')):
        grup[x['id']] = g
puncte = {g: [] for g in set(grup.values())}

def pune(i, p):
    g = grup.get(i)
    if g is None:
        print('id necunoscut', i); return
    puncte[g].append(p)

for f in glob.glob(os.path.join(B, '_verificare', 'judecata2_*.json')):
    for d in json.load(open(f, encoding='utf-8')).get('deschise', []):
        pune(d['id'], {'din': 'judecata2', **d})
for f in glob.glob(os.path.join(B, '_proba_elev', 'raport_clasa_*.json')):
    r = json.load(open(f, encoding='utf-8'))
    for x in r['fise']:
        if x['verdict'] != 'OK':
            pune(x['id'], {'din': 'elev de probă, ' + r['profil'], 'gravitate': 'GRAV' if x['verdict'] == 'BLOCAJ' else 'MEDIU',
                           'verdict': x['verdict'], 'pas': x.get('pas'), 'citat': x.get('citat'), 'problema': x.get('problema')})
# constatarea dirijorului (afirmatii_word.json + afirmatii.json VII/6 și VII/9)
pune('word-margini-particularizate', {'din': 'dirijor (afirmații probate)', 'gravitate': 'GRAV', 'regula': 'G1',
     'problema': 'Fișa spune că la margini merge și cu punct (0.5). Lecția VII/9 a PROBAT pe Windows cu setări românești: „0.5” la o margine din Page Setup dă „This is not a valid measurement.”, cu virgulă („0,5”) merge (lectii/vii/m2-l09/afirmatii.json A17, A28).',
     'reparatie': 'La margini: scrie cu virgulă (0,5). Varianta cu punct NU se dă ca alternativă care merge pe setări românești; dacă rămâne, doar „pe un calculator cu setări englezești”, cum o condiționează lecția VII/9.'})
pune('word-alineat-primul-rand', {'din': 'dirijor (afirmații probate)', 'gravitate': 'MINOR', 'regula': 'G1',
     'problema': 'Fereastra Paragraf primește și 1.25 cu punct (PROBAT, lectii/vii/m1-l06/afirmatii.json), dar fereastra de margini nu (VII/9). Fișa poate păstra „merge și cu punct” DOAR pentru fereastra Paragraf; să nu sugereze că e o regulă generală.',
     'reparatie': 'Păstrezi, cu precizarea „în fereastra Paragraf”.'})
tot = 0
for g, p in puncte.items():
    json.dump(p, open(os.path.join(B, '_verificare', f'final_{g}.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(g, len(p)); tot += len(p)
print(tot)
