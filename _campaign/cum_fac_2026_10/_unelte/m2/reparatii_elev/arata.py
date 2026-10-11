"""Arata fisele cu INCURCA/BLOCAJ din probele de elev (m2), complet."""
import json, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
B = 'C:/00/Projects/LearningHub/'
SURSE = [B + 'cum-fac/_sursa/fise_m2_windows.json', B + 'cum-fac/_sursa/fise_m2_audio_evaluari.json']
IDS = sys.argv[1:] or [
    'audio-audacity-deschidere-sunet', 'audio-clipchamp-zone', 'audio-clipchamp-cap-redare',
    'audio-clipchamp-redare', 'windows-folder-nou', 'windows-cos-restaurare',
    'windows-browser-redeschidere-fila', 'windows-browser-cautare-ghilimele',
    'windows-scanare-microsoft-defender', 'windows-stergere-fisier-descarcat',
    'windows-cautare-fisier-explorer', 'windows-browser-legatura',
    'windows-securitate-stare-antivirus', 'windows-securitate-istoric-protectie']
for s in SURSE:
    for f in json.load(open(s, encoding='utf-8')):
        if f['id'] in IDS:
            print('=' * 70)
            print(s.split('/')[-1], '|', f['id'])
            for k in ('titlu', 'intrebare', 'scurtatura'):
                print(k + ':', f.get(k))
            for i, p in enumerate(f['pasi'], 1):
                print('  P%d: %s' % (i, p))
            print('rezultat:', f['rezultat'])
            print('atentie:', f['atentie'])
            print('termeni:', json.dumps(f['termeni'], ensure_ascii=False))
            print('captura:', json.dumps(f['captura'], ensure_ascii=False))
            print('cuvinte:', f['cuvinte'])
            print('sursa:', json.dumps(f['sursa'], ensure_ascii=False))
            print('clasa/lectia:', f['clasa'], f['lectia'])
            extra = [k for k in f if k not in ('id', 'aplicatie', 'titlu', 'intrebare', 'scurtatura', 'pasi', 'rezultat', 'atentie', 'termeni', 'captura', 'formulari', 'cuvinte', 'sursa', 'clasa', 'lectia', 'inrudite')]
            if extra:
                print('ALTE CHEI:', {k: f[k] for k in extra})
