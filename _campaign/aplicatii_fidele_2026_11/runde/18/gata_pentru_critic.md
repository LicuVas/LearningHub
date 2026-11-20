# Runda 18 (B-windows) — gata pentru criticul rece

Cum deschizi Windows-ul simulat (doar local, headless sau în browserul tău, rețeaua tăiată în afară de 127.0.0.1):
1. Server static pe port liber, cu rădăcina worktree-ului:
   `python -m http.server 0 --bind 127.0.0.1 --directory C:/00/Projects/LearningHub_fidel` (portul îl tipărește serverul).
2. Deschide `http://127.0.0.1:<port>/aplicatii/poligon.html?aplicatie=windows` — desktopul cu o fereastră Explorer
   deschisă („Acest PC”), ca bara să arate o aplicație pornită. Fără parametru, din consolă:
   `LH.aplicatii.deschide('windows', {focus: true, continut: {ferestre: [...]}})`.
3. Starea: `LH.aplicatii.stare('windows')`; evenimentele: `window.__lhAplicatieEv`.
4. Suprafețele ascunse la pornire, prin gest: clic pe Start (sau tasta Windows), clic dreapta pe desktopul gol, „Afișați
   mai multe opțiuni” sau Shift + clic dreapta, Nou ▸; prin plasă: `LHAplicatii.deschideSuprafata('start' |
   'meniu_desktop' | 'meniu_desktop_clasic' | 'meniu_desktop_nou')`.

Referințele: `referinte/uia_windows.json` (bara_activitati, start, start_toate, meniu_desktop, meniu_desktop_clasic) și,
pentru completări, `referinte/uia_explorer.json` (explorer_meniu_nou, explorer_fereastra), `referinte/scenarii_real/
explorer_folder_nou*.json`. Codul: `aplicatii/windows.js`, `aplicatii/date/windows.json` (generat de
`aplicatii/_unelte/genereaza_windows.py`), rândul `aplicatii/aplicatii.js:79`, `aplicatii/poligon.html:13-14, 18`.
Proba constructorului: `runde/18/proba_windows.py` (37/37; O3 de diagnostic la 1366×768 = 80, la 1536×864 = 51).
Lecțiile NU s-au schimbat (etapa B).
GATA_PENTRU_CRITIC
