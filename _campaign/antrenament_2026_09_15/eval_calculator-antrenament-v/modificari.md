# Evaluare independentă: „Antrenament: Calculatorul” (V-U1), 15.09.2026

Jocul: `C:\00\Projects\LearningHub\jocuri\calculator-antrenament-v\index.html`. Singurul fișier modificat.
Copia de dinainte: `index_original.html`. Dovezile sunt în același folder:
- `joaca.txt`: tragerea reală pe iPhone SE, plus bazinele și lungimile variantelor;
- `bazine.json`: bazinele după reparații;
- `existente.txt`: întrebările V-U1 existente;
- `material_V_M1.txt`: materialul profesorului, ca text;
- `surse\` + `surse_extrase.txt`: paginile descărcate cu curl.

## Sursele
- **Pagini de eroare, nefolosite:**
  - `gps.html`: gps.gov, „Page not found”;
  - `taskmgr_ro.html` și `shutdown_ro.html`: Microsoft ro-ro, „Error - Office.com”;
  - `apple_4k.html`: pagina Apple nu are cifre în MB.
- **Folosite:**
  - Wikipedia în format brut: Gigabyte („manufacturers … decimal gigabytes”, „400 GB … displayed by Microsoft Windows as 372 GB”), Global Positioning System („receiver can calculate its own … position”), IBM Simon (lansat în 1994), Personal computer (Altair 8800 în 1974, Apple II în 1977, IBM 5150 în 1981);
  - materialul profesorului: 1 KB = 1024 B, 50–70 cm, lumina, RAM și disc, exemplele de intrare-ieșire;
  - lecția LearningHub cls5: stickul de 32 GB care apare cu mai puțin de 30 GB e deja predat.

## Trecerea 1: faptele (46 de întrebări)
Calculele refăcute (python):
- 32·10⁹ : 1024³ = 29,80;
- 4096 : 400 = 10,24;
- 2048 : 256 = 8;
- 600 × 5 = 3000 MB ≈ 2,93 GB;
- 1,5 TB = 1536 GB, iar un HDD de 2 TB are în realitate ≈ 1863 GB, deci tot încape;
- 3 × 4,7 = 14,1; 10 × 4,7 = 47.

Toate cheile sunt corecte. Fiecare întrebare are o singură variantă bună. Nicio greșeală de fond care să schimbe cheia. Semnalările de mai jos țin de formulare, formă și nivel.

## Semnalări
| # | Gravitate | Ce | Reparat? |
|---|---|---|---|
| 1 | important | **Răspunsul era scris în enunț** (Avansat): „unul are 4 GB de **RAM**… Ce ar trebui mărit?”, cu răspunsul „Memoria RAM”. În plus, scenariul e chiar exercițiul din material (`clasa_V_M1`, lecția 4), deci nu e context nou. | rescris: laptopul bunicului, 20 de pagini, „pe disc are mult loc liber”, variante de lungimi egale |
| 2 | important | **Dublură înăuntrul jocului + exercițiul din material**: Avansat „semnezi pe ecranul aparatului de la bancă” are aceleași variante și aceeași cheie ca De bază „tableta pe care desenezi”. Răspunsul e exact cel din material (lecția 5, „Al doilea exemplu: bancomatul…”). | scoasă |
| 3 | important | **Dublură înăuntrul jocului + exemplul din material**: Avansat tf „mașina de spălat … e sistem de calcul” are aceeași formă ca tf-ul „semaforul” (Consolidat) și ca tf-ul „routerul” (De bază). `why`-ul copia răspunsul-model din material. | scoasă |
| 4 | important | **Runda greșită**: tf „procesor rapid fără stocare își amintește temele” (Avansat) e o singură idee de bază despre componente. | mutat în De bază |
| 5 | important | **Runda greșită**: tf „la biblioteca orașului regulile nu se mai aplică” (Avansat) e un adevărat/fals cu o idee. | mutat în Consolidat (ca la pilot) |
| 6 | important | **Runda greșită**: „3 DVD-uri de 4,7 GB sau un stick de 16 GB” (Avansat) e o singură comparație cu obiecte cunoscute. | mutat în Consolidat |
| 7 | important | **Runda greșită**: `order` „oprirea calculatorului” (Consolidat) înseamnă pași ghidați, ca pornirea din De bază. Dubla și vânătoarea „Mara” din aceeași rundă, unde oprirea greșită e una dintre greșeli. | mutat în De bază; ultimul pas „Aștepți să se stingă monitorul” → „Aștepți până se oprește de tot calculatorul” (la PC de birou monitorul nu se stinge neapărat) |
| 8 | important | **Fapt inexact** (GPS, Avansat): „Poziția mașinii, primită de la sateliți”. Sateliții trimit semnale, iar receptorul își calculează singur poziția (Wikipedia GPS). | „Semnalele primite de la sateliți” |
| 9 | minor | **Fapt inexact** (match-ul cu perioadele): enunțul spunea „calculatoarele care **au apărut** atunci”. Dar PC-ul a apărut în 1974–1977 (Altair, Apple II), iar primul telefon inteligent în 1994 (IBM Simon), nu în perioadele puse în pereche. | „calculatoarele cele mai cunoscute atunci” |
| 10 | minor | **Cifră prezentată ca adevăr general**: „La un telefon, un minut în 4K ocupă cam 400 MB”. Mărimea depinde de telefon, de cadre pe secundă și de format. Pe sursă n-am putut verifica. `why` spunea și că toate distractorii „ies când compari 4 cu 400”, dar „cam 40” nu iese așa. | „Pe telefonul Anei, cu setările ei…”; `why` numește doar „cam 100 = 400:4” și adaugă că pe alt telefon diferă |
| 11 | minor | **Contradicție internă** (match-ul cu stocarea): perechea spune „DVD: capacitate mică și se zgârie”, iar `why` spunea „păstrarea îndelungată (DVD)”. | `why`: „un disc ieftin, dar mic, pe care îl poți da cuiva” |
| 12 | minor | **Neconcordanță între întrebări**: vânătoarea „Radu” nu marca „pun laptopul pe masă”, deși întrebarea „laptopul în pat” spune că e bine doar ridicat pe cărți. Copilul atent putea apăsa acolo și era penalizat. | textul: „pe masă, ridicat pe câteva cărți”; `lectii` [7] → [2,6] (poziție + copie de rezervă) |
| 13 | minor | **Indiciu prea bogat**: în Avansat, „Radu” enumera exact cele 4 locuri greșite. În Consolidat, „Mara” enumera cele 4 categorii. | Avansat: indiciu general; Consolidat: 3 zone, nu 4 |
| 14 | minor | **Formă**: varianta corectă era strict cea mai lungă la „braț” (48/46), „cuptor” (44/41), „sursa” (19/13), „lumina din spate” (44/42) și „laptopul în pat” (40/39). | reechilibrate (`joaca.txt`: au rămas doar 3 diferențe de 1-2 caractere) |
| 15 | minor | „pe SSD” în drumul textului: laboratorul poate avea hard disk. | „pe disc (SSD sau hard disk)” |
| 16 | minor, neverificat | Numele din Windows: „Managerul de activități”, „Închidere”. Paginile Microsoft ro-ro au dat eroare. Sunt formulate prudent („caută partea de performanță”, „alegi închiderea”). | adăugat „(în engleză, Task Manager)” |
| 17 | minor | Avansat avea exact bazinul minim după mutări (10 = 2×5), iar poarta avertiza: lecțiile 3, 4, 5 și 7 aveau câte o singură întrebare. | **3 întrebări noi, scrise de evaluator** (le recitește profesorul): robotul de aspirat (L3), componentele Mariei pentru montaj (L4), chioșcul de comenzi (L5). Fișa lui Tudor are acum `lectii` [5,4,6] (3 din 6 rânduri sunt dispozitive), iar Avansat declară [2..6]. |

## Potrivirea cu descriptorul
Din 46: **7 întrebări erau în runda greșită**:
- 6 în Avansat: RAM-ul (1), semnătura (2), mașina de spălat (3), procesorul fără stocare (4), biblioteca (5), DVD-urile (6);
- 1 în Consolidat: oprirea (7).

Trei dintre ele erau luate aproape identic din exercițiile materialului, deci nu erau „context nou”.

Le-am lăsat la limită:
- Consolidat „lumina din spate” (o idee; aceeași regulă apare și la Ioana, în De bază, și la Radu, în Avansat);
- Consolidat tf „semaforul” (o idee, dar cere schema date→decizie);
- match-ul cu perioadele (rechemare);
- Avansat „laptopul în pat” (o decizie, cu distractori slabi);
- Avansat „fișa lui Tudor” (context de clasă, nu nou);
- Avansat „4K pe telefon” (aceeași socoteală ca „clipurile de 256 MB” din Consolidat).

## Dublurile
- Scriptul: **0 perechi** înainte și după.
- Citite cu ochii lângă `calculator-v`, dubluri parțiale lăsate profesorului:
  1. Avansat „600 de fotografii … stick + copie pe card”, față de calculator-v N7 „Cum duci filmul? Pe stick, cu o copie de rezervă pe card” (aceeași cheie, aceiași distractori: cloud, CD, fără copie). Adaugă doar calculul și constrângerea „fără internet”;
  2. vânătoarea „Radu”, față de N7 „planul colegului” (copia de rezervă) și N2 („ore multe de joc seara”);
  3. clasificarea „apel video”, față de N7 „montajul filmului” (aceeași schemă intrare/ieșire/stocare);
  4. `order` „drumul textului”, față de N4 („se ia curentul, unde era textul?”) și N4 („tasta A”);
  5. clasificarea „Ioana”, față de N2 („Andrei”: spate, tălpi, încheieturi);
  6. match-ul „analogii”, față de N4 („rolurile componentelor”);
  7. clasificarea „stocare”, față de N6 („ce se păstrează la oprire”);
  8. match-ul „perioade”, față de N3 (`order` pe evoluție).
- Fără problemă: „direcțiile” (alte dispozitive decât N5), „20 GB de poze” față de N7 („3,5 GB”).
- **Repetiții înăuntrul jocului care au rămas:**
  - „RAM se golește, discul păstrează”: tf procesor, drumul textului, analogii, rândul lui Tudor;
  - „ecranul tactil = intrare-ieșire”: tableta, bancomatul, chioșcul (nou), rândul lui Tudor;
  - „lumina dintr-o parte”: 3 runde.

## Tragerea (iPhone SE, fără toateIntrebarile, runde TERMINATE; `joaca.txt`)
- Bazinele după reparații: De bază 18 (câte 6 trase), Consolidat 16 (6), Avansat 13 (5). Toate au ≥ 2×`cate`.
- Reluarea după o rundă terminată: **0 repetate** în toate cele 3 runde. La a treia jucare ciclul reîncepe: repetă 2 întrebări, cum e de așteptat.
- Prima tragere atinge toate lecțiile rundei (5/5, 5/5, 5/5). A doua tragere la fel. A treia (restul bazinului) atinge doar 3 lecții.
- Pagina are 320 px la 320 px lățime. Zero erori JS.

## Declarațiile rundelor
- De bază: [2..6], fără evoluție. Adevărat, nicio întrebare nu e despre evoluție.
- Consolidat: [2..6], toate conținuturile. Adevărat (evoluția e în match-ul cu perioadele, normele în „Mara” și „biblioteca”).
- Avansat: [2..6]. Am scos „Normele de securitate” din conținuturi, fiindcă după mutarea „bibliotecii” nicio întrebare Avansat nu mai era despre norme.

## Porțile, la final
- `test_joc.py calculator-antrenament-v` → **[TRECUT]**, 94 de întrebări jucate, 62,6 diacritice la 1000 de litere, **fără avertismente** (înainte de întrebările noi: 4 avertismente de lecții cu o singură întrebare);
- `acoperire.py` → **0 goluri, 0 probleme**;
- `intrebari_unitate.py V-U1 --verifica` → **0 perechi** (37 existente, 47 în joc).

## Limbajul
Propoziții scurte și exemple din viața unui copil de 10-11 ani (tabără, bunici, ora de muzică).

Cuvinte de verificat la clasă:
- „prelungitorul”;
- „cititorul de coduri de bare”;
- „circuite integrate”: apare doar în match, fără explicație;
- „4K”.

## Rămâne de decis de profesor
- Cele **3 întrebări noi** (robotul, Maria, chioșcul): le-a scris evaluatorul, deci nu le-a verificat un al doilea om.
- Cele 8 dubluri parțiale cu `calculator-v`, mai ales „600 de fotografii” (nr. 1).
- **Convenții amestecate:** întrebarea cu stickul de 32 GB învață că producătorul numără din 1000 în 1000. Celelalte socotesc DVD-ul de 4,7 GB ca 4,7 × 1024 MB. În realitate un DVD are ≈ 4482 MB „de calculator”. Merge ca simplificare de clasă, dar un elev isteț poate întreba.
- **Tranzistorul:** materialul și jocul spun anii 1960–1970, iar pagina LearningHub „anii 1950”. Formularea din joc („cele mai cunoscute atunci”) e compatibilă cu ambele.
- **Laboratorul:** Windows în română sau în engleză? Managerul de activități poate fi blocat pe calculatoarele școlii (pasul 2 al provocării de pe diplomă).
- **Motorul** (neatins): ecranul de final vorbește de „nivel” și „recitește pagina”. E aceeași semnalare ca la pilot.
