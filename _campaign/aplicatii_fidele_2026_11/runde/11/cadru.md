# Runda 11 · pasul 2 · CADRU (B-powerpoint, unghiul stare_finala_erori)

Suprafața aleasă: aplicația PowerPoint întreagă în bibliotecă (azi lipsește: O4 = 17 scenarii neexecutabile, O5 = 31 de gesturi fără eveniment, O9 = 8 cazuri RĂU, toate cu „„powerpoint” nu e încă în bibliotecă”).

## Presupuneri
1. Referința `uia_powerpoint.json` e completă pentru panglică, bara de titlu, bara de stare, Backstage, meniurile de clic dreapta și ferestrele din lecții, dar NU pentru diapozitiv și miniaturi (zona documentului = 12 noduri de cadru; README_referinte.md). Deci desenul diapozitivului nu se poate măsura cu O3: se ia din scenarii (ce casete are un aspect, câte forme).
2. Starea pe care o compară O4 (`diapozitive[{aspect, texte, forme, tranzitie_cod?, animatii_cod?}]`, `formatare_text`, `tema`, `*_galerie`, `nume_fisier`) e tot ce trebuie să iasă egal; codurile cunoscute sunt doar cele din scenariile reale (Fade = 3849, Fly In = [2]).
3. Comenzile cu `activ:false` în referință (Font, Paragraph, Animations) sunt gri pentru că la dump nu era nimic selectat; în aplicația reală devin active când e o casetă/un text ales (README_referinte.md, „starea activ/gri … e starea DE LA DUMP”). [presupus pentru Font/Animations; dovedit doar pentru Cut/Copy/Paste]
4. Listele derulante (Layout ▾, New Slide ▾, Pictures ▾, tabelul RxC) nu sunt în referință („Necapturate: listele derulante și galeriile deschise”): ce conțin vine doar din ce numesc scenariile reale.

## Citiri ale lui „fidel” pe suprafața asta
- (a) **aspect**: aceleași file, grupuri, comenzi, în același loc (O3/O2) — referința o dă pentru panglică, nu pentru diapozitiv.
- (b) **stare finală + erori** (unghiul rundei): după gestul elevului, prezentarea are exact aspectul, textele, formele, tranziția, animația, tema din rezultatul real; o comandă afișată și nesimulată spune asta (R12), nu tace, iar un gest fără sens (Delete fără nimic ales) nu strică nimic.
- (c) **gest**: același gest (clic pe galerie, clic dreapta pe miniatură, Ctrl+M, Delete în panoul miniaturilor) duce acolo.

## Citirea aleasă: (b), cu (a) moștenit din motorul comun
Pierd celelalte: (a) e deja dat gratis de `panglica.js` din date generate (aceeași cale ca Word/Excel) și O3 nu numără poligonul; (c) fără (b) e teatru — un gest care emite evenimentul dar lasă altă stare e exact ce ar găsi elevul greșit în laborator.
