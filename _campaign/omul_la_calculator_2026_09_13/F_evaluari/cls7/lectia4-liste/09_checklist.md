# 09 — Checklist de pe hârtie (U9) · lectia4-liste

## R1-R6 din `knowledge/learninghub_calitate/00_INDEX.md`
| Regula | da/nu/n.a. | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | da | `u9_chestionare_lungimi.json`: 0 din 10 |
| R1.2 distractori = greșeli reale | parțial | Q9 „Inchizi documentul si il redeschizi”, Q7 „Stergi toata lista si o rescrii” — nu sunt greșeli de începător (minor) |
| R1.3 poziția nu contează | n.a. | motorul amestecă |
| R1.4 cheia vs indiciu | da | `04_a_doua_cale.json` r.5: 10/10 |
| R1.4-bis indiciul nu numește litera | da | indiciile nu conțin litere de variantă |
| R1.5 un singur răspuns corect | da | citit innerText r.100-970 |
| R1.6 cheia literă | da | data-quiz valid JSON, chei „a”/„b” (`u3_u7_verifica.py`) |
| R2.1 nu cere ce n-ai predat | **nu** | Ex.3 cere sub-puncte cu marcatori sub o listă cu I, II, III; schimbarea tipului pe un singur nivel nu e predată (rezolvarea pretinde că Tab o face singur) — `03_jurnal_sarcina.md` pas 3 |
| R2.2 rezolvare model | da | 3 × „Vezi rezolvarea” |
| R2.3 parole reale | n.a. | nu există |
| R3.1 exemplul înainte de definiție | parțial | atomul 4 începe cu exemplul (plan de lecție); atomii 1, 2, 3 încep cu definiția |
| R3.2 termenul explicat la prima folosire | parțial | „AutoList”, „Hanging indent”, „imbricate” explicate; „Wingdings”, „Ribbon” nu |
| R3.3 ieșire în sus | da | „Vrei mai mult?” r.1143-1147 |
| R3.4 cifre fără contradicții | **nu** | Tab în listă numerotată: litere (r.1059) vs marcatori (r.1109) — contradicție de rezultat, nu de cifră; minor pe R3.4, important ca semnalare |
| R3.5 separator | n.a. | nu e Excel |
| R4.1 titlu = fișier = obiective | parțial | titlu = fișier; obiectivele listează 5 din 10 atomi; ora din plan nu corespunde (`01_citit_inapoi.md`) |
| R4.2 cifre generate | n.a. | nu sunt cifre de navigare |
| R4.3 note administrative ascunse | da | nu apar note pentru profesor în textul elevului |
| R6.x (reguli de proces pentru audit) | n.a. | aplicate în metodă: R6.2 rezolv lecția (`produs_elev/`), R6.3 randez PDF (`randat_docx/`) |

## Checklist `LESSON_SPECIFICATION.md` (Grep `- [ ]`)
| Punct | da/nu/n.a. | Unde |
|:--|:--|:--|
| 731 poziție în curriculum | parțial | cls7/m1; ora din plan nepotrivită |
| 732 consecvență cu lecțiile modulului | **nu** | titluri făcute de mână (ca L2), contra atomului 10 din L3 |
| 733 4-8 atomi | **nu** | 10 atomi (masuri.json) |
| 734 chestionar pe fiecare atom | da | 10 data-quiz |
| 735 3 exerciții minim/standard/performanță | da | r.981, 1024, 1071 |
| 740 HTML valid | da | H_vede a încărcat, consola 0 erori (consola.json) |
| 741 zero `<style>` inline | da | Grep `<style`: singura potrivire e comentariul r.11 „NO inline <style> blocks. ZERO.” |
| 742 cele 6 scripturi | da | atomic-learning, practice-simple, lesson-summary, breadcrumb, progress, user-system (HTML r.1512-1522) |
| 743 init-uri cu LESSON_ID | da | AtomicLearning/PracticeSimple/LessonSummary.init('cls7-m1-word-fundamente-lectia4-liste') |
| 744 LESSON_ID pe tipar | da | `cls7-m1-word-fundamente-lectia4-liste` |
| 745 `<title>` | da | „Liste cu Marcatori si Numerotate | TIC Clasa a VII-a” |
| 746 clasa în titlu | da | „Clasa a VII-a” |
| 747 nav prev/next | da | lectia3-paragrafe.html / lectia5-tabele.html |
| 748 lesson-summary | da | HTML r.1487 |
| 751 diacritice | **nu** | 0,0 la 1000 (`04_norma.md`) |
| 752 atomi cu conținut + quiz | da (dar 10) | |
| 753 hint la fiecare întrebare | da | `u9_chestionare_lungimi.json` câmp indiciu, 10/10 |
| 754 index corect | da | `parcurgere.json`: 10 pași deblocați cu răspunsul corect |
| 755 fără TODO/PLACEHOLDER | da | Grep 0 |
| 756 pain comparison | n.a. | nu există |
| 757 rezumatul = atomii | da | „Ce ai invatat astazi” r.1121-1141 = cei 10 atomi |
| 758 exerciții pe temă | da | liste de cumpărături, rețetă, regulament |
| 761/762 ghilimele în atribute | da | data-quiz se parsează (u3_u7_verifica.py) |
| 763 data-quiz JSON valid | da | `json.loads` pe toate 10 |
| 764 > 25 KB | da | 54.722 octeți |
| 765 imagini 100% | n.a. | 0 imagini |
| 768 competență OMEN | da | CS.1.1 VII (`04_norma.md`) |
| 769 dificultate pe clasă | parțial | atomii 5, 6, 9 peste „formatări de bază” |
| 770 exerciții etichetate | da | „Nivel minim/standard/performanta” |
