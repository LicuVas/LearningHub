# 09 — Checklist (U9) · cls6/lectia4-animatii
Dovezi mecanice: `u9_verifica.py` → `u9_iesire.json`; `u3_verifica.py` → `u3_iesire.json`.

## R1-R6 din `knowledge/learninghub_calitate/00_INDEX.md`
| Regula | da/nu/n.a. | Unde |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **nu** (4/10 corecta strict cea mai lungă: ex. „Maximum 2-3 animatii simple si consistente”, „Porneste in acelasi timp cu animatia anterioara”) | `u9_iesire.json` |
| R1.2 distractori = greșeli reale | parțial — „Minim 5 animatii pe fiecare slide”, „10 secunde (foarte lent)” se elimină prin reflex | data-quiz atomii 4-5 |
| R1.3 poziția nu contează | da (motorul amestecă: ordinea din innerText diferă de JSON) | `innerText.txt` r. 137-147 |
| R1.4 cheia vs indiciu | da (10/10 cheie = indiciu); indiciul repetă răspunsul în 7/10 — se vede doar după răspuns | `u9_iesire.json` |
| R1.5 un singur răspuns corect | da | data-quiz |
| R1.6 cheia = literă | da | data-quiz |
| R2.1 nu cere ce n-ai predat | **nu** — Ex.1 minim cere Motion Paths declarat „optional”; Ex.3 cere declanșator desenat, predat într-o singură frază | r. 247 vs 676; r. 411 |
| R2.2 rezolvare model | da, la toate 3 (Ex.3 = „schiță”) | r. 680, 722, 772 |
| R2.3 parole reale pe site-uri | n.a. | — |
| R3.1 exemplul înainte de definiție | da la atomul 1 (analogia cu teatrul), „Încearcă tu” înainte de teorie | r. 54-115 |
| R3.2 termenul explicat la prima folosire | **nu** — „With Previous” și „By Paragraph” apar în întrebări înainte de atomul care îi explică | `u3_iesire.json` |
| R3.3 ieșire în sus | da („Vrei mai mult?”, Ex.3) | r. 806 |
| R3.4 cifrele nu se bat cap în cap | parțial — „max 2-3” vs 5 animații la Ex.1 (explicabil, vezi 06 U13-B); durata „DEFAULT 1 s” vs „de obicei 0.5-2 secunde” în indiciu | r. 439, 521 |
| R3.5 separator | n.a. | — |
| R4.1 titlu = fișier = obiective | da | `01_citit_inapoi.md` |
| R4.1-ter frații pe același slot | ora 7 are 2 fișiere (lectia4 + lectia5) | `01_citit_inapoi.md` |
| R4.2 cifre de navigare generate | n.a. | — |
| R4.3 note administrative | nu s-au găsit în text vizibil | `innerText.txt` |
| R6.x (metodă de audit) | aplicate: R6.2 lecția rezolvată în fișier; R6.3 PDF citit înapoi | `07_redeschis.json`, `04_a_doua_cale.json` |

## Checklistul `LESSON_SPECIFICATION.md` (Grep `- [ ]`)
| Item | da/nu/n.a. | Unde |
|:--|:--|:--|
| Identified curriculum position | parțial — nu spune că e jumătate din ora 7 | `01_citit_inapoi.md` |
| Read 2+ existing lessons | n.a. (proces de autor) | — |
| 4-8 atom topics | da (5) | `u9_iesire.json` |
| Quiz for each atom | da (2/atom) | idem |
| 3 exercises minim/standard/performanta | da, etichetate | `u9_iesire.json` niveluri |
| Valid HTML / JSON data-quiz valid | da (JSON.parse în Python) | idem |
| ZERO inline `<style>` | da (singurul „<style” e în comentariul r. 10) | Grep |
| All 6 scripts / init calls / LESSON_ID | da: AtomicLearning, PracticeSimple, LessonSummary, Breadcrumb, LearningProgress cu `cls6-m1-prezentari-lectia4-animatii` | `u9_iesire.json` |
| `<title>` matches content / grade | da | `01_citit_inapoi.md` |
| Nav links prev/next | parțial — „Urmatoarea” → lectia5; „înapoi” duce la index, nu la lectia3 | HTML r. 17-18 |
| `lesson-summary` div | da | `u9_iesire.json` |
| Romanian with proper diacritics | **nu** (1,3/1000) | `04_norma.md` |
| Every quiz has hint / correct index | da | data-quiz |
| No TODO/PLACEHOLDER | da | `u9_iesire.json` |
| Summary bullets match atoms | da; lipsesc spațiile după „:” („Tipuri de animatii:Entrance”) | `dupa_atomi_08.png` |
| Exercises topic-specific | da | r. 658-790 |
| File size > 25KB | da (44.469 octeți) | `u9_iesire.json` |
| Images max-width | n.a. (0 imagini) | idem |
| Maps to OMEN 3393/2017 competency | da (Efecte de animație, CS 1.1/3.1) | `u16_programa.txt` |
| Difficulty grade-appropriate | **parțial** — Ex.3 (declanșatoare, trasee desenate) peste standardele de prezentări | `04_norma.md` |
