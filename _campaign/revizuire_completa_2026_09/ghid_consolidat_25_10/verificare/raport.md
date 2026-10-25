# Verificarea independentă a ghidului lecțiilor (25.10.2026)

Ce am verificat: `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md` (2.945 de rânduri, ~750.000 de caractere), după contractul `ghid_consolidat_25_10\contract.md` (R3, R4, R5, R7) și cererea dirijorului (trimiterile, folosibilitatea). N-am scris nimic din ghid și nu l-am modificat. Toate scripturile și ieșirile mele sunt în acest dosar (`verificare\`).

## Pe scurt

**Verdict: BUN DUPĂ REPARAȚII.** Ghidul nu pierde nimic important (R3 trece cu 100 % pe 85 de puncte luate la întâmplare). Numerele regulilor 1-27 își păstrează înțelesul (R5 trece). Nu are date personale (R7 trece). Are însă **2 probleme MAJORE** (ușor de reparat, sunt de text), **16 contradicții** scrise în părțile II-IX care nu ajung nici în X.1, nici în X.2, și **o serie de nepotriviri mici** între Partea I și restul. În plus, X.3 descrie ca făcute corecturi care la ora verificării încă nu erau făcute.

| Cerința | Rezultat | Gata? |
|---|---|---|
| R3 nimic pierdut | 85 de puncte: 81 găsite + 4 materie de lecție, 0 lipsă (100 %) | DA |
| R4 fără contradicții | 2 MAJOR, 16 contradicții nepreluate în X, ~15 nepotriviri MINOR | NU (după reparații) |
| R5 numerele regulilor | 1-27, J1-J10: același înțeles; schimbările de fond sunt spuse | DA |
| Trimiterile interne din I și X | 138 de trimiteri, 0 spre secțiuni inexistente; 2 duc la locul greșit | aproape |
| R7 date personale | poarta: „fișiere cu date personale: 0”; grep `<cont>` / `<e-mail>` / `742`: 0 | DA |
| R7 limbaj Partea I | se înțelege în mare; 5 locuri cer restul ghidului | aproape |
| Rânduri prea lungi | 0 rânduri peste 2.000 de caractere (cel mai lung: 1.375, rândul 2252) | DA |

---

## 1. R3 — nimic important pierdut

**Cum am ales punctele.** Scriptul `esantion.py`, cu **sămânța fixă 20261025**: din fiecare din cele 11 fișiere de extras, 6 puncte, fiecare dintr-o categorie diferită (categoriile alese la întâmplare), fără punctele cu `stare: depășită`. Au ieșit **66 de puncte din 19 categorii** (toate categoriile care există). Pentru fiecare am deschis locul din ghid și am citit dacă ideea e acolo.

**Proba de control (mai grea).** Ghidul pune la fiecare regulă trimiteri `[surse: X:N]`; cine verifică doar punctele citate poate fi păcălit de trimiteri. Așa că `acoperire.py` a numărat întâi câte puncte active sunt citate undeva în ghid: **2.846 din 2.954 (96,3 %)**. Apoi a luat, cu **sămânța 20261026**, câte 2 puncte din fiecare fișier **dintre cele NECITATE** (19 puncte) și le-am căutat după cuvinte.

**Rezultat:**

| Eșantion | Puncte | Găsite | În Anexa C | Materie de lecție | Lipsesc |
|---|---|---|---|---|---|
| Principal (sămânța 20261025) | 66 | 66 | 0 | 0 | 0 |
| Control, doar necitate (sămânța 20261026) | 19 | 15 | 0 | 4 | 0 |
| **Total** | **85** | **81** | **0** | **4** | **0** |

Procent: (81 + 4) / 85 = **100 %** (prag: 95 %).

**Observații:**
- `E_vii.md` are cea mai slabă acoperire prin trimiteri (276 din 331 = 83 %), dar 45 din cele 55 de puncte necitate sunt copia lecției VI/1 (rândurile 6-74, spus în Anexa B). Celelalte 10 sunt istorice de judecată ale unor lecții (materie, nu reguli).
- Câteva detalii mici s-au scurtat la unificare, fără să se piardă ideea: la C2:121 lipsește „lista amprentelor fișierelor primite pe apel”; la B:251 lipsește „„ții degetul pe bloc” contrazice VI/18 (ținut = meniul)”; la C1:48 lipsește cifra „0 atingeri pe alt bloc din 75.295”. Nu le-am socotit „lipsă”.

Tabelele cu fiecare punct sunt la sfârșitul raportului.

---

## 2. R4 — contradicții

### 2a. Partea I față de părțile II-IX

| # | Gravitate | Unde | Ce scrie Partea I | Ce scrie restul |
|---|---|---|---|---|
| 1 | MINOR | I.5 regula 30 (rândul 90) față de X.1 II-K2 (rândul 2684) | „lecțiile la limită (49-50) se notează „de cronometrat la clasă”” | „Între 48 și 50: „de cronometrat la clasă”” |
| 2 | MINOR | I.6 pasul 5 (rândul 106) față de VI.1 (rândul 1563) și Anexa C (rândul 2870) | „minorele de siguranță, fapte sau text contradictoriu se repară înainte de publicare” | „Repari toate GRAV și MAJOR, apoi TOATE MINOR-urile (înlocuiește: „MINOR obligatorii = siguranță, fapte, text contradictoriu…”)”. Partea I păstrează forma pe care Anexa C o dă ca depășită. |
| 3 | MINOR | I.2 (rândul 37: „publicată live imediat ce trece judecătorii”) față de V.2 (rândul 1093) | publicare imediată | „Prima publicare a unei unități (gimnaziu)… cere OK-ul lui Vasile pe Telegram, cu memento la T-5 zile. Fără OK la T-3, lecția rămâne pe nivelul de joc” (planul U15 din 27.09, C2:124). Nu e nici în V.4, nici în Anexa C; practica M2-M3 l-a lăsat în urmă. |
| 4 | MINOR | I.5 regula 37 (rândul 97) | „nota din catalog = (80 % lucrare + 20 % LearningHub) : 10” | IV.2 §4 (rândul 831): „rotunjit((0,8 × punctajul lucrării + punctele de pe LearningHub) : 10)… „80% + 20%” e baremul unei singure note”. Forma scurtă din I se poate citi greșit ca 0,2 × punctele de pe site. Recomand formula exactă și în I. |
| 5 | **MAJOR** | regula 25 (I.4, rândul 80) și V.1 (rândul 986) față de V.1 (rândul 1030) și VII.1 (rândul 1869) | „Nu porni… aplicații din Magazin (Paint, Calculator, Clipchamp, Securitate Windows, Notepad nou)” | rândul 1030: „Notepad: tastele merg ca mesaje în coada ferestrei, iar fișierele de sesiune create (`LocalState\TabState`, `WindowState`) se șterg.”; rândul 1869: „Notepad și aplicațiile din pachet: fiecare probă trece printr-un dirijor (`notepad_dirijor.py`) care refuză dacă Notepad rulează deja…”. Descriu probe cu Notepad ca practică de acum, fără „înlocuit” și fără loc în Anexa C. Un autor care citește V.1 (e pe lista lui) găsește în aceeași secțiune și interdicția, și rețeta. Contrazice o regulă de siguranță. |

Am mai verificat și sunt la fel în I și în părți: pragul „Uite cum” (~80 + legenda), ținta de atingere (≥ 32 px), parola, regula de notare (C 40 / B 30 / A 20 + 10, ,5 în favoarea elevului), regulile 20-27 față de V.1 („Regulile 21-27 pe scurt”), regula 24 (grep CU „î”), cine publică, `git add -A` interzis, numărul de agenți (6-10), P0 + cel mult 5 pași.

### 2b. Partea X: hotărârile față de părți

**Contradicții din secțiunile „Contradicții” ale părților II-IX care nu sunt nici hotărâte în X.1, nici trecute în X.2 (16):**

| # | Unde e scrisă | Contradicția |
|---|---|---|
| 1 | II.3 K3 (rândul 379), parțial | al treilea prag, „sub 20 min, întrebările vin întâi” (B:189), nu e hotărât; X.1 II-K3 vorbește doar de celelalte două |
| 2 | III.4 nr. 4 (rândul 683) | atingerea pierdută după o tragere: „artefact al probei” sau defect de reparat |
| 3 | III.4 nr. 7 (rândul 686) | `tip-foaie.js` primește, `tip-excel.js` refuză aceeași formulă englezească pe setări RO |
| 4 | III.4 nr. 8 (rândul 687) | se salvează rezultatul unei evaluări? (M3: nu; VII/10 și VIII/13: da) |
| 5 | V.4 nr. 6 (rândul 1450) | `wordobj-formatare.js`, cursorul: reparat sau nu |
| 6 | V.4 nr. 7 (rândul 1451) | `tip-excel.js` / `excelx`: cererile VIII/4 deschise sau rezolvate |
| 7 | V.4 nr. 8 (rândul 1452) | V/12 și `RezultatElev`: greșeală sau probă notată |
| 8 | VIII.2 nr. 2 (rândul 2412) | TRUE / FALSE în Office RO |
| 9 | VIII.2 nr. 3 (rândul 2413) | Paint: probat (KB, 40/40) sau presupus (V/18-21) |
| 10 | VIII.2 nr. 4 (rândul 2414) | `ExportAsFixedFormat` față de `excel_pdf.py` |
| 11 | VIII.2 nr. 5 (rândul 2415) | „Edge e pe orice Windows?” (rezolvată pe loc, „formularea sigură e cea prudentă”, dar nu în X) |
| 12 | VIII.2 nr. 6 (rândul 2416) | Scratch, Duplică: copia urmează mouse-ul? (rezolvată pe loc, nu în X) |
| 13 | VIII.2 nr. 7 (rândul 2417) | „Anulare (Undo)” în Excel: nesigur sau confirmat |
| 14 | VIII.2 nr. 8 (rândul 2418) | „Activare editare”: confirmat sau nesigur |
| 15 | VIII.2 nr. 9 (rândul 2419) | limba Office-ului din laborator (rezolvată pe loc, nu în X) |
| 16 | IX.4 (rândul 2672) | „Ieși (deconectare)” față de „Nu ești tu? Schimbă elevul” |

Partea X nu are deloc un bloc „(VIII)”: din VIII.2 a ajuns în X doar nr. 1 (X.2 punctul 15). Toate celelalte de mai sus sunt MINOR luate una câte una (fapte de aplicații și componente, nu reguli de siguranță), dar contractul cere „0 contradicții nerezolvate”, iar preambulul lui X spune că acolo e tot ce s-a hotărât și ce rămâne la Vasile.

**Hotărâri din X care nu se potrivesc cu părțile:**
- MINOR — X.1 II-K3 (rândul 2685): „un atelier sau un pas „Dacă mai ai timp” se deschide doar dacă au rămas cel puțin 35 de minute”. Sursa (II.1 S42, rândul 199) are pragul doar pentru un atelier lung: „(VIII/18: dacă mai sunt ≥ 35 de minute)”. Extins la orice pas opțional, ar cere 35 de minute libere pentru un pas de 2 minute. Tot acolo, formula „Mai sunt 10 minute din oră? Sari la întrebări.” diferă de formula care trebuie să fie „cu aceleași cuvinte” peste tot (S46, rândul 206: „Când mai sunt 10 minute din oră”).
- MINOR — X.1 V-5 (rândul 2706) schimbă regula „Nu se publică după 06:00” (V.2, rândul 1090, rămasă nemarcată) în „în zilele de școală NU se publică între 07:30 și 15:00”, cu [presupus]. Pentru zilele de școală e mai îngăduitoare decât sursa (06:00 → 07:30), deși X spune că „la egalitate” câștigă varianta mai strictă. V.2 ar trebui să trimită la X.1.
- MINOR — X.1 II-K11 (rândul 2692): „VI/14 trece la reparat (IX.2)”, dar IX.2 nu are nimic despre VI/14 sau vocativ.
- MINOR — X.2 punctul 7 (rândul 2731, „VI/10, VII/10: C/B/A sau grila de produs?”) și IX.4 (rândul 2664) îl întreabă din nou pe Vasile despre VII/10, deși IX.1 (rândul 2457) scrie „VII/10 se evaluează pe C/B/A (11.10)”, decizia lui (C1:244: „VII/10 pe C/B/A”). Doar VI/10 rămâne deschis.
- MINOR — IX.4 (rândul 2673): „Sursa unică a regulii de notare (`REGULA_NOUA.md` §1, A40/B30/C20) contrazice… fișierul citit de agenți e încă vechi”. Rândul e vechi: am citit fișierul, iar §1 are „C = 40 p… B = 30 p… A = 20 p”. Anexa C (rândul 2829) și X.3 (rândul 2746) spun la fel.
- MINOR — IV.2 §11 (rândul 903) recomandă încă „„Se apropie sfârșitul orei? Sari la ultimul punct””, formulă dată ca înlocuită în Anexa C (rândul 2798) și în S46.
- MINOR (NESIGUR, poate e doar ordinea lucrului) — X.3 (rândurile 2743-2745), antetul (rândul 5: „Textele vechi sunt păstrate întocmai în `_istoric\`”) și Anexa A (rândul 2761: `_istoric\08_RELUARE_pana_la_25_10.md` §7) descriu ca făcute lucruri care la 25.10, în timpul verificării, nu erau făcute: dosarul `_istoric\` nu există; `05_STANDARD_LECTIE.md`, `06_BRIEF_JUDECATOR.md`, `07_BRIEF_AUTOR.md`, `08_RELUARE.md` și `.claude\skills\lectii.md` nu pomenesc `00_GHID_LECTII` (0 apariții). Sunt făcute doar: §2 din `REGULA_NOUA.md` (stratul din 25.10 există) și directiva cu „î” din `C:\00\AI_0\CLAUDE.md`. `06_BRIEF_JUDECATOR.md`, rândul 6, spune încă „1-18”. (Aici sunt și cerințele R1/R6.)

### 2c. Deciziile atribuite lui Vasile (I.1, IX.1)

- **MAJOR** — IX.1, „Cum arată o lecție (cerințele lui de calitate)”, rândul 2447: „O lecție care se folosește pe telefoane nu se publică fără componenta reparată pentru telefon: „Elevii unei școli lucrează doar pe telefoane — de aceea nu public VI/18-20 fără 1.3.” (24.10)”. Propoziția e a **dirijorului**, din jurnal (`04_ORCHESTRARE.md:441`, intrarea de la 12:11, 24.10, „J3 VI/19 opus… scratch.js 1.3 pornit… de aceea nu public VI/18-20 fără 1.3”). Vasile nu publică. Greșeala vine din extragere (B:277 e etichetat `DECIZIE_VASILE`). Cerința lui de la bază e alta: „și la Dumbrava lucrăm tot pe telefoanele elevilor… mobile friendly” (20.10). Reparația: mutat la „Luate fără el” sau scris „(dirijorul, 24.10, pe temeiul cererii lui din 20.10)”.
- MINOR — X.1 II-K8 (rândul 2689): „formula lui Vasile din 11.10: „Parola o știi doar tu și părinții tăi și n-o spui nimănui altcuiva.””. Decizia lui (C1:244) e „parola rămâne „doar tu și părinții tăi””. Propoziția întreagă e formularea lecțiilor (Evii:379).
- MINOR — IX.1 „Formulări comune” (rândurile 2504-2510) stă sub titlul „Deciziile lui Vasile (cu vorbele lui) și cele luate fără el” fără să spună ale cui sunt. Unitățile de măsură (rândul 2507) au între ghilimele formularea aleasă de autorul M2 (Ev:123: „Formularea aleasă (M2)”), nu vorbele lui. Regula echipei de la VII/20 (rândul 2508) e regula lecției (Evii:362). Recomand titlul: „Formulări comune (alese de autori/dirijor; parola confirmată de Vasile pe 11.10)”.
- MINOR — IX.1 rândul 2484 („Documentele profesorului… au PRIORITATE”) nu are nici vorbele, nici data lui. Sursa e brieful autorului (`07_BRIEF_AUTOR.md:9`) și fișa de fapte a nopții.
- MINOR — I.1 (rândul 27) și IX.1 (rândul 2464) pun între ghilimele „ca dintr-o privire să știe unde a rămas data trecută”. Textul lui din 08.10 (`05_STANDARD_LECTIE.md`, rândul 11) e altul: „Astfel la o privire în meniul de jos elevul să știe clar unde a rămas data trecută”.
- MINOR (lipsă din R2) — IX.1 rândul 2438: răspunsurile lui la deciziile planului de pornire „stau în `08_RELUARE.md` / `ZIUA_12_10.md`, necitite în această fișă (nesigur)”. `08_RELUARE.md` e chiar unul din textele pe care ghidul le înlocuiește.
- Celelalte decizii din I.1 și IX.1 au fie vorbele lui (verificate pe extrageri și, pentru 27.09 și 08.10, pe `05_STANDARD_LECTIE.md`), fie data lui. Cele luate fără el sunt marcate ca atare („Luate fără el”, „(dirijorul, pe cererea lui)”, „Decizie a dirijorului din 10.10”).

---

## 3. R5 — numerele regulilor

Am comparat cu `05_STANDARD_LECTIE.md` (textul vechi, încă pe disc):
- **1-10**: același înțeles. Partea I adaugă doar ce era deja în „Ce au găsit judecătorii” (J6 în regula 2, J9 în regula 1, J1 în regula 9).
- **11-19** = punctele 11-19 din „Ce au găsit judecătorii”: același înțeles, unul câte unul.
- **J1-J10** = punctele 1-10: același înțeles (la J8 lipsește doar „nimic desfăcut”).
- **20-27**: aceleași numere și același înțeles. Ordinea din standard (23, 27, 26, 25, 24, 22, 21, 20) e spusă corect în Anexa A. Numerotarea 22 / 23 din ghid e cea din standard (22 = nimic spre servicii externe, 23 = calculatorul comun).
- **Schimbări de fond, toate spuse:** regula 6 („funcțiile nu se traduc” devine „contradicție deschisă, de probat în laborator”: spus în regulă și în X.2 punctul 15); regula 14 (excepția casetelor de cod: X.1 III-2); regula 24 (`ctx.close()`, grep cu „î”, ieșirea nu se salvează: Anexa C); regula 25 mai strictă (spus în regulă și în X.1 V-2). Regula 27 e lărgită (fără nume de elevi, scanează tot depozitul) fără să scrie că s-a schimbat, dar e doar mai strictă.
- În părțile II-IX, „regula N” / „Std r.N” au peste tot înțelesul din I.3-I.4 (am verificat 22, 23, 24, 25, 26 la fiecare apariție).

---

## 4. Trimiterile interne din Partea I și Partea X

`trimiteri.py` a găsit **138 de trimiteri** de forma „II.1 D”, „III.2”, „IX.1”, „X”. **0 duc spre o secțiune care nu există.** Pe conținut le-am citit pe toate cele din I.2-I.6 și din X. Două nu duc unde trebuie:
- I.5 regula 38 (rândul 98) trimite la „(II.2)”, dar „pașii mici ȘI cum arată rezultatul” stă în II.1 G (S77, rândul 243). Și titlul regulii, „Material și pe telefon, și pe hârtie”, nu spune ce e în ea.
- X.1 II-K11 trimite la „(IX.2)”, unde VI/14 lipsește (vezi 2b).

Trimiteri spre fișiere care încă nu există: `_istoric\` (antet, X.3, Anexa A; vezi 2b).

---

## 5. R7 — date personale și limbaj

- `python C:/00/AI_0/tools/learninghub_date_personale.py`, ultima linie: **„fișiere cu date personale: 0”** (ghidul nu apare). Ieșirea întreagă e în `date_personale_iesire.txt`.
- grep în ghid după `<cont>`, `<e-mail>`, `742`: **0**. Căile `C:\Users\…` apar doar ca `<utilizator>`, `<nume>`, `<cont>`, `Elev`, `Public`. Nicio adresă de e-mail.
- Diacritice: ș/ț cu virgulă peste tot. Cele 4 caractere cu sedilă (rândurile 382, 2315, 2381) sunt citate intenționat (despre sedilă și despre tastatură).

**Unde Partea I nu se înțelege fără restul (5 locuri):**
1. I.2 și regula 30: „după metoda judecătorului”. Metoda (110 cuvinte pe minut + gesturile cronometrate, `j2_durata.py`) e spusă abia în X.1 II-K2 și în VI.4.
2. Regula 37: „(C 40 + B 30 + A 20 + 10 din oficiu)”. Partea I nu spune că C = De bază, B = Consolidat, A = Avansat.
3. I.6 pasul 6: „marcaje, fum 390 + 1280”. „Fum” (o probă scurtă) nu e explicat.
4. I.3, sub listă: „Lecțiile judecătorilor de la lecțiile nr. 4 (J1-J10)”. Nu se spune ce sunt „lecțiile nr. 4” (prima rundă: lecția 4 a fiecărei clase, 27.09).
5. Regulile 21, 24, 25: „după orice salvare prin COM”, „se închide DOAR cu `ctx.close()`”, „registrul Explorer (BagMRU/Bags)”, „`AddToMru=False`”. Merg pentru agenți, dar contractul spune că și Vasile citește ghidul „ca să vadă cum se face o lecție la noi”.

---

## 6. Folosibilitate (autorul unei lecții de Paint)

- Lista „Partea I + II + III + IV + V.1 + VI.1 + VIII pentru Paint” se găsește cu `grep -n "^# Partea\|^## \|^### "` (253 de titluri). Se citește cu `Read` + `offset`/`limit`: **0 rânduri peste 2.000 de caractere** (cel mai lung are 1.375, rândul 2252), deci nimic nu se taie.
- Cât cântărește lista: I ≈ 7.700 de jetoane, II ≈ 17.300, III ≈ 23.800, IV ≈ 17.800, V.1 ≈ 12.100, VI.1 ≈ 9.800, VIII.A-D ≈ 6.500, VIII.H (Paint) ≈ 3.700. **În total ≈ 99.000 de jetoane** înainte să înceapă lucrul. Partea III e la limita unei singure citiri; e mai sigur în două bucăți.
- Tabelul „după rol” (rândul 16) îi spune autorului „din VIII doar secțiunile aplicațiilor din lecția lui”. Omite VIII.A-D (cum se probează un fapt, urmele pe calculatorul profesorului, numele românești ale meniurilor), care sunt comune tuturor aplicațiilor. Recomand: „+ VIII.A-D + secțiunea aplicației”.
- `grep "^### H\."` dă 3 rezultate (II.1 H, II.2 H, VIII H). Merge cu `grep "^### H\. Paint"` sau după numărul rândului, dar un agent grăbit poate citi alt H.

---

## 7. Ce e de reparat, în ordine

1. **MAJOR:** IX.1 rândul 2447: propoziția dirijorului scoasă de la deciziile lui Vasile.
2. **MAJOR:** V.1 rândul 1030 și VII.1 rândul 1869 (Notepad): marcate „(până la 10.10; înlocuit de regula 25)” și trecute în Anexa C.
3. X: un bloc „(VIII)” și rândurile pentru cele 16 contradicții de la 2b (hotărâte sau trecute în X.2).
4. Partea I: regula 30 (48 sau 49), I.6 pasul 5 („toate MINOR-urile”), formula exactă la regula 37, trimiterea și titlul regulii 38, cele 5 locuri de limbaj.
5. X.1 II-K3 (35 de minute doar pentru atelierul lung; formula cu „Când mai sunt 10 minute din oră”), V-5 (V.2 rândul 1090 să trimită la X), II-K11 (VI/14 în IX.2), X.2 punctul 7 (doar VI/10), IX.4 (rândul cu `REGULA_NOUA` §1 trecut la „rezolvat”), IV.2 rândul 903, V.2 rândul 1093.
6. Atribuirile MINOR de la 2c (II-K8, „Formulări comune”, rândul 2484, citatul din 08.10).
7. X.3 / antet / Anexa A: făcute mutările în `_istoric\` și trimiterile din 05/06/07/08 și `/lectii`, sau trecute la viitor până se fac.

---

## Anexă — fiecare punct din eșantion

### Eșantionul principal (sămânța 20261025, 6 pe fișier)

| # | Punct | Categorie | Verdict | Loc în ghid | Citat scurt din ghid |
|---|---|---|---|---|---|
| 1 | B:251 | TELEFON | GĂSIT | L634 · III.3 F2. Ținte de atingere și ce acoperă | Pe o pânză, ținta de pornire a unui gest e mare și departe de vecini: obiectele-model stau la ≥… |
| 2 | B:198 | PUBLICARE | GĂSIT | L1156 · V.2 Jurnalul publicărilor (commituri, ca | 24.10: VII/15-17 `b2c85c54`, VIII/19 `5c023ede`, VI/16 `4199e1ae`, V/19 `f00d7deb`, VII/18 `f97… |
| 3 | B:299 | DESCHIS | GĂSIT | L2551 · IX.2 Componente comune: ce a rămas după r | Motorul (809d01e1): la exersare, „Încă un exercițiu” dispare după „Ia-o de la capăt” până la re… |
| 4 | B:28 | APLICATIE_REALA | GĂSIT | L1954 · VIII. A. Cum se probează un fapt despre o | Faza 0 (27.09.2026): 46 de afirmații despre pașii Excel probate în Excel real prin COM invizibi… |
| 5 | B:76 | EVALUARE | GĂSIT | L813 · IV.2 1. Nota la lucrare (regula în vigoar | Judecătorul caută urma regulii vechi și unde nu se vede la prima citire: pragurile vechi într-o… |
| 6 | B:206 | PROCES_AUTOR | GĂSIT | L1781 · VI.4 Unde se duce consumul | Autorii opus ajung la 430-770k de context pe lecție (60-110 min, 90-260 de unelte; ex. V/17 653… |
| 7 | C1:162 | PROCES_JUDECATOR | GĂSIT | L1590 · VI.2 Rolul și legea | Nu schimbi probele, fișierele sau setările altora. Incidente reale: judecătorul VII/14 a întors… |
| 8 | C1:195 | PUBLICARE | GĂSIT | L1152 · V.2 Drumul de intrare și paginile comune | Contractul selfcheck `cum-fac-lectii-acoperite` se face ROȘU la publicarea lecțiilor noi, inten… |
| 9 | C1:151 | PROCES_AUTOR | GĂSIT | L1515 · VI.1 Fișierele lecției și notele | `afirmatii.json` se numără (total / probate, 0 nepotriviri; ex. 77 de afirmații, toate probate:… |
| 10 | C1:48 | SIMULATOR | GĂSIT | L626 · III.3 F2. Ținte de atingere și ce acoperă | Reparate în motor pe 25.10: bifele „Acum în aplicația adevărată” au zonă de 34×34 (erau 20×20),… |
| 11 | C1:26 | TEXT | GĂSIT | L313 · II.2 D. Mesajele | T39. Mesajul spune starea paginii, nu tastele („Paragraful „…” apare de două ori. … șterge una… |
| 12 | C1:121 | EVALUARE | GĂSIT | L874 · IV.2 7. Proba de antrenament: cum se soco | Calculatorul e comun (regula 23): proba se golește la „Sunt alt elev / Încep din nou” și când a… |
| 13 | C2:16 | APLICATIE_REALA | GĂSIT | L2011 · VIII. E. Excel (Microsoft 365 16.0 build 2 | Nu orice greșeală dă un cod cu #: unele deschid o fereastră de corectură sau de problemă. Fieca… |
| 14 | C2:370 | TELEFON | GĂSIT | L622 · III.3 F2. Ținte de atingere și ce acoperă | Orice zonă de atins are cel puțin 32 × 32 px pe atingere, iar un buton numit în text are nume v… |
| 15 | C2:149 | IDEE | GĂSIT | L2629 · IX.3 Reguli și porți propuse | Un arbitru automat de limbă: o singură rulare ar lămuri toate cele 22 de rânduri „de confirmat… |
| 16 | C2:86 | OPERARE | GĂSIT | L1912 · VII.1 Planul de pornire (referință) și cif | Fazele din `01_PLAN.md`: 0 urgența (27.09→29.09), 1 calibrarea, 2 bancul, 3a mașina + Excel, 3b… |
| 17 | C2:50 | IMAGINI | GĂSIT | L695 · IV.1 1. Ce imagine pui și de unde o iei | Imaginile vin din trei locuri: refolosite de pe sit (jocuri, alte lecții), capturi proprii din… |
| 18 | C2:121 | SIGURANTA_DATE | GĂSIT | L1079 · V.1 Lucrul agenților cu fișierele | Dosarul trimis unui agent nu scurge răspunsul (L36): listă albă de câmpuri, nicio bucată de 12… |
| 19 | C3:173 | SIGURANTA_DATE | GĂSIT | L1051 · V.1 Nume de persoane în lecții, simulato | Elevii mici se înscriu la „Alta școală” când nu își recunosc școala. Regula R12 nu leagă niciod… |
| 20 | C3:208 | PROCES_JUDECATOR | GĂSIT | L1661 · VI.2 Linia automată, mașina și bancul | O linie de verificare nu are voie nici să strige fals, nici să fie oarbă. Semnalările ei se TRI… |
| 21 | C3:228 | PROCES_DIRIJOR | GĂSIT | L1771 · VI.3 Lecții de metodă ale dirijorului | Agenții paraleli din același scratchpad își suprascriu scripturile cu nume generice (`build.py`… |
| 22 | C3:65 | SIMULATOR | GĂSIT | L500 · III.2 T2. Testul nu dă „Corect” fals | Fiecare test PICĂ pe o soluție stricată (control negativ): soluția trece, greșeala tipică pică,… |
| 23 | C3:21 | STRUCTURA | GĂSIT | L173 · II.1 B. Forma paginii | S22. În pași, indiciul apare singur după prima greșeală și „Arată-mi răspunsul” după a doua, fă… |
| 24 | C3:116 | APLICATIE_REALA | GĂSIT | L1993 · VIII. D. Numele românești ale meniurilor ( | 22 de nume rămase de confirmat în laborator (`calibrare\de_confirmat_in_laborator.md`, ~10 s fi… |
| 25 | D1:61 | IDEE | GĂSIT | L2655 · IX.3 Continuări pregătite pentru lecțiile | „Folder dezordonat” fără profesor (V/11): elevul își face singur dezordinea copiind fișiere din… |
| 26 | D1:149 | PROCES_DIRIJOR | GĂSIT | L1576 · VI.1 Repararea (autor proaspăt) | Ieșirile scripturilor judecătorului se pun la loc neschimbate; copiile probelor judecătorului (… |
| 27 | D1:99 | TELEFON | GĂSIT | L664 · III.3 F5. Probele de atingere | La simulatoarele cu tragere (undă, linie de timp, mânere, glisoare) se probează separat tragere… |
| 28 | D1:136 | COMPONENTE | GĂSIT | L1086 · V.2 Cine publică și când | Publică DOAR dirijorul. Autorii, judecătorii și reparatorii (inclusiv cei care repară component… |
| 29 | D1:26 | BUGET | GĂSIT | L1787 · VI.4 Politica de consum | Ieșirile lungi (Playwright, Office, `verifica_lectie.py`, `test_joc.py`) merg într-un fișier (`… |
| 30 | D1:169 | DESCHIS | GĂSIT | L1428 · V.3 Defecte deschise la componente (pent | C4. Jocul `jocuri/audio-video-vii`, nivelul 4, spune „Șterge: bucata dispare”, dar în Audacity… |
| 31 | D2:223 | PROCES_AUTOR | GĂSIT | L1559 · VI.1 Repararea (autor proaspăt) | Repară un autor PROASPĂT, nu cel care a scris: primește cererea, judecata, registrul și nota; N… |
| 32 | D2:185 | EVALUARE | GĂSIT | L844 · IV.2 5. Grila de proiect (produs) | O grilă repetată pe diplomă, înaintea pașilor, poate încurca. Granița dintre niveluri pusă de l… |
| 33 | D2:266 | COMPONENTE | GĂSIT | L1238 · V.3 API-urile simulatoarelor (rezumat; l | `urmarire-algoritm.js` (VI/17) → `urmarire-algoritm-repetitie.js` (`UrmarireRepetitie` 1.0, „pe… |
| 34 | D2:55 | TEXT | GĂSIT | L352 · II.2 I. Exemple, nume, profesorul | T63. Numele de fișier se copiază de la lecțiile anterioare și nu fixează clasa (`Pisica_<clasa… |
| 35 | D2:307 | DESCHIS | GĂSIT | L2531 · IX.2 Decizii care îl așteaptă pe Vasile | Art. 365^1 Cod penal (Legea 123/2026), VII/21: de verificat că legea există și ce spune; lecția… |
| 36 | D2:21 | STRUCTURA | GĂSIT | L206 · II.1 E. Sfârșitul orei | S46. Supapa se spune „Când mai sunt 10 minute din oră”, cu drum clar („Sună în 10 minute? Treci… |
| 37 | Ev:288 | APLICATIE_REALA | GĂSIT | L2309 · VIII. N. Browserul (Edge, Chrome) și căuta | O legătură fără niciun stil (Chromium 148, motorul lui Edge): cursor `pointer` (mâna), culoare… |
| 38 | Ev:251 | COMPONENTE | GĂSIT | L1230 · V.3 API-urile simulatoarelor (rezumat; l | `explorer-organizare.js` (`explororg`; API-ul s-a schimbat la 12.10: `analiza` întoarce `criter… |
| 39 | Ev:109 | PROCES_AUTOR | GĂSIT | L1487 · VI.1 Documentele profesorului și sursele | Capcanele temei se tratează explicit, cu exemple care nu sunt discutabile (ex. la V/5: căștile… |
| 40 | Ev:248 | SIGURANTA_DATE | GĂSIT | L1013 · V.1 Registrul, Explorer și ferestrele De | `ExplorerBrowser` găzduit în probe scrie în `BagMRU`, `Bags` și `MRUListEx` chiar cu `EBO_NOPER… |
| 41 | Ev:123 | DECIZIE_VASILE | GĂSIT | L2507 · IX.1 Formulări comune, ținute la fel în t | Unitățile de măsură (V/6, convenția din materialul lui): „De la byte în sus, fiecare treaptă e… |
| 42 | Ev:164 | SIMULATOR | GĂSIT | L652 · III.3 F4. Atingerea pierdută: cum se apără | Pe pânze și zone de desen se folosesc evenimentele `pointer*`, nu `click`/`mouse*`. Un deget ri… |
| 43 | Evi:37 | TEST | GĂSIT | L552 · III.2 T6. Exerciții, distractori, întrebăr | S2 (`verifica_lectie.py`) e o euristică de cuvinte, nu de înțeles. Blochează doar sub 50 % pe „… |
| 44 | Evi:230 | SIGURANTA_DATE | GĂSIT | L1027 · V.1 Browsere reale, Audacity, Notepad | Fișierele `Login Data` și `Web Data` ale profilului de probă le citești după `ctx.close()`, cu… |
| 45 | Evi:42 | PROCES_DIRIJOR | GĂSIT | L1467 · VI.1 Documentele profesorului și sursele | Documentele profesorului au prioritate; „nimic din memorie”. Fiecare fapt vine dintr-un fișier… |
| 46 | Evi:305 | IMAGINI | GĂSIT | L738 · IV.1 5. Marcaje, decupaje și retușuri | Marcajele (chenar roșu `#E4002B`, etichete, cifre) se pun cu PIL pe o COPIE; conținutul capturi… |
| 47 | Evi:335 | TELEFON | GĂSIT | L468 · III.1 S7. Ce știm despre aplicațiile reale | Scratch (`scratch.js` 1.0 → 1.4, proprietar VI/18, + `scratch-control.js`). Numele, culorile și… |
| 48 | Evi:213 | PROCES_AUTOR | GĂSIT | L1483 · VI.1 Documentele profesorului și sursele | Interfața unui serviciu extern (ex. Google) se citește în Chromium Playwright headless, context… |
| 49 | Evii:187 | PROCES_AUTOR | GĂSIT | L1538 · VI.1 Proba faptelor, ca un om | Proba prin COM: instanță nouă (`DispatchEx`) invizibilă, PID notat și oprit doar el, vederea și… |
| 50 | Evii:273 | TEXT | GĂSIT | L301 · II.2 B. Adevărul textului | T33. O regulă pusă de lecție se spune ca regulă a lecției, cu sursa ei, și se schimbă dacă prof… |
| 51 | Evii:202 | PROCES_JUDECATOR | GĂSIT | L1608 · VI.2 Ce verifici, mereu | O afirmație despre aplicația reală marcată NESIGUR de autor o poate proba judecătorul; ce nu se… |
| 52 | Evii:106 | APLICATIE_REALA | GĂSIT | L2129 · VIII. F. Word (16.0 build 20326, Microsoft | Dublu-clicul pe un cuvânt PĂSTREAZĂ în selecție spațiul de după (probat de judecător cu dublu-c… |
| 53 | Evii:43 | PROCES_DIRIJOR | GĂSIT | L1467 · VI.1 Documentele profesorului și sursele | Documentele profesorului au prioritate; „nimic din memorie”. Fiecare fapt vine dintr-un fișier… |
| 54 | Evii:298 | IDEE | GĂSIT | L2647 · IX.3 Fotografii și măsurători la clasă | Durata se cronometrează la clasă (prima oră decide); timpul real al unei ore cu Clipchamp se MĂ… |
| 55 | Evii13:21 | STRUCTURA | GĂSIT | L190 · II.1 C. Pașii | S36. Drumul obligatoriu (tot ce citește elevul obișnuit) se numără cu script (`cuvinte.py --max… |
| 56 | Evii13:44 | IDEE | GĂSIT | L2648 · IX.3 Fotografii și măsurători la clasă | Dacă se taie drumul obligatoriu al VII/1, se poate din laborator sau din întrebări (autorul nu… |
| 57 | Evii13:36 | COMPONENTE | GĂSIT | L977 · V.1 Calculatorul comun din laborator (re | Identitatea se verifică O DATĂ, la început și la vedere, înaintea butonului mare „Lecția 1” („P… |
| 58 | Evii13:18 | TEST | GĂSIT | L513 · III.2 T3. Răspunsurile scrise | Răspunsurile scrise se acceptă în toate formele corecte: fără diacritice, cu unitatea, cu artic… |
| 59 | Evii13:39 | TELEFON | GĂSIT | L633 · III.3 F2. Ținte de atingere și ce acoperă | Ce apare după un gest se măsoară, nu se presupune: întrebarea „Ești X?” de după „Verifică” stăt… |
| 60 | Evii13:116 | SIMULATOR | GĂSIT | L486 · III.1 S8. Defecte deschise (simulator) | Mesaje vechi în componente străine: la Format Painter, `wordobj.js` spune „îl folosim abia la l… |
| 61 | Eviii:95 | APLICATIE_REALA | GĂSIT | L2077 · VIII. E. Excel (Microsoft 365 16.0 build 2 | [NESIGUR] Nume RO ale foilor și ferestrelor (pagini Microsoft ro-ro traduse parțial automat): „… |
| 62 | Eviii:128 | PROCES_AUTOR | GĂSIT | L1515 · VI.1 Fișierele lecției și notele | `afirmatii.json` se numără (total / probate, 0 nepotriviri; ex. 77 de afirmații, toate probate:… |
| 63 | Eviii:331 | BUGET | GĂSIT | L1818 · VI.4 Durata lecției (bugetul de timp al e | Când `test_joc` avertizează „varianta corectă e vizibil mai lungă”, variantele se egalizează.… |
| 64 | Eviii:204 | SIMULATOR | GĂSIT | L434 · III.1 S4. Starea, redesenarea și motorul | La redesenare se păstrează focusul și derularea ferestrelor, listelor, meniurilor și panglicii.… |
| 65 | Eviii:337 | STRUCTURA | GĂSIT | L239 · II.1 G. Tipurile de lecție | S73. Fiecare drum de intrare (pagina completă, „pagina scurtă” de rezervă, nimic) duce la un pr… |
| 66 | Eviii:315 | COMPONENTE | GĂSIT | L1439 · V.3 Defecte deschise la componente (pent | … |

Nota la tabel: #30 (D1:169) nu are trimitere directă; ideea e în V.3 C4 (rândul 1428), IX.2 (rândul 2529) și X.2 punctul 10. #53 (Evii:43) e copia lui Evi:42 (punctul #45), găsit la rândul 1467.

### Eșantionul de control (sămânța 20261026, doar puncte NECITATE în ghid, 2 pe fișier)

| # | Punct | Categorie | Verdict | Loc în ghid | Citat scurt din ghid |
|---|---|---|---|---|---|
| 1 | B:119 | DECIZIE_VASILE | GĂSIT | L2431 · IX.1 Direcția campaniei și cererile de lu | Cererile de val, cu cuvintele lui: 05.10 22:53 „termina modulul 2 la clasa a 8-a pe learninghub… |
| 2 | B:288 | DECIZIE_VASILE | GĂSIT | L2431 · IX.1 Direcția campaniei și cererile de lu | Cererile de val, cu cuvintele lui: 05.10 22:53 „termina modulul 2 la clasa a 8-a pe learninghub… |
| 3 | C1:243 | DECIZIE_VASILE | GĂSIT | L2431 · IX.1 Direcția campaniei și cererile de lu | Cererile de val, cu cuvintele lui: 05.10 22:53 „termina modulul 2 la clasa a 8-a pe learninghub… |
| 4 | C2:355 | SIMULATOR | GĂSIT | L1204 · V.3 Legături ascunse (de știut înainte s | `scratch-control.js` face înfășurarea blocurilor prin API-ul public (`on('schimbat')` → `seteaz… |
| 5 | C3:305 | DECIZIE_VASILE | GĂSIT | L2431 · IX.1 Direcția campaniei și cererile de lu | Cererile de val, cu cuvintele lui: 05.10 22:53 „termina modulul 2 la clasa a 8-a pe learninghub… |
| 6 | D1:21 | OPERARE | GĂSIT | L1868 · VII.1 Aplicațiile reale pe calculatorul lu | Audacity: pornit DOAR pe desktopul ascuns, prin dirijor, cu lacătul; copia setărilor (`%APPDATA… |
| 7 | D1:169 | DESCHIS | GĂSIT | L2529 · IX.2 Decizii care îl așteaptă pe Vasile | Jocuri care contrazic lecțiile (jocurile nu se ating fără el): `prezentari-vi` nivelul 8 predă… |
| 8 | D2:288 | DECIZIE_VASILE | GĂSIT | L2467 · IX.1 Aplicațiile alese pe clase | 11.10, poșta electronică la VI/13-15: „la fiecare școală elevii ar trebui să aibă cont Gmail de… |
| 9 | D2:286 | DECIZIE_VASILE | GĂSIT | L2268 · VIII. L. Google: contul de școală, Drive, | Aplicația colaborativă la a VII-a = Google cu contul Google de la școală (Drive, Documente, Pre… |
| 10 | Ev:103 | PROCES_JUDECATOR | MATERIE (istoricul judecății V/4) | — | — |
| 11 | Ev:376 | DECIZIE_VASILE | GĂSIT | L2490 · IX.1 Activitatea profesorului = scheletul | M3 le urmează la fel (V/16 trei pagini de judecat, V/17 probă practică pe trei niveluri, V/18 a… |
| 12 | Evi:70 | TEST | MATERIE (regulile verificate pe VIII/2) | — | — |
| 13 | Evi:281 | DECIZIE_VASILE | GĂSIT | L2493 · IX.1 Luate fără el (dirijor sau autori) — | Noaptea 23→24.10, în `m3_noapte_23_10\contract.md`: (1) VII/18-22 pe Google (Drive, Documente,… |
| 14 | Evii:68 | SIMULATOR | GĂSIT (copia VI/1) | L1322 · V.3 Lista componentelor comune (stare la | / `excelx-interfata.js` / `registru-foi.js` / VIII/2* / VIII/3* / VIII/2 / VIII/3 / 28.09 / 01.… |
| 15 | Evii:33 | DECIZIE_VASILE | GĂSIT (copia VI/1) | L2452 · IX.1 Notarea | 29.09: „nota = punctaj : 10 … modifică peste tot”; „cel puțin o notă pe modul”. Nota se rotunje… |
| 16 | Evii13:65 | PROCES_JUDECATOR | MATERIE (istoricul judecăților VII/1) | — | — |
| 17 | Evii13:25 | DESCHIS | GĂSIT | L2520 · IX.2 Decizii care îl așteaptă pe Vasile | Notarea, puncte nehotărâte: (a) nivelul se citește din nota lucrării sau din nota din catalog?… |
| 18 | Eviii:298 | DESCHIS | MATERIE (nesiguranțele lecției VIII/17) | — | — |
| 19 | Eviii:262 | TEST | GĂSIT | L501 · III.2 T2. Testul nu dă „Corect” fals | `gresit()` conține drumul greșit tipic al fiecărui exercițiu cu simulator, iar poarta verifică… |

## Fișierele verificării (toate în `ghid_consolidat_25_10\verificare\`)
- `esantion.py` → `esantion.json`, `esantion.txt`: eșantionul principal, cu locurile citate.
- `context.py` → `context.txt`: textul din ghid din jurul fiecărei trimiteri.
- `acoperire.py` → `acoperire.txt`: acoperirea prin trimiteri, pe fișier, și eșantionul de control.
- `necitate_evii.py`: punctele necitate din `E_vii.md`.
- `trimiteri.py` → `trimiteri.txt`: cele 138 de trimiteri interne din I și X.
- `contradictii_parti.txt`: secțiunile „Contradicții” din II-IX și secțiunea II.1 D, copiate pentru citire.
- `struct.txt`: titlurile ghidului, cu rândurile lor.
- `date_personale_iesire.txt`: ieșirea porții de date personale.
- `tabel.py`: a pus tabelele de mai sus în acest raport.
