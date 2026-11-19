# Runda 5 · etapa B · Word — raportul constructorului (pașii 1-7; criticul și publicarea sunt ale orchestratorului)

## Numerele întâi
| | pornire (`masurare_pornire.json`, pasul 1) | după (pasul 7, `masurare_dupa.log`) |
|---|---:|---:|
| O1 central | 61 | 61 |
| O2 identic | 13392 | 13392 |
| O3 interfața | 20337 | 20337 |
| O4 comportament | 101 | 101 |
| O5 evenimente | 154 | 154 |
| O6 sarcini | 0 | 0 |
| O7 text UI | 353 | 353 |
| O8 comenzi moarte | 102 | 102 |
| O9 asistare | 41 | 41 |
| porți | 41 (cum_fac 41, restul 0) | 41 (aceleași) |
| repere.lock | ok, 0 neconcludente | ok, 0 neconcludente; regres față de pornire: niciunul (n cu n) |
| **proba celor 7 GRAV** (`proba_grav.py`, 18 cazuri) | **16 picate din 18** (`proba_grav_inainte.json`) | **0 picate din 18** (`proba_grav_dupa.json`) |
| regres: `runde/4/proba_grav.py` (25), `4/proba_telefon.py` (4), `3/proba_grav.py`, `2/proba_grav.py` | — | **0 picate** fiecare (`regres_*.log`) |
| suma măsurată | 34582 | 34582 |

Oracolele nu se mișcă: O2/O3/O7/O8 măsoară paginile lecțiilor (care încă nu încarcă biblioteca — etapa C), iar
scenariile O4 ale suprafeței trecuseră deja în runda 4. Dovada rundei e proba de gesturi, nu un oracol.

## Fiecare GRAV: cum, proba, rezultatul (toate în `aplicatii/word.js`, prin `repara_r5.py`)
1. **T6 — Enter în listă.** `tastaLista`: Enter pune `I.activat` = ținta rândului (`meniu:20`, `meniu:PDF (*.pdf)`).
   Caz `t6_font_size_tastatura_activat` (clic în casetă, Alt+↓, ↓×5, Enter → „are@20”, `activat meniu:20`, pas 1, fără
   indiciu) și `t6_save_as_type_tastatura_activat` (Alt+T, Alt+↓, ↓×6, Enter → pas 2; Enter → pas 3, `Orar.pdf`): picau, trec.
2. **N4 + T4 — fereastra Open.** Ctrl+F12 (citatul Microsoft „Ctrl+F12: displays the Open dialog box.” + `fapte.d_ctrl_f12`)
   și File › Open › Browse deschid `dialog.open` din referință. Rândurile listei = fișierele din conținut ale folderului
   curent (ținta `lista:<nume.ext>`, pe ecran fără extensie); clic = numele în File name; dublu clic / Open / Enter (`activat
   fereastra:Open`) / Alt+O = deschide; Cancel / Închidere / Esc = închide. Panoul stâng (și în Save As): implicitele din
   referință + câte un rând pentru folderele din conținut (Descărcări, Documente), clic = navigare (bara de adrese + lista).
   Cazuri `t4_*`, `n4_*` (6), inclusiv drumul `m1-l03:240` (Ctrl+O › Browse › Descărcări › dublu clic pe club-lectura):
   picau, trec. Captura `capturi/r5_open_descarcari.png`.
3. **T5 — Word fără document.** Ctrl+N și File › Blank document fac un document nou (documentul deschis rămâne în spate);
   fără document, comenzile panglicii și scurtăturile dau mesajul central (tastarea și săgețile rămân fără efect).
   Cazuri `t5_ctrl_n_document_nou`, `t5_blank_document`, `t5_fara_document_nu_tace` (B, F12, Ctrl+B): picau, trec.
4. **T1 — F12 pe document salvat** propune numele fișierului (`Popescu_Ana_7A_orar.docx`), ca în citirea COM a criticului
   (`runde/4/critic.md:104`); drumul `:189` dă `Popescu_Ana_7A_orar.pdf` (verificarea `:192`). Caz `t1_*`: pica, trece.
5. **T2 — nume existent.** Salvarea peste un fișier existent (.docx sau PDF) dă mesajul central „„X” already exists”,
   fișierul nu se atinge, fereastra rămâne deschisă; alt nume salvează. „Save your changes…” pe documentul salvat scrie tot
   în fișierul lui (AC-5, regresul `:212` trece). Fereastra reală n-are referință → `de_verificat.md` R5-3. Cazuri `t2_*`.
6. **T3 — zona PDF.** Alegerea „PDF (*.pdf)” redesenează fereastra din `dialog.FileSaveAs_pdf` (Optimize for: cu cele două
   radiouri, Options..., Open file after publishing; fără Save Thumbnail), cu numele scris și folderul păstrate; înapoi la
   .docx → `dialog.FileSaveAs`. Alt+E / Alt+A / Alt+M / Alt+O au eveniment `tasta_acces`; bifa și radiourile își schimbă
   starea; Options... = mesajul central. Cazuri `t3_*` (4). Captura `capturi/r5_saveas_pdf.png`.
- În plus (MĂRUNT, D2b): Shift+F12 = Ctrl+S („Shift+F12: saves the document.”).

## Fișierele schimbate (exact)
- `aplicatii/word.js` (29 de înlocuiri), `aplicatii/aplicatii.css` (3 reguli la capăt) — prin `runde/5/repara_r5.py`;
  `git diff --stat -- aplicatii`: 2 fișiere, +199 / −27.
- Note: `runde/5/` (cadru, tinta, contra, diferente, proba + ieșirile, capturile, măsurările, stare_autor),
  `de_verificat.md` (RUNDA5-WORD: R5-1 … R5-6).
- NEatinse: lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, `api_biblioteca.md`, `date/word.json`,
  `panglica.js`, `de_aprobat.md`. Fără commit, fără push.

## FĂCUT / NEFĂCUT / NESIGUR
**FĂCUT** — T6, N4, T4, T5, T1, T2, T3: proba 16/18 → 0/18 picate; regresul rundelor 2-4 și telefonul 0 picate; oracolele
și porțile neschimbate (niciun regres, lacăt ok).
**NEFĂCUT** — fereastra reală „already exists” (n-are referință; deblocator: captura R5-3). Pașii 8-9: ai orchestratorului.
**NESIGUR** — [NEVERIFICAT], în `de_verificat.md`: R5-1 (locul rândurilor Descărcări / Documente în panoul stâng; temeiul e
doar lista de nume implicite din `referinte/acoperire_word_r3.py:57`), R5-2 (numele „Document1” după Ctrl+N; comenzile fără
document — gri sau nu), R5-3 („already exists”, inclusiv peste documentul deschis chiar el), R5-4 / R5-5 ([FARA_REFERINTA]
ale criticului: tastare cu lista Font Size deschisă, Tab în ferestre), R5-6 (radioul ales la deschiderea zonei PDF).
Proba e scrisă de mine: un GRAV se închide doar când criticul rundei 6 îl confirmă cu citat.
