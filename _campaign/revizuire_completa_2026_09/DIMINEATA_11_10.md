# Dimineața, 11.10.2026 — ce s-a făcut peste noapte la lecțiile din modulul 2 (V, VI, VII)

Ai cerut (10.10, 23:21): „să adauge restul lecțiilor pe modulul II la toate clasele unde lipsesc”. Lipseau 18 lecții: câte 6 la a V-a, a VI-a și a VII-a. A VIII-a era deja completă.

**Pe scurt: 8 lecții noi sunt pe sit**, verificate de judecători independenți până la zero greșeli grave sau mari. Alte 3 sunt scrise, dar încă nejudecate. 7 nu sunt începute. M-am oprit din cauza limitei de consum și a deciziilor care sunt ale tale (mai jos).

## FĂCUT (pe sit, verificat după publicare)

| Lecția | Ce predă | Commit |
|---|---|---|
| V/10 | Operații cu fișiere și foldere: creare, redenumire, copiere, mutare, ștergere, căutare | `da379ee3` |
| V/13 | Serviciile Internetului: la ce folosește fiecare | `5fd275bf` |
| V/14 | Navigarea pe web și căutarea cu motoare de căutare | `4771947a` |
| VI/10 | Evaluarea sumativă la prezentări (antrenament pentru proba practică) | `da379ee3` |
| VI/11 | Siguranța pe Internet și antivirusul | `5fd275bf` |
| VI/12 | Datele personale, parolele, identitatea pe Internet | `ae7d0dc2` |
| VII/10 | Evaluarea sumativă la tehnoredactare (antrenament pentru proba practică) | `1bf036f9` |
| VII/11 | Interfața aplicațiilor de sunet și video (Audacity, Clipchamp) | `da379ee3` |

- **Dovezile:** fiecare lecție a trecut printr-un autor, apoi printr-o pereche de judecători (Opus și Sonnet), reparare și o judecată finală pe Opus, cu 0 greșeli grave și 0 mari. Apoi scriptul de publicare a trecut toate porțile: plan, construire, legături, metadate, date personale, testul jocului, linia de verificare. La final a confirmat că pagina de pe sit e identică cu fișierul comis, că marcajul se vede (verificat de mine și cu `curl`) și că proba de fum dă 0 erori la 390 și la 1280 px.
- **Ce am pus în commituri:** doar fișierele lecțiilor mele, verificat cu `git show` la fiecare. Commiturile sesiunilor `ai-0-b7` (motorul) și `ai-0-3d` („Cum fac…?”) le-au publicat ele, cu acordul lor, înaintea mele.
- **VI/12 și siguranța:** am verificat de 4 ori, independent, că parolele scrise de copii în pagină nu ajung nicăieri: nici în browser, nici în panoul tău.
- **Câteva lucruri găsite de judecători și reparate înainte de publicare:**
  - un laborator care, urmat literal, îi închidea copilului chiar lecția (V/13);
  - un exercițiu care dădea „Corect” deși copilul deschisese fișierul înainte de scanare (VI/11);
  - în Audacity 3, ▶ după Pauză nu continuă, ci o ia de la început (VII/11);
  - butonul de ghilimele care pe telefon nu mergea (V/14).

## NEFĂCUT (și ce le deblochează)

| Lecția | De ce nu | Ce o deblochează |
|---|---|---|
| V/11, V/15, VII/12 | **Scrise**, trec porțile autorului, dar **nejudecate**: limita de consum (vezi decizia 1) | Judecată + publicare într-o tură următoare, după resetarea limitei (luni 12.10, ~11:40). Notele de predare sunt în `_proba\stare_autor.md` |
| V/12 (evaluarea SO) | Depinde de V/10-11; n-am pornit-o din cauza limitei | Resetarea limitei; V/11 publicată întâi |
| VII/13, VII/14, VII/15 (audio-video) | Lanț: fiecare continuă simulatorul celei dinainte; n-am pornit, din cauza limitei | Resetarea limitei; VII/12 publicată întâi |
| VI/13, VI/14, VI/15 (e-mail) | **Decizia ta**: ce e-mail folosesc conturile de clasă (decizia 2) | Răspunsul tău |

## NESIGUR (de verificat de tine sau în laborator)

- **Word, pe calculatorul tău.** O probă din noaptea asta a lăsat Word-ul în „Aspect web” la 105 %. L-am pus la loc pe „Aspect pagină”, prin Word, nu prin registru. Zoomul îl văd la 390 % în instanțele invizibile și nu se lasă pus la 100 % din program. **Când deschizi prima dată Word: Vizualizare → Zoom → 100 %.**
- **Fapte nevăzute pe ecran.** Câteva lucruri din lecții le-am luat din documentația Microsoft, nu le-am văzut cu ochii mei: meniul Start, ferestrele Edge, scutul antivirusului, Clipchamp, Audacity 3. Noaptea era interzis să pornim ceva pe ecranul tău vizibil. Fiecare lecție are lista lor în `capturi_lipsa.json` și în `afirmatii.json` („nesigur”). Se lămuresc cu câteva capturi făcute în laborator.

## Deciziile care te așteaptă

1. **Limita de consum.** Am oprit lecțiile noi la 81 % din limita de 7 zile, care se resetează luni pe la 11:40. Dacă ajungea la 100 %, rămâneai fără Claude duminică și luni dimineață, la școală. Varianta (a), cea pe care o recomand: continuăm după resetare cu cele 3 ciorne, apoi cu V/12 și VII/13-15. Varianta (b): continui acum, cu riscul ăsta.
2. **E-mailul de la a VI-a (VI/13-15).** Ce serviciu folosesc conturile de clasă? (a) Gmail / Google Workspace, recomandarea mea dacă școala are conturi Google. (b) Outlook / Microsoft 365. (c) Fără conturi: doar o căsuță simulată în pagină.
3. **Aplicațiile audio-video.** Am ales Audacity și Clipchamp, ca în jocul tău `audio-video-vii`. Dacă laboratorul are altă aplicație sau Audacity 3 în loc de 4, spune-mi.
   - **Descoperire VII/12:** Audacity 4, la prima salvare cu un nume care există deja, înlocuiește fără să întrebe proiectul colegului. Lecția îl învață pe copil să verifice lista înainte de Salvare.
4. **Evaluările (V/12, VI/10, VII/10).** Testul tău pentru ele nu există încă. Paginile au antrenament, marcat clar ca antrenament.
   - **VI/10:** grila de produs e folosită doar pentru autoverificare.
   - **VII/10:** proba e notată pe C/B/A (SISTEM_EVALUARE §4.1). Rămâne de hotărât: C/B/A sau grila de produs?
   - **Stilurile de titlu (Heading 1):** sunt în fișa unității VII-U1, dar lecțiile VII/2-9 nu le predau. Le adăugăm undeva?
5. **Parola, „cui o spui”.** VI/12 spune „o știi doar tu și părinții tăi”, ca Poliția și jocul tău. DNSC spune „nimănui”. Rămâne așa?
6. **V/15 cade pe 25.12.2026, ziua de Crăciun** (în `Calendar_ore`). E o greșeală de calendar?
7. **8 greșeli în lecții DEJA publicate.** Le-a găsit sesiunea „Cum fac…?” (`ai-0-3d`). Exemplu: VII/6 spune că „1.25 cu punct merge”, dar la margini Word respinge punctul. Lista e în `_campaign\cum_fac_2026_10\pentru_lectii.md`. Le reparăm într-o tură următoare?

## Incidente pe calculatorul tău (regula 25) — toate închise, scrise ca să știi

- **23:44.** Autorul VII/11 a pornit din greșeală Audacity pe ecranul vizibil, cu `--version`. După un minut nu mai era pornit, iar setările au rămas neatinse.
- **01:22.** Un judecător a șters din registru 130 de chei ale ferestrelor „Salvare/Deschidere”. Erau urme ale altor probe din noaptea asta, nu ale tale. Registrul e acum ca înainte de probe (65 de chei).
- **VI/10.** Câteva ordini din lista „folosite recent” a ferestrelor de fișiere n-au mai putut fi refăcute exact. Lista e în `lectii\vi\m2-l10\surse.md`.
- **V/15.** Fereastra „Salvare ca” din probă a propus numele unui fișier din Descărcările tale. Nu s-a apăsat „Da”, iar fișierul tău a rămas neatins.
- **Memoria prin care Python pornește PowerPoint** era stricată din 06.10, iar probele pe PowerPoint picau din cauza ei. Am mutat-o deoparte (`%TEMP%\gen_py\3.13\_stricat_ppt_20261011_…`) și se reface singură.
- **La final:**
  - listele „Recent” din Office: 5 intrări ale probelor scoase, au rămas 0;
  - în panoul tău nu există niciun elev de probă;
  - niciun Office sau Audacity nu a rămas pornit.

## De dus în componentele comune (nu le-am atins: au alți proprietari)

- `explorer-citire.js` (V/9, publicat): pe telefon ascunde pictograma folderelor. Cauza e linia 143, `.exc-rand .d{display:none}`.
- Panglica simulatorului PowerPoint: filele au 25 px pe telefon.
- `wordpag` (VII/7): pe telefon, la foaia mică, celulele tabelului se ating greu.
- Butonul „Ieși” de pe eticheta cu numele: 21 px.

Jurnalul complet al nopții e în `NOAPTE_10_10.md`, iar contractul în `contract_noapte_10_10\contract.md`.

## La ora raportului
- `stare.py --modul M2` (03:5x): publicat 22 · în lucru 3 (ciornele V/11, V/15, VII/12) · neîncepute 7 (V/12, VI/13-15, VII/13-15). Consumul: 81 % din limita de 7 zile.
- VII/10 a avut nevoie de 5 judecăți: punctajul probei de antrenament se putea păcăli. Acum: lucrul complet = 12/12, o scăpare de un semn = tot 12/12, „șterg tot” = 0. Rămân 2 MINOR de punctaj (două scăpări departe una de alta dau 5/12; la C1, Ctrl+A ia 20/20 cu bifa roșie) — de reparat într-o tură următoare.
