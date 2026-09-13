# 09 — Checklistul de pe hârtie (U9)

Surse: `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (titlurile R1-R6) și `LESSON_SPECIFICATION.md` (Grep `- \[ \]`, r. 731-770). Verificat prin Grep în HTML și prin scripturile din folder.

## R1-R6
| Regula | da / nu / n.a. | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **nu la 1/7** | „Intrare-Iesire (Input-Output)” e cea mai lungă variantă (`u5_iesire.json` A_chestionare) — minor |
| R1.2 distractori = greșeli reale | da, în mare | „Se transfera automat pe Hard Disk” e o confuzie reală; „Raman salvate pana cand bateria RAM se descarca” e inventat |
| R1.3 poziția | n.a. | motorul amestecă (ordinea din HTML ≠ ordinea randată) |
| R1.4 / R1.4-bis cheia vs indiciu, fără literă | da | indiciile nu numesc litera; 5/7 conțin textul variantei, 2/7 îl parafrazează |
| R1.5 un singur răspuns corect | da | 7/7 |
| R1.6 cheia e literă | da | `"correct": "b"` |
| R2.1 nu cere ce n-ai predat | **nu** | PSU întrebat la pasul 1, explicat la pasul 5; căutare Google (ora 14, 18.12) și Paint (ora 18, 29.01.2027) cerute în octombrie (`surse/calendar_5AM_5M_extras.txt`) |
| R2.2 rezolvare model | da | 3/3 exerciții au „Vezi rezolvarea” |
| R2.3 parole reale pe site-uri externe | n.a. | nu cere conturi |
| R3.1 exemplul înainte de definiție | **nu** | pașii 1 și 3 încep cu „Definitie:”, analogia vine după |
| R3.2 termenul explicat la prima folosire | parțial | „Cache”, „VRAM”, „PCIe”, „SATA”, „socket” explicate într-un rând; „flux de date”, „consultant IT” nu |
| R3.3 ieșire în sus | da | „Vrei mai mult?” |
| R3.4 cifrele nu se bat cap în cap | da | nicio contradicție internă găsită; dar „3 GHz = 3 miliarde operații” e greșit față de sursă (U3) |
| R3.5 separator | n.a. | fără formule |
| R4.1 titlu = fișier = obiective = oră | parțial | pasul 4 = ora 5 din plan; 12/12 dispozitive repetate din lecția 1 (`01_citit_inapoi.md`) |
| R4.2 cifre de navigare generate | da | „Pasul 1 din 5” generat de motor |
| R4.3 note administrative ascunse elevului | da, cu o rezervă | rezolvarea Ex. 3 are „Criterii:” pentru evaluator, dar e sub pliant |
| R6.1-R6.7 | n.a. | reguli pentru procesul de audit/reparație, nu pentru conținut |

## LESSON_SPECIFICATION.md
| Bifa | da / nu | Unde |
|:--|:--|:--|
| ZERO `<style>` inline | da | Grep: singura apariție e comentariul r. 10 |
| Toate scripturile + init cu LESSON_ID corect | da | 6 scripturi `../../../../assets/js/` + site-credit; `AtomicLearning.init('cls5-m1-sisteme-lectia2-hardware')` r. 648-658 |
| LESSON_ID = `{grade}-{module}-{filename}` | da | `cls5-m1-sisteme-lectia2-hardware` |
| `<title>` = conținut, „Clasa a V-a” | da | „Componentele Hardware ale Calculatorului \| TIC Clasa a V-a” |
| Nav prev/next | parțial | „Urmatoarea →” = lectia3-software.html; înapoi merge la modul, nu la lecția 1 |
| `lesson-summary` ascuns | da | r. 622 |
| **Diacritice în conținut** | **nu** | 0,0 la 1000 (`u3_iesire.json`) |
| 4-8 atomi cu quiz | da | 5 atomi, 5 `data-quiz`, 7 întrebări |
| Fiecare întrebare are indiciu | da | 7/7 |
| Cheia = varianta corectă | da | 7/7 (`04_a_doua_cale.json`) |
| Fără TODO/TBD/PLACEHOLDER | da | Grep: 0 |
| Rezumatul = ce predau atomii | da | 5 puncte, fiecare corespunde unui pas |
| Exerciții pe temă, etichetate minim/standard/performanță | da | r. 565, 580, 594 |
| Fără `\"` în atribute data | **nu** | `data-quiz` r. 140: `\"creierul\"` (JSON valid, dar bifa îl interzice) |
| `data-quiz` JSON valid | da | parsat de `u5_verifica.py` fără eroare |
| Fișier > 25 KB | da | 48.821 octeți |
| Imagini cu width 100% | n.a. | **0 imagini** — tocmai asta e problema |
| Mapată pe competența OMEN | da | CS.1.1 (`04_norma.md`) |
| Dificultate potrivită clasei | parțial | pasul 5 (VRAM, PSU 500-750 W, PCIe) peste nivelul orei; consultant IT la Ex. 3 |
