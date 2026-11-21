# Runda 25 — contra

## Cel mai puternic argument PENTRU
O singură cauză (originea ferestrei se schimbă, `scrollTop` nu) explică R21-2 și MINOR 1-2. O reparație în două locuri (`deseneazaGrila` păstrează poziția vizuală; o „vedere” mutată de derulare în `intindere`) le închide pe toate, iar grila normală (R0 = C0 = 0, fără vedere mutată) rămâne exact pe formulele vechi. Proba N1 păzește asta.

## Cel mai puternic argument ÎMPOTRIVĂ
Runda trebuie să NU aducă GRAV. Fereastra e codul cel mai fragil al lui Excel (G17-1 a stat acolo). O vedere care se mută singură la derulare poate lăsa celula activă în afara DOM-ului: tastarea „pe orb”, focusul care iese din aplicație, graficele desenate greșit. Și nu există referință pentru ce face Excel cu bara la A1048576 (cât de mic e cursorul, unde duce tragerea) — e [FARA_REFERINTA] 1.

## Adevărul incomod
Comportamentul „corect” al barei (cursorul pe toată foaia) și al lui PgDn (Excel mută vederea cu un ecran și ține celula activă în același loc pe ecran) NU e capturat. Repar doar continuitatea (ce cere suplimentul: „ca pe grila normală”), iar ce face Excel exact intră în `de_verificat.md`. La O4, două din cele patru scenarii probabil nu se pot repara cinstit în `excel.js`: diferența e în protocolul de citire (realul apasă Esc + Esc înainte să citească celulele).

## Hotărârea (după cele de mai sus)
1. Fereastra: reparația în două locuri + plasa: când tastezi într-o celulă activă care nu e desenată, vederea se întoarce la ea (cum face Excel). Regres: probele 21, 17, 10, 9, 8, 6 + O4.
2. O4: repar doar ce are rezultat real (numere-afisare: textul științific + lățirea coloanei; autofit: lățimea textului, dacă găsesc o regulă care nu strică celelalte scenarii; sortare: ținta `meniu:Clasa`). Pentru Esc + Esc: probă, nu „reparație” care ascunde textul din celulă (ar strica §3 „ecranul = starea”).
3. MINOR 5-6: numele barelor și poziția grilei doar prin `excel.js`.
