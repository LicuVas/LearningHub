# Runda 12 · tabelul diferențelor (pasul 5) — constructorul 1 (PowerPoint)

Fiecare rând: suprafața · ce face aplicația reală (citat din referința înghețată) · ce face simulatorul acum (powerpoint.js:rând) ·
gravitate · reparația. Liniile din `powerpoint.js` sunt cele de după reparație.

| # | suprafața | aplicația reală (citat) | simulatorul (înainte → acum) | grav. | reparația |
|---|---|---|---|---|---|
| P1 | KeyTips | `panglica.TabHome › Bold … tasta_acces 'Alt, H, 1'`, Font Size „Alt, H, F S”, New Slide „Alt, H, I”, Animation Pane „Alt, A, C” (uia_powerpoint.json); lista New Slide are „Alt, H, I, D/L/R” | înainte: „Alt, H, 1” scria „h1” în titlu (critic 11 a4_out); acum: blocul `kt` (powerpoint.js:1565…), captură pe rădăcină, un eveniment `tasta_acces` pe tastă | GRAV | Alt / literă / Esc ca în word.js; partea „More Options” câștigă litera |
| P3 | Ctrl+W, File › Close, ✕ | `dialog.save_your_changes_to_this_file`: titlu gol, File name cu focus, butoane More options…, Save, Don't Save, Cancel; `b_ctrl_w/b_file_close/b_x`; Cancel → 1 prezentare (scenarii_real/powerpoint-ctrl-w-modificat.json) | înainte: mesaj central; acum `cerereInchidere` / `raspunsInchidere` (powerpoint.js:721…) | GRAV | fereastra din referință, `dialog` în stare (Word: M.intrebare) |
| P3 | Don't Save | `b_dont_save`: 0 prezentări, titlul „PowerPoint”, Paste/New Slide/Bold/Font Color gri, File și filele active | `inchidePrezentare` + `actualizeazaPanglica` (toate comenzile gri), `.lh-ap-p-fara` | GRAV | |
| P3 | Ctrl+N / Ctrl+O | `powerpoint-ctrl-n`: Presentation2, 2 deschise; `b_ctrl_n_cu_prezentare`: Presentation3; `b_ctrl_o`: Backstage Open | `prezentareNoua` (powerpoint.js:759), `CAMPURI_PREZ/PREZ`, Ctrl+O → `deschideBackstage('Open')` | GRAV | |
| P2 | Font Color ▾ / mini-bara | `lista.FontColorPicker` (Theme Colors 10×6, Standard 10, More Colors…, Eyedropper, fără Automatic), `lista.FontColorPicker_minibara`; Red → `culoare_text` #FF0000 | înainte: „nu e simulată”; acum `listaRef` (519) + `culoareDin` (567) + `aplicaCuloare` (580), `c` în formatul caracterelor, ecranul colorat, Ctrl+Z | GRAV | valorile în afară de Red / Light Blue / alb / negru = [presupus] R12-3 |
| P4 | Layout / New Slide ▾ | `lista.SlideLayoutGallery` / `lista.SlideNewGallery`: 9 aspecte; Two Content = 3 forme (scenarii_real/powerpoint-two-content-*.json) | înainte: 3 rânduri scrise în cod; acum lista din referință + `ASPECTE` (23…) | GRAV | geometria noilor aspecte [presupus] R12-4 |
| P4 | Insert › Pictures | `lista.FlyoutAnchorInsertPictures` → `dialog.PictureInsertFromFilePowerPoint`; nume + Enter → forme 2 → 3 (powerpoint-imagine.json) | înainte: mesaj; acum lista + fereastra + `insereazaImagine` (1019) | GRAV | mărimea imaginii [presupus] R12-5 |
| P4 | Insert › Shapes | `lista.ShapesInsertGallery` (195 rânduri); Arrow: Right + clic → `forme_diapozitiv` `{fel: forma, forma: "Arrow: Right"}` | înainte: mesaj; acum `unealta` + `insereazaForma` (1032) | GRAV | mărimea implicită [presupus] R12-5 |
| P4 | Insert › Table | `lista.TableInsertGallery` (grila 7×6 + Insert Table... / Draw Table / Excel Spreadsheet) | înainte: grilă 10×8 + „Insert Table...” scris de mână; acum lista din referință | MĂRUNT (MINOR R11-1) | |
| P4 | Ctrl+C/V pe casetă-obiect | powerpoint-ctrl-c-v-caseta.json: pe diapozitivul 2 `caseta_text` „O stea” la [120, 284, 720, 130] | înainte: Ctrl+C tăcea; acum powerpoint.js:1485 / 1504 | GRAV | |
| P5 | Duration | `panglica.TabTransitions › Spinner Duration` activ, „02,00”; Fade = 0,7, Apply To All copiază (powerpoint-durata-aplica-la-toate.json) | înainte: readOnly + mesaj; acum caseta editabilă (1127), `durata` pe diapozitiv, `durata_tranzitie` (195) | GRAV | „0,5” + Enter [NEVERIFICAT] R11-14 / R12-6 |
| P5 | Animation Pane | `panou.AnimationCustom#doua_animatii` (rânduri „On Click\nEntrance\nFade : Title 1: Vulcanii ”); `d_efecte.animation_pane.rand_1_ales`: Move Up gri, Move Down activ; Move Up pe rândul 2 → [2, 1] (powerpoint-animatii-move-up.json) | înainte: rânduri aria-hidden, butoane gri mereu; acum `randuriAnimatii` / `mutaAnimatie` / `clicPanou` (829-873) | GRAV | Fade = cod 10 (din același scenariu) |
| P5 | Format Background | `panou.LaunchFormatBackground#Solid fill`, `lista.FormatBackground_Color` (are Automatic); Light Blue + Apply to All → #00B0F0 pe toate (powerpoint-fundal-aplica-la-toate.json) | înainte: „nu e simulată”; acum `variantaFundal`, lista `fundal`, `fundal_diapozitive` | GRAV | tipul fundalului neatins [presupus] R12-7 |
| — | ținta `diapozitiv` | clicul real: „colț gol al diapozitivului (97%, 97%)” (scenarii_real/powerpoint-fundal-aplica-la-toate.json › cum) | înainte: `diapozitiv:1` pe tot fundalul (centrul acoperit de titlu pe Title Slide); acum colțul 6 %×6 % (powerpoint.js:384) + fundalul, ambele `diapozitiv` | geometria țintei, nu comportament | vezi contra.md (adevărul incomod) |

## Scenariile PowerPoint care încă nu trec (O4 doar PowerPoint, `runde/12/o4_ppt.py`)
- `powerpoint-tragere-forma` — fără rezultat real (`referinte/scenarii_real/powerpoint-tragere-forma.json` lipsește, R11-5):
  nu se poate judeca; rămâne 1 la O4 până la o rundă `acoperire`.
Toate celelalte 26 trec (19 → 1 pe PowerPoint).

## O3 (adevărul incomod din cadru.md)
O3 randează paginile lecțiilor din `inventar.json`; lecțiile PowerPoint încă încarcă simulatoarele vechi, deci listele desenate
acum în bibliotecă NU scad O3 (+3490 rămân până la etapa C, când lecțiile vor încărca biblioteca).
