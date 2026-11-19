# Runda 6 · constructorul · STAREA (nota de predare pentru un constructor proaspăt)

## Unde e lucrul
- Măsurarea de pornire: `masoara.py --runda 6 --paralel 3`, pornită ~03:05, ieșirea în `runde/6/masurare_inainte.log`
  + `runde/6/masurare.json`. NU se scrie nimic sub `aplicatii/` până nu se termină (o copiezi în `masurare_pornire.json`).
- Tot codul nou stă ÎNTÂI într-o copie: `%TEMP%/…/scratchpad/stage/aplicatii/` (copia worktree-ului + fișierele noi).
  Când măsurarea de pornire s-a terminat: copiezi în worktree fișierele din „Fișierele rundei” (mai jos).
- Pașii 2-4 scriși: `cadru.md`, `tinta.md`, `contra.md`.

## Bucăți (supliment, „Economia contextului”)
1. GATA (în copie): `aplicatii/_unelte/genereaza_excel.py` → `aplicatii/date/excel.json` (46 de suprafețe, ~2363 noduri,
   72 de icoane, 12 note de lipsă; `--verifica` = 0). Refolosește `genereaza_word.py` (neatins). `zona` = geometria foii.
2. GATA (în copie): grila + editarea (`aplicatii/excel.js`): celule `celula:<A1>` pe fiecare celulă, editarea într-un
   `input` din celulă, Enter/Tab/Esc/săgeți/F2/F4/Backspace/Delete, Name Box, bara de formule, filele foilor.
3. GATA (în copie): formulele (RO „;” și „,” → forma engleză din COM), AutoSum, umplerea (serie, număr, text cu număr,
   formulă), Ctrl+D/R, copiere/decupare/lipire, sortarea, Merge & Center, Ctrl+Z/Y.
4. GATA (în copie): panglica/Backstage/meniuri de clic dreapta/ferestre (din motorul comun), Acces rapid, bara de stare
   (modul celulei Ready/Enter/Edit/Point, zoom).
5. O4 pe copie (`LH_RADACINA=<copie> LH_IESIRE=<scratch>/o4 python oracole/oracol_comportament.py --scenarii
   scenarii/excel`): **36/41 la fel ca realul; 0 diferențe; 1 neexecutabil (excel-salvare-ca: pasul cere
   `mso:FileSaveAs`, care nu e pe ecranul real — fila „FileTab” nu e idMso-ul real „FileTabButton”); 4 fără real** → partea
   Excel a O4: 63 → 5.

## Făcut după prima notă (19.11, ~03:35-03:56)
- Pornirea măsurată (`masurare_pornire.json`): O1 61, O2 13392, O3 20337, O4 101, O5 154, O6 0, O7 353, O8 102, O9 41,
  porți 41 (cum_fac); lacăt ok; suma 34582 = finalul rundei 5.
- Pe copie: O5 doar Excel 41/42 (picat `excel.tragere`: oracolul trage din mijlocul primei celule = selecție, ca în Excel);
  O9 Excel 7/8 (F = lecțiile, etapa C); regres Word `5/proba_grav` 0, `4/proba_grav` 0.
- Fișierele copiate în worktree (`excel.json` regenerat acolo; `genereaza_excel.py --verifica` 0, `genereaza_word.py
  --verifica` 0, `node --check` ok). Pe worktree: `proba_excel.py` 0/20 picate (`proba_excel_dupa.json`; înainte:
  `proba_excel_inainte.json`, Excel nu se deschidea); regres Word `5/proba_grav`, `4/proba_grav`, `4/proba_telefon`,
  `3/proba_grav`, `2/proba_grav` = 0 (`regres_*.log`).
- `diferente.md` (D1-D27), `de_verificat.md` (secțiunea RUNDA6-EXCEL: R6-1 … R6-7), `gata_pentru_critic.md`.
- Pasul 7 pornit ~03:56: `masoara.py --runda 6 --paralel 3 --compara runde/6/masurare_pornire.json` → `masurare_dupa.log`.

## Ce urmează (vechi, înainte de 03:35)
- O5 și O9 pe copie (doar Excel), apoi regresul Word pe copie (`LH_SERVIT=<copie>` la `runde/5/proba_grav.py`,
  `runde/4/proba_grav.py`; celelalte trei doar pe worktree, după copiere).
- `runde/6/proba_excel.py` (gesturi reale pe poligon + aspect față de referință), `diferente.md`, `de_verificat.md`.
- După măsurarea de pornire: copiere în worktree, `node --check`, probele, pasul 7 (măsurarea întreagă), raportul.

## Fișierele rundei
Noi: `aplicatii/excel.js`, `aplicatii/date/excel.json`, `aplicatii/_unelte/genereaza_excel.py`,
`aplicatii/profiluri/excel365.json`. Schimbate: `aplicatii/aplicatii.js` (o linie: `SURSE_APP.excel`),
`aplicatii/aplicatii.css` (bloc nou la capăt, clase `lh-ap-x-*` + `.lh-ap-excel`), `aplicatii/poligon.html` (conținutul de
probă Excel). Scriptul care leagă cele două din urmă: `scratchpad/leaga.py <dosar aplicatii>`.
Neatinse: `word.js`, `panglica.js`, `stare.js`, `date/word.json`, `genereaza_word.py`, lecțiile, jocurile, oracolele.

**04:30: pașii 1-7 TERMINAȚI.** Măsurarea de după: suma 34582 → 34476 (O4 101→43, O5 154→113, O9 41→34), niciun
regres, lacăt ok. `raport_constructor.md` și `gata_pentru_critic.md` scrise. Fără commit, fără push. Urmează pașii 8-9
(orchestratorul).
