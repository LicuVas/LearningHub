# Runda `acoperire` Office (Word + Excel), după ciclul paralel C (21.11.2026)

Scopul: deblocatorii platoului O4 (O4 = 28 trei cicluri la rând, regula PLATOU a oprit valurile). Constructorii rundelor 24 și 25 arătaseră că o parte din ce numără O4 la Word și Excel sunt referințe sau scenarii greșite, nu simulatorul. Aplicațiile simulate (`aplicatii/`), lecțiile, jocurile și oracolele NU s-au atins. S-au schimbat doar referințe, scenarii, generatoarele lor și textul api al ciclului C.

Toate rezultatele noi vin din Office-ul real de pe PC (Excel 16.0.20326.20318, Word build 16.0.20326), într-o instanță NOUĂ a mea pe desktopul ascuns `LHScenarii`. Generatorul-soră: `referinte/acoperire_office_r26.py` (folosește clasele din `acoperire_excel_r7.py`, `acoperire_word_r3.py`, `ruleaza_real.py`).

## 1. Numerele: înainte → după

Înainte = `runde/26/masurare_ciclu_C.json`, copia identică (`cmp`) a lui `runde/26/masurare.json`, măsurarea comună a ciclului C.
După = `runde/26/acoperire_office/masurare.json` (06:01-06:59, singură pe mașină, `masoara.py --runda 26 --paralel 3 --compara runde/26/masurare_ciclu_C.json --timeout O6=3600`; jurnal `acoperire_office/masurare_dupa_acoperire.log`). După ea, `runde/26/masurare.json` a fost pus înapoi din copie (`cmp` = identic), iar `runde/26/iesiri/` a primit înapoi ieșirile ciclului C (ieșirile noi: `acoperire_office/iesiri/`). Copia `masurare_1.json` pe care `masoara.py` o face singur era identică cu `masurare_ciclu_C.json`; am șters-o.

| | înainte | după | de ce |
|---|---:|---:|---|
| O1 central | 61 | 61 | — |
| O2 identic | 13392 | 13392 | — |
| O3 interfață | 28919 | 28919 | — (nicio suprafață nouă în `uia_*.json`) |
| O4 comportament | 28 | **15** | −13: referințele și scenariile reparate (§6) |
| O5 evenimente | 35 | 35 | — |
| O6 sarcini | 0 | 0 | — (1724 s, sub limita de 3600 s) |
| O7 text UI | 341 | 341 | — (textul api nou nu-l mișcă, §7) |
| O8 comenzi moarte | 102 | 102 | — |
| O9 asistare | 13 | 13 | — (textul api nou nu-l mișcă, §7) |
| porți | 41 | 41 | toate pe `cum_fac` (41); `date_personale` 0, restul 0 |

Lacăt: ok. Neconcludente: 0. Suma măsurată: 42932 → 42919 (−13). Durata: 3525 s. `masoara.py`: „regres față de 26/masurare_ciclu_C.json: niciunul (n cu n pe O1-O9 și pe fiecare poartă)”; codul de ieșire 1 = suma e mai mare decât 0, nu regres.

## 2. Mutanții și oracolele
Niciun oracol atins. O4 citește singur `scenarii/**` + `referinte/scenarii_real/`; bancul de mutanți nu trebuie rulat din nou (ca în rundele `acoperire` 7 și 14).

## 3. Fișiere schimbate și înghețate
- NOU `referinte/acoperire_office_r26.py`: comenzile `stare`, `excel`, `word` (`--doar=captura|scenarii`), `scrie_scenarii` (`--dupa-rulare`), `verifica`. Pornește Office doar pe desktopul ascuns și refuză desktopul vizibil; o sesiune nu pornește nimic nou după 8 minute. `verifica` = 0.
- `referinte/acoperire_excel_r7.py` (generatorul corectat, nu doar JSON-ul):
  - pasul `com:sort2` cheamă `sortare_doua_niveluri(ws)` = `Worksheet.Sort` cu două `SortFields` (Clasa, Cell Values, A to Z; Punctaj, Cell Values, Largest to Smallest; Header = xlYes; `Apply`), adică obiectul ferestrei Sort, un nivel = un SortField;
  - descrierea din `SCEN_R7` spune același lucru;
  - `VECHI_R7` = doar `excel-salvare-ca`: autocompletarea și separatorul sunt acum ale generatorului r26. `acoperire_excel_r7.py verifica` = 0.
- `scenarii/excel/`: `excel-sortare-doua-niveluri` (doar descrierea), `excel-autocompletare-tab`, `excel-separator-virgula` (momentul 1), NOI `excel-autocompletare-tab-esc-esc`, `excel-separator-virgula-esc-esc` (momentul 2).
- `scenarii/word/`: `word-clic-pune-cursorul` (clic pe granița „me|re”), `word-imagine-inserare` (Pictures ▾ › „This Device...”), `word-copiere-lipire`, `word-decupare-lipire` (fără `trimis_la_profesor`, `rulat_de` = r26).
- `referinte/scenarii_real/`: 9 rezultate reale, toate `mod_probat: true`, toate de azi: sortare, autocompletare + pereche, separator + pereche, clic, imagine, copiere-lipire (nou), decupare-lipire (nou).
- `api_biblioteca.md`: textul ciclului C (§4 de mai jos).
- În afara zonei înghețate: `de_verificat.md` (R24-2, R25-1, R25-2, rândurile 14-15 bifate; R24-1 adnotat; blocul `RUNDA26-ACOPERIRE-OFFICE` R26O-1…5), `de_aprobat.md` (A26O-1…3).
- `repere.lock`: reînghețat cu `ingheata.py --acoperire "dupa ciclul paralel C: deblocatorii platoului O4 Word/Excel (sortare, Esc+Esc, clic, This Device, fara real)"` (434 de fișiere = 427 + cele 7 noi), apoi `--verifica` = 0 (și la final, vezi §8).

Dovezile brute stau în `runde/26/acoperire_office/`: `excel_jurnal_0535/0542/0550/0556.json`, `word_jurnal_0530/0557.json`, `capturi_word_brut.json`, `excel_rulare1-4.log`, `word_captura_rulare1.log`, `word_scenarii_rulare1.log`, `o4_pornire*.txt`, `o4_atinse/`, `scen_atinse/`, `api_diff_ciclu_C.txt`, `ruleaza_real_verifica_inainte/dupa.txt`, `stare_masina_inainte/dupa.json`, `stare_autor.md`. Fără căi `C:/Users` și fără nume de cont (grep + `verifica`).

## 4. Ce s-a acoperit, cu căile

### 4.1 `excel-sortare-doua-niveluri` (R25-1)
Diagnosticul, pe același tabel, în aceeași instanță (`excel_jurnal_0535.json` › `fapte.sortare_diagnostic`):
| apelul | VIII A (Punctaj) | VIII B (Punctaj) |
|---|---|---|
| a. `Range.Sort(Key1=…, Order1=1, Key2=…, Order2=2, Header=1)`, argumente numite (codul din runda 7) | 60, 88, 95 | 60, 78, 95 — `Order2` nu ajunge |
| b. `Range.Sort` pozițional, cu `Type=None` | 88, 60, 95 | 95, 78, 60 — a doua cheie nu ajunge deloc (ordinea de pornire) |
| c. `Worksheet.Sort` cu două `SortFields` | **95, 88, 60** | **95, 78, 60** — Largest to Smallest |
Realul nou (c): Elena 95, Ana 88, Carmen 60 / Bogdan 95, Dan 78, Florin 60.

### 4.2 `excel-autocompletare-tab`, `excel-separator-virgula` (R25-2) — varianta aleasă și de ce
Am ales ca scenariul să facă **aceiași pași ca elevul**, în două momente, pentru că un singur moment nu se poate citi cinstit pe ambele părți:
- **Momentul 1** (scenariul vechi, pașii până la Enter): ce vede elevul imediat, mesajul și faptul că a rămas în celulă (`fereastra_mesaj`, `ramane_in_editare`). Celulele NU se mai citesc aici: cât Excel e în modul de editare, modelul obiect nu răspunde, deci realul le citea abia după Esc + Esc.
- **Momentul 2** (perechea `…-esc-esc`): după mesaj, elevul apasă Esc (mesajul se închide, rămâne în celulă), apoi Esc („Esc renunță”, `jocuri/_fixtura-excel/index.html:92`). Se citesc celulele, mesajul și editarea.
- „Realul fără Esc + Esc” ar fi cerut citirea celulei în timpul editării, ceea ce Excel real nu dă prin COM. De aceea n-am ales-o.
- **Pe drum:** Esc postat documentului (rularea 0542) sau ferestrei `NUIDialog` (0550) NU închide mesajul pe desktopul ascuns: realul ieșea cu mesajul încă deschis. Am aruncat acele reale. Esc ajunge doar prin copilul `NetUIHWND` al ferestrei (unde ține NetUI tastatura). Proba canalului `taste_in_mesaj`, în aceeași rulare (0556): pozitiv = mesajul se închide și Excel rămâne în editare; control = fără Esc, mesajul e tot acolo.
- Realul: momentul 1 = mesajul „You've entered too few arguments for this function.” / „There's a problem with this formula. …”, OK, `ramane_in_editare: true`; momentul 2 = A1:A3 = 4, 5, 6, fără mesaj, `ramane_in_editare: false`.

### 4.3 `word-clic-pune-cursorul` (R24-1)
Pasul e acum `{"gest": "clic", "de_la": 10, "pana_la": 10}`: ținta `pozitie:10` din `api_biblioteca.md` §7.2 (caretul înaintea caracterului 10, între „me” și „re”). Realul dă clic exact pe graniță (`Window.GetPoint` pe domeniul gol 10-10), O4 la fel. Pe graniță, cea mai apropiată graniță e chiar ea, iar vecinele sunt la o literă distanță, deci rotunjirile de sub un pixel nu mai contează. Realul nou: `de_la = pana_la = 10`.

### 4.4 `word-imagine-inserare` (R24-2)
Captura din Word real (`capturi_word_brut.json`): Insert › **Pictures ▾** (Alt, N, P) deschide grupul „Insert Picture From” cu **This Device...** (Alt, N, P, D), Stock Images... (S), Online Pictures... (O). Rândul n-are idMso în UI Automation; apăsat, deschide `#32770` „Insert Picture”, aceeași fereastră ca `ExecuteMso('PictureInsertFromFile')` (închisă cu Cancel, nimic inserat). Pasul scenariului: `comanda_panglica`, `fila: TabInsert`, `id_mso: FlyoutAnchorInsertPictures`, `element: "This Device..."` (eticheta reală, cu trei puncte). Realul (model): o imagine în linie, nicio imagine flotantă.

### 4.5 Cele „fără real probat”
| scenariul | ce s-a întâmplat |
|---|---|
| `word-copiere-lipire` | **jucat**: Ctrl+C, clic după punct, Ctrl+V, cu tastele adevărate. Clipboard-ul omului era gol: golit înainte, pus la loc după (gol). Ctrl+C a schimbat clipboard-ul („mere”). Real: „Ana are mere. mere” (Word pune singur spațiul). |
| `word-decupare-lipire` | **jucat**, la fel: „Plecăm luni.Aduceți apă. ” (fără spațiu după punct, spațiul vechi rămâne la capăt). R26O-5 cere o privire pe Word-ul din laborator (setarea „Smart cut and paste”). |
| `word-font-size-tastat` | nejucat: nici `SetFocus` prin UI Automation nu dă focusul casetei pe desktopul ascuns (focus fals, valoarea „11”), ca și clicul postat din runda 3 → R26O-1. |
| `word-tragere-selectie` | nejucat: mouse-ul postat nu alege nimic, nici cu butonul ținut în starea firului → R26O-2. |
| `excel-tragere-zona`, `excel-tragere-umplere-gest` | nejucate: mouse-ul postat dă doar clicul (B2); cu butonul ținut în starea firului zona devine „A1:B2” → R26O-3. |
| `word2007-*` (4), `powerpoint-*` (3) | neatinse (Word 2007 nu e pe PC; PowerPoint nu se pornește). |

## 5. Rânduri din `de_verificat.md` închise
- **R25-1**, **R25-2**, **R24-2** bifate, cu dovada în rând.
- Rândurile 14-15 (`word-copiere-lipire`, `word-decupare-lipire`) bifate.
- **R24-1** adnotat: ocolit (clicul pe graniță); întrebarea despre x + 15 / 16 px rămâne, dar nu mai ține O4.
- Noi: **R26O-1…R26O-5** (Font Size, tragerile, Word 2007 / PowerPoint, Ctrl+X/V în laborator).
- `de_aprobat.md`: **A26O-1** (cele două momente), **A26O-2** (clicul pe graniță), **A26O-3** (eticheta „This Device...”).

## 6. Ce vede O4 acum: scenariu → înainte / după

Înainte = `runde/26/iesiri/O4` al ciclului C (pus la loc după măsurare); după = măsurarea finală (`acoperire_office/iesiri/O4/oracol_comportament.json`, 06:11). Unitățile O4 pe scenariu:

| scenariul | înainte | după | de ce |
|---|---:|---:|---|
| `excel-sortare-doua-niveluri` | 8 (diferențe: realul greșit) | **0** | realul refăcut cu Largest to Smallest (§4.1) |
| `excel-autocompletare-tab` | 1 (`celule.A4`: momente diferite) | **0** | citește doar momentul 1 (§4.2) |
| `excel-autocompletare-tab-esc-esc` (nou) | — | **0** | momentul 2, cu Esc, Esc pe ambele părți |
| `excel-separator-virgula` | 1 (`celule.B1`) | **0** | la fel |
| `excel-separator-virgula-esc-esc` (nou) | — | **0** | la fel |
| `word-clic-pune-cursorul` | 2 (9 vs 10, de la / până la) | **0** | clicul pe graniță (§4.3) |
| `word-imagine-inserare` | 1 (neexecutabil: `mso:PictureInsertFromFile` nu e pe ecran) | 1 (neexecutabil: `meniu:This Device...` nu e pe ecran) | **acum e defectul simulatorului**: `word.js:1664` are rândul „This Device”, Word real „This Device...” (PowerPoint are deja „This Device...”, `powerpoint.js:1753`) |
| `word-copiere-lipire` | 1 (fără real) | 1 (diferență) | **defectul simulatorului**: simulatorul „Ana are mere.mere”, Word real „Ana are mere. mere” (spațierea inteligentă la lipire) |
| `word-decupare-lipire` | 1 (fără real) | **0** | realul nou = simulatorul |
| `word-font-size-tastat` | 3 (fără real + 2 chei neexecutabile) | 3 | nejucat (R26O-1) |
| `word-tragere-selectie`, `excel-tragere-zona`, `excel-tragere-umplere-gest` | 1 + 1 + 1 | 1 + 1 + 1 | nejucate (R26O-2, R26O-3) |
| `word2007-*` (4), `powerpoint-*` (3) | 7 | 7 | neatinse |
| **total O4** | **28** | **15** | diferențe 12 → 1, chei neexecutabile 3 → 3, fără real 13 → 11 |

Deci O4 nu mai numără nimic care să fie al referinței: din cele 15 unități, 2 sunt defecte adevărate ale simulatorului Word (eticheta „This Device...” și spațiul la lipire), cu referință și oracol, iar 13 sunt scenarii pe care nu le poate juca nimeni invizibil (Font Size, tragerile, Word 2007, PowerPoint), puse la Vasile.

## 7. Textul api din ciclul C
Am aplicat în `api_biblioteca.md` exact diferențele dintre versiunea înghețată și `runde/26/api_biblioteca_ciclu_C.md`: 4 bucăți, 13 rânduri noi și 3 înlocuite, 16 în total (`acoperire_office/api_diff_ciclu_C.txt`; după aplicare, fișierele sunt identice octet cu octet). Fiecare, verificat pe codul de azi (doar citire):
- **§1, `opt.incadrat`**: `explorer.js:198-202` (fără bara de titlu și fără desktop, clasa care umple gazda), `:246` (`stare().titlu` = folder + „ - Explorer”), `:275-276`, `:926-932` (evenimentele oprite în rădăcină). `instanta.radacina` și `instanta.focus()` există (`aplicatii.js:127-128`). Nicio gazdă din `aplicatii/` nu montează azi cu `incadrat` (`windows.js` nu, A23-1 e încă deschis), deci fraza despre gazdă e o regulă pentru gazda viitoare, nu o descriere a ce se întâmplă azi.
- **§4, `win_<literă>` / `win_shift_<literă>`**: `aplicatii.js:266-274` (tasta cu sigla fără Ctrl, nu pe Mac, doar când aplicația are `I.tastaWindows`, pus de `windows.js:393`). MĂRUNT: codul cere și „fără Alt”, textul spune doar „fără Ctrl”.
- **§4, scurtăturile oprite și în câmpuri**: `aplicatii.js:415-426` (`inCamp ? cuMod && !deEditare : cuMod || Tab`). MĂRUNT: Ctrl+Shift+Backspace / Delete NU rămân ale câmpului (codul le oprește, sunt ale browserului), deși textul spune „simple sau cu Ctrl/Shift”.
- **§6.3, `mutare_focus`**: `aplicatii.js:553` (Tab care doar mută focusul emite `mutare_focus`), `:663-672` (nu face pasul, nu e greșeală, un pas cu `asteapta` hotărăște singur).
Cele două nuanțe MĂRUNTE nu le-am schimbat: cererea era să aplic textul exact.
**Efectul pe oracole:** O7 (text UI) 341 → 341 și O9 (asistare) 13 → 13 în măsurarea finală, care citește api-ul cu textul nou. Măsurarea ciclului C a citit versiunea înghețată (fără rândurile astea; prima ei încercare, cu lacătul rupt de acest fișier, a fost refuzată: `runde/26/masurare_lacat_rupt.json` n-are valori). Măsurarea mea citește textul nou și dă aceleași numere, deci cele 16 rânduri nu mișcă O7 / O9: descriu comportamente pe care codul le avea deja la măsurarea ciclului C.

## 8. Ce a rămas [NEVERIFICAT] și starea mașinii
- [NEVERIFICAT] cele din §4.5 nejucate; meniul Pictures ▾ NU e pus ca suprafață în `uia_word.json` (runda a cerut doar pașii scenariului), deci O3 nu vede eticheta.
- `ruleaza_real.py verifica`: 28 → 30. Cele 2 noi sunt „proba canalului `taste_in_mesaj` n-a trecut în probe_mod.md”: canalul e probat în jurnalul generatorului (`excel_jurnal_0556.json` › `probe`), nu în `probe_mod.md` (pe acela îl scrie doar `ruleaza_real.py`). La fel stau `taste_alt` și `taste_ctrl_sageti` din rundele 7 și 14.
- **Office**: înainte de fiecare pornire, `tasklist` (în jurnale: „1 procese, nu le ating”). Cele 6 sesiuni (Word 91 s și 89 s; Excel 304, 298, 386, 313 s) și-au închis singure instanța (`Quit`, cod 0). WINWORD 28392, EXCEL 11152 și POWERPNT 19528 ale omului: aceleași PID-uri înainte și după, neatinse. PowerPoint nu s-a pornit. În două jurnale Excel `pid_meu_ramas` e `true` chiar după `Quit`; `tasklist`-ul de imediat după arăta doar PID-ul omului (procesul meu ieșea).
- **Clipboard**: gol la pornire și gol la final (`stare_masina_inainte/dupa.json`: „gol sau doar text” = da); folosit doar în cele două scenarii Word, golit înainte, pus la loc după.
- **Recent / %TEMP%**: nimic salvat; Word MRU 1 → 1, Resiliency 0 → 0, fișiere `lh_r26_*` 0 → 0.
- **Lacătul la final**: `ingheata.py --verifica` = 0 (după măsurare și după punerea la loc a fișierelor ciclului C).
- **Ce rămâne pentru runda Word următoare** (deblocatori cu referință și oracol): rândul „This Device...” în `word.js:1664` (eticheta reală) și spațierea inteligentă la Ctrl+V (`word-copiere-lipire`). Cele 13 unități rămase sunt scenarii pe care nimeni nu le poate juca invizibil, puse la Vasile (R26O-1…4).

ACOPERIRE_GATA
