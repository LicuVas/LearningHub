# Runda 30 (B-windows#2, ciclul paralel D, unghiul aspect) · raportul constructorului, 21.11.2026

## Numerele întâi
- **Proba rundei** (`runde/30/proba_grav.py`, gesturi adevărate: tastatură, mouse, `touchscreen.tap` + glisare CDP la 360 / 390):
  - la pornire (codul de la 24fd4eb5): **51 picate din 69** — N1 9/19, N2 31/38, W4 4/5 (restul secțiunii nu putea rula fără montare),
    A26-2 3/5, start_fundal 2/2, telefon 2/2 (`probe_iesiri/proba_grav_pornire.log`);
  - la final: **0 picate din 123** — N1 0/19, N2 0/38, W4 0/28 (cu MINOR 4), A26-2 0/5, start_fundal 0/2, telefon 0/8, aspect 0/21, erori JS 0, cereri în afara 127.0.0.1 0 (`probe_iesiri/proba_grav_final.log`, cu `--minor4`).
- **Regresul Ctrl / Meta + tastă, A/B** (`regres_ctrl_tasta.py`; A = aplicatii.js de acum, B = aceleași fișiere cu cele 4 zone ale rundei
  puse înapoi din `inainte/`): Word, Excel, PowerPoint, Explorer = **0 diferențe** la 39 de evenimente fiecare (34 de taste + un clic + un
  clic dreapta), stare finală identică, 0 erori JS. Windows: diferă exact gesturile voite (`win_*` noi, `tasta_windows` care nu mai vine
  înaintea lui `win_*`, Windows + E = `pornire_aplicatie`). Rulat de două ori (07:25 și 07:41), același rezultat; copiile: `B_zone_ca_inainte: true`.
- **O4 pe 42 de scenarii, A/B** (cele 18 Explorer + câte 8 Word / Excel / PowerPoint, `LH_RADACINA` = cele două copii): **42/42** și
  **42/42** (`probe_iesiri/O4_A.log`, `O4_B.log`).
- **Probele vechi rulate din nou** pe codul final: r22 **0 picate din 50** (W1-W5 identice: bara / Start / meniul la ±2 px), r18 **0 din 37**, r26 **4 din 84** (la finalul rundei 26: 3 din 84).
  Cele 4 de la r26: K3b ×2 (Paint fără tastare pe telefon, A26-1, neschimbat) și K1 ×2 „Windows + E dă mesajul central” — VOIT: Windows + E
  deschide acum Explorer-ul (W4), deci mesajul nu mai apare. S3 (maximizarea 2 px), picată la runda 26, trece acum.
- Măsurarea comună (pasul 7), criticul (8), publicarea (9): NU sunt ale benzii; le face orchestratorul.

## GRAV-urile țintei
- **N1 — ÎNCHIS (dovada de azi)**: după Enter / Esc / nume gol, focusul e în rădăcina Windows, pictograma rămâne selectată (stare + clasa
  `lh-w-ales`); Enter → Delete = `mutare_in_cos`; Esc → F2 = `redenumire_incepe`; nume gol → F2 = `redenumire_incepe`; după toate, tasta
  Windows = `deschide_start` cu Start pe ecran; clic în afară → F2 emite un eveniment. N1: 9 picate → 0 din 19.
  Cauza reparată: `windows.js:223-227` (în `termina`, focusul pe rădăcină înainte de rescrierea desktopului).
- **N2 — ÎNCHIS**: Windows + Spațiu / 1 / . / Tab / ↑ / , — pe desktop și cu Start deschis cu mouse-ul — un singur gest `win_*`, mesajul
  „Windows + Spațiu” („… + 1”, „… + .”, „… + Tab”, „… + ↑”, „… + ,”), Start închis (stare + ecran). Windows + Shift + S și Windows + D
  neschimbate. N2: 31 picate → 0 din 38.
- **W4 — ÎNCHIS** (cu A23-1 P1 + P2 aplicate și legarea Explorer-ului montat):
  - clic pe dosarul galben / Windows + E → Explorer-ul bibliotecii montat în corpul unei ferestre a shell-ului, fără bara lui de titlu, umple
    corpul la 0 px, e în `LH.aplicatii.radacini()`; titlul ferestrei = `stare().titlu` („Clasa a V-a - Explorer”) și urmează folderul
    („Desene - Explorer” după dublu clic); evenimentul Windows = `pornire_aplicatie`, nu `nesimulat`; focusul în Explorer;
  - clic / clic dreapta / dublu clic în Explorer → 0 evenimente ale gazdei (P1); `deschideSuprafata('meniu_nou', 'explorer')` deschide meniul
    Explorer-ului montat (P2), iar fără al doilea argument rămâne ca înainte;
  - Minimizare → instanța trăiește, ascunsă; clic pe dosarul galben → restaurare, același folder, focusul în Explorer; Închidere → fereastra
    și instanța pleacă; redeschiderea merge;
  - redesenarea gazdei (1366 → 1280) → Explorer-ul pus înapoi în corp, aceeași selecție, focusul în el, Ctrl+V lipește;
  - **MINOR 4 inclus** (`runde/27/stare_autor.md:3` are `MINOR4_GATA`): F2 în Explorer, „abc”, redesenarea gazdei, „d” + Enter →
    `abcd.txt`;
  - tasta Windows cu focusul în Explorer → Start (eveniment Windows), Explorer-ul nu o ia; meniul desktopului se închide la un clic în
    Explorer; cu Paint deasupra, clicul în Explorer îl activează; un Explorer deschis separat de pagină nu e furat de shell;
  - telefonul 360 / 390: după glisarea benzii barei, atingerea pe dosarul galben montează Explorer-ul maximizat, pagina nu se lățește,
    atingerea pe un rând îl selectează (0 evenimente ale gazdei), Închidere închide.
  - W4: 4 picate (din 5 câte puteau rula) → 0 din 28; telefonul 2 → 0 din 8.
- **A26-2 — făcut** (îl închide criticul): `I.emite(…, extra)`; Start la ridicarea tastei Windows; Windows ținut + E: fără clipire, fără
  `tasta_windows`; tasta singură = un eveniment cu `activat`. A262: 3 → 0 din 5.
- **MINOR „start_fundal” — făcut**: clic dreapta în afara panoului închide Start; pe fondul panoului mesajul spune „Meniul Start”. SF: 2 → 0.

## Unghiul aspect (fereastra montată pe ecranele clasei, `proba_grav.py ASP`)
- 1366×768 (100 % și 125 %), 1920×1080, fereastra mică 1093×526, telefonul 360 / 390: fereastra încape deasupra barei, Minimizare /
  Maximizare / Închidere sunt pe ecran (`elementFromPoint` = butonul), Explorer-ul umple corpul (0 px), titlul în Segoe UI; la ≥ 1366
  fereastra ≤ 1534 × 814 (rect-ul referinței) și ≥ 70 % din lățime. Capturi: `probe_iesiri/asp_*.png`. ASP: 0 picate din 21.
- Bara, Start și meniul desktopului nu le-am mutat: proba r22 (W1 = ±2 px față de `uia_windows.json` la 1536 / 1366 / 1093, W2, W5) dă
  aceleași rezultate (mai sus).
- Mărimea ferestrei Explorer la 1366 nu e în referință (captura e pe alt ecran): R30-1.

## Găsit pe drum (reparat, în fișierul benzii)
- **Start se deschidea SUB ferestre** după ~15 activări: z-index-ul ferestrei (`M.z++`) trecea de Start (15) și de bară (20), pentru că
  stratul ferestrelor nu era un context de stivuire. Probat: `probe/z_stiva.py` (după 20 de activări, mijlocul panoului Start = o fereastră);
  reparat cu `z-index:1` pe `.lh-w-ferestre` (`windows.js:35-37`); după: mijlocul panoului = Start. Vechi (același cod în `inainte/`).
- **Maximizarea ieșea 1 px în dreapta și 2 px sub bară** (MINOR S3, criticii 26 și 22): zona ferestrelor era măsurată pe chenarul
  rădăcinii (1 px de jur împrejur, `.lh-ap`). Acum = interiorul rădăcinii (`windows.js` › `deseneazaFerestre`, `zona`).

## Găsit pe drum (NEreparat, nu e în zona mea)
- Cât Explorer-ul e montat, `LH.aplicatii.tinte('windows')` / `element('windows', …)` văd și țintele Explorer-ului (caută în tot
  `I.root`, `aplicatii.js:180-184`). Niciun oracol nu montează azi; o rundă care măsoară Windows cu Explorer montat ar trebui să excludă
  rădăcinile imbricate. E cod comun în afara zonelor mele: îl las orchestratorului.
- Pe telefon dosarul galben stă în banda derulabilă a barei, după To Do: fără ferestre se vede doar după o glisare (R30-6).

## Fișiere comune atinse (`aplicatii/aplicatii.js`, doar zonele din supliment; diff exact: `runde/30/diff_aplicatii_js_runda30.txt`)
- `:121` — `I.emite = (gest, actiune, tinta, inainte, extra) => emite(I, gest, actiune, tinta, inainte, extra);` (A26-2).
- `:187-188` — `L.deschideSuprafata = function (cheie, ceruta) {` + `const nume = ceruta && viu(ceruta) ? ceruta : Object.keys(INST).find(n => viu(n));` (A23-1 P2).
- `:269-286` — `WIN_COD` + `tastaWin(e)` (N2), noi.
- `:287-298` — începutul lui `gestTasta`: condiția `(e.metaKey || k === 'Meta' || k === 'OS') && !e.ctrlKey && !e.altKey && !MAC`; în
  aplicația cu `I.tastaWindows`: tasta Windows → `null` doar dacă aplicația pune `I.tastaWindowsLaRidicare` (A26-2); altă tastă →
  `win_` + `litera(e) || tastaWin(e)` (N2). Restul funcției neschimbat.
- `:350-353` — în `leagaGesturi` › `pointerdown`: `const ra = e.target && e.target.closest && e.target.closest('[data-lh-aplicatie]');`
  `if (ra && ra !== r) { jos = null; return; }` (A23-1 P1).
- Pază pe aplicație: fără `I.tastaWindows` (Word, Excel, PowerPoint, Explorer) `gestTasta` merge pe drumul vechi; fără montare `ra === r`;
  fără al doilea argument `deschideSuprafata` e cea veche; `extra` lipsă = ca înainte. Dovada: regresul A/B de mai sus.
- `windows.js` e al benzii (`runde/30/diff_windows_js.txt`). `api_biblioteca.md` NEatins (înghețat): textul în `runde/30/api_propunere.md`.

## Ce am pus în dosarele comune
- `de_aprobat.md` › `RUNDA30-WINDOWS`: **A30-1** (Windows + E cu Explorer-ul deja deschis aduce fereastra în față, nu deschide a doua);
  notă la A26-2 (implementat).
- `de_verificat.md` › `RUNDA30-WINDOWS`: **R30-1** (mărimea ferestrei Explorer), **R30-2** (clic dreapta în afara Start), **R30-3** (ce face
  Windows la Windows + Spațiu / cifre / punct / Tab / ↑), **R30-4** (Start la apăsare sau la ridicare), **R30-5** (focusul după redenumire),
  **R30-6** (telefonul: dosarul galben în banda barei).
- `runde/30/api_propunere.md`: §1 (Explorer-ul montat de shell; `deschideSuprafata(cheie, nume?)`), §4 (`win_<tastă>` cu lista numelor;
  `tasta_windows` la ridicare în Windows).

## NEFĂCUT
- Pasul 7 (măsurarea completă), 8 (criticul rece), 9 (publicarea), 10 (jurnalul): ale orchestratorului, după cum cere suplimentul.
- R30-1…R30-6: au nevoie de capturi pe un Windows real (UIA), adică de o rundă `acoperire`; azi sunt [DEDUS] / [NEVERIFICAT].
- Restul MINOR-urilor din `26/critic.md` §6 (mesajul „căutarea în documente și pe web” care rămâne 5 s, butonul aplicației minimizate pe
  telefon, sufixele UIA în mesaje, opacitatea Start): neatinse în runda asta.

## NESIGUR
- A26-2 mută evenimentul tastei Windows la ridicare. O5 apasă tasta întreagă și așteaptă 1,5 s (`oracol_evenimente.py:263-264`), deci
  vede evenimentul; o probă care citește evenimentele între `keyboard.down('Meta')` și `up` vede acum 0. Ritmul real nu e capturat (R30-4).
- Ce face Windows-ul real la combinațiile N2 nu e implementat (doar „nu tace”), cum a hotărât orchestratorul; R30-3 / R26-1.
