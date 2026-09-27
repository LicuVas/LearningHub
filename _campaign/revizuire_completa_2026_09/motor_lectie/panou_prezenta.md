# Panoul de prezență peste lecții — reparat (27.09.2026)

Fișier schimbat: **doar** `assets/js/prezenta.js` (CSS-ul lui e în același fișier). Nu am atins `jocuri/_motor/`, paginile lecțiilor sau altceva. Fără commit, fără publicare.
Tot ce e mai jos (scripturi, măsurători, capturi, ieșirile probelor) stă în dosarul `panou_prezenta/` de lângă acest fișier.

## Ce era

Panoul de prezență (`#lhp`) stă fix, în colțul din stânga-jos al ecranului, deasupra oricărui conținut.

- **Întrebarea „Lucrezi pentru ora de informatică? Spune cine ești”** avea **227 px** pe telefon (390×844) și **208 px** pe calculator (1280×800). Rămânea acolo până răspundea elevul, oricât derula sau lucra. Acoperea partea de jos a simulatorului și butonul „Verifică”.
- **Eticheta mică** („Sunt elev — mă înscriu” sau „Profesorul vede activitatea ta · Ana P.”, 29 px) stătea exact unde ajunge „Verifică” când elevul derulează până îl vede jos. Pe telefon, un clic pe „Verifică” pica atunci pe etichetă și deschidea formularul sau meniul.
- Spațiul lăsat liber la baza paginii (`padding-bottom`) ajuta doar la capătul paginii. La mijloc, unde sunt exercițiile, nu ajuta la nimic.

## Ce am schimbat — două lucruri

**1. Întrebarea se strânge la primul gest al elevului.** Întrebarea încă apare întreagă la intrarea în pagină, ca elevul să o vadă. La prima lui mișcare în pagină (apasă, derulează sau tastează în afara panoului) devine o etichetă mică: **„Spune cine ești · pentru ora de informatică”**. Apăsată, eticheta deschide direct formularul de înscriere. Dacă elevul apasă chiar pe întrebare, dar nu pe un buton (cum a pățit judecătorul care voia diapozitivul), întrebarea se strânge la fel.

- Tot așa se strâng lista „Cine lucrează acum?” (devine eticheta „Cine lucrează acum? Alege-te din listă”) și meniul etichetei.
- **Nu se strâng**: „Ești tot X?”, pentru că fără răspuns timpul rămâne pus deoparte, și formularele (elevul scrie în ele).
- Nimic nu se salvează: la pagina următoare întrebarea apare din nou întreagă. „Nu, doar vizitez” și „Mai târziu” fac exact ce făceau înainte.

**2. Eticheta nu mai stă niciodată peste ceva ce se poate apăsa.** După fiecare derulare sau schimbare a paginii, eticheta verifică ce are dedesubt, cu o margine de 6 px cât un deget. Contează ca „de apăsat”: buton, legătură, câmp, celulă de simulator, orice are cursor de mână sau de text, o bandă care se derulează în lateral.

- Dacă locul din stânga-jos e liber, stă acolo, ca înainte.
- Dacă nu e liber, devine un **buton rotund de 32 px în dreapta-jos**. Pe lecțiile noi, acolo e marginea caietului.
- Dacă și locul acela e ocupat, **dispare** și lasă clicurile să treacă până se eliberează locul. Între două stări nu se mișcă decât opacitatea (se estompează).

Textul „Profesorul vede activitatea ta” rămâne în pagină și în forma rotundă, pentru cititoarele de ecran și pentru probe.

**De ce așa și nu altfel:**
- Să mut eticheta sus nu merge: sus e bara lipicioasă a lecției.
- Să o pun „în flux” pe paginile cu motor: elevul n-ar mai vedea în timpul lucrului că profesorul îi vede activitatea, ceea ce a cerut Vasile. În plus, ar fi trebuit să știe de structura motorului.
- Doar spațiu liber jos (`padding-bottom`) există deja și nu ajută la mijlocul paginii.

Soluția aleasă e generală: pe restul sitului eticheta arată și se poartă ca înainte, doar că se dă la o parte din calea butoanelor. Nu se schimbă nimic din înregistrarea minutelor, din trimiteri, din sertare sau din înscriere. Diferența în cod: `panou_prezenta/prezenta.js.diff` (+86 / −9 rânduri). Copia versiunii vechi e în `panou_prezenta/prezenta.js.inainte`.

## Măsurători înainte / după

Script: `panou_prezenta/masoara.py` (Playwright, Chromium). Varianta „înainte” servește versiunea veche din copie, deci fișierul din site nu a fost atins pentru ea. Rezultate în `masurat_INAINTE.txt/.json` și `masurat_DUPA.txt/.json`.

Pagini măsurate: lecția VI/4, lecția VIII/4, jocul excel-viii. Pe fiecare am trecut prin toți pașii părții 1 plus atelier (simulatorul PowerPoint sau Excel), în 3 situații ale elevului (neînscris, vizitator, înscris) și pe 2 ecrane. În fiecare pas am derulat toată pagina din 40 în 40 px și am încercat, la fiecare poziție, clicuri pe o grilă de 24 px peste exercițiu. „Verifică” l-am adus și la marginea de jos a ecranului, cum face un elev.

„Clicuri pe ceva de apăsat” = puncte din exercițiu în care clicul nimerea panoul deși dedesubt era un buton, o legătură, un câmp sau o celulă. Oracolul acesta e scris separat și nu folosește regula din `prezenta.js`.

| Ecran · pagină · elev | Înălțime panou după primul gest (înainte → după) | „Verifică” jos pe ecran: clicul nimerește panoul (ecrane din pas) | Poziții de derulare cu „Verifică” acoperit | Clicuri pe ceva de apăsat care nimeresc panoul |
|---|---|---|---|---|
| telefon · VI/4 · neînscris | 227 → 29–32 px | 6/6 → **0/6** | 32 → **0** | 4 370 → **0** |
| telefon · VI/4 · vizitator | 29 → 29 | 6/6 → **0/6** | 2 → **0** | 263 → **0** |
| telefon · VI/4 · înscris | 29 → 29 | 6/6 → **0/6** | 2 → **0** | 512 → **0** |
| telefon · VIII/4 · neînscris | 227 → 29–32 | 8/8 → **0/8** | 43 → **0** | 6 230 → **0** |
| telefon · VIII/4 · vizitator / înscris | 29 → 29 | 8/8 → **0/8** | 4 → **0** | 259 / 625 → **0** |
| telefon · excel-viii · neînscris | 227 → 32 (sau ascuns) | 3/3 → **0/3** | 18 → **0** | 1 899 → **0** |
| telefon · excel-viii · vizitator / înscris | 29 → 29 | 3/3 → **0/3** | 3 → **0** | 74 / 194 → **0** |
| calculator · VI/4 · neînscris | 208 → 29–32 | 6/6 → **0/6** | 29 → **0** | 1 631 → **0** |
| calculator · VIII/4 · neînscris | 208 → 29–32 | 8/8 → **0/8** | 39 → **0** | 1 872 → **0** |
| calculator · excel-viii · neînscris | 208 → 32 | 3/3 → **0/3** | 15 → **0** | 418 → **0** |
| calculator · toate · vizitator / înscris | 29 → 29 | 0 → 0 | 0 → 0 | 0 → 0 |

Ultima linie a scriptului (câte combinații au măcar o problemă): **înainte 12 din 18, după 0 din 18**. Erori în consolă: 0 înainte, 0 după.

**Clicul pe panou înainte de orice gest.** Un clic chiar pe întrebarea mare, dar nu pe un buton ei, lăsa înainte panoul de 227 px pe loc. Acum panoul se strânge la 29–32 px (măsurat pe VI/4 și VIII/4 pe telefon și pe VI/4 pe calculator).

**Ce acoperă încă, doar vizual, eticheta de 29 px.** Pe telefon, 1,6% din punctele exercițiilor sunt sub etichetă. Sunt numai text și rama caietului: enunțul, lista „Testele tale”, eticheta „Încearcă tu”, tabelul static „Uite cum”. Am verificat cu `vizibilitate_eticheta.py` și cu un diagnostic separat ce anume stă dedesubt.

**Cât se vede eticheta** (`vizibilitate_eticheta_DUPA.txt`, elev înscris, toate pozițiile de derulare):

| Ecran | Plină (stânga-jos) | Buton rotund (dreapta-jos) | Ascunsă |
|---|---|---|---|
| Telefon | 34–54% | 33–41% | **9–24%** |
| Calculator | 66–79% | 20–33% | **0%** |

Pe telefon se ascunde doar când în ambele colțuri e ceva de apăsat, de exemplu panglica sau foaia Excel pe toată lățimea.

Capturi (în `panou_prezenta/`): `INAINTE_*` și `DUPA_*`, cu `tel`/`pc`, pagina `vi`/`excel-viii` și starea elevului.

- `_1incarcare`: pagina la încărcare.
- `_2verifica`: „Verifică” adus jos pe ecran.
- `_3atelier`: simulatorul PowerPoint sau Excel.

Cele mai grăitoare: `INAINTE_tel_vi_necunoscut_2verifica.png` / `DUPA_tel_vi_necunoscut_2verifica.png` și `INAINTE_tel_vi_activ_2verifica.png` / `DUPA_tel_vi_activ_2verifica.png`.

## Înscrierea, „Mai târziu”, înregistrarea activității

| Probă | Înainte | După |
|---|---|---|
| `jocuri/_motor/proba_prezenta.py`: pe serverul VIU, cu ștergerea înregistrărilor de probă la final. Înscriere, trimitere fără nume în clar, minutele ajung pe server (≥25 s), nota, timpul se oprește fără mișcare, nivelurile jocului, „Ești tot X?”, vizitator + „Mai târziu”, telefon + jurnal | 37 ok, 0 probleme | **37 ok, 0 probleme**, aceleași verificări |
| `proba_sertare.py` | 15 ok, 0 | **15 ok, 0** |
| `proba_tinut.py` | 0 | **0** |
| `proba_inscriere_telefon.py` | 0 | **0** |
| `proba_diploma.py --fara-trimitere` | 0 | **0** |
| `panou_prezenta/proba_flux_nou.py` (nouă, telefon, fără server viu): întrebarea se strânge la primul gest; eticheta → formular; „Mai târziu” → înapoi la etichetă fără refuz salvat; înscrierea din etichetă; trimiterea la /api/activitate fără nume în clar; jurnalul crește cu mișcare; meniul se închide la un gest; lista se strânge și se alege din ea; „Ești tot X?” NU se strânge; 0 erori în consolă | — | **20 ok, 0 probleme** |

Ieșirile sunt în `proba_*_INAINTE.txt` / `proba_*_DUPA.txt`.

**Un lucru găsit pe drum.** În prima variantă, eticheta strânsă avea alt id, iar `proba_sertare.py` pica: elevul se joacă neînscris, apoi caută butonul `#lhp-cine`. Acum eticheta strânsă poartă chiar id-ul `lhp-cine` și deschide formularul, deci și proba, și un elev care se înscrie după ce a lucrat găsesc „Spune cine ești” în același loc.

## `test_joc.py --toate`

Rulat înainte de schimbare și după versiunea finală:

- `panou_prezenta/test_joc_toate_INAINTE.txt` și `test_joc_toate_DUPA.txt` sunt **identice octet cu octet**: 27 [TRECUT], 2 [SARIT] (diploma, ghiduri, jocuri vechi), aceleași avertismente, cod de ieșire 0.
- `jocuri/_motor/motor.js` e modificat în lucru de altcineva. Nu garantez că ambele rulări au prins exact aceeași versiune a lui; rezultatele sunt însă identice.

## Ce rămâne de știut

- Întrebarea mare apare încă întreagă la intrarea în pagină, până la primul gest. E voit: altfel elevii n-ar mai vedea-o deloc.
- „Ești tot X?” rămâne mare și pe loc până răspunde elevul, cum a fost gândită.
- Pe telefon eticheta e ascunsă în 9–24% din pozițiile de derulare. Reapare imediat ce elevul derulează într-un loc liber, iar la capătul paginii are mereu loc.
- Situl nu e publicat. Schimbarea e doar în fișierul local; publicarea și commit-ul rămân pentru cine le face.
