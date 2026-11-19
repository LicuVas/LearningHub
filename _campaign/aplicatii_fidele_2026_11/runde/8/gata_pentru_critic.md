# Runda 8 · B-excel · pentru critic: unde e ce

- Codul: `aplicatii/excel.js`, `aplicatii/aplicatii.js` (doar cârligul `I.tintaTasta` din ascultătorul `keydown`),
  `aplicatii/aplicatii.css` (regulile Borders vechi primesc `:not(.lh-ap-x-ref)`, 3 reguli noi la capăt),
  `aplicatii/date/excel.json` (regenerat cu `aplicatii/_unelte/genereaza_excel.py`; `--verifica` = 0).
  Diff-ul: `git -C C:/00/Projects/LearningHub_fidel diff` (față de `4b53a65a`).
- Poligonul: un server static pe 127.0.0.1 (port liber) care servește worktree-ul, apoi
  `/aplicatii/poligon.html?aplicatie=excel`, sau `LH.aplicatii.deschide('excel', {loc: document.querySelector('[data-lh-aplicatie-loc]'),
  continut: {celule: {...}, selectie: 'A1'}, focus: true})`. Starea: `LH.aplicatii.stare('excel')`; evenimentele:
  `window.__lhAplicatieEv`. Serverul + ruta (abandonează tot ce nu e 127.0.0.1) sunt în `runde/7/proba_grav.py` (`server`, `ruta`, clasa `S`).
- Referințele: `referinte/uia_excel.json` (`meniu_contextual.*`, `lista.AutoSum`, `lista.Borders`, `dialog.eroare_formula*`,
  `dialog.SortDialog*`, `dialog.SortWarning`, `dialog.ColumnWidth`, `dialog.FileSaveAs`, `acoperire_r7.fapte`) și
  `referinte/scenarii_real/excel-point-*`, `excel-av-tab`, `excel-aver-tab`, `excel-separator-virgula`, `excel-autocompletare-tab`.
- GRAV atinse în runda asta: K3, K5, K4, X5, K2, K1. NEatinse: X8, K6, X10 (graficele).
- Lecțiile care folosesc suprafețele: m2-l08 (Σ, lista ▾, AVEDEV, formule), m2-l10 (Sort), m1-l03 (salvare, nu atinsă).
