# 09 — Checklistul de pe hârtie (U9): R1-R6 din `00_INDEX.md` + `LESSON_SPECIFICATION.md`

## R1-R6 (`C:/00/AI_0/knowledge/learninghub_calitate/00_INDEX.md`)
| Regula | Da/Nu/N.A. | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | da | `u9_chestionare_lungimi.json`: 0 din 11 |
| R1.2 distractori = greșeli reale | parțial | grila 10 „Este corect sa apesi Enter de cateva ori” și grila 11 „macro” se elimină prin reflex |
| R1.3 poziția nu contează | da | motorul amestecă; cheile verificate după amestecare |
| R1.4 cheia vs indiciu | da | toate 11 corespund atomului |
| R1.4-bis indiciul nu numește litera | da | indiciile dau numele, nu litera |
| R1.5 un singur răspuns corect | da | — |
| R1.6 cheie literă | da | `"correct": "b"` |
| R2.1 nu cere ce n-ai predat | **nu** | imaginea (atom 6b, Ex.1 pct. 6, Ex.3 pct. 5, grila 11) — `u1_predat_vs_cerut.txt` |
| R2.2 rezolvare model | da, dar | există la Ex.1-3; rezolvarea Ex.2 contrazice cerința (3x6 vs 3x5) |
| R2.3 parole reale | n.a. | — |
| R3.1 exemplul înaintea definiției | n.a. | evaluare |
| R3.2 termen explicat | nu | Wrap Text, Crop, Picture Styles apar întâi aici |
| R3.3 ieșire în sus | da | „Vrei mai mult?” (dar Ctrl+A strică titlul, `u1_iesire.json`) |
| R3.4 cifre care nu se bat cap în cap | **nu** | Ctrl+A: atomul 5 vs atomul 7; Ex.2 5 vs 6 rânduri |
| R3.5 separator | n.a. | Word |
| R4.1 titlu = fișier = card = obiective | **nu** | card index „Aplicatie practica: Primul meu document” vs h1 „Evaluare - Word Fundamente” (`u9_grep_spec.txt`) |
| R4.2 cifre generate | n.a. | — |
| R4.3 note administrative | da | niciuna vizibilă |
| R6.2 oracolul care rezolvă | făcut | `produs_elev/`, `randat_docx/` |
| R6.3 poarta de tipar | făcut pe produs | `randat_docx/*.pdf` |

## `LESSON_SPECIFICATION.md` (Grep `- \[ \]`)
| Rândul spec | Da/Nu/N.A. | Dovada |
|:--|:--|:--|
| 731 poziția în curriculum | nu | cardul și planul spun altceva: ora 10 cere test + barem; pagina e recapitulare |
| 733 4-8 atomi | **nu** | 11 atomi (`masuri.json`, `u9_grep_spec.txt`) |
| 734 grilă pe atom | da | 11 `data-quiz` |
| 735 3 exerciții minim/standard/performanta | da | `data-level` minim/standard/performanta |
| 740 HTML valid | da | H_vede a parcurs 11/11 pași, consola 0 erori |
| 741 zero `<style>` inline | da | singura potrivire e comentariul „NO inline <style> blocks” (r.11) |
| 742 scripturile | da | 7 `<script src` (6 + site-credit) |
| 743-744 init + LESSON_ID | da | `cls7-m1-word-fundamente-lectia6-evaluare` |
| 745 title = conținut | da | „Evaluare Word” |
| 746 clasa în titlu | da | „Clasa a VII-a” |
| 747 navigare | da | ← lectia5-tabele.html; Modulul 2 → |
| 748 lesson-summary | da | 1 |
| 751 diacritice | **nu** | 0,0 la 1000 (`log.json`, `04_norma.md`) |
| 753 indiciu la fiecare grilă | da | 11 indicii 💡 în `innerText.txt` |
| 754 cheia corectă | da (formal) | grila 11 corectă formal, falsă față de lecțiile 1-5 |
| 755 fără TODO | da | 0 |
| 757 rezumatul = atomii | da | „Ce ai invatat astazi” = 11 titluri |
| 758 exerciții pe temă | da | — |
| 763 JSON valid | da | parsat în `u3_u7_verifica.py` |
| 764 > 25 KB | da | 52.723 octeți |
| 765 imagini 100% | n.a. | 0 `<img>` — o lecție despre imagini fără nicio imagine |
| 768 competență OMEN | da | CS 1.1 / 3.1 invocate |
| 770 niveluri etichetate | da | — |
