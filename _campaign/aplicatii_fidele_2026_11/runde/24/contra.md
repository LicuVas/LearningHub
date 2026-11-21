# Contra (înainte de hotărâre)

## Cel mai puternic argument PENTRU plan
- **Asistentul:** un elev care face drumul lecției `m1-l03:189-192` cu tastele (Tab, Alt+↓, ↓, Enter) primește azi bula pe PDF după doi pași BUNI. Apoi vede pasul „Save” bifat fără ca fișierul să fie salvat (`rc20.json` › M6, reprodus la pasul zero: AS1a, AS1c).
  - Asta e exact opusul lui R7: asistentul îl induce în eroare pe cel care merge bine.
  - Schimbarea e de două rânduri. Ea atinge doar evenimentele cu `actiune: 'mutare_focus'`, pe care azi le emit numai Tab / Shift+Tab în ferestre (`aplicatii.js` › `I.tabFereastra`, `excel.js` › `tabDialog`).
- **Fereastra mică:** pe laptopul din laborator (1366×768 la 125%, în browser) elevul nu vede butonul Save. Lecția îi cere exact acel buton.

## Cel mai puternic argument ÎMPOTRIVĂ
- **O lecție care chiar învață Tab-ul** („apasă Tab ca să ajungi la Save as type”) nu mai poate folosi ținta simplă: Tab nu mai face pasul.
  - Răspuns: o astfel de lecție își spune pasul cu `asteapta(ev)`, care primește în continuare evenimentul (neatins, A21-1).
  - Azi nicio lecție nu are un pas pe Tab: O9 › F nu vede nicio lecție cu biblioteca.
- **Micșorarea ferestrei** nu e în referință: e o alegere a noastră pentru ecranele mai mici decât fereastra. Un critic pe unghiul aspect o poate numi „fereastra are altă mărime decât în Word”.
  - Răspuns: la ecranul referinței (1366×768) și pe tablă nu se schimbă nimic (MN4, plus măsura la 1920×1080).
  - Pe fereastra mică, alternativa e un buton Save pe care elevul nu-l vede.
  - Alegerea intră în `de_verificat.md` (R24-3) cu proba care ar lămuri-o.

## Adevărul incomod (punctul cel mai puțin sigur)
- **O4 la Word nu scade în runda asta.** Cele două rânduri din ținta 2 nu sunt comportament greșit al simulatorului:
  - `word-clic-pune-cursorul` = clicul hamului real cade cu 0,5 px la stânga mijlocului (`x + l // 2`, pixeli întregi), iar al simulatorului exact la mijloc. Ambele aplicații pun cursorul la cea mai apropiată graniță.
  - `word-imagine-inserare` cere `PictureInsertFromFile`, adică rândul „This Device” dintr-un meniu închis.
- O „reparație” în `word.js` care să dea 9 ar ghici pe zecimi de pixel, iar una care pune „This Device” direct pe filă ar strica fidelitatea panglicii (O3).
- Le predau orchestratorului (o rundă `acoperire` pe ham / scenariu). Regula de platou poate opri valul pe aceste numere: îl opresc cifrele adevărate, nu o reparație falsă.

## Hotărârea
Repar asistentul (ținta 1) și cele 3 MINOR-uri care au o sursă sau sunt cosmetice și sigure. Pe O4 dovedesc pe disc de ce nu repar (varianta scenariului jucată pe o copie). Unghiul aspect îl măsor pe ferestrele cu dreptunghiuri în referință.
