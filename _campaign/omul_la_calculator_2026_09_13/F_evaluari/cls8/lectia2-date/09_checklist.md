# 09 — Checklistul de pe hârtie (U9)

## R1-R6 (`knowledge/learninghub_calitate/00_INDEX.md`)
| Regula | da/nu/n.a. | Unde |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | da | scriptul din data-quiz: la toate 7 întrebări varianta corectă NU e cea mai lungă |
| R1.2 distractori reali | parțial | atomul 5 (Ctrl+I/U/F) ok; atomul 3 „imprimanta e defecta” — distractor de reflex |
| R1.3 poziția | n.a. | motorul amestecă (în randare cheia a apărut pe D, A, C…) |
| R1.4 cheia vs indiciu | da | `u3_iesire.json`: cheia apare în indiciu la 6/7 (la Percentage indiciul dă „85%”, formulat numeric) |
| R1.5 un singur răspuns | da | la atomul 7 „note centrate sau la dreapta” — D rămâne singura potrivită |
| R1.6 cheia literă | da | `"correct": "b"` etc. |
| R2.1 nu ceri ce n-ai predat | **nu** | `u3_iesire.json`: întrebarea atomului 3 (gridlines) e predată în atomul 4; întrebarea atomului 4 (Merge) e predată în atomul 5 |
| R2.2 rezolvare model | da | toate 3 exercițiile au rezolvare pliată, și — spre deosebire de lecția 1 — **se potrivesc cu propriile cerințe** (u3: 69% / 64% / 29% cuvinte comune; Ex. 3 e deschis) |
| R2.3 parole externe | n.a. | — (dar „Google Sheets” cere cont Google — anexa `fara_cont_email_stick`) |
| R3.1 exemplu înainte de definiție | da | Încearcă înainte de atomi |
| R3.2 termen explicat | parțial | „numar serial” explicat; „Flash Fill”/„Wrap Text” doar numite |
| R3.3 ieșire în sus | da | „Vrei mai mult?” (telefonul cu 0) |
| R3.4 cifre consecvente | **nu** | Ex. 2: „TOTAL GENERAL: 47.50 lei” vs rezolvarea 62.10 (`04_a_doua_cale.json`) |
| R3.5 separator declarat | **nu** | punct zecimal peste tot, nicio declarație pentru setarea românească (lecția știe: „1.5 in engleza = 1,5 in romana”) |
| R4.1 titlu = fișier = obiective | parțial | fișier „date”, titlul și obiectivele = date + formatare (`01_citit_inapoi.md`) |
| R4.1-bis / ter | da | rezolvările nu sunt ale altor exerciții (verificat cu u3) |
| R4.2 cifre generate | n.a. | — |
| R4.3 note administrative | da | niciuna vizibilă |
| R6.2 oracolul care rezolvă | da | `parcurgere.json`: 7 pași, 0 blocați |
| R6.3 tipar | n.a. | lecție web |

## `LESSON_SPECIFICATION.md` (Grep `- [ ]`)
| Punct | da/nu/n.a. | Unde |
|:--|:--|:--|
| valid HTML / fără `<style>` inline | da | grep: singurul `<style` e în comentariul „NO inline <style> blocks” (r. 10) |
| 6 scripturi cu adâncimea corectă | da | r. 672-677, `../../../../assets/js/…` |
| init cu LESSON_ID | da | r. 680-682 `init('cls8-m1-excel-fundamente-lectia2-date')`, r. 690 |
| LESSON_ID = `{grade}-{module}-{filename}` | da | `cls8-m1-excel-fundamente-lectia2-date` |
| `<title>` = conținut; clasa în titlu | da | „TIC Clasa a VIII-a” |
| nav prev/next | da | „← Modulul” → index.html; „Urmatoarea” → lectia3-formule.html (r. 18, 665) |
| `lesson-summary` ascuns | da | r. 654 |
| **diacritice în conținut** (:751) | **nu** | 0,0 la 1000 (`04_norma.md`) |
| 4-8 atomi cu quiz | da | 7 |
| fiecare quiz are hint | da | 7/7 |
| indexul corect = varianta corectă | da | verificat pe data-quiz |
| fără TODO/TBD/PLACEHOLDER | da | grep: 0 |
| rezumatul = ce predau atomii | parțial | „Ce ai invatat” include „Underline, Font Color” (ok) dar nu „Currency” din Ex. 2 separat |
| exerciții pe subiect, etichetate minim/standard/performanta | da | `data-level` r. 542, 574, 609 |
| fișier > 25KB | da | 44.388 octeți |
| competență OMEN | da | CS.1.1 (curriculum.json) |
| dificultate pe clasă | parțial | Ex. 3 cere 2 tabele inexistente |
