# 09 — Checklist de pe hârtie (U9)

Surse: titlurile `###` din `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` și `- [ ]` din `C:\00\Projects\LearningHub\LESSON_SPECIFICATION.md` (:731-770). Verificat prin Grep în HTML și prin fișierele din acest folder.

## R1-R6 (00_INDEX.md)
| Regulă | da / nu / nu se aplică | Unde |
|:--|:--|:--|
| R1.1 varianta corectă nu e cea mai lungă | **nu** la 2 întrebări | atomul 3: `=AVERAGE(B1:B20)` e cea mai lungă; atomul 6: „8 (AVERAGE ignora celulele goale, calculeaza 24/3)” e cea mai lungă (`u3_iesire.json`) |
| R1.2 distractori = greșeli reale | da | `=MEDIA`, `=AVG`, „4.8 (imparte la 5)”, COUNT=COUNTA — greșeli plauzibile |
| R1.3 poziția | nu se aplică | motorul amestecă |
| R1.4 cheia vs indiciu | da | toate 9 chei recalculate (`04_a_doua_cale.json`) |
| R1.4-bis indiciul nu numește litera | da | indiciile citează valoarea, nu litera |
| R1.5 un singur răspuns corect | da | verificat pe cele 9 |
| R1.6 cheia = literă | da | `"correct": "c"` etc. (Grep `data-quiz`, 9 apariții) |
| R2.1 nu cere ce n-ai predat | **nu** (parțial) | atomul 3 întreabă de AVERAGE (predat în atomul 4); atomul 6 (fx) întreabă de AVERAGE cu goluri, nimic despre fx (`u3_iesire.json`) |
| R2.2 rezolvare model | da | toate 3 exercițiile au „Vezi rezolvarea”, corecte (`07_redeschis.json`) |
| R2.3 parole pe site-uri externe | nu se aplică | doar „cont Microsoft/Google” menționat, fără cerință de logare |
| R3.1 exemplul înainte de definiție | da | Încearcă înaintea atomilor |
| R3.2 termenul explicat la prima folosire | parțial | „argumente” explicat în atomul 2; „Function Wizard” fără numele din program |
| R3.3 ieșire în sus | da | Provocarea IF+AVERAGE |
| R3.4 cifrele nu se bat cap în cap | **nu** | „B4 din 10” și „B7 din 4” contrazic notele din B2:B9 ale aceleiași lecții (`u5_reproducere.txt`) |
| R3.5 separatorul declarat o dată pe modul | **nu** | IF și MIN(B2, B5, B8) cu virgulă, nicio declarație (Grep „separator”, „punct si virgula”: 0) |
| R4.1 titlu = fișier = card = obiective | **nu** (minor) | card index: „SUM, AVERAGE, COUNT, MAX, MIN” (fără IF, COUNTA); titlu fără COUNTA |
| R4.1-bis / R4.1-ter | da | fișierul predă funcții, frații lectia3/lectia5 nu se suprapun (în afară de SUM) |
| R4.2 cifre pe navigare generate | nu se aplică | nu am evaluat pagina de index |
| R4.3 note administrative afișate | da (curat) | „(conform programei)” în titlul atomului 9 și „listata explicit in programa OMEN 3393/2017” — notă pentru profesor afișată elevului; minor |
| R6.1-R6.7 | nu se aplică | reguli pentru martori/porți, nu pentru conținut |

## Checklistul din LESSON_SPECIFICATION.md
| Bifa | Rezultat | Unde |
|:--|:--|:--|
| :741 ZERO inline `<style>` | da | Grep `<style`: doar comentariul de la :10 |
| :742 6 scripturi cu DEPTH corect | da | :778-783, `../../../../assets/js/` |
| :743-744 init cu LESSON_ID `cls8-m1-excel-fundamente-lectia4-functii` | da | :786-796 |
| :745 `<title>` = conținut | parțial | lipsește COUNTA |
| :746 clasa în titlu | da | „TIC Clasa a VIII-a” |
| :747 nav prev/next | da | next = `lectia5-grafice.html` (:18, :771) |
| :748 `lesson-summary` ascuns | da | :760 |
| :751 diacritice | **nu** | 0,0 la 1000 (`04_norma.md`) |
| :752 4-8 atomi | **nu** | 9 atomi (`masuri.json` atomi = 9) |
| :753 fiecare întrebare are indiciu | da | 9/9 |
| :754 cheia corectă | da | `04_a_doua_cale.json` |
| :755 fără TODO/TBD/PLACEHOLDER | da | Grep: 0 |
| :757 rezumatul = ce predau atomii | da | 8 puncte, toate predate |
| :758 exerciții pe temă | da | note, meteo, COUNT/COUNTA |
| :763 `data-quiz` JSON valid | da | parsat de `u3_potrivire.py` fără eroare |
| :764 > 25 KB | da | 53.439 octeți |
| :768 competență OMEN | da | CS.1.1 (sumă, max, min, medie, decizie) |
| :769 dificultate pe clasă | da | |
| :770 exerciții etichetate minim/standard/performanta | da | `data-level` :690, :707, :725 |
