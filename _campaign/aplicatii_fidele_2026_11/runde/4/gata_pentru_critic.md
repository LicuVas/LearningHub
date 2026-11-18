# Runda 4 · etapa B · Word — pentru criticul rece (doar unde e ce)

- Worktree: `C:/00/Projects/LearningHub_fidel`, ramura `fidelitate-aplicatii`; schimbările rundei sunt NECOMISE:
  `git -C C:/00/Projects/LearningHub_fidel diff -- aplicatii` (fișierele: `aplicatii/word.js`, `aplicatii/panglica.js`,
  `aplicatii/aplicatii.css`, `aplicatii/date/word.json` — acesta REGENERAT cu `aplicatii/_unelte/genereaza_word.py`
  din referința înghețată; `genereaza_word.py --verifica` = 0).
- Cum s-au aplicat: `runde/4/repara_r4.py <dosarul aplicatii>` (înlocuiri exacte), bucățile de cod în `runde/4/piese_r4/`.
- Poligonul: `aplicatii/poligon.html`, servit static din worktree pe `127.0.0.1` (port liber). Din consolă:
  `await LH.aplicatii.deschide('word', {continut: {...}, profil, focus: true})`, starea cu `LH.aplicatii.stare('word')`,
  evenimentele în `window.__lhAplicatieEv`, țintele vizibile cu `LH.aplicatii.tinte('word')`.
  Conținutul nou (parametri de CONȚINUT, nu interfață): `{paragrafe, cursor|selectie, nume, folder, salvat, modificat,
  fisiere: [{nume, folder?, text: [...]}], recente: [{nume, folder?}]}`.
- Probele în browser: rută care abandonează tot ce nu e `127.0.0.1` / `localhost` (regula 24).
- Referințele (înghețate): `_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json` (`suprafete.lista.FontSize`,
  `lista.FileSaveAs_tip`, `lista.FileSaveAs_navigare`, `dialog.FileSaveAs`, `dialog.save_this_file`,
  `dialog.save_your_changes_to_this_file`, `backstage.Open`, `backstage.Open_rand_recent`, `bara_titlu`, blocul
  `acoperire_r3.fapte`), `referinte/scenarii_real/word-*.json` (mai ales `word-font-size-lista`, `word-salvare-pdf`,
  `word-ctrl-w-nesalvat`, `word-ctrl-w-nu-salva`, `word-x-nesalvat-cancel`, `word-ctrl-s-document-nou`, `word-ctrl-o`),
  `referinte/ruleaza_real.py` (cursorul implicit).
- Lecțiile atinse de ținte (neschimbate): `lectii/vii/m1-l03/index.html` (salvare, Ctrl+S, F12, PDF, Ctrl+W, ✕, Ctrl+O,
  Recent), `lectii/vii/m2-l10/index.html` (caseta Font Size, r. 152, 238, 242).
- Contractul: `_campaign/aplicatii_fidele_2026_11/contract.md`, `api_biblioteca.md` (§3 ținte, §4 evenimente, §5 stare,
  §6.3 asistent).
- Proba constructorului (gesturi reale: `page.keyboard`, `page.mouse`): `runde/4/proba_grav.py`; ieșirile
  `runde/4/proba_grav_inainte.json` / `proba_grav_dupa.json`; regres: `runde/3/proba_grav.py`, `runde/2/proba_grav.py`.
