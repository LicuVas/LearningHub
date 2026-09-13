# 09 — Checklist de pe hârtie (U9) · cls6/lectia6-proiect

## R1-R6 (`C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md`)
| Regula | da / nu / n.a. | Unde |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | parțial nu | r. 728-740: A „Introducere (anunt subiectul) - Continut (3-5 idei) - Incheiere (rezumat + multumiri)” e cea mai lungă, dar C e la fel de lungă; r. 752-757 C cea mai informativă — minor |
| R1.2 distractori = greșeli reale | nu | distractori absurzi: „ochii inchisi tot timpul”, „Pleci imediat din fata clasei” (r. 469, 757) |
| R1.3 poziția răspunsului | n.a. | motorul amestecă |
| R1.4 / R1.4-bis cheia vs indiciu | da | 16 indicii „Corect! …” coerente cu varianta (parcurgere.json: 16/16) |
| R1.5 un singur răspuns corect | da | verificat la citire, felii 1-765 |
| R1.6 cheia = literă, JSON valid | da | 8/8 blocuri `data-quiz` se parsează (grep + json.loads) |
| R2.1 nu cere ce n-ai predat | parțial | Google Slides (Ex.2) și PDF (Ex.3) nu apar în atomii L6; PDF predat în L1; hyperlink predat în atomul 4 (`04_norma.md`) |
| R2.2 rezolvare model | da | 3/3 „Vezi rezolvarea” pliate |
| R2.3 fără parole reale | n.a. / risc | Google Slides cere cont, lecția nu spune nimic de cont |
| R3.1 exemplul înaintea definiției | nu | atomul 1 începe cu „Definitie:” (r. 78), analogia după (r. 80); la fel atomii 2-8 |
| R3.2 termen explicat | parțial | „Normal View”, „Slide Show” folosite ca nume englezești fără traducere |
| R3.3 ieșire în sus | da | „Vrei mai mult?” r. 882-886 |
| R3.4 cifre coerente | **nu** | 1-2 vs 2-3 animații/diapozitiv; 1 min/diapozitiv (7 min) vs 3-5 min (`04_a_doua_cale.json`); 6 vs 6-8 vs 7 diapozitive |
| R3.5 separator formule | n.a. | nu e Excel |
| R4.1 titlu = fișier = obiective | da | `01_citit_inapoi.md` |
| R4.1-ter frații pe același slot | parțial | ora 9 la Brauner; la Izvoare slotul nu există; atomii 5-8 = tema orei 8 |
| R4.3 note administrative ascunse | nu (minor) | „conform programei OMEN 3393/2017 cls. VI” e afișat elevului în atomul 3, în întrebare și în indiciu (r. 253, 289, 304) — notă pentru profesor |
| R6.2 oracolul care rezolvă | da | H_vede 8/8 pași + U1 construit (`u1_iesire.txt`) |
| R6.3 poarta de tipar | da | `randat_pptx/Proiect_Albinele.pdf` citit înapoi (`u3_iesire.json`) |
| R6.5 constrângere legală = test | nu | poza cu echipa în rezolvare; niciun test pe „date personale” (`surse/s_gdpr_imagini.txt`) |

## `LESSON_SPECIFICATION.md` (Grep `- \[ \]`)
| Punct | da / nu / n.a. | Unde |
|:--|:--|:--|
| poziția în curriculum | parțial | ora 9 Brauner; Izvoare fără slot |
| 4-8 atomi cu quiz | da | 8 atomi, 16 întrebări |
| 3 exerciții minim/standard/performanță | da | r. 772, 800, 830 |
| HTML valid / fără `<style>` | da | grep `<style` = 1, doar în comentariul r. 10 |
| 6 scripturi cu DEPTH corect | da | r. 534-539, `../../../../assets/js/` |
| init cu LESSON_ID | da | r. 542-544 `cls6-m1-prezentari-lectia6-proiect` |
| `<title>` = conținut, clasa = folder | da | „TIC Clasa a VI-a” |
| nav prev/next corecte | parțial | „Urmatoarea →” duce la `index.html` (r. 18) — ultima lecție, acceptabil |
| `lesson-summary` prezent | da | r. 516 |
| diacritice ă â î ș ț | **nu** | 0,0 la 1.000 (`log.json`) |
| fiecare întrebare are indiciu | da | 16 `"hint"` |
| cheia corectă | da | parcurgere 16/16 |
| fără TODO/PLACEHOLDER | da | grep 0 |
| rezumatul = ce predau atomii | da | r. 862-880 |
| exerciții specifice temei | da | |
| `data-quiz` JSON valid | da | 8/8 |
| mărime fișier > 25 KB | da | 43.999 octeți |
| imagini `width:100%` | n.a. | nicio `<img>` |
| competență OMEN 3393/2017 | da | CS 3.1 „Elaborarea de prezentări” (`u16_programa.txt`) |
| dificultate potrivită clasei | parțial | minimul cere imagini importate = descriptor „Consolidat” |
| niveluri etichetate | da | „Nivel minim/standard/performanta” |
