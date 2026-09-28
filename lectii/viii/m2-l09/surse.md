# Surse — lecția VIII / M2 / nr. 9: „Funcția de decizie. Rezolv o situație-problemă cu tabelul”

## Ancora în programă și în documentele profesorului
- **Plan:** `Info_Gimnaziu_2026/planificari/Calendar_ore_8A_8M.md` (13.11.2026, săpt. 9, M2, predare) și `data/unitati.json` (VIII-U1 „Calcul tabelar”, lecția 9, materiale: teorie, exerciții). Titlul paginii e exact cel din plan.
- **Programa (OMEN 3393/2017):** CS.1.1, CS.3.1; conținutul copiat exact din `AI_0/data/informatica_gimnaziu/curriculum.json` (cu ş și ţ ca acolo): „Funcții specifice aplicaţiei de calcul tabelar pentru sumă, maxim, minim, medie aritmetică şi decizie”.
- **Activitatea profesorului** (`data/activitati_lectii_VII_VIII.json`, lecția 9): „Construirea unei coloane care afișează automat „promovat / nepromovat” sau „în buget / depășit”. Elevii testează cu valori de la limită și corectează condiția.” → pașii 3 și 5 (promovat/nepromovat; „ne ajung banii / nu ne ajung”), testul la limită (P6, atelierul, laboratorul) și exercițiul „corectează condiția” (P6).
- **IF imbricat: NU.** Nu apare în documentele profesorului pentru lecția 9 (nici în `Proiectul_unitatii_VIII-U1.md`, nici în activități, nici în `materiale/continut/clasa_VIII_M1.json`). Două condiții (vârsta ȘI acordul) sunt tratate ca două decizii separate, în două coloane.
- **Mini-proiectul** (lecția 12, `activitati…json`) cere „o funcție de decizie”: lecția pregătește exact asta.
- **Clasele anterioare:** „Structura alternativă (decizia)” — V/29, VI/17, VII/27 (`unitati.json`) → legătura din pasul 0 și din „Ai nevoie de”.
- **Lecția 8** (alt autor, în paralel): folosesc doar ce mi s-a spus că predă — `SUM`, `AVERAGE`, `MAX`, zona ca argument (`=SUM(B2:B4)`, `=AVERAGE(B2:C2)`, `=MAX(B2:B4)`).

## Fapte probate în Excel-ul REAL (Microsoft 365, build 20326, interfața în engleză, setări regionale românești: `,` zecimală, `;` între părți)
Instanță NOUĂ (`EXCEL.EXE /x` pe un desktop ascuns, `hidden_desktop.py`; sau `DispatchEx` invizibil), fără salvare, `Saved=True` + `Close(False)` + `Quit`, apoi `taskkill` DOAR pe PID-ul meu (notat în fiecare JSON). Tastare literă cu literă (WM_CHAR + Enter), alertele PORNITE, ferestrele citite prin UI Automation.

| Fișier | Ce arată |
|---|---|
| `_proba/proba_ascuns.json` | condiția singură (TRUE/FALSE), toți operatorii la limită, `"da"`=`"DA"`≠`" da"`; IF de bază; 18 greșeli tipice cu fereastra lor |
| `_proba/proba_ascunse_2.json` | virgula ca separator între numere, ghilimelele de închidere, `„` doar la deschidere, 4.5 cu numere, `> =`; textul „da”; media + IF; săritura 3,5; excursia |
| `_proba/proba_ascunse_3.json` | pașii din laborator pe o COPIE a `excursia_lectia9.xlsx` (nesalvată, ștearsă); capturile curate pentru #NAME? |
| `_proba/proba_ascunse_4.json` | bugetul (SUM + IF, testul la limită cu `<=` și `<`) |
| `_proba/proba_com.json` | fiecare exercițiu, variantă de la limită și întrebare cu rezultat, prin `FormulaLocal` (44 de cazuri, 0 nepotriviri) |
| `_proba/proba_tastatura.json` | unde sunt `"`, `„ ”`, `;`, `<`, `>` pe aranjamentele instalate (fără să tastez nimic) |

Ce s-a aflat (și ce era greșit în foaia din motor, reparat în extensia `lectii/_sim/excelx-decizie.js`):
- `=DACĂ(…)` și `=DACA(…)` → **#NAME?**, fără fereastră. `=IF(` se scrie la fel în Excel-ul românesc (regula 6).
- **Ghilimelele românești** `=IF(B2>=5;„promovat”;„nepromovat”)` → Excel **NU primește formula**: fereastra *There's a problem with this formula* (OK). La fel `=IF(C2=„da”;…)` și `„promovat"`. Foaia din motor arăta **#NAME?** — greșit; reparat.
- **Ghilimele întoarse** `“promovat”` sau `”promovat”` (fără `„`) → **#NAME?**, fără fereastră.
- **Virgula ca separator** pe setări românești → fereastra de problemă, și cu text (`=IF(B2>=5,"promovat","nepromovat")`), și doar cu numere (`=IF(B2>=5,1,0)`, `=IF(B2<14,10,20)`). Foaia din motor le calcula pe cele doar cu numere; reparat.
- `=>`, `=<`, `==`, `!=` → *We found a typo in your formula and tried to correct it to:* (`>=`, `<=`, `=`, `<>`), Yes/No; la No, fereastra de problemă. `> =` (cu spațiu) → Excel propune `>5`. `≥` → **#NAME?** (foaia din motor arăta fereastră; reparat).
- `=IF(B2>=4.5;…)` → fereastra de problemă, **fără** corectură propusă (altfel decât `=A2*0.5` din lecția 7). `=IF(B2>=4,5;…)` → merge.
- 4 părți → *You've entered too many arguments for this function.* (foaia din motor alegea între primele două; reparat).
- Text fără ghilimele (`promovat`, `C3=da`) → **#NAME?**.
- Paranteza de la sfârșit uitată se pune singură; `=if(b2…` devine `=IF(B2…`; textul din ghilimele rămâne cum l-ai scris („Promovat”); IF fără a treia parte → FALSE; celula goală valorează 0; un text („absent”) e „mai mare” decât orice număr; `B2>="5"` → fals.
- TRUE/FALSE apar centrate. Pe Office în română, TRUE rămâne TRUE (pagina Microsoft ro-ro a funcției AND: „Afișează TRUE dacă…”, citată în `calibrare/meniuri_ro_en.json`) — **nu probat** pe un Office în română.

## Tastatura (P2, P4, laboratorul) — `_proba/proba_tastatura.json`
Pe acest PC sunt 4 aranjamente: Engleză (SUA), Română (Standard), Română (Moștenit), SUA-Internațional (sub limba română).
- `"`: SUA = Shift + tasta din stânga lui Enter; RO Standard = Shift + AltGr + aceeași tastă (care scrie ț); RO Moștenit = Shift + 2. Pe RO Standard, tasta din stânga lui 1 scrie „ și, cu Shift, ”.
- `;`: SUA = tasta din dreapta lui L; RO Standard și RO Moștenit = Shift + tasta virgulă.
- `<` / `>`: SUA = Shift + virgulă / punct; ambele RO = AltGr + aceleași taste.
- **SUA-Internațional:** `"` e tastă moartă: `"` urmat de a, e, i, o, u, y dă ä, ë, ï, ö, ü, ÿ. De aceea TOATE textele pe care elevul le scrie între ghilimele încep cu o consoană (promovat, merge, la timp, cu întârziere, reducere, calificat, ne ajung banii, diplomă, bursă…). După judecător (m5), P4 spune și ce faci dacă îți apare ä: Backspace, apoi " și Spațiu (probat pe aranjament: `"` + Spațiu dă ghilimeaua singură).
- Ce aranjament au calculatoarele din Brauner, Izvoare și Tupilați: **nu știu** (la fel ca la lecția 5).

## Simulatorul: `lectii/_sim/excelx-decizie.js` (nou, proprietar: autorul lecției VIII/9)
Învelește `JocFoaie.evaluate` după `excelx-formule.js`; nu atinge motorul, `excelx.js` sau `excelx-formule.js`. Adaugă cele 8 fidelități de mai sus, testele numite pe comportament cu valori de la limită (`teste[].variante`) și două lucruri de notare:
- textul rezultat se primește și fără diacritice („pret intreg” = „preț întreg”); foaia afișează ce a scris elevul;
- referințele cu zecimale sunt scrise direct pe setări românești (`3,5`); `peRO` din motor le-ar fi stricat (`3;5`), așa că extensia le pune ea la „Arată-mi răspunsul” și la rezolvarea porții.
- Pe telefon, foile cu 5 coloane au literă mai mică sub 420 px: probat că ultima coloană încape la 390 și la 320 px (`_proba/proba_latime.py`, 0).
**Abateri rămase:** fereastra Yes/No a corecturii (`=>`, `IF (`, `))`, ghilimeaua uitată) nu se poate accepta aici — foaia spune ce ar propune Excel și refuză formula, ca Excel după No; ferestrele au textul pe scurt, cu numele englezesc; setările englezești nu sunt simulate (butoanele RO/EN rămân ascunse, ca în `excelx.js`); părțile goale urmează Excel-ul (vezi judecătorul 2, n1).

## Probele paginii
- `test_joc.py --dir lectii/viii m2-l09` → **TRECUT** (26 de întrebări jucate; avertismentul „1 niveluri” e cel așteptat).
- `verifica_lectie.py … --fara-t1` → S0 TRECUT, S1 0 identice, S2 6/6, T0 0; ultima linie **0**.
- `_proba/proba_gesturi.py` (Playwright, gesturi reale; 1280 px mouse + tastatură, 390 px atingere; rețeaua blocată în afară de 127.0.0.1, închidere cu `ctx.close()`): **123 de verificări, 0 picate, 0 erori în consolă**; singurele cereri blocate: fontul Google. După reparații, `_proba/proba_judecator.py` (aceleași condiții): **55 de verificări, 0 picate, 0 erori**; `_proba/proba_latime.py` → 0. Capturile de telefon (`_tel_*.png`, `_tel_simboluri.png`) le-am privit.
- Cuvinte pe pas (`_proba/numara_cuvinte.py`): textul 74–100, „Uite cum” ≤ 62 (fără legendele pozelor).

## Imagini (`img/SURSE.json`)
- 8 capturi reale din Excel (desktop ascuns, PrintWindow, doar decupate): `conditie`, `if-promovat`, `if-fara-ghilimele`, `if-daca`, `medie`, `medie-dupa`, `buget`, `laborator-gata`.
- Pasul 0: `inaltime-carusel.webp` — „You cannot be taller than this to ride sign”, **Rick Obst, CC BY 4.0**, Wikimedia Commons (licența verificată pe pagina fișierului: `{{cc-by-4.0}}`, FlickreviewR passed). Decupată doar partea „You must be this tall…” și micșorată (spus sub imagine și în SURSE.json). Descărcată cu User-Agent-ul `LearningHub-lectii/1.0 (educational site)`.
- Refolosită de pe sit: `../m1-l03/img/confirma-inlocuire.webp` (lecția VIII/3, fereastra *Confirm Save As*).

## Registrul de descărcat
`excursia_lectia9.xlsx` — făcut cu `_proba/fa_registru.py` (date inventate), `curata_metadate.py --curata` → ultima linie 0. Pașii din laborator sunt probați pe o copie a lui (A18 în `afirmatii.json`).

## Nume românești și ce n-am putut verifica (NESIGUR)
- „Activare editare” pentru **Enable Editing**: preluat din lecția VIII/6, nu e în `calibrare/meniuri_ro_en.json`. Butonul e numit întâi în engleză.
- „Salvare ca (Save As)”, *File name*, *Confirm Save As*: din lecția VIII/3 (probat acolo, regula 26).
- **Setările englezești** (virgulă între părți, `3.5`): nu le-am putut proba fără să schimb setările Windows ale profesorului (regula 25). Textul le spune o dată (P3, P5) și ca soluție de rezervă în laborator.
- **Bara galbenă Enable Editing**: apare doar la fișierele marcate „descărcate de pe internet”; probele mele au deschis fișiere locale. Textul spune „Dacă apare…”.
- **Ghilimelele pe telefon**: mesajul foii sfătuiește „caută ghilimeaua dreaptă printre simboluri”; n-am probat tastaturile telefoanelor.
- **Urme în lista „Recent” a Excel-ului**: deschiderea cu `/x` a lăsat `_proba\_gol_l09.xlsx`, `_proba\_lab_copie.xlsx` și dosarul `_proba\` (Place MRU). Le scoate dirijorul la final cu `curata_mru_office.py --sterge` (regula 25; nu l-am rulat eu, fiindcă cere toate aplicațiile Office închise, iar alți autori lucrează în paralel).

## Reparațiile după judecătorul 1 (`_verificare/judecator.md`, 28.09: 0 GRAV, 5 MAJOR, 10 MINOR)
Faptele din Excel sunt ale judecătorului (`_verificare/j_excel_real.json`, tastat pe desktop ascuns); foaia reparată e probată cu `_proba/proba_judecator.py` (1280 px + 390 px cu atingere, 55/55).

| # | Problema | Reparația | Unde |
|---|---|---|---|
| M1 | după „Corect!” foaia îngheța, deci „Schimbă o notă…” nu se putea face | foaia rămâne vie după „Corect!” (`done()` = fals pentru foaie); probat: la P5, după „Corect!”, notele 4 și 5 dau 4,5 și corigent; în atelier, 14 la Ana dă 20 și totalul 60 | `lectii/_sim/excelx-decizie.js`, `ExcelD.render` (`api2.done`) |
| M2 | ghilimeaua cerută la P3, tasta ei spusă abia la P4 (regula 1) | tastele `;` și `"` (SUA, RO Standard, RO Moștenit) sunt acum în „Uite cum” de la P3; P4 trimite înapoi la pasul 3 | `index.html`, P3 „Uite cum”, P4 „Uite cum” |
| M3 | `<` în loc de `<=` la limită → „Verifică adresele” | dacă schimbând un singur semn de comparare formula ar trece, mesajul spune „greșește la limită”, cere să scrii în foaie chiar numărul din regulă și întreabă „la limită, regula trebuie să ia și valoarea egală sau nu?”, fără să numească semnul (după judecătorul 2, n4) | `excelx-decizie.js`, `semnLaLimita` + `api2.resolve` (toate foile lecției, și Î2, Î4) |
| M4 | `=IF($B$2<14;10;20)` → #NAME? („cuvântul B”) | `$` se scoate înainte de căutarea cuvintelor; `$B$2` și F4 dau 10 / „la timp”, ca Excel (e34) | `excelx-decizie.js`, verificarea 8 |
| M5 | ghilimea uitată → #NAME? | număr impar de ghilimele drepte → formula nu e primită, cu „Ai o ghilimea fără pereche…”, înaintea celorlalte verificări. Excel arată fereastra de problemă (e32, r12) SAU propune o corectură (e70, e73, r11 — la r11 corectura e greșită); mesajul spune ambele (judecătorul 2, n2) | `excelx-decizie.js`, verificarea 0 |
| m1 | `> =` cu spațiu: mesajul lăsa să se creadă că propunerea Excel e bună | „Excel îți propune aici >, fără egal… apasă No și scrie >= lipit” (e16, e16_Yes) | `excelx-decizie.js`, verificarea 4 |
| m2 | 5 drumuri rare | `IF (` → fereastra (e66); `))` la sfârșit → „Excel propune s-o scoată” (e33); `"a""b"` → textul a"b (e71); `;;` → 0 (e24); ghilimeaua de la sfârșit uitată → formula refuzată (e70, prin M5) | `excelx-decizie.js`, verificările 4b, 4c, `ghilimeleDublate`, `partiGoale` |
| m3 | testul „D5 adună biletele cu SUM” se bifa și cu =D2+D3+D4 | testul și „Verifică” cer funcția (`functii:{D5:'SUM'}`; la fel MAX în atelierul 2): „aici se cere funcția SUM” | `index.html` (atelier + atelierul 2), `excelx-decizie.js` (`areFunctia`) |
| m4 | condiția cu text (`C2="da"`) nespusă | P4: „Și în condiție: C2="da" întreabă dacă în C2 scrie da (literele mari sau mici nu contează).” (probat: A13) | `index.html`, P4 text |
| m5 | ce face copilul dacă îi apare ä | P4 „Uite cum”: „Dacă după " îți apare ä sau ë… apasă Backspace, apoi " și Spațiu: rămâne ghilimeaua singură.” (probat pe aranjamentul SUA-Internațional: A19) | `index.html`, P4 „Uite cum” |
| m6 | lecția 8: MAX, „argument” | „Ai nevoie de”: `=MAX(B2:B4)` și „argumentul funcției”; P3: „trei părți (argumente)”. Pătrățelul de umplere NU e pomenit: coordonatorul a spus că din lecția 8 pot numi doar SUM/MAX/MIN/AVERAGE, zona ca argument și AutoSum (trecut în `profil.json`) | `index.html`, antet + P3 |
| m7 | profilul spunea că lecția 7 a predat fereastra de problemă | scoasă de la lecția 7, trecută la „se predă aici” (P4); pătrățelul de umplere trecut la lecția 8, nefolosit | `profil.json` |
| m8 | legenda CC BY fără legături | „CC BY 4.0” → creativecommons.org/licenses/by/4.0/; „Wikimedia Commons” → pagina fișierului | `index.html`, P1 |
| m9 | antetul motorului pe telefon: legături de 23 px | NEREPARAT: e în `jocuri/_motor/motor.css` / `motor.js`, comun tuturor lecțiilor, pe care nu am voie să-l ating (brief). De reparat de proprietarul motorului | — |
| m10 | ghilimelele întoarse pe iPhone | bara de formule are `autocorrect="off"`; pe ecranele cu atingere, sub enunț, butoanele `" ; < > =` (40 × 44 px) le pun în bara fx, la cursor. Probat în Chromium cu atingere (formula scrisă cu butoanele → „la timp”, „Corect!”); NEPROBAT pe un iPhone sau Android real | `excelx-decizie.js`, `simboluri` |

## Reparațiile după judecătorul 2 (`_verificare/judecator2.md`, 28.09: 0 GRAV, 0 MAJOR, 5 MINOR; faptele: `_verificare/j2_excel_real.json`)
Probate cu `_proba/proba_judecator.py` (1280 px + 390 px cu atingere, rețeaua blocată): **73 de verificări, 0 picate, 0 erori**.

| # | Problema | Reparația | Unde |
|---|---|---|---|
| n4 | mesajul de la limită spunea semnul bun („aici trebuie <=”): la Î2 și Î4, notate, elevul primea răspunsul după prima greșeală | mesajul duce la locul greșelii, fără semn: „greșește la limită… Scrie în foaie chiar numărul din regulă și uită-te ce arată C2. Apoi uită-te la semnul de comparare: la limită, regula trebuie să ia și valoarea egală sau nu?”. Dacă formula dă ACUM rezultatul greșit (P6 pornește chiar la limită), mesajul nu mai spune „dă rezultatul bun acum”. Probat: la P6, „Verifică” fără nicio schimbare → „Nu încă”, și a doua oară la fel | `lectii/_sim/excelx-decizie.js`, `api2.resolve` |
| n1 | părțile goale de la sfârșit/început erau refuzate | o parte goală valorează 0 oriunde: `=IF(B2<14;10;)` → 10 sau 0, `=IF(B2<14;)` → 0 sau FALSE, `=IF(;10;20)` → 20, `=IF(B2<14;;)` → 0, și în SUM/AVERAGE/MAX (r01–r10) | `excelx-decizie.js`, `partiGoale` |
| n2 | mesajul ghilimelei fără pereche spunea mereu „There's a problem”, iar tabelul de mai sus spunea inexact că e70/e73 deschid fereastra de problemă | mesajul spune: fereastra de problemă SAU o corectură propusă, care poate fi greșită; rândul M5 de mai sus e corectat | `excelx-decizie.js`, verificarea 0; `surse.md` |
| n3 | `=IF(B2<14);10;20)`: foaia spunea „Excel propune s-o scoată”, iar Excel arată fereastra de problemă (r20) | un `;` rămas în afara parantezelor → „Ai închis paranteza prea devreme…”, fereastra de problemă; `)` în plus doar la sfârșit păstrează „Excel propune s-o scoată” (e33, r25, r27, r34, r36) | `excelx-decizie.js`, verificarea 4c' |
| n5 | antetul motorului pe telefon, legături de 23 px | NEREPARAT: e în motor (`jocuri/_motor`), comun tuturor lecțiilor; de reparat de proprietarul motorului | — |
