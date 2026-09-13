# 09 — Checklist de pe hârtie (U9)

## R1-R6 (`knowledge/learninghub_calitate/00_INDEX.md`)
| Regula | da / nu / n.a. | Unde |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **nu** la 1 din 10 | întrebarea 1 („Lichidele pot strica echipamentele electronice”), `u5_iesire.json` A1 |
| R1.2 distractori = greșeli reale | parțial | „Nu exista niciun motiv serios, doar o impresie” nu e greșeală de copil |
| R1.3 poziția | da (motorul amestecă) | innerText vs data-quiz: ordine diferită |
| R1.4 cheia vs indiciul | da, 10/10 | `04_a_doua_cale.json` rândul 2 |
| R1.4-bis indiciul nu numește litera | da | indiciile nu conțin „A/B/C/D” |
| R1.5 un singur răspuns corect | **nu** la scenariul Word | „Word recupereaza automat…” e parțial adevărat (Microsoft ro-ro) |
| R1.6 cheie literă | da | `"correct": "b"` |
| R2.1 nu ceri ce n-ai predat | **nu** | sarcina practică (foldere, Notepad, Save As) vine înainte de atomii 3-4; „pasii inainte de a porni” nu sunt predați |
| R2.2 rezolvare model | da | 3/3 exerciții au „Vezi rezolvarea” |
| R2.3 parole reale | da (nu cere) | lecția afișează însă un exemplu concret de parolă „M3uC@1ne!2025” |
| R3.1 exemplul înainte | da | analogiile (cada, ușa, ochelarii) vin înaintea regulii |
| R3.2 termen explicat | parțial | „shortcut”, „spyware” explicate; „RAM” explicat; „subfolder” nu |
| R3.3 ieșire în sus | da | „Vrei mai mult?” |
| R3.4 cifre care se bat cap în cap | **nu** | „Word … totul a disparut” vs „Multe programe moderne (Word…) au auto-salvare” |
| R3.5 separator | n.a. | nu are formule |
| R4.1 titlu = fișier = obiective | parțial | titlul „Reguli”; 3 din 5 obiective = pornire, fișiere, Ctrl+S (`01_citit_inapoi.md`) |
| R4.1-ter frații | **nu** | ora 2 = lecția 4 + lecția 5; fișierele = ora 9-10 (M2) |
| R4.3 note administrative | **nu** | nota „(programa cls. V, OMEN 3393/2017)” la pașii 6 și 7, vizibilă elevului |
| R6.2 oracolul care rezolvă | da | `u1_sarcina.py`, `u5_verifica.py`, `u7_salvare_raspuns.py` |
| R6.3 poarta de tipar | n.a. | lecția nu are fișă de tipărit |
| R6.4 clasă, nu caz | da | semnalările repetate trimit la lecțiile 3-4 |

## `LESSON_SPECIFICATION.md` §11 (Grep `- [ ]`)
| Punct | da/nu/n.a. | Unde |
|:--|:--|:--|
| curriculum position identificat | parțial | notele de la pașii 6-7; lipsește ora/săptămâna |
| 4-8 atomi | da | 7 atomi (`masuri.json`) |
| întrebări pe fiecare atom | da | 10 întrebări în 7 atomi |
| 3 exerciții minim/standard/performanță | da | „Nivel minim/standard/performanta” |
| valid HTML | n.a. (neverificat cu validator) | randat fără erori în consolă (`consola.json`: 0) |
| ZERO `<style>` inline | da | Grep: singurul „<style” e în comentariul de la r. 10 |
| 6 scripturi cu DEPTH corect | da | r. 800-805, `../../../../assets/js/` |
| init calls + LESSON_ID | da (parțial verificat) | cheia `practice-cls5-m1-sisteme-lectia5-reguli` în `localStorage` |
| `<title>` = conținut | parțial | vezi R4.1 |
| clasa în titlu = folder | da | „Clasa a V-a” / `cls5` |
| nav prev/next | da | „Urmatoarea” → `lectia6-proiect.html` |
| `lesson-summary` ascuns | da | r. 782 |
| diacritice | **nu** | 0,1 la 1000 (`04_norma.md`) |
| fiecare întrebare are indiciu | da | 10/10 |
| indexul corect = varianta corectă | da | 10/10 |
| fără TODO/PLACEHOLDER | da | Grep: 0 |
| rezumatul = atomii | da | „Ce ai invatat astazi” = cei 7 atomi |
| exerciții pe subiect | da | laborator, apă, poster |
| data-quiz JSON valid | da | parsat de `u5_verifica.py` |
| fișier > 25 KB | da | 47.728 octeți |
| imagini 100% | n.a. | 0 `<img>` |
| competență OMEN | parțial | CS.1.1 (norme) + CS.1.2 (fișiere) + CS.1.3 (internet) amestecate |
| dificultate pe clasă | parțial | Ex. 3 cere trei produse |
