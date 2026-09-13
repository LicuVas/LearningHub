# 09 — Checklist de pe hârtie (U9)

Surse: `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (R1-R6) și `LESSON_SPECIFICATION.md` r. 731-770 (Grep `- [ ]`). Verificări mecanice: `u9_quiz.json`, `u3_iesire.json`.

## R1-R6
| Regula | da / nu / n.a. | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **nu** | u9_quiz.json: 7 din 12 răspunsuri corecte sunt cea mai lungă variantă (ex. „Text inchis pe fundal deschis (contrast ridicat)”) |
| R1.2 distractori = greșeli reale | parțial | „Click direct pe slide si scrie” e greșeală reală; „Text galben pe fundal portocaliu” / „6 fonturi diferite si 6 culori” se elimină prin reflex |
| R1.4 cheia vs indiciu | da | cheile verificate pe text (u3_iesire.json); indiciile confirmă varianta |
| R1.5 un singur răspuns corect | da | 12/12 |
| R1.6 cheia literă, valoarea listă | da | JSON parsat fără erori (u9_quiz.json) |
| R2.1 nu cere ce nu ai predat | **nu** | întrebări despre SmartArt / Bring to Front / Ctrl+G înainte de atomii 7, 9; Ex.1 minim cere forme + reguli din atomii 6, 10 marcați „extindere” |
| R2.2 rezolvare model | da | toate 3 exercițiile au „Vezi rezolvarea” |
| R2.3 fără parole pe site-uri externe | da | nicio parolă; dar Ex.1 cere numele familiei (04_norma.md) |
| R3.1 exemplul înainte de definiție | nu | fiecare atom începe cu „Definitie:” |
| R3.2 termenul explicat la prima folosire | parțial | „licenta Creative Commons” (innerText r. 402) și „Gradient stops” (r. 768) folosite fără explicație; „layout” e din lecția 2 |
| R3.3 ieșire în sus | da | Ex.3 + „Vrei mai mult?” |
| R3.4 cifrele nu se bat cap în cap | **nu** | „PowerPoint 2013 si ulterioare” (atomul 4) vs „In PowerPoint 365/2021 ... in versiunile mai vechi tine si Shift” (atomul 5) |
| R3.5 separator formule | n.a. | nu sunt formule |
| R4.1 titlu = fișier = obiective | parțial | titlul promite text + imagini; lecția conține și forme, SmartArt, WordArt, aranjare, reguli de design (ora 8) |
| R4.3 note administrative ascunse | **nu** | „Nota programa: SmartArt nu este mentionat explicit...” și „Nota programa (OMEN 3393/2017)” afișate elevului |
| R6.2 oracolul care rezolvă | da | H_vede a parcurs 10/10 pași fără blocaj (masuri.json) |

## Checklistul din LESSON_SPECIFICATION.md
| Punct | da/nu/n.a. | Unde |
|:--|:--|:--|
| Poziția în curriculum identificată | parțial | notele de programă există; ora din plan nu e scrisă |
| 4-8 atomi | **nu** | 10 atomi (spec r. 752: „4-8 atoms present”) |
| Quiz pe fiecare atom | da | 10/10 atomi au data-quiz (12 întrebări) |
| 3 exerciții minim/standard/performanță, etichetate | da | „Exercitiul 1 (Nivel minim)” ... „Exercitiul 3 (Nivel performanta)” |
| HTML valid, ZERO `<style>` inline | da | singurul „<style” e în comentariul de la r. 10 |
| Toate scripturile / init cu LESSON_ID corect | da | 7 `<script src>`; init `cls6-m1-prezentari-lectia3-text-imagini` ×3 + LearningProgress('cls6') |
| `<title>` = conținut, clasa = folder | da | „TIC Clasa a VI-a” |
| `lesson-summary` ascuns prezent | da | u9_quiz.json lesson_summary_div = true |
| Diacritice în conținut | **nu** | 0,1 la 1000 (log.json) |
| Fiecare întrebare are hint | da | fara_hint = 0 |
| Index corect = varianta corectă | da | verificat pe text |
| Fără TODO/PLACEHOLDER | da | todo = 0 |
| Rezumatul = ce predau atomii | da | 10 puncte, câte unul pe atom |
| Exerciții pe temă | da | |
| Fără `\"` în atribute data | **nu** (formal) | atom-6: `regula \"6x6\"` în data-quiz; JSON-ul se parsează corect |
| Mărime > 25 KB | da | 59.231 octeți |
| Imagini cu width 100% | n.a. | 0 `<img>` |
| Competență OMEN | da | CS.1.1 / CS.3.1 (u16_programa.txt) |
| Dificultate pe clasă | parțial | 5.540 de cuvinte, 10 atomi pentru o oră de clasa a VI-a |
