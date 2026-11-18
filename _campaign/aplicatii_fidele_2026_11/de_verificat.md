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
