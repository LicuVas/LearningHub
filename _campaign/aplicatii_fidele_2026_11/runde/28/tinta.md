# Ținta rundei 28

Scrisă de orchestrator în `runde/supliment_B_word_runda28.md` (GRAV-urile criticului au întâietate: criticii 20 și 24 au dat GRAV 0 pe Word).

## Numerele care au ales-o (măsurate de mine la pornire)
| măsura | pornire | unde |
|---|---|---|
| O4 doar `word-*` (64 scenarii) | **10** (ultima linie): 2 defecte ale simulatorului (`word-copiere-lipire` 1 diferență, `word-imagine-inserare` neexecutabil) + 8 „fără real” / neexecutabile pe care nu le poate juca nimeni invizibil (font-size-tastat ×2, tragere-selectie, word2007 ×4) | `probe_iesiri/O4w_inainte/rele.txt` |
| O9 (toate aplicațiile) | **13** (F_lectie ×5, paint ×8) | `probe_iesiri/O9_inainte/rele.txt` |
| `proba_grav.py` (cod de la pornire, `LH_R28_INAINTE=1`) | **17 picate / 36** | `proba_grav_inainte.log` |

Lecțiile pe drum: `vii/m1-l04` + `jocuri/word-obiecte-vii` (scenariul imaginii, `lectii` din scenariu), `vii/m1-l03` (salvarea, „already exists”, PDF), K2 al Windows-ului („Windows, pai, Enter”).

## Ordinea
0. O4: „This Device...” (word.js, meniul Pictures) și spațiul la lipire (word.js › lipeste).
1. `L.asistent`: refuzul nu face pasul; Alt+↓ fără schimbare de stare nu e greșeală; tastarea într-un câmp nu e greșeală.
2. MINOR 2 (critic 24): lista Save as type micșorată cu `kMic`.
3. MINOR 1 (critic 24): casetele Font / Font Size.
4. Unghiul gest_tastatura pe drumurile lecțiilor: tastele de acces pe Pictures; Ctrl+Backspace / Ctrl+Delete / Ctrl+↑/↓ (pagina Microsoft); restul tastelor fie au scenariu `word-*` care trece (O4), fie merg în `de_verificat.md`.

## Fișierele rundei (doar acestea se modifică)
- proprii: `aplicatii/word.js`; dosarul `runde/28/`;
- comun, doar zona dată de supliment: `aplicatii/aplicatii.js` › `L.asistent` (și constantele de lângă el);
- adăugări în blocurile `RUNDA28-WORD` din `de_verificat.md` / `de_aprobat.md`;
- `api_biblioteca.md` NU (înghețat): textul pentru §6.3 în `runde/28/api_propunere.md`.
