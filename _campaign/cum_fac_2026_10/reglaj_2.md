# Reglajul nr. 2 al căutării „Cum fac…?” (10–11.10.2026)

Reglorul nr. 2. N-am citit nimic din `_ascuns/`. N-am atins fișele (`fise_*.json`), glosarul (`termeni.json`),
formulările în plus (`formulari_extra_*.json`), lecțiile, motorul lecțiilor, `index.html`. N-am făcut commit.

Fișiere schimbate: `cum-fac/cautare.js` (versiunea 1.2), `cum-fac/_build/build.mjs`, `cum-fac/_sursa/sensuri.json`,
`cum-fac/date.js` (refăcut cu `build.mjs`; `amprente.json` și `catalog_titluri.json` rescrise de build, conținut neschimbat).
`set_dezvoltare_2_corecturi.json` NU l-am scris: n-am găsit niciun `accept` vădit greșit (vezi la final).

## Cum am lucrat
- `set_dezvoltare_2.json` împărțit fix: **A = indicii pari** (189 din materie + 26 din afara ei), **B = indicii impari**
  (188 + 26). Am reglat pe A + setul 1 + `set_inginer_real.json` + `set_reglor_lung.json`.
- Un al doilea banc, nou: **validare încrucișată pe formulările în plus** (CV). Formulările fiecărei fișe se împart în 5
  bucăți; pe rând, o bucată iese din index și devine întrebare (fișa ei = răspunsul bun). Sunt 7.114 întrebări de copil,
  scrise de agenți care n-au văzut niciun set de test. Pe ele am reglat pragul „am găsit” (A era deja „saturat”).
- **Cât am văzut din B, ca să fie cinstit:** cifrele lui B (locul 1, primele 3, din afara materiei) la ~25 de variante;
  o dată, doar numărat, felul ratărilor (13 din 19 erau „n-am găsit” cu fișa bună printre propuneri), ceea ce m-a trimis
  la pragul „am găsit”, pe care l-am reglat pe CV, nu pe B. La prima inspecție a fișierului am văzut textul primelor 6
  întrebări (3 din B). Ratările din B le-am citit DOAR la final, după ce am înghețat reglajul (lista de mai jos); n-am
  mai schimbat nimic după aceea. Deci B nu mai e chiar „nevăzut”: cifrele lui pot fi cu câteva puncte optimiste.

## Cifrele

Locul 1 / primele 3 / câte sunt; „afară” = câte întrebări din afara materiei primesc „n-am găsit”.

| | înainte | după |
|---|---|---|
| **Setul 1** (219) | 183 / 189 / 194 = 94,3% / 97,4% · afară 23/25 | **183 / 192 / 194 = 94,3% / 99,0% · afară 25/25** |
| **A** (setul 2, pari) | 143 / 159 / 189 = 75,7% / 84,1% · afară 20/26 | **167 / 181 / 189 = 88,4% / 95,8% · afară 24/26** |
| **B** (setul 2, impari, verificare) | 146 / 158 / 188 = 77,7% / 84,0% · afară 21/26 | **163 / 173 / 188 = 86,7% / 92,0% · afară 21/26 (80,8%)** |
| setul 2 întreg (`evalueaza.mjs`) | 289 / 317 / 377 = 76,7% / 84,1% · afară 41/52 | 330 / 354 / 377 = 87,5% / 93,9% · afară 45/52 |
| `set_inginer_real.json` | 77 / 81 / 81 · afară 19/20 | 76 / 81 / 81 · afară 19/20 |
| `set_reglor_lung.json` | 19 / 21 / 24 · afară 16/16 | 20 / 22 / 24 · afară 15/16 |
| exemplele profesorului / `set_r5.json` | 8/8 · 8/8 | **8/8 · 8/8** (ultima linie 0) |
| CV pe formulările în plus (7.114) | găsit 86,6% · primele 3 74,9%* · locul 1 59,8%* (cu formulările, dar pragul vechi) | găsit 90,6% · fișa ei în primele 3 77,5%* · pe locul 1 61,6%* |

\* la CV se acceptă doar fișa din care vine formularea, deci fișele-surori trag cifra în jos; e bun pentru comparații,
nu ca notă.

**Ținta pe B:** primele 3 ≥ 92% → **92,0%, atinsă la limită**; locul 1 ≥ 80% → **86,7%, atinsă**;
din afara materiei ≥ 90% → **80,8%, NEATINSĂ** (21/26; înainte tot 21/26, dar cu o listă de gesturi neacoperite
care pe B taie 4 răspunsuri greșite, iar formulările în plus și pragul pe asemănare adaugă 4 noi; vezi mai jos).

Pe tipuri (primele 3 / locul 1 / câte sunt):

| tip | A înainte | A după | B înainte | B după |
|---|---|---|---|---|
| efect | 37 / 32 / 52 | 48 / 44 / 52 | 34 / 31 / 46 | 41 / 39 / 46 |
| fara_diacritice | 40 / 39 / 42 | 42 / 41 / 42 | 47 / 45 / 50 | 48 / 46 / 50 |
| lung | 13 / 12 / 18 | 16 / 16 / 18 | 11 / 7 / 19 | 15 / 14 / 19 |
| greseala_tastare | 25 / 24 / 27 | 27 / 26 / 27 | 21 / 21 / 25 | 22 / 21 / 25 |
| engleza | 18 / 14 / 20 | 19 / 14 / 20 | 15 / 15 / 16 | 16 / 16 / 16 |
| scurt | 10 / 9 / 11 | 11 / 10 / 11 | 14 / 11 / 14 | 14 / 11 / 14 |
| vorbe_de_acasa | 16 / 13 / 19 | 18 / 16 / 19 | 16 / 16 / 18 | 17 / 16 / 18 |
| in_afara | 20 / 26 | 24 / 26 | 21 / 26 | 21 / 26 |

Setul 1 pe tipuri (după): greseala_tastare 30/29/30 · engleza 21/21/21 · vorbe_de_acasa 21/20/21 · efect 41/39/41 ·
scurt 18/16/18 · fara_diacritice 55/52/55 · lung 6/6/8 · in_afara 25/25 (înainte: engleza 20/20, lung 4/4, scurt 18/17,
fara_diacritice 55/54, in_afara 23/25).

### `date.js` și timpii
- `date.js`: **563.514 → 825.650 octeți (+262 KB, +46%)**; comprimat (gzip) **128,7 → 197,8 KB (+69 KB)**. Formulările
  în plus sunt 247 KB din el: 7.114 fraze (11 dubluri scoase), normalizate (litere mici, fără diacritice și semne) și
  legate cu „|” în câmpul `fx` al fișei. Pagina nu le afișează.
- Construirea indexului: în pagină (`proba_browser.py`) **282 ms** pentru 285 de fișe, 289 ms la 300 de fișe (înainte
  225–490 ms). În node, în aceleași condiții: 350–400 ms la rece (vechiul motor 230–340 ms), median ~230–350 ms. Am
  compensat creșterea: analiza fiecărui text o singură dată, expresiile căutate doar la lungimile care există, grupurile
  împărțite (nu copiate), vetoul indexat pe prima rădăcină. Pe un PC de 2–3 ori mai lent: ~0,6–1 s.
- Căutarea: în pagină, de la tastare la rezultate **maxim 7,2 ms** (300 de fișe: 9,9 ms). În node, pe toate seturile de
  3 ori: mediu 1,0 ms, p99 4,4 ms, **maxim 14,6 ms**; literă cu literă pe cele mai lungi 20 de întrebări: maxim 4,9 ms.
  (Pe calculatorul încărcat de alte sesiuni am văzut și vârfuri de 50 ms la `evalueaza.mjs`.) Prima căutare după
  încărcare: 10–19 ms (vechiul motor 18–22 ms).
- `proba_browser.py`: **ultima linie 0** (0 cereri externe, 0 erori JS). `build.mjs` și `build.mjs --verifica`: **0**.

## Ce am schimbat și de ce
Cât pierde varianta finală dacă scoți un singur mecanism (A, apoi B; locul 1 · primele 3 · afară):

| mecanism (cheia din `reglaj`) | fără el, A | fără el, B |
|---|---|---|
| formulările în plus (`ponderi_campuri.formulari_extra` 1,0) | −17 · −19 · −1 | −17 · −17 · **+2** |
| lista „neacoperite” (`veto`) | 0 · 0 · **−4** (și set1 −1, inginer −1) | 0 · 0 · **−4** |
| asemănarea cu o formulare în plus (`fx_dice` 0,65) | 0 · 0 · 0 | −2 · −2 · +1 |
| cuvântul spus o singură dată în formulări contează puțin la „am găsit” (`fx_tare_tf1` 0,3) | −3 · −4 · 0 | −3 · −3 · 0 |
| numele aplicației scris greșit (`app_rar`) | −1 · −1 · 0 | 0 |
| cuvântul ghicit cântărește mai puțin la „am găsit” (`incert_tare` 0,7) | 0 · 0 · −1 (inginer −1) | +1 · +1 · 0 |
| doar 40 de candidați punctați pe larg (`max_candidati`) | 0 (set1: −1 la primele 3) | 0; căutarea de 5–15 ori mai rapidă |

### 1. Formulările în plus — câmp separat (`cautare.js`, `build.mjs`)
- `build.mjs` citește `_sursa/formulari_extra_*.json`, le normalizează cu aceeași funcție ca motorul, scoate dublurile
  (și pe cele egale cu titlul / întrebarea / formulările fișei) și le scrie în `fx`. Un fișier stricat = problemă
  numărată în ultima linie; un id fără fișă validă = informare.
- Motorul le indexează ca **câmp separat** `formulari_extra`, cu trei reglaje separate: ponderea la ordonare (1,0;
  am încercat 0,6–1,2: peste 1 crește locul 1, dar pică „afară”), cât contează la „am găsit” (`fx_tare` 0,7 din pondere)
  și **câte fraze îl spun**: un cuvânt care apare într-o singură formulare din 25 („la geografie”, „profa”, „telefonul”)
  e context, nu gestul fișei, deci la „am găsit” contează doar 0,3 (`fx_tare_tf1`). Intră la rareța cuvintelor
  (`fx_df`), NU intră în vocabularul greșelilor (au greșeli de tastare generate) și NU intră la „cea mai apropiată
  frază” la fiecare candidat (`fx_fraza` 0: același rezultat, de 2 ori mai lent).
- **De ce cinstit pentru „n-am găsit”:** cu formulările la pondere plină, întrebările din afara materiei găseau
  potriviri întâmplătoare (A afară 20 → 17). Separarea „ordonare / am găsit” și „cuvânt spus o dată = context” le-a adus
  înapoi.

### 2. Pragul „am găsit”, reglat pe CV
Pe B, 13 din 19 ratări erau „n-am găsit” cu fișa bună printre propuneri. Pe CV am căutat regula (trăsătură cu
trăsătură, frontul „câte din afara materiei taie / câte bune pierde”). Trăsătura nouă care desparte bine: **asemănarea
întrebării cu cea mai apropiată formulare în plus a primei fișe** (Dice). Pe CV, din întrebările bune sub prag, 511 au
asemănarea ≥ 0,6, față de 2 din 87 din afara materiei. Regula: sub prag, „am găsit” și dacă asemănarea ≥ `fx_dice`
(0,65; 0,6 dădea +1 pe B la primele 3, dar −1 afară în setul de reglaj). Frazele formulărilor în plus se analizează doar
pentru primul rezultat, când e nevoie, și se țin minte (nu încarcă indexul). Restul pragului a rămas: 0,65; la frazele
lungi (≥ 3 cuvinte potrivite) 0,35.

### 3. „Neacoperite” — gesturile care NU sunt în materie (`sensuri.json`, 64 de intrări)
Listă de gesturi din Office / Windows / web care nu sunt în cele 285 de fișe (le-am luat din cunoașterea aplicațiilor
+ catalog): ascund rânduri, filtru, înghețare, formatare condiționată, COUNTIF, parolă, comentarii, hyperlink, inserare
rând / coloană, găsire și înlocuire, cuprins, numerotarea paginilor, subsol, WordArt, ortografie, video, sunet, folder
nou, redenumire de folder, captură de ecran, tapet, wifi, instalare, virus, arhive zip, Paint, Scratch, jocuri… Dacă
întrebarea pomenește unul și primul rezultat nu-l are în titlu / întrebare / formulări / cuvinte, răspunsul e
„n-am găsit” + propuneri. Când o fișă nouă predă gestul și îl numește, vetoul nu mai ține pentru ea.
- **Doar gesturi, nu context.** Am scos ce apare în formulările în plus ale unor fișe bune („am primit pe mail”, „ca la
  proiector”, „pe copertă”, „o pun pe WhatsApp”, „lista ▾ de lângă Σ”) și am verificat pe CV: vetoul mai taie 1 din 7.114
  formulări bune; în setul de reglaj, 0 întrebări bune.
- **Recunosc:** câteva intrări le-am gândit după întrebările din afara materiei din A (redenumesc folderul, numerotare
  pagini, rând nou între, muzică, imprimantă, mail). Restul sunt din cunoașterea aplicațiilor. Pe B, pe care nu l-am
  văzut, vetoul taie 4 din 9 răspunsuri greșite (17 → 21), fără să piardă nicio întrebare bună.

### 4. Mecanisme mici, generale
- **Numele aplicației scris greșit** („powerpiont”, „powerpont”) e citit ca aplicație și când greșeala apare și într-o
  formulare (înainte, fiind „cunoscut”, nu mai era corectat).
- **Cuvântul ghicit** (greșeală de tastare, început de cuvânt) cântărește 0,7 la „am găsit” („caine” → „cine”).
- **Rădăcini fixate** (`radacini_fixe`): „alineat” nu mai e lipit de „aliniere” (amândouă ieșeau „alin”).
- **Doar numele aplicației** („file explorer”, „excel”): fișele care pomenesc chiar numele trec primele.
- **Viteza:** fiecare fișă-candidat primește o margine de sus a acoperirii; se punctează pe larg doar primele 40.
- **Dicționar** (efect pe A la adăugare +5 locul 1 / +3 primele 3; pe B 0 — adică nu s-a generalizat, l-am păstrat
  fiindcă sunt sensuri adevărate): `ordine` + a doua / a treia / al doilea…; `grafic_radial` + pizza; `fundal` + pe
  dinăuntru; `inchidere` + xul, x-ul; `anulare` + „din greșeală”; umplutură + „gen”; din `antet_subsol` am scos
  „număr de pagină / numărul paginii / numerotarea paginilor / page number” (numărul paginii nu e antetul tabelului).

### Ce am încercat și am lăsat (fără câștig sau cu pierdere)
- Formulările în plus amortizate la ordonare după câte fraze le spun (0,3 / 0,7): pierde pe B (−4 / −3).
- „Centralitatea” (în câte fraze ale fișei apare cuvântul): 0 pe A, am scos-o din cod.
- Pașii / rezultatul la „am găsit” cu pondere mică: 0.
- Cuvântul necunoscut mai ușor (0,35–0,7): 0 la cele bune, −1 afară.
- Pragul 0,55–0,6 fără regula pe asemănare: +2–4 bune pe B, dar −3 până la −10 afară în setul de reglaj.
- Vetoul socotit și pe formulările în plus: 0 pe CV și B, −1 afară în setul de reglaj.

## Ratările rămase pe B (citite DUPĂ înghețarea reglajului; nu le-am mai reglat)
15 întrebări din materie nu ajung în primele 3: 9 sunt „n-am găsit” cu fișa bună printre propuneri, 6 sunt de ordonare.
Plus 5 din afara materiei care primesc un rezultat.
- **„slide-urile” → „slide” + „urile”.** Articolul despărțit de cratimă („-urile”, „-ului”) rămâne cuvânt necunoscut
  (doar „ul”, „uri”, „lea” sunt umplutură). Defect general de normalizare; trage în jos cel puțin o întrebare din B.
- **Cuvinte lipite** („cumsalvez prezentarea noua”) și **greșeli în cuvinte de 3 litere** („tma” = temă): nu se
  corectează. Și „cursvi word” iese pe locul 1, dar sub prag (greșeala × 0,7 la „am găsit”).
- **Numele aplicației folosit ca loc** („am descărcat-o de pe site”, „iau fișierul de pe site”): „site” e nume al
  aplicației web, deci fișele PowerPoint / Windows sunt tăiate („altă aplicație numită”). 2 întrebări.
- **Numere și date** („9,50”, „8.3 → 08.mar”, „8,333333 → 8,33”): numerele nu se potrivesc cu nimic. 3 întrebări (și una lungă, „12,5 lei”).
- **Fraze lungi cu mult context** (cheltuielile clasei, proiectul despre planete, fereastra mică din laborator,
  „mă întorc la Word fără să-l închid pe celălalt”): fișa bună e de obicei pe locul 1–5 (o dată pe 148), dar acoperirea e 0,3–0,5.
- „note” e și „notele vorbitorului” (PowerPoint), și note școlare: „notele … să rămână” trage spre sortare / medie.
- **Din afara materiei, primite greșit:** numărul paginii jos în Word (am scos „numărul paginii” din veto, fiindcă se
  lipea de „numărul de pagini”), antetul paginii („antet” e și rândul de antet al tabelului), notele colorate singure cu
  roșu (formatare condiționată, spusă altfel decât în listă), diapozitivele care se schimbă singure după câteva secunde,
  poze cu telefonul.

**Propuneri pentru dirijor** (generale, dar găsite pe B, deci de judecat pe setul ascuns, nu pe B): articolul despărțit
de cratimă („-urile”, „-ului”, „-ul”) lipit la loc în normalizare; „site” ca indiciu, nu ca nume, când e precedat de
„de pe”; în „neacoperite”, formele de copil ale gesturilor („se colorează singure”, „se schimbă singure”, „numărul
paginii jos/sus”).

## Corecturile setului 2
Niciuna. Am verificat (doar în A) trei candidați și nu sunt „vădit greșiți”: „autosum” (setul cere butonul Σ, fișa
listei ▾ e alt gest), „margini” (fișa „Afli ce margini are foaia” ar fi o adăugare plauzibilă, nu o greșeală),
„nu văd terminația fișierului…” (setul cere coloana Tip, exact gestul când extensia e ascunsă).

## Riscuri pentru setul ascuns
- „Din afara materiei” e partea slabă: pe B 80,8%, sub 90%. Lista „neacoperite” ajută (B +4), dar acoperă doar
  gesturile la care m-am gândit; formulările în plus fac cunoscute și cuvinte de context, deci frazele din afara
  materiei mai găsesc potriviri.
- Regula pe asemănare (`fx_dice`) e reglată pe CV, unde întrebarea seamănă mult cu frazele aceluiași autor; pe
  întrebări reale aduce mai puțin (pe B +2 bune, −1 afară). Se oprește cu `fx_dice: 0`.
- Lista „neacoperite” trebuie ținută la zi: o fișă nouă pentru un gest din listă trebuie să-l numească (în titlu,
  întrebare, formulări sau cuvinte), altfel vetoul o ascunde.
- `evalueaza.mjs --fise` construiește indexul din `fise_*.json` fără formulările în plus: cifrele lui sunt mai mici
  decât cele din `date.js`.

## Cum se reproduce
```
node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs
node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs C:/00/Projects/LearningHub/cum-fac/_teste/set_dezvoltare.json --detalii
node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs C:/00/Projects/LearningHub/cum-fac/_teste/set_dezvoltare_2.json --detalii
node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs C:/00/Projects/LearningHub/cum-fac/_teste/exemplele_profesorului.json
python C:/00/Projects/LearningHub/cum-fac/_teste/proba_browser.py
```
A = indicii 0, 2, 4… din `set_dezvoltare_2.json`; B = 1, 3, 5…. Motorul nou cu `sensuri.json` vechi dă exact cifrele
vechi (toate cheile noi sunt oprite implicit): `evalueaza.mjs … --date <date.js vechi>` → 289 / 317 / 377, afară 41/52.
