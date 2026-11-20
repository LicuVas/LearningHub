# Supliment la promptul rundei 21 (valul B-excel redeschis `B-excel#2`, a doua rundă; ciclul paralel B) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/21/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`. În ciclul B, benzile sunt r19 Explorer, r20 Word, r21 Excel, r22 Windows.

## Unde suntem
- **Runda 17** a reparat X10, A1 și T1 (`runde/17/raport_constructor.md`).
- **Criticul rece 17** (`runde/17/critic.md`, unghiul stare_finala_erori) le-a închis pe toate trei. A găsit **2 GRAV noi**, cu proba și cauza.
- **Pornirea** e `runde/21/masurare_pornire.json`, adică măsurarea comună de la finalul ciclului A. Unghiul rundei: `aspect`.

## Ținta rundei 21, în ordinea asta
1. **G17-1** (adus de runda 17). După Ctrl+↓ până la A1048576:
   - **Ce se întâmplă acum:** grila rămâne albă; ce scrie elevul intră în stare, dar nu apare pe ecran; focusul iese din aplicație; Ctrl+↑, Ctrl+Home și ↑ nu mai emit nimic.
   - **Cauza:** `excel.js:1005-1015` (`intindere`).
   - **Ce trebuie să facă:** ca în Excel real (scenariile `excel-ctrl-jos-ultimul-rand`, `excel-ctrl-dreapta-ultima-coloana`). Grila arată rândurile din jurul celulei active (randare „virtuală”, fără 1.048.576 de rânduri în DOM), celula activă se vede, focusul rămâne în grilă, iar drumul înapoi (Ctrl+↑, Ctrl+Home, ↑) merge.
   - A17-1 din `de_aprobat.md` se rezolvă odată cu el: celula trebuie să se vadă.
2. **G17-2.** Pe telefon, când degetul derulează grila, celula activă se mută fără niciun eveniment §4.
   - **Cauza numită:** lipsește `touch-action` pe grilă, iar `aplicatii.js` nu ascultă `pointercancel`.
   - Derularea cu degetul nu trebuie să mute celula activă (ca în Excel pe ecran tactil). Atingerea scurtă o mută, cu evenimentul ei.
   - `aplicatii.js` e COMUN: dacă îl atingi, schimbarea e păzită și faci regres pe telefon la Word, PowerPoint, Explorer și Windows (2-3 drumuri fiecare).
3. **Asistentul §6.3** (`runde/17/critic.md`, secțiunea D). `aplicatii.js:627-628` numără literele ca greșeli, iar asta se abate de la textul §6.3 („…sau `asteapta`”).
   - Îl repari doar dacă textul §6.3 din `api_biblioteca.md` e limpede.
   - Dacă nu e limpede: rând `A21-…` în `de_aprobat.md` cu cele două citiri, și nu-l atingi.
   - Cod comun: regres pe asistent la toate aplicațiile.
4. **Apoi**, cât îți ajunge contextul, MINOR-urile din `runde/17/critic.md`, pe unghiul aspect: graficul, galeriile și listele de la +px față de referință.

## Gata înseamnă
- `runde/21/proba_grav.py`: verificările picate la pornire și câte pică la final.
- Regresul Excel: toate scenariile `excel-*` (O4 pe Excel ≤ cât era la pornire).
- `raport_constructor.md`, cu secțiunea „Fișiere comune atinse”.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau, la ~200k de context, `PREDARE` în `stare_autor.md`.
