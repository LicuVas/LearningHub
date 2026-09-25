# Oracolul Excel — simulatorul (tip-foaie.js) față de Excel-ul adevărat

Excel: versiunea 16.0 · limba interfeței 1033 · separator de listă „;” · zecimale „,”
Pe acest PC: SUM se scrie `=SUM(1;2)`, IF `=IF(1>0;1;0)`; eroarea de împărțire apare `#DIV/0!`, funcția necunoscută `#NAME?`, TRUE apare `TRUE`.

**192 formule, 191 la fel, 1 diferite.**

| Formula | Excel | Simulatorul nostru |
|---|---|---|
| `=COUNTIF(D2:D7,">=12.5")` | 0 | 3 |
