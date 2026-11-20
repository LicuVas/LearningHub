# Runda 14 · contra (pasul 4)

## Planul
T1: un cârlig comun în `aplicatii.js` (`I.la.fereastra`, pus doar de PowerPoint) care, cât e deschisă o fereastră, ia Alt + literă
din `__nod.ta` (referința), apasă butonul / mută focusul în câmp și emite `tasta_acces`; Tab / Shift+Tab trec prin controalele
ferestrei în ordinea nodurilor din referință și nu ies din ea. T3: aceeași stivă de fonturi (Calibri Light / Calibri, apoi Carlito,
apoi sans-serif) pentru fontul temei și pentru „Calibri Light (Headings)” ales. T2: `__nod.ta` pe fila contextuală + listele deschise
din taste țin modul tastelor (nicio literă în formă). T4: `tastaFaraClic` emite `tasta_esc` când tasta curentă e Esc.

## Cel mai puternic argument PENTRU
Toate patru au referința deja capturată (literele pe noduri, „Alt, J D”, Theme Fonts Calibri Light / Calibri, api:172) și sunt
reparații mici, localizate; Word și Excel au deja exact comportamentul T1 (word.js:1957, excel.js:3246), deci PowerPoint doar se
aliniază la ce s-a dovedit în rundele 4 și 7. Cârligul comun e opt-in, deci evenimentele Word / Excel rămân identice.

## Cel mai puternic argument ÎMPOTRIVĂ
Codul comun e folosit de trei aplicații și de 9+ lecții: o schimbare în `tastaFaraClic` sau în ascultătorul `keydown` comun poate
schimba evenimentele Word / Excel pe care le așteaptă probele vechi (runde 2-10) și O5; iar „ordinea Tab” nu e capturată — orice
ordine aleg e [presupus], deci criticul poate s-o conteste. Fontul: pe mașina fără Calibri (telefon, Linux) Calibri Light cade pe
Carlito (regular), mai gros decât Light — dar la fel pentru fontul temei și pentru cel ales, deci elevul vede aceleași litere.

## Adevărul incomod (punctul cel mai puțin sigur)
T4 depinde de a ști, în `tastaFaraClic`, CE tastă a declanșat ieșirea (Esc față de Alt). Dacă urmăresc tasta curentă printr-un
ascultător pe `window` în faza de captură, orice ieșire din tastele de acces declanșată de altceva decât o tastă (clic) poate lua o
tastă veche. Verificarea: proba cu `Alt, H, F, Esc` (tasta_esc ×3) ȘI `Alt, Alt` (tasta_acces) ȘI clic în timpul insignelor (fără
eveniment de ieșire) în toate trei aplicațiile.

## Hotărârea
Merg pe plan, cu cârligul opt-in pentru T1 (Word / Excel neatinse), urmărirea tastei în codul comun pentru T4 (o singură reparație,
fără să ating word.js / excel.js) și proba T4 în toate trei aplicațiile înainte de regres.
