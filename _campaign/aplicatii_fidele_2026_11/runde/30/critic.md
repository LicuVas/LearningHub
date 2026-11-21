# Runda 30 (B-windows#2, ciclul paralel D) · criticul rece · unghiul ASPECT

## 1. Antet
- Cine: criticul rece al rundei 30. Am citit `runde/_paralel/REGULI_CRITIC.md`, `runde/30/critic_prompt.md`, `gata_pentru_critic.md`,
  `raport_constructor.md`, `api_propunere.md`, `runde/26/critic.md` (GRAV-urile vechi, modelul), diff-urile rundei
  (`diff_aplicatii_js_runda30.txt`, `diff_windows_js.txt`) și diferența mea `aplicatii.js` 24fd4eb5 → acum (`critic_probe/diff_aplicatii_24fd_acum.txt`:
  zonele r30 + blocul r28 din `L.asistent`, `:657-726`).
- Uneltele: `runde/30/critic_probe/` (hamul `h.py` al criticilor 22/26, plus `eva()` = evenimentele cu aplicația, `mont()` = fereastra montată,
  `subst()` = alt fișier servit prin `ctx.route`, pentru A/B). Server static pe 127.0.0.1, port liber; Chromium headless; `ctx.route('**/*')`
  abandonează tot ce nu e 127.0.0.1/localhost. În toate rulările: cereri plecate 0, erori de pagină 0. Gesturi adevărate: `page.keyboard`,
  `page.mouse`, `page.touchscreen.tap`, glisare CDP `Input.dispatchTouchEvent`.
- Windows / Explorer reale nu le-am atins; Office real nu l-am pornit. N-am rulat `porti.py` / `masoara.py`; git doar citit (`git show 24fd4eb5:…`).
  `runde/8/proba_grav.py --doar K2` rulat direct, cu `LH_IESIRE` = `critic_probe/iesiri`, ieșirile în `critic_probe/iesiri/k2_*.json`.
- Alte benzi: r28 (`L.asistent`, `aplicatii.js:657-726`), r27 (`explorer.js`, 07:22), r29 (`excel.js`, 07:37). Ce vine de la ele e notat ca atare.

## 2. A. GRAV-urile vechi (W4, N1, N2 din `26/critic.md`)

### N1 — focusul după redenumirea pe desktop: **ÎNCHIS**
- Gestul criticului 26 (`a1_out › N1`): clic dreapta pe desktop › Nou › Folder, „Teme”, Enter → `tasta_enter / redenumire`, „Teme” selectată,
  focusul pe rădăcina Windows; Delete → `tasta_delete / mutare_in_cos`, „Teme” pleacă.
- Vecinii:
  - Nou › Folder, Esc → `anulare_redenumire`, „Folder nou” selectat, focusul pe rădăcină; F2 → `redenumire_incepe`; Esc; tasta Windows →
    `tasta_windows / deschide_start` (cu `activat`), Start pe ecran; Esc → `inchide_start`, focusul înapoi pe rădăcină;
  - F2, Ctrl+A, Backspace, Enter (nume gol) → numele rămâne, focusul pe rădăcină; F2, „Proba”, clic pe desktopul gol → numele „Proba” se
    păstrează, selecția se șterge (`deselectare`), F2 apoi dă `fara_efect` (eveniment, nu tăcere).
- `compara()` (starea §5 față de ecran) = [] la toate. Cauza reparată: `windows.js:223-227`.

### N2 — Windows + Spațiu și celelalte taste care nu sunt litere: **ÎNCHIS**
- Gestul criticului 26 (`a1_out › N2`): Windows ținut 150 ms + Spațiu → un singur `win_spatiu / nesimulat`, mesajul „În aplicația reală,
  „Windows + Spațiu” funcționează…”, Start închis, focusul pe rădăcină.
- Vecinii, toți cu un singur gest și Start închis: Windows + 1 / . / , / Tab / ↑ / D / Shift+S / F1 / Enter / Esc / Backspace → `win_1`, `win_punct`,
  `win_virgula`, `win_tab`, `win_sus`, `win_d`, `win_shift_s`, `win_f1`, `win_enter`, `win_esc`, `win_backspace`, cu numele tastei în mesaj
  („Windows + ↑”, „Windows + Shift + S”). Start deschis cu mouse-ul, apoi Windows + Spațiu → același gest, Start închis. Windows ținut + Spațiu
  de două ori → două `win_spatiu`. Cu Paint activ → același gest, fereastra rămâne. Din Explorer-ul montat (`a1b_out › 7b-7d`): Windows + D /
  Shift+S / Spațiu → gesturile Windows cu ținta `fereastra_app:explorer`, mesajul, Explorer-ul nu le vede (Ctrl+E în el rămâne al lui: `ctrl_e / cautare`).
- **A26-2** (Start la ridicarea tastei): între `down('Meta')` și `up` → 0 evenimente, Start închis; la ridicare → `tasta_windows / deschide_start`
  cu `activat: bara_activitati:Start`; Windows + E nu mai emite `tasta_windows`. Comportamentul declarat se confirmă; îl închide orchestratorul.

### W4 — Explorer pe bara de activități: **ÎNCHIS pe PC** (telefonul → constatarea nouă N4, §3)
- Gestul criticului 26 (`a1_w4_out › W4`, 1366×768, fără ferestre, `continut.explorer` = folderul de lucru al poligonului Explorer): clic pe
  dosarul galben → `windows / clic / pornire_aplicatie` (ținta `bara_activitati:Explorer`), Explorer-ul bibliotecii în corpul unei ferestre
  [124,35,1120,619], montat în 58 ms, titlul „Clasa a V-a - Explorer”, focusul în Explorer, `radacini()` = windows + explorer (`a1_w4_montat.png`).
- Ce cerea promptul, gest cu gest:
  - clic pe un rând, dublu clic pe „Desene”, Alt+↑, clic dreapta + Esc, rotița, săgeți / literă / Ctrl+C / Ctrl+V / Tab / Backspace / F5 în
    Explorer → **numai evenimente `aplicatie: explorer`**, niciunul al gazdei; titlul urmează folderul („Desene - Explorer” și înapoi);
  - Minimizare → fereastra pleacă, butonul rămâne în bară, Explorer-ul trăiește în „parcare”; clic pe dosarul galben → `restaurare`, același folder,
    focusul în Explorer; Maximizare → [1,1,1364,718] cu bara la y 719 (MINOR S3 al criticului 26 reparat); Închidere → `inchidere_fereastra`,
    instanța Explorer închisă (`stare('explorer')` = null);
  - redenumirea + redesenarea gazdei (`a1b_out › 3`): notite.txt, F2, „abc”, fereastra 1366 → 1280, „d”, Enter → `abcd.txt`; Minimizare în timpul
    redenumirii → numele „xy” se păstrează (ca la pierderea focusului în Windows), readucerea → focusul în Explorer;
  - drumul lecțiilor (`a1b_out › 2`): Windows + E → Explorer; dublu clic „Proiect” → „Proiect - Explorer”; clic „plan.txt” → selectat; Alt+↑ → înapoi;
  - Windows + E de pe desktop, „expl” + Enter în Start → Explorer montat; Windows + E cu el deschis → `activare` (A30-1, declarat).
- Vecinii de margine: dosarul galben + Închidere înainte de montare → nicio instanță rămasă; Paint deasupra, clic în Explorer → Explorer activ și în
  față (`a1c_out › paint_deasupra`); tasta Windows din Explorer → Start, Esc → focusul înapoi în Explorer.
- Rămân, ca abateri: **clicul pe bara de titlu a ferestrei montate** scoate tastele din Explorer (N3, §3); butonul „Explorer, Sistem” din Start dă
  mesajul, deși constructorul și `api_propunere.md` spun că „Explorer” din „Toate” deschide Explorer-ul (MINOR, §6); dublu clic pe dosarul galben
  lasă fereastra minimizată ([FARA_REFERINTA], §5).
- De ce ÎNCHIS: la 1366, 1280 (redesenare), 1920 și 1093 la 125 % (`b1_out`, §3) drumul lecțiilor „clic pe dosarul galben → Explorer →
  folderul …” se duce la capăt, iar Explorer-ul montat se poartă ca fereastra lui și ca Explorer-ul de sine stătător. Pe telefon mecanismul merge
  (după glisare, `a1_w4_out › W4_tel_360/390`: montat maximizat, butoanele pe ecran, atingerea pe rând = 0 evenimente ale gazdei, Închidere),
  dar dosarul nu se vede: îl număr separat (N4), pentru că e altă cauză (banda barei), nu montarea.

### Regresul schimbărilor comune ale rundei 30 (`aplicatii.js`)
- `a2.py` → `a2_out.json`: A = `aplicatii.js` de acum; B = același fișier cu cele 4 zone ale rundei 30 puse înapoi (`patch -R` cu
  `diff_aplicatii_js_runda30.txt` → `aplicatii_B.js`; B diferă de 24fd4eb5 doar prin blocul r28). Pe poligonul fiecărei aplicații: clic, 31 de
  taste (Ctrl + 15 litere, Ctrl+Shift+N, Meta + b/e/c/Shift+S, **Meta + Spațiu / 1 / . / Tab / ↑ / Enter / F1, Meta singur**, Ctrl+S, Esc ×2),
  dublu clic, clic dreapta, Esc, tragere, rotița; la 360×740 atingeri.
  - Word, Excel, PowerPoint, Explorer: **0 diferențe** de evenimente (47 pe aplicație), starea finală identică, aceleași ținte (95 / 1246 / 113 / 49);
    pe telefon la fel (atingerile). Capturile finale Word / Excel au ieșit diferite la prima rulare; rerulat cu capturile pe disc (`a2png.py`):
    0 px diferență A/B, iar A/A identic (`a2aa.py`) → a fost ritmul mașinii, nu codul.
  - Windows: diferă exact ce e voit (A26-2: `tasta_windows` nu mai vine înaintea lui `win_*`; N2: `win_spatiu` etc. în loc de tăcere).
- Explorer-ul deschis normal (`poligon.html?aplicatie=explorer`): evenimente, stare, captura după clic și captura finală identice A/B.
- Clicul pe o aplicație nemontată: `closest('[data-lh-aplicatie]')` = propria rădăcină, deci P1 nu schimbă nimic (0 diferențe la clic / dublu clic /
  tragere / clic dreapta / atingere).
- **K2 de la runda 8** (`runde/8/proba_grav.py --doar K2`, asistentul pe Excel după Enter pe OK): A (acum) pică 1 (`pas() = 1`), **B (fără zonele
  rundei 30) pică la fel**, C (`aplicatii.js` de la 24fd4eb5, adică fără r28 și fără r30) trece 0. Deci nu e runda 30: diferența B → C e doar blocul
  r28 din `L.asistent` (`REFUZ` / `EDITARE_CAMP` / `inCamp`, `aplicatii.js:657-726`). Niciuna din zonele r30 (`I.emite`, `deschideSuprafata` cu
  2 argumente, ramura Meta din `gestTasta`, P1 din `pointerdown`) nu e pe drumul Enter-ului într-o fereastră Excel.

## 3. B. Unghiul ASPECT (și ce am găsit pe drum) — constatările noi

### Măsurătorile, pe ecranele clasei (`b1_out.json`, `b4_out.json`, `c22a1_out.json`; capturi `b1_*_fer.png`, `b1_*_tot.png`)
| ecran | fereastra Explorer montată | butoanele ei | sub bară? | pagina |
|---|---|---|---|---|
| 1366×768 | [124,35,1120,619]; max [1,1,1364,718] | 3/3 pe ecran (`elementFromPoint`) | jos 654 / 719 ≤ bara 719 | 1366 |
| laptop 1093×526 la 125 % | [100,23,896,411]; max [1,1,1091,476] | 3/3 | 434 / 477 ≤ 477 | 1093 |
| SMART 1920×1080 | [194,74,1534,814] = dreptunghiul referinței | 3/3 | 888 / 1031 ≤ 1031 | 1920 |
| telefon 360 / 390 | maximizată [1,1,358,690] / [1,1,388,794] | 3/3 | 691 / 795 = bara | 360 / 390 |
- Bara, Start, meniul desktopului (probele criticului 22, rulate din nou: `c_r22_a1.py`, `c_r22_b2.py`; diferența cheie cu cheie față de
  `26/critic_probe` în `c_regres_diff.txt`): meniul desktopului 10 rânduri la ±2 px față de `uia_windows.json › meniu_desktop` la 1536 / 1366 / 1093
  (`dif_fata_de_ref = []`), submeniul Nou 21 / 21 vizibile; „Toate” 7 categorii și 21 de butoane la ±2 px (`start_toate`), rotița derulează. Identic cu
  runda 26; singurele diferențe sunt cele voite (W4) și butoanele ferestrei pe telefon cu 2 px mai la stânga (fereastra intră acum în chenarul rădăcinii).
- Fonturile: titlul ferestrei, ceasul, caseta și dalele Start în „Segoe UI” 12 px; lista Explorer-ului „Segoe UI Variable” 12 px. UIA nu are fonturi
  → [FARA_REFERINTA].
- Fereastra montată față de `uia_explorer.json › explorer_fereastra` (la 1920 are exact dreptunghiul referinței, 1534×814, deci se compară direct):
  butoanele Minimizare / Maximizare / Închidere [1395,2,46,30] / [1441,2,46,30] / [1487,2,46,30] față de [1387,1,47,30] / [1434,1,46,30] /
  [1480,1,47,30] — la fel față de marginea vizibilă (referința include 7 px de margine invizibilă). **Dar sus nu e fila:** referința are fila
  „sesiune” [12,8,248,32] cu „Închideți fila” și „Adăugați o nouă filă”, pe o bandă de 40 px; fereastra montată are bara generică a shell-ului
  (32 px, textul „Clasa a V-a - Explorer”), deci rândul de navigare e la y 41 în loc de 48 (Înapoi [20,41,32,32] față de [19,48,32,32]), adresa
  [211,42,916,30] față de [209,48,920,32]. Explorer-ul de sine stătător are fila ([94,10,248,32]). MINOR (§6): nicio lecție nu folosește filele
  Explorer-ului (am căutat „filă nouă” / „Ctrl+T”: doar Edge), iar titlul arată folderul.

### N3 — clicul pe bara de titlu a ferestrei Explorer montate (activă) scoate tastele din Explorer: F2 redenumește o pictogramă de pe desktop, ascunsă sub fereastră; Delete și Ctrl+C tac — **GRAV**
- Gestul (`a1d_out.json`): clic pe dosarul galben → Explorer; clic pe „notite.txt”; **clic pe bara de titlu** (o zonă fără butoane), apoi F2 /
  Delete / Ctrl+C / ↓. Vecinul: tragerea de bara de titlu (mutarea ferestrei), apoi Delete.
- Ce face simulatorul:
  - clicul → `windows / clic / fara_efect` (ținta `fereastra_app:explorer`); fereastra rămâne activă (titlul închis la culoare), notite.txt rămâne
    selectat în Explorer, dar `document.activeElement` = rădăcina Windows;
  - F2 → `windows / tasta_f2 / redenumire_incepe`: **„Acest PC” de pe desktop intră în redenumire, sub fereastra Explorer** (ico `[Acest PC]*`);
    ce scrie elevul apoi intră în numele pictogramei de pe desktop, nu al fișierului;
  - Delete → `windows / tasta_delete / fara_efect`, fără mesaj (notite.txt rămâne); Ctrl+C → `windows / ctrl_c`, fără mesaj, nimic copiat;
    ↓ → `windows / sageti`;
  - după tragerea de bara de titlu focusul rămâne în Explorer și Delete → `explorer / tasta_delete / stergere` (corect): doar clicul simplu strică.
- Ce face Windows-ul real: fereastra activă își păstrează focusul tastaturii când dai clic pe bara ei de titlu; F2 / Delete lucrează pe fișierul
  selectat (scenariile Explorer: F2 = redenumirea selecției, Delete = Coșul; `uia_explorer.json › explorer_fereastra › observat_vizual.f2_pe_tema_docx`).
  Focusul după clicul pe titlu nu e capturat în UIA (de capturat, §8).
- De ce GRAV: drumul lecției v/m2-l10 („selectezi, F2, scrii, Enter”, „Delete: în Coș”) pe Explorer-ul deschis din dosarul galben se rupe după un
  gest obișnuit (clic pe titlu ca să „aleagă fereastra”), iar efectul e vizibil altfel decât în realitate: redenumirea pornește pe o pictogramă ascunsă,
  Delete / Ctrl+C nu fac nimic și nu spun nimic. Contrazice și textul propus de constructor pentru api (§1: „Activarea ferestrei îi dă focusul”,
  „celelalte taste … sunt ale Explorer-ului”).
- Cauza: `windows.js:906` — clicul pe o fereastră deja activă întoarce `fara_efect` fără să dea focusul înapoi Explorer-ului montat (pointerdown-ul pe
  ramă / titlu a mutat focusul pe rădăcina shell-ului); doar activarea unei ferestre inactive pune `M.focusMont` (`activeaza`, `:296`), iar tragerea
  trece prin `deseneazaFerestre` (`:1039`), care îl readuce. Reparația firească: la clic pe rama / titlul ferestrei montate active, `f.mont.api.focus()`.
- Nou, al rundei 30 (montarea e nouă).

### N4 — pe telefon (360 / 390) dosarul galben nu se vede: drumul „clic pe dosarul galben” nu se poate începe — **GRAV** (I1 + drumul lecțiilor)
- Gestul (`a1_w4_out › W4_tel_360/390`, `b3_out › tel360_*`, captura `a1_w4_tel360_bara.png`): poligonul fără ferestre, la 360×740 și 390×844.
- Ce face simulatorul: bara arată Start, căutarea, Vizualizare activități, To Do și tava; banda din mijloc (`.lh-w-mijloc`, 46…166 px, 264 px de conținut)
  taie dosarul galben (x 178, `elementFromPoint` în centrul lui = tava). Abia după o glisare a benzii (nimic nu arată că se poate) ajunge la x 53;
  atingerea lui montează atunci Explorer-ul corect. Căile vecine: Windows + E nu există pe telefon; butonul „Explorer, Sistem” din Start dă mesajul
  (MINOR 1, §6); merge doar căutarea „expl” (`b1_out › tel360`: Start, caseta, „expl”, atingere pe rezultat → montat).
- De ce GRAV: 9 lecții numesc dosarul galben din bară ca drum spre Explorer (v/m2-l09, l10, l15, m3-l17, m4-l29, m5-l36, vi/m2-l11, vi/m3-l17,
  vii/m2-l11; de ex. v/m2-l09: „clic pe dosarul galben din bara de activități”), iar contractul I1 cere biblioteca la 360-390 px. Elevul de pe telefon nu vede ce i se cere să atingă.
  Precedentul (criticul 26: butonul Paint minimizat ieșit din bandă = MINOR) e altfel: acolo elevul tocmai pusese butonul acolo; aici e primul pas.
- Vechi ca așezare (identic cu `inainte/windows.js`: `b3_out › tel360_inainte` = [178, nevăzut]); cu poligonul care are o fereastră Explorer, banda
  sare la ea și dosarul se vede (x 84). Constructorul l-a declarat ca R30-6 („de hotărât”). Cauza: `deseneazaBara` (banda pornește de la stânga, iar
  pe ecranul îngust încap doar 2-3 butoane); reparația firească: fără ferestre, banda pornește cu aplicațiile fixate în vedere.

### N5 — lecția v/m2-l08: dublu clic pe bara de titlu și tragerea colțului ferestrei tac — **GRAV** (R12)
- Gestul (`b2_out.json`, `b3_out.json`, `b3_paint_dublu_titlu.png`): Paint din Start (și fereastra Explorer montată); dublu clic pe bara de titlu;
  din nou; apoi tragerea colțului din dreapta jos spre mijloc.
- Ce face simulatorul: `clic / fara_efect` ×2 + `dublu_clic / dublu_clic`, fereastra rămâne „normal”, **niciun mesaj**; la colț cursorul e `auto`
  (nu săgeata cu două vârfuri), tragerea dă `selectie`, fereastra rămâne 640×420, niciun mesaj. La fel pe Explorer-ul montat (acolo tragerea din colț
  devine o selecție în lista Explorer-ului).
- Lecția v/m2-l08 (textul pentru elev): „Scurtătură: dublu-clic pe bara de titlu face fereastra cât tot ecranul; încă un dublu-clic o readuce” și
  „Apoi fă-o mai mică: pune săgeata exact pe colțul din dreapta jos al ferestrei; când devine o săgeată cu două vârfuri, ține apăsat și trage spre
  mijloc”.
- De ce GRAV: R12 („Orice comandă folosită de o lecție sau citată în ea funcționează; … nesimulată dă mesajul central standard, nu tace”). Aici nici
  nu funcționează, nici nu spune nimic. Vechi (fereastra generică din runda 18; `dublu` și `jos` nu apar în `diff_windows_js.txt`, deci runda 30 nu
  le-a atins), negăsit de criticii 18 / 22 / 26, care au probat butoanele ferestrei, nu gesturile acestea.
- Cauza: `windows.js:916-920` (`dublu`: pentru `bara_titlu` / `fereastra_app` întoarce `null`, adică niciun efect și niciun mesaj); `jos`
  (`:1002-1014`) nu are zonă de redimensionare (doar mutarea din titlu și selecția pe desktop). Minimul cerut de R12: mesajul central; firesc:
  dublul clic = butonul Maximizare / Restabilire, colțul = mărimea.

### N6 — lecția v/m2-l10: „Dublu-clic pe Coș de reciclare” (și pe „Acest PC”) dă tot mesajul, deși Explorer-ul se poate monta acum — **GRAV** (aceeași familie cu W4)
- Gestul (`b5_out.json`): poligonul cu `continut.explorer`, dublu clic pe pictograma „Coș de reciclare” de pe desktop; vecinul: „Acest PC”.
- Ce face simulatorul: `dublu_clic / nesimulat` (ținta `desktop:Coș de reciclare`), mesajul „În aplicația reală, „Coș de reciclare” funcționează…”,
  nicio fereastră. Pentru „Acest PC” la fel.
- Lecția v/m2-l10: „Dublu-clic pe Coș de reciclare, găsește Alarm01 după Locație inițială”, ajutorul „Dublu-clic pe Coș de reciclare, sub Explorer”.
- De ce GRAV: elevul nu poate duce la capăt drumul lecției (Coșul → restabilirea fișierului), exact criteriul după care criticii 22 / 26 au ținut W4
  deschis. Montarea există acum (`deschideExplorer`), dar `windows.js:918` trimite tot la mesaj („vine la integrarea cu banda Explorer (R18-7)”).
  `de_verificat.md › R18-7` le leagă pe amândouă („Butonul Explorer din bară și dublul clic pe Acest PC”). Nu e regres; e restul lui R18-7.

## 4. C. Regresul
- **K1, K2, K3** (proba criticului 26 rulată din nou: `c26_a1.py` → `c26a1_out.json`, diferențele în `c26_regres_diff.txt`):
  - K1: Windows + E deschide acum Explorer-ul (W4); clipirea dispare (`clipa_dupa_Meta_jos: start false`, A26-2); Windows + E nu mai bifează pasul
    „Start” al asistentului (MINOR-ul A26-2 din 26 §6, închis); vecinii Windows + D / Shift+S / 1 / Tab / ↑ dau `win_*` + mesajul, Start închis.
  - K2 (asistentul `Start → Paint`): Windows, „p”, „a”, „i”, Enter → `pas()` 1,1,1,1,**2**; vecinii „pai” + clic pe Paint, „calc” + Enter, „pa” + ↓ ↑ +
    Enter → `pas() = 2`. Diferența față de 26: indiciul „Alege Paint” nu mai apare cât elevul scrie în casetă (r28: tastarea în câmp nu e greșeală).
  - K3 (telefon 360 / 390, compunere CDP): identic, în afară de lățimea ferestrei Paint (358 / 388, intră acum în chenar).
- **W1, W2, W3, W5 și „Ce a trecut”** (`c_r22_a1.py`, `c_r22_b2.py`): identice cu runda 26 (vezi §3), în afară de ora din mesajul ceasului și de W4.
  Fereastra mică 1093×526, telefonul (Start, caseta, Paint, Minimizare, banda), celelalte aplicații pe poligon (`alte_aplicatii`): identice.
- **Asistentul pe un drum cu clicuri** (`c1_out.json`, `c1b_out.json`): pașii `bara_activitati:Start` → …: 2 clicuri pe desktop = 2 greșeli → indiciul
  „Deschide Start” apare pe Start; clic pe Start → `pas() = 1`. Meniul desktopului `meniu:Nou` → `meniu:Folder`: clic dreapta, Nou, Folder → `pas() = 2`,
  fără indiciu. Un clic pe un buton nesimulat din Start nu face pasul (r28, `REFUZ`), cum scrie regula.
- **Celelalte aplicații** (A/B pe `aplicatii.js`, §2): Word, Excel, PowerPoint, Explorer neatinse de zonele rundei 30. K2 de la runda 8 pică din cauza
  blocului r28, nu a rundei 30 (A pică, B pică, C trece).

## 5. [FARA_REFERINTA]
- **Dublu clic pe dosarul galben** când Explorer-ul nu e deschis (`a1c_out › dublu_galben`, `a1b_out › 14`): primul clic îl deschide, al doilea îl
  minimizează (`pornire_aplicatie`, `minimizare`, `dublu_clic`), deci elevul începător, care dă dublu clic pe orice, nu vede nicio fereastră. Ce face
  Windows-ul real nu e capturat (lansarea durează, al doilea clic de obicei nu prinde fereastra). De capturat; dacă Windows deschide și lasă fereastra,
  e GRAV pe drumul lecțiilor.
- **Asistentul Windows și pașii din Explorer-ul montat** (`b3_out › as_*`): `asistent('windows', [bara_activitati:Explorer fixat, lista:Desene])`: clicul pe
  dosar → `pas() = 1`; dublu clic pe „Desene” în Explorer → rămâne 1 (evenimentul e `aplicatie: explorer`). `tinte('windows')` = 69 dintre care 42 ale
  Explorer-ului (`a1b_out › 8`); `element('windows', 'bara_activitati:Start')` găsește tot shell-ul. Un drum de lecție shell → Explorer cu un singur
  asistent nu se poate scrie azi; e o întrebare de api (§6 pe aplicații montate), nu un GRAV.
- **Bara la 1536 față de referință**: Start la x 521 față de 432 (+89 px), pentru că grupul din referință are și cele 4 aplicații pornite ale PC-ului de
  referință (le las nenumite: sunt programele omului). „Conținutul calculatorului” e decizia lui Vasile; nu-l număr (la fel la 1920: dosarul la 1070
  față de 985 în bara secundară a referinței).
- **Windows + E cu Explorer-ul deschis** aduce fereastra existentă (A30-1); Windows deschide una nouă. Abatere declarată, nu încurcă drumul.
- **Fonturile** (Segoe UI față de Segoe UI Variable în bara de titlu) și pictograma dosarului galben: UIA nu le are.
- Rămase de la 26 §5, neatinse: Cmd + E pe Mac, redenumirea cu „/” sau cu nume existent pe desktop fără mesaj, eticheta „Maximizare” pe fereastra
  maximizată (lecția v/m2-l08 scrie „Maximizare (Restabilire jos)”), butonul Explorer cu 2 ferestre, Paint căutat când e deschis.

## 6. MINOR
1. **„Explorer, Sistem” din Start** (în categoria Productivitate, vizibilă și fără „Toate”; `a1c_out › fixate_clic`): clicul dă `nesimulat` + mesajul,
   Start rămâne deschis, deși căutarea „expl” deschide Explorer-ul și `api_propunere.md` §1 scrie că „Explorer” din „Toate” îl deschide. Cauza:
   `windows.js:893` compară eticheta cu `numeApp('explorer')` („Explorer”), iar butonul are id-ul „Explorer, Sistem” (AutomationId
   `W~Microsoft.Windows.Explorer` în referință). Primul de reparat: ajută și telefonul (N4).
2. **Fereastra montată fără filă** (§3): banda de sus e bara generică a shell-ului (32 px, „Clasa a V-a - Explorer”), nu fila Explorer-ului (40 px, fila
   cu × și +); rândul de navigare urcă 7 px. Explorer-ul de sine stătător are fila, deci elevul vede două Explorer-e diferite.
3. **Poligonul `?aplicatie=windows`** are încă fereastra Explorer generică („Acest PC”, goală); Windows + E deschide lângă ea Explorer-ul montat, iar bara
   le adună sub un singur buton (`c26a1_out › K1_win_e`: două ferestre Explorer). Doar poligonul; ar trebui să folosească `continut.explorer`.
4. **Ordinea evenimentelor la tastarea rapidă în redenumirea de pe desktop**: un `tastare` pe `camp:redenumire` vine după `clic / deselectare`
   (`a1_out › N1 › 3_clic_afara`); starea e corectă.
5. Rămase din 26 §6 (văzute în treacăt): mesajul central ține 5 s fix (după Windows + Spațiu, tasta Windows singură îl lasă pe ecran), telefonul după
   Minimizare, sufixele UIA în mesaj („Explorer, Sistem”, „Explorer fixat”), opacitatea Start. Ce s-a închis: eticheta „start_fundal” (acum „Meniul
   Start”), maximizarea 2 px (acum [1,1,1364,718], bara la 719), A26-2 în asistent.

## 7. Ce a trecut
- N1, N2 închise pe gesturile criticului 26 și pe 4-12 vecini fiecare; W4 închis pe PC (dosar galben, Windows + E, căutare; minimizare, readucere,
  maximizare, închidere, montare întreruptă, redesenare cu redenumire, Paint deasupra, tasta Windows din Explorer, Esc înapoi în Explorer, Ctrl+E rămâne
  al Explorer-ului); clicurile, tastele, rotița din Explorer = 0 evenimente ale gazdei.
- Regresul comun A/B: 0 diferențe pe Word / Excel / PowerPoint / Explorer (taste Ctrl / Meta inclusiv cele noi, clic, dublu clic, clic dreapta,
  tragere, rotiță, atingere pe telefon); Explorer-ul deschis normal identic, inclusiv captura.
- Aspectul: meniul desktopului și „Toate” la ±2 px față de referință (1536 / 1366 / 1093), fereastra montată încape și are butoanele pe ecran pe toate
  cele 5 ecrane, pagina nu se lățește nicăieri; la 1920 fereastra are exact dreptunghiul referinței și butoanele ei se potrivesc.
- `compara()` (starea = ecranul) = [] la toate gesturile pe shell; erori de pagină 0, cereri în afara 127.0.0.1 0, în toate rulările.

## 8. Predarea pentru runda următoare
- De reparat întâi, în ordine:
  1. **N3** (`windows.js:906`): clicul pe rama / bara de titlu a ferestrei montate active îi dă focusul înapoi (`f.mont.api.focus()`). Proba: Explorer,
     notite.txt, clic pe titlu, F2 → redenumirea în Explorer; Delete → `explorer / stergere`; nicio pictogramă de pe desktop atinsă.
  2. **N6** (`windows.js:918`): dublu clic pe „Coș de reciclare” / „Acest PC” de pe desktop → Explorer-ul montat, deschis în Coș / Acest PC (restul lui
     R18-7). Proba: v/m2-l10, Coșul → Alarm01 → restabilire.
  3. **N5** (`windows.js:916-920`, `:1002-1014`): dublul clic pe titlu = Maximizare / Restabilire; colțul = mărimea (cursorul cu două vârfuri), sau cel
     puțin mesajul central. Proba: v/m2-l08 pe Paint și pe Explorer-ul montat.
  4. **N4** (`deseneazaBara`): fără ferestre, pe ecranul îngust banda pornește cu aplicațiile fixate (dosarul galben) în vedere; împreună cu MINOR 1
     (`windows.js:893`: „Explorer, Sistem” → `deschideExplorer`). Proba: 360 / 390, dosarul galben vizibil fără glisare.
  5. MINOR 2 (fila Explorer-ului în fereastra montată), MINOR 3 (poligonul).
- Referințe de capturat (UIA, pe un Windows real):
  - focusul (elementul cu focus) după un clic pe bara de titlu a unei ferestre Explorer active;
  - dublu clic pe dosarul galben fixat, cu Explorer închis: câte ferestre, ce stare;
  - dublu clic pe bara de titlu și cursorul / tragerea în colțul din dreapta jos (orice fereastră), eticheta butonului Maximizare pe fereastra maximizată.
- De decis (orchestrator / api): asistentul pe un drum care trece din shell în Explorer-ul montat (§6) și dacă `tinte('windows')` trebuie să excludă
  rădăcinile imbricate.

GRAV_VECHI_DESCHISE: 0
GRAV: 4

