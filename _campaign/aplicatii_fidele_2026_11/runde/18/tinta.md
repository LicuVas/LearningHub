# Runda 18 · pasul 3 · ȚINTA

Ținta e fixată de orchestrator (`runde/supliment_B_windows_runda18.md`): Windows 11 (desktopul cu bara de activități) în
bibliotecă. Nu există GRAV-uri ale unui critic Windows anterior (e prima rundă a valului B-windows).

## Numerele care au ales ordinea (pornirea: `runde/18/masurare_pornire.json` ← `runde/15/iesiri/O3/oracol_ui.json`)
| suprafața (`suprafete.json`) | cheia de randare | O3 (puncte) | O4 | O8 | lecții (`lista_pagini`) | (O3+O4+O8) × lecții |
|---|---|---|---|---|---|---|
| `windows.meniu_start` | `start` | 197 | 0 | 0 | 9 | **1773** |
| `windows.bara_activitati` + `windows.zona_notificare` | `bara_activitati` | 162 | 0 | 0 | 5 (+1) | **810** (972 cu zona) |
| `windows.meniu_clic_dreapta` | `meniu_desktop` + `meniu_desktop_clasic` | 71 + 106 | 0 | 0 | 2 | **354** |
| `windows.alimentare`, `calendar`, `cautare`, `desktop`, `fereastra`, `securitate_windows` | fără referință | 1 fiecare | 0 | 0 | 1-3 | 1-3 |

- O4 = 0 pe Windows: nu există scenarii `scenarii/windows/*` (supliment: „O4 nu are ce număra aici”).
- O8 = 0 pe Windows: O8 judecă doar Word / Excel / PowerPoint (`oracol_comenzi_moarte.json › procent_comenzi_simulate`).
- O5 / O9 pe poligon: azi fiecare gest Windows (18 în `suprafete.json › windows.gesturi`) și fiecare caz de asistare pică
  la „deschide a eșuat” — se mișcă odată cu construcția, fără să fie ținta.
- Ordinea de lucru: Start, bara (cu tava), meniurile; apoi suprafețele fără referință, SIMPLU (supliment §„Unde suntem”).

## Fișierele pe care le deține runda (doar acestea se modifică)
- NOI, proprii: `aplicatii/windows.js`, `aplicatii/date/windows.json`, `aplicatii/_unelte/genereaza_windows.py`;
  `aplicatii/profiluri/windows11.json` DOAR dacă nu există (îl revendică și banda Explorer, `CICLU_PARALEL.md:27`: creat
  cu deschidere exclusivă, nu suprascris).
- COMUNE, cu Edit pe bucăți mici, păzite pe aplicație: `aplicatii/aplicatii.js` (o intrare `windows` în `SURSE_APP`),
  `aplicatii/poligon.html` (conținutul de probă pentru `?aplicatie=windows`). Copiile de dinainte: `runde/18/inainte/`.
- `setari.json`: NU se schimbă — are deja `"windows": "windows11"` (`aplicatii/setari.json:3`).
- Dosarul rundei: `runde/18/*` (proba `proba_windows.py`, ieșirile în `runde/18/probe_iesiri/`).
- Adăugări în blocul meu din `de_verificat.md` / `de_aprobat.md` (`<!-- RUNDA18-WINDOWS:START/END -->`).
- NU: `explorer.js` și datele Explorer (banda r15), `word.js`, `excel.js`, `powerpoint.js`, lecțiile, zona înghețată.
