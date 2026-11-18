# Supliment la promptul rundei 3 (valul B-word) — scris de orchestrator, 18.11.2026

Se citește DUPĂ `runde/3/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## Unde suntem
- Biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/` (schelet + Word) e COMISĂ local pe `fidelitate-aplicatii` cu tot ce a
  făcut runda 2 (nepublicată) — `git restore` pe fișierele tale funcționează la pasul 7.
- Criticul rundei 2 (`runde/2/critic.md`): din cele 6 GRAV ale rundei 1, 5 ÎNCHISE, 1 DESCHIS (GRAV 3); plus 4 GRAV noi (N1-N4).
  Total deschise: 5. Nimic publicat. Un GRAV se închide DOAR când criticul rundei următoare confirmă, cu citat.
- Oracolele O4/O5/O9 nu s-au mișcat în runda 2 (98/154/41): gesturile reparate nu sunt în scenariile înghețate. Dovada reparațiilor
  = probele tale rulate (ca `runde/2/proba_grav.py`), cu gesturi reale pe poligon.

## Ținta rundei 3 (pasul 3) = cele 5 GRAV deschise din `runde/2/critic.md`, în ordinea asta
1. **N1** — după salvare (F12/Ctrl+S, apoi Enter sau Save) bara de titlu arată imediat noul nume (`word.js` `salveaza()` nu
   redesenează); lecția `lectii/vii/m1-l03` r. 133, 146 cere exact verificarea asta.
2. **N2** — salvarea cu Enter se raportează ca salvare (§4: `actiune`, ținta focusului), iar asistentul (§6.3) trece de pasul Save
   și nu lasă bula pe o fereastră închisă.
3. **GRAV 3 (vechi, rămas deschis)** — săgeata ▾ a casetei Font Size: fie deschide lista (doar dacă există referință pentru rândurile
   ei), fie dă mesajul central standard `data-lh-nesimulat` (R12: „nu tace”). Lecția m2-l10 r. 152, 238.
4. **N3** — telefonul: cuvântul aflat încă în compunere intră în document înainte de orice atingere în afara casetei de tastare
   (Verifică, alt rând, panglică) și `stare()` îl vede; fără să reapară dublarea literelor (GRAV 1 vechi — reia-i proba).
5. **N4** — drumul lecției `lectii/vii/m1-l03` (fișiere) până la capăt: Ctrl+W, ✕, Ctrl+O, „Save as type” ▾, folderul „Documents”
   din stânga ferestrei Save As, cheia de folder în `stare()` (§5 — chei în plus sunt permise; cele din `stare_citita` rămân).
   Fiecare comandă: comportamentul din referință (UIA / scenarii_real / pagină Microsoft cu URL citat în `diferente.md`) sau, fără
   referință, mesajul central standard + rând în `de_verificat.md`. Nu inventezi ferestre din memorie.
Constatările [FARA_REFERINTA] din `runde/2/critic.md` (clic în caseta Font Size care nu selectează valoarea → „1120”; valori greșite
fără mesaj; nume de fișier fără .docx / cu „/”; F12 pe document salvat) le treci în `de_verificat.md` dacă nu sunt deja; cea cu
„1120” o repari doar dacă găsești referință (Word real selectează conținutul casetei la clic — doar cu citat).

## Ce citești întâi
`D/contract.md` · `D/api_biblioteca.md` · `runde/2/critic.md` · `runde/2/raport_constructor.md` · `runde/2/diferente.md` ·
`runde/1/critic.md` (pentru proba GRAV 1/3) · apoi codul din `aplicatii/` (Grep înainte de Read; `date/word.json` și `uia_word.json`
NU se citesc întregi).

## Măsurarea
- Pasul 1 PRIMUL, în fundal: `python D/oracole/masoara.py --runda 3 --paralel 3` (~30-60 min). NU scrii sub `aplicatii/` până nu s-a
  terminat. Între pași: `--doar O4,O5,O9`. Pasul 7: măsurarea întreagă; orice oracol sau poartă crește → `git restore` pe fișierele tale.
- În NICIUN fișier pe care-l scrii (rapoarte, probe, jsonuri) nu pui căi cu numele utilizatorului Windows (C:/Users/...): poarta
  `date_personale` le numără (runda 2 a picat-o așa). Pentru temporare scrii „%TEMP%”.
- Scrie-ți proba ta de gesturi pentru cele 5 GRAV (`runde/3/proba_grav.py`, rulată înainte și după, cu ieșirile în json).

## Ce NU faci (le face orchestratorul)
Pasul 8 (criticul) și pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii `runde/3/raport_constructor.md`
(numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, fișierele schimbate, fiecare GRAV: reparat cum + proba + rezultatul) și
`runde/3/gata_pentru_critic.md` (doar unde e ce și cum se deschide poligonul). Fără commit, fără push. Atingi doar `aplicatii/`
(plus notele tale în `runde/3/`, `de_verificat.md`, `de_aprobat.md`). Lecțiile, jocurile, `jocuri/_motor/` și reperele NU.

## Economia contextului (OBLIGATORIU)
La ~200k de context te oprești la o graniță curată (după un GRAV terminat și probat), scrii `runde/3/stare_autor.md` (ce e gata, ce
urmează, ce fișiere, ce numere, ce măsurătoare rulează) și raportezi „PREDARE”. Ieșirile mari de Bash în fișier, în context doar coada.
