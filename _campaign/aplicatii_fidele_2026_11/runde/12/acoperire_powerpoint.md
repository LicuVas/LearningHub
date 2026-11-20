# Runda `acoperire` pe PowerPoint după runda 12 (B-powerpoint) — raportul (20.11.2026)

Un agent. Sarcina: `runde/12/acoperire_prompt.md`. Starea pas cu pas: `runde/12/acoperire/stare_autor.md`.

## 1. Numerele (aceeași bibliotecă, `aplicatii/` neatinsă)
Înainte = `runde/12/masurare_final_r12.json`; după = `runde/12/masurare.json` (`masoara.py --runda 12 --paralel 3 --compara
runde/12/masurare_final_r12.json`, pornit SINGUR la 12:49, după ultima scriere în zona înghețată; 4385 s; lacăt ok la
început și la sfârșit; 0 neconcludente; O6 concludent, 1792 s; log: `runde/12/acoperire/masurare_rulare.log`).

| oracol | înainte | după | de ce |
|---|---|---|---|
| O1 | 61 | 61 | — |
| O2 | 13392 | 13392 | — |
| O3 | 25076 | **26855** | +1779 = exact cele 8 suprafețe noi, nedesenate încă de bibliotecă (`runde/12/iesiri/O3/oracol_ui.json › pe_suprafata`): OutlineColorPicker 547, ShapeFillColorPicker 540, dialog.FileOpen 253, lista.Font 155, SlideBackgroundStylesGallery 99, bara_stare#Slide Sorter 92, OutlineColorPicker#Weight 71, AnimationStartDropdown 22; `fara_referinta` neschimbat |
| O4 | 30 | **50** | +20 = cele 14 scenarii noi (detaliul mai jos); scenariile vechi neschimbate |
| O5 | 82 | 82 | — |
| O6 | 0 | 0 | concludent |
| O7 | 341 | 341 | — |
| O8 | 102 | 102 | — |
| O9 | 27 | 27 | — |
| porți | 41 | **43** | cum_fac 41 (la fel); `controale_taiate` 0 → 2 = două ERORI DE MĂSURARE, 0 defecte: `Page.goto` / `Page.click` peste 8000 ms pe vi/m4-l26 (telefon) și vi/m3-l16 (zoom125) — mașina lentă; poarta citește lecțiile și biblioteca, nu `referinte/` / `scenarii/` (`runde/12/iesiri/porti/porti_controale_taiate.log`); de reluat la măsurarea rundei 13 |

O4 pe scenariile noi (`runde/12/iesiri/O4/oracol_comportament.json`): `durata-fade` 0 (trece); diferențe — `blank-presentation` 2
(simulatorul: Presentation1 / 1), `ctrl-o-browse` 2 (Presentation1 / 1), `imagine-two-content` 2 (forme_diapozitiv,
pozitii_forme), `durata-push` 1 și `durata-wipe` 1 (simulatorul 2 s, realul 1 s), `slide-sorter` 1 și `slide-sorter-normal` 1
(cheia `vedere` lipsă); neexecutabile — `animatie-start` 2 (`meniu:After Previous` nu e pe ecran), `font-titlu` 1
(`meniu:Calibri Light (Headings)`), `shape-fill` 1 (`meniu:Yellow`), `background-styles` 1 (`meniu:Style 6`); fără rezultat
real probat (și nejucabile) — `stea-ctrl-c-v` 3, `note` 2. Sumă 20.

**Mutanți: înainte = după.** Niciun oracol atins (O3 citește singur `referinte/uia_*.json` și `suprafete.json`, O4 singur
`scenarii/**` + `scenarii_real/`), deci bancul nu se declanșează; nicio suprafață nouă nu cere un mutant nou pe un oracol.

## 2. Fișierele schimbate (toate înghețate: `ingheata.py --acoperire "…"` la 12:49, 401 fișiere, `--verifica` = 0)
- `referinte/acoperire_powerpoint_r12.py` (NOU; generatorul-soră al lui `acoperire_powerpoint_r11.py`, îi folosește pornirea
  sigură, `inchide_sigur`, `curata_mru` și clasa de scenarii; comenzile `capturi [--doar=]`, `scrie`, `scrie_scenarii`,
  `scenarii [--id=]`, `verifica` = 0);
- `referinte/uia_powerpoint.json`: 8 chei noi + blocul `acoperire_r12` (fapte, NEVERIFICAT, rulări) — `dialog.FileOpen`,
  `lista.Font`, `lista.AnimationStartDropdown`, `lista.ShapeFillColorPicker`, `lista.OutlineColorPicker`,
  `lista.OutlineColorPicker#Weight`, `lista.SlideBackgroundStylesGallery`, `bara_stare#Slide Sorter`; cheile vechi neatinse;
- `referinte/scenarii_real/powerpoint-*.json`: 14 noi (12 probate, 2 fără rezultat probat — §5);
- `scenarii/powerpoint/`: 14 noi (`rulat_de` = generatorul de mai sus);
- `api_biblioteca.md`: §3 (ținte `bara_stare`, `zona_note`; nota la `margine_forma`), §5 powerpoint (`font_text`,
  `pornire_animatii`, `umplere_forme`, `note_diapozitive`, `vedere`; `fel: imagine` la substituentul cu imagine), §7.1
  (`start`: `diapozitive[].forme`, `diapozitive[].fonturi`, `fisiere`);
- `suprafete.json`: 8 intrări `powerpoint.<cheie>` + nota `acoperire_r12`.
Niciun oracol atins: O3 citește singur `referinte/uia_*.json` + `suprafete.json`, O4 singur `scenarii/**` + `scenarii_real/`
(ținte noi cu `<fel>:` sau simple trec neschimbate prin `sim_runner.js › tintaPas`) → bancul de mutanți nu se declanșează.
În afara zonei înghețate: `de_verificat.md`, `runde/12/acoperire/*` (loguri, brut, jurnal, copii `.bak`, `scenarii_inainte/`).

## 3. Ce s-a capturat și cum
Toate din instanța MEA `POWERPNT /B` pe desktopul ascuns (LHRefOffice pentru capturi: 3 sesiuni de 104 / ~240 / 123 s;
LHScenarii pentru scenarii: 2 sesiuni de ~8 min), fereastra 1366×768 css, COM din fereastra instanței
(AccessibleObjectFromWindow); gesturi: clic de mouse postat, WM_KEYDOWN / WM_CHAR, UIA Expand / Invoke / Select. Probele
canalelor în fiecare sesiune de scenarii: model_obiect, panglica, taste, tastare, mouse — 5/5 trecute.
- **P4 · clicul pe formă** (`acoperire_r12.fapte.a_forma_clic`): clicul în MIJLOCUL stelei, săgeții, dreptunghiului și chiar
  al casetei de text nealese → `Selection.Type 2` (forma ca OBIECT), nu cursor în text; pe chenarul dreptunghiului care
  încadrează steaua (în afara desenului) → nimic; locul gol → nimic. Ctrl+C pe steaua aleasă → clipboard cu formele
  PowerPoint; miniatura 2 (prin COM: panoul miniaturilor nu e fereastră separată) → Ctrl+V = „Star: 5 Points” pe
  diapozitivul 2, în același loc [60, 180, 180, 170]. Clipboard-ul omului salvat, golit, pus la loc.
- **P3 · fișierele**: File › New › Blank Presentation (UIA Invoke pe rândul `AIOStartDocument`, tasta Alt, F, N, L) →
  „Presentation2”, 2 deschise, fereastra activă „Presentation2”, Backstage închis, un diapozitiv Title Slide. Ctrl+O →
  Backstage › Open › Browse → fereastra `#32770` „Open” (`dialog.FileOpen`): File name: (ComboBox + Edit, gol), Files of type:
  „All PowerPoint Presentations (*.pptx;*.ppt;*.pptm;*.ppsx;*.pps;*.ppsm;*.potx;*.pot;*.potm;*.odp)”, Open ▾ (SplitButton),
  Cancel, Tools ▾; restul ferestrei în româna Windows; niciun element nu raportează focusul. Captura structurii e făcută
  după ce am trecut fereastra în dosarul meu din %TEMP% (listele omului nu intră; elementele listelor „[element de listă,
  nesalvat]”, 19 elemente personale din panoul din stânga scoase, dosarele „<folder>”). „Plante_6A_Pop.pptx” + Enter →
  prezentarea activă „Plante_6A_Pop.pptx”, 2 deschise, fereastra Open închisă.
- **A4 · listele**: Font ▾ cu titlul ales (Comic Sans MS) — Theme Fonts: „Calibri Light (Headings)”, „Calibri (Body)”; All
  Fonts: 318 nume (fonturile acestui PC; în suprafață doar cele 17 vizibile la deschidere, toate numele în
  `fapte.c_font.all_fonts`); Recently Used Fonts n-a apărut în instanța nouă; după Calibri Light (Headings): Font.Name
  „Calibri Light”, caseta arată „Calibri Light (Headings)”. Start ▾ (idMso `AnimationStartDropdown` din
  powerpointcontrols.xlsx; în UIA caseta n-are AutomationId): On Click / With Previous / After Previous → TriggerType 1 / 2 / 3,
  caseta arată numele. Shape Fill ▾ (Shape Format; aceleași rânduri în Home › Drawing, în afară de numele butonului): Theme
  Colors 60, Standard Colors 10, No Fill, More Fill Colors..., Eyedropper, Picture..., Gradient ▸, Texture ▸; Yellow →
  #FFFF00. Shape Outline ▾: aceleași culori, No Outline, More Outline Colors..., Eyedropper, Weight ▸, Sketched ▸, Dashes ▸,
  Arrows ▸; Weight ▸ = ¼ … 6 pt + More Lines... (3 pt → Line.Weight 3.0); Orange → #FFC000. Background Styles ▾ (Design):
  Style 1 … Style 12, Format Background..., Reset Slide Background (gri); diapozitivul neatins = solid #FFFFFF; Style 6 →
  solid #E9E7E7 pe AMBELE diapozitive.
- **A4 · note și vederi**: View › Notes (`ShowNotes`) și „Notes” din bara de stare comută zona de note
  (`CommandBars.GetPressedMso("ShowNotes")`: apăsat la pornire → neapăsat → apăsat; pus la loc); zona de note NU apare în UI
  Automation. Bara de stare: Slide Sorter → ViewType 7 (bara de stare fără Notes / Comments, Slide Sorter apăsat, Zoom
  100 % — `bara_stare#Slide Sorter`), Normal → 9; Reading View → fereastră de expunere ne-full-screen, Esc → Normal; Slide
  Show → `screenClass` full screen, Esc → Normal.
- **Durata tranzițiilor** (`fapte.d_durate`): fără tranziție „02,00” / 2.0; după clic pe Fade în galerie „00,70” / 0.7; Push
  „01,00” / 1.0; Wipe „01,00” / 1.0; unul după altul pe același diapozitiv 0.7 → 1.0 → 1.0 → 0.7 (fiecare efect pune durata
  lui); EntryEffect = 3849 pus prin COM → rămâne „02,00” / 2.0. **Contradicția lămurită**: `acoperire_r11.fapte.d_efecte`
  pusese Fade prin COM (`SlideShowTransition.EntryEffect = 3849`, acoperire_powerpoint_r11.py:743), drum care nu aplică
  durata implicită; clicul în galerie (scenariul) dă 0,7.
- **Bonus**: imaginea pe Two Content cu caseta din dreapta goală → PowerPoint o pune ÎN caseta goală (substituent cu
  imagine, [486, 163, 408, 304]), tot 3 forme. Sfaturile la hover și Enter în „Save your changes” → §5.
- **Scenariile** (12 probate, toate `gest_real`, `mod_probat: true`): blank-presentation („Presentation2” / 2), ctrl-o-browse
  („Plante_6A_Pop.pptx” / 2), font-titlu („Calibri Light”), animatie-start ([["dupa_precedenta"]], Fade = 10),
  shape-fill ([{fara}, {solid #FFFF00}]), background-styles (#E9E7E7 ×2), slide-sorter („sortare”), slide-sorter-normal
  („normala”), durata-fade [0.7], durata-push [1.0], durata-wipe [1.0], imagine-two-content (a treia formă `fel: imagine`,
  [486, 163, 408, 304]).

## 4. Rândurile din `de_verificat.md`
Niciun rând nu e lămurit ÎNTREG, deci niciun [x]; note „→ runda `acoperire` după runda 12” cu dovada la: R11-14 (ce scrie
Duration fără tastare), R12-2 (c → [NEVERIFICAT], motivul), R12-5 (imaginea pe Two Content), R12-6 (duratele Fade / Push /
Wipe; rămâne doar „0,5” + Enter), R12-7 (diapozitivul neatins = solid #FFFFFF prin COM). Noi: R12-11 (hover), R12-12 (zona de
note și chenarul formei în UIA).

## 5. [NEVERIFICAT]
- `powerpoint-stea-ctrl-c-v`: nerulat — clipboard-ul omului era OCUPAT în ambele sesiuni (OpenClipboard = Access denied, și
  din desktopul lui); fără clipboard salvat nu apăs Ctrl+C. Drumul e capturat (§3, P4), doar miniatura prin COM.
- `powerpoint-note`: clicul postat n-a nimerit zona de note (Selection.Type 0); pasul reparat (punctul din
  `ActiveWindow.SplitVertical`), dar reluarea s-a întrerupt (§7) și n-am mai putut porni PowerPoint.
- Sfaturile la hover (A1 / A2): WM_MOUSEMOVE postat pe „Yellow” n-a deschis niciun ToolTip pe desktopul ascuns.
- Enter în File name din „Save your changes”: Enter = Save ar scrie în Documentele / OneDrive-ul omului (prima încercare:
  PowerPoint „ocupat”, NIMIC salvat — 0 fișiere .pptx noi pe disc, 0 intrări în HKCU\Software\Microsoft\Office).
- Zona de note și chenarul formei alese nu sunt în UI Automation (aspectul lor); „0,5” + Enter în Duration (R11-14).
- `powerpoint-tragere-forma` (bonus): neîncercat.

## 6. Ce vede acum oracolul
- **P3** (fișierele): O3 +253 (`dialog.FileOpen`); O4 `blank-presentation` 2 și `ctrl-o-browse` 2 — referința spune acum ce
  trebuie: „Presentation2” / 2 prezentări, „Plante_6A_Pop.pptx” / 2. Contractul (§7.1 `start.fisiere`) dă fișierul de deschis.
- **P4** (steaua): faptul care decide e în referință — clicul în mijlocul unei forme o alege ca OBIECT (Selection.Type 2, și la
  caseta de text), deci `cursor_text` + Ctrl+C mut din simulator e greșit; §3 o scrie la `margine_forma`. O4 vede
  `stea-ctrl-c-v` doar ca „fără rezultat real” (3), nu ca diferență de stare (§5). §7.1 `start.diapozitive[].forme` deblochează
  diapozitivele de pornire ale m1-l05 / m1-l06 / m2-l09 (O4 `shape-fill`, `imagine-two-content` le folosesc).
- **A1 / A2** (numele la hover): nimic nou în oracol — sfatul la hover a rămas [NEVERIFICAT] (R12-11).
- **A4**: O3 +1526 (Font ▾ 155, Start ▾ 22, Shape Fill ▾ 540, Shape Outline ▾ 547 + Weight ▸ 71, Background Styles ▾ 99, bara de
  stare în Slide Sorter 92); O4 `font-titlu` 1, `animatie-start` 2, `shape-fill` 1, `background-styles` 1, `slide-sorter` 1,
  `slide-sorter-normal` 1, `note` 2 (fără rezultat real).
- **Durata** (contradicția): lămurită în referință (`acoperire_r12.fapte.d_durate`); O4 `durata-fade` 0, `durata-push` 1,
  `durata-wipe` 1.

## 7. Confirmarea
- **Instanțele mele**: 5 sesiuni ieșite curat (3 de capturi, 2 de scenarii): tasklist gol înainte, la închidere doar
  prezentările mele (`straine: []`), WM_CLOSE, „nicio instanță PowerPoint rămasă”.
- **INCIDENTUL (sesiunea a 6-a, 12:30)**: am pornit-o cu un `timeout` mai scurt decât sesiunea; la 170 s s-a oprit
  wrapper-ul, iar procesul intern a fost oprit înainte de închiderea sigură. POWERPNT.EXE **PID 19528** (al meu: pornit 12:30:52 cu
  `/B` de procesul meu) a rămas fără ferestre pe orice desktop, cu un singur fir, în ieșire; `taskkill /PID 19528 /F` (12:37,
  după 90 s, doar acest PID) răspunde „no running instance” — procesul e deja în terminare și nu poate fi oprit mai mult.
  La 14:05 încă apare în tasklist (520 K, scade de la 226 MB). Fără ferestre COM nu se poate lega, deci prezentările nu s-au
  putut număra; un proces fără ferestre, cu un fir, nu poate ține o prezentare a omului. **De verificat de orchestrator /
  om**: că 19528 a dispărut (altfel o repornire a PC-ului îl scoate) și că PowerPoint pornește normal la om. N-am mai pornit
  PowerPoint după 12:30 (regula: tasklist nu e gol).
- **Nicio prezentare străină n-a intrat** (toate închiderile: `straine: []`). Notă: „Vulcanii” / „Planetele” din jurnalele de
  închidere sunt numele pe care PowerPoint 365 le dă singur prezentărilor MELE nesalvate (după titlu), nu fișiere salvate.
- **Recent**: ComDlg32 (OpenSavePidlMRU `*` / `pptx` / `png`) curățat după fiecare sesiune doar pe intrările `lh_ppt_r12_`;
  acum 0 intrări cu `lh_ppt_r12_` în ComDlg32 și 0 în `HKCU\Software\Microsoft\Office\16.0` (reg query). Resiliency după
  oprirea forțată: șterse DOAR intrările instanței mele (ora 12:30:53 = pornirea ei): `StartupItems › $<a`,
  `DocumentRecovery\B060EA8`; acum Resiliency fără valori. %TEMP%: niciun dosar `lh_ppt_r12_*` rămas.
- **Clipboard-ul**: la capturi salvat (doar text), golit înainte de Ctrl+C, pus la loc (`clipboard_pus_la_loc: true`); în
  scenarii neatins (era ocupat, scenariul s-a oprit înainte de orice tastă).
- WINWORD 28392 neatins; nimic pe ecranul omului (toate gesturile pe LHRefOffice / LHScenarii).
- `acoperire_powerpoint_r12.py verifica` = 0; `dump_uia_office.py verifica` = 0; `ruleaza_real.py verifica` = 13 (11 vechi + cele
  2 de la §5); poarta date_personale = 0 (în măsurare); `ingheata.py --verifica` = 0 după măsurare.

ACOPERIRE_PARTIALA
