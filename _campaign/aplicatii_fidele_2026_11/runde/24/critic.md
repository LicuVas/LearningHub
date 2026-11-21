# Criticul rece, runda 24 (Word + asistentul comun, valul B-word#2): GRAV vechi + unghiul ASPECT

**Cine:** critic rece. Din `runde/24/` am citit:
- `critic_prompt.md`, `gata_pentru_critic.md`, `raport_constructor.md` (de judecat, nu de crezut);
- `diff_word.txt` și `supliment_B_word_runda24.md`;
- modelul și constatările vechi din `runde/20/critic.md`;
- regulile din `runde/_paralel/REGULI_CRITIC.md`.

N-am rulat `proba_grav.py` al constructorului, nici `masoara.py` / `porti.py`. Concluziile vin din gesturile mele.

**Ce am rulat** (totul în `runde/24/critic_probe/`, ieșirile în `critic_probe/iesiri/`):
- **Mediul de probă:**
  - server static legat de `127.0.0.1`, port 0, care servește worktree-ul (`hc24.py` = ajutoarele critic 20);
  - Playwright Chromium headless, `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost;
  - poligonul `aplicatii/poligon.html`, cu `LH.aplicatii.deschide(...)`.
- **Gesturile:** `page.keyboard`, `page.mouse`, `page.touchscreen.tap` și glisări de deget reale prin CDP `Input.dispatchTouchEvent` (telefon).
- **Word real NU l-am pornit.** Nu era nevoie: referința de aspect e `referinte/uia_word.json`, citită doar prin Python, pe chei (`ref24.py` → `iesiri/ref_*.txt`). Nimic pe ecranul omului.
- **Versiunile vechi ale bibliotecii**, ca să despart regresul de ce e vechi: punctele de control `59af7e74` (ciclul A) și `b63df73e` (ciclul B).
  - Extrase read-only cu `git archive` în %TEMP%;
  - fără git care scrie.
- **Scripturile:**

  | script | ieșirea | ce măsoară |
  |---|---|---|
  | `p24a_aspect.py` | `a_aspect.json` | toate nodurile față de referință, nu doar grupurile |
  | `p24b_ecrane.py` | `b_ecrane.json` | 5 ecrane |
  | `p24c_telefon.py` | `c_telefon.json` | drumul PDF doar cu degetul |
  | `p24d_laptop.py` | `d_laptop.json` | fereastra Word la 125 %, acum / A / B |
  | `p24e_asistent.py` | `e_asistent.json` | K1 + asistentul |
  | `p24f_excel.py` | `f_excel.json` | Excel |
  | `p24g_fonturi.py` | `g_fonturi.json` | fonturile + pictogramele lipsă |
  | `p24h_minor.py` | `h_minor.json` | MINOR-urile constructorului |
  | `p24i_r241.py` | `i_r241.json` | R24-1 |
  | `p24j_tabla.py` | `j_tabla.json` | tabla, acum / A / B |
  | `regres20/p20d.py` | `regres20/rd20.json` | regresul critic 20, rulat pe codul de azi |
  | O4 direct, cu `LH_IESIRE=critic_probe/iesiri/O4w` | | scenariile `word-*` |

**Starea codului comun:** la 03:53, `git diff HEAD -- aplicatii/` e gol. Schimbările benzilor r23-r26 sunt în punctul de control `b5549790` (03:39) al orchestratorului. Nicio eroare de pagină în nicio probă (`erori: []` peste tot).

---

## A. GRAV-urile vechi

### GRAV K1 (Tab / Shift+Tab scot focusul din ferestrele modale; drumul PDF cu tastele): **rămâne ÎNCHIS**

Proba: `e_asistent.json`.
- **A1, ocolul Tab:** 15 × Tab + 8 × Shift+Tab în Save As, Save As (PDF), Open, „Save this file” și „Save your changes…”, cu focusul citit după fiecare tastă.
  - Ieșiri din fereastră: 0. Opriri fără contur de focus: 0. Opriri în afara ecranului: 0.
  - Ordinea din Save As e aceeași ca în critic 20: Save as type › Autori › Etichete › Titlu › Save Thumbnail › Hide Folders › Tools › Save › Cancel › Până la „Desktop”.
- **A2, gestul criticului 16** (F12, Ctrl+A, „Pop_Mihai_7A_orar”, Tab, Alt+↓, ↓×6, Enter, Enter):
  - se scrie doar `Documente/Pop_Mihai_7A_orar.pdf`, cu „Orarul meu / Marți: sport”;
  - niciun `.docx`, niciun rând gol; documentul rămâne „Document1  -  Word”.
- **A3, lecția `m1-l03:189-192` doar cu tastele** (Ctrl+S, F12, Tab, Alt+↓, ↓×6, Enter, Enter):
  - `.docx` și `.pdf` cu „Marți: sport”;
  - documentul activ rămâne `Popescu_Ana_7A_orar` (titlul „Popescu_Ana_7A_orar  -  Word”).

### Asistentul schimbat (`aplicatii.js` › `L.asistent`, `doarFocus`): **ce cere sarcina, ține**

- **A4, drumul PDF cu tastele**, pașii `[meniu:PDF (*.pdf), dialog_salvare:Save]`, `dupaGreseli: 2`:
  - Tab → `tasta_tab|mutare_focus|camp:nume_fisier`: `pas 0`, nicio bulă.
  - Alt+↓, ↓×6: nicio bulă. Enter → `meniu:PDF (*.pdf)`: `pas 1`.
  - 9 × Tab până pe Save: nicio bulă.
  - **Tab peste Save** → `tasta_tab|mutare_focus|dialog_salvare:Save`: `pas` rămâne **1**. Nimic scris, fereastra `FileSaveAs_pdf` rămâne deschisă. Încă 5 × Tab: tot `pas 1`, fără bulă.
  - 6 × Shift+Tab înapoi pe Save, apoi Enter → `tasta_enter|salvare_pdf|dialog_salvare:Save`: `pas 2`, `Orarul meu.pdf` scris.
  - Deci bula nu mai vine după pași buni, iar Save se bifează abia la salvarea adevărată.
- **A5, Tab până la Cancel + Enter:** `anulare|dialog_salvare:Cancel`, `pas 0`, nimic salvat.
- **PowerPoint** (`C_powerpoint_tab_in_save_as`):
  - F12, apoi 14 × Tab: 0 ieșiri, `pas 0`, fără bulă;
  - Tab peste Save: `pas 0`;
  - Shift+Tab înapoi + Enter → `tasta_enter|salvare|dialog_salvare:Save`, `pas 1`.
- **A6 / C, greșeala adevărată** (2 clicuri într-un loc gol al zonei de lucru, ca în O9) cheamă indiciul după a doua, pe toate cele 5 aplicații:

  | aplicația | țintă | greșelile | după 1 | după 2 |
  |---|---|---|---|---|
  | Word | `mso:Bold` | `clic\|pozitionare\|document` ×2 | fără bulă | bula pe `mso:Bold` |
  | Excel | `mso:Bold` | `clic\|selectare_celula\|celula:F2`, `celula:R2` (Excel n-are loc gol fără țintă) | fără bulă | bula |
  | PowerPoint | `mso:Bold` | clic în gol | fără bulă | bula |
  | Explorer | `bara_comenzi:Nou` | clic în gol | fără bulă | bula |
  | Windows | `bara_activitati:Start` | clic în gol | fără bulă | bula |

- **Ce n-a schimbat runda** (le trec la MINOR, pentru orchestrator; nu erau în ținta ei):
  - **Save se bifează și la salvarea refuzată.** Asta e MINOR-ul vechi, pe care constructorul îl recunoaște în NEFĂCUT. Am găsit că îl are și al doilea drum de refuz din lecție (`m1-l03:157`), nu doar numele interzis:
    - nume interzis + Enter: `pas 1`, nimic scris;
    - **nume care există („already exists”) + clic pe Save** → `clic|nesimulat|dialog_salvare:Save`: `pas 1`, nimic scris.
    - Ambele respectă litera §6.3 („făcut când vine un eveniment cu `tinta` = ținta pasului”). E o lipsă a specificației, nu o abatere de la ea.
  - **Alt+↓ (deschiderea listei Save as type) e încă greșeală** (`alt_sageti|meniu_tip_fisier|…|fereastra:Deschidere`).
    - Pe drumul drept rămâne una singură, sub prag.
    - Dacă elevul deschide lista, o închide cu Esc și o redeschide, bula vine deși el merge bine. Critic 20 o număra lângă Tab.

**A: K1 ÎNCHIS, asistentul face ce spune constructorul. GRAV vechi deschise: 0.**

---

## B. Unghiul ASPECT: constatări noi

**Pe scurt: niciun GRAV nou.**
- La 1366×768, Word e la ±2 px față de `uia_word.json` pe aproape tot ce are dreptunghi.
- Pe laptop, telefon și tablă, drumurile lecției se duc la capăt.
- Ce e vizibil altfel decât Word real n-are captură la acele ecrane, deci merge la [FARA_REFERINTA] (D). Ce nu blochează merge la MINOR.

### B1. 1366×768, factor 1,0: TOATE nodurile, nu doar grupurile (`p24a_aspect.py` → `a_aspect.json`)

Cum am măsurat, diferit de proba constructorului:
- `p24_aspect.py` al constructorului compară la panglică doar `Group`, cu potrivirea „primul liber”.
- Eu am comparat fiecare nod cu dreptunghi (Button, SplitButton, ComboBox, Edit, MenuItem, Spinner, Text…), cu potrivirea tip + etichetă, iar între omonime cel mai apropiat.
- Am căutat și invers: nodurile simulatorului fără pereche în referință.

| suprafața | noduri în ref. | potrivite | > 2 px | lipsă în simulator (de ce) |
|---|---|---|---|---|
| bara de titlu | 7 | 7 | 0 | — |
| rândul filelor (cu File Tab, Ribbon Display Options) | 14 | 14 | 0 | — |
| bara de stare | 19 | 18 | 0 | „Word Count 0 words” (simulatorul are „3 words”: conținutul) |
| panglica Home | 81 | 80 | **4** | `DataGrid Styles` [726,93,324,336]: simulatorul are `Pane Styles` [727,95,326,56]; înălțimea din referință e a galeriei derulate (UIA), nu se vede |
| panglica Insert | 48 | 48 | 0 | — |
| panglica Layout | 37 | 37 | 0 | — |
| panglica View | 37 | 37 | 0 | — |
| Backstage: cadrul / navigarea | 21 / 15 | 21 / 15 | 0 / 0 | — |
| Backstage Home / Open / Info / Save As / Export | 30 / 35 / 53 / 19 / 15 | 23 / 33 / 51 / 17 / 15 | 0 / 2 / 0 / 3 / 0 | rândurile redactate din referință (`[redactat: fișier]` ×7, `[redactat: e-mail]`, `[redactat: nume]`) |
| Save As / Save As (PDF) / Open | 92 / 97 / 79 | 84 / 89 / 71 | 0 / 0 / 0 | 8 × `[element de listă, nesalvat]` (fișierele personale din referință) |
| „Save this file” / „Save your changes…” | 15 / 16 | 15 / 16 | 0 / 0 | — |

**Cele 4 depășiri de pe Home** (MINOR, vezi D):
- `Edit Font` [106,93] → [109,96], `Button Open` [216,92] → [219,95];
- `Edit Font Size` [233,93] → [236,96], `Button Open` [261,92] → [264,95];
- adică +3 / +3 px, în timp ce caseta din jur (`ComboBox`) e la ±1.

**Celelalte „> 2 px” din Backstage nu sunt abateri.** Sunt grupuri fără nume, potrivite greșit, pentru că rândul contului OneDrive e redactat în referință, iar simulatorul îi lasă locul gol. „Recent”, „Share”, „Copy Link”, „This PC”, „Add a Place”, „Browse” stau toate la ±2 px.

**Colțurile ferestrelor:**
- Save As: [1,1,960,566] față de referința [-27,-3,960,566]. Referința e trasă în afara ecranului; simulatorul o ține în ecran, deci nodurile se compară față de colțul ferestrei.
- PDF / Open: [2,2] față de [1,1]. „Save this file” / „Save your changes…”: [454,228] față de [453,227].
- Toată fereastra Word e +1 px față de referință (bara de titlu [2,2] față de [1,1]), în toleranță.

**Afirmația constructorului** („5 ferestre și 4 file la ±2 px”) **ține pentru grupuri și ferestre.** Pe controale, panglica Home are 4 noduri la +3 px (MINOR).

### B2. Fonturile și pictogramele (`p24g_fonturi.py` → `g_fonturi.json`)

**Fonturile:**
- Segoe UI e disponibil și folosit peste tot.
- Panglica: Segoe UI 12 px, filele 13 px, galeria de stiluri Calibri 15 px.
- Ferestrele de fișiere: Segoe UI **11 px** (`.lh-ap-sup-dialog`). Ferestrele Windows folosesc 9 pt = 12 px la 96 DPI, dar referința n-are fonturi: [FARA_REFERINTA].

**Pictogramele lipsă** (pătratul gol `.lh-ap-gol` sau doar text), pe filele din lecții:

| unde | ce lipsește |
|---|---|
| Layout › Paragraph | săgețile More / Less ale celor 4 casete (8 pătrate goale); lipsesc și etichetele „Indent / Left / Right / Spacing / Before / After” (referința lasă locul lor: casetele încep la x 430, grupul la 363) |
| Insert › Text | Quick Parts, WordArt, Drop Cap, Signature Line, Date & Time, Object |
| View | Read Mode, Focus, Immersive Reader, Side to Side, Outline, Draft, Multiple Pages, Split… sunt doar text |
| Save As / Open | Înapoi, Înainte, Locații recente, Reîmprospătare, Ajutor, butoanele de vizualizare |

UIA nu capturează imagini sau etichete statice, deci toate acestea merg la [FARA_REFERINTA]. Captura de propus e în D.

### B3. Laptopul la 125 % (1093×526 css, factor 1,25)

**Fereastra Word însăși** (`d_laptop.json`, captura `b_laptop_word_1x.png`):
- Bara de sus și panglica sunt desenate pe 1366 px în rădăcina de 1093 px.
- În afara ecranului, până derulezi lateral: ✕ / Minimize / Maximize, Share, grupul Editing, Add-ins, Ribbon Display Options. La fel butoanele de vedere și zoom-ul din bara de stare.
- Rotița (Shift sau orizontală) derulează `.lh-ap-sus` (`overflow-x:auto`, `aplicatii.css:15`). ✕ ajunge la x 1043, iar clicul pe el deschide „Save your changes…”. Deci drumul lecției `m1-l03:296-300` se face.
- **E vechi:** la fel în punctele de control ciclul A și ciclul B. Word real se adaptează la lățimea ferestrei, dar n-avem captură la 1093 px: [FARA_REFERINTA].

**Backstage:** File › Close / Account / Options sunt sub margine. Rotița derulează navigarea (Close ajunge la y 29).

**Ferestrele** (`b_ecrane.json`, `regres20/rd20.json › C2`):
- Micșorarea din r24 lucrează:
  - Save As: `scale(0,9258)` → [1,1,889,524], Save [694,480,81,24] și Cancel în ecran, atinse în centru;
  - Save As (PDF): `scale(0,852)` → Save [640,483,75,22].
- Drumul PDF cu mouse-ul, fără derulare, scrie `Orarul meu.pdf`. Rândul PDF din lista deschisă e la y 202, în ecran.
- Open, „Save this file”, „Save your changes…” încap fără micșorare.
- MINOR-ul vechi al ferestrei mici e **reparat**.
- **Două urmări noi, vizuale (MINOR, D):**
  - lista Save as type NU e micșorată odată cu fereastra: 814 px față de caseta de 755 px, iese cu 59 px dincolo de marginea ferestrei (889), cu litere mai mari decât fereastra;
  - textul ferestrei PDF ajunge la ~9,4 px css.

**Fereastra 900×500** (mai îngustă decât Save As, deci fără micșorare; `h_minor.json › MN3`): 8 × Tab pe Save îl aduce din [750,518] la [738,469], în ecran și cu contur, iar Enter salvează. `aduInVedere` lucrează.

### B4. Telefonul (390×844 și 360×740, factor 3, doar degetul; `p24c_telefon.py` → `c_telefon.json`)

Drumul lecției spre PDF, doar cu atingeri și glisări reale (fără `scrollIntoView`):
- File › Save As › Browse;
- Save as type (atins pe partea vizibilă) › PDF (lista se deschide deasupra casetei);
- două glisări spre stânga pe stratul ferestrei (`scrollLeft` 0 → 295 → 572);
- Save → `clic|salvare_pdf|dialog_salvare:Save`, `Orarul meu.pdf`.

La fel la 360 px. Fereastra are 960 px și nu se micșorează pe telefon (cum spune constructorul). Stratul se derulează la deget.

**Zonele de atins din ferestre sunt sub 32 px:** rândul PDF 16, File name 18, Save as type 22, Save / Cancel 26. E vechi, iar criticii 6, 11 și 21 l-au trecut MINOR (D).

### B5. Tabla SMART (1920×1080; `j_tabla.json`, captura `h_tabla_mic.png`)

**Ferestrele de fișiere:** Save As [1,1,960,566], neschimbată; drumul PDF scrie `.pdf`.

**Fereastra Word:** rădăcina are 1920×768, dar bara de titlu, rândul filelor, panglica și bara de stare rămân late de 1364 px.
- ✕ stă la x 1318-1366, la 554 px de marginea din dreapta a ferestrei. Bara de stare se termină la 1366, iar zona documentului are 1901 px.
- **E vechi:** identic în ciclurile A și B.
- În referință (1366), ✕ și barele ating marginea dreaptă a ferestrei, dar o singură lățime nu dovedește ancorarea: [FARA_REFERINTA]. Drumul „✕, sus în dreapta” (`m1-l03:281`, `:298`) se face: ✕ e vizibil, doar nu în colț.

### B6. MINOR-urile făcute de constructor (`p24h_minor.py` → `h_minor.json`): adevărate

**Alt+F4:**

| unde | evenimentul | efectul |
|---|---|---|
| Save As | `tasta_f4\|anulare\|…\|dialog_salvare:Cancel` | nimic scris; Ctrl+S → „Save this file” |
| Open | `anulare` | se închide |
| „Save your changes…” | `anulare` | documentul rămâne, `apasat: "Cancel"` |
| cu lista Save as type deschisă | `anulare` | se închid lista și fereastra |

**Mesajul de eroare:**
- „Windows nu primește…”, apoi un nume corect: la 0,3 s `msg: []`, `Pop_Mihai.docx` scris.
- „… already exists”, apoi End, „2”: la 0,3 s `msg: []`, `Popescu_Ana_7A_orar2.docx`.
- Mesajul de la Tools rămâne.

**1366×768:** dreptunghiurile au rămas ale referinței (B1). Alt+F4 pe DOCUMENT (fără fereastră) tace: vezi D.

---

## C. Regresul

### C1. Cele 8 închise în r16 și K1, pe eșantion

Le-am verificat cu proba critic 20 `p20d.py`, copiată în `critic_probe/regres20/` și rulată pe codul de azi (→ `rd20.json`, `rd20_rezumat.txt`). **Toate țin:**
- **S1:** bara, panoul și lista urmează folderul: Descărcări › Desktop › Documente.
- **S2 + S4:** `docs 2`, „club-lectura  -  Word”, F12 → Descărcări / „club-lectura.docx”.
- **S5:** lista Documente.
- **S6:** „Document2  -  Word”, `docs 2`.
- **T5:** fără document, F12 = `indisponibil`, Bold gri.
- **T6:** Alt+↓ în Font Size → `pas 1`, apoi 20 → `pas 2`.
- **T1 `:189-192` cu mouse-ul:** `.docx` + `.pdf` cu „Marți: sport”.
- **K1:** A de mai sus.
- **Fereastra mică:**
  - C2: Save / Cancel acum la y 480-504, în ecran; Tab pe Save, cu contur;
  - drumul PDF cu tastele scrie `.pdf`.
- **Telefonul:** C3, cele 2 drumuri, plus PDF-ul cu atingeri.
- **Mesajul central:** C4. Tools, Alt+P (Open) și F5 dau `nesimulat`, mesajul e vizibil până la 4,7 s, apoi pleacă.

### C2. Scenariile `word-*` (O4)

Rulate de mine direct: `LH_IESIRE=critic_probe/iesiri/O4w`, `oracol_comportament.py --scenarii scenarii/word`.
- Rezultatul: **13**, adică 54/64 la fel ca realul, 2 diferențe în 1 scenariu, 2 neexecutabile, 8 fără real probat.
- `iesiri/O4w/rele.txt` = `runde/24/probe_iesiri/O4w_dupa/rele.txt` (`diff` gol). Niciun scenariu de fișiere, închidere sau Ctrl+Z nu e printre ele.

**Am judecat cele două afirmații ale constructorului:**
- **R24-1, `word-clic-pune-cursorul`** (`p24i_r241.py` → `i_r241.json`): adevărată.
  - Pe „Ana are mere multe”, „mere” are [421,22; 31,23] px, iar „e”-ul din el are centrul la x 436,58.
  - Clicul la `x + floor(w)//2` (cum dă clic hamul real, `ruleaza_real.py:596-604`) cade la 436,22 → `selectie 9` = realul.
  - Clicul la `x + w/2` (O4, `oracol_comportament.py:189`) cade la 436,84 → 10.
  - ±0,5 px față de centru dă 9 / 10. Ambele aplicații pun cursorul la granița cea mai apropiată; diferența vine din ham, nu din Word.
- **R24-2, `word-imagine-inserare`:** adevărată.
  - În `uia_word.json › panglica.TabInsert`, Pictures e `MenuItem` cu `FlyoutAnchorInsertPictures` [199,83,47,76].
  - `PictureInsertFromFile` („This Device”) stă în meniul închis, deci pasul înghețat (comanda direct după fila Insert) nu se poate face nici pe panglica reală.

### C3. Asistentul comun și celelalte aplicații

**Ce a atins banda r24 în codul comun:** doar `L.asistent` (`aplicatii.js:666-672`).
- PowerPoint: Tab în Save As, fără ieșire, fără bifă, fără greșeală; Save se bifează la Enter pe Save. Ctrl+M → 2 diapozitive (`rd20 › C5`).
- Excel pornește: „5”, Enter → `A1 = 5`. Explorer și Windows pornesc.
- Pe toate cinci, asistentul cheamă indiciul după 2 greșeli adevărate (A6).

**Nicio eroare de pagină. Banda r24 n-a stricat nimic în altă aplicație.**

**Benzile paralele:** nimic stricat la Word din cauza lor în ce am atins (03:30-04:10; punctul de control `b5549790` de la 03:39).

---

## [FARA_REFERINTA] (nu le număr GRAV)
1. **Tabla 1920×1080: cromul ferestrei rămâne de 1366** (B5).
   - ✕ / Min / Max la x 1318-1366, la 554 px de colțul ferestrei. Panglica, rândul filelor și bara de stare se opresc la 1366, documentul are 1901 px.
   - Lecția spune „✕, sus în dreapta” (`m1-l03:281`, `:298`).
   - Cu o captură `uia_word` la 1920×1080 care arată butoanele în colț, devine GRAV (aplicația se vede altfel pe un drum al lecției, pe ecranul clasei). Vechi (ciclurile A și B).
2. **Laptopul la 125 %: fereastra Word nu se adaptează la 1093 px** (B3).
   - ✕, Share, Editing, Add-ins și zoom-ul stau în afara ecranului până la derularea laterală.
   - Word real strânge grupurile panglicii și ține ✕ în colț, dar n-avem captură la 1093 px. Drumul se face. Vechi.
3. **Pictogramele și etichetele lipsă** (B2).
   - Layout › Paragraph: săgețile + „Indent / Left / Right / Spacing / Before / After”.
   - Insert › Text; View: Read Mode, Focus, Immersive Reader…
   - Bara de navigare din Save As / Open.
   - UIA nu le capturează.
4. **Fontul ferestrelor de fișiere:** 11 px față de 9 pt = 12 px în Windows. Referința n-are fonturi.
5. **Felul micșorării pe laptop** (`scale`, minimum 70 %) și lista întoarsă în sus. Constructorul le trece [presupus] (A24-2, R24-3).
   - Fereastra reală Save As (PDF) are 615 × 1,25 = 769 px fizici, deci nici ea nu încape pe 657.
   - Ce face Windows atunci nu e capturat.
6. **În Save As (PDF), „Standard (publishing online and printing)” apare nebifat**, iar numele rămâne „….docx” după alegerea PDF.
   - Referința n-are starea butoanelor radio, iar valoarea numelui e redactată.
   - În Windows, schimbarea tipului schimbă de obicei și extensia afișată. De capturat.
7. **Rămân cele din critic 20:**
   - R20-1 (ordinea Tab);
   - litera în Save as type (`rd20 › B_litere`: tot `tastare|tastare|camp:tip_fisier`, tipul rămâne .docx);
   - R20-2…R20-4;
   - Enter pe Tools;
   - nume la limită;
   - focusul în Font / Paragraph.

## MINOR
1. **Panglica Home:** casetele de text din Font și Font Size și butoanele lor ▾ stau la +3 / +3 px față de referință (B1). Caseta din jur e la ±1. Nu se observă cu ochiul și nu încurcă.
2. **Laptopul la 125 % (nou în r24, urmare a micșorării):**
   - lista Save as type se desenează la mărimea întreagă peste fereastra micșorată: 814 px față de caseta de 755, iese cu 59 px din fereastră, cu litere mai mari;
   - textul ferestrei PDF ajunge la ~9,4 px css.
   - Cauza: `word.js` › `listaRef` (`:1326`, `root.appendChild(s)` la ~`:1343`). Lista e pusă în `root`, nu în fereastra cu `transform`. Ar trebui micșorată cu același `kMic` (`word.js:1112-1113`).
3. **Telefonul: zonele de atins din ferestrele de fișiere sunt sub 32 px** (api §8.4): rândurile listei 16 px, File name 18, Save as type 22, Save / Cancel 26. Vechi; drumul se face.
4. **Asistentul bifează Save la salvarea refuzată:**
   - nume interzis (MINOR vechi);
   - **și „already exists” + clic pe Save** (`clic|nesimulat|dialog_salvare:Save` → `pas 1`, nimic scris), pe drumul lecției `m1-l03:157`.
   - E litera §6.3. Regula „un eveniment `nesimulat` / refuzat nu face pasul” e pentru orchestrator (comun).
5. **Alt+↓ în Save as type e încă greșeală pentru asistent.** Drumul cu tastele deschide lista; o a doua deschidere cheamă bula. Propunere: `meniu_tip_fisier` / `activat fereastra:Deschidere` între excepții, ca `mutare_focus`.
6. **Alt+F4 pe document (fără fereastră deschisă):** `tasta_f4|tasta_f4|document`, nimic, fără mesaj. Word real se închide sau întreabă. Nu e pe drumurile lecției (în browser, Alt+F4 îl prinde oricum fereastra, R24-5). E aceeași familie cu MINOR-ul Alt+F4 din r20.
7. **„already exists” fără întrebarea de înlocuire** (MINOR vechi din r5; R24-4, fără referință).

## Ce a trecut (văzut pe ecran, în `stare()` și în evenimente)
- **K1:**
  - 5 ferestre × 23 de taste, fără ieșire, cu contur;
  - gestul criticului 16;
  - lecția `:189-192` cu tastele.
- **Asistentul r24:**
  - Tab nu bifează și nu e greșeală, la Word și la PowerPoint;
  - Save abia la salvarea adevărată pe drumul cu Tab;
  - greșelile adevărate cheamă bula pe 5 aplicații.
- **Aspectul la 1366×768:**
  - toate nodurile cu dreptunghi, pe titlu, file, stare, Home / Insert / Layout / View, Backstage (cadru, navigare, 5 pagini) și 5 ferestre;
  - doar 4 noduri peste 2 px;
  - lipsurile sunt redactări ale referinței.
- **Ecranele:**
  - laptopul la 125 %: ferestrele încap, PDF cu mouse-ul, ✕ prin derulare;
  - 900×500: Tab aduce Save;
  - telefonul 390 / 360: PDF doar cu degetul;
  - tabla: PDF.
- **MINOR-urile r24:** Alt+F4 în 4 ferestre, mesajul de eroare scos la salvarea reușită.
- **Regresul:**
  - eșantionul celor 8 + K1;
  - O4 = 13, aceleași rânduri; R24-1 și R24-2 confirmate;
  - PowerPoint / Excel / Explorer / Windows;
  - mesajul central.
- Nicio eroare de pagină.

## Predarea pentru runda următoare
1. **Word nu are GRAV deschis.** Întâi de reparat sunt cele ieftine:
   - lista Save as type micșorată odată cu fereastra pe laptop (MINOR 2);
   - casetele Font / Font Size (+3 px, MINOR 1).
2. **Pentru orchestrator, în codul comun** (`L.asistent`, §6.3):
   - un eveniment `nesimulat` / refuzat nu face pasul („already exists” și nume interzis);
   - Alt+↓ care deschide lista din fereastră să nu fie greșeală.
3. **Referințe de capturat** (Word real, la ora orchestratorului):
   - **`uia_word` la 1920×1080** (tabla) și **la 1366×657 cu 125 %**: unde stau ✕ și barele, cum se strânge panglica. Hotărăsc [FARA_REFERINTA] 1-2, care pot deveni GRAV pe drumul „✕, sus în dreapta”;
   - **capturi de ecran decupate** ale filelor View, Layout, Insert și ale barei Save As, pentru pictograme și etichetele Indent / Spacing;
   - fontul ferestrelor de fișiere;
   - starea butoanelor radio „Optimize for” și numele din File name după alegerea PDF;
   - rămân cele din critic 20 (R20-1…R20-4, prima literă în Save as type, Enter pe Tools…) și R24-4 / R24-5.
4. **O4 la Word rămâne 13.** R24-1 (hamul: `x + w/2` față de `x + l//2`) și R24-2 (scenariul cere „This Device” dintr-un meniu închis) se repară într-o rundă `acoperire`, nu în `word.js`.

GRAV_VECHI_DESCHISE: 0
GRAV: 0
