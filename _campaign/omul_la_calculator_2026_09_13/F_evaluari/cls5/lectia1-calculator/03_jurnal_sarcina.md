# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului jucat (U11)
- 11 ani, clasa a V-a, a treia oră de TIC din viața lui de gimnaziu. Citește ~90 de cuvinte pe minut, tastează ~40 de caractere pe minut (ritmurile provizorii ale porții).
- NU știe: „input/output/processing” (engleza), ce e RAM, ce e un tranzistor, ce e Wi-Fi în sens tehnic. Știe telefonul, YouTube, Minecraft.
- NU vede: obiectivele (pliant închis), rezolvările (pliate), exercițiile (secțiunea e ascunsă până termină cei 6 pași — `u7_salvare_iesire.json`: `sectiunea_exercitii_vizibila_la_deschidere: false`).
- Are 50 de minute din care ~8 se duc pe pornire/logare/deschiderea paginii. Poate împarte PC-ul cu un coleg.
- E în laborator (5AM) sau într-o sală fără calculatoare (5M) — nu acasă.

## Povestea pașilor
1. **Primul ecran** (`ecran_prima_vedere.png`): meniu, insignă „Invatare Atomica”, bara de progres, pliantul cu obiective, apoi „Incearca singur! Provocare: Gaseste calculatoarele din jurul tau … in camera ta, in bucatarie, in rucsac, in buzunar”. **Blocaj 1:** e în clasă, nu acasă. Găsește PC-ul din față, telefonul (dacă îl are voie scos), proiectorul — și se oprește. Cuvântul „PROCESARE” din cerință nu fusese explicat. Am scris 5 dispozitive pe hârtie cu modelul lecției; a durat, la ritmul lui, ~7 minute.
2. **Pașii 1-6** (`pas_05.png` = tabelul generațiilor): text scurt + carduri, 10 întrebări care blochează avansarea. Toate cheile sunt corecte față de conținut (`u3_iesire.json`: 10/10), niciuna nu e varianta cea mai lungă. **Blocaj 2 (ipoteză):** la pasul 2 apar INPUT/PROCESSING/OUTPUT în engleză, cu traducerea în paranteză; copilul care nu știe engleză reține „IPO” fără sens. **Blocaj 3 (ipoteză):** pasul 6 are 7 unități, 1024, 2¹⁰ și o mnemonică („Beti Bere…”) — la clasa a V-a e materia unei ore întregi (ora 6 din plan).
3. **Exercițiul 1**: 8 × DA/NU, identic cu rezolvarea. „Incercuieste” nu are sens pe ecran. Radiatorul electric cu termostat digital ar putea deruta un copil atent.
4. **Exercițiul 2**: „Fa o investigatie in casa ta” — în oră nu se poate; l-am completat din memorie. Al treilea dispozitiv ales (televizorul) nu intră în tipurile propuse.
5. **Exercițiul 3**: 4 întrebări de argumentare, ~350 de caractere; premisa „majoritatea elevilor prefera laptopuri” nu e experiența unui copil de 11 ani.
6. **Salvarea**: butonul „Salveaza raspunsul” scrie în `localStorage` (cheia `practice-cls5-m1-sisteme-lectia1-calculator`). După reîncărcare textul e acolo; într-un profil nou de browser caseta e goală. Profesorul nu primește nimic.

## Puncte de verificare vizibile
Contorul „Pasul N din 6” e vizibil pe fiecare ecran — profesorul vede din spatele elevului unde a ajuns. Nu există nicio instrucțiune de tipul „ridicați mâna când ați terminat pasul 3”.

## Unde se blochează un începător (ipoteze AI, de verificat la oră)
Provocarea „din casa ta” în clasă; cuvintele englezești IPO; pasul 6 (1024, 2¹⁰); Exercițiul 2 care e temă de acasă.
