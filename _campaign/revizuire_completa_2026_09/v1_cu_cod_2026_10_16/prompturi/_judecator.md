# Partea comună a judecătorilor — lecțiile 1 refăcute pentru CODUL de intrare (16.10.2026)

Citește întâi și urmează întocmai `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\06_BRIEF_JUDECATOR.md`. Legea = `05_STANDARD_LECTIE.md` ÎNTREG (regulile 1-10, „Modul lecție”, „Ce au găsit judecătorii” 1-27) + contractul lucrării: `…\v1_cu_cod_2026_10_16\contract.md` (R1-R9, R-pur, I1-I6, deciziile lui Vasile). Ce au primit autorii: `…\v1_cu_cod_2026_10_16\prompturi\_comun.md` — citește-l, ca să știi ce li s-a cerut; nu te baza pe ce spun ei că au făcut.

## Ce judeci
Doar partea cu CODUL e nouă (decizia lui: „partea cu codul”): pasul nou, introducerea strânsă, „Acum la calculatorul din laborator”, caseta de exersare (`lectii\_sim\intrare-cod.js`), pozele noi. Restul lecției a trecut deja judecătorii: îl verifici doar unde atinge codul, plus oracolele R6 (trebuie să dea tot 0).

## „Aplicația adevărată” aici = caseta adevărată din `assets\js\prezenta.js`
- Arbitrul oricărei afirmații despre intrare, cod, listă, meniul etichetei, „Mi-am uitat codul”: caseta ADEVĂRATĂ, cu LearningHub servit LOCAL (127.0.0.1), Chromium din Playwright headless, 390 px cu atingere + 1280 px, cu TASTE REALE. Refolosești ce există: `_campaign\revizuire_completa_2026_09\pin_deconectare\probe\matrice_prezenta.py` + `probe\server\` (serverul FALS local, cu izolare; `PREDARE.md` §6), `lectii\_sim\_teste\rezultat_elev_proba.py` (`alege_din_lista()`), `jocuri\_motor\proba_inscriere_telefon.py`, `proba_corectura.py`.
- Urmezi LITERAL, ca un copil, pașii din pasul nou și din „Acum la calculatorul din laborator” pe caseta adevărată: ajungi unde promite lecția? Apoi drumurile greșite tipice: cod de 3 cifre, cod greșit de 5 ori, alt cod pe „alt aparat” (alt context de browser), numele scris altfel / altă clasă, apăsarea pe numele colegului, elevul deja înscris FĂRĂ cod, cel care și-a uitat codul.
- Fidelitatea casetei de exersare față de caseta adevărată: aceleași texte, aceleași butoane, aceeași ordine, aceleași respingeri. Nu acceptă ce caseta adevărată respinge și nu respinge ce acceptă. Izolarea (R4): cheile `lh_*` din localStorage înainte/după exersare + cererile → 0 și 0.
- Ce depinde de serverul adevărat (progresul pe alt aparat, cererea ajunsă la profesor, „biletul”) trebuie scris PRUDENT în lecție (I2). O promisiune pe care sistemul nu o garantează = GRAV dacă elevul se bazează pe ea și pierde munca.

## Regulile stricte
- **22** — nicio dată spre servicii externe. **INTERZIS:** `jocuri\_motor\proba_prezenta.py` (trimite la serverul VIU); orice cerere spre `teste-vasile.netlify.app`, spre Worker-ul `lh-api` (bugetul zilnic D1 depășit pe 15.10) sau spre `learninghub-8z6.pages.dev` cu `prezenta.js` activ.
- **24** — probele blochează tot ce nu e 127.0.0.1 și închid DOAR cu `ctx.close()`; după probe, `python C:/00/AI_0/tools/activitate.py lista` → niciun elev nou de probă.
- **25** — calculatorul profesorului rămâne cum era; Chrome/Edge REALI nu se pornesc; nicio oprire de procese după NUME.
- **27** — `python C:/00/AI_0/tools/learninghub_date_personale.py` → 0; numele din poze și exemple sunt inventate.

## Depozitul
Alte sesiuni lucrează în paralel. NU modifici lecția și nimic în afara `_verificare\` al lecției tale (sau dosarul care ți se spune). NU faci commit. Căi ABSOLUTE, fără `cd`; Python cu regex prin Write + rulare fișier.

## Ieșiri
`_verificare\judecator<N>.md` + `.json` (N îți e spus). Ultimele trei linii ale .md pline; ultima = DOAR numărul de GRAV. Fiecare problemă cu `citat` exact (≥12 caractere, verificat mecanic). Ieșirile lungi în fișiere din `_verificare\`, citești coada. Răspunsul final: JSON-ul din brief + `"R":{"R1":"DA|NU — <dovada>",…,"R9":…}`.
