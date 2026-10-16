# Partea comună — autorii lecțiilor 1 (V, VI, VII, VIII) refăcute pentru CODUL de intrare (16.10.2026)

## Citește întâi, întreg, în ordinea asta
1. `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\v1_cu_cod_2026_10_16\contract.md` — LEGEA lucrării: R1-R9, R-pur, I1-I6, deciziile lui Vasile de la final.
2. `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\07_BRIEF_AUTOR.md`, cu tot ce trimite el să citești (`05_STANDARD_LECTIE.md` ÎNTREG; `jocuri\README.md` §-urile numite).
3. `…\noapte_10_10\prompturi\_comun.md` și `…\luni_12_10\prompturi\_zi.md`: regulile lor rămân TOATE în vigoare (regula 10 — gesturi reale mici și dese; bara pașilor nu se descrie; Chrome/Edge REALI nu se pornesc; nicio oprire de procese după nume).
4. Lecția ta, întreagă: `index.html`, `surse.md` (inclusiv tabelul judecătorilor J01-J02 despre casetele „cine lucrează”), `afirmatii.json`, `_verificare\judecator*.md`.

## Ce se schimbă (decizia lui: „partea cu codul”)
- De la 30.09.2026, `assets\js\prezenta.js` cere codul de 4 cifre la FIECARE intrare pe numele unui elev. Lecțiile 1 au fost scrise înainte: V/1 îl pomenește într-un rând, VI/1 și VII/1 deloc, VIII/1 o dată.
- Intrarea pe numele tău, cu codul, devine un PAS întreg al lecției: „Uite cum” (cu poza casetelor ADEVĂRATE) + „Încearcă” de APLICARE, făcut într-o casetă de exersare din pagină (componenta comună de mai jos), nu doar recunoaștere.
- Restul lecției (unitățile anului, nivelurile, lucrarea, nota 80/20, atelierul de notare, întrebările) RĂMÂNE. Îl atingi doar unde contrazice codul sau trimite la el. Introducerea de acum („Întâi, spune cine ești…”, cele 4 casete) se strânge într-o trimitere scurtă la pasul nou: nu se predă de două ori (I4: lecția încape în 50 de minute).
- Cele 6 situații din contract (R1 a-f) sunt obligatorii, cu numele reale ale butoanelor, și cu ce face elevul care ESTE deja înscris: fără cod („Progresul tău stă doar pe calculatorul ăsta.” → „Păstrează-l online”), cu cod, cu cod uitat („Mi-am uitat codul”). Plus greșelile reale de prevenit: codul schimbat în timpul orei, numele scris altfel sau altă clasă aleasă (iese a doua înscriere), intrarea pe numele colegului.
- „Acum la calculatorul din laborator” (R5; decizia lui: COD ADEVĂRAT): elevul intră pe numele lui, cu codul lui adevărat; iese cu „Ieși (deconectare)”; intră din nou din „Cine lucrează acum?” cu codul; își scrie codul în caiet; lasă calculatorul pentru următorul. Gesturi mici, reale, unul câte unul (regula 10). Fără profesor (Tupilați: oră simultană).

## Faptele: de unde și cum le probezi
- Sursa faptelor = codul de azi: `C:\00\Projects\LearningHub\assets\js\prezenta.js` (doar CITIT). Locuri: capul fișierului §6 (r. 22-27); meniul etichetei (~r. 690-705: „Ieși (deconectare)”, „Jurnalul meu”, „Păstrează-l online”, „Nu ești tu? Schimbă elevul”, „Mi-am scris greșit numele, clasa sau școala”, „Scoate-mă din lista calculatorului”); corectura (~r. 720-800); lista (~r. 840-850); „CODUL LA INTRARE” (~r. 851+); „Salut, X!” + Intră / „← Înapoi la listă” / „Mi-am uitat codul” (~r. 950-960); cererea pentru profesor (~r. 985-1013); „Păstrează progresul online” (~r. 1035-1041). Partea profesorului (deblocarea, ce primește elevul după): `C:\00\AI_0\projects\teste-elevi\site\public\activitate.html` + `C:\00\AI_0\projects\teste-elevi\README.md` (căutare „cod”) — DOAR citit.
- Orice afirmație din lecție despre casetă se PROBEAZĂ pe caseta adevărată: LearningHub servit de un server LOCAL (127.0.0.1), Chromium din Playwright, headless, 390 px cu atingere și 1280 px. Gata făcute, de refolosit (citește-le întâi): `_campaign\revizuire_completa_2026_09\pin_deconectare\probe\matrice_prezenta.py` + `probe\server\` (serverul FALS local, cu izolare) + `PREDARE.md` §6 (cum se rulează); `lectii\_sim\_teste\rezultat_elev_proba.py` (`alege_din_lista()` scrie codul); `jocuri\_motor\proba_inscriere_telefon.py`, `proba_corectura.py`; `lectii\v\m1-l01\_proba\doi_elevi.py` (casetele vechi, doi elevi pe același calculator).
- **INTERZIS:** `jocuri\_motor\proba_prezenta.py` (trimite la serverul VIU). Orice cerere spre `teste-vasile.netlify.app`, spre Worker-ul `lh-api` (Cloudflare; bugetul zilnic D1 a fost depășit pe 15.10) sau spre `learninghub-8z6.pages.dev` cu `prezenta.js` activ. În probe: `route('**/*')` care lasă DOAR 127.0.0.1 și răspunde fals (sau oprește) tot restul; închidere DOAR cu `ctx.close()`. La final `python C:\00\AI_0\tools\activitate.py lista` nu trebuie să arate niciun elev nou de probă (R9).
- Ce depinde de serverul adevărat (progresul adus pe alt aparat, cererea „Mi-am uitat codul” ajunsă la profesor, „biletul” muncii de dinainte de cod) se probează doar cu serverul FALS local sau citind codul. Se scrie PRUDENT și intră în `nesigur` (I2). Nu promite ce nu e garantat.
- Numele din poze și din exemple: INVENTATE și nefolosite de probele vechi (nu „Ana Pop”, „Dan Ene”, „Rusu Ilie” — sunt elevi de probă rămași în panou). La final: `python C:\00\AI_0\tools\learninghub_date_personale.py` → ultima linie 0 (R9).

## Componentele comune ale lucrării (UN proprietar: autorul V/1)
1. **Caseta de exersare** `lectii\_sim\intrare-cod.js` (extensie NOUĂ; tipul de „Încearcă” al motorului, ca `excelx`, `cont-sigur`): imită caseta adevărată (aceleași texte, aceeași ordine, aceleași butoane), DAR e izolată: nu cheamă `window.Prezenta`, nu citește/scrie cheile `lh_*` ale înscrierii (`lh_elevi_pc`, `lh_coduri`, sertarele `e_…`), nu trimite nicio cerere (R4). API-ul în capul fișierului. Scenariile se dau din configurația lecției (numele inventat, codul din „caiet”, starea de pornire: calculator nou / listă / „Salut, X!” / meniul etichetei / cod uitat / fără cod), cu `gresit()` declarat (poarta verifică și respingerea).
2. **Unealta de capturi** `lectii\v\m1-l01\_proba\captura_casete_cod.py --clasa V|VI|VII|VIII --iesire <dosarul img al lecției>`: pozele casetelor ADEVĂRATE de azi (prezenta.js servit local, nume inventate, clasa cerută), webp sub ~150 KB, + rândul pentru `img\SURSE.json` („captură din LearningHub, prezenta.js sha1 …”). R3.
3. **Proba textelor** `lectii\_sim\_teste\intrare_cod_texte.py`: fiecare text afișat de `intrare-cod.js` și fiecare nume de buton/mesaj dintre „…” din pasul cu codul al celor 4 lecții există literă cu literă în `prezenta.js` / `motor.js` de azi; ultima linie = numărul de nume negăsite (R2); cu un mutant (un text schimbat într-o copie → prins).
- Ceilalți trei autori NU scriu altă casetă, altă unealtă de capturi sau altă probă de texte. Dacă le lipsește ceva în API, scriu exact ce în `surse.md` și în răspuns (`"cereri_api"`); dirijorul duce cererea la proprietar.
- NIMENI nu modifică `prezenta.js`, `motor.js`, `rezultat-elev.js` (I1). O nepotrivire găsită acolo (ex. un text confuz pentru copil) se scrie în `surse.md` la „Pentru componenta comună” și în răspuns.

## Porțile tale (pe lângă cele din brief)
- `test_joc.py` → TRECUT; `verifica_lectie.py <index.html> --fara-t1` → ultima linie 0.
- R6, neschimbate: `python C:/00/Projects/LearningHub/_campaign/notare_punctaj_2026_09_29/verifica_regula.py`, `python C:/00/Projects/LearningHub/_campaign/isj_aliniere_2026_10_01/oracol_m1l01.py`, `python C:/00/Projects/LearningHub/_campaign/nota_site_2026_10_07/oracol_nota_site.py` → 0 („probleme în total: 0”).
- R2: `intrare_cod_texte.py` → 0 (când există). R4: proba izolării (cheile `lh_*` din localStorage citite înainte/după exersare + numărul de cereri) → 0 și 0.
- Gesturi reale până la diplomă, 390 px cu atingere + 1280 px → 0 erori; privești captura de telefon a pasului nou.

## Depozitul și calculatorul
- Atingi DOAR dosarul lecției tale (+ la V/1: cele 3 componente de mai sus). NU atingi `jocuri\_motor\`, `assets\js\`, `jurnal\`, `cum-fac\`, `hub\`, `lectii\plan.json`, alte lecții, simulatoarele altora. Modificările locale străine din depozit (`curriculum\school_year_2026_2027.json`, `lectii\vi\m1-l04\`, `_campaign\cum_fac_2026_10\…`) NU sunt ale tale.
- NU faci commit, NU publici. Căi ABSOLUTE, fără `cd`; Python cu regex prin Write + rulare fișier, niciodată heredoc.
- Copia lecției de acum, înainte de prima schimbare: `_proba\inainte_2026_10_16\` (index.html, afirmatii.json, surse.md).

## Economia contextului
Ieșirile lungi în `_proba\*.txt` + coada; pagina pe secțiuni (Write / Edit mare); `_proba\stare_autor.md` la zi (decizii, variante respinse, ce urmează). Dacă dirijorul îți cere predarea, o completezi și te oprești.

## Răspunsul final
JSON-ul din brief + `"pas_nou":"<titlul și numărul pasului>"`, `"situatii_R1":{"a":"<locul>",…,"f":"<locul>"}`, `"nume_butoane":N`, `"izolare":{"chei_lh_schimbate":N,"cereri":N}`, `"astept":[…]` (ce lipsește din componentele comune), `"cereri_api":[…]`, `"pentru_componenta_comuna":[…]`.
