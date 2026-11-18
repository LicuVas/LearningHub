# Supliment la promptul rundei 2 (valul B-word) — scris de orchestrator, 18.11.2026

Se citește DUPĂ `runde/2/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## Unde suntem
- Runda 1 a construit biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/` (schelet §1-§8 + Word, pe `aplicatii/poligon.html`).
  Starea ei e COMISĂ local pe `fidelitate-aplicatii` (nepublicată), deci `git restore` pe fișierele tale funcționează la pasul 7.
- Instrumentele: o rundă `acoperire` a reparat O7 (judecă biblioteca doar pe paginile care o încarcă) și O4 (trece pe pagina
  veche când aplicația nu e încă în bibliotecă) — `runde/1/acoperire_instrumente.md`; `repere.lock` reînghețat.
- Criticul rece al rundei 1 a dat **GRAV: 6** (`runde/1/critic.md`). Nu s-a publicat nimic. Un GRAV se închide DOAR când criticul
  rundei următoare confirmă, cu citat, că e reparat.

## Ținta rundei 2 (pasul 3) = cele 6 GRAV din `runde/1/critic.md`, în ordinea asta
1. Tastatura de telefon cu compunere (Gboard/Samsung) dublează literele (`aplicatii.js` calea `input`): urmărești
   `compositionstart/compositionupdate/compositionend` și `beforeinput` (inputType), nu golești caseta în mijlocul compunerii.
   Proba: Playwright cu `Input.imeSetComposition`/`insertText` prin CDP (cum a făcut criticul), „ana are mere” → `stare().text` exact.
2. Tastele cu Backstage (File) sau un dialog deschis NU ajung în document: merg la suprafața deschisă (Esc o închide;
   tastele de acces din `uia_word.json › backstage.nav` — ex. Alt, F, A → Save As).
3. Font Size (caseta + lista) pe drumul lecției `lectii/vii/m2-l10` („alege 20”): tastat + Enter și ales din listă aplică mărimea
   pe selecție; Enter în casetă NU rupe paragraful; Alt, H, F, S duce focusul în casetă.
4. Ctrl+S pe document nou (lecția `lectii/vii/m1-l03:143`, „Save this file”): caută întâi o referință (`referinte/`, `surse_microsoft.md`,
   paginile Microsoft cu URL citat). Dacă nu există referință pentru fereastra „Save this file”: o simulezi DOAR din sursă Microsoft
   citată cu URL (scris în `diferente.md`), altfel o treci în `de_verificat.md` (captură) și în `de_aprobat.md` ca abatere propusă —
   nu inventezi o fereastră din memorie.
5. Tastele de acces (Alt, H, 1) NU fabrică `dublu_clic`: evenimentul §4 spune gestul real (tastă), iar numărătoarea greșelilor §6.3
   nu crește din clicuri sintetice.
6. Majuscula automată pe calea de telefon (`word.js` `scrie(v, false)`), ca în `scenarii_real/word-tastare-majuscula-automata.json`.
Apoi, dacă rămâne timp și context: cele 4 constatări [FARA_REFERINTA] din critic.md (tabel: săgeți, Enter în celulă; tastat peste
selecție aldină; Ctrl+A + Delete cu tabel) — doar cu referință; fără ea le treci în `de_verificat.md`, nu le „repari” din memorie.

## Ce citești întâi
`D/contract.md` · `D/api_biblioteca.md` · `runde/1/critic.md` · `runde/1/raport_constructor.md` · `runde/1/diferente.md` (al
constructorului 1 — tu ai voie să-l citești, criticul nu) · `runde/1/acoperire_instrumente.md` · apoi codul din `aplicatii/`
(Grep înainte de Read; `date/word.json` și `uia_word.json` NU se citesc întregi).

## Măsurarea
- Pasul 1 PRIMUL, în fundal: `python D/oracole/masoara.py --runda 2 --paralel 3` (~30-60 min; instrumentele s-au schimbat, deci
  pornirea se măsoară din nou). NU scrii sub `aplicatii/` până nu s-a terminat. Cât rulează, citești.
- Între pași: `--doar O4,O5,O9` (parțial). Pasul 7: măsurarea întreagă. Orice oracol sau poartă crește → `git restore` pe fișierele
  tale și scrii în `regres.md`.
- O1/O2/O3/O6/O7/O8 depind de lecții (etapa C): pot rămâne mari în valul B; NU trebuie să crească.

## Ce NU faci (le face orchestratorul)
Pasul 8 (criticul) și pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii `runde/2/raport_constructor.md`
(numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, lista exactă a fișierelor schimbate, fiecare GRAV: reparat cum + proba rulată)
și `runde/2/gata_pentru_critic.md` (doar unde e ce și cum se deschide poligonul). Fără commit, fără push. Lecțiile, jocurile și
`jocuri/_motor/` NU se ating; doar `aplicatii/`.

## Economia contextului (OBLIGATORIU — runda 1 a ajuns la 670k)
La ~200k de context te oprești la o graniță curată (după un GRAV terminat și probat), scrii `runde/2/stare_autor.md` (ce e gata, ce
urmează, ce fișiere, ce numere, ce măsurătoare rulează) și raportezi „PREDARE”. Ieșirile mari de Bash merg în fișier, în context doar coada.
