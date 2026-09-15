# Evaluare independentă: „Antrenament: Word” (VII-U1), 15.09.2026

Jocul: `C:\00\Projects\LearningHub\jocuri\word-antrenament-vii\index.html`. Singurul fișier modificat.
Dovezile: `analiza.txt` (scurgeri prin formă, lecții), `joaca.txt` (tragerea reală pe iPhone SE + simulatorul), `bazine.json` (bazinele după reparații).

## Sursele
- Paginile Microsoft salvate: **4 din 12 sunt pagini de eroare** („Error - Office.com”): `VII\surse\orient.txt`, `VII\surse\salvare.txt`, `eval_V_VI_VII\surse\ppt_fundal.txt`, `eval_V_VI_VII\surse\ppt_ordine_obiecte.txt`. Nu le-am folosit.
- Bune și folosite: `scurt.txt` / `word_taste.txt` (scurtături), `tabel.txt`, `wrap.txt`.

## Trecerea 1: faptele (46 de întrebări)
Verificate pe textul Microsoft: Ctrl+O/N/S/W, Ctrl+X/C/V, **Ctrl+Shift+V = „Lipiți doar textul”**, Ctrl+A, Ctrl+E/L/R/J, **Ctrl+1/2/5** (spațiere), **Ctrl+Shift+8** („nu utilizați tastatura numerică”), Shift+Enter (sfârșit de linie), Ctrl+Enter (sfârșit de pagină), Ctrl+H (Înlocuire), Ctrl+F, Ctrl+P, F12 (Salvare ca). Filele „Proiectare tabel” / „Aspect tabel” (panglica clasică) și „Inserare > Tabel” din `tabel.txt`. „În linie cu textul … se deplasează automat cu textul”, „Strâns” urmează forma, cel mai bine cu fundal transparent, din `wrap.txt`. Cifrele recalculate: 5×4,5=22,5 cm; 4×4=16, (21−16)/2=2,5 cm.
Comparate cu materialul profesorului (`clasa_VII_M1.json`): zoom ≠ font, Shift+Enter, legenda „Figura 1 — …”, un singur font, subliniatul pare legătură, .docx colegului / .pdf profesorului, lipire ca text neformatat. Nicio contradicție.
**Nicio greșeală de fond, nicio cheie greșită.** Fiecare întrebare are o singură variantă bună. `why` explică de fiecare dată.

## Semnalări
| # | Gravitate | Ce | Reparat? |
|---|---|---|---|
| 1 | important | **Nicio întrebare nu avea `lectii`.** Tragerea nu era echilibrată pe lecții. | da, pe toate 44 |
| 2 | important | **Dublură reformulată** (Consolidat): „fotografia lățită → Ctrl+Z și colț” = `word-obiecte-vii` N2#1 („mărești fără deformare → colțul”) și N7 („sigla mărită din mijlocul laturii, turtită”). Scriptul n-a prins-o (jaccard mic). | scoasă |
| 3 | important | **Dublură, și în afară, și înăuntru**: tf „Ai decupat cu Ctrl+X… îl pui cu Ctrl+V” = `word-vii` N3#3 (diferența Ctrl+C/Ctrl+X) + perechea „Ctrl+X → scoate selecția și o ține pentru lipire” din De bază + clasificarea „Copiezi sau decupezi?”. Pe deasupra, e o singură recunoaștere, deci nivel De bază, nu Consolidat. | scoasă |
| 4 | important | **Runda greșită**: match-ul cu scurtături (Ctrl+J/5/E/R) e rechemare pură (De bază). Stătea în Consolidat. Perechea „Ambele margini drepte → Ctrl+J” dubla `word-vii` N5#1, iar „Titlul la mijlocul rândului → Ctrl+E” dubla întrebarea De bază „Titlul compunerii… Ctrl+E”. | mutat în De bază; perechile schimbate pe spațiere (Ctrl+1/5/2, verificate) + Ctrl+R |
| 5 | important | **Runda greșită**: tf „imagine lată de exact 5 cm, trasă «cam»” și tf „carte de vizită, aceeași mărime peste tot” erau în Avansat. Un adevărat/fals cu o singură idee nu arată lucru independent în context nou. | mutate în Consolidat |
| 6 | minor | Scurgere prin formă: „Popescu_Ana_tema1.docx” (22 de caractere) față de „tema.docx” (9) / „Document1.docx” / „temaTIC.docx”. Varianta bună se vedea după lungime. | distractori de lungime egală |
| 7 | minor | Scurgere prin lungime: „Scurtezi textul sau o imagine cu câteva rânduri” (47 de caractere față de 36), formulat și stângaci. „Cu cursorul în ultima coloană, inserezi o coloană la dreapta” (60 față de 54, plus cuvinte din enunț). | scurtate |
| 8 | minor | Indiciul de la vânătoarea din Avansat (invitația) enumera exact cele 4 locuri greșite. În Avansat, asta e prea mult sprijin. | indiciu general („ia specificația punct cu punct”) |
| 9 | minor, neverificat | Ctrl+Shift+V lipește doar text în Word actual (sursa MS). În Word mai vechi combinația a avut alt rol, dar n-am găsit pe sursă. Versiunea din laborator nu e cunoscută. | `why` completat prudent: „dacă nu merge, alegi din opțiunile de lipire varianta care păstrează doar textul” |
| 10 | minor | Motorul, în modul antrenament: pe ecranul de final scrie „Recitește pagina și reia **nivelul**”, „Nivelul următor”. La alegerea greșită scrie „recitește pagina”. Antrenamentul nu are pagină. | NU (e în `_motor\`, interzis) |
| 11 | minor | `tragerea.txt` al autorului testa „pornesc–ies–repornesc”. Asta era comportamentul motorului dinainte de 12:06. Acum „văzut” se scrie abia la final, deci dovada autorului nu mai spune nimic. Am refăcut testul cu runde terminate. | refăcut testul (`joaca.txt`) |

Dubluri parțiale, lăsate pentru profesor (adaugă ceva real, dar ideea de bază e aceeași):
- Avansat „PDF directoarei, .docx colegului” față de `word-obiecte-vii` N7#5 („trimiți dirigintei exact cum arată → PDF”);
- Avansat „tabelul iese peste margine, font și margini fixate → vedere” față de N7#1 („tabel de 22 cm → vedere”);
- De bază „În linie cu textul se mută cu textul” față de N2#2 / N2#3;
- simulatorul „excursia” are aceeași schemă ca „orarul” (N5) și „diploma” (N7), cu alte date.

## Potrivirea cu descriptorul
Din 46: **4 întrebări erau în runda greșită** (match-ul de scurtături și tf-ul Ctrl+X în Consolidat, două tf-uri cu o singură idee în Avansat). Alte 3 sunt la limită și le-am lăsat:
- „Pe ce filă cauți stilurile tabelului?”: recunoaștere, stă în Consolidat;
- clasificarea specificației cărților de vizită: sortare, stă în Avansat;
- simulatorul „felicitarea”: enunțul spune aproape direct butoanele.

## Tragerea (iPhone SE, fără toateIntrebarile, runde TERMINATE)
- După reparații: De bază 17 (6 trase), Consolidat 15 (6), Avansat 12 (5). Toate bazinele au ≥ 2×cate.
- Reluarea după o rundă terminată: **0 întrebări repetate** în toate cele 3 runde. La a treia jucare ciclul reîncepe corect.
- Echilibru: prima tragere atinge toate lecțiile rundei (5/5, 6/6, 4/4).
- **A doua tragere din Avansat a atins doar lecțiile 7 și 9.** Lecția 3 are o singură întrebare, lecția 8 are două, și s-au consumat la prima tragere. Asta vine din FORMAT: lecțiile cu 1-2 întrebări într-o rundă dispar la reluare.
- Abandonul (pornită, neterminată) nu consumă întrebări.

## Simulatorul „pagina” (clicuri reale)
- Excursia: soluție corectă pe alt drum (vedere, 1,5 / 2,5) = **acceptată**. Portret cu margini de 1,5 = respinsă („22,5 cm, au rămas 18 cm”). Rândul îmbinat uitat la numărătoare = respins.
- Scrisoarea: 3 / 2,5 + În linie = **acceptată**. Margini egale = respinsă. Sigla Strâns = respinsă.
- Felicitarea: vedere + Sus și jos = **acceptată**. „În spatele textului” = respinsă. Portret = respins.

## Declarațiile rundelor
Verificate întrebare cu întrebare după `lectii`:
- De bază: lecțiile [2,3,4,5,6] = interfață / instrumente / gestionare / obiecte / editare / formatare;
- Consolidat: lecțiile [3..8], cu regulile (lecția 8);
- Avansat: lecțiile [3,7,8,9], cu specificațiile.

Toate adevărate după mutări. Numerele lecțiilor sunt din `unitati.json`. Materialul `clasa_VII_M1.json` are altă numerotare, cu imaginea și încadrarea la „4”.

## Porțile, la final
- `test_joc.py word-antrenament-vii` → **[TRECUT]** (88 de întrebări jucate, 66,3 diacritice la 1000 de litere);
- `acoperire.py` → **0 goluri, 0 probleme**;
- `intrebari_unitate.py VII-U1 --verifica` → **0 perechi** (64 existente, 44 în joc).

## De schimbat în FORMATUL de antrenament, înainte de celelalte unități
1. **`lectii:[n]` obligatoriu pe fiecare întrebare, cerut de poartă** (autorul pilotului n-a pus niciuna și poarta a trecut).
2. **Minimum 2-3 întrebări pe fiecare lecție declarată într-o rundă.** Altfel lecția lipsește la reluare.
3. **Pasul 0 de dubluri trebuie citit și cu ochii.** Scriptul prinde cuvinte, nu idei: 2 dubluri reale au trecut de el cu jaccard 0,17-0,20. Regula de lucru: pentru fiecare întrebare nouă, numește întrebarea existentă cea mai apropiată și ce aduce în plus.
4. **Verifică dublurile și ÎNĂUNTRUL jocului**, între runde: aceeași scurtătură sau aceeași regulă apare în 2-3 runde.
5. **Test de descriptor, pe fiecare întrebare:**
   - un adevărat/fals sau o rechemare de scurtătură = De bază;
   - un scenariu familiar cu 2-3 elemente = Consolidat;
   - Avansat = specificație sau constrângere în context nou, unde elevul decide.

   Autorul a pus rechemări în Consolidat și adevărat/fals în Avansat.
6. **Indiciul scade cu runda:** în Avansat nu enumeră locurile greșite.
7. **Motorul are nevoie de texte proprii pentru antrenament**, fără „recitește pagina” și „nivelul” (semnalarea 10).
8. **Distractorii de lungime apropiată, verificat mecanic.** Varianta bună era strict cea mai lungă în 7 din 20 de choice.

## Rămâne de decis de profesor
- Cele 4 dubluri parțiale de mai sus: le păstrează (repetiție pe aceeași idee) sau cere întrebări noi?
- Ctrl+Shift+V: ce versiune de Word e în laborator (Brauner)? Pe Word vechi, întrebarea trebuie scrisă pe „opțiunile de lipire”.
- Ctrl+1/2/5 în De bază: materialul profesorului nu le are, apar doar în LearningHub cls7. Le vrea la nivelul de bază?
- Stilurile (Titlu 1) nu sunt în `clasa_VII_M1.json`, doar în `analogii.json` și LearningHub. Intră în unitate?
- Cele 3 întrebări „la limită” de descriptor.
