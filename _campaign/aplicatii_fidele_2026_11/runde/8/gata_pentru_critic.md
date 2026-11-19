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

## Constructorul 2 (după d0ab48fd)
- Codul: doar `aplicatii/excel.js` (diff față de constructorul 1: `git -C C:/00/Projects/LearningHub_fidel diff -- aplicatii/excel.js`;
  diff-ul întregii runde: `git -C C:/00/Projects/LearningHub_fidel diff 4b53a65a -- aplicatii/`).
- GRAV atinse: **X8** (Save this file, Save your changes; Ctrl+S, Acces rapid › Save, Ctrl+W, File › Close) și **K6** (KeyTips,
  Alt+=, Ctrl+Shift+%). NEatins: **X10** (graficele).
- Referințele lor: `referinte/uia_excel.json › suprafete.dialog.save_this_file`, `suprafete.dialog.save_your_changes_to_this_file`,
  `acoperire_r7.fapte.a_ctrl_s_registru_nou`, `acoperire_r7.fapte.b_ctrl_w_modificat`, `panglica.TabHome` (Sum „Alt+=”, Percent
  Style, `ta` „Alt, H, …”), `file_panglicii` (`ta` „Alt, H” …), `lista.AutoSum` (`ta` „Alt, H, U, …”);
  `referinte/scenarii_real/excel-ctrl-w-modificat.json`, `excel-alt-egal.json`.
- Proba: `runde/8/proba_grav.py --doar X8,K6` (gesturi reale, headless, doar 127.0.0.1); în `x8` două verificări rescrise după
  referință (`diferente.md` D16, D17 — de judecat).
- Lecția atinsă de X8: `lectii/viii/m1-l03` (salvarea, Ctrl+W); de K6: `lectii/viii/m2-l08` (Σ, Alt+=).
- Răspunsul la întrebarea O3 (oracolul nu randează nicio pagină cu biblioteca): `stare_autor.md` › „Întrebarea O3”.

