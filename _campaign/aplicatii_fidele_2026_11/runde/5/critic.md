# Criticul rece, runda 5, etapa B (Word): cele 7 GRAV din runda 4 + unghiul stare_finala_erori

**Cine:** critic rece, fără notele constructorului. Din `runde/5/` am citit doar `gata_pentru_critic.md`. N-am citit `diferente.md`, `raport_constructor.md`, `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`, `de_verificat.md`, `de_aprobat.md`, `STARE_ORCHESTRATOR.md`, `jurnal.jsonl`, suplimentele. N-am rulat `proba_grav.py`: concluziile vin din gesturile mele.

**Ce am rulat** (totul în `runde/5/critic_probe/`):
- Server static legat de `127.0.0.1`, port liber, servind worktree-ul; Playwright Chromium headless, cu `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost. Pagina `aplicatii/poligon.html`, apoi `LH.aplicatii.deschide('word', {continut, profil, focus:true})`, cu parametrii de conținut ai lecției m1-l03 (`nume`, `folder`, `salvat`, `modificat`, `fisiere`, `recente`).
- Gesturi reale: `page.keyboard` (Ctrl+F12, Shift+F12, Alt+litere, Alt+↓, Enter, Esc), `page.mouse` (clic, dublu clic), `page.touchscreen` și atingeri CDP pe 390 px; tastatura care compune prin CDP (`Input.imeSetComposition` / `Input.insertText`).
- După fiecare gest am citit `stare()`, ecranul (bara de adrese, panoul din stânga, rândurile listei, caseta File name, zona PDF, bara de titlu, mesajele `[data-lh-nesimulat]`), evenimentele `window.__lhAplicatieEv` și `asistent.pas()` + bulele `[data-lh-indiciu]`.
- **Word real, o singură dată, invizibil** (`com_r5.py` → `com_r5.json`): `DispatchEx`, `Visible=False`, `DisplayAlerts=0`, doar citiri de model (`Documents.Add/Open`, `Dialogs(84).Name` fără afișare, `CommandBars.GetEnabledMso`, `SaveAs2` cu nume interzise). Fișierele într-un dosar unic din %TEMP%, șters la final. Word n-a ieșit în 2 s după `Quit`, așa că am oprit DOAR PID-ul meu (`pid_inchise_fortat`); toate documentele erau deja închise, iar în `Resiliency` nu e nicio intrare cu fișierele mele. PowerPoint neatins.
- Scripturile: `h5.py` (ajutoare, refolosește `runde/4/critic_probe/h4.py`), `ref_r5.py` (referința, pe chei), `e5.py` → `re5.json` (recunoaștere), `pa5.py` → `ra5.json` (N4, T1, T2, T3), `pb5.py` → `rb5.json` (T4, T5, T6, regres, telefon), `pc5.py` → `rc5.json` (unghiul B + T6 cu pașii scenariului), `pd5.py` → `rd5.json`, `pe5.py` → `re5.json` (telefon: Open / Save As), `com_r5.py` → `com_r5.json`. Capturi `*.png`. Diff-ul: `diff_r5.txt`.

**Diff-ul rundei (necomis):** 2 fișiere, +199 / −27.
- `aplicatii/word.js`:
  - fereastra Open (`dialog.open`) prin Ctrl+F12 și File › Open › Browse: panoul din stânga cu folderele din conținut, lista fișierelor folderului (ținte `lista:<nume.ext>`), Open / dublu clic / Enter / Alt+O (`deschideDinOpen`, `umpleFolder`, `word.js:1417-1466`);
  - navigarea în stânga și în Save As; zona PDF (`dialog.FileSaveAs_pdf`) redesenată după „PDF (*.pdf)”, cu bifa și radiourile (`alegeTip`, `comutaCaseta`);
  - nume existent = mesajul central, fișierul neatins (`salveaza`, `word.js:1159-1170`);
  - F12 pe documentul salvat propune numele fișierului (`word.js:1030`); Ctrl+F12 = Open, Shift+F12 = salvare (`word.js:1892-1897`);
  - Ctrl+N și „Blank document” = document nou (`documentNou`, `word.js:1471-1476`); fără document: mesajul central în loc de tăcere (`word.js:1752`, `:1865-1868`);
  - Enter pe un rând de listă poartă `activat` (`word.js:1287-1289`); Alt+E/A/M/O apasă bife, radiouri, butoane.
- `aplicatii/aplicatii.css` (+4): butonul Open, rândul ales din panou, eticheta grupului „Optimize for:”.

---

## A. Cele 7 GRAV din runda 4

### GRAV N4 (drumurile lecției m1-l03, fereastra Open): **ÎNCHIS**
**Drumul `:240-242` (N1P6E1), 5 feluri** (`ra5.json › n4_240_*`). Pornire: `fisiere: [club-lectura în Descărcări, Popescu_Ana_7A_orar în Documente]`. Pașii: Ctrl+W (Word gol: `docs 0`, titlul „Word”), Ctrl+O, clic pe `backstage:Browse`.
- Se deschide `dialog.open`: bara „Documente”, în stânga „Acasă, Galerie, Descărcări, Documente [ales], Acest PC, Rețea”, iar în listă „Popescu_Ana_7A_orar”.
- Clic pe Descărcări: bara devine „Descărcări”, lista arată `club-lectura {lista:club-lectura.docx}`.
- Am ales fișa în 5 feluri: clic pe rând + Open, dublu clic, clic + Enter, clic + Alt+O, numele scris + Enter. Pe toate iese aceeași stare: `nume_fisier "club-lectura.docx"`, `folder_fisier "Descărcări"`, `documente_deschise 1`, titlul „club-lectura  -  Word” (pe ecran și în stare), textul fișei = ecranul.
- Evenimentele: `clic|navigare|arbore:Descărcări`, `clic|selectare|lista:club-lectura.docx`, `clic|deschidere|fereastra:Open`. Enter dă `tasta_enter|deschidere|camp:nume_fisier|fereastra:Open` (cu `activat`), Alt+O dă `tasta_acces|deschidere|fereastra:Open`.

**Drumul `:86`** (`n4_86`): pornesc cu Pop_Mihai_7A_orar salvat; Ctrl+W, Ctrl+O › Browse › Documente.
- Lista arată „Pop_Mihai_7A_orar” și „Popescu_Ana_7A_orar”. Clic pe primul, apoi Open: textul cu „Marți am sport.”, titlul „Pop_Mihai_7A_orar  -  Word”. Ctrl+W dă `docs 0`.

**Atelierul `:262-290`**, drumul soluției cu gesturi reale (`n4_atelier`): Open din Descărcări, „ Pop Mihai” la capăt, F12 › Documente › `Pop_Mihai_7A_club` › Enter, F12 › PDF › Save, Ctrl+W.
- `fisiere`: fișa colegei neschimbată, `Pop_Mihai_7A_club.docx` și `.pdf` cu „Numele meu: Pop Mihai”; la final `docs 0`, titlul „Word”. Testele `:267-270` ies corecte. (Excepție: „Enable Editing”, vezi [FARA_REFERINTA].)
- Cancel, Esc și ✕ în Open închid fereastra și te întorc în Backstage › Open, cu documentul neatins (`n4_cancel_esc`).

**Referința:** `uia_word.json › dialog.open` (titlul „Open”, `#32770`, `deschis_prin: "Ctrl+F12 … Backstage › Open › Browse"`, „Adresă: Documente”, SplitButton „Open” `Alt+o`, „Files of type” cu `*.pdf` în valoare). Fereastra există acum pe toate drumurile lecției.

(Restul, bara de adrese la a doua navigare, e o constatare nouă: GRAV S1.)

### GRAV T1 (F12 pe documentul salvat): **ÎNCHIS**
- **Drumul `:189-192`** (`t1_189`): Popescu_Ana_7A_orar salvat, cu „Marți: sport” adăugat. Ctrl+S scrie rândul în fișier. F12 arată în caseta File name **„Popescu_Ana_7A_orar.docx”**. PDF › Save dă `fisiere_salvate ["Popescu_Ana_7A_orar.docx","Popescu_Ana_7A_orar.pdf"]`, PDF-ul conține „Marți: sport”, iar documentul deschis rămâne `.docx`. Toate trei verificările lecției ies corecte.
- **Mai greu** (`t1_greu`): un document salvat de elev (F12 › „Ion_Pop_7A_tema” › Enter), modificat, apoi F12: caseta arată „Ion_Pop_7A_tema.docx”. Un document deschis din Descărcări prin Open: „club-lectura.docx”.
- Etalonul: `runde/4/critic_probe/com_f12.json` (`salvat_propus_F12` = numele fișierului) și `com_r5.json › deschis_din_descarcari_propus_F12`.

(Numele e reparat. Folderul nu: GRAV S2.)

### GRAV T2 (salvarea peste un fișier existent): **ÎNCHIS**
**Referința:** fereastra „already exists” nu există în referințe. `grep "already exists|replace it|Replace existing"` în `referinte/` găsește doar `explorer_motor/motor_explorer.py` și `verdicte_vechi.json` (simulatorul vechi). Nici `uia_word.json`, nici `scenarii_real/word-*`, nici `surse_microsoft.md` n-o au. Deci forma ei nu se poate desena, iar R12 cere mesajul central.

**Gesturile (`ra5.json › t2_167`, exercițiul `:167-172`):** F12, Ctrl+A, „Popescu_Ana_7A_orar”, Enter.
- Fișierul colegei rămâne `["Orarul meu","Luni: română, matematică, TIC"]`. Apare mesajul `[data-lh-nesimulat="Popescu_Ana_7A_orar.docx already exists"]` cu `role="status"`, iar fereastra Save As rămâne deschisă. Evenimentul: `tasta_enter|nesimulat|camp:nume_fisier|dialog_salvare:Save`.
- Al doilea Save: la fel. După ce schimb numele, se salvează un fișier nou, iar al colegei rămâne neatins.

**Variante** (`t2_variante`): litere mici, „.docx” scris, spațiu la capăt, Ctrl+S › „Save this file”, Ctrl+W › „Save your changes…” › Save, PDF peste un PDF existent. Toate: mesajul, fișierul neatins, fereastra rămâne.

Exercițiul `:167-172` și atelierul (`:268` „neschimbat”) se pot duce la capăt. Ce lipsește (gestul „Cancel” din fereastra reală) cere o captură: [FARA_REFERINTA]. Textul mesajului: MINOR.

### GRAV T3 (zona PDF a ferestrei Save As): **ÎNCHIS**
**După PDF** (`ra5.json › t3_pdf`, captura `t3_pdf.png`):
- suprafața devine `dialog.FileSaveAs_pdf`;
- se văd „Optimize for:” (cu eticheta), „Standard (publishing online and printing)”, „Minimum size (publishing online)”, „Options...” și „Open file after publishing” (debifată, ca `acoperire_r3.fapte.e_dupa_pdf.bife = 0`);
- „Save Thumbnail” a dispărut;
- focusul rămâne în caseta Save as type.

**Tastele, fiecare cu eveniment:**
- Alt+E: `tasta_acces|bifare|fereastra:Open file after publishing`;
- Alt+M / Alt+A: `alegere_optiune`, cu radioul comutat;
- Alt+O: `nesimulat` pe „Options...”, cu mesajul central.

Tastele sunt cele din `uia_word.json › dialog.FileSaveAs_pdf`: `Alt+a`, `Alt+m`, `Alt+o`, `Alt+e`.

**Restul:** clicul pe bifă și pe radio le comută; Save dă `Orar.pdf`. Înapoi la „Word Document”, fereastra se redesenează cu „Save Thumbnail”. Folderul ales înainte (Descărcări) rămâne după PDF, iar PDF-ul ajunge acolo (`t3_inapoi_docx_si_folder`).

### GRAV T4 (Ctrl+F12): **ÎNCHIS**
- Ctrl+F12 deschide `dialog.open`, titlul „Open” (`rb5.json › t4.ctrl_f12`), cu evenimentul `tasta_f12|deschidere_fereastra_open|document|`. `dialog_salvare` rămâne `null`.
- Enter cu File name gol: `fara_efect`, nu salvează nimic.
- Referința: `acoperire_r3.fapte.d_ctrl_f12.titlu = "Open"`.
- Shift+F12 deschide „Save this file” pe un document nou și salvează pe loc un document salvat. Profilul `word2007`: Ctrl+F12 dă mesajul central.

### GRAV T5 (Word fără document): **DESCHIS** (drumul lecției reparat; comenzile, nu)
**Ce s-a reparat** (`rb5.json › t5`, `t5_ctrl_n_cu_document`):
- după Ctrl+W › Don't Save (`docs 0`, „Word” pe ecran și în stare), Ctrl+N dă `document_nou`, `docs 1`, iar textul scris intră;
- File › Home › „Blank document” dă `docs 1`;
- Ctrl+W pe documentul nou modificat întreabă „Save your changes…”;
- cu un document deschis, Ctrl+N îl păstrează, iar Ctrl+W pe cel nou te întoarce la el.

Lecția `:116` merge.

**Ce rămâne (dovedit pe Word real):**
- Fără document, panglica e desenată toată activă (captura `t5_fara_doc.png`: Paste, B, I, Font Size, stilurile; plus bara de stare „Page 1 of 1 · 0 words”).
- La clic sau la tastă, biblioteca spune că în aplicația reală comanda merge:
  - `mso:Bold` dă „În aplicația reală, „Bold” funcționează; aici nu e simulată.”;
  - la fel „Font Size”, „Ctrl+B”, „F12”, „Ctrl+S”, „Ctrl+W”, „Ctrl+Z”, „Ctrl+A”, „Ctrl+P” (`t5 › tasta …`, `clic …`).
- **Word real, fără document** (`com_r5.json › activ_fara_document`): `Bold`, `Italic`, `FontSize`, `FileSave`, `FileSaveAs`, `FilePrint`, `Paste` și `FileClose` sunt `false` (dezactivate). Doar `FileNewDefault` și `FileOpen` sunt `true`.
- Etalonul, același proces cu un document deschis (`activ_cu_document`): toate `true`, în afară de Copy și Undo (nimic selectat, nimic de anulat).

**Efectul:**
- mesajul spune elevului ceva fals: că Bold, F12, Ctrl+S sau Ctrl+W „funcționează” fără document;
- comenzile gri din laborator apar active pe simulator (R4, glosarul „fidel”: aceleași elemente, în aceeași stare).

Reparația corectă: comenzile gri, fără efect. Ctrl+N, Ctrl+O, Ctrl+F12 merg deja.

**Cauza:** `word.js:1752` (`M.deschis ? apasa(…) : I.nesimulat(…)`) și `word.js:1865-1868` (`return I.nesimulat(numeTasta(e))`).

### GRAV T6 (tastatura în listele noi și asistentul): **DESCHIS** (Enter reparat; Alt+↓ nu)
**Ce s-a reparat:** Enter pe rândul marcat poartă acum `activat`.
- Font Size, pas unic `meniu:20` (`rb5.json › t6_fs_clic_caseta`, `t6_fs_keytips`): Enter dă `tasta_enter|marime_font|panglica:Home/Font/Font Size|meniu:20`, iar `pas 1` și bula dispar.
- Save as type, cu pașii `[camp:tip_fisier, meniu:PDF (*.pdf), dialog_salvare:Save]` (`t6_tip_tastatura`): Alt+T dă pas 1, Enter pe rând pas 2, Enter pas 3, fără niciun indiciu. Cu mouse-ul iese la fel.

**Ce rămâne: pașii scenariului înghețat.**
- `scenarii/word/word-font-size-lista.json › pasi` = `[meniu_derulant:Home/Font/Font Size, meniu:20]`. Asistentul primește exact acești pași (`rc5.json › t6_scenariu_*`):
  - **Cu mouse-ul:** ▾ dă pas 1, 20 dă pas 2.
  - **Cu tastatura:** clic în casetă, Alt+↓ (lista se deschide: `alt_sageti|lista_marimi|panglica:Home/Font/Font Size|`, **fără `activat`**), ↓×5, Enter. Mărimea 20 se aplică, dar **`pas` rămâne 0**, iar bula `meniu_derulant:Home/Font/Font Size` („Deschide lista”) stă pe ecran după ce lista s-a închis și treaba e gata.
- Asistentul cere deci un pas pe care elevul l-a făcut deja: o încălcare a §6.3 („niciodată pe un pas deja făcut”).
- Și pe pasul unic `meniu:20`, indiciul apare la mijlocul drumului corect, la Alt+↓ (`t6_fs_clic_caseta`: după Alt+↓, `indicii ["meniu:20"]`).

**Contractul:**
- §4: „`activat` = ținta canonică … a butonului pe care TASTA l-a apăsat fără ca butonul să fie ținta focusului”. Alt+↓ apasă ▾-ul casetei: codul citează chiar sursa, la `word.js:1839-1843` („Open the menu for the selected button. | Alt+Down arrow key”).
- În Save As, referința dă explicit butonul apăsat de Alt+↓: `dialog.FileSaveAs › ComboBox „Save as type:” › Button „Deschidere”, tasta_acces "Alt+Săgeată în jos"`. Nici acolo nu vine `activat` (`alt_sageti|meniu_tip_fisier|camp:tip_fisier|`).

**Cauza:** `word.js:1843-1844` deschid lista fără `I.activat`.

### Regresul GRAV-urilor închise înainte (`rb5.json`): **toate țin**
- **Telefonul nu dublează literele:** compunere „a/an/ana” + „ ” + „a/ar/are” dă `["Ana are"]` = ecranul (`reg_telefon_fara_dubluri`).
- **Cuvântul în compunere intră în document:** „Numele: ” + compunere „Ion”, fără confirmare, apoi atingere pe „Verifică” din afara aplicației. La `click`, starea are `["Numele: Ion"]` (`reg_telefon_compunere_verifica`).
- **Bara de titlu după salvare:** F12 › Enter și Ctrl+S › clic pe Save. Pe ecran, imediat, „Marin_Ioana_7B_poezie  -  Word” (`reg_titlu_dupa_salvare`).
- **Enter în File name = Save, iar asistentul trece:** pe F12 și pe Ctrl+S, `pas 1`, cu `activat dialog_salvare:Save` (`reg_enter_save_asistent`).
- **Lista Font Size (GRAV 3):** 16 rânduri, ales „11”; ▾ › 20 dă „are@20” (`reg_font_size_lista`).
- **Save as type după PDF (A1)** și **textele Save As (A2):** lista are 17 rânduri; caseta și `tip_salvare_afisat` arată „PDF (*.pdf)”; Save dă `Orar.pdf` cu `nume_fisier null`. „Documente”, „Nume”, „Data modificării”, „Tip”, „Dimensiune” sunt scrise pe ecran (`reg_a1_a2`).
- **„Save your changes to this file?”:** la Ctrl+W și la ✕ cu modificări apar butoanele `["More options…","Save","Don't Save","Cancel"]`; Cancel te întoarce în document (`reg_intrebari`). **„Save this file”** apare la Ctrl+S pe un document nou (`ctrl_s_nou`).

---

## B. Unghiul stare_finala_erori: constatări noi (de la cea mai puternică)

### GRAV S1: bara de adrese rămâne pe primul folder ales. După a doua navigare, ecranul arată alt folder decât cel în care se salvează sau din care se deschide
**Save As** (`rc5.json › b1_saveas_adresa`, captura `b1_saveas_desktop.png`):
- F12, clic pe Descărcări: bara arată „Descărcări”.
- Clic pe Desktop: în stânga e ales „Desktop”, dar **bara arată tot „Descărcări”**.
- Enter salvează `Desktop/Pop_Mihai_7A_lucrare.docx` (`folder_fisier "Desktop"`).

Elevul vede „Descărcări” deasupra și își caută apoi fișierul acolo.

**Open** (`b1_open_adresa`): Descărcări › Documente › Desktop › Descărcări. Bara arată „Descărcări” la toți cei patru pași, deși lista arată pe rând fișierele din Documente („Popescu_Ana_7A_orar”) și din Desktop („tema”).

**Referința:** bara de adrese arată folderul ferestrei:
- `uia_word.json › dialog.FileSaveAs / dialog.open › ToolBar „Adresă: Documente”`;
- `acoperire_r3.fapte.e_bara_adrese = "Adresă: Documente"`;
- chiar codul folosește bara ca folder al ferestrei (`folderAdresa`, `word.js:1127-1131`).

Contractul: „ecranul = starea” (§3, O4) și glosarul „fidel”. Lecția: `m1-l03:82` („În stânga alege Documente”). Un elev care greșește întâi folderul, apoi îl corectează (revenirea după greșeală), primește pe ecran un folder fals.

**Cauza:** `word.js:1444`: bara e căutată după eticheta din referință (`=== f0`, adică „Documente”). După prima navigare, eticheta ei devine noul folder și nu mai e găsită; `:1445` nu mai schimbă nimic.

### GRAV S2: F12 pe un document deschis din alt folder deschide Save As în „Documente”; Word real îl deschide în folderul documentului
**Gesturile (`ra5.json › n4_atelier.f12_initial`, `t1_greu.deschis_din_descarcari_f12`):**
- club-lectura deschis din Descărcări (`folder_fisier "Descărcări"`), apoi F12.
- Bara arată „Documente”, în stânga e ales „Documente”, iar Save salvează în Documente.

**Word real (`com_r5.json`):**
- `deschis_din_descarcari_propus_F12` = `%TEMP%\critic_r5_…\Descarcari\club-lectura.docx`, la fel după o modificare;
- etalonul `runde/4/critic_probe/com_f12.json › salvat_propus_F12` = calea folderului documentului.

Limita probei: e înregistrarea ferestrei citită prin COM, nu fereastra desenată. Pe documentul nou însă coincide cu referința (doar numele, folderul implicit „Documente”).

**Lecția:**
- atelierul `:267` („numele fișierului: Pop_Mihai_7A_club, în Documente”);
- `:273` („F12 › Documente › File name”).

Pe simulator, elevul care sare peste „Documente” trece verificarea `fisier:{folder:'doc',…}`. În laborator, același gest salvează fișa în Descărcări. Elevul învață că F12 duce mereu în Documente.

**Cauza:** `word.js:1024`, `folder: folderAdresa(…)`, adică întotdeauna folderul din referință, fără `M.folder` pe documentul salvat.

### GRAV S3: un nume cu semne interzise se salvează. Simulatorul face un fișier care pe Windows nu poate exista și contrazice lecția
**Gesturile (`rc5.json › b5_nume_invalid`):** F12, Ctrl+A, apoi pe rând „Pop_Mihai:7A”, „Pop?Mihai”, „Pop*Mihai”, „Pop"Mihai”, apoi Enter.
- Toate se salvează: `fisiere` conține `Documente/Pop?Mihai.docx`, iar titlul e „Pop?Mihai  -  Word”.
- Nu apare niciun mesaj; evenimentul e `tasta_enter|salvare|…`.

**Word real (`com_r5.json › nume_interzise`):**
- `SaveAs2` refuză toate patru: „This is not a valid file name.” (pentru `"`: „Command failed”);
- Windows: `os.open` dă `OSError 22 Invalid argument` pentru `?`, `*`, `"`.

**Lecția:** `m1-l03:156`: „Windows nu primește în nume semnele \ / : * ? " < > |.”

Elevul care încearcă regula pe simulator vede contrariul. Starea finală (`fisiere`, titlul) e imposibilă. Fereastra reală de eroare nu e în referință, dar R12 cere măcar mesajul central în loc de o salvare tăcută.

**Cauza:** `word.js:1169`: numele primește doar „.docx”; semnele nu sunt verificate nicăieri în `salveaza`.

### GRAV S4: același fișier deschis a doua oară devine al doilea document; Ctrl+W de la capătul atelierului lasă Word cu un document
**Gesturile (`rd5.json › deja_deschis_nemodificat`):**
- Pornesc din Word fără document. Ctrl+F12 › Descărcări › dublu clic pe club-lectura: `docs 1`.
- Elevul crede că nu s-a deschis și repetă gestul: **`docs 2`**, cu același titlu.
- Scrie „ Pop Mihai”, salvează ca Pop_Mihai_7A_club, apoi Ctrl+W: rămâne `docs 1`, cu titlul „club-lectura  -  Word”.

Verificarea atelierului `m1-l03:270` (`docuri:0`, „Documentul e închis, iar Word a rămas deschis”) pică. Cu un document modificat (`rc5.json › b4_deja_deschis`) apare peste el versiunea de pe disc, fără rândul nou, iar munca elevului stă ascunsă dedesubt.

**Word real (`com_r5.json › deschis_iar`):** `Documents.Open` pe fișierul deschis întoarce același document: `documente_inainte 1`, `documente_dupa 1`, `acelasi_document true`.

`documente_deschise` e cheie din §5. Pe gesturi care în Word real dau 0 documente, simulatorul dă 1, deci lecția îl pică pe nedrept.

**Cauza:** `word.js:1412`: `deschideFisier` pune documentul curent deoparte și încarcă iar fișierul, fără să verifice dacă e deja deschis.

### GRAV S5: lista ferestrei Save As e goală deși folderul are fișiere; fișierul colegei nu se vede
**Gesturile (`rc5.json › b2_saveas_lista`, capturile `b2_saveas_lista.png`, `b1_saveas_desktop.png`):**
- `stare().fisiere` are în Documente `Popescu_Ana_7A_orar.docx` și `Pop_Mihai_7A_compunere.docx`.
- În Save As, lista arată 8 rânduri **fără text** (`fereastra:[element de listă, nesalvat]`).
- Clicul pe un rând dă „În aplicația reală, „[element de listă, nesalvat]” funcționează; aici nu e simulată.”
- Fereastra Open, din aceeași rundă, umple aceeași listă cu fișierele folderului (`n4_86`).

**Referința:** `uia_word.json › dialog.FileSaveAs › List „Vizualizare elemente”` are 8 `ListItem` (`id_win32` 0-7, numele redactate). Lista reală arată elementele folderului, la fel ca în `dialog.open`.

**Lecția:**
- `:172`: „la File name scrie Pop_Mihai_7A_orar (**nu da clic pe fișierul colegei**)”;
- greșeala tipică `:171`: `tipic:[{saveas:{…nume:'Popescu_Ana_7A_orar',inlocuieste:true}}]`.

Pe simulator, elevul nu vede fișierul colegei și nu poate face greșeala de care îl ferește lecția. După mesajul „already exists” (T2) nu vede nici care fișier există.

**Cauza:** `word.js:1453`: `umpleFolder` se oprește pentru orice fereastră care nu e Open.

### GRAV S6: Ctrl+N și „Blank document” dau mereu „Document1”; Ctrl+N pare că șterge documentul elevului
**Gesturile:**
- `rc5.json › b8_ctrl_n`: „Excursie la Bicaz” (titlul „Document1  -  Word”), apoi Ctrl+N. Pagina e goală, **titlul rămâne „Document1  -  Word”**, iar `docs 2`. Nu există nicio țintă de comutare între ferestre (`tinte_comutare []`).
- `rb5.json › t5_ctrl_n_cu_document`: încă un Ctrl+N dă `docs 3`, tot „Document1”.
- F12 pe documentul nou, gol, propune „Document1.docx”.

**Word real (`com_r5.json`):**
- `nou1_nume "Document1"`, `nou2_nume "Document2"`, `nou3_dupa_inchiderea_tuturor_nume "Document3"`;
- Save As pe documentul gol propune `"Doc1.docx"` / `"Doc2.docx"` (`nou1_gol_propus_F12`, `nou2_gol_propus_F12`).

**Efectul:** pe simulator, Ctrl+N golește pagina sub același titlu, iar elevul crede că și-a pierdut textul. În laborator apare „Document2 - Word”. `titlu_fereastra` (§5) și numele propus diferă de Word-ul real. Lecția `:116` predă Ctrl+N.

**Cauza:** `word.js:1474` (`nume: 'Document1'`) și `word.js:1030` (`faraExt(M.nume)` pentru documentul gol).

---

## [FARA_REFERINTA] (nu le număr GRAV)
- **Fereastra „already exists” / „You already have a file named…”** (`m1-l03:157-159`, `:82`, `:85`): nu e în nicio referință (vezi T2). Mesajul central lasă lecția să se termine, dar gestul ei („Cancel” în fereastra aceea) nu se poate exersa.
  - Ce ar lămuri: o captură UI Automation a ferestrei, pe un fișier de probă în %TEMP%.
- **Vizualizarea protejată și „Enable Editing”** (`m1-l03:243` `pv:false`, `:266` `jurnal:{op:'enable'}`):
  - nici `uia_word.json`, nici biblioteca n-au bara galbenă; `fisiere[]` nu primește `web`;
  - la mutarea lecției (etapa C), testul „Ai apăsat Enable Editing” din atelier n-ar avea cum să iasă.
  - Ce ar lămuri: o captură a barei (fișier cu marcajul de internet, în %TEMP%), înainte de etapa C.
- **Radiourile „Optimize for:”** pornesc amândouă goale (`t3_pdf.png`). Referința n-are starea lor (`dialog.FileSaveAs_pdf`: RadioButton fără `bifat`). În Word, „Standard” e de obicei ales.
- **„Open file after publishing” bifată:** nu se întâmplă nimic după Save, iar bifa nu e în `stare()`. Referința nu spune ce se deschide (lecția `:85`: „Dacă PDF-ul se deschide într-un alt program…”).
- **F12 › Enter pe propriul nume** al documentului salvat dă mesajul „already exists” (`t2_variante.f12_enter_propriul_nume`). Nu știu ce face Word real pe fișierul deschis chiar de el; COM nu arată ferestrele.
- **Fișierul deja deschis ȘI modificat, redeschis:** Word real poate întreba. Am probat doar cazul nemodificat (GRAV S4).
- **Panoul din stânga:** referința `dialog.open` are doar „Desktop” (`acoperire_r3.fapte.nav_dialog.open.implicite`). Simulatorul arată „Acasă, Galerie, Acest PC, Rețea” + folderele din conținut. Ordinea și locul nu sunt în referință.
- **Bara de stare fără document** („Page 1 of 1 · 0 words”, `t5_fara_doc.png`): nu există captură a Word-ului gol.
- **Cancel după PDF:** `tip_salvare_afisat` rămâne „PDF (*.pdf)”, iar F12 iar arată „Word Document (*.docx)” (`b7_cancel_pdf`). Referința nu spune ce ține minte fereastra.
- **Numele scris greșit în Open** („club-lectur”, fișierul din alt folder, un PDF): mesajul central (`b3_open_greseli`). Fereastra Windows de „fișier negăsit” și conversia PDF nu sunt în referință, deci mesajul e ce cere R12.

## MINOR
- **Textul mesajului central pe ceva care nu e comandă:** „În aplicația reală, „Popescu_Ana_7A_orar.docx already exists” funcționează; aici nu e simulată.” și „În aplicația reală, „club-lectur” funcționează…”. Șablonul de la `aplicatii.js:223` pus pe un nume de fișier spune altceva decât s-a întâmplat.
- **Mesajul rămâne câteva secunde după ce situația s-a rezolvat:** după salvarea reușită cu alt nume, „already exists” e încă pe ecran (`b6_mesaj_ramas.dupa_save_reusit`); dispare în cel mult 6 s. La fel „Options...” după Save în PDF.
- **Asistentul trece pasul `dialog_salvare:Save` și când salvarea a fost refuzată** (Enter pe numele colegei: `tasta_enter|nesimulat|…|dialog_salvare:Save`). §6.3 se uită la gest, nu la rezultat, deci verificarea rămâne pe stare (§5).
- **Esc în Open:** `tasta_esc|anulare|camp:nume_fisier|`, fără `activat` (Cancel), ca în runda 4.
- **Telefonul (390 px):** Open și Save As sunt mai late decât ecranul. Butoanele Open și Save (x = 558, 750) se ating abia după una-două trageri cu degetul; stratul ferestrei se derulează (`re5.json`: `sw=795 / 960`, `cw=388`). Drumul `:240` merge până la capăt după o tragere.

## Ce a trecut (văzut pe ecran și în `stare()`)
- **N4:**
  - drumul `:240` pe 5 feluri (clic + Open, dublu clic, Enter, Alt+O, nume scris);
  - drumul `:86`;
  - atelierul `:262-290` pe drumul soluției;
  - Cancel, Esc, ✕ în Open;
  - „Documente” se poate alege în stânga, în Save As și în Open.
- **T1:** numele fișierului pe F12, pe document salvat de lecție, salvat de elev, deschis din alt folder; `:189-192` complet.
- **T2:** nicio înlocuire tăcută, pe 8 variante (F12, Ctrl+S, Ctrl+W › Save, PDF, litere mici, `.docx` scris, spațiu); fișierul colegei neatins; lecția se termină.
- **T3:** zona PDF din referință, tastele ei cu evenimente, bifa și radiourile; folderul ales păstrat după PDF.
- **T4:** Ctrl+F12 = Open; Shift+F12 = salvare.
- **T5, partea de lecție:** Ctrl+N, „Blank document”, Ctrl+N cu document deschis, întoarcerea cu Ctrl+W.
- **T6, partea Enter:** `activat` pe Enter în Font Size și Save as type; Save as type cu tastatura trece toți cei 3 pași fără indiciu.
- **Regresul:** telefon fără dubluri, compunerea ajunsă în stare înainte de `click`, titlul după salvare, Enter = Save + asistentul, Font Size, Save as type (PDF), textele Save As, „Save your changes…” (Ctrl+W și ✕), „Save this file”.

GRAV_VECHI_DESCHISE: 2
GRAV: 8
