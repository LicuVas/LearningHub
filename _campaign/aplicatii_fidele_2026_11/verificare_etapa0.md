# Verificarea Etapei 0 — reperele „Aplicațiile fidele” (17.11.2026, 01:15–02:10)

Verificator independent: n-am scris nimic din ce verific și n-am reparat nimic. Am citit codul și am rulat totul din nou;
ieșirile mele stau în `%TEMP%\verif_e0\` (nu în dosarul lucrării). Am scris doar acest fișier.

**Rezultatul pe scurt — întâi numerele, verdictul la final.**

| Punct | Răspuns |
|---|---|
| 1. O1–O9 + porti.py respectă contractul ieșirii | O1–O9: DA (9/9) · porti.py: DA |
| 2. ≥ 5 mutanți prinși pe fiecare oracol | NU în rularea bancului (O5 1/7, O9 1/6, din cauza unui defect în `mutanti.py`); rulați apoi unul câte unul: O5 7/7, dar **O9 4/6 — sub 5** (O9-03, O9-05 scapă cu adevărat) |
| 3. Oracole adevărate prin construcție | Niciun oracol întreg nu e adevărat prin construcție (O2/O3 compară cu referința, O4 cere `mod_probat`, O6 joacă paginile), dar am găsit 8 locuri (a–h) unde un oracol crede ce declară pagina sau se compară cu el însuși |
| 4. Referințele complete | PARȚIAL: filele, File/Backstage, bara de stare, meniuri — da; dar Excel are fila **Developer** în rândul filelor (contrar R4) și 82 de suprafețe n-au referință (se numără, câte 1) |
| 5. Scenariile probate | DA în mare: 120/130 cu `mod_probat=true`, cele 10 fără sunt toate în `de_verificat.md`; NICIUN gest_real făcut prin COM; DAR 2 rezultate „reale” sunt artefacte recunoscute și totuși `mod_probat=true` |
| 6. verdicte_vechi.json | DA: 809 exerciții jucate, 0 nejucabile; O6 rejucat întreg = 0 diferențe; 3 exerciții rejucate de mine cu cod propriu: 8/8 încercări identice |
| 7. Rețeaua blocată | DA în toate probele de browser; apărarea împotriva `sendBeacon` există doar în O6 |

---

## 1. Fiecare oracol rulează și respectă contractul — O1–O9: DA · porti.py: DA

Comanda (pe rând, fiecare cu `LH_IESIRE=%TEMP%\verif_e0\<O#>`, fără `LH_RADACINA` = worktree-ul):
`python C:\Users\...\scratchpad\ruleaza_oracole.py` → verifică pentru fiecare: ultima linie întreg, ultimele 3 rânduri nevide,
cod 0/1 potrivit cu numărul.

| Oracol | Cod | Ultima linie | Timp | Contract |
|---|---|---|---|---|
| O1 oracol_central.py | 1 | `61` | 1,9 s (randarea din cache, făcută la 00:26, 340,7 s) | OK |
| O2 oracol_identic.py | 1 | `13330` | 0,9 s (cache) | OK |
| O3 oracol_ui.py | 1 | `3699` | 0,9 s (cache) | OK |
| O4 oracol_comportament.py | 1 | `150` | 58,8 s | OK |
| O5 oracol_evenimente.py | 1 | `201` | 21,8 s | OK |
| O6 oracol_sarcini.py | 0 | `0` | 1008,1 s (2427 încercări, 0 instabile) | OK |
| O7 oracol_text_ui.py | 1 | `355` | 1,1 s | OK |
| O8 oracol_comenzi_moarte.py | 1 | `2` | 189,8 s (a randat din nou: cache-ul fusese evacuat de mutanți) | OK |
| O9 oracol_asistare.py | 1 | `36` | 1,7 s | OK |
| porti.py | 1 | `2` | 1580,6 s | OK |

Porțile (`%TEMP%\verif_e0\porti\porti.json`): test_joc TRECUT (480,6 s), controale_taiate TRECUT `0` (869,2 s),
**cum_fac PICAT `41`** (era tot 41 la 23:00, `oracole/porti.json` — deci nu din lucrarea asta), fereastra_mica TRECUT `0`,
**date_personale PICAT `11`** (cele 11 fișiere `oracole/_iesiri/randare_*.json` cu numele contului, scrise de rularea bancului de
mutanți — vezi „Ce am lăsat în urmă” și reparația 3), word2007_j2 TRECUT `0`. Neconcludente: 0.

Notă: O7 dădea 291 la 23:40 (`runde/_proba_infra/masurare.json`) și dă 355 acum — reperele s-au mai schimbat după
23:40 (ex. `structura_lib.py` 23:59). Linia de bază se ia DUPĂ înghețare, nu din rulările de azi-noapte.

## 2. Bancul de mutanți — NU (cerința ≥ 5 pe oracol nu e dovedită pentru O5 și O9)

Comanda: `LH_IESIRE=%TEMP%\verif_e0\mutanti python .../mutanti/mutanti.py --paralel 3` (1390 s) → ultima linie `16`, cod 1.

| Oracol | Prinși / total | Neprinși și de ce |
|---|---|---|
| O1 | 6/6 | — |
| O2 | 5/6 | O2-05 (scot `aria-label` de pe grupuri): numele grupului se vede tot (`.pg-nume`), deci elevul nu vede nicio diferență — mutant prost ales, nu oracol orb |
| O3 | 6/8 | O3-02 (Subscript mutat 60 px), O3-07 (Subscript scos): Subscript are DEJA o diferență `pozitie` pe simulatorul vechi; mutarea nu adaugă o cheie nouă, scoaterea schimbă `pozitie` pe `lipsa` (−1 +1 = 0). Saturare (vezi 3.f) |
| O4 | 5/7 | O4-04: dialogul de redenumire diferă deja pe `intrebare` (saturare); O4-07: mută ramura `['inlocuieste']` din `explorer-operatii.js:409`, folosită doar de pașii de test, nu de clicul pe buton (`:598`) — O4 joacă gesturi, deci corect că nu-l vede |
| O5 | **1/7** | O5-02…O5-07: „fișierul aplicatii/aplicatii.js nu există în copie” |
| O6 | 6/6 | — |
| O7 | 6/6 | — |
| O8 | 6/6 | — |
| O9 | **1/6** | O9-02…O9-06: „fișierul aplicatii/aplicatii.js nu există în copie” |

**Cauza pentru O5/O9 e un defect în `mutanti.py`, nu în oracole:** pregătirea „jucarie” copiază biblioteca-jucărie cu
`Copie.scrie` (`mutanti.py:136-143`), care ține minte că `aplicatii/aplicatii.js` NU exista (`None`). Primul mutant e pus la loc
cu `pune_la_loc` (`:145-161`), care, văzând `None`, ȘTERGE fișierul. Al doilea mutant nu mai are pe ce lucra. `--valideaza`
(`mutanti/validare.json`, 23:36) n-a prins asta pentru că nu aplică mutanții. Bancul nu fusese rulat niciodată întreg înainte
(nu există `mutanti/rezultat.json`).

**Rulați unul câte unul** (`mutanti.py --id <id> --fara-zgomot`, câte o copie nouă pentru fiecare, `%TEMP%\verif_e0\mut1\`):
- O5: O5-02 0→6, O5-03 0→7, O5-04 0→10, O5-05 0→13, O5-06 0→4, O5-07 0→5 → împreună cu O5-01 (0→6): **O5 7/7**.
- O9: O9-02 6→12, O9-04 6→10, O9-06 6→30 PRINȘI; **O9-03 și O9-05 NEPRINȘI** (6→6) → împreună cu O9-01 (6→18): **O9 4/6 < 5**.
  De ce scapă: O9 pornește asistentul mereu cu UN singur pas (`oracol_asistare.py:214`: `pasi:[{tinta:T,...}]`), deci „indiciul
  rămâne pe primul pas” nu se poate vedea; și nu face niciodată derulare sau săgeți (nici `wheel`, nici `keyboard` în fișier),
  deci „derularea se numără ca greșeală” nu se poate vedea. Ambele sunt greșeli realiste de reparator.

Total după rerulare: 42 + 9 = **51/58 prinși**; sub 5: **O9**.

Realismul (2 mutanți citiți pe oracol):
- O1-01 (lecția de fotografie primește simulatorul vechi de Explorer, copiat-lipit) — realist; O1-06 (definește `TIP_ECRAN` în pagină) — prinde doar numele din lista fixă `SIMBOL_INLINE_APP` (`structura_lib.py:629`); un nume nou ar scăpa.
- O2-01 (filele în ordine inversă), O2-06 (panglica arată mereu Home) — realiste.
- O3-03 (Insert tradus „Inserare”), O3-06 (Subscript desenat SplitButton) — realiste.
- O4-01 („New folder” în loc de „Folder nou”), O4-06 (greșeala de 1 la „Copie (2)”) — realiste.
- O5-01 (dublul clic fără eveniment), O5-07 (Shift+clic raportat ca clic) — realiste, dar plantate în biblioteca-jucărie scrisă de autorii oracolelor (`oracole/_jucarie/aplicatii.js`), nu în simulatoarele vechi cum cere contractul (justificat: cele vechi n-au evenimente).
- O6-01 (verificarea acceptă orice), O6-04 (tolerează un test picat) — realiste, exact greșeala de mutare.
- O7-01 („Views”), O7-04 („Merge and Center”) — realiste.
- O8-02 (Cut nu face nimic), O8-05 (filele Word nu se mai schimbă) — realiste.
- O9-01 (indiciul după 3 greșeli), O9-03 (indiciul rămâne pe primul pas) — realiste.

Nu sunt mutanți de paie, cu excepția lui O2-05 (invizibil pentru elev). Lipsesc însă mutanții pentru găurile din punctul 3
(comandă gri, etichetă declarată ≠ text afișat, rădăcină `data-lh-aplicatie` pusă de lecție).

## 3. Oracole adevărate prin construcție — niciun oracol întreg; 8 locuri slabe (a–h)

Ce e BINE (verificat în cod):
- O2 și O3 compară cu `referinte/uia_<app>.json` (`structura_lib.py:366-369`, `oracol_identic.py:38`, `oracol_ui.py:30`), NU cu randarea bibliotecii.
- O4 cere `mod_probat is True` în rezultatul real (`oracol_comportament.py:454`); cele 4 `word2007-*` scrise din spusele profesorului au `mod_probat:false` și se numără mereu.
- O6: verdictele vechi vin din pagini jucate în browser (`sarcini_lib/joaca.py`), nu calculate. O6 rejucat întreg pe situl neschimbat = 0 (1008 s, 0 instabile); 3 exerciții rejucate de mine cu cod scris separat — identice (punctul 6).
- Determinismul randării: am copiat oracolele în `%TEMP%` și am randat de 2 ori de la zero 4 pagini (cache șters între rulări): O2 1205/1205, O3 3523/3523, O8 0/0.

Ce e adevărat prin construcție sau crede pagina pe cuvânt:
- **a. Proba de zgomot a mutanților, la O1/O2/O3/O7/O8, se compară cu ea însăși.** A doua linie de bază (`mutanti.py:213-217`) are aceeași amprentă ca prima (amprenta include `LH_PAGINI`, `structura_lib.py:1145-1146`), deci citește cache-ul scris de prima (`structura_lib.py:1583-1588`). „61 / 61” iese oricum. (Determinismul real l-am măsurat eu separat, mai sus — ținea; dar proba din bancă nu-l dovedește.)
- **b. O1 crede orice element marcat `[data-lh-aplicatie]`** (`arbore_randat.js:290`): o lecție care își desenează singură interfața și o învelește într-un `<div data-lh-aplicatie>` iese curată, dacă nu încarcă un fișier vechi din listă și nu folosește un nume din `SIMBOL_INLINE_APP`.
- **c. O2/O3 citesc eticheta declarată, nu textul afișat** (`arbore_randat.js:157`: `data-lh-eticheta` înaintea textului): biblioteca poate scrie „Insert” în atribut și „Inserare” pe ecran (exact riscul comutatorului RO din I3), iar O2/O3 dau 0.
- **d. O4 crede starea raportată de bibliotecă** (`sim_runner.js:181`: `L.stare(ST.app)`), fără să compare cu ce e pe ecran: un model corect cu un ecran neredesenat trece.
- **e. O8 nu judecă butoanele gri** (`structura_lib.py:1486-1488`, „gri pe ecran … ca o comandă indisponibilă”) — indiferent dacă în aplicația reală sunt active. Pe simulatoarele vechi 15 apăsări ies deja „gri, nejudecate” (`%TEMP%\verif_e0\O8\oracol_comenzi_moarte.json`). O bibliotecă care face gri comenzile pe care nu le simulează iese cu O8 = 0. În plus orice schimbare de DOM e „efect” (`:1515`), deci și mesajul „aici nu e simulată” pe o comandă CITATĂ de lecție — R12 cere ca acelea să funcționeze.
- **f. Saturare la O3** (reuniune de chei, `oracol_ui.py:36-41`): o comandă deja greșită nu mai poate crește numărul; „lipsă” cântărește cât „mutată cu 9 px” (vezi O3-07). O2 o prinde pe aceeași (O2-03), deci împreună țin; singur, O3 nu.
- **g. O9, cazul F, e o căutare de text** (`oracol_asistare.py:294-303`: pagina conține „aplicatii/aplicatii.js” și „asistent”), nu probă Playwright pe lecție cum cere R7. Un comentariu în pagină îl trece.
- **h. Porțile se numără ca „porți picate”, nu ca probleme** (`porti.py:214`; `opreste.py:75-80`): o poartă deja roșie nu se mai poate înrăutăți vizibil. `cum_fac` era deja PICAT cu 41 la 23:00 (`oracole/porti.json`) — 41 → 80 ar trece neobservat.

## 4. Referințele — PARȚIAL

Ce au (`referinte/uia_{word,excel,powerpoint}.json`, 1366×768, 96 DPI, factor 1,0, Office 16.0.20326.20318):
- toate filele implicite față de M365 SAEC (`comparatie_saec.file_doar_in_aplicatie = []` la toate trei): Word 10 file (cu Draw,
  Mailings, Help), PowerPoint 11 (cu Draw, Record, Review), Excel 9 + **Developer**;
- File/Backstage: `backstage.nav`, `.Home/.New/.Open/.Info/.Save As/.Print/.Share/.Export`; bara de stare; bara de titlu; Acces rapid;
- meniuri de clic dreapta: Word 2 (text, text selectat), Excel 4 (celulă, antet coloană, antet rând, fila foii), PowerPoint 3;
- dialoguri: Word 16, Excel 18, PowerPoint 6 chei (cu filele lor); filele contextuale de tabel/imagine/formă/diagramă.

Ce e greșit sau lipsește:
- **Excel: fila Developer e în rândul filelor** (`uia_excel.json:747`, TabItem „Developer”, `TabDeveloper`), deși `excluse_personal`
  spune că a scos-o și contractul R4 cere „profil curat fără Developer”. Verificarea referinței caută doar suprafața
  `panglica.TabDeveloper` (`dump_uia_office.py:1568`), nu și fila din rând, de aceea a dat 0. O3 o cere deja:
  `file_panglicii||lipsa|developer#1` în `%TEMP%\verif_e0\O3\oracol_ui.json`.
- **82 de suprafețe din `suprafete.json` n-au referință** și se numără câte 1 la O3 (`pe_fel.fara_referinta = 82`): Windows 10/10,
  File Explorer 19/19, Paint 11/11, Word 18/49, Excel 13/41, PowerPoint 11/40. Printre ele unele pe care lecțiile le folosesc
  mult: `excel.file_foi`, `excel.grila`, `excel.maner_umplere`, `powerpoint.panou_miniaturi`, `powerpoint.zona_diapozitiv`,
  `word.rigla`, `word.meniu_tabel`, `word.meniu_imagini`. Se numără (nu dau 0), dar o suprafață fără referință cântărește
  1 oricât de mare ar fi și nu poate ajunge niciodată la 0 — e o podea fixă de 82 la O3 (40 dintre ele așteaptă sesiunea
  de 10 minute cu Vasile, I6).
- `uia_explorer.json` are doar fereastra Proprietăți, în alt format → tratat corect ca „fără referință” (`structura_lib.py:123-139`).
- Produsul real e `ProPlus2021Retail` pe Current Channel (README_referinte.md:26), nu un abonament Microsoft 365: fără
  AutoSave/Copilot/Designer. E ce e pe PC-ul lui (glosarul o permite), dar laboratorul poate avea altceva — de pus la R13.

## 5. Scenariile — DA, cu 2 rezultate de scos

- 130 de scenarii (Word 54, Excel 41, PowerPoint 17, Explorer 18); **120 au `mod_probat: true`** (Word 47, Excel 39,
  PowerPoint 16, Explorer 18). Cele 10 fără: 6 fără rezultat real (tragerile + copiere/decupare cu clipboard) și 4 `word2007-*`
  (fapt de la profesor, `mod_probat:false`) — toate 10 sunt în `de_verificat.md` și O4 le numără (rândul „fără rezultat real
  probat: 10”).
- `probe_mod.md` dovedește fiecare canal Office pe un rezultat cunoscut, cu probă de control rulată în aceeași instanță
  (Word/Excel/PowerPoint, blocurile PROBE, toate `trecut: true`). Controalele la `taste`, `mouse`, `panglica` (Word/Excel)
  sunt adevărate (altă intrare → alt rezultat). Controalele la `tastare` (toate trei, `ruleaza_real.py:1154,1194,1244`) și la
  `model_obiect`/`panglica` PowerPoint (`:1228,1232`) sunt tautologice („așteptarea xz pică” când s-a citit xy) — nu adaugă
  dovadă, dar proba pozitivă rămâne valabilă.
- Explorer (18, `model_obiect` prin interfețele shell: IDropTarget, SetNameOf, IContextMenu) are proba lui în scenariul
  `explorer_control_citire` (rezultat cunoscut) și `control_ok: true` în `explorer_motor/motor_rezultat.json`; nu e în
  `probe_mod.md` și n-are probă de control negativă.
- **Niciun gest_real făcut prin COM**: niciun scenariu `gest_real` nu are pas `selecteaza` (singurul pas care ar merge prin COM,
  `ruleaza_real.py:625-627`); pregătirea și citirea stării prin COM sunt declarate în `cum`. Tastele = WM_KEYDOWN/WM_CHAR,
  mouse = WM_LBUTTON*, panglica = UIA Toggle/Invoke.
- **De scos înainte de înghețare:** `scenarii_real/excel-separator-virgula.json` și `excel-autocompletare-tab.json` au
  `mod_probat: true` cu `ramane_in_editare: true`, `fereastra_mesaj: null`, deși `de_verificat.md:23-24` spune chiar că
  rezultatul e îndoielnic („nu am putut vedea ce a completat Tab”; „nicio fereastră de mesaj găsită”). Excel real (Tab
  completează `=SUM(`; virgula dă mesajul „There's a problem with this formula”) [NEVERIFICAT aici] ar fi numărat de O4 ca
  DIFERENȚĂ. Sunt singurele două rezultate cu `ramane_in_editare: true`. R5: ce nu se poate rula invizibil merge la Vasile,
  nu în oracol ca adevăr.

## 6. verdicte_vechi.json — DA

- 60 de pagini, **809 exerciții, toate jucate** (0 nejucabile la nivel de exercițiu); soluția: 809 × corect; greșeala 1:
  808 × greșit + 1 nejucabilă; greșeala 2: 805 × greșit + 4 fără verdict. Planuri: 702 `gol`, 53 `vecin`, 48 `alta_varianta`, 6 `partial`.
- O6 întreg pe situl neschimbat: `0` (2427 încercări, 0 instabile, 1008 s).
- Rejucate de mine cu cod propriu (`scratchpad\verdicte3.py`: server pe port liber, rețeaua doar 127.0.0.1, prezenta.js
  neîncărcat), după index în ordinea fișierului:
  - #0 `lectii/v/m2-l08` N1P3E1 (ceasul Windows): soluție / greșit / gol — 3/3 identice (corect + mesaj + scor);
  - #404 `lectii/viii/m1-l06` N1P4E2 (Wrap Text): soluție / greșit — 2/2 identice; greșeala 2 „vecin” n-am refăcut-o;
  - #808 `jocuri/word-vii` N7Î4 (afișul, mod test): soluție „+12 XP (cu bonus de serie)” / 22 diferențe / 10 diferențe — 3/3 identice.
  Ultima linie: `0`.

## 7. Rețeaua — DA

- Toate cele 7 probe de browser din dosar au rută care abandonează tot ce nu e local: `structura_lib.py:1109-1115`,
  `oracol_comportament.py:82-90`, `oracol_evenimente.py:105-107`, `oracol_asistare.py:96-98`, `sarcini_lib/joaca.py:122-133,309`,
  `porti_extra/j_comun.py:27-34` (folosit de `j2_parcurs.py`), `inventar_build.py`. Porțile site-ului (test_joc,
  controale_taiate, fereastra_mica) sunt rulate doar dacă au `.abort(` și nu pomenesc serverul viu (`porti.py:142-152`).
- Nicio probă nu cheamă teste-vasile / teste.api / lh-api / diplome (grep pe tot dosarul: doar lista interzisă din porti.py).
- Atenție: `jocuri/_motor/garda_locala.py:3-5` spune că `sendBeacon` la închiderea paginii a scăpat odată de rută. Doar O6
  (`joaca.py:57,65`) oprește `sendBeacon` și nu încarcă `prezenta.js`. Restul se bazează pe faptul că pe un context nou nu
  există elev înscris, deci `prezenta.js` nu trimite nimic (`assets/js/prezenta.js:108-111`, `:401`, `:1226`) — adevărat azi,
  fragil mâine. O4/O5/O9 pun `learninghub_active_profile`, dar asta nu creează o identitate.
- O4: „60 cereri spre afară (fonturi) abandonate, niciuna plecată”.

## Ce am lăsat în urmă (onest)

- Rularea `mutanti.py` (cum cere sarcina) a scris în `oracole/_iesiri/` randări cu calea copiei din `%TEMP%`, deci cu numele
  contului Windows: 11 din 13 fișiere `randare_*.json` îl conțin. Cauza: `structura_lib.py:61-66` (`dir_cache`) ignoră
  `LH_IESIRI`, deși `mutanti.py:170-174` și `CONVENTIE_RADACINA.md:60-63` spun că îl folosește. `oracole/_iesiri/` NU e în
  `.gitignore` (`git check-ignore` → nimic). Nu le-am șters (nu am voie să scriu în afara acestui fișier) — vezi reparația R3.

## Reparațiile necesare înainte de înghețare

Obligatorii (fără ele reperele înghețate ar măsura greșit sau ar încălca o regulă):

1. **`mutanti.py`, pregătirea „jucarie”**: `Copie.scrie`/`pune_la_loc` (`mutanti/mutanti.py:136-161`) șterg biblioteca-jucărie
   după primul mutant. De reparat (pregătirea pusă la loc o singură dată, la finalul grupului), apoi bancul rulat ÎNTREG din nou
   și `mutanti/rezultat.json` păstrat ca dovadă. Gata = toate O1–O9 ≥ 5 prinși într-o singură rulare a bancului.
2. **O9 sub 5 (4/6)**: un caz cu asistent de 2 pași (după pasul 1 făcut, indiciul vine pe ținta pasului 2) și un caz cu gesturi
   care NU sunt greșeli (derulare, săgeți ×3 → fără indiciu). Și cazul F jucat în Playwright pe lecție (2 greșeli → indiciul
   pe elementul cerut), nu căutare de text (`oracol_asistare.py:294-303`), cum cere R7. Gata = O9-03 și O9-05 PRINȘI.
3. **Datele personale în `oracole/_iesiri/`**: `structura_lib.dir_cache()` (`:61-66`) să respecte `LH_IESIRI` (sau să țină
   cache-ul în `%TEMP%` când situl nu e worktree-ul), `_campaign/**/oracole/_iesiri/` în `.gitignore`, iar cele 11
   `randare_*.json` cu numele contului șterse. Gata = poarta `date_personale` = 0 după o rulare a bancului.
4. **`uia_excel.json`: fila Developer scoasă din `file_panglicii`** (`:747`), cu notă în `excluse_personal`; `dump_uia_office.py
   verifica` (`:1568`) să caute și TabItem-ul din rândul filelor. Gata = `file_panglicii||lipsa|developer` dispare din O3.
5. **`scenarii_real/excel-separator-virgula.json` și `excel-autocompletare-tab.json`**: `mod_probat: false` (sunt deja în
   `de_verificat.md:23-24`) până răspunde Vasile. Gata = O4 le numără la „fără rezultat real probat” (12, nu 10).
6. **Porțile numărate pe probleme, nu pe porți picate** (`porti.py:214`, `opreste.py:75-80`): `cum_fac` e deja 41; o creștere
   41→80 trebuie să se vadă. Gata = `porti_dupa` poartă `{poarta: n}` și oprirea/regresul compară n cu n.
7. **O8**: o comandă gri în simulator, dar activă în referință (`activ` ≠ false), se numără moartă (azi 15 apăsări „gri,
   nejudecate”); o comandă CITATĂ de lecție care dă doar mesajul „aici nu e simulată” se numără moartă (R12, prima frază).
   Plus câte un mutant pentru fiecare. Gata = cei doi mutanți noi PRINȘI.

Recomandate înainte de înghețare (găuri prin care ar trece o reparație grăbită; după înghețare se schimbă doar într-o rundă `acoperire`):

8. O1: rădăcina `[data-lh-aplicatie]` acceptată doar dacă e înregistrată de bibliotecă (ex. `LH.aplicatii.radacini()`), nu
   orice element marcat (`arbore_randat.js:290`).
9. O2/O3: când elementul are text vizibil, se compară textul vizibil (sau `data-lh-eticheta` trebuie să fie egal cu el)
   (`arbore_randat.js:157`); mutant: atribut „Insert”, ecran „Inserare”.
10. O4: pentru cheile `text`/`celule`, starea raportată de `L.stare()` comparată și cu ce e pe ecran (`sim_runner.js:181`).
11. Proba de zgomot a mutanților la O1/O2/O3/O7/O8: a doua linie de bază cu randare forțată, nu din cache (`mutanti.py:213-217`).
12. `sendBeacon` oprit și `prezenta.js` neîncărcat în TOATE probele de browser, ca în `joaca.py:57,65`.
13. `probe_mod.md`: control negativ adevărat la `tastare` și la PowerPoint `model_obiect`/`panglica`; proba Explorer mutată
    acolo, cu un control negativ.
14. Mutanții O2-05 (invizibil pentru elev) și O4-07 (ramură moartă pentru gesturi) înlocuiți cu greșeli vizibile.
15. Referințe pentru suprafețele mari folosite des (`excel.file_foi`, `excel.grila`, `powerpoint.panou_miniaturi`,
    `word.rigla`, `word.meniu_tabel`, `word.meniu_imagini`) — într-o rundă `acoperire`; azi cântăresc câte 1.

## Verdictul

Calculul: punctele 1, 6, 7 = DA; punctul 5 = DA cu 2 rezultate de scos; punctul 4 = PARȚIAL (Developer); punctul 3 = 8
locuri slabe; punctul 2 = NU (O9 4/6 < 5, iar bancul întreg nu poate rula din cauza defectului din `mutanti.py`). Poarta
`date_personale` e roșie (11) chiar din cauza uneltelor de măsurare.

**Verdict: REPARATII_NECESARE** — reparațiile 1–7, apoi bancul de mutanți rulat întreg (≥ 5 pe fiecare oracol, într-o
singură rulare) și `porti.py` cu `date_personale` = 0; abia apoi `ingheata.py`.

Pe scurt: oracolele rulează corect și măsoară lucruri reale (O6 și referințele Office sunt solide), dar bancul de mutanți
nu se poate rula întreg, O9 are două unghiuri moarte, iar Excel cere o filă Developer pe care contractul o interzice.
