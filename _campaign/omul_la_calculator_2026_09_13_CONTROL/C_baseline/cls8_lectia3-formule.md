# Recenzie — Clasa a VIII-a, „Formule de Bază în Excel”

- **Fișier:** `C:\00\Projects\LearningHub\content\tic\cls8\m1-excel-fundamente\lectia3-formule.html` (653 linii, citit integral)
- **Data:** 13.09.2026 · **Tip:** recenzie de bază (citire + recalcularea tuturor rezultatelor numerice + verificare față de motorul `assets/js/atomic-learning.js`, de lecțiile vecine din modul și de programa/standardele din `data/informatica_gimnaziu/curriculum.json` — OMEN 3393/2017 + O. 4.615/2026)
- **Fișierul lecției NU a fost modificat.**

Severitate: **blocant** = elevul/profesorul nu poate folosi corect lecția așa cum e · **important** = lecția funcționează, dar învățarea sau ora are de suferit clar · **minor** = finisaj.

---

## 1. Rezultat greșit în indiciul activității de start
- **Unde:** indiciul „Blocat la pasul 5?”: `Rezultatul ar trebui sa fie 78 (27 + 21 + 29).`
- **De ce contează:** 27 + 21 + 29 = **77** (atomul 6 dă corect `Total general: 27+21+29 = 77`). Elevul care a lucrat corect vede 77 în Excel, citește „ar trebui să fie 78” și crede că a greșit — exact în activitatea care trebuia să-i dea încredere în formule.
- **Severitate:** blocant
- **Schimbare propusă:** „Rezultatul ar trebui să fie 77 (27 + 21 + 29).”

## 2. Chestionarele sunt decalate față de atomi
- **Unde (atom → ce întreabă):**
  - atomul 2 „Cele 4 operații de bază” → `De ce este mai bine sa scrii=A1+B1in loc de=10+5?` (subiectul atomului 3)
  - atomul 4 „Referințe relative și Auto-fill” → `Care formula este echivalenta cu=B2+B3+B4+B5+B6?` → `=SUM(B2:B6)` (funcția SUM și intervalul `:` nu sunt predate în niciun atom)
  - atomul 5 „Atenție la ordinea operațiilor” → `In celula E2 ai formula=SUM(B2:D2). Daca o copiezi in celula E5…` (subiectul atomului 4)
  - ordinea operațiilor nu are nicio întrebare; nici cei 4 operatori.
- **De ce contează:** motorul blochează răspunsul după prima alegere; elevul e verificat pe altceva decât a citit, iar tocmai conceptul cu cele mai multe greșeli reale (ordinea operațiilor) iese neverificat.
- **Severitate:** blocant
- **Schimbare propusă:** întrebarea A1 vs 10+5 → atomul 3 (care are deja una; se pot păstra ambele); întrebarea „E2 → E5” → atomul 4; la atomul 2 o întrebare pe operatori („Cum scrii 12 : 4 în Excel?” cu distractorul real `=12:4`); la atomul 5 una pe prioritate („Cât dă `=2+3*4`?”, distractor 20) și una pe paranteze pentru medie. Întrebarea cu SUM → lecția 4 (Funcții) sau după predarea SUM (v. 3).

## 3. Funcția SUM și intervalul „B2:D2” sunt folosite peste tot, dar nu sunt predate nicăieri
- **Unde:** activitatea de start pasul 5 `=SUM(E2:E4)` (explicat doar într-un indiciu pliat); atomul 6 `E2 =SUM(B2:D2)`; chestionarul atomului 4; exercițiul 1 `=SUM(B2:E2)`; exercițiul 2 `=SUM(C3:C7)`; exercițiul 3 compară `=SUM(B2:B10)`. Lecția 2 a modulului promite: `Formulele =C4*D4 si =SUM(E4:E8) se invata in Lectia 3`. Obiectivele lecției 3 nu menționează SUM.
- **De ce contează:** elevul care nu deschide indiciul întâlnește SUM direct în tabelul final, în chestionar și în exerciții. Promisiunea din lecția 2 nu e onorată de nicio lecție (lecția 4 „Funcții” vine după).
- **Severitate:** important
- **Schimbare propusă:** un atom scurt „Primul ajutor: SUM și intervalul” (după atomul 4): ce înseamnă `B2:D2`, diferența `SUM(B2:D2)` vs `SUM(B2,D2)`, cu exemplu vizual al intervalului colorat; obiectiv adăugat.

## 4. Afirmație contrazisă chiar de exemplul de lângă ea
- **Unde:** atomul 5: `Ca in matematica, Excel nu calculeaza de la stanga la dreapta.` — iar în tabel: `=10-3+2 = 9`.
- **De ce contează:** exemplul `10-3+2 = 9` e corect tocmai pentru că Excel calculează **de la stânga la dreapta** operațiile de aceeași prioritate (altfel ar da 10-5 = 5). Elevul primește o regulă falsă și un exemplu care o infirmă.
- **Severitate:** important
- **Schimbare propusă:** „Ca la matematică: întâi parantezele, apoi înmulțirea și împărțirea, apoi adunarea și scăderea. Operațiile de același nivel se fac de la stânga la dreapta.” + un exemplu cu împărțire și înmulțire în lanț (`=12/3*2 = 8`).

## 5. Descrierea tastei F4 e greșită
- **Unde:** `apasa F4 pentru a o transforma rapid: B1 → $B$1 → B1`.
- **De ce contează:** F4 trece prin patru stări: `B1 → $B$1 → B$1 → $B1 → B1`. Elevul care apasă de două ori primește `B$1` (referință mixtă, nepredată), nu `B1`, și nu înțelege ce s-a întâmplat. Textul atomului anunță și „si/sau” (blocare doar de coloană sau doar de rând), dar tabelul arată doar `A1` și `$A$1`.
- **Severitate:** important
- **Schimbare propusă:** ciclul complet al F4; două rânduri noi în tabel pentru `$A1` și `A$1` marcate „Pentru curioși”; notă: „pe laptop poate fi Fn+F4”.

## 6. Cota de TVA de 19% e depășită
- **Unde:** atomul 7: `TVA | 19%`; chestionar: `Ai in celula B1 cota de TVA (19%)`; „Vrei mai mult?”: `cand rata se schimba (de exemplu TVA de la 19% la 21%)`.
- **De ce contează:** cota standard de TVA în România este 21% din 1 august 2025; lecția prezintă 19% ca valoare curentă și schimbarea la 21% ca ipoteză. Programa cere explicit „calculul TVA dintr-un bon fiscal” — elevul compară cu un bon real și găsește altă cifră.
- **Severitate:** important
- **Schimbare propusă:** 21% în exemplu și chestionar; „Vrei mai mult?” reformulat: „în august 2025 TVA a crescut de la 19% la 21% — cine avea cota într-o singură celulă a modificat o valoare”. De verificat cota în vigoare la data publicării.

## 7. Zecimale cu punct și nume de funcții doar în engleză, fără avertisment de setări regionale
- **Unde:** `=3.5*10` (chestionarul atomului 3), `9.00`, `9.67`, `7.50`, `9.25`, `18.67`, `=B2*C2*0.9` (lecția 1); `=SUM(...)`, `=AVERAGE(B2:D2)`.
- **De ce contează:** în Excel/Google Sheets cu setări regionale românești, separatorul zecimal e virgula (`3,5`) și separatorul de argumente e `;`. Elevul care tastează exact `=3.5*10` primește eroare sau text; unele funcții au nume traduse în interfața românească (ex. AVERAGE = MEDIE). E prima lecție cu formule, deci aici trebuie declarată convenția.
- **Severitate:** important
- **Schimbare propusă:** casetă „Setările calculatorului tău” la începutul lecției: „Dacă Excel e în română, scrii zecimalele cu virgulă (3,5) și separi argumentele cu ; — în lecție folosim varianta X”; aceeași convenție respectată în tot modulul.

## 8. Obiectivele și rezumatul sunt lipite mecanic din titluri
- **Unde:** `Sa explici 1. ce este o formula Excel`, `Sa aplici 3. de ce folosim A1 in loc de numere`, `Sa aplici 5. atentie la ordinea operatiilor`; rezumat: `Ai inteles 5. atentie la ordinea operatiilor`, `Acum stii 2. cele 4 operatii de baza`.
- **De ce contează:** fraze fără sens gramatical, cu numerotare în mijloc; un profesor sau inspector care deschide lecția o judecă după primele rânduri. Obiectivele nu sunt verificabile.
- **Severitate:** important
- **Schimbare propusă:** obiective operaționale: „Scrii o formulă care începe cu = și folosește adrese de celule”; „Folosești +, -, *, / și paranteze în ordinea corectă”; „Copiezi o formulă cu mânerul de umplere și explici cum se schimbă adresele”; „Blochezi o adresă cu $ când valoarea e fixă”; „Aduni un interval cu SUM”. Rezumatul cu aceleași idei, ca afirmații.

## 9. Lipsesc erorile tipice și citirea lor
- **Unde:** lecția nu are nicio casetă „Greșeală frecventă”; singura eroare menționată e `#REF!` ca distractor. Exercițiul 2 spune că fără `$` referința `s-ar muta pe B2, B3... adica celule goale` — dar B2 conține textul antetului `Pret/elev`, deci C4 ar da `#VALUE!`.
- **De ce contează:** primele formule ale elevilor dau `#VALUE!`, `#DIV/0!`, `#NAME?`, `####` sau formula afișată ca text; fără să le recunoască, elevul se blochează. Exercițiul 2 are chiar o eroare reală de arătat și o descrie greșit.
- **Severitate:** important
- **Schimbare propusă:** casetă „Când Excel se supără” cu 4 erori (cauză + reparație); în exercițiul 2: „fără $, C4 ar deveni =B4*B2 — B2 conține text, deci apare #VALUE!. Încearcă!”.

## 10. Bara de formule și editarea unei formule nu sunt predate, dar sunt cerute
- **Unde:** exercițiul 3, „Cuvinte cheie de folosit”: `bara de formule`; atomul 7: `Cand esti in bara de formule si cursorul e pe o referinta`. Nicăieri nu se explică diferența dintre ce se vede în celulă (rezultatul) și formula din bara de formule, nici cum modifici o formulă (F2 / dublu-clic).
- **De ce contează:** elevul care vrea să verifice „$B$1 rămâne fix?” (exercițiul 2, pasul 2) trebuie să știe unde se vede formula.
- **Severitate:** important
- **Schimbare propusă:** paragraf + captură în atomul 1: „în celulă vezi 15, în bara de formule vezi =10+5”; „ca să modifici formula: clic pe celulă și corectezi în bară, sau F2”.

## 11. Nicio captură de ecran; mânerul de umplere e descris doar în cuvinte
- **Unde:** `Pozitioneaza mouse-ul pe coltul din dreapta-jos al celulei (apare un + mic negru)`; grilele „Excel” din atomii 6–7 sunt `div`-uri desenate, fără bara de formule și fără a arăta formula selectată.
- **De ce contează:** mânerul de umplere e punctul unde se blochează cei mai mulți elevi (lecția are chiar un indiciu dedicat); o captură rezolvă pe loc.
- **Severitate:** minor
- **Schimbare propusă:** o captură cu mânerul de umplere (înainte/după tragere) și una cu bara de formule arătând `=B2*$B$1`.

## 12. Spații lipsă în jurul formulelor din chestionare
- **Unde:** `De ce este mai bine sa scrii=A1+B1in loc de=10+5?`; `echivalenta cu=B2+B3+B4+B5+B6?`; `ai formula=SUM(B2:D2)`; variantă: `=SUM(B2:D2)(ramane la fel)`; `"+(plus)"`, `"((paranteza)"`.
- **De ce contează:** la o întrebare despre scrierea exactă a formulelor, textul lipit („scrii=A1+B1in”) face formula greu de citit și sugerează că spațiile/parantezele fac parte din ea.
- **Severitate:** minor
- **Schimbare propusă:** `scrii =A1+B1 în loc de =10+5`; `=SUM(B2:D2) (rămâne la fel)`; `+ (plus)`, `( (paranteză)`.

## 13. Indiciile chestionarelor încep cu „Corect!/Exact!” deși apar doar la răspuns greșit
- **Unde:** `"hint": "Corect! Semnul = (egal) ii spune Excel-ului…"`, `"hint": "Exact! Cand folosesti referinte…"`. În `atomic-learning.js`, indiciul se afișează doar pe ramura `// Wrong answer`, sub `Incorect. Raspunsul corect este marcat cu verde.`
- **De ce contează:** mesajul „Incorect.” urmat imediat de „Corect!” derutează exact când elevul trebuie să înțeleagă greșeala.
- **Severitate:** important
- **Schimbare propusă:** indiciile rescrise ca explicație, fără „Corect!/Exact!”. Clasă de defect probabil pe tot situl — de căutat mecanic.

## 14. Numerotarea atomilor e dezordonată
- **Unde:** atomul 3 fără număr în titlu (`De ce folosim A1 in loc de numere?`), atomul 6 fără număr (`Tabel final cu toate formulele`), atomul 7 intitulat `6. Referinte absolute ($B$1)`; titlul fiecărui atom apare de două ori (`atom-title` + `concept-name` identic).
- **De ce contează:** „Atomul 7” cu titlul „6.” încurcă elevul și profesorul care spune „deschideți atomul 6”.
- **Severitate:** minor
- **Schimbare propusă:** titluri fără numere (numărul îl pune deja `atom-number`), fără dublura din `concept-name`.

## 15. Tabelul final afișează rezultatele inconsecvent
- **Unde:** atomul 6, coloana Media: `9.00`, `7`, `9.67`; nota: `Am scris doar 4 formule (E2, F2, B5, E5)` — dar C5 și D5 (24, 27) au și ele valori, fără să se spună de unde vin.
- **De ce contează:** în Excel, formatul General arată `9`, `7`, `9,666667`; elevul care compară cu ecranul lui vede altceva și nu știe dacă a greșit. C5/D5 nemenționate sugerează că au fost scrise de mână.
- **Severitate:** minor
- **Schimbare propusă:** aceleași zecimale peste tot (și o frază: „Media lui Ion arată 9,666667 — o rotunjim din butonul «Micșorare zecimale»”); „B5 copiată spre dreapta până la D5”.

## 16. Exemple nepotrivite pentru context
- **Unde:** atomul 2: `Scor_Total = Kill_Points + Assist_Points - Death_Penalty`; atomul 7: rândul `Ruler` între `Caiet` și `Pix`; deschiderea: `Ai 30 de elevi… Cu calculatorul? Iti ia 20 de minute. Cu o formula Excel? 5 secunde`.
- **De ce contează:** „Kill points” e vocabular de joc violent în engleză; „Ruler” e o scăpare de traducere; „cu calculatorul” într-o lecție de TIC se înțelege „cu computerul” — adică exact ce se recomandă, deci contrastul nu funcționează.
- **Severitate:** minor
- **Schimbare propusă:** analogie cu punctajul unui meci de baschet sau al unui concurs școlar; `Riglă`; „Cu calculatorul de buzunar? 20 de minute.”

## 17. Activitățile nu ating aplicațiile cerute de programă
- **Unde:** toate exemplele sunt catalog de note și buget de excursie. Programa clasei a VIII-a cere și: „calculul TVA dintr-un bon fiscal”, „formule de calcul la fizică, matematică, chimie, geografie”, „date colectate din experimente simple”.
- **De ce contează:** formulele rămân legate de un singur tip de tabel; lipsește transferul interdisciplinar, iar la inspecție activitățile nu acoperă lista din programă.
- **Severitate:** minor
- **Schimbare propusă:** în exercițiul 3 sau în „Vrei mai mult?”: viteza medie `=distanta/timp` pe mai multe tronsoane (fizică) sau perimetre/arii cu `$` pentru o constantă; TVA pe un bon cu 5 produse (legat de finding 6).

## 18. Activitatea de start: legături externe care cer cont și structură dublată
- **Unde:** `Deschide Excel Online (gratuit cu cont Microsoft)`; butonul `← Inapoi` fără nicio acțiune; `<section class="try-section">` → `<div class="try-challenge">` → `<div class="try-section">` (secțiune în secțiune, două `h2`).
- **De ce contează:** la 14 ani un cont Microsoft personal cere acordul părintelui; fără cont școlar, legătura nu duce nicăieri. Butonul inert pare stricat.
- **Severitate:** minor
- **Schimbare propusă:** „cu contul școlii” sau varianta Google Sheets / LibreOffice Calc pe primul loc; butonul „Înapoi” eliminat; un singur container.

## 19. Lipsește stratul pentru profesor
- **Unde:** nicăieri: durată, ce e obligatoriu și ce opțional (referințele absolute sunt un salt mare pentru o singură oră), barem pentru exercițiul 3 (care cere explicații libere), legătura cu descriptorul „De bază” — `formule cu operatori aritmetici` — din O. 4.615/2026.
- **De ce contează:** descriptorul „De bază” se oprește la operatori aritmetici; referințele absolute țin de „Consolidat/Avansat”. Fără marcaj, profesorul predă tot la tot grupul sau taie la întâmplare.
- **Severitate:** important
- **Schimbare propusă:** casetă „Pentru profesor” la subsol (vizibilă la tipărire): plan pe 50 min; atomii 1–5 = bază, atomul 7 = consolidat (sau oră separată); barem pe puncte la exercițiul 3.

## 20. Text fără diacritice
- **Unde:** întreaga pagină: `Formule de Baza in Excel`, `Referinte relative`, `Impartire`, `Inmultire`.
- **De ce contează:** platformă școlară românească; ortografia greșită se preia în documentele elevilor.
- **Severitate:** important
- **Schimbare propusă:** conversie completă la diacritice (ș, ț cu virgulă) pe textul vizibil, fără a atinge formulele și codul; verificare după conversie.

## 21. „Următoarea lecție” generică
- **Unde:** `Continua cu lectia urmatoare pentru a aprofunda cunostintele.`
- **De ce contează:** elevul nu știe că urmează „Funcții” (SUM, AVERAGE, MIN, MAX), pentru care lecția aceasta pregătește.
- **Severitate:** minor
- **Schimbare propusă:** „Urmează Lecția 4 — Funcții: SUM, AVERAGE, MIN, MAX. Adu-ți catalogul de azi, îl folosim.”

---

## Sumar
| Severitate | Nr. |
|:--|--:|
| blocant | 2 |
| important | 11 |
| minor | 8 |
| **Total** | **21** |
