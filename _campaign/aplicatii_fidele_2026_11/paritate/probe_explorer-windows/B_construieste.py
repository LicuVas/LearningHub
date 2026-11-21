# B_construieste.py — scrie parte_B.json (inventarul de paritate explorer-windows, partea B) și îl verifică mecanic.
import json, os, re, sys
P = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate'
SRC = P + '/proba_src/'
LIB = 'C:/00/Projects/LearningHub_fidel/'
OP = 'lectii/_sim/explorer-operatii.js'
OG = 'lectii/_sim/explorer-organizare.js'
PR = 'lectii/_sim/explorer-proba.js'
L10, L11, L12, L15, L18 = 'lectii/v/m2-l10', 'lectii/v/m2-l11', 'lectii/v/m2-l12', 'lectii/v/m2-l15', 'lectii/vi/m3-l18'

def lines(rel, base=SRC):
    with open(base + rel, encoding='utf-8') as f:
        return f.read().split('\n')
OPL, OGL = lines(OP), lines(OG)

import difflib
_MAP = {}
for tag, a1, a2, b1, b2 in difflib.SequenceMatcher(None, [x.strip() for x in OPL], [x.strip() for x in OGL], autojunk=False).get_opcodes():
    if tag == 'equal':
        for k in range(a2 - a1):
            _MAP[a1 + k + 1] = b1 + k + 1
def ogpair(n):
    """linia din explorer-organizare.js care corespunde (diff) liniei n din explorer-operatii.js, dacă e neschimbată"""
    return _MAP.get(n)

def ex(pag, linie, tip, ce):
    return "%s/index.html:%d t:'%s' — %s" % (pag, linie, tip, ce)

F = []
def fn(cheie, functie, grup, gest, op=(), og=(), alte=(), unde=(), exercitii=(), bib='DA', bdov='', lipsa='', nota='', pereche=True):
    v = ['%s:%d' % (OP, n) for n in op]
    if pereche:
        for n in op:
            k = ogpair(n)
            if k:
                v.append('%s:%d' % (OG, k))
    v += ['%s:%d' % (OG, n) for n in og] + list(alte)
    seen = []
    [seen.append(x) for x in v if x not in seen]
    F.append({'id': 'B-%03d' % (len(F) + 1), 'aplicatie': 'explorer', 'cheie': cheie, 'functie': functie, 'grup': grup, 'gest': gest,
              'vechi_dovada': seen, 'unde': list(unde), 'ceruta_de_exercitiu': bool(exercitii), 'exercitii': list(exercitii),
              'biblioteca': bib, 'biblioteca_dovada': bdov, 'lipsa': lipsa, 'nota': nota})

TOATE = [L10, L11, L12, L15, L18]
NOTA_STARE = ('stare() a bibliotecii (api §5) dă doar copiii folderului de lucru (nume_fisiere/ordine_afisata = copii(W), explorer.js:237-241), '
              'fără subfoldere, fără id de fișier, dată sau dimensiune: o lecție nu poate verifica pe stare ce verifica vechiul ')

# ---------------- Navigare ----------------
fn('nav_deschide_folder', 'Intră într-un folder: dublu-clic pe el, Enter pe el selectat sau Deschidere din meniul lui.', 'Navigare',
   'dublu-clic pe rândul folderului; Enter; clic dreapta › Deschidere', op=(633, 564, 690), og=(1029,), unde=TOATE,
   exercitii=[ex(L10, 211, 'explorerop', 'Alarm01 ajunge în Ex Pop Ana: cere intrarea în folderul tău înainte de Lipire'),
              ex(L12, 207, 'explorerop', 'Teme și Desene în Scoala: cere intrarea în Scoala')],
   bdov='aplicatii/explorer.js:821 — dublu-clic pe rând → deschide() → navigheaza (608); Enter: 915; meniul Deschideți: 683')
fn('nav_panou_navigare', 'Sare într-un loc cu un clic în panoul de navigare din stânga (Documente, Acest PC, discurile, folderele).', 'Navigare',
   'clic pe un nod din arbore', op=(610, 451), unde=TOATE,
   bib='PARTIAL', bdov='aplicatii/explorer.js:788 — nodurile cu cale navighează; Acest PC și discurile nu au cale → mesajul central (nesimulat)',
   lipsa='arborele are doar Documente și folderele ei de primul nivel (explorer.js:321-322); Acest PC, Disc local (C:), stick-ul și subfolderele mai adânci nu duc nicăieri')
fn('nav_extinde_arbore', 'Deschide sau strânge o ramură a arborelui (săgeata › / ⌄ din fața nodului).', 'Navigare',
   'clic pe săgeata din fața nodului', op=(609,), unde=TOATE, bib='NU',
   bdov='căutat „exp”, „Extinde”, „Restrânge”, „chev”, „aria-expanded” în aplicatii/explorer.js (htmlPanouNav 305-327): nodurile nu au săgeată și nu se pot extinde')
fn('nav_inapoi', 'Se întoarce în locul de dinainte (închide și rezultatele căutării).', 'Navigare',
   'butonul ←; Backspace; Alt + ←', op=(613, 691), unde=TOATE,
   bdov='aplicatii/explorer.js:792 — butonul Înapoi; Backspace: 918; Alt+←: 920',
   nota='În bibliotecă nu există o pagină de rezultate de închis: căutarea doar filtrează lista.')
fn('nav_inainte', 'Merge din nou înainte, după Înapoi.', 'Navigare', 'butonul →', op=(614,), unde=TOATE,
   bdov='aplicatii/explorer.js:793 — butonul Înainte (și Alt+→: 921)')
fn('nav_sus', 'Urcă un nivel, în folderul părinte (până la disc și Acest PC).', 'Navigare', 'butonul ↑; Alt + ↑', op=(615, 692), unde=TOATE,
   bib='PARTIAL', bdov='aplicatii/explorer.js:794 — Sus navighează la par(cur); Alt+↑: 922',
   lipsa='din Documente nu mai urcă: „Până la Acest PC” dă mesajul central (proba B_proba_explorer.py, T9); vechiul urca la Disc local (C:) și Acest PC')
fn('adresa_segment', 'Sare într-un folder de mai sus cu un clic pe numele lui din bara de adresă.', 'Navigare',
   'clic pe un nume din bara de adresă', op=(472, 610), unde=TOATE, bib='PARTIAL',
   bdov='aplicatii/explorer.js:798 — clicul pe un segment navighează; primul segment (Acest PC) → nesimulat (799)',
   lipsa='bara are doar segmentele din Documente; vechiul avea și Acest PC › Disc local (C:) › Windows › Media')
fn('nav_acest_pc', 'Deschide Acest PC, vede unitățile (Disc local C:, stick-ul) și intră pe ele, până în foldere din afara Documentelor (C:\\Windows\\Media).', 'Navigare',
   'clic pe Acest PC / pe disc în arbore, apoi dublu-clic pe foldere', op=(462, 226, 219, 455), unde=[L10, L11],
   exercitii=[ex(L10, 211, 'explorerop', 'Alarm01 copiat din C:\\Windows\\Media, rămas și acolo (neatins MEDIA)'),
              ex(L10, 307, 'explorerop', 'atelier: Alarm02 copiat din Media (neatins MEDIA)'),
              ex(L11, 229, 'explororg', 'Alarm01, Alarm02, Ring01 copiate din Media în Proba')],
   bib='NU', bdov='aplicatii/explorer.js:175-192 — modelul are doar Documente (PARINTE) + folderul de lucru + foldere alăturate; nodurile Acest PC / discuri: 324-325 fără cale → nesimulat (788)',
   nota='O lecție poate pune un folder „Media” lângă cel de lucru (foldere_alaturate), dar calea și drumul nu mai sunt cele din laborator.')
fn('unitate_stick', 'Lucrează pe stick (E:): acolo Delete nu duce în Coș, ci întreabă „Sigur ștergeți definitiv acest fișier?”.', 'Fișiere',
   'Delete pe un fișier de pe stick, apoi Da / Nu', op=(240, 393), unde=[L10],
   exercitii=[ex(L10, 323, 'explorerop', 'a apărut întrebarea „Sigur ștergeți definitiv…?” și poza a rămas pe stick (Nu)')],
   bib='NU', bdov='căutat „stick”, „E:”, „unitati”, „Disc” în aplicatii/explorer.js: nu există unități; laCos (570) duce mereu în Coș')
fn('cos_deschide', 'Deschide Coșul de reciclare cu dublu-clic pe pictograma de pe desktop.', 'Coș de reciclare',
   'dublu-clic pe „Coș de reciclare” sub/lângă Explorer', op=(625,), unde=[L10, L12],
   exercitii=[ex(L10, 268, 'explorerop', 'restaurat: notite pusă înapoi din Coș (cere intrarea în Coș)')],
   bdov='aplicatii/explorer.js:820 — dublu-clic pe desktop:Coș de reciclare → navigheaza(COS)')

# ---------------- Selecție ----------------
fn('selectie_clic', 'Alege un fișier sau un folder cu un clic (doar pe el).', 'Selecție', 'clic pe rând', op=(634,), og=(1033,), unde=TOATE,
   exercitii=[ex(L15, 184, 'explorerop', 'mutarea fotografiei începe cu selectarea ei (op sel)')],
   bdov='aplicatii/explorer.js:783 — clicul pe rând → alege(); clic simplu = doar el: 618')
fn('selectie_ctrl_clic', 'Adaugă sau scoate un element din selecție (Ctrl + clic).', 'Selecție', 'Ctrl + clic pe rânduri', og=(1031,), unde=[L11],
   exercitii=[ex(L11, 230, 'explororg', 'grupMinim 3: cele trei sunete lipite deodată, după Ctrl + clic')],
   bdov='aplicatii/explorer.js:617 — Ctrl/⌘ + clic adaugă sau scoate din M.sel',
   nota='În explorer-operatii.js (lecțiile 10, 12, 15, VI/18) Ctrl + clic doar arată un mesaj (vezi doar_afisate); funcția e a lui explorer-organizare.js.')
fn('selectie_shift_clic', 'Alege un șir de elemente, de la primul ales până la cel apăsat (Shift + clic).', 'Selecție', 'clic, apoi Shift + clic',
   og=(1032,), unde=[L11], bdov='aplicatii/explorer.js:613-615 — Shift + clic: M.sel = de la ancoră la element')
fn('selectie_ctrl_a', 'Alege toate elementele din folder (Ctrl + A).', 'Selecție', 'Ctrl + A', og=(1083,), unde=[L11],
   bdov='aplicatii/explorer.js:902 — ctrl_a: M.sel = toată lista vizibilă')
fn('selectie_casete', 'Pe telefon (ecran atins sau îngust) bifează căsuța din stânga rândului ca să adauge / scoată elementul din selecție (ca Ctrl + clic).', 'Selecție',
   'atingere pe căsuța din stânga rândului', og=(1028, 244, 862), unde=[L11], bib='PARTIAL',
   bdov='aplicatii/explorer.js:674 — Vizualizați › Afișați › Casete de selectare element pornește căsuțele (desenate la 352)',
   lipsa='clicul pe căsuță se poartă ca un clic simplu: alege doar acel rând (proba T4: selecția [b, c] a devenit [c]); căsuțele nu apar singure pe telefon; lipsește rândul de lămurire „Pe telefon nu ai Ctrl”')
fn('deselectare', 'Scoate selecția: clic pe locul gol din listă.', 'Selecție', 'clic pe spațiul gol; Esc', op=(642,), unde=TOATE,
   bdov='aplicatii/explorer.js:783 — clic pe zona listei fără element → M.sel = [] (deselectare); Esc: 939')
fn('taste_sageti', 'Mută selecția în listă cu săgețile sus / jos (și în Coș).', 'Selecție', '↑ / ↓', op=(693, 694), og=(1095,), unde=TOATE,
   bdov='aplicatii/explorer.js:925-932 — săgețile mută selecția (alege)')
fn('taste_home_end', 'Sare la primul / ultimul element din listă (Home / End).', 'Selecție', 'Home / End', op=(693, 694), og=(1095,), unde=TOATE,
   bdov='aplicatii/explorer.js:928 — Home = primul, End = ultimul')
fn('bara_stare_numar', 'Citește în bara de jos câte elemente sunt, câte sunt selectate („3 elemente selectate”) și ce e ținut minte pentru Lipire.', 'Selecție',
   'privește bara de stare după selectare / Copiere', op=(489,), og=(850, 851, 852), unde=TOATE, bib='PARTIAL',
   bdov='aplicatii/explorer.js:364-368 — bara de stare scrie doar „N elemente”',
   lipsa='nu scrie „1 element selectat” / „N elemente selectate” (proba T7: cu 2 alese rămâne „3 elemente”); la 1 scrie „1 elemente”; nu spune ce e ținut minte pentru Lipire',
   nota='Lecția 11 (pașii tranșelor, index.html:149-150) îi spune elevului „Vezi: jos scrie 10 elemente selectate”.')

# ---------------- Meniuri ----------------
fn('meniu_context', 'Deschide meniul unui element, al locului gol sau al unui element din Coș: clic dreapta, ținut apăsat pe telefon, Shift + F10 / tasta Meniu; Esc sau clic în afară îl închide.', 'Meniuri',
   'clic dreapta; ținut apăsat 550 ms; Shift + F10', op=(635, 641, 639, 650, 695, 681, 661), unde=TOATE, bib='PARTIAL',
   bdov='aplicatii/explorer.js:833-843 — clic dreapta pe rând / loc gol / Coș deschide meniul (din aplicatii.js:405-410, evenimentul contextmenu); Esc: 893',
   lipsa='Shift + F10 cu un element selectat nu deschide nimic (proba T2: 0 meniuri); ținutul apăsat pe telefon depinde de contextmenu-ul nativ al browserului (neprobat)')

# ---------------- Fișiere ----------------
fn('folder_nou', 'Face un folder nou („Folder nou”, „Folder nou (2)”…) și îi scrie numele pe loc.', 'Fișiere',
   'Nou › Folder; Ctrl + Shift + N; clic dreapta pe loc gol › Nou › Folder', op=(387, 388, 619, 569, 682, 568, 246), unde=TOATE,
   exercitii=[ex(L10, 167, 'explorerop', 'în Documente e folderul Ex Pop Ana'), ex(L10, 306, 'explorerop', 'atelier: Alarme și Sonerii'),
              ex(L12, 207, 'explorerop', 'Scoala, cu Teme și Desene în ea'), ex(L12, 290, 'probaexp', 'folderNou Proiect: făcut ACUM (id nou), cu numele exact'),
              ex(L12, 291, 'probaexp', 'folderNou Imagini'), ex(L12, 292, 'probaexp', 'folderNou Sunete')],
   bdov='aplicatii/explorer.js:499-506 — folderNou: „Folder nou” liber (227), caseta de nume deschisă; Nou › Folder: 661; Ctrl+Shift+N: 906; meniul locului gol › Nou: 688',
   nota=NOTA_STARE + 'la folderNou (l12): „făcut acum” (id nou), nu un folder vechi redenumit. Nici folderele din subfoldere (Scoala/Teme) nu apar în stare.')
fn('redenumire', 'Redenumește un fișier sau un folder: scrie numele și confirmă cu Enter sau cu un clic în altă parte; extensia ascunsă rămâne; cu extensiile la vedere, F2 alege doar numele.', 'Fișiere',
   'F2; Redenumire (bară sau meniu); scrie; Enter / clic în altă parte / clic pe Verifică', op=(575, 688, 668, 671, 354, 360, 560, 665),
   alte=['%s:361' % PR, '%s:422' % PR], unde=TOATE,
   exercitii=[ex(L10, 188, 'explorerop', 'Folder nou → Sunete, numele vechi nu mai e'), ex(L10, 194, 'explorerop', 'harta.png → Romania.png (extensiile la vedere)'),
              ex(L10, 250, 'explorerop', 'tema → tema Pop Ana'), ex(L10, 329, 'explorerop', 'Muzca → Muzica'), ex(L11, 253, 'explororg', 'Folder nou / aaa → Imagini / Sunete'),
              ex(L12, 227, 'explorerop', 'desen → soare, tot Fișier PNG'), ex(L12, 308, 'probaexp', 'numit: pisica → pisica mea (același fișier, numele exact)'),
              ex(L18, 269, 'explorerop', 'Proiect Scratch.sb3 → Pisica_6A_Popescu.sb3, .sb3 rămâne')],
   bdov='aplicatii/explorer.js:543-569 — redenumeste; F2: 911; Redenumire: 649; meniu: 684; Enter: 854; clic în altă parte: 431-458, 702, 772; extensia ascunsă păstrată: 551; F2 alege doar numele: 429-430',
   nota=NOTA_STARE + 'la „numit” (l12 B: același fișier, în subfolderul Imagini). Numele gol: vechiul spune „Numele nu poate fi gol”, biblioteca păstrează tăcut numele (545).')
fn('redenumire_esc', 'Renunță la redenumire cu Esc: numele rămâne cel vechi.', 'Fișiere', 'Esc în caseta de nume', op=(668,), unde=TOATE,
   bdov='aplicatii/explorer.js:855 — Esc în caseta de nume: M.edit = null, numele vechi', nota='Lecția 10 întreabă asta într-o întrebare cu variante (index.html:198), nu în simulator.')
fn('nume_interzis', 'Află că semnele \\ / : * ? " < > | nu intră într-un nume: la tastare semnul nu apare și iese balonul „Numele unui fișier nu poate să conțină…”.', 'Fișiere',
   'scrie ? (sau alt semn interzis) în caseta de nume', op=(669, 670, 357), unde=TOATE, bib='NU',
   bdov='aplicatii/explorer.js:549 — numele cu semn interzis → I.nesimulat(„avertizarea pentru semnele…”), numele rămâne neschimbat; balonul și scoaterea semnului la tastare lipsesc',
   nota='Exercițiul l10:187-189 are varianta greșită „Sunete?” (gresit), dar testul nu verifică mesajul.')
fn('redenumire_extensie', 'Schimbă extensia unui fișier și răspunde la „Dacă modificați extensia unui fișier, acesta poate deveni inutilizabil. Sigur modificați extensia?” (Da / Nu).', 'Fișiere',
   'redenumire cu altă extensie, extensiile la vedere; Da / Nu', op=(362, 550, 596, 597), unde=[L10, L18],
   bdov='aplicatii/explorer.js:562-565 — dialogul „Redenumire” cu textul extensiei, Da / Nu', nota='La Nu, vechiul redeschide caseta cu textul scris (597); biblioteca o închide (564).')
fn('redenumire_conflict', 'Redenumește cu un nume care există deja și răspunde la „Această locație conține deja un fișier cu același nume. Redenumiți „a” ca „b (2)”?”.', 'Fișiere',
   'redenumire cu un nume folosit; Da / Nu', op=(365, 366, 551, 552, 598), unde=TOATE, bib='PARTIAL',
   bdov='aplicatii/explorer.js:556-559 — fișier: dialogul „Redenumire fișier”, „Redenumiți … ca … (2)?”, Da / Nu',
   lipsa='la FOLDER dă mesajul central (557); fereastra n-are rândul „Această locație conține deja un fișier cu același nume.”')
fn('copiere', 'Copiază elementele selectate (Copiere, Ctrl + C sau din meniu), ca să le lipească altundeva.', 'Fișiere',
   'Copiere (bară, meniu); Ctrl + C', op=(571, 683, 513), og=(945, 956), unde=TOATE,
   exercitii=[ex(L10, 211, 'explorerop', 'Alarm01 copiat, rămas și în Media'), ex(L10, 250, 'explorerop', 'copia temei în Clasa 5A'),
              ex(L11, 229, 'explororg', 'trei sunete copiate în Proba'), ex(L12, 293, 'probaexp', 'copiatSiPastrat pisica (în Imagini și în Materiale)'),
              ex(L12, 307, 'probaexp', 'copiatSiPastrat câinele')],
   bdov='aplicatii/explorer.js:507-511 — copiaza_(false): M.clip = selecția; Copiere: 647; Ctrl+C: 899; meniu: 684',
   nota=NOTA_STARE + 'la copiat/copiatSiPastrat (fișierul în ambele foldere, cu aceeași dată și dimensiune) și neatins (același id).')
fn('decupare', 'Decupează elementele selectate (Decupare, Ctrl + X sau din meniu): rândul devine palid până la Lipire.', 'Fișiere',
   'Decupare (bară, meniu); Ctrl + X', op=(571, 684, 465), og=(945, 956, 826), unde=TOATE,
   exercitii=[ex(L10, 230, 'explorerop', 'Alarm01 mutat în Sunete'), ex(L10, 329, 'explorerop', 'Ring01 mutat în Muzica'), ex(L11, 273, 'explororg', 'grupMinim 4: o grupă mutată deodată'),
              ex(L12, 227, 'explorerop', 'desen mutat din Teme în Desene'), ex(L12, 306, 'probaexp', 'mutat Alarm03'), ex(L15, 184, 'explorerop', 'fotografia mutată din Descărcări'),
              ex(L18, 269, 'explorerop', 'proiectul mutat în TIC_6A')],
   bdov='aplicatii/explorer.js:507-511 — copiaza_(true); Decupare: 646; Ctrl+X: 900; rândul palid: 346',
   nota=NOTA_STARE + 'la mutat (l12: locul vechi gol, același fișier).')
fn('lipire', 'Lipește în folderul deschis ce a copiat sau a decupat (copiere sau mutare); o mutare în același folder nu face nimic.', 'Fișiere',
   'Lipire (bară); Ctrl + V; clic dreapta pe loc gol › Lipire', op=(283, 299, 301, 311, 572, 685, 518, 295), unde=TOATE,
   exercitii=[ex(L10, 211, 'explorerop', 'Alarm01 în Ex Pop Ana'), ex(L10, 230, 'explorerop', 'Alarm01 în Sunete, nu și în locul vechi'),
              ex(L10, 307, 'explorerop', 'atelier: Alarm02 în Alarme'), ex(L11, 272, 'explororg', 'organizat după tip'), ex(L12, 306, 'probaexp', 'mutat Alarm03 în Sunete'),
              ex(L15, 184, 'explorerop', 'fotografia în Ex Pop Ana'), ex(L18, 269, 'explorerop', 'proiectul în TIC_6A')],
   bib='PARTIAL', bdov='aplicatii/explorer.js:512-542 — lipeste: copiere / mutare, mai multe deodată; Lipire: 648; Ctrl+V: 901',
   lipsa='meniul locului gol n-are „Lipire” (date/explorer.json › meniuri.meniu_fundal: Vizualizare, Sortați după, Grupare după, Anulare, Nou, Proprietăți…; dinMeniu 687-691)',
   nota=NOTA_STARE + '(destinația e de obicei un subfolder).')
fn('operatii_multiple', 'Copiază, mută sau șterge deodată toate elementele selectate (o singură Copiere / Decupare / Lipire / Ștergere).', 'Fișiere',
   'Ctrl + clic pe mai multe, apoi Copiere / Decupare / Ștergere și Lipire', og=(945, 949, 950, 428, 463), unde=[L11],
   exercitii=[ex(L11, 230, 'explororg', 'grupMinim 3'), ex(L11, 273, 'explororg', 'grupMinim 4'), ex(L11, 327, 'explororg', 'atelier: grupMinim 3'),
              ex(L11, 349, 'explororg', 'toate cele 4 sunete deodată (grupMinim 4)')],
   bdov='aplicatii/explorer.js:509 — M.clip = toată selecția; lipeste parcurge toate sursele (518-540); laCos șterge toată selecția (573)',
   nota='grupMinim („o singură Lipire a mutat ≥ N elemente”) nu se poate citi din stare(); un ascultător de evenimente (api §4, inainte/dupa) vede doar folderul de lucru, iar destinația e un subfolder. Ctrl+Z anulează tot grupul în ambele.')
fn('copie_acelasi_folder', 'Lipește în același folder și primește o copie: „tema - Copie”, apoi „tema - Copie (2)”; la folder, „Amestec - Copie” cu tot conținutul.', 'Fișiere',
   'Copiere, apoi Lipire în același folder', op=(296, 297, 250), og=(443,), unde=[L10, L11],
   exercitii=[ex(L10, 309, 'explorerop', 'atelier: în Sonerii e sonerie - Copie'), ex(L11, 299, 'explororg', 'Amestec - Copie, cu aceleași 3 fișiere')],
   bdov='aplicatii/explorer.js:521-523 — în același folder: copie() dă „ - Copie”, „ - Copie (2)” (228), folderul se copiază cu subarborele (231)')
fn('lipire_conflict_inlocuire', 'La același nume în destinație, alege „Înlocuire fișier de la destinație” (deja aleasă: Enter înlocuiește).', 'Fișiere',
   'Lipire, apoi clic pe Înlocuire sau Enter', op=(300, 541, 590, 561), unde=[L10], bdov='aplicatii/explorer.js:527-531 — fereastra „Înlocuire sau omitere fișiere”; Înlocuire suprascrie; Enter apasă al doilea buton = Înlocuire (885)',
   nota='Fereastra bibliotecii n-are rândul „Se copiază 1 element de la X la Y” și are în plus „Mai puține detalii”. Testul neatins (l10:250, tema colegului) cere id: ' + NOTA_STARE.split(':')[0] + '.')
fn('lipire_conflict_omitere', 'La același nume în destinație, alege „Se omite acest fișier” (sau închide fereastra cu Esc): fișierul din destinație rămâne.', 'Fișiere',
   'Lipire, apoi clic pe Se omite; Esc', op=(542, 591, 680), og=(1080,), unde=[L10],
   exercitii=[ex(L10, 250, 'explorerop', 'tema colegului din Clasa 5A neatinsă (neatins) și tema ta lipită cu alt nume')],
   bdov='aplicatii/explorer.js:532 — „Se omite acest fișier” nu atinge destinația; Esc = Se omite: 889',
   nota='Vechiul are și butonul X al ferestrei (605); fereastra bibliotecii n-are X. ' + NOTA_STARE + 'la neatins (id).')
fn('lipire_conflict_multe', 'Lipește mai multe fișiere dintre care unele se ciocnesc și răspunde într-o singură fereastră: „Destinația are N fișiere cu același nume” › Înlocuire fișiere / Se omit aceste fișiere (celelalte se lipesc).', 'Fișiere',
   'Lipire cu mai multe elemente; un clic în fereastră', og=(453, 459, 914, 915, 976, 977, 979), unde=[L11], bib='PARTIAL',
   bdov='aplicatii/explorer.js:518-534 — lipeste întreabă pe rând, câte o fereastră „Destinația are deja un fișier cu numele …” pentru fiecare fișier',
   lipsa='nu există fereastra grupată („Se copiază N elemente…”, „Destinația are N fișiere cu același nume”, „Înlocuire fișiere de la destinație”, „Se omit aceste fișiere”): elevul răspunde de N ori')
fn('lipire_folder_contopire', 'Lipește un folder unde există deja unul cu același nume: conținutul intră în el, iar fișierele cu același nume rămân cele din destinație (cu mesaj).', 'Fișiere',
   'Lipire a unui folder peste unul cu același nume', op=(305, 307, 573), unde=[L10, L11], bib='PARTIAL',
   bdov='aplicatii/explorer.js:526 — fereastra de conflict doar la fișiere; la folder muta/copiaza (230-231) pun cheile peste',
   lipsa='fișierele cu același nume din folderul-destinație sunt SUPRASCRISE fără nicio întrebare și fără mesaj (vechiul le păstra și spunea ce a omis)')
fn('lipire_subfolder', 'Încearcă să lipească un folder chiar în el sau într-un subfolder al lui și primește „Folderul destinație este un subfolder al folderului sursă.”.', 'Fișiere',
   'Decupare/Copiere pe folder, intră în el, Lipire', op=(292, 554), og=(436, 437), unde=[L10, L11], bib='NU',
   bdov='aplicatii/explorer.js:512-542 — lipeste nu verifică destinația (doar tragerea o verifică, 754); căutat „subfolder”, „întrerupt” în explorer.js',
   nota='DEFECT găsit la probă (T3): Decupare pe Romana, Lipire în Romana/Toamna → folderul Romana DISPARE din folderul de lucru, fără mesaj.')
fn('element_negasit', 'Lipește după ce a redenumit / mutat / șters sursa copiată și primește „Element negăsit — Imposibil de găsit acest element”, cu Încercați din nou / Anulare.', 'Fișiere',
   'Copiere, redenumire a sursei, Lipire', op=(290, 528, 592, 593), og=(432, 454), unde=[L10, L11], bib='NU',
   bdov='aplicatii/explorer.js:514-515 — sursele care nu mai există se sar, iar fără surse Lipire nu face nimic (fara_efect), fără fereastră (proba T5)')
fn('stergere_cos', 'Șterge elementele selectate în Coșul de reciclare (Delete, Ctrl + D, Ștergere din bară sau meniu), fără întrebare.', 'Coș de reciclare',
   'Delete; Ctrl + D; Ștergere', op=(394, 329, 576, 689), og=(950, 468), unde=TOATE,
   exercitii=[ex(L10, 268, 'explorerop', 'notite ștearsă și pusă înapoi'), ex(L10, 310, 'explorerop', 'atelier: sonerie - Copie ștearsă și restaurată'),
              ex(L12, 294, 'probaexp', 'inCos ciorna (chiar fișierul acela) și Coșul colegilor neatins')],
   bdov='aplicatii/explorer.js:570-576 — laCos; Ștergere: 650; Ctrl+D: 905; Delete: 912; meniu: 684',
   nota='Coșul bibliotecii pornește gol (M.cos = [], 194): o lecție nu poate pune „fișierele colegilor” în el (testele cosNeatins, l10:268, l12:294). in_cos din stare = doar ce venea din folderul de lucru (241).')
fn('stergere_definitiva', 'Șterge definitiv (Shift + Delete) și răspunde la „Sigur ștergeți definitiv acest fișier / acest folder / aceste N elemente?” (Da / Nu).', 'Coș de reciclare',
   'Shift + Delete; Da / Nu', op=(689, 547, 548, 595), og=(1090, 920, 983), unde=TOATE,
   exercitii=[ex(L10, 323, 'explorerop', 'intrebat: a apărut „Sigur ștergeți definitiv…?” (pe stick), răspuns Nu')], bib='PARTIAL',
   bdov='aplicatii/explorer.js:577-582 — un singur FIȘIER: „Ștergere fișier / Sigur ștergeți definitiv acest fișier?”, Da / Nu',
   lipsa='folder sau mai multe elemente → mesajul central (579; proba T8); lipsesc „Ștergere folder” și „Ștergere multiplă de elemente”')
fn('cos_restaurare', 'Pune înapoi la locul lui un element din Coș (Restaurare), cu folderele lui dacă nu mai există; în Coș vede Locația inițială și Data ștergerii.', 'Coș de reciclare',
   'în Coș: clic pe element, Restaurare elemente selectate (bară) sau clic dreapta › Restaurare', op=(582, 478, 511, 339, 338, 460), unde=[L10, L12], bib='PARTIAL',
   exercitii=[ex(L10, 268, 'explorerop', 'restaurat notite'), ex(L10, 310, 'explorerop', 'atelier: restaurat sonerie - Copie'), ex(L10, 343, 'explorerop', 'restaurat desen')],
   bdov='aplicatii/explorer.js:584-591 — restaureaza; doar din meniul Coșului (659, deschis la 840)',
   lipsa='bara de comenzi din Coș e cea obișnuită (proba T6): lipsește „Restaurare elemente selectate”; folderele-părinte lipsă nu se refac (588 pune doar cheile elementului); lista Coșului n-are coloanele Locație inițială / Data ștergerii')
fn('cos_restaurare_conflict', 'Restaurează un element când în locul lui există deja același nume și răspunde în „Înlocuire sau omitere fișiere” („Se mută un element la Restaurare”); Se omite îl lasă în Coș.', 'Coș de reciclare',
   'Restaurare, apoi Înlocuire / Se omite', op=(336, 539, 591), unde=[L10], bib='NU',
   bdov='aplicatii/explorer.js:588 — restaureaza suprascrie tăcut ce e în locul lui (M.F.set), fără fereastră')
fn('cos_restaurare_tot', 'Restaurează tot Coșul („Restaurare totală elemente”, „Sigur restaurați toate elementele…?”).', 'Coș de reciclare',
   'în Coș: Restaurare totală elemente; Da', op=(585, 477, 603), unde=[L10, L12], bib='NU',
   bdov='aplicatii/explorer.js:641-653 — comanda() n-are butonul; în Coș bara e cea obișnuită (proba T6); căutat „Restaurare totală”, „resttot” în explorer.js și date/explorer.json')
fn('cos_golire', 'Golește Coșul de reciclare („Golire Coș de reciclare”, „Sigur ștergeți definitiv aceste N elemente?”).', 'Coș de reciclare',
   'în Coș: Golire Coș de reciclare; Da', op=(584, 476, 602), og=(969,), unde=[L10, L12], bib='NU',
   bdov='căutat „Golire”, „gol” în aplicatii/explorer.js și date/explorer.json: butonul nu există; Ștergere în Coș → nesimulat (650)')
fn('cos_stergere_definitiva', 'Șterge definitiv un element din Coș (Delete sau Ștergere din meniul lui) după „Sigur ștergeți definitiv acest fișier?”.', 'Coș de reciclare',
   'în Coș: Delete / clic dreapta › Ștergere; Da', op=(583, 601, 510), unde=[L10, L12], bib='NU',
   bdov='aplicatii/explorer.js:912 — Delete în Coș → I.nesimulat(„Ștergere”) (proba T6); meniul Coșului are doar Restaurare (378-380, 659)')
fn('anulare', 'Anulează ultima operație cu Ctrl + Z, pas cu pas (mutare, redenumire, copiere, ștergere, folder nou; la mai multe elemente, tot grupul).', 'Fișiere',
   'Ctrl + Z', op=(686, 373, 376, 378, 379), og=(711, 714), unde=TOATE,
   bdov='aplicatii/explorer.js:592-598 — anuleaza din istoricul de instantanee; Ctrl+Z: 903; clic dreapta pe loc gol › „Anulare <op>”: 689',
   nota='Vechiul spune pe bară ce a anulat („Anulare Mutare: … e din nou unde era”); biblioteca nu.')
fn('cautare', 'Caută după nume din caseta „Căutați în <folder>” (Enter sau ⌕): găsește și în toate subfolderele și arată „Rezultatele căutării în <folder>”; ✕, Esc sau Înapoi închide; Ctrl + E / Ctrl + F / F3 duc în casetă.', 'Căutare',
   'scrie în caseta de căutare, Enter', op=(343, 346, 350, 351, 675, 618, 687, 438), unde=[L10, L12], bib='PARTIAL',
   exercitii=[ex(L10, 285, 'explorerop', 'gasit: compunere toamna, din Romana/Toamna, căutând din Documente'),
              ex(L10, 311, 'explorerop', 'atelier: gasit Alarm02 (în Alarme), căutat „alarm” din Ex Pop Ana'),
              ex(L12, 243, 'explorerop', 'gasit vara.jpg (Vacanta/Mare) și vara.mp3 (Vacanta) din Documente'),
              ex(L12, 321, 'probaexp', 'cautat: căutarea a găsit toamna.png / toamna.wav')],
   bdov='aplicatii/explorer.js:216-219 — vizibile(): filtrează doar copiii DIRECȚI ai folderului deschis după bucata de text; scrisul: 485-489; Esc: 873; Ctrl+E/F: 907',
   lipsa='nu caută în subfoldere (proba T1: 0 rânduri pentru un fișier din Romana/Toamna); nu există pagina „Rezultatele căutării în …”; F3 nu duce în casetă',
   nota='Testele gasit/cautat citesc istoricul căutărilor (s.cautari); stare() n-are căutări, iar ordine_afisata e doar a folderului de lucru.')
fn('cautare_rezultate_operatii', 'Lucrează direct în rezultatele căutării: alege un fișier găsit într-un subfolder și îl decupează / copiază, apoi îl lipește altundeva.', 'Căutare',
   'căutare, clic pe rezultat, Decupare, apoi Lipire în alt folder', op=(274, 273, 286), unde=[L12], bib='PARTIAL',
   exercitii=[ex(L12, 319, 'probaexp', 'mutat toamna.png găsită prin căutare în Imagini'), ex(L12, 320, 'probaexp', 'mutat toamna.wav în Sunete'),
              ex(L12, 344, 'explorerop', 'iarna.png și iarna.mp3, găsite din Documente, mutate în Proiect')],
   bdov='aplicatii/explorer.js:331 — lista afișată = vizibile(M.cur): se poate decupa doar ce e direct în folderul deschis',
   lipsa='fișierele din subfoldere nu apar în rezultate, deci nu pot fi alese de acolo')
fn('folder_doar_citire', 'În folderele lui Windows (Media) doar citește și copiază: Decupare, Ștergere, Redenumire, Folder nou și Lipire acolo sunt refuzate, cu mesaj.', 'Fișiere',
   'Decupare / Delete / F2 / Lipire în C:\\Windows\\Media', op=(288, 291, 386, 392, 575), unde=[L10, L11], bib='NU',
   bdov='căutat „doarCitire”, „citire”, „administrator”, „permisiune” în aplicatii/explorer.js: nu există foldere protejate; orice folder primește toate operațiile',
   nota='Ține de nav_acest_pc: în bibliotecă nici nu există folderul Media.')

# ---------------- doar afișate ----------------
DOAR = [
 {'grup': 'Comenzi care doar spun „azi nu…”', 'exemple': ['Proprietăți (meniu, Alt+Enter)', 'Vizualizare / Sortați după / Grupare după (meniul locului gol)', 'Afișați mai multe opțiuni', 'deschiderea unui fișier („Azi nu deschidem fișiere”)', 'Partajare (gri)', 'Nou › alte tipuri („azi facem doar foldere”)'], 'dovada': '%s:579' % OP},
 {'grup': 'Variante din ferestre care doar spun că nu se fac', 'exemple': ['„Comparați informațiile pentru ambele fișiere”', '„Decid pentru fiecare fișier” (explorer-organizare)'], 'dovada': '%s:594' % OP},
 {'grup': 'Abateri spuse pe ecran', 'exemple': ['tragerea cu mouse-ul („în Windows, pe același disc, ar MUTA…”)', 'Ctrl / Shift + clic în explorer-operatii („aici selectezi câte un singur element”)', 'Redenumire cu mai multe selectate (explorer-organizare)', 'Deschidere cu mai multe selectate (explorer-organizare)', 'Decupare în Coș („Din Coș pui înapoi cu Restaurare”)', 'clic simplu pe Coșul de pe desktop („se deschide cu dublu-clic”)', 'folder blocat („În acest Explorer mic nu intrăm…”)'], 'dovada': '%s:658' % OP},
 {'grup': 'Abateri spuse pe ecran (explorer-organizare)', 'exemple': ['Redenumire pe mai multe', 'Deschidere pe mai multe', 'Decid pentru fiecare fișier'], 'dovada': '%s:951' % OG},
]

NESIGURE = [
 "probaalege (lectii/v/m2-l12/index.html:327, ExplorerProba.alegere = explorer-proba.js:516-545) e o întrebare cu variante, nu o acțiune în Explorer: nu am făcut funcții din ea.",
 "Testele de organizare din explorer-organizare.js (organizat, criteriu, numeBune, total, faraRataciti, selectate; analiza 532-637 și rândul „Ce văd în ordinea ta”, 638-669) sunt logica exercițiilor lecției 11, nu funcții ale Explorer-ului; în bibliotecă nu există, iar stare() nu dă subfolderele pe care le-ar citi.",
 "Testele probei (explorer-proba.js:159-189: folderNou cu id nou, copiat / copiatSiPastrat / mutat / numit după dată+dimensiune sau id, inCos după id, doar, nimicInPlus) au nevoie de id, dată și dimensiune pe fiecare fișier și de tot arborele; stare() a bibliotecii (api §5) dă doar numele din folderul de lucru — e cea mai mare piedică la mutarea lecțiilor 10-12 pe bibliotecă.",
 "Configurația vechiului (fs cu dată și dimensiune pe fiecare fișier, unitati, doc, afisat, cos cu fișierele colegilor, blocat, doarCitire, start, acum) nu are pereche în continut-ul bibliotecii (arbore, continut, foldere_alaturate, sursa_lipirii, setari): data și dimensiunea sunt aceleași la toate (zona_continut.data_exemplu / dimensiune_exemplu, explorer.js:353).",
 "Ținutul apăsat pe telefon (550 ms) în bibliotecă se bizuie pe evenimentul contextmenu nativ al browserului (aplicatii.js:405); neprobat pe ecran atins.",
 "Butonul „↺ Reîncep exercițiul” (explorer-operatii.js:623, explorer-proba.js:481) e al ramei exercițiului, nu al Explorer-ului; nu l-am trecut ca funcție (în aplicatii.js nu există un echivalent).",
 "motor.js nu l-am citit: verificarea exercițiilor Explorer se face în simulatoare (api.checkButton / api.resolve, explorer-operatii.js:702-716, explorer-proba.js:482-500).",
 "Explorer-proba adaugă un singur comportament nou de gest: un clic oriunde în Explorer (sau pe Verifică) încheie întâi redenumirea ca Enter (explorer-proba.js:416-431, 358-363); l-am pus la funcția redenumire.",
]

CIT = [{'cale': OP, 'linii': 724}, {'cale': OG, 'linii': 1125, 'nota': 'diff față de explorer-operatii; citit tot ce e nou'}, {'cale': PR, 'linii': 549},
       {'cale': L10 + '/index.html', 'linii': 362, 'nota': 'exercițiile (grep + citit)'}, {'cale': L11 + '/index.html', 'linii': 370, 'nota': 'exercițiile'},
       {'cale': L12 + '/index.html', 'linii': 364, 'nota': 'exercițiile'}, {'cale': L15 + '/index.html', 'linii': 354, 'nota': 'exercițiul explorerop'},
       {'cale': L18 + '/index.html', 'linii': 342, 'nota': 'exercițiul explorerop'},
       {'cale': 'aplicatii/explorer.js (biblioteca)', 'linii': 988}, {'cale': 'aplicatii/aplicatii.js (biblioteca, părți)', 'linii': 781},
       {'cale': 'aplicatii/date/explorer.json (bara de comenzi, meniurile, prin json.load)', 'linii': 2683}, {'cale': '_campaign/aplicatii_fidele_2026_11/api_biblioteca.md §4-§5', 'linii': 344}]

out = {'parte': 'B', 'fisiere_citite': CIT, 'functii': F, 'doar_afisate': DOAR, 'nesigure': NESIGURE, 'neacoperit': ''}
dest = P + '/probe_explorer-windows/parte_B.json'
with open(dest, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

# ---------------- verificarea mecanică ----------------
d = json.load(open(dest, encoding='utf-8'))
err = []
COM = re.compile(r'^\s*(/\*|\*|//)')
def verif(cale, n, base):
    try:
        L = lines(cale, base)
    except Exception as e:
        return 'fișier lipsă ' + cale
    if n < 1 or n > len(L):
        return 'linie inexistentă %s:%d' % (cale, n)
    t = L[n - 1]
    if not t.strip() or COM.match(t):
        return 'linie comentariu/goală %s:%d: %s' % (cale, n, t.strip()[:60])
    return None
for fu in d['functii']:
    for v in fu['vechi_dovada']:
        c, n = v.rsplit(':', 1)
        r = verif(c, int(n), SRC)
        if r: err.append(fu['id'] + ' vechi ' + r)
    for m in re.finditer(r'(aplicatii/[\w./]+\.js):(\d+)', fu['biblioteca_dovada']):
        r = verif(m.group(1), int(m.group(2)), LIB)
        if r: err.append(fu['id'] + ' bib ' + r)
    for e in fu['exercitii']:
        m = re.match(r'([\w/.-]+\.html):(\d+)', e)
        r = verif(m.group(1), int(m.group(2)), SRC)
        if r: err.append(fu['id'] + ' ex ' + r)
    if fu['biblioteca'] == 'PARTIAL' and not fu['lipsa']: err.append(fu['id'] + ' PARTIAL fără lipsa')
    if fu['ceruta_de_exercitiu'] != bool(fu['exercitii']): err.append(fu['id'] + ' ceruta/exercitii')
for x in d['doar_afisate']:
    c, n = x['dovada'].rsplit(':', 1)
    r = verif(c, int(n), SRC)
    if r: err.append('doar_afisate ' + r)
from collections import Counter
cnt = Counter(f['biblioteca'] for f in d['functii'])
print('functii', len(d['functii']), dict(cnt), 'cerute', sum(f['ceruta_de_exercitiu'] for f in d['functii']))
print('ERORI', len(err))
for e in err: print(' ', e)
