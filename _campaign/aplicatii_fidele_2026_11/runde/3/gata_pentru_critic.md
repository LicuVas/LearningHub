# Runda 3 · etapa B · Word — pentru criticul rece (doar unde e ce)

- Worktree: `C:/00/Projects/LearningHub_fidel`, ramura `fidelitate-aplicatii`; schimbările rundei sunt NECOMISE:
  `git -C C:/00/Projects/LearningHub_fidel diff -- aplicatii` (fișierele: `aplicatii/word.js`, `aplicatii/aplicatii.js`).
- Poligonul: `aplicatii/poligon.html`, servit static din worktree pe `127.0.0.1` (port liber); `?aplicatie=word` deschide
  Word singur. Din consolă: `await LH.aplicatii.deschide('word', {continut: {paragrafe: [...], selectie: {de_la, pana_la}},
  focus: true})`, starea cu `LH.aplicatii.stare('word')`, evenimentele în `window.__lhAplicatieEv`.
- Probele în browser: rută care abandonează tot ce nu e `127.0.0.1` / `localhost` (regula 24).
- Referințele (înghețate): `_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json` (`suprafete.bara_titlu`,
  `dialog.FileSaveAs`, `backstage.Open`, `panglica.TabHome`), `referinte/scenarii_real/word-*.json`.
- Lecțiile atinse de ținte (neschimbate): `lectii/vii/m1-l03/index.html` (salvare, Ctrl+S, F12, PDF, Ctrl+W, Ctrl+O),
  `lectii/vii/m2-l10/index.html` (caseta Font Size, r. 152, 238).
- Contractul: `_campaign/aplicatii_fidele_2026_11/contract.md`, `api_biblioteca.md` (§4 evenimente, §5 stare, §6.3 asistent).
- Proba constructorului (gesturi reale, CDP pentru tastatura care compune): `runde/3/proba_grav.py`; ieșirile
  `runde/3/proba_grav_inainte.json` / `proba_grav_dupa.json`.
