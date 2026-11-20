# Runda 22 (B-windows, unghiul gest_tastatura) — gata pentru criticul rece

## Ținta
Cele 5 GRAV din `runde/18/critic.md`, în ordinea W1, W4, W3, W2, W5 (`runde/supliment_B_windows_runda22.md`).

## Ce s-a schimbat (doar fișierele benzii)
- `aplicatii/windows.js`;
- `aplicatii/_unelte/genereaza_windows.py`;
- `aplicatii/date/windows.json` (regenerat).

Diff-ul: `git -C C:/00/Projects/LearningHub_fidel diff -- aplicatii/windows.js aplicatii/_unelte/genereaza_windows.py aplicatii/date/windows.json`.
Copiile de dinainte sunt în `runde/22/inainte/`. Fișiere comune atinse: niciunul.

## Unde se încearcă
`aplicatii/poligon.html?aplicatie=windows`. Gesturile de încercat:
- clic dreapta pe desktop, inclusiv lângă marginea de jos;
- tasta Windows, apoi „pai” / „calc”, Sus/Jos, Enter, Backspace;
- tasta Windows, apoi Tab și săgețile până în „Toate”;
- rotița pe listă;
- mouse-ul ținut pe dosarul galben;
- telefonul la 360 / 390 px: Minimizare, butonul din bandă, glisarea barei de titlu, glisarea listei din Start.

## Referințele
- `referinte/uia_windows.json`: `meniu_desktop › ferestre[0]`, `start`, `start_toate`;
- `referinte/sesiune_windows_10min.md:36`;
- pagina Microsoft https://support.microsoft.com/en-us/accessibility/windows/use-a-screen-reader-to-explore-and-navigate-the-start-menu-in-windows (secțiunile „Search (Windows 11)” și „Navigate to Pinned and All apps”).

## Ce declar deschis
- **W4, clicul care ar deschide Explorer-ul bibliotecii:** cererea A22-1 către banda r19.
- **Fără referință:** R22-1…R22-5.
- **Abateri propuse:** A22-2 (telefonul), A22-3 (fereastra generică Paint / Calculator).
- **O3 de diagnostic pe `start`:** +4 (motivul e în `raport_constructor.md` › NESIGUR).

## Proba constructorului
`runde/22/proba_grav.py`: la pornire picau 35 din 48 de verificări, la final 0 din 50. Regresul r18: 37/37.

GATA_PENTRU_CRITIC
