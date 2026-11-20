# Runda 18 · pasul 4 · CONTRA

Planul: un generator (`_unelte/genereaza_windows.py`) care citește `uia_windows.json` pe chei și scrie `date/windows.json`;
`windows.js` desenează din el desktopul, bara, Start, meniurile (citirea (B) din cadru.md): configurația din referință,
valorile de moment din starea simulatorului; comportamentul cerut de supliment; probă pe poligon la 1366×768 și 1536×864.

**Cel mai puternic argument PENTRU.** Azi Windows nu există în bibliotecă: fiecare din cele 4 suprafețe cu referință e
„suprafață lipsă” (536 de puncte O3 doar pe ele), toate cele 18 gesturi O5 și cele 8 cazuri O9 ale lui Windows pică la
„deschide a eșuat”. Un Windows generat din referință, cu țintele din api §3 (`bara_activitati:Start`, `desktop:…`,
`meniu:…`), deblochează și lecțiile din etapa C (9 lecții folosesc Start). Generarea din date (nu etichete scrise de mână)
e exact ce cere R1-R3: o schimbare în referință → rulezi generatorul → apare peste tot.

**Cel mai puternic argument ÎMPOTRIVĂ.** Referința e calculatorul profesorului: copiind fidel configurația lui (dalele
„Agent Ransack”, „Epson Scan 2”, folderele lui din Start; Dropbox / PDF24 / „Open Git Bash here” în meniuri; To Do și
Notepad++ fixate), elevul învață un Windows pe care nu-l va vedea în laborator. Iar O3 la 1366×768 nu poate ajunge la 0
(pozițiile sunt ale unui ecran de 1536 px), deci „puncte mai puține” nu va însemna „mai fidel” pe tot.

**Adevărul incomod (punctul cel mai puțin sigur).** Textul de pe ecran al elementelor cu nume compus (dalele-folder, vremea,
ceasul, tava) nu e în referință: UI Automation dă numele accesibil, nu ce se vede. Orice aleg să arăt acolo e o deducție
— fie arăt numele întreg (O3 mulțumit, ecranul fals: „Browser, Folder cu elemente 6” sub o dală), fie textul pe care cred
că-l arată Windows-ul („Browser”; O3 numără `eticheta`/`lipsa`). Nici una nu e dovedită.

**Hotărârea (după cele de mai sus).**
- Merg pe planul generat, citirea (B).
- La numele compuse arăt pe ecran DOAR ce dovedește referința: textul copiilor `Text` din captură (vremea „13°C” / „Mostly
  cloudy”, „Căutare” din caseta barei); unde referința n-are copil `Text`, arăt numele întreg, așa cum e în captură
  (dalele) — nu inventez o tăiere „Browser”; unde referința are copii `Button` (categoriile din „Toate”: Google Chrome,
  Explorer, Excel), arăt pictogramele lor, iar numele categoriei rămâne în etichetă. Excepție: ceasul (viu) — diferența numărată și
  trecută în `de_aprobat.md`. Ce rămâne nesigur pe ecran (dala-folder arată doar numele?) intră în `de_verificat.md`.
- Configurația profesorului rămâne (decizia (a), r15); cele 4 butoane „deschise” NU se desenează din referință (sunt
  stare): le dau numai ferestrele din `ferestre`. Numărul lor de puncte îl scriu separat.
- Raportez O3 la ambele ferestre și spun cât din rest e geometrie (ecran mai îngust), cât e alegere, cât e lipsă reală.
