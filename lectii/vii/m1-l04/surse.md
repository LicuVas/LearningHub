# Surse — VII · M1 · lecția 4: „Obiecte într-un document: text, imagini, tabele”

Scris de agentul-autor, 27.09.2026. Nimic publicat, nimic comis.

## Programa și planul
- **Titlul exact:** `C:\00\Projects\Info_Gimnaziu_2026\planificari\Calendar_ore_VII_A.md`, rândul din 29.09.2026 (lecția 4, M1, predare). Același titlu în `data\unitati.json`, VII-U1, lecția nr. 4.
- **Conținutul din programă (copiat exact):** „Obiecte într-un document: text, imagini, tabele” — `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`, clasa a VII-a, domeniul „Editor de texte” (OMEN 3393/2017).
- **Competențe:** CS.1.1 „Editarea/tehnoredactarea de documente utilizând aplicații specializate” (activitatea „editarea unui document prin aplicarea operațiilor specifice”; descriptorul De bază: „…elemente de bază de conținut (text, imagini), prin editare de bază (inserare…)… în pași ghidați”) și CS.3.1 (documente utile, după model).
- **Lecțiile vecine** (ce NU face lecția): 5 copiere/mutare/ștergere, 6 formatarea textului și paragrafului, 7 formatarea imaginii, tabelului și paginii.

## Material refolosit
| Ce | De unde | Cum |
|---|---|---|
| Captura `obiecte-document.webp` (referatul cu text, imagine, tabel) | `jocuri\word-obiecte-vii\img\` | pasul 0 |
| Captura `inserare-imagini-tabel.webp` (fila Insert, Table + Pictures) | `jocuri\word-obiecte-vii\img\` | pasul 3 |
| Captura `inserare-tabel-grila.webp` (grila „3x4 Table” + tabelul gol) | `jocuri\word-obiecte-vii\img\` | pasul 5 |
| Imaginea NOUĂ `img\tabel-rand-coloana-celula.webp` | decupată din `obiecte-document.webp`, cu chenare desenate pe copie (PIL), proveniența în `img\SURSE.json` | pasul 4 |
| Imaginea NOUĂ `img\pisica.png` (800×600, PNG, ca să meargă și în Word 2016) | desen făcut cu PIL de autor, fără surse externe; proveniența în `img\SURSE.json` | poza de descărcat pentru provocarea din Word |
| Panglica reală Word (file, grupuri, butoane, icoane) | `jocuri\_motor\panglica-word.js` + `ui-panglica.js` (dump din Word-ul instalat, 27.09.2026) | simulatorul |
| Ideile bune ale nivelurilor cu `lectii:[4]` | `jocuri\word-obiecte-vii` N1 „Obiecte într-un document” și N3 „Tabelul: rânduri, coloane, antet”; `jocuri\word-vii` N1 „Primul contact” (ce știe elevul din lecțiile 2-3) | rescrise, nu copiate |

**Ce am evitat intenționat** (cele 4 probleme grave din `faza0\raport_lectia4.md`, secțiunea VII):
1. tabelul nu mai stă în spatele unui nivel de lecția 7: e o singură pagină, un singur nivel;
2. nu există niciun comutator „Rând de antet”: rândul cu numele coloanelor e doar primul rând de date, numărat în strategie („câte lucruri + 1”), iar simulatorul numără exact ce cere sarcina;
3. „Imagini (Pictures)”: se spun ambele drumuri — meniul (Acest dispozitiv… / This Device…) în Word-ul nou, fereastra directă în Word 2016 — iar simulatorul are meniul;
4. `tabel-antet.webp` NU e folosită (eticheta „o coloană” arăta spre un rând); am făcut `tabel-rand-coloana-celula.webp`, cu coloana încadrată vertical.
Și minorele: „cursor”, „celulă”, „paragraf”, „Tab” se explică înainte de a fi cerute; fără Ctrl+C/Ctrl+V și fără butonul de centrare; fără „sursa imaginii” (nu e cerută de lecție); nicio întrebare nu are „Sursa” printre obiecte.

## Word-ul adevărat (proba autorului)
Word 16.0.20326 (Microsoft 365, interfață EN), prin COM, instanță nouă și invizibilă, documente închise fără salvare. Rezultatele sunt în `afirmatii.json` (câmpul `proba_autor`). Pe scurt, **confirmat**: Enter la capătul paragrafului = paragraf nou, gol; poza fără Enter se lipește la capătul textului; poza după Enter stă pe rândul ei; tabelul pus la capătul unui paragraf apare sub el, urmat de un paragraf gol (și în mijlocul documentului); cursorul intră în prima celulă; Tab = celula următoare / rândul următor / rând nou din ultima celulă; Enter într-o celulă nu adaugă rând; Enter cu poza selectată o împinge pe rândul de dedesubt; Backspace cu poza selectată o șterge; Backspace după poză (neselectată) nu o șterge; fereastra Insert Table pornește cu 5 coloane și 2 rânduri. După judecător (27.09), tot prin COM: **provocarea în ordinea nouă** (text, „Ce mănâncă:”, tabel 2×3 completat cu Tab, apoi Enter la capătul propoziției și poza pisica.png) dă exact structura promisă, iar poza ocupă toată lățimea textului (454 pt), deci „clic în dreapta pozei” nu mai e cerut nicăieri. Arbitrul Word al dirijorului: 20 confirmate, 0 infirmate, 2 parțial (A09, A15), 5 netestabile prin COM. **Netestabil prin COM:** meniul de la Pictures, fereastra Insert Picture, eticheta grilei, poza selectată după inserare, clicul în dreapta pozei.

## Numele românești (regula 6)
| Română (Engleză) | Stare | Sursa |
|---|---|---|
| Inserare (Insert) — fila | CONFIRMAT | `calibrare\meniuri_ro_en.json` |
| Pornire (Home) — fila | CONFIRMAT | idem |
| Tabele (Tables), Ilustrații (Illustrations) — grupuri | CONFIRMAT | idem (grupurile nu sunt numite în text) |
| Imagini (Pictures) — butonul | CONFIRMAT în calibrare doar pentru PowerPoint; pentru Word, pagina Microsoft ro-ro „Inserarea imaginilor” scrie „Inserare > imagini” | **NESIGUR pentru Word** (probabil același) |
| Tabel (Table) — butonul | pagina Microsoft ro-ro „Inserarea unui tabel”: „faceți clic pe Inserare > tabel” | probabil; **nu e în calibrare** |
| Acest dispozitiv… (This Device…) | pagina Microsoft ro-ro scrie „Inserați > imagini > în acest dispozitiv” (traducere automată, inconsecventă) | **NESIGUR** — eticheta exactă din Word RO de văzut pe un calculator din laborator |
| Imagini stoc… (Stock Images…), Imagini online… (Online Pictures…) | aceeași pagină: „din stoc de imagini”, „imagini online” | **NESIGUR** |
| Inserare imagine (Insert Picture) — fereastra; Inserare (Insert) / Anulare (Cancel) — butoanele | pagina ro-ro: „selectați Inserare” | fereastra și „Anulare”: **NESIGUR** |
| Inserare tabel… (Insert Table…); Număr de coloane / Număr de rânduri | pagina ro-ro „Inserarea unui tabel”: „Inserare > tabel > Inserare tabel”, „numărul de coloane și numărul de rânduri” | etichetele câmpurilor: **NESIGUR** |
| Eticheta grilei („3x4 Table” în EN) | captura EN | în RO **NESIGUR** (probabil „Tabel 3x4”); lecția spune doar „întâi coloanele, apoi rândurile” |
| Imagini (Pictures) — folderul din Windows; Acest PC (This PC) | Windows din laborator e în română (README §6b) | folosit doar în simulator și provocare |

Paginile Microsoft ro-ro citite pe 27.09.2026: `support.microsoft.com/ro-ro/office/inserarea-imaginilor-3c51edf4-22e1-460a-b372-9329a8724344` și `support.microsoft.com/ro-ro/office/inserarea-unui-tabel-a138f745-73ef-4879-b99a-2f3d38be612a`.

## Simulatorul (`wordobj`, definit în pagină) — abateri spuse pe ecran
- cursorul se pune doar la capătul unui rând (paragraf) sau într-o celulă; în Word, oriunde în text;
- literele se tastează în caseta „Tastatura” (pe calculator, după clic în document, se poate tasta direct); pe telefon Enter și Tab sunt butoane;
- cu poza selectată, tastarea e oprită, cu mesaj („în Word, ce tastezi cu poza selectată ajunge în fața ei”);
- nu inserezi poze sau tabele într-o celulă (în Word se poate); mesaj pe ecran;
- „Ia-o de la capăt” nu există în Word (Ctrl+Z se învață abia la lecția 5);
- pe ecran cu atingere, grila de la Table cere două atingeri (prima arată mărimea, a doua pune tabelul); în Word, un clic (cerut de judecător, J15);
- fereastra Insert Picture are doar două foldere (Imagini, Descărcări), ca butoane deasupra fișierelor; în Word, panoul din stânga are mai multe;
- după o comandă dată cu mouse-ul (tabel, poză, Enter/Tab/⌫ de pe ecran), tastatura scrie din nou în document, ca în Word (J02);
- panglica e în engleză, ca Office-ul de pe calculatorul profesorului; pe ecran îngust arată doar iconițele, deci pagina spune care iconiță e Table și care e Pictures;
- fișierele de poze sunt desene CSS (inventate), nu fotografii.

## Ce n-am putut verifica
- tot ce e NETESTABIL / NESIGUR mai sus;
- dacă laboratoarele au Office 2016 sau 365 (drumul prin Pictures diferă);
- unde salvează browserul din laborator poza descărcată (implicit Descărcări / Downloads); numele „Descărcări” în fereastra Insert Picture pe Windows în română;
- dacă Word trece singur pe fila Table Design / Picture Format după inserare (provocarea spune prudent „poate trece”, J12);
- ce face tastarea peste o poză selectată în Word pe ecran (prin COM ajunge în fața pozei; mesajul simulatorului spune prudent „poate chiar s-o înlocuiască”, J13);
- capturile care lipsesc: `capturi_lipsa.json`.
