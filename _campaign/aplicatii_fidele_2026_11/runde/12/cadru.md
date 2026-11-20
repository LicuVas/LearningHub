# Runda 12 · cadrul (pasul 2) — constructorul 1, 20.11.2026

Suprafața: PowerPoint din bibliotecă (`aplicatii/powerpoint.js` + `date/powerpoint.json`), pe drumurile lecțiilor VI (m1-l02…m2-l10)
și ale jocului `prezentari-vi`; ținta = cele 5 GRAV ale criticului 11 (P1-P5), apoi MINOR.

## Presupuneri (de verificat, nu de crezut)
1. O3 NU se mișcă din biblioteca PowerPoint: oracolul randează doar paginile din `inventar.json` (lecțiile, care încă încarcă
   simulatoarele vechi `lectii/_sim/simppt*`), nu `aplicatii/poligon.html` (structura_lib.py › `taskuri_randare` /
   `instante_pagina`). Dovada: în runda 11 PowerPoint a intrat în bibliotecă și O3 a rămas 21586 (jurnal.jsonl, rândul rundei 11).
   Deci „O3 trebuie să scadă” din supliment nu se poate atinge în etapa B; scad O4 (scenariile pe poligon), eventual O5/O9.
2. Referința dovedește comportamentul doar acolo unde există `scenarii_real/powerpoint-*.json` sau `acoperire_r11.fapte`;
   restul (ordinea literelor KeyTips, culorile #RRGGBB ale temei în afară de Red și Light Blue, durata altor tranziții,
   ✕ pe ultima prezentare) e [presupus] și intră în `de_verificat.md` (R12-*).
3. Rulatorul O4 apasă CENTRUL țintei cu `ElementHandle.click()` (verifică ce element primește clicul). Pe Title Slide centrul
   diapozitivului cade în caseta de titlu ([120, 88, 720, 188] pt, scenarii_real/powerpoint-ctrl-c-v-caseta.json), deci ținta
   `diapozitiv` trebuie să aibă un element al cărui centru e un loc GOL al diapozitivului.
4. Word și Excel nu folosesc nimic din ce schimb în afară de `aplicatii.css` (clasele `.lh-ap-p-*` și `.lh-ap-strat-backstage`).

## Citiri ale lui „fidel” pe suprafața asta
- (a) **stare finală**: același gest → aceeași stare citită ca în scenariul real (O4) — ce verifică lecția.
- (b) **gest**: aceleași taste/clicuri duc acolo (KeyTips „Alt, H, 1”, ▾ → paletă → Red, ✕ → întrebarea) — ce face elevul în laborator.
- (c) **aspect**: aceleași rânduri, în aceeași ordine, cu aceleași etichete (listele din `uia_powerpoint.json`).
- (d) **mesaj de eroare**: aceeași fereastră care întreabă (Save your changes…) cu aceleași butoane.

## Citirea aleasă
(b)+(a): gestul elevului duce la aceeași stare, iar ce se desenează pe drum (listele, fereastra) vine din referință (c), fără
etichete scrise de mână. Pierd: (c) singură — o listă desenată fidel care nu face nimic e tot o comandă moartă (R12);
(d) singură — fereastra fără efectul butoanelor nu închide P3.
