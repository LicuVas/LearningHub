# Recenzie — Clasa a VI-a, „Text și Imagini în Prezentări”

- **Fișier:** `C:\00\Projects\LearningHub\content\tic\cls6\m1-prezentari\lectia3-text-imagini.html` (907 linii, citit integral)
- **Fișierul lecției NU a fost modificat.**

Severitate: **blocant** = elevul/profesorul nu poate folosi corect lecția așa cum e · **important** = lecția funcționează, dar învățarea sau ora are de suferit clar · **minor** = finisaj.

---

## 1. Chestionarele sunt decalate: aproape fiecare atom verifică materia ALTUI atom
- **Unde (atom → ce întreabă chestionarul):**
  - atomul 1 „Casete de text” → întrebarea 2: `Care tip de SmartArt folosesti pentru a arata pasi…` (SmartArt = atomul 7)
  - atomul 2 „Formatarea textului” → `Ce functie folosesti pentru a aduce un obiect IN FATA…` și `Cum grupezi mai multe obiecte…` (atomul 9)
  - atomul 3 „Liste” → `Ce marime MINIMA ar trebui sa aiba fontul…` (atomul 2)
  - atomul 4 „Inserarea imaginilor” → `cea mai buna practica pentru combinatia text-fundal` (atomul 10)
  - atomul 5 „Formatarea imaginilor” → `shortcut-ul pentru formatare BOLD` (atomul 2)
  - atomul 6 „Forme” → `regula "6x6"` (atomii 3/10)
  - atomul 7 „SmartArt” → `Cum inserezi o imagine de pe calculatorul tau` (atomul 4)
  - atomul 8 „WordArt” → proporțiile la tragerea de colț (atomul 5)
  - atomul 9 „Aranjarea obiectelor” → `Remove Background` (atomul 5)
  - atomul 10 „Reguli de design” → `Ce este SmartArt` (atomul 7)
- **De ce contează:** motorul blochează răspunsul după prima alegere și calculează progresul pe chestionare. Elevul e întrebat despre lucruri pe care nu le-a citit încă (atomii 1, 2, 4, 6 întreabă „înainte”), primește „Incorect” și pierde încrederea; profesorul primește un scor care nu măsoară atomul parcurs.
- **Severitate:** blocant
- **Schimbare propusă:** fiecare set de întrebări mutat la atomul lui (maparea de mai sus e deja făcută); unde un atom rămâne fără întrebare (ex. atomul 3 „Liste”, atomul 6 „Forme”), întrebări noi: „Când folosești o listă numerotată în loc de marcatori?”, „Ce tastă ții apăsată ca să desenezi un cerc perfect?”. De verificat mecanic pe tot situl: termenii-cheie din întrebare trebuie să apară în corpul aceluiași atom.

## 2. Toți atomii au titlul „N. Continut”
- **Unde:** `<h3 class="atom-title">1. Continut</h3>` … `10. Continut`, `7. Continut — Aprofundare`.
- **De ce contează:** titlul atomului e ce vede elevul în antet, în bara de progres și în rezumat; „3. Conținut” nu spune nimic. Titlul real stă ascuns într-un `concept-title` mai jos.
- **Severitate:** important
- **Schimbare propusă:** titlul atomului = titlul conceptului („Casete de text”, „Formatarea textului”, …).

## 3. Granița „bază / extindere” e pusă greșit: reguli obligatorii ajung la „opțional”
- **Unde:** după atomul 5: `EXTINDERE — Continut avansat (optional pentru nivelul clasei VI)` și `Daca ai stapanit atomii 1-5, esti pregatit pentru lectia urmatoare`. Dar după graniță urmează atomul 6 „Forme”, atomul 9 „Aranjarea obiectelor” și atomul 10 „Reguli de design” — nemarcate „Aprofundare”. Obiectivele lecției promit `Sa pozitionezi textul si imaginile armonios pe slide` (atomul 9) și `Sa aplici regula 6x6` (atomul 10). Exercițiul 1 (nivel minim) cere `Forme geometrice decorative` și `Respecta regula 6x6`.
- **De ce contează:** elevul care se oprește corect după atomul 5 (cum i se spune) nu a învățat formele, alinierea și regulile de design, dar exercițiul de nivel minim i le cere. Standardul „Consolidat” cere „forme predefinite”, deci formele nu sunt extindere.
- **Severitate:** blocant
- **Schimbare propusă:** ordinea: 1 casete text · 2 formatare text · 3 liste · 4 inserare imagini · 5 redimensionare/aranjare (partea de bază din 9) · 6 forme · 7 reguli de design (6x6, contrast, un font) — apoi graniță — extindere: editare avansată imagini (Remove Background, Compress), SmartArt, WordArt, Selection Pane, Distribute.

## 4. Lecția e scrisă doar pentru PowerPoint recent, cu meniuri în engleză
- **Unde:** `Deschide PowerPoint`, `Insert → Pictures → Stock Images`, `Insert → Icons`, `Highlight (Evidențiere)`, `Picture Format → Remove Background`, `Shape Format`. Traducerea apare doar uneori (`Insert (Inserare)`), de cele mai multe ori deloc (`Picture Styles`, `Corrections`, `Selection Pane`, `Align to Slide`).
- **De ce contează:** în școli rulează des Office 2016/2019 în română, LibreOffice Impress sau Google Slides; „Stock Images” și evidențierea textului există doar în Microsoft 365/versiunile recente, „Icons” nu există în 2016. Elevul care caută „Picture Format” într-un PowerPoint românesc („Formatare imagine”) nu găsește nimic. Programa cere „o aplicație de prezentare”, nu PowerPoint 365.
- **Severitate:** important
- **Schimbare propusă:** fiecare cale de meniu dată în română întâi, engleza între paranteze („Inserare → Imagini → Acest dispozitiv (Insert → Pictures → This Device)”); marcaj „doar în Microsoft 365” unde e cazul; o casetă „Dacă lucrezi în Google Slides / LibreOffice Impress” cu echivalentele pentru operațiile de bază (text, imagine, formă, aliniere).

## 5. Zero capturi de ecran într-o lecție despre aspect vizual
- **Unde:** întreaga pagină; chiar și „Exemplu: Transforma un slide prost intr-unul bun” e o listă de puncte (`20 randuri de text, font 12pt`), nu o imagine.
- **De ce contează:** elevul de 11–12 ani nu își poate imagina „manerele de colț”, „cercul de rotire”, „liniile portocalii de aliniere” sau diferența dintre slide prost și slide bun fără să le vadă. Descriptorii cer operare cu elemente de structură „în pași ghidați”.
- **Severitate:** important
- **Schimbare propusă:** o captură adnotată a panglicii (ribbon) pentru Inserare și Formatare imagine; imaginea „înainte/după” pentru slide-ul prost/bun; captură cu mânerele de redimensionare (colț vs latură).

## 6. Informații contradictorii despre păstrarea proporțiilor imaginii
- **Unde:** atomul 4: `in versiunile PowerPoint 2013 si ulterioare, proportiile sunt pastrate automat`; greșeala frecventă din atomul 5: `In PowerPoint 365/2021 proportiile sunt pastrate automat la tragerea de colt; in versiunile mai vechi tine si Shift apasat`.
- **De ce contează:** aceeași lecție dă două praguri de versiune (2013 vs 365/2021); chestionarul atomului 8 notează ca greșit „Shift trebuie apăsat”. Un elev cu Office 2016 nu știe pe care să o creadă.
- **Severitate:** minor
- **Schimbare propusă:** o singură formulare, repetată identic: „La imagini, tragerea de colț păstrează proporțiile. Dacă totuși se deformează, ține Shift apăsat.” Fără numere de versiune.

## 7. Cifrele pentru mărimea fontului diferă de la o secțiune la alta
- **Unde:** atomul 2: `Titluri: 32-44pt`; exemplul din atomul 2: `Marime: 40pt`; exercițiul 1: `Titlu … marime mare (minim 40pt)`; exercițiul 3: `32pt pentru titluri`; WordArt: `Mareste fontul la 60-72pt`; regula 10-20-30: `font min 30pt`.
- **De ce contează:** la corectare, un elev cu titlu de 36 pt respectă atomul 2 și exercițiul 3, dar nu exercițiul 1.
- **Severitate:** minor
- **Schimbare propusă:** o regulă unică declarată o dată (ex. „titlu 32–44 pt, text 18–28 pt”) și exercițiile care o citează identic.

## 8. Regula 10-20-30 e o paranteză care încurcă
- **Unde:** `Regula formulata de Guy Kawasaki exclusiv pentru pitch-uri catre investitori: max 10 slide-uri, max 20 minute, font min 30pt. Nu este o regula scolara.`
- **De ce contează:** se introduce o regulă doar ca să se spună că nu se aplică; aduce încă un număr (30 pt) în conflict cu 18 pt; „pitch-uri către investitori” nu înseamnă nimic la clasa a VI-a.
- **Severitate:** minor
- **Schimbare propusă:** eliminată; în locul ei, „O idee pe slide” sau „Scrie sursa imaginii”.

## 9. Mesaj de deschidere care descurajează
- **Unde:** `Slide-urile tale sunt plictisitoare... Totul este text simplu, fara formatare... Nimeni nu este impresionat de prezentarile tale...`
- **De ce contează:** la 11–12 ani, „nimeni nu e impresionat de prezentările tale” e perceput personal; în plus, secțiunea „Obiectivul lecției” nu conține niciun obiectiv.
- **Severitate:** minor
- **Schimbare propusă:** scenariu pozitiv: „Ai de prezentat la biologie ciclul apei. Cum faci ca un coleg din ultima bancă să citească slide-ul și să înțeleagă desenul dintr-o privire?”, urmat de obiectivul concret.

## 10. Lecția e mult prea lungă pentru o oră
- **Unde:** 10 atomi (plus 4 „feature-grid”-uri cu câte 6–8 funcții) și un proiect de performanță de 8–10 slide-uri cu ~20 de cerințe.
- **De ce contează:** Informatică și TIC la clasa a VI-a are 1 oră/săptămână; conținutul acoperă 3–4 ore. Profesorul nu are indicat ce se face în ora de azi și ce rămâne.
- **Severitate:** important
- **Schimbare propusă:** împărțire în „Text în prezentări” (casete, formatare, liste, reguli de lizibilitate) și „Imagini și forme” (inserare, redimensionare, forme, aliniere); extinderea (SmartArt, WordArt, efecte) ca lecție opțională sau casetă „Vrei mai mult?”.

## 11. Drepturile de autor sunt menționate, dar creditarea sursei nu e predată
- **Unde:** `Atentie la copyright! Nu folosi orice imagine de pe internet… Imagini cu licenta Creative Commons`; exercițiul 1: `Insereaza 2 imagini (de pe calculator sau de pe internet)`; exercițiul 3: `Minim 5 imagini HD`. Nicio cerință de a scrie sursa.
- **De ce contează:** competența generală 3 din programă cere explicit „respectând creditarea informației și drepturile de autor”. Elevul e avertizat, dar nu i se arată ce să facă (unde scrie sursa, ce înseamnă CC BY).
- **Severitate:** important
- **Schimbare propusă:** paragraf „Cum creditezi o imagine” (sub imagine sau pe ultimul slide: autor, site, licență), cu exemplu; cerință în toate cele 3 exerciții: „slide final Surse”; criteriu în barem.

## 12. Exercițiul de nivel minim cere date despre familie și poze, fără gardă
- **Unde:** `Slide 3 (Familie): Text cu numele membrilor familiei`; `Minim 1 imagine per slide`; avertismentul existent acoperă doar `email, telefon, adresa`.
- **De ce contează:** nu toți copiii au o situație familială pe care vor s-o expună (părinți plecați, plasament, deces); fotografiile cu ei sau cu familia ajung în fișiere care circulă. Avertismentul de siguranță omite exact numele și fotografiile.
- **Severitate:** important
- **Schimbare propusă:** „Slide 3 (Familie)” → „Slide 3: Activitatea mea preferată” (sau la alegere: familie / animal de companie / sport); regula de siguranță extinsă: „nu pune fotografii cu tine sau cu alte persoane; folosește desene, pictograme sau imagini cu licență liberă”.

## 13. Exercițiul de nivel minim e prea mare pentru „minim”
- **Unde:** exercițiul 1: 5 slide-uri, fiecare cu imagine, fundal colorat/gradient, liste, forme, plus 5 reguli obligatorii.
- **De ce contează:** descriptorul „De bază” cere „cu sprijin, elemente simple (casete text, forme predefinite), în pași ghidați”. Elevul slab nu termină în oră și rămâne fără nicio reușită.
- **Severitate:** important
- **Schimbare propusă:** nivel minim = 1–2 slide-uri, pași ghidați (titlu formatat, o listă, o imagine redimensionată corect). Prezentarea „Despre mine” pe 5 slide-uri → nivel standard.

## 14. Exercițiul de performanță cere lucruri nepredate și leagă nota 10 de un „bonus”
- **Unde:** `Bonus (pentru nota maxima 10): … Adauga Icons … Gradient fills … Creeaza un layout personalizat pentru ultimul slide`; cerință obligatorie: `O imagine cu Remove Background aplicat`, `WordArt pentru titlul prezentarii`.
- **De ce contează:** „layout personalizat” (Slide Master) nu apare nicăieri în lecție; nota 10 condiționată de funcții din afara programei (chiar lecția spune `depasesc programa obligatorie`) nu e corectă față de elevi și nu se poate apăra la o inspecție. Rezolvarea admite: `daca nu apar in lectie inaintea acestui exercitiu, e normal sa ceara timp suplimentar`.
- **Severitate:** important
- **Schimbare propusă:** nota maximă legată de criteriile din programă (structură, lizibilitate, consistență, imagini creditate, forme, aliniere); bonusul = puncte peste barem sau mențiune, nu condiție pentru 10; „layout personalizat” scos sau predat.

## 15. Lipsește baremul pentru profesor
- **Unde:** exercițiile 1–3 au liste de cerințe și „Evaluare: checklist-ul complet bifat”, fără punctaj.
- **De ce contează:** programa cere și „susținerea în fața colegilor”; fără barem pe puncte legat de descriptori, profesorul nu poate nota consecvent 28 de prezentări.
- **Severitate:** important
- **Schimbare propusă:** barem pe 10 puncte (ex. structură 2p, text lizibil 2p, imagini potrivite + creditate 2p, forme/aliniere 2p, consistență 1p, prezentare orală 1p), cu corespondență la „De bază / Consolidat / Avansat”.

## 16. Exercițiul 2 nu dă materialul de lucru
- **Unde:** `Gaseste online (Google Images, SlideShare) sau creeaza singur un slide cu design PROST`.
- **De ce contează:** elevii pierd timpul căutând, SlideShare nu e potrivit pentru copii (reclame, cont), iar fiecare lucrează pe alt slide, deci nu se pot compara soluțiile.
- **Severitate:** minor
- **Schimbare propusă:** un fișier `.pptx` descărcabil cu 2–3 slide-uri „proaste” pregătite (text 12 pt, roșu pe portocaliu, imagine deformată), identic pentru toată clasa.

## 17. Afirmații inexacte sau exagerate
- **Unde:**
  - `Tot textul din PowerPoint se afla intr-o caseta de text` — atomul 6 arată că textul poate sta și în forme (`Click dreapta pe forma → Add Text`), la fel în tabele și SmartArt.
  - `Cauta imagini de minim 1920x1080 pixeli pentru calitate profesionala` — apoi `Compress Pictures` recomandat pentru a micșora fișierul; pentru o imagine care ocupă un sfert de slide, 1920×1080 e inutil.
  - `Stock Images … Sigure pentru orice prezentare!` — disponibile doar cu abonament Microsoft 365.
  - `Multi elevi incearca sa scrie direct pe slide… PowerPoint nu permite asta` — pe layout-urile standard scrie direct în caseta „Faceți clic pentru a adăuga text”, deci elevul chiar poate „scrie direct”.
- **De ce contează:** elevul bun observă contradicțiile; elevul slab reține afirmații absolute greșite.
- **Severitate:** minor
- **Schimbare propusă:** nuanțare: „Textul stă mereu într-un container — casetă text, formă sau tabel”; „imaginea să nu arate pixelată la mărimea la care o folosești”; „Stock Images (doar Microsoft 365)”.

## 18. Scurtături care depind de tastatură
- **Unde:** `Ctrl+Shift+] = Bring to Front, Ctrl+Shift+[ = Send to Back`.
- **De ce contează:** pe tastatura în română, tastele `[` și `]` produc „ă” și „î”; scurtătura nu merge cum e descrisă, iar chestionarul din atomul 2 o include în indiciu.
- **Severitate:** minor
- **Schimbare propusă:** prioritate pe meniul contextual („clic dreapta → Aducere în prim-plan”); scurtăturile cu paranteze marcate „pe tastatura în engleză (US)”.

## 19. Indicii care trimit la o secțiune inexistentă
- **Unde:** `Vom invata metoda exacta in sectiunea LEARN!`; `Cauta raspunsul in sectiunea LEARN`.
- **De ce contează:** pe pagină nu există nicio secțiune numită „LEARN”; elevul o caută.
- **Severitate:** minor
- **Schimbare propusă:** „în atomii de mai jos”.

## 20. Note administrative de programă afișate elevului
- **Unde:** `Nota programa (OMEN 3393/2017): Domeniul Prezentari include si continutul Reguli elementare…`; `SmartArt nu este mentionat explicit in continuturile obligatorii ale programei…` (repetat la WordArt și în exercițiul 3).
- **De ce contează:** e informație pentru profesor; la elev aglomerează și sună a „nu contează”.
- **Severitate:** minor
- **Schimbare propusă:** mutate într-o casetă „Pentru profesor” la subsol; la elev rămâne doar eticheta scurtă „Aprofundare (opțional)”.

## 21. Anglicisme și context de adult/business
- **Unde:** `delicious dar trebuie folosit cu moderatie`, `WordArt pe fiecare slide = overwhelming`, `Pentru prezentari profesionale de business`, `CEO → Manageri → Angajati`, `awards`, `look modern`, `Design best practices`.
- **De ce contează:** vocabular și exemple străine de elevul de 12 ani; engleza amestecată în propoziții românești e un model de limbă slab.
- **Severitate:** minor
- **Schimbare propusă:** exemple școlare (organigrama școlii, arborele genealogic, ciclul apei), termeni în română.

## 22. Text fără diacritice, cu câteva diacritice rătăcite
- **Unde:** majoritatea textului fără diacritice (`Formatarea Textului`, `Aliniere stanga`), dar izolat: `contrastează`, `Evidențiere`, `Lasă spatiu gol`, `Curbează textul`.
- **De ce contează:** pe o platformă școlară românească, textul fără diacritice e o greșeală de ortografie; amestecul arată neîngrijit.
- **Severitate:** important
- **Schimbare propusă:** conversie completă la diacritice corecte (ș, ț cu virgulă), cu verificare după conversie.

## 23. Defecte de șablon vizibile
- **Unde:** titluri de exercițiu care se termină în liniuță: `Exercitiul 1 (Nivel minim) - ` (la fel 2 și 3); rezumatul fără spațiu după două puncte: `Casete de text:Cum sa adaugi…`, `Liste:Bullet points…`; „Următoarea lecție” generică: `Continua cu lectia urmatoare pentru a aprofunda cunostintele.` (următoarea este „Animații”); rezumatul listează ca „învățate” și atomii de extindere (SmartArt, WordArt).
- **De ce contează:** finisaj; rezumatul care include extinderea contrazice mesajul „dacă ai stăpânit atomii 1–5 ești pregătit”.
- **Severitate:** minor
- **Schimbare propusă:** titlul exercițiului completat cu numele lui („Creează o prezentare «Despre mine»”); spațiu după „:”; „Continuă cu Lecția 4 — Animații”; rezumat separat „Bază” / „Pentru curioși”.

## 24. Chestionare slabe ca măsurare
- **Unde:** atomul 4: varianta corectă `Text inchis pe fundal deschis (contrast ridicat)` e cea mai lungă și singura cu explicație; atomul 10: `Diagrame si scheme profesionale create automat` — la fel; distractori eliminabili prin reflex: `6 slide-uri cu 6 imagini fiecare`, `6 fonturi diferite si 6 culori`, `Text gri pe fundal gri deschis`. O singură întrebare pe majoritatea atomilor; niciuna nu cere aplicare (ex. „care dintre aceste două slide-uri respectă regula?”).
- **De ce contează:** elevul ghicește după lungime/absurd; profesorul nu află cine a înțeles.
- **Severitate:** important
- **Schimbare propusă:** variante de lungime comparabilă, distractori din greșeli reale („trag de latură ca să măresc imaginea”, „pun 4 fonturi ca să fie mai vesel”), minim 2 întrebări pe atom, una de aplicare pe o situație.

---

## Sumar
| Severitate | Nr. |
|:--|--:|
| blocant | 2 |
| important | 11 |
| minor | 11 |
| **Total** | **24** |
