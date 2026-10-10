# Inginerul „Cum fac…?” — raport (10.10.2026)

Contract: `contract.md` (răspund de R1, R4–R7, I1, I3, I4, I7, I8, I9). Specificația: `SPEC.md`.
Nu am făcut commit și nu am publicat. N-am atins `jocuri/_motor/motor.js`, `assets/js/prezenta.js`, lecțiile,
`hub/by-goal/` sau fișele autorilor.

## Ce am construit (toate sub `cum-fac/`, în afară de legături)

| Fișier | Ce face |
|---|---|
| `cautare.js` | Motorul de căutare, fără biblioteci, UMD (`window.CautareCumFac` în pagină, `require` / `import` în node). API-ul din SPEC: `creeaza(fise, sensuri)` → `index.cauta(text, {aplicatie, max})` → `{gasit, aplicatieDedusa, rezultate:[{id, scor, acoperire, de_ce}], propuneri}`. În plus: `index.explica(text)` (cum a înțeles întrebarea, pentru depanare). |
| `_sursa/sensuri.json` | Dicționarul de sensuri, versiunea 1: 141 de grupuri (1.850 de cuvinte și expresii), cele 5 aplicații (numele lor + cuvintele care le arată), 229 de cuvinte de umplutură, lista cuvintelor care NU sunt umplutură („mai multe”, „toate”, „nou”, „alt”…) și `reglaj` (pragul și ponderile). Formatul e explicat în câmpul `despre`. |
| `_build/build.mjs` | Construiește `date.js`, `_teste/catalog_titluri.json` și `amprente.json`; `--verifica` nu scrie nimic. |
| `index.html` | Pagina. Totul local: `date.js` + `cautare.js` + CSS în pagină (aceleași culori ca `/lectii/`, fonturile sistemului). Fără Google Fonts, fără CDN, fără `prezenta.js` / `site-credit.js` (creditul gurlan.ro e scris direct în subsol). |
| `_teste/evalueaza.mjs` | Rulează motorul în node pe un set de întrebări. |
| `_teste/proba_browser.py` | Proba Playwright a paginii. |
| `_teste/set_inginer.json` | Setul meu pe cele 2 fișe din exemplu: 38 de întrebări + 12 din afara materiei. |
| `_teste/set_inginer_real.json` | Setul meu de DEZVOLTARE pe fișele autorilor de azi: 81 + 20 din afara materiei (scris fără să mă uit la formulările din fișe; NU e setul ascuns). |
| `_teste/set_r5.json` | Cele 4 exemple ale profesorului, cu și fără diacritice (8). Fișele acceptate le-am ales eu din catalog; dirijorul le poate schimba. |
| `_teste/_exemplu/` | Copia exemplului (`fise_exemplu.json`) + amprentele lui, pentru probe. |

Legăturile spre secțiune (R1):
- `hub/index.html`: bloc nou `<!-- CUM-FAC … -->` imediat DUPĂ `<!-- LECTII:END -->` (în afara blocului regenerat),
  15 rânduri, terminațiile CRLF păstrate (editat pe octeți).
- `lectii/index.html`: șablonul din `lectii/_build/build_lectii.py` (`html_index`), 5 rânduri; refolosește clasa
  `.joc-link`, ca CSS-ul comun (și paginile claselor) să nu se schimbe. Regenerarea: vezi mai jos.
- `.gitignore`: `cum-fac/_teste/capturi/` (capturile probei se refac la fiecare rulare).

## Cum se rulează

```
node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs                       # _sursa/fise_*.json -> date.js
node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs --fise C:/00/Projects/LearningHub/cum-fac/_teste/_exemplu
node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs --verifica            # nu scrie nimic; ultima linie = probleme
node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs --extrage --verifica  # întâi re-extrage lecțiile (scrie doar în digest/)
node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs --accepta <id>|toate  # după ce cineva a re-verificat fișa
node C:/00/Projects/LearningHub/cum-fac/_teste/evalueaza.mjs <set.json> [--detalii] [--praguri] [--fise <folder>] [--umple 300]
python C:/00/Projects/LearningHub/cum-fac/_teste/proba_browser.py
```

- `build.mjs`: citește `fise_*.json` din `_sursa/` (sau din `--fise <folder>`), le trece prin `valideaza` (din
  `valideaza_fise.mjs`), scrie în `date.js` DOAR fișele valide (o „înrudită” spre o fișă scoasă se taie). Amprenta =
  sha1 al textului pasului-sursă, exact textul în care verificatorul caută ancora (titlu + text + Uite cum + Altfel +
  indicii; la `real`, pașii din aplicația adevărată). Amprentele stau lângă fișe (`_sursa/amprente.json`; pentru
  exemplu, `_teste/_exemplu/amprente.json`). **O amprentă schimbată NU se suprascrie la build**: fișa rămâne semnalată
  până o re-verifică cineva și rulează `--accepta <id>` (altfel orice build ar șterge semnalul). Fișă nouă sau sursă
  mutată → amprentă nouă. Ultima linie = fișe invalide + fișiere stricate + pași-sursă schimbați (+ fișe fără
  amprentă, la `--verifica`). `date.js` „la zi / nu e la zi” se tipărește doar informativ.
- `evalueaza.mjs`: implicit folosește exact ce publică pagina (`date.js` + `cautare.js`); `--fise` construiește
  indexul direct din fișe (fără să scrie nimic). Tipărește locul 1 %, primele 3 %, „din afara materiei” corecte,
  timpul mediu și maxim, pe tipuri, ratările; `--detalii` arată jetoanele și de unde vine scorul; `--praguri` arată
  acoperirea celor mai slabe reușite și a celor mai puternice întrebări din afara materiei (pentru reglajul pragului).
  Ultima linie = întrebări ratate.
- `proba_browser.py`: server local pe portul 0 (`allow_reuse_address=False`), Chromium fără ecran, User-Agent
  `LearningHub-lectii/1.0 (educational site)`, `ctx.route("**/*")` care abandonează tot ce nu e 127.0.0.1/localhost
  și numără. Măsoară: cereri externe (0), timpul tastare → rezultate (căutare + desenare, în pagină), primul rezultat
  întreg deasupra marginii de jos la 1366×768 și 390×844 (capturi în `_teste/capturi/`), aplicația + titlul +
  scurtătura `<kbd>` + primii 2 pași în listă, săgeți + Enter, fișa deschisă în aceeași pagină (fără reîncărcare),
  legătura „Exersezi…” (`?vezi=pN`, răspunde 200; textul „lecția N (clasa …): pasul Px «…»”; la sursa `real`, `?vezi=real`), „Înapoi” al browserului și butonul „Înapoi la căutare” (păstrează căutarea),
  captura care se încarcă, „n-am găsit” + 3 propuneri + răsfoirea, filtrul de aplicație în adresă, tema întunecată /
  luminoasă (și butonul), zonele de atins ≥ 32 px pe telefon, fără derulare orizontală, escaparea (vezi mai jos),
  viteza la 300 de fișe, erori JS = 0. Ultima linie = probleme.

## Ce a ieșit (ultimele linii, rulate la final, în ordinea asta)

| Probă | Ultima linie | Detaliu |
|---|---|---|
| `build.mjs --fise …/_teste/_exemplu` | **0** | 2 fișe valide, `date.js` scris |
| `evalueaza.mjs _teste/set_inginer.json` (pe `date.js` din exemplu) | **0** | locul 1: 38/38; primele 3: 38/38; din afara materiei: 12/12; timp mediu 1,2 ms, maxim 10,8 ms |
| `build.mjs --fise …/_exemplu --verifica` | **0** | |
| … cu o amprentă stricată intenționat | **1** | „PAS-SURSĂ SCHIMBAT: excel-salvare-prima-data …”; pusă la loc → **0** |
| … control în plus: fișă cu ancora greșită (folder de probă în afara `_sursa`) | **3** | 1 fișă invalidă + 2 fără amprentă |
| `build.mjs` (pe `_sursa`, 281 de fișe: excel 92, word 78, powerpoint 70, windows 22, web 19) | **0** | `date.js` 476 KB (110 KB comprimat) |
| `proba_browser.py` (pe cele 281 de fișe + glosarul real de 125 de termeni) | **0** | 22 de verificări trecute; tastare → rezultate maxim 4–12 ms; la 300 de fișe maxim 6–8 ms; indexul 225–490 ms (după cât de ocupat era calculatorul); 0 cereri externe; 0 erori JS. Pe exemplu (2 fișe) tot 0. |
| `evalueaza.mjs _teste/set_r5.json` (R5) | **0** | 8/8 pe locul 1 |
| `evalueaza.mjs _teste/set_inginer_real.json` (dezvoltare, 281 de fișe) | **1** | locul 1: 77/81 = 95,1%; primele 3: 81/81 = 100%; din afara materiei: 19/20 (ratarea: „cum desenez un cal”, unde „desen” și „cal” apar chiar în formulările unei fișe Word) |

`date.js` rămâne acum construit din `_sursa/` (281 de fișe). La final, după ce termină toți autorii, dirijorul
rulează din nou `build.mjs`.

## Cum înțelege motorul întrebarea (pe scurt)
1. Normalizare: litere mici, fără diacritice (și ş/ţ cu sedilă), semnele → spații; `Ctrl+S` / `[Ctrl]+[S]` /
   „ctrl s” → un singur cuvânt `ctrls`. Etichetele de formatare (`<b> <kbd> <code> <i>`) ies, dar `<title>`, `<head>`
   scrise în fișele de HTML rămân cuvinte; `&lt;` `&gt;` devin semne.
2. Expresiile din dicționar („mai multe celule”, „save as”, „la mijloc”) se recunosc întregi, pe rădăcini, înainte
   să iasă umplutura. Numele aplicației („excelu”, „wordul”, „ppt”) arată aplicația și iese din cuvintele căutate.
3. Rădăcina românească (salvez/salvare/salvat → `salv`); o vocală singură se taie doar la cuvintele de 6+ litere,
   ca să nu se lipească „cale” de „cal” sau „tabla” de „table”.
4. Sensurile: un grup poate fi legat de o aplicație („pagina” = foaie în Excel, diapozitiv în PowerPoint…).
5. Greșeli: Damerau-Levenshtein 1 (4–6 litere) / 2 (7+, cu aceeași primă literă), doar spre cuvintele din câmpurile
   care spun ce gest e fișa (titlu, întrebare, formulări, cuvinte, termeni) și din dicționar — nu spre orice cuvânt
   din pași (așa „clatite” se făcea „citite”). Ultimul cuvânt, netastat până la capăt, se potrivește și ca început.
6. Scorul: cât din întrebare explică fiecare câmp (ponderi din `reglaj`), cântărit cu rareța cuvântului, plus cea mai
   apropiată frază a fișei; fișele aplicației numite trec în față (celelalte × 0,55).
7. „Am găsit” se judecă DOAR pe câmpurile tari (titlu, întrebare, formulări, cuvinte, scurtătură, termeni): primul
   rezultat trebuie să explice ≥ 65% din întrebare. Dacă aplicația e numită și primul rezultat e din altă aplicație,
   tot „n-am găsit”. Atunci vin 3 propuneri (întâi din aplicația cerută) și răsfoirea.

Legătura spre lecție (cerința dirijorului): `../lectii/<clasa>/<lectie>/?vezi=pN` (la sursa `real`: `?vezi=real`), NU
`?pas=` (acela e al jurnalului elevului). Azi motorul ignoră `?vezi=` și deschide cuprinsul lecției, deci textul doar
numește pasul: „Exersezi în lecția 3 (clasa a VIII-a): pasul P2 «Registru nou și prima salvare»”; la `real`: „…: pasul din
aplicația adevărată «…»”.

Pagina: căsuța sus, butoanele de aplicație, rezultatele la fiecare tastă; adresa ține `?q=…&app=…#id`
(`replaceState` cât scrii, intrare nouă în istoric când deschizi o fișă), deci „Înapoi” păstrează căutarea și o fișă
se poate trimite ca legătură. Textul simplu (`titlu_pas`, `captura.alt/legenda`, `termeni`) se escapează; HTML-ul fișelor
(`pasi`, `rezultat`, `atentie`, `titlu`, `intrebare`) trece doar cu `<b> <kbd> <code> <i>`, iar `&lt;&gt;` apare ca `<>`
(nota dirijorului; proba verifică pe o fișă-capcană injectată doar în probă și pe două fișe reale:
`excel-conditie-comparatie-true-false`, `web-titlu-fila`).

## Ce rămâne deschis
- **R4/R6 pe setul ascuns nu sunt măsurate de mine** (așa trebuie). Pragul 0,65 l-am pus după setul meu de dezvoltare:
  reușitele cele mai slabe au acoperirea 0,87, întrebările din afara materiei cele mai puternice 0,60 (în afară de
  „cal”). Setul meu e scris de mine, deci poate semăna cu felul meu de a întreba; reglajul final se face pe setul de
  dezvoltare din valul 2, schimbând doar `reglaj` din `sensuri.json` (fără cod). Riscul cunoscut: o întrebare din afara
  materiei ale cărei cuvinte apar toate în formulările unei fișe („desenez un cal”) iese „găsită”.
- **I4, fără internet**: căutarea merge fără rețea cât pagina e deschisă (nicio cerere). O REÎNCĂRCARE fără internet
  ar cere un service worker; situl nu are, nu l-am adăugat.
- Indexul se construiește într-o singură trecere la încărcare: 225–490 ms pe calculatorul acesta; pe un calculator de
  laborator vechi sau pe telefon poate fi 0,5–1 s, timp în care pagina nu răspunde. Dacă deranjează: indexul se poate
  pre-calcula în `build.mjs`.
- `build.mjs` repetă funcția `textPas` din `valideaza_fise.mjs` (nu e exportată, iar fișierul nu e al meu). Dacă
  verificatorul își schimbă textul pasului, trebuie schimbat și aici (sau exportat de acolo).
- Contractul `selfcheck.py` nu l-am adăugat (e treaba dirijorului). Propunere: comanda
  `node C:/00/Projects/LearningHub/cum-fac/_build/build.mjs --extrage --verifica`, ultima linie 0 (scrie doar în
  `digest/`). Fără `--extrage`, compară cu digestul existent.
- R1 pe situl live: nepublicat (dirijorul publică; marcajul paginii: `data-marcaj="cum-fac-2026-10"` pe titlu).
- Fișele de test din `set_r5.json`: fișele acceptate le-am ales eu din catalog („cum salvez un fișier Excel” acceptă
  prima salvare și Ctrl+S; „cum închid un document Word” acceptă închiderea documentului și a Word-ului).

## Glosarul (`_sursa/termeni.json`, cerința dirijorului din judecata fișelor)
- `build.mjs` citește `_sursa/termeni.json` (sau `--termeni <fișier>`); dacă lipsește, tipărește „lipsește încă;
  merg mai departe fără el” și construiește. Intrare stricată (fără `t`/`d`, `aplicatii` necunoscută) = problemă
  numărată; intrările bune intră oricum în `date.js` (câmpul `termeni`).
- Potrivirea e o singură funcție, în `cautare.js` (`termeniFisa`), folosită și de pagină, și de build: cuvânt întreg,
  fără diacritice, pe `t` + `forme`, doar termenii aplicației fișei sau cu `aplicatii` gol; întâi `fisa.termeni`, apoi
  glosarul în ordinea apariției în pași + rezultat; dublură = orice formă a termenului din glosar e deja un termen al fișei
  (rămâne definiția fișei).
- Pagina: titlul secțiunii e acum „Cuvinte de știut”; prima apariție a fiecărui termen în pași (în afara `<code>`/`<kbd>`)
  e subliniată punctat; atingere / Enter arată definiția lângă cuvânt, a doua atingere o ascunde; pe calculator e și
  `title` la hover.
- Raportul din build (informativ, nu intră în număr): câte fișe primesc termeni din glosar și câte au în pași termeni
  ai glosarului care țin de ALTĂ aplicație, deci nu sunt explicați nici de fișă, nici de glosarul aplicației ei (cu
  lista fișelor). Încercat cu un glosar de probă de 4 termeni: „folder” lăsat doar pe Windows apărea neexplicat în 13 fișe
  de salvare din Excel/PowerPoint/Word — exact semnalul că acolo termenul trebuie lăsat fără aplicație.
- Cu glosarul real (`termeni.json`, 125 de termeni, apărut în timpul lucrului): 217 fișe primesc termeni din glosar;
  141 de fișe au în pași termeni pe care glosarul îi leagă de ALTĂ aplicație (de ex. „rând”, „coloană”, „tabel” în fișe
  Excel; „fereastră”, „folder” în fișele de salvare). Lista completă: `node …/build.mjs --verifica` (rândul „glosar:”).
  De hotărât de autorul glosarului: lărgește `aplicatii` sau lasă-l gol la termenii comuni.
- **Ambiguitate în glosar, de reparat acolo (nu în motor):** „filă” are forma `file`, care e și cuvântul englezesc din
  interfață („File name”, „Fișier (File)”). Pe fișa `excel-salvare-prima-data`, „File” din „File name” e subliniat ca
  „filă”, iar la „Cuvinte de știut” apare definiția filei din panglică. Propunere: scoate `file` din formele lui „filă”
  (pluralul „file” se pierde, dar e rar în pași; „filele” rămâne).
- Proba de browser verifică pe un glosar injectat doar în probă: termenul aplicației apare, al altei aplicații nu,
  dublura nu se repetă și nu-și pune definiția peste a fișei, sublinierea + definiția la atingere merg.

## Regenerarea `lectii/index.html`
`python C:/00/Projects/LearningHub/lectii/_build/build_lectii.py` (cu poarta `test_joc.py` pe toate cele 42 de lecții
publicate): „pagini: 5 (scrise 1, la zi 4) · intrarea din hub: la zi … neconcordanțe: 0”. `git diff --stat`:
`lectii/index.html | 5 +` (doar legătura), paginile claselor neschimbate (comparate octet cu octet cu copia de dinainte),
blocul LECTII din hub neschimbat, blocul meu din hub păstrat. Deci nicio muncă a altcuiva n-a fost atinsă.
Pe hub, clicul automat pe legătură e acoperit de fereastra hub-ului „Continuă fără profil” (a hub-ului, nu a mea); legătura
`../cum-fac/index.html` e verificată în pagină.
