# Raport — evaluator independent, joc `calculator-v` („Misiunea Tehnician”, clasa a V-a, V-U1)

15.09.2026. 7 niveluri, 35 de întrebări, diplomă cu 5 pași. Toate citite și comparate cu materialul unității; jocul jucat pe iPhone SE (temă luminoasă) și Pixel 7 (temă întunecată), cu greșelile unui copil.

**Pe scurt:** jocul e bun și fidel materialului. Toate cele 35 de chei sunt corecte, fiecare întrebare are o singură variantă corectă, faptele importante țin pe surse primare (ENIAC 1945 și cât o cameră, IBM PC 1981, iPhone 2007, DVD 4,7 GB, byte = 8 biți, 20–20–20 = 20 de picioare ≈ 6 m, ecranul la ~50–66 cm). Am găsit 14 semnalări: 0 blocante, 4 importante, 10 minore. Am reparat 4 (explicații sau text care se contraziceau). Poarta după reparații: **TRECUT** (70 de întrebări pe 2 telefoane).

## Ce schimbă ora (de decis de profesor)
1. **S04 · „sistem de operare” nepredat.** Termenul apare în N1 și în două întrebări din N4, dar nicio pagină nu spune ce e. Propunere: în N4, „Software = programele: sistemul de operare (de ex. Windows), jocurile, aplicațiile”.
2. **S06 · filmul de 8 GB și FAT32.** Pe un stick sau un card de 32 GB formatat FAT32 (formatul cu care vin de obicei cardurile de 32 GB) un fișier de 8 GB nu se copiază, fiindcă limita e de 4 GB pe fișier (Wikipedia FAT, SD card). Jocul și exercițiul din material spun doar „încape”. Profesorul decide dacă păstrează simplificarea sau adaugă o notă.

## Reparate (detalii în `modificari.md`)
- S01: explicația spunea că fiecare pas din istorie a micșorat calculatorul, dar mașinile mecanice erau mici și ENIAC cât o cameră.
- S05: pagina N6 spunea că „fiecare treaptă e ×1024” și pornea șirul de la bit (bit → byte e ×8).
- S02: explicația spunea că datele intră „mereu prin tastatură”.
- S03: explicația spunea că la 50–70 cm „ochii se odihnesc”, ceea ce contrazice explicația de la 20–20–20.

## Minore, grupate
- **Potrivirea cu materialul:** S07 materialul spune „20 de pași”, dar corect e 6 m, ca în joc, deci de corectat materialul. S08 lipsește perioada tranzistorului și a circuitului integrat. S09 memoria USB e intrare-ieșire în material, dar în joc apare doar ca stocare. S12 lipsește petabyte-ul (standardul îl pomenește).
- **Limbaj:** S10 „cablu băgat” (colocvial).
- **Nuanță:** S11 salvarea automată face distractorul „pe hard disk” parțial adevărat (neverificat).
- **Motor / poartă (nu ține de joc):** S13 „1 stele din 3”. S14 poarta a picat o dată fără nicio schimbare (clic expirat, probabil pe bara restrânsă), apoi a trecut.

## Pedagogie și programă
- Nivelurile urmează lecțiile 2–6 în ordine. Nivelul final e sarcina de nivel Avansat din materialul lecției 6. Paginile au 60–110 cuvinte și propoziții scurte, potrivite la 10–11 ani. Tipurile de întrebări sunt amestecate (tf, choice, classify, match, order, hunt). Distractorii sunt greșeli reale (16:4 și 16×4 la calculul fotografiilor, scanerul pus la ieșire, oprirea de la priză).
- Provocarea de pe diplomă se poate face în laborator. Windows afișează spațiul în unități binare, deci calculul cu 1024 se potrivește. La Izvoare/Dumbrava (fără laborator) pașii 1 și 3 nu se pot face. E o limită firească a provocării, nu o greșeală.

## Ce n-am putut verifica
- OSHA și CCOHS (ergonomie) au blocat curl, iar pagina Microsoft despre FAT32 a întors doar schelet. Am folosit în schimb AAO, AOA și Wikipedia (text brut, în `surse_extrase.json`).
- Dimensiunea Pascalinei: ro.wikipedia a blocat. Am folosit aritmometrul (tot mașină mecanică) ca dovadă că mașinile mecanice încăpeau pe masă.
- Setările de salvare automată și formatul stickurilor din laborator.

Fișiere: `harta_acoperirii.md`, `semnalari.json`, `modificari.md`, `joaca_jurnal.txt`, `capturi\`, `surse.py`, `surse2.py`, `joaca.py`.
