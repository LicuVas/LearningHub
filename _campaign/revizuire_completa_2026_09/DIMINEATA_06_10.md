# Raportul de dimineață — tura 05→06.10.2026 (scris la 06:52)

**Ce ai cerut (05.10, 22:53):**
- să implementez ce merita din newsletterul Claude Code;
- să văd cum folosim Fable când e nevoie;
- să gestionez mai bine precizia față de consum („E nasol când rămân fără consum”);
- proba reală: modulul 2 la clasa a VIII-a pe LearningHub, cu aceeași rigoare.

**Pe scurt:**
- VIII M2 e gata și live, 8 lecții din 8.
- Am aflat unde se duce consumul: în contextul lung pe care îl cară un agent, nu în alegerea modelului. Regulile noi sunt scrise și puse în unelte.
- N-am rămas fără consum. Fereastra de 5 ore a ajuns o dată la 66% (02:48), am oprit agenții noi până la resetare, iar săptămâna e acum la 19%.
- Spre dimineață, verificarea independentă m-a prins că scurtasem un pas din lanțul de calitate. L-am refăcut cum era. Așa a ieșit la iveală o greșeală reală în VIII/15, pe care primii trei judecători n-o văzuseră; acum e reparată și republicată.

---

## Contractul nopții, punct cu punct

**R1 — VIII/10-15 publicate live, prin lanțul campaniei: FĂCUT.**
- Lecțiile:
  - 10 — Sortarea;
  - 11 — Grafice;
  - 12 — Mini-proiect;
  - 13 — Evaluare sumativă;
  - 14 — Pagina web și editorul;
  - 15 — Antet, titlu, corp.
- Dovezile, citite la 06:55:
  - `stare.py --modul M2` arată VIII de la 8 la 15 PUBLICAT;
  - fiecare pagină de pe sit are marcajul ei (6 din 6);
  - scriptul de publicare a confirmat de fiecare dată că pagina de pe sit e identică cu fișierul comis.
- Commituri: `4f03292c` (10) · `53f6c206` (14+15) · `4ce294e1` (11+13) · `6bc0a141` (12). Republicate după reparații: `4b4b2165` (11) · `87a7b3d9` (15).
- **Ce s-a întâmplat pe drum (cinstit):**
  - La 11, 13, 14 și 15, ultima judecată, cea scurtă de la sfârșit, o pusesem pe un model mai ieftin (Sonnet). Regula noastră o cere pe Opus.
  - Verificarea independentă de la final (agenți care pun întrebări din cererea ta și caută dovezile pe disc) a prins abaterea. Am refăcut judecata pe Opus.
  - **VIII/15:** Opus a găsit o greșeală gravă ratată de toți trei. La atelier, dacă elevul apăsa F5 în Notepad, în pagină se scriau ora și data, iar elevul primea totuși „Corect!”.
  - **VIII/11:** 4 nepotriviri mici între simulator și ce spune lecția.
  - Le-am reparat. Fiecare simulator schimbat a trecut prin poarta de lansare (un judecător separat care probează toate lecțiile ce-l folosesc). Apoi am republicat.
  - Judecata finală la 15 a ieșit 0 / 0 / 0, cu 181 de verificări din 181.
- **Regula, scrisă acum în trei locuri:** judecata finală rămâne pe Opus.

**R2 — Verificarea instrucțiunilor după modelele noi (prompt-audit): FĂCUT.**
- Am aplicat doar schimbările sigure (`1455a173`, `3cf4396a`). Antetul din CLAUDE.md spune acum Opus 5.5.
- Restul așteaptă decizia ta (mai jos, punctul 3), în `AI_0\docs\rapoarte\prompt_audit_2026-10-05\`.

**R3 — „You should know” (agentul nou care citește în paralel): FĂCUT.**
- Decizia: rămâne oprit. Nicio sursă nu spune cât consumă, iar testul meu fără ecran n-a fost concludent.
- Dacă vrei, ai pașii pentru o zi de probă în `AI_0\SECRETARY_V3\docs\precizie_vs_consum.md` §5b.

**R4 — Bara de consum (mod-ul `secretar`): FĂCUT pe jumătate, restul NESIGUR.**
- **FĂCUT:**
  - verificarea oficială trece, 6 teste din 6;
  - se încarcă în fiecare sesiune nouă și chiar scrie măsurătorile: fișierul `data\consum\ultima_masurare.json` a fost rescris la 05:54 de o sesiune pornită fără ecran;
  - `python tools\consum.py` citește de acolo și spune VERDE / GALBEN / ROȘU.
- **NESIGUR:** n-am văzut cu ochii mei bara desenată deasupra locului unde scrii. Sesiunea mea de noapte a pornit înainte de mod, iar o sesiune fără ecran nu desenează nimic. O vezi la prima sesiune deschisă azi; dacă nu apare, spune-mi.

**R5 — Fable și echilibrul precizie / consum: FĂCUT.**
- **Unde se duce consumul:** am refăcut socotelile pe 1.852 de agenți din 14 zile, cu prețurile de azi. Turele în care un agent cară peste 200.000 de jetoane de context fac 63-66% din tot consumul. Sonnet e doar de ~1,5 ori mai ieftin decât Opus, nu de 5 ori, cum socotea greșit scriptul vechi.
- **Ce fac de acum:**
  - agent nou după ~200.000 de context, cu o notă de predare;
  - pentru munca mecanică, agentul `mecanic`: o reparație mică a costat 21.000-66.000 de jetoane, față de 300.000+ la un judecător;
  - ieșirile lungi merg pe disc.
- **Fable:** e bun ca consultant pe o decizie grea. L-am întrebat o dată (2 minute) și a avut dreptate, verificat pe date. A rămas agentul `gandire-adanca`.
- **Fable ca judecător nu merge.** Pe aceeași lecție, trei judecători deodată:
  - Opus: $12, 9 probleme;
  - **Fable: $35, 8 probleme;**
  - Sonnet: $10, 12 probleme.
- Politica: `AI_0\SECRETARY_V3\docs\precizie_vs_consum.md`. Raportul A/B, reproductibil: `AI_0\docs\rapoarte\consum_2026-10-05\ab_judecatori_viii10.md`.

**R6 — Re-măsurarea Sonnet 5.5: FĂCUT.**
- Cifra de bază de azi e în `AI_0\docs\rapoarte\consum_2026-10-05\`.
- Mementouri în Google Calendar:
  - re-măsurare — 19.10, 19:05;
  - `/claim-credit` — azi, 09:00;
  - resetarea limitelor — 20.10, 09:00.

**R7 — Raportul de dimineață: FĂCUT** (acest fișier).

**În plus (reparat pe drum):**
- **Închiderea fiecărei sesiuni era oprită de paznic** (111 opriri din 22.09). Acum coada de audit se golește pe loturi, iar salvarea în git rulează separat.
- Toate cele 25 de hook-uri au paznic, iar registrul de unelte e complet (333/333).
- Pagina principală LearningHub arăta „1 lecție gata” din 27.09. Acum arată 9 / 9 / 9 / 15 și se actualizează singură.

---

## NEFĂCUT (blocat de ceva din afară)

- **Numele contului Windows a rămas în istoria publică de pe GitHub.** Apare în căi locale, în 8 commituri vechi (13–28.09). Din fișierele de acum l-am scos: ultima apariție, verificat pe sit, e 0. Scoaterea din istorie înseamnă rescrierea istoriei, ireversibilă, deci decizia e a ta. Lista exactă e în `08_RELUARE.md` §9.

## NESIGUR

- **Bara de consum desenată pe ecran** (vezi R4).
- **Dacă abonamentul cântărește jetoanele ca prețul API**, inclusiv cititul ieftin din cache. Economiile de mai sus presupun asta. Se verifică pe 19.10, comparând procentul din `consum.py` cu dolarii socotiți pe aceeași zi.
- **A/B-ul judecătorilor e pe o singură lecție.** Perechea Opus + Sonnet la prima judecată e bună de pornit; o confirm pe încă o lecție.

---

## De decis de tine

1. **Literele părților la evaluare.** `REGULA_NOUA.md` §1 zice A = 40 / B = 30 / C = 20. `SISTEM_EVALUARE` (01.10) și lecțiile folosesc C = De bază 40, B = Consolidat 30, A = Avansat 20. Care rămâne?
2. **Efortul sesiunii principale:** acum e pe `xhigh`. Propun o zi de probă pe `high`, ca să comparăm consumul.
3. **Schimbările de instrucțiuni nesigure** din prompt-audit: 5 puncte în CLAUDE.md și 6 în skill-uri, de exemplu ștergerea șabloanelor din `api.md` (−28 KB). Sunt la secțiunile „DE DECIS”.
4. **Proba de o zi cu „You should know”** (R3).
5. **Rescrierea istoriei GitHub** pentru numele contului (NEFĂCUT).

## De știut (toate închise)

- Un agent-autor (VIII/14) a suprascris, la restaurare, **22 de valori comune din registry**: contoare, poziția unei ferestre Explorer, sortarea unui dosar. Le-am lăsat cum erau înainte de probă, fără să mai ating chei comune. Nimic vizibil pentru tine.
- Un judecător a lăsat 6 fișiere goale de probă în `C:\00\AI_0`. Le-am șters.
- Un commit de sistem (`c49cbe98`) descria o reparație încă neaplicată. Am aplicat-o și am corectat în commitul următor.
- **Excel** a rulat de câteva ori, numai ca proces propriu, pe un desktop ascuns, închis cu Quit. Nu s-a deschis și nu s-a salvat niciun fișier, iar lista Recent din Office are 0 urme. Excel și-a rescris la închidere fișierul de bare de instrumente (`Excel15.xlb`), ca întotdeauna.
- Verificarea independentă de la final a prins **5 lucruri** spuse de mine fără acoperire deplină, inclusiv judecata finală pusă pe Sonnet. Toate sunt reparate. Lecțiile sunt în baza de cunoștințe.

## Ce urmează la LearningHub

- **Modulul 2, lecțiile 10-15 la clasele V, VI, VII:** evaluările sumative, Internet și e-mail, audio-video. Reiei cu `/lectii`.
- **Deschise de reparat:**
  - VI/4, VI/5, VII/5 dau o alarmă la verificarea automată;
  - trei reparații în componenta comună;
  - 3 mici nepotriviri în simulatorul de grafice, pe care lecția nu le cere.
- Lista completă: `08_RELUARE.md` §9.
