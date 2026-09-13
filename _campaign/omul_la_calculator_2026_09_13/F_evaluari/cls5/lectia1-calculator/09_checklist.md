# 09 — Checklist de pe hârtie (U9)

Surse: `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (R1-R6, titluri) și `C:\00\Projects\LearningHub\LESSON_SPECIFICATION.md` rândurile 731-770 (Grep `- \[ \]`). Verificările de HTML = Grep pe fișierul lecției.

## R1-R6
| Regula | da/nu/nu se aplică | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | da | `u3_iesire.json`: 0 din 10 |
| R1.2 distractori = greșeli reale | **nu** (2 întrebări) | Î9: „KB este mai mica decat bit-ul, dar mai mare decat byte-ul si MB”, „GB e mai mare ca MB, dar MB e mai mic decat KB” — contradicții, nu greșeli de copil; Î6 „Boxele / Monitorul” sunt bune |
| R1.3 poziția nu contează | da | motorul amestecă (cheia `b` apare pe poziția A la Î1, `parcurgere.json`) |
| R1.4 cheia vs propriul indiciu | **nu** (Î7) | întrebarea „primul calculator electronic programabil”, feedbackul „unul dintre primele” |
| R1.4-bis indiciul nu numește litera | da | feedbackurile nu conțin litere |
| R1.5 un singur răspuns corect | da | 10/10 |
| R1.6 cheia e literă | da | `correct: "b"` etc. |
| R2.1 nu cere ce n-ai predat | da, cu o excepție minoră | Ex.2 cere „Tip” — televizorul nu e în tipuri; RAM apare la GB fără explicație |
| R2.2 rezolvare model | da | 3/3 pliante „Vezi rezolvarea” |
| R2.3 parole pe site-uri externe | nu se aplică | nu se cer conturi |
| R3.1 exemplul înainte de definiție | da | provocarea și analogia jocului înainte de definiție |
| R3.2 termen explicat la prima folosire | **nu** | „PROCESARE” în provocare înainte de pasul 2; „RAM tipica 4–16 GB” neexplicat |
| R3.3 ieșire în sus | da | „Vrei mai mult?”, „Bonus Challenge” |
| R3.4 cifre consecvente | da | 1024 peste tot; „~1000 … exact 1024” explicat |
| R3.5 separator formule | nu se aplică | fără formule |
| R4.1 titlu = fișier = obiective | **parțial** | titlul „Ce este un calculator”, obiectivele acoperă și I/O, generații, unități (orele 3, 5, 6) — `01_citit_inapoi.md` |
| R4.1-bis / ter | parțial | frații: lectia2-hardware acoperă și ea I/O (B_context_real §2) |
| R4.2 cifre de navigare generate | nu se aplică | — |
| R4.3 note administrative ascunse | da | nicio notă de programă vizibilă elevului |
| R6.1-R6.7 | nu se aplică la evaluarea unei lecții (reguli de proces) | R6.2 (oracolul care rezolvă) = făcut aici: `parcurgere.json`, `u1_raspunsuri_elev.json` |

## Checklistul din LESSON_SPECIFICATION.md
| Punct | da/nu | Unde |
|:--|:--|:--|
| Poziție în curriculum (clasă, modul, competență) | parțial | CS.1.1 corect; ora din plan acoperită doar parțial |
| 4-8 atomi | da | 6 (`masuri.json` atomi 6) |
| Întrebări pe fiecare atom | da | 10 întrebări, fiecare atom ≥ 1 |
| 3 exerciții minim/standard/performanță | da | Grep `data-level="minim|standard"`, titluri „Nivel minim/standard/performanta” |
| HTML valid / fără `<style>` inline | da | Grep `<style`: doar comentariul de la rândul 10 |
| 6 scripturi cu adâncimea corectă | da | `../../../../assets/js/` × 6 + `site-credit.js` |
| init cu LESSON_ID corect | da | `init('cls5-m1-sisteme-lectia1-calculator'` |
| `<title>` = conținut; clasa din titlu = folder | da | „Ce este un Calculator? \| TIC Clasa a V-a” |
| Linkuri nav prev/next | da | „← Modulul”, „Urmatoarea →” pe primul ecran |
| `lesson-summary` ascuns prezent | da | Grep `lesson-summary" style="display: none;"` |
| **Text românesc cu diacritice** | **nu** | 0,2 la 1000 (`04_norma.md`) |
| Fiecare întrebare are indiciu | da | `hint` prezent la 10/10 (script de citire data-quiz) |
| Indexul corect = varianta corectă | da | `u3_iesire.json` |
| Fără TODO/PLACEHOLDER | da | nimic în `innerText.txt` |
| Rezumatul = ce predau atomii | da | „Ce ai invatat astazi” acoperă toți cei 6 pași |
| Exerciții pe temă | da | toate despre calculatoare/IPO |
| `\"` escapate în atribute | **nu** (cosmetic) | textul „Vrei mai mult” afișează `\"calculator\"` și `\"compromis tehnic\"` cu backslash vizibil (`innerText.txt` rândurile 986-988) |
| `data-quiz` JSON valid | da | 6 blocuri, 10 întrebări, parsate cu `json.loads` |
| Fișier > 25 KB | da | 44.971 octeți |
| Imagini cu width 100% | nu se aplică | 0 `<img>` |
| Dificultate pe clasă | parțial | pasul 6 (2¹⁰, PB) e greu pentru a treia oră de clasa a V-a |
