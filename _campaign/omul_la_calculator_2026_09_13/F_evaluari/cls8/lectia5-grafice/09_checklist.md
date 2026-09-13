# 09 — Checklist de pe hârtie (U9)

Surse: titlurile `###` din `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` și `- [ ]` din `C:\00\Projects\LearningHub\LESSON_SPECIFICATION.md` (:731-770). Verificat prin Grep în HTML și prin fișierele din acest folder.

## R1-R6 (00_INDEX.md)
| Regulă | da / nu / nu se aplică | Unde |
|:--|:--|:--|
| R1.1 varianta corectă nu e cea mai lungă | da | la toate 9 (`u3_chei_quiz.json`, `corect_e_cel_mai_lung: false`) |
| R1.2 distractori = greșeli reale | da | „Excel da eroare … pana adaugi titlurile”, „Home → Font Color” — plauzibile |
| R1.3 poziția | da, dar | motorul amestecă literele, însă păstrează prefixul vechi: elevul vede „A c) Column (Coloana)”, „D b) Selectezi datele” (două litere pe aceeași variantă) — minor |
| R1.4 cheia vs indiciu | da | 9/9 (`04_a_doua_cale.json`) |
| R1.4-bis indiciul nu numește litera | da | indiciile încep cu „Corect!/Exact!” și numesc tipul, nu litera |
| R1.5 un singur răspuns corect | da | verificat pe cele 9 |
| R1.6 cheia = literă | da | `"correct": "b"` etc. |
| R2.1 nu cere ce n-ai predat | parțial | atomul 3 întreabă „primul pas” (selectarea), predat abia în atomii 5 și 7; Încearcă îl spune însă |
| R2.2 rezolvare model | da | Ex. 1-3 au „Vezi rezolvarea”; Încearcă și pasul 6 nu au răspuns (vezi 06_premortem.md A) |
| R2.3 parole pe site-uri externe | nu se aplică | „gratuit cu cont Microsoft” — link, fără cerință de logare în lecție |
| R3.1 exemplul înainte de definiție | da | Încearcă înaintea atomilor |
| R3.2 termenul explicat la prima folosire | parțial | „serie de date” explicat (atomul 4) dar folosit deja în Bonus din Încearcă; „diagramă” (termenul din programă și din Excel ro) nu apare |
| R3.3 ieșire în sus | da | Provocarea (cu tabelul greșit: 5 elevi vs 3) |
| R3.4 cifrele nu se bat cap în cap | **nu** | Provocare „5 elevi” vs tabelul cu 3; axa „(0, 2, 4, 6, 8, 10)” vs barele scalate la 8,1; anatomia arată 4 materii din 5 (`04_a_doua_cale.json`) |
| R3.5 separatorul declarat o dată pe modul | nu se aplică la formule / **nu** la zecimale | lecția n-are formule; datele au punct zecimal fără nicio notă (`u4_cultura.txt`) |
| R4.1 titlu = fișier = card = obiective | da | titlu „Grafice si Vizualizarea Datelor”, card „Creare grafice”, obiective pe grafice |
| R4.1-bis / R4.1-ter | da | fișierul predă grafice; frații lectia4/lectia6 nu se suprapun |
| R4.2 cifre pe navigare generate | nu se aplică | nu am evaluat pagina de index |
| R4.3 note administrative afișate | da (curat) | Grep „programa”, „OMEN” în innerText: 0 |
| R6.1-R6.7 | nu se aplică | reguli pentru martori/porți, nu pentru conținut |

## Checklistul din LESSON_SPECIFICATION.md
| Bifa | Rezultat | Unde |
|:--|:--|:--|
| Identified curriculum position | da | ora 11, CS „Grafice: tipuri de grafice”, „Serii de date” (`04_norma.md`) |
| Read 2+ existing lessons | nu se aplică | proces de autor, nu se vede în fișier |
| 4-8 atom topics | **nu** | 9 atomi (`masuri.json`) |
| Quiz for each atom | da | 9 `data-quiz` (Grep) |
| 3 practice exercises minim/standard/performanta | da | `data-level="minim"` … „Nivel standard”, „Nivel performanta” |
| Valid HTML | nu verificat cu validator | Chromium parcurge fără erori (`consola.json`: 0) |
| ZERO inline `<style>` | da | Grep `<style`: 0 (comentariul de la rândul 10 doar îl menționează) |
| All 6 scripts present | da | rândurile 675-680 |
| All init calls with LESSON_ID | da | 683-693, `cls8-m1-excel-fundamente-lectia5-grafice` |
| LESSON_ID pattern | da | idem |
| `<title>` matches content | da | |
| Grade in title matches folder | da | „Clasa a VIII-a” / cls8 |
| Nav links prev/next | da ca fișier, nu ca plan | next = `lectia6-proiect.html`; în planul anului înainte vine sortarea (`lectia7-sortare.html`, ora 10) |
| `lesson-summary` div | da | rândul 657 |
| Romanian text with proper diacritics | **nu** | 0,0 la 1000 (`04_norma.md`) |
| 4-8 atoms with content + quiz | **nu** | 9 |
| Every quiz has a hint | da | 9/9 (`u3_chei_quiz.json`) |
| Correct answer index matches | da | 9/9 |
| No TODO/PLACEHOLDER | da | Grep: 0 |
| Pain comparison topic | nu se aplică | nu există bloc de comparație |
| Summary bullets match atoms | da | 8 puncte = atomii 1-8 (atomul 9, scenariul, nu are punct) |
| Practice exercises topic-specific | da | grafice pe note, buget, clase |
| No `\"` inside onclick/data attributes | **nu** (fără efect) | `data-quiz` al atomilor 2 și 6 conține `\"` în JSON; JSON-ul se parsează (scriptul `u3_chei_quiz.json` l-a citit) |
| data-quiz JSON valid | da | 9/9 parsate |
| File size > 25KB | da | 49.421 octeți |
| Images width 100% | nu se aplică | nicio `<img>` (Grep) — deci nicio captură din Excel |
| Maps to OMEN competency | da | `04_norma.md` |
| Grade-appropriate | da | |
| Exercises labeled minim/standard/performanta | da | |
