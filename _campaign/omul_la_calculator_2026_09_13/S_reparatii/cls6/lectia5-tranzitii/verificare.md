# Verificare reparatie — cls6/lectia5-tranzitii (13.09.2026, runda 2)

**Verdict: TRECE** · 50 de schimbari verificate · S_poarta = OK · data-quiz 10/10 valide · etichete echilibrate

| # | Defect din runda 1 | Stare in runda 2 | Dovada |
|:--|:--|:--|:--|
| 1 | Morph „doar 2019, 2021 sau 365” (lipsea 2024) — important | REPARAT in toate cele 5 locuri | grep: 0 formulari vechi; morph_ro „Se aplică la … PowerPoint 2024” |
| 2 | Categoriile in romana date ca fapt sigur | REPARAT: „in unele versiuni romanesti: Subtil / Interesant / Dinamic” | citit randul 201 |
| 3 | „Toate efectele (7)” | REPARAT: „de exemplu Pan, Ferris Wheel, Rotate, Orbit” | grep „Toate efectele” = 0 |
| 4 | „prezentarea se opreste” | REPARAT: „ramane pe acel slide pana dai click” (2 locuri) | grep |
| 5 | Resturi in engleza (On Click/After, titluri, Ex.3 slide 5-6) | REPARAT | grep pe formele vechi = 0 |

**Concluzie:** toate cele 5 defecte sunt reparate, iar formularea despre versiunile Morph concorda acum cu pagina Microsoft.
Zonele atinse nu au stricat nimic: chestionarele sunt identice ca structura si chei, HTML-ul e echilibrat, iar poarta paginii trece.
A ramas doar o nuanta neblocanta: reflectia din Ex.3 foloseste „Morph / Push / Fade” in engleza, dupa ce numele romanesti au fost deja introduse.
