# Raportul turei de seară — 26.09.2026 (19:00 – 23:45)

Cerere: să lucrez cu trei surse (plimbarea novicelui din consola asta, progresul pe situl de probă și
fidelitatea cu Office), în buclă, ca pe o tură de noapte, apoi să actualizez situl.

Unde e: tot pe ramura `proba`, publicat pe https://proba.learninghub-8z6.pages.dev/jocuri/
Producția (situl principal) NU e atinsă. Mutarea în producție rămâne decizia ta (comanda e la final).
Contractul lucrării (ce am înțeles din cerere, cu cele trei alegeri ale tale): `_cercetare\contract_bucla_2026-09-26.md`.

---------------------------------------------------------------------------------------------------

## FĂCUT (fiecare cu dovada)

1. Ce trebuie să știi dinainte (cererea ta: „ce se presupune să știi până în acel moment și unde cauți”)
   - O unealtă citește toate jocurile de învățare în ordinea programei (V → VIII) și află, la fiecare nivel,
     ce noțiuni din jocurile de dinainte folosește. Pentru fiecare dă fraza care o explică și jocul și nivelul
     unde se învață.
   - La primul pas al fiecărui astfel de nivel apare, restrâns, blocul „Ce trebuie să știi dinainte (N)”.
     La clic se deschide cu fraza-amintire și linkul „Dacă nu-ți amintești: <jocul>, nivelul <n>”.
   - Acum sunt 12 prerechizite pe 10 niveluri. De exemplu: web-viii N1 „browserul” (din Documentare, clasa a V-a),
     excel-viii N1 „celula” (din Word, tabelele), word-vii N1 „panglică” (din Prezentări).
     Prima variantă avea 1.953 de „termeni”, pentru că orice cuvânt îngroșat era luat drept noțiune. A doua avea 30.
     Bucla de critici a strâns-o la 12 și a verificat fiecare intrare cu sensul ei din nivel.
   - Dovadă: blocul verificat în browser pe fiecare nivel cu prerechizite, și pe situl live: 0 probleme.

2. Exerciții care cer ce încă nu s-a predat
   - Unealta verifică și exercițiile: orice construcție de cod, tastă, etichetă HTML sau funcție Excel cerută
     într-un exercițiu trebuie să fi fost predată înainte.
   - Am găsit și am reparat în program-vii: un exercițiu cerea „>=” înainte de pasul care îl explică. Acum pasul
     explică <, > și == (două semne egal, pentru că = e atribuirea).

3. Panglica REALĂ Excel în „Excel pas cu pas”
   - Panglica veche avea 3 file, iar butoanele erau text și emoji. Cea nouă e exact panglica Excel-ului de pe
     calculatorul tău: 7 file (Home, Insert, Page Layout, Formulas, Data, Review, View), 42 de grupuri, 196 de
     butoane, cu etichetele și proporțiile reale și cu icoanele Microsoft Fluent (licență liberă).
   - Am luat-o din Excel-ul instalat, pe un desktop ascuns, fără să-ți ating ecranul. Tipul fiecărui buton l-am
     verificat în lista oficială Microsoft. Niciun buton nu e inventat.
   - Butoanele pe care simulatorul le știe (Bold, Fill Color, Merge & Center, Sum, Sort, grafice…) funcționează
     ca înainte. Celelalte se văd ca în Excel, iar la clic spun: „… e aici și în Excel, dar în exercițiile de azi
     nu-l folosim”.
   - Pe telefon, panglica se derulează în lateral, iar pe ecran scrie asta.
   - Dovadă: proba panglicii 0 pe PC și pe telefon; proba gesturilor (mouse și tastatură reale) trece, dar vezi
     NESIGUR 2; poarta trece pe toate cele 4 jocuri Excel. Capturi: `_tests\_capturi\panglica_pc.png`, `panglica_telefon.png`.

4. Bucla de critici pe cele 19 jocuri (treapta normală)
   - 4 runde, oprită singură după 3 runde fără nimic grav. Oracolul a scăzut de la 3 la 0.
   - A reparat: harta mai precisă; program-vii (semnele de comparare); colaborare-vii, nivelul 6: cele șase
     semne ale mesajului-capcană trimit acum la jocul unde s-au învățat (Misiunea Mesaj Sigur, clasa a VI-a),
     iar legenda capturii spune ce se vede de fapt în ea.

5. Cititorii „începători cu carte închisă” pe 3 jocuri (Webmaster, Excel pas cu pas, Word)
   - Fiecare cititor e un proces separat, vede doar paginile și nimic din afară. Rularea e VALIDĂ: canarul
     (un fapt schimbat intenționat) și momeala (un text care nu există) au trecut, deci au citit și n-au răspuns
     din memorie.
   - 9 din 9 sarcini rezolvate doar cu ce scrie în pagini.
   - Au semnalat 2 cuvinte folosite înainte de a fi explicate. Le-am reparat: „filă” (fila browserului) în
     Webmaster, nivelul 2, și „formatarea” în Word, nivelul 2.

6. Reparate pe drum (le-am găsit pentru că am verificat, nu le căutam)
   - Evidența activității (`prezenta.js`): o eroare ascunsă („null.id”) când elevul se schimbă exact în
     momentul trimiterii. Proba progresului pe elev e 0 de 3 ori la rând, și pe situl live.
   - Motorul buclei citea greșit numărul oracolului: un rând adăugat de unealtă („[exited with code 0]”)
     lăsa bucla fără măsurătoare. Reparat în sistem, simulatorul și cei 32 de mutanți trec.
   - Unealta mea de hartă avea o alarmă falsă (formula IF era predată într-un bloc de cod pe care nu-l citea).
     Critica a prins-o, iar eu am reparat unealta, nu conținutul.

7. Starea finală, măsurată
   - Poarta completă: 27 din 27 de jocuri [TRECUT].
   - Oracolul jocurilor: 0.
   - Situl de probă e live cu versiunea nouă. Am verificat după conținutul fișierelor, nu doar după codul 200.

---------------------------------------------------------------------------------------------------

## NEFĂCUT (cu deblocatorul)

1. Panglica Word și PowerPoint. Pe calculatorul tău rula deja un Word, pornit pe 24.09, fără fereastră, pe care
   nu l-am atins. Word și PowerPoint pornesc o singură dată, așa că încercarea mea s-a lipit de el și nu a dat
   date. Se face în etapa Word: fie cu acel proces închis, fie pe un PC din laborator.
2. Producția. E decizia ta. Când vrei:
     git -C C:\00\Projects\LearningHub merge --ff-only proba   și   push pe master
   apoi, ca verificare:
     python C:\00\Projects\LearningHub_proba\jocuri\_motor\proba_sertare.py --baza https://learninghub-8z6.pages.dev --nor-real  (trebuie 0)
3. Etapa următoare de fidelitate, pe care ai ales-o: Word (VII-U1). Începe cu proba editorului
   (canvas-editor vs ProseMirror, pe telefonul real).

## NESIGUR (spus deschis)

1. Numele românești ale butoanelor Office: panglica arată etichetele din Excel-ul tău (în engleză). Dacă în
   laborator Office e altă versiune, câteva etichete pot diferi. Se verifică rulând dump-ul pe un PC de acolo.
2. Proba gesturilor Excel a căzut de 2 ori din 9 rulări, înainte de o mică protecție adăugată de mine
   (panglica nu mai redesenează foaia în timp ce elevul scrie). După ea: 3 din 3. Nu pot dovedi că problema
   a dispărut complet.
3. Harta prerechizitelor e o euristică: lucrează pe cuvinte și pe definiții găsite în text. Cele 12 intrări
   au fost citite de critici și de mine, dar o noțiune definită altfel decât „X este…” poate să lipsească.

## Ce să încerci mâine pe probă (5 minute)

- https://proba.learninghub-8z6.pages.dev/jocuri/web-viii/ : intră în nivelul 1 și deschide „Ce trebuie să știi dinainte”.
- https://proba.learninghub-8z6.pages.dev/jocuri/excel-pas-cu-pas-viii/ : intră într-un nivel cu foaia, uită-te
  la panglică și apasă Bold, apoi Format Painter.
