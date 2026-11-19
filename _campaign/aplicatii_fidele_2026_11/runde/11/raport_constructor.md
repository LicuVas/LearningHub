# Runda 11 · raportul constructorului 1 (B-powerpoint) — PREDARE (pasul 7 complet NU e rulat)

## Numerele
Pornirea (`masurare_pornire.json`): O1 61 · O2 13392 · O3 21586 · O4 50 · O5 113 · O6 0 · O7 343 · O8 102 · O9 34 · porți 41.
Parțial după (`--doar O3,O4,O5,O8,O9`): vezi secțiunea „Măsurarea parțială” de la capăt.
Probe locale, doar PowerPoint (%TEMP%): O4 PowerPoint 18 → 4 (13/17 scenarii la fel ca realul); O5 PowerPoint 31 → 0 (31/31 gesturi cu
eveniment valid); O9 PowerPoint 8 → 1 (A, B, C, D, E, G, H ok; rămâne F = nicio lecție PowerPoint nu încarcă biblioteca — etapa C).

## FĂCUT (cu dovada)
- Generatorul + datele: `aplicatii/_unelte/genereaza_powerpoint.py` → `aplicatii/date/powerpoint.json` (`--verifica` = 0; Word și Excel `--verifica` = 0).
- `aplicatii/powerpoint.js`: fereastra din date (titlu + Acces rapid, file, panglici, bara de stare, Backstage, meniurile de clic dreapta,
  ferestrele, panourile), miniaturile, diapozitivul, casetele, tastarea/selecția/caretul, New Slide, Layout ▾, Ctrl+M/D/Z/Y, Delete,
  mutarea diapozitivelor și a casetelor, temele, tranzițiile + Apply To All, animațiile + Animation Pane, tabelul RxC, Save As / F12,
  F5 = expunerea, filele contextuale, mesajul central pe ce nu e simulat.
- Scenariile PowerPoint care trec acum (O4, probă locală): animatie-fly-in, aspect-title-only, bold-text, ctrl-m, ctrl-z-diapozitiv-nou,
  delete-diapozitiv, dublare-diapozitiv, mareste-font, tabel, tastare-titlu, tema-ion, tranzitie-aplica-la-toate, tranzitie-fade (13).
- `runde/11/proba_powerpoint.py`: 14 verificări cu gesturi reale pe poligon → 0 picate (rulat de 3 ori după reparația focusului;
  prima rulare a prins pierderea primei litere tastate imediat după clic — reparată în `powerpoint.js › I.la.jos`).
- Regresul (înainte de reparația focusului, care atinge doar `powerpoint.js`): Word 5/5 = 0 picate; Excel 5/5 = 0; runde/7/proba_grav = 2,
  runde/7/proba_grav_cont2 = 3 (căderile acceptate D14, D18). Json-urile scrise de probe în runde/7-10 mutate în %TEMP%.

## NEFĂCUT (cu deblocatorul)
- Pasul 7 complet (O1-O9 + porți, singur pe mașină) — îl rulează constructorul care termină runda.
- `powerpoint-diapozitiv-nou-buton`: rulatorul apasă partea ▾ a lui New Slide (R11-9) — decizia orchestratorului (scenariul sau proba pe real).
- `powerpoint-imagine`, `powerpoint-salvare-ca`: țintele scenariilor nu există pe ecranul referinței (R11-10) — rundă `acoperire` (lista
  Pictures ▾) / reparația scenariului; Pictures ▾ dă azi mesajul central.
- O9 F: o lecție PowerPoint pe bibliotecă — etapa C.
- Formatarea pe BUCĂȚI de text (Bold pe un cuvânt): azi se aplică întregii casete — bucata următoare.
- Ferestrele Font / Paragraph / Insert Table se deschid din referință, dar OK nu aplică nimic (se închid).

## NESIGUR
- R11-1 … R11-10 în `de_verificat.md` (aspectele și mărimile de font, codurile altor efecte, comenzile gri care devin active, mutarea
  casetei, galeria Animations care înlocuiește).
- Fel nou de țintă `margine_forma:D/S` (marginea casetei), folosit de `demonstratie.tragere` pentru O5 — nu e în lista api §3.

## Fișierele create / schimbate
Noi: `aplicatii/powerpoint.js`, `aplicatii/_unelte/genereaza_powerpoint.py`, `aplicatii/date/powerpoint.json`, `aplicatii/profiluri/powerpoint365.json`,
`runde/11/{cadru,tinta,contra,diferente,stare_autor,raport_constructor,gata_pentru_critic}.md`, `runde/11/proba_powerpoint.py` (+ `.json`).
Schimbate: `aplicatii/aplicatii.js` (SURSE_APP), `aplicatii/aplicatii.css` (secțiunea PowerPoint la capăt), `aplicatii/poligon.html` (P.powerpoint),
`de_verificat.md` (blocul RUNDA11-POWERPOINT).

## Măsurarea parțială (`masoara.py --runda 11 --doar O3,O4,O5,O8,O9 --compara masurare_pornire.json`, 632,9 s, după ultima scriere sub aplicatii/)
O3 21586 → **21586** · O4 50 → **33** · O5 113 → **82** · O8 102 → **102** · O9 34 → **27** · lacăt ok · neconcludente 0 ·
„regres față de pornire: niciunul”. Copia: `runde/11/masurare_partial_predare.json` (`masurare.json` = aceeași, PARȚIAL; pasul 7 o rescrie).
`ingheata.py --verifica` = 0.

---

# Constructorul 2 (continuă după 1b68edcc, în ordinea din `decizii_orchestrator.md`)

## Numerele
Pornirea (`masurare_pornire.json`): O1 61 · O2 13392 · O3 21586 · O4 50 · O5 113 · O6 0 · O7 343 · O8 102 · O9 34 · porți 41.
Parțial, după ultima mea scriere sub `aplicatii/` (636,7 s, singur): O3 21586 · O4 33 · O5 82 · O8 102 · O9 27 — aceleași ca la predarea
constructorului 1, regres: niciunul (copia `masurare_partial_c2.json`). O4 PowerPoint: tot 13/17 (cele 4 rămase = R11-9, R11-10 ×2,
`tragere-forma` fără rezultat real — deciziile orchestratorului 1-2: nu se schimbă comportamentul ca să treacă).
Pasul 7 complet: secțiunea „Pasul 7” de la capăt.

## FĂCUT (cu dovada; tot în `aplicatii/powerpoint.js`)
1. **Formatarea pe bucăți de text** (D18, D19): fiecare caracter are formatul lui, fiecare paragraf proprietățile lui. Bold / Italic /
   Underline / Increase / Decrease Font Size și Ctrl+B/I/U: caseta ca obiect = tot textul; text ales = doar bucata; cursor strâns în
   cuvânt = cuvântul; altfel doar formatul de scriere. Tastarea ia formatul vecinului; Ctrl+C/V păstrează formatul; Ctrl+Z revine.
   Pe ecran: un bloc pe paragraf, un `<span>` pe bucată (ecranul = starea). Panglica: Bold / Italic / Underline apăsate
   (`aria-pressed`), caseta Font Size = mărimea textului ales. Starea: `formatare_text` (ca citirea COM), plus
   `formatare_pe_caractere`, `paragrafe_text`, `modificat`. Dovada: `proba_powerpoint.py` (Bold pe 3 litere → doar ele aldine, în
   stare ȘI pe ecran; litera scrisă după ele e aldină; Ctrl+Z ×2 = pornirea; Ctrl+I cu cursorul în cuvânt = tot cuvântul).
2. **Caseta Font Size** din Home (D20): clic = textul ei ales, număr + Enter = mărimea pe textul ales, Esc renunță, focusul se întoarce
   în diapozitiv. Dovada: proba (40 + Enter → tot titlul 40, focusul în diapozitiv).
3. **Ferestrele** (D21-D24): Font (Size, Font style, Underline style arată starea; OK aplică Size schimbat; Esc / Cancel nimic),
   Paragraph (Alignment, Before text, Before, After, At arată starea; OK aplică pe paragrafele atinse), Insert Table (drum nou:
   Table ▾ › „Insert Table...”, 5×2 ca în referință, More / Less ±1, OK = tabelul pe diapozitiv). Enter într-un câmp = OK, cu
   `activat: fereastra:OK`. Dovada: proba (Font 28 + OK → 28; 10 + Esc → tot 28; Paragraph After 12 + Enter → 12 pt; Insert Table
   4 + More + OK → tabel 3 × 4 pe ecran și o formă în plus în stare).
4. **Salvarea** (D25): `modificat` (true după orice schimbare, false după Save / Save As); F12 pune focusul în File name imediat după
   gest — proba mea a prins că literele tastate imediat după F12 se pierdeau („Vulcanii” → „anii.pptx”); ținta evenimentului F12
   rămâne focusul de la tastă (verificat în probă).
5. `proba_powerpoint.py`: 35 de verificări (14 ale constructorului 1 + 21 noi), 0 picate, rulată de 3 ori.
6. Regresul, după ultima scriere: Word 5/5 = 0 picate; Excel 5/5 = 0; runde/7 proba_grav = 2 și proba_grav_cont2 = 3 (acceptate,
   D14, D18). Json-urile scrise de probe în runde/7-10 mutate în %TEMP%.

## NEFĂCUT (cu deblocatorul)
- **„Save your changes”** la File › Close / Ctrl+W (lecția m1-l03): fereastra NU e în `uia_powerpoint.json` → R11-13 (D26); File › Close
  rămâne cu mesajul central. Deblocator: o rundă `acoperire` cu scenariul `powerpoint-ctrl-w-modificat`.
- **Font Color** (lecțiile m1-l06, m2-l08, m2-l09): culoarea implicită și paleta ▾ necapturate → R11-12 (f), D27; mesajul central.
- Lista ▾ a casetei Font Size (lecția m1-l06: „Font Size ▾ → 32”): necapturată (R11-1); scrisul în casetă merge.
- Cele 4 scenarii O4 rămase (R11-9, R11-10, `tragere-forma`) — deciziile orchestratorului; O9 F = etapa C.

## NESIGUR
- R11-11: cursorul strâns în cuvânt → tot cuvântul (dovedit doar în Word); `formatare_text.marime` la mărimi amestecate; caseta
  Font Size la mărimi amestecate (goală; realul poate arăta „NN+”); limitele mărimii scrise (1-4000).
- R11-12: numele valorilor Bold / Italic / Bold Italic, Left / Right… din ferestre (referința dă doar Regular, (none), Centered);
  valorile de pornire ale paragrafelor în casetele care nu sunt titlul Title Slide; pasul More / Less (dat doar la Insert Table, ±1);
  limitele 1-75 ale tabelului; eticheta „Insert Table...” (comanda `TableInsert` e dovedită de lista Microsoft S11, eticheta nu).

## Fișierele constructorului 2
Schimbate: `aplicatii/powerpoint.js`, `_campaign/.../de_verificat.md` (R11-11 … R11-13), `runde/11/{diferente,stare_autor,raport_constructor,
gata_pentru_critic}.md`, `runde/11/proba_powerpoint.py` (+ `.json`). Noi: `runde/11/masurare_partial_c2.json`. Codul comun
(`aplicatii.js`, `aplicatii.css`, `panglica.js`, `stare.js`) NU l-am atins.

## Pasul 7 (complet, singur pe mașină, după ultima scriere sub `aplicatii/`; 23:11:47 → 23:44:50, 1982,8 s)
`masoara.py --runda 11 --paralel 3 --compara runde/11/masurare_pornire.json` → `runde/11/masurare.json`:

| | O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | porți |
|---|---|---|---|---|---|---|---|---|---|---|
| pornire | 61 | 13392 | 21586 | 50 | 113 | 0 | 343 | 102 | 34 | 41 |
| pasul 7 | 61 | 13392 | 21586 | **33** | **82** | 0 | 343 | 102 | **27** | 41 |

Porțile: test_joc 0, controale_taiate 0, cum_fac 41, fereastra_mica 0, date_personale 0, word2007_j2 0. Lacăt ok, neconcludente 0
(O6 a ieșit concludent în 1022 s — reluarea din supliment nu a fost nevoie). „Regres față de pornire: niciunul”. `ingheata.py --verifica` = 0.
Partea PowerPoint (`iesiri/O4/iesire.log`): 13/17 scenarii ok; rămase `diapozitiv-nou-buton` (R11-9), `imagine` și `salvare-ca` (R11-10),
`tragere-forma` (fără rezultat real).
