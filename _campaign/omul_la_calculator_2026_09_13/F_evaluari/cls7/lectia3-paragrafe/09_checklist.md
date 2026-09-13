# 09 — Checklistul de pe hârtie (U9) · lectia3-paragrafe

Surse: `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (R1-R6) și `LESSON_SPECIFICATION.md` r.731-770 (Grep `- [ ]`). Verificat prin Grep în HTML, scripturi și innerText.txt.

## R1-R6
| Regula | da / nu / nu se aplică | Unde |
|:--|:--|:--|
| R1.1 varianta corectă nu e cea mai lungă | **nu, la 1 din 10** (First Line Indent vs Left/Hanging) — minor | u9_chestionare_lungimi.json |
| R1.2 distractori = greșeli reale | da (Ctrl+L/R, Home>Font>Ruler, Enter de mai multe ori) | innerText r.219-228, 427-436, 1072-1081 |
| R1.3 poziția | nu se aplică (motorul amestecă) | — |
| R1.4 cheia vs indiciu | da, 10/10 | 04_a_doua_cale.json rândul 6 |
| R1.4-bis indiciul nu numește litera | da | hint-urile din data-quiz |
| R1.5 un singur răspuns corect | da | citit la fiecare întrebare |
| R1.6 cheia = literă | da („correct”: „b”) | HTML r.90 |
| R2.1 nu cere ce n-a predat | da — dar tabulatorii și chenarele predate NU sunt exersate | 01_citit_inapoi.md |
| R2.2 rezolvare model | da, la toate 3 exercițiile (pliate) | innerText r.1110, 1142, 1173 |
| R2.3 fără parole pe site-uri externe | nu se aplică | — |
| R3.1 exemplul înainte de definiție | **nu** — fiecare atom începe cu definiția; exemplul vine la final | innerText r.57-125 |
| R3.2 termen explicat la prima folosire | da (paragraf, pilcrow, pt, lider) | r.57, 84, 589-592, 735 |
| R3.3 ieșire în sus | da („Vrei mai mult?” — Hanging Indent) | r.1213-1217 |
| R3.4 cifrele nu se bat cap în cap | **nu, minor**: „Text obisnuit: 0 pt Before, 8-12 pt After” vs „un spatiu de 8-10 pt After este suficient” | r.609-611 vs r.642-643 |
| R3.5 separatorul | nu se aplică (Word) | — |
| R4.1 titlu = fișier = obiective | parțial — obiectivele listează 5 din 10 atomi | 01_citit_inapoi.md |
| R4.1-bis / ter | da (fișier = conținut; frații lectia2/lectia4 legați corect) | HTML r.17, 20 |
| R4.2 cifre pe paginile de navigare | nu se aplică (pagină de lecție) | — |
| R4.3 fără note administrative | da (nicio notă vizibilă) | innerText integral |
| R6.2 oracolul care rezolvă | da — am făcut exercițiile | produs_elev/, u3_iesire.json |
| R6.3 poarta de tipar | da — PDF randat și citit înapoi | randat_docx/, u3_u7_verifica.py |

## LESSON_SPECIFICATION.md
| Bifa | da/nu | Unde |
|:--|:--|:--|
| ZERO inline `<style>` | da — singura potrivire e comentariul „NO inline <style> blocks” | HTML r.11 |
| 6 scripturi cu DEPTH corect | da (atomic-learning, practice-simple, lesson-summary, breadcrumb, progress, user-system) | HTML r.1592-1602 |
| init cu LESSON_ID corect | da, `cls7-m1-word-fundamente-lectia3-paragrafe` | HTML r.1606-1616 |
| `<title>` = conținut, clasa corectă | da | masuri.json |
| Nav prev/next | da (lectia2 / lectia4) | HTML r.17, 20, 1582 |
| `lesson-summary` display:none | da | HTML r.1567 |
| **Diacritice în conținut** | **NU** — 0,0 la 1000 | log.json, 04_norma.md |
| 4-8 atomi | **nu — 10 atomi** | masuri.json |
| Fiecare quiz are hint; cheia corectă | da / da | 04_a_doua_cale.json |
| Fără TODO/TBD/PLACEHOLDER | da (0 potriviri) | Grep |
| Rezumatul = ce predau atomii | da (10 puncte = 10 atomi) | innerText r.1191-1211 |
| Exerciții pe temă, etichetate minim/standard/performanță | da | HTML r.1437, 1467, 1497 |
| `data-quiz` JSON valid | da (parsat de u3_u7_verifica.py) | u3_iesire.json |
| Fără `\"` în atribute | da (0) | Grep |
| Mărime > 25 KB | da (57.987 octeți) | wc |
| Imagini cu width 100% | nu se aplică (0 imagini) | Grep `<img` = 0 |
| Competență OMEN 3393/2017 | da, CS.1.1 VII | 04_norma.md |
