# Supliment la promptul rundei 28 (valul B-word redeschis `B-word#3`; ciclul paralel D) — scris de orchestrator, 21.11.2026

Se citește DUPĂ `runde/28/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii / comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`.

În ciclul D, benzile sunt:
- r27 Explorer;
- r28 Word;
- r29 Excel;
- r30 Windows.

## Unde suntem
- **Criticii 20 și 24** au dat GRAV 0: Word e la a doua rundă la rând fără GRAV.
- **Valul `B-word#2` s-a oprit pe PLATOU** după ciclul C. Runda `acoperire` Office (`runde/26/acoperire_office.md`) a refăcut referințele și scenariile `word-*` găsite greșite (R24-1, R24-2), iar valul se redeschide ca `B-word#3`.
- **Pornirea** e `runde/28/masurare_pornire.json`. Unghiul rundei: `gest_tastatura`.

## Zona înghețată: `api_biblioteca.md` NU se editează
- Fișierul e în `repere.lock`. În ciclul C un edit al lui a rupt lacătul și a oprit măsurarea comună.
- Textul nou pentru §6.3 îl scrii în `runde/28/api_propunere.md` (rândul vechi, rândul nou, de ce). Îl aplică o rundă `acoperire`.

## Cine atinge ce din `aplicatii.js` în ciclul D
- **r28 (tu):** DOAR `L.asistent` (azi ~`:632-700`).
- **r30 Windows:** DOAR `gestTasta` (~`:266-290`), `leagaGesturi` › `pointerdown` (~`:328`), `L.deschideSuprafata` (~`:187-192`) și `I.emite` din `L.deschide` (~`:121`).
- **r27 Explorer, r29 Excel:** nimic.

Fiecare edit e mic, făcut cu Edit, iar înainte de el citești din nou zona. În raport le treci la „Fișiere comune atinse”.

## Ținta rundei 28, în ordinea asta
0. **Cele două rânduri `word-*` rămase în O4 după runda de acoperire** (`runde/26/acoperire_office.md`; O4 total 28 → 15). Amândouă sunt acum defecte ale simulatorului, cu real nou jucat pe Word:
   - **`word-imagine-inserare` neexecutabil:** meniul Pictures din `word.js` (~`:1664`) are eticheta „This Device”, iar Word real (UI Automation) are „This Device...” (A26O-3). Eticheta și ținta urmează referința (`referinte/uia_word.json` / `referinte/scenarii_real/word-imagine-inserare.json`); rândul deschide fereastra Insert Picture.
   - **`word-copiere-lipire`, 1 diferență:** la lipire, Word real pune singur spațiul dintre cuvinte (Smart Cut and Paste), iar simulatorul nu. Te uiți în `referinte/scenarii_real/word-copiere-lipire.json` și `word-decupare-lipire.json` la textul exact de după lipire și faci la fel, fără să strici decuparea (care dă acum 0).
   - Proba: O4 pe `word-*` înainte și după (cu `LH_IESIRE` al tău), plus scenariile `word-*` care treceau.
1. **Asistentul comun (`L.asistent`), trei reguli cerute de criticii 24 și 26.** Toate țin de același principiu: indiciul vine după greșeli adevărate, nu pe drumul bun.
   - **a) Un eveniment `nesimulat` sau refuzat nu face pasul** (critic 24, MINOR 4): Save bifat la salvarea refuzată (nume interzis; „already exists” + Save pe drumul `m1-l03:157`).
   - **b) Alt+↓ care deschide lista dintr-o fereastră nu e greșeală** (critic 24, MINOR 5), la fel ca `mutare_focus`.
   - **c) Tastarea într-un câmp de text nu e greșeală** când pasul nu o așteaptă (critic 26, „Găsit pe drum”): azi, pe Windows, fiecare literă scrisă în caseta din Start e numărată greșeală, iar indiciul apare pe drumul bun după două litere. Un pas cu `asteapta` hotărăște singur, ca înainte.
   - **Regresul**, pe Word, Excel, PowerPoint, Explorer și Windows:
     - o greșeală adevărată (clic în gol) tot cheamă indiciul după 2;
     - O9 înainte și după, pe aceleași cazuri;
     - proba r24 (asistentul) și drumul K2 al Windows-ului („Windows, pai, Enter”).
2. **MINOR 2 al criticului 24:** pe laptopul la 125 %, lista Save as type se desenează la mărimea întreagă peste fereastra micșorată. Cauza: `word.js` › `listaRef` (`:1326`, `root.appendChild` la ~`:1343`). Se micșorează cu același `kMic` (`word.js:1112-1113`).
3. **MINOR 1 al criticului 24:** casetele Font și Font Size, cu butoanele lor ▾, la +3 / +3 px față de referință.
4. **Unghiul gest_tastatura** pe Word, pe drumurile lecțiilor (`lectii/vii/m1-l03`, lecțiile Word din v-viii):
   - săgețile, Ctrl / Shift / Ctrl+Shift + săgeți, Home / End, Ctrl+Home / End, PgUp / PgDn;
   - Enter, Tab, Backspace, Delete, Ctrl+Backspace;
   - Ctrl+Z / Y / C / X / V / A / B / I / U / S, F12, Ctrl+O, Ctrl+N;
   - KeyTips (Alt, literele) pe comenzile din lecții, Esc în KeyTips;
   - tastele în ferestrele de fișiere (Tab, Alt+literă, Alt+↓, Enter, Esc).
   Pe fiecare: evenimentul §4, starea, ecranul, comparate cu scenariile `word-*` și cu referințele. Ce nu are referință: rând `R28-…` în `de_verificat.md`.
5. **Apoi**, cât îți ajunge contextul, celelalte MINOR-uri din `runde/24/critic.md` și `runde/20/critic.md`.

## Gata înseamnă
- `runde/28/proba_grav.py`: verificările picate la pornire și câte pică la final, pe gesturi reale.
- Regresul: probele 24, 20, 16; scenariile `word-*` (O4); asistentul pe 5 aplicații.
- `raport_constructor.md`, cu secțiunea „Fișiere comune atinse” (`L.asistent`) și `runde/28/api_propunere.md` pentru §6.3.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau, la ~200k de context, `PREDARE` în `stare_autor.md`.
