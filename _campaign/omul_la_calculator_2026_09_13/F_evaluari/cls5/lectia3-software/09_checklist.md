# 09 — Checklistul de pe hârtie (U9)

Surse: `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (R1-R6) și `LESSON_SPECIFICATION.md` (Grep `- \[ \]`, rândurile 731-770). Verificări mecanice: `u9_verifica.py` → `u9_iesire.json`.

## R1-R6
| Regula | da / nu / n.a. | Unde |
|:--|:--|:--|
| R1.1 varianta corectă nu e cea mai lungă | **da** | `u9_iesire.json` → 0/8 corecte cele mai lungi |
| R1.2 distractori = greșeli reale | da, în mare | „software-ul e mereu gratuit”, „dosarele ocupă mai puțin spațiu” sunt confuzii reale |
| R1.3 poziția nu contează | da | motorul amestecă (cheia „b” apare ca A/C pe ecran, `parcurgere.json`) |
| R1.4 cheia vs propriul indiciu | da | 8/8 (`04_a_doua_cale.json` rândul 1) |
| R1.4-bis indiciul nu numește litera | da | indiciile nu conțin litere |
| R1.5 un singur răspuns corect | da | verificat pe cele 8 |
| R1.6 cheia e literă | da | `"correct": "b"` |
| R2.1 nu cere ce nu ai predat | **nu** | Ex. 3 pct. 2 (scurtătură / dezinstalare) — rezolvarea scrie singură „NU apare in aceasta lectie”; Ex. 2 cere 2 categorii după ce s-au predat 3 |
| R2.2 rezolvare model | da, dar greșită la Ex. 2 (antivirus) | `u5_iesire.json` → `A_antivirus` |
| R2.3 parole pe site-uri externe | n.a. | nu cere conturi |
| R3.1 exemplul înaintea definiției | da | provocarea practică vine înainte de pași |
| R3.2 termen explicat la prima folosire | **nu** parțial | „Firmware”, „BIOS”, „Device drivers”, „Cleanup Tools”, „defragmentare” fără explicație pentru 11 ani |
| R3.3 ieșire în sus | da | „Vrei mai mult?” (Task Manager, asocieri) |
| R3.4 cifrele nu se bat cap în cap | **nu** (clasificare, nu cifre) | 3 categorii la pasul 3 vs 2 în obiective și Ex. 2 |
| R3.5 separator declarat | n.a. | fără formule |
| R4.1 titlu = fișier = obiective | parțial | fișier = titlu; obiectivele 3-5 = sistem de operare, alt modul (`01_citit_inapoi.md`) |
| R4.1-ter frații pe același slot | **nu** | lecția e în M1, planul o pune în M2 orele 8-11 |
| R4.2 cifre de navigare generate | n.a. | nu am verificat indexul modulului (în afara lecției) |
| R4.3 note administrative ascunse | da | nicio notă administrativă vizibilă |
| R6.x (reguli de proces pentru audit) | n.a. pentru lecție | aplicate în această evaluare: R6.2 (am rezolvat lecția), R6.4 (tiparul „✓ Corect!” repetat) |

## LESSON_SPECIFICATION.md
| Bifa | da / nu / n.a. | Unde |
|:--|:--|:--|
| Curriculum position (grade, module, week, competency) | **nu** | nicio mențiune OMEN/competență în HTML (`mentiune_OMEN: false`); modul greșit față de plan |
| 2+ existing lessons read / 4-8 atoms / quiz per atom | da | 5 atomi, fiecare cu chestionar |
| 3 exerciții minim/standard/performanță | da | etichetate explicit |
| Valid HTML | nu am verificat complet | pagina se randează fără erori în consolă (`consola.json` 0) |
| ZERO inline `<style>` | da | singura potrivire e comentariul de pe linia 10 |
| All 6 scripts with correct DEPTH | da | 6 scripturi `../../../../assets/js/` (liniile 624-629) |
| Init calls with LESSON_ID | da | `cls5-m1-sisteme-lectia3-software` (liniile 632-642) |
| LESSON_ID pattern | da | idem |
| `<title>` matches content | da | „Software - Programe si Aplicatii | TIC Clasa a V-a” |
| Grade in title matches folder | da | cls5 → Clasa a V-a |
| Nav prev/next | da | ← Modulul / lectia4-ergonomie.html |
| `lesson-summary` div | da | `lesson_summary_div: true` |
| Romanian text with proper diacritics | **nu** | 0,0/1000 (`04_norma.md`) |
| Every quiz question has a hint | da | 8/8, dar toate încep cu „✓ Corect!” și apar și după răspuns greșit (`u5_iesire.json`) |
| Correct answer index matches | da | 8/8 |
| No TODO/PLACEHOLDER | da | `placeholder: []` |
| Summary matches atoms | da | cele 5 rânduri din „Ce ai invatat astazi” = cei 5 pași |
| Practice exercises topic-specific | da | |
| data-quiz JSON valid | da | 5 blocuri parsate fără eroare |
| File size > 25KB | da | 36,8 KB |
| All image tags width 100% | n.a. | 0 `<img>` |
| Maps to OMEN 3393/2017 competency | **nu** în fișier | din conținut ar fi CS.1.2 |
| Grade-appropriate difficulty | parțial | firmware/BIOS/defragmentare peste nivelul V |
| Exercises labeled minim/standard/performanta | da | |
