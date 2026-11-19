# Runda 10 · B-excel · starea constructorului 1

Pornirea: `runde/10/masurare_pornire.json` (O1 61, O2 13392, O3 21586, O4 50, O5 113, O6 0, O7 343, O8 102, O9 34; porți 41).
Proba: `runde/10/proba_grav.py` (A1, A2, E5, M1, M2, M3). Înainte (cod neatins): `proba_grav_inainte.json` = 19 picate
(M2 picase și din cauza unei greșeli de probă, reparată); M2 + M3 pe copia HEAD: `proba_grav_inainte_m2m3.json` = 4 picate.
Fișiere atinse sub `aplicatii/`: doar `aplicatii/excel.js`. Copia de siguranță = HEAD `5d542c04` (`git restore aplicatii/excel.js`).
Note scrise: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md` (D-A1-1…D-M-3), `de_verificat.md` (R10-1…R10-4), `probe/com_r10*.{py,json}`.

## Gata și probat (toate cu drum numai din tastatură)
- **A1 — locul graficului nou** (`insereazaGrafic` ~`:2632`, `kg()` `:925`, `desenGrafic`, `mutaGrafic`): formula Excel din COM
  (`probe/com_r10_b.json`, `com_r10_c.json`, 9 ferestre; left = (U − 360)/2 − 10,2 pt, top = (V − 216)/2 − 7,2 pt, min 0,
  360 × 216 fix), aplicată pe zona vizibilă a grilei + derulare. 1366×768 → G5 (NU H11: D-A1-1); fereastra mică → lipit sus,
  tăiat jos ca Excel (D-A1-2); telefon → lipit stânga-sus, 480 × 288 la zoomul registrului (D-A1-3). Proba A1: 11/11.
- **A2 — rezumatul selecției** (`rezumatSelectie` `:837`, din `actualizeazaBare`): Average / Count / Sum la locurile din
  `bara_stare#selectie_numere`, Display Settings ascuns; cazurile fără referință = R10-2. Proba A2: 7/7.
- **E5 — vărsarea** (`opMat` `:347`, `liber`, `ancore`, `varsat` `:371`, `toateVarsate`; `valoare` `:305`; ecranul `:1023`;
  starea `:551`): D2:D6 = 432…288, D3 fără formulă, recalcul, Ctrl+Z, tastatura (Enter = Yes) și mouse. Proba E5: 8/8.
- **M1** ținta tastelor cu graficul ales (`tastaGrafic` = înveliș, `I.tintaTasta`): 2/2. **M2** Then by → `camp:Then by`
  (`:1731`): 2/2. **M3** axa valorilor (`scaraGrafic` `:2504`, regula potrivită pe com_r9): 2/2.
- Pe drum: `runde/9/proba_grav.py --doar X10` = 0; `--doar K1,E2` = 0.

## Încheiat (constructorul 1 termină runda)
- Proba `proba_grav_dupa.json`: 0 picate. Regres `regres_c1_rezumat.txt`: Excel 9/0, 8/0, 7cont/0, 6/0, 7/2, 7cont2/3 (aceleași
  rânduri ca în runda 9); Word 0. Parțial: O4 51 = Failed to fetch pe word-ctrl-z-abc, reluat = 50.
- Pasul 7 (`masurare_pas7.*`): toate = pornirea; O6 NECONCLUDENT pe timp → reluat singur (`masurare_o6.*`) = 0.
  `masurare.json` = `masurare_pas7.json`. `ingheata.py --verifica` = 0. Rapoarte: `raport_constructor.md`, `gata_pentru_critic.md`.
- NEFĂCUT din punctul 4: Quick Styles, ▾ după „More Column Charts...”. Urmează pasul 8 (criticul), la orchestrator.
