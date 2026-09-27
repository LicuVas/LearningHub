# Surse — VII · M1 · lecția 6 „Formatarea textului și a paragrafului”

## Programa și ordinea lecțiilor
- `C:\00\Projects\Info_Gimnaziu_2026\data\unitati.json` — VII-U1 „Tehnoredactare: editorul de texte” (CS.1.1, CS.3.1), lecția 6 „Formatarea textului și a paragrafului”; lecția 7 „Formatarea imaginii, a tabelului și a paginii” NU e cerută aici.
- `C:\00\Projects\Info_Gimnaziu_2026\planificari\Calendar_ore_7_MA.md` — lecția 6: 16.10.2026 (Brauner); în aceeași săptămână Tupilați luni 12.10 (ora simultană cu a VI-a), Izvoare marți 13.10.
- `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json` (OMEN 3393/2017) — conținutul declarat, copiat exact: „Operaţii de formatare a unui document: text, imagine, tabel, pagină” (azi doar textul și paragraful).

## Materialul refolosit
- `jocuri\word-vii\index.html`, nivelurile „Caractere” și „Paragrafe” (`lectii:[6]`): ordinea ideilor (B/I/U, mărimea în pt, regula „întâi selectezi”, alinierea paragrafului, titlul centrat cu butonul), exemplele cu serbarea. Nu am preluat listele (nu sunt în titlul lecției) și nici „¶” (nu e cerut de lecție; butonul merge în simulator).
- Capturi reale din Word (proveniența în `jocuri\word-vii\img\SURSE.json`): `afis-model.webp` (pasul 0 și ținta din „Acum în Word-ul adevărat”), `grup-font.webp` (pasul 1), `grup-paragraf.webp` (pasul 4).
- Panglica reală: `jocuri\_motor\panglica-word.json/.js` (dump UI Automation al Word-ului instalat, 27.09.2026), desenată de `jocuri\_motor\ui-panglica.js`.
- Lecțiile 4 și 5 ale clasei (`lectii\vii\m1-l04`, `lectii\vii\m1-l05`): ce știe elevul (selectarea, Ctrl+Z, descărcarea + Activare editare) și forma lecției; simulatorul comun `lectii\_sim\wordobj.js` (proprietar: autorul lecției 5) — NEMODIFICAT; extensia mea `lectii\_sim\wordobj-formatare.js` îi folosește `TipWordObiecte.MODEL` (spațiile la lipire/ștergere, cuvântul la dublu-clic) și stilul `.wo-*`.

## Proba în Word-ul real (rezumat; detaliile în `afirmatii.json`)
- Scripturi: `_proba\proba_word_formatare.py`, `_proba\proba_word_formatare_2.py`, `_proba\proba_word_formatare_3.py` → `_proba\rezultate_word.json`; `_proba\fa_docx_si_proba_provocare.py` → `anunt-serbare.docx` + `_proba\proba_provocare.json` (0 nepotriviri).
- Word 16.0.20326, interfață EN; Windows cu setări românești (cm, virgulă zecimală). Instanță nouă, invizibilă; documente noi închise fără salvare; clipboardul pus la loc.
- Descoperiri care au schimbat lecția sau simulatorul:
  - Increase Indent și alineatul implicit merg cu **1,25 cm** (oprirea de tab cu centimetri = 35,4 pt), nu 1,27 cm. Lecția cere „1,25 cm”; testele acceptă 1,22–1,28 cm.
  - Cu cursorul **în mijlocul** cuvântului, B/I/U, Grow Font, Font Color și fereastra Font formatează tot cuvântul; la început / la capăt, doar ce tastezi de acum. De aici pasul 3.
  - Dublu-clic + U subliniază și spațiul de după cuvânt → spus în „Uite cum” la pasul 1.
  - B pe o selecție amestecată urmează primul caracter (simulat, nepredat).
  - **CORECTAT după judecător:** alinierea COMUTĂ, la taste și la butoane. Probat cu TASTE REALE (`_proba\proba_word_taste_reale.py`, metoda judecătorului): Ctrl+E / Ctrl+R / Ctrl+J apăsate a doua oară întorc paragraful la stânga, iar Ctrl+L / Align Left pe un paragraf deja la stânga îl face stânga-dreapta; comută doar dacă toate paragrafele atinse au deja alinierea cerută. Concluzia mea veche („tastele nu comută”) era FALSĂ: `FindKey().Execute()` rulează comanda fără comutarea tastei. Simulatorul și pasul 4 spun acum asta.
  - Mutarea cursorului pierde formatarea de tastare (Ctrl+B, apoi săgeți, apoi tastezi -> text normal), probat cu taste reale -> spus în pasul 3.
  - Butonul Culoare font (Font Color) e pe AL DOILEA rând al grupului Font, ultimul (dump) -> textul pasului 2 corectat.
  - Afirmația „spațiile puse de mână se strică la mărire” n-am putut-o proba (pozițiile din paragraful centrat vin vechi pe instanța invizibilă) → scoasă din lecție.

## Numele românești (calibrare: `_campaign\revizuire_completa_2026_09\calibrare\meniuri_ro_en.json`)
CONFIRMATE acolo și folosite: Pornire (Home), Font, Paragraf (Paragraph), Aldin (Bold), Cursiv (Italic), Subliniat (Underline), Fișier (File), Anulare (Undo, doar în simulator), Clipboard, Decupare / Copiere / Lipire (doar în simulator). Din lecția 5: Salvare ca (Save As), Vizualizare protejată (Protected View), Activare editare (Enable Editing), Descărcări (Downloads), Documente (Documents).

NESIGURE (le-am folosit cu numele englezesc întâi, cel românesc doar ca explicație sau în sfatul de la mouse din simulator):
| Englezește (pe ecranul din laborator) | Cum apare în lecție / simulator | De ce e nesigur |
|---|---|---|
| Font Color | „Culoare font (Font Color)” | calibrarea: NESIGUR („Culoare font” vs „Culoarea fontului”) |
| Font Size | „caseta de mărime (Font Size)”; sfatul simulatorului „Mărimea fontului” | o pagină Microsoft ro-ro din cache scrie „caseta Dimensiune font”; necalibrat |
| Grow Font / Shrink Font | doar în simulator: „Mărire / Micșorare dimensiune font” | o singură pagină Microsoft (Word pentru utilizatorii noi); necalibrat |
| Align Left, Center, Align Right, Justify | lecția: „la stânga (Align Left)”, „centrat (Center)”, „la dreapta (Align Right)”, „stânga-dreapta (Justify)” = descrieri, nu nume de butoane; simulatorul: „Aliniere la stânga”, „Centrat”, „Aliniere la dreapta”, „Stânga-dreapta” | nicio sursă calibrată pentru numele butoanelor în română |
| Increase / Decrease Indent | doar în simulator: „Mărire / Micșorare indent” | necalibrat |
| Line and Paragraph Spacing | doar în simulator: „Spațiere între rânduri și paragrafe” | necalibrat |
| fereastra Paragraph: Indents and Spacing, Special, First line, By, Line spacing, 1.5 lines, Double | lecția și simulatorul: DOAR etichetele englezești; în paranteză e sensul („retrage primul rând”, „rânduri mai rare”), nu un nume de etichetă, plus nota „într-un Word în română sunt traduse, în aceleași locuri” | fără sursă pentru etichetele românești (judecător, m1): NU le dau; așezarea ferestrei în Word-ul românesc n-am văzut-o (captura C5) |
| Blank document (ecranul de pornire Word) | lecția, varianta „Nu se descarcă”: „documentul gol (Blank document)” | numele românesc al dalei n-am verificat-o |
| Standard Colors, Theme Colors, Theme Fonts, All Fonts | „Standard Colors (culorile standard)” etc. | necalibrat |

De confirmat pe un calculator din laborator cu Office în română: toate rândurile tabelului de mai sus (capturile propuse în `capturi_lipsa.json`, C1–C5).

## Ce n-am putut verifica
- Gesturile și textul de pe ecran (listele casetelor, meniul de culori, fereastra Paragraph deschisă, bara galbenă): NETESTABILE prin COM; marcate în `afirmatii.json`.
- Valoarea pe care Word o pune singur la „By” când alegi „First line” (simulatorul pune 1,27 cm; lecția cere să scrii 1,25 cm).
- Tab / Backspace la începutul paragrafului: probate de judecător cu taste reale (simulatorul e fidel); lecția nu le predă.
- Ctrl+M / Ctrl+Shift+M și Ctrl+Shift+> / < ca TASTE: rezultatele cu tastele postate au fost neconcludente (A33); butoanele echivalente sunt probate; lecția nu le predă.
- Butonul Justify apăsat a doua oară: ExecuteMso nu-l poate apăsa; în simulator se poartă ca tasta Ctrl+J (probată).
- Culorile exacte ale rândului Standard Colors (simulatorul: Red FF0000, Blue 0070C0…); butonul Font Color pune la început roșu RGB 238,0,0 (probat).

## Alte observații pentru profesor / pentru ceilalți autori
- Termenul: „alineat” (DOOM), nu „aliniat” (sarcina îl scria așa); se încurcă ușor cu „aliniere”.
- `lectii\_sim\wordobj.js` (lecția 5) spune la clic pe Format Painter că „îl folosim abia la lecția despre aspectul textului”; lecția 6 NU îl predă (nu e cerut). Proprietarul lui `wordobj.js` poate schimba mesajul.
- `ui-panglica.js`: numele grupului acoperea săgeata mică ↘; dirijorul a reparat în motor (27.09, zona de 32×32 px pe telefon). În `wordobj-formatare.js` am scos mărirea mea pentru săgeată (s-ar fi suprapus) și am păstrat doar zonele mai înalte pentru casetele Font / Font Size (23 px) și butonul Font Color (27 px), cât permite rândul vecin.
