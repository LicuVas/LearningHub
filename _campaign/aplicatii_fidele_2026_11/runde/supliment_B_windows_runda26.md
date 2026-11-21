# Supliment la promptul rundei 26 (valul B-windows, a treia rundă; ciclul paralel C) — scris de orchestrator, 21.11.2026

Se citește DUPĂ `runde/26/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`.

În ciclul C, benzile sunt:
- r23 Explorer;
- r24 Word;
- r25 Excel;
- r26 Windows.

## Unde suntem
- **Criticul rece 22** (`runde/22/critic.md`, unghiul gest_tastatura) a închis W1, W2 și W5, iar W3 pe PC.
- **Au rămas 4 GRAV:**
  - W4, parțial: așteaptă montarea Explorer-ului, A22-1;
  - K1, K2 și K3, noi.
- **Pornirea** e `runde/26/masurare_pornire.json`. Unghiul rundei: `stare_finala_erori`.

## Cine atinge ce din `aplicatii.js` în ciclul C (ca să nu vă călcați)
- **r26 (tu):** DOAR `litera` / `gestTasta` (azi ~`:261-279`).
- **r23 Explorer:** DOAR condiția `preventDefault` din ascultătorul de `keydown` (~`:407`).
- **r24 Word:** DOAR `L.asistent` (~`:615-660`).

Fiecare edit e mic, făcut cu Edit, iar înainte de el citești din nou zona. În raport le treci la „Fișiere comune atinse”.

## Ținta rundei 26, în ordinea asta
1. **K1 (`22/critic.md:83`): Windows + E deschide Start, fără mesaj, iar evenimentul iese `ctrl_e`.** E drumul spre Explorer din 11 lecții.
   - Cauza: `gestTasta` tratează tasta Windows (`metaKey`) ca pe Ctrl (`aplicatii.js:267`), iar `windows.js:708` deschide Start la eliberarea ei.
   - Ce faci:
     - tasta Windows + literă emite un gest propriu (de ex. `win_e`, `win_d`), documentat în `api_biblioteca.md` §4 (comun, un rând);
     - pe Windows, Win+E nu mai deschide Start;
     - Win+E dă mesajul central până se leagă Explorer-ul. Explorer-ul bibliotecii primește montarea în runda 23, iar tu o legi în ciclul următor;
     - Win+D arată desktopul (dacă e în lecții).
   - Alege drumul cel mai mic care nu schimbă nimic la celelalte aplicații. De ex. schimbarea doar pentru `metaKey` fără Ctrl; sau un cârlig opțional prin care aplicația își numește gestul.
   - Regres pe Word, Excel, PowerPoint, Explorer: Ctrl+litera dă exact aceleași evenimente ca înainte.
2. **K2 (`22/critic.md:100`): asistentul nu recunoaște drumul cu tastatura** (tasta Windows → scrii „pai” → Enter).
   - Rămâne la pasul 0 și arată indiciul pe Start, deși Start e deschis.
   - Lipsește `activat` (§4) pe tasta Windows care deschide Start și pe Enter care pornește rezultatul (`windows.js:708`, `:532`).
   - Pui `activat` = ținta canonică a comenzii activate, cum fac Word / Excel la Enter în liste.
   - NU schimbi `L.asistent` (e al benzii r24).
3. **K3 (`22/critic.md:119`): pe telefon, atingerea pe caseta din Start arată cursorul, dar tastatura ecranului nu apare.**
   - Textul tastaturii se pierde fără eveniment. Înainte de runda 22, atingerea dădea măcar mesajul, deci e un regres.
   - Caseta trebuie să fie un câmp adevărat, focalizabil la atingere, iar textul de pe telefon (evenimentul `input`) să ajungă în căutare, ca la tastatură.
   - Pe telefon, Paint trebuie să se poată găsi fără tastare (lista Fixate / Toate).
4. **Unghiul stare_finala_erori**, pe drumurile lecțiilor (v/m2-l08 …):
   - Start deschis, apoi Esc / clic în afară;
   - text greșit în căutare, apoi Backspace până la gol;
   - aplicație pornită din căutare, apoi minimizată, readusă din bară, maximizată, închisă;
   - meniul desktopului cu Esc la jumătate;
   - Nou › Folder pe desktop, apoi Esc / nume gol;
   - două ferestre deschise și închiderea celei din spate.
   După fiecare: `stare()` = ecranul = referința (`referinte/uia_windows.json`, sursele citate în `22/diferente.md`), evenimentul §4, asistentul §6.3. Ce nu are referință: rând `R26-…`.
5. **Apoi**, cât îți ajunge contextul, MINOR-urile din `runde/22/critic.md` și `runde/18/critic.md`.

## Gata înseamnă
- `runde/26/proba_grav.py`: verificările picate la pornire și câte pică la final, pe gesturi reale (tastatură, `touchscreen.tap` la 360 și 390 px).
- Regresul:
  - proba r22 și proba r18;
  - Ctrl+litera pe celelalte 4 aplicații, înainte și după schimbarea din `gestTasta`.
- `raport_constructor.md`: K1-K3 fiecare ÎNCHIS cu dovada de azi sau NEÎNCHIS cu motivul. W4 rămâne parțial până în ciclul următor. Secțiunea „Fișiere comune atinse”.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau, la ~200k de context, `PREDARE` în `stare_autor.md`.
