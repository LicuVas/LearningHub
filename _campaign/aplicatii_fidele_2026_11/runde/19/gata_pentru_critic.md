# Runda 19 · B-explorer · unghiul gest_tastatura · pentru criticul rece

## Ce s-a schimbat (diff-ul rundei: `runde/19/diff_runda19.patch` = `git diff -- aplicatii/aplicatii.js aplicatii/explorer.js`)
- `aplicatii/aplicatii.js` (COMUN), doar funcția `nesimulat` (rândurile 220-249): mesajul central rămâne sub rădăcină și e pus
  înapoi după o redesenare a rădăcinii, cât trăiește (GRAV E1 al criticului 15).
- `aplicatii/explorer.js`: caseta de redenumire pe telefon (GRAV E2: rândurile 405, 420-431, 646-648, 675-676, 709-711);
  Alt+Enter și Ctrl+Shift+C (rândurile 853-857).
- În aceeași ramură lucrează în paralel benzile Word (r20), Excel (r21), Windows (r22): `word.js`, `excel.js`, `windows.js`,
  `date/windows.json`, `_unelte/genereaza_windows.py` NU sunt ale rundei 19.

## Unde e ce
- Aplicația: `aplicatii/explorer.js`; pagina de probă: `aplicatii/poligon.html?aplicatie=explorer` (folderul „Clasa a V-a”,
  folderul alăturat „Teme”, Coșul pe desktop).
- Referințele: `referinte/uia_explorer.json` (scurtăturile: `explorer_fereastra` › Înapoi / Înainte / Până la … / Reîmprospătare;
  `explorer_meniu_fisier` › Deschideți Enter, Copiere ca o cale Ctrl+Shift+C, Proprietăți Alt+Enter, Decupare Ctrl+X, Copiere
  Ctrl+C, Redenumire F2, Ștergere del; `explorer_meniu_fundal` › Anulare Copiere Ctrl+Z, Proprietăți Alt+Enter;
  `observat_vizual.f2_pe_tema_docx`), `referinte/scenarii_real/explorer_*.json` (18), `contract.md` R12 / I1, `api_biblioteca.md` §3-§4.
- GRAV-urile de verificat: `runde/15/critic.md` › E1, E2 (cu proba lor: `runde/15/critic_probe/a4.py`, `a6.py`).
- Raportul constructorului: `runde/19/raport_constructor.md`; ce nu e în referință: `de_verificat.md` › R19-1 … R19-7.

## Cum se probează
- `python runde/19/proba_grav.py [e1|e2|tast|regres]` — gesturi reale (mouse, tastatură, `page.touchscreen`, CDP
  `Input.insertText`), headless, server pe 127.0.0.1 port liber, tot restul abandonat; ultima linie = verificări picate.
  `--radacina <copie>` probează altă copie a sitului (copia de dinainte: `aplicatii/` cu `runde/19/inainte/aplicatii.js` și
  `inainte/explorer.js` puse la loc).
- O4 pe Explorer: `LH_IESIRE=<dosar> python oracole/oracol_comportament.py --scenarii runde/15/lucru/scen`.
- Copiile de dinainte de runda 19: `runde/19/inainte/aplicatii.js` (= HEAD c29b583a), `runde/19/inainte/explorer.js`.

GATA_PENTRU_CRITIC
