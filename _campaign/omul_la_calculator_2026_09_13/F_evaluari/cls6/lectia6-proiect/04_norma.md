# 04 — Norma din afara lecției (U16) · cls6/lectia6-proiect

## Limba română
- Diacritice la 1.000 de litere: **0,0** (singurul caracter: „legănat”, r. 447; sedile ş/ţ: 0). Text românesc normal ≈ 40-60.
- `LESSON_SPECIFICATION.md:751`: „- [ ] Romanian text with proper diacritics (ă, â, î, ș, ț)” → **nu**. Aceeași semnalare ca la L1-L5; dovada proprie: `log.json` diacritice_la_1000 recalculat de poartă.
- Proiectul cere elevului „ai greseli de scriere?” (Ex.2), într-o lecție scrisă fără diacritice — modelul pe care elevul îl copiază e textul lecției.

## Programa (curriculum.json, OMEN 3393/2017; `u16_programa.txt`)
- Conținuturi: „Structura unei prezentări: diapozitive, obiecte utilizate în prezentări (casete de text, imagini importate, forme, sunete, tabele, **legături**)” → hyperlinkurile interne SUNT în programă (nu e extindere).
- „Operații de gestionare a prezentărilor: creare, deschidere, expunere, **salvare în diverse formate**, închidere” → PDF în programă; predat în lectia1 (exercițiile, r. 779 și 805 din `lectia1-powerpoint-intro/innerText.txt`), deci rezolvarea Ex.3 („exportul ca PDF nu a fost predat explicit in lectie”) e adevărată doar pentru lecția 6.
- „Reguli elementare de **susținere** a unei prezentări” + activitatea „**susținerea în fața colegilor** a unei prezentări realizate, cu respectarea regulilor de ținută, comportament, exprimare” → lecția trimite susținerea la nivelul performanță, acasă: „prezinta oral in fata familiei sau a unui coleg”. Norma o cere tuturor, în fața colegilor.
- Descriptorul „De bază”: „(casete text, forme predefinite)”; „Consolidat”: „(casete text, forme predefinite, **imagini importate**, diapozitive)” → Ex.1 **minim** cere 3 imagini cu sursă, adică un element de nivel consolidat.

## Ce NU cere proiectul (verificat în L1-L5, grep pe `innerText.txt`)
| Element | Predat în | Cerut în L6? |
|:--|:--|:--|
| WordArt | L3 (18 apariții) | nu |
| SmartArt | L3 (25) | nu |
| Aspect personalizat / Slide Master | L2, marcat „Aprofundare Optionala” | nu (Ex.2 cere doar tipurile standard) |
| Hyperlink intern | **nicăieri în L1-L5** (0) | da, Ex.3 — predat în atomul 4 al lecției 6 |
| Export PDF | L1, exerciții | da, Ex.3 |
| Liste numerotate, Font Color | L3 | da, Ex.2 |
| Google Slides | L1 mențiune (r. 887), L2 „Deschide PowerPoint sau Google Slides” (r. 58); nicio predare a interfeței | da, Ex.2, ca alternativă |
| Surse de imagini / copyright | L3 r. 388-402 | da, Ex.1 („noteaza sursa”) |

## Drepturi și date personale
- Rezolvarea Ex.1: „o poza proprie de la antrenament (sursa: telefonul meu), o poza cu echipa (sursa: telefonul meu)”. O poză cu persoane identificabile = date cu caracter personal; la minori, consimțământul părintelui (Legea 190/2018: 16 ani) (`surse/s_gdpr_imagini.txt`). Chiar modulul spune în lectia3: „NU pune date personale reale”.
- Imagini de stoc: „libere de drepturi” doar cu Microsoft 365 (parțial Office 2021). „fara probleme de copyright” e adevărat în acea condiție, nu în general.
- Slide 1 „Subiect + Autor + Clasa/Data”: numele elevului pe propriul proiect școlar — normal; problema apare doar dacă proiectul se publică.

## Specialistul (designer de prezentări, 2026)
- Regula 6x6, max. 2 fonturi, contrast, 24 pt corp — practică curentă, corectă.
- Statistica din deschiderea-model (r. 718) — adevărată la limită (+5%), doar la vârful atmosferei (`04_a_doua_cale.json`); un designer nu pune o cifră fără sursă pe diapozitiv, iar lecția cere bibliografie, dar exemplul ei n-o are.
