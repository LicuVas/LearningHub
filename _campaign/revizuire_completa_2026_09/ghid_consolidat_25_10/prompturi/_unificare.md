# Unificare: o fișă curată pe un grup de teme, din cele 10 extrageri

Construim UN ghid consolidat al lecțiilor LearningHub (campania /lectii/, 27.09 → 25.10.2026). Zece agenți au extras puncte din toate sursele, în `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\ghid_consolidat_25_10\extrase\*.md` (format: `- [CATEGORIE] text — sursa: … — stare: …`; fiecare fișier are în antet legenda prescurtărilor de cale). Tu primești câteva CATEGORII și scrii fișa lor unificată, din care dirijorul scrie ghidul.

**Ce faci:**
1. Aduni TOATE punctele categoriilor tale din toate cele 10 fișiere (`grep -n "\[CATEGORIE\]"`; atenție la greșeli de tipar în etichete, ex. `[IIMAGINI]`). Citești și legenda de căi a fiecărui fișier.
2. Grupezi pe subiecte (de ex. la APLICATIE_REALA: Excel, Word, PowerPoint, Paint, Scratch, Google, Gmail, browser, Explorer, Clipchamp, Audacity, editorul web, Windows/tastatură; la TEST: oracole, mesaje, „rezultat nu drum”…). Alegi tu subiectele, ca să fie ușor de găsit.
3. **Unești dublurile** într-o singură regulă, cu toate sursele ei (prescurtate). **Cea mai nouă sursă câștigă**: dacă o regulă a fost înlocuită, scrii doar varianta nouă și, scurt, „(înlocuiește: …, data)”. Ce e „depășit” nu intră în regulile active; îl treci la sfârșit, în „Depășite” (un rând fiecare), ca să se știe că a fost văzut.
4. **Contradicții** între surse care nu se lămuresc prin dată: le scrii explicit în secțiunea „Contradicții”, cu ambele surse.
5. Formularea: o regulă = 1-3 propoziții, în română simplă, cu diacritice, la imperativ sau la prezent („Pe telefon, orice țintă are cel puțin 32 px.”). Păstrezi exact cifrele, numele butoanelor (RO + EN), căile de unelte, citatele lui Vasile. Fiecare regulă se termină cu `[surse: …]` (fișier:linie prescurtat, 1-4 trimiteri; cea mai bună întâi).
6. Faptele despre aplicațiile reale: păstrezi și CUM s-au probat (aplicația reală / simulator / documentație / NESIGUR). Un fapt neprobat rămâne marcat „nesigur”.
7. Nimic inventat. Nimic despre conținutul de materie al unei lecții. Fără date personale (nume de elevi, contul Windows, e-mail, telefon — scrii „[nume]”).

**Formatul fișierului tău** (Markdown): `# <grupul>` → pe fiecare categorie `## <CATEGORIE>` → `### <subiect>` → listă de reguli. La sfârșit: `## Contradicții`, `## Depășite`, `## Numărătoare` (câte puncte ai citit pe categorie, câte reguli unificate ai scris).

**Mărimea:** cât e nevoie ca nimic să nu se piardă, dar fără repetiții — de obicei 15.000-35.000 de caractere pe fișă. Nu modifici nimic în afara fișierului tău. Căi absolute în Bash, fără `cd`. Fișierul îl scrii cu Write (pe bucăți, dacă e lung: Write pe `_tmp` și unești la final).

Răspunsul final (scurt): calea fișierei, câte puncte citite / câte reguli scrise pe categorie, contradicțiile găsite.
