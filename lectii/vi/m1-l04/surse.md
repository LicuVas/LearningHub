# Surse — lecția VI, M1, nr. 4: „Structura unei prezentări: diapozitive și obiecte”

Scris de autor pe 27.09.2026, completat seara după reparațiile cerute de judecător (J01-J22, lista în `_verificare/reparatii.md`). Nimic publicat, nimic trimis în git.

## Programa și planificarea
- **Programa:** OMEN 3393/2017, clasa a VI-a (`C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`). Conținutul copiat exact: „Structura unei prezentări: diapozitive, obiecte utilizate în prezentări (casete de text, imagini importate, forme, sunete, tabele, legături)”. Competențele unității: CS.1.1 și CS.3.1. Activitatea de învățare folosită: „analiza unei prezentări model din perspectiva structurii … și modificarea acesteia la nivel de conținut”. Descriptorul Consolidat pomenește chiar obiectele lecției: „casete text, forme predefinite, imagini importate, diapozitive”.
- **Unitatea:** `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json`, VI-U1 „Prezentări digitale”, lecția 4. Titlul lecției e copiat din `Calendar_ore_6A_6M.md` (Brauner, vineri 02.10.2026). Izvoare: `Calendar_ore_VI.md` (marți). Tupilați nu are planificare (vezi `faza0\raport_lectia4.md`, secțiunea Tupilați).
- **Lecțiile de dinainte** (ce știe elevul): lecțiile 2 și 3, așa cum sunt pe sit în `jocuri/prezentari-vi`, nivelurile 1-2. Lista completă e în `profil.json`.
- **Lecțiile de după:** 5 editare, 6 formatare, 7 animații. Lecția nu cere nimic din ele: fără copiere, mutare, ștergere, mânere, culori, teme sau efecte.

## Materialul refolosit și ce am schimbat față de el
- `jocuri/prezentari-vi`, nivelul 3 „Diapozitive și obiecte”. Din el am păstrat: captura `aspect-machete.webp`, ideea structurii și o parte din exemple. Simulatorul `JocPPT` NU l-am copiat: am scris în pagină un simulator nou (`SimPPT`), pentru că faza 0 a găsit că „obiectul apare dintr-un clic”.
- Cele 18 probleme minore din faza 0 (`faza0\raport_lectia4.md`, secțiunea a VI-a, și `candidati.json`) și ce am făcut cu fiecare:
  1. „Încearcă” erau recunoaștere, cu răspunsul chiar deasupra. **Acum:** toate cele 5 „Încearcă” sunt de aplicare (exemple noi) sau de lucru în simulator.
  2. Întrebarea „Pe ce filă e Table” se repeta. **Acum:** am scos-o.
  3. Cuvântul „formata” apărea înainte să fie predat. **Acum:** nu mai apare deloc.
  4. Pasul cu obiectele n-avea imagine. **Acum:** e un diapozitiv randat chiar de PowerPoint, cu cele 5 obiecte încadrate.
  5. Sunetul și legătura erau doar numite. **Acum:** fiecare are o definiție scurtă, iar pasul 1 spune: „Sunetul și legătura le vei pune într-o lecție următoare; azi doar le recunoști.” Nu se exersează.
  6. Nu scria cum scrii într-o casetă. **Acum:** pasul 2 e întreg despre asta, cu un exercițiu în simulator.
  7. „New Slide” apărea doar în engleză. **Acum:** „Diapozitiv nou (New Slide)”.
  8. Machetele aveau doar numele în engleză. **Acum:** numele englezesc plus descrierea în română și fraza „alegi după desen”. Numele românești nesigure sunt listate mai jos.
  9. Comparison nu era explicat. **Acum:** e explicat în exemplul pasului 3.
  10. „Potrivește” era copiat din listă. **Acum:** l-am scos.
  11. Ordinea de la „Încearcă” era identică cu lista din pas. **Acum:** elevul ordonează o prezentare nouă, „Pădurea”.
  12. Numerotarea din atelier nu se potrivea cu restul. **Acum:** o singură prezentare-model, „Sistemul solar”, cu aceleași numere în figură, în simulator și în text. După J10, și conținutul se potrivește: tabelul de pe „Soarele” e despre Soare, iar tabelul „Planeta / Câte luni are” stă pe „Planetele”, ca în atelier și în provocare.
  13. Cuprinsul din Î1 promitea două idei, dar prezentarea avea una. **Acum:** în Î4 și la „Încearcă”, cuprinsul anunță exact diapozitivele de conținut care urmează.
  14. „Exact pașii din PowerPoint” nu era adevărat. **Acum:** simulatorul arată grila Table, fereastra de fișiere de la This Device și forma pusă cu clic pe diapozitiv.
  15. Nu se spunea că diapozitivul nou apare după cel ales. **Acum:** e predat explicit și exersat de 3 ori (pasul 3 și Î2).
  16. „Poți muta imaginea” (mutarea e în lecția 5). **Acum:** am înlocuit fraza cu „dai clic, primește chenar doar ea”.
  17. „Aspect” avea două sensuri. **Acum:** aici înseamnă doar Layout.
  18. Nu scria de unde vine o imagine importată. **Acum:** „dintr-un fișier de pe calculator”, prin Acest dispozitiv (This Device) și fereastra cu fișiere.
- **Confuzie nouă, prinsă la scriere:** la compunere, „cuprinsul” e partea din mijloc. La prezentare, cuprinsul e lista de la început. Pasul 5 o spune explicit („Atenție la cuvânt”). Cererea profesorului, „titlu, cuprins/conținut, încheiere”, se potrivește așa cu ambele sensuri.

## Numele din Office în română
- **Din `calibrare\meniuri_ro_en.json` (CONFIRMAT, 2 surse):** Pornire (Home), Inserare (Insert), Diapozitiv nou (New Slide), Aspect (Slide Layout), Imagini (Pictures), Forme (Shapes), Note (Notes).
- **Verificate de autor azi pe documentația Microsoft ro-ro (nu sunt în calibrare; de adăugat acolo):**
  - **Casetă text (Text Box).** Pagina https://support.microsoft.com/ro-ro/powerpoint/add-text-to-a-slide spune: „selectați fila Inserare, apoi selectați Casetă text”.
  - **Tabel (Table), Inserare tabel, Număr de coloane / Număr de rânduri.** Pagina https://support.microsoft.com/ro-ro/powerpoint/training/add-a-table-to-a-slide spune: „Pe fila Inserare, selectați Tabel … Utilizați mouse-ul pentru a selecta numărul de rânduri și de coloane”.
  - **Acest dispozitiv (This Device), Inserare (butonul Insert), Imagini stoc, Imagini online.** Pagina https://support.microsoft.com/ro-ro/powerpoint/basic-tasks-for-creating-a-powerpoint-presentation spune: „alegeți Acest dispozitiv, navigați la imagine, apoi alegeți Inserare”.
  - **Diapozitivul nou vine după cel ales; partea de jos a butonului Diapozitiv nou.** Aceeași pagină: „selectați jumătatea de jos a Diapozitiv nou”, „după care doriți să urmeze noul diapozitiv”.
  - **Substituent, substituenți.** Pagina https://support.microsoft.com/ro-ro/powerpoint/what-is-a-slide-layout spune: „Substituenții sunt containere cu linie punctată”.
  - **Titlu și conținut.** Aceeași pagină („diapozitivul Titlu și conținut”).
- **NESIGURE, filele care se deschid singure (J03):** „Format imagine” (Picture Format), „Format formă” (Shape Format), „Proiectare tabel” (Table Design). În lecție apar cu ambele nume; de confirmat cu captura C9.
- **NESIGURE (în lecție apar doar în engleză, cu descrierea în română, nu ca nume de buton):**
  - numele românești ale aspectelor: Title Slide, Two Content, Comparison, Title Only, Blank, Section Header, Content with Caption, Picture with Caption;
  - textul gri „Click to add title” / „Click to add subtitle” / „Click to add text” în Office în română. În lecție apare doar traducerea lui, ca explicație;
  - numele formelor „Arrow: Right”, „Arrow: Left”, „Star: 5 Points” și ale grupurilor din galeria Shapes. „Rectangle”, „Rectangle: Rounded Corners”, „Oval” și „Isosceles Triangle” sunt confirmate de dump-ul panglicii reale;
  - „Blank Presentation” pe ecranul de pornire (în provocare scrie „prima, cea albă”).

Toate se confirmă cu captura C8 din `capturi_lipsa.json`, pe un calculator din laborator cu Office în română.

## Ce am verificat în PowerPoint-ul adevărat (COM, fără fereastră, 27.09.2026)
Script: `C:\Users\<utilizator>\AppData\Local\Temp\claude\C--00-AI-0\cbe44f7e-0686-471f-94ca-4bdf5170bb7c\scratchpad\com_ppt.py`. Scriptul pornește doar dacă PowerPoint nu e deja deschis. La final închide prezentarea fără salvare și închide aplicația. Verificat după rulare: niciun POWERPNT.EXE rămas deschis.
- **PowerPoint 16.0, diapozitiv 960 × 540 pt (16:9).**
- **Cele 11 aspecte**, cu nume și substituenți:
  - Title Slide: 2;
  - Title and Content: 2;
  - Section Header: 2;
  - Two Content: 3;
  - Comparison: 5;
  - Title Only: 1;
  - Blank: 0;
  - Content with Caption: 3;
  - Picture with Caption: 3;
  - Title and Vertical Text: 2;
  - Vertical Title and Text: 2.
- Pentru fiecare substituent am citit poziția, mărimea și literele. Simulatorul folosește exact aceste valori (de exemplu, titlul are 44 pt, iar titlul de pe Title Slide 60 pt).
- `Shapes.AddTable(3, 2)` a dat un tabel cu 3 rânduri și 2 coloane.
- Randările `d1..d5.png` (prin `Slide.Export`) stau la baza imaginilor `obiecte-diapozitiv.webp` și `structura-prezentare.webp`.
- **NU am putut verifica prin COM**, pentru că e nevoie de fereastră și de panglică:
  - comportamentul butoanelor (New Slide, grila Table, eticheta „3x2 Table”);
  - dispariția casetei de text goale;
  - clicul simplu la Text Box și la Shapes;
  - textele gri la expunere.

  Toate sunt în `afirmatii.json`, cu starea NETESTAT, pentru dirijor.
- **A doua rulare, seara** (`com_ppt2.py`, același mod de lucru, PowerPoint închis la final): diapozitivele re-randate pentru J10 și tabelul gol 3x2 pentru J05 (`AddTable(2, 3)` → Rows.Count = 2, Columns.Count = 3).

## Faptele din exemple
- **Tabelul de pe diapozitivul „Soarele”** (figura din pasul 1 și simulatorul): „Vârsta: cam 4,6 miliarde de ani” și „Până la Pământ: 150 milioane km”.
  - Sursa: NASA, „Our Sun: Facts”, https://science.nasa.gov/sun/facts/ (citită de autor pe 27.09.2026). Pagina spune „It’s about 93 million miles (150 million kilometers) from Earth” și „when the solar system was first forming 4.6 billion years ago”.
  - Aceeași pagină scrie și „a 4.5 billion-year-old yellow dwarf star”, de aceea în tabel scrie „cam 4,6” (regresia R1 din `_verificare/judecator_2.md`).
- **Tabelul de pe „Planetele”:** Pământul are 1 lună, Marte are 2 (Phobos și Deimos). Sunt date școlare comune, nesubliniate în lecție ca fapte noi.

## Imaginile
- Proveniența completă e în `img/SURSE.json`.
- `prezentare-la-ora.webp`: fotografie din domeniul public (Bureau of Land Management, SUA, Wikimedia Commons). Elevii sunt fotografiați din spate.
- `obiecte-diapozitiv.webp` și `structura-prezentare.webp`: randări PowerPoint cu conținut inventat. Imaginea Soarelui e NASA/SDO, domeniu public.
- `diapozitiv-nou.webp`: decupaj din captura reală `jocuri/prezentari-vi/img/aspect-machete.webp`, cu un chenar nou.
- `tabel-3x2.webp` (nou, J05): un tabel 3 coloane × 2 rânduri randat de PowerPoint, cu etichetele „coloana 1-3” (săgeată spre dreapta) și „rândul 1-2” (săgeată în jos) desenate pe copie.
- `jocuri/prezentari-vi/img/aspect-machete.webp`: folosită direct, prin calea `../../../jocuri/…`.
- Imaginile din „calculatorul” simulatorului (soare.png, pamant.png, luna.png, marte.png) sunt desene SVG făcute de autor, nu fotografii.

## Simulatorul (SimPPT, în `index.html`)
- **Panglica:** e cea reală, desenată de `jocuri/_motor/ui-panglica.js` din `panglica-powerpoint.js`.
- **Butoanele folosite:** Diapozitiv nou (buton dublu: sus adaugă, jos ▾ lista de aspecte), Aspect, Tabel (grilă + Insert Table...), Imagini (This Device... → Insert Picture → Insert sau dublu clic pe fișier), Forme, Casetă text, plus formele și caseta din galeria de pe Home și Aspect de pe Design.
- **Filele contextuale (J03):** după o imagine, o formă sau un tabel, panglica trece singură pe Picture Format / Shape Format / Table Design (la tabel apare și Layout). Fila nu are butoane în simulator și spune pe ecran de ce, plus „dă clic pe fila Home”. Fila rămâne cât e ales obiectul; când nu mai e ales nimic, simulatorul revine pe Home. După Text Box panglica rămâne pe Insert (NESIGUR, A36).
- **Tastele (J01):** Ctrl+Z, Ctrl+M, Delete și Esc sunt ascultate pe document, fiindcă redesenarea pierdea focusul. Contează doar dacă ultimul clic sau atingere a fost în simulator; câmpurile din afara lui nu sunt atinse. Ascultă un singur simulator odată, cel desenat ultimul.
- **Scrisul (J02, A31):** peste tot un câmp pe mai multe rânduri, ca în PowerPoint: Enter = rând nou, iar ca să termini dai clic în afara casetei (sau Esc). Câmpul are cel puțin 16 px (sub 16 px, Safari de pe iPhone mărește pagina) și lățimea după text, ca să nu acopere obiectele vecine pe telefon. Abaterea veche „Enter termină scrisul” nu mai există.
- **Iconițele din substituentul de conținut (J18):** 6 (3 × 2), cât se văd în miniatura din captura reală; Insert Table și Pictures fac ce fac în aplicație, restul spun pe ecran că nu fac nimic. Setul exact e NESIGUR (C7).
- **Unde apare obiectul (J08):** un tabel sau o imagine pus(ă) de pe panglică intră în primul substituent de conținut gol, altfel stă în mijlocul diapozitivului (NESIGUR, A35, C3).
- **Grila Table pe ecran tactil (J09):** pătrățele de 26 × 24 px; prima atingere arată „3x2 Table”, a doua pune tabelul (spus pe ecran, chiar sub grilă). Cu mouse-ul, un singur clic, ca în aplicație.
- **Testele** verifică STAREA prezentării (câte diapozitive, aspect, texte, obiecte), nu drumul clicurilor. Orice drum pe care îl acceptă aplicația trece (de exemplu Ctrl+M în loc de butonul Diapozitiv nou).
- **Textul tastat fără diacritice e acceptat la notare**, dar pe diapozitiv apare exact cum a fost scris.
- **Abatere spusă pe ecran:** în celulele tabelului nu se scrie.
- **Simplificare nespusă (nu afectează testele):** un substituent care dispare la schimbarea aspectului își păstrează textul ca o casetă de text.
- **Probat după reparații**, cu gesturi reale (Playwright, 390 px cu atingere și 1280 px): proba autorului (`_verificare/proba_autor_reparatii.py`), 48/48 verificări după runda 2, 0 erori în consolă, 0 px depășire; drumurile judecătorului (`_verificare/sim_drumuri.py`, rulat pe o copie, cu indicii exercițiilor pasului 4 mutați după J04 și cu întoarcerea la Home după imagine și tabel, cerută de J03): 56/56. Captura de la 390 px: `_verificare/_proba_telefon.png`.

## Ce preia lecția 5 (J20: pentru autorul lecției VI nr. 5)
Lecția 4 predă deja, și exersează în simulator: diapozitivul nou cu Pornire (Home) → Diapozitiv nou (New Slide) și lista ▾, aspectul (Layout), inserarea obiectelor de pe Inserare (Insert) (casetă de text, formă, tabel, imagine), Ctrl+Z (doar ca plasă de siguranță, în atelier) și, nepredate dar acceptate de simulator, Ctrl+M și Delete. Rămân pentru lecția 5, „Editarea prezentării: inserare, copiere, mutare, ștergere”:
- inserarea din meniul miniaturii (clic dreapta → New Slide) și dublarea (Duplicate Slide);
- copierea și lipirea diapozitivelor și a obiectelor (Ctrl+C, Ctrl+V; Copy / Paste);
- mutarea: tragerea miniaturii în panoul cu miniaturi și a obiectului pe diapozitiv (mânerele);
- ștergerea diapozitivului și a obiectului (Delete, Delete Slide), cu anularea (Ctrl+Z) predată propriu-zis;
- scrisul în celulele tabelului (simulatorul lecției 4 nu îl face).
Decizia finală (ce rămâne unde) e a profesorului; unitati.json nu e atins.

## Publicarea (J22)
`_verificare/` (dosarul judecătorului, al arbitrului și proba mea `_proba_telefon.png`) nu trebuie să plece pe sit. Nu mai există niciun `_proba_*.png` lângă `index.html`.

## Ce cer motorului (nu am atins `_motor\`)
1. **Numărarea pașilor și legăturile pentru lecții:** rezolvate de dirijor cu `mod:'lectie'` (firimituri, „Lecția 4”, pasul „Acum în aplicația adevărată” înainte de verificare). Rămâne: pasul 0 „La ce folosește” apare ca „Pasul 1 din 6”; un câmp `zero:true` pe pas l-ar afișa „pasul 0”.
2. **Simulatorul SimPPT:** merge și e reutilizabil pentru lecțiile 5-7; autorul lecției 5 îl copiază în `lectii\_sim\simppt.js` după `_verificare/reparatii.md`.
3. **Dump-ul panglicii:** în `panglica-powerpoint.json`, butonul New Slide (SlideNewGallery, rect h = 148) e mai înalt decât grupul Slides (120). Partea lui de jos ajunge sub eticheta grupului. Am ocolit problema în pagină (înălțimea butonului dublu = 62 px). Merită corectat la sursă, în `panglica_build.py`.
4. **În afara lecției:** panoul de prezență al sitului (`#lhp`, `assets/js/prezenta.js`) stă fix jos (208 px din 900 pe calculator, 227 din 844 pe telefon) și acoperă partea de jos a diapozitivului din simulator până apasă elevul „Mai târziu”. În proba judecătorului, un clic pe diapozitiv a nimerit panoul.
