# Runda 14 · ținta (pasul 3)

Pornirea (`runde/14/masurare_pornire.json` = pasul 7 al rundei 13, 20.11 15:21-15:59, singur pe mașină):
O1 61 · O2 13392 · O3 26855 · O4 32 · O5 82 · O6 0 · O7 341 · O8 102 · O9 27 · porți 41 (toate pe cum_fac) · lacăt ok.
Măsurarea de pornire NU s-a refăcut (suplimentul orchestratorului).

Etapa B, aplicația powerpoint, ultima rundă a valului (6/6). Ținta = cele 4 GRAV deschise ale criticului 13 (au întâietate față de
formula (O3+O4+O8) × lecții), în ordinea pagubei pentru elev din `supliment_B_powerpoint_runda14.md`:
1. **T1** — tastatura în ferestre (Alt + litera din referință, Tab / Shift+Tab ținut în fereastră, focusul la deschiderea Font).
   Lecțiile: m1-l03 (:81 „Tastele Ctrl+N, Ctrl+O, Ctrl+S, F12, Esc”), m1-l03 drumul Ctrl+O › Browse, m2-l09 Insert Picture.
2. **T3** — fontul temei pe ecran (m2-l08:161, :167: „uită-te la forma literelor din titluri”).
3. **T2** — fila Shape Format din taste „Alt, J D, S F / S O / S O, W” (m1-l06:177 „Shape Outline ▾ → Weight → 3 pt”).
4. **T4** — Esc în modul tastelor de acces = `tasta_esc` (api_biblioteca.md:172), o singură reparație în codul comun.
5. Pregătirea unghiului `stare_finala_erori` (critic 13 §6-§7): literele cu o listă deschisă, clicul în caseta Font, `tastare` în
   casetele panglicii cu `dupa` ≠ `inainte`, ținta `zona_note` pe telefon, asistentul pe „Alt, H, S, F”, „Click to add notes”,
   adresa „Documente” în Open.
6. MINOR, doar dacă rămâne timp.

Numerele care contează pentru ținta numerică: O4 = 32 (PowerPoint: doar `note`, `stea-ctrl-c-v`, `tragere-forma` fără rezultat real)
— nu crește; O5 = 82 — se poate schimba doar din T1/T4, explicat; O3 = 26855 — nu scade, nu crește; O8 = 102, O9 = 27 — nu cresc.

## Fișierele rundei (doar acestea se modifică)
- `aplicatii/aplicatii.js` — codul comun: Alt + literă / Tab în ferestrele aplicațiilor care cer asta (PowerPoint), T4 în
  `tastaFaraClic`, asistentul (Esc din tastele de acces nu e greșeală). Word și Excel nu primesc cârligul de ferestre.
- `aplicatii/powerpoint.js`
- `aplicatii/aplicatii.css` — doar regulile `.lh-ap-p-*` (fontul temei; MINOR-urile PowerPoint)
- `_campaign/aplicatii_fidele_2026_11/de_verificat.md`, `de_aprobat.md`; notele din `runde/14/`
NU: word.js, excel.js (T4 se repară în `aplicatii.js` fără să le ating), lecțiile, jocurile, `jocuri/_motor/`, referințele,
oracolele, scenariile, `api_biblioteca.md`.
