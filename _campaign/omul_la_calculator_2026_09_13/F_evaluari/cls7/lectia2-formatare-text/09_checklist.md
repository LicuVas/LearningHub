# 09 — Checklist de pe hârtie (U9)

## Reguli R1-R6 (`knowledge/learninghub_calitate/00_INDEX.md`)
| Regula | Bifă | Unde / dovada |
|:--|:--|:--|
| R1.1 Varianta corectă nu e cea mai lungă | da, cu o excepție inversă | Chest. 9: corecta „Ctrl+Alt+V” e cea mai SCURTĂ, distractorii sunt umpluți („Ctrl+V, folosita pentru lipire normala”) — se ghicește după formă |
| R1.2 Distractori = greșeli reale de începător | nu (parțial) | Chest. 1 A „Nu exista nicio diferenta reala...” și chest. 9 B/C se elimină prin reflex (distractorii se autodescriu ca altceva) |
| R1.3 Poziția răspunsului | nu se aplică | motorul amestecă (în `parcurgere.json` literele diferă de cheile din HTML) |
| R1.4 Cheia verificată contra indiciului | da | 10/10 indicii concordă cu cheia (data-quiz extras din HTML cu json.loads și citit întrebare cu întrebare; cheia 9 extrasă și de `u7_u3_verifica.py`) |
| R1.4-bis Indiciul nu numește litera | da | niciun indiciu nu numește litera |
| R1.5 Un singur răspuns corect | da, cu rezervă la 9 | chest. 9: în Microsoft 365/Word 2024 niciuna dintre variante nu deschide Paste Special (`surse/p_ctrl_alt_v.txt`) |
| R1.6 Cheia = literă | da | `"correct": "b"` etc. |
| R2.1 Nu cere ce n-ai predat | da | Ex.1-3 folosesc doar ce e în atomii 2, 3, 5, 8 |
| R2.2 Rezolvare model | da | 3 × „Vezi rezolvarea” (innerText r. 843, 891, 944) |
| R2.3 Parole reale pe site-uri externe | nu se aplică | nu există |
| R3.1 Exemplul înainte de definiție | nu | atomul 1 începe cu definiția („Formatarea textului reprezinta totalitatea...”), exemplul cu pixul vine după |
| R3.2 Termen explicat la prima folosire | parțial | „serife”, „pt”, „kerning” explicate; „cod hex #FF0000” nu |
| R3.3 Ieșire în sus | da | „Vrei mai mult?” (r. 983-987) |
| R3.4 Cifrele nu se bat cap în cap | da | 11-12 pt text / 14-16 subtitluri / 24 titlu, consecvente; Ex.3 16 pt vs Provocare 14 pt = sarcini diferite |
| R3.5 Separator declarat | nu se aplică | fără formule |
| R4.1 Titlu = fișier = card = obiective | parțial | titlu = fișier; obiectivele numesc 5 teme, atomii sunt 10 (`01_citit_inapoi.md`) |
| R4.1-bis / R4.1-ter | da | frate: `lectia3-paragrafe` (link „Urmatoarea”, HTML r. 20/1342) predă paragraful, lecția 2 caracterul — slotul e coerent |
| R4.2 Cifre generate | da | „Pasul 1 din 10 · 0 din 10” corespunde celor 10 atomi |
| R4.3 Note administrative | da | nota din atomul 7 e pedagogică, nu administrativă |
| R6.1-R6.7 | nu se aplică lecției | reguli de proces; R6.2 aplicat aici: lecția rezolvată de `H_vede` (10/10 pași deblocați) și exercițiile făcute în docx |

## Checklistul din `LESSON_SPECIFICATION.md` (Grep `- [ ]`, r. 731-770)
| Bifă | da/nu | Unde |
|:--|:--|:--|
| Defined 4-8 atom topics / 4-8 atoms present | **nu** | 10 atomi (`masuri.json` atomi=10) |
| Quiz for each atom / every quiz has a hint | da | 10 întrebări, 10 indicii |
| 3 practice exercises minim/standard/performanta | da | „Nivel minim / standard / performanta” |
| ZERO inline `<style>` | da | singurul `<style` din HTML e în comentariul de la r. 11 |
| All 6 scripts, init calls, LESSON_ID | da | HTML r. 1352-1376, `cls7-m1-word-fundamente-lectia2-formatare-text` |
| `<title>` matches / grade in title | da | „Formatarea Textului | TIC Clasa a VII-a” |
| Nav links prev/next | da | next = lectia3-paragrafe.html |
| `lesson-summary` div | da | r. 1327 |
| Romanian text with proper diacritics | **nu** | 0,0 la 1000 (`04_norma.md`) |
| Correct answer index matches actual correct option | da în HTML, **nu în realitate la chest. 9** pe Word 2024/365 | `04_a_doua_cale.json` |
| No TODO/PLACEHOLDER | da | Grep gol |
| Pain comparison topic | nu se aplică | nu există |
| Summary bullets match atoms | da | 10 bullet-uri = 10 atomi |
| Practice exercises topic-specific | da | toate pe formatare de caracter |
| data-quiz JSON valid | da | parsat cu json.loads, 10/10 |
| File size > 25KB | da | 55.888 octeți |
| Image tags width 100% | nu se aplică | 0 imagini |
| Maps to OMEN 3393/2017 competency | da | VII CS.1.1 (`04_norma.md`) |
| Grade-appropriate difficulty | parțial | atomul 7 (spațiere, kerning) marcat „pentru avansati”; Ctrl+Space/Ctrl+Q/Paste Special peste nivelul orei |
