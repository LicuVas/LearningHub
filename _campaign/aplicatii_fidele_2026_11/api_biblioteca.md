# Contractul bibliotecii `aplicatii/` (Etapa 0, 16-17.11.2026)

Ce e: regulile pe care biblioteca centrală `C:/00/Projects/LearningHub_fidel/aplicatii/` (Windows, Explorer, Word, Excel,
PowerPoint, apoi Paint) le respectă, ca oracolele să o poată măsura și lecțiile să o poată folosi fără să deseneze nimic.
Se citește împreună cu `oracole/CONVENTIE_ARBORE.md` (cum își marchează biblioteca interfața, pentru O1/O2/O3/O7/O8) și cu
`contract.md` (R1-R13). Ce cere fiecare secțiune o verifică un oracol; secțiunile fără oracol sunt marcate „[regulă]”.

| § | ce | cine verifică |
|---|---|---|
| 1-2 | încărcarea, `setari.json`, profilurile | O1, O2, R3 (proba-mutant) |
| 3 | atributele din DOM (ținte) | O2-O3 (`CONVENTIE_ARBORE.md`), O4, O5, O9 |
| 4 | evenimentele standard | O5 `oracol_evenimente.py` |
| 5 | starea (`stare`) | O4 `oracol_comportament.py`, O6 |
| 6 | asistarea | O9 `oracol_asistare.py` |
| 7 | scenariile jucate în simulator | O4 + `oracole/sim_runner.js` |
| 8 | motorul lecțiilor, fereastra mică, bara pașilor | porțile I2 (`proba_fereastra_mica.py`, `test_joc.py`) |

O bibliotecă-jucărie care respectă §3-§7 (și NU e fidelă) stă în `oracole/_jucarie/` — dublura de test a oracolelor:
pe ea O4 dă 0 pe scenariile Explorer, O5 dă 0, O9 pică doar „lecția care ascultă”. Când nu știi cum se citește o regulă,
uită-te cum o face jucăria. Dovada că oracolele prind greșeli: `python oracole/oracol_comportament.py --autotest`
(la fel `oracol_evenimente.py`, `oracol_asistare.py`) — copii temporare, greșeli plantate, ultima linie = câte au scăpat.

## 1. Încărcarea: un `<script>` și un apel
```html
<script src="../../../aplicatii/aplicatii.js"></script>            <!-- singurul fișier pe care îl cere o pagină -->
<div id="loc-word"></div>
<script>LH.aplicatii.deschide('word', {loc: '#loc-word', continut: {paragrafe: ['Ana are mere.']}, sarcina: {...}})</script>
```
- `aplicatii.js` își află singur adresa (`document.currentScript.src`) și încarcă de lângă el `setari.json` și ce-i mai
  trebuie. Obiectul public: `window.LH.aplicatii`, cu aliasul `window.LHAplicatii` (același obiect; `CONVENTIE_ARBORE.md` §4.6).
- `LH.aplicatii.gata` — Promise, gata când `setari.json` s-a citit. `LH.aplicatii.versiune` — șirul din `setari.json`.
- `LH.aplicatii.deschide(nume, opt) -> Promise<Instanta>`; `nume` ∈ `windows | explorer | word | excel | powerpoint | paint`.
  `opt` = `{loc` (element sau selector; implicit `[data-lh-aplicatie-loc]`, altfel un `<div>` nou la capătul paginii),
  `continut` (§7.1: documentul / fișierele / celulele de pornire — formatul `start` al scenariilor), `profil` (§2),
  `sarcina` (§8.2), `asistent` (§6.3), `focus` (true = focusul tastaturii intră în zona de lucru, ca la pornirea aplicației
  reale), `scenariu` (true = deschisă de un oracol: nicio animație, nicio întârziere)`}`.
  Un al doilea `deschide` cu același `nume` în același `loc` înlocuiește instanța veche (o închide întâi).
- `opt.asistent` pornește asistentul prin funcția PUBLICĂ: `deschide` cheamă `window.LH.aplicatii.asistent(nume,
  opt.asistent)` (citit din obiectul public în momentul apelului, nu o referință internă păstrată la încărcare) — §6.3;
  `inchide` îl oprește. Jucăria: `L.deschide` / `L.inchide`.
- `Instanta` = `{aplicatie, radacina, stare(), element(tinta), focus(), inchide()}`.
- `LH.aplicatii.inchide(nume)`; `LH.aplicatii.tinte(nume) -> [ținte canonice vizibile]`.
- **`LH.aplicatii.radacini() -> Element[]`** (reparația 8, verificare_etapa0.md 3.b) — rădăcinile `[data-lh-aplicatie]`
  CREATE de bibliotecă (instanțele deschise, încă în pagină). Doar biblioteca pune atributul `data-lh-aplicatie`, pe
  elementul pe care îl creează în `deschide`, și doar biblioteca ține registrul (nicio funcție de „înregistrare” pentru
  lecții). O1 (`oracole/arbore_randat.js`) acceptă o rădăcină doar dacă e în această listă și pagina încarcă
  `aplicatii/aplicatii.js`; un `[data-lh-aplicatie]` pus de lecție = interfață desenată în pagină (se numără), iar o
  pagină care scrie singură atributul sau își definește `LH.aplicatii` / `radacini` se numără din citirea statică.
  Lecția are doar locul rezervat `data-lh-aplicatie-loc`. Jucăria: `L.radacini` din `oracole/_jucarie/aplicatii.js`.
- `LH.aplicatii.deschideSuprafata(cheie)` — plasa din `CONVENTIE_ARBORE.md` §4.6 (doar unde gestul nu există încă).
- Pagina-poligon: `aplicatii/poligon.html` încarcă biblioteca, are un `<div data-lh-aplicatie-loc>` și nimic altceva;
  `?aplicatie=word` deschide aplicația singur (pentru om). O4, O5, O9 lucrează pe ea.

## 2. `aplicatii/setari.json` (punctul central, R3) și `aplicatii/versiune.json`
(comentariile `//` sunt doar aici, pentru cititor; fișierul e JSON curat)
```
{ "versiune": "2026.11.17-1",
  "profil": {"word": "word365", "excel": "excel365", "powerpoint": "powerpoint365", "explorer": "windows11",
             "windows": "windows11", "paint": "paint11"},
  "limba": "en",                     // „en” = etichetele Office în engleză (azi); „ro” = comutatorul de mai târziu (I3)
  "tema": "auto",                    // „auto” | „luminos” | „intunecat”
  "asistare": {"dupaGreseli": 2, "dupaSecunde": 30},
  "evenimente": {"tampon": 500} }
```
- Profilurile: `word365` (implicit) și `word2007` (laboratorul clasei a VII-a: Ctrl+Z literă cu literă; I4); lecția poate
  cere `profil` doar dintre acestea. Profilul NU reduce interfața (R2): schimbă comportamentul, nu filele/grupurile/comenzile.
- Rădăcina poartă `data-lh-profil` și `data-lh-versiune`. `versiune.json` = `{runda, nonce}` (R9; îl scrie runda).
- O schimbare în `setari.json` sau în bibliotecă apare în toate paginile fără să atingi lecțiile (R3) — nicio lecție nu
  copiază etichete, culori sau texte de interfață.

## 3. Atributele din DOM
Tot ce e interfață stă sub rădăcina `[data-lh-aplicatie="<nume>"]`, creată și înregistrată de bibliotecă (§1,
`radacini()`; O1). Marcajul arborelui (`data-lh-suprafata`, `data-lh-tip`, `data-lh-eticheta`, `data-lh-id-mso`,
`data-lh-nesimulat`) e cel din `CONVENTIE_ARBORE.md`. Două reguli noi (17.11.2026):
- **`data-lh-eticheta` = textul de pe ecran** când elementul are text vizibil (reparația 9): O2/O3 compară TEXTUL
  VIZIBIL; un atribut care spune altceva decât ecranul („Insert” în atribut, „Inserare” pe ecran — riscul comutatorului
  RO) e o diferență în sine (`eticheta_declarata`). Butoanele doar cu pictogramă: `data-lh-eticheta` / `aria-label`.
  Textul vizibil se compară ÎNTREG: pe ecran scrie exact ca în Office („Insert”), nu „Inserare (Insert)” — numele pe
  „ambele” rămân doar în textul lecțiilor (I3); fiecare grup al panglicii își arată legenda (numele) sub el, nu doar
  în `aria-label` (`grup_fara_legenda`; reverificare_etapa0.md 6.a/6.b, 17.11.2026).
- **Mesajul „aici nu e simulată” poartă `data-lh-nesimulat`** (reparația 7b, R12): elementul în care biblioteca scrie
  mesajul central standard („În aplicația reală, X …; aici nu e simulată”) are atributul `data-lh-nesimulat` (fără
  `data-lh-tip`; valoarea recomandată = eticheta comenzii, ex. `data-lh-nesimulat="Mail Merge"`), stă sub rădăcină și
  are `role="status"`. O8 numără MOARTĂ o comandă citată de lecție a cărei singură urmare e un asemenea mesaj (atributul
  SAU unul dintre tiparele de text ale simulatoarelor vechi, `oracole/structura_lib.py › TIPARE_NESIMULAT`). Pe comenzile
  de pe drumul lecției mesajul nu e o ieșire: ele trebuie simulate. La fel, o comandă afișată GRI trebuie să fie gri și
  în aplicația reală (referința: `activ: false`), altfel O8 o numără moartă (reparația 7a).
- **Pictogramele se desenează SVG (icoanele Fluent, MIT — contract I7), nu ca text.** Regula textului vizibil citește orice text de pe ecran cu
  ≥ 2 litere ca NUME: o pictogramă scrisă ca text („Aa”, „ab”, „A▾”) ar fi comparată cu numele comenzii din referință
  și ar ieși diferență la O2/O3. Butonul doar cu pictogramă își spune numele prin `data-lh-eticheta` / `aria-label`;
  semnele care nu sunt nume (▾, ↘) stau în elemente `aria-hidden="true"`.

**Ecranul = starea (17.11.2026; O4, reparația 10 din verificare_etapa0.md).** O4 citește, pe lângă `stare()`, și ce e
PE ECRAN (`oracole/sim_runner.js › ecran` / `textEcran`) și numără o problemă pe fiecare paragraf / celulă unde cele două
diferă — un model corect cu un ecran neredesenat nu trece. Ca să se poată citi:
- **Word**: fiecare paragraf randat în `[data-lh-zona]` poartă ținta `text:N` (`data-lh-tinta="text" data-lh-id="N"` sau
  forma întreagă), cu N = 1, 2, … în ordinea documentului (N = indexul din `stare().text` + 1). Un paragraf GOL rămâne
  în DOM, cu înălțime (nu dispare, nu se contopește cu vecinul). Bucățile unui paragraf (un `<b>` în mijloc) pot purta
  aceeași țintă `text:N`: textul se adună în părinte.
- **Excel**: fiecare celulă randată poartă ținta `celula:<A1>` în `[data-lh-zona]`; ORICE celulă nevidă din
  `stare().celule` e randată și vizibilă (fără virtualizare care s-o scoată din DOM; grila arată cel puțin până la
  ultima celulă nevidă). `stare().celule[A1].text` = textul afișat în celulă (O4 îl compară; fără `text`, compară
  `valoare`, cu virgulă sau punct zecimal, TRUE/FALSE). O celulă în editare își arată textul într-un `input`/`textarea`
  din elementul celulei (O4 citește `value`).
- **Textul de pe ecran** al unui element = nodurile lui de text vizibile (fără `display:none`, fără `visibility:hidden`),
  plus valoarea câmpurilor de editare din el; `<br>` = rând nou. Tot ce NU e text al documentului — marcajele ¶ și ·,
  cursorul, mânerul de umplere, colțurile, decorațiile — stă în elemente `aria-hidden="true"` (altfel e citit ca text și
  iese diferență). Spațiile succesive se citesc ca unul, dacă elementul nu are `white-space: pre*`.

În plus:

| atribut | pe ce | sens |
|---|---|---|
| `data-lh-tinta="<fel>"` + `data-lh-id="<valoare>"` | orice element pe care elevul îl poate apăsa / ținti | **ținta canonică** = `<fel>:<valoare>` (fără `data-lh-id`: doar `<fel>`). Forma scrisă întreagă, `data-lh-tinta="celula:B2"`, e acceptată la fel. |
| `data-lh-id-mso="<idMso>"` | comenzile Office, filele | aliasul `mso:<idMso>` (ex. `mso:Bold`) rezolvă la acest element |
| `data-lh-zona` | zona de lucru (pagina Word, grila Excel, diapozitivul, lista Explorer, desktopul, pânza Paint) | unde se tastează și se face clic „în document”; elementele ei cu `data-lh-tinta` sunt rândurile/celulele/obiectele |
| `data-lh-selectat` | elementul (elementele) ales acum | |
| `data-lh-evidentiat` sau un `[data-lh-evidentiere]` peste element | ținta evidențiată de asistare (§6) | |
| `[data-lh-indiciu][data-lh-pentru="<tinta>"]` | bula indiciului | |
| `[data-lh-dialog-intrebare]` | textul principal al unei ferestre de dialog | ce citește `dialog.intrebare` (§5) |

Felurile de ținte (`<fel>`; valoarea = eticheta din aplicația reală, în limba ei — Office EN, Windows RO):
`fila` (Home, Insert…; File = `fila:File` sau `data-lh-id-mso="FileTabButton"`), `panglica` (`Home/Font/Bold`),
`lansator` (`Home/Font`), `meniu_derulant`, `acces_rapid` (Undo, Save), `zoom`, `meniu` (un rând din meniul deschis:
clic dreapta, ▾, galerie — `meniu:Duplicate Slide`, `meniu:Narrow`, `meniu:3x2 Table`), `fereastra` (un buton de dialog:
`fereastra:Da`), `camp` (`camp:nume_fisier` în Save As / Insert Picture), `dialog_salvare` (`dialog_salvare:Save`),
`backstage`, `text` (paragraful N din Word: `text:1`), `celula` (`celula:B2`), `maner_umplere`, `fila_foii`, `antet_coloana`,
`antet_rand`, `miniatura` (diapozitivul N în panoul din stânga), `diapozitiv`, `forma` (`forma:<diapozitiv>/<forma>`),
`margine_forma` (`margine_forma:<diapozitiv>/<forma>` = MARGINEA casetei: clicul pe ea alege caseta ca obiect, iar clicul
înăuntru pune cursorul în text, ca în PowerPoint; scrisă `data-lh-tinta="margine_forma"` + `data-lh-id="1/1"`, ca `forma`;
runda `acoperire` după runda 11, 20.11.2026 — critic.md › `margine_forma:D/S`),
`tabel`, `imagine`, `grafic`, `lista` (un element din folderul curent: `lista:tema.docx`), `arbore` (panoul de navigare:
`arbore:Ana`), `bara_comenzi` (`bara_comenzi:Nou`), `nav` (`nav:sus`, `nav:inapoi`, `nav:inainte`), `adresa`, `cautare`,
`cos` (`cos:notite.txt`), `desktop` (`desktop:Coș de reciclare`), `bara_activitati` (`bara_activitati:Start`), `start`,
`bara_titlu` (butoanele ferestrei aplicației din bara de titlu: `bara_titlu:Close` = ✕; runda `acoperire` 18.11.2026),
`camp:tip_fisier` (caseta Save as type a ferestrei Save As; idem),
`fereastra_app`, `unealta` (Paint), `culoare`, `panza`.
Țintele virtuale (nu sunt elemente; le dă `LH.aplicatii.dreptunghi(app, tinta) -> {x,y,width,height}` în coordonatele
ferestrei): `cuvant:<cuvânt>#<a câta apariție>[@stanga|@dreapta|@mijloc]`, `pozitie:<k>` (caretul înaintea caracterului k,
numărat ca `Range.Start` în Word: între paragrafe 1 caracter). Fără `dreptunghi`, rulatorul le caută singur în textul
randat al elementelor `text:N` din `[data-lh-zona]`.
- `LH.aplicatii.element(nume, tinta) -> Element|null` rezolvă ținta canonică și aliasurile (`mso:`), doar elemente vizibile.
- [regulă] Clasele CSS ale bibliotecii încep cu `lh-ap-` (motorul are deja `.tabs`, `.rb`, `.pg`, `.book`, `.foaie`).

## 4. Evenimentele standard (R6)
**Un eveniment pe fiecare gest fizic al elevului**, în orice aplicație: `CustomEvent('lh-aplicatie', {detail})` pe `window`.
```js
detail = { aplicatie: 'word',            // numele din §1
           gest:     'ctrl_b',           // FELUL gestului = partea de după punct din suprafete.json › gesturi[].id
           actiune:  'aldin',            // ce a înțeles aplicația; 'nesimulat' = comandă afișată, nesimulată (R12)
           tinta:    'panglica:Home/Font/Bold',  // ținta canonică (§3) a elementului apăsat; la taste: ținta focusului
           inainte:  {...}, dupa: {...}, // starea (§5) înainte și după gest — obiecte JSON (cel mult 50 KB fiecare)
           ts:       1763330000000,      // Date.now() la gest
           profil:   'word365',  pas: window.__lhPas || null,     // opționale
           activat:  'dialog_salvare:Save' }    // opțional: butonul apăsat de tastă fără să aibă focusul (vezi mai jos)
```
- Felurile de gest (din `suprafete.json`): `clic_fila`, `fila_file`, `clic_comanda_panglica`, `lansator_grup`,
  `meniu_derulant`, `acces_rapid`, `zoom`, `clic_dreapta`, `dublu_clic`, `shift_clic`, `ctrl_clic`, `selectie`, `tragere`,
  `umplere_tragere`, `rotita`, `tastare`, `sageti`, `alt_sageti`, `tasta_delete|backspace|enter|esc|tab|home_end|pagina|
  windows|f2|f4|f5|f12`, `ctrl_<literă>`, `ctrl_shift_<literă>`, `tasta_acces`. Un clic simplu în afara acestor ținte: `gest:'clic'`.
- **`tasta_acces`** (runda `acoperire`, 18.11.2026) = o tastă din șirul tastelor de acces ale panglicii / Backstage
  (KeyTips: Alt, apoi literele afișate pe file și comenzi; literele vin din referință, `uia_<app>.json › tasta_acces`,
  ex. Home „Alt, H”, Bold „Alt, H, 1”, Font Size „Alt, H, F S”). Câte UN eveniment pe tastă. Când tasta duce la capăt un
  șir (comanda e „apăsată”), `tinta` = ținta canonică a comenzii (§3), ca la clicul pe ea, iar `actiune` = ce a făcut
  aplicația (aceeași ca la clic). Tastele care doar arată literele (Alt) sau sunt începutul unui șir de mai multe litere
  („F” din „F S”) au `actiune: 'arata_taste_acces'` / `'prefix_tasta_acces'`, iar `tinta` = ținta focusului; ele NU
  sunt greșeli pentru asistent (§6.3), ca navigarea. Esc în modul tastelor de acces: `tasta_esc`.
- **`activat`** (opțional; runda `acoperire`, 18.11.2026) = ținta canonică (§3) a butonului pe care TASTA l-a apăsat
  fără ca butonul să fie ținta focusului: Enter într-o fereastră apasă butonul ei implicit (Enter în caseta File name a
  ferestrei Save As = Save: `gest:'tasta_enter'`, `actiune:'salvare'`, `tinta:'camp:nume_fisier'`,
  `activat:'dialog_salvare:Save'`). Sursa regulii: learn.microsoft.com/en-us/windows/win32/dlgbox/
  dlgbox-programming-considerations (ENTER → „IDOK or control identifier of the default push button”). `tinta` rămâne
  ținta focusului (regula de mai sus); `activat` lipsește când tasta n-a apăsat niciun buton. O lecție care așteaptă un
  buton îl recunoaște din `tinta` SAU din `activat` (§6.3 face la fel).
  Dublul clic = trei evenimente (`clic`, `clic`, `dublu_clic`); biblioteca îl recunoaște chiar dacă primul clic redesenează
  elementul (deci nu se bizuie doar pe `dblclick` nativ). O tragere nu emite și `clic`.
- La `tastare` în Word / Excel / PowerPoint, `dupa` diferă de `inainte` (tastarea schimbă documentul).
- Ascultarea în lecție: `const opreste = LH.aplicatii.asculta(ev => …)` (= `addEventListener('lh-aplicatie')`);
  ultimele `setari.evenimente.tampon` evenimente stau și în `window.__lhAplicatieEv`.
- [regulă, I10] Evenimentele rămân în pagină: biblioteca nu trimite nimic pe rețea; ce trimite deja motorul rămâne neschimbat.
- [regulă] Scurtăturile aplicației (Ctrl+…, Alt+săgeți, F-uri, Tab) se opresc cu `preventDefault` DOAR cât focusul e în
  rădăcină; în câmpurile de text ale aplicației (redenumire, Save As) Ctrl+A/C/V rămân ale câmpului.
- §4.4 Demonstrația (opțională): `LH.aplicatii.demonstratie(nume, gest) -> {pregatire:[ținta | {gest:'dublu_clic', tinta}]}`
  — ce trebuie apăsat ÎNAINTE ca un gest să aibă sens (Paint: unealta Selectare înaintea selecției; Word: dublu clic pe un
  cuvânt înaintea tragerii). O5 o face cu clicuri adevărate; ținta gestului însuși o alege tot O5 (§3), nu biblioteca.

## 5. Starea (`stare`)
`LH.aplicatii.stare(nume)` (sau `instanta.stare()`) -> obiect JSON. Cheile = **toate** cheile din `stare_citita` ale
scenariilor aplicației (`scenarii/<aplicatie>/*.json`), cu sensul scris în `descriere` și forma din
`referinte/scenarii_real/<id>.json` (o cheie lipsă = o diferență la O4). Azi:
Ce spune `stare()` la `text` / `celule` trebuie să fie ȘI pe ecran (regula „ecranul = starea”, §3; O4).
- **word**: `text` (LISTA paragrafelor — un `Array` de șiruri, nu un șir unit cu `\n` — fără ¶ de la capăt), `formatare_pe_caractere` (bucăți la rând
  `{text, bold, italic, underline, marime}`), `selectie` `{de_la, pana_la, text}`, `aliniere_paragrafe`, `stil_paragrafe`,
  `liste`, `tabele`, `imagini`, `pagina`, `cuvinte`, `nume_fisier`, `dialog_salvare` `{titlu, nume_propus, tip_propus}`;
  din runda `acoperire` (18.11.2026; sensul exact în `descriere` a scenariilor `word-ctrl-*`, `word-salvare-pdf`,
  `word-x-nesalvat-cancel`): `dialog` `{titlu, intrebare, butoane, apasat}` (fereastra care întreabă, ca la Explorer),
  `documente_deschise`, `titlu_fereastra`, `pagina_backstage`, `tip_salvare_afisat`, `fisiere_salvate`;
- **excel**: `celule` `{A1: {valoare, text, formula?}}` (`text` = ce se vede în celulă), `format_celule`, `selectie` `{activa, zona}`, `nume_fisier`;
  din runda `acoperire` după runda 7 (19.11.2026; sensul exact în `descriere` a scenariilor `excel-ctrl-n`,
  `excel-ctrl-w-modificat`, `excel-column-width-enter`, `excel-numere-afisare`, `excel-wrap-de-doua-ori`, `excel-av-tab`):
  `fereastra_mesaj` `{titlu, texte, butoane}` (mesajul apărut după ultimul pas, `null` dacă niciunul), `ramane_in_editare`
  (true/false), `dialog` `{titlu, intrebare, butoane, apasat}` (fereastra care întreabă, ca la Word), `registru_activ`
  (numele registrului activ, `null` fără registru), `latimi_coloane` `{litera: px}` și `inaltimi_randuri` `{rând: px}`
  (doar cele diferite de standard; px la 100% = puncte × 4/3), iar în `format_celule` câmpul `incadrare: true` (Wrap Text);
- **powerpoint**: `diapozitive`, `formatare_text`, `tema`, `tranzitie_galerie`, `animatie_galerie`, `nume_fisier`;
  din runda `acoperire` după runda 11 (20.11.2026; sensul exact în `descriere` a scenariilor `powerpoint-ctrl-n`,
  `powerpoint-ctrl-w-modificat`, `powerpoint-font-color-titlu`, `powerpoint-ctrl-c-v-caseta`, `powerpoint-sageata-dreapta`,
  `powerpoint-durata-aplica-la-toate`, `powerpoint-animatii-move-up`, `powerpoint-fundal-aplica-la-toate`):
  `prezentare_activa` (numele prezentării active, `null` fără prezentare), `prezentari_deschise` (câte),
  `dialog` `{titlu, intrebare, butoane, apasat}` (fereastra care întreabă, ca la Word/Excel; butoanele în ordinea de pe
  ecran, sus-jos și stânga-dreapta), `culoare_text` (#RRGGBB, literele casetei din `forma_citita`), `durata_tranzitie`
  (secundele tranziției fiecărui diapozitiv, 2 zecimale), `ordine_animatii` (pe diapozitivul activ, indicele formei — de la
  1, în ordinea din Shapes — al fiecărei animații, în ordinea din Animation Pane), `fundal_diapozitive`
  (`[{tip: solid|gradient|imagine|textura|model|alt, culoare?}]`, culoarea doar la `solid`), `forme_diapozitiv`
  (pe diapozitiv, `[{fel: substituent|forma|imagine|caseta_text|tabel|alta, forma?, text}]`, `forma` = numele din galeria
  Shapes, ex. „Arrow: Right”) și `pozitii_forme` (pe diapozitiv, `[[stânga, sus, lățime, înălțime]]` în puncte, rotunjite).
  `culoare` NU intră în `formatare_text` (forma ei rămâne `{text, bold, marime}`);
- **explorer**: `nume_fisiere` (numele reale din folderul de lucru, cu extensie, folderele cu „/” — comparate ca mulțime),
  `ordine_afisata` (în ordinea vederii), `in_cos`, `continut_fisiere`, `dialog` (ultimul dialog apărut:
  `{titlu, intrebare, butoane, apasat}`, `null` dacă n-a fost niciunul), `cale_curenta`, `selectie`;
- **windows**: `ferestre` `[{aplicatie, titlu, stare: normal|max|min, activa, x, y, w, h}]`, `meniu_start_deschis`;
- **paint**: `unealta`, `culoare`, `dimensiune`, plus ce cer scenariile Paint când apar.
Verificarea unei sarcini se face pe stare, nu pe ultimul clic (glosar: „verificăm”).

## 6. Asistarea (R7)
- `LH.aplicatii.evidentiaza(tinta, {aplicatie}) -> Element|null`: marchează ținta (`data-lh-evidentiat` sau un
  `[data-lh-evidentiere]` peste ea, cu `pointer-events:none`) și o aduce în fereastră.
- `LH.aplicatii.indiciu(tinta, text, {aplicatie}) -> Element|null`: o bulă `[data-lh-indiciu][data-lh-pentru=tinta]` cu
  textul, LÂNGĂ țintă (cel mult 48 px), întreagă în fereastră, fără să-i acopere centrul (clicul elevului ajunge la țintă).
- `LH.aplicatii.ascunde()`: scoate bulele și evidențierile.
- **§6.3** `LH.aplicatii.asistent(nume, {pasi: [{tinta, indiciu, asteapta?}], dupaGreseli: 2, dupaSecunde: 30}) -> {opreste(), pas()}`
  (și `deschide(..., {asistent: {...}})`). Pasul curent e făcut când vine un eveniment al aplicației cu `tinta` = ținta
  canonică a pasului (aliasul `mso:` se rezolvă), cu `activat` (§4) = ținta canonică a pasului, sau `asteapta(ev)` =
  true. **Greșeală** = orice alt eveniment al aplicației, în afară de `rotita`, `sageti`, `tasta_home_end`,
  `tasta_pagina` și `tasta_acces` cu `actiune` `arata_taste_acces` / `prefix_tasta_acces` (§4). După `dupaGreseli` greșeli la rând SAU după
  `dupaSecunde` secunde fără pasul făcut: `evidentiaza` + `indiciu` pe ținta pasului. Pasul făcut: bula și evidențierea
  dispar, contoarele și ceasul pornesc de la zero pentru pasul următor. Ceasul repornește și la `lh-pas` (motorul schimbă pasul).
  Asistentul de mai mulți pași: după pasul k făcut, evidențierea și indiciul (la greșeli sau la ceas) vin pe ținta
  pasului k+1, niciodată pe un pas deja făcut (O9, cazul G).
- **Cum greșește O9** (cazurile C, G, H, F): clic ADEVĂRAT într-un loc GOL al zonei de lucru (`[data-lh-zona]`, un punct
  care nu stă pe altă țintă; la Excel e voie o celulă) și rotița peste zonă; săgețile cu focusul în rădăcină. Deci, în
  fiecare aplicație, zona de lucru e vizibilă la deschidere și are puncte libere; clicul acolo emite `clic` (§4), rotița
  `rotita`, săgețile `sageti` — iar `rotita` și `sageti` NU sunt greșeli (cazul H: rotița ×3 + săgeata ↓ ×3 → fără
  indiciu; apoi o greșeală → nimic, a doua → indiciul).
- **Convenția pentru cazul F (lecțiile)** — O9 deschide fiecare lecție în Chrome și înfășoară `asistent` / `deschide` ale
  obiectului public, ca să vadă pașii ceruți de LECȚIE (nu ce raportează biblioteca):
  (a) obiectul `window.LH.aplicatii` / `window.LHAplicatii` NU se îngheață (`Object.freeze`, `defineProperty` fără
      `writable`): `asistent` și `deschide` rămân proprietăți scriibile;
  (b) orice asistent pornit de o lecție trece prin funcția PUBLICĂ `LH.aplicatii.asistent(nume, cfg)`: direct, din
      `deschide(nume, {asistent})` (§1) sau din `tipMotor` / exercițiul `{t:'aplicatie', asistent}` (§8.1) — nu printr-o
      referință internă; `cfg.pasi[k].tinta` = ținta canonică (§3), iar obiectul întors are `pas()` = indexul pasului curent;
  (c) lecția pornește asistentul la încărcare (în ≤ 5 s de la `load`), cu aplicația pe ecran. Un asistent pornit mai
      târziu (după „Începe” sau la exercițiul k > 1) nu e văzut de F: lecția iese „fără asistent”.
- Asistarea NU face gestul în locul elevului: nu emite evenimente și nu schimbă starea (O9 verifică).
- Bula și evidențierea stau în rădăcina aplicației (dispar cu ea); rădăcina are `isolation:isolate`, deci nimic din
  bibliotecă nu urcă peste bara de sus a motorului sau peste bara pașilor.
- Cel puțin o lecție pe aplicație pornește asistentul (O9, cazul F, jucat în Chrome pe lecție: pagina încarcă
  `aplicatii/aplicatii.js` și pornește asistentul după convenția de mai sus; 1 greșeală → fără indiciu, a 2-a → indiciul pe
  ținta pasului curent). Un comentariu sau un text în pagină nu mai ajunge.

## 7. Scenariile jucate în simulator (O4)
Rulatorul: `oracole/sim_runner.js` (injectat de O4 în `aplicatii/poligon.html`). Biblioteca NU joacă scenariul: rulatorul
face gesturile cu mouse-ul și tastatura adevărate (Playwright), biblioteca doar arată ținta și dă starea.
1. **Pornirea**: `deschide(scenariu.aplicatie, {loc, continut: scenariu.start, profil: scenariu.profil, scenariu: true, focus: true})`.
   `continut` = obiectul `start` din formatul comun, neschimbat: Word `{paragrafe, cursor, selectie, aliniere, tabel}`,
   Excel `{celule, selectie, format}`, PowerPoint `{diapozitive: [{aspect, texte}], diapozitiv_activ, panou, selectie_text,
   selectie_forma, forma_citita}`, Explorer `{folder, arbore, continut, setari: {extensii_vizibile, confirmare_la_cos},
   sortare, sursa_lipirii: {folder, arbore, continut}}` (folderul de lucru și, alături de el, folderul sursă).
2. **Pasul -> ținta** (`LHSimRunner.tintaPas`): `id_mso`/`mso` -> `mso:<id>` (cu `fila` -> întâi clic pe `mso:<fila>` dacă e
   pe ecran); `celula` -> `celula:<A1>`; `diapozitiv` -> `miniatura:<n>`; `forma:[d,s]` -> `forma:<d>/<s>`; `cuvant`
   (+`aparitia`, `capat`) -> `cuvant:<c>#<n>@<capat>`; `de_la` = `pana_la` (număr) -> `pozitie:<k>`; Explorer: un nume
   simplu -> `lista:<nume>`, `comanda_panglica` din „bara de comenzi” -> `bara_comenzi:<comanda>`; `meniu {element}` ->
   `meniu:<element>`; o `tinta` care începe cu `<fel>:` rămâne cum e.
3. **Gesturile**: `clic` / `dublu_clic` / `triplu_clic` / `clic_dreapta` (+`modificatori`) pe centrul țintei (la țintele
   virtuale: punctul cerut din dreptunghi); `taste` (+`repeta`) = `keyboard.press`; `tasteaza` = `keyboard.type` acolo unde
   e focusul (`in` e doar informativ); `trage {de_la, la}` / `{ce: patratelul_de_umplere, sursa, destinatie}` (alege `sursa`,
   apoi trage `maner_umplere` până la ultima celulă din `destinatie`) / `{forma, cu:[dx,dy]}` (deplasare în puncte ×
   `LH.aplicatii.pxPePunct(app)`, implicit 1); după `comanda_panglica`: `element` -> clic pe `meniu:<element>`,
   `randuri`+`coloane` -> `meniu:<coloane>x<randuri> Table`, `nume`/`fisier` -> `camp:nume_fisier` (Ctrl+A, scrie, Enter).
4. **Navigarea în Explorer** (`LHSimRunner.drum`): `lista:Ana/tema.docx` = tema.docx din folderul Ana; dacă nu ești în Ana,
   rulatorul intră (dublu clic pe `lista:Ana`, clic pe `arbore:Ana` sau `nav:sus` până apare). Cere: țintele `lista:`,
   `arbore:`, `nav:sus` și cheia `cale_curenta` în stare.
5. **Dialogurile**: `stare().dialog` = ultimul dialog apărut cu `{titlu, intrebare` (textul `[data-lh-dialog-intrebare]`),
   `butoane` (etichetele, în ordinea din fereastră), `apasat}`, ca în `referinte/scenarii_real/explorer_*.json`.
6. **Ce iese**: `runde/_sim/<id>.json` = `{id, mod_probat, stare, eroare, cum}` (forma rezultatului real). O4 numără chei
   diferite + scenarii neexecutabile + scenarii fără rezultat real probat.

## 8. Lecțiile, motorul, fereastra mică, bara pașilor
1. [regulă] O lecție pe motor folosește tipul comun `LH.aplicatii.tipMotor`:
   `JocMotor.porneste({…, tipuri: {aplicatie: LH.aplicatii.tipMotor}})` și, în exercițiu,
   `{t: 'aplicatie', aplicatie: 'word', continut: {...}, profil?, sarcina: {cerinte: [{ce, verifica: stare => bool}]}, asistent?}`.
   `tipMotor.render(Q, body, api)` deschide aplicația în `body` (`#body` conține DOAR rădăcina bibliotecii —
   `CONVENTIE_ARBORE.md` §6); „Verifică” cheamă `sarcina` pe `stare()` și dă verdictul prin `api.resolve`;
   `tipMotor.rezolva` / `tipMotor.gresit` există pentru poarta `test_joc.py` și pentru `oracol_sarcini.py` (O6).
2. [regulă] Fereastra mică (`jocuri/_motor/proba_fereastra_mica.py`): biblioteca nu pune nimic în `ol[data-real-lista]`
   (fereastra Picture-in-Picture o copiază fără scripturi); nu ține focusul și nu prinde taste când focusul e în afara
   rădăcinii; nu deschide ferestre și nu schimbă `window.__lhPas`. Poarta rămâne 0.
3. [regulă] Bara pașilor (`nav.tabs` a motorului, evenimentul `lh-pas`): biblioteca nu folosește clasa `.tabs`; la `lh-pas`
   repornește ceasul asistentului; când motorul redesenează pagina (`#app` rescris), instanța desprinsă își oprește singură
   ceasurile și ascultătorii (verifică `radacina.isConnected`).
4. [regulă, I1] La 360-390 px panglica se derulează lateral (ca `ui-panglica.js`), nu se taie; zonele de atins ≥ 32 px.
5. [regulă] Nicio dată despre elevi în stare sau în evenimente; nimic pe rețea.
