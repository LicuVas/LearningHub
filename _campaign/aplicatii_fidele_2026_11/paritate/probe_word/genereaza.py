# Scrie paritate/word.json și paritate/word.md din inventarul de mai jos (agentul de paritate WORD, 21.11.2026).
# Verdictele vin din citirea codului (vechi: proba_src/, nou: aplicatii/word.js); căile vechi sunt relative la proba_src/.
import json, os

P = 'C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate'
SRC = P + '/proba_src/'

def ex(loc, tip, ce):
    pag, lin = loc.split(':')
    return f"t:'{tip}' din lectii/vii/{pag}/index.html:{lin} (verifică {ce})"

def J(cale, ce):
    return f"{cale} ({ce})"

F = []
def f(functie, grup, gest, vd, unde, exs, bib, bd, lipsa='', nota=''):
    F.append({'functie': functie, 'grup': grup, 'gest': gest, 'vechi_dovada': vd, 'unde': unde,
              'ceruta_de_exercitiu': bool(exs), 'exercitii': exs, 'biblioteca': bib, 'biblioteca_dovada': bd,
              'lipsa': lipsa, 'nota': nota})

S = 'lectii/_sim/'
L5 = ['lectii/vii/m1-l02', 'lectii/vii/m1-l04', 'lectii/vii/m1-l05', 'lectii/vii/m1-l06', 'lectii/vii/m1-l07', 'lectii/vii/m2-l08',
      'lectii/vii/m2-l09', 'lectii/vii/m2-l10']
FMT = ['lectii/vii/m1-l06', 'lectii/vii/m1-l07', 'lectii/vii/m2-l08', 'lectii/vii/m2-l09', 'lectii/vii/m2-l10']
JOC = ['jocuri/word-antrenament-vii', 'jocuri/word-obiecte-vii']
P365 = 'Profilul word2007: '

# ---------------------------------------------------------------- Editare text
f('Scrie text în document, la cursor', 'Editare text', 'tastare (pe telefon: caseta „Tastatura”)',
  [S + 'wordobj.js:506', S + 'wordobj-formatare.js:384', 'lectii/vii/m1-l04/index.html:331', 'jocuri/word-vii/index.html:312'],
  L5 + ['jocuri/word-vii'],
  [ex('m1-l04:541', 'wordobj', "cere tip:'text' — rând nou cu textul cerut"), ex('m1-l02:244', 'wordui', 'cuvinte:20 — câte cuvinte are textul')],
  'DA', 'aplicatii/word.js:231 — scrie(): textul intră la cursor, cu formatarea literei dinainte',
  nota='Biblioteca face în plus majuscula automată de la începutul propoziției (word.js:269).')
f('Enter face un paragraf nou (păstrează alinierea; cu text selectat îl înlocuiește)', 'Editare text', 'tasta Enter / butonul Enter de sub fereastră',
  [S + 'wordobj.js:563', S + 'wordobj-formatare.js:449', 'lectii/vii/m1-l04/index.html:339'], L5,
  [ex('m1-l04:541', 'wordobj', 'rândul nou de sub un paragraf'), ex('m1-l04:550', 'wordobj', 'rândul nou de sub un paragraf')],
  'DA', 'aplicatii/word.js:256 — enter(); word.js:148 — paragraful nou primește alinierea celui de sus')
f('⌫ șterge litera din stânga; la începutul paragrafului îl unește cu cel de sus', 'Editare text', 'tasta ⌫ (Backspace)',
  [S + 'wordobj.js:585', S + 'wordobj.js:596', 'lectii/vii/m1-l04/index.html:356'], L5 + ['jocuri/word-vii'],
  [ex('m1-l05:141', 'wordobj', "foloseste:'stergere'"), ex('m1-l05:151', 'wordobj', "foloseste:'stergere'")],
  'DA', 'aplicatii/word.js:280 — backspace(); sterge() unește paragrafele (word.js:124)')
f('Delete șterge litera din dreapta; la capătul paragrafului îl aduce pe următorul', 'Editare text', 'tasta Delete',
  [S + 'wordobj.js:598', S + 'wordobj.js:607'], L5 + ['jocuri/word-vii'],
  [ex('m1-l05:141', 'wordobj', "foloseste:'stergere'")],
  'DA', 'aplicatii/word.js:320 — del()')
f('Ctrl+⌫ / Ctrl+Delete șterg un cuvânt întreg', 'Editare text', 'Ctrl+Backspace, Ctrl+Delete',
  [S + 'wordobj.js:589', S + 'wordobj.js:602', S + 'wordobj-formatare.js:460'], ['lectii/vii/m1-l05', 'lectii/vii/m1-l06'], [],
  'DA', 'aplicatii/word.js:297 — stergeCuvant(); word.js:2148-2149',
  nota='Granițele cuvântului la punctuație sunt [presupus] în bibliotecă (R28-3).')
f('Șterge textul selectat (Delete / ⌫) și potrivește spațiile ca Word (Smart cut)', 'Editare text', 'selecție, apoi Delete sau ⌫',
  [S + 'wordobj.js:62', S + 'wordobj.js:522'], L5,
  [ex('m1-l05:141', 'wordobj', "foloseste:'stergere'"), ex('m1-l05:165', 'wordobj', 'sters: textul șters exact')],
  'PARTIAL', 'aplicatii/word.js:219 — stergeSelectia(true)',
  lipsa='Biblioteca scoate doar spațiul dublu rămas între două cuvinte. Vechiul (138 de cazuri probate în Word) scoate și spațiul rămas înaintea punctuației („mere .” → „mere.”) și pe cel rămas la începutul paragrafului.')
f('Tastarea peste o selecție o înlocuiește (după dublu-clic, spațiul de după cuvânt rămâne)', 'Editare text', 'selecție, apoi tastare',
  [S + 'wordobj.js:506', S + 'wordobj-interfata.js:379'], L5, [],
  'PARTIAL', 'aplicatii/word.js:235 — scrie() → stergeSelectia(false)',
  lipsa='Peste un cuvânt ales cu dublu-clic biblioteca șterge și spațiul de după el; vechiul (wordobj-interfata, probat de judecător) îl păstrează: „Plecăm joi la bunici.”.')
f('Tab pune un tab în text', 'Editare text', 'tasta Tab',
  [S + 'wordobj.js:579', S + 'wordobj-formatare.js:479'], L5, [],
  'DA', 'aplicatii/word.js:2150 — scrie(\'\\t\')',
  nota='La începutul unui paragraf cu text vechiul (wordobj-formatare) pune alineat, nu tab: vezi funcția despre alineatul cu Tab.')
f('Mută cursorul cu săgețile, Home / End, Ctrl+săgeți, Ctrl+Home / Ctrl+End', 'Navigare', 'tastele săgeți, Home, End (cu sau fără Ctrl); pe telefon butoanele ← →',
  [S + 'wordobj.js:918', S + 'wordobj.js:922', S + 'wordobj-interfata.js:400'], L5,
  [ex('m1-l02:127', 'wordui', 'cursorFinal — cursorul la capătul textului'), ex('m1-l02:174', 'wordui', "foloseste:'sageti'")],
  'DA', 'aplicatii/word.js:2151-2163 — muta1 / mutaRand / mutaParagraf / capRand')
f('Derulează documentul (bara de defilare, PageUp / PageDown)', 'Navigare', 'clic pe săgețile barei de defilare, PageUp / PageDown',
  [S + 'wordobj-interfata.js:422'], ['lectii/vii/m1-l02'], [],
  'DA', 'aplicatii/word.js:1932 (bara de defilare) și word.js:2164 (PageUp / PageDown)')
f('Pune cursorul cu un clic între două litere', 'Selectare', 'un clic în text',
  [S + 'wordobj.js:817'], L5 + ['jocuri/word-vii'],
  [ex('m1-l02:198', 'wordui', 'cursorPar — cursorul în paragraful cerut')],
  'DA', 'aplicatii/word.js:1812 — I.la.jos, un clic = cursor la poziția clicului',
  nota='În jocul word-vii cursorul se pune pe „liniuța” dintre cuvinte (jocuri/word-vii/index.html:270).')

# ---------------------------------------------------------------- Selectare
f('Selectează text trăgând cu mouse-ul sau cu degetul (după primul cuvânt, cuvinte întregi)', 'Selectare', 'apasă și trage peste text',
  [S + 'wordobj.js:848', S + 'wordobj.js:850'], L5,
  [ex('m1-l05:118', 'wordobj', 'selectat: textul selectat exact'), ex('m1-l05:125', 'wordobj', 'selectat: textul selectat exact')],
  'DA', 'aplicatii/word.js:1816 — I.la.misca, cu „automatically select entire word” (word.js:1826)',
  nota='În jocul word-vii selecția e pe cuvinte întregi, atinse unul câte unul (și ¶ = tot paragraful) — modelul jocului, jocuri/word-vii/index.html:268.')
f('Dublu-clic selectează cuvântul cu spațiul de după', 'Selectare', 'dublu-clic (două atingeri repezi)',
  [S + 'wordobj.js:844', S + 'wordobj.js:85'], L5, [ex('m1-l05:118', 'wordobj', 'selectat')],
  'DA', 'aplicatii/word.js:1810 și word.js:185 — cuvantCuSpatii()')
f('Triplu-clic selectează tot paragraful', 'Selectare', 'trei clicuri repezi',
  [S + 'wordobj.js:845'], L5, [],
  'DA', 'aplicatii/word.js:1811')
f('Ctrl+clic selectează propoziția', 'Selectare', 'Ctrl ținut + clic în propoziție',
  [S + 'wordobj.js:834', S + 'wordobj.js:96'], L5, [],
  'NU', 'Căutat în aplicatii/word.js: ctrlKey în I.la.jos (word.js:1774-1815) — tratează doar Shift; „propozi”, „sentence”: nimic.')
f('Shift+clic și Shift+săgeți măresc selecția', 'Selectare', 'Shift+clic, Shift+← → ↑ ↓ (pe telefon: butoanele Shift+← / Shift+→)',
  [S + 'wordobj.js:833', S + 'wordobj.js:925', S + 'wordobj-interfata.js:402'], L5, [],
  'DA', 'aplicatii/word.js:1805 (Shift+clic), word.js:2153 (Shift+săgeți)')
f('Ctrl+A selectează tot documentul (în celulă: textul celulei)', 'Selectare', 'Ctrl+A',
  [S + 'wordobj.js:908'], L5, [],
  'PARTIAL', 'aplicatii/word.js:2174 — selectează tot documentul',
  lipsa='Cu cursorul într-o celulă vechiul selectează textul celulei; biblioteca iese din celulă și selectează tot documentul (M.cel = null).')

# ---------------------------------------------------------------- Clipboard
f('Copiază textul selectat (Ctrl+C, Home › Copy, clic dreapta › Copy)', 'Clipboard', 'Ctrl+C / butonul Copy / meniul de clic dreapta',
  [S + 'wordobj.js:523', S + 'wordobj.js:888', S + 'wordobj.js:952', S + 'wordobj-formatare.js:438', 'jocuri/word-vii/index.html:238'],
  L5 + ['jocuri/word-vii'],
  [ex('m1-l05:190', 'wordobj', "foloseste:'copiere'"), ex('m1-l05:201', 'wordobj', "foloseste:'copiere'"), ex('m1-l05:266', 'wordobj', "foloseste:'copiere'")],
  'DA', 'aplicatii/word.js:448 — copiaza(); word.js:1717 (Copy), word.js:2184 (Ctrl+C), word.js:1738 (meniul, după nume)',
  nota='Vechiul face Cut / Copy gri fără selecție și Paste gri cu clipboardul gol; în bibliotecă nu am găsit asta (doar „fără document” e gri, word.js:1013).')
f('Decupează textul selectat (Ctrl+X, Home › Cut, clic dreapta › Cut)', 'Clipboard', 'Ctrl+X / butonul Cut / meniul de clic dreapta',
  [S + 'wordobj.js:523', S + 'wordobj.js:888', 'jocuri/word-vii/index.html:241'], L5 + ['jocuri/word-vii'],
  [ex('m1-l05:219', 'wordobj', "foloseste:'mutare'"), ex('m1-l05:226', 'wordobj', "foloseste:'mutare'")],
  'DA', 'aplicatii/word.js:454 — decupeaza(); word.js:1717, word.js:2185')
f('Lipește (Ctrl+V, Home › Paste, clic dreapta › Paste); peste o selecție o înlocuiește; păstrează formatarea copiată', 'Clipboard', 'Ctrl+V / butonul Paste / meniul de clic dreapta',
  [S + 'wordobj.js:530', S + 'wordobj.js:888', S + 'wordobj-formatare.js:443', 'jocuri/word-vii/index.html:244'], L5 + ['jocuri/word-vii'],
  [ex('m1-l05:190', 'wordobj', "foloseste:'copiere' (copiere + lipire)"), ex('m1-l05:219', 'wordobj', "foloseste:'mutare' (decupare + lipire)")],
  'PARTIAL', 'aplicatii/word.js:473 — lipeste(); word.js:1717 (Paste), word.js:2186 (Ctrl+V)',
  lipsa='Din meniul de clic dreapta biblioteca lipește doar prin „Keep Text Only” (fără formatare, word.js:1758); celelalte opțiuni de lipire dau mesajul central. Vechiul are în meniu „Paste” cu formatarea copiată.')
f('La lipire Word potrivește singur spațiile la ambele capete (Smart paste)', 'Clipboard', 'Ctrl+V lângă un cuvânt',
  [S + 'wordobj.js:73'], L5,
  [ex('m1-l05:190', 'wordobj', 'textul final exact, cu spațiile'), ex('m1-l05:219', 'wordobj', 'textul final exact, cu spațiile')],
  'PARTIAL', 'aplicatii/word.js:468 — spatiuInainte()',
  lipsa='Biblioteca pune doar spațiul dinaintea textului lipit. Vechiul mai pune spațiul de DUPĂ textul lipit lângă o literă, scoate spațiul de la începutul textului lipit la început de paragraf / după spațiu și pe cel de la capăt înaintea punctuației.',
  nota=P365 + 'biblioteca nu potrivește deloc spațiile (word.js:469, n-are referință).')
f('Mută textul selectat trăgându-l cu mouse-ul', 'Clipboard', 'apasă pe selecție și trage în alt loc',
  [S + 'wordobj.js:540', S + 'wordobj.js:874', S + 'wordobj-formatare.js:481'], L5,
  [ex('m1-l05:246', 'wordobj', "foloseste:'mutare'"), ex('m1-l05:300', 'wordobj', "foloseste:'mutare'")],
  'DA', 'aplicatii/word.js:486 — muta(); word.js:1834')
f('Ctrl+tragere copiază textul selectat (originalul rămâne)', 'Clipboard', 'Ctrl ținut la eliberarea tragerii',
  [S + 'wordobj.js:874', S + 'wordobj.js:545'], L5, [],
  'NU', 'Căutat în aplicatii/word.js: ctrlKey în I.la.sus (word.js:1833-1849) și în muta() (word.js:486) — tragerea doar mută, fără variantă de copiere.')

# ---------------------------------------------------------------- Anulare
f('Ctrl+Z anulează ultima operație (și butonul Ctrl+Z de sub fereastră)', 'Anulare', 'Ctrl+Z',
  [S + 'wordobj.js:514', S + 'wordobj-formatare.js:398', S + 'wordobj-pagina.js:347', S + 'wordobj-hartie.js:154', S + 'wordteh-stiluri.js:188', 'jocuri/word-vii/index.html:237'],
  L5 + ['jocuri/word-vii'],
  [ex('m1-l05:165', 'wordobj', "foloseste:'anulare'"), ex('m1-l02:218', 'wordui', "foloseste:'anulare'"), ex('m1-l02:225', 'wordui', "foloseste:'anulare'")],
  'DA', 'aplicatii/word.js:328 — anuleaza(); word.js:2182',
  nota=P365 + 'Ctrl+Z anulează literă cu literă (word.js:206, contractul I4), ca în laboratorul cu Word 2007.')
f('Ctrl+Y reface ce ai anulat', 'Anulare', 'Ctrl+Y (pe telefon butonul Ctrl+Y)',
  [S + 'wordobj.js:519', S + 'wordobj-interfata.js:327', S + 'wordobj-formatare.js:403'], L5,
  [ex('m1-l02:218', 'wordui', "foloseste:'refacere'"), ex('m1-l02:283', 'wordui', "foloseste:'refacere'")],
  'DA', 'aplicatii/word.js:335 — reface(); word.js:2183')
f('Ctrl+Y fără nimic de refăcut repetă ultima acțiune (tastarea, ⌫, Delete, Enter, o comandă)', 'Anulare', 'Ctrl+Y după o acțiune',
  [S + 'wordobj-interfata.js:327'], ['lectii/vii/m1-l02'], [],
  'PARTIAL', 'aplicatii/word.js:338-351 — repetă tastarea și o comandă B / I / U',
  lipsa='Nu repetă ⌫, Delete și Enter: M.ultima se golește la orice operație care nu e tastare (word.js:214). Vechiul le repetă (probat în Word).')
f('Anularea pe operații ca în Word: ⌫ în mijlocul tastării o rupe în două; fiecare ⌫ / Delete e câte o operație', 'Anulare', 'tastare, ⌫, tastare, apoi Ctrl+Z',
  [S + 'wordobj-interfata.js:345'], ['lectii/vii/m1-l02'], [],
  'PARTIAL', 'aplicatii/word.js:206 — grupeaza(): tastarea e o operație',
  lipsa='Biblioteca grupează ⌫-urile (și Delete-urile) la rând într-o singură anulare; vechiul: 3 × ⌫ = 3 × Ctrl+Z (probat în Word 16).',
  nota='Diferență de comportament, nu de buton: de lămurit cu referința (vezi nesigure).')

# ---------------------------------------------------------------- Formatare caractere
for nume, camp, cuv, exs in [
    ('Aldin', 'b', 'Bold', [ex('m1-l06:118', 'wordfmt', 'b:1, doar acolo'), ex('m1-l06:180', 'wordfmt', 'textul tastat după B e aldin'), ex('m2-l08:212', 'wordteh', 'b:1 pe titlu'), ex('m2-l10:331', 'probafmt', 'b:1')]),
    ('Cursiv', 'i', 'Italic', [ex('m1-l06:126', 'wordfmt', 'i:1, doar acolo'), ex('m1-l06:271', 'wordfmt', 'i:1'), ex('m2-l09:457', 'wordfmt', 'i:1'), ex('m2-l10:375', 'probafmt', 'i:1')]),
    ('Subliniat', 'u', 'Underline', [ex('m1-l06:126', 'wordfmt', 'u:1, doar acolo'), ex('m1-l06:172', 'wordfmt', 'u:1'), ex('m1-l06:252', 'wordfmt', 'u:1')])]:
    f(f'{nume}: pornește / oprește {nume.lower()}ul textului selectat', 'Formatare text',
      f'butonul {camp.upper()} ({cuv}) de pe Home sau Ctrl+{camp.upper()}',
      [S + 'wordobj-formatare.js:413', S + 'wordobj-formatare.js:776', S + 'wordobj-formatare.js:708', 'jocuri/word-vii/index.html:261'],
      FMT + ['jocuri/word-vii'], exs,
      'PARTIAL', f"aplicatii/word.js:381 — comuta('{camp}'); word.js:1704 ({cuv}), word.js:2175-2177 (Ctrl+{camp.upper()})",
      lipsa='Pe o selecție amestecată vechiul hotărăște după PRIMUL caracter („vin” aldin + „eri” normal → tot normal; probat prin COM); biblioteca pune formatarea dacă nu e deja pe tot textul.',
      nota='Restul (pornit / oprit, a doua apăsare scoate) e la fel.')
F[-1]['functie'] = 'Subliniat: pornește / oprește sublinierea textului selectat'
F[-3]['functie'] = 'Aldin: pornește / oprește aldinul textului selectat'
F[-2]['functie'] = 'Cursiv: pornește / oprește cursivul textului selectat'
f('Fără selecție, cu cursorul în mijlocul unui cuvânt: formatarea se pune pe tot cuvântul', 'Formatare text', 'un clic în cuvânt, apoi B / I / U / mărimea',
  [S + 'wordobj-formatare.js:413'], FMT,
  [ex('m1-l06:172', 'wordfmt', "foloseste:'cursor' + u:1 pe cuvânt")],
  'DA', 'aplicatii/word.js:359 — intervalFormat(): cuvântul cursorului')
f('Formatarea pentru ce tastezi de acum (cursorul la capăt, apeși B, apoi scrii)', 'Formatare text', 'cursor la capăt, B / I / U, apoi tastare',
  [S + 'wordobj-formatare.js:327'], FMT,
  [ex('m1-l06:180', 'wordfmt', '„Diriginta” tastat după B e aldin, restul nu')],
  'DA', 'aplicatii/word.js:385 — M.fmtIns, formatul literelor tastate de acum')
f('Schimbă fontul (lista Font sau numele scris în casetă)', 'Formatare text', 'caseta Font ▾ (Home), alegi sau scrii numele + Enter',
  [S + 'wordobj-formatare.js:750', S + 'wordobj-formatare.js:766', S + 'wordobj-formatare.js:773'], FMT,
  [ex('m1-l06:154', 'wordfmt', "font:'Arial' / 'Times New Roman'"), ex('m2-l08:243', 'wordteh', 'fonturiDe — cel mult un font'), ex('m2-l09:413', 'wordfmt', "font:'Comic Sans MS'"),
   ex('m2-l09:457', 'wordfmt', "font:'Georgia'"), ex('m2-l10:270', 'wordfmt', "font:'Arial'"), ex('m2-l10:375', 'probafmt', "font:'Georgia'")],
  'NU', "Căutat „font” în aplicatii/word.js: modelul literei are doar b / i / u / sz (word.js:20); caseta Font doar ARATĂ „Calibri (Body)” sau „Calibri Light” (word.js:979); CMD (word.js:1703) n-are „Font”.")
f('Schimbă mărimea literelor (lista Font Size 8–72 sau un număr scris, 1–1638, din 0,5 în 0,5)', 'Formatare text', 'caseta Font Size ▾ sau numărul scris + Enter',
  [S + 'wordobj-formatare.js:743', S + 'wordobj-formatare.js:767', S + 'wordobj-formatare.js:774'], FMT,
  [ex('m1-l06:146', 'wordfmt', 'sz:20'), ex('m1-l06:252', 'wordfmt', 'sz:24'), ex('m2-l08:212', 'wordteh', 'sz:16'), ex('m2-l09:413', 'wordfmt', 'sz:16 / 24 / 28'), ex('m2-l10:331', 'probafmt', 'sz:20')],
  'DA', 'aplicatii/word.js:367 — marimeLa(); word.js:1706 (caseta), word.js:1455 (lista)')
f('Grow Font / Shrink Font (A↑ / A↓) și Ctrl+Shift+> / Ctrl+Shift+<', 'Formatare text', 'butoanele A↑ / A↓ de pe Home sau Ctrl+Shift+> / <',
  [S + 'wordobj-formatare.js:406', S + 'wordobj-formatare.js:717', S + 'wordobj-formatare.js:777', 'jocuri/word-vii/index.html:262'], FMT + ['jocuri/word-vii'], [],
  'PARTIAL', 'aplicatii/word.js:403 — marimeFont(); word.js:1705',
  lipsa='Peste 72 nu mai crește (vechi: 80, 90…) și sub 8 nu mai scade (vechi: 7, 6… până la 1); Ctrl+Shift+> / < nu sunt prinse (aplicatii.js:300: gestul cu Ctrl+Shift cere o literă).',
  nota='În jocul word-vii mărimile sunt doar 11 · 14 · 18 · 24 (modelul jocului).')
f('Culoarea literelor (Font Color: butonul pune culoarea lui, ▾ culorile standard și Automatic)', 'Formatare text', 'butonul Font Color și săgeata ▾ de lângă el',
  [S + 'wordobj-formatare.js:768', S + 'wordobj-formatare.js:778'], FMT,
  [ex('m1-l06:146', 'wordfmt', "col:'rosu'"), ex('m1-l06:271', 'wordfmt', "col:'albastru'"), ex('m2-l09:413', 'wordfmt', "col:'albastru'"), ex('m2-l10:375', 'probafmt', "col:'albastru'")],
  'NU', 'Căutat „col”, „color”, „FontColorPicker” în aplicatii/word.js: id-ul e doar în date (date/word.json), CMD (word.js:1703) nu-l are; modelul literei n-are culoare (word.js:20).')
f('Ctrl+Space scoate formatarea caracterelor', 'Formatare text', 'Ctrl+Space',
  [S + 'wordobj-formatare.js:720', S + 'wordobj-formatare.js:408'], FMT, [],
  'NU', 'Căutat ctrl_space / „ ” în aplicatii/word.js și aplicatii.js: niciun gest.')

# ---------------------------------------------------------------- Formatare paragraf
f('Aliniază paragraful: la stânga, centrat, la dreapta, stânga-dreapta (a doua apăsare îl întoarce)', 'Formatare paragraf',
  'butoanele Align Left / Center / Align Right / Justify (Home) sau Ctrl+L / E / R / J',
  [S + 'wordobj-formatare.js:429', S + 'wordobj-formatare.js:779', S + 'wordobj-formatare.js:708', 'jocuri/word-vii/index.html:256'], FMT + ['jocuri/word-vii'],
  [ex('m1-l06:203', 'wordfmt', 'al: center / left / right'), ex('m1-l06:211', 'wordfmt', 'al: justify'), ex('m2-l08:212', 'wordteh', "al:'center'"), ex('m2-l09:360', 'wordfmt', 'al'), ex('m2-l10:238', 'wordfmt', "al:'justify'")],
  'DA', 'aplicatii/word.js:420 — aliniaza(); word.js:1714-1715 (butoanele), word.js:2178-2181 (taste)',
  nota='Variantele: stânga, centrat, dreapta, stânga-dreapta; aceeași regulă de comutare în amândouă.')
f('Mărește / micșorează retragerea din stânga (Increase / Decrease Indent, Ctrl+M / Ctrl+Shift+M), câte 1,25 cm', 'Formatare paragraf',
  'butoanele Increase / Decrease Indent (Home) sau Ctrl+M / Ctrl+Shift+M',
  [S + 'wordobj-formatare.js:433', S + 'wordobj-formatare.js:780', S + 'wordobj-formatare.js:719'], FMT,
  [ex('m1-l06:234', 'wordfmt', 'st:1.25'), ex('m1-l06:296', 'wordfmt', 'st:0 / st:1.25')],
  'NU', 'Căutat IndentIncrease, indent, „retrag” în aplicatii/word.js: Ctrl+M și Ctrl+Shift+M sunt în NESIM_TASTE (word.js:2015-2016); paragraful n-are retragere în model (word.js:58).')
f('Tab la începutul unui paragraf cu text pune alineat (1,25 cm); ⌫ la început îl scoate', 'Formatare paragraf', 'Tab / ⌫ cu cursorul la începutul paragrafului',
  [S + 'wordobj-formatare.js:477', S + 'wordobj-formatare.js:464'], FMT,
  [ex('m1-l06:234', 'wordfmt', 'prim:1.25 — alineatul primului rând'), ex('m1-l06:296', 'wordfmt', 'prim')],
  'NU', 'aplicatii/word.js:2150 — Tab scrie un caracter tab; modelul paragrafului n-are alineat (word.js:58).')
f('Fereastra Paragraph: retragerea din stânga / dreapta și Special (First line / Hanging, By)', 'Formatare paragraf',
  'lansatorul ↘ al grupului Paragraph, câmpurile Indentation, OK',
  [S + 'wordobj-formatare.js:784', S + 'wordobj-formatare.js:797', S + 'wordobj-formatare.js:804'], FMT,
  [ex('m1-l06:234', 'wordfmt', "prim:1.25, st:1.25 + foloseste:'fereastra'"), ex('m2-l10:375', 'probafmt', 'prim:1.25')],
  'NU', "aplicatii/word.js:1719 — fereastra Paragraph se deschide (desenată din date), dar OK doar o închide (implicitDialog, word.js:1234: inchideDialog(); return 'ok').")
f('Spațiul înainte / după paragraf (fereastra Paragraph › Spacing Before / After)', 'Formatare paragraf', 'fereastra Paragraph, Before / After, OK',
  [S + 'wordobj-formatare.js:803'], FMT, [],
  'NU', 'Fereastra Paragraph n-are efect la OK (word.js:1234); paragraful n-are spații înainte / după în model (word.js:58).')
f('Spațierea dintre rânduri (Line and Paragraph Spacing ▾ 1.0 – 3.0, fereastra Paragraph, Ctrl+1 / 2 / 5)', 'Formatare paragraf',
  'butonul Line and Paragraph Spacing ▾ sau fereastra Paragraph › Line spacing, sau Ctrl+1 / Ctrl+2 / Ctrl+5',
  [S + 'wordobj-formatare.js:572', S + 'wordobj-formatare.js:769', S + 'wordobj-formatare.js:710'], FMT,
  [ex('m1-l06:234', 'wordfmt', 'rand:1.5'), ex('m1-l06:244', 'wordfmt', 'rand:1.08 / 1.5 / 2'), ex('m1-l06:271', 'wordfmt', 'rand:1.5'), ex('m2-l10:375', 'probafmt', 'rand:1.5')],
  'NU', 'Lista LineSpacingGallery e doar în date (date/word.json › lista.LineSpacingGallery), fără comandă în CMD (word.js:1703); Ctrl+1/2/5: niciun caz în word.js:2143-2206.')
f('Ctrl+Q scoate formatarea paragrafului', 'Formatare paragraf', 'Ctrl+Q',
  [S + 'wordobj-formatare.js:710'], FMT, [],
  'NU', 'aplicatii/word.js:2016 — Ctrl+Q e în NESIM_TASTE (mesajul central).')
f('Arată / ascunde semnele ¶ și · (butonul ¶ Show/Hide)', 'Formatare paragraf', 'butonul ¶ din grupul Paragraph (Home); pe telefon tasta ¶ de sub fereastră',
  [S + 'wordobj-interfata.js:404', S + 'wordobj-formatare.js:781', S + 'wordobj-tehnoredactare.js:312', 'jocuri/word-vii/index.html:320'],
  ['lectii/vii/m1-l02', 'lectii/vii/m1-l06', 'lectii/vii/m2-l08', 'lectii/vii/m2-l10', 'jocuri/word-vii'],
  [ex('m1-l02:191', 'wordui', 'pil:true'), ex('m1-l02:198', 'wordui', 'pil:true'), ex('m1-l02:244', 'wordui', 'pil:true'), ex('m2-l08:144', 'wordteh', 'pil:true'), ex('m2-l08:293', 'wordteh', 'pil:true')],
  'NU', 'Butonul ParagraphMarks e desenat (date/word.json) și starea lui citește M.semne (word.js:971), dar nimic nu schimbă M.semne (apare doar la word.js:68, 868, 971); CMD (word.js:1703) n-are ParagraphMarks; Ctrl+* nu e prins.')

# ---------------------------------------------------------------- Stiluri
f('Pune un stil din galeria Styles pe paragraf (Normal, No Spacing, Heading 1, Heading 2, Title)', 'Stiluri', 'clic pe dala stilului din Home › Styles',
  [S + 'wordteh-stiluri.js:180', S + 'wordteh-stiluri.js:74'], ['lectii/vii/m2-l08'],
  [ex('m2-l08:252', 'wordstil', "stil Heading 1 pe titlu, restul Normal")],
  'PARTIAL', "aplicatii/word.js:441 — stil(); word.js:1754 (dala din panglică)",
  lipsa='Stilul schimbă doar mărimea (word.js:16; Heading 1 = 16, Heading 2 = 13, vechi 20 / 16 cu Calibri Light și albastru #2F5496), nu fontul, culoarea și spațiile; nu scoate formatarea pusă de mână și alinierea (vechiul da, probat); pe o bucată selectată dintr-un paragraf (stil legat: Heading 1/2, Title) biblioteca schimbă tot paragraful.')
f('Enter la capătul unui titlu: paragraful nou e Normal', 'Stiluri', 'Enter la capătul paragrafului cu stil',
  [S + 'wordteh-stiluri.js:193'], ['lectii/vii/m2-l08'], [],
  'DA', 'aplicatii/word.js:148 — insereaza(): Heading / Title la capăt → Normal')

# ---------------------------------------------------------------- Tabel
f('Inserează un tabel din grila Insert › Table (alegi coloane × rânduri)', 'Tabel', 'Insert › Table ▾, clic pe pătrățelul din grilă (pe telefon: două atingeri)',
  [S + 'wordobj.js:954', S + 'wordobj.js:617', 'lectii/vii/m1-l04/index.html:373'],
  ['lectii/vii/m1-l04', 'lectii/vii/m1-l05', 'lectii/vii/m2-l10'],
  [ex('m1-l04:624', 'wordobj', "cere tip:'tabel' — tabel cu R rânduri × C coloane, sub paragraful cerut"), ex('m1-l04:633', 'wordobj', "cere tip:'tabel'"), ex('m2-l10:245', 'wordobj', "cere tip:'tabel'"), ex('m2-l10:350', 'probaobj', "cere tip:'tabel'")],
  'DA', 'aplicatii/word.js:1721 (TableInsertGallery) → grilaTabel (word.js:1075) → insereazaTabel (word.js:501)')
f('Inserează un tabel din fereastra Insert Table (numărul de coloane și de rânduri)', 'Tabel', 'Insert › Table ▾ › Insert Table..., scrii numerele, OK',
  [S + 'wordobj.js:967', 'lectii/vii/m1-l04/index.html:439'], ['lectii/vii/m1-l04', 'lectii/vii/m2-l10'],
  [ex('m1-l04:633', 'wordobj', "cere tip:'tabel'"), ex('m1-l04:652', 'wordobj', "cere tip:'tabel'")],
  'DA', 'aplicatii/word.js:1467 — okTabel()')
f('Scrie și șterge text într-o celulă', 'Tabel', 'clic în celulă, tastare, ⌫ / Delete',
  [S + 'wordobj.js:506', 'lectii/vii/m1-l04/index.html:331', 'lectii/vii/m1-l04/index.html:358'], ['lectii/vii/m1-l04', 'lectii/vii/m2-l10'],
  [ex('m1-l04:640', 'wordobj', "cere tip:'tabel' cu text în celule")],
  'DA', 'aplicatii/word.js:522 — scrieCelula(); word.js:531 — stergeCelula(); word.js:1789 (clic în celulă)')
f('Tab trece în celula următoare; în ultima celulă adaugă un rând', 'Tabel', 'tasta Tab în tabel',
  [S + 'wordobj.js:580', S + 'wordobj.js:582', 'lectii/vii/m1-l04/index.html:348'], ['lectii/vii/m1-l04', 'lectii/vii/m2-l10'], [],
  'DA', 'aplicatii/word.js:544 — tabInTabel()')
f('Enter într-o celulă face un rând nou în celulă (celula devine mai înaltă)', 'Tabel', 'Enter cu cursorul în celulă',
  [S + 'wordobj.js:571', 'lectii/vii/m1-l04/index.html:345'], ['lectii/vii/m1-l04'], [],
  'NU', "aplicatii/word.js:257 — enter(): în celulă întoarce 'fara_efect'.")
f('Alege stilul tabelului din galeria Table Design (Table Grid, Grid Table 4 - Accent 1…)', 'Tabel', 'cursorul în tabel, fila Table Design, clic pe stil',
  [S + 'wordobj-pagina.js:517', S + 'wordobj-pagina.js:667'], ['lectii/vii/m1-l07', 'lectii/vii/m2-l10'],
  [ex('m1-l07:178', 'wordpag', "stil:'Grid Table 4 - Accent 1/6'"), ex('m1-l07:186', 'wordpag', 'stil'), ex('m1-l07:290', 'wordpag', 'stil'), ex('m2-l10:364', 'probapag', 'stil'), ex('m2-l10:425', 'wordpag', 'stil')],
  'NU', 'Căutat TableStyle, „stil tabel”, Ctx_TableDesign în aplicatii/word.js: fila contextuală e doar desenată (word.js:1035), CMD (word.js:1703) n-are comenzi de tabel în afară de inserare; tabelul n-are stil în model (word.js:77).')
f('Bifele Table Style Options: Header Row, Banded Rows, First Column (și rândul de antet din jocuri)', 'Tabel', 'fila Table Design, bifele din stânga; în jocuri butonul „Rând de antet”',
  [S + 'wordobj-pagina.js:518', S + 'wordobj-pagina.js:680', 'jocuri/word-antrenament-vii/index.html:206', 'jocuri/word-obiecte-vii/index.html:213'],
  ['lectii/vii/m1-l07', 'lectii/vii/m2-l10'] + JOC,
  [ex('m1-l07:178', 'wordpag', 'antet'), ex('m1-l07:253', 'wordpag', 'antet'), ex('m2-l10:364', 'probapag', 'antet'), J('jocuri/word-antrenament-vii/index.html:112', "tipul 'pagina', problems() verifică rândul de antet")],
  'NU', 'Aceeași căutare: nicio comandă pentru bifele Table Design în aplicatii/word.js; stare().tabele are doar randuri / coloane / celule (word.js:624).')
f('Lățimea unei coloane, trăgând de linia dintre coloane', 'Tabel', 'trage de linia verticală dintre două coloane (sau din dreapta tabelului)',
  [S + 'wordobj-pagina.js:565', S + 'wordobj-pagina.js:605'], ['lectii/vii/m1-l07'],
  [ex('m1-l07:206', 'wordpag', 'col:1 incape — numele încape pe un rând'), ex('m1-l07:214', 'wordpag', 'col:1 / col:3 — lățimea coloanei')],
  'NU', 'Căutat lățime / col / tragere în tabel: deseneazaTabel (word.js:836) n-are mânere, tabelul n-are lățimi de coloane în model (word.js:77).',
  nota='Testele incape / col din m1-l07 se pot trece și cu AutoFit Contents.')
f('AutoFit: Contents / Window / Fixed Column Width', 'Tabel', 'Table Layout › AutoFit ▾ sau clic dreapta în tabel › AutoFit',
  [S + 'wordobj-pagina.js:520', S + 'wordobj-pagina.js:668'], ['lectii/vii/m1-l07'],
  [ex('m1-l07:206', 'wordpag', 'incape (se poate și cu tragerea liniei)')],
  'NU', 'Căutat AutoFit în aplicatii/word.js: nimic.')
f('View Gridlines: arată liniile tabelului care n-au chenar', 'Tabel', 'Table Layout › View Gridlines',
  [S + 'wordobj-pagina.js:676'], ['lectii/vii/m1-l07'], [],
  'NU', 'Căutat Gridlines în aplicatii/word.js: nimic (ViewGridlinesWord doar în date).')
f('Adaugă sau scoate rânduri și coloane din tabel', 'Tabel', 'în jocuri: butoanele − / + de la „Rânduri” și „Coloane”',
  ['jocuri/word-antrenament-vii/index.html:205', 'jocuri/word-obiecte-vii/index.html:212'], JOC,
  [J('jocuri/word-antrenament-vii/index.html:112', "tipul 'pagina', problems() verifică numărul de rânduri și coloane"), J('jocuri/word-obiecte-vii/index.html:119', "tipul 'pagina', la fel")],
  'PARTIAL', 'aplicatii/word.js:550-559 — doar Tab în ultima celulă adaugă un rând',
  lipsa='Nu se poate adăuga un rând / o coloană în alt loc și nu se poate șterge un rând / o coloană (Table Layout n-are comenzi).')
f('Îmbină celulele primului rând (Merge Cells)', 'Tabel', 'în jocuri: butonul „Primul rând cu celulele îmbinate”',
  ['jocuri/word-antrenament-vii/index.html:206', 'jocuri/word-obiecte-vii/index.html:213'], JOC,
  [J('jocuri/word-antrenament-vii/index.html:112', "tipul 'pagina', problems() verifică îmbinarea când tabelul are titlu")],
  'NU', 'Căutat Merge / îmbin în aplicatii/word.js: nimic.')

# ---------------------------------------------------------------- Imagine
f('Inserează o poză din calculator (Insert › Pictures › This Device…: folderele Imagini / Descărcări, alegi fișierul, Insert sau dublu-clic)', 'Imagine',
  'Insert › Pictures ▾ › This Device…, alegi folderul și poza, Insert (sau dublu-clic pe ea)',
  [S + 'wordobj.js:609', S + 'wordobj.js:966', S + 'wordobj.js:971', 'lectii/vii/m1-l04/index.html:366'], ['lectii/vii/m1-l04', 'lectii/vii/m2-l10'],
  [ex('m1-l04:570', 'wordobj', "cere tip:'poza' — poza cerută, în paragraful cerut"), ex('m1-l04:580', 'wordobj', "cere tip:'poza'"), ex('m2-l10:350', 'probaobj', "cere tip:'poza'")],
  'PARTIAL', 'aplicatii/word.js:1732 (meniul Pictures) → fereastra Insert Picture → insereazaImagine (word.js:1459)',
  lipsa='Poza se desenează la începutul paragrafului, nu la cursor (word.js:858), e un dreptunghi fără desenul fișierului și nu rămâne selectată; în fereastră apar doar fișierele date în conținut (`fisiere`), nu un folder Imagini cu poze gata puse.')
f('Selectează poza cu un clic (chenar, 8 mânere, butonul Layout Options, fila Picture Format)', 'Imagine', 'un clic pe poză',
  [S + 'wordobj-pagina.js:575', S + 'wordobj.js:830'], ['lectii/vii/m1-l04', 'lectii/vii/m1-l07', 'lectii/vii/m2-l09', 'lectii/vii/m2-l10'], [],
  'PARTIAL', 'aplicatii/word.js:1799 — clicul pe poză aduce fila Picture Format',
  lipsa='Nu desenează chenarul, mânerele și butonul Layout Options; poza nu e „selectată” în model (Delete / Enter nu se aplică ei).')
f('Mărește / micșorează poza trăgând de mânerul din colț (păstrează proporția)', 'Imagine', 'trage de un cerculeț din colțul pozei',
  [S + 'wordobj-pagina.js:561', S + 'wordobj-pagina.js:600'], ['lectii/vii/m1-l07', 'lectii/vii/m2-l09', 'lectii/vii/m2-l10'],
  [ex('m1-l07:120', 'wordpag', 'poza cu lățimea minimă, prop:true'), ex('m1-l07:128', 'wordpag', 'prop:true'), ex('m2-l09:477', 'wordpag', 'wmin, prop'), ex('m2-l10:262', 'wordpag', 'wmin, prop')],
  'NU', 'Căutat mânere / resize / lățimea pozei în aplicatii/word.js: poza n-are mărime în model (M.img = {p, fisier}, word.js:1462).',
  nota='Testele de mărime se pot trece și cu casetele Shape Height / Width.')
f('Trage de mânerul de pe latură: se schimbă o singură dimensiune', 'Imagine', 'trage de cerculețul de pe o latură',
  [S + 'wordobj-pagina.js:601'], ['lectii/vii/m1-l07'], [],
  'NU', 'Aceeași căutare ca la mânerul din colț: nimic.')
f('Scrie înălțimea sau lățimea pozei în casetele Shape Height / Shape Width (cu blocarea proporției)', 'Imagine', 'Picture Format › Size, scrii numărul + Enter',
  [S + 'wordobj-pagina.js:525', S + 'wordobj-pagina.js:689'], ['lectii/vii/m1-l07', 'lectii/vii/m2-l09', 'lectii/vii/m2-l10'],
  [ex('m1-l07:120', 'wordpag', 'wmin — lățimea pozei'), ex('m2-l09:423', 'wordpag', 'wmin, prop')],
  'NU', 'Fila Picture Format e doar desenată (date › panglica_context.Ctx_PictureFormat); CMD (word.js:1703) n-are Shape Height / Width.')
f('Încadrarea pozei în text (Wrap Text: In Line, Square, Tight, Through, Top and Bottom, Behind Text, In Front of Text)', 'Imagine',
  'Picture Format / Layout › Wrap Text, butonul Layout Options sau clic dreapta › Wrap Text; în jocuri butoanele „Încadrarea textului”',
  [S + 'wordobj-pagina.js:514', S + 'wordobj-pagina.js:663', 'jocuri/word-antrenament-vii/index.html:204', 'jocuri/word-obiecte-vii/index.html:211'],
  ['lectii/vii/m1-l07'] + JOC,
  [ex('m1-l07:151', 'wordpag', "wrap:'square' / 'topbottom'"), ex('m1-l07:159', 'wordpag', "wrap:'behind' / 'front'"), ex('m1-l07:285', 'wordpag', "wrap:'square' / 'tight'"),
   J('jocuri/word-antrenament-vii/index.html:112', "tipul 'pagina', problems() verifică încadrarea")],
  'NU', 'Căutat wrap, Wrap Text, încadr în aplicatii/word.js: nimic; stare().imagini.flotante e mereu 0 (word.js:625).')
f('Enter cu poza selectată o coboară pe rândul următor', 'Imagine', 'selectezi poza, apoi Enter',
  [S + 'wordobj.js:566', 'lectii/vii/m1-l04/index.html:341'], ['lectii/vii/m1-l04'], [],
  'NU', 'Poza nu se poate selecta în modelul bibliotecii (vezi selectarea pozei); enter() lucrează doar pe text (word.js:256).')
f('Șterge poza selectată (⌫ sau Delete); ⌫ lângă poză NU o șterge', 'Imagine', 'selectezi poza, apoi ⌫ / Delete',
  ['lectii/vii/m1-l04/index.html:358', S + 'wordobj-pagina.js:530', S + 'wordobj-pagina.js:651', S + 'wordobj.js:591'], ['lectii/vii/m1-l04', 'lectii/vii/m1-l07'], [],
  'NU', 'Căutat ștergerea pozei: M.img se schimbă doar la inserare (word.js:1462) și la anulare (word.js:209).')

# ---------------------------------------------------------------- Pagina
f('Orientarea foii (Layout › Orientation: Portrait / Landscape); marginile se rotesc cu foaia', 'Pagină', 'Layout › Orientation ▾ › Portrait / Landscape; în jocuri butoanele „Orientarea foii”',
  [S + 'wordobj-pagina.js:515', S + 'wordobj-pagina.js:666', S + 'wordobj-hartie.js:266', 'jocuri/word-antrenament-vii/index.html:201'],
  ['lectii/vii/m1-l07', 'lectii/vii/m2-l09', 'lectii/vii/m2-l10'] + JOC,
  [ex('m1-l07:234', 'wordpag', "or:'vedere'"), ex('m1-l07:297', 'wordpag', "or:'vedere'"), ex('m2-l09:352', 'wordhartie', "or:'vedere' + margini"), ex('m2-l10:364', 'probapag', "or:'vedere'"),
   J('jocuri/word-antrenament-vii/index.html:112', "tipul 'pagina', problems() verifică orientarea")],
  'PARTIAL', 'aplicatii/word.js:1727 (meniul) → orientare (word.js:574)',
  lipsa='Marginile nu se rotesc cu foaia (word.js:574-586 schimbă doar lățimea și înălțimea); vechiul: sus 2, jos 1,5, stânga 3, dreapta 1 → pe vedere sus 3, jos 1, stânga 1,5, dreapta 2 (probat).')
f('Margini gata făcute: Normal, Narrow, Moderate, Wide, Mirrored (și ultima setare personalizată)', 'Pagină', 'Layout › Margins ▾',
  [S + 'wordobj-pagina.js:516', S + 'wordobj-pagina.js:665', S + 'wordobj-hartie.js:265'], ['lectii/vii/m1-l07', 'lectii/vii/m2-l09', 'lectii/vii/m2-l10'],
  [ex('m1-l07:297', 'wordpag', 'st / dr 1,27 = Narrow')],
  'PARTIAL', 'aplicatii/word.js:1725 — meniul are doar Narrow Margins (margini(1.27)) și Custom Margins',
  lipsa='Lipsesc Normal, Moderate, Wide, Mirrored și „Last Custom Setting”.')
f('Margini scrise de mână: Custom Margins… / Page Setup › Margins (sus, jos, stânga, dreapta, orientarea; refuză marginile prea mari)', 'Pagină',
  'Layout › Margins ▾ › Custom Margins… (sau lansatorul Page Setup), scrii valorile, OK; în jocuri butoanele „Marginea din stânga / dreapta”',
  [S + 'wordobj-pagina.js:531', S + 'wordobj-pagina.js:669', S + 'wordobj-hartie.js:234', S + 'wordobj-hartie.js:262', 'jocuri/word-antrenament-vii/index.html:202'],
  ['lectii/vii/m1-l07', 'lectii/vii/m2-l09', 'lectii/vii/m2-l10'] + JOC,
  [ex('m1-l07:242', 'wordpag', 'st:3, dr:2.5'), ex('m1-l07:272', 'wordpag', 'st:3, dr:2.5'), ex('m2-l09:352', 'wordhartie', 'st:2, dr:2'), ex('m2-l09:380', 'wordhartie', 'st / dr 0,5'),
   ex('m2-l10:262', 'wordpag', 'st:2, dr:2'), J('jocuri/word-antrenament-vii/index.html:112', "tipul 'pagina', problems() verifică marginile stânga / dreapta")],
  'NU', "Fereastra Page Setup se deschide (word.js:1720, 1726), dar OK doar o închide (word.js:1234: inchideDialog(); return 'ok'); valorile scrise nu ajung în M.pag.")
f('Mărimea foii din lista Size (Letter, Legal, A4, A5, B5, plicuri, A6…)', 'Pagină', 'Layout › Size ▾',
  [S + 'wordobj-hartie.js:267', S + 'wordobj-hartie.js:183'], ['lectii/vii/m2-l09'],
  [ex('m2-l09:380', 'wordhartie', 'lat / inalt — mărimea foii'), ex('m2-l09:490', 'wordhartie', 'lat / inalt')],
  'NU', 'Căutat Size, PageSize, hârtie în aplicatii/word.js: nicio comandă (CMD word.js:1703); M.pag rămâne 21 × 29,7 (word.js:60), schimbată doar de orientare.')
f('Mărime de foaie personalizată (More Paper Sizes… → Page Setup › Paper: Width, Height, Paper size, Custom size)', 'Pagină', 'Layout › Size ▾ › More Paper Sizes…, scrii lățimea și înălțimea, OK',
  [S + 'wordobj-hartie.js:263', S + 'wordobj-hartie.js:285'], ['lectii/vii/m2-l09'],
  [ex('m2-l09:380', 'wordhartie', 'lat / inalt'), ex('m2-l09:388', 'wordhartie', 'lat / inalt')],
  'NU', 'Fila Paper a ferestrei Page Setup e desenată din date (dialog.PageSetupDialog#Paper), dar OK n-are efect (word.js:1234).')
f('Word refuză o măsură greșită sau marginile prea mari, cu mesajul lui („This is not a valid measurement.”, „The top/bottom margins are too large…”)', 'Pagină',
  'scrii o valoare greșită în Page Setup și treci pe altă filă sau apeși OK',
  [S + 'wordobj-hartie.js:229', S + 'wordobj-hartie.js:272'], ['lectii/vii/m2-l09'], [],
  'NU', 'Căutat „valid measurement”, „too large” în aplicatii/word.js: nimic.')

# ---------------------------------------------------------------- Fișiere
f('Document nou, gol (Ctrl+N; File › Home / New › Blank document)', 'Fișiere', 'Ctrl+N sau File › Blank document',
  ['lectii/_sim/wordfisier.js:76', 'lectii/_sim/wordfisier.js:595', 'lectii/_sim/wordfisier.js:657'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:260', 'wordfis', 'docuri — câte documente sunt deschise')],
  'DA', 'aplicatii/word.js:1646 — documentNou(); word.js:2202 (Ctrl+N), word.js:1874 (Blank document)')
f('Document nou dintr-un șablon (Diplomă, Fluturaș, Referat școlar cu fotografie)', 'Fișiere', 'File › New, clic pe șablon',
  ['lectii/_sim/wordfisier.js:629', 'lectii/_sim/wordfisier.js:76'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:135', 'wordfis', "activNou:'Diplomă' — document nou din șablonul Diplomă")],
  'NU', 'File › New are șabloanele din referință (date › backstage.New), dar clicul pe ele dă mesajul central: word.js:1874-1880 tratează doar „Blank document”.')
f('Ctrl+S: pe un document nou deschide „Save this file” (numele = primul rând); pe unul salvat salvează pe loc', 'Fișiere', 'Ctrl+S (pe telefon butonul Ctrl+S)',
  ['lectii/_sim/wordfisier.js:137'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:142', 'wordfis', 'fisier — fișierul salvat'), ex('m1-l03:211', 'wordfis', 'fisier'), ex('m1-l03:296', 'wordfis', 'neschimbat')],
  'DA', 'aplicatii/word.js:2195 — ctrl_s; word.js:1329 — salveazaPeLoc()',
  nota=P365 + 'Ctrl+S pe document nou deschide Save As (Word 2007 n-are „Save this file”).')
f('Save As (F12 sau File › Save As › Browse): alegi folderul, scrii numele, Save → fișierul .docx apare acolo', 'Fișiere', 'F12, folderul din stânga, File name, Save (sau Enter)',
  ['lectii/_sim/wordfisier.js:147', 'lectii/_sim/wordfisier.js:116', 'lectii/_sim/wordfisier.js:98', 'lectii/_sim/wordfisier.js:661'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:126', 'wordfis', 'fisier în folderul cerut + activ'), ex('m1-l03:142', 'wordfis', 'fisier'), ex('m1-l03:166', 'wordfis', 'fisier')],
  'DA', 'aplicatii/word.js:2168 (F12), word.js:1869 (File › Save As › Browse), word.js:1279 — salveaza(), word.js:1600 — navigheaza()')
f('Salvează ca PDF: apare o copie .pdf, în Word rămâne deschis documentul; bifa „Open file after publishing”', 'Fișiere', 'Save As, Save as type: PDF (*.pdf), Save',
  ['lectii/_sim/wordfisier.js:102'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:188', 'wordfis', "fisier cu ext:'pdf' (linia 192)"), ex('m1-l03:276', 'wordfis', "fisier cu ext:'pdf' (linia 280)")],
  'DA', 'aplicatii/word.js:1293-1299 (PDF), word.js:1336 — alegeTip(), word.js:1655 — comutaCaseta() pentru bifă')
f('Salvează ca .odt / .rtf (la .odt Word întreabă de format; lucrezi apoi în fișierul nou)', 'Fișiere', 'Save As, Save as type: OpenDocument Text / Rich Text Format, Save',
  ['lectii/_sim/wordfisier.js:129', 'lectii/_sim/wordfisier.js:672'], ['lectii/vii/m1-l03'], [],
  'NU', 'aplicatii/word.js:1308-1310 — tipurile în afară de .docx și PDF dau mesajul central.')
f('Fișierul există deja: „The file … already exists” cu Replace existing file / alt nume / Cancel (la PDF: OK / Cancel)', 'Fișiere', 'Save pe un nume care există în folder',
  ['lectii/_sim/wordfisier.js:123', 'lectii/_sim/wordfisier.js:668'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:166', 'wordfis', 'neschimbat — fișierul colegei rămâne neatins'), ex('m1-l03:260', 'wordfis', 'neschimbat'), ex('m1-l03:296', 'wordfis', 'neschimbat')],
  'PARTIAL', 'aplicatii/word.js:1297, 1302 — fișierul existent nu se atinge și fereastra de salvare rămâne deschisă',
  lipsa='Nu apare întrebarea lui Word (vine mesajul central „… already exists”), deci nici Replace (înlocuirea fișierului) nu se poate face.')
f('Clic pe un fișier din lista Save As îi pune numele în File name', 'Fișiere', 'clic pe un fișier din fereastra Save As',
  ['lectii/_sim/wordfisier.js:641'], ['lectii/vii/m1-l03'], [],
  'DA', 'aplicatii/word.js:1913 — alegeRandOpen()')
f('Numele cu semnele \\ / : * ? " < > | nu se primește', 'Fișiere', 'scrii un nume cu aceste semne și apeși Save',
  ['lectii/_sim/wordfisier.js:121'], ['lectii/vii/m1-l03'], [],
  'DA', 'aplicatii/word.js:1270, 1282 — numeInterzis()')
f('Ctrl+W închide documentul; cu modificări întreabă Save / Don\'t Save / Cancel; Word rămâne deschis', 'Fișiere', 'Ctrl+W (pe telefon butonul Ctrl+W), apoi butonul ales',
  ['lectii/_sim/wordfisier.js:155', 'lectii/_sim/wordfisier.js:665', 'lectii/_sim/wordfisier.js:666', 'lectii/_sim/wordfisier.js:667'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:211', 'wordfis', "jurnal op ctrlw / x"), ex('m1-l03:276', 'wordfis', 'fisier salvat la închidere')],
  'DA', 'aplicatii/word.js:2203, 1528 — cerereInchidere(); word.js:1889-1894 (Cancel / Don\'t Save / Save)',
  nota=P365 + 'Ctrl+W și ✕ dau mesajul central (word.js:1530).')
f('✕ din colțul ferestrei închide documentul; la ultimul document se închide Word', 'Fișiere', 'clic pe ✕ (sus, dreapta)',
  ['lectii/_sim/wordfisier.js:648', 'lectii/_sim/wordfisier.js:165'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:211', 'wordfis', "jurnal op x"), ex('m1-l03:276', 'wordfis', "word:'inchis'"), ex('m1-l03:296', 'wordfis', "word:'inchis'")],
  'DA', 'aplicatii/word.js:1937 — cerereInchidere(\'x\'); word.js:1541-1542 — inchideAplicatia()')
f('Deschide un document: Ctrl+O / File › Open (lista Recent, Browse → fereastra Open, alegi fișierul, Open sau dublu-clic)', 'Fișiere', 'Ctrl+O, Recent sau Browse, Open',
  ['lectii/_sim/wordfisier.js:596', 'lectii/_sim/wordfisier.js:658', 'lectii/_sim/wordfisier.js:664', 'lectii/_sim/wordfisier.js:683', 'lectii/_sim/wordfisier.js:630'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:211', 'wordfis', "jurnal op 'deschis' cu numele cerut"), ex('m1-l03:223', 'wordfis', 'activ — documentul deschis'), ex('m1-l03:260', 'wordfis', "jurnal op 'deschis'")],
  'DA', 'aplicatii/word.js:2199 (Ctrl+O), word.js:1872 (Browse), word.js:1586 — deschideDinOpen(), word.js:1942 (dublu-clic), word.js:1668 — umpleRecente()',
  nota=P365 + 'Ctrl+O și Browse dau mesajul central (word.js:2199, 1872). Documentul deschis păstrează doar textul (word.js:1581), nu formatarea.')
f('Deschizi un fișier deja deschis: Word îl aduce în față (nu face al doilea)', 'Fișiere', 'Open pe același fișier',
  ['lectii/_sim/wordfisier.js:173'], ['lectii/vii/m1-l03'], [],
  'DA', 'aplicatii/word.js:1570-1577')
f('Treci de la un document deschis la altul (butoanele ferestrelor de pe bara de activități)', 'Fișiere', 'clic pe fereastra documentului, jos, pe bara de activități',
  ['lectii/_sim/wordfisier.js:642'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:260', 'wordfis', 'docuri — mai multe documente deschise')],
  'PARTIAL', 'aplicatii/word.js:1571-1576 — alt document deschis vine în față doar redeschis din Recent / Open',
  lipsa='Nu există bara de activități / lista ferestrelor; documentele din spate (M.altele) nu se pot alege direct.')
f('File › Close închide documentul', 'Fișiere', 'File › Close',
  ['lectii/_sim/wordfisier.js:627'], ['lectii/vii/m1-l03'], [],
  'NU', 'aplicatii/word.js:1875-1878: „Close” din meniul File caută pagina backstage.Close, care nu e în date → mesajul central.')
f('File › Save (pe un document salvat salvează pe loc, pe unul nou duce la Save As)', 'Fișiere', 'File › Save',
  ['lectii/_sim/wordfisier.js:626'], ['lectii/vii/m1-l03'], [],
  'PARTIAL', 'aplicatii/word.js:1877 — File › Save arată mereu pagina Save As',
  lipsa='Pe un document deja salvat nu salvează pe loc.')
f('Pornește Word din meniul Start; pagina de început (Blank document, șabloane, Recent; Esc = document nou)', 'Fișiere', 'Start › Word, apoi pagina de început',
  ['lectii/_sim/wordfisier.js:676', 'lectii/_sim/wordfisier.js:81', 'lectii/_sim/wordfisier.js:602'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:135', 'wordfis', "Word pornește închis (word:'inchis'), apoi activNou"), ex('m1-l03:223', 'wordfis', "Word pornește închis, apoi activ")],
  'NU', 'aplicatii/word.js n-are meniul Start și nici pagina de pornire; după ce Word s-a închis (M.inchisApp), nimic nu-l mai pornește (word.js:1529, 1531).',
  nota='Poate fi treaba aplicației windows din bibliotecă (nesigur, vezi nesigure).')
f('Deschide un document din File Explorer (dublu-clic pe .docx; un PDF nu se deschide în Word)', 'Fișiere', 'File Explorer de pe bara de activități, dublu-clic pe fișier',
  ['lectii/_sim/wordfisier.js:679', 'lectii/_sim/wordfisier.js:688'], ['lectii/vii/m1-l03'], [],
  'NU', 'Căutat explorer în aplicatii/word.js: nicio legătură cu Explorer-ul.',
  nota='Nesigur dacă explorer.js / windows.js pot porni Word cu un fișier (nu le-am citit).')
f('Vizualizarea protejată (fișier venit de pe internet): nu poți scrie și nici salva; Enable Editing o oprește', 'Fișiere', 'bara galbenă PROTECTED VIEW › Enable Editing',
  ['lectii/_sim/wordfisier.js:197', 'lectii/_sim/wordfisier.js:656', 'lectii/_sim/wordfisier.js:140'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:239', 'wordfis', 'pv:false — Enable Editing apăsat'), ex('m1-l03:260', 'wordfis', "jurnal op 'enable'")],
  'NU', 'Căutat Protected, protej, Enable Editing în aplicatii/word.js: nimic.')

# ---------------------------------------------------------------- Vizualizare / fereastra
f('Read Mode: tastarea nu scrie; meniul View › Edit Document; Esc te întoarce în Print Layout', 'Vizualizare', 'View › Read Mode sau butonul din bara de stare; Esc',
  ['lectii/_sim/wordfisier.js:182', 'lectii/_sim/wordfisier.js:623', 'lectii/_sim/wordfisier.js:601', 'lectii/_sim/wordfisier.js:651'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:248', 'wordfis', "vedere:'read', fost:'citire'")],
  'NU', 'Butoanele Read Mode / Print Layout / Web Layout din bara de stare sunt doar desenate (date › bara_stare); I.la.clic (word.js:1850-1938) nu le tratează → mesajul central.')
f('Web Layout și Print Layout (fila View sau bara de stare)', 'Vizualizare', 'View › Web Layout / Print Layout',
  ['lectii/_sim/wordfisier.js:182', 'lectii/_sim/wordfisier.js:623'], ['lectii/vii/m1-l03'],
  [ex('m1-l03:248', 'wordfis', "fost:'web', vedere:'print'")],
  'NU', 'Aceeași căutare: nicio comandă de vizualizare în aplicatii/word.js.')
f('Zoom cu − / + din bara de stare', 'Vizualizare', 'butoanele − și + din dreapta jos',
  [S + 'wordobj-interfata.js:412', S + 'wordobj-interfata.js:413', 'lectii/_sim/wordfisier.js:654', 'lectii/_sim/wordfisier.js:655'], ['lectii/vii/m1-l02', 'lectii/vii/m1-l03'],
  [ex('m1-l03:248', 'wordfis', 'zoom într-un interval')],
  'DA', 'aplicatii/word.js:1956-1957 — câte 10 %',
  nota='wordobj-interfata: pași de 10 % (ca biblioteca); wordfisier: +8 % peste 100 %, −2 % sub 100 % (măsurat în Word).')
f('Zoom trăgând glisorul din bara de stare', 'Vizualizare', 'trage de glisorul zoomului',
  ['lectii/_sim/wordfisier.js:692'], ['lectii/vii/m1-l03'], [],
  'PARTIAL', 'aplicatii/word.js:1958-1962 — clicul pe glisor sare la poziție; word.js:1967 — rotița',
  lipsa='Glisorul nu se trage (doar clic).')
f('Zoom 100 % (butonul 100% / procentul)', 'Vizualizare', 'View › 100%',
  ['lectii/_sim/wordfisier.js:653'], ['lectii/vii/m1-l03'], [],
  'NU', "aplicatii/word.js:1963 — orice alt element de zoom dă mesajul central ('Zoom').")
f('Arată / ascunde riglele (View › Ruler)', 'Vizualizare', 'fila View, bifa Ruler',
  [S + 'wordobj-interfata.js:405', S + 'wordobj-interfata.js:238'], ['lectii/vii/m1-l02'],
  [ex('m1-l02:152', 'wordui', 'rigle:false / true')],
  'NU', 'Căutat Ruler, rigl în aplicatii/word.js: nimic; ViewRulerWord doar în date; biblioteca nu desenează rigle.')
f('Arată / ascunde bara Acces rapid (săgeata ⌄ Ribbon Display Options › Show / Hide Quick Access Toolbar)', 'Fereastra', 'săgeata ⌄ din dreapta-jos a panglicii',
  [S + 'wordobj-interfata.js:408', S + 'wordobj-interfata.js:409'], ['lectii/vii/m1-l02'],
  [ex('m1-l02:218', 'wordui', 'qat:true'), ex('m1-l02:244', 'wordui', 'qat:true'), ex('m1-l02:260', 'wordui', 'qat:true')],
  'NU', 'date/word.json › acces_rapid_afisat: false (fix); nicio comandă care s-o schimbe în aplicatii/word.js.')
f('Butoanele Undo și Redo / Repeat din bara Acces rapid (numele: Can\'t Repeat / Repeat Typing / Redo Typing)', 'Fereastra', 'clic pe Undo / Redo în bara de titlu',
  [S + 'wordobj-interfata.js:399', S + 'wordobj-interfata.js:220'], ['lectii/vii/m1-l02'],
  [ex('m1-l02:218', 'wordui', "foloseste:'anulare' / 'refacere' cu qat (se trece și cu Ctrl+Z / Ctrl+Y)")],
  'NU', 'Bara Acces rapid nu se afișează (acces_rapid_afisat: false) și clicul pe acces_rapid nu e tratat în I.la.clic (word.js:1850-1938).')
f('Schimbă fila panglicii (Home, Insert, Layout, View…)', 'Fereastra', 'clic pe numele filei',
  [S + 'wordobj-interfata.js:393', 'lectii/_sim/wordfisier.js:621'], L5 + ['lectii/vii/m1-l03'], [],
  'DA', 'aplicatii/word.js:1858-1862 — activeazaFila()')
f('Lansatorul ↘ din colțul unui grup deschide fereastra grupului', 'Fereastra', 'clic pe săgeata mică ↘ a grupului (Font, Paragraph…)',
  [S + 'wordobj-interfata.js:406', S + 'wordobj-formatare.js:784'], ['lectii/vii/m1-l02', 'lectii/vii/m1-l06'],
  [ex('m1-l02:145', 'wordui', "lans:'FontDialog'")],
  'PARTIAL', 'aplicatii/word.js:1935 → apasa(); word.js:1718-1720 (Font, Paragraph, Page Setup)',
  lipsa='Doar lansatoarele cu fereastră în date (Font, Paragraph, Page Setup) deschid ceva; Clipboard, Styles și restul dau mesajul central. Vechiul (wordobj-interfata) deschidea fereastra oricărui grup (goală, cu titlul).')
f('Clic pe o parte a ferestrei (bara de titlu, panglica, rigla, pagina, bara de defilare, bara de stare)', 'Fereastra', 'clic pe zona cerută',
  [S + 'wordobj-interfata.js:336'], ['lectii/vii/m1-l02'],
  [ex('m1-l02:120', 'wordui', "zona:'stare' — clic pe bara de stare")],
  'PARTIAL', 'aplicatii/word.js:653-655 — zonele au data-lh-suprafata (bara_titlu, panglica, zona_document, bara_stare), clicul ajunge în evenimentul aplicației',
  lipsa='Rigla lipsește (nu se poate da clic pe ea).')
f('Numărul de cuvinte din bara de stare („N words”; cu text selectat „X of N words”)', 'Fereastra', 'citești bara de stare (selectezi text)',
  [S + 'wordobj-interfata.js:269'], ['lectii/vii/m1-l02'],
  [ex('m1-l02:244', 'wordui', 'cuvinte:20')],
  'PARTIAL', 'aplicatii/word.js:983 — „N words”',
  lipsa='Cu text selectat nu arată „X of N words”.')

# ---------------------------------------------------------------- Tipărire
f('Previzualizarea înainte de tipărire (Ctrl+P sau File › Print): paginile cum ies pe hârtie, fără ¶, „1 of 2”, ◀ ▶ între pagini, mărire', 'Tipărire',
  'Ctrl+P (pe telefon butonul Ctrl+P) sau File › Print; ◀ ▶ sub pagină',
  [S + 'wordobj-tehnoredactare.js:251', S + 'wordobj-tehnoredactare.js:324', S + 'wordobj-tehnoredactare.js:295', S + 'wordobj-tehnoredactare.js:297'],
  ['lectii/vii/m2-l08', 'lectii/vii/m2-l10'],
  [ex('m2-l08:259', 'wordteh', 'previzualizare — deschisă după ultima schimbare'), ex('m2-l08:279', 'wordteh', 'pagini:1'), ex('m2-l08:293', 'wordteh', 'previzualizare'), ex('m2-l10:270', 'wordfmt', 'previzualizare'), ex('m2-l10:389', 'probateh', 'pagini:1, previzualizare')],
  'PARTIAL', 'aplicatii/word.js:1878 — File › Print arată pagina Print din date (butoanele, setările)',
  lipsa='Previzualizarea nu arată documentul elevului și nici câte pagini are („ of 1” fix din date); Ctrl+P dă mesajul central (word.js:2016); ◀ ▶ nu schimbă pagina.')
f('Fila File deschide pagina Home; ← (Back) sau Esc te întoarce în document', 'Tipărire', 'clic pe File; ← sau Esc',
  [S + 'wordobj-tehnoredactare.js:312', S + 'wordobj-tehnoredactare.js:323', 'lectii/_sim/wordfisier.js:650', 'lectii/_sim/wordfisier.js:625'], ['lectii/vii/m1-l03', 'lectii/vii/m2-l08'], [],
  'DA', 'aplicatii/word.js:1859 (File → Home), word.js:1867 (Back), word.js:2129 (Esc)')

# ---------------------------------------------------------------- id-uri
for k, x in enumerate(F, 1):
    x['id'] = f'word-F{k:03d}'
F = [{'id': x['id'], **{k: v for k, v in x.items() if k != 'id'}} for x in F]

DOAR = [
    {'grup': 'Panglica desenată din date: butoanele fără legătură în simulator', 'exemple': ['orice buton al panglicii reale pe care lecția nu-l leagă primește data-nesim și spune „e aici și în Word, dar în lecția asta nu-l folosim”'], 'dovada': 'jocuri/_motor/ui-panglica.js:31'},
    {'grup': 'Mesaje „nu e în simulator” în wordobj', 'exemple': ['Format Painter', 'Online Pictures / Stock Images', 'Ctrl+S („în simulator nu se salvează nimic”)'], 'dovada': 'lectii/_sim/wordobj.js:953'},
    {'grup': 'Mesaje în wordobj-formatare', 'exemple': ['fereastra Font (Ctrl+D)', 'Underline ▾ (alte linii)', 'Add / Remove Space Before/After', 'Format Painter', 'altă filă decât Home'], 'dovada': 'lectii/_sim/wordobj-formatare.js:783'},
    {'grup': 'Mesaje în wordobj-interfata', 'exemple': ['clic pe procentul zoomului', 'glisorul zoomului', 'modurile de vizualizare', 'Page 1 of 1 (panoul Navigation)', 'Save', 'AutoSave', 'Customize Quick Access Toolbar', 'fila File'], 'dovada': 'lectii/_sim/wordobj-interfata.js:414'},
    {'grup': 'Mesaje în wordobj-pagina', 'exemple': ['Crop, Borders, Width din Table Layout', 'Size and Position…, Table Properties… din clic dreapta', 'dublu-clic pe linia dintre coloane', 'mutarea pozei trăgând de ea', 'Cut / Copy din clic dreapta pe poză'], 'dovada': 'lectii/_sim/wordobj-pagina.js:632'},
    {'grup': 'Mesaje în wordobj-hartie', 'exemple': ['Columns, Breaks, Line Numbers, Hyphenation și restul filei Layout', 'filele altele decât Layout'], 'dovada': 'lectii/_sim/wordobj-hartie.js:259'},
    {'grup': 'Mesaje în wordobj-tehnoredactare (pagina Print)', 'exemple': ['butonul Print', 'setările de tipărire', 'celelalte pagini ale filei File'], 'dovada': 'lectii/_sim/wordobj-tehnoredactare.js:293'},
    {'grup': 'Mesaje în wordfisier', 'exemple': ['Minimize / Maximize', 'butoanele nefolosite în lecție', 'deschiderea unui PDF în Word', 'Merge changes în „already exists”'], 'dovada': 'lectii/_sim/wordfisier.js:649'},
    {'grup': 'Mesaje în wordteh-stiluri', 'exemple': ['Subtitle, Subtle Emphasis, Emphasis, Styles…', 'clic dreapta pe dală (Modify, Update…)'], 'dovada': 'lectii/_sim/wordteh-stiluri.js:180'},
    {'grup': 'Proba de antrenament (wordobj-proba)', 'exemple': ['punctajul pe itemi, nota, întrebarea cu variante probaalege — nu sunt funcții Word, doar învelesc simulatoarele'], 'dovada': 'lectii/_sim/wordobj-proba.js:310'},
]

NESIGURE = [
    'B / I / U pe o selecție amestecată: vechiul (după primul caracter, „probat prin COM”) și biblioteca (pune dacă nu e pe tot) se contrazic; de lămurit cu Word real, cu clicul pe buton, nu prin COM.',
    'Anularea ⌫-urilor: vechiul (fiecare ⌫ = o anulare, probat) față de bibliotecă (le grupează); de lămurit cu Word real.',
    'Pornirea lui Word din Start și deschiderea din File Explorer: n-am citit windows.js / explorer.js; poate le leagă de Word.',
    'Verdictele vin din citirea codului (word.js, aplicatii.js, date/word.json). Proba headless în poligon (probe_word/proba_poligon.py, 21.11) a confirmat 4 dintre ele: Bold merge (controlul), iar ¶ Show All, Font Color și Increase Indent dau doar mesajul central, fără efect în stare(). La celelalte NU-uri căutarea e scrisă la fiecare funcție.',
    'Exercițiile din jocuri (word-antrenament-vii, word-obiecte-vii) folosesc un simulator ABSTRACT de pagină (butoane, nu panglica Word); funcțiile lor sunt trecute la funcțiile Word corespunzătoare.',
]

def linii(cale):
    with open(SRC + cale, encoding='utf-8') as fh:
        return sum(1 for _ in fh)

CITITE = ['lectii/_sim/wordobj.js', 'lectii/_sim/wordobj-formatare.js', 'lectii/_sim/wordobj-hartie.js', 'lectii/_sim/wordobj-interfata.js',
          'lectii/_sim/wordobj-pagina.js', 'lectii/_sim/wordobj-proba.js', 'lectii/_sim/wordobj-tehnoredactare.js', 'lectii/_sim/wordfisier.js',
          'lectii/_sim/wordteh-stiluri.js', 'jocuri/_motor/panglica-word.js', 'jocuri/_motor/panglica-word.json', 'jocuri/_motor/ui-panglica.js',
          'jocuri/_motor/motor.js', 'lectii/vii/m1-l04/index.html', 'jocuri/word-antrenament-vii/index.html', 'jocuri/word-obiecte-vii/index.html',
          'jocuri/word-vii/index.html', 'lectii/vii/m1-l02/index.html', 'lectii/vii/m1-l03/index.html', 'lectii/vii/m1-l05/index.html',
          'lectii/vii/m1-l06/index.html', 'lectii/vii/m1-l07/index.html', 'lectii/vii/m2-l08/index.html', 'lectii/vii/m2-l09/index.html',
          'lectii/vii/m2-l10/index.html']

# verificarea dovezilor vechi: linia există și nu e comentariu
probleme = []
for x in F:
    for d in x['vechi_dovada']:
        cale, n = d.rsplit(':', 1)
        with open(SRC + cale, encoding='utf-8') as fh:
            L = fh.read().split('\n')
        n = int(n)
        if n < 1 or n > len(L):
            probleme.append(f"{x['id']} {d}: linia nu există")
            continue
        t = L[n - 1].strip()
        if not t or t.startswith('/*') or t.startswith('//') or t.startswith('*'):
            probleme.append(f"{x['id']} {d}: linia e goală / comentariu: {t[:60]}")

out = {'aplicatie': 'word', 'eticheta': 'word', 'commit_proba': open(P + '/proba_src/COMMIT.txt', encoding='utf-8').read().strip(),
       'fisiere_citite': [{'cale': c, 'linii': linii(c)} for c in CITITE],
       'functii': F, 'doar_afisate': DOAR, 'nesigure': NESIGURE}
with open(P + '/word.json', 'w', encoding='utf-8') as fh:
    json.dump(out, fh, ensure_ascii=False, indent=1)

n = len(F)
da = sum(x['biblioteca'] == 'DA' for x in F)
pa = sum(x['biblioteca'] == 'PARTIAL' for x in F)
nu = sum(x['biblioteca'] == 'NU' for x in F)
cerute = [x for x in F if x['ceruta_de_exercitiu']]

def rand(x):
    s = f"- **{x['id']}** {x['functie']} ({x['grup']})"
    if x['biblioteca'] == 'PARTIAL':
        s += f" — lipsește: {x['lipsa']}"
    if x['ceruta_de_exercitiu']:
        s += f" — cerută în: {', '.join(e.split(' (')[0].replace('t:', '') for e in x['exercitii'][:3])}"
    return s

md = []
md.append('# Paritate WORD — simulatoarele vechi (proba) față de biblioteca nouă')
md.append('')
md.append(f"Commitul de pe proba: `{out['commit_proba']}`. Biblioteca: `aplicatii/word.js` (+ `aplicatii.js`, `panglica.js`, `date/word.json`). 12 pagini, 157 de exerciții.")
md.append('')
md.append(f'**{n} funcții**: **{da} DA**, **{pa} PARȚIAL**, **{nu} NU**. Dintre ele, {len(cerute)} sunt verificate de exerciții '
          f"({sum(x['biblioteca']=='NU' for x in cerute)} NU și {sum(x['biblioteca']=='PARTIAL' for x in cerute)} PARȚIAL printre ele).")
md.append('')
md.append('Pe scurt: biblioteca face bine editarea, selectarea, clipboardul, anularea, B / I / U, mărimea, alinierea, tabelul simplu și salvarea / deschiderea / închiderea. '
          'Lipsesc aproape tot ce predau lecțiile 6–9 dincolo de B / I / U și aliniere: fontul, culoarea, retragerile și spațierile, semnele ¶, stilul și opțiunile tabelului, '
          'mărimea și încadrarea pozei, marginile scrise, mărimea foii, previzualizarea, modurile de vizualizare, rigla, bara Acces rapid. Ferestrele Font, Paragraph și Page Setup se deschid, dar OK nu aplică nimic.')
md.append('')
md.append('## NU — cerute de exerciții')
md += [rand(x) for x in F if x['biblioteca'] == 'NU' and x['ceruta_de_exercitiu']]
md.append('')
md.append('## PARȚIAL — cerute de exerciții')
md += [rand(x) for x in F if x['biblioteca'] == 'PARTIAL' and x['ceruta_de_exercitiu']]
md.append('')
md.append('## NU — necerute de exerciții')
md += [rand(x) for x in F if x['biblioteca'] == 'NU' and not x['ceruta_de_exercitiu']]
md.append('')
md.append('## PARȚIAL — necerute de exerciții')
md += [rand(x) for x in F if x['biblioteca'] == 'PARTIAL' and not x['ceruta_de_exercitiu']]
md.append('')
md.append('## Profilurile word365 / word2007')
md.append('Funcțiile care merg doar în word365: Ctrl+O / Browse / fereastra Open, Ctrl+W și ✕ cu întrebarea de salvare, „Save this file” la Ctrl+S, potrivirea spațiilor la lipire. '
          'În word2007 Ctrl+Z anulează literă cu literă (ca în laborator). Detaliile: câmpul `nota` din word.json.')
md.append('')
md.append('## Ce n-am apucat / ce e nesigur')
md += [f'- {s}' for s in NESIGURE]
md.append('- Panglica veche (`panglica-word.json`, 3832 de rânduri) am citit-o doar prin `ui-panglica.js` (cum se leagă butoanele); butoanele „doar afișate” sunt trecute pe grupuri, nu unul câte unul.')
if probleme:
    md.append('- Dovezi vechi de verificat: ' + '; '.join(probleme))
md.append('')
md.append(f'GATA_PARITATE word total={n} da={da} partial={pa} nu={nu}')
with open(P + '/word.md', 'w', encoding='utf-8') as fh:
    fh.write('\n'.join(md) + '\n')
print(n, da, pa, nu, len(cerute))
print('\n'.join(probleme) or 'dovezi vechi: toate liniile există și nu sunt comentarii')
