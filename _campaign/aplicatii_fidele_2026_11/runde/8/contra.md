# Runda 8 · etapa B · Excel · CONTRA (pasul 4)

**PENTRU planul de reparație** (cele 9 GRAV, în ordinea suplimentului, cu referințele noi): fiecare GRAV are acum o
referință reală (scenariu jucat în Excel sau captură UIA), iar O4 numără direct K4, K5, K6 și X8. Deci progresul se vede
pe un oracol pe care nu-l scriu eu, nu doar pe proba mea. Meniurile și listele desenate din `date/excel.json` (regenerat)
scad și O3 pe suprafețele noi, fără desen de mână.

**ÎMPOTRIVĂ**: tastatura atinge `aplicatii.js`, comun cu Word, iar Word are 8 GRAV deschise și probe care se uită la ținta
fiecărui eveniment. O schimbare „mică” acolo (ținta tastei citită înainte de gest) poate muta ținte în Word. În plus,
nouă GRAV într-un context nu încap: dacă le încep pe toate, risc să las patru pe jumătate.

**Adevărul incomod** (punctul cel mai puțin sigur): ce face Excel cu tastele în ferestre (Tab, ordinea focusului, Alt+↓)
NU e capturat în runda acoperire (`acoperire_excel.md` §7: „K1 Tab / Esc / Alt+↓, K2 Enter: fără captură nouă”). Am doar
`AccessKey`-urile din UIA, ordinea nodurilor din arbore și regula Windows pentru Enter (§4). Ordinea Tab „din referință”
e de fapt ordinea arborelui UIA, care de obicei (nu garantat) e ordinea Tab.

**Hotărârea**: (1) cârligul din `aplicatii.js` e opțional, pornit doar de Excel, deci Word are evenimente identice
(proba: regresul Word la 0); (2) lucrez strict în ordine și predau la graniță curată, nu încep un GRAV pe care nu-l pot
proba; (3) pentru K1, ordinea Tab = ordinea arborelui din referință, scrisă ca atare în `diferente.md`, iar ce nu are
captură (focusul inițial în afară de Sort, Alt+↓) se notează [NEVERIFICAT] unde nu are citat.
