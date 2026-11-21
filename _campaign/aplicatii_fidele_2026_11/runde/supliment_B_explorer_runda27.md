# Supliment la promptul rundei 27 (valul B-explorer redeschis `B-explorer#2`; ciclul paralel D) — scris de orchestrator, 21.11.2026

Se citește DUPĂ `runde/27/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii / comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`.

În ciclul D, benzile sunt:
- r27 Explorer;
- r28 Word;
- r29 Excel;
- r30 Windows.

## Unde suntem
- **Criticul rece 23** (`runde/23/critic.md`, unghiul stare_finala_erori) a dat GRAV 0: N1, N2 și G23-1 sunt închise.
- **Valul `B-explorer` s-a oprit pe PLATOU** după ciclul C: oracolele globale au rămas pe aceleași numere trei cicluri la rând. Runda `acoperire` Office din `runde/26/acoperire_office.md` a fost deblocatorul, iar valul se redeschide ca `B-explorer#2`.
- **Pornirea** e `runde/27/masurare_pornire.json` (măsurarea rundei de acoperire). Unghiul rundei: `aspect`.

## Zona înghețată: `api_biblioteca.md` NU se editează
- Fișierul e în `repere.lock`. În ciclul C un edit al lui a rupt lacătul și a oprit măsurarea comună.
- Textul nou pentru api îl scrii în `runde/27/api_propunere.md` (secțiunea, rândul vechi, rândul nou). Îl aplică o rundă `acoperire`.

## Cine atinge ce din `aplicatii.js` în ciclul D
- **r27 (tu): nimic.** Ce ai nevoie din codul comun scrii ca cerere în `de_aprobat.md` (`A27-n`), cu patch-ul într-un fișier al tău.
- **r28 Word:** DOAR `L.asistent` (azi ~`:632-700`).
- **r30 Windows:** DOAR `gestTasta` (~`:266-290`), `leagaGesturi` › `pointerdown` (~`:328`), `L.deschideSuprafata` (~`:187-192`) și `I.emite` din `L.deschide` (~`:121`).

## Ținta rundei 27, în ordinea asta
1. **MINOR 4 al criticului 23, ÎNTÂI** (`explorer.js:430-439`): redesenarea gazdei salvează numele neterminat din caseta de redenumire.
   - Banda Windows (r30) leagă în ciclul acesta Explorer-ul montat în fereastra ei, iar MINOR 4 trebuie închis înainte.
   - Ce cere: după `redeseneaza()` cu redenumirea deschisă, caseta rămâne deschisă cu textul ei, și niciun nume nu se schimbă până la Enter.
   - Proba: `runde/23/critic_probe/c_mont.py` › `redesen_in_redenumire`.
   - **Când e gata, scrii în `runde/27/stare_autor.md` un rând care începe cu `MINOR4_GATA`.** Banda r30 îl citește.
2. **MINOR 1:** meniurile mai înalte decât fereastra (Nou, meniul clasic) se pot derula sau încap. Proba: `runde/23/critic_probe/a_n1b.py`, cu 0 rânduri neapăsabile.
3. **MINOR 2:** Ctrl+Z în căutare. Caseta nu se mai redesenează la fiecare literă.
4. **Unghiul aspect**, pe drumurile lecțiilor (v/m2-l09…l12, m2-l15, m5-l31, m5-l36, vi/m3-l18), față de `referinte/uia_explorer.json`:
   - fereastra, bara de comenzi, panoul de navigare, lista în vederile din lecții, bara de stare;
   - meniurile Nou, Sortare, Vizualizare și meniul contextual, la ±2 px acolo unde referința are dreptunghiuri;
   - fonturile și pictogramele;
   - laptopul la 125 % (1366×657), telefonul (360-390 px) și tabla SMART (1920×1080).
   Ce nu are referință: rând `R27-…` în `de_verificat.md`.
5. **Apoi**, cât îți ajunge contextul, celelalte MINOR-uri din `runde/23/critic.md` și `runde/19/critic.md`.

## Gata înseamnă
- `runde/27/proba_grav.py`: verificările picate la pornire și câte pică la final, pe gesturi reale.
- Regresul: cele 18 scenarii Explorer (O4), proba r23, montarea `incadrat: true` (`c_mont.py`).
- `raport_constructor.md`, cu secțiunea „Fișiere comune atinse” (așteptat: niciunul).
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau, la ~200k de context, `PREDARE` în `stare_autor.md`.
