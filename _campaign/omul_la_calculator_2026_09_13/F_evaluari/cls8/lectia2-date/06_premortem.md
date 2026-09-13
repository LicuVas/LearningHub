# 06 — Pre-mortem (U14) și explicații alternative (U13)

*Schița (5 motive) scrisă imediat după pasul 1; completată cu verificările la pasul 5.*

„E 09.10.2026, 11:50, la Brauner. Ora a eșuat. De ce?”

| # | Motivul | Verificarea făcută | Rezultatul |
|--:|:--|:--|:--|
| 1 | **Nu s-a terminat nimic:** lecția = orele 5 și 6 din plan | poarta (U12) pe `03_pasi.json` + `masuri.json` (4.048 cuvinte) | vezi ieșirea porții: nu încape la ritmul provizoriu; încape doar la ritm dublu. `01_citit_inapoi.md`: ora 6 (formatare) nu are fișier, dar e în lecția asta |
| 2 | **Elevii au tastat 8.5 / 3.50 și Excel n-a înțeles numărul** (sau data 15/06/2026 a rămas text) | `u4_cultura.txt`: ro-RO zecimal „,”, dată „dd.MM.yyyy”; en-US „.”, „M/d/yyyy”; .NET: „8.5” nu e număr în ro-RO, „15/06/2026” nu e dată în en-US | lecția e scrisă astfel încât **pe orice setare** una din cele două convenții pică. Ce face Excel exact: nu se poate fără sală, pentru că setarea regională a laboratorului e necunoscută |
| 3 | **„Am lipit și e tot în A”** la Ex. 1 | `u1_construieste.py`, foaia `Lipire`: `=COUNT(A1:F5)` = 0, `=COUNTA(B1:D5)` = 0; blocul nu are Tab | confirmat pe fișier; comportamentul Excel real la lipire (fără Tab = o coloană) modelat, nu observat în Excel |
| 4 | **Elevii nu găsesc butoanele** (Office în română) | Microsoft ro-ro text brut: „Pornire”, „Îmbinare & centru”, „Monedă”, „Procentaj”, „culoare de umplere” | numele există și diferă de lecție; limba Office din laborator: nu se poate fără sală |
| 5 | **Elevii au învățat scurtături greșite și și-au stricat tabelul** (Ctrl+L → Create Table; bonusul Merge peste antet) | `surse/shortcuts_en.txt` / `_ro.txt`; `Bonus_Merge!F2` = 1 după îmbinare (era 4) | confirmat pe sursa primară și pe fișier |

## U13 — pentru semnalările grave: altă explicație + observația care le deosebește

**A. „Ctrl+L/E/R sunt greșite”**
- Alternativă 1: lecția se referă la Google Sheets (pe care îl pomenește) — acolo scurtăturile ar putea fi acestea.
- Alternativă 2: în Excel în română scurtăturile ar fi altele.
- Observația făcută: tabelul spune explicit „Shortcut” lângă „Excel”; pagina ro-ro Microsoft are aceleași taste: „Afișați caseta de dialog Creare tabel . Ctrl+L” (`surse/shortcuts_ro.txt`) → alternativa 2 cade. Pentru Google Sheets nu am descărcat sursa (alternativa 1 rămasă deschisă), dar lecția titrează „Shortcut-uri … in Excel” la întrebarea de la atomul 5 → se evaluează pentru Excel.

**B. „Bonusul îmbinării șterge antetul”**
- Alternativă: elevul ar face bonusul pe un tabel nou, fără antet în rândul 1.
- Observația: textul bonusului continuă Încearcă-ul pe același tabel („Selecteaza celulele A1:D1”, iar pasul 1 a pus antetul în A1:D1); în atomul 7 („Pas cu pas”) autorul pune corect titlul în rândul 1 și antetul în rândul 2 (A2:E2) → contradicție internă, nu interpretare.

**C. „Punctul zecimal nu merge”**
- Alternativă: laboratorul are Windows în engleză — atunci punctul merge, dar data zz/ll/aaaa pică.
- Observația: `u4_cultura.txt` arată ambele culturi; semnalarea e marcată `depinde_de_necunoscut: true`, iar schimbarea propusă acoperă ambele variante.

**D. „Totalul 47.50 e greșit”**
- Alternativă: „...” ascunde rânduri, deci 47.50 ar putea fi totalul altor produse.
- Observația: rezolvarea aceluiași exercițiu, cu aceleași primele două rânduri, dă 62.10; 17.50+12.00 = 29.5 (LibreOffice `Factura!G4`); nu există combinație din rezolvare care să dea 47.50 → greșeală de consecvență (R3.4), `minor`.
