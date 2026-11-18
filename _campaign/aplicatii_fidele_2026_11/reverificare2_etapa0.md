# Reverificarea 2 a Etapei 0: reparațiile rămase 1-5 (18.11.2026, 15:01–17:08)

Sunt verificatorul independent din runda de verificare 2. N-am scris și n-am reparat nimic din ce verific. Am rulat totul din nou.
Ieșirile mele sunt în scratchpad-ul meu (`%TEMP%\claude\...\scratchpad\rv2\`), nu în dosarul lucrării. În dosar am scris doar acest fișier.
Toate numerele de mai jos vin din rulările mele. Rezultatul agentului (`mutanti/rezultat.json`, 17.11, 09:17) l-am folosit doar ca termen de comparație.

**Numerele întâi. Verdictul e pe ultimul rând.**

## 1. Bancul de mutanți: o singură rulare, întreg

Comanda: `LH_IESIRE=<scratchpad>\rv2\banca python .../mutanti/mutanti.py --paralel 3`. A rulat între 15:01:46 și 16:07:04 (3918 s).
Ultima linie a fost `2`, cu codul 1 și `sub_minim = []`. Bancul are versiunea 3, cu 68 de mutanți (4 mai mulți decât la reverificarea 1: O2-08, O2-09, O3-10, O3-11).

| Oracol | Prinși / total | Neprinși (motiv) |
|---|---|---|
| O1 | 7/7 | — |
| O2 | 9/9 | — |
| O3 | 10/11 | O3-02: Subscript mutat 60 px, 20558 → 20558. E saturare: poziția e deja greșită pe simulatorul vechi. |
| O4 | 7/8 | O4-04: redenumire peste un nume existent, 4 → 4. E saturare: întrebarea diferă deja în linia de bază. |
| O5 | 7/7 | — |
| O6 | 6/6 | — |
| O7 | 6/6 | — |
| O8 | 8/8 | — |
| O9 | 6/6 | — |
| **Total** | **66/68** | fiecare oracol ≥ 5 |

- **Comparat cu `mutanti/rezultat.json` (09:17), mutant cu mutant:** am 0 diferențe. Starea, linia de bază, a doua linie de bază și numărul mutantului sunt identice la toți cei 68. Neprinșii sunt aceiași (O3-02, O4-04).
- **Proba de zgomot:** la toți cei 68, linia de bază și a doua linie de bază (fără cache) dau același număr. Pregătirea „jucarie” a rămas intactă la fiecare mutant al grupului.
- **sha256 înainte și după rulare** (identice):
  - `mutanti/banca.json`: `ddd9bc5f…59e0b4`;
  - `oracole/_jucarie/aplicatii.js`: `26b6f1d7…68c9a1`;
  - `oracole/_jucarie/poligon.html`: `bf57d09d…acd1`.
- Dosarul temporar al bancului meu s-a șters singur. În %TEMP% au rămas `lh_mutanti_5ze9e4vq` (16.11, 23:55), `lh_mutanti_xbdfhxg_` (17.11, 07:39) și `lh_mutanti_1utgf7f0` (17.11, 10:29). Nu sunt de la mine.

**Mutanți de paie: niciunul.** La cei 4 mutanți noi am verificat separat DE CE sunt prinși. Am rulat `paie.py` în scratchpad, pe o copie a sitului, cu O2 și O3 pe `lectii/vii/m1-l03`. Am comparat pe fel de diferență (`pe_fel`) linia de bază cu mutantul:

| Mutant | O2 | O3 | Ce a crescut |
|---|---|---|---|
| O2-08 (legenda grupurilor scoasă din HTML) | 285 → 320 | 20558 → 20593 | doar `grup_fara_legenda` +35, la amândouă |
| O3-10 (legenda ascunsă din CSS) | 285 → 320 | 20558 → 20593 | doar `grup_fara_legenda` +35, la amândouă |
| O2-09 (fila „Inserare (Insert)”, aria-label „Insert”) | 285 → 287 | 20558 → 20567 | `lipsa` +1 și `in_plus` +1: fila nu mai trece drept „Insert” (la O3 și `pozitie` +1) |
| O3-11 (legenda „Paragraf (Paragraph)”, lățime fixă) | 285 → 325 | 20558 → 20687 | grupul Paragraph nu mai trece drept „Paragraph”: `grup_lipsa` +2, `grup_in_plus` +2, `lipsa` +18, `in_plus` +18 |

Toate cele patru creșteri vin din defectul plantat. O3-11 era cazul periculos de la 6.b: legenda are lățime fixă și nu mută nimic. Acum e prins prin etichetă, nu prin poziție.

## 2. Reparațiile rămase 1-5 (din `reverificare_etapa0.md`, „## Reparațiile rămase”)

| # | Făcută? | Dovada |
|---|---|---|
| 1 (obligatorie) | **DA** | cod + rulare cu control negativ (mai jos) |
| 2 | **DA** | cod + mutanții O2-08 și O3-10, prinși de O2 și de O3 |
| 3 | **DA** | cod + mutanții O2-09 și O3-11, prinși + proba directă în Python |
| 4 | **DA** | paza din `porti.py` + proba ei cu control negativ + jurnalul pazei din porțile reale |
| 5 | **DA** | `referinte/README_referinte.md:124-132` |

**Reparația 1: `inventar_build.py --viu`.** Argumentul e la `inventar_build.py:1086`.
- Ce am găsit în cod:
  - `:1723-1725`: `fara_beacon_js` (sendBeacon întoarce false) și `fara_locale` = `/assets/js/prezenta.js`, `/assets/js/site-credit.js`;
  - `:1729-1739`: ruta abandonează tot ce nu e 127.0.0.1/localhost, plus cele două fișiere locale;
  - `:1746-1747`: `ctx.add_init_script(fara_beacon_js)` și `ctx.route` pe fiecare context;
  - `:1755-1756`: pe fiecare pagină se verifică `navigator.sendBeacon(...) !== false`.
- Scriptul scrie `inventar.json` și `suprafete.json` lângă el (`:42`, `:1561`, `:1685`). De aceea l-am rulat din 3 copii în scratchpad, iar `inventar.json` din D a rămas neatins (sha256 identic).
- Rezultatele (`verificare_vie.rezumat.retea`):

  | Rulare | Ce am schimbat | Timp | Cod | Rezultat |
  |---|---|---|---|---|
  | originală | nimic | 227 s | 0 | 60 de pagini; `pagini_cu_beacon_neoprit = 0`; `cereri_locale_oprite = 60` (prezenta/site-credit); `cereri_externe_oprite = 60`; 0 erori |
  | mutant A | `:1746` scos (fără pază sendBeacon; prezenta.js tot oprit, deci nimic nu pleacă spre serverul viu) | 110 s | 0 | **`pagini_cu_beacon_neoprit = 60`**: verificarea prinde pe fiecare pagină |
  | mutant B | `fara_locale` golit (paza sendBeacon păstrată) | 123 s | 0 | **`cereri_locale_oprite = 0`** (față de 60): contorul arată că prezenta.js s-a încărcat |

- În plus, inventarul produs de varianta reparată e identic, pagină cu pagină, cu `inventar.json` din D: 60/60, 0 intrări diferite. `suprafete.json` diferă doar la `generat`.

**Reparațiile 2 și 3: O2/O3.**
- Reparația 2, în `oracole/structura_lib.py`:
  - `:354-362`: `legenda_lipsa`, pentru un grup randat fără text propriu vizibil;
  - `:406`: câmpul `fara_legenda`;
  - `:623-625`: diferența `grup_fara_legenda`, la O2 și la O3.
- Reparația 3, tot în `structura_lib.py`:
  - `:254-264`: `cand_intreg`, adică textul văzut comparat întreg, fără variantele „X (Y)”;
  - `:309-338`: `eticheta_vizibila` o folosește.
- Proba directă (`python -B`): `eticheta_vizibila({"text_vizibil": ["Inserare (Insert)"], "declarata": "Insert"})` → `('Inserare (Insert)', ['inserare (insert)'], True)`. La reverificarea 1 întorcea `('Insert', [...], False)`.
- Mutanții sunt în `mutanti/banca.json`: O2-08 (`:173`), O2-09 (`:185`), O3-10 (`:297`), O3-11 (`:309`). Toți patru sunt PRINȘI în bancul meu (tabelul de la punctul 1).

**Reparația 4: porțile sitului păzite.**
- Ce am găsit în cod:
  - `oracole/porti.py:21-27` și `:65`: dosarul `porti_extra/paza_browser/` intră în PYTHONPATH;
  - `:211`: aici se setează PYTHONPATH;
  - `:234-238`: o poartă păzită care n-a păzit niciun context iese NECONCLUDENTĂ.
- `porti_extra/paza_browser/sitecustomize.py` învelește Playwright la nivel de clasă: sendBeacon întoarce false, iar prezenta.js / site-credit.js și tot ce nu e local se abandonează înaintea rutei probei. Asta acoperă și paginile deschise de pe disc (`file:`) și procesele copil.
- `porti_extra/paza_proba.py` (cod 0, ultima linie `0`):
  - cu paza: pe 4 drumuri, `prezenta 0`, `beacon False`, 0 POST și 0 cereri prezenta.js;
  - fără paza: `prezenta 1`, `beacon True`, **4 POST** și **3 cereri prezenta.js**.
- În rularea mea reală a `porti.py` (punctul 4), jurnalul pazei arată:
  - test_joc: 62 de contexte păzite, 62 de cereri prezenta/site-credit oprite;
  - controale_taiate: 345 de contexte în 6 procese, 345 de cereri oprite;
  - fereastra_mica: 7 contexte, 124 de cereri oprite.

**Reparația 5.** `referinte/README_referinte.md:124-132` spune trei lucruri:
- Paste e activ în referință fiindcă în clipboard era ceva la dump;
- O8-07 depinde de asta;
- ce trebuie făcut la un dump nou: întâi Ctrl+C, iar altfel se reverifică O8-07.

## 3. Oracolele O1–O9 pe worktree (numerele de pornire ale valului B)

Fiecare oracol a rulat o dată, cu `LH_IESIRE` și `LH_IESIRI` în scratchpad-ul meu, deci randarea s-a făcut de la zero în cache-ul meu. Contractul ieșirii (`CONVENTIE_RADACINA.md:58-59`) a fost respectat la toate:
- ultima linie e un întreg;
- ultimele 3 rânduri sunt nevide;
- codul e 0 când numărul e 0 și 1 când e mai mare.

| Oracol | Cod | Ultima linie | Timp |
|---|---|---|---|
| O1 oracol_central.py | 1 | **61** | 257,4 s (randarea) |
| O2 oracol_identic.py | 1 | **13392** | 0,7 s |
| O3 oracol_ui.py | 1 | **18546** | 0,8 s |
| O4 oracol_comportament.py | 1 | **162** | 55,0 s |
| O5 oracol_evenimente.py | 1 | **201** | 17,6 s |
| O6 oracol_sarcini.py | 0 | **0** | 1183,6 s: 809 exerciții, 2427 încercări, 0 instabile |
| O7 oracol_text_ui.py | 1 | **355** | 0,8 s |
| O8 oracol_comenzi_moarte.py | 1 | **102** | 0,5 s |
| O9 oracol_asistare.py | 1 | **48** | 1,7 s |

- O2 și O3 au crescut față de reverificarea 1: O2 de la 13389 la 13392, O3 de la 18524 la 18546. Pe fel de diferență, față de `oracole/oracol_identic.json` din 17.11 02:59: O2 are `grup_fara_legenda` +1, `lipsa` +1 și `in_plus` +1. Reparațiile 2-3 văd acum pe simulatoarele vechi lucruri pe care înainte nu le vedeau. Oracolele au devenit mai stricte, nu mai slabe.
- Celelalte numere sunt neschimbate.
- O4 confirmă și el paza rețelei: „60 cereri locale către prezenta.js / site-credit.js abandonate”.

## 4. porti.py (linia de bază, nu condiție de înghețare)

Comanda: `LH_IESIRE=<scratchpad>\rv2\or\PORTI python .../oracole/porti.py`. A durat 2086 s. Ultima linie a fost `41`, cu codul 1. Nicio poartă NECONCLUDENTĂ.

| Poartă | n (probleme) | Notă |
|---|---|---|
| test_joc | 0 | 597 s, păzită (62 de contexte) |
| controale_taiate | 0 | 1166 s, păzită (345 de contexte în 6 procese) |
| cum_fac | **41** | la fel ca pe 16.11 și 17.11; nu vine din lucrarea asta |
| fereastra_mica | 0 | păzită (7 contexte) |
| date_personale | 0 | |
| word2007_j2 | 0 | |

## 5. Înghețarea, datele personale, git

- **`python ingheata.py --arata`** (cod 0): 306 fișiere de înghețat, „repere cerute lipsă: 0”, ultima linie `0`. Am comparat lista cu discul:
  - Din zona înghețată (`oracole/`, `referinte/`, `scenarii/` și cele 9 fișiere numite) au rămas pe dinafară doar 28 de fișiere: 14 `__pycache__`, cele 4 randări din `oracole/_iesiri/` și 10 JSON-uri cu detalii (`oracol_*.json`, `porti.json`). Acestea sunt ieșiri: le scriu oracolele, iar `masoara.py` doar citește `porti.json` din `LH_IESIRE`.
  - Sunt incluse:
    - toate cele 9 oracole, `masoara.py`, `porti.py`, `porti_extra/` (cu `paza_browser/sitecustomize.py` și `paza_proba.py`), `arbore_randat.js`, `structura_lib.py`, `sim_runner.js`, `_jucarie/`;
    - cele două convenții;
    - 141 de fișiere din `referinte/` (cu `verdicte_vechi.json`) și 130 de scenarii;
    - `suprafete.json`, `api_biblioteca.md`, `inventar.json`, `mutanti/banca.json`, `mutanti/mutanti.py` și uneltele buclei.
  - Nimic din afara zonei nu intră în set. Setul e complet.
- **Numele contului Windows**, citit din `USERNAME` în cod (`nume_cont.py`, în scratchpad): 0 fișiere din 469, fără `__pycache__` și inclusiv cele ignorate de git. Am rulat de două ori, înainte și după toate rulările.
- **git** (`git -C C:/00/Projects/LearningHub_fidel status --short --untracked-files=all`):
  - `_iesiri` apare de 0 ori;
  - situl (`lectii jocuri assets cum-fac aplicatii`) are 0 schimbări;
  - singurul `M` e `.gitignore`, de dinaintea mea: reparația 3 din `verificare_etapa0.md`.
- **Fișiere schimbate în worktree de la pornirea mea** (`find -newer` față de reperul creat la 15:01:17). Sunt 4:
  - `oracole/__pycache__/porti.cpython-313.pyc` (15:01:46): e de la bancul meu, pentru că `mutanti.py` importă `porti`. Fișierul e ignorat de git și exclus din înghețare.
  - `SALVARE_18_11.md` (15:02), `STARE_ORCHESTRATOR.md` (15:03) și `runde/supliment_B_word_runda1.md` (15:03): fișiere noi scrise de orchestrator în altă consolă. Nu sunt de la rulările mele și sunt în afara zonei înghețate.
- **sha256 pe tot dosarul D**, fără `__pycache__` și `_iesiri`: cele 462 de fișiere de la pornire sunt identice la final. Apar în plus doar cele 3 fișiere ale orchestratorului.
- Office: niciun oracol nu folosește COM (grep `DispatchEx|win32com`: 0). Niciun POWERPNT/EXCEL/WINWORD n-a rulat. Probele mele n-au deschis nimic vizibil și n-au atins serverul viu.

## Recomandate (nu blochează înghețarea)

1. `inventar_build.py:1755-1756` și `:1783-1784`: verificarea sendBeacon NUMĂRĂ, dar nu oprește rularea.
   - Mutantul A a ieșit tot cu cod 0 și ultima linie 60, deși `pagini_cu_beacon_neoprit` era 60.
   - Eticheta `sendBeacon: "înlocuit (întoarce false)"` e scrisă fix și apare chiar și atunci.
   - Ar fi mai sigur un cod diferit de 0, sau o excepție, când `pagini_cu_beacon_neoprit > 0`, iar eticheta să fie calculată din contor. Fișierul nu e înghețat (`ingheata.py` nu-l cuprinde), deci se poate repara oricând.
2. `inventar.json` din D are încă blocul `verificare_vie` din rularea nepăzită de pe 16.11 (fără cheia `retea`). Conținutul celor 60 de pagini e identic cu rularea păzită, deci nu schimbă nimic din ce măsoară oracolele. Dacă vreți ca lacătul să poarte dovada rulării păzite, regenerați-l cu `--viu` ÎNAINTE de `ingheata.py`. După înghețare se poate schimba doar într-o rundă `acoperire`.
3. O3-02 și O4-04 rămân neprinși din cauza saturării, ca la reverificarea 1. O3 și O4 au oricum 10, respectiv 7 mutanți prinși.
4. Dosarele `lh_mutanti_*` vechi din %TEMP% (16-17.11, copii ale sitului) se pot șterge. Nu sunt ale mele și nu le-am atins.

## Verdictul

- Reparația obligatorie 1 e DA, dovedită cu control negativ în ambele direcții (beacon și prezenta.js).
- Reparațiile recomandate 2-5 sunt toate DA.
- Bancul întreg, într-o singură rulare, are cel puțin 5 prinși pe fiecare oracol (66/68) și e identic cu rularea agentului. Nu există mutanți de paie.
- Datele personale sunt 0. Setul de înghețare e complet (306 fișiere, 0 cerute lipsă). Nimic din worktree nu s-a schimbat din cauza rulărilor mele, în afara unui `.pyc` ignorat.

Numerele de pornire ale valului B:

| O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | porti.py (cum_fac) |
|---|---|---|---|---|---|---|---|---|---|
| 61 | 13392 | 18546 | 162 | 201 | 0 | 355 | 102 | 48 | 41 |

Verdict: GATA_DE_INGHETAT
