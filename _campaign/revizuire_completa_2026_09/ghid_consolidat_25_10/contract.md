# Contract — ghidul consolidat al lecțiilor (25.10.2026)

## Cererea (verbatim, 25.10.2026, 11:32)
> 2. Revizuieste complet si consolideaza intr-un document pe care il folosim de fiecare data pentru aceeste lectii toate informatiile pe care le-ai tot aflat despre cele mai bune practici si idei

## Proba realității
La fiecare lecție nouă (sau reparare), dirijorul și fiecare agent (autor, judecător, poartă) citesc ACEST document și găsesc acolo tot ce s-a învățat din 27.09 încoace — fără să mai caute prin 20 de fișiere, jurnale și prompturi împrăștiate. Vasile îl poate citi ca să vadă „cum se face o lecție la noi”.

## R — cerințe explicite (cine verifică · gata =)
| R# | Cerința | Cine verifică | Gata = |
|---|---|---|---|
| R1 | UN singur document: `_campaign/revizuire_completa_2026_09/00_GHID_LECTII.md` | dirijorul | fișierul există; 05_STANDARD și 08_RELUARE trimit la el |
| R2 | „Revizuiește complet”: toate sursele citite (standardul, reluarea, jurnalul, rapoartele de noapte/dimineață, prompturile comune, `surse.md` ale lecțiilor, memoria, baza de cunoștințe, cercetarea) | extrageri pe disc (`extrase/*.md`), una pe grup de surse | fiecare grup are extragerea lui, cu trimiteri fișier:linie |
| R3 | Nimic important pierdut | verificator independent: ia la întâmplare ≥ 40 de puncte din extrageri și le caută în ghid | ≥ 95 % găsite (sau scoase cu motiv: înlocuite / depășite) |
| R4 | Fără contradicții în ghid și cu deciziile lui Vasile | verificatorul independent | 0 contradicții nerezolvate |
| R5 | Numerele regulilor 1-27 din `05_STANDARD_LECTIE.md` rămân aceleași (scripturile și lecțiile le citează) | dirijorul (grep) | fiecare „regula N” veche are același înțeles în ghid |
| R6 | Folosit „de fiecare dată”: legat în `/lectii` (`.claude/skills/lectii.md`), în `08_RELUARE.md` și în promptul comun al agenților | dirijorul | grep arată trimiterea în toate trei |
| R7 | Limbaj simplu, cu diacritice; fiecare regulă cu sursa ei; fără date personale | verificatorul + `learninghub_date_personale.py` | 0 |

## Decizii [presupus]
- Ghidul ÎNLOCUIEȘTE ca loc de citit `05_STANDARD_LECTIE.md` și partea de reguli a `08_RELUARE.md`; textul lor vechi se mută întocmai în `_istoric/` (arhivare, nu ștergere), iar în locul lor rămâne o trimitere cu harta numerelor.
- Ghidul are părți pentru cine îl citește (autor, judecător, dirijor), ca un agent să citească doar partea lui plus regulile comune.
