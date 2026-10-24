# Lecția 21, clasa a VI-a — „Structura repetitivă condiționată anterior (cu test inițial)” (predare) · surse și probe

Autor: VI/21, tura 23→24.10.2026 (dimineața). Cheia `lectie_vi_m3_l21`, unitatea VI-U3 „Algoritmi: structuri repetitive”, CS.2.1, CS.2.2, CS.2.3. Granița cu vecinii: `_campaign\revizuire_completa_2026_09\m3_noapte_23_10\granite\vi_l21.md` (VI/20: `vi_l20.md`, VI/19: `vi_l19.md`, VI/18: `vi_l18.md`).

## 1. Documentele profesorului (au prioritate)
- `Info_Gimnaziu_2026\planificari\Proiectul_unitatii_VI-U3.md`: ora 21 = „Structura repetitivă condiționată anterior (cu test inițial)”, predare, „teorie, exercitii”; descriptorii „Consolidat” ai CS.2.2 și CS.2.3: „repetiții condiționate de bază (cu operatori relaționali)”, urmărite pas cu pas și reprezentate în mediul grafic interactiv.
- `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`, lecția 21: „Comparație directă cu structura cu contor, pe aceeași problemă. Se caută împreună un caz în care ciclul nu se execută niciodată și se explică de ce.” (laborator, fișă cu cazuri-limită) → pasul 2 („Problema de la lecția 20, în două feluri”: `pentru i ← 1, 3` și `i ← 1; cât timp i ≤ 3 … i ← i + 1`, aceleași afișări) și cazurile-limită: corpul de 0 ori (pasul 2, „Încă un exercițiu”; pasul 4, „Încă un exercițiu” cu n = 3; Î3; în Scratch, atelierul probează și pornirea de la x 130, iar pasul 3 de la x 150).
- `Calendar_ore_VI.md` (Izvoare, 16.02.2027, nr. 21), `Calendar_ore_6A_6M.md` (Brauner, 19.02.2027); `data\unitati.json`; `AI_0\data\informatica_gimnaziu\curriculum.json` (clasa a VI-a, Algoritmi: „Structura repetitivă condiționată anterior”).
- Decizia dirijorului (23.10.2026, `m3_noapte_23_10\contract.md`): aplicația = Scratch 3 online, în română, fără cont.

## 2. Conținutul declarat
`continuturi: ['Structura repetitivă condiționată anterior']` — predat în pașii 0-5 (testul înainte de fiecare trecere, 0 treceri, „cât timp … execută”, „repetă până când” cu condiția opusă, tabelul pe teste, finitudinea) și verificat de toate cele 5 întrebări. Competențele: CS.2.1 (Scratch: pașii 1, 3, 5, casetele, atelierul, laboratorul), CS.2.2 (urmărirea pas cu pas: pasul 4, tabelul pe teste, „Pas cu pas” în simulator), CS.2.3 (algoritmul cu repetiție condiționată reprezentat în Scratch: pasul 3, atelierul).

## 3. Ce presupun cunoscut (cu bife) și ce acopăr
| Presupun (din) | Acoperit aici |
|---|---|
| ✔ algoritmul pe rânduri: Început, Citește, ←, Afișează, Dacă … atunci, rândurile mai la dreapta (VI/17, publicată) | P2, P4, P5, Î3-Î5 |
| ✔ condiția adevărată / falsă, cu < ≤ > ≥ = ≠ (VI/17: notația și interpretorul `urmarire-algoritm.js`) | P0, P2, P3 (opusele), P4 |
| ✔ tabelul de urmărire, „valorile de ACUM” (VI/17); tabelul pe treceri, „la început” (VI/20) | P4 (tabelul pe teste, aceleași cuvinte) |
| ✔ finitudinea (VI/17; VI/19 o leagă de repetiție) | P5 |
| ✔ Scratch fără cont, în română; paleta, zona de cod, steagul, Stop, tragerea, ștergerea în paletă, „mergi la x 0 y: 0”, „orientează-te”, „mergi”, „spune … pentru … secunde”, schimbarea unui număr; salvarea `.sb3`, Descărcări, F2, Decupare, Lipire, „Se omite acest fișier” (VI/18) | P1, P3, P5 (casetele), atelierul, laboratorul (fiecare gest e spus din nou, pe scurt) |
| ✔ blocul C, gura, trecerea, brațul de jos, blocul de sub braț = o dată, după; „pentru i ← a, b execută … sfârșit pentru”, corpul, pseudocodul (VI/20, în judecată — granița `vi_l20.md`) | P1 (comparația cu „repetă”), P2 (comparația cu „pentru”), laboratorul punctul 2 |
| ? Dacă VI/20 își schimbă notația „pentru” la judecată, se schimbă aici doar listarea `PENTRU_3` din pasul 2 | — |
NU apar: „repetă … până când” din pseudocod (22), comparația celor trei (23), schema logică (24), variabilele Scratch, „dacă” în Scratch, blocul „nu” din Operatori (doar cuvântul „nu atinge” în tabelul opuselor), „așteaptă până când”. `verifica_lectie.py` T0: 0 termeni ai lecțiilor viitoare.

## 4. Notația „cât timp” — **Pentru profesor**
Documentele dumneavoastră NU dau forma structurii cu test inițial în pseudocod (testul inițial are doar „repet de 5 ori: …” și „pentru i de la 1 la 10 repet”). Am ales forma din manualele uzuale, cu cuvintele lecțiilor 17 și 20 (corpul mai la dreapta, închiderea ca „sfârșit pentru” de la lecția 20):
```
n ← 17
cât timp n ≥ 5 execută
   n ← n - 5
sfârșit cât timp
Afișează n
```
Simulatorul primește și „■” în loc de „sfârșit cât timp” (forma din jocul `algoritmi-vi`) și forma fără rând de închidere, fără diacritice („cat timp … executa”). Dacă la clasă scrieți altfel (de exemplu „cât timp … repetă”, „sfârșit_cât_timp”), se schimbă doar textele și o expresie regulată din `lectii\_sim\urmarire-algoritm-cattimp.js`.
**Condițiile de tradus în Scratch au ≤ sau ≥** (opusul lor, > sau <, există în Scratch); lecția NU folosește trucul „x ≥ 50 = x > 49” (jocul `algoritmi-vi` îl folosește): Scratch are doar <, > și = în Operatori.

## 5. Faptele despre Scratch — probate în editorul viu
Editorul public `scratch.mit.edu/projects/editor/`, Chromium din Playwright, headless, profil temporar (context nou), fără cont, fără „Distribuie”, nimic tastat în formulare de conectare; Chrome / Edge reali NU s-au pornit. Pozițiile = câmpurile de sub scenă; ce spune pisica = evenimentul SAY al mașinii virtuale a editorului (citit, nemodificat); structura = project.json-ul SALVAT. Scripturile: `_proba\live_paleta.py`, `live_executie.py`, `live_gesturi.py`, `live_capturi.py` (+ `live_lib.py`, copia bibliotecii VI/20 cu adăugirile notate în antet) → `_proba\live_conditie.json` (L1-L6, 0 eșuate); `_proba\live_extra.py` → `live_extra.json` (programele EXACTE din pagină). Capturile întregi și proiectele: `_proba\live\`.
- Control (L1): „așteaptă 1 secunde”, „repetă 10”, „la infinit”, „dacă atunci”, „dacă atunci altfel”, „așteaptă până când”, **„repetă până când”** (C, cu loc în șase colțuri gol), „stop totul”, … Niciun bloc „cât timp” (`control_while` doar în traducere).
- Detectare (L2): „atinge cursorul mouse-ului ?”, implicit „cursorul mouse-ului” (`_mouse_`); lista, cu un singur personaj: „cursorul mouse-ului”, „marginea”. Operatori (L3): „( ) > 50”, „( ) < 50”, „( ) = 50”, prima căsuță goală. Mișcare: „poziția x” pe locul 16 din 18.
- Execuția (L4, live_extra): „repetă până când atinge marginea?” de la x 0, direcția 90: pas 1 → 194, 5 → 195, 7 → 196, 10 → 200, 20 → 200, 30 → 210; direcția −90, pas 10 → −200, pas 7 → −196 (pisica cu capul în jos: rotația „all around”); direcția 0 → y 140, 180 → y −140. Pornind deja la margine (x 220): 0 treceri, „Gata!” de sub braț imediat. De la 150, pas 20, „Hop!” în gură: la 170, 190, 210. „(poziția x) > 140”, pas 20 → 160 (și de la −100 → 160; de la 150 → 150, 0 treceri); „> 190”, pas 10 → 200; „> 100”, pas 30 → 120 (de la −200 → 130, de la 95 → 125, de la 130 → 130); „> 50”, pas 20, „Gata!” → 60; „> 80”, pas 30 → 90; „> 100”, pas 20, „Gata!” → 120. Locul gol, „= 200” cu pas 30, „> 190” cu pas −10: nu se opresc (pisica la 272 / −272, stiva cu contur galben — `blocklyStackGlowFilter`, steagul activ); Stop le oprește.
- Gesturile cu mouse-ul (L5): „repetă până când” sub „orientează-te…”; „atinge … ?” în locul în șase colțuri; ▾ › „marginea” rămâne; „mergi 10 pași” în gură → x 200; „( ) > (50)” în locul în șase colțuri, „poziția x” în prima căsuță, 140 în a doua → structura salvată corectă, x 160; un „repetă până când” GOL lăsat sub un bloc din mijloc ia în gură blocurile de dedesubt (ca „repetă”, VI/20).
Fiecare afirmație din pagină: `afirmatii.json` (A1-A28, după reparația J1: 21 PROBAT_VIU, 3 PROBAT_PAGINA, 2 CONFIRMAT_LECTIE_ANTERIOARA, 2 NESIGUR).
- La reparația J1 (`_proba\r1_live_lab.py` → `r1_live_lab.json`, gesturi de mouse și taste, textele NOI ale casetelor și ale laboratorului): pălăria din Evenimente (proiectul nou are 0 blocuri), „mergi la x … y: …” vine din paletă cu 0 și 0, „atinge marginea?” lăsat sub program rămâne bloc separat cu „marginea” și se pune înapoi fără ▾, câmpul direcției cu dublu clic → −90 → x −196; „Salvează pe calculatorul tău” = descărcarea „Proiect Scratch.sb3”, iar la ieșire browserul întreabă „Părăsești…?”.

## 6. Simulatoarele NOI (proprietar VI/21)
### `lectii\_sim\scratch-conditie.js` (`window.SimScratchConditie`, 1.0)
- Blocurile `repeta_pana` (Control, C, „repetă până când [b]”), `atinge` (Detectare, boolean, „atinge [m:cursorul mouse-ului|marginea]?”), `pozitia_x` (Mișcare, raportor), `mai_mare` / `mai_mic` / `egal` (Operatori, boolean, `[t:] > [t:50]` …). Execuția = scratch-vm: testul ÎNAINTE de fiecare trecere (`Cast.toBoolean`; locul gol = fals), un cadru după fiecare trecere; comparațiile = `Cast.compare` (numere ca numere, textul gol → comparație de texte).
- „atinge marginea?”: forma pisicii măsurată viu, 47 de unități de la centru (`CUTIE`), rotită la 0 / 90 / 180 / −90; dă exact opririle din §5 (proba: `_proba\test_conditie.js`, `oracol_independent.py`).
- Abateri spuse pe ecran: „atinge cursorul mouse-ului?” e mereu fals în pagină (nota de sub paletă); căsuța de bifat de lângă „poziția x” nu e desenată.
- API (în capul fișierului): `teste(U)`, `treceri(U)`, `conditia(P)`, `textConditie(P)`, `subPana(P)`, `dupaPana(P)`, `atingeMarginea({x,y,directie})`, `compara`, `laBool`, `CUTIE`.
### `lectii\_sim\urmarire-algoritm-cattimp.js` (`window.UrmarireCatTimp`, 1.1 — de la reparația J1: căsuțele de valori cu `inputmode="text"`, ca VI/17, pentru minus pe iPhone; API neschimbat)
- Rândurile `cât timp <condiție> execută` / `sfârșit cât timp` (și `■`, prins în `dupaBloc`, ca să nu-l fure de la „pentru” când pagina le încarcă pe amândouă — probat în ambele ordini de încărcare), cu mesaje pe ecran (fără corp, închidere rătăcită, „după «cât timp» vine o condiție”); peste 2000 de pași, mesajul de finitudine al VI/17.
- Modul `teste` al tipului `urmarire`: rândul „la început” + câte un rând pe test (condiția alege… / adevărat / fals, apoi valorile după trecere; la testul fals căsuțele rămân goale — se primesc „-” și „se oprește”) + un rând „în plus” (`inPlus`, implicit 1), care rămâne gol, ca numărul de rânduri să nu spună singur unde se oprește + „La final se afișează”.
- `teste(prog, date)`, `tabelTeste(prog, date)`, tipul `cattimpori` (`cere: 'ori' | 'teste' | 'afisari'`; poate fi 0).
- NU e în `UrmarireRepetitie.tipuriRepetitie`: modul „treceri” al VI/20 are nevoie de un contor (prima coloană = `prim.r.contor`), iar „cât timp” n-are.
### Pentru lecția următoare (VI/22: test final; VI/23: comparația)
- Scratch: VI/22 imită testul final cu blocurile de aici (ex. un pas o dată, apoi „repetă până când”); nu există bloc „repetă … până când” cu test la final în Scratch. Folosiți `tipuri:{scratch: SimScratchControl.tipuri.scratch}` și încărcați `scratch-conditie.js` după `scratch-control.js`. NU schimbați: id-urile, textele, `CUTIE`, testul înainte de trecere, evenimentele `test` / `trecere` cu `pana:true`, numele funcțiilor.
- Pseudocod: `repetă … până când …` se adaugă cu `UrmarireAlgoritm.instructiune` într-un fișier NOU; pentru tabel, notați la fel (`{faza:'inainte'}`, `{test:k, faza:'test', cond, valori}`, `{trecere:k, faza:'inceput'|'sfarsit', valori, afis}`) și scrieți un mod al vostru (sau citiți `UrmarireCatTimp.teste`, care caută doar „cât timp”). Atenție: „până când” e ȘI cuvântul blocului Scratch de azi.
- Cuvintele folosite: „test”, „trecere”, „condiția opusă”, „locul în șase colțuri”, „tabelul pe teste”, „finit”, „cele 3 întrebări” (ce apare în condiție, corpul îl schimbă, spre oprire).
- Fișierul elevului de azi: `Margine_<clasa>_<numele>.sb3` în folderul lui (programul: „atinge marginea?”, pas 7, poate direcția −90).

## 7. Pentru componenta comună (`lectii\_sim\scratch.js`, proprietar VI/18) — NU l-am schimbat
- Booleanul în locul `[b]`, lista `[m:…]` într-un bloc pus în alt bloc și raportorul în căsuța `[t:]` a unui operator (neprobate până azi) **merg**: la 390 px cu degetul și la 1280 px cu mouse-ul (`_proba\parcurge.py`: „se aprinde” la fiecare lăsare, structura corectă).
- **Judecata 1 (24.10.2026), pentru `scratch.js` 1.3 (agentul dedicat, în paralel):** câmpurile de 27×22 px și blocurile de 27 px înălțime sunt sub cei 32 px ai regulii 20 (sonnet, MAJOR); câmpul „orientează-te în direcția” primește tastele după UN clic în simulator, dar în Scratch un clic deschide cercul cu săgeata, care ia tastele — acolo trebuie DUBLU clic (probat viu la reparație: `_proba\r1_live_lab.json`, `directie_D1…D4`). Lecția nu cere în simulator scrierea în câmpul direcției.
- La 390 px zona de cod are ~133 px lățime: „repetă până când” cu „atinge cursorul mouse-ului?” în el (~400 px) iese mult spre dreapta, iar ▾ nu se vede. Se poate derula trăgând cu degetul pe un loc gol al zonei (probat, `_proba\dbg390c.py`: scrollLeft 0 → 95); pagina o spune elevului la „Încearcă” (pașii 1 și 3). Propunere pentru VI/18: pe telefon, zona de cod mai lată (paleta mai îngustă) sau scena deasupra pe toată lățimea, cu paleta și zona de cod una sub alta.

## 8. Probe (porțile)
- `test_joc.py --dir lectii/vi m3-l21` → **TRECUT** (24 de întrebări jucate; doar avertismentul așteptat „1 niveluri”) — `_proba\test_joc_out.txt`.
- `verifica_lectie.py … --fara-t1` → ultima linie **0** (S0 TRECUT, S1 0 identice, S2 6/6 aplicare/execuție, T0 0) — `_proba\verifica_out.txt`. O rulare anterioară a dat o pereche „aproape identică” (Î4 ~ P5 „Încearcă”, același text) → reformulat Î4 („Care algoritm nu e finit”); acum 0 aproape identice.
- `_proba\parcurge.py` (gesturi reale, rețeaua blocată, `ctx.close()`; de la reparația J1: 400 ms între atingerea unei căsuțe și tastare, ca un om — altfel Chromium lua a doua atingere din același loc drept dublă atingere și pierdea tastele): 390 px cu atingere (Pixel 7) + 1280 px cu mouse și taste; la fiecare exercițiu întâi greșit (respins), apoi corect; Scratch-ul construit cu DRUMUL DIN ENUNȚ (condiția trasă în locul în șase colțuri, ▾ › marginea, „poziția x” în căsuță, numere scrise, zona de cod derulată cu degetul unde trebuie); tabelele completate cu adevărat/fals → `_proba\parcurge_log.txt`. Capturile de telefon privite (`_proba\telefon_*.png`).
- `_proba\proba_pas_cu_pas.py` („Pas cu pas (doar aici)” pe soluția atelierului: 15 blocuri, 16 apăsări cu „Gata”, niciun pas gol, x 130; locul gol cu „mergi 10” în gură: rulează, pisica la 272, Stop o oprește; gura goală + locul gol: pagina nu se blochează) → 0 — `_proba\proba_pas_cu_pas_out.txt`.
- `node _proba\test_conditie.js` → 121 de probe (interpretorul „cât timp” în 3 ordini de încărcare, „■” fără să strice „pentru”, execuția „repetă până când”, „atinge marginea”, comparațiile), 0 căzute.
- `_proba\oracol_independent.py`: interpretor SEPARAT în Python + model separat al pisicii (forma 47, măsurată viu); exemplele, cheile, tabelele, variantele „care nu se oprește”, toate programele-soluție și cele greșite (2 locuri de pornire), afirmațiile din text și proba vie → **69 de verificări, 0 nepotriviri** — `_proba\oracol_out.txt`.
- Durata: la judecata 1, judecătorul opus a socotit ≈ 54,5 min (`_verificare\j_durata.py`). După reparație, cu metoda LUI (`_proba\durata_r1.py`, copia lui; schimbați doar timpii rândurilor atinse, fiecare cu motivul în fișier) → **≈ 49,6 min** — `_proba\durata_r1_out.txt`. Vezi §12, punctul H. (Socoteala veche a autorului, `durata.py`, 49,9, rămâne doar ca istoric.)
- `learninghub_date_personale.py` → vezi §11; nicio aplicație Office pornită, niciun fișier de descărcat (`curata_metadate.py` n-are ce curăța).

## 9. Imagini (`img\SURSE.json`)
- `semafor-rosu.webp` — R1717, Wikimedia Commons, CC0 (licența citită prin API-ul Commons, User-Agent neutru, `_proba\commons_semafor.txt`).
- `control-pana-cand.webp`, `atinge-marginea.webp` — capturi ale editorului viu (`_proba\live_paleta.py`, `capturi_fa.py`), decupate, cu chenar roșu.
- `program-margine.webp`, `scena-margine.webp`, `operatori-poz.webp` — REFĂCUTE la reparația J1 (`_proba\r1_capturi.py` → `live_capturi_r1.json`, `r1_capturi_fa.py`): programul pasului 1 fără „spune”, scena fără balon, iar la pasul 3 „> 190” cu „mergi 10” (programul exemplului și al casetei, nu răspunsul „Încearcă”-ului).

## 10. Laboratorul (regula 10, fără profesor)
Pe calculatorul comun, în fila Scratch: programul de la pași (casetele 1 și 3; caseta 5 e „Dacă mai ai timp”), cu „atinge marginea?” — lăsat sub program la pasul 3 — pus la loc; „spune Margine!” sub braț; alt pas (7 → x 196); „Dacă mai ai timp”: altă margine (DUBLU clic pe 90, −90 → x −196); salvat CU NUME NOU `Margine_<clasa>_<numele>.sb3` (fereastra browserului, cu „Nu (sau Anulare)” la numele colegului, sau Descărcări + Explorer: F2, Decupare, Lipire, „Se omite acest fișier”, ca la lecțiile 18-19); fila închisă. Gesturi reale mici înainte: caseta pasului 1 (Creează, limba, 5 trageri, ▾, steag), a pasului 3 („atinge” lăsat sub program, „>” și „poziția x”, 190, steag), a pasului 5, „Dacă mai ai timp” (−10, steag, Stop, 10).

## 11. Nesigur / pentru profesor
- **Notația „cât timp”** (§4): aleasă de lecție.
- „atinge cursorul mouse-ului?” lăsat din greșeală: nu am rulat-o (cursorul nu stă pe scenă în proba headless) — sfatul din caseta 1 e scris ca sfat (A7).
- Fereastra de salvare a browserului și mesajul „există deja”: neprobate azi (Chrome real nu se pornește) — scrise prudent (A21).
- VI/20 e în judecată: dacă „pentru” se schimbă, se aliniază `PENTRU_3` (pasul 2).
- Durata: ≈ 49,6 min cu metoda judecătorului opus (după tăieturile din §12); o oră cu elevi reali o confirmă sau nu. Pe telefon, construcția condiției cere derularea zonei de cod (§7): e partea cea mai grea.
- Câmpul direcției în Scratch-ul din laborator: gestul (dublu clic) e probat în Chromium headless; Chrome-ul din laborator are același motor, dar de văzut o dată la clasă.
- Tastatura iPhone pe căsuțele tabelului (`inputmode="text"`): neprobată pe un telefon adevărat.

## 12. Reparațiile după judecata 1 (24.10.2026)
Registrul, cu fiecare punct al AMBELOR judecăți (opus `_verificare\judecator1.md`, sonnet `_verificare\ab_sonnet\judecator1.md`) și starea lui: **`_verificare\registru_j1.md`** (12 puncte, A-L: 11 reparate, 1 „la componentă (1.3)”, 0 respinse). Proba pe litere: `_proba\proba_reparatii.py` → `_proba\proba_reparatii_N.txt` (ultima linie 0). Copia dinainte: `_proba\inainte_r1\`.
- **A, L (regula 5 — răspunsul nu e scris nicăieri):** imaginea de la pasul 3 arată acum programul exemplului („> 190”, „mergi 10”), iar numele testului „Încearcă”-ului nu mai spune „(poziția x) > 140” (lista testelor se vede înainte de rulare).
- **B, C, E (laboratorul și caseta pasului 1, literal):** „Nu (sau Anulare)” la „există deja”; la direcție DUBLU clic pe 90 (un clic deschide cercul, care ia tastele; „încă un clic în căsuța albă” dă 9, nu −90 — probat); pălăria din Evenimente; „mergi la x … y: …” are deja 0 și 0 într-un proiect nou.
- **F:** testele „opusul” pornesc programul elevului și chiar după prag (141, 101): alt prag nu mai primește bifa.
- **G:** căsuțele tabelului pe teste primesc minus pe telefon (`inputmode="text"`).
- **H (durata ≤ 50 cu metoda judecătorului):** caseta P5 = „Dacă mai ai timp”; P1 „Încearcă” cu „mergi 10 pași” deja în gură; atelierul fără „spune Am ajuns!”; „atinge marginea?” lăsat sub program la P3 (laboratorul îl pune înapoi, fără ▾); P4 cu primul test completat; texte scurtate → 49,6 min.
- **J, K:** captura programului pasului 1 fără „spune”; perechea = / ≠ scoasă din profil și din A13 (Scratch n-are ≠).
- **I:** proba parcurgerii cu 400 ms între atingere și tastare.

**Pentru lecția următoare (VI/22), ce s-a schimbat:** API-ul simulatoarelor e NESCHIMBAT (`scratch-conditie.js` 1.0; `urmarire-algoritm-cattimp.js` 1.1 doar cu `inputmode="text"` la căsuțele de valori). În Scratch, câmpul „orientează-te în direcția” se schimbă cu DUBLU clic (nu „clic, scrie”). Testele de tip „condiția e opusul” să pornească programul elevului și chiar după prag. Numele testelor (`ce`) se văd înainte de rulare: nu scrieți răspunsul în ele. Fișierul elevului de azi rămâne `Margine_<clasa>_<numele>.sb3` (programul: „atinge marginea?”, pas 7, poate direcția −90); laboratorul pune „atinge” înapoi, deci în zona de cod nu rămâne niciun bloc separat.

## Stratul 24.10.2026, 13:40 — scratch.js 1.3 (dirijorul)
- `scratch.js` 1.3 (instalat 13:20; raportul `_campaign/revizuire_completa_2026_09/m3_noapte_23_10/scratch_13/raport.md`): pe telefon, fiecare câmp și bloc are zona de atingere ≥ 32 px (0 ținte sub 32 px din 793, 0 suprapuneri; 810/810 atingeri reale pe ținta corectă); cu o casetă deschisă, o singură atingere pe alt câmp / bloc lucrează din prima. Desenul neschimbat; mouse-ul la 1280 neschimbat. Ce scrie mai sus despre câmpurile de 27×22 px sau „1.3 urmează” e istoric.
