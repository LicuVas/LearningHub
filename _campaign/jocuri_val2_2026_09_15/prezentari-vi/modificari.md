# Modificări în `jocuri\prezentari-vi\index.html` (15.09.2026)

Poarta după reparații: `python C:\00\Projects\LearningHub\jocuri\_motor\test_joc.py prezentari-vi` → `[TRECUT] prezentari-vi · întrebări jucate: 68 · diacritice/1000: 62.2`, fără avertismente.

## M1 — S01: scurtăturile din N2 nu sunt „în orice aplicație”

**Înainte:**
> Operațiile de gestionare sunt aceleași în orice aplicație: creare (Ctrl+N), deschidere (Ctrl+O), salvare (Ctrl+S), salvare ca… (sub alt nume sau în alt format) și închidere.
> Salvează des, nu doar la final. Ce nu ai salvat se pierde dacă se oprește calculatorul.

**După:**
> Operațiile de gestionare sunt aceleași în orice aplicație: creare, deschidere, salvare, salvare ca… (sub alt nume sau în alt format) și închidere. În PowerPoint, scurtăturile sunt Ctrl+N (nou), Ctrl+O (deschide) și Ctrl+S (salvează).
> Salvează des, nu doar la final. Ce nu ai salvat se pierde dacă se oprește calculatorul. Google Slides e o excepție: salvează singur, în Drive.

**De ce:** N1 îi spune copilului că Google Slides are aceleași operații. În Google Slides salvarea e automată și Ctrl+N nu face o prezentare nouă.
**Dovada:** Google (curl, ro): „Salvează Fiecare modificare este salvată automat în Drive Ctrl + s”, iar „Ctrl + N” nu apare deloc. Microsoft ro-ro: „Creați o nouă prezentare. Ctrl+N”, „Deschideți o prezentare. Ctrl+O”, „Salvați prezentarea. Ctrl+S”. Textele sunt salvate în `sursa_google_slides_scurtaturi.txt` și `sursa_ms_scurtaturi_ro.txt`.

## M2 — S02: vânătoarea din N7 avea mai mult de 4 greșeli

**Înainte:** `Diapozitivul 1: [[fără titlu|…]], doar o poză cu o tablă de șah. Diapozitivul 2: regulile, scrise în [[trei paragrafe lungi|…]]. Diapozitivul 3: piesele, cu câte o imagine. La fiecare diapozitiv, [[altă tranziție și un sunet|…]]. Ultimul diapozitiv: „Mulțumesc!”, [[fără surse|…]].`

**După:** `Diapozitivul 1: [[fără titlu|…]], doar o poză cu o tablă de șah. Diapozitivul 2: cuprinsul. Diapozitivul 3: regulile, scrise în [[trei paragrafe lungi|…]]. Diapozitivul 4: piesele, cu câte o imagine. La fiecare diapozitiv, [[altă tranziție și un sunet|…]]. Ultimul diapozitiv: concluzia și „Mulțumesc!”, [[fără surse|…]].`

**De ce:** N3 predă structura titlu → cuprins → conținut → concluzie → surse. Planul vechi nu avea cuprins și nici concluzie. Un copil care aplica N3 și marca aceste lipsuri era penalizat: `motor.js`, r. 245, numără orice marcaj din afara celor 4 ca „marcaj pe text corect”. Acum sunt exact 4 greșeli. Fragmentele-cheie și explicațiile au rămas neschimbate.
**Dovada:** N3 Î2 (`order`) și codul motorului, r. 245. Poarta a jucat din nou întrebarea și a acceptat rezolvarea.

## M3 — S03: why-ul de la mânere (N4 Î1)

**Înainte:** „Mânerul din mijlocul laturii schimbă doar lățimea.”
**După:** „Mânerul din mijlocul laturii din dreapta schimbă doar lățimea.”
**De ce:** Mânerele de sus și de jos schimbă înălțimea, deci generalizarea era falsă. Întrebarea vorbește chiar de latura din dreapta.
**Dovada:** textul întrebării („mânerul din mijlocul laturii din dreapta”).
