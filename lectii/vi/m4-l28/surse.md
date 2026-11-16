# VI/28 — surse, decizii, probe

**Nu e publicată, nu e în depozit (fără commit).** Autor, 09.11.2026. Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`. **Reparată după judecata 1 (R1, 09.11.2026, seara):** §11 și `_verificare\registru_j1.md`.

## 1. Ancora

| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul | `Calendar_ore_6A_6M.md` r. 36, `unitati.json` r. 731 | „Gestionarea animațiilor: creare, salvare, expunere, testare, depanare”, predare, 16.04.2027 |
| Conținutul | `curriculum.json` r. 469 | „Operații de gestionare a animațiilor: creare, deschidere, expunere, salvare, închidere, testare, depanare” |
| Unitatea | `Proiectul_unitatii_VI-U4.md` | VI-U4, „Animații grafice și modele 3D”, CS.1.2, CS.3.2, CS.3.3 |
| Activitatea (citat) | `activitati_lectii_V_VI.json` r. 258-259 | „Ciclul complet pe o animație minimă: se creează, se rulează, se strică intenționat, se găsește eroarea, se repară. Elevii notează ce au căutat prima dată.” Resursa: „laborator, animație-model cu eroare”. |
| Programa | `curriculum.json` r. 310 | „testarea și depanarea unor animații” |

Conținut → unde e predat:

| Parte | Pas | Exercițiu | Întrebare |
|---|---|---|---|
| creare | P2 | P2 Încearcă, caseta | Î1 |
| salvare | P3 | P3 Încearcă (+ Încă un exercițiu: Anulare la „Replace contents…?”), caseta, lab 2-3 | Î2 |
| închidere | P3 | P3 Încearcă, lab 4 | Î3 |
| deschidere | P3, P5 | P3 Încearcă, lab 4, 6 | Î2 |
| testare | P4 | P4 Încearcă, caseta | Î4 |
| depanare | P5, atelierul | P5 Încearcă, atelier, lab 6 | Î4 |
| expunere | P6 | P6 Încearcă, lab 7 | Î5 |

Activitatea, pe pași: creează + rulează = P2; strică intenționat = P4; găsește + repară = P5 și atelierul; „notează ce au căutat prima dată” = caseta din P5, în caiet, fără notă (nu se verifică în pagină: scriere liberă nepunctată, T3).

## 2. Decizii

1. **Aplicația = Scratch 3 online, fără cont, `.sb3` pe calculator** (contractul, decizia 4; Vasile n-a răspuns).
2. **Animația minimă:** steag, `mergi la x 0 y: 0`, `repetă 40` { `mergi 5 pași`, `costumul următor` }. x 200, 40 de schimbări, ~1,3 s. Fără `așteaptă`: temporizarea e a lecției 31; fără pauză se vede o fugă scurtă, cu picioarele foarte repezi. Respins: `spune` pe fiecare trecere (nu mai e animație), `așteaptă` (nepredat la VI/18-26, graniță).
3. **Eroarea modelului:** al doilea `mergi la x 0 y: 0`, ultimul în gură. Pisica dă din picioare pe loc. Se vede, are o singură cauză, se repară cu o singură tragere (blocul e ultimul în gură, deci vine singur), fără numere, deci și cu degetul. Respins: număr greșit (căsuța de 21,8 px pe telefon, iar elevul doar compară cifre), pălăria desprinsă ca model (nu se vede nimic; rămâne în „Încă un exercițiu”).
4. **Exercițiile cer alte programe decât poza:** P2 cere x 100 cu numerele din paletă (10, 10), ca imaginea să nu dea răspunsul și telefonul să ocolească tastarea; P5 are modelul (eroarea nemarcată în poză); atelierul, altă eroare (startul la sfârșit); Î4, a treia.
5. **Fișierul:** `Depanare_<clasa>_<Numele>.sb3` (ex. `Depanare_6A_Popescu`; există deja → se adaugă prenumele), în folderul elevului: forma VI/18-26 (R1, hotărârea dirijorului; tema diferă de `Animatie_` de la VI/27, ca elevul să nu primească „există deja” pe fișierul lui de ieri). Înainte: `<clasa ta>-prenume-animatie`. **Ștergerea:** promptul spune „ca la VI/18-26”, dar VI/18-26 nu șterg nimic (grep: 0 pe cele 9 pagini; autorul VI/27 a găsit la fel, `vi_l27.md`). Deci: fișierul lui rămâne; se șterge DOAR modelul descărcat azi din Descărcări (numit exact), fișierele colegilor și alte copii ale modelului nu se ating, Coșul nu se golește (ca la V/33). Întrebare pentru dirijor mai jos.
6. **„Stop”, nu „Oprește”.** Promptul scrie „Oprește”; editorul viu scrie **Stop** (`title`), iar VI/18 la fel. Pagina urmează editorul.
7. **Drumul Scratch:** `scratch.mit.edu` › `Creează`, ca la VI/18-25 (V/31 folosește altă adresă; elevul de a VI-a n-a văzut-o). Probele au mers pe `/projects/editor/`, aceeași aplicație.
8. **„Depanare” din bara lui Scratch:** există și deschide o fereastră de sfaturi în engleză; o propoziție o spune, ca elevul să nu creadă că ăla e pasul lecției.
9. **Fotografia P0:** o roată de bicicletă, doar o mână (Commons, Fanny Schertzer, CC BY-SA 3.0; decupată, inscripțiile de pe jantă șterse cu inpainting, pârghia neatinsă: `_proba\r1\foto_roata.py`, R1; aceeași licență, cu legătura licenței sub poză). Respinse: lanțul căzut (doi copii cu fețe, regula imaginilor) și atelierul din muzeu (manechine).
10. **Rezultat, nu drum (regula 29):** testele rulează programul fără ecran (`SimScratchGestiune.rulare`) și judecă x, y, cât se vede pisica pe drum, câte schimbări de costum, din două locuri de start. 20 × 10 e primit la fel ca 40 × 5. **Excepții, ordinea e chiar ce se predă:** P4 (a fost pornită stricată, apoi bună; orice stricăciune e primită, nu doar cea din enunț) și P6 (steagul pe ecranul complet, Stop cât merge).
11. **Trei tipuri noi în extensie:** `gscratch` (Scratch + costum + rulări + „Ia-o de la capăt”), `expunere`, `fisier` (fereastră desenată de noi, spus pe ecran). Atelierul de fișier există pentru că telefonul n-are fișier, iar drumul lui e în pagină (regula 31).

## 3. Ce presupun și ce acopăr

- ✔ VI/18: Scratch fără cont, steag, Stop, x, y, trage / lipește, salvare `.sb3`, `Load from your computer`, „mergi la x 0 y: 0”.
- ✔ VI/20: `repetă`, gura, brațul de jos.
- ✔ VI/19, VI/25: Explorer (`F2`, Decupare, Lipire), „Nu (sau Anulare)”, formularea „Se omite acest fișier” (VI/18; fereastra „Înlocuire sau omitere fișiere”, V/10), pusă de dirijor după judecata 2 a VI/29.
- ☐ **Presupun de la VI/27 (se scrie în același timp, de verificat de dirijor după publicare):** „costumul următor”, cuvântul „costum”. Pagina nu se blochează: P2 spune ce face blocul („al doilea desen al ei, apoi iar primul”).

Copiate întocmai din VI/18-25: nimic. Aceleași nume de butoane, alte fraze.

## 4. Pentru lecția următoare (VI/29)

- Rămâne la elev: `Depanare_<clasa>_<Numele>.sb3` în folderul lui; în caiet, „Ce am văzut · Ce am căutat prima dată · Unde era eroarea”.
- Se poate folosi: testarea cu steagul de 2 ori; „schimbi un singur lucru”; extensia `lectii\_sim\scratch-gestiune.js` (API în capul fișierului), încărcată nemodificată.
- Nu am predat: scenariu, cadru, compoziție, „obiect animat”.

## 5. Pentru profesor

1. „Animația” e Scratch 3 online. Ai altă aplicație în laborator? Se schimbă pagina întreagă (simulatorul, capturile, fișierul-model); activitatea rămâne. Dacă elevii n-au internet la laborator, drumul din pagină merge, dar fișierul-model nu se deschide în Scratch.
2. Numele fișierului are forma de la VI/18-26: `Depanare_6A_Popescu` (VI/27 lasă `Animatie_6A_Popescu`, de aceea tema e alta). Butoanele ferestrelor browserului („Anulare / Anulați / Cancel”, „Părăsiți / Leave”) nu s-au putut vedea în probe: pagina le scrie cu variantele; o captură de la laborator le-ar fixa.
3. Vrei ca elevii să-și șteargă și animația lor la sfârșitul orei? Acum rămâne în folderul lor, ca la VI/18-26.
4. „Elevii notează ce au căutat prima dată”: e în caiet, fără notă, și pagina nu verifică. Îl citești la clasă, dacă vrei.
5. Izvoare numără ora asta ca 27 (`Calendar_ore_VI.md`); pagina urmează `unitati.json`.

## 6. Pentru componenta comună (`lectii\_sim\scratch.js`, neatinsă)

- Căsuța numerelor la 390 px (21,8 px vizibil): defectul din coadă. **Ocolit:** drumul din enunțul exercițiilor obligatorii nu cere numere pe telefon (P2 lasă 10 și 10; P4, P5, atelierul, doar trageri). Dacă elevul ia „mergi la” din paletă după un steag, blocul vine cu locul de acum al pisicii (ex. 100 și 0): mesajul îl trimite la „Ia-o de la capăt”, după care blocul din paletă vine cu 0 și 0 (probat: `_proba\r1\proba_reparatii.py` [C], R1). Doar „Încă un exercițiu” cere un număr.
- Fără „Anulează” pe telefon: un program tras peste paletă se pierde. **Ocolit:** butonul „Ia-o de la capăt”, în tipul meu, sub simulator. Nu e în `scratch.js`.
- `scratch-interfata.js` (V/31) e încărcat nemodificat, pentru `pazaPaleta` și paza pisicii.

## 7. Probele

Toate în `_proba\`, rețeaua blocată (doar spre scratch.mit.edu la cele vii), închise cu `ctx.close()`:

- `live_vi28.py`, `live_vi28b.py`, `live_vi28c.py` → `live_vi28*.json`, capturi `live\`: editorul viu (numele, Replace contents, ecranul complet, închiderea, depanarea cu mouse-ul). Pe `live_vi28.py`, un „VERIF” pică doar din eșantionarea mea (4 schimbări citite din 40, în 0,5 s), măsurat apoi corect în `live_vi28b.py`: 40.
- `proba_oracol.py` → **0**: 13 programe, rulate în editorul adevărat (`oracol_programe.json`, de 2 ori fiecare) față de simulatorul paginii: x, y, schimbările de costum, câte locuri se văd. Singura diferență tolerată: lângă margine, x oscilează 270-272 în editor (`fara_start`, al doilea steag); aici 272.
- `proba_mesaje.py` → **0**: 23 de programe (greșeli tipice respinse, drumuri bune neobișnuite primite), cu primul mesaj citit.
- `parcurge.py 390` → **0**, `parcurge.py 1280` → **0**: toată lecția, până la 3 stele, fiecare exercițiu întâi greșit, cu degetul (Pixel 7) și cu mouse-ul, drumurile din enunț; 0 erori în consolă.
- `fa_model.py` → 0: fișierul-model, fără nume de cont, fără căi, `meta.agent` gol.
- `durata.py` → vezi §8.

## 8. Durata (metoda judecătorului: 110 cuvinte/min + gesturile, elev lent)

**R1 (09.11.2026), refăcută cu metoda judecătorului 1** (`_proba\r1\durata_r1.py` = numărătoarea din `_verificare\j1_sim.py` + secundele pe etape din `_verificare\j1_durata.py`): înainte de reparații 2.024 de cuvinte pe drumul obligatoriu (18,4 min) + gesturile elevului lent 27,3 min = **45,7 minute**; după reparații **2.020 de cuvinte (18,4 min) + 27,3 min = 45,7 minute** (`durata_r1_inainte.json`, `durata_r1_acum.json`). Încape în 50 de minute la elevul lent și umple ora. **Gesturile sunt estimate, nu cronometrate: de cronometrat la clasă.** „Când mai sunt 10 minute” trimite la întrebări și la ultimul punct.

**J2 (09.11.2026, `_verificare\j2_durata.py`, cu mesajele citite la o greșeală pe exercițiu):** 2.052 de cuvinte + ~129 din mesaje = 19,8 min la 110 cuv./min + gesturile elevului lent 29,0 min = **48,8 minute** (la limită: de cronometrat la clasă). La 80 cuv./min, 56,3 minute: elevul foarte încet ajunge la „Când mai sunt 10 minute” cam după pasul 6 și lasă atelierul.

Cifra veche (~39 de minute, `_proba\durata.py`, gesturi ~20 de minute) era prea mică: judecătorul a socotit mai lent casetele din Scratch-ul adevărat (10 s pe gest, încărcarea paginii, căutarea fiecărei erori noi).

## 9. Contradicții găsite

- Promptul: „ștergerea ca la VI/18-26”; paginile VI/18-26 n-au ștergere (decizia 5).
- Promptul: „Oprește”; editorul: „Stop” (decizia 6).
- Ghidul, VIII.I: „închiderea filei întreabă”. Probat mai exact: doar dacă proiectul e schimbat, și rămâne așa și după „Salvează pe calculatorul tău”.
- VI/18 spune „Dacă ai lucrat ceva, la deschidere Scratch întreabă Replace contents…: OK. Salvezi la laborator.” Eu adaug ce face Anulare (probat), fără s-o contrazic.

## 10. De știut judecătorului

- Depinde de VI/27 doar cuvântul „costum” și blocul; vezi §3.
- Picioarele pisicii din pagină sunt desenul meu (`PICIOARE`), nu costumele Scratch; nota de sub paletă o spune, iar rândul „Costumul 1 din 2 · schimbări” spune că e doar în pagină.
- La P4, dacă elevul schimbă alte lucruri, primul test e cel „a pornit-o stricată”: orice program care nu face ce trebuia se socotește stricat.
- Fereastra `fisier` întreabă mereu unde salvezi; la laborator poate să nu întrebe (lab 3).

## 11. Reparațiile după judecata 1 (09.11.2026)

Registrul: `_verificare\registru_j1.md` (14 puncte, A-N: 1 MAJOR, 13 MINOR, după unirea dublurilor; N găsit de R1 la probă; toate reparate). Copia dinainte: `_proba\inainte_r1\`. Probele noi, în `_proba\r1\`:

- `proba_reparatii.py inainte|acum`: o verificare pe punct, litera între paranteze drepte (pe `inainte` pică, pe `acum` 0); gesturile din ferestrele simulatorului cu mouse-ul la 1280 și cu degetul la 390.
- `live_r1.py` → `live_r1.json`: editorul viu, modelul `animatie-cu-eroare.sb3`: blocul vinovat lăsat sub braț (pisica pleacă, la capăt e iar la x 0) și tras în paletă (dispare; x 200 la două steaguri).
- `durata_r1.py inainte|acum`: §8.
- `foto_roata.py`: fotografia P0, refăcută.
- `parcurge.py` (390 cu atingere + 1280), actualizat cu numele nou, cu P5 „sub braț, apoi în paletă” și cu noul „Încă un exercițiu” de la P3.

Extensia `lectii\_sim\scratch-gestiune.js` → 1.1 (API compatibil; granița, „SCHIMBAT 21:34”).

## 12. Reparațiile după judecata 2 (09.11.2026)

Registrul: `_verificare\registru_j2.md` (O MAJOR; P-T MINOR; U, V găsite de R2 la probă, MINOR; toate reparate). Copia dinainte: `_proba\inainte_r2\`. Probele noi, în `_proba\r2\`:

- `proba_r2.py inainte|acum`: testele adevărate ale paginii pe 32 de programe (cele 16 ale judecătorului 2 + 16 noi), cu primul mesaj citit, plus testul steagului și soluțiile; pe `inainte` 19 greșite, pe `acum` 0.
- `bucla_r2.py 390|1280 [inainte]`: gesturi reale (degetul la 390, mouse-ul la 1280) pe drumurile judecătorului (P5 „Încă un exercițiu” cu „mergi la” deoparte; atelierul 3 cu „mergi 50”), pe steagul nou peste stiva desprinsă (P) și pe atelierele 1 și 2 (Q), fiecare mesaj urmat până la Corect: `acum` 0 la 390 și la 1280, `inainte` 20 la 1280.
- `proba_text_r2.py inainte|acum`: textele R, S, T și P, întocmai: 13 → 0.
- `durata_r2.py`: copia metodei judecătorului 2; §8.
- `_proba\proba_mesaje.py`: starea „programul a fost pornit” poartă acum și programul (testul steagului judecă doar ultima rulare a programului de acum); 23 din 23.

Extensia `lectii\_sim\scratch-gestiune.js` → 1.2 (API compatibil; granița, „SCHIMBAT 23:36”).
