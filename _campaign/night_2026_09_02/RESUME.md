# Tura de noapte LearningHub — 02→03 septembrie 2026

**Ce se construieste:** materia pentru clasele reale ale prof. Gurlan Vasile in anul scolar 2026-2027,
la **Colegiul Tehnic de Transporturi Piatra-Neamt** — liceu (a X-a, a XI-a, a XII-a), scoala de maistri
si scoala postliceala sanitara. In acelasi format ca lectiile bune care exista deja pe sit
(**Format C „Guided Atomic"**: obiective → carlig → atomi cu quiz → 3 exercitii → recapitulare).

**Situl:** https://learninghub-8z6.pages.dev/hub/ · repo local `C:\00\Projects\LearningHub`

---

## Daca sesiunea a fost intrerupta (quota, cadere, reboot) — cum se continua

Totul e proiectat sa se poata relua **fara sa stii nimic din ce s-a discutat inainte**.
Starea NU e in capul agentului, e pe disc, si se citeste dintr-un singur loc:

```
cd C:\00\Projects\LearningHub\_campaign\night_2026_09_02
python status.py --md
```

Comanda asta **deschide fiecare fisier planificat si il masoara** (nu crede pe cuvant niciun agent).
Scrie si `STATUS.md`. Iese cu 0 daca totul e gata, cu 1 daca mai e de lucru.

Apoi, pentru fiecare grupa care nu e completa:

```
python make_wave.py <grupa>      # rescrie waves\<grupa>.js cu DOAR ce mai lipseste
```

si se lanseaza valul cu unealta Workflow:

```
Workflow({ scriptPath: "C:\\00\\Projects\\LearningHub\\_campaign\\night_2026_09_02\\waves\\<grupa>.js" })
```

Grupele: `lic10`, `lic11`, `lic12`, `maistri`, `sanitar1`, `sanitar2`.

> Reluarea e sigura pentru ca `make_wave.py` pune in val **numai fisierele care nu trec poarta**.
> Ce e deja bun nu se mai atinge si nu se rescrie.

---

## Ce inseamna „gata" (poarta mecanica, `status.py`)

Un fisier de lectie trece doar daca are **toate** astea:

| Verificare | Prag |
|:--|:--|
| exista si are continut | ≥ 11.000 octeti |
| leaga foaia de stil comuna `lesson-atomic.css` | obligatoriu |
| **nu** are `<style>` scris in pagina | interzis (ar sparge tema sitului) |
| atomi de invatare `div.atom` | ≥ 4 |
| exercitii de practica | ≥ 3 |
| quiz-uri cu JSON valid (intrebare + variante + raspuns) | ≥ 3 |
| sectiunea de obiective si cea de recapitulare | prezente |
| butoanele inapoi/inainte duc unde trebuie | exact |

Pagina de index a unui modul trece daca exista si **listeaza toate lectiile** modulului.

Poarta a fost calibrata pe doua lectii bune care exista deja pe sit
(`mat-info/cls9/m3-tic-baze/lectia1-sisteme-operare.html` si
`tehnologic/cls9/m1-sisteme-retele/lectia1-sisteme-calcul.html`) — amandoua trec.

---

## Fisierele acestei ture

| Fisier | Ce face |
|:--|:--|
| `build_plan.py` | genereaza `PLAN.json` — **ce** se construieste (25 module, 90 lectii). Singura sursa de adevar pentru continut. |
| `PLAN.json` | inventarul: grupa, modul, fisier, tema exacta a fiecarei lectii, navigarea |
| `status.py` | **poarta** — masoara ce e pe disc fata de plan |
| `make_args.py` | alege din plan doar ce lipseste, pentru o grupa, si adauga publicul tinta si tipul de exemple |
| `make_wave.py` | scrie `waves\<grupa>.js` cu lotul **copt inauntru** (ca lotul sa nu treaca prin contextul sesiunii) |
| `wave.js` | sablonul de val: Scaffold → Build → Verify → Fix |
| `waves\*.js` | valurile gata de rulat |
| `STATUS.md` | ultimul raport de stare, in cuvinte simple |

---

## De unde vine continutul (ce programa, pentru cine)

Sursa: fisa din vaultul Obsidian
`C:\ObsidianVaults\Scoala_2022\ColegiulTransporturi\Incadrare 2026-2027 — Colegiul Transporturi.md`
si planificarile din `...\Planificari 2026-2027 — T.I.C..md`.

| Grupa | Clasele lui | Programa / modulul |
|:--|:--|:--|
| `lic10` | X B (T.E.E.A.), X E (Mecanica/Lemn) | T.I.C. clasa a X-a, **OMECI 5099/09.09.2009** — calcul tabelar, baze de date, prezentari digitale |
| `lic11` | XI C, XI D | T.I.C. XI-XII (aceeasi programa pe doi ani), **OM 5099/2009** — competentele individuale **1 si 2** |
| `lic12` | XII C, XII D | acelasi document — competentele individuale **3 si 4** (web + management de proiect) |
| `maistri` | Maistru electromecanic auto, an I | **Utilizarea tehnicii de calcul**, Anexa 3 la O.M.Ed.C. 4760/26.07.2006 — 3 competente |
| `sanitar1` | Postliceal sanitar an I, medicina generala | **Utilizarea calculatorului si tehnologia comunicatiilor** — 5 competente |
| `sanitar2` | Postliceal sanitar an II, farmacie | **Modulul VII — T.I.C.** — aceleasi 5 competente, alt context |
| `artistic12` | (Brauner, daca ai a XII-a) | cele 9 pagini care scriau **„In pregatire"** pe situl public: D1–D7 (proba de competente digitale) + proiectele P2 si P3 |

---

## ⛔ BLOCAJ REAL: publicarea nu se poate face fara tine (03.09.2026, ora 01)

Tot continutul e construit si **salvat in git local**, dar **`git push` nu trece**:

- managerul de credentiale Windows (`git-credential-manager`) cere autentificare **interactiva** — un push pornit a stat blocat 40 de minute fara sa urce nimic; nu am atins ecranul tau cat dormeai;
- tokenul din variabila de mediu `GITHUB_PERSONAL_ACCESS_TOKEN` este **expirat** — `https://api.github.com/user` raspunde **401** (acelasi motiv pentru care si serverul MCP de GitHub a picat la pornirea sesiunii);
- citirea merge (depozitul e public, `git ls-remote` raspunde instant) — doar scrierea cere identitate.

**Ce ai de facut tu (2 minute):**
```
cd C:\00\Projects\LearningHub
git push
```
Daca apare fereastra GitHub, autentifica-te. Ca sa nu se mai repete, genereaza un token nou
(GitHub → Settings → Developer settings → Personal access tokens, scope `repo`) si inlocuieste-l pe cel vechi.

**Dupa push, verificarea — nu te opri la „am dat push":**
```
curl -s -o /dev/null -w "%{http_code}" https://learninghub-8z6.pages.dev/content/profesional/maistri/an1/c1-aplicatii-software/index.html
```
Trebuie sa raspunda `200`. Cloudflare Pages reconstruieste in ~1 minut dupa push.

---

## Ce a ramas deschis (de intrebat / de decis dimineata)

- [ ] **Liceul de Arte „Victor Brauner" — 7 ore, dar clasele nu sunt scrise nicaieri.** In vault exista doar
      lista de anul trecut (5A, 6MA, 7A, 7M, 8A, 8M, 9A, 9M, 11M, 12M). Fara incadrarea pe 2026-2027 nu se
      poate spune ce mai lipseste acolo. Pe sit exista deja profilul **artistic** cls9-12.
- [ ] **Pe profilul artistic, clasa a XII-a e schelet:** cele 7 pagini de „proba D" si cele 3 de proiecte au
      ~2,8 KB fiecare si zero atomi — sunt pagini goale, nu lectii. Daca la Brauner ai 12M, astea trebuie umplute.
- [ ] **Dumbrava Rosie** e gimnaziu (VI, VII A, VII B, VIII sau 5A, 5B, 7B, 8 — conflictul din incadrare nu e
      inca lamurit). Gimnaziul e deja acoperit pe sit (`content/tic/cls5..cls8`), deci nu intra in tura asta.
- [ ] **La postliceal sanitar an I:** daca scoala aplica varianta din O.M.E.N. 3499/2018, modulul se numeste
      altfel („Elemente de statistica si informatica medicala") si are alt continut. Lectiile construite acum
      acopera varianta veche, cea care se potriveste cu numarul tau de ore (56 = 4 × 14 saptamani).

---

## La final: publicarea

Continutul nu e livrat pana nu e pe sit:

```
cd C:\00\Projects\LearningHub
git add -A
git commit -m "feat(liceu+profesional): materia pentru clasele 2026-2027"
git push
```

sau `.\deploy.ps1 "mesaj"`. Cloudflare Pages reconstruieste in ~1 minut.
**Verificarea** nu e „am dat push", ci: deschizi o pagina noua pe
`https://learninghub-8z6.pages.dev/...` si vezi lectia acolo.
