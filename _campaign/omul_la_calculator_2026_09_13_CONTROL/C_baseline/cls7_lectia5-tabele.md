# Recenzie — Clasa a VII-a, „Tabele în Word”

- **Fișier:** `C:\00\Projects\LearningHub\content\tic\cls7\m1-word-fundamente\lectia5-tabele.html` (2472 linii, citit integral — text + marcaj la chestionare și exerciții)
- **Data:** 13.09.2026 · **Tip:** recenzie de bază (citire + verificare față de motorul `assets/js/atomic-learning.js` și de programa/standardele din `data/informatica_gimnaziu/curriculum.json` — OMEN 3393/2017 + O. 4.615/2026)
- **Fișierul lecției NU a fost modificat.**

Severitate: **blocant** = elevul/profesorul nu poate folosi corect lecția așa cum e · **important** = lecția funcționează, dar învățarea sau ora are de suferit clar · **minor** = finisaj.

---

## 1. Lecția e de 3–4 ori prea mare pentru o oră și amestecă două teme
- **Unde:** 11 atomi (inserare, navigare, selecție, adăugare/ștergere, îmbinare/divizare, dimensionare, stiluri, chenare, conversie text-tabel, formatarea paginii) + secțiunea „Sfaturi și greșeli frecvente” + 3 exerciții de câte 9–12 pași. Atomul 11: `Formatarea paginii pentru documente cu tabele` — margini, orientare, dimensiune, antet, subsol, numerotare.
- **De ce contează:** Informatică și TIC la clasa a VII-a are 1 oră/săptămână. Formatarea paginii e un conținut distinct de programă (lecția însăși o spune: `formatarea paginii este un continut obligatoriu distinct`) și ajunge „lipită” ca ultim atom al unei lecții pe care puțini o termină. Următoarea lecție a modulului e evaluarea (`lectia6-evaluare.html`), deci nu mai există loc pentru ea.
- **Severitate:** blocant
- **Schimbare propusă:** împărțire în 3 lecții: (a) „Tabele — creare și structură” (atomii 1–6), (b) „Tabele — aspect” (atomii 7–9 + conversia 10 ca extindere), (c) „Formatarea paginii” (atomul 11 dezvoltat, cu exercițiul lui). Modulul primește încă 2 lecții înaintea evaluării.

## 2. Formatarea paginii nu e exersată și abia verificată
- **Unde:** niciun exercițiu nu cere antet, subsol sau numerotarea paginilor; exercițiul 3 cere doar `Seteaza pagina in orientare Portrait` (care e deja implicită). Chestionarul atomului 11 are o singură întrebare: `Din ce tab Word setezi marginile, orientarea si dimensiunea paginii?`
- **De ce contează:** un obiectiv declarat (`Sa aplici formatarea paginii: margini, orientare, dimensiune, antet, subsol si numerotarea paginilor`) nu are nicio activitate care să-l producă sau să-l verifice. Standardul „Avansat” cere „reguli date de tehnoredactare şi estetică a paginii tipărite”.
- **Severitate:** important
- **Schimbare propusă:** exercițiu dedicat: tabel lat de 8 coloane → trecere în Landscape + margini Narrow, antet cu titlul, subsol cu numărul paginii, prima pagină fără număr; verificare în Print Preview. Plus 2 întrebări noi (antet vs subsol; „Different First Page”).

## 3. Afirmație greșită: Ctrl+A într-un tabel
- **Unde:** în „Scurtături de tastatură utile pentru tabele”: `Ctrl+A (in tabel) = primul apas selecteaza textul din celula curenta; al doilea apas selecteaza tot tabelul`.
- **De ce contează:** în Word, Ctrl+A selectează tot documentul (comportamentul „apăsare dublă” descris aparține Excel-ului). Elevul care apasă Ctrl+A și apoi Delete pentru „a goli tabelul” șterge tot documentul.
- **Severitate:** important
- **Schimbare propusă:** rândul eliminat; pentru selectarea tabelului rămân `Layout → Select → Select Table`, pătratul din colțul stânga-sus și Alt+5 (numeric, NumLock oprit). De confirmat în Word înainte de publicare.

## 4. Afirmație probabil greșită: Backspace „șterge doar conținutul”
- **Unde:** `Tasta Delete (sau Backspace cu selectie) sterge doar continutul celulelor, nu structura tabelului`; tabelul de scurtături: `Backspace (cu selectie de rand/coloana) = sterge continutul selectat`.
- **De ce contează:** în versiunile actuale de Word, cu un rând/coloană/tabel selectat integral, Backspace șterge structura (rândul/coloana/tabelul), iar Delete golește conținutul — tocmai diferența pe care lecția o prezintă ca „greșeală frecventă”. Dacă descrierea e greșită, elevul care urmează lecția obține exact rezultatul „neașteptat”.
- **Severitate:** important
- **Schimbare propusă:** verificat în Word 2016/2019/365 și rescris: „Delete = golește celulele; Backspace pe rând/coloană selectat(ă) complet = șterge rândul/coloana”. Se păstrează metoda sigură (clic dreapta → Ștergere rânduri).

## 5. Două tab-uri „Layout” diferite, fără nicio distincție
- **Unde:** pentru tabel: `tab-ul Layout > grupul Rows & Columns`, `Layout > Delete > Delete Table`, `Layout > View Gridlines`; pentru pagină: `Click pe Layout > Margins`; chestionarul atomului 11: `Din ce tab Word setezi marginile… → Layout`.
- **De ce contează:** în Word 365 există tab-ul „Layout/Aspect” al documentului și tab-ul contextual „Layout/Aspect” al tabelului (apare doar cu cursorul în tabel), unul lângă altul. Elevul caută „Margins” în tab-ul tabelului și nu găsește; lecția nu spune că sunt două.
- **Severitate:** important
- **Schimbare propusă:** peste tot „Aspect tabel (Table Layout)” vs „Aspect pagină (Layout)”, cu o captură în care se văd ambele tab-uri și o frază explicită în atomul 2 unde apar prima dată tab-urile contextuale.

## 6. Totul e descris doar pentru Word în engleză, fără nicio imagine
- **Unde:** `Insert > Table > Quick Tables`, `Banded Rows`, `AutoFit Window`, `Border Painter`, `Table Style Options`, `Split Table`; traducere doar sporadic (`Insert (Inserare)`). Nicio captură de ecran în cei 11 atomi.
- **De ce contează:** școlile au des Office în română („Inserare → Tabel → Tabele rapide”, „Rânduri alternante”, „Potrivire automată la fereastră”), LibreOffice Writer sau Google Docs acasă. Descrierile de tipul „cursorul devine o săgeată neagră mică înclinată” sau „pătrat cu săgeți în cruce” sunt greu de urmat fără imagine. Descriptorul „De bază” cere lucru „în pași ghidați”.
- **Severitate:** important
- **Schimbare propusă:** căi de meniu în română întâi, engleza între paranteze; 4–5 capturi adnotate (grila de inserare, mânerul de mutare/redimensionare, tab-urile contextuale, galeria de stiluri); casetă „În Google Docs / LibreOffice” cu echivalentele pentru inserare, îmbinare, chenare.

## 7. Lipsește activitatea de pornire („Încearcă singur”) și exemplul concret de la început
- **Unde:** structura paginii: `lesson-frame` → direct `atomic-content`. Celelalte lecții ale platformei au secțiunea `try-section`. Atomul 1 începe cu definiția: `Tabelele sunt unul dintre cele mai utile instrumente din Microsoft Word. Ele organizeaza informatiile in randuri…`.
- **De ce contează:** fără o problemă de rezolvat la început (ex. „orarul tău scris ca text vs ca tabel”), elevul citește 11 atomi teoretici înainte să atingă Word-ul. Elevul slab are nevoie de exemplu înaintea definiției.
- **Severitate:** important
- **Schimbare propusă:** secțiune de start de 5 minute: un paragraf cu orarul scris „în text” (fișier sau bloc copiabil) și cerința „fă-l ușor de citit”; atomul 1 pornește de la rezultat (orar ca tabel) spre termeni.

## 8. Obiectivele nu corespund conținutului
- **Unde:** lista „Dupa aceasta lectie vei putea” are 6 puncte, oprite la atomul 5 + pagina (`Sa explici inserarea unui tabel`, `Sa utilizezi navigarea in tabel`, `Sa aplici selectia in tabel`…). Lipsesc îmbinarea/divizarea, dimensionarea, stilurile, chenarele, conversia — care sunt totuși în `goal-text` și în exerciții.
- **De ce contează:** profesorul și elevul nu știu ce e de atins; formulările („să explici inserarea”, „să aplici selecția”) nu sunt observabile, deci nu se pot verifica.
- **Severitate:** important
- **Schimbare propusă:** obiective operaționale, câte unul pe atom, verificabile: „Inserezi un tabel cu număr dat de rânduri și coloane”, „Îmbini celulele unui rând pentru un titlu”, „Aplici un stil și bifezi Rândul antet”.

## 9. Exercițiul 2 cere completarea tabelului cu „fapte” despre browsere nesusținute
- **Unde:** `Viteza: Chrome - "Rapida", Firefox - "Foarte rapida", Edge - "Rapida"`; `Consum memorie: Chrome - "Mare", Firefox - "Mediu", Edge - "Mic"`; `formatarea conditionala prin culori (semafor)`.
- **De ce contează:** valorile sunt opinii fără sursă, prezentate ca date; elevii le copiază ca adevăruri. „Formatare condițională” e un termen din Excel — Word nu are așa ceva, colorarea e manuală.
- **Severitate:** important
- **Schimbare propusă:** date pe care elevul le poate verifica singur (ex. „note pe discipline”, „bugetul unei excursii”) sau cerința explicită „completează după ce verifici (sursa în ultimul rând)”; „colorare manuală tip semafor” în loc de „formatare condițională”.

## 10. Pas neexecutabil în exercițiul 2
- **Unde:** `7. Imbina celulele din randul de sus al coloanei "Observatii" daca vrei sa adaugi o nota generala.`
- **De ce contează:** „rândul de sus al coloanei Observații” e o singură celulă (antetul) — nu are ce îmbina. Elevul se blochează sau face altceva decât se așteaptă; rezolvarea sare peste pasul acesta.
- **Severitate:** important
- **Schimbare propusă:** „Adaugă un rând la final și îmbină celulele din coloanele 2–5 pentru o concluzie” (e deja sugerat în indicii: `Poti adauga un rand suplimentar "Verdict"…`) și rezolvarea actualizată.

## 11. Exercițiile nu acoperă o parte din atomi
- **Unde:** niciun exercițiu nu cere: ștergerea unui rând/coloane, Split Cells, Split Table, conversia text → tabel (atomul 10 apare doar în „Vrei mai mult?”), antet/subsol/numerotare (atomul 11).
- **De ce contează:** ce nu se exersează nu se fixează; profesorul nu are material de lucru pentru jumătate din lecție.
- **Severitate:** important
- **Schimbare propusă:** exercițiul 1 include „șterge ultimul rând în plus”; exercițiul 2 include „convertește lista primită (text cu virgule) în tabel”; exercițiu nou pentru pagină (v. 2).

## 12. Rezolvările sunt descrieri de pași, fără rezultat de comparat
- **Unde:** `Vezi rezolvarea` la exercițiul 1: `Insert - Table, selecteaza grila la 6x8… Din Layout - Cell Size - AutoFit Window…`; exercițiul 3: `Schita: insereaza tabel 4x8…`.
- **De ce contează:** la un produs vizual, elevul acasă nu poate verifica dacă formularul lui „arată bine” fără să vadă modelul; rezolvarea repetă enunțul.
- **Severitate:** important
- **Schimbare propusă:** o captură a rezultatului așteptat (sau un `.docx` model descărcabil) la fiecare exercițiu + 3–4 criterii de verificare („antetul e pe fundal închis cu text alb”, „tabelul încape pe o pagină”).

## 13. Contradicții în exercițiul 1
- **Unde:** pasul 8: `Aplica AutoFit Window pentru ca tabelul sa ocupe toata latimea paginii` → „Rezultat asteptat”: `dimensiunile coloanelor distribuite egal`; orele `8:00-8:50, 9:00-9:50, 10:00-10:50` → indiciu: `"Pauza" la ora 10:50-11:10`.
- **De ce contează:** AutoFit Window lărgește tabelul la pagină păstrând proporțiile coloanelor, nu le egalizează (asta face „Distribute Columns”, predat în atomul 7); pauza de 20 de minute nu se potrivește cu orarul de 50+10 dat în același exercițiu.
- **Severitate:** minor
- **Schimbare propusă:** „AutoFit Window, apoi Distribute Columns pentru coloanele Luni–Vineri”; pauza scoasă sau orarul ajustat.

## 14. Chestionare cu o singură întrebare, trei variante și distractori absurzi
- **Unde:** `Home > Paste Special > Table, ca la orice text copiat`, `View > Gridlines > Create Table`, `Insert > Shapes > Rectangle, desenat peste tabel`, `Apesi Enter in ultima celula a coloanei existente`, `Apesi tasta Delete dupa ce dai click intr-o celula a coloanei`. Atomul 8 verifică doar recunoașterea numelui englezesc `Banded Rows`.
- **De ce contează:** varianta corectă se găsește prin eliminare fără a ști materia; cu 3 variante, ghicitul dă 33%. O întrebare pe atom nu acoperă atomi cu 6–8 subteme (ex. atomul 7 are AutoFit, tragere, Table Properties, Distribute, aliniere).
- **Severitate:** important
- **Schimbare propusă:** 2–3 întrebări pe atom, 4 variante, distractori din greșeli reale („Enter mută la celula următoare”, „Delete șterge rândul”, „AutoFit Window face coloanele egale”), cel puțin una de aplicare pe o situație („Ai un tabel de 9 coloane care iese din pagină — ce faci?”).

## 15. Chestionar HTML static „mort”, cu altă formulare decât cel real
- **Unde:** în fiecare `<div class="atom-quiz" data-qid="atom-1-q0">` există opțiuni scrise de mână (ex. `Fac documentul mai lung` / `Organizeaza datele in randuri si coloane pentru comparatii rapide` / `Inlocuiesc imaginile din document`), diferite de cele din `data-quiz`. Motorul face `container.innerHTML = …` și le înlocuiește.
- **De ce contează:** dacă JavaScript nu se încarcă (rețea școală, blocare), elevul vede un chestionar fără buton funcțional, în care varianta corectă e evident cea mai lungă; întreținerea e dublă și cele două versiuni deja au divergit.
- **Severitate:** minor
- **Schimbare propusă:** `<div class="atom-quiz"></div>` gol, ca în celelalte lecții; eventual un `<noscript>` cu mesaj.

## 16. Inexactități tehnice mărunte
- **Unde:**
  - `Alternativ, click triplu pe textul din celula` (pentru selectarea celulei) — clicul triplu selectează paragraful, nu celula.
  - `Wide (5 cm stanga/dreapta)` / `Moderate (1.91 cm)` — Wide are 5,08 cm stânga/dreapta și 2,54 cm sus/jos; Moderate are 1,91 cm doar stânga/dreapta.
  - `un referat scolar standard are margini de 2 cm` vs `Normal (2.54 cm)` în același paragraf — normă inventată, două cifre concurente.
  - `Tragand de el [coltul], redimensionezi proportional intregul tabel` — proporțiile nu se păstrează fără Shift.
  - `Separatori comuni: … Punct-si-virgula (date europene)` — ok, dar zecimalele cu punct în exemple (`0.25pt`, `1.27 cm`) contrazic scrierea românească cu virgulă.
- **De ce contează:** fiecare e mic, dar elevul care verifică în Word găsește altceva și nu mai are încredere în lecție.
- **Severitate:** minor
- **Schimbare propusă:** corecturile de mai sus; zecimale cu virgulă în text (`1,27 cm`).

## 17. Repetiții care lungesc inutil lecția
- **Unde:** diferența Enter/Tab e explicată în atomul 3, în rezumatul atomului 3 și în „Greșeli frecvente” (1.); Delete vs ștergere structură în atomul 5 (de 2 ori) și în „Greșeli frecvente” (2.) și în tabelul de scurtături (de 2 ori); Tab în ultima celulă în atomii 3 și 5.
- **De ce contează:** la o lecție deja de 3–4 ori prea lungă, repetițiile ascund ce e nou.
- **Severitate:** minor
- **Schimbare propusă:** o singură explicație la locul ei + o casetă finală „Greșeli frecvente” cu câte o linie pe greșeală, cu trimitere la atom.

## 18. Lipsește un element util și ușor: repetarea rândului antet
- **Unde:** atomii 7–9 și 11 discută tabele lungi și tipărire (`un tabel foarte lung`, `Un tabel prea lat pentru pagina va fi taiat la printare`), dar nu apare „Repeat Header Rows / Repetare rânduri antet”.
- **De ce contează:** exact situația tabelelor pe mai multe pagini din referatele elevilor; se leagă direct de „estetica paginii tipărite” din standard.
- **Severitate:** minor
- **Schimbare propusă:** un paragraf + o captură în atomul despre pagină.

## 19. Text fără diacritice într-o lecție de tehnoredactare
- **Unde:** întreaga pagină: `Tabele in Word`, `Imbinarea si divizarea celulelor`, `Salveaza documentul ca "Orar_Scolar.docx"`; izolat `imporți`.
- **De ce contează:** e lecția în care elevul învață să tehnoredacteze documente „conform regulilor”; modelul oferit încalcă ortografia română. Diacriticele (tastatura românească) sunt chiar conținut de TIC la editarea de text.
- **Severitate:** important
- **Schimbare propusă:** conversie completă la diacritice (ș, ț cu virgulă), cu verificare după conversie; în exercițiul 1, cerința „scrie numele materiilor cu diacritice”.

## 20. Lipsește stratul pentru profesor și baremul
- **Unde:** nicăieri: timp estimat, fișier de pornire, barem pentru exercițiul 3 (formular), legătura exercițiilor „minim/standard/performanță” cu descriptorii „De bază/Consolidat/Avansat” din O. 4.615/2026.
- **De ce contează:** profesorul nu poate nota consecvent formularele; nu știe ce să taie din 11 atomi.
- **Severitate:** important
- **Schimbare propusă:** casetă „Pentru profesor” la subsol, vizibilă la tipărire: plan de oră, fișiere de pornire, barem pe puncte, corespondența cu descriptorii.

## 21. Finisaje de navigare și rezumat
- **Unde:** „Ce ai învățat astăzi” = lista titlurilor de atomi (`Inserarea unui tabel`, `Navigarea in tabel`…), nu ce știe elevul; „Următoarea lecție”: `Continua cu lectia urmatoare pentru a aprofunda cunostintele.` — următoarea e evaluarea modulului; nota administrativă în atomul 11: `Conform programei scolare OMEN 3393/2017, formatarea paginii este un continut obligatoriu distinct`.
- **De ce contează:** elevul nu știe că urmează evaluarea; rezumatul nu ajută la recapitulare; nota de programă e pentru profesor.
- **Severitate:** minor
- **Schimbare propusă:** rezumat cu acțiuni („Tab = celula următoare; Îmbinare = titlu pe toată lățimea; …”); „Urmează: Evaluarea modulului — recapitulează atomii 2, 5, 6, 8”; nota de programă mutată la subsol.

---

## Sumar
| Severitate | Nr. |
|:--|--:|
| blocant | 1 |
| important | 14 |
| minor | 6 |
| **Total** | **21** |
