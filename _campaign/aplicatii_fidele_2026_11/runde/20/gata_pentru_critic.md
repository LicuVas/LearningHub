# Runda 20 (Word, B-word#2, unghiul stare_finala_erori) — gata pentru criticul rece

- Ținta: GRAV K1 din `runde/16/critic.md:65-94` (Tab în ferestrele Save As / Open / „Save this file” / „Save your changes…”;
  drumul PDF din m1-l03 `:192`, `:195`, `:269` cu Tab) + drumurile cu fișiere pe unghiul stare_finala_erori + MINOR-urile ieftine din critic 16.
- Fișierul schimbat: **doar `aplicatii/word.js`** (diff față de `runde/20/inainte/word.js`: hunk-urile de la `word.js:1922-1966`,
  `2001-2014`, `2122-2124`). Fișiere comune atinse de banda Word: **niciunul**. Schimbările din `aplicatii.js`, `excel.js`,
  `explorer.js`, `windows.js`, `date/windows.json`, `_unelte/genereaza_windows.py` din `git diff` sunt ale benzilor r19 / r21 / r22.
- Proba: `runde/20/proba_grav.py` — înainte 20 picate (`proba_grav_inainte.log` + `proba_grav_inainte_M1.log`), după 3
  (`proba_grav_dupa.log`; toate 3 în asistentul comun `aplicatii.js:628`, nu în Word).
- Regresul Word: `regres_rezumat.txt` (16→0, 5→1 ca în runda 16, 4→0, telefon→0, 3→0, 2→0, O4 word 13 cu aceleași rânduri ca la
  pornire, O8 102).
- De lămurit cu Word real: `de_verificat.md › RUNDA20-WORD` (R20-1 ordinea Tab, R20-2 Tab cu lista deschisă, R20-3 Esc = Cancel în
  ferestrele Office, R20-4 Enter / Space pe butonul cu focusul).
- NEFĂCUT: lista „Vizualizare elemente” ca oprire Tab (cere schimbarea cârligului comun); fereastra mică; R16-1…R16-5.
- Detaliile: `raport_constructor.md`; cadrul / ținta / contra / diferențele: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md`
  (diferente.md NU se dă criticului, cf. `prompt.md` pasul 8).

GATA_PENTRU_CRITIC
