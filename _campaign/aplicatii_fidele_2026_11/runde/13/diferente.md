# Runda 13 · tabelul diferențelor (pasul 5) — B-powerpoint, constructorul 1 (predare)

Referința = `referinte/uia_powerpoint.json` (citită pe chei, prin Python), `referinte/scenarii_real/powerpoint-*.json`.
Simulatorul = `aplicatii/powerpoint.js` (worktree, necomis). „rânduri” = funcția / blocul numit (numerele de rând se mută).

| # | suprafața | aplicația reală (citat) | simulatorul înainte | gravitate | reparația (unde) |
|---|---|---|---|---|---|
| D1 | clicul pe formă (P4) | `acoperire_r12.fapte.a_forma_clic.clic_mijloc`: stea / sageata / dreptunghi / caseta_text → `Selection.Type 2`, `fel: forma_ca_obiect`; `stea_pe_chenar_dreptunghiului_care_o_incadreaza` → `0`, `nimic` | `cursor_text` în stea, Ctrl+C mut (critic 12 › P4) | GRAV | `I.la.jos` › `obiect`; `.lh-ap-p-fig` + SVG `pointer-events` (aplicatii.css, 3 reguli) |
| D2 | `start.forme` / `fonturi` / `fisiere` | api §7.1 (rândurile ~284-290) | doar `{aspect, texte}` | GRAV (lecțiile m1-l05, m1-l06, m2-l09 nu-și încarcă diapozitivele) | `diaPornire()`, `M.fisiere` |
| D3 | Font ▾ | `lista.Font` (Theme Fonts 2 + All Fonts), `fapte.c_font.dupa_calibri_light = {Font.Name: "Calibri Light", caseta: "Calibri Light (Headings)"}`; `scenarii_real/powerpoint-font-titlu.json › stare.font_text = "Calibri Light"` | `nesimulat` | GRAV (m2-l08) | `listaFont`, `puneFont`, `fontAfisat`, caseta Font editabilă; `date › fonturi_toate` (generator) |
| D4 | Animations › Start ▾ | `lista.AnimationStartDropdown`; `fapte.c_start.dupa_fiecare_rand` (TriggerType 1/2/3, caseta = numele); `powerpoint-animatie-start.json › stare.pornire_animatii = [["dupa_precedenta"]]` | `nesimulat` | GRAV (m1-l07) | `PORNIRI`, `animSel`, caseta Start în `actualizeazaPanglica` |
| D5 | Shape Fill ▾ / Shape Outline ▾ / Weight ▸ | `lista.ShapeFillColorPicker`, `lista.OutlineColorPicker`, `#Weight`; `powerpoint-shape-fill.json › umplere_forme = [[{fara}, {solid #FFFF00}]]`; `c_shape_fill_outline.stea_la_inceput = {solid #4472C4, Line.Weight 1, Line.ForeColor #172C51}` | `nesimulat` | GRAV (m1-l06, `prezentari-vi` 24 de apariții) | `aplicaUmplere`, `aplicaContur`, `umplereForma`, desenul SVG cu umplerea / conturul |
| D6 | Background Styles ▾ | `lista.SlideBackgroundStylesGallery`; `powerpoint-background-styles.json › fundal_diapozitive = [{solid #E9E7E7} ×2]` | `nesimulat` | GRAV (m1-l06, `prezentari-vi` 7) | `stilFundal` (Style 6 dovedit; restul R13-5) |
| D7 | File › New › Blank Presentation | `fapte.b_blank_presentation`: „Presentation2”, 2 deschise, `backstage_dupa: null`; `powerpoint-blank-presentation.json` | `nesimulat` | GRAV (m1-l03:105) | `prezentareNoua()` din Backstage |
| D8 | Ctrl+O › Browse | `dialog.FileOpen`; `fapte.b_ctrl_o_browse`; `powerpoint-ctrl-o-browse.json › {prezentare_activa: "Plante_6A_Pop.pptx", prezentari_deschise: 2}` | `nesimulat` | GRAV (m1-l03:241) | `deschideOpen`, `deschideFisier` |
| D9 | zona de note, View › Notes, Notes în bara de stare | `fapte.c_note` (ShowNotes apăsat la pornire → neapăsat → apăsat) | `nesimulat` | GRAV (m1-l02, m2-l09) | `notaEl`, `comutaNote`, `scrie` / `sterge` în note; aspectul R13-9 |
| D10 | Slide Sorter / Normal / Reading View / Slide Show din bara de stare | `fapte.c_vederi` (ViewType 7 / 9, Reading View ne-full-screen, Esc → Normal); `bara_stare#Slide Sorter`; `powerpoint-slide-sorter*.json` | `nesimulat` | GRAV (m1-l02:222, :225) | `seteazaVedere`, `baraStare`, `deseneazaSortare`, ținte în `OPT.tinta` |
| D11 | durata Push / Wipe | `fapte.d_durate`: Push „01,00” / 1.0, Wipe „01,00” / 1.0; `powerpoint-durata-push.json`, `-wipe.json` | 2 s | MĂRUNT | `DURATE_EFECT` |
| D12 | imaginea pe Two Content | `fapte.e_imagine_two_content`; `powerpoint-imagine-two-content.json › pozitii_forme[1][2] = [486, 163, 408, 304]`, 3 forme | formă nouă (4 forme) | MĂRUNT | `insereazaImagine` (raportul R13-8) |

## Scenariile PowerPoint care încă nu trec (O4 doar PowerPoint, `runde/13/o4_ppt.py`)
- `powerpoint-stea-ctrl-c-v` — **fără rezultat real probat** (`scenarii_real/powerpoint-stea-ctrl-c-v.json › mod_probat: false`,
  „NERULAT: clipboard-ul omului …”). Drumul e capturat (`a_forma_clic.ctrl_c_v_stea.dupa_ctrl_v.diapozitiv_2` = titlul + „Star: 5
  Points” la [60, 180, 180, 170]); proba mea (`proba_grav.py`, „P4 K Ctrl+C pe stea …”) dă exact asta pe poligon. O4 îl numără până
  rulează o rundă `acoperire` cu clipboard-ul liber.
- `powerpoint-note` — **fără rezultat real probat** (`mod_probat: false`: clicul postat n-a nimerit zona). Simulatorul scrie nota
  (`note_diapozitive`), proba „A4 M zona de note …” trece; aspectul R13-9.
- `powerpoint-tragere-forma` — rezultatul real lipsește (neîncercat în runda `acoperire`).
Toate celelalte 38 de scenarii PowerPoint trec (inclusiv cele 11 noi probate).

## Pasul 0 (constructorul 2) — căderea din `runde/12/proba_grav.py` (1 din 49): schimbare VOITĂ, nu regres
- Verificarea „MINOR telefon 360: ce se vede e la fel ca la 552ac0c5” compară la pixel 4 capturi (pornirea, titlul atins, lansatorul
  Font în vedere, insignele Alt, H). Cu zona de note deschisă (cum pornește acum): toate 4 diferă, numai în banda y 322-609 px css
  (diapozitivul micșorat + zona de note sub el).
- Aceleași 4 capturi cu zona de note închisă (`bara_stare:Notes`): **0 pixeli diferiți în toate 4** (`runde/13/pas0_telefon.json ›
  cu_note_inchise`, scriptul `runde/13/pas0_telefon.py`, rulat dintr-o copie a probei 12 în %TEMP%). Caseta Font („Calibri Light
  (Headings)” acum, goală la 552ac0c5) nu se vede la 360 px, deci nu schimbă capturile.
- Referința: `uia_powerpoint.json › acoperire_r12.fapte.c_note.ShowNotes_la_pornire = true` (ShowNotes `bifat: 1` la pornire). Zona de
  note deschisă la pornire e cerută de referință; proba 12 o vede ca „altfel decât la 552ac0c5”. Căderea rămâne în proba 12 (nu o
  modific: e ieșirea comisă a rundei 12) și e explicată aici.

## Constructorul 2 — diferențele reparate (bucățile 5-7)
| # | suprafața | ce face aplicația reală (citat) | ce făcea simulatorul | grav. | reparația |
|---|---|---|---|---|---|
| D13 | Format Background pe fereastra mică / telefon (A3) | `panou.LaunchFormatBackground#Solid fill`: `Pane [1095, 278, 255, 417]` cu `ScrollBar [1333, 278, 17, 417]`; „Apply to All” [1095, 701, 80, 24] și „Reset Background” [1184, 701, 113, 24] ÎN AFARA lui | înălțimea din `ZR[3]` (zona referinței, 564), zona de pe ecran `overflow:hidden` → Apply to All la y 668 (fereastra 526), neatins (critic 12 A3) | GRAV | `potrivestePanou()`: Pane-ul se micșorează și se derulează, butoanele urcă; refăcut la redimensionare |
| D14 | Animation Pane pe fereastra mică / telefon (A3) | `panou.AnimationCustom`: `List 'Animation Pane' [1105, 261, 245, 469]`, butoanele deasupra | aceeași înălțime fixă | GRAV | `List` derulabilă, Play / Move Up / Down pe loc |
| D15 | locul panourilor (MINOR) | `panou.* [1088 / 1098, 218, …, 520]` față de `zona_document [1, 181, 1364, 564]` → 37 px sus, 8 px dreapta | top 2 px, right 2 px (34 px mai sus) | MĂRUNT | sus `s.r[1] − ZR[1]`, dreapta din referință; legenda pe banda de 37 px [presupus] R13-11 |
| D16 | Shapes ▾ (A1) | `lista.ShapesInsertGallery`: 190 ListItem cu nume în 10 grupuri, banda de 28-31 px deasupra rândurilor; lista [319, 159, 309, 849] lipită sub buton; Action Buttons [321, 996, 24, 24] (`ascuns` = în afara ecranului capturii) | 190 de pătrate identice, titluri goale, fără `title`, lista la y 3, Action Buttons 0×0 | GRAV | titlul grupului pe bandă (toate `lista.*`), `desenForma` în rânduri, `title`, lista sub buton tăiată + derulabilă (R13-13), Action Buttons desenate |
| D17 | paletele (A2) | `lista.FontColorPicker › Group 'Theme Colors'` (32 px titlu) / `'Standard Colors'` (35 px); 70 de nume (`acoperire_r11.fapte › randuri.lista.FontColorPicker`) | titluri goale, fără `title`; Shape Fill / Outline fără pătrate colorate | GRAV | același cod pentru toate cele 6 palete, `title` = numele, titlurile pe bandă (R13-12) |
| D18 | taste de acces cu lista deschisă | necapturat (README_referinte.md:148) | Esc lăsa lista deschisă cu insignele filei peste ea (critic 12 §3) | MĂRUNT | Esc închide lista și urcă un nivel; săgețile / Enter umblă în listă (R13-15) |
| D19 | butonul Font Color cu text ales (MINOR) | `a_font_color › buton_cu_text_ales › copii[0].eticheta = "Font Color Red"` | „Font Color” mereu | MĂRUNT | numele se schimbă în `actualizeazaPanglica` |
| D20 | Animation Pane (MINOR) | `rand_1_ales › Play From: true`; rândurile 22 / 22 (critic 12 §3) | „Play All” mereu; 26 / 24 | MĂRUNT | „Play From” cu rând ales; pas 22, înălțime 22 |
| D21 | Solid fill (MINOR) | starea `fundal_diapozitive = [{tip: solid}]` | niciun radio bifat | MĂRUNT | „Solid fill” bifat după clic |
| D22 | „Save your changes” (MINOR) | `TitleBar ''` (gol) | întrebarea în bara de titlu | MĂRUNT | bara goală, întrebarea în corp (R13-17) |
| D23 | fără diapozitive (MINOR) | `b_dont_save`: 0 prezentări; „Slide 1 of 0” nu e în referință | „Slide 1 of 0” cu `diapozitiv_activ null` | MĂRUNT | indicatorul gol (R13-16) |

## Rămase din critic 12 §7 (MINOR), cu motivul
- **Listele la +3, +3 px**: vin din decalajul butoanelor panglicii (cod comun cu Word / Excel; în interiorul listelor 0 px). Mutarea
  panglicii ar atinge toate cele trei aplicații → nu în runda asta.
- **Zonele de atins ≥ 32 px la 360 px** în grile (paletele 28×24, Table 27×27, Shapes 24×24): pasul grilei din referință e 24-28 px,
  deci o zonă de 32 px ar intra în vecin — nu se poate fără să se schimbe ce se vede (mărirea grilei). Font Color ▾ (20×32) și
  butoanele ferestrei „Save your changes” (70×24 / 88×24) nu le-am lărgit (timp).
- **„Save your changes” la 360 px începe la x = −26** și **„Pov” tăiat** în Save as type (caseta de 40 px din referință): neatinse.
- **Layout / New Slide fără miniaturi, „Content with Capti…” peste vecina; fila „Fill” ca text**: fără referință de desen.
- **Font style / Underline style / Alignment** neaplicate la OK: R12-9 (referința n-are câmpurile ca liste).
- **R13-4 (caseta Font)** păstrată: scenariul `powerpoint-font-titlu` apasă centrul casetei (UIA Expand pe real); n-am mutat
  deschiderea doar pe ▾ (n-am verificat că `sim_runner.js` ar nimeri tot lista) → abaterea rămâne scrisă în `de_verificat.md`.
- **Tastatura în panoul lateral** (Format Background: `ta` S / C / l / B pe controale): cum ajunge focusul în panou (F6?) nu e
  capturat → nesimulat; panoul se folosește cu mouse-ul / degetul.
