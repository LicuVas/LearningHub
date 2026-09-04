# Reluare — de unde continuăm (oprit 04.09.2026, ora 18:55, la cerere)

Situl e într-o stare **întreagă și publicată** (`f7bacc0`). Nimic pe jumătate scris.
Se poate relua oricând, în orice ordine — punctele de mai jos nu depind unul de altul,
cu excepția celor marcate.

## Ce e gata

| | stare |
|:--|:--|
| chestionare care se afișează | **504/504 pagini, 3199 de întrebări, 0 moarte** |
| ghicit după lungime | de la **65,3% → 32,8%** (nivelul hazardului) |
| chei de răspuns verificate una câte una | 1226 de întrebări, 2 chei greșite găsite |
| **rezolvări model** | **963 din 1606 exerciții (60%)** ← aici s-a oprit |
| lecții cu toate cele 5 secțiuni | 510 din 510 |
| cifrele de pe paginile de clasă | se potrivesc cu discul (`verifica_cifre.py`) |

## 1. Rezolvările model — continuă de unde a rămas (643 de exerciții)

Valul se reia **fără să refacă ce e gata**: `practice_io.py` sare peste exercițiile care au
deja rezolvare, iar workflow-ul are cache pe agenții terminați.

```bash
# reluare cu cache (cel mai ieftin), partea 1 si partea 2:
Workflow({scriptPath: "<repo>/_campaign/proba_elevi_2026_09_03/valuri/wf_t6.js",
          args: {parte: 1}, resumeFromRunId: "wf_75e96386-97a"})
Workflow({scriptPath: "<repo>/_campaign/proba_elevi_2026_09_03/valuri/wf_t6.js",
          args: {parte: 2}, resumeFromRunId: "wf_71251196-91b"})
```
Fără `resumeFromRunId` merge la fel de bine, doar că re-deschide și lecțiile gata (agenții
raportează „0 inserate" și trec mai departe). **De ce două părți:** plafonul e 1000 de agenți
pe rulare, iar aici sunt 2 etape × 507 lecții.

## 2. Caseta „Vrei mai mult?" — pregătită, nepornită (507 lecții)

Elevul bun n-are nicio ieșire în sus pe tot situl; asta e reparația. Unealta și stilul sunt
scrise și probate pe control negativ.

```bash
Workflow({scriptPath: "<...>/valuri/wf_t7.js", args: {parte: 1}})
Workflow({scriptPath: "<...>/valuri/wf_t7.js", args: {parte: 2}})
```
⚠ **Nu în același timp cu punctul 1** — scriu în aceleași fișiere.

`tools/depth_io.py` refuză orice legătură pe care n-o poate dovedi: internă care nu există pe
disc, externă în afara listei scurte (Wikipedia, MDN, w3schools, docs.python.org, pbinfo,
support.microsoft). Probat: a prins `lectia2-stiluri-sabloane.html` — nume real, dar din altă
secțiune a sitului.

## 3. Cele 22 de lecții care predau alt subiect decât slotul lor — pregătit, nepornit

Dosarul: `CONTINUT_ASEZAT_GRESIT.md`. Lista de lucru: `de_rescris_curat.json`.

```bash
Workflow({scriptPath: "<...>/valuri/wf_rescriere.js"})
```
⚠ **După punctele 1 și 2** — aceleași fișiere.

Cel mai important dintre ele: **`tehnologic/cls12` nu predă calcul tabelar nicăieri**, deși e
competență la proba practică de bacalaureat. Modulul predă de patru ori construirea unui site.

## 4. Cheile de progres care se ciocnesc — mecanic, 105 fișiere

```bash
python tools/repara_chei_progres.py            # arata ce ar schimba
python tools/repara_chei_progres.py --aplica   # scrie
```
21 de chei folosite de 105 lecții cu conținut **diferit**: cine termină lecția la tehnologic o
vede bifată și la umanist. ⚠ După punctele 1-3.

## 5. Mărunțișuri măsurate, nereparate

- **12 lecții încarcă `progress.js` dar nu-l pornesc** (nu se înregistrează în progresul
  modulului); 11 la fel cu `breadcrumb.js`. Motorul de atomi e curat peste tot — 0 lipsă.
  Cele mai multe sunt în `tic/cls7/extra-baze-date`. Scanare: `scratchpad/lipsa_init.py`.
- **67 de itemi** în care o variantă greșită își anunță singură greșeala, **32 de indicii** care
  nu discriminează. Slăbesc itemul, nu învață pe nimeni ceva fals. Oprit deliberat: fiecare
  rescriere în masă costă defecte noi (măsurat: 43% la prima rundă).
- `extra-word-cls7/lectia6-proiect.html` — orfană, n-o leagă nimeni.
- 418 fișiere `.bak_container_*` (13 MB, neurmărite de git). Nu le-am șters: nu se regăsesc
  identic în niciun commit, deci sunt dintr-o stare intermediară.

## 6. Clasa a IX-a — **NU se atinge cu metoda de mai sus**

`CLASA_A_IXA_PROGRAMA_NOUA.md`. Din 2026-2027 clasa a IX-a e pe programa **nouă**
(OMEC 3.716/2026); X–XII rămân pe cea veche. Votul celorlalte profiluri — metoda care a
funcționat la X–XII — **dă răspuns greșit acolo**, fiindcă majoritatea urmează programa veche.
Am scos cele 6 lecții din campanie (`cls9_amanat.json`).

E reproiectare de curriculum, nu reparație: se schimbă numele modulelor și ce se predă.
Plus, textul de programă de pe disc e din consultarea publică 2025, cu antetul necompletat —
**de confirmat textul final înainte de a rescrie ceva**.

Ce lipsește cel mai tare la a IX-a: **inteligența artificială** (cea mai mare temă nouă, acum
doar jumătate de lecție), tehnologiile emergente (VR/AR), aplicațiile pentru învățare.

## Unelte făcute în campania asta

| unealtă | ce face |
|:--|:--|
| `tools/quiz_io.py` | citește/scrie chestionarele în siguranță; cheia se schimbă doar cu motiv scris, care se loghează |
| `tools/practice_io.py` | inserează rezolvări model, refuză cele prea scurte sau cu HTML rupt |
| `tools/depth_io.py` | inserează caseta „Vrei mai mult?"; refuză orice legătură nedovedită |
| `tools/verifica_lectie.py` | poarta pentru o lecție: 5 secțiuni, chestionare care se parsează, cheie de progres unică, scripturi și legături vii |
| `tools/verifica_cifre.py` | cifrele afișate vs. discul; `--repara` |
| `tools/verifica_nume_continut.py` | numele fișierului vs. ce predă (semnalează, nu corectează) |
| `tools/repara_chei_progres.py` | prefixează cheia cu profilul, doar unde există ciocnire |
| `tools/lesson_digest.py` | 640 KB de HTML → 84 KB de substanță, pentru agenți |
