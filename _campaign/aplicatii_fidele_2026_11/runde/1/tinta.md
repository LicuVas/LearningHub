# Runda 1 · ȚINTA (pasul 3)

## Numerele care au ales ținta (măsurarea de pornire, `iesiri/`, 18.11.2026 17:1x)
| oracol | total | partea Word | de unde |
|---|---:|---:|---|
| O3 interfața | 18546 | 7349 puncte (cele mai mari: Ctx_ShapeFormat 379, FontDialog 368, FileSaveAs 358, PictureInsertFromFile 309, ParagraphDialog 301) | `iesiri/O3/oracol_ui.json › pe_suprafata` (word.*) |
| O4 comportament | 162 | ≈ 74 (47 scenarii Word neexecutabile + 7 fără rezultat real probat, și ele neexecutabile) | `iesiri/O4/oracol_comportament.json › scenarii` |
| O8 comenzi moarte | 102 | 67 (pe cele 12 pagini cu Word) | `iesiri/O8/oracol_comenzi_moarte.json › pagini_cu_comenzi_moarte` |
| O5 evenimente | 201 | 48 (toate gesturile Word) | `iesiri/O5/oracol_evenimente.json › pe_aplicatie` |
| O9 asistare | 48 | 8 | `iesiri/O9/oracol_asistare.json` |

Word apare în 12 pagini din `inventar.json` (9 lecții VII + 3 jocuri). (O3+O4+O8) Word = 7349 + 74 + 67 = 7490, cea mai
mare dintre aplicații; în plus suplimentul fixează ținta rundei 1: **biblioteca centrală (scheletul comun §1-§8) + Word**.
Nu există GRAV-uri de la un critic anterior (prima rundă).

## Ce se poate mișca în runda asta (din cadru.md, presupunerea 5)
O4, O5, O9 lucrează pe `aplicatii/poligon.html` → se pot mișca. O3, O8, O2, O1, O6 măsoară lecțiile (simulatoarele vechi)
→ nu se mișcă până la etapa C. O7 trece pe verificarea bibliotecii când apare `aplicatii/*.js` (vezi contra.md).
Interfața Word se măsoară între timp cu `aplicatii/_unelte/masoara_poligon.py` (codul înghețat al lui O3, pe poligon).

## Fișierele deținute de rundă (doar acestea se schimbă; toate sunt NOI)
```
aplicatii/aplicatii.js          încărcarea, registrul (radacini), evenimentele §4, asistarea §6, tipMotor §8.1
aplicatii/aplicatii.css         aspectul comun (clase lh-ap-*)
aplicatii/panglica.js           motorul comun care desenează suprafețele din date (Word acum; Excel/PowerPoint mai târziu)
aplicatii/stare.js              istoricul Anulare/Refacere cu grupare după profil
aplicatii/word.js               documentul Word (§5), comenzile, dialogurile, Backstage, meniurile
aplicatii/date/word.json        GENERAT din referinte/uia_word.json (+ icoane Fluent MIT)
aplicatii/profiluri/word365.json, aplicatii/profiluri/word2007.json
aplicatii/setari.json, aplicatii/versiune.json, aplicatii/poligon.html
aplicatii/_unelte/genereaza_word.py      generatorul lui date/word.json (+ --verifica)
aplicatii/_unelte/masoara_poligon.py     diagnosticul de interfață pe poligon (cod înghețat O3)
```
Artefactele rundei: `runde/1/*.md`; o secțiune nouă în `de_verificat.md`. Lecțiile, jocurile, `jocuri/_motor/` — neatinse.
