# Dimineața 02.11.2026 — ce s-a făcut în tura de noapte (LearningHub, M4)

Cererea ta (01.11, 22:55): „mai avem 43% pentru vreo 12 ore. continua pe learninghub cu lectii.” · apoi (23:20): „e job de noapte. Nu astepta feedback de la mine.”

## FĂCUT — lecții noi, publicate și verificate pe sit (10)

| Lecția | Ce e | Commit |
|---|---|---|
| V/22 | Textul în Paint: felicitarea / afișul (rămăsese de pe 26.10) | `4200f874` |
| V/23 | Evaluare sumativă: editor grafic (probă de antrenament + grila ta de produs) | `882eec71` |
| V/24 | Ce este un algoritm (robotul care face exact ce scrie) | `5a4261b0` |
| V/25 | Proprietățile algoritmilor: claritate, finitudine, generalitate | `2df86874` |
| V/26 | Datele: de intrare, de ieșire, de manevră; constante și variabile (cutiile cu etichetă) | `f2a263e1` |
| V/27 | Expresii: operatori, ordinea operațiilor, adevărat / fals | `882eec71` |
| VI/23 | Comparăm cele trei structuri repetitive | `7c8836e4` |
| VI/24 | Schema logică (blocuri grafice) | `2b8a54b6` |
| VI/25 | Probleme cu repetiție: sume, numărări, cifre (în Scratch, cu variabile) | `f2a263e1` |
| VI/26 | Evaluare sumativă: structuri repetitive (probă de antrenament C / B / A) | `f8bde23e` |

Fiecare a trecut prin 2-5 judecători independenți până la 0 greșeli grave și 0 mari, apoi prin toate porțile de publicare (conținutul de pe sit = fișierul comis, proba pe telefon 390 px și pe calculator 1280 px fără erori). Modulul 4 la a V-a e complet (22-27); la a VI-a, 22-26 (rămân 27-29, animația). În M4: 15 lecții publicate la toate clasele, 0 în lucru.

**Dovada:** `python C:/00/Projects/LearningHub/_campaign/revizuire_completa_2026_09/dirijor/stare.py --modul M4` · sau deschide `learninghub-8z6.pages.dev/lectii/v/` și `/lectii/vi/`.

## NEFĂCUT

- **VII/24+ și VIII/24+ (13 lecții)** — n-am pornit nimic: activitățile tale cer un program scris și rulat, iar limbajul îl alegi tu. **Deblocare: un cuvânt — C++ sau Python?** (VIII/1 pomenește deja C++ la o întrebare.)
- **VI/27+ (animația)** — n-am pornit: nu știu ce aplicație de animație vrei la a VI-a.

## NESIGUR (de verificat la clasă sau în laborator)

- **Paint, Calculator** — nu se pornesc noaptea (aplicații din Magazin). Faptele despre ele vin din lecțiile publicate și din documentația Microsoft; cele neprobate sunt scrise prudent („dacă te întreabă…”) și niciun punct nu se sprijină pe ele. Exemplu: în Calculator, „2 + 3 × 4 =” dă 20 în modul Standard și 14 în Științific — pagina le spune pe amândouă.
- **Durata** — mai multe lecții sunt la 48-50 de minute după socoteala judecătorilor (V/23, V/26, VI/23, VI/25): de cronometrat la prima oră.
- **Telefonul** — atingerile sunt probate în emulator, nu pe un telefon adevărat.

## Am hotărât singur (le poți schimba)

1. **V/23:** proba se notează pe C / B / A (testul tău V-U4 nu există pe disc); grila ta de produs e copiată întocmai, ca elevul să se autoverifice. Întrebarea „cum notezi tu proba adevărată” e în `surse.md` al lecției.
2. **V/24 / V/25:** am folosit cuvântul „executant” (nu e în programă, nici în manuale) și am aliniat cele două lecții: când robotul e oprit, o spune PAGINA, nu robotul.
3. **VI/24:** laboratorul e în Scratch, nu în PowerPoint (textul în formă nu s-a predat la VI/2-10).
4. **VI/25:** variabilele în Scratch se predau aici (VI/18-22 nu le predaseră); cifra se scoate cu `n ← n − c`, apoi `n ← n / 10` (ca la VI/17), nu cu „partea întreagă din”.
5. **VI/26:** testul unității VI-U3 nu există → probă de antrenament C / B / A.
6. **Valul C (V/27)** l-am pornit la 05:20 pe bugetul rămas, cu grijă să-ți rămână cel puțin 10 % pentru dimineața de la școală.

## Pentru componentele comune (de reparat altă dată, de proprietarii lor)

- `prezenta.js`: pe telefon, fereastra „Cine ești” se strânge la prima atingere și prima apăsare pe un buton se poate pierde.
- `scratch.js`: la 390 px căsuța numerelor din blocuri are 21,8 px (sub 32); zona de cod e îngustă (133 px).
- `paint-text.js`: la 390 px, o atingere pe „Verifică” imediat după deschiderea casetei de text se poate pierde (nu costă puncte).

## Ce s-a întâmplat pe drum

- 23:08 — 6 autori; 02:19 — încă 2 (V/26, VI/26); 05:20 — încă 1 (V/27). Peste 60 de agenți în toată noaptea.
- Autorul VI/24 s-a agățat 95 de minute (00:12-01:48) → oprit, a terminat un autor proaspăt.
- 07:20-08:05 — doi agenți opriți de „stream watchdog” (nu era limita) → reporniți proaspeți.
- 09:0x — publicarea V/27 a căzut o dată la construirea sitului (o lecție veche, VII/3, a picat sub încărcare; singură trece) → republicată la 09:16, fără probleme.
- 10:0x — VI/26: „test_joc” a picat o dată cu pagina nepornită (încărcare), la a doua rulare a trecut; judecătorul a prins o unealtă de-a mea cu numele contului Windows în cale → scoasă din depozit înainte de publicare (date personale 0).
- Bugetul: 58 % la 22:56 → 80 % la 10:10 (resetarea la ~11:00); ți-a rămas marjă pentru dimineață.
- Panoul tău de activitate: 0 elevi falși intrați din probe (la fel ca la pornire); date personale în depozit: 0.
