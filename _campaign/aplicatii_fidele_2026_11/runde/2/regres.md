# Runda 2 · regres la pasul 7

## porti.date_personale 0 → 1 (măsurarea întreagă, `masurare_dupa.log`)
- **Ce a prins poarta** (`iesiri/porti/porti_date_personale.log`): `runde/2/raport_constructor.md: 2 × ['%USERPROFILE%', '<utilizator>']`
  — calea absolută a unei capturi din dosarul temporar al sesiunii (conține numele utilizatorului Windows), scrisă de mine
  în raport. NU vine din bibliotecă (`aplicatii/`).
- **De ce n-am dat înapoi reparația** (`git restore` pe `aplicatii/`): cauza e o notă a rundei, nu codul; restaurarea
  bibliotecii n-ar fi schimbat numărul.
- **Reparat:** calea scoasă din raport; captura copiată în `runde/2/salvare_noua.png` și citată relativ. Poarta reluată
  singură (`oracole/porti.py --doar date_personale`, ieșirea în `runde/2/poarta_date_personale_dupa.log`) → **0**.
- **Efect secundar al reluării, reparat:** `porti.py` rulat direct își scrie rezumatul în `oracole/porti.json` (fișier
  urmărit de git, NEînghețat — `ingheata.py --verifica` → 0, INTACT); l-am readus cu
  `git -C C:/00/Projects/LearningHub_fidel restore _campaign/aplicatii_fidele_2026_11/oracole/porti.json`.
- Măsurarea întreagă NU a fost reluată după reparație (~35 min); orchestratorul re-măsoară oricum la pasul 9c. Toate
  celelalte n-uri: egale cu pornirea (O1-O9, test_joc, controale_taiate, cum_fac, fereastra_mica, word2007_j2).
