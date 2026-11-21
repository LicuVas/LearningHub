# Runda 30 · ținta

## De unde vine
- Ținta e scrisă de orchestrator în `runde/supliment_B_windows_runda30.md` (GRAV-urile criticului 26 au întâietate):
  1. N1 (`26/critic.md:99`), 2. N2 (`26/critic.md:120`), 3. W4 = A23-1 P1 + P2 (`runde/23/propunere_comun_A22-1.md`) + legarea
  Explorer-ului montat în `windows.js`, apoi A26-2 dacă ajunge timpul; 4. MINOR „start_fundal” (`26/critic.md:188`).
- Numerele de pornire (proba rundei, `probe_iesiri/proba_grav_pornire.log`, codul de la 24fd4eb5): **51 de verificări picate**:
  N1 9/19, N2 31/38, W4 4/5 (restul secțiunii nu rulează fără montare), A26-2 3/5, start_fundal 2/2, telefon 2/2.
- Măsurarea comună de pornire: `runde/30/masurare_pornire.json` (n-o reiau: pasul 7 e al orchestratorului).

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/windows.js` (fișierul benzii Windows).
- `aplicatii/aplicatii.js` (COMUN), DOAR zonele date de supliment: `gestTasta` (N2 + A26-2), `leagaGesturi` › `pointerdown` (A23-1 P1),
  `L.deschideSuprafata` (A23-1 P2), `I.emite` din `L.deschide` (A26-2, `extra`).
- `D/runde/30/*` (probe, artefacte, `api_propunere.md`), blocurile `RUNDA30-WINDOWS` din `D/de_verificat.md` și `D/de_aprobat.md`.
- NU: `explorer.js` (r27), `word.js` + `L.asistent` (r28), `excel.js` (r29), `api_biblioteca.md` (înghețat), lecțiile, zona înghețată.
- Copiile pentru „dat înapoi”: `runde/30/inainte/` (aplicatii.js, windows.js, windows.json, de_verificat.md, de_aprobat.md), luate la
  07:06, identice cu 24fd4eb5.
