# Supliment la promptul rundei 20 (valul B-word redeschis `B-word#2`, a doua rundă; ciclul paralel B) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/20/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`. În ciclul B, benzile sunt r19 Explorer, r20 Word, r21 Excel, r22 Windows.

## Unde suntem
- **Runda 16** a reparat cele 8 GRAV din runda 5. Criticul rece 16 (`runde/16/critic.md`, unghiul gest_tastatura) le-a închis pe toate, iar T5 se potrivește cu Word real pe toate cele 12 comenzi.
- **Criticul a găsit 1 GRAV nou (K1).**
- **Pornirea** e `runde/20/masurare_pornire.json` (măsurarea comună de la finalul ciclului A). Unghiul rundei: `stare_finala_erori`.

## Ținta rundei 20, în ordinea asta
1. **K1** — Tab și Shift+Tab scot focusul din ferestrele Save As, Open, „Save this file” și „Save your changes”, iar după asta tastele nu mai fac nimic.
   - Drumul PDF din `lectii/vii/m1-l03` (`:192`, `:195`, `:269`), făcut cu Tab, salvează un .docx și pune un rând gol în document.
   - Cauza numită de critic: `word.js:1915` nu tratează Tab, iar cârligul comun din runda 14 (`aplicatii.js:473-530`, capcana Tab în ferestre) e opt-in, și Word nu-l folosește.
   - Ce faci: Word folosește cârligul comun, cum face PowerPoint (`powerpoint.js` e modelul, doar de citit). Nu schimbi cârligul.
   - Ordinea Tab din fiecare fereastră o iei din referință (`referinte/uia_word.json`, ferestrele de salvare / deschidere). Unde ordinea nu e în referință: ordinea vizuală + rând `R20-…`.
   - Drumul PDF cu Tab se duce la capăt.
2. **Unghiul stare_finala_erori**, pe drumurile cu fișiere din m1-l03 și din atelier:
   - salvare cu nume greșit, apoi corectare;
   - Cancel în Save As, apoi Ctrl+S;
   - Open pe fișierul greșit, apoi Ctrl+W › Don't Save;
   - Ctrl+Z după tastare și după formatare;
   - Esc în fiecare fereastră.
   După fiecare: `stare()` = ecranul = Word real (scenariile `word-*`), evenimentele §4, asistentul §6.3.
3. **Apoi**, cât îți ajunge contextul:
   - MINOR-urile din `runde/16/critic.md`, mai ales fereastra mică: butonul Save și lista Save as type ies sub marginea de jos până derulezi;
   - R16-1…R16-5, numai acolo unde găsești referință.

## Gata înseamnă
- `runde/20/proba_grav.py`: verificările picate la pornire și câte pică la final.
- Regresul Word: toate scenariile `word-*`, plus probele vechi (`runde/16/proba_grav.py`, `runde/5/…`).
- `raport_constructor.md`, cu secțiunea „Fișiere comune atinse”. Ar trebui să fie niciunul.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau `PREDARE` la ~200k de context.
