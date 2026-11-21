# Criticul rece, runda 28 (Word, valul B-word#3, ciclul paralel D): GRAV vechi + asistentul comun + unghiul GEST_TASTATURA

**Cine:** critic rece. Din `runde/28/` am citit:
- `critic_prompt.md`, `gata_pentru_critic.md`, `raport_constructor.md`, `api_propunere.md` (de judecat, nu de crezut);
- `diff_word.txt` și `supliment_B_word_runda28.md`;
- modelul și constatările din `runde/24/critic.md`;
- regulile din `runde/_paralel/REGULI_CRITIC.md`.

N-am rulat `proba_grav.py` al constructorului, nici `masoara.py` / `porti.py`. Concluziile vin din gesturile mele.

**Ce am rulat** (totul în `runde/28/critic_probe/`, ieșirile în `critic_probe/iesiri/`):
- **Mediul de probă:**
  - server static legat de `127.0.0.1`, port 0, care servește worktree-ul (`hc28.py` = ajutoarele critic 24);
  - Playwright Chromium headless, `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost;
  - poligonul `aplicatii/poligon.html`, cu `LH.aplicatii.deschide(...)`.
- **Gesturile:** `page.keyboard`, `page.mouse`, `page.touchscreen.tap` și glisări de deget prin CDP `Input.dispatchTouchEvent` (telefon).
- **Versiunile vechi, ca să despart ce a schimbat runda 28:** servite prin ruta Playwright, fără să scriu nimic sub `aplicatii/`:
  - `word.js` de la pornire (`runde/28/inainte/word.js`);
  - `aplicatii.js` de azi cu blocul `L.asistent` (NEGRESELI … „tipul comun”) luat din `runde/28/inainte/aplicatii.js`;
  - `aplicatii.js` de azi fără `'eroare_sortare'` în `REFUZ`;
  - `aplicatii.js` de la pornire întreg (`gestTasta` dinainte de r30).
- **Word real, doar ca indiciu** (`p28g_word_real.py` → `g_word_real.json`):
  - instanță nouă, `win32com.client.DispatchEx`, `Visible=False`, `DisplayAlerts=0`, pornită prin `tools/hidden_desktop.py run` (desktopul `A6Hidden`);
  - comenzile tastelor rulate prin `KeyBinding.Execute`, fără tastatură și fără clipboard; nimic salvat pe disc;
  - am închis doar PID-ul meu (diferența `tasklist` înainte / după, exact 1 proces nou). WINWORD-ul omului: neatins (1 înainte, 1 după). PowerPoint nu l-am pornit.
- **Scripturile:**

  | script | ieșirea | ce măsoară |
  |---|---|---|
  | `p28a_asistent.py` | `a_asistent.json` | K1 + asistentul pe 5 aplicații |
  | `p28c_refuz_k2.py` | `c_refuz_k2.json` | dublu clic pe Save după refuz; K2 (r8) pe 3 variante ale lui `aplicatii.js` |
  | `p28b_taste.py`, `p28d_taste2.py` | `b_taste.json`, `d_taste2.json` | unghiul GEST_TASTATURA |
  | `p28e_esc_meniu.py` | `e_esc_meniu.json` | Esc cu meniul Pictures deschis, azi / `word.js` de la pornire |
  | `p28f_ecrane.py` | `f_ecrane.json` | laptop 125 %, telefon 390 / 360, tabla; MINOR 1; Ctrl+literă azi / pornire |
  | `p28g_word_real.py` | `g_word_real.json` | indiciul din Word real (Ctrl+Backspace / Delete / ↑ / ↓ / →) |
  | `p28h_pp_excel.py`, `p28i_refuz_alte.py`, `p28j_sort_bun.py`, `p28k_taste_pe_save.py` | `h_…`, `i_…`, `j_…`, `k_….json` | regula (c) la PowerPoint / Excel; refuzul la PowerPoint / Excel; Sort pe drumul bun; tastele pe Save |
  | `regres20/p20d.py` (critic 20, copiat) | `regres20/rd20.json`, `rd20_rezumat.txt` | cele 8 închise în r16 + K1 + ecrane |
  | O4 direct, `LH_IESIRE=critic_probe/iesiri/O4w` | `iesiri/O4w/rele.txt` | scenariile `word-*` |
  | O9 direct, `LH_IESIRE=critic_probe/iesiri/O9` | `iesiri/O9/rele.txt` | asistarea, toate aplicațiile |

**Starea codului comun:** `aplicatii.js` (07:25) și `word.js` (07:26) nu s-au schimbat cât am probat (07:38-08:15). În paralel s-au schimbat `windows.js` (07:39, r30) și `excel.js` (07:37, r29); proba mea pe Windows (~07:45) a rulat pe `windows.js` de la 07:39. Nicio eroare de pagină în nicio probă (`erori: []` peste tot).

---

## A. GRAV-urile vechi

### GRAV K1 (Tab / Shift+Tab scot focusul din ferestrele modale; drumul PDF cu tastele): **rămâne ÎNCHIS**

Proba: `a_asistent.json › A1_*`.
- **Ocolul Tab:** 15 × Tab + 8 × Shift+Tab în Save As, Save As (PDF), Open, „Save this file” și „Save your changes…”.
  - Ieșiri din fereastră: 0. Opriri fără contur: 0. Opriri în afara ecranului: 0.
  - Ordinea din Save As e aceeași ca în critic 24.
- **Gestul criticului 16** (F12, Ctrl+A, „Pop_Mihai_7A_orar”, Tab, Alt+↓, ↓×6, Enter, Enter): se scrie doar `Pop_Mihai_7A_orar.pdf`; documentul rămâne „Document1  -  Word”.
- **Lecția `m1-l03:189-192` doar cu tastele:** `.docx` și `.pdf`, ambele cu „Marți: sport”; titlul rămâne „Popescu_Ana_7A_orar  -  Word”.

### Asistentul schimbat (`aplicatii.js` › `L.asistent`, `:657-726`): **cele trei reguli țin pe drumurile cerute, cu două găuri (MINOR) și un conflict cu o probă veche (de hotărât)**

**(a) Refuzul nu face pasul** (`a_asistent.json › A2a`, pas = `dialog_salvare:Save`):

| gestul | evenimentul | pas | salvat |
|---|---|---|---|
| nume interzis + Enter | `tasta_enter\|nume_interzis\|camp:nume_fisier\|dialog_salvare:Save` | 0 | nimic |
| nume interzis + clic pe Save | `clic\|nume_interzis\|dialog_salvare:Save` | 0 | nimic |
| „already exists” + clic pe Save (`m1-l03:157`) | `clic\|nesimulat\|dialog_salvare:Save` | 0 | nimic |
| „already exists” + Enter | `tasta_enter\|nesimulat\|…` | 0 | nimic |
| „Save this file” + nume interzis + Enter | `nume_interzis` | 0 | nimic |
| apoi numele bun + Enter | `tasta_enter\|salvare` | **1** | `Bun_….docx` |

- Două refuzuri la rând sunt două greșeli: bula vine pe Save după al doilea (cu Enter). Corect: elevul greșește de două ori.
- **Gaura 1 (MINOR 1, mai jos): dublul clic pe Save ocolește regula** (`c_refuz_k2.json › word_dublu_azi`).
  - Nume interzis + **dublu clic** pe Save → `clic|nume_interzis`, `clic|nume_interzis`, `dublu_clic|dublu_clic|dialog_salvare:Save` → **`pas 1`**.
  - Nimic scris; fereastra Save As rămâne deschisă. La fel cu „already exists”.
  - Două clicuri la 1 s → `pas 0`, bula pe Save. Deci doar dublul clic trece: `dublu_clic` nu e în `REFUZ`, iar ținta lui e Save.
  - Dublul clic pe un buton e un gest des la începători.

**(b) Alt+↓ în Save as type nu cheamă bula** (`A2b`, pașii `[meniu:PDF (*.pdf), dialog_salvare:Save]`):
- Tab, Alt+↓, Esc, Alt+↓, Esc, Alt+↓, Alt+↑, Alt+↓: nicio bulă, `pas 0`. Esc care închide lista dă `tasta_esc|inchidere_meniu`, nici el nu e numărat.
- ↓×6 + Enter → `meniu:PDF` (`pas 1`); Enter → `salvare_pdf`, `pas 2`, `Orarul meu.pdf`.
- Controlul: în Explorer, Alt+↑ și Alt+← (`alt_sageti|navigare|lista`) rămân greșeli: bula după a doua (`A4_explorer_alt_sus_greseala`).

**(c) Tastarea într-un câmp al interfeței nu e greșeală** (`A2c`, `A3`):
- File name: Ctrl+A, Backspace, 18 litere, Backspace, Home, Delete, Ctrl+Z, Ctrl+Y, End, Shift+Home, Ctrl+C, Ctrl+V, Ctrl+Backspace, Space, Ctrl+Delete: nicio bulă. Enter → `salvare`, `pas 1`.
- Font Size din panglică (clic + „20”): nicio bulă.
- Windows, „Windows, pai, Enter”: Meta → `pas 1`; p, a, i fără bulă; Enter → `pornire_aplicatie … start:Paint`, `pas 2`.
  - Și cu o literă greșită („pax”, Backspace, „i”): fără bulă, `pas 2`.
- **Controalele rămân greșeli**, bula vine după a doua:
  - Word: „xy” în document; Ctrl+A/C, Ctrl+V, Ctrl+Z în document; Backspace / Delete în document;
  - Windows: „xy” pe desktop, cu Start închis;
  - Excel: „ab” în celulă, și după F2; clicul în bara de formule duce focusul în grilă, deci tot greșeală (`h_pp_excel.json`);
  - PowerPoint: „ab” în titlul diapozitivului (`forma:1/1`).
- **Un pas cu `asteapta` hotărăște singur:**
  - `asteapta = ev.actiune === 'nume_interzis'` primește refuzul (`pas 1`), iar al doilea pas, `ev.gest === 'tastare'`, primește litera (`pas 2`);
  - cu `asteapta = false`, tastarea în câmp tot nu e greșeală, dar două refuzuri cheamă bula.

**Greșeala adevărată** (2 clicuri în gol în zona de lucru) cheamă indiciul după a doua, pe toate cele 5 aplicații (`A4_*_clic_in_gol`):

| aplicația | ținta pasului | după 1 | după 2 |
|---|---|---|---|
| Word | `mso:Bold` | fără bulă | bula |
| Excel | `mso:Bold` (clic pe F2, R2) | fără bulă | bula |
| PowerPoint | `mso:Bold` | fără bulă | bula |
| Explorer | `bara_comenzi:Nou` | fără bulă | bula |
| Windows | `bara_activitati:Start` | fără bulă | bula |

**Conflictul cu proba veche r8 (pista orchestratorului), judecat cu proba mea** (`c_refuz_k2.json › K2_excel_*`, `j_sort_bun.json`):
- Gestul din `runde/8/proba_grav.py` › K2: Column Width „20” + Enter (`pas 1`), apoi Data › Sort cu „Sort by” gol + Enter.
  - Excel răspunde cu fereastra „All sort criteria must have…”: `tasta_enter|eroare_sortare|fereastra:OK|fereastra:OK`.

  | `aplicatii.js` servit | pas după Enter pe Sort | bula |
  |---|---|---|
  | azi | **1** | da, pe `fereastra:OK` |
  | azi fără `'eroare_sortare'` în `REFUZ` | 2 | nu |
  | azi cu `L.asistent` de la pornire | 2 | nu |

- **Cauza e runda 28:** `aplicatii.js:664`, `const REFUZ = new Set(['nesimulat', 'nume_interzis', 'eroare_sortare'])`, folosit la `:715-717`. Nu e `excel.js`, nici r30.
- **De ce nu e GRAV:**
  - OK-ul apăsat cu „Sort by” gol e refuzat și de Excel real: nu sortează nimic. Pasul nebifat e chiar regula (a) cerută de supliment, iar `api_propunere.md` o numește.
  - Proba r8 aștepta litera veche a §6.3 (api înghețat, propunerea e în `api_propunere.md`), adică Enter pe un OK refuzat = pas făcut.
  - Pe drumul bun Sort-ul nu e atins: un pas `fereastra:OK` se bifează când Sort chiar sortează.
- **De hotărât (orchestratorul):**
  - fie proba r8 alege coloana înainte de Enter (rundă `acoperire`);
  - fie `eroare_sortare` iese din `REFUZ`.
- Constructorul nu a rulat proba r8 în regresul lui (doar 24 / 20 / 16), deci n-a văzut conflictul.
- Pe drum am găsit o a doua gaură, mai veche (MINOR 2, mai jos). În `j_sort_bun.json` focusul stă pe OK la deschiderea Sort-ului, iar **Alt+↓ cu focusul pe OK** (`alt_sageti|fara_efect|fereastra:OK`) a bifat pasul `fereastra:OK` fără nicio sortare.

**A: K1 ÎNCHIS. Regulile (a), (b), (c) fac ce spune constructorul pe drumurile cerute. Gaura dublului clic și conflictul r8 sunt în D. GRAV vechi deschise: 0.**

---

## B. Unghiul GEST_TASTATURA pe Word: constatări noi

**Pe scurt: niciun GRAV nou.**
- Tastele din supliment fac pe drumurile lecțiilor ce face Word în scenariile `word-*` și în referințe.
- Diferențele găsite sunt:
  - fără referință înghețată → [FARA_REFERINTA], D;
  - în afara drumurilor lecțiilor sau fără să blocheze → MINOR, D.

### B1. Săgețile, Home / End, Ctrl+Home / End (`b_taste.json › B1`, `d_taste2.json › D6`)
Pe „Ana are mere.” / „Luni: română, matematică, TIC”:

| tastele | cursorul / selecția |
|---|---|
| → → ← | 1, 2, 1 |
| End, ↓, Home, ↑ | 13, 28, 14, 0 |
| Ctrl+→ ×2, Ctrl+← | 4, 8, 4 |
| Shift+→ ×2 | „a”, „ar” |
| Shift+End, Shift+Home | „are mere.”, „Ana ” |
| Ctrl+Shift+← | „Ana ” |
| Ctrl+End | 43 |
| Ctrl+Shift+Home | totul |

- Evenimentele: `sageti|cursor` / `sageti|selectare`, `tasta_home_end|cursor`.
- Shift+End, Shift+Home și Ctrl+Shift+Home selectează corect, dar evenimentul spune `actiune: cursor`, nu `selectare` (MINOR 4).
- **Punctuația** (indiciu din Word real, nu referință; `g_word_real.json`): pe „Ana are mere. Ion, vino!”, Ctrl+→ se oprește:
  - în Word real la 4, 8, **12**, 14, **17**, 19, **23**, 24 (punctul, virgula și semnul exclamării sunt „cuvinte”);
  - în simulator la 4, 8, 14, 19, 24.
  - E vechi (`muta1`), iar granița o moștenesc acum și Ctrl+Backspace / Ctrl+Delete (B3). [FARA_REFERINTA] 2.

### B2. Ctrl+↑ / Ctrl+↓, și cu Shift (nou în r28; `b_taste.json › B2`): **ca în Word real**
- Pe „Orarul meu / Luni: … / Marți: sport”, din 38:
  - Ctrl+↑ ×3 → 11, 0, 0;
  - Ctrl+↓ ×4 → 11, 41, 53, 53;
  - Ctrl+Shift+↓ ×2 / ↑ → paragrafele întregi, cu marca.
- **Word real** (`KeyBinding.Execute` pe Ctrl+↑ = `ParaUp`, Ctrl+↓ = `ParaDown`; `g_word_real.json › ctrl_sus_jos`): aceeași secvență, 11, 0, 0, 11, 41, 53, 53.
- Regula „paragraful curent, apoi cel dinainte” (R28-3) e confirmată ca indiciu.

### B3. Enter, Tab, Backspace, Delete, Ctrl+Backspace, Ctrl+Delete (`b_taste.json › B4`)
- **Enter, Tab, Backspace, Delete:**
  - Enter → `paragraf_nou`, iar „Ion” ajunge pe rândul nou;
  - Tab → `\t`;
  - Backspace ×2, Home, Delete → „on”;
  - Ctrl+Z ×2 / Ctrl+Y: textul revine corect.
  - Scenariile `word-backspace-*`, `word-delete-*`, `word-enter-paragraf-nou`, `word-ctrl-z-*`: la fel ca realul (O4).
- **Ctrl+Backspace / Ctrl+Delete:** șterg un cuvânt (ștergeau o literă). Word real are pe ele `DeleteBackWord` / `DeleteWord`.
  - La fel ca Word real (`g_word_real.json`):
    - la capătul cuvântului: „Ana are mere” → „Ana are ”;
    - după spațiu: „Ana are mere ” → „Ana are ”;
    - în mijlocul cuvântului (după „m”): „Ana are ere multe”;
    - Ctrl+Delete la începutul cuvântului: „Ana mere multe”;
    - Ctrl+Delete înainte de virgulă: „Ionvino”, după aceeași regulă din cod.
  - Cu selecție, ambele șterg selecția. La începutul paragrafului, Ctrl+Backspace unește paragrafele („AnaIon are”).
  - Ctrl+Z pune totul înapoi într-un pas.
  - **Diferă de Word real** (indiciu, [FARA_REFERINTA] 2; R28-3 al constructorului):

    | caz | simulator | Word real |
    |---|---|---|
    | Ctrl+Backspace după „mere.” | „Ana are ” (ia „mere.”) | „Ana are mere” (ia doar punctul) |
    | Ctrl+Backspace între „mere” și „.” | „Ana are .” | „Ana are.” (ia și spațiul) |
    | Ctrl+Delete din mijlocul lui „mere” (după „m”) | „Ana are mmulte” (ia și spațiul) | „Ana are m multe” |

  - Nu sunt pe drumurile lecțiilor (nicio lecție Word nu cere Ctrl+Backspace / Ctrl+Delete).

### B4. Page Up / Page Down (`b_taste.json › B3`, `d_taste2.json › D5`)
- Evenimentul: `tasta_pagina|derulare`. Derulează 90 % din zonă; cursorul rămâne pe loc (R28-4, NEFĂCUT recunoscut).
- **Urmarea, găsită de mine:**
  - Ctrl+Home, PageDown, apoi „Z”: litera intră la începutul documentului (`ZRândul 1…`);
  - cursorul rămâne la y −208, deasupra zonei (181-744), iar vederea nu se întoarce la el (`cursor_in_vedere: false` și după tastare).
  - Elevul tastează și nu vede ce scrie. Cu documentul scurt al lecției (2 rânduri), PageDown tot derulează 507 px și scoate cursorul din vedere.
  - Nu e pe drumul unei lecții (nicio lecție nu cere Page Down; „Page Down / PgDn / F10 / Alt+H” nu apar în `lectii/vii`, `v`, `viii`). Nici `surse_microsoft.md`, nici `referinte/` nu au tasta. [FARA_REFERINTA] 1.

### B5. Ctrl+Z / Y / C / X / V / A / B / I / U / S, F12, Ctrl+O, Ctrl+N (`b_taste.json › B5`, `B6`)
- **Formatarea:** Ctrl+A, B, I, U, Z, Y → `selectare_tot`, `aldin`, `cursiv`, `subliniat`, `anulare`, `refacere`.
- **Lipirea (nou în r28):**
  - „are mere.” lipit după „mere.” → „Ana are mere. are mere.” (spațiul pus de Word, ca în `word-copiere-lipire`);
  - Ctrl+Z ia lipirea și spațiul într-un pas, Ctrl+Y le pune la loc;
  - decuparea „Plecăm luni. ” lipită înaintea lui „apă” → „Aduceți Plecăm luni. apă. ”, fără spațiu în plus.
- **Pozițiile R28-1:**
  - după „(”, după spațiu și în mijlocul cuvântului: fără spațiu;
  - după cifră: cu spațiu;
  - la începutul paragrafului: fără spațiu.
  - **Lipit înaintea unui spațiu** (cursorul între „mere” și „ abc”) dă **spațiu dublu**: „mere mere  abc”.
  - Profilul `word2007`: fără spațiu („Ana are mere.are mere.”).
  - [FARA_REFERINTA] 3.
- **Fișierele:**
  - Ctrl+S pe document nou → `dialog.save_this_file`, focusul în File name;
  - F12 → `dialog.FileSaveAs`, focusul în File name;
  - Ctrl+O → Backstage Open;
  - Ctrl+N → „Document2  -  Word”, 2 documente.
- După Esc dintr-o fereastră sau din Backstage, focusul revine în document și tastarea scrie acolo (`d_taste2.json › D4`).
- **Ctrl+literă, azi față de pornire** (`f_ecrane.json › C_ctrl_*`): 28 de taste, aceleași evenimente cu `aplicatii.js` de azi și cu cel de la pornire (`C_ctrl_diferente: []`). Schimbarea din `gestTasta` (r30) nu atinge Word.

### B6. KeyTips (Alt, literele) și Esc în ele (`b_taste.json › B7`, `d_taste2.json › D2`, `D3`, `e_esc_meniu.json`)
- **Alt, H, 1:**
  - Alt → insignele filelor;
  - H → fila Home cu insignele ei;
  - 1 → `tasta_acces|aldin|panglica:Home/Font/Bold`, iar textul selectat devine aldin.
- **Alt, H, Esc, Esc:** urcă un nivel, apoi iese (`iesire_taste_acces`), ca în api (`:177`).
- **Alt, N, P, D (nou în r28):**
  - P → meniul Pictures, cu antetul „Insert Picture From” și rândurile „This Device...”, „Stock Images...”, „Online Pictures...”, insignele D, S, O (`b_alt_n_p.png`);
  - D → `tasta_acces|dialog_imagine|meniu:This Device...` și fereastra `dialog.PictureInsertFromFile`.
  - Etichetele și tastele sunt cele din `runde/26/acoperire_office/capturi_word_brut.json › this_device` („Alt, N, P, D”).
  - `word-imagine-inserare` (mouse) e la fel ca realul în O4.
- **Alt, F, A, O** → Backstage › Save As › Browse → `dialog.FileSaveAs`. **Alt, N, T** → meniul Table.
- **Esc cu meniul Pictures deschis din tastele de acces (NOU în r28, MINOR 3):**
  - Alt, N, P, apoi Esc: insignele urcă la nivelul Insert, **dar meniul Pictures rămâne deschis**;
  - încă două Esc ies din tastele de acces, iar meniul tot deschis (`d_esc_esc_meniu_pictures.png`); abia al **patrulea** Esc îl închide (`inchidere_meniu`).
  - Pe `word.js` de la pornire, primul Esc închidea meniul (`e_esc_meniu.json › word_js_pornire`). Meniul deschis cu mouse-ul se închide la primul Esc și azi.
  - Cauza:
    - rândurile cu `ta` (`word.js:1066`, `b.__nod = {…, ta}`) fac din meniu un nivel al tastelor de acces;
    - Esc din keydown-ul tastelor de acces (`word.js:2332-2336`) urcă nivelul fără `inchideMeniu()` și oprește propagarea, deci `:2127` nu mai ajunge să închidă meniul.
  - Nu blochează: clicul pe „This Device...” merge, iar al patrulea Esc închide. Ce face Word real la Esc în meniu nu e capturat.
- **Alt+H / Alt+N / Alt+F ținute (acord):** niciun eveniment, nimic pe ecran (`D2`). **F10:** `tasta_f10|tasta_f10`, fără insigne și fără mesaj. Vechi (critic 1, critic 4 › „Tastele Alt fără eveniment”); MINOR 5.
- **Alt, Q** (căutarea): mesajul spune „În aplicația reală, „cautare” funcționează”, cu numele intern în loc de eticheta reală (MINOR 6).

### B7. Tastele în ferestrele de fișiere (`b_taste.json › B8`, `d_taste2.json › D1`)
Toate cele de mai jos le-am comparat cu tastele din `referinte/uia_word.json › suprafete.dialog.*` („ALT+n”, „ALT+t”, „Alt+l”, „Alt+s”, „Alt+a”, „Alt+m”, „Alt+o”, „Alt+e”, „ALT+P”).

| fereastra | tastele | ce face simulatorul |
|---|---|---|
| Save As | Alt+T / Alt+N | focusul în Save as type / File name (`focus_camp`) |
| Save As | Alt+L | mesajul „Tools” (`nesimulat`; în r4 nu dădea niciun eveniment) |
| Save As | Alt+S | `salvare`, `Alt_S_test.docx` |
| Save As | Alt+T, Alt+↓, ↓×6, Enter | `meniu:PDF (*.pdf)` și fereastra PDF |
| Save As (PDF) | Alt+A / Alt+M | butoanele radio |
| Save As (PDF) | Alt+E | bifa „Open file after publishing” |
| Save As (PDF) | Alt+O | mesajul „Options...” |
| Save As (PDF) | Alt+S | `salvare_pdf`, `Orarul meu.pdf` |
| Open | Alt+N / Alt+T | focusul în câmpuri |
| Open | Alt+P | mesajul „Panou de examinare” |
| Open | Alt+O, fără fișier ales | `fara_efect` |
| Save this file | Tab / Shift+Tab | ocolul câmpurilor |
| Save this file | Alt+S | `salvare`, `Poezia mea.docx` |
| „Save your changes…” | Alt+N | `inchidere_fara_salvare` (Don't Save), 0 documente |
| oricare | Esc fără listă deschisă | închide fereastra (`anulare`, `activat …:Cancel`) |

- **Alt+↑ cu lista Save as type deschisă:** dă `nesimulat` cu mesajul „Până la „Desktop” (Alt + săgeată în sus)”, iar lista rămâne deschisă. Într-o casetă Windows, Alt+↑ închide lista. Necapturat: [FARA_REFERINTA] 4.
- **Tastele cu focusul pe Save** (ajuns cu Tab; `k_taste_pe_save.json`, MINOR 2): ↓, →, Alt+↓ și o literă dau `…|fara_efect|dialog_salvare:Save` și **bifează pasul Save** fără salvare (`pas 1`, nimic scris).
  - Space apasă Save, corect.
  - E vechi: la fel cu `L.asistent` de la pornire. Cauza e `aplicatii.js:717`: `bun` primește orice eveniment cu ținta pasului, deci și `fara_efect`. Runda 24 a scos doar Tab-ul (`mutare_focus`).

---

## C. Regresul

### C1. Cele 8 închise în r16, K1 și MINOR-urile r24, pe eșantion
Proba critic 20 `p20d.py`, copiată în `critic_probe/regres20/` și rulată pe codul de azi → `rd20.json`. Comparată cheie cu cheie cu `runde/24/critic_probe/regres20/rd20.json`: **identic**, cu două excepții:
- **Rândul PDF din lista Save as type pe laptopul la 125 %:** era [128, 202, **814**, 16], acum [128, 215, **753,6**, 14,8]. Asta e reparația MINOR 2 (de mai jos).
- **Mesajul central** pentru Tools / F5 se mai vede la 4,7 s (în r24 dispăruse). Mașina e încărcată, iar la 6,3 s a plecat. Nu e o schimbare de cod.

Deci S1, S2 + S4, S5, S6, T5, T6, T1 (`:189-192` cu mouse-ul), fereastra mică, telefonul (C3) și mesajul central țin. K1: A.

**MINOR-urile r24 făcute în r28 sunt adevărate** (`f_ecrane.json`):
- **MINOR 2 (laptopul la 125 %, 1093×526, factor 1,25):**
  - lista Save as type are [126, 125, **754,5**, 253,7], adică exact lățimea casetei (754,5), în fereastra [1, 1, 888,8, 524];
  - drumul PDF cu mouse-ul scrie `Orarul meu.pdf`.
- **MINOR 1 (Font / Font Size față de `uia_word.json › panglica.TabHome`):**
  - copiii casetelor (Edit, butonul ▾) stau acum exact față de casetă: Edit la +1 / +2 de colț, ▾ la +111 / +1, la fel ca în referință;
  - caseta întreagă e la +2 / +2 față de referință, ca toată panglica. Toleranța ±2 e atinsă (era +3 / +3).

### C2. Scenariile `word-*` (O4)
Rulate de mine: `LH_IESIRE=critic_probe/iesiri/O4w`, `oracol_comportament.py --scenarii scenarii/word` (07:42-07:44).
- Rezultatul: **58/64 la fel ca realul**, 0 diferențe, 1 neexecutabil (2 chei), 6 fără real probat. Adică cele 8 rânduri ale constructorului.
- `iesiri/O4w/rele.txt` = `runde/28/probe_iesiri/O4w_final/rele.txt` (`diff` gol). Au căzut `word-copiere-lipire` și `word-imagine-inserare`; `word-decupare-lipire` e tot 0.

### C3. Ecranele, pe 2 ferestre (`f_ecrane.json`, capturile `f_*_lista.png`, `f_*_stf.png`)

| ecranul | Save As + lista + PDF | „Save this file” |
|---|---|---|
| laptopul la 125 % (1093×526, ×1,25) | Save As [1,1,889,524]; lista în fereastră; `Orarul meu.pdf` | [454,206,460,321], Save atins, `Poezia mea.docx` |
| tabla 1920×1080 | Save As [1,1,960,566]; lista sub casetă; `.pdf` | Save atins, `.docx` |
| telefonul 390×844 (×3, doar degetul) | Save în afara ecranului → 3 glisări pe strat → atins; `.pdf` | [1,228,460,321], Save în ecran, atins |
| telefonul 360×740 | la fel; `.pdf` | Save în ecran; **Cancel la x 359-429, iese 69 px** |

Pe tabla 1920, „Save this file” stă centrată pe 1366, nu pe 1920: cromul rămâne de 1366, [FARA_REFERINTA] 1 vechi din critic 24.

### C4. Asistentul comun și celelalte aplicații (banda r28 a atins `L.asistent`)
- **O9**, rulat de mine (`LH_IESIRE=critic_probe/iesiri/O9`, 08:09-08:10): **13**, aceleași rânduri ca `runde/28/probe_iesiri/O9_final/rele.txt` (`diff` gol; F_lectie ×5, paint ×8).
- **Pe 5 aplicații:** greșeala adevărată cheamă bula (A). Tastarea în document rămâne greșeală la Word, Excel, PowerPoint și Windows. Alt+↑ / ← în Explorer rămâne greșeală.
- **Regres față de o probă înghețată mai veche: `runde/8/proba_grav.py` › K2 (Excel, pas 2 după Enter pe OK) pică din cauza rundei 28** (`aplicatii.js:664`, `eroare_sortare` în `REFUZ`), dovedit pe 3 variante (A).
  - Nu-l număr GRAV (A: noul comportament e cel cerut și e la fel ca Excel real).
  - Proba r8 trebuie potrivită sau regula restrânsă: hotărăște orchestratorul.
- **Benzile paralele:** în ce am atins pe Word nimic nu e stricat de r29 / r30. Ctrl+literă dă aceleași evenimente ca înainte de schimbarea din `gestTasta`.
  - Meta+E / Meta+D în Word dau, ca și la pornire, `tasta_windows|fara_efect` + `ctrl_e` / `ctrl_d` (tasta Windows ține locul lui Ctrl în aplicațiile fără `I.tastaWindows`). Vechi, neschimbat.

**Banda r28 n-a stricat nimic vizibil în altă aplicație.** Proba veche r8 K2 e un conflict de regulă, nu o pagină stricată.

---

## [FARA_REFERINTA] (nu le număr GRAV)
1. **Page Down / Up:**
   - cursorul rămâne pe loc (R28-4);
   - **tastarea după PageDown scrie la cursorul ieșit din vedere, iar vederea nu se întoarce la el** (B4): elevul nu vede ce scrie. Vechi.
   - Pagina Microsoft citată în cod spune „Move the cursor by scrolling…”, dar nu e în `surse_microsoft.md`.
   - Dacă o captură reală o arată și o lecție cere derularea cu tastele sau cu rotița înainte de tastare, devine GRAV (§3, R12).
2. **Granițele cuvântului pe punctuație:** Ctrl+→ / ← și acum Ctrl+Backspace / Ctrl+Delete (B1, B3). Indiciul din Word real (`g_word_real.json`) arată diferența pe punct, virgulă și „!”, plus spațiul la Ctrl+Delete din mijlocul cuvântului. De capturat ca scenariu `gest_real`.
3. **Lipirea „inteligentă”** (R28-1, B5): spațiul dublu la lipirea înaintea unui spațiu („mere mere  abc”) și lipsa ei în `word2007`.
   - Smart cut and paste există și în Word 2007, dar Word 2007 nu e pe PC.
   - Nu l-am probat în Word real: cere clipboard-ul omului.
4. **Alt+↑ cu lista unei casete deschisă** în Save As (B7): mesajul „Până la Desktop”, iar lista rămâne deschisă.
5. **Rămân cele din critic 24:**
   - cromul de 1366 pe tablă și pe laptop;
   - pictogramele;
   - fontul ferestrelor;
   - „Optimize for” / extensia după PDF;
   - R20-1…R20-4, R24-4, R24-5.

## MINOR
1. **Dublul clic pe Save după un refuz bifează pasul** (A, `c_refuz_k2.json › word_dublu_azi`):
   - nume interzis sau „already exists” + dublu clic → `dublu_clic|dublu_clic|dialog_salvare:Save` → `pas 1`, nimic scris;
   - e aceeași familie cu MINOR 4 din critic 24, acum reparat doar pentru clicul simplu și Enter.
   - Cauza: `aplicatii.js:348` emite `dublu_clic` cu ținta butonului, iar `:717` îl primește.
   - Propunere: `dublu_clic` nu face pasul dacă clicul din aceeași pereche a fost refuz (sau `dublu_clic` pe un buton = clic).
2. **Tastele care nu apasă butonul bifează pasul când focusul e pe el** (B7, `k_taste_pe_save.json`; Excel: Alt+↓ pe OK în Sort, `j_sort_bun.json`):
   - ↓, →, Alt+↓, o literă pe Save → `fara_efect|dialog_salvare:Save` → `pas 1`, nimic scris;
   - vechi, la fel cu `L.asistent` de la pornire. Cauza: `aplicatii.js:717`.
   - Propunere: `fara_efect` (ca `mutare_focus`) nu face pasul.
3. **Esc cu meniul Pictures deschis din tastele de acces nu închide meniul** (NOU în r28, B6):
   - abia al patrulea Esc îl închide; pe `word.js` de la pornire îl închidea primul;
   - cauza: `word.js:1066` (`ta` pe rândurile meniului) + `:2332-2336` (Esc urcă nivelul fără `inchideMeniu()`);
   - comportamentul real la Esc în meniu nu e capturat.
4. **Shift+Home / Shift+End / Ctrl+Shift+Home:** selectează corect, dar evenimentul spune `actiune: cursor`. Shift+săgeți spun `selectare`. `word.js:2161-2162`.
5. **Alt+literă ținută (Alt+H, Alt+N, Alt+F) pe document:** niciun eveniment (§4 „un eveniment pe fiecare gest”); **F10**: fără insigne și fără mesaj.
   - Vechi (critic 1, critic 4), în afara drumurilor lecțiilor.
   - Cauza: `aplicatii.js:306` (`!e.altKey` → `gestTasta` = null).
6. **Alt, Q:** mesajul folosește numele intern „cautare”, nu eticheta reală a casetei de căutare.
7. **Telefonul la 360 px:** „Save this file” (460 px) iese cu 69 px; Cancel e în afara ecranului până la glisare. Save e în ecran. Rămâne și MINOR 3 din critic 24 (zonele de atins sub 32 px).
8. **Rămân din critic 24:** MINOR 6 (Alt+F4 pe document) și MINOR 7 („already exists” fără întrebarea de înlocuire). La 7, lecția `m1-l03:157-158` descrie fereastra cu OK / Cancel, iar simulatorul dă doar mesajul central.

**Găsit pe drum, în alte aplicații (nu le număr la Word):** PowerPoint și Excel salvează „Ana:B” (nume cu „:”) fără refuz (`i_refuz_alte.json`: `tasta_enter|salvare`). Regula (a) nu are acolo ce prinde.

## Ce a trecut (văzut pe ecran, în `stare()` și în evenimente)
- **K1:** 5 ferestre × 23 de taste, gestul criticului 16, lecția `:189-192` cu tastele.
- **Asistentul r28:**
  - refuzul (clic simplu, Enter; nume interzis, „already exists”, „Save this file”) nu bifează Save;
  - Alt+↓ / Esc / Alt+↑ în Save as type nu sunt greșeli;
  - tastarea și tastele de editare în File name, Font Size și caseta din Start nu sunt greșeli;
  - drumul „Windows, pai, Enter” ajunge la `pas 2` fără bulă;
  - greșelile adevărate cheamă bula pe 5 aplicații;
  - `asteapta` hotărăște singur; O9 = 13, aceleași.
- **Unghiul:**
  - săgețile, Home / End, Ctrl+Home / End;
  - Ctrl+↑ / ↓ (identic cu Word real);
  - Enter, Tab, Backspace, Delete;
  - Ctrl+Backspace / Delete pe cuvinte fără punctuație;
  - Ctrl+Z / Y / C / X / V / A / B / I / U / S, F12, Ctrl+O, Ctrl+N;
  - lipirea „Ana are mere. … mere” și decuparea;
  - Alt, H, 1; Alt, N, P, D; Alt, F, A, O;
  - Alt+literă în cele 5 ferestre, după tastele din referință.
- **Regresul:**
  - `rd20` identic cu r24, în afară de reparația MINOR 2;
  - O4 = 8, aceleași rânduri;
  - MINOR 1 și 2 reparate;
  - laptop / tablă / telefon 390 / 360, pe 2 ferestre;
  - Ctrl+literă neschimbat de r30.
- Nicio eroare de pagină.

## Predarea pentru runda următoare
1. **Word nu are GRAV deschis.** Întâi de reparat sunt cele ieftine, toate în `L.asistent` sau lângă el:
   - `fara_efect` nu face pasul (MINOR 2);
   - `dublu_clic` după refuz nu face pasul (MINOR 1);
   - Esc închide meniul Pictures deschis din tastele de acces (MINOR 3, `word.js:2332`).
2. **Pentru orchestrator:** conflictul `runde/8/proba_grav.py` › K2 față de regula (a) (`eroare_sortare` în `REFUZ`, `aplicatii.js:664`):
   - fie proba r8 alege coloana înainte de Enter;
   - fie `eroare_sortare` iese din `REFUZ`.
   - Regresul rundelor care ating `L.asistent` ar trebui să ruleze și probele Excel (r8), nu doar 24 / 20 / 16.
3. **Referințe de capturat** (rundă `acoperire`, Word real pe desktopul ascuns):
   - scenarii `gest_real` pentru Ctrl+Backspace / Ctrl+Delete / Ctrl+→ pe „Ana are mere. Ion, vino!” (indiciul e în `critic_probe/iesiri/g_word_real.json`);
   - Page Down cu tastarea după el, pe un document scurt și pe unul lung (cursorul și vederea);
   - Esc cu un meniu deschis din tastele de acces;
   - Alt+H ca acord;
   - lipirea în cele 5 poziții R28-1.
   - Rămân cele din critic 24.
4. **O4 la Word rămâne 8**, toate „fără real” / neexecutabile (R26O-1, R26O-2, Word 2007).

GRAV_VECHI_DESCHISE: 0
GRAV: 0
