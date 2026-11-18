# Valul B-word, după runda 3 — PLATOU (scris de orchestrator, 18.11.2026)

## Numerele întâi
| | pornire val (runda 1, înainte) | după runda 1 | după runda 2 | după runda 3 |
|---|---:|---:|---:|---:|
| O1 | 61 | 61 | 61 | 61 |
| O2 | 13392 | 13392 | 13392 | 13392 |
| O3 | 18546 | 18546 | 18546 | 18546 |
| O4 | 162 | 98 | 98 | 98 |
| O5 | 201 | 154 | 154 | 154 |
| O6 | 0 | 0 | 0 | 0 |
| O7 | 355 | 355 | 355 | 355 |
| O8 | 102 | 102 | 102 | 102 |
| O9 | 48 | 41 | 41 | 41 |
| porți | 42 | 41 | 41 | 41 (toate cum_fac; date_personale 0) |
| GRAV criticul rece | — | 6 | 5 | 4 |
| repere.lock | ok | ok (reînghețat de `acoperire` 19:36) | ok | ok |

`python D/opreste.py` după rândul 3 din `jurnal.jsonl`: **OPRESTE (PLATOU)** — „aceleași numere O1-O9 în rundele 1, 2, 3”.

## FĂCUT (cu dovada)
- Biblioteca `aplicatii/` (schelet + Word) construită și reparată în 3 runde; comisă local pe `fidelitate-aplicatii`
  (be0ae421, 0602069c, 206142ea, d3dfe36f). O4 162→98, O5 201→154, O9 48→41 (din runda 1); restul neschimbate.
- GRAV închise de critici (cu citat): runda 1 → 1, 2, 4, 5, 6 (criticul 2); runda 2 → N1, N2, N3 (criticul 3).
- Probele de gesturi ale constructorilor: `runde/2/proba_grav.py` 12/12; `runde/3/proba_grav.py` 17/19 picate → 2/19.

## NEFĂCUT
- **Publicarea pe proba**: niciuna; regula cere criticul fără GRAV. Deschise acum (4, `runde/3/critic.md`):
  GRAV 3 (lista Font Size; tastat în casetă după clic → „1120”), N4 (lecția m1-l03: Ctrl+W/✕, Recent, Documente,
  document pornit deja salvat, conținutul fișierului salvat), A1 (după alegerea PDF caseta arată tot .docx, `word.js:1053-1058`),
  A2 (Save As desenează goale „Documente” și antetele coloanelor, `panglica.js:229`, `:303`).
- **De ce platou**: oracolele înghețate nu conțin gesturile și suprafețele reparate (salvare, Enter în File name, Font Size,
  Ctrl+W/Ctrl+O, Save As, telefonul); restul Word din O4/O5/O9 e „fără referință” (scenarii fără rezultat real).
  GRAV 3 și N4 nu se pot închide fără referințe reale pentru: lista Font Size din panglică, fereastra „Save your changes…”,
  pagina Open/Recent, panoul stâng al Save As.

## Ce l-ar debloca
1. **O rundă `acoperire` pe Word** (agent separat de constructor, `runde/3/acoperire_prompt.md`): capturi UIA din Word-ul
   REAL pe desktopul ascuns (Ctrl+S pe document nou, Ctrl+W/✕ cu modificări, lista Font Size, File › Open, panoul Save As),
   scenarii reale noi pentru gesturile reparate, `api_biblioteca.md` §4 completat (`tasta_acces`, câmpul `activat`),
   bancul de mutanți reluat, `ingheata.py --acoperire`. Nu cere nimic de la Vasile.
2. De la Vasile (nu blochează 1): `D/de_aprobat.md` (A2-1), `D/de_verificat.md` (R1-R3), sesiunea Windows de 10 minute, proba omului.

## NESIGUR
- N3 (telefonul) e probat doar cu tastatura emulată prin CDP pe Chromium desktop (R3-9 în `de_verificat.md`).
- Office-ul de pe PC e ProPlus 2021 pe Current Channel, nu Microsoft 365 cu cont: fereastra „Save this file” (A2-1) poate să
  nu fie ce apare la Ctrl+S pe PC-ul real — runda `acoperire` o lămurește din aplicație.
