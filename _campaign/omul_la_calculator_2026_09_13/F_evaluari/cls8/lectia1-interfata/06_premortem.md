# 06 — Pre-mortem (U14) și explicații alternative (U13)

## Schița (scrisă după pasul 1, înainte de a face sarcina)
Ora de 15/18.09.2026 a eșuat. De ce?
1. Elevii au citit 9 atomi și n-au mai apucat să deschidă Excel — lecția e lungă.
2. Rezolvările nu corespund exercițiilor; profesorul/elevul care verifică se încurcă.
3. Excel-ul din laborator e în română (sau e LibreOffice Calc): „Home”, „Rename”, „Sheet1” nu există pe ecran.
4. La Izvoare nu există calculatoare, iar lecția nu are o variantă pe hârtie.
5. Elevii fără cont Microsoft nu pot folosi „Excel Online”; fișierul salvat nu mai e găsit ora viitoare.

## Completat la pasul 5 — fiecare motiv cu verificarea făcută
| # | Motiv | Verificarea | Rezultat |
|--:|:--|:--|:--|
| 1 | Nu încape în oră | Poarta (`u5_reproducere.txt` §2) | **Confirmat:** pornire 8 + citire 28,8 + sarcină 24,8 = **61,7 min → nu încape**. La ritm dublu 34,8 min → încape; ritmurile sunt provizorii, deci **important**, nu blocant. Doar „Încearcă” + 9 atomi + Ex. 1 ≈ 45 min. |
| 2 | Rezolvările nu corespund | `u3_potrivire.py` pe HTML (nu pe randare) + `rezolvare_pliata_ex1.xlsx` executată | **Confirmat:** 0% / 4% / 4% din cuvintele rezolvărilor apar în cerințe; Ex. 1 → tabel de cumpărături pentru petrecere; Ex. 2 → erori de formule; Ex. 3 → ordinea operațiilor. Introduse de commitul `21b141a` (05.09.2026, „643 din 643 exercitii ramase au rezolvare model”, 82 de agenți). |
| 3 | Interfață în română / LibreOffice | Microsoft Support ro-ro, text brut (`surse/*.txt`, `04_mediu.md`) | **Confirmat pe documentație:** Foaie1, Redenumire, Pornire, Inserare, Formule, Date, caseta Nume. Ce e pe PC-urile din sala 1 TIC: **nu se poate fără sală**, pentru că nicio sursă din sistem nu spune ce Office și ce limbă are laboratorul. |
| 4 | Izvoare fără calculatoare | Grep `<img` în HTML = 0; nicio frază „pe hârtie/caiet” în innerText.txt | **Parțial confirmat:** lecția nu are nicio imagine a ferestrei Excel și nicio variantă fără calculator. Dar **conținutul se poate ține pe hârtie**: adresa celulei, intervalul (B2:D6 = 15 celule), catalogul pe caiet cu pătrățele (analogia din atomul 1 chiar asta propune), Name Box/Formula Bar pe o fișă tipărită cu captura ferestrei. Ce trebuie pregătit: o captură A4 etichetată a ferestrei Excel + grila A-F × 1-10 tipărită. Existența laboratorului la Izvoare: nu se poate fără sală. |
| 5 | Cont / salvare | Grep „salv” în innerText.txt (3 apariții, toate „Salveaza raspunsul” din pagină); „Excel Online (gratuit cu cont Microsoft)” | **Confirmat:** lecția nu cere niciodată salvarea registrului; singura alternativă la Excel instalat cere cont. Dacă PC-urile se resetează la repornire: nu se poate fără sală. |

## Explicații alternative pentru semnalările grave (U13)

### A. „Rezolvările aparțin altor exerciții” (cls8-l1-01)
- **Alternativa 1:** e un artefact al randării — `H_vede.py` pune textul pliat lângă alt exercițiu decât cel din HTML.
  **Observația care deosebește:** am citit structura din HTML, nu din randare: fiecare `<details class="practice-solution">` e în interiorul `<div class="practice-exercise" data-level=…>` al exercițiului respectiv (`u3_potrivire.py`, regex pe sursă). Rezultatul e același → **nu e artefact**.
- **Alternativa 2:** rezolvarea e intenționat un exercițiu-pereche („transfer” pe alt context).
  **Observația:** rezolvarea Ex. 1 spune „Tabel cu 5 produse (rand 2-6), coloane: A=Produs… E=Total cu discount 10%” și dă cifre finale (254,7 lei) — descrie un tabel concret care nu există în cerință (3 elevi, A-C); Ex. 3 vorbește de „Formula A” și „Formula B”, pe care cerința nu le conține. Nu e o pereche, e alt exercițiu. **Respinsă.**
- **Alternativa 3:** fișierul de dinainte de 03.09 avea rezolvările bune și o reparație ulterioară le-a mutat.
  **Observația:** `lectia1-interfata.html.bak_container_20260903` are 0 blocuri `practice-solution`; `git log -S "Baloane 20x1"` arată că textul a intrat o singură dată, în `21b141a` (05.09). Deci **au fost greșite de la generare**, nu stricate după.

### B. „5 din 9 întrebări cer ce nu s-a predat încă” (cls8-l1-02)
- **Alternativa 1:** e intenționat — întrebări de „anticipare” care pregătesc atomul următor.
  **Observația:** întrebarea se răspunde înainte de a debloca atomul următor, iar „Atenție! Răspunsul se blochează după selectare” (innerText r. 149) — o anticipare nu se notează cu blocare; și indiciile încep cu „Corect!” explicând conținutul, ca la o verificare. Mai mult, atomul 5 (panglica) întreabă de ștergerea foilor, predată abia la 9 — patru atomi distanță, nu „următorul”. **Respinsă.**
- **Alternativa 2:** elevul știe deja din „Încearcă” (misiunea practică de la început).
  **Observația:** „Încearcă” conține Name Box (pas 5) și Ctrl+End, dar **nu** adresa „C7” ca regulă, **nu** Formula Bar, **nu** ștergerea foilor (innerText r. 50-125). Explică doar întrebarea atomului 4 (Name Box); celelalte 4 rămân. Semnalarea rămâne, cu 4 întrebări sigure și 1 atenuată.

### C. „Numele de meniu doar în engleză” (cls8-l1-04)
- **Alternativa:** laboratorul are Excel în engleză și atunci lecția e corectă.
  **Observația care ar deosebi:** ce limbă are Excel-ul pe un PC din sala 1 TIC — **nu se poate face fără sală** → semnalarea e `depinde_de_necunoscut: true`, gravitate maximă „important”, iar schimbarea propusă (ambele nume) e corectă în ambele variante.

### D. „Nu încape în oră” (cls8-l1-03)
- **Alternativa:** elevii de a VIII-a citesc mai repede decât 125 de cuvinte/minut sau sar peste analogii.
  **Observația:** la ritm dublu (poarta) ora încape (34,8 min) → gravitatea coborâtă la „important”; ce se întâmplă de fapt se vede doar la oră (întrebare pentru Vasile la U11).
