# 03 — Jurnalul sarcinii (U1, U11, U7)

## Constrângerile elevului pe care l-am jucat (U11)
- 14 ani, clasa a VIII-a, **prima oră la calculator din an** (ora 1 a fost evaluarea inițială). N-a lucrat în Excel; poate a văzut un tabel la tata pe telefon.
- Nu știe englezește de meniu: „Rename”, „Sheet1”, „Formula Bar” sunt pentru el cuvinte de recunoscut după formă, nu după sens.
- Nu vede rezolvările (sunt pliate) și nu știe că acolo e altceva decât ce i se cere.
- Citește încet (ritmul provizoriu al porții: 125 de cuvinte/minut); tastează ~70 de caractere/minut.
- Are 50 de minute din care ~8 se duc pe pornire, logare, deschidere program. Nu are cont Microsoft personal (la 14 ani, probabil nu).
- Nu știu ce Excel e în laborator (versiune, limbă, setare regională) — și nici el.

## Ce am făcut, pas cu pas
1. **„Încearcă” (5 minute).** Am creat registrul, am scris antetele și cei 5 elevi din caseta „Structura catalogului tău” (`produs_elev/incearca_catalog.xlsx`). LibreOffice a recalculat verificările mele: media lui Ion = 8,67 (aceeași cifră pe care o folosește întrebarea atomului 6 — bine legat), suma Nota1 = 40, 15 celule în B2:D6. Pasul cu Name Box („Scrie F20 în Name Box”) vine **înainte** ca lecția să explice ce e Name Box (atomul 6). Există un pliant de ajutor „Nu găsești Name Box?”, bun.
   - Blocaj probabil: „Redenumește foaia Sheet1” — într-un Excel în română foaia se cheamă **Foaie1**, iar comanda **Redenumire** (Microsoft Support ro-ro, text brut în `surse/redenumire_ro.txt`).
   - „5 minute” pentru 6 pași + bonus, la primul contact cu Excel, e optimist: doar tastarea datelor e ~60 de caractere, plus pornirea.
2. **Cei 9 atomi.** Am răspuns la cele 9 întrebări (parcurgerea `parcurgere.json`: 0 blocaje, dar eu știam deja răspunsurile). Jucând elevul: la atomul 1 („Ce este Microsoft Excel?”) întrebarea e despre adresa C7, care se predă la atomul 3; la atomul 5 (panglica) întrebarea e despre ștergerea unei foi, predată la atomul 9. Elevul care citește cinstit atomul și apoi întrebarea nu găsește răspunsul în ce tocmai a citit — ghicește. Pentru că răspunsul „se blochează după selectare”, o ghicitoare greșită îl marchează greșit. Scriptul `u3_potrivire.py` a confirmat: 5 din 9 întrebări (atomii 1, 3, 4, 5, 6).
3. **Exercițiul 1 (minim).** Am construit catalogul cu 3 elevi (`ex1_catalog.xlsx`). Pasul 4 cere prima și ultima celulă cu note: am calculat din foaie B2 și C4 — egal cu „Răspuns așteptat”. Dar răspunsul e scris **vizibil imediat sub întrebare**, deci elevul nu mai are ce descoperi. Apoi am deschis „Vezi rezolvarea”: **un tabel cu pizza, sucuri, baloane și discount 10%**. Am executat și rezolvarea (`rezolvare_pliata_ex1.xlsx`): aritmetica e bună (E7 = 254,7), dar e al altui exercițiu.
4. **Exercițiul 2 (standard).** M25 cu Name Box, Ctrl+Home, selecție A1:E10, redenumire în „Navigare”, foaie nouă „Test”, 3 nume (`ex2_navigare.xlsx`). Blocaje: (a) lecția spune „adaugă o a doua foaie numită Test”, dar butonul + creează „Foaie2”/„Sheet2”, care trebuie apoi redenumită — pas nescris; (b) întrebarea finală „Ctrl+End — pe care celulă ajungi?” are două răspunsuri după foaia activă (Test → A3, Navigare → M25), iar lecția nu dă răspunsul; (c) „Vezi rezolvarea” conține **erori de formule** (`#DIV/0!`, `#NAME?`, `=SUMM`) — nimic despre navigare. Elevul care vrea să se verifice nu poate.
5. **Exercițiul 3 (performanță).** Am scris ca elev cele 4 răspunsuri (~620 de caractere, `produs_elev/ex3_raspunsuri_elev.txt`). Rezolvarea pliată vorbește despre „Formula A” și „Formula B” și ordinea operațiilor — formule care nu apar nicăieri în cerință. Întrebarea 4 („poți recupera foaia cu Undo?”) cere un fapt pe care nu l-am găsit în paginile Microsoft descărcate (pas `interfata`, `gasit: neclar`).
6. **Salvarea.** Nicăieri în lecție nu se cere salvarea fișierului Excel (singurele „salvează” sunt butoanele „Salvează răspunsul” din pagină). Catalogul făcut la oră se pierde, deși ora 3 din plan („Operații cu registrul”) ar putea continua pe el.
7. **U7.** Am redeschis toate fișierele într-un proces Python nou (`u7_redeschide.py` → `07_redeschis.json`): foile „Catalog”, „Navigare”, „Test” există; M25 = „Am ajuns aici!”; valorile recalculate de LibreOffice sunt cele așteptate.

## Unde se blochează un începător (ipoteze AI, nu observate — de verificat la oră)
1. Caută „Sheet1” și „Rename” într-un Excel în română (Foaie1 / Redenumire).
2. Nu știe ce e Name Box la pasul 5 din „Încearcă” (se predă abia la atomul 6).
3. Răspunde greșit la întrebarea atomului 1 (adresa C7) pentru că n-a fost predată încă.
4. Deschide „Vezi rezolvarea” la Ex. 1 și crede că a greșit tot, pentru că vede alt tabel.
5. La Ex. 2 apasă + și rămâne cu „Foaie2”, nu „Test”.
6. Fără cont Microsoft nu poate folosi „Excel Online”, singura alternativă oferită.
