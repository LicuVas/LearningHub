# Harta acoperirii — Misiunea Reporter (audio-video-vii), VII-U2, lecțiile 11–17

Evaluator independent, 15.09.2026. Citit integral `jocuri\audio-video-vii\index.html` (320 de rânduri, 7 niveluri, 35 de întrebări, 2 simulatoare „montaj”).
Legendă: C = corect la fond · 1 = o singură variantă corectă · K = cheia se potrivește · W = why explică de ce · 13 = limbaj potrivit la 13 ani.
Coloana „verificat cum”: citit / recalculat / comparat cu X / sursă / executat (Playwright, `joaca.py`).

## Ancora în programă

| element | ce afirmă | verificat cum | problemă? |
|---|---|---|---|
| unitate VII-U2, titlu, CS.1.2 + CS.3.2, lecțiile 11–17 | ancora | comparat cu `unitati.json` | nu |
| acoperirea conținuturilor (`curriculum.json`, domeniul „Aplicații de prelucrare audio-video”) | interfață, gestionare proiect, înregistrare/redare, mixare, selecție ștergere/copiere/mutare, tranziții, coloană sonoră, generice | comparat cu lista de 8 conținuturi | da → S08 (formate/comprimare/rezoluție = peste programă; deschidere/închidere și copierea nu sunt exersate) |
| activitățile de învățare (proiectul unității, `activitati_lectii_VII_VIII.json`) | 20 s de voce, curățarea înregistrării, voce inteligibilă peste muzică, tăietură simplă vs tranziții, generic cu nume/rol/sursă, interviu în echipe | comparat | nu (bine prinse: ordinul de 20 s, lizibilitatea, sursele în generic) |

## Intro, bandă, diplomă

| element | ce afirmă | verificat cum | problemă? |
|---|---|---|---|
| intro | 7 niveluri; „tai și ordonezi clipuri adevărate” | citit + executat (clipurile sunt liste de secunde, nu video) | da → S01, REPARAT |
| banda | linie de timp decorativă | captură lumină/întuneric | nu |
| diploma: titlu, rezumat, aplicație „editorul audio-video de la clasă” | formulare neutră, fără nume de program | citit | nu |
| provocarea 1–5 | acord coleg, ordine + tăieri, muzică liberă încet + fade out, generice, salvează proiect + exportă `Nume_Prenume_interviu.mp4` | citit; comparat cu nivelurile | minor → S14 (acordul pt. publicare la minori) |

## Nivelul 1 — Pe linia de timp (lecția 11)

| element | ce afirmă/cere | verificat cum | problemă? |
|---|---|---|---|
| pagina | editorul curge stânga→dreapta; „în orice editor găsești patru zone”; cursorul de redare | citit; comparat cu lecția LearningHub `lectia4-audio.html` (Audacity: nu are bibliotecă de materiale și nici fereastră de previzualizare) | da → S02, REPARAT |
| Î1 choice: ce arată linia de timp → „Ordinea în timp a clipurilor și a sunetelor” | C 1 K W 13 | citit | nu |
| Î2 match: 4 zone ↔ rol | perechi univoce | citit | nu |
| Î3 tf: clip mai la dreapta = mai devreme → Fals | C K W | citit | nu |
| Î4 classify video/audio: filmare→V, muzică→A, fotografie→V, voce→A, aplauze→A | C K; why dă motivul (volum separat) | citit | nu |
| Î5 choice: secunda 12 → duci cursorul | C 1 K W | citit | nu |

## Nivelul 2 — Proiectul și microfonul (lecția 12)

| element | ce afirmă/cere | verificat cum | problemă? |
|---|---|---|---|
| pagina | proiect ≠ film; export dă .mp4/.mp3; ● ■ ▶; forma de undă; loc liniștit | citit; comparat cu `lectia4-audio.html` (Record/Stop/Play, mixdown) | nu |
| Î1 choice: continui mâine → salvezi proiectul | C 1 K W | citit | nu |
| Î2 tf: export = salvare → Fals | C K W | citit | nu |
| Î3 order: loc liniștit → ● → vorbești → ■ → ▶ | ordine unică | citit | nu |
| Î4 choice: undă plată → microfonul a prins puțin sunet | C 1 K W | citit | nu |
| Î5 choice: ventilator → reînregistrezi | C 1 K W (explică de ce volumul crește și zgomotul) | citit | nu |

## Nivelul 3 — Formate și comprimare (în afara listei de conținuturi, vezi S08)

| element | ce afirmă/cere | verificat cum | problemă? |
|---|---|---|---|
| pagina: WAV stereo 1 min ≈ 10 MB | 44 100 × 16 × 2 × 60 / 8 = 10 584 000 octeți = 10,58 MB (10,09 MiB) | recalculat | nu |
| pagina: MP3 „calitate obișnuită” 1 min ≈ 1 MB | 128 000 × 60 / 8 = 960 000 octeți = 0,96 MB | recalculat | nu |
| pagina: MP4 = imagine + sunet, de obicei cu pierderi; FLAC/ZIP fără pierderi, identic bit cu bit | definiții corecte (FLAC redă exact eșantioanele PCM) | citit + cunoaștere de domeniu | nu |
| pagina: „De aceea, un fișier comprimat iar și iar sună tot mai rău” | vine imediat după fraza despre FLAC/ZIP; pentru fără pierderi e fals | citit + captură | da → S03, REPARAT |
| Î1 tf: MP3 păstrează tot → Fals; why „de aproape zece ori mai mic” | raportul real 10,584/0,96 = 11,0, deci „aproape zece” (sub 10) e greșit | recalculat | da → S04, REPARAT |
| Î2 classify: mp3/wav/flac = sunet; mp4/mov = imagine+sunet | C K W | citit | nu (MOV nu apare pe pagină → S12 minor) |
| Î3 choice: păstrezi vocea pt. editare → WAV (MP3, JPG, DOCX) | C 1 (FLAC, tot corect, nu e printre variante) K W | citit | nu |
| Î4 choice: MP3 recomprimat de 5 ori → tot mai rău, ireversibil | C 1 K W | citit | nu |
| Î5 match: fără pierderi / cu pierderi / necomprimat | cheie corectă, dar „Păstrează tot” se potrivește la citire rapidă și la „fără pierderi” | citit | minor → S10 |

## Nivelul 4 — Tai, șterg, mut (lecția 13, partea 1)

| element | ce afirmă/cere | verificat cum | problemă? |
|---|---|---|---|
| pagina | selecție, split, trim, ștergere (gol sau lipire), mutare/copiere, Ctrl+X/C/V, Ctrl+Z | citit; formulare prudentă („în multe editoare”) | nu |
| Î1 choice: primele 3 s → scurtarea de la capete | C 1 K W | citit | nu |
| Î2 tf: split șterge → Fals | C K W | citit | nu |
| Î3 montaj „Răspunsul Mariei” (12 s: x 0–3, ok 3–10, x 10–12; soluție: tai 3 de la început, 2 de la sfârșit) | acceptă modelul și varianta ajunsă prin + apoi −; respinge s2, s4, e1, e3, netăiat; „Arată-mi răspunsul” după 2 greșeli pune o soluție fără probleme | executat pe iPhone SE + Pixel 7 (9 cazuri × 2) | minor → S11 (enunțul spune „apasă pe clip”, dar e deja selectat), S09 (fără toleranță, split nu e exersat) |
| Î4 choice: gol după ștergere → ecran negru și liniște | C 1 K W; premisa („rămâne un gol”) e dată în enunț | citit | nu |
| Î5 classify: poză între părți→split; 2 s neclare→trim; clip mișcat→ștergere; 3 s podea→trim | C K W | citit | nu |

## Nivelul 5 — Mixajul (lecția 13, partea 2)

| element | ce afirmă/cere | verificat cum | problemă? |
|---|---|---|---|
| pagina | mixare, volum per pistă, fade in/out, licență liberă, CC0 „nu cere nimic” | citit; CC0 pe sursă primară (curl creativecommons.org: „You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission”) | nu |
| Î1 choice: muzica acoperă vocea → scazi volumul muzicii | C 1 K W | citit | nu |
| Î2 match: mixare, fade in, fade out, pistă audio | C K W | citit | nu |
| Î3 tf: gratuit = voie oricum → Fals | C K W; CC BY cere credit (curl deed BY 4.0: „You must give appropriate credit”) | sursă | nu |
| Î4 choice: muzică oprită brusc → fade out | C 1 K W | citit | nu |
| Î5 choice: CC0 → fără voie și fără atribuire obligatorie; why „autorul a renunțat la drepturile lui” | C 1 K; deed: „waiving all of his or her rights … to the extent allowed by law” | sursă | minor → S13 (nuanța „cât permite legea” + cine a pus CC0 poate să nu fie autorul) |

## Nivelul 6 — Scene, tranziții, generice (lecțiile 14–15)

| element | ce afirmă/cere | verificat cum | problemă? |
|---|---|---|---|
| pagina | scenă, tranziție/dizolvare, cu măsură; „Des, tăietura simplă e cea mai bună”; coloana sonoră pe pistă separată; genericul, contrast | citit; comparat cu `lectia3-text-efecte.html` (aceeași regulă „mai puține tranziții”) | da → S05 (limbă: „Des,” ca adverb la început sună stângaci), REPARAT |
| Î1 choice: șase tranziții → cu măsură | C 1 K W | citit | nu |
| Î2 classify generic început/final | cheia e cea uzuală; „Tema interviului” și „Mulțumiri” pot sta, la unii, și în celălalt generic | citit | minor → S12 |
| Î3 hunt: „???” și „de pe internet” | cele 2 fragmente marcate sunt greșeli reale; rolul „Montaj” (cerut în nivelul 7) lipsește, dar o lipsă nu se poate „apăsa” | citit | minor → S12 |
| Î4 tf: muzica peste scene pe pistă separată → Adevărat | C K W | citit | nu |
| Î5 choice: titlu alb pe cer alb → culoare contrastantă | C 1 K W | citit | nu |

## Nivelul 7 (final) — Interviul clasei (lecția 16)

| element | ce afirmă/cere | verificat cum | problemă? |
|---|---|---|---|
| pagina | scenariu, acord, filmare, montaj, export .mp4; 1080p = 1920×1080 | citit; comparat cu `lectia1-video-intro.html` (aceleași valori) și cu activitatea din programă „realizarea unui montaj audio-video pe baza unui scenariu” | nu |
| Î1 choice: format pt. oricine → MP4 | C 1 K W | citit | nu |
| Î2 order: scenariu → filmare → montaj → export → prezentare | ordine unică; „Prezentați clipul clasei” nu e pe pagină, dar e evident ultimul | citit | minor → S12 |
| Î3 montaj final (5 clipuri: titlu 4 s, întrebare 8 s cu 2 s glas dres, răspuns 14 s cu 3 s ușă, final 5 s, dublă ratată 6 s) | acceptă: modelul, ordinea greșită reparată cu „Mai devreme”, dubla pusă apoi scoasă, tăiat apoi mutat; respinge: ordinea din bibliotecă, dubla inclusă, tăieri cu 1 s prea puțin/prea mult, lipsă genericul de final, titlu ciuntit, întrebare/răspuns inversate, netăiat | executat (13 cazuri × 2 telefoane) | nu (vizual → S07: pe 320px pistele 1 și 4 apar ambele „Ge…”) |
| Î4 choice: 1080p vs 720p → mai mulți pixeli, fișier mai mare | C 1 K; 1280×720 corect | citit | nu |
| Î5 tf: publici fără acord → Fals | C K W (dreptul la propria imagine) | citit | nu |

## Ce am jucat (Trecerea 2)

- `joaca.py`: 46 de cazuri pe iPhone SE + Pixel 7, 0 abateri; zero erori JS; lățimea paginii la montajul final = lățimea ecranului (320/412 px).
- Greșeli de copil la `choice`: două variante greșite → apare „Răspunsul corect”.
- Capturi în `capturi\` (luminos: citire N1/N3/N5, montaje; întunecat: montaj 1, montaj final, pagina de formate). Contrastul e bun în ambele teme. Bara de sus apare suprapusă peste întrebare doar în capturile `full_page` (artefact al capturii pe bară fixă, nu defect al paginii).
- Poarta după reparații: `[TRECUT] audio-video-vii · întrebări jucate: 70 · diacritice/1000: 67.0`.
