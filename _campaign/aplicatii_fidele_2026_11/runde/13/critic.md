# Runda 13 (B-powerpoint) · criticul rece · unghiul GEST_TASTATURA

## 1. Antet
- Cine: criticul rece al rundei 13. N-am văzut conversația constructorilor; n-am deschis `diferente.md`, `de_verificat.md`,
  `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`, `prompt.md` și celelalte fișiere oprite.
- Uneltele mele: `runde/13/critic_probe/`. Hamul `h.py` (copiat din `runde/12/critic_probe/h.py`: server pe 127.0.0.1 port liber,
  Chromium headless, `ctx.route('**/*')` care abandonează tot ce nu e 127.0.0.1/localhost; `plecate = []` în toate rulările) și
  `k.py` (focusul `document.activeElement`, insignele KeyTips de pe ecran, lista deschisă, starea pe chei). Probele, toate cu gesturi
  adevărate (`page.keyboard`, `page.mouse`, `page.touchscreen`, CDP `Input.insertText` / `Input.imeSetComposition` /
  `Input.dispatchTouchEvent`): `a1.py` (P3, P4, A1, A2, A4), `a2.py` (fonturile pe ecran, paletele, adresa Open), `a3.py` (A3: fereastra
  mică 1093×526 css la 125 %, telefon 360×740 și 390×844), `b1.py` (27 de șiruri KeyTips), `b2.py` (ferestrele, scurtăturile pe obiecte
  și miniaturi, vederile, notele, F5), `b3.py`, `b4.py` (caseta Font R13-4, Home/End în liste, asistentul, telefonul), `b5.py` (Shape
  Format, Weight, substituenții goi), `m1.py` (MINOR vechi), `r0-r4.py` / `c0-c2.py` (referința și datele, pe chei).
  Ieșirile: `critic_probe/*_out.json`, `*_out.txt`, `*.log`. PowerPoint real NU a fost pornit; nici Word / Excel real.
- Diff-ul rundei (`git diff 7ab108fe -- aplicatii`, comiși 6751b1f6 + bc23d64e): `powerpoint.js` +641/−43 net pe 4 fișiere (clicul pe
  formă = obiect, `start` cu forme / fonturi / fișiere, Blank Presentation, fereastra Open, listele Font / Start / Shape Fill / Outline /
  Weight / Background Styles, zona de note, View › Notes, bara de stare cu 5 vederi, Shapes cu titluri / desene / `title`, paletele cu
  titluri și `title`, `potrivestePanou` pentru panourile pe ecran mic, KeyTips pe comenzile noi), `date/powerpoint.json` regenerat
  (8 suprafețe noi), `aplicatii.css` (28 de rânduri, doar `.lh-ap-powerpoint …` / `.lh-ap-p-…`), `_unelte/genereaza_powerpoint.py` (+3).

## 2. A. Cele 6 GRAV din runda 12

### P3 — Închiderea și fișierele: **ÎNCHIS**
- Blank Presentation, cu mouse-ul (`a1_out › P3_blank_mouse`): File › New › „Blank Presentation” → `{g:'clic', a:'prezentare_noua',
  t:'backstage:Blank Presentation'}`, `prezentare_activa: "Presentation2"`, `prezentari_deschise: 2`, `backstage: null`, un Title Slide
  gol (= `acoperire_r12.fapte.b_blank_presentation`: „Presentation2”, 2 deschise, `backstage_dupa: null`, `["Title Slide"]`). Cu
  tastele de acces `Alt, F, N, L, 1` (referința: `tasta_acces "Alt, F, N, L 1"`) → același rezultat (`b1_out › blank`).
- Ctrl+O › Browse (`P3_open_mouse`, `P3_open_dublu`, `b2_out › open_nume_enter`): fereastra `dialog.FileOpen` arată fișierele din
  `start.fisiere` (`lista:Plante_6A_Pop.pptx`, `lista:Plante_6A_Ion.pptx`); clic pe fișier → caseta File name „Plante_6A_Pop.pptx”; Open →
  `prezentare_activa: "Plante_6A_Pop.pptx"`, `prezentari_deschise: 2` (= `scenarii_real/powerpoint-ctrl-o-browse.json`); dublu clic pe
  fișier și „nume + Enter” (`activat: 'fereastra:Open'`) dau același lucru. `Alt, F, O, O` (referința „Alt, F, O, O”) deschide fereastra.
- Rămâne (nu ține P3 deschis): adresa ferestrei nu scrie „Documente” (singurul nod vizibil cu numele e butonul „Înapoi la Documente”),
  deși referința are `SplitButton 'Documente'` în adresă — MINOR; tastatura în fereastră → GRAV T1 (B).

### P4 — Obiectele de pe diapozitiv: **ÎNCHIS**
- m1-l05:188 (`a1_out › P4_m1l05`, `start` cu stele / săgeată pe 5 diapozitive): clic în MIJLOCUL stelei de pe „Soarele” →
  `{a:'alegere_forma', t:'forma:3/2'}`, `selectie_forma [3,2]`, `selectie_text null`, pe ecran `lh-ap-p-obiect` (= `a_forma_clic.clic_mijloc
  .stea: Selection.Type 2, forma_ca_obiect`); Ctrl+C → miniatura 4 → Ctrl+V → miniatura 5 → Ctrl+V: steaua pe ambele, la `[60,180,180,170]`
  (= `a_forma_clic.ctrl_c_v_stea.dupa_ctrl_v`: „Star: 5 Points”, `pozitie [60,180,180,170]`). Ctrl+X pe „Cuprins” → Ctrl+V pe
  „Soarele”: steaua mutată. Clic pe săgeată → `selectie_forma [4,2]` → Delete → săgeata dispare. Clic în colțul dreptunghiului stelei
  (în afara desenului) → `deselectare` (= `stea_pe_chenar_dreptunghiului_care_o_incadreaza: nimic`).
- Cu tastele (`b2_out`, `b3.py`): Ctrl+C / Ctrl+V / Ctrl+Z / Ctrl+Y pe stea → `lipire` / `anulare` / `refacere`, forma revine la loc.
- m2-l09 (`P4_m2l09_imagine`): `start` cu `{fel:'imagine', fisier:'pamant.png'}` → clic pe imagine `alegere_forma` → Delete →
  `stergere_forma`, rămân titlul, rândurile și caseta goală. m2-l08 (`P4_m2l08_font`): `start.fonturi ["Comic Sans MS"]` → caseta Font
  „Comic Sans MS”, `font_text "Comic Sans MS"`.
- Rămâne: în `start`, o imagine pe Two Content e o formă în PLUS peste caseta goală (4 forme), nu în casetă — e forma din api §7.1
  („formele puse DUPĂ casetele aspectului”), deci nu ține GRAV-ul. Ce se vede cu fontul → GRAV T3 (B).

### A1 — Galeria Shapes: **ÎNCHIS**
- `a1_out › A1_shapes`: lista la `[322, 162, 309, 605]`, lipită sub buton (referința `[319, 159, …]`), nu mai acoperă bara de titlu; cele
  10 grupuri au titlul pe ecran (`["Block Arrows","Block Arrows"]` …); toate 190 de rânduri au `title` (0 fără); „Arrow: Right” are
  `title "Arrow: Right"`; cele 12 Action Buttons au 24×24 (nu 0×0). Desene distincte: 22 pentru 190 de rânduri — formele de pe drumul
  lecțiilor au desen propriu, multe altele împart un desen generic. Desenele nu au referință (UIA dă doar numele) → [FARA_REFERINTA].

### A2 — Paletele de culori: **ÎNCHIS**
- `a2.py` / `a1_out › A2_palete`: Font Color, Shape Fill, Shape Outline, Format Background › Color au pe ecran „Theme Colors” și
  „Standard Colors” (textul vizibil = eticheta), fiecare pătrat are `title` (0 fără `title` din 70 / 71 / 73); Dark Blue → `culoare_text
  "#002060"`; Yellow → `umplere_forme … {tip:'solid', culoare:'#FFFF00'}` (= `scenarii_real/powerpoint-shape-fill.json`). Sfatul de
  hover real nu e capturat (`acoperire_r12.NEVERIFICAT.hover_tooltip`) → [FARA_REFERINTA].

### A3 — Panourile pe fereastra mică și pe telefon: **ÎNCHIS** (Format Background) / Animation Pane pe telefon neprobat de mine
- `a3_out › mica_fb` (1093×526 css): după Solid fill, „Apply to All” `[823, 464, 80, 24]`, `elementFromPoint` îl lovește; 4 rotiri de rotiță
  peste panou mută conținutul (Color de la y 435 la 392), butonul rămâne pe loc (ca în referință: butoanele în afara `Pane`-ului
  derulabil); Color ▾ › Light Green › Apply to All → `fundal_diapozitive` = 2 × `#92D050`. Telefon 360×740 și 390×844 (atingere): Apply to
  All la y = 571, lovit, același rezultat.
- `mica_ap`: Animation Pane, rândul 2 lovit, Move Up `[1023, 228, 26, 26]` lovit → `ordine_animatii [2, 1]`. Pe telefon atingerea mea n-a
  ajuns la fila Animations (în afara ecranului, pe panglica derulată lateral) — Animation Pane pe telefon rămâne neprobat de mine.

### A4 — Comenzile care dădeau „aici nu e simulată”: **ÎNCHIS**
- `a1_out › A4_drum`, toate cu clic: zona de note vizibilă la pornire (= `c_note.ShowNotes_la_pornire: true`), clic + „Spun ceva.” →
  `note_diapozitive[2]`; View › Notes o ascunde, Notes din bara de stare o arată (= `c_note.dupa_view_notes` / `dupa_notes_bara_2`);
  bara de stare: Slide Sorter → `vedere 'sortare'`, Normal → `normala`, Reading View → `citire`, Slide Show → `expunere` (= `c_vederi`);
  Background Styles ▾ › Style 6 → 2 × `#E9E7E7` (= `c_background_styles.dupa`); Background Styles › Format Background... → panoul; Start ▾ ›
  After Previous → `pornire_animatii [["dupa_precedenta"] …]` (= `c_start`); Shape Outline › Weight › 3 pt; Font ▾ › Calibri Light
  (Headings) → `font_text "Calibri Light"`, caseta „Calibri Light (Headings)” (= `c_font.dupa_calibri_light`). `nesimulat` = 0 pe tot drumul.
- Pe drum rămâne doar View › Notes Page (`Alt, W, T`) → `nesimulat`; nicio lecție nu-l citează (grep în m1-l02: 0).

### Drumurile lecțiilor, pe poligon (1366×768)
| lecția | se duce la capăt? | unde se blochează elevul |
|---|---|---|
| m1-l02 | da | — (notele, View › Notes, Notes / Slide Sorter / Normal / Reading View / Slide Show din bara de stare, F5, ← →, Esc merg) |
| m1-l03 | da | Blank Presentation, Ctrl+N, Ctrl+O › Browse › Plante_6A_Pop.pptx › Open merg. Rezervă: :133-134 „Ctrl+S → la File name scrii…” — Ctrl+S duce în Backstage › Save As, unde nu e casetă File name (numele se scrie după Browse); ce face Ctrl+S real pe o prezentare nesalvată nu e în referință (`backstage.Save As` are doar „Save As” și „Browse”) → [FARA_REFERINTA] |
| m1-l05 | da | — (steaua: clic, Ctrl+C / Ctrl+X, miniatura, Ctrl+V, același loc; săgeata → Delete; Ctrl+Z) |
| m1-l06 | da | — (Font Color, Shape Fill › Yellow, Shape Outline › Orange / Weight › 3 pt, Background Styles › Format Background..., Solid fill › Color › Apply to All, și pe fereastra mică / telefon) |
| m1-l07 | da | — (Start ▾ › After Previous / With Previous; restul din critic 12) |
| m2-l08 | da, dar înșelător | Font ▾ › Calibri Light (Headings) merge; dar titlurile rămase cu fontul temei se văd în „Aptos Display”, iar cel reparat în „Calibri Light” — lecția (:167) spune „uită-te la forma literelor din titluri” (GRAV T3) |
| m2-l09 | da | notele, imaginea → Delete, Pictures › This Device merg. Rămân [FARA_REFERINTA]: substituenții goi nu scriu „Click to add title” (pe ecran `"​"`), iar sfatul SIM_SCURT (:144) „clic în text, apoi clic pe chenarul punctat … până chenarul devine linie plină” urmat de tastare ADAUGĂ la capăt („Fotbalul” + „Baschetul” → „FotbalulBaschetul”, `b5.py`) |
| m2-l10 | da | — (Shapes › „Arrow: Right” se găsește după titlul „Block Arrows” și numele la hover) |
| jocuri/prezentari-vi | da | — (Shape Fill / Shape Outline / Background Styles › Format Background; jocul nu cere un „Style N” anume) |

### MINOR-urile din critic 12 §7
- Listele la +3 px: **nefăcut** (lăsat de constructori). Shapes peste bara de titlu / Action Buttons 0×0: **făcut** (y = 162; 24×24).
- „More Colors... ⌄” / „Eyedropper ⌄”: **făcut** (`m1.py`: textul rândurilor e doar „More Colors...”, „Eyedropper”).
- Layout / New Slide fără miniaturi; grila Table fără titlu: **nefăcut** (lăsat).
- „Save your changes”: „Pov” tăiat și x = −26 la 360 px: **nefăcut** (lăsat).
- „Slide 1 of 0” fără prezentare: **făcut** (bara de stare nu mai arată indicatorul; `prezentari_deschise 0`, `diapozitiv_activ null`).
- Animation Pane / Format Background 34 px mai sus, fără legendă: **făcut** (`[1098, 219, 259, 520]` față de `[1098, 218]`; legenda „Animation
  Pane” desenată — textul ei e [presupus]); „Play From” cu un rând ales: **făcut**; Solid fill bifat: **făcut** (`aria-checked true`).
- Telefon, zone < 32 px: **nefăcut** (lăsat). Fila „Fill” scrisă ca text: **nefăcut** (lăsat).
- Butonul „Font Color Red” din panglică: neverificat de mine. Font style / Underline / Alignment la OK: neverificat de mine.

## 3. B. Unghiul gest_tastatura (PowerPoint): constatări noi

### GRAV T1 — În ferestre tastatura moare: Alt + litera subliniată nu face nimic (și nu emite niciun eveniment), iar Tab scoate focusul din fereastră
- Gestul (`b2_out`, `b3.py`), cu `page.keyboard`:
  - **Open** (Ctrl+O › Browse, nou în rundă): focusul la deschidere e în File name (bine). `Tab` → focusul pleacă din fereastră pe
    `<div class="lh-ap-sus">` (bara de titlu a aplicației; `inDialog: false`); de acolo cele 18 litere ale lui „Plante_6A_Pop.pptx” dau
    `tastare / fara_efect`, `Alt+N` și `Alt+O` nu dau NICIUN eveniment, fereastra rămâne, `prezentare_activa "Presentation1"`
    (`open_mouse_browse`). `Shift+Tab` → același `div`; `↓` și `Enter` → `fara_efect` (`open_tab_lista`). Doar Esc mai merge.
  - **Save your changes** (Ctrl+W după o modificare): `Tab` ×4 → `div.lh-ap-sus`; `Alt+N` (Don't Save) și `Alt+S` (Save), apăsate cu
    focusul în File name → fereastra rămâne, nicio stare schimbată, niciun eveniment (`save_changes_altn`, `save_changes_alts`).
  - **Insert Picture** (`Alt, N, P, D`): nume + `Alt+O` → nimic; **Save As** (F12): `Alt+N`, nume, `Alt+S` → nimic (`picture`, `saveas_f12`).
  - **Font** (lansatorul Home › Font) se deschide cu focusul pe rădăcina aplicației (`div.lh-ap.lh-ap-powerpoint`), în niciun câmp; `Alt+S`
    (Size) → nimic, „40” → `fara_efect` ×2, Enter → `ok` cu `marime 60` neschimbată (`font_dlg`). **Paragraph**: `Alt+G` (Alignment) → nimic.
- Referința: literele de acces sunt pe noduri, la `tasta_acces` (`c2_out`): `dialog.FileOpen › ComboBox 'File name:' "Alt+n"`, `SplitButton
  'Open' "Alt+o"`; `dialog.save_your_changes_to_this_file › Button 'Save' "ALT+S"`, `Button "Don't Save" "ALT+n"`; `dialog.FileSaveAs ›
  Button 'Save' "Alt+s"`, `ComboBox 'File name:' "ALT+n"`; `dialog.PictureInsertFromFilePowerPoint › SplitButton 'Open' "Alt+o"`;
  `dialog.FontDialogPowerPoint › Edit 'Size' "ALT+S"`, `ComboBox 'Latin text font' "ALT+f"`; `dialog.PowerPointParagraphDialog › ComboBox
  'Alignment' "ALT+g"`. Pentru Tab, regula ferestrelor Windows e sursa pe care o citează chiar api §4 (dlgbox-programming-considerations,
  api_biblioteca.md:176-177); ordinea Tab nu e capturată, dar un focus care iese din fereastra modală pe bara de titlu, unde nicio tastă nu
  mai lucrează, nu e comportamentul vreunei ferestre Windows.
- Contractul: api §4 „Un eveniment pe fiecare gest fizic al elevului” (api_biblioteca.md:151) și R6 (contract.md:32) — `Alt+N` / `Alt+S` nu
  emit nimic, pentru că `gestTasta` întoarce `null` pentru Alt + literă (aplicatii.js:240-251: `if (k && k.length === 1 && !e.altKey)
  return 'tastare'; return null;`).
- Lecția: m1-l03:81 îi dă elevului ca temă tastele (Ctrl+N, Ctrl+O, Ctrl+S, F12, Esc). Elevul care, în fereastra Open sau „Save your
  changes”, apasă Tab ca să ajungă la Open / Save rămâne cu tastatura moartă; pe PC-ul real Alt+S salvează și Tab trece prin butoane.

### GRAV T2 — Fila Shape Format nu are tasta de acces „J D”: Shape Fill / Shape Outline / Weight din Shape Format nu se pot apăsa cu tastele, iar „W” scrie în stea
- Gestul (`b1_out › shapefill_ctx`, `outline_weight`; `b5.py`): steaua aleasă ca obiect; fila `fila:Shape Format` e pe ecran, dar e singura
  fără tastă (`fila:Home[Alt, H]` … `fila:Help[Alt, Y]`, `fila:Shape Format` fără nimic). `Alt` → insignele `1,2,3,4,Q,F,H,N,JI,G,K,A,S,P,
  R,W,Y,ZS,ZR` (fără JD); `J` → rămâne doar `JI` (Draw); `D`, `S`, `F` / `O`, `W` → `tasta_acces / fara_efect`. La fel după clic pe fila Shape
  Format (`b5.py › dupa clic pe Shape Format`).
- Ocolul prin Home nu ajunge la Weight: `Alt, H, S, O` deschide `lista.OutlineColorPicker`, dar fără nicio insignă în ea; `W` →
  `{g:'tastare', a:'scriere'}`: litera „w” intră ca text în stea, cu lista încă deschisă (`b5.py › H S O W`).
- Referința: `panglica_context.Ctx_ShapeFormat › Group 'Shape Format' tasta_acces "Alt, J D"`, `SplitButton 'Shape Fill' "Alt, J D, S F"`,
  `SplitButton 'Shape Outline' "Alt, J D, S O"`; `lista.OutlineColorPicker#Weight › "Alt, J D, S O, W"`; `acoperire_r12.fapte.c_shape_fill_outline
  .structura.lista.ShapeFillColorPicker[0] = ["SplitButton","Shape Fill","tasta Alt, J D, S F"]` (`r4.py`, `c1_out`). Singurul drum pe taste spre
  Weight (m1-l06:177 „Shape Outline ▾ → Weight → 3 pt”) e „Alt, J D, S O, W”, iar pe poligon nu există.
- Contractul: api §4 `tasta_acces` — „literele vin din referință, `uia_<app>.json › tasta_acces`” (api_biblioteca.md:166-168); cât literele
  sunt pe ecran / o listă e deschisă din taste, „nicio tastă nu ajunge în casetă” (comentariul constructorilor, powerpoint.js:2146-2147).

### GRAV T3 — Fontul temei se vede „Aptos Display”, deși caseta Font și `stare()` spun „Calibri Light”; alegerea „Calibri Light (Headings)” schimbă literele unui titlu care era deja în fontul temei
- Gestul (`a2.py`): `start` cu titlul în Comic Sans MS și subtitlul fără font. Pe ecran: titlul `"Comic Sans MS"`, subtitlul `Aptos, "Segoe UI",
  Calibri`; clic în titlu › chenar › Font ▾ › Calibri Light (Headings) → titlul `"Calibri Light"`, `font_text "Calibri Light"`. Orice casetă
  fără font ales: `font_text` / caseta Font = „Calibri Light (Headings)” / „Calibri (Body)” (powerpoint.js:190 `fontImplicit`, NOU în rundă: 0
  apariții la 7ab108fe), dar ecranul o desenează cu `.lh-ap-p-titlu{font-family:'Aptos Display','Aptos',…}` (aplicatii.css:371, din runda 11).
- Referința: `acoperire_r12.fapte.c_font.grupuri[0] = {grup:"Theme Fonts", primele:["Calibri Light (Headings)","Calibri (Body)"]}`;
  `dupa_calibri_light = {Font.Name:"Calibri Light", caseta:"Calibri Light (Headings)"}`. Fontul temei capturate e Calibri Light / Calibri.
- Lecția: m2-l08:161 („Același nume ales mai jos, din All Fonts, nu e fontul temei: caseta nu arată (Headings)”) și :167 („uită-te la forma
  literelor din titluri, sau dă clic în fiecare titlu și citește caseta Font”). Pe poligon titlurile în fontul temei arată altfel decât titlul
  reparat cu „Calibri Light (Headings)”: elevul care se uită la litere crede că toate celelalte sunt greșite. Ecranul ≠ starea (§3), iar elevul
  învață că fontul temei din laborator arată ca Aptos.

### GRAV T4 — Esc în modul tastelor de acces pleacă ca `tasta_acces`, nu ca `tasta_esc`
- Gestul (`b1_out › esc_nivele`, `fontcolor_kt_esc`): `Alt, H, F, Esc` → `{g:'tasta_acces', a:'iesire_taste_acces'}` (de 3 ori, câte un nivel).
- Contractul: „Esc în modul tastelor de acces: `tasta_esc`” (api_biblioteca.md:172). Cod: powerpoint.js:2228 `I.tastaFaraClic('iesire_taste_acces')`
  (aplicatii.js:458 → `emite(I, 'tasta_acces', …)`). La fel în word.js:2056 și excel.js:3366 — din rundele trecute, ieftin de reparat în
  `tastaFaraClic`; o lecție care ascultă `tasta_esc` nu-l vede, iar asistentul îl numără greșeală oricum.

### Restul unghiului (fără GRAV)
- **KeyTips, ce merge** (`b1_out`, 27 de șiruri): literele și ordinea din `tasta_acces` pe Home („Alt, H, F F” → focusul în caseta Font cu
  „Calibri Light (Headings)” ales; „Arial” + Enter → `font_text "Arial"`), Font Color („Alt, H, F C”, cu insignele H M E în listă), Shape Fill
  din Home („Alt, H, S F”), Background Styles („Alt, G, B”, apoi B = Format Background..., R gri), New Slide („Alt, H, I”, D = Duplicate
  Selected Slides), Layout („Alt, H, L”), Shapes („Alt, N, S H”), Pictures („Alt, N, P”, D → fereastra, focusul în File name), View › Notes
  („Alt, W, P N”), Slide Sorter / Normal / Reading View („Alt, W, I / L / D”), From Beginning / From Current Slide („Alt, S, B / C”), Start
  („Alt, A, T” → lista cu „On Click” ales, ↓ + Enter → With Previous), File › New › Blank („Alt, F, N, L 1”), File › Open › Browse („Alt, F,
  O, O”). Un eveniment pe tastă; Alt și prefixele = `arata_taste_acces` / `prefix_tasta_acces`. Nicio literă nu intră în text cât insignele
  sunt pe ecran (`gresit_alt`: X, V → `fara_efect`, insignele rămân).
- **Scurtăturile pe obiecte și miniaturi** (`b2_out`, `b3.py`): stea / casetă aleasă ca obiect: Ctrl+C / Ctrl+X / Ctrl+V / Delete / Ctrl+Z /
  Ctrl+Y corecte (caseta lipită devine `caseta_text` cu „Vulcanii” pe diapozitivul 2, ca `powerpoint-ctrl-c-v-caseta`); miniaturi: Ctrl+C,
  Ctrl+V, Ctrl+X, Delete, Ctrl+Z, Ctrl+D, Ctrl+M; text: Ctrl+A → `selectare_tot`, apoi „Z” înlocuiește; Esc din text → `alegere_forma`
  (caseta aleasă), încă un Esc → `deselectare`.
- **Prezentarea și vederile**: Ctrl+N → Presentation2, Ctrl+W pe ea (nemodificată) → se închide; Ctrl+O → Backstage › Open; F12 → Save As cu
  focusul în File name („Presentation1”); F5 de pe diapozitivul 2 → expunere de la 1; → / ← / Space / Backspace; Esc → afară; Shift+F5 → de
  la 2; Slide Sorter: săgețile mută alegerea, Delete / Ctrl+Z / Ctrl+C / Ctrl+V pe diapozitive. Notele: litere, Enter, Backspace, Ctrl+Z,
  Esc (`iesire_note`), iar după Esc literele nu mai intră în note.
- **Telefonul** (`b4_tel.json`, 360×740, atingere): atingerea zonei de note pune focusul în `textarea.lh-ap-intrare` (vizibilă, opacitate 0,
  fără `inputmode`), deci tastatura de pe ecran se deschide; `Input.insertText "Ăla e cal"` → `note_diapozitive[0] "Ăla e cal"`; în timpul
  compunerii (`imeSetComposition "ș" / "șa"`) notele nu se schimbă, la sfârșit textul intră o dată („…calșah”), ecranul = starea. Atingerea
  titlului → același focus; „Ș” intră la punctul atins („VulcȘanii”).
- **Asistentul (§6.3)**: săgețile în liste (`sageti`) și Alt / prefixele nu sunt numărate. Dar cu pasul „meniu:Yellow”, drumul pe taste
  `Alt, H, S, F` aduce indiciul imediat ce se deschide lista (`b4_out › asistent_extra`: indiciul apare la „f”): „H” (fila Home, deja activă)
  pleacă drept `fila` și „F” (deschide lista) drept `meniu_derulant` — două „greșeli”; cu mouse-ul, același drum (un clic pe Shape Fill ▾)
  e o singură greșeală, fără indiciu → MINOR (vezi §7).

## 4. C. Fidelitatea generată din date
- `python aplicatii/_unelte/genereaza_powerpoint.py --verifica` → „chei diferite față de generarea de azi: 0”, ultima linie `0`
  (`critic_probe/c_verifica.log`); `git status -- aplicatii` curat după rulare.
- `c1.py` (Python pe chei, `c1_out.txt`): la cele 8 suprafețe noi, mulțimea etichetelor din `date/powerpoint.json` = cea din
  `uia_powerpoint.json` — `lista.Font` 30/30, `lista.AnimationStartDropdown` 6/6, `lista.ShapeFillColorPicker` 85/85,
  `lista.OutlineColorPicker` 86/86, `#Weight` 16/16, `lista.SlideBackgroundStylesGallery` 20/20, `bara_stare#Slide Sorter` 18/18: 0 în plus,
  0 lipsă; `dialog.FileOpen` 75/80: 0 în plus, lipsesc doar cele 5 noduri personale / temporare (`[redactat: nume]`, `Toate locațiile`,
  `‎Local`, `‎Temp`, `‎<folder>`). Tastele de acces (`ta` față de `tasta_acces`) identice la toate 8.
- „Claude” apare de 0 ori în date. `date.fonturi_toate` (318) == `acoperire_r12.fapte.c_font.all_fonts` (318), aceeași ordine.
- Texte de pe ecran care nu sunt în referință (abateri R4, scrise din memorie): „Click to add notes” (powerpoint.js:524; referința spune că
  îndemnul „nu se poate citi”, `acoperire_r12.NEVERIFICAT.zona_de_note_in_uia`) → MINOR. Culorile stilurilor de fundal 1-4 (powerpoint.js:869-870)
  și „gradient” fără culoare pentru 5, 7-12 sunt valori, nu etichete → [FARA_REFERINTA].

## 5. D. Regresul Word și Excel — nimic stricat în runda asta
- Ce s-a atins comun: doar `aplicatii.css`, cu reguli `.lh-ap-powerpoint …` / `.lh-ap-p-…`.
- `critic_probe/d1.py` (din hamul criticului 12): `aplicatii/` din 7ab108fe prin `git archive` într-un dosar din %TEMP% (șters la final,
  `tmp_sters: true`) față de worktree-ul de acum, `poligon.html?aplicatie=word|excel`: dreptunghiurile `[data-lh-tip]` identice (Word 136 /
  197 / 235, Excel 227 / 289 / 323 la pornire / File / F12; telefon 360: 136 și 227) și capturile identice la pixel (0 pixeli diferiți în
  toate 8). Gesturile, identice vechi / nou (`d1_out › g_word`, `g_excel`): Word — tastarea („ proba”), `Alt, H, 1` (`arata_taste_acces` /
  `fila` / `format_la_scriere`), Ctrl+Z, F12 → „Tema” + Enter → `Tema.docx`, „Tema  -  Word”; Excel — F2 = 7, F3 = `=1+2` (3), Ctrl+Z (F3
  golită), ▾ de la Σ (`meniu_derulant`).
- Probele vechi: `runde/5/proba_grav.py` → `picate: []`, `0`; `runde/4/proba_telefon.py` → `picate: []`, `0`; `runde/10/proba_grav.py` → `0`
  (a scris un fișier nou `runde/10/proba_grav.json`, mutat în %TEMP%). `git status --short` după: 0 fișiere urmărite schimbate în `runde/2` …
  `runde/13`; neurmărite rămân doar cele dinainte de mine (`runde/11/acoperire/*.bak`, `scenarii_inainte/`, `.temp_cale_nu_comite`,
  `runde/12/acoperire/*.bak`, `scenarii_inainte/`) plus `runde/13/critic.md` și `critic_probe/` ale mele.

## 6. [FARA_REFERINTA] (nu se numără GRAV; de dus la proba omului / în `de_verificat`)
- **Lista Font deschisă cu ▾**: focusul rămâne în diapozitiv, deci literele tastate „ca să sari la Arial” intră în TITLU, cu lista încă
  deschisă („Vulcanii” → „Vulcaniiarial”, `b4_out › font_clic_sageata`); Home / End nu fac nimic în liste (Font, Shapes, culori). În
  paletele de culori ↓ și → fac același lucru (rândul următor din listă: White → Black → Light Gray), deși pe ecran pătratele sunt pe 10
  coloane. Tastatura în liste e [presupus] R13-6; listele deschise nu sunt capturate (README_referinte.md:147-148).
- **R13-4, caseta Font**: clicul în textul casetei deschide lista și pune cursorul la punctul clicului, nu alege tot textul cum spune
  comentariul (powerpoint.js:1917-1922): „Ari” tastat dă „CalibAriri Light (Headings)”, Enter → `fara_efect`, fontul rămâne (`font_clic_text`).
  Pe săgeata ▾ lista se deschide fără focus în casetă (vezi mai sus). Doar drumul pe taste „Alt, H, F F” + nume + Enter merge.
- **Esc după un prefix KeyTips** (`Alt, H, F, Esc`) sare direct la insignele filelor (sare peste nivelul Home); o literă greșită lasă
  insignele pe ecran (`fara_efect`). „KeyTips afișate” necapturate (README_referinte.md:148).
- **Tastarea cu o casetă aleasă ca obiect ADAUGĂ la capăt** („Vulcanii” + „Fo” → „VulcaniiFo”, `caseta_obiect_tastare`; m2-l09 „Fotbalul”
  → „FotbalulBaschetul”), deși sfatul lecției m2-l09:144 („Ca să schimbi tot textul unei casete: clic în text, apoi clic pe chenarul
  punctat … până chenarul devine linie plină”) presupune înlocuirea. Cel mai important de capturat.
- **Delete pe o casetă de aspect aleasă ca obiect** o șterge cu totul, cu text cu tot (`caseta_obiect_delete`; R11-8 [NEVERIFICAT]).
- **Notele**: Delete șterge ultimul caracter, ca Backspace (`note_taste`: „Ab\n” → Delete → „Ab”); ←, Home, End nu mută nimic (nu există
  cursor în note). Zona de note nu e în UIA (`acoperire_r12.NEVERIFICAT.zona_de_note_in_uia`).
- **Tab între obiecte** nu face nimic (`stea_tab`, `text_esc_tab`); **Ctrl+A** pe diapozitiv / miniaturi și **Ctrl+D** pe o formă →
  `nesimulat`; **Enter în Slide Sorter** adaugă un diapozitiv nou, Home / End nu mută alegerea (`sorter_taste`).
- **Alt+F5** (m2-l08:250, :326: „Vizualizarea prezentatorului … Găsește cronometrul”) pornește o expunere obișnuită de la 1, fără mesaj;
  Presenter View nu e capturat.
- **Ctrl+S pe o prezentare nesalvată** → Backstage › Save As (m1-l03:133 cere „Ctrl+S → la File name scrii … → Save”); `backstage.Save As`
  din referință are doar „Save As” și „Browse”, iar ce deschide Ctrl+S real nu e capturat.
- **Fereastra Open** se deschide cu focusul în File name; referința dă `la_deschidere.focus: []` (necitit), deși scenariul real a tastat
  numele direct (`b_ctrl_o_browse.camp_inainte_de_enter`) — probabil corect.
- Enter în File name din „Save your changes” = Save (R12-2; `NEVERIFICAT.enter_in_save_your_changes`); stilurile de fundal 1-5, 7-12;
  substituenții goi fără „Click to add title”; desenele formelor din Shapes; sfatul de hover; legenda panourilor.

## 7. MINOR
- Asistentul (§6.3): pe drumul `Alt, H, S, F` spre „Yellow”, „H” (fila Home deja activă, care doar arată literele Home) pleacă drept
  `fila`, nu ca navigare; cu „F” fac 2 greșeli și indiciul apare când elevul tocmai a deschis lista bună (`asistent_extra`).
- Telefon: tastarea în note emite ținta `diapozitiv`, nu `zona_note` (`b4_tel.json › ev_insert`).
- Fereastra Open: adresa nu scrie „Documente” (doar butonul „Înapoi la Documente”); referința are `SplitButton 'Documente'`; lecția m1-l03:243
  spune „Browse → Documente → …”.
- „Click to add notes” scris din memorie (R4, vezi C). View › Notes Page (`Alt, W, T`) → `nesimulat` (pe niciun drum de lecție).
- Tastarea într-o casetă a panglicii (Font, File name) emite `tastare` cu `inainte` = `dupa` (api §4: „La tastare … dupa diferă de inainte”).
- Rămase din critic 12, lăsate: listele la +3 px; Layout fără miniaturi; „Pov” tăiat și x = −26 la 360 px; zonele de atins < 32 px; fila
  „Fill” ca text.

## 8. Ce a trecut
- P3, P4, A1, A2, A3, A4 închise, cu drumul lecției: Blank Presentation, Ctrl+O › Browse › fișier › Open (clic, dublu clic, nume + Enter);
  steaua aleasă din mijloc, Ctrl+C / Ctrl+X / Ctrl+V în același loc, Delete; `start` cu forme / fonturi / fișiere; Shapes cu titluri și nume;
  paletele cu „Theme Colors” / „Standard Colors” și nume; Apply to All la vedere pe fereastra mică și pe telefon; notele, View › Notes, bara de
  stare cu 5 vederi, Font ▾, Start ▾, Shape Fill / Outline / Weight, Background Styles — fără niciun `nesimulat`.
- Toate cele 9 drumuri de lecție se duc la capăt pe poligon (m2-l08 cu ecranul înșelător, GRAV T3).
- KeyTips pe Home / Insert / Design / Animations / View / Slide Show / File, cu literele din referință, câte un eveniment pe tastă, fără
  litere scăpate în text cât insignele sunt pe ecran; listele deschise din taste umblă cu ↑ ↓ Enter Esc.
- Scurtăturile pe obiecte, miniaturi, Slide Sorter, expunere (F5, Shift+F5, ← → Space Backspace Esc), Ctrl+N / Ctrl+W / Ctrl+O / F12.
- Telefonul: tastatura de pe ecran se deschide în note și în titlu, diacriticele și compunerea merg (ecranul = starea).
- C: `--verifica` = 0; cele 8 suprafețe noi = referința (etichete și taste); „Claude” 0; lista fonturilor = `c_font.all_fonts`.
- D: Word și Excel neatinse (dreptunghiuri, pixeli, gesturi; probele 5 / 4 / 10 = 0); curățenia făcută.

GRAV_VECHI_DESCHISE: 0
GRAV: 4
