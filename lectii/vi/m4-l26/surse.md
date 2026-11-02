# VI/26 — Evaluare sumativă: structuri repetitive · surse și decizii

> **Nu e publicată, nu e în depozit (fără commit).** Autor: tura de noapte 01→02.11.2026, valul B (contractul `_campaign\revizuire_completa_2026_09\m4_noapte_01_11\contract.md`). Legea: `00_GHID_LECTII.md` (I, II, III.2, IV.2 §6-7, VI.1, VIII A-D + I). Granița: `m4_noapte_01_11\granite\vi_l26.md`. Starea autorului: `_proba\stare_autor.md`.

## 1. Programa și planul

| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul „Evaluare sumativă: structuri repetitive”, tip evaluare sumativă | `Info_Gimnaziu_2026\data\unitati.json` VI-U3 nr. 26; `lectii\plan.json` (02.04.2027) | întocmai |
| Data și numărul | `Calendar_ore_6A_6M.md` r. 34: 02.04.2027, nr. 26 (Brauner); `Calendar_ore_VI.md` r. 41: 23.03.2027, **nr. 25** (Izvoare) | pagina urmează `unitati.json` / planul (26); diferența de numerotare doar aici (ghidul S4) |
| Competențele CS 2.1, 2.2, 2.3 și descriptorii C / B / A | `Proiectul_unitatii_VI-U3.md` r. 5-35 | în `ancoraText`; descriptorii, citiți de pagină în pasul 2 (vezi §2) |
| `continuturi` | `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, clasa a VI-a, Algoritmi (r. 486-493) | cele cinci conținuturi pe care proba / pașii le cer: „Structura repetitivă cu contor” (C1, C2, Î1), „…condiționată anterior” (B1, B2, A1, Î2), „…condiționată posterior” (P3 Încearcă, Î3), „Modalități de reprezentare a structurilor repetitive prin blocuri grafice” (P3 Încă un exercițiu, Î4), „Etapele unui exercițiu algoritmic utilizând aplicația aleasă” (P4: proba din mai multe locuri, corectezi). NU declarate: „Elemente de interfață…”, „Instrumente de bază…” (VI/18) — doar folosite, nu verificate (ghidul S7) |
| Activitatea de învățare | `data\activitati_lectii_V_VI.json` r. 249-252 | citată întocmai în pasul 1, în `ancoraText` și pe diplomă: „Probă practică: rezolvarea a două probleme cu repetiție și urmărirea unui algoritm dat, pas cu pas. Cerințe pe cele trei niveluri.” Resursa: „test practic de unitate, barem pe niveluri” |

## 2. Ce a cerut profesorul și ce am ales

- **Testul unității VI-U3 și baremul NU există** în documentele profesorului: `materiale\continut\teste_sumative.json` are doar `V-U1`; `materiale\print\Saptamana1_BAREM_clasa_VI.*` e baremul evaluării inițiale (nu al unității); `materiale\antrenament\clasa_VI.md` („Antrenament online … Algoritmi: structuri repetitive”) = probleme de olimpiadă pe kilonova.ro, cu cont și limbaj de programare — NU e testul unității și nu se poate folosi la a VI-a fără limbaj (decizia limbajului e a lui Vasile, ghidul X.2 nr. 10). Deci (ghidul IV.2 §6, regula 35, decizia nr. 4 a valului M3): pagina spune cum arată proba, cu cuvintele activității, și dă o **probă de antrenament** pe regula de notare, marcată peste tot („nu e lucrarea profesorului; cerințele și punctele sunt ale paginii”, „testul exact îl primești la oră”, „E nota pe antrenament … Nota adevărată o dă profesorul”).
- **Forma probei de antrenament = activitatea**: urmărirea unui algoritm dat + două probleme cu repetiție în Scratch, pe trei niveluri. Urmărirea apare de DOUĂ ori (C1 cu contor, cu primul rând dat; B1 condiționată, singur), ca descriptorii CS 2.2 C / B („repetiții cu contor … cu sprijin, în pași ghidați” / „… repetiții condiționate de bază (cu operatori relaționali)”, independent). Problema 1 = C2 (după pașii dați, „repetă (6)”), problema 2 = B2 (singur, „repetă până când”); A1 = aceeași problemă 2 într-o situație nouă (numeri săriturile cu o variabilă), A2 = explicația, prin ALEGERE (ghidul T3: o explicație nu se punctează pe cuvinte-cheie). Pagina spune pe ecran că la oră urmărirea poate fi una singură („aici, unul la C și unul la B”).
- **Punctele pe cerințe** (ale paginii, ca la VIII/22 și VII/22): C1 20 + C2 20 = 40 · B1 15 + B2 15 = 30 · A1 12 + A2 8 = 20 · + 10 din oficiu = 100 (verificat mecanic de extensie la `configureaza` și de `oracol_independent.py`).
- **Regula notei** (ghidul IV.2 §1-2, regula 37), spusă ca la lecția 1, pasul „Lucrarea și nota ei” (VI/1 publicată): nota = punctaj : 10, la ,5 în favoarea elevului; nivelul din notă (cele cinci niveluri). Nu pomenesc regula veche, nici nota de modul (80 % + LearningHub) — lecția 1 o explică; pagina n-o spune deloc (proba e de antrenament). `verifica_regula.py` → 0, `oracol_nota_site.py` → 0.
- **Granița dintre niveluri pusă de pagină** e marcată: „La repetiții, pagina le citește așa (profesorul poate cere altfel)” (ghidul IV.2 §5, D2:185).

## 3. Pentru profesor

1. **Testul unității VI-U3 și baremul pe niveluri nu sunt în documente** (`teste_sumative.json` are doar V-U1). Pagina dă o probă de antrenament: C1 urmărirea unui „pentru” cu primul rând dat (20 p), C2 o problemă în Scratch după pași dați (20 p), B1 urmărirea unui „cât timp” (15 p), B2 o problemă cu „repetă până când”, singur (15 p), A1 aceeași problemă, numărând săriturile cu o variabilă (12 p), A2 explicația, aleasă dintre patru (8 p). Le confirmați sau ne dați testul și baremul?
2. **„urmărirea unui algoritm dat”**: la oră e un singur algoritm? Pagina dă doi (unul la C, unul la B), după descriptori, și o spune pe ecran. Dacă testul are unul, se scoate B1 sau se mută la C.
3. **Algoritmul dat la urmărire: în pseudocod sau ca schemă logică (lecția 24)?** Pagina îl dă în pseudocod (notația lecțiilor 20-22) și exersează schema logică doar într-un „Încă un exercițiu” și la întrebarea 4.
4. **Regula „o scăpare se pedepsește o singură dată” la tabel** (după judecata 1, o singură regulă, pe toate drumurile): greșeala de pe un rând — un calcul, o oprire prea devreme ori prea târziu — costă doar rândul ei; rândurile de după și „La final”, făcute bine din ce a scris elevul, își primesc punctele, dacă tabelul are măcar un rând bun (ghidul IV.2 §7). Așa notați și la lucrare? Dacă nu, se schimbă pasul 3 („Ai greșit pe un rând: … pierzi doar rândul greșit”) și extensia (`unRandBun`).
5. **Explicația de la A**: la lucrare elevul o scrie; în pagină o alege (pagina nu poate citi ce scrie). Pagina o spune.
6. **Ce rămâne la elev**: `Proba_<clasa>_<numele>.sb3` (problema 2) în folderul lui; punctajul și nota pe antrenament în caiet. Vreți fișierul predat altfel?
7. **Timpul**: drumul obligatoriu ≈ 49,7 min (metoda judecătorului 1, copia scriptului lui cu rândurile atinse schimbate; 54,5 la un cititor mai încet) — la limită, **de cronometrat la clasă** (2-3 elevi). Dacă nu încape, laboratorul (salvarea) poate rămâne pentru ora următoare.

## 4. Ce presupun cunoscut (din lecțiile publicate) — și ce acopăr

| Presupus | Unde s-a predat | Folosit aici | Bifă |
|---|---|---|---|
| Părțile C / B / A, oficiul, nota = punctaj : 10, ,5 în favoare, nivelul din notă | VI/1, pasul „Lucrarea și nota ei” (+ pasul despre nivel) | P2, panoul probei, Î5 | ✔ |
| Algoritmul pe rânduri, condițiile < ≤ > ≥ = ≠, tabelul de urmărire, proba la prag | VI/17 (P4-P6) | P3, P4 („departe de prag, la prag, după el”), C1, B1 | ✔ |
| Scratch online fără cont, limba română, salvarea `.sb3`, „Nu (sau Anulare)” | VI/18 (P2, P6), VI/22 laboratorul | laboratorul | ✔ |
| Etapele unui exercițiu algoritmic | VI/19 P4 „Etapele unui exercițiu algoritmic” | P4 | ✔ |
| „repetă (10)”, gura, brațul de jos; „pentru i ← 1, n execută … sfârșit pentru”; tabelul pe treceri | VI/20 P2, P5, P6 | C1, C2, Î1 | ✔ |
| „cât timp … execută … sfârșit cât timp”; tabelul pe teste; „repetă până când” (testul înainte, condiția opusă), „poziția x”, „( ) > (50)” | VI/21 P2-P5 | B1, B2, A1, P4 Încearcă, Î2 | ✔ |
| „repetă … până când …” (test final, cel puțin o trecere), tabelul pe treceri cu test | VI/22 P2-P4 | P3 Încearcă, Î3 | ✔ |
| Regula alegerii (citată întocmai) | VI/23 P5 (în judecată) | P5 (Uite cum), P5 Încearcă, A2 | presupus (granița VI/23, SCHIMBAT 01:28) |
| Schema logică, „cât timp” desenat (rombul înaintea corpului) | VI/24 P2-P5 (în judecată) | P3 Încă un exercițiu, Î4 | presupus (granița VI/24, API FINAL 00:05) |
| Variabila în Scratch (Creează o variabilă, setează, modifică, caseta), steagul nu golește variabila, numărarea | VI/25 P2 (în judecată) | P5, A1, laboratorul 6 (opțional) | presupus (granița VI/25, COMPLETAT 23:57 + SCHIMBAT 01:14) |

**Notația de pseudocod** = a lecțiilor publicate: `pentru i ← 1, n execută` / `sfârșit pentru` (VI/20), `cât timp … execută` / `sfârșit cât timp` (VI/21), `repetă` / `până când …` (VI/22), corpul cu 3 spații, `Început` / `Sfârșit` la algoritmii întregi — verificată prin interpretoarele publicate (ele refuză altă formă).

## 5. Harta probei de antrenament (item → parte / puncte → ce cere → testele → unde s-a predat)

| Item | Parte · puncte | Simulator (neatins) | Ce cere | Testele (puncte) | Unde s-a predat |
|---|---|---|---|---|---|
| C1 | C · 20 | `urmarire-algoritm-repetitie.js` (VI/20), modul „treceri” | tabelul pe treceri pentru `s ← 20; pentru i ← 1, n: s ← s - i`, n = 4, prima trecere dată | trecerea 2 (5), 3 (5), 4 (5), „La final” (5); o scăpare se pierde o dată | VI/20 „Urmărești contorul în tabel, trecere cu trecere” (p6) |
| C2 | C · 20 | `scratch.js` + `scratch-control.js` | după pașii dați: „repetă (6)” cu „mergi 40 pași” + „spune Pas! 1 s”, apoi „spune Gata!” | de 6 ori „Pas!” (5); câte 40 la fiecare (5); „Gata!” o dată, după ultimul „Pas!” (5; cere măcar un „Pas!”); pasul într-un bloc de repetiție (5) — fiecare greșeală pică un singur test; contează doar programul de la steag | VI/20 „Blocul „repetă”: ce pui în gura lui se repetă” (p2) |
| B1 | B · 15 | `urmarire-algoritm-cattimp.js` (VI/21), modul „teste” | tabelul pe teste pentru `k ← 0; cât timp n ≥ 4: n ← n - 4; k ← k + 1`, n = 10, singur | testul 1 (4), 2 (4), 3 (4), „La final” (3); un rând în plus, fără puncte (`inPlus: 1`) | VI/21 „Urmărești testele, în tabel” (p5) |
| B2 | B · 15 | `scratch.js` + `-control` + `scratch-conditie.js` | din x −170, câte 40 până trece de x 80, apoi „Stop!”, singur | din −170 la 110 (5); din 90 niciun pas (4); din 80 un pas, la 120 (3, pragul); „Stop!” o dată, la capăt (3) — testele 2-4 se socotesc doar cu o repetiție cu „mergi” în gură (lucrul cerut: pornirea nu ia puncte) | VI/21 „Capcana: în Scratch, condiția e pe dos” (p4); VI/17 proba la prag (p6) |
| A1 | A · 12 | + `scratch-variabile.js` (VI/25) | problema 2 (pusă deja) numără săriturile în k | k = săriturile făcute, din −170 (5); din 90, k = săriturile (3; cere „modifică k”); k rămas 5 → tot de la 0 (4) — testele lui k cer programul oprit și variabila k folosită; PAZĂ −4: mersul problemei 2, din −170 (x 110, „Stop!”) ȘI din 90 (pe loc) | VI/25 „În Scratch: o variabilă care ține socoteala” (p2) |
| A2 | A · 8 | alegerea extensiei | de ce „repetă până când” și nu „repetă (7)” (4 variante, prima aleasă) | 8 sau 0 | VI/23 „Regula alegerii: trei întrebări, în ordine” (p5); VI/21 (testul înainte) |

- **Variante-soră, nu copii**: `verifica_lectie.py` S1 → 0 identice, 0 aproape identice. Numerele probei sunt altele decât ale atelierelor și laboratoarelor VI/19-25 (ex. VI/24 laborator: −150, 40, > 100; VI/23: −200, 50, > 90; VI/22: −180, 60, > 100; aici −170, 40, > 80 și −150, 40 × 6).
- **Itemul A e cinstit**: A1 cere doar „setează” / „modifică” (exersate la VI/25), într-o situație nouă (numeri trecerile unei repetiții condiționate, nu valori cu o proprietate); A2 cere regula alegerii (VI/23) aplicată pe problema 2.
- **Un test = o greșeală** (ghidul IV.2 §7): probat în `_proba/proba_logica.py` și `_proba/proba_reparatii.py` — C2 cu 5 în loc de 6 pierde 5 p; B2 cu „> 79” pierde doar pragul (3 p); A1 fără „setează k la 0” pierde 4 p; A1 cu „mergi 30” sau „mergi 20” pierde doar paza (4 p); A1 cu „repetă (7)” pierde paza (din x 90 pisica pleacă). **Pornirea nu ia nimic**: programul de pornire neatins, mutat, cu un bloc liber sau cu lucrul cerut lăsat liber = 0 la C2, B2, A1 (martorul din `proba_reparatii.py`, [C]).

### Pașii și întrebările → lecția și pasul

| Sarcina | Ce cere | Predat la |
|---|---|---|
| P2 Încearcă (nota lui Dan) / Î5 (nota Ioanei) | socoteala notei, nivelul | VI/1 „Lucrarea și nota ei” |
| P3 Uite cum + Încearcă | tabelul pe teste / pe treceri cu test final | VI/21 p5, VI/22 p4 |
| P3 Încă un exercițiu / Î4 | schema logică „cât timp”: de câte ori / ce se afișează | VI/24 p3, p5 (presupus) |
| P4 Încearcă / Încă un exercițiu | din ce loc de pornire nu se vede greșeala (socoteala) / în Scratch: proba din trei locuri, condiția reparată | VI/17 p6, VI/19 p4, VI/21 p2-p4 |
| P5 Încearcă | alegerea structurii, cu motivul | VI/23 p5 (presupus) |
| Î1 / Î2 / Î3 | de câte ori se execută corpul la „pentru”, „cât timp”, „repetă … până când” | VI/20 p5, VI/21 p3, VI/22 p3 |
| Laboratorul | problema 2 în Scratch real, proba din 3 locuri, salvarea | VI/18 p6, VI/21-22 laboratoarele |

## 6. Simulatoarele și extensia lecției

- **Folosite, neschimbate**: `scratch.js` 1.4 (VI/18), `scratch-control.js` 1.1 (VI/20), `scratch-conditie.js` (VI/21), `scratch-variabile.js` 1.1 (VI/25), `urmarire-algoritm.js` 1.2 (VI/17), `-repetitie.js` (VI/20), `-cattimp.js` (VI/21), `-pana-cand.js` 1.2 (VI/22), `schema-logica.js` 1.0 (VI/24). `git diff --stat` pe ele: gol (de verificat la predare).
- **NOU**: `lectii\_sim\eval-repetitii-vi.js` 1.1 (1.0 până la reparația după judecata 1; `window.EvalRepetitiiVI`), proprietar VI/26; nume verificat liber în `_sim\` și în granițele VI/23-25 (02:19). Model: `editorweb-proba.js` (VIII/22). API:
  - `configureaza({oficiu, parti, itemi})`; `punctat(tipulDeBază, 'tabel'|'scratch'|'alege')` → tipul pentru motor; `alegere`; `nota(p)`, `nivel(n)`; `stare()`; `laSteag(P)` (1.1: scripturile care încep cu „când se dă click pe ⚑”); `cuStart(P, x)` (copia programului cu alt x în primul „mergi la x … y” al FIECĂRUI script cu steag; blocurile libere rămân cum sunt); `ruleazaDin(P, x, {variabile})` → `{x, y, spuse, variabile, terminat, U}` (rulare fără ecran, prin `SimScratchVariabile.ruleaza`); `_intern` (pentru probe).
  - Q = forma tipului de bază + `proba:'C1'`; la Scratch `teste[i].puncte / ceInainte / pazaDupa / lectia`; la tabel `puncte:{k: p, fin: p}` + `urmareste:{mod, inainte, corp, cond, contor, fin}` (cum se calculează un rând din rândul elevului de deasupra).
  - Punctele la PRIMA verificare; bifele, numărătoarea, motivele și indiciul ascunse până atunci; „neatins” nu socotește; „Arată-mi răspunsul” înainte = 0; nimic în localStorage / pe server; semnul `sessionStorage['erv6_proba_golita']` (fără date); „Sunt alt elev / Încep din nou” și evenimentul `prezenta` golesc proba.
  - **„Dus mai departe”** (tabel, 1.1 — o singură regulă): rândul greșit (un calcul, o oprire prea devreme ori prea târziu) pierde punctele lui; rândurile de după și „La final” se judecă și față de rândul ELEVULUI de deasupra (drumul lui: valorile, oprirea, continuarea lui) și își primesc punctele dacă tabelul are măcar un rând bun cu puncte (rândurile goale de după oprirea elevului nu se socotesc aici). Un tabel scris la întâmplare nu ia nimic copiind ultima valoare (0/20), iar „fals” la primul test + „La final” 0 nu ia nimic (0/15). `_intern.dusMaiDeparte` → `{k, fin, pasiv}`.

### Pentru lecția următoare (VI/27, „Aplicația de animație grafică…”)
- Lecția 27 deschide unitatea VI-U4; nu are nevoie de VI/26. Ce rămâne la elev: `Proba_<clasa>_<numele>.sb3` (problema 2) și, în caiet, punctajul și nota pe antrenament. Vocabularul VI/27 (animația) nu apare aici.
- Extensia `eval-repetitii-vi.js` poate fi folosită de alte evaluări cu tabel de urmărire sau Scratch (API mai sus), fără s-o schimbe.

## 7. Faptele — probate

Toate în `afirmatii.json` (24 la autor; **28 după judecata 1**: A25-A28 PROBAT_VIU noi, `_proba/r1_live.py` → `r1_live.json`, 0 nepotriviri din 16; A13, A15, A20-A22 la zi). Cele 24 ale autorului, toate cu felul dovezii: 5 PROBAT_VIU (editorul public, `_proba/live_proba.py` → `live_proba.json`, 0 nepotriviri, rețeaua oprită doar spre www.googletagmanager.com), 7 PROBAT_PAGINA, 3 DOCUMENT_PROFESOR, 7 CONFIRMAT_LECTIE_ANTERIOARA, 2 PRESUPUS_VECIN (regula alegerii VI/23, schema VI/24). Nicio afirmație nouă despre o aplicație în afara celor probate viu azi sau de lecțiile publicate.

## 8. Durata (metoda judecătorilor: 110 cuvinte/min + lucrul cronometrat)

**După judecata 3 (02.11.2026) — supapa, abatere de la S46:** „Cum lucrezi” spune „Când mai sunt 5 minute, salvează, apoi treci la întrebări (le poți face și acasă).” Ghidul (S46) cere „Când mai sunt 10 minute din oră”; **abatere de la S46, cu motivul:** plasa laboratorului e la minutul 35 (13 + 22, cifrele măsurii) și laboratorul ține cam 10 minute, deci cu supapa la 10 minute laboratorul s-ar tăia la 5 minute (35 + 10 = 45 → 40). La 5 minute rămân întrebările (3,4 min la măsură; „le poți face și acasă”). „salvează” e pus pentru că, la măsura judecătorului 3, copilul obișnuit e chiar la salvarea laboratorului (Fișier › Salvează pe calculatorul tău, laboratorul 4-5) pe la minutul 45: fără el, supapa „treci la întrebări” putea lăsa fișierul nesalvat. Fraza are tot 15 cuvinte (durata la limită, 50,0). **Confirmat de dirijor (02.11.2026, 09:41)** (abaterea; cealaltă cale era „10 minute” cu laboratorul tăiat). Laboratorul încă nu are supapa lui (S46 o cere „și în laborator”; vechi, de dinainte de t2, trecut de judecătorul 3 la „de trecut separat”).

**După judecata 2 (02.11.2026):** copia NESCHIMBATĂ a scriptului judecătorului 2 (`_proba/t2/j2_durata.py`, rulată de `_proba/t2/ruleaza_j2.py`) → **50,0 min**, cât la judecata 2: trecerea t2 n-a adăugat cuvinte pe drumul obligatoriu (eticheta testului 4 de la B2 și „Cum lucrezi” au același număr de cuvinte; mesajele noi apar doar la greșeală). „Cum lucrezi” spune acum cifrele măsurii: 5 pași (cam 13 minute), proba (cam 22), laboratorul (cam 10), apoi 5 întrebări; plasa: „Au trecut 35 de minute din oră? Treci la laborator…” (înainte: 32, când copilul obișnuit nu terminase proba, deci pleca fără notă) și „Când mai sunt 5 minute din oră, treci la întrebări” (înainte: 10 — cu laboratorul pornit la 35, i-ar fi rămas doar 5 minute). **Tot la limită: de cronometrat la clasă.**

**După judecata 1 (02.11.2026):** metoda judecătorului 1, cu COPIA scriptului lui (`_proba/j1_durata_r1.py`, făcută de `fa_durata_r1.py`; schimbate doar rândurile atinse, cu motivul în fișier: P4 „Încearcă” 2,5 → 0,5 min, Scratch-ul lui fiind acum „Încă un exercițiu”; B1 2,0 → 2,1 min, rândul în plus): **2.355 de cuvinte = 21,4 min + 28,3 min gesturi = 49,7 min** (54,5 la 90 cuv./min). Copia NESCHIMBATĂ (`_proba/j1_durata.py`): 51,6 (numără încă Scratch-ul P4). Tăiat doar text (intro-ul atelierului, enunțul C2, P1, P3, P4, P5, „De ce”-uri, intro-ul laboratorului); gesturile reale ale laboratorului au rămas toate. **La limită: de cronometrat la clasă.** Înainte de judecată (autorul): `_proba/durata.py` → `durata_out.txt`: 2.403 de cuvinte pe drumul obligatoriu (cu toată proba, „De ce”-urile, panoul, laboratorul fără „Dacă mai ai timp”, întrebările) = 21,8 min + lucru 27,6 min = **49,4 min** (49,45; 51,6 la 100 cuv./min). **La limită: de cronometrat la clasă** (2-3 elevi). Tăieri făcute (54,3 → 49,4): fără caseta „Acum în Scratch” de la pasul 4 (Scratch se deschide la laborator, punctul 1), P3 cu prima trecere dată, B1 cu n = 10, texte scurtate; gesturile probei și ale laboratorului au rămas toate. Plasa: „Au trecut 32 de minute din oră? Treci la laborator…”, „Când mai sunt 10 minute din oră, treci la întrebări”. Textele pașilor: 81 / 91 / 83 / 80 / 93 de cuvinte (plafon 110); „Uite cum” 0 / 52 / 65 / 57 / 65.

## 9. Porțile autorului (ultima rulare: vezi `_proba/stare_autor.md`)

- `test_joc.py --dir …\lectii\vi m4-l26` → TRECUT (`_proba/test_joc_out.txt`; „1 niveluri” e obișnuit).
- `verifica_lectie.py index.html --fara-t1` → 0 (S0 TRECUT, S1 0 identice, S2 4/5 aplicare, T0 0).
- `parcurge.py` (gesturi reale, rețeaua blocată, `ctx.close()`): 390 px cu atingere → 0 probleme, proba 100 p / nota 10; 1280 px cu mouse și taste, cu greșeli întâi → 0 probleme, proba 84 p / nota 8; 0 erori în consolă; capturile de telefon privite (`_proba/telefon_*.png`).
- `proba_logica.py` → 0 · `oracol_independent.py` → 0 · `live_proba.py` → 0.
- `verifica_regula.py` → 0 · `oracol_nota_site.py` → 0 · `learninghub_date_personale.py` → (la predare) · `activitate.py lista | grep -c "nu e în catalog"`: 0 înainte (02:27) și după.

## 10. Ce n-am putut verifica

- Ferestrele browserului adevărat la salvare (Chrome / Edge reali nu se pornesc noaptea): cuvintele din laboratorul publicat VI/22; „Se omite acest fișier” rămâne prudent (ghidul VIII.I).
- Scratch real pe telefon (laboratorul e pentru calculatorul din laborator; pe telefon, atelierul ține loc de laborator — pagina o spune).
- Regula alegerii (VI/23), schema logică (VI/24), variabilele (VI/25): lecții în judecată în noaptea asta; le-am citit de pe disc și din granițe; de reverificat după publicarea lor (formularea regulii, simbolurile schemei, numele „Creează o variabilă” / „setează” / „modifică”).
- Licența fotografiei: verificată la V/2 (27.09.2026); n-am deschis Commons azi.

## 11. Pentru componenta comună

- Câmpul numeric din blocul „repetă” are 28 × 22 px la 390 px (`scratch.js` publicat, proprietar VI/18; sub 32 px, regula 20): semnalat de judecătorul sonnet la VI/26, nereparat aici (componenta nu e a lecției).
- La 390 px zona de cod are 133 px lățime, iar programul B2 are 256 px (`scratch.js` publicat, proprietar VI/18): un bloc lăsat aproape de capătul programului se lipește sub el (ca în Scratch) — semnalat de judecătorul 2 la VI/26, nereparat aici (componenta nu e a lecției). Lecția doar numește greșeala în mesaj („Sub repetiție și sub „spune Stop!” nu pune nimic care mută pisica…”, registrul J2, punctul K).
- Observat: în modul „treceri” / „teste” al tabelului de urmărire, componenta judecă fiecare rând față de valorile corecte, nu față de rândul elevului de deasupra; de aceea „o scăpare o singură dată” e în extensia mea, nu în componentă.

## 12. Imagini

- Doar `../../v/m1-l02/img/laborator.webp` (refolosită prin cale relativă, ca la VI/16; atribuirea sub imagine; `img/SURSE.json`). Schemele = desenate de componenta VI/24 din date; nicio imagine generată.

## 13. Decizii luate singur

1. Urmărirea pe două niveluri (C1 „pentru”, B1 „cât timp”), spusă pe ecran (§2, Pentru profesor 2).
2. A1 = aceeași problemă 2 cu variabila k (programul B2 pus deja), ca timpul să încapă și ca o greșeală la B2 să nu se plătească iar la A1.
3. Explicația A2 prin alegere (regula campaniei de la VI/16; ghidul T3).
4. „O scăpare se pedepsește o singură dată” la tabel, O SINGURĂ regulă pe toate drumurile (calcul, oprire prea devreme, oprire prea târziu, „La final”), cu gardul „măcar un rând bun” împotriva tabelului scris la întâmplare (§6; după judecata 1, punctele B și G).
5. Laboratorul = problema 2 (B2) în Scratch real, fișierul `Proba_<clasa>_<numele>.sb3`; partea A în laborator doar „Dacă mai ai timp”.
6. Fără caseta „Acum în Scratch” la pași (durata); gesturile reale sunt în laborator. După judecata 1: „Încearcă” de la P4 = alegerea cu socoteală (aplicare), Scratch-ul P4 = „Încă un exercițiu” (punctul F).
7. Supapa „Când mai sunt 5 minute, salvează, apoi treci la întrebări” — abatere de la S46 („10 minute”), cu motivul în §8 (laboratorul pornit la 35); confirmat de dirijor (02.11.2026). STRAT 02.11 (judecata 4, P): pasul 6 al laboratorului spune acum „Nu mai salva, nici când mai sunt 5 minute: ai salvat la punctul 4.” — supapa și pasul 6 nu se mai contrazic (reparat de dirijor cu propunerea judecătorului; pasul 6 e opțional, durata rămâne 50,0).

## 14. Atenție pentru judecător

- Punctajul probei: încearcă drumuri noi (tabel completat la întâmplare, doar „La final”, oprire greșită, continuare după oprire, program din copii, „repetă (7)”, condiția întoarsă, „Verifică” de mai multe ori, „Sunt alt elev”, reîncărcarea). Rezultatele mele: `_proba/proba_logica_log.txt`.
- Testele B2 / A1 pornesc programul elevului din alte locuri schimbând primul „mergi la x … y” din programul DE LA STEAG (ca elevul care schimbă numărul); blocurile lăsate libere nu contează, ca în Scratch (după judecata 1, punctul A) — un program fără „mergi la” pornește pisica de acolo.
- B2: testele 2-4 cer o repetiție cu „mergi” în gură (pornirea nu ia puncte); A1: testele lui k cer programul oprit și variabila k folosită; paza din −170 și din 90.
- Durata la limită (49,7 min, metoda judecătorului 1).
- Trimiterile spre VI/23, VI/24, VI/25 (`?vezi=pN`) duc la lecții încă nepublicate: de reverificat după publicare (`verifica_trimiteri.py`).

## 15. Regulile 22-27

- 22/24: probele de pagină doar pe 127.0.0.1, restul blocat, închise cu `ctx.close()`; editorul Scratch doar headless, profil temporar, fără cont, rețeaua doar spre scratch.mit.edu. 25: nicio aplicație pornită pe ecranul vizibil; nimic salvat în afara `_proba\`. 26: laboratorul spune „Nu (sau Anulare)” la „există deja”. 27: nume inventate (Dan, Ioana, Matei, Rob, Popescu din exemplul de nume de fișier, ca la VI/22); nicio cale cu numele contului.

## Reparațiile după judecata 1 (02.11.2026)

Registrul: `_verificare\registru_j1.md` (10 puncte, reuniunea judecății opus J1-A … J1-I și sonnet M-1 … M-5; 10 REPARATE, 0 respinse). Copia dinainte: `_proba\inainte_r1\`.

**Ce s-a schimbat în pagină**
- **A (GRAV)**: testele Scratch judecă DOAR programul de la steag (scripturile cu „când se dă click pe ⚑”), ca Scratch: un bloc lăsat liber sau programul tras în alt loc nu mai schimbă nimic; mesajele B2 / A1 se scriu din programul de la steag de acum.
- **C**: niciun test cu puncte nu trece pe programul de pornire: B2 testele 2-4 cer o repetiție cu „mergi” în gură; C2 „Gata!” cere un „Pas!”; A1 cere variabila k folosită (altfel „Nu găsesc variabila k…”), iar testul din x 90 și „modifică k”.
- **D**: A1 — paza mersului din −170 și din 90, testele lui k cer programul oprit, etichetele fără „(7)” / „k = 0”.
- **B, G**: tabelul — o singură regulă, scrisă o dată în pasul 3 și urmată de cod: greșeala de pe un rând (calcul, oprire prea devreme ori prea târziu) costă doar rândul ei; rândurile de după și „La final”, făcute bine din ce a scris elevul, își primesc punctele, dacă tabelul are măcar un rând bun.
- **E**: exemplul de la pasul 2 („A pierdut 9 puncte la C și câte 13 la B și la A”). **H**: B1 cu un rând în plus. **I**: „…până rămâne fără apă”. **J**: pasul 4, excepția („afară de cazul când cerința cere chiar un bloc”); B2: „Construiește programul, cu o repetiție”.
- **F**: P4 „Încearcă” = alegerea „din ce loc de pornire NU vezi greșeala” (aplicare, cu socoteală; valorile probate viu, A28), Scratch-ul P4 = „Încă un exercițiu”; texte strânse. Durata: §8.

**Probele, pe versiunea finală** (ultima linie 0, ieșirile în `_proba\`)
- `proba_reparatii.py` → `proba_reparatii_3.txt`: 91 verificări pe litere, 0 probleme (bateria logică; 1280 px cu mouse și taste; 390 px cu degetul; rețeaua blocată, `ctx.close()`).
- Bancul de mutanți `proba_mutanti.py` → `proba_mutanti_out.txt`: **0** — 8/8 mutanți prinși de `proba_logica.py`; VERSIUNEA VECHE (`inainte_r1`) sub `proba_reparatii.py`: 47 de probleme, toate literele A-J; 11/11 mutanți noi (A ×2, C ×4, D ×2, B, G, H) prinși la litera lor.
- Scratch VIU (editorul public, headless, fără cont): `r1_live.py` → `r1_live.json`: 0 nepotriviri din 16 (rețeaua oprită doar spre www.googletagmanager.com) (faptele noi A25-A28).
- Copiile NESCHIMBATE ale probelor judecătorilor, rulate din `_proba\` (`r1_probe_judecatori.py` → `r1_probe_judecatori_out.txt`): toate 19 au rulat. Opus: `j1_proba.py` / `j1_proba2.py` — drumurile lui dau acum C1 cu două greșeli la rând 10/20 (era 5), B1 oprit prea devreme 11/15 (era 7), B2 cu blocul liber și programul mutat, cu mouse-ul, 15/15 (era 8, cu mesaj fals), A1 pornirea mutată 0/12 cu „Nu găsesc variabila k” (era 3), „repetă (7)” 8/12 (era 12), „mergi 20” 8/12, fără „mergi” 0/12 (era 8); `j1_scratch_viu.py` → 0; `j1_durata.py` (neschimbat) → 51,6 min (numără încă Scratch-ul P4; cu rândurile atinse: 49,7); `j1_citate.py` → 5 citate negăsite = exact textele reparate (J1-A, B, E, H, I). Sonnet: `probe_gratis.py` — C2 doar „Gata!” 0 (era 5), B2 [Stop!] 0 (era 7), A1 schimbare banală 0 (era 3), „Pas!” + „Gata!” 5 (lucru început); `probe_b1b.py` — „fals” prea devreme 11 (era 7), restul neschimbat; `durata_j.py` 1.806 cuvinte (16,4 min citit); `probe_mobil.py` se oprește la „#inca” după un C1 greșit, la fel ca la judecător (în proba lui, nu în lecție). Capturile judecătorului din `_verificare\ab_sonnet\` au fost puse deoparte și la loc; cele noi: `_proba\ab_sonnet\r1_m390_*.png`.
- `proba_logica.py` → 0 · `oracol_independent.py` → 0 · `parcurge.py`: 390 px cu atingere → 0 (100 p / nota 10, 3 stele, consola goală); 1280 px cu mouse și taste, cu greșeli întâi → 0 (84 p / nota 8, 3 stele, consola goală) · `test_joc.py` TRECUT · `verifica_lectie.py --fara-t1` → 0 (S0 TRECUT · S1 0 identice · S2 4/5 · T0 0) · `verifica_regula.py` → 0 · `oracol_nota_site.py` → 0 · `learninghub_date_personale.py` → 0 · `activitate.py lista | grep -c "nu e în catalog"`: 0 înainte, 0 după.

**Pentru lecția următoare / pentru cine refolosește extensia**: `eval-repetitii-vi.js` 1.1 — API NESCHIMBAT pentru `configureaza`, `punctat`, `alegere`, `nota`, `nivel`, `stare`, forma lui Q; NOU `laSteag(P)`; `cuStart` / `ruleazaDin` schimbă „mergi la” doar în scripturile cu steag; `_intern.dusMaiDeparte` întoarce `{k, fin, pasiv}` (era `dupa`). Regula tabelului s-a schimbat (oprirea prea devreme nu mai costă și rândurile de după): o evaluare nouă care o refolosește spune pe ecran aceeași frază ca pasul 3 de aici. Granița: `m4_noapte_01_11\granite\vi_l26.md`, „SCHIMBAT 04:25”.

## Reparațiile după judecata 2 (02.11.2026, trecerea scurtă t2)

Judecata 2: `_verificare\judecator2.md` / `.json` (0 GRAV / 0 MAJOR / 3 MINOR: K, L, M). Registrul: `_verificare\registru_j1.md`, „Trecerea după judecata 2” (3 REPARATE, 0 respinse; A-J neatinse). Copia dinainte: `_proba\inainte_t2\`. Extensia `eval-repetitii-vi.js` 1.1 NESCHIMBATĂ; granița: „SCHIMBAT 05:55”.

**Ce s-a schimbat în pagină** (doar mesaje și texte; funcțiile care dau punctele, neatinse — punctele rămân ca în Scratch)
- **K**: primul mesaj numește greșeala de gest. Programul tras de „mergi la” (pălăria rămâne singură): „Programul tău nu mai e lipit sub „când se dă click pe ⚑”: la steag rulează doar ce e sub pălărie. Trage stiva de primul ei bloc și lipește-o sub „când se dă click pe ⚑”.” (C2, B2, A1). Un „mergi” / „mergi la” lipit după repetiție: „Sub repetiție și sub „spune Stop!” nu pune nimic care mută pisica: un „mergi” sau un „mergi la” lipit acolo o mută din nou. Trage-l înapoi în paletă.” (B2, paza A1; la C2 cu „Gata!”).
- **L**: B2, testul 4: „„Stop!” o dată, după ce repetiția oprește pisica”; mesajul lui, fără repetiție: „…Testul acesta se socotește după ce pui repetiția cerută („repetă până când”, din Control): „Stop!” vine sub brațul ei.”
- **M**: „Cum lucrezi”: 5 pași (cam 13 minute), proba (cam 22), laboratorul (cam 10), apoi 5 întrebări; „Au trecut 35 de minute din oră? …”; „Când mai sunt 5 minute din oră, treci la întrebări” (§8).

**Probele, pe versiunea finală** (ultima linie 0; ieșirile în `_proba\` și `_proba\t2\`)
- `proba_reparatii.py` (+ `t2_baterie`, `t2_gesturi` la 1280 cu mouse-ul și la 390 cu degetul, `t2_durata`): K — 3 stive desprinse → 0 p, cu mesajul pălăriei; „mergi la” / „mergi 40” sub „Stop!” → B2 0, A1 8, C2 (sub „Gata!”) 15, cu mesajul nou; 9 martori fără mesajul nou; cu gesturi: programul tras de „mergi la” → prima verificare 0/15, mesajul pălăriei, urmat literal (stiva trasă de primul ei bloc sub pălărie) → 4 din 4 teste, „Corect!”; „mergi la” din paletă lipit sub „Stop!” → 0/15, mesajul nou, urmat (tras în paletă) → 4 din 4, „Corect!” — la ambele lățimi. L — desfășurat 5/15, eticheta și mesajul noi, „Unde ai pierdut puncte”: „B2, 3 puncte: „Stop!” o dată, după ce repetiția oprește pisica”. M — cifrele și plasele, durata 50,0 (copia neschimbată a judecătorului 2).
- `proba_reparatii_7.txt` → 0 (140 de verificări) · `proba_mutanti.py` → 0 (15/15 mutanți, între ei K ×2, L, M, prinși la litera lor) · copiile neschimbate ale probelor judecătorului 2 (`_proba\t2\ruleaza_j2.py`): cele 2 [NOU] trec; `j2_durata.py` 50,0 · `proba_logica.py` 0 · `parcurge.py` 390 → 100 p / nota 10, 1280 → 84 p / nota 8, 3 stele · `test_joc` TRECUT · `verifica_lectie --fara-t1` 0 · `verifica_regula` 0 · `oracol_nota_site` 0 · date personale 0 · „nu e în catalog” 0 / 0. Detaliile: registrul, „Probele t2”.

## Reparațiile după judecata 3 (02.11.2026, trecerea scurtă t3)

Judecata 3: `_verificare\judecator3.md` / `.json` (0 GRAV / 0 MAJOR / 2 MINOR: N, O). Registrul: `_verificare\registru_j1.md`, „Trecerea după judecata 3” (2 REPARATE, 0 respinse; A-M neatinse). Copia dinainte: `_proba\inainte_t3\`. Extensia `eval-repetitii-vi.js` 1.1 NESCHIMBATĂ; componentele publicate neatinse.

**Ce s-a schimbat în pagină** (doar mesaje și text; funcțiile `ok`, care dau punctele, neatinse — punctele rămân ca în Scratch)
- **N** (regula 28: urmat întocmai, mesajul scoate elevul din greșeală): mesajele se scriu din programul de ACUM și numesc blocul sub care se lipește (`NUME`, ca în zona de cod). (1) Stiva trasă din mijloc, de exemplu de „repetă până când” (sub pălărie au rămas „mergi la” și „orientează-te”): „O parte din program nu mai e lipită sub „când se dă click pe ⚑”… Trage stiva desprinsă de primul ei bloc („repetă până când”) și lipește-o sub „orientează-te în direcția 90”, ultimul bloc de sub pălărie.” (la A1: sub „setează k la 0”); pălăria singură: mesajul de dinainte. (2) Pornirea ajunsă SUB repetiție (stiva lipită chiar sub pălărie s-a intercalat, V1): „„mergi la x -170 y: 0” și „orientează-te în direcția 90” sunt pornirea: stau sus, sub pălărie, deasupra repetiției; nu le trage în paletă. Trage „repetă până când” deoparte… Apoi trage „mergi la…” (vine și „orientează-te…”) și lipește-l sub pălărie. La urmă, lipește „repetă până când” sub „orientează-te în direcția 90”.” — înainte, „Trage-l înapoi în paletă” ștergea pornirea și ducea la „Corect!” fără ea. (3) Un bloc care mută pisica ÎNTRE repetiție și „spune …” (V2): „…Tras acum în paletă, l-ar lua și pe „spune Stop! pentru 2 secunde”: un bloc tras vine cu tot ce e sub el. Întâi trage „spune Stop!…” deoparte, în zona de cod; apoi „mergi la x 0 y: 0” în paletă; la urmă, lipește „spune Stop!…” la loc sub brațul de jos al lui „repetă până când”.” Faptele Scratch folosite: A29-A31 în `afirmatii.json` (probate viu de judecătorul 3, `_verificare\j3_scratch_gesturi_out.txt`). „Șterge blocul” din meniu NU e folosit (neprobat în Scratch-ul public).
- **O**: supapa „Când mai sunt 5 minute, salvează, apoi treci la întrebări (le poți face și acasă).” — abaterea de la S46, cu motivul, în §8; 15 cuvinte, cât înainte.

**Probele, pe versiunea finală** (ultima linie 0; ieșirile în `_proba\` și `_proba\t3\`)
- `proba_reparatii_10.txt` → 0 (192 de verificări; N 47, O 5): V1, V1 intercalat și V2 la C2 / B2 / A1, mesajele urmate literal pe program, și pe B2 cu gesturi reale la 1280 (mouse) și 390 (deget) → „Corect!” cu pornirea sus, punctele ca înainte (V1 0, V2 3); supapa, abaterea, durata 50,0 · mutanți `_proba\t3\proba_mutanti_t3.txt` → 0 (19/19, între ei N ×3, O) · copiile neschimbate J3: `j3_durata` 50,0, `j3_proba` 0, `j3_L` 0, `j3_a1_390` 0, `j3_regresie` = cele 2 [A] [390] vechi · `proba_logica` 0 · `parcurge.py` 390 → 100 p / nota 10, 1280 → 84 p / nota 8, 3 stele · `test_joc` TRECUT · `verifica_lectie --fara-t1` 0 · `verifica_regula` 0 · `oracol_nota_site` 0 · date personale 0 · „nu e în catalog” 0 / 0. Detaliile: registrul, „Probele t3”.

## Contradicții găsite

- `Calendar_ore_VI.md` numerotează ora 25, `Calendar_ore_6A_6M.md` și `unitati.json` 26 (§1).
- Activitatea cere „urmărirea unui algoritm dat” (unul); descriptorii C / B ai CS 2.2 deosebesc repetiția cu contor de cea condiționată — pagina dă două (§2).
