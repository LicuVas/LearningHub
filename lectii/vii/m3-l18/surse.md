# Surse — lecția VII · M3 · 18: „Ce este o aplicație colaborativă. Accesare și conectare”

Autor: tura de noapte 23→24.10.2026 (campania „Lecțiile refăcute”). Nimic din memorie: ce spune lecția despre Google vine din
pagina publică de conectare și din ajutorul oficial, citite fără cont (secțiunea 3); ce n-a putut fi confirmat e în secțiunea 8,
în `afirmatii.json` (stare NESIGUR) și în `capturi_lipsa.json`.

## 1. Ancora în documentele profesorului
- `Info_Gimnaziu_2026/planificari/Calendar_ore_7_MA.md` (Brauner): **29.01.2027, lecția 18**, „Ce este o aplicație colaborativă.
  Accesare și conectare”, predare. La Izvoare (`Calendar_ore_VII_A.md`, `VII_B.md`) aceeași temă e **02.02.2027, nr. 19** în numărătoarea lor.
- `Proiectul_unitatii_VII-U3.md`: VII-U3 „Aplicații colaborative”, 5 ore, **CS.1.3**. De bază: „utilizează, cu sprijin, funcții și
  instrumente ale unor aplicații colaborative realizând operații de bază (**accesare/conectare**, vizualizare, editare) … **aplicând
  măsuri de protecție în mediul online, în pași ghidați**, în contexte familiare”. Ora 18: „teorie, exercitii”.
- `curriculum.json`, clasa a VII-a, „Aplicații colaborative” — conținuturile declarate de lecție (textul exact):
  „Noțiunea de aplicație colaborativă”, „Accesare/conectare în aplicația colaborativă”. **„Interfaţa aplicaţiei colaborative” NU e
  declarată**: lecția arată doar ce îi trebuie azi (Nou, Drive-ul meu, grila, Profil); interfața documentului (meniuri, partajare,
  comentarii) e a lecției 19, care o poate declara.
- Aplicația = **Google (Drive, Documente Google)**, cu contul Google de la școală: decizia dirijorului din 23.10.2026
  (`m3_noapte_23_10/prompturi/_noapte.md` §1), pe temeiul deciziei profesorului din 11.10 pentru VI/13-15.

## 2. Ce presupun că știe elevul și ce acopăr (bife = verificat în lecția numită; detaliat în `profil.json`)
Lecțiile publicate de care depind, citite întregi (pagina, `surse.md`, `afirmatii.json`):
- [x] **V/14** (navigarea pe web): filă nouă (+), închiderea filei (×), bara de adrese, Enter. Folosite în pașii 2-3 și în laborator.
- [x] **V/8** (elemente de interfață Windows): bara de activități — laboratorul, pasul 2 („apasă pe fereastra lecției, jos, în bara de activități”).
- [x] **VII/3** (documentul: creare, salvare, închidere) — pasul 0 („Ai nevoie de”) și pasul 4 (aici nu există buton de salvare: diferența e spusă).
- [x] **VII/14-15** (Clipchamp, cont Microsoft): aceleași cuvinte — „contul TĂU”, „Nu-ți face cont”, „te deconectezi”, „al cui e contul”
  (aici: „Se deschide Drive-ul cuiva? Nu te uiți la fișiere: Profil, Deconectează-te”). Nu contrazic: acolo deconectarea e din Clipchamp, aici din Google.
- [x] **VII/16** (numele `Nume_Prenume_clasa_tema`, ex. `Pop_Ana_7A_iarna`): documentul de azi se cheamă `Nume_Prenume_clasa_colaborare`
  (`Pop_Ana_7A_colaborare`), „ca la lecția 16”.
- [x] **VI/12-13** (ALTĂ clasă, aceeași școală și același cont): parola o știi doar tu; conectarea Google (adresa, Înainte, parola,
  Înainte); parola uitată → nu-ți faci alt cont, profesorul / administratorul; refuzi „Salvezi parola?”; Profil → Deconectează-te.
  **Nu presupun că elevul de a VII-a le-a făcut**: pașii 2-3 le spun din nou, cu aceleași cuvinte (textele de conectare sunt copiate din
  `posta-gmail.js`, care le-a citit pe pagina publică pe 12.10).
- [x] **VII/16-17 nepublicate la scriere**: le-am citit granițele (`m3_19_10/granite/vii_l16.md`, `vii_l17.md`); nu folosesc Google, deci
  nu se ating de lecția de azi; refolosesc doar cuvintele contului.

## 3. Interfața Google: de unde vin numele (citite 23.10.2026, 23:51-00:05)
Toate prin `_proba/surse_google.py` (Chromium din Playwright, headless, context TEMPORAR ro-RO, fără cont, nimic tastat; textul în
`_proba/_surse/<nume>.txt`, cu secțiunile pliate ale ajutorului desfăcute).
- **S1** pagina publică (fără cont) `drive.google.com` → `accounts.google.com/v3/signin/identifier?continue=https://drive.google.com/…`,
  fila „Google Drive: conectează-te”: „Conectează-te” · „Accesează Google Drive” · „Adresa de e-mail sau numărul de telefon” · „Ai uitat
  adresa de e-mail?” · „Nu este computerul tău? Pentru a te conecta, folosește o fereastră de navigare privată. Află mai multe despre
  folosirea modului pentru invitați” · „Înainte” · „Creează un cont” (`app_drive.txt`). La `docs.google.com`: „Folosește Contul Google”
  (`app_docs.txt`); `/document/`: „Accesează Documente Google”; `/presentation/`: „Accesează Prezentări Google”. Rândul „Nu e computerul
  tău?” cu User-Agent de Chrome: „…folosește modul pentru invitați” (VI/13, S20-S21).
- **S2** `support.google.com/accounts/answer/2917834?hl=ro` („Conectarea pe un dispozitiv care nu îți aparține”): „Dacă te conectezi
  temporar pe un computer, un telefon sau o tabletă care nu îți aparține, folosește o fereastră de navigare privată.” · exemplul „un
  computer public care este disponibil mai multor persoane” · „în dreapta sus, dați clic pe imaginea, inițiala sau adresa de e-mail a
  profilului; dați clic pe Deconectați-vă.” (`acc_strain_ro.txt`)
- **S3** `support.google.com/accounts/answer/54490?hl=ro`: „Când vă conectați la Contul Google, veți rămâne conectat(ă) până la
  deconectare.” · „când terminați, închideți toate ferestrele de navigare privată. Veți fi deconectat(ă) automat.” (`acc_conectat_ro.txt`)
  → „Închiderea filei nu te deconectează.”
- **S4** `support.google.com/chrome/answer/95464?hl=ro` (incognito): „selectează Mai multe › Fereastră incognito nouă” · „Windows … apasă pe
  Ctrl + Shift + n” · „Sesiunea incognito se încheie când închizi toate ferestrele incognito.” (`chrome_privat_ro.txt`; EN: „New Incognito window”)
- **S5** Microsoft, „Navigați InPrivate în Microsoft Edge” (`support.microsoft.com/ro-ro/edge/browse-inprivate-in-microsoft-edge`):
  „Setări și altele > Fereastră InPrivate nouă” · „Microsoft Edge va șterge istoricul de navigare, modulele cookie … atunci când închideți
  toate ferestrele InPrivate.” Scurtăturile Edge, RO (`support.microsoft.com/ro-ro/edge/keyboard-shortcuts-in-microsoft-edge`):
  „Ctrl+Shift+N — Deschiderea unei ferestre noi InPrivate”. (`edge_inprivate_ro.txt`, `edge_taste_ro.txt`)
- **S6** `support.google.com/docs/answer/49114?hl=ro` („Creează, afișează sau descarcă un fișier”): „Când ești online, Google îți salvează
  automat modificările pe măsură ce scrii. Nu ai nevoie de un buton de salvare.” · „…denumit automat „Document fără titlu” …”, „dă clic pe
  numele din partea de sus a fișierului; introdu un nume nou; apasă pe Enter.” · „Accesează un fișier: … deschide ecranul de pornire
  Documente …; dă clic pe documentul …” (`docs_creare_ro.txt`; EN „Untitled document”)
- **S7** `support.google.com/docs/answer/7068618?hl=ro`: „Documentele Google sunt un procesor de text online cu care poți … să lucrezi cu
  alte persoane.” · „deschide ecranul de pornire Documente la docs.google.com; în stânga sus, sub Începe un document nou, dă clic pe Gol.”
- **S8** `support.google.com/docs/answer/10519333?hl=ro` (fișiere CRIPTATE): stările salvării „Se salvează”, „Salvat în Drive” (EN
  „Saving”, „Saved to Drive”) · „În Drive, dă dublu clic pe un fișier Excel criptat. Foaia de calcul se deschide într-o filă nouă.” —
  folosite prudent (NESIGUR) pentru documentele obișnuite.
- **S9** `support.google.com/drive/answer/2424384?hl=ro` — pagina „română” e în ENGLEZĂ: „At the top left, click New … To create a file:
  Select the document type.” · „My Drive … Google Docs, Sheets, Slides, and Forms you create.” · „Sign out of Google Drive … Click Sign out.”
- **S10** `support.google.com/drive/answer/2375057` (tot în engleză): „On the left, click Shared with me.” · „Files shared with you.”
- **S11** `support.google.com/a/users/answer/9333810` (doar engleză): „Click the Google apps menu in the top right, then click an app.”
- **S12** `support.google.com/mail/answer/7682439?hl=ro`: „Dacă folosești un cont de la serviciu, de la școală sau din alt grup, este
  posibil ca pașii să nu funcționeze. Contactează administratorul pentru ajutor.” (ca VI/13, S12-S14)
- **S13** Microsoft: „Colaborarea la documente Word cu elaborarea în comun în timp real” (`support.microsoft.com/ro-ro/word/training/
  collaborate-on-word-documents-with-real-time-co-authoring`) → „Și Microsoft are aplicații de acest fel, în Microsoft 365.”
- **S14** `support.google.com/drive/answer/2494822?hl=ro`: butonul de partajare apare ca „Trimiteți” ȘI ca „Permite accesul” în același
  articol → în simulator butonul e oprit și se cheamă „Permite accesul” (NESIGUR; opțiunea `etichetaPartajare` îl schimbă la lecția 19).
- **S15** `support.google.com/accounts/answer/7299973?hl=ro`: „Introduceți parola sau codurile de verificare numai la accounts.google.com.”
  (nefolosită în pași: e a lecției 21; simulatorul arată adresa accounts.google.com în bară, ca browserul).

## 4. Ce am refolosit și ce nu
- **Jocul `jocuri/colaborare-vii`** (nivelurile 1-2, „Ce este o aplicație colaborativă”, „Mă conectez”) — citit, nemodificat. Am păstrat:
  ideea „un document, mai mulți oameni”, cloudul („serverele aplicației … legate la Internet”), exemplul Ana–Radu cu două variante,
  analogia tablei din clasă, „închiderea filei nu te deconectează”, „nu salvezi parola”, captura `colab-doi.webp` (CryptPad, de pe sit).
  NU am preluat: cele „patru facilități” (comentariile, istoricul = lecțiile 19-20), CryptPad ca aplicație de lucru (decizia: Google),
  „Oaspete”, invitația / linkul (lecția 19).
- **`lectii/_sim/posta-gmail.js`** (VI/13) — NU e folosit și NU e schimbat; textele paginii de conectare, ale întrebării „Salvezi parola?”
  (desen aproximativ Chrome / Edge) și regula de siguranță (fără `type="password"`, fără `<form>`) sunt copiate în simulatorul nou.
- **Ghidurile de telefon** (`jocuri/ghiduri/#cont-drive`, `#docs`, `#instalare`) — legate din laborator, „Lucrezi pe telefonul tău?”.
- **Imaginea pasului 0**: `img/scriem-impreuna.webp`, din Wikimedia Commons, „Edit-a-thon in Cardona 2014 03.jpg”, autor Davidpar,
  **CC BY-SA 4.0**, licența citită din API pe 24.10.2026 (`img/SURSE.json`); decupată sus (fără fețe), 800×480, 37 KB (`_proba/fa_imagini.py`).
  Wikipedia e chiar o aplicație colaborativă (programa: „pagini wiki”).

## 5. SIGURANȚA — ce salvează și ce trimite pagina
**Citit în cod:** `lectii/_sim/colab-google.js` nu scrie în `localStorage` / `sessionStorage` / cookie și nu face cereri; câmpurile (bara
de adrese, adresa, parola, numele documentului) sunt `<input type="text">`, textul documentului e `<textarea>`, fără `<form>`, fără
`name`, cu `autocomplete/autocorrect/autocapitalize="off"`, `spellcheck="false"`. Parola inventată SE VEDE în câmp (simulatorul o spune).
**Probat** (`_proba/proba_lectie.py` → `proba_lectie.json`, ieșirea `proba_lectie_final.txt`): servire locală 127.0.0.1, orice altă cerere
oprită și notată cu corpul ei, închidere doar cu `ctx.close()`. Un elev INVENTAT („Elev Colab”, cod 7318) se înscrie prin caseta reală și
trece toată lecția cu atingeri / clicuri și taste reale, pe 390 px cu atingere și pe 1280 px, cu drumuri greșite de copil și cu marcaje
unice tastate. Rezultat, pe ambele aparate: marcajele și parolele tastate apar de **0** ori în stocarea paginii și în cererile oprite;
**0** cereri ajunse afară; niciun `type=password`, niciun `<form>`; **0** erori JS; după închidere, marcajele **0** pe discul profilului,
Login Data.logins = 0, Web Data.autofill = 0. **158 de verificări OK, ultima linie 0.**
`activitate.py lista`: „nu e in catalog” **0** înainte și **0** după, niciun rând „Colab” (`_proba/activitate_*.txt`).

## 6. Porțile (24.10.2026)
- `test_joc.py --dir lectii/vii m3-l18` → **TRECUT** (27 de întrebări jucate; singurul avertisment „1 niveluri”, așteptat) — `_proba/test_joc_final.txt`.
  Pe drum: Încă 1 de la pasul 5 pica la rezolvarea automată (ordinea: grila înainte de închiderea filei) — reparat în `solutie()`.
- `verifica_lectie.py index.html --fara-t1` → **ultima linie 0** (S0 TRECUT · S1 0 identice · S2 aplicare/execuție 6/6 · T0 0; avertismentul
  de densitate al antetului a dispărut după ce am scurtat introducerea) — `_proba/verifica_lectie_final.txt`.
- Playwright cu gesturi reale, 390 px cu atingere + 1280 px → **0 probleme, 158 OK, 0 erori JS**; capturile de telefon `_proba/_ecran_*_390.png`,
  privite (conectarea, Drive-ul, „Salvezi parola?”, meniul Nou, documentul cu „Salvat în Drive”, grila, Drive-ul meu, atelierul, laboratorul, diploma).
  Ce au găsit capturile și am reparat: pictogramele de fișier și banda de sus aveau clasa `foaie`, pe care `motor.css` o desenează ca foaie
  de hârtie (pătrate uriașe) → clase prefixate (`cg-t-*`, `b-foaie`); indiciul „Salvat în Drive” ieșea tăiat pe telefon → stă acum în rând.
- `_proba/numara.js` → 0 (cuvinte pe pas, cu „Acum în browserul tău adevărat”: 84 / 89 / 86 / 105 / 102; „Uite cum” ≤ 55; nicio propoziție
  peste 25 de cuvinte; testele simulatorului există; parolele inventate ≥ 15 caractere; pașii laboratorului ≤ 71 de cuvinte).
- `learninghub_date_personale.py` → 0. Fără fișiere de descărcat (.docx/.pptx/.xlsx): `curata_metadate.py` n-are ce curăța aici.

## 7. Contradicții și decizii (pentru profesor; n-am ales tacit)
- **Fereastra privată.** VI/13 n-a cerut-o („browserul din laborator nu e cunoscut”). Ajutorul Google o recomandă pe calculatoarele
  folosite de mai mulți (S2, S3), iar promptul cerea s-o folosesc dacă ajutorul o recomandă → lecția o cere (Ctrl+Shift+N, Chrome și Edge,
  S4-S5), cu drumul de rezervă: „Nu se deschide? Lucrezi într-o filă nouă, iar la final te deconectezi oricum.” Deconectarea rămâne
  obligatorie și în fereastra privată.
- **Izvoare (Dumbrava) = telefoanele elevilor** (memoria: „la Dumbrava lucrăm tot pe telefoanele elevilor”). Laboratorul e scris pentru
  calculatorul din laborator (Brauner); pentru telefon am pus, pliat, „Lucrezi pe telefonul tău?” (aplicația Documente Google + ghidurile
  de pe sit). Pașii de telefon nu au simulator și nu au probă pe un telefon real.
- **Numerotarea:** la Brauner e lecția 18, la Izvoare nr. 19 (calendarele lor); pagina urmează `unitati.json` (18).
- **Unde se deschide documentul nou / documentul deschis cu dublu clic** (filă nouă sau aceeași filă) nu e spus în ajutor pentru
  documentele obișnuite → simulatorul îl deschide în filă nouă și o spune, iar laboratorul are ambele drumuri („ai o singură filă?”).
- **Butonul de partajare:** „Trimiteți” sau „Permite accesul”? Ajutorul RO le are pe amândouă (S14). Azi butonul nu se folosește.

## 8. Nesigur / de confirmat (în `afirmatii.json` cu stare NESIGUR; de fotografiat: `capturi_lipsa.json`, C1-C12)
- Numele românești din Drive (ajutorul Drive e în engleză): **Nou**, meniul lui (Documente Google ▸ Document gol / Dintr-un șablon),
  **Acasă**, **Drive-ul meu**, **Distribuite cu mine**, Recente, Coș de gunoi; numele grilei („Aplicații Google”) și al aplicațiilor din ea.
- Starea salvării: „Se salvează…”, norul cu bifă, „Salvat în Drive” la trecerea mouse-ului (S8 vorbește de fișierele criptate).
- Pagina parolei, mesajul la parola greșită, ce afișează „Ai uitat parola?” la un cont de școală; lista de conturi după deconectare.
- Întrebarea „Salvezi parola?” în fereastra privată (apare? cu ce cuvinte?); dacă școala a oprit fereastra privată.
- Ferestrele de la prima intrare într-un cont nou; dacă limba Drive-ului o dă contul („Drive-ul tău e în engleză? Numele sunt cele din paranteze”).
- Desenul simulatorului (fără logo; „Desen: pe ecranul adevărat sunt mai multe aplicații” la grilă; „Desen aproximativ” la întrebarea browserului).

## 9. Pentru lecția următoare (19: documente și prezentări în colaborare; 20: publicare, istoric, contribuții; 22: evaluarea) — simulatorul `lectii/_sim/colab-google.js`
**Poți folosi** (API-ul e scris în capul fișierului și în `m3_noapte_23_10/granite/vii_l18.md`):
- `SimColabGoogle.creeaza(element, optiuni)`: `cont`, `conturi`, `start` ('fila' | 'conectare' | 'drive' | 'docs' | 'doc'), `tinta`,
  `fereastra` ('normala' | 'privata'), `browser` ('chrome' | 'edge'), `intreabaParola`, `fisiere` (`{id, titlu, tip:'doc'|'prez'|'foaie',
  text, loc:'meu'|'distribuite', proprietar, modificat}`), `contDeschis` + `fisiereContDeschis`, `lista`, `deschis`, `cuDrive`.
- Cârligele pentru voi: `partajare: (inst, fisier) => …` (pornește butonul „Permite accesul”, oprit azi), `etichetaPartajare`,
  `butoaneDoc: [{id, text, titlu, la(inst, fisier)}]`, `meniuStanga: [{id, nume, en, fisiere(inst)}]`, `inst.slot('doc-lateral' |
  'doc-bara' | 'drive-sus' | 'doc-pagina', fn)` (colegii simulați: alt nume, alt cursor, comentarii — în extensia voastră),
  `SimColabGoogle.extensie(nume, fn)` + `extensii:[nume]`, `inst.arataPanou(html | Element, titlu)`, `adaugaFisier`, `modificaFisier`,
  `scrie`, `redenumeste`, `deschideFisier`, `arataLista`, `stare()`, `jurnal()`, `on(eveniment, fn)`.
- Evenimentele: 'bara', 'conectare-adresa', 'conectare-parola', 'uitat', 'creeaza-cont', 'invitat', 'bula', 'conectat', 'grila',
  'aplicatie', 'nou', 'creat', 'titlu', 'scris', 'salvare', 'salvat-vazut', 'fila-noua', 'fila', 'fila-inchisa', 'lista', 'selectat',
  'deschis', 'profil', 'deconectat', 'verificat', 'fereastra-inchisa', 'partajare', 'actiune', 'desenat', 'schimbare'.
- `SimColabGoogle.TESTE` (bara, conectat, nesalvata, grila, creat, titlu, scris, salvat, inchis, regasit, distribuite, necitit, iesit,
  verificat, fereastra) și tipul `colab` pentru motor (`tipuri:{colab:SimColabGoogle.colab}`; `Q {sim, teste:[{c,v,d,ce,m}], gresit, arata}`).
- Datele: `CONTURI` (ana, radu, ioana — parole inventate, ≥ 15 caractere), `FISIERE_ANA`, `DOMENIU` (`scoala-exemplu.test`).
- Ce rămâne la elev după 18: documentul `Nume_Prenume_clasa_colaborare` cu două rânduri, în Drive-ul meu (contul școlii).
**NU schimbați** în `colab-google.js`: textele paginii de conectare, pașii conectării și ai deconectării, numele testelor și forma lui `Q`,
regula „nimic nu se salvează, nimic nu pleacă”. Un lucru nou = extensie nouă în `lectii/_sim/` (ex. `colab-google-partajare.js`).
**Atenție (corectat la reparația J1, 24.10.2026):** containerele simulatorului au prefixul `cg-` (`.foaie`, `.doc` etc. se ciocnesc cu
`motor.css`); înăuntrul lor sunt și clase scurte (`lbl`, `nr`, `s`, `m`, `on`, `sel`, `t`, `n`, `p`, `d`, `c`, `cap`, `gr`, `av`, `ad`, `pg`), dar
fiecare regulă CSS a simulatorului stă sub `.cg` / `.cg-*` (probat în `_proba/proba_reparatii.py`, [M]). `.cg-teste .lbl` ia și regula globală
`.lbl` din `motor.css` (litere mari, monospațiat), ca titlul testelor la celelalte simulatoare. Extensiile 19/20 refolosesc marcajul testelor
(`.cg-teste .lbl/.nr/.s/.m`), deci numele acestor clase NU se schimbă. Păstrați prefixul pe orice element nou.

## 10. Pentru componenta comună
Niciun defect găsit în simulatoarele altora (nu le-am folosit). În `motor.css`, clasa `.foaie` (padding mare) se aplică oricărui element
cu clasa asta, și în simulatoare: de știut pentru oricine scrie un simulator nou.

## 11. Reparațiile după judecata 1 (24.10.2026)
Autor proaspăt, după judecățile opus (`_verificare/judecator1.md`) și sonnet (`_verificare/ab_sonnet/judecator1.md`). Registrul, cu fiecare punct al
AMBELOR judecăți, reparația, locul și proba: **`_verificare/registru_j1.md`** (25 de puncte A-Y: 6 MAJOR, 19 MINOR; 25 reparate, 0 respinse).
Copia dinainte: `_proba/inainte_r1/`. Proba reparațiilor: `_proba/proba_reparatii.py` → `_proba/proba_reparatii_N.txt` (ultima linie 0).
- **Durata (socoteala nouă, `_proba/durata.js`):** drumul obligatoriu ≈ **48,6 minute** = 2.048 de cuvinte citite (110 pe minut, rata cu care a
  socotit judecătorul) + 30 de minute de gesturi (minutele pe fiecare loc sunt scrise în script). NEMĂSURAT pe copii. Au ieșit: a treia conectare
  reală (P4 continuă sesiunea de la P3), deconectarea + verificarea de la P3 (se fac la P5), testul „verificat” din Încearcă P3 (rămâne în atelier),
  pașii 10-11 ai laboratorului („Dacă mai ai timp”). Rămân două conectări reale: P3 (sesiunea P3→P5) și laboratorul. „Încă un exercițiu” e opțional.
- **Contul lăsat deschis:** rândul „Sună de pauză? Întâi Profil → Deconectează-te.” la P3 și P4; laboratorul, pasul 4: „dacă sună de pauză înainte
  de final, mergi direct la pasul 12”.
- **Telefonul:** rândul „Pe telefon: sari peste; pașii tăi sunt la laborator.” la fiecare bloc „Acum…”; blocul „Lucrezi pe telefonul tău?” are pașii
  Android (ghidul `jocuri/_ghiduri/docs`, capturi reale pe Android 14 emulat, RO, 22.09.2026) + ajutorul RO docs/answer/49114 pentru Android și iPhone
  (`_proba/_surse/docs_creare_android_ro.txt`, `docs_creare_ios_ro.txt`) + scoaterea contului (android/answer/7664951 RO, `android_cont_ro.txt`).
  Pe un telefon real nu s-a probat (fără cont): C14.
- **Drumul fără fereastră privată:** dus până la capăt (laborator 2 și 13, P3, P5), cu fraza adevărată pe fiecare drum; temeiul: 2917834 RO, „Dacă nu
  poți naviga în mod privat” (istoricul și cookie-urile se șterg de mână → îi spui profesorului).
- **Fereastra privată și „modul pentru invitați” (decizie, pentru profesor):** ajutorul Contului Google (2917834 RO) cere, pe dispozitivul altcuiva, o
  „fereastră de navigare privată”, iar pentru Chrome arată Profil → **Invitat**; ajutorul Chrome (6130773 RO) spune: invitat pe calculatorul altcuiva,
  incognito pe al tău. Lecția păstrează decizia autorului: fereastra privată cu Ctrl+Shift+N (același gest în Chrome și în Edge, scurtătura din
  ajutorul Chrome 95464 RO și din scurtăturile Edge RO), iar Uite cum P3 explică mesajul „folosește modul pentru invitați” de pe pagina de conectare.
  Dacă profesorul preferă modul pentru invitați în Chrome, se schimbă P3 și laboratorul 2 (simulatorul n-are nevoie de altceva).
- **„Fără internet”:** P1 Încă 1 rescris ca adevărat și când lucrul offline există (docs/answer/6388102 RO: se pornește dinainte, cu internet, nu în
  navigarea privată).
- **Numele de ieșire:** „Deconectează-te” (Sign out) — dovedit în ajutorul Gmail RO mail/answer/8154 (`_proba/_surse/mail_iesire_ro.txt`: „Dă clic pe
  Deconectează-te.”); 2917834 RO are forma veche, de politețe, „Deconectați-vă”.
- **„Salvezi parola?”** nu mai e citat ca sigur; refuzul e „dacă browserul te întreabă” (A9, A35 NESIGURE).
- **Simulatorul** (`lectii/_sim/colab-google.js`): API-ul NESCHIMBAT. Doar texte: mesajul testului `verificat` când fereastra privată e deja închisă și
  nota întrebării de parolă în fereastra privată; capul fișierului lămurește clasele CSS. Trecute în graniță („SCHIMBAT 24.10, 02:00”).
- **Pentru lecțiile 19-21 (de aliniat):** VII/21 a preluat „scoți contul de pe el, cum arată ghidul contului” → acum pașii din ajutorul Android;
  „✕ la Salvezi parola?” → „✕ dacă browserul te întreabă de parolă”; laboratorul 13 are două drumuri. În ajutorul RO al aplicației Documente pe
  telefon, „shared with me” = „Accesibile pentru mine”; pe calculator, „Distribuite cu mine” rămâne NESIGUR.
- **Fapte noi:** `afirmatii.json` A30-A35 (A30, A35 NESIGURE); `capturi_lipsa.json` C13 (titlul după ce scrii, în browser), C14 (telefonul real).
- **Porțile:** în `_verificare/registru_j1.md`, la sfârșit.

## 12. Reparația 2 (24.10.2026)
Autor proaspăt, după judecata 2 (`_verificare/judecator2.md`: 0 GRAV, D redeschis pe durată, 4 MINOR noi). Registrul: `_verificare/registru_j1.md`,
„Reparația 2”. Copia dinainte: `_proba/inainte_r2/`. Proba: `_proba/proba_reparatii.py` → `_proba/r2_proba_reparatii_2.txt` (ultima linie 0).
- **Durata (D), cu metoda judecătorului** (`_verificare/j2_durata.py`, rulat neschimbat, cu etichetele testelor și explicațiile de după „Corect”):
  **2.028 de cuvinte → 18,4 min citit + 31,2 min gesturi = 49,6 min** (înainte: 2.542 → 54,3). Scriptul lui ține încă 2,0 min pentru Încearcă P3
  „cu aceeași tastare”; Ana e acum deja conectată acolo, deci, după estimarea lui (−1,2 min), drumul e ≈ 48,4 min. La 100 de cuvinte/min: 51,5 min.
  NEMĂSURAT pe copii. Ce s-a tăiat: „Ce am învățat” din atelier (e în rezumatul diplomei), introducerea și sarcina atelierului, laboratorul (609 → 491
  de cuvinte obligatorii), „Cum lucrezi” (scurt, ca la VII/16-17), etichetele testelor (prin `ce`), explicații după „Corect”, „Uite cum” P1/P2.
  Gesturile reale au rămas toate (blocurile „Acum…”, laboratorul 13 pași); niciun pas nou.
- **Încearcă P3 fără a doua tastare:** extensia lecției `vii18-deja-conectat` (în `index.html`, prin API-ul public: `SimColabGoogle.extensie` +
  `inst.conecteaza`). Simulatorul comun `lectii/_sim/colab-google.js` NU s-a schimbat (nici textul, nici API-ul). Testele „bara” și „conectat” rămân,
  bifate de la început („…, ca la pasul 2”), ca „Arată-mi” (reset + soluție) să refacă singur conectarea.
- **Telefonul (Z, AA):** documentul deschis din listă → „atingi **Editează** (creionul)” (docs/answer/7068618 RO, Android și iOS: „Atinge Editează”;
  pictograma nu are text în pagină → desenul creionului NESIGUR, C15). Telefonul altcuiva: pașii din Setări sunt spuși „Pe Android”, cu confirmarea
  „Elimină contul sau Șterge” (7664951 RO); pe iPhone, contul se scoate din aplicație: poza de profil → „Gestionează conturile de pe acest dispozitiv”
  → „Elimină de pe acest dispozitiv” (`_proba/_surse/mail_iesire_ios_ro.txt`, mail/answer/8154 RO, iPhone: „elimină Contul Google din aplicație…
  te deconectează și de la toate celelalte aplicații Google de pe dispozitiv”; `drive_conturi_ios_ro.txt`, drive/answer/2424384, iPhone, doar EN).
  NESIGUR: același meniu chiar în aplicația Documente (A37); plasa rămâne „Nu găsești…? Îl rogi pe cel al cărui e telefonul”. Citite cu
  `_proba/surse_r2.py` (headless, profil temporar, fără cont, nimic tastat).
- **AB:** laboratorul 4, parola greșită de două ori: „închizi fereastra privată (într-o filă obișnuită: doar fila, cu ×)”.
- **AC:** „Închiderea unei file nu te deconectează: contul rămâne deschis în celelalte file.” (P3, P3 Încă 2; Î5 „…în fila Drive-ului”) —
  54490 RO: închiderea tuturor ferestrelor private te deconectează automat.
- **Pentru lecțiile 19-21:** simulatorul și API-ul neschimbate; textele vizibile schimbate sunt în graniță („SCHIMBAT 24.10, 03:10”).
  **VII/21 de aliniat:** blocul de telefon copiat (Editează; Android / iPhone la scoaterea contului) și „„Salvezi parola?” apeși ✕, ca la lecția 18”
  (titlul nu mai e citat în VII/18: „dacă browserul te întreabă, apeși ✕”).
- **Fapte:** `afirmatii.json` A11 (excepția), A16, A31 (Android + confirmarea), noi A36 (Editează), A37 (iPhone); `capturi_lipsa.json` C14 la zi, C15 nou.
