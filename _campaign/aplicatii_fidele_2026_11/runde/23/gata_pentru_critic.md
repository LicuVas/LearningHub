# Runda 23 (B-explorer, ciclul paralel C) · gata pentru criticul rece — unghiul stare_finala_erori

## Ce susține constructorul (de verificat, nu de crezut)
1. **N2 închis** (`19/critic.md:137`): în caseta de nume (F2 și Ctrl+Shift+N), adresă (F4) și căutare (Ctrl+E), F5, F3, F4, F6, F7,
   F10, F11, F12, Ctrl+R/P/S/L/E/F/D/H/J/O/U/G, Alt+← → ↑ Home, Ctrl+Shift+C / Delete au `defaultPrevented: true`; Ctrl+A/C/X/V/Z/Y,
   Ctrl+Shift+Z, Shift+săgeți, Home/End, Ctrl+←/→, Ctrl+Backspace/Delete rămân ale câmpului și lucrează; scrisul prin `input`
   (telefon) și compunerea (diacritice) neschimbate. Cod: `aplicatii.js:415-426`.
2. **Regresul N2** pe Word (Save As › File name), Excel (Name Box, editarea F2), PowerPoint (Font Size, textul din diapozitiv),
   Windows (căutarea din Start, redenumirea pictogramei): 0 diferențe în afară de `defaultPrevented` pe scurtăturile din câmp.
3. **N1 închis** (`19/critic.md:113`): la 1093×526 @1,25 mesajul „Acest PC” / „Proprietăți” e în pagină și deasupra; fereastra
   are 526 px, bara de stare e în pagină; la 1366×768 tot 640 px. Cod: `explorer.js:49`.
4. **G23-1** (GRAV nou al rundei): redenumirea cu `\ / : * ? " < > |` lasă numele neschimbat + mesajul central (înainte „a/b”
   pierdea fișierul). Cod: `explorer.js:508-511`. Celelalte 8 greșeli tipice: stare = ecran = eveniment.
5. **A22-1 parțial:** `deschide('explorer', {loc, incadrat: true})` — fără bară de titlu și Coș, umple corpul, `stare().titlu`,
   evenimentele oprite în rădăcină, supraviețuiește redesenării gazdei (re-atașarea `instanta.radacina` + `focus()`), §1.
   Declarat NEÎNCHIS: dublurile clicului la gazda Windows și `deschideSuprafata(cheie, nume)` — cod comun, propunere `propunere_comun_A22-1.md` (A23-1).
6. **O4:** 18/18 scenarii Explorer.

## Unde să te uiți
- Diff-ul: `git -C C:/00/Projects/LearningHub_fidel diff -- aplicatii/explorer.js` + hunk-ul N2 din `aplicatii.js` (`diff_runda23.patch`).
  Atenție: în `aplicatii.js`, `windows.js`, `word.js`, `excel.js` lucrează în paralel benzile r24 / r25 / r26; ale r23 sunt doar
  `aplicatii.js:415-426`, `explorer.js`, `api_biblioteca.md` §1 (`:38-41`) și §4 (`:191-194`).
- Probele: `runde/23/proba_grav.py` (secțiuni N2 N1 MONT SFE; `--radacina` pentru o copie), `runde/23/probe/regres_n2.py`,
  pagina de montare `runde/23/probe/montare.html?gazda=div|windows`.
- Referințele: `referinte/uia_explorer.json`, `referinte/scenarii_real/explorer_*.json`, `api_biblioteca.md` §4.
- Lecțiile pe drumul Explorer: v/m2-l09…l12, m2-l15, m5-l31, m5-l36, vi/m1-l03, vi/m3-l18, vii/m1-l03, jocuri/fisiere-v
  (runda nu le-a atins).

## Ce n-a făcut runda
- `masoara.py` întreg (orchestratorul), MINOR-urile din critic 19 / 15, capturile din aplicația reală (R23-1…5).

GATA_PENTRU_CRITIC
