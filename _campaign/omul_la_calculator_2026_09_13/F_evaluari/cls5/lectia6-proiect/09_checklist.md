# 09 — Checklistul de pe hârtie (U9)

Surse: `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (R1-R6) și `LESSON_SPECIFICATION.md` r. 731-770 (Grep `- [ ]`).

## R1-R6
| Regula | da/nu/n.a. | Unde |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **nu** la 2 din 6 | „Procesorul este creierul calculatorului care proceseaza toate datele” (cea mai lungă); „Hardware-ul e fizic (il atingi), software-ul e un program (il instalezi)” (cea mai lungă) — `u5_iesire.json` A6 |
| R1.2 distractori = greșeli reale | parțial | „Hardware-ul e scump, software-ul e ieftin”, „Tin apasat butonul de pornire 10 secunde” — plauzibile; „Procesorul introduce text” — nu |
| R1.3 poziția | da | motorul amestecă (ordinea din innerText diferă de data-quiz) |
| R1.4 cheia vs indiciu | da | 6/6 (`04_a_doua_cale.json`) |
| R1.4-bis indiciul nu numește litera | da | niciun indiciu nu conține „A/B/C/D” |
| R1.5 un singur răspuns corect | da | verificat pe 6 |
| R1.6 cheia literă | da | `"correct": "a"` etc. |
| — (feedback) | **nu** | după răspuns greșit apare „❌ Incorect” urmat de „✓ CORECT! Procesorul…” (`u5_iesire.json` B) |
| R2.1 nu cere ce n-ai predat | **nu** | cere PowerPoint/Paint/Canva, export PDF, culori personalizate — nepredate (ora 18-21) |
| R2.2 rezolvare model | da | 3/3 exerciții au „Vezi rezolvarea” |
| R2.3 fără parole reale pe site-uri externe | parțial | nu cere parole, dar trimite la Canva/Google Slides care cer cont |
| R3.1 exemplu înainte de definiție | da | provocarea vine înaintea atomilor |
| R3.2 termen explicat la prima folosire | **nu** | „licenta Windows”, „cloud”, „calculatoare cuantice”, „holografice” |
| R3.3 ieșire în sus | da | Ex. 3 + „Vrei mai mult?” |
| R3.4 cifre fără contradicții | **nu** | „Creeaza prima varianta … in 5 minute” vs fazele 30+60+30; oprirea în 2 forme („Start → Power → Shut Down” / „Start → Shut Down”) |
| R3.5 separator formule | n.a. | nu are formule |
| R4.1 titlu = fișier = obiective | da | „Proiect: Posterul Calculatorului Meu” |
| R4.1-bis/ter slot în plan | **nu** | niciun slot în V-U1 (`01_citit_inapoi.md`) |
| R4.2 cifre generate | n.a. | |
| R4.3 note administrative ascunse | da | nu apar |
| R6.2 oracolul care rezolvă | făcut | H_vede 4/4 pași + posterul `u1_poster.pptx` |
| R6.3 poarta de tipar | făcut | `randat_pptx/u1_poster.pdf` recitit (`07_redeschis.json`) |

## LESSON_SPECIFICATION.md
| Bifă | da/nu | Unde |
|:--|:--|:--|
| Identified curriculum position | **nu** | lipsește orice oră din plan |
| 4-8 atom topics | da | 4 atomi |
| Quiz for each atom | da | 2+2+1+1 |
| 3 practice exercises minim/standard/performanta | da | etichetate |
| Valid HTML | da (randat fără erori de consolă, `consola.json` 0) | |
| ZERO inline `<style>` | da | singura apariție e comentariul „NO inline <style> blocks” (r. 10) |
| All 6 scripts, init calls, LESSON_ID pattern | da | r. 598-608, `cls5-m1-sisteme-lectia6-proiect` |
| `<title>` matches content / grade | da | „Clasa a V-a” |
| Nav links prev/next | da | ultima lecție → `index.html` |
| `lesson-summary` div | da | r. 580 |
| **Romanian text with proper diacritics** | **nu** | 0,1 la 1000 (`04_norma.md`) |
| Every quiz has hint / correct index | da | |
| No TODO/PLACEHOLDER | da | Grep 0 |
| Summary bullets match atoms | da | 4 bullets = 4 atomi |
| Practice exercises topic-specific | da | |
| `data-quiz` JSON valid | da | parsat în `u5_verifica.py` |
| File size > 25KB | da | 33.193 octeți |
| Images `max-width` | n.a. | niciun `<img>` |
| Maps to OMEN 3393/2017 competency | **parțial** | CS.1.1 ca subiect, dar produsul digital ține de CS.3.1 (`04_norma.md`) |
| Grade-appropriate difficulty | **nu** | 120 min + unealtă nepredată |
| Labeled minim/standard/performanta | da | |
| (în plus) clasele CSS folosite există | **nu** | `poster-*` fără CSS (`u5_iesire.json` A3) |
