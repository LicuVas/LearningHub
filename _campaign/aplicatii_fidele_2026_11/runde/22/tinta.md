# Runda 22 — ținta

## Cine a ales-o
- Orchestratorul, în `runde/supliment_B_windows_runda22.md`: GRAV-urile criticului rundei trecute au întâietate (prompt, pasul 3).
- Ordinea: **W1, W4, W3, W2, W5** (`runde/18/critic.md` §3), apoi MINOR-urile cât ajunge contextul.

## Numerele care au ales-o
- Pornirea comună (`masurare_pornire.json`): O3 28919, O4 28, O5 35, O8 102, O9 13; porți 41.
  - Pe Windows: O5 = 3 gesturi fără eveniment (`runde/18/iesiri/O5/oracol_evenimente.json › pe_aplicatie.windows`).
  - O3 / O4 / O8 nu se mișcă pe Windows în runda asta: nicio lecție din inventar nu încarcă biblioteca Windows (etapa C), iar Windows n-are scenarii în `scenarii/`.
- Proba de pornire, pasul zero (`probe_iesiri/proba_grav_pornire.json`): **35 din 48 de verificări pică**.
  - Pe GRAV-uri: W1 7/12, W4 2/3, W3 8/9, W2 8/8, W5 10/14 (picate / verificări).
  - Toate cele 5 GRAV se reproduc pe codul de azi (HEAD c29b583a).
- Câte lecții ating drumurile:
  - W1: 6 (v/m3-l18, m3-l19, m3-l21, vi/m1-l03, vi/m2-l11, vi/m3-l16);
  - W4: 10 („dosarul galben”);
  - W3: v/m2-l08;
  - W2: v/m2-l08, vii/m1-l03;
  - W5: v/m2-l08 (și contractul I1, pentru toate).
  Numerele vin din critic.

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/windows.js`
- `aplicatii/_unelte/genereaza_windows.py`
- `aplicatii/date/windows.json` (regenerat, nu scris de mână)
- `D/runde/22/*`
- blocurile `<!-- RUNDA22-WINDOWS:START/END -->` din `D/de_verificat.md` și `D/de_aprobat.md`

## Ce NU ating
- **Fișierele comune** (`aplicatii.js`, `poligon.html`, `setari.json` …): niciuna nu trebuie atinsă pentru W1-W5.
  - `aplicatii.js:229` e al benzii r19.
- **`explorer.js`**: e al benzii r19. W4 are nevoie de montare → cererea `A22-…` în `de_aprobat.md`.
- **Lecțiile și zona înghețată.**
