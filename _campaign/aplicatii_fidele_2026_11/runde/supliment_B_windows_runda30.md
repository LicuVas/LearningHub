# Supliment la promptul rundei 30 (valul B-windows redeschis `B-windows#2`; ciclul paralel D) — scris de orchestrator, 21.11.2026

Se citește DUPĂ `runde/30/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii / comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`.

În ciclul D, benzile sunt:
- r27 Explorer;
- r28 Word;
- r29 Excel;
- r30 Windows.

## Unde suntem
- **Criticul rece 26** (`runde/26/critic.md`, unghiul stare_finala_erori) a închis K1, K2 și K3, și a lăsat 3 GRAV:
  - W4 (vechi, parțial): Explorer-ul bibliotecii nu se montează din bara de activități;
  - N1 (nou, cod vechi): focusul cade pe `<body>` după redenumirea pe desktop;
  - N2 (nou): Windows + Spațiu deschide Start și tace.
- **Valul `B-windows` s-a oprit pe PLATOU** după ciclul C și se redeschide ca `B-windows#2`, după runda `acoperire` Office.
- **Pornirea** e `runde/30/masurare_pornire.json`. Unghiul rundei: `aspect`.

## Zona înghețată: `api_biblioteca.md` NU se editează
- Fișierul e în `repere.lock`. În ciclul C un edit al lui a rupt lacătul și a oprit măsurarea comună.
- Textul nou pentru api (§1 legarea montării, §4 `win_<tastă>`) îl scrii în `runde/30/api_propunere.md`. Îl aplică o rundă `acoperire`.

## Cine atinge ce din `aplicatii.js` în ciclul D (ca să nu vă călcați)
- **r30 (tu), DOAR:**
  - `gestTasta` (azi ~`:266-290`), pentru N2;
  - `leagaGesturi` › `pointerdown` (~`:328`), pentru A23-1 P1;
  - `L.deschideSuprafata` (~`:187-192`), pentru A23-1 P2;
  - `I.emite` din `L.deschide` (~`:121`), pentru A26-2 (`extra`).
- **r28 Word:** DOAR `L.asistent` (~`:632-700`).
- **r27 Explorer, r29 Excel:** nimic.

Fiecare edit e mic, făcut cu Edit, iar înainte de el citești din nou zona. În raport le treci la „Fișiere comune atinse”.

## Ținta rundei 30, în ordinea asta
1. **N1 (`26/critic.md:99`):** după redenumirea pe desktop (Enter, Esc, nume gol, clic în afară), focusul revine pe rădăcină, ca la `deseneazaStart` (`windows.js:444`), iar pictograma rămâne selectată.
   - Cauza: `windows.js:195-223` (`deseneazaDesktop` rescrie `desk.innerHTML`; `termina` îl cheamă după Enter / Esc).
   - Proba:
     - Nou › Folder, „Teme”, Enter, apoi Delete → `mutare_in_cos`;
     - Nou › Folder, Esc, F2 → `redenumire_incepe`;
     - după ambele, tasta Windows → `deschide_start`.
2. **N2 (`26/critic.md:120`), cod comun în `gestTasta`.** Hotărârea orchestratorului: în aplicația care declară `I.tastaWindows` (și nu pe Mac), orice tastă apăsată cu Windows ținut (Spațiu, cifre, punct, Tab, săgeți), nu doar literele, e un gest `win_<tastă>`, cu mesajul central și Start închis.
   - Proba: Windows + Spațiu → un gest `win_*`, mesajul „Windows + Spațiu”, Start închis. La fel Windows + 1, punct, Tab, ↑.
   - Regresul: Ctrl+tastă pe Word, Excel, PowerPoint și Explorer dă exact aceleași evenimente ca înainte (ca la runda 26).
3. **W4: legarea Explorer-ului montat** (A22-1, cu A23-1 P1 + P2):
   - **Întâi A23-1:** aplici P1 și P2 din `runde/23/propunere_comun_A22-1.md` (textul exact și proba lui pe copie). Fără ele, gazda Windows primește și ea clicurile din Explorer.
   - **Apoi, în `windows.js`:** clicul pe dosarul galben din bara de activități (și Windows + E) deschide Explorer-ul bibliotecii montat într-o fereastră a shell-ului: `deschide('explorer', {loc, incadrat: true})`, documentat în api §1. Fereastra are bara de titlu a shell-ului, se minimizează, se readuce și se închide ca celelalte; la redesenarea gazdei, gazda pune înapoi `radacina` și cheamă `focus()`.
   - **Dependența:** banda Explorer (r27) repară întâi MINOR 4 (redesenarea gazdei salvează numele neterminat). Înainte de proba ta finală pe montare, citești `runde/27/stare_autor.md`: dacă are rândul `MINOR4_GATA`, proba include redenumirea în timpul redesenării; dacă nu, o treci în raport ca neverificată, fără să atingi `explorer.js`.
   - **A26-2, dacă îți ajunge timpul:** lărgești `I.emite` cu `extra` (un parametru, ca `emite` de la `:199`), iar Start se deschide la ridicarea tastei Windows, nu la apăsare. Clipirea dispare la Windows + E.
4. **MINOR „start_fundal”** (`windows.js:727`): clicul dreapta pe fundalul Start închide Start (ca clicul stâng) sau dă „Meniul Start”, nu ținta internă în mesaj.
5. **Unghiul aspect**, față de `referinte/uia_windows.json`:
   - bara de activități, Start (Fixate, „Toate”, căutarea), meniul desktopului, fereastra Explorer montată;
   - la 1366×768, la ±2 px acolo unde referința are dreptunghiuri; fonturile și pictogramele;
   - laptopul la 125 %, telefonul (360 / 390) și tabla SMART (1920×1080).
   Ce nu are referință: rând `R30-…` în `de_verificat.md`.
6. **Apoi**, cât îți ajunge contextul, MINOR-urile din `runde/26/critic.md` §6.

## Gata înseamnă
- `runde/30/proba_grav.py`: verificările picate la pornire și câte pică la final, pe gesturi reale (tastatură, `touchscreen.tap` la 360 și 390 px).
- Regresul: probele r26, r22 și r18; Ctrl+tastă pe celelalte 4 aplicații înainte și după `gestTasta`; Explorer deschis normal (cele 18 scenarii).
- `raport_constructor.md`: N1, N2, W4 fiecare ÎNCHIS cu dovada de azi sau NEÎNCHIS cu motivul. Secțiunea „Fișiere comune atinse”.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau, la ~200k de context, `PREDARE` în `stare_autor.md`.
