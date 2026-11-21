# Supliment la promptul rundei 29 (valul B-excel redeschis `B-excel#3`; ciclul paralel D) — scris de orchestrator, 21.11.2026

Se citește DUPĂ `runde/29/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii / comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`.

În ciclul D, benzile sunt:
- r27 Explorer;
- r28 Word;
- r29 Excel;
- r30 Windows.

## Unde suntem
- **Criticul rece 25** (`runde/25/critic.md`, unghiul gest_tastatura) a lăsat 1 GRAV: G25-1, nou, dar cu cod vechi din runda 6.
- **Valul `B-excel#2` s-a oprit pe PLATOU** după ciclul C. Runda `acoperire` Office (`runde/26/acoperire_office.md`) a refăcut referințele și scenariile `excel-*` găsite greșite (sortarea pe două niveluri, Esc + Esc), iar valul se redeschide ca `B-excel#3`.
- **Pornirea** e `runde/29/masurare_pornire.json`. Unghiul rundei: `stare_finala_erori`.

## Zona înghețată: `api_biblioteca.md` NU se editează
- Dacă ai nevoie de text nou în api, îl scrii în `runde/29/api_propunere.md`. Îl aplică o rundă `acoperire`.
- Referințele (`referinte/`) și scenariile sunt tot înghețate: nu le schimbi. Ce lipsește din referință devine rând `R29-…` în `de_verificat.md`.

## Cine atinge ce din `aplicatii.js` în ciclul D
- **r29 (tu): nimic.** Lucrezi doar în `excel.js` și `date/excel.json`.
- **r28 Word:** `L.asistent`. **r30 Windows:** `gestTasta`, `leagaGesturi` › `pointerdown`, `L.deschideSuprafata`, `I.emite`.

## Ținta rundei 29, în ordinea asta
1. **G25-1 (`25/critic.md:68`): operațiile pe foi din lecția viii/m1-l03 nu fac nimic.** Delete, Move or Copy, Tab Color și tragerea filei dau doar mesajul central sau tac (`excel.js:3305-3320`, `dialog.SheetMoveOrCopy`, `fila_foii`).
   - Lecția le cere la pasul 5 și în exercițiile `:220`, `:247`, `:255`, `:266` și în atelierul `:288`. Textul lecției și capturile ei (`confirma-stergerea.webp`, `mutare-sau-copiere.webp`) spun ce face Excel.
   - Ce faci:
     - **Delete pe filă:** o foaie goală dispare direct; una cu date cere întâi confirmarea („Microsoft Excel will permanently delete this sheet…”, Delete / Cancel), ca în captura lecției; singura foaie e refuzată cu mesajul lui Excel. Fereastra de confirmare și refuzul nu sunt în `uia_excel.json`: le desenezi după captura lecției și treci rândul `R29-…` pentru captura reală;
     - **Home › Delete ▾ › Delete Sheet:** același lucru;
     - **Move or Copy:** lista Before sheet are foile registrului și „(move to end)”; OK mută foaia; „Create a copy” face „Septembrie (2)”;
     - **tragerea filei** mută foaia, iar Ctrl + tragere o copiază;
     - **Tab Color** › Standard Colors colorează fila;
     - **Ctrl+Z** după ștergerea foii nu o aduce înapoi (`m1-l03:239`, așa face Excel).
   - Fiecare gest dă evenimentul §4 cu ținta din referință; `stare()` arată foile, ordinea și culorile.
   - Proba: `runde/25/critic_probe/pD.py` și `pC.py` › 7 (sau copiile lor în `runde/29/`).
2. **Ctrl+PageDown / Ctrl+PageUp:** trec pe foaia vecină și rămân pe loc la capete (R25-7). Reparația e de o linie lângă `excel.js:3517`.
3. **MINOR 1 al criticului 25:** Alt apăsat și eliberat într-o fereastră dă `arata_taste_acces`, ca în afara ferestrei (`excel.js:3700`).
4. **Unghiul stare_finala_erori** pe Excel, pe drumurile lecțiilor. Greșelile tipice:
   - o foaie ștearsă din greșeală, apoi Ctrl+Z;
   - o formulă cu greșeală de tastare (`=SUM(A1:A3` fără paranteză, `=A1+`), apoi Esc / Enter;
   - Delete pe un rând întreg, apoi Ctrl+Z;
   - lipirea peste date, apoi Ctrl+Z;
   - sortarea doar a unei coloane (fereastra „Sort Warning”), dacă e în lecții;
   - redenumirea foii cu un nume existent sau gol.
   După fiecare: `stare()` = ecranul = referința, evenimentul §4, asistentul §6.3. Ce nu are referință: rând `R29-…`.
5. **Apoi**, cât îți ajunge contextul, MINOR-urile din `runde/25/critic.md` și `runde/21/critic.md`.

## Gata înseamnă
- `runde/29/proba_grav.py`: verificările picate la pornire și câte pică la final, pe gesturi reale.
- Regresul: probele 25, 21, 17, 10, 9, 8, 6; scenariile `excel-*` (O4).
- `raport_constructor.md`: G25-1 ÎNCHIS cu dovada de azi sau NEÎNCHIS cu motivul. Secțiunea „Fișiere comune atinse” (așteptat: niciunul).
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau, la ~200k de context, `PREDARE` în `stare_autor.md`.
