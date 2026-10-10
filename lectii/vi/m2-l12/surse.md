# Surse — lecția VI · M2 · 12: „Protecția datelor personale. Parole și identitate virtuală”

Autor: tura de noapte 10→11.10.2026 (profesorul dormea: deciziile de mai jos sunt luate după documente, cu motivul scris).
Starea lucrului, variantele respinse: `_proba/stare_autor.md`.

## 1. Ancora în documentele profesorului

| Ce | De unde | Ce am luat |
|---|---|---|
| Titlul, nr. 12, M2, predare | `Info_Gimnaziu_2026\planificari\Calendar_ore_6A_6M.md` (Brauner, 04.12.2026) | titlul exact. `Calendar_ore_VI.md` (Izvoare) o are ca nr. 11 (24.11.2026), după comasarea orei 9; lucrez pe nr. 12, ca `lectii\plan.json` și cheia `lectie_vi_m2_l12` |
| Unitatea | `Info_Gimnaziu_2026\data\unitati.json`, VI-U2 „Comunic prin Internet, în siguranță”, CS.1.3 | unitatea, competența |
| Conținutul | `AI_0\data\informatica_gimnaziu\curriculum.json`, clasa a VI-a, domeniul Internet | „Protecția datelor personale în comunicarea prin Internet(de exemplu, construcția și protejarea parolelor, identitatea virtuală)” — copiat exact, fără spațiu înainte de paranteză, ca în fișier |
| Activitatea de învățare | același fișier, CS.1.3 | „identificarea unor bune practici pentru protecția împotriva furtului de identitate în mediul virtual” |
| Activitatea profesorului | `Info_Gimnaziu_2026\data\activitati_lectii_V_VI.json`, VI/12 | „Elevii evaluează zece parole după criterii de tărie și construiesc una bună după o metodă (frază-parolă). Discuție despre ce date nu se dau niciodată online, pornind de la un profil fals pregătit de profesor.” Resurse: „fișă cu parole de evaluat, profil fals de analizat” → **fișa** `fisa-parole-si-profil.pptx` (zece parole + profilul fals) din pasul de laborator |
| Proiectul unității | `planificari\Proiectul_unitatii_VI-U2.md` | lecția 12 = predare, „teorie, exercitii”; descriptorii CS.1.3 (siguranța în mediul online) |
| Granița | promptul autorului (`noapte_10_10\prompturi\vi_l12.md`) | NU: antivirusul (11), e-mailul (13-15), setările unui serviciu anume. Lecția nu folosește cuvintele „malware”, „virus”, „spam”, „atașament”, „phishing” și nu numește niciun serviciu real |

## 2. Ce presupun că știe elevul (bife = verificat în documentul numit)

- [x] serviciile Internetului (web, mesagerie, jocuri), pagina web, site-ul, browserul — planul clasei a V-a, V-U3, lecțiile 13-14 (`unitati.json`; `curriculum.json` clasa a V-a: „Servicii ale rețelei Internet”, „Serviciul World Wide Web”)
- [x] siguranța pe Internet, în mare — V-U3, lecția 16 („Siguranța pe Internet: pericole, reguli, credibilitatea surselor”); lecția spune din nou tot ce folosește
- [x] mouse, clic, tastare, Enter — profilul standardului (clasa a V-a)
- [x] LearningHub: „Spune cine ești”, jos pe pagină — lecția VI/1 („spune întâi cine ești, jos pe pagină («Spune cine ești»)”)
- [x] PowerPoint: miniaturile, F5, →, Esc — lecția VI/2
- [x] fișierul descărcat, Vizualizare protejată (Protected View) → Activare editare (Enable Editing), ✕ → Nu salvați (Don't Save) — lecțiile VI/2, VI/3 (reluate la 5-8; VI/8 are aceiași pași)
- [x] substituentul gol „Click to add text” și tabelul cu căsuțe — lecția VI/4
- [ ] e-mailul — NU (lecțiile 13-15): nefolosit
- [ ] antivirus, malware, ferestre false — NU (lecția 11, scrisă în paralel): nefolosite; „Ai nevoie de” nu trimite la lecția 11
Termenii noi se explică la prima folosire: date personale, a publica, cont, parolă, caracter, simbol, frază-parolă, capcană, a ieși din cont, profil, identitate virtuală, a posta, urmă, captură de ecran, profil fals, a bloca, a raporta. Oracolul `verifica_lectie.py`, T0: 0 termeni folosiți înaintea definiției (după o reparație: „poza de profil” venea înainte de „Profilul”).

## 3. Surse oficiale pentru ce afirmă lecția (citate exacte; cercetarea completă: `_proba/surse_cercetare.md`)

- **S1. DNSC**, „Ce fac dacă mi-a fost compromis un cont online” (PDF), dnsc.ro/vezi/document/ce-fac-daca-mi-a-fost-compromis-un-cont-online, citit din copia web.archive.org din 19.04.2024 (dnsc.ro e în spatele Cloudflare); text brut: `_campaign\jocuri_val2_2026_09_15\internet-vi\surse\dnsc_cont_compromis_wb.txt`, r. 25-38:
  „Înlocuiți-o cu o parolă puternică, compusă din cel puțin 15 caractere, care trebuie să cuprindă litere majuscule și minuscule, numere și simboluri.” · „O frază-parolă poate fi mai ușor de reținut. Poate fi vorba de o frază care include cuvinte neobișnuite sau cuvinte din limbi diferite.” · „Utilizați o parolă unică pentru fiecare cont”
  → pasul „Parola puternică: fraza-parolă” (15 caractere + amestec + frază-parolă), regula 2 din „Parola rămâne a ta”.
- **S2. NCSC (Marea Britanie)**, „Three random words”, https://www.ncsc.gov.uk/collection/top-tips-for-staying-secure-online/three-random-words: „Combine three random words to create a password that's 'long enough and strong enough'.” → metoda cu 3 cuvinte fără legătură. Lecția cere în plus amestecul (S1), ca DNSC.
- **S5. Poliția Română, IPJ Neamț**, „Siguranța în mediul on-line”, https://nt.politiaromana.ro/ro/prevenirea-criminalitatii/siguranta-in-mediul-on-line: „Nu spune parola de la e-mail-ul tău altor persoane în afara părinţilor; dacă le comunici această parolă prietenilor sau altor persoane, acestea pot trimite mesaje jignitoare în numele tău…” · „…odată postate aceste fotografii pot fi văzute sau folosite de oricine, oricând.” → regula 1 („O pot ști doar părinții tăi”, ca în promptul profesorului) și urma.
  **Contradicție între surse (pentru profesor):** ghidul DNSC/ASCPD, Ora de Net și FTC spun „nimănui”, fără excepție; Poliția (IPJ Neamț, IPJ Dâmbovița) și promptul profesorului lasă părinții. Lecția spune „N-o spui nimănui, nici prietenilor buni. O pot ști doar părinții tăi.” — compatibil cu ambele (părinții nu sunt „alții” care o cer).
- **S6. Ghidul DNSC/ASCPD** „Cum îmi protejez datele personale și mă apăr de pericole în mediul online?” (CC BY 4.0; citit dintr-o copie găzduită pe radioresita.ro, dnsc.ro inaccesibil — NESIGUR că e identic cu originalul): p. ~9 „Orice informație care te poate identifica clar, sau care poate ajuta la identificarea cuiva, este considerată dată personală.”; p. ~11 „Nimic nu este, niciodată, șters cu adevărat.”; p. ~13 „orice ai postat public este la dispoziția oricui, poate fi descărcat, copiat…”; p. ~27 „Nu oferi niciodată parola, nici măcar celor mai buni prieteni ai tăi”; p. ~37 „…să nu facă publice, vreodată, date personale precum adresa de acasă, numele școlii la care învață sau numărul de telefon, nici al său, al dvs. sau al rudelor…” → pașii „Datele personale” (inclusiv telefonul mamei), „Identitatea virtuală și urma ta”.
- **S7. NCSC**, „Phishing: Spot and report scam emails…”, https://www.ncsc.gov.uk/collection/phishing-scams/spot-scams: „your bank (or any other official source) will never ask you to supply personal information via email…”; ghidul DNSC/ASCPD, p. ~23 (phishing): „«Pescarul» nostru pretinde că este o persoană de încredere și, înșelând victima, primește acces la informații sensibile (de exemplu, parole…)”. → regula 3: „Un mesaj care îți cere parola sau date personale e o capcană, chiar dacă pare de la echipa jocului, de la școală sau de la un prieten.” Lecția NU afirmă „niciun serviciu nu-ți cere niciodată parola” (nicio sursă oficială pentru public n-o spune literal); spune ce faci tu cu un astfel de mesaj.
- **S8. DHS Know2Protect (SUA)**, „Tips2Identify Fake Profiles” (PDF), www.dhs.gov/sites/default/files/2024-09/24_09_20_K2P_Tips2Identify-Fake-Profiles.pdf, citit din web.archive.org (23.04.2025; adresa directă dă 404 acum); text: `_proba/_surse/k2p_fake_profiles.txt`: „Limited pictures on profile.” · „Limited activity on the site.” · „Very few followers or friends.” · „Requests personal information too soon.” → primul semn („contul e nou sau aproape gol: foarte puține poze, prieteni sau postări”) și „îți cere date personale”.
- **S9. NCA-CEOP (Marea Britanie)**, „Online grooming” (11-18), copie web.archive.org 08.05.2026 (site-ul cere CAPTCHA): „…pay you lots of attention and compliments. They might be trying to make you feel special to gain your trust.” · „…ask you not to tell anyone that you are chatting.” · „You can also block and report them… you should tell an adult you trust” → semnele „te laudă mult”, „cere secret”, și „ce faci”. (11.10: copia de pe disc, `_proba/_surse/ceop_grooming.txt`, era stricată — un răspuns comprimat salvat ca text; e înlocuită cu textul curat al aceleiași copii din arhivă, citit de judecătorul 1: toate trei citatele se găsesc în el.)
- **S10. eSafety Commissioner (Australia)**, „Unsafe contact”, https://www.esafety.gov.au/young-people/unsafe-contact (copie web.archive.org 2026; site-ul direct nu răspunde; text: `_proba/_surse/unsafe-contact.txt`): „They may flatter you by telling you how good looking you are, or send you gifts or make promises to you.”; „Things to watch out for with online friends” (kids): „…someone's online profile looks like they are your age, but it does not match… Or maybe they ask you to send photos of yourself.” → semnele „cadouri, bani sau premii”, „poze cu tine”.
- **S11. Comisia Europeană**, „Protejarea copiilor în mediul online”, https://commission.europa.eu/digital-life/protecting-children-online_ro: „nu comunicați niciodată informațiile dumneavoastră personale … utilizați parole puternice și unice blocați și raportați imediat orice persoană care hărțuiește, exercită presiune…”.
- **S12. Regulamentul (UE) 2016/679 (GDPR), art. 4 pct. 1**, https://eur-lex.europa.eu/legal-content/RO/TXT/?uri=CELEX:32016R0679 (citit din depozitul Oficiului pentru Publicații, publications.europa.eu/resource/celex/32016R0679; EUR-Lex a cerut verificare anti-robot): „„date cu caracter personal” înseamnă orice informații privind o persoană fizică identificată sau identificabilă…” → definiția pentru copii din pas („informațiile după care cineva poate afla cine ești sau unde te găsește”) + nuanța „unele nu te dau de gol singure; laolaltă cu altele, da”. **Lecția nu numește legea și nu afirmă nicio vârstă** (de la ce vârstă își face un copil singur cont): n-am găsit o sursă oficială românească sigură, deci nu afirm. Lecția spune doar „Dacă nu ești sigur, întrebi părinții” (sfat, nu lege).

## 4. Ce am refolosit din jocul `jocuri\internet-vi` (nivelurile N2 și N6) și ce nu
- **Refolosit (verificat):** ideea testelor de parolă care se bifează cât scrii și pragul de 15 caractere (jocul îl schimbase de la 8 la 15 după aceeași sursă DNSC, `_campaign\jocuri_val2_2026_09_15\internet-vi\modificari.md`, M1); exercițiul „repară maria2014” (aici „Încă un exercițiu”); avertismentul „nu scrie aici parola ta adevărată”.
- **Schimbat:** evaluatorul e scris din nou, în `lectii\_sim\cont-sigur.js`: două trepte, ca lecția („puternică” / „încă nu e puternică”), nu trei; prinde „un nume și un an” (`maria2014`, `Maria2014!!!!!!!`), datele despre persoană și parolele foarte folosite; testul nou „E făcută din cel puțin 3 cuvinte” (metoda).
- **NU refolosit:** capturile `parola-slaba.webp` / `parola-puternica.webp` (unealta publică Bitwarden: marcă străină pe sit și îl învață pe copil să-și scrie parola pe un site străin — exact ce lecția spune să nu facă); nivelul N6 (mesajul-capcană prin e-mail, cu „spam”, „atașament”, „.exe”): e vocabularul lecțiilor 11 și 13-15.

## 5. SIGURANȚA — ce salvează și ce trimite pagina (cerința promptului)

**Citit în cod (doar citire, nimic modificat):**
- `jocuri\_motor\motor.js`: sertarul lecției (`lectie_vi_m2_l12@<profil>`) ține pe nivel doar numere (`stars, xp, ind, ara, p1{b,t,c}, sec, t0, t1, ps, pn, at, re, qm, ul, v`; comentariul „CE FACE ELEVUL PE NIVEL”, r. ~104-128); `<cheie>_vazut_<i>` ține numerele întrebărilor văzute. Răspunsurile tastate nu intră nicăieri. Singurul `fetch` e trimiterea diplomei (numele, criptat, și stelele).
- `assets\js\prezenta.js`: ascultă `pointerdown/keydown/wheel/touchmove` doar ca să știe CĂ lucrezi (minute), fără tasta apăsată sau textul (r. ~536-543: `gest()` nu citește valori); trimite sertarele din `localStorage` (deci nimic din ce nu e acolo).
- `lectii\_sim\rezultat-elev.js`: nefolosit de lecție (lecția nu ține nicio verificare peste încărcări).
- `lectii\_sim\cont-sigur.js` (al lecției): nu scrie în `localStorage`/`sessionStorage`/cookie, nu face cereri; câmpurile sunt `<input type="text">` fără `<form>`, fără `name`, cu `autocomplete/autocorrect/autocapitalize="off"`, `spellcheck="false"` (cu `type="password"` browserul calculatorului comun ar putea propune „Salvezi parola?”); răspunsul la mesajul din atelier nu se păstrează (doar faptul că ai răspuns).

**Probat (Playwright, `_proba/proba_siguranta.py` → `_proba/proba_siguranta.json`, ieșirea `_proba/proba_siguranta_2.txt`), 11.10.2026:**
- servire locală 127.0.0.1, ORICE altă cerere oprită și notată cu corpul ei; închidere doar cu `ctx.close()`;
- un elev INVENTAT („Elev Proba”, cod 4826) se înscrie prin caseta adevărată, apoi parcurge TOATĂ lecția cu gesturi reale (390 px cu atingere, apoi 1280 px), tastând marcaje unice în toate câmpurile de parolă (pasul 3, „repară maria2014”, atelierul Matei, atelierul Ilinca, Î3) și un marcaj în răspunsul la mesajul-capcană;
- rezultat, pe ambele aparate: marcajele apar de **0** ori în `localStorage`, `sessionStorage`, cookie și IndexedDB (cheile rămase: `learninghub_*`, `lh_*`, `lectie_vi_m2_l12@<profil>`; sertarul lecției = doar numere) și de **0** ori în cererile spre exterior (12, respectiv 11 cereri spre `teste-vasile.netlify.app`, ~7,9 KB, toate oprite; plus fontul Google); **0** cereri ajunse la destinație; **0** erori JS. Ultima linie a probei: 0.
- **Evaluatorul de tărie rulează doar în pagină** (`SimContSigur.analiza`), fără niciun serviciu extern.

**Refăcută după reparațiile judecății 1 (evaluatorul și câmpurile atelierului au fost schimbate), 11.10.2026:**
- `_proba/proba_reparatii.py` (pornită din proba judecătorului 1, `_verificare/proba_j1.py`): un elev INVENTAT („Elev Reparatie”, cod 5173) se înscrie prin caseta adevărată și trece lecția cu BUTOANELE elevului (Pasul următor, Încă un exercițiu, Verifică, Laborator, Î1-Î5, diploma), pe 390 px cu atingere și pe 1280 px, rețeaua spre exterior oprită (regula 24), închidere doar cu `ctx.close()`. Marcaje unice tastate în TOATE câmpurile (pasul „Parola puternică”, „repară maria2014”, atelierul Matei, atelierul Ilinca, Î3) și în răspunsul la mesajul-capcană → **0** apariții în localStorage, sessionStorage, cookie, IndexedDB (conținut), CacheStorage, adresă, history; **0** în cererile oprite (13, respectiv 12 spre `teste-vasile.netlify.app`, ~7,6 KB, plus fontul Google); **0** cereri ajunse la destinație; după închidere, **0** în tot profilul de pe disc (Web Data.autofill = 0, Login Data.logins = 0); niciun `type=password`, niciun `<form>`, toate câmpurile fără `name` și cu `autocomplete=off`; 0 erori JS. Ieșirea: `_proba/proba_reparatii_1.txt` și, pe pagina finală, `_proba/proba_reparatii_2.txt` (176 verificări OK, ultima linie 0), `_proba/proba_reparatii.json`.
- `_proba/proba_siguranta.py` (a autorului inițial, cu așteptările aduse la zi: 7 pași în laborator, testul mesajului pe rândul 7) → `_proba/proba_siguranta_4.txt`, ultima linie 0.
- `activitate.py lista`: „nu e in catalog” 0 înainte și 0 după; niciun „Reparatie” în listă.

## 6. Fișa de laborator (`fisa-parole-si-profil.pptx`)
- făcută cu python-pptx (`_proba/fa_fisa.py`), fără PowerPoint; conținut inventat; metadate goale: `curata_metadate.py` → „fișiere cu nume în metadate: 0”;
- deschisă în **PowerPoint-ul real** (16.0), pe desktopul ascuns, prin COM fără fereastră, doar citire, după lacătul `lacat_office.py` (`_proba/probe_ppt.py` → `_proba/probe_ppt.json`): 3 diapozitive; tabelul 11 x 2 cu coloana a doua goală; substituentul din dreapta de pe diapozitivul 3 gol (tip 7); PowerPoint pornit și oprit de probă (PID notat), niciun PowerPoint rămas. Memoria comună gen_py a PowerPoint-ului a fost găsită stricată (altă sesiune): proba folosește un gen_py PROPRIU, `_proba/_genpy`, și n-o atinge pe cea comună.
- prima rulare a probei (gen_py stricat) a lăsat un PowerPoint pornit prin COM, care s-a închis singur în câteva secunde (verificat: niciun `POWERPNT.EXE` după).
- PowerPoint nu are `AddToMru=False` la `Presentations.Open`: copia `_proba/_ppt/fisa_copie.pptx` poate apărea în „Recent” → de curățat de dirijor cu `verificare_lectii\curata_mru_office.py --sterge`.

## 7. Porțile (rulate din nou după reparațiile J1, 11.10.2026)
- `test_joc.py --dir lectii/vi m2-l12` → TRECUT (singurul avertisment rămas: „1 niveluri”, așteptat) — `_proba/test_joc_3.txt`.
- `verifica_lectie.py index.html --fara-t1` → ultima linie 0 (S0 TRECUT · S1 0 identice · S2 aplicare 6/6 · T0 TRECUT) — `_proba/verifica_lectie_3.txt`.
- Playwright cu gesturi reale la 390 px cu atingere și la 1280 px, până la diplomă → 0 probleme, 0 erori JS (`_proba/proba_reparatii_1.txt`); capturile de telefon `_proba/_r_*_390.png`, privite (laboratorul cu „Verifică-te” în pașii 3 și 4, atelierul).
- `_proba/numara.js`: cuvinte pe pas (text ≤ 110, „Uite cum” ≤ 80) și 40 de parole judecate de simulator (13 „puternice”, 27 „slabe”, plus parola din exemplu dată ca publicată) → 0 probleme.
- `learninghub_date_personale.py` → 0 (`_proba/date_personale_2.txt`).

## 8. Nesigur / de confirmat de profesor
- Textul gri al substituentului gol pe un PowerPoint în **română**: forma exactă rămâne neprobată (Office-ul de probă e în engleză). Din 11.10 pagina nu mai trimite elevul după text: spune în română ce face („un text gri care te invită să faci clic și să adaugi text”) și dă forma engleză (*Click to add text*).
- Butonul de simboluri de pe telefon: pagina scrie „?123” (ca lecțiile VIII); pe iPhone se numește „123”. Neprobat pe un telefon real.
- Pe telefon, cât e deschis, meniul etichetei acoperă textul ultimului pas al laboratorului; butonul „Închide” se vede (judecătorul 1, observație).
- Legăturile „Magazin Play” / „App Store” din caseta „Lucrezi pe telefon?” (21 px) sunt ale motorului (`telefonFisier`), nu ale lecției.
- Clicul într-o căsuță de tabel și în substituent nu se poate trimite pe desktopul ascuns (afirmații A4, A5: stare PARTIAL / din VI/4).
- Ghidul DNSC/ASCPD e citit dintr-o copie de pe alt site (dnsc.ro inaccesibil).
- Butonul roșu „Ieși” de pe eticheta strânsă are 37 x 21 px (sub 32 px în înălțime) — e în `prezenta.js`, nu în lecție; eticheta întreagă se poate atinge.
- Dacă profesorul vrea „nimănui, nici părinților” (DNSC) în loc de „doar părinții” (Poliția, promptul): o propoziție de schimbat în pasul „Parola rămâne a ta” și în atelier.

## 9. Pentru lecția următoare (13-15, poșta electronică) — simulatorul `lectii\_sim\cont-sigur.js`
- Poți folosi: `SimContSigur.analiza(parola, {interzise})`, `SimContSigur.TESTE`, tipurile `parola` (câmp de parolă INVENTATĂ cu teste), `profil` (rânduri de marcat ca semne), `cont` (cont cu profil public + parolă + un mesaj; `Q.cont` = alte date), `SimContSigur.evalueazaCont(Q, stare)`. Forma lui `Q` e în capul fișierului.
- Nu schimbi: pragul de 15 caractere și cele patru feluri de semne, numele testelor, regula „nimic nu se salvează, nimic nu pleacă” (nici `type="password"`, nici `<form>`).
- **Din 11.10.2026 (după judecata 1):** `analiza(parola, {interzise, publicate})` dă „puternică” doar fără nimic ușor de ghicit (`usor`: date despre persoană, o parolă foarte folosită — cele din litere căutate ca început/sfârșit de cuvânt, nu la mijloc —, un an 1950-2029, același semn de 4 ori sau 4 cifre la rând, o parolă scrisă în lecție); teste noi `neghicita` și `nuExemplu {v:[parolele publicate, fără soluția exercițiului]}`; atelierul are 7 teste (nou: `fraza`, „frază-parolă inventată”), iar `Q.cont` primește `explica` (ce e fiecare dată interzisă), `publicate`, `solutie`, `gresit`; focusul nu mai sare în câmpul parolei după Blochează/Raportează/Trimite. O extensie nouă (de exemplu „schimbarea parolei contului de e-mail”) stă în alt fișier din `lectii\_sim\`, cu nume nou.
- Lecția 12 a predat: date personale, parolă puternică (15 + amestec), frază-parolă, „n-o spui, doar părinții”, alta pe fiecare cont, mesajul care cere parola = capcană, ieșirea din cont pe calculatorul comun, profil, identitate virtuală, urma, profil fals, a bloca, a raporta. Lecția 13 le poate folosi direct.

## 10. Reparațiile după judecata 1 (11.10.2026, autor proaspăt)
Registrul cu fiecare punct al celor doi judecători (opus 0/2/9, sonnet 0/1/10), reparația și locul ei: `_verificare/registru_j1.md`.
Proba reparațiilor: `_proba/proba_reparatii.py` (fiecare verificare are litera punctului din registru). Tastatura: Microsoft Learn,
„Romanian (Standard) Keyboard” (https://learn.microsoft.com/en-us/globalization/keyboards/kbdrost), copie în `_proba/_surse/ms_kbdrost_iframe.html`:
în starea Shift, tasta 1 dă „U+0021 EXCLAMATION MARK”, ca pe tastatura US (afirmația A19).
