"""Reparatiile dupa proba cu elevi de proba (m2, 11.10.2026). Fiecare schimbare verifica intai textul vechi.
Nu schimba id-uri. Ruleaza o singura data (a doua oara se opreste: textul vechi nu mai e acolo)."""
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.insert(0, 'C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reparatii_elev')
from forma import citeste, scrie

W, A = 'fise_m2_windows.json', 'fise_m2_audio_evaluari.json'
fise = {W: citeste(W), A: citeste(A)}
dupa_id = {f['id']: (n, f) for n in fise for f in fise[n]}
ids_inainte = {n: [f['id'] for f in fise[n]] for n in fise}

CLIP_P1 = ('La lecția 11, Clipchamp îl vezi doar în poze, ca în cea de mai jos. Pe calculatorul tău, pașii merg '
           'cu Clipchamp deschis, cu un film: el cere cont Microsoft.')


def pune(fid, camp, vechi, nou):
    n, f = dupa_id[fid]
    if f[camp] != vechi:
        raise SystemExit('OPRIT: %s.%s nu mai are textul vechi' % (fid, camp))
    f[camp] = nou


def pas(fid, i, vechi, nou):
    n, f = dupa_id[fid]
    if f['pasi'][i] != vechi:
        raise SystemExit('OPRIT: %s pasul %d nu mai are textul vechi' % (fid, i + 1))
    f['pasi'][i] = nou


# ---------- Clipchamp: lectia VII/11 il preda doar din poze ("Azi il recunosti din poze si din simulator") ----------
f = dupa_id['audio-clipchamp-zone'][1]
assert len(f['pasi']) == 4
f['pasi'].insert(0, CLIP_P1)
pune('audio-clipchamp-zone', 'rezultat',
     'Găsești fiecare zonă: biblioteca în stânga, previzualizarea sus, linia de timp cu pistele jos. Materialele pleacă din bibliotecă, se așază pe linia de timp și se văd în previzualizare.',
     'Găsești fiecare zonă, pe poză sau în Clipchamp: biblioteca în stânga, previzualizarea sus, linia de timp cu pistele jos. Materialele pleacă din bibliotecă, se așază pe linia de timp și se văd în previzualizare.')
pune('audio-clipchamp-zone', 'atentie',
     'Clipchamp, editorul video din Windows 11, cere cont Microsoft: fișa presupune că ai deschis editorul, cu un film. La lecția 11 nu-l pornești: îl recunoști din poze.',
     'Clipchamp e editorul video din Windows 11. Pe poză, chenarele roșii și numele zonelor sunt puse peste captură; în Clipchamp nu le vezi.')

f = dupa_id['audio-clipchamp-cap-redare'][1]
assert len(f['pasi']) == 2
f['pasi'].insert(0, CLIP_P1)
pune('audio-clipchamp-cap-redare', 'atentie',
     'Clipchamp cere cont Microsoft: fișa presupune că ai deschis editorul, cu un film. La lecția 11 nu-l pornești: îl recunoști din poze. În Clipchamp îl muți cu un clic pe rigla cu secunde; în Audacity, cu un clic pe undă.',
     'În Clipchamp îl muți cu un clic pe rigla cu secunde; în Audacity, cu un clic pe undă.')

f = dupa_id['audio-clipchamp-redare'][1]
assert len(f['pasi']) == 2
f['pasi'].insert(0, CLIP_P1)
pune('audio-clipchamp-redare', 'atentie',
     'Clipchamp cere cont Microsoft: fișa presupune că ai deschis editorul, cu un film. La lecția 11 nu-l pornești: îl recunoști din poze. Sub previzualizare sunt |◀, ↺5, ▶ și ↻5: buton ■ Stop, ca în Audacity, nu are.',
     'Sub previzualizare sunt |◀, ↺5, ▶ și ↻5: buton ■ Stop, ca în Audacity, nu are.')
if f['captura'] is not None:
    raise SystemExit('OPRIT: audio-clipchamp-redare are deja captura')
f['captura'] = {"src": "jocuri/audio-video-vii/img/clipchamp-zone.webp",
                "alt": "Editorul video Clipchamp, cu patru zone încadrate și numite cu litere mari: biblioteca, previzualizarea, bara de unelte și linia de timp",
                "w": 1000, "h": 584,
                "legenda": "Clipchamp: sus, previzualizarea; dedesubt, |◀, ↺5, ▶ și ↻5; jos, linia de timp."}

# ---------- Defender: scanarea din meniu E cea permisa; interzise = celelalte butoane (VI/11, laborator, pasul 7) ----------
pas('windows-scanare-microsoft-defender', 2,
    'Alege <b>Scanați cu Microsoft Defender... (Scan with Microsoft Defender...)</b>.',
    'Alege <b>Scanați cu Microsoft Defender... (Scan with Microsoft Defender...)</b>: asta e scanarea ta, doar a stickului sau a fișierului pe care ai dat clic dreapta.')
pas('windows-scanare-microsoft-defender', 3,
    'Se deschide Securitate Windows: citește câte amenințări a găsit. Nu apăsa niciun buton de scanare, de exemplu Scanare rapidă sau Scanare acum: ar ține calculatorul ocupat minute întregi.',
    'Se deschide Securitate Windows: citește câte amenințări a găsit. Acolo nu mai apăsa alt buton de scanare, de exemplu <b>Scanare rapidă (Quick scan)</b> sau <b>Scanare acum</b>: ar ține calculatorul ocupat minute întregi.')
pune('windows-scanare-microsoft-defender', 'atentie',
     'Doar citești rezultatul: nu schimbi nicio setare și nu oprești nimic, calculatorul e al tuturor. Antivirusul nu prinde tot: un program luat de pe un site necunoscut (în coloana Tip scrie Aplicație) nu-l pornești, chiar dacă scanarea n-a găsit nimic. Nu găsești comanda? Școala poate folosi alt antivirus.',
     'Doar citești rezultatul: nu schimbi nicio setare și nu oprești nimic, calculatorul e al tuturor. Antivirusul nu prinde tot: un program luat de pe un site necunoscut nu-l pornești, chiar dacă scanarea n-a găsit nimic. Programul îl recunoști în File Explorer, în vederea cu coloane (Detalii): la el, coloana Tip scrie Aplicație. Nu găsești comanda? Școala poate folosi alt antivirus.')

# ---------- Securitate Windows: numele englezesti din lectia VI/11 (surse.md, din resursele Windows) ----------
START_VECHI = 'Apasă <b>Start</b> (tasta cu sigla Windows), scrie <code>securitate</code> și apasă <kbd>Enter</kbd> când sus apare <b>Securitate Windows (Windows Security)</b>.'
START_NOU = START_VECHI + ' Pe Windows în engleză scrie numele ei englezesc, <code>Windows Security</code>.'
pas('windows-securitate-stare-antivirus', 0, START_VECHI, START_NOU)
pas('windows-securitate-stare-antivirus', 1,
    'Alege <b>Protecție antivirus și împotriva amenințărilor</b>.',
    'Alege <b>Protecție antivirus și împotriva amenințărilor (Virus & threat protection)</b>.')
pas('windows-securitate-stare-antivirus', 3,
    'Nu apăsa <b>Scanare rapidă</b>: ține calculatorul ocupat câteva minute.',
    'Nu apăsa <b>Scanare rapidă (Quick scan)</b>: ține calculatorul ocupat câteva minute.')
pas('windows-securitate-istoric-protectie', 0, START_VECHI, START_NOU)
pas('windows-securitate-istoric-protectie', 1,
    'Alege <b>Protecție antivirus și împotriva amenințărilor</b>, apoi apasă <b>Istoric protecție</b>.',
    'Alege <b>Protecție antivirus și împotriva amenințărilor (Virus & threat protection)</b>, apoi apasă <b>Istoric protecție (Protection history)</b>.')
for fid in ('windows-securitate-stare-antivirus', 'windows-securitate-istoric-protectie', 'windows-scanare-microsoft-defender'):
    c = dupa_id[fid][1]['cuvinte']
    if 'Virus & threat protection' not in c and fid != 'windows-scanare-microsoft-defender':
        c.append('Virus & threat protection')
    if fid == 'windows-securitate-stare-antivirus' and 'Quick scan' not in c:
        c.append('Quick scan')

# ---------- Stergerea din Descarcari, pe calculatorul comun ----------
pas('windows-stergere-fisier-descarcat', 2,
    'Un clic pe fișierul descărcat la lecție, de exemplu <b>batai-in-usa</b>, și apasă tasta <kbd>Delete</kbd>.',
    'Un clic pe fișierul descărcat de tine la lecție, de exemplu <b>batai-in-usa</b>, și apasă tasta <kbd>Delete</kbd>.')
pune('windows-stergere-fisier-descarcat', 'atentie',
     'Lasă calculatorul cum l-ai găsit: ștergi doar ce ai descărcat tu la lecție. Coșul nu-l golești: acolo pot fi și fișierele altora.',
     'Lasă calculatorul cum l-ai găsit: ștergi doar ce ai descărcat tu la lecție. În Descărcări pot fi și fișierele colegilor, cu același nume sau cu (1), (2) la sfârșit. Nu ești sigur că un fișier e al tău? Nu-l șterge. Coșul nu-l golești: acolo pot fi și fișierele altora.')

# ---------- Caseta de cautare din Explorer: lectia nu da textul englezesc ----------
pas('windows-cautare-fisier-explorer', 1,
    'Sus, în dreapta barei de adresă, e caseta de căutare: în ea scrie <b>Căutați în</b> și numele folderului în care ești. Dă clic în ea.',
    'Sus, în dreapta barei de adresă, e caseta de căutare: în ea scrie <b>Căutați în</b> și numele folderului în care ești. Pe Windows în engleză textul din ea e englezesc (lecția nu-l dă): o recunoști după loc. Dă clic în ea.')

# ---------- Redeschiderea filei: cum nu pierzi fisa si ce fereastra inchizi ----------
f = dupa_id['windows-browser-redeschidere-fila'][1]
VECHI2 = ('Ai închis toată fereastra browserului? Pornește-l din Start: scrie <code>edge</code> și dă clic pe <b>Microsoft Edge</b>. '
          'Apoi apasă <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd>. Numai în acest caz, închide cu X fereastra în care nu e lecția (dacă sunt două, pe amândouă).')
if len(f['pasi']) != 2 or f['pasi'][1] != VECHI2:
    raise SystemExit('OPRIT: windows-browser-redeschidere-fila nu mai are pașii vechi')
f['pasi'][1:] = [
    'Ai închis toată fereastra browserului? Citește întâi pașii 3 și 4 până la capăt: la pasul 4 se poate închide și fereastra în care citești fișa aceasta.',
    'Dacă browserul nu e pornit, pornește-l din Start, ca la lecția 13: de exemplu scrie <code>edge</code> și dă clic pe <b>Microsoft Edge</b>. Apoi apasă <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd>.',
    'Uită-te sus, pe filele fiecărei ferestre: fereastra cu fila lecției o păstrezi. Închide cu X fereastra în care nu e lecția (dacă sunt două, pe amândouă). În lecție apasă <b>Continuă de unde ai rămas</b>, dacă apare.',
]

# ---------- Legatura: cum faci fila noua si cum revii ----------
pas('windows-browser-legatura', 0,
    'Găsește legătura pe pagină: textul ei e adesea albastru și subliniat.',
    'Găsește legătura pe pagină: textul ei e adesea albastru și subliniat. De exemplu, pe <code>learninghub-8z6.pages.dev/lectii/v/</code> titlurile lecțiilor sunt legături.')
pune('windows-browser-legatura', 'atentie',
     'Lucrează într-o filă nouă, ca lecția să rămână deschisă în fila ei.',
     'Lucrează într-o filă nouă (clic pe <b>+</b>, în dreapta filelor), ca lecția să rămână deschisă în fila ei. Te întorci la lecție cu un clic pe fila ei.')

# ---------- Ghilimelele: ce faci daca nu sunt in caseta ----------
pas('windows-browser-cautare-ghilimele', 5,
    'Uită-te în caseta motorului de căutare: ghilimelele sunt acolo?',
    'Uită-te în caseta motorului de căutare: ghilimelele sunt acolo? Nu sunt, sau sunt „ ”? Fă clic în bara de adrese (tot ce era scris se selectează) și scrie din nou, cu ghilimelele de la pașii 1-3.')

# ---------- Cosul: unde e liniuta (lectia V/8, ceruta de V/10) ----------
pas('windows-cos-restaurare', 1,
    'Ca să vezi desktopul, micșorează cu liniuța ferestrele deschise: Explorer și fereastra browserului în care citești pașii.',
    'Ca să vezi desktopul, micșorează cu liniuța ferestrele deschise: Explorer și fereastra browserului în care citești pașii. Liniuța (Minimizare) e în dreapta sus a fiecărei ferestre, lângă X.')

# ---------- Folderul nou: unde se face folderul tau ----------
pune('windows-folder-nou', 'atentie',
     'În laborator lucrezi doar în folderul tău, din Documente: Ex, apoi numele și prenumele tău. Dacă Windows spune că numele există deja, adaugă o cifră la sfârșit. În nume nu merg semnele \\ / : * ? " < > |.',
     'În laborator, folderul tău îl faci direct în Documente și îl numești Ex, apoi numele și prenumele tău, de exemplu Ex Pop Ana; apoi lucrezi doar în el. Dacă Windows spune că numele există deja, adaugă o cifră la sfârșit. În nume nu merg semnele \\ / : * ? " < > |.')

# ---------- Audacity: de unde iei sunetul ----------
pas('audio-audacity-deschidere-sunet', 0,
    'Sunetul descărcat din lecție, de exemplu <code>batai-in-usa.wav</code>, ajunge în <b>Descărcări (Downloads)</b>.',
    'Întâi descarcă sunetul din lecție: un clic pe legătura <code>batai-in-usa.wav</code>. Ajunge în <b>Descărcări (Downloads)</b>.')

# ---------- scriere + paza pe id-uri ----------
for n in fise:
    if [f['id'] for f in fise[n]] != ids_inainte[n]:
        raise SystemExit('OPRIT: s-au schimbat id-urile in ' + n)
    for f in fise[n]:
        if len(f['pasi']) > 7:
            raise SystemExit('OPRIT: peste 7 pasi in ' + f['id'])
    scrie(n, fise[n])
print('scris:', ', '.join(fise))
