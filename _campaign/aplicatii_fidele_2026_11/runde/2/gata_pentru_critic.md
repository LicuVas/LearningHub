# Runda 2 · gata pentru criticul rece (pentru orchestrator — pașii 8-9 sunt ai lui)

## Unde e ce
- Biblioteca: `C:/00/Projects/LearningHub_fidel/aplicatii/` — runda 2 a schimbat DOAR `aplicatii.js`, `word.js`,
  `aplicatii.css` (diff: `git -C C:/00/Projects/LearningHub_fidel diff -- aplicatii/`).
  - `aplicatii.js` › `leagaGesturi`: calea `input` a documentului (compunerea de pe telefon), `I.activeazaTasta` /
    `I.tastaFaraClic` (tastele de acces, fără clic sintetic); asistentul (`NAVIGARE_TA`).
  - `word.js`: `cuSalvareNoua` (fereastra „Save this file”), `focusStrat` (Backstage / dialog iau tastatura),
    `marimeScrisa` (caseta Font Size), `I.la.text` / `I.la.sterge`, tastele de acces pe N niveluri (`kt.cale`, `ktTinte`, `ktLitera`).
- Referințele: `_campaign/aplicatii_fidele_2026_11/referinte/uia_word.json`, `referinte/scenarii_real/word-*.json`,
  `referinte/surse_microsoft.md`, `api_biblioteca.md`, `contract.md`. Paginile Microsoft folosite au URL-ul în comentariul
  codului de lângă reparație (`word.js`, căutați „support.microsoft.com”).
- Lecțiile pe drumul cărora stau reparațiile (text, neatinse): `lectii/vii/m1-l03/index.html:143` (Ctrl+S → „Save this
  file”), `lectii/vii/m2-l10/index.html:152, 238` (Font Size „alege 20 / 16”).

## Cum se deschide poligonul
Server static local pe worktree, legat de 127.0.0.1, port liber; apoi
`http://127.0.0.1:<port>/aplicatii/poligon.html?aplicatie=word` (`&profil=word2007` pentru laboratorul VII). Din consolă:
`LH.aplicatii.deschide('word', {continut: {paragrafe: ['Ana are mere'], selectie: {de_la: 4, pana_la: 7}}, focus: true})`,
`LH.aplicatii.stare('word')`, `window.__lhAplicatieEv`, `LH.aplicatii.asistent('word', {pasi: [...], dupaGreseli: 2})`.
Proba constructorului (gesturi reale, Playwright headless, doar 127.0.0.1):
`python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/runde/2/proba_grav.py` (ultima linie = cazuri picate).
