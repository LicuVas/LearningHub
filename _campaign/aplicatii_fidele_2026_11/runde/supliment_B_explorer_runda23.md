# Supliment la promptul rundei 23 (valul B-explorer, a treia rundă; ciclul paralel C) — scris de orchestrator, 21.11.2026

Se citește DUPĂ `runde/23/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`.

În ciclul C, benzile sunt:
- r23 Explorer;
- r24 Word;
- r25 Excel;
- r26 Windows.

## Unde suntem
- **Runda 19** a închis E1 și E2: criticul rece 19 (`runde/19/critic.md`, unghiul gest_tastatura) le confirmă.
- **Criticul a găsit 2 GRAV noi**, N1 și N2.
- **Pornirea** e `runde/23/masurare_pornire.json` (măsurarea comună de la finalul ciclului B). Unghiul rundei: `stare_finala_erori`.

## Cine atinge ce din `aplicatii.js` în ciclul C (ca să nu vă călcați)
- **r23 (tu):** DOAR ascultătorul comun de `keydown`, condiția `preventDefault` (azi `aplicatii.js:407`, `!inCamp`).
- **r24 Word:** DOAR `L.asistent` (azi ~`:615-660`).
- **r26 Windows:** DOAR `gestTasta` / `litera` (azi ~`:261-279`, tasta Windows).

Fiecare edit e mic, făcut cu Edit, iar înainte de el citești din nou zona. În raport le treci la „Fișiere comune atinse”.

## Ținta rundei 23, în ordinea asta
1. **N2 (`19/critic.md:137`): scurtăturile aplicației nu se opresc în câmpurile de text.**
   - În caseta de redenumire, în adresă și în căutare, F5, Ctrl+R, Alt+← / → / ↑, Ctrl+P, Ctrl+L, Ctrl+E, F6, F10… ajung la browser. Într-un Chrome adevărat, F5 reîncarcă lecția și lucrul elevului se pierde.
   - Cauza: `aplicatii.js:407`. Condiția `!inCamp` scutește TOATE tastele din câmpuri.
   - Regula e în `api_biblioteca.md` §4: în câmpuri, DOAR tastele de editare rămân ale câmpului. Acestea sunt:
     - Ctrl+A / C / V / X / Z / Y;
     - Shift+săgeți, Home / End, Backspace / Delete;
     - Ctrl+← / → și Ctrl+Backspace pentru cuvinte.
   - Restul (F-uri, Alt+…, celelalte Ctrl+…) se opresc și cu focusul în câmp.
   - **Regres pe toate aplicațiile, pe câmpurile lor:**
     - Word: File name din Save As / Open, cu Ctrl+A / C / V și F12 / Ctrl+S;
     - Excel: editarea în celulă (F2, apoi Ctrl+A / C / V / Z / săgeți) și Name Box;
     - PowerPoint: textul din diapozitiv / casete;
     - Windows: caseta de căutare din Start.
     Tastarea normală, diacriticele și textul de pe telefon (evenimentul `input`) trebuie să meargă exact ca înainte.
2. **N1 (`19/critic.md:113`): pe fereastra mică (1366×657 la 125 %), mesajul central al Explorer-ului iese sub marginea ecranului.**
   - Cauza: înălțimea fixă de 640 px (`explorer.js:48-49`), iar mesajul e așezat față de josul ferestrei (`aplicatii.css:157`).
   - Repari în `explorer.js`: fereastra se încadrează în înălțimea disponibilă, cum fac celelalte aplicații. `aplicatii.css` doar dacă nu se poate altfel (comun → regres pe toate).
3. **A22-1 (`de_aprobat.md`, cerut de banda Windows): o opțiune de montare a Explorer-ului într-o fereastră străină.** De exemplu `deschide('explorer', {loc: <element>, incadrat: true})`, care:
   - nu-și desenează bara de titlu;
   - își oprește evenimentele în rădăcina ei (fără dublări la rădăcina care o găzduiește);
   - supraviețuiește când gazda își redesenează stratul ferestrelor, sau expune cum se remontează;
   - expune `stare()` cu titlul („Acasă” / calea);
   - îi dă lui `deschideSuprafata` aplicația cerută, nu prima vie.
   Documentezi opțiunea în `api_biblioteca.md` §1 (un rând sau două, comun, cu Edit). Legarea din `windows.js` o face banda Windows în ciclul următor; tu NU atingi `windows.js`. Probezi montarea pe o pagină de probă proprie (`runde/23/`), nu în poligon.
4. **Unghiul stare_finala_erori**, pe drumurile lecțiilor (v/m2-l09…l12, m2-l15, m5-l31, m5-l36, vi/m3-l18). Greșelile tipice:
   - redenumirea cu un nume care există deja;
   - nume cu semne interzise (`\ / : * ? " < > |`);
   - Esc în mijlocul redenumirii;
   - Nou › Folder de două ori („Folder nou (2)”);
   - Delete, apoi Ctrl+Z;
   - Ctrl+X, apoi Ctrl+V în același folder;
   - Ctrl+V fără nimic copiat;
   - Backspace la rădăcină;
   - căutarea fără rezultat, apoi Esc.
   După fiecare: `stare()` = ecranul = referința (scenariile `explorer_*`), evenimentul §4, asistentul §6.3. Ce nu e în referință: rând `R23-…`, comportament simplu și onest, plus mesajul central acolo unde nu e simulat.
5. **Apoi**, cât îți ajunge contextul, MINOR-urile din `runde/19/critic.md` și `runde/15/critic.md`.

## Gata înseamnă
- `runde/23/proba_grav.py`: verificările picate la pornire și câte pică la final, pe gesturi reale (inclusiv fereastra mică și telefonul).
- Cele 18 scenarii Explorer, tot 18 din 18.
- Regresul N2 pe toate aplicațiile (lista de la punctul 1), înainte și după.
- `raport_constructor.md`, cu secțiunea „Fișiere comune atinse”.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau, la ~200k de context, `PREDARE` în `stare_autor.md`.
