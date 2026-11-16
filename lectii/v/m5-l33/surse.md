# Lecția 33, clasa a V-a — surse, probe și ce n-am putut verifica (09.11.2026, valul B M5, cu VII/24 și VIII/24 în paralel)

**Nu e publicată, nu e în depozit (fără commit).** Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`. Granița: `_campaign\revizuire_completa_2026_09\m5_noapte_08_11\granite\v_l33.md`. Starea autorului: `_proba\stare_autor.md`.

## Programa și planul
- `lectii\plan.json` / `Calendar_ore`: lecția 33, „Implementez structura alternativă. Evenimente și coliziuni”, predare, 28.05.2027; unitatea V-U6 „Din algoritm în joc: mediul grafic interactiv (Scratch)” (`Proiectul_unitatii_V-U6.md`: „Materiale de folosit: teorie, exercitii”).
- CS.3.2 „Implementarea unui algoritm care conţine structura secvenţială şi/sau alternativă într-un mediu grafic interactiv”, partea alternativă. Programa (`curriculum.json`, activități): „identificarea necesității utilizării unei structuri de decizie (alternative) și introducerea în aplicația creată a unor astfel de structuri”; „identificarea unei posibile coliziuni dintre un personaj grafic şi un alt obiect din animație”; „asocierea unei acţiuni unui personaj grafic, în funcţie de apariţia unui eveniment”.
- Conținutul declarat, textul EXACT din `curriculum.json`: „Modalități de reprezentare a structurilor secvențiale și alternative prin blocuri grafice”. Aici, partea alternativă (partea secvențială e la V/32; spus în `ancoraText`).

## Activitatea profesorului (citată întocmai, `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`)
„Elevii adaugă la proiectul propriu o regulă de tipul „dacă atinge marginea, atunci..." și testează imediat efectul. Se discută ce se întâmplă dacă lipsește condiția.” Resursa: „laborator, proiect de pornire pregătit”.
- „Adaugă o regulă și testează imediat”: P3-P4 (exerciții), atelierul, laboratorul 3-4.
- „Proiect de pornire pregătit”: `pornire-33.sb3`, de descărcat din pagină (casetă la P2, laborator 1). „Proiectul propriu” nu există: V/31 și V/32 șterg fișierul la sfârșitul orei.
- „Se discută”: fără profesor, la ora simultană nu se poate. Devine exercițiu + alegere (P5; ghidul VI.3 și S12): elevul scoate condiția, apasă de 5 ori, spune printr-o alegere ce s-a schimbat.

## Tabelul conținut → cerință / „Încearcă” / întrebare
| Ce predau | Pas | Încearcă | Atelier / laborator | Întrebare |
|---|---|---|---|---|
| Evenimentul, „când se dă click pe acest personaj” | P2 | face programul, apasă de 2 ori | atelier (dat), lab 2 | Q1 |
| Decizia: „dacă atunci”, locașul, gura; o singură verificare | P3 | pune blocul în gură (70 de pași) | atelier, lab 3 | Q2, Q3 |
| Coliziunea cu marginea, „atinge marginea?” | P4 | condiția în locaș + ▾ (100 de pași) | atelier, lab 3-4 | Q2 |
| Lipsește condiția | P5 | scoate condiția + alegere | lab 6 | Q4 |
| Coliziunea cu alt personaj, ▾ Minge | P6 | schimbă condiția | atelier, lab „mai ai timp” | Q5 |

## Ce presupune lecția că știe elevul (`profil.json`) — cu bife
- ☑ Decizia în cuvinte, condiția, adevărat / fals, „unele decizii n-au altfel” (V/29, publicată, citită).
- ☑ Zonele, tragerea, lipirea, steagul, Stop, salvarea, F2, Delete (V/31, **doar după granița** `v_l31.md`, citită din nou la 07:18 de autorul R1, cu SCHIMBAT 02:09, 03:15 și 05:43; forma limbii, „derulezi până la litera R”, preluată). DE VERIFICAT DE DIRIJOR după publicarea V/31.
- ☑ mergi, numărul din bloc, „mergi la x 0 y: 0” (paleta arată locul de acum), x, y, „peste marginea de jos”, Ctrl+Z (V/32, **doar după granița** `v_l32.md`, citită din nou la 08:43, cu SCHIMBAT 04:09). DE VERIFICAT DE DIRIJOR după publicarea V/32.
- ☑ Explorer: Descărcări, F2, Delete (V/10-11, V/15, publicate).
- ☐ „Load from your computer”: nu e predat nicăieri la a V-a: îl predau aici (P2, caseta; laborator 1), cu captură.

## Decizii (luate fără profesor; motivul)
1. **FĂRĂ buclă în proiect; regula stă sub evenimentul de apăsare.** Ambele variante probate viu:
   - *Varianta aleasă* (`_proba\live_v33.py`, `live_lab.py`): `când se dă click pe acest personaj` → `mergi 50 pași` → `dacă atinge marginea? atunci mergi la x 0 y: 0`: x 50, 100, 150, 0, 50, 100. Fiecare apăsare = o verificare, deci efectul se vede imediat și se poate urmări pas cu pas, cu x sub scenă. Merge și cu degetul (`live_lectie.json`, atingere pe tabletă emulată).
   - *Varianta respinsă* (`_proba\live_bucla.py`): `la infinit { mergi 5; dacă atinge marginea? atunci mergi la 0 0 }`, pornit cu steagul: merge, dar pisica aleargă singură și programul nu se oprește niciodată, fără Stop; fără condiție, rămâne la marginea scenei, cu programul pornit, iar copilul nu vede de ce. Ar cere un bloc nepredat, numit (`la infinit`), și o propoziție „verifică mereu” care e o regulă cu excepție: sub steag, fără buclă, verifică o dată (regula 16). Programa de a V-a nu cere repetiția, iar granița o interzice ca temă.
   - Costul: pisica nu se mișcă singură, deci nu e încă un joc. V/34 are două drumuri (vezi „Pentru lecția următoare”).
2. **Evenimentul nou = apăsarea pe personaj, nu tasta.** Merge cu mouse-ul și cu degetul (regula 15). Tastele nu există pe telefon. Blocul cu tastă rămâne pentru V/34, dacă e nevoie.
3. **Acțiunea din gură = „mergi la x 0 y: 0”.** E un bloc știut (V/32), efectul se vede în x, iar fără condiție pisica trece de margine, deci se vede ce lipsește. „spune” apare doar opțional.
4. **Un singur bloc de condiție în pagină, `atinge_ob`, cu Minge în listă,** ca în proiectul de pornire (în Scratch, lista are Minge fiindcă proiectul are mingea). Mingea stă în afara drumului în P2-P5 (x 100, y 100), ca în fișier.
5. **Doar câteva gesturi noi la casete.** Casetele construiesc proiectul elevului (S80); laboratorul verifică, completează și salvează (S81), iar cine a sărit casetele are drumul scris.
6. **Numele fișierului salvat:** `<clasa ta>-prenume`, ca `5A-Ana` (V/31). Se șterge la sfârșitul orei, împreună cu `pornire-33`.
7. **Scoaterea condiției:** pagina cere să o tragi pe un loc gol din zona de cod; testul primește și condiția ștearsă în paletă (regula 29).

## Probe (rezultate)
Toate: Chromium din Playwright, headless, profil temporar, fără cont, fără „Distribuie”; rețeaua doar spre `*.scratch.mit.edu` (editor) sau blocată (pagina), închidere cu `ctx.close()`.
- `_proba\live_v33.py` → `live_v33.json`: numele blocurilor, apăsarea (pornește la apăsare, nu la ridicare), clicul pe scena goală, tragerea, regula, locașul gol, fără „dacă”, „dacă” sub steag, pragurile marginii (x 194 / −193, y 131 / −130), harta atingerii cu mingea, numele la salvare, „Replace contents”.
- `_proba\live_lab.py` → `live_lab.json`: drumul laboratorului, cu gesturi reale, pe `pornire-33.sb3` (Load, „dacă”, condiția în cerculeț dinadins, apoi în locaș, ▾, „mergi la”, 0 și 0, 4 apăsări, scoasă condiția, 5 apăsări, salvare, structura citită din `.sb3`-ul salvat, mingea trasă, Sprite1, a doua regulă). **Rezultat: 0 pași eșuați** (x 50, 100, 150, 0 cu regula; 50, 100, 150, 200, 250 fără condiție; 50, 0, 50 cu mingea pe drum; condiția în cerculeț: x 1, 2, 3; numărul 50 revine; structura salvată = cea cerută).
- `_proba\live_lectie.py` → `live_lectie.json`: **toate programele din pagină**, încărcate în Scratch, 5 apăsări, față de simulator. **Rezultat: 43 de programe, 43 la fel ca în simulator.** Prima rulare a dat o diferență, „Atelier inca0 inceput”: la y 150 mingea acoperă pisica, iar apăsarea probei a căzut lângă ea; `_proba\live_lectie2.py` caută cu `renderer.pick` un pixel chiar al pisicii: aceleași numere. Tot acolo: apăsarea cu degetul pe scena adevărată (tabletă emulată): x 50, 100, 150.
- `_proba\live_bucla.py` → `live_bucla.json`: varianta respinsă (decizia 1).
- `_proba\proba_mesaje.py`: greșelile tipice pe testele din pagină; niciuna nu trece, primul test picat o numește; cazurile-limită ale regulilor scrise. **Rezultat: 0.** 13 soluții trec, 27 de greșeli tipice sunt respinse, fiecare cu primul mesaj despre ea; 3 variante bune (ordinea inversă a regulilor, fără programul de la steag, condiția lăsată deoparte) trec.
- `_proba\parcurge.py`: elevul, cu gesturi reale, la 390 (atingeri prin CDP) și 1280. Inclusiv condiția în locaș cu degetul, lista ▾, apăsarea pe pisică. **Rezultat: 0 probleme la 390 și la 1280; 3 stele; 0 erori în consolă.**
- `_proba\proba_descarca.py`: linkul descarcă `pornire-33.sb3`, identic cu fișierul. **Rezultat: 0** (link de 44 px, numele `pornire-33.sb3`, același sha256).
- `_proba\fa_pornire.py`: fișierul de pornire e generat, cu `meta.agent` gol (editorul scrie acolo User-Agent-ul), fără nume și fără căi.
- `_proba\vocabular.py`: cuvintele lecțiilor vecine nu apar pe ecran; plafoanele pe pas; durata.

## Ce am descoperit la probă (intră în text)
- **Condiția cade ușor în cerculețul lui „mergi”** (s-a întâmplat chiar în proba mea): un bloc cu șase colțuri intră și într-un cerculeț de număr. Rezultat viu: pisica nu mai face cei 50 de pași: cu „atinge marginea?” în cerculeț, x 0, 0, 0 (fals = 0 pași); cu „atinge cursorul mouse-ului?”, cum vine din paletă, x 1, 2, 3 (adevărat = 1 pas, fiindcă mouse-ul e pe pisică când apeși; `live_lab.json`, `serie_cerculet`). Simulatorul permite lăsarea la fel, dar acolo „cursorul” e mereu fals, deci x 0 (abatere mică, în capul extensiei). De aceea, captura „Greșit” la P4, mesajul MERGE și laboratorul 5.
- **În Mișcare e un bloc cu nume aproape la fel:** „dacă atinge marginea, ricoșează”. Pagina îl numește, ca elevul să nu-l ia în locul lui „dacă atunci”.
- **La apăsare, nu la ridicare:** programul pornește cum atingi; cu 50 de pași, pisica fuge de sub mouse, deci n-o poți trage (viu). Simulatorul o spune în capul extensiei.
- **Mingea trasă schimbă zona de cod:** programul mingii, gol. E și ieșirea din panică: apeși Sprite1 (captură în P6). Un clic simplu pe minge nu schimbă nimic.
- **Mingea acoperă pisica:** dacă sunt una peste alta, apăsarea cade pe minge (viu și în simulator: mingea e deasupra). Lecția nu cere gestul; la P6, cu regula marginii, se poate întâmpla la x 180: apăsarea pe minge nu face nimic, iar mesajul „Apasă pe pisică…” îi spune să tragă mingea într-o parte.
- **Condiția a căzut în cerculeț și în proba R1** (`live_r1_nou.json`, `conditie_dupa_lasare_0`): lăsată cu vârful chiar în dreptul locașului, la prima regulă; trasă apoi în locaș, numărul 50 a revenit, iar x a dat 50, 100, 150, 0. La a doua regulă, aceeași lăsare a intrat în locaș.

## Socoteala duratei (`_proba\vocabular.py`, 110 cuv./min, cu elevul lent la gesturi)
**La limită: ≈ 46-49 min după judecătorul opus, 52,5 după judecătorul sonnet (marjă ±4); judecata 2: 42,1 la 110 cuv./min și 6 s pe gest, 51,7 cu 9 s pe gest, 53,9-60,1 la 80 cuv./min (elevul lent folosește „Când mai sunt 10 minute din oră”); de cronometrat la clasă.** Autorul socotise 45,3 (`_proba\vocabular.py`, fără intro și „Cum lucrezi”, fără variantele alegerii). Reparația R1 n-a lungit lecția, măsurat cu metodele lor (`_proba\durata_r1.py`): cuvinte pe drumul obligatoriu 2.123 → 2.089 (opus), 2.192 → 2.190 (sonnet); gestul nou, mingea trasă sus + Sprite1 (12 s), e socotit. Elevul care sare casetele (telefon) câștigă ~7 minute. Laboratorul: cam 14 minute, cu casetele făcute cam 5; „Când mai sunt 10 minute” trimite la ultimul punct. E socoteală, nu cronometrare.

## Pentru lecția următoare (V/34 „Construiesc un joc digital simplu”)
- **Ce rămâne la elev:** nimic pe calculator (`pornire-33` și fișierul lui se șterg la sfârșitul orei). Dacă V/34 are nevoie de proiect, îl dă iar, ca descărcare, sau îl descarcă din `lectii/v/m5-l33/pornire-33.sb3`.
- **Ce știe de la mine:** „când se dă click pe acest personaj”, „dacă atunci” (locașul, gura), „atinge marginea?”, „atinge Minge?”, „Load from your computer”, „Replace contents”, al doilea personaj, Sprite1 sub scenă; opțional, „dacă atunci altfel”, „spune Salut!”, „(poziția x) > 100”.
- **Extensia:** `lectii\_sim\scratch-evenimente.js` (`SimScratchEvenimente`): tipul `eveniment`, `serie`, `dacaDin`, `atingeMinge`. API-ul e în capul fișierului și în graniță. O poți încărca nemodificată.
- **Nu presupune:** repetiția, variabilele, scorul. Mișcarea singură a pisicii e nepredată: V/34 fie rămâne cu apăsări (fiecare apăsare, o mutare), fie dă în proiectul de pornire o buclă gata făcută, cu o propoziție cinstită (varianta probată la mine: `live_bucla.json`).
- **Tasta:** „când tasta spațiu este apăsată” există în Evenimente (citit viu), dar n-am predat-o; pe telefon nu merge.

## Pentru componenta comună (`lectii\_sim\scratch.js`, `scratch-conditie.js`; nu le-am atins)
- `atinge marginea?` la direcții oblice e o aproximare (`scratch-conditie.js` o spune): viu, la x 177, y −73, Direcția 135 nu atinge, în simulator atinge. De aceea, varianta mea „altfel” nu mai rotește pisica la 15 grade (am schimbat exercițiul; `live_lectie.json`, prima rulare).
- Căsuța numerelor la 390 px (21,8 px vizibil) e defectul deja în coadă.

## Contradicții găsite
- Granița V/32 avea forma veche „bloc nelipit = nu se execută”; V/31 a schimbat-o (SCHIMBAT 02:09), V/32 a preluat-o (SCHIMBAT 04:09). Mesajul meu spune acum „apăsarea pe pisică nu-l pornește” (`_proba\live_r1.py`, J4): adevărat și pentru cine apasă chiar pe bloc, unde pisica îl face o dată. Rezolvată.

## Pentru profesor
- Descriptorul „Consolidat” din V-U6 cere „decizii cu condiții de bază (cu operatori relaționali)”. La mine, comparația rămâne opțională (P4, „Încă un exercițiu”: „(poziția x) > 100”); la drumul obligatoriu, condițiile sunt coliziuni, cum cere titlul. Nu se mută la V/34: acela e mini-proiect și nu predă nimic nou (S71; decizia dirijorului, 09.11). **Întrebare:** o vreți obligatorie? Atunci devine exercițiu aici (~3 minute) și trebuie scos altceva, ca lecția să încapă.
- **Regula se verifică la fiecare apăsare, nu continuu (fără bloc care repetă), deci pisica nu merge singură în lecția asta.** Pagina o spune elevului, la pasul „Decizia, în blocuri”. Se abate de ce ați putea aștepta de la activitatea dumneavoastră. Vreți altfel? Motivul și varianta probată: „Decizii”, 1.
- Fișierul de azi se șterge la sfârșitul orei (calculatorul e comun). Dacă vreți să-l păstrați, spuneți-le elevilor și ștergeți ultimul punct.
- Proiectul de pornire e al lecției, nu al dumneavoastră. Dacă dați altul, punctul 2 din laborator se schimbă.
- **Ce e în `pornire-33.sb3`:** din proiectul nou al editorului: pisica (costume1, costume2), sunetele Meow și pop (nefolosite) și decorul alb; mingea e desenul lecției (citit din arhivă, 09.11; `meta.agent` gol, fără nume). Scratch le pune în orice proiect salvat. N-am găsit o permisiune citită pentru a le da ca fișier al lecției: paginile Scratch de termeni și FAQ nu și-au încărcat textul în probele headless (nici la judecător, `_verificare\j1_j.txt`): `nesigur`. Fișierul e dat gratuit, elevilor, fără scop comercial. Dacă nu ține: elevul pornește un proiect nou, iar mingea o ia din Biblioteca Scratch (pașii se schimbă).
- **Ordinea publicării:** Se publică după V/31 și V/32 (V/33 încarcă `scratch-interfata.js` și presupune paginile lor), cu `lectii\_sim\scratch-evenimente.js` comis separat, înaintea lecției. Dirijorul reface proba după publicarea lor; fără `scratch-interfata.js`, extensia aruncă o eroare și pagina nu pornește.

## Reparațiile după judecata 1 (09.11.2026)
Registrul: `_verificare\registru_j1.md` (22 de puncte: 20 din judecăți, 1 de la dirijor, 1 găsit la reparare; 21 reparate, 1 respins cu probă). Probele: `_proba\proba_r1.py` (pagina, gesturi reale la 1280 și 390), `_proba\live_r1.py` (editorul viu, casetele și laboratorul literal). Copia dinainte: `_proba\inainte_r1\`.
- **Testul MERGE nu mai depinde de mingea de acum** (`merge(P, {minge: null})`): programul bun nu mai e respins dacă mingea stă lângă pisică.
- **Laboratorul, după casete:** punctul 2 trimite mingea sus, punctul 5 începe cu locașul și numește mingea și „dacă” deasupra lui „mergi”; numerele promise ies exact în Scratch.
- **P6:** exercițiul are 60 de pași și mingea la x 180; `minge.webp` a ieșit, în locul ei `minge-atinge.webp`, doar scena, fără zona de cod.
- **Paletele** sunt decupate strâns: `paleta-eveniment.webp` din captura veche, `paleta-daca.webp` dintr-o captură nouă, cu paleta derulată (`_proba\r1_capturi.py`).
- **Comparația rămâne opțională la P4** (decizia dirijorului); nu se mută la V/34.

## Reguli verificate pe lecție
1, 2 (plafoane: `vocabular.py`), 3, 4, 5 (aplicare: 5/5 „Încearcă” + atelier), 7 (`afirmatii.json`), 9 (toate programele vs Scratch viu), 10 (casete P2-P6 + laborator), 16 (decizia 1; „o singură verificare” probată sub steag și sub apăsare), 20 (ținte: variantele alegerii 44 px, linkul 44 px; fâșia pisicii la deget), 21 (fișierul `.sb3`: fără metadate personale), 22, 24 (rețeaua blocată, `ctx.close()`), 25 (nimic pe ecran; Chromium headless, profil temporar), 26 („Nu” sau „Anulare” la „există deja”), 27, 28 (`proba_mesaje.py`), 29 (testele pe `E.serie`), 30, 31 (`parcurge.py`, 390), 32 (ieșiri: fără rețea, fără fereastră, telefon), 33, 34, 38.
