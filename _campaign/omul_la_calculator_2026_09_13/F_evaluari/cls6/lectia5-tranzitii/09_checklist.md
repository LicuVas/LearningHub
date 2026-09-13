# 09 — Checklist (U9) · cls6/lectia5-tranzitii
Dovezi mecanice: `u9_verifica.py` → `u9_iesire.json`; `u3_verifica.py` → `u3_iesire.json`, `04_a_doua_cale.json`.

## R1-R6 din `knowledge/learninghub_calitate/00_INDEX.md`
| Regula | da/nu/n.a. | Unde |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | da în 9/10 (1/10 strict cea mai lungă) | `u9_iesire.json` |
| R1.2 distractori = greșeli reale | parțial — „Cca 10 secunde”, „Intotdeauna, pentru efect maxim”, „Nicio tranzitie, doar animatii” se elimină prin reflex | `innerText.txt` r. 194-201, 299-309, 639-648 |
| R1.3 poziția nu contează | da (ordinea din pagină diferă de JSON: la atomul 1 corecta e C pe ecran, „b” în JSON) | `innerText.txt` r. 164-176 |
| R1.4 cheia vs indiciu | da (10/10); indiciul repetă răspunsul în 6/10, vizibil doar după răspuns | `u9_iesire.json` |
| R1.5 un singur răspuns corect | da | data-quiz |
| R1.6 cheia = literă | da | data-quiz |
| R2.1 nu cere ce n-ai predat | **nu** — Ex.2 runda 3 cere Morph fără condiția „obiect comun”; Ex.3 cere 9 animații din lecția 4 (declarat în rezolvare) | r. 718, 747-757, 772 |
| R2.2 rezolvare model | da la toate 3 (Ex.3 = „schiță”) | r. 683, 722, 763 |
| R2.3 parole reale | n.a. | — |
| R3.1 exemplul înainte de definiție | da — „Încearcă tu” înainte de teorie, analogia cu filmul | r. 54-116 |
| R3.2 termenul explicat la prima folosire | **nu** — 5/10 întrebări înainte de atomul care predă (Shift+F5 și sunetele la atomul 2; Apply To All și On Mouse Click la 3-4) | `u3_iesire.json` quiz |
| R3.3 ieșire în sus | da („Vrei mai mult?”, Ex.3, Provocare Bonus) | r. 100, 800 |
| R3.4 cifrele/afirmațiile nu se bat cap în cap | **nu** — „Ambele bifate”: atomul 4 „trece automat dupa X secunde” vs rezolvarea Ex.3 „prezentarea tot asteapta click” | r. 468 vs 771; `04_a_doua_cale.json` |
| R3.5 separator | n.a. | — |
| R4.1 titlu = fișier = card = obiective | da | `01_citit_inapoi.md` |
| R4.1-ter frații pe același slot | ora 7 are 2 fișiere (lectia4 + lectia5) — timpul adunat în `u12_sensibilitate.txt` | `u12_sensibilitate.txt` |
| R4.2 cifre de navigare generate | n.a. | — |
| R4.3 note administrative | nu s-au găsit în textul vizibil | `innerText.txt` |
| R6.x (metodă) | R6.2: lecția rezolvată în 6 fișiere pptx recitite; R6.3: PDF LibreOffice citit înapoi | `07_redeschis.json`, `04_a_doua_cale.json` |

## Checklistul `LESSON_SPECIFICATION.md` (Grep `- [ ]`, r. 731-770)
| Item | da/nu/n.a. | Unde |
|:--|:--|:--|
| Identified curriculum position | parțial — nu spune că e jumătate din ora 7 | `01_citit_inapoi.md` |
| Read 2+ existing lessons / quiz before content | n.a. (proces de autor) | — |
| 4-8 atom topics | da (5) | `u9_iesire.json` |
| Quiz for each atom | da (2/atom) | idem |
| 3 exercises minim/standard/performanta | da, etichetate | `u9_iesire.json` niveluri |
| Valid HTML | nu am validat structural; paginile se randează fără erori în consolă | `consola.json` (0) |
| ZERO inline `<style>` | da (singurul „<style” e în comentariul r. 10) | Grep HTML |
| All 6 scripts, correct DEPTH | da: 6 scripturi cu `../../../../assets/js/` (r. 584-589) | Grep HTML |
| Init calls + LESSON_ID pattern | da: `cls6-m1-prezentari-lectia5-tranzitii` în 3 init-uri | `u9_iesire.json` |
| `<title>` matches content / grade | da („TIC Clasa a VI-a”) | `01_citit_inapoi.md` |
| Nav links prev/next | parțial — „Urmatoarea” → lectia6; „← Modulul” duce la index, nu la lectia4 | `u9_iesire.json` nav_links; HTML r. 17 |
| `lesson-summary` div | da (r. 566) | Grep |
| Romanian with proper diacritics | **nu** (1,2/1000) | `04_norma.md` |
| 4-8 atoms each with content + quiz | da | `u9_iesire.json` |
| Every quiz has hint / correct index | da | data-quiz |
| No TODO/PLACEHOLDER | da | `u9_iesire.json` |
| Pain comparison matches topic | da („Slide-urile se schimba brusc…”) | `innerText.txt` r. 34 |
| Summary bullets match atoms | parțial — „Dynamic (transformari magice)” preia categoria greșită; lipsesc spațiile după „:” | r. 786-798 |
| Exercises topic-specific | da | r. 661-783 |
| No `\"` escaped quotes inside data attributes | **nu** — atomul 3: `\"On Mouse Click\"`; atomii 1,2,4,5: `\&quot;` (JSON rămâne valid după decodare) | Grep HTML |
| data-quiz JSON valid | da (după decodarea atributului HTML) | `u9_iesire.json` |
| File size > 25KB | da (44.607 octeți) | `u9_iesire.json` |
| Images max-width | n.a. (0 imagini) | idem |
| Maps to OMEN 3393/2017 | da („Efecte de tranziție”, CS 1.1 VI) | `u16_programa.txt` |
| Difficulty grade-appropriate | **parțial** — Ex.3 și atomul 4 (kiosk, buclă) peste standardul de prezentări | `04_norma.md` |
| Exercises labeled | da | `u9_iesire.json` |
