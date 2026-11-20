# Criticul rece, runda 16 (Word, valul B-word redeschis): cele 8 GRAV din runda 5 + unghiul gest_tastatura

**Cine:** critic rece. Din `runde/16/` am citit `critic_prompt.md`, `gata_pentru_critic.md` și `raport_constructor.md` (ce spune constructorul, de judecat). N-am rulat `proba_grav.py` al constructorului, nici `masoara.py` / `porti.py`. Concluziile vin din gesturile mele.

**Ce am rulat** (totul în `runde/16/critic_probe/`):
- Server static legat de `127.0.0.1`, port 0, care servește worktree-ul; Playwright Chromium headless, `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost (`hc16.py`, copia ajutoarelor rundei). Poligonul `aplicatii/poligon.html`, apoi `LH.aplicatii.deschide('word', {continut, focus:true})` cu conținutul lecției m1-l03 (`fisiere`, `nume`, `folder`, `salvat`, `modificat`).
- Gesturi reale: `page.keyboard`, `page.mouse` (clic, dublu clic). După fiecare gest: `stare()`, ecranul (bara de adrese, panoul din stânga, lista, File name, titlul, mesajele `[data-lh-nesimulat]`), evenimentele `__lhAplicatieEv`, `asistent.pas()` + bulele, `document.activeElement`.
- Word real NU l-am pornit: pentru T5, S2, S3, S4, S6 am folosit dovezile COM ale criticului 5 (`runde/5/critic_probe/com_r5.json`), citite pe chei.
- Scripturile: `pa16.py` → `ra16.json` (A, gestul criticului 5 + vecinul), `pa16b.py` → `rab16.json` (T5 pe file, KeyTips, titlu), `pa16c.py` → `rac16.json` (Ctrl+N fără document după 8 gesturi vecine), `ref16.py` (referința pe chei → `iesiri/ref_*.txt`). Diff-ul rundei: `diff_word.txt`.

**Diff-ul rundei:** `aplicatii/word.js` față de `runde/16/inainte/word.js`: +120 / −16 (sha256 `29e550e2…` = cel din raport). În arbore mai sunt schimbări necomise ale altor benzi (`aplicatii.js` +3, `poligon.html` +3/−2, `setari.json`, `excel.js`, `windows.js` nou); nu le judec, dar probele rulează pe ele.

---

## A. Cele 8 GRAV din runda 5

### GRAV S1 (bara de adrese rămâne pe primul folder): **ÎNCHIS**
- **Gestul criticului 5** (`ra16.json › S1_saveas_gest_c5`): F12, clic Descărcări › Desktop › Documente › Desktop. La fiecare pas bara (eticheta „Adresă: X” și textul vizibil) = panoul ales = folderul, iar lista arată fișierele lui („club-lectura”, „tema”, „Popescu_Ana_7A_orar”, „tema”). Enter salvează `Desktop/Pop_Mihai_7A_lucrare.docx`.
- **Open** (`S1_open_gest_c5`): Descărcări › Documente › Desktop › Descărcări: bara urmează la toți cei 4 pași, lista la fel.
- **Vecinul** (`S1_vecin_pdf_si_redeschidere`): Descărcări › Desktop, apoi Save as type = PDF (fereastra se redesenează ca `dialog.FileSaveAs_pdf`): bara rămâne „Desktop”. Esc și F12 iar pe documentul nou: bara „Documente” (folderul ferestrei din referință).

### GRAV S2 (F12 pe un document din alt folder): **ÎNCHIS**
- **Gestul** (`S2_gest_c5`): Ctrl+W, Ctrl+F12 › Descărcări › dublu clic pe club-lectura, apoi F12. Bara și panoul: „Descărcări”; File name „club-lectura.docx”. Enter pe numele propus dă „already exists” (fișierul e chiar el; comportamentul ferestrei reale pe propriul fișier rămâne [FARA_REFERINTA], ca în runda 5).
- **Vecinul** (`S2_vecin_backstage_si_salvat_de_elev`): File › Save As › Browse pe același document: tot „Descărcări”. Un document salvat de elev pe Desktop (F12 › Desktop › „Ion_7A_tema”), modificat, apoi F12: bara „Desktop”, File name „Ion_7A_tema.docx”.
- Etalonul: `com_r5.json › deschis_din_descarcari_propus_F12` = calea din Descărcări. Drumul lecției (F12 › Documente) rămâne: vezi C.

### GRAV S3 (nume cu semne interzise): **ÎNCHIS**
- **Gestul** (`S3_gest_c5`): F12, Ctrl+A, „Pop_Mihai:7A” / „Pop?Mihai” / „Pop*Mihai” / „Pop"Mihai”, Enter. Pe toate patru: `fisiere` neschimbat (doar cele 3 de la pornire), titlul rămâne „Document1  -  Word”, fereastra Save As rămâne, focusul rămâne în File name cu numele scris. Mesajul central: „Windows nu primește în numele fișierului semnele \ / : * ? " < > |. În aplicația reală apare o fereastră de eroare (aici nu e simulată). Schimbă numele.” Evenimentul: `tasta_enter|nume_interzis|camp:nume_fisier|dialog_salvare:Save`.
- **Vecinul** (`S3_vecin_save_this_file`): Ctrl+S pe un document nou („Save this file”), „Pop|Mihai”, Enter: la fel, nimic scris.
- Etalonul: `com_r5.json › nume_interzise` (SaveAs2: „This is not a valid file name.”); lecția `m1-l03:156`. Asistentul trece totuși pasul `dialog_salvare:Save` (`pas_asistent 1`): e MINOR-ul vechi din `aplicatii.js` (vezi D).

### GRAV S4 (același fișier deschis de două ori): **ÎNCHIS**
- **Gestul** (`S4_gest_c5`): din Word fără document, de două ori Ctrl+F12 › Descărcări › dublu clic pe club-lectura: `docs 1`, „club-lectura  -  Word”. „ Pop Mihai”, F12 › Documente › Pop_Mihai_7A_club › Enter, Ctrl+W: `docs 0`, titlul „Word”. Testul `m1-l03:270` iese.
- **Vecinul** (`S4_vecin_modificat_enter`): club-lectura modificat („Numele meu: Ana”, nesalvat), apoi Ctrl+F12 › Descărcări › numele scris + Enter: `docs 1`, rândul elevului rămâne; Ctrl+W întreabă „Save your changes…”. (Ce face Word real cu un fișier deschis ȘI modificat rămâne [FARA_REFERINTA], R16-3.)
- Etalonul: `com_r5.json › deschis_iar` (`documente_dupa 1`, `acelasi_document true`).

### GRAV S5 (lista ferestrei Save As e goală): **ÎNCHIS**
- **Gestul** (`S5_gest_c5`): în Documente sunt `Popescu_Ana_7A_orar.docx`, `Pop_Mihai_7A_compunere.docx` (și un `.pdf`). F12: lista arată cele două `.docx`, cu ținte `lista:<nume>.docx`. Clic pe rândul colegei: `clic|selectare|lista:Popescu_Ana_7A_orar.docx`, File name = „Popescu_Ana_7A_orar”, fără mesaj. Save: „already exists”, fereastra rămâne, fișierul colegei neschimbat (`["Orarul meu","Luni: română, matematică, TIC"]`).
- **Vecinul** (`S5_vecin_pdf_si_dublu_clic`): Save as type = PDF: lista arată doar PDF-ul. Dublu clic pe fișierul colegei = Save: „already exists”, fișierul neatins. (Filtrul pe tip: R16-2, [FARA_REFERINTA].)

### GRAV S6 (Ctrl+N dă mereu Document1): **ÎNCHIS**
- **Gestul** (`S6_gest_c5`): „Excursie la Bicaz” („Document1  -  Word”), Ctrl+N: „Document2  -  Word” în stare și pe ecran, `docs 2`. F12 pe documentul gol: „Doc2.docx”. Încă un Ctrl+N: „Document3  -  Word”, `docs 3`.
- **Vecinul** (`S6_vecin_inchis_si_iar`): Ctrl+N, Ctrl+W pe Document2 (nemodificat, fără întrebare): revine „Document1”, `docs 1`. Ctrl+N: „Document3” (numărul nu revine), `docs 2`.
- Etalonul: `com_r5.json › nou2_nume „Document2”`, `nou3_dupa_inchiderea_tuturor_nume „Document3”`, `nou2_gol_propus_F12 „Doc2.docx”`.

### GRAV T5 (Word fără document): **ÎNCHIS**
- **Gestul** (`ra16.json › T5_gest_c5`, captura `a_t5_fara_doc.png`): document salvat, Ctrl+W (`docs 0`, „Word”). Bold, Italic, FontSize, Paste, Copy: gri (`aria-disabled`, clasa `lh-ap-gri`); caseta Font Size `disabled`. Pe panglică nu rămâne activă nicio comandă, în afară de „Ribbon Display Options” (bara de titlu).
- Clic pe Bold: `clic_comanda_panglica|indisponibil|panglica:Home/Font/Bold`, fără mesaj. Ctrl+B, F12, Ctrl+S, Shift+F12, Ctrl+W, Ctrl+Z, Ctrl+A, Ctrl+P: fiecare `…|indisponibil|document`, fără mesaj, fără fereastră, `docs 0`. Mesajul fals „… funcționează” nu mai apare nicăieri.
- **Vecinul** (`rab16.json › T5_vecin_salvat`, captura `a_t5_view_fara_doc.png`): filele Insert, Layout, References, View fără document: 0 comenzi active (doar „Ribbon Display Options”). KeyTips Alt, H, 1: `tasta_acces|indisponibil|panglica:Home/Font/Bold`; Alt, H, F, S: `indisponibil`, focusul se întoarce în zonă. Alt, F deschide File (`backstage`). Ctrl+N direct, după fila Insert, după KeyTips + Esc, după clic pe Bold gri, după clic în zonă: `document_nou`, „Document1  -  Word” (`rac16.json`).
- **Față de Word real** (`com_r5.json › activ_fara_document`): Bold, Italic, FontSize, Paste, Copy, FileSave, FileSaveAs, FilePrint, FileClose, Undo = `false` → pe simulator gri / `indisponibil`; FileNewDefault, FileOpen = `true` → Ctrl+N, Ctrl+O, Ctrl+F12 merg. Se potrivește pe toate cele 12 chei.
- Un rest pe drum (nu ține de T5): după Alt, F fără document, Esc nu închide File, iar Ctrl+N în File = `fara_efect` (`rac16.json › ctrl_n_dupa_alt_f_esc`); vezi B / [FARA_REFERINTA].

### GRAV T6 (Alt+↓ fără `activat`): **ÎNCHIS**
- **Gestul** (`ra16.json › T6_gest_c5`): asistentul cu pașii lui `scenarii/word/word-font-size-lista.json` = `[meniu_derulant:Home/Font/Font Size, meniu:20]`. Ctrl+A, clic în caseta Font Size, Alt+↓: `alt_sageti|lista_marimi|panglica:Home/Font/Font Size|meniu_derulant:Home/Font/Font Size` → `pas 1`, fără bulă. ↓×5, Enter: `tasta_enter|marime_font|…|meniu:20` → `pas 2`, fără bulă, „Ana are mere@20”, caseta „20”.
- **Vecinul** (`T6_vecin_save_as_type_si_font`): Alt+T, Alt+↓ în Save as type: `alt_sageti|meniu_tip_fisier|camp:tip_fisier|fereastra:Deschidere` (lista celor 17 tipuri deschisă). Alt+↓ în caseta Font: `alt_sageti|nesimulat|panglica:Home/Font/Font|meniu_derulant:Home/Font/Font` + mesajul central, la fel ca clicul pe ▾ (lista fonturilor nu e simulată; nu e pe drumul m1-l03).

**A: 8 din 8 ÎNCHISE.**

---

## B. Unghiul gest_tastatura: constatări noi

Probele: `pb16.py` → `rb16.json` (scurtăturile, Tab, Alt + literă, lista, bara de adrese), `pb16b.py` → `rbb16.json` (urmările lui Tab pe drumurile lecției, butoanele de navigare), `pc16.py` → `rc16.json` (KeyTips, asistentul pe KeyTips, lista Font Size).

### GRAV K1: Tab și Shift+Tab scot focusul din ferestrele modale (Save As, Open, Save this file, Save your changes). După ele tastatura nu mai ajunge în fereastră, iar drumul PDF din m1-l03 făcut cu tastele salvează un .docx și adaugă un rând gol în document
**Gestul** (`rbb16.json › K1_pdf_cu_tab`): document „Orarul meu / Marți: sport”. F12 (focusul în File name, numele selectat), Ctrl+A, „Pop_Mihai_7A_orar”, apoi drumul obișnuit cu tastele spre Save as type: Tab, Alt+↓, ↓×6, Enter, Enter.

**Ce face simulatorul:**
- Tab: `tasta_tab|tasta_tab|camp:nume_fisier|`, iar focusul ajunge pe un `DIV` din rădăcina aplicației, în afara ferestrei (`focus ["-","-","app"]`). Fereastra rămâne pe ecran, fără niciun control cu focus.
- Alt+↓ și ↓×6: `alt_sageti|fara_efect|fereastra_app:word|`, `sageti|fara_efect|…`. Tipul rămâne „Word Document (*.docx)”, fără mesaj.
- Primul Enter: `tasta_enter|salvare|document|dialog_salvare:Save`. Se salvează `Documente/Pop_Mihai_7A_orar.docx`, iar fereastra se închide.
- Al doilea Enter (cel care în Word real ar fi apăsat Save după alegerea PDF): `tasta_enter|paragraf_nou|document|`. Documentul devine `["Orarul meu","Marți: sport",""]`.
- Etalonul, același drum cu Alt+T în loc de Tab (`K1b_pdf_cu_alt_t`): `meniu:PDF (*.pdf)`, `salvare_pdf`, iar `Pop_Mihai_7A_orar.pdf` se scrie. Deci doar Tab strică drumul.

**Restul ferestrelor** (`rb16.json › B2_tab_save_as`, `rbb16.json › K2`, `K3`, `K4`):
- Save As: 14 × Tab și 8 × Shift+Tab, toate pe același `DIV` din afara ferestrei (`tasta_tab|fara_efect|fereastra_app:word|`). Save as type, Save, Cancel, lista și panoul din stânga nu se pot atinge cu Tab.
- După Tab, literele și Backspace dau `tastare|fara_efect` și nu ajung nici în File name. Enter salvează totuși cu numele vechi (`Documente/Orarul meu.docx`).
- Open (Ctrl+F12): Tab, ↓, Enter dau `fara_efect` (Enter poartă totuși `activat fereastra:Open`). Lista fișierelor nu primește focusul nici la clic: după clic pe un rând, focusul rămâne în File name și ↓ nu mută alegerea (`B4_lista_si_adresa`, `B5_save_as_lista_tastatura`).
- „Save your changes…” (Ctrl+W pe modificat): Tab sau Shift+Tab ies din fereastră. Enter apasă tot Save.
- „Save this file” (Ctrl+S pe document nou, `pf16.py` → `rf16.json`): Tab și Shift+Tab duc focusul din File name pe același `DIV`, cu fereastra încă deschisă.

**Ce face aplicația reală (referința):**
- `uia_word.json › dialog.FileSaveAs` e o fereastră `#32770` (dialog Windows modal). Controalele ei cu focus sunt `ComboBox "File name:" ALT+n`, urmat imediat în arbore de `ComboBox "Save as type:" ALT+t`, apoi `Button "Save" Alt+s` (id 1) și `Button "Cancel"` (id 2), lista „Vizualizare elemente” și panoul din stânga.
- `dialog.open`: `ComboBox "File name:" Alt+n`, `ComboBox "Files of type:" Alt+t`, `SplitButton "Open" Alt+o`.
- `dialog.save_your_changes_to_this_file`: Edit „File name”, ComboBox „Save as type”, Save `ALT+S`, Don't Save `ALT+n`, Cancel.
- Regula Tab din ferestrele Windows (learn.microsoft.com/…/dlgbox-programming-considerations: TAB = controlul următor din fereastră) e chiar sursa pe care o citează api §4 pentru `activat` (`api_biblioteca.md:176-177`). Biblioteca a adoptat-o în runda 14: `aplicatii.js:480-481` („Tab / Shift+Tab … trec prin controalele ferestrei și nu ies din ea (fereastra modală e capcană de focus …)”).
- Ordinea exactă a Tab-ului nu e capturată (`[presupus] R14-1`), dar ieșirea din fereastra modală nu există în nicio fereastră Windows. Pe drumul de mai sus, primul Tab ajunge oricum pe Save as type, nodul de imediat după File name.

**De ce e GRAV:**
- Drumul lecției `m1-l03:192` / `:195` / `:269` („F12, la Save as type alege PDF (*.pdf), Save”), făcut cu tastele obișnuite ale ferestrei Windows, nu se poate duce la capăt: verificarea `fisier:{…,ext:'pdf'}` pică. În schimb apar, fără niciun mesaj, un .docx nedorit și un paragraf gol în document.
- Aplicația se poartă vizibil altfel decât fereastra reală: focusul dispare din fereastra deschisă, iar tastele cad în gol (R12, „nu tace”).
- Aceeași scară: criticul 13 a dat GRAV T1 pentru exact acest gest în PowerPoint (Tab care scoate focusul din Open / Save your changes). Criticul 4 o trecuse la Word ca [FARA_REFERINTA], înainte să existe regula în bibliotecă și fără urmarea pe drumul PDF.

**Cauza:** `word.js:1915` (`I.la.tasta`) nu tratează Tab în ferestre și nu dă `I.la.fereastra`. Cârligul comun `I.tabFereastra` (`aplicatii.js:510`) există, dar e opt-in: `aplicatii.js:473-476` spune explicit că Word nu-l primește („Word și Excel au deja Alt + literă în ferestre … și NU primesc cârligul”). Alt + litera merge deja în Word; lipsește doar Tab / Shift+Tab (și focusul pe listă).

### Ce a trecut în unghiul B (văzut pe ecran, în stare și în evenimente)
- **Scurtăturile** (`rb16.json › B1_scurtaturi_globale`):
  - F12: `tasta_f12|salvare_ca`, Save As cu focusul în File name, numele selectat (`[0,15,15]`).
  - Ctrl+S pe document nou: „Save this file”, cu focusul în File name, numele selectat. Ctrl+S pe documentul salvat și modificat: `ctrl_s|salvare`, fără fereastră, iar fișierul primește „Marți: sport”.
  - Ctrl+F12: Open, focusul în File name, bara „Documente”. Ctrl+O: File › Open.
  - Esc închide Save As, Open și File, iar focusul revine în document.
  - Ctrl+W pe modificat: „Save your changes…”; Alt+N = `tasta_acces|inchidere_fara_salvare|fereastra:Don't Save`, `docs 0`. Ctrl+N: vezi S6.
- **Alt + litera subliniată** (`B3_alt_litera`), toate literele din referință:
  - Save As: Alt+T → Save as type, Alt+N → File name, Alt+S → `tasta_acces|salvare|dialog_salvare:Save` (fișierul scris);
  - Open: Alt+T → Files of type, Alt+N → File name, Alt+O → `deschidere`, `docs 1`, Alt+P → mesajul central (panoul de examinare nu e simulat).
- **Enter în File name** = Save, cu `activat dialog_salvare:Save` (`C_keytips_asistent › dupa_enter`, `pas 4`).
- **KeyTips** (`rc16.json › C_keytips`):
  - Alt, F, A, O → Save As (`tasta_acces|pagina_backstage|backstage:Save As`, `…|salvare_ca|backstage:Browse`), focusul în File name;
  - Alt, F, O, O → Open; Alt, F, N → New; Alt, F, O, Y, 3 → primul fișier din Recent („Popescu_Ana_7A_orar  -  Word”);
  - Esc în Browse → înapoi la File › Save As; după Alt, F, primul Esc iese din taste, al doilea închide File.
  - Literele sunt cele din `uia_word.json › backstage.nav` / `backstage.Save As` / `backstage.Open` (Alt, F, A / Alt, F, A, O / Alt, F, O, O / Alt, F, N / Alt, F, O, Y 3).
- **Asistentul pe KeyTips** (`C_keytips_asistent`): pașii `[fila:File, backstage:Save As, backstage:Browse, dialog_salvare:Save]`. Alt, F, A, O dă `pas 3`, fără bulă; numele + Enter dă `pas 4`.
- **Listele derulante ale panglicii** (`C_font_size_tastatura`):
  - Alt, H, F, S: focusul în Font Size, cu valoarea „11” selectată;
  - Alt+↓: lista se deschide, cu `activat meniu_derulant:Home/Font/Font Size`; ↓↓: `mutare_in_lista`;
  - Esc închide lista, iar mărimea rămâne 11;
  - ▾ cu mouse-ul, ↓, Enter: `tasta_enter|marime_font|document|meniu:12`, „Ana are mere@12”.
  - Save as type cu Alt+T, Alt+↓, ↓×6, Enter, Enter dă PDF-ul (`K1b`).

---

## C. Regresul

Probele: `pd16.py` → `rd16.json`, `pd16b.py` → `rdb16.json`, `pd16c.py` → `rdc16.json`, `pd16d.py` → `rdd16.json`, `pe16.py` → `re16.json`. Nicio eroare de pagină (`rd16.json › erori_pagina []`).

**Închisele din rundele 1-5, pe eșantion (1366×768): toate țin.**
- **Atelierul `m1-l03:262-290`** (`C1_atelier_1366`), drumul soluției cu mouse-ul:
  - Ctrl+W, Ctrl+O › Browse › Descărcări › club-lectura › Open: `club-lectura.docx / Descărcări / docs 1`;
  - „ Pop Mihai”, F12 › Documente › Pop_Mihai_7A_club › Save: titlul „Pop_Mihai_7A_club  -  Word”;
  - F12 › Save as type › PDF: `dialog.FileSaveAs_pdf`, iar File name are numele documentului;
  - Save, Ctrl+W: `fisiere` cu `Pop_Mihai_7A_club.docx` și `.pdf`, fișa din Descărcări rămasă pe loc, `docs 0`, „Word”.
- **N4, drumul `:240`** (Open cu dublu clic, cu Alt+O, cu numele + Enter): în A (S4) și B (`B3 › open_Alt+o`).
- **T1 `:189-192`** (`rdd16.json › t1_189_192`, `rd16.json › C2`): Ctrl+S scrie „Marți: sport”; F12 propune „Popescu_Ana_7A_orar.docx”; PDF › Save dă `.docx` și `.pdf`, amândouă cu „Marți: sport”; documentul rămâne `.docx`.
- **T2** („already exists”, fișierul colegei neatins): în A (S5) și B (`B5`).
- **T3** (zona PDF): Alt+E → `bifare`, Alt+M / Alt+A → `alegere_optiune`, Alt+O → mesajul central „Options...” (`C2`).
- **T4**: Ctrl+F12 = Open. Shift+F12 pe document nou = „Save this file”.
- **Titlul după salvare:** „Marin_Ioana_7B_poezie  -  Word” pe ecran și în stare.
- **„Save your changes…”:** la Ctrl+W, butoanele Open (▾), More options…, Save, Don't Save, Cancel. Cancel te întoarce în document (`docs 1`). La ✕ apare aceeași fereastră.
- **Enter = Save + asistentul; lista Font Size; Save as type cu tastele:** în A (T6) și B.
- **Panglica revine după „Word fără document”** (`re16.json`), pe toate cele trei ieșiri (Ctrl+N, Open din Descărcări, File › Blank document):
  - Bold, Italic, FontSize, Paste active; Copy gri, ca `activ_cu_document.Copy = false`;
  - caseta Font Size activă, 15 comenzi active pe Insert;
  - Ctrl+B + „Z” dă `Z@11B`.

**Fereastra mică** (1366×657 la 125% = 1093×526 css, factor 1,25):
- **Save As și Open** (`rd16.json › C3`): File name, Save as type și panoul din stânga sunt pe ecran. În Open, butonul Open e pe ecran (y 432).
- **Save / Cancel din Save As** (y 518-544) stau sub marginea de jos până derulezi fereastra: stratul ei se derulează (`rdb16.json › derulare.strat [566, 524, "auto"]`).
- **Atelierul cu un elev care derulează** (`rdb16.json › mica_azi`): Open, numele, Save merg.
- **Lista Save as type deschisă fără derulare:** se întinde până la y 705, iar rândul PDF e la y 529 (sub ecran). Rotița peste lista deschisă nu derulează nimic (`rdc16.json › tip_mica_azi`).
- **Lista deschisă după derulare** (`rdd16.json › mica_derulat_intai`): PDF stă la y 487 și se alege (`dialog.FileSaveAs_pdf`).
- **Nu e regres:** cu `word.js` de dinainte de rundă (servit din `runde/16/inainte/word.js` prin rută, doar citit) iese identic (`rdb16.json › mica_inainte_de_runda`, `rdc16.json › tip_mica_inainte`). Vezi MINOR.

**Telefonul** (390×844, atingeri) (`rd16.json › C4`, `rdd16.json › telefon_pdf`, captura `c_telefon_dupa_open.png`):
- Compunerea „a/an/ana” + „ ” + „a/ar/are” dă `["Ana are"]`, fără dubluri.
- File › Save As › Browse, numele (insertText), Save: „Ana_7A_tel.docx” în Documente, cu titlul pe ecran.
- File › Open › Browse › Descărcări › club-lectura › Open: `docs 2`, „club-lectura.docx / Descărcări”.
- Save as type › PDF cu atingeri: „Orarul meu.pdf”.

**Celelalte aplicații** (`C5_excel_powerpoint_pornesc`):
- Excel pornește: „5”, Enter, „=A1*2”, Enter dau `A1 5`, `A2 10` cu formula.
- PowerPoint pornește: Ctrl+M dă `diapozitiv_nou`, 2 diapozitive.
- Banda Word a schimbat doar `word.js` (diff-ul față de `runde/16/inainte/word.js` are numai hunk-uri în `word.js`). Schimbările din `aplicatii.js`, `poligon.html`, `setari.json` și `excel.js` sunt ale altor benzi (raportul constructorului). Nu văd nimic stricat în altă aplicație.

---

## [FARA_REFERINTA] (nu le număr GRAV)
- **Ordinea completă a Tab-ului** în Save As / Open / „Save your changes” / „Save this file”. Referința dă doar ordinea nodurilor (Save as type după File name), nu focusul.
  - Ce ar lămuri: `FocusedElement` după fiecare Tab și Shift+Tab, în cele patru ferestre.
- **Backspace în listă, F4 și Alt+D pe bara de adrese:**
  - nu sunt în referință; „Până la "Desktop" (Alt + săgeată în sus)” e singura tastă de navigare citată;
  - pe simulator lista nu primește focusul (GRAV K1), deci Backspace editează File name (corect pentru câmp);
  - F4 dă `tasta_f4|tasta_f4`, fără efect, iar Alt+D nu dă niciun eveniment (`B4_lista_si_adresa`).
- **File › Open cu tastele** (Ctrl+O): focusul nu e pe niciun control. Tab, Tab, ↓, Enter dau `fara_efect` (`rc16.json › ctrl_o_tab_jos_enter`); merge doar Alt, F, O, Y, 3. E la fel ca în runda 4. Lecția `:218` se face cu mouse-ul.
- **Ctrl+N cu File deschis:** dă `fara_efect`.
  - După Alt, F, primul Esc iese doar din taste și abia al doilea închide File. Fără document, un singur Esc lasă File deschis, iar Ctrl+N „nu merge” (`rac16.json › ctrl_n_dupa_alt_f_esc`).
  - Referința nu spune ce face Word real.
- **Lista Font Size:** ↓ în lista deschisă nu schimbă valoarea din casetă („11” rămâne până la Enter). Al doilea Esc lasă focusul în casetă, nu în document (`C_font_size_tastatura › esc2`), ca în runda 4.
- **Butoanele Înapoi / Înainte** rămân dezactivate după navigare. Referința are `activ:false` doar la deschidere.
- **Alegerile constructorului fără citat** (R16-1 … R16-5): ce am văzut nu contrazice referința.
  - Fereastra de eroare la numele interzis lipsește; e în locul ei mesajul central.
  - Lista din Save As e filtrată pe tip.
  - Fișierul modificat și redeschis rămâne cu munca elevului.
  - Toată panglica e gri fără document.
  - Switch Windows dă mesajul central.
  - Ce ar lămuri: capturile din `de_verificat.md › RUNDA16-WORD`.
- **Enter pe propriul nume** al documentului salvat (F12 pe club-lectura din Descărcări, Enter): „already exists”, ca în runda 5.

## MINOR
- **Alt+L, Alt+D, Alt+Q fără eveniment:** Alt+L („Tools”, `tasta_acces "Alt+l"` în `dialog.FileSaveAs` / `dialog.open`), Alt+D și Alt+Q (în document) nu dau niciun eveniment și niciun mesaj (`rbb16.json › K5`). Încalcă §4 („un eveniment pe fiecare gest fizic”), dar nu sunt pe drumul lecțiilor, ca în runda 4.
- **Alt+↑ și F5 tac:** referința le scrie chiar în eticheta butoanelor: „Până la "Desktop" (Alt + săgeată în sus)”, „Reîmprospătare "Documente" (F5)”.
  - Tastele dau `alt_sageti|alt_sageti|camp:nume_fisier` și `tasta_f5|tasta_f5`, fără efect și fără mesaj.
  - Clicul pe aceleași butoane dă mesajul central (`K5 › clic_Până la`, `clic_Reîmprospătare`). Alt+← / Alt+→ la fel.
- **Esc într-o fereastră** dă `tasta_esc|anulare|camp:nume_fisier|`, fără `activat` Cancel (rundele 4, 5).
- **Asistentul trece pasul `dialog_salvare:Save` și când salvarea e refuzată** (nume interzis: `pas 1`, `S3_vecin_save_this_file`; „already exists”). E în `aplicatii.js` (comun), ca în runda 5.
- **Aceeași țintă canonică pentru două săgeți:** `fereastra:Deschidere` e ținta lui ▾ din File name și a lui ▾ din Save as type / Files of type (Alt+↓ → `activat fereastra:Deschidere` în ambele, `T6_vecin`, `B4 › alt_jos_dupa_alt_d`). Un pas de asistent n-ar putea să le deosebească; niciun pas de lecție nu-l folosește.
- **Fereastra mică** (vezi C): Save / Cancel sub margine până derulezi fereastra. Lista Save as type deschisă fără derulare are PDF-ul sub ecran, iar rotița nu derulează lista deschisă. Se rezolvă derulând întâi fereastra (sau cu Alt+T, Alt+↓). Nu e regres.
- **File › Close** (Alt, F, C sau clic) dă mesajul central „Close … nu e simulată”. Sarcina (5) a atelierului („Închide documentul, dar lasă Word deschis”) are în lecție drumul Ctrl+W, care merge.
- **Butonul cu numele din bara de titlu:** fără document, clicul pe el dă „În aplicația reală, „Document1  -  Word” funcționează…” (`rab16.json › clic_bara_titlu`). Ținta lui rămâne „Document1  -  Word” orice nume ar avea documentul.
- **Textul mesajului „already exists”:** „În aplicația reală, „X.docx already exists” funcționează; aici nu e simulată.” (MINOR-ul vechi din runda 5).

## Ce a trecut (văzut pe ecran și în `stare()`)
- **Cele 8 GRAV din runda 5** (S1, S2, S3, S4, S5, S6, T5, T6), pe gestul criticului 5 și pe un gest vecin. T5 se potrivește cu `com_r5.json › activ_fara_document` pe toate cele 12 chei.
- **Tastatura pe drumurile cu fișiere:**
  - F12, Ctrl+S (nou și salvat), Ctrl+O, Ctrl+F12, Ctrl+N, Ctrl+W + Alt+N, Shift+F12;
  - focusul inițial și selecția numelui în Save As / „Save this file” / „Save your changes”;
  - Alt + toate literele din referință (Save As: N, T, S; Open: N, T, O, P; zona PDF: E, M, A, O); Enter = Save / Open; Esc;
  - KeyTips: Alt, F, A, O / Alt, F, O, O / Alt, F, N / Alt, F, O, Y, 3, cu asistentul trecut pe toți cei 4 pași;
  - lista Font Size din taste (Alt, H, F, S; Alt+↓ cu `activat`; Esc; Enter); Save as type cu Alt+T / Alt+↓ / ↓ / Enter.
- **Regresul:** atelierul m1-l03, T1-T4, titlul, întrebările, panglica după ieșirea din „fără document”; fereastra mică cu derulare; telefonul (compunerea, Save As, Open, PDF); Excel și PowerPoint pornesc.

## Predarea pentru runda următoare
1. **De reparat întâi: GRAV K1** (Tab în ferestrele Word).
   - Word să dea `I.la.fereastra()` (stratul ferestrei deschise) și să cheme `I.tabFereastra(fer, e.shiftKey)` din `I.la.tasta` pe Tab / Shift+Tab, cât e o fereastră deschisă. E cârligul comun din runda 14, `aplicatii.js:473-530`. Alt + litera proprie a lui Word se păstrează.
   - Lista „Vizualizare elemente” trebuie să poată primi focusul, la clic și din Tab: ↑/↓ mută alegerea și numele din File name, iar Enter = Open / Save.
   - Proba: drumul `K1_pdf_cu_tab` (F12, nume, Tab, Alt+↓, ↓×6, Enter, Enter) trebuie să dea `.pdf`, cu documentul neschimbat. Tab ×15 și Shift+Tab ×8 trebuie să rămână în fereastră, în Save As, Open, „Save this file” și „Save your changes”.
   - Dacă reparația atinge `aplicatii.js` (comun), Excel și PowerPoint trebuie reprobate pe ferestrele lor (cârligul e opt-in; Excel nu-l primește).
2. **Referințe de capturat** (Word real, sesiune vizibilă, la ora orchestratorului):
   - `FocusedElement` după fiecare Tab / Shift+Tab, în Save As / Open / „Save your changes” / „Save this file”;
   - Backspace / Alt+↑ / F4 cu focusul în lista ferestrei;
   - focusul după Ctrl+O și ↓ pe Recent;
   - Esc după Alt, F, fără document;
   - fereastra de eroare la numele interzis (R16-1);
   - valoarea casetei Font Size la ↓ în lista deschisă.
3. **MINOR ieftine, în aceeași bandă:**
   - Alt+↑ / F5 / Alt+← / Alt+→ în ferestre să dea mesajul central, ca clicul pe butoanele lor;
   - Alt+L să apese Tools (mesajul central), ca clicul.

GRAV_VECHI_DESCHISE: 0
GRAV: 1
