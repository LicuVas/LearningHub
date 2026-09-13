# 09 — Checklistul de pe hârtie (U9)

Surse: `C:\00\AI_0\knowledge\learninghub_calitate\00_INDEX.md` (R1-R6) și `C:\00\Projects\LearningHub\LESSON_SPECIFICATION.md` (Grep `- \[ \]`, rândurile 731-770).

## R1-R6 (00_INDEX.md)
| Regula | da / nu / nu se aplică | Unde / dovada |
|:--|:--|:--|
| R1.1 corecta nu e cea mai lungă | **nu** (5 din 11) | `u3_cheie_quiz.json`, `corecta_e_cea_mai_lunga` — regulă cunoscută, nu descoperire nouă |
| R1.2 distractori = greșeli reale | parțial | ex. „Apasand tasta F5” (atomul 8) se elimină prin reflex |
| R1.3 poziția nu contează | nu se aplică | motorul amestecă (cheia din sursă „b” a apărut ca A/C în pagină) |
| R1.4 cheia vs indiciu | da | 11/11 cheie = varianta care deblochează (`u3_cheie_quiz.json`) |
| R1.4-bis indiciul nu numește litera | da | indiciile din `innerText.txt` nu conțin litere |
| R1.5 un singur răspuns corect | da | citit toate 11 întrebările, `innerText.txt` |
| R1.6 cheia e literă, valoarea listă | da | `data-quiz` cu `"correct": "b"` și `options` listă (Grep HTML rândul 62) |
| R2.1 nu ceri ce n-ai predat | **nu** | Ex.3 cere „Fa un screenshot” (nepredat); Ex.2 cere Quick Print „din Ribbon” deși atomul 8 spune că nu e acolo |
| R2.2 rezolvare model | da | 3 pliante „Vezi rezolvarea”, `innerText.txt` 711-760 |
| R2.3 fără parole reale pe site-uri externe | da | niciun cont cerut; OneDrive doar ca opțiune |
| R3.1 exemplul înaintea definiției | nu | atomul 1 începe cu definiția, exemplul vine la final |
| R3.2 termenul nou explicat | parțial | „Backstage View”, „Dialog Box Launcher” explicate; „tabulatori” nu |
| R3.3 ieșire în sus pentru elevul bun | da | „Vrei mai mult? Provocare” |
| R3.4 cifrele nu se bat cap în cap | **nu** | Ctrl+F1 „poate varia” (atomul 3) vs „Ascunde Ribbon-ul cu Ctrl+F1” (Ex.2); „Minimum 4 fisiere” vs 3 fișiere listate |
| R3.5 separator declarat | nu se aplică | Word |
| R4.1 titlu = fișier = card = obiective | da | `01_citit_inapoi.md` |
| R4.1-bis / R4.1-ter | da | fișier `lectia1-interfata-word` = ora 2 „Interfața…” (`Calendar_ore_VII_A.md:19`) |
| R4.2 cifrele de navigare generate | nu am verificat indexul modulului | — (în afara folderului; nu e în sarcina acestei lecții) |
| R4.3 notele administrative ascunse elevului | **nu** | „Note de acoperire curriculara (OMEN 3393/2017)” afișată elevului, `innerText.txt` 779-784 |
| R5 ce e bun | da | atomi mici, 3 niveluri de exerciții, indicii |
| R6.2 oracolul care rezolvă | da | H_vede a parcurs toți pașii; exercițiile făcute în `produs_elev/` |
| R6.3 poarta de tipar | da (pe produsul elevului) | `randat_docx/*.pdf` |

## LESSON_SPECIFICATION.md
| Bifa | da / nu / nu se aplică | Unde |
|:--|:--|:--|
| 731 poziția în curriculum | da | nota de acoperire + `Calendar_ore_*` |
| 732 citit 2+ lecții din modul | nu se aplică | proces de autor, nu se vede în fișier |
| 733 **4-8 atomi** | **nu — 11 atomi** | `masuri.json` `atomi: 11` |
| 734 întrebări pe fiecare atom | da | 11/11 |
| 735 3 exerciții minim/standard/performanță | da | Grep „Nivel minim/standard/performanta” = 3 |
| 740 HTML valid | da (se randează, consola goală) | `consola.json` = [] |
| 741 zero `<style>` | da | singura potrivire e comentariul „NO inline <style> blocks” (HTML rândul 9) |
| 742-743 scripturi + init | da | `AtomicLearning.init('cls7-m1-word-fundamente-lectia1-interfata-word')` HTML 886-896 |
| 744 LESSON_ID pe tipar | da | idem |
| 745 `<title>` = conținut | da | „Interfata Microsoft Word \| TIC Clasa a VII-a” |
| 746 clasa din titlu = folder | da | cls7 / „Clasa a VII-a” |
| 747 linkuri prev/next | da | `index.html`, `lectia2-formatare-text.html` (existent) |
| 748 `lesson-summary` | da | Grep = 1 |
| 751 **diacritice** | **nu** | 0,0 la 1000 (`u3_iesire.json`, `04_norma.md`) |
| 752 4-8 atomi cu conținut + quiz | **nu** (11) | `masuri.json` |
| 753 fiecare întrebare are indiciu | da | `atom-hint` ×11 |
| 754 cheia corectă | da | `u3_cheie_quiz.json` |
| 755 fără TODO/PLACEHOLDER | da | Grep = 0 |
| 756 pain comparison | nu se aplică | nu există |
| 757 rezumatul = ce predau atomii | da | „Ce ai invatat astazi”, 7 puncte, toate predate |
| 758 exerciții pe temă | da | toate trei pe interfața Word |
| 761-763 ghilimele/JSON | da | `data-quiz` parsat fără eroare de `u3_cheie_quiz.py` |
| 764 mărime > 25 KB | da | 56.057 octeți |
| 765 imagini cu width 100% | nu se aplică | **0 imagini** — tocmai asta e problema la o lecție despre o fereastră |
| 768 competență OMEN | da | CS.1.1 (nota de acoperire) |
| 769 dificultate pe clasă | parțial | References/Citations/Index, Watermark, Columns — peste nivelul orei 2 |
| 770 exerciții etichetate pe niveluri | da | „Nivel minim / standard / performanta” |
