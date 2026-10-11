"""A șasea aplicație în „Cum fac…?”: audio = „Audio-video” (Audacity și Clipchamp, lecția VII/11, 11.10.2026).
Scrie în cum-fac/_sursa/sensuri.json (citește fișierul de pe disc chiar acum, schimbă doar ce e mai jos, păstrează
formatul: indentare 1, LF/CRLF cum era, newline la final). Se poate rula de mai multe ori (înlocuiește, nu dublează).
- aplicatii.audio: eticheta, nume (scoase din căutare, cântăresc 3), indicii (rămân în căutare, cântăresc 1) și
  „acopera”: gesturile din „neacoperite” pe care ORICE fișă audio le predă (sunetul, filmul), ca vetoul să nu taie
  „cum opresc sunetul în Audacity” când fișa Stop nu scrie „sunet” în titlu;
- grupuri NOI, toate legate de aplicatia audio (sensul ține doar în fișele audio, deci nu mută fișele altor aplicații):
  sunet_audio, video_audio, redare, pauza, stop_redare, linie_timp, cap_redare;
- despre: o frază despre „acopera”.
Rulare: python sensuri_audio.py"""
import json
import sys

P = r'C:/00/Projects/LearningHub/cum-fac/_sursa/sensuri.json'
if '--cale' in sys.argv:   # probă pe o copie: python sensuri_audio.py --cale <copie.json>
    P = sys.argv[sys.argv.index('--cale') + 1]
raw = open(P, 'rb').read()
crlf = b'\r\n' in raw
s = json.loads(raw.decode('utf-8'))

AUDIO = {
    "eticheta": "Audio-video",
    # Audacity și Clipchamp = nume (scoase din căutare, cântăresc 3). Încercat și Clipchamp ca indiciu (rămâne cuvânt
    # căutat, ca „linia de timp în Clipchamp” să aleagă fișa de Clipchamp, nu pe cea de Audacity): atunci un cuvânt
    # atât de rar acoperă singur 76% din întrebare și „cum salvez în Clipchamp” ieșea „găsit”. Ca nume, fișa de
    # Clipchamp rămâne în primele 3, iar întrebările din afara materiei rămân „n-am găsit”.
    # fără „audaciti”/„odasiti”: rădăcina lor („audac”, „odas”) e la o literă de „audă” („să se audă”), care devenea
    # numele aplicației; greșelile de o literă le prinde oricum motorul (numeAplicatieGresit)
    "nume": ["audacity", "audacityul", "odacity",
             "clipchamp", "clipchampul", "clip champ", "clipcamp", "clipchamps",
             "audio video", "audio-video"],
    "indicii": ["audio", "sunet", "sunetul", "sunete", "sunetele", "melodie", "melodia", "muzică", "muzica", "cântec",
                "video", "videoclip", "filmuleț", "filmulețul", "film", "filmul", "filmare", "filmarea",
                "pistă", "pista", "piste", "undă", "unda", "linia de timp", "linie de timp", "timeline",
                "capul de redare", "redare", "play", "pauză", "pause", "wav", "mp3", "mp4"],
    "acopera": ["sunet", "video"],
    # două programe în aceeași aplicație: „… în Clipchamp” trece în spate fișele care numesc Audacity (și invers)
    "programe": {"audacity": ["audacity", "audacityul", "odacity"],
                 "clipchamp": ["clipchamp", "clipchampul", "clip champ", "clipcamp", "clipchamps"]}
}

GRUPURI = [
    # fără muzică / melodie / cântec: legate de „sunet”, cântăreau cât un cuvânt rar și scoteau „găsit” la „cum pun
    # muzica în prezentare să se audă tot timpul” (PowerPoint, în afara materiei); fișele le au oricum în formulări
    {"id": "sunet_audio", "aplicatie": "audio", "cuvinte": [
        "sunet", "sunetul", "sunete", "sunetele", "sunetului", "audio", "sound", "fișier audio", "fișierul audio"]},
    {"id": "video_audio", "aplicatie": "audio", "cuvinte": [
        "video", "videoclip", "videoclipul", "videoclipuri", "filmuleț", "filmulețul", "filmulețe", "film", "filmul",
        "filme", "filmare", "filmarea", "filmări", "filmările", "clip video", "movie"]},
    {"id": "redare", "aplicatie": "audio", "cuvinte": [
        "redare", "redarea", "redau", "redai", "redă", "play", "dau play", "apăs play", "pornesc sunetul",
        "pornești sunetul", "pornesc melodia", "pornesc muzica", "pornesc filmul", "dau drumul", "ascult", "asculți",
        "ascultă", "ascultare"]},
    {"id": "pauza", "aplicatie": "audio", "cuvinte": [
        "pauză", "pauza", "pauze", "pause", "pun pauză", "pun pe pauză", "opresc pe loc", "oprește pe loc",
        "de unde am rămas", "de unde a rămas"]},
    {"id": "stop_redare", "aplicatie": "audio", "cuvinte": [
        "stop", "opresc", "oprești", "oprește", "oprire", "opresc sunetul", "opresc melodia", "opresc muzica",
        "opresc redarea", "opresc filmul"]},
    {"id": "linie_timp", "aplicatie": "audio", "cuvinte": [
        "linia de timp", "linie de timp", "liniei de timp", "timeline", "cronologie", "cronologia", "rigla cu secunde"]},
    # „o iau de la capăt” = mă întorc la început (|◀); doar expresii întregi: „la final”, „la sfârșit” singure ar
    # înghiți cuvântul și în întrebările altor aplicații („un rând la sfârșit”)
    {"id": "capete_sunet", "aplicatie": "audio", "cuvinte": [
        "de la început", "de la capăt", "iau de la început", "o iau de la început", "iau de la capăt",
        "o iau de la capăt", "skip to start", "skip to end"]},
    {"id": "cap_redare", "aplicatie": "audio", "cuvinte": [
        "capul de redare", "cap de redare", "capului de redare", "playhead", "linia verticală", "cursorul", "cursor"]},
]

DESPRE = ("aplicatii.<app>.acopera (opțional): formele unor gesturi din „neacoperite” pe care ORICE fișă a aplicației "
          "le predă (la audio: sunetul și filmul, fiindcă toată aplicația e despre ele); vetoul acelor gesturi nu mai "
          "taie fișele aplicației, chiar dacă fișa nu le scrie în titlu. Celelalte aplicații nu se schimbă. "
          "aplicatii.<app>.programe (opțional): {program: [formele numelui]}, la o aplicație cu mai multe programe; "
          "numele rămân și în „nume”. Dacă întrebarea numește un program, fișele care numesc ALT program (în titlu, "
          "întrebare, formulări, cuvinte) trec în spate (reglaj.alt_program, implicit 0,55) și nu pot fi „am găsit”. "
          "Aplicația audio („Audio-video”: Audacity, Clipchamp) e din 11.10.2026; grupurile ei sunt legate de ea.")

# înregistrarea (cu microfonul) NU e în lecția VII/11: „cum înregistrez în Audacity” = „n-am găsit”, nu fișa Redare
# (care poate avea în formulări „ascult ce am înregistrat”). Ca vetoul să prindă VERBUL, nu și substantivul
# („deschid înregistrarea” e o întrebare bună), formele verbului primesc rădăcina lor (radacini_fixe).
RAD_INREG = ["înregistrez", "înregistrezi", "înregistrează", "înregistrăm", "înregistrați", "înregistreze"]
VETO_INREG = ["înregistrez", "înregistrare nouă", "microfon", "microfonul", "butonul record"]
# filmul pus / luat de pe o platformă (setul reglor_lung: „cum fac un video pe youtube cu muzica și poze” ieșea fișa
# Clipchamp). Doar expresii: „cum intru pe youtube” rămâne o întrebare de browser, nu e tăiată.
VETO_PLATFORME = ["video pe youtube", "videoclip pe youtube", "filmuleț pe youtube", "de pe youtube", "pun pe youtube",
                  "postez pe youtube", "urc pe youtube", "pe tiktok", "pe instagram", "pe facebook"]

if '--doar-verifica' not in sys.argv:
    ap = s['aplicatii']
    ap['audio'] = AUDIO
    ids = {g['id'] for g in GRUPURI}
    s['grupuri'] = [g for g in s['grupuri'] if g['id'] not in ids] + GRUPURI
    s['despre'] = [x for x in s['despre'] if not x.startswith('aplicatii.<app>.acopera')] + [DESPRE]
    rf = s.setdefault('radacini_fixe', [])
    rf[:] = [l for l in rf if l[:1] != RAD_INREG[:1]] + [RAD_INREG]
    s['neacoperite'] = [l for l in s['neacoperite'] if l[:1] not in (VETO_INREG[:1], VETO_PLATFORME[:1])] + [VETO_INREG, VETO_PLATFORME]
    # „slime” (setul de dezvoltare: „cum să fac slime acasă”): corectat la „slide”, iar fișa Audacity cu „pagina Acasă”
    # în formulări îl lua „găsit”; e o întrebare din afara calculatorului, ca jocurile din aceeași intrare
    for l in s['neacoperite']:
        if l[:1] == ['minecraft'] and 'slime' not in l:
            l.append('slime')
    out = json.dumps(s, ensure_ascii=False, indent=1) + '\n'
    if crlf:
        out = out.replace('\n', '\r\n')
    open(P, 'wb').write(out.encode('utf-8'))
print('aplicatii:', list(s['aplicatii'].keys()))
print('grupuri:', len(s['grupuri']), '·', ', '.join(g['id'] for g in s['grupuri'] if g.get('aplicatie') == 'audio'))
