# 06 — Pre-mortem (U14) + explicații alternative (U13)

Schița (5 motive) a fost scrisă imediat după pasul 1; mai jos, fiecare motiv cu verificarea făcută.

## U14 — Ora de 15.09 / 18.09 a eșuat. De ce?

1. **La Izvoare nu există calculatoare, iar lecția nu are nicio imagine a ferestrei Word.**
   Verificare: `u12_sensibilitate.txt` → `<img> in HTML=0`; capturile `pas_02.png` (fereastra descrisă doar în cuvinte). Pe hârtie, „bara de titlu / Ribbon / bara de stare” nu au ce arăta. **Confirmat** pentru partea „lecția n-are imagini”; existența laboratorului la Izvoare **nu se poate verifica fără sală, pentru că** întrebarea e deschisă în vault din 06.09.
2. **Nu încape în 50 de minute.**
   Verificare: `u12_sensibilitate.txt` — ritm provizoriu: 8 + 40,5 citire + 40,3 sarcină = **88,8 min**; doar teoria + întrebările = 44,8 min; la ritm dublu 48,4 min. Lecția are 11 atomi (spec-ul cere 4-8, `LESSON_SPECIFICATION.md:752`). **Confirmat.**
3. **Elevul caută „Home”, „Quick Access Toolbar”, „Show Below the Ribbon” și nu le găsește.**
   Verificare: surse Microsoft ro-ro (`03_pasi.json` pașii 3, 6, 7): în română = „Pornire”, „bara de instrumente Acces rapid”, „Afișare dedesubtul Panglicii”. Plus contradicția internă Quick Print (`03_jurnal_sarcina.md`). **Confirmat pe documentație; limba din laborator nu se poate verifica fără sală, pentru că** nimeni n-a notat-o.
4. **Fișierul salvat „pe Desktop” dispare până la ora 3.**
   Verificare: am căutat în lecție orice alternativă (stick/folderul clasei/nume cu numele elevului): `innerText.txt` rândurile 700-710 — doar „pe Desktop”, fără nume de elev în numele fișierului (`Exercitiu1_Interfata.docx` — 20 de elevi pe PC-uri comune ar suprascrie același nume). **Nu se poate verifica restaurarea la repornire fără sală, pentru că** dotarea e necunoscută.
5. **Elevii citesc 20-30 de minute și nu deschid Word-ul.**
   Verificare: primul „Deschide Microsoft Word” apare la rândul 703 din 793 al `innerText.txt`, după ~3.600 de cuvinte de teorie (`u12_sensibilitate.txt`); `ecran_prima_vedere.png` = titlu + bare de progres + definiție, nimic de făcut. **Confirmat.**

## U13 — pentru fiecare semnalare gravă: altă explicație + observația care le deosebește

| Semnalare | Explicația alternativă | Observația care le deosebește | Rezultat |
|:--|:--|:--|:--|
| Nu încape în oră | (a) Lecția e gândită pe două ore (ora 2 + ora 3) sau teoria se citește acasă | Caut în text vreo împărțire („acasa”, „ora urmatoare”, „doua ore”, „tema pentru”) | Grep: **0 potriviri** — nicio împărțire declarată. Alternativa respinsă |
| | (b) Ritmul provizoriu al porții e prea lent | Recalculez la ritm dublu și la ritm de adult | 48,4 / 39,5 min: încape doar dacă un elev de 13 ani citește ca un adult și nu greșește nimic. Semnalarea rămâne, cu nota de sensibilitate |
| Indiciul Quick Print „din Ribbon” | Poate în unele versiuni Quick Print chiar e pe panglică | Ce spune chiar lecția în altă parte | Atomul 8: „comenzi care nu apar direct in Ribbon, precum Save As, Quick Print”; Provocarea: Quick Print se adaugă „folosind doar sageata ... (Customize Quick Access Toolbar)”. Lecția se contrazice singură → confirmat |
| Diacritice 0,0 | Au fost scoase intenționat pentru compatibilitate (codare, fonturi) | Pagina are `lang=ro`, UTF-8, iar „riști” se afișează corect; spec-ul permite ASCII doar în `<title>` și nume de fișiere (rândul 400) | Nu e o constrângere tehnică → confirmat ca abatere de la normă |
| Meniuri în engleză | Office-ul din laborator e în engleză, deci lecția e corectă acolo | Limba Office-ului din sala 1 TIC | **Nu se poate observa fără sală** → semnalarea e `depinde_de_necunoscut: true`, `important`, cu schimbare pe ambele variante |
| Lecția nu se poate ține la Izvoare | Există totuși un videoproiector/un PC al profesorului | Răspunsul doamnei Archip/Chifu | Nu se poate observa → întrebare pentru Vasile (U17 NESIGUR) |
