# 09 — Checklistul de pe hârtie (U9)

Surse: `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (R1-R6) și `LESSON_SPECIFICATION.md` (Grep `- \[ \]`, rândurile 731-770). Verificări mecanice: `u9_verifica.py` → `u9_iesire.json`; reproduceri `u5_verifica.py` → `u5_iesire.json`.

## R1-R6
| Regula | da / nu / n.a. | Unde |
|:--|:--|:--|
| R1.1 varianta corectă nu e cea mai lungă | **nu** | `u9_iesire.json` → 5 din 6 întrebări au varianta corectă cea mai lungă |
| R1.2 distractori = greșeli reale | **nu** în mare | „Lucreaza 20 ore pe zi la calculator”, „2 metri (foarte departe)”, „Vederea lui se va imbunatati” — nimeni nu le alege |
| R1.3 poziția nu contează | da | cheia „a” din data-quiz apare ca B pe ecran (`innerText.txt` r. 430) |
| R1.4 cheia vs propriul indiciu | da | 6/6 (`04_a_doua_cale.json` ultimul rând) |
| R1.4-bis indiciul nu numește litera | da | fără litere în indicii |
| R1.5 un singur răspuns corect | da | 6/6 |
| R1.6 cheia e literă | da | `"correct": "a"` / `"b"` |
| R2.1 nu cere ce nu ai predat | **nu** parțial | întrebarea despre pauze („Cat de des ar trebui sa iei pauze active”) e la pasul 1, pauzele se predau la pasul 5; punctul 10 din checklist la fel |
| R2.2 rezolvare model | da | 3/3 exerciții; Ex. 2 are orele 15/17/19 care contrazic regula (`u5_iesire.json` A2) |
| R2.3 parole pe site-uri externe | n.a. | nu cere conturi; cere descărcare de aplicații (vezi anexă) |
| R3.1 exemplul înaintea definiției | da | „Incearca singur!” vine înainte de pasul 1 |
| R3.2 termen explicat la prima folosire | **nu** parțial | „sindrom tunel carpian”, „asthenopia digitala”, „sedentarism” fără explicație pentru 11 ani |
| R3.3 ieșire în sus | da | „Vrei mai mult?” |
| R3.4 cifrele nu se bat cap în cap | **nu** | „20 de pasi” = „6 metri”; regula la 20 min vs reminder-e la 120 min; „45-60 minute” vs „reminder pe telefon la fiecare ora” |
| R3.5 separator declarat | n.a. | fără formule |
| R4.1 titlu = fișier = obiective | da | toate spun ergonomie |
| R4.1-ter frații pe același slot | **nu** | planul pune ergonomia la ora 2 (prima lecție de predare); site-ul o pune a 4-a; normele de securitate ale aceleiași ore sunt în lecția 5 |
| R4.2 cifre de navigare generate | n.a. | indexul modulului nu e în lecție |
| R4.3 note administrative ascunse | da | niciuna vizibilă |
| R6.x (reguli de proces) | n.a. pentru lecție | aplicate: R6.2 (am rezolvat lecția), R6.4 („Corect!” după greșit = clasă, a 3-a lecție) |

## LESSON_SPECIFICATION.md
| Bifa | da / nu / n.a. | Unde |
|:--|:--|:--|
| Curriculum position (grade, module, week, competency) | **nu** | `mentiune_OMEN: false` |
| 4-8 atoms, quiz per atom | da | 5 atomi, 6 întrebări |
| 3 exerciții minim/standard/performanță | da | etichetate explicit |
| Valid HTML | nu am verificat complet | consolă curată (`consola.json`, 0 mesaje) |
| ZERO inline `<style>` | da | singura potrivire e comentariul de pe linia 10 |
| All 6 scripts with correct DEPTH / init / LESSON_ID | da | `cls5-m1-sisteme-lectia4-ergonomie` (`u9_iesire.json`) |
| `<title>` matches content / grade in title | da | „Ergonomie si Sanatate la Calculator | TIC Clasa a V-a” |
| Nav prev/next | da | ← Modulul / `lectia5-reguli.html` |
| `lesson-summary` div | da | `lesson_summary_div: true` |
| Romanian text with proper diacritics | **nu** | 0,1/1000 (`04_norma.md`) |
| Every quiz question has a hint | da, dar | 6/6; toate încep cu „Corect!/Perfect!/Excelent!/Exact!” și apar și după răspuns greșit (`u5_iesire.json` B) |
| Correct answer index matches | da | 6/6 |
| No TODO/PLACEHOLDER | da | `placeholder: []` |
| Summary matches atoms | da | cele 5 rânduri din „Ce ai invatat astazi” = cei 5 pași |
| Practice exercises topic-specific | da | |
| data-quiz JSON valid | da | 6 întrebări parsate fără eroare |
| File size > 25KB | da | 36,1 KB |
| All image tags width 100% | n.a. | 0 `<img>` — lecție de postură fără niciun desen |
| Maps to OMEN 3393/2017 competency | **nu** în fișier | din conținut: CS.1.1, domeniul „Norme de ergonomie și de siguranță” |
| Grade-appropriate difficulty | parțial | termeni medicali (asthenopia, tunel carpian) peste nivel |
| Exercises labeled | da | |
