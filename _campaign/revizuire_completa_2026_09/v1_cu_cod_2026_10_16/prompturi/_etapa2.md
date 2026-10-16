# Etapa 2 — autor PROASPĂT care termină pasul cu codul (VI/1, VII/1, VIII/1)

Ești un autor nou. Autorul de dinainte a făcut etapa 1 și s-a oprit (peste ~200.000 de jetoane de context — regula de consum). NU reiei de la zero: citești ce e pe disc și termini.

## Citește întâi, în ordinea asta
1. `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\v1_cu_cod_2026_10_16\prompturi\_comun.md` — tot ce li s-a cerut autorilor (și ce te trimite el să citești: contractul, `07_BRIEF_AUTOR.md`, `05_STANDARD_LECTIE.md` — din standard citești regulile 1-10, „Modul lecție” și „Ce au găsit judecătorii” 1-27; restul pe nevoie).
2. Contractul `…\v1_cu_cod_2026_10_16\contract.md`, ÎN SPECIAL „Decizii luate” de la final (locul pașilor, cei DOI pași, I3 corectat).
3. Nota de predare a lecției tale: `lectii\<clasa>\m1-l01\_proba\stare_autor.md` + secțiunea despre cod din `surse.md`.
4. API-ul casetei comune: `C:\00\Projects\LearningHub\lectii\_sim\intrare-cod.GATA.md` (proprietar: autorul V/1). NU modifici `intrare-cod.js`, unealta de capturi sau proba de texte; ce îți lipsește scrii în răspuns la `"cereri_api"`.

## Ce faci
1. **Forma comună (decizia dirijorului, la toate patru lecțiile):** DOI pași cu codul, imediat după „La ce folosește” (pe bară P2 și P3):
   - P2 — la școală, pe numele tău, cu codul tău: (a) prima dată (alegi codul, îl scrii în caiet, nu-l spui nimănui; cifrele se VĂD cât le scrii la „Cine ești?”, deci te uiți să nu stea nimeni lângă tine), (b) intrarea din „Cine lucrează acum?” cu codul, (c) plecarea: „Ieși (deconectare)” / „Nu ești tu? Schimbă elevul”.
   - P3 — în altă parte sau când ceva nu merge: (d) acasă / pe telefon, același nume, aceeași clasă, același cod, (e) „Mi-am uitat codul”, (f) ai lucrat până acum fără cod: „Păstrează-l online”.
   Dacă lecția ta are acum un singur pas cu codul (VI/1) sau îl are în alt loc (VIII/1 îl avea ca P8), îl muți și îl împarți. Textul bun deja scris îl păstrezi; nu rescrii ce merge. Trimiterile din restul lecției: pe NUMELE pasului, nu pe număr.
2. **Caseta de exersare în ambii pași:** câte un „Încearcă” de APLICARE pe caseta comună (`t:` tipul din GATA.md), cu scenariile pe care le-ai pregătit (`/* ASTEPT intrare-cod */`), potrivite la API-ul REAL din GATA.md (verifică fiecare opțiune; nu presupune). Exercițiile de recunoaștere provizorii fie dispar, fie trec la „Încă un exercițiu”. Fiecare „Încearcă” cu `gresit()` care respinge drumul greșit tipic.
3. **Pozele:** cu unealta comună (comanda exactă din GATA.md, `--clasa <a ta>`) în `img\` al lecției tale; rândurile în `img\SURSE.json`; fiecare poză privită (Read) și comparată cu textul de lângă ea. Nume inventate, nefolosite de probele vechi.
4. **Probele:** proba comună de texte (`lectii\_sim\_teste\intrare_cod_texte.py`, cu lecția ta înscrisă după cum spune GATA.md) → 0; izolarea casetei (R4: cheile `lh_*` înainte/după + cereri) → 0 și 0; gesturi reale până la diplomă la 390 px cu atingere + 1280 px → 0 erori; caseta ADEVĂRATĂ urmată literal pe pașii din „Acum la calculatorul din laborator” (refolosești probele etapei 1 din `_proba\`).
5. Porțile din `_comun.md` (test_joc, verifica_lectie, oracolele R6, date personale) → toate 0 / TRECUT. `afirmatii.json` și `surse.md` la zi (locurile pe numele pașilor).

## Reguli care rămân
Tot din `_comun.md`: nimic spre servicii externe (INTERZIS `proba_prezenta.py`, `teste-vasile`, Worker-ul `lh-api`, situl viu cu prezenta.js activ); serverul de probă LOCAL mută și `api` (nu doar `server`) pe 127.0.0.1 — folosește copia din `_proba\` a autorului de dinainte; `ctx.close()`; Chrome/Edge reali nu se pornesc; doar dosarul lecției tale; fără commit; căi absolute; `stare_autor.md` la zi.

## Răspunsul final
JSON-ul din `_comun.md`, cu `"astept":[]` dacă ai terminat tot.
