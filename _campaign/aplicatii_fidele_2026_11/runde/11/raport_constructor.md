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
