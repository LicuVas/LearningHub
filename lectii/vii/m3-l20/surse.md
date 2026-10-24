# Surse — lecția VII · M3 · 20: „Publicare și modificare de conținut. Istoricul editării și contribuția fiecăruia”

Autor: tura de noapte 23→24.10.2026 (campania „Lecțiile refăcute”). Nimic din memorie: ce spune lecția despre Documentele Google
vine din ajutorul oficial Google, citit fără cont (secțiunea 3); ce n-a putut fi confirmat e în secțiunea 8, în `afirmatii.json`
(stare NESIGUR / SURSA_OFICIALA_EN) și în `capturi_lipsa.json`.

## 1. Ancora în documentele profesorului
- `Info_Gimnaziu_2026/planificari/Calendar_ore_7_MA.md` (Brauner): **12.02.2027, lecția 20**, „Publicare și modificare de conținut.
  Istoricul editării și contribuția fiecăruia”, predare. La Izvoare (`Calendar_ore_VII_A.md`) aceeași temă e **16.02.2027, nr. 21** în
  numărătoarea lor. Pagina urmează `unitati.json` (20).
- `Proiectul_unitatii_VII-U3.md`: VII-U3 „Aplicații colaborative”, 5 ore, **CS.1.3**; ora 20: „predare · teorie, exercitii”.
  Consolidat: „operații uzuale (accesare/conectare, vizualizare, editare, formatare) … respectând reguli de etică”. Ora 22 (evaluarea
  sumativă) = „lucrul colaborativ (produs de echipă + contribuție individuală)”: lecția de azi arată CUM se vede contribuția fiecăruia.
- `curriculum.json`, clasa a VII-a, „Aplicații colaborative”: conținutul declarat (textul exact) — „Operații permise în aplicație:
  publicare, modificare conținuturi în aplicația colaborativă”. Activitatea de învățare din programă pe care o face lecția: „vizualizarea
  contribuției individuale a membrilor colectivului de autori prin utilizarea funcției de istoric de editare în scopul autoevaluării și
  interevaluării”. „Facilități ale aplicațiilor de tip colaborativ” și „Interfaţa aplicaţiei colaborative” NU sunt declarate (le pot declara
  18-19).
- Aplicația = **Google (Documente Google, Drive)**, cu contul Google de la școală: decizia dirijorului din 23.10.2026
  (`m3_noapte_23_10/prompturi/_noapte.md` §1).

## 2. Ce presupun că știe elevul și ce acopăr (bife = verificat; detaliat în `profil.json`)
- [x] **VII/18** (citită întreagă: pagina, `surse.md`, `afirmatii.json`, granița): fereastra privată, conectarea, ✕ dacă browserul te
  întreabă de parolă, Drive-ul meu, Distribuite cu mine, „Salvat în Drive”, Profil → Deconectează-te + verificarea. Reluate în laborator
  (pașii 2, 3, 13) cu cuvintele paginii PUBLICATE (după reparațiile ei de la 02:00 și 03:10 — reparația I, 24.10); nu le predau din nou.
  Blocul de telefon și „Sună de pauză?” = tot cuvintele ei (reparațiile D și F). Simulatorul ei (`colab-google.js`) e baza; nu l-am schimbat.
- [x] **VII/19** (se scrie în paralel; citită granița `vii_l19.md`, actualizarea de la ~02:15): „Permite accesul” (Share) → adresa → rolul
  Cititor / Comentator / Editor → „Trimite”; „Acces general: Restricționat”; Comentatorul „citește și comentează” (lecția 19 spune
  că „poate și să propună schimbări: lecția 20” — aliniat); comentariul („Adaugă un comentariu” → „Comentează”; „Răspunde”; „Rezolvă”);
  documentul echipei, cu câte un paragraf de la fiecare. Folosesc exact aceste cuvinte; adresa inventată a profesorului e aceeași
  (`profesor.tic@scoala-exemplu.test`). **De verificat la publicare:** dacă judecata lui 19 schimbă vreun nume, îl schimb și aici.
- [x] **VII/21** (în reparare; granița `vii_l21.md` + pagina): „nu ștergi munca altuia; lași un comentariu”. Nu contrazic: Sugerarea e
  al doilea drum „cu acordul autorului”, iar la ✕ pagina îndeamnă la un comentariu cu motivul. 21 mă numește („lecția 20 (istoricul
  versiunilor, contribuția fiecăruia)”) — exact ce predau.
- [x] **VII/3**: copia PDF a unui document — legată la pasul 5 („ca în lecția 3”).
- [x] Datele personale (adresa de acasă) nu se pun în lucrare: clasele V-VI; folosit într-un „Încă un exercițiu” (P2) și la „Publică pe web”.

## 3. Interfața Google: de unde vin numele (citite 24.10.2026, 01:07-01:40)
Toate prin `_proba/surse_google*.py` (Chromium din Playwright, headless, context TEMPORAR ro-RO, fără cont, nimic tastat, User-Agent cu
`LearningHub-lectii/1.0 (educational site)`); textul în `_proba/_surse/<nume>_tot.txt`, cu secțiunile pliate desfăcute.
- **S1** `support.google.com/docs/answer/6033474?hl=ro&co=GENIE.Platform%3DDesktop` („Sugerează editări în Documente Google”):
  „Poți să sugerezi modificări într-un document fără să modifici textul inițial. Dacă proprietarul acceptă sugestiile tale, acestea
  înlocuiesc textul inițial.” · „Dacă nu găsești Sugestii în bara de instrumente, alege o opțiune: în dreapta sus, dă clic pe Editare;
  din meniul drop-down, selectează Sugerare” · „Vei vedea modificarea într-o culoare nouă. Tot ce ștergi va fi tăiat.” · „Alege un
  comentariu. Dă clic pe Acceptă sau Respinge.” (pictogramele: ✓ și ✕, privite mărite) · „Utilizatorii pot să sugereze modificări dacă
  le acorzi permisiunea să comenteze sau să editeze documentul.” Pagina are mențiunea „ar putea include conținut tradus cu tehnologie AI”.
  EN (`hl=en`): „At the top right, click Editing. From the drop-down, select Suggesting.” · „Click Accept or Reject.”
- **S2** `support.google.com/drive/answer/2494822?hl=ro` („Trimiteți fișierele din Google Drive”): „Cititor: … nu poate să editeze, să
  comenteze, să sugereze sau să permită accesul” · „Comentator: … poate să comenteze și să facă sugestii …, dar nu poate să-l editeze” ·
  „Editor: … poate să editeze, să comenteze, să accepte sau să respingă sugestii și să permită accesul” · „Introdu adresa de e-mail …
  Selectează o opțiune: Cititor, Comentator, Editor … Dă clic pe Trimite sau Permite accesul.” EN: „Viewer, Commenter, or Editor”.
- **S3** `support.google.com/docs/answer/190843?hl=ro&co=GENIE.Platform%3DDesktop` („Găsește modificările aduse unui fișier”):
  „În dreapta sus, dă clic pe Ultima modificare [pictograma: Istoricul versiunilor]” (pictograma: ceas cu săgeată) · „pentru a răsfoi
  versiunile anterioare ale unui fișier, ai nevoie de permisiune pentru a edita fișierul respectiv” · „Alege cea mai recentă versiune.
  Poți afla cine a actualizat fișierul și ce modificări a făcut.” · „în stânga sus, dă clic pe Înapoi” · „În panoul din dreapta, alege o
  versiune anterioară. În partea de sus, dă clic pe Restabilește această versiune [apoi] Restabilește.” · „Dă clic pe Mai multe [apoi]
  Denumește această versiune.” · „Afișează numai versiunile denumite” · „Vezi cine a modificat o parte dintr-un document … disponibilă
  numai pentru … Education Plus” (de aceea lecția NU folosește „Afișează editorii”). EN: „Last edit”, „Restore this version”, „Name this
  version”, „Back”.
- **S4** `support.google.com/a/users/answer/13004165` (Google Workspace Learning Center, „Tips to edit and collaborate on files”, doar în
  engleză, și cu `hl=ro`): „You need Owner or Editor access to see the version history.” · „Click File > Version history > See version
  history.” · „Below the timestamp, you can review: The names of people who edited the document. The color next to each person’s name.
  The edits they made appear in that color.” · „To revert to this version, click Restore this version.” → culorile din pasul 3.
- **S5** `support.google.com/docs/answer/183965?hl=ro&co=GENIE.Platform%3DDesktop` („Fă publice Documentele…”): „Fișier [apoi] Trimite
  [apoi] Publică pe web … Dă clic pe Publică.” · „în funcție de setările contului, când publici un fișier, îl poți face vizibil pentru toți
  utilizatorii de pe web, pentru toți cei din organizație sau pentru un grup de persoane din organizație. Ai grijă când publici informații
  private sau sensibile.” · „Pentru a elimina un fișier de pe web, trebuie să oprești publicarea acestuia.” · „Conținut publicat și setări
  … Oprește publicarea” · „dacă folosești un cont de serviciu sau de la școală, administratorul poate să fi dezactivat posibilitatea de a
  publica un fișier” · „Proprietarii și editorii fișierelor pot publica fișiere.” EN: „File > Share > Publish to web”.
- **S6** `support.google.com/docs/answer/49114?hl=ro&co=GENIE.Platform%3DDesktop` („Creează, afișează sau descarcă un fișier”): „În partea
  de sus, dă clic pe Fișier [apoi] Descarcă. Alege un tip de fișier. Fișierul se va descărca pe computer.” → în laborator NU se descarcă.
- **S7** Varianta Android a S1 (`…6033474?hl=ro&co=GENIE.Platform%3DAndroid`, pașii în engleză și pe pagina românească): „Tap More. Turn on
  Suggest changes. Make a suggestion. When you are finished, tap Done.” · „find the highlighted text and tap Suggestion. Tap Accept or Reject.”
- **S8** Varianta Android a S3 (`…190843?hl=ro&co=GENIE.Platform%3DAndroid`): „Pentru a vedea istoricul versiunilor, deschideți un document
  la docs.google.com pe un computer.” → blocul „Lucrezi pe telefonul tău?”.
- **S9** `support.google.com/docs/answer/65129?hl=ro` (comentariile) — citit doar ca să folosesc cuvintele lui 19 („Adaugă un comentariu”,
  „Comentează”); lecția nu le predă.
- Căutări în Centrul de ajutor (doar adresa `?q=`), pentru culorile din istoric: `_proba/_surse/cauta_*.txt` — au dus la S4.

## 4. Ce am refolosit și ce nu
- **Jocul `jocuri/colaborare-vii`**, nivelul 4 „Modific, urmăresc, public” (lecția 20) — citit, nemodificat. Am păstrat: ideea „sugestia
  nu schimbă textul până nu hotărăște autorul”, criteriul „face textul mai bun sau strică munca cuiva?”, strategia restaurării („cea mai
  nouă variantă bună”), analogia creionului și a gumei, analogia albumului cu poze, rolul Cititor la publicare, „Nu publici niciodată cu
  link de Editor”. NU am preluat: capturile CryptPad (`mod-sugestii.webp`, `istoric-versiuni.webp`, `fila-colaborare.webp`) — aplicația
  decisă e Google, iar o captură CryptPad ar fi arătat alte butoane; „Sugerare” scris în joc ca nume Google — l-am confirmat pe ajutorul RO
  (S1); „Oricine are linkul — poate doar citi” trimis pe grupul părinților (lecția 19 interzice „Oricine are linkul”).
- **`lectii/_sim/colab-google.js`** (VII/18) — folosit prin API-ul lui (sloturile `doc-pagina`, `doc-lateral`, `doc-bara`, `partajare`,
  `arataPanou`, `modificaFisier`, `extensie`), NESCHIMBAT.
- **Extensia NOUĂ `lectii/_sim/colab-google-istoric.js`** (proprietar: lecția aceasta; numele verificat liber) — vezi §9.
- **`lectii/_sim/colab-google-echipa.js`** (VII/19) — NU e folosit și NU e schimbat (lecția 20 are colegii ei simulați).
- **Imaginea pasului 0**: `img/corecturi.webp`, din Wikimedia Commons, „Example of copyedited manuscript.jpg”, autor Phoebe,
  **CC BY-SA 3.0**, licența citită din API pe 24.10.2026 (`img/SURSE.json`); decupată pe foaia cu corecturi, 800×490, 88 KB
  (`_proba/fa_imagini.py`). Legenda are titlul, autorul, licența cu legătură, sursa și „decupată”.
- **Ghidurile de telefon** (`jocuri/ghiduri/#docs`, `#cont-drive`) — legate din blocul „Lucrezi pe telefonul tău?”, ca la VII/18.

## 5. SIGURANȚA — ce salvează și ce trimite pagina
**Citit în cod:** `colab-google-istoric.js` nu scrie în `localStorage` / `sessionStorage` / cookie și nu face cereri; câmpurile (paragraful
editat, numele versiunii, adresa din „Permite accesul”) sunt `<textarea>` / `<input type="text">`, fără `<form>`, fără `name`, cu
`autocomplete/autocorrect/autocapitalize="off"`, `spellcheck="false"`.
**Probat** (`_proba/proba_lectie.py` → `proba_lectie.json`, ieșirea `proba_lectie_3.txt`): servire locală 127.0.0.1, orice altă cerere
oprită și notată cu corpul ei (fontul Google, `/api/progres`, `/api/activitate` — toate oprite), închidere doar cu `ctx.close()`. Un elev
INVENTAT („Elev Istoric”, cod 7320) se înscrie prin caseta reală și trece toată lecția cu atingeri / clicuri și taste reale, pe 390 px cu
atingere și pe 1280 px, cu drumuri greșite de copil și cu marcaje unice tastate (în paragrafe, în numele versiunii, în adresa de partajare).
Rezultat, pe ambele aparate: marcajele apar de **0** ori în stocarea paginii și în cererile oprite; **0** cereri ajunse afară; niciun
`type=password`, niciun `<form>`; **0** erori JS; după închidere, marcajele **0** pe discul profilului, Login Data.logins = 0,
Web Data.autofill = 0. **168 de verificări OK, ultima linie 0.**
`activitate.py lista`: „nu e in catalog” **0** înainte și **0** după, niciun rând „Istoric” (`_proba/activitate_*.txt`).
`learninghub_date_personale.py` → 0. Fără fișiere de descărcat (.docx/.pptx/.xlsx): `curata_metadate.py` n-are ce curăța aici.
Din `_proba` am șters miniaturile Commons căutate (fără atribuire) și pictogramele ajutorului Google privite (`_proba/curata_proba.py`).

## 6. Porțile (24.10.2026)
- `test_joc.py --dir lectii/vii m3-l20` → **TRECUT** (27 de întrebări jucate; singurul avertisment „1 niveluri”, așteptat) —
  `_proba/test_joc_2.txt`. A trecut din prima rulare.
- `verifica_lectie.py index.html --fara-t1` → **ultima linie 0** (S0 TRECUT · S1 0 identice · S2 aplicare/execuție 6/6 · T0 0) —
  `_proba/verifica_lectie_2.txt`.
- Playwright cu gesturi reale, 390 px cu atingere + 1280 px → **0 probleme, 168 OK, 0 erori JS**; capturile de telefon `_proba/_ecran_*_390.png`,
  privite (sugestia colorată, casetele ✓ / ✕, istoricul, restabilirea, Publică pe web, partajarea, atelierul, laboratorul, diploma).
  Ce au găsit capturile și am reparat: butonul Profil ieșea tăiat pe telefon (bara documentului nu mai încăpea cu ceasul) → pe ecran îngust
  `.cg-drpt` se rupe pe rânduri (regula CSS stă în extensia mea, nu în `colab-google.js`); diferența „etajul.” → „etajul întâi.” apărea ca
  „etajul.” tăiat + „etajul întâi.” adăugat → acum punctuația e bucată separată (`_proba/dif_proba.js` → 0); istoricul pe telefon avea
  „← Înapoi” sub listă → acum e sus.
- `_proba/numara.js` → 0 (cuvinte pe pas, cu blocul „Acum…”: 99 / 103 / 103 / 109 / 106; „Uite cum” ≤ 59; nicio propoziție peste 25 de
  cuvinte; testele, versiunile, sugestiile și paragrafele cerute de teste există; pașii laboratorului ≤ 49 de cuvinte).

## 7. Contradicții și decizii (pentru profesor; n-am ales tacit)
- **„Sugerare” sau „Sugestii”?** Ajutorul RO (S1) numește opțiunea din meniul butonului „Editare” **Sugerare** și butonul din bara de
  instrumente **Sugestii**; pagina e tradusă automat. Lecția spune „Sugerare (Suggesting)” peste tot și îl învață pe elev drumul prin
  butonul din dreapta sus. De confirmat pe ecran (C1).
- **Profesorul ca Cititor nu vede istoricul.** Promptul cere publicarea către profesor ca Cititor / Comentator, iar contribuția fiecăruia
  „o vede și profesorul”. Ajutorul (S3, S4): istoricul îl văd doar Editorii și proprietarul. Lecția spune ambele, fără să se contrazică:
  lucrarea gata se dă ca Cititor (pasul 5, laboratorul), iar textul pasului 5 și laboratorul 12 spun „Ca Cititor sau Comentator, profesorul
  nu vede istoricul; îl vede doar ca Editor” (reparația K). La VII/19 profesorul a primit deja rolul Comentator, dacă și-a scris adresa:
  laboratorul 12 nu-i mai schimbă rolul („e deja în listă? Nu-i schimbi rolul”; Cititor doar dacă nu are acces — reparația E).
  **Pentru profesor:** la VII/22 (produs de echipă + contribuție individuală) aveți nevoie de rolul Editor (sau documentul să fie al
  dumneavoastră); spuneți-le elevilor ce rol vă dau.
- **PDF-ul** se descarcă „pe computer” (S6), deci în laborator ar rămâne pe calculatorul comun → lecția îl arată, dar laboratorul spune
  „nu descărcați nimic pe calculatorul din laborator”; PDF-ul e pentru acasă.
- **„Publică pe web”** e doar numit și arătat în simulator (se poate apăsa, ca în aplicație; testul `nepublicat` pică și spune de ce).
  Pe conturile de școală administratorul îl poate opri (S5) — dacă la școală e oprit, cu atât mai bine.
- **Cine numește versiunea:** orice Editor o poate numi (ajutorul: după ce o alegi în istoric, pe care îl văd Editorii); ca să n-o numiți
  de trei ori, o numește unul singur, de obicei proprietarul — spus în pasul 4 și cu motivul în laboratorul 10; în atelier Încă, Radu o
  numește pentru că l-a rugat Mihai, proprietarul (reparația L).
- **Cine hotărăște o sugestie:** ajutorul lasă orice Editor să accepte sau să respingă (S2); lecția predă regula echipei: hotărăște
  autorul paragrafului, iar pe propria sugestie din paragraful altuia nu apeși tu ✓ / ✕ (reparația A). Simulatorul lasă gestul (ca
  aplicația, probabil — NESIGUR, A21), dar testul îl prinde și spune de ce.
- **„Colegul o acceptă sau o respinge”** cere ca echipa să fie la calculatoare în aceeași oră (Brauner: da; Tupilați: a VII-a e singură,
  deci colegii sunt din aceeași clasă — merge). Dacă un coleg lipsește: atelierul.
- **Izvoare (Dumbrava) = telefoanele elevilor**: istoricul versiunilor nu există în aplicația de pe telefon (S8). Pe telefon elevul face
  pașii 3-5 și 7 ai laboratorului (sugestia, hotărârile), cu gesturile din blocul „Lucrezi pe telefonul tău?”; istoricul (8-11) îl face
  în atelierul lecției și îi spune profesorului că pe cel adevărat nu l-a văzut; versiunea rămâne fără nume dacă nimeni din echipă nu e la
  un calculator; pașii 2, 6 și 13 nu sunt pentru telefon (reparația F; „un coleg de la calculator” a ieșit: la Izvoare nu e laborator).
- **Numerotarea:** la Brauner e lecția 20, la Izvoare nr. 21 (calendarele lor); pagina urmează `unitati.json` (20).

## 8. Nesigur / de confirmat (în `afirmatii.json`; de fotografiat: `capturi_lipsa.json`, C1-C10)
- Cuvântul de pe butonul modului după alegere („Sugerare” / „Sugestii”) și numele românesc al modului „Viewing” (Vizualizare).
- Aspectul casetei sugestiei (numele, rândul „Adaugă / Șterge / Înlocuiește”, butoanele ✓ ✕) — desenul e al lecției.
- Numele românești din meniul Fișier: „Istoricul versiunilor”, „Vezi istoricul versiunilor”, „Denumește versiunea actuală”,
  „Document PDF (.pdf)”, „Descărcări” (ajutorul le dă în engleză sau nu le dă).
- Cum se confirmă numele versiunii (Enter?) și textul ferestrei de confirmare la „Restabilește”.
- Rolul ales din oficiu în „Permite accesul” (simulatorul: Editor).
- Pe numele cui apare în istoric o sugestie acceptată (simulatorul: pe al celui care a propus-o; nicio întrebare nu depinde de asta).
- Opțiunea de sugestii din aplicația de telefon, în română (ajutorul o dă doar în engleză: „Suggest changes”), și dacă trebuie întâi
  „Editează” (creionul) (A23, C9).
- Dacă Editorul vede ✓ / ✕ și pe propria sugestie (A21, C11) și ce arată modul Vizualizare cu sugestiile deschise (A22, C12): căutate
  în Centrul de ajutor, headless, fără cont (`_proba/surse_r1.py` → `_proba/_surse/r1_*.txt`), fără răspuns.
- Simulatorul e un desen: un paragraf se editează într-o casetă (în Documentele adevărate scrii direct în pagină; pagina o spune la fiecare
  sarcină), lipsesc „Afișează modificările” și „Afișează numai versiunile denumite” din istoric, iar fereastra „Permite accesul” e simplificată.

## 9. Pentru lecția următoare (21: etica; 22: evaluarea „produs de echipă + contribuție individuală”) — `lectii/_sim/colab-google-istoric.js`
**Poți folosi** (API-ul e scris în capul fișierului și în `m3_noapte_23_10/granite/vii_l20.md`):
- încarci `colab-google.js`, apoi `colab-google-istoric.js`; tipul pentru motor `tipuri:{colabIstoric:SimColabIstoric.colabIstoric}`,
  `Q {sim:{start:'doc', cont, fisiere, deschis, istoric:{eu, rol, proprietar, mod, autori, versiuni, sugestii, profesor, acces}}, teste,
  intrebare?, solutie?, gresit?}`.
- `versiuni:[{id, cand, autori:[cheie], par:[{id, autor, de?, text}], nume?}]` (de la cea mai veche; ultima = documentul de acum);
  `sugestii:[{id, par, de, nou}]`; autorii inventați `SimColabIstoric.AUTORI` (ana, radu, ioana, mihai, maria) sau ai tăi (`autori:{}`).
- Testele: `mod`, `sugerat`, `neatins`, `decis`, `istoric`, `vazut`, `raspuns`, `numita`, `inapoi`, `restabilit`, `nerestabilit`,
  `partajat`, `nepublicat`, `descarcat`, `nedescarcat` + orice test din `SimColabGoogle.TESTE`.
- **De la 24.10.2026 (reparația după judecata 1):** `sugerat {v:{par, contine?, lipseste?, exact?}}` — `exact` = paragraful întreg cerut
  (sau o listă), comparat fără diacritice / majuscule / spații în plus; folosiți-l ori de câte ori cereți o schimbare mică în textul
  altuia (altfel o sugestie care șterge restul paragrafului trece). În paragraful ALTUIA, `sugerat` cere sugestia încă deschisă (dacă
  elevul și-a apăsat singur ✓ / ✕, pică, cu motivul). Pe Editare caseta pornește de la textul adevărat; pe Vizualizare nu se văd și nu se
  hotărăsc sugestiile.
- `inst.istoric` (`stare()`, `seteazaMod`, `sugereaza`, `editeaza`, `accepta`, `respinge`, `deschideIstoric`, `alegeVersiune`, `denumeste`,
  `restabileste`, `inchideIstoric`, `partajeaza`, `publicaWeb`, `opresteWeb`, `descarca`, `on`).
- Pentru VII/22: „contribuția individuală” = versiunile cu numele elevului în istoric (`vazut` + `intrebare`), plus „versiunea gata”
  (`numita`). Aceleași cuvinte: Sugerare, ✓ Acceptă / ✕ Respinge, istoricul versiunilor (ceasul cu săgeată, Ultima modificare),
  Denumește această versiune, Restabilește această versiune, Înapoi, Permite accesul → Cititor.
**NU schimbați:** numele testelor, forma lui `Q`, numele din interfață (cele NESIGURE se schimbă doar după capturile C1-C10), regula
„nimic nu se salvează, nimic nu pleacă”. Un lucru nou = extensie nouă, cu nume nou. Clasele CSS au prefixul `cgi-`.

## 10. Pentru componenta comună (`colab-google.js`, proprietar VII/18)
- **Bara documentului pe telefon:** cu un buton în plus în slotul `doc-bara`, butonul Profil iese tăiat la 390 px (bara `.cg-drpt` nu se
  rupe pe rânduri; `.cg` are `overflow:hidden`). Ocolirea mea, doar în pagina care încarcă extensia: `@media (max-width:560px){.cg-drpt{flex-wrap:wrap}}`.
  Propunere pentru VII/18: aceeași regulă în `colab-google.js`. Proba: `_proba/_ecran_p1_sugestie_390.png` (acum „A” e pe rândul al doilea; în prima rulare era tăiat — capturile ei
  au fost suprascrise).
- **Fișierul cu `proprietar`:** `hDoc` scrie sub bară „Ce poți face într-un document primit de la un coleg afli în lecția 19.” — la 20 și
  22 mesajul e vechi. Am ocolit-o: fișierele mele nu au `proprietar` (îl ține extensia). Propunere: un câmp `notaAltuia` (text sau `false`).

## 11. Reparațiile după judecata 1 (24.10.2026)
Autor proaspăt, după judecățile `_verificare/judecator1.md` (opus: 1 GRAV / 4 MAJOR / 5 MINOR) și `_verificare/ab_sonnet/judecator1.md`
(sonnet: 0 / 2 MAJOR / 5 MINOR). **Registrul: `_verificare/registru_j1.md`** — 13 puncte (A-M), 12 REPARATE, 1 RESPINS PARȚIAL (J: un pas
nou ar face 6 pași după pasul 0; standardul cere 3-5). Copia dinainte: `_proba/inainte_r1/`.
- **A (GRAV)** — sugestia proprie din paragraful colegului, acceptată chiar de elev, primea „Corect”. Acum testul o prinde („Decizia e a
  celui care a scris textul”), mesajul simulatorului spune ce s-a întâmplat, iar regula e predată la pasul 2 și reluată în laborator (5).
- **B** — `sugerat` cu `exact`: o sugestie care șterge sau adaugă și altceva în paragraful colegului nu mai trece. **C** — pe Editare,
  caseta pornește de la textul adevărat (nicio editare directă falsă). **D** — „Sună de pauză? Întâi Profil → Deconectează-te.” în toate
  blocurile „Acum…”. **E** — laboratorul 12 nu-i mai coboară profesorului rolul Comentator de la lecția 19. **F** — blocul de telefon
  spune ce pași faci pe telefon și care nu, cu cuvintele VII/18 publicate. **G-M (MINOR)** — Vizualizare = doar citești; numele nesigure
  cu EN; parola și verificarea de la final ca VII/18; profesorul ca Cititor / Comentator nu vede istoricul; cine numește versiunea, cu
  motivul; rezerva „Nu vezi culori?”; durata.
- **Durata** (metoda judecătorilor VII/18, `_proba/durata.py` → `_proba/r1_durata_3.txt`): **49,5 min** la 110 cuvinte/min (47,7 la 120);
  înainte 52,1. Tăieturile: „Cum lucrezi” scurt, ca la VII/18; explicația atelierului = o frază („Ce am învățat” e în rezumatul diplomei);
  introducerile atelierului și laboratorului scurtate; nota despre casetă scoasă din sarcina atelierului. NEMĂSURAT pe copii.
- **Porțile:** `_proba/proba_reparatii.py` → **0** (120 OK pe 390 cu atingere + 1280; `_proba/proba_reparatii_7.txt`; drumurile
  judecătorilor pentru GRAV / MAJOR + 16 drumuri ale mele pe fiecare aparat) · proba autorului `_proba/proba_lectie.py`, rerulată → **0**
  (168 OK, `_proba/r1_proba_lectie_2.txt`) · `test_joc.py` → **TRECUT** (`_proba/r1_test_joc_2.txt`) · `verifica_lectie.py --fara-t1` →
  **0** (`_proba/r1_verifica_lectie_2.txt`) · `learninghub_date_personale.py` → **0** · `numara.js` → **0** · `durata.py` → **0** ·
  „nu e in catalog” după probe: **0** (`_proba/r1_activitate_dupa.txt`). Capturile de telefon privite: `_proba/_ecran_r1_*_390.png`.
- **Pentru lecția următoare (VII/21, VII/22):** API-ul extensiei NESCHIMBAT (numele testelor, forma lui Q, `inst.istoric`); adaosurile
  sunt în §9 („De la 24.10.2026”) și în capul fișierului. Profesorul rămâne cu rolul primit la VII/19 (Comentator, dacă a dat adresa);
  pentru istoric are nevoie de Editor — întrebarea pentru profesor e în §7.

## 12. Reparația 2 (24.10.2026)
Autor proaspăt, după `_verificare/judecator2.md` (opus: A-L ÎNCHISE; M redeschis ca MAJOR pentru durată; N, O, P MINOR noi).
**Registrul: `_verificare/registru_j1.md`, secțiunea „Reparația 2”** — M, N, O, P: toate REPARATE. Copia dinainte: `_proba/inainte_r2/`.
- **M (MAJOR, durata)** — tăieturile judecătorului: sarcina 5 a atelierului (partajarea cu profesorul, dublura lui P5) și testul `partajat`;
  blocul „Acum…” de la P2 = doar pauza (nimeni nu făcuse încă o sugestie); fraza despre istoricul profesorului scoasă din laboratorul 12
  (e în pasul 5); „Uite cum” de la P4 la 38 de cuvinte. Apoi strângeri fără gesturi scoase: introducerea, P0 (al doilea paragraf repeta
  obiectivul), sarcinile și „Uite cum” care repetau pasul, nota despre casetă (o spune simulatorul), etichetele testelor, explicațiile
  după „Corect”, propozițiile repetate din laborator. Laboratorul are tot 13 pași.
  Durata, cu metoda judecătorului 2 (`_proba/r2_durata.py` = `j2_durata.py` + `j2_cuv.js`, gesturile lui fără cele două scoase):
  **2.209 cuvinte → 49,3 min la 110 cuvinte/min** (era 54,9); cu lista lui neschimbată 51,6; metoda VII/18 (`durata.py`) 46,3. NEMĂSURAT pe copii.
- **N** — mesajele simulatorului spun „hotărăște autorul”, „textul scris de <nume>”, „sugestia propusă de <nume>” (acord corect și pentru
  Ioana sau Maria); în pagină, „hotărăște autorul” la P1 și în laboratorul 5.
- **O** — rândul „Pe telefon: sari peste; pașii tăi sunt la laborator.” în fiecare bloc „Acum…”, ca la VII/18-19.
- **P** — legătura „atelierul lecției” din laboratorul 1: 38 px pe telefon (era 22), duce la atelier.
- **Porțile:** `_proba/proba_reparatii.py` → **0** (172 OK, `_proba/r2_proba_reparatii_4.txt`, literele A-P) · `_proba/proba_lectie.py` →
  **0** (166 OK) · `test_joc.py` → **TRECUT** · `verifica_lectie.py --fara-t1` → **0** · `learninghub_date_personale.py` → **0** ·
  `numara.js` → **0** · „nu e în catalog” (cu î) → **2**, ca la judecătorul 2 (înainte și după). Capturile de telefon
  `_proba/_ecran_r2_*_390.png`, privite.
- **Pentru lecția următoare (VII/21, VII/22):** API-ul extensiei NESCHIMBAT. Etichetele implicite ale testelor `mod`, `decis`, `istoric`,
  `raspuns`, `nerestabilit` sunt mai scurte (de exemplu `raspuns` = „Ai ales răspunsul potrivit, sub simulator”); cine vrea altă etichetă o dă
  cu `ce` sau `d` pe test. Atelierul lecției 20 nu mai cere partajarea cu profesorul (o cere P5 „Încearcă” și laboratorul 12).
