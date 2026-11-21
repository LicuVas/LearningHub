# Runda 26 (B-windows, a treia din val) · criticul rece · unghiul STARE_FINALA_ERORI

## 1. Antet
- Cine: criticul rece al rundei 26. Am citit `runde/_paralel/REGULI_CRITIC.md`, `runde/26/critic_prompt.md`, `runde/26/gata_pentru_critic.md`,
  `runde/26/raport_constructor.md`, `runde/22/critic.md` (GRAV-urile vechi și modelul), blocurile `RUNDA26-WINDOWS` din `de_verificat.md` /
  `de_aprobat.md`, `api_biblioteca.md` §4-§6, codul (`aplicatii/windows.js`, `aplicatii.js` › `gestTasta`, ascultătorul `keydown`, `I.intrare`,
  `emite`, `nesimulat`, `L.asistent`) și diferențele față de `runde/26/inainte/` (`critic_probe/diff_windows.txt`, `diff_aplicatii_acum.txt`).
- Uneltele: `runde/26/critic_probe/`. Hamul `h.py` (al criticului 22, plus `ecran()` / `compara()` = starea §5 față de DOM, `asist()`, `pas()`):
  server static pe 127.0.0.1, port liber, Chromium headless, `ctx.route('**/*')` care abandonează tot ce nu e 127.0.0.1/localhost. În toate
  rulările: `plecate = []`, `erori = []`. Gesturi adevărate: `page.keyboard`, `page.mouse`, `page.touchscreen.tap`, CDP `Input.imeSetComposition` /
  `Input.insertText`. Probele: `a1.py` (K1-K3, W4), `a2.py` (regresul `gestTasta`, A/B), `b1.py` (unghiul), `c1.py` (regresul).
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
