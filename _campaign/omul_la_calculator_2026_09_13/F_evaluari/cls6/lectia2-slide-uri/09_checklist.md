# 09 — Checklistul de pe hârtie (U9)

Surse: `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (titlurile R1-R6), `LESSON_SPECIFICATION.md` (Grep `- \[ \]`, rândurile 731-770). Verificări mecanice: `u9_quiz.py` → `u9_quiz.json`, `u3_verifica.py` → `u3_iesire.json`.

## R1-R6
| Regula | da / nu / n.a. | Unde |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **da** — 0 din 10 | `u9_quiz.json` corecta_cea_mai_lunga=0 |
| R1.2 distractori = greșeli reale | da, în mare (Ctrl+N/Ctrl+S vs Ctrl+M; Insert→Themes vs Design) | innerText r. 150-162, 302-314 |
| R1.3 poziția | n.a. (motorul amestecă) | — |
| R1.4 / R1.4-bis cheie vs indiciu, indiciul nu numește litera | da — indiciile sunt „Corect! …” fără literă | `u9_quiz.json` hint |
| R1.5 un singur răspuns corect | **nesigur la 1**: „Two Content sau Comparison” e o variantă dublă (acceptabil, ambele corecte) | innerText r. 551 |
| R1.6 cheia = literă | da (a/b) | `u9_quiz.json` |
| R2.1 nu cere ce n-ai predat | **nu** — 4 din 10 întrebări înainte de predare (Slide Master în atomul 1, gradient și teme în 2, Format Background în 3); „regula 6x6” în rezolvarea Ex.3 nepredată; Header & Footer cerut la Ex.2, nepredat în atomi | `u3_iesire.json` intrebari_vs_predare |
| R2.2 rezolvare model la fiecare exercițiu | da — 4/4 pliante „Vezi rezolvarea” | innerText r. 813, 868, 912, 977 |
| R2.3 fără parole reale pe site-uri externe | da — nu cere cont; SlideShare doar citit (Ex.3) | innerText r. 896 |
| R3.1 exemplul înainte de definiție | **nu** — fiecare atom începe cu „Definitie:”, apoi analogia | innerText r. 118, 207, 334, 405, 499, 574, 677 |
| R3.2 termen nou explicat la prima folosire | **nu** — „placeholderele”, „template”, „branding”, „overlay”, „stops” fără explicație | innerText r. 207, 499, 574, 715, 735 |
| R3.3 ieșire în sus pentru elevul bun | da — „Vrei mai mult?”, Provocare Bonus | r. 104, 1017 |
| R3.4 cifrele nu se bat cap în cap | **nu (nivelurile)** — „Nu este evaluata la nivel minim sau standard” vs „Exercitiul 2 (Nivel standard) … Slide Master Challenge”; „5 metode diferite” vs 3-4 metode arătate | r. 493, 836-840, 60 |
| R3.5 separatorul formulelor | n.a. (PowerPoint) | — |
| R4.1 titlu = fișier = card = obiective | da între titlu și fișier; obiectivele promit „Slide Sorter” pentru organizare, iar Indiciul #2 numește greșit panoul de miniaturi „Slide Sorter” | r. 44, 97 |
| R4.1-bis / ter frații pe același slot | **nu** — lecția 1 predă deja Ctrl+M, Duplicate/Delete Slide, schimbarea aspectului, tema, Format Background | `u3_iesire.json` deja_in_lectia1 |
| R4.2 cifre de navigare generate | n.a. aici (Pasul 1 din 7 generat de motor) | ecran_prima_vedere.png |
| R4.3 fără note administrative pentru elev | **nu** — nota despre programă „OMEN 3393/2017 … Slide Master nu este inclus” e scrisă elevului de 12 ani | r. 493 |
| R6.x (metodă de audit) | aplicate: R6.2 lecția rezolvată (produsele în `produs_elev/`), R6.3 randare PDF citită înapoi | `randat_pptx/*.pdf` |

## Checklistul din LESSON_SPECIFICATION.md
| Bifa | da / nu / n.a. | Unde |
|:--|:--|:--|
| Poziție în curriculum (clasă, modul, săptămână, competență) | parțial — nu se potrivește cu ora 4 din plan (obiecte lipsă) | `01_citit_inapoi.md` |
| 4-8 atomi | da — 7 | `masuri.json` atomi=7 |
| Întrebări pentru fiecare atom | da ca număr; **nu** ca potrivire (9/10 despre alt atom) | `u3_iesire.json` |
| 3 exerciții minim/standard/performanță | da — 4 (1 minim, 1 standard, 2 performanță) | innerText r. 779, 836, 890, 931 |
| HTML valid | n.a. manual; pagina se încarcă, consola 0 erori | `consola.json` |
| ZERO `<style>` inline | da — singura potrivire „<style” e în comentariul `<!-- NO inline <style> blocks. ZERO. -->` | Grep r. 10 |
| Toate init-urile cu LESSON_ID corect | da — AtomicLearning/PracticeSimple/LessonSummary `cls6-m1-prezentari-lectia2-slide-uri`, LearningProgress cls6 | HTML r. 747-757 |
| `<title>` corespunde; clasa din titlu = folder | da | HTML r. 6 |
| Linkuri nav spre lecția următoare | da — `lectia3-text-imagini.html` | HTML r. 18, 732 |
| `lesson-summary` prezent | da | HTML r. 721 |
| **Diacritice în text** | **nu** — 0,1 la 1000 | `04_norma.md` |
| Fiecare întrebare are indiciu | da — 0 fără | `u9_quiz.json` |
| Indexul corect = varianta corectă | da, verificat pe text (10/10) | `u9_quiz.json` |
| Fără TODO/TBD/PLACEHOLDER | da — Grep 0 | — |
| Rezumatul = ce predau atomii | da | innerText r. 999-1015 |
| Exerciții specifice temei | da | — |
| Fără `\"` în atribute | da — 0 | `u9_quiz.json` escaped_quotes=0 |
| `data-quiz` JSON valid | da — toate 7 parsate cu json.loads | `u9_quiz.py` |
| Mărime > 25 KB | da — 56.865 octeți | `u9_quiz.json` |
| Imagini cu width 100% | n.a. — 0 imagini | `u9_quiz.json` img=0 |
| Competență OMEN | da — CS.1.1 (implicit) | `04_norma.md` |
| Dificultate potrivită clasei | **nu** la standard (Slide Master) | `06_premortem.md` §3 |
| Exerciții etichetate minim/standard/performanță | da | innerText |
