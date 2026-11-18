# Criticul rece, runda 4, etapa B (Word): cele 4 GRAV din runda 3 + unghiul gest_tastatura

**Cine:** critic rece, fără notele constructorului. Din `runde/4/` am citit doar `gata_pentru_critic.md`. N-am citit `diferente.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `de_verificat.md`, `de_aprobat.md`, `STARE_ORCHESTRATOR.md`, `jurnal.jsonl`, suplimentele. N-am rulat `proba_grav.py` / `proba_telefon.py`: concluziile vin din gesturile mele.

**Ce am rulat:**
- Server static legat de `127.0.0.1`, pe port liber, servind worktree-ul. Playwright Chromium headless, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost.
- Pagina: `aplicatii/poligon.html`, apoi `LH.aplicatii.deschide('word', {continut, profil, focus:true})`, cu parametrii noi de conținut (`nume`, `folder`, `salvat`, `modificat`, `fisiere`, `recente`) pentru drumurile lecției m1-l03.
- Gesturi reale: `page.keyboard` (inclusiv Alt+literă, Alt+↓, Tab, Esc, Enter, Ctrl+F12), `page.mouse`, `page.touchscreen` (390 px, cu atingere). Tastatura care compune: CDP `Input.imeSetComposition` / `Input.insertText`.
- După fiecare gest am citit: `stare()`, ecranul (caseta Font Size, caseta Save as type, bara de titlu, rândurile Recent), elementul care are focusul, mesajele `[data-lh-nesimulat]`, `window.__lhAplicatieEv` (cu `ts`, `gest`, `actiune`, `tinta`, `activat`) și `asistent.pas()`.
- **Word real, o singură dată, invizibil** (`com_f12.py`): `DispatchEx`, `Visible=False`, `DisplayAlerts=0`, doar ca să citesc numele propus de Save As (`Dialogs(84).Name`, fără să afișez fereastra). Fișierele în %TEMP%, șterse; am închis doar PID-ul meu. PowerPoint neatins.
- Scripturile și ieșirile sunt în `runde/4/critic_probe/`:
  - ajutoare: `h4.py`, `pc4_js.py`; referința: `ref_dump.py`, `ref_tree.py`, `ref_FileSaveAs.txt`;
  - partea A: `pa4.py` → `ra4.json`; drumurile m1-l03 + tastatura: `pb4.py` → `rb4.json`; regresul + telefonul + Word fără document: `pc4.py` → `rc4.json`; `pd4.py` → `rd4.json`; `pe4.py` → `re4.json`; fereastra PDF: `pf4.py` → `rf4.json`; ordinea evenimentelor: `pt.py` → `rt.json`; Word real: `com_f12.py` → `com_f12.json`; recunoaștere: `e0.py` → `e0.json`;
  - capturi `*.png`; diff-ul de cod: `diff_r4.txt`.

**Diff-ul rundei (necomis):** 4 fișiere, +437 / −98.
- `aplicatii/date/word.json`, regenerat: suprafețe noi `lista.FontSize`, `lista.FileSaveAs_tip`, `lista.FileSaveAs_navigare`, `dialog.FileSaveAs_pdf`, `dialog.open`, `dialog.save_this_file`, `dialog.save_your_changes_to_this_file`, `backstage.Open_rand_recent` și 8 galerii `lista.*`.
- `aplicatii/word.js` (+~400):
  - listele desenate din referință, cu tastele lor (`listaRef`, `tastaLista`, `word.js:1194-1243`);
  - „Save this file” și „Save your changes…” din referință; Ctrl+W și ✕ închid documentul; o stare nouă, „Word fără document” (`cerereInchidere`, `inchideDocument`, `word.js:1321-1350`);
  - fișierele din foldere cu textul lor (`stare().fisiere`), Recent, Ctrl+S pe un document salvat = același fișier;
  - Alt+literă în ferestre (`word.js:1790-1812`); cursorul implicit la capăt.
- `aplicatii/panglica.js`: SplitButton-urile din ferestre își scriu numele („Documente”, antetele coloanelor).
- `aplicatii/aplicatii.css`: stilurile listelor, ale ferestrelor Office, ale stării fără document.

---

## A. Cele 4 GRAV din runda 3

### GRAV 3 (lista Font Size): **ÎNCHIS**
**Gesturile mele (`ra4.json`, `rb4.json`, `rc4.json`):**
- **▾ + rândul 20, pe ambele profiluri** (`g3_sageata_20_word365` / `_word2007`): „are” selectat, clic pe ▾ (`meniu_derulant:Home/Font/Font Size`).
  - Se deschide lista: `{rol: "menu", randuri: 16, ales: "11"}`, cu rândurile `meniu:8 … meniu:72`.
  - Clic pe `meniu:20` dă `formatare_pe_caractere`: `"are@20"`; caseta arată `"20"`; focusul rămâne în document. Evenimentele: `meniu_derulant|lista_marimi`, apoi `clic|marime_font|meniu:20`.
- **Drumul lecției `m2-l10:152`** (`g3_lectie_m2l10_152`): am tras cu mouse-ul peste „Atelierul de pictură”, apoi B, ▾ › 20, Center. Rezultatul: `"Atelierul de pictură\r@20B"`, `aliniere ["centru", …]`, caseta `"20"`.
- **`:238` / `:242`** („alege 16”): `"Clubul de șah\r@16"` (`g3_16`).
- **Tastatura** (`b_fs_altjos_sageti_enter`): clic în casetă, Alt+↓ (lista, `ales "11"`), ↓×5 (`ales "20"`), Enter. Rezultatul: `"are@20"`, iar focusul revine în document.
  - Alt, H, F, S, apoi Alt+↓, ↓, Enter dă `"are@12"`.
  - Esc închide doar lista.
- **Telefonul** (`t_telefon_font_size_lista`): atingere pe ▾, apoi pe 20, dă `"are@20"`.

**Referința:** `uia_word.json › suprafete.lista.FontSize` = Menu `[232,115,54,395]`, 16 ListItem `8 … 72` (aceleași ca `acoperire_r3.fapte.c_font_size_lista.randuri`). Pe poligon lista stă la `[235,118,54,395]`, sub caseta `[234,93,43,24]` (referința: `[232,91,43,24]`), deci decalajul e același, de 2-3 px. Scenariul real `word-font-size-lista` („20” → „are” 20) = ce văd eu.

**Ce rămâne în afara GRAV-ului:** clicul în casetă nu-i selectează valoarea. „20” scris după un clic devine `"1201"` (`g3_clic_20_enter_*`: după clic `["11",1,1]`, apoi `"are@1201"`). Referința nu spune ce face un clic în casetă, iar scenariul `word-font-size-tastat` n-are rezultat real (`"trimis_la_profesor": true`). Merge la [FARA_REFERINTA].

### GRAV N4 (drumurile lecției m1-l03): **DESCHIS** (reparat mult, nu tot)
**Ce s-a reparat (gesturile mele, `rb4.json`):**
- **`:212` (N1P5E1)**, pe 3 drumuri (clic pe Save / Enter / Alt+S). Pornire: `{nume:'Popescu_Ana_7A_orar', folder:'Documente', modificat:true, fisiere:[…7A, …7B], recente:[7B, 7A]}`.
  - Ctrl+W deschide „Save your changes to this file?”, cu `butoane ["More options…","Save","Don't Save","Cancel"]` (= `scenarii_real/word-ctrl-w-nesalvat.json`).
  - Save dă `fisiere`: `Popescu_Ana_7A_orar.docx` cu „Miercuri: desen”, `documente_deschise 0`, titlul „Word”.
  - Ctrl+O deschide Backstage › Open, unde Recent arată „Popescu_Ana_7A_orar” și „Popescu_Ana_7B_orar”. Clic pe 7A redeschide documentul, cu textul lui (`clic|deschidere|backstage:Popescu_Ana_7A_orar`).
  - Asistentul cu pasul `fereastra:Save` trece la `pas 1` pe toate cele 3 drumuri. Enter poartă `activat: fereastra:Save`.
  - Alt, F, O, Y3 deschide același fișier (`b_recent_tastatura › y3`).
- **`:189` (N1P4E1), pasul 1:** Ctrl+S pe documentul salvat scrie rândul în același fișier, fără fereastră (`n4_189 › dupa_ctrls`).
- **✕** pe documentul salvat, nemodificat, închide Word-ul (`n4_x_salvat`: `documente_deschise 0`, `titlu null`). Ctrl+W pe un document nemodificat închide fără întrebare (`b_ctrlw_nemodificat`).
- **`:143`** (Ctrl+S › „Save this file” › nume › Enter) și **`:127`** (F12 › nume › Enter) salvează în „Documente”, iar titlul se schimbă.

**Ce rămâne (gesturile mele):**
- **Fereastra Open nu există pe niciun drum.** Ctrl+O › Browse dă „În aplicația reală, „Browse” funcționează; aici nu e simulată.” (`n4_browse_open`).
  - Referința există acum: `uia_word.json › dialog.open` („Open”, `#32770`, `deschis_prin: "Ctrl+F12 … Backstage › Open › Browse deschide aceeași fereastră"`), iar Browse are tasta `Alt, F, O, O` (`backstage.Open`).
  - Lecția o cere: `m1-l03:86` („Nu e acolo? Open › Browse › Documente”), exercițiul `:240-242` (N1P6E1: „Deschide-o (Ctrl+O › Browse, apoi Descărcări)”, cu verificarea `activ:{nume:'club-lectura',folder:'desc'}`) și atelierul `:262-265` (N1AE1).
  - Pe bibliotecă, aceste exerciții nu se pot duce la capăt. `api_biblioteca.md` §3: „Pe comenzile de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate.”
- **„Documente” nu se poate alege în stânga:** panoul are doar „Acasă”, „Galerie”, „Acest PC”, „Rețea” (`lista.FileSaveAs_navigare`). Clicul pe ele, ca și pe „Documente” din bara de adrese, dă mesajul central (`a2_clic_acest_pc`, `a2_clic_documente`). Lecția spune „În stânga alege Documente” (`:82`, `:119`, `:127`, `:132`).
  - Salvarea merge totuși, pentru că folderul implicit e „Documente”, deci aici exercițiul se termină. Partea asta e un rest, nu blocaj.

Alte trei drumuri ale lecției m1-l03 sunt rupte de mecanisme noi, numărate separat mai jos: T1 (F12 pe documentul salvat), T2 (fișierul colegului înlocuit în tăcere), T5 (document nou după Ctrl+W).

### GRAV A1 (caseta Save as type după PDF): **ÎNCHIS**
**Pe ecran și în stare:**
- F12, clic pe caseta Save as type, apoi clic pe „PDF (*.pdf)” (`ra4.json › a1_mouse`).
  - Caseta vizibilă arată `input=PDF (*.pdf)` (`vizibil_in_caseta`), iar `stare().tip_salvare_afisat` = `"PDF (*.pdf)"`. Captura `a1_dupa_pdf.png`.
  - Save dă `fisiere_salvate ["Orar.pdf"]` și `nume_fisier null`, exact ca `scenarii_real/word-salvare-pdf.json` (`tip_salvare_afisat "PDF (*.pdf)", fisiere_salvate ["Orar.pdf"], nume_fisier null`).
- Lista are cele 17 rânduri din `acoperire_r3.fapte.e_save_as_type_randuri`, în aceeași ordine. Stă sub casetă, la fel de lată: `[135,431,815,274]` față de fereastră; referința `lista.FileSaveAs_tip` dă `[134,430,815,274]`.
- **Tastatura** (`b_tip_tastatura_asistent`): Alt+T, Alt+↓, ↓×6, Enter → caseta „PDF (*.pdf)”; apoi Enter → `Orar.pdf`.
- **Telefonul** (`rd4.json › telefon_save_as_type`): atingere pe casetă, apoi pe PDF → „PDF (*.pdf)”.

(Ce se schimbă în rest în fereastră după PDF e o constatare nouă: GRAV T3.)

### GRAV A2 (Save As fără texte): **ÎNCHIS**
- **`ra4.json › a2_texte`:**
  - „Documente” se vede în bara de adrese: `{text:"Documente", r:[187,39,83,34]}`. Referința: SplitButton „Documente” `[159,35,83,34]` în fereastra `[-27,-3,…]`, adică `[186,38]` față de colțul ferestrei.
  - Antetele „Nume” `[249,115,272,26]`, „Data modificării”, „Tip”, „Dimensiune” au textul pe ecran.
  - Panoul din stânga are 4 rânduri cu text.
- Captura `a1_dupa_pdf.png` arată bara de adrese și antetele scrise.

### Regresul GRAV-urilor închise înainte
- **Telefonul nu dublează literele:** compunere „a / an / ana” + „ ” + „a / ar / are” dă `text ["Ana are"]` = ecranul (`rc4.json › reg_telefon_fara_dubluri`). **Ține.**
- **Cuvântul în compunere intră în document:** „Numele: ” + compunere „Ion”, fără confirmare, apoi atingere pe un buton „Verifică” din afara aplicației. La `click`, `stare().text = ["Numele: Ion"]` (`reg_telefon_compunere_verifica`). **Ține.**
- **Bara de titlu după salvare:** F12 › nume › Enter și Ctrl+S › nume › clic pe Save. Citit în același pas, titlul de pe ecran e „Marin_Ioana_7B_poezie - Word” (`reg_titlu_dupa_salvare`). **Ține.**
- **Enter în File name = salvare, iar asistentul trece de Save:** cu pașii `[dialog_salvare:Save, mso:Bold]`, pe F12 și pe Ctrl+S iese `pas 1`, cu evenimentul `tasta_enter|salvare|camp:nume_fisier|dialog_salvare:Save` (`reg_enter_save_asistent`). **Ține.**

---

## B. Unghiul gest_tastatura: constatări noi (de la cea mai puternică)

### GRAV T1: F12 pe un document deja salvat propune primul rând, nu numele fișierului. „Lasă același nume” din lecție face alt PDF
**Pași (`rb4.json › n4_189_ctrls_apoi_pdf`):**
- Pornire: documentul `Popescu_Ana_7A_orar`, salvat în Documente, cu „Marți: sport” adăugat. Apoi Ctrl+S (scrie bine fișierul), F12.
- Caseta File name arată **„Orarul meu.docx”** (`f12_propune.nume_box`), adică primul rând al textului.
- Am lăsat numele, cum cere lecția, am ales PDF și am apăsat Save. Rezultatul: `fisiere_salvate ["Orarul meu.pdf", "Popescu_Ana_7A_orar.docx"]`. Nu există `Popescu_Ana_7A_orar.pdf`.

**Word real (`com_f12.json`, Word 16.0.20326, invizibil):**
- Ca etalon, pe un document NOU, `Dialogs(wdDialogFileSaveAs).Name` dă „Tema mea de azi.docx”, adică primul rând. Asta e exact `scenarii_real/word-salvare-ca-f12.json › dialog_salvare.nume_propus`.
- Pe același document după `SaveAs2` ca `Popescu_Ana_7A_orar.docx` dă `%TEMP%\…\Popescu_Ana_7A_orar.docx`, adică numele fișierului. După o modificare dă tot numele fișierului.
- Limita probei: e înregistrarea ferestrei citită prin COM, nu caseta desenată. Pe documentul nou însă cele două coincid cu referința.

**Lecția:**
- `m1-l03:85`: „Copia PDF: apasă F12, la Save as type alege PDF (*.pdf), **lasă același nume** și apasă Salvare”;
- `:184`: „În Documente sunt acum două fișiere cu același nume”;
- verificarea `:192`: `fisier:{folder:'doc',nume:'Popescu_Ana_7A_orar',ext:'pdf'}`.

**Efectul:** elevul care face exact ce scrie pică verificarea și învață că F12 „uită” numele documentului. La laborator, F12 îi propune numele lui.

**Cauza:** `word.js:1019`, `let propus = prim ? <primul rând> : faraExt(M.nume)`. Numele fișierului e folosit doar când documentul n-are text. Înainte de runda asta documentul nu putea porni salvat, iar parametrul `nume` e nou, deci drumul `:189` apare abia acum.

### GRAV T2: Enter (sau Save) pe numele unui fișier care există îl înlocuiește în tăcere: fereastra „already exists” lipsește și nu apare nici mesajul central
**Pași (`rb4.json › n4_167_nume_colega_existent`, exercițiul `m1-l03:167`, N1P3E2):**
- Pornire: `fisiere:[{folder:'Documente', nume:'Popescu_Ana_7A_orar', text:['Orarul meu','Luni: română, matematică, TIC']}]`. Apoi F12, Ctrl+A, „Popescu_Ana_7A_orar”, Enter.
- Rezultatul: fișierul colegei are acum textul elevului, `["Orarul meu","Luni: sport, TIC, istorie"]`. Nu apare nicio fereastră (`dlg []`, `dialog null`) și niciun mesaj (`msg []`). Evenimentul e doar `tasta_enter|salvare|camp:nume_fisier|dialog_salvare:Save`.

**Lecția (drumul ei, scris):**
- `m1-l03:82`: „Dacă Word spune că fișierul există deja (already exists): Anulare (Cancel)…”;
- `:157-159`: „Dacă în folder există deja un fișier cu același nume, Word întreabă: The file … already exists … Nu apăsa OK … Apasă Anulare (Cancel)”, iar la PDF: „You already have a file named… Do you want to replace it”;
- exercițiul `:167-172`, care verifică `neschimbat:{…Popescu_Ana_7A_orar}` și sfătuiește: „la întrebarea „already exists” apasă Cancel”.
- Simulatorul vechi al lecției avea fereastra (`lectii/_sim/wordfisier.js:15-16`, `:115-126`).

**Contractul:**
- R12: „o comandă afișată și nesimulată dă mesajul central standard …, nu tace”.
- `api_biblioteca.md` §3: „Pe comenzile de pe drumul lecției mesajul nu e o ieșire”.

Aici nu e nici fereastra, nici mesajul: biblioteca face în tăcere gestul distructiv. Elevul învață că Word înlocuiește fișierul colegului fără să întrebe, deci exact obiceiul pe care lecția vrea să-l prevină.

**Cauza:** `word.js:1106-1109`, `scrieFisier`: `if (v) Object.assign(v, f)` înlocuiește direct. Fișierele cu nume în foldere sunt noi în runda asta.

Referința UIA nu are fereastra „already exists”, deci forma ei nu se poate desena. Lipsa oricărui semn e însă dovedită.

### GRAV T3: după „PDF (*.pdf)”, fereastra Save As rămâne cea pentru .docx; zona PDF din referință și tastele ei de acces lipsesc
**Pași (`rf4.json`):** F12, apoi Save as type › PDF.
- `dupa_pdf.suprafete = ["dialog.FileSaveAs"]`. Controalele vizibile: „Save Thumbnail” `true`; „Optimize for:”, „Standard (publishing online and printing)”, „Minimum size (publishing online)”, „Options...” și „Open file after publishing” sunt toate `false`. Captura `a1_dupa_pdf.png` arată „Save Thumbnail”.
- **Tastele de acces:** Alt+E, Alt+O, Alt+M dau `ev []` și `msg []`. Nu apare niciun eveniment și niciun mesaj.

**Referința `uia_word.json › dialog.FileSaveAs_pdf`** (`deschis_prin: "F12, Save as type ▾ › „PDF (*.pdf)”"`):
- Group „Optimize for:” `[43,476,250,67]`, cu RadioButton „Standard…” (`tasta_acces "Alt+a"`) și „Minimum size…” (`"Alt+m"`);
- Button „Options...” (`"Alt+o"`);
- CheckBox „Open file after publishing” (`"Alt+e"`; `acoperire_r3.fapte.e_dupa_pdf.bife` = 0);
- fără „Save Thumbnail”.

Suprafața e în `aplicatii/date/word.json` (regenerat în runda asta), dar `word.js` n-o desenează nicăieri: o pomenește doar un comentariu, la `word.js:1191`.

**Lecția:** `m1-l03:85` și `:192` trec prin această fereastră. `:85` vorbește chiar de PDF-ul care se deschide după salvare („Dacă PDF-ul se deschide într-un alt program…”), adică de bifa „Open file after publishing”.

**Contractul:**
- R4 („o suprafață … diferență”);
- §4 („Un eveniment pe fiecare gest fizic al elevului”), încălcat la Alt+E/O/M;
- R12 („nu tace”).

**Efectul:** la laborator, după PDF, jumătatea de jos a ferestrei se schimbă, cu „Optimize for” și „Open file after publishing”. Elevul n-a văzut-o niciodată.

### GRAV T4: Ctrl+F12 deschide Save As, nu fereastra Open
**Pași (`rd4.json › ctrl_shift_f12`, `rb4.json › n4_browse_open.ctrl_f12`):** Ctrl+F12 deschide `dlg ["dialog.FileSaveAs"]`, cu `dialog_salvare.titlu "Save As"`. Evenimentul e `tasta_f12|salvare_ca|document|`, adică felul gestului spune F12 simplu.

**Referința:**
- `uia_word.json › acoperire_r3.fapte.d_ctrl_f12` = `{"titlu": "Open", "clasa": "#32770", butoane: ["Închidere", "Locații anterioare", "Reîmprospătare \"Documente\" (F5)", …]}`;
- `suprafete.dialog.open.deschis_prin`: „Ctrl+F12 (fereastra Windows Open…)”.

**Efectul:** elevul care încearcă să deschidă un fișier cu Ctrl+F12 primește fereastra de salvare și învață gestul invers. Dacă apoi apasă Enter, salvează documentul.

**Cauza:**
- `aplicatii.js:242`: felul `tasta_f12` se dă înaintea verificării lui Ctrl;
- `word.js:1731`: `case 'tasta_f12'` deschide Save As oricare ar fi Ctrl/Shift.

Shift+F12 face la fel (vezi [FARA_REFERINTA]).

### GRAV T5: Word fără document (stare nouă în runda asta) nu mai poate face un document nou, iar Ctrl+N și panglica tac
**Pași (`rc4.json › p_word_fara_document`, `rb4.json › b_fara_document`):** „ azi”, Ctrl+W, Don't Save. Rezultatul: `documente_deschise 0`, titlul „Word” (corect, cum spune `scenarii_real/word-ctrl-w-nu-salva.json`). Apoi:
- **Ctrl+N:** `ctrl_n|fara_efect|document|`, `msg []`, `documente_deschise 0`. Tace.
- **Clic pe B (Bold):** `clic_comanda_panglica|fara_efect|panglica:Home/Font/Bold|`, `msg []`. Tace, deși butonul e desenat activ.
- F12, Ctrl+S, Ctrl+W, Ctrl+B: toate `fara_efect`, fără mesaj.
- **File › Home › Blank document:** „În aplicația reală, „Blank document” funcționează; aici nu e simulată.”

Pe niciun drum nu se poate face un document nou. Rămân doar Ctrl+O, Recent și ✕.

**Lecția:**
- `m1-l03:116`: „Un document nou îl faci … cu Document necompletat (Blank document), sau cu Ctrl+N”;
- `:86` și `:207`: „Închide documentul cu Ctrl+W (Word rămâne gol)”;
- atelierul `:277` (N1AE2): „fă un document gol”.
- `suprafete.json › word.ctrl_n`: `"predat_in": 5, "simulat_in": 0` (word-vii, m1-l03, m1-l04, m1-l05, m1-l06).

**Contractul:**
- R12: „Orice comandă folosită de o lecție sau citată în ea funcționează; … nu tace”;
- §3: „o comandă afișată GRI trebuie să fie gri și în aplicația reală”. Aici e invers: comenzi desenate active, care tac.

**Cauza:** `word.js:1711`, `if (!M.deschis && g !== 'ctrl_o') { actualizeaza(); return 'fara_efect'; }`. Pe panglică: `return M.deschis ? apasa(elx, tinta) : 'fara_efect'` (diff, `I.la.clic`). Starea fără document e nouă în runda asta.

### GRAV T6: alegerea din listele noi cu tastatura nu e văzută de asistent (lipsește `activat`), iar indiciul apare deși elevul a făcut bine
**Font Size (`rb4.json › b_fs_altjos_sageti_enter` vs `b_fs_mouse_asistent`):** asistentul are pasul `{tinta:'meniu:20'}`.
- **Cu mouse-ul:** ▾, apoi 20, dă `pas 1`.
- **Cu tastatura:** clic în casetă, Alt+↓, ↓×5, Enter.
  - Mărimea se aplică (`"are@20"`), dar evenimentul e `tasta_enter|marime_font|panglica:Home/Font/Font Size|`, fără `activat`, iar `pas` rămâne 0.
  - Indiciul `meniu:20` a apărut deja la Alt+↓, pentru că evenimentele `camp` și `alt_sageti` au contat ca greșeli. După Enter, bula e tot acolo (`indicii ["meniu:20"]`).
- În referință, rândurile listei sunt butoane: `lista.FontSize`, ListItem cu `clasa "NetUIGalleryButton"`.

**Save as type (`b_tip_tastatura_asistent` vs `b_tip_mouse_asistent`):** pașii sunt `[camp:tip_fisier, meniu:PDF (*.pdf), dialog_salvare:Save]`.
- **Cu mouse-ul:** `pas 3`.
- **Cu tastatura:** Alt+T, Alt+↓, ↓×6, Enter, Enter.
  - PDF-ul se salvează (`Orar.pdf`), dar `pas` rămâne 1: pasul PDF nu e văzut niciodată (`tasta_enter|tip_fisier|camp:tip_fisier|`, fără `activat`).
  - Asistentul rămâne blocat pe un pas deja făcut, iar Save-ul nu mai contează.

**Contractul:**
- §4: „`activat` = ținta canonică (§3) a butonului pe care TASTA l-a apăsat fără ca butonul să fie ținta focusului”;
- §6.3: „Pasul curent e făcut când vine un eveniment … cu `activat` (§4) = ținta canonică a pasului”.

Enter pe rândul marcat apasă rândul cât focusul stă în casetă.

**Cauza:** `word.js:1232-1238`, `tastaLista`: Enter cheamă `x.__fa()`, dar nu pune `I.activat`. Drumul cu tastatura e chiar cel citat în cod (`word.js:1687-1690`, „Alt+Down arrow key”).

---

## [FARA_REFERINTA] (nu le număr GRAV)
- **Tastare cu lista Font Size deschisă cu ▾** (`b_fs_lista_deschisa_tastez_20`):
  - după clicul pe ▾ focusul rămâne în document; „2”, „0” intră în text și înlocuiesc cuvântul selectat (`text ["Ana 20 mere"]`), iar lista rămâne deschisă;
  - Enter aplică apoi 11 (`tasta_enter|marime_font|document|`);
  - pe drumul `m2-l10:152`, un începător care deschide lista și scrie „20” își șterge titlul.

  Ce ar lămuri: în Word real, cu „are” selectat, clic pe ▾ Font Size, apoi UIA `FocusedElement`. Dacă focusul e în caseta Font Size, e GRAV.
- **Tab în ferestre** (`b_tab_saveas_f12`, `b_tab_savethis_ctrls`, `b_tab_intrebare_ctrlw`, `rd4.json › tab_in_save_as_focus`):
  - primul Tab din File name duce focusul ÎN AFARA ferestrei modale, pe `DIV.lh-ap-sus` (panglica, `[1,1,1364,180]`);
  - Tab-urile următoare și Shift+Tab dau `fara_efect`;
  - Save as type, Save, Cancel, Don't Save nu se pot atinge cu Tab.

  Referința nu are ordinea focusului (`"focus": true` = 0 în `uia_word.json`). Ce ar lămuri: `FocusedElement` după fiecare Tab, în cele trei ferestre.
- **Clicul în caseta Font Size nu-i selectează valoarea:** „20” devine „1201” (vezi GRAV 3). Scenariul `word-font-size-tastat` n-are rezultat real.
- **Al doilea Esc în caseta Font Size** lasă focusul în casetă (`b_fs_esc`), nu în document.
- **Save as type închisă:** ↓ și litera „p” nu schimbă tipul (`b_tip_inchisa_sageti_litera`), cum face o listă derulantă Win32.
- **Backstage › Open:**
  - Alt singur nu arată tastele de acces (`b_recent_tastatura › alt_in_open: keytips []`);
  - Tab, ↓ și Enter pe Recent dau `fara_efect`;
  - merge doar Alt, F, O, Y3 pornit din document.
- **După PDF**, File name rămâne „Orar.docx”. Referința nu dă valoarea casetei (`[redactat: fișier]`).
- **Shift+F12** deschide Save As (`rd4.json › ctrl_shift_f12`). Referința nu are Shift+F12.
- **„Save your changes…” pe un document deja salvat:** aceeași fereastră ca pentru unul nou, cu File name = numele lui și Save în folderul lui. Referința are doar documentul nou.
- **„Choose a Location”** arată „Documents / OneDrive - Personal” (din referință), dar salvarea merge în „Documente” local (`folderSalvare`). Referința spune: „pe PC-ul din laborator poate fi altul [NEVERIFICAT]”.

## MINOR
- **Tastele Alt fără eveniment:** Alt+H ținut (`b_alt_h_tinut: ev []`) și Alt+L („Tools”, `tasta_acces "Alt+l"` în `dialog.FileSaveAs`) în Save As (`b_alt_n_l_saveas`) nu produc niciun eveniment și niciun mesaj. Încalcă §4 („un eveniment pe fiecare gest fizic”), dar nu e pe drumul lecțiilor.
- **Esc într-o fereastră:** evenimentul e `tasta_esc|anulare|camp:nume_fisier|`, fără `activat` (Cancel), iar `stare().dialog.apasat` rămâne `null` (`b_intrebare_Escape`). O lecție care așteaptă Cancel nu vede Esc-ul.
- **Ordinea evenimentelor:** tastele din câmpuri se emit cu `setTimeout(0)` (`aplicatii.js:377`). La gesturi repezi ajung DUPĂ gestul următor:
  - `b_savethis_Alt+s`: ultimul `tastare` vine după `tasta_acces|salvare`;
  - `ra4.json › a1_mouse`: 4 × `tastare` vin după `clic|salvare_pdf`.

  Asistentul le numără ca greșeli pe pasul următor.
- **Titlul în Backstage:** `backstage.cadru` desenează textul static „Document1  -  Word” (`re4.json`: `"Document1  -  Word @54,9 sup=backstage.cadru"`), oricare ar fi documentul. Starea spune „Word”. Captura: `n4_212_recent_clic.png`. În plus, ținta butonului titlului rămâne `bara_titlu:Document1  -  Word` după redenumire.
- **Recent:** deasupra fișierelor sunt două rânduri goale `[element de listă, nesalvat]`. Clicul pe ele citează eticheta-substitut (`rc4.json › p_recent_randuri`; era MINOR și în runda 3).
- **`dialog_salvare` rămâne setat** după ce fereastra se închide (`e0.json › obs_ctrlw`: la „Save your changes…” încă `"Save this file"`), iar `tip_propus` nu urmează alegerea.
- **Ținta lui Enter:** după Tab, Enter dă `tasta_enter|salvare|document|…`, deși focusul era pe `lh-ap-sus`, nu în document.

## Ce a trecut (văzut pe ecran și în `stare()`)
- **GRAV 3:** lista Font Size din referință, cu mouse-ul, cu tastatura (Alt+↓ / săgeți / Enter / Esc; Alt, H, F, S) și pe telefon; drumul `m2-l10:152`, plus „16”.
- **A1:** caseta arată PDF (mouse, tastatură, telefon); `Orar.pdf`, `nume_fisier null` = scenariul real.
- **A2:** „Documente” și antetele coloanelor sunt scrise, la 1-2 px de referință.
- **Ferestrele noi, cu tastatura:**
  - „Save your changes…”: Enter = Save (`activat fereastra:Save`), Alt+S = Save, Alt+N = Don't Save (`tasta_acces|inchidere_fara_salvare|fereastra:Don't Save`, `dialog.apasat "Don't Save"`), Esc = documentul rămâne;
  - „Save this file”: Enter, Alt+S, Esc;
  - Save As: Alt+N, Alt+T, Alt+S.
- **Închiderea și deschiderea:** Ctrl+W pe un document modificat întreabă, cu butoanele și textul din `word-ctrl-w-nesalvat`; Don't Save dă `documente_deschise 0`, titlul „Word” (= `word-ctrl-w-nu-salva`); ✕ închide Word-ul; Ctrl+O deschide `pagina_backstage "Open"` (= `word-ctrl-o`); Recent redeschide fișierul cu textul lui (clic și Alt, F, O, Y3).
- **Ctrl+S pe un document salvat:** același fișier, fără fereastră, cu rândul nou în `fisiere[].text`.
- **Regresul:** telefonul fără dubluri; cuvântul în compunere ajunge în stare înainte de `click`; titlul după salvare apare imediat; Enter = Save trece pasul asistentului.

GRAV_VECHI_DESCHISE: 1
GRAV: 7
