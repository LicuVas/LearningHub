# Lecția VIII / M1 / nr. 7 — Formule de calcul cu operatori aritmetici · surse și verificări

Se predă în săptămâna 19–23.10.2026 (Tupilați luni, Izvoare marți 20.10, Brauner vineri 23.10). Autor: agent, 27.09.2026.

## Programa și planul
- Titlul lecției: `Info_Gimnaziu_2026/data/unitati.json`, VIII-U1, lecția 7 „Formule de calcul cu operatori aritmetici” (tip predare); datele: `planificari/Calendar_ore_VIII.md` (20.10.2026) și `Calendar_ore_8A_8M.md` (23.10.2026).
- Conținutul, copiat exact din `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`: „Formule de calcul care utilizează operatori aritmetici (+, -,*, /)”. Competențe CS.1.1, CS.3.1.
- Modelul: `_campaign/revizuire_completa_2026_09/01_PLAN.md` §5 (exemplul „VIII-U1 nr. 7”). Păstrate: A1 Cantitate / A2 5, B1 Preț / B2 120, „O formulă începe cu =”, `*`, C2 `=A2*B2` → 600, execuția și aplicarea „4 caiete a câte 7 lei”, predicția „Schimbă A2 în 10”, ordinea operațiilor într-o frază, fără TVA, atelier cu 3 teste, Excel-ul adevărat.
- Standardul: `05_STANDARD_LECTIE.md` (regulile 1–9, modul lecție, „Ce au găsit judecătorii” 1–18).
- Materialul profesorului: `Info_Gimnaziu_2026/materiale/continut/clasa_VIII_M1.json`, lecția 7 (formula cu =, adrese, + − * / ^, paranteze, „=B2+C2/2 nu e media”, erori). Jocurile: `jocuri/excel-viii` nivelul „Formule” (aceiași termeni: steluța, bara, „nu x”); `jocuri/excel-pas-cu-pas-viii` „Prima formulă”.
- Lecția 6 (`lectii/viii/m1-l06`, citită la final): predă ###### (coloana îngustă), zecimalele și procentele afișate. Lecția 7 nu contrazice nimic: nu spune că „orice cod cu # e o eroare”, ci numește cele trei coduri.

## Ce am ales să NU pun (și de ce)
- **Nota despre separatorul `;` / `,`** (planul, pct. 2): lecția nu are nicio funcție, deci niciun argument; nota ar introduce un cuvânt nepredat („argument”) fără folos. Rămâne pentru lecția 8 (funcțiile).
- **`^` (puterea), mânerul de umplere, `#REF!`, `####`** (materialul profesorului): nu sunt în conținutul programei pentru lecția 7 („+, -, *, /”); un pas = o idee și maximum 5 pași. De pus în lecția 8 sau într-un „Încă un exercițiu” ulterior, dacă profesorul vrea.
- **Media cu AVERAGE**: funcțiile vin în lecția 8. Aici media e „suma împărțită la 2” (cuvântul „medie” e explicat în P5 și e cunoscut de la matematică).

## Cele 9 greșeli ale lecției vechi (00_DECIZIE_SI_CONSTATARI.md) — cum sunt evitate
1. Text în celulă („A1 = Cantitate: 5”) → P2 e chiar pasul despre asta: instrucțiuni literale („În A2 scrie doar numărul 5”), mini-foaia Greșit/Bine, exercițiul-soră cu „Cantitate: 5”, „5 bucăți”, „cinci”; P6 arată #VALUE! pe exact greșeala aceasta. Nicio notație „A1 = …”.
2. Virgule vs `;`, rezultate cu punct → nicio funcție; toate rezultatele cu virgulă zecimală (8,5; 9,5; 7,5), probate pe setările românești; foaia respinge `0.5` într-o formulă, ca Excel.
3. Celulă cu două roluri → fiecare foaie are antetele ei; în aplicația reală media stă în E1:G2, cu antete proprii, nu sub „Cantitate”.
4. Protecție #DIV/0! fără împărțire → #DIV/0! apare doar la `=A2/B2`, cu B2 goală sau 0 (probat).
5. „Fiecare formulă are o eroare” fals → nu există exercițiu de tip „găsește greșeala”; fiecare cod de eroare are cauza probată.
6. Coloane care nu se potrivesc → enunțul atelierului cere D2, D3, D4, D5, exact celulele din verificare și din teste.
7. Contradicții despre ordinea operațiilor → o singură formulare (P5), aceeași în explicații („de la stânga la dreapta” doar între semne de același fel).
8. TVA 19% → nu apare TVA deloc.
9. `=` folosit înainte de explicație → P1 doar arată o captură (fără sarcină); P2 nu are formule; `=` e predat în P3, înainte de orice exercițiu cu formulă. Nu există buton „Copiază” în lecție (foaia are „Copiază tabelul”, care copiază doar celulele).

## Fidelitatea: ce e probat în Excel REAL
- **COM, instanță nouă și invizibilă** (`_proba/proba_excel.py` → `proba_excel.json`, 60 de cazuri): `DispatchEx`, `Visible=False`, fără salvare, `Quit()` doar pe ea; `Range.FormulaLocal` = ce tastează elevul (setări RO: virgulă zecimală, `;` listă); `Formula2Local` unde contează matricele dinamice. Excel 16.0 (Microsoft 365, build 20326), interfața 1033 (engleză), `xlDecimalSeparator` „,”.
- **Tastare adevărată pe un desktop ascuns** (`_proba/proba_ascuns.py` → `proba_ascuns_1/2/4.json`): `EXCEL.EXE /x` (instanță nouă), `WM_CHAR` în fereastra foii, bara de formule citită prin UI Automation, ferestrele de dialog prinse și fotografiate. Nimic pe ecranul vizibil (scriptul se oprește dacă rulează pe desktopul `Default`).
- **Separatorii englezești** (`_proba/proba_en.py` → `proba_en.json`): în aceeași instanță invizibilă, doar separatorii Excel-ului trecuți pe punct (`UseSystemSeparators=False`, `DecimalSeparator="."`), apoi refăcuți înainte de `Quit` (verificat: refăcut = true). Windows-ul nu e atins. `=(E2+F2)/2` cu 9 și 8 arată 8.5 (pe românești 8,5): de aici paranteza din aplicația reală, pasul 7.
- **Tastatura** (`_proba/proba_tastatura.py`): pe ambele aranjamente încărcate (SUA-Internațional, Română Standard) `*` = Shift+8, `/` = tasta din stânga lui Shift din dreapta (fără tastare).
- `afirmatii.json`: 43 de afirmații, toate probate în Excel real, 0 nepotrivite (generat de `_proba/gen_afirmatii.py`, care compară textul promis cu ce a citit din Excel).

Fapte găsite la probă (unele au schimbat simulatorul, vezi mai jos):
- `=A2xB2` → `#NAME?` (nu fereastră de problemă).
- `=5x3` → Excel propune „We found a typo in your formula and tried to correct it to: =5*3. Do you want to accept this correction?” (Yes/No); la No: „There's a problem with this formula.” Cu alertele oprite (`DisplayAlerts=False`), Excel acceptă singur corectura — de aceea prima probă COM a spus „respins”, iar tastarea cu alertele oprite a dat 15.
- `=A2*0.5` pe setări românești → Excel propune „corectura” `=A2*05` (adică `=A2*5`); acceptată, dă 40 în loc de 4. De aceea foaia refuză punctul zecimal cu o explicație.
- `=A2*B2)` → propune `=A2*B2`; `=A2*` → propune `=A2`, la No: „This is an incomplete formula…”.
- `=A2:B2` în C2 (20 și 4) → Excel 365 „varsă”: C2 = 20, D2 = 4; cu `FormulaLocal` (ca Excel 2016/2019) → `#VALUE!`. Lecția spune doar „: face o zonă, nu împarte” (adevărat în ambele).
- `=20:4` → Excel o rescrie `=4:20` (rândurile 4–20): `#SPILL!` în C2; tastată în C4 (pe rândurile 4–20) dă 0 (referință circulară).
- `'007` într-o formulă (`=A2*2`) → 14; `'12 lei` → 24 (textul care seamănă cu un număr intră în calcul). De aceea P6 spune „un text **cu litere**, de exemplu «5 bucăți»” (probat: #VALUE! pentru „5 bucăți”, „Cantitate: 5”, „10 kg”, antetul „Cantitate”).
- Celula goală: `=A2*B2` → 0, `=A2+B2` → 5 (cu B2 = 5), `=A2/B2` → `#DIV/0!`.
- Triunghiul verde pe celula cu `#VALUE!` / `#DIV/0!`: `Range.Errors(xlEvaluateToError).Value` = True (și se vede în capturi); pe 600 = False.
- Ctrl+Z după „5 bucăți” scris peste 10 (aplicația reală, pasul 6): A2 redevine 10, C2 redevine 1200 (o singură anulare; `ExecuteMso("Undo")`).
- Litere mici (`=a2*b2`) → Excel le face mari; spațiile (`= A2 * B2`) sunt primite și păstrate.

## Simulatorul: extensia `lectii/_sim/excelx-formule.js` (proprietar: autorul lecției 7)
`excelx.js` și `excelx-formatare.js` nu sunt atinse; motorul (`_motor/`) nu e atins. Extensia învelește `JocFoaie.evaluate` (chemat dinamic de foaie) și aduce foaia la ce face Excel-ul real (probele de mai sus):
1. `=A2xB2` → `#NAME?` (înainte: fereastra de problemă).
2. `=5x3` → fereastra de problemă cu textul „Excel-ul adevărat îți propune aici corectura =5*3” (Excel: fereastra Yes/No).
3. `=A2*0.5` → fereastra de problemă, cu explicația virgulei și a „corecturii” `=A2*05` (înainte: foaia calcula 4, deci accepta ce Excel nu primește).
4. `=A2:B2` → `#VALUE!` cu mesajul „: nu împarte…” (înainte: #VALUE! cu un mesaj despre SUM, cuvânt din lecția 8); `=20:4` → `#SPILL!` cu aceeași explicație (înainte: fereastra de problemă, deci respingea ce Excel primește).
5. `'007` într-o formulă → 7 (înainte: #VALUE!).
6. Testele numite ale atelierului verifică formulele pe COMPORTAMENT (rezultatul bun și pe numerele schimbate cu +3, +6, +9, ca verificarea foii din motor): un rezultat scris de mână (1000) sau `=D4/25` NU bifează testul (probat).
7. Telefon îngust: coloane mai înguste sub 420 px, literă mai mică sub 360 și 340 px, ca foaia cu 4 coloane să încapă (probat 412/390/375/360/320 px: `_proba/proba_latime.py` → 0 foi tăiate). Pe ecranele tactile: celule de 36 px înălțime, ↶ ↷ de 40 × 40 px, „Copiază tabelul” de 40 px.
8. (după judecătorul dirijorului, `_verificare/judecator.md`) Un text pe care Excel îl ia drept număr („150 lei”) intră în calcul ca număr din primul desen: C2 arată 750 imediat după Enter (înainte: #VALUE! până la următorul clic, deși mesajul spunea „Corect! C2 arată acum 750”).
9. `=A2 x B2` (cu spații) → `#NAME?` și mesajul despre `*`, ca în Excel (înainte: o fereastră despre un „0” nescris). Tastat în Excel: #NAME?, fără fereastră (`proba_ascuns_5.json`).
10. `×` și `÷` devin `*` și `/`, iar `+A2*B2` / `-A2*B2` (fără =) devin formule (`=+A2*B2`, 600), ca la tastarea în Excel 365 (`proba_ascuns_5.json`). Celula cu cod de eroare primește triunghiul verde (`Errors(xlEvaluateToError)` = True pe #VALUE!, #DIV/0!, #NAME?).

Abateri rămase, spuse aici (nu ascunse):
- Foaia nu arată fereastra Yes/No a corecturii propuse; arată fereastra de problemă și spune ce ar propune Excel.
- `=A2:B2`: Excel 365 varsă valorile în C2 și D2; foaia arată `#VALUE!` (ca Excel 2016/2019).
- Afișarea „General” pe lățimea coloanei: Excel arată `3,333333` / `18,66667`; foaia arată mai multe zecimale (`18,6666666667`). Nicio cheie a lecției nu depinde de asta (toate rezultatele cerute sunt exacte: 600, 28, 75, 15, 32, 8,5, 9,5, 7,5, 8, 52, 1300, 30).
- `'12 lei` (cu apostrof) într-o formulă: Excel 24, foaia `#VALUE!`.
- `=A2:B2`: mesajul foii spune acum și ce face Excel 365 („copiază alături numerele din zonă, fără să calculeze”), dar foaia însăși arată `#VALUE!`.

## Poarta și probele
- `test_joc.py --dir lectii/viii m1-l07` → TRECUT (27 de întrebări jucate; singurul avertisment: „1 niveluri”, așteptat).
- `verifica_lectie.py … --fara-t1` → S0 TRECUT, S1 0 identice, S2 6/6 aplicare/execuție, T0 0; ultima linie 0.
- `_proba/proba_gesturi.py` (Playwright, gesturi reale: 1280 px mouse + tastatură, 390 px atingere; drumurile greșite tipice incluse) → 127 de verificări, 0 picate, 0 erori în consolă, nimic mai lat decât ecranul.
- `_proba/numara_cuvinte.py`: textul pașilor 64–103 cuvinte, „Uite cum” ≤ 55 cuvinte.

## Judecătorul independent (Opus, n-a scris lecția), 27.09.2026
0 GRAV, 6 MEDIU, 8 MIC. Reparate toate, în afară de unul (MEDIU 4, #VALOARE!, rămas NESIGUR mai jos): „de același fel” spus explicit + exemplul amestecat `=20/4*2` (probat: 10); analogia rețetei înlocuită cu (9 + 8) : 2 de la matematică; 8.5 pe setări englezești (probat pe separatori); nota de telefon pentru * și /; regula „cuvântul are celula lui (aici, deasupra)”, ca să nu contrazică etichetele din coloana A ale atelierului; „scrie” ambiguu → „este”/„spune”; „Ce cuvânt nu cunoaște Excel?”; #NAME? cu exemplul `=A2xB2` (între numere Excel propune o corectură, vezi mai sus); „Începi mereu cu =” în loc de „fără =, Excel nu calculează” (cu `-` sau `+` în față Excel face formulă); catalogul: „doar nota, ca număr”; #DIV/0!: „numărul bun în locul lui 0 sau în celula goală”; Enter spus la pașii 5 și 7 din Excel; numele fișierului dat ca exemplu (Popescu_Ana_lectia7.xlsx).

## Judecătorul dirijorului (`_verificare/judecator.md`), 27.09.2026
1 GRAV, 1 MAJOR, 9 MINOR, toate în foaie (textul lecției: 65 de cazuri tastate în Excel real, 0 nepotriviri). Reparate: G1 („150 lei”), M1 (`=A2 x B2`), m1 (× ÷), m2 (+A2*B2), m3 (mesajul pentru `:`), m4 (triunghiul verde), m5 (ținte de atins), m7 (fâșia: antetele pe rândul 1, valorile pe rândul 2), m8 (excepția „150 lei e număr” spusă în P6), m9 (clasa în numele fișierului); plus nota „sau tasta * din dreapta, lângă cifre”. Rămâne m6 (fotografia unui bon adevărat, în `capturi_lipsa.json`, o face profesorul). Detaliile și probele: `_verificare/reparatii.md`.

## Judecătorul 2 al dirijorului (`_verificare/judecator_2.md`), 27.09.2026
0 GRAV, 0 MAJOR, 10 reparații confirmate, „publicabil”. Reparate și cele trei observații: R1 (P6: „un text cu litere”, pus înapoi, cu fraza despre „150 lei”), R2 (nota de telefon: „alege steluța * și bara /; dacă alegi totuși × sau ÷, Excel 365 le schimbă singur”), N1 (`=A2 B2` → `#NULL!` în foaie, fără fereastră, cu mesajul „Ai uitat semnul dintre A2 și B2”; Excel: #NULL!, F59). Detalii: `_verificare/reparatii.md`, „Runda 2”.

## NESIGUR (de confirmat în laborator)
- **Tastatura telefonului**: „alege steluța * și bara / dintre simboluri; dacă alegi totuși × sau ÷, Excel 365 le schimbă singur” — schimbarea e probată doar în Excel 365 (textul o spune); locul simbolurilor e formulat general (neprobat pe un telefon anume; pe Gboard și pe iPhone sunt pe pagini diferite de simboluri).
- **#VALUE! / #NAME? în Excel cu interfața în română**: calibrarea (`calibrare/meniuri_ro_en.json`) le are „NESIGUR” (#VALOARE! / #NUME? apar pe paginile Microsoft ro-ro, probabil traducere a site-ului). Materialul profesorului scrie „#VALUE! / #VALOARE!”. Lecția scrie codurile din Excel-ul probat (engleză). Proba de laborator: `=1+"a"` și Enter (fișa `de_confirmat_in_laborator.md`, pct. 10).
- **Setările regionale din laborator**: pe setări englezești, 8,5 apare 8.5 (probat pe separatorii Excel-ului, nu pe Windows englezesc); lecția o spune o dată, în aplicația reală. Foaia din pagină are doar setări românești.
- **Versiunea de Excel din laborator** (365 sau 2016/2019): schimbă doar ce apare la `=A2:B2`, pe care lecția nu-l promite.
