# Runda 26 (B-windows, a treia din val) · criticul rece · unghiul STARE_FINALA_ERORI

## 1. Antet
- Cine: criticul rece al rundei 26. Am citit `runde/_paralel/REGULI_CRITIC.md`, `runde/26/critic_prompt.md`, `runde/26/gata_pentru_critic.md`,
  `runde/26/raport_constructor.md`, `runde/22/critic.md` (GRAV-urile vechi și modelul), blocurile `RUNDA26-WINDOWS` din `de_verificat.md` /
  `de_aprobat.md`, `api_biblioteca.md` §4-§6, codul (`aplicatii/windows.js`, `aplicatii.js` › `gestTasta`, ascultătorul `keydown`, `I.intrare`,
  `emite`, `nesimulat`, `L.asistent`) și diferențele față de `runde/26/inainte/` (`critic_probe/diff_windows.txt`, `diff_aplicatii_acum.txt`).
- Uneltele: `runde/26/critic_probe/`. Hamul `h.py` (al criticului 22, plus `ecran()` / `compara()` = starea §5 față de DOM, `asist()`, `pas()`):
  server static pe 127.0.0.1, port liber, Chromium headless, `ctx.route('**/*')` care abandonează tot ce nu e 127.0.0.1/localhost. În toate
  rulările: `plecate = []`, `erori = []`. Gesturi adevărate: `page.keyboard`, `page.mouse`, `page.touchscreen.tap`, CDP `Input.imeSetComposition` /
  `Input.insertText`. Probele: `a1.py` (K1-K3, W4), `a2.py` (regresul `gestTasta`, A/B), `b1.py` / `b2.py` (unghiul), `c_r22_a1.py` /
  `c_r22_b2.py` (probele criticului 22, rulate din nou), `c2.py` / `c3.py` (telefonul, fereastra mică).
- Windows și Explorer reale nu le-am atins; Word / Excel / PowerPoint reale nu le-am pornit. N-am rulat `porti.py` / `masoara.py`. Git doar citit.
- Alte benzi în același worktree: `aplicatii.js` are, pe lângă blocul rundei 26 (`:266-275`), schimbările r23 (`:415-426`, `preventDefault` în
  câmpuri) și r24 (`:663-672`, `mutare_focus` în asistent), văzute la 03:27 (`diff_aplicatii_acum.txt`). Nu le atribui rundei 26.

## 2. A. GRAV-urile vechi (K1-K3 din `22/critic.md`, W4)

### K1 — Windows + E: **ÎNCHIS** (cu abaterea A26-2, judecată mai jos)
- Gestul criticului 22 (`a1_out › K1_win_e`, fereastra Explorer deschisă): `keyboard.down('Meta')`, 180 ms, `press('e')`, `up('Meta')`.
  - Evenimentele: `tasta_windows / deschide_start` (`activat: bara_activitati:Start`), apoi **`win_e / nesimulat`**. Nu mai iese `ctrl_e`.
  - Final: Start închis, fereastra Explorer activă, focusul pe rădăcină, mesajul central „În aplicația reală, „Windows + E” funcționează; aici nu
    e simulată.”, încă pe ecran la 1,6 s. `compara()` = [] (starea = ecranul).
- Gesturile vecine:
  - Windows + D → `win_d / nesimulat`, mesajul „Windows + D”; Windows + Shift + S → `win_shift_s`, mesajul „Windows + Shift + S”; Start închis
    la toate.
  - Ctrl + E pe Windows → `ctrl_e / ctrl_e` (neschimbat).
  - Tasta Windows lăsată, apoi E separat → Start deschis, „e” în casetă, rezultatele „Explorer*, Excel, …” (căutarea, corect).
  - Start deschis cu mouse-ul, apoi Windows + E → `tasta_windows / inchide_start`, apoi `win_e / nesimulat`; Start închis, mesajul.
- **Clipirea (A26-2):** după `Meta` jos, înainte de E, Start e desenat și focusul e în caseta lui (`clipa_dupa_Meta_jos: start true, focus
  caut_in`; captura `a1_k1_clipa.png`). Se vede cât ține omul tasta (aici 180 ms). Drumul lecției nu se încurcă: starea finală, mesajul și
  ecranul sunt corecte. Un efect în §6.3 (`a1_out › K1_asistent`): cu asistentul `Start → Paint`, Windows + E bifează pasul „Start”
  (`activat` de la apăsare), deși Start rămâne închis; după 2 greșeli adevărate nu apare niciun indiciu, pentru că ținta pasului 2 nu e pe ecran.
  Nu blochează: un clic pe Start (a 3-a greșeală) deschide Start, iar indiciul apare pe Paint. Îl trec la MINOR, legat de A26-2.
- De ce ÎNCHIS: R12 cerea „nu tace”, iar gestul nu mai e confundat cu `ctrl_e`. Deschiderea Explorer-ului rămâne la W4.
- Pe Mac, Cmd + E rămâne `ctrl_e` (voit, `aplicatii.js:268`), deci acolo Start rămâne deschis fără mesaj. N-am emulat Mac. Trec la [FARA_REFERINTA].

### K2 — asistentul vede drumul cu tastatura: **ÎNCHIS**
- Gestul criticului 22 (`a1_out › K2_tastatura`): asistentul `bara_activitati:Start` → `start:Paint` (`dupaGreseli: 2`); Windows, „p”, „a”, „i”,
  Enter. `pas()`: 1, 1, 1, 1, **2**. Evenimentele: tasta Windows cu `activat: bara_activitati:Start`; Enter cu `activat: start:Paint`,
  `actiune: pornire_aplicatie`, ținta caseta. La final: fără indiciu, fără evidențiere, fereastra Paint activă, `compara()` = [].
- Gesturile vecine:
  - Windows, „pai”, clic pe rezultatul Paint → `clic / pornire_aplicatie`, ținta `start:Paint`, `pas() = 2`;
  - Windows, „calc”, Enter (pașii Start → Calculator) → `activat: start:Calculator`, `pas() = 2`;
  - Windows, „pa”, Jos, Sus, Enter → `alegere_rezultat` ×2 (nu sunt greșeli), Enter → `pas() = 2`.
- Pe drum, după a doua literă apare „Alege Paint” pe rezultatul Paint ([365,131] sub rezultat [364,84,640,40]; centrul rezultatului rămâne liber:
  `elementFromPoint` = rezultatul; `a1_k2_indiciu.png`). §6.3 numără tastarea ca greșeală (nu e pe lista excepțiilor), deci comportamentul
  respectă api-ul. Îl trec la „Găsit pe drum” (regula e a lui `L.asistent`), nu la GRAV.

### K3 — telefonul, caseta din Start: **ÎNCHIS** (partea „Paint fără tastare” rămâne la A26-1, nenumărată)
- Gestul criticului 22, la 360×740 și 390×844 (`a1_out › K3_360`, `K3_390`): atingere pe Start, atingere pe casetă, CDP
  `imeSetComposition` „pa”, apoi `insertText` „pai”.
  - După atingerea casetei: `clic / focus_cautare`; focusul e într-un `INPUT` (`lh-ap-intrare lh-w-caut-in`, `edit: true`), font 16 px (fără zoom).
  - În compunere: 0 evenimente, iar cuvântul „pa” se vede în casetă, cu indicativul ascuns (`a1_k3_360_compune.png`).
  - `insertText` → un singur `tastare / cautare`, ținta `start:Căutați aplicații, setări și documente`; caseta „pai”, rezultatul „Paint*”.
- Gesturile vecine:
  - Backspace de pe tastatură (cheia DEL vine ca `keydown`, pentru că câmpul e mereu gol) → `tasta_backspace / cautare`, caseta „pa”, focusul
    rămâne în câmp;
  - „i”, apoi atingere pe Paint → `clic / pornire_aplicatie` (`start:Paint`), fereastra Paint activă, Start închis, focusul pe rădăcină (tastatura
    ecranului se închide), mesajul „Paint”; `compara()` = []; pagina nu se lățește (`scrollWidth` 360 / 390);
  - „xq” fără rezultat → `tastare / nesimulat` + mesajul „căutarea în documente și pe web”, focusul rămâne în câmp; la 390 o atingere în afara
    panoului → `inchide_start`, câmpul ascuns, focusul pe rădăcină. (La 360 punctul ales de mine, [340,20], cădea pe panou: `fara_efect`, corect.)
- Ce nu se poate vedea headless: tastatura ecranului reală și focusul din „click” pe iOS (`windows.js:411`). Sunt [presupuse], cum spune și
  constructorul.

### W4 — Explorer pe bara de activități: **DESCHIS (parțial, ca la 22)**
- `a1_out › W4`: cu fereastra deschisă, clicul pe dosarul galben o minimizează (`minimizare`) și o readuce (`restaurare`); fără fereastră
  (`ferestre: []`), clicul → `clic / nesimulat`, ținta `bara_activitati:Explorer fixat`, mesajul central. Explorer-ul bibliotecii tot nu se
  montează, deci drumul lecțiilor „clic pe dosarul galben → Explorer” nu se duce la capăt. Cauza rămâne A22-1 (montarea vine din r23, legarea în
  ciclul următor). Îl număr o singură dată, ca vechi.

### Regresul schimbării comune din `gestTasta` (`aplicatii.js:266-275`)
- `a2.py` → `a2_out.json`: aceeași secvență de 27 de taste (Ctrl + b i u e l r j a c v x z y f h k d g, Ctrl+Shift+N/S, Meta + b e c,
  Meta+Shift+S, Ctrl+S, Esc ×2) pe poligonul fiecărei aplicații, o dată cu `aplicatii.js` de acum (A) și o dată cu același fișier fără cele două
  blocuri ale rundei 26 (B, făcut de mine după conținut, servit prin `ctx.route`; `a2_aplicatii_B.js`).
- Word, Excel, PowerPoint, Explorer: **0 diferențe** la 31 de evenimente pe aplicație, iar starea finală e identică. Pe Windows diferă exact cele
  4 combinații Meta + literă (`win_b`, `win_e`, `win_c`, `win_shift_s` în loc de `ctrl_*`), adică schimbarea voită. Rezultatul constructorului se
  confirmă independent.

## 3. B. Unghiul STARE_FINALA_ERORI — constatările noi
Pe scurt (`b1_out.json`, rezumat în `b1_rezumat.txt`; `b2_out.json`; 1366×768, poligonul cu fereastra Explorer). După fiecare gest am citit
evenimentul §4, starea §5, ecranul (`compara()` = starea față de DOM: Start, ferestre, meniu, pictograme), focusul și mesajul central.
`compara()` a ieșit [] la toate cele 82 de gesturi din `b1` și la cele 32 din `b2`: ce spune `stare()` e și pe ecran.

| greșeala tipică | ce face simulatorul (final) | verdict |
|---|---|---|
| S1 Start (clic / tasta Windows), apoi Esc, clic pe desktop, clic pe fereastră, tasta Windows a doua oară | `inchide_start`, câmpul casetei ascuns, focusul pe rădăcină | trece |
| S1 Start, apoi **clic dreapta în afara panoului** | Start rămâne deschis, mesajul „„start_fundal” funcționează” | MINOR (eticheta internă), §6 |
| S2 „xqz” → mesajul; Backspace ×3 → caseta goală, dalele înapoi; Backspace în plus; Enter pe casetă goală; Esc; Start redeschis gol | toate `cautare` / `fara_efect`, ținta caseta; la redeschidere caseta e goală | trece |
| S2 cu asistentul `Start → Paint` | „xqz” și Backspace ×3 = greșeli, dar indiciul nu apare (Paint nu e pe ecran fără tastare); apare după „pai”; Enter → `pas() = 2` | [FARA_REFERINTA] (A26-1) |
| S3 Paint din căutare → Minimizare → bara → Maximizare → Minimizare → bara (revine maximizată) → Maximizare (restabilire) → Închidere | fiecare stare = ecranul, butonul Paint pleacă din bară, Explorer redevine activ | trece (+ MINOR 2 px, §6) |
| S3 Paint din căutare când e deja deschis | aceeași fereastră adusă în față, nu una nouă | [FARA_REFERINTA] (R22-2) |
| S4 meniul desktopului › Nou, Esc, Esc, Esc în plus; clic în altă parte; tasta Windows / clic pe Start cu meniul deschis; Shift + clic dreapta, Esc | `inchide_submeniu`, `inchide_meniu`, `fara_efect`; meniul se închide și Start se deschide | trece |
| S5 Nou › Folder, apoi Esc / nume gol / „a/b” / „Acest PC” | numele rămâne „Folder nou” (al doilea „Folder nou (2)”), redenumirea se încheie | trece pe stare; **focusul pleacă din aplicație → N1** |
| S6 două ferestre, X / Minimizare pe cea din spate | rămâne cea din față, activă | trece |
| S7 (constructorul) Start deschis peste pictograma selectată: Delete / F2 / Enter | `fara_efect`, ținta caseta; pictograma neatinsă | trece |
| Windows + Spațiu / cifră / punct | Start se deschide și rămâne, niciun eveniment după tasta Windows | **N2** |

### N1 — după redenumirea de pe desktop (Enter, Esc, nume gol) focusul cade pe `<body>`: folderul arată selectat, dar F2, Delete și tasta Windows nu emit nimic — **GRAV** (§4 „un eveniment pe fiecare gest fizic”, R12)
- Gestul (`b2_out › acum › 1_enter`, `2_esc`, `3_f2`): clic dreapta pe desktop › Nou › Folder, „Teme”, Enter; apoi Delete, F2, tasta Windows.
  Vecinii: Nou › Folder, Esc, F2; clic pe pictogramă, F2, nume gol, Enter, F2.
- Ce face simulatorul:
  - Enter → `tasta_enter / redenumire`, pictograma „Teme” e pe desktop, **selectată** (`selectie: ['Teme']`, clasa `lh-w-ales`);
  - `document.activeElement` = `BODY`, în afara rădăcinii (la fel după Esc → `anulare_redenumire` și după numele gol);
  - Delete → **0 evenimente**, folderul rămâne; F2 → 0 evenimente, nicio redenumire; tasta Windows → 0 evenimente, Start nu se deschide;
  - abia un clic în aplicație readuce focusul: clic pe „Teme”, Delete → `mutare_in_cos`.
- Ce face Windows: după Enter / Esc numele rămâne selectat și cu focus, iar F2 / Delete lucrează pe el. Nu am o captură UIA a focusului de
  după redenumire, dar GRAV-ul nu stă pe aspect: stă pe api.
- De ce e GRAV:
  - §4 („Un eveniment pe fiecare gest fizic al elevului”) și R12 („nu tace”): trei taste predate (F2, Delete, tasta Windows) nu produc nimic
    exact pe drumul greșelii tipice „Esc la redenumire, apoi F2 ca s-o iau de la capăt” și pe drumul lecțiilor „selectezi, F2, scrii, Enter
    (Esc renunță)” / „Delete: în Coș” (v/m2-l10, recapitulare: „semnele pe care Windows nu le primește în nume”);
  - cu focusul pe `<body>`, regula §4 „scurtăturile se opresc cu `preventDefault` DOAR cât focusul e în rădăcină” nu mai prinde: F5 /
    Ctrl+R / Alt+← ajung la browser [NEVERIFICAT headless: F5 e al ferestrei browserului, nu al paginii].
- Vechi, nu din runda 26: identic cu `runde/26/inainte/windows.js` servit în locul celui de acum (`b2_out › inainte_r26`, aceleași 0 evenimente).
  Criticii 18 / 22 au verificat doar numele de după Enter.
- Cauza: `windows.js:195-210` (`deseneazaDesktop`) rescrie `desk.innerHTML`, deci scoate câmpul focalizat fără să mute focusul pe rădăcină;
  `termina` (`:212-223`) îl cheamă după Enter / Esc. `deseneazaStart` are deja paza (`:444`: „tastele rămân la aplicație”); la desktop lipsește.

### N2 — Windows + Spațiu (citată de viii/m2-l15) deschide Start și tace — **GRAV** (R12; aceeași familie cu K1)
- Gestul (`b2_out › win_spatiu`, `win_punct`, `win_1`; `a1_out › K1_vecin_win_1`, `K1_vecin_win_tab`, `K1_vecin_win_sus`): `keyboard.press('Meta+Space')`.
- Ce face simulatorul: `tasta_windows / deschide_start` la apăsarea tastei Windows, apoi nimic. Spațiul nu emite niciun eveniment, nu apare niciun
  mesaj, iar Start rămâne deschis cu focusul în casetă. La fel Windows + punct și Windows + 1. Windows + Tab mută focusul pe prima dală
  (`tasta_tab / focus`), Windows + ↑ dă `sageti / sageti`. Start rămâne deschis la toate.
- Lecția: viii/m2-l15 (`index.html`, textul pentru elev): „La altă tastatură treci cu tasta Windows + <kbd>Spațiu</kbd>”. Celelalte combinații
  (punct, cifre, Tab, săgeți) nu le găsesc în lecții (`lectii_scurtaturi.txt` de la 22 + căutarea mea „Windows + <kbd>”: doar E și Spațiu).
- De ce e GRAV: R12 („Orice comandă folosită de o lecție sau citată în ea funcționează; … nesimulată dă mesajul central standard, nu tace”).
  E exact K1 pe o tastă care nu e literă: runda 26 a reparat doar `Windows + literă`, cum cerea predarea criticului 22. Nu e regres.
- Cauza:
  - `aplicatii.js:270-275` (cod comun, runda 26): ramura `win_` ia doar `litera(e)`; pentru Spațiu, cifre și punct cade la `:281`
    (`if (!(k in TASTE)) return null`), deci tasta n-are gest;
  - `windows.js:757-759`: Start deschis la apăsarea tastei Windows, iar fără gest după ea nimic nu-l mai închide.
  - Soluția firească: în aplicația cu `I.tastaWindows`, orice tastă apăsată cu Windows ținut (nu doar literele) = `win_<tastă>` + mesajul
    central, iar Start închis. Asta e tot cod comun, deci decizia e a orchestratorului.

### Abaterile declarate de constructor, judecate
- **A26-1** (Paint fără tastare pe telefon): corectă ca cerere. Pe telefon drumul „scrie pai” merge acum (K3). Cu asistentul, pasul `start:Paint`
  nu are indiciu până nu se scrie ceva care găsește Paint (S2_asistent), deci asistentul nu-l ajută pe elevul care nu știe să caute.
- **A26-2** (Start la apăsare): clipirea se vede (cât e ținută tasta) și bifează pasul „Start” în asistent la Windows + E (§2, K1). Nu încurcă
  drumul lecției spre Explorer. Rămâne o abatere vizibilă, nu GRAV.
- **S3 maximizare 2 px** (`b1_out › S3_geometrie_max`): fereastra [1,1,1366,720] în rădăcina [0,0,1366,768], bara la y 719. Iese 1 px în dreapta și
  intră 2 px sub bară. Bara e desenată deasupra, deci nu se vede. MINOR, confirmat.
- **„Găsit pe drum” al constructorului** (`L.asistent`: literele din caseta Start sunt greșeli): confirmat (K2, mai sus). E regula §6.3, scrisă așa;
  dacă tastarea în căutare ar trebui să fie excepție (ca `sageti`), e o schimbare de api, deci decizia e a orchestratorului.

## 4. C. Regresul
- **Probele criticului 22 rulate din nou** (copiate ca `c_r22_a1.py` / `c_r22_b2.py`, ieșirile `c22a1_out.json` / `c22b2_out.json`, 03:44-03:45),
  comparate cheie cu cheie cu `runde/22/critic_probe/a1_out.json` / `b2_out.json` (`c_regres_diff.txt`):
  - **W1** (1536×864, 1366 jos, 1093 sus / jos), **W2** (rotița în „Toate”, capătul), **W4**, **W5** (360 / 390): **identice** cu runda 22
    (cutiile, `dif_fata_de_ref = []`, `scrollTop`, butoanele ferestrei pe telefon). W1, W2, W5 rămân ÎNCHISE.
  - **W3**: singura diferență e `activat` adăugat la tasta Windows (`bara_activitati:Start`) și la Enter (`start:Paint`, `start:Calculator`) = K2,
    voit. Paint / Calculator pornesc ca înainte. W3 rămâne ÎNCHIS.
  - **„Ce a trecut” la 1536** (Start, panoul, meniul clasic, Esc pe rând, mesajul la Widgeturi / Ceas): identic, în afară de ora din mesaj.
  - **Fereastra mică 1093×526** (Windows, „pai”, Enter; clic dreapta › Nou › Folder › „Teme”): identică.
  - **Telefonul (`tel_360` / `tel_390`)**: diferă exact unde trebuia (K3: focusul într-un `INPUT`, textul ecranului găsește Paint). Proba veche
    trimite apoi „pai” și de la tastatura fizică; acum caseta ajunge „paipai” → `nesimulat`. E urmarea reparației, nu un regres.
  - **Celelalte aplicații** pe poligon: Word 109, PowerPoint 119, Explorer ca la 22; Excel 1244 → **1248** ținte. `excel.js` e modificat la
    03:07 (banda r25), deci nu e din runda 26. Erori de pagină 0, cereri în afară 0.
- **Regresul codului comun** (§2, `a2_out.json`): Ctrl / Meta + literă pe Word, Excel, PowerPoint, Explorer: 0 diferențe A/B.
- **Telefonul pe drumul S3** (`c2_out.json`, `c3_out.json`, 360 și 390): Start, caseta, „pai” (CDP), Paint → fereastra activă, mesajul; Minimizare
  → `minimizare`. După Minimizare, banda barei sare la aplicația activă (Explorer), iar butonul Paint iese din bandă (la 360 stă sub tavă:
  atingerea în centrul lui cade pe pictograma rețelei). O glisare pe bandă îl aduce în vedere, iar atingerea → `restaurare`. Identic cu
  `inainte/windows.js`, deci nu e regres; îl trec la MINOR.
- **Fereastra mică 1093×526 cu caseta nouă** (`c2_out › mica_1093`): clic pe Start, clic pe casetă → focusul în câmp; `insertText` „calc” →
  `tastare / cautare`, „Calculator*”; Enter → fereastra Calculator activă și încăpută, mesajul; pagina nu se lățește.
- **Codul comun atins de alte benzi** (03:27, `diff_aplicatii_acum.txt`): r23 (`preventDefault` în câmpuri, `aplicatii.js:415-426`) nu atinge caseta
  din Start (câmpul are `data-lh-intrare-document`, deci `inCamp = false`, ca înainte); r24 (`mutare_focus`) nu schimbă nimic la Windows, care
  nu emite `mutare_focus`. N-am văzut efecte ale lor pe shell.

## 5. [FARA_REFERINTA]
- **Cmd + E pe Mac**: rămâne `ctrl_e` (voit, `aplicatii.js:268`), deci Start deschis de Cmd rămâne fără mesaj. N-am emulat Mac; pe un Mac nu e
  tasta Windows. De hotărât dacă lecțiile se joacă și pe Mac.
- **Clic dreapta în afara panoului Start**: Start rămâne deschis (`clic_dreapta / nesimulat`, ținta `start_fundal`). În Windows, un clic în afară
  închide Start; captura nu există.
- **Redenumirea cu „/” sau cu un nume existent** („Acest PC”): numele rămâne cel vechi, evenimentul e tot `redenumire`, fără niciun mesaj
  (`b2_out › 3_f2`). Lecțiile predau exact aceste erori: v/m2-l10 („semnele pe care Windows nu le primește în nume”), v/m2-l11 / l15 („există
  deja? adaugă o cifră”). Balonul cu caracterele interzise și fereastra pentru numele existent nu sunt capturate (am căutat în `referinte/`: 0
  potriviri pentru „nu poate conține” / „cannot contain”). Pe desktop nu e drumul lecțiilor (ele lucrează în Explorer), deci nu e GRAV.
- **Tasta Windows în timpul redenumirii**: `tasta_windows / tasta_windows` pe `camp:redenumire`, Start nu se deschide, redenumirea continuă
  (`windows.js:751-755`).
- **Butonul Maximizare** păstrează eticheta „Maximizare” când fereastra e maximizată (în Windows: „Restabilire”); nu e în referințe.
- **Butonul Explorer din bară cu 2 ferestre** minimizează fereastra de sus. În Windows 11 arată miniaturile; nu e capturat (R18-4).
- **Paint căutat când e deja deschis**: aceeași fereastră, adusă în față (R22-2).
- **Asistentul pe pasul `start:Paint`**: fără tastare, ținta nu e pe ecran, deci indiciul nu apare nici după 3 greșeli (S2_asistent); apare după
  „pai”. Ține de A26-1 / R26-3.

## 6. MINOR
- **Eticheta internă în mesajul central**: clic dreapta pe fundalul Start → „În aplicația reală, „start_fundal” funcționează; aici nu e simulată.”
  (`b2_start_fundal.png`); pe fondul panoului ar ieși „„start””. Cauza: `windows.js:727` cu `eticheta()` de la `:656`, care pentru o țintă fără
  „:” întoarce ținta întreagă. Vechi (identic cu `inainte/windows.js`). E primul de reparat dintre MINOR-uri: e text greșit în fața elevului.
- **Mesajul „căutarea în documente și pe web”** rămâne pe ecran după ce Backspace a golit caseta și chiar după Esc + Start redeschis (durata fixă
  de 5 s), adică despre o căutare care nu mai există (`b1_out › S2`).
- **A26-2 în asistent**: Windows + E bifează pasul „Start” (`activat` la apăsare), deși Start se închide imediat (§2, K1).
- **Maximizarea iese 1 px în dreapta și 2 px sub bară** (constructorul, confirmat; `b1_out › S3_geometrie_max`).
- **Telefonul, după Minimizare**: butonul aplicației minimizate iese din banda barei (la 360, sub tavă); se ajunge la el doar glisând (`c3_out`).
- Rămase de la 22 §6 / 18 §6, neatinse de constructor (văzute în treacăt, nu remăsurate toate): Enter pe un rezultat nesimulat lasă Start deschis;
  rezultatele căutării includ programe ale PC-ului de referință (la „e”: două utilitare de scaner); sufixele UIA în mesaj („Explorer fixat”,
  vremea la Widgeturi, nivelul volumului); opacitatea Start; clic dreapta pe desktopul gol are ținta `fereastra_app:windows`.

## 7. Ce a trecut
- K1, K2, K3 închise, fiecare pe gestul criticului 22 și pe 2-4 gesturi vecine: Windows + E / D / Shift + S dau `win_*` + mesajul, cu Start închis;
  drumul cu tastatura bifează asistentul până la `pas() = 2` (Paint, Calculator, cu săgeți, cu clic pe rezultat); pe telefon textul compus și
  inserat intră în căutare, Backspace merge, atingerea pe rezultat pornește aplicația și închide tastatura ecranului.
- Regresul `gestTasta`: 0 diferențe pe Word / Excel / PowerPoint / Explorer, în proba mea A/B, independentă de a constructorului.
- Unghiul: starea = ecranul la toate cele 114 gesturi (`compara()` = []); Esc / clic în afară închid Start și ascund câmpul; Backspace până la
  gol readuce dalele; ciclul Minimizare / bară / Maximizare / Închidere ține starea și bara; meniul desktopului se închide pe trepte; folderul nou
  își păstrează numele implicit la Esc / nume gol, iar al doilea e „Folder nou (2)”; închiderea ferestrei din spate lasă activă fereastra din față;
  tastele cu Start deschis nu mai ating pictograma de dedesubt.
- W1, W2, W3, W5 și „Ce a trecut” din 22: identice. Telefonul (360 / 390) și fereastra mică (1093×526): merg. Erori de pagină 0, cereri în afara
  127.0.0.1 0, în toate rulările.

## 8. Predarea pentru runda următoare
- De reparat întâi, în ordine:
  1. **N1** (`windows.js:195-223`): când redenumirea se încheie (Enter, Esc, nume gol, clic în afară), focusul trebuie să revină pe rădăcină
     (ca `deseneazaStart`, `:444`), iar pictograma rămâne selectată. Proba: Nou › Folder, „Teme”, Enter, apoi Delete → `mutare_in_cos`; Nou ›
     Folder, Esc, F2 → `redenumire_incepe`; după ambele, tasta Windows → `deschide_start`.
  2. **N2** (cod comun, `aplicatii.js:270-281`, decizia orchestratorului): în aplicația cu `I.tastaWindows`, orice tastă apăsată cu Windows ținut
     (Spațiu, cifre, punct, Tab, săgeți), nu doar literele, să fie un gest `win_<tastă>`, cu mesajul central și Start închis. Proba: Windows +
     Spațiu → un gest `win_*`, mesajul „Windows + Spațiu”, Start închis.
  3. **MINOR „start_fundal”** (`windows.js:727`): clicul dreapta pe fundalul Start să închidă Start (ca clicul stâng) sau să dea „Meniul Start”,
     nu ținta internă.
  4. **W4 (restul)** și **A26-2**: când se leagă Explorer-ul montat (ciclul următor), plus `I.emite(…, extra)` pentru Start la ridicare.
- Referințe de capturat:
  - balonul de la un caracter interzis la redenumire și fereastra „există deja” (pe desktop și în Explorer), UIA + captură decupată;
  - focusul după Enter / Esc la redenumirea pe desktop (UIA: elementul cu focus);
  - pagina Microsoft „Keyboard shortcuts in Windows” (Windows + E / D / Spațiu / Tab / ↑), înghețată în `surse_microsoft.md` (R26-1);
  - clicul dreapta în afara Start-ului (se închide? apare meniul desktopului?);
  - eticheta butonului Maximizare pe o fereastră maximizată.
- De decis de orchestrator: dacă tastarea în caseta Start trebuie să fie excepție la greșelile §6.3 (acum o literă = o greșeală, deci indiciul
  apare pe drumul bun, după două litere).

GRAV_VECHI_DESCHISE: 1
GRAV: 3
