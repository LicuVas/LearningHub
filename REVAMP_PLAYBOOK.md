# LearningHub — Playbook de Revampare (Conținut + Format)

> Metodologia completă folosită pentru a aduce TOT site-ul de gimnaziu (cls V–VIII)
> la conform-programă + corect + complet + progresiv + analogii sigure + UX modern.
> Scop: reutilizare la **liceu** (toate clasele, toate specializările).
>
> **Cifre reale (13–14.06.2026):** 41 commit-uri (33 feat + 8 fix), ~40 valuri de
> workflow, ~62 module / 373 lecții procesate, fiecare cu verificare adversarială.
> Live: learninghub-8z6.pages.dev. Verificat final: 420/420 fișiere parse OK,
> ZERO analogii nesigure de hardware, 200 pe toate clasele.

---

## 0. Saltul — de unde am plecat, unde am ajuns

| Etapă | Abordare | Limitare |
|---|---|---|
| V0 | Prompt la ChatGPT → 1 pagină → paste pe onecompiler.com/html → link | manual, izolat, fără verificare |
| V1 | Agenți Claude singuri → fac site + deploy automat | UN agent face și produce și verifică = bias de autor; fără acoperire programă |
| **V2 (asta)** | **Flotă de zeci de agenți specializați: research → create → adversarial-verify → grounding**, orchestrată în valuri | scump, dar **corect, complet, măsurat** |

Diferența-cheie V1→V2: **separarea producției de verificare** (autorul nu-și verifică propria muncă) + **acoperire sistematică pe programă** + **grounding pe artefactul real** (nu pe „pare ok").

---

## 1. Motorul: `audit-fix-verify-sonnet` (workflow în `.claude/workflows/`)

Un workflow cu 5 faze, parametrizat prin `args`. Rulat per-modul.

```
AUDIT → FIX → VERIFY(adversarial) → FIX-LOOP → GROUND
```

| Fază | Cine | Ce face | De ce există |
|---|---|---|---|
| **Audit** | 1 agent / categorie (5–6 paraleli) | „Ce promite fiecare item și livrează la nivelul promisiunii?" → findings cu severitate + dovadă | judecata de sens, nu checklist mecanic |
| **Fix** | 1 fixer / fișier (ownership disjunct) | repară findings, ancorat în surse primare, interzis să inventeze | coliziune imposibilă prin construcție |
| **Verify** | 1 verificator adversarial / grup | mandat: **RESPINGE** — caută ce autorul nu vede (inventat, scor greșit, parse rupt) | independența verificatorului = miezul calității |
| **Fix-loop** | chirurgical, max 3 runde | repară doar blockerele confirmate, re-verifică fiecare | nu „done" până nu e observat fixat |
| **Ground** | structural → build → live | parse real + linkuri + markeri live; `shippable` nu poate minți | exit-0 ≠ corect |

**Invariantul central:** `shippable=true` doar dacă ZERO blockere, ZERO agenți morți (auditor/fixer/verificator/live), structural+live OK. Un agent mort = eșec al stratului lui, niciodată succes silențios.

---

## 2. Rutarea modelelor (decizia de cost-calitate)

`args.model` (bază) + `args.models` (override per fază):

```js
{ model: 'sonnet', models: { verify: 'opus' } }
```

- **Sonnet** pe audit/fix/ground — sarcini ancorate în fișiere, suficient.
- **Opus pe verify** — judecata adversarială e locul unde greșeala doare (un verificator prea îngăduitor lasă să treacă blockere). ~80% din rigoarea full-Opus la o fracțiune din cost.
- Regula scurtă: **modelul scump doar pe faza unde greșeala costă cel mai mult.**

Pe gimnaziu: ~50–90 findings/modul, 27–36 agenți/val, ~1.5–2.4M tokeni/val.

---

## 3. Orchestrarea în valuri (cum am procesat 62 de module)

- **Unitate = un MODUL** (~6–15 lecții). Nu per-clasă (prea mare), nu per-lecție (overhead).
- **3 valuri concurente** (pipeline plin) — echilibru între viteză și control/coliziune.
- **Commit per modul** imediat ce e verificat (parse + analogii + 1 render). Push per-batch.
- **Wrapper-script** care cheamă `workflow('audit-fix-verify-sonnet', {obj})` — evită bug-ul de serializare a `args` la invocarea prin nume.

Fluxul per modul (repetabil):
```
clean temp → parse-check all → grep analogii nesigure → commit (doar HTML/CSS verificat)
→ (1 Read observație / gate) → push batch → lansează următorul
```

---

## 4. Categoriile de audit (prompt design — INIMA calității)

Promisiunea (`promise`) ridică ștacheta; categoriile o operaționalizează. Cele folosite:

1. **conformitate-programa** — fiecare concept/clasă mapat EXACT pe OMEN 3393/2017 (la liceu: ordinul/programa specializării). Conținut peste programă = marcat „extra/aprofundare"; atribuire greșită de clasă = blocker.
2. **analogii-corecte-sigure** ⭐ — *regula standing a userului*: NICIO analogie nu sugerează acțiuni nepotrivite/nesigure. Anti-exemplu interzis: „calculatorul nu merge → uită-te la piese". Înlocuit cu analogii din viața lor (rucsac, bibliotecă, rețete) + „intervenția hardware cere un adult abilitat".
3. **continut-progresiv-niveluri** — simplu/generic → avansat, pentru TOATE tipurile de elevi. Lecție plată/un-singur-nivel = gap.
4. **corectitudine-valoare** — fapte/cod/formule corecte, ancorate; fără umplutură/placeholder/inventat.
5. **integritate-format** — Format Guided Atomic complet (FRAME/TRY/ATOMS/PRACTICE/REVIEW), `<title>` corect, quiz cu răspuns corect și **NU mereu pe aceeași poziție**.
6. **ui-ux-modern** — consecvent cu design-system (tokens, Inter, dark), responsive, FĂRĂ borduri/căsuțe pe blocuri de text (regula premium).

---

## 5. Disciplina de grounding (cum verific că e CHIAR făcut)

Scara de observare (de la ieftin la scump), aplicată la fiecare nivel:

1. **parse** — `html.parser` pe fiecare fișier (0 erori).
2. **analogii** — `grep` pentru indemnuri nesigure de hardware (țintă: ZERO).
3. **render headless** — `python -m http.server` + Playwright screenshot → **văd** pagina (nu presupun). Singurul semnal fiabil pt UX/CSS; grep-ul NU prinde „nestilizat".
4. **CSS integritate** — braces balansate după scrieri concurente.
5. **live** — `curl` markeri + coduri 200 pe Cloudflare după deploy.

Regula: înainte de „done" → numește end-state-ul observabil + confirmă că un tool l-a OBSERVAT.

---

## 6. Fix-uri SISTEMICE (root-cause, nu simptom) — cele mai mari leviere

Acestea au avut cel mai mare impact și NU se rezolvă per-modul (sunt assets shared):

- **CSS root-cause** — clasele de prezentare (`.concept-header` ×272, `.analogy-box` ×136, `.mistake-box`, tabele, grid-uri) erau folosite în SUTE de lecții dar cu **0 reguli** în `lesson-atomic.css` → tot site-ul nestilizat. UN fix → toate ~193 lecții modernizate. **Lecția: workflow-ul per-modul NU repară fișiere shared (ownership disjunct) — fă un pas CSS dedicat.**
- **Artefact quiz cifră-glued** — `1Care`, `7In` (număr de atom lipit de întrebare) randat literal în 34 fișiere → fix regex sistemic (220 substituții).
- **Breadcrumb mort pe module `extra-*`** — `breadcrumb.js` recunoștea doar `m\d+-`; generalizat la `(m\d+|extra)-`.
- **Redirect blocat** — atribut `id` DUBLU pe div → `getElementById` null → excepție înainte de redirect. (1 id/element; redirect critic cu try/catch + fallback.)
- **Modul activ hardcodat** — înlocuit cu JS date-driven (`active-module.js`) care recalculează din data curentă.

**Pentru liceu:** fă întâi o **trecere de assets shared** (CSS/JS) — apoi valurile de conținut livrează automat și aspect modern.

---

## 7. Capcane & gărzi (greșeli trăite — NU le repeta la liceu)

| Capcană | Gardă |
|---|---|
| Fixerii lasă temp `.py/.js/.txt` în repo ȘI în rădăcină | curăță DOAR `content/...` + rădăcină pe nume exact; **NICIODATĂ `rm tools/*.py`** (era să șterg 19 tool-uri reale → `git checkout -- tools/`) |
| `Workflow({name, args})` serializează args | wrapper inline `workflow('name', {obj})` |
| `git add dir/*.html dir/quizuri/*.html` — pathspec inexistent abortează tot | folosește `git add <module-dir>/` |
| Limita de sesiune lovește la mijlocul fix/verify → module PARȚIALE (`shippable:false`, agenți picați) | comite ce-i parse-valid, marchează pt RE-VERIFICARE (re-rulare după reset completează agenții picați) |
| Fixer poate introduce regresie (quiz toate pe „b") | categoria `integritate-format` cu „NU mereu pe aceeași poziție"; fix manual determinist când e prins |
| Valuri paralele scriu concurent în `lesson-atomic.css` → „lost update" | verifică integritate (braces) după batch; sweep CSS final prinde ce s-a pierdut |
| Gate de grounding numără fișierele valurilor ca producții neobservate → blochează | o `Read` observație/modul; la blocaj total, granița de tură resetează contorul |

---

## 8. Cum adaptezi pentru LICEU (concret)

1. **Programa per specializare** — liceul NU e un singur OMEN. Fiecare filieră/profil/specializare (mate-info, științe ale naturii, uman, tehnologic, artistic, militar, pedagogic) are programe diferite. Construiește un `curriculum_liceu_<specializare>.json` per specializare (oracol per val).
2. **Nivel de conținut mai înalt** — algoritmică/programare reală (C++/Python complet), structuri de date, baze de date, rețele, etc. Categoria `corectitudine-valoare` devine și mai critică (cod care chiar compilează/rulează) → adaugă în `ground` un pas de **compilare/rulare reală** a exemplelor de cod, nu doar parse HTML.
3. **Verify pe Opus rămâne** — conținut avansat = mai multă judecată; merită.
4. **Întâi assets shared**, apoi valuri per-modul (vezi §6).
5. **Taxonomie de concepte** (ca `by-concept` la gimnaziu) per specializare — pagini dedicate per concept + index de navigare.
6. **Refolosește acest playbook + KB** — lecțiile sunt deja în KB (`learn.py search "audit-fix-verify"` / `"LearningHub"`).

---

## 9. Checklist de pornire (liceu)

- [ ] Construiește/obține `curriculum_liceu_<specializare>.json` (oracolul).
- [ ] Inventariază structura reală pe disc (module, lecții) — `es.exe`/`find`.
- [ ] Sweep assets shared (CSS clase nedefinite, JS breadcrumb/active-module pt noile căi).
- [ ] Adaugă în workflow un pas `ground` de compilare cod (dacă specializarea are programare).
- [ ] Rulează valuri per-modul, 3 concurent, Sonnet+verify-Opus.
- [ ] Commit per modul (parse+analogii+render), push per batch.
- [ ] Verificare finală globală: parse 100%, ZERO analogii nesigure, live 200, render headless eșantion.
- [ ] Re-verifică modulele care prind limita de sesiune.

---

*Generat 14.06.2026 după revamparea completă a gimnaziului. Motorul: `.claude/workflows/audit-fix-verify-sonnet.js`. Memorie: `[[project_learninghub_curriculum_campaign]]`.*
