# Runda 21 (B-excel#2, a doua rundă a valului redeschis; ciclul paralel B) — ținta

## De unde vine ținta
- Etapa B, aplicația excel. Ținta e dată de orchestrator în `runde/supliment_B_excel_runda21.md` (GRAV-urile criticului 17 au întâietate), nu aleasă de mine din (O3+O4+O8) × lecții.
- Numerele de context, din `masurare_pornire.json` (măsurarea comună de la finalul ciclului A, toate aplicațiile): O3 28919 · O4 28 · O8 102 · O9 13 · porți 41 (cum_fac). În `inventar.json`, 18 din 60 de pagini pomenesc Excel.
- Ce a ales ținta, în ordinea suplimentului:
  1. **G17-1** (regres adus de runda 17, blochează elevul): `proba_grav.py` la pornire, `G1.1`-`G1.12`: 11 picate (`proba_grav_inainte.log`).
  2. **G17-2** (vechi în cod, pe telefon): `G2.2`, `G2.3` picate.
  3. **§6.3** (asistentul, `aplicatii.js:627-628`): doar dacă textul e limpede (hotărârea în `contra.md` › §6.3).
  4. MINOR-urile de aspect din `runde/17/critic.md` (MINOR 2: listele la +4/+5 px), cât ajunge contextul.

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/excel.js` (copia: `inainte/excel.js`) — toată reparația G17-1 și G17-2.
- `aplicatii/aplicatii.js` — **comun**, doar dacă reparația G17-2 nu se poate face în `excel.js` (copia: `inainte/aplicatii.js`). Plan: NU îl ating.
- `aplicatii/aplicatii.css` — **comun**, doar dacă e nevoie (copia: `inainte/aplicatii.css`). Plan: NU îl ating.
- `de_verificat.md` (blocul `RUNDA21-EXCEL`), `de_aprobat.md` (blocul `RUNDA21-EXCEL`); copiile în `inainte/`.
- `runde/21/` (cadru, tinta, contra, diferente, `proba_grav.py`, `proba/`, jurnalele, raportul).

## Ce NU ating
`explorer.js`, `word.js`, `windows.js`, `powerpoint.js` și datele lor; zona înghețată (`oracole/`, `referinte/`, `scenarii/`, `suprafete.json`, `mutanti/`, `repere.lock`); lecțiile; `api_biblioteca.md`; mesajul central „nesimulat” din `aplicatii.js` (~229, banda Explorer r19).
