# 09 — Checklistul de pe hârtie (U9)

## R1-R6 (`C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md`)
| Regula | Da/Nu/NA | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | da | 6 chestionare; la atomul 1 cea mai lungă e distractorul „Modifica automat formatarea…” (`u9_grep.txt`, data-quiz) |
| R1.2 distractori = greșeli reale | parțial | atomul 4: „Nu se poate … decat cu macro VBA” și atomul 5 „Stergi tabelul si il rescrii” nu sunt greșeli de începător reale |
| R1.3 poziția nu contează | da | motorul amestecă (cheia „b” în HTML apare ca C/D pe ecran, `parcurgere.json`) |
| R1.4 / R1.4-bis cheia vs indiciul | da | fiecare hint repetă ideea variantei corecte, fără literă |
| R1.5 un singur răspuns corect | da | verificat pe cele 6 |
| R1.6 cheia e literă | da | `"correct": "b"` etc. |
| R2.1 nu ceri ce n-ai predat | **nu** | Ex. 2 cere implicit inserarea unei coloane (rezolvarea „Nr, Elev, Nota, Clasa”); nepredată în M1 cls8 (`u5_reproducere.txt` §B) |
| R2.2 rezolvare model la fiecare exercițiu | da | 3/3 pliate; Ex. 3 e schiță + criterii, criteriul (4) greșit (`surse/undo_en.txt`) |
| R2.3 fără parole pe site-uri externe | NA | nu cere conturi |
| R3.1 exemplul înainte de definiție | da | Încearcă înainte de atomul 1 |
| R3.2 termen explicat la prima folosire | parțial | „Ribbon”, „celula activa” folosite fără explicație; „selectie partiala” explicată abia în atomul 3 |
| R3.3 ieșire în sus | da | „Vrei mai mult?” (Custom List, formule la sortare) |
| R3.4 cifrele nu se bat cap în cap | **nu** | atomul 4: Dan 10 8A, Andrei 7, Carla 6 vs datele lecției (`u5_reproducere.txt` §A) |
| R3.5 separatorul declarat | NA | nicio formulă de tastat |
| R4.1 titlu = fișier = card = obiective | da (temă) | titlu „Sortare dupa Criterii in Excel”, card „Sortare dupa Criterii” (index.html r. 376) |
| R4.1-bis numele fișierului vs ce predă | parțial | „lectia7” vine la clasă înainte de lectia5/6 (`01_citit_inapoi.md`) |
| R4.1-ter frații pe același slot | observat | există și `cls8/m2-formule-functii/lectia7-sortare.html` (aceeași temă, alt modul, `K_rezultat.csv`) — de decis care e cea folosită la ora 10 |
| R4.2 cifre de navigare generate | NA | — |
| R4.3 note administrative ascunse elevului | parțial | atomul 6 predă elevului conexiunea cu „programa OMEN 3393/2017” + chestionar pe ea |
| R6.1-R6.3 martori / oracolul care rezolvă / poarta de tipar | da | aici: sarcina făcută în xlsx + randare (`produs_elev/`, `recalculat/`, `randat_xlsx/`) |
| R6.4 semnalarea = clasă | da | „tabel-model care nu iese din datele lecției” = de căutat în toată M1 (vezi JURNAL) |
| R6.5-R6.7 | NA | reguli de reparație |

## Checklistul `LESSON_SPECIFICATION.md` (Grep `- [ ]`)
| Punct | Da/Nu/NA | Unde |
|:--|:--|:--|
| Identified curriculum position | da | atomul 6 citează programa; ora din plan nu e declarată |
| Read 2+ existing lessons | NA | proces de autor, nu se poate verifica |
| 4-8 atom topics | da | 6 atomi (`u9_grep.txt`) |
| Quiz questions for each atom | da | 6 data-quiz |
| 3 exercises minim/standard/performanta | da | Ex. 1-3 etichetate |
| Valid HTML | da (practic) | H_vede a randat fără erori, consola 0 |
| ZERO inline `<style>` | da | singurul „<style” e în comentariul „NO inline <style> blocks” |
| All 6 scripts + DEPTH | da | 6 scripturi `../../../../assets/js/` + site-credit (`u9_grep.txt`) |
| init calls + LESSON_ID | da | `AtomicLearning.init("cls8-m1-excel-fundamente-lectia7-sortare")` și celelalte două |
| `<title>` matches content | da | |
| Grade in title matches folder | da | „TIC Clasa a VIII-a” |
| Nav links prev/next | **nu** față de plan | prev = index, next = lectia6-proiect; în planul anului ora 10 vine după lectia4-functii și înainte de lectia5-grafice |
| lesson-summary div | da | `u9_grep.txt` |
| Romanian text with proper diacritics | **nu** | 0 ș/ț; `diacritice_la_1000` ≈ 0 |
| 4-8 atoms each content + quiz | da | |
| Every quiz has a hint | da | |
| Correct answer index matches | da | verificat pe cele 6 |
| No TODO/TBD/PLACEHOLDER | da | |
| Pain comparison topic | NA | nu există |
| Summary bullets match atoms | da | „Ce ai invatat astazi” = atomii 1-5 |
| Practice exercises topic-specific | da | |
| No escaped quotes in attributes | da | data-quiz parsat JSON 6/6 |
| data-quiz JSON valid | da | `u9_grep.txt` „quiz ok 6” |
| File size > 25KB | da | 29 471 octeți |
| Images width 100% | NA | 0 imagini |
| Maps to OMEN competency | da | conținutul „Sortarea … după unul sau mai multe criterii” |
| Grade-appropriate difficulty | da | |
| Exercises labeled levels | da | |
