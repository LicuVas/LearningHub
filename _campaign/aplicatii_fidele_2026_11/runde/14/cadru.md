# Runda 14 · cadrul (pasul 2) — înainte de orice reparație

Suprafața: tastatura PowerPoint pe drumurile lecțiilor (ferestrele Open / Save your changes / Insert Picture / Save As / Font /
Paragraph, fila contextuală Shape Format, listele panglicii, modul tastelor de acces) + fontul temei pe diapozitiv. Unghiul
criticului care urmează: `stare_finala_erori` (starea finală după fiecare drum și după fiecare greșeală tipică).

## Presupuneri despre suprafață (de verificat pe disc, nu de crezut)
1. Ferestrele PowerPoint sunt desenate din referință (`pang.deseneaza`, `date/powerpoint.json › suprafete.dialog.*`) și fiecare nod
   are `__nod.ta` = `tasta_acces` din `uia_powerpoint.json` — deci literele Alt+x pot fi luate din DOM, fără listă scrisă de mână.
   (Verificat: `dialog.FileOpen` File name „Alt+n”, Open „Alt+o”; `dialog.save_your_changes_to_this_file` Save „ALT+S”, Don't Save
   „ALT+n”; Font Size „ALT+S”; Paragraph Alignment „ALT+g”.)
2. Word și Excel au deja Alt + literă în ferestre, fiecare cu ascultătorul lui în faza de captură (word.js:1957-1980,
   excel.js:3246-3269), care emite `tasta_acces`. Deci felul de gest „cel mai apropiat existent” e chiar `tasta_acces`, iar codul
   comun nou nu trebuie să atingă drumul lor (altfel O5 / probele vechi Word-Excel se schimbă).
3. Fila contextuală Shape Format e un `div` făcut de mână în `actualizeazaContext` (powerpoint.js:660), fără `__nod`, deci fără `ta`;
   tasta ei („Alt, J D”) stă în referință pe `Group 'Shape Format'` din `panglica_context.Ctx_ShapeFormat`.
4. Fontul de pe ecran vine din CSS (`aplicatii.css:369/371`, Aptos) când caseta n-are font ales și din `stilFmt` (powerpoint.js:419)
   când are; cele două stive diferă, deci chiar „Calibri Light” ales arată altfel decât fontul temei pe o mașină fără Calibri Light.
5. Esc în modul tastelor de acces trece prin `I.tastaFaraClic('iesire_taste_acces')` în toate trei aplicațiile; aceeași acțiune o
   folosește și Alt apăsat a doua oară (keyup), care TREBUIE să rămână `tasta_acces`.

## Citirile lui „fidel” pentru suprafața asta
- **Aspect**: ecranul arată ce arată PowerPoint real (insignele J D, fontul Calibri Light / Calibri).
- **Gest**: fiecare tastă face ce face în aplicația reală (Alt+S apasă Save, Tab rămâne în fereastră, J D deschide fila).
- **Stare finală / mesaj de eroare**: după drumul elevului (inclusiv greșit: litere tastate cu o listă deschisă, Tab „pierdut”,
  Esc în modul tastelor) `stare()` și ecranul sunt cele din PowerPoint real, iar evenimentul spune ce s-a întâmplat.

## Citirea aleasă: GEST + STARE FINALĂ
GRAV-urile T1-T4 sunt toate de gest (tasta nu face ce face în aplicația reală) cu efect direct pe starea finală (fereastra rămâne,
litera „w” intră în stea, Size neschimbat). Unghiul criticului 14 e starea finală după greșeli, deci fiecare reparație se judecă
după starea de după gest (prezentare deschisă, font, text) și după evenimentul emis — nu după cum arată.
De ce pierd celelalte: „aspect” singur ar repara T3 (fontul) și insignele, dar ar lăsa tastatura moartă în ferestre (T1), care
blochează elevul; „mesaj de eroare” nu are aici referință capturată (ferestrele de eroare PowerPoint nu sunt în `uia_powerpoint.json`).
