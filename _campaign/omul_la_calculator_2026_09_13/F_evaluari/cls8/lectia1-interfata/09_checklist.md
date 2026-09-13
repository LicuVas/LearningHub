# 09 — Checklistul de pe hârtie (U9)

## R1-R6 din `knowledge/learninghub_calitate/00_INDEX.md`
| Regula | Bifă | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | da (în mare) | 9 întrebări; corectele au lungimi comparabile (ex. atomul 6: varianta corectă e mai lungă decât distractorii — minor) |
| R1.2 distractori = greșeli reale | da | „7C”, „C-7”, „Formula Bar” vs „Name Box”, „Ctrl+Home” vs „Ctrl+End” — confuzii reale de începător |
| R1.3 poziția | nu se aplică | motorul amestecă (parcurgere.json: C7 apare pe litera C deși cheia e „b”) |
| R1.4 cheia vs indiciul | da | citit manual cele 9 indicii: fiecare explică varianta marcată corectă; cheia atomului 3 recalculată (15) în `04_a_doua_cale.json` |
| R1.4-bis indiciul nu numește litera | da | niciun „răspunsul corect este b” |
| R1.5 un singur răspuns corect | da | — |
| R1.6 cheia literă, valoare listă | da | `data-quiz` = listă; JSON.parse trece (python json.loads pe toate 9) |
| **R2.1 nu cere ce n-ai predat** | **NU** | 5 din 9 întrebări cer conținut predat mai târziu (`u3_iesire.json`); „Încearcă” cere Name Box înainte de atomul 6 (acolo e acceptabil, e explorare, cu pliant de ajutor); Ex. 3 întrebarea 4 (Undo) — afirmația „nu poți da Undo” e predată la atomul 9, dar nesursată |
| **R2.2 rezolvare model** | **NU (formal da)** | există „Vezi rezolvarea” la toate 3, dar **toate trei sunt ale altor exerciții** (`u5_reproducere.txt`) |
| R2.3 fără parole reale | da, cu rezervă | nu cere parole; dar trimite la „Excel Online (gratuit cu cont Microsoft)” fără alternativă pentru elevul fără cont |
| R3.1 exemplul înaintea definiției | da | „Încearcă” practic înaintea atomilor; analogii (caiet cu pătrățele, șah) |
| R3.2 termenul la prima folosire | parțial | „Name Box” folosit în „Încearcă” pas 4-5, explicat la atomul 6 (există pliant); „used range” explicat în „Vrei mai mult?” |
| R3.3 ieșire în sus | da | „Vrei mai mult?” cu provocarea ZZ500 / used range |
| R3.4 cifre care se bat cap în cap | **nu (minor)** | punctul e separator de mii („16.384”) și zecimal („8.67”) în aceeași lecție (`04_mediu.md`) |
| R3.5 separatorul declarat pe modul | nu | nicio declarație; singura formulă cu separator e în rezolvarea (greșită) a Ex. 2, cu virgulă |
| R4.1 titlu = fișier = card = obiective | da | fișier `lectia1-interfata`, titlu „Interfata Excel - Celule si Navigare”, card index „Interfata Excel / Celule, randuri, coloane, foi de lucru”, obiective potrivite |
| R4.1-bis / ter | parțial | lecția = orele 2+3+4 din plan (`01_citit_inapoi.md`) |
| R4.2 cifre de navigare generate | nu se aplică | pagina de lecție nu are cifre de catalog |
| R4.3 note administrative | da | nu apar referințe interne în text |
| R6.2 oracolul care rezolvă | da | lecția rezolvată în `produs_elev/` + parcurgere H_vede |
| R6.3 PDF/tipar | nu se aplică | lecția nu are produs de tipărit |
| R6.4 semnalarea = clasă | **atenție** | rezolvările greșite vin din lotul `21b141a` (61 de loturi, 82 de agenți) — probabil și în alte lecții |

## Checklistul din `LESSON_SPECIFICATION.md` (Grep `- [ ]`, verificat prin Grep în HTML)
| Punct | Bifă | Unde |
|:--|:--|:--|
| Poziție în curriculum (clasă, modul, săptămână, competență) | parțial | clasă/modul da; competența OMEN nu e scrisă în pagină |
| 4-8 atomi | **nu** | **9 atomi** (masuri.json `atomi: 9`) |
| Întrebări pentru fiecare atom | da | 9 × 1 |
| 3 exerciții minim/standard/performanță | da | `data-level` minim/standard/performanta (r. 401, 427, 444) |
| HTML valid | da (neverificat cu validator) | pagina se randează, consola goală (consola.json = []) |
| ZERO `<style>` inline | da | singura potrivire e comentariul „NO inline <style> blocks”; există însă atribute `style=` (r. 138, 264-279, 362, 388) |
| Toate scripturile | da | atomic-learning, practice-simple, lesson-summary, breadcrumb, progress, user-system (+ site-credit) |
| Init-uri cu LESSON_ID corect | da | `cls8-m1-excel-fundamente-lectia1-interfata` (r. 505-507) |
| `<title>` = conținut; clasa din titlu = folder | da | „TIC Clasa a VIII-a”, folder cls8 |
| Linkuri nav | da | index.html ← / → lectia2-date.html |
| `lesson-summary` ascuns | da | r. 479 |
| **Diacritice în conținut** | **nu** | 0,0 la 1000 (`04_norma.md`) |
| Fiecare întrebare are indiciu | da | 9/9 |
| Cheia = opțiunea corectă | da | verificat manual + atomul 3 recalculat |
| Fără TODO/TBD/PLACEHOLDER | da | Grep = 0 |
| Rezumatul = ce predau atomii | da | „Ce ai invatat astazi” = cei 9 atomi |
| **Exerciții specifice temei** | da la cerințe, **nu** la rezolvări | rezolvările sunt despre buget, erori de formule, PEMDAS |
| data-quiz JSON valid | da | json.loads pe 9/9 |
| Mărime fișier > 25KB | da | 37.127 octeți |
| Imagini cu width 100% | nu se aplică | 0 `<img>` |
| Mapare pe competență OMEN | da (implicit) | CS.1.1 cls. VIII (`04_norma.md`) |
| Dificultate potrivită clasei | da | nivel de bază, pași ghidați |
| Exerciții etichetate minim/standard/performanță | da | titlurile „(Nivel minim)”, „(Nivel standard)”, „(Nivel performanta)” |
