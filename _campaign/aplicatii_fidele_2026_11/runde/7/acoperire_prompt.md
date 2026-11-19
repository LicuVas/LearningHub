# Rundă `acoperire` pe Excel, după runda 7 (valul B-excel) — scris de orchestrator, 19.11.2026

Ești agentul rundei `acoperire`. NU ești autorul bibliotecii. Nu atingi nimic sub `C:/00/Projects/LearningHub_fidel/aplicatii/`,
lecțiile, jocurile sau `jocuri/_motor/`. D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.

## De ce există runda
Criticul rece al rundei 7 (`D/runde/7/critic.md`) mai are 9 GRAV deschise. Trei dintre ele nu se pot repara fără
referință, iar contractul interzice suprafețe scrise din memorie:
- **X5**: lista ▾ de lângă Σ (Average), cerută de lecția m2-l08:63;
- **X8**: fereastra de la Ctrl+S pe un registru nou și cea de la Ctrl+W pe un registru modificat (m1-l03:58, :95-97, :172, :182);
- etichetele ferestrei Sort după Add Level (scrise acum din lecție).

Celelalte GRAV (K1-K6: tastatura în ferestre, Enter cu `activat`, tastele cu meniul deschis, `=AV`+Tab → AVEDEV, modul Point
cu săgețile, KeyTips) au referință doar pe jumătate, iar oracolele nu le văd deloc. O4 Excel are 41 de scenarii, dintre care 4
fără rezultat real.

`D/de_verificat.md` are rândurile R6-1 … R6-7 și R7-1 … R7-19, toate „de lămurit pe PC-ul cu Excel”. Contractul (`D/contract.md`)
spune: „Lărgirea acoperirii … doar într-o rundă marcată `acoperire`, care are voie să crească numerele, și reînghețată după”.
Tu lărgești acoperirea din Excel-ul REAL, nu din bibliotecă și nu din memorie.

## Regula de aur
Tot ce scrii ca referință sau rezultat așteptat vine dintr-una din trei surse:
- Excel-ul REAL de pe PC, prin UI Automation pe desktopul ascuns;
- modelul obiect COM, într-o instanță invizibilă;
- o pagină Microsoft cu URL citat (`referinte/surse_microsoft.md`).

Ce nu poți obține așa rămâne [NEVERIFICAT] și NU intră în oracol. Nu te uiți la ce face biblioteca ca să alegi ce scrii în
referință. Oracolele pe bibliotecă le rulezi doar DUPĂ ce referința e scrisă, ca să măsori.

## Excel-ul utilizatorului
Utilizatorul folosește Excel pe PC-ul ăsta și îl poate deschide oricând.
- Excel îl pornești DOAR ca instanță nouă a ta:
  - `EXCEL.EXE /x` pe desktopul ascuns `LHRefOffice`, prin `python C:/00/AI_0/tools/hidden_desktop.py run --desktop LHRefOffice --timeout 900 -- python …`;
  - sau `win32com.client.DispatchEx("Excel.Application")` invizibil, cu `DisplayAlerts=False`.
- NICIODATĂ `Dispatch`, `GetObject` sau `GetActiveObject`. Niciodată `taskkill /IM EXCEL.EXE`.
- Închizi DOAR PID-urile tale: ții lista lor, iar PID-ul îl iei din fereastra instanței tale.
- După o oprire forțată ștergi doar intrările Resiliency/DisabledItems/DocumentRecovery care arată spre fișierele TALE de probă.
  Acestea stau în %TEMP%, cu nume unice; intrările fără fișier le ștergi doar dacă au ora pornirii tale.
- PowerPoint nu-l atingi.
- Numele de fișiere din Recent, numele de foldere personale și numele de cont NU intră în referință. Le înlocuiești cu „<fișier>”
  sau „<folder>”, ca în runda `acoperire` Word (`D/referinte/acoperire_word_r3.py`).

## Ce ai de acoperit
Lucrezi în ordinea de mai jos. Dacă timpul sau contextul nu ajung, te oprești la o graniță curată.

### 1. Capturi UIA noi din Excel real
Extinzi `referinte/dump_uia_office.py` sau scrii un generator-soră, `referinte/acoperire_excel_r7.py`, după modelul lui
`acoperire_word_r3.py`. Generatorul refuză ecranul omului, ca cel existent. Cheile noi le pui în `referinte/uia_excel.json`, în
blocul `acoperire_r7` sau la cheile `dialog.*` / `lista.*`, cu aceeași formă ca la Word.

a. **X8 · Ctrl+S pe un registru NOU, nesalvat (R6-4):** ce apare (fereastra „Save this file”, pagina Backstage › Save As sau Save
   As clasic) — arborele complet: butoane, casete, chei de acces, butonul implicit.
b. **X8 · Ctrl+W pe un registru cu modificări (R7-15):** fereastra „Want to save your changes…” — titlu, text, butoane, ordine,
   butonul implicit. Plus fereastra Excel fără niciun registru, după Ctrl+W pe ultimul (R7-16): panglica activă sau gri, titlul,
   zona documentului.
c. **X5 · lista ▾ de lângă Σ (R7-1)** pe Home › Editing, și lista AutoSum de pe Formulas, dacă e alta: rândurile, în ordine, cu
   chei de acces.
d. **Fereastra Sort (R7-11, R7-12, R7-14):**
   - după Add Level: eticheta rândului al doilea, cum se numește în UIA;
   - lista Order pe o coloană cu numere și pe una cu text;
   - lista Sort On;
   - numele coloanelor fără „My data has headers”;
   - fereastra de eroare la OK cu un nivel fără coloană.
e. **Fereastra de eroare a formulei (R7-2, R6-1):** `=SUM(B2:B7)B2:B6` și `=SUM(A1,A2)` + Enter — titlu, text, butoane.
f. **Galeria Fill Color ▾ (R7-8)** și **lista Borders ▾ (R7-9)**: titlurile grupurilor, rândurile, ordinea.
g. **Lista de completare a funcțiilor** după `=AV` și după `=SU` (K4, R6-2): rândurile, în ordine, și care e aleasă primă.
h. **Graficele (X10):**
   - galeria Insert › Insert Column or Bar Chart ▾ (rândurile);
   - după inserarea unui grafic pe un tabel mic: filele contextuale și ce e selectat.
   Verifici întâi ce e deja în `uia_excel.json` (`panglica_context.Ctx_ChartDesign`, `Ctx_Format`, `dialog.ChartChangeType`) și
   capturezi doar ce lipsește.
i. **Bara de stare** cu B2:C4 numere alese (R6-6: Average / Count / Sum, ordinea, locul) și modul după Σ sau „=” + săgeată (R7-7).
j. Dacă mai încape:
   - redenumirea foii cu nume existent sau cu `/` (R7-18);
   - panoul stâng din Save As pe Excel (R7-17), doar etichetele generice, fără foldere personale.

### 2. Scenarii reale noi în `referinte/scenarii_real/excel-*.json`
Formatul e același ca la cele existente, cu `mod: gest_real|model_obiect`. Rezultatul îl iei rulând scenariul pe Excel real
(`referinte/ruleaza_real.py` sau COM DispatchEx invizibil). Unde un gest nu se poate trimite fidel (de exemplu Alt prin
PostMessage), scenariul rămâne cu `mod_probat: false` sau [NEVERIFICAT]; nu ghicești.

Scenarii, în ordinea priorității:
- modul Point: `=` + ↑ + Enter → `=B4`; `=B2+` + → + Enter → `=B2+E2` (K5; vezi `runde/7/critic_probe/com_r7k.json`);
- `=AV` + Tab → `=AVEDEV(`; `=AVER` + Tab → `=AVERAGE(`; `=SU` + Tab (K4, R6-2);
- Alt+= → AutoSum, dacă se poate trimite fidel (K6; altfel URL-ul Microsoft din `surse_microsoft.md` + `mod_probat: false`);
- Enter în Column Width = OK; Ctrl+N → numele noului registru; Ctrl+W pe registru modificat → fereastra de la 1.b;
- sortarea pe două niveluri (`runde/7/com_r7c.json › sortare_doua_niveluri` e o citire; o faci scenariu);
- afișarea numerelor (R7-3, R7-4, R7-6) și Wrap Text apăsat de două ori (R7-10);
- rescrierea scenariului `excel-salvare-ca` pe drumul real (R6-5): File → Save As → Browse → File name;
- cele 4 scenarii Excel existente fără rezultat real (le găsești în ieșirea O4: `runde/7/iesiri/O4/` sau `runde/7/masurare.json`), dacă se pot rula.

### 3. Contractul bibliotecii (`D/api_biblioteca.md`, înghețat)
Îl completezi doar unde un scenariu nou are nevoie: cheile de stare §5 excel pe care le citește scenariul. Cheile apărute în
runda 7 le găsești în `aplicatii/excel.js`, doar citire, de exemplu `latimi_coloane`. `D/suprafete.json` primește suprafețele noi
de la punctul 1, dacă O3/O9 le citesc de acolo.

### 4. Oracolele
Le schimbi DOAR cât trebuie ca să citească referințele și scenariile noi. Dacă le citesc deja din dosar, nu le atingi. Fiecare
oracol atins trebuie să prindă în continuare bancul de mutanți (≥5, aceleași prinderi ca înainte, vezi `runde/1/acoperire/` și
`runde/3/acoperire_word.md`), plus cel puțin 1 mutant nou pe o suprafață nouă.

## Dovezi și reînghețare
- **Înainte:** `runde/7/masurare_final_r7.json` (măsurarea întreagă de la finalul rundei 7: O1 61, O2 13392, O3 20337, O4 43,
  O5 113, O6 0, O7 353, O8 102, O9 34, porți 41).
- **După:** `python D/oracole/masoara.py --runda 7 --paralel 3`, pornit după ultima ta scriere în `referinte/`, `oracole/`,
  `api_biblioteca.md` și `suprafete.json`. Nu rulezi nimic greu în paralel cu ea: un clic care a expirat a dat azi o poartă falsă.
  Noul `runde/7/masurare.json` devine pornirea rundei 8.
- Oracolele rulate direct le pornești cu `LH_IESIRE` spre `D/runde/7/acoperire/`; nu scrii peste `D/oracole/*.json` urmărite în git.
- Raportezi numerele O1-O9 + porți, înainte → după, pe aceeași bibliotecă. Creșterea e permisă, de asta există runda. Explici
  fiecare unitate nouă: ce scenariu sau ce suprafață o produce.
- La final: `python D/ingheata.py --acoperire "B-excel dupa runda 7: capturi UIA reale (Save this file, Save your changes, AutoSum, Sort, eroarea formulei, galerii, grafice, bara de stare) + scenarii noi"`, apoi `python D/ingheata.py --verifica` = 0.
- În `D/de_verificat.md` bifezi `[x]` rândurile R6-*/R7-* lămurite, cu calea dovezii. Pe celelalte le lași.

## Reguli
- Nimic pe ecranul omului. Excel doar pe desktopul ascuns sau invizibil prin COM; vezi „Excel-ul utilizatorului” de mai sus.
- Probele în browser: doar 127.0.0.1/localhost, cu ruta care abandonează restul. Nimic spre servere vii.
- Fără căi cu numele utilizatorului Windows (`C:/Users/...`) în NICIUN fișier scris; poarta `date_personale` le numără. Scrii „%TEMP%”.
- Căi absolute, fără `cd`. Fără git commit/add/push; le face orchestratorul.
- Ieșirile mari de Bash le pui în fișier și aduci în context doar coada. `uia_excel.json` îl citești doar prin Python, pe chei.
- La ~200k de context te oprești la o graniță curată, scrii `runde/7/acoperire/stare_autor.md` și raportezi „PREDARE”. Ordinea
  de la punctul 1 e și ordinea importanței: a-c deblochează GRAV-uri, restul doar le întăresc.

## Ieșirea
Scrii `D/runde/7/acoperire_excel.md`, în ordinea asta:
1. numerele întâi: tabel înainte → după, mutanți înainte → după;
2. fișierele schimbate, fiecare înghețat;
3. ce s-a capturat, cu calea și cum s-a obținut;
4. rândurile din `de_verificat.md` închise;
5. ce a rămas [NEVERIFICAT];
6. ce vede acum oracolul din X5, X8, X10 și K1-K6.

Ultima linie, exact una din: `ACOPERIRE_GATA`, `ACOPERIRE_PARTIALA` sau `NU_SE_POATE`.
