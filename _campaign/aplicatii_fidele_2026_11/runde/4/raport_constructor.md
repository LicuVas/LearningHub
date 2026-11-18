# Runda 4 · etapa B · Word — raportul constructorului (pașii 1-7; criticul și publicarea sunt ale orchestratorului)

## Numerele întâi
| | pornire (`masurare_pornire.json`, pasul 1, 00:34) | după (pasul 7, `masurare_dupa.log`) |
|---|---:|---:|
| O1 central | 61 | 61 |
| O2 identic | 13392 | 13392 |
| O3 interfața | 20337 | 20337 |
| O4 comportament | 120 | **101** |
| O5 evenimente | 154 | 154 |
| O6 sarcini | 0 | 0 |
| O7 text UI | 353 | 353 |
| O8 comenzi moarte | 102 | 102 |
| O9 asistare | 41 | 41 |
| porți | 41 (cum_fac 41, restul 0) | 41 (aceleași: cum_fac 41, restul 0) |
| repere.lock | ok, 0 neconcludente | ok, 0 neconcludente; regres față de pornire: niciunul (n cu n) |
| **proba celor 4 GRAV** (`proba_grav.py`, 25 de cazuri) | **20 picate din 22** (`proba_grav_inainte.json`; cele 3 cazuri `k_*` adăugate după) | **0 picate din 25** (`proba_grav_dupa.json`) |
| proba rundei 3 ca regres (19 cazuri) | 2 picate (Ctrl+W, ✕ — lăsate pe mesaj în runda 3) | **0 picate** (`proba_r3_regres_dupa.json`) |
| proba rundei 2 ca regres | — | **0 picate** (`proba_r2_regres_dupa.json`) |
| telefon 390 px, atingeri (`proba_telefon.py`, I1) | — | **0 picate din 4** (✕ → Cancel / Don't Save, Font Size ▾ → 20, Save as type → PDF) |
| suma măsurată | 34601 | **34582** |

O4 120 → 101: cele 7 scenarii ale GRAV-urilor trec acum toate (`word-ctrl-o`, `word-ctrl-s-document-nou`,
`word-ctrl-w-nesalvat`, `word-ctrl-w-nu-salva`, `word-font-size-lista`, `word-salvare-pdf`, `word-x-nesalvat-cancel`:
19 puncte → 0); niciun alt scenariu nu și-a schimbat verdictul (comparat scenariu cu scenariu, `iesiri/O4`).
O3 nu se mișcă: măsoară paginile lecțiilor, care încă nu încarcă biblioteca (etapa C).

## Fiecare GRAV: cum, proba, rezultatul
Proba: `runde/4/proba_grav.py` — server static pe 127.0.0.1 (port liber), Chromium headless, rută doar locală;
`page.mouse` / `page.keyboard`; citește `stare()`, textul vizibil (noduri + valoarea casetelor), mesajele centrale și
evenimentele. Ce cere fiecare caz vine din `uia_word.json` și `scenarii_real/word-*.json`.

1. **A1 — Save as type.** Caseta poartă `camp:tip_fisier`; clicul pe ea (sau pe ▾, sau Alt+↓) deschide lista desenată din
   `lista.FileSaveAs_tip` (17 rânduri, sub casetă, cât ea de lată); rândul ales se scrie în `input`-ul vizibil;
   `stare().tip_salvare_afisat` = valoarea citită din casetă. Tastatura: ↓/↑ mută rândul ales, Enter alege, Esc închide
   lista. Doar .docx și PDF au efect la Save; celelalte 15 rânduri se pot alege, dar Save dă mesajul central (AC-9).
   Cazuri: `a1_lista_17`, `a1_caseta_arata_pdf`, `a1_scenariu_pdf` (= rezultatul real: `["Orar.pdf"]`, `nume_fisier`
   null), `a1_tastatura_jos_enter` — picau înainte, trec după.
2. **A2 — Save As desenată cu text.** `panglica.js`: în ferestre, un SplitButton cu ≥ 50 px rămași după copii își scrie
   numele, copilul e săgeată → „Documente” în bara de adrese, „Nume / Data modificării / Tip / Dimensiune” (Detalii și
   Toate locațiile rămân pictograme, ca în referință). Panoul din stânga: Acasă, Galerie, Acest PC, Rețea din
   `lista.FileSaveAs_navigare` (locul rândurilor e al nostru, AC-6). Cazuri `a2_*`: picau, trec.
3. **N4 — salvez / închid / deschid.**
   - Ctrl+W și ✕ pe document modificat → „Save your changes to this file?” desenată din referință (textul mare,
     File name, Save as type, Choose a Location, More options…, Save, Don't Save, Cancel); Cancel / ✕-ul ferestrei →
     rămâne; Don't Save → Word gol, titlul „Word”, `documente_deschise` 0; Save → salvat, apoi închis. Document
     nemodificat → se închide fără întrebare (D17, AC-4). ✕ pe ultimul document → Word se închide (AC-5).
   - Ctrl+S pe document nou → `dialog.save_this_file` din referință (numele fără „.docx”, tipul vizibil, Cancel); More
     options… → File › Save As. Fereastra inventată (`cuSalvareNoua`) scoasă — A2-1 din `de_aprobat.md` așteaptă criticul.
   - `stare()`: `pagina_backstage`, `dialog`, `documente_deschise`, `titlu_fereastra`, `tip_salvare_afisat`,
     `fisiere_salvate` (nume ordonate), `nume_fisier` null pentru document nesalvat.
   - **Parametri de CONȚINUT noi** (pentru `api_biblioteca.md` §7, la o rundă `acoperire`): `nume`, `folder`
     (implicit „Documente”), `salvat`, `modificat`, `fisiere: [{nume, folder?, text: [...]}]`, `recente: [{nume,
     folder?}]`; chei noi în `stare()`: `fisiere` (`[{nume, folder, tip, text}]` = conținutul fișierelor, cele din
     conținut + cele salvate) și `recente`. Ctrl+S pe document salvat scrie textul în același fișier. Recent arată
     fișierele din conținut (+ cel salvat, primul), clicul deschide fișierul.
   - Cursorul implicit (conținut fără `cursor` / `selectie`) = capătul documentului, ca rulatorul real
     (`referinte/ruleaza_real.py`).
   - Cazuri `n4_*` (11): picau toate, trec toate, inclusiv drumul lecției m1-l03:212 (Ctrl+W → Save → Ctrl+O → Recent →
     redeschis cu „Miercuri: desen”).
4. **GRAV 3 — Font Size ▾.** ▾ deschide lista din `lista.FontSize` (16 rânduri, sub casetă); rândul ales = mărimea pe
   selecție; Alt+↓ în casetă deschide aceeași listă; ↓ / Enter / Esc ca la A1. Cazuri `g3_lista_clic_20_word365` /
   `_word2007` (= rezultatul real `word-font-size-lista`), `g3_alt_jos_tastatura`, `g3_esc_inchide`, regres Ctrl+A + 14.
   Clicul de mouse în casetă („1120”) NEATINS: fără referință și fără pagină Microsoft (AC-1).
5. **În plus, unghiul gest_tastatura:** tastele de acces ale ferestrelor din referință (`tasta_acces`): Alt+S (Save),
   Alt+N (Don't Save / File name), Alt+T (Save as type), cu eveniment `tasta_acces`. Cazuri `k_*` (3): trec.

## Fișierele schimbate (exact)
- `aplicatii/word.js`, `aplicatii/panglica.js`, `aplicatii/aplicatii.css` — prin `runde/4/repara_r4.py` (înlocuiri exacte,
  bucățile în `runde/4/piese_r4/`); `git diff --stat -- aplicatii`: 4 fișiere, +437 / −98.
- `aplicatii/date/word.json` — regenerat cu `aplicatii/_unelte/genereaza_word.py` din referința înghețată (16 chei noi ale
  rundei `acoperire`); `--verifica` = 0.
- Note: `runde/4/` (cadru, tinta, contra, diferente, probele, capturile `capturi/`, măsurările), `de_verificat.md`
  (RUNDA4-WORD: AC-4 … AC-10), `de_aprobat.md` (notă la A2-1).
- NEatinse: lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, `api_biblioteca.md`. Fără commit, fără push.

## FĂCUT / NEFĂCUT / NESIGUR
**FĂCUT** — A1, A2, GRAV 3, N4 (tot ce are referință + parametrii de conținut ceruți): proba 0/25 picate (înainte 20/22),
O4 120 → 101, regresul rundelor 2 și 3: 0 picate.
**NEFĂCUT** — (1) „Documente” din panoul stâng al ferestrei Save As: nu e în referință (scos ca personal) → folderul tot
nu se poate alege (deblocator: AC-6 sau o captură din laborator). (2) Întrebarea „already exists” (m1-l03:158, 167) și
fereastra Open (Browse): fără referință construită. (3) Pașii 8-9: ai orchestratorului.
**NESIGUR** — [NEVERIFICAT], în `de_verificat.md`: AC-4 (nemodificat → fără întrebare), AC-5 (document salvat + Ctrl+W;
✕ + Don't Save închide Word; More options… în „Save your changes…”), AC-6 (locul rândurilor din panoul stâng), AC-7
(Recent: nume fără extensie, salvatul urcă primul, a doua fereastră), AC-8 (caseta mică din „Save this file” arată
valoarea din referință tăiată la 41 px: „Wo…”), AC-9 (celelalte 15 tipuri), AC-10 (rândul marcat la deschiderea listei),
AC-3 (Enter = Save în ferestrele Office). Textul mare al ferestrelor Office: locul lui e al nostru (MĂRUNT, D25).

## Concluzia
Cele 4 GRAV ale criticului 3 se reproduceau toate pe pornire (20 din 22 de cazuri picate). După reparație niciun caz nu
pică, iar cele 7 scenarii reale care le judecă trec la O4. Ce rămâne deschis pe m1-l03 (alegerea folderului, „already
exists”, Browse) n-are referință și e scris în `de_verificat.md`. Un GRAV se închide doar când criticul rundei 5 îl
confirmă cu citat.
