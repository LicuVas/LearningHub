# Recenzie — Clasa a V-a, „Componentele Hardware ale Calculatorului”

- **Fișier:** `C:\00\Projects\LearningHub\content\tic\cls5\m1-sisteme\lectia2-hardware.html` (663 linii, citit integral)
- **Data:** 13.09.2026 · **Tip:** recenzie de bază (citire + verificare față de motorul `assets/js/atomic-learning.js` și de programa/standardele din `data/informatica_gimnaziu/curriculum.json` — OMEN 3393/2017 + O. 4.615/2026)
- **Fișierul lecției NU a fost modificat.**

Severitate: **blocant** = elevul/profesorul nu poate folosi corect lecția așa cum e · **important** = lecția funcționează, dar învățarea sau ora are de suferit clar · **minor** = finisaj.

---

## 1. Lecția despre „cum arată componentele” nu are nicio imagine
- **Unde:** secțiunea „Încearcă singur”: `Uita-te la imaginile de mai jos (sau cauta pe Google Images: "computer internal components labeled")` — dar mai jos nu există nicio imagine; nici în atomi. Atomul 3: `Cauta pe Google Images "motherboard diagram labeled" pentru a vedea toate aceste componente`.
- **De ce contează:** la 10–11 ani, recunoașterea plăcii de bază, a RAM-ului sau a SSD-ului se face vizual. Promisiunea „imaginile de mai jos” e falsă, iar toată activitatea de descoperire depinde de o căutare externă, necontrolată, în engleză. Programa cere explicit identificarea „utilizând componente ale unor calculatoare dezasamblate, simulatoare virtuale, filme didactice, planșe”.
- **Severitate:** blocant
- **Schimbare propusă:** o planșă proprie (SVG/foto cu licență liberă) a interiorului unei unități centrale, cu numere în loc de etichete (elevul potrivește numărul cu numele), plus 1 fotografie pentru fiecare componentă din atomii 1–5. Sursa și licența imaginilor trecute sub imagine.

## 2. Activitatea de start trimite elevi de clasa a V-a să caute singuri pe Google, cu termeni în engleză
- **Unde:** `Deschide un browser si cauta "inside computer components labeled" sau "computer motherboard diagram labeled"`; indiciul 1: `Wikipedia are de asemenea diagrame excelente la articolul "Motherboard"`.
- **De ce contează:** căutarea liberă de imagini la 10 ani poate scoate conținut nepotrivit; termenii sunt în engleză (nivel nepotrivit), articolul Wikipedia indicat e în engleză; în laborator internetul poate lipsi. Ora se oprește dacă nu merge netul.
- **Severitate:** important
- **Schimbare propusă:** activitatea să folosească planșa din lecție (v. 1). Căutarea externă, dacă rămâne, doar ca temă opțională, cu link direct către o resursă verificată în română.

## 3. Clasificarea din activitatea de start nu se potrivește cu cea predată
- **Unde:** start: `Clasifica fiecare componenta ca: dispozitiv de intrare, dispozitiv de iesire, dispozitiv de intrare-iesire, componenta de procesare sau componenta de stocare` (5 categorii); pasul 8: `noteaza daca este INPUT, OUTPUT, sau INPUT-OUTPUT` (3 categorii, în engleză); atomul 4: `se clasifica in patru categorii`.
- **De ce contează:** trei clasificări diferite în aceeași lecție; elevul slab nu știe care e „cea bună” și amestecă denumirile românești cu cele englezești.
- **Severitate:** important
- **Schimbare propusă:** o singură clasificare, cea din atomul 4, cu denumirile în română (engleza doar între paranteze, o dată). Separat, distincția „componentă internă (unitatea centrală) / periferic”, care e alt criteriu, spusă explicit ca atare.

## 4. Chestionarul atomului 1 întreabă despre sursa de alimentare, care e predată abia în atomul 5
- **Unde:** titlul atomului 1: `1. Procesorul (CPU) si Sursa de Alimentare (PSU)` — conținutul vorbește doar despre CPU; întrebarea 2: `Ce se intampla daca sursa de alimentare (PSU) nu functioneaza?`. Atomul 5 are titlul `5. Placa Video (GPU) si Sursa de Alimentare (PSU)`.
- **De ce contează:** elevul e evaluat pe ceva ce nu a citit încă; titlul atomului 1 promite un conținut care lipsește. PSU apare de două ori în titluri.
- **Severitate:** important
- **Schimbare propusă:** titlul atomului 1 → „Procesorul (CPU)”; întrebarea despre PSU mutată la atomul 5; în locul ei, o întrebare despre CPU (ex. „Ce înseamnă că un procesor are 4 nuclee?”).

## 5. Indiciul chestionarului începe cu „Corect!” deși apare doar la răspuns GREȘIT
- **Unde:** toate indiciile: `"hint": "Corect! Procesorul (CPU) este creierul calculatorului..."`. În `atomic-learning.js` indiciul se afișează doar pe ramura `// Wrong answer - show correct answer and hint`, imediat sub mesajul `Incorect. Raspunsul corect este marcat cu verde.`
- **De ce contează:** elevul vede „Incorect.” și imediat „Corect!” — mesaj contradictoriu exact în momentul în care ar trebui să înțeleagă greșeala.
- **Severitate:** important
- **Schimbare propusă:** indiciile rescrise fără „Corect!”, ca explicație a raționamentului („Procesorul execută instrucțiunile… de aceea e numit «creierul»”). E o clasă de defect: probabil pe tot situl — de căutat mecanic `"hint": "Corect!` / `"Exact!`.

## 6. Obiectiv promis, dar nepredat: „cum colaborează componentele”
- **Unde:** obiectiv: `Sa descrii cum colaboreaza componentele pentru a executa o sarcina simpla`. Niciun atom nu parcurge un exemplu de flux (apăs o tastă → … → apare litera pe ecran).
- **De ce contează:** programa cere „evidențierea rolului componentelor hardware și a interacțiunilor dintre acestea”; standardul cere „structura generală a unui sistem de calcul”. Exercițiul 3 cere o schemă cu „sageti care arata fluxul datelor” fără ca fluxul să fi fost arătat.
- **Severitate:** important
- **Schimbare propusă:** un atom scurt (sau casetă în atomul 3) „Drumul unei litere”: tastatură (intrare) → placa de bază → RAM + CPU → placa video → monitor (ieșire) → salvare pe SSD (stocare). Cu o schemă simplă cu săgeți și o întrebare de ordonare a pașilor.

## 7. Fluxul de date din rezolvarea exercițiului 3 e greșit
- **Unde:** `sageti pentru flux: intrare, apoi CPU, apoi RAM, apoi GPU sau stocare`.
- **De ce contează:** datele de la intrare ajung în memoria RAM, de unde le ia procesorul; procesorul și RAM-ul lucrează în ambele sensuri. Modelul greșit se fixează exact la vârsta la care se formează.
- **Severitate:** important
- **Schimbare propusă:** „intrare → RAM ⇄ CPU → placa video → ieșire; ce vrei să păstrezi → stocare (și înapoi în RAM când deschizi fișierul)”.

## 8. Rezolvarea exercițiului 2 nu răspunde la ce cere enunțul
- **Unde:** enunț: `care e mai rapida, care pastreaza datele dupa oprire, si care are capacitate mai mare? Completeaza un tabel cu 3 diferente.` Rezolvare: `Viteza… Pastrarea datelor… Rol…` — capacitatea lipsește, apare „Rol”.
- **De ce contează:** elevul care își verifică tema acasă găsește altceva decât i s-a cerut; cel care a scris corect „capacitatea” crede că a greșit.
- **Severitate:** important
- **Schimbare propusă:** al treilea rând al rezolvării: „Capacitate: RAM mică (4–32 GB); HDD/SSD mare (256 GB – 2 TB)”, în forma de tabel cerută.

## 9. Afirmație tehnică inexactă despre GHz
- **Unde:** `Viteza procesorului se masoara in GHz (GigaHertz) — adica de cate miliarde de ori pe secunda poate executa o operatie simpla. Un procesor de 3 GHz executa 3 miliarde de operatii pe secunda!`; tabelul: `3.5 GHz = 3.5 miliarde operatii/sec`.
- **De ce contează:** GHz măsoară ritmul ceasului intern (impulsuri pe secundă), nu operații; două procesoare cu aceeași frecvență pot face cantități foarte diferite de lucru. E o eroare care se transmite mai departe.
- **Severitate:** minor
- **Schimbare propusă:** „GHz arată cât de des «bate» ceasul procesorului — de miliarde de ori pe secundă. Mai mult înseamnă, de obicei, mai rapid, dar nu e singurul lucru care contează.” Sau scoaterea tabelului (v. 10).

## 10. Prea mulți termeni tehnici pentru clasa a V-a, nedefiniți
- **Unde:** `Cache — Memoria ultra-rapida a procesorului — 8 MB cache`, `Sloturi PCIe`, `Conectori SATA`, `VRAM`, `volatil`, `Socket CPU`, `taskuri`, `browsing`, `Pro Tip`.
- **De ce contează:** standardul cere „rolul componentelor”, nu specificații; elevul slab se pierde, iar profesorul trebuie să decidă singur ce e de reținut. „Volatil” e folosit în chestionar și rezolvări fără să fie explicat ca termen.
- **Severitate:** important
- **Schimbare propusă:** trunchi comun = CPU, RAM, stocare, placă de bază, placă video, sursă + cele 4 categorii de dispozitive. Cache/PCIe/SATA/VRAM/socket → casetă „Pentru curioși”. „Volatilă” definită o dată: „memorie care se golește când se oprește curentul”.

## 11. Analogiile se contrazic între ele
- **Unde:** atomul 1: `CPU-ul este ca profesorul din clasa`; atomul 3: `Socket CPU: … (ca un fotoliu rezervat directorului)`; atomul 5: `Cand clasa (CPU-ul) are nevoie de ceva desenat… cheama profesorul de desen (GPU-ul)`; atomul 2: `HDD/SSD-ul este ca dulapul tau de acasa`; atomul 4: `Stocare = caietul tau`.
- **De ce contează:** analogia ajută doar dacă rămâne stabilă; aici procesorul e pe rând profesor, director și clasă, iar stocarea e dulap și caiet.
- **Severitate:** minor
- **Schimbare propusă:** o singură „școală-model” pe toată lecția: CPU = profesorul, RAM = banca/biroul din clasă, stocarea = dulapul, placa de bază = holurile, sursa = rețeaua electrică, GPU = profesorul de desen chemat de profesor.

## 12. Pictograme greșite care induc în eroare
- **Unde:** scanerul folosește aceeași pictogramă ca imprimanta (`&#128438;` 🖶) — la „Scanner”, „Imprimanta” și „Imprimanta multifunctionala”; monitorul are pictograma de laptop (`&#128187;` 💻); HDD, SSD și stick-ul USB au dischetă (`&#128190;` 💾).
- **De ce contează:** exact lecția care învață să deosebești dispozitivul de intrare de cel de ieșire le desenează la fel; discheta nu mai e cunoscută de elevi.
- **Severitate:** minor
- **Schimbare propusă:** pictograme/imagini distincte (sau fotografii mici) pentru fiecare dispozitiv.

## 13. Textul românesc e scris fără diacritice
- **Unde:** întreaga pagină: `Dupa aceasta lectie vei putea`, `Iesire`, `Placa de baza`, `siguranta`.
- **De ce contează:** e o lecție pentru elevi de 10 ani, pe o platformă școlară; ortografia fără diacritice contrazice ce se cere la limba română și, în TIC, lipsa diacriticelor e chiar un subiect de predat mai târziu (tastatura românească).
- **Severitate:** important
- **Schimbare propusă:** conversie la diacritice corecte (ă, â, î, ș, ț cu virgulă) pe tot textul vizibil, cu verificare după conversie (nu înlocuire oarbă — „tabla” / „tablă”, „fata” / „fată”).

## 14. Chestionarele sunt prea puține și nu acoperă stocarea sau HDD vs SSD
- **Unde:** atomul 2 (RAM + stocare) are o singură întrebare; atomul 3 una; atomul 5 una (numai GPU). Nicio întrebare despre categoria „stocare”, despre stick USB sau despre diferența HDD/SSD.
- **De ce contează:** progresul lecției se calculează pe chestionare; elevul poate „termina” lecția fără să fi fost verificat pe jumătate din conținut, iar profesorul nu vede golurile.
- **Severitate:** important
- **Schimbare propusă:** minim 2 întrebări pe atom; la atomul 4 una de tip „stick USB = ?” (distractor real: „intrare-ieșire”), la atomul 2 „de ce pornește mai repede un calculator cu SSD?”, la atomul 5 „ce face sursa?”.

## 15. Exemplul „Modem / Placa de retea” e un exemplu nepotrivit
- **Unde:** în „Intrare-Ieșire”: `Modem / Placa de retea — Trimite date catre retea (Output) + primeste date din retea (Input)`.
- **De ce contează:** definiția predată e „prin care TU trimiți / calculatorul îți transmite”; placa de rețea nu are legătură cu utilizatorul, deci contrazice regula „Trucul Magic” din același atom. Elevul nu o poate încadra cu regula învățată.
- **Severitate:** minor
- **Schimbare propusă:** scoasă din listă sau mutată la „Pentru curioși”, cu precizarea că aici „intrare/ieșire” se referă la calculator, nu la om.

## 16. Structură HTML duplicată în secțiunea de start
- **Unde:** `<div class="try-challenge">` conține un alt `<div class="try-challenge">`; două titluri `h2` consecutive (`Incearca singur!` și `Descopera Componentele!`).
- **De ce contează:** dublează chenarul vizual și încurcă cititoarele de ecran (două titluri de nivel 2 pentru aceeași activitate).
- **Severitate:** minor
- **Schimbare propusă:** un singur container, un singur titlu `h2`, restul `h3`.

## 17. Șablonul de notițe are buton „Copiază”, dar nu spune unde să fie lipit
- **Unde:** `Template pentru notite:` + `<button class="copy-btn">Copiaza</button>`, cu valori `INPUT / OUTPUT / INPUT-OUTPUT`.
- **De ce contează:** la clasa a V-a copierea/lipirea într-un editor poate să nu fi fost încă predată; fără instrucțiune, elevul nu știe ce să facă cu textul copiat.
- **Severitate:** minor
- **Schimbare propusă:** „Copiază în Notepad sau scrie în caiet”, cu categoriile în română; variantă tipăribilă (fișă).

## 18. „Vrei mai mult?” cere interpretarea unor date nepredate și a unei interfețe posibil în română
- **Unde:** `Cauta tab-ul Performance`; `Ce se intampla exact cu datele tale cand RAM-ul se umple complet si mai deschizi un program?`
- **De ce contează:** pe Windows în română tab-ul se numește „Performanță”; întrebarea despre RAM plin (memorie virtuală) nu are răspuns în lecție, deci elevul bun rămâne fără verificare.
- **Severitate:** minor
- **Schimbare propusă:** „tab-ul Performanță (Performance)”; un răspuns scurt pliabil la întrebarea „De ce” (calculatorul mută date pe disc, care e mult mai lent).

## 19. Lipsește stratul pentru profesor
- **Unde:** nicăieri în pagină: durată estimată, materiale necesare, ce se face dacă nu e internet, legătura cu competența CS 1.1 și cu descriptorii „De bază / Consolidat / Avansat” (O. 4.615/2026), barem pentru exercițiul 3.
- **De ce contează:** lecția are 5 atomi densi + 3 exerciții — mult peste o oră de 50 de minute la clasa a V-a (Informatică și TIC are 1 oră/săptămână). Profesorul trebuie să taie singur, fără ghid. Exercițiile folosesc nivelurile „minim/standard/performanță”, iar standardele noi folosesc „de bază/consolidat/avansat”.
- **Severitate:** important
- **Schimbare propusă:** casetă pliabilă „Pentru profesor” la subsol (tipăribilă, deci nu doar într-un `<details>` închis): plan pe 50 min (sau împărțire pe 2 ore), variantă fără internet, corespondența nivelurilor exercițiilor cu descriptorii, barem simplu la ex. 3.

## 20. Stiluri inline în ciuda regulii din propriul fișier
- **Unde:** `<!-- NO inline <style> blocks. ZERO. -->` urmat de zeci de `style="border: 1px solid var(--accent-blue); …"` și `style="color: var(--text-secondary);"`.
- **De ce contează:** nu afectează elevul direct, dar face modificările de temă (mod întunecat/luminos, tipar) inconsistente față de restul lecțiilor.
- **Severitate:** minor
- **Schimbare propusă:** clase CSS în `lesson-atomic.css` (`.io-category--input` etc.).

---

## Sumar
| Severitate | Nr. |
|:--|--:|
| blocant | 1 |
| important | 11 |
| minor | 8 |
| **Total** | **20** |
