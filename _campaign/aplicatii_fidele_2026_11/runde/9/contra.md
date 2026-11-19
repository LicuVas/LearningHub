# Runda 9 · B-excel · CONTRA (pasul 4)

**Pentru:** criticul 8 a dat cauza fiecărui GRAV mic cu fișier:rând (`excel.js:2696`, `:2043/2117`, `:1526/1589`,
`:2140-2152`, `:1408`), iar referința dă starea așteptată cu citat (`e_sum_lipit.mod_dupa_inchidere`, `c_autosum.mod_dupa_*`,
§4 `activat`). Reparațiile sunt locale (câteva rânduri fiecare), se pot proba cu gesturi reale înainte/după și nu ating
Word (`aplicatii.js` neatins).

**Împotrivă:** E3 schimbă drumul cel mai folosit din lecții (Σ + Enter, m2-l08); o greșeală acolo strică mai mult decât
repară. Iar modul Point după Σ înseamnă că ↓ nu mai primește formula — o probă veche sau un scenariu O4 care trimitea Σ + ↓
ar pica.

**Adevărul incomod (punctul cel mai puțin sigur):** ce scrie EXACT o săgeată în modul Point după Σ (de unde pornește:
din celula editată sau din zona propusă). Referința spune doar modul („Cell Mode Point”), nu și efectul săgeții. Am ales
mecanismul K5 (pornit din celula editată: B8 + ↓ → „=SUM(B9)”), cum cere suplimentul („ca la K5”), și l-am trecut în
`de_verificat.md` (R9-1). Proba verifică doar ce e citat: modul Point, formula neprimită, Enter → 48.

**Hotărârea:** repar E1, E2, K1, E4, E3 în ordinea suplimentului, cu proba după fiecare; regresul complet (Excel + Word)
după E3; graficele (X10) și E5 doar dacă încap în context.
