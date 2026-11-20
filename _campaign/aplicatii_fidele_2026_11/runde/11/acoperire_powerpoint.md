# Runda `acoperire` pe PowerPoint după runda 11 (B-powerpoint) — raportul (20.11.2026)

Doi agenți: primul a făcut capturile UIA (lotul 1), al doilea scenariile, contractul, măsurarea și reînghețarea.

## 1. Numerele (aceeași bibliotecă, `aplicatii/` neatinsă)
Înainte = `runde/11/masurare_final_r11.json`; după = `runde/11/masurare.json` (masoara.py --runda 11 --paralel 3, pornit
singur după ultima scriere în zona înghețată; lacăt ok la început și la sfârșit; 0 neconcludente; O6 concludent, 1060 s).

| oracol | înainte | după | de ce |
|---|---|---|---|
| O1 | 61 | 61 | — |
| O2 | 13392 | 13392 | — |
| O3 | 21586 | **25076** | +3490 = exact cele 11 suprafețe noi din `uia_powerpoint.json`, nedesenate încă de bibliotecă (`runde/11/iesiri/O3/oracol_ui.json`): ShapesInsertGallery 1268, FormatBackground_Color 519, FontColorPicker 512, FontColorPicker_minibara 512, TableInsertGallery 316, LaunchFormatBackground#Solid fill 99, SlideNewGallery 85, SlideLayoutGallery 64, save_your_changes_to_this_file 57, AnimationCustom#doua_animatii 36, FlyoutAnchorInsertPictures 22 |
| O4 | 33 | **48** | 10 scenarii noi + 3 rescrise (detaliul mai jos) |
| O5 | 82 | 82 | — |
| O6 | 0 | 0 | — |
| O7 | 343 | 341 | −2 (motiv `fara_referinta`; neinvestigat rând cu rând) |
| O8 | 102 | 102 | — |
| O9 | 27 | 27 | — |
| porți | 41 | 41 | doar cum_fac |

O4, pe scenariu (`runde/11/iesiri/O4/oracol_comportament.json`): `diapozitiv-nou-buton` și `salvare-ca` trec acum (0);
`imagine` neexecutabil (meniu:This Device... lipsă) 1; `tragere-forma` fără rezultat real 1 (ca înainte); noi:
`ctrl-w-modificat` 3 (fereastra:Cancel lipsă), `ctrl-c-v-caseta` 3 (diferențe), `animatii-move-up` 2 (margine_forma:1/2 lipsă),
`sageata-dreapta` 2, `ctrl-n` 2 (chei lipsă), `font-color-titlu` 1, `two-content-new-slide` 1, `two-content-layout` 1,
`fundal-aplica-la-toate` 1 (ținta `diapozitiv` lipsă), `durata-aplica-la-toate` 1 (cheia `durata_tranzitie` lipsă).

**Mutanți: înainte = după.** Niciun oracol atins (O3 citește singur `referinte/uia_*.json`, O4 singur `scenarii/**` +
`scenarii_real/`), deci bancul nu se declanșează; nicio suprafață nouă nu cere mutant nou pe oracol.

## 2. Fișierele schimbate (toate înghețate: `ingheata.py --acoperire`, apoi `--verifica` = 0, 372 de fișiere)
- `referinte/acoperire_powerpoint_r11.py` (generatorul; scenariile + proba mouse pe PowerPoint);
- `referinte/uia_powerpoint.json` (11 chei + `acoperire_r11`, lotul 1); `referinte/probe_mod.md` (proba „mouse” PowerPoint);
- `referinte/scenarii_real/powerpoint-*.json`: 10 noi + 3 rescrise; `scenarii/powerpoint/`: 10 noi + 3 rescrise;
- `api_biblioteca.md` (§3 `margine_forma`, §5 powerpoint chei noi); `suprafete.json` (11 intrări `powerpoint.<cheie>` + `acoperire_r11`).
În afara zonei înghețate: `de_verificat.md`, `runde/11/acoperire/*` (loguri, jurnal, copii `.bak` / `scenarii_inainte/` — nu sunt livrabile).

## 3. Ce s-a capturat și cum
- Capturile UIA (lotul 1): vezi `runde/11/acoperire/stare_autor.md` și `uia_powerpoint.json › acoperire_r11.fapte`.
- Scenariile, toate `gest_real`, rulate pe instanța MEA (`POWERPNT /B`, desktopul ascuns LHScenarii, COM din fereastră),
  3 sesiuni (511 s, 312 s, 247 s); probele în fiecare sesiune: model_obiect, panglica, taste, tastare, mouse — 5/5 trecute.
  13/13 cu `mod_probat: true`. Rezultatele reale:
  - `ctrl-n`: „Presentation2”, 2 prezentări deschise; `ctrl-w-modificat`: dialog {titlu "", „Save your changes to this file?”,
    [More options…, Save, Don't Save, Cancel], apăsat Cancel}, 1 prezentare, textul păstrat;
  - `font-color-titlu`: Red → #FF0000; `two-content-new-slide`: diapozitiv 2 Two Content (3 forme); `two-content-layout`:
    diapozitivul 2 devine Two Content, titlul păstrat;
  - `ctrl-c-v-caseta`: caseta „O stea” lipită pe diapozitivul 2 ca CASETĂ DE TEXT (nu substituent), în același loc
    [120, 284, 720, 130] pt;
  - `sageata-dreapta`: a doua formă = „Arrow: Right”; `durata-aplica-la-toate`: Fade din galerie = 0,7 s, Apply To All → 0,7 ×3;
  - `animatii-move-up`: rândul 2 ales (prin caseta aleasă) → Move Up activ → ordinea [2, 1] (Fly In, apoi Fade);
  - `fundal-aplica-la-toate`: Solid fill, Light Blue, Apply to All → #00B0F0 pe ambele diapozitive;
  - rescrise: `diapozitiv-nou-buton` (partea de sus, `panglica:Home/Slides/New Slide`), `salvare-ca` (File › Save As › Browse ›
    nume › Enter → „Vulcanii.pptx”), `imagine` (Pictures ▾ › This Device... › nume › Enter → 3 forme).
- Pași prin COM, scriși în `cum`: alegerea casetei ca obiect (`animatii-move-up`) și clicul pe miniatură (`ctrl-c-v-caseta`);
  canalul lor e `model_obiect` (probat).
- Clipboard-ul omului: doar text la `ctrl-c-v-caseta` → salvat înainte, pus la loc după (`clipboard_pus_la_loc: true`).

## 4. Rândurile închise în `de_verificat.md`
R11-1, R11-9, R11-10, R11-13 [x]; R11-12 (f) notat lămurit (a-e rămân); R11-14 adăugat (Duration 0,5).

## 5. [NEVERIFICAT]
- Duration „0,5” + Enter: caseta n-a primit focusul (nici UIA SetFocus, nici clicul postat) — R11-14; scenariul a rămas doar
  cu Fade + Apply To All.
- `powerpoint-tragere-forma`: neîncercat (tot „trimis la profesor”, R11-5).
- Bonusul `Alt, H, 1` (P1): nerulat. R11-2…R11-8, R11-11, R11-12 (a-e): nerulate.

## 6. Ce vede acum oracolul din P1-P5
- P1 (KeyTips): nimic nou în oracol (referința avea deja `tasta_acces`).
- P2 (Font Color): O3 +1024 (paleta, cu mini-bara), O4 `font-color-titlu` 1.
- P3 (închiderea): O3 +57 (fereastra), O4 `ctrl-w-modificat` 3 + `ctrl-n` 2.
- P4 (obiectele): O3 +1755 (Pictures, Shapes, Table, New Slide, Layout), O4 `imagine` 1, `two-content-*` 2, `sageata-dreapta` 2,
  `ctrl-c-v-caseta` 3.
- P5 (efectele): O3 +654 (Animation Pane, Format Background, paleta Color), O4 `animatii-move-up` 2, `fundal-aplica-la-toate` 1,
  `durata-aplica-la-toate` 1.

## 7. Instanțele și lista Recent
Fiecare sesiune: tasklist gol înainte; închidere WM_CLOSE cu doar prezentările mele („straine: []”); după fiecare sesiune
„nicio instanță PowerPoint rămasă”. Nicio prezentare străină n-a intrat. Recent: ComDlg32 (OpenSavePidlMRU `*`/png/pptx)
curățat doar pe intrările `lh_ppt_r11_`; `reg query` pe Office\16.0\PowerPoint și \Common după `lh_ppt_r11_` = 0 potriviri;
în %TEMP% niciun dosar al meu rămas.

ACOPERIRE_PARTIALA
