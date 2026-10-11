# Reglajul nr. 3 al căutării „Cum fac…?” (11.10.2026, după cele 48 de fișe noi)

Reglorul nr. 3. N-am citit nimic din `_ascuns/`. N-am atins fișele (`fise_*.json`), glosarul, formulările în plus,
`index.html`. N-am făcut commit. N-am citit nicio întrebare din jumătățile B.

Fișiere schimbate: `cum-fac/cautare.js` (versiunea 1.4), `cum-fac/_sursa/sensuri.json`, `cum-fac/date.js` (refăcut cu
`build.mjs`; build-ul a rescris și `amprente.json`, `catalog_titluri.json`). `build.mjs` nu l-am schimbat. Fișierele au
rămas cu LF, cum erau. Uneltele mele: `_unelte/m2/reglaj_3/` (instantaneele „înainte”, bancurile, seturile noi C și D).

## Cum am lucrat
- `set_dezvoltare_m2` și `set_dezvoltare_2` le-am împărțit fix: **A = indicii pari, B = indicii impari**. Am reglat pe A,
  pe `set_dezvoltare`, pe `set_inginer_real` / `set_inginer` / `set_reglor_lung` și pe validarea încrucișată pe formulările
  în plus (CV, 8.262 de fraze, ca la reglorul nr. 2).
- **Din B am văzut doar cifrele**, de 5 ori pe parcurs și o dată la final. Nicio alegere n-am făcut-o după B (la
  `pondere_tare` am păstrat varianta aleasă pe A + CV, deși pe B a scos o întrebare din primele 3).
- **Două seturi noi, independente**, scrise de agenți care au văzut DOAR catalogul titlurilor (`catalog_titluri.json`):
  - **C** = `set_reglor3.json` (100 pe fișele noi + 60 din afara materiei). Din ratările lui am scris categoriile de
    gesturi din afara materiei, deci cifra lui de „afară” (60/60) NU mai e o măsură cinstită.
  - **D** = `set_reglor3_d.json` (90 + 60). L-am folosit pentru alegerea pragurilor (nu le-am schimbat) și pentru câteva
    cuvinte de dicționar (mânuță, virgulițe, pază, bucăți mute, media library); cifrele lui sunt ușor optimiste.
- **Lista gesturilor din afara materiei** am cerut-o unui agent care a văzut doar catalogul: 172 de gesturi, 1.068 de
  forme, pe zone (`gesturi_neacoperite.json`). Am tăiat 18 forme care tăiau întrebări bune (vezi mai jos).
- Fiecare intrare din „neacoperite” am trecut-o prin `vetocost.mjs`: pe câte formulări în plus bune și pe câte întrebări
  bune din seturi ar tăia un „am găsit”. Am păstrat doar ce nu taie întrebări bune din seturi.

## Cifrele
Locul 1 / primele 3 / câte sunt; „afară” = câte întrebări din afara materiei primesc „n-am găsit”.
„Înainte” = motorul și dicționarul de la începutul reglajului (11:06). „Înainte, fișele de acum” = același motor vechi pe
fișele reparate între timp de alt agent (arată ce e al meu și ce e al reparației fișelor). „După” = `date.js` fad0f661c3b7.

| set | înainte | înainte, fișele de acum | **după** |
|---|---|---|---|
| **m2 A** (48 + 20) | 42 / 43 · afară 17/20 | 42 / 43 · 17/20 | **44 / 46 (95,8%) · afară 20/20** |
| **m2 B** (48 + 20, verificare) | 36 / 41 (85,4%) · afară 15/20 | 36 / 41 · 15/20 | **40 / 44 (91,7%) · afară 18/20** |
| m2 întreg | 78 / 84 / 96 · afară 32/40 | 78 / 84 · 32/40 | **84 / 90 (93,8%) · afară 38/40** |
| **set 2 A** (189 + 26) | 166 / 181 · afară 23/26 | 166 / 181 · 23/26 | 166 / 182 · afară 25/26 |
| **set 2 B** (188 + 26, verificare) | 164 / 174 · afară 20/26 | 163 / 173 · 20/26 | 165 / 175 (93,1%) · afară 20/26 |
| set 2 întreg | 330 / 355 / 377 (94,2%) · afară 43/52 | 329 / 354 · 43/52 | **331 / 357 (94,7%) · afară 45/52** |
| set 1 (194 + 25) | 184 / 192 (99,0%) · afară 24/25 | 183 / 192 · 24/25 | **185 / 193 (99,5%) · afară 25/25** |
| `set_inginer_real` | 75 / 81 / 81 · afară 19/20 | 76 / 81 · 19/20 | 77 / 81 · afară 19/20 |
| exemplele profesorului | 8/8 pe locul 1 | 8/8 | **8/8** |
| feedback profesor | 1/1 | 1/1 | **1/1** |
| C (independent; „afară” folosit la reglaj) | 77 / 87 / 100 · afară 42/60 | 77 / 87 · 42/60 | 84 / 93 · afară 60/60* |
| D (independent; vezi mai sus) | 47 / 55 / 90 · afară 48/60 | 47 / 55 · 48/60 | 60 / 69 · afară 54/60 |
| CV, formulările în plus (8.262) | găsit 90,1% · primele 3 76,6% | — | găsit 90,8% · primele 3 77,4% |
| CV, doar fișele noi (1.148) | găsit 86,1% · primele 3 73,3% | — | găsit 87,8% · primele 3 74,1% |

\* nu e măsură cinstită: categoriile au fost scrise după ratările lui C.

**Ținte:** m2 B din afara materiei ≥ 18/20 → **18/20, atinsă**. m2 B primele 3 ≥ 92% → **91,7% (44/48), NEATINSĂ la
o întrebare** (ar trebui 45/48). Set 2 din afara materiei ≥ 45/52 → **45/52, atinsă la limită**. Set 2 primele 3 ≥ 93,5% →
**94,7%**. Set 1 primele 3 ≥ 99% → **99,5%**. Exemplele 8/8 și feedbackul 1/1 pe locul 1. Timpul: maxim 9,5 ms pe
întrebare în node, 7,1 ms în pagină (prag 100 ms).

`proba_browser.py`: **ultima linie 0** (0 cereri externe, 0 erori JS). `build.mjs` și `build.mjs --verifica`: **0**.
Indexul se construiește în pagină în **384 ms** (reglorul nr. 2: 282 ms): lista „neacoperite” e de 4 ori mai mare.

## Ce am schimbat și de ce
### 1. „Neacoperite” pe categorii generale (`sensuri.json`: 66 → 253 de intrări globale + 46 la audio + 6 la web)
- **Categorii:** alte programe și servicii (Drive, Teams, Spotify, Gmail, Canva, Photoshop, magazinele de aplicații…),
  instalare / dezinstalare / actualizare, conturi (cont nou, login, deconectare), rețea (wifi, bluetooth, internetul nu
  merge, router), hardware (imprimantă, cameră, calculatorul blocat, stickul scos în siguranță, mouse / tastatură), plus
  gesturile din jurul subiectelor noi care nu sunt în fișe: Explorer (golesc coșul, fișiere ascunse, sortez fișierele,
  proprietăți, comprimare), browser (istoric, favorite, incognito, reclame, extensii, pagina de start), securitate
  (firewall, dezactivez antivirusul, scot virusul, control parental). Lista mare vine din `gesturi_neacoperite.json`.
- **Intrări despărțite.** O fișă care numește o formă ridică vetoul pentru toată intrarea. „virus / antivirus / update
  windows” erau lipite: fișele noi de antivirus ridicau și „update windows”. Le-am despărțit (virus, actualizare, wifi,
  bluetooth, imprimantă, parolă / protejez, instalez / dezinstalez).
- **Gesturile unei aplicații** (cod nou, `aplicatii.<app>.neacoperite`): țin doar când primul rezultat e al aplicației sau
  întrebarea o NUMEȘTE (un indiciu nu ajunge: „link … site” tăia altfel o fișă bună de browser). La **audio**: tăiat,
  efecte, export, muzică de fundal, text pe video, tranziții, montaj, volum („tai” e și gestul din Word, deci nu poate fi
  global). La **web**: imagini, legături, liste, tabele, culori, butoane (lecțiile de HTML nu le predau).
- **Windows acoperă sunetul și filmul** (`aplicatii.windows.acopera`): la Explorer „melodia descărcată” e context, nu
  gestul; vetoul „sunet” tăia 4 formulări bune.
- **Scoasă intrarea „redenumesc folderul”**: gestul e acum în materie (`windows-redenumire-f2`), iar intrarea făcea ca
  „cum redenumesc un folder” să primească „n-am găsit”. Costul: o întrebare din `set_dezvoltare_2` (indicele 420, cu
  eticheta „din afara materiei”, scrisă înainte de fișa nouă) — de aceea set 2 e la 45/52, nu la 46/52.
- **Forme tăiate după cost** (tăiau întrebări bune): „mute” (= „să se mute”), „table” (= „tabla”), „drive”, „driver”
  (aceeași rădăcină cu „flash drive”), „printez”, „backup”, „marcaj”, „semn de carte”, „extension”, „classroom”,
  „whatsapp”, „proiector”, „import audio”, „silence”, „blochez calculatorul” („ce a blocat calculatorul” e la antivirus),
  „taie” („programul cu care se taie muzica” e Audacity), „pun o melodie / adaug muzică” („cum pun o melodie în
  Audacity” = deschid un sunet), „fișierele după” („caut fișierul după nume”), „calculatorul merge greu”, „volum”.
- Efectul pe B (doar cifre): afară 15 → 18 din 20. Pe A și C cifra e optimistă (am văzut întrebările).

### 2. „Site” nu mai e numele aplicației web
„site”, „website”, „web”, „pagina de internet” erau NUMELE aplicației web: întrebările despre navigare („revin pe site-ul
de dinainte”) tăiau fișele browserului (care sunt la Windows) și cereau „n-am găsit”. Acum „site” e doar cuvânt de căutat,
iar „pagina web / pagini web / web / pagina de internet” sunt indicii (vot 1, nu „numit”). Rămân nume „html”, „htm”.

### 3. Forme ale cuvântului (normalizare și rădăcini)
- **Articolul cu cratimă** se lipește la loc: „site-ul” = „siteul” = site, „slide-urile” = slide (doar după un cuvânt de
  2+ litere: „s-ul” rămâne s). Propunerea reglorului nr. 2.
- **`articol_necunoscut`**: un cuvânt necunoscut care e cuvânt scurt + articol („josul”) se citește fără articol, înainte
  de corectarea greșelilor (altfel „josul” devenea „jocul”).
- **Pluralul în -ere / -are** era tăiat ca infinitivul lung: fișiere → „fisi”, foldere → „fold”, numere → „num”, litere →
  „lit”, iar fișierele → „fisier”. Rădăcini fixate (`radacini_fixe`) pentru fișier, folder, dosar, număr, literă, caracter,
  fereastră, culoare. Câștig pe set 2 A, set 1, `set_inginer_real` (+1 locul 1 fiecare), fără pierderi.
- „înaintea” (ordine) avea rădăcina lui „înainte” (butonul Înainte); „trecut / trecută” pe a tranziției („trecere”).
- Numele programului scris greșit („clipchap”) contează și la regula „alt program” (până acum doar aplicația).

### 4. Sensuri prea largi și sensuri noi
- **Panglica** (fila / meniu / ribbon) e acum legată doar de Excel, Word, PowerPoint: în browser „fila” e tabul.
- **Browser ≠ reîmprospătare**: grupul „browser” conținea refresh / F5 / reîncarc; acum e un grup separat.
- Grupuri noi: `unda` (valuri, zigzag, waveform), `anterior` (trecută, precedentă, dinainte), `ghilimele` (virgulițe),
  `securitate` (pază, scut, Defender), `moment_audio`, `liniste_audio`, `biblioteca_media`; la `legatura`: mânuță,
  cuvânt albastru. „zigzag” l-am luat dintr-o întrebare din m2 A, câteva din D (vezi „Cum am lucrat”).

### 5. Ordonarea
- **`margine_slab` 0,45**: la alegerea celor 40 de candidați, un cuvânt găsit doar în pași cântărea cât unul din titlu, iar
  fișa bună ieșea din listă („sterg tot din Downloads la sfârșit”). Acum câmpurile tari cântăresc întreg, restul × 0,45.
- **`pondere_tare` 0,15**: acoperirea pe câmpurile tari contează puțin și la ordonare (CV +0,3 puncte găsit, +0,2 primele 3).

### Ce am încercat și am lăsat
- Pragul „am găsit” 0,6 / 0,55: +3 bune pe D, dar −1…−4 „afară” pe fiecare set. Am verificat și distanța față de al doilea
  rezultat, sub prag: nu desparte bunele de cele din afara materiei. Pragul a rămas 0,65 / 0,35 la frazele lungi.
- `prag_lung` 0,4, `lung_potrivite` 4, `fx_dice` 0,7, `necunoscut` 0,5–0,7, o pondere mai mică pentru potrivirea pe sens
  la „am găsit”: fiecare pierde bune (pe seturi sau pe CV) mai mult decât câștigă.
- „Verbul de după «cum» trebuie potrivit”: taie 5 întrebări bune din seturi și nu prinde niciuna din cele rămase.
- Umplutură nouă („știu”, „alea”, „eram”, „zice”; „profu”; „colegul”): 12 mai bine / 20 mai rău, 0/0, 1/1 — lăsate.
- „merge” scos din grupul „îmbinare” (Excel): −1 afară pe m2 A.

## Ce rămâne și propuneri
- **m2 B primele 3: 44/48, cu o întrebare sub țintă.** Ratările de pe A, C, D sunt mai ales de ordonare între fișe-surori
  (filele browserului, cele 4 fișe de securitate, capul de redare / început-sfârșit / redare în Audacity): fișa bună are
  adesea acoperirea cea mai mare, dar pierde la scor din cauza pașilor sau a formulărilor care pomenesc contextul.
- **Eticheta greșită în `set_dezvoltare_2.json`, indicele 420**: „cum redenumesc un folder” e acum în materie
  (`windows-redenumire-f2`). Propun `accept: ["windows-redenumire-f2"]`; nu l-am corectat eu.
- **Lista „neacoperite” trebuie ținută la zi**: o fișă nouă pentru un gest din listă trebuie să-l numească în titlu,
  întrebare, formulări sau cuvinte, altfel vetoul o ascunde. Ex.: dacă apare o fișă despre istoricul browserului, ea
  trebuie să scrie „istoric”.
- Setul D arată că întrebările foarte scurte și foarte de acasă („google poze leu”, „mânuță cuvânt albastru”) rămân slabe
  (primele 3: 77%); setul ascuns are întrebări mai apropiate de m2.
- Indexul se construiește în 384 ms în pagină (era 282 ms). Dacă deranjează pe calculatoarele vechi: lista „neacoperite”
  se poate indexa o singură dată pe aplicație, nu pe fiecare fișă.

## Cum se reproduce
```
node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs
node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs C:/00/Projects/LearningHub/cum-fac/_teste/set_dezvoltare_m2.json --detalii
node C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/banc.mjs --sensuri date --B      # A/B, C, D
node C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/banc.mjs --cautare C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/cautare_inainte.js --sensuri C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/sensuri_inainte.json --B   # înainte, pe fișele de acum
node C:/00/Projects/LearningHub/_campaign/cum_fac_2026_10/_unelte/m2/reglaj_3/cv.mjs                          # CV
python C:/00/Projects/LearningHub/cum-fac/_teste/proba_browser.py
```
Dicționarul se reface din instantaneul de la început cu `aplica_sensuri.mjs --mod <lista din mod.mjs> --reglaj
'{"articol_necunoscut":true,"margine_slab":0.45,"pondere_tare":0.15}'` (lista exactă e în istoricul de mai sus: web_site,
web_pagina, veto_split, veto_cat, veto_win, veto_audio, win_acopera_sunet, inaintea_fix, unda_grup, panglica_office,
browser_split, trecut_fix, anterior_grup, veto_c, veto_web, veto_s2, veto_gen, plural_fix, site_neutru, dict_noi,
scoate_redenumesc_folder). Motorul nou cu `sensuri_inainte.json` (cheile noi oprite) diferă de motorul vechi doar prin
cele două mecanisme mereu pornite (articolul cu cratimă, numele de program scris greșit): +1 locul 1 pe set 1 („toate
slide-urile”), +1 pe C; restul cifrelor sunt identice (verificat cu `banc.mjs`).
