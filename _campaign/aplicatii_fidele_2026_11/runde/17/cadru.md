# Runda 17 (B-excel#2), cadrul — unghiul stare_finala_erori

## Presupuneri despre suprafață (graficul din m2-l11 + vărsarea)
1. Lista Insert Line or Area Chart ▾ și lista Add Chart Element se pot desena din referință exact ca lista Column (același `listaRef`, aceeași convenție `meniu:<rând>`). Dacă generatorul nu le pune în `date/excel.json`, nimic nu le desenează: `genereaza_excel.py --verifica` dă azi 2 chei diferite față de referința reînghețată după r14.
2. Submeniul Data Labels ▸ depinde de TIPUL graficului ales (referința are două liste: `#Data Labels` la Line, `#Data Labels#Clustered Column` la coloane). Pentru Bar / Pie nu există referință: acolo nu se inventează listă.
3. Pe telefon, tragerea graficului se oprește pentru că browserul preia atingerea ca derulare (`pointercancel`); `touch-action:none` pe grafic (în `excel.js`, pe element) o lasă bibliotecii, fără fișier comun.
4. Ținta textului venit fără `keydown` (telefon) e `I.zonaTinta`; PowerPoint o face deja getter (`powerpoint.js:400`). Același getter în `excel.js` repară T1 fără `aplicatii.js`.
5. Pasul zero (proba_grav.py, azi): X10, A1, T1 se reproduc toate (16 din 18 verificări picate; `proba_grav_inainte.log`).

## Citirile lui „fidel” pe suprafața asta
- **Aspect:** listele au aceleași rânduri, grupuri, ordine, rânduri gri și loc ca în `uia_excel.json`.
- **Gest:** mouse, atingere și tastele de acces (Alt, N, N 1 / Alt, J C, A, D) duc la același efect, cu un eveniment pe gest.
- **Stare finală / erori:** după gest, `stare()` are tipul, seriile, categoriile și etichetele pe care le-a citit Excel prin COM; o celulă vărsată peste una ocupată arată `#SPILL!`; Ctrl+săgeți se opresc unde se oprește `End(xl…)`.

**Aleasă: stare finală / erori** (unghiul rundei). Celelalte pierd: aspectul e numărat deja de O3 pe listele noi, iar gestul nu folosește la nimic dacă starea de după e alta decât în Excel. Aspectul și gestul se fac oricum, ca să se poată ajunge la stare, dar „gata” se judecă pe stare (O4 + `proba_grav.py`).
