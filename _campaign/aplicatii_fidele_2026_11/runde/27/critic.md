# Runda 27 (B-explorer#2; ciclul paralel D) · criticul rece · unghiul ASPECT (21.11.2026)

## 1. Antet
- **Ce am judecat:** `aplicatii/explorer.js` așa cum e în worktree (ultima scriere 07:22:49, neschimbat cât am probat, 07:33-08:02).
  - Diff-ul rundei = `explorer.js` față de `runde/27/inainte/explorer.js`, iar copia aceea e identică cu `HEAD` (`cmp`).
    Sunt 7 hunk-uri: `:119`, `:147`, `:431-457`, `:471-490`, `:699-702`, `:768-771`, `:874`, `:947-948` (`critic_probe/diff_r27.txt`).
  - Runda 27 n-a atins cod comun.
- **Ce s-a schimbat în paralel** (nu le atribui rundei 27):
  - `aplicatii.js`, la 07:25:31 (r28 / r30), înainte să încep;
  - `excel.js` (07:22:59 → 07:37:49) și `windows.js` (07:31:56 → 07:39:04), cât probam.
  - N-am văzut nicio urmare a lor în Explorer (C).
- **Cum am probat:**
  - server static pe `127.0.0.1`, port liber, peste `C:/00/Projects/LearningHub_fidel` sau peste copii în %TEMP%; e oprit la finalul fiecărui script;
  - Chromium headless; `ctx.route("**/*")` abandonează tot ce nu e 127.0.0.1/localhost. **0 cereri plecate și 0 erori de pagină în toate probele**;
  - gesturi reale: `page.mouse`, `page.keyboard`, `page.touchscreen`. Pentru scris am folosit CDP (`Input.insertText`, `Input.imeSetComposition`),
    iar pentru deget CDP `Input.dispatchTouchEvent`.
  - `referinte/uia_explorer.json` l-am citit doar prin Python, pe chei (`critic_probe/ref_flat.py` → `iesiri/ref_flat.txt`), **nu** prin `date/explorer.json`.
- **Scripturile** sunt în `critic_probe/`, iar ieșirile în `critic_probe/iesiri/`. Hamul `h.py` e copiat de la criticul 23, iar `m.html` e pagina lui de montare, plus două gazde noi.
  - A: `a_g.py`, `a_g2.py`, `a_m4.py`, `a_m12.py`, `a_m1b.py`, `a_m1c.py`;
  - B: `b_aspect.py`, `b_dump.py`, `b_extra.py`, `b_fundal.py`, `b_ic.py`, `b_vederi.py`;
  - C: `c_mont.py` și `d_regres.py` (copiile probelor criticului 23, cu „înainte” = `27/inainte`), `c_asist*.py`, O4.
- **Ce n-am atins:** Explorer, Windows, Word, Excel și PowerPoint reale; ecranul omului; nimic sub `aplicatii/`; git care scrie.
- **Ce n-am rulat:** `masoara.py`, `porti.py`.
  - O4 l-am rulat direct, cu `LH_IESIRE=critic_probe/iesiri/O4`.
  - În afara `critic_probe/` am scris doar copii în %TEMP% (`r27_critic_*`), șterse la final.

## 2. A. GRAV-urile vechi

### N2 (critic 19) — scurtăturile browserului din câmpurile Explorer: **rămâne ÎNCHIS** (`a_g.py` → `iesiri/a_g.json › n2_*`)
- **În caseta F2 (harta, „hx”)** am apăsat F5, Ctrl+R, Ctrl+P, Alt+←, F12, Ctrl+L, F3 și Ctrl+D:
  - `defaultPrevented: true` pe `window`, în faza de bubble, la toate;
  - caseta rămâne „hx”, cu focusul în ea, iar `stare()` nu se schimbă.
- **În căutare („ha”), unde runda 27 a schimbat codul:** aceleași 8 taste sunt oprite, iar textul rămâne „ha”, `nume_fisiere` și calea rămân aceleași.
  Ctrl+Z dă „h”, iar Backspace dă „”, deci lucrează în text.

### N1 (critic 19) — mesajul central pe fereastra mică: **rămâne ÎNCHIS** (`a_g.json › n1`)
Pe 1093×526 @1,25, clic pe „Acest PC”:
- evenimentul e `clic / nesimulat`;
- mesajul e la `[361,456,370,35]`, în pagină și deasupra;
- rădăcina are 526, la fel `scrollHeight` și `innerHeight`.

### G23-1 — „a/b” la redenumire: **rămâne ÎNCHIS** (`a_g.json › g23_1`)
- Numele rămân (`harta.png` e acolo), iar evenimentul e `tasta_enter / nesimulat`.
- Apare mesajul central, iar ecranul = starea.

### G27-1 (găsit și reparat de constructor) — focusul după clicul care confirmă redenumirea: **ÎNCHIS pe clic; rămâne pe tragere → MINOR M27-1** (`a_g.py`, `a_g2.py`)
Pașii: F2 pe tema, „comp”, apoi gestul, apoi o tastă. Am rulat aceeași probă pe worktree și pe o copie cu `27/inainte/explorer.js`.

| gestul care confirmă | focusul după (acum) | tasta de după (acum) | înainte de r27 |
|---|---|---|---|
| clic pe alt rând (harta) | în Explorer | Delete → `tasta_delete / stergere`, harta în Coș | focusul pe `<body>`, Delete nu face nimic |
| clic în panou (Documente) | în Explorer | ↓ → `sageti / mutare_selectie` | `<body>`, ↓ nu face nimic |
| Ctrl+clic, Shift+clic, clic pe antetul Nume, clic pe Copiere din bară, clic pe același rând, clic dreapta + Esc | în Explorer | Delete / Ctrl+A / Ctrl+V lucrează | — |
| atingere pe alt rând (telefon 390) | în Explorer | Delete → `stergere` | — |
| **cadru de selecție** (apăs pe loc gol, trag, las) | **`<body>`** | Delete, Ctrl+A: **nimic, niciun eveniment** | la fel |
| **tragerea unui rând** (notite → Desene) | **`<body>`** | Ctrl+Z: **nimic, niciun eveniment** | la fel |

- **Martorul:** fără redenumire deschisă, aceleași două trageri lasă focusul în Explorer, iar Delete / Ctrl+Z lucrează. Deci de vină e doar
  confirmarea în `pointerdown`.
- **Cauza:** `I.la.jos` (`:703`) cheamă `root.focus()`. Blur-ul casetei confirmă atunci și redesenează (`:441` → `deseneaza`), iar nodul
  de sub cursor iese din pagină. Reparația `:768-771` e doar în `I.la.clic`; `I.la.sus` (`:729-761`), pe unde trec selecția și tragerea, nu are reparația.
- **Verdict:**
  - G27-1 e închis pe gesturile pe care le-a numit constructorul;
  - restul nu e GRAV: nu e pe drumul lecțiilor. v/m2-l10 spune „Nu trage fișierele cu mouse-ul”, iar l11 alege mai multe fișiere cu Ctrl + clic (merge);
  - rămâne MINOR M27-1, de reparat întâi.

### MINOR 4 (critic 23) — redesenarea gazdei cu redenumirea deschisă: **ÎNCHIS** (`a_m4.py` → `iesiri/a_m4.log`, pe `critic_probe/m.html`)

| varianta | după mutare | apoi | rezultat |
|---|---|---|---|
| gestul criticului 23 (`redeseneaza()`, gazda cheamă `focus()`) | caseta „comp”, focusul în ea, `tema.docx` neschimbat, 0 evenimente | X + Enter | `compX.docx`, `tastare` + `tasta_enter / redenumire` |
| gazda NU cheamă `focus()` | caseta „comp”, focusul pe `<body>`, 0 evenimente | X (nu ajunge nicăieri), clic pe harta, Delete | „comp” se confirmă la clic (`comp.docx`, `clic / selectare`), iar Delete o șterge pe harta |
| la fel, apoi clic ÎN casetă | focusul intră în casetă | End + W + Enter | `compW.docx` |
| Esc după mutare | caseta „comp” | Esc | `tema.docx`, `tasta_esc / anulare_redenumire` |
| mutarea în două task-uri (rădăcina scoasă, pusă înapoi după 60 ms) | caseta „comp”, focusul în ea | Y + Enter | `compY.docx` |
| două mutări la rând | caseta „comp”, focusul în ea | End + Z + Enter | `compZ.docx` |

- Nicio variantă nu schimbă un nume fără eveniment.
- `c_mont.py`, gestul criticului 23 reluat întocmai, dă tot așa: caseta „comp”, X + Enter → `compX.docx`.
- **Rămâne MINOR 5** (clicul în bara gazdei confirmă numele fără eveniment Explorer). E vechi și e declarat (R27-6).

### MINOR 1 (critic 23) — meniurile mai înalte decât fereastra: **ÎNCHIS** (`a_m12.py`, `a_m1b.py`, `a_m1c.py`)
- **Rotița pe meniu.** Am verificat fiecare rând cu `elementFromPoint`, în poziția de sus și după derulare:

  | meniul | fără derulare | rânduri neapăsabile în ambele poziții |
  |---|---|---|
  | Nou, din bară, la 1093×526 @1,25 | 16 / 21 | **0** |
  | Nou din meniul de fundal, la 1093×526 | 16 / 21 | **0** |
  | meniul clasic, la 1366×768 | 25 / 33 | **0** |
  | meniul clasic, la 1093×526 | 21 / 33 | **0** |

  - Clicul real pe ultimul rând merge:
    - „Folder comprimat (ZIP)” → `clic / nesimulat / meniu:Folder comprimat (ZIP)`;
    - „Proprietăți” din meniul clasic → `clic / nesimulat`.
  - Pagina nu se derulează (`scrollY` 0).
  - Proba criticului 23 derula pagina, nu meniul: constructorul are dreptate.
- **Degetul pe telefon (R27-2, „nedovedit headless”): dovedit.**
  - `Input.synthesizeScrollGesture` nu derulează headless nici un div martor oarecare (`scrollTop` 0), deci nu se poate folosi.
  - Cu `Input.dispatchTouchEvent` (touchStart, 12 × touchMove, touchEnd) martorul se derulează (`scrollTop` 159).
  - Meniul Nou, la 360 și la 390: `scrollTop` 0 → **102** (= 698 − 596, tot drumul).
    - Rândurile de jos (Document text, Excel, ZIP) devin apăsabile;
    - atingerea pe ZIP dă `clic / nesimulat`;
    - gestul nu emite nimic.

### MINOR 2 (critic 23) — Ctrl+Z / Ctrl+Y în căutare: **ÎNCHIS** (pasul de anulare rămâne literă cu literă → [FARA_REFERINTA] 5) (`a_m12.py`)
- **Căutarea**, după „hart” scris cu tastele:
  - Ctrl+Z ×4 dă „har” → „ha” → „h” → „”;
  - Ctrl+Y ×2 dă „h” → „ha”;
  - Ctrl+Shift+Z ×2 dă „har” → „hart”.
  - La fiecare pas, lista = `ordine_afisata`, iar bara de stare urmează („1 elemente”, „5 elemente” la gol).
- **Un `<input>` martor din pagină:** primul Ctrl+Z golește tot cuvântul, iar Ctrl+Shift+Z îl aduce înapoi întreg.
- **Afirmația constructorului („Chromium închide grupul de anulare la orice schimbare a paginii”): adevărată.** Am probat pe o pagină goală,
  cu „hart” + Ctrl+Z:
  - input fără ascultător → „”;
  - input care schimbă un `div` la fiecare literă → „har”;
  - aceeași schimbare făcută în `requestAnimationFrame` → tot „har”.
- **Gesturile vecine:**
  - lipirea (Ctrl+V cu „tema”) filtrează la `tema.docx`, iar Ctrl+Z întoarce textul de dinainte și filtrul lui;
  - cu meniul Nou deschis, clicul în căutare închide meniul și „n” filtrează la 3 rânduri;
  - pe telefon, `insertText` „ha” filtrează la harta, iar compunerea IME „ș” dă „haș” și 0 rânduri, cu ecranul = starea și focusul în casetă;
  - cu dialogul Shift+Delete deschis, clicul cade pe fundalul dialogului (`clic / fara_efect`), iar căutarea nu se schimbă (`b_extra.json`).

## 3. B. Unghiul ASPECT (independent de lanțul constructorului: referința citită direct)

### B1. 1366×768, fereastra 1284×638 (`b_aspect.py`, `b_dump.py`, `b_ic.py`)
**Cum am pus referința peste simulator.** Simulatorul așază fereastra reală 1534×814 cu 1 px de bordură:
- piesele ancorate sus-stânga au `x_sim = x_ref + 1` și `y_sim = y_ref + 1`;
- piesele ancorate în dreapta au distanța până la marginea dreaptă = cea din referință + 1.

| piesa (referința) | abaterea |
|---|---|
| Minimizare, Maximizare, Închidere `[1387/1434/1480, 1, 47/46/47, 30]` | +1 (bordura) |
| fila `[12,8,248,32]`, Închideți fila, Adăugați o nouă filă | +1 |
| Înapoi `[19,48,32,32]`; adresa x 209, h 32; căutarea, la 19 px de dreapta, 378×32 | +1 |
| bara: Nou `[14,89,85,46]`, Ștergere, Sortați `[401,89,97,46]`, Vizualizați `[502,89,116,46]`, Mai multe opțiuni; Previzualizare (dreapta) | +1 |
| antetul (Nume 340, Data 180, Tip 150, Dimensiune 100), primul rând (lista +14, +31, 752×24) | 0 / +1 |
| bara de stare (8, h 24, 8 px de jos), „N elemente” `[20,782,62,24]` (acum 59×24), Detalii / Pictograme mari | +1; înălțimea textului **24 = ref** (reparația `:119` e adevărată) |
| **panoul de navigare** `[10,136,389,646]` | **lățimea 333 (−56)** → lista la x 348 în loc de 404 (R27-1) |
| **panoul de examinare** (`Modul imagini mici` `[1066,140,456,638]`) | **lățimea 385 (−71)**; `clamp(0px,30%,456px)`, `:116`. Constructorul nu-l numește → [FARA_REFERINTA] 1 |

**Meniurile față de referință:** primul, al doilea și ultimul rând, pasul și cutia, din `b_aspect.log › meniu`.

| meniul | referința | simulatorul |
|---|---|---|
| Nou | rândurile `[15,7,264,28]`, `[15,39,…]`, ZIP `[15,647,264,28]`, pasul 32 | identic, 0 px |
| Sortați | `[15,7,172,28]` … Grupare după `[15,205,…]`, 7 rânduri | identic, 0 px |
| Vizualizați (11 rânduri + submeniul Afișați, 5) | `[15,7,221,28]` … Afișați `[15,333,…]` | identic, 0 px. **Submeniul e deschis de la sine** → [FARA_REFERINTA] 2 |
| fișier (Windows 11) | `[16,6,322,32]` … Afișați mai multe opțiuni `[16,440,…]` | identic, 0 px |
| fundal | `[16,6,287,32]` … `[16,289,…]`, 9 rânduri cu „Anulare Copiere” | identic, 0 px, cu ceva de anulat; **fără „Anulare”, golul rămâne** (Nou la y 143, nu 111) → [FARA_REFERINTA] 3 |
| clasic | Open `[3,3,277,26]`, Proprietăți `[3,822,277,26]`, 33 de rânduri | identic, 0 px |

Concluzia: cele 141 de dreptunghiuri ale constructorului se țin și cu referința citită direct. Excepția sunt cele două panouri.

**Fonturile.** UIA nu dă mărimea literei, dar dă lățimea și înălțimea blocurilor de text. Am randat textele din referință cu fontul simulatorului
(canvas `measureText`, Segoe UI Variable, `b_aspect.log › lățimi`):

| unde | textele din referință (lățimea UIA) | randate la 12 px (simulatorul) | randate la 14 px |
|---|---|---|---|
| cărarea din adresă | Disc local (C:) 83 · Utilizatori 60 · AppData 55 · Local 32 · Temp 34 · lh_explorer_ref 91 · sesiune 46 | 70,3 · 50,7 · 46,5 · 27,2 · 28,8 · 77,3 · 39,2 | **82 · 59,2 · 54,3 · 31,8 · 33,6 · 90,1 · 45,8** |
| textul gri din căutare | Căutați în sesiune 113 | 93 | **108,5** |
| fila | sesiune 41 | **39,2** | 45,8 |
| panoul de navigare | Acest PC 51 · Disc local (C:) 76 · Volum nou (W:) 87 (cu ~5 px margine) | **46,2 · 70,3 · 82** | 53,8 · 82 · 95,7 |
| bara de stare | 6 elemente 62 | **59** | 68,8 |

- Fila, panoul și bara de stare sunt la 12 px, ca în realitate.
- **Cărarea din adresă și căutarea sunt la 14 px în Explorer real:** 7 din 7 texte se potrivesc la ±1 px. În simulator sunt la 12 px
  (11-15 % mai înguste) → **MINOR M27-2**.
- Blocurile de text din meniuri au în referință înălțimea 19, ca în cărare și căutare (fila, la 12 px, are 15). Deci meniurile sunt probabil
  și ele la 14 px; în simulator sunt la 12 px (`b_extra.json`). Pe meniuri dovada e doar înălțimea, deci intră în M27-2 ca „probabil”.

**Pictogramele** (`b_ic.log`):
- Pe filă, pictograma e la +12, +8 în filă: = ref.
- În butoanele cu text ale barei, pictograma e mai la stânga decât în referință: Nou +9 (ref. +12, −3), Sortați +9 (−3), Vizualizați +10 (−2), cu y +15 (ref. +16).
  - Cauza: `.lh-ap-e-cb{justify-content:center;gap:6px}` (`:89`) centrează grupul, în loc de marginea de 12 px din stânga.
  - Butoanele fără text (Decupare … Ștergere) au +12 = ref.
  - Intră în M27-2.
- Desenul pictogramelor: UIA nu-l dă → R27-4.

**Rama ferestrei** (`iesiri/b_colturi.png` = colțurile capturii la 1366, mărite) → **MINOR M27-3**.
- În referință, fereastra are 1534×814, dar tot ce e în ea stă în `[8 … 1526] × [0 … 806]`:
  - `DesktopChildSiteBridge` `[8,2,1518,134]`;
  - `ShellTabWindowClass` `[8,136,1518,670]`;
  - bara de stare `[8,782,1518,24]`;
  - Închidere se termină la 1527.
- Cei 8 px din stânga, dreapta și jos sunt marginea invizibilă de redimensionare a Windows 11, inclusă în dreptunghiul ferestrei.
- Simulatorul o pictează ca suprafață a ferestrei: `:61`, rândul de 8 px de jos al grilei și marginile de 8 px, cu bordura gri la exterior. Urmarea:
  - butonul Închidere stă la 8 px de marginea ferestrei, în loc să fie lipit de ea;
  - bara de stare stă la 9 px deasupra marginii de jos;
  - conținutul începe la 9 px de marginea stângă.
- Dovada e structura referinței. Desenul ramei nu e capturat, deci propun captura (D).

### B2. Ecranele (`b_aspect.log › ecran`, capturi `iesiri/b_*.png`)

| ecranul | fereastra | derulare orizontală / verticală | panou nav / lista / examinare | ce e în pagină | butoanele barei |
|---|---|---|---|---|---|
| laptop 1093×526 @1,25 | `[81,1,1011,524]` | nu / nu | 262 / 405 / 303 | bara de stare, căutarea (303 px), Închidere | toate apăsabile |
| telefon 360×740 | `[59,1,300,598]` | nu / nu | 118 / 174 / — | bara de stare, căutarea (92), Închidere | Partajați … Previzualizare după glisare |
| telefon 390×844 | `[59,1,330,598]` | nu / nu | 118 / 204 / — | la fel | Ștergere … Previzualizare după glisare |
| tabla 1920×1080 | `[81,1,1838,638]` | nu / nu | **389** / x 404 / **456** = ref | toate | toate |

- **Telefonul 360:** am glisat bara cu degetul (`dispatchTouchEvent`, `b_vederi.json`):
  - `scrollLeft` ajunge la 243;
  - atingerea pe Ștergere cu harta aleasă dă `clic / stergere / bara_comenzi:Ștergere`, iar harta ajunge în Coș.
- **Tabla:** lățimile din referință se ating abia aici, la fereastra de 1838 px. Fereastra rămâne înaltă de 638 px pe ecranul de 1080 (`--e-h:640px`) → [FARA_REFERINTA] 7.
- **Vederea „Pictograme mari”** (butonul din bara de stare, folosit de lecții):
  - clicul dă `clic / vizualizare`;
  - dalele au 96×86, iar ordinea lor = `ordine_afisata`;
  - harta + Delete → Coș.
  - Referința n-are vederea aceasta (R27-5).
- **Constatarea unghiului: niciun GRAV.**
  - Geometria se ține la ±1 px pe toate piesele și pe toate meniurile.
  - Abaterile cu dovadă sunt de aspect: fontul de 12 în loc de 14 px în adresă / căutare, pictograma din butoanele cu text, rama de 8 px. Nu blochează și nu induc în eroare → MINOR.
  - Lățimile panourilor la ferestre mai înguste n-au referință.

## 4. C. Regresul
- **O4** (`oracol_comportament.py --scenarii critic_probe/iesiri/scen_explorer`, 07:37:49-07:38:49): **18/18**, 0 diferențe, 0 ecran ≠ stare (`iesiri/O4.log`).
- **„Ce a trecut” din `23/critic.md`, pe eșantion** (`d_regres.py`, copia probei criticului 23; „înainte” = același worktree, cu `27/inainte/explorer.js`):
  - **secvența de 61 de pași** a criticului 19: **0 diferențe** de evenimente, stare și ecran. Câmpul `mes` a ieșit de data asta identic;
  - **E1:** un singur mesaj la +40 și la +1500 ms, **0 cadre fără mesaj** până la 5,0 s, ultimul cadru la ~5,0 s;
  - **E2 / telefonul 360 și 390:** Nou › Folder „Ex Pop Ana”, „compunere”, „harta mare”, Esc pe Desene. Finalurile sunt identice;
  - **fereastra mică D1:** rândul Folder e la y 9-37, caseta la y 199-219, cu focusul în ea;
  - **mesajul central în Word (Ctrl+H), Excel (Ctrl+K), PowerPoint (Ctrl+F) și Windows (clic dreapta pe bară):** câte unul, în pagină și deasupra;
  - meniul deschis + clicul sub rădăcină: meniul rămâne deschis, ca înainte (MINOR 5).
- **Montarea `incadrat: true` pe gazda mea** (`c_mont.py`, copia criticului 23). Jurnalul e identic cu al criticului 23, rând cu rând, cu o singură excepție: redesenarea în redenumire (MINOR 4, acum reparat).
  - 0 evenimente scăpate la gazdă, la `document` și la `window`;
  - F5, Ctrl+R, Alt+← și Ctrl+P sunt oprite;
  - redesenarea cu focusul în listă merge;
  - `inchide` lasă 0 rădăcini și 0 mesaje.
  - **Pixelii față de `27/inainte`, pe 6 cadre** (pornirea, Nou, meniul fișierului, meniul de fundal, caseta F2, Shift+Delete): **0 pixeli diferiți, 0 ținte mutate**.
    Reparația `:119` (înălțimea casetei „N elemente”) nu mută literele.
- **Asistentul (`aplicatii.js`, r28) pe drumul Nou › Folder › nume + Enter** (`c_asist.py`, `c_asist3.py`):
  - rotița ×3 și săgețile ×3 nu dau indiciu;
  - după 2 greșeli, indiciul „Apasă Nou” vine pe `bara_comenzi:Nou`;
  - clicul pe Nou face pasul 1, iar indiciul dispare;
  - 2 greșeli cu meniul deschis îl închid (vezi [FARA_REFERINTA] 4). La redeschiderea lui Nou, „Alege Folder” e pe `meniu:Folder`;
  - Folder face pasul 2, iar „Ex” + Enter face pasul 3 (`asteapta`). Rezultă `Ex/`.
- **Ce a schimbat runda 27 în alte aplicații:** nimic. N-a atins cod comun, iar mesajul central din celelalte 4 aplicații e ca înainte.

## 5. D. [FARA_REFERINTA]
1. **Lățimea panourilor la o fereastră mai îngustă decât captura** (R27-1, extins).
   - La fereastra de 1284 px a poligonului, panoul de navigare are 333 (ref. 389), iar **panoul de examinare 385 (ref. 456)** (`:93`, `:116`, ambele `clamp(…%)`).
   - Explorer real își ține lățimile panourilor în pixeli (cele trase de utilizator), deci la 1284 ar strâmta lista, nu panourile. Asta n-o arată nicio captură.
   - De capturat: aceeași fereastră la 1284×640, cu Previzualizare pornit.
2. **Vizualizați se deschide cu submeniul „Afișați” deja deschis** (16 rânduri vizibile imediat după clic, `b_extra.log`).
   - Captura `explorer_meniu_vizualizare` are submeniul deschis pentru că mouse-ul stătea pe „Afișați” (are și tooltip-ul).
   - În realitate, submeniul se deschide la trecerea peste „Afișați”. De capturat: meniul imediat după clic, cu mouse-ul pe buton.
3. **Meniul de fundal fără nimic de anulat** păstrează golul rândului „Anulare …”: Nou e la y 143, nu 111, iar cutia are tot 343 (`b_fundal.log`).
   Referința are doar starea cu „Anulare Copiere”.
4. **Orice tastă în afară de săgeți închide meniul deschis:** x, Ctrl+V, Delete, F2, Home, cu `fara_efect` (`c_asist2.log`).
   - Un MenuFlyout real rămâne deschis la o literă sau la Ctrl+V.
   - Asistentul nu poate arăta indiciul pe un rând de meniu până când elevul nu redeschide meniul.
5. **Ctrl+Z în căutare, literă cu literă** (R27-3). E limita Chromium, dovedită pe pagina goală (A).
   - Dacă Explorer real anulează tot cuvântul, o filtrare amânată până la o pauză a tastării ar păstra grupul la scrisul rapid.
6. **Clicul în afara Explorer-ului cu redenumirea deschisă** (MINOR 5 / R27-6, vechi):
   - în poligon, clicul sub rădăcină confirmă `comp.docx` fără niciun eveniment, iar focusul e pe `<body>` (`b_extra.log`);
   - meniul deschis rămâne deschis.
7. **Tabla SMART:** fereastra rămâne înaltă de 638 px pe ecranul de 1080. Mărimea ferestrei pe un ecran mare nu e capturată (leagă de R30-1).
8. **„1 elemente”** (R15-5), **fonturile meniurilor** (dovada e doar înălțimea blocului), **desenul pictogramelor** (R27-4) și **„Pictograme mari”** (R27-5): ca înainte.

## 6. D. MINOR
1. **M27-1 — G27-1 pe tragere.**
   - Situația: redenumirea e deschisă și elevul o confirmă printr-un cadru de selecție sau prin tragerea unui rând.
   - Focusul ajunge pe `<body>`, iar Delete / Ctrl+A / Ctrl+Z de după nu fac nimic și nu emit nimic. Era la fel înainte de r27.
   - Cauza: `:703` + `:441` (confirmarea redesenează în `pointerdown`); `I.la.sus` (`:729-761`) n-are rândul `:771`.
   - Reparația: același rând la începutul lui `I.la.sus`. Proba: `a_g2.py › cadru_cu_ren / tragere_cu_ren`, care cere `tasta_delete / stergere` și `ctrl_z / anulare`.
2. **M27-2 — Literele din adresă și din căutare au 12 px; Explorer real are 14 px** (dovada: 8 lățimi de text din referință, B1).
   - Probabil la fel în meniuri.
   - Cauza: `:50` (`font:12px` pe rădăcină), fără mărime proprie la `.lh-ap-e-cr` (`:80`), `.lh-ap-e-caut` (`:84`) și `.lh-ap-e-mr` (`:127`).
   - Tot aici intră pictograma din butoanele cu text ale barei, cu 2-3 px prea la stânga (`:89`, `justify-content:center`).
3. **M27-3 — Rama: marginea invizibilă de 8 px a ferestrei reale e desenată ca fereastră** (B1).
   - Închidere nu e lipit de margine, iar bara de stare și conținutul au 8 px în plus față de marginea vizibilă.
   - Cauza: `:61` (rândul de 8 px al grilei și marginile) + `date/explorer.json › fereastra` 1534×814 luat ca fereastră vizibilă.
   - Hotărârea și captura: D.
4. **MINOR 5 (critic 23), clicul în bara gazdei** confirmă fără eveniment: rămâne (R27-6).
5. **MINOR-urile 3 și 6 din critic 23, cele din critic 19 și critic 15** rămân, cum a declarat constructorul.

## 7. Ce a trecut
- **N2:** 8 scurtături oprite în caseta F2 și în căutare; câmpul și starea neschimbate.
- **N1:** mesajul e în pagină și deasupra pe 1093×526.
- **G23-1:** nicio greșeală de nume nu pierde fișierul.
- **G27-1 pe clic:**
  - clic pe alt rând, în panou, Ctrl / Shift + clic, clic dreapta + Esc, antetul, bara, același rând, atingerea pe telefon;
  - focusul rămâne în Explorer, iar Delete / ↓ / Ctrl+A / Ctrl+V lucrează. Înainte de r27, clicul pe rând și cel din panou lăsau focusul pe `<body>`.
- **MINOR 4:** 7 variante (cu și fără `focus()`, Esc, mutare asincronă, două mutări, clic în casetă). Niciun nume nu se schimbă fără eveniment.
- **MINOR 1:**
  - rotița ajunge la toate rândurile meniurilor Nou (bară, fundal) și clasic, pe 1366 și pe fereastra mică;
  - degetul derulează meniul Nou pe 360 și 390, iar ZIP se atinge.
- **MINOR 2:**
  - Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z lucrează în căutare, cu lista = starea la fiecare pas;
  - lipirea și `insertText` / IME filtrează.
- **Aspectul:**
  - 21 de piese ancorate și 6 meniuri la ±1 px față de referința citită direct;
  - înălțimea textului din bara de stare = ref.;
  - pe telefon, căutarea în fereastră și bara glisabilă cu degetul;
  - pe tablă, lățimile din referință;
  - nicio derulare orizontală pe 5 ecrane.
- **Regresul:** O4 18/18, secvența de 61 de pași fără diferențe, E1 / E2 / D1, montarea identică cu criticul 23 (cu MINOR 4 reparat), 0 pixeli
  diferiți pe 6 cadre, asistentul pe drumul Nou › Folder › nume, mesajul central în celelalte 4 aplicații.

## 8. Predarea pentru runda următoare
- **Nu e niciun GRAV deschis.** Ordinea propusă:
  1. **M27-1** (un rând în `I.la.sus`, proba `a_g2.py`).
  2. **M27-2:** 14 px pentru cărare, căutare și (după captură) meniuri; pictograma din butoanele cu text la +12.
     - Atenție la lățimi: cărarea și textul gri din căutare cresc cu ~15 %. Pe telefon, căutarea are 92 px.
  3. **M27-3:** orchestratorul hotărăște. Fie se scot cei 8 px de ramă invizibilă (atunci tot ce e ancorat se mută cu 7-8 px), fie se capturează întâi rama.
- **De capturat** (desktopul ascuns, UIA), în ordinea folosului:
  - `DWMWA_EXTENDED_FRAME_BOUNDS` lângă `BoundingRectangle`, la aceeași fereastră (M27-3);
  - fereastra la 1284×640, cu Previzualizare pornit ([FARA_REFERINTA] 1);
  - meniul Vizualizați imediat după clic ([FARA_REFERINTA] 2);
  - meniul de fundal fără nimic de anulat ([FARA_REFERINTA] 3);
  - o literă și Ctrl+V cu meniul Nou deschis ([FARA_REFERINTA] 4);
  - Ctrl+Z în căutare (R27-3);
  - o captură de ecran decupată pe cărare și pe un rând de meniu, ca să închidă „probabil”-ul din M27-2.

GRAV_VECHI_DESCHISE: 0
GRAV: 0
