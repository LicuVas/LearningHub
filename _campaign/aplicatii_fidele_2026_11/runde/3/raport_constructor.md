# Runda 3 · etapa B · Word — raportul constructorului (pașii 1-7; criticul și publicarea sunt ale orchestratorului)

## Numerele întâi
| | pornire (`masurare_pornire.json`, pasul 1) | după (pasul 7, `masurare_dupa.log`) |
|---|---:|---:|
| O1 central | 61 | 61 |
| O2 identic | 13392 | 13392 |
| O3 interfața | 18546 | 18546 |
| O4 comportament | 98 | 98 |
| O5 evenimente | 154 | 154 |
| O6 sarcini | 0 | 0 |
| O7 text UI | 355 | 355 |
| O8 comenzi moarte | 102 | 102 |
| O9 asistare | 41 | 41 |
| porți | 41 (cum_fac 41; test_joc 0, controale_taiate 0, fereastra_mica 0, date_personale 0, word2007_j2 0) | 41 (aceleași: cum_fac 41, restul 0; date_personale 0) |
| repere.lock | ok, 0 neconcludente | ok, 0 neconcludente; regres față de pornire: niciunul; `ingheata.py --verifica` → 0 (INTACT, 306) |
| **proba celor 5 GRAV** (`proba_grav.py`, 19 cazuri) | **17 picate** (`proba_grav_inainte.json`) | **2 picate** (`proba_grav_dupa.json`): Ctrl+W și ✕, lăsate VOIT pe mesajul central (fără referință, D9) |
| proba rundei 2 ca regres (`runde/2/proba_grav.py`, 12 cazuri) | — | **0 picate** (`proba_r2_regres_dupa.json`) |

Oracolele O1-O9 nu măsoară gesturile acestor GRAV (sunt gesturi de tastatură, telefon și ferestre pe care scenariile
înghețate nu le fac); dovada reparației e proba de mai sus, dovada că nu s-a stricat nimic e măsurarea întreagă.

## Fiecare GRAV: cum l-am reparat, ce probă am rulat, rezultatul
Proba (`runde/3/proba_grav.py`): server static pe worktree legat de 127.0.0.1 (port liber), Chromium headless, ruta
abandonează tot ce nu e 127.0.0.1/localhost; tastele cu `page.keyboard`, clicurile cu `page.mouse`, telefonul în context
tactil la 390 px cu `page.touchscreen` și CDP `Input.imeSetComposition` / `Input.insertText`. Se citesc `stare()`, ecranul
(bara de titlu), mesajele `[data-lh-nesimulat]`, `window.__lhAplicatieEv` și `pas()` al asistentului.

1. **N1 — bara de titlu după salvare.** `word.js` › `salveaza()` cheamă `actualizeazaPanglica()` după ce închide fereastra.
   Probe `n1_f12_enter`, `n1_f12_clic`, `n1_ctrls_enter`, `n1_ctrls_clic`: înainte titlul `["Document1 - Word"]` cu
   `nume_fisier` salvat; după, imediat (80 ms) `["Marin_Ioana_7B_poezie - Word"]` pe toate 4 drumurile.
2. **N2 — Enter în File name = salvare.** `word.js`: ascultătorul `keydown` al stratului (care salva înaintea rădăcinii) e
   scos; Enter într-un câmp al ferestrei se tratează în `I.la.tasta` = butonul implicit (Save = `id_win32 1` = IDOK în
   `uia_word.json`; pagina Microsoft „Dialog Box Keyboard Interface”, D2). `aplicatii.js`: la taste în câmp, ținta e
   focusul din MOMENTUL tastei; evenimentul poartă și `activat: 'dialog_salvare:Save'`, iar asistentul (§6.3) primește
   `activat` ca pe `tinta`. Probe `n2_f12_enter`, `n2_ctrls_enter` (asistent Save → Bold): înainte
   `tasta_enter/tasta_enter/document`, `pas() = 0`, bula pe Save; după `tasta_enter/salvare/camp:nume_fisier`,
   `pas() = 1`, nicio bulă pe fereastra închisă.
3. **GRAV 3 — Font Size ▾.** `word.js` › `CMD.FontSize`: pe săgeată (fără `input`) → mesajul central „Font Size ▾ …
   aici nu e simulată”; Alt+↓ în casetă → același mesaj (pagina Microsoft a scurtăturilor: „Open the menu for the
   selected button. | Alt+Down arrow key”). Lista NU (rândurile nu sunt în referință, R2-1). Probe `g3b`, `g3f`: înainte
   niciun mesaj, nicio listă (`camp` tăcut); după mesajul `data-lh-nesimulat="Font Size ▾"`. Regres `g3a` (clic,
   Ctrl+A, 14, Enter → mărimea 14): trece înainte și după.
4. **N3 — cuvântul aflat în compunere (telefon).** `aplicatii.js`: (a) la `compositionend` textul pleacă SINCRON (plus o
   verificare amânată, cu caseta goală nimic nu pleacă de două ori); (b) un ascultător `pointerdown` pe `window` (faza de
   captură, deci înaintea aplicației) scoate caseta din focus cât compune — Chromium încheie compunerea și cuvântul intră
   în document înainte ca atingerea să mute cursorul; plasă: dacă browserul nu încheie compunerea, biblioteca trimite ea
   textul; (c) cuvântul intrat redesenează documentul, deci `pointerdown`-ul aplicației ia elementul nou din același punct
   (altfel atingerea nu mai muta cursorul — găsit de probă). Probe: `n3a` (compun „Ion”, ating „Verifică” din afara
   aplicației) înainte `la_clic ["Numele: "]`, după `["Numele: Ion"]`; `n3b` atingere / clic în rândul 2 apoi spațiu:
   înainte `["Ana are ", "Doi "]` (cuvântul PIERDUT), după `["Ana are mere", "Doi "]`; `n3c` atingere pe Bold: înainte
   `["Numele:  "]`, după `["Numele: Ion "]`. Regres GRAV 1 (`g1a`, fără dublare): `["Ana are"]` înainte și după;
   proba rundei 2 (G1a, G1b, G6…): 0 picate.
5. **N4 — drumul lecției m1-l03 (PARȚIAL).** `word.js`: Ctrl+O → Backstage, pagina Open (pagina Microsoft „open files
   from the file menu”; `word2007` → mesajul central); „Save as type:” ▾ → lista cu EXACT rândurile citate, „Word
   Document (*.docx)” și „PDF (*.pdf)”; Save cu PDF → `stare().fisiere_salvate` primește `<nume>.pdf` în Documente, iar
   documentul deschis rămâne cel de lucru [NEVERIFICAT R3-2]; `stare().folder_fisier` = folderul ferestrei Save As citit
   din referință („Adresă: Documente”). Probe: `n4_ctrl_o` înainte mesajul „Ctrl+O … nu e simulată”, după pagina
   `backstage.Open` vizibilă; `n4_tip_pdf` înainte „„Deschidere” … nu e simulată”, după rândul PDF ales și
   `Popescu_Ana_7A_orar.pdf` salvat; `n4_folder_in_stare` înainte fără cheie, după `folder_fisier: "Documente"`.
   **Rămân pe mesajul central (fără referință, NU construite):** Ctrl+W, ✕, fereastra „Save your changes to this file?”
   (`n4_ctrl_w`, `n4_inchidere_x` pică înainte și după) și etichetele panoului din stânga al ferestrei Save As (D8, D9;
   `de_verificat.md` R3-3, R3-4).

## Fișierele schimbate (exact)
- `C:/00/Projects/LearningHub_fidel/aplicatii/word.js`, `C:/00/Projects/LearningHub_fidel/aplicatii/aplicatii.js`
  (prin `runde/3/repara_r3.py`, 13 înlocuiri exacte; `git -C C:/00/Projects/LearningHub_fidel diff --stat -- aplicatii`:
  2 fișiere, +124 / −19 la aplicare).
- Notele: `runde/3/` (`cadru.md`, `tinta.md`, `contra.md`, `diferente.md`, `proba_grav.py`, `proba_grav_inainte.json/log`,
  `proba_grav_dupa.json/log`, `proba_r2_regres_dupa.json/log`, `repara_r3.py`, `masurare_pornire.json`,
  `masurare_inainte.log`, `masurare_dupa.log`, `masurare.json`, `iesiri/`, acest raport, `gata_pentru_critic.md`);
  `de_verificat.md` (secțiunea RUNDA3-WORD, R3-1…R3-9).
- NEatinse: lecțiile, jocurile, `jocuri/_motor/`, reperele înghețate, `de_aprobat.md`. Fără commit, fără push.

## FĂCUT / NEFĂCUT / NESIGUR
**FĂCUT** — N1, N2, GRAV 3, N3: reparate și probate (cazurile lor: 0 picate după, toate picau înainte); N4: Ctrl+O,
Save as type ▾ (PDF), folderul în `stare()`; regresul GRAV 1 și cele 12 cazuri ale rundei 2 trec.
**NEFĂCUT** — (1) N4 Ctrl+W, ✕ și fereastra „Save your changes…”: fără referință (deblocator: captura `de_verificat.md`
R3-4, într-o rundă `acoperire`). (2) Panoul din stânga al ferestrei Save As: etichetele nesalvate în referință (R3-3).
(3) Lista Recent din pagina Open cu fișierele lecției (parametru de CONȚINUT, ex. `continut.recente`) și deschiderea unui
document din ea: neconstruite — drumul „Ctrl+O, apoi Popescu_Ana_7A_orar din Recent” încă nu se poate duce până la capăt.
(4) Pașii 8-9 (criticul, commit, publicare): ai orchestratorului.
**NESIGUR** — (1) N3 e probat cu IME emulat prin CDP pe Chromium; pe telefonul real tastatura poate clipi când caseta iese
o clipă din focus, iar Safari poate ordona altfel evenimentele (R3-9). (2) Câmpul `activat` din eveniment și regula
asistentului care îl primește ca pe `tinta` sunt o completare a §4 / §6.3 din `api_biblioteca.md` (de scris de
orchestrator, ca `tasta_acces` din runda 2). (3) Save cu PDF: documentul rămâne cel .docx [NEVERIFICAT R3-2]; doar
două rânduri în lista Save as type [R3-1]. (4) Caseta „Save as type:” nu-și arată valoarea pe ecran nici înainte, nici
după (copilul Text din referință are `vizibil: false`) — MĂRUNT de aspect, neatins în runda asta.

## Concluzia
Cele 5 GRAV ale criticului rundei 2 se reproduceau pe pornire (17 din 19 cazuri picate). După reparație pică doar 2,
Ctrl+W și ✕, lăsate voit pe mesajul central fiindcă fereastra „Save your changes…” și Word fără document nu au referință.
N1, N2, GRAV 3 și N3 sunt reparate pe toate drumurile probate; N4 e reparat PARȚIAL (Ctrl+O, Save as type › PDF, folderul în
`stare()`), restul așteaptă capturile R3-3 / R3-4 și parametrul de conținut pentru lista Recent. O1-O9 și porțile nu se
mișcă (nici în sus, nici în jos), reperele sunt intacte. Un GRAV se închide doar când criticul rundei 4 îl confirmă cu citat.
**GATA_PENTRU_CRITIC**
