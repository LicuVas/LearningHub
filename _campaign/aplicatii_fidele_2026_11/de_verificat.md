# De verificat de profesor — ce nu se poate dovedi invizibil, pe calculator

Fiecare rând: ce faci pe un PC (cu Word / Excel / PowerPoint deschise de tine), ce notezi. Un minut fiecare.
Rezultatul îl scrii lângă rând (sau îl spui la raportul de dimineață); el devine referința reală a scenariului.

<!-- OFFICE:START (secțiunea scenariilor Office — scrisă de agentul „scenarii-office-real”, Etapa 0, 16.11.2026) -->
## Office (Word, Excel, PowerPoint)

Gesturi pe care nu le pot rula pe desktopul ascuns (tragerea urmărește butonul FIZIC al mouse-ului; Ctrl+C/Ctrl+V ar
scrie în clipboard-ul tău) și faptele care depind de PC-ul din laborator. Scenariul are același id în
`scenarii/<aplicație>/<id>.json`.

- [ ] `word-tragere-selectie` — Word: scrii „Al doilea paragraf”, clic chiar înainte de „Al”, ții apăsat și tragi până după „doilea”, lași → notezi exact ce e selectat (cu sau fără spațiul de după).
- [ ] `word-copiere-lipire` — Word: scrii „Ana are mere.”, selectezi „mere”, Ctrl+C, clic după punct, Ctrl+V → notezi textul exact, cu spațiile (ex. „Ana are mere.mere” sau „Ana are mere. mere”).
- [ ] `word-decupare-lipire` — Word: scrii „Aduceți apă. Plecăm luni.”, selectezi „Plecăm luni.”, Ctrl+X, clic înainte de „Aduceți”, Ctrl+V → notezi textul exact, cu spațiile.
- [ ] `word2007-ctrl-z-dupa-tastare` (+ `word2007-ctrl-z-abc`, `word2007-ctrl-z-ctrl-y-abc`, `word2007-ctrl-z-dupa-enter`) — Word 2007 din laboratorul VII: „Planul de luni”, Enter, „Mergem la film.”, Ctrl+Z de 3 ori → rămâne „Mergem la fi”? (apoi: „abc” + Ctrl+Z → „ab”?; „Titlu”, Enter, „Text”, Ctrl+Z ×2 → „Te”?). Word 365 de pe PC-ul tău șterge la primul Ctrl+Z tot „Mergem la film.” (tot ce ai tastat după ultimul Enter).
- [ ] `word-ctrl-z-dupa-tastare` — Word din laboratoarele cu Office NOU (VI, VIII), dacă e altul decât 2007: aceiași pași → ce rămâne după fiecare Ctrl+Z.
- [ ] `word-tastare-majuscula-automata` — Word din laborator: tastezi „ana are mere. el are pere.” → apar singure „Ana” și „El” cu majusculă? (pe PC-ul tău: da).
- [ ] `excel-tragere-umplere-gest` — Excel: A1 = 1, A2 = 2, selectezi A1:A2, tragi pătrățelul din colțul dreapta-jos până la A5 → notezi A3, A4, A5.
- [ ] `excel-tragere-zona` — Excel: clic pe B2, ții apăsat, tragi până la C4, lași → notezi ce arată caseta de nume și ce e colorat.
- [ ] `excel-zecimale-virgula` / `excel-zecimale-punct` — Excel din laborator: în B2 scrii 7,5 + Enter, în B3 7.5 + Enter → ce apare în fiecare? (pe PC-ul tău: 7,5 = număr; 7.5 = data „07.mai”).
- [ ] `excel-separator-punct-si-virgula` — Excel din laborator: A1 = 4, A2 = 5; în B1 scrii =SUM(A1;A2) + Enter → iese 9? (pe PC-ul tău: da, 9).
- [ ] `excel-autocompletare-tab` — Excel: A1:A3 = 4, 5, 6; în A4 scrii „=SU” și te uiți la lista care apare: ce funcție e evidențiată prima? Apeși Tab → ce scrie în celulă? (pe PC-ul tău, pe desktopul ascuns, formula „=SU” + Tab + „A1:A3)” + Enter NU a fost primită: Excel a rămas în editare; nu am putut vedea ce a completat Tab).
- [ ] `excel-separator-virgula` — Excel: A1 = 4, A2 = 5; în B1 scrii =SUM(A1,A2) + Enter → apare un mesaj? ce scrie în el? (pe PC-ul tău, invizibil: formula nu a fost primită, Excel a rămas în editare, nicio fereastră de mesaj găsită).
- [ ] `powerpoint-tragere-forma` — PowerPoint: tragi caseta titlului de pe diapozitivul 1 mai jos cu mouse-ul → rămâne pe același diapozitiv, cu același text? (se schimbă doar locul).
<!-- OFFICE:END -->

<!-- RUNDA1-WORD:START (scris de constructorul rundei 1, 18.11.2026 — ce NU am implementat fiindcă referința nu-l dovedește) -->
## Runda 1 · Word în biblioteca centrală — de lămurit (un minut fiecare, pe un PC cu Word)

Până la răspuns, simulatorul dă la aceste locuri mesajul central „În aplicația reală, „X” funcționează; aici nu e simulată.”
sau arată doar elementele dovedite. Detaliul: `runde/1/diferente.md`, partea B.

- [ ] **R1-1** Insert › **Pictures ▾**: rândurile, în ORDINE, pe Word-ul din laborator (pagina Microsoft dă This Device, Generate an Image, Stock Images, Online Pictures; simulatorul arată This Device, Stock Images, Online Pictures). Scenariul `word-imagine-inserare` ar trebui să aibă pasul „meniu: This Device” (azi apasă direct `mso:PictureInsertFromFile`, care nu e pe ecran → neexecutabil).
- [ ] **R1-2** Listele deschise (o captură UI Automation într-o rundă `acoperire`, sau o fotografie): Layout › **Margins ▾** și **Orientation ▾** (toate rândurile, nu doar „Narrow Margins”/„Landscape”), Insert › **Table ▾** (numele căsuțelor grilei + rândurile de sub ea, ex. „Insert Table...”), Home › **Bullets ▾**, **Numbering ▾**, **Borders ▾** (are „Borders and Shading...”?), **Change Case ▾**, **Line and Paragraph Spacing ▾**.
- [ ] **R1-3** Bara **Acces rapid** pe PC-urile din laborator: se vede? ce butoane are (Save, Undo, Redo…)? (pe PC-ul tău, în Word: ascunsă.)
- [ ] **R1-4** Comenzile afișate fără scenariu real, pe care le predă o lecție: pentru fiecare, un scenariu scurt (text de pornire, gestul, ce se citește). Primele: Strikethrough, Subscript, Superscript, Clear Formatting, Show All (¶), Format Painter, Font Color, Text Highlight Color.
- [ ] **R1-5** Scurtăturile, pe un document NOU nesalvat — ce FEREASTRĂ apare: **Ctrl+S** (File › Save As, „Save this file” sau Save As? Microsoft: „depending on the Word version”), **Ctrl+P**, **Ctrl+O**, **Ctrl+F**, **Ctrl+H**, **Ctrl+N**, **Ctrl+W**, **Ctrl+Enter**. (Ctrl+D, Ctrl+Shift+V și Ctrl+S pe document deja salvat: lămurite din pagina Microsoft a scurtăturilor, implementate.)
- [x] **R1-6** File › Save As › **Browse** → fereastra Save As (lămurit din support.microsoft.com/en-us/office/collab-files/save-your-files; implementat).
- [ ] **R1-7** File pe un document nou → ce pagină apare întâi (Home sau Info)?
- [ ] **R1-8** Clic dreapta pe text, ÎN AFARA selecției: cursorul se mută acolo înainte de meniu?
<!-- RUNDA1-WORD:END -->

<!-- RUNDA2-WORD:START (scris de constructorul rundei 2, 18.11.2026 — tastatura: ce am făcut fără referință de gest) -->
## Runda 2 · Word · tastatura — de lămurit (un minut fiecare)

Detaliul: `runde/2/diferente.md` (D1-D8). Până la răspuns, simulatorul face ce scrie în paranteză.

- [ ] **R2-1** Home › **Font Size ▾**: ce rânduri are lista, în ordine (o captură UI Automation într-o rundă `acoperire`, sau o fotografie). (Simulatorul: mesajul central „Font Size ▾ … nu e simulată”; mărimea se scrie în casetă + Enter.)
- [ ] **R2-2** Document NOU, **Ctrl+S**: fereastra „Save this file” — captură UI Automation (titlul, câmpurile, butoanele, ce scrie în File name și în Location pe PC-ul din laborator, ce face Esc). Apoi „More save options” → ce se deschide. (Simulatorul: File name cu prima linie a documentului, Location „Documente”, More save options → Save As, Save, Esc închide.)
- [ ] **R2-3** Pe un **telefon Android** (Chrome + Gboard sau Samsung Keyboard): pe poligon (`aplicatii/poligon.html?aplicatie=word`) tastezi „ana are mere. el are pere.” → ce scrie în document? Apoi lipești un cuvânt (apăsare lungă › Paste) la început de propoziție: primește majusculă? (Simulatorul: „Ana are mere. El are pere.”; lipirea fără majusculă.)
- [ ] **R2-4** Word: **Ctrl+D** (fereastra Font) → unde e cursorul (în caseta „Font:”? cu textul selectat?) și ce se întâmplă dacă tastezi „qw”. (Simulatorul: fereastra are focusul, tastele nu ajung în document; nu scriu în niciun câmp.)
- [ ] **R2-5** Word: selectezi un cuvânt, **Alt, H, F, S** → valoarea din Font Size e selectată? Tastezi „0” + Enter → ce mesaj apare? Tastezi „abc” + Enter? (Simulatorul: valoarea selectată; o valoare în afara 1-1638 / nu din 0,5 în 0,5 → caseta revine, fără mesaj.)
- [ ] **R2-6** Word: **Alt, F** → apar literele pe File/Backstage (H, N, O, I, S, A …)? Apoi **A** → pagina Save As cu literele ei (Y1, C, A, O …)? Apoi **O** → fereastra Save As? (Simulatorul: da, din `uia_word.json › tasta_acces`.)
- [ ] **R2-7** Word, tabel 2×2 (Nume / Punctaj / Ana / 9), cursorul în prima celulă: **↓** apoi „X” → unde apare X? **End, →** apoi „Y”? **Enter** în celulă apoi „Q”? (Simulatorul: ↓ nu iese din celulă, → rămâne la capătul celulei, Enter nu face nimic — criticul rundei 1, prin COM: `XAna`, `YPunctaj`, `Nume¶Q`; COM nu e gestul, deci nereparat.)
- [ ] **R2-8** Word: selectezi un cuvânt, **Ctrl+B**, apoi tastezi „XYZ” peste el → XYZ e aldin? (Simulatorul: nu; COM: da.)
- [ ] **R2-9** Word, document cu text + un tabel: **Ctrl+A**, **Delete** → mai rămâne tabelul? (Simulatorul: da; COM: nu.)
<!-- RUNDA2-WORD:END -->

<!-- RUNDA3-WORD:START (scris de constructorul rundei 3, 18.11.2026 — fișierele lecției m1-l03 și constatările [FARA_REFERINTA] ale criticului 2) -->
## Runda 3 · Word · salvez / închid / deschid — de lămurit (un minut fiecare)

Detaliul: `runde/3/diferente.md` (D1-D9). Până la răspuns, simulatorul face ce scrie în paranteză.

- [ ] **R3-1** Word, F12 → fereastra Save As → **Save as type ▾**: toate rândurile listei, în ordine (o captură UI Automation într-o rundă `acoperire`, sau o fotografie). (Simulatorul: doar „Word Document (*.docx)” și „PDF (*.pdf)”, singurele citate.)
- [ ] **R3-2** Word, document `Orar.docx` deschis: F12 → Save as type **PDF (*.pdf)** → Save → ce scrie apoi în bara de titlu (tot „Orar” = documentul .docx rămâne deschis?) și se deschide singur PDF-ul (bifa „Open file after publishing”)? (Simulatorul: titlul rămâne al documentului .docx; PDF-ul apare doar în `stare().fisiere_salvate`.)
- [ ] **R3-3** Word, F12 → fereastra Save As: ce scrie, în ordine, în **panoul din stânga** (Acasă, Desktop, Documente…?). (Simulatorul: panoul din referință are etichetele nesalvate; fereastra se deschide în Documente, citat din bara de adrese.)
- [ ] **R3-4** Word, document modificat nesalvat: **Ctrl+W** → captură a ferestrei care întreabă (titlul, textul, butoanele în ordine: Save / Don't Save / Cancel?) și ce rămâne după **Save** (Word deschis, fără document?). La fel cu **✕** din colțul ferestrei. Apoi, pe un document nemodificat: Ctrl+W închide fără întrebare? (Simulatorul: mesajul central „Ctrl+W … aici nu e simulată” / „Close …”.)
- [ ] **R3-5** Word: clic cu mouse-ul în caseta **Font Size** (nu Alt, H, F, S): valoarea „11” se selectează singură sau cursorul ajunge la capăt? Tastezi „20” + Enter → mărimea e 20 sau 1120? (Simulatorul: cursorul la capăt, „1120” — critic runda 2, [FARA_REFERINTA].)
- [ ] **R3-6** Word, Save As: nume **Pop.Mihai**, **Tema/1**, **Tema.doc** + Save → ce nume are fișierul (se adaugă .docx? „/” dă mesaj?). (Simulatorul: „Pop.Mihai” fără .docx, „Tema/1.docx” acceptat — critic runda 2, [FARA_REFERINTA].)
- [ ] **R3-7** Word, document deja salvat ca „Orar.docx”, al cărui prim rând e „Luni”: **F12** → ce scrie în File name: „Orar” sau „Luni”? (Simulatorul: primul rând — critic runda 2, [FARA_REFERINTA].)
- [ ] **R3-8** Word, document nou: **Ctrl+S** → „Save this file” → **More save options** → ce se deschide (fereastra Save As sau pagina File › Save As)? (Simulatorul: fereastra Save As — critic runda 2, [FARA_REFERINTA].)
- [ ] **R3-9** Pe un **telefon Android** (Chrome + Gboard, sugestii pornite), pe poligon: scrii „Ion” fără spațiu și atingi un buton din afara aplicației; apoi scrii „mere” la capătul unui rând și atingi alt rând → „mere” rămâne unde l-ai scris? Tastatura clipește (se ascunde și reapare) la atingere? (Simulatorul: cuvântul intră în document la atingere, caseta iese o clipă din focus — probat doar cu IME emulat prin CDP.)
<!-- RUNDA3-WORD:END -->

<!-- ACOPERIRE-R3:START (scris de agentul rundei `acoperire` după platoul B-word, 18.11.2026) -->
## Runda `acoperire` · Word — ce n-a putut fi dovedit invizibil (un minut fiecare)

Lămurite din Word-ul real (desktop ascuns, `referinte/acoperire_word_r3.py`), deci scoase din întrebări: R2-1 (lista Font
Size: 8 … 72, 16 rânduri), R2-2 / A2-1 (Ctrl+S pe document nou = fereastra „Save this file”: File name „Poezia mea”, caseta
mică Save as type, „Choose a Location”, More options…, Save, Cancel), R3-1 (Save as type: 17 rânduri), R3-4 (Ctrl+W și ✕ cu
modificări = „Save your changes to this file?”: More options…, Save, Don't Save, Cancel; Don't Save → Word rămâne deschis,
gol, titlul „Word”), R3-8 (More options… → pagina File › Save As), R1-7 (File pe document nou → Home), R1-2 (listele
Bullets, Numbering, Borders, Change Case, Line and Paragraph Spacing, Table, Margins, Orientation). Detaliul:
`runde/3/acoperire_word.md`.

- [ ] **AC-1** (`word-font-size-tastat`, = R3-5) Word: selectezi un cuvânt, dai **clic cu mouse-ul** în caseta **Font Size**
  (nu Alt, H, F, S): valoarea „11” se selectează singură? Tastezi 20 + Enter → mărimea e 20 sau 1120? (Pe desktopul ascuns
  clicul postat nu dă focusul casetei — încercat de 2 ori, 18.11; scenariul rămâne fără rezultat real.)
- [ ] **AC-2** Word pe un PC din laborator: salvezi un document nou cu F12 ca „Tema mea” → ce scrie sus, în bara de titlu
  („Tema mea - Word”, „Tema mea - Saved to this PC”, „Tema mea.docx - …”)? (Pe PC-ul tău: „Tema mea.docx  -  Saved to this
  PC”; extensia vine probabil din setarea ta „arată extensiile”, HideFileExt = 0.)
- [ ] **AC-3** Word, fereastra „Save this file” / „Save your changes…”: ce buton apasă **Enter** (Save?) și unde e cursorul
  când apare fereastra (în File name, cu numele selectat?). (UI Automation nu spune butonul implicit; Enter nu l-am încercat,
  fiindcă ar fi salvat în Documentele tale.) Și ce scrie sub „Documents” în „Choose a Location” pe PC-ul din laborator
  (pe al tău: „OneDrive - Personal”).
<!-- ACOPERIRE-R3:END -->

<!-- RUNDA4-WORD:START (constructorul rundei 4, 19.11.2026; detaliul: runde/4/diferente.md D17-D25) -->
## Runda 4 · Word · închid / deschid / liste — de lămurit (un minut fiecare)

Până la răspuns, simulatorul face ce scrie în paranteză.

- [ ] **AC-4** Word, document salvat și NEmodificat (sau unul nou, gol): **Ctrl+W** → se închide fără nicio întrebare?
  (Simulatorul: da, fără întrebare — pagina Microsoft a defectului „prompted to save … with no edits made”.)
- [ ] **AC-5** Word, document **deja salvat** („Orar.docx”) cu un rând nou: **Ctrl+W** → ce fereastră apare (aceeași „Save your
  changes to this file?” cu File name, sau alta, cu numele fișierului în întrebare?) și unde salvează **Save**. Apoi: **✕** pe
  ultimul document + **Don't Save** → se închide tot Word-ul? Și **More options…** din „Save your changes…” → ce deschide?
  (Simulatorul: aceeași fereastră, numele documentului în File name, Save = același fișier; ✕ pe ultimul document închide
  Word-ul; More options… = mesajul central.)
- [ ] **AC-6** Word, F12 → fereastra Save As pe PC-ul din **laborator**: panoul din stânga, de sus în jos (unde sunt
  **Documente** și **Descărcări**: sub „Acest PC”, fixate sus?). (Simulatorul: doar implicitele din referință — Acasă,
  Galerie, Acest PC, Rețea — unul sub altul; „Documente” nu se poate alege din stânga, deci lecția m1-l03:119 încă nu.)
- [ ] **AC-7** Word, File › Open › **Recent**: rândul arată numele cu extensie („Orar.docx”) sau fără? Un document tocmai
  salvat urcă primul? Deschizi un fișier din Recent cât alt document e deschis → apare a doua fereastră Word? (Simulatorul:
  numele fără extensie; salvatul urcă primul; documentul vechi rămâne „deschis în spate”, documente_deschise = 2.)
- [ ] **AC-8** Word, Ctrl+S pe document nou → „Save this file”: ce **scrie** în caseta mică de lângă File name („.docx”?) și ce
  rânduri are lista ei și lista **Choose a Location** ▾? (Simulatorul: caseta arată valoarea din referință, „Word Document
  (*.docx)”, tăiată la 41 px; amândouă ▾ dau mesajul central.)
- [ ] **AC-9** Word, F12 → Save as type **Rich Text Format (*.rtf)** (sau Plain Text, OpenDocument) → Save: ce fișier apare și
  ce scrie apoi în bara de titlu? (Simulatorul: doar .docx și PDF au efect; celelalte 15 rânduri se pot alege, dar Save dă
  mesajul central.)
- [ ] **AC-10** Word, Font Size ▾ (sau Alt+↓ în casetă): în lista deschisă e marcată mărimea curentă (11)? Săgeata ↓ pornește de
  la ea? (Simulatorul: mărimea curentă e marcată, ↓ mută marcajul de la ea.)
<!-- RUNDA4-WORD:END -->

<!-- RUNDA5-WORD:START (scris de constructorul rundei 5, 19.11.2026 — GRAV-urile T1-T6 + N4 ale criticului 4 și constatările lui [FARA_REFERINTA]) -->
## Runda 5 · Word · Open, document nou, „already exists”, zona PDF — de lămurit (un minut fiecare)

Până la răspuns, simulatorul face ce scrie în paranteză.

- [ ] **R5-1** Word, **Ctrl+F12** (sau File › Open › Browse) și **F12**, pe PC-ul din **laborator**: panoul din stânga, de sus în
  jos — unde sunt **Descărcări** și **Documente** (fixate sus, după Galerie? sub „Acest PC”?). Clic pe Descărcări → lista arată
  fișierele cu extensie („club-lectura.docx”) sau fără? (Simulatorul: Acasă, Galerie, apoi folderele din conținutul lecției —
  Descărcări, Documente —, apoi Acest PC, Rețea, unul sub altul la 24 px; numele din listă fără extensie. Temeiul: numele
  implicite din `referinte/acoperire_word_r3.py:57`; locul e al nostru — lărgește AC-6.)
- [ ] **R5-2** Word gol (Ctrl+W › Don't Save), apoi **Ctrl+N**: titlul e „Document1 - Word” sau „Document2 - Word”? Și, tot fără
  document, clic pe **B** / **Ctrl+B** / **F12**: comenzile sunt gri? se întâmplă ceva? (Simulatorul: „Document1”; comenzile
  dau mesajul central „În aplicația reală, „X” funcționează; aici nu e simulată.”)
- [ ] **R5-3** Word, document cu text, **F12** → File name = numele unui fișier care EXISTĂ în folder → Enter: ce fereastră apare
  (titlul, textul, butoanele, care e ales)? Același lucru cu **PDF (*.pdf)** și un PDF existent, și cu numele documentului
  deschis chiar el. O captură UI Automation a ferestrei ar închide rândul. (Simulatorul: mesajul central „„X.docx already
  exists” …”, fișierul neatins, fereastra Save As rămâne deschisă.)
- [ ] **R5-4** [FARA_REFERINTA, critic 4] Word, „are” selectat, clic pe **▾ Font Size**, apoi tastezi „20”: unde ajung cifrele
  (în casetă sau în document)? UIA `FocusedElement` după clicul pe ▾. (Simulatorul: focusul rămâne în document, „20”
  înlocuiește cuvântul.)
- [ ] **R5-5** [FARA_REFERINTA, critic 4] Word, ferestrele **Save As**, **Save this file**, **Save your changes…**: ordinea
  focusului la **Tab** / **Shift+Tab** (UIA `FocusedElement` după fiecare Tab). (Simulatorul: primul Tab din File name iese din
  fereastră.)
- [ ] **R5-6** Word, F12 → **PDF (*.pdf)**: care buton radio „Optimize for:” e ales la deschidere (Standard?) — referința are
  `b = None` pe amândouă. (Simulatorul: niciunul marcat până la primul clic / Alt+A / Alt+M.)
<!-- RUNDA5-WORD:END -->

## Runda 6 · Excel în biblioteca centrală — de lămurit (un minut fiecare, pe PC-ul cu Excel)
<!-- RUNDA6-EXCEL:START -->
- [x] **R6-1** Excel, B1 activă, A1:A3 = 4, 5, 6: tastezi `=SUM(A1,A2)` și Enter. Apare o fereastră (ce scrie, ce butoane)
  sau Excel rămâne doar în editare? (`excel-separator-virgula` are `mod_probat: false`.) (Simulatorul: rămâne în editare,
  fără mesaj, ca citirea de atunci.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[dialog.eroare_formula_2]` („There's a problem with this formula” [OK]) + `referinte/scenarii_real/excel-separator-virgula.json`.
- [x] **R6-2** Excel, A4 activă: tastezi `=SU`. Ce funcție e aleasă primă în lista care apare (SUBSTITUTE?), iar după Tab ce
  scrie în celulă? (`excel-autocompletare-tab`, `mod_probat: false`.) (Simulatorul: Tab scrie „=SUBSTITUTE(”, prima funcție
  în ordine alfabetică din cele simulate; cu `A1:A3)` + Enter rămâne în editare.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/scenarii_real/excel-autocompletare-tab.json` (=SU + Tab → SUBSTITUTE, apoi „You've entered too few arguments”, `referinte/uia_excel.json › suprafete[dialog.eroare_formula_3]`); lista de completare însăși rămâne [NEVERIFICAT].
- [ ] **R6-3** Excel, o celulă goală: tastezi `7.1`, `7.9`, `7.12` și Enter. Ce text arată celula (luna scurtă: „ian”,
  „sept”…?). Doar „mai” e probat (`excel-zecimale-punct`: „07.mai”). (Simulatorul: ian, feb, mar, apr, mai, iun, iul, aug,
  sept, oct, nov, dec — nedovedite.)
- [x] **R6-4** Excel, registru nou (Book1), Ctrl+S: se deschide pagina **File › Save As** sau o fereastră mică „Save this
  file” (ca la Word)? O captură UI Automation ar închide rândul. (Simulatorul: pagina File › Save As.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[dialog.save_this_file]` (fereastra „Save this file”, ca la Word).
- [x] **R6-5** Scenariul `excel-salvare-ca` cere `fila: FileTab` + `id_mso: FileSaveAs`, dar în Excel real (referința)
  butonul File are idMso `FileTabButton`, iar „Save As” din Backstage n-are idMso. Scenariul se poate juca doar dacă e
  rescris (o rundă `acoperire`): File → Save As → Browse → File name. (Simulatorul face drumul real; starea „Note.xlsx”
  e probată în `runde/6/proba_excel.py`, cazul gest.salvare_ca.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `scenarii/excel/excel-salvare-ca.json` rescris pe File › Save As › Browse + `referinte/scenarii_real/excel-salvare-ca.json` (probat).
- [x] **R6-6** Excel, selectezi B2:C4 cu numere: bara de stare arată „Average: … Count: … Sum: …”? În ce ordine și unde?
  Referința are bara de stare a unei foi goale. (Simulatorul: nu le arată.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[bara_stare#selectie_numere]` (Average, Count, Sum, înaintea vederilor).
- [ ] **R6-7** Excel, `=1/3` și Enter, coloana lată de 64 px: ce text arată celula („0,333333”?). (Simulatorul: cel mult
  10-11 caractere, ca formatul General — lățimea exactă nedovedită.)
<!-- RUNDA6-EXCEL:END -->

## Runda 7 · Excel (unghiul gest_tastatura) — de lămurit (un minut fiecare, pe PC-ul cu Excel)
<!-- RUNDA7-EXCEL:START -->
- [x] **R7-1** Excel, B2:B6 cu numere, B8 activă: săgeata ▾ de lângă Σ (AutoSum). Ce rânduri are lista (Sum, Average, Count
  Numbers, Max, Min, More Functions…?), în ce ordine, și ce scrie Average în B8? O captură UI Automation a listei într-o rundă
  `acoperire` ar închide rândul. (Simulatorul: mesajul central; lecția m2-l08:63 cere „Medie (Average)”.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[lista.AutoSum]` (Sum, Average, Count Numbers, Max, Min, More Functions...; Average → =AVERAGE(B2:B7)).
- [x] **R7-2** Excel: tastezi `=SUM(B2:B7)B2:B6` și Enter. Ce fereastră apare (titlu, text, butoane)? (`com_r6b.json › D4`
  arată doar că Excel n-o primește.) (Simulatorul: rămâne în editare și arată mesajul central „Excel nu primește formula…”.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[dialog.eroare_formula]` („We found a typo…” [Yes, No]).
- [x] **R7-3** Excel, coloana A de 64 px: tastezi de mână `1234567890` și `12345678901234`, apoi `=25/3` în A3. Se lățește
  coloana la primele două (până la ce lățime)? La a treia nu? (Probat doar „741234567” → întreg, `excel-zero-in-fata`.)
  (Simulatorul: numărul TASTAT în format General lățește coloana cât să încapă; formula și conținutul de pornire nu.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/scenarii_real/excel-numere-afisare.json` (doar valorile probate acolo).
- [x] **R7-4** Excel, coloana de 64 px: `=1/30000` (0,0000333…) și `=1/7000000`. Ce text arată („3,33E-05”? „0,000033”?).
  (Simulatorul: sub 0,0001 trece în notație științifică — prag ales, nedovedit.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/scenarii_real/excel-numere-afisare.json` (=1/30000 → 3,33333E-05; =1/7000000 → 1,42857E-07).
- [ ] **R7-5** Excel, E5 activă: clic dreapta pe litera C. Se alege coloana C (meniul apoi Column Width… pune lățimea pe C)?
  (Simulatorul: da — clicul dreapta pe o literă din afara selecției alege coloana.)
- [x] **R7-6** Excel: dublu clic pe linia dintre A și B, cu „Situația notelor la informatică” în A1. Ce lățime ia A
  (Column Width… o arată în caractere)? (Simulatorul: textul măsurat + 7 px.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/scenarii_real/excel-autofit-latime.json` (A = 186 px).
- [x] **R7-7** Excel, după Σ: ce mod scrie bara de stare (Enter / Point)? (Simulatorul: „Enter” până la primul clic pe o
  celulă, apoi „Point”.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › acoperire_r7.fapte` (după Σ / Average: „Cell Mode Point”).
- [x] **R6-7** (din runda 6) — lămurit de criticul 6: `runde/6/critic_probe/com_r6.json` (Range.Text, Excel real) dă
  „0,333333” la `=1/3` în coloana de 64 px; afișarea după lățime e acum în `excel.js › inLatime`.
- [x] **R7-8** Excel: săgeata ▾ de lângă găleata Fill Color. Ce are galeria (Theme Colors, Standard Colors, No Fill, More Colors…)
  și în ce ordine? O captură UI Automation într-o rundă `acoperire`. (Simulatorul: mesajul central „Fill Color”; butonul pune galben,
  `com_r7c.json › fill`.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[lista.CellFillColorPicker]`.
- [x] **R7-9** Excel: lista Borders ▾ deschisă. Titlurile grupurilor („Borders”, „Draw Borders”?), pictogramele, mărimea rândurilor.
  (Simulatorul: lista din S11 în ordinea de acolo, cu etichetele din `GetLabelMso`, fără titluri; `excel.js › meniuBorduri`.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[lista.Borders]`.
- [x] **R7-10** Excel: B2 cu Wrap Text, apeși din nou Wrap Text. Se oprește încadrarea? Rândul revine la 14,4 pt? (`com_r7c.json ›
  wrap_din_nou`: al doilea `ExecuteMso` n-a schimbat nimic — neconcludent.) (Simulatorul: comutator; rândul revine la 19 px.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/scenarii_real/excel-wrap-de-doua-ori.json` (a doua apăsare oprește încadrarea, rândul revine).
- [x] **R7-11** Excel: Data › Sort pe un tabel cu antet, apoi Add Level. Ce scrie în stânga rândului al doilea („Then by”?)
  și cum se numește în UI Automation (DataItem / ComboBox)? Referința are un singur nivel (`uia_excel.json › dialog.SortDialog`),
  iar `surse_microsoft.md` nu are pagina. O captură UIA după Add Level, într-o rundă `acoperire`, închide rândul. (Simulatorul:
  „Then by”, din lecția m2-l10:63.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[dialog.SortDialog#Add Level]` (rândul 2 = „Then by”) + `referinte/uia_excel.json › suprafete[lista.SortDialog_SortOn]`, `[lista.SortDialog_SortBy_fara_antet]` (Column A/B/C).
- [ ] **R7-12** Excel, fereastra Sort: lista Order pe o coloană cu numere („Smallest to Largest”, „Largest to Smallest”, „Custom
  List...”?) și pe una cu text („A to Z”, „Z to A”, „Custom List...”?); se schimbă singură ordinea când alegi o coloană cu numere?
  Lista Sort On (doar „Cell Values” sau și Cell Color / Font Color / Conditional Formatting Icon)? Fără „My data has headers”,
  coloanele se numesc „Column A”…? (Simulatorul: așa, din lecția m2-l10:63 și din butoanele panglicii.)
- [ ] **R7-13** Excel: C2:C7 aleasă într-un tabel A1:C7, butonul Sort Largest to Smallest de pe fila Data. Apare Sort Warning
  (referința a deschis-o prin `ExecuteMso('SortDialog')`, nu prin buton)? Unde apare pe ecran (captura: x = -27, deci la marginea
  din stânga)? (Simulatorul: apare și la butoane, ca în lecția m2-l10:62, :148; poziția din referință, adusă în fereastră.)
- [x] **R7-14** Excel, fereastra Sort: OK cu un nivel fără coloană (ce fereastră de eroare?); Add Level adaugă rândul la coadă sau
  sub nivelul ales? Delete Level pe ultimul nivel rămas? (Simulatorul: mesajul central „Sort”; la coadă; se poate șterge tot, OK
  închide fără sortare.)
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[dialog.SortDialog_eroare_nivel_gol]` („All sort criteria must have a column or row specified…” [OK]).
- [x] **R7-15** Excel: registru nou, scrii ceva, Ctrl+W. Fereastra „Want to save your changes to Book1?” (titlu, text, butoanele
  Save / Don't Save / Cancel, care e apăsat de Enter)? Nu e în `uia_excel.json`. (Simulatorul: mesajul central „Close (Ctrl+W)”,
  registrul rămâne deschis.) Și: în Chrome pe calculator, Ctrl+N / Ctrl+W sunt ale browserului (nu ajung la pagină; proba headless le
  trimite prin CDP) — elevul are File › New › Blank workbook și File › Close.
  **Lămurit în runda `acoperire` Excel (19.11.2026, Excel real pe desktopul ascuns):** `referinte/uia_excel.json › suprafete[dialog.save_your_changes_to_this_file]` + `referinte/scenarii_real/excel-ctrl-w-modificat.json` (More options…, Save, Don't Save, Cancel).
- [ ] **R7-16** Excel, un singur registru, nemodificat: Ctrl+W. Cum arată fereastra fără registru (zona gri? panglica gri? titlul
  „Excel”?). O captură UIA într-o rundă `acoperire`. (Simulatorul: zona documentului gri, fără celule; titlul „Excel”; Ctrl+N deschide BookN.)
- [ ] **R7-17** Excel, Save As (F12): ce rânduri are panoul din stânga pe un profil curat și în ce ordine (referința Excel le are
  „nesalvat”)? (Simulatorul: Acasă, Galerie, Documente, Acest PC, Rețea, la 24 px, ca în Word.)
- [ ] **R7-18** Excel: redenumirea foii cu un nume care există deja sau cu `/` — ce fereastră apare? Se poate anula cu Ctrl+Z?
  (Simulatorul: numele rămâne cel vechi, fără mesaj; redenumirea nu intră în Ctrl+Z.)
- [x] **R6-4 · DE ACOPERIT (runda 7)** Excel: Ctrl+S pe un registru nou, nesalvat. Ce fereastră se deschide (pagina File › Save As,
  fereastra „Save this file” ca în Word, sau Save As)? Captura lipsește din `uia_excel.json`; lecția m1-l03:95-97 descrie „Save this
  file”. Simulatorul a rămas cum era (pagina File › Save As) — nu s-a inventat nimic.
- [ ] **R7-19** Excel, foaie goală, 1366 × 768: culoarea barelor de derulare și a cursorului, desenul săgeților, mărimea cursorului
  când derulezi (referința: cursorul orizontal 450 din 491 px, vertical 442 din 462 px, pe o foaie goală — Excel îl calculează după
  zona folosită, nu după 40 × 26 de celule). Ce e despărțitorul [806,714,32,31] (⋮, trage lățimea filelor?). (Simulatorul: gri
  deschis, săgeți Fluent, cursorul proporțional cu grila desenată; despărțitorul gol.)
<!-- RUNDA7-EXCEL:END -->

## Runda 8 · Excel (K1-K6, X5, X8) — de lămurit (un minut fiecare, pe PC-ul cu Excel)
<!-- RUNDA8-EXCEL:START -->
- [ ] **R8-1** Excel, B2:B7 numere; în D2 scrii `=SUM(B2:B7)B2:B6` + Enter → fereastra „We found a typo…”. Apasă **No**: ce
  urmează (altă fereastră? rămâi în editare cu formula ta?). Apoi din nou, apasă **Yes**: unde ajunge celula activă (D3?) și ce
  arată D2 (valoarea sau #VALUE! / vărsare pe mai multe rânduri)? (Simulatorul: No = înapoi în editare cu formula neschimbată;
  Yes = formula corectată primită, celula activă coboară, valoarea calculată de simulator.)
- [ ] **R8-2** Excel, meniul de clic dreapta pe o celulă are sus caseta „Type to search…” (`uia_excel.json ›
  meniu_contextual.celula › Edit MenuTextBoxAutomationId`). Apasă litera **C**: copiază (tasta de acces a lui Copy) sau scrie
  „c” în caseta de căutare? Apoi ↓: pe ce rând ajunge alegerea (Cut sau caseta)? (Simulatorul: C = Copy, ↓ = Cut, primul rând.)
- [ ] **R8-3** Excel, fereastra Sort Warning (C2:C3 aleasă + Sort A to Z): unde e focusul la deschidere (butonul Sort..., un buton
  radio, Cancel)? Tab de 3 ori: pe ce controale trece? (Simulatorul: focusul pe cutia ferestrei; Tab: butonul radio ales,
  Sort..., Cancel — ordinea arborelui UIA.)
- [ ] **R8-4** Excel, fereastra Sort cu un nivel: Tab de 10 ori de la OK — pe ce controale trece focusul și în ce ordine?
  (Simulatorul: ordinea arborelui UIA din `dialog.SortDialog`.)
- [ ] [FARA_REFERINTA critic 7] **R8-5** Ctrl+PageDown / Ctrl+PageUp (lecția m1-l03:197: foaia din dreapta / stânga);
  **R8-6** Alt+Enter în celulă (rând nou în aceeași celulă?); **R8-7** Ctrl+1 (fereastra Format Cells?); **R8-8** Ctrl+C / X / V /
  B în timpul editării unei celule; **R8-9** File (Backstage) fără niciun registru deschis: care comenzi sunt gri?
- [ ] **R8-10** Excel, registru nou (Book1) nesalvat: **File › Save** (din Backstage, nu Ctrl+S) — se deschide pagina File › Save As
  sau fereastra „Save this file”? (Simulatorul: pagina Save As, ca Word; `runde/8/diferente.md` D16.)
- [ ] **R8-11** Excel, registru nou modificat, Ctrl+W → „Save your changes to this file?”: scrii un nume în caseta File name a ferestrei
  și apeși **Save** — se salvează direct (cu ce nume, în ce folder) și se închide, sau apare încă o fereastră? Și ce face **More
  options…** din fereastra asta? (Simulatorul: salvează din caseta ei și închide; More options… = mesajul central; D17.)
- [ ] [FARA_REFERINTA critic 8, `runde/8/critic.md`] **R8-12** Excel, un fișier DEJA salvat (de ex. Tema_mea.xlsx), modificat, Ctrl+W:
  ce fereastră apare (tot „Save your changes to this file?” cu File name, sau varianta scurtă Save / Don't Save / Cancel)?
  (Lecția m1-l03:176-182.) **R8-13** după Ctrl+S pe un fișier salvat, Ctrl+Z, apoi Ctrl+W: mai întreabă? **R8-14** `=SUM(A1,A2)`
  + Enter → „There's a problem with this formula” → apasă **OK** (nu Esc): rămâi în editare cu formula (cum spun lecțiile
  m2-l09:61, m2-l13:106) sau în Ready? Aceeași întrebare la „You've entered too few arguments”. **R8-15** `=SUM(B2:B4` (fără
  paranteza de la final) + Enter: Excel o închide singur sau dă o fereastră? La fel `=` singur + Enter și `=B2+` + Enter.
  **R8-16** `=IF(B2>=9;„da”;„nu”)` cu ghilimelele românești: ce fereastră? **R8-17** `=E5+1` scris în E5 (referință circulară):
  ce fereastră, ce arată celula? **R8-18** Save this file › Choose a Location ▾: ce rânduri are lista? **R8-19** Σ sau ▾ ›
  Average lângă un singur număr: ce zonă propune Excel (`=AVERAGE(B5)` sau `=AVERAGE(B5:B5)`)? (Simulatorul: `B5:B5`.)
<!-- RUNDA8-EXCEL:END -->
<!-- RUNDA9-EXCEL:START -->
- [ ] **R9-1** Excel, B2:B7 numere, clic pe B8, Home › Σ (AutoSum): bara de stare arată „Point”. Apasă ↓ (sau ↑): ce scrie
  formula (`=SUM(B9)` / `=SUM(B7)`, adică pornește din celula B8, sau altceva)? (Simulatorul, după runda 9: ↓ → `=SUM(B9)`, ↑ →
  `=SUM(B7)`, mecanismul modului Point de la „=” + săgeată; referința dă doar modul, `c_autosum.mod_dupa_sigma`.)
- [ ] **R9-2** Excel, un grafic ales, fila Chart Design aleasă; clic pe o celulă: ce filă e aleasă după ce dispar Chart Design și
  Format (Home, fila de dinainte de grafic, alta)? (Simulatorul: Home, ca Word la tabel / imagine.)
- [ ] **R9-3** Excel, un grafic Clustered Column ales; Insert › Insert Column or Bar Chart ▾ › Clustered Bar: graficul ales își
  schimbă tipul sau apare un al doilea grafic? (Simulatorul: își schimbă tipul, după lecția m2-l11.)
- [ ] **R9-4** Excel, A1:B4 aleasă, Insert › Clustered Column: locul (x, y) și mărimea graficului nou (ChartObjects(1).Left / Top /
  Width / Height); legenda la o singură serie (HasLegend); titlul (ChartTitle.Text, HasTitle). (Simulatorul: lângă tabel, la
  dreapta, 480 × 288 px; legenda doar la mai multe serii; titlul = numele seriei sau „Chart Title”.)
- [ ] **R9-5** Excel, Change Chart Type › All Charts › Line și apoi Pie: dump UI Automation al ferestrei (rândul de subtipuri și
  numele de sub el). (Simulatorul: doar numele „Line” / „Pie”, fără rândul de subtipuri.)
- [ ] **R9-6** Excel, dump-uri UI Automation pentru `lista.ChartTypeLineInsertGallery` (Insert › Insert Line or Area Chart ▾),
  `lista.ChartTypePieInsertGallery` și lista Chart Design › Add Chart Element ▾ › Data Labels (laboratorul m2-l11, pașii 3 și 6;
  azi mesajul central). Plus: ce se vede în tabel cât graficul e ales (zonele sursă încadrate colorat).
- [ ] **R9-7** Excel, un grafic ales: dublu clic pe titlul „Chart Title”. Apare cursorul în titlu (ce scrii se adaugă la titlul
  vechi, cum spune lecția m2-l11) sau doar se alege titlul? (Simulatorul: dublu clic = un clic, titlul doar ales; criticul 9,
  [FARA_REFERINTA] 5.)
- [ ] **R9-8** Excel, graficul ales (nu titlul): Esc, Enter, apoi o literă. Ce se întâmplă cu fiecare (deselectare, intrare în
  editarea titlului, nimic)? (Simulatorul: fără efect; criticul 9, [FARA_REFERINTA] 9.)
- [ ] **R9-9** Excel, un grafic ales, Alt: literele KeyTips de pe Chart Design la lățime întreagă (grupurile ZL, ZS, ZD, ZT, ZO
  din simulator) și, după Alt, N, C: ce rând din lista ▾ are focusul și ce alege ↓ + Enter. (Criticul 9, [FARA_REFERINTA] 8, 10.)
- [ ] **R9-10** Excel, pictogramele butoanelor mari din Chart Design (Add Chart Element, Quick Layout, Change Colors, Switch
  Row/Column, Select Data, Change Chart Type, Move Chart) și din Insert › Charts (Line, Pie, Hierarchy…): capturi la 100%,
  pentru icoanele Fluent cerute de contract (I7). (Simulatorul: doar text, sau un pătrat gol; criticul 9, [FARA_REFERINTA] 4.)
<!-- RUNDA9-EXCEL:END -->

## Runda 10 · Excel (A1 locul graficului, A2 rezumatul selecției, E5 vărsarea) — de lămurit (un minut fiecare, pe PC-ul cu Excel)
<!-- RUNDA10-EXCEL:START -->
- [ ] **R10-1** Excel VIZIBIL, maximizat la 1366×768 (100 %), A1:B6 aleasă, Insert › Insert Column or Bar Chart ▾ › Clustered
  Column: în ce celulă cade colțul stânga-sus al graficului? Apoi la fel cu fereastra îngustată sub ~500 px și cu grila derulată
  ~40 de rânduri în jos. (COM invizibil, `runde/10/probe/com_r10_b.json` + `com_r10_c.json`, 9 ferestre: left = (UsableWidth −
  360)/2 − 10,2 pt, top = (UsableHeight − 216)/2 − 7,2 pt, minim 0, mărimea fixă 360 × 216 pt. Fereastra invizibilă nu se lasă
  derulată, deci „raportat la derulare” e nedovedit. Simulatorul: formula pe zona vizibilă a grilei, plus derularea → G5 la
  1366×768; telefonul: lipit stânga-sus. Gestul real pe galerie n-a putut fi jucat invizibil, doar `Shapes.AddChart2`.) R9-4
  e lămurit pe partea de loc și mărime.
- [ ] **R10-2** Excel, bara de stare, cu numerele 9, 7 / 8, 10 / 6, 5 în B2:C4: ce arată bara (Average / Count / Sum, sau nimic)
  pentru: (a) o singură celulă cu număr (B2); (b) B1:B3 = „Nota”, 9, 8 (text + numere); (c) doar text (A1:A3); (d) o zonă cu
  goluri (B2:B10, numai B2:B4 pline); (e) o zonă cu o eroare (#DIV/0!); (f) un grafic ales; (g) o zonă de 2 celule cu una
  singură plină; (h) media 10/3 (câte zecimale: „3,333333333”?); (i) sume mari (separator de mii?). (Simulatorul: (a), (f), (g)
  → nimic, rămâne Display Settings; (b) Average 8,5 · Count 3 · Sum 17; (c) doar Count; (d) se numără doar cele pline; (e) doar
  Count; (h) formatul General al celulei (10 cifre); (i) fără separator. Referința dă doar B2:C4 numere,
  `bara_stare#selectie_numere`.)
- [ ] **R10-3** Excel, vărsarea: (a) `=SUM(B2:B7)*B2:B6` în D2 cu D4 deja ocupată: ce arată D2 (#SPILL!?) și se vede chenarul
  vărsării? (b) clic pe D3 (celulă vărsată): ce arată bara de formule (formula gri a lui D2?) și ce face Delete pe D3?
  (c) `=B2:B6` simplu, `=B2:B6&"x"`, `=B2:B6>5`: se varsă? (d) `=B2:B4*C2:C3` (zone de mărimi diferite): #N/A în D4?
  (e) `=B2:B100*2` (zonă mare, multe goluri): se varsă cu 0? (Simulatorul: (a) #VALUE! în D2, fără chenar; (b) bara goală,
  Delete fără efect; (c) nu se varsă, ca înainte; (d) #N/A în afara zonei mici; (e) se varsă cu 0, până la 5000 de celule.
  `com_r8.json` dă doar cazul simplu: D2:D6 = 432…288, HasSpill, D3 fără formulă.)
  **Lămurit PARȚIAL (a, c) în runda `acoperire` Excel după runda 14 (20.11.2026, Excel real pe desktopul ascuns, gesturi
  tastate):** (a) D2 = `#SPILL!` (formula rămâne `=SUM(B2:B7)*B2:B6`, D4 = „x”, celula activă D3) —
  `referinte/scenarii_real/excel-varsare-zona-ocupata.json`; (c) `=B2:B6`, `=B2:B6&"x"`, `=B2:B6>8` se varsă toate în
  D2:D6 / E2:E6 / F2:F6, formula doar în prima celulă, după Tab, Tab, Enter celula activă e D3 —
  `referinte/scenarii_real/excel-varsare-simpla.json`; prin COM (Formula = Formula2 = textul tastat, HasSpill, SpillParent,
  SpillingToRange D2:D6): `referinte/uia_excel.json › acoperire_r14.fapte.v_varsare_com`. Rămân (b) chenarul / bara de
  formule / Delete pe D3, (d), (e).
- [ ] **R10-4** Excel, axa valorilor la un grafic Clustered Column cu valorile 0…10 (maxim exact 10), 0…100, 0…0,5 și cu o
  valoare negativă (−3): ce minim / maxim / pas pune Excel? (Simulatorul: 5 % deasupra maximului, apoi pasul 1 / 2 / 5 × 10^k
  cu cel mult 10 diviziuni; regula e potrivită pe cele 3 cazuri COM din `com_r9.json` (0–10/1, 0–25/5, 0–30/5).)
- [x] **R10-5** Excel, după vărsarea D2:D6 (`=SUM(B2:B7)*B2:B6`): Ctrl+↓ și Ctrl+Shift+↓ din D2, Ctrl+↑ din D7, Ctrl+A în D3.
  (COM invizibil, criticul 10, `runde/10/critic_probe/com_r10k3.json`: `End(xlDown)` din D2 = $D$6, `End(xlUp)` din D7 = $D$6,
  `CurrentRegion` al lui D3 = $D$2:$D$6. Simulatorul: D40, D2, D2:D51, toată foaia. Gestul real de tastatură nu e jucat; de
  înghețat într-o rundă `acoperire` împreună cu R10-3 a, c, unde criticul 10 a dovedit prin COM `#SPILL!` la zona ocupată și
  vărsarea lui `=B2:B6`, `=B2:B6>8`, `=B2:B6&"a"`, `com_r10k.json`.)
  **Lămurit în runda `acoperire` Excel după runda 14 (20.11.2026, Excel real pe desktopul ascuns, formula tastată, apoi
  tastele):** Ctrl+↓ din D2 → D6 (`excel-varsare-ctrl-jos`), Ctrl+Shift+↓ din D2 → D2:D6 cu D2 activă
  (`excel-varsare-ctrl-shift-jos`), Ctrl+↑ din D7 → D6 (`excel-varsare-ctrl-sus-din-d7`), Ctrl+A în D3 → D2:D6 cu D3 activă
  (`excel-varsare-ctrl-a`), toate în `referinte/scenarii_real/`.
- [x] **R10-6** Excel, Ctrl+↓ din ultima celulă plină a unei coloane și Ctrl+→ din ultima plină a unui rând: ajunge la rândul
  1.048.576 / coloana XFD? (COM, `com_r10k2.json`: `End(xlDown)` = $A$1048576, `End(xlToRight)` = $XFD$7. Simulatorul: se
  oprește la marginea grilei desenate, A40 / Z4.)
  **Lămurit în runda `acoperire` Excel după runda 14 (20.11.2026, Excel real pe desktopul ascuns, tastele):** Ctrl+↓ din A7
  (A1:A7 pline) → A1048576 (`excel-ctrl-jos-ultimul-rand`), Ctrl+→ din C7 (A7:C7 pline) → XFD7
  (`excel-ctrl-dreapta-ultima-coloana`), în `referinte/scenarii_real/`.
- [ ] **R10-7** Excel, un grafic ales: Ctrl+C, Ctrl+X, Backspace, apoi Delete + Ctrl+Z (graficul revine ales sau neales?).
  (Simulatorul: Ctrl+C / Ctrl+X lucrează pe celule, Backspace fără efect, graficul revine neales; criticul 10, [FARA_REFERINTA] 8.)
- [ ] **R10-8** Excel, Change Chart Type deschis din taste (Alt, J, C, C): ordinea Tab (Recommended Charts, All Charts, lista
  tipurilor din stânga, rândul subtipurilor, OK, Cancel) și ce fac săgețile în lista tipurilor. (Simulatorul: lista și subtipurile
  nu primesc focusul, deci Line / Pie nu se pot alege din tastatură; criticul 10, [FARA_REFERINTA] 9.)
- [ ] **R10-9** Excel, vărsarea D2:D6, Ctrl+Z (vărsarea dispare), Ctrl+Y: care e celula activă după Ctrl+Y? Și unde cade un grafic
  nou inserat după ce grila a fost derulată 20 de rânduri în jos? (Simulatorul: B2; mijlocul zonei vizibile, G20; criticul 10,
  [FARA_REFERINTA] 7, 10.)
<!-- RUNDA10-EXCEL:END -->

<!-- RUNDA11-POWERPOINT:BEGIN -->
## Runda 11 (B-powerpoint, constructorul): ce face PowerPoint real și n-are referință (nu se implementează ca „fidel” până nu e probat)
- [x] **R11-1** Listele ▾ necapturate (README_referinte.md, „listele derulante și galeriile deschise”): New Slide ▾ și Layout
  (`SlideLayoutGallery`) arată în simulator DOAR aspectele numite de scenariile reale (Title Slide, Title and Content, Title Only);
  Office Theme are mai multe (lecțiile citează Two Content, Blank, Comparison, Section Header…). Pictures ▾
  (`FlyoutAnchorInsertPictures`: This Device… / Stock Images / Online Pictures) dă mesajul central. De capturat într-o rundă
  `acoperire`: lista Layout, lista New Slide ▾, lista Pictures ▾, grila Table ▾ (scenariu: deschiderea fiecărei liste, dump UIA).
  → LĂMURIT 20.11.2026 (runda `acoperire` după runda 11): `referinte/uia_powerpoint.json` › `lista.SlideNewGallery`,
  `lista.SlideLayoutGallery`, `lista.FlyoutAnchorInsertPictures`, `lista.TableInsertGallery` (+ `acoperire_r11.fapte`);
  scenariile reale `powerpoint-two-content-new-slide` / `-layout` (`referinte/scenarii_real/`).
- [ ] **R11-2** Casetele aspectelor (poziție, mărime, font: titlul Title Slide 60 pt e dovedit — `powerpoint-bold-text.json`;
  subtitlul 24, titlul Title and Content 44, conținutul 28 NU) și textul-îndemn din caseta goală („Click to add title”…; simulatorul
  arată doar chenarul punctat, fără text). Scenariu: `Shapes(i).Left/Top/Width/Height`, `TextFrame.TextRange.Font.Size` și
  `.Text` pe fiecare aspect, prin COM.
- [ ] **R11-3** Codurile `tranzitie_cod` / `animatii_cod` pentru alte efecte decât Fade (3849) și Fly In (2): simulatorul dă `null`.
  Scenariu: fiecare efect din primul rând al galeriilor, `SlideShowTransition.EntryEffect` / `TimeLine.MainSequence(i).EffectType`.
- [ ] **R11-4** Pașii Increase / Decrease Font Size în afară de 60 → 66 (simulatorul: lista 8…96 a casetei Font Size).
- [ ] **R11-5** Mutarea casetei: în simulator, tragerea mută caseta doar când e aleasă ca OBIECT (clic pe margine sau Esc din
  editare); tragerea în textul casetei alege text. De probat pe PowerPoint real cu mouse-ul (gest real, ecranul profesorului —
  `powerpoint-tragere-forma` e deja „trimis la profesor”).
- [ ] **R11-6** Comenzile gri în referință (`activ:false`: Font, Paragraph, Drawing, Animations; Effect Options / Preview la
  Transitions) devin active în simulator când e o casetă aleasă / un text în editare (la Transitions: când diapozitivul are o
  tranziție). Dovedit doar pentru Cut/Copy/Paste (README_referinte.md); de probat cu un dump UIA cu o casetă aleasă.
- [ ] **R11-7** Galeria Animations aplicată a doua oară pe aceeași casetă ÎNLOCUIEȘTE efectul (Add Animation adaugă): în simulator
  da; scenariul real `powerpoint-animatie-fly-in` are o singură aplicare (`[2]`). Scenariu: Appear apoi Fly In pe aceeași casetă.
- [ ] **R11-8** Delete pe o casetă de aspect GOALĂ aleasă ca obiect: dispare sau rămâne? (simulatorul: dispare.)
- [x] **R11-9** `powerpoint-diapozitiv-nou-buton`: rulatorul O4 apasă CENTRUL lui `mso:SlideNewGallery` (SplitButton [129,83,42,78]);
  centrul (y = 122) cade în partea ▾ (MenuItem `SlideNewGallery_Dropdown` [129,120,42,41]), care în PowerPoint deschide lista
  aspectelor — simulatorul o deschide (fidel geometriei referinței). Realul a fost rulat cu UIA Invoke pe SlideNewGallery
  (`scenarii_real/powerpoint-diapozitiv-nou-buton.json › cum`). De hotărât de orchestrator: scenariul ținește partea de sus
  (`tinta: "panglica:Home/Slides/New Slide"`) sau se probează pe real un clic de mouse în punctul (150,122).
  → LĂMURIT 20.11.2026: scenariul rescris pe partea de SUS (`tinta: panglica:Home/Slides/New Slide` = copilul Button „New Slide”
  al SplitButton-ului din referință); realul = UIA Invoke pe acel copil → diapozitiv nou Title and Content
  (`scenarii_real/powerpoint-diapozitiv-nou-buton.json`, mod_probat true).
- [x] **R11-10** `powerpoint-imagine` (`mso:PictureInsertFromFile`) și `powerpoint-salvare-ca` (`fila: FileTab`, apoi `mso:FileSaveAs`):
  țintele nu există pe ecran în referință (pe panglică e `FlyoutAnchorInsertPictures`; fila File e `FileTabButton`; Save As e un
  rând din Backstage fără idMso). Rămân neexecutabile până la o rundă `acoperire` (lista Pictures ▾) / o reparație a scenariului.
  → LĂMURIT 20.11.2026: ambele rescrise pe drumul real și rulate gest_real: imagine = Insert › Pictures ▾ › This Device... ›
  nume › Enter (3 forme); salvare-ca = File › Save As › Browse › nume › Enter („Vulcanii.pptx”); `scenarii_real/`, mod_probat true.
- [ ] **R11-11** (constructorul 2) Formatarea pe bucăți de text — ce nu e probat pe PowerPoint real:
  (a) Bold / Italic / Underline / Increase Font cu cursorul STRÂNS în cuvânt → tot cuvântul (simulatorul: da, ca Word —
  `scenarii_real/word-ctrl-b-fara-selectie.json`); cu cursorul în afara unui cuvânt → doar formatul de scriere;
  (b) `formatare_text.marime` la mărimi amestecate (simulatorul: a primului caracter; COM `Font.Size` pe un TextRange amestecat:
  necunoscut) și `bold` amestecat (simulatorul: true, ca `bool(msoTriStateMixed)` din `ruleaza_real.py`);
  (c) caseta Font Size din panglică la mărimi amestecate (simulatorul: goală; PowerPoint poate arăta „NN+”);
  (d) limitele mărimii scrise (simulatorul: 1-4000 pt, pas 0,1) și ce se întâmplă cu o valoare în afara lor (simulatorul: nimic);
  (e) Undo după formatare păstrează selecția? (simulatorul: nu — caseta nu mai e aleasă, ca la constructorul 1).
  Scenarii: `powerpoint-bold-un-cuvant` (selecție Characters(1,3) + Bold → `Runs`), `powerpoint-ctrl-b-cursor-in-cuvant`,
  `powerpoint-font-size-scris` (caseta Font Size, 40 + Enter), citire `TextRange.Runs(i).Font.Bold/Size`.
- [ ] **R11-12** (constructorul 2) Ferestrele Font / Paragraph / Insert Table:
  (a) numele valorilor care nu apar în referință: Font style „Bold” / „Italic” / „Bold Italic” (referința: doar „Regular”),
  Underline style când textul e subliniat (simulatorul: gol; referința: doar „(none)”), Alignment „Left” / „Right” / „Justified” /
  „Distributed” (referința: doar „Centered”); listele lor ▾ sunt necapturate (Open = mesajul central);
  (b) valorile de pornire ale paragrafelor în casetele care NU sunt titlul Title Slide (simulatorul: Before/After 0 pt, Multiple 0,9,
  aliniere la stânga) — referința le dă doar pentru titlul Title Slide;
  (c) More / Less la Size, Before text, Before, After, At (pasul): simulatorul dă mesajul central; la Number of columns / rows ±1;
  (d) Insert Table: limitele 1-75 și mesajul la o valoare greșită (simulatorul: fereastra rămâne deschisă, nimic);
  (e) eticheta „Insert Table...” din lista Table ▾ (comanda `TableInsert` e copilul lui `TableInsertGallery` în lista Microsoft S11;
  eticheta nu e capturată);
  (f) Font Color: culoarea implicită a butonului și paleta ▾ nu sunt în referință → Font Color rămâne cu mesajul central.
  → (f) LĂMURIT 20.11.2026: `uia_powerpoint.json` › `lista.FontColorPicker` (+ `_minibara`), butonul „Font Color Red” la
  pornire (`acoperire_r11.fapte.a_font_color`), scenariul real `powerpoint-font-color-titlu` (Red → #FF0000). (a)-(e) rămân.
  Scenarii: dump UIA al fiecărei ferestre cu un text aldin / subliniat / aliniat la stânga ales; lista Table ▾ deschisă.
- [x] **R11-13** (constructorul 2) „Save your changes” la File › Close / Ctrl+W pe o prezentare modificată (lecția m1-l03 o cere:
  Save / Don't Save / Cancel) NU e în `uia_powerpoint.json` (Excel îl are: `dialog.save_your_changes_to_this_file`). Simulatorul:
  File › Close dă mesajul central. Starea `modificat` (true după orice schimbare, false după Save / Save As) e gata. Scenariu
  `powerpoint-ctrl-w-modificat` într-o rundă `acoperire` (dump UIA al ferestrei, butoanele, ce rămâne după Don't Save).
  → LĂMURIT 20.11.2026: `uia_powerpoint.json` › `dialog.save_your_changes_to_this_file` (aceeași fereastră la Ctrl+W, File ›
  Close și ✕; Don't Save → PowerPoint fără prezentare: `acoperire_r11.fapte.b_dont_save`); scenariile reale
  `powerpoint-ctrl-w-modificat` (Cancel → prezentarea rămâne) și `powerpoint-ctrl-n` („Presentation2”, 2 deschise).
- [ ] **R11-14** (runda `acoperire` după runda 11) Caseta Duration (Transitions): ce arată după „0,5” + Enter. Pe desktopul
  ascuns caseta n-a primit focusul nici prin UIA SetFocus, nici prin clicul de mouse postat (focusul a rămas în mdiClass) —
  [NEVERIFICAT]. Dovedit doar: Fade din galerie pune 0,7 s, iar Apply To All copiază 0,7 pe toate
  (`scenarii_real/powerpoint-durata-aplica-la-toate.json`). De probat cu omul: clic în casetă, „0,5”, Enter → ce scrie caseta.
  → runda `acoperire` după runda 12 (20.11.2026): tot nerulat; lămurit doar ce scrie caseta FĂRĂ tastare: „02,00” fără tranziție,
  „00,70” după Fade, „01,00” după Push / Wipe (`uia_powerpoint.json › acoperire_r12.fapte.d_durate`).
<!-- RUNDA11-POWERPOINT:END -->

<!-- RUNDA12-POWERPOINT:START -->
## Runda 12 (B-powerpoint, constructorul 1) — [presupus] în powerpoint.js, de lămurit cu omul sau într-o rundă `acoperire`
- [ ] **R12-1** KeyTips: ORDINEA și locul insignelor pe ecran (referința dă doar șirurile `tasta_acces`). Bonusul `Alt, H, 1` pe
  PowerPoint real n-a fost rulat. Simulatorul: insigna sub centrul controlului, una pe literă (la butoanele împărțite câștigă
  partea care deschide lista: `Alt, H, I` → lista New Slide, ale cărei rânduri au `Alt, H, I, D/L/R` în referință).
  De probat: Alt → H → 1 pe un titlu ales; Alt → H → I.
- [ ] **R12-2** Închiderea: (a) Ctrl+W / File › Close pe o prezentare NEmodificată o închide fără întrebare; (b) ✕ pe ULTIMA
  prezentare închide de tot PowerPoint-ul — simulatorul rămâne în fereastra goală „PowerPoint” (ca după Ctrl+W); (c) Enter în
  File name al ferestrei „Save your changes” = Save (în referință niciun buton nu e „implicit”); (d) Save din fereastră salvează
  cu numele din casetă și închide. Scenarii: `ctrl-w-nemodificat`, `x-ultima-prezentare-dont-save`, `enter-in-save-your-changes`.
  → runda `acoperire` după runda 12: (c) NU se poate proba pe desktopul ascuns fără să scriu la om (Enter = Save ar salva în
  Documente / OneDrive; caseta nu primește o cale spre %TEMP%) — `acoperire_r12.NEVERIFICAT.enter_in_save_your_changes`.
- [ ] **R12-3** Culorile: în afară de Red #FF0000, Light Blue #00B0F0, alb (RGB 255,255,255) și negrul textului (#000000), valorile
  #RRGGBB ale paletei (Standard Colors, temă Office, nuanțele Lighter/Darker N% calculate cu lumMod/lumOff) și culoarea citită la
  text amestecat (primul caracter). Scenariu: câte o culoare de temă + o nuanță, citite prin COM (Font.Color.RGB).
- [ ] **R12-4** Geometria aspectelor Section Header, Two Content (pozițiile; numărul 3 e dovedit), Comparison, Blank, Content with
  Caption, Picture with Caption și numărul formelor lor. Scenariu `pozitii-aspecte` (Shape.Left/Top/Width/Height pe fiecare).
- [ ] **R12-5** Inserarea: imaginea din Insert Picture (centrată, 360×270 pt; orice nume nevid e primit) și forma din Shapes pusă
  cu un clic (72×72 pt, colțul în punctul apăsat; Text Box = casetă în editare). Scenariu: `pozitii_forme` după `imagine` și
  `sageata-dreapta`.
  → runda `acoperire` după runda 12 (parțial): pe Two Content cu caseta din dreapta GOALĂ, PowerPoint pune imaginea ÎN acea
  casetă (substituent cu imagine, [486, 163, 408, 304], tot 3 forme) — `acoperire_r12.fapte.e_imagine_two_content`,
  `scenarii_real/powerpoint-imagine-two-content.json`; centrarea 360×270 pe Title Slide și forma pusă cu un clic rămân.
- [ ] **R12-6** Durata tranziției: doar Fade = 0,7 s e dovedit; la celelalte efecte simulatorul păstrează durata de dinainte;
  „0,5” + Enter în Duration = 0,5 s pe diapozitivul activ (leagă de R11-14).
  → runda `acoperire` după runda 12 (parțial): fiecare efect din galerie pune durata LUI, oricare era înainte — Fade 0,7, Push
  1,0, Wipe 1,0 (și unul după altul pe același diapozitiv: 0,7 → 1,0 → 1,0 → 0,7); fără tranziție 2,0; EntryEffect pus prin
  COM NU schimbă durata (2,0 — de aici „02,00” din `acoperire_r11.fapte.d_efecte`) — `acoperire_r12.fapte.d_durate`,
  `scenarii_real/powerpoint-durata-{fade,push,wipe}.json`. Rămâne doar „0,5” + Enter (R11-14).
- [ ] **R12-7** Fundalul: un diapozitiv neatins = `{tip: solid, culoare: #FFFFFF}` (panoul arată „Fill Color RGB(255, 255, 255)”,
  dar tipul neatins nu e citit prin COM); „Automatic” din Color ▾ = alb; eticheta „Fill Color RGB(r, g, b)” după schimbare.
  → runda `acoperire` după runda 12 (parțial): diapozitivul neatins, citit prin COM = Fill.Type 1 (solid), ForeColor #FFFFFF
  (`acoperire_r12.fapte.c_background_styles.inainte`); „Automatic” și eticheta rămân.
- [ ] **R12-8** Animation Pane: numele formelor în rânduri în afară de „Title 1” / „Subtitle 2” (Content Placeholder 2, TextBox N…),
  categoria efectelor în afară de Entrance, clicul pe rând alege și caseta lui pe diapozitiv.
- [ ] **R12-9** (constructorul 2, MINOR critic 11 §6) Fereastra Font: Font style și Underline style; fereastra Paragraph: Alignment —
  NU se aplică la OK. Referința (`uia_powerpoint.json › suprafete › dialog.FontDialogPowerPoint` / `dialog.PowerPointParagraphDialog`)
  are câmpurile doar ca ComboBox cu valoarea de acum („Regular”, „(none)”, „Centered”), FĂRĂ Edit (nu se scrie în ele) și fără lista ▾
  (necapturată, R11-12 a) → numele celorlalte valori ar fi inventate. Scenarii: dump UIA cu lista ▾ deschisă la fiecare din cele trei;
  `powerpoint-font-style-bold-italic` (Font style › Bold Italic › OK → `TextRange.Font.Bold/Italic`), `powerpoint-underline-ok`,
  `powerpoint-paragraph-alignment-left` (`ParagraphFormat.Alignment`).
- [ ] **R12-10** (constructorul 2) Telefonul (≤ 480 px), zonele de atins: (a) chenarul se atinge doar pe caseta ALEASĂ (32 px: 24 în
  afară + 8 înăuntru); pe casetele nealese banda de 6 px nu se mai atinge — cum alege PowerPoint pe atingere o casetă după chenar
  e necapturat; (b) lansatoarele Paragraph / Drawing (și cele din Animations, View, filele contextuale) au butonul de deasupra la
  2-4 px: zona lor rămâne 32 × ~28 (mai mult ar acoperi „Convert to SmartArt” / „Shape Effects”); (c) „More Options” de lângă Undo
  (17 × 39) și butoanele barei de stare (28 px înălțime) sunt la fel în Word și Excel (cod comun) — de hotărât în valul comun.
- [ ] **R12-11** (runda `acoperire` după runda 12) Sfaturile la hover (numele culorii din Font Color / Shape Fill ▾, numele formei din
  Shapes ▾ — lecția m1-l06:143, GRAV A1 / A2): WM_MOUSEMOVE postat pe desktopul ascuns n-a deschis niciun ToolTip
  (`acoperire_r12.fapte.c_shape_fill_outline.hover_yellow`). De probat cu omul: mouse-ul ținut pe „Dark Blue” și pe „Arrow: Right”.
- [ ] **R12-12** (runda `acoperire` după runda 12) Zona de note: nu e expusă în UI Automation (textul de îndemn „Click to add
  notes”, mărimea zonei); nici tastarea în note nu e încă dovedită: clicul postat n-a nimerit zona, iar reluarea cu punctul
  reparat s-a întrerupt (`scenarii_real/powerpoint-note.json › nota_autor`; de rulat: `acoperire_powerpoint_r12.py scenarii
  --id=powerpoint-note,powerpoint-stea-ctrl-c-v`, al doilea cere clipboard-ul omului liber). Tot așa chenarul / mânerele
  formei alese (Selection.Type 2 e dovedit, desenul nu).
<!-- RUNDA12-POWERPOINT:END -->

<!-- RUNDA13-POWERPOINT:START -->
## Runda 13 (B-powerpoint, constructorul 1, unghiul gest_tastatura) — [presupus] în powerpoint.js, de lămurit cu omul sau într-o rundă `acoperire`
- [ ] **R13-1** Clicul în substituenții aspectului (titlu / subtitlu / conținut) pune cursorul în text, deși `a_forma_clic` arată că la
  forme și casete de text clicul în mijloc alege OBIECTUL; substituenții nu sunt în captură (lecțiile scriu acolo). Tot aici: al doilea
  clic fără tragere pe o casetă / formă deja aleasă = cursor în text. Scenariul care lămurește: Title Slide, clic în mijlocul titlului
  „Vulcanii” → `Selection.Type`; apoi încă un clic → `Selection.Type`.
- [ ] **R13-2** Fontul implicit al casetelor fără font ales: titlul „Calibri Light (Headings)”, restul „Calibri (Body)” (din
  `lista.Font › Theme Fonts`); `Font.Name` al titlului unei prezentări noi nu e capturat.
- [ ] **R13-3** Desenul formelor în galeria Shapes și pe diapozitiv (`desenForma`): SVG geometric din nume; desenul real nu e în UIA.
- [ ] **R13-4** Clicul în caseta Font deschide lista și alege textul casetei; în aplicația reală clicul în text (probabil) doar alege
  textul, iar lista o deschide ▾ / Alt+↓. Scenariul `powerpoint-font-titlu` apasă centrul casetei (UIA Expand pe real). De probat:
  clic de mouse în textul casetei Font → se deschide lista?
- [ ] **R13-5** Background Styles: Style 1-4 = solid #FFFFFF / #E7E6E6 / #44546A / #000000, restul `gradient` fără culoare; dovedit
  doar Style 6 = #E9E7E7 (`c_background_styles`). Scenariul: fiecare Style N → `Background.Fill.Type` / `ForeColor`.
- [ ] **R13-6** Tastatura într-o listă deschisă (săgeți = rândul următor / anterior în ordinea din listă, Enter = clic, Esc = închide;
  la deschidere e marcat rândul valorii curente — Font, Start). Nimic din PowerPoint capturat cu tastele în liste.
- [ ] **R13-7** Fereastra Open: un nume care nu e în dosar + Enter → fereastra rămâne, fără mesaj (în Windows apare un mesaj „nu se
  găsește”); dublu clic pe rând = deschidere; fereastra centrată în aplicație (captura are coordonatele relative la fereastră).
- [ ] **R13-8** Imaginea în caseta goală Two Content: raportul 304 / 408 e al imaginii din captură; pentru alte imagini PowerPoint
  păstrează raportul imaginii.
- [ ] **R13-9** Zona de note: înălțimea 55 px, chenarul, îndemnul „Click to add notes” și tastarea în ea (UIA nu o expune;
  `powerpoint-note` fără rezultat probat).
- [ ] **R13-10** Slide Sorter: grila (220 px pe miniatură, 24 px între ele, numărul sub miniatură); clicul pe o miniatură o alege,
  tragerea NU reordonează aici (în real reordonează). Reading View = fereastra aplicației albă, cu diapozitivul (nu e capturată).
- [ ] **R13-11** Panoul lateral (Format Background, Animation Pane): legenda cu numele panoului pe banda de 37 px de deasupra lui
  (y 181-218, unde referința nu are elemente) — textul, mărimea 15 px și fondul alb sunt presupuse; pe un ecran mai scund partea
  derulabilă (`Pane` cu ScrollBar / `List`) se micșorează, butoanele de sub ea rămân jos (structura e din referință, cum se
  așază PowerPoint pe 657 px nu e capturat). Scenariu: Format Background deschis pe 1366×657 la 125 %, captură UIA.
- [ ] **R13-12** Titlurile grupurilor din liste (bandă gri deschis, 12 px semibold) și sfatul pe hover al culorilor / formelor
  (`title` = numele din referință): aspectul presupus; numele și locul benzii sunt din referință. Scenariu: captură de ecran a
  galeriei Shapes și a paletei Font Color, cu mouse-ul pe „Dark Blue”.
- [ ] **R13-13** O listă mai înaltă decât fereastra (Shapes, 849 px) rămâne lipită sub buton și se taie jos, cu derulare; cum o
  așază PowerPoint pe un ecran de 768 nu e capturat. Scenariu: Insert › Shapes ▾ pe 1366×768, UIA BoundingRectangle al listei.
- [ ] **R13-14** Enter pe o formă aleasă cu săgețile în galeria Shapes = ca clicul (cursorul cruce, forma se pune la clicul pe
  diapozitiv); în PowerPoint real Enter poate pune forma direct în mijlocul diapozitivului. Scenariu: Alt, N, S, H, ↓, Enter.
- [ ] **R13-15** Taste de acces cu o listă deschisă (Alt, H, F C): săgețile / Enter ascund insignele și umblă în listă; Esc închide
  lista și arată insignele filei (README_referinte.md:148, „KeyTips afișate” necapturate). Scenariu: Alt, H, F C, Esc, captură.
- [ ] **R13-16** Fără prezentare (sau cu 0 diapozitive) indicatorul din bara de stare e gol, nu „Slide 1 of 0”; ce scrie PowerPoint
  atunci nu e capturat. Scenariu: Ctrl+W › Don't Save, UIA pe bara de stare.
- [ ] **R13-17** „Save your changes to this file?”: întrebarea în corpul ferestrei (20 px, la [486, 280]) — UIA nu o expune ca
  text; bara de titlu goală e din referință (TitleBar ''). Scenariu: Ctrl+W pe o prezentare modificată, captură de ecran.
<!-- RUNDA13-POWERPOINT:END -->

<!-- RUNDA14-POWERPOINT:START -->
## Runda 14 (B-powerpoint, constructorul, unghiul stare_finala_erori) — [presupus] în aplicatii.js / powerpoint.js, de lămurit cu omul sau într-o rundă `acoperire`
- [ ] **R14-1** Ordinea Tab / Shift+Tab în ferestre (Open, Save your changes, Insert Picture, Save As, Font, Paragraph) = ordinea
  nodurilor din `uia_powerpoint.json › dialog.*` (aplicatii.js › `controaleFereastra`: Edit / ComboBox / Spinner / Button / SplitButton /
  CheckBox / RadioButton / MenuItem / TabItem cu nume, fără bara de titlu, o oprire pe control, doar butonul radio ales). Ordinea Tab
  reală NU e capturată; la fel focusul la deschiderea Font / Paragraph / Insert Table (primul câmp din ordinea de mai sus: Font →
  Latin text font). Scenariu: în PowerPoint real, F12 / Ctrl+O › Browse / lansatorul Font; UIA `FocusedElement` după fiecare Tab, de
  12 ori, și o dată la deschidere.
- [ ] **R14-2** Enter cu focusul pe un control al ferestrei care nu e buton de apăsat (Files of type, Tools, o casetă de bifat) = butonul
  implicit (Open / Save / OK), Space pe un buton = îl apasă (powerpoint.js › `implicitDialog`, `la.tasta`). Regula vine din
  dlgbox-programming-considerations; ce buton e implicit în fiecare fereastră PowerPoint nu e capturat (b_ctrl_w: `implicit: false` la
  toate). Scenariu: Tab până la Files of type, Enter; UIA pe fereastră și pe prezentare.
- [ ] **R14-3** O listă deschisă din taste pe un drum fără litere în referință (Home: „Alt, H, S O”, „Alt, H, S F”) nu arată insigne și
  nu primește litere (literele din referință există doar pe drumul „Alt, J D, S O, …” din Shape Format). Scenariu: în PowerPoint real,
  Alt, H, S, O; captură de ecran (insignele din listă) și apoi W.
- [ ] **R14-4** Cu o listă / un meniu deschis (Font ▾, culori, Shapes, meniul contextual), literele tastate nu fac nimic (nici salt la
  nume în listă, nici text în diapozitiv). Scenariu: Font ▾ cu mouse-ul, tastezi „Ar”; UIA pe listă (rândul ales) și pe titlu.
- [ ] **R14-5** Zona de note goală nu scrie nimic (îndemnul „Click to add notes” nu e în referință:
  `acoperire_r12.NEVERIFICAT.zona_de_note_in_uia`). Lecția m1-l02:184 spune „Clic în zona de sub diapozitiv, unde scrie „Click to add
  notes””. Scenariu: captură de ecran a zonei de note goale în PowerPoint real (textul îndemnului, culoarea, locul).
- [ ] **R14-6** Adresa ferestrei Open după Ctrl+O › Browse („Toate locațiile” › „Documente”, din `acoperire_r12.fapte.b_ctrl_o_browse
  .la_deschidere.campuri[10-11]`) e pusă de mână pe banda de adresă a suprafeței `dialog.FileOpen` (capturată în alt dosar, redactat);
  lățimile 34 / 83 px sunt cele din `dialog.FileSaveAs › Adresă: Documente`, iar „›” din „Toate locațiile” e desen. Scenariu: UIA
  dialog.FileOpen deschis din Ctrl+O › Browse pe un profil fără date personale (adresa întreagă, dreptunghiuri).
- [ ] **R14-7** Grosimea conturului (Shape Outline › Weight) nu e în `stare()` (api §5 n-are cheie): evenimentul `contur_forma` are
  `inainte` = `dupa`. Scenariu: `powerpoint-shape-outline-weight` (Line.Weight după Weight › 3 pt), ca să intre o cheie în api §5.
<!-- RUNDA14-POWERPOINT:END -->

<!-- RUNDA16-WORD:START (scris de constructorul rundei 16, 20.11.2026 — cele 8 GRAV ale criticului 5; ce n-are referință) -->
## Runda 16 · Word · ferestrele de fișiere și Word fără document — de lămurit (un minut fiecare)

Până la răspuns, simulatorul face ce scrie în paranteză.

- [ ] **R16-1** Word, **F12** → File name `Pop?Mihai` (apoi `Pop_Mihai:7A`, `Pop*Mihai`) → Enter: ce fereastră apare (titlul,
  textul, butoanele)? O captură UI Automation a ferestrei, pe un document de probă în %TEMP%, ar închide rândul. Word real prin COM
  refuză numele („This is not a valid file name.”), dar fereastra desenată nu e în referință. (Simulatorul: nimic nu se salvează,
  fereastra Save As rămâne deschisă, mesajul central „Windows nu primește în numele fișierului semnele \ / : * ? " < > |. În aplicația
  reală apare o fereastră de eroare (aici nu e simulată). Schimbă numele.”)
- [ ] **R16-2** Word, **F12** într-un folder cu un `.docx` și un `.pdf`: lista ferestrei Save As arată doar `.docx`-ul (filtrul
  „Word Document (*.docx)”) sau și PDF-ul? Apoi Save as type › PDF: lista arată doar PDF-ul? (Simulatorul: doar fișierele tipului ales;
  numele fără extensie, ca în Open — vezi și R5-1.)
- [ ] **R16-3** Word, un fișier deschis și **modificat** (nesalvat), apoi Ctrl+F12 › același fișier › Open: Word întreabă ceva
  („revert to saved”?) sau doar aduce fereastra în față? (Simulatorul: aduce documentul existent în față, cu modificările, fără
  întrebare. Cazul nemodificat e dovedit prin COM: același document, `documente_deschise` neschimbat.)
- [ ] **R16-4** Word fără niciun document (Ctrl+W pe ultimul): sunt gri TOATE comenzile panglicii (Insert, Layout, View…) sau doar
  cele de pe Home? Filele se pot apăsa? Ce scrie bara de stare? (Simulatorul: toate comenzile panglicii gri și fără efect, filele și
  File active, câmpurile Font / Font Size dezactivate; COM a dovedit doar Bold, Italic, FontSize, Paste, FileSave, FileSaveAs,
  FilePrint, FileClose = gri, FileNewDefault și FileOpen = active.)
- [ ] **R16-5** Word cu două documente deschise (Ctrl+N): View › Window › **Switch Windows** — ce rânduri are lista (numele
  ferestrelor, cu cifre?)? (Simulatorul: mesajul central; între documente se trece cu Ctrl+W.)
<!-- RUNDA16-WORD:END -->

<!-- RUNDA17-EXCEL:START (scris de constructorul rundei 17, 20.11.2026 — X10 / A1 / T1 ale criticului 10; ce n-are referință) -->
- [ ] **R17-1** Excel cu un grafic ales (clic pe marginea lui albă): ce face **Backspace**? (îl șterge ca Delete / nimic). Și
  Home › **Cut** / Ctrl+X cu graficul ales: decupează graficul? Scenariul care lămurește: m2-l11, graficul Line pe LUNI,
  ales, Backspace → `grafice_pe_foaie`. (Simulatorul: Backspace `fara_efect`, Cut lucrează pe celule; pe telefon graficul
  se mută cu degetul, dar ștergerea lui fără tasta Delete rămâne nedovedită.)
- [ ] **R17-2** Chart Design › Add Chart Element › **Data Labels ▸** pe un grafic **Clustered Bar** și pe un **Pie**: ce rânduri
  are lista (`lista.AddChartElementMenu#Data Labels#Clustered Bar`, `#Pie`)? (Simulatorul: mesajul central la Bar / Pie.)
- [ ] **R17-3** Graficul Line cu etichetele **Right**, apoi Change Chart Type › Column › OK (m2-l11:69, „Titlul și etichetele
  rămân”): ce `Position` au etichetele după schimbare (Outside End? altul?) și rămân `HasDataLabels`? (Simulatorul: starea
  păstrează „Right”, desenul le pune la capătul coloanei.)
<!-- RUNDA17-EXCEL:END -->

<!-- RUNDA18-WINDOWS:START (scris de constructorul rundei 18, 20.11.2026 — Windows 11 în bibliotecă; ce n-are referință) -->
- [ ] **R18-1** Start, pe Windows-ul real: ce SCRIE pe ecran sub o dală-folder („Browser, Folder cu elemente 6” în UI
  Automation) și sub o categorie din „Toate” („Productivitate categorie cu elemente 36, …”)? Doar „Browser” / „Productivitate”?
  O captură de ecran a Start-ului (sau `dump_shell_uia.py` cu textul copiilor) lămurește. (Simulatorul: dala arată numele
  întreg din referință; categoria arată doar pictogramele celor 3 aplicații.)
- [ ] **R18-2** Desktop › clic dreapta › **Nou ▸**: ce rânduri are submeniul (e aceeași listă ca Explorer › Nou: Folder,
  Comandă rapidă, …)? Captura `meniu_desktop` are doar rândul „Nou” (`extins: False`). (Simulatorul: lista din
  `uia_explorer.json › explorer_meniu_nou`.)
- [ ] **R18-3** Start › **Alimentare** (Oprire / Repornire / Repaus …), panoul **Căutare** (bara și caseta din Start) și
  **calendarul** de la ceas: nu sunt capturate. (Simulatorul: mesajul central standard, `data-lh-nesimulat`.)
- [ ] **R18-4** O fereastră oarecare (Notepad, Explorer) pe Windows 11: bara de titlu (înălțime, butoane, pictograma
  aplicației) și ce face clicul pe butonul ei din bară (activă → minimizată; minimizată → restaurată; neactivă → activă).
  (Simulatorul: așa, cu butoanele din `explorer_fereastra`.)
- [ ] **R18-5** Desktopul din laborator: ce pictograme are (Acest PC, Coș de reciclare, alte comenzi rapide?) și unde stau.
  (Simulatorul: Acest PC + Coș de reciclare, coloană la stânga; fundal albastru simplu.)
- [ ] **R18-6** Numele aplicațiilor pe butoanele barei când sunt deschise Word / PowerPoint / Paint („Word - 1 fereastră
  deschisă”?). Referința are doar Explorer, Excel, Chrome… (Simulatorul: Word, PowerPoint, Paint.)
- [ ] **R18-7** Butonul **Explorer** din bară și dublul clic pe **Acest PC** deschid File Explorer: legătura cu biblioteca
  Explorer (banda r15) vine după ce ambele trec de critic. (Simulatorul: eveniment + mesajul central.)
- [ ] **R18-8** **Afișați desktopul** (colțul din dreapta al barei): minimizează toate ferestrele, iar al doilea clic le
  aduce înapoi? (Simulatorul: doar minimizează.)
- [ ] **R18-9** Start deschis: caseta „Casetă de căutare” (Edit, [479,154,689,32] în captură) se vede pe ecran sau e a
  ferestrei de căutare ascunse? (Simulatorul: n-o desenează; pe ecran rămâne butonul „Căutați aplicații, setări și documente”.)
<!-- RUNDA18-WINDOWS:END -->

<!-- RUNDA15-EXPLORER:START -->
## Runda 15 · B-explorer (File Explorer în bibliotecă) — de verificat pe Windows real
Fiecare rând: ce NU dă referința înghețată + scenariul care l-ar lămuri. Până atunci simulatorul face ce scrie în paranteză și NU se numără fidel.
- **R15-1** Referința e PC-ul profesorului, nu laboratorul: unitățile RamDisk (A:), Google Drive (G:), Volum nou (W:), tipul „FastStone PNG File”, rândurile meniurilor din programe instalate de el (Dropbox, Notepad++, 7-Zip, PDF24, Bytello, ShareX…). Scenariu: o sesiune UIA de 10 minute pe un PC din laborator (explorer_fereastra, explorer_meniu_fisier, _fisier_clasic, _nou), ca referință a doua. (azi: etichetele profesorului)
- **R15-2** Tragerea în vederea Detalii: de pe un rând NEALES, apucat de coloana „Data modificării”, mută fișierul sau desenează dreptunghiul de selecție? Scenariu `gest_real`: trage 100 px în jos de coloana Data a unui fișier neales; citește selecția și locul fișierului. (azi: de pe nume sau rând ales = mutare; altfel dreptunghi)
- **R15-3** Meniul de clic dreapta pe un element din Coșul de reciclare (scenariul dă doar „Restaurare”). Scenariu: captura UIA a meniului. (azi: un singur rând, „Restaurare”)
- **R15-4** Meniul clasic de pe fundal („Afișați mai multe opțiuni” din meniu_fundal), submeniurile Sortați după / Grupare după / Vizualizare / Nou din meniu_fundal și meniul „Mai multe opțiuni” (…) din bara de comenzi. Scenariu: capturi UIA. (azi: mesajul central „aici nu e simulată”; „Nou” deschide meniul Nou al barei de comenzi)
- **R15-5** Bara de stare: forma la singular („1 element”?), pragul „de” (20 de elemente?) și textul selecției („1 element selectat”, dimensiunea). Scenariu: captura barei cu 1 element și cu o selecție. (azi: „N elemente”)
- **R15-6** Poziția submeniului Nou deschis din meniul de fundal. Scenariu: captura UIA cu submeniul deschis. (azi: lângă meniu)
- **R15-7** Ctrl+Z / Ctrl+Y după copiere, mutare, redenumire, ștergere în Coș, folder nou: ce anulează, eticheta „Anulare X” din meniul de fundal pentru fiecare operație, dacă cere confirmare. Scenarii `gest_real`. (azi: o unitate pe operație, eticheta „Anulare” + numele comenzii)
- **R15-8** Numele fișierelor noi din Nou › Document text / Microsoft Word Document / … Scenariu: Nou › Document text, Enter → nume_fisiere. (azi: doar Folder e simulat; restul = mesajul central)
- **R15-9** Dialogul Shift+Delete pe un FOLDER și pe mai multe elemente; dialogul de nume existent la redenumirea unui FOLDER. Scenarii model_obiect + captura textelor. (azi: mesajul central)
- **R15-10** Căutarea: pagina de rezultate („Rezultatele căutării în …”, coloane, recursiv). Scenariu: tastează în caseta Căutați, citește lista. (azi: filtru pe folderul curent)
- **R15-11** Fereastra îngustă (360-390 px): cum se strânge bara de comenzi (observat_vizual nu spune). Scenariu: captură cu fereastra la 390 px. (azi: se derulează lateral)
- **R15-12** Folderul gol: textul din listă („Acest folder este gol.”?). Scenariu: captura listei unui folder gol. (azi: lista goală)
- **R15-13** Enter / Esc în dialogurile Da/Nu (butonul implicit, ce face Esc). Scenariu `gest_real`. (azi: Enter = Da, Esc = Nu / Se omite)
- **R15-14** Bara de adrese în modul editare (Ctrl+L / F4): ce cale scrie pentru un folder din Documente; prima firimitură pentru Documente (referința are „Acest PC” pe o cale din C:). Scenariu: captura casetei. (azi: „Documente\<folder>”, firimitura „Acest PC”)
- **R15-15** Butonul „Mai multe” (…) al firimiturilor la cale lungă (în referință). (azi: nedesenat; căile lecțiilor sunt scurte)
- **R15-16** Panoul Detalii / Examinare pentru un fișier ales (ce arată). Scenariu: captură. (azi: pictograma fișierului)
<!-- RUNDA15-EXPLORER:END -->

<!-- RUNDA21-EXCEL:START (scris de constructorul rundei 21, 21.11.2026 — G17-1 / G17-2 ale criticului 17; ce n-are referință) -->
- [ ] **R21-1** Ecranul lui Excel după Ctrl+↓ până la **A1048576** (A1:A7 pline, A7 activă, 1366 × 768) și după Ctrl+→ până la
  **XFD7**: ce rânduri / coloane se văd (celula activă jos / la dreapta?) și cât de lat e antetul rândurilor la 7 cifre
  („1048576”). Scenariul care lămurește: `excel-ctrl-jos-ultimul-rand` jucat cu dump UI Automation pe `zona_document`
  (DataItem-urile antetelor de rând, Grid, bara Vertical). (Simulatorul, runda 21: fereastră de 150 de rânduri cu A1048576
  jos, antetul cât să încapă numărul — 26 px până la 3 cifre, ca referința; ~58 px la 7 cifre; XFD întreagă la stânga barei.)
- [ ] **R21-2** Rotița / bara verticală după Ctrl+↓ până la A1048576: cât urcă Excel (oricât, presupun). Scenariul: după
  Ctrl+↓, rotița în sus ×10 → primul rând vizibil. (Simulatorul: urcă doar până la primul rând al ferestrei, 1048427; Ctrl+↑,
  Ctrl+Home, ↑, Page Up merg. MĂRUNT.)
- [ ] **R21-3** Ctrl+Shift+↓ din A7 cu A8… goale (zona până la A1048576): Excel derulează până la capătul zonei sau rămâne
  la celula activă? Scenariul: `excel-ctrl-jos-ultimul-rand` cu Shift + `ActiveWindow.ScrollRow`. (Simulatorul, neschimbat:
  celula activă A7 rămâne în vedere, grila nu se mută la capăt.)
- [ ] **R21-4** Excel pe **ecran tactil**: degetul pus pe o celulă și tras pe grilă derulează foaia sau alege o zonă? Atingerea
  scurtă alege celula? Nu se poate juca invizibil (cere un ecran tactil) → pentru Vasile, pe o tabletă / un laptop cu ecran
  tactil. (Simulatorul, runda 21: degetul tras derulează, fără nicio schimbare de stare; atingerea scurtă alege celula, cu
  evenimentul `clic / selectare_celula`; pe telefon zona se alege din Name Box sau cu Insert pe zona curentă. Lecția
  m2-l11:62 „apasă pe A1, ține apăsat și trage până la C5” rămâne gest de mouse — criticul 17, [FARA_REFERINTA] 5.)
- **A17-1** (`de_aprobat.md`, runda 17: „celula de la A1048576 / XFD nu se vede”) e rezolvat de fereastra din runda 21 (celula
  activă se vede, `proba_grav.py › G1.1`, `G1.10`): rămâne ca orchestratorul să-l închidă după confirmarea criticului 21.
<!-- RUNDA21-EXCEL:END -->

<!-- RUNDA19-EXPLORER:START (scris de constructorul rundei 19, 21.11.2026 — unghiul gest_tastatura pe File Explorer; ce n-are referință) -->
## Runda 19 · B-explorer · tastatura — de verificat pe Windows real
Referința înghețată (`uia_explorer.json`) dă scurtături doar pentru: Înapoi Alt+Stânga, Înainte Alt+Dreapta, Până la … Alt+Sus,
Reîmprospătare F5, Deschideți Enter, Copiere ca o cale Ctrl+Shift+C, Proprietăți Alt+Enter, Decupare Ctrl+X, Copiere Ctrl+C,
Redenumire F2, Ștergere del, Anulare Copiere Ctrl+Z (+ tastele din scenariile `explorer_*`: Ctrl+A, Ctrl+V, Delete, Shift+Delete,
Enter, F2). Restul de mai jos merge azi cum scrie în paranteză și NU se numără fidel până la o captură.
- **R19-1** Tab / Shift+Tab între zone (panoul de navigare, bara de adrese, căutarea, bara de comenzi, lista). Scenariu `gest_real`:
  Explorer deschis pe un folder, focusul în listă, Tab de 6 ori; după fiecare, UIA `FocusedElement` (nume, tip). (azi: Tab nu mută
  focusul, `tasta_tab` → `fara_efect`; `aplicatii.js:390` oprește Tab-ul implicit în afara câmpurilor)
- **R19-2** Săgețile în lista din vederea Detalii: ← / → (mută selecția sau derulează?), Home / End, căutarea rapidă după literă
  (o literă sau un șir tastat repede), Esc pe listă. Scenariu `gest_real`: 5 fișiere, primul ales, apoi →, ←, End, Home, „t”, Esc;
  după fiecare, `selectie`. (azi: → = ↓, ← = ↑; Home / End = primul / ultimul; o literă = primul nume cu ea; Esc = nimic ales)
- **R19-3** Ctrl+Shift+C fără nimic ales (calea folderului curent?) și în Coș; Alt+Enter cu nimic ales (Proprietăți ale folderului)
  și pe un element din Coș. Scenariu: aceleași taste, apoi clipboardul / fereastra deschisă (titlul). (azi: Ctrl+Shift+C fără
  selecție / în Coș = `fara_efect`; Alt+Enter oriunde = mesajul central „Proprietăți”)
- **R19-4** Backspace = Înapoi, Ctrl+Shift+N = Folder nou (cu caseta de nume), F4 și Ctrl+L = editarea adresei (textul selectat),
  Ctrl+E și Ctrl+F = caseta Căutați, Ctrl+Y / Ctrl+D. Scenariu `gest_real`: fiecare tastă pe un folder de probă, apoi UIA
  `FocusedElement` + folderul curent + `nume_fisiere`. (azi: toate implementate așa; trec `runde/19/proba_grav.py › tast`)
- **R19-5** Redenumirea întreruptă: Tab în casetă, clic într-o altă fereastră, Enter cu numele gol, nume cu caractere interzise
  (`\ / : * ? " < > |`). Scenariu `gest_real` + captura balonului de avertizare. (azi: Tab mută focusul afară și încheie
  redenumirea cu textul scris; numele gol / interzis: cum le tratează `redenumeste`, neverificat față de real)
- **R19-6** Pe telefon (Windows nu are; e convenția bibliotecii, I1): după „Nou › Folder” atins, caseta rămâne deschisă cât timp
  degetul nu atinge altceva; tastatura virtuală apare la `focus()` dat după atingere — dovedit doar în Chromium headless
  (`page.touchscreen`, CDP `Input.insertText`), nu pe un telefon adevărat (Chrome Android, Safari iOS). Scenariu: proba
  `runde/19/proba_grav.py e2` pe un telefon real prin `adb` / Safari Web Inspector.
- **R19-7** Tastatura într-un meniu deschis (Nou, Sortați, Vizualizați, meniul de clic dreapta): ↑ / ↓ / Enter / Esc / literele
  subliniate; Shift+F10 și tasta Meniu pe un element ales. Scenariu `gest_real`: meniul Nou deschis cu clic, ↓, ↓, Enter; UIA
  după fiecare (elementul evidențiat, ce s-a creat). (azi: cu meniul deschis, ↑ / ↓ mută selecția din LISTĂ, nu din meniu; Enter
  deschide elementul ales din listă; Esc închide meniul; Shift+F10 = `tasta_f10` → `fara_efect`)
<!-- RUNDA19-EXPLORER:END -->

<!-- RUNDA22-WINDOWS:START (scris de constructorul rundei 22, 21.11.2026 — Windows: căutarea și tastatura din Start, bara, telefonul) -->
## Runda 22 · Windows — ce n-are referință (simplu, fără pretenție de fidelitate)
- **R22-1** **Panoul de rezultate al căutării din Start** (după „pai”, „calc”): aspectul, titlurile („Cea mai bună potrivire” / Best match?), gruparea aplicații / documente / web, panoul din dreapta. Sursa de azi: pagina Microsoft „Use a screen reader to explore and navigate the Start menu in Windows” spune doar că lista se actualizează la fiecare literă, că e grupată pe aplicații / documente / web, că Sus/Jos o parcurg și că Enter deschide. Scenariu: în sesiunea cu Vasile, tasta Windows, apoi „pai” → UIA pe „Meniul Start” + o captură decupată; la fel pentru „calc”. (azi: o listă simplă de aplicații, fără titluri; fără potrivire = mesajul central)
- **R22-2** **Ce pornește din căutare**:
  - Paint și Calculator nu apar în `uia_windows.json`. Numele vin din lecția v/m2-l08.
  - Nu știm dacă Calculator e primul rezultat la „calc” și nici titlul ferestrei lor.
  - Scenariu `gest_real`: „calc” + Enter, apoi UIA pe fereastra pornită (titlul, butoanele).
  - Azi: fereastra generică R18-4, cu titlul aplicației și butonul ei în bară. Conținutul ei = mesajul central.
- **R22-3** **Numele categoriei sub cutie, în Start › „Toate”**:
  - E dedus din geometrie: cutia are 192 px, iar grila 2×2 de 68 px ocupă 146.
  - Textul vine din numele UIA, partea dinaintea lui „ categorie cu elemente”.
  - Scenariu: o captură decupată a vizualizării pe categorii.
- **R22-4** **Pictograma Explorer de pe bară și indiciul de la trecerea mouse-ului.**
  - UIA nu dă nici forma, nici textul indiciului, nici după cât timp apare (azi: 0,5 s).
  - Azi: dosarul galben e o formă proprie, aceeași ca în `explorer.js`; setul Fluent local n-are dosarul.
  - Indiciul arată numele din referință fără sufixul „fixat” / „- N ferestre deschise”, doar pentru butoanele din mijlocul barei.
  - Scenariu: o captură decupată a barei + mouse-ul 2 s pe Explorer, cu UIA pe ToolTip.
- **R22-5** **Ordinea completă a tastei Tab în Start** (după Fixate: „Afișați mai puține”, Recomandate, Toate, contul, Alimentare). Și: unde duce săgeata Jos din caseta goală.
  - Pagina Microsoft spune doar „press the Tab key until you hear "Pinned"”, apoi „use the arrow keys”.
  - Scenariu `gest_real`: tasta Windows, apoi Tab de 8 ori, citind focusul cu UIA după fiecare apăsare.
  - Azi: Tab duce din casetă la prima dală fixată și înapoi. Săgețile mută focusul pe grilă, la cel mai apropiat element din direcția apăsată.
<!-- RUNDA22-WINDOWS:END -->

<!-- RUNDA20-WORD:START (scris de constructorul rundei 20, 21.11.2026 — GRAV K1 din runde/16/critic.md: Tab în ferestrele de fișiere; ce n-are referință) -->
## Runda 20 · Word · Tab, Enter, Space și Esc în ferestrele de fișiere — de lămurit (un minut fiecare)

Până la răspuns, simulatorul face ce scrie în paranteză.

- [ ] **R20-1** Word, **F12** (Save As), apoi **Ctrl+F12** (Open), **Ctrl+S** pe document nou („Save this file”) și **Ctrl+W** pe
  document modificat („Save your changes…”): `FocusedElement` (UI Automation) după fiecare Tab, de la File name până revine în
  File name, și după 8 × Shift+Tab. Ce ar închide rândul: lista ordonată a controalelor, pe fiecare fereastră. (Simulatorul: Tab nu
  iese niciodată din fereastră; ordinea = ordinea nodurilor din `uia_word.json`, prin cârligul comun `aplicatii.js › I.tabFereastra`
  — din File name: Save as type, Autori, Etichete, Titlu, Save Thumbnail, Hide Folders, Tools, Save, Cancel, apoi bara de adrese,
  căutarea, bara de unelte, butoanele barelor de derulare și capetele de coloană; lista „Vizualizare elemente” și panoul din stânga
  NU sunt opriri, pentru că cârligul comun nu oprește pe List / Tree. `runde/20/proba_grav_dupa.json › K1_ocol_*`.)
- [ ] **R20-2** Word, F12, Alt+T, Alt+↓ (lista Save as type deschisă), ↓ de două ori, apoi **Tab**: lista se închide? tipul din
  casetă rămâne cel vechi sau devine rândul marcat? unde e focusul? (Simulatorul: lista se închide, tipul rămâne cel vechi, focusul
  trece pe controlul următor.)
- [ ] **R20-3** Word, document salvat și modificat, **Ctrl+W** („Save your changes…”), apoi **Esc**: documentul rămâne deschis și
  nesalvat, ca la Cancel? Aceeași întrebare pentru Esc în „Save this file” (Ctrl+S pe document nou). Fereastra e desenată de Office,
  nu e `#32770`, deci regula Windows IDCANCEL nu e dovedită pentru ea. (Simulatorul: Esc = clicul pe Cancel — documentul rămâne
  deschis, `stare().dialog.apasat` = „Cancel”, evenimentul `tasta_esc` poartă `activat` = ținta lui Cancel.)
- [ ] **R20-4** Word, Save As / „Save your changes…”: Tab până la **Cancel** (sau **Don't Save**), apoi **Enter**; Tab până la
  Cancel, apoi **Space**: se apasă butonul cu focusul, nu Save? (Simulatorul: da — ca regula Windows „butonul cu focusul primește
  Enter”, folosită deja de PowerPoint, critic 13 › T1. Pentru ferestrele Office desenate de Word, regula e [presupus].)
<!-- RUNDA20-WORD:END -->
