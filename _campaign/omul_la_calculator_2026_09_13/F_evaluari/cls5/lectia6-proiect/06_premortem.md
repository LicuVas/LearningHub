# 06 — Pre-mortem (U14) + explicații alternative (U13)

> Schiță scrisă imediat după pasul 1 (context proaspăt). Se completează la pasul 5 cu verificarea făcută.

„Ora cu posterul a eșuat în laborator. De ce?”

1. **Timpul.** Lecția cere 30+60+30 = 120 de minute de lucru pe poster, plus 5 minute de provocare și 4 atomi cu 6 întrebări, într-o oră de 50 cu 8 minute de pornire.
   - Verificare de făcut: suma fazelor din text + calculul porții (U12).
2. **Unealta nu a fost predată.** Paint (editor grafic) vine la ora 18 (29.01.2027), PowerPoint nu apare la clasa a V-a. Elevul de 11 ani nu știe să insereze forme, text, să aranjeze.
   - Verificare de făcut: planul (`surse/calendar_plan_extras.txt`) + construiesc posterul doar cu ce ar putea un începător și notez unde ar fi avut nevoie de o comandă nepredată.
3. **Nu există barem.** „Evaluat conform criteriilor de mai sus” — dar mai sus nu e niciun barem cu puncte. Profesorul nu poate nota 25-30 de postere unitar într-o oră.
   - Verificare de făcut: Grep „criteri/barem/punct” în HTML; aplic „Checklist Final” pe posterul meu și cronometrez cât durează o notare.
4. **Salvarea și predarea.** „Salveaza in format PDF pentru predare”: Paint nu are PDF la Salvare ca; nu se spune UNDE se salvează și cum ajunge la profesor (stick? rețea? e-mail?). Canva și Google Slides cer cont.
   - Verificare de făcut: documentația Microsoft pentru Paint (formate de salvare, ro-ro + en-us) și paginile Canva/Pixabay (text brut) despre cont.
5. **Conținut greșit copiat pe poster.** Lecția spune „foloseste exact aceste informatii”; dacă una e greșită (ex.: „distanta minim 50-70 cm”, „Procesor - Tip: Procesor”, „Start → Power → Shut Down” în Windows în română), 25 de postere o repetă.
   - Verificare de făcut: fiecare cifră/afirmație din modelul de rezolvare contra unei surse primare.

## Completare la pasul 5 — ce a ieșit din fiecare verificare (U14)

| # | Motiv | Verificarea făcută | Rezultat |
|--:|:--|:--|:--|
| 1 | Timpul | `u5_iesire.json` A1 + calculul porții (`u12_poarta_iesire.txt`) | **CONFIRMAT.** Fazele = 120 min; poarta dă „nu încape” și la ritm dublu. Lecția nu spune nicăieri că fazele se întind pe mai multe ore sau acasă (`u13_observatii.txt` §1: zero apariții). |
| 2 | Unealta nepredată | planul (`surse/calendar_plan_extras.txt`) + posterul făcut (`03_jurnal_sarcina.md`) | **CONFIRMAT.** Editor grafic = ora 18 (29.01.2027); PowerPoint nu e la a V-a; lecția nu explică nicio operație (casetă de text, mutare, culoare, export). |
| 3 | Nu există barem | Grep (`u5_iesire.json` A2) + notarea posterului (`u1_notare_iesire.json`) | **CONFIRMAT în lecție**: 9 bife fără puncte, 3 nedecidabile; ~86-104 min pentru 25-30 de postere (calcul). **Dar** Vasile are deja `instrumente/Grila_produs.md` (5 criterii × 3 niveluri) — `surse/grila_produs_vasile.md`. Lecția nu o folosește. |
| 4 | Salvarea și predarea | Microsoft ro-ro Paint (`surse/paint_ro.txt`), Canva (`surse/canva_about_edu.txt`), JS (`u5_iesire.json` A7) | **CONFIRMAT parțial.** Paint: PDF nenumit printre formate; Canva: doar prin invitația profesorului + acord parental sub 13 ani; nicio indicație despre loc de salvare/predare. Dacă PC-urile au restaurare la repornire — **nu se poate fără sală**, pentru că dotarea e necunoscută (întrebare la anexă). |
| 5 | Conținut greșit copiat | fiecare afirmație din model contra surselor (`04_a_doua_cale.json`, `04_norma.md`) | **INFIRMAT la fond:** cifrele de ergonomie sunt în interval (AAO 25 inches ≈ 63,5 cm). Rămân: fără diacritice (0,1), „Start → Power → Shut Down” vs „Alimentare > Închidere” în română, Procesor cu „Tip: Procesor”. |

Motiv nou apărut în timpul lucrului: **exemplul de poster nu se vede ca poster** (clasele `poster-*` fără CSS; stil calculat `display: block`, titlu 16 px — `u5_iesire.json` B). Singurul model vizual al lecției apare ca o listă.

## U13 — explicații alternative pentru semnalările grave

**S1. „Ora nu încape: 120 de minute de faze.”**
- Alternativă A: fazele sunt gândite pe 2-3 ore sau ca temă. Observația care le deosebește: lecția spune undeva „ora viitoare”, „acasă”, „ore”? → `u13_observatii.txt` §1: nu (singurele „ore” sunt din regula pauzelor și „a lipsit de la ore”). Alternativa nu e susținută de text; chiar dacă ar fi intenția, planul nu are 2-3 ore libere în V-U1.
- Alternativă B: minutele sunt orientative, elevul lucrează mai repede. Observație: posterul meu, făcut de un script, are 180 de clicuri și ~1.000 de caractere; la 40 de caractere/minut doar tastarea = 25 min. Nici la ritm dublu nu încape (poarta).

**S2. „Unealta nu e predată.”**
- Alternativă: elevii știu Paint/PowerPoint din primar sau de acasă. Observație: programa clasei a V-a predă editorul grafic de la zero (CS.3.1: „Rolul unui editor grafic Elemente de interfață specifice Crearea, deschiderea şi salvarea fişierelor grafice” — `surse/curriculum_extras.txt`), deci programa presupune că NU știu. Ce știu copiii concret de acasă = întrebare pentru ora de evaluare inițială (11.09).

**S3. „Nu există barem aplicabil.”**
- Alternativă: baremul stă în materialele profesorului, nu pe site. Observație: căutat în `Info_Gimnaziu_2026` → există `instrumente/Grila_produs.md`, aplicabilă oricărui produs. **Semnalarea se reformulează**: lecția nu are barem și nu trimite la grila existentă; „Checklist Final” concurează cu grila (45 de fapte de verificat vs 5 criterii pe niveluri).

**S4. „Exemplul de poster e nestilizat.”**
- Alternativă: stilul vine dintr-un JS sau dintr-un CSS încărcat dinamic. Observație: stilul **calculat** în Chromium după încărcarea completă = `display: block`, `font-size: 16px`, `font-weight: 400` (`u5_iesire.json` B_stil_exemplu_poster). Indiferent de unde ar veni, nu vine.

## U17 — Sala reală
- **Brauner, sala 1 (TIC):** posterul digital depinde de program instalat (necunoscut), de salvare/predare (necunoscut) și de o unealtă nepredată (cunoscut: nu e predată). Nu se poate ține ca oră la calculator în M1 fără o oră anterioară de „cum pun o casetă de text și o formă”.
- **Clasa-pereche 5M (sala 4/5, posibil fără calculatoare):** varianta pe **hârtie** e realistă și e în programă („planşe”, CS.1.1): coală A3, grupe de 3-4, fiecare grupă o secțiune (componente / Input-Output / Hard-Soft / reguli), 30 min lucru + 15 min turul galeriei. De pregătit: coli A3, carioci, fișa cu cele 8 componente, grila de produs tipărită.
- **Izvoare:** nu se aplică (clasa a V-a e doar la Brauner).
