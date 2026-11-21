# Supliment la promptul rundei 24 (valul B-word redeschis `B-word#2`, a treia rundă; ciclul paralel C) — scris de orchestrator, 21.11.2026

Se citește DUPĂ `runde/24/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`.

În ciclul C, benzile sunt:
- r23 Explorer;
- r24 Word;
- r25 Excel;
- r26 Windows.

## Unde suntem
- **Criticul rece 20** (`runde/20/critic.md`, unghiul stare_finala_erori) a dat **GRAV 0 și GRAV_VECHI_DESCHISE 0**: K1 e închis.
- **Convergența** cere 3 runde la rând fără GRAV, pe 3 unghiuri diferite. Runda asta e a doua, pe unghiul `aspect`. Deci NU aduci un GRAV nou: fiecare schimbare are regresul ei.
- **Pornirea** e `runde/24/masurare_pornire.json`.

## Cine atinge ce din `aplicatii.js` în ciclul C (ca să nu vă călcați)
- **r24 (tu):** DOAR `L.asistent` (azi ~`:615-660`) și §6.3 din `api_biblioteca.md`.
- **r23 Explorer:** condiția `preventDefault` din ascultătorul de `keydown` (~`:407`) și §1 din api.
- **r26 Windows:** `litera` / `gestTasta` (~`:261-279`) și §4 din api.

Fiecare edit e mic, făcut cu Edit, iar înainte de el citești din nou zona. În raport le treci la „Fișiere comune atinse”.

## Ținta rundei 24, în ordinea asta
1. **Asistentul comun** (`20/critic.md:99-110`; hotărârea orchestratorului, trecută de tine în `de_aprobat.md` ca A24-1, pentru confirmarea lui Vasile):
   - **Tab nu mai bifează pasul.** Un eveniment `tasta_tab` cu `actiune: 'mutare_focus'` nu bifează pasul, chiar dacă ținta lui e ținta pasului. Azi, Tab care trece peste Save bifează „Save” fără salvare (`aplicatii.js:628`, `ev.tinta === p.tinta`).
   - **Tab nu mai e greșeală.** `mutare_focus` intră între excepțiile care nu sunt greșeli, ca `sageti`, iar rândul din §6.3 se scrie în api.
   - **Nu atingi** cazul „pas cu `tinta` ȘI `asteapta`” (A21-1, așteaptă hotărârea lui Vasile).
   - **Regres:**
     - O9 pe toate aplicațiile, în dosarul rundei (`LH_IESIRE`), înainte și după, egal sau mai bine;
     - asistentul pe drumul PDF cu tastele (`20/critic_probe › M6`): bula nu mai apare după pașii buni, iar pasul Save se bifează doar la salvarea adevărată;
     - PowerPoint: un drum cu Tab în fereastră.
2. **O4: diferențele măsurate față de Word real.** În măsurarea comună de la finalul ciclului B (`runde/22/iesiri/O4/oracol_comportament.json`):
   - `word-clic-pune-cursorul` are diferențe;
   - `word-imagine-inserare` e neexecutabil.
   Le repari în `word.js`, după rezultatul real înregistrat în scenariu, și probezi cu O4 doar pe `word-*` (`LH_IESIRE` în dosarul rundei). Fiecare reparat = o diferență în minus la măsurarea comună. Altfel, regula de platou oprește valul (aceleași O1-O9 trei runde la rând). Cele „fără real probat” (copiere / decupare / tragere, `word2007-ctrl-z-*`) cer gesturi vizibile pe Word real, deci NU sunt ale tale.
3. **MINOR-urile Word din `20/critic.md`:**
   - **Alt+F4 într-o fereastră** (Save As, Open) o închide, ca în Windows.
   - **Mesajul de eroare dispare la salvarea reușită** (numele interzis / „already exists”, apoi corectat). Folosești funcția publică a bibliotecii care ascunde mesajul, dacă există; altfel îl treci la „Pentru orchestrator”, fără să schimbi `aplicatii.js:235`.
   - **Fereastra mică** (1366×657 la 125 %): Save / Cancel și lista Save as type încap în ecran sau ajung în vedere la Tab / la deschiderea listei.
   - **„already exists”:** întrebarea de înlocuire, doar dacă găsești referința în `referinte/` (lecția o descrie la `m1-l03:158-159`). Altfel rămâne cum e, cu rând `R24-…`.
4. **Unghiul aspect pe Word**, față de referințele capturate (`referinte/uia_word.json`, scenariile `word-*`):
   - fereastra Word 365 și panglica pe filele din lecții (Home, Insert, Layout, View);
   - Backstage (File › Save As / Open / Export);
   - ferestrele Save As / Open / Save this file / Save your changes, măsurate la ±2 px acolo unde referința are dreptunghiuri;
   - laptopul la 125 % (1366×657), telefonul (360-390 px) și tabla SMART (1920×1080).
   Ce nu e în referință: rând `R24-…`.
5. **Apoi**, cât îți ajunge contextul, R16-1…R16-5 și R20-1…R20-4, doar acolo unde găsești referință.

## Gata înseamnă
- `runde/24/proba_grav.py`: verificările picate la pornire și câte pică la final, inclusiv asistentul pe drumul cu tastele.
- Regresul Word: scenariile `word-*` (O4 = 13 la pornire, fără să scadă niciunul) și probele vechi (20, 16, 5, 4, telefon).
- O9 înainte și după, pe toate aplicațiile.
- `raport_constructor.md`, cu secțiunea „Fișiere comune atinse”.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau `PREDARE` la ~200k de context.
