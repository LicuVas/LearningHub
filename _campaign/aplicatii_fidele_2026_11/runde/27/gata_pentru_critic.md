# Runda 27 (B-explorer#2) · gata pentru criticul rece

- **Unghiul:** aspect (iar ținta suplimentului a cerut întâi MINOR 4, 1, 2 ale criticului 23, judecate pe gest + stare finală).
- **Diff-ul rundei:** doar `aplicatii/explorer.js` (copia de dinainte: `runde/27/inainte/explorer.js`), plus blocul `RUNDA27-EXPLORER` adăugat la sfârșitul lui `de_verificat.md`. `aplicatii.js` e schimbat în worktree de benzile r28 / r30, nu de r27.
- **Ce susțin** (de dărâmat de critic):
  1. MINOR 4: la `redeseneaza()` a gazdei cu redenumirea deschisă, caseta rămâne cu textul ei, niciun nume nu se schimbă, niciun eveniment §4 nu pleacă; Enter confirmă numele întreg, Esc anulează; fără `focus()` de la gazdă, caseta rămâne, iar clicul pe alt rând o confirmă. (`proba_grav.py M4`, `probe/c_mont27.py`)
  2. G27-1: după clicul pe alt rând care confirmă o redenumire, tastele (Delete, Ctrl+Z) ajung la Explorer. (`proba_grav.py REG`)
  3. MINOR 2: Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z lucrează în căutare, iar lista și bara de stare urmează textul. Pasul de anulare e literă cu literă (R27-3). (`proba_grav.py M2`)
  4. MINOR 1: fără cod; toate rândurile meniurilor înalte se apasă după derularea cu rotița. Cu degetul: nedovedit headless (R27-2). (`proba_grav.py M1`)
  5. Aspect: 141 de dreptunghiuri la ±2 px față de `date/explorer.json` (= referința); singura abatere rămasă e lățimea panoului de navigare (R27-1). (`probe/aspect27.py`)
  6. Regresul: O4 Explorer 18/18; `d_regres27` fără deosebiri de evenimente / stare / ecran (doar ceasul mesajului central); montarea (`c_mont27`): 0 pixeli diferiți pe 6 cadre față de `inainte`.
- **Unde să lovească criticul:** blur-urile fără element-țintă (clic pe un loc nefocusabil, fereastra browserului părăsită, telefonul E2), ordinea confirmare / clic acum că hotărârea se ia într-un microtask; căutarea cu meniu / dialog deschis; telefonul (insertText în căutare filtrează acum).
- **Probele:** `runde/27/proba_grav.py [M4 M1 M2 REG] [--inainte]`, `runde/27/probe/{aspect27,c_mont27,d_regres27}.py`; ieșirile în `runde/27/probe_iesiri/`.
- **Rapoarte:** `raport_constructor.md`, `diferente.md`, `cadru.md`, `tinta.md`, `contra.md`, `api_propunere.md`.

GATA_PENTRU_CRITIC
