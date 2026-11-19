# Runda 7 · constructorul 3 · pasul 7: creșterea porții controale_taiate (0 → 1) — NU e regres, codul rămâne

- `masurare_dupa_cont2.log` (07:20:38 → ~08:12, față de `masurare_pornire_cont2.json`): toate O1-O9 neschimbate
  (61 / 13392 / 20337 / 43 / 113 / 0 / 353 / 102 / 34), lacătul ok, neconcludente 0; porțile: `controale_taiate` 0 → 1, suma 34476 → 34477.
- Ce e acel 1 (`iesiri/porti/controale_taiate.json`): `defecte: []`, `erori: ["zoom125 | vi/m2-l14 N1A [mesaj] | Page.click: Timeout 8000ms exceeded."]`
  — o EROARE DE MĂSURARE (clic care a depășit 8 s, în timpul măsurării cu `--paralel 3`), nu un control tăiat.
- Pagina `lectii/vi/m2-l14/index.html` nu încarcă biblioteca: `grep -c aplicatii` = 0 (nici `excel.js`, nici `aplicatii.css`),
  deci schimbările mele n-o pot atinge.
- Re-rulat pe worktree, cu codul meu, după măsurare:
  - `oracol_controale_taiate.py --lectii vi/m2-l14` → defecte 0, erori 0 (`c3_controale_taiate_vi_m2-l14.log`, 21 s);
  - `oracol_controale_taiate.py` pe TOATE lecțiile → defecte 0, erori 0, total 0 (`c3_controale_taiate_toate.json/.log`, 08:13-08:36).
- Hotărârea: nu m-am întors la copia `c3safe` (ar fi șters X10 Sort, X8, X3, X4 pentru o eroare de măsurare dovedit străină).
  Dacă orchestratorul vrea regula literal: copia de dinainte e în `%TEMP%/…/scratchpad/c3safe/aplicatii/` (`excel.js`, `aplicatii.css`).
