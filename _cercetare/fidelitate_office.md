# Cât de fidel imită LearningHub Word, Excel și PowerPoint

*Cercetare, 25.09.2026. Nu am modificat nimic pe site. Tot ce scrie mai jos am citit în cod (fișier:rând) sau am verificat pe paginile oficiale ale bibliotecilor (anexa B). Ce n-am putut verifica e marcat **NEVERIFICAT**.*

## Pe scurt

- Avem **4 simulatoare adevărate** (elevul lucrează, nu doar alege un răspuns): foaia de calcul, formatarea celulelor, editorul Word, pagina Word și diapozitivul PowerPoint. Restul întrebărilor (choice, adevărat/fals, ordonare, potrivire) sunt quiz cu capturi reale.
- Cel mai aproape de aplicația reală e **foaia de calcul**: formulele chiar se calculează, se verifică și pe date schimbate, erorile au nume românești. Dar elevul **nu poate da clic pe o celulă ca s-o pună în formulă, nu poate trage de colț (fill handle) și nu vede panglica**. Exact gesturile pe care le face zilnic în Excel.
- **O veste bună, verificată:** Excel în română **păstrează numele englezești ale funcțiilor** (`IF`, `SUM`, `AVERAGE`). Dovada: pagina oficială Microsoft în română se numește „IF (Funcția IF)” și are exemplul `=IF(E7="Da";F5*0,0825;0)`, pe când cea în franceză se numește „SI” (anexa A). Deci simulatorul are dreptate când cere `AVERAGE` și nu `MEDIE`. Ce se schimbă cu adevărat între laboratoare e **separatorul**: `;` pe Windows cu setări românești, `,` pe setări englezești. Simulatorul îl acceptă pe oricare, așa că elevul nu află diferența.
- Word și PowerPoint sunt **exerciții de decizie** (ce formatare, ce margine, ce contrast), nu imitații ale ferestrei. Nu se scrie text, nu există panglică, nu merg Ctrl+B, Ctrl+Z.
- Recomandare: **rămânem pe motorul nostru** (`tip-foaie.js`) și îl facem mai fidel pas cu pas. O foaie de calcul gata făcută nu știe să verifice răspunsul elevului, iar cel mai bun motor de formule (HyperFormula) are licență GPL sau comercială.

## 1. Inventar: ce simulează fiecare joc

| Joc | Tip interactiv | Ce face elevul | Unde e codul |
|---|---|---|---|
| `excel-viii` „Misiunea Analist” (4 foi) + `excel-antrenament-viii` (8 foi) | **foaie** | apasă o celulă cu chenar, scrie formula în bara fx, Enter. Se verifică pe datele date **și** pe date schimbate (prinde numărul scris de mână) | `_motor/tip-foaie.js:142-215`; întrebări `excel-viii/index.html:231,250,255,298`, `excel-antrenament-viii/index.html:194-317` |
| aceleași (2 + 3 întrebări) | **formatare** | selectează o zonă (clic pe un colț, apoi pe colțul opus; sau pe litera coloanei / numărul rândului), apasă unul din 4 butoane: centru, borduri, umplere, fără formatare | `excel-viii/index.html:43-120` (copie în `excel-antrenament-viii/index.html:53`) |
| `word-vii` „Tehnoredactor” (3 întrebări) | **editor** | apasă pe cuvinte ca să le selecteze, apoi B / I / U, A− / A+ (11·14·18·24 pt), 4 alinieri; compară cu un model | `word-vii/index.html:529-600`, mărimi la `:198`; întrebări `:265,284,318` |
| `word-obiecte-vii` (5) + `word-antrenament-vii` (4) | **pagina** | alege din butoane: orientarea, marginile (1–3,5 cm), încadrarea imaginii (în linie, pătrat, strâns, sus și jos, în spate), rânduri/coloane de tabel, rând de antet, îmbinare | `word-obiecte-vii/index.html:59-60,154-250` |
| `prezentari-vi` (3) + `prezentari-antrenament-vi` (4) | **diapozitiv** | alege culoarea textului și a fundalului, mărimea titlului (20/28/36) și a textului (12/16/26/44), păstrează sau scoate rânduri; se verifică contrastul (≥4,5) și regula „max. 6 rânduri × 6 cuvinte” | `prezentari-vi/index.html:47-130`, constante `:53-55` |
| `word-vii` (1–2) și toate cele de mai sus | **hunt** („vânătoarea”) | apasă greșelile de tehnoredactare (spații duble, spațiu înainte de virgulă), cu ¶ pornit | `word-vii/index.html:302`, cod `:500-520` |
| toate | choice, tf, order, match, classify, pick | întrebări cu capturi reale din Office în engleză, cu ambele nume în legendă | ex. `excel-viii/index.html:143-146`, `prezentari-vi/index.html:171` |

Mai există `_motor/tip-traseu.js` (drumul prin meniu: Fila → Comanda → Opțiunea → Valoarea, cu ambele nume). E folosit la clasa a XII-a, **nu** în jocurile de gimnaziu. Este cea mai apropiată piesă de „panglica adevărată” pe care o avem deja.

Un amănunt: motorul foii știe să „tragă formula în jos” (`Q.umple`, `tip-foaie.js:9-10,146-148`) și prinde lipsa lui `$`. **Nicio întrebare nu folosește asta** (0 apariții `umple:` în cele două jocuri Excel).

## 2. Diferențe față de aplicația reală (de la cea care strică cel mai mult transferul)

### Excel (CS.1.1 / CS.3.1 clasa a VIII-a: formule, funcții, formatare, sortare, grafice)

1. **Separatorul e acceptat oricum.** Simulatorul primește și `;`, și `,` (`tip-foaie.js:29,68,169`). Excel real acceptă doar unul, după setările regionale ale Windows-ului: cu setări românești e `;` (iar zecimalele se scriu cu virgulă: `0,21`), cu setări englezești e `,`. Formula cu separatorul greșit e refuzată cu un mesaj. Elevul exersează acasă cu virgulă și se blochează la laborator. *Conținut: „Funcții … sumă, maxim, minim, medie și decizie”.* (Numele funcțiilor sunt în regulă: vezi anexa A. Când elevul scrie `MEDIE` sau `DACĂ`, simulatorul îi spune numele englezesc, `tip-foaie.js:8,104-105`, ceea ce e un ajutor bun.)
2. **Nu poți da clic pe o celulă ca s-o pui în formulă.** În Excel scrii `=`, dai clic pe B2, scrii `*`, dai clic pe C2. Aici clicul pe o celulă cu date doar afișează un mesaj (`:171-173`); adresele se tastează. *Editare: selectare.*
3. **Fără tragere de colț (fill handle) și fără selecție cu mouse-ul tras.** La formatare, zona se alege cu două clicuri separate (`excel-viii/index.html:88`), nu trăgând; nu merg Shift+clic, Ctrl+clic. Copierea formulei nu se face de elev. *Editare: selectare, copiere.*
4. **Nu există panglica.** Cele 4 butoane de formatare stau într-un rând simplu (`:47`), fără file Pornire (Home) / Inserare (Insert) / Formule (Formulas) / Date (Data). Elevul nu exersează **unde** e butonul, iar la clasa a XII-a tocmai drumul prin meniu aduce punctele (README jocuri, rândul 244: formatare celule 123 p, setare pagină 98 p, format numere 54 p, IF doar 24 p).
5. **Numele erorilor sunt probabil traduse de noi, nu de Excel.** Simulatorul arată `#NUME?`, `#VALOARE`, `adevărat`/`fals`, plus `#CIRC` și `#EROARE`, care nu există în niciun Excel (`:24,54,113,136`). Dacă Excel în română nu traduce numele funcțiilor, cel mai probabil nu traduce nici erorile (`#NAME?`, `#VALUE!`) și nici `TRUE`/`FALSE`. **NEVERIFICAT**: de văzut pe un PC din laborator cu `=XYZ(1)` și `=1="a"+1`. La referința circulară, Excel arată un avertisment și `0`.
6. **Lipsesc formatul numerelor** (zecimale, procent, dată, monedă), lățimea coloanei, îmbinarea (Merge & Center), stilurile de celulă, aldinul în celulă. Conținut explicit în programă: „stiluri predefinite”, „formatarea rândurilor/coloanelor”, „tipuri de date: dată calendaristică”.
7. **Sortarea și graficele există doar ca quiz** (`excel-viii/index.html:272-273,292-302`), nu se fac pe foaie.
8. **Nu te miști cu tastatura** (săgeți, Tab, F2, F4 pentru `$`) și nu scrii direct în celulă, doar în bara fx. Nu există caseta de nume (Name Box) propriu-zisă: căsuța din stânga arată adresa, dar nu poți scrie în ea.
9. Mărunțișuri: zonele merg doar pe coloane A–Z (`:48`); celulele cu date nu se pot modifica (un „ce-ar fi dacă” nu se poate face).

### Word (CS.1.1 / CS.3.1 clasa a VII-a: tehnoredactare, formatare text, imagine, tabel, pagină)

1. **Nu se scrie și nu se selectează ca în Word.** Selecția e „clic pe cuvânt = îl bifezi” (`word-vii/index.html:566-570`); în Word tragi cu mouse-ul, dai dublu-clic (cuvânt), triplu-clic (paragraf). Nu există cursor și nu se tastează nimic.
2. **Butonul ¶ face altceva decât în Word.** În joc, ¶ de la capătul paragrafului îl selectează (`:536,569`); în Word, ¶ (Afișare/ascundere) doar arată semnele. Lecția explică corect ¶ (`:271,298`), dar gestul exersat îl contrazice.
3. **A+ / A− sar altfel.** În joc: 11 → 14 → 18 → 24 (`:198`). În Word, „Mărire font” merge 11 → 12 → 14 → 16 → 18 → 20 → 22 → 24. Lipsește lista de mărimi în care scrii numărul (asta cer specificațiile „dimensiune font 14”).
4. **Fără panglică, fără scurtături.** Butoanele spun „Ctrl+B”, dar tastele nu fac nimic (niciun `keydown`/`ctrlKey` în fișier). Lipsesc Ctrl+Z, fontul, culoarea, listele cu marcatori/numerotare, indentarea, spațierea rândurilor, **stilurile (Titlu 1 / Heading 1)**.
5. **Pagina e un panou de butoane**, nu Aspect (Layout) → Margini → Margini particularizate (Custom Margins). Marginile sunt valori fixe (`word-obiecte-vii/index.html:59`), nu se scriu. Imaginea nu se inserează, nu se redimensionează, nu se mută; tabelul nu se desenează din grila Inserare → Tabel.
6. Antetul/subsolul și numerotarea paginilor sunt doar teorie + quiz.

### PowerPoint (CS.1.1 / CS.3.1 clasa a VI-a: interfață, diapozitive, obiecte, formatare, animații, tranziții, expunere)

1. **Diapozitivul simulat e despre reguli de estetică** (contrast, mărime, 6×6), nu despre aplicație (`prezentari-vi/index.html:77-128`). Asta e bine pentru „reguli elementare de estetică”, dar nu atinge restul programei.
2. **Nu există panoul de miniaturi**: nu se adaugă, nu se mută, nu se șterge un diapozitiv; nu există sortatorul de diapozitive (Slide Sorter).
3. **Nu se alege aspectul (Layout)**, nu se inserează imagine/formă/casetă de text, nu se mută obiecte pe diapozitiv.
4. **Animațiile și tranzițiile sunt doar quiz** (`:251-278`). Lecția le deosebește corect, dar elevul nu aplică nicio tranziție și nu vede diferența pe ecran.
5. Mărimile oferite (titlu 20/28/36) nu includ 44, mărimea pe care o pune PowerPoint singur la titlu (**NEVERIFICAT** pe versiunea din laborator).

## 3. Opțiuni tehnice (verificate, detalii în anexa B)

**Foi de calcul gata făcute.** Cele gratuite și libere (MIT/Apache) sunt Univer, Fortune-sheet, x-spreadsheet și Jspreadsheet CE. Luckysheet e abandonat. Handsontable **nu e gratuit** pentru școală decât cu cheie de „evaluare / non-comercial”. Niciuna nu arată ca Excel în română și toate cer să ascundem jumătate din ce au. Mai grav: **niciuna nu verifică răspunsul elevului**, iar verificarea pe date schimbate e partea cea mai valoroasă din motorul nostru.

**Motoare de formule.** HyperFormula e cel mai complet și are pachete de limbă (18 limbi, **fără română**, verificat în codul lui), dar e **GPL-3.0 sau licență comercială**. Pentru noi pachetul de limbă nici nu contează, fiindcă Excel în română folosește numele englezești. Formula.js (MIT) are doar funcțiile, fără parser. fast-formula-parser (MIT) are parser, dar e slab întreținut (ultima versiune în 2023). Pentru cele ~12 funcții din programă, motorul nostru de 100 de rânduri e suficient și îl controlăm complet.

**Editoare de text (pentru un „Word”).** ProseMirror (MIT) și TipTap (nucleul MIT; unele extensii sunt plătite) sunt bune și gratuite. Quill (BSD-3) e cel mai simplu. CKEditor 5 și TinyMCE sunt **GPL** și cer cheie de licență. Toate dau o suprafață unde chiar scrii, selectezi cu mouse-ul, apeși Ctrl+B.

**Diapozitive.** Nu am găsit un editor de diapozitive liber și ușor. PPTist e **AGPL-3.0** (capcană: te obligă să publici tot codul). reveal.js (MIT) doar arată prezentări, nu le editează. Fabric.js / Konva (MIT) sunt pânze pe care poți muta obiecte, bune ca piesă pentru un diapozitiv simulat.

## 4. Recomandare

**Arhitectura:** păstrăm `tip-foaie.js` ca inimă (calcul + verificare) și îi adăugăm, în etape, **gesturile** Excel. Pentru Word folosim un editor liber (Quill sau TipTap), deasupra căruia punem panglica noastră și verificarea noastră. PowerPoint: panoul de miniaturi și aspectul le facem noi, fără bibliotecă. Panglica se face o singură dată (`tip-panglica.js`), cu ambele nume, și o folosesc toate trei. Datele despre file le avem deja în `tip-traseu.js`.

**Ce înseamnă „fidel”, măsurabil.** Lista de mai jos se bifează cu mâna, pe Excel real și pe simulator, una lângă alta. Ținta: fiecare rând se comportă la fel.

*Excel:* (1) `=` apoi clic pe celulă pune adresa în formulă; (2) Enter coboară pe celula de dedesubt; (3) săgețile mută selecția; (4) tragerea de colțul verde copiază formula și mută adresele; (5) F4 pune `$`; (6) în modul „setări românești” merge `=IF(B2>=5;"da";"nu")` și `0,21`, iar virgula ca separator e respinsă cu mesaj; în modul „setări englezești” invers; (7) `=MEDIE(...)` dă eroarea de nume, ca în Excel, cu indiciul „AVERAGE”; (8) erorile au exact numele pe care le arată Excel-ul din laborator (de verificat întâi pe PC); (9) trasul cu mouse-ul selectează o zonă, iar caseta de nume arată `B2:C5`; (10) Pornire → Aliniere/Borduri/Umplere, Formatare numere cu 2 zecimale; (11) Date → Sortare pe un criteriu și pe două.

*Word:* (1) scrii text; (2) dublu-clic = cuvânt, triplu-clic = paragraf, tragere = selecție; (3) Ctrl+B/I/U/Z; (4) listă de mărimi + A+/A− cu pașii Word; (5) Titlu 1 (Heading 1) din Stiluri; (6) listă cu marcatori; (7) ¶ doar arată semnele.

*PowerPoint:* (1) diapozitiv nou din miniaturi; (2) mutare prin tragere în miniaturi; (3) Aspect (Layout); (4) tranziția se vede la expunere, animația doar pe obiect.

**Plan pe etape (pe site-ul de probă):**

| Etapa | Ce | Efort estimat |
|---|---|---|
| 0 | **Comutator „setări românești / englezești”** deasupra foii, în `tip-foaie.js`: fixează separatorul (`;` sau `,`) și zecimala, respinge separatorul greșit cu mesajul pe care îl dă Excel. Numele erorilor aliniate cu ce arată PC-ul din laborator (după o probă de 5 minute acolo). | 0,5–1 zi |
| 1 | **Clic pe celulă în timpul formulei** (modul „arătare”), Enter/săgeți/Tab, scris direct în celulă, F4. | 1–2 zile |
| 2 | **Selecția trasă + fill handle** (tragere de colț) și întrebări noi cu `umple` (există deja în motor). | 1–2 zile |
| 3 | **Panglica comună** (`tip-panglica.js`): Pornire / Inserare / Formule / Date, cu ambele nume; formatarea și formatul numerelor mutate pe ea. | 2–3 zile |
| 4 | Sortare pe foaie; grafic simplu (coloane/linie/radial) desenat de noi în SVG. | 2–3 zile |
| 5 | Word: suprafață Quill/TipTap + panglica + verificare pe model; ¶ corectat. | 3–5 zile |
| 6 | PowerPoint: miniaturi, aspect, tranziție/animație vizibile. | 3–5 zile |

Fiecare etapă trece prin poarta jocurilor (`test_joc.py`: răspunsul bun e primit, `gresit()` e respins) și prin scenariile de mai jos, pe telefon (320 px) și pe PC.

**Primul prototip:** etapele 0 + 1 pe `excel-viii` din site-ul de probă. Aduc cel mai mult pentru cel mai puțin: elevul învață separatorul potrivit calculatorului pe care lucrează și primește gestul pe care îl face la fiecare formulă.

## 5. Scenarii de probă (Excel real și simulatorul, unul lângă altul)

1. **Numele funcției și eroarea.** Pe un PC cu Office în română, în B7 scrie `=MEDIE(B2:B6)`, apoi `=AVERAGE(B2:B6)`. Așteptat (după documentația Microsoft): prima dă eroare de nume, a doua calculează. Notează **exact** ce eroare scrie (`#NAME?` sau `#NUME?`) și compară cu simulatorul (`#NUME?`).
2. **Separatorul.** Pe un PC cu Windows pe setări românești scrie `=IF(B2>=5,"promovat","corigent")` (cu virgulă). Așteptat: Excel refuză formula și arată un mesaj; cu `;` merge. Simulatorul le primește pe amândouă.
3. **Clic în formulă.** Scrie `=`, dă clic pe B2, scrie `*`, dă clic pe C2, Enter. Excel: formula `=B2*C2` și cursorul coboară pe D3. Simulatorul: clicul pe B2 doar afișează „B2 are datele tabelului”, iar adresa nu intră în formulă.
4. **Tragerea în jos.** Scrie în D2 `=B2*$F$1` și trage de colțul verde până în D4. Excel: D3 = `=B3*$F$1`. Simulatorul: nu poți trage.
5. **Word, mărimea fontului.** Scrie „Concurs”, selectează, apasă de 3 ori A+ (Mărire font) pornind de la 11. Word: 16 pt. Simulatorul: 24 pt.

---

## Anexa A. Excel în română: nume de funcții și separator

| Ce | Constatare | Sursa | Sigur? |
|---|---|---|---|
| Numele funcțiilor | rămân în engleză: pagina ro-ro are titlul „IF (Funcția IF)”, sintaxa `IF(test_logic, valoare_dacă_adevărat, [valoare_dacă_fals])`; doar argumentele sunt traduse | support.microsoft.com/ro-ro/office/funcția-if-69aed7c9-4e8a-4755-a9bc-aa8bbff73be2 | da (documentația oficială) |
| Contraproba | aceeași pagină în franceză: titlul „SI (SI, fonction)”, exemplul `=SI(C2="Oui";1;2)`, adică limbile care traduc funcțiile se văd clar în documentație | support.microsoft.com/fr-fr/office/fonction-si-69aed7c9-… | da |
| Lista de traduceri excel-translator.de | 17 limbi cu nume traduse; româna nu e printre ele | en.excel-translator.de/functions/statistical/ | da |
| Separatorul | exemplul ro-ro folosește `;` și zecimala cu virgulă: `=IF(E7="Da";F5*0,0825;0)`. Separatorul vine din setările regionale ale Windows-ului, nu din limba Office-ului | pagina ro-ro de mai sus | da |
| Nume de erori (`#NAME?` vs `#NUME?`), `TRUE`/`FALSE` vs `ADEVĂRAT`/`FALS` | probabil în engleză, ca funcțiile | — | **NEVERIFICAT**, de văzut pe un PC din laborator |
| Pagini românești care scriu `SUMĂ`, `MEDIE`, `DACĂ` | există (agentul de verificare le-a găsit), dar contrazic documentația Microsoft; probabil descriu alt program (LibreOffice sau altul) | — | **NEVERIFICAT**; nu le luăm drept regulă |

## Anexa B. Biblioteci: licență, ultima versiune, stare (verificat 25.09.2026 prin npm, API-ul GitHub și fișierele LICENSE)

| Bibliotecă | Licența (exact) | Ultima versiune | Stare | Observații |
|---|---|---|---|---|
| Jspreadsheet CE | MIT | 5.0.4 / 25.08.2025 | activă | 311 KB; fără nume de funcții traduse |
| Univer (`@univerjs/*`) | Apache-2.0 | 1.0.2 / 24.09.2026 | foarte activă | mare (nucleul 4,4 MB); traducerea numelor de funcții **NEVERIFICAT** |
| Fortune-sheet (`@fortune-sheet/core`, `/react`) | MIT | 1.0.4 / 06.11.2025 | activă | cere React |
| x-spreadsheet (`x-data-spreadsheet`) | MIT | 1.1.9 / 24.05.2022 | practic abandonată | — |
| Luckysheet | MIT | — | **arhivată** | de evitat |
| Handsontable | „SEE LICENSE IN LICENSE.txt” = licență proprie Handsoncode | 18.1.1 / 25.09.2026 | activă | **capcană**: nu e open-source; gratuit doar cu cheia `non-commercial-and-evaluation` |
| HyperFormula | GPL-3.0-only + comercial | 3.4.0 / 10.08.2026 | activă | 18 pachete de limbă, fără română |
| @formulajs/formulajs | MIT | 4.6.1 / 28.07.2026 | activă | doar funcțiile, fără parser |
| fast-formula-parser | MIT | 1.0.19 / 12.10.2023 | slab întreținută | — |
| hot-formula-parser | MIT | 4.0.0 / 2022 | **arhivată** | — |
| Quill | BSD-3-Clause | 2.0.3 / 20.01.2025 | activă | pe cdnjs și jsdelivr |
| TipTap (`@tiptap/core`) | MIT (nucleul) | 3.31.3 / 04.09.2026 | foarte activă | extensiile „Pro” sunt plătite (licența lor exactă **NEVERIFICAT**) |
| ProseMirror | MIT | prosemirror-view 1.42.5 / 21.09.2026 | activă (depozitul s-a mutat de pe GitHub) | baza lui TipTap |
| Jodit | MIT | 4.15.14 / 24.09.2026 | activă | — |
| CKEditor 5 | GPL-2.0-or-later sau comercial | 48.5.2 / 25.09.2026 | activă | cere `licenseKey: 'GPL'`, varianta de pe CDN cere cheie plătită |
| TinyMCE | GPL-2.0-or-later (din v7; până la v6 era MIT) | 8.9.2 / 23.09.2026 | activă | — |
| PPTist | AGPL-3.0 | — (actualizat 19.09.2026) | activă | singurul editor de diapozitive liber găsit; AGPL = obligă la publicarea codului |
| reveal.js | MIT | 6.0.2 / 10.09.2026 | activă | doar prezintă, nu editează |
| Fabric.js / Konva | MIT / MIT | 7.4.0 / 10.7.0 (2026) | active | pânze pentru obiecte mutabile |
| PptxGenJS | MIT | 4.0.1 / 26.06.2025 | activă | doar generează fișiere .pptx |

Notă: jsdelivr servește orice pachet npm, deci „e pe jsdelivr” nu spune nimic despre calitate. Recomand oricum copierea locală (vendor), cu LICENSE alături.

## Anexa C. Note tehnice pentru cine implementează

- `tip-foaie.js:29` ghicește setările după prezența lui `;` în formulă. Pentru fidelitate: comutator global `'ro'|'en'` (ținut în `localStorage`), care fixează separatorul (`;` RO, `,` EN) și zecimala (`,` RO, `.` EN). Numele funcțiilor rămân englezești în ambele moduri; `RO_NAMES` (`:8`) rămâne ca indiciu. Constanta cu numele erorilor (`FErr`, `:24`) se aliniază după proba din laborator.
- Modul „arătare”: dacă `#fxin` conține o formulă începută (`=` și ultimul caracter e operator, `(` sau `;`), clicul pe o celulă inserează adresa la cursor, nu schimbă `act`. Țintele rămân celulele cu chenar.
- Fill handle: un pătrățel pe celula activă; `pointerdown` + `pointermove` peste rânduri → `Q.umple` dinamic; `shift()` există deja (`:11-22`).
- `expand()` (`:48`) acceptă doar o literă de coloană; merge pentru gimnaziu.
- Word: `word-vii` nu e pe motor (README jocuri rândurile 213, 301-302). Portarea spre `_motor/tip-editor.js` e deja pe listă; editorul nou să fie acolo.
- Toate bibliotecile se copiază local (vendor) în `jocuri/_motor/vendor/`, cu fișierul LICENSE lângă ele, ca site-ul să nu depindă de CDN în laborator.
