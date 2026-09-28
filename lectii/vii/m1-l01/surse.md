# Surse — lecția VII · M1 · 1: Ce facem anul acesta. Criteriile de evaluare și cele trei niveluri. Evaluare inițială

Scrisă de autorul lecției pe 27.09.2026. Reparată pe 28.09.2026 de două ori: după judecata 1 (`_verificare/judecator.md`) și după judecata 2 (`_verificare/judecator2.md`), cu completările dirijorului. Standardul: `_campaign/revizuire_completa_2026_09/05_STANDARD_LECTIE.md`.

## Programa și locul în an
- `C:/00/Projects/Info_Gimnaziu_2026/data/unitati.json`: VII-E0 „Deschiderea anului. Cum se învață și cum se notează”, CS.1.1, o oră: lecția 1 (organizare + evaluare inițială), materialele `fisa_criterii` și `test_initial`.
- `planificari/Proiectul_unitatii_VII-E0.md`: aceeași oră, cu CS.1.1 și descriptorii ei.
- Calendar: `Calendar_ore_7_MA.md` (Brauner, 11.09.2026), `Calendar_ore_VII_A.md` și `Calendar_ore_VII_B.md` (Izvoare, 08.09.2026). **Pentru Tupilați nu există Calendar_ore.**
- Programa nu are conținut pentru ora de organizare. De aceea nivelul are `continuturi:[]` (excepția `-E0` din `test_joc.py`), fără nicio ocolire.

## Forma, după judecata 2 (decizia dirijorului)
- **Pasul 0 și 5 pași:** unitățile anului, cele trei niveluri, lucrarea, nivelul din puncte, nota din nivel. Pasul 6 de odinioară („Câte note iei și regulile”) e acum rezumatul „Pe scurt” din pasul 5: 8 note (4 din lucrări, 3 din produse, 1 din portofoliu), o singură medie anuală cu ,50 rotunjit în sus, testul de început nu se notează. Rezumatul trimite la fișa de criterii din caiet.
- **Laboratorul are 5 pași:** titlul în caiet, nivelurile, pragurile și notele, copierea fișei de pornire, recitirea (cel mult trei legături, doar de citit).
- **„Cine dă evaluarea?” stă la ÎNCEPUTUL atelierului**, nu în laborator. Caseta din pagină citește starea din `prezenta.js` (`Prezenta.stare()`: `activ` / `intreaba` / altfel) și spune ce face elevul înainte să răspundă:
  - dacă lucrează ca altcineva: „Nu ești tu? Schimbă elevul”;
  - dacă e întrebat „Ești tot …?”: „Da, sunt eu” / „Nu, sunt alt elev”;
  - dacă nu e înscris: „Spune cine ești” / „Cine lucrează acum?”.

  Numele e scurtat ca în caseta de jos („Ana P.”). Tot acolo scrie că **caseta de jos se ascunde când ar acoperi un buton** (`prezenta.js`, `fereste()`: „mini ferit”) și că reapare dacă derulezi până la capătul paginii. Probat pe telefon: în laborator caseta era ascunsă peste o legătură, iar la capătul paginii se poate apăsa.
- **Drumul obligatoriu are 1.498 de cuvinte** (≈ 12 minute de citit, la 120 de cuvinte pe minut; judecata 2 măsurase ≈ 2.540). Numărătoarea e făcută cu `_proba/cuvinte.py`.
  - Intră: intro, „cum”, textul pașilor cu legenda pozei, „Uite cum” (e afișat din oficiu), „Încearcă” (enunț + variante), atelierul (intro, caseta „Cine dă evaluarea?” în forma pentru elevul neînscris, exercițiile), laboratorul (fără „Verifică-te”), cele 5 întrebări.
  - Nu intră: „Altfel”, „Încă un exercițiu”, indiciile, explicațiile de după răspuns, proba de a V-a, etichetele testelor, fișa de pornire.

## Ce am luat din documentele profesorului (au prioritate)
| În lecție | Sursa |
|---|---|
| Pasul 1: cele patru unități, în ordine | `unitati.json` VII-U1…U4; `Fisa_criterii_elev_clasa_VII.md` §1 |
| Pasul 2: cele trei niveluri; „diferența e aproape mereu situația nouă” | Fișa §2; `Saptamana1_clasa_VII.html`; `SISTEM_EVALUARE.md` §2; standardele (Ordinul 4.615/2026, anexa 15) |
| Pasul 3: părțile A 40 / B 30 / C 20 + 10 din oficiu; literele mici B / C / A de lângă cerințe | Fișa §3; `SISTEM_EVALUARE.md` §4.1; foile `Test_V-U1.html` și `Saptamana1_clasa_VII.html` |
| Pasul 4: pragurile 27 / 20 / 14, în ordine; În formare / În dificultate + plan de recuperare; „pragurile sunt regula profesorului” | Fișa §4; `SISTEM_EVALUARE.md` §4 |
| Pasul 5: benzile de note; nota după total (90 / 80 / 60 / 40); **În dificultate: 2 dacă a lucrat, 1 dacă n-a predat lucrarea sau a copiat**; „Pe scurt” | `SISTEM_EVALUARE.md` §3, §4.3-4.4; Fișa §5-6 |
| Atelierul: evaluarea inițială | `materiale/continut/teste_initiale.json` → `teste.VII` (ca pe foaia `Saptamana1_clasa_VII.html`) |

## Evaluarea inițială: cum am făcut-o corectabilă de elev (fără să schimb ce verifică)
Itemii și cheile sunt ale profesorului. Formele deschise le-am făcut alegeri sau răspunsuri scurte:
1. **A/F (De bază):** aceleași 5 afirmații și aceeași cheie.
2. **Completează (De bază):** aceleași 3 goluri. Primesc și răspunsuri fără diacritice și „slide-uri”.
3. **Suma 1…10 (Consolidat):** algoritmul se construiește din linii, cu capcane (s ← 1, s ← s + 1, pentru … 5). **Am adăugat** întrebarea „ce număr scrie la final” (55), care nu e pe foaie.
4. **Prezentarea de 5 minute (Consolidat):** primesc orice număr de la 5 la 8, ca în cheie, iar alegerile sunt primul diapozitiv, încheierea și ideile scurte.
5. **E-mailul „Ai câștigat un telefon!” (Avansat):** bifezi ce faci (4 bune, 3 greșeli tipice), apoi alegi motivul. Variantele greșite sunt credibile.
- **Proba din clasa a V-a** („Încă un exercițiu”) **NU e a profesorului.** E făcută după planul clasei a V-a și după jocurile de pe sit, iar **nivelurile ei le-am pus eu**.
- **Fișa de pornire** reține ce a trecut elevul de la prima apăsare pe „Verifică”, ce are de recitit (legături „doar recitire”) și ce **nu** a verificat proba. Nu dă nici nivel, nici notă.

## Reparațiile după judecata 2 (1 GRAV, 3 MAJOR, 3 MINOR) și după mesajele dirijorului
| Ce | Unde |
|---|---|
| **REGULA 24.** Toate probele merg pe `http://127.0.0.1:<port>` și trec printr-un singur context de browser, cu `ctx.route("**/*", … r.continue_() if "127.0.0.1"/"localhost" … else r.abort())`. Cererile oprite se numără (`raport_retea()`). Scripturile de depanare care încărcaseră elevi falși fără blocare sunt șterse. | `_proba/_gesturi.py` (`blocheaza_retea`, `context_nou`); toate `proba_*.py`, `cuvinte.py`, `jocuri_v_vi.py` |
| **GRAV (partea mea).** Identitatea se cere acum la ÎNCEPUTUL evaluării: caseta „Cine dă evaluarea?” e sus în atelier. Pasul din laborator nu mai cere înscrierea după evaluare. | `cineHtml()`, `umpleCine()`, `TipEval.render`; `LABORATOR` |
| **GRAV (restul) + MAJOR 1** („al cui e rezultatul”). Codul meu de fișă și de identitate e **scos** și înlocuit cu componenta comună `lectii/_sim/rezultat-elev.js`, fără logică paralelă. Cheile sunt `vii-m1-l01-initiala` și `vii-m1-l01-proba-v`, iar `RezultatElev.salveaza()` se cheamă la prima apăsare pe „Verifică” a fiecărei evaluări. Fișa se desenează din `citeste()` la evenimentul `rezultat-elev`. Butonul „Începe o fișă nouă (sunt alt elev)” e `golesteAlElevuluiDeAcum()`, iar caseta „Cine dă evaluarea?” folosește `cine()`. Verificările se anunță componentei de la încărcare, ca întrebarea „Verificarea de la ora hh:mm e a ta?” să apară imediat după reîncărcarea de la înscriere. Probat pe ambele drumuri ale judecății 2 (mai jos). | `<script src="../../_sim/rezultat-elev.js">`; `fisaHtml()`, `cineHtml()`, `TipEval.verifica()` |
| **MAJOR 2.** 5 pași după pasul 0; laboratorul are 5 pași; drumul obligatoriu, 1.498 de cuvinte. Întrebarea 5 (media anuală, fără exercițiu acum) e înlocuită de o variantă-soră a exercițiului cu literele: „lângă o cerință din partea B scrie mic «C (15 p)». Ce înseamnă C?” | pașii 1-5; `LABORATOR`; întrebarea 5 |
| **MAJOR 3.** Rețeaua blocată în probe (vezi regula 24). | `_proba/` |
| **m1.** „În dificultate: 2 dacă ai lucrat, 1 dacă n-ai predat sau ai copiat” (totalul nu alege aici) | pasul 5; „Verifică-te” din laborator |
| **m2.** Numele scurtat e „Ana P.” (prenumele + inițiala numelui), ca `scurt()` din `prezenta.js`. Probele folosesc nume ca în catalog („Pop Ana”). | `scurtNume()`; `_proba/proba_caseta.py` |
| **m3.** Legăturile din teste și din fișă au culoarea temei. Contrastul măsurat (`_proba/proba_intunecat.py`): cel puțin 6,68:1 în tema întunecată și 5,53:1 în cea luminoasă. | CSS `.ei-fisa a, .ei-teste a, .ei-mesaj a` |

Reparațiile după judecata 1 (Coșul, literele, numerele primite cu bunăvoință, variantele credibile, `?recitire=N`, „Proba nu a verificat” și celelalte) rămân. Lista lor e în `_verificare/judecator.md`.

## Regula 24: ce rulări ale mele au putut trimite cereri spre teste-vasile.netlify.app
Rulările de mai jos au încărcat `prezenta.js` cu elevi falși, **fără blocare**. Au mers pe `file://` sau pe `http://127.0.0.1`, deci cererile spre `teste-vasile.netlify.app/api/activitate` au putut pleca:
- `proba_doi_elevi.py`, scenariul B, pe 27.09, în jurul orei 23:44, apoi pe 28.09 în jurul orelor 00:00-00:25 (cam 5 rulări). Elevii: **„Ana Pop”** (id `t_ana`, numeEnc `x`) și **„Bogdan Ene”** (id `t_bog`, numeEnc `y`), școala „Tupilați”, clasa „VII”. La prima rulare, identitatea era „Ești tot…?” (`ultima: 0`), iar în starea asta `prezenta.js` nu trimite activitatea.
- `depanare_inscris.py` (șters), 2 rulări pe 27.09, în jurul orei 23:57: **„Ana Pop”** (id `t_ana`, numeEnc `x`), „Tupilați”, „VII”.
- `proba_caseta.py`, cam 5 rulări pe 28.09, între 00:05 și 00:25: **„Ana Pop”** (id `t_ana`, numeEnc `enc_t_ana`) și **„Bogdan Ene”** (id `t_bog`, numeEnc `enc_t_bog`), școala `tup` („Școala Tupilați”), clasa „VII”.
- Numele nu pleacă în clar, ci doar `numeEnc`, iar ale mele nu erau criptate cu cheia diplomelor. **`activitate.py lista` (28.09) nu are nicio intrare la Tupilați sau la clasa a VII-a.** „Ana Pop” și „Dan Ene” de la Brauner, 8 A, nu vin din rulările mele: altă școală, altă clasă, iar „Dan” nu l-am folosit niciodată.
- Cu blocarea pusă, probele încearcă în continuare să trimită, dar nimic nu pleacă. La ultima rulare (după componenta comună), `proba_doi_elevi.py` a încercat 4 cereri spre teste-vasile, iar `proba_caseta.py` 23. Toate au fost oprite.

## Reparațiile după judecata 3 (1 GRAV în componentă, 5 MINOR în lecție)
- **GRAV** (doi elevi neînscriși în aceeași filă): l-a reparat dirijorul în `rezultat-elev.js` v2, fără schimbare de API. Lecția n-are logică proprie. Am probat-o în `proba_doi_elevi.py`, cazul D: Ana (vizitator) greșește, pagina se reîncarcă în aceeași filă, iar Bogdan e întrebat „Ai dat-o tu pe cea de la ora …?”. La „Nu”, evaluarea lui e prima lui încercare (5 × ✔, fără „Ai refăcut”).
- **m1:** în starea „vizitator”, caseta „Cine dă evaluarea?” numește eticheta de jos: „Sunt elev — mă înscriu” (`cineHtml()`).
- **m2:** „Pe scurt” spune din nou „Testul de început nu se notează.”, pentru că indiciul trimite acolo (pasul 5). Ca să rămână drumul obligatoriu la 1.498 de cuvinte, am scurtat altundeva: întrebarea 2 și propoziția despre caseta ascunsă.
- **m3:** „Ana P.” fără al doilea punct (`cuPunct()`), iar „de 1 ori” a devenit „o dată” (`oriText()`: „o dată”, „de 2 ori”, „de 20 de ori”).
- **m4:** diploma nu mai spune „cum se face media anuală”.
- **m5** (Bogdan ignoră avertismentul): îl acoperă componenta v2 prin „Ești X?” la prima salvare pe un nume. Textele lecției nu contrazic asta. Caseta de sus spune pe cine arată caseta de jos. Fișa fără nume spune că întrebarea vine după înscriere. Fișa care așteaptă „Ești X?” (`deConfirmat`) spune că se scrie pe nume abia după răspuns.
- **Probele:** se închid doar cu `ctx.close()` (`_gesturi.inchide()`). Nicio probă nu mai cheamă `page.close()`.

## Componenta `rezultat-elev.js` v3 (finală: sha1 `eb8fdae3…`, cu `prezenta.js` `b098ce99`)
- **Unde `citeste(K)` e `null`**, lecția întreabă întâi `asteaptaConfirmare(K)`. Dacă fișa lui X e pe calculator, dar așteaptă „Ești X?”, scrie „Pe calculator e fișa lui {elev}, de la ora {ora}. Dacă ești {elev}, apasă sus «Da» ca s-o vezi.” și nu „Fișa de pornire e goală… rezolvă evaluarea”, care l-ar trimite pe elev să refacă evaluarea. Asta se aplică în fișa din atelier și în cea din laborator (`fisaHtml()`). Diploma nu desenează fișa.
- **Locul întrebărilor componentei:** `<div data-rezultat-elev-intrebare>` stă sus în atelier, deasupra casetei „Cine dă evaluarea?”, și în laborator, deasupra fișei. Întrebarea apare lângă fișă și nu acoperă exercițiile. Pe celelalte pagini (de exemplu, cuprinsul) stă sus, fixă, cum o pune componenta.
- **Probele noi, în `proba_caseta.py`, pe caseta reală:**
  - **Drumul 4:** Ana răspunde „Da” la „Ești Pop Ana?”. Urmează 8 minute și 30 de secunde fără nicio atingere, pe ceasul simulat (`context.clock`). Fișa spune „Pe calculator e fișa lui Pop Ana … apasă sus «Da»”, nu „goală”. După „Da”, se vede din nou.
  - **Drumul 5**, cele două „Da” la rând: Ana, neînscrisă, greșește, iar în aceeași filă Bogdan răspunde „Da” la „Ești Ene Bogdan?”. A doua întrebare e „Ai deja verificarea … Și cea de la ora … e tot a ta?”, cu „Nu” primul. La „Nu”, fișa lui are 5 × ✔.
  - `proba_doi_elevi.py`, cazul B: la o încărcare nouă, fișa Anei așteaptă „Da”, apoi se vede.

## Judecata 4 (0 GRAV, 0 MAJOR, 1 MINOR): unde apare „Ești X?” după „Verifică”
- **Înainte** (`_proba/proba_intrebare_loc.py inainte`): locul întrebării era la începutul atelierului. După „Verifică”, întrebarea stătea la **−4.198 px** pe telefon (390 px) și la −3.257 px pe calculator (1280 px), adică deasupra ferestrei. Mesajul de sub buton nu pomenea de ea. Mai mult: după „Verifică”, conținutul de deasupra crește (indiciul se deschide, apar mesajele „Recitește”), așa că și butonul, și mesajul ies din ecran.
- **După** (`proba_intrebare_loc.py dupa`):
  - locul întrebării e **sub teste, deasupra fișei**;
  - când `salveaza()` întoarce `deConfirmat`, pagina aduce întrebarea în fereastră (`scrollIntoView`, centrat);
  - mesajul de sub „Verifică” spune „Răspunde întâi la întrebarea «Ești …?», de sub teste: fără «Da», fișa nu se scrie pe numele tău.”

  Întrebarea stă la 309-535 px pe telefon (fereastra are 844) și la 315-484 px pe calculator (fereastra are 800). Testele cu ✗ se văd chiar deasupra ei. Rețeaua a fost blocată, iar pagina s-a închis doar cu `ctx.close()`.

## Contradicții și goluri (pentru profesor; nu le-am rezolvat din imaginație)
1. **Literele.** „PARTEA A” e partea de bază, dar litera mică „A” de lângă o cerință înseamnă Avansat. Lecția le explică pe amândouă. Generatorul de teste nu l-am atins.
2. **„Nota = punctaj : 10”** e pe toate foile. Lecția spune: „pe foaie poate scrie alt calcul; regula clasei e aceasta”.
3. **„Animații”** apare în `teste_initiale.json → verifica`, dar niciun item nu e despre animații. Fișa o spune la „Proba nu a verificat”.
4. **CC nu e predat în jocul `internet-vi`.** Explicația e în fișa de pornire.
5. **„5–8 diapozitive pentru 5 minute”** e regula profesorului, nepredată în niciun joc.
6. **Ultimul diapozitiv:** cheia spune „concluzie / mulțumiri”, iar `prezentari-vi` pune la final „sursele”. Întrebarea e „Cu ce închei prezentarea?”, fără „sursele” printre variante.
7. **Exercițiul 5 (Avansat)** seamănă mult cu `internet-vi`, nivelul 6.
8. **Atelierul are chiar itemii testului de pe foaie.** Dacă pagina ajunge la elevi înaintea foii, diagnosticul se strică.
9. Presupun că elevii de a VII-a au făcut în V-VI aceeași programă (OMEN 3393/2017).

## Materialul refolosit din jocuri
- Termenii evaluării sunt verificați ca predați în jocurile de a V-a și a VI-a (`_proba/cauta_termeni.py`, `jocuri_v_vi.json`).
- Cele 20 de legături `?recitire=N` deschid nivelul promis (`_proba/proba_recitire.py` → 0), pe motorul de pe disc, reparat de dirijor.

## Imaginea
`img/centuri.webp` (850 × 754, 42,6 KB): „File:Obi-gokyū.jpg”, chris 論, CC BY-SA 3.0, doar convertită în WebP. Proveniența e în `img/SURSE.json`.

## Ce n-am putut verifica
- CC, într-o aplicație de e-mail reală (A4 e documentată, nu probată).
- Formularul de înscriere trimis până la capăt („Gata”) cere serverul, iar rețeaua e blocată. Schimbarea elevului din listă e probată pe caseta adevărată.
- Componenta `rezultat-elev.js` n-am modificat-o și nici n-am rulat proba ei (`rezultat_elev_proba.py`), fiindcă e a dirijorului. Am probat-o prin lecție: `proba_caseta.py` și `proba_doi_elevi.py`.

## Porțile (28.09.2026, după judecata 2)
- `test_joc.py --dir …/lectii/vii m1-l01` → **TRECUT** (28 de întrebări jucate; doar avertismentul așteptat, „1 niveluri”).
- `verifica_lectie.py … --fara-t1` → S0, S1, S2, T0 TRECUT (S1: 0 identice, 0 aproape identice; S2: 6 din 6); **ultima linie: 0**.
- Probele, toate cu rețeaua blocată, la 390 px cu atingere și la 1280 px, 0 probleme și 0 erori în consolă: `proba_ui_l01.py`, `proba_recitire.py` (20 / 20), `proba_afirmatii.py`, `proba_intunecat.py` (contrast ≥ 4,5:1), plus:
  - `proba_doi_elevi.py`: altă filă, refacere, fișă nouă, înscriși, „Ești tot…?”;
  - `proba_caseta.py`, pe caseta adevărată: „Schimbă elevul”, apoi drumurile judecății 2. Drumul 1: neînscris → înscriere → „Da, e a mea” → fișa lui, iar refacerea nu dă ✔. Drumul 2: „Ești tot Pop Ana?” fără răspuns → nimic pe Ana → „Nu, sunt alt elev” → Bogdan → „Da”.
- Capturile de telefon privite: `_proba_telefon_fisa_dupa_inscriere.png` (după „Da, e a mea”: 2 × ✗, „Bogdan E.” în caseta de jos) și `_proba_telefon_fisa_bogdan.png`.
- Drumul obligatoriu: 1.498 de cuvinte; 5 pași după pasul 0; laboratorul, 5 pași (`cuvinte.py` → 0).
- Capturile privite: `_proba_telefon.png` și `_proba/_intunecat_tel_fisa.png`.
