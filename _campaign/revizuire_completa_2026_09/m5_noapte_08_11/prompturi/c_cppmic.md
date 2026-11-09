# Proprietarul componentei `lectii\_sim\cpp-mic.js` (C++ în pagină, pentru clasele a VII-a și a VIII-a)

Ești PROPRIETARUL unei componente comune noi. Nu scrii lecții. Autorii VII/24 și VIII/24 pornesc abia după ce API-ul tău e final și poarta spune LANSEAZA (ghidul VI.3, „Valurile și ordinea”).

**Citește întâi:** `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`: Partea I întreagă, III (simulatoare, teste, telefon), V.3 (componente comune), VI.2 secțiunea „Poarta de lansare”; contractul `…\m5_noapte_08_11\contract.md` (R7, I2, I3, glosarul) și `…\m5_noapte_08_11\prompturi\_noapte_08_11.md`. Cum se leagă un simulator de motor: citește două extensii publicate, una simplă și una cu teste numite (`lectii\_sim\urmarire-decizie.js`, `lectii\_sim\editorweb.js`) și `jocuri\_motor\motor.js` doar cât îți trebuie (Grep întâi). Faptele despre `g++` se probează, nu se scriu din memorie: compilatorul e în PATH (`g++ --version` = 16.1.0, MinGW). La o probă cu `g++` folosești doar dosarul `lectii\_sim\_teste\cpp-mic\` și `timeout -k 15`.

## Ce trebuie să facă `cpp-mic.js`
Un interpretor mic de C++ scris în JavaScript, fără bibliotecă externă, fără `eval`, fără rețea, plus interfața din pagină (editor + butoane + consolă + rulare pas cu pas).

**Limbajul acceptat:** `#include <iostream>`, `<cmath>`, `<iomanip>`; `using namespace std;`; `int main() { … return 0; }` (și `int main()` fără `return`); tipurile `int`, `long long`, `float`, `double`, `bool`, `char`; constante cu `const`; tablouri cu o dimensiune (`int a[100];`, `int a[5] = {1, 2, 3};`); `cin >> a >> b`; `cout << … << endl`, `"\n"`, șiruri de caractere doar ca text de afișat; `fixed`, `setprecision(n)`, `sqrt`, `abs`, `pow`; operatorii `+ - * / %`, `== != < > <= >=`, `&& || !`, `= += -= *= /= %=`, `++ --` (prefix și postfix); `if` / `else`, `while`, `do … while`, `for`, `break`, `continue`; comentarii `//` și `/* */`; blocuri cu variabile locale.

**NU acceptă (și spune cinstit că la lecțiile astea nu se folosește, nu că e greșit în C++):** funcții proprii, `string`, pointeri, clase, fișiere. Mesajul e distinct de o eroare de compilare, ca elevul să nu creadă că a greșit.

**Fidelitate față de `g++` (regula 9, nu negociabilă):**
- împărțirea întreagă și `%` cu negative ca în C++; `int` pe 32 de biți cu depășire (dacă `g++` împachetează pe programul din oracol, tu la fel; marchezi în `.GATA.md` că e comportament nedefinit); `double` afișat cu `cout` ca în C++ (6 cifre semnificative, `1e+06`, `fixed`/`setprecision`); `char` și `bool` afișate ca în C++; conversiile implicite.
- `cin` adevărat: sare peste spații și linii noi; la o intrare care nu se potrivește (litere într-un `int`), variabila primește 0 și citirile următoare nu mai fac nimic, ca în `g++`. Lecția VII/25 cere exact asta („date neașteptate”).
- **Comportamente nedefinite, unde `g++` dă orice:** variabilă folosită fără valoare, indice în afara tabloului. Simulatorul NU inventează o valoare: oprește rularea cu un mesaj care spune adevărul („în Code::Blocks programul ar putea afișa altceva la fiecare rulare”). Citește întâi ce face real, ca mesajul să fie adevărat.
- **Erorile de compilare:** pentru greșelile tipice ale unui elev (`;` lipsă, acoladă lipsă, ghilimea lipsă, `Cout`/`Int` cu majusculă, variabilă nedeclarată, `<<` la `cin`, `=` în loc de `==` care NU e eroare, `#include` lipsă, `using namespace` lipsă, `main` scris greșit): aceeași linie ca `g++` și mesajul `g++` în engleză (forma exactă din rularea reală), urmate de explicația pe scurt în română. Greșeala care nu e eroare de compilare (`if (x = 5)`) rulează exact ca în `g++`, cu aceeași ieșire. Prima eroare e suficientă; dacă `g++` arată mai multe, le spui pe primele, ca el.
- **Buclă fără sfârșit:** plafon de pași; mesajul spune adevărul (programul nu se termină, în Code::Blocks închizi fereastra consolei) și nu blochează pagina.

**Interfața, la 390 px și la 1280 px (regulile 20, 31):**
- editor cu numere de linie, care nu se sparge pe telefon; rândul cu eroarea marcat; **bară de butoane cu semnele greu de găsit pe telefon**: `{ } ( ) [ ] ; < > << >> = == " + - * / %` și Tab/indentare, ținte ≥ 32 px, cu inserare la cursor; focusul se întoarce în editor (regula 14). Ctrl+Z al browserului nu trebuie stricat de butoane.
- „Rulează”: consolă adevărată. Programul care cere date așteaptă, elevul scrie în consolă, apasă Enter (pe telefon un buton vizibil „Trimite”). Se poate da și o intrare gata pentru teste.
- „Pas cu pas”: linia curentă marcată, tabel cu variabilele (și tabloul, cu indicele curent), butoanele „Pasul următor” și „Oprește”. Elevul poate pune un punct de oprire la o linie (cum va face în Code::Blocks). VII/31 și VIII/31 se sprijină pe asta.
- Toate etichetele în română; mesajele compilatorului rămân în engleză, cum le vede în Code::Blocks.

**Legătura cu motorul:** tip de simulator înregistrat după modelul celorlalte (`mod:'lectie'`, atelier cu teste numite care se bifează singure; regula 29: testul judecă rezultatul). API-ul e pentru autorii de lecții și trebuie să permită, FĂRĂ cod nou în lecție: program de pornire; intrări de test; verificări pe ieșirea programului pentru mai multe intrări (normalizare de spații și linii noi, opțională), verificări pe text (ex. „folosește `for`”) doar când asta e chiar ce se predă; „atinge starea finală” pentru rularea pas cu pas; mesaj de greșeală per test. Mesajele testelor respectă regula 28 (primul test care pică numește greșeala; mesajul nu trimite în buclă). Starea se păstrează cum cere regula 23 (legată de elevul de pe scaun, „Sunt alt elev / Încep din nou”): vezi cum o fac extensiile existente.

## Oracolul (fișiere proprii, în `lectii\_sim\_teste\cpp-mic\`)
- `programe\*.cpp` + `intrari\*.txt`: **≥ 200 de programe** de nivelul VII-VIII: toate tiparele din `Info_Gimnaziu_2026\data\activitati_lectii_VII_VIII.json` (suma cifrelor, răsturnat, divizori, cmmdc, prim, minim/maxim, numărare, sumă, produs, ambele tipuri de „pentru toate / cel puțin unul”, programul cu meniu) + cazuri-limită (negative, zero, `/` și `%`, depășire, zecimale, `cin` eșuat, șir gol).
- `oracol.py`: compilează fiecare program cu `g++ -std=c++17 -O0`, îl rulează cu limită de timp, rulează același program în simulator (Node, fără browser, pe nucleul interpretorului) și compară ieșirile octet cu octet. **Ultima linie = numărul de diferențe.** Ținta: 0.
- `erori\*.cpp` (**≥ 30**): linia și clasa erorii identice cu `g++`; `oracol_erori.py`, ultima linie = diferențe.
- `proba_interfata.py` (Playwright, Chromium, rețeaua blocată, `ctx.close()`, 390 cu atingere + 1280): scrie un program de la zero folosind doar butoanele și tastele pe care le are un telefon, îl rulează cu intrare, parcurge pas cu pas, provoacă o eroare și o repară. 0 erori în consolă, ≥ 32 px măsurat, nicio derulare orizontală. Ultima linie = probleme.
- 10 **mutanți** (strici o regulă din interpretor: împărțirea întreagă, `%` la negative, ordinea evaluării `++`, `cin` eșuat etc.); `mutanti.py` cere ca oracolul să pice la fiecare. Ultima linie = mutanți neprinși.

## Code::Blocks: faptele pe care le vor folosi lecțiile
Code::Blocks e instalat în `C:\Program Files\CodeBlocks\`, **dar verifici întâi dacă are compilator propriu** (dosarul `MinGW\bin` pare gol pe calculatorul ăsta, iar în `WER\ReportArchive` sunt rapoarte de cădere ale lui `codeblocks.exe`). Pornește-l DOAR pe desktopul ascuns (`C:\00\AI_0\tools\hidden_desktop.py`), niciodată pe ecranul vizibil; salvează doar în dosarul tău; închide-l după PID-ul tău. Scrii în `lectii\_sim\cpp-mic.GATA.md`, secțiunea „Code::Blocks”, ce ai reușit să probezi: numele exacte ale meniurilor pentru fișier nou, salvare `.cpp`, „Build and run” (F9), unde apar erorile, ce fereastră se deschide la rulare; capturi reale în `lectii\_sim\_capturi_codeblocks\`, sub ~150 KB fiecare, fără nume de cont în imagine. Ce nu reușești în 30 de minute se scrie „NEPROBAT, motivul”, nu din memorie. Dacă Code::Blocks cade la pornire pe desktopul ascuns, notezi și mergi mai departe: nu oprești componenta pentru asta.

## Predarea
`lectii\_sim\cpp-mic.GATA.md`: API-ul final cu un exemplu complet de lecție (configurația unui atelier), lista exactă a ce acceptă și ce refuză, rezultatele oracolelor (cifrele reale, din rulări), secțiunea Code::Blocks, ce rămâne nesigur. Ține `lectii\_sim\_teste\cpp-mic\stare_autor.md` la zi după fiecare etapă: dacă treci de ~200k de context, te oprești curat și scrii acolo exact de unde se continuă.

**Nu publici, nu faci commit, nu atingi alte fișiere din `lectii\_sim\`.** Lucrezi temeinic: durează cât durează (reper: 90-120 de minute), fără bucle de lustru.

**Răspunsul final (scurt):** cifrele celor patru oracole (ultimele linii), calea `.GATA.md`, ce a rămas nesigur, ce trebuie să știe poarta.
