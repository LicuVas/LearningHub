# Runda 2 · etapa B · Word — ȚINTA (pasul 3)

## Numerele de la pornire (pasul 1, `masoara.py --runda 2 --paralel 3`, `iesiri/*/iesire.log`)
O1=61 · O2=13392 · O3=18546 · O4=98 · O5=154 · O6=0 · O7=355 · O8=102 · O9=41 (identice cu „după runda 1”).
Porțile (`masurare_pornire.json`): 41 = cum_fac 41; test_joc 0, controale_taiate 0, fereastra_mica 0, date_personale 0, word2007_j2 0.

## De ce ținta NU e formula (O3+O4+O8) × lecții
Promptul și suplimentul: GRAV-urile deschise ale criticului au ÎNTÂIETATE. Criticul rundei 1 a dat 6 GRAV, toate pe calea
tastaturii din Word (biblioteca). Formula alege o suprafață după O3/O4/O8, care în etapa B măsoară încă lecțiile nemutate
(O3/O8 nu văd biblioteca până la etapa C), deci n-ar fi ales nimic din ce a găsit criticul.
Proba celor 6 pe codul de pornire: `runde/2/proba_grav.py` → **11 cazuri picate din 12** (`proba_grav_inainte.json`).

## Ținta = cele 6 GRAV din `runde/1/critic.md`, în ordinea suplimentului
1. Compunerea pe telefon dublează literele (D1) · 2. Tastele ajung în document cu Backstage / dialog deschis (D3, D4) ·
3. Font Size: tastat + Enter, Alt, H, F S (D5; lista ▾ = D6, fără referință) · 4. Ctrl+S pe document nou (D7) ·
5. Tastele de acces fabrică `dublu_clic` și indiciu prea devreme (D8) · 6. Majuscula automată pe telefon (D2).
„Gata” pentru fiecare = cazul lui din `proba_grav.py` trece (pașii criticului, gesturi reale pe poligon), iar O1-O9 și
porțile NU cresc la măsurarea întreagă de la pasul 7.

## Fișierele pe care le deține runda (doar acestea se modifică)
- `C:/00/Projects/LearningHub_fidel/aplicatii/aplicatii.js` (calea `input` + compunerea; `activeazaTasta`; greșelile asistentului)
- `C:/00/Projects/LearningHub_fidel/aplicatii/word.js` (straturile și focusul; tastele de acces pe N niveluri; Font Size;
  „Save this file”; `I.la.text` / `I.la.sterge`)
- `C:/00/Projects/LearningHub_fidel/aplicatii/aplicatii.css` (cuvântul în compunere vizibil la cursor)
- notele rundei: `runde/2/*`, `de_verificat.md` (secțiunea RUNDA2-WORD), `de_aprobat.md` (nou).
Reparațiile stau ca înlocuiri exacte în `runde/2/repara_r2.py` (aplicabile și verificabile pe o copie).

## După GRAV (doar dacă rămâne context): constatările [FARA_REFERINTA] ale criticului
Săgețile și Enter în tabel, tastat peste o selecție aldină, Ctrl+A + Delete cu tabel — doar cu referință; fără ea → `de_verificat.md`.
