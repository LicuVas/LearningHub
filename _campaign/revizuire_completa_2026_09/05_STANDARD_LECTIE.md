# Standardul lecției noi (27.09.2026)

## Ce a decis profesorul, cu vorbele lui (27.09.2026, 12:10)
> „Reluăm siteul de la capăt. Facem primele lecții la gimnaziu — măcar pentru primul modul. Apoi continuăm cu al doilea și tot așa. Ideea este că tot ce terminăm trebuie pus pe siteul live. Nu așteptăm până la final. Restul secțiunilor — modulul doi încolo — le marchezi ca fiind în lucru. Secțiunea cu jocuri e făcută mai bine, deci o lăsăm disponibilă.”
>
> „Totul trebuie să aibă accent practic și să fie instrucțiuni clare și ilustrate, plus posibilitatea de practică chiar în pagina respectivă. Conceptele se prezintă simplu și pe rând. Tot ce cerem să fie făcut să fie mai întâi expus/predat.”

„Modulul” = modulul din anul școlar (M1 = lecțiile 1-7 din `Calendar_ore_*.md`, 11.09-23.10 la Brauner). Ordinea lecțiilor = `C:\00\Projects\Info_Gimnaziu_2026\planificari\Calendar_ore_<clasa>.md` + `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json`.

## Forma
- O lecție din plan = O pagină = UN nivel pe pași pe motorul jocurilor (`jocuri\_motor\motor.js`; specificația: `jocuri\README.md` §4, „Nivelurile PE PAȘI”, și §6-§7).
- Calea: `C:\00\Projects\LearningHub\lectii\<v|vi|vii|viii>\m1-lNN\index.html` (NN = numărul lecției din Calendar_ore, cu două cifre). Motorul se încarcă relativ: `../../../jocuri/_motor/motor.css` și `../../../jocuri/_motor/motor.js`. `cheie:'lectie_<clasa>_m1_lNN'`.
- Ordinea din pagină: antet (titlul exact din Calendar_ore; `continuturi` copiate din programă; `obiectiv` = o propoziție; „Ai nevoie de”: lecțiile anterioare) → **pasul 0 „La ce folosește”** (fără acțiuni, o imagine din viața reală) → **3-5 pași** → **atelier** în simulator, cu teste numite care se bifează → **„Acum în aplicația adevărată”** (`diploma.provocare`) → **5 întrebări** de verificare → **„Ce am învățat”** (în ultimul pas sau în rezumatul diplomei).

## Regulile (fiecare se verifică; cine: S = script, A = agentul-începător, R = aplicația reală, J = judecător)
1. **Nimic cerut înainte de a fi predat** (S, A). Orice cuvânt de specialitate, tastă, buton, simbol, meniu folosit într-o instrucțiune, exercițiu, indiciu sau întrebare apare EXPLICAT mai înainte: într-un pas anterior al lecției sau într-o lecție trecută în „Ai nevoie de” (conținutul ei din unitati.json). Și indiciile respectă regula.
2. **Un pas = o idee** (J). Textul pasului 30-110 cuvinte, propoziții scurte. Concept nou → întâi „ce este” și „la ce folosește”, apoi „cum se face”.
3. **Instrucțiuni executabile literal** (A, R). Spui UNDE, CE EXACT, CU CE confirmi: „În A2 scrie doar numărul 5 și apasă Enter.” Niciodată notații de tipul „A1 = Cantitate: 5”. Un elev care face exact ce scrie obține exact ce promite lecția.
4. **Ilustrat la fiecare acțiune** (S, J). Fiecare pas cu acțiune are o captură reală din aplicație SAU un simulator în pagină. Refolosește capturile existente din `jocuri\*\` (vezi `jocuri\README.md` §6b). Captura arată exact ce spune textul, la momentul acela. Captură care lipsește → o treci în `capturi_lipsa.json`, iar în pagină folosești simulatorul sau reformulezi. Niciodată imagine-substitut.
5. **Practică în pagină, mai ales aplicare** (S, A). După fiecare pas, un „Încearcă”. Cel puțin jumătate din „Încearcă” + atelier sunt de APLICARE (răspunsul nu e scris nicăieri; elevul îl obține aplicând regula) sau de EXECUȚIE în simulator. Recunoașterea (alegi/potrivești) doar pentru vocabular. Întrebările de verificare sunt variante-soră ale exercițiilor, NICIODATĂ identice cu ele.
6. **Office în română ȘI în engleză** (S, R). Orice filă/grup/comandă din panglică cu ambele nume: „Pornire (Home)”, „Inserare (Insert)”. **Numele FUNCȚIILOR Excel NU se traduc** (calibrare 27.09, surse Microsoft ro-ro; în verificare independentă): se scrie `=SUM(...)`, `=AVERAGE(...)`, `=IF(...)` și în Excel-ul românesc; `=SUMA(` dă `#NAME?`. Butonul din panglică se numește „Însumare automată (AutoSum)”; prima opțiune din lista lui e „Sumă”, dar scrie tot `=SUM(`. Separatorul `;`/`,` și virgula zecimală vin din setările regionale ale Windows-ului, nu din limba Office (verificat 27.09). Numele de panglică doar cu diacritice corecte (ș, ț cu virgulă). Separatorul: „pe unele calculatoare scrii `;` între argumente, pe altele `,`” — spus o dată, apoi ambele forme. Numele RO se iau din `_campaign\revizuire_completa_2026_09\calibrare\meniuri_ro_en.json`; cele NESIGURE le treci în `surse.md`.
7. **Adevărat în aplicația reală** (R). Orice afirmație „dacă faci X, apare Y” (inclusiv în indicii și în cheile întrebărilor) o treci în `afirmatii.json`: `{id, loc (pas/exercițiu/întrebare), actiune, rezultat_promis, aplicatie}`. Dirijorul le rulează în Excel/Word/PowerPoint real.
8. **Fără contradicții și fără date vechi** (A, J, S). O celulă/un obiect are un singur rol; „foaie nouă”/„document nou” se spune când începi de la capăt. Constantele (TVA 21% etc.) doar din `calibrare\constante_lume.json`.
9. **Fidelitatea simulatorului** (`jocuri\README.md` §1): simulatorul nu acceptă ce aplicația respinge și nu respinge ce aplicația acceptă.

## Profilul elevului (ce ȘTIE când începe lecția N)
- ȘTIE: conținutul lecțiilor 1..N-1 ale clasei lui din unitati.json/Calendar_ore (s-au predat la clasă) + conținutul planului din clasele anterioare (pentru a VI-a: planul de a V-a etc.). Clasa a V-a pornește de la zero: știe să citească, să miște mouse-ul și să facă clic, să tasteze litere (presupus; de confirmat de profesor).
- NU ȘTIE: tot restul, inclusiv termenii din lecțiile următoare. Lecția scrie în `profil.json` ce presupune că știe elevul, cu lecția de unde vine.

## Fișierele din dosarul lecției
`index.html` · `afirmatii.json` · `profil.json` · `capturi_lipsa.json` · `surse.md` (programa, lecțiile/jocurile folosite, ce n-ai putut verifica) · eventual imaginile noi (`img\`).

## Poarta autorului (înainte de a spune „gata”)
`python C:/00/Projects/LearningHub/jocuri/_motor/test_joc.py --dir C:/00/Projects/LearningHub/lectii/<clasa> m1-lNN` → TRECUT (avertismentul „1 niveluri (obișnuit 5-8)” e așteptat; restul avertismentelor le citești și le rezolvi).

## Modul lecție al motorului (de la 27.09, după)
Pune `mod:'lectie'` în configurație (vezi `jocuri\README.md` §4 „Modul LECȚIE”). Motorul face singur firul de navigare spre `/lectii/<clasa>/`, textele de lecție și pasul **„Acum în aplicația adevărată”**, între atelier și întrebări: câmpul `aplicatieReala:{aplicatie, titlu?, intro?, pasi:[…]}`, iar fără el se folosesc `diploma.aplicatie` + `diploma.provocare`. Nu scrie în text „apoi diploma, cu provocarea”.

## Ce au găsit judecătorii la lecțiile nr. 4 (27.09) — nu repeta
1. **Simulatorul trebuie să fie fidel la FIECARE gest** pe care elevul îl poate încerca, nu doar pe drumul lecției. Exemple:
   - Excel: pictograma butonului Pornire › Ștergere șterge direct; doar săgeata ▾ deschide meniul.
   - Excel: Backspace pe o zonă golește doar celula activă.
   - Word: după ce inserezi un tabel, tastarea merge în tabel, deci focusul trebuie să rămână în document.
2. **Pe telefon, orice gest cerut trebuie să poată fi făcut.** Tragerea cu degetul trebuie să selecteze. Dacă un gest nu există pe telefon (Shift+clic), pagina spune pe ecran ce faci în loc.
3. **Nicio notație în locul cuvintelor.** Fără „Lucru | Preț”, fără „A1 = …”; scrii în propoziții.
4. **Provocarea din aplicația reală nu cere profesorul** (la ora simultană e cu cealaltă clasă). Dacă ai nevoie de o poză sau de un fișier, dă-l ca descărcare din pagină. Nu cere gesturi care depind de mărimea pozei (de exemplu, „clic în dreapta pozei”).
5. **Analogiile nu au voie să răstoarne sensul la noi.** În clasă, „rândul de la geam” e un șir de bănci de la față la spate, adică ce numește Excel coloană. Verifică analogia din perspectiva unui copil român.
6. **Un pas = o idee:** textul are cel mult 110 cuvinte, iar „Uite cum” cel mult ~80. Un pas cu 5 idei se împarte în mai mulți pași.
7. **„Altfel” spune exact ce spune pasul**, cu alte cuvinte. Dacă textul spune că rândurile „urcă”, „altfel” nu are voie să spună că fișele „coboară”.
8. **Siguranța în laborator:** nimic sub masă, lângă prize sau cabluri, nimic desfăcut.
9. **Vocabularul lecțiilor următoare nu apare nici în variantele de răspuns.**
10. **Exemplele care arată un rezultat pe ecran se verifică pe aplicația reală.** De exemplu, „2 + 3” în Calculatorul din Windows arată 5 abia după „=”.
11. **Excel pe setări românești (probat în Excel real, 27.09, lecția VIII nr. 5):**
   - Virgula e zecimală: „7,5” e număr.
   - „7.5” NU rămâne text: Excel îl ia drept DATĂ (07.mai), aliniată la dreapta, iar forma de dată rămâne apoi în celulă. Tot așa „9.5”, „6.75”, „1.62”.
   - „12 lei” devine numărul 12 afișat cu „lei”.
   - Data se scrie zz.ll.aaaa.
   - Separatorul `;`/`,` vine din Windows.
   - Nu scrie niciun fapt de acest fel din memorie: îl probezi în Excel real.
12. **Scripturile tale le ții în dosarul lecției (`_proba\`)**, nu în scratchpad-ul comun, unde alți agenți suprascriu fișiere.
13. **Anularea (Ctrl+Z) nu înseamnă „un pas înapoi” de fiecare dată** (lecțiile nr. 5).
   - În Excel, o corectură după o dată greșită cere mai multe anulări, pentru că forma de dată rămâne în celulă.
   - În Word, o mutare făcută cu Ctrl+X și Ctrl+V se anulează cu două Ctrl+Z.
   - Orice instrucțiune de tipul „apasă Ctrl+Z până…” o probezi în aplicația reală, pe drumul greșit pe care îl face de obicei un copil.
14. **După „Verifică”, focusul se întoarce pe foaie sau pe document.** Altfel, tastele cerute chiar de mesaj (Ctrl+Z, Delete) nu mai fac nimic.
15. **Tastatura românească diferă de cea americană.**
   - Pe tastatura Română (Standard), tasta de lângă Enter scrie „ț”, iar apostroful cere AltGr.
   - Pe telefon nu există Ctrl, Shift sau Enter ca taste: dai drumul prin butoanele de pe ecran și îl spui în text.
16. **O regulă predată nu are voie să aibă excepții nespuse.** De exemplu, „are litere, deci e text” e fals pentru „12 octombrie 2026”, care e o dată, și pentru „12 lei”, care e un număr.
17. **Clipboardul e comun tuturor proceselor de pe PC.** Înainte de o probă cu lipire, verifici ce e în clipboard.
18. **Word ajustează singur spațiile la ștergere și la lipire, dar nu mereu.** De exemplu, „ora 8.Aduceți”. Lecția spune elevului să verifice spațiul.

## Simulatoarele din lecțiile nr. 4
Cele patru simulatoare au fost scrise în paginile lecțiilor nr. 4:
- `excelx` (clic dreapta, antete, ștergere de rânduri/coloane, panglică), în `lectii\viii\m1-l04\`;
- `SimPPT`, în `lectii\vi\m1-l04\`;
- `wordobj`, în `lectii\vii\m1-l04\`;
- `fotografie` (etichete pe fotografii), în `lectii\v\m1-l04\`.

Pentru lecțiile următoare:
- Simulatorul clasei tale devine fișier comun: `lectii\_sim\<tip>.js`.
- Îl copiezi din pagina lecției nr. 4 numai după ce în `_verificare\` apare `reparatii.md`, adică după ce reparațiile judecătorului sunt făcute.
- Îl extinzi acolo; lecția nr. 4 rămâne deocamdată cu copia ei.
- Fiecare simulator are UN proprietar: autorul lecției nr. 5 a clasei respective.

## Verificarea dirijorului (după autor, înainte de publicare)
S: poarta de mai sus + comparația exercițiu–verificare + prerechizitele · A: agenți-începători cu carte închisă (profilul de mai sus), câte unul pe sarcină · R: afirmatii.json rulate în aplicația reală · J: un judecător Opus care n-a scris lecția încearcă să o respingă pe regulile 1-9. Insigna publicată: „verificat parțial” până trece mașina bancul (faza 3a).
