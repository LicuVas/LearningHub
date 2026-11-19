# Valul B-excel, încheiat după runda 10 — OPRIT (PLATOU + LIMITA_VAL) (scris de orchestrator, 19.11.2026)

`python D/opreste.py` după rândul 12 din `jurnal.jsonl` a dat **OPRESTE**, din două motive (`runde/10/opreste.log`):
- **PLATOU:** „aceleași numere O1-O9 în rundele 8, 9, 10”;
- **LIMITA_VAL:** „6 runde în valul curent ('B', 'excel') (limita: 6)”. Runda `acoperire` se numără în val.

Nu e convergență: criticul rece mai are 3 GRAV deschise.

Platoul vine din oracole, nu din reparații:
- O1-O9 nu văd reparațiile din rundele 8-10, care sunt comportamente (ferestre, focus, taste, grafice, vărsare);
- acestea le măsoară doar criticul rece, care a coborât de la 9 la 3 GRAV.

## Numerele întâi
| | pornire val | r6 | r7 | acoperire | r8 | r9 | r10 |
|---|---:|---:|---:|---:|---:|---:|---:|
| O1 | 61 | 61 | 61 | 61 | 61 | 61 | 61 |
| O2 | 13392 | 13392 | 13392 | 13392 | 13392 | 13392 | 13392 |
| O3 | 20337 | 20337 | 20337 | 21586 | 21586 | 21586 | 21586 |
| O4 | 101 | 43 | 43 | 69 | 50 | 50 | 50 |
| O5 | 154 | 113 | 113 | 113 | 113 | 113 | 113 |
| O6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| O7 | 353 | 353 | 353 | 343 | 343 | 343 | 343 |
| O8 | 102 | 102 | 102 | 102 | 102 | 102 | 102 |
| O9 | 41 | 34 | 34 | 34 | 34 | 34 | 34 |
| porți | 41 | 41 | 41 | 41 | 41 | 41 | 41 (doar cum_fac; date_personale 0) |
| GRAV criticul rece | — | 10 | 9 | — | 7 | 4 | 3 |
| repere.lock | ok | ok | ok | reînghețat | ok | ok | ok |

- **Coloana `acoperire`:** creșterile O3 și O4 sunt suprafețe și scenarii noi capturate din Excel real (`runde/7/acoperire_excel.md`), permise de contract.
- **O1/O2/O6/O7** depind de lecții și se mișcă abia în etapa C (mutarea lecțiilor pe bibliotecă).
- **O6** a depășit de două ori limita de 1800 s în măsurarea mare (runda 9: 1802 s; runda 10: 1801 s). Reluat singur, a dat 0 de fiecare dată (`runde/9/masurare_o6_c2.json`, `runde/10/masurare_o6.json`).

## FĂCUT (cu dovada)
- **Excel în bibliotecă**, construit în runda 6 și reparat în rundele 7-10. Comis LOCAL pe `fidelitate-aplicatii`:
  - r6: cb86fbc3;
  - r7: 9c6730e2;
  - acoperire: 4b53a65a;
  - r8: d0ab48fd, 1c73a5fe;
  - r9: c0eaf3e1, 78a6cb20, 5d542c04;
  - r10: 770587e5 + commitul acestui raport.
- **Numerele:** O4 101→50, O5 154→113, O9 41→34.
- **GRAV închise de critici, cu citat:**
  - criticul 7: X1-X4, X6, X7, X9;
  - criticul 8: X5, X8, K2-K6;
  - criticul 9: K1, E1-E4;
  - criticul 10: E5 (vărsarea D2:D6 = 432…288, ca în Excel real) și A2 (Average 7,5 · Count 6 · Sum 45 la locurile din referință) (`runde/10/critic.md:44`, `:98`).
  - Regresul tuturor celor închise înainte ține (`runde/10/critic.md:112`). Singurele căderi din probele vechi sunt cele cerute de probe mai vechi decât referința (X6, X8).
- **Referințe reale noi** (runda `acoperire`): Save this file, Save your changes, lista Σ, Sort pe niveluri, erorile formulei, galeriile, graficele, bara de stare; 12 scenarii noi.
- **Regresul Word:** curat în toate cele 5 runde (capturi identice pixel cu pixel, în afară de cursorul care clipește).

## NEFĂCUT
- **Publicarea pe proba:** niciuna. Regula cere criticul fără GRAV. Rămân deschise 3 (`runde/10/critic.md`):
  - **X10** (`:34`) — lecția m2-l11 nu se poate termina. „Insert Line or Area Chart ▾” și „Add Chart Element › Data Labels” dau doar mesajul central, iar atelierul cere etichete de date. Listele lor nu sunt în referință.
  - **A1** (`:64`) — pe calculator și în fereastra mică graficul nou e la locul din Excel real. Pe telefon însă acoperă tabelul și nu se poate muta cu degetul (tragerea se oprește după ~15 px, fără eveniment). Atingerea pe C5 alege graficul, iar graficul nu se poate șterge (Backspace fără efect, niciun buton Delete). Lecția m2-l11 se blochează pe telefon.
  - **T1** (`:129`) — pe telefon, literele tastate în titlul graficului au ținta `celula:A1`. Asistentul arată indiciul în timp ce elevul scrie corect.
- **Deblocatorii:**
  - **X10:** o rundă `acoperire` Excel, cu capturi pe desktopul ascuns `LHRefOffice` (`referinte/dump_uia_office.py`), care să cuprindă:
    - `lista.ChartTypeLineInsertGallery`;
    - Add Chart Element › Data Labels;
    - plus faptele dovedite deja prin COM de criticul 10 (`#SPILL!`, vărsarea lui `=B2:B6`, Ctrl+săgeți peste celulele vărsate, Ctrl+↓ până la rândul 1.048.576 — `de_verificat.md` R10-3, R10-5, R10-6).
  - **A1 și T1:** o rundă Excel de reparații (gesturile cu degetul pe grafic și ținta tastării de pe telefon). Nu cer nimic de la Vasile.
  - Valul Excel se poate redeschide după celelalte valuri B, sau înaintea etapei C.

## NESIGUR
- **Locul graficului** e dovedit prin COM pe Excel invizibil, în 9 mărimi de fereastră. Dă G5 la 1366×768, nu H11.
  - Gestul real pe galerie, într-un Excel vizibil cu panglica, n-a putut fi jucat (`de_verificat.md` R10-1).
  - Regula se potrivește cu toate cele 9 citiri (`runde/10/critic.md:65-69`).
- **[FARA_REFERINTA]** (`runde/10/critic.md:166`) și `D/de_verificat.md`: R6-…, R7-…, R8-1…R8-19, R9-1…R9-10, R10-1…R10-9. Așteaptă o rundă `acoperire` sau privirea lui Vasile la PC.
- **Constructorii au trecut de 200k de context** în fiecare rundă (r10: 327k), deși regula cere PREDARE. Predările au mers curat cu `stare_autor.md` și cu commit-uri de control între constructori.
