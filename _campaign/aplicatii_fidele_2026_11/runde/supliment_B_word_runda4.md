# Supliment la promptul rundei 4 (valul B-word) — scris de orchestrator, 19.11.2026

Se citește DUPĂ `runde/4/prompt.md` și are întâietate acolo unde îl completează (nu-l contrazice la reguli).

## Unde suntem
- Biblioteca `C:/00/Projects/LearningHub_fidel/aplicatii/` (schelet + Word) e COMISĂ local pe `fidelitate-aplicatii` (ultimul
  commit al bibliotecii: d3dfe36f, runda 3; nepublicată) — `git restore` pe fișierele tale funcționează la pasul 7.
- Criticul rundei 3 (`runde/3/critic.md`): **GRAV 4** deschise — GRAV 3 (Font Size ▾), N4 (lecția m1-l03), A1, A2.
- Valul a stat pe PLATOU în rundele 1-3 (`runde/3/raport.md`); o rundă `acoperire` (agent separat, Word REAL pe desktopul
  ascuns) l-a deblocat: `runde/3/acoperire_word.md`. Referințe noi în `referinte/uia_word.json` (cheile `dialog.save_this_file`,
  `dialog.save_your_changes_to_this_file`, `dialog.open`, `dialog.FileSaveAs_pdf`, `backstage.Open_rand_recent`, `lista.*`
  — FontSize 16 rânduri, Save as type 17 rânduri, Bullets/Numbering/Borders/… — plus blocul `acoperire_r3` cu faptele),
  10 scenarii noi în `scenarii/word/` (9 cu rezultat real în `referinte/scenarii_real/`), `api_biblioteca.md` completat
  (§3 `bara_titlu`, `camp:tip_fisier`; §4 `tasta_acces`, câmpul `activat`; §5 cheile noi; §6.3). Totul reînghețat.
- Numerele de pornire așteptate (le măsori tu la pasul 1): O3 20337, O4 120, O7 353, restul ca înainte; porți 41.
  Acum O4 VEDE GRAV-urile: `word-font-size-lista`, `word-ctrl-w-nesalvat`, `word-x-nesalvat-cancel`, `word-ctrl-w-nu-salva`,
  `word-ctrl-o`, `word-salvare-pdf`, `word-ctrl-s-document-nou`.

## Ținta rundei 4 = cele 4 GRAV din `runde/3/critic.md`, cu referința nouă, în ordinea asta
1. **A1** — după alegerea „PDF (*.pdf)” caseta Save as type ARATĂ „PDF (*.pdf)” (`word.js:1053-1058` scrie în nodul ascuns);
   lista are cele 17 rânduri din referință; `camp:tip_fisier` = țintă pe ecran (§3); `stare().tip_salvare_afisat` (§5).
2. **A2** — fereastra Save As desenează textul din referință: bara de adrese („Documente”), antetele coloanelor, panoul din stânga
   (implicitele Windows din referință; elementele personale NU) — `panglica.js:229`, `:303`.
3. **N4** — după referință: Ctrl+W și ✕ pe document cu modificări → fereastra „Save your changes to this file?” (More options…,
   Save, Don't Save, Cancel; Cancel → rămâne; Don't Save → Word rămâne deschis, gol); Ctrl+S pe document nou → fereastra reală
   „Save this file” refăcută după `dialog.save_this_file` (închide abaterea A2-1 din `de_aprobat.md`; numele propus fără
   „.docx”, tipul vizibil); Ctrl+O → `stare().pagina_backstage`. Pentru lecție: parametri de CONȚINUT (nu interfață redusă):
   documentul poate porni deja salvat, cu nume (`continut` — ex. `{nume, salvat:true}`), lista Recent a paginii Open din
   conținut (rândul după `backstage.Open_rand_recent`), iar conținutul fișierelor salvate apare în `stare()` (chei în plus
   sunt permise de §5). Documentează parametrii noi în raport (orchestratorul îi trece în `api_biblioteca.md` la o rundă `acoperire`).
4. **GRAV 3** — lista derulantă Font Size din panglică, cu cele 16 rânduri din `lista.FontSize`; rândul ales aplică mărimea pe
   selecție (scenariul `word-font-size-lista`). Clicul de mouse în casetă (cazul „1120”): referința lipsește (AC-1 în
   `de_verificat.md`) → nu-l „repari” din memorie; dacă găsești o sursă Microsoft cu URL care spune ce face clicul, citeaz-o în
   `diferente.md`, altfel rămâne la AC-1.
Ce nu are referință (AC-2 titlul cu extensie, AC-3 butonul apăsat de Enter în ferestrele Office) rămâne cum e, cu rând în
`de_verificat.md` dacă nu e deja.

## Ce citești întâi
`D/contract.md` · `D/api_biblioteca.md` · `runde/3/critic.md` · `runde/3/acoperire_word.md` · `runde/3/raport_constructor.md` ·
`runde/3/diferente.md` · apoi codul din `aplicatii/` (Grep înainte de Read; `date/word.json` și `referinte/uia_word.json` NU se
citesc întregi — extragi cheile de mai sus cu Python).

## Măsurarea
- Pasul 1 PRIMUL, în fundal: `python D/oracole/masoara.py --runda 4 --paralel 3` (~30-60 min). NU scrii sub `aplicatii/` până nu
  s-a terminat. Între pași: `--doar O4,O5,O9`. Pasul 7: măsurarea întreagă; orice oracol sau poartă crește → `git restore` pe
  fișierele tale.
- În NICIUN fișier pe care-l scrii nu pui căi cu numele utilizatorului Windows (C:/Users/...): scrii „%TEMP%”.
- Proba ta de gesturi pentru cele 4 GRAV: `runde/4/proba_grav.py`, rulată înainte și după, cu ieșirile în json; plus proba
  rundei 3 (`runde/3/proba_grav.py`) ca regres.

## Ce NU faci (le face orchestratorul)
Pasul 8 (criticul) și pasul 9 (commit, merge, push, nonce). Te oprești după pasul 7 și scrii `runde/4/raport_constructor.md`
(numerele înainte → după, FĂCUT / NEFĂCUT / NESIGUR, fișierele schimbate, fiecare GRAV: reparat cum + proba + rezultatul) și
`runde/4/gata_pentru_critic.md` (doar unde e ce și cum se deschide poligonul). Fără commit, fără push. Atingi doar `aplicatii/`
(plus notele tale în `runde/4/`, `de_verificat.md`, `de_aprobat.md`). Lecțiile, jocurile, `jocuri/_motor/`, referințele,
oracolele și `api_biblioteca.md` NU.

## Economia contextului (OBLIGATORIU — rundele 1-3 au trecut de 300k)
La ~200k de context te oprești la o graniță curată (după un GRAV terminat și probat), scrii `runde/4/stare_autor.md` (ce e gata,
ce urmează, ce fișiere, ce numere, ce măsurătoare rulează) și raportezi „PREDARE”. Ieșirile mari de Bash în fișier, în context
doar coada. Un GRAV terminat bine valorează mai mult decât patru începute.
