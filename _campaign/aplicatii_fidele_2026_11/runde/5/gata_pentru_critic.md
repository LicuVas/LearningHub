# Runda 5 · Word · pentru criticul rece (doar unde e ce)

- Diff-ul rundei: `git -C C:/00/Projects/LearningHub_fidel diff -- aplicatii/` (doar `aplicatii/word.js` și `aplicatii/aplicatii.css`).
- Poligonul: servește worktree-ul `C:/00/Projects/LearningHub_fidel` pe 127.0.0.1 (port liber) și deschide
  `/aplicatii/poligon.html`; apoi `await LH.aplicatii.deschide('word', {continut, profil, focus: true})`.
- Parametrii de CONȚINUT folosiți de drumurile lecției `lectii/vii/m1-l03`: `paragrafe`, `selectie`, `nume`, `folder`
  (implicit „Documente”), `salvat`, `modificat`, `fisiere: [{nume, folder?, text: [...]}]` (ex. `folder: 'Descărcări'`),
  `recente`. `stare()` are `fisiere`, `folder_fisier`, `documente_deschise`, `titlu_fereastra`, `fisiere_salvate` etc.
- Ferestrele desenate din referință: `uia_word.json › dialog.open` (Ctrl+F12; File › Open › Browse), `dialog.FileSaveAs_pdf`
  (F12 › Save as type › PDF). Ținte noi: `lista:<nume.ext>` (rândurile ferestrei Open), `arbore:<folder>` (panoul stâng).
- Referințele: `_campaign/aplicatii_fidele_2026_11/referinte/` (`uia_word.json`, `scenarii_real/word-*.json`,
  `acoperire_word_r3.py`, `surse_microsoft.md`); contractul: `contract.md`, `api_biblioteca.md`.
- Lecțiile: `lectii/vii/m1-l03/index.html` (:82-86, :116, :157-172, :189-192, :207, :240-245, :262-290), `lectii/vii/m2-l10`.
