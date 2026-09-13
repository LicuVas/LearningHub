# 06 — Pre-mortem (U14) + explicații alternative (U13)

Schiță scrisă după pasul 1, completată la pasul 5 cu verificările făcute.

**Ora de pe 02.10.2026 (Brauner, 6A) a eșuat. De ce?**

## 1. Nu s-a ajuns la exerciții
- **Verificare făcută:** `u12_sensibilitate.txt` — lecția are 4.235 de cuvinte; doar pornirea + citirea = 50,4 min (ritm provizoriu cls6), fără niciun clic. Totul: 193,8 min (100,9 la ritm dublu). Drumul minim (Încearcă tu + Ex.1): 95,4 min (51,7 la ritm dublu). **Confirmat.**
- **U13 — altă explicație:** poate că elevii nu citesc tot textul (sar peste analogii și tabele), deci citirea reală e mai mică. **Observația care le deosebește:** cât text e obligatoriu ca să răspunzi la întrebările-poartă? Întrebarea din atomul 1 („Ce este Slide Master?”) cere textul atomului 5, deci elevul care sare textul nu poate trece corect; iar Ex.1 cere numele a 6 aspecte din tabelul atomului 2. Chiar și numai Ex.1 fără citire (32 min pași + 8 pornire = 40) lasă 10 minute pentru tot restul. Alternativa nu salvează ora.

## 2. Elevii s-au blocat la întrebările-poartă
- **Verificare făcută:** `u3_iesire.json` → `intrebari_vs_predare`: din 10 întrebări, doar 1 întreabă despre atomul în care stă; 4 întreabă ceva predat abia mai târziu (Slide Master în atomul 1, gradient și teme în atomul 2, Format Background în atomul 3). Răspunsul se blochează după alegere („Raspunsul se blocheaza dupa selectare”). **Confirmat pe lecție.**
- **U13 — altă explicație:** poate motorul amestecă întrebările între atomi la încărcare și fișierul le are la locul lor. **Observația:** am citit `data-quiz` direct din HTML (`u9_quiz.json`, script `u9_quiz.py`): atomul 1 are în fișier întrebarea despre Slide Master, atomul 2 pe cea despre gradient. Defectul e în fișier, nu în motor.
- **A doua alternativă:** elevii ghicesc (3-4 variante) și merg mai departe. Posibil, dar atunci întrebarea nu mai verifică nimic — ceea ce tot defect rămâne.

## 3. „Nivelul standard” a fost imposibil pentru majoritatea
- **Verificare făcută:** textul lecției spune la atomul 5 „Nu este evaluata la nivel minim sau standard”, iar Exercițiul 2 (Nivel standard) e integral „Slide Master Challenge”; Ex.4 cere și el Slide Master (`u3_iesire.json` → `slide_master`). Am executat Ex.2 (`produs_elev/Slide_Master_Ex2.pptx`): principiul merge (inițiala apare pe toate 3 paginile randate), dar cere 5 comenzi noi (Slide Master, Text Box, Header & Footer, Font, Close Master View), dintre care Header & Footer nu e predată deloc în atomi. **Confirmat.**
- **U13 — altă explicație:** poate „standard” din titlul exercițiului e doar o etichetă și profesorul notează standardul după Ex.1. **Observația:** `09_checklist.md`/spec cere explicit exerciții „minim/standard/performanta”; elevul vede eticheta „Nivel standard” pe ecran (innerText rândul 836). Eticheta e ce citește copilul, deci contradicția ajunge la el.

## 4. La Izvoare nu s-a putut ține deloc
- **Nu se poate verifica fără sală**, pentru că dotarea de la Izvoare e necunoscută (`B_context_real.md` §3: ipoteza „fără laborator”). Ce am verificat pe lecție: 0 etichete `<img>` în HTML (`u9_quiz.json` → `img: 0`), toate sarcinile încep cu „Deschide PowerPoint” / „Creeaza”, Ex.3 cere internet și Word. Nu există nimic de pus pe hârtie.
- **Plan A pentru Izvoare (propunere):** fișă A4 cu 6 dreptunghiuri-schiță; elevii desenează pe caiet cele 7 diapozitive „Pasiunile Mele” alegând aspectul fiecăruia din tabel (Titlu / Titlu și conținut / Două coloane / Comparație / Imagine cu legendă / Doar titlu), apoi le numerotează în ordinea logică (reordonare pe hârtie cu bilețele). Asta acoperă chiar „structura prezentării” din ora 4.

## 5. Elevii n-au găsit butoanele
- **Verificare făcută:** numele din lecție sunt în engleză; în documentația Microsoft ro-ro (text brut, `surse/s_*.txt`): Coordonator de diapozitive, Închidere vizualizare coordonator, Formatare fundal, Umplere gradient, Se aplică pentru toate, Antet și subsol, Dublare diapozitiv, fila Proiectare, iar temele au nume traduse („tema Bază”, „tema Integrală”). **Confirmat pe documentație; depinde de limba Office-ului din laborator (necunoscută).**
- **U13 — altă explicație:** laboratorul are Office în engleză și totul se potrivește. **Observația care decide:** se vede doar deschizând PowerPoint pe un PC din sala 1 TIC — întrebarea e în anexă. Varianta propusă (ambele nume) funcționează în ambele cazuri.

## Semnalări grave cu explicație alternativă (U13, sumar)
| Semnalare | Alternativa | Observația făcută | Rezultat |
|:--|:--|:--|:--|
| cls6-l2-01 timp | elevii nu citesc tot | întrebările-poartă cer textul; Ex.1 singur = 40 min cu pornirea | rămâne |
| cls6-l2-02 întrebări mutate | motorul amestecă | `data-quiz` citit din HTML | rămâne |
| cls6-l2-03 Slide Master la standard | eticheta nu contează | eticheta e pe ecranul elevului | rămâne |
| cls6-l2-04 ora din plan | lecția 2 = orele 4-6 comasate intenționat | planul are ore separate și lecția 3 („text-imagini”) e mapată la ora 6 | rămâne (important) |
