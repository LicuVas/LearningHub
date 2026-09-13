# 04 — Norma din afara documentului (U16)

## Diacritice
- Măsurat pe `innerText.txt` cu funcția porții: **0,1 la 1000 de litere**. În toată lecția apar exact două cuvinte cu diacritice: „Frecă” (ă, U+0103) și „rotunjiți” (ț cu virgulă, U+021B — forma corectă). Restul: „Ergonomie si Sanatate”, „Pozitia corecta”, „Incheieturi”. Text românesc normal ≈ 40-60 (control în `D_pilot`: 52,3).
- ş/ţ cu sedilă: 0.
- `LESSON_SPECIFICATION.md:401`: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; checklist :751 „Romanian text with proper diacritics”. Lecția nu respectă norma proiectului — **a patra lecție la rând** din cls5 (0,2 / 0,0 / 0,0 / 0,1).
- Greșeală de limbă în afara diacriticelor: „**Sta** pe scaun” (imperativ corect: „Stai pe scaun”); „in departen” (greșeală de tipar, pasul 3).

## Programa (OMEN 3393/2017, `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`)
- Clasa a V-a, domeniul **„Norme de ergonomie și de siguranță”**: „Normele de securitate și protecție a muncii în laboratorul de informatică” și „Poziția corectă a corpului la stația de lucru”.
- CS.1.1 „Utilizarea eficientă şi în condiţii de siguranţă a dispozitivelor de calcul”, activitatea: „exersarea utilizării corecte a unui calculator sau a unor dispozitive mobile (tabletă, telefon, consolă, laptop), cu evidenţierea efectelor asupra stării de sănătate și a pericolelor ce pot apărea în cazul unei utilizări incorecte”.
- Lecția acoperă bine „poziția corectă” și „efectele asupra sănătății”; **nu** acoperă normele de securitate din laborator (curent electric, cabluri, lichide) — acelea sunt în `lectia5-reguli.html`. Ora 2 din plan le cere pe amândouă.
- Programa pomenește și telefonul, tableta, consola — lecția vorbește doar de monitor de birou (nu de telefon ținut în mână, nici de laptop), deși copiii de 11 ani folosesc mai ales telefonul.

## Norma specialistului (ergonomist / medicina muncii), pe surse de azi, text brut
| Afirmația lecției | Sursa | Verdict |
|:--|:--|:--|
| „20 de pasi distanta (aproximativ 6 metri)” (5 locuri, inclusiv varianta corectă a chestionarului) | CCOHS: „6 metres (20 feet)” | **greșit** — feet = picioare (unitate), nu pași |
| Reminder-e 20-20-20 la 15:00/17:00/19:00 | regula însăși: la fiecare 20 min | **contradicție internă** |
| Monitor 50-70 cm, lungimea brațului, la nivelul ochilor sau puțin mai jos | AAO: „about 25 inches (right about at arm's length)”, privirea „slightly downward”; CCOHS: arm's length, cu ajustări | corect |
| Coate 90°, genunchi 90°, „spate drept, lipit de spatar” ca singura poziție | OSHA: coate 90-120°, 4 posturi neutre, inclusiv spătar înclinat 105-120° | **simplificat până la rigid** — acceptabil pentru a V-a dacă scrie „aproximativ” |
| Pauze 2-3 min la 45-60 min | HG 1028/2006 art. 8: „intrerupta periodic prin pauze sau schimbari de activitate” (fără cifră); CCOHS stretching | fără sursă, dar rezonabil; nu e normă legală |
| „Dupa 2 ore: dureri de gat si spate garantate!”, „va fi sanatos toata viata”, „Coloana deformata” | AAO: ecranul **nu** strică permanent ochii („Thankfully, this is not true”) | **exagerat** — sperie în loc să explice; un medic de medicina muncii nu scrie „garantat” |
| „Elevii petrec in medie 4-6 ore pe zi la calculator”, „Astazi stam 8+ ore pe zi” | nicio sursă în lecție | cifre nesursate (R3.4 / fact-checker) |
| Clipitul, luminozitatea, reflexiile | AAO: „we only blink about 5 to 7 times in a minute while using computers” | corect ca idee |
| Aplicația Stretchly | hovancik.net/stretchly: „cross-platform open source app” | există, corect |
