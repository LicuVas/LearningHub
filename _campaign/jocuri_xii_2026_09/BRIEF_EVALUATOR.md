# Brief comun — evaluatorul independent al jocurilor de a XII-a (proba D)

Ești EVALUATORUL INDEPENDENT (adversarial) al unui joc pe care NU l-ai construit. NU editezi jocul; scrii un raport.

## Reguli de lucru (au blocat 3 evaluatori pe 15.09: le respecți strict)
- **Creează raportul IMEDIAT** (antet + tabel gol).
- **Adaugă constatările după FIECARE nivel verificat.** Nu aștepta finalul: dacă te oprești, ce ai găsit rămâne.
- PDF-urile se citesc cu Read și `pages` (maxim 4 pagini pe citire). Niciodată întregi.
- Orice script de browser (Playwright) se rulează prin Bash cu `timeout 120 python script.py`. Scriptul are `page.set_default_timeout(8000)` și `wait_for_selector`, nu așteptări fixe.
- Nu citești jocul întreg dintr-o dată: îl iei cu Grep / Read cu offset și limit, nivel cu nivel.

## Surse
- **Modelul de raport:** `C:\00\Projects\LearningHub\_campaign\jocuri_xii_2026_09\excel-xii\raport.md` (aceleași categorii și formatul tabelului).
- **Regulile jocului:** `BRIEF_CONSTRUCTOR.md` (în același folder) și `C:\00\Projects\LearningHub\jocuri\README.md` §9.
- **Adevărul despre examen:**
  - `C:\00\Projects\LearningHub\data\proba_d\operatii.json` (aplicația ta) și `HARTA.md`;
  - rezolvările `C:\00\AI_0\projects\subcompetente-digitale\content\rezolvari\`;
  - baremele PDF din `C:\00\AI_0\projects\subcompetente-digitale\files\cd-YYYY\`.

## Ce verifici, întrebare cu întrebare
1. **Corectitudinea față de aplicație** (Office 2016/2019/365):
   - fiecare pas de traseu există, în ordinea dată, iar indicele `ok` e cel bun;
   - drumurile alternative reale sunt acceptate;
   - distractorii sunt comenzi reale, dar greșite pentru sarcină;
   - la versiunile care numesc diferit o filă (Design / Layout / Page Layout), elevul cu cealaltă versiune nu e penalizat;
   - etichetele românești: semnalezi ce pare inventat sau calchiat. Dacă nu ești sigur, scrii „neverificabil”.
2. **Fidelitatea față de examen:**
   - nivelul final e comparat cu sursa și cu baremul (cerințe, date, puncte);
   - 6 citări verificate prin sondaj;
   - defalcările de barem pretinse, dar care nu există pe disc, se semnalează.
3. **Divide et impera și ordinea după puncte** (HARTA.md): lipsesc operații din top 10?
4. **Ghicitul după formă:** varianta bună mai lungă, adevărat/fals evident.
5. **Dubluri** reformulate.
6. **Paginile de citit:** 60–120 de cuvinte, clare pentru elevi slabi la IT, cu diacritice.
7. **Răspunsuri** din nivelul final dezvăluite în paginile de citit.
8. **Telefon:** un nivel jucat pe iPhone SE (320 px), cu un clic greșit; 1–2 capturi în folderul raportului.
9. **Poarta:**
   `timeout 400 python C:\00\Projects\LearningHub\jocuri\_motor\test_joc.py --dir C:\00\AI_0\projects\subcompetente-digitale\jocuri <slug>`

## Raportul
Fișierul: `C:\00\Projects\LearningHub\_campaign\jocuri_xii_2026_09\<slug>\raport.md`, în română cu diacritice, cu tabelul:

| nivel·întrebare | problemă | dovadă (sursă) | reparație exactă (text de înlocuit) | gravitate (blochează/important/minor) |

La final, verdictul: publicabil după reparații, da sau nu.
Răspunsul tău final are sub 200 de cuvinte: numărul de constatări pe gravitate, primele 5 reparații și verdictul.
