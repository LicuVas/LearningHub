# 03 — Jurnalul sarcinii (U1, U11) · lectia5-tabele

## Constrângerile elevului pe care îl joc (U11)
- 13 ani, clasa a VII-a, a văzut Word-ul în 4 ore (lecțiile 1-4); **n-a inserat niciodată un tabel**.
- Nu știe engleză de meniu: „Table Design”, „Layout”, „Merge Cells”, „AutoFit Window”, „Banded Columns” sunt cuvinte noi; dacă Word-ul e în română vede „Proiectare tabel”, „Aspect tabel”, „Potrivire automată”, „Borduri și umbrire” — lecția nu le scrie.
- Nu vede rezolvările (sunt pliate) și nu vede niciun tabel desenat în lecție (0 `<table>`, 0 `<img>`): „grila 4x3”, „săgeata neagră în jos”, „pătratul cu săgeți în cruce” sunt doar descrise în cuvinte.
- Are 50 de minute, din care ~8 se duc pe pornire; lecția are 8.447 de cuvinte (73,5 min de citit la 115 cuv/min).
- Tastatura: nu știe dacă e setată pe română; tastează fără diacritice pentru că așa scrie lecția.

## Ce am făcut, pas cu pas (produs_elev/, randat_docx/)
1. **Ex.1 Orar școlar.** Tabel 6×8 — antet + 7 ore încap exact (verificat). Am tastat ~430 de caractere și ~47 de Tab. Stil de grilă, umbrire pe materii, centrare, AutoFit. **Blocaj de ordine:** pasul 5 pune un stil cu antet colorat, pasul 9 cere alt fundal pentru antet — elevul refacе antetul la final. **Contradicție:** „Rezultat asteptat” și indiciul promit coloane „distribuite egal” cu AutoFit Window; atomul 7 al aceleiași lecții spune că AutoFit Window distribuie „proportional”, iar egalizarea e Distribute Columns. Pe un tabel proaspăt inserat coloanele sunt deja egale, deci elevul nu vede nicio diferență și nu înțelege la ce folosește butonul. Indiciul „Pauza 10:50-11:10” se suprapune cu ora 11:00-11:50 din orarul pe care tocmai l-a scris.
2. **Ex.2 Browsere.** 5×5, umbrire semafor, Header Row + First Column + Banded Columns, coloana 1 = 3,5 cm, restul 3,10 cm. **Blocaj real:** pasul 7 „Imbina celulele din randul de sus al coloanei Observatii” — pe rândul de sus coloana are o singură celulă; nu ai ce îmbina. Am ales îmbinarea verticală a rândurilor 2-5 (singura cu sens pentru „o notă generală”); rezolvarea nu pomenește pasul, deci elevul nu află ce se voia. „Banded Columns” peste umbrirea semafor se vede puțin — elevul nu observă efectul bifei.
3. **Ex.3 Formular.** 4×8 cu îmbinări (celule pe rând 1,2,2,2,4,1,1,2), rândul 7 ≥ 3 cm, contur 2 pt, fără linii interioare, linii gri 0,5 pt sub câmpuri; încape pe o pagină Portrait. Merge, dar e cel mai lung exercițiu (~62 de clicuri) și cere dialogul „Borders and Shading” pe laturi separate. Rezolvarea spune „Randurile 2-5: imbina cate 2 celule” și imediat „randul Clasa/Scoala ramane pe 4 celule separate” (rândul 5 e în ambele), iar rândul 8 (Data/Semnatura) lipsește din rezolvare.
4. **Provocarea.** 5 rânduri „Nume, Nota, Absente” → Convert Text to Table (Commas) → Merge pe primul rând → titlu. **Rezultat observat:** celula-titlu conține datele primului elev („Popescu Ion / 8 / 2”) plus titlul; tabelul mai are doar 4 elevi pe rânduri (docx redeschis + PDF LibreOffice). Lecția nu spune să inserezi un rând deasupra — deși atomul 6 exact asta face în „Exemplu practic de Merge” (Insert Row Above, apoi Merge). Elevul „bun”, care urmează provocarea literal, strică tabelul.
5. **Salvare + Print Preview.** Indiciile dau nume de fișiere (Orar_Scolar.docx etc.) și „intr-un folder dedicat” — mai bine decât la lecția 4, dar folderul nu e numit, iar indicația stă în „Indicii utile”, nu în pași.
6. **Casetele de răspuns** de sub exerciții cer „minim 10 caractere”, dar enunțurile nu spun ce să scrie elevul acolo (nu există întrebare) — al treilea loc de lucru, fără sarcină.

## Unde se blochează un începător (ipoteze AI — de verificat la oră)
- Nu găsește „Layout”: pe Microsoft 365 fila se cheamă „Table Layout”, în română „Aspect tabel”; mai există și fila „Layout/Aspect” a paginii (atomul 11 le folosește pe amândouă sub același nume).
- Apasă Ctrl+A ca să selecteze tabelul (cum scrie în rezumat) și formatează tot documentul.
- Apasă Backspace pe tabelul selectat (crezând că șterge doar textul) și pierde tabelul.
- Ex.2 pasul 7: rămâne blocat sau îmbină antetul „Observatii” cu altceva.
- Provocarea: pierde datele primului elev în titlu.
