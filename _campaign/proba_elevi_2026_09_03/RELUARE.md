# Reluare — de unde continuăm (actualizat 05.09.2026, ora 13:45)

Situl e **întreg și publicat live** (`0986d08`, verificat pe adresa publică). Nimic pe jumătate scris.
Punctele de mai jos nu depind unul de altul, cu excepția celor marcate.

## Ce e gata

| | stare |
|:--|:--|
| chestionare care se afișează | **504/504 pagini, 3199 de întrebări, 0 moarte** |
| ghicit după lungime | de la **65,3% → 32,8%** (nivelul hazardului) |
| chei de răspuns verificate una câte una | 1226 de întrebări, 2 chei greșite găsite |
| **rezolvări model** | **1606 din 1606 (100%)** ✅ terminat 05.09 |
| rezolvări greșite găsite de corectori și reparate | **13**, verificate independent pe disc (21/21) |
| **chei de progres care se ciocneau** | **0** (erau 21 de chei folosite de 105 lecții) ✅ |
| lecții care trec poarta `verifica_lectie.py` | **488 din 510** (erau 325) — din care ~69 „reparate" au fost de fapt alarme false ale porții, nu lecții stricate |
| **caseta „Vrei mai mult?”** | **507 din 507 lecții** ✅ terminat 05.09 |
| casete greșite găsite de corectori și reparate | **27**, verificate independent pe disc (12/12) |
| cifrele de pe paginile de clasă | se potrivesc cu discul (`verifica_cifre.py`) |

## Ce s-a făcut pe 05.09

- **643 de rezolvări model** scrise, cu un val de 82 de agenți. Mutarea cheie: **un agent pe
  MODUL, nu pe lecție** (`wf_t6b.js`) — 507 agenți planificați au devenit 61 de loturi.
- **13 rezolvări greșite** reparate (`wf_t6b_reparatii.js`). Cea mai gravă: la
  `umanist/cls10` calcul tabelar toate trei rezolvările descriau Word, nu Excel.
- **`practice_io.py replace`** — unealta doar *insera*, deci o rezolvare greșită nu se putea
  corecta cu ea. Control: `tools/test_practice_replace.py`, 8/8.
- **Cheile de progres** prefixate cu profilul: 512 chei distincte, 0 ciocniri.
- **Poarta reparată** — striga defecte inexistente pe 69 de lecții bune (detalii mai jos).
- **507 casete „Vrei mai mult?”** scrise (`wf_t7b.js`, 127 de loturi, 159 de agenți). Elevul bun
  are acum o ieșire în sus pe fiecare lecție. 27 de casete greșite reparate (`wf_t7b_reparatii.js`).
- **`depth_io.py replace`** — la fel ca la `practice_io`. Ordinea contează: caseta veche se
  decupează abia după ce textul nou trece toate gărzile.
- **Titlul dublat pe 123 de lecții** — `tools/repara_titlu_dublat.py`, mecanic, control 9/9.
- **Încă două lecții cu conținut așezat greșit**, găsite căutând copiile unui defect semnalat
  (lista a crescut de la 22 la 24).

## 1. Cele 24 de lecții care predau alt subiect decât slotul lor — pregătit, nepornit

Dosarul: `CONTINUT_ASEZAT_GRESIT.md`. Lista de lucru: `de_rescris_curat.json` (24 de intrări).

```bash
Workflow({scriptPath: "<...>/valuri/wf_rescriere.js"})
```
⚠ **Rescrie-l întâi pe modul, ca `wf_t6b.js` / `wf_t7b.js`** — și pune-l să caute defectul în
TOATE profilurile-frate, nu doar unde a fost semnalat.

Cel mai important: **`tehnologic/cls12` nu predă calcul tabelar nicăieri**, deși e competență la
proba practică de bacalaureat. Modulul predă de patru ori construirea unui site.

Cele două adăugate pe 05.09, la `cls9/m1-sisteme-retele/lectia2-retele-internet.html`: la
**științe** lecția predă software (și dublează lecția 1), la **militar** predă comunicare
digitală. La ambele, competența *rețele și Internet* nu e predată nicăieri. Etaloanele
(tehnologic, umanist, pedagogic) au deja conținutul corect.

Confirmat tot pe 05.09: `tehnologic/cls10/m1-procesare-text/lectia3-corespondenta-aplicatie.html`
promite îmbinare de corespondență și predă integral PowerPoint.

## 2. Cele 22 de lecții care mai pică poarta — defecte reale, netriate

```bash
python "C:\00\Projects\LearningHub\tools\verifica_lectie.py" <fisier>
```
Lista cu motive: `poarta_lectii.json`. Împărțirea:
- **9** fără secțiunea *obiectiv*, **9** fără secțiunea *atomi* (mai ales `tic/cls7/extra-baze-date`)
- **7** fără cheie de progres (`AtomicLearning.init` lipsește — lecția nu se înregistrează
  în progresul modulului); mai ales `mat-info`
- **7** fără niciun chestionar
- **1** nelegată din index-ul modulului (`tic/cls5/extra-word-cls7/lectia6-proiect.html`)

⚠ Contrazice tabelul vechi care spunea „510 din 510 au toate cele 5 secțiuni" — de lămurit
care număr e bun înainte de a rescrie ceva.

## 3. Enunțuri defecte — decizie de curriculum, nu reparație

`ENUNTURI_DEFECTE.md`: două cerințe care nu stau în picioare (una dă codul complet la un
exercițiu de *performanță*, alta cere o mărime care nu intră în nicio formulă). Rezolvarea
nu le poate repara; enunțul trebuie schimbat.

## 4. Mărunțișuri măsurate, nereparate

- **67 de itemi** în care o variantă greșită își anunță singură greșeala, **32 de indicii** care
  nu discriminează. Slăbesc itemul, nu învață pe nimeni ceva fals. Oprit deliberat: fiecare
  rescriere în masă costă defecte noi (măsurat: 43% la prima rundă).
- `extra-word-cls7/lectia6-proiect.html` — orfană, n-o leagă nimeni (o vede și poarta acum).
- 418 fișiere `.bak_container_*` (13 MB, neurmărite de git). Nu le-am șters: nu se regăsesc
  identic în niciun commit, deci sunt dintr-o stare intermediară.
- Situl **e publicat** (05.09, ora 13:45), verificat pe adresa curată cu marker de conținut.

## 5. Clasa a IX-a — **NU se atinge cu metoda de mai sus**

`CLASA_A_IXA_PROGRAMA_NOUA.md`. Din 2026-2027 clasa a IX-a e pe programa **nouă**
(OMEC 3.716/2026); X–XII rămân pe cea veche. Votul celorlalte profiluri — metoda care a
funcționat la X–XII — **dă răspuns greșit acolo**, fiindcă majoritatea urmează programa veche.
Am scos cele 6 lecții din campanie (`cls9_amanat.json`).

E reproiectare de curriculum, nu reparație: se schimbă numele modulelor și ce se predă.
Plus, textul de programă de pe disc e din consultarea publică 2025, cu antetul necompletat —
**de confirmat textul final înainte de a rescrie ceva**.

Ce lipsește cel mai tare la a IX-a: **inteligența artificială** (cea mai mare temă nouă, acum
doar jumătate de lecție), tehnologiile emergente (VR/AR), aplicațiile pentru învățare.

---

## Unelte

| unealtă | ce face |
|:--|:--|
| `tools/quiz_io.py` | citește/scrie chestionarele în siguranță; cheia se schimbă doar cu motiv scris, care se loghează |
| `tools/practice_io.py` | inserează (`apply`) sau **înlocuiește** (`replace`) rezolvări model; refuză cele prea scurte sau cu HTML rupt |
| `tools/depth_io.py` | inserează caseta „Vrei mai mult?"; refuză orice legătură nedovedită |
| `tools/verifica_lectie.py` | poarta pentru o lecție: 5 secțiuni, chestionare care se parsează, cheie de progres unică, scripturi și legături vii |
| `tools/verifica_cifre.py` | cifrele afișate vs. discul; `--repara` |
| `tools/verifica_nume_continut.py` | numele fișierului vs. ce predă (semnalează, nu corectează) |
| `tools/repara_chei_progres.py` | prefixează cheia cu profilul, doar unde există ciocnire |
| `tools/lesson_digest.py` | 640 KB de HTML → 84 KB de substanță, pentru agenți |
| `tools/test_practice_replace.py` | control: `replace` chiar înlocuiește și nu strică restul paginii (8/8) |
| `tools/test_verifica_lectie.py` | control: poarta nu mai strigă degeaba, dar tot prinde defectul fabricat (5/5) |
| `tools/test_depth_replace.py` | control: după un refuz, caseta veche rămâne pe loc (12/12) |
| `tools/repara_titlu_dublat.py` | scoate titlul „Vrei mai mult?” repetat în casetă; `--aplica` |
| `tools/test_titlu_dublat.py` | control: taie doar titlul, nu textul din jurul lui (9/9) |
| `valuri/scan_t7.py` | câte lecții n-au casetă, grupate în loturi de modul |
| `valuri/extinde_t7.py` | caută copiile unui defect în toate profilurile-frate |
| `valuri/scan_ramase.py` | scanează discul: câte exerciții n-au rezolvare, în ce lecții, în ce module |
| `valuri/gen_t6b_loturi.py` | grupează lecțiile în loturi de modul, cu plafon de exerciții |

---

# Ce am învățat despre cost (măsurat 04–05.09.2026)

| ce am măsurat | cifra |
|:--|:--|
| opus, cost la mia de jetoane scrise | **$0,84** |
| sonnet, aceeași muncă | **$0,15** → de **5,8×** mai ieftin |
| ce umple contextul | Bash **44%** · Read **31%** · textul propriu 21% |
| legea amplificării | 1 jeton scris ⇒ **49,5** jetoane de context re-citite |

**Mutarea care a tăiat cel mai mult: un agent pe MODUL, nu pe lecție.** Campania veche
deschidea un agent pe fiecare din cele 507 lecții, deși doar 206 mai aveau ceva de făcut.
Fiecare își plătea o dată pornirea și descoperirea uneltelor, degeaba. Grupate pe modul, cu
plafon de 18 exerciții pe lot: **61 de loturi**. Aceeași muncă, ~8× mai puțini agenți.

Celelalte reguli, confirmate:
- modelul se declară la **fiecare** `agent()`. Mecanic (extras, formatat, bifat) → `'sonnet'`.
  Judecată (scrie curriculum, cântărește, decide) → `'opus'`. Poartă: `python tools\agent_cost.py gate`.
- verificarea **nu pe toate** — doar unde unealta a sărit peste ceva, plus un eșantion.
  Excepție: când repari defecte deja cunoscute, verifici 100%.
- prompturile cer explicit **comenzi Bash grupate** și **interzis cititul HTML-ului brut**
  (`lesson_digest.py`, 640 KB → 84 KB).

## Ce am învățat despre verificare (05.09.2026)

**Nu crede raportul agentului — verifică end-state-ul cu un oracol independent.** Agenții au
raportat 643 de rezolvări scrise; am rescanat discul cu unealta și abia atunci am știut.

**Dar oracolul poate greși în cealaltă direcție.** Primul meu control pe reparații a dat 3
FAIL, toate false: o corectare *bună* NUMEȘTE forma greșită ca să avertizeze împotriva ei
(„dacă scrii `=SUMIF(A2:A7,...)`, Excel afișează eroare"). Un test „markerul nu apare" nu poate
deosebi greșeala de avertismentul despre greșeală. Acum testul cere ca fiecare apariție să
stea lângă o negație, plus o aserțiune **pozitivă** că apare calea corectă.

**Aceeași greșeală o făcea și poarta**, pe 69 de lecții: raporta legături moarte pentru
`<code>&lt;a href="despre.html"&gt;</code>` dintr-o lecție care *predă* HTML, și „chestionar
mort" pentru atomii al căror container cădea dincolo de o fereastră fixă de 6000 de caractere.
O poartă care strigă degeaba e mai rea decât niciuna: defectul adevărat se pierde în zgomot.

**Regresiile se măsoară față de o bază, nu față de intuiție.** Am făcut worktree la commit-ul
de dinainte și am rulat aceeași poartă acolo: 185 picau înainte, 91 după munca de conținut,
**0 regresii**. Fără bază, cele 91 ar fi arătat ca un dezastru făcut de mine.

## Ce am învățat despre copii (05.09.2026)

**Lecțiile de pe profiluri diferite sunt copii. Un defect găsit într-un profil trebuie căutat
în toate.** Corectorii au semnalat 23 de casete greșite; căutând fiecare defect după o expresie
distinctivă, au ieșit 38 de casete candidate — afirmația falsă despre codecul YouTube stătea în
4 fișiere, nu în unul. Fără pasul ăsta, 15 copii ale acelorași greșeli rămâneau pe sit.

Același pas a scos la iveală un gol pe care nu-l semnalase nimeni: la slotul „Rețele de
calculatoare și Internet", clasa a IX-a, două profiluri din cinci predau cu totul altceva.

**Dar extinderea se verifică, nu se aplică orb.** Din cele 38 de casete, agenții au înlocuit 27:
la restul au constatat că fișierele nu erau chiar copii și au refuzat să scrie. Acesta e
răspunsul corect, nu o rateare — de aceea promptul le cere explicit să judece defectul înainte
de a-l repara, cu „inlocuite=0 + de ce" ca răspuns valid.
