# Runda 12 (B-powerpoint) · criticul rece · unghiul ASPECT

## 1. Antet
- Cine: criticul rece al rundei 12. N-am văzut conversația constructorilor; n-am deschis `diferente.md`, `de_verificat.md`,
  `raport_constructor.md` și celelalte fișiere oprite.
- Uneltele mele: `runde/12/critic_probe/` — hamul `h.py` (copiat din `runde/12/h.py`: server pe 127.0.0.1 port liber, Chromium
  headless, rută care abandonează tot ce nu e 127.0.0.1/localhost; `plecate = []` în toate rulările), `m.py` (compară arborele
  desenat cu `rect_css` din `uia_powerpoint.json`, la 1366×768, factor 1,0; rădăcina aplicației e la [0, 0, 1366, 768]).
  Probele (gesturi reale `page.mouse` / `page.keyboard` / `page.touchscreen`, glisare prin CDP `Input.dispatchTouchEvent`):
  `a1.py` (P1 KeyTips, P2 Font Color, P3 închiderea), `a2.py` (P4 obiectele, P5 efectele), `b1.py` (listele și paletele noi față
  de `lista.*`), `b2.py` + `b3.py` (telefon 360 / 390, fereastra mică 1093×526 css = 1366×657 la 125%), `l1.py` (comenzile din
  drumurile lecțiilor), `m1.py` + `m2.py` (MINOR-urile vechi, fereastra fără prezentare), `r0-r3.py` (referința, pe chei).
  Ieșirile: `critic_probe/*_out.json`, capturile `*.png`. PowerPoint real NU a fost pornit.
- Diff-ul rundei (`git diff 32fe7fb1 -- aplicatii`, comiși 552ac0c5 + 2623887c): `powerpoint.js` +666/−77 (KeyTips, fereastra
  „Save your changes”, prezentările multiple, listele `lista.*` din referință, culorile, imaginea / formele / lipirea obiectului,
  Duration, Animation Pane, Format Background, zonele de atins pe telefon); `date/powerpoint.json` regenerat (11 suprafețe noi);
  `aplicatii.css` +32 (regulile `.lh-ap-p-*`, `.lh-ap-powerpoint .lh-ap-strat-backstage`, blocul `@media (max-width:480px)`).

## 2. A. Cele 5 GRAV din runda 11

### P1 — KeyTips: **ÎNCHIS**
- Gestul (`a1.py`): clic în titlul „Vulcanii” (cursorul în text), `Alt` → 19 insigne (QAT 1-4, file F H N JI G K A S P R W Y,
  ZS, ZR, Q), un eveniment `tasta_acces / arata_taste_acces`; `H` → insignele Home (`tasta_acces / fila / fila:Home`); `1` →
  `{g:'tasta_acces', a:'aldin', t:'panglica:Home/Font/Bold'}`, insignele dispar, `formatare_text = {text:'Vulcanii', bold:true}`,
  pe ecran ambele bucăți `font-weight 700`. Nicio literă în text: la capătul probei `texte = [["Vulcanii","Ce sunt"],["B"]]`.
- `Alt, H, F` → insignele FP FO FF FS FG FK FC FN FD (prefix); `S` → focusul în caseta Font Size (valoarea „60”), „40” + Enter →
  `marime 40`. `Alt, H, I` → `lista.SlideNewGallery` deschisă, insignele D L R (ca `Alt, H, I, D/L/R` din referință). `Alt, A, C`
  → `panou.AnimationCustom`. Esc urcă un nivel (`Alt, H, Esc` → insignele filelor; încă un Esc → nimic).
- Rămâne (nu ține GRAV-ul deschis): locul insignelor și comportamentul Esc într-o listă deschisă nu au referință (README_referinte.md:148
  „Necapturate: … KeyTips afișate”) → [FARA_REFERINTA].

### P2 — Font Color: **ÎNCHIS** (comportamentul); aspectul paletei → GRAV A2 mai jos
- Drumul m1-l06:147 (`a1.py › p2`): clic în titlu → clic pe chenar (`margine_forma:1/1` → `alegere_forma`) → Font Color ▾ →
  `meniu:Dark Blue` → `culoare_text = "#002060"`, pe ecran `rgb(0, 32, 96)`, miniatura la fel; Ctrl+Z → `#000000`. Fără text ales,
  Font Color e gri (`aria-disabled`), ca `a_font_color › buton_fara_text_ales › activ:false` din referință.
- Mini-bara (`b1.py`): clic dreapta pe text → `meniu_contextual.text`, ▾ din Font Color („Font Color Red”) → `lista.FontColorPicker_minibara`
  → Blue → `culoare_text = "#0070C0"`. Panglica: ▾ → Red → `#FF0000` (= `scenarii_real/powerpoint-font-color-titlu.json`).

### P3 — Închiderea și fișierele: **DESCHIS** (reparație parțială)
- Ce merge (`a1.py › p3`): după o modificare, `Ctrl+W` → `intrebare_salvare`, fereastra cu `dialog = {titlu:'', intrebare:'Save your
  changes to this file?', butoane:['More options…','Save',"Don't Save",'Cancel']}` (= `scenarii_real/powerpoint-ctrl-w-modificat.json`),
  focusul în caseta File name cu textul titlului (b_ctrl_w: „Vulcanii 0”); Esc / Cancel → prezentarea rămâne; File › Close și ✕
  (`bara_titlu:Close`) → aceeași fereastră; Don't Save → `prezentari_deschise 0`, `prezentare_activa null`, bara de titlu „PowerPoint”,
  gri exact cele din `acoperire_r11.fapte › b_dont_save › comenzi_activ` (Paste, New Slide, Bold, Font Color gri; File și Home active);
  `Ctrl+N` → „Presentation2  -  PowerPoint”, diapozitivul Title Slide (b_ctrl_n_din_fereastra_goala); încă un Ctrl+N → Presentation3,
  2 prezentări (b_ctrl_n_cu_prezentare); `Ctrl+O` → Backstage › Open (b_ctrl_o).
- Ce rămâne: **Ctrl+O → Browse** dă `{a:'nesimulat', t:'backstage:Browse'}`, mesajul „În aplicația reală, „Browse” funcționează; aici
  nu e simulată.” Drumul m1-l03/index.html:241 și :243 („Ctrl+O → Browse (Răsfoire) → Documente → Plante_6A_Pop.pptx → Open”) se
  oprește tot acolo — exact pasul pe care critic 11 îl numea în P3. Fereastra Open a PowerPoint nu e capturată (`uia_powerpoint.json`
  n-are `dialog.open`; Word o are din runda `acoperire` 18.11), deci reparația cere întâi captura. Tot în m1-l03 (:105, :108),
  „Blank Presentation” din File › New dă `nesimulat` (`m1.py › blank`).

### P4 — Obiectele de pe diapozitiv: **DESCHIS** (reparație parțială)
- Ce merge (`a2.py › p4`): Layout ▾ → Two Content → `{aspect:'Two Content', texte:['Steaua noastră'], forme:3}` (= `scenarii_real/
  powerpoint-two-content-layout.json`); Pictures ▾ → This Device... → fereastra `dialog.PictureInsertFromFilePowerPoint` → nume +
  Enter → o formă nouă (`fel: imagine`); Shapes ▾ → Arrow: Right → clic pe diapozitiv → `{fel:'forma', forma:'Arrow: Right'}` (=
  `scenarii_real/powerpoint-sageata-dreapta.json`), desenată ca săgeată SVG la punctul clicului; săgeata aleasă + Ctrl+C → miniatura 1
  → Ctrl+V → aceeași formă, același loc [288, 324, 72, 72].
- Ce rămâne: **drumul m1-l05/index.html:188 „clic pe stea → Ctrl+C → miniatura „Planetele” → Ctrl+V”**. Steaua inserată (Star: 5
  Points), apoi clic pe ea: `{a:'cursor_text', t:'forma:1/4'}` (cursorul intră în textul gol al stelei); `Ctrl+C` → `fara_efect`, fără
  niciun mesaj; `Ctrl+V` pe miniatura 2 lipește ce era înainte în clipboard (săgeata), nu steaua (`a2_out › p4_stea_cv`). La fel pe
  m2-l10: clic pe săgeată → `cursor_text`, Ctrl+C → `fara_efect` (`l1_out › m2-l10`). Copierea merge doar dacă elevul nimerește
  chenarul dreptunghiului care încadrează steaua (`margine_forma`), unde nu se vede nicio linie. Ce face clicul pe o formă fără text în
  PowerPoint real nu e în referință → [FARA_REFERINTA]; dar drumul scris în lecție nu se duce la capăt pe poligon. În plus, formatul
  `start` (api §7.1: `diapozitive [{aspect, texte}]`) nu poate pune o stea / o imagine pe diapozitiv, deci m1-l05, m1-l06 (stea,
  dreptunghi, cerc) și m2-l09 („clic pe imaginea Pământului → Delete”) nu-și pot încărca diapozitivele de pornire.

### P5 — Duration, Animation Pane, Format Background: **ÎNCHIS** la 1366×768 (pe fereastra mică → GRAV A3)
- Duration (`a2.py › p5`): după Fade caseta arată „00,70”, `durata_tranzitie [0.7, 2, 2]`; clic în casetă, Ctrl+A, „0,5”, Enter →
  „00,50”, `[0.5, 2, 2]`; Apply To All → `[0.5, 0.5, 0.5]` (forma lui `scenarii_real/powerpoint-durata-aplica-la-toate.json`);
  miniatura 3 → caseta „00,50”. Caseta nu mai e `readOnly`.
- Animation Pane: Fade pe titlu, Fly In pe subtitlu (ales prin chenar), Animation Pane → 2 rânduri alegibile (`fereastra:On Click\n
  Entrance\nFade : Title 1: Vulcanii ` …); rândul 1 ales → Move Up gri, Move Down activ (= `acoperire_r11.fapte › d_efecte ›
  animation_pane › rand_1_ales`); rândul 2 → Move Up activ; Move Up → `ordine_animatii [2, 1]` (= `scenarii_real/powerpoint-
  animatii-move-up.json`).
- Format Background: clic dreapta pe diapozitiv → Format Background... → Solid fill → Color ▾ (are „Automatic”, ca
  `lista.FormatBackground_Color`) → Light Blue → diapozitivul 1 și miniatura lui `rgb(0, 176, 240)`, caseta Color „Fill Color
  RGB(0, 176, 240)”; Apply to All → `fundal_diapozitive` = 2 × `#00B0F0` (= `scenarii_real/powerpoint-fundal-aplica-la-toate.json`),
  ambele miniaturi albastre; Reset Background gri (referința: `stari › Reset Background: False`).

### Drumurile lecțiilor, pe poligon (1366×768)
| lecția | se duce la capăt? | unde se blochează elevul |
|---|---|---|
| m1-l02 | NU | zona de note (:179, :187), View › Notes (:216), Notes / Slide Sorter / Normal / Slide Show din bara de stare (:222, :225) → toate `nesimulat` (`l1_out`, `m1_out › notes_bara`). New Slide, Table, F5 și clicurile merg; ✕ + „Save your changes” merge acum |
| m1-l03 | NU | File › New › Blank Presentation (:105) și Ctrl+O › Browse (:241) → `nesimulat` (P3). Ctrl+N, Ctrl+S / F12 → Save As, Browse din Save As, File › Close → Save merg |
| m1-l05 | NU | „clic pe stea → Ctrl+C” (:188): clicul pune cursorul în stea, Ctrl+C tace, Ctrl+V lipește altceva (P4); steaua nu poate fi în `start`. Duplicate Slide, Delete, Ctrl+Z, tragerea miniaturii merg |
| m1-l06 | NU | Shape Fill ▾ (:172, :177) → `nesimulat`; Background Styles ▾ (:197, :207) → `nesimulat`. Font Color și Format Background › Solid fill › Color › Apply to All merg la 1366×768 (pe fereastra mică Apply to All e tăiat — GRAV A3) |
| m1-l07 | NU | Animations › Start: After Previous / With Previous (:217, :225) → `nesimulat`. Fade / Push / Wipe, Duration, Apply To All, Animation Pane cu ▲, None, Appear, F5 merg |
| m2-l08 | NU | Font ▾ → Calibri Light (Headings) (:161, :167): lista fonturilor → `nesimulat`. Font Size, Font Color merg |
| m2-l09 | NU | „clic în zona de note” (:324, :329): zona de note nu există (Notes → `nesimulat`, ca la m1-l02:179); diapozitivul cu imaginea Pământului nu se poate încărca (P4). Two Content, Pictures › This Device (:242, cu numele tastat; lista de fișiere a ferestrei e goală), New Slide, F5 merg; „Click to add title” nu apare pe ecran (vezi [FARA_REFERINTA]) |
| m2-l10 | da, cu greutate | Two Content, Pictures, Shapes › Arrow: Right, Fade + Duration 0,5 + Apply To All, Fade pe săgeată, F5 merg; dar Arrow: Right se găsește doar ghicind între 190 de pătrate identice (GRAV A1) |
| jocuri/prezentari-vi | NU | Shape Fill (15 apariții), Shape Outline (9), Background Styles (7) → `nesimulat`; Font Color, Pictures, Two Content, Close merg |

### MINOR-urile din critic 11 §6
- `modificat` după Ctrl+Z făcut după salvare: **făcut** (`m1_out › M1_modificat`: tastare true → Ctrl+S false → Ctrl+Z true → Ctrl+S
  false → Ctrl+Y true).
- După ștergerea ultimului diapozitiv: **făcut** (`diapozitive []`, `diapozitiv_activ null`; Ctrl+Z → 1 diapozitiv, activ 1).
- Font style / Underline style / Alignment la OK: **nefăcut** (lăsat de constructori, gata_pentru_critic.md:49).
- Telefon, zone sub 32 px: **parțial** — chenarul titlului ales are 32 px (`b2_out › tap_chenar [121, 354, 194, 32]`), dar paletele
  (28×24), grila Table (27×27), galeria Shapes (24×24), Font Color ▾ (20×32) și butoanele noii ferestre (Save 70×24) rămân sub 32.
- `margine_forma` în lista felurilor de ținte: **făcut** (api_biblioteca.md:129-131).
- „Insert Table...” scris de mână: **făcut** (vine acum din `lista.TableInsertGallery`, vezi C).
- `.lh-ap-strat-backstage` comun redefinit: **făcut** (aplicatii.css:412 e acum `.lh-ap-powerpoint .lh-ap-strat-backstage`; regula comună
  de la :126 a rămas `z-index:25`).
- Rândurile din Animation Pane `aria-hidden`: **făcut** (sunt `ListItem` cu ținta `fereastra:<nume>`).
- Asistentul care numără pașii pregătitori: **nefăcut** (era „de semnalat, nu de reparat aici”).

## 3. B. Unghiul aspect (PowerPoint): constatări noi

### GRAV A1 — Galeria Shapes ▾: 190 de pătrate identice, fără titlurile grupurilor și fără nume; elevul nu poate găsi „Arrow: Right”
- Gestul (`b1.py`, captura `b1_shapes.png`): Insert › Shapes ▾. Fiecare rând (`ListItem`) e desenat cu același `<span class=
  "lh-ap-p-ic-forma">` (powerpoint.js:262), iar regula lui e una singură pentru toate: `.lh-ap-p-ic-forma{…border:1px solid #6b6b6b;
  border-radius:2px}` (aplicatii.css:398) — pe ecran 190 de pătrățele rotunjite la fel, între care linia, ovalul, steaua și săgeata nu
  se deosebesc. Titlurile celor 10 grupuri au text gol pe ecran (`shapes_viz › grupuri: [['Recently Used Shapes',''], ['Lines',''],
  … ['Block Arrows',''] …]`), iar rândurile n-au `title` (doar `aria-label`), deci nici ținând mouse-ul pe ele nu apare numele.
- Referința: `lista.ShapesInsertGallery` are 190 de `ListItem` cu nume diferite („Line”, „Oval”, „Arrow: Right”, „Star: 5 Points”…) în
  10 grupuri cu nume; fiecare grup are deasupra rândurilor o bandă de 28 px fără elemente — locul titlului (ex. `Group 'Recently Used
  Shapes' [321, 161, 288, 84]`, primul rând `Text Box` la y = 189; `Group 'Lines' [321, 245, …]`).
- Lecția: m2-l10/index.html:307 „Insert → Shapes → Arrow: Right → clic sub rând”; m1-l06 cere stea / dreptunghi / cerc. Pe poligon
  elevul nu are nimic după care să recunoască săgeata: nici desenul, nici titlul „Block Arrows”, nici numele la hover. O4 trece
  (rulatorul apasă ținta `meniu:Arrow: Right`), elevul nu. Elevul învață că galeria e un perete de pătrate gri.
- În plus: lista se deschide la y = 3 (`sim_rect [322, 3, 309, 764]`), peste bara de titlu și file, față de y = 159, lipită sub buton, în
  referință (`[319, 159, 309, 849]`; în captură lista trece de marginea de jos a ferestrei pentru că monitorul era mai înalt —
  cum se poartă pe un ecran de 768 nu e capturat). Cele 12 „Action Button: …” au dreptunghiul 0×0 (nu se văd nici derulând).

### GRAV A2 — Paletele de culori fără „Theme Colors” / „Standard Colors” și fără numele culorii: textul lecției devine fals
- Gestul (`b1.py`, captura `b1_fontcolor.png`): Font Color ▾ (panglică și mini-bară) și Format Background › Color ▾. Grupurile
  „Theme Colors” și „Standard Colors” sunt în DOM, dar textul lor de pe ecran e gol (`fontcolor_txt: ["Group","Theme Colors","",…],
  ["Group","Standard Colors","",…]`; la fel `fbcolor_txt`): deasupra pătratelor rămâne o fâșie albă goală. Pătratele au doar
  `aria-label` (powerpoint.js:250-254), fără `title`: numele culorii nu apare la hover.
- Referința: `lista.FontColorPicker › Group 'Theme Colors' [532, 192, 280, 66]` cu primul rând la y = 224 (32 px de titlu) și `Group
  'Standard Colors' [532, 392, 280, 69]` cu „Dark Red” la y = 427 (35 px de titlu); la fel `lista.FontColorPicker_minibara` și
  `lista.FormatBackground_Color`. Numele culorilor sunt 70 de rânduri distincte (`acoperire_r11.fapte › randuri.lista.FontColorPicker`).
- Lecția: m1-l06/index.html:143 — „Apeși săgeata ▾ de lângă A și alegi: sus sunt Theme Colors (Culori temă) …, jos Standard Colors
  (Culori standard). Numele culorii apare când ții mouse-ul pe ea.”; :147 „Dark Blue (albastru închis), din Standard Colors”; :159
  „alb (pătrățelul alb din Culori temă / Theme Colors)”; m2-l08 „negru (Culori temă)”. Pe poligon nicio parte din această frază nu e
  adevărată, iar „Dark Blue” și „Blue” (#002060 / #0070C0, alăturate în rândul de jos) se deosebesc doar după nuanță — elevul nu poate
  verifica dacă a ales culoarea cerută. Valorile #RRGGBB ale culorilor de temă sunt [presupus] (powerpoint.js:572-578).

### GRAV A3 — Pe fereastra mică (1366×657 la 125%) și pe telefon, „Apply to All” din Format Background e tăiat și nu se poate atinge
- Gestul (`b3.py`): fereastra 1093×526 css; clic dreapta pe diapozitiv → Format Background... Panoul are 520 px înălțime, fix, iar zona
  de lucru are `overflow: hidden` cu `clientHeight 320` (aplicatii.css:349; lanțul: `["lh-ap-p-zona","hidden","hidden",523,320]`).
  „Apply to All” stă la y = 668, sub marginea ferestrei (526): `document.elementFromPoint` în centrul lui nu-l atinge (`lovit: null`).
  Șase rotiri de rotiță peste panou nu schimbă nimic (`apply_dupa_gest` identic: y = 668). Pe telefon 360 × 740 și 390 × 844: y = 730,
  sub capătul zonei (609); trei glisări în sus nu-l aduc (`lovit` null / `HTML`). Reset Background la fel. Cauza: powerpoint.js:828
  `p.style.height = Math.min(s.r[3], ZR[3] - 4)` — `ZR` e zona din REFERINȚĂ (564 px), nu zona de pe ecran.
- Referința: în `panou.LaunchFormatBackground#Solid fill`, „Apply to All” [1095, 701, 80, 24] și „Reset Background” [1184, 701, 113, 24]
  stau ÎN AFARA panoului derulabil `Pane [1095, 278, 255, 417]` care are propria bară `ScrollBar [1333, 278, 17, 417]`: în PowerPoint
  conținutul se derulează, butoanele rămân jos, la vedere.
- Contractul: I1 (contract.md:42, api_biblioteca.md:301) — biblioteca trebuie să meargă la 1366×657 cu 125%. Lecția: m1-l06/index.html
  :205, :207, :265 („… Light Green, apoi butonul Apply to All, jos în panou”) — pe laptopul elevului exercițiul nu se poate termina.
  (O probă cu `scrollIntoView` îl „găsește”, pentru că derulează programatic un `overflow:hidden`; un om nu poate.)

### GRAV A4 — Comenzi de pe drumul lecțiilor care tot dau doar „aici nu e simulată” (în afara P1-P5; găsite la tabelul drumurilor)
- `l1.py` / `m1.py`, cu clicuri adevărate: zona de note, care nu există (m1-l02:179, :187; m2-l09:324, :329); View › Notes, Notes /
  Slide Sorter / Normal / Slide Show din bara de stare (m1-l02:216, :222, :225); File › New › Blank Presentation și Open › Browse (m1-l03:105, :241); Shape Fill ▾ pe steaua aleasă (`meniu_derulant:Shape
  Format/Shape Styles/Shape Fill` → `nesimulat`, m1-l06:172, :177 și 15 locuri în `jocuri/prezentari-vi`); Background Styles ▾
  (m1-l06:197, :207); Animations › Start ▾ (`panglica:Animations/Timing/Start` → `nesimulat`, m1-l07:217, :225); Font ▾ (lista
  fonturilor → `nesimulat`, m2-l08:161, :167). Toate cu mesajul `data-lh-nesimulat`.
- Contractul: api_biblioteca.md:84-87 („Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate”), R12
  (contract.md:38). Critic 11 le-a scăpat (tabelul lui dădea m1-l02 „aproape”); nu sunt din unghiul aspect, dar blochează 6 lecții și
  jocul, deci le număr. Unele cer întâi captură (lista Font, Start ▾, Shape Fill ▾, Background Styles ▾ nu sunt în `lista.*`).

### Restul unghiului aspect (fără GRAV)
- **Fereastra „Save your changes to this file?”** (`a1.py`, `a1_dialog.png`): dreptunghiul [454, 228, 460, 321] față de [453, 227, 460, 321];
  copiii la 1-3 px; ordinea butoanelor More options… / Save / Don't Save / Cancel = referința (`butoane_ordine`); focusul și textul selectat
  în File name ca `focus: [Edit 'File name']`. Abateri MINOR: întrebarea e scrisă în bara de titlu, deși `TitleBar ''` e gol în referință
  (sub el, în fâșia 258-331 unde Pane-ul referinței are loc liber, simulatorul nu scrie nimic); caseta Save as type de 40 px arată „Pov”
  tăiat; toate butoanele au același stil gri. Enter în File name = Save și închiderea (`activat: 'fereastra:Save'`), deși referința dă
  `implicit: false` la toate butoanele (b_ctrl_w) → [FARA_REFERINTA].
- **Fără prezentare** (`m2.py`): diapozitivul și miniaturile ascunse, zona gri, bara de titlu „PowerPoint” (= b_dont_save) — dar bara de stare
  scrie „Slide 1 of 0” cu `diapozitiv_activ: null` (MINOR, ecranul spune ce starea nu spune).
- **Animation Pane** (`a2_pane.png`): panoul la [1104, 184] față de [1098, 218] (34 px mai sus, peste locul legendei panoului, care nu e
  desenată); rândurile la 26 px pas, 24 înălțime, față de 22 / 22; textul rândului „1  Fade : Title 1: Vulcanii” diferă de `data-lh-eticheta`
  („On Click\nEntrance\nFade : …”, §3 „eticheta = textul de pe ecran”); cu un rând ales butonul rămâne „Play All”, deși referința îl numește
  atunci „Play From” (`rand_1_ales › Play From: true`). MINOR.
- **Format Background** (`a2_fb.png`): aceeași deplasare de 34 px; după Solid fill niciun buton radio nu apare bifat, deși
  `fundal_diapozitive = [{tip:'solid'…}]` (MINOR, ecran ≠ stare); fila „Fill” (`ListItem` 32×32, pictogramă în real) scrisă ca text.
- **Layout / New Slide ▾** (`b1_layout.png`): numele și ordinea celor 9 aspecte = referința, dreptunghiurile la 3 px; dar celulele nu au
  miniaturi (doar numele, centrat), titlul grupului „Office Theme” lipsește, iar „Content with Capti…” se suprapune peste vecina (MINOR).
- **Pictures ▾ / Table ▾**: rândurile și grila = referința (rel 0 px; deplasare 3 px); titlul grilei („1x1 Table”, banda de 30 px) e gol (MINOR).
- **KeyTips**: Esc într-o listă deschisă cu `Alt, H, I` lasă lista New Slide pe ecran și pune peste panglică insignele Home
  (`p1_hi_esc`) → [FARA_REFERINTA].
- **Diapozitivul după gest**: culoarea textului, fundalul (diapozitiv + miniaturi), săgeata, caseta lipită, Two Content (3 forme la
  `pozitii_forme` [66,144,408,343] / [486,144,408,343]) — ecranul măsurat în puncte = `pozitii_forme` la punct (`p4_two_ecran`,
  `p4_arrow_ecran`, `p4_cv_ecran`). Imaginea inserată e un dreptunghi cu gradient albastru-portocaliu, centrat, peste caseta goală din
  dreapta (`a2_poza.png`) — mărimea / locul [presupus] de constructori.
- **Caseta Duration**: [1093, 113, 46, 19] față de `panglica.TabTransitions › Spinner 'Duration' [1091, 111, 46, 19]`; scrisă în forma
  referinței („02,00” înainte, „00,70” după Fade, „00,50” după „0,5” + Enter și după Apply To All, pe orice miniatură); activă, ca în
  referință. Valoarea de după Fade: vezi [FARA_REFERINTA] (referința se contrazice).
- **Ținta `diapozitiv`**: `.lh-ap-p-colt` [1170, 685, 54, 30], transparentă, fără chenar, `z-index 1` sub casete; nu se vede nimic în plus
  pe ecran și clicul dreapta pe ea deschide meniul diapozitivului; pe telefon 32×32 la colț. N-am găsit un caz în care să fure clicul
  elevului (casetele stau deasupra).
- **Telefon / fereastra mică** (`b2.py`): Font Color, Format Background › Color, Layout, Table încap întregi; Shapes se derulează în
  listă; fereastra „Save your changes” încape pe fereastra mică [454, 204, 460, 321], iar pe 360 px începe la x = −26 (26 px tăiați la
  stânga, nederulabili; butoanele se ating după derulare laterală) — MINOR.

## 4. C. Fidelitatea generată din date
- `python aplicatii/_unelte/genereaza_powerpoint.py --verifica` → „chei diferite față de generarea de azi: 0”, ultima linie `0`
  (`critic_probe/c_verifica.log`); `git status -- aplicatii` curat după rulare.
- `critic_probe/c_date.out` (Python pe chei): `date/powerpoint.json` are 51 de suprafețe din cele 52 ale referinței (lipsește tot
  `zona_document`, cadrul gol). La toate cele 11 suprafețe noi, mulțimea etichetelor din date = mulțimea etichetelor din
  `uia_powerpoint.json` (FontColorPicker 78 / 78, _minibara 78 / 78, save_your_changes 13 / 13, Pictures 5 / 5, Shapes 190 / 190,
  Table 47 / 47, SlideNewGallery 17 / 17, SlideLayoutGallery 13 / 13, AnimationCustom#doua_animatii 6 / 6, LaunchFormatBackground#Solid
  fill 18 / 18, FormatBackground_Color 79 / 79): 0 etichete în plus, 0 lipsă. „Claude” apare de 0 ori.
- „Insert Table...” scris de mână a dispărut: în date vine din `lista.TableInsertGallery` („Alt, N, T, I”); în powerpoint.js:1190-1191 doar
  se recunoaște rândul ca să deschidă fereastra.
- Etichete compuse în cod (nu în date): „Fill Color RGB(r, g, b)” (powerpoint.js:257; forma din referință „Fill Color RGB(255, 255, 255)”),
  numele rândurilor din Animation Pane (powerpoint.js:862, forma referinței; numele formelor altele decât Title / Subtitle [presupus]),
  textul vizibil al acelor rânduri „1  Fade : …” (powerpoint.js:868 — nu e în referință) și „Slide N of M” (powerpoint.js:411, care dă
  „Slide 1 of 0” fără prezentare). Abatere R4 doar la textul vizibil al rândurilor → MINOR.

## 5. D. Regresul Word și Excel — nimic stricat în runda asta
- Ce s-a atins comun: doar `aplicatii.css`. Regula din runda 11 `.lh-ap-strat-backstage{position:absolute;inset:0;z-index:30;…}` (care
  ajungea și la Word / Excel) a devenit `.lh-ap-powerpoint .lh-ap-strat-backstage` (aplicatii.css:412); Word / Excel au din nou
  `z-index:25` (:126) plus `.lh-ap-strat{position:absolute;inset:0;overflow:auto;z-index:30}` (:125). Blocul `@media` nou are doar
  selectori `.lh-ap-powerpoint` / `.lh-ap-p-*`.
- `critic_probe/d1.py`: `aplicatii/` din 32fe7fb1 prin `git archive` într-un dosar din %TEMP% (șters la final, `tmp_sters: true`) față de
  worktree-ul de acum, `poligon.html?aplicatie=word|excel`: dreptunghiurile `[data-lh-tip]` identice (Word 136 / 197 / 235, Excel 227 / 289 /
  323 la pornire / File / F12; telefon 360: 136 și 227) și capturile identice la pixel (0 pixeli diferiți în toate 8).
- Gesturile, identice vechi / nou (`d1_out › g_word`, `g_excel`): Word — tastarea („ proba”), `Alt, H, 1` (`tasta_acces` arata / fila /
  `format_la_scriere`), Ctrl+Z, F12 → „Tema” + Enter → `Tema.docx`, „Tema  -  Word”; Excel — F2 = 7, F3 = `=1+2` (3), Ctrl+Z (F3 golită),
  ▾ de la Σ (`meniu_derulant`).
- Probele vechi: `runde/5/proba_grav.py` → `picate: []`, `0`; `runde/4/proba_telefon.py` → `picate: []`, `0`; `runde/10/proba_grav.py` →
  `0`. Ea a scris un fișier nou `runde/10/proba_grav.json`: mutat în %TEMP%. `git status --short` după: nimic în `runde/2` … `runde/10`
  și nimic urmărit schimbat în `runde/11`; în `runde/11` rămân doar fișiere neurmărite care existau dinainte de mine (`acoperire/*.bak`,
  `acoperire/scenarii_inainte/` din 06:22-06:40, `critic_probe/.temp_cale_nu_comite`), plus `runde/12/critic.md` și `critic_probe/` ale mele.

## 6. [FARA_REFERINTA] (nu se numără GRAV; de dus la proba omului / în `de_verificat`)
- **Durata după Fade — referința se contrazice**: `acoperire_r11.fapte › d_efecte › duration_dupa_fade = {valoare_uia:"02,00", com:2.0}`
  și `dupa_apply_to_all` = 3 × 2,0, dar `scenarii_real/powerpoint-durata-aplica-la-toate.json › durata_tranzitie = [0.7, 0.7, 0.7]` (aceeași
  zi, alt drum). Simulatorul arată „00,70”. De lămurit pe un PC: ce scrie Duration imediat după clic pe Fade.
- **Durata după Push / Wipe**: rămâne cea dinainte („00,50”); valoarea implicită a altor tranziții nu e capturată (R12-6 al constructorilor).
- **Clicul pe o formă fără text** (stea, săgeată): simulatorul pune cursorul în ea (`cursor_text`), deci Ctrl+C tace; m1-l05:188 și
  m2-l10 presupun că clicul alege forma. Necapturat — dar decide dacă P4 se închide.
- **Enter în File name** din „Save your changes” = Save + închidere; referința dă `implicit:false` la toate butoanele.
- **KeyTips**: locul insignelor; Esc cu lista New Slide deschisă lasă lista pe ecran (README_referinte.md:148, „KeyTips afișate” necapturate).
- **Substituenții goi** nu arată „Click to add title / subtitle / text” (nici pictogramele de conținut); m2-l09 („Click to add title →
  Fotbalul”) le citește. UIA nu expune diapozitivul (README_referinte.md:141), deci fără referință. Exista dinainte de runda 12.
- **Imaginea pe Two Content**: se adaugă ca formă nouă (`forme` 4), peste caseta goală din dreapta; dacă PowerPoint o pune în caseta goală
  nu e capturat.
- **Numele la hover** (culori, forme): „sfaturile pe hover” nu sunt capturate (README_referinte.md:148); lecția m1-l06:143 le promite.
- **Locul listelor lungi pe un ecran de 768**: Shapes (849 px) și Format Background › Color (care în captură iese la x = 1566, dincolo de
  fereastră) au fost capturate pe un monitor mai mare; cum le așază PowerPoint pe 1366×768 nu se știe.

## 7. MINOR
- Toate listele `lista.*` sunt la +3, +3 px față de referință (Font Color [533, 150] / [530, 147], Layout [176, 110] / [173, 107] …), pentru
  că butoanele panglicii sunt deja decalate; în interiorul listelor 0 px (`b1_out › rel_dif` = 0).
- Shapes: lista acoperă bara de titlu și filele (y = 3); 12 „Action Button: …” cu dreptunghi 0×0; bara de derulare închisă la culoare.
- „More Colors... ⌄” și „Eyedropper ⌄” au o săgeată ▾ care nu e în referință (`MenuItem` fără copii) — desenul generic al unui MenuItem.
- Layout / New Slide fără miniaturi, fără „Office Theme”, „Content with Capti…” peste vecina; grila Table fără titlu.
- „Save your changes”: întrebarea în bara de titlu (`TitleBar ''` în referință), „Pov” tăiat în Save as type, butoane de același stil; pe
  360 px fereastra începe la x = −26.
- Fără prezentare: bara de stare „Slide 1 of 0” (powerpoint.js:411) cu `diapozitiv_activ null`.
- Animation Pane și Format Background: 34 px mai sus decât referința, fără legenda panoului; rândurile 24 / 26 px față de 22 / 22; textul
  rândului ≠ `data-lh-eticheta`; „Play All” în loc de „Play From” cu un rând ales; Solid fill nebifat pe ecran deși starea spune `solid`;
  fila „Fill” scrisă ca text.
- Telefon (api_biblioteca.md:301, ≥ 32 px): paletele 28×24, grila Table 27×27, Shapes 24×24, Font Color ▾ 20×32, butoanele ferestrei
  „Save your changes” 70×24 / 88×24.
- Butonul Font Color din panglică, cu text ales, se cheamă „Font Color”; referința: „Font Color Red” (`a_font_color › buton_cu_text_ales`).
- Textul lecțiilor m2-l09:242 / :246 („This Device → pamant.png → Insert”): butonul ferestrei e „Open” în referință
  (`dialog.PictureInsertFromFilePowerPoint › SplitButton 'Open' [529, 426, 88, 26]`) și în simulator — R11, de corectat în lecție.
- Font style / Underline style / Alignment tot neaplicate la OK (din critic 11).

## 8. Ce a trecut
- P1 (KeyTips) și P2 (Font Color) închise; P5 închis la 1366×768; din P3 și P4, tot ce nu e trecut la „rămâne”.
- Cele 11 liste / ferestre / panouri noi: numele, ordinea și așezarea interioară = referința (0 px în interior); paleta are cele 70 de
  culori, „High-contrast only” gri ca în referință, „Automatic” doar în Format Background › Color.
- „Save your changes”: dreptunghiul la 1 px, copiii la ≤ 3 px, ordinea butoanelor, focusul în File name cu numele titlului; Cancel / Esc /
  Don't Save / Save; fără prezentare: titlul „PowerPoint” și exact comenzile gri din `b_dont_save`; Ctrl+N = Presentation2 / Presentation3.
- Diapozitivul după gest: culoarea textului (diapozitiv + miniatură), fundalul pe unul / pe toate (diapozitiv + miniaturi), săgeata și caseta
  lipită la `pozitii_forme`, Two Content cu 3 forme — ecranul = starea, la punct.
- Ținta `diapozitiv` din colț: invizibilă, sub casete, clicul dreapta merge.
- Fereastra mică: Font Color, Format Background › Color, Layout, Table, „Save your changes” încap; Shapes se derulează.
- C: `--verifica` = 0, 0 etichete în afara referinței la cele 11 suprafețe, „Claude” 0, „Insert Table...” din referință.
- D: Word și Excel neatinse (dreptunghiuri, pixeli, gesturi, probele 5 / 4 / 10 = 0).

GRAV_VECHI_DESCHISE: 2
GRAV: 4
