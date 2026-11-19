# Runda 10 · B-excel · pentru critic: unde e ce

- Codul: doar `aplicatii/excel.js`. Diff-ul rundei: `git -C C:/00/Projects/LearningHub_fidel diff 5d542c04 -- aplicatii/`.
- Poligonul: un server static pe 127.0.0.1 (port liber) care servește worktree-ul, apoi `/aplicatii/poligon.html?aplicatie=excel`,
  sau `LH.aplicatii.deschide('excel', {loc: document.querySelector('[data-lh-aplicatie-loc]'), continut: {celule: {...}, selectie: 'A1'}, focus: true})`.
  Starea: `LH.aplicatii.stare('excel')`; evenimentele: `window.__lhAplicatieEv`. Serverul, ruta (abandonează tot ce nu e
  127.0.0.1) și clasa `S`: `runde/7/proba_grav.py`.
- GRAV atinse: **A1** (locul graficului nou), **A2** (rezumatul selecției în bara de stare), **E5** (vărsarea). Plus MINOR-urile
  criticului 9: ținta tastelor cu graficul ales, Esc în Sort pe Then by, axa valorilor. **X10** n-a fost atins (cere o rundă `acoperire`).
- Unde e în `excel.js`:
  - A1: `insereazaGrafic` (caută `com_r10_b.json`), `kg()` lângă `const z =`, `desenGrafic` (left/top cu `z()`, mărimea cu
    `kg()`), `mutaGrafic`;
  - A2: `rezumatSelectie` (caută `bara_stare#selectie_numere`), chemat din `actualizeazaBare`;
  - E5: `opMat`, `liber`, `ancore`, `varsat`, `toateVarsate` (caută `E5, vărsarea`), `valoare`, `evalua` (`neg` / `pct` / `op`),
    `I.stare` (celulele vărsate), `deseneazaGrila` (`f.cel[a] || varsat`);
  - MINOR: `tastaGrafic` (înveliș care pune `I.tintaTasta`), `deseneazaNiveluri` (`'camp:' + et`), `scaraGrafic`.
- Referințele:
  - A1: `runde/9/critic_probe/com_r9.json › carti`; noi, tot Excel real invizibil (DispatchEx, același build 16.0 20326):
    `runde/10/probe/com_r10_b.json` (7 mărimi ale aplicației) și `com_r10_c.json` (3 ferestre mai joase decât graficul), cu
    scriptul `probe/com_r10.py`; `com_r10_a.json` = prima încercare (redimensionarea ferestrei registrului e refuzată invizibil);
  - A2: `referinte/uia_excel.json › suprafete › bara_stare#selectie_numere` și `bara_stare`;
  - E5: `runde/8/critic_probe/com_r8.json` (`2_D2_D7_text`, `2_D2_spill`, `2_D3_formula2`);
  - §4 `api_biblioteca.md` („la taste: ținta focusului”); axa: `com_r9.json › carti.axa`, `carti_b4_20_axa`, `luni.axa`.
- Proba constructorului: `runde/10/proba_grav.py` (A1, A2, E5, M1, M2, M3), cu `--doar`.
- Mărimile ecranului din contract (I1): 1366×768, fereastra mică 1093×526 (= 1366×657 la 125 %), telefonul 375×667 cu atingeri.
