# Supliment la promptul rundei 19 (valul B-explorer, a doua rundă de construcție; ciclul paralel B) — scris de orchestrator, 20.11.2026

Se citește DUPĂ `runde/19/prompt.md`. Regulile ciclului paralel (`runde/_paralel/CICLU_PARALEL.md`) rămân în vigoare: fișiere proprii/comune, fără git care scrie, fără `masoara.py` întreg, `LH_IESIRE`. În ciclul B, benzile sunt r19 Explorer, r20 Word, r21 Excel, r22 Windows.

## Unde suntem
- **Runda 15** a construit File Explorer în bibliotecă (`runde/15/raport_constructor.md`; commit 1d4c5a3f): 18 din 18 scenarii, iar fereastra și cele 6 meniuri corespund referinței la ±2 px.
- **Criticul rece 15** (`runde/15/critic.md`, unghiul aspect) a găsit **2 GRAV**, cu proba și cauza.
- **Pornirea** e `runde/19/masurare_pornire.json` (măsurarea comună de la finalul ciclului A). Unghiul rundei: `gest_tastatura`.

## Ținta rundei 19, în ordinea asta
1. **E1 (R12, „nu tace”)** — mesajul „aici nu e simulată” dispare în aceeași milisecundă, pe 9 gesturi din 9 (clicul pe „Acest PC” din `v/m2-l09`, Proprietăți …).
   - Cauza numită de critic: `aplicatii.js:229` pune mesajul în rădăcina aplicației, iar redesenarea din `explorer.js:409` o rescrie.
   - **Tu repari și partea COMUNĂ, pentru toate aplicațiile.** Mesajul central trebuie să supraviețuiască redesenării oricărei aplicații (de ex. un strat separat de rădăcina redesenată).
   - Banda Windows (r22) are aceeași problemă posibilă (W3). Știe că reparația comună e a ta și nu atinge `aplicatii.js:229`.
   - Regres pe mesajul central la Word, Excel, PowerPoint și Windows (câte 2 gesturi nesimulate fiecare: mesajul apare, rămâne vizibil cât cere api-ul, are `data-lh-nesimulat`).
2. **E2 (I1, telefon)** — la atingere, caseta de redenumire se închide singură, așa că drumul `v/m2-l10` nu se poate duce la capăt pe telefon.
   - Cauza numită: `explorer.js:419` închide redenumirea pe `blur`, iar după atingere browserul mută focusul.
   - Redenumirea trebuie să meargă pe telefon: Nou › Folder → numele scris → Enter / atingere în afară. La fel „Redenumire” din bara de comenzi și F2.
   - Comportamentul real e în scenariile `explorer_redenumire_*` și `explorer_folder_nou*`.
3. **Unghiul gest_tastatura**, pe drumurile lecțiilor:
   - săgețile în conținut, Enter = deschidere, Backspace / Alt+← = înapoi, Alt+↑ = folderul părinte;
   - F2, Delete, Shift+Delete, Ctrl+C / X / V / Z / A, Ctrl+Shift+N;
   - F4 / Ctrl+L pe bara de adrese, Ctrl+E / F pe căutare;
   - Tab între zone (panoul de navigare, conținutul).
   La fiecare: evenimentul §4, starea, ecranul. Ce nu e în referință: rând `R19-…`.
4. **Apoi**, cât îți ajunge contextul:
   - MINOR-urile din `runde/15/critic.md`;
   - Proprietăți simulat din datele generate, dacă e ieftin (nu e cerut de lecții).

## Gata înseamnă
- `runde/19/proba_grav.py`: verificările picate la pornire și câte pică la final, pe gesturi reale (inclusiv telefon cu `page.touchscreen`).
- Scenariile Explorer: tot 18 din 18.
- `raport_constructor.md`, cu secțiunea „Fișiere comune atinse”.
- Ultima linie din `gata_pentru_critic.md`: `GATA_PENTRU_CRITIC`. Sau `PREDARE` la ~200k de context.
