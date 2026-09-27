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

**NESIGURE** (de confirmat pe un Office în română, în laborator): „Anulare (Undo)” în Excel (confirmat doar în Word); „Golire conținut” în meniul de clic dreapta; „Opțiuni lipire (Paste Options)”; „Inserare… / Formatare celule… / Ștergere foaie / Lipire specială… / Copiere ca imagine… / Revocare (Cancel)” (doar în simulator); grupurile „Celule (Cells)” și „Editare (Editing)” în Excel; eticheta „3R x 2C” în Excel RO; opțiunea bifată implicit în fereastra Ștergere; mesajul exact al Excel-ului când zona de lipire nu are aceeași mărime.

## Tipul „excelx” (în pagină, NU în `_motor`)
Foaia din `_motor\tip-excel.js`, neschimbată, plus: clic dreapta (celulă, rând, coloană), clic pe antete, ștergere rânduri/coloane/celule și fereastra Ștergere, butoanele din Pornire (planșeta vs „Paste ▾”, Paste gri, pictograma Delete care scoate direct vs „Delete ▾”, Golire), lipirea pe zone (aceeași mărime / multiplu / mesaj), Enter care lipește, golirea și ștergerea care opresc copierea, Backspace doar pe celula activă, tragerea cu degetul și atingerea lungă, nota pentru telefon, caseta de nume scrisă, Ctrl+- / Shift+Spațiu / Ctrl+Spațiu, testele numite ale atelierului, `doarMouse`. Totul prin gesturile foii (evenimente), deci Anularea și desenul rămân ale foii.

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
