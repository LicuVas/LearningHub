# 09 — Checklistul de pe hârtie (U9)

## R1-R6 (`knowledge/learninghub_calitate/00_INDEX.md`)
| Regula | da/nu/n.a. | Unde |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | da | script pe `data-quiz`: la 7/7 corecta nu e strict cea mai lungă (atomii 2 și 6: egală cu un distractor) |
| R1.2 distractori reali | parțial | atomul 4 (`=SUM(B2-B6)`, `=SUM(B2,B6)`) și 5 (`=SUM(B3:D3)`) = greșeli reale; atomul 6 „repornești Excel” = distractor de reflex |
| R1.3 poziția | n.a. | regula spune că motorul amestecă; nu am verificat amestecarea aici (în `pas_05.png` corecta apare pe C) |
| R1.4 cheia vs indiciu | da | `u3_iesire.json`: indiciul explică varianta corectă la 7/7 (la 3 fără să-i repete cuvintele) |
| R1.5 un singur răspuns | da | fiecare întrebare are o singură variantă corectă (verificat pe valori: `=SUM(B5:D5)`, 21 etc.) |
| R1.6 cheia literă | da | `"correct": "b"`, `"c"`, `"a"` |
| R2.1 nu ceri ce n-ai predat | **nu** | `u3_iesire.json`: atomul 2 întreabă de actualizarea automată (predată în atomul 3); atomul 4 întreabă de `=SUM(B2:B6)` (SUM predat în atomul 6); Ex. 3 cere „bara de formule”, doar numită o dată |
| R2.2 rezolvare model | da | 3/3 exerciții au rezolvare pliată și se potrivesc cerințelor (valori recalculate: 30/7,5; 6580/5875; 18,67/8) — dar rezolvarea Ex. 2 explică greșit varianta fără `$` (cls8-l3-02) |
| R2.3 parole externe | n.a. | — (Excel Online „cu cont Microsoft” → anexa `fara_cont_email_stick`) |
| R3.1 exemplu înainte de definiție | da | Încearcă înainte de atomi |
| R3.2 termen explicat | parțial | „referinta relativa” explicată; „drag handle” explicat, dar cu nume care nu e al Excel-ului; „bara de formule”, „auto-fill” doar folosite |
| R3.3 ieșire în sus | da | „Vrei mai mult?” (Provocarea cu `$E$1`) |
| R3.4 cifre consecvente | **nu** | Încearcă: „78 (27 + 21 + 29)” vs atomul 6: „27+21+29 = 77”; tabelul final: „9.00 / 7 / 9.67” |
| R3.5 separator declarat | **nu** | zecimale cu punct (`=3.5*10`, 7.50, 18.67) fără declarație pentru Windows în română (`04_mediu.md`) |
| R4.1 titlu = fișier = obiective | da, cu rest | titlu/fișier/obiective = formule; obiectivele includ referințele absolute, prezente; SUM folosit fără să fie obiectiv (`01_citit_inapoi.md`) |
| R4.1-bis / ter | da | rezolvările sunt ale exercițiilor proprii (verificat manual pe valori, `04_a_doua_cale.json`) |
| R4.2 cifre generate | n.a. | — |
| R4.3 note administrative | da | niciuna vizibilă |
| R6.2 oracolul care rezolvă | da | `parcurgere.json`: 7 pași, 0 blocați |
| R6.3 tipar | n.a. | lecție web |

## `LESSON_SPECIFICATION.md` (Grep `- [ ]`)
| Punct | da/nu/n.a. | Unde |
|:--|:--|:--|
| fără `<style>` inline | da | Grep: singurul `<style` e în comentariul „NO inline <style> blocks” (r. 10) |
| 6 scripturi cu adâncimea corectă | da | r. 631-636, `../../../../assets/js/…` |
| init cu LESSON_ID | da | r. 639-641 `init('cls8-m1-excel-fundamente-lectia3-formule')`, r. 649 LearningProgress |
| LESSON_ID = `{grade}-{module}-{filename}` | da | `cls8-m1-excel-fundamente-lectia3-formule` |
| `<title>` fără diacritice, clasa în titlu | da | „Formule de Baza in Excel \| TIC Clasa a VIII-a” |
| nav prev/next | da | „← Modulul” → index.html; „Urmatoarea” → lectia4-functii.html (r. 17-18, 624) |
| `lesson-summary` ascuns | da | r. 613 |
| **diacritice în conținut** (:751) | **nu** | 0,0 la 1000 (`04_norma.md`) |
| 4-8 atomi cu quiz | da | 7 atomi, 7 `data-quiz` |
| fiecare quiz are hint | da | 7/7 (script pe `data-quiz`) |
| indexul corect = varianta corectă | da | verificat pe conținut (atomul 5: `=SUM(B5:D5)` = c) |
| blocuri copiabile utilizabile | da | Tab între coloane în toate 3 (`u1_iesire.json`) |
