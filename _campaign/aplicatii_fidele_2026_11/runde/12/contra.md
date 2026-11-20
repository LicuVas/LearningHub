# Runda 12 · contra (pasul 4) — constructorul 1

**PENTRU planul (P1→P3→P2→P4→P5 în powerpoint.js, liste desenate din referință prin motorul comun):** fiecare GRAV are acum
referința lui (11 suprafețe noi + 13 scenarii reale + `acoperire_r11.fapte`), deci reparația se poate face fără nicio etichetă
scrisă de mână: listele se desenează cu `pang.deseneaza` din `date/powerpoint.json` regenerat, iar starea se compară cu
scenariile reale (O4). Modelul KeyTips există deja de două ori (word.js, excel.js) și critica l-a acceptat acolo.

**ÎMPOTRIVA:** volumul (5 GRAV pe un fișier de 1190 de rânduri) cere mai mult decât un singur context; orice bucată lăsată la
jumătate e mai rea decât una neîncepută (o paletă care se deschide dar nu colorează = tot comandă moartă). Și O3 — numărul pe
care suplimentul îl cere să scadă — nu se mișcă din biblioteca PowerPoint (cadru.md, presupunerea 1): munca se vede doar în O4
și în proba mea, nu în O3.

**Adevărul incomod (cel mai puțin sigur):** ținta `diapozitiv` a scenariilor (clic dreapta pe „un loc gol”, clic pentru forma
nouă) e jucată de rulator pe CENTRUL elementului; ca să treacă pe Title Slide, elementul țintei trebuie să aibă centrul într-un
loc gol (colțul de jos-dreapta, 97 % × 97 % — punctul real din scenarii_real/powerpoint-fundal-aplica-la-toate.json › cum).
E o alegere de geometrie a țintei, nu un comportament dovedit; un critic o poate citi ca „țintă croită pe rulator”. O scriu
explicit în diferente.md și gata_pentru_critic.md.

**Hotărârea:** merg pe plan, în ordinea suplimentului, cu `stare_autor.md` la zi după fiecare bucată, ca predarea să fie curată.
