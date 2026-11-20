# Runda 18 (B-windows, prima din val) · criticul rece · unghiul ASPECT

## 1. Antet
- Cine: criticul rece al rundei 18. Am citit doar `runde/_paralel/REGULI_CRITIC.md`, `runde/18/critic_prompt.md`, `runde/18/gata_pentru_critic.md`,
  `runde/14/critic.md` (modelul), codul (`aplicatii/windows.js`, `aplicatii.js`, `poligon.html`, `_unelte/genereaza_windows.py`), contractul (R12, I1) și
  lecțiile (doar textul despre bară / Start / meniuri). N-am deschis `diferente.md`, `de_verificat.md`, `de_aprobat.md`, `raport_constructor.md`,
  `cadru.md`, `tinta.md`, `contra.md`, `stare_autor.md`.
- Uneltele mele: `runde/18/critic_probe/`. Hamul `h.py` (copiat din `runde/14/critic_probe/`): server static pe 127.0.0.1, port liber, Chromium
  headless, `ctx.route('**/*')` care abandonează tot ce nu e 127.0.0.1/localhost (`plecate = []` în toate rulările, `erori = []`). Gesturi adevărate:
  `page.mouse`, `page.keyboard`, `page.touchscreen.tap`, atingeri CDP (`Input.dispatchTouchEvent`) pentru glisări. Probele:
  - `c1.py` → `c1_out.txt` (referința `uia_windows.json` pe chei, aplatizată); `c2.py` → `c2_out.txt` (`date/windows.json` pe chei);
  - `b1.py` (1536×864 = cadrul referinței și 1366×768: bara, Start, rotița în Start, tastarea în Start, meniul nou, Nou ›, meniul clasic, clic
    dreapta lângă marginea de jos, Shift + clic dreapta; capturi `b1_*.png`);
  - `b2.py` (telefon 360×740 și 390×844 cu atingeri, laptopul I1 1366×657 la 125% = 1093×526 css, trecerea mouse-ului peste Explorer, mesajele R12,
    tastarea după clic în caseta Start, date personale în DOM; `b2_*.png`); `b3.py` (glisarea benzii din bară și a barei de titlu pe telefon, meniul
    la 125%, mesajul R12 peste rândul de jos din Start; `b3_*.png`);
  - `d1.py` (C: Word / Excel / PowerPoint / Explorer pe poligon acum față de `3ba8d797`, extras cu `git archive` doar în `critic_probe/`).
- Windows și Explorer reale nu le-am atins; Word / Excel / PowerPoint reale nu le-am pornit. N-am rulat `porti.py` / `masoara.py`.

## 2. A. GRAV-urile vechi
—  (prima rundă a valului B-windows)

## 3. B. Unghiul ASPECT — constatările noi

### W1 — Meniul nou de clic dreapta pe desktop: fundalul acoperă 2 rânduri din 10, iar jos rândurile ies sub bară — **GRAV**
- Gestul: clic dreapta pe desktopul gol (1536×864, punctul 952,200; `b1_out › 1536x864 › ev_dreapta = {clic_dreapta, meniu_contextual}`).
- Ce face simulatorul: cutia meniului are **304×69** (`meniu_nou_cutie [953,201,304,69]`), fundalul alb **288×63** (`meniu_nou_fond`); rândurile
  continuă până la y = 564 (`Afișați mai multe opțiuni [970,532,270,32]`). În captură (`b1_1536x864_meniu_nou.png`): doar „Vizualizare” și „Sortați
  după” stau pe panoul alb; „Reîmprospătare” … „Afișați mai multe opțiuni” și cele 4 linii despărțitoare plutesc direct pe tapet.
  - Lângă marginea de jos (clic dreapta la 1024,690 pe 1366×768): meniul e încadrat ca și cum ar avea 69 px (`meniu_jos_cutie [1025,652,304,69]`),
    deci „Nou” cade la y 797-829 și „Afișați mai multe opțiuni” la 983-1015, sub bară și în afara ecranului (`b1_1366x768_meniu_jos.png`: se vede doar
    „Vizualizare”, „Sortați după”, iar „Reîmprospătare” e scris peste bara de activități).
  - Pe laptopul I1 (1093×526 css): clic dreapta la y = 440 → 9 din 10 rânduri sub marginea zonei de lucru (`b3_out › laptop_125 › meniu_jos`);
    chiar și la y = 120, „Afișați mai multe opțiuni” intră 6 px sub bară.
- Ce face Windows real: un singur panou cu toate cele 10 rânduri, `uia_windows.json › meniu_desktop › ferestre[0]`: `rect_ecran_100 [870, 359, 304, 385]`,
  copiii `Vizualizare [17,6,270,32]` … `Afișați mai multe opțiuni [17,330,270,32]`, toți în interiorul ferestrei de 385 px. (`ferestre[1]`, de 304×69,
  e gazda barei de comenzi de sus, `Flyout [10,2,282,48]`, nu meniul.) Meniul clasic din simulator, făcut din `ferestre[0]` (298×391), arată corect.
- De ce e GRAV: drumurile „clic dreapta pe desktop › Nou › Folder” (v/m3-l18, m3-l19, m3-l21, vi/m1-l03: „Folder nou”) și „› Afișați mai multe
  opțiuni” (vi/m2-l11, vi/m3-l16) trec prin acest meniu; aspectul e vizibil altul decât referința, iar în jumătatea de jos a desktopului „Nou” și
  „Afișați mai multe opțiuni” nu se văd deloc (drumul nu se poate duce la capăt).
- Cauza: `aplicatii/_unelte/genereaza_windows.py:304` `meniu(S, "meniu_desktop", 1)` alege `ferestre[1]` → `date/windows.json › meniu_desktop.rect
  [0,0,304,69]` → `windows.js:382` (`mh = 69`), `:383` (încadrarea pe verticală cu 69), `:391` (fondul `bottom:5px`). O3 a dat „meniurile 0” pentru că
  compară rândurile, nu cutia meniului.

### W2 — Start › „Toate”: lista nu se derulează, 4 din 7 categorii lipsesc — **GRAV**
- Gestul: Start (clic pe butonul Start), apoi rotița în lista de aplicații (`b1.py`, `mouse.wheel(0, 2000)` pe `.lh-w-zona-apps`).
- Ce face simulatorul: la 1536×864 zona are `scrollHeight 596 = clientHeight 596` (`b1_out › zona_scroll`), deci nu se mișcă nimic; evenimentul
  `{rotita, derulare, start:EasySign}` iese, dar ecranul e identic (`b1_1536x864_start_toate.png` = `b1_1536x864_start.png`, afară de evidențierea
  dalei de sub mouse). În DOM sunt doar 3
  categorii (Productivitate, Instrumente pentru dezvoltatori, Creativitate), ca dreptunghiuri de 156×80 cu 3 pictograme generice de 28 px pe un rând,
  fără numele categoriei și fără numele aplicațiilor (doar `aria-label`).
- Ce face Windows real: `uia_windows.json › start_toate` (= aceeași suprafață, derulată în jos, `sesiune_windows_10min.md`): 7 categorii pe 3 rânduri,
  `Productivitate … [510,142,156,162]`, `Utilități și instrumente … [510,317,156,192]`, `Altele … [689,317,155,192]`, `Divertisment … [867,317,155,192]`,
  `Accesibilitate … [510,521,156,192]`; în fiecare, butoanele aplicațiilor 68×68 în grilă 2×2 (`Google Chrome [521,…,68,…]`, `Explorer, Sistem
  [589,…]`, `Excel [521,191,68,67]`). Simulatorul le sare: `windows.js:333` (`if (n.in_afara_ecranului …) return;`), `:341` (dreptunghiul categoriei
  din `start`, tăiat la 80 px de marginea listei).
- De ce e GRAV: căutarea unei aplicații în Start e drumul din v/m2-l08 („meniul Start, cu aplicații. Dai clic pe una și ea pornește”, „Pornește
  aplicația Paint din meniul Start”) și vii/m1-l03 („Start › Word”); în Windows-ul real lista se derulează la „Toate”, aici nu. Constructorul declară
  suprafața („meniul Start (+ Toate aplicațiile)”), dar O3 a comparat doar `start`, nu și `start_toate`.

### W3 — Tastarea cu Start deschis tace (R12) — **GRAV**
- Gestul: tasta Windows / clic pe Start, apoi „pai”; și: clic în caseta „Căutați aplicații, setări și documente”, apoi „calc” (`b1.py`, `b2.py`).
- Ce face simulatorul: 3 (resp. 4) evenimente `{tastare, tastare, fereastra_app:windows, dif:false}`, niciun mesaj (`b1_out › mesaj_dupa_tastare = []`),
  focusul rămâne pe rădăcină, caseta arată tot textul-indiciu (`b2_out › d1366 › tastare_in_caseta.text_caseta`; `b2_d1366_caseta_calc.png`). Doar clicul
  pe casetă dă mesajul standard; tastarea directă după tasta Windows nu dă nimic.
- Lecția: v/m2-l08, „Nu-l vezi? Scrie „pai” și dă clic pe Paint” și „Pornește Calculatorul din meniul Start. Nu-l vezi? Scrie „calc”…”.
- De ce e GRAV: contractul R12 („o comandă afișată și nesimulată dă mesajul central standard …, nu tace”); panoul de căutare e „[NEVERIFICAT]”, deci
  i se cere exact asta: să spună că nu e simulat. Cauza: `windows.js:500-527` (`tasta`) n-are ramură pentru taste-literă cu Start deschis → `null`.

### W4 — Bara de activități: aplicațiile nu se pot recunoaște (Explorer nu e „dosarul galben”, niciun nume la trecerea mouse-ului) — **GRAV**
- Gestul: privesc bara; țin mouse-ul 1,5 s pe butonul Explorer (`b2.py`, `b2_d1366_hover_explorer.png`).
- Ce face simulatorul: pictogramele fixatelor sunt glife monocrome generice: Microsoft To Do = „listă”, **Explorer = „straturi”** (teancul de foi),
  Notepad++ = „notepad”, Chrome = „glob” (`b1_1536x864_bara.png`). La trecerea mouse-ului nu apare nimic: niciun element vizibil cu „Explorer”, niciun
  `title` (`b2_out › indiciu_explorer = {vizibile: [], title: []}`).
- Lecțiile: zece lecții spun „clic pe dosarul galben din bara de activități” ca drum spre Explorer (v/m2-l08, m2-l09, m2-l10, m2-l15, m3-l17,
  m4-l29, m5-l36, vi/m2-l11, vi/m3-l17, vii/m2-l11); v/m2-l08: „pictograme de aplicații, de exemplu un dosar galben (lecția 9). Ții săgeata pe una și
  îi vezi numele”.
- Referința: UIA nu prinde pictogramele, deci forma nu se poate dovedi din `uia_windows.json`; o trec la GRAV pe prima jumătate a scării („elevul nu
  poate duce la capăt un drum din lecție”): pe ecran nu există niciun dosar galben și nici numele la trecerea mouse-ului, singurele două indicii pe care
  le dă lecția. (Pe desktop simulatorul știe să deseneze dosarul galben: `.lh-w-forma.f-folder`, `windows.js:27-28`.)
- Cauza: `windows.js:255` (`/Explorer/ → 'straturi'`); nicio trecere a mouse-ului tratată în `windows.js` și nici în `aplicatii.js`.

### W5 — Telefonul (360-390 px): butoanele ferestrei și butonul aplicației din bară nu se pot atinge — **GRAV** (I1)
- Gestul: poligonul la 360×740 și 390×844 (`is_mobile`, atingeri).
- Ce face simulatorul:
  - Fereastra „Acest PC” e desenată la x = 161, lățime 360, deci iese 160 px în dreapta: Minimizare / Maximizare / Închidere la x = 382 / 428 / 474,
    toate în afara ecranului (`b3_out › tel_360 › butoane_titlu`). Glisarea barei de titlu nu o mută (niciun eveniment, starea rămâne x = 160).
  - Bara: aplicațiile stau într-o bandă derulabilă de **120 px** (`b2_out › tel_360 › mijloc [489, 120, 120]`), fără niciun semn că se derulează; în
    ea se văd doar Start și lupa. Butonul Explorer e la x = 358 în bandă; după o glisare banda e goală (`b3_tel360_bara_glisata1.png`), după trei
    glisări apar Vizualizare activități și To Do, Explorer tot nu (`b3_tel360_bara_glisata3.png`, `explorer_dupa_3 [133,…]`, dincolo de marginea de
    120 px). Între lupă și Vizualizare activități rămân ~178 px goi.
- De ce e GRAV: contractul I1 („biblioteca merge la 360-390 px”); drumul din v/m2-l08 „Ascunde-l cu Minimizare (liniuța), apoi readu-l cu un clic
  pe pictograma lui” nu se poate face pe telefon: nici liniuța, nici pictograma nu se văd.
- Cauza: `windows.js:193` (fereastra încadrată doar cu `x ≤ zona.w − 120`, nu cu `x + w ≤ zona.w`); `:295` (`latTava` luată din referință, 382 px, în
  loc de tava îngustă desenată, ~205 px → `lat = max(120, …)` = 120); `:272` (pașii din referință păstrați deși caseta Căutare se strânge la 44 px).

### Abaterile „voite”
- **A18-1** (cele 4 butoane ale aplicațiilor deschise pe PC-ul profesorului nu sunt desenate): **corectă**. Sunt stare, nu configurație; grupul din
  mijloc rămâne centrat după regula referinței (decalajul ei de −3,5 px față de centru, `windows.js:269`), iar butonul aplicației deschise ia numele
  din șablonul referinței („Explorer - 1 fereastră deschisă”, ca „Google Chrome - 1 fereastră deschisă”). La 1536×864 Start ajunge la x = 521 în loc de
  432: 88 px = jumătate din cele 4 butoane lipsă (4 × 44 / 2), plus 1 px marginea rădăcinii — același lucru îl face bara reală când are mai puține
  butoane. Nu ascunde altceva.
- **A18-2** (ceasul arată ora curentă): **corectă**. Lecția v/m2-l08 cere „citește ceasul … scrie ora” și „sus ora, dedesubt data”: simulatorul arată
  `23:02 / 20.11.2026` pe două rânduri, formatul referinței (`Ceas 19:48\n‎20.‎11.‎2026`), la [1455,816,66,48] față de [1454,0,66,48]. Ceasul se
  reîmprospătează la 30 s (nu în modul oracol), deci poate rămâne în urmă cel mult 30 s (MINOR, §6).

### Date personale
- Pe ecran și în atributele DOM nu ajunge nimic personal (`b2_out › d1366 › text_tot / atribute`, 114 valori): contul = „[utilizator]” în Start,
  rețeaua = „Rețea [rețea ascunsă]”, OneDrive = „OneDrive - [cont]”, dala ascunsă = goală, fără etichetă. Numele contului, folderele fixate ale omului,
  „PhoneToPC” nu apar.
- În `date/windows.json › bara_activitati.deschise_ref` rămân `KeePassXC`, `Terminal - 7 ferestre deschise` și id-ul profilului Chrome
  `Appid: Chrome.mcpchrome58bdb62.Default` (nedesenate; servesc doar la pași). Nu sunt date personale, dar n-au ce căuta într-o bibliotecă pentru elevi:
  MINOR (§6).

## 4. C. Regresul
- Codul comun atins de banda Windows e doar adăugat (`git diff 3ba8d797 HEAD`, `critic_probe/diff_comun.txt`): `aplicatii.js:79` (`SURSE_APP.windows`),
  `poligon.html` (comentariul + `P.windows`). `stare.js`, `panglica.js`, `aplicatii.css` neatinse. Lecțiile, jocurile și `aplicatii/` fără modificări
  necomise acum (`git status`).
- `d1.py` (`d1_out.json`), poligonul la 1366×768, acum față de biblioteca de la `3ba8d797` (înainte de ciclul A, extrasă cu `git archive` în
  `critic_probe/inainte_3ba8d797`):
  - Word: 149 de controale marcate și acum, și înainte; Alt → `arata_taste_acces`, Esc → `iesire_taste_acces`, Ctrl+B → `format_la_scriere`, identic.
  - Excel: 228 / 228; Alt, Esc identic; Ctrl+B → `aldin`, identic.
  - PowerPoint: 138 / 138; Alt, Esc identic; Ctrl+B → `fara_efect`, identic.
  - Explorer (banda 15) pornește pe poligon (51 de controale); Windows (28). Nicio eroare de pagină, nicio cerere în afara 127.0.0.1.
- Banda Windows n-a stricat nimic în Word, Excel, PowerPoint sau Explorer. (Ce au schimbat benzile 16-17 în `word.js` / `excel.js` nu e al meu de
  judecat; pe gesturile de mai sus nu se vede nicio diferență.)

## 5. [FARA_REFERINTA]
- **Alimentare** are pictograma „pornire” = un triunghi ▷ (`date/windows.json › icoane.pornire`, calea `M17.22 8.69 … l-10 5.5 …`); v/m2-l08 o descrie
  „un cerc cu o linie sus, pe Windows 11 jos în dreapta”. Locul e bun ([998,752,40,40] față de [996,750,40,40]); forma n-o dovedește UIA. Același
  triunghi stă pe dala „Ceas” și pe „Confidențialitate” din tavă.
- **Textul dalelor din Start** = numele UIA întreg: „Browser, Folder cu elemente 6”, „MS Office, Folder cu” (tăiat), „DaVinci Resolve, Folder cu”
  (tăiat); în Windows dala unui folder arată probabil doar „MS Office” și o mini-grilă de pictograme (R18-1 la constructor). La fel: „Vizualizare
  selectată, Categorie” scris întreg (butonul real e probabil „Categorie ▾”), „Afișați mai puțin…” tăiat, „Google Drive Adăugate recent” pe un rând.
- **Pictogramele tăvii**: indicatorul de limbă desenat ca „≡” (cel real arată de obicei literele limbii), rețeaua ca glob (în Windows 11 globul
  înseamnă „fără internet”, iar numele spune „Acces internet”), locația ca ▷; Widgeturi cu „sparkle” în loc de vreme, fără insigna „1”
  (`WidgetsBadgeText` e în referință).
- **Meniul clasic** fără pictograme (Terminal, PowerShell, PDF24, Agent Ransack au pictograme în meniul real) și cu colțuri drepte; în Windows 11 și
  meniurile #32768 au colțuri rotunjite.
- **Submeniul Nou** (luat din Explorer, R18-2): „Folder” cu glifa „straturi”, nu cu dosarul galben.
- **Categoriile din „Toate”** n-au numele categoriei sub dală (vezi W2); dacă îl au în real, nu se vede din UIA.

## 6. MINOR
- Mesajul R12 (`aplicatii.js:221-232`, în Windows `z-index:40; bottom:60px`) cade peste rândul de jos al Start-ului; cu o etichetă lungă (o categorie,
  ~100 de caractere) acoperă și „Alimentare”, iar clicul pe mesaj închide Start (`b2_out › d1366 › r12 › Alimentare = {clic, fereastra_app:windows}`,
  Start închis). Cu o etichetă scurtă („Setări”) nu-l acoperă (`b3_out › mesaj_1366`). Ține 5 s.
- Panoul Start are opacitate 0,97: fereastra Explorer de dedesubt se vede ca un dreptunghi mai deschis (`b1_1366x768_start.png`).
- Telefon: „Afișați desktopul” are 12 px lățime (< 32) și iese 1 px din ecran; ceasul se redesenează la 30 s, nu la schimbarea minutului.
- Clic dreapta pe corpul ferestrei (Explorer, generică) → `fara_efect`, fără mesaj (`b2_out › laptop_125 › ev_meniu`); devine R12 când lecțiile vor
  cere meniul în Explorer (R18-7).
- Ținte: clic dreapta pe desktopul gol și tastarea în Start au ținta `fereastra_app:windows`, nu `desktop` / `start` (api §4, „ținta”).
- `date/windows.json › deschise_ref` păstrează `KeePassXC`, `Terminal - 7 ferestre deschise`, `Chrome.mcpchrome58bdb62.Default`; ajung doar
  dreptunghiurile. Locurile ascunse au două nume diferite: „[cont]” (OneDrive) și „[utilizator]” (Start).

## 7. Ce a trecut
- **Bara la 1536×864**: toate cele 19 butoane desenate stau la ±1 px de referință (marginea rădăcinii): tava [1155…1525] față de [1154…1524], ceasul
  66×48, caseta Căutare 219×32 cu colțuri de 16 px, Start 45×48; înălțimea 48; grupul din mijloc centrat cu regula referinței; Segoe UI 12 px;
  aplicația deschisă are linia de dedesubt (albastră, 16 px, când e activă); numele în română, ca în referință.
- **Start la 1536×864**: panoul [369,67,800,750] față de [368,66,800,750]; cele 28 de noduri vizibile la +2 px, în ordinea și cu tipurile referinței
  (Button / Group / ListItem / List); antetele „Fixate”, „Recent”, „Toate” 14 px semibold; contul = „[utilizator]”; dala ascunsă fără etichetă.
- **Meniul clasic**: 15 rânduri, numele, ordinea, „Lipire” gri (`dezactivat` în referință), „Ctrl+Z”, înălțimile 26 / 24 px, cutia 298×391; la
  marginea de jos urcă deasupra punctului, corect ([1025,330,298,391] la 1366×768). Shift + clic dreapta îl deschide direct.
- **Meniul nou**: numele, ordinea, „Ctrl+Z”, săgețile pe rândurile cu `extins:false`, rândurile de 32 px, liniile despărțitoare — corecte (doar cutia,
  W1). „Nou ›” se deschide spre stânga când nu încape (1366); Esc închide pe rând submeniul, meniul, Start.
- **R12 la clic**: Căutare, Widgeturi, Vizualizare activități, Ceas, Rețea, To Do, caseta din Start, dala MS Office, categoria Productivitate,
  „Vizualizare selectată”, Alimentare (și pe telefon) dau mesajul standard.
- **Telefon, Start**: încape (344 / 374 px), toate nodurile ≥ 32 px, lista se derulează (982 > 448), pagina fără derulare orizontală.
- **Date personale**: nimic personal pe ecran sau în DOM.
- **C**: Word, Excel, PowerPoint identice cu înainte de ciclu; Explorer pornește.

## 8. Predarea pentru runda următoare
- De reparat întâi, în ordine:
  1. **W1**: `genereaza_windows.py:304` → `ferestre[0]` (304×385); încadrarea pe verticală cu înălțimea reală (meniul urcă deasupra punctului când nu
     încape). La O3: o verificare a cutiei suprafeței (lățime × înălțime), nu doar a rândurilor — „meniurile 0” a ascuns W1.
  2. **W5**: fereastra încadrată cu `x + w ≤ lățimea`; pe telefon, banda din bară măsurată pe tava îngustă desenată, fără golul de 178 px, cu aplicația
     activă adusă în vedere.
  3. **W3**: tastarea cu Start deschis → mesajul standard (sau panoul de căutare, după ce e capturat).
  4. **W4**: Explorer = dosarul galben pe bară (glifa există deja pe desktop); numele UIA ca indiciu la trecerea mouse-ului.
  5. **W2**: `start_toate` desenat (lista derulabilă, cele 7 categorii la pozițiile referinței, butoanele 68×68 în grilă 2×2); de pus în O3 și cheia
     `start_toate`.
- Referințe de capturat pentru suprafețele „[NEVERIFICAT]” care contează pentru lecții:
  - **panoul de căutare din Start** după „pai” și după „calc” (v/m2-l08) — UIA + o captură decupată;
  - **meniul Alimentare** (Stare de repaus / Închidere / Repornire) (v/m2-l08);
  - **Securitate Windows** (vi/m2-l11, 23 de mențiuni) — cea mai folosită suprafață fără referință;
  - **pictogramele** barei și ale Start-ului: o captură de ecran decupată (UIA nu le prinde), ca W4 și §5 să poată fi judecate pe referință; plus
    indiciul de la trecerea mouse-ului pe un buton din bară;
  - **fereastra generică** (bara de titlu Windows 11 cu Minimizare / Maximizare / Închidere, v/m2-l08) și **desktopul** cu pictogramele implicite;
  - **calendarul de la ceas** (v/m2-l08 citește ceasul); **un folder din Start deschis** (MS Office) și **o categorie din „Toate” deschisă**
    (vii/m1-l03 „Start › Word”); **submeniul Nou al desktopului** (R18-2).

GRAV_VECHI_DESCHISE: 0
GRAV: 5
