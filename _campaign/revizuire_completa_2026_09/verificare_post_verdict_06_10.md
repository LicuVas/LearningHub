# Verificare independentă post-verdict, 06.10.2026 (VIII/10, VIII/11, VIII/12)

Doar citit, nimic modificat. Rețea: numai 127.0.0.1 (ctx.route + ctx.close()).

| # | Schimbare | Verdict | Dovada (citat + sursă) |
|---|---|---|---|
| 1 | VIII/10 J2-01: `mesajSortare` + „why” P4 | ADEVĂRAT | Probă nouă în Chromium (scratchpad `v_sort.py`, pe pagina servită local), pe drumul Continue: mesajul spune „Dacă ai ales Continue with the current selection, repetă sortarea din coloana selectată: când apare Sort Warning, alege Expand the selection” (`lectii/_sim/excelx-sortare.js` r.405). După Ctrl+Z: C = 64,97,81,90,73 și selecția C2:C6 rămâne. Dacă repeți sortarea din C2:C6, Sort Warning APARE și Expand e ales implicit; col. A = Elena, Bianca, Andrei, Victor, Mihai; „Corect! Elena (97) urcă prima, cu clasa ei. S-a sortat tot tabelul, nu doar coloana selectată.” Drumul vechi (clic pe o celulă, fără Sort Warning) e acum ramura „Altfel”. Nu e contradicție: `m2-l10/index.html` r.161 și r.160 (indiciul „Lasă aleasă prima variantă, Expand the selection”). Fără termen nepredat (Sort Warning, Expand, Continue sunt predate la P4). Notă minoră: „nu doar coloana selectată” e puțin ciudat dacă elevul a ales o singură celulă; nu e fals. |
| 2 | VIII/11 N6: „why” radial | ADEVĂRAT | Excel real: `m2-l11/_verificare/j2_excel2.json`, `R_radial_din_coloane`: `dupa_Inserare_Pie_cu_ales` și `dupa_ChartType_5` au `"tip":"Pie","legenda":false`, deci feliile nu au nume după schimbare. Ultimul pas (P5 „Titlul, legenda și etichetele de date”, `m2-l11/index.html` r.216-221) predă: „Din același meniu pornești sau oprești Legendă (Legend)” și „butonul + … Elemente diagramă … are bifele Titlu diagramă, Legendă și Etichete de date”; exercițiul `inca` 1 folosește `legenda:true`. Slăbiciune (nu fals): la P5 legenda nu e demonstrată pe un radial, iar „Etichete de date” sunt descrise doar pentru coloane și linie. |
| 3 | VIII/12 J2-01: avertisment pasul 8 | ADEVĂRAT | `m2-l12/_verificare/j2_excel.json`: `martor_A1C6_ClusteredColumn` (zona A1:C6, 4 rânduri de date): `nr_serii:3` față de 2 la A1:C5, a treia serie „Activitatea” are valori 0, categoriile sunt "1.0"…"5.0" în loc de ecran/teme/sport/citit. `T2_buget.martor_A1B6_Pie`: `nr_serii:2`, prima serie „Cheltuiala” cu valori [0,0,0,0,null], `prima_serie_valori_nenule:0`, deci cerc gol; A1:B5 dă 4 valori nenule. Textul (`m2-l12/index.html` r.215): „La coloane apare o serie în plus și numerele 1-5 jos, în locul numelor; la radial, cercul iese gol.” |
| 4 | VIII/12 J2-03: rezumatul diplomei | ADEVĂRAT | Profesorul (`Info_Gimnaziu_2026/data/activitati_lectii_VII_VIII.json`, „Mini-proiect…”): „tabel, cel puțin trei formule, o funcție de decizie, un grafic și o concluzie scrisă”. `diploma.rezumat` (`m2-l12/index.html` r.431): „a făcut, cu date reale, ce cere profesorul: tabel, cel puțin trei formule, o funcție de decizie, un grafic și o concluzie scrisă; în pagină a exersat formule cu operatori, SUM, AVERAGE (la varianta lungă și MAX, MIN), IF, …”. Cerința e întocmai, separată prin „;” de ce a propus pagina. Ce spune despre variante e corect: varianta scurtă are SUM și AVERAGE (r.222), cea lungă adaugă MAX și MIN (r.222, r.309, r.379). „grila profesorului” există („grila de produs”). |

## Porți
- test_joc.py: `[TRECUT] m2-l10 · întrebări jucate: 25`, `[TRECUT] m2-l11 · 34`, `[TRECUT] m2-l12 · 27` (exit 0 la toate; avertisment obișnuit „1 niveluri (obișnuit 5-8)”).
- verifica_lectie.py --fara-t1: ultima linie `0` la toate trei (`BLOCHEAZĂ PUBLICAREA: 0`; exit 0).

Rezultat: 4 ADEVĂRATE, 0 FALSE.

## Măsurat exact: tot ce s-a schimbat după ultimul verdict (06.10, 04:55)

Fiecare lecție are un singur commit (cel de publicare), deci git nu arată diferența. Sursa: comenzile de editare din transcrierile agenților (fiecare e o înlocuire `a → b` cu `assert s.count(a)==1`) și Edit-ul dirijorului. Căutate toate editările din transcrieri pe aceste fișiere, după ora verdictului (`scratchpad/dupa_verdict.py`, `dupa_verdict_bash.py`); acum, pe disc, fraza veche apare de 0 ori, iar cea nouă o dată (`dupa_verdict_stare.py`).

| Lecție (verdict) | Ora, cine | Fișier | Ce s-a schimbat |
|---|---|---|---|
| VIII/10 (01:47) | 01:48, agentul mecanic | `_sim/excelx-sortare.js` | o frază din mesajul de la „Verifică” (în șirul de text din `mesajSortare`), nu cod |
| VIII/10 (01:47) | 01:48, agentul mecanic | `m2-l10/index.html` | o frază din `why` la P4 |
| VIII/10 (01:47) | 01:49, agentul mecanic | `m2-l10/surse.md` | un rând nou în tabelul reparațiilor (nepublicat ca pagină) |
| VIII/11 (03:30) | 03:50, dirijorul | `m2-l11/index.html` | o frază din `why` la P4 (N6) |
| VIII/12 (03:55) | 03:56, agentul mecanic | `m2-l12/index.html` | două fraze: avertismentul de la pasul 8 și rezumatul diplomei |
| VIII/13, 14, 15 | — | — | nimic (pagina modificată ultima oară înaintea verdictului: 03:05 / 02:49 / 02:54) |

În total: 5 fraze din șiruri de text plus un rând de documentație. Nicio schimbare de exercițiu, de răspuns sau de logică. Toate cele 5 fraze sunt verificate mai sus: 4/4 puncte ADEVĂRATE, iar porțile trec.
