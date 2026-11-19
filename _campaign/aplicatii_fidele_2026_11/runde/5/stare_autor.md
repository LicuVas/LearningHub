# Runda 5 · constructorul · STAREA (nota de predare pentru un constructor proaspăt)

## Ce e gata
- Pașii 2-5: `cadru.md`, `tinta.md`, `contra.md`, `diferente.md` (D1-D15; citatul Microsoft pentru Ctrl+N / Ctrl+F12 /
  Shift+F12 verificat pe pagină la 19.11.2026), `de_verificat.md` (secțiunea RUNDA5-WORD: R5-1 … R5-6).
- Proba: `proba_grav.py` (18 cazuri, refolosește ajutoarele din `runde/4/proba_grav.py`; respectă `LH_SERVIT`).
  ÎNAINTE (worktree nereparat): **16 picate din 18** (`proba_grav_inainte.json`).
- Reparația: `repara_r5.py` (29 de înlocuiri exacte în `aplicatii/word.js` + un bloc CSS la capătul `aplicatii/aplicatii.css`).
  Probată pe o COPIE servită cu `LH_SERVIT` (în %TEMP%, scratchpad): **0 picate din 18**; regresul `runde/4/proba_grav.py`
  pe copie: 0 picate. Capturi verificate (fereastra Open cu Descărcări; Save As cu zona PDF + „Optimize for:”).
- Toate cele 7 GRAV au reparația scrisă: T6 (`activat` la Enter în listă), N4 + T4 (fereastra Open din `dialog.open`,
  Browse + Ctrl+F12, rânduri din conținut, panoul stâng cu folderele din conținut), T5 (Ctrl+N, Blank document, mesajul
  central fără document), T1 (F12 pe document salvat = numele fișierului), T2 (nume existent → mesaj central, fișier neatins),
  T3 (fereastra redesenată din `dialog.FileSaveAs_pdf`, Alt+E/A/M/O, bifa și radiourile). Plus Shift+F12 = Ctrl+S (D2b).

## Făcut după prima notă (19.11, ~02:20)
- Pornirea măsurată (`masurare_pornire.json`): O1=61, O2=13392, O3=20337, O4=101, O5=154, O6=0, O7=353, O8=102, O9=41;
  porți 41 (cum_fac 41, restul 0); lacăt ok; suma 34582 — identice cu runda 4 după.
- `repara_r5.py` aplicat pe worktree („aplicate: 29”, `node --check` ok; `git diff --stat`: 2 fișiere, +199 / −27).
- Pe worktree: `proba_grav.py` 0/18 picate (`proba_grav_dupa.json`); regres `runde/4/proba_grav`, `4/proba_telefon`,
  `3/proba_grav`, `2/proba_grav`: 0 picate (`regres_*.log`).
- Re-măsurarea întreagă pornită (`masurare_dupa.log`, `--compara masurare_pornire.json`). Rămân pașii 4-5 de mai jos.

**02:50: pașii 1-7 TERMINAȚI.** Re-măsurarea = pornirea (34582, niciun regres, lacăt ok); `raport_constructor.md` și
`gata_pentru_critic.md` scrise. Lista de mai jos e istoric.

## Ce urmează (în ordine)
1. Așteaptă să se termine măsurarea de pornire (`masoara.py --runda 5 --paralel 3`, pornită 01:40, ieșirea în
   `masurare_inainte.log` + `masurare.json`). NU scrie sub `aplicatii/` înainte.
2. Copiază `masurare.json` → `masurare_pornire.json`. Apoi `python runde/5/repara_r5.py` (fără argument = worktree-ul);
   trebuie să tipărească „aplicate: 29” și 0. `node --check aplicatii/word.js`.
3. `python runde/5/proba_grav.py --iesire runde/5/proba_grav_dupa.json` → 0. Regres pe worktree: `runde/4/proba_grav.py`,
   `runde/4/proba_telefon.py`, `runde/3/proba_grav.py`, `runde/2/proba_grav.py` (ultimele trei NU respectă `LH_SERVIT`,
   deci au rulat doar pe worktree-ul NEreparat: trebuie reluate după pasul 2).
4. Pasul 7: `masoara.py --runda 5 --paralel 3` întreg; orice oracol sau poartă crește față de `masurare_pornire.json` →
   `git -C <wt> restore aplicatii/word.js aplicatii/aplicatii.css` + `regres.md`.
5. `raport_constructor.md` + `gata_pentru_critic.md`. Fără commit, fără push.

## Fișierele rundei
`aplicatii/word.js`, `aplicatii/aplicatii.css` (prin `repara_r5.py`); notele din `runde/5/`, `de_verificat.md`.
Neatinse: lecțiile, jocurile, `jocuri/_motor/`, referințele, oracolele, `api_biblioteca.md`, `date/word.json`, `panglica.js`.
