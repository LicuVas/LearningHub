# Evaluare pentru Vasile — cls8 · „Proiect Final: Catalogul Școlar Complet” (lectia6-proiect)

**Când:** ora 12 din planul VIII-U1 — Brauner 8A/8M **vineri 04.12.2026**. La Izvoare ora nu există (01.12 e liber; calendarul o mută în „temă acasă”).

## Pe scurt
Am construit catalogul exact cum cere lecția (toate formulele, formatarea, graficul, pagina) și l-am recalculat și tipărit în PDF. **Cu datele lipite corect, pașii 1-6 merg**: mediile, minimul, maximul și COUNTIF dau aceleași cifre în LibreOffice și în Python. Problemele sunt în jurul pașilor, nu în formulele de bază.

## Cele trei lucruri care schimbă ora
1. **Rezolvarea Exercițiului 1 e greșită.** Scrie `G4: =AVERAGE(B4:F4)` pentru un catalog cu Nr., Nume și 5 materii. Formula ia coloana cu numele (pe care o ignoră în tăcere) și sare peste materia a 5-a. Pe tabelul meu cu 15 elevi, 14 medii ies greșite (6,125 în loc de 6,4) și nu apare nicio eroare. Corect: Media în H, `=AVERAGE(C4:G4)`. Dovada: `u5_reproducere.txt`.
2. **Proiectul nu se poate nota pe clasă.** Lecția nu are barem. Cine urmează pașii predă același fișier ca toți colegii (aceleași date, aceleași celule). Pe grila școlii (`Grila_produs.md`) iese „De bază” la organizare, deci toată clasa ia același nivel. Nici nu scrie unde se salvează fișierul sau cum ajunge la dumneavoastră. Propunere: Încearca e exercițiu ghidat nenotat, iar Ex. 1 (catalog propriu) e produsul notat, cu grila dată la început.
3. **Cere lucruri nepredate și ține mai mult decât o oră.** Tipărirea (Page Layout, margini, antet de pagină) și COUNTIF nu sunt în programă și nu apar în lecțiile 1-5 (0 apariții, `u4_predat_inainte.txt`). Poarta calculează **91 de minute** (la ritm dublu 50). Lecția promite „15-20 minute”.

## Alte lucruri importante
- **Regula de promovare e greșită pentru un catalog:** `=IF(media>=5,"Promovat",...)` pe media generală. Regulamentul (ROFUIP 2024, art. 115) cere minim 5 la **fiecare** materie. Soluția folosește ce s-a predat deja: `=IF(MIN(C4:G4)>=5,...)`.
- **Punctul zecimal în notele de lipit („7.50”)** e a cincea lecție la rând cu această problemă. Pe Windows în română notele pot rămâne text și toate mediile arată `#DIV/0!` (`recalculat/lipire_roRO_text.xlsx`). Ajutorul „Convert to Number” nu repară un punct. Cea mai simplă soluție: note întregi, cum sunt notele reale.
- **„Excel Online” nu poate seta marginile** (documentația Microsoft ro-ro o spune). Toate comenzile sunt date doar în engleză; pe Office în română butoanele se cheamă „Îmbinare & centru”, „Aspect pagină → Margini → Îngust”, „Inserare → Antet & subsol”.
- **Date personale:** Ex. 1 spune „pentru propria ta clasa … note inventate (sau reale, daca vrei)”. Un fișier cu colegii și notele lor, pe un PC comun, e o problemă. Trebuie scris: nume și note inventate.
- **Graficul de la Ex. 2** (mediile pe materii, între 7,45 și 7,60) iese cu axa pornind de la 7,35, deci diferențe de 0,15 par duble. Lipsește pasul „axa de la 0”.
- **Mărunte:** cardul din pagina modulului se cheamă „Buget Personal”, titlul catalogului are anul „2024-2025”, butonul de sus „Urmatoarea →” duce la modul, zero diacritice.

## Verificare separator (cerută)
Azi, pe fișier: **nu există niciun `;` real** în formulele lecției. Inventarul vechi (5 cu `;`) număra `;` din codul HTML `&gt;` (semnul `>`). Lecția folosește numai virgula și nu are nicio notă pentru Windows în română.

## Ce vă întreb
- La Izvoare: proiectul se face pe caiet, se mută la Brauner sau rămâne temă? Câți elevi au Excel acasă?
- În sala 1 TIC fișierele rămân pe PC după repornire, până la evaluarea din 11.12?
- Elevii au conturi Microsoft / e-mail, sau predați fișierele pe un folder comun?
- La oră: notați unde se blochează (notele ca text, selecția cu Ctrl, meniurile în română, locul salvării).
