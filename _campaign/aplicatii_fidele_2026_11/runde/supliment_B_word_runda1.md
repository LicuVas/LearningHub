# Supliment la promptul rundei 1 (valul B-word) — scris de orchestrator, 18.11.2026

Se citește DUPĂ `runde/1/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## De ce runda 1 e altfel
Biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/` NU există încă. Runda 1 o construiește: scheletul comun (§1-§8 din
`D/api_biblioteca.md`) + aplicația Word, pe `aplicatii/poligon.html`. Ținta (pasul 3) = „biblioteca + Word”; fișierele rundei =
tot ce e sub `aplicatii/` (nimic altceva din sit). Lecțiile, jocurile și `jocuri/_motor/` NU se ating (mutarea e etapa C).

## Ce citești întâi (în ordinea asta)
`D/contract.md` · `D/api_biblioteca.md` (contractul API — îl respecți întocmai) · `D/oracole/CONVENTIE_ARBORE.md` (cum se
marchează interfața ca s-o vadă O1/O2/O3/O7/O8) · `D/oracole/CONVENTIE_RADACINA.md` · `D/oracole/_jucarie/aplicatii.js` și
`poligon.html` (implementarea-jucărie a API-ului: respectă §3-§7, NU e fidelă — modelul de urmat pentru mecanică) ·
`D/referinte/README_referinte.md` · `D/scenarii/word/*.json` (54) + `D/referinte/scenarii_real/word*.json` (47 word-* + 4 word2007-*: ce face Word real).

## Cum construiești (ca fidelitatea să vină din referință, nu din memoria ta)
1. Interfața Word se GENEREAZĂ din date: un script `aplicatii/_unelte/genereaza_word.py` citește referința înghețată
   `D/referinte/uia_word.json` (doar citire) și scrie `aplicatii/date/word.json` (file, grupuri, comenzi, idMso, tip de
   control, ordine, poziții relative la grup, bara de titlu, Acces rapid, bara de stare, meniurile de clic dreapta,
   File/Backstage, dialogurile din lecții). Nicio etichetă scrisă de mână; ce lipsește din referință rămâne lipsă și se
   notează. Pictogramele: SVG Fluent (MIT) — refolosește ce există în `jocuri/_motor/icoane*` / `panglica-*.js`
   (doar citire), copiate în `aplicatii/`; un buton fără pictogramă își spune numele prin `data-lh-eticheta`/`aria-label`.
2. Un singur motor de panglică comun (`aplicatii/panglica.js`), care va servi și Excel/PowerPoint în valurile următoare;
   Word aduce doar datele și comportamentul lui (`aplicatii/word.js`).
3. Comportamentul: modelul documentului din §5 (`stare()` cu TOATE cheile din `stare_citita` ale scenariilor Word) și
   „ecranul = starea” (§3). Profilurile `word365` (implicit) și `word2007` (Ctrl+Z literă cu literă, I4) din
   `aplicatii/profiluri/`. Comenzile de pe drumul scenariilor/lecțiilor se simulează; restul dau mesajul central
   standard cu `data-lh-nesimulat` (§3, R12). Evenimente §4 pe fiecare gest; asistentul §6; `tipMotor` §8.1.
4. `aplicatii/setari.json`, `aplicatii/versiune.json` (§2), `aplicatii/poligon.html` (§1; `?aplicatie=word`).
5. I1: la 360-390 px panglica se derulează lateral, nu se taie; zone de atins ≥ 32 px. I7: nicio captură Microsoft.

## Măsurarea
- Pasul 1 și pasul 7: `python D/oracole/masoara.py --runda 1 --paralel 3` (întreagă; durează). Între ele, ca să iterezi
  repede: `--doar O3,O4,O5,O8,O9` (măsurare PARȚIALĂ, nu ține loc de pasul 7). În raport: numerele întregi înainte → după,
  plus partea Word din detaliile fiecărui oracol (`runde/1/iesiri/<O#>/*.json`).
- O1/O2/O6/O7 depind de lecții (etapa C): pot rămâne mari în valul B; NU trebuie să crească.
- Autotestele oracolelor (`--autotest`) nu le rulezi ca să „treci” — ele probează oracolele, nu biblioteca.

## Ce NU faci în runda asta (le face orchestratorul)
- Pasul 8 (criticul rece) și pasul 9 (commit, merge, push pe proba). Tu te oprești după pasul 7 și scrii:
  `runde/1/raport_constructor.md` (FĂCUT / NEFĂCUT / NESIGUR, numerele, lista exactă a fișierelor create/schimbate) și
  `runde/1/gata_pentru_critic.md` (unde e ce, cum se deschide poligonul, ce ar trebui să încerce criticul).
- Nu faci commit, nu faci push.

## Economia contextului (obligatoriu)
- Fișierele mari (`uia_*.json` ~1 MB, `inventar.json`, `suprafete.json`, `verdicte_vechi.json`) NU se citesc întregi cu Read:
  extragi cu Python ce-ți trebuie. Ieșirile mari de Bash merg în fișier, în context doar coada.
- Dacă contextul tău trece de ~200k: te oprești la o graniță curată, scrii `runde/1/stare_autor.md` (ce e gata, ce urmează,
  ce fișiere, ce numere) și raportezi „PREDARE” — orchestratorul pornește un constructor proaspăt din nota ta.
