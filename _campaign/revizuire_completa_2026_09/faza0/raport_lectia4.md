# Lecția nr. 4 (28.09–02.10): ce material folosești la fiecare clasă și ce e stricat în el

**Scris:** 27.09.2026, faza 0 din revizuirea LearningHub. **Am doar măsurat:** n-am reparat și n-am publicat nimic. Situl e neatins; toate fișierele noi stau în `faza0\`. **Decizia e a ta.**

Cuvinte folosite mai jos:
- **nivel** = o lecție din „jocuri” (Misiunea …), cu pași, atelier și 5 întrebări;
- **grav** = elevul nu poate face lecția sau învață ceva fals;
- **arbitru** = aplicația adevărată (Excel, Word), pornită ascuns ca să verifice ce promite lecția.

## Pe scurt

| Clasa | Când (după Calendar_ore) | Lecția 4 | Material recomandat | Grave | Minore | Unde trimite azi panoul clasei |
|---|---|---|---|---|---|---|
| a V-a | Brauner 5AM/5M, vineri 02.10 · Tupilați luni 28.09 (neconfirmat) | Structura generală a unui sistem de calcul. Rolul componentelor hardware | `jocuri/calculator-v/`, nivelul 4 „Hardware și software” | 0 | 15 | lecția veche `cls5/m1-sisteme/lectia2-hardware.html` (fără nicio imagine) |
| a VI-a | Izvoare marți 29.09 · Brauner 6A/6M vineri 02.10 · Tupilați 28.09 | Structura unei prezentări: diapozitive și obiecte | `jocuri/prezentari-vi/`, nivelul 3 „Diapozitive și obiecte” | 0 | 18 | lecția veche `cls6/m1-prezentari/lectia2-slide-uri.html`, care are materia lecției 5 |
| a VII-a | Izvoare VII A și VII B marți 29.09 · Brauner 7 MA vineri 02.10 · Tupilați 28.09 | Obiecte într-un document: text, imagini, tabele | `jocuri/word-obiecte-vii/`, nivelurile 1 și 3 | **4** | 15 | **nimic**: panoul nu are intrare pentru lecția 4 |
| a VIII-a | Izvoare marți 29.09 · Brauner 8A/8M vineri 02.10 · Tupilați 28.09 | Adresa de celulă. Selectare, copiere, mutare, ștergere | `jocuri/excel-viii/`, nivelul 2 „Selectare, copiere, mutare, ștergere” | **1** | 11 | lecția veche `cls8/m1-excel-fundamente/lectia1-interfata.html`, aceeași ca la lecția 3; nu are copiere, mutare sau ștergere |

**Două lucruri valabile la toate clasele:**
1. **Nivelurile se deschid numai pe rând.** Codul motorului, `jocuri/_motor/motor.js` rândul 58: `const unlocked=i=>i===0||!!S.lv[i-1];`. Un elev care n-a terminat nivelurile dinainte pe profilul lui vede nivelul lecției 4 „blocat”:
   - la a VII-a asta e sigur o problemă, pentru că nivelul 3 cere întâi nivelul 2, adică lecția 7;
   - la a V-a, a VI-a și a VIII-a depinde de un lucru pe care nu-l știu: au terminat elevii pe sit nivelurile lecțiilor 2–3? La Tupilați probabil nu.
2. **Uneltele automate n-au găsit nimic, deci nu ajung.** Poarta jocurilor, oracolul de imagini și harta prerechizitelor dau 0 probleme pe toți candidații. Tot ce e mai jos l-au găsit citirea ca elevul și Excel-ul adevărat.

## Cum am măsurat

1. **Harta.** Am citit `unitati.json`, `Calendar_ore_*.md`, `jocuri/ACOPERIRE.md`, `jocuri/catalog.js` și panoul (`C:\00\AI_0\data\panou\lectii.json`; fișierul `LearningHub\data\panou\lectii.json` nu există). Atenție: `unitati.json` are pe lecție doar titlul, fără conținuturi. Conținuturile din programă le-am luat din câmpul `continuturi` al nivelurilor.
2. **Uneltele existente,** rulate pe candidați (comanda și ultima linie):

| Comanda | Ultima linie |
|---|---|
| `python C:/00/Projects/LearningHub/jocuri/_motor/test_joc.py <slug>` (9 jocuri: cele 5 de învățare + 4 antrenamente) | toate `[TRECUT]`, exit 0 (ex. `[TRECUT] excel-viii · întrebări jucate: 206 · diacritice/1000: 67.9`) |
| `python C:/00/Projects/LearningHub/jocuri/_motor/ilustratii.py` | `0` |
| `python C:/00/Projects/LearningHub/_tests/prereq_jocuri.py --doar calculator-v,prezentari-vi,word-obiecte-vii,excel-viii,excel-pas-cu-pas-viii --detalii` (fără `--scrie`) | `0` (5 semnale nenumărate; doar `calculator-v N4P2: „salvarea”` ține de lecția 4) |
| `python C:/00/AI_0/tools/plimbare/oracol/oracol_novice.py --sit faza0/_oracol/<clasa> --config …/oracol.config.json --json … --fara-executie` (prin `faza0/oracol_build.py`) | V `8` · VI `6` · VII `9` · VIII `6` |
| `python faza0/excel_real_viii4.py` | `2` (afirmații INFIRMATE) |
| `python faza0/proba_word_com.py` | `document inchis fara salvare; instanta mea inchisa (Quit)` |

   Oracolul-novice e **necalibrat**: glosarul și lista „NU ȘTIE” le-am scris eu, fără tine. Cifrele lui sunt semnale, nu verdicte. Ce a prins util: „Managerul de activități”, „GB” și „DDR4” folosite fără explicație la a V-a; „bara de stare” și „Shift” neexplicate la a VIII-a.
3. **Citirea ca elevul.** Au citit patru cititori independenți, unul pe clasă, cu carte închisă: doar ce scrie până la pasul curent, plus nivelurile dinainte. Textul l-au primit extras mecanic din joc (`faza0/_extras/`). Fiecare problemă are citat exact și loc. **Toate citatele au fost verificate mecanic în textul sitului: 0 negăsite.** Cele 4 grave de la a VII-a le-am verificat eu, în cod și în imagini.
4. **Excel-ul adevărat pentru a VIII-a.** Excel 16 în engleză, cu setările regionale ale PC-ului românești (virgulă zecimală, „;” între argumente, „.” în date). L-am pornit ca instanță nouă și invizibilă, cu registru nou pe fiecare probă, închis fără salvare. **46 de afirmații: 34 CONFIRMAT, 2 INFIRMAT, 10 NETESTABIL**, plus 7 fapte pentru lecție. Niciun Excel al tău n-a fost atins, iar la final n-a rămas niciun EXCEL.EXE deschis.
5. **Word.** Arbitrul Word **merge** pe acest PC (detalii la a VII-a).

---

## Clasa a V-a: „Structura generală a unui sistem de calcul. Rolul componentelor hardware”

**Recomandat:** `jocuri/calculator-v/`, nivelul 4 „Hardware și software”. Are 5 pași, un atelier, 6 întrebări și 3 capturi. Cititorul l-a parcurs cap-coadă fără blocaj: toate cheile sunt corecte, nicio afirmație falsă, iar imaginile arată ce spune textul.

**Grave:** niciuna.

**Minore (15). Cele care contează la clasă:**
- **Atelierul e doar recunoaștere.** Exemplul de la pasul 5 dă deja răspunsurile, cuvânt cu cuvânt („Disc 0 e un SSD, Disc 2 e un HDD”, „40,0 GB”).
- **Memoria apare cu două cifre.** Captura arată „Memorie 15,5/39,7 GB”, iar textul spune 40,0 GB. Diferența se explică abia după răspuns, deci elevul poate alege 15,5.
- **Criteriul „pot să-l ating?” se citește în două feluri:** „e posibil” sau „am voie”. Lecția 2 spune să nu deschidă carcasa, deci pe a doua citire procesorul ar ieși software.
- **Termeni folosiți înainte de explicație:** „procesorul” și „placa de bază” (explicate un pas mai târziu), „discul”, „HDD”, „a rula”.
- **Atelierul cere o citire „rând cu rând”** a ferestrei Managerului de activități, cu GHz, NVMe, Kbps și GPU, nimic explicat. Tastele Ctrl+Shift+Esc nu sunt arătate pe o tastatură.
- **„Play” e dat doar în engleză.**
- **Acoperire parțială:** nu se spune că piesele stau în carcasă (unitatea centrală), iar discul lipsește din drumul intrare → prelucrare → ieșire.

**De reparat ca să ajungă „verificat parțial”:**
- atelierul fără răspunsurile date în exemplu;
- o frază și o schemă „ce e în carcasă / ce e în afară”;
- explicația 15,5 / 39,7 / 40,0 GB;
- HDD = hard disk, SSD = disc fără piese mobile;
- o imagine cu tastele Ctrl, Shift și Esc;
- criteriul reformulat: „e o piesă, un obiect”;
- ambele nume: „Play (Redare) ▶”.

**Alternativele:**
- **Lecția veche din panou** are text bogat, dar 0 imagini, trimite la căutări pe Google în engleză și are jargon. E mai slabă.
- **`calculator-antrenament-v`** are 10 întrebări pentru lecția 4, fără pași. E bun ca recapitulare după nivelul 4, nu ca lecție.

---

## Clasa a VI-a: „Structura unei prezentări: diapozitive și obiecte”

**Recomandat:** `jocuri/prezentari-vi/`, nivelul 3 „Diapozitive și obiecte”. Are 3 pași, un atelier, 6 întrebări și o captură. Toate cheile sunt corecte, iar captura (`aspect-machete.webp`) arată ce spune textul.

**Grave:** niciuna.

**Minore (18). Cele care contează la clasă:**
- **Numele butoanelor doar în engleză:** New Slide, Title Only, Blank, Two Content. Pe Office în română elevul caută „Diapozitiv nou” și numele românești ale machetelor.
- **Macheta Comparison** apare în captură, în simulator și la întrebarea 2, dar nu e explicată. Atelierul se cheamă totuși „diapozitiv de comparație”.
- **Atelierul promite „exact pașii din PowerPoint”,** dar în simulator obiectul apare dintr-un clic. În PowerPoint, Table deschide o grilă, Pictures deschide fereastra de fișiere, iar Text Box se pune cu clic pe diapozitiv.
- **„Imaginile importate”** sunt cerute de programă, dar nicăieri nu scrie de unde iei imaginea.
- **Nicăieri nu scrie cum scrii efectiv** într-o casetă (clic în ea, apoi tastezi).
- **Contradicții de numerotare:** atelierul spune „diapozitivul 3 („Cum câștigi”)”, dar în planul din pasul 3 același diapozitiv era al 5-lea. La întrebarea 1, cuprinsul lui Radu promite două idei, iar prezentarea are una.
- **„Aspect”** înseamnă aici Layout (Pornire), dar la nivelul 1 „pe Proiectare schimbi aspectul”.
- **Cele 3 „Încearcă”** sunt recunoaștere: răspunsul stă scris chiar deasupra.

**De reparat ca să ajungă „verificat parțial”:**
- ambele nume la butoane și la machete;
- o frază despre Comparison, sau Comparison scos de la întrebarea 2;
- „Inserare (Insert) → Imagini (Pictures) → Acest dispozitiv (This Device)” + captură;
- „clic în casetă, tastezi”;
- numerotarea din atelier și de la întrebarea 1;
- „aspect” folosit la fel peste tot;
- măcar un „Încearcă” care cere transfer, nu copiere.

**Alternativele:**
- **Lecția veche din panou (`lectia2-slide-uri`)** are materia lecției 5 (adaug, șterg, reordonez diapozitive) și 0 imagini. **Panoul trimite azi la lecția greșită.**
- **`lectia3-text-imagini`** acoperă exact partea care lipsește din nivelul 3 (caseta de text, imaginea din calculator), dar amestecă lecțiile 4–6 și are 0 imagini.

---

## Clasa a VII-a: „Obiecte într-un document: text, imagini, tabele”

**Recomandat, după reparații:** `jocuri/word-obiecte-vii/`, nivelul 1 „Obiecte într-un document” + nivelul 3 „Tabelul: rânduri, coloane, antet”. E singurul material construit pe lecția 4, cu capturi reale și chei corecte.

**Grave (4), fiecare verificat de mine:**
1. **Tabelul e blocat în spatele lecției 7.** Nivelul 3 se deschide numai după nivelul 2, care e „Formatarea imaginii, a tabelului și a paginii” (lecția 7). Dovada: `motor.js` rândul 58. Ca materie, nivelul 3 nu are nevoie de nivelul 2. **Pe 29.09 / 02.10 elevul termină nivelul 1 și dă de un nivel de lecția 7.**
2. **Atelierul nivelului 3 respinge numărătoarea corectă.** Atelierul spune: „câte informații are un elev (coloane), câți elevi sunt (rânduri) și încă un rând pentru antet”. Elevul pune 3 coloane și 5 rânduri, exact cum l-a învățat pasul (și cum ar face în Word). Jocul răspunde „Lipsește rândul de antet” și „un rând gol la final”, pentru că nu a apăsat comutatorul „Rând de antet”. Comutatorul nu e predat în niciun pas: apare doar în indiciu, după prima greșeală. Dovada: `word-obiecte-vii/index.html`, `init()` pornește cu `antet:false`, iar `problems()` îl cere.
3. **Pasul cu poza nu se poate urma literal.** Pasul spune: „Apeși Imagini (Pictures) pentru o poză din calculator”, apoi „alegi fișierul”. În captura lecției, Pictures are săgeata ˅ de meniu. În acest Word se deschide întâi un meniu, Acest dispozitiv / Imagini stoc / Imagini online, nu fereastra cu fișiere. *Gravitatea depinde de versiunea Office din laborator: Office 2016 deschide direct fereastra de fișiere.*
4. **Imaginea `tabel-antet.webp` învață greșit ce e o coloană.** Sunt încadrate doar rândul de antet și celula „41”. Eticheta „o coloană ↓” arată spre rândul de antet, iar nicio coloană nu e încadrată. Tocmai confuzia rând/coloană e ce lecția vrea să evite. Aceeași imagine e refolosită la întrebarea 1.

**Minore (15). Cele care contează:**
- eticheta grilei „3x4 Table” e dată doar în engleză (în Office RO probabil „Tabel 3x4”, neverificat);
- la exercițiile de la pasul 5 lipsește „(Insert) → (Table)”;
- „cursorul”, „celula”, Ctrl+C/Ctrl+V și butonul de centrare sunt folosite înainte să fie predate;
- captura referatului model are „Sursa imaginii: desen făcut de clasă”, deși pasul 4 spune că un desen al clasei nu are nevoie de sursă;
- la întrebarea 5, „Sursa” apare printre obiecte;
- nicio sarcină în Word-ul adevărat: nu scrie cum ajungi sub poză ca să scrii sursa, nici cum ieși din tabel.

**Word adevărat** (`proba_word_com.txt`): arbitrul pornește invizibil în 0,7 s. Rezultatele:
- tabelul 2×2 și imaginea `.webp` din sit s-au inserat, iar obiectele s-au numărat: 1 tabel, 1 imagine în linie, 0 forme plutitoare;
- **confirmat:** pozele se inserează „În linie cu textul” (setarea implicită);
- **confirmat:** un tabel cerut cu 3 coloane și 4 rânduri are 3 coloane și 4 rânduri;
- **confirmat:** Tab în ultima celulă adaugă un rând, cu 3 coloane;
- **netestabil prin COM:** eticheta grilei („3x4 Table”) și meniul de la Pictures, pentru că țin de ecran.

**De reparat ca să ajungă „verificat parțial”:**
- **nivelul 3 să nu mai depindă de nivelul 2:** mutat imediat după nivelul 1, sau deblocare pe lecție;
- atelierul să pornească cu „Rând de antet” activ, sau comutatorul să fie predat într-un pas;
- pasul „Acest dispozitiv (This Device)” + captura meniului;
- `tabel-antet.webp` refăcută (o coloană încadrată vertical, un rând de date, eticheta „celulă” lângă celula încadrată);
- ambele nume la grilă și la exerciții;
- captura referatului fără „sursa” la desenul clasei;
- întrebarea 5 fără „Sursa” printre obiecte.

**Alternativele:**
- **Lecțiile vechi** `cls7/m1-word-fundamente/lectia5-tabele.html` și `cls7/m2-word-avansat/lectia5-imagini-obiecte.html` au 0 imagini, sunt mult în engleză și au materie de lecția 7+ (a doua e fără diacritice).
- **Panoul nu are intrare pentru a VII-a, lecția 4.** Dacă nu adaugi una, elevii nu primesc link din panou.

---

## Clasa a VIII-a: „Adresa de celulă. Selectare, copiere, mutare, ștergere”

**Recomandat:** `jocuri/excel-viii/`, nivelul 2 „Selectare, copiere, mutare, ștergere”. E singurul care acoperă nucleul lecției: zona și adresa ei, selectarea, copierea, mutarea, golirea cu Delete, Ctrl+Z. Nu folosește nimic din lecțiile următoare. **În Excel-ul adevărat, 15 afirmații confirmate, 1 infirmată, 4 netestabile.**

**Grave (1):**
- **Un gest de selectare care în Excel nu merge.** Exercițiul de la pasul 1 și întrebarea de test Q2 cer: „Selectează zona B2:C4: apasă pe un colț, apoi pe colțul opus.” În pagină merge. În Excel-ul adevărat, clic pe B2 și apoi clic pe C4 lasă selectată **doar C4** (arbitrul, proba A20). Cititorul l-a notat minor; eu l-am ridicat la grav, pentru că exersează și notează un gest fals despre Excel. Remediul e simplu: „trage de la un colț la celălalt” sau „clic, apoi Shift+clic”.

**Minore (11). Cele care contează:**
- **Analogia spune „rândurile B până la D”,** deși literele sunt coloane.
- **„Shift+clic”** e folosit fără să spună ce e Shift și nu are exercițiu.
- **Lipsesc capturile:** zona selectată (celula activă albă + caseta de nume) și butonul Anulare (Undo).
- **Numele RO/EN** ale butoanelor Copiere (Copy), Decupare (Cut) și Lipire (Paste) lipsesc: se predau doar tastele.
- **Acoperire:** nu există ștergerea sau inserarea unui **rând sau a unei coloane**. Programa cere „ștergere”, iar în Excel e altceva decât tasta Delete (vezi faptele de mai jos). Adresa de celulă e doar folosită, nu reamintită.
- **Q3 și exercițiul „câte celule”** sunt recunoaștere: exemplul B2:D4 e chiar în pas.

**Ce a spus Excel-ul adevărat** (`excel_real_viii4.json`):
- **CONFIRMAT:**
  - A1:B3 = 6 celule; B2:D4 = 9;
  - după selectarea zonei pornind din B2, celula activă e B2;
  - Ctrl+C pune starea „copiat” (marginea punctată);
  - copierea lasă originalul, iar copia pornește din celula aleasă (D1 → D1:E2);
  - mutarea golește locul vechi;
  - Delete golește fără să mute nimic (formatul, de ex. aldinul, rămâne);
  - Ctrl+Z (Undo) aduce înapoi ce ai golit;
  - lista copiată pe foaia a doua rămâne și pe prima.
- **NETESTABIL:** clic pe litera coloanei, Shift+clic, tasta Esc, numele RO „Anulare”. Sunt gesturi și taste care nu se pot trimite unui Excel invizibil.
- **Fapte pe care lecția ar trebui să le spună:**
  - după Ctrl+X, Ctrl+V marginea dispare singură și nu mai poți lipi a doua oară; după Ctrl+C, Ctrl+V poți lipi din nou;
  - la mutare, formulele care trimiteau la celulă o urmează (`=A1*2` devine `=C1*2`); la copiere, nu;
  - după Delete, o formulă care trimitea la celula golită dă 0, fără eroare;
  - **ștergerea unui rând** mută în sus rândurile de dedesubt, iar formula care trimitea la rândul șters devine `=#REF!*10`; la coloană, la fel;
  - comanda „Ștergere celule” (Delete Cells) **mută** celulele în sus, spre deosebire de tasta Delete;
  - lipirea peste celule pline le înlocuiește.

**Ceilalți candidați nu se potrivesc lecției 4:**
- **`excel-pas-cu-pas-viii`, nivelul 2** (1 grav): nu are nici copiere, nici mutare. Jumătate din nivel e lecția 5, cu tipurile de date. Afirmațiile lui despre Excel au ieșit toate adevărate, inclusiv „7.5 pe setări RO devine data 07.mai”.
- **`excel-pas-cu-pas-viii`, nivelul 5** (3 grave): e construit pe formule (`=B2*C2`), care se predau abia la lecția 7, deci e blocaj de la primul pas. Excel confirmă tot ce spune despre mâner, Ctrl+D și adresele care se mută, dar nu e lecția 4.
- **Lecția veche din panou (`lectia1-interfata`):** faptele sunt corecte (16.384 coloane, 1.048.576 rânduri, Ctrl+End pe C4 și pe M25), dar are o afirmație infirmată. „Ctrl + End = sari la ultima celulă cu date” nu e adevărat: după ce golești o celulă departată, Ctrl+End te duce tot acolo, la ultima celulă *folosită*. Nu are copiere, mutare sau ștergere de celule. **Panoul trimite la ea și pentru lecția 3, și pentru lecția 4.**

**De reparat ca să ajungă „verificat parțial”:**
- gestul de la pasul 1 și de la Q2;
- „coloanele B până la D”;
- Shift explicat + un exercițiu cu Shift+clic și unul cu selectarea unei coloane întregi;
- un pas „șterg un rând sau o coloană” față de tasta Delete, cu exercițiu;
- butoanele Copiere/Decupare/Lipire cu ambele nume + captură;
- captura cu butonul Anulare (Undo);
- o frază de reamintire a adresei de celulă;
- panoul mutat pe `excel-viii` nivelul 2.

---

## Tupilați: ce am găsit, exact, cu căi

- **`C:\00\Projects\Info_Gimnaziu_2026\`:** grep după „Tupila” nu dă **nimic**. Nu există `Calendar_ore` pentru Tupilați.
- **`C:\ObsidianVaults\Scoala\10 - Anul 2026-2027\Planificari 2026-2027 — toate scolile, pe calendarul real.md`, rândul 71:** „- [ ] **Tupilați:** nu există planificări 2026-2027 (TIC luni: V · VI+VII simultan · VIII). Întâi: sub ce formă sunt orele (contract / plata cu ora)? (📅 2026-10-02)”. Rândul 23 are vacanțele: 14–18 decembrie 2026 și 19–23 aprilie 2027.
- **`C:\ObsidianVaults\Scoala\10 - Anul 2026-2027\Tupilati\00 - Scoala Tupilati.md`:**
  - „T.I.C., 3 ore, plata cu ora — revenire anunțată de directoare pe 09.09.2026”;
  - lunea: 12:00 a V-a, 13:00 a VIII-a, 14:00 a VI-a + a VII-a simultan (orele încep la :05);
  - sursa e stratul din 18.09.2026 al orarului; nota spune că rândul fusese corectat pe 20.09;
  - elevi în baza ELEVI: V 14 · VI 7 · VII 7 · VIII 16.
- **`C:\ObsidianVaults\Scoala\10 - Anul 2026-2027\Orar saptamanal 2026-2027.md`, rândurile 377–383:** „cred că ordinea orelor la Tupilați este: cls 5, cls 8, cls 6 & 7 simultan”, marcat „de confirmat la școală”.
- **`C:\ObsidianVaults\Scoala\An Scolar 2026-2027.md`, rândul 24:** scrie încă „T.I.C. — VIII, VII, VI, lunea 12–15”, adică ordinea veche, fără a V-a. Nu se potrivește cu nota școlii.
- **`C:\ObsidianVaults\Scoala\10 - Anul 2026-2027\Dumbrava Rosie\De tiparit — informatica gimnaziu.md`, rândul 10:** „Aceleași materiale se folosesc la Dumbrava Roșie și la Tupilați”.
- **Ce s-a predat deja la Tupilați:** **nicio notă**, nicăieri. Nu știu dacă orele din 14.09 și 21.09 s-au ținut, deci nu știu dacă 28.09 e ora a 2-a, a 3-a sau a 4-a. Dacă prima oră a fost pe 14.09, 28.09 e a 3-a.
- **Ce urmează din asta:**
  - dacă elevii de la Tupilați n-au lucrat pe sit, nivelurile lecției 4 le sunt blocate (regula de deblocare de sus), la toate cele patru clase;
  - la ora simultană VI + VII rulează două jocuri diferite (prezentări și Word);
  - la a VII-a e în plus problema tabelului blocat.

## Ce e nesigur

- **Deblocarea la V, VI, VIII:** nu știu câți elevi au terminat pe sit nivelurile lecțiilor 2–3. Dacă n-au terminat, nivelul lecției 4 nu se deschide. Mecanismul e verificat în cod; efectul la clasă nu.
- **Gravul 3 de la a VII-a** (meniul de la Pictures) depinde de versiunea Office din laborator: 365 are meniu, 2016 deschide direct fereastra de fișiere.
- **Numele românești** (Anulare, Introducere, Editare, Diapozitiv nou, machetele, „Tabel 3x4”): netestabile aici, pentru că Office e în engleză.
- **Tastele și gesturile** (Esc, Tab, F2, Shift+clic, clic pe antetul coloanei): netestabile prin arbitrul invizibil.
- **Ctrl+Shift+Esc (Managerul de activități) la a V-a:** nu știu dacă pe conturile elevilor din laborator se deschide.
- **Oracolul-novice** e necalibrat (glosarul l-am făcut eu). Cifrele lui sunt semnale.
- **Orele de la Izvoare:** în `Calendar_ore_*.md` (VIII 8:00, VI 9:00, VII A 10:10, VII B 11:10) nu se potrivesc cu orarul din memorie (VII A 8, VIII 9, VII B 10:10, VI 11:10). Nu am verificat care e bun. Datele (29.09) se potrivesc.
- **Brauner 7 MA** are TIC o dată la două săptămâni (după orar). `Calendar_ore_7_MA.md` pune lecția 4 pe 02.10; nu am verificat alternanța.

## Fișierele

- `candidati.json`: pe clasă, toți candidații, cu scorul uneltelor și fiecare problemă (gravitate, citat verificat, loc, ce se întâmplă, judecata mea unde există).
- `excel_real_viii4.json` + `excel_real_viii4.py`: arbitrul Excel. `proba_word_com.txt` + `proba_word_com.py`: arbitrul Word.
- `_citire/V.json`, `VI.json`, `VII.json`, `VIII.json`: citirile ca elevul, complete.
- `_unelte/`: ieșirile test_joc, ilustratii și prereq_jocuri. `_oracol/`: situl pe clase, config și rapoartele oracolului-novice.
- `_extras/`: textul extras din jocuri și din lecțiile vechi. Scripturile: `extrage_lectia4.py`, `extrage_configuri.py`, `extrage_lectii_vechi.py`, `oracol_build.py`, `merge_candidati.py`.
- Probleme GRAVE în materialele recomandate: V 0 · VI 0 · VII 4 · VIII 1 (în candidații nerecomandați încă 4: excel-pas-cu-pas-viii N2 1, N5 3).
- Numărul de pe ultimul rând = totalul GRAVELOR din materialele recomandate, după judecată.
5
