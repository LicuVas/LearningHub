# Runda 4 · etapa B · Word · ȚINTA (pasul 3)

## Numerele care au ales ținta
- Oracolele după runda precedentă (`runde/3/masurare.json`, după runda `acoperire`): O1=61, O2=13392, O3=20337, O4=120,
  O5=154, O6=0, O7=353, O8=102, O9=41; porți 41 (cum_fac 41, restul 0). Pornirea rundei 4: `masurare_inainte.log` /
  `masurare.json` (pasul 1, rulat întâi, în fundal).
- Criticul rundei 3 (`runde/3/critic.md`): **4 GRAV deschise** — GRAV 3 (Font Size ▾), N4 (m1-l03), A1, A2. Au ÎNTÂIETATE
  (promptul, pasul 3; `runde/supliment_B_word_runda4.md`).
- Pe suprafețele lor, O3 (puncte, `runde/3/acoperire_word.md`): FileSaveAs_pdf 379, open 309, FileSaveAs_tip 120,
  FontSize 113, save_your_changes 57, save_this_file 50, Open_rand_recent 8. O4 vede GRAV-urile în 7 scenarii:
  `word-ctrl-w-nesalvat` (5 diferențe), `word-ctrl-s-document-nou` (2), `word-ctrl-o` (1), neexecutabile
  `word-salvare-pdf` (3), `word-x-nesalvat-cancel` (3), `word-ctrl-w-nu-salva` (3), `word-font-size-lista` (2) = 19 din 120.
  Lecțiile: `lectii/vii/m1-l03` (salvez / închid / deschid), `lectii/vii/m2-l10` (Font Size, `:152`, `:238`, `:242`).
- Proba mea pe pornire (`proba_grav_inainte.json`, 22 de cazuri): **20 picate** (trec doar regresul Ctrl+A + 14 și Esc).

## Ținta, în ordine (suplimentul orchestratorului)
1. **A1** — caseta Save as type ARATĂ alegerea; lista = cele 17 rânduri din `lista.FileSaveAs_tip`; ținta `camp:tip_fisier`;
   `stare().tip_salvare_afisat`.
2. **A2** — Save As desenează textul din referință: „Documente” în bara de adrese, antetele coloanelor, panoul din stânga cu
   implicitele Windows (`lista.FileSaveAs_navigare`), fără elementele personale.
3. **N4** — Ctrl+W / ✕ pe document modificat → „Save your changes to this file?” (More options…, Save, Don't Save, Cancel);
   Ctrl+S pe document nou → „Save this file” refăcută după `dialog.save_this_file` (închide A2-1); Ctrl+O →
   `stare().pagina_backstage`; parametri de CONȚINUT: `{nume, folder, salvat, modificat, fisiere, recente}`; conținutul
   fișierelor salvate în `stare().fisiere`.
4. **GRAV 3** — lista Font Size din `lista.FontSize` (16 rânduri); rândul ales aplică mărimea (`word-font-size-lista`);
   Alt+↓ / ↓ / Enter / Esc pe listă (unghiul gest_tastatura). Clicul în casetă („1120”) rămâne la AC-1.

## Fișierele pe care le deține runda (doar acestea se modifică)
- `C:/00/Projects/LearningHub_fidel/aplicatii/word.js`
- `C:/00/Projects/LearningHub_fidel/aplicatii/panglica.js` (doar SplitButton-ul cu nume în ferestre, A2)
- `C:/00/Projects/LearningHub_fidel/aplicatii/aplicatii.css` (lista desenată din referință, textul mare al ferestrelor Office)
- `C:/00/Projects/LearningHub_fidel/aplicatii/date/word.json` — REGENERAT cu `aplicatii/_unelte/genereaza_word.py` din
  referința înghețată (cheile noi ale rundei `acoperire`); nu se editează de mână
- notele mele: `runde/4/*`, `de_verificat.md` (secțiunea RUNDA4-WORD), `de_aprobat.md` (A2-1, dacă se închide)
- NEatinse: lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, `api_biblioteca.md`.
