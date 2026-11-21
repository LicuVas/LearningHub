# Biblioteci gratuite pentru simularea aplicațiilor (cercetare, 21.11.2026)

Întrebarea: există biblioteci gratuite care rulează în browser și cu care să simulăm, în lecții, Windows 11, File Explorer,
Word, Excel, PowerPoint și Paint? Am judecat după cele 5 criterii din cerere, în ordinea lor: (1) lecția vede ce face elevul,
(2) lecția poate desena peste aplicație, (3) funcții reale suficiente, (4) aspect de Microsoft 365 / Windows 11,
(5) licență, fără server, mărime, telefon.

Cum am lucrat: licențele le-am citit azi din fișierul LICENSE sau din registrul npm, datele și stelele din API-ul GitHub,
versiunile din npm, iar mărimile le-am măsurat descărcând fișierul principal de pe jsDelivr și comprimându-l (gzip -9).
Unde scrie „nedocumentat” am căutat și n-am găsit. Unde scrie „nemăsurat” n-am măsurat.

---

## 1. Pe scurt

- **Nicio bibliotecă gratuită nu înlocuiește biblioteca noastră.** Am căutat una care să bifeze toate trei lucrurile pe o
  interfață cu panglică de Office: un eveniment pentru fiecare gest, starea documentului și poziția fiecărui buton. Să fie
  și fără server, să meargă pe telefon și să aibă licență MIT/Apache. N-am găsit niciuna. Biblioteca `aplicatii/` le are
  pe toate trei (`lh-aplicatie`, `stare()`, `element(tinta)`), deci rămâne baza.
- **Merită luate ca PIESE, sub biblioteca noastră:**
  - **Driver.js** (MIT, 14 KB comprimat): săgeți, chenare și „spot” peste orice aplicație. Îi dăm direct `instanta.element(tinta)`.
  - **Un motor de formule MIT** sub `excel.js`, ca să avem mai multe funcții fără să le scriem de mână:
    **fast-formula-parser / @sheetxl/formulas** (280 de funcții) sau **formula.js** (doar funcțiile, 43 KB).
  - **SheetJS CE** (Apache-2.0): „Salvează ca .xlsx” cu fișier adevărat, plus deschiderea fișierelor profesorului.
  - **Fluent System Icons** (MIT, de la Microsoft): pictograme apropiate de Microsoft 365 / Windows 11.
  - **Tiptap / ProseMirror** (MIT), ca motor de editare sub `word.js`, dacă Word-ul nostru rămâne în urmă la tabele,
    liste sau anulare.
- **Paint:** **JS Paint** (MIT, merge cu degetul) se poate pune azi într-un iframe. Arată însă ca Paint din Windows 98,
  nu ca Paint din Windows 11, și nu anunță ce face elevul.
- **NU:**
  - Handsontable: licența gratuită e doar pentru uz personal sau evaluare.
  - Syncfusion: exclude organizațiile finanțate din bani publici.
  - ONLYOFFICE: are nevoie de server.
  - Univer, ca înlocuitor pentru `excel.js`: graficele, .xlsx și tipărirea sunt plătite, iar nucleul are ~2,5 MB comprimat.
  - HyperFormula, CKEditor și TinyMCE au licență GPL, care ar trage toată biblioteca sub GPL.
  - PPTist, SuperDoc, Shepherd.js și Intro.js au licență AGPL.
- **De urmărit:** **WordCraft / GridCraft / DeckCraft** (MIT sau Apache-2.0). Au panglică ca în Office, rulează static
  în browser, iar WordCraft are și interfață în română. Sunt însă în stadiul alfa, desenează totul pe canvas (lecția nu
  vede butoanele) și cântăresc 10-22 MB.

---

## 2. Tabel pe aplicație

Legendă:
- „Evenimente + stare”: dacă lecția poate afla ce a făcut elevul și cum arată documentul.
- „Poziție”: dacă putem afla dreptunghiul unui buton sau al unei celule, ca să desenăm o săgeată peste el.
- „Mărime”: cât descarcă elevul, comprimat (măsurat azi) sau, unde scrie „npm”, mărimea pachetului despachetat (nu e ce
  descarcă elevul, e doar un ordin de mărime).
- Versiunea și data vin din npm (ultima publicare), iar unde nu e pe npm, din ultimul commit GitHub.

Pentru comparație, biblioteca noastră are ~0,8 MB necomprimat (cele 8 fișiere .js) și ~0,25 MB comprimat (.js + .css),
măsurat azi. Cererea pomenea ~0,4 MB, probabil cu tot cu `date/` și `profiluri/`.

### 2.1 Excel (foaie de calcul)

| Biblioteca | Licența | Întreținută | Evenimente + stare | Poziție pentru săgeți | Fără server | Telefon | Mărime | Seamănă cu Excel 365 | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **Univer Sheets** | [Apache-2.0](https://github.com/dream-num/univer/blob/dev/LICENSE) pentru nucleu; graficele (`@univerjs-pro/sheets-chart`), schimbul .xlsx și tipărirea au licență comercială „Univer Office SDK Licensing” ([prețuri](https://univer.ai/pricing)) | da: 1.5.2 (16.11.2026), 31 mii stele | **da, bogat**: [`univerAPI.addEvent`](https://docs.univer.ai/guides/sheets/features/core/general-api) cu `SelectionChanged`, `SheetValueChanged`, `CellClicked`, `SheetEditEnded`, `SheetRangeSorted`, `SheetRangeFiltered`, `CommandExecuted` / `BeforeCommandExecute` (poate și anula comanda), `SheetDeleted` ([cod](https://github.com/dream-num/univer/blob/dev/packages/sheets/src/facade/f-event.ts)); citire cu `getRange().getValues()` | **da, pentru celule**: [`FRange.getCellRect(): DOMRect`](https://github.com/dream-num/univer/blob/dev/packages/sheets-ui/src/facade/f-range.ts); pentru butoanele panglicii: nedocumentat | da (fără colaborare și fără conversie de fișiere, care cer Server SDK) | există un [plugin pentru mobil](https://docs.univer.ai/showcase/sheets/mobile-via-plugin), „editare de bază” | **~2,5 MB comprimat** (15 pachete de bază, măsurat; fără React și RxJS) | panglică proprie cu 4 moduri ([`RibbonType`](https://github.com/dream-num/univer/blob/dev/packages/ui/src/controllers/ui/ui.controller.ts): collapsed / simple / classic / grid), nu e copia Excel; desenează foaia pe canvas | cel mai bun motor gratuit, dar **nu ca înlocuitor**: fără grafice gratuite, de ~10 ori mai greu decât toată biblioteca noastră (.js + .css). Doar pentru un „Excel liber” fără grafice, dacă vom vrea vreodată |
| **FortuneSheet** | [MIT](https://github.com/ruilisi/fortune-sheet) | lent: 1.0.4 (06.11.2025) | parțial: `onOp` la fiecare schimbare; [API](https://ruilisi.github.io/fortune-sheet-docs/guide/api.html) de citire (`getCellValue`, `getSelection`, `getAllSheets`) | nu (doar lățimi și înălțimi, nu poziții) | da | „adaptare pentru mobil” bifată în plan, fără detalii | npm ~8 MB (React) | asemănător Google Sheets; **fără grafice** și fără tabele pivot (nebifate în README) | nu: doar React, fără grafice, fără poziții |
| **Luckysheet** | MIT | **arhivat** (depozitul spune „upgraded to Univer”) | — | — | — | — | — | — | nu: abandonat |
| **x-spreadsheet** | MIT | **abandonat**: npm 1.1.9 (2022), mutat la `wolf-table` | — | — | — | — | — | — | nu |
| **Jspreadsheet CE** | [MIT](https://github.com/jspreadsheet/ce) | da: 5.0.4 (25.08.2025), commit în 10.2026 | parțial: evenimente `on…` (README numește `onevent`, `onsave`, `onchangepage`) | probabil din DOM (tabel HTML; neverificat azi) | da | da („better mobile compatibility”) | **35 KB** comprimat | tabel web, fără panglică | nu: e mai puțin decât `excel.js`; util doar ca idee |
| **Handsontable** | [proprietar](https://github.com/handsontable/handsontable/blob/develop/LICENSE.txt): gratuit numai „strictly personal or solely for evaluation purposes”; altfel licență plătită | da: 18.1.3 (20.11.2026) | neverificat (exclus de licență) | neverificat | da | neverificat | npm 35 MB | grilă de date | **nu: licența nu acoperă un site școlar public** |
| **HyperFormula** (doar motor de formule, fără interfață) | [GPL-3.0 sau proprietar](https://github.com/handsontable/hyperformula/blob/master/LICENSE.txt) | da: 3.5.0 (09.10.2026) | da (motor fără interfață, cu graf de dependențe) | n/a | da | n/a | **204 KB** comprimat | n/a | doar dacă acceptăm GPL-3.0 pentru toată biblioteca |
| **fast-formula-parser** → acum **@sheetxl/formulas** | [MIT](https://github.com/LesterLyu/fast-formula-parser); [@sheetxl/formulas MIT](https://www.npmjs.com/package/@sheetxl/formulas) 1.0.7 (19.11.2026) | vechiul depozit: commit 09.2025; README îndeamnă la mutare | n/a: interpretor de formule plus listă de dependențe (`DepParser`) | n/a | da | n/a | 81 KB comprimat (declarat în README) | n/a | **da, candidat** pentru funcții în plus sub `excel.js` (280 de funcții, între ele SUM, AVERAGE, IF, COUNTIF, VLOOKUP) |
| **formula.js** | [MIT](https://github.com/formulajs/formulajs/blob/master/LICENSE) | da: 4.6.1 (28.07.2026) | n/a: doar funcțiile, fără interpretor de formule | n/a | da | n/a | **43 KB** comprimat | n/a | da, ca rezervă de funcții (interpretorul rămâne al nostru) |
| **SheetJS CE** (citește și scrie .xlsx) | [Apache-2.0](https://github.com/SheetJS/sheetjs) | depozitul GitHub e oglindă („New home git.sheetjs.com”); pe npm a rămas 0.18.5 | n/a | n/a | da | da | nemăsurat | n/a | da, pentru „Salvează / Deschide .xlsx” adevărat |
| **GridCraft** | [MIT sau Apache-2.0](https://github.com/storytold/gridcraft) | da, dar **alfa**: v0.19.1 (12.11.2026) | nedocumentat pentru JavaScript în browser (are un „JSON control channel” și un server MCP pentru agenți) | **nu**: desenează totul pe canvas (egui, WebAssembly) | da (arhivă „web” pentru server static) | nedocumentat | **arhivă web 9,7 MB** | **foarte aproape**: panglică, Formulas, Insert, 17 tipuri de grafice, pivot | de urmărit; azi nu, pentru că lecția nu vede nimic |

### 2.2 Word (procesor de text)

| Biblioteca | Licența | Întreținută | Evenimente + stare | Poziție pentru săgeți | Fără server | Telefon | Mărime | Seamănă cu Word 365 | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **Tiptap** (peste ProseMirror) | MIT ([depozit](https://github.com/ueberdosis/tiptap)) | da: 3.35.0 (20.11.2026), 39 mii stele | **da**: [`update`, `selectionUpdate`, `transaction`, `focus`, `blur`, `paste`, `drop`, `delete`](https://tiptap.dev/docs/editor/api/events); documentul se citește ca JSON sau HTML | **da, pentru text**: ProseMirror [`coordsAtPos` / `posAtCoords`](https://prosemirror.net/docs/ref/#view.EditorView.coordsAtPos); panglica o facem noi | da | editare nativă a browserului (contenteditable); neprobat de noi | nemăsurat (modular) | **fără interfață** („headless”): panglica rămâne a noastră | **da, candidat de motor** sub `word.js`, dacă ne trebuie tabele, liste sau anulare mai bune |
| **canvas-editor** | [MIT](https://github.com/Hufe921/canvas-editor) | da: 1.2.0 (13.11.2026) | **da**: [`rangeStyleChange`](https://github.com/Hufe921/canvas-editor/blob/main/src/editor/interface/Listener.ts) (aldin, cursiv, mărime, listă, aliniere pentru selecție), `contentChange`, `rangeChange`, `positionContextChange`, `saved` | text pe canvas: poziția vine doar din API-ul lui (nedocumentat de noi) | da | nedocumentat | **233 KB** comprimat | pagină A4 ca în Word; bara de unelte e doar în demonstrație | interesant ca idee de pagină, dar canvasul complică săgețile |
| **Umo Editor** (Vue 3 + Tiptap) | [MIT](https://github.com/umodoc/editor), **cu obligația** „retain the Umo Editor copyright notice and the link displayed in the interface” | da: 11.1.1 (04.08.2026) | parțial: [`onSave`, `onFileUpload`](https://dev.umodoc.com/en/docs/editor/options/default) și o pagină de metode | prin Tiptap | da (serverul lor e opțional) | variantă de mobil separată | npm 2,8 MB | **panglică implicită** (`toolbar.defaultMode: 'ribbon'`), paginare ca Word | nu pentru noi: Vue, plus siglă și link obligatorii în interfață |
| **Quill** | BSD-3-Clause ([depozit](https://github.com/slab/quill)) | lent: 2.0.3 (01.2025) | neverificat azi | neverificat azi | da | neverificat | **57 KB** comprimat | bară simplă | nu: mai puțin decât avem |
| **CKEditor 5** | [GPL-2.0+ sau comercial](https://github.com/ckeditor/ckeditor5/blob/master/packages/ckeditor5/LICENSE.md) | da: 49.1.0 (21.11.2026) | neverificat (exclus de licență) | neverificat | da | neverificat | npm 45 MB | bară de unelte, nu panglică | nu: GPL ar trage `aplicatii/` sub GPL |
| **TinyMCE** | [GPL-2.0+](https://github.com/tinymce/tinymce/blob/main/LICENSE.md) (comercial separat) | da: 8.10.2 (11.11.2026) | neverificat (exclus de licență) | neverificat | da | neverificat | **166 KB** comprimat doar nucleul | bară de meniuri și unelte | nu: GPL |
| **SuperDoc** (.docx adevărat) | [AGPL-3.0](https://github.com/Harbour-Enterprises/SuperDoc) | da: 2.34.0 (21.11.2026) | nedocumentat de noi | — | da | — | npm 14 MB | aproape de Word | nu: AGPL |
| **ONLYOFFICE Docs** | [AGPL-3.0](https://github.com/ONLYOFFICE/DocumentServer) | da: commit 13.11.2026 | neverificat (exclus: server) | — | **NU**: editorul din browser „communicates with the document editing service” ([cum funcționează](https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works/)) | — | — | foarte aproape | nu: cere server |
| **Syncfusion** (Docx Editor SDK, Spreadsheet Editor SDK, PPTX Editor SDK) | [Community License](https://www.syncfusion.com/products/communitylicense): gratuit sub 1 mil. $ venit, dar „Any government-related organization (i.e., funded by tax dollars) is not eligible” | neverificat | neverificat (exclus de licență) | neverificat | neverificat | neverificat | nemăsurat | neverificat | **nu: o școală publică e finanțată din bani publici** |
| **WordCraft** | [MIT sau Apache-2.0](https://github.com/storytold/wordcraft) | **alfa**: v0.18.1 (12.11.2026); „about 60% ready for real work” | nedocumentat pentru JavaScript (422 de comenzi cu id, „JSON control channel”, server MCP) | **nu** (egui pe canvas) | da (arhivă „Static site”) | nedocumentat | **arhivă web 22,5 MB** | **foarte aproape**: panglică, galeria de stiluri, rigle; interfață și **în română** | de urmărit |

### 2.3 PowerPoint (prezentări)

| Biblioteca | Licența | Întreținută | Evenimente + stare | Poziție | Fără server | Telefon | Mărime | Seamănă cu PowerPoint 365 | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **PPTist** (Vue 3) | [AGPL-3.0](https://github.com/pipipi-pikachu/PPTist), cu notă: în chineză, folosirea comercială cu sursă închisă e interzisă; licență separată 2.999 / 5.999 RMB | da: commit 15.11.2026, 9,5 mii stele | nedocumentat („There is currently no complete development documentation”) | nedocumentat | da | „basic editing and previewing on mobile” | nemăsurat | **foarte aproape**: diapozitive, forme, teme, tabele, 8 tipuri de grafice, animații, import/export .pptx | nu: AGPL (ar trage biblioteca sub AGPL) și fără API pentru lecții |
| **Univer Slides** | [Apache-2.0](https://github.com/dream-num/univer/blob/dev/LICENSE) | 1.3.1 (30.10.2026) | — | — | da | — | — | prețuri: varianta liberă are doar „basic model and UI only”; [README](https://github.com/dream-num/univer/blob/dev/README.md): „current Slides and Boards capabilities are separately distributed commercial products” | nu: prea puțin în varianta gratuită |
| **reveal.js** | [MIT](https://github.com/hakimel/reveal.js) | da: 6.0.2 (10.09.2026) | neverificat | DOM | da | neverificat | nemăsurat | **doar arată** prezentări, nu e editor | nu pentru lecții de PowerPoint |
| **PptxGenJS** | [MIT](https://github.com/gitbrent/PptxGenJS) | 4.0.1 (06.2025) | n/a | n/a | da | da | npm 2,6 MB | **doar generează** fișiere .pptx | da, doar pentru un buton „Descarcă .pptx” |
| **DeckCraft** | [MIT sau Apache-2.0](https://github.com/storytold/deckcraft) | **alfa**: v0.18.1 (12.11.2026) | nedocumentat pentru JavaScript | nu (canvas) | da | nedocumentat | **arhivă web 11,9 MB** | foarte aproape (teme, 150+ forme, .pptx) | de urmărit |

### 2.4 Windows 11 (desktop, bara de activități, Start) și File Explorer

| Biblioteca | Licența | Întreținută | Evenimente + stare | Poziție | Fără server | Telefon | Mărime | Seamănă cu Windows 11 | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **win11React** | CC0-1.0 ([depozit](https://github.com/blueedgetechno/win11React)) | **arhivat** (ultimul commit 11.08.2024) | nu (e o aplicație demonstrativă, nu o bibliotecă) | DOM | da | nedocumentat | nemăsurat | foarte aproape vizual | nu: abandonat; vezi riscul imaginilor (§3) |
| **daedalOS** | [MIT](https://github.com/DustinBrett/daedalOS) | da: commit 22.10.2026, 13 mii stele | nu (aplicație Next.js, fără API pentru lecții) | DOM | da | nedocumentat | nemăsurat (mare) | desktop „Windows-like”: Start, bara de activități, File Explorer; are JS Paint înăuntru | nu ca bibliotecă; bun doar ca sursă de idei |
| **winbows11** | [MIT](https://github.com/Siyu1017/winbows11) | mic: 26 de stele, commit 08.2026 | nu | DOM | da | nedocumentat | nemăsurat | stil Windows 11 | nu |
| **os-gui / 98.css** | [MIT](https://github.com/1j01/os-gui) / [MIT](https://github.com/jdan/98.css) | os-gui commit 02.2026; 98.css 0.1.21 (04.2025) | neverificat | DOM | da | parțial | 98.css: npm 0,4 MB | **Windows 98**, nu 11 | nu |
| **Fluent UI Web Components** (Microsoft) | [MIT](https://github.com/microsoft/fluentui/blob/master/LICENSE) | da: 3.2.1 (10.11.2026) | componente HTML (butoane, meniuri, dialoguri), deci evenimente DOM | DOM | da | neverificat | **63 KB** comprimat | limbajul de design „Fluent 2” din Windows 11 / Microsoft 365; **n-am găsit componentă de panglică** | da, ca **sursă de stil** (culori, colțuri, umbre) pentru `windows.js` și `explorer.js`; nu ca simulator |
| **Fluent System Icons** (Microsoft) | [MIT](https://github.com/microsoft/fluentui-system-icons) | da: commit 20.11.2026, 11 mii stele | n/a | n/a | da | da | doar pictogramele folosite | **pictogramele moderne Microsoft** | **da**: cel mai ieftin câștig de aspect pentru panglici, Explorer și Start |
| **Puter** | [AGPL-3.0](https://github.com/HeyPuter/puter) | da | — | — | sistem „self-hostable” cu backend propriu | — | — | desktop propriu | nu: AGPL și backend |

### 2.5 Paint

| Biblioteca | Licența | Întreținută | Evenimente + stare | Poziție | Fără server | Telefon | Mărime | Seamănă cu Paint din Windows 11 | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| **JS Paint** | [MIT](https://github.com/1j01/jspaint) | da: commit 19.07.2026, 7,9 mii stele | **parțial**: se poate pune în iframe; `systemHooks` pentru deschis / salvat; evenimente de gest nedocumentate | DOM (în iframe de pe același domeniu) | da | **da**: „use two fingers to pan the view, and pinch to zoom” | nemăsurat (nu e pe npm) | **Paint din Windows 98** („classic.css”), plus teme Modern și Dark | da, ca soluție rapidă pentru lecții de desen liber; pentru pași verificați și aspect de Windows 11 tot `paint.js`-ul nostru |
| **miniPaint** | [MIT](https://github.com/viliusle/miniPaint/blob/master/MIT-LICENSE.txt) | da: commit 09.11.2026 | nedocumentat | DOM | da („Nothing will be sent to any server”) | nedocumentat în README | nemăsurat | stil Photoshop (straturi, filtre) | nu: prea complicat pentru 10-14 ani, alt aspect |

### 2.6 Stratul de ghidare (săgeți, chenare, pași peste interfață)

| Biblioteca | Licența | Întreținută | Ce oferă | Fără server | Telefon | Mărime | Verdict |
|---|---|---|---|---|---|---|---|
| **Driver.js** | [MIT](https://github.com/kamranahmedse/driver.js) | da: 1.14.0 (13.11.2026), 27 mii stele | `driverObj.highlight({element, popover})` pentru un singur pas ([API](https://driverjs.com/docs/api)). `element` poate fi selector, `Element` sau **funcție care întoarce elementul** ([configurare](https://driverjs.com/docs/configuration)). Mai are `refresh()` după o schimbare de așezare, `disableActiveInteraction` (blochează clicul pe țintă), `overlayColor`, `stagePadding`, `stageRadius` și cârligele `onHighlighted`, `onDeselected`, `onNextClick` | da | nedocumentat; e strat DOM, deci de probat pe 360 px | **14 KB** comprimat | **da: alegerea principală** |
| **Shepherd.js** | [AGPL-3.0 sau comercial](https://github.com/shipshapecode/shepherd/blob/main/LICENSE.md): scrie „Educational purposes (students, teachers, coursework)” la folosire gratuită, dar tot sub AGPL | da: 16.0.0 (11.11.2026) | tururi cu pași | da | da | nemăsurat | nu: AGPL |
| **Intro.js** | [AGPL-3.0 sau comercial](https://github.com/usablica/intro.js/blob/master/license.md) | da: 8.7.0 (20.11.2026) | tururi, indicii | da | da | nemăsurat | nu: AGPL |
| **Reactour** | [MIT](https://github.com/elrumordelaluz/reactour) | 3.8.0 (05.2025) | tururi | da | da | npm 0,1 MB | nu: doar React (noi suntem JavaScript simplu) |
| **Floating UI** | [MIT](https://github.com/floating-ui/floating-ui) | da: 1.8.0 (07.2026) | doar **poziționarea** unei bule lângă un element (fără chenar sau umbră) | da | da | npm 0,2 MB | rezervă, dacă vrem bule desenate de noi |

### 2.7 Simulatoare educaționale gata făcute

N-am găsit niciun simulator Office / Windows gratuit și integrabil. Ce există e comercial:
[Jasperactive](https://appsource.microsoft.com/en-us/product/office/WA200002334) (vândut prin magazinul Microsoft) și
[SIMnet](https://www.mheducation.com/highered/digital-products/simnet.html) (McGraw Hill). Office pe web e gratuit pentru
elevi, dar cere conturi și nu ne arată ce face elevul.

---

## 3. Riscurile

1. **Licențele care obligă.**
   - **GPL** (HyperFormula, CKEditor 5, TinyMCE): când le punem în aceeași bibliotecă JavaScript trimisă elevilor, toată
     biblioteca trebuie dată sub GPL, cu sursa la vedere.
   - **AGPL** (PPTist, SuperDoc, Shepherd.js, Intro.js, ONLYOFFICE, Puter): la fel, iar obligația de a oferi sursa se
     aplică și la folosirea prin rețea.
   - Pentru un site școlar fără bani nu e o interdicție, dar e o decizie pe care trebuie s-o ia profesorul, nu un detaliu
     tehnic. PPTist mai adaugă o condiție în chineză (fără folosire comercială cu sursă închisă).
2. **Licențe „gratuite, dar...”.**
   - Handsontable: gratuit doar „personal” sau „evaluare”.
   - Syncfusion: exclude explicit organizațiile finanțate din taxe.
   - Univer: graficele, .xlsx și tipărirea sunt comerciale, iar varianta gratuită a acestora e „for development and
     testing only”, cu filigran.
   - Umo Editor: sigla și linkul trebuie să rămână vizibile în interfață.
3. **Proiecte abandonate.** Luckysheet (arhivat), x-spreadsheet (npm neatins din 2022), win11React (arhivat 2024),
   handsontable/formula-parser (arhivat). Quill și FortuneSheet se mișcă încet (ultima versiune în 01.2025, respectiv
   11.2025).
4. **Dependența de server.** ONLYOFFICE (serviciul de editare), Univer (colaborarea și
   conversia de fișiere cer Server SDK). Restul merg static pe Cloudflare Pages.
5. **Canvasul ascunde interfața.** Univer (foaia), canvas-editor, GridCraft, WordCraft și DeckCraft desenează pe canvas.
   Lecția nu mai poate găsi un buton în DOM, deci nici săgețile, nici verificarea nu merg decât prin API-ul lor, iar la
   aplicațiile Craft API-ul pentru browser nu e documentat. Contractul nostru (`data-*` pe fiecare țintă, O2/O3) nu poate
   fi respectat de ele.
6. **Mărimea pe telefon.** Univer are ~2,5 MB comprimat doar nucleul de foi de calcul. Aplicațiile Craft au 10-22 MB.
   Pe telefoanele elevilor, prin date mobile, e prea mult pentru o lecție.
7. **Imaginile Microsoft.** Clonele de Windows 11 de pe GitHub folosesc de obicei pictograme sau imagini luate din Windows.
   Licența depozitului (CC0, MIT) nu poate acoperi materiale care aparțin Microsoft, așa că orice imagine preluată se
   verifică fișier cu fișier. Fluent System Icons sunt publicate de Microsoft sub MIT, deci sunt sigure.
8. **O contradicție găsită pe drum.** Un articol din 11.10.2026 ([office-watch](https://office-watch.com/?p=77930))
   spune că WordCraft / GridCraft / DeckCraft sunt AGPL-3.0. Depozitele lor spun azi „MIT OR Apache-2.0” și au
   `LICENSE-MIT` + `LICENSE-APACHE`. Am crezut sursa primară, dar licența se verifică din nou înainte de orice folosire,
   pentru că pare să se fi schimbat.

---

## 4. Cum s-ar combina cu biblioteca noastră

Principiul: **biblioteca `aplicatii/` rămâne interfața și contractul cu lecțiile.** Ea dă evenimentul `lh-aplicatie`,
`stare()`, ținta canonică și `element(tinta)`. Bibliotecile străine intră doar ca **motoare ascunse sub ea** sau ca
**strat peste ea**. Așa, oracolele O1-O9 și lecțiile nu se schimbă.

1. **Stratul de ghidare peste toate aplicațiile: Driver.js.** Lecția (sau asistentul din §6) cere ținta canonică, iar
   Driver.js desenează spotul și bula:
   ```js
   const w = await LH.aplicatii.deschide('word', {loc: '#loc-word'});
   const ghid = driver({ allowClose: false, stagePadding: 4 });
   ghid.highlight({ element: () => w.element('panglica:Home/Font/Bold'),
                    popover: { title: 'Pasul 2', description: 'Apasă B ca textul să devină aldin.' } });
   window.addEventListener('lh-aplicatie', e => {           // evenimentul nostru, §4
     if (e.detail.actiune === 'aldin') ghid.destroy();      // pasul e făcut: stingem spotul
   });
   ```
   Pentru că `element` poate fi o funcție, ținta se caută din nou la fiecare desenare. Asta contează la panglica ce se
   restrânge pe telefon. `refresh()` acoperă schimbarea așezării (fereastra mică, rotirea telefonului). De probat:
   `disableActiveInteraction` trebuie să rămână `false`, altfel elevul nu poate apăsa butonul arătat.
2. **Excel: motor de formule MIT sub `excel.js`.** Azi `excel.js` are propriul interpretor, cu funcțiile cerute de lecții
   (SUM, AVERAGE, IF, COUNTIF, SUMIF, MIN, MAX și altele) și grafice proprii. Interpretorul nostru rămâne, iar pentru
   funcțiile pe care nu le are, „rezerva” ar fi **@sheetxl/formulas** (fostul fast-formula-parser, 280 de funcții) sau
   **formula.js** (doar funcțiile). Așa nu mai scriem fiecare funcție de mână. Condiție: aceleași rezultate ca Excel-ul
   real, pe scenariile oracolului O4, înainte și după.
3. **Excel: fișiere adevărate cu SheetJS CE** (Apache-2.0): „Salvează ca .xlsx” produce un fișier pe care elevul îl
   deschide acasă în Excel, iar profesorul poate porni o lecție dintr-un .xlsx al lui.
4. **Word: Tiptap / ProseMirror sub `word.js`**, doar dacă profesorul confirmă că lipsesc funcții de editare (tabele,
   liste pe niveluri, anulare). Panglica și țintele rămân ale noastre, iar Tiptap face doar editarea. Evenimentele
   `update` / `selectionUpdate` devin evenimentele noastre `lh-aplicatie`, `getJSON()` intră în `stare()`, iar
   `coordsAtPos` dă poziția unui cuvânt pentru săgeată.
5. **Aspectul: Fluent System Icons + culorile Fluent 2** în `panglica.js`, `windows.js` și `explorer.js`. E cel mai
   ieftin pas spre „seamănă cu Microsoft 365 / Windows 11” și nu schimbă comportamentul.
6. **Paint:** pe termen scurt, JS Paint într-un iframe pentru desen liber (atingere cu două degete, zoom). Pentru pași
   verificați, un `paint.js` al nostru în același contract, pentru că JS Paint nu anunță gesturile și arată ca Windows 98.
7. **PowerPoint, Windows, Explorer:** nimic gratuit și potrivit de pus dedesubt. Rămân `powerpoint.js`, `windows.js` și
   `explorer.js`, cu pictogramele de la punctul 5.
8. **De urmărit (fără lucru acum):** aplicațiile Craft (MIT / Apache), cu o reverificare peste 2-3 luni, ca să vedem
   dacă apare un API JavaScript pentru versiunea web (evenimente, poziția comenzilor) și o variantă mai ușoară. Ar putea
   deveni sandboxul „aplicația aproape reală” pentru exerciții libere, nu pentru pași ghidați.

---

## 5. Sursele (citite azi, 21.11.2026)

**Foi de calcul:**
- Univer: [depozit și README](https://github.com/dream-num/univer) (motor de randare pe canvas: „Canvas rendering and layout engine”) · [LICENSE](https://github.com/dream-num/univer/blob/dev/LICENSE) ·
  [evenimente](https://docs.univer.ai/guides/sheets/features/core/general-api) ·
  [`getCellRect` în f-range.ts](https://github.com/dream-num/univer/blob/dev/packages/sheets-ui/src/facade/f-range.ts) ·
  [`SheetDeleted` în f-event.ts](https://github.com/dream-num/univer/blob/dev/packages/sheets/src/facade/f-event.ts) ·
  [`RibbonType`](https://github.com/dream-num/univer/blob/dev/packages/ui/src/controllers/ui/ui.controller.ts) ·
  [prețuri](https://univer.ai/pricing) · [mobil](https://docs.univer.ai/showcase/sheets/mobile-via-plugin)
- FortuneSheet: [depozit](https://github.com/ruilisi/fortune-sheet) · [API](https://ruilisi.github.io/fortune-sheet-docs/guide/api.html)
- [Luckysheet](https://github.com/dream-num/Luckysheet) · [x-spreadsheet](https://github.com/myliang/x-spreadsheet) ·
  [Jspreadsheet CE](https://github.com/jspreadsheet/ce)
- [Handsontable LICENSE](https://github.com/handsontable/handsontable/blob/develop/LICENSE.txt) ·
  [HyperFormula LICENSE](https://github.com/handsontable/hyperformula/blob/master/LICENSE.txt)
- [formula.js LICENSE](https://github.com/formulajs/formulajs/blob/master/LICENSE) ·
  [fast-formula-parser](https://github.com/LesterLyu/fast-formula-parser) ·
  [@sheetxl/formulas](https://www.npmjs.com/package/@sheetxl/formulas) · [SheetJS](https://github.com/SheetJS/sheetjs)

**Procesoare de text:**
- [Tiptap](https://github.com/ueberdosis/tiptap) · [evenimente Tiptap](https://tiptap.dev/docs/editor/api/events) ·
  [ProseMirror coordsAtPos](https://prosemirror.net/docs/ref/#view.EditorView.coordsAtPos)
- [canvas-editor](https://github.com/Hufe921/canvas-editor) ·
  [Listener.ts](https://github.com/Hufe921/canvas-editor/blob/main/src/editor/interface/Listener.ts)
- [Umo Editor](https://github.com/umodoc/editor) · [opțiunile Umo](https://dev.umodoc.com/en/docs/editor/options/default)
- [Quill](https://github.com/slab/quill) ·
  [CKEditor 5 LICENSE](https://github.com/ckeditor/ckeditor5/blob/master/packages/ckeditor5/LICENSE.md) ·
  [TinyMCE LICENSE](https://github.com/tinymce/tinymce/blob/main/LICENSE.md) ·
  [SuperDoc](https://github.com/Harbour-Enterprises/SuperDoc)
- [ONLYOFFICE DocumentServer](https://github.com/ONLYOFFICE/DocumentServer) ·
  [ONLYOFFICE, cum funcționează](https://api.onlyoffice.com/docs/docs-api/get-started/how-it-works/) ·
  [Syncfusion Community License](https://www.syncfusion.com/products/communitylicense)

**Aplicațiile Craft:**
- [WordCraft](https://github.com/storytold/wordcraft) · [GridCraft](https://github.com/storytold/gridcraft) ·
  [DeckCraft](https://github.com/storytold/deckcraft) · [articolul office-watch](https://office-watch.com/?p=77930)

**Prezentări:**
- [PPTist](https://github.com/pipipi-pikachu/PPTist) · [reveal.js](https://github.com/hakimel/reveal.js) ·
  [PptxGenJS](https://github.com/gitbrent/PptxGenJS)

**Windows / Explorer:**
- [win11React](https://github.com/blueedgetechno/win11React) · [daedalOS](https://github.com/DustinBrett/daedalOS) ·
  [winbows11](https://github.com/Siyu1017/winbows11) · [os-gui](https://github.com/1j01/os-gui) ·
  [98.css](https://github.com/jdan/98.css) · [Puter](https://github.com/HeyPuter/puter)
- [Fluent UI LICENSE](https://github.com/microsoft/fluentui/blob/master/LICENSE) ·
  [Fluent System Icons](https://github.com/microsoft/fluentui-system-icons)

**Paint:**
- [JS Paint](https://github.com/1j01/jspaint) ·
  [miniPaint LICENSE](https://github.com/viliusle/miniPaint/blob/master/MIT-LICENSE.txt)

**Ghidare:**
- [Driver.js](https://github.com/kamranahmedse/driver.js) · [Driver.js API](https://driverjs.com/docs/api) ·
  [Driver.js configurare](https://driverjs.com/docs/configuration)
- [Shepherd LICENSE](https://github.com/shipshapecode/shepherd/blob/main/LICENSE.md) ·
  [Intro.js licență](https://github.com/usablica/intro.js/blob/master/license.md) ·
  [Reactour](https://github.com/elrumordelaluz/reactour) · [Floating UI](https://github.com/floating-ui/floating-ui)

**Simulatoare comerciale:**
- [Jasperactive](https://appsource.microsoft.com/en-us/product/office/WA200002334) ·
  [SIMnet](https://www.mheducation.com/highered/digital-products/simnet.html)

**Date tehnice măsurate azi:**
- metadatele GitHub (licență, stele, ultimul commit, arhivat) prin `api.github.com/repos/...`
- versiunile și datele prin `npm view <pachet> version time.modified license dist.unpackedSize`
- mărimile comprimate prin descărcare de pe `cdn.jsdelivr.net` și `gzip -9`
- mărimile arhivelor web Craft din `api.github.com/repos/storytold/*/releases/latest`
