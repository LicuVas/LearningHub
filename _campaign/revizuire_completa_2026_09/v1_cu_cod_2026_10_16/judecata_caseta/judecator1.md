# Judecător 1 — caseta de exersare „intrarea cu cod” (componenta comună)

Ce am judecat: `lectii\_sim\intrare-cod.js` (sha1 c8c6b4ae…, verificat), fața de caseta ADEVĂRATĂ `assets\js\prezenta.js` (sha1 8e852437…, verificat; motor.js bb1e2f75… la fel ca în GATA.md). N-am modificat nimic în afară de dosarul meu și n-am făcut commit. Nicio cerere n-a plecat spre servere reale: totul pe 127.0.0.1, un server fals cu stare (cerere în așteptare / deblocare), Chromium Playwright headless, taste reale, 1280 px cu mouse și 390 px cu atingere.

## Pe scurt
Caseta de exersare e foarte credincioasă: din 270 de mersuri aleatorii (până la 30 de pași) și 44 de drumuri numite, comparate stare cu stare la ambele lățimi, **nicio** diferență de text, butoane sau mesaje de eroare, în afara a trei (P2, P4, P5) și a limitelor declarate. Izolarea (R4) e curată. Am găsit **0 GRAV, 3 MAJOR, 5 MINOR**; cele 3 MAJOR se repară în câteva rânduri.

## Ce am încercat să resping (și n-am reușit)
- **Fidelitate, mersuri aleatorii:** 270 de mersuri din 11 stări de pornire (listă, „Salut”, etichetă, meniu, coleg rămas conectat, fără cod, „Ești tot X?”, nimeni conectat, calculator nou, nume scris greșit, un singur elev), cu server fals în două moduri (cererea rămâne în așteptare / profesorul deblochează pe loc). 268 identice; cele 2 neidentice sunt erori ale probei (`ERR_NETWORK_CHANGED` și un timeout), reluate 8/8 identice.
- **Drumurile unui copil de 10 ani, inclusiv cele greșite (44 de drumuri × 2 lățimi):** cod de 3 cifre; litere în cod; 1–5 coduri greșite cu mesajele exacte; pauza de 30 s (secundele rămase diferă cu cel mult 2, sfârșitul pauzei, pauza pe alt nume și după „← Înapoi la listă”); Enter în loc de buton; numele colegului (cu cod, fără cod revendicat, prin listă și prin formular); „Mi-am uitat codul” → „Trimite cererea” (cu și fără deblocare, din „Salut” și din formular); „Ieși (deconectare)” → „Bine” / „Intră”; „Nu ești tu? Schimbă elevul”; „Păstrează-l online”; a doua înscriere cu altă clasă / nume scris altfel / altă școală; erorile formularului; corectura; „Scoate-mă”; „Ești tot X?”; „Nu e nimeni conectat”; apăsări duble și rapide; rotirea telefonului. Toate la fel în ambele casete, cu excepțiile din P2, P4, P5 și cu limita declarată (§5.4, școala scrisă de mână).
- **Codul vizibil sau ascuns:** identic în fiecare pas. Puncte la „Salut, X!”, „Mi-am uitat codul” și corectură; cifrele se văd la „Cine ești?” și la „Păstrează progresul online”.
- **Izolarea (R4):** 39 de drumuri × (prezenta.js activă cu un elev ADEVĂRAT conectat / prezenta.js blocată) × 2 lățimi = 156 de rulări, cu un spion pe toate scrierile și citirile de stocare, cookie, cereri, evenimente, istoric, ferestre, cu eticheta apelantului. Rezultat: 0 apeluri venite din intrare-cod.js; stocarea ÎNTREAGĂ comparată (nu doar `lh_*`): nicio cheie schimbată de exersare; `window.Prezenta` neatins; elevul adevărat rămâne conectat; 0 cereri `/api` fără prezenta.js; 0 cereri spre afară. Spionul are control pozitiv: trei copii ale casetei cu câte o scriere în localStorage / un fetch / un apel la `Prezenta` sunt toate prinse.
- **Poarta exercițiilor:** `rezolva()` → Corect, `gresit()` → „Nu încă”, „Verifică” fără gest → „Nu încă” cu mesaj clar, două greșeli → „Arată-mi răspunsul” → caseta în starea bună și drumul spus: 84 de verificări (21 de variante, școli și clase diferite) la 1280 și 390, 0 abateri. 58 de drumuri cu gesturi (bune și greșite) la 1280 și 390: o singură abatere de la așteptare, P1.
- **Telefon (390 px):** în toate stările atinse niciun element de atins sub 32 px, nicio derulare laterală, rotirea nu strică starea. Focusul după „Nu încă” rămâne pe „Verifică”, iar mesajul stă într-o regiune `aria-live`.
- **Proba textelor, cu mutanți pe COPII ale prezenta.js (originalul neatins):** 12 mutanți. Proba proprietarului (`intrare_cod_texte.py`) prinde doar 3; diferențialul meu prinde 11 (al 12-lea face caseta adevărată să semene cu exersarea și confirmă P2). Detalii la P6.
- **Sumele de control din GATA.md** (sha1 prezenta.js, motor.js, cele 5 fișiere ale componentei) corespund cu discul. `intrare_cod_texte.py --lectie v/m1-l01`: 0 negăsite (cum raportase proprietarul).

## GRAV
Niciunul.

## MAJOR
**P1 — „Scoate-mă din lista calculatorului” rezolvă „Ieși”.** La exercițiile cu ținta „iesit” (implicită la start etichetă și meniu), copilul apasă „Scoate-mă din lista calculatorului” în loc de „Ieși (deconectare)” și „Verifică” dă „Corect”. Pe calculatorul adevărat „Scoate-mă” șterge numele din „Cine lucrează acum?”: a doua zi copilul nu se mai găsește în listă. Citat: `jurnal('scos',{k});iesi()`. Reparație: în `evalueaza()`, un `iesit` care vine după un `scos` nu se numără (mesaj: „Ai scos numele din lista calculatorului. Apasă «Ieși (deconectare)», nu «Scoate-mă…»”).

**P2 — Enter salvează codul la „Păstrează progresul online”, dar în caseta adevărată nu face nimic.** Citat: `placeholder="${TEXTE.exCod}" data-enter="ok">`. Copilul învață un gest care în laborator nu merge, iar ecranul rămâne neschimbat și codul nu se păstrează online (poate crede că e salvat). Nedeclarat în §5. Reparație: scoate `data-enter="ok"` din câmpul acela (celelalte câmpuri cu Enter sunt la fel în ambele casete) sau declară diferența.

**P3 — după o greșeală de scriere la înscriere, chiar și după corectura oficială, exercițiul spune fals „a doua înscriere”.** Un copil care scrie «Stanciu Irina» în loc de «Stanciu Iarina» primește corect „a doua înscriere”. Dacă își repară numele pe calea din casetă (etichetă → „Mi-am scris greșit…” → cod → nume corect → „Salvează”), exercițiul tot zice „Profesorul ar vedea doi elevi în loc de unul” — fals pe calculatorul adevărat, unde corectura îi unește. Evenimentul rămâne pentru totdeauna în jurnal; ieșirea e doar „Arată-mi răspunsul”. Citat: `const inscrieri=E.filter(x=>x.e==='inscris'&&!eTu(x.k)&&!kColegi.has(x.k));`. Reparație: ignoră înscrierile pe care o corectură le-a mutat (`&&!E.some(y=>y.e==='corectat'&&y.din===x.k)`).

## MINOR
- **P4** — numele rămâne așa cum l-a scris copilul în formular (caseta adevărată: «Iarina Stanciu» → eticheta „Stanciu I.”; exersarea arată „Iarina S.”). Citat: `conecteaza(x||nou,cod);S.iesit=false;…`.
- **P5** — ordinea listei după „Ieși” → „Intră”: adevărata pune elevul care a lucrat primul, exersarea pune colegul primul (la start etichetă și meniu). Nedeclarat în §5. Citat: `if(COLEGI.length){inLista(COLEGI[0],COLEGI[0].cod);inLista(eu0,elevCod);…`.
- **P6** — proba textelor caută fragmentele oriunde în prezenta.js (și în comentarii, la orice apariție) și nu vede reguli, ordine, cifre ascunse. Citat: `if frag in crud or frag in fara:`. Recomandare: pune diferențialul (`scenarii.py` + `mutanti.py`) lângă `intrare_cod_proba.py` ca poartă.
- **P7** — la 390 px, pe starea „fara-cod”, mesajul „Nu încă” se termină la y=886 din 844 (sub marginea ecranului); în celelalte stări se vede. Pe așezarea din motor, nu pe intrare-cod.js. Citat: `<div id="fb" aria-live="polite"></div>`.
- **P8** — „Verifică” în primele 350 ms după „Intră” dă „Încă nu ești conectat”; a doua apăsare iese Corect. Inofensiv. Citat: `dupa(350,()=>{`.

## Limitele declarate în GATA.md §5, verificate
§5.4 (școala scrisă de mână nu e recunoscută) apare exact așa; §5.7 („Jurnalul meu” nu se deschide) la fel. Nicio limită declarată nu m-a păcălit: nicio „limită” care să învețe ceva fals în afară de P2, P4 și P5, care NU sunt declarate.

## Scripturile mele (toate în dosarul judecata_caseta)
`dif.py` (mersuri aleatorii), `scenarii.py` (drumurile numite, 1280/390), `poarta.py` (rezolva/gresit/drumuri greșite), `izolare.py` (R4, cu spion), `mutanti.py` (copii mutate), `extra.py`, `ordine.py`, `poze.py`, `hg.py` (server fals + observare), `iesiri\` (rezultatele).

## Verdict
**publicabil după reparații** — repară P1, P2, P3 (3 rânduri fiecare) și rulează din nou `scenarii.py` + `poarta.py` (ultima linie 0 = fără abateri față de caseta adevărată).

GRAV: 0, MAJOR: 3, MINOR: 5, verdict: publicabil după reparații
0
