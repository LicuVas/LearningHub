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
- [ ] **R6-1** Excel, B1 activă, A1:A3 = 4, 5, 6: tastezi `=SUM(A1,A2)` și Enter. Apare o fereastră (ce scrie, ce butoane)
  sau Excel rămâne doar în editare? (`excel-separator-virgula` are `mod_probat: false`.) (Simulatorul: rămâne în editare,
  fără mesaj, ca citirea de atunci.)
- [ ] **R6-2** Excel, A4 activă: tastezi `=SU`. Ce funcție e aleasă primă în lista care apare (SUBSTITUTE?), iar după Tab ce
  scrie în celulă? (`excel-autocompletare-tab`, `mod_probat: false`.) (Simulatorul: Tab scrie „=SUBSTITUTE(”, prima funcție
  în ordine alfabetică din cele simulate; cu `A1:A3)` + Enter rămâne în editare.)
- [ ] **R6-3** Excel, o celulă goală: tastezi `7.1`, `7.9`, `7.12` și Enter. Ce text arată celula (luna scurtă: „ian”,
  „sept”…?). Doar „mai” e probat (`excel-zecimale-punct`: „07.mai”). (Simulatorul: ian, feb, mar, apr, mai, iun, iul, aug,
  sept, oct, nov, dec — nedovedite.)
- [ ] **R6-4** Excel, registru nou (Book1), Ctrl+S: se deschide pagina **File › Save As** sau o fereastră mică „Save this
  file” (ca la Word)? O captură UI Automation ar închide rândul. (Simulatorul: pagina File › Save As.)
- [ ] **R6-5** Scenariul `excel-salvare-ca` cere `fila: FileTab` + `id_mso: FileSaveAs`, dar în Excel real (referința)
  butonul File are idMso `FileTabButton`, iar „Save As” din Backstage n-are idMso. Scenariul se poate juca doar dacă e
  rescris (o rundă `acoperire`): File → Save As → Browse → File name. (Simulatorul face drumul real; starea „Note.xlsx”
  e probată în `runde/6/proba_excel.py`, cazul gest.salvare_ca.)
- [ ] **R6-6** Excel, selectezi B2:C4 cu numere: bara de stare arată „Average: … Count: … Sum: …”? În ce ordine și unde?
  Referința are bara de stare a unei foi goale. (Simulatorul: nu le arată.)
- [ ] **R6-7** Excel, `=1/3` și Enter, coloana lată de 64 px: ce text arată celula („0,333333”?). (Simulatorul: cel mult
  10-11 caractere, ca formatul General — lățimea exactă nedovedită.)
<!-- RUNDA6-EXCEL:END -->

## Runda 7 · Excel (unghiul gest_tastatura) — de lămurit (un minut fiecare, pe PC-ul cu Excel)
<!-- RUNDA7-EXCEL:START -->
- [ ] **R7-1** Excel, B2:B6 cu numere, B8 activă: săgeata ▾ de lângă Σ (AutoSum). Ce rânduri are lista (Sum, Average, Count
  Numbers, Max, Min, More Functions…?), în ce ordine, și ce scrie Average în B8? O captură UI Automation a listei într-o rundă
  `acoperire` ar închide rândul. (Simulatorul: mesajul central; lecția m2-l08:63 cere „Medie (Average)”.)
- [ ] **R7-2** Excel: tastezi `=SUM(B2:B7)B2:B6` și Enter. Ce fereastră apare (titlu, text, butoane)? (`com_r6b.json › D4`
  arată doar că Excel n-o primește.) (Simulatorul: rămâne în editare și arată mesajul central „Excel nu primește formula…”.)
- [ ] **R7-3** Excel, coloana A de 64 px: tastezi de mână `1234567890` și `12345678901234`, apoi `=25/3` în A3. Se lățește
  coloana la primele două (până la ce lățime)? La a treia nu? (Probat doar „741234567” → întreg, `excel-zero-in-fata`.)
  (Simulatorul: numărul TASTAT în format General lățește coloana cât să încapă; formula și conținutul de pornire nu.)
- [ ] **R7-4** Excel, coloana de 64 px: `=1/30000` (0,0000333…) și `=1/7000000`. Ce text arată („3,33E-05”? „0,000033”?).
  (Simulatorul: sub 0,0001 trece în notație științifică — prag ales, nedovedit.)
- [ ] **R7-5** Excel, E5 activă: clic dreapta pe litera C. Se alege coloana C (meniul apoi Column Width… pune lățimea pe C)?
  (Simulatorul: da — clicul dreapta pe o literă din afara selecției alege coloana.)
- [ ] **R7-6** Excel: dublu clic pe linia dintre A și B, cu „Situația notelor la informatică” în A1. Ce lățime ia A
  (Column Width… o arată în caractere)? (Simulatorul: textul măsurat + 7 px.)
- [ ] **R7-7** Excel, după Σ: ce mod scrie bara de stare (Enter / Point)? (Simulatorul: „Enter” până la primul clic pe o
  celulă, apoi „Point”.)
- [x] **R6-7** (din runda 6) — lămurit de criticul 6: `runde/6/critic_probe/com_r6.json` (Range.Text, Excel real) dă
  „0,333333” la `=1/3` în coloana de 64 px; afișarea după lățime e acum în `excel.js › inLatime`.
- [ ] **R7-8** Excel: săgeata ▾ de lângă găleata Fill Color. Ce are galeria (Theme Colors, Standard Colors, No Fill, More Colors…)
  și în ce ordine? O captură UI Automation într-o rundă `acoperire`. (Simulatorul: mesajul central „Fill Color”; butonul pune galben,
  `com_r7c.json › fill`.)
- [ ] **R7-9** Excel: lista Borders ▾ deschisă. Titlurile grupurilor („Borders”, „Draw Borders”?), pictogramele, mărimea rândurilor.
  (Simulatorul: lista din S11 în ordinea de acolo, cu etichetele din `GetLabelMso`, fără titluri; `excel.js › meniuBorduri`.)
- [ ] **R7-10** Excel: B2 cu Wrap Text, apeși din nou Wrap Text. Se oprește încadrarea? Rândul revine la 14,4 pt? (`com_r7c.json ›
  wrap_din_nou`: al doilea `ExecuteMso` n-a schimbat nimic — neconcludent.) (Simulatorul: comutator; rândul revine la 19 px.)
- [ ] **R7-11** Excel: Data › Sort pe un tabel cu antet, apoi Add Level. Ce scrie în stânga rândului al doilea („Then by”?)
  și cum se numește în UI Automation (DataItem / ComboBox)? Referința are un singur nivel (`uia_excel.json › dialog.SortDialog`),
  iar `surse_microsoft.md` nu are pagina. O captură UIA după Add Level, într-o rundă `acoperire`, închide rândul. (Simulatorul:
  „Then by”, din lecția m2-l10:63.)
- [ ] **R7-12** Excel, fereastra Sort: lista Order pe o coloană cu numere („Smallest to Largest”, „Largest to Smallest”, „Custom
  List...”?) și pe una cu text („A to Z”, „Z to A”, „Custom List...”?); se schimbă singură ordinea când alegi o coloană cu numere?
  Lista Sort On (doar „Cell Values” sau și Cell Color / Font Color / Conditional Formatting Icon)? Fără „My data has headers”,
  coloanele se numesc „Column A”…? (Simulatorul: așa, din lecția m2-l10:63 și din butoanele panglicii.)
- [ ] **R7-13** Excel: C2:C7 aleasă într-un tabel A1:C7, butonul Sort Largest to Smallest de pe fila Data. Apare Sort Warning
  (referința a deschis-o prin `ExecuteMso('SortDialog')`, nu prin buton)? Unde apare pe ecran (captura: x = -27, deci la marginea
  din stânga)? (Simulatorul: apare și la butoane, ca în lecția m2-l10:62, :148; poziția din referință, adusă în fereastră.)
- [ ] **R7-14** Excel, fereastra Sort: OK cu un nivel fără coloană (ce fereastră de eroare?); Add Level adaugă rândul la coadă sau
  sub nivelul ales? Delete Level pe ultimul nivel rămas? (Simulatorul: mesajul central „Sort”; la coadă; se poate șterge tot, OK
  închide fără sortare.)
- [ ] **R7-15** Excel: registru nou, scrii ceva, Ctrl+W. Fereastra „Want to save your changes to Book1?” (titlu, text, butoanele
  Save / Don't Save / Cancel, care e apăsat de Enter)? Nu e în `uia_excel.json`. (Simulatorul: mesajul central „Close (Ctrl+W)”,
  registrul rămâne deschis.) Și: în Chrome pe calculator, Ctrl+N / Ctrl+W sunt ale browserului (nu ajung la pagină; proba headless le
  trimite prin CDP) — elevul are File › New › Blank workbook și File › Close.
- [ ] **R7-16** Excel, un singur registru, nemodificat: Ctrl+W. Cum arată fereastra fără registru (zona gri? panglica gri? titlul
  „Excel”?). O captură UIA într-o rundă `acoperire`. (Simulatorul: zona documentului gri, fără celule; titlul „Excel”; Ctrl+N deschide BookN.)
- [ ] **R7-17** Excel, Save As (F12): ce rânduri are panoul din stânga pe un profil curat și în ce ordine (referința Excel le are
  „nesalvat”)? (Simulatorul: Acasă, Galerie, Documente, Acest PC, Rețea, la 24 px, ca în Word.)
- [ ] **R7-18** Excel: redenumirea foii cu un nume care există deja sau cu `/` — ce fereastră apare? Se poate anula cu Ctrl+Z?
  (Simulatorul: numele rămâne cel vechi, fără mesaj; redenumirea nu intră în Ctrl+Z.)
- [ ] **R6-4 · DE ACOPERIT (runda 7)** Excel: Ctrl+S pe un registru nou, nesalvat. Ce fereastră se deschide (pagina File › Save As,
  fereastra „Save this file” ca în Word, sau Save As)? Captura lipsește din `uia_excel.json`; lecția m1-l03:95-97 descrie „Save this
  file”. Simulatorul a rămas cum era (pagina File › Save As) — nu s-a inventat nimic.
- [ ] **R7-19** Excel, foaie goală, 1366 × 768: culoarea barelor de derulare și a cursorului, desenul săgeților, mărimea cursorului
  când derulezi (referința: cursorul orizontal 450 din 491 px, vertical 442 din 462 px, pe o foaie goală — Excel îl calculează după
  zona folosită, nu după 40 × 26 de celule). Ce e despărțitorul [806,714,32,31] (⋮, trage lățimea filelor?). (Simulatorul: gri
  deschis, săgeți Fluent, cursorul proporțional cu grila desenată; despărțitorul gol.)
<!-- RUNDA7-EXCEL:END -->
