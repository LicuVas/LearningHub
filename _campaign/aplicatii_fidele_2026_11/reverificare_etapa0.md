# Reverificarea Etapei 0 — reparațiile 1-12 și 14 (17.11.2026, 05:10–06:55)

Verificator independent, runda de verificare 1. N-am scris nimic din ce verific și n-am reparat nimic. Am citit codul și am
rulat totul din nou, cu ieșirile mele în `%TEMP%\...\scratchpad\reverif\` (nu în dosarul lucrării). Am scris doar acest
fișier. Raportul agentului care a rulat bancul l-am verificat, nu l-am preluat: toate numerele de mai jos sunt din rulările mele.

**Întâi numerele, verdictul la final.**

## 1. Bancul de mutanți — o singură rulare, întreg

Comanda: `LH_IESIRE=%TEMP%\...\reverif\banca python .../mutanti/mutanti.py --paralel 3`
(05:12:31 – 06:11:46, 3554 s) → ultima linie `2`, cod 1, `sub_minim = []`. Detaliile: `%TEMP%\...\reverif\banca\rezultat.json`.
`banca.json` (versiunea 2, 64 de mutanți) și jucăria `oracole/_jucarie/aplicatii.js` au avut același sha256 înainte și după rulare.

| Oracol | Prinși / total | Neprinși |
|---|---|---|
| O1 | 7/7 | — |
| O2 | 7/7 | — |
| O3 | 8/9 | O3-02 (Subscript mutat 60 px: poziția e deja greșită pe simulatorul vechi — saturare) |
| O4 | 7/8 | O4-04 (întrebarea din dialogul de redenumire diferă deja în linia de bază — saturare) |
| O5 | 7/7 | — |
| O6 | 6/6 | — |
| O7 | 6/6 | — |
| O8 | 8/8 | — |
| O9 | 6/6 | — |
| **Total** | **62/64** | fiecare oracol ≥ 5 |

- Proba de zgomot: la toate cele 64 de mutanți, linia de bază și a doua linie de bază (randare FORȚATĂ, `LH_FARA_CACHE=1`)
  au dat același număr (ex. O1 61/61: 14,5 s / 2,7 s, a doua chiar a randat; O3 20558/20558).
- Mutanții ceruți, toți PRINȘI în această rulare:
  - O8 7a — O8-07 (Paste gri): 1 → 2; O8 7b — O8-08 (Cut cu „nu e folosit în lecția asta”): 1 → 2; plus O8-01 înlocuit (Copy mort): 1 → 2;
  - O1 rădăcină neînregistrată — O1-07: 61 → 62;
  - O2/O3 „Insert”/„Inserare” — O2-07: 285 → 287, O3-09: 20558 → 20564;
  - O4 ecran neredesenat — O4-08 (jucăria Excel): 23 → 27;
  - O9-03 (indiciul rămâne pe pasul 1): 6 → 12; O9-05 (derularea numărată ca greșeală): 6 → 12;
  - reparația 14: O2-05 (legendele grupurilor traduse pe ecran): 285 → 342; O4-07 („Nu” la Shift+Delete șterge totuși): 4 → 5.
- Pregătirea „jucarie” a rămas intactă la fiecare mutant al grupului (`pregatire_intacta: true` la O4-08, O5-01…07, O9-01…06).
- Numerele mele sunt identice, mutant cu mutant, cu `mutanti/rezultat.json` al agentului (04:33).

Mutanți de paie: niciunul. O observație la O8-07: e prins fiindcă referința PowerPoint arată Paste activ (`uia_powerpoint.json`,
Paste fără `activ:false`), iar starea lui Paste în Office real depinde de ce era în clipboard când s-a făcut dump-ul. Cu clipboard
gol, Paste e gri și în aplicația reală. Mutantul nu e de paie, dar trebuie notat în `referinte/README_referinte.md` că această
stare ține de clipboard. O8 are oricum 7 mutanți prinși fără el.

## 2. După banc: datele personale și git

- Am căutat numele contului Windows (citit din `USERNAME` în cod, nescris de mână) în tot `_campaign/aplicatii_fidele_2026_11`,
  fără `__pycache__`: 463 de fișiere, **0 fără cele ignorate de git** și **0 și cu cele ignorate** (inclusiv `oracole/_iesiri/`).
- `git -C C:/00/Projects/LearningHub_fidel status --short --untracked-files=all | grep -c _iesiri` → `0`; `.gitignore:93`
  ignoră `oracole/_iesiri/`. Situl (`lectii jocuri assets cum-fac aplicatii`): 0 schimbări.
- Niciun fișier din worktree nu s-a schimbat de la pornirea bancului (05:12) până la final (`find -newer`): oracolele și
  porțile mele n-au scris nimic în `LH_RADACINA` și nimic în dosarul lucrării.
- `oracole/_iesiri/` are acum 4 randări, niciuna cu numele contului (cele 11 de ieri au fost șterse).
- În %TEMP% a rămas `lh_mutanti_5ze9e4vq` din 16.11, 23:55. Nu e de la rularea mea, care și-a șters dosarul temporar.

## 3. Oracolele O1–O9 pe worktree, o dată fiecare (contractul ieșirii)

Fiecare oracol a rulat cu `LH_IESIRE` și `LH_IESIRI` în %TEMP%, deci randarea a fost făcută de la zero în cache-ul meu, nu
citită din cache-ul agentului. Am verificat: ultima linie e un întreg, ultimele 3 rânduri sunt nevide, iar codul se potrivește cu numărul.

| Oracol | Cod | Ultima linie | Timp | Contract |
|---|---|---|---|---|
| O1 oracol_central.py | 1 | `61` | 245,7 s (randarea de la zero) | OK |
| O2 oracol_identic.py | 1 | `13389` | 1,0 s (aceeași randare) | OK |
| O3 oracol_ui.py | 1 | `18524` | 1,1 s | OK |
| O4 oracol_comportament.py | 1 | `162` | 57,4 s | OK |
| O5 oracol_evenimente.py | 1 | `201` | 18,0 s | OK |
| O6 oracol_sarcini.py | 0 | `0` | 871,7 s (809 exerciții, 2427 încercări, 0 instabile) | OK |
| O7 oracol_text_ui.py | 1 | `355` | 1,3 s | OK |
| O8 oracol_comenzi_moarte.py | 1 | `102` | 0,8 s | OK |
| O9 oracol_asistare.py | 1 | `48` | 2,3 s | OK |

Aceleași numere ca la agent. Detalii:
- O4: `scenarii fără rezultat real probat (mod_probat=true): 12`; `0 diferențe ecran ≠ stare` (pe worktree nu există încă bibliotecă).
- O8: 396 de comenzi apăsate, dintre care 102 moarte: 97 dau doar mesajul „nu e simulată”, 4 sunt gri (deși sunt active în referință sau aplicația n-are referință), iar 1 nu are niciun efect. 11 comenzi gri sunt scuzate de referință (`activ:false`).
- O9: 48 = 8 cazuri × 6 aplicații (A, B, C, D, E, F, G, H — fără bibliotecă pică toate).

Alte rulări:
- `python .../referinte/dump_uia_office.py verifica` → `0`, cod 0;
- `python .../opreste_sim.py` → `0`, cod 0: 40 de jurnale false, 8 verificări ale promptului și 1 a unghiurilor. Printre cazuri sunt `cum_fac 41 -> 80` în rundă și de la o rundă la alta (OPRESTE, REGRES), „o poartă crește cât scade alta” (REGRES) și `41 -> 41` (CONTINUA);
- `oracol_asistare.py --autotest` (jucăria în %TEMP%) → vezi punctul 2 din tabelul de mai jos.

## 4. porti.py — rulat de mine, după banc și după O1-O9

`LH_IESIRE=%TEMP%\...\reverif\porti python .../oracole/porti.py` (06:17–06:44, 1571,7 s) → ultima linie `41`, cod 1.

| Poartă | n (probleme) |
|---|---|
| test_joc | 0 (581 s) |
| controale_taiate | 0 (771 s) |
| cum_fac | **41**, la fel ca la 23:00 pe 16.11, deci nu vine din lucrarea asta |
| fereastra_mica | 0 |
| **date_personale** | **0** |
| word2007_j2 | 0 |

Am verificat în cod că `date_personale` se calculează pe dosarul REAL. `porti.py:68-69,173` rulează
`porti_extra/date_personale_wt.py` cu `LH_RADACINA` = worktree. Acesta (`:16,26`) înlocuiește rădăcina uneltei
`C:/00/AI_0/tools/learninghub_date_personale.py`, care scanează `RAD/_campaign` (`:13`), fără să sară peste `_iesiri`. Jurnalul porții spune
`situl măsurat: C:/00/Projects/LearningHub_fidel`, iar rezultatul e `fișiere cu date personale: 0`.

## 5. Reparațiile, una câte una

| Nr | DA/NU | Dovada mea |
|---|---|---|
| 1 | **DA** | `mutanti.py:130-197`: clasa `Copie` ține pregătirea (`scrie`/`pune_la_loc`) separat de mutant (`aplica_mutant`/`scoate_mutant`). La `:229-249`, pregătirea se pune o singură dată și se verifică cu sha256 înaintea fiecărui mutant. La `:309-312` se ia înapoi o dată. Bancul întreg (o rulare, 3554 s): O5 7/7, O9 6/6, toate O1-O9 ≥ 5. |
| 2 | **DA** | `oracol_asistare.py:367-394` (G: 2 pași, greșeli în loc gol, indiciul pe T2, T1 fără indiciu), `:397-437` (H: rotița ×3 și săgeata ×3 cu `mouse.wheel`/`keyboard.press`, cer evenimentele „rotita”/„sageti”), `:497-586` (F: lecția DESCHISĂ în Chrome, asistentul prins prin înfășurarea lui `LH.aplicatii`, 2 greșeli reale; comentariul nu mai trece). Banc: O9-03 6→12, O9-05 6→12. Autotestul meu: jucăria curată 6 (doar F); lecția Explorer cu asistent jucată + Word doar cu comentariu + Paint fără asistent → 5 (F trece doar pentru Explorer); toți cei 10 mutanți ai autotestului au fost PRINȘI (ex. „indiciul după O singură greșeală” 5→30, „indiciul rămâne pe ținta primului pas” 5→11, „derularea și săgețile se numără ca greșeli” 5→11); ultima linie `0`, cod 0. |
| 3 | **DA** | `structura_lib.py:70-85` (`dir_cache`: `LH_IESIRI`, altfel `_iesiri/` doar pe worktree, altfel `%TEMP%/lh_structura_cache`); `:93-120` (căi relative în cache). `.gitignore:93`. `_iesiri/`: 4 fișiere, 0 cu numele contului. Poarta `date_personale` = **0** după bancul meu. |
| 4 | **DA** | `uia_excel.json`: niciun `TabItem` „Developer” rămas. Developer apare doar în `excluse_personal` (`:47759`, `:47777` „scoasă: profilul curat…”) și în `file_saec_neafisate` (`:48246`). `dump_uia_office.py:1663-1668` caută acum și fila din rând (`file_personale_ramase`). `verifica` → 0. În `oracol_ui.json` al meu nu există nicio diferență cu „developer” (singura apariție e în textul definiției). Notă: filele de după Developer au fost mutate la stânga prin calcul, nu re-măsurate (`:47782`). |
| 5 | **DA** | `scenarii_real/excel-separator-virgula.json:3` și `excel-autocompletare-tab.json:3`: `"mod_probat": false`. Pe ansamblu, 118 rezultate au `mod_probat: true` din 124. O4 (rularea mea): `scenarii fără rezultat real probat: 12`. |
| 6 | **DA** | `porti.py:22-33, 224-245`: `pe_poarta = {poarta: n}`, iar ultima linie e suma lui n; o poartă neconcludentă dă -1. `opreste.py:85-136` compară n cu n pe fiecare poartă (`cresteri_porti`, `porti_disparute`). `masoara.py:68-106` citește `pe_poarta`. `opreste_sim.py` → 0, cu cazurile 41→80 și „crește cât scade alta”. |
| 7 | **DA** | 7a: `oracol_comenzi_moarte.py:85-137` (o comandă gri pe ecran e judecată după referință: activă, negăsită sau fără referință = moartă). 7b: `structura_lib.py:1596-1661` (`TIPARE_NESIMULAT` + `data-lh-nesimulat`: doar mesajul „nu e simulată” = moartă). Banc: O8-07 1→2, O8-08 1→2. Pe worktree: 4 comenzi gri judecate moarte, 11 scuzate de referință, 97 cu doar mesajul. |
| 8 | **DA** | `arbore_randat.js:195-214` (rădăcină = doar `LH.aplicatii.radacini()`, și doar dacă pagina încarcă `aplicatii/aplicatii.js`), `:385-386` (rădăcina neînregistrată se numără); `structura_lib.py:769-824` (static: `data-lh-aplicatie` / `setAttribute` / `dataset.lhAplicatie` / `LH.aplicatii =` în pagină). Banc: O1-07 61→62. |
| 9 | **DA** (cu o gaură rămasă, vezi 6.b) | `structura_lib.py:285-337` (`eticheta_vizibila`: textul de pe ecran; `data-lh-eticheta` acceptată doar dacă e pe ecran, altfel `decl_dif`), `:592-599` (`eticheta_declarata` la O2 și O3), `:609-611` (același idMso, alt nume pe ecran). Banc: O2-07 285→287, O3-09 20558→20564. |
| 10 | **DA** | `sim_runner.js:185-213` (`ecran()`: textul vizibil al țintelor `text:N` / `celula:<A1>` din `[data-lh-zona]`, fără `aria-hidden`), `oracol_comportament.py:437-515` (1 diferență pe paragraf / celulă unde starea ≠ ecranul; lipsa marcajelor = diferență), `:557-562, 600`. Banc: O4-08 23→27. Nu se poate ocoli citind `text` din DOM: `celule[A1].text` e comparat și cu Excel real, care are `text` (`excel-autosum-buton.json`: `{"valoare": 15, "text": "15", ...}`). |
| 11 | **DA** | `mutanti.py:274-278` (a doua linie de bază cu `fara_cache=True`), `:207-210` (`LH_FARA_CACHE=1`); `structura_lib.py:88-90, 1825-1846` (o randare mai veche decât pornirea procesului nu e acceptată). În rularea mea, a doua linie de bază a chiar randat (O1 2,7 s pe o pagină, O2 13,3 s), iar la toți 64: bază = bază bis. |
| 12 | **NU** (parțial: 6 din 7 probe) | FĂCUT în `structura_lib.py:1228-1272` (O1/O2/O3/O7/O8), `oracol_comportament.py:96-113` (O4), `oracol_evenimente.py:101-123` (O5), `oracol_asistare.py:116-162` (O9), `sarcini_lib/joaca.py:57-65, 308-309` (O6), `porti_extra/j_comun.py:26-50` (word2007_j2). **NEFĂCUT în `inventar_build.py:1714-1725`** (`verificare_vie`, pornită cu `--viu`): are doar ruta 127.0.0.1, fără `add_init_script` pentru `sendBeacon` și fără abandonul lui `prezenta.js`/`site-credit.js` (grep: `sendBeacon` 0). E una dintre cele 7 probe numite în `verificare_etapa0.md:172-174`, iar reparația 12 cere „TOATE probele de browser”. |
| 14 | **DA** | `banca.json:138` O2-05 = legendele grupurilor traduse pe ecran (Paragraf, Stiluri, Editare…), deci o greșeală vizibilă: 285→342. `banca.json:339` O4-07 = „Nu” la Shift+Delete șterge totuși fișierul, pe drumul clicului (`data-d="nu"`): 4→5. |

## 6. Găuri noi sau rămase (căutate cu mutanți-probă în %TEMP%, nepuse în bancă)

Am rulat un banc de probă cu 4 mutanți (`mutanti.py --banca %TEMP%\...\banca_gauri.json --paralel 2`, cu proba de zgomot,
80 s; liniile de bază 285/285 și 20558/20558):

**a. Grupul panglicii fără legendă vizibilă: O2 și O3 sunt ORBI.** În `jocuri/_motor/ui-panglica.js` am scos
`<div class="pg-nume">${esc(g.eticheta)}</div>`, pe pagina `lectii/vii/m1-l03`.
Rezultat: O2 285 → 285 NEPRINS, O3 20558 → 20558 NEPRINS. Cauza e în
`arbore_randat.js:317-323`: fără `.pg-nume`, numele grupului se ia din `aria-label`, iar `structura_lib.py:340-354`
(`_eticheta_grup`) nu numără lipsa legendei. În Office numele grupului se vede mereu sub grup. Agentul găsise unghiul mort la O2;
eu am confirmat că O3 e orb și el.

**b. Etichetă bilingvă pe ecran („Inserare (Insert)”): O2 e ORB, O3 o prinde doar prin poziție.** Fila Insert afișată ca
„Inserare (Insert)”, cu `aria-label` „Insert”. Rezultat: O2 285 → 285 NEPRINS; O3 20558 → 20560 PRINS, dar doar pentru că fila mai lată
mută filele de după ea. Cauza: `eticheta_vizibila` (`structura_lib.py:308-312`) desparte textul vizibil în variantele
„X (Y)” (`variante`, `:216-240`), deci „insert” e printre candidați, iar comparația cu referința (`:521`, `:610`) trece.
Am verificat și direct, în Python: `eticheta_vizibila({"text_vizibil": ["Inserare (Insert)"], "declarata": "Insert"})` →
`('Insert', [...], False)`. Variantele „RO (EN)” sunt potrivite pentru textul LECȚIILOR (I3, O7), nu pentru interfața randată. Un
reparator care scrie „Pornire (Home)” pe file ca să se potrivească cu lecțiile ar ieși cu R2 = 0, iar O3 l-ar prinde doar dacă se mișcă ceva.
Pe un buton cu lățime fixă, eticheta bilingvă poate trece și de O3.

**c. Porțile site-ului rulate de `porti.py`** (`test_joc.py`, `oracol_controale_taiate.py`, `proba_fereastra_mica.py`): au ruta
127.0.0.1 (`.abort(`), dar nu opresc `sendBeacon` și încarcă `prezenta.js` (grep: `sendBeacon` 0 în toate trei). Nu sunt fișiere
ale dosarului, iar situl nu se atinge în Etapa 0. Ce se poate face: rularea unor copii păzite, ca la `j2_parcurs.py`, sau o excepție
scrisă în `CONVENTIE_RADACINA.md`, cu motivul: pe un context nou nu există elev înscris (`assets/js/prezenta.js:108-111`).

**d. Cunoscute, neschimbate:** O3-02 și O4-04 nu sunt prinși din cauza saturării (comanda e deja greșită în linia de bază). `joaca.py:65`
înlocuiește `sendBeacon` cu o funcție care întoarce `true`, nu `false`: tot nu trimite nimic, deci e corect ca efect.

Nicio reparație n-a slăbit un oracol. Pe aceleași simulatoare vechi, numerele au crescut sau au rămas la fel
(O2 13330 → 13389, O3 3699 → 18524, O4 150 → 162, O8 2 → 102, O9 36 → 48). N-am găsit un oracol care acum să creadă
pagina pe cuvânt. Rădăcina e verificată static și în DOM, ecranul e comparat cu starea, iar starea e comparată și cu Excel real.

## Reparațiile rămase

Obligatorie (fără ea punctul 12 rămâne NU):
1. `inventar_build.py`, `verificare_vie` (`:1714-1725`): `ctx.add_init_script` care face ca `navigator.sendBeacon` să întoarcă `false`,
   plus abandonul cererilor către `/assets/js/prezenta.js` și `/assets/js/site-credit.js`, ca în `porti_extra/j_comun.py:26-50`.
   Fișierul nu e înghețat (`ingheata.py:34-36`), deci reparația nu atinge lacătul.

Recomandate înainte de înghețare (O2/O3 sunt înghețați; după înghețare se schimbă doar într-o rundă `acoperire`):
2. O2/O3: un grup randat fără legendă vizibilă = diferență (ex. `grup_fara_legenda`), iar mutantul „legendă scoasă” pus în bancă.
3. O2/O3: pe nodurile RANDATE, textul vizibil comparat întreg; variantele „X (Y)” doar pentru citatele din lecții. Mutantul
   „Inserare (Insert)” pus în bancă (O2).
4. Porțile site-ului din `porti.py`: copii păzite (`sendBeacon` + `prezenta.js`) sau excepția scrisă, cu motivul (6.c).
5. `referinte/README_referinte.md`: notă că `activ` la Paste depinde de clipboard în momentul dump-ului (O8-07, O8 7a).

## Verdictul

Calculul: reparațiile 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 și 14 sunt DA, iar 12 e NU (6 din 7 probe; lipsește `inventar_build.py --viu`). Bancul
întreg, într-o singură rulare, are cel puțin 5 prinși pe fiecare oracol (62/64). Oracolele O1-O9 și `porti.py` respectă contractul ieșirii,
`date_personale` = 0 după banc, numele contului apare în 0 fișiere și `_iesiri` nu apare în git. Pe lângă asta am găsit două unghiuri moarte
la O2/O3 (6.a, 6.b).

**Verdict: REPARATII_NECESARE.** Rămâne obligatorie reparația 12 pe `inventar_build.py`, câteva rânduri într-un fișier neînghețat.
Recomand ca 2 și 3 (O2/O3) să intre în aceeași rundă, înainte de `ingheata.py`.

Pe scurt: bancul de mutanți trece (62/64, niciun oracol sub 5), reparațiile 1-11 și 14 sunt făcute și dovedite pe disc, iar datele
personale sunt 0. Nu se poate îngheța încă din două motive. Întâi, o probă de browser din dosar (`inventar_build.py --viu`) încă nu oprește `sendBeacon`/`prezenta.js`. Apoi,
O2/O3 nu văd un grup fără legendă și nici o etichetă „RO (EN)” pe ecran.
