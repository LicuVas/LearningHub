# 09 — Checklist (U9) · lectia5-tabele

## R1-R6 din `knowledge/learninghub_calitate/00_INDEX.md`
| Regula | da/nu/n.a. | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **da** | u9_chestionare_lungimi.json: 0 din 11 |
| R1.2 distractori = greșeli reale | parțial | ch.2 „View > Gridlines > Create Table”, ch.9 „Insert > Shapes > Rectangle” sunt inventate, nu greșeli de începător; ch.4 A „Ctrl+A pentru tot documentul” e un distractor ADEVĂRAT despre Ctrl+A |
| R1.3 poziția nu contează | da | parcurgere.json: ordinea afișată ≠ ordinea din data-quiz, 11/11 deblocate |
| R1.4 / R1.4-bis cheia vs indiciu, indiciul nu numește litera | da | 11 indicii fără literă; toate confirmă cheia |
| R1.5 un singur răspuns corect | da | verificat la citire (r.131-1289) |
| R1.6 cheia = literă | da | data-quiz „correct”: "a"/"b"/"c" |
| R2.1 nu cere ce nu ai predat | **nu** | Ex.3 cere „Font Color” și „Align Center Right”, provocarea „AutoFit Contents” pe text convertit — predate; dar ex.1 indiciul „Table Properties > Row > 1.2 cm” e predat doar în atomul 7. Cea mai gravă: casetele de răspuns nu au întrebare. |
| R2.2 rezolvare model | parțial | 3/3 au rezolvare, dar rezolvarea Ex.2 omite pasul 7 (Merge Observatii), rezolvarea Ex.3 omite rândul 8; provocarea nu are rezolvare |
| R2.3 fără parole pe site-uri externe | n.a. | nicio sarcină cu cont |
| R3.1 exemplul înaintea definiției | parțial | atomul 1 dă comparația cu telefoanele înainte de terminologie; atomii 3-11 sunt liste de comenzi fără exemplu vizual |
| R3.2 termenul explicat la prima folosire | nu | „AutoFit” apare în atomul 2 (Insert Table) explicat abia în atomul 7; „Shading”, „Banded” — în atomii 8-9 |
| R3.3 ieșire în sus pentru elevul bun | da, dar defectă | „Vrei mai mult?” există; provocarea strică tabelul (cls7-l5-04) |
| R3.4 cifrele nu se bat cap în cap | **nu** | AutoFit Window „proportional” (r.756) vs „distribuite egal” (Ex.1 r.1468, r.1482); rezumatul Ctrl+A (r.1380) vs chestionarul 4 (r.444) |
| R3.5 separatorul declarat | n.a. | Word, fără formule |
| R4.1 titlu = fișier = card = obiective | parțial | titlu = fișier; obiectivele listate numesc 6 teme, atomii sunt 11 (îmbinare, dimensionare, stiluri, chenare, conversie lipsesc din listă) |
| R4.1-bis / ter (frații din slot) | nu | ora 4 are text+imagini+tabele, ora 7 imagine+tabel+pagină; nicio lecție M1 cls7 nu predă imaginea (01_citit_inapoi.md) |
| R4.2 cifre generate pe navigare | n.a. | — |
| R4.3 fără note administrative | **nu (minor)** | atomul 11 începe cu „Conform programei scolare OMEN 3393/2017 … continut obligatoriu distinct” — notă pentru profesor, afișată elevului |
| R6.1-R6.2 martori/oracol | da | această evaluare: exercițiile făcute în docx (U1) |
| R6.3 poarta de tipar | parțial | produsele elevului randate 1 pagină fiecare; lecția însăși nu a fost tipărită (ASCUNS pliat = rezolvări) |
| R6.4 semnalarea = clasă | da | Ctrl+Alt+V, diacritice, engleză: aceeași clasă ca L2-L4 (JURNAL) |
| R6.5-R6.7 | n.a. | nu repar nimic |

## `LESSON_SPECIFICATION.md` — checklist (r.731-770)
| Punct | da/nu/n.a. | Unde |
|:--|:--|:--|
| Curriculum position identified | parțial | Breadcrumb cls7/M1; nicio competență numită în pagină |
| Read 2+ existing lessons | n.a. | proces de autor |
| 4-8 atom topics | **nu** | 11 atomi (masuri.json) |
| Quiz questions for each atom | da | 11/11 |
| 3 practice exercises minim/standard/performanta | da | Ex.1 minim, Ex.2 standard, Ex.3 performanta |
| Valid HTML | da | H_vede a randat fără erori, consola 0 |
| ZERO inline `<style>` | da | singurul „<style” e în comentariul r.11 |
| All 6 scripts, correct DEPTH | da | r.2443-2454: atomic-learning, practice-simple, lesson-summary, breadcrumb, progress, user-system, `../../../../` |
| All init calls, LESSON_ID | da | r.2458-2468 `cls7-m1-word-fundamente-lectia5-tabele` |
| `<title>` matches content | da | „Tabele in Word | TIC Clasa a VII-a” |
| Grade in title matches folder | da | cls7 → „Clasa a VII-a” |
| Nav links prev/next | parțial | prev = lectia4-liste.html, dar butonul are title „Inapoi la modul”; next = lectia6-evaluare.html |
| `lesson-summary` div present | da | r.2418 |
| Romanian text with proper diacritics | **nu** | 0,0 la 1000 (04_norma.md) |
| 4-8 atoms, content + quiz | **nu** | 11 |
| Every quiz has hint | da | 11/11 |
| Correct answer index matches | da | parcurgere.json 11/11 |
| No TODO/TBD/FIXME/PLACEHOLDER | da | grep 0 |
| Pain comparison matches topic | n.a. | nu există |
| Summary bullets match atoms | da | „Ce ai invatat astazi” = cele 11 titluri |
| Practice exercises topic-specific | da | orar, browsere, formular |
| No escaped quotes in attributes | da | data-quiz JSON.parse OK (u3_u7_verifica.py) |
| data-quiz JSON valid | da | idem |
| File size > 25KB | da | 94.594 octeți |
| Images width 100% | n.a. | 0 imagini |
| Maps to OMEN 3393/2017 | da | CS.1.1, conținuturile „Obiecte… tabele” și „formatare … tabel, pagină” (04_norma.md) |
| Grade-appropriate difficulty | parțial | volumul (8.447 cuvinte, atomi de 379-629 cuvinte, spec max 300) depășește clasa |
| Exercises labeled minim/standard/performanta | da | titlurile Ex.1-3 |
