# Runda 1 · CONTRA (pasul 4)

Planul: biblioteca `aplicatii/` cu un motor comun care DESENEAZĂ interfața din referința UI Automation (date generate,
nicio etichetă scrisă de mână), plus un model de document Word scris după scenariile reale (`scenarii_real/word-*.json`);
comenzile fără scenariu real dau mesajul central standard; profilul `word2007` schimbă doar gruparea anulării.

## Cel mai puternic argument PENTRU
Fidelitatea vine din date, nu din memoria mea: 45 de suprafețe și ~2300 de noduri Word (nume, tip, idMso, ordine, poziție
în grup) sunt copiate mecanic din aplicația reală, de un generator care se poate rula din nou (`genereaza_word.py
--verifica` = 0 dacă `date/word.json` e exact ce dă referința). Același motor (`panglica.js`) va desena Excel și
PowerPoint din `uia_excel.json` / `uia_powerpoint.json` fără cod nou de interfață — ceea ce cere R1-R3 („un singur
loc”, „controlat central”). Comportamentul e măsurat de O4 contra rezultatelor reale, nu judecat de mine.

## Cel mai puternic argument ÎMPOTRIVĂ
În etapa B, O3 (interfața) NU vede biblioteca: măsoară doar lecțiile din `inventar.json`, care încă folosesc
simulatoarele vechi. Deci cea mai mare parte a muncii (interfața generată) nu e confirmată de niciun oracol oficial în
runda asta; singura măsură e diagnosticul meu `masoara_poligon.py` — care folosește codul înghețat al lui O3, dar l-am
pornit eu, pe poligon, nu pe lecții. Și: O7 („textul lecțiilor”) trece pe verificarea bibliotecii de îndată ce există
`aplicatii/*.js`, iar cu nicio lecție mutată poate CREȘTE (motivul `lipsa_in_biblioteca`), deși biblioteca n-a stricat
nimic — un regres aparent pe care regula pasului 7 l-ar trata ca regres adevărat.

## Adevărul incomod (punctul cel mai puțin sigur)
Geometria. Pozițiile sunt exact cele din fereastra reală de 1366 px; ce nu încape se derulează lateral. Nu știu încă cât
de lat va fi containerul unei lecții (etapa C) și dacă elevul de clasa a V-a va găsi „Close” sau zoom-ul când banda e
derulată. Am ales exactitatea față de referință (cerută de R4 și O3) în locul unei reașezări „inteligente” pe care nu o
pot dovedi. Al doilea punct nesigur: comenzile afișate dar nesimulate (mesajul central) sunt multe — Strikethrough, Find,
Format Painter, scurtăturile Ctrl+D/P/O/S… — pentru că nu au încă un scenariu real. E corect după R12 și regula
„[NEVERIFICAT] nu se implementează”, dar un elev le poate întâlni ca „nefuncționale”.

## Hotărârea (după cele de mai sus)
Merg pe plan, cu trei măsuri: (1) `masoara_poligon.py` intră în bibliotecă (`aplicatii/_unelte/`), ca orice rundă să
poată măsura interfața înainte de etapa C, cu codul înghețat al lui O3; (2) dacă O7 crește la pasul 7 doar prin
`lipsa_in_biblioteca`, NU dau înapoi biblioteca (ar însemna să nu existe niciodată), ci scriu cauza în `regres.md`
și o las orchestratorului — schimbarea oracolului nu e voie într-o rundă de reparație; (3) tot ce e „[NEVERIFICAT]”
intră în `de_verificat.md` cu scenariul care l-ar lămuri.
