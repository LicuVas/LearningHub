# Ținta rundei 24 (etapa B, Word, unghiul aspect)

Ținta e dată de orchestrator (`runde/supliment_B_word_runda24.md`), în ordine; GRAV-urile vechi ale lui Word: 0 (`runde/20/critic.md:224-225`).

## Numerele care au ales-o (pornirea: `runde/24/masurare_pornire.json` + măsurile mele din `probe_iesiri/`)
- O9 (asistarea, toate aplicațiile) = 13 la pornire, rulat și în dosarul meu: 13 (`probe_iesiri/O9_inainte`). Cele 13 cazuri sunt structurale (`F_lectie_asculta` × 5, paint × 8), deci problema din critic 20 › B nu se vede în O9. Proba ei e `proba_grav.py` › AS*.
- O4 pe `word-*` = 13 (`probe_iesiri/O4w_inainte/rele.txt`): 2 diferențe în `word-clic-pune-cursorul`, 1 scenariu neexecutabil care ține de Word (`word-imagine-inserare`), plus 1 neexecutabil al hamului (`word-font-size-tastat`, pasul n-are țintă) și 8 „fără real probat”. Acestea din urmă nu sunt ale mele (supliment, ținta 2).
- `proba_grav.py` la pornire: 13 verificări picate din 19 (`proba_grav_inainte.log`).

## Ce face runda, în ordine
1. Asistentul comun: `mutare_focus` nu bifează pasul și nu e greșeală (`aplicatii.js` › `L.asistent` + `api_biblioteca.md` §6.3). Hotărârea intră în `de_aprobat.md` ca A24-1.
2. O4 `word-*`: cele două rânduri, după rezultatul real (vezi `diferente.md`: niciunul nu se poate repara cinstit în `word.js`).
3. MINOR-urile din critic 20: Alt+F4 într-o fereastră; mesajul de eroare scos la salvarea reușită; fereastra mică (Save / Cancel, Tab, lista Save as type); „already exists” (fără referință → rămâne, R24).
4. Unghiul aspect pe Word față de `uia_word.json`: ferestrele Save As / Open / „Save this file” / „Save your changes”, la ±2 px; filele panglicii; telefonul, fereastra mică și tabla.

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/word.js` (al benzii Word);
- `aplicatii/aplicatii.js`, DOAR `L.asistent` (fișier comun, cu Edit, mic);
- `_campaign/aplicatii_fidele_2026_11/api_biblioteca.md`, DOAR §6.3 (fișier comun, cu Edit, mic);
- `de_aprobat.md` / `de_verificat.md`: doar blocul `RUNDA24-WORD`;
- `runde/24/*`.

NU ating: `explorer.js`, `excel.js`, `windows.js`, `powerpoint.js` și datele lor; zona înghețată (`oracole/`, `referinte/`, `scenarii/`, `suprafete.json`, `mutanti/`, `repere.lock`); lecțiile.
