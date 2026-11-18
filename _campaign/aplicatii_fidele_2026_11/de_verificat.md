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
