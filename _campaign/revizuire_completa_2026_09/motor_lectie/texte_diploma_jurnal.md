# Reparație: textele „a trecut toate niveluri” în afara motorului (modul LECȚIE, 27.09.2026)

Sursa cerinței: `jocuri\README.md` §10 (blocul „Modul lecție, în afara motorului”) + §4 „Modul LECȚIE”.

## Ce s-a schimbat

1. **`jocuri\diploma\index.html`** (r. 81, acum r. 81-82): textul diplomei pe telefon.
   - Nou: dacă `D.k==='lectie'` → `` pentru că a terminat lecția ${D.l}, „${D.j}”. `` altfel exact ca înainte.
   - `D.k`/`D.l` vin din `_motor\motor.js` r. 734-736 (`eLectie()?{k:'lectie',l:lectieInfo().nr}:{}`), deja trimise de motor.

2. **`C:\00\AI_0\tools\diplome.py`** (r. 232-238): textul diplomei PNG generate de `diplome.py descarca`.
   - Nou: dacă `d["joc"]` (cheia jocului, trimisă de motor la server — `netlify\functions\diploma.mjs` r. 34) începe cu `lectie_` → numărul lecției se extrage din cheie cu `re.search(r"_l(\d+)$", ...)` și textul devine `pentru că a terminat lecția <nr>, „<titluJoc>”.`; altfel ramura veche (jocuri) neschimbată.

3. **`jurnal\index.html`** (r. 82-85): panoul „Jocurile mele”.
   - Legătura (`url`, via regex `lectie_<clasa>_m<M>_l<NN>`) era deja bună, neatinsă.
   - Nou: pentru cheile `lectie_*` textul devine „lecție terminată” / „lecție începută” (fără numărătoare de niveluri); pentru jocuri, exact ca înainte (`n din X niveluri` / `<b>terminat</b>`).

## Probe rulate

| Comandă | Rezultat |
|---|---|
| `python -c "import ast,sys; ast.parse(open(r'C:/00/AI_0/tools/diplome.py',encoding='utf-8').read())"` | fără eroare (sintaxă OK) |
| `python C:\00\AI_0\tools\diplome.py --help` | afișează normal comenzile `pregateste/lista/descarca` (nu există mod de test intern) |
| Test Python dedicat (`test_diplome_text.py`, extras identic din ramura reparată): 4 cazuri text (2 jocuri, 2 lecții) | **PASS** toate 4; plus apel REAL la `diplome.deseneaza()` cu un dict de joc și unul de lecție → ambele au scris PNG valid (70738 B / 70091 B), fără excepție |
| Test Node (`test_js_branches.js`, extras identic din liniile reparate din `jurnal` și `diploma`) — 4 cazuri jurnal + 3 cazuri diploma | **PASS** toate 7 |
| `node -e` parsare script inline (`new Function(script)`) pe `diploma\index.html` și `jurnal\index.html` | ambele: „parseaza OK” (sintaxă JS validă) |
| Playwright (Chromium headless) — deschis `diploma\index.html#d=...` cu payload de LECȚIE și cu payload de JOC, plus `jurnal\index.html` fără elev înscris | fără nicio eroare de consolă (`FARA ERORI DE CONSOLA`) |
| Playwright — interceptat `CanvasRenderingContext2D.fillText` pe pagina REALĂ (nu o copie), pentru payload lecție și payload joc | Lecție: `pentru că a terminat lecția 4, „Lecția 4 (clasa a VII-a): Antetul”.` · Joc: `pentru că a trecut toate cele 5 niveluri ale jocului „Excel VIII”.` — identic cu textul de dinaintea reparației |

## Jocurile rămân neschimbate

Confirmat de două ori: (a) testul Node cu cazurile `joc_excel_viii` (nivel neterminat și terminat) — text și link identice cu ce era înainte; (b) extragerea `fillText` din pagina reală, cazul „joc”, produce exact `pentru că a trecut toate cele 5 niveluri ale jocului „Excel VIII”.` — aceeași formă ca înainte de reparație.

## Fișiere modificate

- `C:\00\Projects\LearningHub\jocuri\diploma\index.html`
- `C:\00\AI_0\tools\diplome.py`
- `C:\00\Projects\LearningHub\jurnal\index.html`
- (acest raport) `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\motor_lectie\texte_diploma_jurnal.md`

Fără commit (conform cerinței). Scripturile de test au rulat din scratchpad-ul sesiunii, nu au fost lăsate în repo.
