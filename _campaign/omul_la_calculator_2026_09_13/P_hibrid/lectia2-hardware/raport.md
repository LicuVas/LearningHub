# Raport — Componentele hardware (clasa a V-a, 5AM/5M)

Ora din plan: **vineri 02.10.2026, ora 4** — „Structura generală a unui sistem de calcul. Rolul componentelor hardware”.
Semnalări: 20 în total, dintre care 0 blocante, 9 importante și 11 minore. 10 vin din trecerea a doua (verificare prin execuție și surse). Detalii în `semnalari.json`; fiecare element al lecției e trecut în `harta_acoperirii.md`.

## Ce schimbă ora de mâine

1. **Nu încape în 50 de minute (S01).** Lecția are 3.570 de cuvinte. La 100-120 de cuvinte pe minut, cititul singur ține 30-36 de minute, iar pe lângă el mai sunt provocarea în 8 pași și 3 exerciții cu 10 cerințe. Pașii 4-5 ar trebui mutați la ora din 09.10.
2. **Provocarea de început trimite la „imaginile de mai jos”, dar pagina nu are nicio imagine (S03).** Am numărat: 0 `<img>` și 0 `<svg>`. Rămâne doar căutarea pe Google Images, cu termeni în engleză, iar navigarea web e planificată abia la ora 14. Fără internet sau fără laborator, activitatea nu se poate face. E nevoie de o planșă tipărită sau de piese reale.
3. **Întrebare despre sursa de alimentare (PSU) la pasul 1, deși PSU se explică abia la pasul 5 (S02).** Am testat în Playwright: un răspuns greșit rămâne blocat, iar clicul pe varianta corectă e refuzat.
4. **Lipsește „structura generală” pe care o cere ora (S04).** Nu există schema intrare → unitate centrală → ieșire/stocare, iar obiectivul 5 („cum colaborează componentele”) nu e predat nicăieri. În schimb, pasul 4 predă toată tema orei 5 (09.10).
5. **Un răspuns greșit primește două mesaje care se contrazic (S06).** Elevul vede „❌ Incorect” și imediat dedesubt „💡 Corect! Fara o sursa...”. Se întâmplă la toate cele 6 întrebări, fiindcă toate explicațiile încep cu „Corect!” (captura `executie/pas1_q2_feedback_gresit.png`).
6. **Pe calculatorul din laborator, elevul următor vede lucrul colegului (S05).** Am testat: după ce am salvat un răspuns și am redeschis pagina, textul colegului era încă acolo, bara arăta „5 din 5” și nu exista niciun buton de reset.
7. **Afirmație falsă despre GHz (S07).** Lecția scrie „3 GHz executa 3 miliarde de operatii pe secunda”. E exact ideea greșită pe care Wikipedia o numește „gigahertz myth” (text brut preluat cu curl): frecvența singură nu arată câte operații face procesorul.

## Importante (nu schimbă mersul orei, dar trebuie reparate)

- **S08 — Lecția nu are nicio diacritică.** Am numărat 0 caractere ă, â, î, ș, ț în conținut, deși specificația sitului (r.401) le cere în text.
- **S09 — Rezolvarea Ex.2 nu răspunde la cerință.** Enunțul cere și „care are capacitate mai mare”, dar tabelul din rezolvare dă viteza, păstrarea datelor și rolul. Capacitatea lipsește.

## Minore (grupate)

- **Neconcordanțe în lecție:**
  - S10: nota din Ex.3 spune că GB „NU au fost predați”, dar pasul 2 dă 4-32 GB și 256 GB-2 TB, iar pasul 5 dă 500-750 W. Unitățile de măsură vin abia la ora 6.
  - S12: provocarea cere 5 categorii, lecția are 4, iar șablonul oferă 3, în engleză.
  - S14: analogiile se contrazic (CPU e „profesorul” la pasul 1 și „clasa” la pasul 5; stocarea e „dulapul” și apoi „caietul”).
  - S13: modemul nu se potrivește regulii de ieșire din lecție („calculatorul îți transmite ȚIE”).
- **Formulări imprecise:**
  - S15: „fișierele din RAM”.
  - S20: dispozitivele de intrare-ieșire lucrează „în același timp”.
  - S17: fluxul din cheia Ex.3 (intrare → CPU → RAM) n-are ieșirea la capăt.
- **Interfață:** S11 — mesajul „Răspunde corect ... pentru a continua” e fals, pentru că și un răspuns greșit deblochează pasul următor (testat).
- **Față de plan:**
  - S16: Ex.3 propune Paint, care vine abia la ora 18.
  - S19: linkul de la final „Lecția 3 — Software” nu urmează ordinea din plan.
  - S18: tab-ul „Performance” din Task Manager are alt nume pe un Windows în română.

## Ce n-am putut verifica și de ce

- **S18 — numele tab-ului din Task Manager pe Windows în română.** Nu am avut un text brut Microsoft în română, iar limba Windows din laborator e necunoscută.
- **Dacă sala are internet.** Dotarea e necunoscută, așa că S03 rămâne „important”, nu „blocant”. La Izvoare sau Dumbrava Roșie, fără laborator, provocarea nu se poate face deloc.
- **Timpul de citire.** Viteza de 100-120 de cuvinte pe minut e o estimare pentru un elev de clasa a V-a, nu am măsurat-o pe copii.
- **„SSD pornește în 10-15 s față de 1-2 min” și cache-ul de 8 MB.** Cifrele sunt plauzibile ca ordin de mărime, dar nu le-am verificat pe o sursă datată și nu le-am semnalat.
- **Dacă lecția merge pe hârtie.** Doar am citit-o, nu am tipărit-o. Pașii 1-5, întrebările și exercițiile merg tipărite; provocarea cu imagini și extensia cu Task Manager nu merg.
