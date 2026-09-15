# Raport — evaluator independent · Misiunea Reporter (audio-video-vii, VII-U2)

15.09.2026. Am citit tot jocul (7 pagini de citit, 35 de întrebări, 2 montaje) și l-am jucat ca un elev pe iPhone SE și Pixel 7, în tema luminoasă și în cea întunecată.

**Pe scurt:** jocul e corect la fond și bine legat de activitățile din proiectul unității. Toate cheile de răspuns sunt bune și nu am găsit nicio întrebare cu două variante corecte. Simulatorul de montaj a verificat corect în **46 din 46** de cazuri: acceptă soluțiile bune la care ajungi pe alt drum și respinge fiecare greșeală plantată. Semnalări: **0 blocante, 3 importante, 11 minore**. Am reparat 5 (2 importante, 3 minore). Poarta automată a trecut după reparații.

## Ce schimbă ora de mâine

Nimic nu blochează ora. Cele 3 lucruri care contează cel mai mult:
1. **S02 (reparat):** pagina spunea că „orice editor” are bibliotecă și previzualizare. Audacity, editorul audio din lecția LearningHub a unității, nu le are.
2. **S03 (reparat):** fraza „un fișier comprimat iar și iar sună tot mai rău” venea imediat după FLAC/ZIP, deci putea fi înțeleasă greșit. Acum spune explicit „comprimat cu pierderi”.
3. **S08 (de decis de profesor):** nivelul 3 (formate, comprimare, MB) și rezoluția nu apar în conținuturile programei pentru acest domeniu. În schimb, lipsesc deschiderea și închiderea proiectului, copierea și mutarea ca întrebări separate, precum și integrarea în prezentări (activitate a CS.3.2).

## Importante
- S02, S03: reparate (vezi `modificari.md`).
- S08: nepotrivirea cu programa, descrisă mai sus. Dovada e în `curriculum.json`, la domeniul „Aplicații de prelucrare audio-video”.

## Minore, grupate
- **Cifre și limbă (reparate):** S04 („de aproape zece ori” → raportul real e 11,0), S05 („Des,” → „Adesea,”), S01 (intro-ul spunea „clipuri adevărate”).
- **Simulator:** S09 (tăieturi exacte la secundă, fără toleranță; split-ul predat pe pagină nu se poate face în joc). S11 (enunțul spune „apasă pe clip”, dar clipul e deja selectat). S07 (pe ecranul de 320px, clipurile 1 și 4 apar amândouă ca „Ge…”).
- **Formulări:** S10 (match-ul „necomprimat” / „fără pierderi” se poate încurca la prima vedere). S12 (MOV nu apare pe pagină; două itemi de generic pot sta, după caz, în oricare generic; în hunt lipsește rolul „Montaj”). S13 (nuanța CC0 „cât permite legea”).
- **Pentru profesor:** S06 (nivelul 1 descrie doar editorul video; depinde ce aplicație audio folosește clasa). S14 (acordul pentru clipuri cu elevi minori).

## Ce am verificat și cum
- **Recalculat:** WAV stereo la calitate CD, 1 minut = 10.584.000 octeți (≈10,6 MB). MP3 la 128 kbps, 1 minut = 960.000 octeți (≈0,96 MB). Pagina („cam 10 MB”, „cam 1 MB”) e corectă. 1080p = 1920×1080 și 720p = 1280×720, aceleași valori ca în `lectia1-video-intro.html`.
- **Licențe, pe sursa primară** (curl pe creativecommons.org, textul salvat în `licente\`). CC0: „You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission”. CC BY 4.0: „You must give appropriate credit”. Cheia întrebării despre CC0 și afirmația de pe pagină sunt corecte.
- **Simulator** (`joaca.py`, rezultate în `joaca_rezultat.json`). Montajul 1: acceptă soluția-model și soluția ajunsă cu + apoi −. Respinge 1 s tăiat prea puțin sau prea mult la fiecare capăt, precum și clipul netăiat. Butonul „Arată-mi răspunsul” apare după 2 greșeli și pune pe pistă o soluție corectă. Montajul final: acceptă modelul, ordinea greșită reparată cu „Mai devreme”, dubla ratată pusă și apoi scoasă, clipul tăiat și apoi mutat. Respinge 9 variante greșite: ordinea din bibliotecă, dubla ratată inclusă, tăieturi cu ±1 s greșite, generic lipsă, titlu ciuntit, întrebarea și răspunsul inversate, clipuri netăiate. Zero erori JS; nimic nu iese din ecran.
- **Capturi** (`capturi\`): contrastul e bun în ambele teme. Suprapunerea barei de sus apare doar în capturile de pagină întreagă (vine din felul în care se face captura, nu e un defect).
- **Poarta:** `[TRECUT] audio-video-vii · întrebări jucate: 70 · diacritice/1000: 67.0`.

## Ce n-am putut verifica
- Etichetele reale ale butoanelor din editorul folosit în laborator (Clipchamp, Audacity etc.). Jocul formulează prudent și nu dă nume de butoane sau meniuri.
- Regula școlii pentru clipuri cu elevi (S14).
- Timpul real al unui copil de 13 ani pe tot jocul (nu am măsurat cu elevi).
