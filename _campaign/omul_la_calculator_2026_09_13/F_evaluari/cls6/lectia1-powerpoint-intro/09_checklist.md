# 09 — Checklistul de pe hârtie (U9)

## R1-R6 (`knowledge/learninghub_calitate/00_INDEX.md`)
| Regula | da/nu/n.a. | Unde |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **nu** la 4/10 întrebări | varianta corectă e strict cea mai lungă la: „Ce este un slide” (atomul 1), „Ce vizualizare…” (1), „Cum iesiti din Slide Show” (2), „La ce este utila zona de note” (3) — măsurat pe lungimea variantelor din `data-quiz` |
| R1.2 distractori = greșeli reale | da, în mare | Ctrl+N vs Ctrl+M, Slide Show vs Slide Sorter sunt confuzii reale |
| R1.3 poziția nu contează | da | motorul amestecă variantele (`atomic-learning.js`, shuffleArray) |
| R1.4 cheia vs indiciu | da | 10/10 indicii confirmă varianta-cheie |
| R1.4-bis indiciul nu numește litera | da | indiciile nu conțin litere |
| R1.5 un singur răspuns corect | da | |
| R1.6 cheia e literă | da | `"correct": "b"` etc. |
| R2.1 nu cere ce nu ai predat | **nu** | 4/10 întrebări întreabă termeni predați într-un atom următor (`u3_iesire.json`); Ex.2 cere selecția cu Ctrl și schimbarea layout-ului, nepredate (recunoscut în rezolvare); Ex.1/Ex.3 cer tema de design, nepredată |
| R2.2 rezolvare model | da | toate 4 exercițiile au „Vezi rezolvarea” |
| R2.3 parole pe site-uri externe | n.a. | nu se cer conturi |
| R3.1 exemplul înainte de definiție | parțial | „Încearcă tu” vine înaintea teoriei (bine); în atomi definiția vine prima |
| R3.2 termen nou explicat | parțial | Ribbon explicat; „layout” folosit fără explicație (atomul 4, exerciții) |
| R3.3 ieșire în sus | da | secțiunea „Vrei mai mult?” (ZIP/XML, Office Open XML) |
| R3.4 cifrele nu se bat cap în cap | **nu** | Ex.3: „Introducere → 5 slide-uri de continut → Concluzie” = 7 vs „exact 8 slide-uri” |
| R3.5 separator declarat | n.a. | fără formule |
| R4.1 titlu = fișier = obiective | parțial | titlu = fișier; obiectivele 3-5 (temă, redeschidere, Ctrl+N) nepredate; ora din plan doar pe jumătate |
| R4.2 cifre generate | n.a. | |
| R4.3 note administrative ascunse | da | rezolvarea Ex.2 are o notă pentru profesor („nu a fost explicata in aceasta lectie”) — vizibilă elevului când deschide rezolvarea; minor |
| R6.x (metodă de audit) | n.a. | reguli pentru auditori, aplicate prin acest protocol |

## Checklistul din `LESSON_SPECIFICATION.md` (Grep `- \[ \]`, verificat în HTML)
| Punct | da/nu/n.a. | Unde |
|:--|:--|:--|
| poziția în programă (clasă, modul, săptămână, competență) | parțial | clasa/modulul da; nicio competență OMEN numită în pagină |
| 4-8 atomi | da | 5 atomi |
| întrebări pe fiecare atom | da | 2/atom |
| 3 exerciții minim/standard/performanță | da (4) | două de „performanta” |
| HTML valid / ZERO `<style>` inline | da | `grep <style` = doar comentariul de la rândul 10 |
| 6 scripturi cu DEPTH corect | da | rândurile 617-622 (`../../../../assets/js/`) |
| init cu LESSON_ID corect | da | `AtomicLearning.init('cls6-m1-prezentari-lectia1-powerpoint-intro')`, `PracticeSimple.init(...)` rândurile 625-626 |
| `<title>` = conținut; clasa din titlu = folder | da | „TIC Clasa a VI-a”, folder cls6 |
| linkuri nav prev/next | da | `index.html`, `lectia2-slide-uri.html` (rândurile 17-18, 610) |
| `lesson-summary` prezent | da | rândul 599 |
| **diacritice în text** | **nu** | 0,1 la 1000 de litere (`log.json`) |
| fiecare întrebare are indiciu | da | |
| indexul corect = varianta corectă | da | verificat pe cele 10 |
| fără TODO/TBD/PLACEHOLDER | da | grep: 0 |
| rezumatul = ce predau atomii | da | „Ce ai invatat astazi” corespunde atomilor |
| exerciții pe subiect | da | |
| fără `\"` în atribute data | **nu** | 2 apariții, atomul 1: `"Ce este un \"slide\" in PowerPoint?"` (JSON-ul se parsează totuși) |
| `data-quiz` JSON valid | da | 5/5 parsate cu `json.loads` |
| mărime > 25KB | da | 44.270 octeți |
| imagini cu width 100% | n.a. | 0 imagini |
| legat de o competență OMEN 3393/2017 | nu în pagină | legătura există doar în plan (CS.1.1) |
| dificultate potrivită clasei | parțial | Ex.1 „minim” cere peste descriptorul „De bază” (imagini, temă, note) |
| exerciții etichetate pe niveluri | da | „(Nivel minim)”, „(Nivel standard)”, „(Nivel performanta)” |
