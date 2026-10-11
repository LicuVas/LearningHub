"""Compara copiile 'inainte_*' cu fisierele de acum: ce fise si ce campuri s-au schimbat."""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
U = 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reparatii_elev/'
S = 'C:/00/Projects/LearningHub/cum-fac/_sursa/'
for n in ('fise_m2_windows.json', 'fise_m2_audio_evaluari.json'):
    a = json.load(open(U + 'inainte_' + n, encoding='utf-8'))
    b = json.load(open(S + n, encoding='utf-8'))
    print(n, 'fise:', len(a), '->', len(b), '| id-uri identice si in aceeasi ordine:', [x['id'] for x in a] == [x['id'] for x in b])
    for x, y in zip(a, b):
        camp = [k for k in x if x[k] != y.get(k)] + [k for k in y if k not in x]
        if camp:
            print('  ', x['id'], camp)
