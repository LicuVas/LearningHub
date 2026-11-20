# Runda `acoperire` pe PowerPoint după runda 11 — STAREA (predare către un agent proaspăt, 20.11.2026 ~06:45)

Sarcina: `runde/11/acoperire_prompt.md` (citește-l întreg). D = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11`.
Nimic comis. `aplicatii/`, lecțiile, jocurile, `jocuri/_motor/` NEatinse. Niciun oracol atins. Lotul 1 (capturi) e TERMINAT
și scris; loturile 2-4 (scenarii, api, măsurare, reînghețare, raport) NU sunt începute.

## Făcut (pe disc, verificat)
- NOU `referinte/acoperire_powerpoint_r11.py` (generator-soră al lui `acoperire_excel_r7.py`; reutilizează `dump_uia_office`
  (Sesiune), `ruleaza_real` (gesturi), `acoperire_word_r3` (Cap), `acoperire_excel_r7` (captura, noi_reale, alese, mso_in_fir)).
  Comenzi gata: `capturi [--doar=a_font_color,b_inchidere,c_obiecte,d_efecte]`, `scrie`, `verifica`, `curata_mru`.
  `scenarii` / `scrie_scenarii` = STUB (NotImplementedError) — de scris (vezi mai jos).
  Siguranța e în cod: `ppt_ruleaza()` (tasklist) înainte de ORICE pornire, în procesul exterior și în cel de pe desktopul ascuns;
  `inchide_sigur()` numără prezentările (eticheta LHREF) și NU închide nimic dacă e una străină (Straina → NU_SE_POATE);
  Ctrl+N: `eticheteaza_noua()` etichetează doar prezentarea nouă „PresentationN”, nesalvată; `curata_mru()` șterge din
  File MRU / Place MRU (PowerPoint) și ComDlg32 (OpenSavePidlMRU, LastVisitedPidlMRU) DOAR intrările cu `lh_ppt_r11_`.
- 3 rulări de capturi (logurile `capturi_rulare1..3.log`), fiecare ~43 s, `erori` = [], închise normal prin WM_CLOSE, „nicio
  instanță PowerPoint rămasă”, „curățare Recent: nimic de șters” (nimic salvat în capturi). Brut: `capturi_powerpoint_brut.json`
  (0 căi spre profilul utilizatorului, verificat).
- `referinte/uia_powerpoint.json`: 11 chei NOI + blocul `acoperire_r11` (fapte, NEVERIFICAT, rulări). Cheile vechi neatinse.
  Copia de dinainte: `runde/11/acoperire/uia_powerpoint_inainte.json.bak` (nu e livrabil).
  `acoperire_powerpoint_r11.py verifica` = 0; `dump_uia_office.py verifica` = 0.
  Cheile: lista.FontColorPicker, lista.FontColorPicker_minibara (diferă: fără primele rânduri ale controlului),
  dialog.save_your_changes_to_this_file, lista.FlyoutAnchorInsertPictures, lista.ShapesInsertGallery, lista.TableInsertGallery,
  lista.SlideNewGallery, lista.SlideLayoutGallery, panou.AnimationCustom#doua_animatii, panou.LaunchFormatBackground#Solid fill,
  lista.FormatBackground_Color.

## Faptele capturate (PowerPoint real 16.0.20326.20318, instanță proaspătă)
- P2 Font Color: butonul gri fără text ales; cu text ales copilul se numește „Font Color Red” (culoarea butonului la pornire =
  roșu); paleta (Alt, H, F C): grupul gri „Gallery Filters” › „High-contrast only”, „Theme Colors” (10 × 6: „White, Background 1”,
  „Black, Text 1”, … „Green, Accent 6, Darker 50%”), „Standard Colors” (Dark Red, Red, Orange, Yellow, Light Green, Green, Light
  Blue, Blue, Dark Blue, Purple), „More Colors...” (Alt, H, F C, M), „Eyedropper” (… E). FĂRĂ „Automatic” și fără „Recent Colors”
  (nicio culoare folosită). Culoarea titlului la pornire (COM) #000000. Paleta din mini-bară = aceleași culori.
  Paleta Format Background › Color („Fill Color RGB(255, 255, 255)”, MenuItem) ARE „Automatic”.
- P3: Ctrl+W, File › Close și ✕ dau ACEEAȘI fereastră NUIDialog „Save your changes to this file?”: caseta File name (focusul),
  locul (Documents / OneDrive - Personal), butoanele Save, Don't Save, Cancel, apoi „More options…” (sub ele); niciun buton
  marcat implicit în UIA. Esc o închide, prezentarea rămâne. Cancel la fel (și Backstage se închide după File › Close › Cancel).
  Don't Save → PowerPoint fără prezentare: titlul „PowerPoint”, cele 11 file, Home aleasă, File activ, Paste/New Slide/Bold/Font
  Color gri, zona = MDIClient gol. Ctrl+N de acolo → „Presentation2” (Title Slide), aceeași fereastră. Ctrl+N cu o prezentare
  deschisă → „Presentation3” într-o fereastră NOUĂ, activă. Ctrl+O → Backstage › Open.
- P4: Pictures ▾ = This Device..., Stock Images..., Online Pictures... ; This Device... → fereastra Windows „Insert Picture”.
  Shapes = 195 de rânduri (Recently Used Shapes, Lines, Rectangles, Basic Shapes, Block Arrows… cu „Arrow: Right”, „Star: 5 Points”).
  New Slide ▾ = Title Slide, Title and Content, Section Header, Two Content, Comparison, Title Only, Blank, Content with Caption,
  Picture with Caption, Duplicate Selected Slides, Slides from Outline..., Reuse Slides... ; Layout = primele 9.
  Table ▾ = grila 1x1…10x8 („NxM Table”) + rândurile de sub ea (vezi structura în brut).
- P5: Duration activ, „02,00” (COM 2.0) după Fade; Apply To All pune Fade + 2,00 pe toate 3. Animation Pane cu două animații:
  rândurile „Fade : Title 1: Vulcanii”, „Fly In : Subtitle 2: Ce sunt” (+ „On Click / Entrance”); cu primul rând ales: Move Up GRI,
  Move Down ACTIV, Play From activ. Format Background › Solid fill: Apply to All activ, Reset Background gri.
- [NEVERIFICAT] (în `acoperire_r11.NEVERIFICAT`): Duration „0,5”+Enter (SetFocus UIA n-a dat focusul casetei — de încercat
  ValuePattern.SetValue sau clic de mouse postat pe casetă); al doilea rând din Animation Pane ales + Move Up (Select UIA n-a
  schimbat rândul ales — de încercat clic de mouse pe rând / tastele ↓ în listă).

## Rămas de făcut (în ordinea asta)
1. Scenariile (secțiunea `scenarii_intern` / `scrie_scenarii` din generator; clasa = subclasă `RR.PowerPoint` ca `ExcelR7`):
   tmp cu prefixul `MARCAJ`; `start()` verifică `straine()`, închide prezentările mele în plus, `Presentations.Add` dacă 0;
   chei noi de stare: `prezentare_activa`, `prezentari_deschise`, `dialog` {titlu, intrebare, butoane (fără Închidere/Open, ordinea
   de pe ecran), apasat}, `culoare_text` (#RRGGBB din forma_citita), `durata_tranzitie` (listă pe diapozitive),
   `ordine_animatii` (indicii formelor în MainSequence, diapozitivul activ), `fundal_diapozitive` [{tip, culoare}],
   `forme_diapozitiv` [{fel, forma_auto_cod, text}], `pozitii_forme`. NU pune `culoare` în `formatare_text` (ar strica scenariile vechi).
   Scenarii: ctrl-n (rulat PRIMUL, pe Presentation1 de la pornire, apoi proba; real așteptat „Presentation2”), ctrl-w-modificat
   (tastare + Ctrl+W + clic fereastra:Cancel), salvare-ca rescris (File › Save As › Browse › nume în %TEMP% › Enter, ca
   `X7.SALVARE_CA_PASI`), diapozitiv-nou-buton rescris (`tinta: panglica:Home/Slides/New Slide` = copilul Button al lui
   SlideNewGallery din referință; real = Invoke pe acel copil), imagine rescris (`FlyoutAnchorInsertPictures` + `element:
   "This Device..."` + `fisier`), font-color-titlu (`FontColorPicker_Dropdown` + `element: "Red"`), two-content (New Slide ▾ și
   Layout), sageata-dreapta (Shapes › „Arrow: Right” + clic pe diapozitivul Title Only — cere proba „mouse” pt PowerPoint),
   durata (după ce se lămurește tastarea), animatii-move-up, fundal-aplica-la-toate, ctrl-c-v-caseta (DOAR dacă clipboard-ul
   omului are doar text: salvat și pus la loc; altfel nerulat). `sursa_gest` din critic.md (m1-l02:329, m1-l03:106/:211/:241,
   m1-l05:184, m1-l06:150, m1-l07:156/:194, m2-l08:205/:330, m2-l09:228/:233, m2-l10:150/:151/:299) — de verificat că rândul există.
2. `api_biblioteca.md`: §5 powerpoint cheile de mai sus; §3 felul `margine_forma:D/S`.
3. `suprafete.json`: intrări `powerpoint.<cheie>` cu `sursa` (ca `acoperire_r3` la Word); O3 nu le numără dacă au sursă.
4. `de_verificat.md`: de bifat R11-1 (listele: lista.SlideNewGallery / SlideLayoutGallery / FlyoutAnchorInsertPictures /
   TableInsertGallery), R11-12(f) Font Color (lista.FontColorPicker), R11-13 (dialog.save_your_changes_to_this_file); R11-9/R11-10
   după scenariile rescrise. Restul rămân.
5. Măsurarea SINGURĂ: `python D/oracole/masoara.py --runda 11 --paralel 3 --compara D/runde/11/masurare_final_r11.json`
   (35-75 min; regula O6 NECONCLUDENT din prompt). Înainte: O1 61, O2 13392, O3 21586, O4 33, O5 82, O6 0, O7 343, O8 102, O9 27.
6. `ingheata.py --acoperire "…"` (textul din prompt), `ingheata.py --verifica` = 0; raportul `runde/11/acoperire_powerpoint.md`.
