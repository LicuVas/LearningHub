"""Verifică dacă întrebările din seturile ASCUNSE au ajuns în dicționarul de sensuri (mai ales lista „neacoperite” din
afara materiei, lărgită de reglorul nr. 3). Raportează: întrebări ascunse care apar ÎNTREGI în sensuri.json și intrări
din sensuri.json de ≥ 3 cuvinte care sunt egale cu o întrebare ascunsă. Ultima linie = numărul de suprapuneri."""
import json, re, unicodedata

A = r'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_ascuns/'
S = r'C:/00/Projects/LearningHub/cum-fac/_sursa/sensuri.json'


def n(s):
    s = unicodedata.normalize('NFD', str(s).lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9 ]', ' ', s)).strip()


def siruri(o):
    if isinstance(o, str):
        yield o
    elif isinstance(o, list):
        for x in o:
            yield from siruri(x)
    elif isinstance(o, dict):
        for k, v in o.items():
            if k != 'despre':
                yield from siruri(v)


intrari = {n(x) for x in siruri(json.load(open(S, encoding='utf-8'))) if len(n(x).split()) >= 3}
text_tot = ' | '.join(sorted(intrari))
sup = 0
for f in ('set_ascuns.json', 'set_ascuns_m2.json'):
    for q in json.load(open(A + f, encoding='utf-8')):
        qn = n(q['q'])
        if qn in intrari or (len(qn.split()) >= 4 and qn in text_tot):
            print('SUPRAPUNERE', f, '|', q['q'], '|', q['tip']); sup += 1
print('intrări de ≥3 cuvinte în sensuri:', len(intrari))
print(sup)
