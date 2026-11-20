# Runda 13 · raportul constructorilor (B-powerpoint, unghiul gest_tastatura)

Constructorul 1 (bucățile 1-4, punct de control 6751b1f6) + constructorul 2 (pasul 0, bucățile 5-7, proba, regresul, pasul 7).

## Numerele (pasul 7 față de `runde/13/masurare_pornire.json`)
| oracol | înainte (`masurare_pornire.json`) | după (pasul 7, `masurare.json`) |
|---|---|---|
| O1 | 61 | 61 |
| O2 | 13392 | 13392 |
| O3 | 26855 | 26855 |
| O4 | 50 | 32 |
| O5 | 82 | 82 |
| O6 | 0 | 0 |
| O7 | 341 | 341 |
| O8 | 102 | 102 |
| O9 | 27 | 27 |
| porți | 43 | 41 |

Porțile după: test_joc=0, controale_taiate=0, cum_fac=41, fereastra_mica=0, date_personale=0, word2007_j2=0 (controale_taiate 2 → 0: depășirile de timp de la pornire nu s-au mai repetat).
Pasul 7 pornit la 15:21:26, singur pe mașină, după ultima scriere sub `aplicatii/` (15:10:06); terminat 15:59:07 (2261 s). Lacăt ok, 0 neconcludente, O6 concludent (966 s), „regres față de 13/masurare_pornire.json: niciunul”. Log: `runde/13/masurare_pas7.log`.

## Proba rundei și regresul
- `runde/13/proba_grav.py` (gesturi reale, mouse / atingere / tastatură, headless, doar 127.0.0.1): worktree **48/48**
  (`proba_grav_dupa.json`); pornirea rundei 7ab108fe **4/38** (`proba_grav_inainte.json`: 34 picate, 5 secțiuni se opresc la mijloc
  fiindcă listele / ferestrele nu existau).
- Regresul (`regres_rezumat_c2.txt`): 11/proba_powerpoint 0 · Word 5 / 4 / 4-telefon / 3 / 2 = 0 · Excel 10 / 9 / 8 / 7-cont / 6 = 0 ·
  7/proba_grav 2 și 7/proba_grav_cont2 3 = aceleași verificări ca înainte (runde/8/diferente.md D14, D18; comparate pe nume) ·
  12/proba_grav 1 din 49 = „ce se vede la 360 px e la fel ca la 552ac0c5”: cu zona de note închisă capturile sunt identice la pixel
  (0 pixeli ×4, `pas0_telefon.json`); diferența e zona de note deschisă la pornire, cerută de `c_note.ShowNotes_la_pornire = true`.

## FĂCUT / NEFĂCUT / NESIGUR
| GRAV | stare | dovada |
|---|---|---|
| P4 (clicul pe formă, Ctrl+C / V, Delete, `start` cu forme / fonturi / fișiere) | FĂCUT | proba „P4 M/K” 4/4; `powerpoint-stea-ctrl-c-v` rămâne în O4 (fără rezultat real) |
| P3 (Blank Presentation, Ctrl+O › Browse, Open din `start.fisiere`) | FĂCUT | proba „P3 M/K” 4/4; scenariile `blank-presentation`, `ctrl-o-browse` trec |
| A1 (Shapes ▾) | FĂCUT | proba „A1” 5/5: sub buton (y 159), 10 titluri, 190 de `title`, desene diferite, Action Buttons atinse după rotiță, Alt, N, S H + săgeți + Esc, fereastra mică |
| A2 (paletele) | FĂCUT | proba „A2” 5/5: Theme Colors 32 / Standard Colors 35 px, 70 `title`, Dark Blue → #002060, Alt, H, F C + ↓ ↓ ↓ + Enter, 6 palete cu același cod |
| A3 (Format Background / Animation Pane pe ecran mic) | FĂCUT | proba „A3” 7/7: 1093×526 (rotița), 360×740 și 390×844 (degetul, CDP), Apply to All atins în centru → toate #00B0F0; Move Up; la 1366×768 locul din referință |
| A4 (listele, notele, vederile) | FĂCUT | proba „A4 M/K” 13/13; `powerpoint-note` rămâne în O4 (fără rezultat real) |
| MINOR (critic 12 §7) | FĂCUT în parte | durate Push / Wipe, imaginea pe Two Content, Font Color Red, „Slide 1 of 0”, Solid fill bifat, Play From, rânduri 22 / 22, panourile la y 218, Shapes sub buton, fără ▾ la More Colors, titlurile Office Theme / 1x1 Table, „Save your changes” cu bara goală — proba „MINOR” 7/7 |
| MINOR rămase | NEFĂCUT | +3 px ale listelor (cod comun cu Word / Excel), zonele ≥ 32 px în grile de 24 px (imposibil fără să se schimbe ce se vede), fereastra „Save your changes” la x = −26 pe 360 px, „Pov”, miniaturile Layout, fila „Fill” — motivele în `diferente.md` |
| Tastatura în panoul lateral | NESIGUR | cum ajunge focusul în panou (F6?) nu e capturat; panoul merge cu mouse / deget |
| Presupuneri noi | NESIGUR | `de_verificat.md` R13-1 … R13-17 (desenul formelor, legendele, titlurile grupurilor, KeyTips cu lista deschisă, Enter pe formă, indicatorul gol, întrebarea în corp, R13-4 caseta Font păstrată) |

## Scenariile PowerPoint
PowerPoint pe poligon: 38 din 41 scenarii trec (`runde/13/iesiri/O4/oracol_comportament.json`).
Trec: powerpoint-animatie-fly-in, powerpoint-animatie-start, powerpoint-animatii-move-up, powerpoint-aspect-title-only, powerpoint-background-styles, powerpoint-blank-presentation, powerpoint-bold-text, powerpoint-ctrl-c-v-caseta, powerpoint-ctrl-m, powerpoint-ctrl-n, powerpoint-ctrl-o-browse, powerpoint-ctrl-w-modificat, powerpoint-ctrl-z-diapozitiv-nou, powerpoint-delete-diapozitiv, powerpoint-diapozitiv-nou-buton, powerpoint-dublare-diapozitiv, powerpoint-durata-aplica-la-toate, powerpoint-durata-fade, powerpoint-durata-push, powerpoint-durata-wipe, powerpoint-font-color-titlu, powerpoint-font-titlu, powerpoint-fundal-aplica-la-toate, powerpoint-imagine-two-content, powerpoint-imagine, powerpoint-mareste-font, powerpoint-sageata-dreapta, powerpoint-salvare-ca, powerpoint-shape-fill, powerpoint-slide-sorter-normal, powerpoint-slide-sorter, powerpoint-tabel, powerpoint-tastare-titlu, powerpoint-tema-ion, powerpoint-tranzitie-aplica-la-toate, powerpoint-tranzitie-fade, powerpoint-two-content-layout, powerpoint-two-content-new-slide.
Nu trec (3): powerpoint-note (fara_real, 0 diferențe); powerpoint-stea-ctrl-c-v (fara_real, 0 diferențe); powerpoint-tragere-forma (fara_real, 0 diferențe) — explicate în `diferente.md` (fără rezultat real probat).

## Fișierele create sau schimbate în runda 13
- `aplicatii/powerpoint.js`, `aplicatii/aplicatii.css` (doar `.lh-ap-powerpoint …` / `.lh-ap-p-…`), `aplicatii/date/powerpoint.json`
  (regenerat), `aplicatii/_unelte/genereaza_powerpoint.py` (+3 rânduri) — `git diff --stat 7ab108fe -- aplicatii/` mai jos.
- `de_verificat.md` (R13-1 … R13-17).
- `runde/13/`: cadru.md, tinta.md, contra.md, diferente.md, stare_autor.md, raport_constructor.md, gata_pentru_critic.md, o4_ppt.py,
  h.py, proba_grav.py, proba_grav_*.json, pas0_telefon.py / .json, regres_predare.sh, regres_c2.sh, regres_rezumat*.txt,
  masurare*.json / .log, pas7_pornit.txt.
Față de începutul rundei (7ab108fe):
```
 aplicatii/_unelte/genereaza_powerpoint.py |   3 +
 aplicatii/aplicatii.css                   |  28 +-
 aplicatii/date/powerpoint.json            |   2 +-
 aplicatii/powerpoint.js                   | 641 ++++++++++++++++++++++++++++--
 4 files changed, 631 insertions(+), 43 deletions(-)
```

## Abaterile păstrate
- R13-4: clicul în caseta Font deschide lista (scenariul `powerpoint-font-titlu` apasă centrul casetei, UIA Expand pe real).
- R13-15: Esc cu o listă deschisă din taste de acces închide lista (necapturat).
- Căderea din `runde/12/proba_grav.py` (1 / 49): zona de note deschisă la pornire (voită, din referință).

> Golurile pentru numere, scenarii și diffstat completate de orchestrator (20.11 16:25) din `masurare.json`, `iesiri/O4/oracol_comportament.json` și `git diff --stat`: constructorul 2 a căzut pe o eroare de rețea după pasul 7, înainte să le scrie.
