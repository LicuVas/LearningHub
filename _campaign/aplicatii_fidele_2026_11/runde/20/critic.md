# Criticul rece, runda 20 (Word, valul B-word#2): GRAV K1 din runda 16 + unghiul stare_finala_erori

**Cine:** critic rece. Din `runde/20/` am citit `critic_prompt.md`, `gata_pentru_critic.md`, `raport_constructor.md` (de judecat, nu de crezut) și `supliment_B_word_runda20.md`; modelul și GRAV-urile vechi: `runde/16/critic.md`. N-am rulat `proba_grav.py` al constructorului, nici `masoara.py` / `porti.py`. Concluziile vin din gesturile mele.

**Ce am rulat** (totul în `runde/20/critic_probe/`):
- Server static legat de `127.0.0.1`, port 0, care servește worktree-ul; Playwright Chromium headless, `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost (`hc20.py`, copia ajutoarelor din runda 16). Poligonul `aplicatii/poligon.html`, apoi `LH.aplicatii.deschide('word', {continut, focus:true})` cu conținutul lecției m1-l03 (`ORAR`, `ORAR_ANA`, `CLUB`, fișierele din Documente / Descărcări / Desktop).
- Gesturi reale: `page.keyboard`, `page.mouse`, `page.touchscreen`, CDP `Input.imeSetComposition` / `Input.insertText` pe telefon. După fiecare gest: `stare()`, ecranul (paragrafele, titlul din bara de titlu, aldinul / mărimea / alinierea calculate, fereastra vizibilă, mesajul central), evenimentele `__lhAplicatieEv`, `asistent.pas()` + bulele, `document.activeElement` (+ conturul de focus calculat).
- Word real NU l-am pornit: focusul din ferestrele de fișiere nu se poate citi fără să le afișez (pe ecranul omului). Comparațiile cu Word real vin din `referinte/scenarii_real/word-*.json` și `runde/5/critic_probe/com_r5.json`, citite pe chei (`ref20.py` → `iesiri/ref_*.txt`, `iesiri/scen_real.txt`).
- Scripturile: `p20a.py` → `ra20.json` (A: ocolul Tab în 5 ferestre, drumul PDF doar cu tastele), `p20b.py` → `rb20.json` (B: E1-E6), `p20c.py` → `rc20.json` (B: ce scapă din fereastra modală, Esc din Backstage, asistentul pe drumul cu Tab), `p20d.py` → `rd20.json` (B: litere în Save as type; C: regresul).

**Diff-ul rundei** (`critic_probe/diff_word.txt`): `aplicatii/word.js` față de `runde/20/inainte/word.js`, 3 hunk-uri (`word.js:1922-1966`, `2001-2014`, `2122-2124`), exact cele din raport. `git status` pe `aplicatii/` e curat: schimbările benzilor r19 / r21 / r22 sunt în punctul de control `b63df73e`; nu le judec, dar probele rulează pe ele. Nicio eroare de pagină în nicio probă (`erori_pagina: []`).

---

## A. GRAV-urile vechi

### GRAV K1 (Tab / Shift+Tab scot focusul din ferestrele modale; drumul PDF cu tastele salvează .docx + rând gol): **ÎNCHIS**

**Ocolul Tab** (`ra20.json › A1_*`): 15 × Tab, apoi 8 × Shift+Tab, în fiecare fereastră, cu focusul citit după FIECARE tastă.
- Save As, Save As PDF, Open, „Save this file”, „Save your changes…”: **0 ieșiri** din fereastră în 5 × 23 de taste; câte un singur eveniment pe tastă, `tasta_tab|mutare_focus|<ținta focusului din momentul tastei>` (§4). Fiecare oprire are contur de focus vizibil (`outline: auto 1px`) și e pe ecran la 1366×768.
- Ordinea din Save As: File name › Save as type › Autori › Etichete › Titlu › Save Thumbnail › Hide Folders › Tools › Save › Cancel › Până la „Desktop” › Toate locațiile › Documente › Locații anterioare › Reîmprospătare › Casetă de căutare. E ordinea nodurilor din `uia_word.json › dialog.FileSaveAs` (`iesiri/ref_dialog_FileSaveAs.txt`: ComboBox ALT+n, ComboBox ALT+t, panoul de detalii, MenuItem Alt+l, Button Alt+s, Cancel, apoi bara de navigare). Primul Tab din File name ajunge pe Save as type, nodul de imediat după, ca în referință.
- „Save this file”: File name › Save as type › Choose a Location › More options… › Save › Cancel › înapoi pe File name (ocol închis). „Save your changes…”: aceeași, cu Don't Save între Save și Cancel. Ordinea e a nodurilor din `ref_syc_full.txt` (`dialog.save_your_changes_to_this_file`).
- Esc după ocol închide fereastra, focusul revine în aplicație; în „Save your changes…” documentul rămâne, `dialog.apasat` = „Cancel”, ca în `scenarii_real/word-x-nesalvat-cancel.json`.

**Gestul criticului 16** (`A2_k1_gest_critic16`): „Orarul meu / Marți: sport”, F12, Ctrl+A, „Pop_Mihai_7A_orar”, Tab, Alt+↓, ↓×6, Enter, Enter.
- Tab → focusul pe `ComboBox: Save as type:`, în fereastră. Alt+↓ → `alt_sageti|meniu_tip_fisier|camp:tip_fisier|fereastra:Deschidere`. Primul Enter → `meniu:PDF (*.pdf)`, fereastra devine `dialog.FileSaveAs_pdf`. Al doilea Enter → `tasta_enter|salvare_pdf|camp:tip_fisier|dialog_salvare:Save`.
- Final: se scrie `Documente/Pop_Mihai_7A_orar.pdf` cu „Orarul meu / Marți: sport”; **niciun .docx, niciun rând gol** (`text` = `["Orarul meu","Marți: sport"]`); documentul rămâne „Document1  -  Word”, `nume_fisier: null`, ca în `scenarii_real/word-salvare-pdf.json` (`nume_fisier: null` după PDF).

**Drumul lecției `m1-l03:189-192` (`:192`, `:195`) doar cu tastele** (`A2_lectia_189_192_taste`): Ctrl+S, F12, Tab, Alt+↓, ↓×6, Enter, Enter.
- Ctrl+S scrie „Marți: sport” în `Popescu_Ana_7A_orar.docx`; F12 propune „Popescu_Ana_7A_orar.docx”; PDF-ul se scrie cu „Marți: sport”.
- Verificările lecției ies toate: `.docx` cu „Marți: sport”, `.pdf` cu „Marți: sport”, documentul activ rămâne `Popescu_Ana_7A_orar.docx` (titlul „Popescu_Ana_7A_orar - Word” pe ecran și în stare).

**Atelierul `:269` doar cu tastele** (`A2_atelier_269_pdf_taste`): cu `Pop_Mihai_7A_club` deschis din Documente, F12 (bara „Documente”, numele propus „Pop_Mihai_7A_club.docx”), Tab, Alt+↓, ↓×6, Enter, Enter, Ctrl+W → `Pop_Mihai_7A_club.pdf` cu textul fișei, `docs 0`, „Word”. Verificările `:268-270` ies.

**Vecinii** (`rb20.json › E2_*`, `E3_*`, `rc20.json › M4_*`):
- Tab până la Cancel + Enter (Save As, 9 Tab-uri) → `tasta_enter|anulare|dialog_salvare:Cancel`, nimic scris. Tab până la Cancel + Space → la fel.
- Tab până la Don't Save + Enter / Space în „Save your changes…” → `inchidere_fara_salvare`, fișierul neatins.
- Drumul `:189-192` cu PDF ales, apoi 9 Tab-uri până pe Save + Space / + Enter (`p20g.py` → `rg20.json`): `tastare|salvare_pdf|dialog_salvare:Save` / `tasta_enter|salvare_pdf|dialog_salvare:Save`, `.pdf` cu „Marți: sport”, documentul rămâne `.docx`. (Prima încercare, `ra20.json › A2_tab_pana_la_save_space`, a picat pe numele tastei din proba mea, nu în aplicație.)
- Cu Save As deschis și focusul pe un buton, Ctrl+N / Ctrl+W / Ctrl+B / Ctrl+Z / Ctrl+O / F12 / Ctrl+S / Ctrl+E / Ctrl+A / Delete dau `fara_efect`, documentul neatins (`rc20.json › M1`). Clicul pe document în spatele ferestrei nu scoate focusul din ea; litera următoare intră în File name (`M2`).

**Ordinea exactă a Tab-ului față de Word real** n-o pot dovedi: referința are ordinea nodurilor, nu focusul (R20-1). Lista „Vizualizare elemente” și panoul din stânga nu sunt opriri Tab (constructorul o spune în NEFĂCUT); le trec la [FARA_REFERINTA] (D), ca în runda 16.

**A: K1 ÎNCHIS. GRAV vechi deschise: 0.**

---

## B. Unghiul stare_finala_erori: constatări noi

Probele: `p20b.py` → `rb20.json` (E1-E6), `p20c.py` → `rc20.json` (M1-M6), `p20d.py › B_litere_in_save_as_type`, `p20e.py` → `re20.json` (N1-N3), `p20f.py` → `rf20.json` (Font, Paragraph). La fiecare drum am comparat `stare()` cu ecranul (paragrafele vizibile, titlul din bara de titlu, aldinul / mărimea / alinierea calculate, fereastra vizibilă), apoi evenimentele și asistentul.

**Niciun GRAV nou al lui Word.** Pe toate drumurile de mai jos: ecranul = starea (`ecran=stare: true`, 0 diferențe), câte un eveniment pe gest, iar Word real, unde există referință, dă aceeași stare finală.

### E1. Salvare cu nume greșit, apoi corectare
- **Nume interzis, apoi corect** (`E1_nume_interzis_apoi_corect`): F12, „Pop:Mihai_7A”, Enter → `tasta_enter|nume_interzis|camp:nume_fisier|dialog_salvare:Save`, nimic scris, fereastra rămâne, focusul în File name cu numele scris, mesajul central despre semnele interzise. Ctrl+A, „Pop_Mihai_7A”, Enter → un singur fișier nou, `Documente/Pop_Mihai_7A.docx`; titlul „Pop_Mihai_7A - Word” pe ecran și în stare. Etalon: `com_r5.json › nume_interzise` (SaveAs2: „This is not a valid file name.”).
- **Salvat cu nume greșit, apoi F12 cu numele corect** (`E1_salvat_gresit_apoi_corect`): rămân `orar.docx` și `Pop_Mihai_7A_orar.docx` (ca pe disc), F12 propune „orar.docx”, documentul devine cel corect; Ctrl+S după o literă scrie DOAR în `Pop_Mihai_7A_orar.docx`, `orar.docx` neatins.
- **Peste fișierul colegei, apoi o cifră** (`m1-l03:82`, `:157`; `E1_peste_coleg_apoi_cifra`): Enter pe „Popescu_Ana_7A_orar” → `nesimulat` „… already exists”, fișierul colegei neatins, focusul rămâne în File name; End, „2”, Enter → `Popescu_Ana_7A_orar2.docx`, titlul la fel pe ecran și în stare.
- **PDF peste un PDF care există** (`m1-l03:85`, `:159`; `E1_pdf_peste_pdf_existent`): Enter → mesajul central „… .pdf already exists”, PDF-ul vechi neatins, fereastra `FileSaveAs_pdf` rămâne. Elevul poate schimba numele și salva. (Textul întrebării reale: MINOR-ul vechi, vezi D.)
- **Nume ciudate** (`re20.json › N1`): gol și doar spații → `fara_efect`, fereastra rămâne, nimic scris; „Pop_Mihai.docx” → `Pop_Mihai.docx` (fără extensie dublă); „Pop_Mihai ” → spațiul de la capăt cade; „Pop_Mihai.DOCX” → păstrat. „Pop_Mihai.” și „.docx” dau fișiere `Pop_Mihai..docx` / `.docx` (fără referință, D).
- **PDF ales, apoi înapoi la Word Document** (`N2`): numele scris rămâne, fereastra revine la `dialog.FileSaveAs`, Enter scrie `.docx`.

### E2. Cancel în Save As, apoi Ctrl+S (document nou „Poezia mea / Toamna vine.”)
- Patru feluri de Cancel (`E2_cancel_*`): clic, Esc, Tab până la Cancel + Enter (9 Tab-uri), Tab până la Cancel + Space. Toate: `anulare` cu `dialog_salvare:Cancel` (ca `tinta` la clic, ca `activat` la Esc), nimic scris, focusul înapoi în document.
- Ctrl+S după oricare dintre ele → „Save this file”, `dialog_salvare = {titlu: "Save this file", nume_propus: "Poezia mea", tip_propus: "Word Document (*.docx)"}`, exact `scenarii_real/word-ctrl-s-document-nou.json`.
- Alt+F4 în Save As nu închide fereastra: vezi MINOR.
- Pe un document salvat (`E2_cancel_pe_salvat_apoi_ctrl_s`): Esc în Save As, apoi Ctrl+S → `ctrl_s|salvare`, fără fereastră.
- Din File › Save As › Browse (Alt, F, A, O; `rc20.json › M4_*`): Esc, clic pe Cancel și Tab + Enter pe Cancel te întorc toate la pagina File › Save As (`pagina_backstage: "Save As"`), ca în runda 16.

### E3. Open pe fișierul greșit, apoi Ctrl+W › Don't Save
- Cu `Popescu_Ana_7A_orar` deschis: Ctrl+F12 › Desktop › dublu clic pe „tema” (`docs 2`, „tema - Word”), o literă, Ctrl+W → „Save your changes…”. Don't Save cu Alt+N, clic, Tab + Enter (5 Tab-uri), Tab + Space (`E3_*`): `inchidere_fara_salvare`, `tema.docx` rămâne `["Tema"]`, `docs 1`, activ `Popescu_Ana_7A_orar.docx`, întreg, pe ecran și în stare; `dialog.apasat = "Don't Save"` (ca `scenarii_real/word-ctrl-w-nu-salva.json`). Litera următoare intră în orar.
- Fără literă (`E3_open_gresit_nemodificat_ctrl_w`): Ctrl+W închide „tema” fără întrebare, rămâne orarul.

### E4. Ctrl+Z / Ctrl+Y după tastare și după formatare
- „Planul de luni” ↵ „Mergem la film.”, Ctrl+Z ×3 → `[""]`, ca `scenarii_real/word-ctrl-z-dupa-tastare.json`; Ctrl+Y reface primul pas. Ecranul = starea după fiecare tastă.
- Ctrl+A, Ctrl+B → aldin pe ecran și în stare; Ctrl+Z → fără aldin; Ctrl+Y → iar aldin. Ctrl+E → `centru` / `center`; Ctrl+Z → `stanga` / `left`. Mărimea 20 din listă → 20 în stare, 26,67 px pe ecran, „20” în casetă; Ctrl+Z → 11 / 14,67 px / „11”.
- Ctrl+Z după Ctrl+S → documentul devine modificat, iar Ctrl+W întreabă „Save your changes…”.
- Ctrl+Z în Save As (`E4_ctrl_z_in_save_as`) rămâne al casetei: documentul neatins.

### E5. Esc în fiecare fereastră
- Save As, Save As PDF, Open, „Save this file”, „Save your changes…”, Font (Ctrl+D), File (Backstage), plus Save As cu focusul pe Save după Tab (`E5_esc_in_fiecare_fereastra`): un Esc închide fereastra, nimic scris, focusul în document, iar litera următoare intră în document (`AnaQ`).
- Cu lista Save as type deschisă: primul Esc închide doar lista (`inchidere_meniu`), al doilea fereastra.
- Esc în „Save your changes…” = Cancel: documentul rămâne, `dialog.apasat = "Cancel"`, ca la clic (`word-x-nesalvat-cancel.json`). Evenimentele poartă `activat` = Cancel.

### E6. Închiderea cu modificări nesalvate
- Ctrl+W și ✕ pe un document nou modificat (`E6_*`): fereastra „Save your changes…” cu File name „Ana are mere azi”. Alt+S → `Documente/Ana are mere azi.docx`, `docs 0` (după ✕, Word se închide). Cancel → documentul rămâne, cu „azi”, „Document1 - Word”.
- Pe un document salvat și modificat, Ctrl+W, Enter → `salvare_si_inchidere`, `docs 0`, „Word”.

### Ce scapă din fereastra modală
- Cu Save As deschis și focusul pe un buton, 10 scurtături de document dau `fara_efect`, documentul neatins (`M1`).
- Clicul pe document în spatele ferestrei ajunge pe stratul ferestrei, iar focusul rămâne în ea (`M2`).
- Literă + Backspace pe fiecare din cele 16 opriri Tab (`M3`):
  - casetele (Autori, Etichete, Titlu, Căutare) le primesc;
  - butoanele dau `fara_efect`;
  - documentul nu se schimbă niciodată.
- Font și Paragraph (`rf20.json`):
  - literele cu fereastra deschisă dau `fara_efect`;
  - Tab rămâne în fereastră 12 din 12;
  - Enter = OK, documentul neatins.

### Constatări pentru orchestrator: asistentul comun (`aplicatii.js`), nu Word, deci nu le număr GRAV
- **Tab trece PESTE Save și bifează pasul**, confirmat (`rc20.json › M6`). Pașii erau `[meniu:PDF (*.pdf), dialog_salvare:Save]`, iar elevul face drumul lecției cu tastele.
  - După PDF, Tab-urile ajung pe Save, iar bula apare pe Save.
  - Tab-ul care pleacă de pe Save dă `tasta_tab|mutare_focus|dialog_salvare:Save`, iar `pas` = 2 (gata). Dar nimic nu e scris: 4 fișiere, fereastra `FileSaveAs_pdf` tot deschisă.
  - La fel în E2: Tab până la Cancel trece peste Save → `pas 1` fără salvare (`E2_cancel_tab_enter`).
  - Cauza: `aplicatii.js:628`, `ev.tinta === p.tinta` fără să excludă `mutare_focus`.
- **Pe același drum, asistentul ia gesturile bune drept greșeli.** Tab (`mutare_focus`) și Alt+↓ (`activat fereastra:Deschidere`) sunt pași buni ai drumului cu tastele. Ele se numără ca greșeli după §6.3, așa că bula apare pe PDF după ele, deși elevul merge bine (`M6`, al doilea rând).
  - E litera din §6.3 (lista excepțiilor nu are `tasta_tab` / `mutare_focus`), deci e o problemă de specificație, nu a lui Word.
  - Propunere: `mutare_focus` intră între excepții, ca `sageti`.
- **Pasul `dialog_salvare:Save` se bifează și când salvarea e refuzată** (nume interzis: `pas 1`; `E1_nume_interzis_apoi_corect › enter1`). E MINOR-ul vechi din runda 5.

---

## C. Regresul

Probele: `p20d.py` → `rd20.json` (C1-C5), plus O4 rulat de mine direct pe scenariile Word: `LH_IESIRE=runde/20/critic_probe/iesiri/O4w`, `oracol_comportament.py --scenarii scenarii/word`.

**Cele 8 închise în runda 16, pe eșantion (1366×768): toate țin** (`rd20.json › C1_regres_8_inchise`).
- **S1:** în Save As, Descărcări › Desktop › Documente; la fiecare pas bara, panoul ales și lista = folderul („club-lectura”, „tema”, cele două `.docx` din Documente).
- **S2 + S4:** de două ori Ctrl+F12 › Descărcări › dublu clic pe club-lectura dă `docs 2` (documentul de pornire + club-lectura o singură dată), „club-lectura - Word”. F12 → bara „Descărcări”, File name „club-lectura.docx”.
- **S3:** E1 de mai sus (4 semne interzise în r16; aici „:”, refuzat, apoi corectat).
- **S5:** lista din Save As are `Pop_Mihai_7A_compunere`, `Popescu_Ana_7A_orar`.
- **S6:** Ctrl+N → „Document2 - Word” pe ecran și în stare, `docs 2`.
- **T5:** Ctrl+W pe salvat → `docs 0`, „Word”; Bold `aria-disabled` + `lh-ap-gri`; F12 → `tasta_f12|indisponibil|document`, fără fereastră și fără mesaj.
- **T6:** Alt+↓ în Font Size → `activat meniu_derulant:Home/Font/Font Size`, `pas 1`; ↓×5, Enter → `meniu:20`, `pas 2`, „Ana are mere@20”.
- **T1 `:189-192` cu mouse-ul:** `.docx` și `.pdf` cu „Marți: sport”, documentul rămâne `.docx`.

**O4 pe scenariile `word-*`: 13**, aceleași 12 rânduri RĂU ca la constructor (`iesiri/O4w/rele.txt` = `runde/20/o4w_rele_dupa.txt`, `diff` gol). Niciun scenariu de fișiere, Ctrl+Z / Ctrl+Y sau închidere nu e printre ele (rândurile sunt: clic-pune-cursorul, copiere / decupare, font-size-tastat, imagine, tragere, cele 4 `word2007-*` fără rezultat real).

**Fereastra mică** (1366×657 la 125% = 1093×526 css, factor 1,25; `C2_fereastra_mica`):
- Save / Cancel stau la y 518-544, sub marginea de 526, ca în runda 16. Rândul PDF din lista deschisă cu mouse-ul, fără derulare, e la y 529 (sub ecran), tot ca în r16.
- Tab-ul ajunge pe Save (8 Tab-uri), cu contur, dar butonul nu e adus în fereastră (dreptunghiul rămâne `[750, 518, 88, 26]`).
- Drumul cu tastele (F12, Tab, Alt+↓, ↓×6, Enter, Enter) dă `Popescu_Ana_7A_orar.pdf` pe fereastra mică (captura `c_mica_dupa_pdf.png`). Deci pe fereastra mică tastatura e acum un ocol care merge. Nu e regres (MINOR-ul vechi, D).

**Telefonul** (390×844, atingeri; `C3_telefon`, captura `c_telefon_dupa_pdf.png`), două drumuri:
- **Compunerea:** „a/an/ana” + „ are” dă `["Ana are"]`.
- **Drumul cu greșeală:** File › Save As › Browse, numele, apoi Cancel atins din greșeală (`dlg []`, nimic salvat). Din nou File › Save As › Browse, numele, Save → „Ana_7A_tel.docx” în Documente, titlul „Ana_7A_tel - Word”.
- **PDF cu atingeri:** File › Save As › Browse › Save as type › PDF › Save → `salvate: ["Ana_7A_tel.docx", "Ana_7A_tel.pdf"]`.

**PowerPoint (cârligul comun pe care l-a adoptat Word)** (`C5_powerpoint_tab_si_excel`):
- F12 → `dialog.FileSaveAs`. 14 × Tab + 7 × Shift+Tab: 0 ieșiri (Save as type › Autori › Etichete › Hide Folders › Tools › Save › Cancel …). Esc închide fereastra.
- Ctrl+M → 2 diapozitive. Excel pornește: „5”, Enter → `A1 = 5`.
- Banda Word n-a atins `aplicatii.js` (diff-ul are numai `word.js`), deci cârligul nu s-a schimbat.

**Mesajul central la Word după schimbarea comună din r19** (`C4_mesaj_central_word`), 3 gesturi nesimulate:
- clic pe Tools în Save As;
- Alt+P în Open (panoul de examinare);
- F5 în Save As (nou în r20).

La toate trei: evenimentul `nesimulat`, mesajul vizibil (opacitate 1) la 0,3 s, 2,3 s și 4,7 s; dispare la 6,3 s. Fereastra rămâne deschisă sub el. Nu se dublează și nu rămâne agățat.

**Celelalte aplicații:** banda Word n-a stricat nimic din ce am atins (PowerPoint, Excel).

---

## [FARA_REFERINTA] (nu le număr GRAV)
- **Ordinea Tab față de Word real (R20-1); lista „Vizualizare elemente” și panoul din stânga nu sunt opriri Tab.**
  - Ordinea simulatorului = ordinea nodurilor din `uia_word.json`. Referința nu are focusul.
  - Urmarea: doar cu tastele, elevul nu poate schimba folderul și nici alege un fișier din listă. De exemplu, atelierul `:240` (club-lectura din Descărcări) nu se poate deschide fără mouse.
  - Numele scris în File name din alt folder („club-lectura” în Documente, Enter) dă „În aplicația reală, „club-lectura” funcționează; aici nu e simulată.” (`ra20.json › A2_open_nume_din_alt_folder`). Fereastra reală ar spune că fișierul nu există; nu e capturat.
  - Lecția face aceste drumuri cu mouse-ul.
- **Litera în caseta Save as type** (`rd20.json › B_litere_in_save_as_type`): Tab pe Save as type, apoi „P” / „p” / „W” / „x”.
  - Simulatorul: tipul rămâne „Word Document (*.docx)”, iar evenimentul spune totuși `tastare|tastare|camp:tip_fisier`. Enter scrie `.docx`. În Open, „W” pe Files of type, la fel.
  - Într-o casetă-listă Windows, prima literă alege rândul care începe cu ea (P → „PDF (*.pdf)”), deci „Tab, P, Enter” ar da PDF. Asta nu e în `referinte/` și nici în `surse_microsoft.md`.
  - Dacă se confirmă, devine GRAV: un drum cu tastele spre PDF care scrie în tăcere un `.docx`.
- **R20-2 / R20-3 / R20-4** (Tab cu lista deschisă o închide fără să schimbe tipul; Esc = Cancel în „Save your changes…” / „Save this file”; Enter / Space pe butonul cu focusul în ferestrele Office): ce am văzut e coerent cu regula ferestrelor Windows (`api_biblioteca.md` §4), dar ferestrele Office (`NUIDialog`) n-au captură.
- **Enter pe Tools** (`rc20.json › M5`): focusul pe Tools (7 Tab-uri), Enter → `tasta_enter|salvare|fereastra:Tools|dialog_salvare:Save`, iar documentul se salvează („Ana are mere.docx”). Clicul pe Tools și Alt+L dau mesajul central. Regula Windows (Enter = butonul implicit, dacă focusul nu e pe un buton de apăsat) poate susține oricare variantă; referința nu spune ce face Enter pe Tools.
- **Nume la limită** (`re20.json › N1`): „Pop_Mihai.” → `Pop_Mihai..docx`, „.docx” → fișierul `.docx` cu titlul „  -  Word”. Ce face fereastra reală cu punctul de la capăt sau cu un nume care e doar extensie nu e capturat.
- **„Save your changes…” pe un document deja salvat** are caseta File name (`E6_salvat_modificat_ctrl_w_enter`); referința e capturată doar pe un document NOU (`deschis_prin: Ctrl+W … pe un document NOU`).
- **Font (Ctrl+D) și Paragraph se deschid cu focusul pe fereastră**, nu pe primul câmp (`rf20.json › foc0`), iar opririle Tab poartă eticheta clasei („RichEdit Control”). Focusul la deschidere nu e în referință.

## MINOR
- **Alt+F4 într-o fereastră** (Save As; `E2_cancel_alt_f4_apoi_ctrl_s`): `tasta_f4|tasta_f4|camp:nume_fisier`, fereastra rămâne, fără mesaj. În Windows, Alt+F4 închide fereastra deschisă. Nu e pe drumul lecțiilor; e aceeași familie cu „Alt+L / Alt+↑ tac” din r16.
- **Mesajul de eroare rămâne după corectare:**
  - Exemple: „Windows nu primește … Schimbă numele.” sau „… already exists” (`E1_nume_interzis_apoi_corect › final.ecran.msg`, `E1_peste_coleg_apoi_cifra › final`).
  - După salvarea reușită, mesajul mai stă până la 5 s peste documentul deja salvat (`aplicatii.js:235`, durata 5000).
  - Ar trebui șters la salvarea reușită. Nu induce în eroare: titlul arată deja numele cel bun.
- **„already exists” fără întrebare** (MINOR vechi din r5):
  - Lecția descrie întrebarea reală (`m1-l03:158-159`: „Replace existing file” + Cancel; la PDF „You already have a file named… Do you want to replace it…?”).
  - Simulatorul arată „… already exists” funcționează; aici nu e simulată”, iar Save As rămâne deschisă.
  - Drumul se duce la capăt (cifra + Save).
- **Fereastra mică:**
  - Save / Cancel sub margine; Tab-ul pe Save nu-l aduce în fereastră.
  - Rândul PDF e sub ecran când lista e deschisă cu mouse-ul fără derulare.
  - Tastatura ocolește problema. Nu e regres.
- **Asistentul bifează pasul Save la salvarea refuzată** (comun, MINOR vechi). Cele două constatări noi despre asistent sunt în B (orchestratorul).

## Ce a trecut (văzut pe ecran, în `stare()` și în evenimente)
- **K1:** 5 ferestre × 23 de taste fără ieșire, cu contur de focus. Drumul PDF doar cu tastele: gestul criticului 16, lecția `:189-192`, atelierul `:269`, plus Tab până pe Save + Space / Enter. Tab până la Cancel / Don't Save + Enter / Space apasă butonul cu focusul.
- **Unghiul stare_finala_erori, pe toate drumurile din sarcină** (E1-E6), cu ecranul = starea și cu Word real unde există scenariu:
  - `word-ctrl-s-document-nou`, `word-x-nesalvat-cancel`, `word-ctrl-w-nu-salva`, `word-ctrl-z-dupa-tastare`, `word-salvare-pdf`;
  - `com_r5 › nume_interzise`.
- **Modalitatea ferestrei:** taste de document, clic în spate, litere pe butoane, Font / Paragraph.
- **MINOR-urile din r16 reparate în r20:** Alt+↑ / F5 dau acum mesajul central, ca clicul (`C4 › F5_saveas`); Esc are `activat` Cancel.
- **Regresul:**
  - cele 8 închise în r16 (eșantion);
  - O4 `word-*` = 13, aceleași rânduri;
  - fereastra mică (fără regres) și telefonul (2 drumuri);
  - PowerPoint: Tab în fereastră, Ctrl+M;
  - Excel pornește;
  - mesajul central după r19.
- Nicio eroare de pagină.

## Predarea pentru runda următoare
1. **Word nu mai are GRAV deschis.** Întâi de reparat e codul COMUN, de către orchestrator:
   - în `L.asistent` (`aplicatii.js:628`), `tasta_tab` cu `actiune: 'mutare_focus'` să nu bifeze pasul (Tab peste Save / Cancel bifează „Save” fără salvare);
   - în §6.3, `mutare_focus` să intre între excepțiile care nu sunt greșeli, ca `sageti`; altfel drumul cu tastele cheamă bula după doi pași buni;
   - reprobat la Word și la PowerPoint.
2. **Referințe de capturat** (Word real, sesiune vizibilă, la ora orchestratorului):
   - `FocusedElement` după fiecare Tab / Shift+Tab în Save As / Open / „Save this file” / „Save your changes…”, inclusiv dacă lista și panoul din stânga sunt opriri (R20-1);
   - prima literă în Save as type (P → PDF?);
   - Esc / Enter / Space în ferestrele Office (R20-3 / R20-4);
   - Enter pe Tools;
   - Alt+F4 în Save As;
   - un nume inexistent + Enter în Open;
   - numele „x.” și „.docx” în Save As;
   - „Save your changes…” pe un document salvat;
   - focusul la deschiderea Font / Paragraph;
   - rămân și cele din r16 (R16-1 … R16-5).
3. **MINOR ieftine în `word.js`:**
   - Alt+F4 într-o fereastră = clicul pe Cancel (ca Esc);
   - mesajul central de eroare scos la salvarea reușită;
   - litera în Save as type cel puțin `fara_efect` în eveniment (nu `tastare`), până vine referința;
   - Tab pe un buton de sub marginea ferestrei mici să-l aducă în fereastră (`scrollIntoView` pe stratul ferestrei).

GRAV_VECHI_DESCHISE: 0
GRAV: 0
