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

## Nereparate în bucata asta (urmează la constructorul următor)
A3 (Format Background / Animation Pane pe fereastra mică și pe telefon — `panouLateral` folosește încă `ZR[3]`), A1 (Shapes:
titlurile grupurilor, desenul rândurilor cu `desenForma`, `title`, locul listei, Action Buttons 0×0), A2 (titlurile paletelor,
`title` = numele culorii), MINOR rest din critic 12 §7.
