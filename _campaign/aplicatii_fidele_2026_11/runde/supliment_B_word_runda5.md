# Supliment la promptul rundei 5 (valul B-word) — scris de orchestrator, 19.11.2026

Se citește DUPĂ `runde/5/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## Unde suntem
- Biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/` (schelet + Word) e COMISĂ local pe `fidelitate-aplicatii` cu tot ce
  a făcut runda 4 (nepublicată) — `git restore` pe fișierele tale funcționează la pasul 7.
- Criticul rundei 4 (`runde/4/critic.md`): din cele 4 GRAV ale rundei 3, ÎNCHISE GRAV 3, A1, A2; DESCHIS N4 (fereastra Open
  lipsește: Browse = mesaj central, deși `referinte/uia_word.json › dialog.open` există). Noi pe unghiul tastatură: T1-T6.
  Total deschise: **7**. Nimic publicat (regula: criticul fără GRAV).
- Valul: runda 5 din 6. Runda 6 e ultima a valului Word; ce nu se închide acum rămâne pentru etapa C sau o rundă viitoare.
- O4 a coborât 120 → 101 în runda 4 (oracolele văd acum ferestrele de salvare).

## Ținta rundei 5 = cele 7 GRAV deschise din `runde/4/critic.md`, în ordinea asta (cea mai mare pagubă pentru elev întâi)
1. **T6** — alegerea cu tastatura dintr-o listă nouă (Enter pe un rând: Font Size, Save as type, Recent) produce evenimentul §4
   cu câmpul `activat` (ce rând), exact ca la mouse; asistentul §6.3 trece de pas și nu mai dă indiciul pe nedrept.
2. **N4 + T4** — fereastra Windows **Open** după `dialog.open` din referință: Browse din File › Open și Ctrl+F12 o deschid;
   alegerea unui fișier din conținut (`fisiere`) îl deschide; exercițiul `lectii/vii/m1-l03` :240 și atelierul :262 se duc
   la capăt. Etichetele de sistem sunt în română, ca în referință.
3. **T5** — Word fără document (după Ctrl+W › Don't Save): Ctrl+N face un document nou, „Blank document” la fel; restul
   comenzilor fără document: comportamentul din referință sau mesajul central standard (R12 „nu tace”).
4. **T1** — F12 pe un document deja salvat propune numele fișierului (criticul l-a verificat în Word real; citează-i rândul
   din `runde/4/critic.md` în `diferente.md`), deci „lasă același nume” (m1-l03:85) dă verificarea de la :192.
5. **T2** — salvarea peste un fișier existent: fereastra „already exists” are referință? Caut-o (`referinte/`,
   `surse_microsoft.md`, pagini Microsoft cu URL citat). Dacă nu: mesajul central standard (nu înlocuire tăcută) + rând în
   `de_verificat.md` pentru captură. Nu inventezi fereastra din memorie.
6. **T3** — după „PDF (*.pdf)”, zona PDF a ferestrei Save As după `dialog.FileSaveAs_pdf` (Optimize for, Options..., Open file
   after publishing) și tastele ei de acces; ce nu are comportament în referință dă mesajul central.
Constatările [FARA_REFERINTA] din `runde/4/critic.md` (tastarea cu lista Font Size deschisă; Tab care iese din fereastră; clicul în
caseta Font Size „1201”) le treci în `de_verificat.md` dacă nu sunt deja; nu le „repari” din memorie.

## Ce citești întâi
`D/contract.md` · `D/api_biblioteca.md` · `runde/4/critic.md` · `runde/4/raport_constructor.md` · `runde/4/diferente.md` ·
apoi codul din `aplicatii/` (Grep înainte de Read; `date/word.json` și `referinte/uia_word.json` NU se citesc întregi).

## Măsurarea
- Pasul 1 PRIMUL, în fundal: `python D/oracole/masoara.py --runda 5 --paralel 3` (~30-60 min). NU scrii sub `aplicatii/` până nu
  s-a terminat. Între pași: `--doar O4,O5,O9`. Pasul 7: măsurarea întreagă; orice oracol sau poartă crește → `git restore`.
- În NICIUN fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows (C:/Users/...): scrii „%TEMP%”.
- Proba ta: `runde/5/proba_grav.py` (înainte și după, ieșirile în json) + probele rundelor 4, 3, 2 ca regres
  (`runde/4/proba_grav.py`, `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`, `runde/2/proba_grav.py`).

## Ce NU faci (le face orchestratorul)
Pasul 8 (criticul) și pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii `runde/5/raport_constructor.md`
(numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, fișierele schimbate, fiecare GRAV: reparat cum + proba + rezultatul) și
`runde/5/gata_pentru_critic.md` (doar unde e ce și cum se deschide poligonul). Fără commit, fără push. Atingi doar `aplicatii/`
(plus notele tale în `runde/5/`, `de_verificat.md`, `de_aprobat.md`). Lecțiile, jocurile, `jocuri/_motor/`, referințele,
oracolele și `api_biblioteca.md` NU.

## Economia contextului (OBLIGATORIU — rundele 1-4 au trecut de 300k, runda 4 a ajuns la 450k)
La ~200k de context te oprești la o graniță curată (după un GRAV terminat și probat), scrii `runde/5/stare_autor.md` (ce e gata,
ce urmează, ce fișiere, ce numere, ce măsurătoare rulează) și raportezi „PREDARE”. Orchestratorul pornește un constructor proaspăt
care continuă de acolo. Ieșirile mari de Bash în fișier, în context doar coada. Un GRAV terminat bine valorează mai mult decât
patru începute.
