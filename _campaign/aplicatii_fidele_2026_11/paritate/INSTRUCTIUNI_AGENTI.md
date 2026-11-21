# Inventarul de paritate — instrucțiuni comune pentru agenți (21.11.2026)

P = `C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/paritate`
L = `C:/00/Projects/LearningHub_fidel/aplicatii` (biblioteca nouă)

## De ce
Profesorul a încercat biblioteca nouă (L) și a găsit-o cu „mai puține funcționalități” decât simulatoarele din lecțiile publicate pe proba. Faci lista tuturor FUNCȚIILOR pe care elevul le poate folosi în simulatoarele vechi ale aplicației tale (ce poate FACE, nu cum arată) și, pentru fiecare, spui dacă biblioteca nouă o are. Lista devine oracolul de paritate: din ea se hotărăște ce se completează.

## Surse
- **Vechi = ce e pe proba** (commitul în `P/proba_src/COMMIT.txt`), extras în `P/proba_src/`:
  - fișierele simulatoarelor tale (lista e în promptul tău);
  - paginile tale: `P/pagini_pe_aplicatie.json`, cheia aplicației tale (pagina, fișierele de simulator încărcate, `simulator_in_pagina` = simulator scris direct în pagină, tipurile de exerciții, câte exerciții);
  - motorul jocurilor `P/proba_src/jocuri/_motor/motor.js` (cum se verifică exercițiile) și panglica comună `ui-panglica.js` + `panglica-<aplicație>.js` / `.json` (care butoane fac ceva și care doar arată).
  - Dacă o pagină de-a ta încarcă un simulator care nu e în lista ta, îl citești și pe el și îl treci în `fisiere_citite`.
- **Nou = biblioteca:** `L/aplicatii.js` (comun), `L/<aplicație>.js`, `L/panglica.js`, `L/date/<aplicație>.json`; documentația `P/../api_biblioteca.md`. Poligonul: `L/poligon.html?aplicatie=<aplicație>`.
- **Ajutor, nu verdict:** inventarul vechi de zone și gesturi `P/../inventar.json`, `P/../suprafete.json` (16.11).

## Ce e o funcție
O acțiune pe care elevul o poate face și care schimbă ceva verificabil: starea documentului / foii / fișierelor / desenului, sau un rezultat pe care un exercițiu îl verifică. Exemple: „îngroașă textul selectat (Ctrl+B sau butonul B)”, „scrie =SUM(A1:A3) și vede rezultatul”, „sortează tabelul descrescător după o coloană”, „inserează un grafic coloane”, „redenumește un fișier”.
- Granularitatea: o acțiune distinctă pentru elev = o funcție (Bold și Italic sunt două). Variante de același fel = una, cu lista în notă (10 culori de umplere = „culoarea de umplere a celulei”; SUM, AVERAGE, MIN… = câte o funcție pe fiecare funcție de foaie de calcul, fiindcă lecțiile le predau separat).
- **Doar afișat:** butoanele care doar arată un mesaj („nu e simulat”) sau doar se colorează le treci pe scurt, pe grupuri, în `doar_afisate`, nu în `functii`.
- Nu sări nimic din cauza numărului. Tot ce e în cod intră.

## Câmpurile unei funcții
```json
{"id": "<eticheta>-F001",
 "functie": "o propoziție în română simplă: ce poate face elevul",
 "grup": "ex. Formatare text / Formule / Foi / Fișiere / Navigare / Desen",
 "gest": "cum o face în simulatorul vechi (clic pe …, tasta …, tragere …)",
 "vechi_dovada": ["lectii/_sim/excelx.js:123"],
 "unde": ["lectii/viii/m1-l03"],
 "ceruta_de_exercitiu": true,
 "exercitii": ["tipul t:'excelx' din lectii/viii/m1-l03 (verifică …)"],
 "biblioteca": "DA | PARTIAL | NU",
 "biblioteca_dovada": "aplicatii/excel.js:456 — …; la NU: ce ai căutat (cuvinte, fișiere)",
 "lipsa": "la PARTIAL: ce face vechiul și biblioteca nu",
 "nota": ""}
```
- `vechi_dovada`: căile RELATIVE la `P/proba_src/` (ex. `lectii/_sim/wordobj.js:88`), iar linia trebuie să existe și să fie implementarea (nu un comentariu).
- `biblioteca`:
  - **DA** = biblioteca o face, cu același rezultat (dovadă `aplicatii/<fișier>.js:linie`);
  - **PARTIAL** = o face, dar lipsește ceva ce vechiul face (scrii ce, în `lipsa`);
  - **NU** = n-o găsești după o căutare cinstită; scrii ce ai căutat.
- `ceruta_de_exercitiu`: true doar dacă găsești exercițiul care o verifică (cu locul lui).

## Cum hotărăști DA / NU
- Citești codul: Grep înainte de Read, Read cu offset / limit. Fișierele mari nu le citești întregi dintr-o dată.
- Unde codul nu te lămurește, joci funcția în poligon, headless, cu Playwright (Python):
  - server local pornit de tine: `python -m http.server <port liber> --bind 127.0.0.1 --directory C:/00/Projects/LearningHub_fidel`;
  - `context.route("**/*", ...)` care abandonează orice cerere care nu e 127.0.0.1 / localhost;
  - nimic pe ecranul omului (doar headless); serverul îl oprești la final.
  - Scriptele de probă le pui în `P/probe_<eticheta>/`.

## Reguli
- Nu modifici nimic în `L/`, în lecții sau în `_campaign` în afară de fișierele tale din `P/`. Fără git care scrie (fără add / commit / checkout).
- Nu pornești Word / Excel / PowerPoint / Paint reale.
- Fără date personale în ieșiri.
- Contextul: la ~180k scrii ce ai și treci în md `PARTIAL: acoperit X, neacoperit Y`.

## Ieșirea
1. `P/<eticheta>.json`:
   `{"aplicatie": "...", "eticheta": "...", "fisiere_citite": [{"cale": "lectii/_sim/x.js", "linii": 627}], "functii": [...], "doar_afisate": [{"grup": "...", "exemple": ["..."], "dovada": "cale:linie"}], "nesigure": ["..."]}`
2. `P/<eticheta>.md`, scurt, în română simplă:
   - câte funcții, câte DA / PARȚIAL / NU;
   - lista NU și PARȚIAL, întâi cele cerute de exerciții;
   - ce n-ai apucat.
   Ultimul rând: `GATA_PARITATE <eticheta> total=N da=A partial=B nu=C`
3. Răspunsul tău final către orchestrator: cel mult 6 rânduri (numerele, căile, ce e nesigur).
