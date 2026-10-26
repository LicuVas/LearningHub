# VIII/23 — „Ce este un șir de valori. Unde apar șiruri în viața reală” — surse, decizii, probe

**Nu e publicată, nu e în depozit (fără commit).** Autor: agentul autor al valului M4, 26.10.2026 (08:17 →). Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md` (25.10.2026) + promptul `m4_26_10\prompturi\a_viii23.md`.

## 1. Ancora (documentele profesorului au prioritate)

| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul | `Info_Gimnaziu_2026\planificari\Calendar_ore_VIII.md` r. 31 („12.03.2027 \| 23 \| M4 \| Ce este un șir de valori. Unde apar șiruri în viața reală \| predare”), `data\unitati.json` (VIII-U3, nr. 23), `lectii\plan.json` | întocmai |
| Unitatea | `unitati.json`: VIII-U3 „Șiruri de valori. De la algoritm la program”, CS.2.1, CS.2.2, CS.3.3, 11 ore | `unitateTitlu` întocmai; `competente:['CS.2.1']` (singura pe care o lucrează lecția: CS.2.2 și CS.3.3 cer programe, lecțiile 24-29) |
| Competența | `curriculum.json`, CS.2.1: „Identificarea șirurilor de valori în diferite contexte de prelucrare în vederea construirii algoritmilor”; standardul: „Elevul analizează scenarii de prelucrare a datelor, pentru a identifica șiruri de valori și moduri de operare cu acestea” | obiectivul și pașii 4-5 (scenariul → șirul; întrebările = „moduri de operare”, doar numite) |
| Conținutul | `curriculum.json`, clasa a VIII-a, domeniul Algoritmi: „Șir de valori (noțiuni introductive)” | `continuturi` întocmai (singurul declarat) |
| Activitatea profesorului | `data\activitati_lectii_VII_VIII.json`, lecția 23: „Elevii dau exemple de șiruri din viața lor (notele, temperaturile săptămânii, scorurile) și le scriu pe tablă cu indici. Se introduce ideea de element și poziție.” (resurse: „tablă, exemple aduse de elevi”) | scheletul lecției: exemplele (temperaturile săptămânii, notele, scorurile / golurile), element și poziție (P1, P2), „pe tablă cu indici” → simulatorul desenează șirul ca pe tablă, cu pozițiile deasupra și, la cerere, indicii jos (t₁…t₇); „exemple aduse de elevi” → laboratorul, pasul „Dacă mai ai timp” (un șir al elevului) |
| Analogia profesorului | `data\analogii.json`, VIII-U3: vestiarul cu ușițe numerotate; „unde se rupe”: numerotarea de la 0 în program și ieșirea în afara șirului | vestiarul = P0 (fotografie) și P2 („ca ușițele din vestiar”); „ieșirea în afara șirului” = P3 („o poziție mai mare decât lungimea nu există”). Numerotarea de la 0 NU (ține de limbaj): vezi „Pentru profesor” |
| Proiectul unității | `planificari\Proiectul_unitatii_VIII-U3.md` (ora 23: predare, „teorie, exercitii”; descriptorii CS.2.1) | De bază: „identifică șiruri de valori și moduri de bază de operare cu acestea (prin numărare, sumă, produs, parcurgeri), în pași ghidați” → pașii 4-5, numai ca întrebări |
| Activitățile din programă (CS.2.1) | „analiza unor exemple de prelucrări în care intervine un număr variabil de date de intrare…”; „identificarea unor șiruri de valori pe baza unei proprietăți (valori pare/impare, pozitive/negative etc.)”; „generarea unui șir de valori pe baza unei reguli…” | luată: prima (poveștile din P4, atelier, Î5). NU luate: a doua (selectarea elementelor cu o proprietate ține de numărare / verificare, lecțiile 25 și 28) și a treia (generarea după regulă — cerință de algoritm, CS.2.2); costul reintroducerii: un „Încă un exercițiu” în P4. De decis de profesor. |

Ce n-am găsit pe disc: manualul de Informatică și TIC al clasei a VIII-a (căutat în `Dropbox\Scoala\_DOSARE_SCOLI\*\2026-2027\08_Manuale_si_materiale\Clasa_VIII` — doar programa — și în `Materiale_predare\Informatica\Manuale_si_auxiliare` — doar un manual de IX). Deci notația „ca în manual” NU e verificată pe manual (vezi §4).

### Conținutul → unde e predat, exersat, verificat (S8)

| Partea conținutului | Pas (predat) | Exersat | Verificat (întrebări) |
|---|---|---|---|
| șirul = valori de același fel, în ordine; elementul | P2 „Ce este un șir de valori” (pasul 2 din 6) | Încearcă: șirul notelor lui Ionuț (construiești, fără vârsta 13); încă: clasificare, șirul lui Andrei (cu 0) | Î3 (care NU e un șir) |
| poziția (indicele), poziție ≠ valoare | P3 „Poziția unui element (indicele)” | Încearcă: atingi poziția 4 (valoarea 4 e pe poziția 5); încă: valoarea de pe poziția 2 / poziția notei 10; g₃ | Î1 (fără numerele de poziție) |
| lungimea; poziția inexistentă | P4 „Lungimea șirului” | Încearcă: scrii pozițiile 1-8 + lungimea; încă: pozițiile în foaia Excel din pagină; lungimea + „există poziția 6?” | Î2 (lungimea + ultimul element, fără numerele de poziție) |
| șirul într-o situație reală | P5 „Găsești șirul într-o poveste” | Încearcă: golurile (fără 11 jucători, 5 meciuri, 3 martie, cu meciul 0); încă: temperaturile bunicului, metrii lui Matei; atelierul (pușculița lui Tudor) | Î5 (roboții Ilincăi) |
| felurile de întrebări | P6 „Ce întrebări pui despre un șir” | Încearcă: clasificare (cu capcana „Câți kilometri… în toată săptămâna”); încă: Ana / potrivire | Î4 |
| șirul în Excel (rând de valori, pozițiile deasupra) | P4, „Uite cum” (captura din Excel-ul real) | P4 încă 1 (foaia Excel din pagină); laboratorul | — (laboratorul, cu „Verifică-te”) |

## 2. Granița (fișierul `m4_26_10\granite\viii_l23.md`)

**Predau:** șirul de valori; elementul; poziția (indicele), de la 1; lungimea; poziția inexistentă; șiruri din viața reală găsite într-o poveste; cele patru feluri de întrebări („Câte…?”, „Cât fac împreună…?”, „Cel mai mare / cel mai mic…?”, „Toate…? / Măcar unul…?”) — doar recunoscute; șirul în Excel ca rând de celule, cu pozițiile deasupra.

**NU predau (verificat mecanic: în `index.html` nu apar „citire”, „afișare”, „parcurg”, „numărare”, „sumă”, „produs”, „minim”, „maxim”, „proprietate”, „variabil”, „tablou”, „vector”, „ciclu”, „contor”, „C++”, „Python”, „CodeBlocks”, `[i]`, `v[`):** citirea, afișarea, parcurgerea (24); numărarea (25); suma / produsul (26); minimul / maximul (27); verificarea unei proprietăți (28); implementarea (29). Un singur cuvânt-anunț: „Cum afli răspunsul înveți în lecțiile următoare.” (P6; până la reparația r1: „Cum afli răspunsul, pas cu pas, înveți…”) și „Programele care lucrează cu șiruri vin în lecțiile următoare.” (intro).

**Vecinul de clasă din val:** VIII/22 (evaluarea paginilor web) — altă unitate, fără material comun, alt nume de extensie.

## 3. Ce presupune lecția (din lecțiile publicate) — bife

| Presupus | Unde e predat | Acoperit |
|---|---|---|
| „un șir de valori e o listă de valori de același fel” | VIII/1, pasul „Anul acesta: calcul tabelar, pagini web, șiruri de valori” | ✔ reluat și precizat în P2 („în ordine”) |
| rând, coloană, celulă, adresa, caseta de nume, Tab / Enter (înapoi în coloana de pornire) | VIII/2 | ✔ |
| Blank workbook, Ctrl+N, F12, Confirm Save As → No, Ctrl+S, Ctrl+W, ✕ | VIII/3 (și 10-13, aceeași formulare a laboratorului) | ✔ formularea laboratoarelor VIII/12-13, prescurtată |
| numărul la dreapta, textul la stânga; 7.5 → dată | VIII/5 | ✔ |
| algoritmii V-VII | nepublicați pentru a VIII-a | ✘ nu-i folosesc (nicio structură, nicio notație de pseudocod) |

Ce presupun lecțiile următoare despre mine: nicio lecție următoare (24+) nu e scrisă. Vezi §8, „Pentru lecția următoare”.

## 4. Notația și deciziile (luate de autor; profesorul le poate schimba)

1. **Pozițiile se numără de la 1.** Temei: activitatea profesorului (element și poziție, „pe tablă cu indici”), viața de zi cu zi (prima zi, a treia notă), lecția nu are limbaj. Analogia profesorului spune că „în program începe de la 0” — asta ține de limbaj (C++ și Python numără de la 0); decizia limbajului e a profesorului (ghidul, X.2 nr. 10; `_m4.md` §1). Lecția 24 sau 29 va trebui s-o spună: „în program, pozițiile încep de la 0”. Nu am pus în pagină nicio frază despre 0 (ar fi vocabularul unei lecții următoare).
2. **Notația cu indice jos** (t₄ = „t indice 4”, g₃). Temei: „le scriu pe tablă cu indici” (activitatea profesorului); e notația din matematică. NU am putut verifica forma din manualul clasei a VIII-a (lipsește de pe disc). Notația e predată în P3 înainte de folosire (T70), iar instrucțiunile rămân în cuvinte („elementul de pe poziția 4”); o singură întrebare o folosește („Cât este g₃?”, P3, „Încă un exercițiu”).
3. **„Cele patru feluri de întrebări”** — numele sunt ale lecției, alese ca să nu folosească vocabularul lecțiilor 25-28 („numărare”, „sumă”, „maxim/minim”, „proprietate”). Capcana predată explicit: „Câte goluri… în total?” începe cu „Câte”, dar e „Cât fac împreună…?”.
4. **Datele** (toate inventate): șirul-exemplu al pașilor = temperaturile de dimineață 3, −1, 0, 5, 2, −2, 4 (luni → duminică), ales ca nicio valoare să nu fie egală cu poziția ei (altfel exemplul „poziție ≠ valoare” s-ar încurca); valoarea 4 stă pe poziția 7, iar pe poziția 4 e 5. Același șir e în captura din Excel și în laborator.
5. **Laboratorul în Excel** (gesturi deja predate: registru nou, salvare cu F12 la început, cu numele și clasa — `Popescu_Ana_8A_lectia23`, „în locul lui 8A scrii clasa ta” —, Confirm Save As → No + o cifră, scris cu Tab / Enter, Ctrl+S, Ctrl+W, ✕). Salvarea e la început (ca la VIII/12), ca la „Când mai sunt 10 minute” să ajungă Ctrl+S. Fără telefon / fără Excel: caietul + atelierul.
6. **Gestul real mic din pas (regula 10, S80):** după P4 „Încearcă”, caseta „Acum, dacă ești la calculatorul din laborator: deschide Excel și alege Blank workbook…”; laboratorul spune „Dacă ai deschis deja Excel la pasul Lungimea șirului (pasul 4 din 6), începi cu pasul 2”.

**Variante respinse:** materialul jocului `siruri-viii` (C++: `int v[100]`, `v[i]`, indici de la 0, capturi de consolă) — limbaj de programare, interzis aici; doar ideea clasificării „șir / o singură valoare” a rămas, rescrisă. Fotografie cu tabelă de scor / prognoză: n-am găsit pe Commons ceva potrivit, fără persoane și mărci (2 căutări); vestiarul se potrivește cu analogia profesorului. „Generarea după regulă” (programa): respinsă azi (§1). Foaia Excel cu butoanele de taste ale lecției VIII/2 (`excelx-interfata.js`): nu am încărcat-o, ca să nu aduc interfața altei lecții; pe telefon, foaia de bază (`excelx.js`) se scrie din bara de formule + Enter-ul tastaturii, iar exercițiul o spune.

## 5. Faptele despre Excel (afirmatii.json: 21 de afirmații, toate probate sau confirmate de lecții publicate)

Probat de mine, în Excel-ul REAL (Microsoft 365 16.0 build 20326, EN, setări RO: „,” zecimal, „;” între argumente), pe desktopul ascuns, cu `_proba\proba_excel.py` (26.10.2026, 08:50; ieșire `_proba\proba_excel.json`):
- Excel pornit ca proces NOU (`/x`), FĂRĂ fișier în linia de comandă; „Blank workbook” apăsat prin UI Automation (proces separat, fără mouse) → registru nou, o foaie, A1 activă.
- tastele ca taste (WM_CHAR / WM_KEYDOWN): A1 „Poziția”, Tab, 1 … Tab, 7, Enter → B1:H1 = 1…7 (numere), celula activă A2; „Grade”, Tab, 3, −1, 0, 5, 2, −2, 4, Enter → numere (−1 și −2 negative), activă A3.
- nimic salvat (Saved=True + Close(False)), Quit pe instanța mea, apoi `taskkill /PID` pe PID-ul meu (procesul mai trăia după 4 s); `tasklist` după: niciun EXCEL.EXE; MRU-urile Excel (File / Place MRU) neschimbate (aceleași numere de valori înainte și după); `%APPDATA%\Microsoft\Excel\`: niciun fișier de recuperare (doar `Excel15.xlb`, rescris de Excel la închidere, obișnuit).
- captura (PrintWindow) decupată fără bara de titlu (acolo erau inițialele contului) și fără panglică → `img\excel-sir.webp`; capturile brute au fost șterse.

Confirmate de lecțiile publicate (nu le-am reprobat): Ctrl+N, F12 / Fn+F12, Confirm Save As → No (VIII/3, 10-13), numele pe bara de titlu, Ctrl+S fără fereastră, Ctrl+W + „Save your changes to this file?”, ✕ (VIII/3), numărul la dreapta / 7.5 → dată (VIII/5).

## 6. Simulatorul nou: `lectii\_sim\sir-valori.js` (proprietar VIII/23)

Simulează tabla clasei din activitatea profesorului: șirul ca rând de căsuțe, pozițiile deasupra, etichete (zilele) dedesubt, indicii la cerere. Moduri: `atinge`, `pozitii`, `raspuns`, `construieste`, `marcheaza` (detaliile, testele, API-ul: capul fișierului). Teste numite (rezultat, nu drum), bifate la „Verifică”, apoi urmărite pe loc; „Ia-o de la capăt”; Enter într-o casetă NU verifică; focusul revine la locul de reparat; ținte (măsurate la 390 px, reparația r1, punctul L — „≥ 44 px” scris aici înainte nu era adevărat pentru toate): căsuțele 46×46, butoanele și casetele de răspuns ≥ 44 px înălțime, casetele de poziție 46×36, numerele din poveste ≥ 44×40, toate peste 32 px; nimic salvat, nimic trimis; răspunsul bun NU e scris în configurație (`cere` → calculat din șir). Mesajele de dinaintea pasului care predă poziția nu folosesc cuvântul „poziție” (`pozitiiVizibile:false` → „căsuța a 3-a de la stânga”). Stilul se pune la încărcare (`#sim-sir-valori-css`), ca rândurile statice din „Uite cum” (`SirValori.html`) să arate la fel.

**Foaia Excel din pagină:** `lectii\_sim\excelx.js` (proprietar VIII/5), încărcat întreg, NEMODIFICAT (P4, „Încă un exercițiu”).

## 7. Probe și porți (toate rulate ULTIMELE, după ultima schimbare — vezi §10)

| Probă | Ce face | Rezultat |
|---|---|---|
| `jocuri\_motor\test_joc.py --dir lectii\viii m4-l23` | poarta motorului (Pixel 7 + iPhone SE) | TRECUT (27 de întrebări jucate; avertisment obișnuit „niciun nivel nu începe cu choice/tf”: simulatorul are `gresit()`, deci răspunsul greșit e testat de poartă pe tipul `sir`) |
| `verifica_lectie.py index.html --fara-t1` | S0, S1, S2, T0 | 0 (S1: 0 identice; S2: 6/6 aplicare/execuție; T0: 0) |
| `_proba\proba_gesturi_l23.py` | toată lecția cu gesturi reale, 390 px cu atingere + 1280 px: fiecare „Încearcă” și „Încă un exercițiu” întâi greșit (mesajul greșelii verificat), apoi corect; atelierele; laboratorul; 5 întrebări; diploma; lățime, ținte ≥ 32 px | 145 de verificări, 0 picate, 0 erori în consolă, 0 cereri spre panou / server |
| `_proba\oracol_lectie.py` | ORACOL INDEPENDENT: reguli scrise din nou; șirurile citite din căsuțele desenate și din povești; refac fiecare afirmație numerică din text și laborator, apoi rezolv fiecare exercițiu din TEXTUL AFIȘAT și verific respingerea greșelilor tipice (poziția în loc de valoare, de la 0, fără 0, ordinea inversă) | 0 nepotriviri |
| `_proba\proba_forme.py` | răspunsurile scrise (T3): 7 întrebări × ≥ 20 forme bune + ≥ 20 greșite (fără diacritice, cu unitate, cuvinte 0-20 și zecile cu „și” — „patruzeci și cinci” —, ordinale, propoziție întreagă: „pe pozitia 2 este 7”, „g3 = 4”, „4,6” = pozițiile 4 și 6) | 286 de forme, 0 abateri |
| `_proba\proba_mutanti.py` | proba probei: control (simulatorul neschimbat: oracol 0, forme 0) + 8 mutanți ai simulatorului (valoarea de pe poziția k+1, lungimea −1, ordinea ignorată, atingerea de la 0, pozițiile de la 0 primite, 0 sărit primit la „marcheaza”, poziții parțiale primite, cuvintele-numere ignorate), serviți din copii prin `ctx.route` | 8/8 PRINȘI (M1 și M5 opresc oracolul cu eroare, ceilalți dau 2-25 de nepotriviri); 0 scăpați |
| `_proba\proba_excel.py` | Excel real (§5) | 0 erori; 0 procese rămase; MRU neschimbat |
| `curata_metadate.py` (fără `--curata`) | metadatele fișierelor lecției (doar imagini webp, fără fișiere Office de descărcat) | vezi §10 |

Regulile verificate pe lecție: 1 (T0 + verificarea „poziție” înainte de P3), 3, 5 (S2), 7 (afirmatii.json), 11 (date fără punct; 7.5 spus), 13 (nu cer Ctrl+Z), 14 (focus după Verifică), 15 („Pe telefon”), 20 (ținte), 23 (nimic păstrat de simulator), 24 (rețea oprită, `ctx.close()`, panoul: „nu e în catalog” = 0 înainte și după), 25 (Excel: PID-ul meu, desktop ascuns, nimic salvat, MRU neschimbat), 26 (Confirm Save As → No), 27 (nume inventate; nicio cale cu contul în pagină).

## 8. Pentru lecția următoare (VIII/24 „Operații cu șiruri: citire, afișare, parcurgere”)

- Elevul știe: șir, element, poziție = indice (de la 1, la tablă cu indice jos: t₄), lungime, poziția inexistentă, cele patru feluri de întrebări (doar recunoscute). NU știe: citirea, afișarea, parcurgerea, niciun limbaj, numerotarea de la 0. Dacă limbajul ales numără de la 0, lecția 24 (sau 29) trebuie s-o predea explicit, legat de „poziția 1 = primul element” de aici.
- Pe calculatorul elevului rămâne `Documente\Nume_Prenume_<clasa>_lectia23.xlsx` (rândul 1 = pozițiile 1-7, rândul 2 = temperaturile 3, −1, 0, 5, 2, −2, 4; A4 Lungimea, B4 7) — un șir gata scris, de refolosit.
- Simulatorul `sir-valori.js` se poate folosi ca atare (moduri, `SirValori.html` pentru „Uite cum”) sau extinde într-un fișier NOU (de exemplu o parcurgere pas cu pas care aprinde căsuțele una câte una). API-ul public și ce nu se schimbă: capul fișierului. Numele testelor și forma lui Q sunt stabile.
- **După judecata 1 (26.10.2026, 12:10; granița `m4_26_10\granite\viii_l23.md`, la zi):** API-ul a rămas același (nume, Q, teste, clase). S-au schimbat: (1) răspunsurile scrise primesc mai multe forme — la `cere.tip 'valoare'` poziția întrebată scrisă cu cuvânt de poziție sau ca ordinal („a doua notă e 7”, „în ziua 9: 45”, „g_3 = 4”), la `'pozitii'` valoarea ca subiect („5 stă pe pozițiile 4 și 6”) și „de două ori”; (2) `SirValori.numere()` citește și „nimic” / „niciunul” / „niciuna” / „deloc” = 0 (dacă lecția 24 are o casetă unde „nimic” NU trebuie să fie 0, scrie o extensie, nu schimba `numere`); (3) mesajele „ultimul element” și „numără căsuțele” vorbesc de poziție / ordine, nu de „capătul din dreapta” — la 390 px șirurile de peste 6 căsuțe trec pe mai multe rânduri; (4) numele testului `pas` nu mai spune lungimea. Pe telefon, foaia `excelx.js` de bază nu are butoane Tab / Enter: drumul e „atingi celula, bara de formule, Enter (↵) de pe tastatura telefonului”.
- **După judecata 2 (26.10.2026, 14:12, trecerea t2, punctul R; granița, la zi):** la `'pozitii'` se lasă deoparte și valoarea căutată scrisă DUPĂ verb, când pozițiile sunt scrise înaintea lui („pe poziția 3 e 10”, „pe 4 și 6 stă 5”, „pe 4 e 5, pe 6 e 5”); fără o poziție înaintea verbului („poziția e 3”, „răspunsul este 3”) numărul de după verb rămâne răspunsul — important dacă lecția 24 are o valoare egală cu una dintre pozițiile ei. API-ul (nume, Q, teste, clase, mesaje): neschimbat.
- **Ce NU presupune lecția 24 de aici:** generarea unui șir după o regulă și alegerea elementelor după o proprietate (lăsate deoparte, §9.4); definiția spune „de obicei, mai multe” valori, deci un șir cu un element nu contrazice lecția 23.

## 9. Pentru profesor

1. **De la 0 sau de la 1?** Lecția numără pozițiile de la 1 (ca pe tablă și ca în viața de zi cu zi). Analogia dumneavoastră (vestiarul) spune că „în program începe de la 0”. E bine să se predea asta la lecția 24 sau 29, după ce alegeți limbajul? (Dacă preferați de la 0 chiar de acum, se schimbă pozițiile din pași și din exerciții — simulatorul are o singură regulă de schimbat.)
2. **Notația cu indice (t₄).** Am folosit-o ca la matematică; manualul clasei nu e pe disc, deci nu știu dacă manualul scrie altfel (de exemplu x[4] sau t(4)). O schimbați ușor.
3. **Laboratorul** salvează în Documente cu numele `Nume_Prenume_<clasa>_lectia23`; pagina adaugă: „Dacă profesorul vă spune alt loc sau alt nume, faci cum spune el.” Vreți alt loc implicit (un folder al clasei)?
4. **Activitățile din programă lăsate deoparte:** „identificarea unor șiruri pe baza unei proprietăți” și „generarea unui șir după o regulă” (§1). Le doriți la ora 23 (câte un „Încă un exercițiu”) sau la 25 / 28?

## 10. Starea porților la predare (26.10.2026, după ultima schimbare a paginii și a simulatorului)

- `test_joc.py` → **TRECUT** (27 de întrebări jucate, diacritice 80/1000) — `_proba\test_joc.txt`
- `verifica_lectie.py --fara-t1` → **0** (S0, S1, S2 6/6, T0 0) — `_proba\verifica_lectie.txt`
- Playwright cu gesturi reale, 390 px cu atingere + 1280 px → **0 picate din 145, 0 erori în consolă**, 0 cereri spre panou; capturile de telefon privite (`_proba\_tel_*.png`): la 390 px rândurile de 6-8 căsuțe trec pe al doilea rând, cu pozițiile deasupra fiecărei căsuțe (vezi „Atenție pentru judecător”)
- oracolul independent → **0 nepotriviri** (66 de verificări); formele scrise → **0 abateri** (286); mutanții → **0 scăpați** (8/8)
- `curata_metadate.py` → **0** (lecția nu are fișiere Office de descărcat; imaginile webp sunt fără EXIF); `learninghub_date_personale.py` → **0**
- panoul: „nu e în catalog” = **0** înainte și **0** după probe (ieșirea nu s-a salvat); `tasklist`: niciun EXCEL.EXE; `git status` pe `jocuri\_motor\`: neatins; în `lectii\_sim\` al meu e doar `sir-valori.js` (celelalte fișiere noi sunt ale vecinilor din val)
- durata drumului obligatoriu ≈ **43 de minute** (`_proba\durata.py`: 2.396 de cuvinte la 110/min = 21,8 min + gesturi 20,9 min, din care laboratorul 8,5) — estimare, de cronometrat la clasă

## 11. Atenție pentru judecător

1. **Rândul de căsuțe la 390 px trece pe două rânduri** când șirul are peste 5 elemente (de exemplu 5 + 1, 5 + 2). Pozițiile stau deasupra fiecărei căsuțe, deci ordinea se citește; am ales să nu micșorez căsuțele sub 44 px (atingerea). De judecat dacă încurcă un copil.
2. **Numerotarea de la 1** (nu 0) și **notația t₄** — decizii ale autorului, „Pentru profesor” 1-2.
3. **Foaia Excel din pagină (P4, „Încă un exercițiu”)** folosește `excelx.js` de bază: pe telefon se scrie din bara de formule și se confirmă cu Enter-ul tastaturii; Tab nu există pe telefon, iar textul exercițiului o spune.
4. **Laboratorul** reia cuvintele laboratoarelor VIII/12-13 (F12, Confirm Save As → No + o cifră), prescurtate; „✕ închide Excel” e confirmat de VIII/3, nu reprobat (clicurile nu ajung pe desktopul ascuns).
5. Răspunsurile scrise primesc propoziția întreagă: numerele care doar repetă întrebarea („poziția 2”, „g3 =”, „valoarea 5”) sunt lăsate deoparte; „4,6” la poziții = 4 și 6. Numerele în cuvinte: 0-20, zecile și zecile „și” unitățile („patruzeci și cinci”); sutele în cuvinte nu (nicio întrebare nu le cere).

## 12. Pentru componenta comună

- `excelx.js` (VIII/5), folosit neschimbat: pe telefon nu are butoane pentru Tab / Enter sub foaie (le are doar extensia `excelx-interfata.js` a lecției VIII/2); exercițiul de aici o ocolește spunând drumul de telefon (bara de formule + Enter-ul tastaturii). Nu e un defect, doar de știut pentru lecțiile care cer Tab pe telefon.
- **`excelx.js` (VIII/5), derularea laterală pe telefon (26.10.2026, trecerea t2, punctul Q al judecății 2; ghidul III.3 F3):** (1) nota de telefon a foii (`TEL`, rândul 610: „Pagina o derulezi trăgând de numerele rândurilor sau de textul de deasupra foii…”) nu spune derularea în lateral, din literele coloanelor; în `tip-excel.js` propoziția există („foaia o derulezi în lateral trăgând de literele coloanelor”); (2) foaia n-are un semn vizibil că mai are coloane la dreapta (F3: „Ce nu încape pe lățime se derulează în caseta lui, cu semn vizibil”). Măsurat aici (`_proba\t2_glisare.py`, atingeri reale prin CDP): la 360 / 390 / 412 px, o foaie de 7 coloane arată doar A-D (D tăiată la 360); tragerea pe celule selectează (`td{touch-action:none}`), tragerea pe literele coloanelor derulează (`thead th{touch-action:pan-x}`). Efectul se vede în toate lecțiile VIII care cer, pe telefon, coloane aflate în afara ecranului. Lecția de aici o ocolește cu o propoziție în textul de telefon al exercițiului; dacă proprietarul repară componenta, propoziția poate deveni inutilă (de scos atunci, cu proba că a dispărut — ghidul III.3 F4).
- Nimic altceva găsit. `jocuri\_motor\`, `prezenta.js`, `rezultat-elev.js` și simulatoarele altora: neatinse.

## 13. Reparațiile după judecata 1 (26.10.2026)

Autor PROASPĂT, după judecata în pereche (opus: 0 GRAV / 4 MAJOR / 8 MINOR; sonnet: 0 / 0 / 5 MINOR). Registrul complet, cu citatele și stările: `_verificare\registru_j1.md` — **16 puncte (A-P), 16 reparate, 0 respinse**. Copia dinainte: `_proba\inainte_r1\`. Secțiunile de mai sus (1-12) rămân starea autorului, cu excepția trimiterilor actualizate (§2 fraza-anunț din P6, §6 țintele, §8 „Pentru lecția următoare”).

| Punct | Ce am schimbat (cuvintele noi) | Unde | Cum am verificat |
|---|---|---|---|
| A (MAJOR) | „(Pe telefon: atingi B1, apoi bara de formule, scrii 1 și apeși Enter (↵) pe tastatura telefonului; apoi atingi C1 și tot așa, până la F1. Tab nu există pe telefon.)” | pasul „Lungimea șirului”, „Încă un exercițiu” 1 | probă pe pagină: drumul literal la 390 cu atingere → Corect; 0 butoane Tab / Enter sub foaie; 1280 cu Tab / Enter → Corect (`proba_reparatii.py` [A]) |
| B (MAJOR) | Î2, indiciul: „Numără toate căsuțele, și pe cea cu 0, în ordine: de la stânga la dreapta, iar dacă șirul trece pe rândul de dedesubt, continui acolo. Ultimul element e cel de după toate celelalte, pe poziția cea mai mare.”; simulatorul: mesajele „ultimul” și „numără” la fel | Î2; `sir-valori.js` | probă pe pagină la AMBELE lățimi: 45 = ultima căsuță din ultimul rând (390: 2 rânduri, 1280: 1); 25 → „Nu încă”, mesaj fără „capăt”; „45 (a noua)” → Corect (`proba_reparatii.py` [B]); `r1_forme.py` (mesajele); mutanții M13, M18 |
| C (MAJOR) | P6, textul: felurile se deosebesc „după ce cere răspunsul (nu după primul cuvânt)”: „cere câte elemente se potrivesc” / „cere valorile elementelor, puse la un loc” / „cere cea mai mare sau cea mai mică valoare” / „cere un da sau un nu”; Î4: „În câte zile din luna asta și-a uitat Radu tema?” | P6 (text), Î4 | citire: toți itemii „Câte / Câți” din lecție trecuți prin regulă (tabelul din registru); probă pe pagină: P6 și Î4 → Corect la 390 și 1280 ([C]) |
| D (MAJOR) | `'pozitii'`: valoarea ca subiect și „de două ori” nu sunt poziții; mesajul la o poziție în plus o numește („Ai scris și 5, adică valoarea din întrebare…”, „Ai scris și poziția 7, dar în căsuța de pe poziția 7 nu stă valoarea 5.”); „mai apare o dată” doar când lipsește o singură poziție | `sir-valori.js` | `r1_forme.py` (cele 5 forme ale judecătorului opus + „5 e pe 4 și 6”, „10 e pe 3” ale lui sonnet primite; mesajele cu bucata așteptată); tastate în atelier la 390 și 1280 ([D]); mutanții M9, M12, M17 |
| E | `'valoare'`: poziția întrebată ca ordinal / cu cuvânt de poziție / cu litera șirului se lasă deoparte („a doua notă e 7”, „în ziua 9: 45”, „45 (a noua)”, „g_3 = 4”); altă poziție → „Ai scris poziția 3, dar întrebarea e despre poziția 2…”; „nimic” / „deloc” = 0 | `sir-valori.js` | `r1_forme.py`; tastate în P2 și atelier ([E]); mutanții M10, M11, M14, M16 |
| F | „Clic pe A4 și scrie Lungimea, apasă Tab, scrie 7 și apasă Enter. Vezi: Lungimea în A4 și 7 în B4.” | laboratorul, pasul 6 | Excel REAL pe desktopul ascuns (`r1_excel.py` → `r1_excel.json`; A4 aleasă cu `Range.Select`, clicul-mesaj nu ajunge pe celulă acolo) |
| G | „Numele din Excel sunt scrise în ambele limbi, româna întâi, engleza în paranteză: caută-l pe cel pe care îl vezi pe ecran.”; „Registru de lucru necompletat (Blank workbook)”, „Nume fișier (File name)”, „Salvare (Save)”, „Nu (No) (sau Anulare)”; ferestrele fără nume RO probat, descrise în română cu textul englez citat | laboratorul; caseta „Acum…” de la pasul 4; „Ai nevoie de” | citire + probă pe pagină ([G]); „Nume fișier” = ghidul VIII.D (confirmat), „Registru de lucru necompletat” = ghidul VIII.E8 (nesigur, dat cu engleza) |
| H | „valoare extremă” → „cea mai mare sau cea mai mică valoare” (3 locuri) | P6 „Încă” 2, Î4 | probă: „extrem” nu apare în configurația afișată ([H]) |
| I | definiția: „de obicei, mai multe”; „Vârsta ta e o valoare singură, nu o listă de valori luate una după alta.”; explicația clasificării la fel | P2 | probă pe pagină ([I]); decizia de fond (șirul cu un element) — dirijorul |
| J | „a jucat 5 meciuri, primul pe 3 martie” | P5 „Încearcă” | probă pe pagină: Corect ([J]) |
| K | granița la zi, cu ora; varianta de la 08:25 păstrată ca istoric | `m4_26_10\granite\viii_l23.md` | citire ([K]) |
| L | capul simulatorului: mărimile măsurate (46×46, ≥ 44, 46×36, ≥ 44×40) | `sir-valori.js`, §6 | măsurate la 390 ([L]) |
| M | Î2: „Minutele de mers pe jos ale lui Andrei, zi de zi” | Î2 | probă pe pagină ([M]) |
| N | testul `pas`: „Pozițiile cresc din 1 în 1, până la ultimul element” (fără „(8)”) | `sir-valori.js` | probă pe pagină ([N]); `r1_forme.py`; mutantul M15 |
| O | banda de sus: „un șir · 3 · −1 · 0 · 5 · 2 · −2 · 4”, fără indici | `banda` | probă pe pagină ([O]) |
| P | diploma: „…și a scris un șir cu pozițiile lui deasupra, în Excel sau în caiet” | `diploma.rezumat` | probă pe pagină ([P]) |

**API-ul simulatorului (pentru lecția 24):** neschimbat ca formă (nume, Q, teste, clase); schimbările de comportament — §8 și capul fișierului, cu data; granița, la zi.

### Porțile, după reparații (26.10.2026, ~12:50, rulate ULTIMELE)
- `proba_reparatii.py` → **0** (70 de verificări, A-P; `proba_reparatii_2.txt`); pe copia dinainte (`--inainte`) → 44 picate (proba prinde).
- `test_joc.py` → **TRECUT** (27 de întrebări) · `verifica_lectie.py --fara-t1` → **0** · `curata_metadate.py` → **0** · `learninghub_date_personale.py` → **0** · panoul „nu e în catalog” 0 → 0.
- `proba_gesturi_l23.py` 145 / 0, 0 erori în consolă · `oracol_lectie.py` 66 / 0 · `proba_forme.py` 286 / 0 · `r1_forme.py` 334 de forme (ambii judecători + noi) / 0 · mutanți 18 / 18 prinși.
- Excel real (`r1_excel.py`): pasul 6 confirmat; nimic salvat, MRU neschimbat, niciun Excel rămas.
- Durata: 43,6 min (metoda autorului) / 38,6 min (metoda judecătorului) — sub 50.
- Regulile verificate în reparație: 1 (banda fără indici, „valoare extremă” scos), 3 (pasul 6, drumul de telefon), 6 (perechile RO + EN), 8 (granița, capul simulatorului fără date vechi), 15 / 31 (telefonul: Enter-ul tastaturii, șirul pe mai multe rânduri), 16 (definiția fără excepție nespusă), 23 (toate formele corecte), 24 (rețea oprită, `ctx.close()`), 25 (Excel: PID-ul meu, desktopul ascuns), 28 (mesajele adevărate), 33 (granița), 36 („Nu (sau Anulare)”).

## 14. Trecerea t2 după judecata 2 (26.10.2026, 13:32 → 14:50)

Judecata 2 (opus, `_verificare\judecator2.md`): registrul A-P 16/16 închis; două puncte noi, Q (MAJOR) și R (MINOR). Autor proaspăt, trecere scurtă: doar Q și R (registrul `_verificare\registru_j1.md`, secțiunea „Trecerea t2”, cu citatele, reparațiile și probele). Copia dinainte: `_proba\inainte_t2\`.

| Punct | Ce am schimbat | Unde | Cum am verificat |
|---|---|---|---|
| Q (MAJOR) | în textul de telefon: „E1 și F1 sunt mai la dreapta: ca să le vezi, tragi cu degetul spre stânga pe literele coloanelor (A, B, C…), nu pe celule. Pe celule, tragerea selectează.” | pasul „Lungimea șirului”, „Încă un exercițiu” 1; `afirmatii.json` e14; §12 (pentru `excelx.js`) | `_proba\t2_glisare.py`: atingeri și trageri reale (CDP, fără derularea automată) la 360, 390, 412 px și 1280 → 33 / 0; pe copia dinainte 2 picate; `proba_reparatii.py` [Q] |
| R (MINOR) | `sir-valori.js`, `scoateValoarea`: valoarea scrisă după verb, după pozițiile deja scrise, nu e poziție („pe poziția 3 e 10”, „pe 4 și 6 stă 5”, „pe 2, 3 și 6 e 0”); fără poziție înaintea verbului („poziția e 3”) numărul rămâne; `afirmatii.json` n2 adus la adevăr | simulatorul (capul fișierului, „SCHIMBĂRI”); §8 și granița (pentru lecția 24) | `r1_forme.py`: 440 de forme (opus 150 + judecătorul 2 66 + sonnet 113 + reparatorii 111) → 0 abateri; pe simulatorul dinainte 31; `proba_reparatii.py` [R] (tastate la 390 și 1280); mutanții M19, M20 |

**Durata:** neschimbată (propoziția nouă stă într-un exercițiu opțional): 38,6 min cu metoda judecătorului, 43,6 cu a autorului.

**Porțile după t2 (14:46, rulate ULTIMELE):** `proba_reparatii.py` 86 / 0 (A-R; pe copia dinainte: 12 picate, numai Q și R) · `t2_glisare.py` 33 / 0 · `r1_forme.py` 440 de forme, 0 · mutanți 20 / 20 prinși, control 0 · `proba_gesturi_l23.py` 145 / 0, 0 erori în consolă · `test_joc.py` TRECUT · `verifica_lectie.py --fara-t1` 0 · `curata_metadate.py` 0 · `learninghub_date_personale.py` 0 · panoul „nu e în catalog” 0 → 0 · `git diff --stat lectii/_sim/ jocuri/_motor/` gol. R schimbă logica simulatorului: înainte de publicare, o judecată scurtă pe diferențe (ghidul VI.3).
