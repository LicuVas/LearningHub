# Raportul de dimineață — tura 05→06.10.2026

**Ce ai cerut (05.10, 22:53):** să implementez ce merita din newsletterul Claude Code; să văd cum folosim Fable când e nevoie; să gestionez mai bine precizia față de consum („E nasol când rămân fără consum”); proba reală: modulul 2 la clasa a VIII-a pe LearningHub, cu aceeași rigoare.

**Pe scurt:** VIII M2 e gata și live, 8 lecții din 8. Am aflat unde se duce consumul: în contextul lung pe care îl cară un agent, nu în alegerea modelului. Regulile noi sunt scrise și puse în unelte. N-am rămas fără consum: fereastra de 5 ore a ajuns o dată la 66% (02:48), am oprit agenții noi până la resetare, iar săptămâna e acum la 17%.

---

## FĂCUT (cu dovada văzută acum)

**1. VIII modulul 2 — live, 8/8.**
- Lecțiile 10-15, publicate în noaptea asta: 10 Sortarea · 11 Grafice · 12 Mini-proiect · 13 Evaluare sumativă · 14 Pagina web și editorul · 15 Antet, titlu, corp. Commituri: `4f03292c` (10), `53f6c206` (14+15), `4ce294e1` (11+13), `6bc0a141` (12).
- Dovada: `stare.py --modul M2` arată VIII de la 8 la 15 PUBLICAT, iar fiecare pagină de pe sit are marcajul ei (6/6, citit cu curl la 04:45).
- Rigoarea: fiecare lecție a trecut prin 2-3 judecăți independente până la 0 GRAV / 0 MAJOR. După ultimul verdict s-au mai schimbat doar 5 fraze de text, măsurate exact și verificate de un judecător separat: 4/4 adevărate (`verificare_post_verdict_06_10.md`).
- Poarta de publicare a refuzat o dată, corect: o frază nouă din VIII/11 folosea „legendă” înainte s-o predea. Am reparat fraza, apoi am publicat.
- În plus: pagina principală (hub) arăta „1 lecție gata” la toate clasele din 27.09. Acum arată 9 / 9 / 9 / 15 (`48c08158`, live). Am reparat și scriptul de publicare, ca hub-ul să se actualizeze singur de acum.

**2. Consumul: ce costă de fapt.**
- Am refăcut socotelile pe 1.852 de agenți din 14 zile, cu prețurile de azi pe modelul exact (`tools\agent_cost.py`). Înainte, scriptul socotea totul la prețul vechi Opus 4 și de aici ieșea „sonnet e de 5 ori mai ieftin”.
- **Turele în care agentul cară peste 200.000 de jetoane de context = 63-66% din tot consumul.** Sonnet e doar de ~1,5 ori mai ieftin decât Opus, nu de 5 ori.
- Ce fac de acum (`SECRETARY_V3\docs\precizie_vs_consum.md`):
  - peste ~200.000 de context pornesc un agent NOU, cu o notă de predare, în loc să-l continui pe cel vechi;
  - pentru munca mecanică folosesc agentul nou `mecanic`: o reparație mică a costat 21.000-66.000 de jetoane, față de 300.000+ la un judecător;
  - ieșirile lungi din Bash merg pe disc.
- **Bara de consum** (mod-ul `secretar`): deasupra locului unde scrii apar contextul, fereastra de 5 ore, săptămâna și costul. `python tools\consum.py` îți spune VERDE / GALBEN / ROȘU și ce să pornești.

**3. Fable — când și cum.**
- **Consultant pe o decizie grea: merge.** L-am întrebat o dată (2 minute, 80.000 de jetoane) unde e pârghia de economie. A răspuns „aria de context”, iar eu am verificat pe date că are dreptate. A rămas agentul `gandire-adanca`: Fable, primește un brief precis și are voie doar să citească.
- **Judecător de lecții: nu merge.** Am pus aceeași lecție (VIII/10) la trei judecători deodată:
  - Opus: $12, 9 probleme găsite;
  - **Fable: $35, 8 probleme;**
  - Sonnet: $10, 12 probleme, inclusiv toate cele 3 grave.
- Decizia aplicată: prima judecată se face cu doi judecători, Opus + Sonnet. Fable rămâne pentru decizii, nu pentru bucle lungi cu unelte. Raportul complet, reproductibil: `AI_0\docs\rapoarte\consum_2026-10-05\ab_judecatori_viii10.md`.

**4. Ce am luat din newsletter.**
- **Mod-ul `secretar`** (bara de consum, `/consum`, `/verificari`): validat, 6/6 teste. Îl vezi de la sesiunea următoare.
- **Verificarea instrucțiunilor** după modelele noi (prompt-audit): am aplicat doar schimbările sigure (`1455a173`, `3cf4396a`). Antetul din CLAUDE.md spune acum Opus 5.5. Restul așteaptă decizia ta, mai jos.
- **Mementouri în Google Calendar:**
  - `/claim-credit` — azi, 09:00;
  - re-măsurarea consumului — 19.10, 19:05;
  - resetarea limitelor — 20.10, 09:00.

**5. Reparat pe drum (sistem).**
- **Închiderea fiecărei sesiuni era oprită de paznic** (111 opriri din 22.09). Cauza: o coadă de audit de 59 MB și o căutare fără index în baza de date. Acum coada se golește pe loturi, indexul se creează singur, iar salvarea git rulează separat (dura ~95 s).
- Toate cele 25 de hook-uri au paznic. Registrul de unelte e complet: 333/333.

---

## NEFĂCUT (blocat de ceva din afară)

- **Numele contului Windows a rămas în istoria publică de pe GitHub.** E în două commituri din 28.09 (`a80f1f6c`, `1b1dc2ac`). Scoaterea lui înseamnă rescrierea istoriei, ireversibilă, așa că decizia e a ta. Noaptea asta n-a adăugat nimic nou acolo.

## NESIGUR

- **Dacă abonamentul cântărește jetoanele ca prețul API**, inclusiv cititul ieftin din cache. Toate economiile de mai sus presupun asta. Se verifică pe 19.10 (memento), comparând procentul din `consum.py` cu dolarii socotiți pe aceeași zi.
- **A/B-ul judecătorilor e pe o singură lecție.** Decizia „Opus + Sonnet” e bună de pornit, dar o confirm pe încă o lecție.

---

## De decis de tine (câte un rând fiecare)

1. **Literele părților la evaluare.** `REGULA_NOUA.md` §1 zice A = 40 / B = 30 / C = 20. `SISTEM_EVALUARE` (01.10) și lecțiile folosesc C = De bază 40, B = Consolidat 30, A = Avansat 20. Care rămâne?
2. **Efortul sesiunii principale:** acum e pe `xhigh` (setarea ta). Propun o zi de probă pe `high`, ca să comparăm consumul.
3. **Schimbările de instrucțiuni nesigure** din prompt-audit:
   - CLAUDE.md, 5 puncte (M1-M7): scos istoricul, împăcat „Function-First” cu fațadele etc.;
   - skill-uri: ștergerea șabloanelor din `api.md` (−28 KB), descrieri mai scurte la `/contract` și `/lectii`.
   - Le găsești în `AI_0\docs\rapoarte\prompt_audit_2026-10-05\`, la secțiunile „DE DECIS”.
4. **Proba de o zi cu „You should know”** (agentul nou care citește în paralel). Acum e oprit, pentru că nu se știe cât consumă. Pașii sunt în `precizie_vs_consum.md` §5b.
5. **Rescrierea istoriei GitHub** pentru numele contului (vezi NEFĂCUT).

## De știut (incidente, toate închise)

- Un agent-autor (VIII/14) a suprascris, la restaurare, **22 de valori comune din registry**: contoare, poziția unei ferestre Explorer, sortarea unui dosar. Le-am lăsat așa cum erau înainte de probă, fără să mai ating chei comune. Nimic vizibil pentru tine.
- Un judecător a lăsat **6 fișiere goale de probă** în `C:\00\AI_0`. Le-am șters.
- Un commit de sistem (`c49cbe98`) descria o reparație care încă nu era aplicată. Am aplicat-o și am corectat cinstit în commitul următor (`b295650d`).
- **Verificarea independentă de la final** (agenți care pun întrebările din cererea ta și caută dovezile pe disc) a prins 4 lucruri spuse de mine fără acoperire deplină. Le-am reparat pe toate; rezultatul ultimei reverificări e mai jos.

## Ce urmează la LearningHub

- **Modulul 2, lecțiile 10-15 la clasele V, VI, VII:** evaluările sumative, Internet și e-mail, audio-video. Reiei cu `/lectii`.
- **Deschise de reparat:**
  - VI/4, VI/5, VII/5 (publicate) dau o alarmă la verificarea automată, din alte cauze;
  - trei reparații în componenta comună: atingerea pierdută după tragere, „Pașii amestecați”, panglica graficului.
- Lista completă: `08_RELUARE.md` §9.
