# Reparatiile din judecata_m2.json (11.10.2026) + 2 fise noi (acoperire_m2 nr. 39 si 107).
# Lucreaza pe text: inlocuieste DOAR blocurile fiselor schimbate, restul fisierului ramane byte cu byte.
# Ruleaza: python -I repara.py            (scrie)   |   python -I repara.py --proba   (nu scrie)
import json, sys, copy, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
SURSA = 'C:/00/Projects/LearningHub/cum-fac/_sursa/'
F_WIN = SURSA + 'fise_m2_windows.json'
F_AUD = SURSA + 'fise_m2_audio_evaluari.json'
PROBA = '--proba' in sys.argv

INCHIDE_FILA = 'Când ai terminat, închide fila ta cu <b>×</b> de pe ea: fila în care citești pașii rămâne deschisă.'
ACOPERA = 'Fila nouă acoperă pagina cu pașii: scrie întâi în caiet ce cauți, apoi apasă +.'
CLIPCHAMP_CONT = ('Clipchamp cere cont Microsoft: fișa presupune că ai deschis editorul, cu un film. '
                  'La lecția 11 nu-l pornești: îl recunoști din poze.')


def schimba(fise, id_, **campuri):
    for x in fise:
        if x['id'] == id_:
            for k, v in campuri.items():
                assert k in x, (id_, k)
                x[k] = v
            return x
    raise KeyError(id_)


def gaseste(fise, id_):
    return next(x for x in fise if x['id'] == id_)


def inlocuieste_in_lista(lista, vechi, nou):
    assert lista.count(vechi) == 1, (vechi, lista)
    lista[lista.index(vechi)] = nou


def repara_windows(W):
    # 1) windows-browser-cautare-bara-adrese — G8 MEDIU: inchiderea filei + fila noua acopera pasii
    x = gaseste(W, 'windows-browser-cautare-bara-adrese')
    assert len(x['pasi']) == 4
    x['pasi'].append(INCHIDE_FILA)
    x['atentie'] = ACOPERA + ' ' + x['atentie']

    # 2) windows-browser-cuvinte-cheie — G8 MEDIU, G3 MINOR (lup/urs), G7 MINOR (formulare de continut)
    x = gaseste(W, 'windows-browser-cuvinte-cheie')
    x['pasi'][3] = ('Deschide o filă nouă: clic pe <b>+</b>, în dreapta filelor. Scrie cuvintele în bara de adrese, '
                    'de exemplu <code>urs brun hrană</code>, și apasă <kbd>Enter</kbd>. Nu știi încă să scrii ă? '
                    'Scrie a: de obicei merge și așa.')
    x['pasi'][4] = ('Rezultatele nu-ți răspund? Reformulează: schimbi un cuvânt, adaugi unul sau încerci în engleză. '
                    'Un clic în bara de adrese selectează tot ce era scris: scrii direct peste.')
    x['pasi'].append(INCHIDE_FILA)
    x['atentie'] = ('Fila nouă acoperă pagina cu pașii: scrie întâi în caiet cuvintele, apoi apasă +. '
                    + x['atentie'])
    inlocuieste_in_lista(x['formulari'], 'ce mananca ursul brun', 'cum caut ce mananca ursul brun')

    # 3) windows-browser-cautare-imagini — G8 MEDIU
    x = gaseste(W, 'windows-browser-cautare-imagini')
    x['pasi'][0] = ('Deschide o filă nouă: clic pe <b>+</b>, în dreapta filelor. Scrie cuvintele în bara de adrese '
                    'și apasă <kbd>Enter</kbd>.')
    x['pasi'].append(INCHIDE_FILA)
    x['atentie'] = ACOPERA

    # 4) windows-browser-cautare-ghilimele — G8 MEDIU + G3 MINOR (Enter inainte sa stii ghilimeaua)
    x = gaseste(W, 'windows-browser-cautare-ghilimele')
    x['pasi'] = [
        'Citește întâi cum scrii ghilimeaua dreaptă <code>"</code>: ține apăsată <kbd>Shift</kbd> și apasă tasta de '
        'lângă <kbd>Enter</kbd> pe care e desenat semnul <code>"</code>.',
        'Dacă apare Ț, tastatura e pe română: șterge-l cu <kbd>Backspace</kbd> (tasta lungă de deasupra lui '
        '<kbd>Enter</kbd>, cu săgeata ←), apoi ține apăsate <kbd>Shift</kbd> și <kbd>AltGr</kbd> (în dreapta barei '
        'de spațiu) și apasă aceeași tastă.',
        'Dacă după ghilimea nu apare nimic, nu o apăsa din nou: apasă o dată bara de spațiu și apare ghilimeaua. '
        'La ghilimeaua de la sfârșit faci la fel.',
        'Scrie în caiet ce cauți, cu ghilimele drepte, de exemplu <code>"capra cu trei iezi" poveste</code>: '
        'fila nouă va acoperi pașii.',
        'Deschide o filă nouă: clic pe <b>+</b>, în dreapta filelor. Scrie în bara de adrese ce ai în caiet, '
        'cu ghilimelele, și apasă <kbd>Enter</kbd>.',
        'Uită-te în caseta motorului de căutare: ghilimelele sunt acolo?',
        INCHIDE_FILA,
    ]

    # 5) windows-browser-alegere-rezultat — G8 MINOR
    x = gaseste(W, 'windows-browser-alegere-rezultat')
    x['pasi'].append('Când ai găsit ce căutai, închide fila ta cu <b>×</b> de pe ea: fila în care citești pașii '
                     'rămâne deschisă.')
    assert x['atentie'] == ''
    x['atentie'] = 'Caută într-o filă nouă (+), nu peste pagina cu pașii: așa ea rămâne deschisă în fila ei.'

    # 6) windows-browser-fereastra-falsa — G2 MEDIU (plasa „Părăsiți site-ul?”), G7 MINOR (exercitiul Ctrl+T)
    x = gaseste(W, 'windows-browser-fereastra-falsa')
    assert x['pasi'][3].startswith('Exersezi și din tastatură')
    x['pasi'][3] = 'Altfel, din tastatură, cu fila falsă în față: <kbd>Ctrl</kbd>+<kbd>W</kbd> o închide.'
    x['atentie'] = ('Ctrl+W închide fila din față: dacă în față e lecția sau pagina cu pașii, se închide chiar ea. '
                    'Folosește-l doar cu fila falsă în față.')

    # 7) windows-browser-redeschidere-fila — G3 MINOR (pasul 3 valabil doar dupa pasul 2)
    x = gaseste(W, 'windows-browser-redeschidere-fila')
    assert len(x['pasi']) == 3
    x['pasi'] = [
        x['pasi'][0],
        'Ai închis toată fereastra browserului? Pornește-l din Start: scrie <code>edge</code> și dă clic pe '
        '<b>Microsoft Edge</b>. Apoi apasă <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd>. Numai în acest caz, '
        'închide cu X fereastra în care nu e lecția (dacă sunt două, pe amândouă).',
    ]

    # 8) windows-securitate-istoric-protectie — G3 MEDIU (conditia „cand sus apare” + iesirea cu Esc)
    x = gaseste(W, 'windows-securitate-istoric-protectie')
    x['pasi'][0] = ('Apasă <b>Start</b> (tasta cu sigla Windows), scrie <code>securitate</code> și apasă '
                    '<kbd>Enter</kbd> când sus apare <b>Securitate Windows (Windows Security)</b>.')
    x['atentie'] = 'Nu schimbi nimic: calculatorul e al tuturor. Nu apare Securitate Windows? Apasă Esc și nu deschide altceva.'

    # 9) windows-scanare-microsoft-defender — G8 MEDIU (avertismentul de laborator)
    x = gaseste(W, 'windows-scanare-microsoft-defender')
    x['atentie'] = ('Doar citești rezultatul: nu schimbi nicio setare și nu oprești nimic, calculatorul e al tuturor. '
                    + x['atentie'])

    # 10) windows-cos-restaurare — G3 MEDIU (micsorezi browserul in care citesti pasii)
    x = gaseste(W, 'windows-cos-restaurare')
    assert len(x['pasi']) == 4
    x['pasi'] = [
        'Citește întâi toți pașii: după ce micșorezi browserul, nu-i mai vezi.',
        'Ca să vezi desktopul, micșorează cu liniuța ferestrele deschise: Explorer și fereastra browserului '
        'în care citești pașii.',
        x['pasi'][1], x['pasi'][2], x['pasi'][3],
        'Adu înapoi fereastra browserului: un clic pe pictograma ei din bara de activități.',
    ]
    x['atentie'] = ('Nu vezi Coșul pe desktop? Adu înapoi fereastra browserului (pasul 6) și lasă fișierul în Coș. '
                    + x['atentie'])

    # 11) windows-clic-dreapta-comenzi-fisier — G8 MINOR
    x = gaseste(W, 'windows-clic-dreapta-comenzi-fisier')
    x['pasi'][1] = ('În meniu e un rând de butoane mici, sus sau jos, lângă săgeata mouse-ului: pictograme, fără nume '
                    'scris. Printre ele: <b>Decupare</b> (foarfeca), <b>Copiere</b>, <b>Redenumire</b> și '
                    '<b>Ștergere</b> (coșul).')
    assert x['atentie'] == ''
    x['atentie'] = 'În laborator folosești comenzile doar în folderul tău: nu deschizi, nu muți și nu ștergi fișierele altora.'

    # 12) windows-copiere-lipire — G1 MINOR
    x = gaseste(W, 'windows-copiere-lipire')
    assert x['atentie'].startswith('Din folderele lui Windows, de exemplu C:\\Windows\\Media')
    x['atentie'] = ('Din folderul Media al lui Windows (C:\\Windows\\Media) doar copiezi: nu muți și nu ștergi nimic. '
                    'Fișierele altora nu le deschizi și nu le atingi.')

    # 13) windows-cautare-fisier-explorer — G8 MINOR
    x = gaseste(W, 'windows-cautare-fisier-explorer')
    x['atentie'] = x['atentie'] + ' În laborator, din rezultate deschizi doar fișierele tale.'

    # 14) windows-stergere-fisier — dublura cu windows-stergere-fisier-descarcat (G7 MEDIU)
    x = gaseste(W, 'windows-stergere-fisier')
    x['pasi'][0] = ('În Explorer, intră în folderul tău și selectează fișierul sau folderul pe care vrei să-l ștergi: '
                    'un clic pe el.')
    inlocuieste_in_lista(x['formulari'], 'sterg fisierul descarcat', 'sterg un fisier din folderul meu')
    x['inrudite'] = x['inrudite'] + ['windows-stergere-fisier-descarcat']

    # 15) Fise noi: acoperire_m2 nr. 39 si 107
    W.append({
        'id': 'windows-inchidere-meniu-start',
        'aplicatie': 'windows',
        'titlu': 'Închizi meniul Start cu încă un clic pe butonul Start',
        'intrebare': 'Cum închid meniul Start fără să pornesc nimic?',
        'scurtatura': '',
        'pasi': [
            'Ai deschis meniul Start cu un clic pe butonul <b>Start</b> și te-ai uitat la aplicațiile din el, '
            'fără să pornești vreuna.',
            'Dă clic din nou pe butonul <b>Start</b>, același pe care l-ai apăsat ca să deschizi meniul.',
        ],
        'rezultat': 'Meniul Start se închide, fără să pornească vreo aplicație.',
        'atentie': 'Te uiți la aplicații fără să dai clic pe ele: un clic pe una o pornește.',
        'termeni': [{'t': 'meniul Start', 'd': 'lista cu aplicații care se deschide cu un clic pe butonul Start'}],
        'captura': None,
        'formulari': ['cum inchid meniul start', 'inchid start', 'close start menu', 'am deschis start din greseala',
                      'cum ascund meniul start', 'meniul start nu dispare', 'cum scap de lista cu aplicatii',
                      'inchidere meniu start', 'inchd startul', 'apas iar pe start', 'start ul a ramas deschis',
                      'cum fac sa dispara meniul de jos'],
        'cuvinte': ['meniul Start', 'Start', 'butonul Start', 'închidere', 'Start menu'],
        'sursa': {'cale': 'lectii/v/m2-l13/', 'pas': 'real', 'titlu_pas': 'Acum la calculatorul din laborator',
                  'ancora': 'Apoi închide meniul Start: clic din nou pe butonul Start.'},
        'clasa': 'a V-a',
        'lectia': 13,
        'inrudite': ['windows-pornire-aplicatie-start', 'windows-inchidere-meniu-esc'],
    })
    W.append({
        'id': 'windows-inchidere-meniu-esc',
        'aplicatie': 'windows',
        'titlu': 'Închizi cu tasta Esc meniul deschis cu clic dreapta',
        'intrebare': 'Cum închid meniul de clic dreapta fără să aleg nimic din el?',
        'scurtatura': 'Esc',
        'pasi': [
            'Ai deschis un meniu cu clic dreapta, de exemplu pe un fișier în File Explorer, și nu vrei să alegi '
            'nimic din el.',
            'Apasă tasta <kbd>Esc</kbd>, din colțul din stânga sus al tastaturii.',
        ],
        'rezultat': 'Meniul se închide și nu s-a ales nicio comandă din el.',
        'atentie': ('De exemplu, găsești în meniu Scanați cu Microsoft Defender..., dar nu vrei să scanezi încă: '
                    'nu-l apeși, închizi meniul cu Esc.'),
        'termeni': [{'t': 'clic dreapta', 'd': 'un clic cu butonul din dreapta al mouse-ului'}],
        'captura': None,
        'formulari': ['cum inchid meniul de clic dreapta', 'inchid meniul fara sa aleg nimic', 'tasta esc',
                      'escape meniu', 'close menu', 'am deschis un meniu din greseala', 'cum scap de meniul aparut',
                      'm am razgandit nu vreau nimic din meniu', 'meniul de click dreapta nu dispare', 'inchd meniul',
                      'cum ies din meniu', 'renunt la meniu'],
        'cuvinte': ['Esc', 'Escape', 'meniu', 'închidere meniu', 'renunțare', 'clic dreapta'],
        'sursa': {'cale': 'lectii/vi/m2-l11/', 'pas': 'p6', 'titlu_pas': 'Verifici un stick sau un fișier',
                  'ancora': 'dar nu-l apăsa încă: închide meniul cu [Esc].'},
        'clasa': 'a VI-a',
        'lectia': 11,
        'inrudite': ['windows-clic-dreapta-comenzi-fisier', 'windows-scanare-microsoft-defender',
                     'windows-inchidere-meniu-start'],
    })


def repara_audio(A):
    # windows-stergere-fisier-descarcat — G7 MEDIU (dublura): gestul ei, la sfarsitul orei, din Descarcari
    x = gaseste(A, 'windows-stergere-fisier-descarcat')
    x['titlu'] = 'Ștergi din Descărcări, la sfârșitul orei, ce ai descărcat la lecție'
    x['intrebare'] = 'Cum șterg la sfârșitul orei fișierul descărcat la lecție?'
    x['pasi'][0] = 'La sfârșitul orei, deschide Explorer: dosarul galben din bara de activități, jos.'
    x['rezultat'] = 'Fișierul nu mai e în Descărcări (Downloads): a plecat în Coș de reciclare.'
    x['atentie'] = ('Lasă calculatorul cum l-ai găsit: ștergi doar ce ai descărcat tu la lecție. '
                    'Coșul nu-l golești: acolo pot fi și fișierele altora.')
    for vechi, nou in [('delete fisier', 'delete fisier descarcat'),
                       ('stergere fisier windows', 'stergere fisier din descarcari'),
                       ('cum arunc un fisier', 'cum arunc sunetul descarcat la cos'),
                       ('sterge fisier din explorer', 'sterg la sfarsitul orei ce am descarcat'),
                       ('strg fisierul', 'strg fisierul descarcat')]:
        inlocuieste_in_lista(x['formulari'], vechi, nou)
    x['inrudite'] = ['windows-stergere-fisier'] + x['inrudite']

    # audio-clipchamp-cap-redare — G3 MEDIU (cont, editor deschis) + G5 MINOR (termenul linia de timp)
    x = gaseste(A, 'audio-clipchamp-cap-redare')
    x['atentie'] = CLIPCHAMP_CONT + ' ' + x['atentie']
    x['termeni'].append({'t': 'linia de timp', 'd': 'jos în Clipchamp: materialele filmului, pe rânduri numite piste: '
                                                    'imagini (video), sunete (audio), text'})

    # audio-clipchamp-redare — G3 MEDIU
    x = gaseste(A, 'audio-clipchamp-redare')
    x['atentie'] = CLIPCHAMP_CONT + ' ' + x['atentie']

    # audio-clipchamp-zone — aceeasi presupunere, spusa la fel (cererea: „Clipchamp: spui ce presupune fisa”)
    x = gaseste(A, 'audio-clipchamp-zone')
    assert x['atentie'] == 'Clipchamp, editorul video din Windows 11, cere cont Microsoft.'
    x['atentie'] = ('Clipchamp, editorul video din Windows 11, cere cont Microsoft: fișa presupune că ai deschis '
                    'editorul, cu un film. La lecția 11 nu-l pornești: îl recunoști din poze.')

    # audio-audacity-inceput-sfarsit — G3 MINOR (stinsi cat merge sunetul)
    x = gaseste(A, 'audio-audacity-inceput-sfarsit')
    x['pasi'][0] = ('Cu sunetul oprit (singur sau cu ■ <b>Stop</b>), apasă |◀ (<b>Început</b>): capul de redare '
                    'ajunge la începutul sunetului.')
    assert x['atentie'] == ''
    x['atentie'] = 'Cât merge sunetul, |◀ și ▶| sunt stinși: apasă întâi ■ Stop.'

    # audio-audacity-redare — G5 MINOR (termenul unda)
    x = gaseste(A, 'audio-audacity-redare')
    x['termeni'].append({'t': 'undă', 'd': 'desenul sunetului: unde e înaltă, sunetul e tare; unde e aproape o linie, e liniște'})


# ---------- scrierea, fara sa ating restul fisierului ----------
def j(v):
    return json.dumps(v, ensure_ascii=False)


def ser_win(x):
    L = [' {']
    for k in ['id', 'aplicatie', 'titlu', 'intrebare', 'scurtatura']:
        L.append(f'  "{k}": {j(x[k])},')
    L.append('  "pasi": [')
    L.append(',\n'.join('   ' + j(p) for p in x['pasi']))
    L.append('  ],')
    L.append(f'  "rezultat": {j(x["rezultat"])},')
    L.append(f'  "atentie": {j(x["atentie"])},')
    if x['termeni']:
        L.append('  "termeni": [')
        L.append(',\n'.join('   ' + j(t) for t in x['termeni']))
        L.append('  ],')
    else:
        L.append('  "termeni": [],')
    for k in ['captura', 'formulari', 'cuvinte', 'sursa', 'clasa', 'lectia']:
        L.append(f'  "{k}": {j(x[k])},')
    L.append(f'  "inrudite": {j(x["inrudite"])}')
    L.append(' }')
    return '\n'.join(L)


def bloc(raw, id_):
    a = raw.index('\n {\n  "id": ' + j(id_) + ',') + 1
    b = raw.index('\n }', a) + 3
    assert json.loads(raw[a:b])['id'] == id_
    return a, b


def scrie(cale, vechi, noi, ser):
    raw = open(cale, encoding='utf-8', newline='').read()
    assert json.loads(raw) == vechi
    ids_vechi = [x['id'] for x in vechi]
    schimbate = [n for n, v in zip(noi, vechi) if n != v]
    for x in schimbate:
        a, b = bloc(raw, x['id'])
        raw = raw[:a] + ser(x) + raw[b:]
    adaugate = noi[len(vechi):]
    if adaugate:
        k = raw.rindex('\n }') + 3
        raw = raw[:k] + ''.join(',\n' + ser(x) for x in adaugate) + raw[k:]
    assert json.loads(raw) == noi, 'rezultatul nu e ce voiam'
    assert [x['id'] for x in noi][:len(ids_vechi)] == ids_vechi, 'id-uri schimbate'
    print(cale.split('/')[-1], 'schimbate:', [x['id'] for x in schimbate], 'adaugate:', [x['id'] for x in adaugate])
    if not PROBA:
        open(cale, 'w', encoding='utf-8', newline='').write(raw)


def ser_aud(x):   # fisierul audio e json.dump(indent=1): blocul are aceeasi forma
    s = json.dumps(x, ensure_ascii=False, indent=1)
    return '\n'.join(' ' + r for r in s.split('\n'))


W0 = json.load(open(F_WIN, encoding='utf-8'))
A0 = json.load(open(F_AUD, encoding='utf-8'))
W, A = copy.deepcopy(W0), copy.deepcopy(A0)
repara_windows(W)
repara_audio(A)

# probe inainte de scriere
for x in W + A:
    assert len(x['titlu']) <= 70, (x['id'], len(x['titlu']))
    assert 1 <= len(x['pasi']) <= 7, (x['id'], len(x['pasi']))
    assert 8 <= len(x['formulari']) <= 15, x['id']
    assert not any(c in j(x) for c in 'şţŞŢ'), x['id']
toate = {}
import glob, os
for f in glob.glob(SURSA + 'fise_*.json'):
    nume = os.path.basename(f)
    lista = W if nume == 'fise_m2_windows.json' else A if nume == 'fise_m2_audio_evaluari.json' else json.load(open(f, encoding='utf-8'))
    for x in lista:
        for fo in x['formulari']:
            toate.setdefault(fo.strip().lower(), set()).add(x['id'])
dubla = {fo: ids for fo, ids in toate.items() if len(ids) > 1}
noi_ids = {'windows-inchidere-meniu-start', 'windows-inchidere-meniu-esc', 'windows-stergere-fisier',
           'windows-stergere-fisier-descarcat', 'windows-browser-cuvinte-cheie'}
for fo, ids in dubla.items():
    if ids & noi_ids:
        print('FORMULARE DUBLA (atinsa de mine):', fo, ids)

scrie(F_WIN, W0, W, ser_win)
scrie(F_AUD, A0, A, ser_aud)
print('PROBA' if PROBA else 'SCRIS')
