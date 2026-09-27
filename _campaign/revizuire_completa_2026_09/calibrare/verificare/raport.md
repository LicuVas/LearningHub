# Verificarea independentă a dicționarului RO↔EN (meniuri_ro_en.json)

Data: 27.09.2026. Am verificat din nou, pe surse, fără să am încredere în autor. Am descărcat fiecare pagină și am căutat în textul ei citatul exact. Toate dovezile, cu citate, sunt în `verificare_independenta.json`. Eșantionul l-am ales cu `alege.py` (`random.Random(777)`). Nu am modificat `meniuri_ro_en.json` și nu am făcut commit.

## Pe scurt

- **Afirmația mare e ADEVĂRATĂ.** În Excel-ul în română se scrie `=SUM(`, `=AVERAGE(`, `=IF(`, `=COUNTIF(`. `=SUMA(` dă `#NAME?`. Singura inexactitate: butonul din panglică **nu** se numește «Sumă», ci **«Însumare automată»**. «Sumă» e doar prima opțiune din lista lui.
- **Eșantionul de 20:** 18 nume corecte, 1 greșit (Print Area), 1 nesigur (Format Shape).
- **Sursele sunt însă mult mai slabe decât pare.** La 13 din cele 20 de intrări, cel puțin una dintre cele „2 surse” nu conține deloc numele respectiv sau citatul nu există pe pagină. Scriptul `verifica_calibrare.py` nu putea prinde asta: el verifică doar că există două adrese și un text, nu că textul chiar se află pe pagină.
- **Din cele 13 intrări NESIGUR:** 11 le-am rezolvat cu o sursă nouă. 2 rămân „probabil” (FIND și #VALUE!).
- **Separatorul `;` și virgula zecimală:** confirmate, cu o nuanță importantă. Ele vin din setările regionale ale **Windows-ului**, nu din limba Office-ului.
- **TVA 21% de la 01.08.2025:** confirmat pe textul oficial al Legii 141/2025.

## 1. „Excel-ul românesc nu traduce funcțiile” — CONFIRMAT

Am adus 7 dovezi noi, niciuna din fișierul autorului:

| # | Sursă | Ce arată (citat) |
|---|---|---|
| 1 | en.excel-translator.de/sum/ (independent) | SUM tradus în 18 limbi: „German SUMME, French SOMME, Spanish SUMA, Polish SUMA, Turkish TOPLA…”. **Româna lipsește.** |
| 2 | office-watch.com (2026, independent) | „The main ones are: French, German, Spanish, Italian, Portuguese…, Dutch, Polish, Russian, Czech, Hungarian, Turkish, Swedish, Danish, Norwegian, Finnish, Catalan, Basque, Galician and Simplified Chinese.” **Româna lipsește.** |
| 3 | easy-excel.com (independent) | Lista limbilor cu funcții traduse: „Catalan, Czech, Danish, Dutch, …, Spanish, Swedish, Turkish”. **Româna lipsește.** |
| 4 | vijolitic10.blogspot.com (profesor român de TIC, cls. a X-a) | **Dovadă directă:** panglica e în română („butonului Însumare automată ( AutoSum ) din tabul Pornire → grupul Editare”), iar funcțiile sunt în engleză, cu `;` și virgulă zecimală („SUM(3;5)”, „=AVERAGE(B13:B16) = 5,25”). |
| 5 | Probă de control: aceeași pagină Microsoft în spaniolă vs română | Spaniolă: „Función SUMA … =SUMA(A2:A10)”. Română: „=SUM(A2:A10)”. Microsoft traduce numele funcției acolo unde Excel îl traduce. În română nu îl traduce. |
| 6 | Microsoft ro-ro, pagina Însumare automată | „selectați Însumare automată pe fila Pornire … Excel introduce automat o formulă (care utilizează funcția SUM )” și „Atingeți Însumare automată . Atingeți Sumă .” |
| 7 | Excel-ul real de pe acest calculator (rulat ascuns) | `=SUMA(1,2)` → `#NAME?`, `=SUM(1,2)` → `3`. |

Nuanțe:
- Rezultatul nu depinde de versiune: dovezile merg de la Excel 2007/2010 (blogul din 2013) până la Microsoft 365 (pagina din 2026). Totul privește însă **Microsoft Excel**. LibreOffice nu l-am verificat.
- Dovada 7 e făcută pe un Excel cu interfață **engleză**. Ea arată doar că `SUMA` nu e un nume de funcție în limbajul de formule, adică în numele pe care le scrii în celulă. Dovezile 1–5 arată că Excel-ul românesc folosește exact același limbaj de formule.
- Am mai găsit un manual Corint din 2006, aprobat de minister, care scrie `=PMT (D2;E2;0;A2)` și `=PV(0,0075;240;400)`. Meniurile lui sunt însă în engleză, așa că nu l-am numărat ca dovadă.

## 2. Eșantionul de 20 de intrări CONFIRMAT (sămânța 777)

| Nr. | EN | RO în fișier | Verdict | Ce am găsit |
|---|---|---|---|---|
| 5 | NOT | NOT | corect | `=NOT(A2>100)` pe pagină, niciun `=NU(`. |
| 33 | ISERROR | ISERROR | corect | ambele surse OK |
| 38 | SUMPRODUCT | SUMPRODUCT | corect | ambele surse OK |
| 42 | TEXT | TEXT | corect | am găsit 12 exemple, nu 15 cum scrie citatul |
| 55 | group | grup | corect | citatul Microsoft există, cuvânt cu cuvânt |
| 59 | Page Layout | Aspect pagina | corect* | oficial: „Aspect pagină” |
| 62 | Review | Revizuire | corect | + sursă Microsoft nouă |
| 70 | View (Word) | Vizualizare | corect | sursa Microsoft din fișier nu conține cuvântul; am găsit alta |
| 81 | Number | Numar | corect* | sursa 2 era o frază generică, nu un citat; Microsoft: „grupul Număr de pe fila Pornire” |
| 83 | Conditional Formatting | Formatare conditionata | corect* | sursa 2 era o frază generică; Microsoft: „Formatare condiționată” |
| **86** | **Print Area** | **Zona de tiparire** | **GREȘIT** | Microsoft: „faceți clic pe **Zonă de imprimat**”; în alt loc „zonă de imprimare”. „Tipărire” nu apare. |
| 89 | Cut | Decupare | corect | primul citat nu există pe pagină; Microsoft: „selectați Decupare” |
| 92 | Sort | Sortare | corect (indirect) | primul citat nu există pe pagină; am găsit doar „Sortare & Filtrare” |
| 98 | Editing (Word) | Editare | corect | citatul Microsoft vorbea de altceva (fereastra de editare); Microsoft: „în grupul Editare” |
| 110 | Superscript | Exponent | corect | citatul itlearning nu există |
| 120 | Header | Antet | corect | citatul Microsoft nu există; am găsit altă pagină Microsoft |
| 126 | New Slide | Diapozitiv nou | corect | o singură sursă reală |
| 130 | Pictures | Imagini | corect | o singură sursă reală |
| 132 | Format Shape | Format forma | nesigur | pagina Microsoft scrie și „Format formă”, și „Formatare formă” |
| 140 | Photo Album | Album foto | corect | citatul Microsoft nu există; am găsit altă pagină Microsoft |

\* numele e bun, dar scris fără diacritice.

## 3. Cele 13 intrări NESIGUR (+ 1 NEGĂSIT)

- **Rezolvate cu sursă nouă (11):**
  - LOWER, MID, HLOOKUP, MOD, ABS: pagina fiecărei funcții are exemple doar cu numele englezesc (ex. `=MOD(3; 2)`).
  - MATCH, VALUE, TODAY: pagina fiecărei funcții are exemple doar cu numele englezesc.
  - #NULL!: are acum a doua sursă.
  - Formulas → **Formule**: confirmat pe pagina oficială de comenzi rapide.
  - Bold → **Aldin**.
- **Contradicția MATCH/POTRIVIRE și VALUE/VALOARE e lămurită.** În lista alfabetică Microsoft, „POTRIVIRE” stă exact pe locul alfabetic al lui MATCH. La fel „VALOARE” stă pe locul lui VALUE, „ASTĂZI” pe locul lui TODAY și „NUMĂRVALOARE.” pe locul lui NUMBERVALUE. Deci sunt numele englezești traduse automat de site-ul Microsoft, nu nume reale de funcții.
- **Bold:** oficial se numește „Aldin”. „Îngroșat” vine de pe itlearning.ro, care folosește Office în engleză și își traduce singur termenii (tot acolo scrie „Italic – Inclinat”, deși oficial e „Cursiv”). „Îngroșat” poate rămâne doar ca explicație pentru elevi.
- **Rămân „probabil” (2):**
  - **FIND:** pagina Microsoft a fost retrasă, iar altă sursă nu am găsit. FIND rămâne sprijinit doar de regula generală de la punctul 1.
  - **#VALUE!:** contradicția se explică. Paginile Microsoft în română traduc automat și codurile de eroare: pagina ERROR.TYPE are „#VALOARE!”, „#NUME?” și chiar o formulă stricată, „=IF(EROARE. TYPE(A3)<3,CH”. Cel mai probabil Excel-ul arată `#VALUE!`. Lipsește însă o captură dintr-un Excel cu interfață românească.
  - **Probă de 10 secunde într-un laborator cu Office RO:** scrieți `=1+"a"` și vedeți ce eroare apare.
- **NEGĂSIT, CMMDC/CMMMC:** pe sit nu sunt formule Excel. Sunt notații de matematică din lecțiile de algoritmi (Euclid): „CMMMC(a, b) = (a × b) / CMMDC(a, b)”. Nu trebuie corectate. În Excel, funcțiile corespunzătoare sunt GCD și LCM.

## 4. Separatorul `;` și virgula zecimală — CONFIRMAT, cu o nuanță

- Microsoft (Learn) spune: „an error will occur if trying to use a symbol that isn't the default 'list separator' in the Windows Regional settings.” Adică dacă scrii alt separator decât cel din setările regionale Windows, formula dă eroare.
- Setările Windows pentru ro-RO: separator de listă `;`, separator zecimal `,`, separator de mii `.`.
- Excel-ul de pe acest calculator are interfață **engleză**, dar Windows-ul are format regional **românesc**. Rezultatul: Excel folosește `;` și `,`.
- **Consecința pentru lecții:** separatorul NU ține de „Excel în română”. Ține de formatul regional al calculatorului.
  - Office în engleză pe un Windows cu format românesc → `;` și `,`.
  - Office în română pe un Windows cu format american → `,` și `.`.
  - Formularea corectă în lecții: „pe calculatoarele cu format regional românesc”.

## 5. TVA — CONFIRMAT

- Pe Portalul Legislativ (legislatie.just.ro), Legea nr. 141 din 25 iulie 2025 e „Publicat în MONITORUL OFICIAL nr. 699 din 25 iulie 2025”.
- Articolul 291, așa cum îl modifică legea: „nivelul acesteia este 21%. (2) Cota redusă de 11% se aplică…”.
- Intrarea în vigoare: „Prevederile art. II-VI intră în vigoare la data de 1 august 2025”.
- 21% e încă valabil în 2026. Sursa e un articol Digi24 din 11.08.2026, care redă precizările ANAF (e presă, nu document oficial).
- Mai există o cotă tranzitorie de 9% pentru locuințe, valabilă până la 30.09.2026. Nu afectează lecțiile.

## 6. Probleme de fond ale fișierului (nu țin de o singură intrare)

1. **Citate care nu sunt citate.** Multe „surse” sunt fraze generice, de tipul „Terminologie generala … confirmata oficial MS” sau „itlearning.ro (grup) sau … confirma aceeasi eticheta”. La AutoSum, „citatul” e chiar textul intrării pus în paranteză. Regula „2 surse” e respectată doar pe hârtie.
2. **itlearning.ro și pdfcoffee nu pot dovedi etichetele oficiale românești.** Ele predau Office cu interfață engleză și pun în paranteză propria traducere: „Print (Tiparire)”, „Bold – Ingrosat”, „Backstage View – FIȘIER (Vedere din spatele scenei)”. Coincid des cu Office-ul românesc, dar nu mereu (vezi Print Area). Intrările de panglică sprijinite doar de ele trebuie reverificate pe paginile Microsoft.
3. **Nici paginile Microsoft în română nu sunt sigure singure.** Sunt traduse parțial automat (POTRIVIRE, VALOARE, ASTĂZI, #NUME?, #VALOARE!). Nota din fișier că erorile #NAME? etc. au fost găsite „CONSECVENT neschimbate pe toate paginile” e falsă: există pagina Microsoft „Corectarea erorilor #NUME?”.
4. **Fără diacritice.** 0 din 87 de intrări de panglică au diacritice, dar elevul vede pe ecran forma cu diacritice. Exemple: Aspect pagină, Formatare condiționată, Număr, Tranziții, Animații, Referințe, Ștergeți întreaga formatare, Tăiat cu o linie.

## 7. Corecturi propuse (NU le-am aplicat)

- #86 Print Area: `Zona de tiparire` → **`Zonă de imprimat`** (sursa: support.microsoft.com/ro-ro/excel/set-or-clear-a-print-area-on-a-worksheet).
- #91 AutoSum: `Suma (butonul Suma automata)` → **`Însumare automată`**; «Sumă» e doar opțiunea din lista butonului (sursa: support.microsoft.com/ro-ro/excel/use-autosum-to-sum-numbers-in-excel).
- README, paragraful 13: „butonul … SE NUMESTE «Sumă»” → „butonul se numește «Însumare automată»; din lista lui alegi «Sumă»”.
- #29 MATCH, #41 VALUE, #40 TODAY: păstrați doar numele englezesc și treceți intrarea la CONFIRMAT (POTRIVIRE, VALOARE și ASTĂZI sunt erori de traducere automată ale site-ului Microsoft).
- #105 Bold: `Aldin` (fără „Îngroșat” ca etichetă).
- #132 Format Shape: despărțiți în două intrări, fila „Format formă” și panoul „Formatare formă”; de confirmat în laborator.
- #82 Styles („Stiluri” sau „Stil”?) și #87 („Sortare și filtrare” sau „Sortare & Filtrare”?): de confirmat în laborator.
- #50 #NAME?: numele rămâne, dar scoateți afirmația „CONSECVENT neschimbate”.
- Toate intrările de panglică: puneți diacriticele.
- `verifica_calibrare.py`: adăugați o verificare că citatul chiar apare în textul paginii. Fără ea, scriptul dă 0 și când sursele nu dovedesc nimic.

## 8. Ce n-am putut verifica

- Nu am avut acces la un Office cu interfață românească. Etichetele de panglică și codurile de eroare le-am verificat doar pe documentația Microsoft (care e parțial tradusă automat) și pe un blog de profesor. Pentru #VALUE!, Print Area, Format Shape, Styles și Sort & Filter, cea mai sigură probă e o captură din laborator.
- Am verificat doar eșantionul de 20 și intrările nesigure. Celelalte ~100 de intrări CONFIRMAT au aceeași problemă cu sursele (punctul 6) și merită aceeași reverificare.

Afirmația 1 (Excel RO nu traduce funcțiile): CONFIRMATĂ; eșantion 20: 18 corecte, 1 greșită, 1 nesigură; NESIGUR rezolvate: 11 din 13.
Intrări cu nume greșit, cu sursă oficială: #86 Print Area („Zona de tiparire”) și #91 AutoSum („Suma automata”).
2
