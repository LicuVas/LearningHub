# Trierea semnalărilor — V nr. 4 și VII nr. 4 (27.09.2026)

Linia `verifica_lectie.py` a blocat V cu 7 semnalări și VII cu 6 (plus 1 NESIGUR). Am deschis fiecare semnalare în pagina de ACUM (configurația reextrasă cu același `_extrage.py`) și în codul liniei.
**REAL** = un copil ar păți asta; **alarmă falsă** = limita liniei, nu defect al lecției. Citatele de mai jos au fost verificate automat în sursa lor.

## Pe scurt

| Lecția | Semnalări triate | Reale | Alarme false |
|---|---|---|---|
| V nr. 4 | 7 (S2: 1, T1: 6) | 0 | 7 |
| VII nr. 4 | 7 (S2: 1, T0: 2, T1: 3, + NESIGUR: 1) | 0 | 7 |

Niciuna nu cere o reparație în lecție. Sunt două retușuri opționale la VII (textul alternativ al pozei din pasul 1 și prima propoziție a introducerii).

## Atenție: raportul V e pe o versiune veche

Pagina V a fost scrisă la 16:53, iar linia pornise la 16:52. Linia a lucrat deci pe textul de dinaintea reparațiilor N1-N3, N6, N7 ale judecătorului. Diferă 5 locuri: legenda pieselor scoase, pașii 1, 3 și 5 din laborator și întrebarea 5, unde răspunsul corect s-a schimbat din „memorate” în „prelucrate”. Exercițiile de practică sunt identice, deci trierea de mai jos rămâne valabilă.
Pe cele 10 rânduri schimbate am căutat cei 35 termeni ai lecțiilor viitoare din glosarul T0 și am găsit 0. Totuși, rulează linia din nou pe V înainte de publicare, măcar S0, S1 și T0 (nu costă nimic).
- Reparația liniei: verifica_lectie.py main (l.808-812): pagina V a fost scrisă la 16:53, după ce linia pornise (16:52), deci S1/S2/T0/T1 au lucrat pe versiunea de dinaintea reparațiilor N1-N3, N6, N7 ale judecătorului. Reparația: amprenta (sha256) a index.html la început și la sfârșit; dacă diferă, raportul scrie „ÎNVECHIT, rulează din nou” și nu dă numărul final.

## V nr. 4 — „Structura generală a unui sistem de calcul”

### V-S2 · S2 · **alarmă falsă**

- Semnalarea: execuție/aplicare 1 din 13 (8%) < 50%
- De ce: Renumărat după regula 5 (lista mai jos): 8 din 13 (62%) sunt aplicare sau execuție; pe litera regulii („Încearcă” + atelier) 6 din 6 (100%). Sensibilitate: P3 varianta 1 și P5 „Încearcă” sunt la limită; chiar dacă amândouă ar fi recunoaștere, pe litera regulii rămâne 5 din 6, iar numărătoarea extinsă ar coborî la 6 din 13 (46%). Linia a pus la recunoaștere tot ce nu e simulator.
- Dovada:
  - `raport.md (V)`: «execuție/aplicare 1 din 13 (8%) < 50%»
  - `verifica_lectie.py`: «fel = "recunoaștere" if t in X.RECUNOASTERE else "execuție"»
  - `_extrage.py`: «RECUNOASTERE = BUILTIN»
  - `05_STANDARD_LECTIE.md`: «Cel puțin jumătate din „Încearcă” + atelier sunt de APLICARE (răspunsul nu e scris nicăieri; elevul îl obține aplicând regula)»
- Reparația în lecție: nimic obligatoriu. Observație care nu blochează: 5 din cele 7 „Încă un exercițiu” de la V sunt recunoaștere (piesă ↔ rol); dacă vrei mai multă aplicare, P4 varianta 1 poate primi situații fără cuvintele din definiție (de ex. „Ai deschis 20 de file în browser și calculatorul merge greu”).
- Reparația în linie: verifica_lectie.py treapta_s2 (l.199) + _extrage.py (l.19): felul exercițiului se decide după TIP (RECUNOASTERE = BUILTIN), nu după conținut, deci orice alegere/ordonare/sortare e trecută la recunoaștere, chiar când cere un calcul sau o situație nouă. Reparația: (1) numără pe scopul regulii 5 („Încearcă” + atelier), iar „Încă un exercițiu” raportează-l separat; (2) pentru tipurile cu variante, felul se hotărăște pe conținut: recunoaștere dacă răspunsul corect (varianta ok, perechile, itemii cu categoria lor) apare, după normalizare, în textul pașilor de până atunci sau în explicațiile exercițiilor anterioare (de ex. ≥ 70% din cuvintele de conținut ale răspunsului într-o singură propoziție); altfel aplicare; (3) opțional, câmpul `fel` declarat de autor în configurație, verificat cu aceeași regulă. Proba de calibrare: pe V și VII nr. 4 trebuie să iasă ≥ 50%.

Renumărarea după regula 5 (aplicare = răspunsul nu e scris nicăieri; execuție = în simulator; recunoaștere = alegi/potrivești vocabular sau un fapt deja scris):

| Loc | Tip | Fel (după regula 5) | De ce | Citat |
|---|---|---|---|---|
| P2 Încearcă | classify | aplicare | obiecte noi (căști, joc de șah, cablul mouse-ului) sortate cu regula dată; nu sunt în text | «Folosește regula: e o piesă sau nu? Sortează.» |
| P2 Încă un exercițiu 1 | tf | recunoaștere | răspunsul e scris chiar în explicația exercițiului de dinainte | «Jocul și programul de muzică sunt șiruri de instrucțiuni, nu obiecte.» |
| P3 Încearcă | order | aplicare | situație nouă (săgeata într-un joc); ordinea se obține aplicând intră → prelucrare → iese | «Într-un joc pe calculator apeși tasta cu săgeata spre dreapta» |
| P3 Încă un exercițiu 1 | classify | aplicare (la limită) | situație nouă (poza cu telefonul); 3 din 4 itemi au indicii de cuvinte din text, „face poza mai luminoasă” cere regula | «Faci o poză cu telefonul (și el e un sistem de calcul).» |
| P4 Încearcă | choice | aplicare | leagă două fapte (desenul deschis stă în RAM; RAM se golește fără curent) pe o situație nouă | «Desenezi pe un calculator de birou de 20 de minute și încă n-ai salvat» |
| P4 Încă un exercițiu 1 | classify | recunoaștere | potrivești piesa cu rolul ei, aproape cu cuvintele din text („socotește” ↔ „face calculele”, „păstrează” ↔ „păstrează”) | «Socotește cât fac 125 + 380» |
| P4 Încă un exercițiu 2 | tf | recunoaștere | scris în text: „vezi ventilatorul, nu procesorul” | «Ventilatorul care răcește procesorul este chiar procesorul.» |
| P5 Încearcă | choice | aplicare (la limită) | diagnostic: de la simptom la piesă; textul spune rolul sursei, nu simptomul | «Apeși butonul de pornire, dar nu pornește nimic: nici ventilatoarele, nici luminițele.» |
| P5 Încă un exercițiu 1 | match | recunoaștere | rolurile pieselor, spuse invers („fără X…”): vocabular | «Ce s-ar întâmpla fără fiecare piesă? Leagă.» |
| P6 Încearcă | order | aplicare | modelul literei A dus pe mouse; drumul mouse-ului nu e scris | «Miști mouse-ul, iar săgeata de pe ecran se mută.» |
| P6 Încă un exercițiu 1 | choice | aplicare | cauză → etapa drumului care lipsește; situația nu e în text | «Apeși tasta B, dar pe ecran nu apare nimic.» |
| Atelier | fotografie | execuție | etichete puse în simulator, pe o fotografie nouă | «Pune fiecare etichetă pe piesa ei.» |
| Atelier încă unul 1 | classify | recunoaștere | același tip ca P4 varianta 1: piesă ↔ rol | «Calculează media notelor tale» |

Aplicare + execuție: **8 din 13 (62%)**; pe litera regulii („Încearcă” + atelier): **6 din 6 (100%)**. Pragul e 50%.

### V-T1-S-1 · T1 · **alarmă falsă**

- Semnalarea: S-1 [toată lecția] NEFACUT: atelierul și întrebarea 4 cer simulatorul „fotografie”, iar „Acum în aplicația adevărată” cere laboratorul
- De ce: Cititorul a spus singur că știe ce să încerce la atelier și în laborator; a picat doar pentru că nu poate atinge simulatorul și nu e în laborator. Judecătorul a parcurs atelierul și întrebarea 4 în browser, cu atingeri, și merg.
- Dovada:
  - `index.html (V, acum)`: «Apasă o etichetă de deasupra fotografiei (prima e deja aleasă).»
  - `t1/verdicte_seed7/S-1.json (V)`: «Celelalte nouă exerciții pot fi răspunse pe baza textului citit»
  - `t1/verdicte_seed7/S-1.json (V)`: «Dar spune explicit: Exercițiu în aplicația simulată. Nu pot accesa interfața.»
  - `judecator_2.md (V)`: «am mutat eticheta pe locul bun: 5 din 5 teste trecute»
- Reparația în lecție: nimic.
- Reparația în linie: prompt_generator.md (l.34-35) + verifica_lectie.py _t1_detalii (~l.648): cititorul nu poate folosi simulatorul și nu e în laborator, dar sarcina de parcurgere îl pune să spună dacă „observă acțiunea”. Reparația: la pașii cu simulator și la „Acum în aplicația adevărată”, cititorul răspunde doar la „știi ce să încerci?” și „înțelegi efectul promis?”; un NEFACUT de parcurgere ai cărui pași căzuți sunt toți de simulator/laborator, cu `stie_ce_sa_incerce: true`, nu se numără (rămâne notă pentru J/R).

### V-T1-S-4 · T1 · **alarmă falsă**

- Semnalarea: S-4 [Pasul 3] NEFACUT: nu spune cum se citesc datele melodiei de pe disc și nu numește ieșirea pentru sunet
- De ce: Sarcina cerea doar PĂRȚILE drumului (intră / prelucrare / memorare / iese), pe care un copil le poate pune pe exemplul cu muzica din Pasul 3: Play = intră, calculatorul lucrează cu melodia = prelucrare, o ține minte = memorare, melodia se aude = iese. Cititorul a cerut piese (difuzor), adică lecția 5 din plan. Motivul (1), discul ca sursă, e acoperit la întrebarea 3: pasul „de pe disc în memoria RAM” e dat ca item de ordonat, cu indiciu.
- Dovada:
  - `t1/sit/plimbare/sarcini.json (V)`: «apeși butonul Play într-o aplicație de muzică, iar melodia începe să se audă»
  - `t1/sit/plimbare/sarcini.json (V)`: «Dacă lecția nu spune ce se întâmplă la o anumită etapă pentru acest exemplu, scrie NEFACUT»
  - `index.html (V, acum)`: «de exemplu, apare pe ecran»
  - `Calendar_ore_5AM_5M.md`: «Dispozitive de intrare, de ieșire și de intrare-ieșire»
  - `index.html (V, acum)`: «Desenul e luat de pe disc și pus în memoria RAM»
- Reparația în lecție: nimic (a adăuga difuzoarele acum ar aduce vocabularul lecției 5, interzis de „Ce au găsit judecătorii” nr. 9).
- Reparația în linie: prompt_generator.md (l.30-33): clauza „dacă lecția nu spune UNDE, CE EXACT sau CU CE confirmi… NEFACUT” e făcută pentru GESTURI în aplicație; generatorul a mutat-o pe aplicări conceptuale („dacă lecția nu spune ce se întâmplă… pentru acest exemplu, scrie NEFACUT”), unde exemplul nou lipsește din lecție prin definiție. Reparația: la aplicarea unei reguli, NEFACUT numai dacă lipsește REGULA (sau o piesă a ei), nu exemplul; plus: generatorul primește glosarul T0 al lecțiilor viitoare și nu alege situații care cer termenii lor (sunetul → difuzoare = lecția 5).

### V-T1-S-7 · T1 · **alarmă falsă**

- Semnalarea: S-7 [Pasul 6] NEFACUT: nu spune ce face procesorul când apeși Enter
- De ce: Pentru Enter, drumul prin piese e identic cu cel al literei A (tastatură → placa de bază → procesor → memoria RAM → placa video → monitor); singurul lucru nescris („procesorul face un rând nou în text”) e exact ce trebuie să obțină elevul aplicând modelul. A-l scrie în lecție ar strica aplicarea.
- Dovada:
  - `t1/sit/plimbare/sarcini.json (V)`: «Dacă lecția nu spune prin ce piesă trece un anumit pas pentru acest caz, scrie NEFACUT»
  - `t1/verdicte_seed7/S-7.json (V)`: «nu spune ce face procesorul atunci când apeși Enter»
  - `index.html (V, acum)`: «Prin placa de bază, apăsarea ajunge la procesor.»
  - `index.html (V, acum)`: «procesorul pune litera A în text»
- Reparația în lecție: nimic.
- Reparația în linie: prompt_generator.md (l.30-33): clauza „dacă lecția nu spune UNDE, CE EXACT sau CU CE confirmi… NEFACUT” e făcută pentru GESTURI în aplicație; generatorul a mutat-o pe aplicări conceptuale („dacă lecția nu spune ce se întâmplă… pentru acest exemplu, scrie NEFACUT”), unde exemplul nou lipsește din lecție prin definiție. Reparația: la aplicarea unei reguli, NEFACUT numai dacă lipsește REGULA (sau o piesă a ei), nu exemplul; plus: generatorul primește glosarul T0 al lecțiilor viitoare și nu alege situații care cer termenii lor (sunetul → difuzoare = lecția 5).

### V-T1-TB-1 · T1 · **alarmă falsă**

- Semnalarea: teach-back LIPSA: «Elevul poate deosebi hardware de software…»
- De ce: Lecția predă deosebirea (regula din Pasul 2, două exerciții, întrebarea 2). Cititorul și-a folosit cele 8 propoziții pe piese și n-a pomenit programele; notatorul judecă explicația, nu lecția. Cuvântul „software” lipsește intenționat: lecția spune „program”/„aplicații”, iar programa lecției 4 e „Rolul componentelor hardware”. Dacă vrei totuși cuvântul, e decizia ta, nu un defect.
- Dovada:
  - `index.html (V, acum)`: «Un program nu e un obiect: e un șir de instrucțiuni pe care piesele le urmează.»
  - `index.html (V, acum)`: «Folosește regula: e o piesă sau nu? Sortează.»
  - `index.html (V, acum)`: «Hardware sau program? Sortează.»
  - `t1/verdicte_seed7/S-2.grader.json (V)`: «Elevul poate deosebi hardware de software, ca parte a folosirii eficiente și în siguranță a dispozitivelor de calcul.»
- Reparația în lecție: nimic.
- Reparația în linie: verifica_lectie.py _t1_detalii (l.667-671) + l.540 și prompt_generator.md (l.36): un obiectiv LIPSA blochează pe baza UNEI singure explicații de cel mult 8 propoziții, de la un singur cititor (seed 7), deși lecția are 5 obiective și 9 piese. Reparația: blochează doar dacă obiectivul e LIPSA la ≥ 2 cititori (seed-uri); plafonul de propoziții ≥ numărul obiectivelor + 3; LIPSA la un obiectiv pe care lecția îl acoperă vizibil (pas marcat + exercițiu) → avertisment, nu blocaj.

### V-T1-TB-2 · T1 · **alarmă falsă**

- Semnalarea: teach-back LIPSA: «Elevul poate identifica, pe un calculator real sau desfăcut, componentele…»
- De ce: E un obiectiv de FĂCUT, nu de spus: lecția îl acoperă prin atelier, întrebarea 4 și pașii din laborator. O explicație în cuvinte nu-l poate arăta.
- Dovada:
  - `index.html (V, acum)`: «găsește piesele într-un calculator desfăcut»
  - `index.html (V, acum)`: «Pune fiecare etichetă pe piesa ei.»
  - `index.html (V, acum)`: «Caută din ochi»
  - `judecator_2.md (V)`: «am mutat eticheta pe locul bun: 5 din 5 teste trecute»
- Reparația în lecție: nimic.
- Reparația în linie: prompt_generator.md (l.41-44): obiectivele trebuie să fie „ce poate SPUNE elevul”, dar generatorul a scris obiective de PERFORMANȚĂ (identifică pe un calculator, elaborează un document), pe care o explicație în cuvinte nu le poate arăta. Reparația: obiectivele de performanță se marchează `fel: "performanta"` și nu se notează din teach-back; se verifică prin existența unui exercițiu/atelier cu teste care le cere (S) sau în aplicația reală (R).

### V-T1-TB-3 · T1 · **alarmă falsă**

- Semnalarea: teach-back LIPSA: «Elevul poate explica, pentru o acțiune simplă (de exemplu apăsarea unei taste), care piese…»
- De ce: Pasul 6 e exact obiectivul acesta, iar „Încearcă” de la pasul 6 și întrebarea 3 îl exersează. Cititorul l-a lăsat pe dinafară din explicația lui de 8 propoziții.
- Dovada:
  - `index.html (V, acum)`: «Toate împreună: drumul literei A»
  - `index.html (V, acum)`: «Prin placa de bază, apăsarea ajunge la procesor.»
  - `index.html (V, acum)`: «Miști mouse-ul, iar săgeata de pe ecran se mută.»
- Reparația în lecție: nimic.
- Reparația în linie: verifica_lectie.py _t1_detalii (l.667-671) + l.540 și prompt_generator.md (l.36): un obiectiv LIPSA blochează pe baza UNEI singure explicații de cel mult 8 propoziții, de la un singur cititor (seed 7), deși lecția are 5 obiective și 9 piese. Reparația: blochează doar dacă obiectivul e LIPSA la ≥ 2 cititori (seed-uri); plafonul de propoziții ≥ numărul obiectivelor + 3; LIPSA la un obiectiv pe care lecția îl acoperă vizibil (pas marcat + exercițiu) → avertisment, nu blocaj.

## VII nr. 4 — „Obiecte într-un document”

### VII-S2 · S2 · **alarmă falsă**

- Semnalarea: execuție/aplicare 8 din 17 (47%) < 50%
- De ce: Renumărat: 11 din 17 (65%) sunt aplicare sau execuție; pe litera regulii („Încearcă” + atelier) 5 din 6 (83%). Linia a pus la recunoaștere trei exerciții care cer un calcul (P5 „Încearcă”, P5 varianta 2, P6 varianta 1). Fără P6 varianta 1 (aplicare simplă) tot rămân 10 din 17 (59%).
- Dovada:
  - `raport.md (VII)`: «execuție/aplicare 8 din 17 (47%) < 50%»
  - `index.html (VII, acum)`: «Faci un tabel cu 6 colegi; despre fiecare scrii Numele și Culoarea preferată.»
  - `index.html (VII, acum)`: «Un tabel are 3 coloane și 5 rânduri. Câte celule are în total?»
- Reparația în lecție: nimic.
- Reparația în linie: verifica_lectie.py treapta_s2 (l.199) + _extrage.py (l.19): felul exercițiului se decide după TIP (RECUNOASTERE = BUILTIN), nu după conținut, deci orice alegere/ordonare/sortare e trecută la recunoaștere, chiar când cere un calcul sau o situație nouă. Reparația: (1) numără pe scopul regulii 5 („Încearcă” + atelier), iar „Încă un exercițiu” raportează-l separat; (2) pentru tipurile cu variante, felul se hotărăște pe conținut: recunoaștere dacă răspunsul corect (varianta ok, perechile, itemii cu categoria lor) apare, după normalizare, în textul pașilor de până atunci sau în explicațiile exercițiilor anterioare (de ex. ≥ 70% din cuvintele de conținut ale răspunsului într-o singură propoziție); altfel aplicare; (3) opțional, câmpul `fel` declarat de autor în configurație, verificat cu aceeași regulă. Proba de calibrare: pe V și VII nr. 4 trebuie să iasă ≥ 50%.

Renumărarea după regula 5 (aplicare = răspunsul nu e scris nicăieri; execuție = în simulator; recunoaștere = alegi/potrivești vocabular sau un fapt deja scris):

| Loc | Tip | Fel (după regula 5) | De ce | Citat |
|---|---|---|---|---|
| P2 Încearcă | classify | recunoaștere | itemii repetă definițiile (căsuțe pe rânduri și coloane = tabel): vocabular, permis | «Trei propoziții despre excursie» |
| P2 Încă un exercițiu 1 | choice | recunoaștere | întrebarea conține chiar cuvintele regulii „să vadă cum arată” | «Vrei ca un coleg să vadă cum arată barajul de la Bicaz.» |
| P2 Încă un exercițiu 2 | classify | recunoaștere | „note”, „cum arată”, „ore” sunt chiar exemplele regulii | «Notele a 4 colegi la 3 materii» |
| P3 Încearcă | wordobj | execuție | simulator Word | «Sub titlul „Floarea-soarelui” scrie, pe un rând nou» |
| P3 Încă un exercițiu 1 | choice | recunoaștere | „Uite cum” arată exact situația asta; textul: „apeși Enter: cursorul coboară pe un rând nou, gol” | «Cursorul clipește la capătul primului paragraf. Apeși Enter și tastezi» |
| P3 Încă un exercițiu 2 | wordobj | execuție | simulator Word | «Sub rândul „Te așteptăm vineri la serbare.” scrie, pe un rând nou» |
| P4 Încearcă | wordobj | execuție | simulator Word | «Pune poza floarea-soarelui.png pe un rând al ei» |
| P4 Încă un exercițiu 1 | choice | recunoaștere | scris în pas: „Acest dispozitiv… : poze din calculator” | «s-a deschis o listă cu trei variante» |
| P4 Încă un exercițiu 2 | wordobj | execuție | simulator Word | «Pune poza lacul-bicaz.jpg pe un rând al ei» |
| P5 Încearcă | choice | aplicare | numără coloane și rânduri pentru date noi; răspunsul (2 și 7) nu e scris | «Faci un tabel cu 6 colegi; despre fiecare scrii Numele și Culoarea preferată.» |
| P5 Încă un exercițiu 1 | tf | recunoaștere | definiția coloanei, scrisă în pas: vocabular | «O coloană a tabelului merge de-a latul, de la stânga la dreapta.» |
| P5 Încă un exercițiu 2 | choice | aplicare | calcul nou: 3 × 5 = 15 celule | «Un tabel are 3 coloane și 5 rânduri. Câte celule are în total?» |
| P6 Încearcă | wordobj | execuție | simulator Word | «Sub „Orarul de luni:” pune un tabel cu» |
| P6 Încă un exercițiu 1 | choice | aplicare (simplă) | regula „întâi coloanele, apoi rândurile” pe numere noi (4x2) | «Ce tabel primești dacă dai clic?» |
| P6 Încă un exercițiu 2 | wordobj | execuție | simulator Word | «Sub „Scorul la șah:” pune un tabel cu» |
| Atelier | wordobj | execuție | simulator Word, 9 teste | «Acum faci singur un referat cu toate trei obiectele» |
| Atelier încă unul 1 | wordobj | execuție | simulator Word | «Încă unul, ca în Word-ul adevărat» |

Aplicare + execuție: **11 din 17 (65%)**; pe litera regulii („Încearcă” + atelier): **5 din 6 (83%)**. Pragul e 50%.

### VII-T0-paragrafe · T0 · **alarmă falsă**

- Semnalarea: [folosit înainte de definiție] paragrafe — prima folosire: «…sus un paragraf de text, la mijloc un dese…»
- De ce: „Prima folosire” e textul alternativ al imaginii din Pasul 1 (al 4-lea argument al lui fig(), atributul alt), pe care un copil care vede ecranul nu-l citește; nu e instrucțiune, exercițiu, indiciu sau întrebare (regula 1). În textul vizibil, definiția din Pasul 3 vine înaintea oricărei folosiri. Cuvântul nu apare nici în planurile claselor V-VI.
- Dovada:
  - `index.html (VII, acum)`: «sus un paragraf de text, la mijloc un desen»
  - `index.html (VII, acum)`: «const fig=(src,w,h,alt,cap)=>`<figure class="captura"><a href="${src}" target="_blank"><img src="${src}" alt="${alt}"»
  - `index.html (VII, acum)`: «Un paragraf e bucata de text care se termină acolo unde ai apăsat tasta Enter»
  - `_extrage.py`: «<img> -> [Imagine: alt]»
- Reparația în lecție: opțional, pentru cititorul de ecran (nu blochează): în textul alternativ, „sus un paragraf de text” → „sus un text”.
- Reparația în linie: _extrage.py md(), funcția _img (l.75-79): textul alternativ intră în textul verificat de oracol ca „[Imagine: …]”. Reparația: în varianta T0 textele alternative se scot sau se pun într-un fișier separat, trecut la `exceptii` ca 50_antet.md (verifica_lectie.py l.313).

### VII-T0-densitate · T0 · **alarmă falsă**

- Semnalarea: [text prea dens pentru începători] media 28 cuvinte/propoziție (prag 22); 67% propoziții peste 25 cuvinte (prag 30%)
- De ce: Oracolul a măsurat doar antetul (50_antet.md): 3 propoziții, de 29, 31 și 25 de cuvinte, deci „67%” înseamnă 2 propoziții. Lecția propriu-zisă (51_lectia.md) trece: 257 de propoziții, media 13,2 cuvinte, 9% peste 25 (am refăcut calculul cu aceeași formulă). Regula 2 privește textul pașilor, nu antetul.
- Dovada:
  - `t0_oracol.txt (VII)`: «text prea dens pentru începători @ 50_antet.md»
  - `index.html (VII, acum)`: «și le pui chiar tu: întâi în Word-ul simulat din pagină, apoi în Word-ul adevărat.»
  - `oracol_novice.py`: «if len(cuvinte) < pr["min_cuvinte_pagina"]:»
- Reparația în lecție: opțional (1 minut): împarte prima propoziție a introducerii: „Afli din ce obiecte e făcut un document Word: text, imagini, tabele. Apoi le pui chiar tu, întâi în Word-ul simulat din pagină, apoi în Word-ul adevărat.”
- Reparația în linie: verifica_lectie.py construieste_t0 (l.281-283) + oracol_novice.py verif_densitate (l.798-824): pe 3 propoziții procentele nu spun nimic. Reparația: densitatea se măsoară pe antet + lecție împreună, sau verif_densitate cere un minim de propoziții pe fișier (de ex. ≥ 10) înainte să dea verdict.

### VII-T1-grila · T1 · **alarmă falsă**

- Semnalarea: blocaj «grilă» (×1): termen folosit înainte de explicație — «Pe fila Inserare (Insert) apeși Tabel (Table). Se deschide o grilă de pătrățele.»
- De ce: Propoziția citată e chiar cea care introduce termenul (marcat), cu explicația „de pătrățele”; imediat sub ea e captura grilei, iar „Explică-mi altfel” o compară cu o tablă de șah. Cititorul care a semnalat blocajul și-a terminat sarcina (S-5 FACUT).
- Dovada:
  - `index.html (VII, acum)`: «<mark>grilă</mark> de pătrățele»
  - `index.html (VII, acum)`: «Grila e ca o tablă de șah mică»
  - `raport.md (VII)`: «| S-5 | Pasul 6 | FACUT |»
- Reparația în lecție: nimic.
- Reparația în linie: verifica_lectie.py _t1_detalii (l.650-661): lângă excepția „citat doar din antet”, încă una: blocajul nu se numără dacă propoziția citată e cea care introduce termenul (în textul dat cititorului termenul e îngroșat acolo) și sarcina a ieșit FACUT; devine avertisment („introdus fără definiție explicită?”).

### VII-T1-TB-1 · T1 · **alarmă falsă**

- Semnalarea: teach-back LIPSA: «Elevul elaborează, folosind text, imagine și tabel împreună, un document util…»
- De ce: Obiectiv de FĂCUT: atelierul, „încă unul” și pasul din Word-ul adevărat cer exact un document cu text, imagine și tabel. O explicație în cuvinte nu-l poate arăta.
- Dovada:
  - `index.html (VII, acum)`: «Acum faci singur un referat cu toate trei obiectele»
  - `index.html (VII, acum)`: «Încă unul, ca în Word-ul adevărat»
  - `judecator_2.md (VII)`: «Atelierul făcut exact după indiciu trece 9 din 9 teste.»
- Reparația în lecție: nimic.
- Reparația în linie: prompt_generator.md (l.41-44): obiectivele trebuie să fie „ce poate SPUNE elevul”, dar generatorul a scris obiective de PERFORMANȚĂ (identifică pe un calculator, elaborează un document), pe care o explicație în cuvinte nu le poate arăta. Reparația: obiectivele de performanță se marchează `fel: "performanta"` și nu se notează din teach-back; se verifică prin existența unui exercițiu/atelier cu teste care le cere (S) sau în aplicația reală (R).

### VII-T1-TB-2 · T1 · **alarmă falsă**

- Semnalarea: teach-back LIPSA: «Elevul spune ce înseamnă a formata un obiect dintr-un document…»
- De ce: Formatarea e lecția 6 și 7 în plan; lecția 4 declară doar „Obiecte într-un document”. Linia a lipit de lecția 4 conținutul „Operații de formatare a unui document: text, imagine, tabel, pagină” pentru că împarte cu titlul cuvintele document/text/imagine/tabel, iar generatorul a scris singur că lecția nu trebuia să ajungă acolo.
- Dovada:
  - `t1/sit/plimbare/obiective.json (VII)`: «lecția de azi s-a oprit la inserarea obiectelor, nu la formatarea lor»
  - `Calendar_ore_VII_A.md`: «| 13.10.2026 | 6 | M1 | Formatarea textului și a paragrafului | predare |»
  - `Calendar_ore_VII_A.md`: «| 20.10.2026 | 7 | M1 | Formatarea imaginii, a tabelului și a paginii | predare |»
  - `index.html (VII, acum)`: «const PROG='Obiecte într-un document: text, imagini, tabele';»
  - `_plan.py`: «alese = [c for s, c in scor if s > 0 and s >= max(0.8, 0.5 * best)]»
- Reparația în lecție: nimic (formatarea predată acum ar încălca ordinea din plan).
- Reparația în linie: _plan.py lectiile_clasei (l.137-141): un conținut se leagă de toate lecțiile cu scor ≥ jumătate din maxim. Reparația: fiecare conținut merge la lecția (lecțiile) unității unde scorul lui e cel mai mare, iar un conținut al cărui cuvânt-cap („formatare”) e în titlul altei lecții („Formatarea…”) merge acolo. Plus prompt_generator.md (l.44): obiectivele „asta vrem să aflăm” se marchează și dau avertisment, nu blocaj. Proba: la VII, „Operații de formatare…” trebuie să ajungă la lecțiile 6-7.

### VII-T1-S-8-NESIGUR · T1 (NESIGUR, nenumărat) · **alarmă falsă**

- Semnalarea: S-8 [toată lecția]: Pasul 5 fără acțiune în simulator; atelierul „are ordini contradictorii”
- De ce: Atelierul spune separat cum arată documentul la final (de sus în jos) și în ce ordine lucrezi (textul și tabelul întâi, poza la urmă); cele două se potrivesc, iar judecătorul a trecut 9 din 9 teste urmând indiciul. Pasul 5 e de numărat (câte coloane, câte rânduri), nu are gest; generatorul l-a trecut greșit printre „pașii cu acțiune”. Linia a procedat corect când nu l-a numărat (citatele cititorului erau parafrazate).
- Dovada:
  - `t1/verdicte_seed7/S-8.json (VII)`: «Atelier are ordini contradictorii ale elementelor documentului.»
  - `index.html (VII, acum)`: «trebuie să arate așa, de sus în jos»
  - `index.html (VII, acum)`: «fă-l în ordinea din Word-ul adevărat»
  - `index.html (VII, acum)`: «Fiecare obiect a ajuns unde era cursorul»
  - `index.html (VII, acum)`: «Înainte să faci tabelul, îl numeri:»
  - `t1/sit/plimbare/sarcini.json (VII)`: «Pentru fiecare pas cu acțiune (Pasul 3, Pasul 4, Pasul 5, Pasul 6, Atelier, Acum în aplicația adevărată)»
- Reparația în lecție: nimic.
- Reparația în linie: prompt_generator.md (l.21): lista „pașilor cu acțiune” s-o dea scriptul din configurație (pașii al căror exercițiu e simulator sau cere un gest), nu generatorul.

## Reparațiile liniei, pe fișiere

- `verifica_lectie.py` main: amprenta paginii la început și la sfârșit (raport ÎNVECHIT dacă diferă).
- `verifica_lectie.py` treapta_s2 + `_extrage.py` RECUNOASTERE: felul exercițiului după conținut, nu după tip; numărat pe „Încearcă” + atelier.
- `verifica_lectie.py` _t1_detalii: nu numără (1) parcurgerile căzute doar pe simulator sau laborator, (2) blocajele pe propoziția care introduce termenul, într-o sarcină FACUT, (3) un teach-back LIPSA găsit la un singur cititor.
- `prompt_generator.md`: (1) NEFACUT la aplicare numai dacă lipsește regula, nu exemplul; (2) situații fără vocabularul lecțiilor viitoare; (3) obiective de performanță marcate separat; (4) obiectivele din afara lecției dau avertisment; (5) „pașii cu acțiune” vin din configurație.
- `_plan.py` lectiile_clasei: un conținut al programei merge la lecția unde scorul lui e cel mai mare, nu la toate de peste prag.
- `_extrage.py` md/_img + `oracol_novice.py` verif_densitate: textul alternativ al pozelor nu intră la regula 1; densitatea nu se calculează pe 3 propoziții.

Semnalări triate: V 7, VII 7 (6 care blochează + 1 NESIGUR); alarme false 14.
Semnalări REALE (defecte ale lecțiilor), pe ambele lecții:
0
