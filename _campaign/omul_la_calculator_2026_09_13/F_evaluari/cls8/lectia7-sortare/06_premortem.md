# 06 — Pre-mortem (U14) și explicații alternative (U13)

„Ora de sortare din 17.11.2026 (Izvoare) / 20.11.2026 (Brauner) a eșuat. De ce?”
Schița de mai jos a fost scrisă după pasul 1; fiecare motiv are acum verificarea făcută.

## U14 — cinci motive, fiecare verificat

1. **La Izvoare nu există calculatoare.**
   *Verificare:* `B_context_real.md` §3 — ipoteza de lucru „fără laborator”. Lecția are 0 variante pe hârtie; Încearcă, Ex. 1 și Ex. 2 cer Excel. **Rezultat: se poate ține pe hârtie**, și e chiar un bun plan A: 6 cartonașe (nume + notă + clasă) pe bancă, elevii le „sortează” cu mâna pe două niveluri, apoi fac capcana (mută doar cartonașele cu note) și văd ruperea. Ex. 3 e deja fără Excel. Nu se poate verifica fără sală dacă există un proiector pentru atomi.
2. **Elevul rupe tabelul la Ex. 2 („Adauga coloana A1 = Nr”).**
   *Verificare:* făcut literal în openpyxl → 0 nume rămase (`produs_elev/ex2_literal_A1_Nr.xlsx`, `u5_reproducere.txt` §B); inserarea de coloană: 0 apariții în lecțiile M1 cls8. **Confirmat.**
3. **Tabelul-model din atomul 4 nu se potrivește cu datele.**
   *Verificare:* sortare Python pe datele din bonus/Ex. 2 vs tabelul din HTML → 5 din 6 rânduri diferă; Dan, Andrei, Carla au altă notă/clasă (`u5_reproducere.txt` §A). **Confirmat.**
4. **Comenzile în engleză nu există pe Excel în română.**
   *Verificare:* Microsoft Support ro-ro, text brut: „Date”, „Sortare și filtrare”/„Sortare & filtrare”, „Adăugare nivel”, „Extindeți selecția” (`surse/sort_ro.txt`). **Confirmat pentru documentație; ce limbă are laboratorul — nu se poate fără sală**, pentru că dotarea sălii 1 TIC e necunoscută.
5. **Nu încape în 50 de minute.**
   *Verificare:* poarta calculează din `03_pasi.json` și cuvintele lecției (vezi `log.json` → `timp_estimat_minute`). Rezultatul porții: **nu încape** la ritmul provizoriu, dar încape la ritm dublu → `important`, nu `blocant`.

## U13 — explicații alternative pentru semnalările grave

**A. Tabelul din atomul 4 („greșit”).**
- Alternativa 1: atomul 4 folosește intenționat alt set de date (alte clase și note), nu cel din Încearcă.
- Alternativa 2: e o greșeală de copiere (datele din bonus nu au fost folosite când s-a scris tabelul).
- *Observația care le deosebește:* dacă ar fi un set separat, atomul 4 ar trebui să-și dea datele inițiale. Am căutat în HTML: atomul 4 nu are niciun tabel inițial; singurele atribuiri de clasă sunt în bonus (r. 63) și Ex. 2 (r. 202), ambele „8A, 8B, 8A, 8B, 8A, 8B”; numele și mulțimea notelor {5..10} sunt identice, doar Andrei/Carla au notele inversate și Dan are altă clasă (`u5_reproducere.txt` §A). **Rezultat: alternativa 2.** Chiar dacă ar fi fost intenționat, elevul nu are cum să știe — efectul la oră e același.

**B. Ex. 2, „Adauga coloana A1 = Nr”.**
- Alternativa 1: autorul voia „inserează o coloană nouă înaintea coloanei A” și un elev de a VIII-a ar înțelege „Adaugă coloana” ca inserare.
- Alternativa 2: elevul scrie în celula A1, cum i s-a cerut la toate celelalte pași („In A1 scrie Elev”, „C1 = Clasa”).
- *Observația:* în aceeași listă, „Adauga coloana C1 = Clasa” înseamnă **scrie în C1** (C e goală) — aceeași formulare, două sensuri; iar inserarea de coloană nu e predată în nicio lecție M1 cls8 (0 apariții, `u5_reproducere.txt`). **Rezultat: formularea îl împinge pe elev spre alternativa 2.** Gravitatea rămâne `important` (nu `blocant`): un elev care observă că dispar numele se oprește și întreabă; ce face la oră trebuie notat.

**C. Criteriul (4) al Ex. 3 („după salvare doar coloana Index”).**
- Alternativa: autorul se gândea la „a salvat și a **închis** fișierul” — atunci Undo chiar nu mai există.
- *Observația:* enunțul spune doar „a sortat tabelul si a salvat fisierul. Acum vrea sa revina” (r. 593), fără „a închis”; tabelul din atomul 5 nu spune nicăieri că salvarea golește Undo; Microsoft: „You can undo changes, even after you have saved” (`surse/undo_en.txt`). **Rezultat: enunțul permite ambele citiri, criteriul acceptă doar una** → răspunsul corect „Ctrl+Z dacă e încă deschis” e depunctat.

**D. Semnalarea mecanică K (Ex. 2 și Ex. 3 „posibil nepotrivite”).**
- Alternativa 1: rezolvările sunt mutate între exerciții.
- Alternativa 2: fals-pozitiv — Ex. 2 folosește aceleași 6 nume ca Ex. 1 (de aici „shuffled”), Ex. 3 are o schiță scurtă (overlap mic).
- *Observația:* potrivire punct cu punct enunț ↔ rezolvare (`04_a_doua_cale.json`, ultimul rând). **Rezultat: alternativa 2**, ambele fals-pozitive; defectele reale sunt altele (B și C).
