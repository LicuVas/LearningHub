# Runda 27 · ținta (din `runde/supliment_B_explorer_runda27.md`)

Ordinea e a orchestratorului (GRAV deschise: 0, critic 23 › `GRAV: 0`):
1. MINOR 4 (critic 23): redesenarea gazdei confirmă numele neterminat. Proba: `proba_grav.py M4` (pornire: 11 / 13 picate).
2. MINOR 1: meniurile mai înalte decât fereastra. Proba: `proba_grav.py M1` (rotița pe meniu; pornire: 0 / 20 picate).
3. MINOR 2: Ctrl+Z în căutare. Proba: `proba_grav.py M2` (pornire: 2 / 3 picate).
4. Unghiul aspect pe fereastră și meniuri, la ±2 px față de `referinte/uia_explorer.json`, și pe cele 4 ecrane. Proba: `probe/aspect27.py` (pornire: 3 abateri din 141 de măsurători + ecrane).

Numerele de la pornire (`masurare_pornire.json`, r26): O3 = 28919 (Explorer: aproape toate suprafețele au `randari: 0` — nicio lecție nu desenează încă Explorer-ul bibliotecii, deci O3 nu se mișcă din `explorer.js`), O4 = 15 (Explorer 18/18), O8 = 102. Lecțiile din inventar cu Explorer (v/m2-l09…l12, m2-l15, m5-l31, m5-l36, vi/m3-l18) folosesc încă `lectii/_sim/explorer-*.js`; drumurile lor (Nou › Folder, Redenumire, Ștergere, Detalii, căutarea) sunt cele probate aici.

## Fișierele rundei (doar acestea se modifică)
- `aplicatii/explorer.js`
- `_campaign/aplicatii_fidele_2026_11/runde/27/*` (probe, rapoarte)
- blocul `RUNDA27-EXPLORER` din `de_verificat.md` (doar adăugat)
Cod comun (`aplicatii.js` etc.): nimic (suplimentul: „r27: nimic”). `api_biblioteca.md`: înghețat → `api_propunere.md`.
