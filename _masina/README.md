# Mașina de verificat lecții — nivelul 3 (agentul „dumb”) și nivelul 1 (executorul în pagină)

Aici stă inima verificării cu agentul-începător (planul: `_campaign\revizuire_completa_2026_09\01_PLAN.md`, §3 nivelurile 1 și 3, §4).
Ideea, pe scurt: un model AI primește **numai ce vede elevul** până la un pas al lecției și încearcă să facă ce i se cere,
spunând pentru fiecare mișcare **de unde** a aflat-o (cu citat). Apoi un **program** (nu un om, nu alt AI) verifică citatele
și pune verdictul. Agentul nu dă verdicte și nu poate convinge programul.

## Ce face fiecare fișier

| Fișier | Ce face |
|---|---|
| `dosar_dumb.py` | Construiește **dosarul** pentru un pas: textul pașilor până la pasul k, exemplele, „explică-mi altfel”, enunțul exercițiului cu variantele amestecate, foaia ca grilă. Fără răspunsuri, indicii, explicații de după răspuns sau pașii următori. Scrie `dosar.json`, `dosar.txt` și `prompt.txt` (șablonul + dosarul, gata de trimis). |
| `prompt_agent_dumb.md` | Șablonul pentru agent: cele 9 reguli ale „cărții închise” și formatul FIX al răspunsului (JSON). |
| `valideaza_pas.py` | Pune verdictul pe răspunsul agentului. Cu `--executor auto` rulează și executorul și pune FĂCUT doar dacă el confirmă. |
| `executor_pagina.py` | **Executorul în pagină** (nivelul 1): deschide pagina în Chromium pe 2 profile (desktop 1280 px cu mouse și tastatură; Pixel 7 cu atingere) și face acțiunile agentului prin GESTURI reale, ca un elev. Citește starea după fiecare acțiune, apasă „Verifică”, compară cu ce promite lecția. Scrie `executor.json`. |
| `cunostinte_actiuni.json` | Tabelul „acțiune → ce trebuie să știi” (`=`, `*`, `:`, `$`, SUM, Enter, Ctrl+C, clic dreapta, tragere…) și cum recunoaște programul că lecția le-a predat. |
| `comun.py` | Piese comune: citirea lecției, textul văzut de elev, grila, măștile, rolurile celulelor. |
| `teste\` | 4 lecții-fixtură (curată; termen înainte de explicație; celulă cu două roluri; **promisiune falsă**, pentru executor), răspunsuri de agent scrise de mână, `ruleaza_teste.py` (57 de cazuri, dintre care 4 cu executorul pornit), `mutanti.py` (reguli stricate intenționat; testele trebuie să le prindă pe toate). |
| `proba\` | Probele pe lecții reale: `excel-pas-cu-pas-viii` și `lectii\viii\m1-l04`, cu dosare, răspunsuri haiku, validări (`validare_final.json`) și `executor*.json`; plus `vii_l04_*_actiuni.json` (acțiuni scrise de mașină pentru proba executorului pe wordobj). |
| `_secret\` | Ce NU vede agentul: sămânța amestecului, cheile, canarul, momeala, masca. **Nu se publică** (`.gitignore`). |

Lecția se citește cu parserul existent al jocurilor: pagina se deschide în Chromium și se ia `JocMotor.test.config()`
(același apel ca în `jocuri\_motor\test_joc.py`, împachetat în `ilustratii.py::config`). Rezultatul se ține în `_cache\`.

## Cum se rulează

```
python _masina\dosar_dumb.py jocuri\excel-pas-cu-pas-viii\index.html --nivel 1 --pas 2 --profil PROFIL.json --sarcina ex
python _masina\valideaza_pas.py <dosarul>\dosar.json raspuns.json [--executor auto]
python _masina\executor_pagina.py <pagina> --pas 2 --actiuni raspuns.json --dosar <dosarul>\dosar.json   (sau --sarcina ex --sarcina-id S1, fără dosar)
python _masina\teste\ruleaza_teste.py      (ultima linie = câte teste au picat; trebuie 0)
python _masina\teste\mutanti.py            (ultima linie = câți mutanți au scăpat; trebuie 0)
```

- `--pas k` = al câtelea pas din `pasi`, **numărat de la 0** (în lecțiile noi, pasul 0 = „La ce folosește”). Pe ecran elevul vede „pasul k+1 din n”; dosarul le scrie pe amândouă.
- `--sarcina`: `pas` (fă ce cere pasul) · `ex` (exercițiul „Încearcă tu”) · `ex1`, `ex2`… („Încă un exercițiu”) · `atelier` · `q1`…`q5` (verificarea) · `diploma` („Acum în aplicația adevărată”).
- `--caiet lectie1.html lectie2.html#3` = lecțiile de dinainte (caietul). Un citat din caiet se primește doar dacă lecția e în „Ai nevoie de” (din profil).
- `--cu-indiciu` = dosarul de DUPĂ prima greșeală (conține indiciul). Reușita atunci = `FĂCUT_CU_INDICIU`.
- `--test-scurgere` = construiește și verifică, dar nu scrie nimic.

**Agentul primește NUMAI `prompt.txt`, fără nicio unealtă** (fără citit fișiere, fără căutare). Dacă primește unelte, poate da peste `_secret\`.

### Profilul (`profil.json`, lângă lecție)
```json
{"clasa": "a V-a", "limba_office": "RO",  "aplicatii": ["excel"], "de_la_zero": true,
 "stie": [{"termen": "mouse", "din": "presupus"}], "nu_stie": ["celulă", {"termen": "TVA", "explicat_la": "P3"}],
 "ai_nevoie_de": ["m1-l01"]}
```
`limba_office`: `RO`, `EN` sau `RO+EN` (lipsă = `RO+EN`). La `RO`, numele de meniu doar în engleză (din `calibrare\meniuri_ro_en.json`) devin cuvinte inventate; la `EN`, invers.

Se citește și profilul scris de autorul lecției (`lectii\...\profil.json`): `stie` cu `{"ce": …}`, `nu_stie` ca text liber, `invatat_in_lectie` cu `{"termen", "unde"}`. Textul liber se citește PRUDENT: se maschează doar termeni scurți (cel mult 3 cuvinte, fără virgule, „=” sau „/”), iar un termen care apare într-o propoziție din ȘTIE nu se maschează. „unde” (P1 = „La ce folosește” la autor = P0 aici) se folosește doar dacă programul nu găsește singur locul explicației. O tastă/acțiune e „știută” dacă numele ei apare ca atare într-o propoziție din ȘTIE (ex. „Enter coboară”).

## Ce verifică programul

**La construirea dosarului**
- **Masca.** Cuvintele din NU ȘTIE devin cuvinte inventate (același cuvânt de fiecare dată, cu terminațiile păstrate: „celulă” → „sevulă”, „celula” → „sevula”), până la blocul în care lecția le explică (recunoscut după `<mark>`, „X este…”, „se numește X”; sau `explicat_la` din profil).
- **Testul de scurgere.** Dacă o bucată de 12 caractere din ce trebuia ascuns (explicații, indicii, rezolvări, pașii de după, atelierul și verificarea dacă nu s-a ajuns la ele) apare în dosar și nu vine din ce e vizibil, dosarul **nu se scrie** și ieșirea e 4.
- **Canarul** (secret, pe cel puțin 30% din apelurile unui lot; lotul se ține în `_secret\registru_<lot>.jsonl`): un număr dictat schimbat (agentul trebuie să urmeze copia) sau o promisiune ștearsă („în B3 apare 12” dispare). Plus **momeala**: o sarcină care cere un buton care nu există. Uneori apare și o **sarcină-martor** adevărată, ca două sarcini să nu însemne „una e capcană”.
- Variantele și elementele de ordonat sunt amestecate cu sămânța secretă.

**La verdict** (`valideaza_pas.py`)
- Citatul trebuie să existe în dosar. Citat inventat → **INVALID**. Înainte de comparare, în citat ȘI în dosar se normalizează spațiile, ghilimelele („…” "…" “…” «…»), apostrofurile (’ ') și liniuțele (– — -) (decizia dirijorului, 27.09.2026).
- Dacă JSON-ul agentului pică doar pentru că a deschis cu „ și a închis cu " drept, programul îl repară mecanic și scrie asta în notă (`--fara-reparare` = fără reparare → INVALID).
- Ce faci (celula, textul, butonul, tasta) e în citat sau la cel mult 40 de caractere de el (`--distanta N` schimbă pragul); textul tastat e bucată din citat. Altfel → **NESIGUR**, cu o excepție: la exercițiile de aplicare agentul dă `derivare` (exemplul + înlocuirile), iar programul reface formula. Raportul arată **distanța efectivă** pentru fiecare acțiune (pentru calibrarea pragului).
- Citat doar din foaia-grilă sau din textul sarcinii → **NU_GĂSESC**. Citat dintr-o lecție netrimisă din „Ai nevoie de” → **NU_GĂSESC**.
- Tabelul de cunoștințe: dacă formula cerută (din lecție sau din rezolvarea ascunsă) folosește `:`, `SUM`, `*`… nepredate înainte → **BLOCAJ**, orice ar spune agentul. La fel dacă instrucțiunea conține un cuvânt mascat.
- O celulă cu două roluri (ex. D1 întâi „TVA”, apoi rezultatul 540) fără „foaie nouă” între → **CONTRADICȚIE**.
- Răspunsul greșit față de cheie, celula lăsată în editare (fără Enter/Tab) → **NEFĂCUT**. Fără predicție („dacă… atunci…”) → **FĂCUT_FĂRĂ_ÎNȚELEGERE**.
- Canar ignorat sau momeală „găsită” → **INVALID** (apelul nu valorează nimic; se reia cu alt agent).
- **Două citate pe acțiune** (decizia dirijorului): `citat_metoda` = CUM se face (din pas, „Uite cum”, „explică-mi altfel”, indiciu, caiet; NU din enunț → altfel NU_GĂSESC) și `citat_obiect` = PE CE (celula, zona, textul, butonul; poate fi din enunțul sarcinii). Regula de ≤40 de caractere se aplică între obiect și `citat_obiect`. Metoda trebuie să fie și PREDATĂ (tabelul de cunoștințe). Un singur `sursa` (formatul vechi) e primit în continuare și ține loc de ambele.
- **FĂCUT cere executorul.** Fără executor, verdictul maxim e `FĂCUT_NECONFIRMAT`. Cu `--executor executor.json` sau `--executor auto`: confirmat → FĂCUT; celulă rămasă în editare → NEFĂCUT; ce promite lecția nu apare pe ecran → NEFĂCUT (cu nepotrivirea citită de executor); nimic de confirmat (pas fără simulator, canar pe număr) → rămâne NECONFIRMAT.

### Executorul (nivelul 1)
- Navigarea până la pas se face prin cârligele de test ale motorului (`JocMotor.test.pas/atelier/exercitiu`), iar bara „Spune cine ești” se închide cu „Nu, doar vizitez”. Asta nu e ce se verifică.
- **Gesturile sunt reale:** clic sau atingere în mijlocul țintei, după ce ținta e adusă pe ecran. Dacă punctul e acoperit de altceva, gestul e „imposibil”. Tragerea se face cu mouse-ul, iar pe telefon cu evenimente touch reale (CDP). Tastarea merge în ce are focus. Butoanele se găsesc după textul de pe ecran, eticheta (aria-label) sau, doar pe desktop, bula cu numele (title). O fereastră deschisă are întâietate.
- **Pe telefon**, tastele pe care tastatura de pe ecran nu le are (Ctrl+…, Delete, Esc, Tab, F-uri) sunt imposibile. Rezultatele de pe telefon apar ca note; verdictul îl dă profilul desktop.
- **După fiecare acțiune** se citește starea. Excel: valorile, celula activă, zona, caseta de nume, bara fx, modul Gata/Introducere/Editare. Word: rândurile, cursorul, textul netrimis, testele bifate. O acțiune fără efect pe ecran e „imposibilă”, cu motivul.
- **La final:** se notează dacă a rămas ceva în editare, se apasă „Verifică” și se compară cu `astept` al agentului. Formele citite: „caseta de nume arată X”, „în X apare Y”, „zona X se colorează”.
- Contractul `executor.json`: `confirmat` (true/false/null, profilul desktop), `celula_in_editare`, `nepotriviri[]`, iar pe fiecare profil și lectură acțiunile cu `făcută/imposibilă/neexecutabilă`, `de_ce` și `stare_dupa`.

Ieșiri: `0` trece · `1` problemă a lecției · `3` apel INVALID · `2` eroare de folosire. Ultima linie: numărul de probleme.

## Proba pe lecția reală (27.09.2026)
`proba\dosar_n1_p2_ex\`: `excel-pas-cu-pas-viii`, nivelul 1, pasul 2 („Cum găsești o celulă”), exercițiul „alege D5”, profil clasa a VIII-a de la zero, Office RO.
Testul de scurgere trece; masca lucrează (celulă/adresă/zonă inventate până la explicație; Home/Insert/Data inventate pe profil RO).
Canarul ales de script: momeala „Rotunjește tabelul”. Un agent (haiku, fără unelte) a răspuns → **INVALID**: a copiat un citat cu ghilimele drepte `"…"` în loc de „…”.
Diagnostic (NU verdict): cu ghilimelele reparate, momeala e respectată, iar sarcina principală iese NESIGUR — citatul pentru „selectez D5” e la 49 de caractere de „D5” (limita e 40). Șablonul cere acum explicit ambele lucruri.
Pe toată lecția (12 niveluri, fiecare pas/exercițiu/atelier/întrebare/diplomă, cu și fără canar): 324 de dosare, toate trec testul de scurgere.

**Reluarea după decizia dirijorului** (validare finală în `validare_final.json`, lângă fiecare răspuns):

| Dosar | Verdict | De ce |
|---|---|---|
| `proba\dosar_n1_p2_ex` (haiku, a doua rulare) | NESIGUR | momeala respectată; „selectez D5” citat la 49 de caractere de „D5” (prag 40). JSON-ul reparat mecanic (2 ghilimele „…"). |
| `proba\l04_p2_ex` — `lectii\viii\m1-l04`, pasul 2, „selectează zona A2:B4” | NESIGUR | momeala respectată; „trag de la A2 la B4” citat din exemplul cu B2…C4, nu din enunțul care conține A2/B4. JSON reparat (1). |
| `proba\l04_p3_ex` — același, pasul 3, „copiază A1:B3 în D1” | NESIGUR | Ctrl+C/Ctrl+V/Esc bine citate; „selectez A1:B3” și „selectez D1” citate din propozițiile cu METODA, nu din enunț. Fără canar la acest apel. |

Tipar comun: agentul citează propoziția cu *cum* se face, nu pe cea cu *ce* (celula e doar în enunț). m1-l04 pe toate sarcinile: 76 de dosare, toate trec testul de scurgere.

**Runda a treia: două citate + executorul** (paginile de acum; m1-l04 viii are 8 pași). Dosarele sunt în `proba\*_v2\`, iar executorul pe haiku rulează prin `--executor auto`:

| Sarcina | Verdict | Ce a văzut executorul |
|---|---|---|
| excel-pas-cu-pas-viii N1 P2 (alege D5; momeală „Umplere dublă”) | **FĂCUT** | desktop + telefon: D5 ales, „Verifică” = Corect!, caseta de nume = D5 (ce promite lecția). Momeala respectată. |
| m1-l04 viii P2 (zona A2:B4) | FĂCUT_FĂRĂ_ÎNȚELEGERE | agentul n-a dat predicția; blocajul lui pe „dipimenă” (= „zonă”, folosit în obiectiv) e respins, pentru că lecția îl explică la P2, înainte de sarcină. Executorul confirmă tragerea pe desktop și pe telefon. |
| m1-l04 viii P3 (copiază A1:B3 în D1 cu Ctrl+C/Ctrl+V) | INVALID | în sarcina-martor S2 agentul a scurtat un citat cu „...”. Executorul, pus separat pe S1: desktop 5/5 gesturi și „Corect!”; **telefon: Ctrl+C, Ctrl+V și Esc nu există pe tastatura de pe ecran**, deci exercițiul nu se poate face pe telefon cum e scris. |
| m1-l04 vii P2 (wordobj: rând nou sub titlu) | (doar executor) | acțiunile sunt scrise de mașină din enunț. Desktop confirmat. **Pe telefon**, după atingerea textului caseta de tastat nu e activă, deci tasta Enter nu face nimic; merge doar butonul de pe ecran „Enter ↵”, iar enunțul („apasă Enter ↵”) nu spune care dintre ele. |
| m1-l04 vii P3 (wordobj: inserezi poza) | (doar executor) | Insert › Pictures › This Device… › fișierul › Insert: desktop confirmat; pe telefon, aceeași problemă cu Enter. |

Fixtura `teste\lectie_promisiune_falsa`: executorul PRINDE promisiunea falsă. Lecția promite „caseta de nume arată toată zona, A2:B4”, dar pe ecran scrie A2. Validatorul fără executor ar fi dat FĂCUT_NECONFIRMAT; cu executor dă NEFĂCUT.

## Ce NU face încă
- **Aplicația reală** (nivelul 2: Excel/Word/PowerPoint prin COM) vine separat. Predicțiile agentului („dacă… atunci…”) nu sunt încă rulate.
- Executorul: sarcinile fără simulator (pasul de citit, întrebările q2–q5 care cer răspunsurile de dinainte, diploma) nu se pot confirma, deci rămân NECONFIRMAT. Promisiunile se citesc mecanic doar în Excel și în câteva forme. Pe telefon, tastatura de pe ecran e aproximată cu evenimente de tastă, apăsarea lungă (clic dreapta) cu un touch de 0,9 s, iar lipsa tastelor e o regulă a executorului, nu o observație pe un telefon adevărat. O dată, pe telefon, „Verifică” n-a dat mesaj; la reluare a mers, iar cauza n-am înțeles-o.
- Judecătorul (nivelul 4), generatorul independent de sarcini, proba „fără lecție” (întrebarea pusă fără lecție), parcurgerile întregi și rularea automată pe ambele profile (RO și EN) — nu sunt aici.
- Imaginile ajung la agent doar prin descrierea lor (`alt`); OCR-ul capturilor nu e legat.
- Recunoașterea „lecția a explicat X” și a rolurilor celulelor e **euristică** (expresii în `comun.py` și `cunostinte_actiuni.json`); calibrarea cu profesorul nu e făcută.
- Lista de meniuri RO/EN nu are încă „workbook”, „Sheet1”, „Name Box”: pe profil RO ele rămân vizibile.
- Pe pagini fără pași (joc vechi cu `text` + `qs`), textul nivelului e tratat ca pasul 0.
- Grilele din exemplele lui m1-l04 (alt HTML decât `<table>`) ajung în dosar cu câte o celulă pe rând (lizibile, dar greu de urmărit).
- La copiere/mutare/ștergere, valorile rezultate (cheia `valori`/`gol`) le poate verifica doar executorul; programul spune asta în notă.
