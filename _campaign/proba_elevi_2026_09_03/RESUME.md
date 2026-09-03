# Proba sitului din perspectiva elevilor — 03/04 septembrie 2026

**Ce e:** tot situl trecut prin ochii a patru cititori — elev slab, elev mediu, elev bun și un inspector care caută nod în papură. Lecție cu lecție, clasă cu clasă, plus paginile de navigare.

## Cum se reia, dacă tura s-a oprit

```
Workflow({scriptPath: "C:\Users\licuv\AppData\Local\Temp\claude\C--00-AI-0\33d252b4-3bd8-41e7-82f2-3000afaf047e\scratchpad\wf_proba.js",
          resumeFromRunId: "wf_18a96fb3-1d4"})
```
Agenții deja terminați întorc rezultatul din memorie, instant; se reia doar ce n-a apucat să ruleze.

**Jurnalul rulării:** `C:\Users\licuv\.claude\projects\C--00-AI-0\33d252b4-3bd8-41e7-82f2-3000afaf047e\subagents\workflows\wf_18a96fb3-1d4\journal.jsonl`
Fiecare rând e un agent: `started` / `result`. Aici se vede exact cât s-a făcut.

## Cum e construită

| Etapă | Cine | Ce face |
|:--|:--|:--|
| **Lecții** | 121 de agenți (Sonnet), câte unul per lot de max 6 lecții | rulează `tools\lesson_digest.py` pe modul, **se uită la captura** paginii, judecă din cele 4 perspective, dă note 1-10 și semnalări cu dovadă |
| **Verificare** | un agent (Opus) per semnalare gravă | e **avocatul apărării**: încearcă s-o respingă, verificând pe text. În dubiu → RESPINS. Doar ce supraviețuiește ajunge în raport |
| **Navigare** | 9 agenți | cele 52 de pagini de clasă/secțiune: promit ce livrează? cifrele afișate sunt adevărate (numărate, nu crezute)? |
| **Sinteză** | 13 + 1 agenți (Opus) | raport per secțiune, apoi raportul final |

**De ce Sonnet la citit și Opus la verificat:** citirea e volum (121 × ~25.000 de cuvinte), judecata de „chiar e o greșeală?" e cea care trebuie să fie bună. Găsire ieftină + verificare scumpă.

## Materialele pregătite înainte

- `tools\lesson_digest.py` (**nou, rămâne în repo**) — scoate substanța unei lecții: titlu, obiectiv, atomi, chestionare cu răspunsul corect și indiciul, exerciții, plus cifrele structurale. Fără el, fiecare agent ar căra HTML brut.
- **235 de capturi** din browser (1280px), câte una per lot + una per modul, în scratchpad-ul sesiunii `\shots\`. Astea acoperă cerința „verifică și vizual".

## Ce NU acoperă proba asta

- Chestionarele tăcute (416 pagini fără container) — știute deja, excluse din raportare ca să nu îngroape restul.
- Randarea mecanică (erori JS, linkuri, imagini) — făcută separat, cu crawler-ul peste toate cele 852 de pagini.
- Lipsa diacriticelor — deliberată pe tot situl, exclusă.
