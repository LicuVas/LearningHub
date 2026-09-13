# 09 — Checklist (U9) — cls8 / lectia6-proiect

## R1-R6 din `knowledge/learninghub_calitate/00_INDEX.md`
| Regula | Bifă | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **nu** (1 din 5) | atomul 5: „a) Orientation: Landscape - ca sa incapa toate coloanele” e cea mai lungă variantă; la celelalte 4 nu (`innerText.txt` r. 403-413) |
| R1.2 distractori = greșeli reale | parțial | atomul 1: „d) Printare → Date → …” nu e o greșeală de începător |
| R1.3 poziția nu contează | da | motorul amestecă (literele afișate A-D nu corespund cu „a)”-„d)”: „A b) Formatare…”, `pas_01.png`) — două sisteme de litere pe același rând, confuz |
| R1.4 / R1.4-bis cheie vs indiciu | da | chei a, c, b, d, a (Grep `"correct"`), toate corecte față de text; indiciile nu numesc litera |
| R1.5 un singur răspuns corect | da | 5/5 |
| R1.6 cheia e literă | da | Grep |
| R2.1 nu cere ce n-ai predat | **nu** | Page Layout/antet (pasul 6, atomul 5), COUNTIF, Conditional Formatting — nu în programă, nu în lecțiile 1-5 (`04_norma.md`) |
| R2.2 rezolvare model | da, dar **greșită la Ex. 1** | `u5_reproducere.txt`: `=AVERAGE(B4:F4)` |
| R2.3 parole pe site-uri externe | nu se aplică | nu cere conturi (dar „Excel Online” presupune cont) |
| R3.1 exemplu înainte de definiție | da | IF: structură + exemplu imediat |
| R3.2 termen nou explicat | parțial | COUNTIF explicat; „Header/Footer”, „Page Setup”, „Fit to 1 page” nu |
| R3.3 ieșire în sus | da | „Vrei mai mult?” (formatare condiționată) |
| R3.4 cifre coerente | parțial | „15-20 minute” pentru o misiune de 6 pași mari; anul „2024-2025” |
| R3.5 separator declarat o dată pe modul | **nu** în lecție | nicio notă despre `;` (0 formule cu `;`, `u1_iesire.json`) |
| R4.1 titlu = fișier = card = obiective | **nu** | card din `index.html`: „PROIECT FINAL: Buget Personal”; pagina: „Catalog Scolar Complet” (`01_citit_inapoi.md`); obiectivele sunt titluri de atomi lipite („Sa aplici de la ecran la hartie - page layout”) |
| R4.1-bis / ter | nu se aplică separat | acoperit de R4.1 |
| R4.2 cifre de navigare generate | nu se aplică | — |
| R4.3 note administrative ascunse | da | nicio notă administrativă vizibilă |
| R6.1-R6.7 | nu se aplică | reguli de proces de audit, nu de conținut |

## `LESSON_SPECIFICATION.md` (Grep `- \[ \]`)
| Rând | Bifă | Unde |
|:--|:--|:--|
| 731 poziție în curriculum | parțial | „M1” pe site ≠ modulul școlii; ora 12 (dec.) |
| 733 4-8 atomi | da | 5 atomi (`masuri.json`: atomi 5) |
| 734 quiz pe atom | da | 5 `data-quiz` |
| 735 3 exerciții minim/standard/performanta | da | r. 346, 372, 399 |
| 740 HTML valid | da | parcurs de H_vede fără erori, consola 0 |
| 741 zero `<style>` | da | singurul `<style` e în comentariul r. 10 |
| 742 6 scripturi | da | r. 477-482 |
| 743 init cu LESSON_ID | da | `cls8-m1-excel-fundamente-lectia6-proiect` (dar cardul din index are `data-lesson-id="cls8-m1-excel-fundamente-lectia6"` — progresul poate să nu se lege: de verificat) |
| 744 LESSON_ID după tipar | da | — |
| 745 `<title>` = conținut | da | „Proiect: Catalog Scolar Complet” |
| 746 clasa în titlu | da | „Clasa a VIII-a” |
| 747 nav prev/next corecte | **nu** | bara de sus „Urmatoarea →” duce la `index.html`; jos „Continua →” la `lectia7-sortare.html` |
| 748 lesson-summary | da | r. 459 |
| 751 diacritice în conținut | **nu** | 0,0 la 1000 (`log.json`) |
| 752 atomi cu conținut + quiz | da | — |
| 753 hint la fiecare întrebare | da | 5/5 |
| 754 cheia corectă | da | verificat pe text |
| 755 fără TODO/PLACEHOLDER | da | Grep: 0 |
| 756 pain comparison | nu se aplică | nu există |
| 757 rezumatul = atomii | da | 5 puncte = 5 atomi (formulări-ecou) |
| 758 exerciții pe temă | da | catalog, buletin, analiză |
| 761-763 ghilimele / JSON valid | da | quiz-urile s-au randat și răspuns (H_vede, 5 pași, 0 blocați) |
| 764 mărime > 25KB | da | 33 042 octeți |
| 765 imagini | nu se aplică | fără `<img>` |
| 768 competență OMEN | da | CS 1.1 / 3.1, activitatea „graficul mediilor elevilor din clasă” |
| 769 dificultate | parțial | tipărirea și COUNTIF peste programă |
| 770 niveluri etichetate | da | „Nivel minim / standard / performanta” |
