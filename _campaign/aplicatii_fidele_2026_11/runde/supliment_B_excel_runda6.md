# Supliment la promptul rundei 6 (prima rundă a valului B-excel) — scris de orchestrator, 19.11.2026

Se citește DUPĂ `runde/6/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## Unde suntem
- Valul B-word s-a oprit pe LIMITA_VAL după runda 5 (`runde/5/raport.md`). Biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/`
  (schelet comun + Word) e COMISĂ local pe `fidelitate-aplicatii` (ultimul commit: f0dd888b; nepublicată) — `git restore` pe
  fișierele tale funcționează la pasul 7.
- Word are încă 8 GRAV deschise (`runde/5/critic.md`). NU le repari în runda asta: ținta e Excel. Codul Word îl atingi doar cât
  cere partea comună (aplicatii.js, panglica.js, stare.js, aplicatii.css), și atunci Word nu are voie să se strice.
- Runda 6 = prima a valului Excel (numerotarea rundelor e globală). Valul are maximum 6 rânduri în `jurnal.jsonl`.

## Ținta rundei 6 = aplicația Excel în bibliotecă
1. Interfața Excel se GENEREAZĂ din date, ca la Word: `aplicatii/_unelte/genereaza_excel.py` (sau `genereaza_word.py`
   generalizat, fără să schimbe ce scrie pentru Word) citește referința înghețată `D/referinte/uia_excel.json` (doar citire,
   prin Python, NU întreagă cu Read) și scrie `aplicatii/date/excel.json`: filele, grupurile, comenzile, idMso, tipul de
   control, ordinea, bara de titlu, Acces rapid, bara de formule (Name Box, fx), antetele de coloane/rânduri, filele de foi,
   bara de stare, File/Backstage și ferestrele din drumurile lecțiilor. Nicio etichetă scrisă de mână; ce lipsește din
   referință rămâne lipsă și se notează.
2. Același motor de panglică (`aplicatii/panglica.js`); Excel aduce doar datele și comportamentul lui (`aplicatii/excel.js`),
   plus profilul `aplicatii/profiluri/excel365.json` (§2: `"excel": "excel365"`).
3. Comportamentul: modelul foii din §5 (`celule {A1: {valoare, text, formula?}}`, `format_celule`, `selectie {activa, zona}`,
   `nume_fisier` + TOATE cheile din `stare_citita` ale scenariilor `D/scenarii/excel/*.json`), „ecranul = starea” (§3:
   ținta `celula:<A1>` pe fiecare celulă randată, nicio celulă nevidă scoasă din DOM, celula în editare = `input`/`textarea`),
   evenimentele §4 pe fiecare gest, asistentul §6, `tipMotor` §8.1. Comenzile de pe drumurile scenariilor și lecțiilor se
   simulează; restul dau mesajul central standard cu `data-lh-nesimulat` (§3, R12).
4. Ce face Excel real decide referința: `D/referinte/scenarii_real/excel-*.json` (39 cu rezultat real: separatorul de listă
   și cel zecimal pe Windows în română, Enter/Tab/săgeți, F2, F4, umplerea prin tragere, autocompletarea, AutoSum, sortarea,
   Ctrl+Z, Merge & Center…), `uia_excel.json`, `surse_microsoft.md`. Formulele: oracolul existent `jocuri/_motor/tip-foaie.js`
   (comparat cu Excel real prin COM) e de citit, nu de copiat orbește; nu atingi `jocuri/_motor/`.
5. Poligonul: `aplicatii/poligon.html?aplicatie=excel` deschide Excel cu un conținut de probă (o foaie mică dintr-o lecție
   de clasa a VIII-a).
6. I1: la 360-390 px panglica se derulează lateral, nu se taie; zone de atins ≥ 32 px. I7: nicio captură Microsoft.

## Ce citești întâi
`D/contract.md` · `D/api_biblioteca.md` (§3, §4, §5 excel, §6, §8) · `D/oracole/CONVENTIE_ARBORE.md` · `D/referinte/README_referinte.md` ·
`D/scenarii/excel/*.json` (41) + `D/referinte/scenarii_real/excel-*.json` · apoi codul din `aplicatii/` (Grep înainte de Read;
`word.js` are ~124 KB: citește doar ce-ți trebuie ca model, pe bucăți) · simulatoarele vechi `lectii/_sim/excelx-*` și
`registru-foi` (doar ca să vezi ce drumuri cer lecțiile, NU ca model de fidelitate).

## Măsurarea
- Pasul 1 PRIMUL, în fundal: `python D/oracole/masoara.py --runda 6 --paralel 3` (~35-60 min). NU scrii NIMIC sub `aplicatii/`
  până nu s-a terminat — nici măcar un fișier nou (în runda 5 s-a scris în timpul măsurării de pornire; nu se repetă). Cât
  rulează, citești și scrii notele în `runde/6/`. Pornirea așteptată = numerele de la finalul rundei 5: O1 61, O2 13392,
  O3 20337, O4 101, O5 154, O6 0, O7 353, O8 102, O9 41, porți 41 (doar cum_fac). Dacă iese altfel, scrii de ce.
- Între pași: `--doar O3,O4,O5,O8,O9` (parțial). Pasul 7: măsurarea întreagă, pornită DUPĂ ultima scriere sub `aplicatii/`;
  orice oracol sau poartă crește → `git restore` pe fișierele tale. În raport: numerele întregi înainte → după, plus partea
  Excel din detaliile O3/O4/O5/O9 (`runde/6/iesiri/<O#>/`).
- Proba ta: `runde/6/proba_excel.py` (gesturi reale pe poligon, înainte și după, ieșirile în json) + REGRESUL Word, care
  trebuie să rămână la 0 picate: `runde/5/proba_grav.py`, `runde/4/proba_grav.py`, `runde/4/proba_telefon.py`,
  `runde/3/proba_grav.py`, `runde/2/proba_grav.py`.
- În NICIUN fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows (C:/Users/...): scrii „%TEMP%”.
- Office (dacă îți trebuie Excel real pentru o comparație): doar invizibil, COM DispatchEx, Visible=False, DisplayAlerts=0, fișiere
  cu nume unice în %TEMP%, închizi DOAR PID-ul tău; nu atingi PowerPoint. Probele în browser: doar 127.0.0.1/localhost.

## Ce NU faci (le face orchestratorul)
Pasul 8 (criticul) și pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii `runde/6/raport_constructor.md`
(numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, lista exactă a fișierelor create/schimbate, ce scenarii Excel trec acum) și
`runde/6/gata_pentru_critic.md` (doar unde e ce, cum se deschide poligonul cu Excel, ce parametri de conținut primește). Fără
commit, fără push. Atingi doar `aplicatii/` (plus notele tale în `runde/6/`, `de_verificat.md`, `de_aprobat.md`). Lecțiile,
jocurile, `jocuri/_motor/`, referințele, oracolele și `api_biblioteca.md` NU.

## Economia contextului (OBLIGATORIU — toți constructorii Word au trecut de 300k, deși regula e 200k)
- După FIECARE bucată terminată (1. generatorul + `date/excel.json`; 2. grila + editarea celulei; 3. formulele și umplerea;
  4. panglica și ferestrele; 5. scenariile), actualizezi `runde/6/stare_autor.md` (ce e gata, ce urmează, ce fișiere, ce numere,
  ce măsurătoare rulează). Așa, oricând te oprești, un constructor proaspăt poate continua.
- La ~200k de context te oprești la prima graniță curată de după, cu `stare_autor.md` la zi, și raportezi „PREDARE”. O bucată
  terminată și probată valorează mai mult decât trei începute.
- Ieșirile mari de Bash în fișier, în context doar coada. `uia_excel.json`, `date/*.json`, `suprafete.json` doar prin Python, pe chei.
