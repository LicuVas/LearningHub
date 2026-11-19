# Runda 8 · pasul 7: creșterea porților test_joc (0 → 2) și controale_taiate (0 → 2)

- `masurare_dupa.log` (12:24:57 → ~13:49, `--paralel 3`, singură pe mașină, față de `masurare_pornire.json`):
  O1 61, O2 13392, O3 21586, **O4 69 → 56**, O5 113, O6 0, O7 343, O8 102, O9 34; lacăt ok; neconcludente 0;
  porți: test_joc 0 → 2, controale_taiate 0 → 2, cum_fac 41, restul 0; suma 35741 → 35732.
- Ce sunt cele 4 (`iesiri/porti/porti_test_joc.log`, `porti_controale_taiate.log`):
  - test_joc: `[PICAT] recapitulare-v … FAIL poarta s-a oprit: Page.click: Timeout 6000ms exceeded.` și
    `[PICAT] recapitulare-vi … FAIL poarta s-a oprit: BrowserType.launch: Timeout 180000ms exceeded.` — browserul nici n-a pornit;
  - controale_taiate: `[EROARE] telefon | vii/m2-l09 N1P3E1 [wordhartie] | Page.click: Timeout 8000ms exceeded.` și
    `… N1P5E2 [wordpag] | Page.click: Timeout 8000ms exceeded.` — erori de măsurare (clic expirat), nu controale tăiate.
- Paginile NU încarcă biblioteca: `grep -c 'aplicatii/'` = 0 în `jocuri/recapitulare-v/index.html`,
  `jocuri/recapitulare-vi/index.html`, `lectii/vii/m2-l09/index.html`. Schimbările mele (`aplicatii/excel.js`, `aplicatii.js`,
  `aplicatii.css`, `date/excel.json`) nu le pot atinge. Același tipar ca în runda 7 (`runde/7/regres.md`: clic expirat sub `--paralel 3`).
- Re-rulare, singură pe mașină, pe worktree, cu codul meu: `oracole/porti.py --doar test_joc,controale_taiate` →
  **test_joc 0, controale_taiate 0** (`porti_reluate.log`, 13:49:58 → ~14:21: „porți: 2 · trecute 2 · picate 0 ·
  neconcludente 0”; test_joc „cod 0”, controale_taiate „ultima linie '0'”). `porti.py` rescrie `oracole/porti.json` (reper înghețat):
  l-am copiat în `runde/8/porti_reluate.json` și am pus la loc originalul (`git checkout`); `ingheata.py --verifica` = 0.
- Hotărârea: NU dau înapoi reparația — creșterea e o eroare de măsurare dovedit străină (pagini care nu încarcă `aplicatii/`,
  clic / pornire de browser expirate sub `--paralel 3`), iar re-rularea singură dă 0 pe ambele porți. Dacă orchestratorul vrea regula
  literal: `git restore aplicatii/excel.js aplicatii/aplicatii.js aplicatii/aplicatii.css aplicatii/date/excel.json`.
