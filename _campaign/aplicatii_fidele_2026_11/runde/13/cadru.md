# Runda 13 · cadru (pasul 2) — B-powerpoint, unghiul gest_tastatura

Suprafața: drumurile lecțiilor PowerPoint rămase blocate după critic 12 (P3 rest, P4 rest, A1-A4) + MINOR, pe poligonul `aplicatii/`.

## Presupuneri (de verificat, nu de crezut)
1. O3 NU se mișcă din biblioteca PowerPoint: randează paginile lecțiilor, încă pe simulatoarele vechi (runde/12/cadru.md, presupunerea 1). Cele 8 suprafețe noi intră în `date/powerpoint.json` prin generator, dar O3 rămâne 26855.
2. O4 scade doar pe scenariile pe care referința le dă cu rezultat probat (12 din cele 14 noi); `stea-ctrl-c-v`, `note` (fără real) și `tragere-forma` rămân.
3. Clicul „în mijlocul formei” din `a_forma_clic` se poate reda cu lovirea DESENULUI (SVG), nu a dreptunghiului: clicul pe dreptunghiul stelei în afara desenului cade pe diapozitiv (= nimic ales), ca în referință.
4. Substituenții (titlu, subtitlu, conținut) NU sunt în captură: clicul în ei rămâne cursor în text (lecțiile scriu acolo).
5. Tastatura pe liste (săgeți / Enter / Esc) nu e capturată pentru PowerPoint; comportamentul comun al listelor (navigare între rânduri, Enter = clic, Esc = închide) e [presupus], ca la Word/Excel.

## Citiri ale lui „fidel” aici
- a) aspect: lista / fereastra arată aceleași rânduri, în aceeași ordine, în același loc (uia_powerpoint.json pe chei);
- b) gest + stare finală: același clic / aceeași tastă dă aceeași stare ca scenariul real (O4) — `font_text`, `pornire_animatii`, `umplere_forme`, `fundal_diapozitive`, `vedere`, `prezentare_activa` / `prezentari_deschise`;
- c) mesaj: unde nu e simulat, mesajul central standard.

**Aleasă: b), cu a) din date.** Drumul lecției trebuie să se ducă la capăt cu mâna elevului (critic 12, tabelul drumurilor: 7 lecții + jocul blocate); aspectul vine gratis din generator (etichete din referință). c) pierde: pe drumul lecțiilor mesajul nu e o ieșire (api §4, R12).
