# Runda 19 (B-explorer, a doua rundă de construcție, ciclul paralel B) · criticul rece · unghiul GEST_TASTATURA (21.11.2026)

## 1. Antet
- **Ce am judecat:** `aplicatii/explorer.js` + funcția comună `aplicatii.js › nesimulat`, așa cum sunt în worktree (identice cu
  punctul de control `b63df73e`, făcut de orchestrator cât lucram), pe `aplicatii/poligon.html?aplicatie=explorer`.
- **Cum am probat:**
  - server static pe `127.0.0.1`, port liber, peste `C:/00/Projects/LearningHub_fidel`, oprit la final;
  - Chromium headless; `ctx.route("**/*")` abandonează tot ce nu e 127.0.0.1/localhost; **0 cereri plecate și 0 erori de pagină în toate probele**;
  - gesturi reale: `page.mouse`, `page.keyboard`, `page.touchscreen`; scrisul prin CDP (`Input.insertText`, `Input.imeSetComposition`).
- **Scripturile** sunt în `critic_probe/`, iar ieșirile în `critic_probe/iesiri/`:
  - hamul: `h.py`;
  - A: `a_e1.py`, `a_e1c.py`, `a_e2.py`, `a_e2b.py` … `a_e2e.py`;
  - B: `b_tast.py`, `b_prevent.py`;
  - C: `c_regres.py`, `c_pixel.py`, `c_mica.py`.
- **Ce n-am atins:** Explorer, Windows, Word sau Excel reale; ecranul omului.
- **Ce n-am rulat:** `masoara.py`, `porti.py`, git care scrie.
- **Oracole:** am rulat direct doar O4 (`oracol_comportament.py`), cu `LH_IESIRE=critic_probe/iesiri/O4`.
- **În afara `critic_probe/`** am scris o singură dată: o copie în %TEMP% (`r19_critic_inainte`), ștearsă la final.

## 2. A. GRAV-urile vechi

### E1 (critic 15, `:116`) — mesajul „aici nu e simulată” șters de redesenare — **ÎNCHIS** (`a_e1.py` → `a_e1.json`, `a_e1.log`)
**Gestul criticului 15**, la 1366×768: cele 9 gesturi din `15/critic_probe/a4.py`:
- „…”, Minimizare, dublu clic pe tema;
- clic dreapta › Proprietăți;
- Nou › Microsoft Word Document;
- tema + Alt+Enter;
- „Acest PC”;
- Partajați;
- Ștergere în Coș.

**Toate 9 / 9 trec**, pe fiecare cu `actiune: 'nesimulat'`:
- **Mesajul e acolo:** un singur `[data-lh-nesimulat]` la +40, +400 și +1500 ms, cu eticheta comenzii și `role=status`. E sub rădăcină, întreg în pagină și deasupra (`elementFromPoint` din centrul lui = mesajul).
- **Nu clipește**, măsurat pe cadre (`requestAnimationFrame`, cu generație proprie pe fiecare gest): 0 cadre fără mesaj între prima apariție (10-360 ms) și 4,8 s.
  - Jurnalul mutațiilor arată „scos / pus înapoi” în aceeași milisecundă (ex. `['-',425,'Acest PC'],['+',425,'Acest PC']`), deci înainte de orice desenare.
- **Redesenarea:** un clic real pe alt rând la +1,6 s redesenează lista. Mesajul rămâne, iar clicul ajunge (rândul ales).
- **Plecarea:** ultimul cadru cu mesaj e la 5,0-5,35 s; la +5,6 s mesajul nu mai e în document. O redesenare după expirare nu-l readuce.

**Gesturile vecine:**
- **Două comenzi nesimulate la 300 ms** (Minimizare, apoi „Acest PC”), urmate de o redesenare: rămâne UN mesaj, al doilea. Primul nu reînvie: observatorul vechi e deconectat.
- **Închiderea aplicației cu mesajul pe ecran:** `LH.aplicatii.inchide('explorer')` lasă 0 mesaje în document.
  - Word deschis apoi pe aceeași pagină: 0 mesaje.
  - Explorer redeschis: 0 mesaje, și tot 0 după 5 s de lucru.
  - Nimic nu rămâne în urmă.
- **Tastele noi:** Alt+Enter și Ctrl+Shift+C dau mesajul (vezi B).
- **Telefonul** (360×740 și 390×844): mesajul e în pagină, deasupra, la `[91,496,179,69]`.
- **Fereastra mică** (1366×657 la 125 %): mesajul NU se vede (GRAV nou N1, mai jos). Cauza e alta decât E1: așezarea mesajului, nu ștergerea lui.
- **Clicul de sub mesaj, cât trăiește:** mesajul îl înghite timp de 5 s (MINOR 1, mai jos). După plecare nu mai acoperă nimic: „dispare curat” e îndeplinit.

### E2 (critic 15, `:140`) — redenumirea pe telefon — **ÎNCHIS** (`a_e2.py`, `a_e2b.py`, `a_e2c.py`, `a_e2e.py` → `iesiri/a_e2*.json`)
**Gestul criticului 15** (360×740 și 390×844, `isMobile` + `page.touchscreen`, scrisul prin `Input.insertText`):
- **Nou › Folder** › „Ex Pop Ana” › Enter: `Ex Pop Ana/` în stare și pe ecran.
  - Evenimentul: `tasta_enter / redenumire / lista:Folder nou`.
  - Caseta are focusul la +450 ms, cu „Folder nou” ales tot (`sel [0,10]`).
- **Atingere în afară**, într-un punct gol VIZIBIL al listei: `Ex Pop Ana/` + `clic / deselectare / lista`.
  - Prima mea încercare atingea în afara ecranului (lista are 770 px), deci nu dovedea nimic. A doua, cu punctul calculat, trece.
- **tema › Redenumire** (bara de comenzi) › „compunere” › Enter: `compunere.docx`.
- **harta › F2** › „harta mare” › Enter: `harta mare.png`. Caseta pornește cu „harta” ales, fără extensie (= `observat_vizual.f2_pe_tema_docx`).
- **Desene › Redenumire** › „Altceva” › Esc: numele rămâne, cu `tasta_esc / anulare_redenumire`.

**Gesturile vecine** (pe amândouă lățimile):
- **Atingere pe alt rând** la 150 ms (în fereastra de 800 ms a reparației) și la 1 s: redenumirea se încheie (`Ex/`) și notite e ales. Fereastra nu prinde atingerile adevărate.
- **Atingere în casetă, apoi „e noi”:** rezultă „Desene noi”; textul scris nu se pierde.
- **Dublă atingere pe Proiect cu caseta deschisă:** redenumirea se încheie și Proiect se deschide (`dublu_clic / navigare / lista:Proiect`), la fel ca fără casetă și ca mouse-ul la 1366.
  - În `a_e2.py` / `a_e2c.py` dubla „nu mergea”. Era proba mea: după atingerea în casetă, lista rămâne derulată lateral cu ~25 px, iar punctul meu cădea pe partea ascunsă a rândului (`lh-ap-e-corp`).
  - Pe textul vizibil al rândului merge (`a_e2e.json`). Derularea e MINOR 5.
- **„Nou › Folder” de două ori la rând:** rezultă `A1/` și `B2/`.
- **Mouse-ul la 1366:**
  - clicul în casetă mută cursorul și păstrează „Ex”;
  - tragerea din casetă e selecție de text (`sel [0,2]`), nu tragere de fișier;
  - Ctrl+A + „lucrare” + Enter: `lucrare.docx`.

**Rămâne nesigur** (declarat corect de constructor, R19-6): un telefon adevărat (Safari iOS, tastatura virtuală).

## 3. B. Unghiul GEST_TASTATURA pe Explorer (`b_tast.py` → `b_tast.json`, `b_tast.log`; `b_prevent.py` → `b_prevent.json`)

### B1. Ce fac tastele (1366×768; ecranul = starea la fiecare pas: rândurile `data-lh-selectat` = `selectie`)
| tasta | evenimentul §4 (gest / acțiune / țintă) | starea și ecranul | referința |
|---|---|---|---|
| ↑ ↓ ← → / Shift+↓ / Home / End | `sageti` / `tasta_home_end`, `mutare_selectie`, `lista:<nou>` | selecția urcă / coboară; Shift extinde (Proiect + harta) | ← → în Detalii: fără referință (R19-2) |
| literă („d”) | `tastare / cautare_rapida / lista:Desene` | Desene ales | R19-2 |
| Esc pe listă | `tasta_esc / deselectare` | nimic ales | R19-2 |
| Enter pe folder / pe fișier | `navigare` (în Desene) / `nesimulat` „Deschideți” (mesajul pe ecran) | adresa afișată = calea | `explorer_meniu_fisier › Deschideți Enter` |
| Backspace, Alt+←, Alt+→, Alt+↑ | `tasta_backspace` / `alt_sageti`, `navigare`; Alt+→ fără istoric = `fara_efect` | calea și adresa urmează | `explorer_fereastra › Înapoi Alt+Stânga, Înainte Alt+Dreapta, Până la … Alt+Sus` |
| Alt+Enter (cu și fără selecție) | `tasta_enter / nesimulat`, mesajul „Proprietăți” | — | `explorer_meniu_fisier` / `_fundal › Proprietăți Alt+Enter` |
| Ctrl+Shift+C pe tema | `ctrl_shift_c / nesimulat`, mesajul „Copiere ca o cale” | — | `explorer_meniu_fisier › Copiere ca o cale Ctrl+Shift+C` |
| F2 / Esc / F2 + compunere CDP „ș” + „tiri” + Enter | `redenumire` / `anulare_redenumire` / `redenumire` | caseta „notite” fără extensie; „știri.txt”; Ctrl+Z → `notite.txt` | `Redenumire F2` |
| Delete / Ctrl+Z | `stergere` / `anulare` | harta în Coș și înapoi | `Ștergere del` |
| Shift+Delete, Esc / Enter în dialog | `stergere_definitiva`; Esc = `raspuns` (Nu); Enter = `raspuns`, `activat: fereastra:Da` | dialogul „Ștergere fișier” / harta ștearsă | scenariile `stergere_definitiva_*` |
| Ctrl+C, Ctrl+V în același folder, Ctrl+Z | `copiere`, `lipire` → „tema - Copie.docx”, `anulare` | ecranul = starea | `explorer_copie_acelasi_folder`, `meniu_fundal › Anulare Copiere Ctrl+Z` |
| Ctrl+X, Enter în Desene, Ctrl+V; Ctrl+A | `decupare`, `lipire`, `selectare_tot` | notite mutat | `Decupare Ctrl+X` |
| Ctrl+Shift+N + „Ex” + Enter | `ctrl_shift_n / folder_nou`, apoi `redenumire` | „Folder nou” cu caseta, apoi `Ex/` | fără referință (R19-4) |
| F4 / Ctrl+L, Esc, „Teme” + Enter | `editare_adresa`; Esc `fara_efect`; `navigare` | caseta adresei cu „Documente\Clasa a V-a” ales tot; Teme deschis | fără referință (R19-4) |
| Ctrl+E / Ctrl+F, scris, Esc; F5 | `cautare`; Esc `fara_efect / cautare`; `reimprospatare` | focusul în „Căutați”, apoi înapoi | F5 = `Reîmprospătare … (F5)` |
| Alt+D | **niciun eveniment, nimic oprit** | nimic | fără referință ([FARA_REFERINTA] 3) |
| Tab / Shift+Tab | `tasta_tab / fara_efect` | focusul nu se mută | R19-1 |
| Shift+F10 / tasta Meniu | `tasta_f10 / fara_efect` / `clic_dreapta / fara_efect / fereastra_app:explorer` | niciun meniu | R19-7 |
| meniu deschis + ↓ / Enter / literă | ↓ mută selecția din LISTĂ; Enter = „Deschideți” pe rândul ales, cu meniul încă deschis; „m” închide meniul (`tastare / fara_efect`) | — | R19-7 ([FARA_REFERINTA] 1) |

**Asistentul §6.3** (`b_tast.json › asistent`), cu pasul `bara_comenzi:Redenumire` și `dupaGreseli: 2`:
- clicul pe tema (greșeala 1) + ↑ ↑ ↓ Home End → fără indiciu: săgețile și Home/End nu sunt greșeli;
- Alt+Enter (greșeala 2) → indiciul apare.

Corect după §6.3. F2 nu face pasul „Redenumire din bară” (vezi Predarea).

**Ce spune constructorul despre taste se confirmă:**
- Alt+Enter = Proprietăți cu mesaj, nu mai intră în folder;
- Ctrl+Shift+C = mesajul „Copiere ca o cale”;
- restul tastelor cu referință se poartă ca în referință.

### B2. GRAV-urile noi

#### N1 — Pe fereastra mică (1366×657 la 125 %) mesajul „aici nu e simulată” e sub pliu: Explorer tace acolo (R12 + I1)
- **Gestul** (`a_e1.py › V4`; poligon la 1093×526 css, factor 1,25): clic pe „Acest PC” în panoul de navigare; separat, tema + Alt+Enter.
- **Ce face simulatorul:**
  - evenimentul `nesimulat` vine, iar mesajul e în DOM la `[361,570,370,35]`;
  - pagina are doar 526 px înălțime: mesajul stă între y 570 și 605, deci în afara ecranului;
  - măsurătoarea: `inPagina: false`, `deasupra: false`; rădăcina are `[0,0,1093,640]`, `scrollHeight` 640 față de `innerHeight` 526;
  - captura `iesiri/a_e1_mica_jos_crop.png`: partea de jos a ecranului, fără niciun mesaj;
  - elevul apasă și nu vede nimic.
- **Aceeași probă pe celelalte aplicații** (`c_regres.py › mica`): Word, Excel, PowerPoint, Windows au rădăcina de 526 (= ecranul), iar mesajul e în pagină la y 434-456. **Doar Explorer** iese din ecran.
- **Ce face aplicația reală:**
  - comanda lucrează: `explorer_fereastra › Panou de navigare › „Acest PC”`; `explorer_meniu_fisier › „Proprietăți” (Alt+Enter)`;
  - contractul R12 (`contract.md:38`) cere mesajul central, „nu tace”;
  - I1 (`contract.md:42`): „biblioteca merge … la 1366×657 cu zoom 125%”.
- **De ce e GRAV:**
  - e exact E1 („comenzile nesimulate tac”), pe unul dintre cele două ecrane ale contractului I1;
  - e pe drumul lecției v/m2-l09: clicul pe „Acest PC” din panoul de navigare.
- **Cauza în cod:**
  - `explorer.js:48-49`: rădăcina are înălțime fixă (`--e-h:640px`, `height:var(--e-h)`, `min-height:420px`), deci nu se strânge la ecran cum fac celelalte aplicații;
  - `aplicatii.css:157`: mesajul e așezat față de JOSUL rădăcinii (`bottom:34px`);
  - critic 15 avea deja fereastra mai înaltă decât ecranul ca MINOR 7 („bara de stare sub pliu”); cu mesajul acum vizibil, aceeași cauză îl ascunde pe fereastra mică.
  - **Reparația posibilă:**
    - rădăcina Explorer să ia `min(640px, înălțimea disponibilă)`, ca Word, Excel și PowerPoint;
    - sau mesajul să se așeze în partea vizibilă a rădăcinii.

#### N2 — În câmpurile Explorer (caseta de nume, adresa, căutarea) scurtăturile nu se opresc: F5, Ctrl+R, Alt+←, Ctrl+P … ajung la browser (api §4)
- **Gestul** (`b_prevent.py` → `b_prevent.json`). Focusul e pe rând:
  - în caseta de redenumire (F2 pe harta; caseta e deschisă și după Nou › Folder, pe drumul v/m2-l10);
  - în adresă (F4);
  - în căutare (Ctrl+E).
  - Apoi apăs F5, Alt+←, Alt+→, Alt+↑, Ctrl+L, Ctrl+E, Ctrl+F, Ctrl+D, Ctrl+P, Ctrl+S, Ctrl+R, F6, F10 …
  - Ascultătorul de pe `window` citește `defaultPrevented`.
- **Ce face simulatorul:**
  - **Cu focusul în listă** (rădăcina), toate tastele se opresc (`defaultPrevented: true`), în afară de Alt+D. Asta e regula api.
  - **Cu focusul într-un câmp**, nu se oprește niciuna (`[False]` pe toate 28, în toate trei câmpurile).
    - Biblioteca emite totuși evenimentul (ex. `tasta_f5 / tasta_f5 / lista:harta.png`), dar nu face nimic cu el.
    - Într-un Chrome adevărat tasta merge mai departe la browser: F5 / Ctrl+R reîncarcă lecția, Alt+← pleacă pe pagina din urmă, Ctrl+P deschide tipărirea, Ctrl+L / Alt+D / Ctrl+E mută focusul în bara browserului.
    - Lucrul elevului se pierde.
    - Chromium headless nu are scurtăturile browserului, deci efectul nu se poate arăta aici. Proba e `defaultPrevented: false`.
- **Ce cer api-ul și referința:**
  - **api §4 [regulă]:** „Scurtăturile aplicației (Ctrl+…, Alt+săgeți, F-uri, Tab) se opresc cu preventDefault DOAR cât focusul e în rădăcină; în câmpurile de text ale aplicației (redenumire, Save As) **Ctrl+A/C/V** rămân ale câmpului.” Câmpurile sunt în rădăcină. Excepția e numai Ctrl+A/C/V.
  - **Referința:** F5 și Alt+← / Alt+→ / Alt+↑ sunt scurtăturile aplicației (`explorer_fereastra › Reîmprospătare … (F5)`, `Înapoi Alt+Stânga`, `Înainte Alt+Dreapta`, `Până la … Alt+Sus`).
- **De ce e GRAV:**
  - încalcă api-ul (§4), cu dovadă mecanică;
  - caseta de nume e pe drumul tuturor lecțiilor (Nou › Folder o lasă deschisă; F2);
  - o tastă apăsată din greșeală acolo scoate elevul din lecție.
- **Cauza în cod:** `aplicatii.js:407` — `if (!inCamp && (e.ctrlKey || e.metaKey || e.altKey || /^F\d/.test(e.key) || e.key === 'Tab')) e.preventDefault();`. Condiția `!inCamp` scutește TOATE tastele din câmpuri, nu doar Ctrl+A/C/V (+ X / Z / Y și tastele de editare).
  - **Codul e comun** și e dinainte de runda 19 (banda Explorer nu l-a atins). Probabil atinge și câmpurile din Word / Excel (Save As), dar pe ele **n-am probat**.
  - Îl trec la Explorer pentru că e pe drumul lui. Vinovatul / banda îi aparține orchestratorului.

## 4. C. Regresul

- **Închisele și „Ce a trecut” din critic 15, pe eșantion:**
  - **O4** pe cele 18 scenarii Explorer (`iesiri/O4.log`): **18/18** la fel ca aplicația reală, 0 diferențe, 0 ecran ≠ stare.
  - **Fereastra și meniurile ±2 px** (`c_pixel.py`): aceeași pagină și aceleași gesturi, pe worktree și pe o copie cu `runde/19/inainte/{aplicatii.js, explorer.js}`. **0 pixeli diferiți și 0 ținte mutate peste 2 px** pe 8 cadre:
    - pornirea;
    - meniul Nou (72 de ținte);
    - meniul fișierului (70);
    - caseta F2;
    - dialogul Shift+Delete;
    - plus trei cadre în care Vizualizați / Sortați / meniul de fundal NU s-au deschis în proba mea (50 de ținte = fereastra goală). Pe ele nu trag concluzii.
  - Mesajul central e ascuns în comparație: el e chiar schimbarea rundei.
  - **Drumurile D1-D3 cu mouse și tastatură:** trec (B1 + `c_mica.json`).
- **Mesajul central pe celelalte aplicații** (`c_regres.py` → `c_regres.json`, cod comun schimbat în runda 19). Câte 2 gesturi nesimulate alese de mine:
  - Word: Ctrl+H, Ctrl+F;
  - Excel: Ctrl+K, Ctrl+P;
  - PowerPoint: Ctrl+P, Ctrl+F;
  - Windows: clic dreapta pe bara de activități, Enter pe pictograma „Acest PC”.
  - **8 / 8:** un singur mesaj, cu `data-lh-nesimulat` și `role=status`, sub rădăcină și deasupra la +40 / +1500 / +4000 ms; 0 cadre goale; plecat la +5,6 s.
  - **Două comenzi la rând:** un singur mesaj, al doilea, în toate patru.
  - **Windows, fereastra goală Paint / Calculator** (Start › „paint” / „calculator” › Enter): mesajul „Paint” / „Calculator” apare peste fereastră (`elementFromPoint` = mesajul, `[511,676,345,31]`). Clicul în fereastra goală e `fara_efect`.
  - **Fereastra mică:** cele patru au mesajul în pagină.
  - **Concluzia:** banda nu a stricat nimic în celelalte aplicații.
- **Fereastra mică, 2 drumuri** (`c_mica.py`):
  - D1 (Nou › Folder › „Ex Pop Ana” › Enter): meniul și caseta sunt în pagină; rezultă `Ex Pop Ana/`.
  - D2 (tema › Ctrl+C › „Teme” › Ctrl+V › Ctrl+V): dialogul de conflict e în pagină `[377,195,420,251]`, cu „Se omite acest fișier” în pagină; clic → `raspuns`.
  - Bara de stare e sub pliu (MINOR 7 vechi). Mesajul e sub pliu (N1).
- **Telefonul, 2 drumuri:** Nou › Folder cu nume și Redenumire / F2 (vezi A / E2). Mesajul central e pe ecran.

## 5. D. [FARA_REFERINTA]
1. **Tastatura într-un meniu deschis** (R19-7; e cel mai probabil drum de tastatură al elevului: Nou, ↓, Enter):
   - cu Nou deschis, ↓ mută selecția din LISTĂ;
   - Enter „deschide” rândul ales, cu meniul încă deschis (pe un folder ales ar intra în el);
   - o literă închide meniul;
   - referința are tastele de acces ale rândurilor (ex. `explorer_meniu_fisier › Redenumire`, `tasta_acces „Alt, M”`; meniul clasic: `o`, `e`, `n`), dar nu ce fac ↓ / Enter / litera.
   - De capturat: Nou deschis cu clic, ↓, ↓, Enter, cu UIA după fiecare.
2. **Tasta Meniu / Shift+F10** pe un fișier ales:
   - tasta Meniu dă `clic_dreapta / fara_efect / fereastra_app:explorer`: niciun meniu, iar ținta e fereastra, nu fișierul;
   - Shift+F10 = `tasta_f10 / fara_efect`.
   - Pe Windows deschid meniul elementului ales; nu e capturat.
3. **Alt+D** (bara de adrese, în Windows): nu emite niciun eveniment și nu e oprită. Într-un Chrome adevărat mută focusul în bara BROWSERULUI. Nu e în referință.
4. **Tab / Shift+Tab** nu mută focusul între zone (R19-1). **Esc pe listă** deselectează (R19-2).
5. **Ctrl+Shift+N:** în simulator face Folder nou, cum a declarat constructorul. Într-un Chrome adevărat e scurtătura REZERVATĂ a browserului (fereastră incognito), deci pagina n-o primește deloc. Nu se poate dovedi headless.
6. **Alt+Enter fără selecție / în Coș:** mesajul „Proprietăți” (R19-3, declarat).

## 6. D. MINOR
1. **Mesajul trăiește 5 s și înghite clicurile de sub el** (`a_e1c.py` → `a_e1c.json`).
   - **Proba:** un folder cu 17 elemente (cât `explorer_sortare_nume`, drumul D4), mesajul pe ecran. Clicul și dublul clic pe rândurile „fisa 12/13”, aflate sub mesaj, devin `clic / clic / fereastra_app:explorer`: nimic ales, nimic deschis.
   - **Martorul**, după plecarea mesajului: același punct dă `selectare / lista:fisa 12.txt`.
   - **Pe telefon** mesajul acoperă „Rețea” din panou.
   - Pentru asistent (§6.3), clicurile înghițite contează greșeli.
   - E convenția bibliotecii (Word / Excel / PowerPoint au la fel), nou doar în Explorer, unde mesajul înainte nu se vedea deloc.
   - Atenție la `pointer-events:none`: ar strica probele care caută mesajul cu `elementFromPoint`.
2. **Mesajul rămâne și peste acțiunile reușite de după el** (b_tast: „Proprietăți” stă pe ecran cât elevul redenumește, șterge, copiază). E tot convenția celor 5 s.
3. **F2 nu face pasul „Redenumire”** al asistentului. Evenimentul F2 are `tinta: lista:<fișier>`, fără `activat: bara_comenzi:Redenumire`. O lecție care cere „Redenumire” trebuie să-și scrie `asteapta`, altfel F2-ul elevului e numărat greșeală.
4. **Scrisul în bara de adrese** (Ctrl+A, Enter, Esc) are ținta `fereastra_app:explorer`, nu `adresa`. Căutarea are corect `cautare`.
5. **Pe telefon, după atingerea în caseta de nume**, lista rămâne derulată lateral cu ~25 px (pictogramele rândurilor ascunse), din cauza derulării casetei în vedere (`a_e2d_dupa.png`).
6. **Vechile MINOR 1-14 din critic 15** rămân, nereparate (declarat).

## 7. Ce a trecut
- **E1 la 1366 și pe telefon:** cele 9 gesturi, fără clipire, un singur mesaj, plecare curată, fără resturi la închidere / deschidere.
- **E2 pe 360 și 390:** toate drumurile criticului 15 și 6 gesturi vecine; mouse-ul la 1366 neschimbat, plus clicul și tragerea în casetă.
- **Tastele cu referință** (săgeți, Enter, Backspace, Alt+← → ↑, F2, Esc, Delete, Shift+Delete, Ctrl+C / X / V / Z / A, F4, Ctrl+L, Ctrl+E / F, F5, Alt+Enter, Ctrl+Shift+C): evenimentul, starea și ecranul se potrivesc. Scrisul prin compunere CDP („știri.txt”) merge.
- **O4:** 18/18.
- **Pixelii** sunt identici înainte și după, pe Nou, pe meniul fișierului, pe F2 și pe dialog.
- **Mesajul central** merge pe Word, Excel, PowerPoint, Windows, Paint și Calculator, și pe fereastra mică pentru celelalte patru.

## 8. Predarea pentru runda următoare
- **Întâi N2** (cod comun, `aplicatii.js:407`): în câmpuri se opresc și F-urile, Alt+săgeți, Ctrl+L / E / F / D / P / S / R. Rămân ale câmpului doar Ctrl+A / C / V / X / Z / Y și tastele de scris.
  - Proba: `b_prevent.py`, care cere `defaultPrevented: true` pe F5 / Alt+← / Ctrl+R în caseta de nume, iar pe Ctrl+A / C / V cere `false`.
  - De verificat același lucru în Save As (Word / Excel).
- **Apoi N1:** rădăcina Explorer să încapă în 526 px (ca celelalte aplicații) sau mesajul să stea în partea vizibilă. Proba: `a_e1.py › V4` (`inPagina: true` la 1093×526, factor 1,25).
- **Apoi MINOR 1:** de hotărât convenția mesajului (5 s peste conținut), pentru toate aplicațiile.
- **De capturat** (desktopul ascuns, UIA):
  - tastatura în meniul Nou și în meniul de clic dreapta (↓, Enter, litera de acces);
  - tasta Meniu / Shift+F10 pe un fișier ales;
  - Tab de 6 ori din listă;
  - F5 și Alt+← cu caseta de redenumire deschisă;
  - Alt+D.

GRAV_VECHI_DESCHISE: 0
GRAV: 2
