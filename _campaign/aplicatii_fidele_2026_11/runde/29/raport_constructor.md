# Runda 29 (B-excel#3, stare_finala_erori) — raportul constructorului

## Numerele întâi
- **`proba_grav.py` (18 verificări pe gesturi reale, headless):** pe codul de la pornire **17 picate din 18** (`LH_VECHI=1` → `proba_grav_vechi.log`; prima rulare, cu 17 verificări, înainte de G15: 16 picate, `proba_grav_inainte.log`; G14 trecea și înainte) → pe codul final **0 din 18** (`proba_grav_dupa.log`).
- **Regresul pe codul final** (`regres_final.sh` → `regres/regres_final.txt`): `25/proba_grav.py` 0, `21/proba_grav.py` 0 picate. Prima trecere (`regres.sh` → `regres/regres_rezumat.txt`, codul de dinainte de micșorarea pe telefon, singura schimbare de după): 25, 21, 17, 10, 9, 6 = 0; **8 = 1 (K2: asistentul §6.3 nu trece la pasul 2 după Enter cu `activat = fereastra:OK`)** — dă la fel și cu `excel.js` de la pornire servit prin rută (`proba/k2_izolat.py` → `k2_acum.txt` = `k2_vechi.txt`: pas 1, indiciul apare), deci NU vine din banda Excel, ci din codul comun schimbat azi pe disc (`git diff HEAD -- aplicatii/aplicatii.js`: r28 `L.asistent`, r30). De dat orchestratorului.
- **O4 pe `scenarii/excel`**, direct, cu `LH_IESIRE` propriu (`probe_iesiri/o4_excel_final2.log`, codul final): **64/66 la fel ca aplicația reală, 0 diferențe, 0 chei necitite, 0 ecran ≠ stare; ultima linie 2** = cele 2 trageri fără real (R26O-3). La fel la prima trecere (`o4_excel_final.log`). Niciun scenariu nu pică; înainte de rundă nu l-am putut rula separat (O4 citește `excel.js` de pe disc), iar `runde/26/iesiri/O4/oracol_comportament.json` are aceleași 2 trageri `fara_real` printre `excel-*`.
- Măsurarea completă (O1-O9, porțile) NU am rulat-o (regula ciclului paralel): o face orchestratorul.

## G25-1: **ÎNCHIS pe proba mea** (închiderea o confirmă doar criticul următor)
Drumul m1-l03 cu foile se duce acum la capăt (`proba_grav.py` › G1-G13, G15; probele criticului 25 copiate: `proba/pD.py`, `proba/pC.py` › 7):
| gestul (critic 25 › pD) | la pornire | acum |
|---|---|---|
| clic dreapta pe Ciornă (cu date) › Delete | mesajul central, foile rămân 4 | întrebarea „Microsoft Excel will permanently delete this sheet. Do you want to continue?” (Delete cu focusul / Cancel); Delete → `{clic, stergere_foaie, fereastra:Delete}`, Ciornă dispare; Cancel / Esc → rămâne |
| foaie goală › Delete (:243, :321) | mesajul central | dispare direct, `{clic, stergere_foaie, meniu:Delete}` |
| singura foaie › Delete (:266) | „nu e simulată” | fereastra de refuz „A workbook must contain at least one visible worksheet…” (OK), foaia rămâne |
| Ctrl+Z după ștergere (:239) | nimic de anulat | `fara_efect`, foaia nu revine (istoricul se golește), B2 tastat înainte rămâne |
| Home › Delete ▾ › Delete Sheet | mesajul central | lista Delete Cells... / Delete Sheet Rows / Delete Sheet Columns / Delete Sheet → același drum |
| Octombrie › Move or Copy › Noiembrie › OK (:247) | lista „Sheet1, (move to end)”, OK nesimulat | lista = foile + „(move to end)”; Septembrie, Octombrie, Noiembrie; `{clic, mutare_foaie, fereastra:OK}` |
| Create a copy + (move to end) (:255) | — | „Septembrie (2)” la sfârșit, activă, A2 = Ana |
| Tab Color › Green (:220) | mesajul central | submeniul cu paleta; `culori_file {Octombrie: '#00B050'}`, fila neactivă verde (rgb 0,176,80) |
| fila trasă între Septembrie și Ciornă (:240) | `{selectie, selectare}`, nimic | ordinea se schimbă, UN eveniment `{tragere, mutare_foaie, fila_foii:Octombrie}` |
| Ctrl + tragere (:244) | — | copia „Septembrie (2)”, activă, `{tragere, copiere_foaie}` |

## Ce altceva am închis
- **Ctrl+PageDown / Ctrl+PageUp (R25-7, m1-l03:197, :230):** de 6 ori din prima din 4 foi → Octombrie, Noiembrie, Decembrie, apoi pe loc; `foaie_urmatoare` ×3 + `fara_efect` ×3; Ctrl+PageUp invers (P1, P2).
- **MINOR 1 al criticului 25:** Alt singur în Format Cells → un eveniment `arata_taste_acces` (A1).
- **Unghiul stare_finala_erori — redenumirea cu numele altei foi (m1-l03:226, „citește mesajul”):** înainte revenea tăcut; acum fereastra „That name is already taken. Try a different one.” (OK), `{tasta_enter, nume_existent}`, după OK fila e iar în redenumire cu textul tastat; Esc → numele vechi (G15).
- Drumurile de pe unghi care erau deja bune: Delete pe rând întreg + Ctrl+Z, lipirea peste date + Ctrl+Z, Esc pe formula neterminată, Sort Warning la sortarea unei coloane (`proba/stare_erori.json` › E3, E4, E5, E8).

## Ce a rămas (NEFĂCUT / NESIGUR)
- **Fără referință, deci desenate sau deduse** (R29-1 … R29-9 în `de_verificat.md`): ferestrele de confirmare / refuz / „name taken”, rândul ales la deschiderea Move or Copy, golirea istoricului la mutare / copiere, submeniul Tab Color (galeria Fill Color din referință, „No Color”), lista Home › Delete ▾, regula locului la tragerea filei.
- **„=SUM(A1:A3” / „=A1+” + Enter** (ținta 4): rămân în editare cu mesajul central — ce face Excel nu e în referință (R29-8), deci neimplementat.
- **Nume gol / caracter nepermis la redenumire:** revine tăcut, fără referință (R29-7).
- **Telefonul:** `proba/telefon.py` — atingerea pe filă și degetul tras dau același rezultat ca pe codul vechi (`LH_VECHI=1`), deci proba de atingere din ham nu nimerește fila (nu e regres, dar nici dovadă pentru telefon) — NESIGUR. Ce s-a dovedit pe telefon (375×667): meniul filei › Delete › Delete merge, iar întrebarea, care avea 456 px și ieșea din ecran (Cancel la x 350-429), se micșorează acum întreagă la 371 px (`proba/telefon.json › 3_delete_telefon`).
- Probele criticului 25, reluate pe codul nou (`proba/pD.json`, `proba/pC.json`): Delete → întrebarea, Move or Copy → `mutare_foaie`, Tab Color → `submeniu`, tragerea → `mutare_foaie`, singura foaie → `refuz_stergere`, pC › 7: Delete + confirmare → o foaie, Ctrl+Z `fara_efect`. Pasul 2 din pD (Home › Delete ▾) nu se joacă acolo, pentru că scriptul lui nu închide întrebarea deschisă la pasul 1 (atunci era doar un mesaj); drumul e jucat curat în `proba_grav.py › G7`.
- MINOR-urile criticilor 25 (2-4) și 21 (4, 7): neatinse (cod comun sau sub prag); MINOR D15 (bara de titlu a ferestrelor „Microsoft Excel” scrie titlul, captura o are goală — rama e comună tuturor ferestrelor).
- Ctrl+PageDown pe calculator îl ia Chrome (critic 25 › [FARA_REFERINTA] 8): biblioteca n-are rândul de butoane „Tastele lui Excel” — hotărâre de montare în lecții, a orchestratorului.

## Fișiere atinse
- `aplicatii/excel.js` (singurul fișier de cod; copia de dinainte: `runde/29/inainte/excel.js`).
- `de_verificat.md`: doar blocul `<!-- RUNDA29-EXCEL:START/END -->` (R29-1 … R29-9), adăugat la sfârșit.
- `de_aprobat.md`: nimic.
- `runde/29/`: cadru, tinta, contra, diferente, api_propunere, proba_grav.py + ieșirile, proba/ (hc29, pD, pC, stare_erori, telefon, capturi), regres.sh + regres/.

## Fișiere comune atinse
**Niciunul.** `aplicatii.js`, `panglica.js`, `aplicatii.css`, `stare.js`, `poligon.html`, `setari.json`, `versiune.json`, `date/excel.json` — neatinse (stilurile noi sunt în linie, în `excel.js`; ferestrele fără referință sunt injectate din `excel.js` în `SUP` / `date.dialoguri`, la pornire, o singură dată). De aceea regresul celorlalte aplicații Office nu e cerut.

## Pentru api (zona înghețată)
`api_propunere.md`: cheia de stare `culori_file`, parametrul de conținut `foi[].culoare`, acțiunile noi (`stergere_foaie`, `intrebare_stergere`, `refuz_stergere`, `mutare_foaie`, `copiere_foaie`, `culoare_fila`, `foaie_urmatoare` / `foaie_anterioara`, `nume_existent`), suprafețele desenate fără referință.
