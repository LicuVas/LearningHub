# Runda 13 · gata pentru critic (B-powerpoint, unghiul gest_tastatura)

Tot ce s-a schimbat e în `aplicatii/powerpoint.js`, `aplicatii/aplicatii.css` (doar reguli `.lh-ap-powerpoint …` și `.lh-ap-p-…`),
`aplicatii/date/powerpoint.json` (regenerat) și `aplicatii/_unelte/genereaza_powerpoint.py` (+3 rânduri). Diff-ul rundei:
`git -C C:/00/Projects/LearningHub_fidel diff 7ab108fe -- aplicatii/` (constructorul 1 până la 6751b1f6, constructorul 2 după).
Proba: `python runde/13/proba_grav.py` (secțiuni; `--doar a3,a1`; `--inainte` = pornirea 7ab108fe; `--ref <sha>`).

## Ce gesturi s-au reparat — mouse (M), atingere (T), tastatură (K)
| GRAV | unde în cod | M / T | K |
|---|---|---|---|
| P4 clicul pe formă | `I.la.jos` › `obiect`; `.lh-ap-p-fig` + SVG `pointer-events` | clic în mijlocul stelei = obiect; pe chenar în afara desenului = nimic | Ctrl+C → miniatura 2 → Ctrl+V; Delete pe forma aleasă |
| P4 `start` | `diaPornire()` (forme, fonturi, note), `M.fisiere` | — | — |
| A4 Font ▾ | `listaFont`, `puneFont`, `fontAfisat` | Font ▾ › Calibri Light (Headings) | Alt, H, F F + nume + Enter; Alt+↓; ↓ / Enter / Esc în listă |
| A4 Start ▾ | `PORNIRI`, caseta Start | Start ▾ › After Previous | ↑ / ↓ + Enter în listă |
| A4 Shape Fill / Outline / Weight | `aplicaUmplere`, `aplicaContur` | Yellow; Weight ▸ 3 pt; Orange | Esc închide lista; Alt, H, S F |
| A4 Background Styles | `stilFundal` | Style 6 → #E9E7E7 pe toate | ↓ / Enter în listă |
| A4 notele / vederile | `notaEl`, `comutaNote`, `seteazaVedere`, `baraStare` | zona de note + scris; Notes; Slide Sorter / Normal / Reading View / Slide Show | Esc iese din Reading View / Slide Show; F5 |
| P3 fișierele | `prezentareNoua`, `deschideOpen`, `deschideFisier` | File › New › Blank Presentation; dublu clic în Open | Ctrl+O › Browse, nume + Enter; Esc închide Open |
| A3 panourile pe ecran mic | `potrivestePanou()` (din `panouLateral`, `variantaFundal`, ResizeObserver) | rotița derulează conținutul FB; Apply to All atins în centru (1093×526, 360×740, 390×844); Animation Pane: rândul 2 → Move Up | — (focusul în panou nu e capturat, vezi diferente.md) |
| A1 Shapes ▾ | `OPT.la` (titlurile grupurilor, `desenForma`, `title`, Action Buttons), `listaRef` (sub buton, derulabilă) | Arrow: Right găsit după titlul „Block Arrows”, desen și nume la hover; rotița până la Action Buttons | Alt, N, S H; ↓ ↓; Esc |
| A2 paletele | `OPT.la` (`paleta`: același cod pentru 6 palete, `title`, fără ▾ la More Colors / Eyedropper) | Dark Blue (cu nume la hover) → #002060 | Alt, H, F C; ↓ ↓ ↓ + Enter; Esc închide lista (R13-15) |
| MINOR | `actualizeazaPanglica` (Font Color Red, indicator), `randuriAnimatii` (Play From, 22 / 22), `variantaFundal` (Solid fill bifat), `OPT.la` (Save your changes) | vezi `diferente.md` D19-D23 | Ctrl+W → Save your changes, Esc |

## Unde sunt probele și ieșirile
- `runde/13/proba_grav.py` → `proba_grav_dupa.json` (worktree), `proba_grav_inainte.json` (7ab108fe); logurile `proba_c2_*.log`.
- Pasul 0: `runde/13/pas0_telefon.py` / `.json` (căderea din `runde/12/proba_grav.py` = zona de note deschisă la pornire).
- Regresul: `runde/13/regres_c2.sh` → `regres_rezumat_c2.txt`, logurile `regres_c2_*.log`.
- Presupunerile: `de_verificat.md` R13-1 … R13-17. Diferențele și ce rămâne: `runde/13/diferente.md`.
