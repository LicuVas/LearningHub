# Lecția 24, clasa a VI-a — „Reprezentarea algoritmilor prin blocuri grafice” (predare) · surse și probe

**Nu e publicată, nu e în depozit (fără commit).** Autor: tura de noapte 01→02.11.2026 (autor VI/24). Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md`. Granița: `_campaign\revizuire_completa_2026_09\m4_noapte_01_11\granite\vi_l24.md`.

## 1. Documentele profesorului (au prioritate)

| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul „Reprezentarea algoritmilor prin blocuri grafice”, predare | `Info_Gimnaziu_2026\data\unitati.json` (VI-U3), `planificari\Proiectul_unitatii_VI-U3.md` r. 48 (ora 24: predare, „teorie, exercitii”), `Planificare_calendaristica_clasa_VI.md` r. 52 (CS.2.1, CS.2.2, CS.2.3) | titlul întocmai, competențele |
| Data | `Calendar_ore_6A_6M.md` r. 32: 19.03.2027, nr. **24**; `Calendar_ore_VI.md` r. 39: 09.03.2027, nr. **23** (alt calendar numără cu unu mai puțin) | pagina urmează `unitati.json` / `lectii\plan.json` (nr. 24, 19.03.2027); diferența e scrisă aici (ghidul S4) |
| Activitatea (citată întocmai) | `data\activitati_lectii_V_VI.json` r. 242: „Transcrierea unui algoritm din limbaj natural în schemă logică și invers, pentru un algoritm dat direct ca schemă. Se lucrează în perechi, cu verificare încrucișată.” | pasul „Din cuvinte în schemă” (limbaj natural → schemă), pasul „Din schemă în pseudocod și în Scratch” (schemă → pseudocod), atelierul „Verificarea încrucișată: schema colegului” |
| Resursa (citată întocmai) | același fișier, r. 243: „fișă cu simbolurile schemelor logice, laborator” | fișa = figura celor patru forme din pasul „Blocurile schemei logice” (pasul 2 din 6); laboratorul = Scratch (§7) |
| Fișa profesorului cu simbolurile | căutat în tot `Info_Gimnaziu_2026` („schem”, „simbol”): **nu există** pe disc (doar resursa numită). `competente_elev.json` CS.2.3: „să reprezint un algoritm cu repetiție, prin blocuri sau printr-o schemă”. | simbolurile vin din manuale + joc (§3); **Pentru profesor:** dacă fișa lui are alte forme, se schimbă în `S_FORME` și în textul pasului 2 |

**Perechi fără colegi (ora simultană la Tupilați):** „verificarea încrucișată” o face pagina: elevul primește schema „unui coleg” (desenată de pagină, fără nume), o execută pe 2-3 seturi de date, vede ce afișează și ce ar trebui să afișeze, găsește blocul greșit și îl schimbă. Testele judecă ce face schema (ieșirile pe seturi), nu forma desenului.

## 2. Conținutul declarat (programa)
`C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, clasa a VI-a, domeniul „Algoritmi”, conținutul 7: **„Modalități de reprezentare a structurilor repetitive prin blocuri grafice”** (copiat întocmai în `continuturi`).

| Partea conținutului | Predat la | Exersat (Încearcă / atelier) | Întrebare |
|---|---|---|---|
| blocurile grafice ale schemei logice (forme, săgeți) | pasul 2 „Blocurile schemei logice” | classify (8 blocuri noi în 4 forme) | Î1 |
| citirea / execuția unei scheme pas cu pas | pasul 3 „Citești schema pas cu pas” | urmărire în simulator (romb DA / NU, valoarea nouă) | Î2 |
| transcrierea cuvinte → schemă | pasul 4 „Din cuvinte în schemă” | construire cu locuri și blocuri | Î5 |
| structurile repetitive desenate (săgeata care se întoarce; „cât timp” și „repetă … până când”) | pasul 5 „Repetiția desenată” | urmărirea schemei mingii; construire din pseudocod | Î3, Î4 |
| schemă → pseudocod (și → Scratch) | pasul 6 „Din schemă în pseudocod și în Scratch” | alegere de pseudocod; caseta Scratch; laboratorul | Î4 |
| verificarea (încrucișată) a unei scheme | atelierul | schema colegului, pe 3 seturi | — |

Secvența și decizia desenate intră pentru că activitatea profesorului cere „transcrierea unui algoritm” oarecare, iar repetiția nu se poate desena fără romb (decizia).

## 3. Simbolurile — sursa și variantele (cerința „nu din memorie”)
Cercetarea pe disc: `_proba\cercetare_manuale.md` (manualele oficiale de clasa a VI-a, OM 5022/06.07.2023, din `C:\00\Manuale_Info_TIC\`; `manuale.py dosar` arată doar programa). **Doar 3 din 6 manuale de a VI-a desenează scheme logice:**

| Sursa | START / STOP | Citire / afișare | Atribuire | Decizie |
|---|---|---|---|---|
| **Sigma VI** (A1452), p. tipărite 68-69 — singurul care definește fiecare bloc | oval, „START” / „STOP” | „trapez cu baza mare în sus sau … paralelogram” (CITEȘTE); „trapez cu baza mare în jos sau … paralelogram” (SCRIE) | dreptunghi, `variabilă←expresie` | romb, condiția FĂRĂ „?”, ieșiri NU / DA |
| Corint VI (A1453), p. 88, 90 | dreptunghi rotunjit | paralelogram, „Citește n”, „Scrie sum” | dreptunghi, `:=` | romb, TRUE / FALSE (o dată „FALS / TRUE”) |
| Art Klett VI (A1449), p. 69-70, 76 | — (doar fragmente) | — | dreptunghi, `←` | romb, Da / Nu |
| Art Klett V (A1226), p. 67-68 | oval, START / STOP | paralelogram pentru amândouă (Citește / Scrie) | dreptunghi, `←` | romb, Nu / Da |
| jocul `jocuri\algoritmi-vi` N7 (r. ~304, `FORME`) | oval | paralelogram „citire sau scriere” | dreptunghi, `←` | romb cu „?” în el, DA / NU |

**Setul ales:** oval START / STOP; paralelogram pentru citire și afișare; dreptunghi pentru atribuire (`←`) sau o mișcare Scratch; romb pentru condiție, ieșirile DA / NU; săgeți pentru ordine. Temeiul: Sigma VI (forma „sau … paralelogram”) + Art Klett V + jocul sitului; e setul pe care sursele îl au în comun.
- În romb **fără „?”** (ca toate manualele; jocul pune „?” — singura diferență față de joc).
- Cuvintele din blocuri sunt cele ale clasei, din pseudocodul VI/17: „Citește”, „Afișează”, „←” (manualele scriu și „Scrie” / „SCRIE”).
- **Pagina spune variantele într-o propoziție** (pasul 2): „Alte manuale desenează uneori citirea și afișarea ca trapez, scriu „Scrie” în loc de „Afișează” sau TRUE și FALSE (adevărat și fals, în engleză) în loc de DA și NU; ideea e aceeași.” Nu pomenesc `:=` (Corint) și conectorii (Sigma): nu-i folosim.
- Așezarea DA / NU: la noi DA în jos și NU spre dreapta (sau spre stânga, la săgeata care se întoarce); Sigma pune NU în stânga și DA în dreapta. Pagina nu promite o așezare fixă: fiecare ieșire are eticheta scrisă.

## 4. Ce presupun cunoscut (din lecțiile publicate) — cu bife
| Presupus | Unde e predat | Folosit aici |
|---|---|---|
| ✔ algoritm pe rânduri: Început, Citește, `←`, Afișează, Sfârșit; „Dacă … atunci … altfel” (ramurile mai la dreapta, fără „sfârșit dacă”) | VI/17, pașii 3-4 | pașii 2, 3, 6; întrebările |
| ✔ condiția adevărată / falsă; < ≤ > ≥ = ≠; „cel puțin” → ≥; `%` = restul | VI/17, pașii 4-5 | pasul 4 („cel puțin 5”), pasul 6 (`n % 2 = 0`) |
| ✔ tabelul de urmărire; „valorile de acum” în dreapta săgeții | VI/17, pasul 3 | pasul 3 (tabelele calculate) |
| ✔ pseudocod (cuvântul), corpul, trecere | VI/20 | pașii 5-6 |
| ✔ `cât timp … execută … sfârșit cât timp` | VI/21 | pasul 5, Î4 |
| ✔ `repetă` … `până când …` (condiția de oprire) | VI/22 | pasul 5, pasul 6 (Încearcă) |
| ✔ Scratch online fără cont, în română; „când se dă click pe ⚑”, „mergi la x 0 y: 0”, „orientează-te în direcția 90”, „mergi 10 pași”, „spune Salut! pentru 2 secunde”, schimbarea unui număr / text (clic, scrii, Enter), salvarea `.sb3`, Descărcări, F2 | VI/18 (+ VI/21-22) | casetele, laboratorul |
| ✔ „repetă până când” = testul ÎNAINTE de fiecare trecere; Operatori „( ) > (50)”, „poziția x”, locul în șase colțuri | VI/21 (probat viu acolo și azi, §8) | pasul 6, caseta, laboratorul |
Exemplele din VI/17 refolosite (desenate): „preț, n, total” (VI/17 r. 74), „înălțime ≥ 140 / traseul mare / mic” (VI/17 r. 78), „Citesc a și b. Dacă a > b atunci afișez a, altfel afișez b.” (testul inițial al profesorului, citat în VI/17 `surse.md` r. 9).

## 5. Granița (ce NU predau)
- **NU** comparația celor trei structuri și nici „când o folosesc pe fiecare” / regula alegerii (VI/23, vecinul din val). Pasul 5 arată doar cum se DESENEAZĂ „cât timp” și „repetă … până când” (locul rombului, drumul care se întoarce), fără tabel comparativ, fără „minimul de treceri”, fără alegere de structură.
- **NU** sume, numărări cu proprietate, cifrele unui număr (VI/25): exemplele sunt ceaiul care se răcește, mingea, triplarea, numărătoarea inversă a rachetei (afișare, nu numărare cu proprietate), ceasul cu 12 ore, paritatea (`n % 2`, fără cifre).
- **NU** evaluarea (VI/26). **NU** „dacă” din Scratch (nepredat; laboratorul n-are decizie în Scratch), **NU** variabilele Scratch, „pentru” nedesenat (nu e cerut de activitate; o lecție următoare îl poate desena cu aceleași blocuri).
- Vocabularul vecinilor nu apare nici în variante (`verifica_lectie.py` T0 = 0).

## 6. Pașii (P0 + 5) și ce face fiecare
1. „La ce folosește: un algoritm desenat” — planul de evacuare (fotografie Commons) → schema logică, blocurile grafice.
2. „Blocurile schemei logice” — formele, figura lor, variantele din manuale; Încearcă: classify; caseta Scratch: pălăria = START.
3. „Citești schema pas cu pas” — metoda în 4 pași; Uite cum: schema traseului cu tabelul calculat; Încearcă: urmărirea reducerii (preț 130); caseta Scratch: două dreptunghiuri.
4. „Din cuvinte în schemă” — metoda în 4 pași; Uite cum: nota (Promovat / Mai încearcă); Încearcă: construirea schemei „cel mai mare din a și b”.
5. „Repetiția desenată: săgeata care se întoarce” — cele două desene, cu pseudocodul lor; Uite cum: tabelul ceaiului; Încearcă: urmărirea mingii.
6. „Din schemă în pseudocod și în Scratch” — regulile inverse + „repetă până când” din Scratch în schemă; Uite cum: paritatea ↔ pseudocod, schema laboratorului ↔ programul Scratch (captură reală); caseta Scratch: repetiția, condiția, „spune”.
Atelier: verificarea încrucișată (racheta; încă: ordinea greșită). Laborator: Scratch. 5 întrebări (4 alegeri + 1 construire).

## 7. Laboratorul — alegerea și motivul
**Ales: (b) Scratch 3 online, fără cont:** elevul face programul DUPĂ o schemă dată, îl rulează, verifică unde se oprește pisica (x 130) și salvează `Schema_<clasa ta>_<numele tău>.sb3`, cu „Nu (sau Anulare)” la „există deja”.
Motive: (1) Scratch e aplicația unității VI-U3 (VI/18-22; decizia dirijorului nr. 2); (2) programa: „reprezentare … prin blocuri grafice” — schema și blocurile Scratch sunt două reprezentări ale aceluiași algoritm; (3) **PowerPoint respins:** textul în formă NU s-a predat (VI/4-6 au pus text doar în Casetă text — `_proba\cercetare_vi17_22.md` §7), galeria simulată din VI/4 n-are romb, paralelogram sau conectori, iar pe desktopul ascuns „clicurile de mouse nu ajung (… forma pusă cu un clic …)” (ghidul VIII.A), deci gestul nu se poate proba real; plus lacătul comun la 6 autori.
Fișierul prefix `Schema_` e liber (VI/18-22: Pisica_, Patrat_, Repeta_, Margine_, Final_; vecinii: VI/23 `Compar_`, VI/25 `Suma_`).

## 8. Faptele despre Scratch
| Fapt | Starea | Dovada |
|---|---|---|
| programul laboratorului (din −150, „repetă până când (poziția x) > (100)”, „mergi 40 pași”, „spune Am ajuns! pentru 2 secunde”) se oprește la **x 130** și spune „Am ajuns!” | PROBAT VIU 01.11.2026 | `_proba\live_schema.py` → `live_schema.json` A_laborator_40 și C (x 130, SAY „Am ajuns!”) |
| cu „mergi 60 pași”: **x 150** („Dacă mai ai timp”) | PROBAT VIU | `live_schema.json` B_mai_ai_timp_60 |
| capturile `img\program-schema.webp`, `img\scena-x130.webp` | capturi din editorul adevărat | `img\SURSE.json`; `live_schema.py` C |
| „repetă până când” testează ÎNAINTE de fiecare trecere și se oprește când condiția e adevărată | CONFIRMAT VI/21 (+ viu azi: x 130 = prima poziție > 100) | VI/21 `index.html` r. 170; VI/22 `surse.md` r. 56 |
| deschiderea (`scratch.mit.edu` › Creează; Settings › Language › Română), „când se dă click pe ⚑”, numele blocurilor, schimbarea numărului / textului, salvarea, „Nu te-a întrebat?” | CONFIRMAT VI/18, VI/21-22 (textul laboratorului VI/22 refolosit, cu `Schema_`) | VI/22 `index.html` r. 194-197, VI/18 r. 138-142 |
| „Se omite acest fișier” (Explorer, când mutarea găsește același nume) | NESIGUR (copiat din VI/22; ghidul VIII.I: „scris din memorie → prudent”) | — |
Probele vii: Chromium din Playwright, headless, profil temporar, fără cont, rețeaua doar spre `*.scratch.mit.edu` (oprit: `www.googletagmanager.com`); nimic tastat în formulare; Chrome / Edge reali NEPORNIȚI.

## 9. Simulatorul NOU: `lectii\_sim\schema-logica.js` (`window.SchemaLogica`, 1.0 → **1.1 la r1, 02.11**, proprietar VI/24; ce s-a schimbat: §18)
- Ce face: desenează schema (SVG, fără bibliotecă), o execută pas cu pas (unde ești, valorile, ce s-a afișat), tipul de exercițiu `schema` cu modurile `construieste` (locuri goale + blocuri: atingi locul, apoi blocul — fără tragere), `coleg` (schema unui coleg, cu blocuri de schimbat) și `urmareste` (elevul execută: la romb DA / NU, la dreptunghi valoarea nouă). Testele = ieșirile pe 2-4 seturi de date, comparate cu ale soluției (rezultat, nu drum: orice așezare care face același lucru trece — oracolul a găsit 2 la P3E1 și AtelierE2).
- **Regulile convenției, verificate la execuție** (mesaje adevărate, fără răspuns): citirea / afișarea în paralelogram, atribuirea în dreptunghi, condiția în romb; din romb două săgeți (DA, NU), din celelalte una; o dată fără valoare → „„x” nu are încă nicio valoare…”; peste 400 de pași → „Schema nu se oprește…”; `==` respins („un singur semn: „=””).
- **Fidelitate:** schema logică nu e o aplicație de pe calculator (e desenul de pe caiet), deci nu există „aplicația reală” de copiat; desenul și regulile sunt ale convenției din §3. Abateri spuse: niciuna față de manuale în afară de așezarea DA / NU (§3).
- Ce NU face: tragere de blocuri (alegerea e prin atingere), desen liber, „pentru”, conectori.
- Nimic nu se salvează și nu pleacă (0 `localStorage`, 0 cereri): starea stă în memoria exercițiului.

### Pentru lecția următoare (VI/25, VI/26 și cine mai desenează scheme)
- Încărcați `<script src="../../_sim/schema-logica.js"></script>` după `motor.js` și puneți `tipuri: {schema: SchemaLogica.tipuri.schema}`.
- API: `SchemaLogica.svg(schema, {acum, ales})`, `.figura(schema, {legenda, aria})`, `.executa(schema, intrari)` → `{pasi, iesire, gata, eroare, valori}`, `.tabel(schema, intrari)` (tabelul de urmărire, calculat), `.cuCarti(schema, carti, alegeri)`, `.compileaza(bloc)`, `.dateText(intrari)`, `.fmt(x)`.
- Forma schemei: `{start, blocuri: [{id, tip: 'start'|'stop'|'citire'|'afisare'|'calcul'|'decizie', text, c, r, urm | da, nu, iesDa, iesNu, gol}]}`; cărțile `{id, tip, text}`; exercițiul `{t:'schema', mod, schema, carti, seturi:[{intrari}], solutie:{loc:carte}, gresit:{…}, start?:{…}, intrari? (urmareste)}`.
- Stilul: `svg()` / `figura()` pun singure stilul `#sl-css` (o singură dată pe pagină), deci și un desen static, fără niciun exercițiu montat, iese cu forme deschise la culoare și se micșorează după chenar (până la 00:12 stilul venea doar cu exercițiul, iar desenele din text ieșeau negre și late). `SchemaLogica.stil()` rămâne public, dar nu mai e obligatoriu. Proba: `parcurge.py` (`verif_scheme`).
- NU schimbați: numele tipului, forma de mai sus, prefixul `.sl-`, `#sl-css`, mesajele. Adăugiri doar compatibile, cu data, în capul fișierului și în granița `vi_l24.md`.
- Pentru poartă: `body._sl.umple(alegeri)` / `body._sl.evalueaza()` (construieste / coleg), `body._sl.pas()` / `.gata()` / `.gresite()` / `.prima()` (urmareste; `.prima()` nou la 1.1).
- **De la 1.1 (r1, 02.11):** la `construieste` / `coleg`, o atingere pe loc îl ALEGE mereu (și pe cel deja ales); la `urmareste`, „Corect” vine numai după un drum FĂRĂ greșeli (testul 2), iar după greșeli elevul apasă „Ia-o de la capăt”. O lecție care cere urmărirea ca „Încearcă” trebuie să știe asta (și proba ei: un drum cu greșeli e respins).
- Ce rămâne la elev: `Schema_<clasa>_<numele>.sb3` (programul laboratorului) și, dacă a avut timp, schema desenată în caiet.

## 10. Pentru componenta comună
Nu am schimbat nimic din `jocuri\_motor\`, `prezenta.js`, `rezultat-elev.js` sau simulatoarele altora (fișier NOU în `lectii\_sim\`). Am încărcat doar `motor.js` + `schema-logica.js`.

## 11. Porțile (rulate ultimele, pe versiunea finală — cifrele în `_proba\`)
| Poartă | Rezultat |
|---|---|
| `test_joc.py --dir lectii/vi m4-l24` | TRECUT (`_proba\test_joc_final.txt`); avertisment „N1P5: 161 cuvinte” = pasul „Repetiția desenată”, unde poarta numără și cele două pseudocoduri și textele din blocurile celor două scheme; textul de predat are 76 de cuvinte (`durata.py`, ghidul S34). **r1 (02.11): avertismentul a dispărut** — desenele s-au mutat în „Uite cum” (litera H, §18) |
| `verifica_lectie.py index.html --fara-t1` | ultima linie 0 (S0, S1, S2, T0 trecute) |
| `_proba\parcurge.py` (390 px Pixel 7 cu atingere + 1280 px cu mouse; fiecare exercițiu întâi greșit, apoi bun; până la diplomă) | 0 probleme, 0 erori de consolă, 3 stele, 0 cereri spre `teste-vasile` (rerulat 02.11, 01:52-01:57, pe versiunea finală: `_proba\parcurge_final390.txt`, `parcurge_final1280.txt`) |
| Desenele schemelor (în `parcurge.py`, `verif_scheme`, adăugată 02.11): la intrarea în fiecare pas, după fiecare exercițiu, la atelier, la laborator și la fiecare întrebare, fiecare schemă (`.sl-svg`) și fiecare formă mică de pe cărți are stilul aplicat (forma nu e neagră, are contur) și încape în chenar: nu iese din părinte, din niciun strămoș care taie sau derulează, nici din ecran; pagina fără derulare orizontală | 0 probleme la 390 și 1280 (135 de desene în 38 de verificări, pe fiecare lățime). **Probată că pică** pe versiunile stricate servite prin rută (fișierele de pe disc neatinse): `PARCURGE_DEFECT=stil` (defectul găsit la 00:12: stilul pus doar la montarea unui exercițiu → formele negre și late) → 6 probleme la pasul 2; `PARCURGE_DEFECT=lat` (schema nu se mai micșorează) → 3 probleme (`_proba\parcurge_defect_*.txt`). Verificarea vechii probe (derulare orizontală) nu prindea: chenarul cărții are `overflow:hidden`, deci schema tăiată nu derulează pagina |
| `_proba\oracol_independent.py` (Python, fără codul simulatorului: toate așezările cărților la fiecare exercițiu de construire, verdictul Python vs pagină; „why”-urile; pseudocodul variantelor pe 9 seturi; cifrele din texte) | 0 nepotriviri |
| `_proba\test_nucleu.js` (node: execuție, erori de formă, „nu se oprește”) | 0 |
| `_proba\proba_mutanti.js` (8 mutanți ai simulatorului: fiecare strică o regulă; `test_nucleu.js` pe copia stricată trebuie să-l prindă) | 8 prinși, 0 scăpați; codul nestricat: 0 probleme (02.11, 01:58) |
| `learninghub_date_personale.py` (tot depozitul) | 0 fișiere cu date personale (02.11, 02:00) |
| `_proba\live_schema.py` (Scratch viu) | 0 eșuate (01.11, 23:56; laboratorul și casetele Scratch neschimbate de atunci, deci nererulat) |
| `activitate.py lista \| grep -c "nu e în catalog"` | 0 înainte, 0 după (valoarea de start 0) |

## 12. Durata (metoda judecătorului: 110 cuvinte / min + gesturile)
`_proba\durata.py` → `durata_out.txt`: drumul obligatoriu ≈ 1.880 de cuvinte (≈ 17 min) + gesturi ≈ 22 min (classify 60 s, 3 casete Scratch 90 + 60 + 180 s, urmăriri 60 + 120 s, construire 120 s, atelier 180 s, laborator 240 s, întrebări 190 s) ≈ **39-40 min**. Opțional: „Încă un exercițiu” (6), „Dacă mai ai timp” în laborator. Textul de predat pe pas: 68 / 89 / 84 / 77 / 76 (+ 27 pseudocod) / 97 de cuvinte; „Uite cum” ≤ 52.

**Refăcută la r1 (02.11, pe versiunea finală; cele două judecăți dădeau 34,5-42,6 min — opus — și ≈ 48 min — sonnet, cu gesturi mai lente):** metoda judecătorului opus, copia `_proba\j1_durata.py` rulată neschimbată → **35,3 min** (drumul obligatoriu 2.319 cuvinte = 21,1 min + gesturile numărate în proba lui 14,2 min; `_proba\j1_durata_out.txt`). Cu gesturile sonnet (Scratch 120 / 90 / 270 s, construirea 150 s, mingea ~180 s, laboratorul ~300 s, atelierul ~210 s, întrebările ~230 s) și cele +82 de cuvinte ale reparațiilor: ≈ **48,7 min**; un elev care greșește o urmărire și o reia (r1, litera B) mai pune ~1-2 min. Drumul fără greșeli rămâne sub 50 după ambele socoteli, dar cea pesimistă e la limită → **de cronometrat la clasă** (regula 30). Frâna din pagină rămâne: „Când mai sunt 10 minute din oră, treci la întrebări” (`cum`), laboratorul are „Dacă mai ai timp”. Cuvintele pe pas, după r1 (text + desenele din el, fără legenda pozei): 70 / 87 / 83 / 77 / 110 / 109 (`_proba\r1_cuvinte.txt`).

## 13. Imagini (`img\SURSE.json`)
- `plan-evacuare.webp` — Wikimedia Commons, „Fluchtplan Rettungsplan Kaufmännische Schule Tauberbischofsheim Erdgeschoss Hintereingang.jpg”, autor Triplec85, **CC BY-SA 4.0** (licența citită prin API, `_proba\commons_licenta.json`), sha1 al originalului verificat; decupată și micșorată, aceeași licență, atribuirea sub poză. Scrisul e în germană (legenda spune ce înseamnă „Standort”). Fără persoane, fără date personale.
- `program-schema.webp`, `scena-x130.webp` — capturi proprii din editorul Scratch adevărat (§8).
- Schemele sunt desenate de simulator (SVG), nu imagini.
- Respinse: „Diagrama de flux termes GO.jpg” (nu e un algoritm), „Flowchart …” (diagrame tehnice, nu din viața elevului).

## 14. Nesigur / Pentru profesor
- **Pentru profesor:** fișa lui „cu simbolurile schemelor logice” nu e pe disc; am ales setul din §3. Dacă la clasă desenați altfel (trapez, „Scrie”, „?” în romb), se schimbă o figură și o propoziție.
- **Pentru profesor:** calendarul `Calendar_ore_VI.md` o numără lecția 23 (09.03.2027); planul site-ului urmează `Calendar_ore_6A_6M.md` (24, 19.03.2027).
- „Se omite acest fișier” (ramura „Nu te-a întrebat?”, preluată din VI/22) — ~~nesigur~~ **confirmat la r1** din resursele Windows în română (`shell32.dll.mui`: „Se om&ite acest fișier”, judecătorul 1 și `_proba\r1_omite.txt`; A13).
- **Pentru profesor (r1): „pentru” desenat.** Pasul 5 spune acum într-o propoziție cum se desenează „pentru i ← 1, n” (ca „cât timp i ≤ n”, cu i ← 1 înaintea rombului și i ← i + 1 la sfârșitul corpului — legătura arătată deja la VI/21), fără exercițiu: activitatea din `activitati_lectii_V_VI.json` nu-l cere, iar conținutul e „reprezentarea structurilor repetitive”. Vreți și un exercițiu cu „pentru” desenat (o construire cu 3 locuri)? Se adaugă ca „Încă un exercițiu” la pasul 5, fără să crească drumul obligatoriu.
- „Standort” = „ești aici”: DEDUS din cuvântul german („locul unde te afli”) și din săgeata mov a planului; nu schimbă nimic din lecție.
- „Pe holul școlii e de obicei un plan de evacuare” — scris prudent („de obicei”).
- Scratch pe telefon nu e cerut (casetele și laboratorul se sar pe telefon; atelierul ține loc de laborator).

## 15. Siguranța (regulile 21-27)
- Nicio aplicație pornită pe ecran, niciun Office, nici PowerPoint (lacătul nu a fost luat), niciun Chrome / Edge real, nicio aplicație din Magazin. Doar Chromium din Playwright, headless, cu rețeaua blocată spre tot ce nu e 127.0.0.1 (probele lecției) sau spre tot ce nu e `*.scratch.mit.edu` (proba vie), închis cu `ctx.close()`.
- Cereri externe: Commons (API + fișierul fotografiei) cu User-Agent-ul `LearningHub-lectii/1.0 (educational site)`; nicio dată a profesorului.
- Nicio cheie de registru atinsă, nicio salvare în afara `_proba\`; nu sunt fișiere de descărcat (regula 21 nu se aplică).
- Nume: niciun nume de persoană în pagină („un coleg”, fără nume); exemplul de fișier `Schema_6A_Popescu` e forma de nume, ca la VI/21-22.

## 16. Regulile ghidului verificate pe lecție
1 (nimic nepredat: T0 = 0; formele și săgețile predate la pasul 2 înainte de orice exercițiu), 2 (pași ≤ 110 cuvinte), 3 (casetele spun unde, ce, cu ce confirmi), 4 (schemele = simulatorul; capturile Scratch reale), 5 (5 din 6 „Încearcă” + atelier = aplicare / execuție, S2), 7 (§8, `afirmatii.json`), 9 (§9), 10 (3 casete + laboratorul), 20 (ținte ≥ 32 px, măsurate de `parcurge.py` la 390), 23 (nimic păstrat), 24 (rețeaua blocată, `ctx.close()`, 0 elevi falși), 26 („Nu (sau Anulare)”), 27, 28-29 (mesajele spun starea, testele judecă ieșirile), 31 (telefonul), 33 (granița), 38 (numele fișierului cu clasa ta).

## 17. Atenție pentru judecător
- Pasul 5 desenează și „cât timp”, și „repetă … până când”: verificați că rămâne desen (locul rombului, drumul întors), nu comparația lui VI/23.
- Laboratorul: rombul schemei e ÎNAINTEA corpului, dar cu corpul pe NU și ieșirea pe DA (forma lui „repetă până când” din Scratch, explicată în pasul 6) — diferită de „cât timp” din pasul 5 (corpul pe DA). E intenționat: așa se desenează exact ce face Scratch.
- Atelierul „coleg”: testele arată ieșirea așteptată în numele lor („Pentru n = 3, schema afișează 3, 2, 1, Start!”) — e cerința problemei, nu răspunsul (blocul greșit trebuie găsit).
- Î5 e un exercițiu de construire în simulator (nu alegere): verificați-l la 390 px cu degetul. **De la r1 (02.11):** Î5 = „Citește p. Dacă p este mai mare decât 100, îl faci 100. Afișează p.” (înainte era același algoritm ca „Încă un exercițiu” de la pasul 6).

## 18. Reparațiile după judecata 1 (02.11.2026)
Registrul: `_verificare\registru_j1.md` — 14 litere (A-N), din opus 0 / 3 / 6 și sonnet 0 / 2 / 5 reunite fără dubluri; **toate REPARATE, niciuna respinsă**. Copia dinainte: `_proba\inainte_r1\`. Reparatorul: autor proaspăt, promptul `m4_noapte_01_11\prompturi\r1_vi24.md`.

**Ce s-a schimbat în pagină:** P2 „Blocurile” — nota variantelor (+ colțurile DA / NU, „?” în jocuri) mutată în „Uite cum” (K, H) · P4 „Din cuvinte în schemă” — explicația spune și varianta corectă cu a < b (F) · P5 „Repetiția desenată” — cele două desene cu pseudocodul lor în „Uite cum” (H), „pentru” desenat ca „cât timp” într-o propoziție (N), fără „din stânga / din dreapta” (I) · P6 „Din schemă în pseudocod și în Scratch” — regula „Dacă … atunci” fără „altfel” (D), propoziția comună „Atenție la nume” întocmai ca la VI/23 (C), corespondența START / „spune” lăsată doar în legenda capturii · atelierul E2 — „Merge și dacă scazi întâi și afișezi n + 1.” (F) · Î5 nouă: „Citește p. Dacă p este mai mare decât 100, îl faci 100. Afișează p.” (G) · laboratorul — legenda: balonul dispare după 2 secunde, x rămâne 130 (J, probat VIU).

**Ce s-a schimbat în simulator (`schema-logica.js` 1.0 → 1.1, API NESCHIMBAT; granița `vi_l24.md`, SCHIMBAT 02:54):** atingerea unui loc îl alege mereu (A) · zona de atingere transparentă `rect.sl-hit` a locurilor desenate, ≥ 56 de unități ≈ 40 px la 390 (E) · `urmareste`: testul 2 „fără nicio greșeală”, mesajul cu numărul greșelilor și locul primei, trimiterea la „Ia-o de la capăt”; `body._sl.prima()` (B) · căsuța valorii: același număr în orice scriere, „1 10” și ne-numerele refuzate fără greșeală (L).

**Pentru lecția următoare (VI/25, VI/26):** API-ul e același; dacă folosiți `urmareste`, „Corect” vine numai după un drum fără greșeli. Nimic altceva de schimbat la voi.

**Faptele noi:** A16 balonul (PROBAT_VIU, `_proba\r1_live_balon.py`), A17 „pentru” (VI/21), A18 „Dacă … atunci” fără „altfel” (VI/17), A19 „Atenție la nume” (VI/23, VI/21, VI/22); A13 „Se omite acest fișier” → CONFIRMAT_RESURSE (`_proba\r1_omite.py`). `afirmatii.json`: 19 afirmații, 18 probate, 1 dedusă (A14), 0 nesigure.

**Durata:** §12 (35,3 min după metoda judecătorului opus; ≈ 48,7 cu gesturile sonnet — de cronometrat la clasă).

**Porțile după r1 (02.11, 02:57-03:17, pe versiunea finală):** `proba_reparatii.py` 0 (86 de verificări, A-N, 390 + 1280) · `proba_mutanti.js` 0 scăpați (8 + 5 mutanți noi + versiunea veche) · `parcurge.py` 0 (3 stele, consola goală) · `oracol_independent.py` 0 · `test_nucleu.js` 0 · `live_schema.py` 0 + `r1_live_balon.py` 0 · copiile probelor celor doi judecători rulate neschimbat (detaliile în registru) · `test_joc` TRECUT · `verifica_lectie --fara-t1` 0 · date personale 0 · „nu e în catalog” 0 / 0.
