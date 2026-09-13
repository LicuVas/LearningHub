# 06 — Pre-mortem (U14) și explicații alternative (U13)

„Ora de grafice din 24.11.2026 (Izvoare) / 27.11.2026 (Brauner) a eșuat. De ce?”
(Schița cu cele 5 motive a fost scrisă imediat după pasul 1; mai jos fiecare are verificarea făcută.)

## Cele 5 motive, verificate
1. **Datele lipite din „Copiaza” intră greșit (punct zecimal pe Windows în română).**
   *Verificare:* `u4_cultura.txt` — în ro-RO „7.2” nu e număr, e dată (07.02.2026); randat ambele deznodăminte: `randat_xlsx/lipire_roRO.pdf` (bare 45.900-46.300, Matematica „cea mai mare”), `lipire_text.pdf` (COUNT 0, SUM 0, fără bare). **Confirmat ca risc; depinde de setarea regională din laborator (necunoscută).** Pe en-US merge (`incearca_column.pdf`).
2. **Elevul exersează contrariul regulii (Pie pe medii).**
   *Verificare:* `randat_xlsx/incearca_pie.pdf` + `recalculat/incearca_pie.xlsx` D2:D6: felii 17,5-22,6 % dintr-o „sumă a mediilor” de 35,9; Microsoft ro-ro cere ca toate categoriile să fie „părți ale structurii radiale” (`surse/tipuri_ro.txt`). Grep în innerText: nicio frază nu spune că Pie-ul pe aceste date e greșit. **Confirmat.**
3. **Nu găsește butoanele.**
   *Verificare:* `surse/create_ro.txt`, `etichete_ro.txt`, `tip_ro.txt`: pe Excel în română „Inserați”, „diagrame”, „Adăugare element de diagramă”, „Modificare tip diagramă”, „structură radială”; „Grafice” și „Inserare” nu apar. **Confirmat pentru Office în română; limba din laborator necunoscută.**
4. **Nu încape în 50 de minute.**
   *Verificare:* poarta: pornire 8 + citire 33,8 + sarcină 30,5 ≈ 72 min → nu încape; la ritm dublu ≈ 40 min (ritmuri provizorii). **Confirmat ca „important”, nu blocant.** Nou pe drum: schema din atomul 6 nu are bare (`u5_bare_anatomie.txt`) — profesorul care vrea să explice „anatomia” pe proiector n-are ce arăta.
5. **La Izvoare nu există laborator.**
   *Verificare:* nu se poate fără sală, pentru că dotarea e necunoscută (`B_context_real.md` §3). Pe hârtie: Ex. 2 și Ex. 3 sunt deja sarcini scrise; Încearcă și Ex. 1 se pot face ca desen pe caiet cu pătrățele (axa de la 0 la 10, 1 pătrățel = 0,5) — timp de desen nemăsurat. Materialul pentru hârtie ar trebui să conțină imaginile celor 3 grafice (Column/Pie/Line) — lecția nu le are (schema din atomul 6 e goală). Întrebare deschisă în log (U17).

## U13 — explicații alternative pentru semnalările grave
**A. „Pie pe medii” (motivul 2).**
- *Alternativa:* e intenționat — Încearcă e explorare („Compara cele 3 variante!”), iar contrastul ar trebui să-l facă pe elev să descopere singur că Pie nu merge.
- *Observația care le deosebește:* dacă e intenționat, lecția trebuie să închidă bucla undeva (un răspuns la „ce tip ti se pare cel mai clar”, o întrebare de verificare). *Făcută:* Grep în `innerText.txt` după „Pie” lângă „note”/„medii”/„materii” — singura închidere e pentru **Line** („Un grafic Line pentru note pe materii … nu e alegerea potrivita!”, atomul 3). Pentru Pie nu există; ba chiar pasul 6 întreabă „Care materie are bara/felia cea mai mare?”, tratând felia ca informație validă. → Explorarea nu e închisă; semnalarea rămâne, gravitate *important* (nu blocant: elevul poate învăța regula corect din atomi).

**B. „Anatomia fără bare” (atomul 6).**
- *Alternativa 1:* artefact al randării fără ecran (CSS neîncărcat, pagină pe `file://`).
- *Observația:* pagina e servită prin http, restul stilurilor se aplică (captura are culori, chenare), iar `getComputedStyle` dă `0px` pentru barele cu `height: 89%` într-un `.chart-bar-group` fără înălțime (CSS `lesson-atomic.css:6144`, fără `height`). → Nu e artefact; e procent dintr-un părinte fără înălțime.
- *Alternativa 2:* barele apar după o animație/hover.
- *Observația:* CSS-ul `.chart-bar` are doar `transition: opacity`, nicio animație de înălțime; măsurat după 1,5 s. → Respinsă.

**C. „Lipirea 7.2 pe ro-RO”.**
- *Alternativa:* Excel ar putea transforma „7.2” altfel decât .NET (de ex. să-l păstreze ca text, nu ca dată).
- *Observația:* am randat **ambele** variante; în niciuna graficul nu arată notele (`lipire_roRO.pdf`, `lipire_text.pdf`). Deosebirea exactă (dată vs text) se află doar pe un PC din laborator → rămâne `depinde_de_necunoscut: true`.
