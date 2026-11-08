# Surse — lecția VIII m1-l04 „Adresa de celulă. Selectare, copiere, mutare, ștergere”

Scris: 27.09.2026, refăcut după judecător (13:30). Pașii se numesc ca în bara motorului: **P1 = „La ce folosește”** (pasul 0 din standard), **P2-P8 = pașii 1-7**: P2 Adresa · P3 Selectezi · P4 Copierea (tastele) · P5 Aceleași comenzi, cu mouse-ul · P6 Mutarea · P7 Golești și anulezi · P8 Scoți un rând sau o coloană. Apoi atelierul, pasul „Acum în Excel-ul adevărat” (modul lecție), 5 întrebări.

## Programa și planul
- Titlul, exact: `C:\00\Projects\Info_Gimnaziu_2026\planificari\Calendar_ore_VIII.md` (29.09.2026, lecția 4, M1) = `unitati.json`, VIII-U1, lecția 4.
- Conținuturi (text exact, `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, clasa a VIII-a, „Calcul tabelar”): „Operaţii de editare (selectare, copiere, mutare, ştergere)” și „Structura unui registru de calcul (foaie de calcul, coloană, rând, celulă, adresă de celulă)”.
- Competențe: CS.1.1, CS.3.1. Unitatea VIII-U1 „Calcul tabelar”.
- **Ștergerea unui rând / a unei coloane:** programa spune doar „ştergere”. Am inclus-o (P8, atelier, Î5), pentru că în Excel „Ștergere (Delete)” din meniu e altceva decât tasta Delete. Decizia de a o păstra în lecția 4 e a profesorului.
- Lecțiile anterioare (profilul): 2 și 3 (conținutul lor: nivelul 1 din `jocuri\excel-viii`).

## Material refolosit
- `jocuri\excel-viii\index.html`, nivelul 2: structura, analogiile, câteva exerciții. Reparat față de el: gestul „clic pe un colț, apoi pe colțul opus” (infirmat, faza 0 A20), „rândurile B până la D”, numele RO+EN, ștergerea rândului/coloanei, lipirea care înlocuiește, a doua lipire, caseta de nume.
- Capturi reale reutilizate (`jocuri\excel-viii\img\SURSE.json`): `tabel-formatat.webp` (P1), `interfata.webp` (P2), `zona-copiata.webp` (P4).
- `img\memorie-temporara.webp` (P5): decupată din `interfata.webp`, mărită ×2, cu etichete în afara capturii; refăcută 27.09 ca „Lipire (Paste)” să arate spre planșetă. Proveniența: `img\SURSE.json`.

## Ce a spus Excel-ul adevărat
- Faza 0 (`faza0\excel_real_viii4.json`), arbitrul (`_verificare\arbitru_excel.json`: 25 confirmate, 0 infirmate, 3 parțiale, 20 netestabile prin COM), proba judecătorului (`_verificare\proba_com.json`).
- Proba mea, 27.09 (Excel 16, instanță NOUĂ invizibilă, fără salvare): pictograma Pornire › Celule › Ștergere (`ExecuteMso CellsDeleteSmart`) pe B3 → celulele de dedesubt urcă; pe B2:B4 (mai înaltă decât lată) → celulele din dreapta vin la stânga; pe B2:D2 și B2:C3 → urcă. Pe rândul întreg, instanța invizibilă s-a oprit (RPC failed): netestat; simulatorul șterge rândul, cum spune sfatul Microsoft al butonului („select multiple rows… and click Delete”). Procesul oprit a ieșit singur; celălalt EXCEL.EXE deschis (nu era al meu) n-a fost atins.

## Numele românești
Din `calibrare\meniuri_ro_en.json` (CONFIRMAT): Pornire (Home), Inserare (Insert), Memorie temporară (Clipboard), Copiere (Copy), Decupare (Cut), Lipire (Paste).

Din Microsoft ro-ro (27.09.2026):
- https://support.microsoft.com/ro-ro/office/goli%C8%9Bi-celulele-con%C8%9Binutului-sau-format%C4%83rii-9ff6b8ff-1afd-495f-8ad8-8c1f6f82a9d6 — Pornire › Golire (grupul Editare): Golire totală, Golire formate, **Golire conținut**, Golire comentarii și note; DELETE/BACKSPACE golesc conținutul; „Ștergere celule” din grupul Celule mută celulele.
- https://support.microsoft.com/ro-ro/office/inserarea-sau-%C8%99tergerea-r%C3%A2ndurilor-%C8%99i-coloanelor-6f40e6e4-85af-45e0-b39d-65dd504a3246 — clic dreapta pe rând/coloană › **Ștergere**; **Ștergere rânduri foaie**, **Ștergere coloane foaie**; fereastra: **Deplasare celule în sus / la stânga, Rând întreg, Coloană întreagă** (citit printr-un rezumat automat al paginii).

**NESIGURE** (de confirmat pe un Office în română, în laborator): „Anulare (Undo)” în Excel (confirmat doar în Word); „Golire conținut” în meniul de clic dreapta; „Opțiuni lipire (Paste Options)”; „Inserare… / Formatare celule… / Ștergere foaie / Lipire specială… / Copiere ca imagine… / Revocare (Cancel)” (doar în simulator); grupurile „Celule (Cells)” și „Editare (Editing)” în Excel; eticheta „3R x 2C” în Excel RO; opțiunea bifată implicit în fereastra Ștergere; ce face Excel pe ecran (Ctrl+V real) când zona de lipire are altă mărime — prin COM lipește o dată (lecția nu spune nimic despre asta).

## Tipul „excelx” (în pagină, NU în `_motor`)
Foaia din `_motor\tip-excel.js`, neschimbată, plus: clic dreapta (celulă, rând, coloană), clic pe antete, ștergere rânduri/coloane/celule și fereastra Ștergere, butoanele din Pornire (planșeta vs „Paste ▾”, Paste gri, pictograma Delete care scoate direct vs „Delete ▾”, Golire), lipirea pe zone (aceeași mărime / multiplu repetat / altă mărime: o dată, din colț), Enter care lipește, golirea și ștergerea care opresc copierea, Backspace (Esc repune), tragerea cu degetul fără redesenare sub deget și fără „fling” (runda 3, N1) și atingerea lungă, nota pentru telefon cu drumul prin panglică (iPhone), caseta de nume scrisă, Ctrl+- / Shift+Spațiu / Ctrl+Spațiu, testele numite ale atelierului, `doarMouse`. Totul prin gesturile foii (evenimente), deci Anularea și desenul rămân ale foii.

**Cereri pentru `_motor\tip-excel.js`:**
1. mutat în motor tot ce face `excelx` (codul din pagină e gata de mutat);
2. `varianta()` nu schimbă valorile din `verifica.valori` → variantele la copiere/mutare nu se pot rezolva (probat live în `excel-viii` nivelul 2);
3. `copiaza()`: promisiunea respinsă de `navigator.clipboard.writeText` scapă în consolă (pagina o prinde);
4. la apăsarea mouse-ului pe foaie, `gw().focus()` (fără `preventScroll`) mută pagina ~18 px la începutul tragerii (măsurat la 1280 px pe P4): celula de sub mouse se schimbă;
5. lipirea repetată pe un multiplu se face acum din pagină, în mai multe lipiri, deci Ctrl+Z o desface bucată cu bucată (în Excel: o singură anulare);
6. Ctrl+clic (selecție multiplă) nu există în foaie; pagina spune asta pe ecran;
7. etichetele din dump-ul panglicii („Delete Cells...”, „Insert Cells”) diferă de ce scrie pe ecranul Excel („Delete”, „Insert”); pagina le corectează în memorie.

## Ce n-am putut verifica
- Nimic din lecție rulat de mine în Excel vizibil (fără acord pentru controlul ecranului); afirmațiile sunt în `afirmatii.json`.
- Atingerea lungă pe un telefon REAL (în Chromium emulat, evenimentul `contextmenu` deschide meniul); o atingere pe numărul rândului dată la mai puțin de ~0,2 s după o tragere a fost ignorată o dată în proba emulată.
- Fotografia din viața reală pentru P1 (vezi `capturi_lipsa.json`).


## Corectură 28.09.2026 (dirijorul)
Grupul de pe fila Pornire (Home) se numește **Clipboard** și în Office-ul românesc (paginile Microsoft ro-ro: „în grupul Clipboard de pe fila Pornire”; `calibrare\meniuri_ro_en.json`). „Memorie temporară” era o traducere a unui sit terț, nu numele de pe panglică. Găsit de judecătorul lecției VIII/2; corectat în pagină (4 locuri), `afirmatii.json`, `profil.json`, `img\SURSE.json`.

<!-- TUTORIALE-EXCEL:START surse -->
## Legături spre tutoriale (07.11.2026, proba)

Doar pe proba (ramura `proba`, adusă din `proba-tutoriale`; proba.learninghub-8z6.pages.dev), nu pe situl elevilor. Tutorialele Excel filmate stau în `tutoriale/excel/`, copiate 1:1 din `C:/00/Projects/DemoGif/site/` de `C:/00/Projects/DemoGif/_unelte/copiaza_in_lh.py`, care rescrie și bucățile de mai jos (între marcajele TUTORIALE-EXCEL START/END; nu le edita de mână). Locurile și motivele: `C:/00/Projects/DemoGif/_unelte/lh_locuri.json`. Toate legăturile se deschid într-o filă nouă (`target="_blank" rel="noopener"`), cu textul T55. Pașii NU s-au renumerotat; `afirmatii.json`, `capturi_lipsa.json` și `profil.json` rămân cum erau. Capturile statice rămân: filmul e un adaos, nu un înlocuitor (regula 4).

- **pasul „Copierea: Copiere (Copy), apoi Lipire (Paste)” (pasul 3 din 7), „Uite cum”** (`l04-p3-film`): legătura „Vezi film” spre `14-copiere-ctrl-c-v` („Copiezi un tabel cu Ctrl+C și Ctrl+V”). Pasul predă Ctrl+C, clic pe colțul locului nou, Ctrl+V, Esc: aceiași pași ca în film, pe aceleași celule (A1:B5 copiat în D1). Filmul nu arată marginea punctată: Excel-ul filmat nu folosește clipboard-ul, iar textul îi spune elevului că la el apare.
- **pasul „Mutarea: Decupare (Cut), apoi Lipire (Paste)” (pasul 5 din 7), „Uite cum”** (`l04-p5-film`): legătura „Vezi film” spre `15-mutare-ctrl-x-v` („Muți un tabel cu Ctrl+X și Ctrl+V”). Pasul predă Ctrl+X, clic pe colțul locului nou, Ctrl+V și locul vechi gol; filmul mută D1:E5 în G1, ca rândul 4 al laboratorului.
- **laboratorul, pasul 3 (A1:B5 copiat în D1)** (`l04-r3-depanare`): „Dacă nu-ți iese” (`<details>`). Toate trei sunt jucate în Excel-ul real pe celulele rândului (A1:B5 → D1): două clicuri în loc de tragere, Ctrl+X în loc de Ctrl+C, colțul pus pe B1, peste tabel.
  - Cazuri luate întocmai din `excel/cazuri/<slug>.json` (verificat_excel: true, verificate în Excel-ul real prin COM): `14-doua-clicuri`, `14-x-in-loc-de-c`, `14-lipit-peste-tabel`.
  - Notă pentru elev, la începutul „Dacă nu-ți iese” (cazurile sunt filmate pe alt tabel decât al laboratorului): „În cazurile de mai jos tabelul filmat are produse și prețuri (Produs, Preț, Caiet, Creion…). La tine sunt numele și notele scrise de tine (Elev, Nota): unde în caz scrie un produs sau un preț, la tine e un nume sau o notă. Celulele sunt aceleași (A1:B5 copiat în D1), iar greșeala și ce faci sunt la fel”.
- **laboratorul, pasul 4 (D1:E5 mutat în G1)** (`l04-r4-depanare`): „Dacă nu-ți iese” (`<details>`). Cazurile sunt jucate în Excel-ul real pe celulele rândului (D1:E5 → G1). Ciorna avea „a doua Lipire nu mai lipește nimic”: ține de clipboard-ul Windows, pe care filmarea nu-l atinge, deci n-a putut fi verificat în Excel; în locul lui, Ctrl+C în loc de Ctrl+X (tabelul rămâne și în D1:E5).
  - Cazuri luate întocmai din `excel/cazuri/<slug>.json` (verificat_excel: true, verificate în Excel-ul real prin COM): `15-c-in-loc-de-x`, `15-doar-o-coloana`, `15-lipit-un-rand-mai-jos`.
  - Notă pentru elev, la începutul „Dacă nu-ți iese” (cazurile sunt filmate pe alt tabel decât al laboratorului): „În cazurile de mai jos tabelul filmat are produse și prețuri. La tine copia din D1:E5 are numele și notele tale: unde în caz scrie produse sau prețuri, la tine sunt nume sau note. Celulele sunt aceleași (D1:E5 mutat în G1), iar greșeala și ce faci sunt la fel”.
- **„Acum în Excel-ul adevărat”, textul de deasupra pașilor** (`l04-intro-exersare`): legătura opțională spre registrul de exersare (`exersare.html#14-copiere-ctrl-c-v`). Registrul de exersare are câte o foaie pe film (14 Copiere și 15 Mutare sunt gesturile lecției, cu „✓ Gata” singur). E opțional: pașii laboratorului rămân cei de azi.

Efect secundar cunoscut: amprenta pașilor-sursă din „Cum fac…?” se schimbă la pașii atinși; `cum-fac/_build/build.mjs --verifica` îi semnalează. Pe probă e acceptabil; înainte de master îi resincronizează proprietarul cum-fac.

Amprenta cazurilor folosite (sha1, primele 12): `cb67c36278b7`.
<!-- TUTORIALE-EXCEL:END surse -->
