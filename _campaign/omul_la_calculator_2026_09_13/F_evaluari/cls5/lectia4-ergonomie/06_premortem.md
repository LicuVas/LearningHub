# 06 — Pre-mortem (U14) + explicații alternative (U13)

Schiță scrisă imediat după citirea înapoi (pasul 1); completată la pasul 5 cu verificările.

## „Ora de vineri 18.09 a eșuat. De ce?” — 5 motive, fiecare cu verificarea

1. **Nu încape în 50 de minute, iar ora cere și normele de securitate din lecția 5.**
   Verificare făcută: poarta calculează 8 min pornire + 36 min citire (3.239 cuvinte ÷ 90/min) + sarcina din `03_pasi.json` → vezi ieșirea porții (nu încape la ritm provizoriu; la ritm dublu încape). Plus: ora 2 din plan are și „Normele de securitate…”, care nu sunt în lecția 4 (`01_citit_inapoi.md`, `curriculum.json`). **Confirmat.**
2. **Elevii „învață” o regulă greșită: 20 de pași = 6 metri.**
   Verificare făcută: `u5_verifica.py` → `u5_iesire.json` A1 — lecția scrie de 5 ori „20 (de) pasi”; sursa (CCOHS, text brut `surse/ccohs_eye_discomfort.txt`) spune „6 metres (20 feet)”. Feet = picioare (unitatea de 30,48 cm), nu pași. Pasul implicit al lecției: 0,30 m. **Confirmat.**
3. **Checklistul cere poziții pe care mobilierul din laborator nu le permite** (scaun fix, masă de adult, monitor fix pe unitate).
   Nu se poate verifica fără sală, pentru că dotarea sălii „1 (TIC)” e necunoscută (`B_context_real.md` §3). Sursa spune că soluția e scaun reglabil + suport de picioare (`surse/ccohs_chair_adjusting.txt`: „Use a footrest if you cannot place your feet flat on the floor”). → `anexa.ergonomie_contra_mobilierului_real` = întrebare pentru Vasile.
4. **Exercițiile scrise se pierd / nu se pot face în oră:** trei răspunsuri lungi tastate de copii de 11 ani, plus Ex. 2 cere „reminder-e pe telefon”, poze, aplicații descărcate.
   Verificare făcută: `u7_salvare_raspuns.py` → `u7_salvare_iesire.json`: răspunsul rămâne doar în `localStorage` al acelui browser; alt profil = gol. `u5_iesire.json` A5: 7 rânduri cer telefon / descărcare / poză. **Confirmat** (salvarea); telefonul la oră = întrebare pentru Vasile.
5. **Copilul care greșește la verificare vede „Corect!”.**
   Verificare făcută: Playwright, răspuns greșit la pasul 1 → „❌ Incorect. Raspunsul corect este marcat cu verde.” urmat de „💡 Corect! Ergonomia este…” și „💡 Perfect! La fiecare 45-60 minute…” (`u5_iesire.json` B). **Confirmat, a treia lecție la rând.**

## U13 — explicații alternative pentru semnalările grave

**A. „20 de pași ≈ 6 metri” (semnalarea cls5-l4-01)**
- Explicația mea: traducere greșită a lui *20 feet* (unitatea) ca „20 de pași”.
- Alternativa 1: autorul a vrut intenționat „pași” ca unitate ușoară pentru copii, și a ales 6 m ca aproximare. Observația care le deosebește: dacă ar fi intenționat, 20 de pași ar trebui să dea ~6 m; un pas de 30 cm nu e pasul unui copil de 11 ani care merge. Calculul (`u5_iesire.json` A1: 6/20 = 0,30 m) arată că cele două cifre nu se potrivesc între ele → oricare ar fi intenția, textul se bate cap în cap. Iar sursa folosește exact tripleta 20 min / 20 s / 20 feet = 6 m → traducerea e explicația mai probabilă.
- Alternativa 2: există o variantă a regulii în „pași”. Căutat în sursele descărcate (AAO, CCOHS): nu apare; CCOHS spune „20 feet”.

**B. Reminder-ele la 15:00, 17:00, 19:00 pentru regula „la fiecare 20 de minute” (cls5-l4-02)**
- Explicația mea: exercițiul contrazice regula pe care o predă (interval 120 min, `u5_iesire.json` A2).
- Alternativa: exercițiul se referă la momentele în care elevul stă la calculator acasă, câte o sesiune scurtă, iar reminder-ul pornește sesiunea. Observația care le deosebește: textul cerinței — „Seteaza 3 reminder-e pe telefon pentru regula 20-20-20” — și rezolvarea model — „3 reminder-e pentru regula 20-20-20, de exemplu 15:00, 17:00, 19:00” — nu spun nicăieri „la începutul sesiunii” și nici nu mai pomenesc intervalul de 20 de minute. Citit de un copil, modelul spune că 3 reamintiri pe zi respectă regula. Alternativa respinsă pe text.

**C. „Corect!” după răspuns greșit (cls5-l4-03)**
- Alternativa: e artefactul scriptului (a ales un răspuns „corect” din greșeală). Observația: `B_variante_gresite_alese` = „Programul care creeaza imagini”, „Nu sunt necesare, pot sta cat vreau” — evident greșite; motorul afișează „❌ Incorect” înainte → răspunsul a fost înregistrat ca greșit, iar indiciul care urmează începe cu „Corect!”. Alternativa respinsă.
