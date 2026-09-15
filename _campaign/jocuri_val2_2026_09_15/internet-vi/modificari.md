# Modificări în `jocuri\internet-vi\index.html` — evaluare independentă 15.09.2026

Copia dinainte: `index.html.inainte_evaluare` (în acest folder). 4 schimbări, doar în configurația jocului.
După reparații: `python C:\00\Projects\LearningHub\jocuri\_motor\test_joc.py internet-vi` → `[TRECUT] internet-vi · întrebări jucate: 60 · diacritice/1000: 68.2`.

## M1 (S01) — Lungimea parolei, nivelul 2
- **Înainte:** „O parolă puternică e lungă (cel puțin 8 caractere) și amestecă…”
- **După:** „O parolă puternică e lungă (cel puțin 15 caractere) și amestecă…”
- **De ce:** sfatul era sub recomandarea oficială actuală.
- **Dovada:** DNSC, PDF „Ce fac dacă mi-a fost compromis un cont online” (text brut în `surse\dnsc_cont_compromis_wb.txt`): „o parolă puternică, compusă din cel puțin 15 caractere, care trebuie să cuprindă litere majuscule și minuscule, numere și simboluri”. CISA: „At least 16 characters”. Varianta corectă de la Q2 (`Cires3!Albastru#9`) are 17 caractere, deci cheia rămâne valabilă.
- **Rămâne:** lecția 1 LearningHub zice încă 8 (S06, pentru profesor).

## M2 (S02) — Regula redirecționării, nivelul 4
- **Înainte:** „Mesajele altora nu le dai mai departe fără acordul lor.”
- **După:** „Mesajele personale ale altora nu le dai mai departe fără acordul lor.”
- **De ce:** pagina contrazicea întrebarea classify din același nivel, unde redirecționarea anunțului dirigintei și al profesorului e răspunsul corect.
- **Dovada:** itemii „Îi trimiți mamei mesajul cu programul excursiei…” și „Îi dai unui coleg care a lipsit anunțul…” au cheia Redirecționează; Q5 și lecția 2 vorbesc despre mesaje personale.

## M3 (S03) — Amenințarea din mesajul-capcană, nivelul final
- **Înainte:** `contul tău va fi [[închis în 24 de ore.|amenințarea…]]`
- **După:** `[[contul tău va fi închis în 24 de ore.|amenințarea…]]`
- **De ce:** cuvintele „contul tău va fi” fac parte din amenințare, dar erau „text corect”, deci un copil atent era penalizat.
- **Dovada:** Playwright pe iPhone SE și Pixel 7, înainte: 7 marcaje corecte + „fi” → „Ai găsit 7 din 7, iar 1 marcaj e pe text corect.” (`joc_log_inainte.txt`). După: propoziția întreagă e un singur fragment și este acceptată (`joc_log_dupa.txt`). Why-ul („șapte semne”) rămâne adevărat.

## M4 (S04) — Why-ul despre .exe, nivelul 1
- **Înainte:** „…iar un .exe e periculos pentru că pornește singur când îl deschizi.”
- **După:** „…iar un .exe primit de la un necunoscut e periculos pentru că pornește imediat ce îl deschizi.”
- **De ce:** textul contrazicea pagina, care spune că programul pornește când îl deschizi, nu singur. În plus, spunea că orice program e periculos, deși la Q3 instalarea cu un adult e „Sigur”.
- **Dovada:** pagina N1: „Un fișier .exe este un program: dacă îl deschizi, pornește.”
