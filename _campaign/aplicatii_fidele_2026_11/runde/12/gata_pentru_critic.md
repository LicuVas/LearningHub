# Runda 12 · unde e ce (pentru critic) — B-powerpoint, GRAV P1-P5 din runde/11/critic.md + MINOR §6

## Numerele (pasul 7, `raport_constructor.md`)
- O1 61 · O2 13392 · O3 25076 · **O4 48 → 30** · O5 82 · O6 0 (după regula O6: reluat singur cu `--timeout O6=3600`) · O7 341 · O8 102 ·
  O9 27 · porți 41 (doar cum_fac) · lacăt ok · `ingheata.py --verifica` 0. Nicio creștere.
- O4 pe PowerPoint: 26 / 27 scenarii „ok”; `powerpoint-tragere-forma` = `fara_real`.
- Proba constructorilor `runde/12/proba_grav.py`: 32fe7fb1 = 18 picate · 552ac0c5 (doar MINOR) = 5 din 9 · acum 0 din 49.
- Regresul: Word 5 probe = 0, Excel 5 = 0, runde/11/proba_powerpoint = 0, runde/7 = 2 + 3 (X6 / X8, acceptate D14 / D18).

## Fișierele
- Modulul: `aplicatii/powerpoint.js` (ambii constructori). Datele: `aplicatii/date/powerpoint.json`, regenerat de
  `aplicatii/_unelte/genereaza_powerpoint.py` din referința înghețată (`--verifica` = 0; generatorul neschimbat).
- Cod comun atins: doar `aplicatii/aplicatii.css`, și acolo doar regulile PowerPoint: `.lh-ap-p-*`, `.lh-ap-powerpoint .lh-ap-strat-backstage`
  (regula comună `.lh-ap-strat-backstage` a rămas cum era pentru Word / Excel) și blocul `@media (max-width:480px)` de la capăt.
  `aplicatii.js`, `panglica.js`, `word.js`, `excel.js` neatinse.
- Diferențele rundei: `git -C C:/00/Projects/LearningHub_fidel diff 32fe7fb1 -- aplicatii/` (32fe7fb1 = pornirea rundei;
  552ac0c5 = predarea constructorului 1; peste el, necomise, bucata 6 a constructorului 2).
- Notele: `runde/12/diferente.md` (rândurile P1-P5 și M1-M4, citatele din referință), `de_verificat.md` R12-1 … R12-10 ([presupus]).

## Cum deschizi poligonul cu PowerPoint
- Din worktree, servit doar pe 127.0.0.1 (ex. `python -m http.server --bind 127.0.0.1 0` cu directorul `C:/00/Projects/LearningHub_fidel`):
  `/aplicatii/poligon.html?aplicatie=powerpoint` (3 diapozitive „Vulcanii”) sau `LH.aplicatii.deschide('powerpoint', {continut, focus: true})`
  cu formatul `start` al scenariilor (api §7.1): `diapozitive [{aspect, texte}]`, `diapozitiv_activ`, `panou`, `selectie_text [d, s]`,
  `selectie_forma [d, s]`, `forma_citita`, `tema`, `nume_fisier`.
- Hamul folosit de constructori: `runde/12/h.py` (Chromium headless, port liber, tot ce nu e 127.0.0.1/localhost abandonat).
  Telefonul în proba mea: `proba_grav.py › Tel` (360 × 740, `is_mobile`, `has_touch`, scale 2, `touchscreen.tap`).

## Gesturile reparate (proba: `runde/12/proba_grav.py`, gesturi reale `page.keyboard` / `page.mouse` / `touchscreen.tap`)
- **P1 KeyTips**: Alt → literele filelor; H → literele comenzilor; `Alt, H, 1` = Bold (nicio literă în text), `Alt, H, F, S` = Font Size,
  `Alt, H, I` = lista New Slide (partea „More Options” a butonului împărțit), `Alt, A, C` = Animation Pane; Esc urcă un nivel;
  un eveniment `tasta_acces` pe tastă.
- **P3 închiderea**: Ctrl+W / File › Close / ✕ pe prezentarea modificată → „Save your changes to this file?” (File name cu focus,
  More options…, Save, Don't Save, Cancel); Cancel / Esc = nimic; Don't Save = fereastra „PowerPoint” fără prezentare
  (`prezentare_activa: null`, `prezentari_deschise: 0`, comenzile gri); Ctrl+N = Presentation2; Ctrl+O = Backstage › Open.
- **P2 Font Color**: ▾ → paleta din `lista.FontColorPicker` (mini-bara: `_minibara`); Red → `culoare_text` „#FF0000”, ecranul roșu, Ctrl+Z.
- **P4 obiectele**: Layout / New Slide ▾ din referință (9 aspecte, Two Content cu 3 forme); Insert › Pictures ▾ › This Device… →
  Insert Picture → nume + Enter = imagine; Insert › Shapes ▾ (195) › Arrow: Right + clic pe diapozitiv; Table ▾ din referință;
  Ctrl+C / Ctrl+V pe caseta aleasă ca obiect → `caseta_text` în același loc pe diapozitivul 2.
- **P5 efectele**: Duration activ (Fade 0,7; „0,5” + Enter; Apply To All copiază); Animation Pane cu rânduri alegibile, Move Up /
  Move Down (gri după rândul ales), Move Up pe rândul 2 → [2, 1]; Format Background › Solid fill › Color ▾ (cu Automatic) › Light Blue ›
  Apply to All → #00B0F0 pe toate.
- **MINOR (bucata 6, constructorul 2)**:
  - Save (Ctrl+S) → Ctrl+Z → `modificat: true`; Ctrl+S → false; Ctrl+Y → true (ca Word).
  - Delete pe ultimul diapozitiv → `diapozitive: []`, `diapozitiv_activ: null` (Ctrl+Z → 1).
  - Telefon 360 px: atingerea la 14 px DEASUPRA titlului ales îl alege ca obiect (chenarul = 32 px: 24 în afară + 8 înăuntru);
    atingerea subtitlului cu titlul ales (și invers) tot în text intră; lansatorul Font atins la 3 px în afara vechiului 21 × 21
    deschide fereastra Font. Capturile la 360 px (pornirea, titlul ales, lansatorul în vedere, insignele Alt, H) sunt identice
    octet cu octet cu 552ac0c5 — nu se schimbă ce se vede.
  - LĂSATE: Font style / Underline style / Alignment (referința n-are valorile lor, R12-9).

## Cum se măsoară zona de atins (ca să nu iasă o cifră falsă)
- Lansatorul lărgit și benzile chenarului au acum dreptunghiul (getBoundingClientRect) cât zona de atins; zona EFECTIVĂ am măsurat-o
  și cu `document.elementFromPoint`, pixel cu pixel pe orizontala și verticala prin centrul văzut (`proba_grav.py › EFECTIV`):
  Font și Clipboard 32 × 33, Paragraph și Drawing 32 × 28 (butonul de deasupra e la 4 px în referință; mai mult l-ar acoperi), banda de
  sus a titlului ales 32, cea din stânga 32.
- Pe casetele NEALESE benzile nu se ating pe telefon (`display:none` în @media ≤ 480 px): mărite, ar fi acoperit textul casetei
  vecine (titlul și subtitlul Title Slide sunt la ~1 px una de alta la 360 px). Caseta se alege întâi atingându-i textul, apoi chenarul.
  E o alegere, nu un comportament dovedit (R12-10 a).
- Rămân sub 32 px, la fel ca în Word și Excel (cod comun, neatins): „More Options” de lângă Undo (17 × 39) și cele 3 butoane ale
  barei de stare (28 px înălțime).

## Ținta `diapozitiv` (alegerea de judecat)
- Clicul real din scenarii e pe un „loc gol” (scenarii_real/powerpoint-fundal-aplica-la-toate.json › cum: colțul gol 97 % × 97 %).
  Ținta are două elemente: întâi colțul de jos-dreapta (`.lh-ap-p-colt`, 6 % × 6 %, pe telefon cel puțin 32 × 32, SUB casete), apoi
  tot fundalul. Rulatorul O4 apasă centrul primului element: pe Title Slide centrul diapozitivului e în caseta de titlu
  ([120, 88, 720, 188] pt), deci n-ar fi „loc gol”. E o alegere de geometrie a țintei, nu un comportament dovedit — de judecat.

## Ce n-are referință
- `de_verificat.md`: R12-1 ordinea insignelor KeyTips · R12-2 închiderea fără întrebare / ✕ pe ultima prezentare · R12-3 culorile
  de temă · R12-4 geometria aspectelor noi · R12-5 mărimea imaginii / formei · R12-6 durata altor tranziții · R12-7 tipul fundalului
  neatins · R12-8 numele din Animation Pane · R12-9 Font style / Underline / Alignment · R12-10 zonele de atins pe telefon.
- `powerpoint-tragere-forma`: fără rezultat real (R11-5), deci O4 nu-l poate judeca.
