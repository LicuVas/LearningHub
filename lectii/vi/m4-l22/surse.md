# Lecția 22, clasa a VI-a — „Structura repetitivă condiționată posterior (cu test final)” (predare) · surse și probe

**Nu e publicată, nu e în depozit (fără commit).** Autor: VI/22, valul M4, luni 26.10.2026 (ziua). Cheia `lectie_vi_m4_l22`, unitatea VI-U3 „Algoritmi: structuri repetitive”, CS.2.1, CS.2.2, CS.2.3. Legea: `_campaign\revizuire_completa_2026_09\00_GHID_LECTII.md` (25.10.2026). Granița: `_campaign\revizuire_completa_2026_09\m4_26_10\granite\vi_l22.md`.

## 1. Documentele profesorului (au prioritate)
- `Info_Gimnaziu_2026\planificari\Proiectul_unitatii_VI-U3.md`: ora 22 = „Structura repetitivă condiționată posterior (cu test final)”, predare, „teorie, exercitii”; descriptorii „Consolidat” ai CS.2.2 și CS.2.3: „repetiții condiționate de bază (cu operatori relaționali)”, urmărite pas cu pas și reprezentate în mediul grafic interactiv.
- `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`, lecția 22, citat exact: „Aceeași problemă, rezolvată cu test final; elevii descoperă că ciclul se execută cel puțin o dată și găsesc o situație în care asta e util (validarea unui răspuns).” (r: „laborator, fișă cu situații de validare”). Unde e în pagină:
  - „aceeași problemă, rezolvată cu test final” → pasul „Cel puțin o dată: diferența față de «cât timp»” (pasul 3 din 6): aceeași problemă cu `cât timp x < 20` și cu `repetă … până când x ≥ 20`; în Scratch, pasul 6 și atelierul (aceeași problemă cu blocul singur și cu corpul deasupra);
  - „ciclul se execută cel puțin o dată” → pașii 3 și 4 („Încă un exercițiu” cu n = 4), Î1, atelierul (pornită din 150), laboratorul punctul 5;
  - „validarea unui răspuns” → pasul „Validarea: ceri din nou, până e bun răspunsul” (pasul 5 din 6), Î4, Î5. „Fișa cu situații de validare” = „Încearcă”-ul pasului 5 (fața zarului, trei seturi de date) + „Încă un exercițiu” (vârsta) + Î4 (ziua lunii).
  - „laborator” → „Acum în Scratch, la calculator” (fără profesor, fără cont).
- `Calendar_ore_VI.md` (Izvoare, 02.03.2027, nr. 22), `Calendar_ore_6A_6M.md` (Brauner, 05.03.2027, nr. 22); `data\unitati.json`; `AI_0\data\informatica_gimnaziu\curriculum.json` (clasa a VI-a, Algoritmi: „Structura repetitivă condiționată posterior”).
- Decizia dirijorului (23.10.2026, păstrată la M4, `m4_26_10\prompturi\_m4.md` nr. 3): aplicația = Scratch 3 online, în română, fără cont.

## 2. Conținutul declarat
`continuturi: ['Structura repetitivă condiționată posterior']` — copiat din `curriculum.json`. Predat și verificat:

| Partea conținutului | Pasul (Încearcă) | Întrebarea |
|---|---|---|
| forma `repetă` / corp / `până când`, ordinea pașilor, condiția de oprire | pasul 2 (de câte ori; „Încă un exercițiu”: ce se afișează) | Î2, Î4 |
| corpul cel puțin o dată; diferența față de „cât timp” pe un exemplu | pasul 3 (A / B; „Încă un exercițiu”: m deja > 0) | Î1 |
| urmărirea pas cu pas, tabelul pe treceri | pasul 4 (tabelul; „Încă un exercițiu”: n = 4) | Î2, Î5 |
| validarea unui răspuns | pasul 5 (tabelul cu date citite; „Încă un exercițiu”: alegerea condiției) | Î4, Î5 |
| în Scratch: corpul o dată + „repetă până când”, aceeași condiție | pasul 6 (simulator; „Încă un exercițiu”: alegerea programului), atelierul, laboratorul | Î3 |

Competențele: CS.2.1 (Scratch: casetele pașilor 3 și 6, „Încearcă”-ul pasului 6, atelierul, laboratorul), CS.2.2 (urmărirea: pașii 2-5, tabelele pe treceri, „Pas cu pas (doar aici)”), CS.2.3 (algoritmul cu test final reprezentat în Scratch: pasul 6, atelierul).

## 3. Ce presupun cunoscut (cu bife) și ce acopăr
| Presupun (din) | Folosit aici |
|---|---|
| ✔ algoritmul pe rânduri, „Citește”, ←, „Afișează”, rândurile mai la dreapta (VI/17, publicată) | pașii 2-5, Î1-Î5 |
| ✔ condiția adevărată / falsă, ≤ ≥ < >, ȘI, SAU (VI/17: pasul cu condițiile; „Încearcă” tabăra 10-14 ani cu ȘI) | pasul 5, Î4 |
| ✔ tabelul de urmărire, finitudinea (VI/17) | pasul 4 |
| ✔ Scratch fără cont, în română; tragerea, steagul, numerele schimbate, salvarea `.sb3`, Descărcări, F2, Decupare, Lipire (VI/18) | casetele, laboratorul (fiecare gest spus din nou, pe scurt) |
| ✔ Duplică (vin și blocurile de sub el), Șterge blocul (pleacă doar el) (VI/19) | atelierul (Duplică, în pagină), laboratorul punctul 5 (Șterge blocul) |
| ✔ blocul C, gura, brațul de jos, corpul, trecerea, tabelul pe treceri, „la început” (VI/20) | pașii 2, 4, 6 |
| ✔ „cât timp … execută … sfârșit cât timp”, testul înainte, 0 treceri; „repetă până când” din Scratch (testul ÎNAINTE, condiția opusă lui „cât timp”), locul în șase colțuri, „( ) > (50)”, „poziția x”, tabelul pe teste (VI/21) | pașii 3 și 6, atelierul |

NU apar (granița): comparația sistematică a celor trei structuri și „când o folosesc pe fiecare” (VI/23) — pagina compară „repetă” cu „cât timp” pe UN exemplu, cerut de activitatea profesorului, fără tabel cu trei coloane și fără „pentru”; schema logică / blocurile grafice ca temă (VI/24); sume, numărări, cifre (VI/25); variabilele Scratch, „dacă” în Scratch, „întreabă și așteaptă”, „răspuns”. `verifica_lectie.py` T0: 0 termeni ai lecțiilor viitoare.

## 4. Notația „repetă … până când” — **Pentru profesor**
Documentele dumneavoastră NU dau forma structurii cu test final în pseudocod. Am luat forma jocului `jocuri\algoritmi-vi` (nivelul 5, lecția 22) și a manualelor uzuale, cu cuvintele lecțiilor 20-21 (corpul mai la dreapta, „trecere”, „test”):
```
x ← 3
repetă
   x ← x + 5
până când x > 20
Afișează x
```
Simulatorul primește și forma fără diacritice („repeta … pana cand”) și „până când” scris mai la dreapta. Dacă la clasă scrieți altfel (de exemplu „execută … până când”), se schimbă doar textele și o expresie regulată din `lectii\_sim\urmarire-algoritm-pana-cand.js`.
**Condițiile de tradus în Scratch au doar > sau <** (Scratch are în Operatori doar <, > și =); lecția nu folosește trucul „x ≥ 50 = x > 49”.
**Validarea cu „Citește”:** datele unui exercițiu cu „Citește” în corp se dau ca șir („nota: 12, apoi 0, apoi 9”): fiecare „Citește” ia valoarea următoare. Alegerea e a paginii; documentele nu o descriu.

## 5. Faptele despre Scratch — probate în editorul viu (26.10.2026)
Editorul public `scratch.mit.edu/projects/editor/`, Chromium din Playwright, headless, profil temporar (context nou), fără cont, fără „Distribuie”, nimic tastat în formulare de conectare, **rețeaua doar spre `*.scratch.mit.edu`** (oprit: `www.googletagmanager.com`); Chrome / Edge reali NU s-au pornit. Metoda VI/20-21 (`_proba\live_lib.py`, copia lor cu rețeaua restrânsă): proiecte făcute din `Primul_6A_Pop.sb3` (VI/18) cu blocurile schimbate, încărcate cu „Load from your computer”, steagul; pozițiile = câmpurile de sub scenă și mașina virtuală (citită, nemodificată); ce spune pisica = evenimentul SAY; structura = project.json-ul SALVAT. Scriptul: `_proba\live_pana.py` → `_proba\live_pana.json` (0 eșuate).
- **A** „repetă până când (poziția x) > 100” cu „mergi 30” în gură, din x 150: x 150, „Gata!” la 150 — 0 treceri (testul ÎNAINTE).
- **B** cu „mergi 30 pași” o dată deasupra: x 180 (o trecere). **C** B din −200: x 130.
- **D** (pasul 6, „Încearcă”): −50, pas 40, > 90: cu corpul deasupra 110, din 120 → 160; fără corp deasupra: din 120 → 120, din −50 → 110.
- **E** (atelierul): −180, „mergi 60” + „spune Hop! pentru 1 secunde”, > 100, cu corpul deasupra: „Hop!” la −120, −60, 0, 60, 120, oprit la 120; din 150: un „Hop!”, la 210. Fără corp deasupra: din 150 → 150, niciun „Hop!”; din −180 → la fel ca cu corpul deasupra (de aceea testul atelierului pornește programul și din 150 și 101).
- **G** (gesturile casetelor, mouse): „mergi 10 pași” tras din paletă și lăsat chiar sub „orientează-te în direcția 90” → intră între el și „repetă până când” (structura salvată: gotoxy, pointindirection, movesteps, repeat_until); clic pe 10 → caseta cu „10” SELECTAT, „30”, Enter; steagul → 180. Clic dreapta pe primul „mergi 30 pași” → meniul „Duplică · Adaugă comentariu · Șterge blocul”; „Șterge blocul” → pleacă doar el, „repetă până când” urcă sub „orientează-te”; steagul → 150.
- Fiecare afirmație din pagină: `afirmatii.json` (A1-A22: 9 PROBAT_VIU, 5 PROBAT_PAGINA, 5 CONFIRMAT_LECTIE_ANTERIOARA, 2 DOCUMENTAT, 1 NESIGUR).

## 6. Extensia NOUĂ (proprietar VI/22): `lectii\_sim\urmarire-algoritm-pana-cand.js` (`window.UrmarirePanaCand`, 1.0)
Nume verificat liber în `lectii\_sim\`. Peste `urmarire-algoritm.js` (VI/17), merge cu `-repetitie.js` (VI/20) și `-cattimp.js` (VI/21) în orice ordine (probat: `_proba\test_pana.js`, 4 ordini). Nu schimbă nimic din ele: doar `UrmarireAlgoritm.instructiune(...)` și `UrmarireAlgoritm.mod(...)`.
- Rândurile `repetă` (singur pe rând, bloc) + corp + `până când <condiție>` (aceeași margine; primit și mai la dreapta), cu mesaje pe ecran (fără corp, fără „până când”, „până când” rătăcit, „după «până când» vine o condiție”); peste 2000 de pași, mesajul de finitudine al VI/17.
- „Citește” înregistrat din nou (același tip `cit`, aceeași formă, același jurnal): cu `date:{n:[…]}` fiecare execuție ia valoarea următoare; cu valoare simplă, exact ca VI/17 (probat: același text în jurnal).
- `treceri(prog, date)`, `tabelTreceri(prog, date)`, `dateText(date)`, modul `pana` al tipului `urmarire` (rând „la început” + un rând pe trecere: valorile de după corp, ce se afișează, testul; rânduri „în plus” goale, ca numărul de rânduri să nu spună singur unde se oprește), tipul `panaori` (`cere:'ori'|'afisari'`). API-ul complet: capul fișierului.
Scratch: fără bloc nou (Scratch n-are un bloc cu test final; un bloc inventat ar minți — regula 9). Pagina folosește `scratch.js` 1.4 + `scratch-control.js` 1.1 + `scratch-conditie.js` 1.0, neschimbate.

### Pentru lecția următoare (VI/23: comparația celor trei)
- Încărcați `urmarire-algoritm.js`, apoi `-repetitie.js`, `-cattimp.js` și `-pana-cand.js` (orice ordine): toate trei structurile rulează în același interpretor (probat în `test_pana.js`: „cât timp + repetă în același algoritm”). NU schimbați: numele rândurilor (`repeta`, `pana`, `cit`), forma lui `treceri()` (`randuri:[{k, valori, afis, cond}]`, `treceri` = numărul de teste), modul `pana`, tipul `panaori`, mesajele.
- Scratch: testul final se face cu „corpul o dată deasupra lui «repetă până când»”; condiția rămâne ACEEAȘI ca în caiet (nu se întoarce). Modelul de test pe comportament al atelierului: `testFinal`, `condCaInCaiet` (condiția citită cu SimScratch, pe valori din jurul pragului), pornirea din alt loc (`dinX`) — în `index.html`.
- Cuvintele folosite: „test final”, „cel puțin o dată”, „condiția de oprire”, „validarea”, „tabelul pe treceri”, „corpul o dată deasupra”.
- Fișierul elevului de azi: `Final_<clasa>_<numele>.sb3` în folderul lui (programul: pornire din −200, „mergi 30 pași” deasupra lui „repetă până când (poziția x) > 100”, cu „mergi 30 pași” în gură; x 130).

## 7. Pentru componenta comună — NU am schimbat nimic
- `scratch.js` 1.4 (VI/18): la 390 px, după Duplică cu degetul pe primul bloc din gura unui „repetă până când”, copia (două blocuri) apare lângă program PESTE gura lui (`_proba\dbg_dup390.png`); se trage fără probleme (proba 390: lipită din prima), dar un copil o poate lua drept parte din program. Propunere pentru proprietar: deplasarea copiei mai jos/mai la dreapta când ar acoperi alt bloc. Nimic de schimbat în lecție.
- **STRAT 26.10.2026 (r1), pentru proprietarul `scratch.js` (VI/18):** în editorul viu, cu mouse-ul (Chromium headless, Playwright), copia de la Duplică NU a venit după mouse: a apărut lângă program, peste brațul de jos al lui „repetă până când”, iar a doua copie a acoperit-o parțial pe prima (`_proba\live\r1_L4_doua_copii.png`, `_proba\r1\r1_live_atelier.json`). Simulatorul (1.4) face copia să vină după mouse „ca în Scratch”. Ghidul VIII.I spune deja „copia poate să nu vină după mouse”; aceasta e încă o dovadă. Lecția nu depinde de asta: enunțul, ajutorul și mesajul spun „stă pe loc? o tragi”, iar mesajele de stare acoperă copia nelipită și copiile una peste alta. Tot ce ar trebui schimbat la componente stă aici; `scratch.js`, `scratch-control.js`, `scratch-conditie.js` și `urmarire-algoritm*.js` vechi au rămas neatinse.

## 8. Probe (porțile) — ultimele, pe versiunea finală
- `test_joc.py --dir lectii/vi m4-l22` → **TRECUT** (22 de întrebări jucate; doar avertismentul așteptat „1 niveluri”) — `_proba\test_joc_out.txt`.
- `verifica_lectie.py … --fara-t1` → ultima linie **0** (S0 TRECUT, S1 0 identice, S2 6/6 aplicare/execuție, T0 0) — `_proba\verifica_out.txt`. O rulare anterioară a dat o pereche „aproape identică” (Î2 ~ „Încearcă”-ul pasului 2) → Î2 refăcut (afișările în corp).
- `_proba\parcurge.py` (servit local, `_proba\server_local.py`; rețeaua blocată, `ctx.close()`): 390 px cu atingere (Pixel 7, CDP) + 1280 px cu mouse și taste; la fiecare exercițiu întâi greșit (respins), apoi corect; Scratch-ul construit cu DRUMUL DIN ENUNȚ („mergi” tras între blocuri, „( ) > (50)” în locul în șase colțuri, „poziția x”, numere scrise, Duplică pe primul bloc din gură, cu degetul: copia trasă sub „orientează-te”); tabelele completate; diploma cu 3 stele → **0 probleme**, 0 erori în consolă — `_proba\parcurge_out.txt` (ambele ecrane, rularea finală). Capturile de telefon privite (`_proba\telefon_*.png`).
- `node _proba\test_pana.js` → 173 de probe, 0 căzute (extensia, 4 ordini de încărcare, VI/17/20/21 neschimbate).
- `_proba\oracol_independent.py`: interpretor SEPARAT în Python + model separat al pisicii; citește configurația afișată; algoritmii, cheile, cifrele din texte, laboratorul, Scratch-ul (model = SimScratch = editorul viu) → **214 verificări, 0 nepotriviri** — `_proba\oracol_out.txt`. Proba probei: pe o copie cu două defecte plantate (o cifră din „why”, cheia unei alegeri) → 52 de nepotriviri (`_proba\oracol_mutant_out.txt`); copia ștearsă.
- `_proba\proba_mutanti.py` (testele VII ale exercițiilor Scratch): 5 programe bune (soluțiile, condiția scrisă „90 < (poziția x)”, pașii 20 + 20) trec tot; 15 mutanți (blocul singur, condiția întoarsă, altă condiție, „= 120”, corpul fără „spune”, ordinea întoarsă, corpul pus sub braț…) pică, iar PRIMUL mesaj e adevărat pentru greșeala lor → **0 probleme** — `_proba\proba_mutanti_out.txt`.
- `learninghub_date_personale.py` și „nu e în catalog”: §13.

## 9. Durata (metoda judecătorului VI/21: 100 de cuvinte/min + timpii lui de lucru)
`_proba\durata.py` (copia lui `durata_r1.py` al VI/21; rândurile de lucru sunt ale VI/22, fiecare cu motivul): 1.589 de cuvinte = 15,9 min citit + 31,5 min lucru → **≈ 47,4 min** — `_proba\durata_out.txt`. Fără „Încă un exercițiu” și fără „Dacă mai ai timp”. De cronometrat la clasă (cifra rămâne estimare).

**STRAT 26.10.2026 (reparația r1, J1-E + S4):** judecătorul opus a numărat și explicațiile de după „Corect”, variantele întrebărilor, numele testelor și nota tabelului: 2.172 de cuvinte → ≈ 52,7 min. După reparare, cu metoda LUI (`_proba\durata_r1.py` = copia `_verificare\j1_durata.py`, rândurile schimbate marcate „# R1:”, fiecare cu motivul) → **≈ 49,9 min** (110 cuv./min; 32,5 min lucru) — `_proba\durata_r1_out.txt`. **La limită: de cronometrat la clasă.** S-a tăiat doar din citit (vezi „Reparațiile după judecata 1”), niciun gest real.

## 10. Imagini (`img\SURSE.json`)
- `zar.webp` — Peter Linke, Wikimedia Commons, CC0 (licența citită prin API, User-Agent neutru, `_proba\commons_zar.json`); miniaturile candidate privite au fost șterse.
- `program-test-inceput.webp`, `x-150.webp`, `program-test-final.webp`, `x-180.webp` — capturi ale editorului viu (`_proba\live\G_*.png`), decupate cu `_proba\capturi_fa.py`, chenarele roșii puse de noi pe copie (legenda o spune). Programul din captura pasului 6 are 150 / 30 / 100; „Încearcă”-ul de sub ea cere −50 / 40 / 90 (imaginea nu dă răspunsul).

## 11. Laboratorul (regula 10, fără profesor)
Pe calculatorul comun, în fila Scratch: programul de la pași (casetele pașilor 3 și 6), pornit din −200 (x 130), salvat CU NUME NOU `Final_<clasa>_<numele>.sb3` (fereastra browserului, cu „Nu (sau Anulare)” la numele colegului, sau Descărcări + Explorer: F2, Decupare, Lipire, „Se omite acest fișier” — textul lecțiilor 18-21), „Dacă mai ai timp”: Șterge blocul de deasupra → x 150 (testul din nou înainte), nesalvat; fila închisă. Gesturi reale mici înainte: caseta pasului 3 (Creează, limba, 7 trageri, 3 numere, steag) și a pasului 6 (o tragere, un număr, steag). Pe telefon: atelierul din pagină ține loc de laborator (spus în pagină).

## 12. Nesigur / pentru profesor
- **Notația „repetă … până când”** și datele-șir la „Citește” (§4): alese de lecție.
- Fereastra de salvare a browserului și „există deja”: neprobate azi (Chrome real nu se pornește) — textul lecțiilor 18-21, scris prudent (A11).
- În Scratch-ul elevului, copia făcută cu Duplică poate să nu vină după mouse (ghidul VIII.I) — de aceea ajutorul atelierului spune „stă pe loc? trage-o”; laboratorul nu cere Duplică.
- Durata: ≈ 47,4 min pe metoda judecătorului VI/21; o oră cu elevi reali o confirmă sau nu. Caseta pasului 3 (programul construit de la zero) e partea cea mai lungă.
- Pe telefonul real (Dumbrava), Scratch-ul online nu e probat; pagina îi trimite pe elevii fără calculator la atelierul din pagină.

## 13. Siguranța (regulile 21-27)
Nicio aplicație Office și nicio fereastră pornite; nimic pe ecranul vizibil; Chromium headless (paginile lecției: servite local, rețeaua blocată, `ctx.close()`; editorul Scratch: profil temporar, fără cont, rețeaua doar spre Scratch); cereri externe doar spre Commons și dexonline (User-Agent `LearningHub-lectii/1.0 (educational site)`, fără date ale profesorului); niciun fișier de descărcat (nimic de curățat la metadate); nicio cheie de registru atinsă. „nu e în catalog” în panou: **0 înainte, 0 după** probe (doar numărul, ieșirea nesalvată). Poarta de date personale: vezi `_proba\date_personale.txt`.

## 14. Regulile ghidului verificate pe lecție
1 (T0 = 0), 2 (pașii 61-80 de cuvinte), 3 (casetele urmate literal în editorul viu: G), 4 (capturi reale / simulator), 5 (S2 6/6), 7 (`afirmatii.json`), 9 (simulatorul = editorul: §5 + oracol), 10 (casete la pașii 3 și 6 + laborator), 20 (proba 390), 23 (nimic păstrat în afara motorului), 24, 25, 27, 28-29 (mutanții: primul mesaj adevărat, teste pe rezultat), 30 (≈ 47,4 min), 31 (390 cu degetul), 33 (granița), 38 (numele fișierului cu clasa elevului).

## 15. Reparațiile după judecata 1 (26.10.2026)
Autor PROASPĂT (r1). Registrul complet, cu fiecare punct al AMBELOR judecăți (opus 0/2/5, sonnet 0/2/5 → 10 litere, 3 MAJOR + 7 MINOR, 0 respinse): **`_verificare\registru_j1.md`**. Copia dinainte: `_proba\inainte_r1\`. Capcana principală (corpul o dată deasupra, aceeași condiție) n-a fost atinsă.
- **A (MAJOR, J1-A + S1 + S6) — mesajele testelor Scratch spun starea programului** (regula 28): testul își pune mesajul când rulează (`testCuMesaj`, `mesajLoc`, `stareProg` în `index.html`). Stările numite: corpul deasupra de 2+ ori (→ „Șterge blocul” pe blocul de chiar deasupra lui „repetă”, unul câte unul), copia nelipită / copii nelipite una peste alta (→ „nu e lipit… trage-l sub „orientează-te””), blocuri sub brațul de jos, blocuri deasupra lui „orientează-te”, corpul de 2 ori în gură (găsit la reparare), nimic deasupra (→ Duplică o singură dată, cu drumul de telefon). Enunțul atelierului: „Duplică o singură dată” + „Pe telefon: ții apăsat pe „mergi 60 pași” din gură › Duplică, apoi tragi copia sub „orientează-te …””. Din indicația dirijorului NU am luat „trage una din copii înapoi în paletă (sau Ctrl+Z)” pentru copia LIPITĂ: trasă din mijlocul stivei aduce și „repetă” (VI/18; Scratch la fel), iar Ctrl+Z depinde de drum (regula 13) și lipsește pe telefon.
- **B (MAJOR, S2)** — extensia 1.1: la tabelul cu „Citește” în corp, nota și motivul spun „„Citește” ia următoarea valoare din Datele de intrare”; la tabelul de calcul rămâne „cu valorile de pe rândul de deasupra”.
- **C (MAJOR, J1-B)** — „altfel”-ul pasului 6: „Am terminat?” (da = te oprești).
- **D, E, F (MINOR)** — „La „cât timp” o întorceai; aici n-o întorci.”; caseta pasului 3 fără „ca „cât timp”” alăturat („…deci se oprește”); mesajele numesc locul („chiar deasupra… imediat sub „orientează-te …””, „în gură rămâne unul singur”).
- **G (MINOR, S5)** — „de câte ori” primește „de 3 ori”, „trei”, „o dată”…; afișările „10-7-4-1”, „10 si 7 si 4 si 1”; mesaje adevărate pentru ce nu e număr (`_proba\r1\test_raspunsuri.js`: 140 de forme, 0 nepotriviri).
- **H, I (MINOR, regula 20)** — legătura sursei fotografiei și legăturile capturilor x 150 / x 180 au acum ≥ 32 px înălțime (stilul paginii).
- **J (MINOR, J1-E + S4)** — durata ≈ 49,9 min cu metoda judecătorului (§9, strat): m ← 50 a devenit „Încearcă”, A / B „Încă un exercițiu” (comparația e a lecției 23); „why”-uri, „Ai nevoie de”, obiectivul, nota tabelului, nota de sub paletă și câteva propoziții din „Uite cum” scurtate. Laboratorul NU s-a schimbat (drumul lui literal, probat viu de judecător, rămâne valabil).

**Probele reparației:** `_proba\proba_reparatii.py` → `_proba\proba_reparatii_3.txt`: 112 verificări pe litere (A-J), la 390 cu degetul și la 1280 cu mouse și taste, rețeaua blocată, fiecare drum cu contextul lui închis cu `ctx.close()` → **0 probleme** (`proba_reparatii_1.txt` = prima rulare: gesturile probei lăsau copia în alt loc, zona de cod derulată; `_2` = după repararea probei). Editorul viu (`_proba\r1\r1_live_atelier.py` → `r1_live_atelier.json`, headless, profil temporar, fără cont, rețeaua doar spre Scratch): L1 Duplică aduce ambele blocuri, stiva de 2 blocuri intră între „orientează-te” și „repetă”, x 120 + cinci „Hop!”; L2 „Șterge blocul” × 2 pe blocul de chiar deasupra lui „repetă” → corpul o dată; L3 copia de sub braț, trasă sub „orientează-te”, vine cu blocul de sub ea; L4 copiile nelipite nu pornesc la steag (din 150: x 150, niciun „Hop!”; una lipită: x 210, un „Hop!”) → **0 eșuate**.
**Porțile, rulate ultimele:** vezi `_verificare\registru_j1.md`, capătul.

### Pentru lecția următoare (VI/23) — ce s-a schimbat
- `urmarire-algoritm-pana-cand.js` **1.1, API-ul NESCHIMBAT** (aceleași nume și forme; nimic scos). Nou: nota și motivele modului `pana` pe felul coloanei; `panaori` primește formele firești; `_intern.oriScris` / `_intern.afisariScrise` doar pentru probe. Trecut în graniță (SCHIMBAT 11:37).
- Modelul de mesaje de stare (`stareProg` / `mesajLoc` / `testCuMesaj`) stă în `index.html` al lecției, nu într-o componentă: VI/23 îl poate copia dacă are exerciții Scratch cu „corpul deasupra”.
- **STRAT 26.10.2026 (t2):** extensia **1.2, API-ul NESCHIMBAT**: „de câte ori” citește „niciodată” / „nici o dată” / „nicio trecere” ca 0 (mesajul pentru 0 treceri). Trecut în graniță (SCHIMBAT 13:24). `mesajLoc` recunoaște acum și corpul pus amestecat deasupra (vezi §16).

## 16. Trecerea după judecata 2 (26.10.2026, 0 GRAV / 0 MAJOR / 4 MINOR)
Autor PROASPĂT (t2), doar literele J, K, L, M din `_verificare\judecator2.md`; registrul: `_verificare\registru_j1.md`, secțiunea „Trecerea după judecata 2”. Copia dinainte: `_proba\inainte_t2\`.
- **J (durata)** — mesajul testului 3 al atelierului când nu e nimic deasupra: 97 → 59 de cuvinte (scos drumul cu mouse-ul, care e în enunț și în ajutor; păstrate starea, motivul, locul, Duplică o singură dată, drumul de telefon); mesajul pereche al pasului 6: 52 → 40 (scos „deasupra lui „repetă până când””, care repeta „chiar sub „orientează-te …””). Durata, metoda judecătorului 2 cu mesajele socotite pe lungimea lor (`_proba\durata_t2.py`): **49,99 min** pe jumătate, 50,12 întregi (înainte: 50,2 / 50,6). Rămâne „de cronometrat la clasă”.
- **K** — `mesajLoc`: deasupra lui „repetă până când” doar blocuri ale corpului, mai multe decât are corpul, dar amestecate (mergi, mergi, spune, spune) → „sunt 4 blocuri; … Păstrezi primul „mergi 60 pași” de sus și primul „spune …” de sub el; celelalte 2 blocuri (…) le ștergi, unul câte unul”.
- **L** — testul 3 al atelierului: „Pornită din x …” vine din prima pornire care pică (150, 101, −180); cu copia sub braț: „Pornită din x −180, pisica ajunge la x 180; în caiet, la x 120.”
- **M** — extensia 1.2 (mai sus).
