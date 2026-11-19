# Runda 6 · TABELUL DIFERENȚELOR (pasul 5) — Excel

Starea de pornire: Excel NU exista în bibliotecă (`aplicatii/aplicatii.js:77` avea doar `word` în `SURSE_APP`), deci
fiecare rând de mai jos era „lipsă” pe poligon. Coloana „simulator” arată unde stă acum reparația (`aplicatii/excel.js`).

| # | suprafață | aplicația reală (citat din referința înghețată) | simulatorul (fișier:rând) | grav. | reparația |
|---|---|---|---|---|---|
| D1 | toată aplicația | `uia_excel.json` (48 de suprafețe) | lipsea (`aplicatii.js:77`) | GRAV | `excel.js` + `date/excel.json` generat (`_unelte/genereaza_excel.py`) |
| D2 | panglica, file, Backstage, meniuri, ferestre | `uia_excel.json › panglica.*`, `backstage.*`, `meniu_contextual.*`, `dialog.*` | motorul comun `panglica.js`, date din `date/excel.json` | GRAV | desenate din date, nicio etichetă de mână |
| D3 | Acces rapid | `acces_rapid.afisat = True`; Save, Undo (gri), Redo (gri) în bara de titlu | `excel.js:427` (QAT în `bara_titlu`, ținte `acces_rapid:`) | GRAV | Undo/Redo gri doar când n-au ce face |
| D4 | zona foii | `zona_document`: Name Box [10,188,131,24], Formula Bar [240,179,1125,41], A [27,220,64,20], 1 [1,240,26,19], Sheet1 [113,713,66,32], Add Sheet [211,713,32,32] | `excel.js:569` + `aplicatii.css` (bloc Excel) | GRAV | `proba_excel.py`: 9/9 poziții în toleranța de 8 px |
| D5 | bara de stare | `bara_stare › Text „Cell Mode Ready”`, `Zoom 100 %` | `excel.js:458` (modul celulei: Ready / Enter / Edit / Point) | MĂRUNT | textul modului din stare |
| D6 | tastarea + Enter | `scenarii_real/excel-tastare-enter.json`: A1 „Nota”, selecția A2 | `excel.js:849` (`confirma`) | GRAV | — |
| D7 | Tab apoi Enter | `excel-tab-apoi-enter.json`: după Tab + Enter, selecția revine în coloana de început (A3) | `excel.js:1529` | GRAV | `M.tabCol` |
| D8 | săgeata confirmă | `excel-sageata-confirma.json`: „5” + → = A1 5, selecția B1 | `excel.js` (modul Enter: săgeata primește și mută) | GRAV | — |
| D9 | Esc / Backspace | `excel-esc-renunta`, `excel-backspace-enter` (celula golită, A2), `excel-backspace-esc` (8 rămâne) | `excel.js` (`renunta`, Backspace = editare goală) | GRAV | — |
| D10 | F2 / dublu clic | `excel-f2-editare` („Ana Pop”, A2), `excel-dublu-clic-editare` („AnaX”) | `excel.js` (`porneste(..., 'Edit')`) | GRAV | — |
| D11 | F4 | `excel-f4-adresa-fixa` „=$A$1”, `excel-f4-de-doua-ori` „=A$1” | `excel.js:872` | GRAV | ciclul A1 → $A$1 → A$1 → $A1 |
| D12 | separatorii RO | `excel-separator-punct-si-virgula`: „=SUM(A1;A2)” → formula „=SUM(A1,A2)” = 9; `excel-zecimale-virgula`: 7,5 | `excel.js:177` (`laForma` ro → en) | GRAV | — |
| D13 | „7.5” = dată | `excel-zecimale-punct`: valoare 46149, text „07.mai” | `excel.js:69` (`constanta`) | GRAV | doar luna „mai” e probată (de_verificat R6-3) |
| D14 | zero în față / apostrof | `excel-zero-in-fata` 741234567; `excel-apostrof-text` „0741234567” | `excel.js:69` | GRAV | — |
| D15 | AutoSum | `excel-autosum-buton`: A4 „=SUM(A1:A3)” = 15 după Enter | `excel.js:957` | GRAV | — |
| D16 | umplerea | `excel-umplere-serie` (3,4,5), `-un-numar` (1,1,1), `-text-cu-numar` (Elev 2, Elev 3), `-formula` (=A2*2) | `excel.js:1072` | GRAV | — |
| D17 | Ctrl+D | `excel-ctrl-d`: A2, A3 = 5 | `excel.js:1051` | GRAV | — |
| D18 | copiere / decupare | `excel-copiere-lipire` (B3 aldin), `excel-decupare-lipire` (D1 „=B3*2”) | `excel.js:1029` | GRAV | formulele urmează zona mutată |
| D19 | sortarea | `excel-sortare-a-z`: antetul „Elev/Nota” rămâne; Ana, Bogdan, Dan | `excel.js:988` | GRAV | antetul recunoscut (text peste numere) |
| D20 | Merge & Center | `excel-imbina-centreaza`: A1:C1 aliniere centru, imbinat „A1:C1” | `excel.js:933` | GRAV | — |
| D21 | Ctrl+Z | `excel-ctrl-z-celula`: celula goală, selecția înapoi în A1 | `excel.js:1122` | GRAV | instantaneul include selecția |
| D22 | selecția | `excel-clic-celula`, `-shift-clic` (A1:C3, activa A1), `-ctrl-clic` („A1,C3”), `-shift-sageti` (A1:B2) | `excel.js` (`alege`) | GRAV | — |
| D23 | Bold / Ctrl+B / Delete | `excel-buton-bold-zona`, `excel-ctrl-b`, `excel-delete-goleste` (formatul rămâne) | `excel.js` (`comutaFormat`, `golesteContinut`) | GRAV | — |
| D24 | Save As | `excel-salvare-ca`: „Note.xlsx”; `dialog.FileSaveAs` (File name, Save, Cancel) | `excel.js:1252` (F12, File › Save As › Browse) | GRAV | scenariul rămâne neexecutabil: pasul cere `mso:FileSaveAs` după `mso:FileTab`, iar referința nu are niciun element cu acest idMso pe ecran (File = `FileTabButton`) — de_verificat R6-5 |
| D25 | formulă greșită | `excel-separator-virgula`, `excel-autocompletare-tab`: `mod_probat: false` | `excel.js` (rămâne în editare, fără mesaj) | [NEVERIFICAT] | de_verificat R6-1, R6-2 |
| D26 | mutarea zonei trăgând de chenar | fără scenariu real | nesimulată (tragerea din mijlocul celulei = selecție, ca în Excel) | MĂRUNT | O5 `excel.tragere` rămâne picat: oracolul trage din mijlocul primei celule |
| D27 | Average/Count/Sum în bara de stare | nu apar în referință (foaia captată era goală) | neafișate | [NEVERIFICAT] | de_verificat R6-6 |

Păstrate voit (pentru `de_aprobat.md`): niciuna în runda asta.
