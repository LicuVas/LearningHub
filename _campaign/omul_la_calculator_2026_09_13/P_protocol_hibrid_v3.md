# Protocolul hibrid v3 — „citesc tot, apoi fac ce contează”
<!-- 13.09.2026. Născut din comparația oarbă O_comparatie_AB.md: v2 a adus precizie 100% (0 false) dar a pierdut
     acoperire (3 vs 8 probleme importante unice față de un audit obișnuit). „A sări” are două axe; v3 le separă în
     două treceri cu buget propriu, ca una să nu mănânce din cealaltă. -->

Evaluezi O lecție de TIC (LearningHub, gimnaziu) ca un profesor care o ține mâine. Scrii în română, limbaj simplu.
**Nu citești nimic din `C:\00\Projects\LearningHub\_campaign\`** în afara acestui fișier, a uneltelor `H_vede.py` / `H_randeaza.py`
și a folderului tău de ieșire (ai fi influențat de alte evaluări).

Context real (fapte, nu presupuneri):
- Planul anului: `C:\00\Projects\Info_Gimnaziu_2026\planificari\` (`Calendar_ore_*.md`, `Planificare_calendaristica_clasa_*.md`).
- Programa + standardele 2026: `C:\00\AI_0\data\informatica_gimnaziu\curriculum.json`. Specificația sitului: `C:\00\Projects\LearningHub\LESSON_SPECIFICATION.md`.
- Sala: la Brauner există un laborator (dotarea — versiune Office, limbă, setare regională — NECUNOSCUTĂ); la Izvoare/Dumbrava Roșie ipoteza e că NU există laborator (lecția trebuie să poată fi ținută și pe hârtie).
- Fapte deja verificate pe text brut Microsoft: Word ro „fila Pornire”, „Inserați”; Excel ro NU traduce numele funcțiilor (SUM, AVERAGE); separatorul `;`/`,` ține de setarea regională (necunoscută). **WebFetch NU e sursă** (dă rezumate inventate): citatele web se iau cu `curl -sL -A "Mozilla/5.0" URL` + extragerea textului.

## Trecerea 1 — ACOPERIREA (citesc tot, ca un recenzent atent) · ~40% din efort

1. `python C:/00/Projects/LearningHub/_campaign/omul_la_calculator_2026_09_13/H_vede.py <lectia.html> <OUT>/vede` — apoi citești `vede/innerText.txt` INTEGRAL, pe felii (≤250 de rânduri). Uită-te la 3-4 capturi (primul ecran, un pas, exercițiile).
2. Scrie `<OUT>/harta_acoperirii.md`: un tabel cu **fiecare** element al lecției — fiecare atom (pas), fiecare întrebare, fiecare exercițiu, fiecare rezolvare/indiciu, fiecare tabel/cifră/exemplu numeric, recapitularea, obiectivele — cu coloanele: *element · ce afirmă/cere pe scurt · verificat cum (citit / recalculat / comparat cu X / sursă) · problemă? (nu / da → id)*.
   Nicio linie nu are voie să rămână necompletată. **Un element necitit = o gaură, nu un „e ok”.**
3. Pentru fiecare element, întrebările recenzentului: e corect la fond? se contrazice cu altă parte a lecției? cere ceva nepredat încă (în lecție SAU în planul anului)? cheia/rezolvarea se potrivește cu enunțul? cifrele ies? termenul e explicat? e pe nivelul copilului?
4. Rezultat: lista largă de semnalări candidate (inclusiv minore).

## Trecerea 2 — OMUL LA CALCULATOR (fac, verific, aduc norma din afară) · ~60% din efort

Pe **toate** semnalările candidate importante/blocante din trecerea 1, și apoi pe lecție ca întreg:
1. **Fac sarcina.** Fiecare exercițiu practic se execută cu unelte reale (Word → python-docx; Excel → openpyxl + `H_randeaza.py xlsx` pentru valori recalculate; PowerPoint → python-pptx; pași din pagină → Playwright headless; operații cu fișiere → pe disc într-un folder de test). Randezi cu `H_randeaza.py pdf` și te uiți. Încerci și **varianta greșită** pe care ar face-o un copil (fără `$`, Tab în loc de marcator, ordinea pașilor inversată).
2. **Verific pe a doua cale** fiecare semnalare importantă: recalculare independentă, sursă primară (text brut), comparație cu altă parte a lecției. O semnalare care nu se poate verifica rămâne, dar marcată `neverificat` și nu poate fi `blocant`.
3. **Ce vede doar omul** (adaugă semnalări noi, fiecare cu dovadă):
   - ora din plan: data, ce cere planul la ora aceea, ce ia lecția din alte ore (în urmă sau înainte);
   - timpul real: cuvinte de citit + pași de făcut față de 50 de minute minus pornirea;
   - sala: merge fără calculator (Izvoare)? ce presupune despre versiune/limbă (dacă depinde de necunoscut → maxim `important`, schimbarea propusă acoperă ambele variante);
   - norma din afară: diacritice (măsurate), fapte din lumea reală (TVA, recomandări de sănătate, parole) pe sursă datată, programa/standardele;
   - unde se salvează lucrul elevului, ce se întâmplă pe un calculator folosit de două clase, elevul fără cont.
4. **Filtrul de zgomot:** nu elimina minorele, dar pune-le la final, grupate.

## Ce livrezi

- `<OUT>/semnalari.json`: listă de `{"id", "ce", "unde_citat" (citat exact din innerText.txt), "gravitate": "blocant|important|minor", "verificat": "executat|sursa|recalculat|citit|neverificat", "dovada" (valoare observată / comanda+ieșirea / URL+citat), "schimba_ora": "da|nu", "ce_trebuie_diferit", "trecerea": 1|2}`.
- `<OUT>/raport.md`: întâi **ce schimbă ora de mâine** (maxim 7, fiecare cu dovada într-o frază), apoi importantele, apoi minorele grupate, apoi „ce n-am putut verifica și de ce”.
- `harta_acoperirii.md` completă.

Căi absolute în Bash, fără `cd`; scripturi Python cu backslash-uri prin Write, nu heredoc. Nu modifici lecția.
Returnezi ≤10 rânduri: numărul de semnalări pe gravitate, câte din trecerea 2, câte executate/verificate, cele 3 care schimbă cel mai mult ora.
