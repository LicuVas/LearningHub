# Runda 21 (B-excel#2, unghiul aspect), raportul constructorului — 21.11.2026

## Numerele (pornire → final)
| măsura | pornire | final | dovada |
|---|---:|---:|---|
| `proba_grav.py` (G17-1 ×13, G17-2 ×6, erori ×2) | **13 picate** (din 19 atinse; G1.12-G1.13 nici nu se pot juca: B1048570 nu e în DOM → excepție) | **0 picate din 21** | `proba_grav_inainte.log` (codul de azi, înainte de reparație) și `proba_grav_vechi.log` (același cod servit din `inainte/`, `LH_VECHI=1`: tot 13) → `proba_grav_dupa.log` |
| O4 doar pe `scenarii/excel` (64) | 57 ok, 12 unități | **57 ok, 12 unități**, aceleași rânduri RĂU (diff gol) | `probe_iesiri/o4_excel_pornire.log` → `probe_iesiri/o4_excel_final.log` (pe `excel.js` final; `o4_excel_lucru1.log` = la fel, rulat înaintea ultimei atingeri, cea a graficelor de departe) |
| celule în DOM după „5” în A1048576 | 78.000 | 3.900 | `G1.6` |
| antete de rând cu numărul tăiat (grila cu ≥ 1000 de rânduri) | 2001 | 0 | `G1.2`, `G1.5 › vazute.antete_taiate` |
| probele Excel vechi (regres: r17, r10, r9, r8, r7, r7_cont, r7_cont2, r6) | 0 · 0 · 0 · 0 · 2 · 0 · 3 · 0 (r17 la final + `runde/17/regres/regres_rezumat.txt`) | **0 · 0 · 0 · 0 · 2 · 0 · 3 · 0**, aceleași căderi X6 ×2 / X8 ×3 (cerute de probe mai vechi decât referința, `runde/10/critic.md:107-111`) | `regres.sh` → `regres/regres_rezumat.txt`, `regres/*.log` |

Pasul 7 complet (`masoara.py`) și O3 / O5 / O8 / O9 sunt ale orchestratorului.

## G17-1 — reparat (de mine pe probă; închiderea o dă criticul)
- **Ce era:** după Ctrl+↓ până la A1048576 grila rămânea albă (0 rânduri în zona grilei), tasta avea ținta `celula:A7`, „5” + Enter punea valoarea doar în stare, focusul cădea pe `BODY`, iar Ctrl+↑ / Ctrl+Home / ↑ nu mai emiteau nimic; după Enter, 78.000 de celule în DOM.
- **Ce am făcut (`excel.js`):**
  - **fereastra:** `intindere()` (`excel.js:1021`) întoarce acum și originea `r0` / `c0`. Grila normală rămâne exact cea dinainte (R0 = C0 = 0 dă formulele vechi). Când celula activă iese din ea, se desenează 150 de rânduri / 30 de coloane în jurul ei, cu numerele și literele adevărate; fereastra stă pe loc cât celula se mișcă în ea și se mută când iese;
  - **geometria** primește originea: `xCol`, `colLa`, `yRand`, `randLa`, `geomCol`, `geomRand` (`excel.js:964-1016`), buclele din `deseneazaGrila`, `dr` (zona care începe deasupra ferestrei se desenează de la marginea ei, `:1147`), antetele selectate, `celulaLa`, condiția de redesenare din `alege`;
  - **grila normală** se socotește doar din datele de pe ea (rândurile < 3000, coloanele < 300): o valoare în A1048576 nu o mai lungește la 3000 × 26;
  - **antetul rândurilor:** 26 px până la 3 cifre (ca referința, `uia_excel.json › zona_document`, DataItem „1” [1, 240, 26, 19]); peste, cât să încapă numărul (`latAntetRand`, `:973`). Lățimea lui Excel la 7 cifre nu e capturată → `de_verificat.md` R21-1;
  - **XFD:** în fereastra de la marginea foii, celula se aduce la stânga barei verticale desenate (`subBara`, `:1223`), ca în referință (Grid [1, 220, 1342, 493], bara Vertical [1346, 220, 17, 496]); pe grila normală `vedeCelula` e neschimbat;
  - **graficele** se desenează mutate cu deplasarea ferestrei (`OX`, `OY`); unul ancorat departe nu se vede și nu lungește derularea (`:2735`); inserarea în fereastră pune graficul în locul vizibil (`:2801`);
  - **plasă:** dacă celula activă tot n-ar fi desenată, caseta de intrare rămâne în grilă (focusul nu iese din aplicație).
- **Proba (`proba_grav_dupa.json`):** după Ctrl+↓ se văd 24 de rânduri (1048553…1048576), 480 de celule, celula activă încadrată jos, ținta `celula:A1048576` (G1.1-G1.3); „5” → ținta `celula:A1048576`; Enter → A1048576 = 5 în stare ȘI pe ecran, focusul în celulă (G1.4-G1.5); Ctrl+↑ → A7, ↑ → A1048575, Ctrl+Home → A1, fiecare cu evenimentul lui (G1.7-G1.9); Ctrl+→ → XFD7 întreagă, la stânga barei, Ctrl+← → C7 (G1.10-G1.11); clic pe B1048570 (G1.12); Clustered Column inserat în fereastră se vede acolo, iar după Ctrl+Home grila are iar 760 px de derulat (G1.13). Capturile: `proba/g1_ctrl_jos.png`, `g1_ctrl_jos_tastat.png`, `g1_ctrl_dreapta.png` (și `*_vechi.png` = codul dinainte).

## G17-2 — reparat (de mine pe probă)
- **Ce era:** la 375×667, degetul pus pe C7 și tras derula grila, iar celula activă devenea C7 fără niciun eveniment; pe B7 tras în sus, selecția B6:B7 fără eveniment.
- **Ce am făcut (`excel.js`, doar aici):** `I.la.jos` (`:2998-3009`): când apăsarea vine de la deget (`pointerType === 'touch'`) pe o celulă sau pe un antet al grilei, nu se alege nimic (nici graficul nu se deselectează); restul vechii funcții a devenit `josGrila` (`:3010`). La atingerea scurtă (ridicare fără tragere), `aplicatii.js` cheamă `I.la.clic` ca la orice clic; acolo `josGrila` face exact ce făcea apăsarea, iar evenimentul e `clic / selectare_celula` (`:3125`). Când browserul preia derularea (`pointercancel`), nu s-a schimbat nimic. Mouse-ul și creionul rămân neschimbate.
- **De ce nu în `aplicatii.js`:** cauza era alegerea făcută la apăsare (în `excel.js`); `touch-action:none` pe grilă (calea criticului) ar fi oprit derularea cu degetul pe 375 px, unde tabelul nu încape (`contra.md`).
- **Proba:** atingere A1 → `clic / selectare_celula / celula:A1` (G2.1); degetul pe C7 tras stânga-sus → grila derulată (scrollLeft 0 → 154), celula activă rămâne A1, 0 evenimente (G2.2); degetul pe B7 tras în sus → derulare, C6 rămâne (G2.3); atingere pe C9 după derulare → C9 cu evenimentul ei (G2.4); B3 + „10” (tastatura telefonului) + Enter → B3 = 10, ținta `celula:B3` (G2.5); dubla atingere → `clic, clic, dublu_clic` (G2.6).

## §6.3 — NU l-am atins: textul nu e limpede pentru caz → `de_aprobat.md` A21-1
Cele trei citiri (literală „sau” → pasul se face la prima literă; codul de azi → indiciu după a doua literă scrisă corect; propunerea criticului) sunt în `contra.md` › §6.3 și în A21-1. Nicio lecție nu pornește azi un asistent cu `asteapta`.

## Unghiul aspect, MINOR-urile criticului 17
- Reparate pe drum: numărul rândului tăiat (2001 antete la grila de 3000 de rânduri), XFD sub bara verticală.
- **MINOR 2 (listele la +3 / +4 px):** neatins. Lista se pune la distanța din referință față de BUTONUL ei desenat (`listaRef`, `excel.js:2179`), deci abaterea e a butonului (geometria panglicii, cod comun `panglica.js`), sub pragul de 8 px. A o muta separat ar dezlipi lista de buton.
- MINOR 1 (ținta lui Ctrl+Z / Alt cu graficul ales) e pe unghiul evenimente, nu aspect; MINOR 3 (telefon, cifrele din C sub grafic după o tragere) rămâne.

## Fișiere comune atinse
**Niciunul.** `aplicatii.js`, `aplicatii.css`, `panglica.js`, `stare.js`, `poligon.html`, `setari.json`, `versiune.json` — neatinse de mine. `git status` arată `aplicatii.js` modificat: e munca benzii Explorer (r19, mesajul „nesimulat”, ~217-248), nu a mea (copia mea din `inainte/aplicatii.js` = HEAD). Deci regresul pe Word / PowerPoint / Explorer / Windows nu e cerut de schimbarea mea; probele mele Excel au rulat CU schimbarea r19 pe disc.

## Fișierele rundei
- `aplicatii/excel.js` (copia: `inainte/excel.js`; diff-ul: `excel_js.diff`, 16 bucăți);
- `de_verificat.md` (blocul RUNDA21-EXCEL: R21-1…R21-4 + nota despre A17-1), `de_aprobat.md` (blocul RUNDA21-EXCEL: A21-1); copiile în `inainte/`;
- `runde/21/`: cadru, tinta, contra, diferente, `proba_grav.py` + `proba/h21.py` (cu `LH_VECHI=1`), `regres.sh`, jurnalele, capturile.

## NEFĂCUT / NESIGUR
- **R21-1…R21-4** [NEVERIFICAT]: ecranul lui Excel la A1048576 / XFD7 (câte rânduri, lățimea antetului la 7 cifre), rotița peste fereastră (simulatorul urcă doar 150 de rânduri; tastele merg), Ctrl+Shift+↓ după ultimul bloc (neschimbat), degetul pe grilă în Excel pe ecran tactil (cere o tabletă → Vasile).
- **A21-1** (de aprobat de Vasile): §6.3.
- **A17-1** se rezolvă prin fereastră (celula se vede); îl închide orchestratorul după criticul 21.
- O3 / O5 / O8 / O9 și porțile nu le-am rulat (pasul 7 al orchestratorului).
