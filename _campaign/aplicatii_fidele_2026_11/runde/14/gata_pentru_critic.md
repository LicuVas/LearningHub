# Runda 14 · gata pentru critic (unde e ce, ce gesturi s-au reparat)

Worktree `C:/00/Projects/LearningHub_fidel`, ramura `fidelitate-aplicatii`, pornire e3300ec9, NECOMIS (diff-ul rundei:
`git -C C:/00/Projects/LearningHub_fidel diff -- aplicatii`). Fișierele schimbate sub `aplicatii/`: `aplicatii.js` (codul comun),
`powerpoint.js`, `aplicatii.css`. word.js și excel.js NEATINSE.

## Gesturile reparate (toate cu taste / mouse / atingere adevărate în `runde/14/proba_grav.py`)
- **T1, ferestrele PowerPoint** (Open din Ctrl+O › Browse, Save your changes din Ctrl+W, Insert Picture din Alt, N, P, D, Save As din
  F12, Font și Paragraph din lansatoarele Home): Alt + litera din referință (`__nod.ta`) apasă butonul / mută focusul în câmp, cu un
  eveniment `tasta_acces`; Alt + o literă fără potrivire = `tasta_acces / fara_efect`; Tab / Shift+Tab circulă în fereastră (40 de
  Tab-uri în Open: focusul mereu în `dialog.FileOpen`); Enter pe butonul cu focus îl apasă, Enter în rest = butonul implicit; Font /
  Paragraph se deschid cu focusul în primul câmp. Codul: aplicatii.js:485-552 (cârlig opt-in `I.la.fereastra`), powerpoint.js:985-1003,
  :2072-2077, :2132-2149, :2245.
- **T3, fontul temei**: aplicatii.css:369 / :372 (Calibri / 'Calibri Light', rezerva Carlito), powerpoint.js:435-440 (`stivaFont`).
- **T2, Shape Format din taste**: powerpoint.js:686-689 (insigna „JD”), :2310-2330 (listele deschise din taste, fila deja activă).
- **T4, Esc în modul tastelor de acces = `tasta_esc`** în PowerPoint, Word, Excel: aplicatii.js:235-240, :463-468; asistentul :628-630.
- **Punctul 5**: literele cu o listă / un meniu deschis (powerpoint.js:2131, `la.text` / `la.sterge`); clicul în caseta Font alege tot
  (:1640-1650); `stare().caseta_activa` (:247, :393-397); ținta `zona_note` (:400-403); H pe Home activă = navigare (:2315-2322);
  zona de note goală fără text (:546); adresa „Documente” în Open (:1176-1199).

## Probele și ieșirile
- `runde/14/proba_grav.py` → `proba_grav_inainte.json` (e3300ec9, git archive în %TEMP%) / `proba_grav_dupa.json` (worktree).
- Regresul: `runde/14/regres.sh` → `regres_rezumat.txt` + `regres_*.log`.
- Măsurarea: `runde/14/masurare.json` (pasul 7), comparată cu `masurare_pornire.json`.

## Ce NU s-a atins (și unde scrie de ce)
- MINOR din critic 12 / 13 (listele +3 px, „Pov”, x = −26, zonele < 32 px, fila „Fill”): `raport_constructor.md` › NEFĂCUT.
- [FARA_REFERINTA] din critic 13 §6, afară de punctul 5: `diferente.md` › B; de_verificat R13-* / R14-*.
- Abateri propuse lui Vasile: `de_aprobat.md` A14-1 (Alt + literă = `tasta_acces`), A14-2 (`caseta_activa`), A14-3 (asistentul și Esc).
