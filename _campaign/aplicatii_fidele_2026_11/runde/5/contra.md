# Runda 5 · etapa B · Word · CONTRA (pasul 4)

**Planul:** în `word.js`: (1) Enter pe un rând de listă pune `activat` = ținta rândului; (2) fereastra Open din
`dialog.open` (Browse și Ctrl+F12), cu rândurile listei = fișierele din conținut ale folderului curent și rânduri în
panoul din stânga pentru folderele din conținut; (3) Ctrl+N / Blank document fac documentul nou, restul comenzilor fără
document dau mesajul central; (4) F12 pe document salvat propune numele fișierului; (5) numele existent → mesajul
central, fără înlocuire; (6) PDF → fereastra se redesenează din `dialog.FileSaveAs_pdf`, cu tastele ei de acces.

**Cel mai puternic argument PENTRU:** fiecare GRAV are dovadă de gest (criticul, `runde/4/critic_probe/*.json`) și cauză la
rând de cod; cinci din șase reparații au referință înghețată exactă (dump-ul `dialog.open`, `dialog.FileSaveAs_pdf`,
`fapte.d_ctrl_f12`, citirea COM a criticului pentru F12, contractul §4/§6.3 pentru `activat`). Toate stau într-un singur
fișier (`word.js`), deci `git restore` le dă înapoi dintr-o mișcare.

**Cel mai puternic ÎMPOTRIVĂ:** fereastra Open și rândurile „Descărcări” / „Documente” din panoul stâng nu au poziție în
referință, iar rândurile listei sunt redactate: desenez locul lor (ca AC-6) și risc să învăț elevul un panou care pe PC-ul
din laborator arată altfel. La fel, „already exists” ca mesaj central nu e fereastra reală: elevul nu învață butonul
„Cancel” al întrebării, doar că Word nu înlocuiește în tăcere.

**Adevărul incomod (punctul cel mai puțin sigur):** temeiul pentru „Descărcări” e o listă de nume din scriptul de captură
(`acoperire_word_r3.py:57`), nu un dump: pe PC-ul lui Vasile panoul nu avea „Descărcări” pe primele două niveluri
(`fapte.nav_dialog.FileSaveAs.implicite` = Desktop › Acasă, Galerie, Acest PC, Rețea + 19 personale). Dacă în laborator
„Descărcări” stă sub „Acest PC” sau sub „Acasă”, rândul meu e în alt loc decât în realitate.

**Hotărârea (după ele):** fac toate șase. Rândurile de foldere apar DOAR pentru folderele care există în conținutul lecției
(nu inventez un panou întreg), după elementele implicite din referință, și intră în `de_verificat.md` (AC-6 lărgit) cu
scenariul care le-ar lămuri; „already exists” = mesaj central + rând în `de_verificat.md`. Fără ele, exercițiile :240,
:262 și :167 rămân imposibile sau distructive, ceea ce e mai rău decât un rând pus la 24 px de locul real.
