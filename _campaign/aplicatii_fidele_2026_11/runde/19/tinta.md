# Runda 19 · B-explorer · ȚINTA

## De unde vine
Ținta e scrisă de orchestrator în `runde/supliment_B_explorer_runda19.md` (ciclul paralel B); GRAV-urile criticului 15 au
întâietate. Etapa B: lecțiile nu încarcă încă biblioteca pentru Explorer, deci O3 / O4 / O8 ale lecțiilor nu se mișcă din Explorer;
numerele care aleg ținta sunt cele ale probelor pe gesturi reale, la pornire (`probe_iesiri/pornire_*.log`):

| ținta | verificări picate la pornire | lecțiile atinse (critic 15) |
|---|---|---|
| E1 · mesajul central șters de redesenare (R12) | 10 / 10 gesturi (mesajul trăiește 0 ms) | v/m2-l09 (clic pe „Acest PC”), toate comenzile nesimulate din Explorer |
| E2 · redenumirea pe telefon (I1) | 27 / 34 (360 și 390 px, insertText și tastatură, Enter și atingere în afară, Redenumire din bară) | v/m2-l10, m2-l11, m2-l12 |
| unghiul gest_tastatura | 8 / 32 (Enter pe fișier fără mesaj — E1; Alt+Enter intră în folder; Ctrl+Shift+C tace; 4 în cascadă) | m2-l10 … m2-l12 (Ctrl+C / X / V / Z, F2, Delete, Enter) |

## Fișierele pe care le deține runda (doar acestea se modifică)
- `aplicatii/explorer.js` (fișierul propriu al benzii Explorer);
- `aplicatii/aplicatii.js` — FIȘIER COMUN, doar funcția `nesimulat` (`aplicatii.js:220-233`), cu Edit, cerută explicit de
  supliment („Tu repari și partea COMUNĂ, pentru toate aplicațiile”);
- `_campaign/.../runde/19/*` (probele, rapoartele), blocul `<!-- RUNDA19-EXPLORER:START/END -->` din `de_verificat.md`.

Copiile pentru „dat înapoi”: `runde/19/inainte/aplicatii.js` (sha1 fa65f928…), `runde/19/inainte/explorer.js` (sha1 26ee9183…),
luate înainte de prima scriere.

## NU se ating
`word.js`, `excel.js`, `powerpoint.js`, `windows.js` și datele lor; `date/explorer.json` (generat, nu e nevoie);
`panglica.js`, `stare.js`, `aplicatii.css`, `poligon.html`, `setari.json`, `versiune.json`; lecțiile; zona înghețată.
