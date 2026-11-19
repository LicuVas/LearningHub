# Valul B-word, încheiat după runda 5 — OPRIT pe LIMITA_VAL (scris de orchestrator, 19.11.2026)

`python D/opreste.py` după rândul 6 din `jurnal.jsonl`: **OPRESTE (LIMITA_VAL)** — „6 runde în valul curent ('B', 'word')
(limita: 6)”. Runda `acoperire` (rândul 4) se numără în val. Nu e convergență: criticul rece mai are 8 GRAV deschise.

## Numerele întâi
| | pornire val | r1 | r2 | r3 | acoperire | r4 | r5 |
|---|---:|---:|---:|---:|---:|---:|---:|
| O1 | 61 | 61 | 61 | 61 | 61 | 61 | 61 |
| O2 | 13392 | 13392 | 13392 | 13392 | 13392 | 13392 | 13392 |
| O3 | 18546 | 18546 | 18546 | 18546 | 20337 | 20337 | 20337 |
| O4 | 162 | 98 | 98 | 98 | 120 | 101 | 101 |
| O5 | 201 | 154 | 154 | 154 | 154 | 154 | 154 |
| O6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| O7 | 355 | 355 | 355 | 355 | 353 | 353 | 353 |
| O8 | 102 | 102 | 102 | 102 | 102 | 102 | 102 |
| O9 | 48 | 41 | 41 | 41 | 41 | 41 | 41 |
| porți | 42 | 41 | 41 | 41 | 41 | 41 | 41 (doar cum_fac; date_personale 0) |
| GRAV criticul rece | — | 6 | 5 | 4 | — | 7 | 8 |
| repere.lock | ok | ok | ok | ok | reînghețat | ok | ok |

Creșterile din coloana `acoperire` sunt suprafețe noi văzute de oracole (capturi din Word real), permise de contract.
O1/O2/O6/O7 depind de lecții și se mișcă abia în etapa C (mutarea lecțiilor pe bibliotecă).

## FĂCUT (cu dovada)
- Biblioteca `aplicatii/` (schelet comun + Word) construită și reparată în 5 runde; comisă LOCAL pe `fidelitate-aplicatii`
  (be0ae421, 0602069c, 206142ea, d3dfe36f, d759ae2f, e9372dec + commitul rundei 5). O4 162→101, O5 201→154, O9 48→41.
- GRAV închise de critici, cu citat: criticul 2 → 1, 2, 4, 5, 6; criticul 3 → N1, N2, N3; criticul 4 → GRAV 3, A1, A2;
  criticul 5 → N4, T1, T2, T3, T4 (`runde/5/critic.md:26-83`). Regresul tuturor celor închise înainte: ține (`:127`).
- Referințe reale noi (runda `acoperire`, Word real pe desktopul ascuns): Save this file, Save your changes, Open,
  Save As PDF, liste (Font Size, Save as type, Bullets…), 10 scenarii noi — `runde/3/acoperire_word.md`.
- Proba de gesturi a rundei 5: 16/18 → 0/18 picate; regresul rundelor 2-4 + telefonul: 0 picate.

## NEFĂCUT
- **Publicarea pe proba**: niciuna; regula cere criticul fără GRAV. Deschise (8, `runde/5/critic.md`):
  - T5 (`:84`) — fără document, panglica rămâne activă și mesajul spune că „Bold” funcționează; Word real le are gri (`critic_probe/com_r5.json`);
  - T6 (`:109`) — Alt+↓ în lista Font Size nu poartă `activat`; drumul cu tastatura al scenariului `word-font-size-lista` rămâne la pasul 0;
  - S1 (`:140`) — bara de adrese din Save As / Open rămâne pe primul folder ales (arată „Descărcări”, salvează pe Desktop);
  - S2 (`:159`) — F12 pe un document deschis din Descărcări deschide Save As în Documente;
  - S3 (`:178`) — numele cu `: ? * "` se salvează fără mesaj (lecția `m1-l03:156` spune că Windows le refuză);
  - S4 (`:193`) — același fișier deschis a doua oară devine al doilea document; atelierul pică la `docuri:0`;
  - S5 (`:207`) — lista ferestrei Save As e goală, deși folderul are fișiere (fișierul colegei, `m1-l03:172`);
  - S6 (`:224`) — Ctrl+N dă mereu „Document1”, iar pagina pare ștearsă (Word real: Document2, Document3).
  Deblocator: o rundă Word nouă (valul se poate redeschide după Excel, sau înaintea etapei C), cu ținta = aceste 8.
  Toate au referință sau dovadă din Word real; niciuna nu cere ceva de la Vasile.

## NESIGUR
- [FARA_REFERINTA] (`runde/5/critic.md:240`): fereastra „already exists” (acum = mesajul central), bara galbenă
  Enable Editing (contează la mutarea lecției: testul „Ai apăsat Enable Editing” din atelier), radioul PDF ales la
  deschidere. Plus `D/de_verificat.md` (R1-R3, AC-1…AC-10, R5-1…R5-6) și `D/de_aprobat.md` (A2-1) — așteaptă captura
  sau privirea lui Vasile.
- Constructorii au trecut de 200k de context în fiecare rundă (317-450k), deși regula cere PREDARE.
- În runda 5, constructorul a scris reparațiile în timp ce rula măsurarea de pornire (01:40-02:12); pornirea a ieșit
  identică cu numerele finale ale rundei 4, iar măsurarea de după a pornit după ultima scriere (02:12:08), deci e valabilă.
