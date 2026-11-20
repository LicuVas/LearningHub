
<!-- RUNDA20-WORD:START (scris de constructorul rundei 20, 21.11.2026 — GRAV K1 din runde/16/critic.md: Tab în ferestrele de fișiere; ce n-are referință) -->
## Runda 20 · Word · Tab, Enter, Space și Esc în ferestrele de fișiere — de lămurit (un minut fiecare)

Până la răspuns, simulatorul face ce scrie în paranteză.

- [ ] **R20-1** Word, **F12** (Save As), apoi **Ctrl+F12** (Open), **Ctrl+S** pe document nou („Save this file”) și **Ctrl+W** pe
  document modificat („Save your changes…”): `FocusedElement` (UI Automation) după fiecare Tab, de la File name până revine în
  File name, și după 8 × Shift+Tab. Ce ar închide rândul: lista ordonată a controalelor, pe fiecare fereastră. (Simulatorul: Tab nu
  iese niciodată din fereastră; ordinea = ordinea nodurilor din `uia_word.json`, prin cârligul comun `aplicatii.js › I.tabFereastra`
  — din File name: Save as type, Autori, Etichete, Titlu, Save Thumbnail, Hide Folders, Tools, Save, Cancel, apoi bara de adrese,
  căutarea, bara de unelte, butoanele barelor de derulare și capetele de coloană; lista „Vizualizare elemente” și panoul din stânga
  NU sunt opriri, pentru că cârligul comun nu oprește pe List / Tree. `runde/20/proba_grav_dupa.json › K1_ocol_*`.)
- [ ] **R20-2** Word, F12, Alt+T, Alt+↓ (lista Save as type deschisă), ↓ de două ori, apoi **Tab**: lista se închide? tipul din
  casetă rămâne cel vechi sau devine rândul marcat? unde e focusul? (Simulatorul: lista se închide, tipul rămâne cel vechi, focusul
  trece pe controlul următor.)
- [ ] **R20-3** Word, document salvat și modificat, **Ctrl+W** („Save your changes…”), apoi **Esc**: documentul rămâne deschis și
  nesalvat, ca la Cancel? Aceeași întrebare pentru Esc în „Save this file” (Ctrl+S pe document nou). Fereastra e desenată de Office,
  nu e `#32770`, deci regula Windows IDCANCEL nu e dovedită pentru ea. (Simulatorul: Esc = clicul pe Cancel — documentul rămâne
  deschis, `stare().dialog.apasat` = „Cancel”, evenimentul `tasta_esc` poartă `activat` = ținta lui Cancel.)
- [ ] **R20-4** Word, Save As / „Save your changes…”: Tab până la **Cancel** (sau **Don't Save**), apoi **Enter**; Tab până la
  Cancel, apoi **Space**: se apasă butonul cu focusul, nu Save? (Simulatorul: da — ca regula Windows „butonul cu focusul primește
  Enter”, folosită deja de PowerPoint, critic 13 › T1. Pentru ferestrele Office desenate de Word, regula e [presupus].)
<!-- RUNDA20-WORD:END -->
