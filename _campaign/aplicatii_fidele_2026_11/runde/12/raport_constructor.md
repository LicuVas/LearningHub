# Runda 12 · raportul constructorilor (B-powerpoint, GRAV P1-P5 + MINOR) — constructorul 1 (P1-P5, predare 552ac0c5) și constructorul 2 (MINOR, pasul 7)

## Numerele (pasul 7 complet, `masoara.py --runda 12 --paralel 3 --compara masurare_pornire.json`, după ultima scriere sub aplicatii/)
Pornirea (`masurare_pornire.json`, 07:03-07:41) → pasul 7 (`masurare.json` = `masurare_pas7.json`, 09:08:58-10:19:42, singur pe mașină,
după ultima scriere sub aplicatii/ la 08:58:47):

| | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | porți |
|---|---|---|---|---|---|---|---|---|---|---|
| pornire | 61 | 13392 | 25076 | 48 | 82 | 0 | 341 | 102 | 27 | 41 |
| după | 61 | 13392 | 25076 | **30** | 82 | 0 (*) | 341 | 102 | 27 | 41 |

- Porțile după: test_joc 0 · controale_taiate 0 · cum_fac 41 · fereastra_mica 0 · date_personale 0 · word2007_j2 0 (la fel ca la pornire).
- Lacătul: ok în toate rulările; `ingheata.py --verifica` = 0 (372 de fișiere, INTACT). Nicio creștere → nimic dat înapoi, fără regres.md.
- (*) O6, după regula din supliment: în pasul 7 a ieșit NECONCLUDENT pe timp (1801,8 s, limita 1800 s). Reluat imediat singur
  (`--doar O6`, 10:20-10:50): tot NECONCLUDENT la 1800 s (`masurare_o6_1.json`, `pas7_o6_1.log`). Reluat a doua oară singur cu
  `--timeout O6=3600` (10:51-11:11): **0** în 1237 s — 60 de pagini, 809 exerciții, 2427 de încercări, verdicte diferite 0, dispărute 0,
  instabile 0 (`masurare_o6.json`, `pas7_o6_2.log`, `iesiri/O6/`). `masurare.json` = `masurare_pas7.json` pus înapoi.
  Toată mașina a mers mai încet decât la pornire (O1-O5 +30 %, O4 258 → 605 s, porți 1799 → 3479 s), deci timpul lui O6 nu e o
  măsură a codului; la pornire O6 a durat 1060 s.
- O3 nu se mișcă din biblioteca PowerPoint (cadru.md, presupunerea 1: O3 randează lecțiile, încă pe simulatoarele vechi) — „O3 trebuie
  să scadă” din supliment nu se aplică în etapa B (de acord cu orchestratorul).
- O4: 48 → 30. Cele 30 rămase: 15 diferențe în scenarii Excel / Explorer / Word (`excel-numere-afisare` 6, `word-clic-pune-cursorul` 2,
  câte 1: excel-autocompletare-tab, excel-autofit-latime, excel-separator-virgula, 4 × explorer — neatinse de runda asta) +
  neexecutabile 4 (3 scenarii, cântărite pe chei) + fără real 11 (între ele `powerpoint-tragere-forma`) = 30
  (`oracol_comportament.py › rezuma`).

Proba constructorilor (`runde/12/proba_grav.py`, gesturi reale pe poligon):
- pornirea rundei 32fe7fb1 (`--inainte`, rulată de constructorul 1 când era HEAD): 18 picate (`proba_grav_inainte.json`);
- predarea constructorului 1, 552ac0c5, doar MINOR (`--ref 552ac0c5 --doar p6`): 5 picate din 9 (`proba_grav_552ac0c5_p6.json`);
- worktree-ul de acum (P1-P5 + MINOR): **0 picate din 49** (`proba_grav_dupa.json`).
O4 doar PowerPoint (`o4_ppt.py`, constructorul 1): 19 → 1 (rămâne `powerpoint-tragere-forma`, fără rezultat real).

## FĂCUT (cu dovada)
- **P1 KeyTips** (constructorul 1): Alt / literă / Esc ca în word.js; „Alt, H, 1” = Bold fără litere în text; „Alt, H, F, S”, „Alt, H, I”
  (lista New Slide), „Alt, A, C”; un eveniment `tasta_acces` pe tastă. Proba: 9/9.
- **P3 închiderea și fișierele** (constructorul 1): „Save your changes to this file?” din `dialog.save_your_changes_to_this_file` pe
  Ctrl+W / File › Close / ✕; Cancel / Esc / Don't Save / Save; Ctrl+N = Presentation2; Ctrl+O = Backstage › Open. Proba: 14/14.
- **P2 Font Color** (constructorul 1): paleta din `lista.FontColorPicker` (+ mini-bara), Red → `culoare_text` #FF0000, ecranul, Ctrl+Z. Proba: 5/5.
- **P4 obiectele** (constructorul 1): Layout / New Slide ▾ din referință (Two Content = 3 forme), Pictures ▾ › This Device… › Insert
  Picture, Shapes ▾ › Arrow: Right + clic, Table ▾ din referință („Insert Table...” scris de mână scos), Ctrl+C / Ctrl+V pe caseta-obiect
  → `caseta_text` în același loc. Proba: 7/7.
- **P5 efectele** (constructorul 1): Duration (Fade 0,7, Apply To All), Animation Pane (rânduri alegibile, Move Up / Down, [2, 1]),
  Format Background (Solid fill › Light Blue › Apply to All = #00B0F0). Proba: 4/4.
- **MINOR (constructorul 2)**, proba `p6` 9/9 (5 dintre ele picau pe 552ac0c5):
  - `modificat` true după Ctrl+Z / Ctrl+Y făcute după salvare (`powerpoint.js › anuleaza`, `reface`: `M.salvat = false`, ca Word);
    șirul probat: scris true · Ctrl+S false · Ctrl+Z true · Ctrl+S false · Ctrl+Y true;
  - `diapozitiv_activ` null cu 0 diapozitive (`I.stare`); Ctrl+Z îl readuce la 1;
  - zonele de atins la 360 px (`powerpoint.js › zoneAtingere` + `aplicatii.css`, @media ≤ 480 px): lansatoarele Font și Clipboard 32 × 33
    efectiv (elementFromPoint), chenarul casetei alese 32 px (atingerea la 14 px deasupra titlului îl alege ca obiect), colțul
    `diapozitiv` ≥ 32 × 32; zonele PowerPoint sub 32 px: 14 la predare (10 la critic 11) → 0; atingerea textului vecin neschimbată;
    capturile la 360 px identice octet cu octet cu 552ac0c5 (ce se vede nu s-a schimbat);
  - FĂCUTE de constructorul 1: `.lh-ap-strat-backstage` sub `.lh-ap-powerpoint`; „Insert Table...” scris de mână scos; rândurile
    Animation Pane fără `aria-hidden`.
- **Regresul** (după bucata 6, `regres_c2.sh` → `c2_regres_rezumat.txt`): runde/11/proba_powerpoint 0 · Word runde/5, 4, 4-telefon, 3, 2
  = 0 · Excel runde/10, 9, 8, 7-cont, 6 = 0 · runde/7/proba_grav 2 (X6, aceleași rânduri ca la predare, D14) · runde/7/proba_grav_cont2 3
  (X8, aceleași, D18). Json-urile scrise de probele vechi în runde/7-10 (neurmărite) mutate în %TEMP%; nimic urmărit atins în runde/2-11.

## NEFĂCUT (cu deblocatorul)
- **Font style / Underline style (fereastra Font) și Alignment (Paragraph) la OK** — LĂSATE: referința are câmpurile doar ca ComboBox
  cu valoarea de acum („Regular”, „(none)”, „Centered”), fără Edit și fără lista ▾ (`uia_powerpoint.json › suprafete ›
  dialog.FontDialogPowerPoint` / `dialog.PowerPointParagraphDialog`, verificat prin Python în `p6`). Deblocator: o rundă `acoperire`
  cu listele ▾ deschise (R12-9).
- `powerpoint-tragere-forma`: fără rezultat real (R11-5) → rundă `acoperire`.
- O3 nu scade din biblioteca PowerPoint: randează lecțiile, care încă încarcă simulatoarele vechi (cadru.md, presupunerea 1) → etapa C.
- Pasul 8 (criticul) și pasul 9 (commit, merge, push) — le face orchestratorul.

## NESIGUR
- Zonele de atins pe telefon: lansatoarele Paragraph / Drawing (și cele din Animations, View, filele contextuale) rămân 32 × ~28 —
  butonul de deasupra e la 2-4 px în geometria referinței; benzile chenarului pe casetele NEALESE nu se ating pe telefon (alegere,
  nu comportament dovedit); „More Options” lângă Undo și bara de stare (28 px) sunt sub 32 px și în Word / Excel (cod comun) → R12-10.
- `modificat` după Undo: PowerPoint real n-a fost citit (`Presentation.Saved`); am urmat regula din supliment și modelul Word.
- Ținta `diapozitiv` = colțul gol + fundalul: alegere de geometrie pentru rulator (contra.md, adevărul incomod).
- [presupus] R12-1 … R12-10 în `de_verificat.md`.

## Fișierele schimbate (ambii constructori, față de 32fe7fb1)
- `aplicatii/powerpoint.js` — constructorul 1 (P1-P5) și constructorul 2 (`anuleaza` / `reface`, `diapozitiv_activ`, `zoneAtingere`,
  insigna KeyTips a lansatorului lărgit);
- `aplicatii/aplicatii.css` — constructorul 1 (`.lh-ap-p-*`, `.lh-ap-powerpoint .lh-ap-strat-backstage`, `.lh-ap-p-fara`) și constructorul 2
  (blocul `@media (max-width:480px)` PowerPoint: `.lh-ap-p-zona-at`, benzile `.lh-ap-p-margine`, `.lh-ap-p-colt`);
- `aplicatii/date/powerpoint.json` — constructorul 1 (regenerat, `--verifica` 0);
- `_campaign/aplicatii_fidele_2026_11/de_verificat.md` — R12-1 … R12-8 (constructorul 1), R12-9, R12-10 (constructorul 2);
- `runde/12/`: cadru.md, tinta.md, contra.md, diferente.md, stare_autor.md, h.py, o4_ppt.py, proba_grav.py (+ `p6`, `--ref`, `--doar`),
  proba_grav_inainte.json, proba_grav_552ac0c5_p6.json, proba_grav_dupa.json, regres_predare.sh, regres_c2.sh, predare_rezumat.txt,
  c2_regres_rezumat.txt, masurare.json, masurare_pas7.json, masurare_o6.json, masurare_o6_1.json, masurare_1-3.json (rotite de masoara.py:
  măsurările anterioare din runda 12), pas7_*.txt / .log,
  raport_constructor.md, gata_pentru_critic.md, iesiri/ (+ jurnalele .log ale probelor).
- NEatinse: lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, scenariile, `api_biblioteca.md`, `suprafete.json`,
  `aplicatii.js`, `panglica.js`, `word.js`, `excel.js`, generatorul.

## Scenariile PowerPoint care trec acum (O4)
26 din 27 au verdictul „ok” în O4 (`iesiri/O4/oracol_comportament.json`): animatie-fly-in, animatii-move-up, aspect-title-only,
bold-text, ctrl-c-v-caseta, ctrl-m, ctrl-n, ctrl-w-modificat, ctrl-z-diapozitiv-nou, delete-diapozitiv, diapozitiv-nou-buton,
dublare-diapozitiv, durata-aplica-la-toate, font-color-titlu, fundal-aplica-la-toate, imagine, mareste-font, sageata-dreapta,
salvare-ca, tabel, tastare-titlu, tema-ion, tranzitie-aplica-la-toate, tranzitie-fade, two-content-layout, two-content-new-slide
(toate cu prefixul `powerpoint-`). Nu trece: `powerpoint-tragere-forma` (`fara_real`: lipsește rezultatul real, R11-5).
