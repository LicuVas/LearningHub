# Surse — lecția V · M1 · nr. 1

**„Ce facem anul acesta la Informatică și TIC. Criteriile de evaluare și cele trei niveluri”** · tip: organizare + evaluare inițială · unitatea V-E0 („Deschiderea anului. Cum se învață și cum se notează la informatică”, CS.1.1) · cheia `lectie_v_m1_l01` · scrisă 27.09.2026, reparată 28.09.2026 după judecător (`_verificare\judecator.md`).

E PRIMA oră de informatică a elevilor. Pagina nu presupune nimic. Intro-ul predă cum spui cine ești pe calculatorul COMUN din laborator, iar pașii 2-3 predau cum se folosește o lecție pe pași (butoanele reale ale motorului).

## 0. Reparațiile după judecător (28.09.2026), fiecare cu locul ei

| Nr. | Ce era | Ce am făcut | Unde |
|---|---|---|---|
| **J01 GRAV** | „scrie-ți numele … dacă nu e scris deja”: al doilea elev lucra pe numele primului | Paragraful „Întâi, spune cine ești”: te uiți deasupra căsuței „Numele tău” și jos pe ecran, apoi o listă cu cele 4 casete posibile și ce apeși la fiecare. Urmează „Gata?”: verifici că jos e numele TĂU, căsuța „Numele tău” și „Ia-o de la capăt” dacă lecția apare terminată de altul. „Când pleci”: eticheta de jos → „Nu ești tu? Schimbă elevul”. Probat cu doi (apoi trei) elevi pe același calculator: `_proba\doi_elevi.py` → 27 de verificări, 0 probleme | intro (cuprinsul), `intro:` în configurație |
| **J02 MAJOR** | caseta descrisă doar pentru calculatorul nou; codul de 4 cifre lipsea; „Mai târziu” îl scotea din evidență | Toate cele 4 stări (calculator nou / „Sunt elev — mă înscriu”; lista „Cine lucrează acum?” + „Nu sunt în listă”; „Lucrezi ca …” / „Pe calculatorul ăsta a lucrat …” + „Alege-te din listă”; „Ești tot …?”), codul de 4 cifre scris în caiet; „Mai târziu” nu mai e recomandat. Poza `img\casete-cine-lucreaza.webp` le arată, numerotate | intro |
| **J03 MAJOR** | „șase părți” vs cele cinci „module” ale paginii clasei, cu alte margini | „Părți” → **„unități”** (cuvântul fișei profesorului și al lecției 7). „Uite cum” al pasului 4: „Unitățile nu sunt modulele … cinci module, bucățile anului școlar dintre vacanțe … Modulul 2 are lecțiile 8–15 … Lucrările vin la sfârșitul unităților”; „Altfel”: manualul cu șase capitole și anul tăiat de vacanțe | P4 (text, „Uite cum”, „Altfel”, exercițiile), Î2, P6 |
| **J04 MAJOR** | foile generate de `print_engine.py` scriu „Nota = punctaj : 10” și literele B/C/A | Generatorul NEatins. În lecție, P7 „Uite cum”, „Atenție la foi”: „pe foile de lucru poate scrie «Nota = punctaj : 10». La noi, nota vine din nivel, ca în tabel. Literele de lângă cerințe arată nivelul: B = De bază, C = Consolidat, A = Avansat.” În surse.md §3: problema e pe TOATE foile generate | P7 |
| **J05 MAJOR** | pasul 2 avea ~12 idei | Împărțit: P2 „Caseta «Încearcă tu»” (cum răspunzi) și P3 „Butoanele lecției și bara de jos”, cu exerciții pentru bară (P3, pe bara de jos; tragerea pe telefon) | P2, P3 |
| J06 | 3 butoane ale motorului la 31 px | `.btn.sm{min-height:34px}` în stilul paginii (motorul NEatins); măsurat 34,0 px la 412 și 1280 px | `<style>` |
| J07 | „Explică-mi altfel” lipsea la pașii 1, 3, 5 | Fiecare dintre cei 7 pași are acum `altfel` | toți pașii |
| J08 | „După fiecare, un exercițiu” fals la pasul 1 | „Citești 7 pași scurți. După fiecare, în afară de primul, faci un exercițiu mic, fără puncte.” | `cum:` |
| J09 | „din stânga … din dreapta”, fals pe telefon | „Apasă întâi un rând din lista «Apasă întâi aici…», apoi perechea lui din lista «…apoi perechea».” | P4, „Încearcă tu” |
| J10 | pe telefon, „Laborator” nu se vede pe bară | P3: „Pe telefon, bara nu încape pe ecran: trage-o cu degetul spre stânga ca să vezi restul”, cu poza `img\bara-telefon.webp` (înainte / după tragere) și un exercițiu; laboratorul, pasul 7, spune la fel. Probat cu o tragere reală cu degetul (`_proba\captura_bara.py`) | P3, laborator pasul 7 |
| J11 | „nota lui” la Bianca, Dana, Flavia | mesajul folosește genitivul: „nota Biancăi / Danei / Flaviei / lui Cristi” | simulatorul `lucrare` |
| J12 | „de jos în sus” ambiguu | „unul sub altul, începând cu primul: De bază, apoi Consolidat, apoi Avansat” | laborator pasul 3 |
| J13 | fișa din caiet n-avea nivelul → nota | pas nou în laborator (5): „Sub părțile lucrării, scrie ce notă dă fiecare nivel”, cu „Verifică-te”; pasul 4 cere și pragurile | laborator pașii 4-5 |
| J14 | tabla înmulțirii dată drept „model” | „doamna îți arată pe tablă cum se face 7 × 8, pas cu pas, iar tu faci la fel 6 × 8” | P5 „Uite cum” |
| J15 | ordonarea și „Golește” nepredate | P2: al patrulea fel de a răspunde, „pui în ordine: apeși bucățile pe rând; Golește le ia de la capăt”; categoria „Golește” în exercițiu și un exercițiu de ordonare chiar la P2 | P2 |
| J16 | pasul 6 avea două proceduri | P6 „Lucrarea: trei părți și nivelul tău” (pragurile și urcarea pe rând) și P7 „De la nivel la notă” (benzile, În formare / În dificultate, planul, cele 9 note, foile); Î5 cere acum și nivelul, și nota | P6, P7, Î5 |

Regula 23 (calculatorul comun): pagina nu păstrează nimic în browser în afară de progresul motorului, care e deja pe sertarul elevului ales în „Spune cine ești”; „De unde pleci?” se scrie în caiet. Verificările nu spun „știi” pe baza răspunsurilor corectate după ce le-ai văzut. Nu există răspunsuri scrise de mână.

**Nr. de pași:** standardul cere pasul 0 + 3-5 pași; lecția are pasul 0 + 6 (J05 și J16 au cerut împărțirea a doi pași). E prima oră: jumătate din pași predau chiar pagina.

## 0b. Reparațiile după judecata a doua (28.09.2026, `_verificare\judecator2.md`)

| Nr. | Ce era | Ce am făcut | Unde |
|---|---|---|---|
| **K01 MAJOR** | cât stă „Ești tot X?”, diploma și cuprinsul arată numele lui X (partea de motor o repară dirijorul) | Chenar separat, după lista casetelor și ÎNAINTE de „Apoi începe”: „**Dacă jos scrie «Ești tot …?», răspunde ÎNTÂI.** Nu începe lecția până nu ai răspuns. Dacă nu e numele tău, apasă **Nu, sunt alt elev**.” | intro, `p.atentie` |
| M1 | pe telefon eticheta de jos se ascundea chiar în capul paginii (sub poza-legătură); pagina nu spunea unde e | (1) Poza cu cele 4 casete trece DUPĂ listă: la 412 px eticheta se vede acum în tot primul ecran (y 0-480) și e ascunsă doar cât poza e sub ea (y 600-960); la 390 px, ascunsă la y 840-1200 (`_proba\masoara_eticheta.py`). (2) Paragraf „Pe telefon”: se strânge într-o etichetă mică jos în stânga; când sub ea e o poză sau un buton, se face buton rotund (jos în stânga sau în dreapta) ori se ascunde; „Nu o vezi? Derulează puțin mai jos și reapare.” (cele patru moduri din `prezenta.js`: plină / rotundă în stânga / rotundă în dreapta / ascunsă) | intro |
| M2 | „Totalul nu contează”, fără limită | „Pentru nivel, totalul nu contează.” Judecata a treia (N2): „te oprești la prima parte fără prag” → „te oprești la prima parte care nu ajunge la prag” (singurul rând fără prag din tabel e „din oficiu”) | P6 |
| M3 | „A = Avansat” lângă cerințe, imediat după „partea A · De bază” | Trei paragrafe separate în „Uite cum”: Paul; „Pe foile de lucru poate scrie «Nota = punctaj : 10». La noi, nota vine din nivel, ca în tabel.”; „**Litera din bulina de lângă o cerință** (ca în «B (15 p)») nu e partea lucrării. Ea arată nivelul cerinței: B = De bază, C = Consolidat, A = Avansat. Deci cerințele din partea A au în bulină litera B.” (judecata a treia, N1: pe foaie litera e MARE, într-o bulină) (așa e pe Test_V-U1: „1. PARTEA A. … B (15 p)”) | P7 „Uite cum” |
| M4 | „șase unități”, dar banda de sus scria „unitatea V-E0” | Banda (`ancoraText`): „lecția 1, ora de deschidere a anului, «Cum se învață și cum se notează la informatică» (în plan: V-E0; …)” — fără cuvântul „unitatea”. P4 „Uite cum”: „Lecția de azi și lecția 36 stau deoparte: prima deschide anul, a doua îl încheie, cu unde ai ajuns.” | banda de sus, P4 |
| M5 | ~1900 de cuvinte, prea mult pentru ora 1 alături de testul pe foaie | Cei 7 pași rămân. Pașii 7 și 8 din laborator (bara lecției; comparația cu colegul) încep cu „**Dacă mai ai timp (opțional):**”. Dacă pagina se face în ora 1 sau ca recitire după ea, hotărăște profesorul | laborator pașii 7-8 |

## 1. Documentele profesorului (au prioritate) și ce am luat din fiecare

| Document | Ce am luat |
|---|---|
| `Info_Gimnaziu_2026\instrumente\Fisa_criterii_elev_clasa_V.md` (fișa lipită în caiet) | nivelurile (§2), părțile lucrării (§3), pragurile și benzile (§4), 6 + 2 + 1 note, „unitate” (§5), testul de la început nu se notează, copiatul = nota 1, plan de recuperare (§6), „Ce trebuie să știu să fac anul acesta” (§1) |
| `Info_Gimnaziu_2026\SISTEM_EVALUARE.md` | §1 („Anul are cinci module”), §2 (contextul nou), §3 (evaluarea inițială nu se notează; 9 note), §4.1-4.4 (structura A/B/C, regula cumulativă, benzile, exemplul A 31 / B 21 / C 6 → Consolidat, refolosit ca „Maria”) |
| `Info_Gimnaziu_2026\materiale\print\Saptamana1_clasa_V.html` | „De reținut” (situația nouă, nu cantitatea; „de la prima oră, nu după lucrare”) |
| `Info_Gimnaziu_2026\planificari\Proiectul_unitatii_V-E0.md`, `materiale\continut\teste_initiale.json` | ora 1 = organizare + evaluare inițială (fisa_criterii, test_initial); ce verifică testul inițial |
| `Info_Gimnaziu_2026\data\unitati.json`, `planificari\Calendar_ore_5AM_5M.md` | cele șase unități și lecțiile lor; lucrările la 7, 12, 17, 23, 30, 35 (23 și 35 pe produs digital); 36 = unde ai ajuns |
| `LearningHub\lectii\plan.json`, `lectii\v\index.html` | cele cinci module ale paginii clasei: M1 1-7, M2 8-15, M3 16-21, M4 22-29, M5 30-36, cu vacanțele între ele (J03) |
| `LearningHub\assets\js\prezenta.js`, `jocuri\_motor\motor.js` (`cineLucreaza`) | casetele „cine lucrează” și butoanele lor, citite în cod și probate cu gesturi (J01-J02) |
| vaultul `C:\ObsidianVaults\Scoala\` | `20 - Predare\Informatica\Gimnaziu 2026-2027\00_START…md` r. 95 și 126 (fișa lipită în caiet + testul inițial la prima oră); `Standarde 2026-2027\Informatica_TIC_Clasa_a_Va.md` (descriptorii) |

Numele scurte ale unităților sunt ale mele (ca să nu folosesc cuvintele lecțiilor următoare):

| În pagină | Unitatea (unitati.json) | Lecțiile |
|---|---|---|
| Calculatorul, în siguranță | V-U1 Sisteme de calcul. Lucrez corect și în siguranță | 2–7 |
| Ordine în calculator | V-U2 Sistemul de operare. Ordinea în fișierele mele | 8–12 |
| Informații de pe internet | V-U3 Internetul ca sursă de documentare | 13–17 |
| Desene pe calculator | V-U4 Editoare grafice. Fac materiale digitale | 18–23 |
| Pas cu pas | V-U5 Algoritmi. Gândesc pas cu pas | 24–30 |
| Primul tău joc | V-U6 Din algoritm în joc: mediul grafic interactiv (Scratch) | 31–35 |

Lecția 7 numește unitatea „Sisteme de calcul” (cuvânt predat la lecția 3). Cele două nume le leagă „lecțiile 2–7”, iar ambele lecții spun acum „unitate”.

## 2. Harta pas → sursă

| Pas | Ce predă | Sursa |
|---|---|---|
| intro | cine lucrează: 4 casete + verificarea numelui + „Schimbă elevul” la plecare | prezenta.js, motor.js; `_proba\doi_elevi.py` |
| P1 La ce folosește | o oră pe săptămână; TIC; criteriile de evaluare; testul de la început nu se notează | unitati.json; fișa §6; SISTEM §3 |
| P2 Caseta „Încearcă tu” | butonul; cele patru feluri de a răspunde; „Verifică”, „Golește”; „Corect” / „Nu încă”; indiciul; după două greșeli | motor.js (TIPURI.*, ajutorButon, resolvePractice, revealButton) + `_proba\parcurge.py` |
| P3 Butoanele lecției și bara de jos | Pasul următor/anterior, Explică-mi altfel, Încă un exercițiu, Știu deja; bara, tragerea pe telefon | motor.js (learnPage, tabsFor, shell) + `_proba\captura_bara.py` |
| P4 Șase unități | unitățile, lecțiile, la ce folosesc; ultima lecție = lucrarea; lecția 36; unități ≠ module | unitati.json; Calendar; fișa §1; plan.json |
| P5 Cele trei niveluri | De bază / Consolidat / Avansat; situația nouă | fișa §2; Saptamana1; SISTEM §2 |
| P6 Lucrarea: trei părți și nivelul tău | A 40 (prag 27), B 30 (20), C 20 (14), oficiu 10; urci pe rând; totalul nu decide | fișa §3-§4; SISTEM §4.1-4.2, §4.4 |
| P7 De la nivel la notă | benzile; În formare / În dificultate; plan de recuperare; 9 note; copiatul; „Atenție la foi” | fișa §4-§6; SISTEM §3, §4.3; print_engine.py (J04) |
| Atelier „lucrare” | aplici regula pe 6 lucrări inventate, cu 5 teste bifate | SISTEM §4.2-4.3 (`nivelCorect()` din pagină) |
| Laborator | fișa ta de criterii în caiet (nivelurile; părțile cu pragurile; nivelul → nota), „De unde pleci?”, bara lecției, colegul de bancă | cele de mai sus |

## 3. Contradicții și lipsuri în documentele profesorului (nu le-am ales în tăcere)

1. **Toate foile generate contrazic regula clasei (J04).** `Info_Gimnaziu_2026\generator\print_engine.py` scrie pe ORICE pagină de test sau de exerciții:
   - r. 286: „B = De bază · C = Consolidat · A = Avansat — nivelul pe care îl verifică fiecare cerință”;
   - r. 296-297: „Punctaj: … p + 10 p din oficiu = … p · Nota = punctaj : 10”.

   Le-am găsit în **18 fișiere** din `materiale\print\`: caietele și cheile M1 ale tuturor claselor (`Caiet_clasa_V_M1.html` de 5 ori), foile primei ore (`Saptamana1_*`, și testul inițial, care „nu se notează”) și **lucrarea lecției 7**, `Test_V-U1.html`. „Nota = punctaj : 10” contrazice SISTEM_EVALUARE §4 și fișa din caiet („nivelul nu vine din total”). Pe lucrările din atelier: Emil, cu 71 de puncte, ar lua 7 pe foaie, deși pagina îi dă 9 sau 10; Dana, cu 67, ar lua 7, nu 3 sau 4. Literele de nivel B/C/A răstoarnă literele părților lucrării (A = De bază). În Test_V-U1, pe același rând, „PARTEA A … Scrie A sau F … B”. **Generatorul NU l-am atins**: e decizia profesorului, iar dirijorul o duce la el. Lecția îi spune elevului simplu că pe foi poate scrie alt calcul și că la clasă nota vine din nivel (P7).
2. **Punctajul testului inițial nu are forma 40/30/20** (De bază 40, Consolidat 35, Avansat 15), deși teste_initiale.json spune că structura e „aceeași ca la lucrările de peste an”. Nu contează la notare, pentru că testul nu se notează.
3. **Cele 2 note din proiecte:** nu e scris dacă sunt ale mini-proiectelor (lecțiile 22 și 34) sau se suprapun cu evaluările pe produs (23 și 35). Pagina spune ce spune fișa.
4. **Cifra din bandă:** fișa elevului dă doar benzile, SISTEM §4.3 dă și regula cifrei. Pagina spune „alege profesorul după totalul punctelor”.
5. **Greșeală de tipar în fișă:** §2 scrie „pașii daţi” cu ţ cu sedilă; foaia tipărită are „dați”.
6. **„8/11 septembrie”** (SISTEM §3) vs Calendar (Brauner: 11.09). Pagina nu dă date.

## 4. Hotărâri de autor (de confirmat)

- **„Fără note pe pagină”** = pagina nu notează elevul (stele și XP la verificare, „nu note”). Atelierul îl pune în locul profesorului, pe lucrări INVENTATE, ca să aplice regula din fișa lipită în caiet.
- **Testul inițial nu e copiat:** cerințele lui folosesc, prin natura lor, cuvinte nepredate (regula 1); se dă la clasă, pe foaie. Pagina îl descrie și adaugă în laborator „De unde pleci?”, o autoevaluare fără notă.
- **„internet”** e singurul cuvânt din lecțiile următoare păstrat, într-o propoziție care anunță („vei învăța”).
- **„unitate”** în loc de „parte” (J03): e cuvântul fișei („evaluările de la finalul fiecărei unități”) și al lecției 7. „Temă” (propunerea judecătorului) ar fi încurcat tema pentru acasă, pe care pagina o pomenește de două ori.
- **Stil:** `.btn.sm{min-height:34px}` repară în pagină o problemă a motorului (J06); dirijorul poate să o mute în `motor.css`.
- **Tema:** caietul de informatică (pătrățele, marginea roșie); Kalam, Andika, Victor Mono (latin-ext).
- **Simulatorul „lucrare”** stă în pagină (`tipuri:{lucrare:SimLucrare}`); n-am atins `lectii\_sim\`.

## 5. Acord cu lecția 7 (`lectii\v\m1-l07\index.html`)

| Lecția 7 | Lecția 1 |
|---|---|
| „A · De bază rezolvi cu un model sau cu pașii dați” | „De bază rezolvi dacă ai un model sau pașii dați, la lucruri pe care le-ai mai făcut” (fișa) |
| „B · Consolidat rezolvi singur, lucruri de felul celor exersate” | „Consolidat rezolvi singur lucruri de felul celor exersate” |
| „C · Avansat rezolvi singur o situație nouă și explici de ce” | „Avansat rezolvi singur o situație pe care n-ai mai văzut-o și poți explica de ce ai făcut așa” |
| „evaluarea sumativă a unității «Sisteme de calcul»”, „lucrarea … pentru care primești o notă”; „Pagina nu dă note” | „Ultima lecție din fiecare unitate e o lucrare, cu notă”; stele și XP, nu note |
| „Ai nevoie de: lecția 1 — cele trei niveluri” | lecția 1 le predă |

Nicio contrazicere.

## 6. Imagini (toate sub 150 KB; proveniența în `img\SURSE.json`)

- `laborator-scoala.webp` — Wikimedia Commons, File:Brgapp-edv-klasse.jpg, Patrik Fimml, CC BY 2.5, verificată prin API cu `LearningHub-lectii/1.0 (educational site)`. 36 KB.
- `casete-cine-lucreaza.webp` — cele 4 stări, capturate de `_proba\doi_elevi.py` (nume inventate), montate de `_proba\montaj_casete.py`. 45 KB.
- `caseta-incearca.webp` — caseta de la P2, înainte și după o greșeală, fără rândurile exercițiului (`_proba\captura_incearca.py` + `montaj_incearca.py`), refăcută pe 28.09. 72 KB.
- `bara-telefon.webp` — bara pe Pixel 7, înainte și după o tragere reală cu degetul (`_proba\captura_bara.py`). 13 KB.

## 7. Porțile și probele (28.09.2026, după judecata a doua)

- `test_joc.py --dir …\lectii\v m1-l01` → **TRECUT** (37 de întrebări jucate pe Pixel 7 + iPhone SE; doar avertismentul așteptat „1 niveluri”). Unitatea -E0 e scutită de `continuturi` în poartă (dirijorul, 27.09); pagina declară cinstit `continuturi:[]`.
- `verifica_lectie.py … --fara-t1` → S0, S1, S2 (aplicare/execuție 5 din 7 pe „Încearcă” + atelier), T0 (0) TRECUT; **ultima linie 0**. P3 și P7 apar ca „recunoaștere”: P3 e vocabularul butoanelor (regula 5 o permite), iar la P7 răspunsul („nota 3 sau nota 4”) cere ambele proceduri, dar cifrele stau în tabel.
- `_proba\parcurge.py`: gesturi reale la 390 px (Pixel 7, atingere) și 1280 px (mouse); la fiecare exercițiu întâi greșit, apoi corect; atelierul pe 6 lucrări; laboratorul (P5 → Laborator pe bară, „Verifică-te”); verificarea până la final. **0 probleme, 0 erori în consolă.** Capturile de telefon, privite: cuprinsul cu cele 4 casete, P3 cu bara, P6 și P7 cu tabelele (la iPhone SE tabelul lucrării avea o coloană tăiată: l-am refăcut pe 3 coloane).
- `_proba\doi_elevi.py` (J01/J02, regula 23), reluat pe 28.09 cu motor.js DE PE DISC (fără nicio reparație în memorie): server local, toate cererile care nu merg spre 127.0.0.1 OPRITE (fonturile vin din copia locală). Calculatorul 1: Ana se înscrie (1), termină lecția; Mihai vine: „Lucrezi ca Pop Ana” (3) → lista (2) → „Nu sunt în listă” → înscris, căsuța și progresul lui; după 90 de minute: „Ești tot Ionescu Mihai?” (4) → „Nu, sunt alt elev” → Ana își alege numele și își regăsește lecția terminată; la plecare, „Schimbă elevul” → lista cu ambele nume. Calculatorul 2: Radu apasă „Nu, doar vizitez” și își scrie numele; Dan vede „Pe calculatorul ăsta a lucrat Ene Radu” (3') → „Alege-te din listă sau înscrie-te” → formularul → căsuța și lecția îi sunt ale lui. **26 de verificări, 0 probleme.**
- Defectul din motor găsit pe 28.09 la 00:00 (`motor.js` r. 39: comentariul înghițise `const b=…`, iar după orice înscriere pagina se reîncărca goală) e reparat de dirijor; proba de mai sus confirmă (`doi_elevi.json`: „defectul de la r. 39” = False).
- `_proba\masoara_eticheta.py` (M1): unde e eticheta de jos la fiecare 120 px de derulare, la 412, 390 și 1280 px.
- **Regula 24 — cereri spre teste-vasile.** `_proba\proba_beacon.py`: ruta Playwright prinde și beacon-urile (`sendBeacon` apare ca „ping” și e oprit; 0 cereri scăpate spre un server de ascultare local). Toate probele mele cu elevi înscriși (`doi_elevi.py` de patru ori, `depanare_inscriere.py`, o depanare pe portul 8766) au rulat cu ruta care OPREȘTE tot ce nu merge spre 127.0.0.1: cererile spre `teste-vasile.netlify.app/api/activitate` și `/api/progres` au fost oprite, niciuna n-a plecat. Numele folosite: Pop Ana, Ionescu Mihai, Mocanu Dan (înscriși; școala Tupilați, clasa V) și Ene Radu (vizitator, neînscris). Probele pe fișierul local (`parcurge.py`, capturile, `proba_prezenta.py`) n-au înscris pe nimeni, iar `prezenta.js` trimite doar pentru un elev înscris; de azi au și ele paza (`_proba\paza.py`): la ultima rulare, 0 cereri spre teste-vasile. Singurele cereri externe care au plecat din probele mele de dinainte de regula 24 sunt spre Google Fonts (fișierele de font, fără date).
- `_proba\cuvinte.py`: textul pașilor are 91-110 cuvinte, „Uite cum” ≤ 79.
- Ținte de atingere: butoanele mici ale motorului 34 px, simulatorul ≥ 40 px, „Verifică-te” 44 px, bara 34 px.
- `curata_metadate.py`: lecția nu are fișiere Office de descărcat.

## 8. Nesigur

- Profilul elevului (citește, mouse, clic, taste, tragere pe telefon) e presupus; de confirmat de profesor.
- Pe situl viu, cu serverul de progres, după înscriere caseta poate aduce progresul de pe alt aparat (cu același nume și cod). Probat doar fără server (cererile oprite).
- Lecția e scrisă după ora din 11.09: la Brauner e recitire.
- 27.09: o cerere spre API-ul Wikimedia Commons (prima căutare de fotografii, înainte de regula 22) a avut în User-Agent numele de utilizator al profesorului. De atunci, doar `LearningHub-lectii/1.0 (educational site)`; scripturile din `_proba\` nu trimit nimic spre servicii externe.
